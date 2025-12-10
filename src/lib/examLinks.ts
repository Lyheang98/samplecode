// Import the exam links data
import examLinksData from './examLinks.json';

export interface ExamLinksData {
  [provinceId: string]: {
    [grade: string]: {
      [subject: string]: string;
    } | {
      [stream: string]: {
        [subject: string]: string;
      };
    };
  };
}

// Function to get exam link based on province, grade, subject, and stream
export const getExamLink = async (
  provinceId: string,
  grade: string,
  subject: string,
  stream?: string
): Promise<string> => {
  try {
    const data: ExamLinksData = examLinksData;
    
    // Check if province exists
    if (!data[provinceId]) {
      console.warn(`Province ${provinceId} not found in exam links data`);
      return "";
    }
    
    const provinceData = data[provinceId];
    
    // Check if grade exists
    if (!provinceData[grade]) {
      console.warn(`Grade ${grade} not found for province ${provinceId}`);
      return "";
    }
    
    const gradeData = provinceData[grade];
    
    let link = "";
    
    // For grades 11-12, check stream first
    if ((grade === "11" || grade === "12") && stream) {
      if (typeof gradeData === 'object' && 'វិទ្យាសាស្រ្ត' in gradeData) {
        const streamData = gradeData as { [stream: string]: { [subject: string]: string } };
        if (streamData[stream] && streamData[stream][subject]) {
          link = streamData[stream][subject];
        }
      }
    } else {
      // For other grades, get subject directly
      if (typeof gradeData === 'object' && subject in gradeData) {
        const subjectData = gradeData as { [subject: string]: string };
        link = subjectData[subject];
      }
    }
    
    // Return the link or empty string if not found
    return link || "";
    
  } catch (error) {
    console.error("Error getting exam link:", error);
    return "";
  }
};

// Function to check if an exam is available
export const isExamAvailable = (
  provinceId: string,
  grade: string,
  subject: string,
  stream?: string
): boolean => {
  const data: ExamLinksData = examLinksData;
  
  if (!data[provinceId] || !data[provinceId][grade]) {
    return false;
  }
  
  const gradeData = data[provinceId][grade];
  
  if ((grade === "11" || grade === "12") && stream) {
    if (typeof gradeData === 'object' && 'វិទ្យាសាស្រ្ត' in gradeData) {
      const streamData = gradeData as { [stream: string]: { [subject: string]: string } };
      return !!(streamData[stream] && streamData[stream][subject]);
    }
  } else {
    if (typeof gradeData === 'object' && subject in gradeData) {
      return true;
    }
  }
  
  return false;
};

// Function to get all available subjects for a grade and province
export const getAvailableSubjects = (
  provinceId: string,
  grade: string,
  stream?: string
): string[] => {
  const data: ExamLinksData = examLinksData;
  
  if (!data[provinceId] || !data[provinceId][grade]) {
    return [];
  }
  
  const gradeData = data[provinceId][grade];
  
  if ((grade === "11" || grade === "12") && stream) {
    if (typeof gradeData === 'object' && 'វិទ្យាសាស្រ្ត' in gradeData) {
      const streamData = gradeData as { [stream: string]: { [subject: string]: string } };
      return streamData[stream] ? Object.keys(streamData[stream]) : [];
    }
  } else {
    if (typeof gradeData === 'object') {
      return Object.keys(gradeData).filter(key => key !== 'វិទ្យាសាស្រ្ត' && key !== 'វិទ្យាសាស្រ្តសង្គម');
    }
  }
  
  return [];
};