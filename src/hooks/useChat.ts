// src/hooks/useChat.ts
import { useState } from "react";

type Profile = {
  id: number;
  name: string;
  age: number;
  bio: string;
};

export const useChat = (
  selectedProfile: Profile | null,
  selectedProfileId: number | null
) => {
  const [conversations, setConversations] = useState<{
    [key: number]: Array<{ sender: "me" | "them"; text: string }>;
  }>({});

  async function fetchReply(prompt: string) {
    const response = await fetch("http://localhost:5000/messages", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_text: prompt,
      }),
    });

    const responseText = await response.text();
    return responseText;
  }

  const handleSendMessage = async (messageText: string) => {
    if (messageText.trim() === "" || selectedProfileId === null) return;

    setConversations((prevConversations) => {
      const prevMessages = prevConversations[selectedProfileId] || [];
      return {
        ...prevConversations,
        [selectedProfileId]: [
          ...prevMessages,
          { sender: "me", text: messageText },
        ],
      };
    });

    const reply = await fetchReply(messageText);
    setConversations((prevConversations) => {
      const prevMessages = prevConversations[selectedProfileId] || [];
      return {
        ...prevConversations,
        [selectedProfileId]: [...prevMessages, { sender: "them", text: reply }],
      };
    });
  };

  return { conversations, handleSendMessage };
};
