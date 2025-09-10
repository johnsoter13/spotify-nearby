import { Redirect } from "expo-router";
import { getToken } from "@lib/auth";
import { useEffect, useState } from "react";

export default function Index() {
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const token = await getToken();
      setAuthed(!!token);
    })();
  }, []);

  if (authed === null) {
    return null; // or splash screen
  }

  return <Redirect href={authed ? "/(tabs)" : "/(auth)/login"} />;
}
