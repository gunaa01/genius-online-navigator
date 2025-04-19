
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Eye, Trash2, Plus } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

const blogPosts = [
  {
    id: "1",
    title: "Leverage AI to scale your online business",
    category: "AI Tools",
    status: "published",
    author: "Jane Cooper",
    date: "2023-04-23",
  },
  {
    id: "2",
    title: "Digital marketing strategies for 2025",
    category: "Marketing",
    status: "draft",
    author: "John Smith",
    date: "2023-04-22",
  },
  {
    id: "3",
    title: "Integrating social media with your website",
    category: "Social Media",
    status: "published",
    author: "Alex Johnson",
    date: "2023-04-21",
  },
  {
    id: "4",
    title: "E-commerce trends to watch in 2024",
    category: "E-commerce",
    status: "published",
    author: "Maria Rodriguez",
    date: "2023-04-20",
  },
  {
    id: "5",
    title: "Building your brand online: A step-by-step guide",
    category: "Branding",
    status: "draft",
    author: "Chris Lee",
    date: "2023-04-19",
  },
];

const landingPages = [
  {
    id: "1",
    title: "AI Features Landing Page",
    status: "published",
    editor: "Jane Cooper",
    updated: "2023-04-23",
    views: "2,450"
  },
  {
    id: "2",
    title: "Pricing Plans Comparison",
    status: "published",
    editor: "John Smith",
    updated: "2023-04-22",
    views: "1,893"
  },
  {
    id: "3",
    title: "Upcoming Webinar Registration",
    status: "draft",
    editor: "Alex Johnson",
    updated: "2023-04-21",
    views: "0"
  }
];

const AdminContent = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Content Management</h2>
          <p className="text-muted-foreground">
            Manage the content displayed throughout your Genius platform.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create New
        </Button>
      </div>
      
      <div className="flex items-center space-x-2">
        <Input 
          placeholder="Search content..." 
          className="max-w-sm"
        />
      </div>

      <Tabs defaultValue="blog" className="w-full">
        <TabsList>
          <TabsTrigger value="blog">Blog Posts</TabsTrigger>
          <TabsTrigger value="pages">Landing Pages</TabsTrigger>
          <TabsTrigger value="media">Media Library</TabsTrigger>
        </TabsList>
        
        <TabsContent value="blog">
          <Card>
            <CardHeader>
              <CardTitle>Blog Posts</CardTitle>
              <CardDescription>
                Manage your blog posts, articles and guides.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {blogPosts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell className="font-medium">{post.title}</TableCell>
                      <TableCell>{post.category}</TableCell>
                      <TableCell>
                        <Badge variant={post.status === "published" ? "default" : "secondary"}>
                          {post.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{post.author}</TableCell>
                      <TableCell>{post.date}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pages">
          <Card>
            <CardHeader>
              <CardTitle>Landing Pages</CardTitle>
              <CardDescription>
                Manage your website's landing pages and conversion points.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Editor</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {landingPages.map((page) => (
                    <TableRow key={page.id}>
                      <TableCell className="font-medium">{page.title}</TableCell>
                      <TableCell>
                        <Badge variant={page.status === "published" ? "default" : "secondary"}>
                          {page.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{page.editor}</TableCell>
                      <TableCell>{page.updated}</TableCell>
                      <TableCell>{page.views}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="media">
          <Card>
            <CardHeader>
              <CardTitle>Media Library</CardTitle>
              <CardDescription>
                Manage images, videos and other media files used in your content.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="relative aspect-square rounded-md overflow-hidden border">
                    <div className="absolute inset-0 bg-muted flex items-center justify-center">
                      <span className="text-muted-foreground">Image {i}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminContent;
