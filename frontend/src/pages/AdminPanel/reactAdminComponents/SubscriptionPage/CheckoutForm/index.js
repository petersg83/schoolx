import { compose, mapProps, withHandlers, withState } from 'recompose';
import { showNotification } from 'react-admin';
import { connect } from 'react-redux';
import { injectStripe } from 'react-stripe-elements';
import jwtFactory from 'jsonwebtoken';
import DumbCheckoutForm from './DumbCheckoutForm';
import config from '../../../../../config';
import { httpClient } from '../../../index';

const plans = [{
  price: '5',
  frequency: 'month',
  planId: 'plan_EyIAKpzaOEA60l',
}, {
  price: '60',
  frequency: 'year',
  planId: 'plan_EyIDy24T2Qozgx',
}, {
  price: '10',
  frequency: 'month',
  planId: 'plan_EyI8VObQWgSXVM',
}, {
  price: '120',
  frequency: 'year',
  planId: 'plan_EyifdUvpQWAW3C',
}];

export default compose(
  injectStripe,
  connect(null, { showNotification }),
  withState('frequency', 'setFrequency', 'month'),
  withState('price', 'setPrice', ''),
  withState('loading', 'setLoading', false),
  withHandlers({
    subscribeToNewSubscription: props => (e) => {
      e.preventDefault();
      props.setLoading(true);
      const plan = plans.find(p => p.price === props.price && p.frequency === props.frequency);
      let planId = plan ? plan.planId : null;

      if (!planId) {
        console.log('error planId not found !');
        throw new Error('error planId not found');
      }

      const urlBase = config.domainName
        .replace('https://', `https://${localStorage.getItem('subdomain')}.`)
        .replace('http://', `http://${localStorage.getItem('subdomain')}.`);

      props.stripe.redirectToCheckout({
        items: [{ plan: planId, quantity: 1 }],
        successUrl: `${urlBase}/#/subscriptionSuccess`,
        cancelUrl: `${urlBase}/#/subscriptionCancelled`,
        clientReferenceId: jwtFactory.decode(localStorage.getItem('jwt')).schoolId,
      })
      .then(result => {
        if (result.error) {
          console.log('result.error.message', result.error.message);
        }
      });
    },
    changeSubscription: props => (e) => {
      e.preventDefault();
      props.setLoading(true);
      const plan = plans.find(p => p.price === props.price && p.frequency === props.frequency);
      let planId = plan ? plan.planId : null;

      if (!planId) {
        console.log('error planId not found !');
        throw new Error('error planId not found');
      }

      httpClient(`${config.apiEndpoint}/changeSubscription`, {
        method: 'post',
        headers: new Headers({
          Accept: 'application/json',
          "Access-Control-Allow-Origin": config.domainName ? `*.${config.domainName}` : '*',
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({ newPlanId: planId }),
      }).then((res) => {
        if (res.status === 200) {
          if (props.callbackAfterChangingSubscription) {
            props.setLoading(false);
            props.callbackAfterChangingSubscription();
            props.showNotification('Changement de tarif enregistré avec succès :)', 'info');
          }
        } else {
          throw new Error('Une erreur inconnue s\'est produite. Si elle persiste, contactez le créateur à contact@pierre-noel.fr', 'warning');
        }
      }).catch((err) => {
        console.log(err);
        props.setLoading(false);
        if (err.body.message === 'Cannot change to the same plan') {
          props.showNotification('Vous avez choisi le même tarif que celui que vous avez actuellement :)', 'error');
        } else {
          props.showNotification("Une erreur s'est produite, réessayez ou contactez Pierre à contact@pierre-noel.fr", 'warning');
        }
       });
    },
    handleFrequencyChange: props => (value) => {
      props.setFrequency(value);
      props.setPrice('');
    },
    handlePriceChange: props => (value) => props.setPrice(value),
  }),
  withHandlers({
    onSubscriptionClick: props => (e) => {
      if (props.subscriptionType === 'changing') {
        props.changeSubscription(e);
      } else if (props.subscriptionType === 'new') {
        props.subscribeToNewSubscription(e);
      }
    },
  }),
  mapProps(props => ({
    handleFrequencyChange: props.handleFrequencyChange,
    handlePriceChange: props.handlePriceChange,
    frequency: props.frequency,
    price: props.price,
    plans: plans.filter(p => p.frequency === props.frequency),
    onSubscriptionClick: props.onSubscriptionClick,
    loading: props.loading,
  })),
)(DumbCheckoutForm);
