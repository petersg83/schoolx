import DumbCreateSSDForm from './DumbCreateSSDForm';
import { compose, withHandlers, withState, lifecycle } from 'recompose';
import config from '../../../../../config';
import { httpClient } from '../../../index';

export default compose(
  withState('isClosed', 'setIsClosed', false),
  withState('openAt', 'setOpenAt', ''),
  withState('closeAt', 'setCloseAt', ''),
  withState('maxArrivalTime', 'setMaxArrivalTime', ''),
  withState('minTimeBefPartialAbsence', 'setMinTimeBefPartialAbsence', ''),
  withState('minTimeBefTotalAbsence', 'setMinTimeBefTotalAbsence', ''),
  withState('note', 'setNote', ''),
  lifecycle({
    componentDidMount() {
      if (this.props.ssd) {
        this.props.setIsClosed(this.props.ssd.isClosed);
        this.props.setOpenAt(this.props.ssd.openAt || '');
        this.props.setCloseAt(this.props.ssd.closeAt || '');
        this.props.setMaxArrivalTime(this.props.ssd.maxArrivalTime || '');
        this.props.setMinTimeBefPartialAbsence(this.props.ssd.minTimeBefPartialAbsence || '');
        this.props.setMinTimeBefTotalAbsence(this.props.ssd.minTimeBefTotalAbsence || '');
        this.props.setNote(this.props.ssd.note || '');
      }
    },
  }),
  withHandlers({
    onIsClosedChange: props => e => props.setIsClosed(!e.target.checked),
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
    onDelete: props => () => {
      httpClient(`${config.apiEndpoint}/specialSchoolDay`, {
        method: 'DELETE',
        headers: new Headers({
          Accept: 'application/json',
          ContentType: 'application/json',
        }),
        body: JSON.stringify({
          day: props.date.toISOString(),
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
    onSubmit: props => () => {
      httpClient(`${config.apiEndpoint}/specialSchoolDay`, {
        method: 'PUT',
        headers: new Headers({
          Accept: 'application/json',
          ContentType: 'application/json',
        }),
        body: JSON.stringify({
          isClosed: props.isClosed,
          day: props.date.toISOString(),
          openAt: props.isClosed ? null : props.openAt,
          closeAt: props.isClosed ? null : props.closeAt,
          maxArrivalTime: props.isClosed ? null : props.maxArrivalTime,
          minTimeBefPartialAbsence: props.isClosed ? null : props.minTimeBefPartialAbsence,
          minTimeBefTotalAbsence: props.isClosed ? null : props.minTimeBefTotalAbsence,
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
      });
    },
  }),
)(DumbCreateSSDForm);
