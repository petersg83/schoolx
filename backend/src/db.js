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

db.SchoolYearSettings = require('./models/schoolYearSettings').default;
require('./models/schoolYearSettings/methods');
require('./models/schoolYearSettings/relations');

db.UsualOpenedDays = require('./models/usualOpenedDays').default;
require('./models/usualOpenedDays/methods');
require('./models/usualOpenedDays/relations');

db.SpecialSchoolDay = require('./models/specialSchoolDay').default;
require('./models/specialSchoolDay/methods');
require('./models/specialSchoolDay/relations');

db.Member = require('./models/member').default;
require('./models/member/methods');
require('./models/member/relations');

db.MemberSettings = require('./models/memberSettings').default;
require('./models/memberSettings/methods');
require('./models/memberSettings/relations');

db.MemberPeriodsAtSchool = require('./models/memberPeriodsAtSchool').default;
require('./models/memberPeriodsAtSchool/methods');
require('./models/memberPeriodsAtSchool/relations');

db.SpecialMemberDay = require('./models/specialMemberDay').default;
require('./models/specialMemberDay/methods');
require('./models/specialMemberDay/relations');

export default db;
