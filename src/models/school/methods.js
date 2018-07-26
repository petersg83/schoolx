import School from './index';

School.findById = (id, options = {}) => School.findOne({ where: { id }, transaction: options.transaction });

School.createSchool = (school, options = {}) => School.create({
  name: school.name,
}, {
  transaction: options.transaction,
});
