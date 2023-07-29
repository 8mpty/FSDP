import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import http from "../../http";


function AnnouncementPanel() {
    const [announcements, setAnnouncements] = useState([]);
    useEffect(() => {
        // Fetch all admins from the backend when the component mounts
        http.get('/announcement/getAllAnnouncements')
            .then(response => {
                setAnnouncements(response.data);
            })
            .catch(error => {
                console.error('Error fetch announcements:', error);
            });
    }, []);
    return (
        <Box>
            <Typography variant="h4" gutterBottom>Announcement Panel</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 2 }}>
                <Link to="/addAnnouncement" style={{ textDecoration: 'none' }}>
                    <Button variant="contained" color="primary">Add Announcement</Button>
                </Link>
            </Box>
            <Box>
                <Box>
                    <TableContainer component={Paper}>
                        <Table className="admin-table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Title</TableCell>
                                    <TableCell>Description</TableCell>
                                    <TableCell>Edit</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {announcements.map((announ) => (
                                    <TableRow key={announ.id}>
                                        <TableCell>{announ.id}</TableCell>
                                        <TableCell>{announ.title}</TableCell>
                                        <TableCell>{announ.description}</TableCell>
                                        <TableCell>
                                            <Link to={`/editAnnouncement/${announ.id}`}>
                                                <Button variant="contained" color="secondary">Edit</Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Box>
        </Box>
    )
}

export default AnnouncementPanel