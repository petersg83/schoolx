import DumbModifyMemberDayForm from './DumbModifyMemberDayForm';
import { compose, withHandlers, withState } from 'recompose';
import moment from 'moment';
import config from '../../../../../../config';
import { httpClient } from '../../../../index';

export default compose(
  withState('arrivedAt', 'setArrivedAtChange', props => props.currentDay.arrivedAt || ''),
  withState('leftAt', 'setLeftAtChange', props => props.currentDay.leftAt || ''),
  withState('isJustifiedDelay', 'setIsJustifiedDelayChange', props => !!props.currentDay.justifiedDelay),
  withState('isJustifiedAbsence', 'setIsJustifiedAbsenceChange', props => !!props.currentDay.justifiedAbsence),
  withState('isInHoliday', 'setIsInHoliday', props => props.currentDay.dayType === 'holiday'),
  withState('note', 'setNote', props => props.currentDay.note || ''),
  withHandlers({
    onArrivedAtChange: props => e => props.setArrivedAtChange(e.target.value),
    onLeftAtChange: props => e => props.setLeftAtChange(e.target.value),
    onIsJustifiedDelayChange: props => e => props.setIsJustifiedDelayChange(e.target.checked),
    onIsJustifiedAbsenceChange: props => e => props.setIsJustifiedAbsenceChange(e.target.checked),
    onNoteChange: props => e => props.setNote(e.target.value),
    onIsInHolidayChange: props => e => props.setIsInHoliday(e.target.checked),
    onSubmit: props => (e) => {
      e.preventDefault();
      httpClient(`${config.apiEndpoint}/modifyMemberDay/${props.memberId}`, {
        method: 'PUT',
        headers: new Headers({
          Accept: 'application/json',
          ContentType: 'application/json',
        }),
        body: JSON.stringify({
          memberDay: {
            isInHoliday: props.isInHoliday,
            arrivedAt: props.arrivedAt,
            leftAt: props.leftAt,
            isJustifiedDelay: props.isJustifiedDelay,
            isJustifiedAbsence: props.isJustifiedAbsence,
            note: props.note,
          },
          date: moment(props.date).startOf('day'),
        }),
      })
      .then((res) => {
        if (res.status === 200) {
          return res.json;
        } else {
          throw new Error('Une erreur inconnue s\'est produite. Si elle persiste, contactez le créateur à contact@pierre-noel.fr');
        }
      })
      .then((res) => {
        props.afterSubmit();
      });
    },
  }),
)(DumbModifyMemberDayForm);
