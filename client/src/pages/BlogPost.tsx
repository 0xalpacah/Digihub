import React, { useState } from 'react';
import { Calendar, User, MessageCircle, Share2, ArrowLeft } from 'lucide-react';
import { useLocation } from 'wouter';

interface Comment {
  id: number;
  author: string;
  date: string;
  content: string;
  avatar: string;
}

const mockComments: Comment[] = [
  {
    id: 1,
    author: 'Alice Dev',
    date: 'Dec 15, 2025',
    content: 'Great article! This really helped me understand the Arc Network better. Looking forward to more technical deep dives.',
    avatar: 'AD',
  },
  {
    id: 2,
    author: 'Bob Builder',
    date: 'Dec 14, 2025',
    content: 'The performance improvements in v2.0 are impressive. Has anyone tested the new features yet?',
    avatar: 'BB',
  },
  {
    id: 3,
    author: 'Carol Crypto',
    date: 'Dec 14, 2025',
    content: 'Excited about the deterministic finality feature. This will make Arc more suitable for institutional adoption.',
    avatar: 'CC',
  },
];

export default function BlogPost() {
  const [, setLocation] = useLocation();
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState(mockComments);

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: comments.length + 1,
        author: 'You',
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        content: newComment,
        avatar: 'YO',
      };
      setComments([comment, ...comments]);
      setNewComment('');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <div className="border-b border-cyan-500 py-4">
        <div className="container mx-auto px-4">
          <button
            onClick={() => setLocation('/blog')}
            className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </button>
        </div>
      </div>

      {/* Article Header */}
      <section className="border-b border-cyan-500 py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="space-y-6">
            {/* Category & Featured Badge */}
            <div className="flex items-center gap-2">
              <span className="badge-cyber">ANNOUNCEMENT</span>
              <span className="inline-block px-2 py-1 bg-magenta-500 text-magenta-400 text-xs rounded border border-magenta-500">
                FEATURED
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-cyan-400 neon-cyan font-mono">
              Arc Network v2.0 Launch - Major Protocol Upgrade
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-400" />
                <span>Dec 15, 2025</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-cyan-400" />
                <span>Arc Team</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-cyan-400" />
                <span>{comments.length} Comments</span>
              </div>
            </div>

            {/* Featured Image */}
            <div className="h-96 bg-gradient-to-br from-cyan-500 to-magenta-500 opacity-10 rounded border border-cyan-500"></div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
            <p className="text-lg leading-relaxed">
              We are thrilled to announce the launch of Arc Network v2.0, a major protocol upgrade that brings significant improvements to performance, security, and developer experience. This release represents months of research, development, and community feedback.
            </p>

            <h2 className="text-2xl font-bold text-cyan-400 neon-cyan mt-8">Key Features</h2>

            <div className="space-y-4">
              <div className="card-cyber">
                <h3 className="text-lg font-bold text-magenta-400 mb-2">Improved Performance</h3>
                <p>
                  Block time has been reduced from 15 seconds to 12 seconds, and transaction throughput has increased by 40%. These improvements make Arc more suitable for high-frequency trading and DeFi applications.
                </p>
              </div>

              <div className="card-cyber">
                <h3 className="text-lg font-bold text-green-400 mb-2">Enhanced Security</h3>
                <p>
                  We've implemented new cryptographic protocols and improved validator selection mechanisms to enhance network security. The consensus layer is now more resistant to attacks.
                </p>
              </div>

              <div className="card-cyber">
                <h3 className="text-lg font-bold text-pink-400 mb-2">Developer Experience</h3>
                <p>
                  New developer tools, improved documentation, and enhanced debugging capabilities make it easier for developers to build on Arc Network.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-cyan-400 neon-cyan mt-8">Migration Guide</h2>

            <p>
              Existing applications on Arc Network v1.x can migrate to v2.0 with minimal changes. We've maintained backward compatibility for most features. Here's what you need to know:
            </p>

            <div className="bg-input p-4 rounded border border-cyan-500 font-mono text-sm">
              <p className="text-cyan-300">// Update your RPC endpoint to v2.0</p>
              <p className="text-cyan-300">const provider = new ethers.providers.JsonRpcProvider(</p>
              <p className="text-cyan-300 ml-4">'https://rpc.v2.arc.network'</p>
              <p className="text-cyan-300">);</p>
            </div>

            <h2 className="text-2xl font-bold text-cyan-400 neon-cyan mt-8">Timeline</h2>

            <div className="space-y-3">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-cyan-400 mt-2"></div>
                <div>
                  <p className="font-bold text-cyan-400">Dec 15, 2025 - Mainnet Launch</p>
                  <p className="text-sm">Arc Network v2.0 goes live on mainnet</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-magenta-400 mt-2"></div>
                <div>
                  <p className="font-bold text-magenta-400">Dec 22, 2025 - v1.x Sunset</p>
                  <p className="text-sm">Arc Network v1.x will be deprecated</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-green-400 mt-2"></div>
                <div>
                  <p className="font-bold text-green-400">Jan 1, 2026 - Full Migration</p>
                  <p className="text-sm">All validators must migrate to v2.0</p>
                </div>
              </div>
            </div>

            <p className="text-lg leading-relaxed mt-8">
              We're excited about the future of Arc Network and look forward to seeing what the community builds with these new capabilities. Thank you for your continued support!
            </p>
          </div>
        </div>
      </section>

      {/* Share Section */}
      <section className="border-y border-cyan-500 py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground">Share:</span>
            <button className="p-2 hover:bg-cyan-500 rounded transition-colors">
              <Share2 className="w-5 h-5 text-cyan-400" />
            </button>
          </div>
        </div>
      </section>

      {/* Comments Section */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-cyan-400 neon-cyan mb-8 font-mono">
            [ COMMENTS ]
          </h2>

          {/* Add Comment Form */}
          <div className="card-cyber mb-8">
            <h3 className="text-lg font-bold text-magenta-400 mb-4">Leave a Comment</h3>
            <div className="space-y-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts..."
                className="input-cyber w-full h-24 resize-none"
              />
              <div className="flex justify-end">
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className="btn-cyber disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Post Comment
                </button>
              </div>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="card-cyber">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="flex-shrink-0 w-10 h-10 rounded border border-cyan-500 bg-cyan-500 flex items-center justify-center">
                    <span className="text-sm font-bold text-cyan-400">{comment.avatar}</span>
                  </div>

                  {/* Comment Content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-cyan-400">{comment.author}</h4>
                      <span className="text-xs text-muted-foreground">{comment.date}</span>
                    </div>
                    <p className="text-muted-foreground">{comment.content}</p>
                    <div className="flex gap-4 mt-3 text-xs">
                      <button className="text-cyan-400 hover:text-cyan-300 transition-colors">
                        Reply
                      </button>
                      <button className="text-muted-foreground hover:text-cyan-400 transition-colors">
                        Like
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Posts */}
      <section className="border-t border-cyan-500 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-cyan-400 neon-cyan mb-8 font-mono">
            [ RELATED POSTS ]
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Related Post 1 */}
            <div className="card-cyber cursor-pointer hover:border-cyan-400">
              <div className="h-32 bg-gradient-to-br from-cyan-500 to-blue-500 opacity-10 rounded mb-4"></div>
              <h3 className="text-lg font-bold text-cyan-400 mb-2">Getting Started with Arc</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Complete guide to deploying your first smart contract.
              </p>
              <div className="text-xs text-muted-foreground">Dec 14, 2025</div>
            </div>

            {/* Related Post 2 */}
            <div className="card-cyber cursor-pointer hover:border-magenta-400">
              <div className="h-32 bg-gradient-to-br from-magenta-500 to-pink-500 opacity-10 rounded mb-4"></div>
              <h3 className="text-lg font-bold text-magenta-400 mb-2">Web3 Security Best Practices</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Essential security considerations for Arc developers.
              </p>
              <div className="text-xs text-muted-foreground">Dec 13, 2025</div>
            </div>

            {/* Related Post 3 */}
            <div className="card-cyber cursor-pointer hover:border-green-400">
              <div className="h-32 bg-gradient-to-br from-green-500 to-cyan-500 opacity-10 rounded mb-4"></div>
              <h3 className="text-lg font-bold text-green-400 mb-2">DeFi on Arc Network</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Building decentralized finance applications on Arc.
              </p>
              <div className="text-xs text-muted-foreground">Dec 12, 2025</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
