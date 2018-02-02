import { connect } from 'react-redux';
import App from './app';
import { getTiles } from './actions';

const mapStateToProps = state => ({
  z: state.app.z,
});

const mapDispatchToProps = dispatch => ({
  viewportChange: (bounds, zoom) => {
    dispatch(getTiles(bounds, zoom));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(App)
