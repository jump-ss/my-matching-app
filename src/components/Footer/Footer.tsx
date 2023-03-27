// src/components/Footer/Footer.tsx
import React from "react";
import { Box, Button, Grid } from "@mui/material";

interface FooterProps {
  onNavigate: (screen: "search" | "likedProfiles") => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        pb: 2,
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Button
            variant='contained'
            color='secondary'
            fullWidth
            onClick={() => onNavigate("search")}
            sx={{ ml: 1, mr: 1 }}
          >
            プロフィール検索
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            variant='contained'
            color='primary'
            fullWidth
            onClick={() => onNavigate("likedProfiles")}
            sx={{ ml: 1, mr: 1 }}
          >
            一覧
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Footer;
