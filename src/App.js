import {useState} from 'react';
import { useEffect } from 'react';
import { Sleep } from './utils.js';

export default function App(){
  console.log('App component rendered');
  return(
    <div>
      <Game />
    </div>
  );
}

function Game(){
  const [xIsNext, setXIsNext] = useState(true);
  //盤面（要素数9の配列）の履歴を保存する2次元配列
  const [history, setHistory] = useState([Array(9).fill(null)]);
  //現在の表示盤面が何番手のものかを表す変数
  const [currentMove, setCurrentMone] = useState(0);
  //現在の盤面を表す配列
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares){
    //playerの変更
    setXIsNext(!xIsNext);
    const nextHistory =[...history.slice(0,currentMove+1),nextSquares];
    setHistory(nextHistory);
    setCurrentMone(nextHistory.length - 1);
  }

  //過去の盤面に戻る
  function jumpTo(nextMove){
    setCurrentMone(nextMove);
    setXIsNext(nextMove % 2 === 0);
  }

  //<li>を格納した配列(moves)
  const moves = history.map((squares,move) => {
    let description;
    if(move > 0){
      description = 'Go to move #' + move;
    }else{
      description = 'Go to start';
    }

    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    )
  })

  return (
    <div className='game'>
      <div className='game-board'>
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}/>
      </div>
      <div className='game-info'>
        <ol>{moves}</ol>
      </div>
    </div>
  )
}

function Board({xIsNext,squares,onPlay}){
  const [winner, setWinner] = useState(null);
  const [isDraw, setIsDarw] = useState(false);

  function handleClick(index){
    //既に選択されたマスの場合
    if(squares[index] || winner || isDraw)
    {
      return;
    }
    const nextSquares = squares.slice();
    //playerによて「○,×変更」
    if(xIsNext){
      nextSquares[index] = "×";
    }
    else
    {
      nextSquares[index] = "○";
    }
    //フィールドの値を変更
    onPlay(nextSquares);
    //勝者をセット
    setWinner(calculateWinner(nextSquares));
  }

  let status;
  if(winner)
  {
    status = "Winner: " + winner;
  }
  else if(!squares.includes(null))
  {
    status = "draw...";
    setIsDarw(true);
  }
  else
  {
    status = "Next Player: " + (xIsNext ? "×" : "○");
  }

  useEffect(() => {
    if(isDraw || winner){
      const timer = setTimeout(() =>{
        location.reload();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isDraw,winner])

  return(
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={ squares[0] } onSquareClick = {() => handleClick(0)}/>
        <Square value={ squares[1] } onSquareClick = {() => handleClick(1)}/>
        <Square value={ squares[2] } onSquareClick = {() => handleClick(2)}/>
      </div>
      <div className="board-row">
        <Square value={ squares[3] } onSquareClick = {() => handleClick(3)}/>
        <Square value={ squares[4] } onSquareClick = {() => handleClick(4)}/>
        <Square value={ squares[5] } onSquareClick = {() => handleClick(5)}/>
      </div>
      <div className="board-row">
        <Square value={ squares[6] } onSquareClick = {() => handleClick(6)}/>
        <Square value={ squares[7] } onSquareClick = {() => handleClick(7)}/>
        <Square value={ squares[8] } onSquareClick = {() => handleClick(8)}/>
      </div>
    </>
  );
}

function Square({ value, onSquareClick }){
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

/**
 * 三目並べの勝者を判定する関数
 * @param {Array} squares -現在の盤面の状態を表す9要素の配列
 * @returns {string|null} 勝者の記号（○または×）,勝者がいない場合はnull
 */
function calculateWinner(squares){
  //縦・横・斜めのラインを配列のインデックスで表現
  const lines = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ];

 for(let i = 0;i < lines.length; i++){
    const [a,b,c] = lines[i];
    if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
      return squares[a];
    }
  }
  return null;
}
