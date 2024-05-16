const isServer = typeof window === "undefined";
// TODO: fix, URL adapter isn't working because service worker can't access replaceState
export default {
  getItem: (key) => {
    if (isServer) return;
    const params = new URLSearchParams(window.location.search);
    return params.get(key);
  },

  setItem: (key, value) => {
    if (isServer) return;
    const params = new URLSearchParams(window.location.search);
    params.set(key, value);
    window.history?.replaceState?.(
      {},
      "",
      `${window.location.pathname}?${params}`
    );
    return { key };
  },
  removeItem: (key) => {
    if (isServer) return;
    const params = new URLSearchParams(window.location.search);
    params.delete(key);
    window.history.replaceState?.(
      {},
      "",
      `${window.location.pathname}?${params}`
    );
    return { key };
  }
};
