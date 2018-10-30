import School from './index';

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
