import React from 'react';
import MapGL from 'react-map-gl';
import { render } from 'react-dom';
import MAPBOX_TOKEN from './mapbox-token';

const viewport = {
  width: 1000,
  height: 800,
  latitude: 0,
  longitude: 0,
  zoom: 4.01,
  bearing: 0,
  pitch: 0
};

render(
  <MapGL
    mapStyle={'mapbox://styles/nerik/cjd68dvuj56s92snto98hj4ry'}
    {...viewport}
    mapboxApiAccessToken={MAPBOX_TOKEN}>
  </MapGL>,
  document.body.appendChild(document.createElement('div'))
);

