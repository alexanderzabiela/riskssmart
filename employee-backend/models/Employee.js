import { Model, DataTypes } from 'sequelize';
import sequelize from '../db.js';

class Employee extends Model {}

Employee.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Employee'
});

export default Employee;
