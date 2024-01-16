import { ChessSide } from './ChessSide.js';

// A chessman.  A piece that is not on the board yet.
export class ChessMan {

    static PIECE_KING = "K";
    static PIECE_QUEEN = "Q";
    static PIECE_BISHOP = "B";
    static PIECE_ROOK = "R";
    static PIECE_KNIGHT = "N";
    static PIECE_PAWN = "P";
    

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

    clone() {
        return new ChessMan(this.type, this.side);
    }

    // Promote to the specified type
    promote(type) {
        this.type = type;
        this.value = ChessMan.getValue(this.type);
        this.text = ChessMan.getText(this.type, this.side);
    }

    static getValue(type) {
        switch(type) {
            case this.PIECE_KING: return 200;
            case this.PIECE_QUEEN: return 9;
            case this.PIECE_BISHOP: return 3;
            case this.PIECE_KNIGHT: return 3;
            case this.PIECE_ROOK: return 5;
            case this.PIECE_PAWN: return 1;
        }
        return 0;
    }

    static getText(type, side) {
        if (side === ChessSide.BLACK_SIDE) {
            switch(type) {
                case this.PIECE_KING: return "&#x265A;";
                case this.PIECE_QUEEN: return "&#x265B;";
                case this.PIECE_BISHOP: return "&#x265D;";
                case this.PIECE_KNIGHT: return "&#x265E;";
                case this.PIECE_ROOK: return "&#x265C;";
                case this.PIECE_PAWN: return "&#x265F;";    
            }
        } else {
            switch(type) {
                case this.PIECE_KING: return "&#x2654;";
                case this.PIECE_QUEEN: return "&#x2655;";
                case this.PIECE_BISHOP: return "&#x2657;";
                case this.PIECE_KNIGHT: return "&#x2658;";
                case this.PIECE_ROOK: return "&#x2656;";
                case this.PIECE_PAWN: return "&#x2659;";    
            }
        }
        return "";
    }


}

export const WHITE_KING = new ChessMan(ChessMan.PIECE_KING, ChessSide.WHITE_SIDE);
export const WHITE_QUEEN = new ChessMan(ChessMan.PIECE_QUEEN, ChessSide.WHITE_SIDE);
export const WHITE_BISHOP = new ChessMan(ChessMan.PIECE_BISHOP, ChessSide.WHITE_SIDE);
export const WHITE_KNIGHT = new ChessMan(ChessMan.PIECE_KNIGHT, ChessSide.WHITE_SIDE);
export const WHITE_ROOK = new ChessMan(ChessMan.PIECE_ROOK, ChessSide.WHITE_SIDE);
export const WHITE_PAWN = new ChessMan(ChessMan.PIECE_PAWN, ChessSide.WHITE_SIDE);
export const BLACK_KING = new ChessMan(ChessMan.PIECE_KING, ChessSide.BLACK_SIDE);
export const BLACK_QUEEN = new ChessMan(ChessMan.PIECE_QUEEN, ChessSide.BLACK_SIDE);
export const BLACK_BISHOP = new ChessMan(ChessMan.PIECE_BISHOP, ChessSide.BLACK_SIDE);
export const BLACK_KNIGHT = new ChessMan(ChessMan.PIECE_KNIGHT, ChessSide.BLACK_SIDE);
export const BLACK_ROOK = new ChessMan(ChessMan.PIECE_ROOK, ChessSide.BLACK_SIDE);
export const BLACK_PAWN = new ChessMan(ChessMan.PIECE_PAWN, ChessSide.BLACK_SIDE);
