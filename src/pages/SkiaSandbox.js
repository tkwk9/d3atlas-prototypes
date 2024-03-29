import { onMount, createSignal, Index } from "solid-js";
import { createStore } from "solid-js/store";
import CanvasKitInit from "canvaskit-wasm";

import "./SkiaSandbox.scss";

// Source: @XorDev https://twitter.com/XorDev/status/1475524322785640455
const shaderCode = `
  uniform float2 iResolution;
  uniform float iTime;

  vec4 main(vec2 FC) {
    vec4 o = vec4(0);
    vec2 p = vec2(0), c=p, u=FC.xy*2.-iResolution.xy;
    float a;
    for (float i=0; i<4e2; i++) {
      a = i/2e2-1.;
      p = cos(i*2.4+iTime+vec2(0,11))*sqrt(1.-a*a);
      c = u/iResolution.y+vec2(p.x,a)/(p.y+2.);
      o += (cos(i+vec4(0,2,4,0))+1.)/dot(c,c)*(1.-p.y)/3e4;
    }
    return o;
  }
`;

const canvasWidth = 800;
const canvasHeight = 600;

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
      
      // TODO: figure out if there's a way to pass named uniform
      paint.setShader(shaderFactory.makeShader([
        canvasWidth, // iResolution.x
        canvasHeight, // iResolution.y
        elapsedTime/1000.0 // iTime
      ]));

      canvas.drawRect(CanvasKit.LTRBRect(0, 0, canvasWidth, canvasHeight), paint);
      surface.flush();

      requestAnimationFrame(drawFrame);
    }
    requestAnimationFrame(drawFrame);
  });

  return (
    <div class="SkiaSandbox">
      <div
        class="title"
        style={`display:flex; flex-direction:column; justify-content:center; align-items:center`}
      >
        <h1 style={`padding: 0 0 20px`}>Skia Sandbox</h1>
      </div>
      <div style={`background-color: black`}>
        <canvas id="myCanvas" width={canvasWidth} height={canvasHeight}></canvas>
      </div>
    </div>
  );
};

export default SkiaSandbox;
