import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import NetworkDashboard from "@/components/NetworkDashboard";
import { ArrowRight, Zap, Code2, Users, TrendingUp } from "lucide-react";


export default function Home() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-sm border-b" style={{ borderColor: 'rgba(0, 255, 255, 0.2)' }}>
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src="/digi-hub-logo-styled.png" alt="DIGI Hub" className="h-14 w-14 object-contain drop-shadow-lg" />
            <div className="text-2xl font-bold text-cyan-400 neon-cyan font-mono hidden sm:block">
              [ DIGI HUB ]
            </div>
          </a>
          <div className="flex items-center gap-4">
            <a href="#blog" className="text-sm uppercase tracking-wider hover:text-cyan-400 transition-colors">
              Blog
            </a>
            <a href="#resources" className="text-sm uppercase tracking-wider hover:text-cyan-400 transition-colors">
              Resources
            </a>
            <a href="#projects" className="text-sm uppercase tracking-wider hover:text-cyan-400 transition-colors">
              Projects
            </a>
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{user?.name}</span>
              </div>
            ) : (
              <a href={getLoginUrl()} className="btn-cyber text-xs">
                Login
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 border-b" style={{ borderColor: 'rgba(0, 255, 255, 0.2)' }}>
        <div className="absolute inset-0 bg-grid opacity-5"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Main Title with Glitch Effect */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold text-cyan-400 neon-cyan font-mono tracking-wider">
                DIGI HUB
              </h1>
              <div className="h-1 w-32 mx-auto bg-gradient-to-r from-cyan-500 via-magenta-500 to-cyan-500 opacity-70"></div>
              <p className="text-xl md:text-2xl text-muted-foreground font-mono">
                [ Web3 Platform • Crypto Dashboard • Portfolio Manager ]
              </p>
            </div>

            {/* Subtitle */}
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Your all-in-one Web3 hub for real-time crypto prices, gas tracking, portfolio management, and blockchain interactions. Powered by advanced analytics and community insights.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 flex-wrap">
              <a href="/dashboard" className="btn-cyber group inline-block">
                <span className="flex items-center gap-2">
                  Explore Dashboard
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </a>
              <a href="/blog" className="btn-cyber-magenta inline-block">
                Read Blog
              </a>
              <a href="/contract" className="btn-cyber-green inline-block">
                <span className="flex items-center gap-2">
                  Contract Interactions
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Network Dashboard Section */}
      <section className="py-16 md:py-24 border-b" style={{ borderColor: 'rgba(0, 255, 255, 0.2)' }}>
        <div className="container mx-auto px-4">
          <NetworkDashboard />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 border-b" style={{ borderColor: 'rgba(0, 255, 255, 0.2)' }}>
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-cyan-400 neon-cyan mb-12 font-mono">
            [ CORE FEATURES ]
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="card-cyber group">
              <div className="p-3 rounded border w-fit mb-4" style={{ backgroundColor: 'rgba(0, 255, 255, 0.1)', borderColor: 'rgba(0, 255, 255, 0.3)' }}>
                <Zap className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-lg font-bold text-cyan-400 mb-2">Real-time Metrics</h3>
              <p className="text-sm text-muted-foreground">
                Live network data, block information, and performance metrics updated in real-time.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card-cyber group">
              <div className="p-3 rounded border w-fit mb-4" style={{ backgroundColor: 'rgba(255, 0, 255, 0.1)', borderColor: 'rgba(255, 0, 255, 0.3)' }}>
                <Code2 className="w-6 h-6 text-magenta-400" />
              </div>
              <h3 className="text-lg font-bold text-magenta-400 mb-2">Developer Tools</h3>
              <p className="text-sm text-muted-foreground">
                Access to RPC endpoints, data indexers, and comprehensive API documentation.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card-cyber group">
              <div className="p-3 rounded border w-fit mb-4" style={{ backgroundColor: 'rgba(0, 255, 0, 0.1)', borderColor: 'rgba(0, 255, 0, 0.3)' }}>
                <Users className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-lg font-bold text-green-400 mb-2">Community Hub</h3>
              <p className="text-sm text-muted-foreground">
                Discussions, creator projects, and collaborative Web3 development initiatives.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="card-cyber group">
              <div className="p-3 rounded border w-fit mb-4" style={{ backgroundColor: 'rgba(255, 0, 127, 0.1)', borderColor: 'rgba(255, 0, 127, 0.3)' }}>
                <TrendingUp className="w-6 h-6 text-pink-400" />
              </div>
              <h3 className="text-lg font-bold text-pink-400 mb-2">Network Analytics</h3>
              <p className="text-sm text-muted-foreground">
                Deep insights into network activity, transactions, and ecosystem growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Preview Section */}
      <section id="blog" className="py-16 md:py-24 border-b" style={{ borderColor: 'rgba(0, 255, 255, 0.2)' }}>
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-cyan-400 neon-cyan mb-12 font-mono">
            [ LATEST POSTS ]
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Post Card 1 */}
            <div className="card-cyber group cursor-pointer hover:border-cyan-400 transition-colors" style={{ '--hover-border': 'rgba(0, 255, 255, 1)' } as any}>
              <div className="h-40 bg-gradient-to-br from-cyan-500 to-magenta-500 opacity-10 rounded mb-4"></div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="badge-cyber">ANNOUNCEMENT</span>
                </div>
                <h3 className="text-lg font-bold text-cyan-400">Arc Network v2.0 Launch</h3>
                <p className="text-sm text-muted-foreground">
                  Major protocol upgrade bringing improved performance and new features.
                </p>
                <div className="text-xs text-muted-foreground pt-2">Dec 15, 2025</div>
              </div>
            </div>

            {/* Post Card 2 */}
            <div className="card-cyber group cursor-pointer hover:border-magenta-400 transition-colors">
              <div className="h-40 bg-gradient-to-br from-magenta-500 to-pink-500 opacity-10 rounded mb-4"></div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="badge-cyber">TUTORIAL</span>
                </div>
                <h3 className="text-lg font-bold text-magenta-400">Getting Started with Arc</h3>
                <p className="text-sm text-muted-foreground">
                  Complete guide to deploying your first smart contract on Arc Network.
                </p>
                <div className="text-xs text-muted-foreground pt-2">Dec 14, 2025</div>
              </div>
            </div>

            {/* Post Card 3 */}
            <div className="card-cyber group cursor-pointer hover:border-green-400 transition-colors">
              <div className="h-40 bg-gradient-to-br from-green-500 to-cyan-500 opacity-10 rounded mb-4"></div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="badge-cyber">DISCUSSION</span>
                </div>
                <h3 className="text-lg font-bold text-green-400">Web3 Security Best Practices</h3>
                <p className="text-sm text-muted-foreground">
                  Community discussion on smart contract security and audit standards.
                </p>
                <div className="text-xs text-muted-foreground pt-2">Dec 13, 2025</div>
              </div>
            </div>
          </div>

          <div className="text-center pt-12">
            <button className="btn-cyber">
              View All Posts
            </button>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section id="resources" className="py-16 md:py-24 border-b" style={{ borderColor: 'rgba(0, 255, 255, 0.2)' }}>
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-cyan-400 neon-cyan mb-12 font-mono">
            [ DEVELOPER RESOURCES ]
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Resource Category 1 */}
            <div className="card-cyber">
              <h3 className="text-xl font-bold text-cyan-400 mb-4">Node Providers</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-green-400">→</span>
                  <a href="#" className="hover:text-cyan-400 transition-colors">Alchemy</a>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">→</span>
                  <a href="#" className="hover:text-cyan-400 transition-colors">Blockdaemon</a>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">→</span>
                  <a href="#" className="hover:text-cyan-400 transition-colors">dRPC</a>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">→</span>
                  <a href="#" className="hover:text-cyan-400 transition-colors">QuickNode</a>
                </li>
              </ul>
            </div>

            {/* Resource Category 2 */}
            <div className="card-cyber">
              <h3 className="text-xl font-bold text-magenta-400 mb-4">Data Indexers</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-green-400">→</span>
                  <a href="#" className="hover:text-magenta-400 transition-colors">Envio</a>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">→</span>
                  <a href="#" className="hover:text-magenta-400 transition-colors">Goldsky</a>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">→</span>
                  <a href="#" className="hover:text-magenta-400 transition-colors">The Graph</a>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">→</span>
                  <a href="#" className="hover:text-magenta-400 transition-colors">Thirdweb</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-cyan-400 neon-cyan mb-12 font-mono">
            [ CREATOR PROJECTS ]
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Project Card 1 */}
            <div className="card-cyber group">
              <div className="h-32 bg-gradient-to-br from-cyan-500 to-blue-500 opacity-10 rounded mb-4"></div>
              <h3 className="text-lg font-bold text-cyan-400 mb-2">Arc DEX Protocol</h3>
              <p className="text-sm text-muted-foreground mb-4">
                High-performance decentralized exchange built on Arc Network with advanced features.
              </p>
              <div className="flex gap-2">
                <a href="#" className="text-xs text-cyan-400 hover:text-cyan-300">Website →</a>
                <a href="#" className="text-xs text-cyan-400 hover:text-cyan-300">GitHub →</a>
              </div>
            </div>

            {/* Project Card 2 */}
            <div className="card-cyber group">
              <div className="h-32 bg-gradient-to-br from-magenta-500 to-pink-500 opacity-10 rounded mb-4"></div>
              <h3 className="text-lg font-bold text-magenta-400 mb-2">Arc Lending Platform</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Decentralized lending and borrowing protocol with governance features.
              </p>
              <div className="flex gap-2">
                <a href="#" className="text-xs text-magenta-400 hover:text-magenta-300">Website →</a>
                <a href="#" className="text-xs text-magenta-400 hover:text-magenta-300">GitHub →</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 text-center text-sm text-muted-foreground space-y-4" style={{ borderColor: 'rgba(0, 255, 255, 0.2)' }}>
        <div className="divider-cyber"></div>
        <p>Arc Network Hub © 2025 | Built with Web3 technologies</p>
        <p className="text-xs">
          <span className="text-green-400">●</span> Status: Operational | 
          <span className="text-cyan-400 ml-2">[ Network Status Monitor ]</span>
        </p>
        
        <div className="pt-6 border-t" style={{ borderColor: 'rgba(0, 255, 255, 0.1)' }}>
          <p className="text-sm font-bold text-cyan-400 mb-4 neon-cyan">Created by 0xalpacah</p>
          <div className="flex items-center justify-center gap-8 mb-4">
            <a href="https://github.com/0xalpacah/Digihub" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors font-mono text-sm">
              <span className="text-lg">◆</span>
              <span>GitHub: 0xalpacah/Digihub</span>
              <span className="text-xs">→</span>
            </a>
            <span className="text-cyan-400">|</span>
            <a href="https://x.com/drop_alpacah?s=21" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-magenta-400 hover:text-magenta-300 transition-colors font-mono text-sm">
              <span className="text-lg">◆</span>
              <span>X: @drop_alpacah</span>
              <span className="text-xs">→</span>
            </a>
          </div>
          <p className="text-xs text-gray-600 mt-3">Powered by Manus AI Platform</p>
        </div>
      </footer>
    </div>
  );
}
