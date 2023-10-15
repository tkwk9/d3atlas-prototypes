import { createStore } from "solid-js/store";
import anime from "animejs";
import Victor from "victor";

import "./Minesweeper.scss";

const Minesweeper = () => {
  const tmpMap = [
    [null, null, "M", null, null, null, null, null, null],
    [null, null, null, null, null, null, "M", null, null],
    [null, null, null, null, null, "M", null, null, null],
    [null, null, null, null, null, "M", null, null, null],
    [null, "M", null, null, null, null, null, null, null],
    ["M", null, null, null, null, null, null, null, "M"],
    [null, null, null, null, null, null, null, null, 1],
    [null, null, null, null, 1, null, null, null, null],
    [null, null, null, null, null, 1, null, null, null],
  ];

  const map = [
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

  const [gameState, setGameState] = createStore({
    gameState: [
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ],
  });

  tmpMap.forEach((row, rowIdx) =>
    row.forEach((cellData, columnIdx) => {
      if (cellData === "M") {
        map[rowIdx][columnIdx] = "M";
        if (
          map[rowIdx - 1] &&
          map[rowIdx - 1][columnIdx - 1] !== undefined &&
          map[rowIdx - 1][columnIdx - 1] !== "M"
        )
          map[rowIdx - 1][columnIdx - 1] += 1;
        if (
          map[rowIdx - 1] &&
          map[rowIdx - 1][columnIdx] !== undefined &&
          map[rowIdx - 1][columnIdx] !== "M"
        )
          map[rowIdx - 1][columnIdx] += 1;
        if (
          map[rowIdx - 1] &&
          map[rowIdx - 1][columnIdx + 1] !== undefined &&
          map[rowIdx - 1][columnIdx + 1] !== "M"
        )
          map[rowIdx - 1][columnIdx + 1] += 1;
        if (
          map[rowIdx] &&
          map[rowIdx][columnIdx - 1] !== undefined &&
          map[rowIdx][columnIdx - 1] !== "M"
        )
          map[rowIdx][columnIdx - 1] += 1;
        if (
          map[rowIdx] &&
          map[rowIdx][columnIdx + 1] !== undefined &&
          map[rowIdx][columnIdx + 1] !== "M"
        )
          map[rowIdx][columnIdx + 1] += 1;
        if (
          map[rowIdx + 1] &&
          map[rowIdx + 1][columnIdx - 1] !== undefined &&
          map[rowIdx + 1][columnIdx - 1] !== "M"
        )
          map[rowIdx + 1][columnIdx - 1] += 1;
        if (
          map[rowIdx + 1] &&
          map[rowIdx + 1][columnIdx] !== undefined &&
          map[rowIdx + 1][columnIdx] !== "M"
        )
          map[rowIdx + 1][columnIdx] += 1;
        if (
          map[rowIdx + 1] &&
          map[rowIdx + 1][columnIdx + 1] !== undefined &&
          map[rowIdx + 1][columnIdx + 1] !== "M"
        )
          map[rowIdx + 1][columnIdx + 1] += 1;
      }
    })
  );

  return (
    <div class="Minesweeper">
      <h1 class="title">Minesweeper: F</h1>
      <div class={`container`}>
        {map.map((row) => {
          return row.map((item) => {
            return (
              <div class={`cell cell-1`}>
                <span>{item > 0 || item === "M" ? item : ""}</span>
              </div>
            );
          });
        })}
      </div>
    </div>
  );
};

export default Minesweeper;
