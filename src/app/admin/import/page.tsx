// app/admin/import/page.tsx
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';

export default function ImportPage() {
  const [jsonInput, setJsonInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImport = async () => {
    setIsSubmitting(true);
    
    try {
      // ត្រួតពិនិត្យថាតើ JSON ត្រឹមត្រូវឬទេ
      const parsedData = JSON.parse(jsonInput);
      
      // ផ្ញើទៅកាន់ API
      const response = await fetch('/api/admin/import-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ questionsData: parsedData }),
      });
      
      if (response.ok) {
        toast({
          title: "ជោគជ័យ",
          description: "សំណួរត្រូវបានបញ្ចូលដោយជោគជ័យ",
        });
        setJsonInput('');
      } else {
        throw new Error('Failed to import questions');
      }
    } catch (error) {
      toast({
        title: "បរាជ័យ",
        description: "មានបញ្ហាក្នុងការបញ្ចូលសំណួរ",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">បញ្ចូលសំណួរ</h1>
        <p className="text-gray-500">បញ្ចូលសំណួរពីឯកសារ JSON</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>បញ្ចូលទិន្នន័យ JSON</CardTitle>
          <CardDescription>
            សូមចម្លងនិងបិទភ្ជាប់ទិន្នន័យ JSON របស់អ្នកនៅខាងក្រោម
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="បិទភ្ជាប់ JSON នៅទីនេះ..."
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            rows={20}
            className="font-mono"
          />
          <Button 
            onClick={handleImport} 
            disabled={!jsonInput.trim() || isSubmitting}
            className="w-full"
          >
            {isSubmitting ? 'កំពុងបញ្ចូល...' : 'បញ្ចូលសំណួរ'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}