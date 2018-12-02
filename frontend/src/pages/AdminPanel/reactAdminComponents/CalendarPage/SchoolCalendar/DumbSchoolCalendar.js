import React from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import CreateSSDForm from './CreateSSDForm';
import 'moment/locale/fr';

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

const DumbSchoolCalendar = (props) => <div>
  <div
    style={{
      height: 480,
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
  </div>
  <Dialog
    open={props.isModalOpen}
    onClose={props.closeModal}
  >
    {(props.modalType === 'createSSD' || props.modalType === 'modifySSD') && <DialogContent>
      {props.modalType === 'createSSD' && <CreateSSDForm date={props.selectedDate} onCancel={props.closeModal} afterSubmit={props.afterSubmitSomething} ssd={props.ssdPrefilledForCreation} />}
      {props.modalType === 'modifySSD' && <CreateSSDForm date={props.selectedDate} onCancel={props.closeModal} afterSubmit={props.afterSubmitSomething} ssd={props.currentSSD} canDelete />}
    </DialogContent>}
  </Dialog>
</div>;

export default DumbSchoolCalendar;
