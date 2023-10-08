import { Show, createResource } from "solid-js";
import { tsv, scaleLinear, scaleBand, max, formatLocale, format } from "d3";
import DummyStateTsvPath from "../assets/state-population-2010-2019.tsv";
import anime from "animejs";
const width = 900;
const height = 900;

const marginLeft = 20;
const marginRight = 20;
const marginTop = 20;
const marginBottom = 30;

const innerWidth = width - marginLeft - marginRight;
const innerHeight = height - marginTop - marginBottom;

//https://observablehq.com/@d3/d3-format
const xAxisTickFormat = format(".2s");
// const xAxisTickFormat = format(",.2r");

export default () => {
  let xScale, yScale, xTickFormat;
  const [data] = createResource(async () => {
    const data = await tsv(DummyStateTsvPath);
    console.log(data);
    const sliced = data.slice(0, 15);
    yScale = scaleBand()
      .domain(sliced.map((d) => d["State"]))
      .range([0, innerHeight])
      .paddingInner(0.2)
      .paddingOuter(0.5);
    xScale = scaleLinear()
      .domain([0, max(sliced, (d) => parseInt(d["2019"]))])
      .range([0, innerWidth]);
    console.log(xScale.ticks());
    console.log(xScale.ticks().map((tick) => xAxisTickFormat(tick)));
    return sliced;
  });

  return (
    <Show when={data()}>
      <div style={{ position: "absolute", top: "20px", left: "20px" }}>
        <button
          onclick={() => {
            anime({
              targets: `.bar`,
              scaleX: [0, 1],
              duration: 500,
              easing: "easeInQuad",
            });
          }}
        >
          Animate 1
        </button>
        <button
          onclick={() => {
            anime({
              targets: `.bar`,
              scaleX: [0, 1],
              opacity: [0, 1],
              duration: 1000,
              easing: "easeInQuad",
            });
          }}
        >
          Animate 2
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
          style={{ "background-color": "#B1BCBE" }}
        >
          <g
            transform={`translate(${marginLeft}, ${marginRight})`}
            x={marginLeft}
            y={marginTop}
          >
            {xScale.ticks().map((t) => {
              console.log(t);
              return (
                <>
                  <line
                    x1={xScale(t)}
                    y1={0}
                    x2={xScale(t)}
                    y2={innerHeight}
                    stroke="gray"
                  />
                  <text
                    style={{
                      "text-anchor": "middle",
                      "alignment-baseline": "before-edge",
                    }}
                    x={xScale(t)}
                    y={innerHeight}
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
              stroke="black"
            />
            {/* y-axis */}

            {data().map((d) => {
              return (
                <rect
                  class={"bar"}
                  x="0"
                  rx="2"
                  style={{ "border-radius": "5px" }}
                  y={yScale(d.State)}
                  width={xScale(d["2019"])}
                  height={yScale.bandwidth()}
                  fill="#acb5af"
                  stroke="#464a47"
                  stroke-width="1.5"
                />
              );
            })}
            <line x1={0} y1={0} x2={0} y2={innerHeight} stroke="black" />
          </g>
        </svg>
      </div>
    </Show>
  );
};
