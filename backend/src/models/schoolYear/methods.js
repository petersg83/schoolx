import SchoolYear from './index';
import UsualOpenedDays from '../usualOpenedDays';
import SchoolYearSettings from '../schoolYearSettings';
import School from '../school';

SchoolYear.findById = (id) => SchoolYear.findOne({
  where: { id },
  include: [{
    model: SchoolYearSettings,
    as: 'schoolYearSettings',
    include: [{ model: UsualOpenedDays, as: 'usualOpenedDays'}],
  }],
});

SchoolYear.findByIdAndSchoolId = (id, schoolId) => SchoolYear.findOne({
  where: { id, schoolId },
  include: [{
    model: SchoolYearSettings,
    as: 'schoolYearSettings',
    include: [{ model: UsualOpenedDays, as: 'usualOpenedDays'}],
  }],
});

SchoolYear.findAllBySchoolId = schoolId => SchoolYear.findAll({
  where: { schoolId },
  include: [{
    model: SchoolYearSettings,
    as: 'schoolYearSettings',
    include: [{ model: UsualOpenedDays, as: 'usualOpenedDays'}],
  }],
});
