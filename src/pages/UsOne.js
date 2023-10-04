import { Show, createResource } from "solid-js";
import { createStore } from "solid-js/store";
import UsTopo from "../assets/counties-albers-10m.json";
import { csv, geoPath } from "d3";
import * as topojson from "topojson";

import countyFipsCsvPath from "../assets/county_fips_master.csv";

import "./UsOne.scss";

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

const UsOne = () => {
  const [fips] = createResource(getFips);
  const [state, setState] = createStore({
    viewBox: null,
    prevFocusId: null,
    focusId: null,
    layer: "nation",
  });

  const path = geoPath();
  console.log(UsTopo);

  return (
    <Show when={fips()}>
      <svg
        class="UsOne"
        width="100%"
        height="100%"
        // set default
        viewBox={`0 0 975 610`}
      >
        {Object.entries(fips()).map(([stateId, v]) => (
          <g class="UsOne-stateGroup">
            <path
              id={stateId}
              class="UsOne-state"
              d={path(topojson.feature(UsTopo, v.geometry))}
              stroke="#aaa"
              stroke-width="0.5"
              fill="#636b78"
            />
            {Object.entries(v.counties).map(([countyId, v]) => (
              <g class="UsOne-countyGroup">
                <path
                  id={countyId}
                  class="UsOne-county selected"
                  d={path(topojson.feature(UsTopo, v.geometry))}
                  stroke="#aaa"
                  stroke-width="0.2"
                  fill="#636b78"
                />
              </g>
            ))}
          </g>
        ))}
      </svg>
    </Show>
  );
};

export default UsOne;
