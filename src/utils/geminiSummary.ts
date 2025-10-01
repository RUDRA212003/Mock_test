import axios from 'axios';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export async function generateSummary(answers: string[], topic: string) {
  const prompt = `Summarize the following interview answers for the topic \"${topic}\". Provide a brief, professional summary suitable for feedback.\nAnswers:\n${answers.join('\n')}`;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;
  const body = {
    contents: [{ parts: [{ text: prompt }] }]
  };
  try {
    const response = await axios.post(url, body);
    const candidates = (response.data as any)?.candidates;
    const text = candidates?.[0]?.content?.parts?.[0]?.text || '';
    return text;
  } catch (err: any) {
    console.error('Gemini API error:', err?.response?.data || err.message);
    throw new Error(
      err?.response?.data?.error?.message ||
      err?.message ||
      'Failed to generate summary'
    );
  }
}
