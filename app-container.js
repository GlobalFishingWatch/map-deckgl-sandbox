import { connect } from 'react-redux';
import App from './app';
import { updateTiles, loadTracks } from './actions';

const mapStateToProps = state => ({
  points: state.app.points,
  tracks: state.app.tracks
});

const mapDispatchToProps = dispatch => ({
  viewportChange: (bounds, zoom) => {
    //dispatch(updateTiles(bounds, zoom));
  },
  loadTracks: () => {
    dispatch(loadTracks());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(App)
