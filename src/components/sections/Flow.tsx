import React from 'react';
import { 
  MessageCircle, 
  Video, 
  FileSearch, 
  DollarSign, 
  FileCheck, 
  CreditCard, 
  Code, 
  Presentation, 
  Banknote, 
  Package, 
  CheckCircle 
} from 'lucide-react';

const Flow = () => {
  const steps = [
    {
      id: 1,
      icon: MessageCircle,
      title: 'Chat via WhatsApp',
      description: 'Mulai dengan chat untuk diskusi awal kebutuhan project'
    },
    {
      id: 2,
      icon: Video,
      title: 'Meet Online (Free)',
      description: 'Meeting online gratis untuk bahas requirement detail'
    },
    {
      id: 3,
      icon: FileSearch,
      title: 'Analisis Sistem',
      description: 'Analisis mendalam kebutuhan sistem dan fitur'
    },
    {
      id: 4,
      icon: DollarSign,
      title: 'Tentukan Fee & Durasi',
      description: 'Diskusi biaya dan timeline berdasarkan scope project'
    },
    {
      id: 5,
      icon: FileCheck,
      title: 'Deal / Kontrak Ringkas',
      description: 'Perjanjian sederhana untuk kejelasan kedua belah pihak'
    },
    {
      id: 6,
      icon: CreditCard,
      title: 'Down Payment',
      description: 'Pembayaran uang muka untuk memulai pengerjaan'
    },
    {
      id: 7,
      icon: Code,
      title: 'Pembuatan Project',
      description: 'Proses development dengan update berkala'
    },
    {
      id: 8,
      icon: Presentation,
      title: 'Presentasi / Demo (Online)',
      description: 'Demo hasil dan persiapan presentasi/ujian'
    },
    {
      id: 9,
      icon: Banknote,
      title: 'Pelunasan (Payment in Full)',
      description: 'Pembayaran sisa setelah project selesai'
    },
    {
      id: 10,
      icon: Package,
      title: 'Delivery Project',
      description: 'Serah terima project lengkap dengan dokumentasi'
    },
    {
      id: 11,
      icon: CheckCircle,
      title: 'Selesai (Done)',
      description: 'Project selesai dengan support terbatas'
    }
  ];

  return (
    <section id="flow" className="py-12 md:py-20 relative">
      <div className="absolute inset-0 bg-jp-deep"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-12 md:mb-16 animate-fade-up">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
            <span className="text-gradient">Alur Kerja</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-6 md:mb-8 px-2 md:px-0">
            Proses yang jelas dan terstruktur dari konsultasi awal hingga delivery project
          </p>
          
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 md:px-6 py-2 md:py-3 mx-2 md:mx-0">
            <svg className="w-4 md:w-5 h-4 md:h-5 text-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-accent font-semibold text-sm md:text-base text-center">
              Semua revisi untuk requirement yang sudah disepakati — GRATIS
            </span>
          </div>
        </div>

        {/* MOBILE LAYOUT - Only visible on mobile */}
        <div className="block md:hidden">
          <div className="relative max-w-lg mx-auto">
            {/* Mobile Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-jp-green via-jp-cyan to-jp-blue opacity-80 rounded-full">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-white/20 to-transparent animate-pulse"></div>
            </div>
            
            {/* Mobile Timeline Steps */}
            <div className="space-y-6">
              {steps.map((step, index) => {
                const IconComponent = step.icon;
                
                return (
                  <div 
                    key={step.id}
                    className="relative animate-fade-up flex items-start gap-4"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    {/* Mobile Icon Circle */}
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-brand rounded-full flex items-center justify-center shadow-lg">
                        <IconComponent className="w-6 h-6 text-background" />
                      </div>
                      
                      {/* Mobile Step Number Badge */}
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-accent rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-xs font-bold text-accent-foreground">
                          {step.id}
                        </span>
                      </div>
                    </div>

                    {/* Mobile Content Card */}
                    <div className="flex-1 min-w-0">
                      <div className="service-card group relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-brand opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-xl"></div>
                        
                        <div className="relative z-10">
                          <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-accent transition-colors">
                            {step.title}
                          </h3>
                          
                          <p className="text-sm text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* DESKTOP LAYOUT - Only visible on desktop (keeping original design) */}
        <div className="hidden md:block">
          <div className="relative max-w-4xl mx-auto">
            {/* Desktop Timeline Line with Gradient Animation */}
            <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-jp-green via-jp-cyan to-jp-blue opacity-80 rounded-full">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-white/20 to-transparent animate-pulse"></div>
            </div>
            
            {/* Desktop Timeline Steps */}
            <div className="space-y-12">
              {steps.map((step, index) => {
                const IconComponent = step.icon;
                const isEven = index % 2 === 0;
                
                return (
                  <div 
                    key={step.id}
                    className={`relative flex items-center ${
                      isEven ? 'justify-start' : 'justify-end'
                    } animate-fade-up`}
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    {/* Desktop Content Card */}
                    <div className={`relative w-full max-w-sm ${
                      isEven ? 'pr-8 text-right' : 'pl-8 text-left'
                    }`}>
                      <div className="service-card group relative overflow-hidden">
                        {/* Card Glow Effect */}
                        <div className="absolute inset-0 bg-gradient-brand opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-xl"></div>
                        
                        <div className="relative z-10">
                          <div className={`flex items-center gap-4 mb-4 ${
                            isEven ? 'justify-end' : 'justify-start'
                          }`}>
                            <div className={`flex items-center gap-2 ${
                              isEven ? 'flex-row-reverse' : 'flex-row'
                            }`}>
                              <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
                                <span className="text-sm font-bold text-accent">
                                  {step.id.toString().padStart(2, '0')}
                                </span>
                              </div>
                              <div className="h-px w-8 bg-gradient-brand"></div>
                            </div>
                          </div>
                          
                          <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-accent transition-colors">
                            {step.title}
                          </h3>
                          
                          <p className="text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Desktop Central Icon Circle */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 z-20">
                      <div className="relative">
                        {/* Pulsing Ring */}
                        <div className="absolute inset-0 w-20 h-20 bg-gradient-brand rounded-full animate-ping opacity-20"></div>
                        
                        {/* Main Icon Circle */}
                        <div className="relative w-20 h-20 bg-gradient-brand rounded-full flex items-center justify-center shadow-glow group-hover:scale-110 transition-all duration-300">
                          <div className="w-16 h-16 bg-background/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                            <IconComponent className="w-8 h-8 text-background" />
                          </div>
                        </div>
                        
                        {/* Step Number Badge */}
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center shadow-lg animate-bounce" style={{ animationDelay: `${index * 200}ms` }}>
                          <span className="text-xs font-bold text-accent-foreground">
                            {step.id}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Desktop Connection Lines */}
                    {index < steps.length - 1 && (
                      <div className="absolute left-1/2 transform -translate-x-1/2 top-20 w-px h-12 bg-gradient-to-b from-accent/50 to-transparent opacity-60"></div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Desktop Floating Particles Animation */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/30 rounded-full animate-float"></div>
              <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-accent/30 rounded-full animate-float animation-delay-2000"></div>
              <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-secondary/30 rounded-full animate-float animation-delay-4000"></div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12 md:mt-16 animate-fade-up animation-delay-1000 px-4">
          <p className="text-base md:text-lg text-muted-foreground mb-6">
            Siap memulai project impian Anda?
          </p>
          <button 
            onClick={() => window.open('https://wa.me/6285173471146', '_blank')}
            className="btn-hero group"
          >
            <MessageCircle className="w-4 md:w-5 h-4 md:h-5 mr-2 group-hover:scale-110 transition-transform" />
            Mulai Chat Sekarang
          </button>
        </div>
      </div>
    </section>
  );
};

export default Flow;