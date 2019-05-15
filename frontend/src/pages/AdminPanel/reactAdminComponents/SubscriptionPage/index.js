import React from 'react';
import moment from 'moment';
import { branch, compose, lifecycle, withHandlers, withState, mapProps } from 'recompose';
import DumbSubscriptionPage from './DumbSubscriptionPage';
import config from '../../../../config';
import { httpClient } from '../../index';

export default compose(
  withState('school', 'setSchool', null),
  withState('subscription', 'setSubscription', null),
  withState('loaded', 'setLoaded', false),
  withHandlers({
    getSchool: props => () => {
      httpClient(`${config.apiEndpoint}/getSubscriptionInfo`)
      .then((res) => {
        if (res.status === 200) {
          return res.json;
        } else {
          props.showNotification('Une erreur inconnue s\'est produite. Si elle persiste, contactez le créateur à contact@pierre-noel.fr');
          throw new Error('Une erreur inconnue s\'est produite. Si elle persiste, contactez le créateur à contact@pierre-noel.fr');
        }
      }).then((res) => {
        props.setSchool(res.school);
        props.setSubscription(res.subscription);
        props.setLoaded(true);
      });
    },
  }),
  lifecycle({
    componentDidMount() {
      this.props.getSchool();
    },
  }),
  branch(
    props => props.loaded,
    baseComponent => baseComponent,
    () => () => <p>chargement...</p>, // TODO : faire un component de chargement
  ),
  mapProps(props => ({
    trialUntil: props.school.trialUntil,
    trialIsOverAndNotPaid: !props.school.isFree && moment(props.school.trialUntil).isBefore(moment()) && !props.school.hasPaid,
    trialIsOnGoingAndNotPaid: !props.school.isFree && moment(props.school.trialUntil).isAfter(moment()) && !props.school.hasPaid,
    isFree: props.school.isFree,
    frequency: props.subscription.frequency,
    amount: props.subscription.amount,
    hasPaid: props.school.hasPaid,
    refreshSubscriptionInfo: props.getSchool,
    subscriptionType: props.school.hasPaid ? 'changing' : 'new',
  })),
)(DumbSubscriptionPage);
