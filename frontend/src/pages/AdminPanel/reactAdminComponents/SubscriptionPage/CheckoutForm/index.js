import { compose, lifecycle, mapProps, withHandlers, withState } from 'recompose';
import { showNotification } from 'react-admin';
import { connect } from 'react-redux';
import { injectStripe } from 'react-stripe-elements';
import jwtDecode from 'jwt-decode';
import DumbCheckoutForm from './DumbCheckoutForm';
import config from '../../../../../config';
import { httpClient } from '../../../index';

export default compose(
  injectStripe,
  connect(null, { showNotification }),
  withState('isChangingModalOpen', 'setIsChangingModalOpen', false),
  withState('frequency', 'setFrequency', 'month'),
  withState('price', 'setPrice', ''),
  withState('loading', 'setLoading', false),
  withState('plans', 'setPlans', []),
  withHandlers({
    getPlans: props => () => {
      httpClient(`${config.apiEndpoint}/getPlans`)
      .then((res) => {
        if (res.status === 200) {
          return res.json;
        } else {
          props.showNotification('Une erreur inconnue s\'est produite. Si elle persiste, contactez le créateur à contact@pierre-noel.fr');
          throw new Error('Une erreur inconnue s\'est produite. Si elle persiste, contactez le créateur à contact@pierre-noel.fr');
        }
      }).then((res) => {
        props.setPlans(res.plans);
      });
    },
    subscribeToNewSubscription: props => (e) => {
      e.preventDefault();
      props.setLoading(true);
      const plan = props.plans.find(p => p.price === props.price && p.frequency === props.frequency);
      let stripePlanId = plan ? plan.stripePlanId : null;

      if (!stripePlanId) {
        console.log('error stripePlanId not found !');
        throw new Error('error stripePlanId not found');
      }

      const urlBase = config.domainName
        .replace('https://', `https://${localStorage.getItem('subdomain')}.`)
        .replace('http://', `http://${localStorage.getItem('subdomain')}.`);

      props.stripe.redirectToCheckout({
        items: [{ plan: stripePlanId, quantity: 1 }],
        successUrl: `${urlBase}/#/subscriptionSuccess`,
        cancelUrl: `${urlBase}/#/subscriptionCancelled`,
        clientReferenceId: jwtDecode(localStorage.getItem('jwt')).schoolId,
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
      const plan = props.plans.find(p => p.price === props.price && p.frequency === props.frequency);
      let stripePlanId = plan ? plan.stripePlanId : null;

      if (!stripePlanId) {
        console.log('error stripePlanId not found !');
        throw new Error('error stripePlanId not found');
      }

      httpClient(`${config.apiEndpoint}/changeSubscription`, {
        method: 'post',
        headers: new Headers({
          Accept: 'application/json',
          "Access-Control-Allow-Origin": config.domainName ? `*.${config.domainName}` : '*',
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({ newPlanId: stripePlanId }),
      }).then((res) => {
        if (res.status === 200) {
          props.setLoading(false);
          if (props.callbackAfterChangingSubscription) {
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
    onValidateChangingClick: props => (e) => {
      props.setIsChangingModalOpen(false)
      props.changeSubscription(e);
    },
  }),
  withHandlers({
    onChangeSubcriptionClick: props => (e) => {
      if (props.subscriptionType === 'changing') {
        props.setIsChangingModalOpen(true);
      } else if (props.subscriptionType === 'new') {
        props.subscribeToNewSubscription(e);
      }
    },
    onExitChangingModal: props => () => props.setIsChangingModalOpen(false),
  }),
  lifecycle({
    componentDidMount() {
      this.props.getPlans();
    },
  }),
  mapProps(props => ({
    handleFrequencyChange: props.handleFrequencyChange,
    handlePriceChange: props.handlePriceChange,
    frequency: props.frequency,
    price: props.price,
    plans: props.plans.filter(p => p.frequency === props.frequency),
    onChangeSubcriptionClick: props.onChangeSubcriptionClick,
    loading: props.loading,
    isChangingModalOpen: props.isChangingModalOpen,
    onExitChangingModal: props.onExitChangingModal,
    onValidateChangingClick: props.onValidateChangingClick,
  })),
)(DumbCheckoutForm);
