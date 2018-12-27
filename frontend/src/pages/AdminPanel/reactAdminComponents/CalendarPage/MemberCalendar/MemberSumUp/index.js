import { compose, lifecycle, withHandlers, withState, withProps } from 'recompose';
import moment from 'moment';
import DumbMemberSumUp from './DumbMemberSumUp';
import config from '../../../../../../config';
import { httpClient } from '../../../../index';

export default compose(
  withState('from', 'setFrom', moment().startOf('day')),
  withState('to', 'setTo', moment().startOf('day')),
  withState('nbOfTotalAbsences', 'setNbOfTotalAbsences', 0),
  withState('nbOfJustifiedTotalAbsences', 'setNbOfJustifiedTotalAbsences', 0),
  withState('nbOfPartialAbsences', 'setNbOfPartialAbsences', 0),
  withState('nbOfJustifiedPartialAbsences', 'setNbOfJustifiedPartialAbsences', 0),
  withState('nbOfDelays', 'setNbOfDelays', 0),
  withState('nbOfJustifiedDelays', 'setNbOfJustifiedDelays', 0),
  withState('nbOfTotalPresentDays', 'setNbOfTotalPresentDays', 0),
  withState('nbOfTotalPresentMinutes', 'setNbOfTotalMinutes', 0),
  withState('nbOfHolidaysTaken', 'setNbOfHolidaysTaken', 0),
  withState('nbOfDayOffTaken', 'setNbOfDayOffTaken', 0),
  withState('undefinedDays', 'setUndefinedDays', 0),
  withState('totalNbOfOpenedDays', 'setTotalNbOfOpenedDays', 0),
  withState('totalNbOfNeededDays', 'setTotalNbOfNeededDays', 0),
  withState('datesSetFirstTime', 'setDatesSetFirstTime', false),
  withHandlers({
    getSumUpFor: props => (currentYear, from, to) => {
      if (props.memberId && from && to && from.isSameOrBefore(to)) {
        let adjustedTo = to;
        if (to.isAfter(moment())) {
          adjustedTo = moment().startOf('day');
        }
        httpClient(`${config.apiEndpoint}/memberSumUp?memberId=${props.memberId}&currentYear=${currentYear}&from=${from.valueOf()}&to=${adjustedTo.valueOf()}`)
        .then((res) => {
          if (res.status === 200) {
            return res.json;
          } else {
            throw new Error('Une erreur inconnue s\'est produite. Si elle persiste, contactez le créateur à contact@pierre-noel.fr');
          }
        })
        .then((res) => {
          console.log('res', res);
          props.setDatesSetFirstTime(true);
          props.setFrom(moment(res.from).startOf('day'));
          props.setTo(moment(res.to).startOf('day'));
          props.setNbOfTotalAbsences(res.nbOfTotalAbsences);
          props.setNbOfJustifiedTotalAbsences(res.nbOfJustifiedTotalAbsences);
          props.setNbOfPartialAbsences(res.nbOfPartialAbsences);
          props.setNbOfJustifiedPartialAbsences(res.nbOfJustifiedPartialAbsences);
          props.setNbOfDelays(res.nbOfDelays);
          props.setNbOfJustifiedDelays(res.nbOfJustifiedDelays);
          props.setNbOfTotalPresentDays(res.nbOfTotalPresentDays);
          props.setNbOfTotalMinutes(res.nbOfTotalPresentMinutes);
          props.setNbOfHolidaysTaken(res.nbOfHolidaysTaken);
          props.setNbOfDayOffTaken(res.nbOfDayOffTaken);
          props.setUndefinedDays(res.undefinedDays);
          props.setTotalNbOfOpenedDays(res.totalNbOfOpenedDays);
          props.setTotalNbOfNeededDays(res.totalNbOfNeededDays);
        });
      }
    },
  }),
  withHandlers({
    onFromChange: props => newFrom => {
      if (newFrom === '') {
        props.setFrom('');
      } else if (moment(newFrom).isValid()) {
        props.setFrom(moment(newFrom).startOf('day'));
        props.getSumUpFor(false, moment(newFrom).startOf('day'), props.to);
      }
    },
    onToChange: props => newTo => {
      if (newTo === '') {
        props.setTo('');
      } else if (moment(newTo).isValid()) {
        props.setTo(moment(newTo).startOf('day'));
        props.getSumUpFor(false, props.from, moment(newTo).startOf('day'));
      }
    },
  }),
  lifecycle({
    componentDidMount() {
      this.props.getSumUpFor(true, this.props.from, this.props.to);
    },
    componentDidUpdate(prevProps) {
      if (this.props.memberId !== prevProps.memberId) {
        this.props.getSumUpFor(!this.props.datesSetFirstTime, this.props.from, this.props.to);
      }
    },
  }),
  withProps(props => ({
    unvalidDates: !props.from || !props.to || !props.from.isValid() || !props.to.isValid() || props.from.isAfter(props.to),
  })),
)(DumbMemberSumUp);
