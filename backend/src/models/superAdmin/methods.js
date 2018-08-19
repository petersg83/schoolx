import bcrypt from 'bcrypt';
import jwtFactory from 'jsonwebtoken';
import SuperAdmin from './index';
import config from '../../config';

SuperAdmin.authenticate = async ({ email, password }) => {
  let isSuccess = false;
  const superAdmin = await SuperAdmin.findOne({ where: { email } });

  if (superAdmin && superAdmin.passwordHash && bcrypt.compare(password, superAdmin.passwordHash)) {
    isSuccess = true;
  }
  return isSuccess ? superAdmin : null;
};

SuperAdmin.setAndgetNewJWT = async ({ superAdminId, email }) => {
  const jwt = jwtFactory.sign({ email, role: 'superAdmin', subdomain: 'superAdmin' }, config.jwtSecret);
  await SuperAdmin.update({ jwt }, { where: { id: superAdminId } });
  return jwt;
};
