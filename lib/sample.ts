import type { Career } from "./careers";
import type { Lang } from "./i18n";

// A real Sage result: captured verbatim from /api/careers (Gemini, full report) on 2026-11-14
// for the input below. Shown on the landing page, labelled as an example. Replace it with a newer
// capture whenever the prompt changes; never hand-edit it into something the product did not say.
export const SAMPLE_INPUT = "drawing, video games, explaining things to my friends";

export const SAMPLE: Career = {
  name: "Game Level Designer",
  match: 95,
  why: "Combines your love for video games and drawing by letting you sketch out spatial layouts and map out player experiences.",
  step: "Download a free game engine like Unreal or Godot and watch a basic beginner tutorial on blocking out a simple room.",
  daily: "You build and test playable 3D environments, balancing visual aesthetics with clear pathfinding to guide players through the story.",
  path: "Most enter through a degree in game design or interactive media, though a strong portfolio of custom levels is the ultimate resume.",
  plan: [
    "Week 1: Research basic level design principles and watch analysis videos of your favorite game maps.",
    "Week 2: Sketch out a top-down layout for a fictional dungeon or puzzle room on paper.",
    "Week 3: Recreate your paper sketch inside a free 3D modeling tool or game engine prototype blockout.",
    "Week 4: Playtest your prototype with a friend, observe where they get stuck, and make adjustments.",
  ],
};

// Translations of the captured result above, for visitors reading Sage in another language.
// They translate the same real result; they are not separate captures.
export const SAMPLE_I18N: Partial<Record<Lang, { input: string; career: Career }>> = {
  es: {
    input: "dibujar, videojuegos, explicarles cosas a mis amigos",
    career: {
      name: "Diseñador de niveles de videojuegos",
      match: 95,
      why: "Une tu amor por los videojuegos y el dibujo: bocetas espacios y trazas lo que vivirá el jugador.",
      step: "Descarga un motor gratis como Unreal o Godot y mira un tutorial básico sobre cómo montar una sala sencilla.",
      daily: "Construyes y pruebas entornos 3D jugables, equilibrando lo visual con caminos claros que guían al jugador por la historia.",
      path: "Lo habitual es estudiar diseño de videojuegos o medios interactivos, aunque un buen portafolio de niveles propios es el mejor currículum.",
      plan: [
        "Semana 1: Investiga los principios básicos del diseño de niveles y mira análisis de los mapas de tus juegos favoritos.",
        "Semana 2: Dibuja en papel la planta de una mazmorra o sala de puzles inventada.",
        "Semana 3: Recrea tu boceto en una herramienta 3D gratis o en un prototipo dentro de un motor de juego.",
        "Semana 4: Prueba el prototipo con un amigo, fíjate dónde se atasca y haz ajustes.",
      ],
    },
  },
  fr: {
    input: "dessiner, jeux vidéo, expliquer des choses à mes amis",
    career: {
      name: "Level designer de jeux vidéo",
      match: 95,
      why: "Réunit ton amour des jeux vidéo et du dessin : tu esquisses des espaces et traces l'expérience du joueur.",
      step: "Télécharge un moteur gratuit comme Unreal ou Godot et regarde un tutoriel débutant sur la création d'une pièce simple.",
      daily: "Tu construis et testes des environnements 3D jouables, en équilibrant l'esthétique et des chemins clairs qui guident le joueur dans l'histoire.",
      path: "On y entre souvent par des études de game design ou de médias interactifs, mais un bon portfolio de niveaux créés soi-même reste le meilleur CV.",
      plan: [
        "Semaine 1 : Découvre les principes de base du level design et regarde des analyses des cartes de tes jeux préférés.",
        "Semaine 2 : Dessine sur papier le plan vu de dessus d'un donjon ou d'une salle d'énigmes imaginaire.",
        "Semaine 3 : Recrée ton croquis dans un outil 3D gratuit ou un prototype dans un moteur de jeu.",
        "Semaine 4 : Fais tester ton prototype à un ami, observe où il bloque et ajuste.",
      ],
    },
  },
  de: {
    input: "zeichnen, Videospiele, Freunden Dinge erklären",
    career: {
      name: "Level Designer für Videospiele",
      match: 95,
      why: "Verbindet deine Liebe zu Videospielen und zum Zeichnen: Du skizzierst Räume und planst, was Spieler erleben.",
      step: "Lade eine kostenlose Engine wie Unreal oder Godot herunter und schau ein Einsteiger-Tutorial zum Aufbau eines einfachen Raums.",
      daily: "Du baust und testest spielbare 3D-Welten und bringst Optik und klare Wege in Balance, die Spieler durch die Geschichte führen.",
      path: "Meist über ein Studium in Game Design oder interaktiven Medien – ein starkes Portfolio eigener Level ist aber der beste Lebenslauf.",
      plan: [
        "Woche 1: Lerne die Grundlagen des Level Designs und schau Analysen der Karten deiner Lieblingsspiele.",
        "Woche 2: Zeichne auf Papier den Grundriss eines erfundenen Dungeons oder Rätselraums.",
        "Woche 3: Bau deine Skizze in einem kostenlosen 3D-Tool oder als Prototyp in einer Game Engine nach.",
        "Woche 4: Lass einen Freund deinen Prototyp testen, beobachte, wo er hängen bleibt, und verbessere es.",
      ],
    },
  },
  ru: {
    input: "рисование, видеоигры, объяснять друзьям разные вещи",
    career: {
      name: "Дизайнер уровней в видеоиграх",
      match: 95,
      why: "Объединяет твою любовь к видеоиграм и рисованию: ты набрасываешь пространства и продумываешь путь игрока.",
      step: "Скачай бесплатный движок вроде Unreal или Godot и посмотри базовый урок о том, как собрать простую комнату.",
      daily: "Ты строишь и тестируешь игровые 3D-локации, сочетая красивую картинку с понятными путями, которые ведут игрока по сюжету.",
      path: "Обычно приходят через обучение геймдизайну или интерактивным медиа, но сильное портфолио своих уровней — лучшее резюме.",
      plan: [
        "Неделя 1: Изучи основы дизайна уровней и посмотри разборы карт из любимых игр.",
        "Неделя 2: Нарисуй на бумаге план выдуманного подземелья или комнаты с головоломкой.",
        "Неделя 3: Перенеси набросок в бесплатный 3D-редактор или собери прототип в игровом движке.",
        "Неделя 4: Дай другу поиграть в прототип, посмотри, где он застревает, и доработай.",
      ],
    },
  },
};
