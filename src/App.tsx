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
import axios from "axios";
axios.defaults.headers.post["Content-Type"] = "application/json;charset=utf-8";
axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";

const MessageBubble = styled("div")({
  borderRadius: "15px",
  padding: "10px",
  display: "inline-block",
  background: "#f0f0f0",
  maxWidth: "70%",
  wordWrap: "break-word",
});

const UserMessage = styled(MessageBubble)({
  textAlign: "right",
});

const PartnerMessage = styled(MessageBubble)({
  textAlign: "left",
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

// OpenAI API呼び出し関数(リプライ用)
async function fetchReply(prompt: string) {
  const response = await fetch("http://localhost:5000/generateReply", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages: prompt,
    }),
  });

  const responseText = await response.text();
  return responseText;
}

// OpenAI API呼び出し関数(マッチチング相手作成用)
export async function generateProfile() {
  const response = await fetch("http://localhost:5000/generateProfile", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const responseText = await response.text();

  // bioの最後のダブルクォートがない場合に追加する
  const fixedResponseText = responseText.replace(/("bio":\s*"([^"]*))$/, '$1"');

  try {
    const profileData = JSON.parse(fixedResponseText);
    return profileData;
  } catch (error) {
    console.error("Error parsing JSON:", error);
  }
}

type Profile = {
  id: number;
  name: string;
  age: number;
  bio: string;
};

const App: React.FC = () => {
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [likedProfiles, setLikedProfiles] = useState<Profile[]>([]);
  const [isChatting, setIsChatting] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<
    "search" | "likedProfiles"
  >("search");
  const [selectedProfileId, setSelectedProfileId] = useState<number | null>(
    null
  );
  const [slideDirection, setSlideDirection] = useState<"left" | "right">(
    "left"
  );
  const [reply, setReply] = useState("");
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await fetchProfiles(3);
      setLoading(false);
    };
    fetchData();
  }, []);

  // 選択されたプロフィールを取得
  const selectedProfile = likedProfiles.find(
    (profile) => profile.id === selectedProfileId
  );

  //データをプロフィールデータをフェッチさせる処理
  async function fetchProfiles(count: number) {
    const generatedProfiles: Profile[] = [];
    for (let i = 0; i < count; i++) {
      const profile: any = await generateProfile();
      generatedProfiles.push(profile);
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
      !likedProfiles.some((likedProfile) => likedProfile.id === profile.id)
  );

  /**
   * 指定された方向（いいねまたはスキップ）でスワイプしたときの処理を実行します。
   * @param direction スワイプの方向（'like' または 'dislike'）
   */
  const handleSwipe = (direction: "like" | "dislike") => {
    setFade(false);
    setTimeout(() => {
      if (direction === "like") {
        // いいねの処理
        fetchProfiles(1);
        console.log("いいね:", filteredProfiles[currentProfileIndex].name);
        setLikedProfiles((prevProfiles) => [
          ...prevProfiles,
          filteredProfiles[currentProfileIndex],
        ]);
      } else {
        // いいね以外の処理
        console.log("スキップ:", filteredProfiles[currentProfileIndex].name);
      }

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

  /**
   * チャットのロジック作成
   */
  const [messages, setMessages] = useState<
    Array<{ sender: "me" | "them"; text: string }>
  >([]);

  const [messageText, setMessageText] = useState("");

  const handleSendMessage = async () => {
    if (messageText.trim() === "") return;

    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "me", text: messageText },
    ]);

    setMessageText("");

    const reply = await fetchReply(messageText);
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "them", text: reply },
    ]);
  };

  const renderMessages = () => {
    return messages.map((message, index) => (
      <div
        key={index}
        style={{
          display: "flex",
          justifyContent: message.sender === "me" ? "flex-end" : "flex-start",
          marginBottom: 8,
        }}
      >
        <div
          style={{
            background: message.sender === "me" ? "#1976d2" : "#f3f3f3",
            color: message.sender === "me" ? "white" : "black",
            borderRadius: 5,
            padding: 8,
            maxWidth: "60%",
            wordWrap: "break-word",
          }}
        >
          {message.text}
        </div>
      </div>
    ));
  };

  /**
   * チャット部を表示する
   */
  const renderChat = () => {
    if (!selectedProfile) return null;

    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box minHeight='100vh'>
          <Container maxWidth='sm'>
            {selectedProfile && (
              <>
                <Typography
                  variant='h4'
                  align='center'
                  style={{ marginTop: 20, marginBottom: 40 }}
                >
                  {selectedProfile?.name} とのチャット
                </Typography>
                <Card key={selectedProfile.id} style={{ marginBottom: 20 }}>
                  <CardContent>
                    <Grid
                      container
                      alignItems='center'
                      style={{ marginBottom: 20 }}
                    >
                      <Grid item xs={6}>
                        <Typography align='left'>
                          {selectedProfile?.name} のアイコン
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography align='right'>あなたのアイコン</Typography>
                      </Grid>
                    </Grid>
                    {renderMessages()}
                  </CardContent>
                  <CardActions>
                    <TextField
                      fullWidth
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={messages.length % 2 === 1}
                      color='primary'
                    >
                      送信
                    </Button>
                  </CardActions>
                </Card>
              </>
            )}
            <Button
              variant='contained'
              color='secondary'
              fullWidth
              onClick={handleChat}
            >
              プロフィールに戻る
            </Button>
          </Container>
        </Box>
      </ThemeProvider>
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
            >
              スキップ
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant='contained'
              color='primary'
              fullWidth
              onClick={() => handleSwipe("like")}
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

  if (isChatting) {
    return renderChat();
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
