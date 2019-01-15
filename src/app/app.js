import React from 'react';
import { render } from 'react-dom';
import { Router, useRouterHistory } from 'react-router';
import AppRoutes from './AppRoutes';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { createHashHistory } from 'history';

window.React = React;
window.Perf = require('react-addons-perf');
/*-----引入bootstrap.css文件--------*/
// var css = document.createElement('link');
// css.setAttribute('rel', 'stylesheet');
// css.setAttribute('type', 'text/css');
// css.setAttribute('href', window.proto_dir + '/bootstrap.css');
// var heads = document.getElementsByTagName('head');
// heads[0].appendChild(css);
injectTapEventPlugin();

render(
  <Router
    history={useRouterHistory(createHashHistory)({ queryKey: false })}
    onUpdate={() => window.scrollTo(0, 0)}
  >
    {AppRoutes[apptype]}
  </Router>
  , document.getElementById('app'));


