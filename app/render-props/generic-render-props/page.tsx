"use client";

import { type ContainerProps } from "@/types/Container";
import { useCallback, useState } from "react";

interface User {
  name: string;
  age: number;
}

interface RenderParameters {
  user: User;
  handleSubmit: VoidFunction;
  clearForm: VoidFunction;
}

interface Props {
  visibility: "visible" | "none";
}

function Container({ render, visibility }: ContainerProps<RenderParameters, Props>) {
  const [user, setUser] = useState<User>({
    age: 25,
    name: "Mahdiyar",
  });

  const handleSubmit = useCallback(() => {
    console.log("Form submitted.");
  }, []);

  const clearForm = useCallback(() => {
    setUser({
      age: 0,
      name: "",
    });
  }, []);

  if (visibility === "none") return null;

  return render({ user, handleSubmit, clearForm });
}

export default function Presentation(containerProps: Props) {
  return (
    <Container
      {...containerProps}
      render={({ clearForm, handleSubmit, user: { age, name } }) => (
        <div>
          <h1>user name: {name}</h1>
          <h2>age: {age}</h2>
          <div className="flex gap-x-3">
            <button onClick={handleSubmit}>submit</button>
            <button onClick={clearForm}>clear</button>
          </div>
        </div>
      )}
    />
  );
}
