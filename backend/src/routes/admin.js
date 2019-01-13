import bcrypt from 'bcrypt';
import router from '../koa-router';
import db from '../db';
import { authRequired } from '../utils/auth';
import { periodsOverlap } from '../utils/dates';
import sendMail from '../utils/mail';


// READ MANY
router.get('/admins', authRequired(['superAdmin', 'admin'], async (ctx, next, { admin, superAdmin }) => {
  if (admin) {
    const count = await db.Admin.count({ where: { schoolId: admin.schoolId } });
    const admins = await db.Admin.findAll({
      where: { schoolId: admin.schoolId },
      offset: +ctx.query._start,
      limit: +ctx.query._end - ctx.query._start,
      order: [[ctx.query._sort, ctx.query._order]],
      attributes: ['id', 'schoolId', 'email'],
    });

    ctx.set('Access-Control-Expose-Headers', 'X-Total-Count');
    ctx.set('X-Total-Count', count);
    ctx.body = admins;
  } else if (superAdmin) {
    const count = await db.Admin.count();
    const admins = await db.Admin.findAll({
      offset: +ctx.query._start,
      limit: +ctx.query._end - ctx.query._start,
      order: [[ctx.query._sort, ctx.query._order]],
      attributes: ['id', 'schoolId', 'email'],
    });

    ctx.set('Access-Control-Expose-Headers', 'X-Total-Count');
    ctx.set('X-Total-Count', count);
    ctx.body = admins;
  }
}));

// READ ONE
router.get('/admins/:id', authRequired(['superAdmin', 'admin'], async (ctx, next, { admin, superAdmin }) => {
  let adminFound;
  if (admin) {
    adminFound = await db.Admin.findByIdAndSchoolId(ctx.params.id, admin.schoolId);
  } else if (superAdmin) {
    adminFound = await db.Admin.findById(ctx.params.id);
  }

  if (adminFound) {
    ctx.body = {
      id: adminFound.id,
      schoolId: adminFound.schoolId,
      email: adminFound.email,
    };
  }
}));

// EDIT
router.put('/admins/:id', authRequired(['admin', 'superAdmin'], async (ctx, next, { admin, superAdmin }) => {
  const updates = { email: ctx.request.body.email };
  const newPassword = ctx.request.body.password;
  console.log('ctx.request.body.password', ctx.request.body.password);
  console.log('typeof ctx.request.body.password', typeof ctx.request.body.password);

  if (typeof newPassword === 'string' && newPassword.length) {
    updates.passwordHash = await bcrypt.hash(newPassword, 8);
  }

  try {
    if (admin) {
      await db.Admin.update(updates, {
        where: {
          id: ctx.params.id,
          schoolId: admin.schoolId,
        },
      });
      const adminFound = await db.Admin.findByIdAndSchoolId(ctx.params.id, admin.schoolId);
      ctx.body = {
        id: adminFound.id,
        schoolId: adminFound.schoolId,
        email: adminFound.email,
      };
    } else if (superAdmin) {
      updates.schoolId = ctx.request.body.schoolId;
      await db.Admin.update(updates, {
        where: {
          id: ctx.params.id,
        },
      });
      const adminFound = await db.Admin.findById(ctx.params.id);
      ctx.body = {
        id: adminFound.id,
        schoolId: adminFound.schoolId,
        email: adminFound.email,
      };
    }
  } catch (e) {
    if (e.name === 'SequelizeUniqueConstraintError') {
      ctx.status = 409;
      ctx.body = { status: 409, message: 'An admin with this email already exists.' };
    } else {
      ctx.status = 500;
      ctx.body = { status: 500, message: e.errors[0].message };
    }
  }
}));

// CREATE
router.post('/admins', authRequired(['superAdmin', 'admin'], async (ctx, next, { admin, superAdmin }) => {
  const emailOfNewAdmin = ctx.request.body.email.trim().toLowerCase();
  const passwordOfNewAdmin = ctx.request.body.password;
  let newAdminOrSuperAdmin;
  if (admin) {
    newAdminOrSuperAdmin = await db.Admin.create({
      email: emailOfNewAdmin,
      schoolId: admin.schoolId,
      passwordHash: await bcrypt.hash(passwordOfNewAdmin, 8),
    });
  } else if (superAdmin) {
    newAdminOrSuperAdmin = await db.Admin.create({
      email: emailOfNewAdmin,
      schoolId: ctx.request.body.schoolId,
      passwordHash: await bcrypt.hash(passwordOfNewAdmin, 8),
    });
  }

  if (newAdminOrSuperAdmin) {
    ctx.body = {
      id: newAdminOrSuperAdmin.id,
      schoolId: newAdminOrSuperAdmin.schoolId,
      email: newAdminOrSuperAdmin.email,
    };
  }
}));

// DELETE
router.delete('/admins/:id', authRequired(['superAdmin', 'admin'], async (ctx, next, { admin, superAdmin }) => {
  if (admin) {
    const adminFound = await db.Admin.findByIdAndSchoolId(ctx.params.id, admin.schoolId);
    ctx.body = {
      id: adminFound.id,
      schoolId: adminFound.schoolId,
      email: adminFound.email,
    };
    await db.Admin.destroy({ where: { id: ctx.params.id, schoolId: admin.schoolId }});
  } else if (superAdmin) {
    const adminFound = await db.Admin.findById(ctx.params.id);
    ctx.body = {
      id: adminFound.id,
      schoolId: adminFound.schoolId,
      email: adminFound.email,
    };
    await db.Admin.destroy({ where: { id: ctx.params.id }});
  }
}));
