"use client";

import Link from "next/link";
import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { usePathname } from "next/navigation";

export default function SubMenuNavItem({ item }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isSubmenuActive = item.submenu.some(
    (subItem) => pathname === subItem.href
  );

  return (
    <li>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full ${
          isSubmenuActive
            ? "bg-white text-black hover:bg-gray-100"
            : "text-white hover:bg-blue-800"
        } px-4 py-3 rounded-lg transition-all`}
      >
        <div className="flex items-center space-x-3">
          {item.icon}
          <span className="text-sm font-medium">{item.title}</span>
        </div>
        <FiChevronDown
          className={`h-4 w-4 transform transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <ul className="ml-6 mt-2 space-y-2 border-l-2 border-white/20 pl-3">
          {item.submenu.map((subItem) => {
            const isActive = pathname === subItem.href;
            return (
              <li key={subItem.title}>
                <Link
                  href={subItem.href}
                  className={`flex items-center space-x-3 ${
                    isActive
                      ? "bg-white text-black hover:bg-gray-100"
                      : "text-white/80 hover:text-white hover:bg-blue-800"
                  } px-4 py-2 rounded-lg transition-all text-sm`}
                >
                  <span>{subItem.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </li>
  );
}
