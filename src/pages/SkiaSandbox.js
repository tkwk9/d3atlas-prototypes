import { onMount, createSignal, Index } from "solid-js";
import { createStore } from "solid-js/store";
import CanvasKitInit from "canvaskit-wasm";

import "./SkiaSandbox.scss";

const SkiaSandbox = () => {
  CanvasKitInit({
    // TODO: figure out how to host this from cloudflare worker
    locateFile: (file) => "https://unpkg.com/canvaskit-wasm@0.39.1/bin/" + file,
  }).then((CanvasKit) => {
    // MakeSWCanvasSurface MakeWebGLCanvasSurface MakeGPUCanvasSurface
    const surface = CanvasKit.MakeWebGLCanvasSurface("myCanvas");

    const shaderCode = `
      half4 main(float2 coord) {
        float t = coord.x / 500;
        half4 white = half4(1);
        half4 black = half4(0,0,0,1);
        return mix(white, black, t);
      }
    `;

    const paint = new CanvasKit.Paint();
    const shader = CanvasKit.RuntimeEffect.Make(shaderCode).makeShader([]);
    paint.setShader(shader);

    surface.getCanvas().drawRect(CanvasKit.LTRBRect(0, 0, 500, 400), paint);
    surface.flush();
  });

  return (
    <div class="SkiaSandbox">
      <div
        class="title"
        style={`display:flex;flex-direction:column;justify-content:center;align-items:center`}
      >
        <h1 style={`padding: 0 0 20px`}>Skia Sandbox</h1>
      </div>
      <canvas id="myCanvas" width="500" height="400"></canvas>
    </div>
  );
};

export default SkiaSandbox;
