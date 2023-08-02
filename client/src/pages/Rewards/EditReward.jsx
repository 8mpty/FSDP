import { useFormik } from 'formik';
import * as yup from 'yup';
import { Box, Typography, TextField, Button, Grid } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import http from '../../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AspectRatio from '@mui/joy/AspectRatio';

function EditReward() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [rewards, setRewards] = useState({
    Reward_Name: "",
    Points_Required: "",
    Reward_Amount: "",
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    http.get(`/rewards/${id}`).then((res) => {
      console.log(res.data);
      setRewards(res.data);
      setImageFile(res.data.imageFile);
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
          console.log("Putting Data", res.data);
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
  };

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
          console.log(res.data);
        })
        .catch(function (error) {
          console.log(error.response);
        });
    }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ my: 2 }}>
        Edit Rewards
      </Typography>
      <Box component="form" onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6} lg={8}>
            <TextField
              fullWidth margin="normal" autoComplete="off"
              label="Reward_Name"
              name="Reward_Name"
              value={formik.values.Reward_Name}
              onChange={formik.handleChange}
              error={formik.touched.Reward_Name && Boolean(formik.errors.Reward_Name)}
              helperText={formik.touched.Reward_Name && formik.errors.Reward_Name}
            />
            <Typography variant="h6" sx={{ my: 1 }}>
              Upload Image
            </Typography>
            <Box sx={{ textAlign: 'center', mt: 2 }} >
              <Button variant="contained" component="label">
                Upload Image
                <input hidden accept="image/*" multiple type="file"
                  onChange={onFileChange} />
              </Button>
              {
                imageFile && (
                  <AspectRatio sx={{ mt: 2 }}>
                    <Box component="img" alt="rewards"
                      src={`${import.meta.env.VITE_FILE_BASE_URL}${imageFile}`}>
                    </Box>
                  </AspectRatio>
                )
              }
            </Box>
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
                onClick={handleOpen}>
                Delete
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          Delete Reward
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this reward?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="inherit"
            onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" color="error"
            onClick={deleteReward}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <ToastContainer />
    </Box>
  )
}

export default EditReward