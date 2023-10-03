import { render } from "solid-js/web";
import { Router, Route, Routes, A, Navigate } from "@solidjs/router";
import "./App.scss";

const NavBar = () => (
  <div className="NavBar">
    <A href="/">Home</A>
    <A href="/xyz">XYZ</A>
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
            <span className="Content-text">{"Hello World :)"}</span>
          )}
        />
        <Route
          end
          path="/xyz"
          component={() => <span className="Content-text">{"XYZ"}</span>}
        />
        <Route path="/*" component={<Navigate href={"/"} />} />
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
