import Sidebar from "@/components/admin/Sidebar"
import Link from "next/link";

export default function RootLayout({ children }) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar (fixed/sticky) */}
        <Sidebar className='fixed top-0 w-80 left-0  z-50  h-screen '  />

      {/* Main Content Area */}
      <div className=" flex-1 flex flex-col lg:ml-80  ">
        {/* Header */}
        <header className="shadow-md sticky top-0 right-0 bg-white-1 w-full  z-60 bg-white h-16 flex items-center   justify-end px-8 ">
          <div className="flex justify-between items-center space-x-6">
            <Link
              href="/"
              target="_blank"
              className="bg-black-4 text-[13px] text-white-1 px-3 py-2 rounded"
            >
              Go To Frontend
            </Link>

            <button className="text-gray-600 hover:text-[#154583] relative">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-600 font-medium">MS</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Mandeep Singh</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 w-full  ">
          {children}
        </main>
      </div>
    </div>
  );
}
