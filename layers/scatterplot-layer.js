// Copyright (c) 2015 - 2017 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import {Layer, COORDINATE_SYSTEM, experimental} from 'deck.gl';
import {GL, Model, Geometry} from 'luma.gl';

import vs from './scatterplot-layer-vertex.glsl';
import fs from './scatterplot-layer-fragment.glsl';

const get = experimental.get;

const DEFAULT_COLOR = [.5, 0, 1];

const defaultProps = {
  radiusScale: 1,
  layerOpacity: 1,
  layerColor: DEFAULT_COLOR
};

export default class ScatterplotLayer extends Layer {
  getShaders(id) {
    const {shaderCache} = this.context;
    return {vs, fs, shaderCache};
  }

  initializeState() {
    const {gl} = this.context;
    this.setState({model: this._getModel(gl)});

    this.state.attributeManager.addInstanced({
      instancePositions: {size: 2, update: this.calculateInstancePositions},
      instanceRadius: {size: 1, defaultValue: 1, update: this.calculateInstanceRadius},
      instanceOpacity: {size: 1, update: this.calculateInstanceOpacity},
      instanceTime: {size: 1, update: this.calculateInstanceTime}
    });
    /* eslint-enable max-len */
  }

  // shouldUpdateState({props, oldProps, context, oldContext, changeFlags}) {
  //   const s = super.shouldUpdateState({props, oldProps, context, oldContext, changeFlags});
  //   console.log(changeFlags.dataChanged);
  //
  //   if (changeFlags.viewportChanged === true || changeFlags.propsChanged === true) {
  //     return true;
  //   }
  //   return false;
  // }

  updateAttribute({props, oldProps, changeFlags}) {
    if (props.fp64 !== oldProps.fp64) {
      const {attributeManager} = this.state;
      attributeManager.invalidateAll();

      if (props.fp64 && props.projectionMode === COORDINATE_SYSTEM.LNGLAT) {
        attributeManager.addInstanced({
          instancePositions64xyLow: {
            size: 2,
            accessor: 'getPosition',
            update: this.calculateInstancePositions64xyLow
          }
        });
      } else {
        attributeManager.remove([
          'instancePositions64xyLow'
        ]);
      }

    }
  }

  updateState({props, oldProps, changeFlags}) {
    super.updateState({props, oldProps, changeFlags});
    if (props.fp64 !== oldProps.fp64) {
      const {gl} = this.context;
      this.setState({model: this._getModel(gl)});
    }
    this.updateAttribute({props, oldProps, changeFlags});
  }

  draw({uniforms}) {
    const {radiusScale, innerTimeStart, innerTimeEnd, layerOpacity, layerColor} = this.props;
    this.state.model.render(Object.assign({}, uniforms, {
      radiusScale,
      innerTimeStart,
      innerTimeEnd,
      layerOpacity,
      layerColor
    }));
  }

  _getModel(gl) {
    // a square that minimally cover the unit circle
    const positions = [-1, -1, 0, -1, 1, 0, 1, 1, 0, 1, -1, 0];

    return new Model(gl, Object.assign(this.getShaders(), {
      id: this.props.id,
      geometry: new Geometry({
        drawMode: GL.TRIANGLE_FAN,
        positions: new Float32Array(positions)
      }),
      isInstanced: true,
      shaderCache: this.context.shaderCache
    }));
  }

  calculateInstancePositions(attribute) {
    const {data} = this.props;
    const {value} = attribute;
    let i = 0;
    for (const point of data) {
      const position = [point.longitude, point.latitude];
      value[i++] = get(position, 0);
      value[i++] = get(position, 1);
    }
  }

  calculateInstanceRadius(attribute) {
    const {data} = this.props;
    const {value} = attribute;
    let i = 0;
    for (const point of data) {
      const radius = point.radius;
      value[i++] = isNaN(radius) ? 1 : radius;
    }
  }

  calculateInstanceOpacity(attribute) {
    const {data} = this.props;
    const {value} = attribute;
    let i = 0;
    for (const point of data) {
      const opacity = point.opacity;
      value[i++] = opacity;
    }
  }

  calculateInstanceTime(attribute) {
    const {data} = this.props;
    const {value} = attribute;
    let i = 0;
    for (const point of data) {
      const time = point.timeIndex;
      value[i++] = time;
    }
  }
}

ScatterplotLayer.layerName = 'ScatterplotLayer';
ScatterplotLayer.defaultProps = defaultProps;
