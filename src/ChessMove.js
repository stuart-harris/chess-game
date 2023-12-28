import { Coord } from './Coord.js';
import { ChessMan } from './ChessMan.js'

export class ChessMove {
    // ChessPiece
    piece = undefined;
    // ChessPiece
    taken = undefined;
    // From
    from = Coord.empty;
    // To
    to = Coord.empty;
    // Indicator for the move + for check, ++ for checkmate, "draw", "resigns", "e.p." for en passant.
    indicator = "";

    constructor(piece, taken, from, to, indicator) {
        this.piece = piece;
        this.taken = taken;
        this.from = from;
        this.to = to;
        this.indicator = indicator;
    }

    toString() {
        return (this.piece.man.type === ChessMan.PIECE_PAWN ? "" : this.piece.man.type) +
        this.from.toString() +
        (this.taken ? "x" : " ") +
        this.to.toString() +
        this.indicator;
    }

    static getIndicator(isCheck, isCheckmate, isDraw, isResign) {
        return (isCheckmate ? "++" : (isCheck ? "+" : (isDraw ? "draw" : (isResign ? "resigns" : ""))));
    }
}