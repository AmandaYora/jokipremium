import React, { useState } from "react";
import { Button } from "../ui/button";
import { useToast } from "../../hooks/use-toast";

interface FormData {
  name: string;
  phone: string;
  email: string;
  gender: string;
  platforms: string[];
  description: string;
}

const OrderForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
    gender: "",
    platforms: [],
    description: "",
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const platforms = ["Android", "Web", "Desktop", "Others"];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handlePlatformToggle = (platform: string) => {
    setFormData((prev) => {
      const newPlatforms = prev.platforms.includes(platform)
        ? prev.platforms.filter((p) => p !== platform)
        : [...prev.platforms, platform];
      return { ...prev, platforms: newPlatforms };
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) newErrors.name = "Nama harus diisi";
    if (!formData.phone.trim()) newErrors.phone = "Nomor telepon harus diisi";
    if (!formData.email.trim()) {
      newErrors.email = "Email harus diisi";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }
    if (!formData.gender) newErrors.gender = "Gender harus dipilih";
    if (formData.platforms.length === 0) {
      newErrors.platforms = ["Minimal pilih satu platform"];
    }
    if (!formData.description.trim()) {
      newErrors.description = "Deskripsi tugas harus diisi";
    } else if (formData.description.length < 10) {
      newErrors.description = "Deskripsi minimal 10 karakter";
    } else if (formData.description.length > 1000) {
      newErrors.description = "Deskripsi maksimal 1000 karakter";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Form tidak valid",
        description: "Mohon periksa dan lengkapi semua field yang diperlukan.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const message = `Halo JokiPremium! Saya ingin konsultasi project:

*Data Pemesanan*
- Nama: ${formData.name}
- Phone: ${formData.phone}
- Email: ${formData.email}
- Gender: ${formData.gender}
- Platform: ${formData.platforms.join(", ")}

*Deskripsi Project:*
${formData.description}

Mohon info lebih lanjut mengenai timeline dan biaya. Terima kasih!`;

    const whatsappUrl = `https://wa.me/6285173471146?text=${encodeURIComponent(
      message
    )}`;

    toast({
      title: "Mengarahkan ke WhatsApp...",
      description: "Silakan lanjutkan konsultasi di WhatsApp",
    });

    setTimeout(() => {
      window.location.href = whatsappUrl;
    }, 300);

    setFormData({
      name: "",
      phone: "",
      email: "",
      gender: "",
      platforms: [],
      description: "",
    });

    setTimeout(() => {
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <section id="contact" className="py-20 relative">
      <div className="absolute inset-0 gradient-subtle opacity-80"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-gradient">Mulai Project Anda</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Isi form di bawah untuk konsultasi gratis. Kami akan menghubungi
            Anda via WhatsApp untuk diskusi lebih detail.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <form
            onSubmit={handleSubmit}
            className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 animate-fade-up animation-delay-300"
          >
            <div className="mb-6">
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-foreground mb-2"
              >
                Nama Lengkap *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`form-input ${
                  errors.name ? "border-destructive focus:ring-destructive" : ""
                }`}
                placeholder="Masukkan nama lengkap Anda"
              />
              {errors.name && (
                <p className="text-destructive text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-semibold text-foreground mb-2"
                >
                  Nomor Telepon *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`form-input ${
                    errors.phone
                      ? "border-destructive focus:ring-destructive"
                      : ""
                  }`}
                  placeholder="08xxxxxxxxxx"
                />
                {errors.phone && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.phone}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-foreground mb-2"
                >
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`form-input ${
                    errors.email
                      ? "border-destructive focus:ring-destructive"
                      : ""
                  }`}
                  placeholder="nama@email.com"
                />
                {errors.email && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            <div className="mb-6">
              <label
                htmlFor="gender"
                className="block text-sm font-semibold text-foreground mb-2"
              >
                Gender *
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className={`form-input ${
                  errors.gender
                    ? "border-destructive focus:ring-destructive"
                    : ""
                }`}
              >
                <option value="">Pilih gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              {errors.gender && (
                <p className="text-destructive text-sm mt-1">{errors.gender}</p>
              )}
            </div>
              
            <div className="mb-6">
              <label className="block text-sm font-semibold text-foreground mb-3">
                Platform yang Dibutuhkan *
              </label>
              <div className="flex flex-wrap gap-3">
                {platforms.map((platform) => (
                  <button
                    key={platform}
                    type="button"
                    onClick={() => handlePlatformToggle(platform)}
                    className={`platform-chip ${
                      formData.platforms.includes(platform) ? "selected" : ""
                    }`}
                  >
                    {platform}
                  </button>
                ))}
              </div>
              {errors.platforms && (
                <p className="text-destructive text-sm mt-2">
                  {errors.platforms[0]}
                </p>
              )}
            </div>

            <div className="mb-8">
              <label
                htmlFor="description"
                className="block text-sm font-semibold text-foreground mb-2"
              >
                Deskripsi Project *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={5}
                className={`form-input resize-none ${
                  errors.description
                    ? "border-destructive focus:ring-destructive"
                    : ""
                }`}
                placeholder="Jelaskan detail project yang ingin Anda buat. Contoh: Aplikasi absensi dengan fitur login karyawan, absen masuk/keluar dengan QR Code, laporan kehadiran, manajemen shift, dan notifikasi reminder absensi..."
              />
              <div className="flex justify-between items-center mt-1">
                {errors.description ? (
                  <p className="text-destructive text-sm">
                    {errors.description}
                  </p>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    {formData.description.length}/1000 karakter
                  </p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              variant="hero"
              size="lg"
              className="w-full group"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin w-5 h-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Mengirim...
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.69" />
                  </svg>
                  Kirim ke WhatsApp
                </>
              )}
            </Button>

            <p className="text-center text-sm text-muted-foreground mt-4">
              Data Anda aman dan hanya digunakan untuk keperluan konsultasi
              project.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default OrderForm;