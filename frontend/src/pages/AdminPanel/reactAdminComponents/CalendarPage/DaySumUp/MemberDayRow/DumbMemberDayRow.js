import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import SaveIcon from '@material-ui/icons/Save';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import 'moment/locale/fr';

export const DumbShowMemberDayRow = (props) => {
  let timeText = '';

  if (props.memberDay.arrivedAt && props.memberDay.leftAt) {
    timeText += ` ${props.memberDay.arrivedAt} → ${props.memberDay.leftAt}`;
  } else if (props.memberDay.arrivedAt && !props.memberDay.leftAt) {
    timeText += ` ${props.memberDay.arrivedAt} → ???`;
  }

  return (
    <TableRow>
      <TableCell style={{ width: '25px' }} padding="none">
        <Checkbox
          checked={props.selected}
          onChange={props.onSelectedChange}
          color="secondary"
        />
      </TableCell>
      <TableCell component="th" scope="row" style={{ width: '150px' }}>{props.memberDay.firstName} {props.memberDay.lastName}</TableCell>
      <TableCell align="right" style={{ width: '100px' }}>{timeText}</TableCell>
      <TableCell align="right" style={{ backgroundColor: props.memberDay.color, width: '100px' }}>{props.memberDay.title}</TableCell>
      <TableCell align="right">{props.memberDay.note}</TableCell>
    </TableRow>
  );
}

export const DumbEditableMemberDayRow = (props) => {
  let timeText = '';

  if (props.memberDay.arrivedAt && props.memberDay.leftAt) {
    timeText += ` ${props.memberDay.arrivedAt} → ${props.memberDay.leftAt}`;
  } else if (props.memberDay.arrivedAt && !props.memberDay.leftAt) {
    timeText += ` ${props.memberDay.arrivedAt} → ???`;
  }

  return <TableRow>
    <TableCell padding="dense" component="th" scope="row">{props.memberDay.firstName} {props.memberDay.lastName}</TableCell>
    <TableCell padding="dense" align="right">{timeText}</TableCell>
    <TableCell padding="dense" align="right" style={{ backgroundColor: props.memberDay.color }}>{props.memberDay.title}</TableCell>
    <TableCell padding="dense" align="right">
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
              value={props.arrivedAt}
              onChange={props.onArrivedAtChange}
              InputProps={{ disableUnderline: true }} // eslint-disable-line react/jsx-no-duplicate-props
            />
            <TextField
              id="leftAt"
              label="Parti à"
              type="time"
              InputLabelProps={{ shrink: true }}
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
    </TableCell>
  </TableRow>;
};
