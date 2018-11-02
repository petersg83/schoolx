import DumbCalendarPage from './DumbCalendarPage';
import { compose,lifecycle, withHandlers, withState } from 'recompose';
import moment from 'moment';
import config from '../../../../config';
import { httpClient } from '../../index';

export default compose(
  withState('tabNumber', 'setTabNumber', 0),
  withState('events', 'setEvents', []),
  withHandlers({
    getSchoolEventFor: props => (currentDay) => {
      httpClient(`${config.apiEndpoint}/schoolEvents?currentDay=${moment(currentDay).valueOf()}`)
      .then((res) => {
        if (res.status === 200) {
          return res.json;
        } else {
          throw new Error('Une erreur inconnue s\'est produite. Si elle persiste, contactez le créateur à contact@pierre-noel.fr');
        }
      })
      .then((res) => {
        const events = [];
        let dayIteration;
        const lastDayOfCalendar = moment(currentDay).endOf('month').add(2, 'months');
        for (let sy of res.schoolYears) {
          for (let sys of sy.schoolYearSettings) {
            dayIteration = moment(sys.startAt).startOf('day');
            const endDay = sys.endAt ? moment(sys.endAt).startOf('day') : lastDayOfCalendar;
            while (dayIteration.isSameOrBefore(endDay)) {
              if (!res.specialSchoolDays.find(ssd => moment(ssd.day).isSame(dayIteration, 'day'))) {
                sys.usualOpenedDays
                  .filter(uod => uod.days.includes(dayIteration.locale('en').format('dddd').toLowerCase()))
                  .forEach((uod) => {
                    const openAt = moment(uod.openAt);
                    const closeAt = moment(uod.closeAt);
                    events.push({
                      title: 'Ouverte',
                      start: new Date(moment(dayIteration).add(openAt.get('hour'), 'h').add(openAt.get('minutes'), 'm')),
                      end: new Date(moment(dayIteration).add(closeAt.get('hour'), 'h').add(closeAt.get('minutes'), 'm')),
                    });
                  });
                }
              dayIteration.add(1, 'd');
            }
          }
        }
        for (let ssd of res.specialSchoolDays) {
          const openAt = moment(ssd.openAt);
          const closeAt = moment(ssd.closeAt);
          events.push({
            title: 'Ouverte',
            start: new Date(moment(ssd.day).add(openAt.get('hour'), 'h').add(openAt.get('minutes'), 'm')),
            end: new Date(moment(ssd.day).add(closeAt.get('hour'), 'h').add(closeAt.get('minutes'), 'm')),
          });
        }
        props.setEvents(events);
      });
    },
  }),
  withHandlers({
    onClickOnTab: props => (e, tabNumber) => props.setTabNumber(tabNumber),
    eventPropGetter: props => (event, start, end, isSelected) => ({
      style: {
        backgroundColor: 'green',
        // borderRadius: '0px',
        // opacity: 0.8,
        // color: 'black',
        // border: '0px',
        // display: 'block'
      }
    }),
    onNavigate: props => (date) => props.getSchoolEventFor(date),
  }),
  lifecycle({
    componentDidMount() {
      this.props.getSchoolEventFor(moment().toISOString());
    },
  }),
)(DumbCalendarPage);
