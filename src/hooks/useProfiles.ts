import { randomInt } from "crypto";
import { useState, useEffect } from "react";
import { Profile } from "../types";

async function generateProfile() {
  const testData: Profile = {
    id: Date.now() + Math.floor(Math.random() * 1000),
    name: "あかりちゃん" + Math.floor(Math.random() * 10) + 1,
    age: 33,
    bio: "ボーカロイド",
  };
  return testData;
  //   const response = await fetch("http://localhost:5000/generateProfile", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   });
  //   const responseText = await response.text();

  //   // bioの最後のダブルクォートがない場合に追加する
  //   const fixedResponseText = responseText.replace(/("bio":\s*"([^"]*))$/, '$1"');

  //   const profileData = JSON.parse(fixedResponseText);
  //   return profileData;
}

// useProfiles.ts

export const useProfiles = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await fetchProfiles(3);
      setLoading(false);
    };
    fetchData();
  }, []);

  // データをプロフィールデータをフェッチさせる処理
  async function fetchProfiles(count: number) {
    const generatedProfiles: Profile[] = [];
    for (let i = 0; i < count; i++) {
      try {
        const profile: any = await generateProfile();
        // 既存のプロフィールと重複しないようにする
        if (
          !profiles.some((existingProfile) => existingProfile.id === profile.id)
        ) {
          generatedProfiles.push(profile);
        } else {
          i--; // 重複した場合はもう一度生成する
        }
      } catch (e) {
        console.log("作成失敗");
      }
    }
    setProfiles((prevProfiles) => [...prevProfiles, ...generatedProfiles]);
  }

  return { profiles, loading, fetchProfiles };
};
