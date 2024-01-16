import { ChessSide } from './ChessSide.js';
import { ChessPiece } from './ChessPiece.js';
import { ChessMan } from './ChessMan.js';
import { Coord } from './Coord.js';

export class ChessBoard {
    pieces = [];

    constructor(pieces) {
        this.pieces = pieces || [];
    }

    // Create a deep copy of the board
    clone() {
        let pieces = this.pieces.map(p => p.clone());
        return new ChessBoard(pieces);
    }

    // reset the board to the starting position
    setStartingPosition() {
        this.pieces = ChessPiece.getStartingPieces();
    }

    getBackRow(side) {
        return side === ChessSide.WHITE_SIDE ? 1 : 8;        
    }
    getLastRow(side) {
        return side === ChessSide.WHITE_SIDE ? 8 : 1;        
    }

    // get the piece at the location
    getPieceAtLocation(location) {
        return this.pieces.find(p => p.location.isEqual(location));
    }

    isPieceAtLocation(location) {
        return this.pieces.some(p => p.location.isEqual(location));
    }

    /**
     * Get all the pieces on the board for the specified colour
     * @param {string} side 
     * @returns All the pieces on the board for the specified colour
     */
    getPiecesOfSide(side) {
        return this.pieces.filter(p => p.man.side === side && p.isOnBoard()).sort((a, b) => b.man.value - a.man.value);
    }

    getTakenPiecesOfSide(side) {
        return this.pieces.filter(p => p.man.side === side && p.isTaken()).sort((a, b) => b.man.value - a.man.value);
    }
    /**
     * Get all the pieces of the specified type on the board for the specified colour
     * @param {string} side 
     * @param {string} type 
     * @returns All the pieces of the specified type on the board for the specified colour
     */
    getPiecesOfSideAndType(side, type) {
        return this.pieces.filter(p => p.man.side === side && p.man.type === type);
    }

    getKingOfSide(side) {
        return this.pieces.find(p => p.man.side === side && p.man.type === ChessMan.PIECE_KING);
    }

    /**
     * Move the piece at fromLocation to toLocation
     * TODO: The ChessGame will do the taking using Engine.getTakenPiece(...)
     * @param {Coord} fromLocation 
     * @param {Coord} toLocation 
     */
    move(fromLocation, toLocation) {
        var piece = this.getPieceAtLocation(fromLocation);

        if (piece) {
            var taken = this.getPieceAtLocation(toLocation);
    
            // en-passant
            if (piece.man.type === ChessMan.PIECE_PAWN && !taken) {
                var isSide1 = Math.abs(fromLocation.col - toLocation.col) === 1;
                var forwardDir = piece.man.side === ChessSide.WHITE_SIDE ? 1 : -1;
                var rowDiff = toLocation.row - fromLocation.row;
                var isForward1 = rowDiff === forwardDir;
                if (isSide1 && isForward1) {
                    var enPassantToSq = new Coord(fromLocation.row, toLocation.col);
                    var enPassantPiece = this.getPieceAtLocation(enPassantToSq);
                    if (enPassantPiece.man.side !== piece.man.side &&
                        enPassantPiece.man.type === ChessMan.PIECE_PAWN) {
                        taken = enPassantPiece;
                    }
                }    
            }

            if (taken) {
                taken.take();
            }
    
            piece.moveTo(toLocation);
        }
    }
}