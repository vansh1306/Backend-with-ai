require("dotenv").config();
const {GoogleGenAI}=require("@google/genai");


const ai= new GoogleGenAI({
    apiKey:process.env.GEMINI_KEY
});
const MODEL="gemini-3.8-flash";

module.exports={ai,MODEL}