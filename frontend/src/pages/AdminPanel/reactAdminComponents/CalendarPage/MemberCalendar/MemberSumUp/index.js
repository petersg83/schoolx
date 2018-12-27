import { compose, lifecycle, withHandlers, withState } from 'recompose';
import moment from 'moment';
import DumbMemberSumUp from './DumbMemberSumUp';

export default compose(
  withState('from', 'setFrom', moment()),
  withState('to', 'setTo', moment()),
  withState('nbOfTotalAbsences', 'setNbOfTotalAbsences', 0),
  withState('nbOfPartialAbsences', 'setNbOfPartialAbsences', 0),
  withState('nbOfDelays', 'setNbOfDelays', 0),
  withState('nbOfTotalPresentDays', 'setNbOfTotalPresentDays', 0),
  withState('nbOfTotalPresentMinutes', 'setNbOfTotalMinutes', 0),
  withState('nbOfHolidaysTaken', 'setNbOfHolidaysTaken', 0),
  withState('nbOfDayOfTaken', 'setNbOfDayOfTaken', 0),
  withHandlers({
    getSumUpFor: props => (currentYear, from, to) => {
      console.log('ok', currentYear);
    },
    onFromChange: props => newFrom => {
      if (moment(newFrom).isValid()) {
        props.setFrom(moment(newFrom));
      }
    },
    onToChange: props => newTo => {
      if (moment(newTo).isValid()) {
        props.setTo(moment(newTo));
      }
    },
  }),
  lifecycle({
    componentDidMount() {
      this.props.getSumUpFor(true);
    },
  }),
)(DumbMemberSumUp);
