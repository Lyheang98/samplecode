// app/provinces/page.tsx
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Home } from "lucide-react";

const PROVINCES = [
  { id: "1", name: "ខេត្តបន្ទាយមានជ័យ" },
  { id: "2", name: "ខេត្តបាត់ដំបង" },
  { id: "3", name: "ខេត្តកំពង់ចាម" },
  { id: "4", name: "ខេត្តកំពង់ឆ្នាំង" },
  { id: "5", name: "ខេត្តកំពង់ស្ពឺ" },
  { id: "6", name: "ខេត្តកំពង់ធំ" },
  { id: "7", name: "ខេត្តកំពត" },
  { id: "8", name: "ខេត្តកណ្ដាល" },
  { id: "9", name: "ខេត្តកោះកុង" },
  { id: "10", name: "ខេត្តក្រចេះ" },
  { id: "11", name: "ខេត្តមណ្ឌលគិរី" },
  { id: "12", name: "រាជធានីភ្នំពេញ" },
  { id: "13", name: "ខេត្តព្រះវិហារ" },
  { id: "14", name: "ខេត្តព្រៃវែង" },
  { id: "15", name: "ខេត្តពោធិ៍សាត់" },
  { id: "16", name: "ខេត្តរតនគិរី" },
  { id: "17", name: "ខេត្តសៀមរាប" },
  { id: "18", name: "ខេត្តព្រះសីហនុ" },
  { id: "19", name: "ខេត្តស្ទឹងត្រែង" },
  { id: "20", name: "ខេត្តស្វាយរៀង" },
  { id: "21", name: "ខេត្តតាកែវ" },
  { id: "22", name: "ខេត្តកែប" },
  { id: "23", name: "ខេត្តប៉ៃលិន" },
  { id: "24", name: "ខេត្តឧត្តរមានជ័យ" },
  { id: "25", name: "ខេត្តត្បូងឃ្មុំ" },
];

// Province Image Map (រក្សាដដែល)
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
  "ខេត្តកណ្ដាល": "/image/provinces/kandal.jpg",
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

export default function ProvincesPage() {
  const provinces = PROVINCES.map(p => p.id).sort(); // តម្រៀបតាមអក្សរខ្មែរ (optional: អាច sort តាម id បើចង់)

  const createSlug = (id: string) => encodeURIComponent(id.trim());

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-100 p-5">
      <div className="max-w-7xl mx-auto">
        {/* Navigation */}
        <div className="flex justify-between sm:justify-around items-center mb-4 md:mb-6">
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
            {PROVINCES.map((province) => {
              const imagePath = provinceImageMap[province.name];
              const href = `/results/${createSlug(province.id)}`; // Changed to use province.id

              return (
                <Link href={href} key={province.id} className="group">
                  <div className="bg-white rounded-lg sm:rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-blue-500 cursor-pointer h-full flex flex-col">
                    {imagePath ? (
                      <div className="aspect-square relative bg-gray-100">
                        <Image
                          src={imagePath}
                          alt={province.name}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ) : (
                      <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center p-2 sm:p-4">
                        <span className="text-center text-gray-700 font-bold text-xs sm:text-sm md:text-base whitespace-normal break-words">
                          {province.name}
                        </span>
                      </div>
                    )}
                    <div className="p-3 sm:p-4 bg-gradient-to-r from-blue-600 to-blue-700 group-hover:from-blue-700 group-hover:to-blue-800 text-white text-center font-semibold text-xs sm:text-sm md:text-base transition whitespace-normal break-words flex-grow flex items-center justify-center">
                      {province.name}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-8 sm:mt-12 text-gray-500 text-xs sm:text-sm">
          <p>© 2025 MoEYS EdTech - GEIP ICT Team. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}