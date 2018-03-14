import { connect } from 'react-redux';
import App from './app';
import { updateTiles, loadTracks, updateViewport } from './actions';

const mapStateToProps = state => ({
  points: state.app.points,
  tracks: state.app.tracks,
  viewport: state.app.viewport,
  numDays: state.app.numDays
});

const mapDispatchToProps = dispatch => ({
  viewportChange: (viewport) => {
    dispatch(updateViewport(viewport));
  },
  loadTiles: (bounds) => {
    dispatch(updateTiles(bounds));
  },
  loadTracks: () => {
    dispatch(loadTracks());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
