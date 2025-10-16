import { Home, User, LogOut, ChartNoAxesCombined, ShoppingBag, ShoppingBasket, Newspaper } from 'lucide-react'
import { useState } from 'react'
import { usePage } from '@inertiajs/react'
import { motion } from "framer-motion"
import { Sidebar, SidebarBody, SidebarLink } from "@/components/sidebar"

export default function AuthenticationLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const user = usePage().props.auth.user
  const firstLetter = user.name.charAt(0).toUpperCase()

  const allLinks = [
    {
      label: "Home",
      href: "/dashboard",
      icon: <Home className="h-5 w-5 shrink-0 text-blue-600" />,
    },
    {
      label: "Pasar",
      href: "/dashboard/pasar",
      icon: <ShoppingBag className="h-5 w-5 shrink-0 text-blue-600" />,
    },
    {
      label: "Data Inflasi",
      href: "/dashboard/inflasi",
      icon: <ChartNoAxesCombined className="h-5 w-5 shrink-0 text-blue-600" />,
    },
    {
      label: "Manajemen Barang",
      href: "/dashboard/manajemen",
      icon: <ShoppingBasket className="h-5 w-5 shrink-0 text-blue-600" />,
    },
    {
      label: "Artikel",
      href: "/dashboard/Artikel",
      icon: <Newspaper className="h-5 w-5 shrink-0 text-blue-600" />,
    },
  ]

  const links =
    user.role === "operator"
      ? allLinks
      : allLinks
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Mobile Layout */}
      <div className="md:hidden w-full min-h-screen flex flex-col">
        <Sidebar open={open} setOpen={setOpen}>
          <SidebarBody className="flex flex-col justify-between gap-10 h-full">
            <div className="flex flex-col flex-1 space-y-1">
              {/* Logo Section */}
              <div className="pb-6 border-b border-blue-200/50">
                <Logo />
              </div>
              
              {/* Navigation Links */}
              <div className="pt-4 space-y-1">
                {links.map((link, idx) => (
                  <SidebarLink key={idx} link={link} />
                ))}
              </div>
            </div>
            
            {/* User Profile Section */}
            <div className="pt-6 border-t border-blue-200/50">
              <SidebarLink
                link={{
                  label: user.name,
                  href: "#",
                  icon: (
                    <div className="relative">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg border-2 border-white">
                        <span className="text-white font-semibold text-sm">{firstLetter}</span>
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                    </div>
                  ),
                  dropdownItems: [
                    { 
                      label: "Profil Saya", 
                      href: "/settings/profile", 
                      icon: <User className="h-4 w-4 text-gray-600" /> 
                    },
                    { 
                      label: "Keluar", 
                      href: "/logout", 
                      method: "post", 
                      as: "button", 
                      icon: <LogOut className="h-4 w-4 text-red-500" /> 
                    },
                  ],
                }}
              />
            </div>
          </SidebarBody>
        </Sidebar>

        {/* Mobile Content */}
        <div className="flex-1 p-4">
          <div className="min-h-[85vh] w-full bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-blue-200/30 p-5 overflow-y-auto">
            <div className="absolute inset-0 opacity-5 pointer-events-none rounded-2xl overflow-hidden">
              <div className="h-full w-full bg-[radial-gradient(circle_at_1px_1px,rgb(59,130,246)_1px,transparent_0)] bg-[length:30px_30px]" />
            </div>
            <div className="relative z-10">
              {children}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex w-full min-h-screen">
        <Sidebar open={open} setOpen={setOpen}>
          <SidebarBody className="flex flex-col items-center justify-center gap-10 h-screen">
            <div className="flex flex-col flex-1">
              {/* Logo Section */}
              <div className="pb-6 border-b border-blue-200/50">
                {open ? <Logo /> : <LogoIcon />}
              </div>
              
              {/* Navigation Links */}
              <div className="pt-4 space-y-1">
                {links.map((link, idx) => (
                  <SidebarLink key={idx} link={link} />
                ))}
              </div>
            </div>
            
            {/* User Profile Section */}
            <div className="pt-6 border-t border-blue-200/50">
              <SidebarLink
                link={{
                  label: user.name,
                  href: "#",
                  icon: (
                    <div className="relative">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg border-2 border-white">
                        <span className="text-white font-semibold text-sm">{firstLetter}</span>
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                    </div>
                  ),
                  dropdownItems: [
                    { 
                      label: "Profil Saya", 
                      href: "/settings/profile", 
                      icon: <User className="h-4 w-4 text-gray-600" /> 
                    },
                    { 
                      label: "Keluar", 
                      href: "/logout", 
                      method: "post", 
                      as: "button", 
                      icon: <LogOut className="h-4 w-4 text-red-500" /> 
                    },
                  ],
                }}
              />
            </div>
          </SidebarBody>
        </Sidebar>

        {/* Desktop Content */}
        <div className="flex flex-1 min-h-screen">
          <div className="flex w-full flex-1 flex-col">
            <div className="flex-1 p-4 md:p-8 lg:p-10">
              <div className="h-full w-full bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-200/30 p-6 md:p-8 lg:p-10 overflow-y-auto">
                <div className="absolute inset-0 opacity-5 pointer-events-none rounded-2xl overflow-hidden">
                  <div className="h-full w-full bg-[radial-gradient(circle_at_1px_1px,rgb(59,130,246)_1px,transparent_0)] bg-[length:30px_30px]" />
                </div>
                <div className="relative z-10">
                  {children}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const Logo = () => (
  <div className="flex items-center space-x-3 py-2">
    <div className="relative">
      <img 
        src="/images/logokomet.png"
        alt="Metro Kita" 
        className="h-10 w-10 object-contain rounded-xl shadow-lg border border-blue-200 bg-white p-1" 
      />
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl opacity-20 blur-sm -z-10"></div>
    </div>
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex flex-col"
    >
      <span className="font-bold text-xl text-gray-800">BAPOKTING</span>
      <span className="text-xs text-blue-600 font-medium">Dashboard</span>
    </motion.div>
  </div>
)

const LogoIcon = () => (
  <div className="flex items-center justify-center py-2">
    <div className="relative">
      <img 
        src="/images/logokomet.png" 
        alt="Metro Kita" 
        className="h-10 w-10 object-contain rounded-xl shadow-lg border border-white/20 bg-white/10 p-1 backdrop-blur-sm" 
      />
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl opacity-75 blur-sm -z-10"></div>
    </div>
  </div>
)