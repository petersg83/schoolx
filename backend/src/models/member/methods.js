import Member from './index';

Member.findById = (id) => Member.findOne({ where: { id } });

Member.findByIdAndSchoolId = (id, schoolId) => Member.findOne({ where: { id, schoolId } });
