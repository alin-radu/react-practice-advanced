import { useEffect, useState, useSyncExternalStore } from 'react';
import store from './store';

const useStore = (selector = (state) => state) => {
  console.log('%c-> developmentConsole: useStore=2 ', 'color:#77dcfd');

  const [state, setState] = useState(selector(store.getState()));

  useEffect(() => store.subscribe((state) => setState(selector(state))), []);

  return state;
};

// const useStore = (selector = (state) => state) =>
//   useSyncExternalStore(store.subscribe, () => selector(store.getState()));

const DisplayValue = ({ item }) => {
  console.log('%c-> developmentConsole: DisplayValue=1 ', 'color:#77dcfd');

  const itemValue = useStore((state) => state[item]);

  console.log(
    '%c-> developmentConsole: DisplayValue |  itemValue | item ---> ',
    'color:#77dcfd',
    item,
    '=',
    itemValue
  );

  return (
    <div>
      {item}: {itemValue}
    </div>
  );
};

const IncrementValue = ({ item }) => (
  <button
    onClick={() => {
      const state = store.getState();
      store.setState({
        ...state,
        [item]: state[item] + 1,
      });
    }}
  >
    Increment {item}
  </button>
);

function App() {
  console.log('%c-> developmentConsole: App --->  ', 'color:#77dcfd');
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        maxWidth: 600,
        gap: '1rem',
      }}
    >
      <IncrementValue item="value1" />
      <DisplayValue item="value1" />
      <IncrementValue item="value2" />
      <DisplayValue item="value2" />
    </div>
  );
}

export default App;
