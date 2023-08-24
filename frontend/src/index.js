import React from 'react';
import ReactDOM from 'react-dom/client';
import AdminPanel from './pages/AdminPanel';

const App = () => <AdminPanel />;

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
