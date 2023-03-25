import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import {
  Button,
  TextField,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Fade,
  Box,
  CssBaseline,
  Slide,
  CardActions,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { styled } from "@mui/system";

import { Chat } from "./components/Chat";

const MessageBubble = styled("div")({
  borderRadius: "15px",
  padding: "10px",
  display: "inline-block",
  background: "#f0f0f0",
  maxWidth: "70%",
  wordWrap: "break-word",
});

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

// OpenAI API呼び出し関数(マッチチング相手作成用)
export async function generateProfile() {
  const testData: Profile = {
    id: 1,
    name: "あかりちゃん",
    age: 33,
    bio: "変態紳士",
  };
  return testData;
  // const response = await fetch("http://localhost:5000/generateProfile", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  // });
  // const responseText = await response.text();

  // // bioの最後のダブルクォートがない場合に追加する
  // const fixedResponseText = responseText.replace(/("bio":\s*"([^"]*))$/, '$1"');

  // try {
  //   const profileData = JSON.parse(fixedResponseText);
  //   return profileData;
  // } catch (error) {
  //   console.error("Error parsing JSON:", error);
  // }
}

type Profile = {
  id: number;
  name: string;
  age: number;
  bio: string;
};

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

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await fetchProfiles(1);
      setLoading(false);
    };
    fetchData();
  }, []);

  // 選択されたプロフィールを取得
  const selectedProfile =
    likedProfiles.find((profile) => profile.id === selectedProfileId) || null;

  //データをプロフィールデータをフェッチさせる処理
  async function fetchProfiles(count: number) {
    const generatedProfiles: Profile[] = [];
    for (let i = 0; i < count; i++) {
      try {
        const profile: any = await generateProfile();
        generatedProfiles.push(profile);
      } catch (e) {
        console.log(e);
      }
    }
    setProfiles((prevProfiles) => [...prevProfiles, ...generatedProfiles]);
  }

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

  /**
   * フッター部をの表示する
   */
  const renderFooter = () => {
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
              onClick={() => handleNavigation("search")}
              sx={{ ml: 1, mr: 1 }} // ボタンの右側にマージンを追加
            >
              プロフィール検索
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant='contained'
              color='primary'
              fullWidth
              onClick={() => handleNavigation("likedProfiles")}
              sx={{ ml: 1, mr: 1 }} // ボタンの左側にマージンを追加
            >
              一覧
            </Button>
          </Grid>
        </Grid>
      </Box>
    );
  };

  const renderSearchScreen = () => {
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

  const renderLikedProfilesScreen = () => {
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
            onClick={() => handleCardClick(profile.id)}
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

  /**
   *現在の画面に応じたコンテンツをレンダリングします。
   */
  const renderScreen = () => {
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
            <div>{renderScreen()}</div>
          </Slide>
          <div>{renderFooter()}</div>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));

export default App;
