import { compose, lifecycle, withHandlers, withState } from 'recompose';
import DumbSettingsPage from './DumbSettingsPage';
import config from '../../../../config';
import { httpClient } from '../../index';

export default compose(
  withState('editMode', 'setEditMode', false),
  withState('accessCode', 'setAccessCode', ''),
  withState('accessCodeEdit', 'setAccessCodeEdit', ''),
  withState('errors', 'setErrors', {}),
  withHandlers({
    onEditModeChange: props => editMode => {
      props.setEditMode(editMode)
      if (editMode) {
        props.setAccessCodeEdit(props.accessCode);
      } else {
        props.setErrors({});
      }
    },
    onAccessCodeEditChange: props => newAccessCodeEdit => {
      props.setAccessCodeEdit(newAccessCodeEdit.trim());
      if (newAccessCodeEdit.trim().length > 7) {
        props.setErrors({ ...props.errors, accessCode: null });
      }
    },
  }),
  withHandlers({
    onSubmit: props => (e) => {
      e.preventDefault();
      const errors = {};
      let noError = true;
      if (props.accessCodeEdit.length < 8) {
        errors.accessCode = 'Le code doit faire au moins 8 caractères';
        noError = false;
      }

      if (noError) {
        httpClient(`${config.apiEndpoint}/settings`, {
          method: 'PUT',
          headers: new Headers({
            Accept: 'application/json',
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify({
            accessCode: props.accessCodeEdit,
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
          props.setAccessCode(res.accessCode);
          props.setEditMode(false);
        });
      } else {
        props.setErrors(errors);
      }
    },
    getSettings: props => () => {
      httpClient(`${config.apiEndpoint}/settings`, {
        headers: new Headers({
          Accept: 'application/json',
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
        props.setAccessCode(res.accessCode);
      });
    },
  }),
  lifecycle({
    componentDidMount() {
      this.props.getSettings();
    },
  }),
)(DumbSettingsPage);
