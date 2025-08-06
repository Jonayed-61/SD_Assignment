import React from 'react';
import './assets/styles/globals.css';
import './assets/styles/theme.css';
import './assets/styles/animations.css';
import AuthorPage from './pages/AuthorPage.js';

function App() {
  return React.createElement(
    'div',
    { className: "app" },
    React.createElement(
      'div',
      { className: "container" },
      React.createElement(AuthorPage, null)
    )
  );
}

export default App;