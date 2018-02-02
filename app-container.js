import { connect } from 'react-redux';
import App from './app';
import { updateTiles } from './actions';

const mapStateToProps = state => ({
  points: state.app.points,
});

const mapDispatchToProps = dispatch => ({
  viewportChange: (bounds, zoom) => {
    dispatch(updateTiles(bounds, zoom));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(App)
