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

  // if r=2, c=3, returns d3 (c=3=>d, r=2=>3 1 based)
  makeLocation(r, c) {
    const aVal = "a".charCodeAt(0);
    return String.fromCharCode(aVal + c) + (r+1).toString();
  }
  // generate a 2 x 2 array of string to render on the board
  generateBoard(pieces) {
    var board = [
      ["","","","","","","",""],
      ["","","","","","","",""],
      ["","","","","","","",""],
      ["","","","","","","",""],
      ["","","","","","","",""],
      ["","","","","","","",""],
      ["","","","","","","",""],
      ["","","","","","","",""]
    ];

    const aVal = "a".charCodeAt(0);

    for(let i = 0; i < pieces.length; i++) {
      let p = pieces[i];
      if (!p.location || p.location.length != 2) continue;
      let c = p.location.charCodeAt(0) - aVal;
      if (c < 0 || c > 7) continue;
      let r = parseInt(p.location.charAt(1));
      if (r < 1 || r > 8) continue;
      r -= 1;
      board[r][c] = p.piece.text;
    }

    return board;
  }

  onReset() {
    this.setState(this.engine.actions.reset());
  }

  onClear() {
    this.setState(this.engine.actions.clear());
  }

  selectPiece(r, c) {
    var locn = this.makeLocation(r, c);
    console.log('selectPiece(' + r + ', ' + c + '): ' + locn);
    // TODO: Use redux to dispatch a call to select a piece
    this.setState(this.engine.actions.selectPiece(locn));
  }

  getPieceClasses(r, c, pieceText) {
    var result = [];
    if (pieceText) {
      result.push('piece');
    }
    var locn = this.makeLocation(r, c);

    if (this.state.selected) {
      result.push(locn === this.state.selected ? 'selected' : 'selectable');
    }
    return result.join(' ');
  }

  render() {
    const value = this.state;
    const board = this.generateBoard(value.pieces);

    const rows = board.map((row, r_index) =>
    <tr key={'row_' + r_index}>
      {
        row.map((col, c_index) =>
<td
  key={'col_' + c_index}
  className={this.getPieceClasses(r_index, c_index, col)}
  onClick={(e) => this.selectPiece(r_index, c_index)}
  >
  <span dangerouslySetInnerHTML={{__html: col}}></span>
</td>
  )
      }
    </tr>
    );

    return (
      <div className="App">
      <h1>A Chess Game</h1>
      <section className="center">
        <div className="margin-bottom-m">
          <button id="btn-reset" className="btn btn-primary" onClick={() => this.onReset()}>Reset</button>
          <button id="btn-clear" className="btn margin-left-m" onClick={() => this.onClear()}>Clear</button>
        </div>
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
      </section>
      </div>
      );
    }
  }
  
  export default App;
  