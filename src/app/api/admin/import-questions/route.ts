import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { questionsData } = await request.json();
    
    // Ensure data directory exists
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const filePath = path.join(dataDir, 'questions.json');
    
    // Read existing data
    let existingData = { subjects: [] };
    if (fs.existsSync(filePath)) {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      existingData = JSON.parse(fileContents);
    }
    
    // Merge data
    existingData.subjects = [...existingData.subjects, ...(questionsData.subjects || [])];
    
    // Save
    fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));
    
    return NextResponse.json({ success: true, message: 'Questions imported successfully!' });
  } catch (error) {
    console.error('Error importing questions:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to import questions' },
      { status: 500 }
    );
  }
}