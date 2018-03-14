import { connect } from 'react-redux';
import DeckGLOverlay from './deckgl-overlay';

const mapStateToProps = state => ({
  points: state.app.points,
  tracks: state.app.tracks,
  viewport: state.app.viewport,
  day: state.app.day,
  numDays: state.app.numDays
});

const mapDispatchToProps = dispatch => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(DeckGLOverlay);
