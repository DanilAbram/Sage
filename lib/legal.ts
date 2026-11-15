// Legal page text in every site language.
// NOTE: starter text, not legal advice. Have it reviewed (in each language) before launching to the public.
import type { Lang } from "./i18n";

export type LegalDocId = "privacy" | "terms" | "contact";
type Doc = { title: string; sections: [string, string][] };
type Pack = {
  back: string;
  updated: string;
  /** shown on translated pages only */
  note?: string;
  contactSoon: string;
  docs: Record<LegalDocId, Doc>;
};

export const LEGAL: Record<Lang, Pack> = {
  en: {
    back: "Back to Sage",
    updated: "Last updated: November 2026",
    contactSoon: "Contact email coming soon.",
    docs: {
      privacy: {
        title: "Privacy",
        sections: [
          ["What we collect", "Your email address and a hashed password when you create an account. The hobbies and interests you type in. If you subscribe, your saved search results. Payment details are entered on Stripe's page; we never see or store your card number."],
          ["How we use it", "To create your career suggestions, keep you signed in, save your results, and manage your subscription. We do not sell your data."],
          ["Who else processes it", "Google (Gemini API) receives the text you enter to generate suggestions. Please do not enter sensitive personal details. On Google's free API tier, Google may use submitted content to improve its services. Stripe processes payments and subscriptions."],
          ["Cookies and browser storage", "One essential cookie keeps you signed in (for up to 30 days). We do not use advertising or tracking cookies. Your settings (language, theme, text size and reduced motion) are saved in your browser on your device, not on our servers. While you go to Stripe's checkout, your current search is kept in that browser tab so it is still there when you return."],
          ["How long we keep it", "Account data is kept while your account exists. We keep your 50 most recent saved searches."],
          ["Your choices", "Cancel your subscription any time from Manage subscription in your account. To delete your account and data, contact us using the details on the Contact page. Settings → Reset to default removes the settings saved in your browser."],
        ],
      },
      terms: {
        title: "Terms of use",
        sections: [
          ["The service", "Sage uses AI to suggest careers based on the interests you share. Suggestions are guidance for exploring, not professional advice, and not a promise about jobs, salaries or outcomes."],
          ["Subscriptions and free trial", "Paid plans renew automatically each month or year. First-time subscribers get a 7-day free trial. A card is required to start it; if you do not cancel before it ends, you will be charged the plan price. You can cancel any time from your account and keep access until the end of the paid period."],
          ["Your account", "Keep your password safe. You are responsible for activity on your account. Please do not misuse the service or attempt to overload it."],
          ["Changes", "We may update these terms and the service from time to time. Continued use means you accept the updates."],
        ],
      },
      contact: {
        title: "Contact",
        sections: [["", "Questions, feedback, or a request to delete your account? We read every message."]],
      },
    },
  },
  es: {
    back: "Volver a Sage",
    updated: "Última actualización: noviembre de 2026",
    note: "Esta traducción se ofrece por comodidad. Si difiere de la versión en inglés, prevalece la versión en inglés.",
    contactSoon: "El correo de contacto estará disponible pronto.",
    docs: {
      privacy: {
        title: "Privacidad",
        sections: [
          ["Qué recogemos", "Tu correo electrónico y una contraseña cifrada (hash) cuando creas una cuenta. Los hobbies e intereses que escribes. Si te suscribes, tus resultados guardados. Los datos de pago se introducen en la página de Stripe; nunca vemos ni guardamos el número de tu tarjeta."],
          ["Cómo lo usamos", "Para crear tus sugerencias de carreras, mantener tu sesión iniciada, guardar tus resultados y gestionar tu suscripción. No vendemos tus datos."],
          ["Quién más lo procesa", "Google (API de Gemini) recibe el texto que escribes para generar sugerencias. No introduzcas datos personales sensibles. En el nivel gratuito de la API, Google puede usar el contenido enviado para mejorar sus servicios. Stripe procesa los pagos y las suscripciones."],
          ["Cookies y almacenamiento del navegador", "Una cookie esencial mantiene tu sesión iniciada (hasta 30 días). No usamos cookies de publicidad ni de seguimiento. Tus ajustes (idioma, tema, tamaño del texto y movimiento reducido) se guardan en tu navegador, en tu dispositivo, no en nuestros servidores. Mientras vas al pago de Stripe, tu búsqueda actual se guarda en esa pestaña para que siga ahí cuando vuelvas."],
          ["Cuánto tiempo lo guardamos", "Los datos de la cuenta se guardan mientras exista tu cuenta. Guardamos tus 50 búsquedas más recientes."],
          ["Tus opciones", "Cancela tu suscripción cuando quieras desde Gestionar suscripción en tu cuenta. Para borrar tu cuenta y tus datos, escríbenos con los datos de la página de Contacto. Ajustes → Restablecer elimina los ajustes guardados en tu navegador."],
        ],
      },
      terms: {
        title: "Términos de uso",
        sections: [
          ["El servicio", "Sage usa IA para sugerir carreras según los intereses que compartes. Las sugerencias son una guía para explorar, no asesoramiento profesional, ni una promesa sobre empleos, salarios o resultados."],
          ["Suscripciones y prueba gratis", "Los planes de pago se renuevan automáticamente cada mes o cada año. Quien se suscribe por primera vez tiene una prueba gratis de 7 días. Se necesita una tarjeta para empezarla; si no cancelas antes de que termine, se cobrará el precio del plan. Puedes cancelar cuando quieras desde tu cuenta y mantener el acceso hasta el final del periodo pagado."],
          ["Tu cuenta", "Mantén tu contraseña a salvo. Eres responsable de la actividad de tu cuenta. No hagas un mal uso del servicio ni intentes sobrecargarlo."],
          ["Cambios", "Podemos actualizar estos términos y el servicio de vez en cuando. Si sigues usándolo, aceptas los cambios."],
        ],
      },
      contact: {
        title: "Contacto",
        sections: [["", "¿Preguntas, comentarios o quieres borrar tu cuenta? Leemos todos los mensajes."]],
      },
    },
  },
  fr: {
    back: "Retour à Sage",
    updated: "Dernière mise à jour : novembre 2026",
    note: "Cette traduction est fournie pour plus de commodité. En cas de différence, la version anglaise prévaut.",
    contactSoon: "L'adresse e-mail de contact arrive bientôt.",
    docs: {
      privacy: {
        title: "Confidentialité",
        sections: [
          ["Ce que nous collectons", "Ton adresse e-mail et un mot de passe haché quand tu crées un compte. Les loisirs et centres d'intérêt que tu saisis. Si tu t'abonnes, tes résultats enregistrés. Les données de paiement sont saisies sur la page de Stripe ; nous ne voyons ni ne stockons jamais ton numéro de carte."],
          ["Comment nous les utilisons", "Pour créer tes suggestions de métiers, te garder connecté, enregistrer tes résultats et gérer ton abonnement. Nous ne vendons pas tes données."],
          ["Qui d'autre les traite", "Google (API Gemini) reçoit le texte que tu saisis pour générer les suggestions. N'indique pas d'informations personnelles sensibles. Avec l'offre gratuite de l'API, Google peut utiliser le contenu envoyé pour améliorer ses services. Stripe traite les paiements et les abonnements."],
          ["Cookies et stockage du navigateur", "Un cookie essentiel te garde connecté (jusqu'à 30 jours). Nous n'utilisons pas de cookies publicitaires ni de suivi. Tes réglages (langue, thème, taille du texte et réduction des animations) sont enregistrés dans ton navigateur, sur ton appareil, pas sur nos serveurs. Pendant que tu passes au paiement Stripe, ta recherche en cours est gardée dans cet onglet pour la retrouver à ton retour."],
          ["Durée de conservation", "Les données du compte sont conservées tant que ton compte existe. Nous gardons tes 50 recherches les plus récentes."],
          ["Tes choix", "Annule ton abonnement à tout moment via Gérer l'abonnement dans ton compte. Pour supprimer ton compte et tes données, contacte-nous via la page Contact. Réglages → Réinitialiser supprime les réglages enregistrés dans ton navigateur."],
        ],
      },
      terms: {
        title: "Conditions d'utilisation",
        sections: [
          ["Le service", "Sage utilise l'IA pour suggérer des métiers à partir des centres d'intérêt que tu partages. Les suggestions sont des pistes à explorer, pas un conseil professionnel, ni une promesse d'emploi, de salaire ou de résultat."],
          ["Abonnements et essai gratuit", "Les offres payantes se renouvellent automatiquement chaque mois ou chaque année. Les nouveaux abonnés bénéficient d'un essai gratuit de 7 jours. Une carte est nécessaire pour le commencer ; si tu n'annules pas avant la fin, le prix de l'offre sera débité. Tu peux annuler à tout moment depuis ton compte et garder l'accès jusqu'à la fin de la période payée."],
          ["Ton compte", "Garde ton mot de passe en sécurité. Tu es responsable de l'activité de ton compte. N'utilise pas le service de manière abusive et n'essaie pas de le surcharger."],
          ["Modifications", "Nous pouvons mettre à jour ces conditions et le service de temps en temps. Continuer à l'utiliser signifie que tu acceptes ces mises à jour."],
        ],
      },
      contact: {
        title: "Contact",
        sections: [["", "Une question, un avis ou une demande de suppression de compte ? Nous lisons chaque message."]],
      },
    },
  },
  de: {
    back: "Zurück zu Sage",
    updated: "Zuletzt aktualisiert: November 2026",
    note: "Diese Übersetzung dient der Verständlichkeit. Bei Abweichungen gilt die englische Fassung.",
    contactSoon: "Die Kontakt-E-Mail folgt in Kürze.",
    docs: {
      privacy: {
        title: "Datenschutz",
        sections: [
          ["Was wir erheben", "Deine E-Mail-Adresse und ein gehashtes Passwort, wenn du ein Konto erstellst. Die Hobbys und Interessen, die du eingibst. Wenn du abonnierst, deine gespeicherten Suchergebnisse. Zahlungsdaten gibst du auf der Seite von Stripe ein; wir sehen oder speichern deine Kartennummer nie."],
          ["Wofür wir sie nutzen", "Um deine Berufsvorschläge zu erstellen, dich angemeldet zu halten, deine Ergebnisse zu speichern und dein Abo zu verwalten. Wir verkaufen deine Daten nicht."],
          ["Wer sie noch verarbeitet", "Google (Gemini-API) erhält den Text, den du eingibst, um Vorschläge zu erstellen. Bitte gib keine sensiblen persönlichen Daten ein. Im kostenlosen API-Tarif kann Google übermittelte Inhalte zur Verbesserung seiner Dienste nutzen. Stripe wickelt Zahlungen und Abos ab."],
          ["Cookies und Browserspeicher", "Ein notwendiges Cookie hält dich angemeldet (bis zu 30 Tage). Wir nutzen keine Werbe- oder Tracking-Cookies. Deine Einstellungen (Sprache, Design, Textgröße und reduzierte Bewegung) werden in deinem Browser auf deinem Gerät gespeichert, nicht auf unseren Servern. Während du zum Stripe-Checkout gehst, bleibt deine aktuelle Suche in diesem Tab erhalten, damit sie bei deiner Rückkehr noch da ist."],
          ["Wie lange wir sie speichern", "Kontodaten bleiben gespeichert, solange dein Konto besteht. Wir behalten deine 50 neuesten Suchen."],
          ["Deine Möglichkeiten", "Kündige dein Abo jederzeit über Abo verwalten in deinem Konto. Um dein Konto und deine Daten zu löschen, kontaktiere uns über die Kontaktseite. Einstellungen → Zurücksetzen entfernt die in deinem Browser gespeicherten Einstellungen."],
        ],
      },
      terms: {
        title: "Nutzungsbedingungen",
        sections: [
          ["Der Dienst", "Sage nutzt KI, um anhand deiner Interessen Berufe vorzuschlagen. Die Vorschläge sind eine Orientierung zum Erkunden, keine professionelle Beratung und kein Versprechen zu Jobs, Gehältern oder Ergebnissen."],
          ["Abos und kostenlose Testphase", "Bezahlte Tarife verlängern sich automatisch jeden Monat oder jedes Jahr. Neue Abonnenten erhalten eine 7-tägige kostenlose Testphase. Zum Start ist eine Karte nötig; kündigst du nicht vor dem Ende, wird der Tarifpreis berechnet. Du kannst jederzeit in deinem Konto kündigen und behältst den Zugang bis zum Ende des bezahlten Zeitraums."],
          ["Dein Konto", "Halte dein Passwort geheim. Du bist für die Aktivitäten in deinem Konto verantwortlich. Bitte missbrauche den Dienst nicht und versuche nicht, ihn zu überlasten."],
          ["Änderungen", "Wir können diese Bedingungen und den Dienst von Zeit zu Zeit aktualisieren. Wenn du ihn weiter nutzt, akzeptierst du die Änderungen."],
        ],
      },
      contact: {
        title: "Kontakt",
        sections: [["", "Fragen, Feedback oder ein Wunsch, dein Konto zu löschen? Wir lesen jede Nachricht."]],
      },
    },
  },
  ru: {
    back: "Назад в Sage",
    updated: "Последнее обновление: ноябрь 2026",
    note: "Этот перевод приведён для удобства. Если он расходится с английской версией, действует английская версия.",
    contactSoon: "Адрес для связи скоро появится.",
    docs: {
      privacy: {
        title: "Конфиденциальность",
        sections: [
          ["Что мы собираем", "Твой адрес электронной почты и хеш пароля, когда ты создаёшь аккаунт. Хобби и интересы, которые ты вводишь. Если ты оформил подписку — сохранённые результаты поиска. Платёжные данные вводятся на странице Stripe; мы никогда не видим и не храним номер твоей карты."],
          ["Как мы это используем", "Чтобы подбирать тебе профессии, сохранять вход в аккаунт, хранить результаты и управлять подпиской. Мы не продаём твои данные."],
          ["Кто ещё обрабатывает данные", "Google (Gemini API) получает введённый тобой текст, чтобы подобрать профессии. Пожалуйста, не вводи чувствительные личные данные. В бесплатном тарифе API Google может использовать отправленные данные для улучшения своих сервисов. Stripe обрабатывает платежи и подписки."],
          ["Cookie и хранилище браузера", "Один необходимый cookie сохраняет вход в аккаунт (до 30 дней). Мы не используем рекламные и отслеживающие cookie. Твои настройки (язык, тема, размер текста и уменьшение анимации) сохраняются в браузере на твоём устройстве, а не на наших серверах. Пока ты переходишь к оплате в Stripe, текущий поиск хранится в этой вкладке, чтобы он остался на месте, когда ты вернёшься."],
          ["Как долго мы храним данные", "Данные аккаунта хранятся, пока существует аккаунт. Мы храним 50 твоих последних поисков."],
          ["Твой выбор", "Отменить подписку можно в любой момент в разделе «Управление подпиской» в аккаунте. Чтобы удалить аккаунт и данные, напиши нам по контактам со страницы «Контакты». Настройки → «Сбросить» удаляет настройки, сохранённые в браузере."],
        ],
      },
      terms: {
        title: "Условия использования",
        sections: [
          ["Сервис", "Sage с помощью ИИ подбирает профессии по интересам, которыми ты делишься. Подсказки — это ориентир для поиска, а не профессиональная консультация и не обещание работы, зарплаты или результата."],
          ["Подписка и бесплатный пробный период", "Платные тарифы продлеваются автоматически каждый месяц или год. Новые подписчики получают 7 дней бесплатно. Для старта нужна карта; если не отменить подписку до конца пробного периода, спишется стоимость тарифа. Отменить можно в любой момент в аккаунте, доступ сохранится до конца оплаченного периода."],
          ["Твой аккаунт", "Храни пароль в безопасности. Ты отвечаешь за действия в своём аккаунте. Пожалуйста, не злоупотребляй сервисом и не пытайся его перегрузить."],
          ["Изменения", "Мы можем время от времени обновлять эти условия и сервис. Продолжая пользоваться сервисом, ты принимаешь изменения."],
        ],
      },
      contact: {
        title: "Контакты",
        sections: [["", "Вопросы, отзывы или хочешь удалить аккаунт? Мы читаем каждое сообщение."]],
      },
    },
  },
};
