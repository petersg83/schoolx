import React from 'react';
import { Title } from 'react-admin';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/fr';
import 'react-big-calendar/lib/css/react-big-calendar.css';

moment.locale('fr');
const localizer = BigCalendar.momentLocalizer(moment);
const messages = {
  allDay: 'journée',
  previous: 'précédent',
  next: 'suivant',
  today: 'aujourd\'hui',
  month: 'mois',
  week: 'semaine',
  day: 'jour',
  agenda: 'Agenda',
  date: 'date',
  time: 'heure',
  event: 'événement', // Or anything you want
  showMore: total => `+ ${total} événement(s) supplémentaire(s)`,
};

const DumbCalendarPage = (props) => {
  let content;

  switch (props.tabNumber) {
    case 1:
      content=<p>Coucou</p>;
      break;
    case 0:
    default:
    content=<div
      style={{
        height: document.body.clientHeight - 250 > 400 ? document.body.clientHeight - 250 : 400,
        padding: '20px',
      }}
    >
      <BigCalendar
        localizer={localizer}
        events={[]}
        startAccessor="start"
        endAccessor="end"
        messages={messages}
      />
    </div>;
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
          <Tab label="Global" />
          <Tab label="Présence" />
        </Tabs>
        {content}
      </CardContent>
    </Card>
  );
}

export default DumbCalendarPage;
