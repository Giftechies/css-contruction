"use client"

import { cn } from "@/lib/utils"
import { ChartArea, ChevronDown, ChevronRight } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { useState } from "react"

export default function Sidebar({ className }) {
  const pathname = usePathname()
  console.log(pathname);
  
  const navigate = useRouter()
  const [openMenu, setOpenMenu] = useState(null)

  const path = [
    { label: "Postcode", path: "/admin/postcode" },
    {
      label: "Skip",
      path: "#",
      children: [
        { label: "Category", path: "/admin/skip/category" },
        { label: "Size", path: "/admin/skip/size" },
        { label: "Roro", path: "/admin/skip-details/roro" },
      ],
    },
    { label: "Details", path: "#" },
  ]

  function Menuitem() {
    return (
      <aside className="flex flex-col gap-2 mt-6 w-full">
        {path.map((el, id) => {
          const isActive = pathname === el.path
          
          const hasChildren = el.children && el.children.length > 0
          const isOpen = openMenu === id

          return (
            <div key={id} className="flex flex-col">
              {/* Main item */}
              <div
                onClick={() => {
                  if (hasChildren) {
                    setOpenMenu(isOpen ? null : id)
                  } else {
                    navigate.push(el.path)
                  }
                }}
                className={cn(
                  "rounded-xl font-[300] w-full p-3 flex justify-between items-center cursor-pointer hover:text-black-1 hover:bg-white-2",
                  { "bg-white-1 text-black-4 font-[500]": isActive }
                )}
              >
                <span>{el.label}</span>
                {hasChildren &&
                  (isOpen ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  ))}
              </div>

              {/* Submenu */}
              {hasChildren && isOpen && (
                <div className="ml-4 flex flex-col gap-1 mt-1">
                  {el.children.map((child, cId) => {
                    const isChildActive = pathname === child.path
                    return (
                      <a
                        key={cId}
                        href={child.path}
                        className={cn(
                          "rounded-lg font-[300] w-full p-2 pl-4 hover:text-black-1 hover:bg-white-2",
                          { "bg-white-1 text-black-4 font-[500]": isChildActive }
                        )}
                      >
                        {child.label}
                      </a>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </aside>
    )
  }

  return (
    <section
      className={cn(
        "shrink-0 hidden lg:block shadow-lg min-h-screen bg-black-4 text-white-1 p-6",
        className
      )}
    >
      <h3
        onClick={() => navigate.push("/admin")}
        className="h4 cursor-pointer font-semibold flex gap-2"
      >
        <ChartArea /> Admin Panel
      </h3>

      <div className="flex">
        <Menuitem />
      </div>
    </section>
  )
}
