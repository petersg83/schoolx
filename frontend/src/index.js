import React from 'react';
import ReactDOM from 'react-dom';
import {StripeProvider} from 'react-stripe-elements';
import AdminPanel from './pages/AdminPanel';
import registerServiceWorker from './registerServiceWorker';
import config from './config';

const App = () => <StripeProvider apiKey={config.stripeApiKey}>
    <AdminPanel />
  </StripeProvider>;

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
