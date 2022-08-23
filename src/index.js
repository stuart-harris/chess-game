import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import './index.css';
import App from './App';
import ChessBoard from './ChessBoard';


const store = createStore(ChessBoard);

const render = () => ReactDOM.render(
  <App
    value={store.getState()}
    onMove={() => store.dispatch({ type: 'MOVE' })}
    onReset={() => store.dispatch({ type: 'RESET' })}
    onClear={() => store.dispatch({ type: 'CLEAR' })}
  />,
  document.getElementById('root')
);

render();
store.subscribe(render);
