import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import MemberDayRow from './MemberDayRow';
import moment from 'moment';
import 'moment/locale/fr';

const DumbDaySumUp = (props) => {

  let content;

  if (props.isSchoolOpen && props.membersDay.length) {
    const memberDayRows = props.membersDay && props.membersDay.map(md => <MemberDayRow memberDay={md} key={`md-${md.memberId}`}/>);
    content = <table style={{ borderSpacing: '0px', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <td><Typography variant="subheading" style={{ paddingRight: '20px', paddingLeft: '8px' }}>Nom</Typography></td>
          <td><Typography variant="subheading" style={{ paddingRight: '20px', paddingLeft: '8px' }}>Heures</Typography></td>
          <td><Typography variant="subheading" style={{ paddingRight: '20px', paddingLeft: '8px' }}>Résumé</Typography></td>
          <td><Typography variant="subheading" style={{ paddingRight: '20px', paddingLeft: '8px' }}>Note</Typography></td>
        </tr>
      </thead>
      <tbody>
        {memberDayRows}
      </tbody>
    </table>
  } else if (props.isSchoolOpen && !props.membersDay.length) {
    content = <Typography>Aucun membre n'était attendu ce jour.</Typography>;
  } else if (!props.isSchoolOpen) {
    content = <Typography>École fermée ce jour.</Typography>;
  }

  return <div style={{ marginTop: '20px' }}>
    <div style={{ marginBottom: '20px' }}>
      <FormControl style={{ flexDirection: 'row', display: 'flex' }}>
        <FormGroup style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
          <TextField
            id="date"
            label="Jour"
            type="date"
            defaultValue={moment().format('YYYY-MM-DD')}
            InputLabelProps={{ shrink: true }}
            onChange={e => props.onDateChange(e.target.value)}
            style={{ marginRight: '20px' }}
          />
          <FormControlLabel
            control={
              <Switch
                checked={props.isInHoliday}
                onChange={props.onIsInHolidayChange}
                value="isInHoliday"
                color="secondary"
              />
            }
            label="Mode édition"
          />
        </FormGroup>
      </FormControl>
    </div>
    <Typography variant="caption" style={{ marginBottom: '10px' }}>{props.currentDate.format('dddd DD/MM/YYYY')}</Typography>
    {content}
  </div>;
};



export default DumbDaySumUp;
