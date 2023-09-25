import React from 'react';
import { useQuery, gql, useMutation } from '@apollo/client';

const GET_EMPLOYEES = gql`
  query {
    employees {
      id
      name
      role
    }
  }
`;

const DELETE_EMPLOYEE = gql`
  mutation DeleteEmployee($id: ID!) {
    deleteEmployee(id: $id) 
  }
`;

const EmployeeTable = ({ onEditClick, onAddClick }) => {
  const { loading, data } = useQuery(GET_EMPLOYEES);

  const [deleteEmployee] = useMutation(DELETE_EMPLOYEE, {
    update(cache, { data: { deleteEmployee } }) {
      const existingEmployees = cache.readQuery({ query: GET_EMPLOYEES });
      const newEmployees = existingEmployees.employees.filter(
        employee => employee.id !== deleteEmployee
      );
      cache.writeQuery({
        query: GET_EMPLOYEES,
        data: { employees: newEmployees }
      });
    }
  });

  if (loading) return <p className="text-gray-600">Loading...</p>;

  return (
    <div className="p-4">
      <button 
        onClick={onAddClick} 
        className="button button-primary mb-4"
      >
        Add Employee
      </button>
      <table className="table">
        <thead className="table-header">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data && data.employees.map(employee => (
            <tr className="table-row" key={employee.id}>
              <td>{employee.id}</td>
              <td>{employee.name}</td>
              <td>{employee.role}</td>
              <td>
                <button 
                  onClick={() => onEditClick(employee)} 
                  className="button button-primary"
                >
                  Edit
                </button>
                <button 
                  onClick={() => deleteEmployee({ variables: { id: employee.id } })}
                  className="button button-delete"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;
