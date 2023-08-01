import React, { useContext, useEffect, useState } from 'react';
import { Box, Typography, Paper, Button, Input, IconButton, } from '@mui/material';
import { AccessTime, Search, Clear } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { AdminContext } from '../../contexts/AccountContext';
import dayjs from 'dayjs';
import global from '../../global';
import http from '../../http';
import { DataGrid, GridToolbarContainer, GridToolbarFilterButton, GridToolbarExport } from '@mui/x-data-grid';

const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'title', headerName: 'Title', width: 200 },
    { field: 'description', headerName: 'Description', width: 300 },
    { field: 'endDate', headerName: 'End Date', width: 150 },
    { field: 'adminName', headerName: 'Created By', width: 150 },
    {
        field: 'edit',
        headerName: 'Edit',
        width: 100,
        renderCell: (params) => {
            const { adminId, id } = params.row;
            const { admin } = useContext(AdminContext);
            return adminId === admin.id ? (
                <Link to={`/editAnnouncement/${id}`}>
                    <Button variant="contained" color="secondary">
                        Edit
                    </Button>
                </Link>
            ) : null;
        },
    },
];

function AnnouncementPanel() {
    const { admin } = useContext(AdminContext);
    const [announcements, setAnnouncements] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [searchInput, setSearchInput] = useState('');
    const [search, setSearch] = useState('');

    const onSearchChange = (e) => {
        setSearchInput(e.target.value);
    };

    const getAllAnnouncements = () => {
        http.get('/announcement/getAllAnnouncements')
            .then((response) => {
                setAnnouncements(response.data);
                console.log(response.data);
            })
            .catch((error) => {
                console.error('Error fetch announcements:', error);
            });
    };

    const searchAnnouncement = () => {
        setSearch(searchInput);
    };

    const onSearchKeyDown = (e) => {
        if (e.key === 'Enter') {
            searchAnnouncement();
        }
    };

    const onClickSearch = () => {
        searchAnnouncement();
    };

    const onClickClear = () => {
        setSearchInput('');
        getAllAnnouncements();
    };

    const handleNextPage = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };

    const handlePreviousPage = () => {
        setCurrentPage((prevPage) => prevPage - 1);
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

    useEffect(() => {
        const filteredAnnouncements = announcements.filter(
            (announ) =>
                announ.title.toLowerCase().includes(search.toLowerCase()) ||
                announ.description.toLowerCase().includes(search.toLowerCase())
        );
        setRows(filteredAnnouncements);
    }, [search, announcements]);

    const [rows, setRows] = useState([]);

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Announcement Panel
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Input
                    value={searchInput}
                    placeholder="Search"
                    onChange={onSearchChange}
                    onKeyDown={onSearchKeyDown}
                />
                <IconButton color="primary" onClick={onClickSearch}>
                    <Search />
                </IconButton>
                <IconButton color="primary" onClick={onClickClear}>
                    <Clear />
                </IconButton>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 2 }}>
                <Link to="/addAnnouncement" style={{ textDecoration: 'none' }}>
                    <Button variant="contained" color="primary">
                        Add Announcement
                    </Button>
                </Link>
            </Box>
            <Box>
                <Paper>
                    <DataGrid
                        rows={rows.map((announ) => ({
                            id: announ.id,
                            title: announ.title,
                            description: announ.description,
                            endDate: dayjs(announ.endDate).format(global.datetimeFormat),
                            adminName: announ.admin.name,
                            adminId: announ.adminId,
                        }))}
                        columns={columns}
                        pageSize={itemsPerPage}
                        components={{
                            Toolbar: CustomToolbar,
                        }}
                        autoHeight
                    />
                </Paper>
                {rows.length > itemsPerPage && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                        {currentPage > 1 && (
                            <Link onClick={handlePreviousPage} style={{ textDecoration: 'none' }}>
                                Previous
                            </Link>
                        )}
                        {currentPage > 1 && currentPage < Math.ceil(rows.length / itemsPerPage) && (
                            <Typography sx={{ margin: '0 10px', display: 'flex', alignItems: 'center' }}>/</Typography>
                        )}
                        {currentPage < Math.ceil(rows.length / itemsPerPage) && (
                            <Link onClick={handleNextPage} style={{ textDecoration: 'none' }}>
                                Next
                            </Link>
                        )}
                    </Box>
                )}
                {currentPage > 1 && (
                    <Typography sx={{ margin: '0 10px', display: 'flex', alignItems: 'center' }}>
                        {`< ${currentPage} / ${getTotalPages(rows.length, itemsPerPage)} >`}
                    </Typography>
                )}
            </Box>
        </Box>
    );
}

const CustomToolbar = () => {
    return (
        <GridToolbarContainer>
            <GridToolbarFilterButton />
            <GridToolbarExport />
        </GridToolbarContainer>
    );
};

export default AnnouncementPanel;
