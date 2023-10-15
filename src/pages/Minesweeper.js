import { createStore } from "solid-js/store";
import cloneDeep from "clone-deep";
import anime from "animejs";
import Victor from "victor";

import "./Minesweeper.scss";

const getCurrentBoardState = (state) => {
  return state.boardStateStack[state.boardStateStack.length - 1];
};

const untouchedBoard = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
];

const createGameMap = () => {
  const gameMap = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];

  [
    [null, null, "M", null, null, null, null, null, null],
    [null, null, null, null, null, null, "M", null, null],
    [null, null, null, null, null, "M", null, null, null],
    [null, null, null, null, null, "M", null, null, null],
    [null, "M", null, null, null, null, null, null, null],
    ["M", null, null, null, null, null, null, null, "M"],
    [null, null, null, null, null, null, null, null, 1],
    [null, null, null, null, 1, null, null, null, null],
    [null, null, null, null, null, 1, null, null, null],
  ].forEach((row, rowIdx) =>
    row.forEach((cellData, columnIdx) => {
      if (cellData === "M") {
        gameMap[rowIdx][columnIdx] = "M";
        if (
          gameMap[rowIdx - 1] &&
          gameMap[rowIdx - 1][columnIdx - 1] !== undefined &&
          gameMap[rowIdx - 1][columnIdx - 1] !== "M"
        )
          gameMap[rowIdx - 1][columnIdx - 1] += 1;
        if (
          gameMap[rowIdx - 1] &&
          gameMap[rowIdx - 1][columnIdx] !== undefined &&
          gameMap[rowIdx - 1][columnIdx] !== "M"
        )
          gameMap[rowIdx - 1][columnIdx] += 1;
        if (
          gameMap[rowIdx - 1] &&
          gameMap[rowIdx - 1][columnIdx + 1] !== undefined &&
          gameMap[rowIdx - 1][columnIdx + 1] !== "M"
        )
          gameMap[rowIdx - 1][columnIdx + 1] += 1;
        if (
          gameMap[rowIdx] &&
          gameMap[rowIdx][columnIdx - 1] !== undefined &&
          gameMap[rowIdx][columnIdx - 1] !== "M"
        )
          gameMap[rowIdx][columnIdx - 1] += 1;
        if (
          gameMap[rowIdx] &&
          gameMap[rowIdx][columnIdx + 1] !== undefined &&
          gameMap[rowIdx][columnIdx + 1] !== "M"
        )
          gameMap[rowIdx][columnIdx + 1] += 1;
        if (
          gameMap[rowIdx + 1] &&
          gameMap[rowIdx + 1][columnIdx - 1] !== undefined &&
          gameMap[rowIdx + 1][columnIdx - 1] !== "M"
        )
          gameMap[rowIdx + 1][columnIdx - 1] += 1;
        if (
          gameMap[rowIdx + 1] &&
          gameMap[rowIdx + 1][columnIdx] !== undefined &&
          gameMap[rowIdx + 1][columnIdx] !== "M"
        )
          gameMap[rowIdx + 1][columnIdx] += 1;
        if (
          gameMap[rowIdx + 1] &&
          gameMap[rowIdx + 1][columnIdx + 1] !== undefined &&
          gameMap[rowIdx + 1][columnIdx + 1] !== "M"
        )
          gameMap[rowIdx + 1][columnIdx + 1] += 1;
      }
    })
  );
  return gameMap;
};

const Minesweeper = () => {
  const [gameState, setGameState] = createStore({
    gameMap: createGameMap(),
    boardStateStack: [cloneDeep(untouchedBoard)],
  });

  return (
    <div class="Minesweeper">
      <h1 class="title">Minesweeper: F</h1>
      <div class={`container`}>
        {getCurrentBoardState(gameState).map((row) => {
          return row.map((item) => {
            return (
              <div class={`wrapper`}>
                <div class={`cell selectable`}>
                  {/* <div class={`shadow`}></div> */}
                </div>

                {/* <span>{item > 0 || item === "M" ? item : ""}</span> */}
              </div>
            );
          });
        })}
        {/* {gameState.gameMap.map((row) => {
          return row.map((item) => {
            return (
              <div class={`cell cell-1`}>
                <span>{item > 0 || item === "M" ? item : ""}</span>
              </div>
            );
          });
        })} */}
      </div>
    </div>
  );
};

export default Minesweeper;
