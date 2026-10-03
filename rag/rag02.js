const {ai,MODEL}=require("../lib/gemini");

const policy = [
  "Any game purchased from store can be refunded only if the playtime is less than 2hours.",
  "If console doesnt support the game then it can be exchanged within 30 days of purchase.",
  "Customer support replies to the issues within 48 hours."
];

function search(question) {
  const words = question
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ") 
    .split(/\s+/)
    .filter((word) => word.length > 3);

  return policy.filter((doc) =>
    words.some((word) => doc.toLowerCase().includes(word))
  );
}

async function ask(question)
{
  const found= search(question);

  console.log("QUESTION: ",question);
  console.log(`Retrived ${found.length} of ${policy.length} policies`);
  found.forEach((doc) => console.log("   -", doc));

  const prompt="You are a customer support assistant.\n" +
        "You have to give answers based on the below policies only, no assumptions.\n" +
        "If you dont know the answer simply say i dont know.\n\n" +
        "Here's the below policies:\n" + found.join("\n") +
        "\n\n Question: "+ question


  const response= await ai.interactions.create({
    input:prompt,
    model:MODEL
  });
  
  console.log(response.output_text);
}

async function main()
{
  await ask("I bought gta 6 from your store it not compatible with my playstation can i get a refund");
  console.log("\nDONE\n");

  await ask("I recently bought a game from your store i am not liking it can i exchange it i played that for 5 hours");
  console.log("\nDONE\n");

  await ask("I raised a request and didnt got any replies 1 day passed? what shall i do");
  console.log("\nDONE\n");
}

main().catch((error)=>{
  console.error(error.message);
});