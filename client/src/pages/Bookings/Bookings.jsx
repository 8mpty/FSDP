import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../contexts/AccountContext';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton, Button } from '@mui/material';
import { AccountCircle, AccessTime, Search, Clear, Edit, LocationOn, SpeakerNotes, Directions, PostAdd } from '@mui/icons-material';
import http from '../../http';
import dayjs from 'dayjs';
import global from '../../global';
import '../../App.css';


function Bookings() {
    const [bookingList, setBookingList] = useState([]);
    const [search, setSearch] = useState('');
    const { user } = useContext(UserContext);

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
                    user && (
                        <Link to="/addbooking" style={{ textDecoration: 'none' }}>
                            <Button variant='contained' style={{ fontFamily: "system-ui" }} className='milk'>
                                <PostAdd sx={{ mr: 1 }} />
                            </Button>
                        </Link>
                    )
                }
            </Box>

            <Grid container spacing={2}>
                {
                    bookingList.map((booking, i) => {
                        return (
                            <Grid item xs={12} md={6} lg={4} key={booking.id}>
                                {
                                    user && user.id === booking.userId && (

                                        <Card sx={{ maxWidth: 345 }}>


                                            <CardContent>
                                                <Box sx={{ display: 'flex', mb: 1 }}>
                                                    <Typography variant="h5" sx={{ flexGrow: 1 }} style={{ fontFamily: "system-ui", fontWeight: "bold", textAlign: "left" }}>
                                                        {booking.name}
                                                    </Typography>



                                                    <Link to={`/editbooking/${booking.id}`}>
                                                        <IconButton color="primary" sx={{ padding: '4px' }}>
                                                            <Edit />
                                                        </IconButton>
                                                    </Link>


                                                </Box>
                                                <img src="https://www.abcpaintandbody.com/wp-content/uploads/2020/06/GettyImages-467657744.jpg"
                                                    height="194"
                                                    width="100%"
                                                    style={{ paddingBottom: "15px" }}
                                                >
                                                </img>
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                                                    color="text.secondary">
                                                    <AccountCircle sx={{ mr: 1 }} />
                                                    <Typography style={{ fontFamily: "system-ui" }}>
                                                        {booking.user.name}
                                                    </Typography>

                                                </Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, paddingBottom: "10px" }}
                                                    color="text.secondary">
                                                    <AccessTime sx={{ mr: 1 }} />
                                                    <Typography style={{ fontFamily: "system-ui" }}>
                                                        {dayjs(booking.createdAt).format(global.datetimeFormat)}
                                                    </Typography>
                                                </Box>

                                                <Typography sx={{ whiteSpace: 'pre-wrap' }} style={{ fontFamily: "system-ui", paddingBottom: "5px", textAlign: "left" }}>
                                                    <LocationOn sx={{ mr: 1 }} />
                                                    {booking.pickup}
                                                </Typography>
                                                <Typography sx={{ whiteSpace: 'pre-wrap' }} style={{ fontFamily: "system-ui", paddingBottom: "5px", textAlign: "left" }}>
                                                    <Directions sx={{ mr: 1 }} />
                                                    {booking.passby}
                                                </Typography>
                                                <Typography sx={{ whiteSpace: 'pre-wrap' }} style={{ fontFamily: "system-ui", paddingBottom: "5px", textAlign: "left" }}>
                                                    <SpeakerNotes sx={{ mr: 1 }} />
                                                    {booking.notes}
                                                </Typography>
                                                <Typography sx={{ whiteSpace: 'pre-wrap' }} style={{ fontFamily: "system-ui", paddingBottom: "5px" }}>


                                                </Typography>
                                            </CardContent>

                                        </Card>
                                    )
                                }

                            </Grid>
                        );
                    })
                }
            </Grid>
        </Box>
    );
}

export default Bookings;