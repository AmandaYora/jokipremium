import React from 'react';
import { Monitor, Smartphone, Laptop, GraduationCap } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: Monitor,
      title: 'Web Application',
      description: 'Laravel • Next.js • React • REST API • Database Design',
      features: ['Responsive Design', 'Admin Panel', 'User Management', 'API Integration']
    },
    {
      icon: Smartphone,
      title: 'Mobile Application',
      description: 'Android • Flutter • React Native',
      features: ['Cross Platform', 'Native Performance', 'App Store Ready', 'Push Notifications']
    },
    {
      icon: Laptop,
      title: 'Desktop Application',
      description: 'Electron • .NET • Java • Python',
      features: ['Cross Platform', 'File Management', 'System Integration', 'Offline Support']
    },
    {
      icon: GraduationCap,
      title: 'Tugas & Skripsi',
      description: 'Bimbingan end-to-end dari konsep sampai presentasi',
      features: ['Sistem Analysis', 'Documentation', 'Presentation Prep', 'Defense Support']
    }
  ];

  return (
    <section id="services" className="py-20 relative">
      <div className="absolute inset-0 gradient-subtle opacity-50"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-gradient">Layanan Kami</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Solusi lengkap untuk kebutuhan teknologi Mahasiswa dan UMK. 
            Dari pembuatan aplikasi hingga bimbingan skripsi.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div 
                key={index}
                className="service-card group animate-fade-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-brand rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <IconComponent className="w-8 h-8 text-background" />
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3 text-foreground">
                    {service.title}
                  </h3>
                  
                  <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                    {service.description}
                  </p>
                  
                  <div className="space-y-2 w-full">
                    {service.features.map((feature, featureIndex) => (
                      <div 
                        key={featureIndex}
                        className="flex items-center justify-center gap-2 text-sm"
                      >
                        <div className="w-2 h-2 bg-accent rounded-full"></div>
                        <span className="text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 animate-fade-up animation-delay-600">
          <p className="text-lg text-muted-foreground mb-6">
            Butuh konsultasi untuk menentukan solusi yang tepat? - GRATIS!
          </p>
          <button 
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-hero group"
          >
            <svg className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Diskusi Project Sekarang
          </button>
        </div>
      </div>
    </section>
  );
};

export default Services;