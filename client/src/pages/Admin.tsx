import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';

interface AdminPost {
  id: number;
  title: string;
  category: string;
  status: 'draft' | 'published';
  date: string;
  author: string;
  views: number;
}

const mockAdminPosts: AdminPost[] = [
  {
    id: 1,
    title: 'Arc Network v2.0 Launch - Major Protocol Upgrade',
    category: 'Announcement',
    status: 'published',
    date: 'Dec 15, 2025',
    author: 'Arc Team',
    views: 1247,
  },
  {
    id: 2,
    title: 'Getting Started with Arc - Complete Developer Guide',
    category: 'Tutorial',
    status: 'published',
    date: 'Dec 14, 2025',
    author: 'Dev Community',
    views: 892,
  },
  {
    id: 3,
    title: 'Web3 Security Best Practices for Arc Developers',
    category: 'Discussion',
    status: 'draft',
    date: 'Dec 13, 2025',
    author: 'Security Team',
    views: 0,
  },
];

export default function Admin() {
  const [posts, setPosts] = useState(mockAdminPosts);
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    category: 'Announcement',
    content: '',
  });

  const handleDeletePost = (id: number) => {
    setPosts(posts.filter(p => p.id !== id));
  };

  const handleAddPost = () => {
    if (newPost.title.trim()) {
      const post: AdminPost = {
        id: posts.length + 1,
        title: newPost.title,
        category: newPost.category,
        status: 'draft',
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        author: 'You',
        views: 0,
      };
      setPosts([post, ...posts]);
      setNewPost({ title: '', category: 'Announcement', content: '' });
      setShowNewPostForm(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <section className="border-b py-8" style={{ borderColor: 'rgba(0, 255, 255, 0.2)' }}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold text-cyan-400 neon-cyan font-mono">
              [ ADMIN PANEL ]
            </h1>
            <button
              onClick={() => setShowNewPostForm(!showNewPostForm)}
              className="btn-cyber flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Post
            </button>
          </div>
        </div>
      </section>

      {/* New Post Form */}
      {showNewPostForm && (
        <section className="border-b py-8" style={{ borderColor: 'rgba(0, 255, 255, 0.2)' }}>
          <div className="container mx-auto px-4">
            <div className="card-cyber max-w-2xl">
              <h2 className="text-2xl font-bold text-magenta-400 mb-6">Create New Post</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-mono text-cyan-400 mb-2">Title</label>
                  <input
                    type="text"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    placeholder="Post title..."
                    className="input-cyber w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-mono text-cyan-400 mb-2">Category</label>
                  <select
                    value={newPost.category}
                    onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                    className="input-cyber w-full"
                  >
                    <option>Announcement</option>
                    <option>Tutorial</option>
                    <option>Discussion</option>
                    <option>News</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-mono text-cyan-400 mb-2">Content</label>
                  <textarea
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    placeholder="Post content..."
                    className="input-cyber w-full h-32 resize-none"
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    onClick={handleAddPost}
                    className="btn-cyber"
                  >
                    Publish
                  </button>
                  <button
                    onClick={() => setShowNewPostForm(false)}
                    className="btn-cyber-magenta"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Posts Table */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-cyan-400 neon-cyan mb-6 font-mono">
            [ BLOG POSTS ]
          </h2>

          <div className="card-cyber overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottomColor: 'rgba(0, 255, 255, 0.3)' }} className="border-b">
                    <th className="px-4 py-3 text-left text-cyan-400 font-mono text-xs uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-4 py-3 text-left text-cyan-400 font-mono text-xs uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-4 py-3 text-left text-cyan-400 font-mono text-xs uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-cyan-400 font-mono text-xs uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-cyan-400 font-mono text-xs uppercase tracking-wider">
                      Views
                    </th>
                    <th className="px-4 py-3 text-left text-cyan-400 font-mono text-xs uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr
                      key={post.id}
                      style={{ borderBottomColor: 'rgba(0, 255, 255, 0.1)' }}
                      className="border-b hover:bg-cyan-500 transition-colors"
                    >
                      <td className="px-4 py-3 text-foreground font-mono">
                        {post.title}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: 'rgba(0, 255, 255, 0.1)', color: 'rgba(0, 255, 255, 0.9)' }}>
                          {post.category}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="text-xs px-2 py-1 rounded"
                          style={{
                            backgroundColor: post.status === 'published' ? 'rgba(0, 255, 0, 0.1)' : 'rgba(255, 165, 0, 0.1)',
                            color: post.status === 'published' ? 'rgba(0, 255, 0, 0.9)' : 'rgba(255, 165, 0, 0.9)',
                          }}
                        >
                          {post.status === 'published' ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-sm">
                        {post.date}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-sm">
                        {post.views}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button className="p-1 hover:bg-cyan-500 hover:bg-opacity-20 rounded transition-colors" title="View">
                            <Eye className="w-4 h-4 text-cyan-400" />
                          </button>
                          <button className="p-1 hover:bg-magenta-500 hover:bg-opacity-20 rounded transition-colors" title="Edit">
                            <Edit2 className="w-4 h-4 text-magenta-400" />
                          </button>
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="p-1 hover:bg-red-500 hover:bg-opacity-20 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-8 border-t" style={{ borderColor: 'rgba(0, 255, 255, 0.2)' }}>
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-cyan-400 neon-cyan mb-6 font-mono">
            [ STATISTICS ]
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Total Posts */}
            <div className="card-cyber">
              <p className="text-muted-foreground text-xs uppercase tracking-wider font-mono mb-2">
                Total Posts
              </p>
              <p className="text-3xl font-bold text-cyan-400 neon-cyan">
                {posts.length}
              </p>
            </div>

            {/* Published */}
            <div className="card-cyber">
              <p className="text-muted-foreground text-xs uppercase tracking-wider font-mono mb-2">
                Published
              </p>
              <p className="text-3xl font-bold text-green-400">
                {posts.filter(p => p.status === 'published').length}
              </p>
            </div>

            {/* Drafts */}
            <div className="card-cyber">
              <p className="text-muted-foreground text-xs uppercase tracking-wider font-mono mb-2">
                Drafts
              </p>
              <p className="text-3xl font-bold text-magenta-400">
                {posts.filter(p => p.status === 'draft').length}
              </p>
            </div>

            {/* Total Views */}
            <div className="card-cyber">
              <p className="text-muted-foreground text-xs uppercase tracking-wider font-mono mb-2">
                Total Views
              </p>
              <p className="text-3xl font-bold text-pink-400">
                {posts.reduce((sum, p) => sum + p.views, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
