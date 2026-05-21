export interface SubjectSeo {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  subtitle: string;
  intro: string;
}

export const SUBJECT_SEO: Record<string, SubjectSeo> = {
  biology: {
    metaTitle: 'Biology Flashcards | Free GCSE and A Level Cards | Flashcard Maker',
    metaDescription: 'Create free Biology flashcards from your own notes or browse our ready-made sets covering cell biology, genetics, photosynthesis and more. No login needed to get started.',
    h1: 'Biology Flashcards',
    subtitle: 'Upload your notes or study our free Biology card sets',
    intro: 'Whether you need GCSE Biology revision or A Level exam prep, Flashcard Maker turns your notes and textbooks into study cards in seconds. Browse our free Biology sets below, or upload your own material to generate a personalised revision deck.',
  },
  chemistry: {
    metaTitle: 'Chemistry Flashcards | Free GCSE and A Level Cards | Flashcard Maker',
    metaDescription: 'Generate Chemistry flashcards from your own notes or browse free sets on atomic structure, bonding, rates of reaction, organic chemistry and more. No sign-up needed.',
    h1: 'Chemistry Flashcards',
    subtitle: 'Upload your notes or study our free Chemistry card sets',
    intro: 'From atomic structure and chemical bonding to organic chemistry and electrolysis, our free Chemistry flashcard sets cover the core GCSE and A Level topics. Upload your own notes and Flashcard Maker builds a personalised revision deck in seconds.',
  },
  physics: {
    metaTitle: 'Physics Flashcards | Free GCSE and A Level Cards | Flashcard Maker',
    metaDescription: 'Create Physics flashcards from your notes or revise for free with our pre-made sets on forces, electricity, waves, radioactivity and more. Built for GCSE and A Level students.',
    h1: 'Physics Flashcards',
    subtitle: 'Revise Physics with free card sets or generate your own',
    intro: 'Our free Physics flashcard sets cover everything from Newton\'s laws and electricity to waves, magnetism and radioactivity. Upload your own Physics notes and Flashcard Maker builds a study deck tailored to exactly what you need to learn.',
  },
  maths: {
    metaTitle: 'Maths Flashcards | Free GCSE and A Level Cards | Flashcard Maker',
    metaDescription: 'Generate Maths flashcards from your revision notes or use our free sets covering algebra, geometry, statistics, trigonometry and calculus. Great for GCSE and A Level Maths.',
    h1: 'Maths Flashcards',
    subtitle: 'Practise Maths with free card sets or create your own',
    intro: 'Maths revision is all about practice, and flashcards are one of the most effective ways to drill key formulas, methods and rules. Browse our free sets on algebra, geometry, statistics, trigonometry and calculus, or upload your own notes to create a custom deck.',
  },
  psychology: {
    metaTitle: 'Psychology Flashcards | Free A Level Psychology Cards | Flashcard Maker',
    metaDescription: 'Revise A Level Psychology with free flashcard sets on memory, social influence, attachment, psychopathology and more. Or generate your own cards from your lecture notes.',
    h1: 'Psychology Flashcards',
    subtitle: 'Free A Level Psychology revision cards and a custom deck generator',
    intro: 'Our free A Level Psychology flashcard sets cover the major topics you need for your exams, from Milgram and Asch to attachment theory and the working memory model. Upload your own psychology notes to generate a fully personalised revision deck.',
  },
  medicine: {
    metaTitle: 'Medical Flashcards | Free Study Cards for Medicine Students | Flashcard Maker',
    metaDescription: 'Create Medical flashcards from your notes or browse free sets on the immune system, common diseases and the respiratory system. Built for medical and health science students.',
    h1: 'Medical Flashcards',
    subtitle: 'Free medical study cards and a flashcard generator for medicine students',
    intro: 'Studying medicine involves a large volume of content to retain. Our free medical flashcard sets cover the immune system, common diseases and the respiratory system, and Flashcard Maker lets you turn any lecture notes, textbook pages or case studies into revision cards instantly.',
  },
  geography: {
    metaTitle: 'Geography Flashcards | Free GCSE Geography Cards | Flashcard Maker',
    metaDescription: 'Revise GCSE Geography with free flashcard sets on climate change, tectonic hazards, rivers and coasts. Or upload your own notes and generate a custom Geography deck instantly.',
    h1: 'Geography Flashcards',
    subtitle: 'Free GCSE Geography card sets and a custom flashcard generator',
    intro: 'Our free Geography flashcard sets cover the core GCSE topics including climate change, tectonic hazards and river and coastal processes. Upload your own fieldwork notes, case studies or exam revision guides to create a bespoke set of study cards with Flashcard Maker.',
  },
  anatomy: {
    metaTitle: 'Anatomy Flashcards | Free Anatomy and Physiology Study Cards | Flashcard Maker',
    metaDescription: 'Create Anatomy flashcards from your notes or use our free sets on the cardiovascular, musculoskeletal and digestive systems. Great for nursing and medicine students.',
    h1: 'Anatomy and Physiology Flashcards',
    subtitle: 'Free anatomy revision cards and a flashcard generator for students',
    intro: 'Learning anatomy requires memorising a large number of structures, functions and relationships. Our free anatomy and physiology flashcard sets cover the cardiovascular, musculoskeletal and digestive systems. Upload any anatomy notes or textbook pages and Flashcard Maker generates a custom revision deck.',
  },
  nursing: {
    metaTitle: 'Nursing Flashcards | Free Study Cards for Student Nurses | Flashcard Maker',
    metaDescription: 'Generate Nursing flashcards from your own notes or browse free sets on pharmacology, patient assessment, mental health, infection control and more. Built for student nurses.',
    h1: 'Nursing Flashcards',
    subtitle: 'Free nursing revision cards and a flashcard tool for student nurses',
    intro: 'From pharmacology essentials and patient assessment to infection control and mental health nursing, our free card sets cover the core knowledge you need for placements and NMC preparation. Upload your lecture notes and Flashcard Maker generates a revision deck in seconds.',
  },
  business: {
    metaTitle: 'Business Flashcards | Free GCSE and A Level Business Cards | Flashcard Maker',
    metaDescription: 'Create Business Studies and Economics flashcards from your notes or use our free sets on marketing, supply and demand and macroeconomics. Covers GCSE and A Level content.',
    h1: 'Business Studies and Economics Flashcards',
    subtitle: 'Free business and economics revision cards and a custom flashcard generator',
    intro: 'Our free Business Studies and Economics flashcard sets cover marketing, supply and demand, and macroeconomic theory. Upload your own notes, case studies or textbook extracts and Flashcard Maker builds a tailored revision deck for GCSE and A Level students.',
  },
  history: {
    metaTitle: 'History Flashcards | Free GCSE and A Level History Cards | Flashcard Maker',
    metaDescription: 'Revise History with free flashcard sets on World War Two, the Cold War, the Holocaust, the French Revolution and more. Or generate your own cards from your history notes.',
    h1: 'History Flashcards',
    subtitle: 'Free history revision card sets and a custom flashcard generator',
    intro: 'Our free History flashcard sets span topics from the causes of World War Two and the Holocaust to the French Revolution and Ancient Rome. Upload your own history notes, source material or essay plans and generate a personalised revision deck with Flashcard Maker.',
  },
  science: {
    metaTitle: 'Science Flashcards | Free GCSE Science Cards | Flashcard Maker',
    metaDescription: 'Generate Science flashcards from your notes or use our free sets covering Biology, Chemistry and Physics. A free flashcard tool for GCSE Combined Science and triple science students.',
    h1: 'Science Flashcards',
    subtitle: 'Free GCSE science revision cards across Biology, Chemistry and Physics',
    intro: 'Whether you\'re studying Combined Science or taking Biology, Chemistry and Physics separately, Flashcard Maker helps you revise all three disciplines. Browse our free science card sets or upload your own notes to generate a custom revision deck instantly.',
  },
  gcse: {
    metaTitle: 'GCSE Flashcards | Free Revision Cards for GCSE Students | Flashcard Maker',
    metaDescription: 'Create GCSE flashcards from your revision notes or browse free sets across Biology, Chemistry, Physics, Maths, History, Geography, Psychology and more. No sign-up needed.',
    h1: 'GCSE Flashcards',
    subtitle: 'Free GCSE revision cards and a flashcard generator for every subject',
    intro: 'Flashcard Maker is built for GCSE revision. Browse our growing library of free GCSE flashcard sets across Biology, Chemistry, Physics, Maths, History, Geography, Psychology, English Literature and more, or upload your own notes and get a custom deck in seconds.',
  },
  'a-level': {
    metaTitle: 'A Level Flashcards | Free A Level Revision Cards | Flashcard Maker',
    metaDescription: 'Revise for A Level exams with free flashcard sets across Biology, Chemistry, Physics, Maths, Psychology, History, Economics and more. Or generate your own cards from your notes.',
    h1: 'A Level Flashcards',
    subtitle: 'Free A Level revision card sets and a custom flashcard generator',
    intro: 'A Level revision requires depth, detail and consistent practice. Flashcard Maker lets you create custom revision decks from your own notes, or browse our free sets across A Level Biology, Chemistry, Physics, Maths, Psychology, History, Economics, English Literature and more.',
  },
  aqa: {
    metaTitle: 'AQA Flashcards | Free Revision Cards for AQA Exams | Flashcard Maker',
    metaDescription: 'Create AQA flashcards from your notes or browse free sets tailored to AQA Biology, Chemistry, Physics, Maths, History and Psychology. No login needed to start revising.',
    h1: 'AQA Flashcards',
    subtitle: 'Free revision cards for AQA students and a custom deck generator',
    intro: 'Preparing for AQA exams? Our free flashcard sets are built around the most tested topics in AQA Biology, Chemistry, Physics, Maths, History and Psychology. Upload your AQA revision notes and Flashcard Maker generates a personalised study deck tailored to your syllabus.',
  },
};
