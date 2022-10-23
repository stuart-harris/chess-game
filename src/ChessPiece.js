import { Coord, textToCoord } from "./Coord";
import * as ChessMan from "./ChessMan";

export const BLACK_SIDE = "Black";
export const WHITE_SIDE = "White";
export const PIECE_KING = "K";
export const PIECE_QUEEN = "Q";
export const PIECE_BISHOP = "B";
export const PIECE_ROOK = "R";
export const PIECE_KNIGHT = "N";
export const PIECE_PAWN = "P";
export const WHITE_KING = { piece: PIECE_KING, value: 200, text: "&#x2654;", side: WHITE_SIDE};
export const WHITE_QUEEN = { piece: PIECE_QUEEN, value: 9, text: "&#x2655;", side: WHITE_SIDE};
export const WHITE_BISHOP = { piece: PIECE_BISHOP, value: 3, text: "&#x2657;", side: WHITE_SIDE};
export const WHITE_KNIGHT = { piece: PIECE_KNIGHT, value: 3, text: "&#x2658;", side: WHITE_SIDE};
export const WHITE_ROOK = { piece: PIECE_ROOK, value: 5, text: "&#x2656;", side: WHITE_SIDE};
export const WHITE_PAWN = { piece: PIECE_PAWN, value: 1, text: "&#x2659;", side: WHITE_SIDE};
export const BLACK_KING = { piece: PIECE_KING, value: 200, text: "&#x265A;", side: BLACK_SIDE};
export const BLACK_QUEEN = { piece: PIECE_QUEEN, value: 9, text: "&#x265B;", side: BLACK_SIDE};
export const BLACK_BISHOP = { piece: PIECE_BISHOP, value: 3, text: "&#x265D;", side: BLACK_SIDE};
export const BLACK_KNIGHT = { piece: PIECE_KNIGHT, value: 3, text: "&#x265E;", side: BLACK_SIDE};
export const BLACK_ROOK = { piece: PIECE_ROOK, value: 5, text: "&#x265C;", side: BLACK_SIDE};
export const BLACK_PAWN = { piece: PIECE_PAWN, value: 1, text: "&#x265F;", side: BLACK_SIDE};
export const STARTING_PIECES = [
  { piece: WHITE_KING, location: textToCoord("e1")},
  { piece: WHITE_QUEEN, location: textToCoord("d1")},
  { piece: WHITE_BISHOP, location: textToCoord("c1")},
  { piece: WHITE_BISHOP, location: textToCoord("f1")},
  { piece: WHITE_KNIGHT, location: textToCoord("b1")},
  { piece: WHITE_KNIGHT, location: textToCoord("g1")},
  { piece: WHITE_ROOK, location: textToCoord("a1")},
  { piece: WHITE_ROOK, location: textToCoord("h1")},
  { piece: WHITE_PAWN, location: textToCoord("a2")},
  { piece: WHITE_PAWN, location: textToCoord("b2")},
  { piece: WHITE_PAWN, location: textToCoord("c2")},
  { piece: WHITE_PAWN, location: textToCoord("d2")},
  { piece: WHITE_PAWN, location: textToCoord("e2")},
  { piece: WHITE_PAWN, location: textToCoord("f2")},
  { piece: WHITE_PAWN, location: textToCoord("g2")},
  { piece: WHITE_PAWN, location: textToCoord("h2")},
  { piece: BLACK_KING, location: textToCoord("e8")},
  { piece: BLACK_QUEEN, location: textToCoord("d8")},
  { piece: BLACK_BISHOP, location: textToCoord("c8")},
  { piece: BLACK_BISHOP, location: textToCoord("f8")},
  { piece: BLACK_KNIGHT, location: textToCoord("b8")},
  { piece: BLACK_KNIGHT, location: textToCoord("g8")},
  { piece: BLACK_ROOK, location: textToCoord("a8")},
  { piece: BLACK_ROOK, location: textToCoord("h8")},
  { piece: BLACK_PAWN, location: textToCoord("a7")},
  { piece: BLACK_PAWN, location: textToCoord("b7")},
  { piece: BLACK_PAWN, location: textToCoord("c7")},
  { piece: BLACK_PAWN, location: textToCoord("d7")},
  { piece: BLACK_PAWN, location: textToCoord("e7")},
  { piece: BLACK_PAWN, location: textToCoord("f7")},
  { piece: BLACK_PAWN, location: textToCoord("g7")},
  { piece: BLACK_PAWN, location: textToCoord("h7")},
];

export class ChessPiece {
  // ChessMan
  man = null;
  // Place on the board
  location = Coord.empty;

  constructor(man, location) {
    this.man = man;
    this.location = location;
  }

  take() {
    this.location = Coord.empty;
  }

  static getStartingPieces() {
    return new [
      new ChessPiece(ChessMan.WHITE_ROOK, Coord.fromText("a1")),
      new ChessPiece(ChessMan.WHITE_KNIGHT, Coord.fromText("b1")),
      new ChessPiece(ChessMan.WHITE_BISHOP, Coord.fromText("c1")),
      new ChessPiece(ChessMan.WHITE_QUEEN, Coord.fromText("d1")),
      new ChessPiece(ChessMan.WHITE_KING, Coord.fromText("e1")),
      new ChessPiece(ChessMan.WHITE_BISHOP, Coord.fromText("f1")),
      new ChessPiece(ChessMan.WHITE_KNIGHT, Coord.fromText("g1")),
      new ChessPiece(ChessMan.WHITE_ROOK, Coord.fromText("h1")),
      new ChessPiece(ChessMan.WHITE_PAWN, Coord.fromText("a2")),
      new ChessPiece(ChessMan.WHITE_PAWN, Coord.fromText("b2")),
      new ChessPiece(ChessMan.WHITE_PAWN, Coord.fromText("c2")),
      new ChessPiece(ChessMan.WHITE_PAWN, Coord.fromText("d2")),
      new ChessPiece(ChessMan.WHITE_PAWN, Coord.fromText("e2")),
      new ChessPiece(ChessMan.WHITE_PAWN, Coord.fromText("f2")),
      new ChessPiece(ChessMan.WHITE_PAWN, Coord.fromText("g2")),
      new ChessPiece(ChessMan.WHITE_PAWN, Coord.fromText("h2")),
      new ChessPiece(ChessMan.BLACK_ROOK, Coord.fromText("a8")),
      new ChessPiece(ChessMan.BLACK_KNIGHT, Coord.fromText("b8")),
      new ChessPiece(ChessMan.BLACK_BISHOP, Coord.fromText("c8")),
      new ChessPiece(ChessMan.BLACK_KING, Coord.fromText("d8")),
      new ChessPiece(ChessMan.BLACK_QUEEN, Coord.fromText("e8")),
      new ChessPiece(ChessMan.BLACK_BISHOP, Coord.fromText("f8")),
      new ChessPiece(ChessMan.BLACK_KNIGHT, Coord.fromText("g8")),
      new ChessPiece(ChessMan.BLACK_ROOK, Coord.fromText("h8")),
      new ChessPiece(ChessMan.BLACK_PAWN, Coord.fromText("a7")),
      new ChessPiece(ChessMan.BLACK_PAWN, Coord.fromText("b7")),
      new ChessPiece(ChessMan.BLACK_PAWN, Coord.fromText("c7")),
      new ChessPiece(ChessMan.BLACK_PAWN, Coord.fromText("d7")),
      new ChessPiece(ChessMan.BLACK_PAWN, Coord.fromText("e7")),
      new ChessPiece(ChessMan.BLACK_PAWN, Coord.fromText("f7")),
      new ChessPiece(ChessMan.BLACK_PAWN, Coord.fromText("g7")),
      new ChessPiece(ChessMan.BLACK_PAWN, Coord.fromText("h7"))
    ];    
  }
}
