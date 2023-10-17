import { onMount, Index } from "solid-js";
import { createStore } from "solid-js/store";
import cloneDeep from "clone-deep";
import anime from "animejs";
import Victor from "victor";

import "./Minesweeper.scss";

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

const generateMineLocations = () => {
  return [
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
};

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

  generateMineLocations().forEach((row, rowIdx) =>
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
    boardState: cloneDeep(untouchedBoard),
  });

  const cellRefs = new Array(9).fill(0).map(() => []);

  onMount(() => {
    cellRefs.forEach((row, rowIdx) => {
      row.forEach((cell, colIdx) => {
        const shadowInAnimation = anime({
          targets: cell,
          boxShadow: "inset 0 0 10px black",
          duration: 25,
          easing: "easeInOutSine",
          autoplay: false,
        });

        cell.addEventListener("mousedown", (e) => {
          shadowInAnimation.play();
        });
        cell.addEventListener("mouseenter", (e) => {
          anime({
            targets: cell,
            borderWidth: "2px",
            duration: 25,
            easing: "easeInOutSine",
          });
        });
        cell.addEventListener("mouseup", (e) => {
          anime({
            targets: cell,
            boxShadow: "inset 0 0 15px black",
            duration: 25,
            easing: "easeInOutSine",
            complete: () =>
              cell.setAttribute(
                "style",
                "pointer-events: none; box-shadow: inset 0 0 15px black; border-width: 2px"
              ),
          });
          const newBoardState = cloneDeep(gameState.boardState);
          newBoardState[rowIdx][colIdx] = 1;
          setGameState({ boardState: newBoardState });
        });
        cell.addEventListener("mouseleave", (e) => {
          if (!gameState.boardState[rowIdx][colIdx]) {
            anime({
              targets: cell,
              boxShadow: "inset 0 0 0px black",
              duration: 25,
              easing: "easeInOutSine",
            });
            anime({
              targets: cell,
              borderWidth: "0px",
              duration: 25,
              easing: "easeInOutSine",
            });
          }
        });
      });
    });
  });

  return (
    <div class="Minesweeper">
      <h1 class="title">Minesweeper: F</h1>
      <div class={`container`}>
        <Index each={gameState.boardState}>
          {(row, rowIdx) => (
            <Index each={row()}>
              {(item, colIdx) => (
                <div class={`wrapper`}>
                  <div ref={cellRefs[rowIdx][colIdx]} class={`cell`}>
                    {item() ? gameState.gameMap[rowIdx][colIdx] : ""}
                  </div>
                </div>
              )}
            </Index>
          )}
        </Index>
      </div>
    </div>
  );
};

export default Minesweeper;
