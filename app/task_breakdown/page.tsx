"use client";
import { FormEvent, useState } from "react";

export default function taskBreakdown() {
    const [assignment, setAssignment] = useState("");
    const [steps, setSteps] = useState<string[]>([]);
    const [detailLevel, setDetailLevel] = useState("");
    const [daysDue, setDaysDue] = useState("");
    const [instructions, setInstructions] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    async function handleBreakdown(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
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
        const stepsList = data.steps.split("\n").map((step: string) => step.replace(/^\d+[.)]\s*/, "")).filter((step: string) => step!== "")

        setSteps(stepsList)

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
                    <option value="extension">Medium steps</option>
                    <option value="make-up">Detailed steps</option>
                </select>
                <label htmlFor="days-due">Enter the number of days until the task is due</label>
                <input id="days-due" value={daysDue} onChange={(event) => setDaysDue(event.target.value)} required/>
                <button type="submit">Break into steps</button>
            </form>

            {errorMessage && <p>{errorMessage}</p>}

            {steps.length > 0 && (
                <section>
                    <h2>Your Task Breakdown</h2>
                        {steps.map((step, index) => (
                            <li key={index}>{step}</li>
                        ))}
                    </section>
                )}
        </main>
    )
}
