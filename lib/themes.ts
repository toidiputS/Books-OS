
export const VATTLE_THEMES = [
    // Retro & Arcade
    "Retro Arcade Game",
    "8-Bit Platformer",
    "Pixel Art Dungeon Crawler",
    "Synthwave Dashboard",
    "Cyberpunk Terminal",
    "Vaporwave Music Player",

    // Scifi & Futuristic
    "Interstellar Navigation Interface",
    "Alien Biosphere Simulation",
    "Mars Colony Management Tool",
    "Neural Link Visualizer",
    "Quantum Computing Dashboard",
    "Time Travel Logbook",

    // Fantasy & Adventure
    "Alchemist's Recipe Book",
    "Magic Spellbook UI",
    "Dragon Slayer Quest Map",
    "Enchanted Forest Guide",
    "Steampunk Airship Controls",
    "Ancient Rune Translator",

    // Modern & Corporate (with a twist)
    "Neumorphic Finance App",
    "Glassmorphic Social Media",
    "Brutalist E-commerce Store",
    "Minimalist Zen Workspace",
    "High-Tech Security System",
    "Futuristic Smart Home Controller",

    // Nature & Organic
    "Undersea Exploration HUD",
    "Bonsai Tree Care App",
    "Star Gazing Map",
    "Crystal Growth Simulator",
    "Bioluminescent Creature Catalog",
    "Vertical Garden Monitor",

    // Abstract & Artsy
    "Fractal Art Generator",
    "Geometric Pattern Weaver",
    "Color Theory Playground",
    "Typography Masterpiece",
    "Glitch Art Editor",
    "Kinetic Sculpture Controller",

    // Playful & Quirky
    "Space Potato Sanctuary",
    "Cat Cafe POS System",
    "Unicorn Flight Tracker",
    "Gnome Village Registry",
    "Rubber Duck Debugging Suite",
    "Cloud Shape Predictor",

    // Technical & Industrial
    "Nuclear Reactor Core Monitor",
    "Satellite Orbit Tracker",
    "Deep Sea Submersible Console",
    "Drone Fleet Management",
    "Robotic Arm Programming Interface",
    "Nanobot Health Dashboard",

    // Cultural & Historical
    "Egyptian Hieroglyph Decoder",
    "Victorian Steam Engine Manual",
    "Jazz Club Event Calendar",
    "Samurai Honor Guard Roster",
    "Art Deco Museum Gallery",
    "Mayan Calendar Visualizer",

    // Even more diverse options
    "Holographic Surgery Planner",
    "Ghost Hunting Radar",
    "Post-Apocalyptic Survival Map",
    "Luxury Martian Hotel Booking",
    "Dream Interpretation Journal",
    "Parallel Universe Switcher",
    "Emotion-to-Color Translator",
    "Subterranean City Layout",
    "Floating Island Weather Station",
    "Kraken Sighting Log",
    "Interdimensional Pawn Shop",
    "Aura Cleansing Dashboard",
    "Zero-G Sports Arena Scoreboard",
    "Memory Storage Library",
    "Ant Gravity Controller",
    "Cosmic Microwave Background Analyzer"
];

export const getRandomTheme = () => {
    return VATTLE_THEMES[Math.floor(Math.random() * VATTLE_THEMES.length)];
};
