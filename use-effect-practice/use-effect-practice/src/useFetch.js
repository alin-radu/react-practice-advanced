import { useState, useEffect, useRef, useLayoutEffect } from 'react';

const useCallbackRef = (callback) => {
  const callbackRef = useRef(callback);

  useLayoutEffect(() => {
    console.log(
      '%c-> developmentConsole: useCallbackRef | useLayoutEffect= ',
      'color:#77dcfd'
    );
    callbackRef.current = callback;
  }, [callback]);

  return callbackRef;
};

export const useFetch = (options) => {
  const [data, setData] = useState(null);

  const savedOnSuccess = useCallbackRef(options.onSuccess);

  useEffect(() => {
    console.log('useFetch | useEffect ');
    if (options.url) {
      let isCancelled = false;
      fetch(options.url)
        .then((response) => response.json())
        .then((json) => {
          if (!isCancelled) {
            savedOnSuccess.current?.(json);
            setData(json);
          }
        });
      return () => {
        isCancelled = true;
      };
    }
  }, [options.url, savedOnSuccess]);

  return {
    data,
  };
};
