import DumbCalendarPage from './DumbCalendarPage';
import { compose, withHandlers, withState } from 'recompose';

export default compose(
  withState('tabNumber', 'setTabNumber', 0),
  withHandlers({
    onClickOnTab: props => (e, tabNumber) => props.setTabNumber(tabNumber),
  }),
)(DumbCalendarPage);
