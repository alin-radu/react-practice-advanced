import {
  useState,
  useEffect,
  useRef,
  createContext,
  useContext,
  useCallback,
} from 'react';

type Store = { first: string; last: string };
type UseStoreDataReturnType = ReturnType<typeof useStoreData>;

// useStoreData //////////////////////////////////////////////////////////////////////////////////
const useStoreData = (): {
  get: () => Store;
  set: (value: Partial<Store>) => void;
  subscribe: (callback: () => void) => () => void;
} => {
  const store = useRef({
    first: '',
    last: '',
  });
  const subscribers = useRef(new Set<() => void>());

  const get = useCallback(() => store.current, []);

  const set = useCallback((value: Partial<Store>) => {
    store.current = { ...store.current, ...value };
    subscribers.current.forEach((callback) => callback());
  }, []);

  const subscribe = useCallback((callback: () => void) => {
    subscribers.current.add(callback);

    return () => subscribers.current.delete(callback);
  }, []);

  return { get, set, subscribe };
};

// context ///////////////////////////////////////////////////////////////////////////////////////
const StoreContext = createContext<UseStoreDataReturnType | null>(null);

const Provider = ({ children }: { children: React.ReactNode }) => {
  const store = useStoreData();

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
};

// useStore //////////////////////////////////////////////////////////////////////////////////////
const useStore = <SelectorOutput,>(
  selector: (store: Store) => SelectorOutput
): [SelectorOutput, (value: Partial<Store>) => void] => {
  const store = useContext(StoreContext);

  if (!store) {
    throw new Error('Store not initialized');
  }

  const selectedValue = () => selector(store.get());

  // const state = useSyncExternalStore(store.subscribe(), selectedValue);

  const [state, setState] = useState(selectedValue);

  useEffect(() => {
    // the return value off store.subscribe() is an unsubscribe
    const subscribe = store.subscribe(() => setState(selectedValue));

    return subscribe;
  }, []);

  return [state, store.set];
};

// components ////////////////////////////////////////////////////////////////////////////////////
const TextInput = ({ value }: { value: 'first' | 'last' }) => {
  const [fieldValue, setStore] = useStore((store) => store[value]);
  return (
    <div className="field">
      {value}:{' '}
      <input value={fieldValue} onChange={(e) => setStore({ [value]: e.target.value })} />
    </div>
  );
};

const Display = ({ value }: { value: 'first' | 'last' }) => {
  const [fieldValue] = useStore((store) => store[value]);
  return (
    <div className="value">
      {value}: {fieldValue}
    </div>
  );
};

const FormContainer = () => {
  return (
    <div className="container">
      <h5>FormContainer</h5>
      <TextInput value="first" />
      <TextInput value="last" />
    </div>
  );
};

const DisplayContainer = () => {
  return (
    <div className="container">
      <h5>DisplayContainer</h5>
      <Display value="first" />
      <Display value="last" />
    </div>
  );
};

const ContentContainer = () => {
  return (
    <div className="container">
      <h5>ContentContainer</h5>
      <FormContainer />
      <DisplayContainer />
    </div>
  );
};

function App() {
  return (
    <Provider>
      <div className="container">
        <h5>App</h5>
        <ContentContainer />
      </div>
    </Provider>
  );
}

export default App;
