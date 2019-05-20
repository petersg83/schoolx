import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
  button: {
    width: '116px',
  },
});

const DumbCheckoutForm = (props) => {
  const plansMenuItems = props.plans.map(p => <MenuItem key={`${p.price}-${p.frequency}`} value={p.price}>{p.price}€/{p.frequency === 'month' ? 'mois' : 'an'}</MenuItem>);

  return (
    <div>
      <Typography style={{ marginTop: '20px' }} variant="title" gutterBottom>{props.subscriptionType === 'new' ? "S'abonner" : 'Changer de tarif'}</Typography>
      <Typography>
        Vous pouvez opter pour un paiement mensuel ou pour un paiement annuel.
      </Typography>
      <div>
        <FormControl className={props.classes.formControl}>
          <Select
            value={props.frequency}
            onChange={e => props.handleFrequencyChange(e.target.value)}
          >
            <MenuItem value="month">Mensuel</MenuItem>
            <MenuItem value="year">Annuel</MenuItem>
          </Select>
        </FormControl>
        <FormControl className={props.classes.formControl}>
          <Select
            value={props.price}
            onChange={e => props.handlePriceChange(e.target.value)}
          >
            <MenuItem value=""></MenuItem>
            {plansMenuItems}
          </Select>
        </FormControl>
        <Button type="submit" className={props.classes.button} disabled={!props.price || props.loading} variant="contained" color="secondary" onClick={props.onChangeSubcriptionClick}>
          {!props.loading && "Souscrire"}
          {props.loading && <CircularProgress size={24} />}
        </Button>
      </div>
      <Dialog
        open={props.isChangingModalOpen}
        onClose={props.onExitChangingModal}
      >
        <DialogContent>
          <Typography variant='subheading' style={{ textAlign: 'center', paddingBottom: '1.5rem' }} gutterBottom>
            Passer à {props.price}€/{props.frequency === 'month' ? 'mois' : 'an'} à partir de maintenant ?
          </Typography>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <Button variant="contained" color="secondary" size="small" onClick={props.onValidateChangingClick}>
            Oui
          </Button>
          <Button size="small" onClick={props.onExitChangingModal}>
            Annuler
          </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default withStyles(styles)(DumbCheckoutForm);
