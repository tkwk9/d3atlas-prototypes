import { onMount, createSignal, Index } from "solid-js";
import CanvasKitInit from 'canvaskit-wasm';
import { createStore } from "solid-js/store";

import "./SkiaSandbox.scss";

const SkiaSandbox = () => {
  const [audData, setAudData] = createStore([]);
  CanvasKitInit().then((CanvasKit) => {
    // CanvasKit is now initialized and ready to use
    
    // Your CanvasKit code here, for example:
    const canvasEl = document.getElementById('myCanvas');
    if (!canvasEl) {
      console.error('Failed to find canvas element');
      return;
    }
  
    const surface = CanvasKit.MakeCanvasSurface(canvasEl.id);
    if (!surface) {
      console.error('Could not make surface');
      return;
    }
  
    const skCanvas = surface.getCanvas();
    // Example drawing: draw a blue rectangle
    const paint = new CanvasKit.SkPaint();
    paint.setColor(CanvasKit.Color4f(0, 0, 1, 1)); // RGBA: Blue
    paint.setStyle(CanvasKit.PaintStyle.Fill);
  
    skCanvas.drawRect(CanvasKit.LTRBRect(100, 100, 300, 300), paint);
    surface.flush();
  });

  return (
    <div class="SkiaSandbox">
      <div
        class="title"
        style={`display:flex;flex-direction:column;justify-content:center;align-items:center`}
      >
        <h1 style={`padding: 0 0 20px`}>Welcome Back World</h1>
      </div>
      <canvas id="myCanvas" width="500" height="400"></canvas>
    </div>
  );
};

export default SkiaSandbox;
