export function getTiles(bounds, zoom) {
  return (dispatch, getState) => {
    dispatch({
      type: 'test',
      payload: zoom
    });
  };
}
