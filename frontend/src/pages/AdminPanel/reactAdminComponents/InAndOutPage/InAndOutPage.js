import { compose, lifecycle, withHandlers, withState, withProps } from 'recompose';
import moment from 'moment';
import DumbInAndOutPage from './DumbInAndOutPage';
import config from '../../../../config';

export default compose(
  withState('members', 'setMembers', []),
  withState('membersMap', 'setMembersMap', {}),
  withState('memberShownInModalId', 'setMemberShownInModalId', null),
  withState('timer', 'setTimer', null),
  withState('time', 'setTime', moment()),
  withState('firstLoadDone', 'setFirstLoadDone', false),
  withState('todaySettings', 'setTodaySetting', {}),
  withHandlers({
    getMembers: props => () => {
      fetch(`${config.apiEndpoint}/todaySettings`, {
        method: 'GET',
        headers: new Headers({
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('inandoutjwt')}`,
        }),
      })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        } else if (res.status === 403) {
          props.removeInandoutjwt()
        } else {
          throw new Error('Une erreur inconnue s\'est produite. Si elle persiste, contactez le créateur à contact@pierre-noel.fr');
        }
      })
      .then(res => {
        props.setTodaySetting(res);
        if (res.isClosed) {
          props.setFirstLoadDone(true);
        } else {
          fetch(`${config.apiEndpoint}/inandout`, {
            method: 'GET',
            headers: new Headers({
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('inandoutjwt')}`,
            }),
          })
          .then((res) => {
            if (res.status === 200) {
              return res.json();
            } else if (res.status === 403) {
              props.removeInandoutjwt()
            } else {
              throw new Error('Une erreur inconnue s\'est produite. Si elle persiste, contactez le créateur à contact@pierre-noel.fr');
            }
          })
          .then((res) => {
            const today = moment();
            const members = res.sort((m1, m2) => `${m1.firstName} ${m1.lastName}` < `${m2.firstName} ${m2.lastName}` ? -1 : 1);
            const membersMap = {};
            members.forEach((m) => {
              membersMap[m.id] = m;
              const isOff = !m.memberSettings.every(ms => !ms.daysOff.includes(today.locale('en').format('dddd').toLowerCase()));
              m.specialMemberDay = m.specialMemberDays[0];

              if (isOff) {
                m.memberState = 'isOff';
                m.memberTimeText = 'jour off';
              } else if (m.specialMemberDay && m.specialMemberDay.holiday) {
                m.memberState = 'inHoliday';
                m.memberTimeText = 'congé';
              } else {
                let memberState = 'toBeArrived';
                if (m.specialMemberDay && m.specialMemberDay.arrivedAt && !m.specialMemberDay.leftAt) {
                  memberState = 'arrived';
                } else if (m.specialMemberDay && m.specialMemberDay.arrivedAt && m.specialMemberDay.leftAt) {
                  memberState = 'left';
                }

                let memberTimeText = '';
                if (m.specialMemberDay && m.specialMemberDay.arrivedAt) {
                  memberTimeText += m.specialMemberDay.arrivedAt;
                  memberTimeText += ' → ';
                  if (m.specialMemberDay.leftAt) {
                    memberTimeText += m.specialMemberDay.leftAt;
                  } else {
                    memberTimeText += '...';
                  }
                }

                m.memberState = memberState;
                m.memberTimeText = memberTimeText;
              }
            });

            props.setMembers(members);
            props.setMembersMap(membersMap);
            props.setFirstLoadDone(true);
          });
        }
      });
    },
    onClickOnTile: props => (id = null) => {
      props.setMemberShownInModalId(id);
    },
    onExitTile: props => () => {
      props.setMemberShownInModalId(null);
    },
  }),
  withHandlers({
    memberInModalEnters: props => () => {
      fetch(`${config.apiEndpoint}/inandout/${props.memberShownInModalId}`, {
        method: 'POST',
        headers: new Headers({
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('inandoutjwt')}`,
        }),
        Accept: 'application/json',
        Authorization: `Bearer ${localStorage.getItem('inandoutjwt')}`,
        body: JSON.stringify({ action: 'arrived' }),
      }).then((res) => {
        if (res.status === 200) {
          props.getMembers();
          props.setMemberShownInModalId(null);
        } else if (res.status === 403) {
          props.removeInandoutjwt()
        } else {
          throw new Error('Une erreur inconnue s\'est produite. Si elle persiste, contactez le créateur à contact@pierre-noel.fr');
        }
      });
    },
    memberInModalLeaves: props => () => {
      fetch(`${config.apiEndpoint}/inandout/${props.memberShownInModalId}`, {
        method: 'POST',
        headers: new Headers({
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('inandoutjwt')}`,
        }),
        body: JSON.stringify({ action: 'left' }),
      }).then((res) => {
        if (res.status === 200) {
          props.getMembers();
          props.setMemberShownInModalId(null);
        } else if (res.status === 403) {
          props.removeInandoutjwt()
        } else {
          throw new Error('Une erreur inconnue s\'est produite. Si elle persiste, contactez le créateur à contact@pierre-noel.fr');
        }
      });
    }
  }),
  lifecycle({
    componentDidMount() {
      const timer = setInterval(() => {
        this.props.setTime(moment())
      }, 200);
      this.props.setTimer(timer);
      this.props.getMembers();
    },
    componentWillUnmout() {
      clearInterval(this.props.timer);
    }
  }),
  withProps(props => {
    const memberInModal = props.membersMap[props.memberShownInModalId];

    return ({
      isModalOpen: !!memberInModal,
      isSchoolOpenToday: !props.todaySettings.isClosed,
      memberInModal: memberInModal,
    });
  }),
)(DumbInAndOutPage);
