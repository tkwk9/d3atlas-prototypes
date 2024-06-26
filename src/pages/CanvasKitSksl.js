import { onMount, createSignal, Index, onCleanup } from "solid-js";
import { createStore } from "solid-js/store";
import CanvasKitInit from "canvaskit-wasm";

import "./CanvasKitSksl.scss";

// Source: @XorDev https://twitter.com/XorDev/status/1475524322785640455
const shaderCode = `
  uniform float2 iResolution;
  uniform float iTime;

  vec4 main(vec2 FC) {
    vec4 o = vec4(0);
    vec2 p = vec2(0), c=p, u=FC.xy*2.-iResolution.xy;
    float a;
    for (float i=0; i<4e2; i++) {
      a = i/2e2-1.0;
      p = cos(i*((sin(iTime/300.0))*1.4)+iTime/2.5+vec2(0,11))*sqrt(1.-a*a);
      c = u/iResolution.y+vec2(p.x,a)/(p.y+2.)/1.5;
      o += (cos(i+vec4((sin(iTime/5.0) + 1) * 4, 0, 4,0))+1.)/dot(c,c)*(1.-p.y)/((cos(iTime) + 1.3)*50000);
    }
    return o;
  }
`;

const canvasWidth = 700;
const canvasHeight = 500;

const CanvasKitSksl = () => {
  let animationFrameId;
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
      paint.setShader(
        shaderFactory.makeShader([
          canvasWidth, // iResolution.x
          canvasHeight, // iResolution.y
          elapsedTime / 1000.0, // iTime
        ])
      );

      canvas.drawRect(
        CanvasKit.LTRBRect(0, 0, canvasWidth, canvasHeight),
        paint
      );
      surface.flush();

      animationFrameId = requestAnimationFrame(drawFrame);
    };
    animationFrameId = requestAnimationFrame(drawFrame);
  });

  onCleanup(() => {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
  });

  return (
    <div class="CanvasKitSksl">
      <div
        class="title"
        style={`display:flex; flex-direction:column; justify-content:center; align-items:center;`}
      >
        <h1 style={`padding: 0 0 20px`}>CanvasKit &lt= SkSL</h1>
      </div>
      <div
        style={`display:flex; 
                background-color:#101010;
                border-radius:15px;
                box-shadow:0 10px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19);
              `}
      >
        <canvas
          id="myCanvas"
          width={canvasWidth}
          height={canvasHeight}
        ></canvas>
      </div>
      <div style={`color: rgb(162, 162, 162); padding-top: 8px;`}>
        Shader Source:{" "}
        <a
          href="https://twitter.com/XorDev/status/1475524322785640455"
          style={`color: rgb(162, 162, 162);`}
        >
          https://twitter.com/XorDev/status/1475524322785640455
        </a>
      </div>
      <div style={`color: rgb(162, 162, 162); padding-top: 8px;`}>
        CanvasKit Documentation:{" "}
        <a
          href="https://skia.org/docs/user/modules/canvaskit"
          style={`color: rgb(162, 162, 162);`}
        >
          https://skia.org/docs/user/modules/canvaskit
        </a>
      </div>
      <div style={`color: rgb(162, 162, 162); padding-top: 8px;`}>
        SkSL Documentation:{" "}
        <a
          href="https://skia.org/docs/user/sksl"
          style={`color: rgb(162, 162, 162);`}
        >
          https://skia.org/docs/user/sksl
        </a>
      </div>
    </div>
  );
};

export default CanvasKitSksl;
