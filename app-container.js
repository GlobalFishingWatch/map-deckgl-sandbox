import { connect } from 'react-redux';
import App from './app';
import { updateTiles, loadTracks, updateViewport } from './actions';

const mapStateToProps = state => ({
  points: state.app.points,
  tracks: state.app.tracks,
  viewport: state.app.viewport
});

const mapDispatchToProps = dispatch => ({
  viewportChange: (bounds, viewport) => {
    dispatch(updateViewport(viewport));
    dispatch(updateTiles(bounds, viewport.zoom));
  },
  loadTracks: () => {
    dispatch(loadTracks());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
