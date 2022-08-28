const BLACK_SIDE = "Black";
const WHITE_SIDE = "White";
const PIECE_KING = "K";
const PIECE_QUEEN = "Q";
const PIECE_BISHOP = "B";
const PIECE_ROOK = "R";
const PIECE_KNIGHT = "N";
const PIECE_PAWN = "P";
const WHITE_KING = { piece: PIECE_KING, text: "&#x2654;", side: WHITE_SIDE};
const WHITE_QUEEN = { piece: PIECE_QUEEN, text: "&#x2655;", side: WHITE_SIDE};
const WHITE_BISHOP = { piece: PIECE_BISHOP, text: "&#x2657;", side: WHITE_SIDE};
const WHITE_KNIGHT = { piece: PIECE_KNIGHT, text: "&#x2658;", side: WHITE_SIDE};
const WHITE_ROOK = { piece: PIECE_ROOK, text: "&#x2656;", side: WHITE_SIDE};
const WHITE_PAWN = { piece: PIECE_PAWN, text: "&#x2659;", side: WHITE_SIDE};
const BLACK_KING = { piece: PIECE_KING, text: "&#x265A;", side: BLACK_SIDE};
const BLACK_QUEEN = { piece: PIECE_QUEEN, text: "&#x265B;", side: BLACK_SIDE};
const BLACK_BISHOP = { piece: PIECE_BISHOP, text: "&#x265D;", side: BLACK_SIDE};
const BLACK_KNIGHT = { piece: PIECE_KNIGHT, text: "&#x265E;", side: BLACK_SIDE};
const BLACK_ROOK = { piece: PIECE_ROOK, text: "&#x265C;", side: BLACK_SIDE};
const BLACK_PAWN = { piece: PIECE_PAWN, text: "&#x265F;", side: BLACK_SIDE};
const STARTING_PIECES = [
  { piece: WHITE_KING, location: "e1"},
  { piece: WHITE_QUEEN, location: "d1"},
  { piece: WHITE_BISHOP, location: "c1"},
  { piece: WHITE_BISHOP, location: "f1"},
  { piece: WHITE_KNIGHT, location: "b1"},
  { piece: WHITE_KNIGHT, location: "g1"},
  { piece: WHITE_ROOK, location: "a1"},
  { piece: WHITE_ROOK, location: "h1"},
  { piece: WHITE_PAWN, location: "a2"},
  { piece: WHITE_PAWN, location: "b2"},
  { piece: WHITE_PAWN, location: "c2"},
  { piece: WHITE_PAWN, location: "d2"},
  { piece: WHITE_PAWN, location: "e2"},
  { piece: WHITE_PAWN, location: "f2"},
  { piece: WHITE_PAWN, location: "g2"},
  { piece: WHITE_PAWN, location: "h2"},
  { piece: BLACK_KING, location: "e8"},
  { piece: BLACK_QUEEN, location: "d8"},
  { piece: BLACK_BISHOP, location: "c8"},
  { piece: BLACK_BISHOP, location: "f8"},
  { piece: BLACK_KNIGHT, location: "b8"},
  { piece: BLACK_KNIGHT, location: "g8"},
  { piece: BLACK_ROOK, location: "a8"},
  { piece: BLACK_ROOK, location: "h8"},
  { piece: BLACK_PAWN, location: "a7"},
  { piece: BLACK_PAWN, location: "b7"},
  { piece: BLACK_PAWN, location: "c7"},
  { piece: BLACK_PAWN, location: "d7"},
  { piece: BLACK_PAWN, location: "e7"},
  { piece: BLACK_PAWN, location: "f7"},
  { piece: BLACK_PAWN, location: "g7"},
  { piece: BLACK_PAWN, location: "h7"},
];

/*
move: {
  piece: BLACK_BISHOP,
  from: "",
  to: "",
  taken: WHITE_BISHOP
}
*/
var chessBoardEngine = {
  createEngine() {
    return chessBoardEngineFn();
  }
};

function chessBoardEngineFn()
{
  var obj = {
    state: {
      selected: "",
      fromLocation: "",
      pieces: [],
      moves: []
    }
  };

  obj.actions = {
    cloneState: cloneState.bind(obj),
    clear: clear.bind(obj),
    reset: reset.bind(obj),
    start: start.bind(obj),
    move: move.bind(obj),
    addMove: addMove.bind(obj),
    selectPiece: selectPiece.bind(obj)  
  }

  obj.methods = {
    textToLocation: textToLocation.bind(obj),
    locationToText: locationToText.bind(obj),
    isPieceAt: isPieceAt.bind(obj),
    isBlocked: isBlocked.bind(obj),
    canMove: canMove.bind(obj),
    getSidePieces: getSidePieces.bind(obj),
    getPieceAtLocation: getPieceAtLocation.bind(obj),
    isThreatened: isThreatened.bind(obj)
  }

  return obj;

  /**
   * Convert a1 to { row: 0, col: 0 }, a2 to { row: 1, col: 0 }
   * @param {*} t text
   */
  function textToLocation(t) {
    const aVal = "a".charCodeAt(0);

    if (!t || t.length != 2) return;
    let c = t.charCodeAt(0) - aVal + 1;
    if (c < 1 || c > 8) return;
    let r = parseInt(t.charAt(1));
    if (r < 1 || r > 8) return;
    return { row: r, col: c};
  }

  /** if r=2, c=3, returns d3 (c=3=>d, r=2=>3 1 based)
   * row: integer, 0-7
   * col: integer, 0-7
   */
  function locationToText(row, col) {
    const aVal = "a".charCodeAt(0);
    return String.fromCharCode(aVal + col - 1) + (row).toString();

  }

  function cloneState() {
    this.state = Object.assign({}, this.state);
    return this.state;
  }

  function clear() {
    this.state.selected = "";
    this.state.pieces = [];
    this.state.moves = [];
    return this.actions.cloneState();
  }

  function reset() {
    this.state.selected = "";
    this.state.moves = [];
    this.state.pieces = STARTING_PIECES.map((p) => { return { piece: p.piece, location: p.location, moved: false };})
    this.state.pieces = STARTING_PIECES.map((p) => { return { piece: p.piece, location: "", moved: false };})
    return this.actions.cloneState();
  }

  function start() {
    this.state.selected = "";
    this.state.moves = [];
    this.state.pieces = STARTING_PIECES.map((p) => { return { piece: p.piece, location: p.location, moved: false };})
    return this.actions.cloneState();
  }

  function isStraight(fromCoord, toCoord) {
    return fromCoord.row === toCoord.row || fromCoord.col === toCoord.col;
  }

  function isDiagonal(fromCoord, toCoord) {
    return Math.abs(fromCoord.row - toCoord.row) === Math.abs(fromCoord.col - toCoord.col);
  }

  function isStraightOrDiagonal(fromCoord, toCoord) {
    return isStraight(fromCoord, toCoord) || isDiagonal(fromCoord, toCoord);
  }

  function isValidLocation(coord) {
    return coord.row > 0 && coord.row < 9 && coord.col > 0 && coord.col < 9;
  }

  function isEqual(fromCoord, toCoord) {
    return fromCoord.row === toCoord.row && fromCoord.col === toCoord.col; 
  }

  function isOneSquare(fromCoord, toCoord) {
    return !isEqual(fromCoord, toCoord) &&
      Math.abs(fromCoord.row - toCoord.row) < 2 &&
      Math.abs(fromCoord.col - toCoord.col) < 2;
  }

  function isKnightMove(fromCoord, toCoord) {
    var vDist = Math.abs(fromCoord.row - toCoord.row);
    var hDist = Math.abs(fromCoord.col - toCoord.col);
    return (vDist === 1 && hDist === 2) || (vDist === 2 && hDist === 1);
  }

  function isPawnMove(fromCoord, toCoord, piece, takenPiece, isThreat) {
    var dir = piece.piece.side === WHITE_SIDE ? 1 : -1;
    var isForward1 = toCoord.row - fromCoord.row === dir;
    var isForward2 = toCoord.row - fromCoord.row === dir * 2;
    var isSameCol = fromCoord.col === toCoord.col;
    var isSide1 = Math.abs(fromCoord.col - toCoord.col) === 1;
    return (isSameCol && !takenPiece && (isForward1 || (!piece.moved && isForward2)) && !isThreat) ||
      (isSide1 && takenPiece && takenPiece.piece.side !== piece.piece.side  && isForward1);
  }

  function getPieceAtLocation(coord) {
    var locn = this.methods.locationToText(coord.row, coord.col);
    return this.state.pieces.find(p => p.location === locn);
  }

  function isPieceAt(row, col) {
    var locn = this.methods.locationToText(row, col);
    var result = this.state.pieces.some(p => p.location === locn);
    //console.log('isPieceAt("' + locn + '"): ' + result)
    return result;
  }

  function isBlocked(fromCoord, toCoord) {
    var dx = toCoord.col == fromCoord.col ? 0 : toCoord.col > fromCoord.col ? 1 : -1;
    var dy = toCoord.row == fromCoord.row ? 0 : toCoord.row > fromCoord.row ? 1 : -1;
    var moves = Math.max(Math.abs(toCoord.col - fromCoord.col), Math.abs(toCoord.row - fromCoord.row));
    for(var i = 1; i < moves; i++){
      var col = fromCoord.col + dx * i;
      var row = fromCoord.row + dy * i;
      if (this.methods.isPieceAt(row, col)) {
        return true;
      }
    }
    return false;
  }

  function otherSide(side) {
    return side === WHITE_SIDE ? BLACK_SIDE : WHITE_SIDE;
  }

  function getSidePieces(side) {
    return this.state.pieces.filter(p => p.piece.side === side);
  }
  /**
   * Is this square threatened
   * @param side The side who wants to move here
   * @param {row, col} coord 
   */
  function isThreatened(movingPiece, coord) {
    var othSide = otherSide(movingPiece.piece.side);
    var sidePieces = this.methods.getSidePieces(othSide);
    return sidePieces.some(p => this.methods.canMove(p, this.methods.textToLocation(p.location), coord, movingPiece, true));
  }

  function canMove(piece, fromCoord, toCoord, takenPiece, isThreat) {
    if (!piece || !piece.piece || !piece.piece.piece) return false;
    if (!isValidLocation(fromCoord) || !isValidLocation(toCoord)) return false;

    if (piece.piece.piece === PIECE_KING) {
      return isOneSquare(fromCoord, toCoord) && !this.methods.isThreatened(piece, toCoord);
    }
    if (piece.piece.piece === PIECE_QUEEN) {
      return isStraightOrDiagonal(fromCoord, toCoord) && !this.methods.isBlocked(fromCoord, toCoord);
    }
    if (piece.piece.piece === PIECE_BISHOP) {
      return isDiagonal(fromCoord, toCoord) && !this.methods.isBlocked(fromCoord, toCoord);
    }
    if (piece.piece.piece === PIECE_KNIGHT) {
      return isKnightMove(fromCoord, toCoord);
    }
    if (piece.piece.piece === PIECE_ROOK) {
      return isStraight(fromCoord, toCoord) && !this.methods.isBlocked(fromCoord, toCoord);
    }
    if (piece.piece.piece === PIECE_PAWN) {
      return isPawnMove(fromCoord, toCoord, piece, takenPiece, isThreat) &&
      !this.methods.isBlocked(fromCoord, toCoord);
    }

    return true
  } 

  function move(fromLocn, toLocn) {
    // find the piece
    var piece = this.state.pieces.find(p => p.location === fromLocn);
    var takenPiece = this.state.pieces.find(p => p.location === toLocn);
    var fromCoord = this.methods.textToLocation(fromLocn);
    var toCoord = this.methods.textToLocation(toLocn);
    var pieceCanMove = this.methods.canMove(piece, fromCoord, toCoord, takenPiece);

    if (!pieceCanMove) {
      console.log('Piece cannot move!')
      return this.actions.cloneState();
    }

    if (takenPiece) {
      // Cannot take your own pieces (including yourself)
      if (piece.piece.side === takenPiece.piece.side) {
        return this.actions.cloneState();
      }
      // taking a piece
      takenPiece.location = "";
    }

    if (piece) {
      // set the location
      piece.location = toLocn;
      piece.moved = true;
      this.state.fromLocation = fromLocn;
      this.actions.addMove(piece, takenPiece, fromLocn, toLocn);
    }

    return this.actions.cloneState();
  }

  function addMove(piece, taken, from, to) {
    this.state.moves.push({
      piece: piece.piece,
      taken: (taken ? taken.piece : undefined),
      from: from,
      to: to
    });
  }
  function selectPiece(location) {
    if (this.state.selected) {
      console.log("selectPiece() second selection: " + location)
      if (this.state.selected !== location) {
        // remove selection
        this.actions.move(this.state.selected, location);
      }
      // remove selection
      this.state.selected = "";
    } else {
      console.log("selectPiece() first selection: " + location)
      this.state.selected = location;
      this.state.fromLocation = "";
    }
    return this.actions.cloneState();
  }
}

export default chessBoardEngine