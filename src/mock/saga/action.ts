export const REQUEST_POSTS = "REQUEST_POSTS" as const;
export const RECEIVE_POSTS = "RECEIVE_POSTS" as const;
export const SELECT_REDDIT = "SELECT_REDDIT" as const;
export const INVALIDATE_REDDIT = "INVALIDATE_REDDIT" as const;

export function selectReddit(reddit: string) {
  return {
    type: SELECT_REDDIT,
    reddit,
  };
}
export type SelectRedditAction = ReturnType<typeof selectReddit>;
export function invalidateReddit(reddit: string) {
  return {
    type: INVALIDATE_REDDIT,
    reddit,
  };
}
export type InvalidateRedditAction = ReturnType<typeof invalidateReddit>;

export function requestPosts(reddit: string) {
  return {
    type: REQUEST_POSTS,
    reddit,
  };
}
export type RequestPostsAction = ReturnType<typeof requestPosts>;

export function receivePosts(reddit: string, posts: any[]) {
  return {
    type: RECEIVE_POSTS,
    reddit,
    posts,
    receivedAt: new Date().setMilliseconds(0),
  };
}
export type ReceivePostsAction = ReturnType<typeof receivePosts>;
