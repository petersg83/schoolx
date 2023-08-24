import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import IconButton from '@mui/material/IconButton';

import moment from 'moment';
import 'moment/locale/fr';

moment.locale('fr');

const DumbEmailModal = (props) => {

  const sendingRows = props.emailsMetadata.map(
    (m, i) => <TableRow key={`email-${m.memberId}-${i}`}>
      <TableCell>{m.memberName}</TableCell>
      <TableCell>{m.name}</TableCell>
      <TableCell>{m.emailAddress}</TableCell>
      <TableCell>{m.phoneNumber}</TableCell>
      <TableCell>
        <Select
          value={m.sendingType}
          onChange={e => props.onSendingTypeChange(i, e.target.value)}
          >
          <MenuItem value=""><em>Aucun</em></MenuItem>
          <MenuItem disabled={!m.emailAddress}  value="email">Email</MenuItem>
          <MenuItem disabled={!m.phoneNumber} value="sms">SMS</MenuItem>
        </Select>
      </TableCell>
      <TableCell>
        <IconButton aria-label="Remove" onClick={() => props.removeMetada(i)}>
          <RemoveCircleOutlineIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );

  return <Dialog
    open={props.isOpen}
    onClose={props.onCancel}
    maxWidth={false}
  >
    <DialogContent>
      <div>
        <Table padding="dense">
          <TableHead>
            <TableRow>
              <TableCell>Membre</TableCell>
              <TableCell>Destinataire</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Téléphone</TableCell>
              <TableCell>Type d'envoi</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sendingRows}
          </TableBody>
        </Table>
        <div style={{ margin: '40px 0' }}></div>
        <Table padding="dense">
          <TableRow>
            <TableCell>Object de l'email</TableCell>
            <TableCell>
              <TextField
                margin="dense"
                fullWidth
                value={props.emailSubject}
                onChange={e => props.onEmailSubjectChange(e.target.value)}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Contenu de l'email</TableCell>
            <TableCell>
              <TextField
                multiline
                margin="dense"
                fullWidth
                rows={10}
                value={props.emailContent}
                onChange={e => props.onEmailContentChange(e.target.value)}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Contenu du sms</TableCell>
            <TableCell>
              <TextField
                multiline
                margin="dense"
                fullWidth
                rows={10}
                value={props.smsContent}
                onChange={e => props.onSmsContentChange(e.target.value)}
              />
            </TableCell>
          </TableRow>
        </Table>
        <div style={{ textAlign: 'right' }}>
          <p style={{ color: 'red' }}>
            {props.error}
            {!props.error && <div style={{ height: '19.2px' }}></div>}
          </p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '20px' }}>
          <Button size="small" onClick={props.onCancel}>
            Annuler
          </Button>
          <Button variant="contained" type="submit" size="small" color='secondary' onClick={props.sendEmailsAndSms} disabled={props.loading}>
            {props.loading ? 'chargement...' : 'Envoyer'}
          </Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
}

  export default DumbEmailModal;
