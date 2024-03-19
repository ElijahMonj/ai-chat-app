import OpenAI from "openai";

const openai = new OpenAI({apiKey: });

const mockBot = {
    _id: '1',
    name: 'React Native',
    avatar: 'https://reactnative.dev/img/tiny_logo.png',
}


export default async function getResponse(msgs) {
    const context="You are the most basic assistant";

    try {

        const messages = msgs.reverse().map(([role,content])=>({role,content}))
       

        const completion = await openai.chat.completions.create({
            model:'gpt-3.5-turbo',
            messages: [
                {
                    role: "system",
                    content: context,
                },
                
                ...messages
            ]
        })

        const response = completion.choices[0].message.content
        

        /* 
            response = {
            id
            text: ,
            createdAt: ,
            user: {
                _id: 'userid',
                name: 'Elijah monj',
                avatar: 'google photo',
            },
        */

        //update database history
        //update history for ai


        const msg={
            _id: completion.id,
            createdAt: Date.now(),
            text: completion.choices[0].message.content,
            user: {
              _id: mockBot._id,
              name: mockBot.name,
              avatar: mockBot.avatar
            }
        }

        return msg
        
    } catch (error) {
        console.error(error)
    }
}