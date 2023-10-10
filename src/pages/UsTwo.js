import {
  Show,
  createResource,
  createRenderEffect,
  createEffect,
  onMount,
} from "solid-js";
import { createStore } from "solid-js/store";
import { useNavigate, useParams } from "@solidjs/router";
import { csv, geoPath } from "d3";
import anime from "animejs";
import * as topojson from "topojson";

import UsTopoJson from "../assets/counties-albers-10m.json";
import FipsCsvPath from "../assets/county_fips_master.csv";

import "./UsTwo.scss";

// SVG Helpers
const rearrangeSvg = (zoneNode) => {
  let currentGroupNode = zoneNode.parentNode;
  while (
    currentGroupNode.parentNode &&
    currentGroupNode.parentNode.classList.contains("UsTwo-zoneGroup")
  ) {
    currentGroupNode.parentNode.appendChild(currentGroupNode);
    currentGroupNode = currentGroupNode.parentNode;
  }
};

const removeAndAddZoneCushion = (zoneNode) => {
  document.getElementById(`zoneCushion`)?.remove();
  const zoneCushion = zoneNode.cloneNode(true);
  zoneCushion.classList.remove("UsTwo-zone");
  zoneCushion.setAttribute("fill", "#000");
  zoneCushion.setAttribute("id", "zoneCushion");
  zoneNode.parentNode.insertBefore(zoneCushion, zoneNode);
};

// State Getters
const currentVisibleZoneTypes = {
  nation: "state",
  state: "county",
  county: "county",
};

const zoneTypeToOffset = {
  nation: 12,
  state: 6,
  county: 2,
};

const getCurrentZoneTypeOffset = (state) =>
  zoneTypeToOffset[state.zoneStack[state.zoneStack.length - 1].zoneType];
const getCurrentVisibleZoneType = (state) =>
  currentVisibleZoneTypes[state.zoneStack[state.zoneStack.length - 1].zoneType];
const getCurrentZoneType = (state) =>
  state.zoneStack[state.zoneStack.length - 1].zoneType;
const getCurrentZoneId = (state) =>
  state.zoneStack[state.zoneStack.length - 1].zoneId;
const getCurrentZoneViewBox = (state) =>
  state.zoneStack[state.zoneStack.length - 1].zoneViewBox;

// Data Fetcher
const getFips = async () => {
  const data = await csv(FipsCsvPath);
  const countyGeometries = UsTopoJson.objects.counties.geometries.reduce(
    (geometries, geometry) => {
      geometries[geometry.id] = geometry;
      return geometries;
    },
    {}
  );

  const stateGeometries = UsTopoJson.objects.states.geometries.reduce(
    (geometries, geometry) => {
      geometries[geometry.id] = geometry;
      return geometries;
    },
    {}
  );

  return data.reduce((countyFipsData, d) => {
    if (d.state == "NA") return countyFipsData;
    const stateId =
      d.state.toString().length === 1
        ? "0" + d.state.toString()
        : d.state.toString();

    let fips = d.fips.toString();
    while (fips.length < 5) {
      fips = "0" + fips;
    }

    countyFipsData[stateId] = countyFipsData[stateId] || {
      name: d.state_name,
      abbr: d.state_abbr,
      geometry: stateGeometries[stateId],
      counties: {},
    };
    countyFipsData[stateId].counties[fips] = {
      name: d.county_name,
      longName: d.long_name,
      geometry: countyGeometries[fips],
    };
    return countyFipsData;
  }, {});
};

// Main Component
const UsTwo = (props) => {
  const [state, setState] = createStore({
    zoneStack: [
      {
        zoneId: "US",
        zoneType: "nation",
        zoneName: "United States",
        zoneAbbr: "US",
        // original box: 0 0 975 610
        zoneViewBox: "-40 -40 1055 690",
      },
    ],
  });

  const path = geoPath();

  const handleZoneClick = (e) => {
    setState((prevState) => {
      const bBox = e.target.getBBox();
      const zoneViewBox = `${bBox.x - 40} ${bBox.y - 40} ${bBox.width + 80} ${
        bBox.height + 80
      }`;
      const { zoneId, zoneType, zoneName, zoneAbbr } = e.target.dataset;
      const zoneStack = [
        ...prevState.zoneStack,
        { zoneId, zoneType, zoneName, zoneAbbr, zoneViewBox },
      ];
      anime({
        targets: `#g${getCurrentZoneId(prevState)}`,
        translateX: `0px`,
        translateY: `0px`,
        duration: 500,
        easing: "easeInQuad",
      });
      anime({
        targets: `#s${getCurrentZoneId(prevState)}, #c${getCurrentZoneId(
          prevState
        )}`,
        strokeWidth: getCurrentZoneType(prevState) === "state" ? 0.5 : 0.1,
        duration: 500,
        easing: "easeInQuad",
      });
      return { zoneStack };
    });

    const zoneNode = e.target;
    removeAndAddZoneCushion(zoneNode);
    // TODO: rename
    rearrangeSvg(zoneNode);

    // Animate
    const translateOffset = getCurrentZoneTypeOffset(state);
    anime({
      targets: `#g${getCurrentZoneId(state)}`,
      translateX: `${translateOffset}px`,
      translateY: `-${translateOffset}px`,
      duration: 500,
      easing: "easeInQuad",
    });
    anime({
      targets: `#s${getCurrentZoneId(state)}, #c${getCurrentZoneId(state)}`,
      strokeWidth: getCurrentZoneType(state) === "state" ? 2 : 1,
      duration: 500,
      easing: "easeInQuad",
    });
    anime({
      targets: "#MainSVG",
      viewBox: getCurrentZoneViewBox(state),
      duration: 500,
      easing: "easeInQuad",
    });
  };

  return (
    <>
      {/* TODO: Remove */}
      <button
        class="mapbutton"
        onclick={() => {
          if (state.zoneStack.length <= 1) return;
          setState((prevState) => {
            const zoneStack = [prevState.zoneStack[0]];
            document.getElementById(`zoneCushion`)?.remove();
            anime({
              targets: `#g${getCurrentZoneId(prevState)}`,
              translateX: `0px`,
              translateY: `0px`,
              duration: 500,
              easing: "easeInQuad",
            });
            anime({
              targets: `#s${getCurrentZoneId(prevState)}, #c${getCurrentZoneId(
                prevState
              )}`,
              strokeWidth:
                getCurrentZoneType(prevState) === "state" ? 0.5 : 0.1,
              duration: 500,
              easing: "easeInQuad",
            });
            return { zoneStack };
          });
          anime({
            targets: "#MainSVG",
            viewBox: getCurrentZoneViewBox(state),
            duration: 500,
            easing: "easeInQuad",
          });
        }}
      >
        Reset
      </button>
      <svg
        class="UsTwo"
        id="MainSVG"
        width="100%"
        height="100%"
        viewBox={`-40 -40 1055 690`}
      >
        <g id={`gUS`} class={`UsTwo-nationGroup UsTwo-zoneGroup`}>
          {Object.entries(props.fips).map(([stateId, v]) => (
            <g id={`g${stateId}`} class={`UsTwo-stateGroup UsTwo-zoneGroup`}>
              <path
                id={`s${stateId}`}
                class={`UsTwo-state UsTwo-zone ${v.name}`}
                data-zone-type="state"
                data-zone-id={stateId}
                data-zone-name={v.name}
                data-zone-abbr={v.abbr}
                onclick={handleZoneClick}
                d={path(topojson.feature(UsTopoJson, v.geometry))}
                stroke="#242722"
                stroke-width="0.5"
                fill={
                  getCurrentVisibleZoneType(state) === "state"
                    ? "#8294C4"
                    : "None"
                }
              />
              {Object.entries(v.counties).map(([countyId, v]) => (
                <g
                  id={`g${countyId}`}
                  class={`UsTwo-countyGroup UsTwo-zoneGroup`}
                >
                  <path
                    id={`c${countyId}`}
                    class={`UsTwo-county UsTwo-zone ${v.name} ${
                      getCurrentVisibleZoneType(state) === "county" &&
                      (getCurrentZoneId(state) !== stateId &&
                        getCurrentZoneId(state) !== countyId)
                        ? "disabled"
                        : ""
                    }`}
                    data-zone-type="county"
                    data-zone-id={countyId}
                    data-zone-name={v.name}
                    data-zone-abbr={v.abbr}
                    onclick={handleZoneClick}
                    d={path(topojson.feature(UsTopoJson, v.geometry))}
                    stroke="#242722"
                    stroke-width="0.1"
                    fill={
                      getCurrentVisibleZoneType(state) === "county"
                        ? "#8294C4"
                        : "None"
                    }
                  />
                </g>
              ))}
            </g>
          ))}
        </g>
      </svg>
    </>
  );
};

export default () => {
  const [fips] = createResource(getFips);
  return (
    <Show when={fips()}>
      <UsTwo fips={fips()} />
    </Show>
  );
};
