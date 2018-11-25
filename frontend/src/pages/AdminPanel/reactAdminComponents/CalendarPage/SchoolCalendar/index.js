import DumbSchoolCalendar from './DumbSchoolCalendar';
import { compose, lifecycle, withHandlers, withState, withProps } from 'recompose';
import moment from 'moment';
import config from '../../../../../config';
import { httpClient } from '../../../index';

export default compose(
  withState('schoolEvents', 'setSchoolEvents', []),
  withState('modalType', 'setModalType', ''),
  withState('selectedDate', 'setSelectedDate', null),
  withState('members', 'setMembers', []),
  withHandlers({
    getSchoolEventsFor: props => (currentDay) => {
      httpClient(`${config.apiEndpoint}/schoolEvents?currentDay=${moment(currentDay).valueOf()}`)
      .then((res) => {
        if (res.status === 200) {
          return res.json;
        } else {
          throw new Error('Une erreur inconnue s\'est produite. Si elle persiste, contactez le créateur à contact@pierre-noel.fr');
        }
      })
      .then((res) => {
        const schoolEvents = [];
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
                    schoolEvents.push({
                      title: 'Ouverte',
                      start: new Date(moment(dayIteration).add(+openAt.split(':')[0], 'h').add(+openAt.split(':')[1], 'm')),
                      end: new Date(moment(dayIteration).add(+closeAt.split(':')[0], 'h').add(+closeAt.split(':')[1], 'm')),
                      isClosed: false,
                      openAt: uod.openAt,
                      closeAt: uod.closeAt,
                      maxArrivalTime: uod.maxArrivalTime,
                      minTimeBefPartialAbsence: uod.minTimeBefPartialAbsence,
                      minTimeBefTotalAbsence: uod.minTimeBefTotalAbsence,
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
          schoolEvents.push({
            title: ssd.isClosed ? 'Fermée' : `Ouverte ${openAt} → ${closeAt}`,
            allDay: ssd.isClosed,
            ssd,
            specialDay: ssd.isClosed ? 'closed' : 'modified',
            start: ssd.isClosed ? new Date(moment(ssd.day)) : new Date(moment(ssd.day).add(+openAt.split(':')[0], 'h').add(+openAt.split(':')[1], 'm')),
            end: ssd.isClosed ? new Date(moment(ssd.day)) : new Date(moment(ssd.day).add(+closeAt.split(':')[0], 'h').add(+closeAt.split(':')[1], 'm')),
          });
        }

        props.setSchoolEvents(schoolEvents);
      });
    },
  }),
  withHandlers({
    eventPropGetter: props => (event, start, end, isSelected) => ({
      style: {
        backgroundColor: event.specialDay
        ? event.specialDay === 'closed' ? 'red' : 'orange'
        : 'green',
      }
    }),
    onNavigate: props => (date) => props.getSchoolEventsFor(date),
    onSelectSlot: props => data => {
      props.setSelectedDate(moment(data.start));
      if (props.schoolEvents.find(e => e.specialDay && moment(e.ssd.day).isSame(moment(data.start), 'day'))) {
        props.setModalType('modifySSD');
      } else {
        props.setModalType('createSSD');
      }
    },
    onSelectMember: props => e => {
      props.setSelectedMemberDays(null);
      props.setSelectedMemberId(e.target.value);
    },
    closeModal: props => () => props.setModalType(''),
  }),
  withHandlers({
    afterSubmitSomething: props => () => {
      props.closeModal();
      props.getSchoolEventsFor(props.selectedDate);
    }
  }),
  lifecycle({
    componentDidMount() {
      this.props.getSchoolEventsFor(moment().toISOString());
    },
  }),
  withProps(props => {
    const currentDayEvent = props.schoolEvents.find(e => moment(e.start).isSame(moment(props.selectedDate), 'day'));
    let ssdPrefilledForCreation = {};

    if (currentDayEvent) {
      ssdPrefilledForCreation = {
        openAt: currentDayEvent.openAt,
        closeAt: currentDayEvent.closeAt,
        isClosed: currentDayEvent.isClosed,
        maxArrivalTime: currentDayEvent.maxArrivalTime,
        minTimeBefPartialAbsence: currentDayEvent.minTimeBefPartialAbsence,
        minTimeBefTotalAbsence: currentDayEvent.minTimeBefTotalAbsence,
      };
    }

    return {
      events: props.schoolEvents,
      isModalOpen: !!props.modalType,
      currentSSD: props.modalType === 'modifySSD' ? props.schoolEvents.find(e => e.specialDay && moment(e.ssd.day).isSame(moment(props.selectedDate), 'day')).ssd : null,
      ssdPrefilledForCreation,
    };
  }
),
)(DumbSchoolCalendar);
