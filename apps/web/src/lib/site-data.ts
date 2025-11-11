export const eventDetails = {
  title: "Pizza Under the Trees",
  subtitle: "A night of wood fire, island flavor, and good vibes under the stars",
  date: "Sunday, November 9",
  location: "Pangea USVI",
  description:
    "Join us for an intimate pizza pop-up at Pangea USVI. Fresh 72-hour fermented dough, local ingredients, and the best island company — served straight from the fire.",
};

export const reservationStatus = {
  isOpen: false,
  reserved: 100,
  capacity: 100,
  mailingListCta: {
    title: "Join Our Mailing List",
    description:
      "Be the first to know about our next pizza pop-up events, special menus, and exclusive island gatherings.",
    buttonLabel: "Join the Mailing List",
    buttonHref: "#mailing-list",
  },
  soldOutMessage:
    "This event is now full, but don't miss our next one! There is more wood-fired goodness coming.",
};

export const reservationFormContent = {
  title: "Reserve Your Table",
  description:
    "Secure your slice under the trees. Share your details and our team will confirm your reservation along with menu highlights.",
  submitLabel: "Request Reservation",
};

type MenuBadgeTone = "signature" | "spicy";

type MenuItem = {
  name: string;
  price: string;
  description: string;
  icon: string;
  badges?: Array<{ label: string; tone: MenuBadgeTone }>;
};

type MenuSection = {
  name: string;
  icon: string;
  items: MenuItem[];
};

type MenuShowcase = {
  badge: string;
  title: string;
  subtitle: string;
  sections: MenuSection[];
};

export const menuShowcase: MenuShowcase = {
  badge: "Fresh from the Fire",
  title: "What's Firing This Night",
  subtitle: "Every pizza crafted with 72-hour fermented dough and the finest local ingredients",
  sections: [
    {
      name: "Wood-Fired Pizzas",
      icon: "🍕",
      items: [
        {
          name: "Margherita",
          price: "$16",
          description: "San Marzano tomato, fior di latte, basil",
          icon: "🍕",
        },
        {
          name: "Diavola",
          price: "$18",
          description: "Spicy salami, chili oil, honey drizzle",
          icon: "🌶️",
          badges: [{ label: "Spicy", tone: "spicy" }],
        },
        {
          name: "Saltfish Biju",
          price: "$22",
          description: "Smoked saltfish in a rich red sauce",
          icon: "🐟",
          badges: [{ label: "Signature", tone: "signature" }],
        },
        {
          name: "Mango Chutney & Prosciutto",
          price: "$21",
          description: "Sweet + salty perfection",
          icon: "🥭",
          badges: [{ label: "Signature", tone: "signature" }],
        },
        {
          name: "Yafre's Chicken Schiacciata",
          price: "$14",
          description: "Smoked chicken, tomato, cream cheese",
          icon: "🍗",
        },
        {
          name: "Garlic Bread",
          price: "$6",
          description: "Butter, garlic, parsley, parmigiano",
          icon: "🧄",
        },
      ],
    },
    {
      name: "Island Refreshments",
      icon: "🍹",
      items: [
        {
          name: "Cane Sparkle",
          price: "$8",
          description: "Prosecco + raw cane soda",
          icon: "🥂",
        },
        {
          name: "Sorrel Spritz",
          price: "$8",
          description: "Hibiscus-ginger fizz",
          icon: "🌺",
        },
      ],
    },
  ],
};

export const faqs = [
  {
    title: "Already have a reservation?",
    body: "We can't wait to see you on November 9th! Your reservation confirmation email includes arrival details, parking info, and how to update your guest count.",
  },
  {
    title: "Questions or group bookings?",
    body: "We're here to help make your night perfect. Email hello@pizzamahn.com and we'll get back to you within 24 hours.",
  },
];

export const brandStatement = {
  title: "PIZZAMAHN",
  tagline: "Wood-fired pizza with island soul",
  copy: "We handcraft every pie with 72-hour fermented dough, local island ingredients, and the kind of slow-fired patience that makes each bite worth the wait.",
};

export const experienceHighlights = [
  {
    title: "72-Hour Dough",
    description: "Our slow-fermented sourdough develops deep flavor and the perfect airy chew in every slice.",
    icon: "⏳",
  },
  {
    title: "Island Ingredients",
    description: "We source seasonal produce, locally caught seafood, and Caribbean herbs to top each pie.",
    icon: "🌴",
  },
  {
    title: "Wood-Fired Heat",
    description: "Each pizza is fired in our custom oven, infusing a smoky char and irresistible aroma.",
    icon: "🔥",
  },
];

export const defaultAreaTags = [
  "Virgin Islands",
  "St. Thomas",
  "St. John",
  "Caribbean",
  "Boca Raton",
  "Downtown",
  "Pop-Up",
  "Wood-Fired Pizza",
  "Delivery",
  "Takeout",
  "Catering",
];

export const contactDetails = {
  phone: "(561) 674-4600",
  instagram: "https://www.instagram.com/pizzamahn",
  location: "St. Thomas, USVI",
};

