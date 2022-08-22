import React, { Component } from 'react';
import './App.css';

class App extends Component {
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

  render() {
    const { value, onMove } = this.props;
    const board = this.generateBoard(value.pieces);

    const rows = board.map((row, index) =>
    <tr key={index}>
      {
      row.map((col, c_index) =>
      <td key={'col_' + c_index}>
        <span dangerouslySetInnerHTML={{__html: col}}></span>
      </td>)
      }
    </tr>
    );
    return (
      <div className="App">
      <h1>A Chess Game</h1>
      <section className="center">
      <table>
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
  