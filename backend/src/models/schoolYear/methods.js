import SchoolYear from './index';

SchoolYear.findById = id => SchoolYear.findOne({ where: { id } });

SchoolYear.findByIdAndSchoolId = (id, schoolId) => SchoolYear.findOne({ where: { id } });

SchoolYear.findAllBySchoolId = schoolId => SchoolYear.findAll({ where: { schoolId } });
