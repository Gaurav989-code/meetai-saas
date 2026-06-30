"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { authClient } from "@/lib/auth-client"; //import the auth client

export default function Home() {
  const { data: session } = authClient.useSession();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = () => {
    authClient.signUp.email(
      {
        email, // user email address
        password, // user password -> min 8 characters by default
        name, // user display nameF
      },
      {
        onSuccess: (ctx) => {
          //redirect to the dashboard or sign in page
          window.alert("success");
        },
        onError: (ctx) => {
          // display the error message
          window.alert("something went wrong");
        },
      },
    );
  };
  
  const onLogIn = () => {
    authClient.signIn.email(
      {
        email, // user email address
        password, // user password -> min 8 characters by default
      },
      {
        onSuccess: (ctx) => {
          //redirect to the dashboard or sign in page
          window.alert("success");
        },
        onError: (ctx) => {
          // display the error message
          window.alert("something went wrong");
        },
      },
    );
  };

  if (session) {
    return (
      <div className="p-4 flex flex-col gap-y-4">
        <p>Logged in as {session.user.name}</p>
        <Button onClick={() => authClient.signOut()}>Sign-Out</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-10">

    
    <div className="p-4 flex flex-col gap-4">
      <Input
        placeholder="name..."
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Input
        placeholder="email..."
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        placeholder="password..."
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button onClick={onSubmit}>Create user</Button>
    </div>

    <div className="p-4 flex flex-col gap-4">
      <Input
        placeholder="email..."
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        placeholder="password..."
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button onClick={onLogIn}>Log-In</Button>
    </div>

    </div>
  );
}
