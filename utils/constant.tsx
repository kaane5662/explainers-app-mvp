// import { Prisma } from "@prisma/client";

import ImageSourceResults from "@/components/popups/ImageSearchResults";
import WebSearchResults from "@/components/popups/WebSearchResults";
import StudyFetchEmbed from "@/components/studyfetch/StudyfetchEmbed";
import { BookCheck, Image, Notebook, Search } from "lucide-react-native";

export const CONSTANT = "constant";
export const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/ryry";

export const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "GOOGLE_CLIENT_ID";

export const JWT_SECRET =
  process.env.JWT_SECRET ||
  "frhjwedjhekfsheufsueiwrwfjwiuergfjierqwfiuresdfgdfgdsfgdsfgdsfgwrkgqwfhdgjveqwrfiuhdsgjkdverhwfugjv";

export const SESSION_OPTIONS = {
  password: JWT_SECRET,
  cookieName: process.env.COOKIE_NAME || "sf-explainers",
  cookieOptions: {
    secure: false,
    maxAge: process.env.ENTERPRISE === "true" ? 60 * 60 * 24 * 90 : undefined,
  },
};

export const plans = {
  free: {
    credits: 0,
    name: "Free",
    minDuration: 0,
    maxDuration: 120, // 2 minutes in seconds
    maxPerDay: {
      video: 0,
      podcast: 0,
    },
    features: [
      "nndt2nrur7",
      "66apo0cmxnx",
      "u4f8j43z0a",
      "0jxmrldr9ibc",
    ],
    stripeId: "",
    prices: {
      monthly: {
        stripeId: "",
        price: 0,
      },
      yearly: {
        stripeId: "",
        price: 0,
      },
    },
    features_eng: [],
  },
  basic: {
    credits: 10,
    minDuration: 120, // 2 minutes in seconds
    maxDuration: 600, // 10 minutes in seconds,
    name: "Basic",
    maxPerDay: {
      video: 2,
      podcast: 20,
    },
    features: [
      "q999e8hvve",
      "x2n1cqjckzr",
      "7xf2abyu54c",
      "sezc45segw",
      "tlm6h9gej2",
      "uisb5f4scx",
    ],
    stripeId: "prod_RwDrnLgMXMRUVS",
    prices: {
      monthly: {
        stripeId: "price_1R2LPoGP0g7EKw7RKXEjzavC",
        price: 10,
      },
      yearly: {
        stripeId: "price_1R2LX1GP0g7EKw7R80asOTZk",
        price: 84,
      },
    },
    features_eng: [
      "Transform complex topics into memorable visuals",
      "Accelerate learning with 10 engaging videos monthly",
      "Deep-dive explanations up to 10 minutes",
      "Improve retention with AI-powered storytelling",
      "Perfect for students and professionals",
      "2 videos per day limit",
    ],
  },
  premium: {
    credits: 100,
    minDuration: 600, // 10 minutes in seconds
    maxDuration: 1800, // 30 minutes in seconds
    name: "Premium",
    maxPerDay: {
      video: 20,
      podcast: 40,
    },
    features: [
      "xgs1rtpcxno",
      "c4l9tkjt6ud",
      "guem6fy247p",
      "jfts1ptedtk",
      "crch5r61gi",
      "dc8vkwpc76",
    ],
    stripeId: "prod_RwDs6hgJjVz9CO",
    prices: {
      monthly: {
        stripeId: "price_1R2LQyGP0g7EKw7RqYgMvJwG",
        price: 20,
      },
      yearly: {
        stripeId: "price_1R2LWaGP0g7EKw7RkbfwIdWb",
        price: 168,
      },
    },
    features_eng: [
      "Master any subject with unlimited visual learning",
      "Create 100 comprehensive explanations monthly",
      "Extended 30-minute deep-learning sessions",
      "Advanced memory techniques with visual storytelling",
      "Perfect for educators, researchers & lifelong learners",
      "20 videos per day limit",
    ],
  },
};

export const locales = {
  en: "English 🇺🇸🇬🇧",
  es: "Español 🇪🇸",
  ar: "عربي 🇸🇦",
  de: "Deutsch 🇩🇪",
  fr: "Français 🇫🇷",
  it: "Italiano 🇮🇹",
  fil: "Filipino 🇵🇭",
  hi: "हिन्दी 🇮🇳",
  nl: "Nederlands 🇳🇱",
  pt: "Português 🇧🇷🇵🇹",
  cz: "Čeština 🇨🇿",
  pl: "Polski 🇵🇱",
  he: "עברית 🇮🇱",
  id: "Bahasa Indonesia 🇮🇩",
  ja: "日本語 🇯🇵",
  ko: "한국어 🇰🇷",
  zh: "中文 🇨🇳",
  ru: "Русский 🇷🇺",
  gr: "Ελληνικά 🇬🇷",
  hr: "Hrvatski 🇭🇷",
  tr: "Türkçe 🇹🇷",
  fa: "فارسی 🇮🇷",
  te: "తెలుగు 🇮🇳",
  sv: "Svenska 🇸🇪",
  th: "ไทย 🇹🇭",
  lt: "Lithuanian 🇱🇹",
};

export enum ExplainerType {
  VIDEO = "VIDEO",
  PODCAST = "PODCAST",
  REEL = "REEL",
}

export function convertSecondsToMinutes(seconds: number) {
  return Math.floor(seconds / 60);
}

export function convertToLabel(minDuration: number, maxDuration: number) {
  return `${convertSecondsToMinutes(minDuration)}-${convertSecondsToMinutes(
    maxDuration
  )} mins`;
}

export const lengths = [
  {
    plan: "short",
    length: convertSecondsToMinutes(plans.free.maxDuration),
    label: `< ${convertSecondsToMinutes(plans.free.maxDuration)} mins`,
  },
  {
    plan: "medium",
    length: convertSecondsToMinutes(plans.basic.maxDuration),
    label: convertToLabel(plans.basic.minDuration, plans.basic.maxDuration),
  },
  {
    plan: "long",
    length: convertSecondsToMinutes(plans.premium.maxDuration),
    label: convertToLabel(plans.premium.minDuration, plans.premium.maxDuration),
  },
];


export const iconActions = [
  {
      label: "Web Search",
      value: "webSearch",
      icon: <Search size={18} />,
      color: "#FFB3BA", // darker pastel pink
      // onPress: () => {
      //     console.log("Web Search pressed");
      //     setVisiblePopup("webSearch")
      //     // Add your web search logic here
      // },
      popup: (id: string, explainerType: ExplainerType, onClose: () => void) => 
          <WebSearchResults visible={true} id={id} explainerType={explainerType} onClose={onClose} />
  },
  {
      label: "Image Sources",
      value: "image sources",
      icon: <Image size={18} />,
      color: "#FFDFBA", // darker pastel orange
      // onPress: () => {
      //     console.log("Web Search pressed");
      //     setVisiblePopup("webSearch")
      //     // Add your web search logic here
      // },
      popup: (id: string, explainerType: ExplainerType, onClose: () => void) => 
          <ImageSourceResults visible={true} id={id} explainerType={explainerType} onClose={onClose} />
  },
  {
      label: "Flash Cards",
      value: "flashCards",
      icon: <Notebook size={18} />,
      color: "#B3E5B3", // darker pastel green
      // onPress: () => {
      //     console.log("Flash Cards pressed");
      //     setVisiblePopup("flashCards")
      //     // Add your flash cards logic here
      // },
      popup: (id: string, explainerType: ExplainerType, onClose: () => void) => 
          <StudyFetchEmbed title="Flashcards" loadingDescription="We're creating personalized flashcards from your content. This may take a moment..."  loadingHeader="Creating Flashcards" componentType='flashcards' id={id} explainerType={explainerType} onClose={onClose} />
  },
  {
      label: "Practice Quiz",
      value: "practiceQuiz",
      icon: <BookCheck size={18} />,
      color: "#B3C6FF", // darker pastel blue
      onPress: () => {
          console.log("Practice Quiz pressed");
          // Add your practice quiz logic here
      },
      popup: (id: string, explainerType: ExplainerType, onClose: () => void) => 
        <StudyFetchEmbed title="Practice Quiz" loadingDescription="We're creating a personalized practice quiz from your content. This may take a moment..."  loadingHeader="Creating Practice Quiz" componentType='practice-quiz' id={id} explainerType={explainerType} onClose={onClose} />
  }
];