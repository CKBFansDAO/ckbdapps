import { useSyncExternalStore } from "react";

const URL_CHANGE = "url-search:change";

const subscribe = (cb: () => void) => {
  window.addEventListener("popstate", cb);
  window.addEventListener(URL_CHANGE, cb);
  return () => {
    window.removeEventListener("popstate", cb);
    window.removeEventListener(URL_CHANGE, cb);
  };
};

/** The URL's query string, "" on the server and during hydration so static HTML stays the default. */
export const useUrlSearch = () =>
  useSyncExternalStore(
    subscribe,
    () => window.location.search,
    () => "",
  );

/** Call after history.replaceState, which fires no event of its own. */
export const notifyUrlSearch = () => window.dispatchEvent(new Event(URL_CHANGE));
