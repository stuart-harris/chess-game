import React from 'react';
import { Component } from 'react';
import './App.css';
import { ChessSide } from './ChessSide.js';
import { ChessGame } from './ChessGame.js';
import { Coord, coordToText } from './Coord.js';

class App extends Component {
  game = new ChessGame();
  state = this.game;

  constructor(props) {
    super(props);
  }

  gameUpdated() {
    this.game = this.game.clone();
    this.setState(this.game);
  }

  // generate a 2 x 2 array of string to render on the board
  generateBoard(pieces) {
    var board = [
      [{},{},{},{},{},{},{},{}],
      [{},{},{},{},{},{},{},{}],
      [{},{},{},{},{},{},{},{}],
      [{},{},{},{},{},{},{},{}],
      [{},{},{},{},{},{},{},{}],
      [{},{},{},{},{},{},{},{}],
      [{},{},{},{},{},{},{},{}],
      [{},{},{},{},{},{},{},{}]
    ];

    for(let i = 0; i < pieces.length; i++) {
      let p = pieces[i];
      var coord = p.location;
      if (coord.isEmpty()) continue;
      board[8-coord.row][coord.col-1] = p.man;
    }

    return board;
  }

  onClear() {
    this.game.reset()
    this.gameUpdated();
  }

  onReset() {
    this.game.reset()
    this.gameUpdated();
  }

  onStart() {
    this.game.start()
    this.gameUpdated();
  }

  onSelectBot(id) {
//    this.setState(this.engine.actions.selectBot(id));
  }

  coordsToBoard(coords) {
    return new Coord(8-coords.row, coords.col + 1);
  }

  coordsToScreen(coords) {
    return new Coord(8-coords.row, coords.col - 1);
  }

  makeCoord(r, c) {
    return new Coord(r, c);
  }

  isEqualCoord(a, b) {
    return a.row === b.row && a.col === b.col; 
  }

  selectPiece(r, c) {
    var bCoords = this.coordsToBoard(this.makeCoord(r, c));
    var locn = this.makeCoord(bCoords.row, bCoords.col);
    console.log('selectPiece(' + r + ', ' + c + '): ' + coordToText(locn));
    this.game.selectLocation(locn);
    this.gameUpdated();
  }

  getPieceClasses(r, c, piece) {
    var result = [];
    
    if (piece.text) {
      result.push('piece');
    }

    if (piece && piece.side == this.state.turn) {
      result.push('turn');
    }

    var locn = this.coordsToBoard(this.makeCoord(r,c));
//    var locn = this.engine.methods.coordToText(bCoords.row, bCoords.col);

    if (this.state.selected) {
      result.push(locn.isEqual(this.state.selected) ? 'selected' : 'selectable');
    }

    if (locn.isEqual(this.state.fromLocation)) {
      result.push('from');
    }

    if (locn.isEqual(this.state.invalidLocation)) {
      result.push('invalid');
    }

    return result.join(' ');
  }

  render() {
    const value = this.state;
    const board = this.generateBoard(value.board.pieces);

    let turnsPanel;
    if (value.turn) {
      if (value.isCheckmate) {
        turnsPanel =
        <div>
          <div id="panel-turns">
            <p>Checkmate! { value.turn + " wins." }</p>
          </div>
          <hr/>
        </div>
      }
      else {
        turnsPanel =
        <div>
          <div id="panel-turns">
            <p>{ value.turn + " to move." }</p>
          </div>
          <hr/>
        </div>
      }
    }

    const rows = board.map((row, r_index) =>
      <tr key={'row_' + r_index}>
      {
        row.map((sq, c_index) =>
          <td
            key={'col_' + c_index}
            className={this.getPieceClasses(r_index, c_index, sq)}
            onClick={(e) => this.selectPiece(r_index, c_index)}
          >
                <span dangerouslySetInnerHTML={{__html: sq.text}}></span>
          </td>
        )
      }
    </tr>
    );

    const whiteTaken =
    <div className="taken">
      {
    value.board.getTakenPiecesOfSide(ChessSide.WHITE_SIDE)
    .map((p, i) =>
        <span key={i} dangerouslySetInnerHTML={{__html: p.man.text}}></span>  
    )
      }
      </div>;

    const blackTaken =
    <div className="taken">
      {
    value.board.getTakenPiecesOfSide(ChessSide.BLACK_SIDE)
    .map((p, i) =>
        <span key={i} dangerouslySetInnerHTML={{__html: p.man.text}}></span>  
    )
      }
      </div>;

    const movesPanel = value.moves.map((m, i, ms) =>
    {
      if (i % 2 == 1) return
      if (i == ms.length - 1) {
        return <div key={"m-" + i} className="row">
          <div className="column-3">{i/2+1}. {m.toString()}</div>
          <div className="column-9"></div>
        </div>
      } else {
        return <div key={"m-" + i} className="row">
          <div className="column-3">{i/2+1}. {m.toString()}</div>
          <div className="column-3">{ms[i+1].toString()}</div>
          <div className="column-6"></div>
        </div>
      }
    }
    )

    const availableMovesPanel = 
        value.availableMoves.map((m, i, ms) => 
        <div key={"am-" + i}>{formatMove(m)}</div>
      )


    let chessBotPanel;

    if (value.chessBot) {
      if (value.isPlaying) {
        chessBotPanel = <div>
          <p>You are playing {value.chessBot.name}</p>
          <p className="description">{value.chessBot.description}</p>
          <p>What would {value.chessBot.name} do?</p>
          <p>{formatMove(value.chessBotNextMove)}</p>
        </div>  
      } else {
        chessBotPanel = <div>
          <p>You selected {value.chessBot.name}</p>
          <p className="description">{value.chessBot.description}</p>
        </div>
      }
    } else if (!value.isPlaying) {
      chessBotPanel = <div>
        <p>Choose a chess bot</p>
        <div>
        {
          value.chessBots.map((cb, i, cbs) =>
          <button key={"btn-cb-" + cb.id} onClick={() => this.onSelectBot(cb.id)} className="full-width" style={{marginBottom: 10}}>
            <p>{cb.name}</p>
            <p className="description">{cb.description}</p>
          </button>)
        }
        </div>
      </div>
    }

    let gamePanel = <div>
      <p>is playing = {value.isPlaying ? "yes" : "no"}</p>
      <p>is check = {value.isCheck ? "yes" : "no"}</p>
      <p>is checkmate = {value.isCheckmate ? "yes" : "no"}</p>
      <p>selected = {value.selected.toString()}</p>
      <p>from location = {value.fromLocation.toString()}</p>
      <p>turn = {value.turn}</p>
    </div>

    return (
      <div className="App">
      <h1>A Chess Game</h1>
      <section className="row">
        <div id="panel-board" className="column-6">
        {whiteTaken}
      <table className="board">
        <thead>
          <tr>
          <th>a</th>
          <th>b</th>
          <th>c</th>
          <th>d</th>
          <th>e</th>
          <th>f</th>
          <th>g</th>
          <th>h</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
        <tfoot>
          <tr>
          <th>a</th>
          <th>b</th>
          <th>c</th>
          <th>d</th>
          <th>e</th>
          <th>f</th>
          <th>g</th>
          <th>h</th>
          </tr>
        </tfoot>
      </table>
      {blackTaken}
        </div>
        <div className="column-6">
          <div id="panel-control">
            <div className="margin-bottom-m">
              <button id="btn-clear" className="btn" onClick={() => this.onClear()}>Clear</button>
              <button id="btn-reset" className="btn margin-left-m" onClick={() => this.onReset()}>Reset</button>
              <button id="btn-start" className="btn btn-primary margin-left-m" onClick={() => this.onStart()}>Start</button>
            </div>
          </div>
          {turnsPanel}
          <div id="panel-moves">
            <p>Moves</p>
            {movesPanel}
          </div>
          <hr/>
          <div id="panel-available-moves">
            <div className="row">
              <div className="column-3">
                <p>Available moves</p>
                {availableMovesPanel}
              </div>
              <div className="column-3">
                {chessBotPanel}
              </div>
              <div className="column-6">
                {gamePanel}
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>
      );
    }
  }
  
  export default App;
  