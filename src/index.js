import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props){
  return (
    <button
      className="square"
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}
  
class Board extends React.Component {
  renderSquare(i) {
    return(
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}  
      />
    );
  }
  
  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}
  
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        lastmove: {col: null, row: null},
        isActive: true
      }],
      stepNumber: 0,
      xIsNext: true,
      showHistory: false,
      alternate: false
    };
  }

  // Handle Events
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    if(history[history.length-1]) history[history.length-1].isActive = false;
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const lastmove = calculatePosition(i);
    if(calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares, lastmove, isActive: true
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    if(history[history.length-1]) {
      history[history.length-1].isActive = false;
      history[step].isActive = true;
    }
    this.setState({
      history,
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  handleShowHistory() {
    this.setState({
      showHistory: !this.state.showHistory
    });
  }

  handleAlternate() {
    this.setState({
      alternate: !this.state.alternate
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const show = this.state.showHistory;
    const alternate = this.state.alternate;

    const moves = history.map((step, move) => {
      const isActive = history[move].isActive;
      const col = history[move].lastmove['col'];
      const row = history[move].lastmove['row'];

      const desc = move ?
      `Go to Move (col: ${col}, row: ${row})` :
      "Go to Game Start";

      return (
        <li key={move} className={isActive ? 'item active' : 'item'}>
          <button onClick={this.jumpTo.bind(this, move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if(winner == "Empate") {
      status = "Empate";
    } else if(winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <>
        <div className="game">
          <div className="game-board">
            <div className="game-title">{status}</div>
            <Board
              squares={current.squares}
              onClick={this.handleClick.bind(this)}
            />
          </div>
          <div className="game-info">
            <a href="https://github.com/AlePingui/tic-tac-toe">Link del codigo</a>
            <div>
              <button onClick={this.handleShowHistory.bind(this)}>History: {show ? 'ON' : 'OFF'}</button>
              {show &&
                <button
                  style={{marginLeft: '10px'}}
                  onClick={this.handleAlternate.bind(this)}
                >
                  Alternate: {alternate ? 'ON' : 'OFF'}
                </button>
              }
            </div>
            {show &&
              <>
                <ol>
                  {alternate ? moves.reverse() : moves}
                </ol>
              </>
            }
          </div>
        </div>
      </>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      highlightSquare(lines[i]);
      return squares[a];
    }
  }
  if(!squares.includes(null)) return 'Empate'
  return null;
}

function calculatePosition(item) {
  let tableRows = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8]
  ];
  let tableCols = [
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8]
  ];
  let col = null;
  let row = null;
  for(let i = 0; i < tableRows.length; i++) {
    const [a, b, c] = tableRows[i];
    if(item == a || item == b || item == c) {
      row = i+1;
    }
    const [d, e, f] = tableCols[i];
    if(item == d || item == e || item == f) {
      col = i+1;
    }
  }
  return {col, row};
}

// Esta funcion está en desarrollo
// forma parte de una mas grande que va a marcar las casillas ganadoras
function highlightSquare(line) {
  return line;
}

const root = ReactDOM.createRoot(document.getElementById('root')); 

root.render(
  <React.StrictMode>
    <Game />
  </React.StrictMode>
);
