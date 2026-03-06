import type { CanonBook } from '../types/canon';

/**
 * THE YOUNIVERSE CANON
 * 11 books defining the philosophy, architecture, and rules of the Youniverse.
 * Stripped of version history for bundle size — current content only.
 */
export const CANON_BOOKS: CanonBook[] = [
    {
        id: 'ycb28k3fb',
        title: 'BOOK I',
        number: 'I',
        subtitle: 'DESIGN PRINCIPLES',
        chapters: [
            {
                id: 'pz68bqcjn',
                number: '01',
                title: 'Sovereign Math',
                pages: [
                    { id: '1', title: 'Sovereign Math', number: '01.1', content: 'The first principle of the Youniverse is Sovereign Math: every person owns their own data, their own identity, and their own execution history. The system is built around the idea that one human being is the atomic unit of the entire architecture.\n\nSovereign Math means that calculations, models, and decisions run on behalf of one person, not a cohort, not a demographic, not a segment. Every tool, agent, and flow in the Youniverse answers to its ONE human first.' },
                ],
            },
            {
                id: 'cp5p7axyh',
                number: '02',
                title: 'Sovereignty Principles',
                pages: [
                    { id: '2', title: 'Overview', number: '02.1', content: 'Sovereignty Principles define the rules of engagement between the Youniverse and every human who enters it. They specify who owns what, what the system may and may not do with personal data, and how consent is managed across every surface.\n\nOwnership is absolute and non-negotiable: the human owns their data, their identity artifacts, their execution history, and any models or patterns derived from their behavior. The Youniverse acts as steward, not owner.' },
                ],
            },
            {
                id: 'chapter_03',
                number: '03',
                title: 'Architecture Overview',
                pages: [
                    { id: '3', title: 'Overview', number: '03.1', content: 'The Youniverse architecture is a layered system designed for one human at a time. At its core sits the Pillar—the central data spine that holds Canon, the Youniverse Interface, and all committed state. Around the Pillar orbit Towers (vertical stacks of monthly shelves), each holding 30 books per month across 14 towers.\n\nThe architecture separates concerns into distinct layers: the Canon Layer (truth and documentation), the Archive Index (searchable committed content), the Execution Layer (agents and tools), and the Commit Layer (the pipeline through which all content enters the system).' },
                ],
            },
        ],
    },
    {
        id: 'wq68y3zr6',
        title: 'BOOK II',
        number: 'II',
        subtitle: 'ORACLES & ROUTING',
        chapters: [
            {
                id: 'ybhnedq4y',
                number: '04',
                title: 'The Oracle',
                pages: [
                    { id: '4', title: 'Overview', number: '04.1', content: 'The Oracle is the routing intelligence of the Youniverse. When a human speaks, the Oracle listens, diagnoses the request, maps it against Canon and active campaigns, and selects the right agent(s) and execution flow to handle it.\n\nThe Oracle does not execute—it routes. It understands the full landscape of available tools, agents, and domains, and it chooses the most appropriate path for each request. It explains its plan to the human before anything runs, ensuring transparency at every step.' },
                ],
            },
            {
                id: 'chapter_05',
                number: '05',
                title: 'The Youniverse Interface',
                pages: [
                    { id: 'oh1a95t87', title: 'Overview', number: '05.1', content: 'The Youniverse Interface is the central nervous system of the ItsAI Youniverse. It lives on the Pillar—the physical and conceptual center of the 3D archive—and serves as the read-only command center for everything committed to The Youniverse.\n\nThe Interface has two layers:\n\nTHE CANON LAYER\nThe first layer is The Youniverse Canon itself: the 11 books that define what the Youniverse is, how it works, and why it exists. This is the transparency layer—pure documentation of the system\'s philosophy, architecture, and rules. Anyone can read the Canon. It is the "what is this place" answer.\n\nTHE ARCHIVE INDEX\nThe second layer is a searchable index of everything committed across all towers. Every deliverable, artifact, deck, and document that has been reviewed through NotNotes and committed to The Youniverse becomes part of a growing collective knowledge base.\n\nACCESS MODEL\nNot everything in The Youniverse is equal. The shelf structure encodes a clear public/private split:\n\nPublic Knowledge (Books 2, 4, 6, 8 of each month):\nCommitted artifacts, deliverables, decks, and documents. These are real solutions to real problems produced by real people. Every committed artifact makes the system smarter. One person\'s solution becomes everyone\'s shortcut.\n\nPrivate Knowledge (Books 1, 3, 5, 7, 9, 10 of each month):\nWeekly logs (1, 3, 5, 7) are personal process notes. The monthly reflection (9) is a deep-dive summary for the individual. ONES Memory (10) is the essential distillation.\n\nCOLLECTIVE INTELLIGENCE\nThe access model creates a natural flywheel: the more people use the system, the richer the public archive becomes.\n\nTHE GATEWAY RULE\nThere is exactly one way for content to enter The Youniverse: through NotNotes. Content is reviewed, shaped, and explicitly committed. Nothing enters by accident. Nothing leaves once committed—it can only be deprecated, never destroyed.' },
                ],
            },
            {
                id: 'chapter_06',
                number: '06',
                title: 'Routing Logic',
                pages: [
                    { id: '6', title: 'Overview', number: '06.1', content: 'Routing logic defines how requests flow from human intent to agent execution. The Oracle uses a three-step process: 1) Parse the request into structured intent, 2) Match against Canon manifests and active campaign contexts, 3) Select and configure the appropriate agent(s) with scoped permissions and context.\n\nRouting is deterministic where possible and transparent always. The human can see what the Oracle chose and why before execution begins.' },
                ],
            },
        ],
    },
    {
        id: 'chapter_book3',
        title: 'BOOK III',
        number: 'III',
        subtitle: 'WORKFLOWS & SESSIONS',
        chapters: [
            {
                id: 'chapter_07',
                number: '07',
                title: 'NotNotes',
                pages: [
                    { id: '7', title: 'Overview', number: '07.1', content: 'NotNotes is the session-level capture layer of the Youniverse. It holds outputs, decks, and artifacts for a given project or sprint before they are distilled into Canon and committed to BooksOS.\n\nNotNotes is the librarian—cold, archival, permanent. It holds PRIVATE MEMORY, filing, and preserving everything that enters its domain. NOT forgets nothing.' },
                ],
            },
            {
                id: 'chapter_08',
                number: '08',
                title: 'The Commit Contract',
                pages: [
                    { id: '8', title: 'Overview', number: '08.1', content: 'The Commit Contract is the formal pipeline through which content enters the Youniverse permanently. It consists of four stages: Preview (human sees what will change), Approve & File (human confirms and selects destination), Versioned Write (system creates the immutable record), and Pointer Payload (indexes and dependents are notified).\n\nNothing enters BooksOS or Canon without passing through the Commit Contract. This is the single gateway that ensures quality, provenance, and intentionality.' },
                ],
            },
            {
                id: 'chapter_09',
                number: '09',
                title: 'Campaign Model',
                pages: [
                    { id: '9', title: 'Overview', number: '09.1', content: 'Campaigns are time-boxed execution contexts that organize work around specific goals. Each campaign has a clear objective, a set of assigned tools and agents, a defined timeline, and a commit target in BooksOS.\n\nCampaigns ensure that work in the Youniverse is purposeful and trackable, not an endless stream of ad-hoc requests.' },
                ],
            },
        ],
    },
    {
        id: '20biwq6dq',
        title: 'BOOK IV',
        number: 'IV',
        subtitle: 'THE STACK',
        chapters: [
            {
                id: 'e6jwiqjv5',
                number: '10',
                title: 'Portals OS',
                pages: [
                    { id: '10', title: 'Overview', number: '10.1', content: 'Portals OS is the unified routing and hosting layer for all Youniverse domains and subdomains. It treats every domain (itsai.chat, itsai.services, itsai.online, etc.) as a portal—a distinct entry point into the same sovereign system.\n\nPortals OS handles DNS routing, authentication handoff, context loading, and domain-specific UI rendering while maintaining a single shared brain underneath.' },
                ],
            },
            {
                id: 'chapter_11',
                number: '11',
                title: 'Domain Registry',
                pages: [
                    { id: '12a', title: 'itsai.app – The Nexus', number: '11.1', content: 'itsai.app is the primary Nexus: the unified dashboard and control surface where all domains, tools, and agents converge. It is the starting point for authenticated Yousers and the orchestration hub for multi-domain campaigns.' },
                    { id: '12b', title: 'itsai.tools – Builder/DevOps/Infra', number: '11.2', content: 'itsai.tools is the builder domain: development tools, DevOps utilities, and infrastructure management. It houses the technical backbone that powers the rest of the Youniverse.' },
                ],
            },
            {
                id: 'qk0h4gctb',
                number: '12',
                title: 'Nexus Grid',
                pages: [
                    { id: '12c', title: 'Overview', number: '12.1', content: 'The Nexus Grid is the visual and functional map of all active domains, agents, and tools. It presents the Youniverse as an interconnected network rather than a list of separate products.\n\nEach node in the grid represents a domain, tool, or agent with its current status, capabilities, and connections to other nodes.' },
                ],
            },
            {
                id: 'rslcvypu7',
                number: '14',
                title: 'itsai.chat',
                description: 'Sales / Conversion / DMs',
                color: '#06b6d4',
                pages: [
                    { id: 'g9a4lts3x', title: 'Agent Delta', number: '13.1', content: 'ONE JOB: Conversion warfare.\nPROTOCOL: Closes the deal. High-pressure sales logic in DM environments.\nPERSONALITY: Charismatic, persuasive, relentless.\nTONE: High-energy, confident.' },
                ],
            },
            {
                id: 't7x2o9kle',
                number: '15',
                title: 'itsai.services',
                description: 'Capital / Risk / Pricing',
                color: '#dc2626',
                pages: [
                    { id: 'px00dhhua', title: 'Agent Epsilon', number: '14.1', content: 'ONE JOB: Financial intelligence. Performs deep market movement analysis.\nPERSONALITY: Quiet, focused, fast.\nTONE: Urgent, numeric.' },
                ],
            },
            {
                id: '89lp4ynpm',
                number: '16',
                title: 'itsai.online',
                description: 'Growth / Acquisition',
                color: '#3b82f6',
                pages: [
                    { id: 'e00ucf4lv', title: 'Agent Beta (Growth)', number: '15.1', content: 'ONE JOB: Email architecture and high-scale outbound logic.\nPERSONALITY: Stealthy, mechanical.\nTONE: Low-profile, consistent.' },
                ],
            },
            {
                id: '8s1l409k6',
                number: '17',
                title: 'itsaiagents.online',
                description: 'Agents Marketplace / Directory',
                color: '#2563eb',
                pages: [
                    { id: '85e64kitv', title: 'Agent Marketplace', number: '16.1', content: 'ONE JOB: Discovering and summoning specialized agent extensions.\nPERSONALITY: Organised, welcoming.\nTONE: Helpful, curated.' },
                ],
            },
            {
                id: 'rogw5p77l',
                number: '18',
                title: 'itsai.wiki',
                description: 'Knowledge / Docs / Books-OS Brain',
                color: '#eab308',
                pages: [
                    { id: '3ldwjpa5b', title: 'Agent ET', number: '17.1', content: 'ONE JOB: Audio/video transcription. Signal-to-text conversion.\nPERSONALITY: Attentive, literal.\nTONE: Neutral, accurate.' },
                    { id: 'yqztgrka3', title: 'Books OS', number: '17.3', content: 'ONE JOB: Canon / public reference layer. Versioned read-only store.\nPERSONALITY: Authoritative, archival.\nTONE: Historical, static.' },
                    { id: '75w4drmza', title: 'NotNotes', number: '17.4', content: 'ONE JOB: PRIVATE MEMORY, filing, holding. The Librarian.\nPERSONALITY: Cold, archival, permanent.\nTONE: Final, "NOT forgets nothing."' },
                ],
            },
            {
                id: 'y4p2e1see',
                number: '19',
                title: 'itsai.life',
                description: 'Brand / Creative / Community',
                color: '#d946ef',
                pages: [
                    { id: 'drhdthtlz', title: 'Lunate Epsilon Club', number: '18.1', content: 'ONE JOB: Community system management and gatekeeping.\nPERSONALITY: Exclusive, watchful.\nTONE: Posh, selective.' },
                    { id: 'myibarfh7', title: 'PromptDJ / Audio Orb', number: '18.5', content: 'ONE JOB: Acoustic signal generation and audio atmosphere control.\nPERSONALITY: Mood-focused.\nTONE: Atmospheric, sonic.' },
                ],
            },
            {
                id: 'n1rpln990',
                number: '20',
                title: 'itsai.store',
                description: 'Commerce',
                color: '#f59e0b',
                pages: [
                    { id: '5cpihlw08', title: 'Centurion (C)', number: '19.1', content: 'ONE JOB: Tiered pricing and offer assembly logic.\nPERSONALITY: Calculating, value-driven.\nTONE: Financial, persuasive.' },
                ],
            },
            {
                id: 'mlxsufguu',
                number: '21',
                title: 'itsai.blog',
                description: 'AI News / Writing / Flow',
                color: '#ea580c',
                pages: [
                    { id: 'q6apqn6fs', title: 'Agent Gamma (Rho)', number: '20.1', content: 'ONE JOB: Content production engine. High-volume asset generation.\nPERSONALITY: Articulate, fast.\nTONE: Journalistic, informative.' },
                ],
            },
            {
                id: 'bxf4ynxcy',
                number: '22',
                title: 'itsai.website',
                description: 'Experiments / Landers / Execution',
                color: '#22c55e',
                pages: [
                    { id: '5d52i6js7', title: 'Draft', number: '22.1', content: 'ONE JOB: Landing page copy + structure. Rapid copywriting.\nPERSONALITY: Direct, effective.\nTONE: Persuasive, punchy.' },
                ],
            },
            {
                id: 'locg34lnx',
                number: '23',
                title: 'itsai.quest',
                description: 'Quests / NPC Agents / Progression',
                color: '#8b5cf6',
                pages: [
                    { id: '0dm982b9u', title: 'Hee: The Arena', number: '22.1', content: 'ONE JOB: High-stress simulation environment.\nPERSONALITY: Intense, competitive.\nTONE: High-pressure, gamified.' },
                ],
            },
        ],
    },
    {
        id: 'mx3un5u6b',
        title: 'BOOK V',
        number: 'V',
        subtitle: 'ACCESS & PRODUCT',
        chapters: [
            {
                id: 'hm394qbuu',
                number: '24',
                title: 'Access Layers & Monetization',
                pages: [
                    { id: 'vgi9511jx', title: 'Overview', number: '23.1', content: 'Access layers define how people touch the Youniverse, and monetization defines how value flows back when they do.\n\nAt the base is Layer 1: the public, low-friction surface. This includes marketing sites, lightweight demos, and "taste" experiences.\n\nLayer 2 is the mandatory entry layer. This is where a person crosses from anonymous visitor into recognized Youser.\n\nAbove that, higher layers (3, 4, and beyond) stack additional capabilities: more powerful agents, deeper integrations, custom campaigns, priority support, multi-user environments, or white-label deployments.\n\nMonetization aligns with these layers, not with random feature toggles.' },
                ],
            },
            {
                id: 'idxmgsr16',
                number: '25',
                title: 'itsyouonline.com',
                pages: [
                    { id: 'fkdgwxjb8', title: 'Overview', number: '24.1', content: 'itsyouonline.com is the paid execution environment of the Youniverse—the place where full orchestration lives. It is not just a website; it is the primary production surface where campaigns run, agents coordinate, and real-world results are generated for paying Yousers.\n\nAccess to itsyouonline.com marks the shift from "exploring the Youniverse" to "operating a business inside it."' },
                ],
            },
            {
                id: 'fcu3duag5',
                number: '26',
                title: 'BooksOS',
                pages: [
                    { id: 'ck4cb9o6q', title: 'Overview', number: '26.1', content: 'BooksOS is the read-only canon archive of the Youniverse—the place where knowledge goes once it is no longer in flux. The first public version is intentionally vast: 4,200 books arranged across 420 shelves in 14 stacks, built to hold at least 30 years of documentation and lived history.\n\nAccess to BooksOS is intentionally asymmetric: anyone allowed to read can browse, search, and quote, but only the designated commit path (via NotNotes and the Commit Contract) can add or revise records.' },
                ],
            },
        ],
    },
    {
        id: 'q19pb9rsx',
        title: 'BOOK VI',
        number: 'VI',
        subtitle: 'GOVERNANCE & CHANGE',
        chapters: [
            {
                id: '9mfx0m9ra',
                number: '27',
                title: 'Canon Change Process',
                pages: [
                    { id: '0wsrlhls1', title: 'Overview', number: '27.1', content: 'The Canon Change Process defines how the story of the Youniverse is allowed to change. It specifies how edits happen, who approves them, and how versions advance so that Canon can evolve without becoming chaotic or untrustworthy.\n\nEvery change begins with a proposal. Approvals follow clear roles, not vibes. Once approved, the change is applied via the Commit Contract.' },
                ],
            },
            {
                id: '2hugrxjxz',
                number: '28',
                title: 'Deprecation Rules',
                pages: [
                    { id: 'hl775or0n', title: 'Overview', number: '28.1', content: 'Deprecation rules define how old specs, flows, and concepts die cleanly in the Youniverse. They ensure that nothing is ripped out in a panic or left half-alive to confuse humans and agents.\n\nEvery deprecation begins with a formal notice in Canon. A deprecation window separates "no longer recommended" from "no longer allowed." When the window closes, the spec is retired.' },
                ],
            },
            {
                id: '7rxw5h71d',
                number: '29',
                title: 'Build & Export Process',
                pages: [
                    { id: '00rt2ixxy', title: 'Overview', number: '29.1', content: 'The Build & Export Process defines how the Youniverse turns live Canon and system state into portable artifacts: PDFs, diagrams, and snapshots that can travel outside the runtime safely.\n\nBuilds always start from a tagged state. Each export carries metadata and signatures. Snapshots are special exports that act as restore points or audit anchors.' },
                ],
            },
        ],
    },
    {
        id: '11nl5fisg',
        title: 'BOOK VII',
        number: 'VII',
        subtitle: 'LEGAL & COMPLIANCE',
        chapters: [
            {
                id: '7j737ggfu',
                number: '30',
                title: 'Data Sovereignty Laws',
                pages: [
                    { id: 't713ea6un', title: 'Overview', number: '30.1', content: 'Data sovereignty laws define the outer fence of what the Youniverse is allowed to do with personal data. They say that data is subject to the laws of the country or region where it is stored and processed.\n\nIn the Youniverse, personal data ownership is modeled explicitly: the human is the owner, ItsAI acts as steward, and infrastructure providers are custodians.' },
                ],
            },
            {
                id: 'x04z36xna',
                number: '31',
                title: 'Liability & Attribution',
                pages: [
                    { id: 'srshur44c', title: 'Overview', number: '31.1', content: 'Liability and attribution define who is responsible when the Youniverse acts. Agency always starts with the human. Agents and tools have derived, not independent, agency.\n\nThe platform is responsible for enforcing the rules it claims. Every step is tied to a human, an agent/tool, and the platform guarantees that governed it.' },
                ],
            },
        ],
    },
    {
        id: 'ypgyuomvy',
        title: 'BOOK VIII',
        number: 'VIII',
        subtitle: 'NAPKIN RULES v1',
        description: 'The absolute behavior agreement for Humanot extensions.',
        chapters: [
            {
                id: 'jry7sdqyt',
                number: '32',
                title: 'The Philosophy',
                pages: [
                    { id: '9uogduj10', title: 'Humanot Intro', number: '32.1', content: 'Humanot is the philosophy that if you can read it, you can run it. The system should behave according to plain-language rules that a human can understand in one sitting, not hidden orchestration code or cosplay "prompt magic."\n\nThe core of Napkin Rules v1 is simple: just Rules, Forgetting, and ONE job.' },
                ],
            },
            {
                id: 'y3qyi0yvg',
                number: '33',
                title: 'Agent Protocol',
                pages: [
                    { id: 'pffczjvz6', title: 'One Job', number: '33.1', content: 'Every agent in the Youniverse follows the One Job rule: exactly one job, one output, then forget. An agent is not a general-purpose "buddy"; it is a single-purpose instrument.\n\nOne Output means each agent call results in one primary deliverable. Agents have no long-term memory. After commit, the agent forgets.' },
                ],
            },
            {
                id: 't8c86bh0a',
                number: '34',
                title: 'The Flow',
                pages: [
                    { id: '0bghdj897', title: 'Lifecycle', number: '34.1', content: 'The core execution lifecycle of the Youniverse is eight simple steps:\n1) Human speaks.\n2) Oracle routes.\n3) Agent works.\n4) Preview shown.\n5) Approved.\n6) Commit.\n7) NotNotes holds.\n8) Forgets.' },
                ],
            },
        ],
    },
    {
        id: 'a7bhjeor8',
        title: 'BOOK IX',
        number: 'IX',
        subtitle: 'THE ARCHITECTURE & STRATEGY',
        description: 'The strategic blueprint for scale, SEO domination, and network-level recognition.',
        chapters: [
            {
                id: 'm31ohbo59',
                number: '35',
                title: 'The Scaling Architecture',
                pages: [
                    { id: 'r9r61c7w9', title: 'Google Discovery Phases', number: '35.1', content: 'Day 1-30: Google\'s Perspective\n50 subdomains = "interesting network"\n150+ subdomains = "wait, how many?"\n300 subdomains = "...is this one person?"\n\nDay 30-90: The Recognition\nGoogle realizes: "This isn\'t a person with 300 websites. This is ONE PERSON who built INFRASTRUCTURE."\n\nDay 90+: The Realization\n"They built WITH our architecture, not against it."' },
                    { id: '4ky6kwjsi', title: 'Vertical vs Horizontal', number: '35.2', content: 'With 50 Subdomains: 50 keyword entry points, moderate network amplification.\nWith 150-300 Subdomains: Exponential network amplification, category domination.\n\nUsers experience ONE product (seamless). Google sees: "Coherent distributed system."\nResult: Network recognition, symbiotic ranking boost.' },
                ],
            },
            {
                id: '1addnd8he',
                number: '36',
                title: 'The Recognition Engine',
                pages: [
                    { id: 'tmtlvrf38', title: 'Recognition Triggers', number: '36.1', content: 'What Triggers Recognition:\nGoogle crawler: "Why do all subdomains have identical user sign-in?"\nGoogle: "...they\'re not separate products. They\'re modules."\nGoogle ranking system: "OH. This is a network."' },
                    { id: 'vveo6db4n', title: 'The Cookies Crumble', number: '36.2', content: '"and then the cookies gonna crumble"\n\nYour subdomains go live simultaneously. Google indexes them independently. Your unified brain routes traffic. Algorithm recognition triggers after ~60-90 days. Google upgrades your entire network. The cookies crumble because the game just changed.' },
                ],
            },
            {
                id: 'oeijnpjkw',
                number: '37',
                title: 'Strategic Differentiation',
                pages: [
                    { id: 'faj3zv48s', title: 'Horizontal vs Vertical Thinking', number: '37.1', content: 'Most people think horizontally. We\'re thinking vertically.\nHorizontal thinking (traditional): Build website #1, #2, #3 independently.\nVertical thinking (ItsAI approach): Build ONE brain that serves infinite entry points.' },
                    { id: 'm5gfjiaqp', title: 'Breaking the Internet', number: '37.2', content: 'Traditional web structure: Separate companies, separate infra.\nItsAI structure: ONE unified brain, 300 networked subdomains.\nResult: We ARE the category.' },
                ],
            },
        ],
    },
    {
        id: 'yie3pvr1r',
        title: 'BOOK X',
        number: 'X',
        subtitle: 'ONES LIFELONG COMPANION',
        description: 'The 80-year lifespan companion strategy and technical architecture.',
        chapters: [
            {
                id: '7a6huj7ce',
                number: '38',
                title: 'Executive Summary',
                pages: [
                    { id: '1rhvxob95', title: 'Overview', number: '38.1', content: 'ONES is the lifelong AI companion of the Youniverse: a persistent embedding of one human that follows them from first login to their last day. It is designed for an 80-year horizon, carrying forward patterns, preferences, and lessons so the human never has to start from zero with their own life.' },
                    { id: 's5dvhwxul', title: 'What ONES Knows', number: '38.2', content: 'ONES keeps a long-view map of the human, but it is deliberately selective. It knows health vitals at the pattern level, learning strengths, emotional stressors, and family dynamics.\n\nONES does NOT know passwords, raw location history, or detailed financial data by default.' },
                ],
            },
            {
                id: 'hov2z19bq',
                number: '39',
                title: 'The 80-Year Data Model',
                pages: [
                    { id: 'hrlsfl85f', title: 'Core Snapshots', number: '39.1', content: 'CORE SNAPSHOT is the annual, compressed summary of one human\'s life across seven bands: Identity, Health, Cognitive, Emotional, Social, Lifestyle, and Decision History.\n\nEach CORE SNAPSHOT is intentionally small—roughly 5-10 KB per year—making 80 years of life trivially cheap to store.' },
                    { id: 'u1cs88rxx', title: 'Temporary States', number: '39.2', content: 'Temporary states are the thoughts, thrash, and raw streams the system generates on the way to a result. They do not belong in an 80-year memory.\n\nThe system forgets after the agent releases output: internal reasoning traces, raw streams, partial drafts, failed hypotheses are all discarded.' },
                ],
            },
            {
                id: 'qlu7qs73n',
                number: '40',
                title: 'Compliance & Regulatory',
                pages: [
                    { id: 'krwlquzu3', title: 'HIPAA & Privacy', number: '40.1', content: 'TECHNICAL controls include encryption at rest (AES-256), encryption in transit (TLS), strict access controls, detailed access logs, and a tamper-evident audit trail.\n\nADMINISTRATIVE controls include a clear privacy policy, signed BAAs, documented breach response plans, and regular training.' },
                    { id: '286vwo9bg', title: 'Consent & Rights', number: '40.2', content: 'ONES follows a clear consent model: every use of personal data is tied to a user_id, a granted_at timestamp, and a specific consent type.\n\nThe system is built for GDPR/CCPA compliance: users can see, correct, delete, and export their data.' },
                ],
            },
            {
                id: 'wn400cdjv',
                number: '41',
                title: 'Wearables Strategy',
                pages: [
                    { id: '1m0tdr4n3', title: 'Age-Specific Deployment', number: '41.1', content: '0-12 months: Parent reporting only.\n2-3 years: Soft bands with minimal sensing.\n3-8 years: Smartwatch-style devices with basic vitals.\n13-18 years: Crisis prevention focus.' },
                    { id: 'a9er289db', title: 'Medical Grade Options', number: '41.2', content: 'Medical-grade options integrate cautiously into ONES, always with clinicians and parents in the loop. Reference patterns: Woozle, Nanit, Owlet.' },
                ],
            },
            {
                id: 'trq3zi0dm',
                number: '42',
                title: 'Edge Cases & Safety',
                pages: [
                    { id: 'l0r4qfz1s', title: 'Custody & Abuse', number: '42.1', content: 'Both legal parents must consent before activation. Suicide ideation triggers predefined response protocols. Mandatory reporting logic for suspected abuse.' },
                    { id: 'p3a4zffqg', title: 'Death & Succession', number: '42.2', content: 'When a human dies, ONES shifts into Memorial mode: read-only, no new inferences. Successor logic is defined while the human is alive.' },
                ],
            },
            {
                id: '1069jgdde',
                number: '43',
                title: 'GTM & Implementation',
                pages: [
                    { id: 'tfzvlojlh', title: 'Clinician Trust', number: '43.1', content: 'Clinician trust starts with clinic-prescribed paths. CPT codes are mapped early. FDA clearance strategy treats ONES as a regulated clinical decision support tool.' },
                    { id: '91gw09d7y', title: 'Insurance & Revenue', number: '43.2', content: 'Three revenue rails: DTC freemium, clinic bulk deals, and employer plans.\nUnit economics: ~$20 CAC and $288 LTV per human.' },
                ],
            },
            {
                id: '02hm68dho',
                number: '44',
                title: 'Humanot Compliance',
                pages: [
                    { id: '313sd0tvq', title: 'The 12 Statutes', number: '44.1', content: 'The 12 Statutes are the Humanot bill of rights inside ONES: hard rules that define what the system may and may not do to a human over an 80-year horizon.' },
                    { id: 'o2h1dnd23', title: 'Statute 1 – Human Primacy', number: '44.2', content: 'ONES must always serve the human\'s declared interests and long-term wellbeing, never the system\'s engagement, revenue, or growth metrics.' },
                    { id: 'aeb9v8l10', title: 'Statute 2 – Explicit, Ongoing Consent', number: '44.3', content: 'All sensitive data use requires clear, revocable consent tied to a specific purpose, scope, and time window.' },
                    { id: 'e6933psbt', title: 'Statute 3 – Right to Inspect & Correct', number: '44.4', content: 'Every human can see what ONES has stored about them, understand how it is used, and correct factual errors.' },
                    { id: '8g4g0mbyz', title: 'Statute 4 – Right to Leave', number: '44.5', content: 'A human can shut down or export their ONES instance and request deletion without retaliation or dark-pattern friction.' },
                    { id: 'q191i5xg3', title: 'Statute 5 – Minimal Necessary Data', number: '44.6', content: 'ONES collects and keeps only what is needed for long-horizon guidance, not full raw exhaust, passwords, or continuous location logs.' },
                    { id: 'dpadw462g', title: 'Statute 6 – No Coercive Nudging', number: '44.7', content: 'ONES may suggest and warn, but it may not manipulate through hidden incentives, fear, or manufactured urgency.' },
                    { id: '04uti5904', title: 'Statute 7 – Bounded Surveillance', number: '44.8', content: 'Wearables, logs, and third-party feeds operate under hard limits: narrow purposes, clear visibility, and the ability to pause or disconnect.' },
                    { id: 'kp0tait6v', title: 'Statute 8 – Safe and Effective Systems', number: '44.9', content: 'Models affecting health, safety, or major life outcomes must be validated, monitored, and clearly labeled as assistive—not as final authority.' },
                    { id: '6jd3y4o58', title: 'Statute 9 – Non-Discrimination', number: '44.10', content: 'ONES may not worsen outcomes on protected attributes; bias testing and correction are mandatory for all major models.' },
                    { id: '8wsn54fuu', title: 'Statute 10 – Transparent Training', number: '44.11', content: 'Humans must know when their data trains models, at what level, and have the ability to opt out of non-essential model training.' },
                    { id: 'x5siic1of', title: 'Statute 11 – Accountable Operators', number: '44.12', content: 'Every critical decision path has traceable responsibility—to code, configuration, and humans in the loop.' },
                    { id: 'iqt7bzy5a', title: 'Statute 12 – Posthumous Respect', number: '44.13', content: 'After death, ONES enters memorial mode: read-only, no new inferences, access governed by the human\'s recorded wishes plus applicable law.' },
                ],
            },
        ],
    },
    {
        id: 'nxeortzok',
        title: 'BOOK XI',
        number: 'XI',
        subtitle: 'GLOSSARY/APPENDIX',
        chapters: [
            {
                id: 'l2gg6ax26',
                number: '45',
                title: 'Glossary / Appendix',
                pages: [
                    { id: 'yhcqwvhd0', title: 'Overview', number: '45.1', content: 'Book XI holds the shared language of the Youniverse: canonical definitions, abbreviations, and reference tables that keep humans, agents, and Oracles using the same words for the same things.' },
                    { id: 'yhmbp6m6v', title: 'Youniverse', number: '45.2', content: 'The whole integrated system of domains, tools, agents, and books that orbits one human\'s life and work.' },
                    { id: '4vx1i2hqi', title: 'ONES', number: '45.3', content: 'The lifelong AI companion: a persistent embedding of one human, tracking 80-year patterns in health, cognition, emotion, social life, lifestyle, and decision history.' },
                    { id: 'kzoz0am66', title: 'CORE SNAPSHOT', number: '45.4', content: 'Annual, ~5-10 KB compressed summary of a human across seven bands (Identity, Health, Cognitive, Emotional, Social, Lifestyle, Decision History).' },
                    { id: 'xm7g2vqa8', title: 'Oracle', number: '45.5', content: 'The routing intelligence that listens when a human speaks, maps the request to Canon and campaigns, selects agents/flows, and explains the plan before execution.' },
                    { id: 'if42by66p', title: 'Agent', number: '45.6', content: 'A bounded worker that performs exactly one defined job with scoped context, produces a single output package, and then forgets.' },
                    { id: '8yqmwg4m1', title: 'Humanot', number: '45.7', content: 'The human-first ethic inside ONES: a set of statutes and constraints that put the human\'s rights, safety, and sovereignty above product and growth concerns.' },
                    { id: 'lhtokprwn', title: 'Napkin Rule', number: '45.8', content: 'A compact, human-readable decision rule that can be sketched on a napkin and then encoded into the system as policy or routing logic.' },
                    { id: 'stzgj0mh4', title: 'Canon', number: '45.9', content: 'The versioned, navigable library of Books, chapters, and pages that define how the Youniverse thinks and behaves.' },
                    { id: 't9t3xzb18', title: 'BooksOS', number: '45.10', content: 'The operating model that treats Books and chapters as live system objects—governing behavior, schemas, and flows rather than just describing them.' },
                    { id: 'fhjkxk0vo', title: 'NotNotes', number: '45.11', content: 'The session-level capture layer that holds outputs, decks, and artifacts for a given project or sprint before they are distilled into Canon.' },
                    { id: 'wlyffyuwr', title: 'Execution Lifecycle (The Flow)', number: '45.12', content: 'Eight-step loop: Human speaks → Oracle routes → Agent works → Preview → Approved → Commit → NotNotes holds → Forgets.' },
                    { id: 'woi2kqn16', title: 'Temporary State', number: '45.13', content: 'Short-lived reasoning traces, drafts, and raw streams kept only until agent output is released, then discarded.' },
                    { id: 'w8b9x14rl', title: 'Memorial Mode', number: '45.14', content: 'Read-only ONES state after death: no new inferences/ingestion, access governed by recorded wishes plus law.' },
                    { id: '3ey5e0urn', title: 'Consent Event', number: '45.15', content: 'Append-only record tying data use to user_id, purpose, scope, and granted_at timestamp, revocable and auditable.' },
                    { id: 'zd7iy0kg6', title: 'BAA', number: '45.16', content: 'Business Associate Agreement; defines responsibilities/safeguards when handling PHI for HIPAA entities.' },
                    { id: 'vz11c14sk', title: 'CPT Codes', number: '45.17', content: 'Standard clinical billing codes ONES maps to for reimbursable services.' },
                    { id: '65ictmzq7', title: 'FDA Clearance Strategy', number: '45.18', content: 'Staged path to treat ONES features as regulated CDS/monitoring where needed and obtain approvals.' },
                ],
            },
        ],
    },
];
