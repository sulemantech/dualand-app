// duas.ts - Complete data structure for all 43 duas and categories

export interface Category {
  id: number;
  name: string;
  icon: string;
  color: string;
  order_index: number;
}

export interface Dua {
  id: string;
  category_id: number;
  title: string;
  arabic_text: string;
  translation: string;
  transliteration?: string;
  reference: string;
  is_favorited: boolean;
  memorization_status: 'not_started' | 'learning' | 'memorized';
  image_path?: string;
  audio_full?: string;
  audio_word_by_word?: string;
  order_index: number;
  urdu?: string;
  hinditranslation?: string;
  textheading?: string;
  backgroundResId?: string;
  statusBarColorResId?: string;
  duaNumber?: string;
  titleAudioResId?: string;
  steps?: string;
}

export interface WordAudioPair {
  id: string;
  dua_id: string;
  word_text: string;
  audio_res_id: string;
  sequence_order: number;
}

// All Categories
export const categories: Category[] = [
  { id: 1, name: 'Praise and Glory', icon: 'star', color: '#2D7D46', order_index: 1 },
  { id: 2, name: 'Peace and Blessing upon the Prophet Muhammad ﷺ', icon: 'peace', color: '#3182CE', order_index: 2 },
  { id: 3, name: 'Du\'a of Morning (Before Sunrise)', icon: 'sunny', color: '#a0825cff', order_index: 3 },
  { id: 4, name: 'Du\'a of Evening (Before Sunset)', icon: 'moon', color: '#805AD5', order_index: 4 },
  { id: 5, name: 'Du\'a for Protection', icon: 'shield', color: '#E53E3E', order_index: 5 },
  { id: 6, name: 'Du\'a before Sleeping', icon: 'bed', color: '#38A169', order_index: 6 },
  { id: 7, name: 'Du\'a after Waking Up', icon: 'alarm', color: '#DD6B20', order_index: 7 },
  { id: 8, name: 'Du\'a before Entering the Toilet', icon: 'restroom', color: '#4C51BF', order_index: 8 },
  { id: 9, name: 'Du\'a after Leaving the Toilet', icon: 'exit', color: '#744210', order_index: 9 },
  { id: 10, name: 'Du\'a before Putting on Dress', icon: 'tshirt', color: '#6a234dff', order_index: 10 },
  { id: 11, name: 'Du\'a before Taking off Dress', icon: 'tshirt', color: '#E53E3E', order_index: 11 },
  { id: 12, name: 'Du\'a for Traveller', icon: 'airplane', color: '#2B6CB0', order_index: 12 },
  { id: 13, name: 'Du\'a while Entering the Home', icon: 'home', color: '#234E52', order_index: 13 },
  { id: 14, name: 'Du\'a for protection from Bad Akhlaq', icon: 'heart', color: '#521B41', order_index: 14 },
  { id: 15, name: 'Du\'a for Journey', icon: 'road', color: '#1A365D', order_index: 15 },
  { id: 16, name: 'Du\'a When Meeting a Muslim', icon: 'handshake', color: '#742A2A', order_index: 16 },
  { id: 17, name: 'Du\'a at the End of a Gathering', icon: 'users', color: '#2D3748', order_index: 17 },
  { id: 18, name: 'Du\'a When Entering the Market', icon: 'shopping-cart', color: '#C53030', order_index: 18 },
  { id: 19, name: 'Du\'a When Entering the Masjid', icon: 'mosque', color: '#2F855A', order_index: 19 },
  { id: 20, name: 'Du\'a When Leaving the Masjid', icon: 'mosque', color: '#2C5AA0', order_index: 20 },
  { id: 21, name: 'Du\'a Before Eating & Drinking', icon: 'utensils', color: '#9C4221', order_index: 21 },
  { id: 22, name: 'Du\'a after Eating & Drinking', icon: 'utensils', color: '#553C9A', order_index: 22 },
  { id: 23, name: 'Du\'a When Visiting the Sick', icon: 'stethoscope', color: '#805AD5', order_index: 23 },
  { id: 24, name: 'Du\'a for one Afflicted by a Calamity', icon: 'sad-tear', color: '#FF6B6B', order_index: 24 },
  { id: 25, name: 'Du\'a upon Seeing Someone in Calamity', icon: 'eye', color: '#4ECDC4', order_index: 25 },
  { id: 26, name: 'Du\'a when Angry', icon: 'angry', color: '#FFD166', order_index: 26 },
  { id: 27, name: 'Du\'a when Sneezing', icon: 'wind', color: '#6A0572', order_index: 27 },
  { id: 28, name: 'Du\'a when it Rains', icon: 'cloud-rain', color: '#1A535C', order_index: 28 },
  { id: 29, name: 'Du\'a upon Sighting the Crescent Moon', icon: 'moon', color: '#FF9F1C', order_index: 29 },
  { id: 30, name: 'Du\'a for Seeking Allah\'s Love', icon: 'praying-hands', color: '#2EC4B6', order_index: 30 },
  { id: 31, name: 'Du\'a: Sayyid-ul-Istighfar', icon: 'pray', color: '#E71D36', order_index: 31 },
  { id: 32, name: 'Seeking Refuge with Allah', icon: 'shield-alt', color: '#662E9B', order_index: 32 },
];

// All 43 Duas
export const duas: Dua[] = [
  // Category 1: Praise and Glory (2 duas)
  {
    id: '1', category_id: 1, title: 'Glory and Praise',
    arabic_text: 'سُبْحَانَ اللّٰہِ وَبِحَمْدِہِ سُبْحَانَ اللّٰہِ الْعَظِیْمِ',
    translation: 'Glory be to Allah and all praise be to Him; Glory be to Allah, the Most Great.',
    reference: '[Ṣaḥīḥ Muslim]',
    textheading: 'Praise and Glory',
    duaNumber: '1.',
    order_index: 1,
    is_favorited: false,
    memorization_status: 'not_started',
    titleAudioResId: 'title_praise_and_glory',
    audio_full: 'dua01_part01_audio01_complete',
    backgroundResId: 'header_bg',
    statusBarColorResId: 'top_nav_new'
  },
  {
    id: '2', category_id: 1, title: 'Allah is the Greatest',
    arabic_text: 'اَللّٰہُ اَکْبَرُکَبِیْرًاوَّالْحَمْدُ لِلّٰہِ کَثِیْرًاوَّسُبْحَانَ اللّٰہِ بُکْرَةً وَّاَصِیْلًا',
    translation: 'Allah is truly Great, praise be to Allah in abundance and glory be to Allah in the morning and the evening.',
    reference: '[Sahih Muslim]',
    duaNumber: '1.',
    order_index: 2,
    is_favorited: true,
    memorization_status: 'learning',
    audio_full: 'dua01_part02_audio01_complete',
    backgroundResId: 'header_bg',
    statusBarColorResId: 'top_nav_new'
  },

  // Category 2: Peace and Blessings (2 duas)
  {
    id: '3', category_id: 2, title: 'Peace upon Muhammad',
    arabic_text: 'اَللّٰھُمَّ صَلِّ عَلٰی مُحَمَّدٍ وَّعَلٰی آلِ مُحَمَّدٍ',
    translation: 'O Allah! bestow Your mercy upon Mohammad ﷺ and upon the family of Mohammad ﷺ.',
    reference: '[Sunan al-Nasā\'ī]',
    textheading: 'Peace and Blessing upon the Prophet Muhammad ﷺ',
    duaNumber: '2.',
    order_index: 1,
    is_favorited: false,
    memorization_status: 'memorized',
    titleAudioResId: 'title_peace',
    audio_full: 'dua02_part01_audio01_complete',
    backgroundResId: 'header_bg',
    statusBarColorResId: 'top_nav_new'
  },
  {
    id: '4', category_id: 2, title: 'Mercy upon Muhammad',
    arabic_text: 'اَللّٰھُمَّ صَلِّ عَلٰی مُحَمَّدٍ عَبْدِکَ وَ رَسُوْلِکَ کَمَا صَلَّیْتَ عَلٰی اِبْرَاھِیْمَ وَ بَارِکْ عَلٰی مُحَمَّدٍ وَّعَلٰی آلِ مُحَمَّدٍ کَمَا بَارَکْتَ عَلٰی اِبْرَاھِیْمَ وَآلِ اِبْرَاھِیْمَ۔',
    translation: 'O Allah! Bestow mercy upon your servant and messenger, Mohammad ﷺ, as You bestowed Your mercy upon Ibrahim AS and bless Mohammad ﷺ and the family of Mohammad ﷺ, as You blessed Ibrahim (AS) and the family Ibrahim (AS).',
    reference: '[Ṣaḥīḥ al-Bukhārī]',
    duaNumber: '2.',
    order_index: 2,
    is_favorited: false,
    memorization_status: 'not_started',
    audio_full: 'dua02_part02_audio01_complete',
    backgroundResId: 'header_bg',
    statusBarColorResId: 'top_nav_new'
  },

  // Category 3: Morning Duas (1 dua)
  {
    id: '5', category_id: 3, title: 'Morning Du\'a',
    arabic_text: 'اَللّٰھُمَّ بِکَ اَصْبَحْنَا وَ بِکَ اَمْسَیْنَا وَ بِکَ نَحْیَا وَ بِکَ نَمُوْتُ  وَ اِلَيْكَ الْمَصِیْرُ',
    translation: 'O Allah! By Your leave we reach the morning and by Your leave we reach the evening and by Your leave we live and by Your leave we die and to You is our return.',
    reference: '[Sunan al-Tirmidhī]',
    textheading: 'Du\'a of Morning (Before Sunrise)',
    duaNumber: '3.',
    order_index: 1,
    is_favorited: true,
    memorization_status: 'memorized',
    titleAudioResId: 'title_morning',
    audio_full: 'dua03_part01_audio01_complete',
    backgroundResId: 'header_bg',
    statusBarColorResId: 'top_nav_new'
  },

  // Category 4: Evening Duas (1 dua)
  {
    id: '6', category_id: 4, title: 'Evening Du\'a',
    arabic_text: 'اَللّٰھُمَّ بِکَ اَمْسَیْنَا وَبِکَ اَصْبَحْنَا وَبِکَ نَحْیَا وَبِکَ نَمُوْتُ وَاِلَیْکَ النُّشُوْرُ۔ِ',
    translation: 'O Allah! By Your leave we reach the evening and by Your leave we reach the morning and by Your leave we live and by Your leave we will die and to You is our resurrection.',
    reference: '[Sunan al-Tirmidhī]',
    textheading: 'Du\'a of Evening (Before Sunset)',
    duaNumber: '4.',
    order_index: 1,
    is_favorited: false,
    memorization_status: 'learning',
    titleAudioResId: 'title_evening',
    audio_full: 'dua04_part01_audio01_complete',
    backgroundResId: 'header_bg',
    statusBarColorResId: 'top_nav_new'
  },

  // Category 5: Protection (2 duas)
  {
    id: '7', category_id: 5, title: 'Seeking Refuge',
    arabic_text: 'اَعُوْذُ بِکَلِمَاتِ اللّٰہِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ۔',
    translation: 'I seek refuge in the totality of the words of Allah from the evil of what He has created.',
    reference: '[Ṣaḥīḥ Muslim]',
    textheading: 'Du\'a for Protection',
    duaNumber: '5.',
    order_index: 1,
    is_favorited: false,
    memorization_status: 'not_started',
    titleAudioResId: 'title_protection',
    audio_full: 'dua05_part01_audio01_complete',
    backgroundResId: 'header_bg',
    statusBarColorResId: 'top_nav_new'
  },
  {
    id: '8', category_id: 5, title: 'Protection in Allah\'s Name',
    arabic_text: 'بِسْمِ اللّٰہِ الَّذِیْ لَايَضُرُّ مَعَ اسْمِهِ شَىْءٌ فِى الْاَرْضِ وَلَا فِى السَّمَآءِ وَهُوَ السَّمِيعُ الْعَلِیْمُ',
    translation: 'In the name of Allah, by Whose name nothing on the earth or in the heavens can cause harm, and He is the All Knowing, the All-Hearing. (3 times)',
    reference: '[Sunan Abu Dawud]',
    duaNumber: '5.',
    order_index: 2,
    is_favorited: true,
    memorization_status: 'memorized',
    audio_full: 'dua05_part02_audio01_complete',
    backgroundResId: 'header_bg',
    statusBarColorResId: 'top_nav_new'
  },

  // Category 6: Sleeping & Waking (2 duas)
  {
    id: '9', category_id: 6, title: 'Before Sleeping',
    arabic_text: 'اَللّٰھُمَّ بِاسْمِكَ اَمُوْتُ وَاَحْیَا',
    translation: 'O Allah! In your name I die and I live.',
    reference: '[Ṣaḥīḥ al-Bukhārī]',
    textheading: 'Du\'a before Sleeping',
    duaNumber: '6.',
    order_index: 1,
    is_favorited: false,
    memorization_status: 'learning',
    titleAudioResId: 'title_sleeping',
    audio_full: 'dua06_part01_audio01_complete',
    steps: '1. Dust the bed before sleeping\n2. Sleep on the right side\n3. Put your hand under your right cheek and say',
    backgroundResId: 'header_bg',
    statusBarColorResId: 'top_nav_new'
  },
  {
    id: '10', category_id: 6, title: 'After Waking Up',
    arabic_text: 'اَلْـحَمْدُ لِلّٰهِ الَّذِیْ اَحْيَانَا بَعْدَ مَا اَمَاتَنَا وَاِلَيْهِ النُّشُوْرُ',
    translation: 'All praise is for Allah ho gave us life after death (sleep) and to Him is the resurrection.',
    reference: '[Ṣaḥīḥ al-Bukhārī]',
    textheading: 'Du\'a after Waking Up',
    duaNumber: '7.',
    order_index: 2,
    is_favorited: true,
    memorization_status: 'memorized',
    titleAudioResId: 'title_waking_up',
    audio_full: 'dua07_part01_audio01_complete',
    steps: 'Rub your face and your eyes with your hands to remove any remaining effects of sleep and say:',
    backgroundResId: 'header_bg',
    statusBarColorResId: 'top_nav_new'
  },

  // Category 7: Toilet Etiquette (2 duas)
  {
    id: '11', category_id: 7, title: 'Before Entering Toilet',
    arabic_text: 'اَللّٰھُمَّ اِنِّیْ اَعُوْذُبِکَ مِنَ الْخُبُثِ وَالْخَبَائِثِ',
    translation: 'O Allah, I seek refuge in You from the impure male jinns and impure female jinns.',
    reference: '[Ṣaḥīḥ al-Bukhārī]',
    textheading: 'Du\'a before Entering the Toilet',
    duaNumber: '8.',
    order_index: 1,
    is_favorited: false,
    memorization_status: 'not_started',
    titleAudioResId: 'title_entering_toilet',
    audio_full: 'dua08_part01_audio01_complete',
    steps: 'Enter with your left foot and say:',
    backgroundResId: 'header_bg',
    statusBarColorResId: 'top_nav_new'
  },
  {
    id: '12', category_id: 7, title: 'After Leaving Toilet',
    arabic_text: 'غُفْرَانَكَ',
    translation: 'I ask you (Allah) for forgiveness.',
    reference: '[Sunan Abu Dawud]',
    textheading: 'Du\'a after Leaving the Toilet',
    duaNumber: '9.',
    order_index: 2,
    is_favorited: false,
    memorization_status: 'not_started',
    titleAudioResId: 'title_leaving_toilet',
    audio_full: 'dua09_part01_audio01_complete',
    steps: 'Leave with your right foot and say:',
    backgroundResId: 'header_bg',
    statusBarColorResId: 'top_nav_new'
  },

  // Category 8: Dressing (2 duas)
  {
    id: '13', category_id: 8, title: 'Before Putting on Dress',
    arabic_text: 'اَلْحَمْدُ لِلّٰهِ الَّذِىْ كَسَانِى هٰذَا الثَّوْبَ وَرَزَقَنِيْهِ مِنْ غَيْرِحَوْلٍ مِّنِّى وَلَا قُوَّةٍ',
    translation: 'All praise is for Allah Who has clothed me with this garment and provided it for me, with no power or might from myself.',
    reference: '[Sunan Abu Dawūd]',
    textheading: 'Du\'a before Putting on Dress',
    duaNumber: '10.',
    order_index: 1,
    is_favorited: false,
    memorization_status: 'not_started',
    titleAudioResId: 'title_before_putting_dress',
    audio_full: 'dua10_part01_audio01_complete',
    steps: '1. Shake and dust your dress before wearing.\n2. Start wearing the cloth from the right side',
    backgroundResId: 'header_bg',
    statusBarColorResId: 'top_nav_new'
  },
  {
    id: '14', category_id: 8, title: 'Before Taking off Dress',
    arabic_text: 'بِسْمِ اللّٰہُِِِِ',
    translation: 'In the Name of Allah.',
    reference: '[Sahih al-Jami\' al-Saghir]',
    textheading: 'Du\'a before Taking off Dress',
    duaNumber: '11.',
    order_index: 2,
    is_favorited: false,
    memorization_status: 'not_started',
    titleAudioResId: 'title_taking_of_dress',
    audio_full: 'dua11_part01_audio01_complete',
    steps: 'Start to undress from the left side',
    backgroundResId: 'header_bg',
    statusBarColorResId: 'top_nav_new'
  },

  // Category 9: Travel (1 dua)
  {
    id: '15', category_id: 12, title: 'For Traveller',
    arabic_text: 'اَسْتَوْدِعُ اللَّهَ دِينَكَ وَأَمَانَتَكَ، وَخَوَاتِيمَ عَمَلِکَ',
    translation: '(I make) Allah responsible for your deen, your trustsworthiness and for the results of your actions',
    reference: '[Sunan al-Tirmidhi]',
    textheading: 'Du\'a for Traveller',
    duaNumber: '12.',
    order_index: 1,
    is_favorited: false,
    memorization_status: 'not_started',
    titleAudioResId: 'title_traveler',
    audio_full: 'dua12_part01_audio01_complete',
    backgroundResId: 'header_bg',
    statusBarColorResId: 'top_nav_new'
  },

  // Category 10: Journey (3 duas)
  {
    id: '19', category_id: 15, title: 'For Journey - Start',
    arabic_text: 'بِسْمِ اللّٰہِ',
    translation: 'In the Name of Allah.',
    reference: '[Sunan Abu Dawūd]',
    textheading: 'Du\'a for Journey',
    duaNumber: '15.',
    order_index: 1,
    is_favorited: false,
    memorization_status: 'not_started',
    titleAudioResId: 'title_journey',
    audio_full: 'dua15_part01_audio01_complete',
    backgroundResId: 'header_bg',
    statusBarColorResId: 'top_nav_new'
  },
  {
    id: '20', category_id: 15, title: 'For Journey - Praise',
    arabic_text: 'اَلْحَمْدُ لِلّٰہِ',
    translation: 'All Praise is for Allah.',
    reference: '[Sunan Abu Dawūd]',
    duaNumber: '15.',
    order_index: 2,
    is_favorited: false,
    memorization_status: 'not_started',
    audio_full: 'dua15_part02_audio01_complete',
    backgroundResId: 'header_bg',
    statusBarColorResId: 'top_nav_new'
  },
  {
    id: '21', category_id: 15, title: 'For Journey - Transportation',
    arabic_text: 'سُبْحٰنَ الَّذِیْ سَخَّرَلَنَا ھٰذَا وَمَاکُنَّا لَہ مُقْرِنِیْنَoوَاِنَّآ اِلٰی رَبِّنَا لَمُنْقَلِبُوْنَo',
    translation: 'Glory to Him Who created this transportation for us, though we were unable to create it on our own. And to our Lord we shall return.',
    reference: '[al-Zukhruf: 13-14]',
    duaNumber: '15.',
    order_index: 3,
    is_favorited: false,
    memorization_status: 'not_started',
    audio_full: 'dua15_part03_audio01_complete',
    backgroundResId: 'header_bg',
    statusBarColorResId: 'top_nav_new'
  },

  // Category 11: Home (2 duas)
  {
    id: '16', category_id: 13, title: 'Entering Home',
    arabic_text: 'بِسْمِ اللّٰہِ',
    translation: 'In the Name of Allah.',
    reference: '[Ṣaḥīḥ Muslim]',
    textheading: 'Du\'a while Entering the Home',
    duaNumber: '13.',
    order_index: 1,
    is_favorited: false,
    memorization_status: 'not_started',
    titleAudioResId: 'title_entering_home',
    audio_full: 'dua13_part01_audio01_complete',
    backgroundResId: 'header_bg',
    statusBarColorResId: 'top_nav_new'
  },
  {
    id: '17', category_id: 13, title: 'Greeting at Home',
    arabic_text: 'اَلسَّلَامُ عَلَیْکُمْ',
    translation: 'May Peace (of Allah) be upon you.',
    reference: '[Surah An-Nur: 27]',
    duaNumber: '13.',
    order_index: 2,
    is_favorited: false,
    memorization_status: 'not_started',
    audio_full: 'dua13_part02_audio01_complete',
    backgroundResId: 'header_bg',
    statusBarColorResId: 'top_nav_new'
  },

  // Category 12: Good Character (1 dua)
  {
    id: '18', category_id: 14, title: 'Protection from Bad Akhlaq',
    arabic_text: 'اَللّٰهُمَّ إِنِّیْ أَعُوْذُبِکَ مِنْ مُنْکَرَاتِ الْأَخْلَاقِ، وَالْأَعْمَالِ، وَالْأَھْوَاءِ',
    translation: 'O Allah! Verily, I seek refuge in You from bad manners, deeds and desires.',
    reference: '[Sunan al-Tirmidhī]',
    textheading: 'Du\'a for protection from Bad Akhlaq',
    duaNumber: '14.',
    order_index: 1,
    is_favorited: false,
    memorization_status: 'not_started',
    titleAudioResId: 'title_bad_ikhlaq',
    audio_full: 'dua14_part01_audio01_complete',
    backgroundResId: 'header_bg',
    statusBarColorResId: 'top_nav_new'
  },

  // Category 13: Greetings (2 duas)
  {
    id: '22', category_id: 16, title: 'When Meeting a Muslim',
    arabic_text: 'اَلسَّلَامُ عَلَیْکُمْ وَرَحْمَةُ اللّٰہِ وَ بَرَکَاتُہُِِ',
    translation: 'May peace, mercy and blessings (of Allah) be upon You.',
    reference: '[Sunan Abu Dawūd]',
    textheading: 'Du\'a When Meeting a Muslim',
    duaNumber: '16.',
    order_index: 1,
    is_favorited: false,
    memorization_status: 'not_started',
    titleAudioResId: 'title_meeting_muslim',
    audio_full: 'dua16_part01_audio01_complete',
    backgroundResId: 'header_bg',
    statusBarColorResId: 'top_nav_new'
  },
  {
    id: '23', category_id: 16, title: 'Reply to Greeting',
    arabic_text: 'وَعَلَیْکُمُ السَّلَامُ وَ رَ حْمَةُ اللّٰہِ وَ بَرَکَاتُہُُِِ',
    translation: 'May peace, mercy and blessings of Allah be upon You as Well.',
    reference: '[Sunan Abu Dawūd]',
    duaNumber: '16.',
    order_index: 2,
    is_favorited: false,
    memorization_status: 'not_started',
    steps: 'Reply to the Greeting:',
    audio_full: 'dua16_part02_audio01_complete',
    backgroundResId: 'header_bg',
    statusBarColorResId: 'top_nav_new'
  },

  // Category 14: Gatherings (1 dua)
  {
    id: '24', category_id: 17, title: 'End of Gathering',
    arabic_text: 'سُبْحَانَكَ اللّٰھُمَّ وَبِحَمْدِکَ،اَشْھَدُاَنْ لَّااِلٰہَ اِلَّااَنْتَ، اَسْتَغْفِرُکَ وَاَتُوْبُ اِلَیْکَ',
    translation: 'Glory be to You O Allah, and all praise be to You! I bear witness that there is no true deity except You, I seek Your forgiveness and turn in repentance to You.',
    reference: '[Sunan Abu Dawūd]',
    textheading: 'Du\'a at the End of a Gathering',
    duaNumber: '17.',
    order_index: 1,
    is_favorited: false,
    memorization_status: 'not_started',
    titleAudioResId: 'title_gathering',
    audio_full: 'dua17_part01_audio01_complete',
    backgroundResId: 'header_bg',
    statusBarColorResId: 'top_nav_new'
  },

  // Category 15: Market (1 dua)
  {
    id: '25', category_id: 18, title: 'Entering Market',
    arabic_text: 'لَا اِلٰہَ اِلَّا اللّٰہُ وَحْدَہٗ  لَا شَرِیْکَ لَهٗ،لَہُ الْمُلْکُ وَلَہُ الْحَمْدُ یُحْیِی وَ یُمِیْتُ وَھُوَ حَیٌّ لَّا یَمُوْتُ بِیَدِہِ الْخَیْرُ وَھُوَ عَلٰی کُلِّ شَىْءٍ قَدِیْرٌ',
    translation: 'There is no true deity except Allah, alone, He has no partners. To Him belongs the dominion and for Him is all praise. He gives life and causes death, and He is living and does not die. In His hand is all good and He is upon all things always All-Powerful.',
    reference: '[Sunan al-Tirmidhi]',
    textheading: 'Du\'a When Entering the Market',
    duaNumber: '18.',
    order_index: 1,
    is_favorited: false,
    memorization_status: 'not_started',
    titleAudioResId: 'title_market',
    audio_full: 'dua18_part01_audio01_complete',
    backgroundResId: 'header_bg',
    statusBarColorResId: 'top_nav_new'
  },

  // Category 16: Masjid (2 duas)
  {
    id: '26', category_id: 19, title: 'Entering Masjid',
    arabic_text: 'اَللّٰھُمَّ افْتَحْ لِیْ اَبْوَابَ رَحْمَتِکَُُِِ',
    translation: 'O Allah, open for me the doors of your mercy.',
    reference: '[Sunan al-Nasa\'i]',
    textheading: 'Du\'a When Entering the Masjid',
    duaNumber: '19.',
    order_index: 1,
    is_favorited: false,
    memorization_status: 'not_started',
    titleAudioResId: 'title_entering_masjid',
    audio_full: 'dua19_part01_audio01_complete',
    steps: 'Enter the Masjid with the right foot and say:',
    backgroundResId: 'header_bg',
    statusBarColorResId: 'top_nav_new'
  },
  {
    id: '27', category_id: 19, title: 'Leaving Masjid',
    arabic_text: 'اَللّٰھُمَّ اِنِّی اَسْئَلُکَ مِنْ فَضْلِکََُُِِ',
    translation: 'O Allah, I ask you of Your bounties.',
    reference: '[Sahih Muslim]',
    textheading: 'Du\'a When Leaving the Masjid',
    duaNumber: '19.',
    order_index: 2,
    is_favorited: false,
    memorization_status: 'not_started',
    titleAudioResId: 'title_leaving_masjid',
    audio_full: 'dua19_part02_audio01_complete',
    steps: 'Leave the masjid with the left foot and say:',
    backgroundResId: 'header_bg',
    statusBarColorResId: 'top_nav_new'
  },

  // Category 17: Eating & Drinking (3 duas)
  {
    id: '28', category_id: 21, title: 'Before Eating',
    arabic_text: 'بِسْمِ اللّٰہَُُِِِ',
    translation: 'In the Name of Allah.',
    reference: '[Sunan Ibn Majah]',
    textheading: 'Du\'a Before Eating & Drinking',
    duaNumber: '21.',
    order_index: 1,
    is_favorited: false,
    memorization_status: 'not_started',
    titleAudioResId: 'title_eating_drinking',
    audio_full: 'dua21_part01_audio01_complete',
    steps: '1. Sit while eating and drinking\n2. Eat with your right hand and eat from what is in front of you and say:',
    backgroundResId: 'header_bg',
    statusBarColorResId: 'top_nav_new'
  },
  {
    id: '29', category_id: 21, title: 'If Forgot Before Eating',
    arabic_text: 'بِسْمِ اللّٰہِ فِی اَوَّلِہِ وَآخِرِہِ',
    translation: 'In the name of Allah, at the beginning and at the end.',
    reference: '[Sunan Ibn Majah]',
    duaNumber: '21.',
    order_index: 2,
    is_favorited: false,
    memorization_status: 'not_started',
    steps: '3. If you forgot to read the Du\'a at the beginning then upon remembering say:',
    audio_full: 'dua21_part02_audio01_complete',
    backgroundResId: 'header_bg',
    statusBarColorResId: 'top_nav_new'
  },
  {
    id: '30', category_id: 22, title: 'After Eating',
    arabic_text: 'اَلّٰھُمَّ بَارِکْ لَناَ فِیْہِ وَاَطْعِمْنَا خَیْرًا مِّنْہُ',
    translation: 'O Allah, You grant us blessings in it and grant us better than it.',
    reference: '[Sunan al-Tirmidhi]',
    textheading: 'Du\'a after Eating & Drinking',
    duaNumber: '22.',
    order_index: 3,
    is_favorited: false,
    memorization_status: 'not_started',
    titleAudioResId: 'title_after_eating',
    audio_full: 'dua22_part01_audio01_complete',
    backgroundResId: 'header_bg',
    statusBarColorResId: 'top_nav_new'
  },

  // Category 18: Visiting Sick (2 duas)
  {
    id: '31', category_id: 23, title: 'Visiting Sick - Comfort',
    arabic_text: 'لَا بَأْسَ طَهُورٌ إِنْ شَاءَ اللَّهَُُُُِِِ',
    translation: 'No harm, (this illness will be) a purification (from sins), if Allah wills.',
    reference: '[Sahih al-Bukhari]',
    textheading: 'Du\'a When Visiting the Sick',
    duaNumber: '23.',
    order_index: 1,
    is_favorited: false,
    memorization_status: 'not_started',
    titleAudioResId: 'title_sick',
    audio_full: 'dua23_part01_audio01_complete',
    backgroundResId: 'header_bg',
    statusBarColorResId: 'top_nav_new'
  },
  {
    id: '32', category_id: 23, title: 'Visiting Sick - Healing',
    arabic_text: 'اَسْاَلُ اللّٰہَ الْعَظِیْمَ رَبَّ الْعَرْشِ الْعَظِیْمِ اَنْ یَّشْفِیَکَ',
    translation: 'I ask Allah, the Great, Lord of the Magnificent Throne, to cure you.',
    reference: '[Sunan al-Tirmidhi]',
    duaNumber: '23.',
    order_index: 2,
    is_favorited: false,
    memorization_status: 'not_started',
    audio_full: 'dua23_part02_audio01_complete',
    backgroundResId: 'header_bg',
    statusBarColorResId: 'top_nav_new'
  },

  // Category 19: Calamity (2 duas)
  {
    id: '33', category_id: 24, title: 'Afflicted by Calamity',
    arabic_text: 'اِنَّا لِلّٰہِ وَاِنَّا اِلَیْہِ رَاجِعُوْنَ، \u2028اَللّٰھُمَّ اْجُرْنِىْ فِىْ مُصِیْبَتِیْ وَاَخْلِفْ لِىْ خَيْرًا مِّنْهَا',
    translation: 'Indeed we belong to Allah, and indeed to Him we will return. O Allah, recompense me for my affliction and replace it for me with something better.',
    reference: '[Sahih Muslim]',
    textheading: 'Du\'a for one Afflicted by a Calamity',
    duaNumber: '24.',
    order_index: 1,
    is_favorited: false,
    memorization_status: 'not_started',
    titleAudioResId: 'title_calamity',
    audio_full: 'dua24_part01_audio01_complete',
    backgroundResId: 'header_bg',
    statusBarColorResId: 'top_nav_new'
  },
  {
    id: '34', category_id: 25, title: 'Seeing Someone in Calamity',
    arabic_text: 'اَلْحَمْدُ لِلّٰهِ  الَّذِی عَافَانِی  مِمَّا ابْتَلَاکَ بِهِ وَ فَضَّلَنِی  عَلٰی کَثِیْرٍ مِمَّنْ خَلَقَ  تَفْضِيْلًا',
    translation: 'All praise is for Allah, Who saved me from that which He tested you with and favoured me over much of His creation.',
    reference: '[Sunan al-Tirmidhi]',
    textheading: 'Du\'a upon Seeing Someone in Calamity',
    duaNumber: '25.',
    order_index: 1,
    is_favorited: false,
    memorization_status: 'not_started',
    titleAudioResId: 'title_seeing_in_calamity',
    audio_full: 'dua25_part01_audio01_complete',
    backgroundResId: 'header_bg',
    statusBarColorResId: 'top_nav_new'
  },

  // Category 20: Anger (1 dua)
  {
    id: '35', category_id: 26, title: 'When Angry',
    arabic_text: 'اَعُوْذُ بِاللّٰہِ مِنَ الشَّیْطَانِ الرَّجِیْمِ',
    translation: 'I seek refuge in Allah from the Satan the rejected.',
    reference: '[Sahih al-Bukhari]',
    textheading: 'Du\'a when Angry',
    duaNumber: '26.',
    order_index: 1,
    is_favorited: false,
    memorization_status: 'not_started',
    titleAudioResId: 'title_angry',
    audio_full: 'dua26_part01_audio01_complete',
    steps: 'Seek refuge with Allah from the Satan:',
    backgroundResId: 'header_bg',
    statusBarColorResId: 'top_nav_new'
  },

  // Category 21: Sneezing (3 duas)
  {
    id: '36', category_id: 27, title: 'After Sneezing',
    arabic_text: 'اَلْحَمْدُ لِلّٰہِ',
    translation: 'All praises to Allah.',
    reference: '[Sahih al-Bukhari]',
    textheading: 'Du\'a when Sneezing',
    duaNumber: '27.',
    order_index: 1,
    is_favorited: false,
    memorization_status: 'not_started',
    titleAudioResId: 'title_sneezing',
    audio_full: 'dua27_part01_audio01_complete',
    steps: 'Say after sneezing:',
    backgroundResId: 'header_bg',
    statusBarColorResId: 'top_nav_new'
  },
  {
    id: '37', category_id: 27, title: 'Response to Sneezing',
    arabic_text: 'یَرْحَمُکَ اللّٰہُ',
    translation: 'May Allah have mercy on you.',
    reference: '[Sahih al-Bukhari]',
    duaNumber: '27.',
    order_index: 2,
    is_favorited: false,
    memorization_status: 'not_started',
    steps: 'Dua by one who hears someone saying اَلْحَمْدُ لِلّٰہِ',
    audio_full: 'dua27_part02_audio01_complete',
    backgroundResId: 'header_bg',
    statusBarColorResId: 'top_nav_new'
  },
  {
    id: '38', category_id: 27, title: 'Reply to Response',
    arabic_text: 'یَھْدِیْکُمُ اللّٰہُ وَیُصْلِحُ بَالَکُمْ',
    translation: 'May Allah guide you and improve your position.',
    reference: '[Sahih al-Bukhari]',
    duaNumber: '27.',
    order_index: 3,
    is_favorited: false,
    memorization_status: 'not_started',
    steps: 'Du\'a in reply by the person who sneezes:',
    audio_full: 'dua27_part03_audio01_complete',
    backgroundResId: 'header_bg',
    statusBarColorResId: 'top_nav_new'
  },

  // Category 22: Nature (2 duas)
  {
    id: '39', category_id: 28, title: 'When it Rains',
    arabic_text: 'اَلّٰھُمَّ اجْعَلْہُ  صَیِّباً  نَافِعاً',
    translation: 'O Allah, may it be a beneficial rain cloud.',
    reference: '[Sunan al-Nasa\'i]',
    textheading: 'Du\'a when it Rains',
    duaNumber: '28.',
    order_index: 1,
    is_favorited: false,
    memorization_status: 'not_started',
    titleAudioResId: 'title_rains',
    audio_full: 'dua28_part01_audio01_complete',
    backgroundResId: 'header_bg',
    statusBarColorResId: 'top_nav_new'
  },
  {
    id: '40', category_id: 29, title: 'Sighting Crescent Moon',
    arabic_text: 'اَلّٰھُمَّ اَھْلِلْہُ عَلَیْنَا بِلْیُمْنِ وَالْاِیْمَانِ وَالسَّلَامَةِ وَالْاِسْلَامِ رَبِّیْ وَرَبُّکَ اللّٰہُ',
    translation: 'O Allah! Let the moon appear over us with security, faith, peace and Islam. [O moon!] My Lord and your Lord is Allah.',
    reference: '[Sunan al-Tirmidhi]',
    textheading: 'Du\'a upon Sighting the Crescent Moon',
    duaNumber: '29.',
    order_index: 1,
    is_favorited: false,
    memorization_status: 'not_started',
    titleAudioResId: 'title_moon',
    audio_full: 'dua29_part01_audio01_complete',
    backgroundResId: 'header_bg',
    statusBarColorResId: 'top_nav_new'
  },

  // Category 23: Love of Allah (1 dua)
  {
    id: '41', category_id: 30, title: 'Seeking Allah\'s Love',
    arabic_text: 'اللَّهُمَّ إِنِّي اَسْئَلُکَ حُبَّكَ  وَحُبَّ مَنْ يُحِبُّكَ  وَعَمَلٍ يُّقَرِّبُنِى إِلَى حُبِّكَ',
    translation: 'O Allah! I ask You for Your love and for the love of the one who loves You and I ask for the deeds which lead me towards Your love.',
    reference: '[Sunan al-Tirmidhi]',
    textheading: 'Du\'a for Seeking Allah\'s Love',
    duaNumber: '30.',
    order_index: 1,
    is_favorited: false,
    memorization_status: 'not_started',
    titleAudioResId: 'title_seeking_love',
    audio_full: 'dua30_part01_audio01_complete',
    backgroundResId: 'header_bg',
    statusBarColorResId: 'top_nav_new'
  },

  // Category 24: Seeking Refuge (2 duas)
  {
    id: '42', category_id: 31, title: 'Sayyid-ul-Istighfar',
    arabic_text: 'اَللّٰھُمَّ اَنْتَ رَبِّى،لَا اِلٰہَ اِلَّااَنْتَ ،خَلَقْتَنِیْ وَاَنَا عَبْدُکَ وَاَنَا عَلَی عَھْدِکَ وَوَعْدِکَ مَااسْتَطَعْتُ،\u2028اَعُوْذُبِکَ مِنْ شَرِّ مَاصَنَعْتُ، اَبُوْءُلَکَ بِنِعْمَتِکَ عَلَیَّ وَاَبُوْءُ بِذَنْبِی فَاغْفِرْلِیْ  فَاِنَّهُ لَا یَغْفِرُالذُّنُوْبَ اِلَّا اَنْتَ',
    translation: 'O Allah, You are my Lord; there is no deity worthy of worship except You. You created me and I am your servant, I abide by Your covenant and promise to the best of my ability. I seek refuge with You from the evil of which I have committed. I acknowledge Your blessings upon me and I acknowledge my sin, so forgive me, for verily none forgives sins except You.',
    reference: '[Sahih al-Bukhari]',
    textheading: 'Du\'a: Sayyid-ul-Istighfar',
    duaNumber: '31.',
    order_index: 1,
    is_favorited: false,
    memorization_status: 'not_started',
    titleAudioResId: 'title_istighfar',
    audio_full: 'dua31_part01_audio01_complete',
    backgroundResId: 'header_bg',
    statusBarColorResId: 'top_nav_new'
  },
  {
    id: '43', category_id: 32, title: 'Seeking Refuge with Allah',
    arabic_text: 'اَعُوْذُ بِوَجْهِ اللّٰہِ الْعَظِیْمِ الَّذِیْ لَیْسَ شَیْءٌ اَعْظَمَ مِنْهُ وَبِكَلِمَاتِ اللّٰہِ التَّامَّاتِ الَّتِیْ لَا يُجَاوِزُهُنَّ بَرٌّ وَّلَا فَاجِرٌ وَبِاَسْمَاءِ اللّٰہِ الْحُسْنٰى كُلِّهَا مَا عَلِمْتُ مِنْهَا وَمَا لَمْ اَعْلَمْ مِنْ شَرِّ مَا خَلَقَ وَبَرَاَ وَذَرَاَ',
    translation: 'I seek refuge with the immense Face of Allah - there is nothing greater than it - and with the complete words of Allah which neither the good person nor the corrupt can exceed and with all the most beautiful names of Allah, what I know of them and what I do not know, from the evil of what He has created and originated and multiplied.',
    reference: '[Mishkat ul-Masabih]',
    textheading: 'Seeking Refuge with Allah',
    duaNumber: '32.',
    order_index: 1,
    is_favorited: false,
    memorization_status: 'not_started',
    titleAudioResId: 'title_refuse_with_allah',
    audio_full: 'dua32_part01_audio01_complete',
    backgroundResId: 'header_bg',
    statusBarColorResId: 'top_nav_new'
  },
];

// Word Audio Pairs (sample for first few duas)
export const wordAudioPairs: WordAudioPair[] = [
  // ==================== DU'A 1 ====================
  { id: '1', dua_id: '1', word_text: 'سُبْحَانَ اللّٰہِ', audio_res_id: 'dua01_part01_audio01', sequence_order: 0 },
  { id: '2', dua_id: '1', word_text: 'وَبِحَمْدِہِ', audio_res_id: 'dua01_part01_audio02', sequence_order: 1 },
  { id: '3', dua_id: '1', word_text: 'سُبْحَانَ اللّٰہِ الْعَظِیْمِ', audio_res_id: 'dua01_part01_audio03', sequence_order: 2 },

  // ==================== DU'A 2 ====================
  { id: '4', dua_id: '2', word_text: 'اَللّٰہُ اَکْبَرُکَبِیْرًا', audio_res_id: 'dua01_part02_audio01', sequence_order: 0 },
  { id: '5', dua_id: '2', word_text: 'وَّالْحَمْدُ لِلّٰہِ کَثِیْرًا', audio_res_id: 'dua01_part02_audio02', sequence_order: 1 },
  { id: '6', dua_id: '2', word_text: 'وَّسُبْحَانَ اللّٰہِ', audio_res_id: 'dua01_part02_audio03', sequence_order: 2 },
  { id: '7', dua_id: '2', word_text: 'بُکْرَةً وَّاَصِیْلًا۔', audio_res_id: 'dua01_part02_audio04', sequence_order: 3 },

  // ==================== DU'A 3 ====================
  { id: '8', dua_id: '3', word_text: 'اَللّٰھُمَّ صَلِّ عَلٰی', audio_res_id: 'dua02_part01_audio01', sequence_order: 0 },
  { id: '9', dua_id: '3', word_text: 'مُحَمَّدٍ وَّعَلٰی', audio_res_id: 'dua02_part01_audio02', sequence_order: 1 },
  { id: '10', dua_id: '3', word_text: 'آلِ مُحَمَّدٍ', audio_res_id: 'dua02_part01_audio03', sequence_order: 2 },

  // ==================== DU'A 4 ====================
  { id: '11', dua_id: '4', word_text: 'اَللّٰھُمَّ صَلِّ عَلٰی', audio_res_id: 'dua02_part02_audio01', sequence_order: 0 },
  { id: '12', dua_id: '4', word_text: 'مُحَمَّدٍ عَبْدِکَ', audio_res_id: 'dua02_part02_audio02', sequence_order: 1 },
  { id: '13', dua_id: '4', word_text: 'وَ رَسُوْلِکَ', audio_res_id: 'dua02_part02_audio03', sequence_order: 2 },
  { id: '14', dua_id: '4', word_text: 'کَمَا صَلَّیْتَ', audio_res_id: 'dua02_part02_audio04', sequence_order: 3 },
  { id: '15', dua_id: '4', word_text: 'عَلٰی اِبْرَاھِیْمَ', audio_res_id: 'dua02_part02_audio05', sequence_order: 4 },
  { id: '16', dua_id: '4', word_text: 'وَ بَارِکْ عَلٰی', audio_res_id: 'dua02_part02_audio06', sequence_order: 5 },
  { id: '17', dua_id: '4', word_text: 'مُحَمَّدٍ وَّعَلٰی', audio_res_id: 'dua02_part02_audio07', sequence_order: 6 },
  { id: '18', dua_id: '4', word_text: 'آلِ مُحَمَّدٍ', audio_res_id: 'dua02_part02_audio08', sequence_order: 7 },
  { id: '19', dua_id: '4', word_text: 'کَمَا بَارَکْتَ', audio_res_id: 'dua02_part02_audio09', sequence_order: 8 },
  { id: '20', dua_id: '4', word_text: 'عَلٰی اِبْرَاھِیْمَ', audio_res_id: 'dua02_part02_audio10', sequence_order: 9 },
  { id: '21', dua_id: '4', word_text: 'وَآلِ اِبْرَاھِیْمَ۔', audio_res_id: 'dua02_part02_audio11', sequence_order: 10 },

  // ==================== DU'A 5 ====================
  { id: '22', dua_id: '5', word_text: 'اَللّٰھُمَّ بِکَ اَصْبَحْنَا', audio_res_id: 'dua03_part01_audio01', sequence_order: 0 },
  { id: '23', dua_id: '5', word_text: 'وَ بِکَ اَمْسَیْنَا', audio_res_id: 'dua03_part01_audio02', sequence_order: 1 },
  { id: '24', dua_id: '5', word_text: 'وَ بِکَ نَحْیَا', audio_res_id: 'dua03_part01_audio03', sequence_order: 2 },
  { id: '25', dua_id: '5', word_text: 'وَ بِکَ نَمُوْتُ', audio_res_id: 'dua03_part01_audio04', sequence_order: 3 },
  { id: '26', dua_id: '5', word_text: 'وَ اِلَيْكَ الْمَصِیْرُ', audio_res_id: 'dua03_part01_audio05', sequence_order: 4 },

  // ==================== DU'A 6 ====================
  { id: '27', dua_id: '6', word_text: 'اَللّٰھُمَّ بِکَ اَمْسَیْنَا', audio_res_id: 'dua04_part01_audio01', sequence_order: 0 },
  { id: '28', dua_id: '6', word_text: 'وَبِکَ اَصْبَحْنَا', audio_res_id: 'dua04_part01_audio02', sequence_order: 1 },
  { id: '29', dua_id: '6', word_text: 'وَبِکَ نَحْیَا', audio_res_id: 'dua04_part01_audio03', sequence_order: 2 },
  { id: '30', dua_id: '6', word_text: 'وَبِکَ نَمُوْتُ', audio_res_id: 'dua04_part01_audio04', sequence_order: 3 },
  { id: '31', dua_id: '6', word_text: 'وَاِلَیْکَ النُّشُوْرُ', audio_res_id: 'dua04_part01_audio05', sequence_order: 4 },

  // ==================== DU'A 7 ====================
  { id: '32', dua_id: '7', word_text: 'اَعُوْذُ', audio_res_id: 'dua05_part01_audio01', sequence_order: 0 },
  { id: '33', dua_id: '7', word_text: 'بِکَلِمَاتِ اللّٰہِ التَّامَّاتِ', audio_res_id: 'dua05_part01_audio02', sequence_order: 1 },
  { id: '34', dua_id: '7', word_text: 'مِنْ شَرِّ', audio_res_id: 'dua05_part01_audio03', sequence_order: 2 },
  { id: '35', dua_id: '7', word_text: 'مَا خَلَقَ۔', audio_res_id: 'dua05_part01_audio04', sequence_order: 3 },

  // ==================== DU'A 8 ====================
  { id: '36', dua_id: '8', word_text: 'بِسْمِ اللّٰہِ الَّذِیْ', audio_res_id: 'dua05_part02_audio01', sequence_order: 0 },
  { id: '37', dua_id: '8', word_text: 'لَايَضُرُّ', audio_res_id: 'dua05_part02_audio02', sequence_order: 1 },
  { id: '38', dua_id: '8', word_text: 'مَعَ اسْمِهِ', audio_res_id: 'dua05_part02_audio03', sequence_order: 2 },
  { id: '39', dua_id: '8', word_text: 'شَىْءٌ فِى الْاَرْضِ', audio_res_id: 'dua05_part02_audio04', sequence_order: 3 },
  { id: '40', dua_id: '8', word_text: 'وَلَا فِى السَّمَآءِ', audio_res_id: 'dua05_part02_audio05', sequence_order: 4 },
  { id: '41', dua_id: '8', word_text: 'وَهُوَ السَّمِيعُ الْعَلِیْمُ', audio_res_id: 'dua05_part02_audio06', sequence_order: 5 },

  // ==================== DU'A 9 ====================
  { id: '42', dua_id: '9', word_text: 'اَللّٰھُمَّ', audio_res_id: 'dua06_part01_audio01', sequence_order: 0 },
  { id: '43', dua_id: '9', word_text: 'بِاسْمِكَ', audio_res_id: 'dua06_part01_audio02', sequence_order: 1 },
  { id: '44', dua_id: '9', word_text: 'اَمُوْتُ', audio_res_id: 'dua06_part01_audio03', sequence_order: 2 },
  { id: '45', dua_id: '9', word_text: 'وَاَحْیَا', audio_res_id: 'dua06_part01_audio04', sequence_order: 3 },

  // ==================== DU'A 10 ====================
  { id: '46', dua_id: '10', word_text: 'اَلْـحَمْدُ لِلّٰهِ الَّذِیْ', audio_res_id: 'dua07_part01_audio01', sequence_order: 0 },
  { id: '47', dua_id: '10', word_text: 'اَحْيَانَا', audio_res_id: 'dua07_part01_audio02', sequence_order: 1 },
  { id: '48', dua_id: '10', word_text: 'بَعْدَ مَا اَمَاتَنَا', audio_res_id: 'dua07_part01_audio03', sequence_order: 2 },
  { id: '49', dua_id: '10', word_text: 'وَاِلَيْهِ النُّشُوْرُ', audio_res_id: 'dua07_part01_audio04', sequence_order: 3 },

  // ==================== DU'A 11 ====================
  { id: '50', dua_id: '11', word_text: 'اَللّٰھُمَّ اِنِّیْ اَعُوْذُبِکَ', audio_res_id: 'dua08_part01_audio01', sequence_order: 0 },
  { id: '51', dua_id: '11', word_text: 'مِنَ الْخُبُثِ', audio_res_id: 'dua08_part01_audio02', sequence_order: 1 },
  { id: '52', dua_id: '11', word_text: 'وَالْخَبَائِثِ', audio_res_id: 'dua08_part01_audio03', sequence_order: 2 },

  // ==================== DU'A 12 ====================
  { id: '53', dua_id: '12', word_text: 'غُفْرَانَكَ', audio_res_id: 'dua09_part01_audio01', sequence_order: 0 },

  // ==================== DU'A 13 ====================
  { id: '54', dua_id: '13', word_text: 'اَلْحَمْدُ لِلّٰهِ الَّذِىْ', audio_res_id: 'dua10_part01_audio01', sequence_order: 0 },
  { id: '55', dua_id: '13', word_text: 'كَسَانِى', audio_res_id: 'dua10_part01_audio02', sequence_order: 1 },
  { id: '56', dua_id: '13', word_text: 'هٰذَا الثَّوْبَ', audio_res_id: 'dua10_part01_audio03', sequence_order: 2 },
  { id: '57', dua_id: '13', word_text: 'وَرَزَقَنِيْهِ', audio_res_id: 'dua10_part01_audio04', sequence_order: 3 },
  { id: '58', dua_id: '13', word_text: 'مِنْ غَيْرِ', audio_res_id: 'dua10_part01_audio05', sequence_order: 4 },
  { id: '59', dua_id: '13', word_text: 'حَوْلٍ مِّنِّى', audio_res_id: 'dua10_part01_audio06', sequence_order: 5 },
  { id: '60', dua_id: '13', word_text: 'وَلَا قُوَّةٍ', audio_res_id: 'dua10_part01_audio07', sequence_order: 6 },

  // ==================== DU'A 14 ====================
  { id: '61', dua_id: '14', word_text: 'بِسْمِ اللّٰہِ', audio_res_id: 'dua11_part01_audio01', sequence_order: 0 },

  // ==================== DU'A 15 ====================
  { id: '62', dua_id: '15', word_text: 'اَسْتَوْدِعُ اللّٰهَ', audio_res_id: 'dua15_new_part01_audio01', sequence_order: 0 },
  { id: '63', dua_id: '15', word_text: 'دِیْنَکَ', audio_res_id: 'dua15_new_part01_audio02', sequence_order: 1 },
  { id: '64', dua_id: '15', word_text: 'وَاَمَانَتَکَ،', audio_res_id: 'dua15_new_part01_audio03', sequence_order: 2 },
  { id: '65', dua_id: '15', word_text: 'وَخَوَاتِیْمَ', audio_res_id: 'dua15_new_part01_audio04', sequence_order: 3 },
  { id: '66', dua_id: '15', word_text: 'عَمَلِکَ', audio_res_id: 'dua15_new_part01_audio05', sequence_order: 4 },

  // ==================== DU'A 16 ====================
  { id: '67', dua_id: '16', word_text: 'بِسْمِ اللّٰہِ', audio_res_id: 'dua13_part01_audio01', sequence_order: 0 },

  // ==================== DU'A 17 ====================
  { id: '68', dua_id: '17', word_text: 'اَلسَّلَامُ عَلَیْکُمْ', audio_res_id: 'dua13_part02_audio01', sequence_order: 0 },

  // ==================== DU'A 18 ====================
  { id: '69', dua_id: '18', word_text: 'اَللّٰهُمَّ إِنِّیْ أَعُوْذُبِکَ', audio_res_id: 'dua14_part01_audio01', sequence_order: 0 },
  { id: '70', dua_id: '18', word_text: 'مِنْ مُنْکَرَاتِ الْأَخْلَاقِ،', audio_res_id: 'dua14_part01_audio02', sequence_order: 1 },
  { id: '71', dua_id: '18', word_text: 'وَالْأَعْمَالِ،', audio_res_id: 'dua14_part01_audio03', sequence_order: 2 },
  { id: '72', dua_id: '18', word_text: 'وَالْأَھْوَاءِ', audio_res_id: 'dua14_part01_audio04', sequence_order: 3 },

  // ==================== DU'A 19 ====================
  { id: '73', dua_id: '19', word_text: 'بِسْمِ اللّٰہِ', audio_res_id: 'dua15_part01_audio01', sequence_order: 0 },

  // ==================== DU'A 20 ====================
  { id: '74', dua_id: '20', word_text: 'اَلْحَمْدُ لِلّٰہ', audio_res_id: 'dua15_part02_audio01', sequence_order: 0 },

  // ==================== DU'A 21 ====================
  { id: '75', dua_id: '21', word_text: 'سُبْحٰنَ الَّذِیْ', audio_res_id: 'dua15_part03_audio01', sequence_order: 0 },
  { id: '76', dua_id: '21', word_text: 'سَخَّرَلَنَا', audio_res_id: 'dua15_part03_audio02', sequence_order: 1 },
  { id: '77', dua_id: '21', word_text: 'ھٰذَا', audio_res_id: 'dua15_part03_audio04', sequence_order: 2 },
  { id: '78', dua_id: '21', word_text: 'وَمَاکُنَّا', audio_res_id: 'dua15_part03_audio05', sequence_order: 3 },
  { id: '79', dua_id: '21', word_text: 'لَہ مُقْرِنِیْنَo', audio_res_id: 'dua15_part03_audio06', sequence_order: 4 },
  { id: '80', dua_id: '21', word_text: 'وَاِنَّآ اِلٰی', audio_res_id: 'dua15_part03_audio07', sequence_order: 5 },
  { id: '81', dua_id: '21', word_text: 'رَبِّنَا', audio_res_id: 'dua15_part03_audio08', sequence_order: 6 },
  { id: '82', dua_id: '21', word_text: 'لَمُنْقَلِبُوْنَo', audio_res_id: 'dua15_part03_audio09', sequence_order: 7 },

  // ==================== DU'A 22 ====================
  { id: '83', dua_id: '22', word_text: 'اَلسَّلَامُ عَلَیْکُمْ وَرَحْمَةُ اللّٰہِ وَ بَرَکَاتُہُ', audio_res_id: 'dua16_part01_audio01', sequence_order: 0 },

  // ==================== DU'A 23 ====================
  { id: '84', dua_id: '23', word_text: 'وَعَلَیْکُمُ السَّلَامُ وَرَحْمَةُ اللّٰہِ وَبَرَکَاتُہُ', audio_res_id: 'dua16_part02_audio01', sequence_order: 0 },

  // ==================== DU'A 24 ====================
  { id: '85', dua_id: '24', word_text: 'سُبْحَانَكَ اللّٰھُمَّ وَبِحَمْدِکَ،', audio_res_id: 'dua17_part01_audio01', sequence_order: 0 },
  { id: '86', dua_id: '24', word_text: 'اَشْھَدُاَنْ لَّااِلٰہَ اِلَّااَنْتَ،', audio_res_id: 'dua17_part01_audio02', sequence_order: 1 },
  { id: '87', dua_id: '24', word_text: 'اَسْتَغْفِرُکَ وَاَتُوْبُ اِلَیْکَ', audio_res_id: 'dua17_part01_audio03', sequence_order: 2 },

  // ==================== DU'A 25 ====================
  { id: '88', dua_id: '25', word_text: 'لَا اِلٰہَ اِلَّا اللّٰہُ', audio_res_id: 'dua18_part01_audio01', sequence_order: 0 },
  { id: '89', dua_id: '25', word_text: 'وَحْدَہٗ لَا شَرِیْکَ لَهٗ،', audio_res_id: 'dua18_part01_audio02', sequence_order: 1 },
  { id: '90', dua_id: '25', word_text: 'لَہُ الْمُلْکُ', audio_res_id: 'dua18_part01_audio03', sequence_order: 2 },
  { id: '91', dua_id: '25', word_text: 'وَلَہُ الْحَمْدُ', audio_res_id: 'dua18_part01_audio04', sequence_order: 3 },
  { id: '92', dua_id: '25', word_text: 'یُحْیِی', audio_res_id: 'dua18_part01_audio05', sequence_order: 4 },
  { id: '93', dua_id: '25', word_text: 'وَ یُمِیْتُ', audio_res_id: 'dua18_part01_audio06', sequence_order: 5 },
  { id: '94', dua_id: '25', word_text: 'وَھُوَ حَیٌّ لَّا یَمُوْتُ', audio_res_id: 'dua18_part01_audio07', sequence_order: 6 },
  { id: '95', dua_id: '25', word_text: 'بِیَدِہِ الْخَیْرُ', audio_res_id: 'dua18_part01_audio08', sequence_order: 7 },
  { id: '96', dua_id: '25', word_text: 'وَھُوَ عَلٰی کُلِّ شَىْءٍ قَدِیْرٌ', audio_res_id: 'dua18_part01_audio09', sequence_order: 8 },

  // ==================== DU'A 26 ====================
  { id: '97', dua_id: '26', word_text: 'اَللّٰھُمَّ افْتَحْ لِیْ', audio_res_id: 'dua19_part01_audio01', sequence_order: 0 },
  { id: '98', dua_id: '26', word_text: 'اَبْوَابَ رَحْمَتِکَ', audio_res_id: 'dua19_part01_audio02', sequence_order: 1 },

  // ==================== DU'A 27 ====================
  { id: '99', dua_id: '27', word_text: 'اَللّٰھُمَّ اِنِّی اَسْئَلُکَ', audio_res_id: 'dua20_part01_audio01', sequence_order: 0 },
  { id: '100', dua_id: '27', word_text: 'مِنْ فَضْلِکَ', audio_res_id: 'dua20_part01_audio02', sequence_order: 1 },

  // ==================== DU'A 28 ====================
  { id: '101', dua_id: '28', word_text: 'بِسْمِ اللّٰہِ', audio_res_id: 'dua21_part01_audio01', sequence_order: 0 },

  // ==================== DU'A 29 ====================
  { id: '102', dua_id: '29', word_text: 'بِسْمِ اللّٰہِ', audio_res_id: 'dua21_part02_audio01', sequence_order: 0 },
  { id: '103', dua_id: '29', word_text: 'فِی اَوَّلِہِ', audio_res_id: 'dua21_part02_audio02', sequence_order: 1 },
  { id: '104', dua_id: '29', word_text: 'وَآخِرِہِ', audio_res_id: 'dua21_part02_audio03', sequence_order: 2 },

  // ==================== DU'A 30 ====================
  { id: '105', dua_id: '30', word_text: 'اَلّٰھُمَّ بَارِکْ لَناَ فِیْہِ', audio_res_id: 'dua22_part01_audio01', sequence_order: 0 },
  { id: '106', dua_id: '30', word_text: 'وَاَطْعِمْنَا', audio_res_id: 'dua22_part01_audio02', sequence_order: 1 },
  { id: '107', dua_id: '30', word_text: 'خَیْرًا مِّنْہُ', audio_res_id: 'dua22_part01_audio03', sequence_order: 2 },

  // ==================== DU'A 31 ====================
  { id: '108', dua_id: '31', word_text: 'لَا بَأْسَ', audio_res_id: 'dua24_part01_audio01', sequence_order: 0 },
  { id: '109', dua_id: '31', word_text: 'طَهُورٌ', audio_res_id: 'dua24_part01_audio02', sequence_order: 1 },
  { id: '110', dua_id: '31', word_text: 'إِنْ شَاءَ اللَّهُ', audio_res_id: 'dua24_part01_audio03', sequence_order: 2 },

  // ==================== DU'A 32 ====================
  { id: '111', dua_id: '32', word_text: 'اَسْاَلُ اللّٰہَ الْعَظِیْمَ', audio_res_id: 'dua24_part02_audio01', sequence_order: 0 },
  { id: '112', dua_id: '32', word_text: 'رَبَّ الْعَرْشِ الْعَظِیْمِ', audio_res_id: 'dua24_part02_audio02', sequence_order: 1 },
  { id: '113', dua_id: '32', word_text: 'اَنْ یَّشْفِیَکَ', audio_res_id: 'dua24_part02_audio03', sequence_order: 2 },

  // ==================== DU'A 33 ====================
  { id: '114', dua_id: '33', word_text: 'اِنَّا لِلّٰہِ', audio_res_id: 'dua25_part01_audio01', sequence_order: 0 },
  { id: '115', dua_id: '33', word_text: 'وَاِنَّا اِلَیْہِ', audio_res_id: 'dua25_part01_audio02', sequence_order: 1 },
  { id: '116', dua_id: '33', word_text: 'رَاجِعُوْنَ،', audio_res_id: 'dua25_part01_audio03', sequence_order: 2 },
  { id: '117', dua_id: '33', word_text: 'اَللّٰھُمَّ اْجُرْنِىْ', audio_res_id: 'dua25_part01_audio04', sequence_order: 3 },
  { id: '118', dua_id: '33', word_text: 'فِىْ مُصِیْبَتِیْ', audio_res_id: 'dua25_part01_audio05', sequence_order: 4 },
  { id: '119', dua_id: '33', word_text: 'وَاَخْلِفْ لِىْ', audio_res_id: 'dua25_part01_audio06', sequence_order: 5 },
  { id: '120', dua_id: '33', word_text: 'خَيْرًا مِّنْهَا', audio_res_id: 'dua25_part01_audio07', sequence_order: 6 },

  // ==================== DU'A 34 ====================
  { id: '121', dua_id: '34', word_text: 'اَلْحَمْدُ لِلّٰهِ الَّذِی', audio_res_id: 'dua26_part01_audio01', sequence_order: 0 },
  { id: '122', dua_id: '34', word_text: 'عَافَانِی', audio_res_id: 'dua26_part01_audio02', sequence_order: 1 },
  { id: '123', dua_id: '34', word_text: 'مِمَّا ابْتَلَاکَ', audio_res_id: 'dua26_part01_audio03', sequence_order: 2 },
  { id: '124', dua_id: '34', word_text: 'بِهِ', audio_res_id: 'dua26_part01_audio04', sequence_order: 3 },
  { id: '125', dua_id: '34', word_text: 'وَ فَضَّلَنِی', audio_res_id: 'dua26_part01_audio05', sequence_order: 4 },
  { id: '126', dua_id: '34', word_text: 'عَلٰی کَثِیْرٍ', audio_res_id: 'dua26_part01_audio06', sequence_order: 5 },
  { id: '127', dua_id: '34', word_text: 'مِمَّنْ خَلَقَ', audio_res_id: 'dua26_part01_audio07', sequence_order: 6 },
  { id: '128', dua_id: '34', word_text: 'تَفْضِيْلًا', audio_res_id: 'dua26_part01_audio08', sequence_order: 7 },

  // ==================== DU'A 35 ====================
  { id: '129', dua_id: '35', word_text: 'اَعُوْذُ بِاللّٰہِ', audio_res_id: 'dua27_part01_audio01', sequence_order: 0 },
  { id: '130', dua_id: '35', word_text: 'مِنَ الشَّیْطَانِ الرَّجِیْمِ', audio_res_id: 'dua27_part01_audio02', sequence_order: 1 },

  // ==================== DU'A 36 ====================
  { id: '131', dua_id: '36', word_text: 'اَلْحَمْدُ لِلّٰہِ', audio_res_id: 'dua28_part01_audio01', sequence_order: 0 },

  // ==================== DU'A 37 ====================
  { id: '132', dua_id: '37', word_text: 'یَرْحَمُکَ اللّٰہُ', audio_res_id: 'dua28_part02_audio01', sequence_order: 0 },

  // ==================== DU'A 38 ====================
  { id: '133', dua_id: '38', word_text: 'یَھْدِیْکُمُ اللّٰہُ', audio_res_id: 'dua28_part03_audio01', sequence_order: 0 },
  { id: '134', dua_id: '38', word_text: 'وَیُصْلِحُ', audio_res_id: 'dua28_part03_audio02', sequence_order: 1 },
  { id: '135', dua_id: '38', word_text: 'بَالَکُمْ', audio_res_id: 'dua28_part03_audio03', sequence_order: 2 },

  // ==================== DU'A 39 ====================
  { id: '136', dua_id: '39', word_text: 'اَلّٰھُمَّ اجْعَلْہُ', audio_res_id: 'dua29_part01_audio01', sequence_order: 0 },
  { id: '137', dua_id: '39', word_text: 'صَیِّباً نَافِعاً', audio_res_id: 'dua29_part01_audio02', sequence_order: 1 },

  // ==================== DU'A 40 ====================
  { id: '138', dua_id: '40', word_text: 'اَلّٰھُمَّ اَھْلِلْہُ عَلَیْنَا', audio_res_id: 'dua30_part01_audio01', sequence_order: 0 },
  { id: '139', dua_id: '40', word_text: 'بِلْیُمْنِ', audio_res_id: 'dua30_part01_audio03', sequence_order: 1 },
  { id: '140', dua_id: '40', word_text: 'وَالْاِیْمَانِ', audio_res_id: 'dua30_part01_audio04', sequence_order: 2 },
  { id: '141', dua_id: '40', word_text: 'وَالسَّلَامَةِ', audio_res_id: 'dua30_part01_audio05', sequence_order: 3 },
  { id: '142', dua_id: '40', word_text: 'وَالْاِسْلَامِ', audio_res_id: 'dua30_part01_audio06', sequence_order: 4 },
  { id: '143', dua_id: '40', word_text: 'رَبِّیْ وَرَبُّکَ اللّٰہُ', audio_res_id: 'dua30_part01_audio07', sequence_order: 5 },

  // ==================== DU'A 41 ====================
  { id: '144', dua_id: '41', word_text: 'اَلّٰھُمَّ اِنِّیْ اَسْئَلُکَ', audio_res_id: 'dua31_part01_audio01', sequence_order: 0 },
  { id: '145', dua_id: '41', word_text: 'حُبَّكَ', audio_res_id: 'dua31_part01_audio02', sequence_order: 1 },
  { id: '146', dua_id: '41', word_text: 'وَحُبَّ', audio_res_id: 'dua31_part01_audio03', sequence_order: 2 },
  { id: '147', dua_id: '41', word_text: 'مَنْ يُّحِبُّكَ', audio_res_id: 'dua31_part01_audio04', sequence_order: 3 },
  { id: '148', dua_id: '41', word_text: 'وَعَمَلٍ يُّقَرِّبُنِى', audio_res_id: 'dua31_part01_audio05', sequence_order: 4 },
  { id: '149', dua_id: '41', word_text: 'اِلَى حُبِّكَ', audio_res_id: 'dua31_part01_audio06', sequence_order: 5 },

  // ==================== DU'A 42 ====================
  { id: '150', dua_id: '42', word_text: 'اَللّٰھُمَّ اَنْتَ رَبِّى،', audio_res_id: 'dua32_part01_audio01', sequence_order: 0 },
  { id: '151', dua_id: '42', word_text: 'لَا اِلٰہَ', audio_res_id: 'dua32_part01_audio02', sequence_order: 1 },
  { id: '152', dua_id: '42', word_text: 'اِلَّااَنْتَ', audio_res_id: 'dua32_part01_audio03', sequence_order: 2 },
  { id: '153', dua_id: '42', word_text: '،خَلَقْتَنِیْ', audio_res_id: 'dua32_part01_audio04', sequence_order: 3 },
  { id: '154', dua_id: '42', word_text: 'وَاَنَا عَبْدُکَ', audio_res_id: 'dua32_part01_audio05', sequence_order: 4 },
  { id: '155', dua_id: '42', word_text: 'وَاَنَا عَلَی عَھْدِکَ', audio_res_id: 'dua32_part01_audio06', sequence_order: 5 },
  { id: '156', dua_id: '42', word_text: 'وَوَعْدِکَ', audio_res_id: 'dua32_part01_audio07', sequence_order: 6 },
  { id: '157', dua_id: '42', word_text: 'مَااسْتَطَعْتُ،', audio_res_id: 'dua32_part01_audio08', sequence_order: 7 },
  { id: '158', dua_id: '42', word_text: 'اَعُوْذُبِکَ', audio_res_id: 'dua32_part01_audio09', sequence_order: 8 },
  { id: '159', dua_id: '42', word_text: 'مِنْ شَرِّ', audio_res_id: 'dua32_part01_audio10', sequence_order: 9 },
  { id: '160', dua_id: '42', word_text: 'مَاصَنَعْتُ،', audio_res_id: 'dua32_part01_audio11', sequence_order: 10 },
  { id: '161', dua_id: '42', word_text: 'اَبُوْءُلَکَ', audio_res_id: 'dua32_part01_audio12', sequence_order: 11 },
  { id: '162', dua_id: '42', word_text: 'بِنِعْمَتِکَ', audio_res_id: 'dua32_part01_audio13', sequence_order: 12 },
  { id: '163', dua_id: '42', word_text: 'عَلَیَّ', audio_res_id: 'dua32_part01_audio14', sequence_order: 13 },
  { id: '164', dua_id: '42', word_text: 'وَاَبُوْءُ', audio_res_id: 'dua32_part01_audio15', sequence_order: 14 },
  { id: '165', dua_id: '42', word_text: 'بِذَنْبِی', audio_res_id: 'dua32_part01_audio16', sequence_order: 15 },
  { id: '166', dua_id: '42', word_text: 'فَاغْفِرْلِیْ', audio_res_id: 'dua32_part01_audio17', sequence_order: 16 },
  { id: '167', dua_id: '42', word_text: 'فَاِنَّهُ', audio_res_id: 'dua32_part01_audio18', sequence_order: 17 },
  { id: '168', dua_id: '42', word_text: 'لَا یَغْفِرُالذُّنُوْبَ', audio_res_id: 'dua32_part01_audio19', sequence_order: 18 },
  { id: '169', dua_id: '42', word_text: 'اِلَّا اَنْتَ', audio_res_id: 'dua32_part01_audio20', sequence_order: 19 },

  // ==================== DU'A 43 ====================
  { id: '170', dua_id: '43', word_text: 'اَعُوْذُ', audio_res_id: 'dua33_part01_audio01', sequence_order: 0 },
  { id: '171', dua_id: '43', word_text: 'بِوَجْهِ اللّٰہِ الْعَظِیْمِ الَّذِیْ', audio_res_id: 'dua33_part01_audio02', sequence_order: 1 },
  { id: '172', dua_id: '43', word_text: 'لَیْسَ شَیْءٌ', audio_res_id: 'dua33_part01_audio03', sequence_order: 2 },
  { id: '173', dua_id: '43', word_text: 'اَعْظَمَ مِنْهُ', audio_res_id: 'dua33_part01_audio04', sequence_order: 3 },
  { id: '174', dua_id: '43', word_text: 'وَبِكَلِمَاتِ اللّٰہِ التَّامَّاتِ الَّتِیْ', audio_res_id: 'dua33_part01_audio05', sequence_order: 4 },
  { id: '175', dua_id: '43', word_text: 'لَا يُجَاوِزُهُنَّ', audio_res_id: 'dua33_part01_audio06', sequence_order: 5 },
  { id: '176', dua_id: '43', word_text: 'بَرٌّ وَّلَا فَاجِرٌ', audio_res_id: 'dua33_part01_audio08', sequence_order: 6 },
  { id: '177', dua_id: '43', word_text: 'وَبِاَسْمَاءِاللّٰہِ الْحُسْنٰى', audio_res_id: 'dua33_part01_audio09', sequence_order: 7 },
  { id: '178', dua_id: '43', word_text: 'كُلِّهَا', audio_res_id: 'dua33_part01_audio10', sequence_order: 8 },
  { id: '179', dua_id: '43', word_text: 'مَا عَلِمْتُ مِنْهَا', audio_res_id: 'dua33_part01_audio11', sequence_order: 9 },
  { id: '180', dua_id: '43', word_text: 'وَمَا لَمْ اَعْلَمْ', audio_res_id: 'dua33_part01_audio12', sequence_order: 10 },
  { id: '181', dua_id: '43', word_text: 'مِنْ شَرِّ مَا', audio_res_id: 'dua33_part01_audio13', sequence_order: 11 },
  { id: '182', dua_id: '43', word_text: 'خَلَقَ', audio_res_id: 'dua33_part01_audio14', sequence_order: 12 },
  { id: '183', dua_id: '43', word_text: 'وَبَرَاَ وَذَرَاَ', audio_res_id: 'dua33_part01_audio15', sequence_order: 13 },
];
// Helper functions
export const getAllCategories = (): Category[] => categories;

export const getCategoryById = (id: number): Category | undefined => 
  categories.find(category => category.id === id);

export const getAllDuas = (): Dua[] => duas;

export const getDuasByCategory = (categoryId: number): Dua[] => 
  duas.filter(dua => dua.category_id === categoryId).sort((a, b) => a.order_index - b.order_index);

export const getDuaById = (id: string): Dua | undefined => 
  duas.find(dua => dua.id === id);

export const getFavoriteDuas = (): Dua[] => 
  duas.filter(dua => dua.is_favorited);

export const searchDuas = (query: string): Dua[] => {
  const searchTerm = query.toLowerCase();
  return duas.filter(dua => 
    dua.title.toLowerCase().includes(searchTerm) ||
    dua.arabic_text.toLowerCase().includes(searchTerm) ||
    dua.translation.toLowerCase().includes(searchTerm) ||
    (dua.textheading && dua.textheading.toLowerCase().includes(searchTerm))
  );
};

export const getWordAudioPairsByDua = (duaId: string): WordAudioPair[] =>
  wordAudioPairs.filter(pair => pair.dua_id === duaId).sort((a, b) => a.sequence_order - b.sequence_order);

export const getDuasCount = (): { total: number; memorized: number; learning: number; notStarted: number } => {
  const counts = {
    total: duas.length,
    memorized: duas.filter(dua => dua.memorization_status === 'memorized').length,
    learning: duas.filter(dua => dua.memorization_status === 'learning').length,
    notStarted: duas.filter(dua => dua.memorization_status === 'not_started').length
  };
  return counts;
};