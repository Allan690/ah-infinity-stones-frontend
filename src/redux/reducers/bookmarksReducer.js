import { REQUEST_BOOKMARKS, BOOKMARKS_SUCCESS, BOOKMARKS_FAILURE } from '../actions/actionTypes';

const initialState = {
  bookmarks: [],
  error: null,
};


const bookmarksReducer = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST_BOOKMARKS:
      return {
        ...state,
      };
    case BOOKMARKS_SUCCESS:
      return {
        ...state,
        bookmarks: action.data.results,
      };
    case BOOKMARKS_FAILURE:
      return {
        ...state,
        error: 'action.error',
      };
    default:
      return state;
  }
};

export default bookmarksReducer;
