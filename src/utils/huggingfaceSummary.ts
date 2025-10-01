import axios from 'axios';

const HF_API_URL = 'https://api-inference.huggingface.co/models/facebook/bart-large-cnn';
const HF_API_KEY = import.meta.env.VITE_HUGGINGFACE_API_KEY;

export async function generateHFSummary(answers: string[], topic: string) {
  const prompt = `Summarize the following interview answers for the topic \"${topic}\". Provide a brief, professional summary suitable for feedback.\nAnswers:\n${answers.join('\n')}`;
  try {
    const response = await axios.post(
      HF_API_URL,
      { inputs: prompt },
      { headers: { Authorization: `Bearer ${HF_API_KEY}` } }
    );
    return response.data[0]?.summary_text || '';
  } catch (err: any) {
    console.error('Hugging Face API error:', err?.response?.data || err.message);
    throw new Error(
      err?.response?.data?.error ||
      err?.message ||
      'Failed to generate summary'
    );
  }
}
