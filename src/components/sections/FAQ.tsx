import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev =>
      prev.includes(index)
        ? prev.filter(item => item !== index)
        : [...prev, index]
    );
  };

  const faqs = [
    {
      question: 'Bagaimana sistem pembayaran yang berlaku?',
      answer: 'Sistem pembayaran fleksibel sesuai kesepakatan. Umumnya ada down payment (DP) di awal, kemudian pelunasan setelah project selesai. Biaya ditentukan berdasarkan scope dan kompleksitas project, bukan per jam.'
    },
    {
      question: 'Berapa lama durasi pengerjaan project?',
      answer: 'Durasi tergantung kompleksitas project. Web sederhana: 1-4 hari, Mobile app: 1-4 minggu, Project skripsi: 2-6 minggu. Timeline akan didiskusikan detail saat meeting awal dan dibuat tertulis.'
    },
    {
      question: 'Apakah benar revisi gratis?',
      answer: 'Ya, GRATIS untuk semua revisi yang masih dalam scope requirement yang sudah disepakati di awal. Namun jika ada penambahan fitur baru di luar scope awal, akan ada biaya tambahan yang akan didiskusikan terlebih dahulu.'
    },
    {
      question: 'Bagaimana cara memulai project?',
      answer: 'Sangat mudah! Chat kami via WhatsApp → Meeting online gratis → Diskusi requirement → Tentukan fee & timeline → Deal kontrak → DP → Mulai pengerjaan. '
    },
    {
      question: 'Apakah bisa membantu untuk presentasi/ujian skripsi?',
      answer: 'Tentu! Kami tidak hanya membuat aplikasinya, tapi juga membantu menjelaskan materi presentasi, demo aplikasi, dan memberikan penjelasan teknis untuk menghadapi ujian skripsi atau sidang TA.'
    },
    {
      question: 'Project seperti apa yang bisa dikerjakan?',
      answer: 'Semua jenis aplikasi: Web (Laravel, React, Next.js), Mobile (Android, Flutter), Desktop (Electron, .NET), dan sistem informasi untuk skripsi/TA. Dari yang sederhana sampai kompleks dengan integrasi database dan API.'
    },
    {
      question: 'Apakah ada garansi atau support setelah project selesai?',
      answer: 'Ada support terbatas untuk bug fixing dalam 30 hari setelah delivery. Untuk support jangka panjang atau maintenance, bisa diatur dengan kontrak terpisah sesuai kebutuhan.'
    },
    {
      question: 'Bagaimana dengan kerahasiaan project?',
      answer: 'Privasi dan kerahasiaan project dijamin 100%. Untuk project sensitif, kami menyediakan NDA (Non-Disclosure Agreement) untuk memastikan keamanan data dan informasi Anda.'
    }
  ];

  return (
    <section id="faq" className="py-20 relative">
      <div className="absolute inset-0 bg-jp-deep"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-gradient">FAQ</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Pertanyaan yang sering ditanyakan seputar layanan JokiPremium
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openItems.includes(index);
              return (
                <div 
                  key={index}
                  className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl overflow-hidden animate-fade-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-accent/5 transition-smooth"
                  >
                    <h3 className="text-lg font-semibold text-foreground pr-4">
                      {faq.question}
                    </h3>
                    <div className="flex-shrink-0">
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-accent" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-accent" />
                      )}
                    </div>
                  </button>
                  
                  <div className={`transition-all duration-300 ease-in-out ${
                    isOpen 
                      ? 'max-h-96 opacity-100 pb-6' 
                      : 'max-h-0 opacity-0 pb-0'
                  } overflow-hidden`}>
                    <div className="px-6">
                      <div className="border-t border-border/50 pt-4">
                        <p className="text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-16 text-center animate-fade-up animation-delay-800">
          <div className="max-w-4xl mx-auto bg-accent/10 border border-accent/20 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-left">
                <h4 className="font-semibold text-accent mb-2">Disclaimer</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Layanan kami bertujuan mendukung proses belajar dan pengembangan kemampuan teknologi. 
                  Pengguna bertanggung jawab penuh terhadap kebijakan akademik kampus atau perusahaan masing-masing. 
                  Kami tidak bertanggung jawab atas pelanggaran kebijakan yang dilakukan oleh pengguna layanan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;