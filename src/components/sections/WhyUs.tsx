import React from 'react';
import { DollarSign, Clock, Award, RotateCcw, Shield, TrendingUp } from 'lucide-react';

const WhyUs = () => {
  const advantages = [
    {
      icon: DollarSign,
      title: 'Biaya Fleksibel',
      description: 'Harga disesuaikan dengan scope dan kompleksitas project. Base on project, bukan per jam.',
      highlight: 'Sesuai Budget'
    },
    {
      icon: Clock,
      title: 'Timeline Jelas',
      description: 'Komunikasi terbuka dan transparan dengan update progress berkala.',
      highlight: 'Komunikatif'
    },
    {
      icon: Award,
      title: 'Kualitas Presentasi',
      description: 'Bantuan pengajaran materi presentasi dan ujian skripsi untuk hasil maksimal.',
      highlight: 'Ujian Terbantu'
    },
    {
      icon: TrendingUp,
      title: 'Track Record Terpercaya',
      description: 'Sejak 2022 sudah menangani 1000+ project dengan tingkat kepuasan klien yang tinggi.',
      highlight: '1000+ Project'
    },
    {
      icon: RotateCcw,
      title: 'Revisi Gratis',
      description: 'Semua revisi untuk requirement yang sudah disepakati di awal - 100% gratis.',
      highlight: 'No Hidden Cost'
    },
    {
      icon: Shield,
      title: 'Privasi Terjamin',
      description: 'NDA tersedia untuk menjaga kerahasiaan project dan data Anda.',
      highlight: 'Confidential'
    }
  ];

  return (
    <section id="why-us" className="py-20 relative">
      <div className="absolute inset-0 gradient-subtle opacity-80"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-gradient">Kenapa JokiPremium?</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Lebih dari sekadar jasa pembuatan aplikasi. Kami adalah partner Anda dalam mencapai kesuksesan akademik dan bisnis.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {advantages.map((advantage, index) => {
            const IconComponent = advantage.icon;
            return (
              <div 
                key={index}
                className="service-card group text-center animate-fade-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-gradient-brand rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <IconComponent className="w-8 h-8 text-background" />
                  </div>
                  
                  <div className="mb-4">
                    <span className="inline-block bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-semibold mb-3">
                      {advantage.highlight}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-4 text-foreground">
                    {advantage.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {advantage.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Social Proof */}
        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 animate-fade-up animation-delay-800">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-4 text-foreground">
              Ikuti Journey Kami
            </h3>
            <p className="text-muted-foreground">
              Lihat portfolio, tips, dan update project terbaru di social media kami
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <a 
              href="https://www.tiktok.com/@jokipremium"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-card border border-border rounded-xl px-6 py-4 hover:border-accent hover:shadow-card transition-smooth group"
            >
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-100">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                  <defs>
                    <linearGradient id="tiktok-gradient-whyus-1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#00f2ea" />
                      <stop offset="100%" stopColor="#ff0050" />
                    </linearGradient>
                    <linearGradient id="tiktok-gradient-whyus-2" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ff0050" />
                      <stop offset="100%" stopColor="#00f2ea" />
                    </linearGradient>
                  </defs>
                  
                  {/* Main TikTok 'd' shape - Cyan layer */}
                  <path
                    d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-.88-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43V7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.43z"
                    fill="url(#tiktok-gradient-whyus-1)"
                    transform="translate(-0.5, 0.5)"
                  />
                  
                  {/* Main TikTok 'd' shape - Pink layer */}
                  <path
                    d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-.88-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43V7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.43z"
                    fill="url(#tiktok-gradient-whyus-2)"
                    transform="translate(0.5, -0.5)"
                  />
                  
                  {/* Main TikTok 'd' shape - Black center */}
                  <path
                    d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-.88-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43V7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.43z"
                    fill="#000000"
                  />
                </svg>
              </div>
              <div className="text-left">
                <div className="font-semibold text-foreground group-hover:text-accent transition-colors">
                  TikTok
                </div>
                <div className="text-sm text-muted-foreground">
                  @jokipremium
                </div>
              </div>
            </a>

            <a 
              href="https://www.instagram.com/jokipremium"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-card border border-border rounded-xl px-6 py-4 hover:border-accent hover:shadow-card transition-smooth group"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.40z"/>
                </svg>
              </div>
              <div className="text-left">
                <div className="font-semibold text-foreground group-hover:text-accent transition-colors">
                  Instagram
                </div>
                <div className="text-sm text-muted-foreground">
                  @jokipremium
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyUs;