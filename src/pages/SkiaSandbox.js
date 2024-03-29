import { onMount, createSignal, Index } from "solid-js";
import { createStore } from "solid-js/store";
import CanvasKitInit from "canvaskit-wasm";

import "./SkiaSandbox.scss";

const shaderCode = `
  uniform float iTime;

  half4 main(float2 coord) {
    float3 white = float3(0,0,0);
    float3 black = float3(1,0,0);
    return half4(mix(white, black, sin(iTime)), 1);
  }
`;

const SkiaSandbox = () => {
  CanvasKitInit({
    // TODO: figure out how to host this from cloudflare
    locateFile: (file) => "https://unpkg.com/canvaskit-wasm@0.39.1/bin/" + file,
  }).then((CanvasKit) => {
    // MakeSWCanvasSurface MakeWebGLCanvasSurface MakeGPUCanvasSurface
    const surface = CanvasKit.MakeWebGLCanvasSurface("myCanvas");
    const canvas = surface.getCanvas();

    const paint = new CanvasKit.Paint();
    const shaderFactory = CanvasKit.RuntimeEffect.Make(shaderCode);

    const startTime = Date.now();
    const drawFrame = () => {
      let currentTime = Date.now();
      let elapsedTime = currentTime - startTime;
      
      paint.setShader(shaderFactory.makeShader([
        // TODO: figure out if there's a way to pass named uniform
        elapsedTime/1000.0 //iTime
      ]));
      canvas.drawRect(CanvasKit.LTRBRect(0, 0, 500, 400), paint);
      surface.flush();

      requestAnimationFrame(drawFrame);
    }
    requestAnimationFrame(drawFrame);
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
