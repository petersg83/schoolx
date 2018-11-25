import React from 'react';
import { Title } from 'react-admin';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import MemberCalendar from './MemberCalendar';
import SchoolCalendar from './SchoolCalendar';

const DumbCalendarPage = (props) => {
  let content;

  switch (props.tabNumber) {
    case 1:
      content = <MemberCalendar />
      break;
    case 0:
    default:
      content = <SchoolCalendar />;
  }

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
          <Tab label="Ecole" />
          <Tab label="Membres" />
        </Tabs>
        {content}
      </CardContent>
    </Card>
  );
}

export default DumbCalendarPage;
