import React from 'react';
// import IconButton from '@material-ui/core/IconButton';
// import FormControl from '@material-ui/core/FormControl';
// import FormGroup from '@material-ui/core/FormGroup';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Switch from '@material-ui/core/Switch';
// import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
// import Checkbox from '@material-ui/core/Checkbox';
// import SaveIcon from '@material-ui/icons/Save';
import { withStyles } from '@material-ui/core/styles';
import 'moment/locale/fr';

const styles = theme => ({
  // container: {
  //   display: 'flex',
  //   flexWrap: 'wrap',
  //   flexDirection: 'row',
  // },
  // textField: {
  //   marginTop: theme.spacing.unit,
  //   marginBottom: theme.spacing.unit,
  //   marginRight: '30px',
  // },
  // checkbox: {
  //   marginRight: '30px',
  // },
  // switch: {
  //   marginRight: '30px',
  // },
  // button: {
  //   margin: theme.spacing.unit,
  // },
  // leftIcon: {
  //   marginRight: theme.spacing.unit,
  // },
  // iconSmall: {
  //   fontSize: 20,
  // },
});

const NotEditableRow = (props) => {
  let timeText = '';

  if (props.memberDay.arrivedAt && props.memberDay.leftAt) {
    timeText += ` ${props.memberDay.arrivedAt} → ${props.memberDay.leftAt}`;
  } else if (props.memberDay.arrivedAt && !props.memberDay.leftAt) {
    timeText += ` ${props.memberDay.arrivedAt} → ???`;
  }

  return <tr>
    <td style={{ paddingRight: '20px', paddingLeft: '8px' }}><Typography variant="body2">{props.memberDay.firstName} {props.memberDay.lastName}</Typography></td>
    <td style={{ paddingRight: '20px', paddingLeft: '8px' }}><Typography variant="body2">{timeText}</Typography></td>
    <td style={{ paddingRight: '20px', paddingLeft: '8px', backgroundColor: props.memberDay.color }}><Typography variant="body2">{props.memberDay.title}</Typography></td>
    <td style={{ paddingRight: '20px', paddingLeft: '8px' }}><Typography variant="body2">{props.memberDay.note}</Typography></td>

  </tr>;
}

const DumbMemberDayRow = (props) => <NotEditableRow {...props} />
// <tr>
//   <td style={{ padding: '0px 10px' }}><Typography variant="body2">{props.memberDay.firstName} {props.memberDay.lastName}</Typography></td>
//   <td style={{ padding: '0px 10px' }}><Typography variant="body2">Présent 10:25 → 16:30</Typography></td>
//   <td style={{ padding: '0px 10px' }}>
//     <form onSubmit={props.onSubmit}>
//     <FormControl component="fieldset">
//       <FormGroup style={{ flexDirection: 'row' }}>
//         <FormControlLabel
//           control={
//             <Switch
//               checked={props.isInHoliday}
//               onChange={props.onIsInHolidayChange}
//               value="isInHoliday"
//               color="secondary"
//             />
//           }
//           className={props.classes.switch}
//           label="En congé"
//         />
//         <TextField
//           id="arrivedAt"
//           label="Arrivé à"
//           type="time"
//           InputLabelProps={{ shrink: true }}
//           inputProps={{ step: 300 }}
//           className={props.classes.textField}
//           value={props.isInHoliday ? '' : props.arrivedAt}
//           onChange={props.onArrivedAtChange}
//           disabled={props.isInHoliday}
//           InputProps={{ disableUnderline: true }} // eslint-disable-line react/jsx-no-duplicate-props
//         />
//         <TextField
//           id="leftAt"
//           label="Parti à"
//           type="time"
//           InputLabelProps={{ shrink: true }}
//           inputProps={{ step: 300 }}
//           className={props.classes.textField}
//           value={props.isInHoliday ? '' : props.leftAt}
//           onChange={props.onLeftAtChange}
//           disabled={props.isInHoliday}
//           InputProps={{ disableUnderline: true }} // eslint-disable-line react/jsx-no-duplicate-props
//         />
//         <FormControlLabel
//           control={
//             <Checkbox
//               checked={!props.isInHoliday && props.isJustifiedDelay}
//               onChange={props.onIsJustifiedDelayChange}
//               value="isJustifiedDelay"
//               color="secondary"
//             />
//           }
//           className={props.classes.checkbox}
//           label="Retard justifié"
//           disabled={props.isInHoliday}
//         />
//         <FormControlLabel
//           control={
//             <Checkbox
//               checked={!props.isInHoliday && props.isJustifiedAbsence}
//               onChange={props.onIsJustifiedAbsenceChange}
//               value="isJustifiedAbsence"
//               color="secondary"
//             />
//           }
//           className={props.classes.checkbox}
//           label="Absence justifiée"
//           disabled={props.isInHoliday}
//         />
//         <TextField
//           id="note"
//           label="Note"
//           type="textArea"
//           InputLabelProps={{ shrink: true }}
//           inputProps={{ step: 300 }}
//           className={props.classes.textField}
//           value={props.note}
//           onChange={props.onNoteChange}
//         />
//         <IconButton size="small" color='secondary' className={props.classes.iconSmall}>
//           <SaveIcon />
//         </IconButton>
//       </FormGroup>
//     </FormControl>
//     </form>
//   </td>
// </tr>;

export default withStyles(styles)(DumbMemberDayRow);
