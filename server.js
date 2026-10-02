// const express=require("express");
// const {ai,MODEL}=require("./lib/gemini");

// const app=express();
// app.use(express.static("public"));


// app.get("/stream",async (req,res)=>{
//     const question= req.query.q;
//     if(!question)
//     {
//         return res.status(400).send("Missing q=?");
//     }

//     res.setHeader("Content-Type","text/event-stream");
//     res.setHeader("Cache-Control", "no-cache");
//     res.flushHeaders();

//     try {
//         const stream= await ai.interactions.create({
//             input:question,
//             model:MODEL,
//             stream:true
//         });
//         for await(const result of stream)
//         {
//             if(result.event_type==="step.delta" && result.delta.type==="text")
//             {
//                 res.write(`data: ${JSON.stringify(result.delta.text)}\n\n`);
//             }
//         }

//         res.write("event: done\ndata:end\n\n");
//     } catch (error) {
//         console.error(error.message);
//         res.write(`event:failed\ndata: ${JSON.stringify(error.message)}\n\n`);
//     }

//     res.end();
// });

// app.listen(3000,()=>{
//     console.log("server has been started on port 3000....");
// });

const express= require("express");
const {ai,MODEL}=require("./lib/gemini");
const { tr } = require("zod/v4/locales");

const app=express();
app.use(express.static("public"));

app.get("/stream",async(req,res)=>{
    const question= req.query.q;
    if(!question)
    {
        return res.status(400).json({
            message:"Missing q=?"
        });
    }

    res.setHeader("Content-Type","text/event-stream");
    res.setHeader("Cache-Control","no-cahce");
    res.flushHeaders();

    try {
        const stream= await ai.interactions.create({
            input:question,
            model:MODEL,
            stream:true
        });
        for await(const result of stream)
        {
            if(result.event_type==="step.delta" && result.delta.type==="text")
            {
                res.write(`data: ${JSON.stringify(result.delta.text)}\n\n`);
            }
        }
        res.write(`event:done\ndata:end\n\n`);
    } catch (error) {
        console.error(error.message);
        res.write(`event:failed\ndata:${JSON.stringify(error.message)}\n\n`);
    }
    res.end();
});

app.listen(3000,()=>{
    console.log("server has been started on port 3000...");
});
