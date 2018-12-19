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
  withState('firstLoadDone', 'setFirstLoadDone', false),
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
          const membersDay = res.membersDay.reduce((membersDay, day) => {
            const event = Object.assign({}, day);

            if (day.dayType === 'holiday') {
              event.title = 'Vacances';
              event.color = 'dimgray';
            } else if (day.dayType === 'dayOff') {
              event.title = 'Jour off';
              event.color = 'dimgray';
            } else if (day.absence === 'total' && !day.justifiedAbsence) {
              event.title = 'Absence totale';
              event.color = 'red';
            } else if (day.absence === 'total' && day.justifiedAbsence) {
              event.title = 'Absence totale justifiée';
              event.color = 'limegreen';
            } else if (day.absence === 'partial' && !day.justifiedDelay) {
              event.title = 'Absence partielle';
              event.color = 'orange';
            } else if (day.absence === 'partial' && day.justifiedDelay) {
              event.title = 'Absence partielle justifiée';
              event.color = 'MediumSeaGreen';
            } else if (day.absence === 'undefined') {
              event.title = 'Anomalie';
              event.color = 'hotpink';
            } else if (!day.absence) {
              event.title = 'Présent';
              event.color = 'green';
            }

            if (day.arrivedAt && day.leftAt) {
              event.title += ` ${day.arrivedAt} → ${day.leftAt}`;
            } else if (day.arrivedAt && !day.leftAt) {
              event.title += ` ${day.arrivedAt} → ???`;
            }

            return [...membersDay, event];
          }, []);

          props.setMembersDay(membersDay);
          props.setDaySettings(res.daySettings);
          console.log(membersDay);
        }
        props.setFirstLoadDone(true);
      });
    },
  }),
  lifecycle({
    componentDidMount() {
      this.props.getMembers(this.props.currentDate);
    },
  }),
)(DumbDaySumUp);
