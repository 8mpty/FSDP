// https://www.copycat.dev/blog/material-ui-table/
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Input,
  IconButton,
  TableSortLabel,
  FormControlLabel,
  Checkbox,
  Dialog, DialogTitle, DialogContent, DialogActions, Button
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { AccessTime, Search, Clear } from "@mui/icons-material";
import http from "../../http";
import dayjs from "dayjs";
import global from "../../global";
import "../../adminridehistory.css";
import axios from "axios";

import { useParams, useNavigate } from "react-router-dom";

function Adminridehistory() {
  const [search, setSearch] = useState("");
  const [ridehistorylist, setRidehistorylist] = useState([]);
  const [sortColumn, setSortColumn] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");
  const [ridehistory, setRidehistory] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  const [filterOptions, setFilterOptions] = useState({
    id: false,
    rider: false,
    driver: false,
  });



  const [selectedRideHistory, setSelectedRideHistory] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const openDeleteModal = (ridehistory) => {
    setSelectedRideHistory(ridehistory);
    setDeleteModalOpen(true);
  };
  

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
  };

  useEffect(() => {
    http.get(`/ridehistory/${id}`).then((res) => {
      setRidehistory(res.data);
    });
  }, [id]);

  const deleteridehistory = (ridehistory) => {
    if (ridehistory && ridehistory.id) {
      http.delete(`/ridehistory/${ridehistory.id}`).then((res) => {
        console.log(res.data);
  
        // Update the ridehistorylist state to remove the deleted entry
        setRidehistorylist((prevRidehistorylist) =>
          prevRidehistorylist.filter((item) => item.id !== ridehistory.id)
        );
  
        // Close the modal and navigate to the same page
        closeDeleteModal();
        navigate("/adminridehistory");
      });
    } else {
      console.log("Invalid ride history. Cannot delete ride history.");
    }
  };
  

  const getRidehistory = () => {
    const isAdmin = true;
    const headers = {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
        "isAdmin": isAdmin
      }
    };
    
    http.get("/ridehistory",headers).then((res) => {
      setRidehistorylist(res.data);
    });
  };

  const searchRidehistory = () => {
    http.get(`/ridehistory?search=${search}`).then((res) => {
      setRidehistorylist(res.data);
    });
  };

  useEffect(() => {
    getRidehistory();
  }, []);

  const onSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const onSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      searchRidehistory();
    }
  };

  const onClickSearch = () => {
    searchRidehistory();
  };

  const onClickClear = () => {
    setSearch("");
    getRidehistory();
  };

  const onSort = (column) => {
    if (sortColumn === column) {
      // Reverse sort direction if the same column is clicked again
      setSortDirection((prevSortDirection) =>
        prevSortDirection === "asc" ? "desc" : "asc"
      );
    } else {
      // Set new sort column and default sort direction
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  //table
  const rows = [];
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/users")
      .then((res) => {
        setData(res.data);
        console.log("Result:", data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  //search
  const onFilterChange = (event) => {
    setFilterOptions({
      ...filterOptions,
      [event.target.name]: event.target.checked,
    });
  };

  return (
    <Box>
      <Input
        value={search}
        placeholder="Search"
        onChange={onSearchChange}
        onKeyDown={onSearchKeyDown}
      />
      <IconButton color="primary" onClick={onClickSearch}>
        <Search />
      </IconButton>
      <IconButton color="primary" onClick={onClickClear}>
        <Clear />
      </IconButton>
      <FormControlLabel
        control={
          <Checkbox
            checked={filterOptions.id}
            onChange={onFilterChange}
            name="id"
          />
        }
        label="by ID"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={filterOptions.driver}
            onChange={onFilterChange}
            name="driver"
          />
        }
        label="by Driver"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={filterOptions.rider}
            onChange={onFilterChange}
            name="rider"
          />
        }
        label="by Rider"
      />

      <TableContainer component={Paper} className="table-container">
        <Table className="ridetable" aria-label="simple table" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell
                onClick={() => onSort("id")}
                style={{ cursor: "pointer" }}
              >
                <TableSortLabel active={true} direction={sortDirection}>
                  Ride ID
                </TableSortLabel>
              </TableCell>
              <TableCell>Date and Time</TableCell>
              {/* className="table-header"  */}
              <TableCell align="right" className="table-header">
                Driver
              </TableCell>
              <TableCell align="right" className="table-header">
                Rider
              </TableCell>
              <TableCell align="right" className="table-header">
                Pickup
              </TableCell>
              <TableCell align="right" className="table-header">
                Destination
              </TableCell>
              <TableCell align="right" className="table-header">
                Points
              </TableCell>
              <TableCell align="right" className="table-header">
                {" "}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ridehistorylist

              .filter((ridehistory) => {
                const searchString = search.toLowerCase();
                const { id, rider, driver } = ridehistory;

                return (
                  (!filterOptions.id &&
                    !filterOptions.rider &&
                    !filterOptions.driver) ||
                  (filterOptions.id && id.toString().includes(searchString)) ||
                  (filterOptions.rider &&
                    rider.toLowerCase().includes(searchString)) ||
                  (filterOptions.driver &&
                    driver.toLowerCase().includes(searchString))
                );
              })

              .slice()
              .sort((a, b) => {
                if (sortColumn === "id") {
                  return sortDirection === "asc" ? a.id - b.id : b.id - a.id;
                }
                return 0;
              })
              .map((ridehistory) => (
                <TableRow key={ridehistory.id}>
                  <TableCell>{ridehistory.id}</TableCell>
                  <TableCell>
                    {dayjs(ridehistory.createdAt).format(global.datetimeFormat)}
                  </TableCell>
                  <TableCell align="right">{ridehistory.driver}</TableCell>
                  <TableCell align="right">{ridehistory.rider}</TableCell>
                  <TableCell align="right">{ridehistory.start}</TableCell>
                  <TableCell align="right">{ridehistory.end}</TableCell>
                  <TableCell align="right">{ridehistory.points}</TableCell>
                  <TableCell align="right">
                    
                      <IconButton
                        sx={{
                          color: "red",
                        }}
                        onClick={() => openDeleteModal(ridehistory)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    
                  </TableCell>
                </TableRow>
                
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={deleteModalOpen} onClose={closeDeleteModal} className="custom-modal">
        
      <DialogTitle>Delete Ride History</DialogTitle>
      <DialogContent className="modal-content">
        <Typography variant="body1" className="modal-text">
          Are you sure you want to delete the following ride history entry?
        </Typography>
        {/* Display the details of the selected ride history */}
        {selectedRideHistory && (
          <>
          
            <Typography variant="body2">Ride ID: {selectedRideHistory.id}</Typography>
            <Typography variant="body2">Date and Time: {dayjs(selectedRideHistory.createdAt).format(global.datetimeFormat)}</Typography>
            <Typography variant="body2">Driver: {selectedRideHistory.driver}</Typography>
            <Typography variant="body2">Rider: {selectedRideHistory.rider}</Typography>
            <Typography variant="body2">Pickup: {selectedRideHistory.start}</Typography>
            <Typography variant="body2">Destination: {selectedRideHistory.end}</Typography>
            <Typography variant="body2">Points: {selectedRideHistory.points}</Typography>
            
          </>
        )}
      </DialogContent>
      <DialogActions className="modal-actions">
        <Button onClick={closeDeleteModal} color="primary" className="modal-cancel-button">
          Cancel
        </Button>
        <Button
          onClick={() => {
            deleteridehistory(selectedRideHistory); // Call the function to delete the selected ride history
            closeDeleteModal();
          }}
          color="error"
          variant="contained"
          className="modal-delete-button"
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  </Box>
);
}

export default Adminridehistory;
