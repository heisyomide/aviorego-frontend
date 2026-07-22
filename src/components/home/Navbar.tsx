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
} from "lucide-react";
import { useAuth, User } from "../../context/AuthContext"; // Adjust import path if needed

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Pull real auth state and actions from AuthContext
  const { user, logout } = useAuth();

  const handleLogout = () => {
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    logout();
  };

  // Helper to get initials dynamically from real user name
  const getUserInitials = (user: User) => {
    const firstInitial = user.firstName ? user.firstName.charAt(0) : "";
    const lastInitial = user.lastName ? user.lastName.charAt(0) : "";
    const initials = `${firstInitial}${lastInitial}`.toUpperCase();
    return initials || user.email?.charAt(0).toUpperCase() || "U";
  };

  // Helper to render role-specific badge icon on avatar
  const renderRoleBadge = (role: User["role"]) => {
    switch (role) {
      case "ADMIN":
      case "SUPER_ADMIN":
        return (
          <div
            className="absolute -bottom-1 -right-1 bg-purple-600 text-white p-0.5 rounded-full ring-2 ring-white"
            title="Admin"
          >
            <ShieldCheck size={10} />
          </div>
        );
      case "RIDER":
        return (
          <div
            className="absolute -bottom-1 -right-1 bg-amber-500 text-white p-0.5 rounded-full ring-2 ring-white"
            title="Rider Partner"
          >
            <Bike size={10} />
          </div>
        );
      case "BUSINESS_OWNER":
        return (
          <div
            className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-0.5 rounded-full ring-2 ring-white"
            title="Business Partner"
          >
            <Building2 size={10} />
          </div>
        );
      case "CUSTOMER":
      default:
        return (
          <div
            className="absolute -bottom-1 -right-1 bg-emerald-600 text-white p-0.5 rounded-full ring-2 ring-white"
            title="Customer"
          >
            <UserIcon size={10} />
          </div>
        );
    }
  };

  // Helper to route to the appropriate dashboard per role
  const getDashboardPath = (role: User["role"]) => {
    switch (role) {
      case "ADMIN":
      case "SUPER_ADMIN":
        return "/admin/dashboard";
      case "RIDER":
        return "/rider/dashboard";
      case "BUSINESS_OWNER":
        return "/business/dashboard";
      case "CUSTOMER":
      default:
        return "/dashboard";
    }
  };

  // Helper to format role name nicely for display
  const formatRoleLabel = (role: User["role"]) => {
    switch (role) {
      case "SUPER_ADMIN":
        return "Super Admin";
      case "ADMIN":
        return "Admin";
      case "RIDER":
        return "Rider";
      case "BUSINESS_OWNER":
        return "Business";
      case "CUSTOMER":
      default:
        return "Customer";
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-neutral-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo Text Only */}
        <Link href="/" className="flex items-center">
          <span className="font-black text-2xl tracking-tight text-neutral-900 leading-none">
            Aviorè<span className="text-emerald-600">Go</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-neutral-600">
          <Link href="/services" className="hover:text-emerald-600 transition-colors">
            Services
          </Link>
          <Link href="/coverage" className="hover:text-emerald-600 transition-colors">
            Coverage
          </Link>
          <Link href="/how-it-works" className="hover:text-emerald-600 transition-colors">
            How It Works
          </Link>
          <Link href="/track" className="hover:text-emerald-600 transition-colors">
            Track Shipment
          </Link>
          {!user && (
            <Link href="/apply" className="hover:text-emerald-600 transition-colors">
              Become a Rider
            </Link>
          )}
        </div>

        {/* Desktop User Section */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            /* Logged In User Dropdown Menu */
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 pl-3 rounded-full border border-neutral-200 hover:border-neutral-300 transition-all bg-neutral-50/50 cursor-pointer"
              >
                <div className="flex flex-col text-right max-w-[130px]">
                  <span className="text-xs font-bold text-neutral-800 leading-none truncate">
                    {user.firstName} {user.lastName}
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mt-0.5">
                    {formatRoleLabel(user.role)}
                  </span>
                </div>

                <div className="relative w-8 h-8 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-800 font-extrabold text-xs shrink-0">
                  <span>{getUserInitials(user)}</span>
                  {renderRoleBadge(user.role)}
                </div>

                <ChevronDown size={14} className="text-neutral-400 mr-1" />
              </button>

              {/* Dynamic Dropdown Card */}
              {userDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-neutral-100 py-2 z-50 text-xs font-medium space-y-1"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-neutral-100">
                    <p className="font-bold text-neutral-900 truncate">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-[11px] text-neutral-400 truncate">{user.email}</p>
                  </div>

                  {/* Role-Specific Dashboard Route */}
                  <Link
                    href={getDashboardPath(user.role)}
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-neutral-700 hover:bg-neutral-50 hover:text-emerald-600 transition-colors"
                  >
                    <LayoutDashboard size={16} />
                    <span>
                      {user.role === "ADMIN" || user.role === "SUPER_ADMIN"
                        ? "Admin Portal"
                        : user.role === "RIDER"
                        ? "Rider Dashboard"
                        : user.role === "BUSINESS_OWNER"
                        ? "Merchant Dashboard"
                        : "Customer Dashboard"}
                    </span>
                  </Link>

                  <Link
                    href="/profile"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-neutral-700 hover:bg-neutral-50 hover:text-emerald-600 transition-colors"
                  >
                    <Settings size={16} />
                    <span>Account Settings</span>
                  </Link>

                  <div className="border-t border-neutral-100 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-rose-600 hover:bg-rose-50 transition-colors text-left font-bold cursor-pointer"
                    >
                      <LogOut size={16} />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Logged Out Buttons */
            <>
              <Link
                href="/login"
                className="text-xs font-bold text-neutral-700 hover:text-emerald-600 px-4 py-2 transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/shipments/create"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-full shadow-md shadow-emerald-600/20 transition-all hover:scale-105"
              >
                Send Package
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-neutral-700 p-2 hover:bg-neutral-100 rounded-lg transition-colors flex items-center gap-2"
          aria-label="Toggle navigation menu"
        >
          {user && (
            <div className="relative w-7 h-7 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-800 font-extrabold text-xs">
              {getUserInitials(user)}
              {renderRoleBadge(user.role)}
            </div>
          )}
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-neutral-200 px-4 pt-3 pb-6 space-y-3">
          {/* Dynamic Mobile User Card */}
          {user && (
            <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-2xl border border-neutral-100 mb-2">
              <div className="relative w-10 h-10 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-800 font-extrabold text-sm shrink-0">
                {getUserInitials(user)}
                {renderRoleBadge(user.role)}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-sm text-neutral-900 leading-tight truncate">
                  {user.firstName} {user.lastName}
                </span>
                <span className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider">
                  {formatRoleLabel(user.role)} Account
                </span>
              </div>
            </div>
          )}

          {/* Nav Links */}
          <Link
            href="/services"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-neutral-700 py-1.5 hover:text-emerald-600"
          >
            Services
          </Link>
          <Link
            href="/coverage"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-neutral-700 py-1.5 hover:text-emerald-600"
          >
            Coverage
          </Link>
          <Link
            href="/how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-neutral-700 py-1.5 hover:text-emerald-600"
          >
            How It Works
          </Link>
          <Link
            href="/track"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-neutral-700 py-1.5 hover:text-emerald-600"
          >
            Track Shipment
          </Link>

          {/* Action CTAs for Mobile */}
          <div className="pt-3 border-t border-neutral-100 flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  href={getDashboardPath(user.role)}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-xs font-bold text-white bg-emerald-600 rounded-xl flex items-center justify-center gap-2"
                >
                  <LayoutDashboard size={16} />
                  <span>
                    Go to {formatRoleLabel(user.role)} Dashboard
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-center py-2.5 text-xs font-bold text-rose-600 border border-rose-200 rounded-xl flex items-center justify-center gap-2 bg-rose-50/50 cursor-pointer"
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
                  className="w-full text-center py-2.5 text-xs font-bold text-neutral-700 border border-neutral-200 rounded-xl"
                >
                  Log In
                </Link>
                <Link
                  href="/shipments/create"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-xs font-bold text-white bg-emerald-600 rounded-xl"
                >
                  Send Package
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}