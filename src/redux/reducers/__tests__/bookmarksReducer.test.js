import bookmarksReducer from '../bookmarksReducer';
import * as types from '../../actions/actionTypes';

describe('Bookmarks reducer', () => {
  it('has an initial state', () => {
    expect(bookmarksReducer(undefined, { type: undefined })).toEqual({
      bookmarks: [],
      error: null,
    });
  });
  it('it can send a get bookmarks request', () => {
    expect(
      bookmarksReducer(undefined, {
        type: types.REQUEST_BOOKMARKS,
      }),
    ).toEqual({
      bookmarks: [],
      error: null,
    });
  });
});
