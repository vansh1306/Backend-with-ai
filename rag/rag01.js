const {ai,MODEL}=require("../lib/gemini");

const policy=["Any game purchased from store can be refunded only if the playtime if less than 2hours.",
              "If console doesnt support the game then it can be exchanged within 30 days of purchase.",
              "Customer support replies to the issues within 48 hours."]


const question= "I bought gta 6 from your store and my playstation isn't supporting it can i exchange it"

async function ask(prompt)
{
  const response= await ai.interactions.create({
    input:prompt,
    model:MODEL
  });
  console.log(response.output_text);
}

async function main()
{
  console.log("------------WITHOUT KNOWING POLICY-----------------");

  await ask(question);
  console.log("\nDONE\n");


  const prompt= "You are a customer support assistant.\n"+
  "You have to give answers based on the below policies only no assumptions\n"+
  "If you dont know the answer simply say i dont know no other logics or reasonings\n\n"+
  "Here's the below poicies:\n"+ policy.join("\n")+
  "\n\nQuestion: "+ question;

  console.log("------------------KNOWING POLICY-----------------------");

  await ask(prompt);
  console.log("\nDONE\n");
}

main().catch((error)=>{
  console.error(error.message);
});

