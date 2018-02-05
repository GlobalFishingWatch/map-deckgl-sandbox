import React, {Component} from 'react';
// import DeckGL, {LineLayer, ScatterplotLayer} from 'deck.gl';
import DeckGL, {PathLayer} from 'deck.gl';
import ScatterplotLayer from './scatterplot-layer';

export default class DeckGLOverlay extends Component {

  constructor(props) {
    super(props);
    this.state = {
      t: 0
    };
    this._tick = this._tick.bind(this);
  }

  componentDidMount() {
    this._animate();
  }

  // shouldComponentUpdate(nextProps) {
  //   if (nextProps.data.length !== this.props.data.length) {
  //     return true;
  //   }
  //   return false;
  // }

  _animate() {
    this.intervalTimer = window.setInterval(this._tick, 20);
  }

  _tick() {
    this.setState({t : this.state.t + 1});
  }

  render() {
    const {viewport, points, tracks} = this.props;
    const {t} = this.state;

    return (
      <DeckGL
        {...viewport}
        debug
        layers={[
          new ScatterplotLayer({
            id: 'scatterplot-layer',
            data: points,
            radiusScale: 400,
            outline: false,
            opacity: .5,
            innerTimeStart: t,
            innerTimeEnd: t + 300
          }),
          new PathLayer({
            id: 'path-layer',
            data: tracks,
            rounded: false,
            widthScale: 100000 / (viewport.zoom * viewport.zoom)
          })
        ]} />
    );
  }
}
