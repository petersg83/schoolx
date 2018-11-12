import moment from 'moment';
import School from './index';
import SchoolYear from '../schoolYear';
import SchoolYearSettings from '../schoolYearSettings';
import UsualOpenedDays from '../usualOpenedDays';
import SpecialSchoolDay from '../specialSchoolDay';

School.findById = (id, options = {}) => School.findOne({ where: { id }, transaction: options.transaction });
School.findByIds = (ids, options = {}) => School.findAll({ where: { id: { $in: ids} }, transaction: options.transaction });

School.findByCriteria = ({offset = 0, limit = 10, order = 'DESC'}) => School.findAll({ offset, limit, order });

School.getSchoolNameBySubdomain = async urlName => {
  const foundSchool = await School.findOne({ where: { urlName } });
  if (!foundSchool) {
    throw new Error('No school found for this urlName');
  }

  return foundSchool.name;
};

School.getSchoolIdBySubdomain = async urlName => {
  const foundSchool = await School.findOne({ where: { urlName } });
  if (!foundSchool) {
    throw new Error('No school found for this urlName');
  }

  return foundSchool.id;
};

School.isSchoolOpenOn = async (schoolId, day) => {
  const currentDay = moment(day).startOf('day');
  let isOpen = false;

  const schoolYear = await SchoolYear.findOne({
    where: {
      schoolId: schoolId,
    },
    include: [{
      model: SchoolYearSettings,
      as: 'schoolYearSettings',
      where: {
        startAt: { $lte: new Date(currentDay) },
        $or: [{
          endAt: null,
        }, {
          endAt: { $gte: new Date(currentDay) },
        }],
      },
      include: [{ model: UsualOpenedDays, as: 'usualOpenedDays' }],
    }],
  });

  if (schoolYear) {
    const specialSchoolDay = await SpecialSchoolDay.findOne({
      where: {
        schoolId: schoolId,
        day: new Date(currentDay),
      },
    });


    if (specialSchoolDay) {
      isOpen = !specialSchoolDay.isClosed;
    } else {
      schoolYear.schoolYearSettings.forEach((sys) => {
        if (!sys.usualOpenedDays.every(uod => !uod.days.includes(currentDay.locale('en').format('dddd').toLowerCase()))) {
          isOpen = true;
        }
      });
    }
  }

  return isOpen;
};
