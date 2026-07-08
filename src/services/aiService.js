import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.warn("Missing VITE_GEMINI_API_KEY in .env file");
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

function extractJsonFromText(text) {
  if (!text) return null;

  let cleaned = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {}

  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");

  if (start !== -1 && end !== -1 && end > start) {
    const possibleJson = cleaned.slice(start, end + 1);
    try {
      return JSON.parse(possibleJson);
    } catch {}
  }

  return null;
}

function normalizeArray(arr, limit = 12) {
  return Array.isArray(arr) ? arr.filter(Boolean).slice(0, limit) : [];
}

function normalizeResult(parsed) {
  return {
    score:
      typeof parsed?.score === "number"
        ? Math.max(0, Math.min(100, Math.round(parsed.score)))
        : 0,

    summary:
      typeof parsed?.summary === "string" && parsed.summary.trim()
        ? parsed.summary.trim()
        : "No summary generated.",

    matchedSkills: normalizeArray(parsed?.matchedSkills),
    missingSkills: normalizeArray(parsed?.missingSkills),
    strengths: normalizeArray(parsed?.strengths),
    weaknesses: normalizeArray(parsed?.weaknesses),
    recommendations: normalizeArray(parsed?.recommendations),

    verdict:
      typeof parsed?.verdict === "string" && parsed.verdict.trim()
        ? parsed.verdict.trim()
        : "No verdict generated.",
  };
}

export async function analyzeResumeWithAI(resumeText, jobDescription) {
  if (!GEMINI_API_KEY) {
    throw new Error("Missing VITE_GEMINI_API_KEY in .env file");
  }

  if (!resumeText?.trim()) {
    throw new Error("Resume text is empty.");
  }

  if (!jobDescription?.trim()) {
    throw new Error("Job description is empty.");
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-3.5-flash", // keep your working model here
  });

  const prompt = `
You are an ATS Resume Analyzer.

Your task is to compare a candidate RESUME with a JOB DESCRIPTION and evaluate how well the resume matches the job.

Return ONLY valid JSON in exactly this structure:
{
  "score": 78,
  "summary": "2-4 line summary",
  "matchedSkills": ["skill1", "skill2"],
  "missingSkills": ["skill1", "skill2"],
  "strengths": ["point1", "point2"],
  "weaknesses": ["point1", "point2"],
  "recommendations": ["point1", "point2", "point3"],
  "verdict": "Short final hiring-fit verdict"
}

STRICT RULES:
- Output ONLY JSON. No markdown. No explanation. No extra text.
- score must be an integer between 0 and 100.
- summary should be concise and ATS-style.
- matchedSkills = important skills/keywords clearly present in the resume and relevant to JD.
- missingSkills = important JD skills/keywords missing or weak in the resume.
- strengths = strong positive resume-job fit points.
- weaknesses = resume gaps, missing impact, unclear relevance, or weak alignment.
- recommendations = practical resume improvement suggestions for this JD.
- verdict = 1-2 lines on overall suitability of candidate for this role.
- Keep all arrays short, relevant, and useful.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("Gemini raw response:", text);

    if (!text) {
      throw new Error("Empty response from Gemini.");
    }

    const parsed = extractJsonFromText(text);

    if (!parsed) {
      throw new Error(
        "Gemini returned a response, but valid JSON could not be extracted."
      );
    }

    return normalizeResult(parsed);
  } catch (error) {
  console.error("===== AI SERVICE ERROR START =====");
  console.error(error);
  console.error("message:", error?.message);
  console.error("status:", error?.status);
  console.error("stack:", error?.stack);
  console.error("===== AI SERVICE ERROR END =====");
  throw error;
}
}