"use client";

import { useAppContext } from "@/context";
import { Card, CardContent, Typography, Avatar, Grid, Divider } from "@mui/material";

export default function Profile({ params }: any) {
  const { user } = useAppContext();

  if (!user) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Grid 
      container 
      justifyContent="center" 
      spacing={3} 
      style={{ marginTop: "20px", backgroundColor: "#f4f6f8", minHeight: "100vh", padding: "20px" }}
    >
      
      <Grid item xs={12} sm={4} md={3}>
        <Card elevation={3} style={{ textAlign: "center", padding: "20px", backgroundColor: "#ffffff", borderRadius: "10px" }}>
          <Avatar 
            alt={user?.username} 
            src={user?.avatarUrl || "/default-avatar.png"} 
            style={{ width: 120, height: 120, margin: "0 auto", border: "3px solid #1976d2" }} 
          />
          <Typography variant="h6" style={{ marginTop: "10px", color: "#1976d2" }}>
            {user?.username || "Unknown User"}
          </Typography>
          <Typography color="textSecondary">
            {user?.isAdmin ? "Admin" : "User"}
          </Typography>
        </Card>
      </Grid>
      <Grid item xs={12} sm={8} md={6}>
        <Card elevation={3} style={{ padding: "20px", backgroundColor: "#ffffff", borderRadius: "10px" }}>
          <CardContent>
            <Typography variant="h6" style={{ color: "#1976d2" }}>User Name</Typography>
            <Typography color="textSecondary">{user?.username || "Not provided"}</Typography>
            <Divider style={{ margin: "10px 0", backgroundColor: "#1976d2" }} />
            
            <Typography variant="h6" style={{ color: "#1976d2" }}>Email</Typography>
            <Typography color="textSecondary">{user?.email || "Not provided"}</Typography>
            <Divider style={{ margin: "10px 0", backgroundColor: "#1976d2" }} />
            
            <Typography variant="h6" style={{ color: "#1976d2" }}>Role</Typography>
            <Typography color="textSecondary">{user?.isAdmin?"Admin":"User"}</Typography>   
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
