// AdminPanel.jsx
import React, { useEffect, useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import http from "../../http";
import '../../AdminPanel.css';

function AdminPanel() {
  const [admins, setAdmins] = useState([]);
  const [users, setUsers] = useState([]);
  const [showAdmins, setShowAdmins] = useState(true); // New state variable to track data display

  function formatDate(dateString) {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleString(); // You can customize the date format further if needed
    return formattedDate;
  }
  useEffect(() => {
    // Fetch all admins from the backend when the component mounts
    http.get('/admin/getAllAdmins')
      .then(response => {
        setAdmins(response.data);
      })
      .catch(error => {
        console.error('Error fetching admins:', error);
      });

    // Fetch all users from the backend when the component mounts
    http.get('/user/getAllUsers')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  }, []);

  const deleteAdmin = (id) => {
    // Send a DELETE request to the server to delete the admin with the given id
    http.delete(`/admin/${id}`)
      .then(response => {
        // If the admin is deleted successfully, update the state to remove the admin from the list
        if (response.data.message) {
          setAdmins(admins.filter(admin => admin.id !== id));
        }
      })
      .catch(error => {
        console.error(`Error deleting admin with ID ${id}:`, error);
      });
  };

  const deleteUser = (id, requestDelete) => {
    if (requestDelete) {
      // Send a DELETE request to the server to delete the user with the given id
      http.delete(`/user/${id}`)
        .then(response => {
          // If the user is deleted successfully, update the state to remove the user from the list
          if (response.data.message) {
            setUsers(users.filter(user => user.id !== id));
          }
        })
        .catch(error => {
          console.error(`Error deleting user with ID ${id}:`, error);
        });
    } else {
      // Show a toast message indicating that the user's request for deletion is false
      toast.info("User has not requested account deletion.");
    }
  };

  const handleToggleData = () => {
    setShowAdmins(prevShowAdmins => !prevShowAdmins); // Toggle the showAdmins state
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>AdminPanel</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 2 }}>
        <Link to="/registerAdmin" style={{ textDecoration: 'none' }}>
          <Button variant="contained" color="primary">Add Admin</Button>
        </Link>
      </Box>

      <Button variant="contained" color="primary" onClick={handleToggleData}>
        {showAdmins ? "Show Users" : "Show Admins"}
      </Button>

      {showAdmins ? (
        <div>
          <Typography variant="h5" gutterBottom>Admins</Typography>
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Extra Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map(admin => (
                <tr key={admin.id}>
                  <td>{admin.id}</td>
                  <td>{admin.name}</td>
                  <td>{admin.email}</td>
                  <td>
                    <Button variant="contained" color="secondary" onClick={() => handleDeleteAdmin(admin.id)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div>
          <Typography variant="h5" gutterBottom>Users</Typography>
          <table className="user-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Created At</th>
                <th>Updated At</th>
                <th>Extra Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{formatDate(user.createdAt)}</td>
                  <td>{formatDate(user.updatedAt)}</td>
                  <td>
                    {user.requestDelete && (
                      <Button variant="contained" color="secondary" onClick={() => deleteUser(user.id, user.requestDelete)}>
                        Delete
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Box>
  );
}

export default AdminPanel;
