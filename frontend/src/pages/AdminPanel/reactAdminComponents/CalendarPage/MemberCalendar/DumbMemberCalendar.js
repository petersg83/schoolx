import React from 'react';
import moment from 'moment';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Divider from '@mui/material/Divider';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'moment/locale/fr';
import ModifyMemberDayForm from './ModifyMemberDayForm';
import MemberSumUp from './MemberSumUp';

moment.locale('fr');
const localizer = momentLocalizer(moment);
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

const DumbMemberCalendar = (props) => {
  const memberItems = props.members.map(m => <MenuItem key={m.id} value={m.id}>{m.firstName} {m.lastName}</MenuItem>);
  return <div style={{ padding: '20px' }}>
    <div
      style={{
        height: 480,
      }}
    >
      <Calendar
        localizer={localizer}
        events={props.events}
        startAccessor="start"
        endAccessor="end"
        messages={messages}
        onNavigate={props.onNavigate}
        onSelectSlot={props.onSelectSlot}
        onSelectEvent={props.onSelectSlot}
        eventPropGetter={props.eventPropGetter}
        selectable
      />
    </div>
    <div style={{ marginTop: '20px' }}>
      <FormControl>
        <InputLabel>Membre</InputLabel>
        <Select
          value={props.selectedMemberId}
          onChange={props.onSelectMember}
        >
          {memberItems}
        </Select>
      </FormControl>
    </div>
    <Divider variant="middle" style={{ margin: '15px 0px' }} />
    <MemberSumUp memberId={props.selectedMemberId} />
    <Dialog
      open={props.isModalOpen}
      onClose={props.closeModal}
    >
      {props.isModalOpen && <DialogContent>
        <ModifyMemberDayForm memberId={props.selectedMemberId} date={props.selectedDate} afterSubmit={props.afterSubmitSomething} currentDay={props.dayToBeModified} onCancel={props.closeModal} />
      </DialogContent>}
    </Dialog>
  </div>;
};

export default DumbMemberCalendar;
