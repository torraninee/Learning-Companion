"use client";
import { FormEvent, useState } from "react";

export default function taskBreakdown() {
    const [assignment, setAssignment] = useState("");
    const [steps, setSteps] = useState("");
    const [detailLevel, setDetailLevel] = useState("");
    const [daysDue, setDaysDue] = useState("");
    const [instructions, setInstructions] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [formSubmitted, setFormSubmitted] = useState(false)

    async function handleBreakdown(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setFormSubmitted(true);
        if (!assignment || !daysDue) {
            setErrorMessage("Please fill in the subject and task details.");
            return;
        }

        const response = await fetch("/api/task-breakdown", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({assignment, detailLevel, daysDue, instructions}),
        });
        const data = await response.json()
        //.map removes number

        setSteps(data.steps)

    }
    return (
        <main>
            <form onSubmit={handleBreakdown}>
                <label htmlFor="assignment">Enter task</label>
                <textarea id="assignment" value={assignment} onChange={(event) => setAssignment(event.target.value)} placeholder="ie. Biology presentation" required/>
                <textarea value={instructions} onChange={(event) => setInstructions(event.target.value)} placeholder="Task Instructions - enter if detailed breakdown desired"/>
                <select value={detailLevel} onChange={(event) => setDetailLevel(event.target.value)} required>
                    <option value="" disabled>Choose a detailed level</option>
                    <option value="help-understanding">Short Steps</option>
                    <option value="extension">Medium Steps</option>
                    <option value="make-up">Detailed Steps</option>
                </select>
                <label htmlFor="days-due">Enter the number of days until the task is due</label>
                <input id="days-due" value={daysDue} onChange={(event) => setDaysDue(event.target.value)} required/>
                <button type="submit">Create my Plan</button>
            </form>

            {instructions === "" && formSubmitted && <p>The following breakdown may not be very exact due to lacking details.</p>}
            {errorMessage && <p>{errorMessage}</p>}

            {steps && (
                <div className="task-breakdown">
                    {steps.split("\n").map((line, index) => {
                        const trimmedLine = line.trim();

                        if (/^Day \d+:$/i.test(trimmedLine)) {
                            return <h3 key={index}>{trimmedLine}</h3>
                        }

                        if (trimmedLine==="") {
                            return "   ";
                        }

                        return <p key={index}>{trimmedLine}</p>
                    })}
                </div>
                )}
        </main>
    )
}
