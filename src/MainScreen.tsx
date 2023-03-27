// MainScreen.tsx
import React from "react";
import { Typography } from "@mui/material";

import { SearchScreen } from "./components/SearchScreen";
import { LikedProfilesScreen } from "./components/LikedProfilesScreen";

import { Profile } from "./types";

interface MainScreenProps {
  loading: boolean;
  currentScreen: "search" | "likedProfiles";
  profiles: Profile[];
  currentProfileIndex: number;
  fade: boolean;
  handleSwipe: (direction: "like" | "dislike") => void;
  isButtonDisabled: boolean;
  likedProfiles: Profile[];
  onCardClick: (profileId: number) => void;
}

export const MainScreen: React.FC<MainScreenProps> = ({
  loading,
  currentScreen,
  profiles,
  currentProfileIndex,
  fade,
  handleSwipe,
  isButtonDisabled,
  likedProfiles,
  onCardClick,
}) => {
  if (loading) {
    return <Typography align='center'>ローディング中...</Typography>;
  }

  if (currentScreen === "likedProfiles") {
    return (
      <LikedProfilesScreen
        likedProfiles={likedProfiles}
        onCardClick={onCardClick}
      />
    );
  } else {
    return (
      <SearchScreen
        profiles={profiles}
        currentProfileIndex={currentProfileIndex}
        fade={fade}
        handleSwipe={handleSwipe}
        isButtonDisabled={isButtonDisabled}
      />
    );
  }
};
