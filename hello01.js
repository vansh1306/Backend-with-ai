const {z}=require("zod");
const {ai,MODEL}=require("./lib/gemini");

const structure= z.object({
    context:z.enum(["query","complaint","game","other"]),
    priority:z.enum(["low","medium","high"]),
    summary:z.string().describe("describe what happened shortly"),
    measures:z.string().describe("tell what is the solution which is simply aligning with the context")
});

async function getResponse()
{
    const input="Extract the things from this prompt: "+ 
    "I have an issue i bought a game from your store and its not compatible with my console do something rn i raised a complaint weeks ago"
        const response=await ai.interactions.create({
            input,
            model:MODEL,
            response_format:{
                type:"text",
                mime_type:"application/json",
                schema:z.toJSONSchema(structure)
            }
        });
        console.log(JSON.parse(response.output_text));
}
getResponse();