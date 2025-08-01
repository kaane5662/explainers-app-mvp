import { Atom, Brain, Calculator, Code, FlaskConical, Leaf, Settings, Terminal, Gamepad, BarChart, Moon, Globe, Bot, Shield, Book, BookOpen, Monitor, Search, Wrench } from "lucide-react-native";
import { JSX } from "react";


export function randomString(length = 32) {
  const chars =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }

  return result;
}

export const 
VIDEO_CATEGORIES: {
  id: string;
  name: string;
  label: string;
  description: string;
  color: string;
  icon: JSX.Element;
}[] = [
  {
    id: "mathematics",
    name: "64zwy4ufl4v",
    label: "Mathematics",
    description: "Algebra, calculus, geometry, statistics, and mathematical concepts",
    color: "#FFB3B3",
    icon: <Calculator  />,
  },
  {
    id: "physics",
    name: "vlffb3exga",
    label: "Physics",
    description: "Classical mechanics, quantum physics, relativity, and physical phenomena",
    color: "#B3FFB3",
    icon: <Atom  />,
  },
  {
    id: "computer-science",
    name: "x5n6921johs",
    label: "Computer Science",
    description: "Algorithms, data structures, computer architecture, and theoretical CS",
    color: "#B3B3FF",
    icon: <Code  />,
  },
  {
    id: "programming",
    name: "1dsmp2aiijq",
    label: "Programming",
    description: "Coding tutorials, software development, and programming languages",
    color: "#FFB3E6",
    icon: <Terminal  />,
  },
  {
    id: "artificial-intelligence",
    name: "tzk379e1vc9",
    label: "Artificial Intelligence",
    description: "Machine learning, neural networks, AI applications, and deep learning",
    color: "#B3FFFF",
    icon: <Brain  />,
  },
  {
    id: "biology",
    name: "nbvv2l4jl48",
    label: "Biology",
    description: "Cellular biology, genetics, evolution, and living systems",
    color: "#FFD9B3",
    icon: <Leaf  />,
  },
  {
    id: "chemistry",
    name: "92vpciwd8l5",
    label: "Chemistry",
    description: "Chemical reactions, organic chemistry, and molecular structures",
    color: "#D9B3FF",
    icon: <FlaskConical  />,
  },
  {
    id: "engineering",
    name: "a3s3zw8ok7k",
    label: "Engineering",
    description: "Mechanical, electrical, civil, and software engineering principles",
    color: "#B3FFD9",
    icon: <Settings  />,
  },
  {
    id: "game-development",
    name: "rs4qfv1zqdi",
    label: "Game Development",
    description: "Game design, game engines, and interactive entertainment creation",
    color: "#FFB3CC",
    icon: <Gamepad  />,
  },
  {
    id: "data-science",
    name: "ger390jtfw6",
    label: "Data Science",
    description: "Data analysis, visualization, statistics, and big data processing",
    color: "#B3CCFF",
    icon: <BarChart  />,
  },
  {
    id: "astronomy",
    name: "0nvx8fi8o5q",
    label: "Astronomy",
    description: "Space exploration, celestial bodies, and cosmology",
    color: "#FFD9B3",
    icon: <Moon  />,
  },
  {
    id: "earth-science",
    name: "foo1fgusejc",
    label: "Earth Science",
    description: "Geology, climate, environmental science, and earth systems",
    color: "#D9B3FF",
    icon: <Globe  />,
  },
  {
    id: "robotics",
    name: "6r1d8cf42u6",
    label: "Robotics",
    description: "Robot design, automation, mechatronics, and control systems",
    color: "#B3FFD9",
    icon: <Bot  />,
  },
  {
    id: "web-development",
    name: "uw1xf7qljxb",
    label: "Web Development",
    description: "Frontend, backend, web design, and internet technologies",
    color: "#FFB3CC",
    icon: <Globe  />,
  },
  {
    id: "cybersecurity",
    name: "jlpzdxg8lda",
    label: "Cybersecurity",
    description: "Network security, cryptography, and digital privacy",
    color: "#B3CCFF",
    icon: <Shield  />,
  },
  {
    id: "mathematics-education",
    name: "9yy1u8mjwn",
    label: "Mathematics Education",
    description: "Teaching methods, math pedagogy, and educational resources for mathematics",
    color: "#FFD9B3",
    icon: <Book  />,
  },
  {
    id: "science-education",
    name: "2gznmo6sh2t",
    label: "Science Education",
    description: "Teaching methods, science pedagogy, and lab demonstrations",
    color: "#D9B3FF",
    icon: <BookOpen  />,
  },
  {
    id: "educational-technology",
    name: "fi0nmac3lli",
    label: "Educational Technology",
    description: "Digital learning tools, educational software, and e-learning platforms",
    color: "#B3FFD9",
    icon: <Monitor  />,
  },
  {
    id: "research-methods",
    name: "rxekqcrkpeo",
    label: "Research Methods",
    description: "Scientific method, experimental design, and academic research skills",
    color: "#FFB3CC",
    icon: <Search  />,
  },
  {
    id: "stem-projects",
    name: "fspza5jqu3j",
    label: "STEM Projects",
    description: "Hands-on experiments, science fair projects, and practical applications",
    color: "#B3CCFF",
    icon: <Wrench  />,
  }
];

export const ALL_CATEGORY = { id: "all", name: "All" };





export const voiceOptions = [
  { label: "Alex (female)", value: "Autonoe", audio:"/audios/alex-voice-preview.wav" },
  { label: "Morgan (male)", value: "Puck", audio:"/audios/morgan-voice-preview.wav"  },
  { label: "Riley (female)", value: "Aoede", audio:"/audios/riley-voice-preview.wav"  },
  { label: "Jordan (female)", value: "Kore", audio:"/audios/jordan-voice-preview.wav"  },
  { label: "Casey (male)", value: "Fenrir", audio:"/audios/casey-voice-preview.wav"  },
  { label: "Taylor (male)", value: "Sadachbia", audio:"/audios/taylor-voice-preview.wav"  }
];

export const voiceThemeOptions = [
  { label: "u22o1uirmh", value: "professional", example: "k80tuzyflbk" },
  { label: "bkatt3wphxg", value: "casual", example: "q57pffdugzc" },
  { label: "sv8stm3fbp", value: "educational", example: "2s8prircnqq" },
  { label: "vfrm12s7nq", value: "mysterious", example: "bru0kb0r7t" },
  { label: "bcgc48pge9s", value: "youthful", example: "zovdf7hvzq7" },
  { label: "a3imhj8m5z", value: "inspirational", example: "yd6uqs47soq" },
  { label: "pbzfzt3mu7i", value: "experimental", example: "2n26bdhvcm7" },
  { label: "fzx76yyf4j5", value: "angry", example: "70js6arsimu" },
  { label: "ilju4nhj2d", value: "custom", example: "" },
];

export const videoStyleOptions = [
  { label: "zpzt7fo1rvq", value: "professional", example: "j7d7icrbcs" },
  { label: "ieicn96oeg", value: "teacher", example: "j1v4ilcqm7" },
  { label: "yf8jhln9ijb", value: "quick-guide", example: "zinos1c7axe" },
  { label: "urqsoinnxb", value: "deep-dive", example: "9rs21lh6uj" },
  { label: "8qui6i1dmaf", value: "storyteller", example: "8087ebzu1fx" },
  { label: "hs6ghotswi", value: "angry", example: "ao6xouf8s9s" },
  { label: "hjpc2cqcgs", value: "comedy", example: "u26noqaq76p" },
  { label: "vxwn67y0b2p", value: "meme", example: "li0xq0tyfdg" },
  { label: "4zpn4hxjwy5", value: "sarcastic", example: "rf86n54n7a" },
  { label: "cjaypyxkl6r", value: "custom", example: "" }
];



// export const explainerTypeOptions = [
//   {
//     label:"w9qmclfwe1i",
//     value:ExplainerType.VIDEO,
//     icon: <Video></Video>
//   },
//   {
//     label:"agawimcr47t",
//     value:ExplainerType.PODCAST,
//     icon:<Headphones></Headphones>
//   },
//   {
//     label:"zgfbreti6th",
//     value:ExplainerType.REEL,
//     icon:<Film></Film>
//   }
// ]

export const onboardingOptionsById = {
  currentRole: [
    { label: "rxtkeeymqy", description: "Student", value: "student" },
    { label: "it0ki2iszj", description: "Teacher", value: "teacher" },
    { label: "5g642uh9uwj", description: "Professional", value: "professional" },
    { label: "vx7jpfefjvh", description: "Parent", value: "parent" },
  ],
  learningStyle: [
    { label: "6fj1ogvwffn", description: "Seeing and reading", value: "visual" },
    { label: "0k1oe51pp9nr", description: "Listening and speaking", value: "auditory" },
    // { label: "Reading/Writing", description: "Reading/Writing", value: "readingWriting" }, // commented out as in source
    { label: "mtss8g6dwe", description: "Not sure", value: "notSure" },
  ],
  explainerTheme: [
    { label: "59hgtfuddpr", description: "Serious and academic", value: "serious" },
    { label: "wbx4z8habzp", description: "Fun and engaging", value: "fun" },
    { label: "hx9dwmsjff9", description: "Story-driven", value: "story" },
    { label: "3snsgcuozps", description: "Not sure", value: "notSure" },
  ],
  subjects: VIDEO_CATEGORIES.map((v) => ({
    label: v.name,
    description: v.description,
    value: v.id,
  })),
  goals: [
    { label: "uohepi68tsl", description: "Prepare for exams or tests", value: "exam_prep" },
    { label: "oc75tpd4qo", description: "Deepen understanding of specific subjects", value: "deepen_understanding" },
    { label: "aluom044m", description: "Stay updated with the latest knowledge", value: "stay_updated" },
    // { label: "Develop practical skills", description: "Develop practical skills", value: "practical_skills" },
    { label: "1t4vl5jbud0g", description: "Just exploring", value: "exploring" },
    // { label: "Other", description: "Other", value: "other" },
  ],
  collegeMajors: [
    { label: "Computer Science", description: "Computer Science", value: "cs" },
    { label: "Business", description: "Business", value: "business" },
    { label: "Engineering", description: "Engineering", value: "engineering" },
    { label: "Biology", description: "Biology", value: "biology" },
    { label: "Psychology", description: "Psychology", value: "psychology" },
    { label: "Education", description: "Education", value: "education" },
    { label: "Nursing", description: "Nursing", value: "nursing" },
    { label: "Communications", description: "Communications", value: "communications" },
    { label: "Political Science", description: "Political Science", value: "political_science" },
    { label: "Economics", description: "Economics", value: "economics" },
    { label: "English", description: "English", value: "english" },
    { label: "Mathematics", description: "Mathematics", value: "mathematics" },
    { label: "Art", description: "Art", value: "art" },
    { label: "History", description: "History", value: "history" },
    { label: "Sociology", description: "Sociology", value: "sociology" },
    { label: "Chemistry", description: "Chemistry", value: "chemistry" },
    { label: "Physics", description: "Physics", value: "physics" },
    { label: "Philosophy", description: "Philosophy", value: "philosophy" },
    { label: "Environmental Science", description: "Environmental Science", value: "environmental_science" },
    { label: "Other", description: "Other", value: "other" },
  ]
};


// Generate random 8-character alphanumeric code
export function generateReferralCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}