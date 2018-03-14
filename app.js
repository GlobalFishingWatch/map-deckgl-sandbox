/* global document */
import React, {Component} from 'react';
import MapGL from 'react-map-gl';
import DeckGLOverlay from './deckgl-overlay-container';
import MAPBOX_TOKEN from './mapbox-token';

class App extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    window.addEventListener('resize', this._resize.bind(this));
    this.props.loadTracks();
    this._resize();

    this._map = this._ref.getMap();
    this.props.loadTiles(this._map.getBounds());
  }

  _resize() {
    this._onViewportChange({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  _onViewportChange(viewport) {
    if (viewport.latitude === undefined) {
      return;
    }
    this.props.viewportChange(viewport);
    // this.props.loadTiles(this._map.getBounds());
  }

  render() {
    const {points, tracks, viewport, numDays} = this.props;

    return (
      <div>
        <div className="debug">
          {points.length} points loaded /
          {/*{tracks.reduce((accumulator, current) => accumulator + current.path.length, 0)} track points*/}
          {tracks.length} track points /
          {numDays} days displayed
        </div>
        <MapGL
          ref={(ref) => { this._ref = ref; } }
          mapStyle={'mapbox://styles/nerik/cjd68dvuj56s92snto98hj4ry'}
          {...viewport}
          onViewportChange={this._onViewportChange.bind(this)}
          mapboxApiAccessToken={MAPBOX_TOKEN}>
          <DeckGLOverlay  />
        </MapGL>
      </div>
    );
  }
}

export default App;
