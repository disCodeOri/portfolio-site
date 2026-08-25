export type Project = {
  id: string;
  index: string;
  name: string;
  tag: string;
  year: string;
  blurb: string;
  image: string;
  /** two-stop gradient used by the abstract preview tile until real shots exist */
  tile: [string, string];
  link?: { label: string; href: string };
};

export const PROFILE = {
  nameFirst: "Parth",
  nameLast: "Sankhla",
  roles: ["Software Developer", "Triathlete", "Builder"],
  location: "Hyderabad, India",
  email: "parth9102007@gmail.com",
  linkedin: "https://www.linkedin.com/in/parth-sankhla/",
} as const;
export const STATEMENT =
  "I build software the way I race — patient through the long stretch, precise when it counts. Research tools at BITS Pilani by day, custom client systems by night, and an open-water swim before either.";

export const CURRENTLY = [
  {
    index: "01",
    title: "BITS Pilani — Research Dev",
    detail: "Custom software for a postdoc's portable, low-cost device.",
  },
  {
    index: "02",
    title: "Client Software — Rent Management",
    detail: "Full system for an owner managing 27 properties across locations.",
  },
  {
    index: "03",
    title: "Triathlon Training",
    detail: "Base season. Pool, road, and a lot of meters.",
  },
] as const;

export const PROJECTS: Project[] = [
  {
    id: "zariya",
    index: "01",
    name: "Zariya",
    tag: "E-commerce platform",
    year: "2025",
    blurb:
      "Full-stack storefront for a sustainable fashion brand — payments, order management, and dynamic inventory.",
    image: "/placeholders/project-zariya.jpg",
    tile: ["#2b1616", "#ff3b14"],
  },
  {
    id: "rent-management",
    index: "02",
    name: "Rent Management System",
    tag: "Client software",
    year: "2025",
    blurb:
      "Rent tracking, ledgers, and tenant records for a property owner with 27 properties across multiple locations.",
    image: "/placeholders/project-rent.jpg",
    tile: ["#1f1616", "#c93416"],
  },
  {
    id: "bits-research",
    index: "03",
    name: "BITS Research App",
    tag: "Research software",
    year: "2025",
    blurb:
      "Application for a postdoctoral researcher's device that improves portability and cuts cost against industry tools.",
    image: "/placeholders/project-research.jpg",
    tile: ["#2b1a1a", "#ff4d26"],
  },
];

export type ProofGroup = {
  id: string;
  index: string;
  title: string;
  summary: string;
  signal: string;
  image?: string;
  items: { title: string; body: string; meta: string }[];
};

export const PROOF_GROUPS: ProofGroup[] = [
  {
    id: "athletics",
    index: "01",
    title: "Athletics",
    summary: "Competitive triathlon, national-level racing, resilience.",
    signal: "International racing / silver medal",
    image: "/placeholders/proof-athletics.jpg",
    items: [
      {
        title: "World Triathlon Asia Cup 2024, Pokhara",
        body: "Raced internationally in Nepal at 16 against athletes above 25, with the 2nd fastest swim in the Indian contingent — on a bike bought two days before the race.",
        meta: "International triathlon",
      },
      {
        title: "IRONMAN 5150 Chennai 2026",
        body: "23rd in the 18–24 age category despite the run-bike-run format removing swimming, my strongest leg.",
        meta: "23rd in age category",
      },
      {
        title: "37th National Games, Goa",
        body: "Reached the national start line; a jellyfish sting ended the race early.",
        meta: "National racing",
      },
      {
        title: "Telangana CM Cup",
        body: "Silver medalist at the state-level championship.",
        meta: "Silver medalist",
      },
    ],
  },
  {
    id: "technology",
    index: "02",
    title: "Technology & Research",
    summary: "Research software and specialized systems for real workflows.",
    signal: "Research dev / custom systems",
    image: "/placeholders/proof-tech.jpg",
    items: [
      {
        title: "BITS Pilani Research Software Development",
        body: "Software dev and research intern for a postdoctoral researcher, building the custom application for a device designed to improve portability and reduce cost.",
        meta: "Research internship",
      },
      {
        title: "Custom Client Software Services",
        body: "Delivered Zariya end-to-end; currently building the rent management system serving 27 properties.",
        meta: "Shipping client work",
      },
    ],
  },
  {
    id: "business",
    index: "03",
    title: "Entrepreneurship & Business",
    summary: "Applied product thinking, analytics, and agentic AI.",
    signal: "Full ride / analytics + AI",
    image: "/placeholders/proof-business.jpg",
    items: [
      {
        title: "Yale Entrepreneurial Society Fellowship",
        body: "Completed the high-school fellowship on a full-ride scholarship.",
        meta: "Full-ride scholar",
      },
      {
        title: "BITSoM Certificate Program",
        body: "Business Analytics and Agentic AI.",
        meta: "Analytics + AI",
      },
    ],
  },
  {
    id: "leadership",
    index: "04",
    title: "Leadership & Recognition",
    summary: "Initiative and measurable recognition beyond academics.",
    signal: "Top fundraiser / global percentile",
    image: "/placeholders/proof-leadership.jpg",
    items: [
      {
        title: "Habitat for Humanity Fundraiser",
        body: "Raised INR 31,000 door-to-door — the highest total in the program; second place raised INR 17,000.",
        meta: "Top fundraiser",
      },
      {
        title: "Callido College Readiness Program",
        body: "Top 25 percentile worldwide, signed by Brown University faculty (Dr. Lina Fruzzetti).",
        meta: "Top 25 percentile",
      },
    ],
  },
];
