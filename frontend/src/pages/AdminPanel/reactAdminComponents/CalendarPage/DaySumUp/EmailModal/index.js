import DumbEmailModal from './DumbEmailModal';
import { compose, lifecycle, withHandlers, withState } from 'recompose';
import _ from 'lodash';
import config from '../../../../../../config';
import { httpClient } from '../../../../index';

export default compose(
  withState('emailContent', 'setEmailContent', ''),
  withState('emailSubject', 'setEmailSubject', ''),
  withState('emailsMetadata', 'setEmailsMetadata', []),
  withHandlers({
    removeMetada: (props) => (index) => {
      const newEmailsMetaData = [...props.emailsMetadata];
      newEmailsMetaData.splice(index, 1);
      props.setEmailsMetadata(newEmailsMetaData);
    },
  }),
  lifecycle({
    componentDidUpdate(prevProps) {
      if (!_.isEqual(this.props.selectedMembers, prevProps.selectedMembers)) {
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
            m => ({
              memberId: m.memberId,
              emailAddress: m.emailAddress,
              phoneNumber: m.phoneNumber,
              name: m.name,
            })
          );

          this.props.setEmailsMetadata(emailsMetadata);
          this.props.setEmailContent(res.school.emailContent);
          this.props.setEmailSubject(res.school.emailSubject);
        })
        .catch(console.log);
      }
    }
  }),
)(DumbEmailModal);
