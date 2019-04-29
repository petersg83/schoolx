import { compose, mapProps, withHandlers, withState } from 'recompose';
import { injectStripe } from 'react-stripe-elements';
import DumbCheckoutForm from './DumbCheckoutForm';

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
  planId: 'plan_EyIEdy1LAUfVCj',
}];

export default compose(
  injectStripe,
  withState('frequency', 'setFrequency', 'month'),
  withState('price', 'setPrice', ''),
  withState('loading', 'setLoading', false),
  withHandlers({
    checkout: props => (e) => {
      e.preventDefault();
      props.setLoading(true);
      const plan = plans.find(p => p.price === props.price && p.frequency === props.frequency);
      let planId = plan ? plan.planId : null;

      if (!planId) {
        console.log('error planId not found !');
        throw new Error('error planId not found');
      }

      props.stripe.redirectToCheckout({
        items: [{ plan: planId, quantity: 1 }],
        successUrl: 'https://clickin.fr/success',
        cancelUrl: 'https://clickin.fr/cancelled',
        // clientReferenceId: 'cus_EyCU5MFLHAP0oZ',
        // customerEmail: jwtFactory.decode(localStorage.getItem('jwt')).email,
      })
      .then(result => {
        if (result.error) {
          console.log('result.error.message', result.error.message);
        }
      });
    },
    handleFrequencyChange: props => (value) => {
      props.setFrequency(value);
      props.setPrice('');
    },
    handlePriceChange: props => (value) => props.setPrice(value),
  }),
  mapProps(props => ({
    handleFrequencyChange: props.handleFrequencyChange,
    handlePriceChange: props.handlePriceChange,
    frequency: props.frequency,
    price: props.price,
    plans: plans.filter(p => p.frequency === props.frequency),
    checkout: props.checkout,
    loading: props.loading,
  })),
)(DumbCheckoutForm);
