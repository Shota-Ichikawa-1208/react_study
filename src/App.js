import {useState} from 'react';
import { useEffect } from 'react';
import { Sleep } from './utils.js';

export default function App(){
  console.log('App component rendered');
  return(
    <div>
      <Board />
    </div>
  );
}

function Board(){
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));
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
    setSquares(nextSquares);
    //勝者をセット
    setWinner(calculateWinner(nextSquares));
    //playerを変更
    setXIsNext(!xIsNext);
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
