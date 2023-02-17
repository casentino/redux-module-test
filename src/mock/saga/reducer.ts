import { CombinedState, combineReducers } from "redux";
import { SELECT_REDDIT, REQUEST_POSTS, RECEIVE_POSTS, SelectRedditAction, RequestPostsAction, ReceivePostsAction } from "./action";

function selectedReddit(state = "reactjs", action: SelectRedditAction) {
  switch (action.type) {
    case SELECT_REDDIT:
      return action.reddit;
    default:
      return state;
  }
}

interface RequestPostState {
  isFetching: boolean;
  items: any[];
  lastUpdated?: number;
}
export interface RedditPostsState {
  [name: string]: RequestPostState;
}
function posts(
  state: RequestPostState = {
    isFetching: false,
    items: [],
  },
  action: RequestPostsAction | ReceivePostsAction
) {
  switch (action.type) {
    case REQUEST_POSTS:
      return { ...state, isFetching: true };

    case RECEIVE_POSTS:
      return {
        ...state,
        isFetching: false,
        items: action.posts,
        lastUpdated: action.receivedAt,
      };
    default:
      return state;
  }
}

function postsByReddit(state: RedditPostsState = {}, action: RequestPostsAction | ReceivePostsAction) {
  switch (action.type) {
    case REQUEST_POSTS:
    case RECEIVE_POSTS:
      return {
        ...state,
        [action.reddit]: posts(state[action.reddit], action),
      };
    default:
      return state;
  }
}

export const selectedRedditSelector = (state: RootState) => state.selectedReddit;
export const postsByRedditSelector = (state: RootState) => state.postsByReddit;

type RootState = CombinedState<{
  postsByReddit: typeof postsByReddit;
  selectedReddit: typeof selectedReddit;
}>;

const rootReducer = combineReducers({
  postsByReddit,
  selectedReddit,
});

export default rootReducer;
