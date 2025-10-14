import React, { useState, useEffect } from 'react';
import { Button } from './button';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  const whatsappUrl = 'https://wa.me/6285173471146';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-smooth 
      glass shadow-card md:glass-0 md:shadow-none 
      ${isScrolled ? 'md:glass md:shadow-card' : 'md:bg-transparent'}
    `}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img 
              src="/assets/logo.png" 
              alt="JokiPremium Logo" 
              className="h-10 w-10 glow"
            />
            <span className="text-xl font-bold text-gradient">
              JokiPremium
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('home')}
              className="nav-link"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('services')}
              className="nav-link"
            >
              Layanan
            </button>
            <button 
              onClick={() => scrollToSection('flow')}
              className="nav-link"
            >
              Flow
            </button>
            <button 
              onClick={() => scrollToSection('why-us')}
              className="nav-link"
            >
              Kenapa Kami
            </button>
            <button 
              onClick={() => scrollToSection('faq')}
              className="nav-link"
            >
              FAQ
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="nav-link"
            >
              Kontak
            </button>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button 
              onClick={() => navigate('/admin/login')}
              variant="outline"
              size="sm"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Login
            </Button>
            <Button 
              onClick={() => window.open(whatsappUrl, '_blank')}
              variant="hero"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.69"/>
              </svg>
              Chat WhatsApp
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span className={`w-full h-0.5 bg-foreground transition-all ${
                isMobileMenuOpen ? 'rotate-45 translate-y-1' : ''
              }`} />
              <span className={`w-full h-0.5 bg-foreground mt-1 transition-all ${
                isMobileMenuOpen ? 'opacity-0' : ''
              }`} />
              <span className={`w-full h-0.5 bg-foreground mt-1 transition-all ${
                isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
              }`} />
            </div>
          </button>
        </div>

        {/* Mobile Menu - DIPERBAIKI */}
        <div className={`md:hidden transition-all duration-300 ${
          isMobileMenuOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
        } overflow-auto`}>
          <div className="pt-4 pb-4 space-y-2">
            <button 
              onClick={() => scrollToSection('home')}
              className="block w-full text-left nav-link py-2"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('services')}
              className="block w-full text-left nav-link py-2"
            >
              Layanan
            </button>
            <button 
              onClick={() => scrollToSection('flow')}
              className="block w-full text-left nav-link py-2"
            >
              Flow
            </button>
            <button 
              onClick={() => scrollToSection('why-us')}
              className="block w-full text-left nav-link py-2"
            >
              Kenapa Kami
            </button>
            <button 
              onClick={() => scrollToSection('faq')}
              className="block w-full text-left nav-link py-2"
            >
              FAQ
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="block w-full text-left nav-link py-2"
            >
              Kontak
            </button>
            
            {/* Buttons Container dengan spacing yang lebih baik */}
            <div className="pt-4 space-y-3 border-t border-border/50 mt-4">
              <Button 
                onClick={() => navigate('/admin/login')}
                variant="outline"
                className="w-full"
              >
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Button>
              <Button 
                onClick={() => window.open(whatsappUrl, '_blank')}
                variant="hero"
                className="w-full"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.69"/>
                </svg>
                Chat WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;