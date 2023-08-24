import { AUTH_LOGIN, AUTH_LOGOUT, AUTH_ERROR, AUTH_CHECK, AUTH_GET_PERMISSIONS } from 'react-admin';
import jwtDecode from 'jwt-decode';
import config from '../../../config';

const login = async params => {
  const res = await fetch(`${config.apiEndpoint}/login`, {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json',
      "Access-Control-Allow-Origin": config.domainName ? `*.${config.domainName}` : '*',
    }),
    body: JSON.stringify({
      email: params.email,
      password: params.password,
      subdomain: window.location.hostname.split('.')[0],
    }),
  });
    
  if (res.status === 403) {
    return Promise.reject('Identifiants incorrects. Êtes-vous sûr/sûre d\'être sur le site de votre école ?');
  } else if (res.status !== 200) {
    return Promise.reject('Une erreur inconnue s\'est produite. Si elle persiste, contactez le créateur à contact@pierre-noel.fr');
  }

  const resData = await res.json();
  localStorage.setItem('jwt', resData.jwt);
  localStorage.setItem('role', jwtDecode(resData.jwt).role);
  localStorage.setItem('subdomain', jwtDecode(resData.jwt).subdomain);
  
  return Promise.resolve();
}

const logout = async () => {
  localStorage.removeItem('jwt');
  localStorage.removeItem('role');
  localStorage.removeItem('subdomain');
  return Promise.resolve();
};
  
const checkAuth = () => {
  // if (window.location.href.endsWith('/inandout')) { // Needed to access inandout page when unauthenticated. Waiting for enhancement : https://github.com/marmelab/react-admin/issues/1647
  //   return Promise.resolve();
  // }
  return localStorage.getItem('jwt')
    ? Promise.resolve()
    : Promise.reject();
};
  
const checkError = error => {
  const { status } = error;
  if (status === 401 || status === 403) {
    localStorage.removeItem('jwt');
    localStorage.removeItem('role');
    localStorage.removeItem('subdomain');
    return Promise.reject();
  }
  return Promise.resolve();
};
  
const getPermissions = () => {
  if (window.location.hash.endsWith('/inandout')) { // Needed to access inandout page when unauthenticated. Waiting for enhancement : https://github.com/marmelab/react-admin/issues/1647
    return Promise.resolve('inandout');
  }
  const role = localStorage.getItem('role');
  return Promise.resolve(role || undefined);
};

const authProvider = {
  login,
  logout,
  checkAuth,
  checkError,
  getPermissions,
};

export default authProvider;