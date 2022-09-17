import React from 'react';
import { Component } from 'react';
import './App.css';
import chessBoardEngine from './ChessBoard'

class App extends Component {
  engine = chessBoardEngine.createEngine()
  state = this.engine.state

  constructor(props) {
    super(props);
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

    const aVal = "a".charCodeAt(0);

    for(let i = 0; i < pieces.length; i++) {
      let p = pieces[i];
      var coord = this.engine.methods.textToLocation(p.location);
      if (!coord) continue;
      board[8-coord.row][coord.col-1] = p.piece;
    }

    return board;
  }

  onClear() {
    this.setState(this.engine.actions.clear());
  }

  onReset() {
    this.setState(this.engine.actions.reset());
  }

  onStart() {
    this.setState(this.engine.actions.start());
  }

  coordsToBoard(coords) {
    return { row: 8-coords.row, col: coords.col + 1};
  }

  coordsToScreen(coords) {
    return { row: 8-coords.row, col: coords.col - 1};
  }

  selectPiece(r, c) {
    var bCoords = this.coordsToBoard({row: r, col: c});
    var locn = this.engine.methods.locationToText(bCoords.row, bCoords.col);
    console.log('selectPiece(' + r + ', ' + c + '): ' + locn);
    // TODO: Use redux to dispatch a call to select a piece
    this.setState(this.engine.actions.selectPiece(locn));
  }

  getPieceClasses(r, c, piece) {
    var result = [];
    
    if (piece.text) {
      result.push('piece');
    }

    if (piece && piece.side == this.state.turn) {
      result.push('turn');
    }

    var bCoords = this.coordsToBoard({row: r, col: c});
    var locn = this.engine.methods.locationToText(bCoords.row, bCoords.col);

    if (this.state.selected) {
      result.push(locn === this.state.selected ? 'selected' : 'selectable');
    }

    if (this.state.fromLocation === locn) {
      result.push('from');
    }

    return result.join(' ');
  }

  render() {
    const value = this.state;
    const board = this.generateBoard(value.pieces);

    let turnsPanel;
    if (value.turn) {
      turnsPanel =
        <div>
          <div id="panel-turns">
            <p>{ value.turn + " to move." }</p>
          </div>
          <hr/>
        </div> 
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
    value.pieces
    .filter(p => p.piece.side === "White" && p.location === null)
    .map((p, i) =>
        <span key={i} dangerouslySetInnerHTML={{__html: p.piece.text}}></span>  
    )
      }
      </div>;

    const blackTaken =
    <div className="taken">
      {
    value.pieces
    .filter(p => p.piece.side === "Black" && p.location === null)
    .map((p, i) =>
        <span key={i} dangerouslySetInnerHTML={{__html: p.piece.text}}></span>  
    )
      }
      </div>;

    function formatMove(move) {
      // console.log(move);
      if(move) return move.piece.piece + move.from + (move.taken ? "x" : " ") + move.to;
      return "-";
    }

    const movesPanel = value.moves.map((m, i, ms) =>
    {
      if (i % 2 == 1) return
      if (i == ms.length - 1) {
        return <div key={"m-" + i} className="row">
          <div className="column-3">{i/2+1}. {formatMove(m)}</div>
          <div className="column-9"></div>
        </div>
      } else {
        return <div key={"m-" + i} className="row">
          <div className="column-3">{i/2+1}. {formatMove(m)}</div>
          <div className="column-3">{formatMove(ms[i+1])}</div>
          <div className="column-6"></div>
        </div>
      }
    }
    )

    const availableMovesPanel = 
        value.availableMoves.map((m, i, ms) => 
        <div key={"am-" + i}>{formatMove(m)}</div>
      )  

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
                <p>What would {value.chessBot} do?</p>
                <p>{formatMove(value.chessBotNextMove)}</p>
              </div>
              <div className="column-6">
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
  