const initialState = {}

export default function (state = initialState, action) {
  switch (action.type) {
  // case INIT_HEATMAP_LAYERS: {
  //   return Object.assign({}, state, {heatmapLayers: action.payload});
  // }

  case 'test':
    return Object.assign({}, state, { z: action.payload });
  default:
    return state;
  }
}
