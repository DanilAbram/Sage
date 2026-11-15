// Translations of the offline fallback ideas in lib/careers.ts (DEMO), in the same order.
// Each entry: [name, why, daily, step, extra keyword stems in that language].
// Keyword stems are matched as substrings of the visitor's text, so short stems catch more word forms.
import type { Lang } from "./i18n";

type Row = [string, string, string, string, string[]];
type Pack = { rows: Row[]; path: string; week: string; plan: [string, string, string] };

export const DEMO_I18N: Partial<Record<Lang, Pack>> = {
  es: {
    week: "Semana",
    path: "Empieza con cursos gratis en línea y pequeños proyectos propios; después mira un certificado, diploma o grado en el área.",
    plan: [
      "Mira dos vídeos de 'un día en la vida' de personas con este trabajo y anota lo que te entusiasma.",
      "Escribe a una persona que haga este trabajo y hazle dos preguntas.",
      "Decide tu siguiente paso de aprendizaje y resérvale tiempo.",
    ],
    rows: [
      ["Diseñador de videojuegos", "Te gustan los juegos, así que ya entiendes qué los hace divertidos.", "Diseñar niveles y reglas, probar con jugadores y ajustar la diversión.", "Crea un juego pequeño en un motor gratis como Godot y compártelo en internet.", ["juego", "jugar", "videojuego", "historia", "puzzle", "rompecabezas"]],
      ["Diseñador UX / de producto", "Te gusta crear cosas que se vean bien y funcionen bien para la gente.", "Bocetar pantallas, hablar con usuarios y mejorar apps y webs.", "Rediseña una app que uses a diario y escribe por qué tu versión es mejor.", ["dibuj", "diseñ", "arte", "creativ", "gente", "móvil", "app"]],
      ["Ilustrador / Animador", "Dibujar es la habilidad central; estudios y marcas siempre necesitan narradores visuales.", "Crear personajes y escenas para libros, juegos, anuncios o películas.", "Publica una pieza terminada cada semana durante un mes.", ["dibuj", "arte", "pint", "cómic", "anime", "boceto"]],
      ["Desarrollador de software", "Te gusta construir y resolver problemas, que es lo que hacen los desarrolladores todo el día.", "Escribir y probar código, corregir errores y trabajar en un equipo pequeño.", "Haz un curso gratis para principiantes y crea un proyecto pequeño.", ["program", "código", "ordenador", "computador", "tecnolog", "robot", "construir"]],
      ["Productor musical / Diseñador de sonido", "Tu oído y tu amor por la música pueden ser una carrera en producción, cine o juegos.", "Grabar, mezclar y dar forma a sonidos para canciones, películas o juegos.", "Haz una pista de 60 segundos con una herramienta gratis como BandLab.", ["músic", "cant", "guitarra", "piano", "batería", "dj", "sonido"]],
      ["Entrenador deportivo / Entrenador personal", "Vives el deporte y puedes ayudar a otros a mejorar.", "Planificar entrenamientos, dar feedback y motivar a deportistas.", "Ofrécete como ayudante de un equipo o clase juvenil.", ["deport", "gimnasio", "correr", "fútbol", "fitness", "baloncesto", "nadar"]],
      ["Chef / Emprendedor gastronómico", "Cocinar mezcla creatividad y técnica, y las marcas de comida crecen rápido.", "Preparar platos, crear menús y llevar una cocina o un pequeño negocio de comida.", "Cocina un plato para tus amigos cada semana y pide su opinión.", ["cocin", "hornear", "repost", "comida", "receta", "comer"]],
      ["Psicólogo / Orientador", "Ayudar a la gente con sus problemas muestra empatía, clave en la orientación.", "Escuchar, hacer buenas preguntas y guiar a personas en sus retos.", "Lee un libro de introducción a la psicología y habla con alguien que trabaje en ello.", ["ayud", "gente", "amig", "escuch", "hablar", "consejo", "problema"]],
      ["Veterinario / Cuidado animal", "Tu cariño por los animales encaja con veterinaria, zoológicos y comportamiento animal.", "Examinar y tratar animales y aconsejar a sus dueños.", "Haz voluntariado en un refugio local este mes.", ["animal", "perro", "gato", "mascota", "caballo", "naturaleza"]],
      ["Ingeniero / Maker", "Te gusta hacer y arreglar cosas, la base de la ingeniería.", "Diseñar, prototipar y probar productos reales.", "Empieza un proyecto pequeño, como un robot sencillo o una pieza impresa en 3D.", ["constru", "lego", "arregl", "repar", "coche", "robot", "3d", "manualidad"]],
      ["Creador de contenido / Editor de vídeo", "Te gusta crear y compartir contenido, una habilidad que las marcas pagan.", "Planificar, grabar y editar vídeos para un público o una marca.", "Publica tres vídeos cortos sobre un tema y mira a qué responde la gente.", ["vídeo", "video", "película", "youtube", "editar", "foto", "cámara", "redes", "stream"]],
      ["Escritor / Periodista", "Leer y escribir son la base de toda carrera de escritura.", "Investigar, escribir y editar artículos, guiones o libros.", "Escribe un texto corto cada semana y compártelo.", ["escrib", "leer", "lectura", "libro", "historia", "blog", "poema", "poesía"]],
      ["Guía de naturaleza / Científico ambiental", "Te sientes bien al aire libre, algo ideal para guiar, conservar y hacer ciencia de campo.", "Trabajar al aire libre: guiar grupos, recoger datos y proteger lugares.", "Únete a un grupo local de naturaleza o de limpieza.", ["senderismo", "montaña", "acampar", "naturaleza", "viaj", "escalar", "jardín"]],
      ["Profesor / Educador", "Te gusta ayudar a otros a entender las cosas.", "Preparar clases, explicar ideas y apoyar a estudiantes.", "Da clases a una persona sobre algo que domines.", ["enseñ", "niño", "explic", "ayud", "aprend", "escuela", "colegio"]],
    ],
  },
  fr: {
    week: "Semaine",
    path: "Commence par des cours gratuits en ligne et de petits projets perso, puis regarde un certificat, un diplôme ou une licence dans le domaine.",
    plan: [
      "Regarde deux vidéos « une journée dans la vie » de personnes qui font ce métier et note ce qui t'enthousiasme.",
      "Écris à une personne qui fait ce métier et pose-lui deux questions.",
      "Choisis ta prochaine étape d'apprentissage et bloque du temps pour elle.",
    ],
    rows: [
      ["Game designer", "Tu aimes les jeux, donc tu comprends déjà ce qui les rend amusants.", "Concevoir des niveaux et des règles, tester avec des joueurs et régler le plaisir de jeu.", "Crée un petit jeu dans un moteur gratuit comme Godot et partage-le en ligne.", ["jeu", "jeux", "jouer", "histoire", "puzzle", "énigme"]],
      ["Designer UX / produit", "Tu aimes créer des choses belles et pratiques pour les gens.", "Esquisser des écrans, parler aux utilisateurs et améliorer des applis et des sites.", "Redessine une appli que tu utilises chaque jour et explique pourquoi ta version est meilleure.", ["dessin", "design", "art", "créati", "gens", "téléphone", "appli"]],
      ["Illustrateur / Animateur", "Le dessin est la compétence clé ; studios et marques ont toujours besoin de conteurs visuels.", "Créer des personnages et des scènes pour des livres, jeux, pubs ou films.", "Publie une œuvre terminée chaque semaine pendant un mois.", ["dessin", "art", "peint", "bd", "manga", "anime", "croquis"]],
      ["Développeur logiciel", "Tu aimes construire et résoudre des problèmes : c'est le quotidien d'un développeur.", "Écrire et tester du code, corriger des bugs et travailler en petite équipe.", "Suis un cours gratuit pour débutants et réalise un petit projet.", ["code", "program", "ordinateur", "informatique", "tech", "robot", "construire"]],
      ["Producteur de musique / Sound designer", "Ton oreille et ton amour de la musique peuvent devenir un métier dans la production, le cinéma ou le jeu vidéo.", "Enregistrer, mixer et façonner des sons pour des chansons, des films ou des jeux.", "Crée un morceau de 60 secondes avec un outil gratuit comme BandLab.", ["musique", "chant", "guitare", "piano", "batterie", "dj", "son"]],
      ["Coach sportif / Préparateur physique", "Tu vis le sport et tu peux aider les autres à progresser.", "Planifier des entraînements, faire des retours et motiver des sportifs.", "Propose ton aide pour entraîner une équipe ou un cours de jeunes.", ["sport", "salle", "course", "courir", "foot", "fitness", "basket", "nage", "natation"]],
      ["Chef / Entrepreneur culinaire", "Cuisiner mêle créativité et technique, et les marques alimentaires grandissent vite.", "Préparer des plats, créer des menus et gérer une cuisine ou une petite entreprise.", "Cuisine un plat pour tes amis chaque semaine et recueille leur avis.", ["cuisin", "pâtiss", "gâteau", "nourriture", "recette", "manger"]],
      ["Psychologue / Conseiller", "Aider les gens à résoudre leurs problèmes montre de l'empathie, une qualité clé du conseil.", "Écouter, poser de bonnes questions et accompagner les gens dans leurs difficultés.", "Lis un livre d'introduction à la psychologie et parle à quelqu'un du métier.", ["aider", "gens", "ami", "écout", "parler", "conseil", "problème"]],
      ["Vétérinaire / Soins aux animaux", "Ton attention aux animaux convient au métier de vétérinaire, de soigneur ou au comportement animal.", "Examiner et soigner des animaux et conseiller leurs propriétaires.", "Fais du bénévolat dans un refuge près de chez toi ce mois-ci.", ["animal", "animaux", "chien", "chat", "cheval", "nature"]],
      ["Ingénieur / Maker", "Tu aimes fabriquer et réparer des choses, la base de l'ingénierie.", "Concevoir, prototyper et tester de vrais produits.", "Lance un petit projet, comme un robot simple ou un objet imprimé en 3D.", ["construi", "bricol", "lego", "répar", "voiture", "robot", "3d"]],
      ["Créateur de contenu / Monteur vidéo", "Tu aimes créer et partager des médias, une compétence que les marques paient.", "Préparer, filmer et monter des vidéos pour un public ou une marque.", "Publie trois courtes vidéos sur un sujet et vois ce qui plaît.", ["vidéo", "film", "youtube", "montage", "photo", "caméra", "réseaux", "stream"]],
      ["Écrivain / Journaliste", "Lire et écrire sont la base de tous les métiers de l'écriture.", "Se documenter, écrire et corriger des articles, des scénarios ou des livres.", "Écris un court texte chaque semaine et partage-le publiquement.", ["écri", "lire", "lecture", "livre", "histoire", "blog", "poème", "poésie"]],
      ["Guide nature / Scientifique de l'environnement", "Tu t'épanouis dehors, ce qui convient au guidage, à la protection de la nature et aux sciences de terrain.", "Travailler dehors : guider des groupes, collecter des données, protéger des lieux.", "Rejoins un groupe local de nature ou de nettoyage.", ["randonn", "plein air", "camping", "nature", "voyage", "escalade", "jardin"]],
      ["Professeur / Éducateur", "Tu aimes aider les autres à comprendre.", "Préparer des cours, expliquer des idées et accompagner des élèves.", "Donne des cours à une personne sur un sujet que tu maîtrises.", ["enseign", "enfant", "expliqu", "aider", "apprend", "école"]],
    ],
  },
  de: {
    week: "Woche",
    path: "Starte mit kostenlosen Onlinekursen und kleinen eigenen Projekten und schau dir dann ein Zertifikat, eine Ausbildung oder ein Studium im Bereich an.",
    plan: [
      "Schau zwei „Ein Tag im Leben“-Videos von Leuten in diesem Beruf und notiere, was dich begeistert.",
      "Schreib einer Person in diesem Beruf und stell ihr zwei Fragen.",
      "Leg deinen nächsten Lernschritt fest und plane feste Zeit dafür ein.",
    ],
    rows: [
      ["Game Designer", "Du magst Spiele und verstehst daher schon, was sie spannend macht.", "Level und Regeln entwerfen, mit Spielern testen und den Spielspaß feinjustieren.", "Bau ein kleines Spiel in einer kostenlosen Engine wie Godot und teile es online.", ["spiel", "zocken", "geschicht", "rätsel", "puzzle"]],
      ["UX- / Produktdesigner", "Du gestaltest gern Dinge, die gut aussehen und für Menschen gut funktionieren.", "Screens skizzieren, mit Nutzern sprechen und Apps und Websites verbessern.", "Gestalte eine App, die du täglich nutzt, neu und schreib auf, warum deine Version besser ist.", ["zeichn", "design", "kunst", "kreativ", "menschen", "handy", "app"]],
      ["Illustrator / Animator", "Zeichnen ist die Kernfähigkeit; Studios und Marken brauchen immer visuelle Erzähler.", "Figuren und Szenen für Bücher, Spiele, Werbung oder Filme gestalten.", "Veröffentliche einen Monat lang jede Woche ein fertiges Bild.", ["zeichn", "kunst", "mal", "comic", "anime", "skizz"]],
      ["Softwareentwickler", "Du baust gern Dinge und löst Probleme – genau das machen Entwickler den ganzen Tag.", "Code schreiben und testen, Fehler beheben und im kleinen Team arbeiten.", "Mach einen kostenlosen Anfängerkurs und setz ein kleines Projekt um.", ["code", "programm", "computer", "technik", "robot", "bauen"]],
      ["Musikproduzent / Sounddesigner", "Dein Gehör und deine Liebe zur Musik können zum Beruf in Produktion, Film oder Games werden.", "Aufnehmen, abmischen und Klänge für Songs, Filme oder Spiele gestalten.", "Bau einen 60-Sekunden-Track mit einem kostenlosen Tool wie BandLab.", ["musik", "sing", "gitarre", "klavier", "schlagzeug", "dj", "sound"]],
      ["Sporttrainer / Fitnesstrainer", "Du lebst Sport und kannst anderen helfen, besser zu werden.", "Training planen, Feedback geben und Sportler motivieren.", "Hilf freiwillig beim Training einer Jugendmannschaft oder eines Kurses.", ["sport", "fitness", "laufen", "fußball", "basketball", "schwimm", "gym"]],
      ["Koch / Food-Gründer", "Kochen verbindet Kreativität mit Können, und Lebensmittelmarken wachsen schnell.", "Gerichte zubereiten, Menüs entwickeln und eine Küche oder ein kleines Food-Business führen.", "Koch jede Woche ein Gericht für Freunde und sammle Feedback.", ["koch", "back", "essen", "rezept", "lebensmittel"]],
      ["Psychologe / Berater", "Menschen bei Problemen zu helfen zeigt Empathie, eine Schlüsseleigenschaft in der Beratung.", "Zuhören, gute Fragen stellen und Menschen durch Herausforderungen begleiten.", "Lies ein Einführungsbuch in die Psychologie und sprich mit jemandem aus dem Bereich.", ["helfen", "menschen", "freund", "zuhör", "reden", "rat", "problem"]],
      ["Tierarzt / Tierpflege", "Deine Fürsorge für Tiere passt zu Tiermedizin, Tierpflege und Verhaltensforschung.", "Tiere untersuchen und behandeln und ihre Halter beraten.", "Hilf diesen Monat ehrenamtlich in einem Tierheim in deiner Nähe.", ["tier", "hund", "katze", "pferd", "natur"]],
      ["Ingenieur / Maker", "Du baust und reparierst gern Dinge – die Grundlage der Technik.", "Echte Produkte entwerfen, Prototypen bauen und testen.", "Starte ein kleines Bauprojekt, etwa einen einfachen Roboter oder ein 3D-gedrucktes Teil.", ["bauen", "basteln", "lego", "reparier", "auto", "robot", "3d"]],
      ["Content Creator / Videoeditor", "Du erstellst und teilst gern Medien – eine Fähigkeit, für die Marken bezahlen.", "Videos für ein Publikum oder eine Marke planen, drehen und schneiden.", "Veröffentliche drei kurze Videos zu einem Thema und schau, worauf die Leute reagieren.", ["video", "film", "youtube", "schneid", "foto", "kamera", "social", "stream"]],
      ["Autor / Journalist", "Lesen und Schreiben sind die Grundlage jedes Schreibberufs.", "Recherchieren, schreiben und Artikel, Drehbücher oder Bücher redigieren.", "Schreib jede Woche einen kurzen Text und teile ihn öffentlich.", ["schreib", "lesen", "buch", "bücher", "geschicht", "blog", "gedicht"]],
      ["Outdoor-Guide / Umweltwissenschaftler", "Draußen blühst du auf – ideal für Führungen, Naturschutz und Feldforschung.", "Draußen arbeiten: Gruppen führen, Daten sammeln, Orte schützen.", "Schließ dich einer lokalen Natur- oder Aufräumgruppe an.", ["wander", "draußen", "zelten", "camping", "natur", "reis", "kletter", "garten"]],
      ["Lehrer / Pädagoge", "Du hilfst anderen gern, Dinge zu verstehen.", "Unterricht vorbereiten, Ideen erklären und Lernende unterstützen.", "Gib einer Person Nachhilfe in etwas, das du gut kannst.", ["lehr", "kind", "erklär", "helfen", "lern", "schule"]],
    ],
  },
  ru: {
    week: "Неделя",
    path: "Начни с бесплатных онлайн-курсов и небольших своих проектов, а потом присмотрись к сертификату, колледжу или вузу в этой сфере.",
    plan: [
      "Посмотри два видео «один день из жизни» от людей этой профессии и запиши, что тебя зацепило.",
      "Напиши человеку, который этим занимается, и задай ему два вопроса.",
      "Выбери следующий шаг в обучении и выдели на него время.",
    ],
    rows: [
      ["Геймдизайнер", "Ты любишь игры, значит, уже понимаешь, что делает их интересными.", "Придумывать уровни и правила, тестировать с игроками и настраивать интерес.", "Сделай маленькую игру в бесплатном движке вроде Godot и выложи её в сеть.", ["игр", "игра", "сюжет", "истори", "головоломк", "пазл"]],
      ["UX/продуктовый дизайнер", "Тебе нравится создавать вещи, которые красиво выглядят и удобны людям.", "Рисовать экраны, общаться с пользователями и улучшать приложения и сайты.", "Переделай приложение, которым пользуешься каждый день, и напиши, чем твоя версия лучше.", ["рис", "дизайн", "искусств", "творч", "люд", "телефон", "приложени"]],
      ["Иллюстратор / Аниматор", "Рисование — главный навык; студиям и брендам всегда нужны визуальные рассказчики.", "Создавать персонажей и сцены для книг, игр, рекламы или фильмов.", "Публикуй одну законченную работу каждую неделю в течение месяца.", ["рис", "искусств", "живопис", "комикс", "аниме", "скетч", "набросок"]],
      ["Разработчик ПО", "Тебе нравится создавать и решать задачи — этим разработчики и заняты весь день.", "Писать и тестировать код, исправлять ошибки и работать в небольшой команде.", "Пройди бесплатный курс для начинающих и сделай один небольшой проект.", ["код", "программ", "компьютер", "техник", "технолог", "робот", "собира"]],
      ["Музыкальный продюсер / Саунд-дизайнер", "Твой слух и любовь к музыке могут стать профессией в продюсировании, кино или играх.", "Записывать, сводить и создавать звук для песен, фильмов или игр.", "Сделай 60-секундный трек в бесплатном сервисе вроде BandLab.", ["музык", "пен", "пою", "гитар", "пианино", "фортепиано", "барабан", "диджей", "звук"]],
      ["Спортивный тренер / Фитнес-тренер", "Ты живёшь спортом и можешь помочь другим стать лучше.", "Планировать тренировки, давать обратную связь и мотивировать спортсменов.", "Предложи помощь в тренировках детской команды или секции.", ["спорт", "зал", "бег", "футбол", "фитнес", "баскетбол", "плаван"]],
      ["Повар / Предприниматель в сфере еды", "Готовка сочетает творчество и мастерство, а фуд-бренды быстро растут.", "Готовить блюда, составлять меню и управлять кухней или небольшим бизнесом.", "Каждую неделю готовь блюдо для друзей и собирай отзывы.", ["готов", "кулинар", "выпек", "печь", "еда", "рецепт"]],
      ["Психолог / Консультант", "Помогать людям с их проблемами — это эмпатия, главное качество консультанта.", "Слушать, задавать хорошие вопросы и помогать людям справляться с трудностями.", "Прочитай вводную книгу по психологии и поговори с человеком из этой сферы.", ["помога", "помощ", "люд", "друз", "друг", "слуша", "общен", "совет", "проблем"]],
      ["Ветеринар / Уход за животными", "Твоя забота о животных подходит для ветеринарии, работы в зоопарке и изучения поведения животных.", "Осматривать и лечить животных и консультировать владельцев.", "Стань волонтёром в местном приюте в этом месяце.", ["живот", "собак", "кошк", "кот", "питом", "лошад", "природ"]],
      ["Инженер / Мейкер", "Тебе нравится создавать и чинить вещи — это основа инженерии.", "Проектировать, делать прототипы и тестировать настоящие продукты.", "Начни небольшой проект, например простого робота или деталь, напечатанную на 3D-принтере.", ["созда", "собира", "лего", "чин", "ремонт", "машин", "робот", "3d", "мастер"]],
      ["Контент-мейкер / Видеомонтажёр", "Тебе нравится создавать и делиться контентом — за это платят бренды.", "Планировать, снимать и монтировать видео для аудитории или бренда.", "Опубликуй три коротких видео на одну тему и посмотри, на что откликаются люди.", ["видео", "фильм", "кино", "ютуб", "youtube", "монтаж", "фото", "камер", "соцсет", "стрим"]],
      ["Писатель / Журналист", "Чтение и письмо — основа любой профессии, связанной с текстом.", "Искать информацию, писать и редактировать статьи, сценарии или книги.", "Каждую неделю пиши короткий текст и публикуй его.", ["пиш", "писа", "чита", "чтени", "книг", "истори", "блог", "стих"]],
      ["Гид на природе / Эколог", "Ты расцветаешь на природе — это подходит для работы гидом, в охране природы и полевой науке.", "Работать на улице: водить группы, собирать данные, защищать природу.", "Вступи в местную природоохранную группу или группу по уборке.", ["поход", "природ", "кемпинг", "путешеств", "скалолаз", "сад", "огород"]],
      ["Учитель / Педагог", "Тебе нравится помогать другим понимать.", "Готовить уроки, объяснять идеи и поддерживать учеников.", "Позанимайся с одним человеком тем, в чём ты хорошо разбираешься.", ["учит", "обуч", "дет", "объясн", "помога", "школ"]],
    ],
  },
};
