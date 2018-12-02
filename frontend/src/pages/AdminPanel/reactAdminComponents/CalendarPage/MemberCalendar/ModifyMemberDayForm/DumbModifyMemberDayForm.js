import React from 'react';
import moment from 'moment';

import FormLabel from '@material-ui/core/FormLabel';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Checkbox from '@material-ui/core/Checkbox';
import { withStyles } from '@material-ui/core/styles';
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
        inputProps={{ step: 300 }}
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
        inputProps={{ step: 300 }}
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
        inputProps={{ step: 300 }}
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
