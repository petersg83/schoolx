import React from 'react';
import { Title } from 'react-admin';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import MemberCalendar from './MemberCalendar';
import SchoolCalendar from './SchoolCalendar';
import DaySumUp from './DaySumUp';
import ExportPage from './ExportPage';

const DumbCalendarPage = (props) => {
  let content;

  switch (props.tabNumber) {
    case 3:
      content = <ExportPage />;
      break;
    case 2:
      content = <DaySumUp />;
      break;
    case 1:
      content = <MemberCalendar />;
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
          <Tab label="Jours" />
          <Tab label="Exporter" />
        </Tabs>
        {content}
      </CardContent>
    </Card>
  );
}

export default DumbCalendarPage;
