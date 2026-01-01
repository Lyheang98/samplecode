// 'use client';

// import { useState, useEffect } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import Image from 'next/image';
// import Link from 'next/link';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { ArrowLeft, Home, AlertCircle, ExternalLink, BookOpen } from 'lucide-react';


// export default function ExamPage() {
//     const params = useParams();
//     const router = useRouter();
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);
//     const [iframeLoaded, setIframeLoaded] = useState(false);
//     const [iframeError, setIframeError] = useState(false);

//     const provinceName = decodeURIComponent(params.province as string);
//     const subjectName = decodeURIComponent(params.subject as string);

//     const province = provinces.find(p => p.name === provinceName);
//     const subject = subjects.find(s => s.name === subjectName);
//     const linkKey = `${provinceName}-${subjectName}`;
//     const googleFormLink = googleFormLinks[linkKey];

//     useEffect(() => {
//         if (!province || !subject) {
//             setError('Invalid province or subject');
//             setIsLoading(false);
//             return;
//         }

//         if (!googleFormLink) {
//             setError('Google Form link is not available yet. Please contact administrator.');
//             setIsLoading(false);
//             return;
//         }

//         setIsLoading(false);
//     }, [province, subject, googleFormLink]);

//     const handleIframeLoad = () => {
//         setIframeLoaded(true);
//         setIframeError(false);
//     };

//     const handleIframeError = () => {
//         setIframeError(true);
//     };

//     if (isLoading) {
//         return (
//             <div className="min-h-screen flex items-center justify-center">
//                 <div className="text-center">
//                     <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
//                     <p className="text-lg text-muted-foreground">កំពុងផ្ទុក...</p>
//                 </div>
//             </div>
//         );
//     }

//     if (error || !province || !subject || !googleFormLink) {
//         return (
//             <div className="min-h-screen flex items-center justify-center">
//                 <Card className="max-w-md mx-4">
//                     <CardHeader className="text-center">
//                         <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
//                         <CardTitle className="text-xl text-red-600">មានបញ្ហា</CardTitle>
//                     </CardHeader>
//                     <CardContent className="text-center">
//                         <p className="text-muted-foreground mb-6">{error || 'Google Form link is not available'}</p>
//                         <div className="space-y-3">
//                             <Link href={`/subjects/${encodeURIComponent(provinceName)}`}>
//                                 <Button className="w-full">ត្រឡប់ទៅជ្រើសរើសមុខវិជ្ជា</Button>
//                             </Link>
//                             <Link href="/provinces">
//                                 <Button variant="outline" className="w-full">ត្រឡប់ទៅជ្រើសរើសខេត្ត</Button>
//                             </Link>
//                         </div>
//                     </CardContent>
//                 </Card>
//             </div>
//         );
//     }


//     return (
//         <div className="flex flex-col min-h-dvh bg-background text-foreground">
//             {/* Header */}
//             <header className="bg-card border-b border-border shadow-sm">
//                 <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//                     <div className="flex items-center justify-between h-20">
//                         <div className="flex items-center space-x-2 sm:space-x-4">
//                             <Link href={`/subjects/${encodeURIComponent(provinceName)}`}>
//                                 <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground px-3 sm:px-4 py-2 sm:py-2 min-h-[40px] sm:min-h-[36px] text-sm sm:text-base">
//                                     <ArrowLeft className="h-4 w-4 mr-1 sm:mr-2" />
//                                     <span className="hidden sm:inline">ត្រឡប់</span>
//                                 </Button>
//                             </Link>
//                             <Link href="/welcome">
//                                 <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground px-3 sm:px-4 py-2 sm:py-2 min-h-[40px] sm:min-h-[36px] text-sm sm:text-base">
//                                     <Home className="h-4 w-4 mr-1 sm:mr-2" />
//                                     <span className="hidden sm:inline">ទំព័រដើម</span>
//                                 </Button>
//                             </Link>
//                         </div>
//                         <div className="flex items-center justify-center">
//                             <Image
//                                 src="/moeys-logo.png"
//                                 alt="MoEYS Logo"
//                                 width={60}
//                                 height={60}
//                                 className="h-15 w-auto"
//                                 priority
//                             />
//                         </div>
//                         <div className="w-32"></div> {/* Spacer for centering */}
//                     </div>
//                 </div>
//             </header>

//             {/* Exam Info */}
//             <div className="bg-blue-50 border-b border-blue-200">
//                 <div className="container mx-auto px-4 py-4">
//                     <div className="text-center">
//                         <h1 className="text-2xl font-bold text-blue-900 mb-2">
//                             ប្រឡងតេស្ត {subject.name_km}
//                         </h1>
//                         <p className="text-blue-700">
//                             ខេត្ត: {province.name_km} ({province.name})
//                         </p>
//                         <p className="text-blue-600 text-sm mt-1">
//                             មុខវិជ្ជា: {subject.name}
//                         </p>
//                     </div>
//                 </div>
//             </div>


//             {/* Main Content - Google Form Embed */}
//             <main className="flex-1 container mx-auto p-4">
//                 <div className="max-w-6xl mx-auto">
//                     {/* Exam Header Card */}
//                     <Card className="shadow-lg mb-6 border-0 bg-gradient-to-r from-blue-50 to-indigo-50">
//                         <CardHeader className="text-center pb-4">
//                             <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
//                                 ប្រឡងតេស្តតាមប្រព័ន្ធប្រឡងគម្រោង GEIP
//                             </CardTitle>
//                             <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
//                                 <a
//                                     href={googleFormLink}
//                                     target="_blank"
//                                     rel="noopener noreferrer"
//                                     className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
//                                 >
//                                     <ExternalLink className="mr-2 h-4 w-4" />
//                                     បើកក្នុងផ្ទាំងថ្មី
//                                 </a>
//                                 <div className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full border">
//                                     ប្រឡងតេស្ត {subject.name_km}
//                                 </div>
//                             </div>
//                         </CardHeader>
//                     </Card>

//                     {/* Main Exam Container */}
//                     <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//                         {/* Left Sidebar - Instructions & Help */}
//                         <div className="lg:col-span-1 space-y-4">

//                             <Card className="shadow-md border-0 bg-amber-50 border-amber-200">
//                                 <CardHeader className="pb-3">
//                                     <CardTitle className="text-lg font-semibold text-amber-800 flex items-center">
//                                         <AlertCircle className="mr-2 h-5 w-5 text-amber-600" />
//                                         បើមិនអាចប្រឡងតេស្តបាន
//                                     </CardTitle>
//                                 </CardHeader>
//                                 <CardContent className="space-y-2">
//                                     <div className="space-y-2 text-sm text-amber-700">
//                                         <p>• ប្រើប្រាស់ប៊្រូសែរ Chrome, Firefox, ឬ Safari ថ្មីៗ</p>
//                                         <p>• ប្តូរទៅផ្ទាំងថ្មី ឬប្រើប្រាស់ឧបករណ៍ចល័ត</p>
//                                         <p>• ត្រឡប់ទៅជ្រើសរើសមុខវិជ្ជាផ្សេង</p>
//                                     </div>
//                                 </CardContent>
//                             </Card>
//                         </div>


//                         {/* Right Side - Google Form Embed */}
//                         <div className="lg:col-span-3">
//                             <Card className="shadow-lg border-0 bg-white h-full">
//                                 <CardContent className="p-0">
//                                     <div className="w-full h-[calc(100vh-400px)] min-h-[600px] relative">
//                                         {/* Loading State */}
//                                         {!iframeLoaded && !iframeError && (
//                                             <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg">
//                                                 <div className="text-center">
//                                                     <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
//                                                     <p className="text-lg text-gray-600 font-medium">កំពុងផ្ទុកប្រឡងតេស្ត...</p>
//                                                     <p className="text-sm text-gray-500 mt-2">សូមរង់ចាំខ្លី</p>
//                                                 </div>
//                                             </div>
//                                         )}

//                                         {/* Error State */}
//                                         {iframeError && (
//                                             <div className="absolute inset-0 flex items-center justify-center bg-red-50 rounded-lg">
//                                                 <div className="text-center p-6">
//                                                     <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
//                                                     <h3 className="text-xl font-semibold text-red-800 mb-2">មានបញ្ហាក្នុងការផ្ទុកប្រឡងតេស្ត</h3>
//                                                     <p className="text-red-600 mb-4">សូមព្យាយាមប្រើប្រាស់ផ្ទាំងថ្មី</p>
//                                                     <a
//                                                         href={googleFormLink}
//                                                         target="_blank"
//                                                         rel="noopener noreferrer"
//                                                         className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
//                                                     >
//                                                         <ExternalLink className="mr-2 h-4 w-4" />
//                                                         បើកក្នុងផ្ទាំងថ្មី
//                                                     </a>
//                                                 </div>
//                                             </div>
//                                         )}


//                                         {/* Google Form Iframe */}
//                                         <iframe
//                                             src={`${googleFormLink.replace('?usp=dialog', '?embedded=true&usp=pp_url')}`}
//                                             width="100%"
//                                             height="100%"
//                                             frameBorder="0"
//                                             marginHeight={0}
//                                             marginWidth={0}
//                                             title={`Exam for ${subject.name} in ${province.name}`}
//                                             className="rounded-lg"
//                                             allow="camera; microphone; geolocation"
//                                             sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
//                                             onLoad={handleIframeLoad}
//                                             onError={handleIframeError}
//                                             style={{ display: iframeLoaded && !iframeError ? 'block' : 'none' }}
//                                         />
//                                     </div>
//                                 </CardContent>
//                             </Card>
//                         </div>
//                     </div>
//                 </div>
//             </main>

//             {/* Footer */}
//             <footer className="py-4 text-center bg-gray-50 border-t">
//                 <p className="text-sm text-muted-foreground">
//                     &copy; {new Date().getFullYear()} MoEYS EdTech. All rights reserved.
//                 </p>
//             </footer>
//         </div>
//     );
// }
