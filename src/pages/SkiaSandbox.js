import { onMount, createSignal, Index } from "solid-js";
import { createStore } from "solid-js/store";

import "./SkiaSandbox.scss";

const SkiaSandbox = () => {
  const [audData, setAudData] = createStore([]);

  return (
    <div class="SkiaSandbox">
      <div
        class="title"
        style={`display:flex;flex-direction:column;justify-content:center;align-items:center`}
      >
        <h1 style={`padding: 0 0 20px`}>Welcome Back World</h1>
      </div>
    </div>
  );
};

export default SkiaSandbox;
