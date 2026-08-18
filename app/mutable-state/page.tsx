"use client";

import { useMutableState } from "@/hooks/useMutableState";
import { useEffect } from "react";

export default function MutableStatePage() {
  const [user, setUser] = useMutableState<{
    name: string;
    age: number;
    socials: {
      instagram: {
        id: string;
        email: string;
      };
      twitter: string;
    };
  }>({
    age: 0,
    name: "",
    socials: {
      instagram: { email: "", id: "" },
      twitter: "",
    },
  });

  if (!user.name) {
    setUser((user) => {
      user.name = "Ahmad";
      user.socials.instagram.id = "something";
    });
  }

  useEffect(() => {
    console.log(user);
    if (user.name === "Ahmad") {
      setUser((user) => {
        user.socials.twitter = "something";
      });
    }
  }, [user, setUser]);

  return <div></div>;
}
