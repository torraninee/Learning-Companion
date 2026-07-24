//imports
"use client";

//load saved users
const users: User[] = JSON.parse(localStorage.getitem("users") || "[]");

import Link from "next/link";
import { FormEvent, useState } from "react";
import {useRouter} from "next/navigation";

//roles
type Role = "k5" | "612" | "parent";
type User = {
    id: number;
    name: string;
    email: string;
    username: string;
    password: string;
    role: Role;
    hasADHD: boolean;
    surveycompleted: boolean;
};

export default function SignupPage() {
    //navigation functions
    const router = useRouter();
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState<"" | "error" | "success">("");
    function showMessage(text: string, type: "error" | "success") {
        setMessage(text);
        setMessageType(type)
    };

    function handleSignup(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const form = event.currentTarget;
        //collect form data
        const formData = new FormData(form);
        //reading inputs
        const name = formData.get("name")?.toString().trim() ?? "";
        const email = formData.get("email")?.toString().trim() ?? "";
        const username = formData.get("username")?.toString().trim() ?? "";
        const password = formData.get("password")?.toString() ?? "";
        const confirmpassword = formData.get("confirmPassword")?.toString() ?? "";
        const rolevalue = formData.get("role")?.toString() ?? "";

        if (rolevalue === "k5" || rolevalue === "612" || rolevalue === "parent") {
            showMessage("Please select a valid role.", "error")
        }

        if(name==="" || email==="" || username==="" || password==="" || confirmpassword==="" || rolevalue===""){
            showMessage("Please fill in every field.", "error");
            return;
        }

        const role = rolevalue as Role;

        if (username.length < 6 || password.length < 6) {
            showMessage("Your username and password must contain at least 6 characters.", "error")
            return;
        }

        if (password !== confirmpassword) {
            showMessage("The passwords do not match. Please re-enter your password.", "error")
            return;
        }

        //check username already exists
        const usernameAlreadyExists = users.some((user) => {
            return user.username === username;
        });

        if (usernameAlreadyExists) {
            showMessage("An account with this username already exists.", "error");
            return;
        }

        //check if email already exists 
        const emailAlreadyExists = users.some((user) => {
            if(user.role === role) {
                return user.email === email;
        }})

        if (emailAlreadyExists) {
            showMessage("An account with this email already exists", "error");
            return;
        }

        //creates new user
        const newUser: User = {
            id: Date.now(),
            name: name,
            email: email,
            username: username,
            password: password,
            role: role,
            hasADHD: false,
            surveycompleted: false,
        }

        //save user
        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users))

        form.reset()

        showMessage("Account created!", "success");
    };

    //show HTML form
    return ( 
        <main>
        <div className="authentication">
            <h1>Create an Account</h1>

            <p className="subtitle">
            Sign up to start using ADHD Learning Companion
            </p>

            <form id="signup-form" onSubmit={handleSignup}>
            <label htmlFor="signup-name">Name</label>
            <input
                type="text"
                id="signup-name"
                placeholder="Enter your name"
                required
            />

            <label htmlFor="signup-email">Email</label>
            <input
                type="email"
                id="signup-email"
                placeholder="Enter your email"
                required
            />

            <label htmlFor="signup-username">Username</label>
            <input
                type="text"
                id="signup-username"
                placeholder="Enter your username (minimum 6 letters)"
                minLength={6}
                required
            />

            <label htmlFor="signup-password">Password</label>
            <input
                type="password"
                id="signup-password"
                placeholder="Create a password (minimum 6 letters)"
                minLength={6}
                required
            />

            <label htmlFor="confirm-password">Confirm Password</label>
            <input
                type="password"
                id="confirm-password"
                placeholder="Enter your password again"
                minLength={6}
                required
            />

            <label htmlFor="role">I am a:</label>

            <select id="role" defaultValue="" required>
                <option value="" disabled>
                Select your role
                </option>

                <option value="k5">
                Kindergarten-Grade 5 Student
                </option>

                <option value="612">
                Grade 6-12 Student
                </option>

                <option value="parent">
                Kindergarten-Grade 5 Parent
                </option>
            </select>

            <button type="submit">Create Account</button>
            </form>

            <p id="signup-message" className="error">{message}</p>
            <p className="success">{message}</p>

            <p className="switch-page">
            Already have an account?{" "}
            <Link href="/login">Log in</Link>
            </p>
        </div>
        </main> 
    )
}
