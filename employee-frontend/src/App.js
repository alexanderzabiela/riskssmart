import React from 'react';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import EmployeeTable from './EmployeeTable';
import EmployeeModal from './EmployeeModal';

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache(),
});

function App() {
  const [selectedEmployee, setSelectedEmployee] = React.useState(null);
  const [showModal, setShowModal] = React.useState(false);

  const handleAdd = () => {
    setSelectedEmployee(null);
    setShowModal(true);
  };

  return (
    <ApolloProvider client={client}>
      <EmployeeTable 
        onEditClick={employee => {
          setSelectedEmployee(employee);
          setShowModal(true);
        }}
        onAddClick={handleAdd}
      />
      {showModal && (
        <EmployeeModal 
          employee={selectedEmployee} 
          onClose={() => setShowModal(false)}
        />
      )}
    </ApolloProvider>
  );
}

export default App;
