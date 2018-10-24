import React from 'react';
import { Title } from 'react-admin';
import { compose, withHandlers, withState } from 'recompose';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

const CalendarPage = (props) => {
  return (
    <Card>
      <Title title="Calendrier et présence" />
      <CardContent>
        <Tabs
          value={props.tabNumber}
          indicatorColor="primary"
          textColor="primary"
          onChange={props.onClickOnTab}
        >
          <Tab label="Global" />
          <Tab label="Présence" />
        </Tabs>
        {props.tabNumber === 0 && <p>Le futur calendrier</p>}
      </CardContent>
    </Card>
  );
}

export default compose(
  withState('tabNumber', 'setTabNumber', 0),
  withHandlers({
    onClickOnTab: props => (e, tabNumber) => props.setTabNumber(tabNumber),
  }),
)(CalendarPage);
