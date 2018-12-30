import moment from 'moment';
import jwtFactory from 'jsonwebtoken';
import School from './index';
import SchoolYear from '../schoolYear';
import SchoolYearSettings from '../schoolYearSettings';
import UsualOpenedDays from '../usualOpenedDays';
import SpecialSchoolDay from '../specialSchoolDay';
import config from '../../config';

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

School.getSchoolBySubdomain = async urlName => {
  const foundSchool = await School.findOne({ where: { urlName } });
  if (!foundSchool) {
    throw new Error('No school found for this urlName');
  }

  return foundSchool;
};

School.getSchoolIdBySubdomain = async urlName => {
  const foundSchool = await School.findOne({ where: { urlName } });
  if (!foundSchool) {
    throw new Error('No school found for this urlName');
  }

  return foundSchool.id;
};

School.setAndgetNewJWT = async (schoolId, transaction) => {
  const jwt = jwtFactory.sign({ schoolId }, config.jwtSecret);
  await School.update({ jwt }, { where: { id: schoolId }, transaction });
  return jwt;
};

School.getSettingsForSchoolDay = async (schoolId, day) => {
  const currentDay = moment(day).startOf('day');
  let settings = {
    isClosed: true,
  };

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
      settings = {
        day: specialSchoolDay.day,
        openAt: specialSchoolDay.openAt,
        closeAt: specialSchoolDay.closeAt,
        maxArrivalTime: specialSchoolDay.maxArrivalTime,
        minTimeBefTotalAbsence: specialSchoolDay.minTimeBefTotalAbsence,
        isClosed: specialSchoolDay.isClosed,
      };
    } else {
      schoolYear.schoolYearSettings.forEach((sys) => {
        const todaySettings = sys.usualOpenedDays.find(uod => uod.days.includes(currentDay.locale('en').format('dddd').toLowerCase()));
        if (todaySettings) {
          settings = {
            day: todaySettings.day,
            openAt: todaySettings.openAt,
            closeAt: todaySettings.closeAt,
            maxArrivalTime: todaySettings.maxArrivalTime,
            minTimeBefTotalAbsence: todaySettings.minTimeBefTotalAbsence,
            isClosed: false,
          };
        }
      });
    }
  }

  return settings;
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
