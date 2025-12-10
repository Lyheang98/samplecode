// scripts/populateExamLinks.ts
// This script helps you generate all the Google Form links for your exams

const fs = require('fs');
const path = require('path');

const PROVINCES = Array.from({ length: 25 }, (_, i) => String(i + 1));
const GRADES = ["7", "8", "9", "10", "11", "12"];
const SUBJECTS = [
  "ភាសាខ្មែរ",
  "គណិតវិទ្យា",
  "រូបវិទ្យា",
  "គីមីវិទ្យា",
  "ជីវវិទ្យា",
  "ប្រវត្តិវិទ្យា",
  "ភូមិវិទ្យា",
  "សីលធម៌-ពលរដ្ឋវិជ្ជា",
  "ផែនដីវិទ្យា",
  "អង់គ្លេស"
];

const SCIENCE_STREAMS = ["វិទ្យាសាស្រ្ត", "វិទ្យាសាស្រ្តសង្គម"];

// Generate all the links
const allLinks: any = {};

PROVINCES.forEach(provinceId => {
  allLinks[provinceId] = {};
  
  GRADES.forEach(grade => {
    if (grade === "11" || grade === "12") {
      // For grades 11-12, create science streams
      allLinks[provinceId][grade] = {};
      
      SCIENCE_STREAMS.forEach(stream => {
        allLinks[provinceId][grade][stream] = {};
        
        SUBJECTS.forEach(subject => {
          // Replace with your actual Google Form links
          allLinks[provinceId][grade][stream][subject] = `https://docs.google.com/forms/d/e/1FAIpQLSdExample${grade}${stream}${subject}/viewform?usp=publish-editor`;
        });
      });
    } else {
      // For other grades, just list subjects
      allLinks[provinceId][grade] = {};
      
      SUBJECTS.forEach(subject => {
        // Replace with your actual Google Form links
        allLinks[provinceId][grade][subject] = `https://docs.google.com/forms/d/e/1FAIpQLSdExample${grade}${subject}/viewform?usp=publish-editor`;
      });
    }
  });
});

// Save the links to the public/data directory
const outputPath = path.join(__dirname, '..', 'public', 'data', 'examLink.json');
fs.writeFileSync(outputPath, JSON.stringify(allLinks, null, 2));

console.log(`Exam links generated and saved to: ${outputPath}`);
console.log(JSON.stringify(allLinks, null, 2));