export interface LibraryCard {
  question: string;
  answer: string;
}

export interface LibraryDeck {
  slug: string;
  title: string;
  subject: string;
  topic: string;
  cards: LibraryCard[];
}

function deck(
  slug: string,
  title: string,
  subject: string,
  topic: string,
  cards: LibraryCard[]
): LibraryDeck {
  return { slug, title, subject, topic, cards };
}

export const LIBRARY_DECKS: LibraryDeck[] = [
  deck(
    'gcse-biology-cell-biology',
    'GCSE Biology: Cell Biology',
    'Biology',
    'Cell Biology',
    [
      { question: 'What is the function of the cell membrane?', answer: 'Controls what enters and exits the cell, maintaining homeostasis.' },
      { question: 'What is the difference between a prokaryotic and eukaryotic cell?', answer: 'Prokaryotic cells have no nucleus or membrane-bound organelles; eukaryotic cells do.' },
      { question: 'What does the mitochondria do?', answer: 'Carries out aerobic respiration, producing ATP (energy) for the cell.' },
      { question: 'What is the role of the ribosome?', answer: 'Synthesises (makes) proteins by translating mRNA.' },
      { question: 'What is the function of the cell wall in plant cells?', answer: 'Provides structural support and prevents the cell from bursting due to osmosis.' },
      { question: 'What is the function of the vacuole in plant cells?', answer: 'Stores cell sap and helps maintain the turgor pressure of the cell.' },
      { question: 'What is the role of the chloroplast?', answer: 'Carries out photosynthesis, converting light energy into glucose.' },
      { question: 'What are the three domains of life?', answer: 'Bacteria, Archaea, and Eukarya.' },
      { question: 'What is diffusion?', answer: 'The net movement of particles from a region of high concentration to low concentration down a concentration gradient.' },
      { question: 'What is osmosis?', answer: 'The movement of water molecules across a partially permeable membrane from a dilute to a more concentrated solution.' },
      { question: 'What is active transport?', answer: 'The movement of substances against a concentration gradient using energy (ATP) from respiration.' },
      { question: 'What is a stem cell?', answer: 'An undifferentiated cell that can divide and develop into specialised cell types.' },
      { question: 'What is the function of the nucleus?', answer: 'Contains the cell\'s DNA and controls the cell\'s activities and gene expression.' },
      { question: 'What is the endoplasmic reticulum (ER)?', answer: 'A network of membranes involved in protein and lipid synthesis and transport within the cell.' },
      { question: 'What is the Golgi apparatus?', answer: 'Processes, packages, and ships proteins and lipids to their destinations inside or outside the cell.' },
      { question: 'Name three differences between animal and plant cells.', answer: 'Plant cells have a cell wall, chloroplasts, and a large permanent vacuole; animal cells do not.' },
      { question: 'What is the purpose of mitosis?', answer: 'To produce two genetically identical daughter cells for growth, repair, and asexual reproduction.' },
      { question: 'What is a chromosome?', answer: 'A long strand of DNA carrying many genes, found in the nucleus of eukaryotic cells.' },
      { question: 'What are specialised cells?', answer: 'Cells that have differentiated to perform a specific function, e.g. red blood cells, nerve cells, muscle cells.' },
      { question: 'What is the function of the lysosome?', answer: 'Breaks down waste materials and cellular debris using digestive enzymes.' },
    ]
  ),

  deck(
    'gcse-biology-photosynthesis',
    'GCSE Biology: Photosynthesis',
    'Biology',
    'Photosynthesis',
    [
      { question: 'Write the word equation for photosynthesis.', answer: 'Carbon dioxide + water → glucose + oxygen (using light energy).' },
      { question: 'Write the balanced symbol equation for photosynthesis.', answer: '6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂' },
      { question: 'Where in the cell does photosynthesis occur?', answer: 'In the chloroplasts, specifically in the thylakoid membranes and stroma.' },
      { question: 'What pigment absorbs light for photosynthesis?', answer: 'Chlorophyll (found in chloroplasts).' },
      { question: 'What are the two stages of photosynthesis?', answer: 'The light-dependent reactions (in thylakoid membranes) and the light-independent reactions / Calvin cycle (in the stroma).' },
      { question: 'What three factors limit the rate of photosynthesis?', answer: 'Light intensity, carbon dioxide concentration, and temperature.' },
      { question: 'How does increasing light intensity affect the rate of photosynthesis?', answer: 'It increases the rate up to a limiting factor (e.g. CO₂ or temperature).' },
      { question: 'How does temperature affect photosynthesis?', answer: 'Higher temperatures increase the rate up to an optimum; beyond that, enzymes denature and the rate falls.' },
      { question: 'What is the compensation point?', answer: 'The light intensity at which the rate of photosynthesis equals the rate of respiration — no net gas exchange occurs.' },
      { question: 'What is glucose used for in plants?', answer: 'Respiration, cellulose synthesis (cell walls), stored as starch, and converted to amino acids and lipids.' },
      { question: 'Why do plants need nitrate ions?', answer: 'To make amino acids and proteins (combined with glucose-derived carbon skeletons).' },
      { question: 'What is the role of water in the light-dependent reactions?', answer: 'Water is split (photolysis) to release hydrogen ions and electrons, producing oxygen as a by-product.' },
      { question: 'What is produced during the light-dependent reactions?', answer: 'ATP, NADPH, and oxygen (from photolysis of water).' },
      { question: 'What does ATP stand for?', answer: 'Adenosine triphosphate — the molecule that transfers energy within cells.' },
      { question: 'What is the Calvin cycle?', answer: 'The light-independent stage of photosynthesis where CO₂ is fixed into glucose using ATP and NADPH.' },
      { question: 'How can you measure the rate of photosynthesis in aquatic plants?', answer: 'Count the oxygen bubbles produced per minute (e.g. using pondweed/Elodea).' },
      { question: 'What colour light is absorbed least by chlorophyll?', answer: 'Green light — it is mostly reflected, which is why plants appear green.' },
      { question: 'How does a variegated leaf demonstrate that chlorophyll is needed for photosynthesis?', answer: 'Only the green (chlorophyll-containing) parts test positive for starch; the white parts do not.' },
      { question: 'What is the role of carbon dioxide in the Calvin cycle?', answer: 'CO₂ is fixed by RuBisCO onto RuBP to form GP, which is reduced to produce glucose.' },
      { question: 'How does starch differ from glucose in terms of storage?', answer: 'Starch is insoluble and compact, making it better for long-term storage; glucose is soluble and reactive.' },
    ]
  ),

  deck(
    'a-level-biology-dna-protein-synthesis',
    'A-Level Biology: DNA & Protein Synthesis',
    'Biology',
    'DNA & Protein Synthesis',
    [
      { question: 'What is the structure of DNA?', answer: 'A double helix made of two antiparallel polynucleotide strands joined by complementary base pairs (A–T, G–C) via hydrogen bonds.' },
      { question: 'What are the four bases in DNA?', answer: 'Adenine (A), Thymine (T), Guanine (G), and Cytosine (C).' },
      { question: 'What is the base-pairing rule in DNA?', answer: 'A pairs with T (2 hydrogen bonds); G pairs with C (3 hydrogen bonds).' },
      { question: 'What is transcription?', answer: 'The process by which a section of DNA is used as a template to synthesise a complementary mRNA strand, carried out in the nucleus.' },
      { question: 'What is translation?', answer: 'The process by which ribosomes decode mRNA codons to assemble a polypeptide chain from amino acids.' },
      { question: 'What is a codon?', answer: 'A sequence of three bases on mRNA that codes for a specific amino acid (or start/stop signal).' },
      { question: 'What is the role of tRNA in translation?', answer: 'tRNA carries specific amino acids to the ribosome, matching its anticodon to the mRNA codon.' },
      { question: 'What enzyme synthesises mRNA during transcription?', answer: 'RNA polymerase.' },
      { question: 'What is a gene?', answer: 'A sequence of DNA bases on a chromosome that codes for a specific polypeptide or functional RNA molecule.' },
      { question: 'What is semi-conservative replication?', answer: 'Each new DNA double helix contains one original (template) strand and one newly synthesised strand.' },
      { question: 'What enzyme unwinds the DNA double helix during replication?', answer: 'Helicase (breaks hydrogen bonds between base pairs).' },
      { question: 'What enzyme joins new nucleotides during DNA replication?', answer: 'DNA polymerase (synthesises the new strand in the 5\'→3\' direction).' },
      { question: 'What is a mutation?', answer: 'A change in the base sequence of DNA — can be a substitution, insertion, or deletion.' },
      { question: 'What is a frameshift mutation?', answer: 'An insertion or deletion of bases that shifts the reading frame, altering all downstream codons.' },
      { question: 'What is the difference between introns and exons?', answer: 'Exons are coding sequences expressed in the final protein; introns are non-coding sequences spliced out from pre-mRNA.' },
      { question: 'What is RNA splicing?', answer: 'The removal of introns and joining of exons in pre-mRNA to form mature mRNA before translation.' },
      { question: 'What is the genetic code described as being universal, degenerate, and non-overlapping?', answer: 'Universal: same codons in all organisms. Degenerate: multiple codons for one amino acid. Non-overlapping: each base belongs to one codon only.' },
      { question: 'What is the role of the start codon (AUG)?', answer: 'Signals the ribosome where to begin translation; also codes for the amino acid methionine.' },
      { question: 'What happens at a stop codon?', answer: 'Translation terminates — no amino acid is added and the polypeptide is released.' },
      { question: 'What is the central dogma of molecular biology?', answer: 'DNA → (transcription) → RNA → (translation) → Protein.' },
    ]
  ),

  deck(
    'gcse-chemistry-atomic-structure',
    'GCSE Chemistry: Atomic Structure',
    'Chemistry',
    'Atomic Structure',
    [
      { question: 'What are the three subatomic particles and their charges?', answer: 'Proton (+1), neutron (0), electron (−1).' },
      { question: 'Where are protons and neutrons found in an atom?', answer: 'In the nucleus at the centre of the atom.' },
      { question: 'What is the atomic number?', answer: 'The number of protons in the nucleus of an atom (defines the element).' },
      { question: 'What is the mass number?', answer: 'The total number of protons and neutrons in the nucleus.' },
      { question: 'What are isotopes?', answer: 'Atoms of the same element with the same number of protons but different numbers of neutrons.' },
      { question: 'How many electrons can the first, second, and third electron shells hold?', answer: 'First shell: 2; second shell: 8; third shell: 8 (at GCSE level).' },
      { question: 'What is the electronic configuration of sodium (Na, atomic number 11)?', answer: '2, 8, 1.' },
      { question: 'How does the number of electrons in the outer shell relate to group number?', answer: 'The number of outer electrons equals the group number (for groups 1–7).' },
      { question: 'What is relative atomic mass (Ar)?', answer: 'The weighted mean mass of an atom relative to 1/12 the mass of a carbon-12 atom.' },
      { question: 'How do you calculate the relative atomic mass from isotope data?', answer: 'Ar = Σ(isotope mass × % abundance) / 100.' },
      { question: 'What is the Bohr model of the atom?', answer: 'A model in which electrons orbit the nucleus in fixed energy levels (shells).' },
      { question: 'How does the modern model of the atom differ from Dalton\'s model?', answer: 'Dalton\'s model had atoms as solid, indivisible spheres; the modern model has a nucleus with protons/neutrons and electrons in shells.' },
      { question: 'What experiment led to the discovery of the nucleus?', answer: 'Rutherford\'s gold foil experiment — alpha particles were deflected, showing a dense, positive nucleus.' },
      { question: 'What did J.J. Thomson discover?', answer: 'The electron, using cathode ray tubes, leading to the "plum pudding" model.' },
      { question: 'What is an ion?', answer: 'An atom or group of atoms that has gained or lost electrons, giving it a positive or negative charge.' },
      { question: 'Why do noble gases not normally form ions or compounds?', answer: 'They have a full outer electron shell and are therefore very stable.' },
      { question: 'What is the mass of a proton in atomic mass units?', answer: 'Approximately 1 atomic mass unit (amu).' },
      { question: 'How do you find the number of neutrons in an atom?', answer: 'Number of neutrons = mass number − atomic number.' },
      { question: 'What is radioactive decay?', answer: 'The spontaneous emission of radiation (alpha, beta, or gamma) from an unstable nucleus.' },
      { question: 'What is the difference between alpha, beta, and gamma radiation?', answer: 'Alpha (α): helium nucleus, low penetration; Beta (β): fast electron, medium penetration; Gamma (γ): electromagnetic wave, high penetration.' },
    ]
  ),

  deck(
    'gcse-chemistry-chemical-bonding',
    'GCSE Chemistry: Chemical Bonding',
    'Chemistry',
    'Chemical Bonding',
    [
      { question: 'What is an ionic bond?', answer: 'Electrostatic attraction between oppositely charged ions formed by transfer of electrons.' },
      { question: 'What is a covalent bond?', answer: 'A shared pair of electrons between two non-metal atoms.' },
      { question: 'What is metallic bonding?', answer: 'A lattice of positive metal ions surrounded by a sea of delocalised electrons.' },
      { question: 'Why do ionic compounds have high melting and boiling points?', answer: 'Strong electrostatic forces between ions in the giant ionic lattice require large amounts of energy to break.' },
      { question: 'Why can ionic compounds conduct electricity when dissolved in water?', answer: 'The ions are free to move and carry charge through the solution.' },
      { question: 'What is a giant covalent structure? Give an example.', answer: 'A lattice of atoms bonded by many covalent bonds — e.g. diamond, graphite, silicon dioxide.' },
      { question: 'Why does diamond have a very high melting point?', answer: 'Every carbon atom is bonded to four others by strong covalent bonds in a giant lattice, requiring enormous energy to break.' },
      { question: 'Why does graphite conduct electricity?', answer: 'Each carbon atom forms only three covalent bonds, leaving one delocalised electron per atom free to carry charge.' },
      { question: 'Why do simple covalent molecules have low melting points?', answer: 'Only weak intermolecular forces (van der Waals) exist between molecules, which are easily overcome.' },
      { question: 'What determines the shape of a molecule according to VSEPR theory?', answer: 'Electron pairs around a central atom repel each other to be as far apart as possible.' },
      { question: 'What is the shape and bond angle of a water molecule?', answer: 'Bent/V-shaped, bond angle approximately 104.5°.' },
      { question: 'What is the shape and bond angle of methane (CH₄)?', answer: 'Tetrahedral, bond angle 109.5°.' },
      { question: 'What is the shape and bond angle of ammonia (NH₃)?', answer: 'Trigonal pyramidal, bond angle approximately 107°.' },
      { question: 'What is electronegativity?', answer: 'The ability of an atom to attract a bonding pair of electrons towards itself.' },
      { question: 'What makes a bond polar?', answer: 'A difference in electronegativity between bonded atoms causes unequal sharing of electrons, creating partial charges (δ+ and δ−).' },
      { question: 'What are intermolecular forces?', answer: 'Weak attractive forces between molecules, including van der Waals (London dispersion), dipole-dipole, and hydrogen bonding.' },
      { question: 'What conditions are needed for hydrogen bonding?', answer: 'A hydrogen atom bonded to a highly electronegative atom (N, O, or F) and a lone pair on another N, O, or F atom.' },
      { question: 'Why does ice float on water?', answer: 'Hydrogen bonds in ice form a regular open lattice, making ice less dense than liquid water.' },
      { question: 'What is a dative/coordinate bond?', answer: 'A covalent bond where both electrons in the shared pair come from the same atom.' },
      { question: 'What are allotropes?', answer: 'Different structural forms of the same element, e.g. diamond and graphite are allotropes of carbon.' },
    ]
  ),

  deck(
    'gcse-physics-forces-motion',
    'GCSE Physics: Forces & Motion',
    'Physics',
    'Forces & Motion',
    [
      { question: 'What is Newton\'s First Law of Motion?', answer: 'An object remains at rest or in uniform motion unless acted upon by a resultant force.' },
      { question: 'What is Newton\'s Second Law of Motion?', answer: 'Force = mass × acceleration (F = ma); the resultant force is proportional to the rate of change of momentum.' },
      { question: 'What is Newton\'s Third Law of Motion?', answer: 'For every action there is an equal and opposite reaction — forces always act in pairs.' },
      { question: 'What is the difference between speed and velocity?', answer: 'Speed is a scalar (magnitude only); velocity is a vector (magnitude and direction).' },
      { question: 'What is acceleration?', answer: 'The rate of change of velocity: a = (v − u) / t.' },
      { question: 'What is the equation linking force, mass, and acceleration?', answer: 'F = ma (force in newtons, mass in kg, acceleration in m/s²).' },
      { question: 'What is momentum?', answer: 'Momentum = mass × velocity (p = mv), measured in kg·m/s.' },
      { question: 'State the law of conservation of momentum.', answer: 'In a closed system with no external forces, the total momentum before a collision equals the total momentum after.' },
      { question: 'What is the difference between weight and mass?', answer: 'Mass is the amount of matter (kg); weight is the gravitational force on that mass (W = mg), measured in newtons.' },
      { question: 'What is the value of g on Earth\'s surface?', answer: 'Approximately 9.8 m/s² (often rounded to 10 m/s² at GCSE).' },
      { question: 'What is terminal velocity?', answer: 'The constant speed reached when the driving force (e.g. gravity) equals the resistive forces (e.g. air resistance).' },
      { question: 'What does the gradient of a displacement–time graph represent?', answer: 'Velocity.' },
      { question: 'What does the gradient of a velocity–time graph represent?', answer: 'Acceleration.' },
      { question: 'What does the area under a velocity–time graph represent?', answer: 'Displacement (distance travelled).' },
      { question: 'What is friction?', answer: 'A contact force that opposes relative motion between surfaces in contact.' },
      { question: 'What is the stopping distance of a vehicle?', answer: 'Thinking distance + braking distance.' },
      { question: 'What factors affect braking distance?', answer: 'Speed, mass of vehicle, road conditions (friction), and condition of brakes/tyres.' },
      { question: 'What is work done?', answer: 'Work done = force × distance (in the direction of the force): W = Fd, measured in joules.' },
      { question: 'What is Hooke\'s Law?', answer: 'The extension of a spring is directly proportional to the applied force, provided the elastic limit is not exceeded: F = ke.' },
      { question: 'What is the difference between elastic and inelastic deformation?', answer: 'Elastic: object returns to original shape when force is removed. Inelastic: permanent deformation occurs.' },
    ]
  ),

  deck(
    'gcse-maths-algebra',
    'GCSE Maths: Algebra Fundamentals',
    'Maths',
    'Algebra',
    [
      { question: 'What does it mean to "expand" brackets?', answer: 'Multiply each term inside the brackets by the term outside: e.g. 3(x + 2) = 3x + 6.' },
      { question: 'Expand (x + 3)(x + 5).', answer: 'x² + 8x + 15 (using FOIL or the grid method).' },
      { question: 'What does it mean to "factorise" an expression?', answer: 'Write it as a product of its factors, e.g. x² + 5x + 6 = (x + 2)(x + 3).' },
      { question: 'Factorise x² − 9.', answer: '(x + 3)(x − 3) — this is the difference of two squares.' },
      { question: 'What is the quadratic formula?', answer: '$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$ for ax² + bx + c = 0.' },
      { question: 'What does the discriminant (b² − 4ac) tell you?', answer: 'If > 0: two real roots. If = 0: one repeated root. If < 0: no real roots.' },
      { question: 'How do you solve simultaneous equations by elimination?', answer: 'Make the coefficients of one variable equal, then add or subtract equations to eliminate it.' },
      { question: 'What is the gradient-intercept form of a straight line?', answer: 'y = mx + c, where m is the gradient and c is the y-intercept.' },
      { question: 'How do you find the gradient between two points?', answer: '$m = \\frac{y_2 - y_1}{x_2 - x_1}$' },
      { question: 'What are the rules for indices: aᵐ × aⁿ and aᵐ ÷ aⁿ?', answer: 'aᵐ × aⁿ = aᵐ⁺ⁿ; aᵐ ÷ aⁿ = aᵐ⁻ⁿ.' },
      { question: 'What is a⁰ equal to for any non-zero a?', answer: '1.' },
      { question: 'What is a negative index? e.g. a⁻²', answer: 'a⁻² = 1/a². A negative exponent means the reciprocal.' },
      { question: 'What is a fractional index? e.g. a^(1/2)', answer: 'a^(1/2) = √a. a^(1/n) = the nth root of a.' },
      { question: 'How do you rearrange a formula to change the subject?', answer: 'Use inverse operations to isolate the desired variable — treat it like solving an equation.' },
      { question: 'What is an arithmetic sequence?', answer: 'A sequence with a constant difference between consecutive terms (e.g. 3, 7, 11, 15…).' },
      { question: 'What is the nth term formula for an arithmetic sequence?', answer: 'nth term = a + (n − 1)d, where a is the first term and d is the common difference.' },
      { question: 'What does it mean to "complete the square"?', answer: 'Rewrite ax² + bx + c in the form a(x + p)² + q — useful for solving quadratics and finding vertices.' },
      { question: 'What is a function and how is it written?', answer: 'A rule that maps each input to exactly one output, written as f(x) = … (e.g. f(x) = 2x + 1).' },
      { question: 'What is an inequality and how is it solved?', answer: 'A relationship using <, >, ≤, ≥. Solved like an equation, but the inequality flips when multiplying/dividing by a negative.' },
      { question: 'What is direct proportion and how is it written?', answer: 'y ∝ x means y = kx for some constant k. If y is directly proportional to x, doubling x doubles y.' },
    ]
  ),

  deck(
    'a-level-psychology-memory',
    'A-Level Psychology: Memory',
    'Psychology',
    'Memory',
    [
      { question: 'What are the three stages of memory in the multi-store model?', answer: 'Sensory register → Short-term memory (STM) → Long-term memory (LTM).' },
      { question: 'Who proposed the multi-store model of memory?', answer: 'Atkinson and Shiffrin (1968).' },
      { question: 'What is the capacity and duration of short-term memory?', answer: 'Capacity: 7 ± 2 chunks (Miller, 1956). Duration: approximately 18–30 seconds without rehearsal.' },
      { question: 'What is the capacity and duration of long-term memory?', answer: 'Capacity: potentially unlimited. Duration: potentially a lifetime.' },
      { question: 'What is maintenance rehearsal?', answer: 'Repeating information to keep it in STM and transfer it to LTM (e.g. repeating a phone number).' },
      { question: 'What are the three types of long-term memory in Tulving\'s model?', answer: 'Episodic (personal events), semantic (general knowledge), and procedural (how to do things).' },
      { question: 'What is the working memory model and who proposed it?', answer: 'Baddeley and Hitch (1974) — a multi-component model of STM with an active processing role.' },
      { question: 'What are the four components of the working memory model?', answer: 'Central executive, phonological loop, visuo-spatial sketchpad, and episodic buffer.' },
      { question: 'What does the phonological loop do?', answer: 'Stores and rehearses sound-based (verbal/auditory) information — divided into a phonological store and articulatory loop.' },
      { question: 'What does the visuo-spatial sketchpad do?', answer: 'Stores and manipulates visual and spatial information (mental images).' },
      { question: 'What is the central executive?', answer: 'The supervisory component that directs attention and coordinates the other components of working memory.' },
      { question: 'What is proactive interference?', answer: 'Old information interferes with the recall of new information.' },
      { question: 'What is retroactive interference?', answer: 'New information interferes with the recall of old information.' },
      { question: 'What are the two types of retrieval failure?', answer: 'Absence of cues (context-dependent forgetting) and state-dependent forgetting.' },
      { question: 'What is the eyewitness testimony (EWT) research by Loftus and Palmer?', answer: 'The verb used in a question (e.g. "smashed" vs "hit") significantly affected participants\' speed estimates and recall of details (e.g. broken glass).' },
      { question: 'What is misleading information in the context of EWT?', answer: 'Information given after an event (post-event information) that distorts the original memory, e.g. leading questions.' },
      { question: 'What is the cognitive interview?', answer: 'A police technique to improve EWT using mental reinstatement of context, report everything, change order, and change perspective.' },
      { question: 'What does the encoding specificity principle state?', answer: 'Memory is best when the context at retrieval matches the context at encoding.' },
      { question: 'What is the serial position effect?', answer: 'Items at the beginning (primacy) and end (recency) of a list are better recalled than items in the middle.' },
      { question: 'What is repression as an explanation for forgetting?', answer: 'Freud\'s concept that threatening or anxiety-provoking memories are pushed into the unconscious to protect the individual.' },
    ]
  ),

  deck(
    'gcse-geography-climate-change',
    'GCSE Geography: Climate Change',
    'Geography',
    'Climate Change',
    [
      { question: 'What is the greenhouse effect?', answer: 'Solar radiation heats Earth\'s surface; re-emitted infrared radiation is absorbed by greenhouse gases and re-radiated, warming the atmosphere.' },
      { question: 'Name three greenhouse gases.', answer: 'Carbon dioxide (CO₂), methane (CH₄), and water vapour (H₂O).' },
      { question: 'What is the difference between the natural and enhanced greenhouse effect?', answer: 'The natural greenhouse effect keeps Earth habitable; the enhanced effect is caused by human activity adding extra greenhouse gases, causing additional warming.' },
      { question: 'What evidence shows that global temperatures are rising?', answer: 'Temperature records, retreating glaciers, rising sea levels, earlier seasonal events (e.g. earlier blossom), and ice core data.' },
      { question: 'What do ice cores tell us about past climates?', answer: 'Trapped air bubbles preserve ancient atmospheric gas compositions, showing CO₂ and temperature levels over hundreds of thousands of years.' },
      { question: 'What is the difference between weather and climate?', answer: 'Weather is short-term atmospheric conditions at a specific place; climate is the average weather of an area over 30+ years.' },
      { question: 'What are natural causes of climate change?', answer: 'Milankovitch cycles (changes in Earth\'s orbit/tilt), volcanic eruptions, solar output variation.' },
      { question: 'What are the main human causes of climate change?', answer: 'Burning fossil fuels, deforestation, agriculture (methane from livestock and rice paddies), and industrial processes.' },
      { question: 'What is a positive feedback loop in climate science?', answer: 'A process where warming triggers further warming, e.g. melting Arctic ice reduces albedo → more solar absorption → more warming.' },
      { question: 'What is albedo?', answer: 'The proportion of solar radiation reflected by a surface — ice has high albedo; oceans and dark land have low albedo.' },
      { question: 'What are the effects of climate change on polar regions?', answer: 'Ice sheets and glaciers melt, sea ice retreats, sea levels rise, and habitats for species like polar bears are lost.' },
      { question: 'How does climate change affect sea levels?', answer: 'Thermal expansion of seawater and melting of land ice (glaciers and ice sheets) both cause sea levels to rise.' },
      { question: 'What are some impacts of climate change on people?', answer: 'Increased flooding, drought, food insecurity, extreme weather events, displacement of populations, and spread of disease.' },
      { question: 'What is the Paris Agreement?', answer: 'A 2015 international treaty aiming to limit global warming to 1.5–2°C above pre-industrial levels through national emissions reductions.' },
      { question: 'What is carbon capture and storage (CCS)?', answer: 'Technology that captures CO₂ emissions (e.g. from power plants) and stores them underground to prevent release into the atmosphere.' },
      { question: 'What are renewable energy sources?', answer: 'Energy sources that are naturally replenished — e.g. solar, wind, hydroelectric, geothermal, and tidal power.' },
      { question: 'What is afforestation and how does it help climate change?', answer: 'Planting new forests on previously unforested land — trees absorb CO₂ through photosynthesis, acting as carbon sinks.' },
      { question: 'What is a carbon footprint?', answer: 'The total amount of greenhouse gases, measured in CO₂ equivalent, emitted directly or indirectly by an individual, organisation, or product.' },
      { question: 'What is the difference between mitigation and adaptation?', answer: 'Mitigation reduces the causes of climate change (e.g. cutting emissions); adaptation adjusts to its effects (e.g. building flood defences).' },
      { question: 'Why are developing countries particularly vulnerable to climate change?', answer: 'They often lack resources for adaptation, rely on climate-sensitive agriculture, and may be in regions with greater exposure to extreme weather.' },
    ]
  ),

  deck(
    'gcse-history-ww2-causes',
    'GCSE History: Causes of World War II',
    'History',
    'Causes of World War II',
    [
      { question: 'What was the Treaty of Versailles (1919) and how did it affect Germany?', answer: 'The peace treaty ending WW1 — it imposed war guilt (Article 231), reparations (£6.6 billion), military restrictions, and territorial losses on Germany.' },
      { question: 'What is appeasement and who is most associated with it?', answer: 'The policy of making concessions to aggressive powers to avoid war — most associated with British PM Neville Chamberlain in the 1930s.' },
      { question: 'What happened at the Munich Agreement (1938)?', answer: 'Britain, France, Italy, and Germany agreed to allow Hitler to annex the Sudetenland in exchange for a promise of no further territorial demands.' },
      { question: 'What was the significance of the Nazi-Soviet Non-Aggression Pact (1939)?', answer: 'Germany and the USSR agreed not to attack each other, allowing Hitler to invade Poland without fear of a two-front war.' },
      { question: 'What event directly triggered Britain and France to declare war on Germany?', answer: 'Germany\'s invasion of Poland on 1 September 1939.' },
      { question: 'What was the League of Nations and why did it fail?', answer: 'An international organisation set up after WW1 to maintain peace — it failed due to lack of US membership, no army, and members prioritising self-interest.' },
      { question: 'What was Hitler\'s foreign policy goal regarding territory?', answer: 'Lebensraum ("living space") — expanding Germany eastwards to acquire land for the German people.' },
      { question: 'What was the Anschluss (1938)?', answer: 'The political union of Germany and Austria, achieved by Hitler in March 1938 — forbidden by the Treaty of Versailles.' },
      { question: 'Why did the Great Depression help Hitler rise to power?', answer: 'Economic hardship caused mass unemployment and suffering, making Germans receptive to Hitler\'s promises of national revival and scapegoating of minorities.' },
      { question: 'What were the Nuremberg Laws (1935)?', answer: 'Nazi racial laws that stripped Jews of German citizenship and prohibited marriage between Jews and non-Jews.' },
      { question: 'What was the remilitarisation of the Rhineland (1936)?', answer: 'Hitler sent German troops into the demilitarised Rhineland zone, violating the Treaty of Versailles — Britain and France did not intervene.' },
      { question: 'What was the Spanish Civil War (1936–39) and why was it significant?', answer: 'A conflict in Spain where Hitler supported Franco\'s Nationalists — it allowed Germany to test weapons and tactics (e.g. the bombing of Guernica).' },
      { question: 'What was Chamberlain\'s justification for the Munich Agreement?', answer: 'He believed it secured "peace for our time" by satisfying Hitler\'s last territorial demand and avoiding another devastating world war.' },
      { question: 'What does the term "policy of appeasement" mean in the context of the 1930s?', answer: 'Giving in to Hitler\'s demands to prevent war — critics argue it emboldened rather than deterred him.' },
      { question: 'What were reparations and how much did Germany owe after WW1?', answer: 'Compensation payments imposed on Germany — set at £6.6 billion in 1921, widely seen as crippling the German economy.' },
      { question: 'What was the Sudetenland crisis?', answer: 'Hitler\'s demand for the Sudetenland region of Czechoslovakia (home to German-speaking people) — ceded at Munich in 1938.' },
      { question: 'How did the Wall Street Crash (1929) contribute to the rise of Hitler?', answer: 'The global economic depression worsened poverty and unemployment in Germany, undermining the Weimar Republic and boosting support for extreme parties.' },
      { question: 'What was the Weimar Republic?', answer: 'The democratic government of Germany from 1919 to 1933, weakened by economic crisis, political extremism, and public association with WW1 defeat.' },
      { question: 'What was the significance of Kristallnacht (1938)?', answer: 'A nationwide pogrom against Jews in Germany — synagogues and Jewish businesses were destroyed, showing the escalating persecution of Jews under Nazism.' },
      { question: 'Why did Britain and France not act when Hitler reoccupied the Rhineland?', answer: 'They were not willing to risk war over a relatively minor breach, and many privately thought Germany had a right to control its own territory.' },
    ]
  ),
];

export function getDecksBySubject(): Record<string, LibraryDeck[]> {
  return LIBRARY_DECKS.reduce((acc, d) => {
    (acc[d.subject] ??= []).push(d);
    return acc;
  }, {} as Record<string, LibraryDeck[]>);
}
