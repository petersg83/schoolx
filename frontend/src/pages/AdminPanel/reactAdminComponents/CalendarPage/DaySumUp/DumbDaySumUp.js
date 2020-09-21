import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import MemberDayRow from './MemberDayRow';
import EmailModal from './EmailModal';
import moment from 'moment';
import 'moment/locale/fr';

const DumbDaySumUp = (props) => {
  let content;

  if (props.isSchoolOpen && props.membersDay.length) {
    const memberDayRows = props.membersDay && props.membersDay.map(md => <MemberDayRow memberDay={md} key={`md-${md.memberId}`} editMode={props.editMode} date={props.currentDate} afterSubmit={props.afterChangingAMemberDay} selectMember={props.selectMember}/>);
    content = <div>
      <Typography variant="caption" style={{ marginBottom: '10px' }}>
        {props.daySettings && props.daySettings.openAt} → {props.daySettings && props.daySettings.closeAt}<br />
        Retard à partir de {props.daySettings && props.daySettings.maxArrivalTime}<br />
        Abs. partielle en dessous de {props.daySettings && props.daySettings.minTimeBefPartialAbsence.replace(':', 'h')}, totale en dessous de {props.daySettings && props.daySettings.minTimeBefTotalAbsence.replace(':', 'h')}
      </Typography>
      <Table style={{ minWidth: '1400px' }}>
        <TableHead>
          <TableRow>
            <TableCell padding="none"></TableCell>
            <TableCell padding="dense">Nom</TableCell>
            <TableCell padding="dense" align="right">Heures</TableCell>
            <TableCell padding="dense" align="right">Résumé</TableCell>
            <TableCell padding="dense" align="right">{props.editMode ? 'Informations' : 'Note'}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {memberDayRows}
        </TableBody>
      </Table>
    </div>;
  } else if (props.isSchoolOpen && !props.membersDay.length) {
    content = <Typography>Aucun membre n'était attendu ce jour.</Typography>;
  } else if (!props.isSchoolOpen) {
    content = <Typography>École fermée ce jour.</Typography>;
  }

  return <div style={{ marginTop: '20px' }}>
    <EmailModal selectedMembers={props.selectedMembers} isOpen={props.isEmailModalOpen} closeModal={props.closeEmailModal} />
    <div style={{ marginBottom: '20px' }}>
      <FormControl style={{ flexDirection: 'row', display: 'flex' }}>
        <FormGroup style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
          <TextField
            id="date"
            label="Jour"
            type="date"
            defaultValue={moment().format('YYYY-MM-DD')}
            InputLabelProps={{ shrink: true }}
            onChange={e => props.onDateChange(e.target.value)}
            style={{ marginRight: '20px' }}
          />
          <div>
            <Button disabled={props.modalButtonDisabled} style={{ marginRight: '10px' }} color='secondary' size="small" variant="contained" onClick={() => props.openEmailModal()}>
              Emails de retard
            </Button>
            <FormControlLabel
            control={
              <Switch
              checked={props.editMode}
              onChange={e => props.onEditModeChange(e.target.checked)}
              value="editMode"
              color="secondary"
              />
            }
            label="Mode édition"
            />
          </div>
        </FormGroup>
      </FormControl>
    </div>
    <Typography variant="caption" style={{ marginBottom: '10px' }}>{props.currentDate.format('dddd DD/MM/YYYY')}</Typography>
    {content}
  </div>;
};



export default DumbDaySumUp;
