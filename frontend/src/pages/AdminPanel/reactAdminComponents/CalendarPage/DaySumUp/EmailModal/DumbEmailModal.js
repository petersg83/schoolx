import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import RemoveIcon from '@material-ui/icons/Remove';
import IconButton from '@material-ui/core/IconButton';

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
          <RemoveIcon />
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
