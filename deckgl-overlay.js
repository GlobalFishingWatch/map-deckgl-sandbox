import React, {Component} from 'react';
// import DeckGL, {IconLayer} from 'deck.gl';
import DeckGL from 'deck.gl';
import ScatterplotLayer from './layers/scatterplot-layer';
import LineLayer from './layers/line-layer';
import IconLayer from './layers/icon-layer';
import {hsvToRgb, hueToRgbString, hueIncrementToHue, wrapHue} from "./util/colors";

const _getVesselTexture = (radius, blurFactor) => {
  const tplCanvas = document.createElement('canvas');
  const tplCtx = tplCanvas.getContext('2d');
  const diameter = radius * 2;
  const NUM_STYLES = 3;

  const VESSELS_HUES_INCREMENTS_NUM = 31;

  // tplCanvas.width = (diameter * NUM_STYLES) + (NUM_STYLES - 1); // + (NUM_STYLES - 1): tiny offset between 2 frames
  // tplCanvas.height = (diameter * VESSELS_HUES_INCREMENTS_NUM) + VESSELS_HUES_INCREMENTS_NUM;  tplCanvas.width = (diameter * NUM_STYLES) + (NUM_STYLES - 1); // + (NUM_STYLES - 1): tiny offset between 2 frames
  tplCanvas.width = tplCanvas.height = 256;

  tplCtx.fillStyle = 'rgba(0,0,0,255)';
  tplCtx.fillRect(0, 0, 256, 256);

  for (let hueIncrement = 0; hueIncrement < VESSELS_HUES_INCREMENTS_NUM; hueIncrement++) {
    const y = (diameter * hueIncrement) + hueIncrement;
    const yCenter = y + radius;

    // heatmap style
    let x = radius;
    const gradient = tplCtx.createRadialGradient(x, yCenter, radius * blurFactor, x, yCenter, radius);
    const hue = hueIncrementToHue(hueIncrement);
    const rgbString = hueToRgbString(hue);
    gradient.addColorStop(0, rgbString);

    const rgbOuter = hsvToRgb(wrapHue(hue + 30), 80, 100);
    gradient.addColorStop(1, `rgba(${rgbOuter.r}, ${rgbOuter.g}, ${rgbOuter.b}, 0)`);

    tplCtx.fillStyle = gradient;
    tplCtx.fillRect(0, y, diameter, diameter);

    // circle style
    x += diameter + 1; // tiny offset between 2 frames
    tplCtx.beginPath();
    tplCtx.arc(x, yCenter, radius, 0, 2 * Math.PI, false);
    tplCtx.fillStyle = rgbString;
    tplCtx.fill();

    // bullseye style
    x += diameter + 1;
    tplCtx.beginPath();
    tplCtx.arc(x, yCenter, radius * 0.4, 0, 2 * Math.PI, false);
    tplCtx.fillStyle = rgbString;
    tplCtx.fill();
    tplCtx.beginPath();
    tplCtx.arc(x, yCenter, radius * 0.95, 0, 2 * Math.PI, false);
    tplCtx.lineWidth = 1;
    tplCtx.strokeStyle = rgbString;
    tplCtx.stroke();
  }

  const img = new Image();
  img.src = tplCanvas.toDataURL();
  img.style.position = 'absolute';
  img.style.zIndex = 99;
  //document.body.appendChild(img);

  // const texture = new Texture2D(this.context.gl, {id: 'heatmap', data: img});

  return img;
};

const ICON_IMAGE = _getVesselTexture(8, .15);

export default class DeckGLOverlay extends Component {

  constructor(props) {
    super(props);
    this.state = {
      t: 0
    };
    this.onClickHandler = this.onClickHandler.bind(this);
  }


  onClickHandler(event) {
    const pickInfo = this.deckGL.queryVisibleObjects({x: event.clientX, y: event.clientY, width: 10, height: 10 });
    console.log(pickInfo);
    // console.log( this.deckGL.queryObject({x: event.clientX, y: event.clientY, radius: 10  }));
  }

  render() {
    const {viewport, points, tracks, day, numDays} = this.props;
    //console.log(100000 / (viewport.zoom * viewport.zoom))

    // const iconMapping = {
    //   marker: {x: 0 + t, y: 0, width: 16, height: 16, mask: false}
    // };

    return (
      <div onClick={this.onClickHandler}>
        <div className="debug -right">frame: {day}</div>
        <DeckGL
          ref={deck => { this.deckGL = deck; }}
          {...viewport}
          debug
          layers={[
            // new IconLayer({
            //   id: 'icon-layer',
            //   data: points,
            //   sizeScale: 2,
            //   iconAtlas: ICON_IMAGE,
            //   // iconAtlas: './icon-atlas.png',
            //   // iconMapping: ICON_MAPPING
            //   // iconMapping
            // })
            new ScatterplotLayer({
              id: 'scatterplot-layer',
              data: points,
              radiusScale: 30000,
              outline: false,
              opacity: 1,
              innerTimeStart: day,
              innerTimeEnd: day + numDays,
              pickable: true
            }),

            new LineLayer({
              id: 'line-layer',
              data: tracks,
              strokeWidth: 2,
              opacity: 1,
              innerTimeStart: day,
              innerTimeEnd: day + numDays
            })

            // new PathLayer({
            //   id: 'path-layer',
            //   data: tracks,
            //   rounded: false,
            //   widthScale: 5000
            //   // widthScale: 100000 / (viewport.zoom * viewport.zoom)
            // })
          ]}
        />
      </div>
    );
  }
}
