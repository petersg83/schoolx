import { compose, lifecycle, withHandlers, withState } from 'recompose';
import DumbInAndOutPage from './DumbInAndOutPage';
import config from '../../../../config';
import { httpClient } from '../../index';

export default compose(
  withState('members', 'setMembers', []),
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
        props.setMembers(members);
      });
    },
  }),
  lifecycle({
    componentDidMount() {
      this.props.getMembers();
    },
  }),
)(DumbInAndOutPage);
