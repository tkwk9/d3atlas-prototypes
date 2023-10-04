import { Show, createResource, createStore } from "solid-js";
import UsTopo from "../assets/counties-albers-10m.json";
import { csv, geoPath } from "d3";
import * as topojson from "topojson";

import countyFipsCsvPath from "../assets/county_fips_master.csv";

const height = "100%";
const width = "100%";

const getFips = async () => {
  const data = await csv(countyFipsCsvPath);
  const countyGeometries = UsTopo.objects.counties.geometries.reduce(
    (acc, el) => {
      acc[el.id] = el;
      return acc;
    },
    {}
  );
  const stateGeometries = UsTopo.objects.states.geometries.reduce((acc, el) => {
    acc[el.id] = el;
    return acc;
  }, {});

  const countyFipsData = data.reduce((acc, d) => {
    if (d.state == "NA") return acc;
    const stateId =
      d.state.toString().length === 1
        ? "0" + d.state.toString()
        : d.state.toString();

    let fips = d.fips.toString();
    while (fips.length < 5) {
      fips = "0" + fips;
    }

    acc[stateId] = acc[stateId] || {
      name: d.state_name,
      abbr: d.state_abbr,
      geometry: stateGeometries[stateId],
      counties: {},
    };
    acc[stateId].counties[fips] = {
      name: d.county_name,
      longName: d.long_name,
      geometry: countyGeometries[fips],
    };
    return acc;
  }, {});
  return countyFipsData;
};

const UsOne = () => {
  const [fips] = createResource(getFips);
  const [state, setState] = createStore({
    bbox: null,
    prevFocusId: null,
    focusId: null,
    layer: "nation",
  })
  
  const path = geoPath();

  return (
    <Show when={fips()}>
      <svg
        class="UsOne"
        width={width}
        height={height}
        // set default
        viewBox={`0 0 975 610`}
      >
        {Object.entries(fips()).map(([stateId, v]) => (
          <g class="UsOne-stateGroup">
            <path
              id={stateId}
              d={path(topojson.feature(UsTopo, v.geometry))}
              stroke="#aaa"
              stroke-width="0.5"
              fill="#636b78"
            />
            {Object.entries(v.counties).map(([countyId, v]) => (
              <path
                id={countyId}
                d={path(topojson.feature(UsTopo, v.geometry))}
                stroke="#aaa"
                stroke-width="0.2"
                fill="#636b78"
              />
            ))}
          </g>
        ))}
      </svg>
    </Show>
  );
};

export default UsOne;
