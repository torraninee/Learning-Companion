//imports
"use client";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

//load saved users
const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");
const currentUser: User | null = JSON.parse(localStorage.getItem("currentuser") || "null")

export const metadata = {title: "Login",}

type Role = "k5" | "612" | "parent";
type User = {
    id: number;
    name: string;
    email: string;
    username: string;
    password: string;
    role: Role;
    hasADHD: boolean,
    surveycompleted: boolean;
};

export default function LoginPage() {
    //basic functions
    const router = useRouter();
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState<"" | "error" | "success">("");
    function showMessage(text: string, type: "error" | "success") {
        setMessage(text);
        setMessageType(type)
    }

    function handleLogin(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const form = event.currentTarget;
        //collect form data
        const formData = new FormData(form);
    

        //reading inputs
        const username = formData.get("username")?.toString().trim() ?? "";
        const password = formData.get("password")?.toString() ?? "";

        //check if requirements met
         if(username==="" || password===""){
            showMessage("Please fill in every field.", "error");
            return;
        }

        if (username.length < 6) {
            showMessage("Your username and password must contain at least 6 characters.", "error")
            return;
        }

        //save data
        const accountExists = users.find((user) => {
             if(user.username === username && user.password === password) {
                return user;
             }
        })

        if(accountExists) {
            localStorage.setItem("currentuser", JSON.stringify(accountExists))
            if(accountExists.role === "k5") {
                router.push("/k5-dashboard")
            } else if(accountExists.role === "612") {
                router.push("/612-dashboard")
            } else if(accountExists.role === "parent") {
                router.push("/parent-dashboard")
            }
        } 
        else {
            showMessage("An account with your username and password does not exist. Please check to see if you have the correct details, or create an account.", "error")
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
                        placeholder="Enter your email"
                        required
                    />

                    <label htmlFor="login-password">Password</label>
                    <input
                        type="password"
                        id="login-password"
                        placeholder="Enter your password"
                        required
                    />

                    <button type="submit">Log In</button>
                </form>
                <p id="login=message" className="error"></p>
                <p className="signup-text">Don&apos;t have an account? {" "} <Link href="/signup">Sign up!</Link>
                </p>
            </div>
        </main>
    )
    }