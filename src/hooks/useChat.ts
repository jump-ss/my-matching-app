// src/hooks/useChat.ts
import { useState, useEffect } from "react";
import type { Profile } from "../types";

type UseChat = (
  selectedProfile: Profile,
  selectedProfileId: number
) => {
  conversations: {
    [key: number]: Array<{ sender: "me" | "them"; text: string }>;
  };
  handleSendMessage: (text: string) => Promise<void>;
};

export const useChat: UseChat = (selectedProfile, selectedProfileId) => {
  const [conversations, setConversations] = useState<{
    [key: number]: Array<{ sender: "me" | "them"; text: string }>;
  }>({});

  useEffect(() => {
    if (selectedProfileId !== null && !conversations[selectedProfileId]) {
      setConversations((prevConversations) => ({
        ...prevConversations,
        [selectedProfileId]: [],
      }));
    }
  }, [selectedProfileId, conversations]);

  const handleSendMessage = async (text: string) => {
    setConversations((prevConversations) => ({
      ...prevConversations,
      [selectedProfileId]: [
        ...(prevConversations[selectedProfileId] || []),
        {
          sender: "me",
          text,
        },
      ],
    }));

    const themText = await fetchReply(text);

    setTimeout(() => {
      setConversations((prevConversations) => ({
        ...prevConversations,
        [selectedProfileId]: [
          ...(prevConversations[selectedProfileId] || []),
          {
            sender: "them",
            text: themText,
          },
        ],
      }));
    }, 1000);
  };

  return {
    conversations,
    handleSendMessage,
  };

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
};
