import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, FormControl } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from 'react-router-dom';
import http from '../../http';
import dayjs from 'dayjs';
import { useFormik } from 'formik';
import * as yup from 'yup';

function UpdateAnnouncement() {
  const navigate = useNavigate();
  const { id } = useParams();
  const currentDate = dayjs();
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [announcement, setAnnouncement] = useState({
    title: "",
    description: "",
    endDate: null,
  });

  const getAnnouncementById = (id) => {
    http.get(`/announcement/${id}`)
      .then((res) => {
        setAnnouncement(res.data);
        if (res.data.endDate) {
          setSelectedDate(dayjs(res.data.endDate));
        }
        console.log(res.data.endDate);
      });
  }

  useEffect(() => {
    getAnnouncementById(id)
  }, [id]);

  const formik = useFormik({
    initialValues: announcement,
    enableReinitialize: true,
    validationSchema: yup.object({
      title: yup.string().trim()
        .min(3, 'Title must be at least 5 characters')
        .max(100, 'Title must be at most 50 characters')
        .required('Title is required'),
      description: yup.string().trim()
        .min(3, 'Description must be at least 10 characters')
        .max(500, 'Description must be at most 100 characters')
        .required('Description is required'),
      endDate: yup.date().nullable(true)
        .min(currentDate, 'Date must not be less then today\'s date')
        .required('Date is required'),
    }),

    onSubmit: (data) => {
      data.title = data.title.trim();
      data.description = data.description.trim();
      data.endDate = data.endDate;

      http.put(`/announcement/${id}`, data)
        .then((res) => {
          toast.success(`Update announcement ${announcement.id} successfully!`);
          setAnnouncement(res.data);
          navigate("/announcementPanel");
        });
    }
  });

  const handleDateChange = (date) => {
    setSelectedDate(date);
    formik.setFieldValue('endDate', date);
  };

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const delAnnouncement = () => {
    http.delete(`/announcement/${id}`)
      .then((res) => {
        toast.success(`Deleted announcement ${announcement.id} successfully!`);
        console.log(res.data);
        navigate("/announcementPanel");
      });
  }

  const isDateBeforeCurrent = (date) => {
    return date < currentDate;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box className="edit-container" sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h5" sx={{ my: 2 }}>
          Update Announcement {announcement.id}
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
          <FormControl error={formik.touched.endDate && Boolean(formik.errors.endDate)}>
            <DesktopDatePicker
              label="EndDate"
              inputFormat="YYYY/MM/DD"
              value={selectedDate}
              onChange={handleDateChange}
              shouldDisableDate={isDateBeforeCurrent}
            />
            {formik.touched.endDate && formik.errors.endDate && <span>{formik.errors.endDate}</span>}
          </FormControl>
          <Box sx={{ mt: 2 }}>
            <Button variant="contained" type="submit">
              Update
            </Button>
            <Button variant="contained" sx={{ ml: 2 }} color="error"
              onClick={handleOpen}>
              Delete
            </Button>
          </Box>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>
              Delete Tutorial
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete "Announcement {announcement.id}"
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button variant="contained" color="inherit"
                onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="contained" color="error"
                onClick={delAnnouncement}>
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </LocalizationProvider>
  )
}

export default UpdateAnnouncement