const {ai,MODEL}=require("./lib/gemini");

async function response()
{
    const response=await ai.interactions.create({
        input:"Hello dude how are you doing?",
        model:MODEL
    });
    console.log(response.output_text);
}

response();