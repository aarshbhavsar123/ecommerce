"use client";
import React, { useEffect } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Button,
  Grid,
  Paper,
  Pagination,
  Divider,
  IconButton,
} from "@mui/material";
import {
  ArrowBackIos,
  ArrowForwardIos,
  Check,
  Close,
  LocalShipping,
  Inventory,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context";
import axios from "axios";
import { useState } from "react";
import { Router } from "next/router";
const Orders = () => {
  const { user, setUser } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [reload,setReload] = useState(true);
  const f = async () => {
    try {
      const response = await axios.get(`/api/order/get-orders/${user.id}`);
      setOrders(response.data);
      setReload(!reload);
    } catch (e: any) {
      console.log(e.message);
    }
  };
  // const handleOrders = () => {
    
  //   f();
  // };
  const handleCancel = (orderId: any) => {
    const f = async () => {
      try {
        const response = await axios.post(`/api/order/cancel-order/${orderId}`);
        console.log(response.data);
      } catch (e: any) {
        console.log(e.message);
      }
    };
    f();
  };
  useEffect(()=>{f();}, [reload]);
  console.log(orders);
  const router = useRouter();
  return (
    <Box sx={{ bgcolor: "background.paper", py: 8 }}>
      <Box sx={{ maxWidth: "1200px", mx: "auto", px: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Typography variant="h5" component="h2" sx={{ fontWeight: "bold" }}>
            My orders
          </Typography>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              from
            </Typography>
            <Select
              defaultValue="this week"
              size="small"
              sx={{ minWidth: 120 }}
            >
              <MenuItem value="this week">this week</MenuItem>
              <MenuItem value="this month">this month</MenuItem>
              <MenuItem value="last 3 months">the last 3 months</MenuItem>
              <MenuItem value="last 6 months">the last 6 months</MenuItem>
              <MenuItem value="this year">this year</MenuItem>
            </Select>
          </Box>
        </Box>
        <Paper elevation={0} sx={{ p: 2 }}>
          {orders.length>0 && orders.map((order, index) => (
            <React.Fragment key={order.order_id}>
              <Grid container spacing={2} alignItems="center" sx={{ py: 2 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Order ID:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    {order.order_id}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Placed On:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    {new Date(order.createdAt).toLocaleDateString("en-GB")}
                  </Typography>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={3}
                  sx={{ display: "flex", gap: 2 }}
                >
                  <Button
                    variant="outlined"
                    color="error"
                    fullWidth
                    onClick={() => handleCancel(order.order_id)}
                  >
                    Cancel order
                  </Button>

                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => {
                      router.push(
                        `/order-summary?cart=2&order_id=${order.order_id}`
                      );
                    }}
                  >
                    View details
                  </Button>
                </Grid>
              </Grid>
              {index < orders.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </Paper>
      </Box>
    </Box>
  );
};

export default Orders;
