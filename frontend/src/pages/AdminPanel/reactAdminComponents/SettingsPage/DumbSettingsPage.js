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
        <TableCell align="right"><b>Code d'accès de la page entrée/sortie</b></TableCell>
        <TableCell align="right">
          <TextField
            id="inAndOutPassword"
            value={props.accessCodeEdit}
            onChange={e => props.onAccessCodeEditChange(e.target.value)}
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
        <TableCell align="right"><b>Code d'accès de la page entrée/sortie</b></TableCell>
        <TableCell align="right">{props.accessCode}</TableCell>
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
            <Table style={{ width: '600px' }}>
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
