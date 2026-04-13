export const projects = [
  {
    id: "irl-quests",
    title: "IRL Quests",
    tagline: "Turn starting a business into a game.",
    description:
      "A free web app that gamifies the journey of building a business. Users follow quests across areas like Sales, Marketing, and Product, earning XP, levelling up, and graduating through phases as they go.",
    tags: ["Vanilla JS", "Firebase", "Firestore"],
    status: "Live / Beta",
    link: "https://irl-quests.app/",
    facts: {
      whatIsIt: "A gamified version of a business-building roadmap. You follow quests based on the Hormozi business framework, earn XP, and level up as you steps in the real world.",
      whyBuilt: "I had Hormozi's business roadmap saved as a PDF but it was just a static list of steps. I wanted a more visual and fun way to work through it, something that felt like progress.",
      timeSpent: "~60 hours",
      cost: "£5.49/yr (domain only)",
      started: "Launched Mar 2026",
      tools: ["Firebase", "Firestore", "Node.js", "Vanilla JS", "CDN Auth", "VS Code", "Claude Code"],
      funFact: "Has 10 player levels, from 'The Dreamer' all the way to 'The Entrepreneur'. Each business area awards different XP.",
    },
  },
  {
    id: "myracecard",
    title: "MyRaceCard",
    tagline: "Your race plan in your pocket.",
    description:
      "Generates a clean, shareable race card for trail runners to use on their phone. Enter your checkpoints, target pace, and start time. The app calculates arrival times, leg splits, and cutoffs, then exports it as a downloadable image.",
    tags: ["Vanilla JS", "Canvas API", "GPX"],
    status: "Live",
    link: "https://myracecard.co.uk",
    facts: {
      whatIsIt: "A tool that generates a clean, printable race card for trail runners to use on their phone, showing checkpoints, target times and distances at a glance.",
      whyBuilt: "Because I wanted to make it easier for anyone to create an image to use on their phones with details or their race, simply by uploading a GPX file.",
      timeSpent: "~25 hours",
      cost: "~£5.49/yr (domain only)",
      started: "Launched April 2026",
      tools: ["Canvas API", "GPX Parser", "html2canvas", "Vanilla JS", "VS Code", "Claude Code"],
      funFact: "Inspired by a post I saw on one of the Ultra groups whe someone was using the details of a race as a background on their phones. Built the first version the week before the race to use on the day.",
    },
  },
  {
    id: "personal-website",
    title: "A portfolio website",
    tagline: "Just a place to showcase my projects really.",
    description:
      "My personal portfolio, built from scratch with React, GSAP, and Framer Motion. Features procedurally generated lightning strikes, animated gradient blobs, and a card explosion animation when you open a project.",
    tags: ["React", "GSAP", "Framer Motion", "Vite"],
    status: "Live",
    link: "#",
    facts: {
      whatIsIt: "My personal portfolio, a single page that showcases the projects I've built while learning to code with AI.",
      whyBuilt: "I wanted one place to show everything I've been working on, and an excuse to experiment with animations and React for the first time.",
      timeSpent: "~15 hours",
      cost: "£5.49/yr (domain only)",
      started: "Apr 2025",
      tools: ["React", "Vite", "GSAP", "Framer Motion", "Lenis", "Canvas API", "VS Code", "Claude Code"],
      funFact: "The lightning bolts are procedurally generated using midpoint displacement, the same algorithm used in real lightning simulators.",
    },
  },
];