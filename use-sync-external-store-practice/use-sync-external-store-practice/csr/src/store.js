function createStore(initialState) {
  let currentState = initialState;
  const listeners = new Set();
  return {
    getState: () => currentState,
    setState: (newState) => {
      console.log('%c-> developmentConsole: setState= EXTERNAL STORE', 'color:#77dcfd');
      currentState = newState;
      listeners.forEach((listener) => listener(currentState));
    },
    subscribe: (listener) => {
      listeners.add(listener);

      return () => listeners.delete(listener);
    },
  };
}

const store = createStore({
  value1: 0,
  value2: 0,
});

export default store;
