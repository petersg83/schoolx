import router from './koa-router';

require('./routes/school');
require('./routes/member');
require('./routes/memberSettings');
require('./routes/memberPeriodsAtSchool');
require('./routes/auth');
require('./routes/schoolYear');
require('./routes/admin');

export default router;
