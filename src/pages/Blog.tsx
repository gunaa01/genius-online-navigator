import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, FileText, List, Edit2, Trash2, Eye } from "lucide-react";
import { ContentForm } from "@/components/ai-content/ContentForm";
import StyledContentList from "@/components/StyledContentList";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { ContentItem, removeContent } from "@/store/slices/contentSlice";

const mockPosts = [
  {
    id: "welcome-to-genius-blog",
    title: "Welcome to the Genius Blog!",
    date: "2025-04-19",
    excerpt: "Get the latest updates, tips, and stories from the Genius team.",
    slug: "welcome-to-genius-blog",
    status: 'published' as const,
    author: 'Admin',
    categories: ['Getting Started'],
    tags: ['welcome', 'introduction']
  },
  {
    id: "grow-your-business-online-2025",
    title: "How to Grow Your Business Online in 2025",
    date: "2025-04-10",
    excerpt: "Our top strategies for digital growth and success this year.",
    slug: "grow-your-business-online-2025",
    status: 'published' as const,
    author: 'Admin',
    categories: ['Business Growth'],
    tags: ['strategy', 'growth']
  },
  {
    id: "feature-spotlight-dashboard",
    title: "Feature Spotlight: The Genius Dashboard",
    date: "2025-03-28",
    excerpt: "A deep dive into our dashboard and how it helps you stay in flow.",
    slug: "feature-spotlight-dashboard",
    status: 'published' as const,
    author: 'Admin',
    categories: ['Features', 'Product Updates'],
    tags: ['dashboard', 'features']
  }
];

const Blog = () => {
  const [activeTab, setActiveTab] = useState<string>("posts");
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [editingPost, setEditingPost] = useState<ContentItem | null>(null);
  const contentItems = useAppSelector(state => state.content.items);
  const dispatch = useAppDispatch();
  const [posts, setPosts] = useState<ContentItem[]>([]);
  
  // Initialize with mock posts if no content items exist
  useEffect(() => {
    if (contentItems && contentItems.length > 0) {
      setPosts(contentItems);
    } else {
      setPosts(mockPosts);
    }
  }, [contentItems]);

  const handleNewPost = () => {
    setEditingPost(null);
    setShowNewPostForm(true);
  };

  const handleEditPost = (id: string) => {
    const postToEdit = posts.find(post => post.id === id);
    if (postToEdit) {
      setEditingPost(postToEdit);
      setShowNewPostForm(true);
    }
  };

  const handleDeletePost = (id: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      dispatch(removeContent(id));
      setPosts(posts.filter(post => post.id !== id));
    }
  };

  const handleViewPost = (slug: string) => {
    // In a real app, this would navigate to the blog post
    console.log(`Viewing post: ${slug}`);
  };

  const handleFormSubmit = () => {
    setShowNewPostForm(false);
    setEditingPost(null);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Blog</h1>
          <p className="text-muted-foreground">
            Manage your blog posts and content
          </p>
        </div>
        <Button onClick={handleNewPost}>
          <Plus className="mr-2 h-4 w-4" /> New Post
        </Button>
      </div>

      <Tabs defaultValue="posts" className="w-full">
        <TabsList>
          <TabsTrigger value="posts" className="flex items-center gap-2">
            <List className="h-4 w-4" /> All Posts
          </TabsTrigger>
          <TabsTrigger value="create" className="flex items-center gap-2">
            <FileText className="h-4 w-4" /> Create New
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="mt-6">
          <StyledContentList
            items={posts}
            onEdit={handleEditPost}
            onDelete={handleDeletePost}
            onView={handleViewPost}
            emptyMessage="No blog posts found. Create your first post to get started!"
          />
        </TabsContent>

        <TabsContent value="create" className="mt-6">
          <div className="bg-card rounded-lg border p-6">
            {showNewPostForm || editingPost ? (
              <ContentForm
                mode="manual"
                initialContent={editingPost?.body || ''}
                onSubmit={(content) => {
                  // Save logic here (dispatch or API call)
                  handleFormSubmit();
                }}
              />
            ) : (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Create a new blog post</h3>
                <p className="text-muted-foreground mb-6">
                  Get started by creating a new blog post to share with your audience.
                </p>
                <Button onClick={handleNewPost}>
                  <Plus className="mr-2 h-4 w-4" /> New Post
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Blog;
