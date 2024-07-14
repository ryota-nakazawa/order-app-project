import './App.css';
import React, { useState, useEffect } from 'react';

function App() {

  const [message, setMessage] = useState('');
  useEffect(() => {
    fetch('/api')
      .then((res) => res.json())
      .then((data) => setMessage(data.message));
  }, [])

  return (
    <div className="container is-fluid">
      <h1>フロント</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;
