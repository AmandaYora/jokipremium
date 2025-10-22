import React, { useEffect } from 'react';
import Navbar from '../components/ui/navbar';
import Hero from '../components/sections/Hero';
import Services from '../components/sections/Services';
import Flow from '../components/sections/Flow';
import WhyUs from '../components/sections/WhyUs';
import FAQ from '../components/sections/FAQ';
import OrderForm from '../components/sections/OrderForm';
import Footer from '../components/sections/Footer';

const Landing = () => {

  useEffect(() => {
    // Set document title and meta tags
    document.title = 'JokiPremium - Jasa Pembuatan Aplikasi & Bimbingan Skripsi | Web, Mobile, Desktop';
    
    // Meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'JokiPremium menyediakan jasa pembuatan aplikasi web, mobile, desktop dan bimbingan skripsi untuk mahasiswa dan UMK. Biaya fleksibel, timeline jelas, revisi gratis.');
    }

    // Open Graph meta tags
    const updateMetaTag = (property: string, content: string) => {
      let metaTag = document.querySelector(`meta[property="${property}"]`);
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('property', property);
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute('content', content);
    };

    updateMetaTag('og:title', 'JokiPremium - Jasa Pembuatan Aplikasi & Bimbingan Skripsi');
    updateMetaTag('og:description', 'Partner terpercaya untuk pembuatan aplikasi web, mobile, desktop dan bimbingan skripsi mahasiswa. Biaya fleksibel sesuai project.');
    updateMetaTag('og:type', 'website');
    updateMetaTag('og:url', window.location.href);
    updateMetaTag('og:image', `${window.location.origin}/assets/logo.png`);
    
    // Twitter Card
    const updateTwitterTag = (name: string, content: string) => {
      let metaTag = document.querySelector(`meta[name="${name}"]`);
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('name', name);
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute('content', content);
    };

    updateTwitterTag('twitter:card', 'summary_large_image');
    updateTwitterTag('twitter:title', 'JokiPremium - Jasa Pembuatan Aplikasi & Bimbingan Skripsi');
    updateTwitterTag('twitter:description', 'Partner terpercaya untuk pembuatan aplikasi dan bimbingan skripsi mahasiswa.');
    updateTwitterTag('twitter:image', `${window.location.origin}/assets/logo.png`);

    // Schema.org JSON-LD
    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "JokiPremium",
      "description": "Jasa pembuatan aplikasi web, mobile, desktop dan bimbingan skripsi untuk mahasiswa dan UMK",
      "url": window.location.origin,
      "logo": `${window.location.origin}/assets/logo.png`,
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+62-851-7347-1146",
        "contactType": "Customer Service",
        "availableLanguage": "Indonesian"
      },
      "sameAs": [
        "https://www.tiktok.com/@jokipremium",
        "https://www.instagram.com/jokipremium"
      ],
      "serviceArea": {
        "@type": "Country",
        "name": "Indonesia"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Layanan JokiPremium",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Pembuatan Aplikasi Web",
              "description": "Layanan pembuatan aplikasi web menggunakan Laravel, React, Next.js"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Pembuatan Aplikasi Mobile",
              "description": "Layanan pembuatan aplikasi mobile Android, Flutter"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Pembuatan Aplikasi Desktop",
              "description": "Layanan pembuatan aplikasi desktop menggunakan Electron, .NET"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Bimbingan Skripsi",
              "description": "Bimbingan end-to-end untuk tugas akhir dan skripsi mahasiswa"
            }
          }
        ]
      }
    });
    
    document.head.appendChild(schemaScript);

    // Cleanup function
    return () => {
      document.head.removeChild(schemaScript);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Flow />
        <WhyUs />
        <FAQ />
        <OrderForm />
      </main>
      <Footer />
    </div>
  );
};

export default Landing;