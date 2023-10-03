import { Show, createResource } from "solid-js";
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
  const path = geoPath();

  return (
    <Show when={fips()}>
      <svg
        className="UsMap"
        width={width}
        height={height}
        viewBox={`-10 -10 995 630`}
      >
        {Object.entries(fips()).map(([stateId, v]) => (
          <g
            key={`group-${stateId}`}
            id={`group-${stateId}`}
            stroke="#aaa"
            stroke-width="0.5"
            fill="#636b78"
          >
            <path
              key={stateId}
              id={stateId}
              d={path(topojson.feature(UsTopo, v.geometry))}
            />
            {Object.entries(v.counties).map(([countyId, v]) => (
              <path
                key={countyId}
                id={countyId}
                d={path(topojson.feature(UsTopo, v.geometry))}
              />
            ))}
          </g>
        ))}
      </svg>
    </Show>
  );
};

export default UsOne;