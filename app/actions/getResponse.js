import OpenAI from "openai";

//const openai = new OpenAI({apiKey: ''});

export default async function getResponse(msgs,bot) {

    try {

        const messages = msgs.reverse().map(([role,content])=>({role,content}))
        const completion = await openai.chat.completions.create({
            model:'gpt-3.5-turbo',
            messages: [
                {
                    role: "system",
                    content: bot.prompt,
                },
                
                ...messages
            ]
        })

        const response = completion.choices[0].message.content

        const msg={
            _id: completion.id,
            createdAt: Date.now(),
            text: completion.choices[0].message.content,
            user: {
              _id: bot.id,
              name: bot.name,
              avatar: bot.avatar
            }
        }

        return msg
        
    } catch (error) {
        console.error(error)
    }
}