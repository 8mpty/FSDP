import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Grid } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PostAdd } from '@mui/icons-material';




function AddBooking() {
    const navigate = useNavigate();
    const [imageFile, setImageFile] = useState(null);

    const formik = useFormik({
        initialValues: {
            name: "",
            pickup: "",
            passby: "",
            notes: "",



        },
        validationSchema: yup.object().shape({
            name: yup.string().trim()
                .min(3, 'Name must be at least 3 characters')
                .max(100, 'Name must be at most 100 characters')
                .required('Name is required'),
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
            data.name = data.name.trim();
            data.pickup = data.pickup.trim();
            data.notes = data.notes.trim();
            data.passby = data.passby.trim();

            http.post("/booking", data)
                .then((res) => {
                    console.log(res.data);
                    navigate("/bookings");
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
        <Box style={{ marginLeft: "150px",marginTop:"75px" }}>
            <Box component="form" onSubmit={formik.handleSubmit} style={{ display: "flex" }}>

                <div style={{ display: "flex", backgroundColor: "#00b4cf", width: "550px", height: "465px", marginTop: "35px",color:"white", alignContent:"center",alignItems:"center" }}>
                    <p style={{ fontFamily: "system-ui" , fontWeight:"bold", fontSize:"30px",marginLeft:"20px"}}>Let's Book
                        <p style={{fontFamily:"system-ui",paddingTop:"30px", fontSize:"15px"}}>
                            Feeling Lazy?
                        </p>
                        <p style={{fontFamily:"system-ui",fontSize:"15px"}}>
                            Book a car ride that maximises comfort and speed today
                        </p>
                    </p>
                </div>




                <Grid container spacing={2} style={{ alignItems: "center" }}>

                    <Grid item xs={12} md={6} lg={8} style={{ boxShadow: "0 0 0 2px rgb(255, 255, 255),0.3em 0.3em 1em rgba(0, 0, 0, 0.3)", borderRadius: "5px", padding: "20px", marginLeft: "17px", marginTop: "50px", marginBottom: "50px" }}>


                        <TextField
                            fullWidth margin="normal" autoComplete="off"
                            label="Name"
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name}
                            style={{ fontFamily: "system-ui", border: "1px solid #33FFDA" }}
                        />
                        <TextField
                            fullWidth margin="normal" autoComplete="off"
                            label="Pickup"
                            name="pickup"
                            value={formik.values.pickup}
                            onChange={formik.handleChange}
                            error={formik.touched.pickup && Boolean(formik.errors.pickup)}
                            helperText={formik.touched.pickup && formik.errors.pickup}
                            style={{ fontFamily: "system-ui", border: "1px solid #33FFDA" }}
                        />
                        <TextField
                            fullWidth margin="normal" autoComplete="off"
                            multiline minRows={2}
                            label="Passby"
                            name="passby"
                            value={formik.values.passby}
                            onChange={formik.handleChange}
                            error={formik.touched.passby && Boolean(formik.errors.passby)}
                            helperText={formik.touched.passby && formik.errors.passby}
                            style={{ fontFamily: "system-ui", border: "1px solid #33FFDA" }}
                        />
                        <TextField
                            fullWidth margin="normal" autoComplete="off"
                            multiline minRows={2}
                            label="Notes"
                            name="notes"
                            value={formik.values.notes}
                            onChange={formik.handleChange}
                            error={formik.touched.notes && Boolean(formik.errors.notes)}
                            helperText={formik.touched.notes && formik.errors.notes}
                            style={{ fontFamily: "system-ui", border: "1px solid #33FFDA" }}
                        />

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

export default AddBooking;