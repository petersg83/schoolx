import router from './koa-router';

require('./routes/school');
require('./routes/member');
require('./routes/memberSettings');
require('./routes/auth');

export default router;
