import Koa from 'koa';
import helmet from 'koa-helmet';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import mount from 'koa-mount';
import serve from 'koa-static';
import router from './router';
import db from './db';

const app = new Koa();

db.sequelize.authenticate()
  .then(() => console.log('Connection has been established successfully.'))
  .catch(err => console.error('Unable to connect to the database:', err));

app.use(cors({ origin: '*' }));

app.use(bodyParser({
  extendTypes: {
    json: ['application/x-javascript'], // will parse application/x-javascript type body as a JSON string
  },
  jsonLimit: '6mb',
}));

app.use(async (context, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  context.set('X-Response-Time', `${ms}ms`);
});

app.use(helmet());

app.use(router.routes());

app.use(mount("/public", serve("src/public")));

app.listen(3000);
