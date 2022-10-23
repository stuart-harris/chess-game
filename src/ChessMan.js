import * as ChessSide from './ChessSide.js';

export const PIECE_KING = "K";
export const PIECE_QUEEN = "Q";
export const PIECE_BISHOP = "B";
export const PIECE_ROOK = "R";
export const PIECE_KNIGHT = "N";
export const PIECE_PAWN = "P";

// A chessman.  A piece that is not on the board yet.
export class ChessMan {
    type = "";
    value = 0;
    text = "";
    side = "";
    constructor(type, side) {
        this.type = type;
        this.side = side;
        this.value = ChessMan.getValue(type);
        this.text = ChessMan.getText(type, side);
    }

    // Promote to the specified type
    promote(type) {
        this.type = type;
    }

    static getValue(type) {
        switch(type) {
            case PIECE_KING: return 200;
            case PIECE_QUEEN: return 9;
            case PIECE_BISHOP: return 3;
            case PIECE_KNIGHT: return 3;
            case PIECE_ROOK: return 5;
            case PIECE_PAWN: return 1;
        }
        return 0;
    }

    static getText(type, side) {
        if (side === ChessSide.BLACK_SIDE) {
            switch(type) {
                case PIECE_KING: return "&#x265A;";
                case PIECE_QUEEN: return "&#x265B;";
                case PIECE_BISHOP: return "&#x265D;";
                case PIECE_KNIGHT: return "&#x265E;";
                case PIECE_ROOK: return "&#x265C;";
                case PIECE_PAWN: return "&#x265F;";    
            }
        } else {
            switch(type) {
                case PIECE_KING: return "&#x2654;";
                case PIECE_QUEEN: return "&#x2655;";
                case PIECE_BISHOP: return "&#x2657;";
                case PIECE_KNIGHT: return "&#x2658;";
                case PIECE_ROOK: return "&#x2656;";
                case PIECE_PAWN: return "&#x2659;";    
            }
        }
        return "";
    }


}

export const WHITE_KING = new ChessMan(PIECE_KING, ChessSide.WHITE_SIDE);
export const WHITE_QUEEN = new ChessMan(PIECE_QUEEN, ChessSide.WHITE_SIDE);
export const WHITE_BISHOP = new ChessMan(PIECE_BISHOP, ChessSide.WHITE_SIDE);
export const WHITE_KNIGHT = new ChessMan(PIECE_KNIGHT, ChessSide.WHITE_SIDE);
export const WHITE_ROOK = new ChessMan(PIECE_ROOK, ChessSide.WHITE_SIDE);
export const WHITE_PAWN = new ChessMan(PIECE_PAWN, ChessSide.WHITE_SIDE);
export const BLACK_KING = new ChessMan(PIECE_KING, ChessSide.BLACK_SIDE);
export const BLACK_QUEEN = new ChessMan(PIECE_QUEEN, ChessSide.BLACK_SIDE);
export const BLACK_BISHOP = new ChessMan(PIECE_BISHOP, ChessSide.BLACK_SIDE);
export const BLACK_KNIGHT = new ChessMan(PIECE_KNIGHT, ChessSide.BLACK_SIDE);
export const BLACK_ROOK = new ChessMan(PIECE_ROOK, ChessSide.BLACK_SIDE);
export const BLACK_PAWN = new ChessMan(PIECE_PAWN, ChessSide.BLACK_SIDE);
