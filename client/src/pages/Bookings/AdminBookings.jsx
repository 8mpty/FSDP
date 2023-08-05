import React, { useEffect, useState, useContext } from 'react';
import { AdminContext, UserContext } from '../../contexts/AccountContext';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton, Button } from '@mui/material';
import { AccountCircle, AccessTime, Search, Clear, Edit, LocationOn, SpeakerNotes, Directions, PostAdd } from '@mui/icons-material';
import http from '../../http';
import dayjs from 'dayjs';
import global from '../../global';
import '../../App.css';



function AdminBookings() {
    const [bookingList, setBookingList] = useState([]);
    const [search, setSearch] = useState('');
    const { admin } = useContext(AdminContext);

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const getBookings = () => {
        http.get('/booking').then((res) => {
            setBookingList(res.data);
        });
    };

    const searchBookings = () => {
        http.get(`/booking?search=${search}`).then((res) => {
            setBookingList(res.data);
        });
    };

    useEffect(() => {
        getBookings();
    }, []);

    const onSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            searchBookings();
        }
    };

    const onClickSearch = () => {
        searchBookings();
    }

    const onClickClear = () => {
        setSearch('');
        getBookings();
    };

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
                        <th>Destination</th>
                        <th>Pickup</th>
                        <th>Passby</th>
                        <th>Notes</th>
                        <th>Created At</th>

                        <th></th>

                    </tr>
                    {

                        bookingList.map((booking, i) => {
                            return (


                                <tr style={{ border: "1px solid", fontFamily: "system-ui", padding: "15px", textAlign: "center" }} key={booking.id} >
                                    <td   >{booking.id}</td>
                                    <td   >{booking.name}</td>
                                    <td   >{booking.pickup}</td>
                                    <td   >{booking.passby}</td>
                                    <td   >{booking.notes}</td>
                                    <td   >{dayjs(booking.createdAt).format(global.datetimeFormat)}</td>
                                    

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