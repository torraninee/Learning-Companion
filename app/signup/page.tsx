//imports
"use client";


import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { FormEvent, useState } from "react";
import {useRouter} from "next/navigation";

//roles
type Role = "k5" | "612" | "parent";

export default function SignupPage() {
    //navigation functions
    const router = useRouter();
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState<"" | "error" | "success">("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    function showMessage(text: string, type: "error" | "success") {
        setMessage(text);
        setMessageType(type)
    };

    async function handleSignup(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        setMessage("");
        setMessageType("");
        setIsSubmitting(true);

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

        if(name==="" || email==="" || username==="" || password==="" || confirmpassword==="" || rolevalue===""){
            showMessage("Please fill in every field.", "error");
            setIsSubmitting(false);
            return;
        }

        if (rolevalue === "k5" || rolevalue === "612" || rolevalue === "parent") {
            showMessage("Please select a valid role.", "error");
            setIsSubmitting(false);
            return;
        }

        const role = rolevalue as Role;

        if (username.length < 6) {
            showMessage("Your username and password must contain at least 6 characters.", "error")
            setIsSubmitting(false);
            return;
        }

        if (password.length < 6) {
            showMessage("Your username and password must contain at least 6 characters.", "error")
            setIsSubmitting(false);
            return;
        }

        if (password !== confirmpassword) {
            showMessage("The passwords do not match. Please re-enter your password.", "error")
            setIsSubmitting(false);
            return;
        }

        const { data: signupData, error: signupError } = await supabase.auth.signUp({
            email: email,
            password: password,
        })

        if(signupError) {
            showMessage(signupError.message, "error");
            setIsSubmitting(false);
            return;
        }

        const newAuthUser = signupData.user;

        if(!newAuthUser) {
            showMessage("The account could not be created. Please try again.", "error");
            setIsSubmitting(false);
            return;
        }

        const { error: profileError } = await supabase.from("profiles").insert({
            id: newAuthUser.id,
            name, 
            username,
            role, 
            survey_completed: false,
        })

        if (profileError) {
            console.error("Profile error:", profileError);
            if(profileError.message.toLowerCase().includes("username")) {
                showMessage("An account with this username already exists.", "error")
                setIsSubmitting(false);
                return;
            } else {
                showMessage(`Your login was created, but your profile could not be saved: ${profileError.message}`, "error")
                setIsSubmitting(false);
                return;
            };
        }

        form.reset();

        showMessage("Account created!", "success");

        setIsSubmitting(false);

        setTimeout(() => {
            router.push("/login")
        }, 1500);
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
                name="name"
                placeholder="Enter your name"
                required
            />

            <label htmlFor="signup-email">Email</label>
            <input
                type="email"
                id="signup-email"
                name="email"
                placeholder="Enter your email"
                required
            />

            <label htmlFor="signup-username">Username</label>
            <input
                type="text"
                id="signup-username"
                name="username"
                placeholder="Enter your username (minimum 6 letters)"
                minLength={6}
                required
            />

            <label htmlFor="signup-password">Password</label>
            <input
                type="password"
                id="signup-password"
                name="password"
                placeholder="Create a password (minimum 6 letters)"
                minLength={6}
                required
            />

            <label htmlFor="confirm-password">Confirm Password</label>
            <input
                type="password"
                id="confirm-password"
                name="confirmPassword"
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

            <button type="submit" disabled={isSubmitting}>{isSubmitting ? "Creating Account..." : "Create Account"}</button>
            </form>

            {message !== "" && (
                <p id="signup-message" className={messageType}>{message}</p>
            )}
            <p className="switch-page">
            Already have an account?{" "}
            <Link href="/login">Log in</Link>
            </p>
        </div>
        </main> 
    )
}
