import config from '../src/config.js';
import db from '../src/db';

const run = async () => {
  await db.sequelize.sync();
  await db.SuperAdmin.upsert({
    email: config.defaultAdmin.email,
    passwordHash: config.defaultAdmin.passwordHash,
  });
};

run()
  .then(() => {
    console.log('ALL DONE');
    process.exit();
  })
  .catch((e) => console.log('e'));