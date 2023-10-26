import { onMount, createSignal, Index } from "solid-js";
import { createStore } from "solid-js/store";
import anime from "animejs";
import Victor from "victor";
import song from "../assets/Breakers_Break_Daft_Punk_Mash_Up.mp3";

import "./AudVis.scss";

const AudVis = () => {
  const [audData, setAudData] = createStore([]);

  const audio = new Audio(song);
  audio.loop = true;

  audio.load();

  const audContext = new AudioContext();

  const source = audContext.createMediaElementSource(audio);
  const analyser = audContext.createAnalyser();

  source.connect(analyser);
  analyser.connect(audContext.destination);

  const freqArr = new Uint8Array(analyser.frequencyBinCount);
  const getAudData = () => {
    analyser.getByteFrequencyData(freqArr);
    setAudData(freqArr);
    requestAnimationFrame(getAudData);
  };
  requestAnimationFrame(getAudData);

  const play = () => {
    audio.currentTime = 0;
    audContext.resume();
    audio.play();
  };

  return (
    <div class="AudVis">
      <h1 class="title">AudVis: CP</h1>
      <button onclick={play}>clickme</button>
      <div class={`wrapper`}>
        <Index each={audData}>{(item) => <div>{item}</div>}</Index>
      </div>
    </div>
  );
};

export default AudVis;
