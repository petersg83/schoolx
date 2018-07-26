import db from '../src/db';

db.sequelize.sync()
  .then(() => {
    console.log('ALL DONE');
    process.exit();
  })
  .catch((e) => {
    console.log(e);
    process.exit();
  });
