import axios from 'axios';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export async function generateQuestions(topic: string) {
  const prompt = `Generate 6 multiple-choice interview questions for the topic "${topic}". Each question should have 4 options and one correct answer. The questions should be:
  - 2 easy
  - 2 medium
  - 2 hard
  Return the result as a JSON array with objects like: { "difficulty": "easy|medium|hard", "question": "...", "options": ["...", "...", "...", "..."], "correctAnswer": "..." }.`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;
  const body = {
    contents: [{ parts: [{ text: prompt }] }]
  };
  const response = await axios.post(url, body);
  // Debug: log raw Gemini response
  console.log('Gemini raw response:', response.data);
  const candidates = (response.data as any)?.candidates;
  const text = candidates?.[0]?.content?.parts?.[0]?.text || '';
  let questions = [];
  try {
    // Try to find JSON array in the text
    const match = text.match(/\[.*\]/s);
    if (match) {
      questions = JSON.parse(match[0]);
    } else {
      questions = JSON.parse(text);
    }
  } catch (e) {
    console.error('Failed to parse Gemini response:', text, e);
    questions = [];
  }
  return questions;
}
