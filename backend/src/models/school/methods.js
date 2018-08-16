import School from './index';

School.findById = (id, options = {}) => School.findOne({ where: { id }, transaction: options.transaction });

School.findByCriteria = ({offset = 0, limit = 10, order = 'DESC'}) => School.findAll({ offset, limit, order });
