import Koa from 'koa';
import helmet from 'koa-helmet';
import router from './router';

const app = new Koa();

app.use(helmet());
app.use(router.routes());

app.use(async (context, next) => {
  console.log('11111');
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  context.set('X-Response-Time', `${ms}ms`);
});

app.use(context => console.log('context.url', context.url));

app.use(async context => {
  console.log('22222');
  context.body += 'use';
});


app.listen(3000);
