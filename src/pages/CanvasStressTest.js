import { onMount, createSignal } from "solid-js";
import Konva from "konva";
import anime from "animejs";
import Victor from "victor";

import "./CanvasStressTest.scss";

const CanvasStressTest = () => {
  let parentRef;
  onMount(() => {
    const stage = new Konva.Stage({
      container: "container",
      width: parentRef.clientWidth,
      height: parentRef.clientHeight,
      draggable: true,
    });

    const layer = new Konva.Layer();

    const colors = [
      "#565656",
      "#757898",
      "#728276",
      "#7c6e6e",
      "#2f3251",
      "#341f1f",
    ];

    new Array(300)
      .fill(null)
      .map(() => new Array(300).fill(null))
      .forEach((row, rowIdx) =>
        row.forEach((_, colIdx) => {
          const box = new Konva.Rect({
            x: rowIdx * 7 + 300,
            y: colIdx * 7 + 100,
            fill: colors[1],
            stroke: "black",
            strokeWidth: 1,
            width: 5,
            height: 5,
            cornerRadius: 1,
          });

          box.on("dragstart", () => {
            box.moveToTop();
          });

          box.on("dragmove", () => {
            document.body.style.cursor = "pointer";
          });
          box.on("dblclick dbltap", () => {
            box.destroy();
          });

          box.on("mouseover", () => {
            document.body.style.cursor = "pointer";
          });
          box.on("mouseout", () => {
            document.body.style.cursor = "default";
          });

          layer.add(box);
        })
      );

    stage.add(layer);
  });

  return (
    <div ref={parentRef} class="CanvasStressTest">
      <h1 class="title">Canvas Stress Test: K</h1>
      <div id="container"></div>
    </div>
  );
};

export default CanvasStressTest;
