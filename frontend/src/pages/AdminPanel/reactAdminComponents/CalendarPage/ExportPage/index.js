import { compose, withHandlers, withState } from 'recompose';
import DumbExportPage from './DumbExportPage';
import config from '../../../../../config';
import { httpClient } from '../../../index';

export default compose(
  withState('isLoading', 'setIsLoading', false),
  withHandlers({
    onClickOnExportButton: props => () => {
      props.setIsLoading(true);
      httpClient(`${config.apiEndpoint}/export`)
      .then((res) => {
        props.setIsLoading(false);
        if (res.status === 200) {
          return res.json;
        } else {
          throw new Error('Une erreur inconnue s\'est produite. Si elle persiste, contactez le créateur à contact@pierre-noel.fr');
        }
      })
      .then((res) => {
        window.open(res.downloadUrl);
      });
    },
  }),
)(DumbExportPage);
