"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import AppLogo from "@/components/app-logo";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ENABLE_SOCIAL_LOGIN } from "@/lib/constants";

const formSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email" })
    .min(1, { message: "Email is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

const LoginForm = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    setErrorMessage(null);
    const response = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (response?.error === null) {
      router.push("/portal");
    } else {
      setErrorMessage("Login failed. Please try again.");
    }
  };

  const handleGoogleSignIn = async () => {
    const response = await signIn("google", { redirect: false });
    if (response?.error) {
      setErrorMessage("Google login failed. Please try again.");
      return;
    }
  };

  useEffect(() => {
    if (status === "authenticated" && session?.accessToken) {
      router.push("/portal");
    }
  }, [status, session, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="mb-4 flex flex-col items-center">
        <AppLogo size={100} />
        <p className="mt-2 text-lg font-semibold text-gray-600 dark:text-gray-300">
          Your Partner in Keeping Customers Happy and Requests On Track
        </p>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Show error message */}
          {errorMessage && (
            <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded">
              {errorMessage}
            </div>
          )}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold text-zinc-500 dark:text-white">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="email"
                        className="bg-slate-100 dark:bg-slate-300 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Enter email"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              ></FormField>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold text-zinc-500 dark:text-white">
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="current-password"
                        type="password"
                        className="bg-slate-100 dark:bg-slate-300 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Enter password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-row justify-items-center">
                <Button variant="link" className="py-0 h-auto">
                  <Link href="/forgot-password">Forgot password</Link>
                </Button>
              </div>
              <Button className="w-full">Sign In</Button>
            </form>
          </Form>

          {ENABLE_SOCIAL_LOGIN && (
            <>
              <div className="relative my-6">
                <Separator />
                <span className="absolute inset-0 flex justify-center -mt-3 text-sm bg-white dark:bg-gray-800 px-2 text-gray-500">
                  Or
                </span>
              </div>

              <div className="flex justify-center">
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center space-x-2"
                  onClick={handleGoogleSignIn}
                >
                  <img
                    src="/google-logo.svg"
                    alt="Google"
                    className="h-5 w-5"
                  />
                  <span>Sign In with Google</span>
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
