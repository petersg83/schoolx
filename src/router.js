import Router from 'koa-router';

const router = new Router();

router.get('/lol', (context, next) => {
  console.log('context.url', context.url);
  console.log('33333');
  context.body += 'get';
  next();
});


export default router;
