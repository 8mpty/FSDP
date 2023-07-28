import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import http from "../../http";
import { Box, Typography, TextField, Button } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";

function Editridehistory() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ridehistory, setridehistory] = useState({
    description: "",
  });

  useEffect(() => {
    http.get(`/ridehistory/${id}`).then((res) => {
      setridehistory(res.data);
    });
  }, []);

  const formik = useFormik({
    initialValues: ridehistory,
    enableReinitialize: true,
    validationSchema: yup.object({
      description: yup
        .string()
        .trim()
        
        .max(50, "Description must be at most 50 characters")

    }),
    onSubmit: (data) => {
      data.description = data.description.trim();
      http.put(`/ridehistory/${id}`, data).then((res) => {
        console.log(res.data);
        navigate("/ridehistory"); 
      });
    },
  });

  return (
    <Box>
      <Typography variant="h5" sx={{ my: 2 }}>
        Edit Notes
      </Typography>
      <Box component="form" onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          autoComplete="off"
          multiline
          minRows={2}
          label="Description"
          name="description"
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.description && formik.errors.description}
          helperText={formik.touched.description && formik.errors.description}
        />
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" type="submit">
            Update
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default Editridehistory;
