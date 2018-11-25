import React from 'react';
import moment from 'moment';
import BigCalendar from 'react-big-calendar';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
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

const DumbMemberCalendar = (props) => {
  const memberItems = props.members.map(m => <MenuItem key={m.id} value={m.id}>{m.firstName} {m.lastName}</MenuItem>);
  return <div style={{ padding: '20px' }}>
    <div
      style={{
        height: 480,
      }}
    >
      <BigCalendar
        localizer={localizer}
        events={props.events}
        startAccessor="start"
        endAccessor="end"
        messages={messages}
        onNavigate={props.onNavigate}
        onSelectSlot={props.onSelectSlot}
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
  </div>;
};

export default DumbMemberCalendar;
