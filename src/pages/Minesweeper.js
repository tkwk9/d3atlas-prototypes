import { onMount, createSignal } from "solid-js";
import anime from "animejs";
import Victor from "victor";

import "./Minesweeper.scss";

const Minesweeper = () => {
  const map = [
    [0, 0, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 0, 0],
  ];

  return (
    <div class="Minesweeper">
      <h1 class="title">Minesweeper: F</h1>
      <div class={`container`}>
        {map.map((row) => {
          return row.map((item) => {
            return (
              <div class={`cell cell-1`}>
                <span>{item}</span>
              </div>
            );
          });
        })}
        {/* <div class={`cell cell-1`} >1</div>
        <div class={`cell cell-2`} >2</div>
        <div class={`cell cell-3`} >3</div> */}
      </div>
    </div>
  );
};

export default Minesweeper;
