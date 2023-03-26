import { useState, useEffect } from "react";
import { Profile } from "../types";

export async function generateProfile() {
  const testData: Profile = {
    id: 1,
    name: "あかりちゃん",
    age: 33,
    bio: "変態紳士",
  };
  return testData;
  // 以下はサーバー側のAPIを呼び出す場合のコードです。
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

export const useProfiles = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await fetchProfiles(1);
      setLoading(false);
    };
    fetchData();
  }, []);

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

  return { profiles, loading, fetchProfiles };
};
