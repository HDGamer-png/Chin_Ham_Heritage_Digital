'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { Menu, X, Sparkles, ChevronDown, Box, KeyRound, GraduationCap, Compass } from 'lucide-react';

const journeySubItems = [
  {
    href: '/hien-vat-3d',
    label: 'Showroom Hiện Vật 3D',
    desc: 'Xoay 360°, đèn pin soi rãnh đinh, X-Ray',
    icon: Box,
  },
  {
    href: '/giai-ma',
    label: 'Giải Mã Ký Ức 1963',
    desc: 'Web-Quest 4 trạm trinh sát, nhận chứng nhận',
    icon: KeyRound,
  },
  {
    href: '/dau-tri-ba-don',
    label: 'Đấu Trí & Góc Học Đường',
    desc: 'Thi đố lịch sử, bảng vàng, phiếu in A4',
    icon: GraduationCap,
  },
];

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileJourneyOpen, setMobileJourneyOpen] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className={`sticky top-0 z-50 border-b border-emerald-500/15 bg-[#0c120e]/25 backdrop-blur-[6px] transition duration-300 ${mobileMenuOpen ? 'mobile-menu-active' : ''}`}>
      <div className="container-shell flex items-center justify-between py-3.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <img
            src="/Logo CH1.png"
            alt="Logo Chín Hầm"
            className="h-11 w-11 object-contain drop-shadow-md transition-transform duration-300 group-hover:scale-105"
          />
          <div>
            <div className="text-sm font-bold uppercase tracking-[0.2em] text-[#fef08a] font-display">
              Chín Hầm
            </div>
            <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
              <Sparkles size={11} /> Di sản công nghệ số Huế
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          <Link
            href="/"
            className="rounded-full px-3.5 py-1.5 text-xs uppercase tracking-wider font-medium text-stone-200 transition-all hover:text-emerald-300 hover:bg-emerald-950/40 hover:border hover:border-emerald-500/30"
          >
            Trang chủ
          </Link>
          <Link
            href="/di-tich"
            className="rounded-full px-3.5 py-1.5 text-xs uppercase tracking-wider font-medium text-stone-200 transition-all hover:text-emerald-300 hover:bg-emerald-950/40 hover:border hover:border-emerald-500/30"
          >
            Di tích
          </Link>

          {/* HÀNH TRÌNH KÝ ỨC DROPDOWN */}
          <div
            ref={dropdownRef}
            className="relative"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <Link
              href="/hanh-trinh-ky-uc"
              onClick={() => setDropdownOpen(false)}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs uppercase tracking-wider font-medium transition-all ${
                dropdownOpen
                  ? 'text-emerald-300 bg-emerald-950/60 border border-emerald-500/40'
                  : 'text-stone-200 hover:text-emerald-300 hover:bg-emerald-950/40 hover:border hover:border-emerald-500/30'
              }`}
            >
              <Compass size={14} className="text-emerald-400" />
              <span>Hành trình ký ức</span>
              <ChevronDown
                size={13}
                className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180 text-emerald-400' : 'text-stone-400'}`}
              />
            </Link>

            {/* Dropdown Floating Panel */}
            {dropdownOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-80 rounded-2xl border border-emerald-500/30 bg-[#0a100c]/95 p-3 shadow-2xl backdrop-blur-2xl animate-fadeIn z-50">
                <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-400/90 border-b border-emerald-500/20 mb-1 flex items-center justify-between">
                  <span>3 Phân Khu Tương Tác</span>
                  <Link
                    href="/hanh-trinh-ky-uc"
                    className="text-[10px] lowercase text-stone-400 hover:text-emerald-300 underline"
                  >
                    xem tất cả ↗
                  </Link>
                </div>

                <div className="space-y-1">
                  {journeySubItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-start gap-3 p-2.5 rounded-xl transition hover:bg-emerald-950/50 hover:border hover:border-emerald-500/20 group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-black/60 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:border-emerald-400 transition shrink-0 mt-0.5">
                          <Icon size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-stone-100 group-hover:text-emerald-300 transition truncate">
                            {item.label}
                          </div>
                          <div className="text-[11px] text-stone-400 leading-snug truncate">
                            {item.desc}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <Link
            href="/ban-do-360"
            className="rounded-full px-3.5 py-1.5 text-xs uppercase tracking-wider font-medium text-stone-200 transition-all hover:text-emerald-300 hover:bg-emerald-950/40 hover:border hover:border-emerald-500/30"
          >
            Bản đồ 360°
          </Link>
          <Link
            href="/audio-guide"
            className="rounded-full px-3.5 py-1.5 text-xs uppercase tracking-wider font-medium text-stone-200 transition-all hover:text-emerald-300 hover:bg-emerald-950/40 hover:border hover:border-emerald-500/30"
          >
            Audio Guide
          </Link>
          <Link
            href="/chatbot"
            className="rounded-full px-3.5 py-1.5 text-xs uppercase tracking-wider font-medium text-stone-200 transition-all hover:text-emerald-300 hover:bg-emerald-950/40 hover:border hover:border-emerald-500/30"
          >
            Chatbot AI
          </Link>
        </nav>

        {/* Action Button */}
        <div className="hidden md:block">
          <Link
            href="/lien-he"
            className="rounded-full border border-emerald-400/40 bg-gradient-to-r from-emerald-600/90 via-emerald-600/80 to-teal-700/90 px-5 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] hover:border-emerald-300 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Đặt lịch tham quan
          </Link>
        </div>

        {/* Mobile Toggle Button */}
        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((open) => !open)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-950/40 text-white transition hover:bg-emerald-900/60 md:hidden"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-white/10 bg-stone-950/98 p-6 backdrop-blur-2xl md:hidden">
          <div className="flex flex-col space-y-4">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium text-stone-200 hover:text-emerald-400"
            >
              Trang chủ
            </Link>
            <Link
              href="/di-tich"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium text-stone-200 hover:text-emerald-400"
            >
              Di tích
            </Link>

            {/* Mobile Journey Section Group */}
            <div className="rounded-2xl border border-amber-500/30 bg-black/40 p-3 space-y-2">
              <div
                onClick={() => setMobileJourneyOpen((v) => !v)}
                className="flex items-center justify-between text-base font-bold text-amber-300 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Compass size={17} className="text-amber-400" />
                  <span>Hành trình ký ức</span>
                </div>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${mobileJourneyOpen ? 'rotate-180' : ''}`}
                />
              </div>

              {mobileJourneyOpen && (
                <div className="pl-3 space-y-2 pt-1 border-l-2 border-amber-500/30 ml-2">
                  <Link
                    href="/hanh-trinh-ky-uc"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-xs font-semibold text-amber-400 hover:underline"
                  >
                    → Trung tâm Hành trình ký ức
                  </Link>
                  {journeySubItems.map((sub) => (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-sm font-medium text-stone-300 hover:text-amber-300"
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/ban-do-360"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium text-stone-200 hover:text-emerald-400"
            >
              Bản đồ 360°
            </Link>
            <Link
              href="/audio-guide"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium text-stone-200 hover:text-emerald-400"
            >
              Audio Guide
            </Link>
            <Link
              href="/chatbot"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium text-stone-200 hover:text-emerald-400"
            >
              Chatbot AI
            </Link>

            <Link
              href="/lien-he"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 inline-block rounded-xl bg-emerald-600 px-4 py-2.5 text-center text-sm font-bold text-white shadow-md"
            >
              Đặt lịch tham quan
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
