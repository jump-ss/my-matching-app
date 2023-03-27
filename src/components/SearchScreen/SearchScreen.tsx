// SearchScreen.tsx
import React from "react";
import {
  Typography,
  Card,
  CardContent,
  Grid,
  Fade,
  Button,
} from "@mui/material";

import { Profile } from "../../types";

type SearchScreenProps = {
  profiles: Profile[];
  currentProfileIndex: number;
  fade: boolean;
  handleSwipe: (direction: "like" | "dislike") => void;
  isButtonDisabled: boolean;
};

export const SearchScreen: React.FC<SearchScreenProps> = ({
  profiles,
  currentProfileIndex,
  fade,
  handleSwipe,
  isButtonDisabled,
}) => {
  return (
    <>
      <Typography
        variant='h4'
        align='center'
        style={{ marginTop: 20, marginBottom: 40 }}
      >
        マッチングアプリ
      </Typography>
      <Fade in={fade}>
        <Card>
          <CardContent>
            <Typography variant='h6'>
              {profiles[currentProfileIndex]?.name}
            </Typography>
            <Typography>{profiles[currentProfileIndex]?.age}歳</Typography>
            <Typography>{profiles[currentProfileIndex]?.bio}</Typography>
          </CardContent>
        </Card>
      </Fade>
      <Grid container spacing={2} style={{ marginTop: 20 }}>
        <Grid item xs={6}>
          <Button
            variant='contained'
            color='secondary'
            fullWidth
            onClick={() => handleSwipe("dislike")}
            disabled={isButtonDisabled}
          >
            スキップ
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            variant='contained'
            color='primary'
            fullWidth
            onClick={() => {
              handleSwipe("like");
            }}
            disabled={isButtonDisabled}
          >
            いいね
          </Button>
        </Grid>
      </Grid>
    </>
  );
};
