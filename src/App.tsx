import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import {
  Button,
  Container,
  Typography,
  Box,
  CssBaseline,
  Slide,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { Footer } from "./components/Footer";
import { Chat } from "./components/Chat";
import { LikedProfilesScreen } from "./components/LikedProfilesScreen";
import { SearchScreen } from "./components/SearchScreen";

import { useProfiles } from "./hooks";
import { Profile } from "./types";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
    background: {
      default: "#e0f2f1",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#e0f2f1",
        },
      },
    },
  },
});

const App: React.FC = () => {
  const [selectedProfileId, setSelectedProfileId] = useState<number | null>(
    null
  );
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [likedProfiles, setLikedProfiles] = useState<Profile[]>([]);
  const [isChatting, setIsChatting] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<
    "search" | "likedProfiles"
  >("search");

  const [slideDirection, setSlideDirection] = useState<"left" | "right">(
    "left"
  );
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const { profiles, loading, fetchProfiles } = useProfiles();

  useEffect(() => {
    const fetchData = async () => {
      await fetchProfiles(1);
      //setLoading(false);
    };
    fetchData();
  }, []);

  // 選択されたプロフィールを取得
  const selectedProfile =
    likedProfiles.find((profile) => profile.id === selectedProfileId) || null;

  // カードをクリックしたときのイベントハンドラー
  const handleCardClick = (profileId: number) => {
    setSelectedProfileId(profileId);
    handleChat();
  };

  /**
   * いいねされていないプロフィールのみを保持するために、profilesをフィルタリング
   */
  const filteredProfiles = profiles.filter(
    (profile) =>
      !likedProfiles.some((likedProfile) => likedProfile?.id === profile?.id)
  );

  /**
   * 指定された方向（いいねまたはスキップ）でスワイプしたときの処理を実行します。
   * @param direction スワイプの方向（'like' または 'dislike'）
   */
  const handleSwipe = (direction: "like" | "dislike") => {
    setIsButtonDisabled(true);
    setFade(false);
    setTimeout(() => {
      fetchProfiles(1);
      if (direction === "like") {
        // いいねの処理
        console.log("いいね:", filteredProfiles[currentProfileIndex].name);
        setLikedProfiles((prevProfiles) => [
          ...prevProfiles,
          filteredProfiles[currentProfileIndex],
        ]);
      } else {
        // いいね以外の処理
        console.log("スキップ:", filteredProfiles[currentProfileIndex].name);
      }

      setTimeout(() => {
        setIsButtonDisabled(false);
      }, 200);

      if (currentProfileIndex < profiles.length - 1) {
        setCurrentProfileIndex((prevIndex) => prevIndex + 1);
        if (profiles.length - (currentProfileIndex + 1) === 1) {
          fetchProfiles(3);
        }
      } else {
        alert("プロフィールがすべて表示されました。");
      }
      setFade(true);
    }, 500);
  };

  /**
   * チャット画面の表示・非表示を切り替える
   */
  const handleChat = () => {
    setSlideDirection((prevDirection) =>
      prevDirection === "left" ? "right" : "left"
    );
    setIsChatting(!isChatting);
  };
  /**
   * ナビゲーションボタンで画面を切り替える
   * @param screen "search" | "likedProfiles" プロフィール検索かいいね一覧画面かを示す
   */
  const handleNavigation = (screen: "search" | "likedProfiles") => {
    setCurrentScreen(screen);
  };

  const renderSearchScreen = () => {
    return (
      <SearchScreen
        profiles={profiles}
        currentProfileIndex={currentProfileIndex}
        fade={fade}
        handleSwipe={handleSwipe}
        isButtonDisabled={isButtonDisabled}
      />
    );
  };

  const renderLikedProfilesScreen = () => {
    return (
      <LikedProfilesScreen
        likedProfiles={likedProfiles}
        onCardClick={(profileId: number) => handleCardClick(profileId)}
      />
    );
  };

  /**
   *現在の画面に応じたコンテンツをレンダリングします。
   */
  const renderMainScreen = () => {
    if (loading) {
      return <Typography align='center'>ローディング中...</Typography>;
    }

    if (currentScreen === "likedProfiles") {
      return renderLikedProfilesScreen();
    } else {
      return renderSearchScreen();
    }
  };

  if (isChatting && selectedProfile && selectedProfileId) {
    return (
      <Chat
        selectedProfile={selectedProfile}
        selectedProfileId={selectedProfileId}
        handleBackClick={() => {
          setSlideDirection((prevDirection) =>
            prevDirection === "left" ? "right" : "left"
          );
          setIsChatting(!isChatting);
        }}
      />
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box minHeight='100vh'>
        <Container maxWidth='sm'>
          <Slide in={!isChatting} direction={slideDirection}>
            <div>{renderMainScreen()}</div>
          </Slide>
          <Footer onNavigate={handleNavigation} />
        </Container>
      </Box>
    </ThemeProvider>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));

export default App;
