export async function POST(request: Request) {
    const information = await request.json()
    const apiKey = process.env.OPENROUTER_API_KEY
    const openRouterResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", 
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "nvidia/nemotron-3-super-120b-a12b:free",
                messages: [
                    {
                        role: "user",
                        content: `You are a kind, supportive study helper for students, including students with ADHD.
                                Assignment:
                                ${information.assignment}
                                Create a realistic, low-stress plan that helps the student finish this assignment in ${information.daysDue} day(s).
                                Step-detail preference: ${information.detailLevel}
                                Instructions: ${information.instructions}
                                Rules:
                                - Write all task breakdowns using the instructions, if provided.
                                - Return ONLY numbered steps. Do not add a title, introduction, conclusion.
                                - Put one step on each line.
                                - Start with checking or reading the assignment directions/rubric when provided in: .
                                - Put the steps in the order the student should complete them.
                                - Clearly label which day each step belongs to by having a list of tasks under each day."
                                - Give the student at least one realistic task for each of the ${information.daysDue} days.
                                - Spread the work across the days. Do not put everything on the first day or leave all important work for the final day.
                                - Make the final day include checking the work, fixing anything needed, and submitting it if appropriate.
                                - Use calm, encouraging, simple wording. Do not use overwhelming language. Give a motivation message at the end.

                                For the detail level:
                                - If the preference is "short steps", make each step short, simple, and easy to start.
                                - If the preference is "detailed steps", break larger tasks into very specific actions. Include helpful details such as what to gather, write, review, or check.

                                Do not make up assignment requirements that were not provided. If (detailed) information is missing,  make a reasonable breakdown and inform user that the breakdown might not be detailed due to lacking details.`,
                    }
                ]
            })
        }
    );
    //response
    const openRouterData = await openRouterResponse.json();
    return Response.json({
        steps: openRouterData.choices[0].message.content
        
})
}