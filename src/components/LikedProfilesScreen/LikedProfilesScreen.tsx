import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

import { Profile } from "../../types";

type LikedProfilesScreenProps = {
  likedProfiles: Profile[];
  onCardClick: (profileId: number) => void;
};

const LikedProfilesScreen: React.FC<LikedProfilesScreenProps> = ({
  likedProfiles,
  onCardClick,
}) => {
  return (
    <>
      <Typography
        variant='h4'
        align='center'
        style={{ marginTop: 20, marginBottom: 40 }}
      >
        いいねしたプロフィール一覧
      </Typography>
      {likedProfiles.map((profile) => (
        <Card
          key={profile.id}
          style={{ marginBottom: 20 }}
          onClick={() => onCardClick(profile.id)}
        >
          <CardContent>
            <Typography variant='h6'>{profile.name}</Typography>
            <Typography>{profile.age}歳</Typography>
            <Typography>{profile.bio}</Typography>
          </CardContent>
        </Card>
      ))}
    </>
  );
};

export default LikedProfilesScreen;
