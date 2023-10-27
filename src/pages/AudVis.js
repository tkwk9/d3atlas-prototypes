import { onMount, createSignal, Index } from "solid-js";
import { createStore } from "solid-js/store";
import song from "../assets/Breakers_Break_Daft_Punk_Mash_Up.mp3";

import "./AudVis.scss";

const AudVis = () => {
  const [audData, setAudData] = createStore([]);

  const audio = new Audio(song);
  audio.loop = true;

  const audContext = new AudioContext();
  const source = audContext.createMediaElementSource(audio);
  const analyser = audContext.createAnalyser();
  analyser.fftSize = 4096;

  source.connect(analyser);
  source.connect(audContext.destination);

  const freqArr = new Uint8Array(analyser.frequencyBinCount);

  let reqId;
  const getAudData = () => {
    analyser.getByteFrequencyData(freqArr);
    setAudData(freqArr);
    reqId = requestAnimationFrame(getAudData);
  };

  let isPlaying = false;
  const play = () => {
    if (isPlaying) {
      cancelAnimationFrame(reqId);
      audio.pause();
    } else {
      audContext.resume();
      audio.play();
      reqId = requestAnimationFrame(getAudData);
    }
    isPlaying = !isPlaying;
  };

  return (
    <div class="AudVis">
      <div
        class="title"
        style={`display:flex;flex-direction:column;justify-content:center;align-items:center`}
      >
        <h1 style={`padding: 0 0 20px`}>AudVis: CP</h1>
        <button onclick={play}>clickme</button>
      </div>

      <div class={`wrapper`}>
        <Index each={audData}>{(item) => <div>{item}</div>}</Index>
      </div>
    </div>
  );
};

export default AudVis;
