import React from 'react';
import { branch, compose, lifecycle, renderComponent, withHandlers, withState } from 'recompose';
import InAndOutPage from './InAndOutPage';
import DumbInAndOutAccessPage from './DumbInAndOutAccessPage';
import config from '../../../../config';

export default compose(
  withState('code', 'setCode', ''),
  withState('showLoading', 'setShowLoading', false),
  withState('schoolName', 'setSchoolName', ''),
  withState('errors', 'setErrors', {}),
  withState('inandoutjwt', 'setInandoutjwt', localStorage.getItem('inandoutjwt')),
  withHandlers({
    onCodeChange: props => code => {
      props.setErrors({ ...props.errors, code: '' });
      props.setCode(code);
    },
    onSubmit: props => (e) => {
      e.preventDefault();
      props.setShowLoading(true);
      fetch(`${config.apiEndpoint}/inandoutlogin`, {
        method: 'POST',
        headers: new Headers({
          Accept: 'application/json',
          "Access-Control-Allow-Origin": config.domainName ? `*.${config.domainName}` : '*',
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({ accessCode: props.code }),
      })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        } else {
          throw new Error('Wrong access code');
        }
      })
      .then((res) => {
        localStorage.setItem('inandoutjwt', res.inandoutjwt);
        props.setInandoutjwt(res.inandoutjwt);
        props.setShowLoading(true);
      })
      .catch((e) => {
        props.setShowLoading(false);
        props.setErrors({ ...props.errors, code: 'Code incorrect' });
      });
    },
    removeInandoutjwt: props => () => props.setInandoutjwt(''),
  }),
  lifecycle({
    componentDidMount() {
      fetch(`${config.apiEndpoint}/getSchoolName`, {
        headers: new Headers({
          "Access-Control-Allow-Origin": config.domainName ? `*.${config.domainName}` : '*',
        }),
      })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        } else {
          throw new Error('Aucune école trouvée pour cette url');
        }
      })
      .then((res) => {
        this.props.setSchoolName(res.schoolName);
      });
    },
  }),
  branch(
    props => props.inandoutjwt,
    renderComponent(props => <InAndOutPage removeInandoutjwt={props.removeInandoutjwt} />),
  ),
)(DumbInAndOutAccessPage);
