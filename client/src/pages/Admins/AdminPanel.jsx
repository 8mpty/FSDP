import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Input, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { Search, Clear, Edit, Delete } from '@mui/icons-material';
import DriveEtaIcon from '@mui/icons-material/DriveEta';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import http from "../../http";
import dayjs from "dayjs";
import global from '../../global';
import '../../AdminPanel.css';

function AdminPanel() {
  const [openDelAdmin, setOpenDelAdmin] = useState(false);
  const [openDelUser, setOpenDelUser] = useState(false);
  const [openDriver, setOpenDriver] = useState(false);
  const [search, setSearch] = useState('');
  const [admins, setAdmins] = useState([]);
  const [users, setUsers] = useState([]);
  const [showAdmins, setShowAdmins] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const itemsPerPage = 5;


  const onSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const getAllAdmins = () => {
    http.get('/admin/getAllAdmins')
      .then(response => {
        setAdmins(response.data);
      })
      .catch(error => {
        console.error('Error fetching admins:', error);
      });
  }

  const getAllUsers = () => {
    http.get('/user/getAllUsers')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  }





  const searchAdmin = () => {
    http.get(`/admin/getAllAdmins?search=${search}`)
      .then((res) => {
        setAdmins(res.data);
      });
  };
  const searchUser = () => {
    http.get(`/user/getAllUsers?search=${search}`)
      .then((res) => {
        setUsers(res.data);
      });
  };



  const onSearchKeyDownAdmin = (e) => {
    if (e.key === "Enter") {
      searchAdmin();
    }
  };

  const onSearchKeyDownUser = (e) => {
    if (e.key === "Enter") {
      searchUser();
    }
  };



  const onClickSearchAdmin = () => {
    searchAdmin();
  }

  const onClickClearAdmin = () => {
    setSearch('');
    getAllAdmins();
  };



  const onClickSearchUser = () => {
    searchUser();
  }

  const onClickClearUser = () => {
    setSearch('');
    getAllUsers();
  };



  useEffect(() => {
    getAllAdmins();
    getAllUsers();
  }, []);

  const deleteAdmin = (id) => {
    http.delete(`/admin/${id}`)
      .then(response => {
        if (response.data.message) {
          toast.success(`Successfully deleted admin`);
          setAdmins(admins.filter(admin => admin.id !== id));
        }
      })
      .catch(error => {
        toast.error(`Error when deleting admin`, error);
        console.error(`Error deleting admin with ID ${id}:`, error);
      });
  };

  // Don't Use
  // const deleteUser = (id, requestDelete) => {
  //   if (requestDelete) {
  //     http.delete(`/user/${id}`)
  //       .then(response => {
  //         if (response.data.message) {
  //           toast.success(`Successfully deleted user`);
  //           setUsers(users.filter(user => user.id !== id));
  //         }
  //       })
  //       .catch(error => {
  //         toast.error(`Error when deleting user`, error);
  //         console.error(`Error deleting user with ID ${id}:`, error);
  //       });
  //   } else {
  //     toast.info("User has not requested account deletion.");
  //   }
  // };

  const softDelete = (id, requestDelete) => {
    if (requestDelete) {
      http.put(`/user/softDelete/${id}`)
        .then(response => {
          toast.success(`Account Deleted Successfully.`);
          setUsers(users.map(user => user.id === id ? {
            ...user, isDeleted: true
          } : user));
        })
        .catch(error => {
          toast.error(`Error when deleting ${users.id} `, error);
          console.error(`Error deleting user  with ID ${id}:`, error);
        });
    } else {
      console.log("requestDelete - Not eligible.");
      toast.info("User has not requested to delete their account!");
    }
  };

  const setDriver = (id, requestAsDriver, driverStatus) => {
    if (requestAsDriver && !driverStatus) {
      http.put(`/user/setDriverStatus/${id}`)
        .then(response => {
          toast.success(`User is now officially a driver.`);
          setUsers(users.map(user => user.id === id ? {
            ...user, driverStatus: true
          } : user));
        })
        .catch(error => {
          toast.error(`Error when approving ${users.id} driver status`, error);
          console.error(`Error updating driver status of user with ID ${id}:`, error);
        });
    } else {
      console.log("setDriver - Not eligible for approval.");
      toast.info("User has not requested to be a driver!");
    }
  };

  const resendVerificationCode = (userId) => {
    http.post(`/user/resendVerificationCode`, { userId })
      .then(response => {
        if (response.data.message) {
          toast.success(`Successfully sent new verification code.`);
        }
      })
      .catch(error => {
        toast.error(`Error when resending verification code`, error);
        console.error(`Error resending verification code for user with ID ${userId}:`, error);
      });
  };



  const handleOpenUser = () => {
    setOpenDelUser(true);
  };
  const handleOpenAdmin = () => {
    setOpenDelAdmin(true);
  };
  const handleOpenDriver = () => {
    setOpenDriver(true);
  };

  const handleCloseUser = () => {
    setOpenDelUser(false);
  };
  const handleCloseAdmin = () => {
    setOpenDelAdmin(false);
  };
  const handleCloseDriver = () => {
    setOpenDriver(false);
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

  const filterActiveUsers = (users) => {
    return users.filter((user) => !user.isDeleted);
  };

  const filterActiveAdmins = (admins) => {
    return admins.filter((admin) => !admin.isDeleted);
  };

  return (
    <Box>

      <Typography variant="h4" gutterBottom>Admin Panel</Typography>
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
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Input value={search} placeholder="Search Admins"
              onChange={onSearchChange}
              onKeyDown={onSearchKeyDownAdmin} />
            <IconButton color="primary" onClick={onClickSearchAdmin}>
              <Search />
            </IconButton>
            <IconButton color="primary" onClick={onClickClearAdmin}>
              <Clear />
            </IconButton>
          </Box>
          <Typography variant="h5" gutterBottom>Admins</Typography>
          <TableContainer component={Paper}>
            <Table className="ridetable">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Extra Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {renderTableData(filterActiveAdmins(admins)).map(admin => (
                  <TableRow key={admin.id}>
                    <TableCell>{admin.id}</TableCell>
                    <TableCell>{admin.name}</TableCell>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell>
                      {admin.email !== "admin@admin.com" && (
                        <Box>
                          <IconButton color="error" onClick={handleOpenAdmin}><Delete /></IconButton>
                          <Dialog open={openDelAdmin} onClose={handleCloseUser}>
                            <DialogTitle>
                              Delete Account
                            </DialogTitle>
                            <DialogContent>
                              <DialogContentText>
                                Are you sure you want to delete admin account {admin.id}?
                              </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                              <Button variant="contained" color="inherit"
                                onClick={handleCloseAdmin}>
                                Cancel
                              </Button>
                              <Button variant="contained" color="error"
                                onClick={() => deleteAdmin(admin.id)}>
                                Delete
                              </Button>
                            </DialogActions>
                          </Dialog>
                        </Box>
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
          <Box style={{ margin: '10px' }}>
            <Link to="/usercreationdashboard" style={{ textDecoration: 'none' }}>
              <Button variant="contained" color="primary" margin="50px">User Stats</Button>
            </Link>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Input value={search} placeholder="Search Users"
              onChange={onSearchChange}
              onKeyDown={onSearchKeyDownUser} />
            <IconButton color="primary" onClick={onClickSearchUser}>
              <Search />
            </IconButton>
            <IconButton color="primary" onClick={onClickClearUser}>
              <Clear />
            </IconButton>
          </Box>
          <Typography variant="h5" gutterBottom>Users</Typography>
          <TableContainer component={Paper}>
            <Table className="ridetable">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell>Updated At</TableCell>
                  <TableCell>Extra Actions</TableCell>
                  <TableCell>Approve</TableCell>
                  <TableCell>Resend Code</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {renderTableData(filterActiveUsers(users)).map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{dayjs(user.createdAt).format(global.datetimeFormat)}</TableCell>
                    <TableCell>{dayjs(user.updatedAt).format(global.datetimeFormat)}</TableCell>
                    <TableCell>
                      {user.requestDelete && (
                        <Box>
                          <IconButton color="error" onClick={handleOpenUser}><Delete /></IconButton>
                          <Dialog open={openDelUser} onClose={handleCloseUser}>
                            <DialogTitle>
                              Delete Account
                            </DialogTitle>
                            <DialogContent>
                              <DialogContentText>
                                Are you sure you want to delete user account {user.id}?
                              </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                              <Button variant="contained" color="inherit"
                                onClick={handleCloseUser}>
                                Cancel
                              </Button>
                              <Button variant="contained" color="error"
                                onClick={() => softDelete(user.id, user.requestDelete)}>
                                Delete
                              </Button>
                            </DialogActions>
                          </Dialog>
                        </Box>
                      )}
                    </TableCell>
                    <TableCell>
                      {user.requestAsDriver && !user.driverStatus && (
                        <Box>
                          <IconButton color="secondary" onClick={handleOpenDriver}><DriveEtaIcon /></IconButton>
                          <Dialog open={openDriver} onClose={handleCloseDriver}>
                            <DialogTitle>
                              Approve Driver Request
                            </DialogTitle>
                            <DialogContent>
                              <DialogContentText>
                                Are you sure you want to approve the driver request of user account {user.id}?
                              </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                              <Button variant="contained" color="inherit"
                                onClick={handleCloseDriver}>
                                Cancel
                              </Button>
                              <Button variant="contained" color="warning"
                                onClick={() => setDriver(user.id, user.requestAsDriver, user.driverStatus)}>
                                Approve
                              </Button>
                            </DialogActions>
                          </Dialog>
                        </Box>
                      )}
                    </TableCell>
                    <TableCell>
                      <IconButton color="secondary" onClick={() => resendVerificationCode(user.id)}>
                        <VpnKeyIcon />
                      </IconButton>
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
