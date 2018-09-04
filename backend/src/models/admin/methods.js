import bcrypt from 'bcrypt';
import jwtFactory from 'jsonwebtoken';
import _ from 'lodash';
import Admin from './index';
import School from '../school';
import Member from '../member';
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
  const jwt = jwtFactory.sign({ email, schoolUrl, role: 'admin', subdomain: schoolUrl }, config.jwtSecret);
  await Admin.update({ jwt }, { where: { id: adminId } });
  return jwt;
};

Admin.prototype.canEditMembers = async function (memberIds = []) {
  const membersCount = await Member.count({
    logging: console.log,
    where: {
      id: { $in: memberIds },
      schoolId: this.schoolId },
  });
  if (membersCount !== _.uniq(memberIds).length) {
    throw new Error("You don't have the authorization to edit those members");
  }
};
