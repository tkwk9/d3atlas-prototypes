import { onMount, createSignal } from "solid-js";
import anime from "animejs";

import "./DragBox.scss";

const Box = () => {
  const [isGrabbed, setIsGrabbed] = createSignal(false);

  onMount(() => {
    const theBox = document.getElementById("box1");
    theBox.addEventListener("mousedown", (e) => {
      console.log("mousedown");
      setIsGrabbed(true);
      
      theBox.setAttribute(
        "style",
        `top: ${e.clientY - 35.625}px; left: ${e.clientX - 35.625}px; position: fixed`
      );
    });

    theBox.addEventListener("mouseup", (e) => {
      console.log("mouseup");
      const theWrapper = document.getElementById("wrapper1");
      setIsGrabbed(false);
      theBox.classList.add("intrasit");
      anime({
        targets: `#box1`,
        top: `${theWrapper.getBoundingClientRect().top + 2.5}px`,
        left: `${theWrapper.getBoundingClientRect().left + 2.5}px`,
        duration: 75,
        easing: "easeInQuad",
        complete: () => {
          theBox.classList.remove("intrasit");
          theBox.setAttribute(
            "style",
            `position: absolute`
          );
        },
      });
    });

    document.addEventListener("mousemove", (e) => {
      if (isGrabbed()) {
        console.log(e);
        theBox.setAttribute(
          "style",
          `top: ${e.clientY - 35.625}px; left: ${e.clientX - 35.625}px`
        );
      }
    });
  });

  return <div id="box1" class={`box`} />;
};

const Wrapper = () => {
  return (
    <div id="wrapper1" class="Wrapper">
      <Box />
    </div>
  );
};

const DragBox = () => {
  return (
    <div class="DragBox">
      <h1 class="title">DragBox: A</h1>
      <Wrapper />
    </div>
  );
};

export default DragBox;
