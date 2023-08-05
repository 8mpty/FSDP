import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Grid, Select, MenuItem } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PostAdd } from '@mui/icons-material';



function AddDriverBooking() {
    const navigate = useNavigate();
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
        { value: 'Rejected', label: 'Reject' }

    ];


    const defaultOption = options[0];

    const formik = useFormik({
        initialValues: {
            drivername: "",
            driverposition: "",
            fare: "",
            totalearning: "",
            status: "",
            destination: "",
            pickup: "",
            passby: "",
            notes: ""



        },
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
                .max(500, 'Status must be at most 20 characters')
                .required('Status is required'),
            destination: yup.string().trim()
                .min(3, 'Destination must be at least 3 characters')
                .max(100, 'Destination must be at most 100 characters')
                .required('Destination is required'),
            pickup: yup.string().trim()
                .min(3, 'Pickup Location must be at least 3 characters')
                .max(500, 'Pickup Location must be at most 500 characters')
                .required('Pickup Location is required'),
            passby: yup.string().trim()
                .min(3, 'Passby Location must be at least 3 characters')
                .max(500, 'Passby Location must be at most 500 characters')
                .required('Passby Location is required'),
            notes: yup.string().trim()
                .min(3, 'Notes must be at least 3 characters')
                .max(500, 'Notes must be at most 500 characters')
                .required('Notes is required')





        }),
        onSubmit: (data) => {
            if (imageFile) {
                data.imageFile = imageFile;
            }
            data.drivername = data.drivername.trim();
            // data.driverposition = data.driverposition.trim();
            data.fare = data.fare.trim();
            data.totalearning = data.totalearning.trim();
            data.status = data.status.trim();
            data.destination = data.destination.trim();
            data.pickup = data.pickup.trim();
            data.passby = data.passby.trim();
            data.notes = data.notes.trim();

            http.post("/driverbooking", data)
                .then((res) => {
                    console.log(res.data);
                    navigate("/driverbookings");
                }).catch((error) => {
                    console.log(error);
                    toast.error(error);
                });
        }
    });

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

    return (
        <Box style={{ marginLeft: "150px", marginTop: "75px" }}>


            <Box component="form" onSubmit={formik.handleSubmit} style={{ display: "flex" }}>
                <div style={{ display: "flex", backgroundColor: "#129D72", width: "550px", height: "505px", marginTop: "35px", color: "white", alignContent: "center", alignItems: "center" }}>
                    <p style={{ fontFamily: "system-ui", fontWeight: "bold", fontSize: "30px", marginLeft: "20px" }}>Let's Book
                        <p style={{ fontFamily: "system-ui", fontSize: "15px", marginRight: "10px" }}>
                            Enter additional information about bookings to increase efficiency for Admin needs
                        </p>
                    </p>
                </div>
                <Grid container spacing={2} style={{ alignItems: "center" }}>



                    <Grid item xs={12} md={6} lg={8} style={{ boxShadow: "0 0 0 2px rgb(255, 255, 255),0.3em 0.3em 1em rgba(0, 0, 0, 0.3)", borderRadius: "5px", padding: "20px", marginLeft: "17px", marginTop: "50px", marginBottom: "50px" }}>
                        <TextField
                            fullWidth margin="normal" autoComplete="off"
                            label="Driver Name"
                            name="drivername"
                            value={formik.values.drivername}
                            onChange={formik.handleChange}
                            error={formik.touched.drivername && Boolean(formik.errors.drivername)}
                            helperText={formik.touched.drivername && formik.errors.drivername}
                            style={{ fontFamily: "system-ui", border: "1px solid #33FFDA", marginBottom: "16px" }}
                        />
                        <Select
                            fullWidth
                            margin="normal"
                            label="Driver Position"
                            name="driverposition"
                            value={formik.values.driverposition}
                            onChange={formik.handleChange}
                            error={formik.touched.driverposition && Boolean(formik.errors.driverposition)}
                            style={{ fontFamily: "system-ui", border: "1px solid #33FFDA", textAlign: "left" }}
                            displayEmpty
                        >

                            <MenuItem value="" disabled>
                                Driver Position
                            </MenuItem>


                            {options.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>




                        <TextField
                            fullWidth margin="normal" autoComplete="off"
                            multiline minRows={2}
                            label="Fare"
                            name="fare"
                            value={formik.values.fare}
                            onChange={formik.handleChange}
                            error={formik.touched.fare && Boolean(formik.errors.fare)}
                            helperText={formik.touched.fare && formik.errors.fare}
                            style={{ fontFamily: "system-ui", border: "1px solid #33FFDA" }}
                        />
                        <TextField
                            fullWidth margin="normal" autoComplete="off"
                            multiline minRows={2}
                            label="Total Earning"
                            name="totalearning"
                            value={formik.values.totalearning}
                            onChange={formik.handleChange}
                            error={formik.touched.totalearning && Boolean(formik.errors.totalearning)}
                            helperText={formik.touched.totalearning && formik.errors.totalearning}
                            style={{ fontFamily: "system-ui", border: "1px solid #33FFDA" }}
                        />

                        <Select
                            fullWidth
                            margin="normal"
                            label="Status"
                            name="status"
                            value={formik.values.status}
                            onChange={formik.handleChange}
                            error={formik.touched.status && Boolean(formik.errors.status)}
                            style={{ fontFamily: "system-ui", border: "1px solid #33FFDA", textAlign: "left" }}
                            displayEmpty
                        >

                            <MenuItem value="" disabled>
                                Accept/Reject Booking
                            </MenuItem>


                            {statusoptions.map((statusoption) => (
                                <MenuItem key={statusoption.value} value={statusoption.value}>
                                    {statusoption.label}
                                </MenuItem>
                            ))}
                        </Select>

                        <Box sx={{ mt: 2 }}>
                            <Button variant="contained" type="submit" style={{ fontFamily: "system-ui" }} className='milk'>
                                Book
                            </Button>
                        </Box>

                    </Grid>
                </Grid>

            </Box>
            <ToastContainer />
        </Box>
    );
}

export default AddDriverBooking;