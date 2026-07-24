"use client"

import { useState } from "react";

export default function personalizedSchedulePage() {
    const [prediction, setPrediction] = useState<number | null>(null);

    async function obtainPrediction() {
        const response = await fetch ("/api/personalized-schedule", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({})
        });

        const result = await response.json()

        setPrediction(result.predicted_minutes);
    }

    return (
        <main>
            <h1>Personalized Schedule Timing</h1>
            <button onClick={obtainPrediction}>Obtain Timing Prediction</button>

            {prediction !== null && (
                <p>Predicted minutes for the assignment: {prediction} minutes</p>
            )}
        </main>
    )
}