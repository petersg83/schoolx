import { compose, withHandlers, withState } from 'recompose';
import moment from 'moment';
import DumbExportPage from './DumbExportPage';
import config from '../../../../../config';

const UNKNOWN_ERROR = 'Une erreur inconnue s\'est produite. Si elle persiste, contactez le créateur à contact@pierre-noel.fr';

const getFileName = (res) => {
  const contentDisposition = res.headers.get('Content-Disposition') || '';
  const match = contentDisposition.match(/filename="?([^";]+)"?/);
  return match ? match[1] : `export-${moment().format('DD-MM-YYYY')}.xlsx`;
};

const downloadBlob = (blob, fileName) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

export default compose(
  withState('isLoading', 'setIsLoading', false),
  withHandlers({
    onClickOnExportButton: props => async () => {
      props.setIsLoading(true);
      try {
        const res = await fetch(`${config.apiEndpoint}/export`, {
          headers: new Headers({
            Authorization: `Bearer ${localStorage.getItem('jwt')}`,
          }),
        });
        if (!res.ok) {
          throw new Error(UNKNOWN_ERROR);
        }
        downloadBlob(await res.blob(), getFileName(res));
      } catch (e) {
        alert(e.message === UNKNOWN_ERROR ? UNKNOWN_ERROR : `${UNKNOWN_ERROR}\n\n(${e.message})`);
      } finally {
        props.setIsLoading(false);
      }
    },
  }),
)(DumbExportPage);
