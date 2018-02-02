/* global document */
import React, {Component} from 'react';
import MapGL from 'react-map-gl';
import DeckGLOverlay from './deckgl-overlay';
import MAPBOX_TOKEN from './mapbox-token';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        width: 1000,
        height: 800,
        latitude: 0,
        longitude: 0,
        zoom: 5.01,
        bearing: 0,
        pitch: 0
      }
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
      this.props.viewportChange(bounds, zoom);

    }
    this.setState({
      viewport: {...this.state.viewport, ...viewport}
    });
  }

  render() {

    const {viewport} = this.state;
    const {points} = this.props;

    return (
      <div>
        <div className="debug">
          {points.length} points
        </div>
        <MapGL
          ref={(ref) => { this._ref = ref; } }
          {...viewport}
          onViewportChange={this._onViewportChange.bind(this)}
          mapboxApiAccessToken={MAPBOX_TOKEN}>
          <DeckGLOverlay viewport={viewport} data={points || []} />
        </MapGL>
      </div>
    );
  }
}

export default App;
