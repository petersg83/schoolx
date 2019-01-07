import { compose, withHandlers } from 'recompose';
import DumbExportPage from './DumbExportPage';
import config from '../../../../../config';
import { httpClient } from '../../../index';

export default compose(
  withHandlers({
    onClickOnExportButton: props => () => {
      httpClient(`${config.apiEndpoint}/export`)
      .then((res) => {
        if (res.status === 200) {
          return res.json;
        } else {
          throw new Error('Une erreur inconnue s\'est produite. Si elle persiste, contactez le créateur à contact@pierre-noel.fr');
        }
      })
      .then((res) => {
        console.log('terminé');
      });
    },
  }),
)(DumbExportPage);
