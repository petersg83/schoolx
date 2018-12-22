import DumbDaySumUp from './DumbDaySumUp';
import { compose, lifecycle, withHandlers, withState } from 'recompose';
import moment from 'moment';
import config from '../../../../../config';
import { httpClient } from '../../../index';

export default compose(
  withState('currentDate', 'setCurrentDate', moment().startOf('day')),
  withState('membersDay', 'setMembersDay', []),
  withState('daySettings', 'setDaySettings', null),
  withState('isSchoolOpen', 'setIsSchoolOpen', false),
  withHandlers({
    getMembers: props => (date) => {
      httpClient(`${config.apiEndpoint}/membersDay?date=${moment(date).valueOf()}`, {
        method: 'GET',
      })
      .then((res) => {
        if (res.status === 200) {
          return res.json;
        } else {
          throw new Error('Une erreur inconnue s\'est produite. Si elle persiste, contactez le créateur à contact@pierre-noel.fr');
        }
      })
      .then((res) => {
        if (!res.isSchoolOpen) {
          props.setIsSchoolOpen(false);
        } else {
          props.setIsSchoolOpen(true);
          let membersDay = res.membersDay.reduce((membersDay, day) => {
            const event = Object.assign({}, day);
            const today = moment().startOf('day');
            const dayIsBeforeToday = moment(date).isSameOrBefore(today);

            if (day.dayType === 'holiday') {
              event.title = 'Vacances';
              event.color = 'dimgray';
            } else if (day.dayType === 'dayOff') {
              event.title = 'Jour off';
              event.color = 'dimgray';
            } else if (day.absence === 'total' && !day.justifiedAbsence && dayIsBeforeToday) {
              event.title = 'Absence totale';
              event.color = 'red';
            } else if (day.absence === 'total' && day.justifiedAbsence && dayIsBeforeToday) {
              event.title = 'Absence totale justifiée';
              event.color = 'limegreen';
            } else if (day.absence === 'partial' && !day.justifiedDelay && dayIsBeforeToday) {
              event.title = 'Absence partielle';
              event.color = 'orange';
            } else if (day.absence === 'partial' && day.justifiedDelay && dayIsBeforeToday) {
              event.title = 'Absence partielle justifiée';
              event.color = 'MediumSeaGreen';
            } else if (day.absence === 'undefined') {
              event.title = 'Anomalie';
              event.color = 'hotpink';
            } else if (!day.absence && dayIsBeforeToday) {
              event.title = 'Présent';
              event.color = 'green';
            } else if (!dayIsBeforeToday) {
              event.title = 'Pas encore arrivé';
              event.color = 'white';
            }

            return [...membersDay, event];
          }, []);

          membersDay.sort((m1, m2) => `${m1.firstName} ${m1.lastName}` < `${m2.firstName} ${m2.lastName}` ? -1 : 1);
          props.setMembersDay(membersDay);
          props.setDaySettings(res.daySettings);
          props.setCurrentDate(moment(date));
        }
      });
    },
  }),
  withHandlers({
    onDateChange: props => date => {
      console.log('date', date);
      props.getMembers(date);
    },
  }),
  lifecycle({
    componentDidMount() {
      this.props.getMembers(this.props.currentDate);
    },
  }),
)(DumbDaySumUp);
