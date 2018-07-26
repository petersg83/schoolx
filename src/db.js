import db from './database';

db.School = require('./models/school').default;
require('./models/school/methods');

export default db;
