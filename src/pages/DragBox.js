import { onMount, createSignal } from "solid-js";
import anime from "animejs";
import Victor from "victor";

import "./DragBox.scss";

const Box = (props) => {
  const [isGrabbed, setIsGrabbed] = createSignal(false);

  onMount(() => {
    const theBox = document.getElementById(`box${props.boxId}`);
    theBox.addEventListener("mousedown", (e) => {
      // console.log("mousedown");
      setIsGrabbed(true);

      theBox.setAttribute(
        "style",
        `top: ${e.clientY - 35.625}px; left: ${
          e.clientX - 35.625
        }px; position: fixed`
      );
    });

    theBox.addEventListener("mouseup", (e) => {
      // console.log("mouseup");
      let theWrapper;
      let dist = 10000000;
      document.querySelectorAll(".Wrapper").forEach((el) => {
        const a = new Victor(
          el.getBoundingClientRect().left,
          el.getBoundingClientRect().top
        );
        const b = new Victor(e.clientX, e.clientY);
        if (dist > a.distance(b)) {
          dist = a.distance(b);
          theWrapper = el;
        }
      });

      theWrapper.appendChild(theBox);

      // const theWrapper = document.getElementById(`wrapper${props.boxId}`);
      setIsGrabbed(false);
      theBox.classList.add("intransit");
      anime({
        targets: `#box${props.boxId}`,
        // top: `${theWrapper.getBoundingClientRect().top + 2.5}px`,
        // left: `${theWrapper.getBoundingClientRect().left + 2.5}px`,
        delay: 75,
        width: "95px",
        height: "47.5px",
        duration: 75,
        // easing: "easeOutElastic(1, .6)",
        // complete: () => {
        //   theBox.classList.remove("intransit");
        //   theBox.setAttribute("style", `position: absolute`);
        // },
      });
      anime({
        targets: `#box${props.boxId}`,
        top: `${theWrapper.getBoundingClientRect().top + 2.5}px`,
        left: `${theWrapper.getBoundingClientRect().left + 2.5}px`,
        // width: "95px",
        // height: "47.5px",
        duration: 150,
        easing: "easeOutElastic(1, .6)",
        complete: () => {
          theBox.classList.remove("intransit");
          theBox.setAttribute("style", `position: absolute`);
        },
      });
    });

    let currentWrapper;

    document.addEventListener("mousemove", (e) => {
      if (isGrabbed()) {
        // console.log(e);
        theBox.setAttribute(
          "style",
          `top: ${e.clientY - 35.625}px; left: ${e.clientX - 35.625}px`
        );
        let theWrapper;
        let dist = 10000000;
        document.querySelectorAll(".Wrapper").forEach((el) => {
          const a = new Victor(
            el.getBoundingClientRect().left,
            el.getBoundingClientRect().top
          );
          const b = new Victor(e.clientX, e.clientY);
          if (dist > a.distance(b)) {
            dist = a.distance(b);
            theWrapper = el;
          }
        });
        if (theWrapper === currentWrapper) return;
        console.log(theWrapper);
        currentWrapper?.classList?.remove("target");
        theWrapper?.classList?.add("target");
        currentWrapper = theWrapper;
      }
    });
  });

  return <div id={`box${props.boxId}`} class={`box`} />;
};

const Wrapper = (props) => {
  return (
    <div
      id={`wrapper${props.wrapperId}`}
      class={`Wrapper ${props.wrapperId === 1 ? "target" : ""}`}
    >
      {props.wrapperId === 1 ? <Box boxId={props.wrapperId} /> : null}
    </div>
  );
};

const DragBox = () => {
  return (
    <div class="DragBox">
      <h1 class="title">Drag-and-Drop: A2</h1>
      <div style={{ display: "flex", "flex-direction": "row" }}>
        <Wrapper wrapperId={1} />
        <div style={{ height: "100px", width: "600px" }} />
        <Wrapper wrapperId={2} />
      </div>
      <div
        style={{
          display: "flex",
          "flex-direction": "row",
          "margin-top": "250px",
        }}
      >
        <Wrapper wrapperId={3} />
        <div style={{ height: "100px", width: "600px" }} />
        <Wrapper wrapperId={4} />
      </div>
    </div>
  );
};

export default DragBox;
