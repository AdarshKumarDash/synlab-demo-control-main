import { askGemini } from "./gemini";

export async function testGemini() {
  const response = await askGemini(
    "Explain temperature in one sentence."
  );

  console.log(response);
}