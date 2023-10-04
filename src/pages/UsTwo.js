import { Show, createResource, createEffect } from "solid-js";
import { createStore } from "solid-js/store";
import { csv, geoPath } from "d3";
import { gsap } from "gsap";
import * as topojson from "topojson";

import UsTopo from "../assets/counties-albers-10m.json";
import countyFipsCsvPath from "../assets/county_fips_master.csv";

import "./UsTwo.scss";

const layerToSelectableZone = {
  nation: "state",
  state: "county",
  county: "county",
};

// TODO: move to util
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

const UsTwo = () => {
  const [fips] = createResource(getFips);
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

  // TODO: remove
  createEffect(() => {
    console.log(state.focusId);
    console.log(state.zoneStack);
    console.log(fips());
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
    // replace with TweenJS
    gsap.to(".UsTwo", {
      duration: 1,
      attr: {
        viewBox: state.viewBox,
      },
      ease: "power3.inOut",
    });
  };

  return (
    <Show when={fips()}>
      <svg
        class="UsTwo"
        width="100%"
        height="100%"
        // original box: 0 0 975 610
        viewBox={`-40 -40 1055 690`}
      >
        {Object.entries(fips()).map(([stateId, v]) => (
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
              // TODO: Refactor
              fill={
                layerToSelectableZone[state.currentLayer] === "state"
                  ? "#636b78"
                  : "None"
              }
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
                  // TODO: Refactor
                  fill={
                    layerToSelectableZone[state.currentLayer] === "county"
                      ? "#636b78"
                      : "None"
                  }
                />
              </g>
            ))}
          </g>
        ))}
      </svg>
    </Show>
  );
};

export default UsTwo;
