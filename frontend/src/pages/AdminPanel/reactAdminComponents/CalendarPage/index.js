import DumbCalendarPage from './DumbCalendarPage';
import { compose,lifecycle, withHandlers, withState, withProps } from 'recompose';
import moment from 'moment';
import config from '../../../../config';
import { httpClient } from '../../index';

export default compose(
  withState('tabNumber', 'setTabNumber', 0),
  withHandlers({
    onClickOnTab: props => (e, tabNumber) => props.setTabNumber(tabNumber),
  }),
)(DumbCalendarPage);
