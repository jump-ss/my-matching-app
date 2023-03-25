// src/components/Chat/Chat.tsx
import React, { useState, useEffect } from "react";
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

type Profile = {
  id: number;
  name: string;
  age: number;
  bio: string;
};

type ChatProps = {
  selectedProfile: Profile;
  selectedProfileId: number;
  handleBackClick: () => void;
};

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

const Chat: React.FC<ChatProps> = (props: ChatProps) => {
  const [conversations, setConversations] = useState<{
    [key: number]: Array<{ sender: "me" | "them"; text: string }>;
  }>({});

  // OpenAI API呼び出し関数(リプライ用)
  async function fetchReply(prompt: string) {
    //const response = await fetch("http://localhost:5000/generateReply", {
    const response = await fetch("http://localhost:5000/messages", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        //messages: prompt,
        user_text: prompt,
      }),
    });

    const responseText = await response.text();
    return responseText;
  }

  /**
   * チャットのロジック作成
   */
  const [messages, setMessages] = useState<
    Array<{ sender: "me" | "them"; text: string }>
  >([]);

  const [messageText, setMessageText] = useState("");

  const handleSendMessage = async () => {
    if (messageText.trim() === "" || props.selectedProfileId === null) return;

    setConversations((prevConversations) => {
      const prevMessages = prevConversations[props.selectedProfileId] || [];
      return {
        ...prevConversations,
        [props.selectedProfileId]: [
          ...prevMessages,
          { sender: "me", text: messageText },
        ],
      };
    });

    setMessageText("");

    const reply = await fetchReply(messageText);
    setConversations((prevConversations) => {
      const prevMessages = prevConversations[props.selectedProfileId] || [];
      return {
        ...prevConversations,
        [props.selectedProfileId]: [
          ...prevMessages,
          { sender: "them", text: reply },
        ],
      };
    });
  };

  const renderMessages = () => {
    if (props.selectedProfileId === null) return null;

    const messagesToRender = conversations[props.selectedProfileId] || [];
    return messagesToRender.map((message, index) => (
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

  if (!props.selectedProfile) return null;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box minHeight='100vh'>
        <Container maxWidth='sm'>
          {props.selectedProfile && (
            <>
              <Typography
                variant='h4'
                align='center'
                style={{ marginTop: 20, marginBottom: 40 }}
              >
                {props.selectedProfile?.name} とのチャット
              </Typography>
              <Card key={props.selectedProfile.id} style={{ marginBottom: 20 }}>
                <CardContent>
                  <Grid
                    container
                    alignItems='center'
                    style={{ marginBottom: 20 }}
                  >
                    <Grid item xs={6}>
                      <Typography align='left'>
                        {props.selectedProfile?.name} のアイコン
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
            onClick={props.handleBackClick}
          >
            プロフィールに戻る
          </Button>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Chat;
