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

    const scaleBy = 1.5;
    stage.on("wheel", (e) => {
      const oldScale = stage.scaleX();
      const pointer = stage.getPointerPosition();

      const mousePointTo = {
        x: (pointer.x - stage.x()) / oldScale,
        y: (pointer.y - stage.y()) / oldScale,
      };

      let direction = e.evt.deltaY > 0 ? 1 : -1;

      if (e.evt.ctrlKey) {
        direction = -direction;
      }

      const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

      stage.scale({ x: newScale, y: newScale });

      const newPos = {
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
      };
      stage.position(newPos);
    });

    new Array(100)
      .fill(null)
      .map(() => new Array(100).fill(null))
      .forEach((row, rowIdx) =>
        row.forEach((_, colIdx) => {
          const box = new Konva.Rect({
            x: rowIdx * 12 + 100,
            y: colIdx * 12 + 100,
            fill: colors[1],
            stroke: "black",
            strokeWidth: 1,
            width: 10,
            height: 10,
            cornerRadius: 1,
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
