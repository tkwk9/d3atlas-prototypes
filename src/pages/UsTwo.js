import { Show, createResource } from "solid-js";
import { createStore } from "solid-js/store";
import { csv, geoPath } from "d3";
import { gsap } from "gsap";
import * as topojson from "topojson";

import UsTopo from "../assets/counties-albers-10m.json";
import countyFipsCsvPath from "../assets/county_fips_master.csv";

import "./UsTwo.scss";

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
    selectableLayer: "state",
  });

  const path = geoPath();
  const handleZoneClick = (e) => {
    const bBox = e.target.getBBox();
    const viewBox = `${bBox.x - 40} ${bBox.y - 40} ${bBox.width + 80} ${
      bBox.height + 80
    }`;
    const prevFocusId = state.focusId;
    const focusId = e.target.dataset.zoneId;
    setState({ viewBox, prevFocusId, focusId });
    gsap.to(".UsTwo", {
      duration: 1,
      attr: {
        viewBox,
      },
      ease: "power3.inOut",
    });

    console.log(e.target.dataset);
  };

  return (
    <Show when={fips()}>
      <svg
        class="UsTwo"
        width="100%"
        height="100%"
        // set default // original box: 0 0 975 610
        viewBox={`-40 -40 1055 690`}
      >
        {Object.entries(fips()).map(([stateId, v]) => (
          <g class="UsTwo-stateGroup">
            <path
              id={stateId}
              class={`UsTwo-state`}
              data-zone-type="state"
              data-zone-id={stateId}
              onclick={handleZoneClick}
              d={path(topojson.feature(UsTopo, v.geometry))}
              stroke="#aaa"
              stroke-width="0.5"
              fill="#636b78"
            />
            {Object.entries(v.counties).map(([countyId, v]) => (
              <g class="UsTwo-countyGroup">
                <path
                  id={countyId}
                  class={`UsTwo-county`}
                  data-zone-type="county"
                  data-zone-id={countyId}
                  onclick={handleZoneClick}
                  d={path(topojson.feature(UsTopo, v.geometry))}
                  stroke="#aaa"
                  stroke-width="0.1"
                  // fill="#636b78"
                  fill="None"
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
