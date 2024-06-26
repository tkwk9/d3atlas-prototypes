import { render } from "solid-js/web";
import { Router, Route, Routes, A, Navigate } from "@solidjs/router";
import UsOne from "./pages/UsOne.js";
import UsTwo from "./pages/UsTwo.js";
import UsThree from "./pages/UsThree.js";
import BarChartAnimation from "./pages/BarChartAnimation.js";
import DragBox from "./pages/DragBox.js";
import Console from "./pages/Console.js";
import Minesweeper from "./pages/Minesweeper.js";
import SvgStressTest from "./pages/SvgStressTest.js";
import CanvasStressTest from "./pages/CanvasStressTest.js";
import AudVis from "./pages/AudVis.js";
import Minesweeper300 from "./pages/MineSweeper300.js";
import CanvasKitSksl from "./pages/CanvasKitSksl.js";
import "./App.scss";

const NavBar = () => (
  <div className="NavBar">
    <A href="/">Home</A>
    <A href="/us_1">US-1</A>
    <A href="/us_2">US-2</A>
    <A href="/bar_chart_animation">BarChartAnimation</A>
    <A href="/comparator">DragBox</A>
    <A href="/console">Console</A>
    <A href="/minesweeper">Minesweeper</A>
    <A href="/svgstresstest">SvgStressTest</A>
    <A href="/canvasstresstest">CanvasStressTest</A>
    <A href="/audvis">AudVis</A>
    <A href="/minesweeper300">Minesweeper300</A>
    <A href="/canvaskit_sksl">CanvasKitSksl</A>
  </div>
);

const Content = () => {
  return (
    <div className="Content">
      <Routes>
        <Route
          path="/"
          end
          component={() => (
            <div className="Content-text">
              Home
            </div>
          )}
        />
        <Route path="/us_1" end component={UsOne} />
        <Route path="/us_2/:stateId?/:countyId?" end component={UsTwo} />
        <Route path="/us_3/:stateId?/:countyId?" end component={UsThree} />
        <Route path="/bar_chart_animation" end component={BarChartAnimation} />
        <Route path="/comparator" end component={DragBox} />
        <Route path="/console" end component={Console} />
        <Route path="/minesweeper" end component={Minesweeper} />
        <Route path="/svgstresstest" end component={SvgStressTest} />
        <Route path="/canvasstresstest" end component={CanvasStressTest} />
        <Route path="/audvis" end component={AudVis} />
        <Route path="/minesweeper300" end component={Minesweeper300} />
        <Route path="/canvaskit_sksl" end component={CanvasKitSksl} />
        <Route path="*" end element={<Navigate href={"/"} />} />
      </Routes>
    </div>
  );
};

const App = () => (
  <Router>
    <NavBar />
    <Content />
  </Router>
);

const rootElement = document.getElementById("root");
render(() => <App />, root);
