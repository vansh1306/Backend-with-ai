require("dotenv").config();
const {GoogleGenAI}=require("@google/genai");


const ai= new GoogleGenAI({
    apiKey:process.env.GEMINI_KEY
});
const MODEL="gemini-3.1-flash-lite";

module.exports={ai,MODEL}