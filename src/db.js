import db from './database';

db.School = require('./models/school').default;
require('./models/school/methods');

db.SuperAdmin = require('./models/superAdmin').default;
require('./models/superAdmin/methods');

db.Admin = require('./models/admin').default;
require('./models/admin/methods');
require('./models/admin/relations');

db.SchoolYear = require('./models/schoolYear').default;
require('./models/schoolYear/methods');
require('./models/schoolYear/relations');

db.SchoolSettings = require('./models/schoolSettings').default;
require('./models/schoolSettings/methods');
require('./models/schoolSettings/relations');

db.UsualOpenedDay = require('./models/usualOpenedDay').default;
require('./models/usualOpenedDay/methods');
require('./models/usualOpenedDay/relations');

db.SpecialSchoolDay = require('./models/specialSchoolDay').default;
require('./models/specialSchoolDay/methods');
require('./models/specialSchoolDay/relations');

db.Member = require('./models/member').default;
require('./models/member/methods');
require('./models/member/relations');

db.MemberSettings = require('./models/memberSettings').default;
require('./models/memberSettings/methods');
require('./models/memberSettings/relations');

db.MemberYear = require('./models/memberYear').default;
require('./models/memberYear/methods');
require('./models/memberYear/relations');

db.SpecialMemberDay = require('./models/specialMemberDay').default;
require('./models/specialMemberDay/methods');
require('./models/specialMemberDay/relations');

export default db;
