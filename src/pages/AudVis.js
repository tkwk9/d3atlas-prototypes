import { onMount, createSignal } from "solid-js";
import anime from "animejs";
import Victor from "victor";
import song from "../assets/Breakers_Break_Daft_Punk_Mash_Up.mp3";

import "./AudVis.scss";

const AudVis = () => {

  const [audData, setAudData] = createSignal([]);
  const play = () => {
    const context = new AudioContext();
    const analyser = context.createAnalyser();
    const numPoints = analyser.frequencyBinCount;
    const audioDataArray = new Uint8Array(numPoints);

    const audio = new Audio(song);
    audio.loop = true;
    audio.autoplay = true;

    audio.addEventListener("canplay", () => {
      const source = context.createMediaElementSource(audio);
      source.connect(analyser);
      analyser.connect(context.destination);
    });
    audio.load();
  };

  onMount(() => {
    
  });
  return (
    <div class="AudVis">
      <h1 class="title">AudVis: CP</h1>
      <button onclick={play}>clickme</button>
    </div>
  );
};

export default AudVis;
