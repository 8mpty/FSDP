import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Link } from '@mui/material';
import http from '../../http';

function ContactAdmin() {
  const [admins, setAdmins] = useState([]);

  const getAllAdmins = () => {
    http.get('/admin/getAllAdmins')
      .then(response => {
        const nonDeletedAdmins = response.data.filter(admin => !admin.isDeleted);
        setAdmins(nonDeletedAdmins);
      })
      .catch(error => {
        console.error('Error fetching admins:', error);
      });
  }

  useEffect(() => {
    getAllAdmins();
  }, []);

  const handleEmail = (email) => {
    window.location.href = `mailto:${email}`;
  }

  return (
    <Box>
      <Typography variant="h4">Contact Us</Typography>
      <Box sx={{ m: 15 }}></Box>
      <TableContainer>
        <Table className='ridetable'>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {admins.map(admin => (
              <TableRow key={admin.id}>
                <TableCell>{admin.name}</TableCell>
                <TableCell>
                  <Link component="button" variant="body2"
                    onClick={() => handleEmail(admin.email)}>
                    {admin.email}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default ContactAdmin;
