import { ApolloServer, gql } from 'apollo-server-express';
import { Sequelize, DataTypes, Model } from 'sequelize';
import express from 'express';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  logging: false
});

const app = express();

class Employee extends Model {}

Employee.init({
  id: {
    type: DataTypes.STRING,
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

const typeDefs = gql`
  type Employee {
    id: ID!
    name: String!
    role: String!
  }

  type Query {
    employees: [Employee]
  }

  type Mutation {
    addEmployee(name: String!, role: String!): Employee
    updateEmployee(id: ID!, name: String!, role: String!): Employee
    deleteEmployee(id: ID!): ID
  }
`;

const resolvers = {
  Query: {
    employees: async () => await Employee.findAll()
  },
  Mutation: {
    addEmployee: async (_, { name, role }) => {
      const id = uuidv4();
      return await Employee.create({ id, name, role });
    },
    deleteEmployee: async (_, { id }) => {
      const result = await Employee.destroy({ where: { id } });
      if (result) return id;
      throw new Error('Error deleting employee');
    },
    updateEmployee: async (_, { id, name, role }) => {
      const employee = await Employee.findByPk(id);
      if (!employee) throw new Error('Employee not found');
      return employee.update({ name, role });
    }
  }
};

const startServer = async () => {
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  server.applyMiddleware({ app });
  await sequelize.sync({ force: true });
  app.listen({ port: 4000 }, () => {
    console.log(`Server is running on http://localhost:4000${server.graphqlPath}`);
  });
  await Employee.create({ name: 'Alex', role: 'Software Engineer' });
  await Employee.create({ name: 'Rob', role: 'Manager' });
};

startServer().catch((error) => {
  console.error('Error starting server:', error);
});
