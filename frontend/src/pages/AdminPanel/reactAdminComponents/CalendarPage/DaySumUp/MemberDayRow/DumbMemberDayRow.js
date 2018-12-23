import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import SaveIcon from '@material-ui/icons/Save';
import 'moment/locale/fr';

export const DumbShowMemberDayRow = (props) => {
  let timeText = '';

  if (props.memberDay.arrivedAt && props.memberDay.leftAt) {
    timeText += ` ${props.memberDay.arrivedAt} → ${props.memberDay.leftAt}`;
  } else if (props.memberDay.arrivedAt && !props.memberDay.leftAt) {
    timeText += ` ${props.memberDay.arrivedAt} → ???`;
  }

  return <tr>
    <td style={{ paddingRight: '20px', paddingLeft: '8px' }}><Typography variant="body2">{props.memberDay.firstName} {props.memberDay.lastName}</Typography></td>
    <td style={{ paddingRight: '20px', paddingLeft: '8px' }}><Typography variant="body2">{timeText}</Typography></td>
    <td style={{ paddingRight: '20px', paddingLeft: '8px', backgroundColor: props.memberDay.color }}><Typography variant="body2">{props.memberDay.title}</Typography></td>
    <td style={{ paddingRight: '20px', paddingLeft: '8px' }}><Typography variant="body2">{props.memberDay.note}</Typography></td>
  </tr>;
}

export const DumbEditableMemberDayRow = (props) => {
  let timeText = '';

  if (props.memberDay.arrivedAt && props.memberDay.leftAt) {
    timeText += ` ${props.memberDay.arrivedAt} → ${props.memberDay.leftAt}`;
  } else if (props.memberDay.arrivedAt && !props.memberDay.leftAt) {
    timeText += ` ${props.memberDay.arrivedAt} → ???`;
  }

  return <tr>
    <td style={{ paddingRight: '20px', paddingLeft: '8px' }}><Typography variant="body2">{props.memberDay.firstName} {props.memberDay.lastName}</Typography></td>
    <td style={{ paddingRight: '20px', paddingLeft: '8px' }}><Typography variant="body2">{timeText}</Typography></td>
    <td style={{ paddingRight: '20px', paddingLeft: '8px', backgroundColor: props.memberDay.color }}><Typography variant="body2">{props.memberDay.title}</Typography></td>
    <td style={{ paddingRight: '20px', paddingLeft: '8px' }}>
      <form onSubmit={props.onSubmit}>
      <FormControl component="fieldset">
        <FormGroup style={{ flexDirection: 'row' }}>
          <FormControlLabel
            control={
              <Switch
                checked={props.isInHoliday}
                onChange={props.onIsInHolidayChange}
                value="isInHoliday"
                color="secondary"
              />
            }
            label="En congé"
          />
          <TextField
            id="arrivedAt"
            label="Arrivé à"
            type="time"
            InputLabelProps={{ shrink: true }}
            inputProps={{ step: 300 }}
            value={props.arrivedAt}
            onChange={props.onArrivedAtChange}
            InputProps={{ disableUnderline: true }} // eslint-disable-line react/jsx-no-duplicate-props
          />
          <TextField
            id="leftAt"
            label="Parti à"
            type="time"
            InputLabelProps={{ shrink: true }}
            inputProps={{ step: 300 }}
            value={props.leftAt}
            onChange={props.onLeftAtChange}
            InputProps={{ disableUnderline: true }} // eslint-disable-line react/jsx-no-duplicate-props
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={props.isJustifiedDelay}
                onChange={props.onIsJustifiedDelayChange}
                value="isJustifiedDelay"
                color="secondary"
              />
            }
            label="Retard justifié"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={props.isJustifiedAbsence}
                onChange={props.onIsJustifiedAbsenceChange}
                value="isJustifiedAbsence"
                color="secondary"
              />
            }
            label="Absence justifiée"
          />
          <TextField
            id="note"
            label="Note"
            type="textArea"
            InputLabelProps={{ shrink: true }}
            inputProps={{ step: 300 }}
            value={props.note || ''}
            onChange={props.onNoteChange}
            InputProps={{ disableUnderline: true }} // eslint-disable-line react/jsx-no-duplicate-props
          />
          <IconButton size="small" type="submit" color='secondary' disabled={!props.rowChanged}>
            <SaveIcon />
          </IconButton>
        </FormGroup>
      </FormControl>
      </form>
    </td>
  </tr>;
};
