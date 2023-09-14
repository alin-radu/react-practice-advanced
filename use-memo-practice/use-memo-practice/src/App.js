import { useState, memo } from 'react';

import './App.css';

const Swatch = ({ color }) => {
  console.log('%c-> developmentConsole: Swatch===> ', 'color:#77dcfd', color);

  return <div style={{ width: '3rem', height: '3rem', backgroundColor: color }}></div>;
};

const SwatchMemoed = memo(Swatch);

const App = () => {
  console.log('%c-> developmentConsole: App---> ', 'color:#77dcfd');

  const [appRenderIdx, setAppRenderIdx] = useState(0);
  const [color, setColor] = useState('red');

  console.log('%c-> developmentConsole: appRenderIdx= ', 'color:#77dcfd', appRenderIdx);

  return (
    <div className="App">
      <div style={{ display: 'flex', alignItems: 'flex-end' }}>
        <button onClick={() => setAppRenderIdx(appRenderIdx + 1)}>Re-Render App</button>
        <button onClick={() => setColor(color === 'red' ? 'blue' : 'red')}>
          Change Color
        </button>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        <SwatchMemoed color={color} />
      </div>
    </div>
  );
};

export default App;
