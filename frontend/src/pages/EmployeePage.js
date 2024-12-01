import React, { useEffect, useState } from 'react';
import axios from 'axios';

function EmployeePage() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:1111/api/v1/employees', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmployees(response.data);
      } catch (error) {
        console.error('Error fetching employees:', error.response.data);
      }
    };

    fetchEmployees();
  }, []);

  return (
    <div>
      <h2>Employee List</h2>
      <ul>
        {employees.map((employee) => (
          <li key={employee._id}>
            {employee.first_name} {employee.last_name} - {employee.position}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EmployeePage;
