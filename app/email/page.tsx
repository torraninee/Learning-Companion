"use client"

import { useState } from "react";

export default function emailPage() {
    const [schoolSubject, setSchoolSubject] = useState("");
    const [helpDetails, setHelpDetails] = useState("");
    const [additionalDetails, setAdditionalDetails] = useState("");
    const [emailReason, setEmailReason] = useState("help");
    const [otherReason, setOtherReason] = useState("");
    const [emailDraft, setEmailDraft] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [copiedMessage, setCopiedMessage] = useState("");
    const [teacherName, setTeacherName] = useState("");
    const [studentName, setStudentName] = useState("");
    async function emailRoute() {
        if (!schoolSubject || !helpDetails) {
            setErrorMessage("Please fill in the subject and task details.");
            return;
        }
        const response = await fetch("/api/email", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({schoolSubject, helpDetails, additionalDetails, emailReason, otherReason})});
        const data = await response.json();

        const privateEmailDraft = data.message.replaceAll("[Teacher Name]", teacherName).replaceAll("[Student Name]", studentName);
        setEmailDraft(privateEmailDraft);
    }    
        return(
            <main>
                <input type="text" placeholder="Subject" value={schoolSubject} onChange={(event) => setSchoolSubject(event.target.value)} required/>
                <textarea placeholder="Task" value={helpDetails} onChange={(event) => setHelpDetails(event.target.value)} required/>
                <textarea  placeholder="Additional Details" value={additionalDetails} onChange={(event) => setAdditionalDetails(event.target.value)}/>
                <select value={emailReason} onChange={(event) => setEmailReason(event.target.value)} required>
                    <option value="" disabled>Choose an email reason</option>
                    <option value="help-understanding">Ask for help understanding work</option>
                    <option value="extension">Request an extension</option>
                    <option value="make-up">Ask about making up work</option>
                    <option value="meeting">Request a meeting</option>
                    <option value="other">Other</option>
                </select>
                {emailReason === "other" && (
                    <textarea placeholder="Email reason" value={otherReason} onChange={(event) => setOtherReason(event.target.value)} required/>
                )}
                <input type="text" placeholder="Teacher's name" value={teacherName} onChange={(event) => setTeacherName(event.target.value)}/>
                <input type="text" placeholder="Your name" value={studentName} onChange={(event) => setStudentName(event.target.value)}/>
                <button onClick={emailRoute}>Generate Email</button>

                {errorMessage && <p>{errorMessage}</p>}

                {emailDraft && (
                    <section>
                        <h2>Your Email Draft</h2>
                        <p style={{whiteSpace: "pre-wrap"}}>{emailDraft}</p>
                        <button onClick={() => {
                            navigator.clipboard.writeText(emailDraft);
                            setCopiedMessage("Email copied!");

                            setTimeout(() =>
                                setCopiedMessage("")
                            , 2000)
                        }}>Copy Email</button>
                    </section>
                )}
                {copiedMessage && (
                    <div className="copy-toast">
                        {copiedMessage}
                    </div>
                )}
            </main>
        )
}