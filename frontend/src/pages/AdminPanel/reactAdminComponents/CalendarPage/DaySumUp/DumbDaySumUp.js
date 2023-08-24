import React from 'react';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import MemberDayRow from './MemberDayRow';
import EmailModal from './EmailModal';
import moment from 'moment';
import 'moment/locale/fr';

const DumbDaySumUp = (props) => {
  let content;

  if (props.isSchoolOpen && props.membersDay.length) {
    const memberDayRows = props.membersDay && props.membersDay.map(md => <MemberDayRow memberDay={md} key={`md-${md.memberId}`} editMode={props.editMode} date={props.currentDate} afterSubmit={props.afterChangingAMemberDay} selectMember={props.selectMember}/>);
    content = <div>
      <Typography variant="subtitle2" sx={{ marginBottom: '10px', fontWeight: 400, fontSize: '0.75rem', lineHeight: 1.5, letterSpacing: '0.03333em' }}>
        {props.daySettings && props.daySettings.openAt} → {props.daySettings && props.daySettings.closeAt}<br />
        Retard à partir de {props.daySettings && props.daySettings.maxArrivalTime}<br />
        Abs. partielle en dessous de {props.daySettings && props.daySettings.minTimeBefPartialAbsence.replace(':', 'h')}, totale en dessous de {props.daySettings && props.daySettings.minTimeBefTotalAbsence.replace(':', 'h')}
      </Typography>
      <Table sx={{ minWidth: '1400px' }}>
        <TableHead>
          <TableRow>
            {!props.editMode && <TableCell padding="none"></TableCell>}
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
      <FormControl sx={{ flexDirection: 'row', display: 'flex' }}>
        <FormGroup sx={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
          <TextField
            id="date"
            label="Jour"
            type="date"
            defaultValue={moment().format('YYYY-MM-DD')}
            InputLabelProps={{ shrink: true }}
            onChange={e => props.onDateChange(e.target.value)}
            sx={{ marginRight: '20px' }}
          />
          <div>
            <Button disabled={props.modalButtonDisabled} sx={{ marginRight: '10px' }} color='secondary' size="small" variant="contained" onClick={() => props.openEmailModal()}>
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
    <Typography variant="subtitle2" sx={{ fontWeight: 400, fontSize: '0.75rem', lineHeight: 1.5, letterSpacing: '0.03333em' }}>{props.currentDate.format('dddd DD/MM/YYYY')}</Typography>
    {content}
  </div>;
};



export default DumbDaySumUp;
