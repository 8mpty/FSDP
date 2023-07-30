import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { useNavigate, useParams } from 'react-router-dom';
import http from '../../http';
import { useFormik } from 'formik';
import * as yup from 'yup';

function UpdateAnnouncement() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [announcement, setAnnouncement] = useState({
    title: "",
    description: "",
    endDate: null
  });

  useEffect(() => {
    http.get(`/announcement/${id}`)
      .then((res) => {
        setAnnouncement(res.data);
        console.log(res.data);
      });
  }, []);

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
        .required('Description is required')
    }),
    onSubmit: (data) => {
      data.title = data.title.trim();
      data.description = data.description.trim();
      http.put(`/announcement/${id}`, data)
        .then((res) => {
          setAnnouncement(res.data);
          navigate("/announcementPanel");
        });
    }
  });
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };


  const delAnnouncement = () => {
    http.delete(`/announcement/${id}`)
      .then((res) => {
        console.log(res.data);
        navigate("/announcementPanel");
      });
  }
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box className="edit-container" sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <Typography variant="h5" sx={{ my: 2 }}>
          Update Announcement {announcement.id}
        </Typography>
        <Box component="form" onSubmit={formik.handleSubmit} sx={{maxWidth: '500px'}}>
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