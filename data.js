/* =========================================================
   DONNÉES DU MENU
   Le champ "image" correspond au NOM DE FICHIER (sans extension)
   à chercher dans le dossier Google Drive configuré dans config.js.
   ========================================================= */

const CATEGORIES = [
  { id: "menus",    label: "Menus",           icon: "🍔" },
  { id: "burgers",  label: "Burgers seuls",    icon: "🍔" },
  { id: "poulet",   label: "Poulet",           icon: "🍗" },
  { id: "snacks",   label: "Snacks & Salades", icon: "🥗" },
  { id: "desserts", label: "Desserts",         icon: "🍦" },
  { id: "boissons", label: "Boissons",         icon: "🥤" },
  { id: "kids",     label: "Menu Enfant",      icon: "🎁" },
];

// Suppléments communs, réutilisés par plusieurs produits
const EXTRAS_BURGER = [
  { id: "bacon",        label: "Bacon",             price: 1.00 },
  { id: "fromage",      label: "Cheddar suppl.",    price: 0.80 },
  { id: "oignons-frits", label: "Oignons frits",    price: 0.90 },
  { id: "sans-cornichon", label: "Sans cornichon",  price: 0 },
];

const TAILLES_BOISSON = [
  { id: "m", label: "Moyenne", priceDelta: 0 },
  { id: "l", label: "Grande",  priceDelta: 0.60 },
];

const PRODUCTS = [
  // ---- MENUS ----
  {
    id: "menu-big-mac", category: "menus", image: "big-mac",
    name: "Menu Big Mac",
    desc: "Le double burger emblématique, sauce Big Mac, cheddar, laitue, oignons, cornichons — accompagné d'une frite et d'une boisson.",
    price: 9.90,
    formule: true, tailleBoisson: true, extras: EXTRAS_BURGER,
  },
  {
    id: "menu-cheeseburger", category: "menus", image: "cheeseburger",
    name: "Menu Cheeseburger",
    desc: "Steak haché, cheddar fondant, oignons, cornichons, ketchup et moutarde — avec frite et boisson.",
    price: 7.50,
    formule: true, tailleBoisson: true, extras: EXTRAS_BURGER,
  },
  {
    id: "menu-mcchicken", category: "menus", image: "mcchicken",
    name: "Menu McChicken",
    desc: "Filet de poulet pané croustillant, laitue, mayonnaise — avec frite et boisson.",
    price: 8.50,
    formule: true, tailleBoisson: true, extras: EXTRAS_BURGER,
  },
  {
    id: "menu-royal-cheese", category: "menus", image: "royal-cheese",
    name: "Menu Royal Cheese",
    desc: "Steak haché pur bœuf, double cheddar, oignons, cornichons, ketchup, moutarde — avec frite et boisson.",
    price: 9.20,
    formule: true, tailleBoisson: true, extras: EXTRAS_BURGER,
  },

  // ---- BURGERS SEULS ----
  {
    id: "big-mac", category: "burgers", image: "big-mac",
    name: "Big Mac",
    desc: "Deux steaks hachés, sauce spéciale, cheddar, laitue, oignons, cornichons, pain sésame trois étages.",
    price: 5.90, extras: EXTRAS_BURGER,
  },
  {
    id: "cheeseburger", category: "burgers", image: "cheeseburger",
    name: "Cheeseburger",
    desc: "Steak haché, cheddar, oignons, cornichons, ketchup et moutarde.",
    price: 3.20, extras: EXTRAS_BURGER,
  },
  {
    id: "royal-cheese", category: "burgers", image: "royal-cheese",
    name: "Royal Cheese",
    desc: "Steak haché pur bœuf, double cheddar, oignons, cornichons.",
    price: 5.50, extras: EXTRAS_BURGER,
  },
  {
    id: "double-cheese", category: "burgers", image: "double-cheese",
    name: "Double Cheeseburger",
    desc: "Deux steaks hachés, double cheddar, oignons, cornichons.",
    price: 4.90, extras: EXTRAS_BURGER,
  },

  // ---- POULET ----
  {
    id: "mcchicken", category: "poulet", image: "mcchicken",
    name: "McChicken",
    desc: "Filet de poulet pané croustillant, laitue, mayonnaise, pain moelleux.",
    price: 4.50, extras: EXTRAS_BURGER,
  },
  {
    id: "chicken-mcnuggets-6", category: "poulet", image: "nuggets",
    name: "6 Chicken McNuggets",
    desc: "Six bouchées de poulet panées, servies avec la sauce de votre choix.",
    price: 4.60,
  },
  {
    id: "chicken-mcnuggets-9", category: "poulet", image: "nuggets",
    name: "9 Chicken McNuggets",
    desc: "Neuf bouchées de poulet panées, servies avec la sauce de votre choix.",
    price: 6.20,
  },

  // ---- SNACKS & SALADES ----
  {
    id: "frites", category: "snacks", image: "frites",
    name: "Frites",
    desc: "Nos frites croustillantes à l'extérieur, moelleuses à l'intérieur.",
    price: 2.50, tailleBoisson: true,
  },
  {
    id: "potatoes", category: "snacks", image: "potatoes",
    name: "Potatoes",
    desc: "Pommes de terre fondantes, croustillantes, légèrement épicées.",
    price: 2.90, tailleBoisson: true,
  },
  {
    id: "salade-cesar", category: "snacks", image: "salade",
    name: "Salade César",
    desc: "Salade, poulet croustillant, parmesan, croûtons et sauce César.",
    price: 5.90,
  },

  // ---- DESSERTS ----
  {
    id: "sundae-chocolat", category: "desserts", image: "sundae-chocolat",
    name: "Sundae Chocolat",
    desc: "Glace vanille onctueuse nappée de sauce chocolat.",
    price: 2.20,
  },
  {
    id: "mcflurry-oreo", category: "desserts", image: "mcflurry",
    name: "McFlurry Oreo",
    desc: "Glace vanille mélangée à des éclats de biscuits Oreo.",
    price: 3.90,
  },
  {
    id: "cookie", category: "desserts", image: "cookie",
    name: "Cookie pépites de chocolat",
    desc: "Cookie moelleux garni de pépites de chocolat.",
    price: 1.50,
  },

  // ---- BOISSONS ----
  {
    id: "coca-cola", category: "boissons", image: "coca-cola",
    name: "Coca-Cola",
    desc: "Coca-Cola bien frais.",
    price: 2.00, tailleBoisson: true,
  },
  {
    id: "fanta", category: "boissons", image: "fanta",
    name: "Fanta Orange",
    desc: "Fanta Orange bien frais.",
    price: 2.00, tailleBoisson: true,
  },
  {
    id: "eau-minerale", category: "boissons", image: "eau",
    name: "Eau minérale",
    desc: "Bouteille d'eau minérale.",
    price: 1.50,
  },
  {
    id: "cafe", category: "boissons", image: "cafe",
    name: "Café",
    desc: "Café fraîchement préparé.",
    price: 1.50, tailleBoisson: true,
  },

  // ---- MENU ENFANT ----
  {
    id: "happy-meal-cheeseburger", category: "kids", image: "happy-meal",
    name: "Menu Enfant Cheeseburger",
    desc: "Cheeseburger, petite frite, boisson et un jouet surprise.",
    price: 5.90,
  },
  {
    id: "happy-meal-nuggets", category: "kids", image: "happy-meal-nuggets",
    name: "Menu Enfant Nuggets",
    desc: "4 Chicken McNuggets, petite frite, boisson et un jouet surprise.",
    price: 5.90,
  },
];
