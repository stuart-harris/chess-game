import { Coord } from './Coord';
import { WHITE_KING, WHITE_QUEEN, WHITE_BISHOP, WHITE_KNIGHT, WHITE_ROOK, WHITE_PAWN, BLACK_KING, BLACK_QUEEN, BLACK_BISHOP, BLACK_KNIGHT, BLACK_ROOK, BLACK_PAWN } from './ChessMan';

export class ChessPiece {
  // ChessMan
  man = null;
  // Coord Place on the board
  location = Coord.empty;
  // Required for en-passant
  lastLocation = Coord.empty;
  numberOfMoves = 0;

  // Has moved
  hasMoved = false;

  constructor(man, location, lastLocation, hasMoved, numberOfMoves) {
    this.man = man;
    this.location = location;
    this.lastLocation = lastLocation;
    this.hasMoved = !!hasMoved;
    this.numberOfMoves = this.hasMoved ? numberOfMoves : 0;
  }

  clone() {
    let man = this.man.clone();
    let location = this.location ? this.location.clone() : undefined;
    let lastLocation = this.lastLocation ? this.lastLocation.clone() : undefined;
    return new ChessPiece(man, location, lastLocation, this.hasMoved, this.numberOfMoves);
  }

  // Take this piece. Set location to Coord.empty
  take() {
    this.location = Coord.empty;
  }

  // Move this piece to the specified location
  moveTo(newLocation) {
    this.lastLocation = this.location;
    this.location = newLocation;
    this.numberOfMoves = this.numberOfMoves + 1;
    this.hasMoved = true;
  }

  isTaken() {
    return this.location.isEmpty();
  }

  isOnBoard() {
    return !this.location.isEmpty();
  }

  isFirstMove() {
    return this.numberOfMoves === 1;
  }

  static getStartingPieces() {
    return [
      new ChessPiece(WHITE_ROOK, Coord.fromText("a1")),
      new ChessPiece(WHITE_KNIGHT, Coord.fromText("b1")),
      new ChessPiece(WHITE_BISHOP, Coord.fromText("c1")),
      new ChessPiece(WHITE_QUEEN, Coord.fromText("d1")),
      new ChessPiece(WHITE_KING, Coord.fromText("e1")),
      new ChessPiece(WHITE_BISHOP, Coord.fromText("f1")),
      new ChessPiece(WHITE_KNIGHT, Coord.fromText("g1")),
      new ChessPiece(WHITE_ROOK, Coord.fromText("h1")),
      new ChessPiece(WHITE_PAWN, Coord.fromText("a2")),
      new ChessPiece(WHITE_PAWN, Coord.fromText("b2")),
      new ChessPiece(WHITE_PAWN, Coord.fromText("c2")),
      new ChessPiece(WHITE_PAWN, Coord.fromText("d2")),
      new ChessPiece(WHITE_PAWN, Coord.fromText("e2")),
      new ChessPiece(WHITE_PAWN, Coord.fromText("f2")),
      new ChessPiece(WHITE_PAWN, Coord.fromText("g2")),
      new ChessPiece(WHITE_PAWN, Coord.fromText("h2")),
      new ChessPiece(BLACK_ROOK, Coord.fromText("a8")),
      new ChessPiece(BLACK_KNIGHT, Coord.fromText("b8")),
      new ChessPiece(BLACK_BISHOP, Coord.fromText("c8")),
      new ChessPiece(BLACK_QUEEN, Coord.fromText("d8")),
      new ChessPiece(BLACK_KING, Coord.fromText("e8")),
      new ChessPiece(BLACK_BISHOP, Coord.fromText("f8")),
      new ChessPiece(BLACK_KNIGHT, Coord.fromText("g8")),
      new ChessPiece(BLACK_ROOK, Coord.fromText("h8")),
      new ChessPiece(BLACK_PAWN, Coord.fromText("a7")),
      new ChessPiece(BLACK_PAWN, Coord.fromText("b7")),
      new ChessPiece(BLACK_PAWN, Coord.fromText("c7")),
      new ChessPiece(BLACK_PAWN, Coord.fromText("d7")),
      new ChessPiece(BLACK_PAWN, Coord.fromText("e7")),
      new ChessPiece(BLACK_PAWN, Coord.fromText("f7")),
      new ChessPiece(BLACK_PAWN, Coord.fromText("g7")),
      new ChessPiece(BLACK_PAWN, Coord.fromText("h7"))
    ];    
  }
}
