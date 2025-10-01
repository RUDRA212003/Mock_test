import axios from 'axios';

const HF_API_KEY = import.meta.env.VITE_HF_API_KEY;

export async function generateQuestionsWithHF(topic: string) {
  const prompt = `Generate 6 multiple-choice interview questions for the topic \"${topic}\". Each question should have 4 options and one correct answer. The questions should be: 2 easy, 2 medium, 2 hard. Return as a JSON array with objects like: { \"difficulty\": \"easy|medium|hard\", \"question\": \"...\", \"options\": [\"...\", \"...\", \"...\", \"...\"], \"correctAnswer\": \"...\" }`;
  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/facebook/opt-125m',
      { inputs: prompt },
      { headers: { Authorization: `Bearer ${HF_API_KEY}` } }
    );
    const data: any = response.data;
    const text = data[0]?.generated_text || data;
    try {
      return JSON.parse(text);
    } catch (e) {
      console.error('Failed to parse Hugging Face response:', text, e);
      return [];
    }
  } catch (err: any) {
    console.error('Hugging Face API error:', err?.response?.data || err.message);
    throw new Error(
      err?.response?.data?.error ||
      err?.message ||
      'Failed to generate questions'
    );
  }
}
