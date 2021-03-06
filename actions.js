import tilecover from '@mapbox/tile-cover/index';
import _ from 'lodash';
import {
  getTilePromises,
  getCleanVectorArrays,
  groupData,
  getTilePlaybackData,
  getTracksPlaybackData
} from './heatmapTileData';

function _loadLayerTile(tileCoordinates, token, temporalExtentsIndices, { urls, temporalExtents, temporalExtentsLess, isPBF }) {
  const layerUrl = urls.default[0][0];
  const pelagosPromises = getTilePromises(layerUrl, token, temporalExtents, {
    tileCoordinates,
    temporalExtentsIndices,
    temporalExtentsLess,
    isPBF
  });
  const allLayerPromises = Promise.all(pelagosPromises);

  const layerTilePromise = new Promise((resolve) => {
    allLayerPromises.then((rawTileData) => {
      resolve(rawTileData);
    });
  });

  return layerTilePromise;
}

function _parseLayerTile(rawTileData, colsByName, isPBF, tileCoordinates, map, prevPlaybackData) {
  let data;
  if (isPBF === true) {
    if (rawTileData === undefined || !rawTileData.length || rawTileData[0] === undefined || !Object.keys(rawTileData[0].layers).length) {
      return [];
    }
    data = rawTileData[0].layers.points;
  } else {
    const cleanVectorArrays = getCleanVectorArrays(rawTileData);
    data = groupData(cleanVectorArrays, Object.keys(colsByName));
    if (Object.keys(data).length === 0) {
      return [];
    }
  }
  const playbackData = getTilePlaybackData(
    data,
    colsByName,
    tileCoordinates,
    isPBF,
    prevPlaybackData
  );
  return playbackData;
}

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InNmOmh0dHBzOi8vdGVzdC5zYWxlc2ZvcmNlLmNvbS9pZC8wMEQ2MzAwMDAwMDh3YldFQVEvMDA1NjMwMDAwMDE3OEZoQUFJIiwidmVyc2lvbiI6MiwiaWF0IjoxNTE1NTgyNTcwfQ.Mo4TH0xXD0krVQByrkczwNNIO3kbxo-SLDPs4P1wPgk';
const temporalExtents = [[1325376000000, 1356998400000]];

function _loadTiles(updatedTiles) {
  return (dispatch) => {
    const allPromises = [];
    updatedTiles.forEach((updatedTile) => {
      const coords = {
        x: updatedTile.coords[0],
        y: updatedTile.coords[1],
        zoom: [updatedTile.coords[2]]
      };
      const tilePromise = _loadLayerTile(
        coords,
        token,
        [0],
        {
          temporalExtents,
          urls: {
            'default': [['https://api-dot-world-fishing-827.appspot.com/v2/tilesets/516-resample-v2']]
          }
        }
      );

      const tile = {
        tileCoordinates: coords,
        index: updatedTile.index
      };

      allPromises.push(tilePromise);

      tilePromise.then((rawTileData) => {
        tile.data = _parseLayerTile(
          rawTileData,
          {
            datetime: {type: 'Float32'},
            latitude: {type: 'Float32'},
            longitude: {type: 'Float32'},
            sigma: {type: 'Float32'},
            weight: {type: 'Float32'}
          },
          false,
          coords,
          null,
          undefined
        );
        dispatch({
          type: 'update_tiles', payload: tile
        });
      });
    });
    Promise.all(allPromises).then(() => {
      console.log('all tiles loaded');
    });
  };
}

function _loadTracks(seriesgroup) {
  return (dispatch) => {
    let allPromises = getTilePromises(
      'https://api-dot-world-fishing-827.appspot.com/v2/tilesets/516-resample-v2',
      token,
      temporalExtents, {
        seriesgroup
      });

    Promise.all(allPromises.map(p => p.catch(e => e)))
      .then((rawTileData) => {
        const cleanData = getCleanVectorArrays(rawTileData);

        if (!cleanData.length) {
          return;
        }
        const groupedData = groupData(cleanData, [
          'latitude',
          'longitude',
          'datetime',
          'series',
          'weight',
          'sigma'
        ]);

        // const vectorArray = addTracksPointsRenderingData(groupedData);

        dispatch({
          type: 'update_tracks',
          payload: getTracksPlaybackData(groupedData)
        });
      });
  };
}

export function updateTiles(bounds) {
  return (dispatch, getState) => {
    const zoom = getState().app.viewport.zoom;
    const [w, s, e, n] = [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()];
    const geom = {
      'type': 'Polygon',
      'coordinates': [
        [[w, n],[e, n],[e, s],[w, s],[w, n]]
      ]
    };

    var limits = {
      min_zoom: Math.ceil(zoom),
      max_zoom: Math.ceil(zoom)
    };

    const updatedTilesCoords = tilecover.tiles(geom, limits);
    const updatedTilesIndexes = tilecover.indexes(geom, limits);
    const updatedTiles = updatedTilesCoords.map((coords, i) => {
      return {
        coords,
        index: updatedTilesIndexes[i]
      };
    }).filter(tile => getState().app.tilesIndexes.indexOf(tile.index) === -1);

    dispatch({
      type: 'add_tiles',
      payload: updatedTiles
    });


    dispatch(_loadTiles(updatedTiles));
  };
}

export function loadTracks() {
  return (dispatch) => {
    dispatch(_loadTracks(6531094));
    dispatch(_loadTracks(958751));
  };
  // https://api-dot-skytruth-pelagos-production.appspot.com/v2/tilesets/516-resample-v2/sub/seriesgroup=6531094/2012-01-01T00:00:00.000Z,2013-01-01T00:00:00.000Z;0,0,0
  // https://api-dot-skytruth-pelagos-production.appspot.com/v2/tilesets/516-resample-v2/sub/seriesgroup=958751/2012-01-01T00:00:00.000Z,2013-01-01T00:00:00.000Z;0,0,0
}


const allowPlay = _.debounce(dispatch => { dispatch({type: 'allow_play'}); }, 100);
const allowPlayDebounced = () => allowPlay;

export function updateViewport(viewport) {
  return (dispatch) => {
    dispatch({
      type: 'disallow_play'
    });
    dispatch(allowPlayDebounced());
    dispatch({
      type: 'update_viewport',
      payload: viewport
    });
  };
}

export function tick() {
  return (dispatch, getState) => {
    requestAnimationFrame(() => { dispatch(tick()); });
    console.log(getState().app.allowPlay)
    if (getState().app.allowPlay === true) {
      dispatch({
        type: 'tick'
      });
    }
  };
}

export function startTimer() {
  return (dispatch) => {
    setTimeout(() => {
      dispatch(tick());
    }, 3000);
  };
}
