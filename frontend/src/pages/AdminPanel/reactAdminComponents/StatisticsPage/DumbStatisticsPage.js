import React from 'react';
import { Title } from 'react-admin';
import { withStyles } from '@mui/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import TableSortLabel from '@mui/material/TableSortLabel';
import 'moment/locale/fr';
import { minutesToTimeText } from '../../../../utils/dates';
import config from '../../../../config';

const styles = theme => ({
  table: {
    minWidth: 1500,
  },
});

const DumbStatisticsPage = (props) => {
  const columnTitles = [
    { text: 'Avatar', align: 'left', orderKey: 'name' },
    { text: 'Membre', align: 'left', orderKey: 'name' },
    { text: 'Jours ouverts', align: 'right', orderKey: 'totalNbOfOpenedDays' },
    { text: 'Jours membre attendu', align: 'right', orderKey: 'totalNbOfNeededDays' },
    { text: 'Présent', align: 'right', orderKey: 'nbOfTotalPresentDays' },
    { text: 'Abs. part. NJ', align: 'right', orderKey: 'nbOfPartialAbsencesNJ' },
    { text: 'Abs. tot. NJ', align: 'right', orderKey: 'nbOfTotalAbsencesNJ' },
    { text: 'Abs. tot. + part. NJ', align: 'right', orderKey: 'nbOfTotalAndPartialAbsencesNJ' },
    { text: 'Retards NJ', align: 'right', orderKey: 'nbOfDelaysNJ' },
    { text: 'Abs. part. J', align: 'right', orderKey: 'nbOfJustifiedPartialAbsences' },
    { text: 'Abs. tot. J', align: 'right', orderKey: 'nbOfJustifiedTotalAbsences' },
    { text: 'Retards J', align: 'right', orderKey: 'nbOfJustifiedDelays' },
    { text: 'Présence moyenne', align: 'right', orderKey: 'averageTimeSpent' },
    { text: 'Congés', align: 'right', orderKey: 'nbOfHolidaysTaken' },
    { text: 'Jours off', align: 'right', orderKey: 'nbOfDayOffTaken' },
  ];

  return <Card>
    <Title title="Statistiques" />
    <CardContent>
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

      <br />

      <Table className={props.classes.table}>
        <TableHead>
          <TableRow>
          {columnTitles.map((ct, index) => (
            <TableCell key={ct.index} padding="none" align={ct.align} style={{ textAlign: ct.align }}>
              <Tooltip
                title="Trier"
                placement={ct.align === 'right' ? 'bottom-end' : 'bottom-start'}
                enterDelay={300}
              >
                <TableSortLabel
                  active={props.sortSettings.columnId === index}
                  direction={props.sortSettings.order}
                  onClick={() => props.onColumnTitleClick(index, ct.orderKey)}
                  style={{ display: 'flex', flexDirection: ct.orderKey === 'name' ? 'row' : 'row-reverse' }}
                >
                  {ct.text}
                </TableSortLabel>
              </Tooltip>
            </TableCell>
          ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {props.rows.map(row => (
            <TableRow key={row.memberId} style={{ height: '40px' }}>
              <TableCell padding="none">{row.avatarPath ? <img alt={row.name} style={{ maxWidth: '34px', maxHeight: '40px' }} src={`${config.apiEndpoint}/public/avatars/${row.avatarPath}`} /> : null}</TableCell>
              <TableCell padding="none">{row.name}</TableCell>
              <TableCell padding="none" align="right" style={{ textAlign: 'right' }}>{row.totalNbOfOpenedDays}</TableCell>
              <TableCell padding="none" align="right" style={{ textAlign: 'right' }}>{row.totalNbOfNeededDays}</TableCell>
              <TableCell padding="none" align="right" style={{ textAlign: 'right' }}>{row.nbOfTotalPresentDays}</TableCell>
              <TableCell padding="none" align="right" style={{ textAlign: 'right' }}>{row.nbOfPartialAbsencesNJ}</TableCell>
              <TableCell padding="none" align="right" style={{ textAlign: 'right' }}>{row.nbOfTotalAbsencesNJ}</TableCell>
              <TableCell padding="none" align="right" style={{ textAlign: 'right' }}>{row.nbOfTotalAndPartialAbsencesNJ}</TableCell>
              <TableCell padding="none" align="right" style={{ textAlign: 'right' }}>{row.nbOfDelaysNJ}</TableCell>
              <TableCell padding="none" align="right" style={{ textAlign: 'right' }}>{row.nbOfJustifiedPartialAbsences}</TableCell>
              <TableCell padding="none" align="right" style={{ textAlign: 'right' }}>{row.nbOfJustifiedTotalAbsences}</TableCell>
              <TableCell padding="none" align="right" style={{ textAlign: 'right' }}>{row.nbOfJustifiedDelays}</TableCell>
              <TableCell padding="none" align="right" style={{ textAlign: 'right' }}>{minutesToTimeText(row.averageTimeSpent)}/j</TableCell>
              <TableCell padding="none" align="right" style={{ textAlign: 'right' }}>{row.nbOfHolidaysTaken}</TableCell>
              <TableCell padding="none" align="right" style={{ textAlign: 'right' }}>{row.nbOfDayOffTaken}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

    </CardContent>
  </Card>;
}
export default withStyles(styles)(DumbStatisticsPage);
