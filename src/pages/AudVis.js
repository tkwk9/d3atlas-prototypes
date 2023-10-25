import { onMount, createSignal, Index } from "solid-js";
import { createStore } from "solid-js/store";
import anime from "animejs";
import Victor from "victor";
import song from "../assets/Breakers_Break_Daft_Punk_Mash_Up.mp3";

import "./AudVis.scss";

const AudVis = () => {
  const [audData, setAudData] = createStore([]);
  let buttonRef;

  const audio = new Audio(song);
  audio.loop = true;

  const play = () => {
    document.getElementById("removeme").remove();
    const context = new AudioContext();
    const analyser = context.createAnalyser();

    audio.load();
    audio.addEventListener("canplay", () => {
      const source = context.createMediaElementSource(audio);
      source.connect(analyser);
      analyser.connect(context.destination);
    });
    // audio.currentTime = 0
    audio.play();
    const numPoints = analyser.frequencyBinCount;
    const audData = new Uint8Array(numPoints);

    const getAudData = () => {
      analyser.getByteFrequencyData(audData);
      setAudData(audData);
      requestAnimationFrame(getAudData);
    };

    requestAnimationFrame(getAudData);
  };

  onMount(() => {});
  return (
    <div class="AudVis">
      <h1 class="title">AudVis: CP</h1>
      <button id={`removeme`} ref={buttonRef} onclick={play}>
        clickme
      </button>
      <div class={`wrapper`}>
        <Index each={audData}>{(item, idx) => <div>{item}</div>}</Index>
      </div>
    </div>
  );
};

export default AudVis;
