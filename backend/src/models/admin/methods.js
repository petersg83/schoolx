import bcrypt from 'bcrypt';
import jwtFactory from 'jsonwebtoken';
import Admin from './index';
import School from '../school';
import config from '../../config';


Admin.authenticate = async ({ email, password, schoolUrl }) => {
  let isSuccess = false;
  const admin = await Admin.findOne({
    where: { email },
    include: [{
      model: School,
      as: 'school',
      where: {
        urlName: schoolUrl,
      },
    }],
  });

  if (admin && admin.passwordHash && bcrypt.compare(password, admin.passwordHash)) {
    isSuccess = true;
  }
  return isSuccess ? admin : null;
};

Admin.setAndgetNewJWT = async ({ adminId, email, schoolUrl }) => {
  const jwt = jwtFactory.sign({ email, schoolUrl, role: 'admin' }, config.jwtSecret);
  await Admin.update({ jwt }, { where: { id: adminId } });
  return jwt;
};
