/**
 * ==========================================================================
 * PORTFOLIO DATA - NAITIK // SOFTWARE ENGINEER & SYSTEMS ARCHITECT
 * Themed with the 24-spoke Konark Solar Wheel & Nataraja's Cosmic Dance
 * ==========================================================================
 */

window.PORTFOLIO_DATA = {
  personal: {
    name: "Naitik",
    fullName: "Naitik",
    title: "Software Engineer & Systems Architect",
    roleTagline: "Bridging architectural discipline, high performance, and timeless digital craft.",
    email: "naitik.engineer@example.com"
  },
  about: {
    headline: "Engineered with Precision, Driven by Continuous Creation.",
    paragraphs: [
      "I am a Software Engineer dedicated to constructing high-reliability, resilient systems and intuitive digital experiences. My technical journey spans distributed backend architectures, modern reactive frontends, and low-latency system design.",
      "Just as the cyclopean fire of Nataraja represents the eternal cycle of creation, transformation, and refinement, I view software through the lens of continuous evolution. From architecting scalable APIs to optimizing microsecond rendering performance, I strive to eliminate friction and build software that stands the test of scale."
    ],
    highlights: [
      { metric: "5+ Years", label: "Engineering Rigor" },
      { metric: "99.99%", label: "System Reliability" },
      { metric: "<15ms", label: "Target Latency" },
      { metric: "24 Spokes", label: "Cycles of Creation" }
    ],
    skillsCategories: [
      {
        category: "Distributed Core & Backend",
        skills: ["Go", "Rust", "Node.js / TypeScript", "Distributed Systems", "Kafka", "gRPC / Protobuf", "PostgreSQL", "Redis"]
      },
      {
        category: "Frontend Architecture & Graphics",
        skills: ["TypeScript", "React / Next.js", "WebGPU / WebGL", "GSAP / Canvas", "Tailwind CSS", "Micro-frontends"]
      },
      {
        category: "Systems & Infrastructure",
        skills: ["Kubernetes", "Docker", "AWS / Cloud Architecture", "Terraform", "CI/CD Pipelines", "Observability (OTel)"]
      }
    ]
  },
  history: [
    {
      period: "2023 — Present",
      location: "San Francisco, CA / Remote",
      role: "Senior Systems Engineer",
      company: "Aether Dynamics",
      description: "Leading the core infrastructure team in building decentralized telemetry pipelines and low-latency message distribution systems processing over 120M events daily.",
      achievements: [
        "Reduced 99th percentile end-to-end stream ingestion latency from 85ms to 12ms via zero-copy buffer pools in Go.",
        "Architected automated self-healing worker clusters, maintaining 99.995% uptime across 14 global edge nodes."
      ],
      tags: ["Go", "Kafka", "Kubernetes", "Distributed State", "gRPC"]
    },
    {
      period: "2021 — 2023",
      location: "Bengaluru, India",
      role: "Full-Stack Systems Architect",
      company: "Konark Labs",
      description: "Spearheaded the development of high-fidelity financial visualization platforms and high-throughput microservices for algorithmic trading backends.",
      achievements: [
        "Constructed GPU-accelerated canvas renderers capable of visualizing 50,000 tick updates per second at steady 60 FPS.",
        "Refactored legacy monolith into event-driven microservices, slashing memory consumption by 42%."
      ],
      tags: ["TypeScript", "WebGL", "Rust", "PostgreSQL", "Docker"]
    },
    {
      period: "2019 — 2021",
      location: "New Delhi, India",
      role: "Software Engineer",
      company: "Surya Interactive",
      description: "Developed cloud-native APIs, authentication subsystems, and interactive web applications adhering to clean architecture paradigms.",
      achievements: [
        "Engineered resilient multi-region database replication protocols with sub-second failover recovery.",
        "Authored internal developer tooling that accelerated team delivery cycles by 35%."
      ],
      tags: ["Node.js", "React", "AWS", "Redis", "Jest"]
    }
  ],
  projects: [
    {
      category: "Distributed Telemetry Engine",
      title: "Prabhamandala Stream Engine",
      description: "An ultra-low-latency distributed event streaming engine inspired by the circular halo of Nataraja, built for high-throughput sensor telemetry and deterministic event ordering.",
      metrics: "120M+ events/day • <8ms p99 latency • Zero packet loss",
      tech: ["Go", "Kafka", "Raft Consensus", "Prometheus", "Docker"],
      githubUrl: "https://github.com/example/prabhamandala-stream",
      demoUrl: "https://example.com/demo/prabhamandala"
    },
    {
      category: "Sacred Geometry & WebGL",
      title: "Konark 24-Spoke Celestial Chariot",
      description: "A mathematical, hardware-accelerated SVG and WebGL visualizer of the 13th-century Konark Sun Chariot wheel, calculating astronomical solar hours in real-time.",
      metrics: "Sub-millisecond mathematical rotation • 60 FPS scrub",
      tech: ["TypeScript", "GSAP ScrollTrigger", "SVG Math", "Web Audio API"],
      githubUrl: "https://github.com/example/konark-chariot",
      demoUrl: "https://example.com/demo/konark"
    },
    {
      category: "High-Throughput Storage",
      title: "Vedic Cache: Tiered Memory Engine",
      description: "An in-memory, lock-free key-value store with predictive prefetching and adaptive eviction algorithms tailored for high-concurrency read-heavy microservice fleets.",
      metrics: "2.4M Ops/sec single-node • Zero-copy serialization",
      tech: ["Rust", "eBPF", "Tokio", "SIMD Acceleration"],
      githubUrl: "https://github.com/example/vedic-cache",
      demoUrl: "https://example.com/demo/vedic-cache"
    }
  ],
  hobbies: [
    {
      glyph: "☸",
      title: "Cosmic Geometry & Konark Architecture",
      tagline: "The Mathematical Poetry of Ancient Solar Wheels",
      narrative: "I study the sacred proportions, astronomical geometry, and mechanical symmetry found in historical temples like Konark and Khajuraho. The 24 spokes represent the hours of cosmic rhythm, serving as an enduring reminder that true software architecture must possess structural equilibrium and timeless beauty.",
      quote: "Form follows geometry; rhythm sustains scale."
    },
    {
      glyph: "🔥",
      title: "Nataraja & The Physics of Creation",
      tagline: "Creation, Preservation, and the Cosmic Fire of Dissolution",
      narrative: "Nataraja's cosmic dance—Ananda Tandava—captures the continuous thermodynamic transmutation of matter. In engineering, every module must welcome the fire of refactoring: shedding monolithic weight so new, resilient patterns can sprout from the ashes of legacy code.",
      quote: "To build enduring systems, one must fearlessly burn away architectural bloat."
    },
    {
      glyph: "⚡",
      title: "Algorithmic Harmonics & Sound Synthesis",
      tagline: "Exploring Waves, Resonance, and Modular Synthesizers",
      narrative: "Outside software systems, I compose generative audio using modular analog synthesizers and custom DSP algorithms. The mathematics of sound waves, polyrhythms, and harmonic overtones deeply informs my intuition for distributed clock synchronization and queue backpressure.",
      quote: "Resonance in audio is balance in systems."
    }
  ]
};

