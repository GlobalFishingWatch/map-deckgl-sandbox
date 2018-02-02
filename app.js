/* global document */
import React, {Component} from 'react';
import {render} from 'react-dom';
import MapGL from 'react-map-gl';
import DeckGLOverlay from './deckgl-overlay';
import MAPBOX_TOKEN from './mapbox-token';

class Root extends Component {
  constructor(props) {
    super(props);

    const data = Array(3000000).fill(null).map((e, i) => {
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
        zoom: 5,
        bearing: -20.55991,
        pitch: 60
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
        {...viewport}
        onViewportChange={this._onViewportChange.bind(this)}
        mapboxApiAccessToken={MAPBOX_TOKEN}>
        <DeckGLOverlay viewport={viewport} data={data || []} />
      </MapGL>
    );
  }
}

render(<Root />, document.body.appendChild(document.createElement('div')));

