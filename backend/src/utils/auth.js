import jwtFactory from 'jsonwebtoken';
import db from '../db';
import config from '../config';

export const authRequired = (authorizedRoles, routeHandler) => async (ctx, next) => {
  const jwt = ctx.headers.authorization && ctx.headers.authorization.substring(7);
  const users = {};

  try {
    const decodedJwt = jwtFactory.verify(jwt, config.jwtSecret);
    if (!authorizedRoles.includes(decodedJwt.role)) {
      throw new Error('Role not authorized to access');
    }
    switch (decodedJwt.role) {
      case 'admin':
        users.admin = await db.Admin.findOne({ where: { email: decodedJwt.email, jwt } });
        break;
      case 'superAdmin':
        users.superAdmin = await db.SuperAdmin.findOne({ where: { email: decodedJwt.email, jwt } });
        break;
      default:
        throw new Error('Role is missing from jwt');
    }
    if (!users.admin && !users.superAdmin) {
      throw new Error('No user found for this jwt:', jwt);
    }
  } catch (e) {
    ctx.status = 403;
    return;
  }

  await routeHandler(ctx, next, users);
};

export const inAndOutAuthRequired = (routeHandler) => async (ctx, next) => {
  const jwt = ctx.headers.authorization && ctx.headers.authorization.substring(7);
  let school;
  try {
    const decodedJwt = jwtFactory.verify(jwt, config.jwtSecret);
    school = await db.School.findOne({ where: { id: decodedJwt.schoolId, jwt } });
    if (!school) {
      throw new Error('No user found for this jwt:', jwt);
    }
  } catch (e) {
    ctx.status = 403;
    return;
  }

  await routeHandler(ctx, next, school);
};
