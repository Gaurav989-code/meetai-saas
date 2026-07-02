"use client";

import * as React from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { authClient } from "@/lib/auth-client";

import { OctagonAlertIcon } from "lucide-react";
import { FaGithub, FaGoogle } from "react-icons/fa";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

// 1. Updated Schema for Email and Password
const formSchema = z
  .object({
    name: z.string().min(1, "Name is required."),
    email: z
      .string()
      .min(1, "Email is required.")
      .email("Please enter a valid email address."),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .max(50, "Password must be at most 50 characters."),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .max(50, "Password must be at most 50 characters."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "password don't match",
    path: ["confirmPassword"],
  });

const SignUpView = () => {
  const router = useRouter();
  const [error, setError] = React.useState<string | null>(null);
  const [pending, setPending] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setError(null);
    setPending(true);

    const authData = await authClient.signUp.email(
      {
        name: data.name,
        email: data.email,
        password: data.password,
        callbackURL: "/",
      },
      {
        onSuccess: () => {
          setPending(false);
          router.push("/");
        },
        onError: ({ error }) => {
          setPending(false);
          setError(error.message);
        },
      },
    );
    // console.log(authData.error);
  };

  const onSocial = (provider: "github" | "google") => {
    setError(null);
    setPending(true);

    authClient.signIn.social(
      {
        provider: provider,
        callbackURL: "/",
      },
      {
        onSuccess: () => {
          setPending(false);
        },
        onError: ({ error }) => {
          setPending(false);
          setError(error.message);
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2 ">
          <form id="auth-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className="flex flex-col gap-6 p-2">
              <CardHeader className="flex flex-col items-center text-center">
                <CardTitle className="text-2xl font-bold">
                  Let&apos;s get started
                </CardTitle>
                <CardDescription className="text-muted-foreground text-balance">
                  Create your account.
                </CardDescription>
              </CardHeader>

              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className="grid gap-3"
                  >
                    <FieldLabel htmlFor="auth-email">Name</FieldLabel>
                    <Input
                      {...field}
                      id="auth-name"
                      type="text"
                      aria-invalid={fieldState.invalid}
                      placeholder="john doe"
                      autoComplete="name"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Email Field Component */}
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className="grid gap-3"
                  >
                    <FieldLabel htmlFor="auth-email">Email Address</FieldLabel>
                    <Input
                      {...field}
                      id="auth-email"
                      type="email"
                      aria-invalid={fieldState.invalid}
                      placeholder="m@example.com"
                      autoComplete="email"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Password Field Component */}
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="auth-password">Password</FieldLabel>
                    <Input
                      {...field}
                      id="auth-password"
                      type="password"
                      aria-invalid={fieldState.invalid}
                      placeholder="••••••••"
                      autoComplete="current-password"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* confirm password */}
              <Controller
                name="confirmPassword"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="auth-confirmPassword">
                      Confirm Password
                    </FieldLabel>
                    <Input
                      {...field}
                      id="auth-confirmPassword"
                      type="password"
                      aria-invalid={fieldState.invalid}
                      placeholder="••••••••"
                      autoComplete="current-password"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {!!error && (
                <Alert className="bg-destructive/10 border-none">
                  <OctagonAlertIcon className="h-4 w-4 text-destructive!" />
                  <AlertTitle>{error}</AlertTitle>
                </Alert>
              )}

              <Field
                orientation="horizontal"
                className="w-full justify-end gap-2"
              >
                {/* <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                >
                  Clear
                </Button> */}
                <Button
                  disabled={pending}
                  type="submit"
                  form="auth-form"
                  className="w-full"
                >
                  Sign In
                </Button>
              </Field>

              <CardFooter>
                <Field>
                  <div
                    className="after:border-border relative text-sm text-center after:absolute after:inset-0 
                after:top-1/2 after:z-0 after:flex after:items-center after:border-t "
                  >
                    <span className="bg-card text-muted-foreground relative z-10 px-2">
                      Or continue with
                    </span>
                  </div>
                  <Field
                    orientation="horizontal"
                    className="w-full justify-center gap-6"
                  >
                    <Button
                      onClick={() => onSocial("google")}
                      disabled={pending}
                      type="button"
                      variant="outline"
                      className="w-1/2"
                    >
                      <FaGoogle />
                    </Button>
                    <Button
                      onClick={() => onSocial("github")}
                      disabled={pending}
                      type="button"
                      variant="outline"
                      className="w-1/2"
                    >
                      <FaGithub />
                    </Button>
                  </Field>
                  <div className=" text-center text-sm">
                    Already have account? {"  "}
                    <Link
                      href="/sign-in"
                      className="underline underline-offset-4"
                    >
                      {" "}
                      Sign in
                    </Link>
                  </div>
                </Field>
              </CardFooter>
            </FieldGroup>
          </form>

          <div className="bg-radial from-sidebar-accent to-sidebar relative hidden md:flex flex-col gap-y-4 items-center justify-center ">
            <img src="/logo.svg" alt="Image" className="h-23 w-23 " />
            <p className="text-2xl font-bold text-white">Meet.AI</p>
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a>Privacy Policy</a>
      </div>
    </div>
  );
};

export default SignUpView;
