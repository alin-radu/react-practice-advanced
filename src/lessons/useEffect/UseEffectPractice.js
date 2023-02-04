import { useState, useEffect } from 'react';

import { useFetch } from './useFetch';

const useStopwatch = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('useStopwatch useEffect');
    const interval = setInterval(() => {
      console.log(`Count = ${count}`);
      setCount((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return count;
};

export const UseEffectPractice = () => {
  const [url, setUrl] = useState(null);
  const count = useStopwatch();
  const { data } = useFetch({ url, onSuccess: () => console.log('success') });

  console.log('App rendering');

  return (
    <div className="App">
      <div>Hello</div>
      <div>Count: {count}</div>
      <div>{JSON.stringify(data)}</div>
      <div>
        <button onClick={() => setUrl('/jack.json')}>Jack</button>
        <button onClick={() => setUrl('/sally.json')}>Sally</button>
      </div>
    </div>
  );
};
