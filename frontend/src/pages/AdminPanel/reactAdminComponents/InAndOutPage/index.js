import { compose, lifecycle, withHandlers, withState, withProps } from 'recompose';
import moment from 'moment';
import DumbInAndOutPage from './DumbInAndOutPage';
import config from '../../../../config';
import { httpClient } from '../../index';

export default compose(
  withState('members', 'setMembers', []),
  withState('membersMap', 'setMembersMap', {}),
  withState('memberShownInModalId', 'setMemberShownInModalId', null),
  withState('timer', 'setTimer', null),
  withState('time', 'setTime', moment()),
  withHandlers({
    getMembers: props => () => {
      httpClient(`${config.apiEndpoint}/inandout`, {
        method: 'GET',
      })
      .then((res) => {
        if (res.status === 200) {
          return res.json;
        } else {
          throw new Error('Une erreur inconnue s\'est produite. Si elle persiste, contactez le créateur à contact@pierre-noel.fr');
        }
      })
      .then((res) => {
        console.log('res', res);
        const members = res.sort((m1, m2) => `${m1.firstName} ${m1.lastName}` < `${m2.firstName} ${m2.lastName}`);
        const membersMap = {};
        members.forEach((m) => {
          membersMap[m.id] = m;
          m.specialMemberDay = m.specialMemberDays[0];
          m.specialMemberDay = { arrivedAt: moment().subtract('1', 'h'), leftAt: moment().subtract('17', 'm') };

          let memberState = 'toBeArrived';
          if (m.specialMemberDay && m.specialMemberDay.arrivedAt && !m.specialMemberDay.leftAt) {
            memberState = 'arrived';
          } else if (m.specialMemberDay && m.specialMemberDay.arrivedAt && m.specialMemberDay.leftAt) {
            memberState = 'left';
          }

          let memberTimeText = '';
          if (m.specialMemberDay && m.specialMemberDay.arrivedAt) {
            memberTimeText += moment(m.specialMemberDay.arrivedAt).format('HH:mm');
            memberTimeText += ' → ';
            if (m.specialMemberDay.leftAt) {
              memberTimeText += moment(m.specialMemberDay.leftAt).format('HH:mm');
            } else {
              memberTimeText += '...';
            }
          }

          m.memberState = memberState;
          m.memberTimeText = memberTimeText;
        });

        props.setMembers(members);
        props.setMembersMap(membersMap);
      });
    },
    onClickOnTile: props => (id = null) => {
      props.setMemberShownInModalId(id);
    },
    onExitTile: props => () => {
      props.setMemberShownInModalId(null);
    },
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
    const isModalOpen = !!(props.memberShownInModalId && props.membersMap[props.memberShownInModalId]);
    const memberInModal = props.membersMap[props.memberShownInModalId];

    return ({
      isModalOpen,
      memberInModal,
    });
  }),
)(DumbInAndOutPage);
