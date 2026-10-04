const { ai, MODEL } = require("../lib/gemini");

const EMBED_MODEL = "gemini-embedding-001";

// How many policies to put in the prompt. The dial.
// Try it: TOP_K=1 node rag04.js   or   TOP_K=3 node rag04.js
const TOP_K = Number(process.env.TOP_K || 2);

const policy = [
  "Any game purchased from store can be refunded only if the playtime is less than 2hours.",
  "If console doesnt support the game then it can be exchanged within 30 days of purchase.",
  "Customer support replies to the issues within 48 hours."
];

// ---- the two black boxes from rag03.js, unchanged ----
async function embed(texts) {
  const response = await ai.models.embedContent({
    model: EMBED_MODEL,
    contents: texts,
    config: { outputDimensionality: 768 }
  });
  return response.embeddings.map((e) => e.values);
}

function cosine(a, b) {
  let dot = 0, sizeA = 0, sizeB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    sizeA += a[i] * a[i];
    sizeB += b[i] * b[i];
  }
  return dot / (Math.sqrt(sizeA) * Math.sqrt(sizeB));
}
// ------------------------------------------------------

// This replaces search() from rag02.js.
// Same job: question in, relevant policies out. Different insides.
function retrieve(questionVector, policyVectors) {
  return policy
    .map((doc, i) => ({ doc, score: cosine(questionVector, policyVectors[i]) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, TOP_K); // <-- THE NEW LINE. cut the list.
}

async function ask(question, policyVectors) {
  // 1. turn the question into numbers
  const [questionVector] = await embed([question]);

  // 2. rank the policies and keep the best TOP_K
  const found = retrieve(questionVector, policyVectors);

  console.log("QUESTION:", question);
  console.log(`KEPT ${found.length} of ${policy.length}:`);
  found.forEach(({ doc, score }) => console.log("  ", score.toFixed(3), doc));

  // 3. same prompt as rag02.js -- but `found` is now scored objects,
  //    so we pull out just the text with .map before joining.
  const prompt =
    "You are a customer support assistant.\n" +
    "You have to give answers based on the below policies only, no assumptions.\n" +
    "If you dont know the answer simply say i dont know.\n\n" +
    "Here's the below policies:\n" +
    found.map((f) => f.doc).join("\n") +
    "\n\nQuestion: " +
    question;

  // 4. same call you have used since hello.js
  const response = await ai.interactions.create({ input: prompt, model: MODEL });
  console.log("ANSWER:", response.output_text, "\n");
}

async function main() {
  // The policies never change, so turn them into numbers ONCE.
  const policyVectors = await embed(policy);

  // The question that returned 0 of 3 in rag02.js
  await ask("My PS5 won't run the disc I just bought, what are my options?", policyVectors);

  // Your question -- the one where two policies nearly tied
  await ask(
    "I bought gta 6 from your store it not compatible with my playstation can i get a refund",
    policyVectors
  );
}

main().catch((error) => console.error(error.message));
