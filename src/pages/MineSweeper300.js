import { onMount, createSignal } from "solid-js";

import "./MineSweeper300.scss";

const MineSweeper300 = () => {
  let svgRef;

  const [dragPoint, setDragPoint] = createSignal(null);

  const handleMouseDown = (e) => {

    const svgPoint = svgRef.createSVGPoint();
    svgPoint.x = e.clientX;
    svgPoint.y = e.clientY;
    const screenCtm = svgRef.getScreenCTM().inverse();
    const mappedPoint = svgPoint.matrixTransform( screenCtm );

    setDragPoint({
      x: svgRef.viewBox.baseVal.x,
      y: svgRef.viewBox.baseVal.y,
      width: svgRef.viewBox.baseVal.width,
      height: svgRef.viewBox.baseVal.height,
      clientX: e.clientX,
      clientY: e.clientY,
      mappedPoint,
      screenCtm
    });
  };
  const handleMouseUp = (e) => {
    setDragPoint(null);
  };
  const handleMouseLeave = (e) => {
    setDragPoint(null);
  };

  const handleWheel = (e) => {
    svgRef.setAttribute(
      "viewBox",
      `${svgRef.viewBox.baseVal.x}, ${svgRef.viewBox.baseVal.y}, ${
        svgRef.viewBox.baseVal.width - e.deltaY
      },${svgRef.viewBox.baseVal.height - e.deltaY}`
    );
  };

  const handleMouseMove = (e) => {
    if (!dragPoint()) return;

    const svgPoint = svgRef.createSVGPoint();
    svgPoint.x = e.clientX;
    svgPoint.y = e.clientY;
    const mappedPoint = svgPoint.matrixTransform( dragPoint().screenCtm );

    svgRef.setAttribute(
      "viewBox",
      `${dragPoint().x + (dragPoint().mappedPoint.x - mappedPoint.x)}, ${
        dragPoint().y + (dragPoint().mappedPoint.y - mappedPoint.y)
      }, ${dragPoint().width},${dragPoint().height}`
    );
  };

  return (
    <div class="MineSweeper300">
      <h1 class="title">MineSweeper300: PoC</h1>
      <svg
        id={`MainSvg`}
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox="-500, -500, 1000, 1000"
        onmousedown={handleMouseDown}
        onwheel={handleWheel}
        onmouseup={handleMouseUp}
        onmousemove={handleMouseMove}
        onmouseleave={handleMouseLeave}
      >
        {new Array(30)
          .fill(null)
          .map(() => new Array(30).fill(null))
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
