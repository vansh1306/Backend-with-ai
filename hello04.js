const {ai,MODEL}=require("./lib/gemini");

async function main()
{
    const stream=await ai.interactions.create({
        input:"Explain kafka in about 150 words.",
        model:MODEL,
        stream:true
    });
    for await(const result of stream)
    {
        if(result.event_type==="step.delta" && result.delta.type==="text")
        {
            process.stdout.write(result.delta.text);
        }
    }
    console.log("\n \n [DONE]");
}

main().catch((error)=>{
    console.error(error.message);
});
