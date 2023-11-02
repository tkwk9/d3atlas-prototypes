import { onMount, createSignal, Index } from "solid-js";
import { createStore } from "solid-js/store";
import anime from "animejs";

import "./MineSweeper300.scss";

const baseIdleColor = "#878787";
const baseHoverColor = "#757575";
const baseclickedColor = "#605f5f";
const disabledColor = "#303030";

const Slot = (props) => {
  let ref;

  const handleMouseEnter = (e) => {
    anime({
      targets: ref,
      fill: baseHoverColor,
      duration: 50,
      easing: "easeInOutSine",
    });
  };
  const handleMouseLeave = (e) => {
    anime({
      targets: ref,
      fill: baseIdleColor,
      duration: 50,
      easing: "easeInOutSine",
    });
  };

  const handleMouseDown = (e) => {
    e.stopPropagation();
    anime({
      targets: ref,
      fill: baseclickedColor,
      duration: 50,
      easing: "easeInOutSine",
    });
  };
  const handleMouseUp = (e) => {
    e.stopPropagation();
    anime({
      targets: ref,
      fill: baseHoverColor,
      duration: 50,
      easing: "easeInOutSine",
    });
  };

  const isDisabled = props.colIdx > 19 || props.rowIdx > 19;

  return (
    <rect
      class={`slot ${isDisabled ? "disabled" : "clickable"}`}
      ref={ref}
      x={props.x}
      y={props.y}
      width={props.size}
      height={props.size}
      rx="2"
      stroke-width="0.5"
      stroke="#303030"
      fill={isDisabled ? disabledColor : baseIdleColor}
      onmouseenter={isDisabled ? null : handleMouseEnter}
      onmouseleave={isDisabled ? null : handleMouseLeave}
      onmousedown={isDisabled ? null : handleMouseDown}
      onmouseup={isDisabled ? null : handleMouseUp}
    />
  );
};

const mapSize = 80;
const MineSweeper300 = () => {
  const [dragPoint, setDragPoint] = createSignal(null);
  const [boardState, setBoardState] = createStore(
    new Array(mapSize)
      .fill(null)
      .map(() => new Array(mapSize).fill(null))
      .map((row) => row.map(() => 0))
  );

  let svgRef;
  let svgPoint;
  onMount(() => {
    svgPoint = svgRef.createSVGPoint();
  });

  // --- --- --- \\

  const handleMouseDown = (e) => {
    svgPoint.x = e.clientX;
    svgPoint.y = e.clientY;
    const screenCtm = svgRef.getScreenCTM().inverse();
    const mappedPoint = svgPoint.matrixTransform(screenCtm);

    setDragPoint({
      x: svgRef.viewBox.baseVal.x,
      y: svgRef.viewBox.baseVal.y,
      width: svgRef.viewBox.baseVal.width,
      height: svgRef.viewBox.baseVal.height,
      clientX: e.clientX,
      clientY: e.clientY,
      screenCtm,
      mappedPoint,
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
      `${svgRef.viewBox.baseVal.x + e.deltaY / 2},${
        svgRef.viewBox.baseVal.y + e.deltaY / 2
      },${svgRef.viewBox.baseVal.width - e.deltaY},${
        svgRef.viewBox.baseVal.height - e.deltaY
      }`
    );
  };

  const handleMouseMove = (e) => {
    if (!dragPoint()) return;

    const svgPoint = svgRef.createSVGPoint();
    svgPoint.x = e.clientX;
    svgPoint.y = e.clientY;
    const mappedPoint = svgPoint.matrixTransform(dragPoint().screenCtm);

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
        oncontextmenu="return false;"
        onmousedown={handleMouseDown}
        onwheel={handleWheel}
        onmouseup={handleMouseUp}
        onmousemove={handleMouseMove}
        onmouseleave={handleMouseLeave}
      >
        <Index each={boardState}>
          {(row, rowIdx) => (
            <Index each={row()}>
              {(_, colIdx) => (
                <Slot
                  x={`${rowIdx * 36 - (20 * 18 - 1)}`}
                  y={`${colIdx * 36 - (20 * 18 - 1)}`}
                  rowIdx={rowIdx}
                  colIdx={colIdx}
                  size={30}
                />
              )}
            </Index>
          )}
        </Index>
      </svg>
    </div>
  );
};

export default MineSweeper300;
