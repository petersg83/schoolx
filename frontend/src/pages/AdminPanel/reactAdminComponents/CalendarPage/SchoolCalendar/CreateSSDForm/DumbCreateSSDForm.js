import React from 'react';

import FormLabel from '@mui/material/FormLabel';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
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

const CreateSSDForm = props => <form onSubmit={props.onSubmit}>
  <FormControl component="fieldset">
    <FormLabel component="legend" focused>{props.date && props.date.locale('fr').format('dddd DD/MM/YYYY')}</FormLabel>
    <FormGroup>
      <FormControlLabel
        control={
          <Switch
            checked={!props.isClosed}
            onChange={props.onIsClosedChange}
            value="isClosed"
            color="secondary"
          />
        }
        label={props.isClosed ? "École fermée" : 'École ouverte'}
      />
      <TextField
        id="openAt"
        label="Ouvre à"
        type="time"
        InputLabelProps={{ shrink: true }}
        className={props.classes.textField}
        disabled={props.isClosed}
        value={props.isClosed ? '' : props.openAt}
        onChange={props.onOpenAtChange}
        required
      />
      <TextField
        id="closeAt"
        label="Ferme à"
        type="time"
        InputLabelProps={{ shrink: true }}
        className={props.classes.textField}
        disabled={props.isClosed}
        value={props.isClosed ? '' : props.closeAt}
        onChange={props.onCloseAtChange}
        required
      />
      <TextField
        id="maxArrivalTime"
        label="Heure limite d'arrivée"
        type="time"
        InputLabelProps={{ shrink: true }}
        className={props.classes.textField}
        disabled={props.isClosed}
        value={props.isClosed ? '' : props.maxArrivalTime}
        onChange={props.onMaxArrivalTimeChange}
        required
      />
      <TextField
        id="minTimeBefPartialAbsence"
        label="Temps de présence minimum avant absence partielle"
        type="time"
        InputLabelProps={{ shrink: true }}
        className={props.classes.textField}
        disabled={props.isClosed}
        value={props.isClosed ? '' : props.minTimeBefPartialAbsence}
        onChange={props.onMinTimeBefPartialAbsenceChange}
        required
      />
      <TextField
        id="minTimeBefTotalAbsence"
        label="Temps de présence minimum avant absence totale"
        type="time"
        InputLabelProps={{ shrink: true }}
        className={props.classes.textField}
        disabled={props.isClosed}
        value={props.isClosed ? '' : props.minTimeBefTotalAbsence}
        onChange={props.onMinTimeBefTotalAbsenceChange}
        required
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
        {props.canDelete && <Button variant="contained" onClick={props.onDelete} size="small" className={props.classes.button}>
          Supprimer
        </Button>}
        <Button variant="contained" type="submit" size="small" color='secondary' className={props.classes.button}>
          Sauvegarder
        </Button>
      </div>
    </FormGroup>
  </FormControl>
</form>;

export default withStyles(styles)(CreateSSDForm);
