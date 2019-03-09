import { compose, lifecycle, withHandlers, withState } from 'recompose';
import moment from 'moment';
import DumbStatisticsPage from './DumbStatisticsPage';
import config from '../../../../config';
import { httpClient } from '../../index';

const compareNumber = attribute => (a, b) => a[attribute] < b[attribute] ? -1 : 1;
const compareString = attribute => (a, b) => a[attribute].toLowerCase() < b[attribute].toLowerCase() ? -1 : 1;

export default compose(
  withState('from', 'setFrom', moment().startOf('day')),
  withState('to', 'setTo', moment().startOf('day')),
  withState('rows', 'setRows', []),
  withState('sortSettings', 'setSortSettings', { columnId: null, order: 'asc', orderKey: 'name' }),
  withHandlers({
    getAllSumUpFor: props => (currentYear, from, to) => {
      if (from && to && from.isSameOrBefore(to)) {
        let adjustedTo = to;
        if (to.isAfter(moment())) {
          adjustedTo = moment().startOf('day');
        }
        httpClient(`${config.apiEndpoint}/membersSumUp?currentYear=${currentYear}&from=${from.valueOf()}&to=${adjustedTo.valueOf()}`)
        .then((res) => {
          if (res.status === 200) {
            return res.json;
          } else {
            throw new Error('Une erreur inconnue s\'est produite. Si elle persiste, contactez le créateur à contact@pierre-noel.fr');
          }
        }).then((res) => {
          props.setFrom(moment(res.from).startOf('day'));
          props.setTo(moment(res.to).startOf('day'));
          const membersSumUp = res.membersSumUp.map(msu => (
            {
              memberId: msu.memberId,
              name: msu.name,
              avatarPath: msu.avatarPath,
              totalNbOfOpenedDays: msu.totalNbOfOpenedDays,
              totalNbOfNeededDays: msu.totalNbOfNeededDays,
              nbOfTotalPresentDays: msu.nbOfTotalPresentDays,
              nbOfPartialAbsencesNJ: msu.nbOfPartialAbsences - msu.nbOfJustifiedPartialAbsences,
              nbOfTotalAbsencesNJ: msu.nbOfTotalAbsences - msu.nbOfJustifiedTotalAbsences,
              nbOfTotalAndPartialAbsencesNJ: msu.nbOfTotalAbsences + msu.nbOfPartialAbsences - msu.nbOfJustifiedTotalAbsences - msu.nbOfJustifiedPartialAbsences,
              nbOfDelaysNJ: msu.nbOfDelays - msu.nbOfJustifiedDelays,
              nbOfJustifiedPartialAbsences: msu.nbOfJustifiedPartialAbsences,
              nbOfJustifiedTotalAbsences: msu.nbOfJustifiedTotalAbsences,
              nbOfJustifiedDelays: msu.nbOfJustifiedDelays,
              averageTimeSpent: msu.totalNbOfNeededDays ? Math.round(msu.nbOfTotalPresentMinutes / msu.totalNbOfNeededDays) : 0,
              nbOfHolidaysTaken: msu.nbOfHolidaysTaken,
              nbOfDayOffTaken: msu.nbOfDayOffTaken,
            }
          ));
          props.setRows(membersSumUp.sort(props.sortSettings.orderKey === 'name' ? compareString(props.sortSettings.orderKey) : compareNumber(props.sortSettings.orderKey)));
        });
      }
    },
    orderRows: props => (orderKey, direction) => {
      let newRows = props.rows.sort(orderKey === 'name' ? compareString(orderKey) : compareNumber(orderKey));
      props.setRows(direction === 'asc' ? newRows : newRows.reverse());
    },
  }),
  withHandlers({
    onColumnTitleClick: props => (columnId, orderKey) => {
      if (columnId === props.sortSettings.columnId && props.sortSettings.order === 'asc') {
        props.setSortSettings({
          columnId,
          order: 'desc',
          orderKey,
        });
        props.orderRows(orderKey, 'desc');
      } else if (columnId === props.sortSettings.columnId && props.sortSettings.order === 'desc') {
        props.setSortSettings({
          columnId: null,
          order: 'asc',
          orderKey: 'name',
        });
        props.orderRows('name', 'asc');
      } else {
        props.setSortSettings({
          columnId,
          order: 'asc',
          orderKey,
        });
        props.orderRows(orderKey, 'asc');
      }
    },
    onFromChange: props => newFrom => {
      if (newFrom === '') {
        props.setFrom('');
      } else if (moment(newFrom).isValid()) {
        props.setFrom(moment(newFrom).startOf('day'));
        props.getAllSumUpFor(false, moment(newFrom).startOf('day'), props.to);
      }
    },
    onToChange: props => newTo => {
      if (newTo === '') {
        props.setTo('');
      } else if (moment(newTo).isValid()) {
        props.setTo(moment(newTo).startOf('day'));
        props.getAllSumUpFor(false, props.from, moment(newTo).startOf('day'));
      }
    },
  }),
  lifecycle({
    componentDidMount() {
      this.props.getAllSumUpFor(true, this.props.from, this.props.to);
    },
  }),
)(DumbStatisticsPage);
