import { cn } from "@/lib/utils";
import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Link } from '@inertiajs/react'
import { Menu } from "lucide-react";

interface Links {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined
);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate: animate }}>
      {children as React.ReactNode}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children as React.ReactNode}
    </SidebarProvider>
  );
};

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  return (
    <>
      {/* Desktop Sidebar - Hanya tampil di desktop */}
      <div className="hidden md:block">
        <DesktopSidebar {...props} />
      </div>
      {/* Mobile Sidebar - Hanya tampil di mobile */}
      <div className="md:hidden">
        <MobileSidebar {...(props as React.ComponentProps<"div">)} />
      </div>
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <motion.div
      className={cn(
        "h-screen px-4 py-6 flex flex-col bg-gradient-to-b from-blue-50 via-white to-blue-50 shadow-xl border-r border-blue-200 w-[280px] shrink-0 overflow-hidden sticky top-0",
        className
      )}
      animate={{
        width: animate ? (open ? "280px" : "80px") : "280px",
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...props}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 via-transparent to-indigo-100/30 pointer-events-none" />
      
      {/* Subtle pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="h-full w-full bg-[radial-gradient(circle_at_center,rgb(59,130,246)_1px,transparent_1px)] bg-[length:20px_20px]" />
      </div>
      
      <div className="relative z-10 h-full">
        {children as React.ReactNode}
      </div>
    </motion.div>
  );
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { open, setOpen } = useSidebar();
  return (
    <>
      {/* Mobile Header */}
      <div
        className={cn(
          "h-16 px-6 py-4 flex flex-row items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg w-full relative overflow-hidden"
        )}
        {...props}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 pointer-events-none" />
        
        {/* Logo area - mobile */}
        <div className="flex items-center space-x-3 z-10">
          <img 
            src="/images/logokomet.png" 
            alt="Metro Kita" 
            className="h-8 w-8 object-contain rounded-lg shadow-md" 
          />
          <span className="font-bold text-lg text-white">BAPOKTING</span>
        </div>
        
        {/* Menu button */}
        <div className="flex justify-end z-20">
          <button
            onClick={() => setOpen(!open)}
            className="p-2 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all duration-200 shadow-lg"
          >
            <Menu className="text-white h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setOpen(false)}
            />
            
            {/* Sidebar */}
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 200,
              }}
              className={cn(
                "fixed left-0 top-0 h-full w-80 bg-gradient-to-b from-white via-blue-50 to-white shadow-2xl z-50 flex flex-col border-r border-blue-200 overflow-hidden",
                className
              )}
            >
              {/* Background effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 via-transparent to-indigo-100/30 pointer-events-none" />
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="h-full w-full bg-[radial-gradient(circle_at_center,rgb(59,130,246)_1px,transparent_1px)] bg-[length:20px_20px]" />
              </div>
              
              {/* Content */}
              <div className="relative z-10 flex-1 p-6 overflow-y-auto">
                {children}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export const SidebarLink = ({
  link,
  className,
  ...props
}: {
  link: Links & {
    dropdownItems?: {
      label: string
      href: string
      method?: string
      as?: string
      icon?: React.ReactNode
    }[]
  }
  className?: string
}) => {
  const { open, animate } = useSidebar()

  // === Case Dropdown ===
  if (link.dropdownItems && link.dropdownItems.length > 0) {
    return (
      <div className="dropdown dropdown-top w-full">
        {/* Trigger */}
        <div
          tabIndex={0}
          role="button"
          className={cn(
            "flex items-center gap-3 py-3 px-4 cursor-pointer w-full group/sidebar rounded-xl transition-all duration-200 hover:bg-blue-100 hover:shadow-md border border-transparent hover:border-blue-200",
            className
          )}
        >
          <div className="p-1.5 rounded-lg bg-blue-100 group-hover/sidebar:bg-blue-200 transition-all duration-200 flex items-center justify-center">
            {link.icon}
          </div>
          <motion.span
            animate={{
              display: animate ? (open ? "inline-block" : "none") : "inline-block",
              opacity: animate ? (open ? 1 : 0) : 1,
            }}
            className="text-gray-700 font-medium text-sm whitespace-pre"
          >
            {link.label}
          </motion.span>
        </div>

        {/* Dropdown Content */}
        <ul
          tabIndex={0}
          className="dropdown-content menu bg-white rounded-xl z-10 w-52 p-2 shadow-lg border border-blue-200"
        >
          {link.dropdownItems.map((item, idx) => (
            <li key={idx}>
              <Link
                href={item.href}
                method={item.method}
                as={item.as}
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  // === Default Link ===
  return (
    <a
      href={link.href}
      className={cn(
        "flex items-center gap-3 group/sidebar py-3 px-4 rounded-xl transition-all duration-200 hover:bg-blue-100 hover:shadow-md hover:border-blue-200 border border-transparent hover:translate-x-1 transform",
        className
      )}
      {...props}
    >
      <div className="p-1.5 rounded-lg bg-blue-100 group-hover/sidebar:bg-blue-200 transition-all duration-200">
        {link.icon}
      </div>
      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="text-gray-700 font-medium text-sm whitespace-pre group-hover/sidebar:text-blue-600 transition duration-200"
      >
        {link.label}
      </motion.span>
    </a>
  )
}