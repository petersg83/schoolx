import React from 'react';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import SaveIcon from '@mui/icons-material/Save';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
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
      <TableCell sx={{ width: '25px' }} padding="none">
        <Checkbox
          checked={props.selected}
          onChange={props.onSelectedChange}
          color="secondary"
        />
      </TableCell>
      <TableCell component="th" scope="row" sx={{ width: '250px' }}>{props.memberDay.firstName} {props.memberDay.lastName}</TableCell>
      <TableCell align="left" sx={{ width: '130px' }}>{timeText}</TableCell>
      <TableCell align="right" sx={{ backgroundColor: props.memberDay.color, width: '150px' }}>{props.memberDay.title}</TableCell>
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
    <TableCell padding="none" component="th" scope="row">{props.memberDay.firstName} {props.memberDay.lastName}</TableCell>
    <TableCell padding="none" align="right" sx={{ paddingRight: '16px' }}>{timeText}</TableCell>
    <TableCell padding="none" align="right" sx={{ backgroundColor: props.memberDay.color, paddingRight: '16px' }}>{props.memberDay.title}</TableCell>
    <TableCell padding="none">
      <form onSubmit={props.onSubmit}>
        <FormControl component="fieldset" sx={{ margin: 0 }}>
          <FormGroup sx={{ flexDirection: 'row', paddingLeft: '15px' }}>
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
              sx={{ width: '90px', marginRight: '16px' }}
            />
            <TextField
              id="leftAt"
              label="Parti à"
              type="time"
              InputLabelProps={{ shrink: true }}
              value={props.leftAt}
              onChange={props.onLeftAtChange}
              InputProps={{ disableUnderline: true }} // eslint-disable-line react/jsx-no-duplicate-props
              sx={{ width: '90px', marginRight: '16px' }}
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
