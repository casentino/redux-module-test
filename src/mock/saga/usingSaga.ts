import { call, CallEffect, fork, ForkEffect, put, PutEffect, select, SelectEffect, take, TakeEffect, takeEvery } from "redux-saga/effects";
import * as actions from "./action";
import fetch from "isomorphic-fetch";
import { postsByRedditSelector, RedditPostsState, selectedRedditSelector } from "./reducer";

export function fetchPostsApi(reddit: string) {
  return fetch(`https://www.reddit.com/r/${reddit}.json`)
    .then((response) => response.json())
    .then((json) => json.data.children.map((child: { data: any }) => child.data));
}

export function* fetchPosts(reddit: string): Generator<PutEffect | CallEffect<any[]>, void, any[]> {
  yield put(actions.requestPosts(reddit));
  const posts = yield call(fetchPostsApi, reddit);
  yield put(actions.receivePosts(reddit, posts));
}

export function* invalidateReddit() {
  while (true) {
    const { reddit } = yield take(actions.INVALIDATE_REDDIT);
    yield call(fetchPosts, reddit);
  }
}
type SelectedRedditSelector = ReturnType<typeof selectedRedditSelector>;
type PostsByRedditSelector = ReturnType<typeof postsByRedditSelector>;

const isStr = (arg: string | RedditPostsState): arg is string => typeof arg === "string";

export function* nextRedditChange(): Generator<SelectEffect | TakeEffect | ForkEffect, void, string | RedditPostsState> {
  while (true) {
    const prevReddit = yield select(selectedRedditSelector);

    yield take(actions.SELECT_REDDIT);

    let newReddit = yield select(selectedRedditSelector);

    const postsByReddit = yield select(postsByRedditSelector);

    if (isStr(prevReddit) && isStr(newReddit) && !isStr(postsByReddit)) {
      if (prevReddit !== newReddit && !postsByReddit[newReddit]) yield fork(fetchPosts, newReddit);
    }
  }
}

export function* startup(): Generator<SelectEffect | ForkEffect, void, string> {
  const selectedReddit = yield select(selectedRedditSelector);
  yield fork(fetchPosts, selectedReddit);
}

export default function* root() {
  yield fork(startup);
  yield fork(nextRedditChange);
  yield fork(invalidateReddit);
}
