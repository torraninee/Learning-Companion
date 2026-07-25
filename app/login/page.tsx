//imports
"use client";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase"

type Role = "612" | "parent-k5";

type Profile = {
    role: Role,
}

export default function LoginPage() {
    //basic functions
    const router = useRouter();
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState<"" | "error" | "success">("");
    function showMessage(text: string, type: "error" | "success") {
        setMessage(text);
        setMessageType(type)
    }
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleLogin(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        setMessage("");
        setMessageType("");
        setIsSubmitting(true);

        const form = event.currentTarget;
        //collect form data
        const formData = new FormData(form);
    
        //reading inputs
        const email = formData.get("email")?.toString().trim() ?? "";
        const password = formData.get("password")?.toString() ?? "";

        //check if requirements met
         if(email==="" || password===""){
            showMessage("Please fill in every field.", "error");
            setIsSubmitting(false);
            return;
        }

        if (email.length < 6) {
            showMessage("Your email must contain at least 6 characters.", "error");
            setIsSubmitting(false);
            return;
        }

        if (password.length < 6) {
            showMessage("Your password must contain at least 6 characters.", "error");
            setIsSubmitting(false);
            return;
        }

        const { data: loginData, error: loginError, } = await supabase.auth.signInWithPassword({email, password});

        if(loginError) {
            showMessage("The email or password is incorrect.", "error");
            setIsSubmitting(false)
            return;
        }

        const loggedInUser = loginData.user;

        if(!loggedInUser) {
            showMessage("Login was unsuccessful. Please try again.", "error")
            setIsSubmitting(false);
            return;
        }

        const { data: profileData, error: profileError, } = await supabase
            .from("profiles").select("role").eq("id", loggedInUser.id).single<Profile>();

        if(profileError || !profileData) {
            showMessage("You logged in, but your profile could not be found.", "error");
            setIsSubmitting(false);
            return;
        };

        showMessage("Login successful!", "success");

        if(profileData.role === "parent-k5") {
            router.push("/parent-k5-dashboard");
        } else if (profileData.role === "612") {
            router.push("/612-dashboard");
        } else {
            showMessage("Your account does not have a valid role.", "error");
            setIsSubmitting(false);
            return;
        }
    }
    return(
        <main>
            <Link href="/">Back to Home</Link>
            <div className="login-container">
                <h1>Welcome Back!</h1>
                <p>Login to continue to XXX</p>
                <form id="login-form" onSubmit={handleLogin}>
                    <label htmlFor="login-email">Email</label>
                    <input
                        type="email"
                        id="login-email"
                        name="email"
                        placeholder="Enter your email"
                        required
                    />

                    <label htmlFor="login-password">Password</label>
                    <input
                        type="password"
                        id="login-password"
                        name="password"
                        placeholder="Enter your password"
                        required
                    />

                    <button type="submit" disabled={isSubmitting}>{isSubmitting ? "Logging In..." : "Log In"}</button>
                </form>
                {message !== "" && (
                    <p id="login=message" className={messageType}>{message}</p>
                )};
                <p className="signup-text">Don&apos;t have an account? {" "} <Link href="/signup">Sign up!</Link>
                </p>
            </div>
        </main>
    )
    }