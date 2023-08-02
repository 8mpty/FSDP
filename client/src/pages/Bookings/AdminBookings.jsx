import React, { useEffect, useState, useContext } from 'react';
import { AdminContext } from '../../contexts/AccountContext';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton, Button } from '@mui/material';
import { AccountCircle, AccessTime, Search, Clear, Edit, LocationOn, SpeakerNotes, Directions, PostAdd } from '@mui/icons-material';
import http from '../../http';
import dayjs from 'dayjs';
import global from '../../global';
import '../../App.css';



function AdminBookings() {
    const [adminbookingList, setAdminBookingList] = useState([]);
    const [search, setSearch] = useState('');
    const { admin } = useContext(AdminContext);

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
                    admin && (
                        <Link to="/addadminbooking" style={{ textDecoration: 'none' }}>
                            <Button variant='contained' style={{ fontFamily: "system-ui" }} className='milk'>
                                <PostAdd sx={{ mr: 1 }} />
                            </Button>
                        </Link>
                    )
                }
            </Box>

            <Grid container spacing={0}>
                <table className="ridetable" >
                    <tr   >
                        <th>ID</th>
                        <th>Driver Name</th>
                        <th>Driver Position</th>
                        <th>Fare</th>
                        <th>Total Earning</th>
                        <th>Created At</th>

                        <th></th>

                    </tr>
                    {

                        adminbookingList.map((adminbooking, i) => {
                            return (


                                <tr style={{ border: "1px solid", fontFamily: "system-ui", padding: "15px", textAlign: "center" }} key={adminbooking.id} >
                                    <td   >{adminbooking.id}</td>
                                    <td   >{adminbooking.drivername}</td>
                                    <td   >Class {adminbooking.driverposition}</td>
                                    <td   >{adminbooking.fare}</td>
                                    <td   >{adminbooking.totalearning}</td>
                                    <td   >{dayjs(adminbooking.createdAt).format(global.datetimeFormat)}</td>
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