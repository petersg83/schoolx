import React from 'react';
import { Title } from 'react-admin';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const DumbSettingsPage = (props) => {
  let tableBody;
  let buttons;
  if (props.editMode) {
    tableBody = <TableBody>
      <TableRow>
        <TableCell margin="dense" style={{ width: '240px' }}><b>Code d'accès de la page entrée/sortie</b></TableCell>
        <TableCell numeric>
          <TextField
            id="inAndOutPassword"
            margin="dense"
            fullWidth
            value={props.accessCodeEdit}
            onChange={e => props.onAccessCodeEditChange(e.target.value)}
            error={!!props.errors.accessCode}
            helperText={props.errors.accessCode || ''}
            style={props.errors.accessCode ? {} : { marginBottom: '20px' }}
          />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell margin="dense" style={{ width: '240px' }}><b>Object email d'absence</b></TableCell>
        <TableCell numeric>
          <TextField
            id="inAndOutPassword"
            margin="dense"
            fullWidth
            value={props.emailSubjectEdit}
            onChange={e => props.onEmailSubjectEditChange(e.target.value)}
            error={!!props.errors.emailSubject}
            helperText={props.errors.emailSubject || ''}
            style={props.errors.emailSubject ? {} : { marginBottom: '20px' }}
          />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell margin="dense"><b>Contenu email d'absence</b></TableCell>
        <TableCell>
          <TextField
            id="inAndOutPassword"
            multiline
            margin="dense"
            fullWidth
            rows={10}
            value={props.emailEdit}
            onChange={e => props.onEmailEditChange(e.target.value)}
            error={!!props.errors.email}
            helperText={props.errors.email || ''}
            style={props.errors.email ? {} : { marginBottom: '20px' }}
          />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell margin="dense"><b>Sms d'absence</b></TableCell>
        <TableCell>
          <TextField
            id="inAndOutPassword"
            multiline
            margin="dense"
            fullWidth
            rows={10}
            value={props.smsEdit}
            onChange={e => props.onSmsEditChange(e.target.value)}
            error={!!props.errors.sms}
            helperText={props.errors.sms || ''}
            style={props.errors.sms ? {} : { marginBottom: '20px' }}
          />
        </TableCell>
      </TableRow>
    </TableBody>;
    buttons = <div style={{ display: 'flex', justifyContent: 'space-between', margin: '20px' }}>
      <Button size="small" onClick={() => props.onEditModeChange(false)}>
        Annuler
      </Button>
      <Button variant="contained" type="submit" size="small" color='secondary'>
        Sauvegarder
      </Button>
    </div>;
  } else {
    tableBody = <TableBody>
      <TableRow>
        <TableCell><b>Code d'accès de la page entrée/sortie</b></TableCell>
        <TableCell>{props.accessCode}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell><b>Object email d'absence</b></TableCell>
        <TableCell>{props.emailSubject}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell><b>Contenu email d'absence</b></TableCell>
        <TableCell>{props.email}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell><b>Sms d'absence</b></TableCell>
        <TableCell>{props.sms}</TableCell>
      </TableRow>
    </TableBody>;
    buttons = <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '20px' }}>
      <Button color='secondary' size="small" variant="contained" onClick={() => props.onEditModeChange(true)}>
        Modifier
      </Button>
    </div>;
  }



  return <Card>
    <Title title="Paramètres" />
    <CardContent>
      <form onSubmit={props.onSubmit}>
        <FormControl>
          <FormGroup>
            <Table style={{ width: '800px' }}>
            {tableBody}
            </Table>
            {buttons}
          </FormGroup>
        </FormControl>
      </form>
    </CardContent>
  </Card>;
};

export default DumbSettingsPage;
