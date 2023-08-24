import React from 'react';
import moment from 'moment';

import FormLabel from '@mui/material/FormLabel';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import { withStyles } from '@mui/styles';
import 'moment/locale/fr';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
    width: 400,
  },
  button: {
    margin: theme.spacing.unit,
  },
});

const DumbModifyMemberDayForm = props => <form onSubmit={props.onSubmit}>
  <FormControl component="fieldset">
    <FormLabel component="legend" focused>{props.date && moment(props.date).locale('fr').format('dddd DD/MM/YYYY')}</FormLabel>
    <Typography variant="caption" style={{ margin: '6px 0px' }}>
      {props.currentDay && props.currentDay.schoolOpensAt} → {props.currentDay && props.currentDay.schoolClosesAt}<br />
      Retard à partir de {props.currentDay && props.currentDay.maxArrivalTime}<br />
      Abs. partielle en dessous de {props.currentDay && props.currentDay.minTimeBefPartialAbsence.replace(':', 'h')}, totale en dessous de {props.currentDay && props.currentDay.minTimeBefTotalAbsence.replace(':', 'h')}
    </Typography>
    <Divider variant="middle" style={{ marginBottom: '5px' }}/>
    <FormGroup>
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
        className={props.classes.textField}
        value={props.isInHoliday ? '' : props.arrivedAt}
        onChange={props.onArrivedAtChange}
        disabled={props.isInHoliday}
      />
      <TextField
        id="leftAt"
        label="Parti à"
        type="time"
        InputLabelProps={{ shrink: true }}
        className={props.classes.textField}
        value={props.isInHoliday ? '' : props.leftAt}
        onChange={props.onLeftAtChange}
        disabled={props.isInHoliday}
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={!props.isInHoliday && props.isJustifiedDelay}
            onChange={props.onIsJustifiedDelayChange}
            value="isJustifiedDelay"
            color="secondary"
          />
        }
        label="Retard justifié"
        disabled={props.isInHoliday}
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={!props.isInHoliday && props.isJustifiedAbsence}
            onChange={props.onIsJustifiedAbsenceChange}
            value="isJustifiedAbsence"
            color="secondary"
          />
        }
        label="Absence justifiée"
        disabled={props.isInHoliday}
      />
      <TextField
        id="note"
        label="Note"
        type="textArea"
        InputLabelProps={{ shrink: true }}
        className={props.classes.textField}
        value={props.note}
        onChange={props.onNoteChange}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginRight: '20px', marginLeft: '20px' }}>
        <Button size="small" className={props.classes.button} onClick={props.onCancel}>
          Annuler
        </Button>
        <Button variant="contained" type="submit" size="small" color='secondary' className={props.classes.button}>
          Sauvegarder
        </Button>
      </div>
    </FormGroup>
  </FormControl>
</form>;

export default withStyles(styles)(DumbModifyMemberDayForm);
