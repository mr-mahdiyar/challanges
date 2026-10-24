"use client";

import { useCheckEquality } from "@/hooks/useAreAllEqual";
import { useState } from "react";

export default function Page() {
  
  const [name, setName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");

  const areEqual = useCheckEquality(name, lastName);

  return (
    <div>
      <input type="text" className="border border-white m-6" value={name} onChange={(e) => setName(e.target.value)} />
      <input type="text" className="border border-white m-6" value={lastName} onChange={(e) => setLastName(e.target.value)} />
      <h1 className={`${areEqual ? "text-green-500" : "text-red-500"}`}>{areEqual ? "Equal" : "Different"}</h1>
    </div>
  );
}
