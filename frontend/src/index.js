import React from 'react';
import ReactDOM from 'react-dom';
import AdminPanel from './pages/AdminPanel';
import registerServiceWorker from './registerServiceWorker';

const App = () => <AdminPanel />;


ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
