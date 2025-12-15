// app/provinces/page.tsx
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Home } from "lucide-react";

// API config
import { API_BASE, MOCK_USERNAME, MOCK_PASSWORD } from "../../../api/api";

const TOKEN_URL = `${API_BASE}/api/token/`;
const RESULTS_URL = `${API_BASE}/api/v1/result/full-results/`;

// Province Image Map
const provinceImageMap: Record<string, string> = {
  "ខេត្តបន្ទាយមានជ័យ": "/image/provinces/BanTeay Meanchey.jpg",
  "ខេត្តបាត់ដំបង": "/image/provinces/battambang.jpg",
  "ខេត្តកំពង់ឆ្នាំង": "/image/provinces/kampong-chhnang.jpg",
  "ខេត្តពោធិ៍សាត់": "/image/provinces/pursat.jpg",
  "ខេត្តប៉ៃលិន": "/image/provinces/pailin.jpg",
  "ខេត្តឧត្តរមានជ័យ": "/image/provinces/oddar-meanchey.jpg",
  "ខេត្តកំពត": "/image/provinces/kampot.jpg",
  "ខេត្តកោះកុង": "/image/provinces/koh-kong.jpg",
  "ខេត្តព្រះសីហនុ": "/image/provinces/preah-sihanouk.jpg",
  "ខេត្តតាកែវ": "/image/provinces/takev.jpg",
  "ខេត្តកែប": "/image/provinces/kep.jpg",
  "ខេត្តកណ្តាល": "/image/provinces/kandal.jpg",
  "ខេត្តមណ្ឌលគិរី": "/image/provinces/mondulkiri.jpg",
  "ខេត្តរតនគិរី": "/image/provinces/ratanakiri.jpg",
  "ខេត្តស្វាយរៀង": "/image/provinces/svay-rieng.jpg",
  "ខេត្តត្បូងឃ្មុំ": "/image/provinces/tboung-khmum.jpg",
  "រាជធានីភ្នំពេញ": "/image/provinces/phnom-penh.jpg",
  "ខេត្តកំពង់ចាម": "/image/provinces/kampong-cham.jpg",
  "ខេត្តក្រចេះ": "/image/provinces/kratie.jpg",
  "ខេត្តកំពង់ស្ពឺ": "/image/provinces/kampong-speu.jpg",
  "ខេត្តស្ទឹងត្រែង": "/image/provinces/stung-treng.jpg",
  "ខេត្តព្រះវិហារ": "/image/provinces/preah-vihear.jpg",
  "ខេត្តកំពង់ធំ": "/image/provinces/kampong-thom.jpg",
  "ខេត្តព្រៃវែង": "/image/provinces/prey-veang.jpg",
  "ខេត្តសៀមរាប": "/image/provinces/siem-reap.jpg",
};

// Login API
async function getAccessToken() {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: MOCK_USERNAME,
      password: MOCK_PASSWORD,
    }),
    credentials: "omit",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Login failed: ${res.status}`);
  }

  const data = await res.json();
  return data.access;
}

// Fetch provinces list
async function getProvinces(): Promise<string[]> {
  const token = await getAccessToken();

  const res = await fetch(RESULTS_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    credentials: "omit",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch: ${res.status}`);
  }

  const data = await res.json();
  const results = data.results || data;

  return Array.from(
    new Set(results.map((item: any) => item.province_name).filter(Boolean))
  ).sort();
}

export default async function ProvincesPage() {
  let provinces: string[] = [];
  let error: string | null = null;

  try {
    provinces = await getProvinces();
  } catch (err) {
    error = "មានបញ្ហាក្នុងការភ្ជាប់ទៅកាន់ម៉ាស៊ីនមេ។ សូមព្យាយាមម្តងទៀត។";
  }

  const createSlug = (name: string) => encodeURIComponent(name.trim());

  return (
    // CHANGE: Applied p-5 for 20px padding on all sides
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-100 p-5">
      <div className="max-w-7xl mx-auto">
        {/* Navigation */}
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <Link href="/welcome">
            <button className="
              flex items-center gap-2
              bg-blue-600 hover:bg-blue-700 text-white font-bold
              px-3 py-2 text-xs
              sm:px-4 sm:py-2 sm:text-sm
              md:px-5 md:py-3 md:text-base
              rounded-lg shadow-lg transition
            ">
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" /> ត្រឡប់
            </button>
          </Link>

          <Link href="/welcome">
            <button className="
              flex items-center gap-2
              bg-green-600 hover:bg-green-700 text-white font-bold
              px-3 py-2 text-xs
              sm:px-4 sm:py-2 sm:text-sm
              md:px-5 md:py-3 md:text-base
              rounded-lg shadow-lg transition
            ">
              <Home className="w-4 h-4 sm:w-5 sm:h-5" /> ទំព័រដើម
            </button>
          </Link>
        </div>

        {/* Header */}
        <header className="text-center mb-6 sm:mb-8">
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 bg-white/80 backdrop-blur-sm rounded-xl shadow-md ring-1 ring-gray-200">
              <div className="rounded-lg bg-blue-50 p-2 sm:p-3 ring-1 ring-blue-100">
                <Image
                  src="/moeys-logo.png"
                  alt="MoEYS Logo"
                  width={48}
                  height={48}
                  className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12"
                />
              </div>
              <div className="text-gray-900 font-semibold text-xs sm:text-sm md:text-base leading-tight text-left">
                MoEYS EdTech - GEIP ICT Team
              </div>
            </div>
          </div>

          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 leading-tight px-2">
            ទិន្នន័យសិស្សប្រឡង Online តាម
            <span className="text-blue-600"> MoEYS EdTech App</span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            សូមជ្រើសរើសខេត្ត ដើម្បីមើលលទ្ធផលប្រឡងរបស់សិស្ស
          </p>
        </header>

        {/* Provinces Grid */}
        <div className="py-4 sm:py-6">
          {error ? (
            <div className="text-center py-16 sm:py-24">
              <p className="text-2xl sm:text-3xl font-bold text-red-600 mb-4">មានបញ្ហា!</p>
              <p className="text-lg sm:text-xl text-gray-700">{error}</p>
            </div>
          ) : provinces.length === 0 ? (
            <div className="text-center py-16 sm:py-24">
              <p className="text-lg sm:text-xl text-gray-600">កំពុងផ្ទុកទិន្នន័យខេត្ត...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
              {provinces.map((provinceName) => {
                const imagePath = provinceImageMap[provinceName];
                const href = `/results/${createSlug(provinceName)}`;

                return (
                  <Link href={href} key={provinceName} className="group">
                    <div className="bg-white rounded-lg sm:rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-blue-500 cursor-pointer h-full flex flex-col">
                      {imagePath ? (
                        <div className="aspect-square relative bg-gray-100">
                          <Image
                            src={imagePath}
                            alt={provinceName}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      ) : (
                        <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center p-2 sm:p-4">
                          <span className="text-center text-gray-700 font-bold text-xs sm:text-sm md:text-base whitespace-normal break-words">
                            {provinceName}
                          </span>
                        </div>
                      )}
                      <div className="p-3 sm:p-4 bg-gradient-to-r from-blue-600 to-blue-700 group-hover:from-blue-700 group-hover:to-blue-800 text-white text-center font-semibold text-xs sm:text-sm md:text-base transition whitespace-normal break-words flex-grow flex items-center justify-center">
                        {provinceName}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="text-center mt-8 sm:mt-12 text-gray-500 text-xs sm:text-sm">
          <p>© 2025 MoEYS EdTech - GEIP ICT Team. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}