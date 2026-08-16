"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  User as UserIcon,
  Bike,
  ShieldCheck,
  Building2,
  LogOut,
  LayoutDashboard,
  ChevronDown,
  Settings,
  Package,
} from "lucide-react";
import { useAuth, User } from "../../context/AuthContext";

// --- Types & Constants ---
const NAV_LINKS = [
  { href: "/services", label: "Services" },
  { href: "/coverage", label: "Coverage" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/track", label: "Track Shipment" },
] as const;

const ROLE_CONFIGS: Record<string, { bg: string; icon: React.ReactNode; title: string; dashboardPath: string; label: string }> = {
  ADMIN: { bg: "bg-purple-600", icon: <ShieldCheck size={10} />, title: "Admin", dashboardPath: "/admin/dashboard", label: "Admin Portal" },
  SUPER_ADMIN: { bg: "bg-purple-600", icon: <ShieldCheck size={10} />, title: "Super Admin", dashboardPath: "/admin/dashboard", label: "Admin Portal" },
  RIDER: { bg: "bg-amber-500", icon: <Bike size={10} />, title: "Rider Partner", dashboardPath: "/rider/dashboard", label: "Rider Dashboard" },
  BUSINESS_OWNER: { bg: "bg-blue-600", icon: <Building2 size={10} />, title: "Business Partner", dashboardPath: "/business/dashboard", label: "Merchant Dashboard" },
  CUSTOMER: { bg: "bg-emerald-600", icon: <UserIcon size={10} />, title: "Customer", dashboardPath: "/dashboard", label: "Customer Dashboard" },
};

// --- Helper Functions ---
function getDisplayName(currentUser: User): string {
  const firstName = currentUser?.firstName?.trim();
  const lastName = currentUser?.lastName?.trim();

  if (firstName && lastName) return `${firstName} ${lastName}`;
  if (firstName) return firstName;
  if (lastName) return lastName;
  if (currentUser?.email) return currentUser.email.split("@")[0];
  return ROLE_CONFIGS[currentUser?.role]?.title || "User";
}

function getUserInitials(currentUser: User): string {
  const firstName = currentUser?.firstName?.trim();
  const lastName = currentUser?.lastName?.trim();

  if (firstName && lastName) return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  if (firstName) return firstName.charAt(0).toUpperCase();
  if (currentUser?.email) return currentUser.email.charAt(0).toUpperCase();
  return "U";
}

// --- Sub-components ---
function RoleBadge({ role }: { role: User["role"] }) {
  const config = ROLE_CONFIGS[role] || ROLE_CONFIGS.CUSTOMER;
  return (
    <div className={`absolute -bottom-1 -right-1 ${config.bg} text-white p-0.5 rounded-full ring-2 ring-white`} title={config.title}>
      {config.icon}
    </div>
  );
}

function UserAvatar({ user, sizeClass = "w-8 h-8 text-xs" }: { user: User; sizeClass?: string }) {
  return (
    <div className={`relative ${sizeClass} rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-900 font-extrabold shrink-0`}>
      <span>{getUserInitials(user)}</span>
      <RoleBadge role={user.role} />
    </div>
  );
}

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const { user, logout } = useAuth();

  const handleLogout = () => {
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    logout();
  };

  const currentRoleConfig = ROLE_CONFIGS[user?.role || "CUSTOMER"] || ROLE_CONFIGS.CUSTOMER;

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-1 group">
          <span className="font-black text-2xl tracking-tight text-neutral-900 leading-none">
            Aviorè<span className="text-emerald-600 group-hover:text-emerald-500 transition-colors">Go</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-neutral-600">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-emerald-600 transition-colors">
              {link.label}
            </Link>
          ))}
          {!user && (
            <Link href="/apply" className="hover:text-emerald-600 transition-colors">
              Become a Rider
            </Link>
          )}
        </div>

        {/* Desktop User Section */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-3 py-1.5 px-3.5 rounded-full border border-neutral-200 hover:border-neutral-300 transition-all bg-white cursor-pointer shadow-xs"
                aria-expanded={userDropdownOpen}
              >
                <div className="flex flex-col text-right">
                  <span className="text-xs font-extrabold text-neutral-900 leading-tight">
                    {getDisplayName(user)}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 leading-tight">
                    {currentRoleConfig.title}
                  </span>
                </div>

                <UserAvatar user={user} sizeClass="w-8 h-8 text-xs" />

                <ChevronDown size={14} className={`text-neutral-400 transition-transform duration-200 ${userDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {userDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-neutral-100 py-2 z-50 text-xs font-medium space-y-0.5 animate-in fade-in slide-in-from-top-2"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <div className="px-4 py-2.5 border-b border-neutral-100">
                    <p className="font-bold text-neutral-900 truncate">{getDisplayName(user)}</p>
                    <p className="text-[11px] text-neutral-400 truncate">{user.email}</p>
                  </div>

                  <Link
                    href={currentRoleConfig.dashboardPath}
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-neutral-700 hover:bg-neutral-50 hover:text-emerald-600 transition-colors"
                  >
                    <LayoutDashboard size={15} />
                    <span>{currentRoleConfig.label}</span>
                  </Link>

                  <Link
                    href="/profile"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-neutral-700 hover:bg-neutral-50 hover:text-emerald-600 transition-colors"
                  >
                    <Settings size={15} />
                    <span>Account Settings</span>
                  </Link>

                  <div className="border-t border-neutral-100 pt-1 mt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-rose-600 hover:bg-rose-50 transition-colors text-left font-bold cursor-pointer"
                    >
                      <LogOut size={15} />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="text-xs font-bold text-neutral-700 hover:text-emerald-600 px-4 py-2 transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/shipments/create"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-2.5 rounded-full shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02] flex items-center gap-1.5"
              >
                <Package size={14} />
                <span>Send Package</span>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-neutral-700 p-2 hover:bg-neutral-100 rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          {user && <UserAvatar user={user} sizeClass="w-7 h-7 text-[10px]" />}
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-neutral-200 px-5 pt-4 pb-6 space-y-4 shadow-xl animate-in slide-in-from-top-4">
          {user && (
            <div className="flex items-center gap-3 p-3.5 bg-neutral-50 rounded-2xl border border-neutral-100">
              <UserAvatar user={user} sizeClass="w-10 h-10 text-sm" />
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-sm text-neutral-900 leading-tight truncate">
                  {getDisplayName(user)}
                </span>
                <span className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wider">
                  {currentRoleConfig.title} Account
                </span>
              </div>
            </div>
          )}

          <div className="space-y-1 py-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-medium text-neutral-700 py-2 hover:text-emerald-600 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            {!user && (
              <Link
                href="/apply"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-medium text-neutral-700 py-2 hover:text-emerald-600 transition-colors"
              >
                Become a Rider
              </Link>
            )}
          </div>

          <div className="pt-3 border-t border-neutral-100 flex flex-col gap-2.5">
            {user ? (
              <>
                <Link
                  href={currentRoleConfig.dashboardPath}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3 text-xs font-bold text-white bg-emerald-600 rounded-xl flex items-center justify-center gap-2 shadow-sm"
                >
                  <LayoutDashboard size={16} />
                  <span>Go to {currentRoleConfig.title} Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-center py-3 text-xs font-bold text-rose-600 border border-rose-200 rounded-xl flex items-center justify-center gap-2 bg-rose-50/50 cursor-pointer"
                >
                  <LogOut size={16} />
                  <span>Log Out</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3 text-xs font-bold text-neutral-700 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition"
                >
                  Log In
                </Link>
                <Link
                  href="/shipments/create"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3 text-xs font-bold text-white bg-emerald-600 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20"
                >
                  <Package size={16} />
                  <span>Send Package</span>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}