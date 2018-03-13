const initialState = {
  tilesIndexes: [],
  tiles: [],
  points: [],
  tracks: [],
  viewport: {
    width: 1000,
    height: 800,
    latitude: 0,
    longitude: 0,
    zoom: 4.01,
    bearing: 0,
    pitch: 0
  }
};

export default function (state = initialState, action) {
  switch (action.type) {
  case 'add_tiles': {
    const newTilesIndexes = state.tilesIndexes.concat(action.payload.map(tile => tile.index));
    return Object.assign({}, state, { tilesIndexes: newTilesIndexes });
  }
  case 'update_tiles': {
    const newTile = action.payload;
    const newTiles = state.tiles.concat([newTile]);
    let points = [];
    // const t = performance.now();
    newTiles.forEach(tile => {
      points = points.concat(tile.data)
        .concat(tile.data)
        .concat(tile.data)
        .concat(tile.data);
    });
    return Object.assign({}, state, { tiles: newTiles, points });
  }
  case 'update_tracks': {
    return Object.assign({}, state, { tracks: state.tracks.concat(action.payload) });
  }
  case 'update_viewport': {
    return {...state, viewport: action.payload };
  }
  default:
    return state;
  }
}
