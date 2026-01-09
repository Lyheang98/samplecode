// Import necessary Node.js modules for server-side data fetching
// "use client";
import path from 'path';
import fs from 'fs';

// Import your UI components using the path alias
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Define a type for your data structure for better type safety
interface Question {
  id: string;
  text: string;
  // ... other question properties
}

interface Subject {
  name: string;
  questions: Question[];
}

interface QuestionsData {
  subjects: Subject[];
}

// Function to read data from the local JSON file
async function getQuestionsData(): Promise<QuestionsData> {
  try {
    const filePath = path.join(process.cwd(), 'data', 'questions.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error("Failed to read or parse questions.json:", error);
    // Return a default structure to prevent the page from crashing
    return { subjects: [] };
  }
}

// The page component is an async Server Component
export default async function DashboardPage() {
  const data = await getQuestionsData();
  
  // Safely calculate totals, even if data is empty
  const totalSubjects = data.subjects ? data.subjects.length : 0;
  const totalQuestions = data.subjects ? data.subjects.reduce((acc, subject) => 
    acc + (subject.questions ? subject.questions.length : 0), 0
  ) : 0;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-500">មើលទិន្នន័យស្ថិតិនៃប្រព័ន្ធប្រឡង</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ចំនួនមុខវិជ្ជា</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSubjects}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ចំនួនសំណួរ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalQuestions}</div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="subjects" className="space-y-4">
        <TabsList>
          <TabsTrigger value="subjects">មុខវិជ្ជា</TabsTrigger>
          <TabsTrigger value="import">បញ្ចូលសំណួរ</TabsTrigger>
        </TabsList>
        
        <TabsContent value="subjects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>បញ្ជីមុខវិជ្ជា</CardTitle>
              <CardDescription>មុខវិជ្ជាទាំងអស់នៅក្នុងប្រព័ន្ធ</CardDescription>
            </CardHeader>
            <CardContent>
              {/* TODO: Add a table here to list subjects from data.subjects */}
              <p className="text-muted-foreground">No subjects to display yet.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="import" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>បញ្ចូលសំណួរ</CardTitle>
              <CardDescription>បញ្ចូលសំណួរពីឯកសារ JSON</CardDescription>
            </CardHeader>
            <CardContent>
              {/* TODO: Add a form here to upload a JSON file */}
              <p className="text-muted-foreground">Import form will be here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}