import { compose, withState, withHandlers } from 'recompose';
import { showNotification } from 'react-admin';
import { connect } from 'react-redux';
import DumbCancelSubscriptionForm from './DumbCancelSubscriptionForm';
import config from '../../../../../config';
import { httpClient } from '../../../index';

export default compose(
  connect(null, { showNotification }),
  withState('isEndingModalOpen', 'setIsEndingModalOpen', false),
  withState('loading', 'setLoading', false),
  withHandlers({
    endSubcription: (props) => () => {
      props.setLoading(true);

      httpClient(`${config.apiEndpoint}/endSubscription`, {
        method: 'post',
        headers: new Headers({
          Accept: 'application/json',
          "Access-Control-Allow-Origin": config.domainName ? `*.${config.domainName}` : '*',
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({}),
      }).then((res) => {
        if (res.status === 200) {
          props.setLoading(false);
          if (props.callbackAfterEndingSubscription) {
            props.callbackAfterEndingSubscription();
            props.showNotification("L'arrêt de votre abonnement a été enregistré avec succès !", 'info');
          }
        } else {
          throw new Error('Une erreur inconnue s\'est produite. Si elle persiste, contactez le créateur à contact@pierre-noel.fr', 'warning');
        }
      });
    },
  }),
  withHandlers({
    onEndSubcriptionClick: props => () => props.setIsEndingModalOpen(true),
    onExitEndingModal: props => () => props.setIsEndingModalOpen(false),
    onValidateEndingClick: props => () => {
      props.setIsEndingModalOpen(false);
      props.endSubcription();
    },
  }),
)(DumbCancelSubscriptionForm);
