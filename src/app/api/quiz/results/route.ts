// app/api/quiz/results/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const results = await request.json();
    
    // អានទិន្នន័យចាស់
    const filePath = path.join(process.cwd(), 'data', 'quiz-results.json');
    let existingData = { results: [] };
    
    if (fs.existsSync(filePath)) {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      existingData = JSON.parse(fileContents);
    }
    
    // បញ្ចូលលទ្ធផលថ្មី
    existingData.results.push({
      ...results,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    });
    
    // រក្សាទុកទិន្នន័យ
    fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));
    
    return NextResponse.json({ success: true, message: 'Results saved successfully!' });
  } catch (error) {
    console.error('Error saving quiz results:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to save results' },
      { status: 500 }
    );
  }
}