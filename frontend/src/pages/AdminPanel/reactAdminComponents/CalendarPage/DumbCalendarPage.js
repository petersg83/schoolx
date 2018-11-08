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
import Modal from 'react-modal';

import CreateSSDForm from './CreateSSDForm';

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

const customStyles = {
  content : {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    height: 'auto',
    width: '400px',
  }
};

Modal.setAppElement('#root');

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
        events={props.events}
        startAccessor="start"
        endAccessor="end"
        messages={messages}
        eventPropGetter={props.eventPropGetter}
        onNavigate={props.onNavigate}
        onSelectSlot={props.onSelectSlot}
        selectable
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
        <Modal
          isOpen={props.isModalOpen}
          onRequestClose={props.closeModal}
          style={customStyles}
          contentLabel="Create Special Day"
          overlayClassName="Overlay"
        >
          {props.modalType === 'createSSD' && <CreateSSDForm date={props.selectedDate} onCancel={props.closeModal} afterSubmit={props.afterSubmitSomething} />}
          {props.modalType === 'modifySSD' && <CreateSSDForm date={props.selectedDate} onCancel={props.closeModal} afterSubmit={props.afterSubmitSomething} ssd={props.currentSSD} canDelete />}
        </Modal>
      </CardContent>
    </Card>
  );
}

export default DumbCalendarPage;
