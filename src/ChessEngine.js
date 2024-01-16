import { Coord } from './Coord';
import { ChessSide } from './ChessSide.js';
import { ChessMan } from './ChessMan';
import { ChessPiece } from './ChessPiece.js';
import { ChessBoard } from './ChessBoard.js';
import { ChessMove } from './ChessMove.js';
import { ChessMoveResult } from './ChessMoveResult.js';

// Evaluate and manipulate a chess board
export class ChessEngine {
    /**
     * Is the kind of the specified side in check?
     * @param {ChessBoard} board 
     * @param {string} side 
     * @returns true if the kind of the side is in check
     */
    isCheck(board, side) {
        let king = board.getKingOfSide(side);
        return !!king && this.isThreatened(board, side, king.location);
    }

    /**
     * Is the kind of the specified side in check and cannot move or have something moved in front?
     * @param {ChessBoard} board 
     * @param {string} side 
     * @returns true if the king of the side is in checkmate
     */
    isCheckmate(board, side) {
        let isCheck = this.isCheck(board, side);
        if (!isCheck) return false;
        let result = true;

        let pieces = board.getPiecesOfSide(side);

        for(var i = 0; result && i < pieces.length; ++i) {
            let piece = pieces[i];
            let moves = this.calculateAvailableMovesForPiece(board, piece);
            result = moves.every(m => this.wouldMoveBeCheck(board, side, m.from, m.to));
        }

        return result;
    }

    /**
     * Perfom the move. Assumes that canMove has returned true.
     * @param {ChessBoard} board The chess board
     * @param {ChessPiece} piece The piece moving 
     * @param {Coord} from The current location of the piece
     * @param {Coord} to The new location of the piece
     * @returns {ChessMoveResult} The result of the move
     */
    performMove(board, piece, from, to) {
        board = board.clone();
        // TODO: Use Engine.getTakenPiece(...)
        let taken = this.board.getPieceAtLocation(to);
        board.move(from, to);
        let otherSide = ChessSide.getOtherSide(piece.man.side);
        let isCheck = this.isCheck(board, otherSide);
        let isCheckmate = isCheck ? this.isCheckmate(board, otherSide) : false;
        let indicator = ChessMove.getIndicator(isCheck, isCheckmate, false, false);
        // TODO: return ChessMove from board.move() or the piece taken
        let move = new ChessMove(piece, taken, from, to, indicator);
        let turn = undefined;
        if (!isCheckmate) {
            turn = otherSide;
        }
        return new ChessMoveResult(board, move, turn, isCheck, isCheckmate);
    }

    /**
     * If the move was made would the side be in check?
     * @param {ChessBoard} board 
     * @param {string} side
     * @param {Coord} from 
     * @param {Coord} to 
     */
    wouldMoveBeCheck(board, side, from, to) {
        let newBoard = board.clone();
        newBoard.move(from, to);
        return this.isCheck(newBoard, side);
    }

    /**
     * Can the piece move
     * @param {ChessBoard} board 
     * @param {ChessPiece} piece 
     * @param {string} turn ChessSide.BLACK_SIDE or ChessSide.WHITE_SIDE 
     * @param {Coord} from 
     * @param {Coord} to 
     * @param {ChessMove} previousMove the last move made, is null for the first move. Required for en-passant.
     * @param {bool} isThreatCheck is being called as part of a threat check. Required to ignore straight pawn moves.
     * @returns true if the piece can move
     */
    canMove(board, piece, turn, from, to, previousMove, isThreatCheck) {
        // No piece to move?
        if (!piece) return false;
        // Piece is not on the board? 
        if (!piece.isOnBoard()) return false;
        // Is not the piece side's turn
        if (piece.man.side !== turn) return false;
        // Not a valid square to move to
        if (!to.isValid()) return false;

        // What is at the location?
        let taken = board.getPieceAtLocation(to);

        // Anything at the location?
        if (!!taken) {
            // Is it one of the same side?
            if (taken.man.side === turn) return false;

            // Is it the king?
            if (taken.man.type === ChessPiece.PIECE_KING) return false;
        }

        // The type of piece we are moving
        let pieceType = piece.man.type;

        let can = false;

        if (pieceType === ChessMan.PIECE_KING) {
            can = this.isKingMove(board, piece, from, to);
        }
        if (pieceType === ChessMan.PIECE_QUEEN) {
            can = this.isStraightOrDiagonalMove(from, to) && !this.isPieceBetween(board, from, to);
        }
        if (pieceType === ChessMan.PIECE_BISHOP) {
            can = this.isDiagonalMove(from, to) && !this.isPieceBetween(board, from, to);
        }
        if (pieceType === ChessMan.PIECE_KNIGHT) {
            can = this.isKnightMove(from, to);
        }
        if (pieceType === ChessMan.PIECE_ROOK) {
            can = this.isStraightMove(from, to) && !this.isPieceBetween(board, from, to);
        }
        if (pieceType === ChessMan.PIECE_PAWN) {
            can = this.isPawnMove(board, from, to, piece, taken, previousMove, isThreatCheck) &&
            !this.isPieceBetween(board, from, to);
        }

        if (can) {
            let wouldBeCheck = this.wouldMoveBeCheck(board, turn, from, to);
            can = !wouldBeCheck;
        }

        return can;
    } 

    isStraightMove(fromCoord, toCoord) {
        return fromCoord.row === toCoord.row || fromCoord.col === toCoord.col;
    }

    isDiagonalMove(fromCoord, toCoord) {
        return Math.abs(fromCoord.row - toCoord.row) === Math.abs(fromCoord.col - toCoord.col);
    }

    isStraightOrDiagonalMove(fromCoord, toCoord) {
        return this.isStraightMove(fromCoord, toCoord) || this.isDiagonalMove(fromCoord, toCoord);
    }

    isKnightMove(fromCoord, toCoord) {
        var vDist = Math.abs(fromCoord.row - toCoord.row);
        var hDist = Math.abs(fromCoord.col - toCoord.col);
        return (vDist === 1 && hDist === 2) || (vDist === 2 && hDist === 1);
    }
    
    
    isKingMove(board, king, fromCoord, toCoord) {
        return (this.isOneSquareMove(fromCoord, toCoord) ||
            this.isCastleMove(board, king, fromCoord, toCoord)) &&
            !this.isThreatened(board, king.man.side, toCoord);
      }
    
    isOneSquareMove(fromCoord, toCoord) {
        return !fromCoord.isEqual(toCoord) &&
            Math.abs(fromCoord.row - toCoord.row) < 2 &&
            Math.abs(fromCoord.col - toCoord.col) < 2;
    }

    isCastleMove(board, king, fromCoord, toCoord) {
        if (king.moved || (!(toCoord.col === 3 || toCoord.col === 7))) return false;
    
        var backRow = board.getBackRow(king.man.side);

        // rook location
        var rookLocn = new Coord(backRow, toCoord.col === 3 ? 1 : 8);

        var piece = board.getPieceAtLocation(rookLocn);
        // is the rook there and not moved and the same colour?
        if (!piece ||
            piece.hasMoved ||
            piece.man.side !== king.man.side ||
            piece.man.type !== ChessMan.PIECE_ROOK) {
            return false;
        }

        // is there free space on the board between to perform the castle?
        var blocked = this.isPieceBetween(board, fromCoord, rookLocn);

        // to do: check if the spaces where the king moves are threatened
        // var threatened = this.areSpacesThreatened(fromCoord, toCoord)

        return !blocked;
    }

    /**
     * Is the move a pawn move
     * @param {*} board 
     * @param {*} fromCoord 
     * @param {*} toCoord 
     * @param {*} piece 
     * @param {*} takenPiece 
     * @param {bool} isThreat Are we checking if the move is a taking move, if so, don't allow moving straight
     * @returns 
     */
    isPawnMove(board, fromCoord, toCoord, piece, takenPiece, previousMove, isThreat) {
        var forwardDir = piece.man.side === ChessSide.WHITE_SIDE ? 1 : -1;
        var isSameCol = fromCoord.col === toCoord.col;
        var isSide1 = Math.abs(fromCoord.col - toCoord.col) === 1;
        
        if (isSameCol) {
            var inFrontSq = new Coord(fromCoord.row + forwardDir, fromCoord.col);
            if(!!takenPiece || board.isPieceAtLocation(inFrontSq)) {
                // Cannot move forward, there is a piece in the way
                return false;
            }
        }

        // isEnPassant()
        var rowDiff = toCoord.row - fromCoord.row;
        var isForward1 = rowDiff === forwardDir;
        var isForward2 = rowDiff === forwardDir * 2;

        // is the move to the side and 1 ahead and is there nothing there?
        if (isSide1 && !takenPiece && isForward1 && !!previousMove) {
            // is there a pawn 1 ahead of the "to" location that has just moved 2 places?
            // 
            var otherPawnToSq = new Coord(fromCoord.row, toCoord.col);
            //var enPassantFromSq = new Coord(fromCoord.row + forwardDir * 2, toCoord.col);
            var otherPawnPiece = board.getPieceAtLocation(otherPawnToSq);
            var otherSide = ChessSide.getOtherSide(piece.man.side);
            if (otherPawnPiece &&
                otherPawnPiece.man.side === otherSide &&
                otherPawnPiece.man.type === ChessMan.PIECE_PAWN &&
                otherPawnPiece.isFirstMove() &&
                otherPawnToSq.isEqual(previousMove.to)) {
                    // en-passant
                    return true;
                }
        }

        return (isSameCol && !takenPiece && (isForward1 || (!piece.moved && isForward2)) && !isThreat) ||
            (isSide1 && takenPiece && takenPiece.man.side !== piece.man.side && isForward1);
    }

     // Is there a piece on the board between the two locations?
    isPieceBetween(board, fromCoord, toCoord) {
        var dx = toCoord.col == fromCoord.col ? 0 : toCoord.col > fromCoord.col ? 1 : -1;
        var dy = toCoord.row == fromCoord.row ? 0 : toCoord.row > fromCoord.row ? 1 : -1;
        var moves = Math.max(Math.abs(toCoord.col - fromCoord.col), Math.abs(toCoord.row - fromCoord.row));
        for(var i = 1; i < moves; i++){
            var col = fromCoord.col + dx * i;
            var row = fromCoord.row + dy * i;
            var currSquare = new Coord(row, col);
            if (board.isPieceAtLocation(currSquare)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Is this square threatened? Used to test if the king is in or would be in check.
     * @param board The board
     * @param side The side who is threatened
     * @param square The square potentially threatened
     */
    isThreatened(board, side, square) {
        var otherSide = ChessSide.getOtherSide(side);
        var sidePieces = board.getPiecesOfSide(otherSide);
        return sidePieces.some(p => this.canMove(board, p, otherSide, p.location, square, null, true));
    }

    // *** Available moves ***
    calculateAvailableMovesForPiece(board, piece) {
        var moves = [];
        let pieceType = piece.man.type;
        if (pieceType === ChessMan.PIECE_PAWN) {
            moves = this.calculateAvailableMovesForPawn(board, piece);
        }
        if (pieceType === ChessMan.PIECE_ROOK) {
            moves = this.calculateAvailableMovesForRook(board, piece);
        }
        if (pieceType === ChessMan.PIECE_KNIGHT) {
            moves = this.calculateAvailableMovesForKnight(board, piece);
        }
        if (pieceType === ChessMan.PIECE_BISHOP) {
            moves = this.calculateAvailableMovesForBishop(board, piece);
        }
        if (pieceType === ChessMan.PIECE_QUEEN) {
            moves = this.calculateAvailableMovesForQueen(board, piece);
        }
        if (pieceType === ChessMan.PIECE_KING) {
            moves = this.calculateAvailableMovesForKing(board, piece);
        }

        moves = this.removeInvalidMoves(moves);

        return moves;
    }
    
    removeInvalidMoves(moves) {
        return moves.filter((m) => this.isValidMove(m));
    }
    
    isValidMove(m) {
        // Not valid if the piece being take is the kind
        if (m.taken && m.taken.man.type === ChessPiece.PIECE_KING) {
            return false;
        }

        return true;
    }

    calculateAvailableMovesForBishop(board, piece, distanceLimit) {
        // ChessMove
        let moves = [];
        let coord = piece.location;
    
        if (!distanceLimit) {
            distanceLimit = 8;
        }

        var to = coord.clone();
    
        let dc;
        let dr;
        for(var d = 0; d < 4; d++) {
            switch(d) {
                case 0: // northeast
                    dc = 1;
                    dr = -1;
                    break;
                case 1: // northwest
                    dc = -1;
                    dr = -1;
                    break;
                case 2: // southeast
                    dc = 1;
                    dr = 1;
                    break;
                case 3: // southwest
                    dc = -1;
                    dr = 1;
                    break;
            }

            var distance = 0;
            var blocked = false;
            for(var c = coord.col + dc, r = coord.row + dr;
                !blocked && c > 0 && c < 9 && r > 0 && r < 9 && distance < distanceLimit;
                c += dc, r += dr, distance++) {
                to = new Coord(r, c);
                var taken = board.getPieceAtLocation(to);
                if (!!taken) {
                    blocked = true;
                    if (taken.man.side !== piece.man.side) {
                        moves.push(new ChessMove(piece, taken, coord, to))
                    }
                } else {
                    moves.push(new ChessMove(piece, undefined, coord, to))
                }
            }
        }
    
        return moves;
    }
    
    calculateAvailableMovesForRook(board, piece, distanceLimit) {
        // ChessMove
        var moves = [];

        if (!distanceLimit) {
            distanceLimit = 8;
        }

        var coord = piece.location;
        var to = coord.clone();

        let dc;
        let dr;
        for(var d = 0; d < 4; d++) {
            switch(d) {
                case 0: // east
                    dc = 1;
                    dr = 0;
                    break;
                case 1: // west
                    dc = -1;
                    dr = 0;
                    break;
                case 2: // north
                    dc = 0;
                    dr = -1;
                    break;
                case 3: // south
                    dc = 0;
                    dr = 1;
                    break;
            }

            var blocked = false;
            var distance = 0;
            for(var c = coord.col + dc, r = coord.row + dr;
                !blocked && c > 0 && c < 9 && r > 0 && r < 9 && distance < distanceLimit;
                c += dc, r += dr, distance++) {
                to = new Coord(r, c);
                var taken = board.getPieceAtLocation(to);
                if (!!taken) {
                    blocked = true;
                    if (taken.man.side !== piece.man.side) {
                        moves.push(new ChessMove(piece, taken, coord, to))
                    }
                } else {
                    moves.push(new ChessMove(piece, undefined, coord, to))
                }
            }
        }

        return moves;
    }
    
    calculateAvailableMovesForKing(board, piece) {
        var moves = this.calculateAvailableMovesForRook(board, piece, 1);
        return moves.concat(this.calculateAvailableMovesForBishop(board, piece, 1));
    }

    calculateAvailableMovesForQueen(board, piece) {
        var moves = this.calculateAvailableMovesForRook(board, piece);
        return moves.concat(this.calculateAvailableMovesForBishop(board, piece));
    }

    calculateAvailableMovesForKnight(board, piece) {
        var moves = [];
        let coord = piece.location;

        let to;
        let dc;
        let dr;
        for(var d = 0; d < 8; d++) {
            switch(d) {
            case 0: dc = 2; dr = 1; break;
            case 1: dc = 1; dr = 2; break;
            case 2: dc = -2; dr = 1; break;
            case 3: dc = -1; dr = 2; break;
            case 4: dc = -2; dr = -1; break;
            case 5: dc = -1; dr = -2; break;
            case 6: dc = 2; dr = -1; break;
            case 7: dc = 1; dr = -2; break;
            }

            to = new Coord(coord.row + dr, coord.col + dc);
            if(!to.isValid()) continue;
            var taken = board.getPieceAtLocation(to);
            if (taken) {
                if (taken.man.side !== piece.man.side) {
                    moves.push(new ChessMove(piece, taken, coord, to))
                }
            } else {
                moves.push(new ChessMove(piece, undefined, coord, to))
            }
        }

        return moves;
    }

    calculateAvailableMovesForPawn(board, piece) {
        var moves = [];
        let coord = piece.location;
        var forwardDir = piece.man.side === ChessPiece.WHITE_SIDE ? 1 : -1;
        var to = new Coord(coord.row + forwardDir, coord.col);

        if (to.isValid()){
            var taken = board.getPieceAtLocation(to);
            if (!taken) {
                moves.push(new ChessMove(piece, undefined, coord, to))
            }
        }

        to = new Coord(coord.row + forwardDir, coord.col - 1);
        if (to.isValid()) {
            var taken = board.getPieceAtLocation(to);
            if (!!taken && taken.man.side !== piece.man.side) {
                moves.push(new ChessMove(piece, taken, coord, to));
            }
            
            // TODO: en passant
        }

        to = new Coord(coord.row + forwardDir, coord.col + 1);
        if (to.isValid()) {
            var taken = board.getPieceAtLocation(to);
            if (!!taken && taken.man.side !== piece.man.side) {
                moves.push(new ChessMove(piece, taken, coord, to));
            }

            // TODO: en passant
        }

        return moves;
    }

}