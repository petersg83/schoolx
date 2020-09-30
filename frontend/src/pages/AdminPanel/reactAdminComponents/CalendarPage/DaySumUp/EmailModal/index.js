import DumbEmailModal from './DumbEmailModal';
import { compose, lifecycle, withHandlers, withState } from 'recompose';
import _ from 'lodash';
import config from '../../../../../../config';
import { httpClient } from '../../../../index';

export default compose(
  withState('smsContent', 'setSmsContent', ''),
  withState('emailContent', 'setEmailContent', ''),
  withState('emailSubject', 'setEmailSubject', ''),
  withState('emailsMetadata', 'setEmailsMetadata', []),
  withState('shouldReset', 'setShouldReset', false),
  withState('loading', 'setLoading', false),
  withState('error', 'setError', ''),
  withHandlers({
    removeMetada: (props) => (index) => {
      const newEmailsMetaData = [...props.emailsMetadata];
      newEmailsMetaData.splice(index, 1);
      props.setEmailsMetadata(newEmailsMetaData);
    },
    onEmailSubjectChange: (props) => (value) => props.setEmailSubject(value),
    onEmailContentChange: (props) => (value) => props.setEmailContent(value),
    onSmsContentChange: (props) => (value) => props.setSmsContent(value),
    onCancel: (props) => () => {
      props.closeModal();
      props.setShouldReset(true);
    },
    onSendingTypeChange: (props) => (index, value) => {
      const newEmailsMetaData = [...props.emailsMetadata];
      newEmailsMetaData[index] = {
        ...newEmailsMetaData[index],
        sendingType: value,
      };
      props.setEmailsMetadata(newEmailsMetaData);
    },
  }),
  withHandlers({
    sendEmailsAndSms: (props) => () => {
      props.setLoading(true);
      props.setError('');
      httpClient(`${config.apiEndpoint}/sendEmailsAndSms`, {
        method: 'POST',
        headers: new Headers({
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({
          metadata: props.emailsMetadata,
          emailSubject: props.emailSubject,
          emailContent: props.emailContent,
          smsContent: props.smsContent,
        }),
      })
      .then((res) => {
        props.setLoading(false);
        if (res.status === 200 && !res.json.error) {
          props.onCancel();
        } else if (res.json.error) {
          props.setError(res.json.error);
        } else {
          props.setError("Une erreur s'est produite");
        }
      })
      .catch((e, truc) => {
        props.setLoading(false);
        props.setError(e.message);
      })
    },
  }),
  lifecycle({
    componentDidUpdate(prevProps) {
      if (this.props.shouldReset || !_.isEqual(this.props.selectedMembers, prevProps.selectedMembers)) {
        this.props.setShouldReset(false);
        const memberIds = this.props.selectedMembers.map(m => m.memberId).join(',');
        httpClient(`${config.apiEndpoint}/emailsMetadata?membersIds=${memberIds}`, {
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
          const emailsMetadata = res.emailsMetadata.map(
            (m, i) => ({
              memberName: m.memberName,
              memberId: m.memberId,
              emailAddress: m.emailAddress,
              phoneNumber: m.phoneNumber,
              name: m.name,
              sendingType: m.emailAddress
                ? 'email'
                : m.phoneNumber
                  ? 'sms'
                  : '',
            })
          );

          this.props.setEmailsMetadata(emailsMetadata);
          this.props.setEmailContent(res.school.emailContent);
          this.props.setEmailSubject(res.school.emailSubject);
          this.props.setSmsContent(res.school.smsContent);
        })
        .catch(console.log);
      }
    }
  }),
)(DumbEmailModal);
