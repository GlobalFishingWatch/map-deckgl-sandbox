import React, {Component} from 'react';
// import DeckGL, {LineLayer, ScatterplotLayer} from 'deck.gl';
import DeckGL, {LineLayer} from 'deck.gl';
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

  _animate() {
    this.intervalTimer = window.setInterval(this._tick, 20);
  }

  _tick() {
    this.setState({t : this.state.t + 1});
  }

  render() {
    const {viewport, points, tracks} = this.props;
    const {t} = this.state;
    //console.log(100000 / (viewport.zoom * viewport.zoom))

    return (
      <DeckGL
        {...viewport}
        debug
        layers={[
          // new ScatterplotLayer({
          //   id: 'scatterplot-layer',
          //   data: points,
          //   radiusScale: 400,
          //   outline: false,
          //   opacity: 1,
          //   innerTimeStart: t,
          //   innerTimeEnd: t + 300
          // }),
          new LineLayer({
            id: 'line-layer',
            data: tracks,
            strokeWidth: 2
          })
          // new PathLayer({
          //   id: 'path-layer',
          //   data: tracks,
          //   rounded: false,
          //   widthScale: 5000
          //   // widthScale: 100000 / (viewport.zoom * viewport.zoom)
          // })
        ]} />
    );
  }
}
