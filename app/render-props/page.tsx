"use client";

import { JSX, useCallback, useState } from "react";

interface User {
  name: string;
  age: number;
}

interface Props {
  render: (props: { user: User; handleSubmit: VoidFunction; clearForm: VoidFunction }) => JSX.Element;
}

function Container({ render }: Props) {
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

  return render({ user, handleSubmit, clearForm });
}

export default function Presentation() {
  return (
    <Container
      render={(props) => (
        <div>
          <h1>user name: {props.user.name}</h1>
          <h2>age: {props.user.age}</h2>
          <div className="flex gap-x-3">
            <button onClick={props.handleSubmit}>submit</button>
            <button onClick={props.clearForm}>clear</button>
          </div>
        </div>
      )}
    />
  );
}
