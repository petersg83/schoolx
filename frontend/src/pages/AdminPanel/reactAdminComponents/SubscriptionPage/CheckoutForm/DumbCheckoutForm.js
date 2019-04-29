import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

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
      <Typography variant="title" gutterBottom>S'abonner</Typography>
      <Typography gutterBottom>
        Afin de s'adapter au budget de chaque école, chaque école est libre de choisir en conscience le tarif qu'elle souhaite payer pour l'utilisation de l'application.<br />
        Derrière cette application se cache de nombreuses heures de travail, le temps que je peux consacrer à l'entretenir et à l'améliorer dépend directement des revenus qu'elle génère.
      </Typography>
      <div style={{ marginTop: '10px' }}>
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
        <Button type="submit" className={props.classes.button} disabled={!props.price || props.loading} variant="contained" color="secondary" onClick={props.checkout}>
          {!props.loading && "Souscrire"}
          {props.loading && <CircularProgress size={24} />}
        </Button>
      </div>
    </div>
  );
};

export default withStyles(styles)(DumbCheckoutForm);
