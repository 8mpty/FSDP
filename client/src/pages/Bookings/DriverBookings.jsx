import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../contexts/AccountContext';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { AccountCircle, AccessTime, Search, Clear, Edit, LocationOn, SpeakerNotes, Directions, PostAdd, Done, Close, CodeSharp } from '@mui/icons-material';
import http from '../../http';
import dayjs from 'dayjs';
import global from '../../global';
import '../../App.css';






const onFileChange = (e) => {
    let file = e.target.files[0];
    if (file) {
        if (file.size > 1024 * 1024) {
            toast.error('Maximum file size is 1MB');
            return;
        }
        let formData = new FormData();
        formData.append('file', file);
        http.post('/file/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then((res) => {
                setImageFile(res.data.filename);
            })
            .catch(function (error) {
                console.log(error.response);
            });
    }
};


function DriverBookings() {

    const [driverbookingList, setDriverBookingList] = useState([]);
    const [search, setSearch] = useState('');
    const { user } = useContext(UserContext);

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const getDriverBookings = () => {
        http.get('/driverbooking').then((res) => {
            setDriverBookingList(res.data);
        });
    };

    const searchDriverBookings = () => {
        http.get(`/driverbooking?search=${search}`).then((res) => {
            setDriverBookingList(res.data);
        });
    };

    useEffect(() => {
        getDriverBookings();
    }, []);

    const onSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            searchDriverBookings();
        }
    };

    const onClickSearch = () => {
        searchDriverBookings();
    }

    const onClickClear = () => {
        setSearch('');
        getDriverBookings();
    };

    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    const deleteDriverBooking = () => {
        http.delete(`/driverbooking/${id}`)
            .then((res) => {
                console.log(res.data);
                navigate("/driverbookings");
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

            </Box>

            <Grid container spacing={0}>
                <table className="ridetable" >
                    <tr   >
                        <th>ID</th>
                        <th>Driver Name</th>
                        <th>Driver Position</th>
                        <th>Destination</th>
                        <th>Pickup Location</th>
                        <th>Passby Location</th>
                        <th>Notes</th>

                        <th>Fare</th>
                        <th>Total Earning</th>
                        <th>Created At</th>
                        <th>Status</th>

                        <th></th>

                    </tr>
                    {

                        driverbookingList.map((driverbooking, i) => {
                            return (


                                <tr style={{ border: "1px solid", fontFamily: "system-ui", padding: "15px", textAlign: "center" }} key={driverbooking.id} >
                                    <td   >{driverbooking.id}</td>
                                    <td   >{driverbooking.drivername}</td>
                                    <td   >Class {driverbooking.driverposition}</td>
                                    <td   >{driverbooking.destination}</td>
                                    <td   >{driverbooking.pickup}</td>
                                    <td   >{driverbooking.passby}</td>
                                    <td   >{driverbooking.notes}</td>

                                    <td   >{driverbooking.fare}</td>
                                    <td   >{driverbooking.totalearning}</td>
                                    <td   >{dayjs(driverbooking.createdAt).format(global.datetimeFormat)}</td>

                                    {
                                        driverbooking.status === "Accepted" && (


                                            <td style={{ width: "70px" }} ><div style={{ color: "green", backgroundColor: "#A4F0C1", borderRadius: "20px", padding: "8px" }}>{driverbooking.status}</div></td>


                                        )}

                                    {
                                        driverbooking.status === "Completed" && (

                                            <td style={{ width: "70px" }} ><div style={{ color: "#1134A6", backgroundColor: "#63e5ff", borderRadius: "20px", padding: "8px" }}>{driverbooking.status}</div></td>


                                        )}

                                    {
                                        driverbooking.status === "Rejected" && (


                                            <td style={{ width: "60px" }}  ><div style={{ color: "red", backgroundColor: "#F0A4A4", borderRadius: "20px", padding: "8px" }}>{driverbooking.status}</div></td>

                                        )}

                                    {
                                        driverbooking.status === "Pending" && (


                                            <td style={{ width: "60px" }}  ><div style={{ color: "blue", backgroundColor: "#A4C9F0", borderRadius: "20px", padding: "8px" }}>{driverbooking.status}</div></td>

                                        )}





                                    <td>
                                        {
                                            user && driverbooking.status === "Pending" && (

                                                <Link to={`/editdriverbooking/${driverbooking.id}`}>
                                                    <IconButton color="primary" sx={{ padding: '4px' }}>
                                                        <Edit />
                                                    </IconButton>
                                                </Link>
                                            )
                                        }

                                        {
                                            user && driverbooking.status === "Accepted" && (

                                                <Link to={`/editdriverbooking/${driverbooking.id}`}>
                                                    <IconButton color="primary" sx={{ padding: '4px' }}>
                                                        <Edit />
                                                    </IconButton>
                                                </Link>
                                            )
                                        }

                                        {
                                            user && driverbooking.status === "Rejected" && (

                                                <Link to={`/editdriverbooking/${driverbooking.id}`}>
                                                    <IconButton color="primary" sx={{ padding: '4px' }}>
                                                        <Edit />
                                                    </IconButton>
                                                </Link>
                                            )
                                        }

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

export default DriverBookings;