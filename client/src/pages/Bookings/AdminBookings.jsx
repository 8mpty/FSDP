import React, { useEffect, useState, useContext } from 'react';
import UserContext from '../contexts/UserContext';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton, Button } from '@mui/material';
import { AccountCircle, AccessTime, Search, Clear, Edit, LocationOn, SpeakerNotes, Directions, PostAdd } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';
import global from '../global';
import '../App.css';



function AdminBookings() {
    const [adminbookingList, setAdminBookingList] = useState([]);
    const [search, setSearch] = useState('');
    const { user } = useContext(UserContext);

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const getAdminBookings = () => {
        http.get('/adminbooking').then((res) => {
            setAdminBookingList(res.data);
        });
    };

    const searchAdminBookings = () => {
        http.get(`/adminbooking?search=${search}`).then((res) => {
            setAdminBookingList(res.data);
        });
    };

    useEffect(() => {
        getAdminBookings();
    }, []);

    const onSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            searchAdminBookings();
        }
    };

    const onClickSearch = () => {
        searchAdminBookings();
    }

    const onClickClear = () => {
        setSearch('');
        getAdminBookings();
    };

    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const deleteAdminBooking = () => {
        http.delete(`/adminbooking/${id}`)
            .then((res) => {
                console.log(res.data);
                navigate("/adminbookings");
            });
    }

    return (
        <Box style={{ FontFace }}>
            <Typography variant="h5" sx={{ my: 2 }} style={{ fontFamily: "system-ui" }}>
                Bookings
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Input value={search} placeholder="Search"
                    onChange={onSearchChange}
                    onKeyDown={onSearchKeyDown}
                    style={{ fontFamily: "system-ui" }} />
                <IconButton color="primary"
                    onClick={onClickSearch}>
                    <Search />
                </IconButton>
                <IconButton color="primary"
                    onClick={onClickClear}>
                    <Clear />
                </IconButton>
                <Box sx={{ flexGrow: 1 }} />
                {
                    user && (
                        <Link to="/addadminbooking" style={{ textDecoration: 'none' }}>
                            <Button variant='contained' style={{ fontFamily: "system-ui" }} className='milk'>
                                <PostAdd sx={{ mr: 1 }} />
                            </Button>
                        </Link>
                    )
                }
            </Box>

            <Grid container spacing={0}>
                <table style={{ border: "1px solid", fontFamily: "system-ui", padding: "15px" }}>
                    <tr style={{ border: "1px solid", fontFamily: "system-ui", padding: "15px" }}>
                        <th style={{ border: "1px solid", fontFamily: "system-ui", padding: "15px" }}>ID</th>
                        <th style={{ border: "1px solid", fontFamily: "system-ui", padding: "15px" }}>Driver Name</th>
                        <th style={{ border: "1px solid", fontFamily: "system-ui", padding: "15px" }}>Driver Position</th>
                        <th style={{ border: "1px solid", fontFamily: "system-ui", padding: "15px" }}>Fare</th>
                        <th style={{ border: "1px solid", fontFamily: "system-ui", padding: "15px" }}>Total Earning</th>
                        <th style={{ border: "1px solid", fontFamily: "system-ui", padding: "15px" }}>Created At</th>
                        
                        <th></th>

                    </tr>
                    {

                        adminbookingList.map((adminbooking, i) => {
                            return (


                                <tr style={{ border: "1px solid", fontFamily: "system-ui", padding: "15px" , textAlign:"center" }}>
                                    <td style={{ border: "1px solid", fontFamily: "system-ui", padding: "15px"}}>{adminbooking.id}</td>
                                    <td style={{ border: "1px solid", fontFamily: "system-ui", padding: "15px"}}>{adminbooking.drivername}</td>
                                    <td style={{ border: "1px solid", fontFamily: "system-ui", padding: "15px" }}>{adminbooking.driverposition}</td>
                                    <td style={{ border: "1px solid", fontFamily: "system-ui", padding: "15px" }}>{adminbooking.fare}</td>
                                    <td style={{ border: "1px solid", fontFamily: "system-ui", padding: "15px" }}>{adminbooking.totalearning}</td>
                                    <td style={{ border: "1px solid", fontFamily: "system-ui", padding: "15px" }}>{dayjs(adminbooking.createdAt).format(global.datetimeFormat)}</td>
                                    <td>
                                        <Link to={`/editadminbooking/${adminbooking.id}`}>
                                            <IconButton color="primary" sx={{ padding: '4px' }}>
                                                <Edit />
                                            </IconButton>
                                        </Link>
                                    </td>

                                </tr>




                            );
                        })
                    }


                </table>
            </Grid>
        </Box >
    );
}

export default AdminBookings;