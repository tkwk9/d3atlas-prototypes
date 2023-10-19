import { onMount, createSignal } from "solid-js";
import anime from "animejs";
import Victor from "victor";

import "./SvgStressTest.scss";

const SvgStressTest = () => {
  return (
    <div class="SvgStressTest">
      <h1 class="title">SVG Stress Test: U</h1>
      <svg
        id={`MainSvg`}
        width="100%"
        height="100%"
      >
        <rect x="0" width="100" height="100" rx="15" stroke-width="1" stroke="black" fill="red"/>
      </svg>
    </div>
  );
};

export default SvgStressTest;
