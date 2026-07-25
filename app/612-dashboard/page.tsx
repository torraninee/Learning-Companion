"use client";

import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Calendar from "@/app/components/612/calendar"

export default function dashboardPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadUser() {
            const { data: { user },} = await supabase.auth.getUser();

        if (!user) {
            router.push("/login");
            return;
        }
        setLoading(false);
        }
        loadUser();
        }, [router]);
        
    if (loading) {
        return <p>Loading your data...</p>
    }

    async function handleLogout() {
        setIsSubmitting(true);
        const { error } = await supabase.auth.signOut();

        if(error) {
            console.error("Logout error:", error)
            setIsSubmitting(false)
            return;
        }
        setIsSubmitting(false)
        router.push("/")
    }

    return(
        <main>
            <h1>Grades 6-12 Student Dashboard: Welcome, XXX!</h1>
            <button type="button" onClick={handleLogout} disabled={isSubmitting}>{isSubmitting ? "Logging Out..." : "Log Out"}</button>

            <Calendar />
        </main>
    )

}