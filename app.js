/* global document */
import React, {Component} from 'react';
import MapGL from 'react-map-gl';
import DeckGLOverlay from './deckgl-overlay';
import MAPBOX_TOKEN from './mapbox-token';

class App extends Component {
  constructor(props) {
    super(props);
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
    if (viewport.latitude === undefined) {
      return;
    }
    this._map = this._ref.getMap();
    let bounds;
    if (this._map) {
      bounds = this._map.getBounds();
    }
    this.props.viewportChange(bounds, viewport);
  }

  render() {
    const {points, tracks, viewport} = this.props;
    const numDays = 180;
    // console.log(tracks)

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
          <DeckGLOverlay viewport={viewport} points={points} tracks={tracks} numDays={numDays} />
        </MapGL>
      </div>
    );
  }
}

export default App;
