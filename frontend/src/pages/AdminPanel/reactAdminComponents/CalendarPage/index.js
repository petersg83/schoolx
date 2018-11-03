import DumbCalendarPage from './DumbCalendarPage';
import { compose,lifecycle, withHandlers, withState } from 'recompose';
import moment from 'moment';
import config from '../../../../config';
import { httpClient } from '../../index';

export default compose(
  withState('tabNumber', 'setTabNumber', 0),
  withState('events', 'setEvents', []),
  withState('modalIsOpen', 'setModalIsOpen', false),
  withState('selectedDate', 'setSelectedDate', null),
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
                    const openAt = uod.openAt;
                    const closeAt = uod.closeAt;
                    events.push({
                      title: 'Ouverte',
                      start: new Date(moment(dayIteration).add(+openAt.split(':')[0], 'h').add(+openAt.split(':')[1], 'm')),
                      end: new Date(moment(dayIteration).add(+closeAt.split(':')[0], 'h').add(+closeAt.split(':')[1], 'm')),
                    });
                  });
                }
              dayIteration.add(1, 'd');
            }
          }
        }
        for (let ssd of res.specialSchoolDays) {
          const openAt = ssd.openAt;
          const closeAt = ssd.closeAt;
          events.push({
            title: ssd.isClosed ? 'Fermée' : 'Ouverte',
            allDay: ssd.isClosed,
            specialDay: ssd.isClosed ? 'closed' : 'modified',
            start: ssd.isClosed ? moment(ssd.day) : new Date(moment(ssd.day).add(+openAt.split(':')[0], 'h').add(+openAt.split(':')[1], 'm')),
            end: ssd.isClosed ? moment(ssd.day) : new Date(moment(ssd.day).add(+closeAt.split(':')[0], 'h').add(+closeAt.split(':')[1], 'm')),
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
        backgroundColor: event.specialDay
        ? event.specialDay === 'closed'
          ? 'red'
          : 'orange'
        : 'green',
      }
    }),
    onNavigate: props => (date) => props.getSchoolEventFor(date),
    onSelectSlot: props => data => {
      props.setSelectedDate(moment(data.start));
      props.setModalIsOpen(true);
    },
    closeModal: props => () => props.setModalIsOpen(false),
  }),
  withHandlers({
    afterSubmitSomething: props => () => {
      props.closeModal();
      props.getSchoolEventFor(props.selectedDate);
    }
  }),
  lifecycle({
    componentDidMount() {
      this.props.getSchoolEventFor(moment().toISOString());
    },
  }),
)(DumbCalendarPage);
