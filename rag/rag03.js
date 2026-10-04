const { ai } = require("../lib/gemini");
const EMBED_MODEL = "gemini-embedding-001";

const policy = [
  "Any game purchased from store can be refunded only if the playtime is less than 2hours.",
  "If console doesnt support the game then it can be exchanged within 30 days of purchase.",
  "Customer support replies to the issues within 48 hours."
];

async function embed(texts) {
  const response = await ai.models.embedContent({
    model: EMBED_MODEL,
    contents: texts,
    config: { outputDimensionality: 768 }
  });

  return response.embeddings.map((embedding) => embedding.values);
}

function cosine(a, b) {
  let dot = 0;
  let sizeA = 0;
  let sizeB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];     
    sizeA += a[i] * a[i];   
    sizeB += b[i] * b[i];   
  }

  return dot / (Math.sqrt(sizeA) * Math.sqrt(sizeB));
}

async function main() {

  const [sample] = await embed(["wrong console"]);

  console.log("Text: 'wrong console'");
  console.log("Numbers in its vector:", sample.length);
  console.log("First 5 of them:", sample.slice(0, 5));
  console.log();

  const questions = [
    "My PS5 won't run the disc I just bought, what are my options?",
    "Can I get my money back for a game I played for 10 hours?",
    "I bought gta 6 from your store it not compatible with my playstation can i get a refund"
  ];

  const policyVectors = await embed(policy);

  const questionVectors = await embed(questions);

  questions.forEach((question, q) => {
    console.log("QUESTION:", question);

    const scored = policy
      .map((doc, i) => ({ doc, score: cosine(questionVectors[q], policyVectors[i]) }))
      .sort((a, b) => b.score - a.score);

    scored.forEach(({ doc, score }) => console.log("  ", score.toFixed(3), doc));
    console.log();
  });

}

main().catch((error) => console.error(error.message));
