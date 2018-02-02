/* global document */
import React, {Component} from 'react';
import {render} from 'react-dom';
import MapGL from 'react-map-gl';
import DeckGLOverlay from './deckgl-overlay';
import tilecover from '@mapbox/tile-cover';
import MAPBOX_TOKEN from './mapbox-token';

class Root extends Component {
  constructor(props) {
    super(props);

    const data = Array(100000).fill(null).map((e, i) => {
      return {
        radius: 5,
        color: [255, 0, 0],
        position: [
          -45 + Math.random() * 90,
          -45 + Math.random() * 90,
        ],
        time: i
      };
    });

    this.state = {
      viewport: {
        width: 1000,
        height: 800,
        latitude: 0,
        longitude: 0,
        zoom: 5.01,
        bearing: 0,
        pitch: 0
      },
      data
    };

  }

  componentDidMount() {
    window.addEventListener('resize', this._resize.bind(this));
    this._resize();
  }

  _resize() {
    this._onViewportChange({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  _onViewportChange(viewport) {
    this._map = this._ref.getMap();
    if (this._map) {
      const zoom = this._map.getZoom()
      const bounds = this._map.getBounds()
      //  [w, s, e, n]
      const [w, s, e, n] = [bounds.getWest(), bounds.getSouth(), e, bounds.getNorth()];
      // console.log(tile);
      // console.log(tilebelt.bboxToTile([ -178, 84, -177, 85 ]));
      const geom = {
        'type': 'Polygon',
        'coordinates': [
          [[w, n],[e, n],[e, s],[w, s],[w, n]]
        ]
      }

      var limits = {
        min_zoom: Math.floor(zoom),
        max_zoom: Math.floor(zoom)
      };

      console.log(tilecover.tiles(geom, limits))
    }
    this.setState({
      viewport: {...this.state.viewport, ...viewport}
    });
  }

  render() {
    const {viewport, data} = this.state;
    // const l = -15 + Math.random() * 30;
    // const filteredData = data.filter(d => d.position[0] > l);
    return (
      <MapGL
        ref={(ref) => { this._ref = ref; } }
        {...viewport}
        onViewportChange={this._onViewportChange.bind(this)}
        mapboxApiAccessToken={MAPBOX_TOKEN}>
        <DeckGLOverlay viewport={viewport} data={data || []} />
      </MapGL>
    );
  }
}

render(<Root />, document.body.appendChild(document.createElement('div')));

