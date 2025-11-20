export interface Dua {
  id: number;
  title: string;
  arabic: string;
  translation: string;
  reference: string;
  imageUrl: string;
  sections?: DuaSection[];
}

export interface DuaSection {
  arabic: string;
  translation: string;
  reference: string;
}

export const duaData: Dua[] = [
  {
    id: 1,
    title: "Praise and Glory",
    arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ سُبْحَانَ اللَّهِ الْعَظِيمِ",
    translation: "Glory be to Allah and all praise be to Him; Glory be to Allah, the Most Great.",
    reference: "[Sahih Muslim]",
    imageUrl: "https://i.ibb.co/d7zP1y2/kaaba.png",
    sections: [
      {
        arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ سُبْحَانَ اللَّهِ الْعَظِيمِ",
        translation: "Glory be to Allah and all praise be to Him; Glory be to Allah, the Most Great.",
        reference: "[Sahih Muslim]"
      },
      {
        arabic: "اللَّهُ أَكْبَرُ كَبِيرًا وَالْحَمْدُ لِلَّهِ كَثِيرًا وَسُبْحَانَ اللَّهِ بُكْرَةً وَأَصِيلًا",
        translation: "Allah is truly great, praise be to Allah in abundance and glory be to Allah in the morning and the evening.",
        reference: "[Sahih Muslim]"
      }
    ]
  },
  {
    id: 2,
    title: "Peace and Blessing upon the Prophet Muhammad",
    arabic: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ",
    translation: "O Allah, send blessings upon Muhammad",
    reference: "[Various]",
    imageUrl: "https://i.ibb.co/S70Lq9y/muhammad-calligraphy.png"
  },
  {
    id: 3,
    title: "Du'a of Morning (Before Sunrise)",
    arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ",
    translation: "We have reached the morning and at this very time all sovereignty belongs to Allah",
    reference: "[Muslim]",
    imageUrl: "https://i.ibb.co/0yHw2B4/morning-dua.png"
  },
  {
    id: 4,
    title: "Du'a of Evening (Before Sunset)",
    arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ",
    translation: "We have reached the evening and at this very time all sovereignty belongs to Allah",
    reference: "[Muslim]",
    imageUrl: "https://i.ibb.co/sK4N45z/evening-dua.png"
  },
  {
    id: 5,
    title: "Du'a for Protection",
    arabic: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
    translation: "I seek refuge in the perfect words of Allah from the evil of what He has created",
    reference: "[Muslim]",
    imageUrl: "https://i.ibb.co/tZ5P1yR/protection-dua.png"
  },
  {
    id: 6,
    title: "Du'a before Sleeping",
    arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
    translation: "In Your name O Allah, I die and I live",
    reference: "[Bukhari]",
    imageUrl: "https://i.ibb.co/VDY0t2V/sleep-dua.png"
  },
  {
    id: 7,
    title: "Du'a after Waking Up",
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
    translation: "All praise is for Allah who gave us life after having taken it from us and unto Him is the resurrection",
    reference: "[Bukhari]",
    imageUrl: "https://i.ibb.co/wJtW7Jb/wake-up-dua.png"
  },
  {
    id: 8,
    title: "Du'a before Entering the Bathroom",
    arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبْثِ وَالْخَبَائِثِ",
    translation: "O Allah, I seek refuge with you from all evil and evil-doers",
    reference: "[Bukhari]",
    imageUrl: "https://i.ibb.co/w0Y8XpG/entering-dua.png"
  }
];

export type ScreenType = 'dashboard' | 'duaDetail';