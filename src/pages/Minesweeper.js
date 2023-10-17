import { onMount, Index } from "solid-js";
import { createStore } from "solid-js/store";
import cloneDeep from "clone-deep";
import anime from "animejs";
import Victor from "victor";

import "./Minesweeper.scss";

const cellColors = {
  0: { color: "#a2a2a2", backgroundColor: "#565656" },
  1: { color: "#0c1cc8", backgroundColor: "#757898" },
  2: { color: "#013603", backgroundColor: "#556c5b" },
  3: { color: "#750505", backgroundColor: "#605353" },
  4: { color: "#030c77", backgroundColor: "#4b4d62" },
  5: { color: "#440101", backgroundColor: "#383030" },
  1: { color: "#030c77", backgroundColor: "#4b4d62" },
  1: { color: "#030c77", backgroundColor: "#4b4d62" },
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

const getCellId = (rowIdx, colIdx) =>
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
            const stack = [getCellId(rowIdx, colIdx)];
            set.add(getCellId(rowIdx, colIdx));
            while (stack.length) {
              const cellId = stack.pop();

              const rowIdx = parseInt(cellId.substr(1, 3));
              const colIdx = parseInt(cellId.substr(4, 6));

              if (
                gameState.gameMap[rowIdx - 1] &&
                gameState.gameMap[rowIdx - 1][colIdx - 1] !== undefined
              ) {
                if (
                  gameState.gameMap[rowIdx - 1][colIdx - 1] === 0 &&
                  !set.has(getCellId(rowIdx - 1, colIdx - 1))
                ) {
                  stack.push(getCellId(rowIdx - 1, colIdx - 1));
                }
                set.add(getCellId(rowIdx - 1, colIdx - 1));
              }

              if (
                gameState.gameMap[rowIdx - 1] &&
                gameState.gameMap[rowIdx - 1][colIdx] !== undefined
              ) {
                if (
                  gameState.gameMap[rowIdx - 1][colIdx] === 0 &&
                  !set.has(getCellId(rowIdx - 1, colIdx))
                ) {
                  stack.push(getCellId(rowIdx - 1, colIdx));
                }
                set.add(getCellId(rowIdx - 1, colIdx));
              }

              if (
                gameState.gameMap[rowIdx - 1] &&
                gameState.gameMap[rowIdx - 1][colIdx + 1] !== undefined
              ) {
                if (
                  gameState.gameMap[rowIdx - 1][colIdx + 1] === 0 &&
                  !set.has(getCellId(rowIdx - 1, colIdx + 1))
                ) {
                  stack.push(getCellId(rowIdx - 1, colIdx + 1));
                }
                set.add(getCellId(rowIdx - 1, colIdx + 1));
              }

              if (
                gameState.gameMap[rowIdx] &&
                gameState.gameMap[rowIdx][colIdx - 1] !== undefined
              ) {
                if (
                  gameState.gameMap[rowIdx][colIdx - 1] === 0 &&
                  !set.has(getCellId(rowIdx, colIdx - 1))
                ) {
                  stack.push(getCellId(rowIdx, colIdx - 1));
                }
                set.add(getCellId(rowIdx, colIdx - 1));
              }

              if (
                gameState.gameMap[rowIdx] &&
                gameState.gameMap[rowIdx][colIdx + 1] !== undefined
              ) {
                if (
                  gameState.gameMap[rowIdx][colIdx + 1] === 0 &&
                  !set.has(getCellId(rowIdx, colIdx + 1))
                ) {
                  stack.push(getCellId(rowIdx, colIdx + 1));
                }
                set.add(getCellId(rowIdx, colIdx + 1));
              }

              if (
                gameState.gameMap[rowIdx + 1] &&
                gameState.gameMap[rowIdx + 1][colIdx - 1] !== undefined
              ) {
                if (
                  gameState.gameMap[rowIdx + 1][colIdx - 1] === 0 &&
                  !set.has(getCellId(rowIdx + 1, colIdx - 1))
                ) {
                  stack.push(getCellId(rowIdx + 1, colIdx - 1));
                }
                set.add(getCellId(rowIdx + 1, colIdx - 1));
              }

              if (
                gameState.gameMap[rowIdx + 1] &&
                gameState.gameMap[rowIdx + 1][colIdx] !== undefined
              ) {
                if (
                  gameState.gameMap[rowIdx + 1][colIdx] === 0 &&
                  !set.has(getCellId(rowIdx + 1, colIdx))
                ) {
                  stack.push(getCellId(rowIdx + 1, colIdx));
                }
                set.add(getCellId(rowIdx + 1, colIdx));
              }

              if (
                gameState.gameMap[rowIdx + 1] &&
                gameState.gameMap[rowIdx + 1][colIdx + 1] !== undefined
              ) {
                if (
                  gameState.gameMap[rowIdx + 1][colIdx + 1] === 0 &&
                  !set.has(getCellId(rowIdx + 1, colIdx + 1))
                ) {
                  stack.push(getCellId(rowIdx + 1, colIdx + 1));
                }
                set.add(getCellId(rowIdx + 1, colIdx + 1));
              }
            }

            const newBoardState = cloneDeep(gameState.boardState);
            set.forEach((id) => {
              const { color, backgroundColor } =
                cellColors[
                  gameState.gameMap[parseInt(id.substr(1, 3))][
                    parseInt(id.substr(4, 6))
                  ]
                ];
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
                      `pointer-events: none; box-shadow: inset 0 0 15px black; border-width: 2px; color: ${color}; background-color: ${backgroundColor}`
                    ),
              });
              newBoardState[parseInt(id.substr(1, 3))][
                parseInt(id.substr(4, 6))
              ] = 1;
            });
            setGameState({ boardState: newBoardState });
          } else {
            const { rowIdx, colIdx } = cell.dataset;
            const { color, backgroundColor } =
              cellColors[gameState.gameMap[rowIdx][colIdx]];
            anime({
              targets: cell,
              boxShadow: "inset 0 0 15px black",
              duration: 25,
              easing: "easeInOutSine",
              complete: () =>
                cell.setAttribute(
                  "style",
                  `pointer-events: none; box-shadow: inset 0 0 15px black; border-width: 2px; color: ${color}; background-color: ${backgroundColor}`
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
                    id={getCellId(rowIdx, colIdx)}
                    ref={cellRefs[rowIdx][colIdx]}
                    data-row-idx={rowIdx}
                    data-col-idx={colIdx}
                    class={`cell`}
                  >
                    {item() && gameState.gameMap[rowIdx][colIdx] > 0
                      ? gameState.gameMap[rowIdx][colIdx]
                      : ""}
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
