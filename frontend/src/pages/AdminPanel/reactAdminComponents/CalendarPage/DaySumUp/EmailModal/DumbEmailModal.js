import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import moment from 'moment';
import 'moment/locale/fr';

moment.locale('fr');

const DumbEmailModal = (props) => {

  const emailsMetadata = props.emailsMetadata.map(m => <span key={`email-${m.memberId}`}>{JSON.stringify(m)}</span>);


  return <Dialog
    open={props.isOpen}
    onClose={props.closeModal}
  >
    <DialogContent>
      <div>
        <p>{emailsMetadata}</p>
        <p>{props.emailSubject}</p>
        <p>{props.emailContent}</p>
      </div>
    </DialogContent>
  </Dialog>
}

  export default DumbEmailModal;
