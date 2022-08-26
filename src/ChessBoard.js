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
      pieces: []  
    }
  };

  obj.actions = {
    cloneState: cloneState.bind(obj),
    clear: clear.bind(obj),
    reset: reset.bind(obj),
    start: start.bind(obj),
    move: move.bind(obj),
    selectPiece: selectPiece.bind(obj)  
  }

  return obj;

  function cloneState() {
    this.state = Object.assign({}, this.state);
    return this.state;
  }

  function clear() {
    this.state.selected = "";
    this.state.pieces = [];
    return this.actions.cloneState();
  }

  function reset() {
    this.state.selected = "";
    this.state.pieces = STARTING_PIECES.map((p) => { return { piece: p.piece, location: p.location, moved: false };})
    this.state.pieces = STARTING_PIECES.map((p) => { return { piece: p.piece, location: "", moved: false };})
    return this.actions.cloneState();
  }

  function start() {
    this.state.selected = "";
    this.state.pieces = STARTING_PIECES.map((p) => { return { piece: p.piece, location: p.location, moved: false };})
    return this.actions.cloneState();
  }

  function move(fromLocn, toLocn) {
    // find the piece
    var piece = this.state.pieces.find(p => p.location === fromLocn);

    var takenPiece = this.state.pieces.find(p => p.location === toLocn);

    if (takenPiece) {
      // taking a piece
      takenPiece.location = "";
    }

    if (piece) {
      // set the location
      piece.location = toLocn;
      piece.moved = true;
    }
    return this.actions.cloneState();
  }

  function selectPiece(location) {
    if (this.state.selected) {
      console.log("selectPiece() second selection")
      if (this.state.selected !== location) {
        // remove selection
        this.actions.move(this.state.selected, location);
      }
      // remove selection
      this.state.selected = "";
    } else {
      console.log("selectPiece() first selection")
      this.state.selected = location;
    }
    return this.actions.cloneState();
  }
}

export default chessBoardEngine