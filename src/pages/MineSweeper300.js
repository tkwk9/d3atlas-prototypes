import { onMount, createSignal } from "solid-js";

import "./MineSweeper300.scss";

const MineSweeper300 = () => {
  let svgRef;
  const [dragPoint, setDragPoint] = createSignal(null);
  return (
    <div class="MineSweeper300">
      <h1 class="title">MineSweeper300: PoC</h1>
      <svg
        id={`MainSvg`}
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox="-500, -500, 1000, 1000"
        onmousedown={(e) =>
          setDragPoint({
            x: svgRef.viewBox.baseVal.x,
            y: svgRef.viewBox.baseVal.y,
            width: svgRef.viewBox.baseVal.width,
            height: svgRef.viewBox.baseVal.height,
            clientX: e.clientX,
            clientY: e.clientY,
          })
        }
        onwheel={(e) => {
          svgRef.setAttribute(
            "viewBox",
            `${svgRef.viewBox.baseVal.x}, ${svgRef.viewBox.baseVal.y}, ${
              svgRef.viewBox.baseVal.width - e.deltaY
            },${svgRef.viewBox.baseVal.height - e.deltaY}`
          );
          console.log(e.deltaX, e.deltaY);
        }}
        onmouseup={(e) => setDragPoint(null)}
        onmousemove={(e) =>
          dragPoint() &&
          svgRef.setAttribute(
            "viewBox",
            `${dragPoint().x + (dragPoint().clientX - e.clientX)}, ${
              dragPoint().y + (dragPoint().clientY - e.clientY)
            }, ${dragPoint().width},${dragPoint().height}`
          )
        }
        onmouseleave={(e) => setDragPoint(null)}
      >
        {new Array(20)
          .fill(null)
          .map(() => new Array(20).fill(null))
          .map((row, rowIdx) =>
            row.map((_, colIdx) => (
              <rect
                x={`${rowIdx * 22 - (row.length * 11 - 1)}`}
                y={`${colIdx * 22 - (row.length * 11 - 1)}`}
                width={20}
                height={20}
                rx="1"
                stroke-width="0.5"
                stroke="black"
                fill="red"
              />
            ))
          )}
      </svg>
    </div>
  );
};

export default MineSweeper300;
