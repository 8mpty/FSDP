import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../contexts/AccountContext';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { AccountCircle, AccessTime, Search, Clear, Edit, LocationOn, SpeakerNotes, Directions, PostAdd, Done, Close, CodeSharp } from '@mui/icons-material';
import http from '../../http';
import dayjs from 'dayjs';
import global from '../../global';
import '../../App.css';
import { useFormik } from 'formik';
import * as yup from 'yup';






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



function AdminBookings() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [driverbookingList, setDriverBookingList] = useState([]);
    const [search, setSearch] = useState('');
    const { user } = useContext(UserContext);

    const [imageFile, setImageFile] = useState(null);

    const options = [
        { value: '1', label: 'Class 1' },
        { value: '2B', label: 'Class 2B' },
        { value: '2A', label: 'Class 2A' },
        { value: '2', label: 'Class 2' },
        { value: '3', label: 'Class 3' },
        { value: '3A', label: 'Class 3A' },
        { value: '3C', label: 'Class 3C' },
        { value: '3CA', label: 'Class 3CA' },
        { value: '4A', label: 'Class 4A' },
        { value: '4', label: 'Class 4' },
        { value: '5', label: 'Class 5' }
    ];

    const statusoptions = [
        { value: 'Accepted', label: 'Accept' },
        { value: 'Rejected', label: 'Reject' },
        { value: 'Completed', label: 'Completed' }

    ];

    const [driverbooking, setDriverBooking] = useState({
        drivername: "",
        driverposition: "",
        fare: "",
        totalearning: "",
        status: "",
        destination: "",
        pickup: "",
        passby: "",
        notes: ""

    });

    useEffect(() => {
        http.get(`/driverbooking/${id}`).then((res) => {
            setDriverBooking(res.data);
        });
    }, []);

    const formik = useFormik({
        initialValues: driverbooking,
        enableReinitialize: true,
        validationSchema: yup.object().shape({
            drivername: yup.string().trim()
                .min(3, 'Driver Name must be at least 3 characters')
                .max(100, 'Driver Name must be at most 100 characters')
                .required('Driver Name is required'),
            driverposition: yup.string().trim()
                .min(1, 'Driver Position must be at least 1 characters')
                .max(500, 'Driver Position must be at most 500 characters')
                .required('Driver Position is required'),

            fare: yup.string().trim()
                .min(3, 'Fare must be at least 3 characters')
                .max(500, 'Fare must be at most 500 characters')
                .required('Fare is required'),

            totalearning: yup.string().trim()
                .min(3, 'Total Earning must be at least 3 characters')
                .max(500, 'Total Earning must be at most 500 characters')
                .required('Total Earning is required'),
            status: yup.string().trim()
                .min(3, 'Status must be at least 3 characters')
                .max(500, 'Staus must be at most 500 characters')
                .required('Status is required'),

            destination: yup.string().trim()
                .min(3, 'Destination must be at least 3 characters')
                .max(100, 'Destination must be at most 100 characters')
                .required('Destination is required'),
            pickup: yup.string().trim()
                .min(3, 'Pickup Location must be at least 3 characters')
                .max(500, 'Pickup Location must be at most 500 characters')
                .required('Pickup Location is required'),

            notes: yup.string().trim()
                .min(3, 'Notes must be at least 3 characters')
                .max(500, 'Notes must be at most 500 characters')
                .required('Notes is required'),

            passby: yup.string().trim()
                .min(3, 'Passby Location must be at least 3 characters')
                .max(500, 'Passby Location must be at most 500 characters')
                .required('Passby Location is required')



        }),
        onSubmit: (data) => {
            if (imageFile) {
                data.imageFile = imageFile;
            }
            data.drivername = data.drivername.trim();
            data.driverposition = data.driverposition.trim();
            data.fare = data.fare.trim();
            data.totalearning = data.totalearning.trim();
            data.status = data.status.trim();
            data.destination = data.destination.trim();
            data.pickup = data.pickup.trim();
            data.passby = data.passby.trim();
            data.notes = data.notes.trim();

            http.put(`/driverbooking/${id}`, data)
                .then((res) => {
                    console.log(res.data);
                    navigate("/driverbookings");
                });
        }
    });

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
                                        driverbooking.status === "Rejected" && (


                                            <td style={{ width: "60px" }}  ><div style={{ color: "red", backgroundColor: "#F0A4A4", borderRadius: "20px", padding: "8px" }}>{driverbooking.status}</div></td>

                                        )}

                                    {
                                        driverbooking.status === "Pending" && (


                                            <td style={{ width: "60px" }}  ><div style={{ color: "blue", backgroundColor: "#A4C9F0", borderRadius: "20px", padding: "8px" }}>{driverbooking.status}</div></td>

                                        )}

                                    {
                                        driverbooking.status === "Completed" && (



                                            <td style={{ width: "60px" }}  >
                                                <div style={{ color: "purple", backgroundColor: "#DFA4F0", borderRadius: "20px", padding: "8px" }}>{driverbooking.status}</div>
                                                <deleteDriverBooking />
                                            </td>





                                        )}



                                    

                                </tr>




                            );
                        })
                    }


                </table>

                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle style={{ fontFamily: "system-ui" }}>
                        Delete Booking
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete this booking?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="inherit" style={{ fontFamily: "system-ui" }}
                            onClick={handleClose} className='milk'>
                            Cancel
                        </Button>
                        <Button variant="contained" color="error" style={{ fontFamily: "system-ui" }}
                            onClick={deleteDriverBooking} className='milk'>
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </Grid>
        </Box >
    );
}

export default AdminBookings;