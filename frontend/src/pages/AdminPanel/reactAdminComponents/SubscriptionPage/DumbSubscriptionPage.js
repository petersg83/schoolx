import React from 'react';
import { Title } from 'react-admin';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Elements } from 'react-stripe-elements';
import CheckoutForm from './CheckoutForm';

const DumbSubscriptionPage = (props) => {
  return <Elements>
    <Card>
      <Title title="Abonnement" />
      <CardContent>
        <CheckoutForm />
      </CardContent>
    </Card>
  </Elements>;
};

export default DumbSubscriptionPage;
