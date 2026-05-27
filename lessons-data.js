// lessons-data.js — Generates 1500 typing lessons
(function () {
  function seededRng(seed) {
    let s = seed >>> 0;
    return {
      next() { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; },
      pick(a) { return a[Math.floor(this.next() * a.length)]; },
      shuffle(a) { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(this.next() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; },
      sample(a, n) { return this.shuffle(a).slice(0, Math.min(n, a.length)); }
    };
  }

  // ── Word Banks ──────────────────────────────────────────────────────────────
  const W = {
    homeOnly: ['add','all','ask','dad','fall','flag','glad','glass','had','hall','jak','lad','lass','sad','shall','gal','gas','lag','hash','dash','sash','fads','lads','dads','half','slag','flab','dahl'],
    home2: ['adds','alls','dads','fall','flash','flask','flags','glads','glass','halls','lash','salad','shall','small','stall','black','slack','class','clash','flask','skull'],
    top3: ['put','rut','try','rye','you','top','toy','row','owe','quit','pipe','yore','tour','your','true','trey','prey','rout','roux','zero'],
    bottom3: ['cub','cab','vim','nab','van','ban','vim','nix','box','zen','zap','mix','max','vex','cob','mob','job','bun','nun','gun'],
    short: ['the','and','for','are','but','not','you','all','can','had','her','was','one','our','out','who','its','now','how','did','his','him','has','any','say','new','two','way','get','see','use','may','big','old','too','ask','cut','end','far','got','hit','let','lot','met','nor','off','own','per','set','six','ten','yes','yet'],
    medium: ['about','after','again','could','every','first','found','great','group','heard','large','learn','might','never','often','place','point','right','since','small','still','their','these','think','those','three','under','where','which','while','would','write','years','young','above','begin','being','below','bring','built','claim','clear','close','comes','cover','doing','drive','early','eight','enter','forms','going','hands','happy','heart','horse','human','ideas','image','leave','light','lines','lives','local','means','money','month','music','named','night','north','notes','often','order','other','paper','parts','peace','plant','point','power','press','price','quite','reach','ready','river','roads','rules','sense','share','short','shown','since','skill','sleep','slide','south','space','speak','speed','spend','spoke','stand','start','state','steps','stock','store','study','style','table','taken','teach','terms','thing','times','today','total','touch','towns','track','trade','train','trees','trend','tried','trust','truth','turns','twice','types','under','union','until','users','using','value','video','views','visit','vital','voice','water','weeks','where','whole','whose','words','works','world'],
    advanced: ['achieve','ancient','balance','capture','climate','develop','digital','dynamic','elegant','example','famous','finally','forward','general','history','imagine','include','initial','journey','justice','kitchen','language','message','natural','network','opinion','organic','passion','perfect','perhaps','popular','present','primary','process','program','project','quality','rapidly','reality','receive','recent','require','respond','results','review','science','similar','society','special','started','student','success','suggest','support','survive','through','together','towards','trouble','typical','usually','various','virtual','witness'],
    expert: ['absolutely','accomplish','acknowledge','alternative','approximately','architecture','authenticate','calculations','communicate','competitive','comprehensive','concentrate','configuration','consequence','considerable','contemporary','continuously','controversial','cooperate','demonstrate','development','dramatically','effectively','efficiently','encyclopedia','environment','extraordinary','fundamental','generations','government','immediately','improvement','independence','information','infrastructure','innovation','installation','intelligence','international','investigation','knowledge','legislation','magnificent','mathematics','measurement','meditation','methodology','modification','nevertheless','opportunity','organization','performance','perspective','philosophy','professional','programming','qualification','recognition','relationship','requirements','responsibility','sophisticated','subsequently','sustainability','understanding','unfortunately','visualization'],
  };

  // ── Sentences ────────────────────────────────────────────────────────────────
  const S = {
    simple: [
      'The cat sat on the mat.',
      'She sells seashells by the seashore.',
      'The quick brown fox jumps over the lazy dog.',
      'Pack my box with five dozen liquor jugs.',
      'How much wood would a woodchuck chuck?',
      'The sun rises in the east and sets in the west.',
      'A stitch in time saves nine.',
      'Look before you leap.',
      'Every cloud has a silver lining.',
      'Actions speak louder than words.',
      'The early bird catches the worm.',
      'Practice makes perfect.',
      'Where there is a will there is a way.',
      'All that glitters is not gold.',
      'Time flies when you are having fun.',
      'Laughter is the best medicine.',
      'Two wrongs do not make a right.',
      'You cannot judge a book by its cover.',
      'An apple a day keeps the doctor away.',
      'Better late than never.',
    ],
    animals: [
      'The golden eagle soars high above the mountain peaks with effortless grace.',
      'Dolphins are intelligent mammals that communicate through clicks and whistles.',
      'A pride of lions rests in the shade during the hot afternoon hours.',
      'The chameleon changes color to communicate and regulate its body temperature.',
      'Penguins huddle together to protect themselves from Antarctic winds.',
      'Wolves hunt in coordinated packs and can take down much larger prey.',
      'The hummingbird hovers by beating its wings up to eighty times per second.',
      'Elephants have exceptional memories and can recognize humans after many years.',
      'The blue whale is the largest animal ever known to have existed on Earth.',
      'Chimpanzees share nearly ninety-eight percent of their DNA with humans.',
      'The peregrine falcon reaches speeds over two hundred miles per hour in a dive.',
      'Sea otters float on their backs and use rocks to crack open shellfish.',
      'Arctic foxes change fur color from white in winter to brown in summer.',
      'Monarch butterflies migrate three thousand miles from Canada to Mexico each year.',
      'Honey bees communicate the location of flowers through an elaborate waggle dance.',
      'Octopuses can change color in milliseconds and squeeze through tiny openings.',
      'Giant pandas spend up to fourteen hours per day eating bamboo in the wild.',
      'The mantis shrimp has the most complex eyes of any animal ever discovered.',
      'Gorillas build new sleeping nests from branches and leaves every single night.',
      'Manta rays can leap completely out of the ocean and spin in the air.',
    ],
    science: [
      'Water molecules consist of two hydrogen atoms bonded to a single oxygen atom.',
      'DNA carries the genetic instructions for all known living organisms on Earth.',
      'The periodic table organizes all known chemical elements by atomic number.',
      'Photosynthesis converts light energy into chemical energy stored in glucose.',
      'Neurons transmit electrical signals throughout the nervous system at remarkable speeds.',
      'The theory of relativity changed our understanding of space, time, and gravity.',
      'Black holes are regions where gravity is so strong that nothing can escape.',
      'Climate change is causing sea levels to rise at an unprecedented rate worldwide.',
      'Antibiotics kill bacteria, but overuse has led to dangerous resistant strains.',
      'Quantum mechanics describes how matter and energy behave at the smallest scales.',
      'The immune system identifies and destroys foreign substances like viruses and bacteria.',
      'Plate tectonics explains how continents move slowly across Earth over millions of years.',
      'Gravity waves were predicted by Einstein and first detected in the year 2015.',
      'The universe is approximately thirteen point eight billion years old.',
      'Light from distant galaxies takes millions of years to reach our telescopes.',
      'Stem cells can develop into many different types of specialized cells in the body.',
      'CRISPR technology allows scientists to precisely edit DNA sequences in living cells.',
      'The human genome contains approximately three billion base pairs of genetic code.',
      'Nuclear fusion powers the sun and produces more energy than any other reaction.',
      'Supernovae occur when massive stars run out of fuel and collapse in an explosion.',
    ],
    technology: [
      'Artificial intelligence is transforming industries from healthcare to transportation.',
      'The internet connects over five billion people across every corner of the globe.',
      'Renewable energy sources like solar and wind are becoming increasingly affordable.',
      'Machine learning algorithms find patterns in data that humans cannot easily detect.',
      'Smartphones contain more computing power than the computers used in Apollo missions.',
      'Blockchain creates transparent and tamper-resistant records without central control.',
      'Quantum computers can solve certain problems impossible for classical computers.',
      'Three-dimensional printing creates physical objects layer by layer from digital files.',
      'Self-driving vehicles use cameras, radar, and lidar to navigate roads safely.',
      'Cloud computing lets businesses access servers and storage over the internet.',
      'Virtual reality creates immersive digital environments that simulate real experience.',
      'Satellites provide GPS navigation, weather forecasting, and global communication.',
      'Cybersecurity protects digital systems from hackers, malware, and data breaches.',
      'Robotics and automation are changing the nature of manufacturing and logistics.',
      'Augmented reality overlays digital information onto the physical world around us.',
      'Streaming services have replaced physical media as the dominant way to consume content.',
      'Neural networks learn by processing vast datasets and adjusting their own parameters.',
      'The Internet of Things connects everyday objects to the internet for smart control.',
      'Fiber optic cables transmit data as pulses of light at nearly the speed of light itself.',
      'Biometrics like fingerprints and facial recognition are replacing passwords for security.',
    ],
    history: [
      'The ancient Egyptians built the pyramids as tombs for their pharaohs long ago.',
      'The Renaissance brought new ideas in art, science, and philosophy to Europe.',
      'The Industrial Revolution transformed society by introducing mechanized production.',
      'World War Two was the deadliest conflict in human history with over seventy million deaths.',
      'The printing press revolutionized the spread of knowledge across medieval Europe.',
      'Ancient Rome built an empire stretching from Britain to the Middle East.',
      'The civil rights movement fought for equal rights and an end to racial discrimination.',
      'The fall of the Berlin Wall in 1989 marked the symbolic end of the Cold War.',
      'The space race between the United States and Soviet Union led to historic achievements.',
      'The Black Death killed approximately one third of Europe in the fourteenth century.',
      'The Silk Road connected China to Rome and enabled cultural and trade exchange.',
      'The French Revolution toppled the monarchy and introduced ideals of liberty and equality.',
      'Ancient Greece gave birth to democracy, philosophy, mathematics, and Western drama.',
      'The American Revolution produced the first modern written democratic constitution.',
      'The Ottoman Empire at its peak controlled vast territories across three continents.',
      'Gutenberg invented movable type printing around 1440 and transformed literacy forever.',
      'The discovery of penicillin by Alexander Fleming saved hundreds of millions of lives.',
      'Neil Armstrong became the first human to walk on the Moon on July 20th 1969.',
      'The Magna Carta of 1215 established that even kings must obey the rule of law.',
      'The Age of Exploration opened sea routes connecting Europe to the Americas and Asia.',
    ],
    nature: [
      'Rainforests cover six percent of Earth and house more than half of all species.',
      'The Grand Canyon was carved by the Colorado River over millions of years of erosion.',
      'Volcanoes form when magma from beneath the crust erupts through surface vents.',
      'The Northern Lights are caused by charged particles colliding with the atmosphere.',
      'Ocean currents circulate water globally and play a key role in regulating climate.',
      'Coral reefs are home to more than twenty-five percent of all marine life on Earth.',
      'Lightning strikes the Earth approximately one hundred times every single second.',
      'The Amazon River carries more water than any other river anywhere in the world.',
      'Earthquakes occur when tectonic plates shift and release stored energy at faults.',
      'Glaciers are retreating worldwide as temperatures rise due to climate change.',
      'Deserts cover more than one third of Earth and receive very little annual rainfall.',
      'Wildfires are a natural part of many ecosystems that clear dead vegetation.',
      'Deep ocean hydrothermal vents support life powered by chemicals instead of sunlight.',
      'The Sahara Desert spans eleven million square kilometers across northern Africa.',
      'Bioluminescent organisms produce their own light through chemical reactions in cells.',
      'Tide pools support diverse life that must survive changing water levels each day.',
      'Permafrost stores vast amounts of carbon and is thawing due to rising temperatures.',
      'Mushrooms are the fruiting bodies of fungi that decompose and recycle nutrients.',
      'Soil teems with life including billions of bacteria and fungi in every handful.',
      'Mangrove forests protect coastlines from erosion and serve as nurseries for fish.',
    ],
    sports: [
      'Marathon runners train for months to build endurance for a twenty-six mile race.',
      'Basketball was invented in 1891 by James Naismith using peach baskets and a soccer ball.',
      'Swimming is one of the best exercises because it works nearly every muscle group.',
      'Rock climbers develop strength, balance, and mental focus to scale difficult routes.',
      'Soccer is the most popular sport in the world with billions of fans globally.',
      'Tour de France cyclists race more than two thousand miles in just three weeks.',
      'Chess is a strategic board game that has been played for over fifteen centuries.',
      'Olympic athletes dedicate years of training for a few precious moments of glory.',
      'Yoga combines postures, breathing, and meditation to improve overall well-being.',
      'The rules of tennis were standardized in the nineteenth century and remain unchanged.',
      'Baseball players practice batting, pitching, and fielding for years to reach the majors.',
      'The pole vault requires strength, speed, flexibility, and precise technical skill.',
      'Gymnastics demands grace, power, and split-second timing on every apparatus.',
      'Surfing requires reading ocean swells and reacting to constantly changing conditions.',
      'Professional cyclists must monitor nutrition, cadence, and heart rate constantly.',
    ],
    food: [
      'Fresh herbs like basil and thyme can transform an ordinary dish into something special.',
      'The art of bread making requires patience, precision, and an understanding of fermentation.',
      'Spices have been traded across cultures for thousands of years and shaped world history.',
      'A balanced diet includes fruits, vegetables, whole grains, and lean proteins daily.',
      'Fermented foods like kimchi and yogurt contain beneficial bacteria for gut health.',
      'Dark chocolate contains antioxidants that may reduce inflammation and improve heart health.',
      'Olive oil has been a staple of Mediterranean cooking for more than eight thousand years.',
      'Growing your own vegetables connects you to the food you eat in meaningful ways.',
      'The Maillard reaction gives browned food its rich and distinctive caramelized flavor.',
      'Traditional cuisines reflect the unique geography and culture of each region on Earth.',
    ],
    wisdom: [
      'A good book can transport you to worlds beyond your imagination and broaden your view.',
      'The most important ingredient in any recipe for success is persistent daily effort.',
      'Creativity flourishes when we allow ourselves to make mistakes without fear of judgment.',
      'True friendship is built on trust, mutual respect, and genuine care for one another.',
      'Learning a new language opens doors to different cultures and ways of thinking.',
      'The journey toward mastery requires daily practice and willingness to keep improving.',
      'Kindness is a language that everyone understands regardless of their native tongue.',
      'Every challenge we face carries within it the seeds of a greater opportunity.',
      'The greatest discoveries happen at the intersection of curiosity and careful observation.',
      'Health is not merely the absence of illness but a state of complete well-being.',
      'Reading is one of the most powerful tools for expanding your understanding of the world.',
      'Meditation reduces stress, improves focus, and increases overall sense of well-being.',
      'Mathematics underlies everything from snowflake patterns to the orbits of planets.',
      'Sleep is essential for physical recovery, memory consolidation, and emotional balance.',
      'Exercise is one of the most powerful tools for improving both body and mind health.',
      'Music has been part of human culture for as long as we have any historical records.',
      'Architecture shapes our experience of the world in subtle but deeply profound ways.',
      'Curiosity is the engine of achievement and the foundation of scientific discovery.',
      'Empathy is the ability to understand and share the feelings of another human being.',
      'Patience is not the ability to wait but the ability to keep a good attitude while waiting.',
    ],
  };

  // ── Paragraphs ───────────────────────────────────────────────────────────────
  const P = [
    'The African elephant is the largest land animal on Earth. These magnificent creatures live in complex social groups led by a matriarch. They communicate through low-frequency rumbles that travel miles underground. Elephants use their trunks for breathing, smelling, drinking, and grasping objects with surprising precision.',
    'Wolves are highly social animals that live in family groups called packs. A pack typically consists of a breeding pair and offspring from multiple years. Pack members work together to hunt large prey like deer and elk. Communication through howling helps wolves coordinate and strengthen social bonds.',
    'The octopus is one of the most intelligent invertebrates on Earth. With three hearts, blue blood, and the ability to change color instantly, these creatures are remarkable. Octopuses have been observed using tools, solving puzzles, and escaping from aquariums when humans are not watching.',
    'Monarch butterflies undertake one of the most remarkable migrations in the animal kingdom. Each autumn, millions of these delicate insects travel up to three thousand miles to warmer climates. They navigate using a combination of the sun position and Earth magnetic field.',
    'The blue whale is the largest animal ever known to have existed on Earth. These giants can reach lengths of one hundred feet and weigh up to two hundred tons. Despite their enormous size, blue whales feed almost exclusively on tiny shrimp-like creatures called krill.',
    'The human brain is the most complex object we know of in the entire universe. Containing roughly eighty-six billion neurons connected to thousands of others, it processes information at remarkable speeds. Scientists are still far from fully understanding consciousness and the neural basis of thought.',
    'DNA carries genetic information in all living organisms. The double helix structure was discovered by Watson and Crick in 1953. Every human cell contains about six feet of DNA, and the human genome contains roughly three billion base pairs that encode our entire biology.',
    'The theory of plate tectonics explains how Earth outer layer is divided into sections that move over millions of years. This movement creates mountains, earthquakes, and volcanoes. The continents were once joined in a single supercontinent called Pangaea about three hundred million years ago.',
    'Quantum mechanics describes the behavior of matter at the smallest possible scales. Unlike classical physics, quantum systems can exist in multiple states simultaneously until measured. This strange phenomenon, called superposition, challenges our intuitions about the fundamental nature of reality.',
    'Photosynthesis is the process by which plants convert sunlight into chemical energy. Using chlorophyll to capture light, plants combine water and carbon dioxide to produce glucose and oxygen. This process is the foundation of nearly all life on Earth and provides the air we breathe.',
    'Artificial intelligence is transforming nearly every industry from healthcare to finance. Machine learning algorithms can now diagnose diseases, translate languages in real time, and generate human-like text. As AI systems grow more powerful, questions about ethics and the future of work become urgent.',
    'The internet fundamentally changed how humanity communicates and accesses information. What began as a military research network in the 1960s now connects over five billion people. The web enables global commerce and access to nearly all of human knowledge in seconds.',
    'Renewable energy is rapidly becoming the most cost-effective source of electricity in the world. Solar panels and wind turbines have seen dramatic price reductions over the past decade. Paired with improved battery storage technology, renewables are poised to replace fossil fuels entirely.',
    'Blockchain technology creates a distributed and tamper-resistant record of transactions. First proposed in 2008 as the foundation of Bitcoin, blockchain has since been applied to supply chains, medical records, and voting systems. It eliminates the need for trusted intermediaries by distributing trust across a network.',
    'The Roman Empire at its height controlled territories stretching from Britain to Mesopotamia. Roman engineering achievements like aqueducts, roads, and the Colosseum still inspire admiration today. Roman law, language, and culture profoundly shaped the development of Western civilization.',
    'The Renaissance was a cultural and intellectual movement that began in Italy in the fourteenth century. Artists like Leonardo da Vinci and Michelangelo created works of unparalleled beauty. Scientists like Galileo challenged tradition with careful observation and transformed our understanding of the cosmos.',
    'The Amazon rainforest is often called the lungs of the Earth because it produces twenty percent of the world oxygen. Spanning nine countries and over five million square kilometers, it houses an estimated ten percent of all species. Deforestation is the most serious threat facing this irreplaceable ecosystem.',
    'The Great Barrier Reef is the largest coral reef system on Earth, stretching over two thousand kilometers along the northeast coast of Australia. It is home to more than fifteen hundred species of fish and four thousand types of mollusk. Rising ocean temperatures are causing widespread and devastating bleaching.',
    'Reading is one of the most powerful tools for expanding your mind. Books allow us to experience lives different from our own and encounter ideas that challenge our assumptions. Regular reading has been linked to better cognitive function, reduced stress, and greater emotional intelligence over a lifetime.',
    'The practice of meditation has been shown to reduce stress, improve focus, and increase well-being. By training attention and awareness, meditation helps practitioners develop clarity of mind. Even a few minutes of daily practice creates measurable changes in the brain that improve emotional regulation.',
    'Exercise is one of the most powerful tools available for improving both physical and mental health. Regular physical activity reduces the risk of chronic diseases, improves mood, enhances cognitive function, and promotes better sleep. Even moderate activity like a daily walk delivers significant health benefits.',
    'Music has been part of human culture for as long as we have records of human activity. It plays a role in rituals, celebrations, mourning, and daily life across every culture on Earth. Research shows musical training changes the brain in ways that improve language processing and memory.',
    'The deep ocean remains one of Earth least explored frontiers. Below one thousand meters, sunlight does not penetrate, and life must find other energy sources. Hydrothermal vents support entire ecosystems powered by chemosynthesis. New species are discovered with nearly every deep-sea expedition conducted.',
    'Language is far more than a tool for communication. It shapes how we think, what we can express, and even how we perceive reality. The hundreds of languages spoken around the world each contain unique ways of describing experience. When a language disappears, humanity loses an irreplaceable cultural treasure.',
    'Sleep is essential for physical recovery, memory consolidation, and emotional regulation. Adults generally need seven to nine hours of quality sleep each night. Chronic sleep deprivation is linked to increased risk of obesity, heart disease, diabetes, and mental health problems that worsen over time.',
    'Creativity is not a fixed trait some people have and others lack but a skill that can be developed. Cultivating creativity requires curiosity, willingness to take risks, and the ability to connect seemingly unrelated ideas. The most innovative solutions often come from people who bring fresh perspectives.',
    'Glaciers are vast bodies of ice formed from accumulated and compressed snow. They move slowly under their own weight, carving valleys and shaping landscapes over thousands of years. Today glaciers are retreating worldwide as temperatures rise, threatening water supplies for millions of people downstream.',
    'The natural world operates according to principles of interconnection and balance. When one element of an ecosystem is disrupted, the effects ripple outward in unpredictable ways. This web of dependencies is why biodiversity matters: the more diverse an ecosystem, the more resilient it is to disturbance.',
    'Chess is one of the oldest and most complex strategy games ever created by humans. Two players maneuver sixteen pieces each across a sixty-four square board with the goal of trapping the opponent king. The game demands long-term planning, tactical awareness, and the ability to anticipate your opponent moves.',
    'The history of flight is one of humanity greatest engineering achievements. From the Wright Brothers first powered flight in 1903 to supersonic jets and space shuttles, aviation transformed the world. What once took months by ship now takes hours by airplane, shrinking our planet and connecting cultures.',
    'Cooking is both a science and an art that humans have practiced for hundreds of thousands of years. The application of heat transforms raw ingredients through chemical reactions, creating new flavors and textures. Great cooking balances taste, aroma, texture, and visual appeal to create a complete sensory experience.',
    'The development of writing was one of the most transformative inventions in human history. It allowed information to be recorded, preserved, and shared across time and space. From clay tablets to papyrus to printed books to digital screens, writing has driven the accumulation of human knowledge.',
    'Urban gardens and community plots are transforming cities by bringing nature into dense urban environments. Growing food in cities reduces transportation emissions, improves mental health, and builds community among neighbors. Even small balcony gardens can provide fresh herbs, vegetables, and a connection to the growing process.',
    'The science of nutrition has advanced dramatically over the past century, revealing complex relationships between diet and health. We now understand that different foods affect our gut microbiome, inflammation levels, and even gene expression. Eating a diverse diet rich in whole foods remains the cornerstone of good health.',
    'Astronomy allows us to look back in time by studying light that has traveled across the cosmos. Light from distant galaxies takes billions of years to reach our telescopes, showing us the universe as it was long ago. By studying ancient starlight, astronomers piece together the history of how galaxies form and evolve.',
    'The history of medicine is a story of humanity gradual triumph over disease and suffering. From the discovery of vaccines to the development of antibiotics, each breakthrough has extended human life and reduced suffering. Modern medicine continues to advance with new tools like genetic therapy and precision medicine.',
    'Libraries are among the most democratic institutions ever created by human civilization. They provide free access to knowledge, culture, and ideas to everyone regardless of income or background. In the digital age, libraries continue to evolve by offering internet access, digital books, and community programming.',
    'Volcanoes are both destructive and creative forces that have shaped Earth landscape for billions of years. Volcanic eruptions can destroy ecosystems and displace populations, but they also create fertile soil and new land. Hawaii and Iceland are examples of islands created entirely by volcanic activity over time.',
    'The human immune system is a remarkable network of cells and proteins that defends against infection. When pathogens enter the body, white blood cells identify and neutralize threats with extraordinary precision. Vaccines train the immune system to recognize specific pathogens so it can respond quickly if infected.',
    'Architecture is the art and science of designing spaces that serve human needs while inspiring the spirit. Great buildings balance structural integrity with aesthetic beauty and cultural meaning. From the Parthenon to the Sydney Opera House, iconic structures define the identity of the cities and eras that created them.',
    'The carbon cycle describes how carbon moves between the atmosphere, oceans, soil, and living organisms. Plants absorb carbon dioxide during photosynthesis, storing carbon in their tissues. When organisms die and decompose, carbon is released back into the atmosphere, completing the cycle over varying timescales.',
    'Artificial satellites orbit Earth and enable technologies we rely on every day without thinking. GPS navigation, weather forecasting, global communication, and scientific monitoring all depend on satellites. The first human-made satellite, Sputnik, was launched by the Soviet Union in 1957, beginning the space age.',
    'The philosophy of science examines the foundations, methods, and implications of scientific inquiry. Scientists form hypotheses, design experiments to test them, and revise their understanding based on evidence. This self-correcting process, though imperfect, has proven extraordinarily effective at revealing truths about nature.',
    'Typography is the art and technique of arranging text to make it readable, clear, and visually engaging. Font selection, line spacing, letter spacing, and layout all influence how readers experience written content. Good typography is invisible in the sense that it guides readers smoothly without calling attention to itself.',
    'The Arctic is warming twice as fast as the rest of the planet, with profound consequences for global climate. As sea ice melts, it exposes darker ocean water that absorbs more heat, accelerating warming further. Indigenous communities that depend on ice-based hunting and travel face the loss of their traditional way of life.',
    'Entrepreneurship drives economic growth by creating new businesses, products, and jobs in communities. Successful entrepreneurs identify problems that need solving and build organizations to address them. The path from idea to viable business requires creativity, persistence, resilience, and the willingness to learn from failure.',
    'The development of vaccines is one of the greatest achievements in the history of public health. Vaccines have eradicated smallpox, nearly eliminated polio, and prevented countless deaths from measles and other diseases. Each vaccine represents years of careful research, testing, and safety evaluation before approval.',
    'Ocean plastic pollution is a growing environmental crisis threatening marine ecosystems worldwide. Every year millions of tons of plastic waste enter the ocean, breaking down into microplastics that enter the food chain. Solving this problem requires changes in production, consumption, and waste management at a global scale.',
    'Forests play a critical role in regulating Earth climate by absorbing carbon dioxide from the atmosphere. Old-growth forests store vast amounts of carbon accumulated over centuries in their trees and soil. Protecting existing forests and restoring degraded ones are among the most cost-effective climate solutions available.',
    'The psychology of learning reveals that how we study matters as much as how long we study. Techniques like spaced repetition, active recall, and interleaving subjects dramatically improve retention. Understanding these principles allows students to learn more effectively with less time and effort than traditional methods.',
    'Stars are born in vast clouds of gas and dust called nebulae when gravity pulls material together. As a star collapses, temperatures rise until nuclear fusion begins in the core, releasing enormous energy. Stars spend most of their lives fusing hydrogen into helium before expanding, cooling, and eventually dying.',
  ];

  // ── Code Snippets ────────────────────────────────────────────────────────────
  const CODE_JS = [
    'const greeting = "Hello, World!";\nconsole.log(greeting);',
    'function add(a, b) {\n  return a + b;\n}\nconst result = add(5, 3);\nconsole.log(result);',
    'const numbers = [1, 2, 3, 4, 5];\nconst doubled = numbers.map(n => n * 2);\nconsole.log(doubled);',
    'const fruits = ["apple", "banana", "cherry"];\nfruits.forEach(fruit => {\n  console.log(fruit);\n});',
    'const square = x => x * x;\nconsole.log(square(4));\nconsole.log(square(9));',
    'let count = 0;\nfor (let i = 0; i < 10; i++) {\n  count += i;\n}\nconsole.log(count);',
    'const obj = { name: "Alice", age: 30 };\nconst { name, age } = obj;\nconsole.log(name, age);',
    'async function fetchData(url) {\n  const response = await fetch(url);\n  return response.json();\n}',
    'const filtered = [1, 2, 3, 4, 5].filter(n => n % 2 === 0);\nconsole.log(filtered);',
    'class Animal {\n  constructor(name) {\n    this.name = name;\n  }\n  speak() {\n    return this.name + " makes a sound.";\n  }\n}',
    'const sum = arr => arr.reduce((acc, val) => acc + val, 0);\nconsole.log(sum([1, 2, 3, 4, 5]));',
    'const str = "Hello World";\nconsole.log(str.toLowerCase());\nconsole.log(str.split(" ").reverse().join(" "));',
    'function fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}',
    'const promise = new Promise((resolve, reject) => {\n  setTimeout(() => resolve("done"), 1000);\n});\npromise.then(console.log);',
    'const unique = arr => [...new Set(arr)];\nconsole.log(unique([1, 2, 2, 3, 3, 4]));',
    'function isPrime(n) {\n  if (n < 2) return false;\n  for (let i = 2; i <= Math.sqrt(n); i++) {\n    if (n % i === 0) return false;\n  }\n  return true;\n}',
    'const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);\nconsole.log(capitalize("hello world"));',
    'const stack = [];\nstack.push(1);\nstack.push(2);\nstack.push(3);\nconsole.log(stack.pop());',
    'const range = (start, end) => Array.from({ length: end - start }, (_, i) => i + start);\nconsole.log(range(1, 6));',
    'function deepClone(obj) {\n  return JSON.parse(JSON.stringify(obj));\n}\nconst clone = deepClone({ a: 1, b: { c: 2 } });',
    'const memoize = fn => {\n  const cache = {};\n  return (...args) => {\n    const key = JSON.stringify(args);\n    return cache[key] || (cache[key] = fn(...args));\n  };\n};',
    'class Stack {\n  constructor() { this.items = []; }\n  push(item) { this.items.push(item); }\n  pop() { return this.items.pop(); }\n  peek() { return this.items[this.items.length - 1]; }\n}',
    'const flatten = arr => arr.reduce((flat, item) => flat.concat(Array.isArray(item) ? flatten(item) : item), []);',
    'const throttle = (fn, delay) => {\n  let last = 0;\n  return (...args) => {\n    const now = Date.now();\n    if (now - last >= delay) { last = now; fn(...args); }\n  };\n};',
    'async function retry(fn, attempts = 3) {\n  try {\n    return await fn();\n  } catch (err) {\n    if (attempts <= 1) throw err;\n    return retry(fn, attempts - 1);\n  }\n}',
    'const groupBy = (arr, key) => arr.reduce((acc, item) => {\n  (acc[item[key]] = acc[item[key]] || []).push(item);\n  return acc;\n}, {});',
    'function binarySearch(arr, target) {\n  let left = 0, right = arr.length - 1;\n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    if (arr[mid] === target) return mid;\n    arr[mid] < target ? (left = mid + 1) : (right = mid - 1);\n  }\n  return -1;\n}',
    'const pipe = (...fns) => x => fns.reduce((acc, fn) => fn(acc), x);\nconst transform = pipe(x => x * 2, x => x + 1, x => x.toString());\nconsole.log(transform(5));',
    'const debounce = (fn, delay) => {\n  let timer;\n  return (...args) => {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn(...args), delay);\n  };\n};',
    'function quickSort(arr) {\n  if (arr.length <= 1) return arr;\n  const pivot = arr[Math.floor(arr.length / 2)];\n  const left = arr.filter(x => x < pivot);\n  const right = arr.filter(x => x > pivot);\n  return [...quickSort(left), pivot, ...quickSort(right)];\n}',
  ];

  const CODE_PY = [
    'greeting = "Hello, World!"\nprint(greeting)',
    'def add(a, b):\n    return a + b\n\nresult = add(5, 3)\nprint(result)',
    'numbers = [1, 2, 3, 4, 5]\ndoubled = [n * 2 for n in numbers]\nprint(doubled)',
    'fruits = ["apple", "banana", "cherry"]\nfor fruit in fruits:\n    print(fruit)',
    'import math\n\ndef circle_area(r):\n    return math.pi * r ** 2\n\nprint(f"Area: {circle_area(5):.2f}")',
    'count = 0\nfor i in range(10):\n    count += i\nprint(count)',
    'person = {"name": "Alice", "age": 30}\nname = person["name"]\nage = person["age"]\nprint(name, age)',
    'def fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n - 1) + fibonacci(n - 2)\n\nprint(fibonacci(10))',
    'evens = [n for n in range(1, 11) if n % 2 == 0]\nprint(evens)',
    'class Animal:\n    def __init__(self, name):\n        self.name = name\n\n    def speak(self):\n        return f"{self.name} makes a sound."',
    'total = sum([1, 2, 3, 4, 5])\nprint(total)',
    'text = "Hello World"\nprint(text.lower())\nprint(" ".join(reversed(text.split())))',
    'def is_prime(n):\n    if n < 2:\n        return False\n    for i in range(2, int(n**0.5) + 1):\n        if n % i == 0:\n            return False\n    return True',
    'unique = list(set([1, 2, 2, 3, 3, 4]))\nprint(unique)',
    'stack = []\nstack.append(1)\nstack.append(2)\nstack.append(3)\nprint(stack.pop())',
    'import random\n\ndef shuffle(lst):\n    result = lst.copy()\n    random.shuffle(result)\n    return result',
    'def binary_search(arr, target):\n    left, right = 0, len(arr) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1',
    'words = ["hello", "world", "python"]\ncapitalized = [w.capitalize() for w in words]\nprint(capitalized)',
    'from collections import Counter\n\ntext = "hello world"\ncounts = Counter(text)\nprint(counts)',
    'def flatten(lst):\n    result = []\n    for item in lst:\n        if isinstance(item, list):\n            result.extend(flatten(item))\n        else:\n            result.append(item)\n    return result',
    'import json\n\ndata = {"name": "Alice", "score": 95}\njson_str = json.dumps(data, indent=2)\nprint(json_str)',
    'def memoize(fn):\n    cache = {}\n    def wrapper(*args):\n        if args not in cache:\n            cache[args] = fn(*args)\n        return cache[args]\n    return wrapper',
    'class Queue:\n    def __init__(self):\n        self.items = []\n\n    def enqueue(self, item):\n        self.items.append(item)\n\n    def dequeue(self):\n        return self.items.pop(0)',
    'def quick_sort(arr):\n    if len(arr) <= 1:\n        return arr\n    pivot = arr[len(arr) // 2]\n    left = [x for x in arr if x < pivot]\n    right = [x for x in arr if x > pivot]\n    return quick_sort(left) + [pivot] + quick_sort(right)',
    'with open("file.txt", "r") as f:\n    content = f.read()\n    lines = content.split("\\n")\n    print(f"Lines: {len(lines)}")',
    'def decorator(fn):\n    def wrapper(*args, **kwargs):\n        print("Before call")\n        result = fn(*args, **kwargs)\n        print("After call")\n        return result\n    return wrapper',
    'import os\n\nfor root, dirs, files in os.walk("."):\n    for file in files:\n        print(os.path.join(root, file))',
    'from dataclasses import dataclass\n\n@dataclass\nclass Point:\n    x: float\n    y: float\n\n    def distance(self, other):\n        return ((self.x - other.x)**2 + (self.y - other.y)**2) ** 0.5',
    'def group_by(lst, key):\n    result = {}\n    for item in lst:\n        k = item[key]\n        result.setdefault(k, []).append(item)\n    return result',
    'class LinkedList:\n    class Node:\n        def __init__(self, val):\n            self.val = val\n            self.next = None\n\n    def __init__(self):\n        self.head = None\n\n    def append(self, val):\n        node = self.Node(val)\n        if not self.head:\n            self.head = node\n        else:\n            cur = self.head\n            while cur.next:\n                cur = cur.next\n            cur.next = node',
  ];

  const CODE_HTML = [
    '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>My Page</title>\n</head>\n<body>\n  <h1>Hello World</h1>\n</body>\n</html>',
    '<div class="container">\n  <h1>Welcome</h1>\n  <p>This is a paragraph of text.</p>\n  <button onclick="handleClick()">Click Me</button>\n</div>',
    '.container {\n  max-width: 1200px;\n  margin: 0 auto;\n  padding: 0 20px;\n}\n\n.button {\n  background: #3b82f6;\n  color: white;\n  border: none;\n  border-radius: 8px;\n  padding: 10px 20px;\n  cursor: pointer;\n}',
    '<nav class="navbar">\n  <a href="/">Home</a>\n  <a href="/about">About</a>\n  <a href="/contact">Contact</a>\n</nav>',
    'body {\n  font-family: "Inter", sans-serif;\n  background: #0a0a1a;\n  color: #e2e8f0;\n  margin: 0;\n  padding: 0;\n}',
    '<form action="/submit" method="POST">\n  <input type="text" name="username" placeholder="Username">\n  <input type="password" name="password" placeholder="Password">\n  <button type="submit">Login</button>\n</form>',
    '@media (max-width: 768px) {\n  .container {\n    padding: 0 16px;\n  }\n  .grid {\n    grid-template-columns: 1fr;\n  }\n}',
    '<ul class="list">\n  <li>First item</li>\n  <li>Second item</li>\n  <li>Third item</li>\n  <li>Fourth item</li>\n</ul>',
    '.card {\n  background: rgba(255, 255, 255, 0.05);\n  border: 1px solid rgba(255, 255, 255, 0.1);\n  border-radius: 12px;\n  padding: 24px;\n  transition: transform 0.2s ease;\n}',
    '<table>\n  <thead>\n    <tr>\n      <th>Name</th>\n      <th>Score</th>\n      <th>Date</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>Alice</td>\n      <td>95</td>\n      <td>2024-01-15</td>\n    </tr>\n  </tbody>\n</table>',
  ];

  // ── Key practice content generators ──────────────────────────────────────────
  function genKeyPractice(chars, level) {
    const patterns = [];
    chars.forEach(c => { for (let i = 0; i < 4; i++) patterns.push(c.repeat(3)); });
    // pairs
    for (let i = 0; i < chars.length - 1; i++) patterns.push(chars[i] + chars[i + 1]);
    const rng = seededRng(chars.join('').charCodeAt(0) * 31 + level);
    const words = W.homeOnly.filter(w => w.split('').every(c => chars.includes(c)));
    const base = rng.sample(patterns, 10).join(' ');
    const extra = words.length > 0 ? ' ' + rng.sample(words, Math.min(words.length, 6)).join(' ') : '';
    return (base + extra).trim();
  }

  function genWordDrill(wordList, seed, count = 25) {
    const rng = seededRng(seed);
    return rng.sample(wordList, Math.min(count, wordList.length)).join(' ');
  }

  function genSentenceDrill(sentArr, seed, count = 3) {
    const rng = seededRng(seed);
    return rng.sample(sentArr, count).join(' ');
  }

  // ── Build 1500 lessons ───────────────────────────────────────────────────────
  const lessons = [];
  let id = 1;

  function push(title, unit, unitName, difficulty, category, content, wpmGoal, desc) {
    lessons.push({ id: id++, title, unit, unitName, difficulty, category, content: content.replace(/\n/g, '\n'), wpmGoal, description: desc || '' });
  }

  // UNIT 1 — Home Row Keys (1-60)
  const homeGroups = [
    { keys: ['f', 'j'], label: 'F & J' },
    { keys: ['d', 'k'], label: 'D & K' },
    { keys: ['s', 'l'], label: 'S & L' },
    { keys: ['a', ';'], label: 'A & ;' },
    { keys: ['g', 'h'], label: 'G & H' },
    { keys: ['f', 'd', 's', 'a'], label: 'Left Home' },
    { keys: ['j', 'k', 'l', ';'], label: 'Right Home' },
    { keys: ['f', 'j', 'd', 'k'], label: 'Home Mix 1' },
    { keys: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'], label: 'Full Home Row' },
  ];
  homeGroups.forEach((g, gi) => {
    for (let lv = 0; lv < 7; lv++) {
      push(`Home Row: ${g.label} — Level ${lv + 1}`, 1, 'Home Row Keys', 'beginner', 'keys',
        genKeyPractice(g.keys, gi * 10 + lv), 20, `Practice the ${g.label} keys`);
    }
  });
  // fill to 60
  for (let x = lessons.length + 1; x <= 60; x++) {
    push(`Home Row Word Drill ${x - 53}`, 1, 'Home Row Keys', 'beginner', 'words',
      genWordDrill(W.homeOnly, x * 7, 20), 22, 'Type home row words');
  }

  // UNIT 2 — Top Row Keys (61-130)
  const topGroups = [
    { keys: ['r', 'u'], label: 'R & U' },
    { keys: ['t', 'y'], label: 'T & Y' },
    { keys: ['e', 'i'], label: 'E & I' },
    { keys: ['w', 'o'], label: 'W & O' },
    { keys: ['q', 'p'], label: 'Q & P' },
    { keys: ['e', 'r', 't', 'y', 'u', 'i', 'o', 'p'], label: 'Full Top Row' },
  ];
  topGroups.forEach((g, gi) => {
    for (let lv = 0; lv < 8; lv++) {
      push(`Top Row: ${g.label} — Level ${lv + 1}`, 2, 'Top Row Keys', 'beginner', 'keys',
        genKeyPractice(g.keys, gi * 10 + lv + 100), 22, `Practice the ${g.label} keys`);
    }
  });
  for (let x = lessons.length + 1; x <= 130; x++) {
    push(`Top Row Words ${x - 108}`, 2, 'Top Row Keys', 'beginner', 'words',
      genWordDrill(W.top3, x * 11, 22), 24, 'Type top row words');
  }

  // UNIT 3 — Bottom Row Keys (131-190)
  const botGroups = [
    { keys: ['v', 'm'], label: 'V & M' },
    { keys: ['b', 'n'], label: 'B & N' },
    { keys: ['c', 'x'], label: 'C & X' },
    { keys: ['z'], label: 'Z' },
    { keys: ['v', 'b', 'n', 'm'], label: 'Bottom Mix' },
    { keys: ['z', 'x', 'c', 'v', 'b', 'n', 'm'], label: 'Full Bottom Row' },
  ];
  botGroups.forEach((g, gi) => {
    for (let lv = 0; lv < 8; lv++) {
      push(`Bottom Row: ${g.label} — Level ${lv + 1}`, 3, 'Bottom Row Keys', 'beginner', 'keys',
        genKeyPractice(g.keys, gi * 10 + lv + 200), 22, `Practice the ${g.label} keys`);
    }
  });
  for (let x = lessons.length + 1; x <= 190; x++) {
    push(`Bottom Row Words ${x - 178}`, 3, 'Bottom Row Keys', 'beginner', 'words',
      genWordDrill(W.bottom3, x * 13, 22), 24, 'Type bottom row words');
  }

  // UNIT 4 — All Keys Review (191-250)
  for (let i = 0; i < 60; i++) {
    const rng = seededRng(300 + i);
    const banks = [W.homeOnly, W.top3, W.bottom3, W.short];
    const bank = banks[i % banks.length];
    push(`Full Keyboard Drill ${i + 1}`, 4, 'All Keys Review', 'beginner', 'words',
      genWordDrill(bank, 300 + i * 17, 25), 25, 'Use all keyboard keys');
  }

  // UNIT 5 — Common Short Words (251-360)
  for (let i = 0; i < 110; i++) {
    push(`Short Words ${i + 1}`, 5, 'Common Short Words', 'beginner', 'words',
      genWordDrill(W.short, 500 + i * 19, 28), 25, 'Common 2-4 letter words');
  }

  // UNIT 6 — Medium Words (361-470)
  for (let i = 0; i < 110; i++) {
    push(`Medium Words ${i + 1}`, 6, 'Medium Words', 'intermediate', 'words',
      genWordDrill(W.medium, 700 + i * 23, 25), 35, 'Common 5-7 letter words');
  }

  // UNIT 7 — Advanced Words (471-560)
  for (let i = 0; i < 90; i++) {
    push(`Advanced Words ${i + 1}`, 7, 'Advanced Words', 'intermediate', 'words',
      genWordDrill(W.advanced, 900 + i * 29, 22), 40, 'Longer vocabulary words');
  }

  // UNIT 8 — Expert Words (561-620)
  for (let i = 0; i < 60; i++) {
    push(`Expert Words ${i + 1}`, 8, 'Expert Words', 'advanced', 'words',
      genWordDrill(W.expert, 1100 + i * 31, 18), 55, 'Long and complex words');
  }

  // UNIT 9 — Simple Sentences (621-700)
  const simpleGroups = [S.simple, S.wisdom, S.food];
  for (let i = 0; i < 80; i++) {
    const grp = simpleGroups[i % simpleGroups.length];
    push(`Simple Sentences ${i + 1}`, 9, 'Simple Sentences', 'beginner', 'sentences',
      genSentenceDrill(grp, 1300 + i * 37, 3), 28, 'Short everyday sentences');
  }

  // UNIT 10 — Animals & Nature Sentences (701-780)
  for (let i = 0; i < 80; i++) {
    const grp = i % 2 === 0 ? S.animals : S.nature;
    push(`Nature & Animals ${i + 1}`, 10, 'Nature & Animals', 'intermediate', 'sentences',
      genSentenceDrill(grp, 1500 + i * 41, 3), 35, 'Sentences about animals and nature');
  }

  // UNIT 11 — Science & Tech Sentences (781-860)
  for (let i = 0; i < 80; i++) {
    const grp = i % 2 === 0 ? S.science : S.technology;
    push(`Science & Tech ${i + 1}`, 11, 'Science & Technology', 'intermediate', 'sentences',
      genSentenceDrill(grp, 1700 + i * 43, 3), 38, 'Sentences about science and technology');
  }

  // UNIT 12 — History & Sports Sentences (861-930)
  for (let i = 0; i < 70; i++) {
    const grp = i % 2 === 0 ? S.history : S.sports;
    push(`History & Sports ${i + 1}`, 12, 'History & Sports', 'intermediate', 'sentences',
      genSentenceDrill(grp, 1900 + i * 47, 3), 40, 'Sentences about history and sports');
  }

  // UNIT 13 — Mixed Sentences (931-1040)
  const allSentGroups = Object.values(S);
  for (let i = 0; i < 110; i++) {
    const grp = allSentGroups[i % allSentGroups.length];
    push(`Mixed Sentences ${i + 1}`, 13, 'Mixed Sentences', 'intermediate', 'sentences',
      genSentenceDrill(grp, 2100 + i * 53, 4), 42, 'Varied sentence practice');
  }

  // UNIT 14 — Short Paragraphs (1041-1150)
  for (let i = 0; i < 110; i++) {
    const para = P[i % P.length];
    const chunk = para.slice(0, Math.min(para.length, 280));
    push(`Short Paragraph ${i + 1}`, 14, 'Short Paragraphs', 'intermediate', 'paragraphs',
      chunk, 42, 'Short paragraph practice');
  }

  // UNIT 15 — Medium Paragraphs (1151-1250)
  for (let i = 0; i < 100; i++) {
    const para = P[i % P.length];
    const start = 80;
    const chunk = para.slice(start, start + 380);
    push(`Medium Paragraph ${i + 1}`, 15, 'Medium Paragraphs', 'advanced', 'paragraphs',
      chunk || para, 50, 'Medium-length paragraph practice');
  }

  // UNIT 16 — Long Paragraphs (1251-1330)
  for (let i = 0; i < 80; i++) {
    const para = P[i % P.length];
    push(`Long Paragraph ${i + 1}`, 16, 'Long Paragraphs', 'advanced', 'paragraphs',
      para, 55, 'Full paragraph typing');
  }

  // UNIT 17 — JavaScript Code (1331-1390)
  for (let i = 0; i < 60; i++) {
    const snippet = CODE_JS[i % CODE_JS.length];
    push(`JavaScript: Snippet ${i + 1}`, 17, 'JavaScript Code', 'advanced', 'programming',
      snippet, 45, 'Type real JavaScript code');
  }

  // UNIT 18 — Python Code (1391-1440)
  for (let i = 0; i < 50; i++) {
    const snippet = CODE_PY[i % CODE_PY.length];
    push(`Python: Snippet ${i + 1}`, 18, 'Python Code', 'advanced', 'programming',
      snippet, 40, 'Type real Python code');
  }

  // UNIT 19 — HTML & CSS Code (1441-1460)
  for (let i = 0; i < 20; i++) {
    const snippet = CODE_HTML[i % CODE_HTML.length];
    push(`HTML/CSS: Snippet ${i + 1}`, 19, 'HTML & CSS', 'advanced', 'programming',
      snippet, 38, 'Type web development code');
  }

  // UNIT 20 — Speed Bursts (1461-1510 → cap at 1500)
  const speedWords = [...W.short, ...W.medium.slice(0, 50)];
  for (let i = 0; i < 40; i++) {
    push(`Speed Burst ${i + 1}`, 20, 'Speed Bursts', 'expert', 'speed',
      genWordDrill(speedWords, 3000 + i * 67, 40), 65, 'Push your WPM to the limit!');
  }

  // UNIT 21 — Number & Symbol Drills (lessons ~1501 area)
  const numContent = [
    '1234 5678 9012 3456 7890 1234 5678 9012',
    '100 200 300 400 500 600 700 800 900 1000',
    'Phone: (555) 123-4567 or (555) 987-6543',
    'Price: $12.99 Sale: $8.49 Save: $4.50',
    'Date: 2024-01-15 Time: 09:30 AM',
    'Email: user@example.com | user2@test.org',
    'Score: 1,234,567 | Rank: #42 | Level: 99',
    '3.14159 2.71828 1.41421 1.73205 2.23607',
    'Room 304 Floor 7 Building A Suite 12B',
    'ISBN: 978-0-13-468599-1 Code: ABC-123',
  ];
  for (let i = 0; i < 30; i++) {
    push(`Numbers & Symbols ${i + 1}`, 21, 'Numbers & Symbols', 'intermediate', 'numbers',
      numContent[i % numContent.length], 30, 'Practice numbers and special characters');
  }

  // UNIT 22 — Advanced Mixed (fill to 1460)
  const allSents = Object.values(S).flat();
  while (lessons.length < 1460) {
    const i = lessons.length;
    const rng = seededRng(i * 71 + 9999);
    const sentCount = 4 + Math.floor(rng.next() * 3);
    push(`Advanced Mix ${i - 1459}`, 22, 'Advanced Mixed', 'advanced', 'mixed',
      genSentenceDrill(allSents, i * 71 + 9999, sentCount), 48, 'Mixed advanced practice');
  }

  // UNIT 23 — Expert Paragraphs (fill to 1490)
  while (lessons.length < 1490) {
    const i = lessons.length - 1460;
    const p1 = P[i % P.length];
    const p2 = P[(i + 1) % P.length];
    const combined = (p1 + ' ' + p2).slice(0, 500);
    push(`Expert Challenge ${i + 1}`, 23, 'Expert Challenges', 'expert', 'paragraphs',
      combined, 65, 'Extended expert-level typing');
  }

  // UNIT 24 — Master Challenges (1491-1500)
  const masterTexts = [
    'The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump! The five boxing wizards jump quickly. Sphinx of black quartz, judge my vow.',
    'Technology is reshaping the world at an unprecedented pace. Artificial intelligence, quantum computing, and biotechnology are converging to solve problems once thought impossible. The decisions we make today about how to develop and deploy these tools will shape civilization for centuries to come.',
    'In the beginning was the Word, and the Word was with God, and the Word was God. He was in the beginning with God. All things were made through him, and without him was not any thing made that was made.',
    'To be, or not to be, that is the question: Whether tis nobler in the mind to suffer the slings and arrows of outrageous fortune, or to take arms against a sea of troubles and by opposing end them.',
    'We hold these truths to be self-evident, that all men are created equal, that they are endowed by their Creator with certain unalienable Rights, that among these are Life, Liberty and the pursuit of Happiness.',
    'It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of Light.',
    'function masterTypist(text) {\n  const words = text.split(" ");\n  const wpm = words.length / (Date.now() / 60000);\n  const accuracy = calculateAccuracy(text, typed);\n  return { wpm, accuracy, stars: getStars(wpm, accuracy) };\n}',
    'The mitochondria are the powerhouses of the cell. Ribosomes synthesize proteins. The nucleus contains genetic material. The cell membrane regulates what enters and exits. These organelles work together to sustain life at the cellular level.',
    'E = mc² describes the equivalence of energy and mass. F = ma defines the relationship between force, mass, and acceleration. PV = nRT describes ideal gas behavior. These equations are among the most important in all of science.',
    'Gravity pulls objects toward each other with a force proportional to their masses and inversely proportional to the square of the distance between them. This principle explains why planets orbit stars and why objects fall to the ground.',
  ];
  while (lessons.length < 1530) {
    const i = lessons.length - 1490;
    push(`Master Challenge ${i + 1}`, 24, 'Master Challenges', 'expert', 'master',
      masterTexts[i % masterTexts.length], 80, 'The ultimate typing challenge');
  }

  // LESSON 1531 — The Grand Finale
  push(
    'The Grand Finale',
    22, 'Hall of Fame',
    'expert', 'master',
    'Congratulations! You have done it. You started with your fingers resting on the home row, learning f and j, and now you have typed your way through one thousand five hundred and thirty lessons. You have practised every key, every word, every sentence, and every line of code. You have earned your place in the TypeMaster Hall of Fame. You are not just fast — you are precise, disciplined, and unstoppable. The world types at about forty words per minute. You are in a different league entirely. Take a moment to appreciate how far you have come. Now go out there and show the world what a true TypeMaster looks like.',
    85,
    'You made it to the very end. Type this to claim your prize.'
  );

  window.LESSONS_DATA = lessons;
})();
