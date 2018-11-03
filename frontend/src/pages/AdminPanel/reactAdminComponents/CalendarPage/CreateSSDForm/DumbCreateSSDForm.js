import React from 'react';

import FormLabel from '@material-ui/core/FormLabel';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';

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

const CreateSSDForm = props => <form onSubmit={props.onSubmit}>
  <FormControl component="fieldset">
    <FormLabel component="legend">{props.date && props.date.locale('fr').format('dddd DD/MM/YYYY')}</FormLabel>
    <FormGroup>
      <FormControlLabel
        control={
          <Switch
            checked={props.schoolIsOpen}
            onChange={props.onSchoolIsOpenChange}
            value="schoolIsOpen"
            color='primary'
          />
        }
        label={props.schoolIsOpen ? "École ouverte" : 'École fermée'}
      />
      <TextField
        id="openAt"
        label="Ouvre à"
        type="time"
        InputLabelProps={{ shrink: true }}
        inputProps={{ step: 300 }}
        className={props.classes.textField}
        disabled={!props.schoolIsOpen}
        value={props.openAt}
        onChange={props.onOpenAtChange}
        required
      />
      <TextField
        id="closeAt"
        label="Ferme à"
        type="time"
        InputLabelProps={{ shrink: true }}
        inputProps={{ step: 300 }}
        className={props.classes.textField}
        disabled={!props.schoolIsOpen}
        value={props.closeAt}
        onChange={props.onCloseAtChange}
        required
      />
      <TextField
        id="maxArrivalTime"
        label="Heure limite d'arrivée"
        type="time"
        InputLabelProps={{ shrink: true }}
        inputProps={{ step: 300 }}
        className={props.classes.textField}
        disabled={!props.schoolIsOpen}
        value={props.maxArrivalTime}
        onChange={props.onMaxArrivalTimeChange}
        required
      />
      <TextField
        id="minTimeBefPartialAbsence"
        label="Temps de présence minimum avant absence partielle"
        type="time"
        InputLabelProps={{ shrink: true }}
        inputProps={{ step: 300 }}
        className={props.classes.textField}
        disabled={!props.schoolIsOpen}
        value={props.minTimeBefPartialAbsence}
        onChange={props.onMinTimeBefPartialAbsenceChange}
        required
      />
      <TextField
        id="minTimeBefTotalAbsence"
        label="Temps de présence minimum avant absence totale"
        type="time"
        InputLabelProps={{ shrink: true }}
        inputProps={{ step: 300 }}
        className={props.classes.textField}
        disabled={!props.schoolIsOpen}
        value={props.minTimeBefTotalAbsence}
        onChange={props.onMinTimeBefTotalAbsenceChange}
        required
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
        <Button variant="contained" type="submit" size="small" color='primary' className={props.classes.button}>
          Sauvegarder
        </Button>
      </div>
    </FormGroup>
  </FormControl>
</form>;

export default withStyles(styles)(CreateSSDForm);
