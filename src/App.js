import { render } from "solid-js/web";
import { Router, Route, Routes, A, Navigate } from "@solidjs/router";
import UsOne from "./pages/UsOne.js";
import "./App.scss";

const NavBar = () => (
  <div className="NavBar">
    <A href="/">Home</A>
    <A href="/us_1">US-1</A>
  </div>
);

const Content = () => {
  return (
    <div className="Content">
      <Routes>
        <Route
          end
          path="/"
          component={() => (
            <div className="Content-text">
              Isolation is the gift.
            </div>
          )}
        />
        <Route end path="/us_1" component={UsOne} />
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
