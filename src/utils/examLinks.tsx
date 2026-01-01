// utils/examLinks.ts

// Import the JSON file directly
import examLinksData from '../data/examLinks.json';

// A cache to store the exam links data so we don't have to process it repeatedly
let examLinksCache: any = null;

const getExamLinksData = async (): Promise<any> => {
  // Return from cache if it's already loaded
  if (examLinksCache) {
    return examLinksCache;
  }
  
  // Use the imported data directly
  examLinksCache = examLinksData;
  return examLinksCache;
};

/**
 * Retrieves the specific Google Form link for a student's exam.
 * @param provinceId The ID of the province.
 * @param grade The grade level.
 * @param subject The subject name.
 * @param scienceStream The science stream (for grades 11-12).
 * @returns The Google Form URL or an empty string if not found.
 */
export const getExamLink = async (
  provinceId: string,
  grade: string,
  subject: string,
  scienceStream?: string
): Promise<string> => {
  const links = await getExamLinksData();
  if (!links || !links[provinceId] || !links[provinceId][grade]) {
    console.error("Link data not found for:", { provinceId, grade });
    return "";
  }

  const gradeData = links[provinceId][grade];

  // For grades 11-12, we need to look inside the science stream object
  if (grade === "11" || grade === "12") {
    if (!scienceStream || !gradeData[scienceStream]) {
      console.error("Science stream link not found for:", { grade, scienceStream });
      return "";
    }
    return gradeData[scienceStream][subject] || "";
  }

  // For other grades, the subject is a direct key
  return gradeData[subject] || "";
};


