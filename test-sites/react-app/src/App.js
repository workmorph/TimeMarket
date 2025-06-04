import React, { useEffect } from 'react';

function App() {
  useEffect(() => {
    // ウィジェット動的読み込み
    const script = document.createElement('script');
    script.src = 'https://cdn.timebid.com/widget/latest/timebid-widget.iife.js';
    script.onload = () => {
      window.TimeBid.createWidget({
        apiKey: process.env.REACT_APP_TIMEBID_API_KEY,
        containerId: 'react-timebid-container'
      });
    };
    document.head.appendChild(script);
  }, []);

  return (
    <div className="App">
      <h1>React環境でのTimeBidウィジェット</h1>
      <div id="react-timebid-container"></div>
    </div>
  );
}

export default App;