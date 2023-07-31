import { useFormik } from 'formik';
import * as yup from 'yup';
import { Box, Typography, TextField, Button } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import http from '../../http';

function EditReward() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [rewards, setRewards] = useState({
    Reward_Name: "",
    Points_Required: "",
    Reward_Amount: "",
  });

  useEffect(() => {
    http.get(`/rewards/${id}`).then((res) => {
      console.log(res.data);
      setRewards(res.data);
    });
  }, []);

  const formik = useFormik({
    initialValues: rewards,
    enableReinitialize: true,
    validationSchema: yup.object({
      Reward_Name: yup.string().trim()
        .min(3, 'Reward Name must be at least 3 characters')
        .max(100, 'Reward Name must be at most 100 characters')
        .required('Reward Name is required'),
      Points_Required: yup
        .number()
        .integer('Points must be an integer')
        .min(2, 'Points must be at least 2 characters')
        .max(10000, 'Points must be at most 10000 characters')
        .required('Points is required'),
      Reward_Amount: yup
        .number()
        .integer('Reward Amount must be an integer')
        .min(2, 'Reward Amount must be at least 2 characters')
        .max(1000, 'Reward Amount must be at most 1000 characters')
        .required('Reward Amount is required')
    }),
    onSubmit: (data) => {
      data.Reward_Name = data.Reward_Name.trim();
      data.Points_Required = data.Points_Required;
      data.Reward_Amount = data.Reward_Amount;
      http.put(`/rewards/${id}`, data)
        .then((res) => {
          console.log("Putting Data",res.data);
          navigate("/rewards");
        })
    },
  });

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const deleteReward = () => {
    http.delete(`/rewards/${id}`)
      .then((res) => {
        console.log(res.data);
        navigate("/rewards");
      });
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ my: 2 }}>
        Edit Rewards
      </Typography>
      <Box component="form" onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth margin="normal" autoComplete="off"
          label="Reward_Name"
          name="Reward_Name"
          value={formik.values.Reward_Name}
          onChange={formik.handleChange}
          error={formik.touched.Reward_Name && Boolean(formik.errors.Reward_Name)}
          helperText={formik.touched.Reward_Name && formik.errors.Reward_Name}
        />
        <TextField
          fullWidth margin="normal" autoComplete="off"
          multiline minRows={2}
          label="Points_Required"
          name="Points_Required"
          value={formik.values.Points_Required}
          onChange={formik.handleChange}
          error={formik.touched.Points_Required && Boolean(formik.errors.Points_Required)}
          helperText={formik.touched.Points_Required && formik.errors.Points_Required}
        />
        <TextField
          fullWidth margin="normal" autoComplete="off"
          multiline minRows={2}
          label="Reward_Amount"
          name="Reward_Amount"
          value={formik.values.Reward_Amount}
          onChange={formik.handleChange}
          error={formik.touched.Reward_Amount && Boolean(formik.errors.Reward_Amount)}
          helperText={formik.touched.Reward_Amount && formik.errors.Reward_Amount}
        />
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" type="submit">
            Update
          </Button>
          <Button variant="contained" sx={{ ml: 2 }} color="error"
            onClick={deleteReward}>
            Delete
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default EditReward