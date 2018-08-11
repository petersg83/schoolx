import React from 'react';
import ReactDOM from 'react-dom';
import AdminPanel from './pages/AdminPanel';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<AdminPanel />, document.getElementById('root'));
registerServiceWorker();
