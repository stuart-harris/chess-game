import { ChessSide } from './ChessSide.js';
import { Coord } from './Coord.js';
import { ChessMove } from './ChessMove.js';
import { ChessBoard } from './ChessBoard.js';
import { ChessEngine } from './ChessEngine.js';

// Play a chess game
export class ChessGame {
    board = new ChessBoard();
    engine = new ChessEngine();
    // ChessMove
    moves = [];
    availableMoves = [];
    chessBots = [];
    isPlaying = false;
    isCheck = false;
    isCheckmate = false;
    // The currently selected square
    selected = Coord.empty;
    // Coord The square the last move came from
    fromLocation = Coord.empty;
    // Coord The square where an invalid selection has happened
    invalidLocation = Coord.empty;
    // ChessSide.WHITE_SIDE or ChessSide.BLACK_SIDE
    turn = undefined;

    constructor() {

    }

    clone() {
        // shallow

        let obj = new ChessGame();

        obj.board = this.board;
        obj.engine = this.engine;
        obj.moves = this.moves;
        obj.availableMoves = this.availableMoves;
        obj.chessBots = this.chessBots;
        obj.isPlaying = this.isPlaying;
        obj.isCheck = this.isCheck;
        obj.isCheckmate = this.isCheckmate;
        obj.selected = this.selected;
        obj.fromLocation = this.fromLocation;
        obj.invalidLocation = this.invalidLocation;
        obj.turn = this.turn;
    
        return obj;
    }

    start() {
        this.turn = ChessSide.WHITE_SIDE;
        this.isCheck = false;
        this.isCheckmate = false;
        this.selected = Coord.empty;
        this.fromLocation = Coord.empty;
        this.invalidLocation = Coord.empty;
        this.turn = ChessSide.WHITE_SIDE;
        this.isPlaying = true;
        let board = this.board.clone();
        board.setStartingPosition();
        this.updateBoard(board);
    }

    reset() {
        this.isPlaying = false;
        this.turn = "";
        this.isCheck = false;
        this.isCheckmate = false;
        this.selected = Coord.empty;
        this.fromLocation = Coord.empty;
        this.invalidLocation = Coord.empty;
        this.moves = [];
        let board = new ChessBoard();
        this.updateBoard(board);
    }

    updateBoard(board) {
        this.board = board;
    }

    isSquareSelected() {
        return !this.selected.isEmpty();
    }

    selectLocation(location) {
        if (this.isCheckmate) {
            this.invalidLocation = location;
            return;
        }
        // Is a square already selected?
        if (this.isSquareSelected()) {
            // Same square?
            if (this.selected.isEqual(location)) {
                // Remove selection
                this.selected = Coord.empty;
            }
            else {
                // Attempt to move
                this.attemptMove(this.selected, location);
            }
        }
        else {
            let piece = this.board.getPieceAtLocation(location);
            if (!!piece && piece.man.side === this.turn) {
                // Select this square
                this.selected = location;
                this.invalidLocation = Coord.empty;
            } else {
                this.invalidLocation = location;
            }
        }
    }

    attemptMove(from, to) {
        let piece = this.board.getPieceAtLocation(from);
        let previousMove = this.getPreviousMove();
        // Attempt to move
        if (this.engine.canMove(this.board, piece, this.turn, from, to, previousMove, false)) {
            this.performMove(piece, from, to);
            this.fromLocation = from;
            this.selected = Coord.empty;
            this.invalidLocation = Coord.empty;
        } else {
            this.invalidLocation = to;
        }
    }

    addMove(piece, taken, from, to, indicator) {
        this.moves.push(new ChessMove(piece, taken, from, to, indicator));
    }

    getPreviousMove() {
        return this.moves.length ? this.moves[this.moves.length - 1] : null; 
    }

    performMove(piece, from, to) {
        let board = this.board.clone();
        // TODO: Use Engine.performMove(...) which returns a ChessMoveResult: new board and a move, isCheck and isCheckmate
        // TODO: Use Engine.getTakenPiece(...)
        let taken = this.board.getPieceAtLocation(to);
        board.move(from, to);
        let otherSide = ChessSide.getOtherSide(this.turn);
        let isCheck = this.engine.isCheck(board, otherSide);
        let isCheckmate = isCheck ? this.engine.isCheckmate(board, otherSide) : false;
        let indicator = ChessMove.getIndicator(isCheck, isCheckmate, false, false);
        // TODO: return ChessMove from board.move() or the piece taken
        this.addMove(piece, taken, from, to, indicator);
        this.isCheck = isCheck;
        this.isCheckmate = isCheckmate;
        if (isCheckmate) {
            this.isPlaying = false;
        }
        else {
            this.turn = otherSide;
        }
        this.updateBoard(board);
    }
}