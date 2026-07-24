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
                model: "llama-3.3-70b-versatile",
                messages: [
                    {
                        role: "user",
                        content: `Write a short, polite email from a student to a teacher.
                                Write the subject of the letter with details about ${information.schoolSubject} and ${information.helpDetails} and their request.
                                What the student needs help with: ${information.helpDetails}
                                Additional details regarding what the student needs help with: ${information.additionalDetails}
                                What the student specifically wants: ${information.emailReason}. If it is "other", the reason is ${information.otherReason}.
                                Do not add details if you do not know they are true in the subject and the body of the email.
                                
                                Use [Teacher Name] and [Student Name] as placeholders. Include an email subject line and the email body.`
                    }
                ]
            })
        }
    );
    //response
    const openRouterData = await openRouterResponse.json();
    return Response.json({
        message: openRouterData.choices[0].message.content
        
})
}