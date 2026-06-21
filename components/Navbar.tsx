'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useCart, useSettings } from '@/lib/store';
import { useTranslation } from '@/lib/translations';
import { supabase } from '@/lib/supabase';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const cartCount = useCart((state) => state.getCount());
  const { language, darkMode, setLanguage, toggleDarkMode } = useSettings();
  const t = useTranslation(language);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    supabase.auth.getUser().then(async ({ data }) => {
      setUser(data.user);
      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', data.user.id)
          .single();
        setIsAdmin(profile?.is_admin || false);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null);
    });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [darkMode, language]);

  const navLinks = [
    { name: t.home, href: '/' },
    { name: t.products, href: '/products' },
    { name: t.dresses, href: '/products?category=dresses' },
    { name: t.abayas, href: '/products?category=abayas' },
    { name: t.sale, href: '/products?sale=true' },
  ];

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 dark:bg-black/95 backdrop-blur-md shadow-md' : 'bg-white dark:bg-black'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="text-2xl md:text-3xl font-bold tracking-tight">
            <span className="text-black dark:text-white">LUXE</span>
            <span className="text-amber-500"> FEMME</span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-amber-500 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-xl"
            >
              {mounted && (darkMode ? '☀️' : '🌙')}
            </button>

            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-xl"
              >
                {mounted && languages.find((l) => l.code === language)?.flag}
              </button>
              {langOpen && (
                <div className="absolute top-12 right-0 bg-white dark:bg-gray-900 rounded-xl shadow-lg py-2 w-40 z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code as any);
                        setLangOpen(false);
                      }}
                      className="w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2"
                    >
                      <span>{lang.flag}</span>
                      <span className="text-sm dark:text-white">{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link href="/cart" className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-xl">
              🛍️
              {mounted && cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {mounted && isAdmin && (
              <Link
                href="/admin"
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-xl"
                title="لوحة التحكم"
              >
                🎛️
              </Link>
            )}

            <Link
              href={user ? '/orders' : '/login'}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-xl"
            >
              👩
            </Link>

            <button className="lg:hidden p-2 text-xl" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="lg:hidden py-4 border-t dark:border-gray-800">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block py-3 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-amber-500 px-4 rounded"
              >
                {link.name}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}