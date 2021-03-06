import { branch, compose, lifecycle, renderComponent, withHandlers, withProps, withState } from 'recompose';
import moment from 'moment';
import { DumbEditableMemberDayRow, DumbShowMemberDayRow } from './DumbMemberDayRow';
import config from '../../../../../../config';
import { httpClient } from '../../../../index';

export default compose(
  withState('selected', 'setSelected', false),
  withHandlers({
    onSelectedChange: props => e => {
      props.setSelected(e.target.checked);
      props.selectMember(props.memberDay, e.target.checked);
    },
  }),
  branch(
    props => props.editMode,
    baseComponent => baseComponent,
    renderComponent(DumbShowMemberDayRow),
  ),
  withState('arrivedAt', 'setArrivedAtChange', props => props.memberDay.arrivedAt || ''),
  withState('leftAt', 'setLeftAtChange', props => props.memberDay.leftAt || ''),
  withState('isJustifiedDelay', 'setIsJustifiedDelayChange', props => !!props.memberDay.justifiedDelay),
  withState('isJustifiedAbsence', 'setIsJustifiedAbsenceChange', props => !!props.memberDay.justifiedAbsence),
  withState('isInHoliday', 'setIsInHoliday', props => props.memberDay.dayType === 'holiday'),
  withState('note', 'setNote', props => props.memberDay.note || ''),
  withHandlers({
    onArrivedAtChange: props => e => props.setArrivedAtChange(e.target.value),
    onLeftAtChange: props => e => props.setLeftAtChange(e.target.value),
    onIsJustifiedDelayChange: props => e => props.setIsJustifiedDelayChange(e.target.checked),
    onIsJustifiedAbsenceChange: props => e => props.setIsJustifiedAbsenceChange(e.target.checked),
    onNoteChange: props => e => props.setNote(e.target.value),
    onIsInHolidayChange: props => e => props.setIsInHoliday(e.target.checked),
    onSubmit: props => (e) => {
      e.preventDefault();
      httpClient(`${config.apiEndpoint}/modifyMemberDay/${props.memberDay.memberId}`, {
        method: 'PUT',
        headers: new Headers({
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({
          memberDay: {
            isInHoliday: props.isInHoliday,
            arrivedAt: props.arrivedAt,
            leftAt: props.leftAt,
            isJustifiedDelay: props.isJustifiedDelay,
            isJustifiedAbsence: props.isJustifiedAbsence,
            note: props.note,
          },
          date: moment(props.date).startOf('day'),
        }),
      })
      .then((res) => {
        if (res.status === 200) {
          return res.json;
        } else {
          throw new Error('Une erreur inconnue s\'est produite. Si elle persiste, contactez le créateur à contact@pierre-noel.fr');
        }
      })
      .then((res) => {
        props.afterSubmit();
      });
    },
  }),
  lifecycle({
    componentWillReceiveProps(nextProps) {
      if (
        (this.props.memberDay.justifiedDelay !== nextProps.memberDay.justifiedDelay) ||
        (this.props.memberDay.justifiedAbsence !== nextProps.memberDay.justifiedAbsence) ||
        (this.props.memberDay.dayType !== nextProps.memberDay.dayType) ||
        (this.props.memberDay.note !== nextProps.memberDay.note) ||
        (this.props.memberDay.arrivedAt !== nextProps.memberDay.arrivedAt) ||
        (this.props.memberDay.leftAt !== nextProps.memberDay.leftAt)
      ) {
        this.props.setIsJustifiedDelayChange(!!nextProps.memberDay.justifiedDelay);
        this.props.setIsJustifiedAbsenceChange(!!nextProps.memberDay.justifiedAbsence);
        this.props.setIsInHoliday(nextProps.memberDay.dayType === 'holiday');
        this.props.setNote(nextProps.memberDay.note || '');
        this.props.setArrivedAtChange(nextProps.memberDay.arrivedAt || '');
        this.props.setLeftAtChange(nextProps.memberDay.leftAt || '');
      }
    }
  }),
  withProps(props => ({
    rowChanged: (props.memberDay.arrivedAt || '') !== props.arrivedAt ||
      (props.memberDay.leftAt || '') !== props.leftAt ||
      !!props.memberDay.justifiedDelay !== props.isJustifiedDelay ||
      !!props.memberDay.justifiedAbsence !== props.isJustifiedAbsence ||
      (props.memberDay.dayType === 'holiday') !== props.isInHoliday ||
      (props.memberDay.note || '') !== props.note,
  })),
)(DumbEditableMemberDayRow);
