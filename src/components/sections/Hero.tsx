import React from 'react';
import { Button } from '../ui/button';

const Hero = () => {
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const whatsappUrl = 'https://wa.me/6285173471146';

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 gradient-subtle">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-jp-green/10 rounded-full animate-blob filter blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-jp-cyan/10 rounded-full animate-blob animation-delay-2000 filter blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-jp-blue/10 rounded-full animate-blob animation-delay-4000 filter blur-3xl"></div>
      </div>

      {/* Gradient Glow */}
      <div className="absolute inset-0 gradient-glow opacity-50"></div>

      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left animate-fade-up">
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2 mb-6">
                <div className="flex gap-1">
                  <span className="inline-block px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium">
                    Mahasiswa
                  </span>
                  <span className="inline-block px-3 py-1 bg-secondary/20 text-secondary rounded-full text-sm font-medium">
                    UMK/UMKM
                  </span>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
                <span className="text-gradient">JokiPremium</span>
                <br />
                <span className="text-foreground/90">
                  Jasa Pembuatan Aplikasi & Bimbingan Skripsi
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl lg:max-w-none">
                <span className="text-accent font-semibold">Web • Mobile • Desktop</span>
                <br />
                Fokus membantu Mahasiswa (Tugas/Skripsi/TA) dan UMK. 
                <br />
                <span className="text-primary">Biaya fleksibel sesuai proyek.</span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                onClick={scrollToContact}
                variant="hero"
                size="lg"
              >
                <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Konsultasi Gratis
              </Button>
              
              <Button 
                onClick={() => window.open(whatsappUrl, '_blank')}
                variant="glass"
                size="lg"
              >
                <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.69"/>
                </svg>
                Chat WhatsApp
              </Button>
            </div>
          </div>

          {/* Illustration */}
          <div className="relative animate-scale-in animation-delay-300">
            <div className="relative z-10">
              {/* Device Mockups */}
              <div className="flex items-center justify-center space-x-4">
                {/* Mobile */}
                <div className="w-16 h-28 bg-card border-2 border-accent/20 rounded-lg flex items-center justify-center animate-float">
                  <div className="w-8 h-16 bg-gradient-brand rounded opacity-80"></div>
                </div>
                
                {/* Desktop */}
                <div className="w-32 h-20 bg-card border-2 border-accent/20 rounded-lg flex items-center justify-center animate-float animation-delay-1000">
                  <div className="w-24 h-12 bg-gradient-brand rounded opacity-80"></div>
                </div>
                
                {/* Tablet */}
                <div className="w-20 h-28 bg-card border-2 border-accent/20 rounded-lg flex items-center justify-center animate-float animation-delay-2000">
                  <div className="w-12 h-20 bg-gradient-brand rounded opacity-80"></div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-8 -left-8 w-4 h-4 bg-primary rounded-full animate-float opacity-60"></div>
              <div className="absolute -top-4 -right-12 w-6 h-6 bg-accent rounded-full animate-float animation-delay-1500 opacity-60"></div>
              <div className="absolute -bottom-6 -left-6 w-5 h-5 bg-secondary rounded-full animate-float animation-delay-3000 opacity-60"></div>
              <div className="absolute -bottom-8 -right-8 w-3 h-3 bg-primary rounded-full animate-float animation-delay-2500 opacity-60"></div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-accent rounded-full flex justify-center">
            <div className="w-1 h-3 bg-accent rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;