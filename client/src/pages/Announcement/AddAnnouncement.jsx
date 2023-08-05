import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, TextField, Button } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFormik } from 'formik';
import dayjs from 'dayjs';
import * as yup from 'yup';
import http from '../../http';

function AddAnnouncement() {
    const navigate = useNavigate();
    const currentDate = dayjs();

    const formik = useFormik({
        initialValues: {
            title: "",
            description: "",
            endDate: null
        },
        validationSchema: yup.object({
            title: yup.string().trim()
                .min(5, 'Title must be at least 5 characters')
                .max(100, 'Title must be at most 50 characters')
                .required('Title is required'),
            description: yup.string().trim()
                .min(10, 'Description must be at least 10 characters')
                .max(500, 'Description must be at most 100 characters')
                .required('Description is required'),
            endDate: yup.date().nullable(true)
                .min(currentDate, 'Date must not be less then today\'s date'),
        }),
        onSubmit: (data) => {
            data.title = data.title.trim();
            data.description = data.description.trim();
            data.endDate = data.endDate;

            if (!data.endDate || data.endDate === currentDate) {
                toast.error("Please pick a valid EndDate.");
                return;
            }

            http.post("/announcement/createAnnouncement", data)
                .then((res) => {
                    console.log(res.data);
                    toast.success("Created a new announcement successfully!");
                    navigate("/announcementPanel");
                })
                .catch((err) => {
                    console.error("Error creating announcement:", err);
                    toast.error(`Error creating announcement. ${err}`);
                });
        }
    });

    const isDateBeforeCurrent = (date) => {
        return date < currentDate;
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box className="edit-container" sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <Typography variant="h5" sx={{ my: 2 }}>
                    Add New Announcement
                </Typography>
                <Box className="announ" component="form" onSubmit={formik.handleSubmit} sx={{ maxWidth: '500px' }}>
                    <TextField
                        fullWidth margin="normal" autoComplete="off"
                        label="Title"
                        name="title"
                        value={formik.values.title}
                        onChange={formik.handleChange}
                        error={formik.touched.title && Boolean(formik.errors.title)}
                        helperText={formik.touched.title && formik.errors.title}
                    />
                    <TextField
                        fullWidth margin="normal" autoComplete="off"
                        multiline minRows={2}
                        label="Description"
                        name="description"
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        error={formik.touched.description && Boolean(formik.errors.description)}
                        helperText={formik.touched.description && formik.errors.description}
                    />
                    <DesktopDatePicker
                        label="EndDate"
                        inputFormat="YYYY/MM/DD"
                        value={formik.values.endDate}
                        onChange={(date) => formik.setFieldValue('endDate', date)}
                        renderInput={(props) => <TextField {...props} />}
                        error={formik.touched.endDate && Boolean(formik.errors.endDate)}
                        helperText={formik.touched.endDate && formik.errors.endDate}
                        shouldDisableDate={isDateBeforeCurrent}
                    />
                    <Box sx={{ mt: 2 }}>
                        <Button variant="contained" type="submit">
                            Add
                        </Button>
                    </Box>
                </Box>
            </Box>
        </LocalizationProvider>
    )
}

export default AddAnnouncement