import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import 'moment/locale/fr';
import { minutesToTimeText } from '../../../../../../utils/dates';

const DumbMemberSumUp = (props) => {
  const averagePresenceDayTimeText = props.totalNbOfNeededDays
    ? minutesToTimeText(Math.round(props.nbOfTotalPresentMinutes / props.totalNbOfNeededDays))
    : '00h00';

  return <div style={{ display: 'flex' }}>
    <div style={{ flex: '1 1 auto' }}>
      <Typography variant="caption" style={{ marginBottom: '10px' }}>Résumé du {props.from ? props.from.format('dddd DD/MM/YY') : '...'} au {props.to ? props.to.format('dddd DD/MM/YY') : '...'}</Typography>
      <FormControl style={{ flexDirection: 'row', display: 'flex' }}>
        <FormGroup style={{ flexDirection: 'row' }}>
          <TextField
            id="from"
            label="Du"
            type="date"
            InputLabelProps={{ shrink: true }}
            onChange={e => props.onFromChange(e.target.value)}
            style={{ marginRight: '20px' }}
            value={props.from && props.from.format('YYYY-MM-DD')}
          />
          <TextField
            id="to"
            label="Au"
            type="date"
            InputLabelProps={{ shrink: true }}
            onChange={e => props.onToChange(e.target.value)}
            style={{ marginRight: '20px' }}
            value={props.to && props.to.format('YYYY-MM-DD')}
          />
        </FormGroup>
      </FormControl>
    </div>
    <div style={{ flex: '1 1 auto', minHeight: '450px' }}>
    {props.unvalidDates
      ? <Typography variant="caption">Impossible d'afficher le résumé de présence pour ce membre car les dates fournies ne sont pas valides</Typography>
      : <Table style={{ maxWidth: '580px' }}>
        <TableBody>
          <TableRow>
            <TableCell component="td" scope="row">Total jours ouverts</TableCell>
            <TableCell align="right">{props.totalNbOfOpenedDays} jours</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="td" scope="row">Total jours membre attendu</TableCell>
            <TableCell align="right">{props.totalNbOfNeededDays} jours</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="td" scope="row">Présence (temps minimum respecté)</TableCell>
            <TableCell align="right">{props.nbOfTotalPresentDays} jours</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="td" scope="row">Absences partielles NJ</TableCell>
            <TableCell align="right">{props.nbOfPartialAbsences - props.nbOfJustifiedPartialAbsences}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="td" scope="row">Absences totales NJ</TableCell>
            <TableCell align="right">{props.nbOfTotalAbsences - props.nbOfJustifiedTotalAbsences}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="td" scope="row">Retards NJ</TableCell>
            <TableCell align="right">{props.nbOfDelays - props.nbOfJustifiedDelays}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="td" scope="row">Absences partielles J</TableCell>
            <TableCell align="right">{props.nbOfJustifiedPartialAbsences}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="td" scope="row">Absences totales J</TableCell>
            <TableCell align="right">{props.nbOfJustifiedTotalAbsences}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="td" scope="row">Retards J</TableCell>
            <TableCell align="right">{props.nbOfJustifiedDelays}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="td" scope="row">Présence moyenne</TableCell>
            <TableCell align="right">~{averagePresenceDayTimeText}/jour</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="td" scope="row">Congés pris</TableCell>
            <TableCell align="right">{props.nbOfHolidaysTaken} jours</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="td" scope="row">Jours off pris</TableCell>
            <TableCell align="right">{props.nbOfDayOffTaken} jours</TableCell>
          </TableRow>
        </TableBody>
      </Table>}
    </div>
  </div>;
};

export default DumbMemberSumUp;
