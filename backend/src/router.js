import router from './koa-router';

require('./routes/school');
require('./routes/member');
require('./routes/memberSettings');
require('./routes/memberPeriodsAtSchool');
require('./routes/auth');
require('./routes/schoolYear');
require('./routes/admin');
require('./routes/calendar');
require('./routes/inAndOut');
require('./routes/statistics');
require('./routes/settings');
require('./routes/export');
require('./routes/emails');

export default router;
