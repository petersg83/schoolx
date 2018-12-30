import config from '../src/config.js';
import db from '../src/db';

(async () => {
  await db.sequelize.sync();
  await db.SuperAdmin.upsert({
    email: config.defaultAdmin.email,
    passwordHash: config.defaultAdmin.passwordHash,
  });
  console.log('ALL DONE');
  process.exit();
})();
