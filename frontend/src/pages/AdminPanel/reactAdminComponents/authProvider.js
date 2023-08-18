import { AUTH_LOGIN, AUTH_LOGOUT, AUTH_ERROR, AUTH_CHECK, AUTH_GET_PERMISSIONS } from 'react-admin';
import jwtDecode from 'jwt-decode';
import config from '../../../config';

export default (type, params) => {
  // called when the user attempts to log in
  if (type === AUTH_LOGIN) {
    return fetch(`${config.apiEndpoint}/login`, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin": config.domainName ? `*.${config.domainName}` : '*',
      }),
      body: JSON.stringify({
        email: params.username,
        password: params.password,
        subdomain: window.location.hostname.split('.')[0],
      }),
    })
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else if (res.status === 403) {
        throw new Error('Identifiants incorrects. Êtes-vous sûr/sûre d\'être sur le site de votre école ?')
      } else {
        throw new Error('Une erreur inconnue s\'est produite. Si elle persiste, contactez le créateur à contact@pierre-noel.fr')
      }
    })
    .then(res => {
      localStorage.setItem('jwt', res.jwt);
      localStorage.setItem('role', jwtDecode(res.jwt).role);
      localStorage.setItem('subdomain', jwtDecode(res.jwt).subdomain);
    })
  }
  // called when the user clicks on the logout button
  if (type === AUTH_LOGOUT) {
    localStorage.removeItem('jwt');
    localStorage.removeItem('role');
    localStorage.removeItem('subdomain');
    return Promise.resolve();
  }
  // called when the API returns an error
  if (type === AUTH_ERROR) {
    const { status } = params;
    if (status === 401 || status === 403) {
      localStorage.removeItem('jwt');
      localStorage.removeItem('role');
      localStorage.removeItem('subdomain');
      return Promise.reject();
    }
    return Promise.resolve();
  }
  // called when the user navigates to a new location
  if (type === AUTH_CHECK) {
    if (window.location.href.endsWith('/inandout')) { // Needed to access inandout page when unauthenticated. Waiting for enhancement : https://github.com/marmelab/react-admin/issues/1647
      return Promise.resolve();
    }
    return localStorage.getItem('jwt')
      ? Promise.resolve()
      : Promise.reject();
  }

  if (type === AUTH_GET_PERMISSIONS) {
    if (window.location.hash.endsWith('/inandout')) { // Needed to access inandout page when unauthenticated. Waiting for enhancement : https://github.com/marmelab/react-admin/issues/1647
      return Promise.resolve('inandout');
    }
    const role = localStorage.getItem('role');
    return role ? Promise.resolve(role) : Promise.reject();
  }

  return Promise.reject('Unknown method');
};
