/* =========================================================
   DONNÉES — issues directement des cours TI616
   ========================================================= */

const MODULES = [
  {
    id: 'm1',
    num: '01',
    title: 'Introduction à l\'informatique verte',
    color: 'forest',
    subtitle: 'Le numérique pèse autant que l\'aviation civile. Comprendre pourquoi.',
    sections: [
      {
        heading: 'Contexte & enjeux',
        points: [
          { k: 'Part mondiale', v: 'Le numérique représente <strong>3-4% des émissions mondiales de GES</strong>, soit autant que l\'aviation civile (~2.5%). Et la croissance est plus rapide que la plupart des autres secteurs.' },
          { k: 'Idée reçue', v: 'Le numérique n\'est pas immatériel : extraction, fabrication, transport, utilisation, fin de vie — tout le cycle compte.' },
          { k: 'Ordres de grandeur', v: 'Streaming HD : <strong>~400g CO₂e/h</strong>. Streaming audio : <strong>~10g/h</strong>. Email avec PJ : <strong>5-50g</strong>.' },
        ]
      },
      {
        heading: 'Infrastructure & datacenter',
        points: [
          { k: 'PUE (Power Usage Effectiveness)', v: '<code>PUE = Énergie totale / Énergie IT</code>. Idéal : 1.0. Excellent : 1.2-1.4. Refroidissement = jusqu\'à 40% de la conso totale.' },
          { k: 'Mix énergétique', v: 'France ≈ <strong>50g CO₂/kWh</strong> (nucléaire). Allemagne ≈ <strong>400g CO₂/kWh</strong> (charbon). La localisation change tout.' },
          { k: 'Mythe du cloud propre', v: 'Mutualisation ≠ neutralité. L\'effet volume (facilité d\'accès) augmente l\'impact global malgré l\'efficacité individuelle.' },
        ]
      },
      {
        heading: 'Concepts fondamentaux',
        points: [
          { k: 'Green IT', v: 'Réduire l\'impact <em>du</em> numérique lui-même. Trois piliers : <strong>sobriété matérielle</strong>, <strong>sobriété logicielle</strong>, <strong>éco-conception</strong>. Vision : « faire plus avec moins ».' },
          { k: 'IT for Green', v: 'Utiliser le numérique <em>pour</em> aider d\'autres secteurs (industrie, bâtiment, transport, énergie). Smart grids, maintenance prédictive, optimisation logistique.' },
          { k: 'Effet rebond direct', v: 'L\'efficacité gagnée est annulée par une augmentation de l\'usage. Plus la voiture consomme peu, plus on roule.' },
          { k: 'Effet rebond indirect', v: 'Les économies réalisées sont réinvesties dans d\'autres consommations polluantes. Économies de chauffage → voyage en avion.' },
        ]
      },
      {
        heading: 'Calcul de l\'empreinte carbone',
        points: [
          { k: 'Empreinte carbone (kgCO₂e)', v: 'Quantité totale de GES émise directement ou indirectement. Le « e » signifie « équivalent » (méthane, N₂O converti en CO₂).' },
          { k: 'ACV — Analyse de Cycle de Vie', v: 'Évaluation des émissions sur tout le cycle : extraction, fabrication, transport, utilisation, fin de vie.' },
          { k: 'Formule datacenter', v: '<code>Émissions = Conso IT × PUE × Facteur (kg/kWh)</code>. Ex : 1M kWh × 1.5 × 0.05 = 75t CO₂e/an. Améliorer le PUE de 1.5 à 1.2 = -20% d\'émissions.' },
        ]
      },
    ]
  },
  {
    id: 'm2',
    num: '02',
    title: 'Panorama du numérique responsable',
    color: 'forest',
    subtitle: 'Trois familles à ne pas confondre : Green IT, Human IT, RSE.',
    sections: [
      {
        heading: 'Trois grandes familles',
        points: [
          { k: 'Green IT', v: 'Impact <strong>environnemental</strong> du numérique. Inclut IT for Green (le numérique au service d\'autres secteurs).' },
          { k: 'Human IT', v: 'Numérique conçu pour respecter les <strong>humains</strong>. Inclut IT for Human (numérique pour améliorer les conditions humaines).' },
          { k: 'RSE', v: '<strong>Responsabilité Sociétale des Entreprises</strong>. Cadre organisationnel et systémique. Norme ISO 26000.' },
          { k: 'Logique', v: 'Les trois familles sont <strong>complémentaires et interdépendantes</strong>. Approche multidimensionnelle indispensable (technique, social, économique, environnemental).' },
        ]
      },
      {
        heading: 'Périmètres du Green IT',
        points: [
          { k: 'Niveau matériel', v: 'Allonger la durée de vie, lutter contre l\'obsolescence, recyclabilité, réemploi, reconditionnement.' },
          { k: 'Niveau logiciel', v: 'Sobriété (code optimisé, fonctionnalités essentielles), performance utile, low-tech numérique.' },
          { k: 'Niveau architecture', v: 'Mutualisation raisonnée (cloud, virtualisation), éviter le surdimensionnement, edge computing.' },
        ]
      },
      {
        heading: 'Accessibilité & inclusion',
        points: [
          { k: 'Accessibilité numérique', v: 'Conformité aux standards (<strong>RGAA, WCAG</strong>). 15% de la population mondiale concernée par un handicap.' },
          { k: 'Double bénéfice', v: 'Une interface accessible est <strong>souvent plus légère</strong> (moins d\'effets, structure HTML claire), donc plus éco-conçue. Social et environnemental sont liés.' },
          { k: 'Compatibilité matériel ancien', v: 'Un logiciel accessible fonctionne sur du matériel varié, évitant l\'obsolescence forcée.' },
        ]
      },
      {
        heading: 'RSE & métriques',
        points: [
          { k: 'Trois piliers RSE', v: '<strong>Environnement</strong> (empreinte écologique, économie circulaire), <strong>Social</strong> (conditions de travail, diversité), <strong>Gouvernance</strong> (éthique, transparence).' },
          { k: 'Empreinte IT moyenne', v: '<strong>150-300 kg CO₂e</strong> par employé et par an.' },
          { k: 'Renouvellement matériel', v: 'Durée de vie moyenne des postes : <strong>3-4 ans</strong>. Un taux élevé indique une obsolescence rapide.' },
          { k: 'Conformité RGAA (2023)', v: 'Seulement <strong>25%</strong> des services numériques conformes.' },
          { k: 'Greenwashing', v: 'Communiquer une image écologique sans actions réelles. Esprit critique requis face au « solutionnisme numérique ».' },
        ]
      }
    ]
  },
  {
    id: 'm3',
    num: '03',
    title: 'Code efficace & énergie',
    color: 'forest',
    subtitle: 'Le développeur a 70% de responsabilité directe sur la conso énergétique d\'un logiciel.',
    sections: [
      {
        heading: 'Pourquoi le code est central',
        points: [
          { k: 'Choix algorithmiques', v: 'Un mauvais algorithme peut multiplier la conso par 10, 100, 1000. <strong>Impact très élevé</strong>.' },
          { k: 'Structures de données', v: 'Tableau, liste chaînée, table de hachage : la localité mémoire et le nombre d\'accès changent tout.' },
          { k: 'Architectures', v: 'Monolithique vs microservices, sync vs async — chaque décision a des conséquences énergétiques durables.' },
          { k: 'Responsabilité directe', v: 'Les choix techniques pèsent ~<strong>70%</strong> sur la conso d\'un logiciel.' },
        ]
      },
      {
        heading: 'Construction de logiciels durables',
        points: [
          { k: 'Comparatif langages (même algo)', v: '<strong>C : 3% d\'énergie</strong> (réf.) — <strong>Java : 20%</strong> — <strong>Python : 100%</strong>. Le choix du langage peut faire varier la conso d\'un facteur ×30 ou plus.' },
          { k: 'Trade-off', v: 'Productivité vs efficacité énergétique. Le choix dépend du contexte. Python pour prototyper, C pour les hot paths critiques.' },
          { k: 'Dette technique = dette énergétique', v: 'Code complexe → plus d\'instructions → +40% conso. Maintenance reportée = surconsommation accumulée. Solution : refactoring régulier.' },
        ]
      },
      {
        heading: 'Pratiques de codage',
        points: [
          { k: 'Complexité temporelle', v: 'Notation O(n), O(log n), O(n²)... Pour n = 10⁶ : <strong>O(n²) = 10¹² opérations</strong> vs <strong>O(n log n) = 2×10⁷</strong>. La différence est gigantesque.' },
          { k: 'Recherche : linéaire vs dichotomique', v: 'Linéaire O(n) = n/2 comparaisons en moyenne. Dichotomique O(log n) = log₂(n). Pour n=10⁶ : <strong>×25 000 d\'opérations en moins</strong>.' },
          { k: 'Complexité spatiale', v: 'Quantité de RAM consommée. La RAM doit être alimentée et rafraîchie en permanence.' },
          { k: 'Optimisation réseau', v: 'Éviter les <code>polling</code> fréquents et les appels redondants. Préférer push (WebSockets, webhooks). Compresser (gzip, brotli). HTTP/2 ou HTTP/3. Caching client. CDN. GraphQL pour ne récupérer que les champs nécessaires.' },
        ]
      },
      {
        heading: 'Bonnes pratiques & principes',
        points: [
          { k: 'KISS', v: 'Keep It Simple. Le code simple est plus facile à comprendre, maintenir, optimiser.' },
          { k: 'DRY', v: 'Don\'t Repeat Yourself. Factoriser pour réduire taille et complexité.' },
          { k: 'YAGNI', v: 'You Aren\'t Gonna Need It. Ne pas coder ce dont on n\'a pas besoin maintenant.' },
          { k: 'Mesurer avant d\'optimiser', v: 'Identifier les vrais goulots d\'étranglement avec du <strong>profiling</strong>. Le compilateur optimise déjà beaucoup. Un gain de 2% ne justifie pas une perte de lisibilité.' },
          { k: 'Trois piliers du DD en IT', v: '<strong>Environnemental</strong> (CO₂, ressources), <strong>Social</strong> (accessibilité, éthique algorithmique), <strong>Économique</strong> (viabilité, réduction des coûts).' },
        ]
      }
    ]
  },
  {
    id: 'm4',
    num: '04',
    title: 'Éco-conception en informatique',
    color: 'forest',
    subtitle: 'Penser l\'environnement dès la conception, pas après-coup.',
    sections: [
      {
        heading: 'Définition & périmètre',
        points: [
          { k: 'Éco-conception', v: 'Approche <strong>globale et systémique</strong>, intégrant l\'environnement <strong>dès la conception</strong>. Gains structurels.' },
          { k: 'Optimisation ≠ Éco-conception', v: 'L\'optimisation est <strong>locale et postérieure</strong> au développement (gains marginaux). L\'éco-conception est <strong>structurelle et amont</strong>.' },
          { k: 'Quatre niveaux d\'application', v: '<strong>Logiciels</strong> (algos, code, mémoire), <strong>Architectures</strong> (microservices, cache, scalabilité), <strong>Infrastructures</strong> (datacenter vert, virtualisation), <strong>Usages</strong> (UX frugale, sobriété fonctionnelle).' },
        ]
      },
      {
        heading: 'Principes fondamentaux',
        points: [
          { k: 'Sobriété', v: 'Réduire les fonctionnalités inutiles, éviter la sur-qualité, concevoir pour le besoin réel. <strong>-40% de consommation énergétique</strong> possible.' },
          { k: 'Feature creep', v: 'Ajout continu de fonctionnalités superflues qui alourdit le code. À combattre activement.' },
          { k: 'Transparence', v: 'Algorithmes compréhensibles, paramètres configurables, choix explicitables. Ex : « cette vidéo consomme 150 Mo », « mode éco -40% ».' },
          { k: 'Accessibilité', v: 'Inclusion + durabilité. Compatibilité avec matériel ancien, conformité WCAG, lecteurs d\'écran, contrastes.' },
        ]
      },
      {
        heading: 'Mises en garde',
        points: [
          { k: 'Éco-conception ≠ austérité', v: 'Il ne s\'agit pas de dégrader l\'expérience. Vision : <strong>« faire mieux avec moins, pas faire moins bien »</strong>. Qualité + performance utile + UX élégante.' },
          { k: 'Trois travers à éviter', v: '<strong>Frontend lourd</strong> (frameworks pesants, bundles énormes), <strong>Backend surdimensionné</strong> (instances trop puissantes, requêtes SQL non optimisées), <strong>Appels multiples</strong> (N+1 queries, API chatty).' },
          { k: 'Normes', v: 'ISO 14062 (intégration env. dans la conception), RGESN (Référentiel Général d\'Écoconception de Services Numériques).' },
        ]
      }
    ]
  },
  {
    id: 'm5',
    num: '05',
    title: 'Green Web — Éco-conception Web',
    color: 'forest',
    subtitle: 'Coder efficient = réduire le travail inutile (octets, CPU, requêtes).',
    sections: [
      {
        heading: 'Le Web est physique',
        points: [
          { k: 'Chaîne technique', v: '<strong>Client</strong> (CPU/GPU, écran, RAM) → <strong>Réseau</strong> (radio, fibre, routeurs) → <strong>Serveur</strong> (CPU, stockage) → <strong>Datacenter</strong> (PUE, cooling). Chaque maillon consomme.' },
          { k: 'Levier majeur côté client', v: 'L\'optimisation côté client (CPU/JS/images) compte beaucoup, car les terminaux pèsent lourd dans le bilan total.' },
          { k: 'Coût caché du JS', v: 'Le JS exécuté coûte souvent <strong>plus en CPU (mobile) qu\'en KB</strong>. Tous les kilo-octets ne se valent pas.' },
        ]
      },
      {
        heading: 'Mesurer (Lab + RUM)',
        points: [
          { k: 'Core Web Vitals', v: '<strong>LCP</strong> (Largest Contentful Paint, vitesse perçue), <strong>INP</strong> (Interaction to Next Paint, réactivité), <strong>CLS</strong> (Cumulative Layout Shift, stabilité). Plus <strong>TTFB</strong> (latence serveur) et long tasks.' },
          { k: 'Lab vs RUM', v: '<strong>Lab</strong> (Lighthouse, WebPageTest) : reproductible, en CI. <strong>RUM</strong> (Real User Monitoring) : conditions réelles. La règle : Lab empêche la régression, RUM pilote la priorité réelle.' },
          { k: 'Toolchain', v: 'Lighthouse, WebPageTest, Chrome DevTools (Performance, Coverage, Memory), Bundle Analyzer (poids par dépendance).' },
          { k: 'Métriques observables', v: '<strong>Réseau</strong> : KB transférés, nb requêtes, cache hit ratio. <strong>CPU client</strong> : long tasks, TBT/INP, JS parse/execute. <strong>Mémoire</strong> : heap JS, GC. <strong>Serveur</strong> : TTFB, egress, cache/CDN.' },
        ]
      },
      {
        heading: 'Optimiser (la boîte à outils)',
        points: [
          { k: 'Images (1er contributeur en octets)', v: '<strong>AVIF/WebP + fallback</strong>, <code>srcset</code>, <code>width/height</code> (réduit CLS), <code>loading="lazy"</code>. Pattern <code>&lt;picture&gt;</code> avec sources multiples.' },
          { k: 'JavaScript (1er contributeur CPU)', v: 'Code splitting, tree-shaking, supprimer dépendances inutiles, profiler les long tasks. Pour un site vitrine : <strong>JS initial ≤ 50KB gzip</strong>.' },
          { k: 'Cache + compression', v: 'Headers <code>Cache-Control: public, max-age=31536000, immutable</code> sur assets fingerprintés. <strong>gzip / brotli</strong> sur HTML, CSS, JS, JSON, SVG. ROI éco + perf énorme.' },
          { k: 'CDN & edge', v: 'Servir depuis un cache CDN = moins de CPU serveur + latence + egress. Question clé : <strong>quel % de requêtes peut être servi sans calcul (cache hit) ?</strong>' },
          { k: 'Fonts', v: 'Peu de fichiers mais gros impact (poids + rendu). Limiter les variantes, self-host, <code>font-display: swap</code>.' },
          { k: 'Tiers (analytics, ads)', v: 'Ajoute poids + requêtes + CPU + risques de confidentialité. À auditer agressivement. Anti-pattern : optimiser à 1% alors que 2 scripts tiers ajoutent 600KB.' },
        ]
      },
      {
        heading: 'Gouvernance & NFR',
        points: [
          { k: 'Budgets en CI/CD', v: 'KB max, requêtes max, JS max, fonts max, tiers max. À mesurer et à <strong>faire échouer le build</strong> si dépassé.' },
          { k: 'NFR (exigences non-fonctionnelles)', v: 'Ex : « la page d\'accueil doit charger en < Xs sur mobile milieu de gamme, JS initial < YKB gzip, et 0 tracking sans consentement. »' },
          { k: 'Baseline + progressive enhancement', v: 'Définir un device/réseau cible bas de gamme. HTML/CSS robustes, JS = enhancement optionnel. Limiter polyfills globaux.' },
          { k: 'Recommandations par projet', v: '<strong>Vitrine</strong> : SSG, 0 JS inutile, JS init ≤ 50KB. <strong>E-commerce</strong> : images optimisées, RUM CWV, SSR+cache. <strong>App complexe</strong> : route initiale ≤ 200KB JS gzip.' },
          { k: 'Dark mode', v: 'Gain conditionnel surtout sur <strong>OLED/AMOLED</strong>. Respecter <code>prefers-color-scheme</code>. Ce n\'est PAS un substitut aux optimisations structurelles.' },
          { k: 'Obsolescence accélérée', v: 'UI lourde → CPU élevé → chauffe + batterie → expérience mauvaise. Un « site moderne » peut rendre inutilisables des appareils encore fonctionnels. <strong>Compatibilité + sobriété = inclusion + durée de vie matériel</strong>.' },
        ]
      }
    ]
  }
];

/* =========================================================
   FLASHCARDS — concepts essentiels à retenir
   ========================================================= */
const FLASHCARDS = [
  // M1
  { mod:'m1', tag:'Module 1', term:'Green IT', def:'Ensemble des pratiques visant à réduire l\'impact environnemental du numérique lui-même. Trois piliers : sobriété matérielle, sobriété logicielle, éco-conception.' },
  { mod:'m1', tag:'Module 1', term:'IT for Green', def:'Utilisation du numérique comme levier pour réduire l\'impact environnemental d\'autres secteurs (industrie, bâtiment, transport, énergie).' },
  { mod:'m1', tag:'Module 1', term:'Effet rebond direct', def:'L\'efficacité technique gagnée est annulée par une augmentation de l\'usage. Plus c\'est efficient, plus on consomme.' },
  { mod:'m1', tag:'Module 1', term:'Effet rebond indirect', def:'Les économies réalisées grâce à l\'efficacité sont réinvesties dans d\'autres consommations, parfois plus polluantes.' },
  { mod:'m1', tag:'Module 1', term:'Empreinte carbone (kgCO₂e)', def:'Quantité totale de gaz à effet de serre émise directement ou indirectement. Le « e » signifie « équivalent CO₂ ».' },
  { mod:'m1', tag:'Module 1', term:'ACV — Analyse de Cycle de Vie', def:'Méthode d\'évaluation des émissions sur tout le cycle : extraction, fabrication, transport, utilisation, fin de vie.' },
  { mod:'m1', tag:'Module 1', term:'PUE', def:'Power Usage Effectiveness = Énergie totale / Énergie IT. Idéal = 1.0. Excellent = 1.2-1.4. Moyen = 1.5-2.0.' },
  { mod:'m1', tag:'Module 1', term:'3-4%', def:'Part du numérique dans les émissions mondiales de GES. Soit autant que l\'aviation civile (~2.5%).' },
  { mod:'m1', tag:'Module 1', term:'Mythe du cloud propre', def:'Mutualisation ≠ neutralité. Les data centers consomment de l\'énergie. L\'effet volume augmente l\'impact global.' },

  // M2
  { mod:'m2', tag:'Module 2', term:'Trois grandes familles', def:'Green IT (environnemental), Human IT (social), RSE (organisationnel). Complémentaires et interdépendantes.' },
  { mod:'m2', tag:'Module 2', term:'Human IT', def:'Numérique conçu pour respecter les humains. Inclut l\'IT for Human (numérique au service des conditions humaines).' },
  { mod:'m2', tag:'Module 2', term:'RSE', def:'Responsabilité Sociétale des Entreprises. Cadre organisationnel intégrant Environnement, Social, Gouvernance. Norme ISO 26000.' },
  { mod:'m2', tag:'Module 2', term:'RGAA / WCAG', def:'Standards d\'accessibilité numérique. RGAA (France), WCAG (international). Visent l\'inclusion des personnes en situation de handicap (~15% population).' },
  { mod:'m2', tag:'Module 2', term:'Greenwashing', def:'Communiquer une image écologique sans actions réelles. Exige un esprit critique face au « solutionnisme numérique ».' },
  { mod:'m2', tag:'Module 2', term:'Empreinte IT moyenne', def:'150-300 kg CO₂e par employé et par an. Métrique RSE clé pour le reporting.' },

  // M3
  { mod:'m3', tag:'Module 3', term:'Complexité temporelle', def:'Nombre d\'opérations en fonction de la taille n. Notation O(n), O(log n), O(n²). Impact direct sur le CPU et donc l\'énergie.' },
  { mod:'m3', tag:'Module 3', term:'O(n²) vs O(n log n)', def:'Pour n = 10⁶ : 10¹² ops vs 2×10⁷ ops. Différence colossale en énergie consommée.' },
  { mod:'m3', tag:'Module 3', term:'Recherche dichotomique', def:'Algo O(log n) sur données triées. Pour n=10⁶ : ~20 comparaisons, vs ~500 000 en linéaire. ×25 000 plus efficace.' },
  { mod:'m3', tag:'Module 3', term:'Comparatif langages', def:'Python (référence 100%) vs Java (20%) vs C (3%). Facteur ×30+ en énergie pour le même algorithme.' },
  { mod:'m3', tag:'Module 3', term:'Dette technique', def:'Code complexe / mal structuré qui exécute plus d\'instructions que nécessaire. Dette technique = dette énergétique. +40% surconso.' },
  { mod:'m3', tag:'Module 3', term:'KISS', def:'Keep It Simple. Le code simple est plus facile à comprendre, maintenir et optimiser. Évite la complexité inutile.' },
  { mod:'m3', tag:'Module 3', term:'DRY', def:'Don\'t Repeat Yourself. Éviter la duplication, factoriser pour réduire la taille et la complexité.' },
  { mod:'m3', tag:'Module 3', term:'YAGNI', def:'You Aren\'t Gonna Need It. Ne pas coder par anticipation des fonctionnalités hypothétiques.' },
  { mod:'m3', tag:'Module 3', term:'Polling vs événementiel', def:'Polling = serveur sollicité en permanence (gourmand). Événementiel (WebSockets, webhooks) = push uniquement quand nécessaire.' },

  // M4
  { mod:'m4', tag:'Module 4', term:'Éco-conception', def:'Approche globale et systémique intégrant l\'environnement dès la conception. À distinguer de l\'optimisation (locale, postérieure).' },
  { mod:'m4', tag:'Module 4', term:'Sobriété', def:'Réduire les fonctionnalités inutiles, éviter la sur-qualité. Concevoir pour le besoin réel. Jusqu\'à -40% de conso.' },
  { mod:'m4', tag:'Module 4', term:'Feature creep', def:'Ajout continu de fonctionnalités superflues qui alourdit le code et augmente la consommation de ressources.' },
  { mod:'m4', tag:'Module 4', term:'Quatre niveaux d\'éco-conception', def:'Logiciels, Architectures, Infrastructures, Usages. L\'éco-conception logicielle peut avoir un impact majeur sans changer le hardware.' },
  { mod:'m4', tag:'Module 4', term:'Éco-conception ≠ austérité', def:'Pas une régression. Vision : « faire mieux avec moins, pas faire moins bien ». Qualité + performance utile + UX élégante.' },

  // M5
  { mod:'m5', tag:'Green Web', term:'LCP', def:'Largest Contentful Paint. Vitesse de chargement perçue (apparition du plus gros élément visible).' },
  { mod:'m5', tag:'Green Web', term:'INP', def:'Interaction to Next Paint. Réactivité de la page aux interactions utilisateur (clics, taps).' },
  { mod:'m5', tag:'Green Web', term:'CLS', def:'Cumulative Layout Shift. Stabilité visuelle (les éléments ne sautent pas pendant le chargement).' },
  { mod:'m5', tag:'Green Web', term:'TTFB', def:'Time To First Byte. Délai entre la requête et le premier octet reçu. Mesure la latence serveur.' },
  { mod:'m5', tag:'Green Web', term:'Lab vs RUM', def:'Lab = mesures reproductibles (Lighthouse, en CI). RUM = Real User Monitoring (vraies conditions). Lab empêche la régression, RUM pilote la priorité.' },
  { mod:'m5', tag:'Green Web', term:'Budget de performance', def:'Limites mesurables sur poids, requêtes, JS, fonts, tiers. À faire respecter en CI/CD : le build échoue si dépassé.' },
  { mod:'m5', tag:'Green Web', term:'NFR', def:'Non-Functional Requirements. Exigences non-fonctionnelles. Ex : « LCP < 2.5s sur mobile milieu de gamme, JS initial < 50KB gzip ».' },
  { mod:'m5', tag:'Green Web', term:'AVIF / WebP', def:'Formats d\'image modernes, beaucoup plus légers que JPEG/PNG. AVIF > WebP > JPEG en compression. Toujours avec fallback.' },
  { mod:'m5', tag:'Green Web', term:'Cache immutable', def:'Header Cache-Control: public, max-age=31536000, immutable. Servir un asset une seule fois, le navigateur le garde toujours.' },
  { mod:'m5', tag:'Green Web', term:'Compression gzip / brotli', def:'Compression côté serveur des fichiers texte (HTML, CSS, JS, JSON, SVG). ROI énorme en perf et éco.' },
  { mod:'m5', tag:'Green Web', term:'CDN', def:'Content Delivery Network. Rapproche le contenu des utilisateurs. Réduit latence + CPU serveur + egress.' },
  { mod:'m5', tag:'Green Web', term:'Code splitting', def:'Découper le bundle JS en morceaux chargés à la demande. Réduit le JS initial, donc le coût CPU mobile.' },
  { mod:'m5', tag:'Green Web', term:'Scripts tiers', def:'Analytics, ads, widgets. Ajoutent poids + requêtes + CPU + risques RGPD. À auditer agressivement.' },
  { mod:'m5', tag:'Green Web', term:'Dark mode (gain réel)', def:'Économise vraiment surtout sur écrans OLED/AMOLED. Pas un substitut aux optimisations structurelles (poids, JS, cache).' },
  { mod:'m5', tag:'Green Web', term:'Obsolescence accélérée', def:'Une UI lourde → CPU élevé → chauffe → batterie → terminal jeté. Sobriété + compatibilité = durée de vie matériel.' },
];

/* =========================================================
   QUIZ — questions à choix multiples
   ========================================================= */
const QUIZ_POOL = [
  {
    q: "Quelle est la part du numérique dans les émissions mondiales de gaz à effet de serre ?",
    answers: ["1-2%", "3-4%", "8-10%", "15-20%"],
    correct: 1,
    explain: "Le numérique pèse 3 à 4% des émissions mondiales, soit autant que l'aviation civile (~2,5%). Et la croissance est plus rapide que la plupart des autres secteurs."
  },
  {
    q: "Que signifie le concept d'IT for Green ?",
    answers: [
      "Réduire l'impact environnemental du numérique lui-même",
      "Utiliser le numérique pour réduire l'impact d'autres secteurs",
      "Recycler les déchets électroniques",
      "Auditer les datacenters"
    ],
    correct: 1,
    explain: "IT for Green = utiliser le numérique comme levier pour aider d'autres secteurs (industrie, bâtiment, transport...). Le Green IT, à l'inverse, vise à réduire l'impact du numérique lui-même."
  },
  {
    q: "Que mesure le PUE (Power Usage Effectiveness) ?",
    answers: [
      "L'efficacité énergétique d'un CPU",
      "Énergie totale / Énergie IT",
      "Énergie IT / Énergie totale",
      "La durée de vie d'un serveur"
    ],
    correct: 1,
    explain: "PUE = Énergie totale du datacenter / Énergie consommée par l'IT seul. Idéal = 1.0 (toute l'énergie va à l'IT, aucune perte). Excellent : 1.2-1.4."
  },
  {
    q: "Pour un même algorithme, quel est l'écart énergétique typique entre Python et C ?",
    answers: ["×2", "×10", "×30 ou plus", "×100 ou plus"],
    correct: 2,
    explain: "Selon les benchmarks du cours : C consomme ~3% de l'énergie de Python (référence 100%). Soit un facteur ×30+ pour le même algo."
  },
  {
    q: "Pour n = 10⁶ éléments, combien d'opérations fait un algorithme en O(n²) ?",
    answers: ["~10⁶", "~10⁸", "~10¹⁰", "~10¹²"],
    correct: 3,
    explain: "O(n²) avec n = 10⁶ → 10¹² opérations. Comparé à O(n log n) qui ferait 2×10⁷. Différence vertigineuse en énergie."
  },
  {
    q: "Quelle est la différence majeure entre l'optimisation et l'éco-conception ?",
    answers: [
      "L'éco-conception coûte plus cher",
      "L'optimisation est postérieure et locale, l'éco-conception est amont et systémique",
      "L'éco-conception ne concerne que le hardware",
      "Il n'y a pas de différence"
    ],
    correct: 1,
    explain: "L'optimisation intervient après le développement et apporte des gains marginaux. L'éco-conception est globale, dès la conception, et apporte des gains structurels."
  },
  {
    q: "Que désigne LCP dans les Core Web Vitals ?",
    answers: [
      "Long CPU Process",
      "Largest Contentful Paint",
      "Latency Cumulative Page",
      "Local Cache Performance"
    ],
    correct: 1,
    explain: "LCP = Largest Contentful Paint. Mesure la vitesse de chargement perçue (le moment où le plus gros élément visible est rendu)."
  },
  {
    q: "Un site web utilise des images JPEG non optimisées et un bundle JS de 800KB. Quelle est la priorité ?",
    answers: [
      "Micro-optimiser les boucles JS",
      "Migrer en AVIF/WebP et alléger le JS (priorité par ordre de grandeur)",
      "Ajouter du dark mode",
      "Changer le langage côté serveur"
    ],
    correct: 1,
    explain: "Anti-pattern classique : optimiser à 1% alors qu'on a des centaines de KB en images et JS. Toujours prioriser par ordre de grandeur : images, JS, cache, tiers."
  },
  {
    q: "Quel est l'ordre de grandeur des émissions CO₂ pour 1 heure de streaming vidéo HD ?",
    answers: ["~10g", "~50g", "~400g", "~1kg"],
    correct: 2,
    explain: "Le streaming vidéo HD émet ~400g CO₂e/heure (data center + réseau + terminal). Le streaming audio est beaucoup plus léger (~10g/h)."
  },
  {
    q: "Quel est l'effet rebond indirect du télétravail ?",
    answers: [
      "Les bureaux deviennent plus efficaces",
      "On consomme moins d'énergie",
      "Les économies de transport sont compensées par équipement perso, chauffage individuel, nouveaux usages",
      "Les serveurs distants chauffent plus"
    ],
    correct: 2,
    explain: "Le télétravail économise des déplacements et bureaux, mais : équipement informatique à domicile, chauffage individuel, nouveaux usages numériques, déplacements diffusés. Vert sous certaines conditions seulement."
  },
  {
    q: "Quelle technique HTML permet de charger une image seulement quand elle apparaît à l'écran ?",
    answers: [
      'L\'attribut <code>defer</code>',
      'L\'attribut <code>loading="lazy"</code>',
      'L\'attribut <code>async</code>',
      'L\'attribut <code>preload</code>'
    ],
    correct: 1,
    explain: "loading=\"lazy\" sur les balises img permet le chargement différé (lazy loading natif). Réduit les transferts inutiles."
  },
  {
    q: "Que signifie le principe KISS en programmation ?",
    answers: [
      "Keep It Smart and Stylish",
      "Keep Internal Systems Secure",
      "Keep It Simple",
      "Keep Iterating Smartly"
    ],
    correct: 2,
    explain: "KISS = Keep It Simple. Le code simple est plus facile à comprendre, maintenir et optimiser. Évite la complexité inutile."
  },
  {
    q: "Quel est le facteur d'émission du mix électrique français vs allemand (approximatif) ?",
    answers: [
      "France 50g/kWh, Allemagne 100g/kWh",
      "France 50g/kWh, Allemagne 400g/kWh",
      "France 200g/kWh, Allemagne 400g/kWh",
      "France 400g/kWh, Allemagne 50g/kWh"
    ],
    correct: 1,
    explain: "France ~50g CO₂/kWh (nucléaire dominant). Allemagne ~400g CO₂/kWh (charbon plus présent). Localiser un datacenter en France a donc un impact carbone bien moindre."
  },
  {
    q: "Que regroupent les trois piliers du Green IT ?",
    answers: [
      "Hardware, software, réseau",
      "Sobriété matérielle, sobriété logicielle, éco-conception",
      "Cloud, edge, datacenter",
      "Réduire, réutiliser, recycler"
    ],
    correct: 1,
    explain: "Les 3 piliers du Green IT sont : sobriété matérielle (moins de hardware), sobriété logicielle (code optimisé), éco-conception (penser éco dès la conception)."
  },
  {
    q: "Lab et RUM sont deux approches complémentaires de mesure web. Laquelle pour quoi ?",
    answers: [
      "Lab = production, RUM = développement",
      "Lab = en CI pour empêcher la régression, RUM = en prod pour piloter la priorité réelle",
      "Lab = côté serveur, RUM = côté client",
      "Lab = mobile, RUM = desktop"
    ],
    correct: 1,
    explain: "Lab (Lighthouse, WebPageTest) = reproductible, intégré au CI. RUM (Real User Monitoring) = vraies conditions terrain. Stratégie efficace = combiner les deux."
  },
  {
    q: "Quel pourcentage approximatif de la conso d'un datacenter peut être lié au refroidissement ?",
    answers: ["~5%", "~15%", "~25%", "jusqu'à ~40%"],
    correct: 3,
    explain: "Le refroidissement (climatisation, ventilation, parfois refroidissement liquide) peut représenter jusqu'à 40% de la consommation totale d'un datacenter."
  },
  {
    q: "Quelle est la durée de vie moyenne d'un poste informatique en entreprise ?",
    answers: ["1-2 ans", "3-4 ans", "5-7 ans", "8-10 ans"],
    correct: 1,
    explain: "3-4 ans en moyenne. C'est court : la fabrication étant l'étape la plus impactante, allonger cette durée est un levier majeur du Green IT."
  },
  {
    q: "À quoi sert une recherche dichotomique par rapport à une recherche linéaire ?",
    answers: [
      "Aucun gain réel",
      "×10 plus efficace",
      "O(log n) au lieu de O(n) — pour n=10⁶, ~25 000× moins d'opérations",
      "Pas applicable au numérique durable"
    ],
    correct: 2,
    explain: "Recherche linéaire : O(n) = ~n/2 comparaisons. Recherche dichotomique (sur données triées) : O(log n) = log₂(n). Pour n=10⁶ : ~500 000 vs ~20. Soit ×25 000."
  },
  {
    q: "Quel est l'objectif typique de JS initial pour un site vitrine bien éco-conçu ?",
    answers: [
      "≤ 50 KB gzip",
      "≤ 500 KB gzip",
      "≤ 2 MB gzip",
      "Aucune limite"
    ],
    correct: 0,
    explain: "Pour un site vitrine, on vise ≤ 50 KB gzip de JS initial. Idéalement même 0 JS si SSG/HTML pur. Pour une app complexe, on monte à ≤ 200 KB gzip pour la route initiale."
  },
  {
    q: "Pourquoi l'accessibilité web est-elle souvent alignée avec l'éco-conception ?",
    answers: [
      "Parce que les standards d'accessibilité l'imposent",
      "Une interface accessible est souvent plus légère et structurée, donc plus éco-conçue",
      "Parce qu'elle utilise moins de couleurs",
      "Aucun lien réel"
    ],
    correct: 1,
    explain: "Une interface accessible privilégie une structure HTML claire, des contrastes forts, peu d'effets superflus, une compatibilité avec du matériel ancien. Tout cela réduit le poids et la complexité."
  }
];
