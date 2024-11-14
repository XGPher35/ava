import React from 'react';
import ReactDOM from 'react-dom';

function Test() {
  return <div>Hello from Test component!</div>;
}

ReactDOM.createRoot(document.getElementById('app')).render(
    <React.StrictMode>
      <Test />
    </React.StrictMode>
  );