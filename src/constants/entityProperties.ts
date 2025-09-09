export interface PropertyDefinition {
  key: string;
  label: string;
  type: "text" | "number" | "select";
  options?: string[];
}

export const entityProperties: Record<string, PropertyDefinition[]> = {
  insan: [
    { key: "isim", label: "İsim", type: "text" },
    { key: "soyisim", label: "Soyisim", type: "text" },
    { key: "tc", label: "TC Kimlik", type: "text" },
    { key: "yas", label: "Yaş", type: "number" },
    { key: "cinsiyet", label: "Cinsiyet", type: "select", options: ["Kadın", "Erkek", "Diğer"] },
    { key: "meslek", label: "Meslek", type: "text" },
    { key: "telefon", label: "Telefon", type: "text" },
    { key: "email", label: "Email", type: "text" },
    { key: "dogumyeri", label: "Doğum Yeri", type: "text" },
    { key: "medenihal", label: "Medeni Hal", type: "select", options: ["Bekar", "Evli", "Dul", "Boşanmış"] },
    { key: "egitim", label: "Eğitim Durumu", type: "select", options: ["İlkokul", "Ortaokul", "Lise", "Üniversite", "Yüksek Lisans", "Doktora"] },
  ],
  plaka: [
    { key: "plaka", label: "Plaka", type: "text" },
    { key: "renk", label: "Renk", type: "text" },
    { key: "marka", label: "Marka", type: "text" },
    { key: "model", label: "Model", type: "text" },
    { key: "yil", label: "Yıl", type: "number" },
  ],
  ev: [
    { key: "adres", label: "Adres", type: "text" },
    { key: "kat", label: "Kat", type: "number" },
    { key: "oda", label: "Oda Sayısı", type: "number" },
    { key: "tip", label: "Tip", type: "select", options: ["Daire", "Villa", "Müstakil"] },
    { key: "metrekare", label: "Metrekare", type: "number" },
  ],
  konum: [
    { key: "il", label: "İl", type: "text" },
    { key: "ilce", label: "İlçe", type: "text" },
    { key: "mahalle", label: "Mahalle", type: "text" },
    { key: "koordinat", label: "Koordinat", type: "text" },
    { key: "posta", label: "Posta Kodu", type: "text" },
  ],
};