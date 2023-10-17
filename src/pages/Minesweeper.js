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

const bababa = (rowIdx, colIdx) =>
  `c${rowIdx.toString().padStart(3, "0")}${colIdx.toString().padStart(3, "0")}`;

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
          if (gameState.gameMap[rowIdx][colIdx] === 0) {
            window.aaa = gameState.gameMap;
            const set = new Set();
            const stack = [bababa(rowIdx, colIdx)];
            set.add(bababa(rowIdx, colIdx));
            while (stack.length) {
              const xyz = stack.pop();

              const rowIdx = parseInt(xyz.substr(1, 3));
              const colIdx = parseInt(xyz.substr(4, 6));

              console.log(rowIdx);
              let el;

              if (
                gameState.gameMap[rowIdx - 1] &&
                gameState.gameMap[rowIdx - 1][colIdx - 1] !== undefined
              ) {
                el = document.getElementById(bababa(rowIdx - 1, colIdx - 1));
                if (
                  gameState.gameMap[rowIdx - 1][colIdx - 1] === 0 &&
                  !set.has(bababa(rowIdx - 1, colIdx - 1))
                ) {
                  stack.push(bababa(rowIdx - 1, colIdx - 1));
                }
                set.add(bababa(rowIdx - 1, colIdx - 1));
              }

              if (
                gameState.gameMap[rowIdx - 1] &&
                gameState.gameMap[rowIdx - 1][colIdx] !== undefined
              ) {
                el = document.getElementById(bababa(rowIdx - 1, colIdx));
                if (
                  gameState.gameMap[rowIdx - 1][colIdx] === 0 &&
                  !set.has(bababa(rowIdx - 1, colIdx))
                ) {
                  stack.push(bababa(rowIdx - 1, colIdx));
                }
                set.add(bababa(rowIdx - 1, colIdx));
              }

              if (
                gameState.gameMap[rowIdx - 1] &&
                gameState.gameMap[rowIdx - 1][colIdx + 1] !== undefined
              ) {
                el = document.getElementById(bababa(rowIdx - 1, colIdx + 1));
                if (
                  gameState.gameMap[rowIdx - 1][colIdx + 1] === 0 &&
                  !set.has(bababa(rowIdx - 1, colIdx + 1))
                ) {
                  stack.push(bababa(rowIdx - 1, colIdx + 1));
                }
                set.add(bababa(rowIdx - 1, colIdx + 1));
              }

              if (
                gameState.gameMap[rowIdx] &&
                gameState.gameMap[rowIdx][colIdx - 1] !== undefined
              ) {
                el = document.getElementById(bababa(rowIdx, colIdx - 1));
                if (
                  gameState.gameMap[rowIdx][colIdx - 1] === 0 &&
                  !set.has(bababa(rowIdx, colIdx - 1))
                ) {
                  stack.push(bababa(rowIdx, colIdx - 1));
                }
                set.add(bababa(rowIdx, colIdx - 1));
              }

              if (
                gameState.gameMap[rowIdx] &&
                gameState.gameMap[rowIdx][colIdx + 1] !== undefined
              ) {
                el = document.getElementById(bababa(rowIdx, colIdx + 1));
                if (
                  gameState.gameMap[rowIdx][colIdx + 1] === 0 &&
                  !set.has(bababa(rowIdx, colIdx + 1))
                ) {
                  stack.push(bababa(rowIdx, colIdx + 1));
                }
                set.add(bababa(rowIdx, colIdx + 1));
              }

              if (
                gameState.gameMap[rowIdx + 1] &&
                gameState.gameMap[rowIdx + 1][colIdx - 1] !== undefined
              ) {
                el = document.getElementById(bababa(rowIdx + 1, colIdx - 1));
                if (
                  gameState.gameMap[rowIdx + 1][colIdx - 1] === 0 &&
                  !set.has(bababa(rowIdx + 1, colIdx - 1))
                ) {
                  stack.push(bababa(rowIdx + 1, colIdx - 1));
                }
                set.add(bababa(rowIdx + 1, colIdx - 1));
              }

              if (
                gameState.gameMap[rowIdx + 1] &&
                gameState.gameMap[rowIdx + 1][colIdx] !== undefined
              ) {
                el = document.getElementById(bababa(rowIdx + 1, colIdx));
                if (
                  gameState.gameMap[rowIdx + 1][colIdx] === 0 &&
                  !set.has(bababa(rowIdx + 1, colIdx))
                ) {
                  stack.push(bababa(rowIdx + 1, colIdx));
                }
                set.add(bababa(rowIdx + 1, colIdx));
              }

              if (
                gameState.gameMap[rowIdx + 1] &&
                gameState.gameMap[rowIdx + 1][colIdx + 1] !== undefined
              ) {
                el = document.getElementById(bababa(rowIdx + 1, colIdx + 1));
                if (
                  gameState.gameMap[rowIdx + 1][colIdx + 1] === 0 &&
                  !set.has(bababa(rowIdx + 1, colIdx + 1))
                ) {
                  stack.push(bababa(rowIdx + 1, colIdx + 1));
                }
                set.add(bababa(rowIdx + 1, colIdx + 1));
              }
            }

            const newBoardState = cloneDeep(gameState.boardState);
            set.forEach((id) => {
              console.log(id);
              anime({
                targets: `#${id}`,
                boxShadow: "inset 0 0 15px black",
                duration: 25,
                easing: "easeInOutSine",
                complete: () =>
                  document
                    .getElementById(id)
                    .setAttribute(
                      "style",
                      `pointer-events: none; box-shadow: inset 0 0 15px black; border-width: 2px`
                    ),
              });
              newBoardState[parseInt(id.substr(1, 3))][
                parseInt(id.substr(4, 6))
              ] = 1;
            });
            setGameState({ boardState: newBoardState });
          } else {
            anime({
              targets: cell,
              boxShadow: "inset 0 0 15px black",
              duration: 25,
              easing: "easeInOutSine",
              complete: () =>
                cell.setAttribute(
                  "style",
                  `pointer-events: none; box-shadow: inset 0 0 15px black; border-width: 2px`
                ),
            });
            const newBoardState = cloneDeep(gameState.boardState);
            newBoardState[rowIdx][colIdx] = 1;
            setGameState({ boardState: newBoardState });
          }
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
                  <div
                    id={bababa(rowIdx, colIdx)}
                    ref={cellRefs[rowIdx][colIdx]}
                    data-row-idx={rowIdx}
                    data-col-idx={colIdx}
                    class={`cell`}
                  >
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
