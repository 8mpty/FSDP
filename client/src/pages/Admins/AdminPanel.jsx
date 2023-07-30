import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import http from "../../http";
import dayjs from "dayjs";
import global from '../../global';
import '../../AdminPanel.css';

function AdminPanel() {
  const [admins, setAdmins] = useState([]);
  const [users, setUsers] = useState([]);
  const [showAdmins, setShowAdmins] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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
    setShowAdmins(prevShowAdmins => !prevShowAdmins);
  };

  const handleNextPage = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage(prevPage => prevPage - 1);
  };

  const renderTableData = (data) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const getTotalPages = (totalItems, itemsPerPage) => {
    return Math.ceil(totalItems / itemsPerPage);
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
        <Box>
          <Typography variant="h5" gutterBottom>Admins</Typography>
          <TableContainer component={Paper}>
            <Table className="admin-table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Extra Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {renderTableData(admins).map(admin => (
                  <TableRow key={admin.id}>
                    <TableCell>{admin.id}</TableCell>
                    <TableCell>{admin.name}</TableCell>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell>
                      {admin.email !== "admin@admin.com" && (
                        <Button variant="contained" color="secondary" onClick={() => deleteAdmin(admin.id)}>Delete</Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {admins.length > itemsPerPage && (
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
              {currentPage > 1 && (
                <Link onClick={handlePreviousPage} style={{ textDecoration: 'none' }} >Previous</Link>
              )}
              {currentPage > 1 && currentPage < Math.ceil(admins.length / itemsPerPage) && (
                <Typography sx={{ margin: '0 10px', display: 'flex', alignItems: 'center' }}>/</Typography>
              )}
              {currentPage < Math.ceil(admins.length / itemsPerPage) && (
                <Link onClick={handleNextPage} style={{ textDecoration: 'none' }}>Next</Link>
              )}
            </Box>
          )}
          {currentPage > 1 && (
            <Typography sx={{ margin: '0 10px', display: 'flex', alignItems: 'center' }}>
              {`< ${currentPage} / ${getTotalPages(admins.length, itemsPerPage)} >`}
            </Typography>
          )}
        </Box>
      ) : (
        <Box>
          <Typography variant="h5" gutterBottom>Users</Typography>
          <TableContainer component={Paper}>
            <Table className="user-table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell>Updated At</TableCell>
                  <TableCell>Extra Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {renderTableData(users).map(user => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{dayjs(user.createdAt).format(global.datetimeFormat)}</TableCell>
                    <TableCell>{dayjs(user.updatedAt).format(global.datetimeFormat)}</TableCell>
                    <TableCell>
                      {user.requestDelete && (
                        <Button variant="contained" color="secondary" onClick={() => deleteUser(user.id, user.requestDelete)}>
                          Delete
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {users.length > itemsPerPage && (
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
              {currentPage > 1 && (
                <Link onClick={handlePreviousPage} style={{ textDecoration: 'none' }} >Previous</Link>
              )}
              {currentPage > 1 && currentPage < Math.ceil(users.length / itemsPerPage) && (
                <Typography sx={{ margin: '0 10px', display: 'flex', alignItems: 'center' }}>/</Typography>
              )}
              {currentPage < Math.ceil(users.length / itemsPerPage) && (
                <Link onClick={handleNextPage} style={{ textDecoration: 'none' }}>Next</Link>
              )}
            </Box>
          )}
          {currentPage > 1 && (
            <Typography sx={{ margin: '0 10px', display: 'flex', alignItems: 'center' }}>
              {`< ${currentPage} / ${getTotalPages(users.length, itemsPerPage)} >`}
            </Typography>
          )}
        </Box>
      )}
    </Box >
  );
}

export default AdminPanel;
