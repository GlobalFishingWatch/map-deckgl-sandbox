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
        zoom: 4.01,
        bearing: 0,
        pitch: 0
      }
    };

  }

  componentDidMount() {
    window.addEventListener('resize', this._resize.bind(this));
    this.props.loadTracks();
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
    const {points, tracks} = this.props;
    // console.log(tracks)

    return (
      <div>
        <div className="debug">
          {points.length} points /
          {/*{tracks.reduce((accumulator, current) => accumulator + current.path.length, 0)} track points*/}
          {tracks.length} track points
        </div>
        <MapGL
          ref={(ref) => { this._ref = ref; } }
          mapStyle={'mapbox://styles/nerik/cjd68dvuj56s92snto98hj4ry'}
          {...viewport}
          onViewportChange={this._onViewportChange.bind(this)}
          mapboxApiAccessToken={MAPBOX_TOKEN}>
          <DeckGLOverlay viewport={viewport} points={points} tracks={tracks} />
        </MapGL>
      </div>
    );
  }
}

export default App;
