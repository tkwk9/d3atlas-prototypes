import {
  Show,
  createResource,
  createRenderEffect,
  createEffect,
  onMount,
} from "solid-js";
import { createStore } from "solid-js/store";
import { useParams } from "@solidjs/router";
import { csv, geoPath } from "d3";
import anime from "animejs";
import * as topojson from "topojson";

import UsTopo from "../assets/counties-albers-10m.json";
import countyFipsCsvPath from "../assets/county_fips_master.csv";

import "./UsTwo.scss";

// Helpers
const layerToSelectableZone = {
  nation: "state",
  state: "county",
};

const getIsSelectable = (state, zoneType) =>
  layerToSelectableZone[state.currentLayer] === zoneType;

const getFips = async () => {
  const data = await csv(countyFipsCsvPath);
  const countyGeometries = UsTopo.objects.counties.geometries.reduce(
    (geometries, geometry) => {
      geometries[geometry.id] = geometry;
      return geometries;
    },
    {}
  );

  const stateGeometries = UsTopo.objects.states.geometries.reduce(
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

const UsTwo = (props) => {
  onMount(() => console.log(document.getElementById("MainSVG")));
  const [state, setState] = createStore({
    viewBox: null,
    prevFocusId: null,
    focusId: null,
    zoneStack: [
      {
        zoneId: "US",
        zoneType: "nation",
        zoneName: "United States",
        zoneAbbr: "US",
      },
    ],
    currentLayer: "nation",
  });

  const path = geoPath();

  const handleZoneClick = (e) => {
    setState((prevState) => {
      const bBox = e.target.getBBox();
      const viewBox = `${bBox.x - 40} ${bBox.y - 40} ${bBox.width + 80} ${
        bBox.height + 80
      }`;
      const prevFocusId = prevState.focusId;
      const { zoneId, zoneType, zoneName, zoneAbbr } = e.target.dataset;
      const zoneStack = [
        ...prevState.zoneStack,
        { zoneId, zoneType, zoneName, zoneAbbr },
      ];
      const focusId = e.target.dataset.zoneId;
      const currentLayer = e.target.dataset.zoneType;
      return { viewBox, prevFocusId, focusId, currentLayer, zoneStack };
    });
    anime({
      targets: "#MainSVG",
      viewBox: state.viewBox,
      duration: 500,
      easing: "easeInQuad",
      complete: () => console.log("done"),
    });
  };

  return (
      <svg
        class="UsTwo"
        id="MainSVG"
        width="100%"
        height="100%"
        // original box: 0 0 975 610
        viewBox={`-40 -40 1055 690`}
      >
        {Object.entries(props.fips).map(([stateId, v]) => (
          <g id={`g${stateId}`} class="UsTwo-stateGroup">
            <path
              id={stateId}
              class={`UsTwo-state UsTwo-zone`}
              data-zone-type="state"
              data-zone-id={stateId}
              data-zone-name={v.name}
              data-zone-abbr={v.abbr}
              onclick={handleZoneClick}
              d={path(topojson.feature(UsTopo, v.geometry))}
              stroke="#aaa"
              stroke-width="0.5"
              fill={getIsSelectable(state, "state") ? "#636b78" : "None"}
            />
            {Object.entries(v.counties).map(([countyId, v]) => (
              <g id={`g${countyId}`} class="UsTwo-countyGroup">
                <path
                  id={countyId}
                  class={`UsTwo-county UsTwo-zone`}
                  data-zone-type="county"
                  data-zone-id={countyId}
                  data-zone-name={v.name}
                  data-zone-abbr={v.abbr}
                  onclick={handleZoneClick}
                  d={path(topojson.feature(UsTopo, v.geometry))}
                  stroke="#aaa"
                  stroke-width="0.1"
                  fill={getIsSelectable(state, "county") ? "#636b78" : "None"}
                />
              </g>
            ))}
          </g>
        ))}
      </svg>
  );
};

export default () => {
  const [fips] = createResource(getFips);
  return (
    <Show when={fips()}>
      <UsTwo fips={fips()}/>
    </Show>
  )
}
