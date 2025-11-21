"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Province {
  province: string; // matches your API structure
}

const API_BASE = "http://10.1.79.47:8000";
const TOKEN_URL = `${API_BASE}/api/token/`;
const RESULTS_URL = `${API_BASE}/api/v1/filters/provinces/`;
const MOCK_USERNAME = "admin";
const MOCK_PASSWORD = "admin123";

const image_province = [
  { ខេត្តបន្ទាយមានជ័យ: "/image_province/BanTeay Meanchey.jpg" },
  { ខេត្តបាត់ដំបង: "/image_province/battambang.jpg" },
  { ខេត្តកំពង់ឆ្នាំង: "/image_province/kampong-chhnang.jpg" },
  { ខេត្តពោធិ៍សាត់: "/image_province/pursat.jpg" },
  { ខេត្តប៉ៃលិន: "/image_province/pailin.jpg" },
  { ខេត្តឧត្តរមានជ័យ: "/image_province/oddar-meanchey.jpg" },
  { ខេត្តកំពត: "/image_province/kampot.jpg" },
  { ខេត្តកោះកុង: "/image_province/koh-kong.jpg" },
  { ខេត្តព្រះសីហនុ: "/image_province/preah-sihanouk.jpg" },
  { ខេត្តតាកែវ: "/image_province/takev.jpg" },
  { ខេត្តកែប: "/image_province/kep.jpg" },
  { ខេត្តកណ្តាល: "/image_province/kandal.jpg" },
  { ខេត្តមណ្ឌលគិរី: "/image_province/mondulkiri.jpg" },
  { ខេត្តរតនគិរី: "/image_province/ratanakiri.jpg" },
  { ខេត្តស្វាយរៀង: "/image_province/svay-rieng.jpg" },
  { ខេត្តត្បូងឃ្មុំ: "/image_province/tboung-khmum.jpg" },
  { រាជធានីភ្នំពេញ: "/image_province/phnom-penh.jpg" },
  { ខេត្តកំពង់ចាម: "/image_province/kampong-cham.jpg" },
  { ខេត្តក្រចេះ: "/image_province/kratie.jpg" },
  { ខេត្តកំពង់ស្ពឺ: "/image_province/kampong-speu.jpg" },
  { ខេត្តស្ទឹងត្រែង: "/image_province/stung-treng.jpg" },
  { ខេត្តព្រះវិហារ: "/image_province/preah-vihear.jpg" },
  { ខេត្តកំពង់ធំ: "/image_province/kampong-thom.jpg" },
  { ខេត្តព្រៃវែង: "/image_province/prey-veang.jpg" },
  { ខេត្តសៀមរាប: "/image_province/siem-reap.jpg" },
];

const provinceImageMap: { [key: string]: string } = image_province.reduce(
  (acc, current) => {
    const key = Object.keys(current)[0];
    acc[key] = Object.values(current)[0];
    return acc;
  },
  {} as { [key: string]: string }
);
// -------------------------------------------------------------------

export default function ResultsPage() {
  const [provinces, setProvinces] = useState<Province[]>([]);
  // 1. Add new state for unique province names
  const [uniqueProvinces, setUniqueProvinces] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProvinces() {
      try {
        // Step 1: get access token
        const tokenRes = await fetch(TOKEN_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: MOCK_USERNAME,
            password: MOCK_PASSWORD,
          }),
        });

        if (!tokenRes.ok) throw new Error("Failed to get token");

        const tokenData = await tokenRes.json();
        const accessToken = tokenData.access;

        // Step 2: fetch provinces
        const res = await fetch(RESULTS_URL, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!res.ok) throw new Error(`Error fetching data (${res.status})`);

        const data: Province[] = await res.json();

        // 2. Process data to get unique province names
        const provinceNames = data.map((item) => item.province);
        // Use Set to automatically filter out duplicates
        const uniqueNames = Array.from(new Set(provinceNames));

        setProvinces(data); // update original provinces data
        setUniqueProvinces(uniqueNames); // update unique provinces state
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProvinces();
  }, []);

  // --- Helper function to get the image path ---
  const getImagePath = (provinceName: string): string | undefined => {
    // Look up the image path using the province name
    return provinceImageMap[provinceName];
  };
  // ---------------------------------------------

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-4">
      {/* Header */}
      <div className="mb-6 px-4">
        {/* Navigation Buttons - CORRECTED: justify-between by default (phone), sm:justify-around (desktop) */}
        <div className="flex justify-between sm:justify-around items-center mb-4 md:mb-6">
          <Link href="/welcome">
            <button className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-3 py-2 sm:px-4 text-xs sm:text-sm font-medium transition-colors">
              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="sm:inline">ត្រឡប់</span>
            </button>
          </Link>
          <Link href="/welcome">
            <button className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-3 py-2 sm:px-4 text-xs sm:text-sm font-medium transition-colors">
              <Home className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="sm:inline">ទំព័រដើម</span>
            </button>
          </Link>
        </div>

        {/* Header Content - Centered */}
        <header className="text-center">
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-3 px-2 sm:px-4 py-2 sm:py-3 bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-md ring-1 ring-gray-200">
              <div className="rounded-lg sm:rounded-xl bg-blue-50 p-1.5 sm:p-2 md:p-3 ring-1 ring-blue-100">
                <Image
                  src="/moeys-logo.png"
                  alt="MoEYS Logo"
                  width={40}
                  height={40}
                  className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12"
                  priority
                />
              </div>
              <div className="text-gray-900 font-semibold text-xs sm:text-sm md:text-base leading-snug text-left whitespace-normal">
                MoEYS EdTech - GEIP ICT Team
              </div>
            </div>
          </div>
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 leading-tight px-2">
            ទិន្នន័យសិស្សប្រឡង Online តាម
            <span className="text-blue-600"> MoEYS EdTech App</span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            សូមជ្រើសរើសខេត្ត ដើម្បីមើលលទ្ធផលប្រឡងរបស់សិស្ស
          </p>
        </header>
      </div>

      {/* Page content */}
      <div className="py-2 px-4 max-w-6xl mx-auto space-y-6">
        {loading ? (
          <p className="text-center text-gray-500">កំពុងផ្ទុកទិន្នន័យ...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {/* 3. Map over the new uniqueProvinces array */}
            {uniqueProvinces.map((provinceName) => {
              const imagePath = getImagePath(provinceName);
              const isPhnomPenh = provinceName === "រាជធានីភ្នំពេញ"; // Check for Phnom Penh specifically

              return (
                <Link
                  href={`/results/${provinceName
                    .replace(/\s+/g, "-")
                    .toLowerCase()}`}
                  key={provinceName}
                >
                  <Card className="group border border-gray-200 shadow-sm hover:shadow-lg hover:border-blue-600 transition bg-white cursor-pointer overflow-hidden">
                    {imagePath ? (
                      // --- Modification starts here ---
                      <>
                        <div className="relative w-full aspect-square overflow-hidden">
                          <Image
                            src={imagePath}
                            alt={`Image of ${provinceName}`}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                        {/* Style the button-like text below the image */}
                        <div className="flex justify-center items-center py-3 bg-blue-600 group-hover:bg-blue-700 transition text-white font-semibold text-lg">
                          {provinceName}
                        </div>
                      </>
                    ) : (
                      // Fallback: If no image is found, use the original Card style
                      <CardContent className="flex justify-center items-center h-32">
                        <span className="text-lg text-center font-semibold">
                          {provinceName}
                        </span>
                      </CardContent>
                    )}
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}