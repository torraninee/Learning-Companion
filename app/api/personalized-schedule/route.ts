import { NextResponse } from "next/server"

export async function POST(request: Request) {
    const userInputs = await request.json();
    const pythonResponse = await fetch("http://127.0.0.1:8000/predict-timing", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userInputs),
    });

    const prediction = await pythonResponse.json();

    return NextResponse.json(prediction);
}