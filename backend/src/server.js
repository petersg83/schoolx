import Koa from 'koa';
import helmet from 'koa-helmet';
import router from './router';
import db from './db';

const app = new Koa();

db.sequelize.authenticate()
  .then(() => console.log('Connection has been established successfully.'))
  .catch(err => console.error('Unable to connect to the database:', err));

app.use(async (context, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  context.set('X-Response-Time', `${ms}ms`);
});

app.use(helmet());

app.use(router.routes());

app.listen(3000);
