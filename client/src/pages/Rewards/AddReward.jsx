import React from 'react'
import { Box, Typography, TextField, Button } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
//import { useParams } from 'react-router-dom';
import http from '../../http';
import { useNavigate } from 'react-router-dom';

function AddReward() {
    const navigate = useNavigate();
    //const { id } = useParams();
    const formik = useFormik({
        initialValues: {
            Reward_Name: "",
            Points_Required: "",
            Reward_Amount: "",
        },
        validationSchema: yup.object({
            Reward_Name: yup.string().trim()
                .min(3, 'Reward Name must be at least 3 characters')
                .max(100, 'Reward Name must be at most 100 characters')
                .required('Reward Name is required'),
            Points_Required: yup
                .number()
                .integer('Points must be an integer')
                .min(2, 'Points must be at least 2 characters')
                .max(10000, 'Points must be at most 1000 characters')
                .required('Points is required'),
            Reward_Amount: yup
                .number()
                .integer('Reward Amount must be an integer')
                .min(2, 'Reward Amount must be at least 2 characters')
                .max(1000, 'Reward Amount must be at most 1000 characters')
                .required('Reward Amount is required'),
        }),
        onSubmit: (data) => {
            data.Reward_Name = data.Reward_Name.trim();
            data.Points_Required = data.Points_Required;
            data.Reward_Amount = data.Reward_Amount;

            try {
                //http.post(`/rewards`, data)
                http.post(`/rewards`, data)
                    .then((res) => {
                        console.log(res.data);
                        navigate("/rewards");
                    })
                    .catch((error)  => {
                        console.error(error);
                    });
            } catch (err){
                console.log(data);
                console.log(err);
            }
        }
    });
    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Add Reward
            </Typography>
            <Box component="form" onSubmit={formik.handleSubmit}>
                <TextField
                    fullWidth margin="normal" autoComplete="off"
                    label="Reward Name"
                    name="Reward_Name"
                    value={formik.values.Reward_Name}
                    onChange={formik.handleChange}
                    error={formik.touched.Reward_Name && Boolean(formik.errors.Reward_Name)}
                    helperText={formik.touched.Reward_Name && formik.errors.Reward_Name}
                />
                <Typography variant="h6" sx={{ my: 1 }}>  
                    Upload Image
                </Typography>
                <Box sx={{ mt: 2 }}>
                    <Button variant="contained" type="submit">
                        Upload image
                    </Button>
                </Box>
                <Typography variant="h6" sx={{ my: 1 }}>
                    Points Required
                </Typography>
                <TextField
                    fullWidth margin="normal" autoComplete="off"
                    multiline minRows={2}
                    label="Points Required"
                    name="Points_Required"
                    value={formik.values.Points_Required}
                    onChange={formik.handleChange}
                    error={formik.touched.Points_Required && Boolean(formik.errors.Points_Required)}
                    helperText={formik.touched.Points_Required && formik.errors.Points_Required}
                />
                <Typography variant="h6" sx={{ my: 1 }}>
                    Reward amount
                </Typography>
                <TextField
                    fullWidth margin="normal" autoComplete="off"
                    multiline minRows={2}
                    label="Reward Amount"
                    name="Reward_Amount"
                    value={formik.values.Reward_Amount}
                    onChange={formik.handleChange}
                    error={formik.touched.Reward_Amount && Boolean(formik.errors.Reward_Amount)}
                    helperText={formik.touched.Reward_Amount && formik.errors.Reward_Amount}
                />
                <Box sx={{ mt: 2 }}>
                    <Button variant="contained" type="submit">
                        Add
                    </Button>
                </Box>
            </Box>
        </Box>
    )
}

export default AddReward;