const {z}=require("zod");
const{ai,MODEL}=require("./lib/gemini");

const structure= z.object({
    context:z.enum(["query","complaint","game","other"]),
    priority:z.enum(["low","medium","high"]),
    summary:z.string().describe("describe what happened shortly"),
    measures:z.string().max(5).describe("tell what is the solution which is simply aligning with the context")
});

const response_format={
    type:"text",
    mime_type:"application/json",
    schema:z.toJSONSchema(structure)
}

async function getResponse()
{
    let input="Extract the things from this prompt: "+ 
    "I have an issue i bought a game from your store and its not compatible with my console do something rn i raised a complaint weeks ago"
    let previous_id;
    for(let count=1;count<=3;count++)
    {
        const response= await ai.interactions.create({
            input,
            model:MODEL,
            response_format,

            previous_interaction_id:previous_id
        })
        const result= structure.safeParse(JSON.parse(response.output_text));
        if(result.success)
        {
            console.log(`sucess on count:${count}`,result.data);
            return;
        }
        const error= z.prettifyError(result.error);
        console.log(`failed on count ${count} due to ${error}`);

        previous_id=response.id
        input=`Got incorrect JSON due to an error ${error} kindly fix this error properly`
    }
    console.log("Gave up after 3 counts");
}
getResponse().catch((error)=>{
    console.error(error.message);
});