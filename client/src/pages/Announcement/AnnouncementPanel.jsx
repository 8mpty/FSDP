import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Input, IconButton } from '@mui/material';
import { AccessTime, Search, Clear } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import dayjs from "dayjs";
import global from '../../global';
import http from "../../http";


function AnnouncementPanel() {
    const [search, setSearch] = useState('');
    const [announcements, setAnnouncements] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };
    const getAllAnnouncements = () => {
        http.get('/announcement/getAllAnnouncements')
            .then(response => {
                setAnnouncements(response.data);
            })
            .catch(error => {
                console.error('Error fetch announcements:', error);
            });
    }
    const searchAnnouncement = () => {
        http.get(`/announcement/getAllAnnouncements?search=${search}`)
            .then((res) => {
                setAnnouncements(res.data);
            });
    };
    const onSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            searchAnnouncement();
        }
    };
    const onClickSearch = () => {
        searchAnnouncement();
    }

    const onClickClear = () => {
        setSearch('');
        getAllAnnouncements();
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

    useEffect(() => {
        getAllAnnouncements();
    }, []);

    return (
        <Box>
            <Typography variant="h4" gutterBottom>Announcement Panel</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Input value={search} placeholder="Search"
                    onChange={onSearchChange}
                    onKeyDown={onSearchKeyDown} />
                <IconButton color="primary" onClick={onClickSearch}>
                    <Search />
                </IconButton>
                <IconButton color="primary" onClick={onClickClear}>
                    <Clear />
                </IconButton>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 2 }}>
                <Link to="/addAnnouncement" style={{ textDecoration: 'none' }}>
                    <Button variant="contained" color="primary">Add Announcement</Button>
                </Link>
            </Box>
            <Box>
                <Box>
                    <TableContainer component={Paper}>
                        <Table className="antable">
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Title</TableCell>
                                    <TableCell>Description</TableCell>
                                    <TableCell>End Date</TableCell>
                                    <TableCell>Edit</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {renderTableData(announcements).map((announ) => (
                                    <TableRow key={announ.id}>
                                        <TableCell>{announ.id}</TableCell>
                                        <TableCell>{announ.title}</TableCell>
                                        <TableCell>{announ.description}</TableCell>
                                        <TableCell>{dayjs(announ.endDate).format(global.datetimeFormat)}</TableCell>
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
                    {announcements.length > itemsPerPage && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                            {currentPage > 1 && (
                                <Link onClick={handlePreviousPage} style={{ textDecoration: 'none' }} >Previous</Link>
                            )}
                            {currentPage > 1 && currentPage < Math.ceil(announcements.length / itemsPerPage) && (
                                <Typography sx={{ margin: '0 10px', display: 'flex', alignItems: 'center' }}>/</Typography>
                            )}
                            {currentPage < Math.ceil(announcements.length / itemsPerPage) && (
                                <Link onClick={handleNextPage} style={{ textDecoration: 'none' }}>Next</Link>
                            )}
                        </Box>
                    )}
                    {currentPage > 1 && (
                        <Typography sx={{ margin: '0 10px', display: 'flex', alignItems: 'center' }}>
                            {`< ${currentPage} / ${getTotalPages(announcements.length, itemsPerPage)} >`}
                        </Typography>
                    )}
                </Box>
            </Box>
        </Box>
    )
}

export default AnnouncementPanel