import React from 'react';
import { Title } from 'react-admin';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { Elements } from 'react-stripe-elements';
import moment from 'moment';
import 'moment/locale/fr';
import CheckoutForm from './CheckoutForm';
import CancelSubscriptionForm from './CancelSubscriptionForm';

const DumbSubscriptionPage = (props) => {
  const freeText = <Typography variant="caption" gutterBottom>Votre abonnement à ClickIn vous a été offert et est illimité et gratuit. Vous pouvez néanmoins commencer un abonnement payant si vous le souhaitez.</Typography>;

  const trialOverText = <div>
    <Typography variant="title" gutterBottom>
      Période d'essai
    </Typography>
    <Typography gutterBottom>
      Votre période d'essai de 30 jours s'est terminée le {moment(props.trialUntil).locale('fr').format('dddd DD/MM/YYYY')}.<br />
      Pour continuer à utiliser ClickIn vous pouvez prendre un abonnement au tarif libre.<br />
      Si vous souhaitez utiliser ClickIn gratuitement car vous n'avez pas les moyens, ou pour tout autre question, contactez moi à l'adresse <a href="mailto:contact@pierre-noel.fr">contact@pierre-noel.fr</a>.
    </Typography>
  </div>;

  const trialOnGoingText = <div>
    <Typography variant="title" gutterBottom>
      Période d'essai
    </Typography>
    <Typography gutterBottom>
      Votre période d'essai de 30 jours se terminera le {moment(props.trialUntil).locale('fr').format('dddd DD/MM/YYYY')}.<br />
      Passée cette date, pour continuer à utiliser ClickIn vous pourrez prendre un abonnement au tarif libre.<br />
      Si vous souhaitez utiliser ClickIn gratuitement car vous n'avez pas les moyens, ou pour tout autre question, contactez moi à l'adresse <a href="mailto:contact@pierre-noel.fr">contact@pierre-noel.fr</a>.
    </Typography>
  </div>;

  const isCurrentlyPaying = <div>
    <Typography variant="title" gutterBottom>Vous êtes abonnés :)</Typography>
    <Typography gutterBottom>Merci de vous être abonnés à ClickIn. Vous avez actuellement le tarif suivant : {Math.round(props.amount/100, 2)}€/{props.frequency === 'month' ? 'mois' : 'an'}.<br />
      Vous êtes libre de changer de tarif quand vous le souhaitez, les factures s'adapteront au prorata temporis.
    </Typography>

  </div>;

  return <Elements>
    <Card>
      <Title title="Abonnement" />
      <CardContent>
        {props.isFree && freeText}
        {props.trialIsOverAndNotPaid && trialOverText}
        {props.trialIsOnGoingAndNotPaid && trialOnGoingText}
        {props.hasPaid && isCurrentlyPaying}
        <Typography style={{ marginTop: '20px' }} variant="title" gutterBottom>Tarif libre</Typography>
        <Typography gutterBottom>
          Afin de s'adapter au budget de chaque école, chaque école est libre de choisir en conscience le tarif qu'elle souhaite payer pour l'utilisation de l'application. Elle est aussi libre de le changer quand elle le veut.<br />
          Derrière cette application se cache de nombreuses heures de travail, le temps que je peux consacrer à l'entretenir et à l'améliorer dépend directement des revenus qu'elle génère.<br />
          Aucune justification ne vous sera demandée quant au tarif que vous choisissez.
        </Typography>
        <CheckoutForm callbackAfterChangingSubscription={props.refreshSubscriptionInfo} subscriptionType={props.subscriptionType} />
        {props.hasPaid && <CancelSubscriptionForm callbackAfterEndingSubscription={props.refreshSubscriptionInfo} />}
      </CardContent>
    </Card>
  </Elements>;
};

export default DumbSubscriptionPage;
