import { render } from "solid-js/web";
import { Router, Route, Routes, A, Navigate } from "@solidjs/router";
import UsOne from "./pages/UsOne.js";
import UsTwo from "./pages/UsTwo.js";
import UsThree from "./pages/UsThree.js";
import Sandbox from "./pages/Sandbox.js";
import "./App.scss";

const NavBar = () => (
  <div className="NavBar">
    <A href="/">Home</A>
    <A href="/us_1">US-1</A>
    <A href="/us_2">US-2</A>
    <A href="/us_3">US-3</A>
    <A href="/sandbox">Sandbox</A>
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
        <Route path="/sandbox" end component={Sandbox} />
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
