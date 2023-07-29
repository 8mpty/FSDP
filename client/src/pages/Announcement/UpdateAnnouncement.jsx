import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { useParams } from 'react-router-dom';
import http from '../../http';
import { useFormik } from 'formik';
import * as yup from 'yup';

function UpdateAnnouncement() {
  const { id } = useParams();

  const [announcement, setAnnouncement] = useState({
    title: "",
    description: ""
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
          console.log(res.data);
        });
    }
  });

  return (
    <Box>
      <Typography variant="h5" sx={{ my: 2 }}>
        Edit Announcement {announcement.id}
      </Typography>
      <Box component="form" onSubmit={formik.handleSubmit}>
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
        </Box>
      </Box>
    </Box>
  )
}

export default UpdateAnnouncement