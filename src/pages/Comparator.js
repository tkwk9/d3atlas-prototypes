import { onMount, createSignal } from "solid-js";

import "./Comparator.scss";
let anchor = { x: 0, y: 0 };

const Box = () => {
  const [isGrabbed, setIsGrabbed] = createSignal(false);
  const [leftPad, setLeftPad] = createSignal(0);
  const [rightPad, setRightPad] = createSignal(0);
  onMount(() => {
    const theBox = document.getElementById("box1");
    theBox.addEventListener("mousedown", (e) => {
      console.log("mousedown");
      setIsGrabbed(true);
      setLeftPad(e.clientY - theBox.getBoundingClientRect().top);
      setRightPad(e.clientX - theBox.getBoundingClientRect().left);
    });
    theBox.addEventListener("mouseup", (e) => {
      console.log("mouseup");
      setIsGrabbed(false);
    });
    theBox.addEventListener("mousemove", (e) => {
      if (isGrabbed()) {
        console.log(e);
        theBox.setAttribute(
          "style",
          `top: ${
            e.clientY - leftPad()
          }px; left: ${
            e.clientX - rightPad()
          }px`
        );
      }
    });
  });

  return <div id="box1" class={`box ${isGrabbed() ? "selected" : ""}`} />;
};

const Wrapper = () => {
  return (
    <div class="Wrapper">
      <Box />
    </div>
  );
};

const Comparator = () => {
  return (
    <div class="Comparator">
      <h1 class="title">Comparator: GoFCSSPJS</h1>
      <Wrapper />
    </div>
  );
};

export default Comparator;
