import { onMount, createSignal } from "solid-js";
import anime from "animejs";
import Victor from "victor";

import "./SvgStressTest.scss";

const SvgStressTest = () => {
  let svgRef;
  const [dragPoint, setDragPoint] = createSignal(null);

  return (
    <div class="SvgStressTest">
      <h1 class="title">SVG Stress Test: U</h1>
      <svg
        id={`MainSvg`}
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox="0, 0, 1000, 1000"
        onmousedown={(e) =>
          setDragPoint({
            x: svgRef.viewBox.baseVal.x,
            y: svgRef.viewBox.baseVal.y,
            width: svgRef.viewBox.baseVal.width,
            height: svgRef.viewBox.baseVal.height,
            clientX: e.clientX,
            clientY: e.clientY,
          }) && console.log(svgRef.viewBox)
        }
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
        {new Array(300)
          .fill(null)
          .map(() => new Array(300).fill(null))
          .map((row, rowIdx) =>
            row.map((_, colIdx) => (
              <rect
                x={`${rowIdx * 7}`}
                y={`${colIdx * 7}`}
                width="50"
                height="50"
                rx="1"
                stroke-width="1"
                stroke="black"
                fill="red"
              />
            ))
          )}
      </svg>
    </div>
  );
};

export default SvgStressTest;
