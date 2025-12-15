import React, { useState } from 'react';
import { Search, Calendar, User, MessageCircle } from 'lucide-react';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  comments: number;
  featured: boolean;
}

const mockPosts: BlogPost[] = [
  {
    id: 1,
    title: 'Arc Network v2.0 Launch - Major Protocol Upgrade',
    slug: 'arc-v2-launch',
    excerpt: 'Introducing Arc Network v2.0 with improved performance, new features, and enhanced security.',
    category: 'Announcement',
    author: 'Arc Team',
    date: 'Dec 15, 2025',
    comments: 12,
    featured: true,
  },
  {
    id: 2,
    title: 'Getting Started with Arc - Complete Developer Guide',
    slug: 'getting-started-arc',
    excerpt: 'Step-by-step guide to deploying your first smart contract on Arc Network.',
    category: 'Tutorial',
    author: 'Dev Community',
    date: 'Dec 14, 2025',
    comments: 8,
    featured: true,
  },
  {
    id: 3,
    title: 'Web3 Security Best Practices for Arc Developers',
    slug: 'web3-security',
    excerpt: 'Essential security considerations and best practices for building on Arc Network.',
    category: 'Discussion',
    author: 'Security Team',
    date: 'Dec 13, 2025',
    comments: 24,
    featured: false,
  },
];

const categories = ['All', 'Announcement', 'Tutorial', 'Discussion', 'News'];

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = mockPosts.filter(post => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <section className="border-b py-16" style={{ borderColor: 'rgba(0, 255, 255, 0.2)' }}>
        <div className="container mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold text-cyan-400 neon-cyan mb-4 font-mono">
            [ ARC BLOG ]
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            News, tutorials, and discussions about Arc Network and Web3 development.
          </p>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="border-b py-8" style={{ borderColor: 'rgba(0, 255, 255, 0.2)' }}>
        <div className="container mx-auto px-4 space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan-400 opacity-50" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-cyber w-full pl-12 py-3"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded font-mono text-sm uppercase tracking-wider transition-all ${
                  selectedCategory === cat
                    ? 'bg-cyan-500 text-black border'
                    : 'bg-transparent border text-cyan-400 hover:border-cyan-400'
                }`}
                style={selectedCategory !== cat ? { borderColor: 'rgba(0, 255, 255, 0.3)' } : {}}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {selectedCategory === 'All' && (
        <section className="border-b py-12" style={{ borderColor: 'rgba(0, 255, 255, 0.2)' }}>
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-magenta-400 neon-magenta mb-8 font-mono">
              [ FEATURED ]
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mockPosts.filter(p => p.featured).map((post) => (
                <div
                  key={post.id}
                  className="card-cyber group cursor-pointer flex flex-col transition-colors"
                >
                  <div className="h-48 bg-gradient-to-br from-magenta-500 to-pink-500 opacity-10 rounded mb-6"></div>
                  
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="badge-cyber">{post.category}</span>
                      {post.featured && (
                        <span className="inline-block px-2 py-1 text-magenta-400 text-xs rounded border" style={{ backgroundColor: 'rgba(255, 0, 255, 0.2)', borderColor: 'rgba(255, 0, 255, 0.3)' }}>
                          FEATURED
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-magenta-400 group-hover:text-magenta-300 transition-colors">
                      {post.title}
                    </h3>

                    <p className="text-sm text-muted-foreground">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t mt-4" style={{ borderColor: 'rgba(0, 255, 255, 0.1)' }}>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {post.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {post.author}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-cyan-400">
                      <MessageCircle className="w-4 h-4" />
                      {post.comments}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Posts */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-cyan-400 neon-cyan mb-8 font-mono">
            [ {selectedCategory === 'All' ? 'ALL POSTS' : selectedCategory.toUpperCase()} ]
          </h2>

          <div className="space-y-4">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className="card-cyber group cursor-pointer p-6 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="badge-cyber">{post.category}</span>
                      </div>
                      <h3 className="text-lg font-bold text-cyan-400 group-hover:text-cyan-300 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2 text-xs text-muted-foreground whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {post.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4 text-cyan-400" />
                        <span className="text-cyan-400">{post.comments}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="card-cyber text-center py-12">
                <p className="text-muted-foreground">No posts found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Pagination */}
      <section className="py-12 border-t" style={{ borderColor: 'rgba(0, 255, 255, 0.2)' }}>
        <div className="container mx-auto px-4 flex justify-center gap-2">
          <button className="px-4 py-2 border text-cyan-400 rounded hover:border-cyan-400 transition-colors" style={{ borderColor: 'rgba(0, 255, 255, 0.3)' }}>
            ← Previous
          </button>
          <button className="px-4 py-2 bg-cyan-500 bg-opacity-20 border border-cyan-500 text-cyan-400 rounded">
            1
          </button>
          <button className="px-4 py-2 border text-cyan-400 rounded hover:border-cyan-400 transition-colors" style={{ borderColor: 'rgba(0, 255, 255, 0.3)' }}>
            2
          </button>
          <button className="px-4 py-2 border text-cyan-400 rounded hover:border-cyan-400 transition-colors" style={{ borderColor: 'rgba(0, 255, 255, 0.3)' }}>
            Next →
          </button>
        </div>
      </section>
    </div>
  );
}
