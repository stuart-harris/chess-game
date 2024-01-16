import { ChessBoard } from './ChessBoard';
import { ChessMove } from './ChessMove';

export class ChessMoveResult {
    // ChessBoard
    board = undefined;
    // ChessMove
    move = undefined;
    // The new turn
    turn = undefined;
    isCheck = false;
    isCheckmate = false;

    constructor(board, move, turn, isCheck, isCheckmate) {
        this.board = board;
        this.move = move;
        this.turn = turn;
        this.isCheck = isCheck;
        this.isCheckmate = isCheckmate;
    }
}