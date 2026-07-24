export async function POST(request: Request) {
    const information = await request.json()
    const apiKey = process.env.GROQ_API_KEY
    const openRouterResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", 
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "qwen/qwen3.6-27b",
                temperature: 0.1,
                reasoning_effort: "none",
                messages: [
                    {
                        role: "user",
                        content: `You are a calm, encouraging study-planning assistant for students, including students with ADHD.

                        CRITICAL: You MUST follow ALL instructions below exactly. Do not skip or ignore any requirements.

                        Make a realistic plan to complete the assignment over ${information.daysDue} day(s).

                        ASSIGNMENT DETAILS - MUST FOLLOW THESE EXACTLY:
                        Name: ${information.assignment}
                        Specific Instructions: ${information.instructions || "No additional instructions provided."}
                        
                        IMPORTANT: If specific assignment instructions are provided above, you MUST incorporate them into the task breakdown. Never ignore or override the given instructions.

                        DETAIL LEVEL RULES - STRICT:
                        ${information.detailLevel === "help-understanding" ? "- Keep tasks extremely brief, 6 words or fewer per task." : ""}
                        ${information.detailLevel === "extension" ? "- Keep tasks clear and concise, about 10–15 words per task." : ""}
                        ${information.detailLevel === "make-up" ? "- Break work into extremely specific, manageable actions, around 20 words or more for each step." : ""}

                        REQUIRED OUTPUT FORMAT - EXACT STRUCTURE:
                        Return ONLY the plan and an appropriate title - no introduction, notes, explanations, or Markdown code block.

                        Use exactly this structure:

                        Day 1:
                        1. Task for Day 1
                        2. Another task for Day 1

                        Day 2:
                        1. Task for Day 2
                        2. Another task for Day 2

                        FORMAT RULES - MUST FOLLOW:
                        - Put every Day heading on its own line: Day 1:, Day 2:, and so on.
                        - Put each task on its own new line below its Day heading.
                        - Restart task numbers at 1 each new day.
                        - Put one blank line between days.
                        - Do not use bullets, stars, tables, or bold text.
                        - Do not write anything before Day 1.
                        - Do not write anything after the final task.

                        PLAN RULES - STRICT REQUIREMENTS:
                        - Include at least one realistic task for every available day.
                        - Spread the work evenly across the days.
                        - Do not put all important work on the first or final day.
                        - Follow the provided assignment instructions EXACTLY when they exist.
                        - Never invent assignment requirements not specified.
                        - On the final day, include reviewing, fixing mistakes, and submitting if appropriate.
                        - Use calm, simple, encouraging wording throughout.

                        EMOJI AND MOTIVATION RULES - MANDATORY:
                        - You MUST include helpful emojis throughout the plan (but not in every single task).
                        - You MUST add multiple encouraging and motivational messages WITH exclamation marks spread throughout ALL days.
                        - Examples: "You've got this!", "Great progress!", "Almost there!", "You're doing amazing!", "Keep it up!"
                        - Place motivational messages after tasks or at the end of days.

                        If information is missing, make a general plan without pretending you know missing details.
                        `,
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