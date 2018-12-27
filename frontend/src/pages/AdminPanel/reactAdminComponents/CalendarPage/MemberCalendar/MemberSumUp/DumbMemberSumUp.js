import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import moment from 'moment';
import 'moment/locale/fr';
import { minutesToTimeText } from '../../../../../../utils/dates';



const DumbMemberSumUp = (props) => {

  const averagePresenceDayTimeText = props.nbOfTotalPresentDays
    ? minutesToTimeText(Math.round(props.nbOfTotalPresentMinutes / props.nbOfTotalPresentDays))
    : '00h00';

  return <div style={{ display: 'flex' }}>
    <div style={{ flex: '1 1 auto' }}>
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
      <Typography variant="caption" style={{ marginTop: '10px' }}>Résumé du {props.from.format('dddd DD/MM/YY')} au {props.to.format('dddd DD/MM/YY')}</Typography>
    </div>
    <div style={{ flex: '1 1 auto' }}>
      <Table style={{ maxWidth: '450px' }}>
        <TableBody>
          <TableRow>
            <TableCell component="td" scope="row">Présence</TableCell>
            <TableCell align="right">{props.nbOfTotalAbsences} jours (~{averagePresenceDayTimeText}/jour)</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="td" scope="row">Retards</TableCell>
            <TableCell align="right">{props.nbOfDelays}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="td" scope="row">Absences partielles</TableCell>
            <TableCell align="right">{props.nbOfPartialAbsences}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="td" scope="row">Absences totales</TableCell>
            <TableCell align="right">{props.nbOfTotalAbsences}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="td" scope="row">Congés pris</TableCell>
            <TableCell align="right">{props.nbOfHolidaysTaken} jours</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="td" scope="row">Jours off pris</TableCell>
            <TableCell align="right">{props.nbOfDayOfTaken} jours</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </div>;
};

export default DumbMemberSumUp;
