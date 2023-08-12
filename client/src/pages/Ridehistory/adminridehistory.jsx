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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
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
    start: false,
    end: false,
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
    http.get(`/ridehistory`).then((res) => {
      setRidehistory(res.data);
    });
  }, [id]);

  const deleteridehistory = (ridehistory) => {
    if (ridehistory && ridehistory.id) {
      http.delete(`/ridehistory/${ridehistory.id}`).then((res) => {
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
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        isAdmin: isAdmin,
      },
    };

    const bookingsPromise = http.get("/booking", headers);
    const driverBookingsPromise = http.get("/driverbooking", headers);
    const rideHistoryPromise = http.get("/ridehistory", headers);

    Promise.all([bookingsPromise, rideHistoryPromise, driverBookingsPromise])
      .then(([bookingResponse, rideHistoryResponse, driverBookingResponse]) => {
        const bookingsData = bookingResponse.data;
        const rideHistoryData = rideHistoryResponse.data;
        const driverBookingsData = driverBookingResponse.data;

        // Merge data based on a common identifier (e.g., rideId or id)
        const mergedData = rideHistoryData.map((ride) => {
          const booking = bookingsData.find(
            (booking) => booking.id === ride.id
          );

          return {
            id: ride.id,
            rider: ride.riderId,
            driver: ride.driverId,
            start: booking.pickup,
            end: booking.passby,
            createdAt: ride.createdAt,
          };
        });

        // Set merged data to the state
        setRidehistorylist(mergedData);
      })
      .catch((error) => {
        console.error(error);
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

      <FormControlLabel
        control={
          <Checkbox
            checked={filterOptions.start}
            onChange={onFilterChange}
            name="start"
          />
        }
        label="by Pickup"
      />

      <FormControlLabel
        control={
          <Checkbox
            checked={filterOptions.end}
            onChange={onFilterChange}
            name="end"
          />
        }
        label="by Destination"
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
                Driver ID
              </TableCell>
              <TableCell align="right" className="table-header">
                Rider ID
              </TableCell>
              <TableCell align="right" className="table-header">
                Pickup
              </TableCell>
              <TableCell align="right" className="table-header">
                Destination
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ridehistorylist

              .filter((ridehistory) => {
                const searchString = search.toLowerCase();

                const { id, rider, driver, start, end, createdAt } =
                  ridehistory;

                return (
                  (!filterOptions.id &&
                    !filterOptions.rider &&
                    !filterOptions.driver &&
                    !filterOptions.start &&
                    !filterOptions.end &&
                    !filterOptions.createdAt) ||
                  (filterOptions.id && id.toString().includes(searchString)) ||
                  (filterOptions.rider &&
                    rider.toString().includes(searchString)) ||
                  (filterOptions.driver &&
                    driver.toString().includes(searchString)) ||
                  (filterOptions.start &&
                    start.toLowerCase().includes(searchString)) ||
                  (filterOptions.end &&
                    end.toLowerCase().includes(searchString)) ||
                  (filterOptions.createdAt &&
                    createdAt.toLowerCase().includes(searchString))
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
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default Adminridehistory;
