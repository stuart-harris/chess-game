import * as ChessPiece from './ChessPiece.js';
import { makeCoord, textToCoord, coordToText, isEqualCoord } from './Coord.js';

/*
move: {
  piece: BLACK_BISHOP,
  from: "",
  to: "",
  taken: WHITE_BISHOP
}
*/
var chessGame = {
  createGame() {
    return chessBoardGameFn();
  }
};

function chessBoardGameFn()
{
  var obj = {
    state: {
      isPlaying: false,
      selected: "",
      fromLocation: "",
      pieces: [],
      turn: "",
      moves: [],
      availableMoves: [],
      chessBot: undefined,
      chessBotNextMove: undefined,
      chessBots: [{
        id: "random",
        name: "Random Bot",
        description: "Completely random.",
        settings: {
          preferTake: false,
          takeMostValue: false,
          avoidSacrifice: false,
          protectThreatened: false
        }
      }, {
        id: "take",
        name: "Take Anything",
        description: "Will try to take everything.",
        settings: {
          preferTake: true,
          takeMostValue: false,
          avoidSacrifice: false,
          protectThreatened: false
        }
      }, {
        id: "value",
        name: "Take Best",
        description: "Will try to take the most valuable thing.",
        settings: {
          preferTake: true,
          takeMostValue: true,
          avoidSacrifice: false,
          protectThreatened: false
        }
      }
      ]
    }
  };

  obj.actions = {
    cloneState: cloneState.bind(obj),
    clear: clear.bind(obj),
    reset: reset.bind(obj),
    start: start.bind(obj),
    move: move.bind(obj),
    addMove: addMove.bind(obj),
    selectPiece: selectPiece.bind(obj),
    selectBot: selectBot.bind(obj)
  }

  obj.methods = {
    textToCoord: textToCoord.bind(obj),
    coordToText: coordToText.bind(obj),
    isPieceAt: isPieceAt.bind(obj),
    isBlocked: isBlocked.bind(obj),
    canMove: canMove.bind(obj),
    getSidePieces: getSidePieces.bind(obj),
    getPieceAtLocation: getPieceAtLocation.bind(obj),
    isThreatened: isThreatened.bind(obj),
    isKingMove: isKingMove.bind(obj),
    chessBotMove: chessBotMove.bind(obj),
    chessBotChooseMove: chessBotChooseMove.bind(obj),
    calculateAvailableMoves: calculateAvailableMoves.bind(obj),
    calculateAvailableMovesForPiece: calculateAvailableMovesForPiece.bind(obj),
    calculateAvailableMovesForKing: calculateAvailableMovesForKing.bind(obj),
    calculateAvailableMovesForQueen: calculateAvailableMovesForQueen.bind(obj),
    calculateAvailableMovesForBishop: calculateAvailableMovesForBishop.bind(obj),
    calculateAvailableMovesForKnight: calculateAvailableMovesForKnight.bind(obj),
    calculateAvailableMovesForRook: calculateAvailableMovesForRook.bind(obj),
    calculateAvailableMovesForPawn: calculateAvailableMovesForPawn.bind(obj)
  }

  return obj;

  function cloneState() {
    this.state = Object.assign({}, this.state);
    return this.state;
  }

  function clear() {
    console.log("clear()");
    this.state.isPlaying = false;
    this.state.chessBot = undefined;
    this.state.selected = "";
    this.state.fromLocation = "";
    this.state.pieces = [];
    this.state.moves = [];
    this.state.availableMoves = [];
    this.state.turn = "";
    return this.actions.cloneState();
  }

  function reset() {
    console.log("reset()");
    this.state.isPlaying = false;
    this.state.chessBot = undefined;
    this.state.selected = "";
    this.state.fromLocation = "";
    this.state.moves = [];
    this.state.availableMoves = [];
    this.state.pieces = ChessPiece.STARTING_PIECES.map((p) => { return { piece: p.piece, location: "", moved: false };})
    this.state.turn = "";
    return this.actions.cloneState();
  }

  function start() {
    console.log("start()");
    this.state.isPlaying = true;
    this.state.selected = "";
    this.state.moves = [];
    this.state.availableMoves = [];
    this.state.pieces = ChessPiece.STARTING_PIECES.map((p) => { return { piece: p.piece, location: p.location, moved: false };})
    this.state.turn = ChessPiece.WHITE_SIDE;
    this.methods.calculateAvailableMoves();
    this.methods.chessBotChooseMove();
    return this.actions.cloneState();
  }

  function selectBot(id) {
    console.log("selectBot(id=" + id + ")");
    var bot = this.state.chessBots.find((cb) => cb.id === id);
    this.state.chessBot = bot;
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

  function isOneSquare(fromCoord, toCoord) {
    return !isEqualCoord(fromCoord, toCoord) &&
      Math.abs(fromCoord.row - toCoord.row) < 2 &&
      Math.abs(fromCoord.col - toCoord.col) < 2;
  }

  function isCastle(king, pieces, fromCoord, toCoord) {
    if (king.moved || (!(toCoord.col === 3 || toCoord.col === 7))) return false;

    if (toCoord.col === 3) {
      // rook location
      var rookLocn = coordToText(makeCoord(king.piece.side === ChessPiece.WHITE_SIDE ? 1 : 8, 1));
      // is the rook there?
      var rook = pieces.find(p =>
        p.piece.piece === ChessPiece.PIECE_ROOK &&
        p.piece.side === king.piece.side &&
        !p.moved &&
        p.location === rookLocn);

      if (!rook) return false;

      // is there space?
      var l1 = makeCoord(king.piece.side === ChessPiece.WHITE_SIDE ? 1 : 8, 2);
      var l2 = makeCoord(king.piece.side === ChessPiece.WHITE_SIDE ? 1 : 8, 3);
      var l3 = makeCoord(king.piece.side === ChessPiece.WHITE_SIDE ? 1 : 8, 4);
      var noSpace = pieces.some(p => isEqualCoord(p.location, l1) || isEqualCoord(p.location, l2) || isEqualCoord(p.location, l3))
      // are there threats?
      // TODO var threads = 
      return !noSpace;
    } else {
      // rook location
      var rookLocn = coordToText(makeCoord(king.piece.side === ChessPiece.WHITE_SIDE ? 1 : 8, 8));
      // is the rook there?
      var rook = pieces.find(p =>
        p.piece.piece === ChessPiece.PIECE_ROOK &&
        p.piece.side === king.piece.side &&
        !p.moved &&
        p.location === rookLocn);

      if (!rook) return false;

      // is there space?
      var l1 = makeCoord(king.piece.side === ChessPiece.WHITE_SIDE ? 1 : 8, 6);
      var l2 = makeCoord(king.piece.side === ChessPiece.WHITE_SIDE ? 1 : 8, 7);
      var noSpace = pieces.some(p => isEqualCoord(p.location, l1) || isEqualCoord(p.location, l2))
      // are there threats?
      // TODO var threads = 
      return !noSpace;
    }

    return false;
  }

  function castleMoveRook(king, pieces, toCoord) {
    // rook location
    var rookLocn = makeCoord(
      king.piece.side === ChessPiece.WHITE_SIDE ? 1 : 8,
      toCoord.col === 3 ? 1 : 8);

    var rookToLocn = makeCoord(
      king.piece.side === ChessPiece.WHITE_SIDE ? 1 : 8,
      toCoord.col === 3 ? 4 : 6);

    // is the rook there?
    var rook = pieces.find(p =>
      p.piece.piece === ChessPiece.PIECE_ROOK &&
      p.piece.side === king.piece.side &&
      !p.moved &&
      isEqualCoord(p.location, rookLocn));

    if (rook) {
      rook.location = rookToLocn;
    }
  }



  function isKingMove(king, pieces, fromCoord, toCoord) {
    return (isOneSquare(fromCoord, toCoord) ||
      isCastle(king, pieces, fromCoord, toCoord)) &&
      !this.methods.isThreatened(king, toCoord)
  }

  function isKnightMove(fromCoord, toCoord) {
    var vDist = Math.abs(fromCoord.row - toCoord.row);
    var hDist = Math.abs(fromCoord.col - toCoord.col);
    return (vDist === 1 && hDist === 2) || (vDist === 2 && hDist === 1);
  }

  function isPawnMove(fromCoord, toCoord, piece, takenPiece, isThreat) {
    var dir = piece.piece.side === ChessPiece.WHITE_SIDE ? 1 : -1;
    var isForward1 = toCoord.row - fromCoord.row === dir;
    var isForward2 = toCoord.row - fromCoord.row === dir * 2;
    var isSameCol = fromCoord.col === toCoord.col;
    var isSide1 = Math.abs(fromCoord.col - toCoord.col) === 1;
    return (isSameCol && !takenPiece && (isForward1 || (!piece.moved && isForward2)) && !isThreat) ||
      (isSide1 && takenPiece && takenPiece.piece.side !== piece.piece.side  && isForward1);
  }

  function getPieceAtLocation(coord) {
    return this.state.pieces.find(p => isEqualCoord(p.location, coord));
  }

  function isPieceAt(row, col) {
    var locn = makeCoord(row, col);
    var result = this.state.pieces.some(p => isEqualCoord(p.location, locn));
    //console.log('isPieceAt("' + locn + '"): ' + result)
    return result;
  }

  function getPieceAt(pieces, coord) {
    return pieces.find(p => isEqualCoord(p.location, coord));
  }

  function isValidCoord(coord) {
    return coord.row > 0 && coord.row < 9 && coord.col > 0 && coord.col < 9;
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
    return side === ChessPiece.WHITE_SIDE ? ChessPiece.BLACK_SIDE : ChessPiece.WHITE_SIDE;
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
    return sidePieces.some(p => p.location && this.methods.canMove(p, p.location, coord, movingPiece, true));
  }

  function canMove(piece, fromCoord, toCoord, takenPiece, isThreat) {
    if (!piece || !piece.piece || !piece.piece.piece) return false;
    if (!isValidLocation(fromCoord) || !isValidLocation(toCoord)) return false;
    if (takenPiece && takenPiece.piece.piece === ChessPiece.PIECE_KING) return false;

    if (piece.piece.piece === ChessPiece.PIECE_KING) {
      return this.methods.isKingMove(piece, this.state.pieces, fromCoord, toCoord);
    }
    if (piece.piece.piece === ChessPiece.PIECE_QUEEN) {
      return isStraightOrDiagonal(fromCoord, toCoord) && !this.methods.isBlocked(fromCoord, toCoord);
    }
    if (piece.piece.piece === ChessPiece.PIECE_BISHOP) {
      return isDiagonal(fromCoord, toCoord) && !this.methods.isBlocked(fromCoord, toCoord);
    }
    if (piece.piece.piece === ChessPiece.PIECE_KNIGHT) {
      return isKnightMove(fromCoord, toCoord);
    }
    if (piece.piece.piece === ChessPiece.PIECE_ROOK) {
      return isStraight(fromCoord, toCoord) && !this.methods.isBlocked(fromCoord, toCoord);
    }
    if (piece.piece.piece === ChessPiece.PIECE_PAWN) {
      return isPawnMove(fromCoord, toCoord, piece, takenPiece, isThreat) &&
      !this.methods.isBlocked(fromCoord, toCoord);
    }

    return true
  } 

  function move(fromLocn, toLocn) {
    // find the piece
    var piece = this.state.pieces.find(p => isEqualCoord(p.location, fromLocn));
    var takenPiece = this.state.pieces.find(p => isEqualCoord(p.location, toLocn));
//    var fromCoord = this.methods.textToCoord(fromLocn);
//    var toCoord = this.methods.textToCoord(toLocn);
    var fromCoord = fromLocn;
    var toCoord = toLocn;
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
      takenPiece.location = null;
    }

    if (piece) {
      if (piece.piece.piece === ChessPiece.PIECE_KING && isCastle(piece, this.state.pieces, fromCoord, toCoord)) {
        castleMoveRook(piece, this.state.pieces, toCoord);
      }
      // set the location
      piece.location = toLocn;
      piece.moved = true;
      this.state.fromLocation = fromLocn;
      this.actions.addMove(piece, takenPiece, fromLocn, toLocn);
      this.state.turn = this.state.moves.length % 2 ? ChessPiece.BLACK_SIDE : ChessPiece.WHITE_SIDE;
      this.methods.calculateAvailableMoves();
      this.methods.chessBotChooseMove();

      if (this.state.turn === ChessPiece.BLACK_SIDE && this.state.chessBot) {
        console.log(this.state.chessBot.name + ' is moving...');
        this.methods.chessBotMove();
      }
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
      console.log("selectPiece() second selection: " + coordToText(location))
      if (!isEqualCoord(this.state.selected, location)) {
        this.actions.move(this.state.selected, location);
      }
      // remove selection
      this.state.selected = null;
    } else {
      var p = this.state.pieces.find(p => isEqualCoord(p.location, location));
      if (p && p.piece.side === this.state.turn) {
        console.log("selectPiece() first selection: " + coordToText(location))
        this.state.selected = location;
        this.state.fromLocation = null;
      } else {
        console.log("B() Not your turn");
      }
    }
    return this.actions.cloneState();
  }

  function chessBotMove() {
    if (this.state.chessBot && this.state.turn === ChessPiece.BLACK_SIDE && this.state.chessBotNextMove) {
      this.actions.move(this.state.chessBotNextMove.from, this.state.chessBotNextMove.to);
    }
  }

  function chessBotChooseMove() {
    var bot = this.state.chessBot;
    var moves = this.state.availableMoves;
    if (bot && moves && moves.length) {
      var settings = bot.settings;
      if (settings.preferTake) {
        var takeMoves = moves.filter((m) => m.taken);
        if (takeMoves && takeMoves.length) {
          moves = takeMoves;

          if (settings.takeMostValue) {
            moves.sort((a,b) => b.taken.piece.value - a.taken.piece.value);
            this.state.chessBotNextMove = moves[0];
            return;
          }
        }
      }

      var idx = Math.floor(Math.random() * moves.length);
      this.state.chessBotNextMove = moves[idx];
    } else {
      this.state.chessBotNextMove = undefined;
    }
  }

  function calculateAvailableMoves() {
    /*
    // this.state.turn = BLACK_SIDE or WHITE_SIDE
    // this.state.pieces
    // STARTING_PIECES.map((p) => { return { piece: p.piece, location: "", moved: false };})
    */
    let moves = [];
    var piecesOnBoard = this.state.pieces.filter((p) => p.location);
    var pieces = piecesOnBoard.filter((p) => p.piece.side === this.state.turn);

    for(var i = 0; i < pieces.length; i++) {
      var p = pieces[i];
      moves.push(...this.methods.calculateAvailableMovesForPiece(p, p.location, piecesOnBoard));
    }
    this.state.availableMoves = moves;
    console.log('available moves : ', moves);
  }

  function calculateAvailableMovesForPiece(piece, coord, pieces) {
    var moves = [];
    if (piece.piece.piece === ChessPiece.PIECE_PAWN) {
      moves = this.methods.calculateAvailableMovesForPawn(piece, coord, pieces);
    }
    if (piece.piece.piece === ChessPiece.PIECE_ROOK) {
      moves = this.methods.calculateAvailableMovesForRook(piece, coord, pieces);
    }
    if (piece.piece.piece === ChessPiece.PIECE_KNIGHT) {
      moves = this.methods.calculateAvailableMovesForKnight(piece, coord, pieces);
    }
    if (piece.piece.piece === ChessPiece.PIECE_BISHOP) {
      moves = this.methods.calculateAvailableMovesForBishop(piece, coord, pieces);
    }
    if (piece.piece.piece === ChessPiece.PIECE_QUEEN) {
      moves = this.methods.calculateAvailableMovesForQueen(piece, coord, pieces);
    }
    if (piece.piece.piece === ChessPiece.PIECE_KING) {
      moves = this.methods.calculateAvailableMovesForKing(piece, coord, pieces);
    }

    moves = removeInvalidMoves(moves);

    return moves;
  }

  function removeInvalidMoves(moves) {
    return moves.filter((m) => isValidMove(m));
  }

  function isValidMove(m) {
    if (m.taken && m.taken.piece.piece === ChessPiece.PIECE_KING) {
      return false;
    }

    return true;
  }

  function makeMove(piece, takenPiece, fromCoord, toCoord) {
    return {
      piece: piece.piece,
      taken: takenPiece,
      from: makeCoord(fromCoord.row, fromCoord.col),
      to: makeCoord(toCoord.row, toCoord.col)
    }
  }

  function calculateAvailableMovesForBishop(piece, coord, pieces, distanceLimit) {
    var moves = [];

    if (!distanceLimit) {
      distanceLimit = 8;
    }
    var to = { row: coord.row, col: coord.col };

    let dc;
    let dr;
    for(var d = 0; d < 4; d++) {
      switch(d) {
        case 0: // northeast
          dc = 1;
          dr = -1;
          break;
        case 1: // northwest
          dc = -1;
          dr = -1;
          break;
        case 2: // southeast
          dc = 1;
          dr = 1;
          break;
        case 3: // southwest
          dc = -1;
          dr = 1;
          break;
      }

      var distance = 0;
      var blocked = false;
      for(var c = coord.col + dc, r = coord.row + dr;
        !blocked && c > 0 && c < 9 && r > 0 && r < 9 && distance < distanceLimit;
        c += dc, r += dr, distance++) {
        to = { row: r, col: c};
        var taken = getPieceAt(pieces, to);
        if (taken) {
          blocked = true;
          if (taken.piece.side !== piece.piece.side) {
            moves.push(makeMove(piece, taken, coord, to))
          }
        } else {
          moves.push(makeMove(piece, undefined, coord, to))
        }
      }
    }

    return moves;
  }

  function calculateAvailableMovesForRook(piece, coord, pieces, distanceLimit) {
    var moves = [];

    if (!distanceLimit) {
      distanceLimit = 8;
    }

    var to = { row: coord.row, col: coord.col };

    let dc;
    let dr;
    for(var d = 0; d < 4; d++) {
      switch(d) {
        case 0: // east
          dc = 1;
          dr = 0;
          break;
        case 1: // west
          dc = -1;
          dr = 0;
          break;
        case 2: // north
          dc = 0;
          dr = -1;
          break;
        case 3: // south
          dc = 0;
          dr = 1;
          break;
      }

      var blocked = false;
      var distance = 0;
      for(var c = coord.col + dc, r = coord.row + dr;
        !blocked && c > 0 && c < 9 && r > 0 && r < 9 && distance < distanceLimit;
        c += dc, r += dr, distance++) {
        to = { row: r, col: c};
        var taken = getPieceAt(pieces, to);
        if (taken) {
          blocked = true;
          if (taken.piece.side !== piece.piece.side) {
            moves.push(makeMove(piece, taken, coord, to))
          }
        } else {
          moves.push(makeMove(piece, undefined, coord, to))
        }
      }
    }

    return moves;
  }

  function calculateAvailableMovesForKing(piece, coord, pieces) {
    var moves = calculateAvailableMovesForRook(piece, coord, pieces, 1);
    return moves.concat(calculateAvailableMovesForBishop(piece, coord, pieces, 1));
  }

  function calculateAvailableMovesForQueen(piece, coord, pieces) {
    var moves = calculateAvailableMovesForRook(piece, coord, pieces);
    return moves.concat(calculateAvailableMovesForBishop(piece, coord, pieces));
  }

  function calculateAvailableMovesForKnight(piece, coord, pieces) {
    var moves = [];

    let to;
    let dc;
    let dr;
    for(var d = 0; d < 8; d++) {
      switch(d) {
        case 0: dc = 2; dr = 1; break;
        case 1: dc = 1; dr = 2; break;
        case 2: dc = -2; dr = 1; break;
        case 3: dc = -1; dr = 2; break;
        case 4: dc = -2; dr = -1; break;
        case 5: dc = -1; dr = -2; break;
        case 6: dc = 2; dr = -1; break;
        case 7: dc = 1; dr = -2; break;
      }

      to = { row: coord.row + dr, col: coord.col + dc };
      if(!isValidCoord(to)) continue;
      var taken = getPieceAt(pieces, to);
      if (taken) {
        if (taken.piece.side !== piece.piece.side) {
          moves.push(makeMove(piece, taken, coord, to))
        }
      } else {
        moves.push(makeMove(piece, undefined, coord, to))
      }
    }

    return moves;
  }

  function calculateAvailableMovesForPawn(piece, coord, pieces) {
    var moves = [];
    var dir = piece.piece.side === ChessPiece.WHITE_SIDE ? 1 : -1;
    var to = { row: coord.row + dir, col: coord.col };

    var taken = getPieceAt(pieces, to);

    if (isValidCoord(to) && !taken) {
      moves.push(makeMove(piece, undefined, coord, to))
    }

    to = { row: coord.row + dir, col: coord.col - 1 };
    taken = getPieceAt(pieces, to);

    if (isValidCoord(to) && taken && taken.piece.side !== piece.piece.side) {
      moves.push(makeMove(piece, taken.piece, coord, to));
    }

    to = { row: coord.row + dir, col: coord.col + 1 };
    taken = getPieceAt(pieces, to);

    if (isValidCoord(to) && taken && taken.piece.side !== piece.piece.side) {
      moves.push(makeMove(piece, taken.piece, coord, to));
    }

    // TODO: en passant

    return moves;
  }

}

export default chessGame