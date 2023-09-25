import React from 'react';
import { useMutation, gql } from '@apollo/client';

const GET_EMPLOYEES = gql`
  query GetEmployees {
    employees {
      id
      name
      role
    }
  }
`;

const ADD_EMPLOYEE = gql`
  mutation AddEmployee($name: String!, $role: String!) {
    addEmployee(name: $name, role: $role) {
      id
      name
      role
    }
  }
`;

const UPDATE_EMPLOYEE = gql`
  mutation UpdateEmployee($id: ID!, $name: String!, $role: String!) {
    updateEmployee(id: $id, name: $name, role: $role) {
      id
      name
      role
    }
  }
`;

const EmployeeModal = ({ employee, onClose }) => {
  const [name, setName] = React.useState(employee ? employee.name : "");
  const [role, setRole] = React.useState(employee ? employee.role : "");

  const [addEmployee] = useMutation(ADD_EMPLOYEE, {
    update(cache, { data: { addEmployee } }) {
      const data = cache.readQuery({ query: GET_EMPLOYEES });
      cache.writeQuery({
        query: GET_EMPLOYEES,
        data: {
          employees: [...data.employees, addEmployee],
        },
      });
    },
  });

  const [updateEmployee] = useMutation(UPDATE_EMPLOYEE);

  const handleSubmit = async () => {
    if (employee && employee.id) {
      await updateEmployee({ variables: { id: employee.id, name, role } });
    } else {
      await addEmployee({ variables: { name, role } });
    }
    onClose();
  };

  return (
    <div className="modal-bg">
      <div className="modal-content">
        <h2>{employee ? 'Edit Employee' : 'Add Employee'}</h2>
        <div className="modal-field">
          <label>Name:</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} className="modal-input" />
        </div>
        <div className="modal-field">
          <label>Role:</label>
          <input type="text" value={role} onChange={e => setRole(e.target.value)} className="modal-input" />
        </div>
        <div className="modal-actions">
          <button onClick={handleSubmit} className="button button-primary">Save</button>
          <button onClick={onClose} className="button button-secondary">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeModal;
