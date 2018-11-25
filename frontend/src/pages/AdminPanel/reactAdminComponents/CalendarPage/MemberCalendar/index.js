import DumbMemberCalendar from './DumbMemberCalendar';
import { compose, lifecycle, withHandlers, withState, withProps } from 'recompose';
import moment from 'moment';
import config from '../../../../../config';
import { httpClient } from '../../../index';
import { getReadableTimeBetween } from '../../../../../utils/dates';

moment.locale('fr');

export default compose(
  withState('memberEvents', 'setMemberEvents', []),
  withState('modalType', 'setModalType', ''),
  withState('selectedDate', 'setSelectedDate', null),
  withState('currentDate', 'setCurrentDate', moment().startOf('day')),
  withState('selectedMemberId', 'setSelectedMemberId', ''),
  withState('members', 'setMembers', []),
  withHandlers({
    getMemberDays: props => (memberId, currentDay) => {
      httpClient(`${config.apiEndpoint}/memberEvents?memberId=${memberId}&currentDay=${moment(currentDay).valueOf()}`)
      .then((res) => {
        if (res.status === 200) {
          return res.json;
        } else {
          throw new Error('Une erreur inconnue s\'est produite. Si elle persiste, contactez le créateur à contact@pierre-noel.fr');
        }
      })
      .then((res) => {
        const events = res.reduce((events, day) => {
          const event = Object.assign({}, day);
          const schoolOpenDate = new Date(moment(day.day).add(+day.schoolOpensAt.split(':')[0], 'h').add(+day.schoolOpensAt.split(':')[1], 'm'));
          const schoolCloseDate = new Date(moment(day.day).add(+day.schoolClosesAt.split(':')[0], 'h').add(+day.schoolClosesAt.split(':')[1], 'm'));
          const memberArrivedDate = day.arrivedAt && new Date(moment(day.day).add(+day.arrivedAt.split(':')[0], 'h').add(+day.arrivedAt.split(':')[1], 'm'));
          const memberLeftDate = day.leftAt && new Date(moment(day.day).add(+day.leftAt.split(':')[0], 'h').add(+day.leftAt.split(':')[1], 'm'));

          if (day.dayType === 'holiday') {
            event.title = 'Vacances';
            event.color = 'dimgray';
            event.start = schoolOpenDate;
            event.end = schoolCloseDate;
          } else if (day.dayType === 'dayOff') {
            event.title = 'Jour off';
            event.color = 'dimgray';
            event.start = schoolOpenDate;
            event.end = schoolCloseDate;
          } else if (day.absence === 'total' && !day.justifiedAbsence) {
            event.title = 'Absence totale';
            event.color = 'red';
            event.start = schoolOpenDate;
            event.end = schoolCloseDate;
          } else if (day.absence === 'total' && day.justifiedAbsence) {
            event.title = 'Absence totale justifiée';
            event.color = 'limegreen';
            event.start = schoolOpenDate;
            event.end = schoolCloseDate;
          } else if (day.absence === 'partial' && !day.justifiedDelay) {
            event.title = 'Absence partielle';
            event.color = 'orange';
            event.start = memberArrivedDate;
            event.end = memberLeftDate;
          } else if (day.absence === 'partial' && day.justifiedDelay) {
            event.title = 'Absence partielle justifiée';
            event.color = 'MediumSeaGreen';
            event.start = memberArrivedDate;
            event.end = memberLeftDate;
          } else if (day.absence === 'undefined') {
            event.title = 'Anomalie';
            event.color = 'hotpink';
            event.start = memberArrivedDate;
            event.end = schoolCloseDate;
          } else if (!day.absence) {
            event.title = 'Présent';
            event.color = 'green';
            event.start = memberArrivedDate;
            event.end = memberLeftDate;
          }

          if (day.arrivedAt && day.leftAt) {
            event.title += ` ${day.arrivedAt} → ${day.leftAt}`;
          } else if (day.arrivedAt && !day.leftAt) {
            event.title += ` ${day.arrivedAt} → ???`;
          }

          let delayEvent = null;
          if (day.delay && !day.justifiedDelay) {
            delayEvent = {
              title: `Retard de ${getReadableTimeBetween(memberArrivedDate, moment(day.day).startOf('day').add(+day.maxArrivalTime.split(':')[0], 'h').add(+day.maxArrivalTime.split(':')[1], 'm'))}`,
              color: 'DarkGray',
              start: memberArrivedDate,
              end: new Date(moment(memberArrivedDate).add(30, 'm')),
            };
          } else if (day.delay && day.justifiedDelay) {
            delayEvent = {
              title: `Retard justifié de ${getReadableTimeBetween(memberArrivedDate, moment(day.day).startOf('day').add(+day.maxArrivalTime.split(':')[0], 'h').add(+day.maxArrivalTime.split(':')[1], 'm'))}`,
              color: 'MediumSeaGreen',
              start: memberArrivedDate,
              end: new Date(moment(memberArrivedDate).add(30, 'm')),
            };
          }

          return delayEvent ? [...events, event, delayEvent] : [...events, event];
        }, []);

        props.setMemberEvents(events);
        // props.setMembers(res.map(m => ({ id: m.id, firstName: m.firstName, lastName: m.lastName })));
        // props.setSelectedMemberId(res[0] ? res[0].id : '');
      });
    },
  }),
  withHandlers({
    getMembers: props => () => {
      httpClient(`${config.apiEndpoint}/members?_end=1000&_order=ASC&_sort=firstName&_start=0`)
      .then((res) => {
        if (res.status === 200) {
          return res.json;
        } else {
          throw new Error('Une erreur inconnue s\'est produite. Si elle persiste, contactez le créateur à contact@pierre-noel.fr');
        }
      })
      .then((res) => {
        props.setMembers(res.map(m => ({ id: m.id, firstName: m.firstName, lastName: m.lastName })));
        props.setSelectedMemberId(res[0] ? res[0].id : '');
        if (res[0]) {
          props.setCurrentDate(moment());
          props.getMemberDays(res[0].id, moment());
        }
      });
    },
  }),
  withHandlers({
    eventPropGetter: props => (event, start, end, isSelected) => ({ style: { backgroundColor: event.color } }),
    onNavigate: props => (date) => {
      props.setCurrentDate(moment(date));
      props.getMemberDays(props.selectedMemberId, moment(date));
    },
    // onSelectSlot: props => data => {
    //   props.setSelectedDate(moment(data.start));
    //   if (props.schoolEvents.find(e => e.specialDay && moment(e.ssd.day).isSame(moment(data.start), 'day'))) {
    //     props.setModalType('modifySSD');
    //   } else {
    //     props.setModalType('createSSD');
    //   }
    // },
    onSelectMember: props => e => {
      props.setSelectedMemberId(e.target.value);
      props.getMemberDays(e.target.value, props.currentDate);
    },
    // closeModal: props => () => props.setModalType(''),
  }),
  // withHandlers({
  //   afterSubmitSomething: props => () => {
  //     props.closeModal();
  //     props.getSchoolEventsFor(props.selectedDate);
  //   }
  // }),
  lifecycle({
    componentDidMount() {
      // this.props.getSchoolEventsFor(moment().toISOString());
      this.props.getMembers();
    },
  }),
  // withProps(props => {
  //   const currentDayEvent = props.schoolEvents.find(e => moment(e.start).isSame(moment(props.selectedDate), 'day'));
  //   let ssdPrefilledForCreation = {};
  //
  //   if (currentDayEvent) {
  //     ssdPrefilledForCreation = {
  //       openAt: currentDayEvent.openAt,
  //       closeAt: currentDayEvent.closeAt,
  //       isClosed: currentDayEvent.isClosed,
  //       maxArrivalTime: currentDayEvent.maxArrivalTime,
  //       minTimeBefPartialAbsence: currentDayEvent.minTimeBefPartialAbsence,
  //       minTimeBefTotalAbsence: currentDayEvent.minTimeBefTotalAbsence,
  //     };
  //   }
  //
  //   return {
  //     events: props.schoolEvents,
  //     isModalOpen: !!props.modalType,
  //     currentSSD: props.modalType === 'modifySSD' ? props.schoolEvents.find(e => e.specialDay && moment(e.ssd.day).isSame(moment(props.selectedDate), 'day')).ssd : null,
  //     ssdPrefilledForCreation,
  //   };
  // }
  // ),
  withProps(props => ({
    events: props.memberEvents,
    isModalOpen: false,
  })),
)(DumbMemberCalendar);
