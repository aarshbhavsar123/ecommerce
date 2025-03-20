"use client";
import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Button,
  Grid,
  Paper,
  Divider,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context";
import axios from "axios";

const Orders = () => {
  const { user } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [reload, setReload] = useState(false);
  const [selectedTime, setSelectedTime] = useState("this week");

  const router = useRouter();

  const handleCancel = async (orderId: string) => {
    try {
      await axios.post(`/api/order/cancel-order/${orderId}`);
      setReload((prev) => !prev); // Reload after cancellation
    } catch (e: any) {
      console.error(e.message);
    }
  };

  const handleOrders = useCallback(async () => {
    if (!user?.id) return; 

    try {
      const response = await axios.get(`/api/order/get-orders/${user.id}`, {
        params: { timePeriod: selectedTime },
      });
      setOrders(response.data);
    } catch (e: any) {
      console.error(e.message);
    }
  }, [user?.id, selectedTime]);

  useEffect(() => {
    handleOrders();
  }, [handleOrders, reload]);

  return (
    <Box sx={{ bgcolor: "background.paper", py: 8 }}>
      <Box sx={{ maxWidth: "1200px", mx: "auto", px: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: "bold" }}>
            My Orders
          </Typography>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              From
            </Typography>
            <Select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              size="small"
              sx={{ minWidth: 120 }}
            >
              <MenuItem value="this week">This Week</MenuItem>
              <MenuItem value="this month">This Month</MenuItem>
              <MenuItem value="last 3 months">Last 3 Months</MenuItem>
              <MenuItem value="last 6 months">Last 6 Months</MenuItem>
              <MenuItem value="this year">This Year</MenuItem>
            </Select>
          </Box>
        </Box>

        <Paper elevation={0} sx={{ p: 2 }}>
          {orders.length > 0 ? (
            orders.map((order, index) => (
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
                  <Grid item xs={12} sm={6} md={3} sx={{ display: "flex", gap: 2 }}>
                    <Button variant="outlined" color="error" fullWidth onClick={() => handleCancel(order.order_id)}>
                      Cancel Order
                    </Button>
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() => router.push(`/order-summary?cart=2&order_id=${order.order_id}`)}
                    >
                      View Details
                    </Button>
                  </Grid>
                </Grid>
                {index < orders.length - 1 && <Divider />}
              </React.Fragment>
            ))
          ) : (
            <Typography variant="body2" sx={{ textAlign: "center", mt: 2 }}>
              No orders found for the selected time period.
            </Typography>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default Orders;
