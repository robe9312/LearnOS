import Groq from "groq-sdk";

const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;

if (!apiKey) {
  console.warn("NEXT_PUBLIC_GROQ_API_KEY is not defined. AI features will be disabled.");
}

export const groq = new Groq({
  apiKey: apiKey || "",
  dangerouslyAllowBrowser: true, // Required for client-side usage in this environment
});
