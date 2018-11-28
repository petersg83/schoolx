import config from '../src/config.js';
import db from '../src/db';

db.sequelize.sync()
  .then(async () => {
    await db.SuperAdmin.create({
      email: config.defaultAdmin.email,
      passwordHash: config.defaultAdmin.passwordHash,
    });
    console.log('ALL DONE');
    process.exit();
  })
  .catch((e) => {
    console.log(e);
    process.exit();
  });
