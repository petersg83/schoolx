import DumbCreateSSDForm from './DumbCreateSSDForm';
import { compose, withHandlers, withState } from 'recompose';
import config from '../../../../../config';
import { httpClient } from '../../../index';

export default compose(
  withState('schoolIsOpen', 'setSchoolIsOpen', true),
  withState('openAt', 'setOpenAt', ''),
  withState('closeAt', 'setCloseAt', ''),
  withState('maxArrivalTime', 'setMaxArrivalTime', ''),
  withState('minTimeBefPartialAbsence', 'setMinTimeBefPartialAbsence', ''),
  withState('minTimeBefTotalAbsence', 'setMinTimeBefTotalAbsence', ''),
  withState('note', 'setNote', ''),
  withHandlers({
    onSchoolIsOpenChange: props => e => props.setSchoolIsOpen(e.target.checked),
    onOpenAtChange: props => e => {
      props.setOpenAt(e.target.value);
    },
    onCloseAtChange: props => e => {
      props.setCloseAt(e.target.value);
    },
    onMaxArrivalTimeChange: props => e => {
      props.setMaxArrivalTime(e.target.value);
    },
    onMinTimeBefPartialAbsenceChange: props => e => {
      props.setMinTimeBefPartialAbsence(e.target.value);
    },
    onMinTimeBefTotalAbsenceChange: props => e => {
      props.setMinTimeBefTotalAbsence(e.target.value);
    },
    onNoteChange: props => e => props.setNote(e.target.value),
    onSubmit: props => () => {
      httpClient(`${config.apiEndpoint}/specialSchoolDay`, {
        method: 'POST',
        headers: new Headers({
          Accept: 'application/json',
          ContentType: 'application/json',
        }),
        body: JSON.stringify({
          isClosed: !props.schoolIsOpen,
          day: props.date.toISOString(),
          openAt: props.schoolIsOpen ? props.openAt : null,
          closeAt: props.schoolIsOpen ? props.closeAt : null,
          maxArrivalTime: props.schoolIsOpen ? props.maxArrivalTime : null,
          minTimeBefPartialAbsence: props.schoolIsOpen ? props.minTimeBefPartialAbsence : null,
          minTimeBefTotalAbsence: props.schoolIsOpen ? props.minTimeBefTotalAbsence : null,
          note: props.note,
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
      })
    },
  }),
)(DumbCreateSSDForm);
