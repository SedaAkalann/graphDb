export interface EdgePropertyDefinition {
  key: string;
  label: string;
  type: "text" | "number" | "select" | "date";
  options?: string[];
}

export const edgeProperties: Record<string, EdgePropertyDefinition[]> = {
  // İnsan-İnsan ilişkileri
  "arkadas": [
    { key: "baslangic_tarihi", label: "Arkadaşlık Başlangıcı", type: "date" },
    { key: "yakinlik_derecesi", label: "Yakınlık Derecesi", type: "select", options: ["Çok Yakın", "Yakın", "Normal", "Uzak"] },
    { key: "ortak_aktiviteler", label: "Ortak Aktiviteler", type: "text" },
    { key: "iletisim_sikligi", label: "İletişim Sıklığı", type: "select", options: ["Günlük", "Haftalık", "Aylık", "Nadir"] }
  ],
  "evli": [
    { key: "evlilik_tarihi", label: "Evlilik Tarihi", type: "date" },
    { key: "evlilik_yeri", label: "Evlilik Yeri", type: "text" },
    { key: "cocuk_sayisi", label: "Çocuk Sayısı", type: "number" },
    { key: "durum", label: "Durum", type: "select", options: ["Evli", "Ayrı", "Boşanmış"] }
  ],
  "akraba": [
    { key: "yakinlik_derecesi", label: "Yakınlık Derecesi", type: "select", options: ["1. Derece", "2. Derece", "3. Derece", "Uzak Akraba"] },
    { key: "akrabalik_turu", label: "Akrabalık Türü", type: "select", options: ["Anne-Baba", "Kardeş", "Çocuk", "Amca/Teyze", "Kuzen", "Diğer"] },
    { key: "gorusme_sikligi", label: "Görüşme Sıklığı", type: "select", options: ["Sürekli", "Sık", "Bazen", "Nadir"] }
  ],

  // İnsan-Şirket ilişkileri
  "calisan": [
    { key: "ise_baslama_tarihi", label: "İşe Başlama Tarihi", type: "date" },
    { key: "pozisyon", label: "Pozisyon", type: "text" },
    { key: "departman", label: "Departman", type: "text" },
    { key: "maas", label: "Maaş", type: "number" },
    { key: "istihdam_turu", label: "İstihdam Türü", type: "select", options: ["Tam Zamanlı", "Yarı Zamanlı", "Sözleşmeli", "Stajyer"] },
    { key: "durum", label: "Durum", type: "select", options: ["Aktif", "İzinli", "Ayrılmış"] }
  ],
  "sahip": [
    { key: "sahiplik_orani", label: "Sahiplik Oranı (%)", type: "number" },
    { key: "sahiplik_tarihi", label: "Sahiplik Tarihi", type: "date" },
    { key: "sahiplik_turu", label: "Sahiplik Türü", type: "select", options: ["Tam Sahip", "Ortak", "Hissedar", "Yönetici"] }
  ],

  // İnsan-Araç ilişkileri
  "arac_sahibi": [
    { key: "sahiplik_tarihi", label: "Sahiplik Tarihi", type: "date" },
    { key: "satin_alma_fiyati", label: "Satın Alma Fiyatı", type: "number" },
    { key: "sigorta_durumu", label: "Sigorta Durumu", type: "select", options: ["Kasko", "Trafik", "Her İkisi", "Sigortasız"] },
    { key: "kullanim_amaci", label: "Kullanım Amacı", type: "select", options: ["Kişisel", "Ticari", "Karma"] }
  ],

  // İnsan-Ev ilişkileri
  "oturan": [
    { key: "oturma_baslangici", label: "Oturma Başlangıcı", type: "date" },
    { key: "kira_miktari", label: "Kira Miktarı", type: "number" },
    { key: "oturma_turu", label: "Oturma Türü", type: "select", options: ["Kiracı", "Sahip", "Misafir", "Geçici"] },
    { key: "oda_sayisi", label: "Kullandığı Oda Sayısı", type: "number" }
  ],

  // İnsan-Konum ilişkileri
  "bulundu": [
    { key: "tarih_saat", label: "Tarih-Saat", type: "date" },
    { key: "sure", label: "Bulunma Süresi (dakika)", type: "number" },
    { key: "aktivite", label: "Aktivite", type: "text" },
    { key: "kaynak", label: "Bilgi Kaynağı", type: "select", options: ["GPS", "Kamera", "Tanık", "GSM", "Diğer"] }
  ],

  // İnsan-İletişim ilişkileri
  "arama_yapti": [
    { key: "arama_tarihi", label: "Arama Tarihi", type: "date" },
    { key: "sure", label: "Konuşma Süresi (saniye)", type: "number" },
    { key: "arama_turu", label: "Arama Türü", type: "select", options: ["Giden", "Gelen", "Cevapsız"] },
    { key: "konum", label: "Arama Konumu", type: "text" }
  ],
  "mesaj_gonderdi": [
    { key: "mesaj_tarihi", label: "Mesaj Tarihi", type: "date" },
    { key: "mesaj_uzunlugu", label: "Mesaj Uzunluğu", type: "number" },
    { key: "mesaj_turu", label: "Mesaj Türü", type: "select", options: ["SMS", "WhatsApp", "Telegram", "Signal"] },
    { key: "icerik_turu", label: "İçerik Türü", type: "select", options: ["Metin", "Resim", "Video", "Ses", "Dosya"] }
  ],
  "email_gonderdi": [
    { key: "email_tarihi", label: "Email Tarihi", type: "date" },
    { key: "konu", label: "Konu", type: "text" },
    { key: "ek_var_mi", label: "Ek Var mı?", type: "select", options: ["Evet", "Hayır"] },
    { key: "oncelik", label: "Öncelik", type: "select", options: ["Yüksek", "Normal", "Düşük"] }
  ],

  // Finansal ilişkiler
  "para_transferi": [
    { key: "transfer_tarihi", label: "Transfer Tarihi", type: "date" },
    { key: "miktar", label: "Miktar", type: "number" },
    { key: "para_birimi", label: "Para Birimi", type: "select", options: ["TL", "USD", "EUR", "GBP"] },
    { key: "transfer_turu", label: "Transfer Türü", type: "select", options: ["Havale", "EFT", "Nakit", "Kredi Kartı"] },
    { key: "aciklama", label: "Açıklama", type: "text" }
  ],

  // Genel/Default edge özellikleri
  "default": [
    { key: "baslangic_tarihi", label: "Başlangıç Tarihi", type: "date" },
    { key: "bitis_tarihi", label: "Bitiş Tarihi", type: "date" },
    { key: "guc_seviyesi", label: "Güç Seviyesi", type: "select", options: ["Çok Güçlü", "Güçlü", "Orta", "Zayıf"] },
    { key: "guvenilirlik", label: "Güvenilirlik", type: "select", options: ["Çok Güvenilir", "Güvenilir", "Orta", "Şüpheli"] },
    { key: "notlar", label: "Notlar", type: "text" }
  ]
};
