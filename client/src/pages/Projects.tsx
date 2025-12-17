import { useState } from "react";
import { ArrowRight, ExternalLink } from "lucide-react";

interface Project {
  id: number;
  name: string;
  description: string;
  category: string;
  status: "active" | "upcoming" | "completed";
  url?: string;
  github?: string;
  image?: string;
}

const PROJECTS: Project[] = [
  {
    id: 1,
    name: "Arc DEX Protocol",
    description: "High-performance decentralized exchange built on Arc Network with advanced features like limit orders, flash swaps, and governance.",
    category: "DeFi",
    status: "active",
    url: "#",
    github: "https://github.com/0xalpacah/arc-dex",
    image: "🔄"
  },
  {
    id: 2,
    name: "Arc Lending Platform",
    description: "Decentralized lending and borrowing protocol with governance features, risk management, and yield farming opportunities.",
    category: "DeFi",
    status: "active",
    url: "#",
    github: "https://github.com/0xalpacah/arc-lending",
    image: "💰"
  },
  {
    id: 3,
    name: "Arc Bridge Protocol",
    description: "Cross-chain bridge enabling seamless asset transfers between Arc Network and other EVM chains with security audits.",
    category: "Infrastructure",
    status: "upcoming",
    url: "#",
    github: "https://github.com/0xalpacah/arc-bridge",
    image: "🌉"
  },
  {
    id: 4,
    name: "Arc NFT Marketplace",
    description: "Community-driven NFT marketplace with royalty management, collection verification, and integrated governance.",
    category: "NFT",
    status: "upcoming",
    url: "#",
    github: "https://github.com/0xalpacah/arc-nft",
    image: "🎨"
  },
  {
    id: 5,
    name: "Arc Analytics Dashboard",
    description: "Real-time analytics for Arc Network with metrics, charts, and insights for developers and traders.",
    category: "Tools",
    status: "completed",
    url: "#",
    github: "https://github.com/0xalpacah/arc-analytics",
    image: "📊"
  },
  {
    id: 6,
    name: "Arc SDK",
    description: "Comprehensive TypeScript SDK for building applications on Arc Network with type safety and developer experience.",
    category: "Developer Tools",
    status: "active",
    url: "#",
    github: "https://github.com/0xalpacah/arc-sdk",
    image: "🛠️"
  }
];

const CATEGORIES = ["All", "DeFi", "Infrastructure", "NFT", "Tools", "Developer Tools"];

const STATUS_COLORS = {
  active: "text-green-400 border-green-400",
  upcoming: "text-yellow-400 border-yellow-400",
  completed: "text-cyan-400 border-cyan-400"
};

const STATUS_LABELS = {
  active: "Active",
  upcoming: "Upcoming",
  completed: "Completed"
};

export default function Projects() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredProjects = selectedCategory === "All"
    ? PROJECTS
    : PROJECTS.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b py-12" style={{ borderColor: 'rgba(0, 255, 255, 0.2)' }}>
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-cyan-400 neon-cyan font-mono mb-4">
            [ CREATOR PROJECTS ]
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Explore innovative projects built on Arc Network by community creators. From DeFi protocols to developer tools, discover what's being built.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="border-b py-8" style={{ borderColor: 'rgba(0, 255, 255, 0.2)' }}>
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3">
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 border font-mono text-sm transition-all ${
                  selectedCategory === category
                    ? "bg-cyan-400 text-black border-cyan-400"
                    : "border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map(project => (
              <div
                key={project.id}
                className="border p-6 hover:shadow-lg transition-all group"
                style={{
                  borderColor: 'rgba(0, 255, 255, 0.3)',
                  backgroundColor: 'rgba(0, 20, 40, 0.5)'
                }}
              >
                {/* Header with Icon and Status */}
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{project.image}</div>
                  <span className={`text-xs font-mono border px-2 py-1 ${STATUS_COLORS[project.status]}`}>
                    {STATUS_LABELS[project.status]}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-cyan-400 mb-2 group-hover:text-magenta-400 transition-colors">
                  {project.name}
                </h3>

                {/* Category */}
                <p className="text-xs text-muted-foreground mb-3 font-mono">
                  {project.category}
                </p>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-6 line-clamp-3">
                  {project.description}
                </p>

                {/* Links */}
                <div className="flex gap-3 pt-4 border-t" style={{ borderColor: 'rgba(0, 255, 255, 0.1)' }}>
                  {project.url && (
                    <a
                      href={project.url}
                      className="flex items-center gap-2 text-cyan-400 hover:text-magenta-400 transition-colors text-sm flex-1"
                    >
                      <span>Website</span>
                      <ArrowRight size={14} />
                    </a>
                  )}
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-cyan-400 hover:text-magenta-400 transition-colors text-sm flex-1"
                    >
                      <span>GitHub</span>
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No projects found in this category.</p>
              <button
                onClick={() => setSelectedCategory("All")}
                className="btn-cyber text-sm"
              >
                View All Projects
              </button>
            </div>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <div className="border-t py-16" style={{ borderColor: 'rgba(0, 255, 255, 0.2)' }}>
        <div className="container mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl font-bold text-cyan-400 neon-cyan font-mono">
            [ BUILD WITH ARC ]
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have a project idea? Join the Arc Network community and start building. Access documentation, tools, and support from the community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/resources" className="btn-cyber">
              Explore Resources
            </a>
            <a href="/contract" className="btn-cyber">
              Register Your Project
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
