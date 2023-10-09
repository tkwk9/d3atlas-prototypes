import { Show, createResource } from "solid-js";
import { tsv, scaleLinear, scaleBand, max, formatLocale, format } from "d3";
import DummyStateTsvPath from "../assets/state-population-2010-2019.tsv";
import anime from "animejs";
const width = 1200;
const height = 800;

const marginLeft = 40;
const marginRight = 40;
const marginTop = 60;
const marginBottom = 40;

const innerWidth = width - marginLeft - marginRight;
const innerHeight = height - marginTop - marginBottom;

//https://observablehq.com/@d3/d3-format
const xAxisTickFormat = format(".2s");
// const xAxisTickFormat = format(",.2r");

let noanim = false;

export default () => {
  let xScale, yScale, xTickFormat;
  const [data] = createResource(async () => {
    const data = await tsv(DummyStateTsvPath);
    // console.log(data.sort((a, b) => a.State < b.State ? 1 : -1));
    // const sliced = data.slice(0, 22);
    const sliced = data.slice(0, 20);
    yScale = scaleBand()
      .domain(sliced.map((d) => d["State"]))
      .range([0, innerHeight])
      .paddingInner(0.2)
      .paddingOuter(0.2)
      .align(0);
    xScale = scaleLinear()
      .domain([0, max(sliced, (d) => parseInt(d["2019"])) * 1.1])
      .range([0, innerWidth]);
    // console.log(xScale.ticks());
    // console.log(xScale.ticks().map((tick) => xAxisTickFormat(tick)));
    return sliced;
  });

  return (
    <Show when={data()}>
      <div
        style={{
          display: "flex",
          "flex-direction": "column",
          "align-items": "center",
        }}
      >
        <div style={{ "margin-bottom": "10px" }}>
          <button
            onclick={() => {
              if (noanim) return;
              noanim = true;
              for (let i of document.getElementsByClassName("state-text")) {
                i.setAttribute("opacity", 0);
              }
              for (let i of document.getElementsByClassName("val-text")) {
                i.setAttribute("opacity", 0);
              }
              anime({
                targets: `.bar`,
                scaleX: [0, 1],
                duration: 500,
                easing: "easeInQuad",
                complete: () => {
                  noanim = false;
                },
              });
            }}
          >
            Animate 1
          </button>
          <button
            onclick={() => {
              if (noanim) return;
              for (let i of document.getElementsByClassName("state-text")) {
                i.setAttribute("opacity", 0);
              }
              for (let i of document.getElementsByClassName("val-text")) {
                i.setAttribute("opacity", 0);
              }
              noanim = true;
              anime({
                targets: `.bar`,
                scaleX: [0, 1],
                opacity: [0, 1],
                duration: 1000,
                easing: "easeInQuad",
                complete: () => {
                  noanim = false;
                },
              });
            }}
          >
            Animate 2
          </button>
          <button
            onclick={() => {
              if (noanim) return;
              noanim = true;
              for (let i of document.getElementsByClassName("state-text")) {
                i.setAttribute("opacity", 1);
              }
              for (let i of document.getElementsByClassName("val-text")) {
                i.setAttribute("opacity", 0);
              }
              for (let i of document.getElementsByClassName("bar")) {
                // console.log(-1 * i.getAttribute("width"));
                // console.log(i.getAttribute("width"));
                anime({
                  targets: i,
                  x: [-1 * i.getAttribute("width") - 1, -100],
                  // x: [0, i.getAttribute("x")],
                  // opacity: [0, 1],
                  duration: 1000,
                  easing: "easeInQuad",
                });
              }
              for (let i of document.getElementsByClassName("state-text")) {
                anime({
                  targets: i,
                  x: [-11, i.getAttribute("x")],
                  //   scaleX: [0, 1],
                  //   opacity: [0, 1],
                  duration: 1000,
                  easing: "easeInQuad",
                  complete: () => {
                    if (i.innerHTML === "California") noanim = false;
                  },
                });
              }
              // console.log(st);
              // st.forEach(() => console.log('hi'));
              // anime({
              //   targets: `.state-text`,
              //   //   x={}
              //   //   scaleX: [0, 1],
              //   //   opacity: [0, 1],
              //   duration: 500,
              //   easing: "easeInQuad",
              // });
            }}
          >
            Animate 3
          </button>
          <button
            onclick={() => {
              if (noanim) return;
              for (let i of document.getElementsByClassName("state-text")) {
                i.setAttribute("opacity", 1);
              }
              for (let i of document.getElementsByClassName("val-text")) {
                i.setAttribute("opacity", 0);
              }
              noanim = true;
              for (let i of document.getElementsByClassName("bar")) {
                anime({
                  targets: i,
                  x: [-1 * i.getAttribute("width") - 1, -100],
                  duration: 1000,
                  easing: "easeOutBounce",
                  // delay: anime.stagger(1, { direction: "reverse" }),
                });
              }
              for (let i of document.getElementsByClassName("state-text")) {
                anime({
                  targets: i,
                  x: [-11, i.getAttribute("x")],
                  duration: 1000,
                  easing: "easeOutBounce",
                  // delay: anime.stagger(1, { direction: "reverse" }),
                  complete: () => {
                    if (i.innerHTML === "California") noanim = false;
                  },
                });
              }
            }}
          >
            Animate 4
          </button>
          <button
            onclick={() => {
              if (noanim) return;
              noanim = true;
              for (let i of document.getElementsByClassName("state-text")) {
                i.setAttribute("opacity", 1);
              }
              for (let i of document.getElementsByClassName("val-text")) {
                i.setAttribute("opacity", 0);
              }
              const delayBase = 75;
              let delay = delayBase * 14;
              for (let i of document.getElementsByClassName("bar")) {
                // console.log(delay);
                anime({
                  targets: i,
                  x: [-1 * i.getAttribute("width") - 1, -100],
                  duration: 1000,
                  easing: "easeOutBounce",
                  delay: i.getAttribute("width"),
                  // delay: anime.stagger(1, { direction: "reverse" }),
                });
                delay -= delayBase;
              }
              delay = delayBase * 14;
              for (let i of document.getElementsByClassName("state-text")) {
                anime({
                  targets: i,
                  x: [-11, i.getAttribute("x")],
                  duration: 1000,
                  delay: parseFloat(i.getAttribute("x")) + 100,
                  easing: "easeOutBounce",
                  // delay: anime.stagger(1, { direction: "reverse" }),
                  complete: () => {
                    if (i.innerHTML === "California") noanim = false;
                  },
                });
                delay -= delayBase;
              }
            }}
          >
            Animate 5
          </button>
          <button
            onclick={() => {
              if (noanim) return;
              noanim = true;
              for (let i of document.getElementsByClassName("state-text")) {
                i.setAttribute("opacity", 1);
              }
              for (let i of document.getElementsByClassName("val-text")) {
                i.setAttribute("opacity", 0);
              }
              const delayBase = 75;
              let delay = delayBase * 14;
              for (let i of document.getElementsByClassName("bar")) {
                anime({
                  targets: i,
                  x: [-1 * parseFloat(i.getAttribute("width")) - 1, -100],
                  duration: 1000,
                  easing: "easeOutBounce",
                  delay: i.getAttribute("width"),

                  // delay: anime.stagger(1, { direction: "reverse" }),
                });
                // console.log(i.getAttribute("width"));
                delay -= delayBase;
              }
              delay = delayBase * 14;
              for (let i of document.getElementsByClassName("state-text")) {
                // console.log(
                //   "hg",
                //   document
                //     .getElementById(`${i.innerHTML}-bar`)
                //     .getAttribute("width")
                // );
                anime({
                  targets: i,
                  x: [-11, i.getAttribute("x")],
                  duration: 1000,
                  delay: document
                    .getElementById(`${i.innerHTML}-bar`)
                    .getAttribute("width"),
                  easing: "easeOutBounce",
                  complete: () => {
                    anime({
                      targets: document.getElementById(`${i.innerHTML}-val`),
                      innerHTML: ["0.0", i.innerHTML],
                      opacity: [0.0, 1.0],
                      easing: "linear",
                      duration: 300,
                      complete: () => {
                        if (i.innerHTML === "California") noanim = false;
                      },
                    });
                  },
                });
                delay -= delayBase;
                delay = delayBase * 14;
              }
            }}
          >
            Animate 6
          </button>
          <button
            onclick={() => {
              if (noanim) return;
              noanim = true;

              for (let i of document.getElementsByClassName("state-text")) {
                i.setAttribute("opacity", 1);
              }
              for (let i of document.getElementsByClassName("val-text")) {
                i.setAttribute("opacity", 0);
              }
              const delayBase = 75;
              let delay = delayBase * 14;
              for (let i of document.getElementsByClassName("bar")) {
                anime({
                  targets: i,
                  x: [-1 * parseFloat(i.getAttribute("width")) - 1, -100],
                  duration: 250 + parseFloat(i.getAttribute("width")),
                  easing: "easeOutBounce",

                  // delay: anime.stagger(1, { direction: "reverse" }),
                });
                // console.log(i.getAttribute("width"));
                delay -= delayBase;
              }
              delay = delayBase * 14;
              for (let i of document.getElementsByClassName("state-text")) {
                anime({
                  targets: i,
                  x: [-11, i.getAttribute("x")],
                  duration:
                    250 +
                    parseFloat(
                      document
                        .getElementById(`${i.innerHTML}-bar`)
                        .getAttribute("width")
                    ),

                  easing: "easeOutBounce",
                  complete: () => {
                    anime({
                      targets: document.getElementById(`${i.innerHTML}-val`),
                      innerHTML: ["0.0", i.innerHTML],
                      opacity: [0.0, 1.0],
                      easing: "linear",
                      duration: 300,
                      complete: () => {
                        if (i.innerHTML === "California") noanim = false;
                      },
                    });
                  },
                });
                delay -= delayBase;
                delay = delayBase * 14;
              }
            }}
          >
            Animate 7
          </button>
        </div>
        <div
          style={{
            width: `${width}px`,
            height: `${height}px`,
          }}
        >
          <svg
            width="100%"
            height="100%"
            style={{ "background-color": "#393939" }}
          >
            <text
              style={{
                "text-anchor": "middle",
                "alignment-baseline": "before-edge",
              }}
              x={width / 2}
              y={marginTop / 4}
              font-size="32px"
              dy="-4"
              fill="#aaaaaa"
            >
              Bar Chart: BFPoS
            </text>

            <svg
              transform={`translate(${marginLeft}, ${marginTop})`}
              x={marginLeft}
              y={marginTop}
            >
              {data().map((d) => {
                return (
                  <>
                    <rect
                      class={"bar"}
                      id={`${d.State}-bar`}
                      x="-100"
                      // ry="0"
                      rx="10"
                      style={{ "border-radius": "5px" }}
                      y={yScale(d.State)}
                      width={xScale(d["2019"]) + 100}
                      height={yScale.bandwidth()}
                      fill="#c6def1"
                      // stroke="#c6def1"
                      // stroke-width="1.5"
                    />
                    <text
                      class="state-text"
                      style={{
                        "text-anchor": "end",
                        "alignment-baseline": "central",
                      }}
                      x={xScale(d["2019"]) - 10}
                      y={yScale(d["State"]) + yScale.bandwidth() / 2}
                      fill="#1c1c1c"
                    >
                      {d["State"]}
                    </text>

                    <text
                      class="val-text"
                      id={`${d.State}-val`}
                      style={{
                        "text-anchor": "beginning",
                        "alignment-baseline": "central",
                      }}
                      font-size="24px"
                      x={xScale(d["2019"]) + 10}
                      y={yScale(d["State"]) + yScale.bandwidth() / 2}
                      fill="#aaaaaa"
                    >
                      {xAxisTickFormat(d["2019"])}
                    </text>
                  </>
                );
              })}
            </svg>
            {/* <rect
            fill={"#393939"}
            x="-1"
            y="0"
            width={marginLeft}
            height={height - marginBottom}
          /> */}
            <g
              transform={`translate(${marginLeft}, ${marginTop})`}
              x={marginLeft}
              y={marginTop}
            >
              {/* xScale lines */}
              {xScale.ticks().map((t) => {
                return (
                  <>
                    <line
                      x1={xScale(t)}
                      y1={innerHeight - 10}
                      x2={xScale(t)}
                      y2={innerHeight - 4}
                      stroke="#aaaaaa"
                    />
                  </>
                );
              })}
              {/* xScale labels */}
              {xScale.ticks().map((t) => {
                return (
                  <>
                    <text
                      style={{
                        "text-anchor": "middle",
                        "alignment-baseline": "before-edge",
                      }}
                      x={xScale(t)}
                      y={innerHeight}
                      dy="7"
                      fill="#aaaaaa"
                    >
                      {xAxisTickFormat(t)}
                    </text>
                  </>
                );
              })}
              {/* x-axis */}
              <line
                x1={0}
                y1={innerHeight}
                x2={innerWidth}
                y2={innerHeight}
                stroke="#aaaaaa"
              />
              {/* y-axis */}
              <line x1={0} y1={0} x2={0} y2={innerHeight} stroke="#aaaaaa" />
            </g>
          </svg>
        </div>
      </div>
    </Show>
  );
};
