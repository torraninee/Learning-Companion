"use client";

import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { useRouter } from "next/navigation";

const [isSubmitting, setIsSubmitting] = useState(false);

export default function dashboardPage() {
    const router = useRouter();

    async function handleLogout() {
        setIsSubmitting(true);
        const { error } = await supabase.auth.signOut();

        if(error) {
            console.error("Logout error:", error)
            setIsSubmitting(false)
            return;
        }
        setIsSubmitting(false)
        router.push("/main")
    }

    return(
        <main>
            <h1>Welcome</h1>
            <button type="button" onClick={handleLogout} disabled={isSubmitting}>{isSubmitting ? "Logging Out..." : "Log Out"}</button>
        </main>
    )
}