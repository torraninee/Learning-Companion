import Link from "next/link"

export default function confirmPage() {
    return (
        <main>
            <h1>Email Confirmed! ✅</h1>
            <p>Your account is ready to use! You can now log in.</p>
            <Link href="/login">Log In</Link>
        </main>
    )
}