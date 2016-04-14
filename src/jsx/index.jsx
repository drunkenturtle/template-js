import React from 'react';
import ReactDOM from 'react-dom';

import App from './App.jsx';

window.addEventListener('resize', function() {
  document.querySelector('body').style.width = window.innerWidth + 'px';
  document.querySelector('body').style.height = window.innerHeight + 'px';
});

window.initApp = function() {
  document.querySelector('body').style.width = window.innerWidth + 'px';
  document.querySelector('body').style.height = window.innerHeight + 'px';

  ReactDOM.render(<App />, document.getElementById('app'));
};
