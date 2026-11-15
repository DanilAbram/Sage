import { DEMO_I18N } from "./demo-i18n";
import type { Lang } from "./i18n";

export type Career = {
  name: string;
  match: number; // 0-100
  why: string;
  step: string;
  // full report only (subscribers); empty in the free preview
  daily: string;
  path: string; // how to get there: study / training route
  plan: string[]; // 30-day starter plan, one line per week
};

// Offline fallback used when Gemini is not configured or every model fails. Shown to the user as sample ideas.
const DEMO = [
  { name: "Game Designer", tags: ["game", "video", "play", "story", "puzzle"], why: "You enjoy games, so you already understand what makes them fun.", daily: "Designing levels and rules, testing with players, and tuning the fun.", step: "Build a tiny game in a free engine like Godot and share it online." },
  { name: "UX / Product Designer", tags: ["draw", "design", "art", "creative", "people", "phone", "app"], why: "You like creating things that look good and work well for people.", daily: "Sketching screens, talking to users, and improving apps and websites.", step: "Redesign one app you use daily and write down why your version is better." },
  { name: "Illustrator / Animator", tags: ["draw", "art", "paint", "cartoon", "anime", "sketch"], why: "Drawing is the core skill; studios and brands always need visual storytellers.", daily: "Creating characters and scenes for books, games, ads or films.", step: "Post one finished piece every week for a month." },
  { name: "Software Developer", tags: ["code", "computer", "game", "tech", "build", "robot", "app", "puzzle"], why: "You like building and solving problems, which is what developers do all day.", daily: "Writing and testing code, fixing bugs, and working with a small team.", step: "Do a free beginner course and make one small project." },
  { name: "Music Producer / Sound Designer", tags: ["music", "sing", "guitar", "piano", "drum", "dj", "sound"], why: "Your ear and love of music can become a career in production, film or games.", daily: "Recording, mixing and shaping sounds for songs, films or games.", step: "Make a 60-second track in a free tool like BandLab." },
  { name: "Sports Coach / Fitness Trainer", tags: ["sport", "gym", "run", "football", "soccer", "fitness", "basketball", "swim"], why: "You live sport and can help others improve at it.", daily: "Planning training, giving feedback, and motivating athletes.", step: "Volunteer to help coach a youth team or class." },
  { name: "Chef / Food Entrepreneur", tags: ["cook", "bake", "food", "recipe", "eat"], why: "Cooking mixes creativity with skill, and food brands are growing fast.", daily: "Preparing dishes, creating menus, and managing a kitchen or small food business.", step: "Cook one dish for friends each week and collect feedback." },
  { name: "Psychologist / Counselor", tags: ["help", "people", "friend", "listen", "talk", "advice", "problem"], why: "Helping people with problems shows empathy, a key quality in counseling.", daily: "Listening, asking good questions, and guiding people through challenges.", step: "Read an intro psychology book and talk to someone working in the field." },
  { name: "Veterinarian / Animal Care", tags: ["animal", "dog", "cat", "pet", "horse", "nature"], why: "Your care for animals fits vet, zookeeper and animal-behavior work.", daily: "Examining and treating animals and advising their owners.", step: "Volunteer at a local shelter this month." },
  { name: "Engineer / Maker", tags: ["build", "lego", "fix", "repair", "car", "robot", "3d", "craft"], why: "You like making and fixing things, the base of engineering.", daily: "Designing, prototyping and testing real products.", step: "Start a small build project, like a simple robot or a 3D-printed item." },
  { name: "Content Creator / Video Editor", tags: ["video", "film", "youtube", "edit", "photo", "camera", "social", "stream"], why: "You enjoy making and sharing media, a skill brands pay for.", daily: "Planning, filming and editing videos for an audience or a brand.", step: "Publish three short videos on one topic and see what people respond to." },
  { name: "Writer / Journalist", tags: ["write", "read", "book", "story", "blog", "poem"], why: "Reading and writing are the foundation of every writing career.", daily: "Researching, writing and editing articles, scripts or books.", step: "Write a short piece weekly and share it publicly." },
  { name: "Outdoor Guide / Environmental Scientist", tags: ["hike", "outdoor", "camp", "nature", "travel", "climb", "garden"], why: "You thrive outside, which suits guiding, conservation and field science.", daily: "Working outdoors: leading groups, collecting data, protecting places.", step: "Join a local nature or clean-up group." },
  { name: "Teacher / Educator", tags: ["teach", "kid", "explain", "help", "learn", "school"], why: "You like helping others understand things.", daily: "Preparing lessons, explaining ideas, and supporting students.", step: "Tutor one person in something you know well." },
];

export function demoCareers(text: string, count = 5, lang: Lang = "en"): Career[] {
  const q = text.toLowerCase();
  const pack = DEMO_I18N[lang];
  // English keywords always count (people mix languages); the visitor's language adds its own
  const scored = DEMO.map((c, i) => ({
    i,
    score: [...c.tags, ...(pack?.rows[i]?.[4] ?? [])].filter((t) => q.includes(t)).length,
  }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);
  const fallbackNames = ["Content Creator / Video Editor", "Teacher / Educator", "UX / Product Designer", "Writer / Journalist", "Software Developer"];
  const list = scored.map((x) => x.i);
  for (const n of fallbackNames) {
    if (list.length >= count) break;
    const i = DEMO.findIndex((d) => d.name === n);
    if (!list.includes(i)) list.push(i);
  }
  return list.slice(0, count).map((idx, i) => {
    const c = DEMO[idx];
    const row = pack?.rows[idx];
    const [name, why, daily, step] = row ?? [c.name, c.why, c.daily, c.step];
    const week = pack?.week ?? "Week";
    const rest = pack?.plan ?? [
      "Watch two 'day in the life' videos from people in this job and note what excites you.",
      "Message one person who does this work and ask them two questions.",
      "Decide your next learning step and block time for it.",
    ];
    return {
      name,
      match: Math.max(65, 94 - i * 6),
      why,
      daily,
      step,
      path: pack?.path ?? "Start with free online courses and small personal projects, then look at a certificate, diploma or degree in the field.",
      plan: [`${week} 1: ${step}`, ...rest.map((r, n) => `${week} ${n + 2}: ${r}`)],
    };
  });
}

/** Validate one career object from the model; returns null if anything essential is missing. */
export function cleanCareer(raw: unknown): Career | null {
  if (!raw || typeof raw !== "object") return null;
  const c = raw as Record<string, unknown>;
  const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
  const name = str(c.name, 80);
  const why = str(c.why, 400);
  const step = str(c.step, 300);
  if (!name || !why || !step) return null;
  const plan = Array.isArray(c.plan) ? c.plan.map((p) => str(p, 200)).filter(Boolean).slice(0, 4) : [];
  return {
    name,
    match: Math.min(98, Math.max(60, Math.round(Number(c.match) || 75))),
    why,
    step,
    daily: str(c.daily, 300),
    path: str(c.path, 400),
    plan,
  };
}
