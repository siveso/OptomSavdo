import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { BarChart3, Users, Package, Settings, FileText, Mail, Eye, Calendar, ArrowUpRight, Brain } from "lucide-react";
import AdminAIAssistant from "@/components/AdminAIAssistant";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [location, setLocation] = useLocation();

  // Dashboard stats
  const { data: orders = [], isLoading: isLoadingOrders } = useQuery({
    queryKey: ['/api/admin/orders'],
    enabled: !!user,
  });

  const { data: blogPosts = [], isLoading: isLoadingBlog } = useQuery({
    queryKey: ['/api/admin/blog'],
    enabled: !!user,
  });

  const { data: marketingMessages = [], isLoading: isLoadingMarketing } = useQuery({
    queryKey: ['/api/admin/marketing'],
    enabled: !!user,
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Kirish talab qilinadi</CardTitle>
            <CardDescription>
              Admin paneliga kirish uchun tizimga kirishingiz kerak.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => setLocation('/auth/login')}
              className="w-full"
            >
              Tizimga kirish
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoadingOrders || isLoadingBlog || isLoadingMarketing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  // Calculate stats
  const ordersArray = Array.isArray(orders) ? orders : [];
  const blogPostsArray = Array.isArray(blogPosts) ? blogPosts : [];
  const marketingMessagesArray = Array.isArray(marketingMessages) ? marketingMessages : [];
  
  const totalOrders = ordersArray.length;
  const pendingOrders = ordersArray.filter((order: any) => order.status === 'pending').length;
  const publishedPosts = blogPostsArray.filter((post: any) => post.isPublished).length;
  const draftPosts = blogPostsArray.filter((post: any) => !post.isPublished).length;
  const scheduledMessages = marketingMessagesArray.filter((msg: any) => msg.status === 'scheduled').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-sm text-gray-600">OptomSavdo boshqaruv paneli</p>
            </div>
            <Button variant="outline" onClick={() => setLocation('/')}>
              <Eye className="w-4 h-4 mr-2" />
              Saytni ko'rish
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              AI Yordamchi
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Buyurtmalar
            </TabsTrigger>
            <TabsTrigger value="blog" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Blog
            </TabsTrigger>
            <TabsTrigger value="marketing" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Marketing
            </TabsTrigger>
            <TabsTrigger value="seo" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              SEO
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Foydalanuvchilar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Jami buyurtmalar
                  </CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalOrders}</div>
                  <p className="text-xs text-muted-foreground">
                    {pendingOrders} ta kutilmoqda
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Blog postlari
                  </CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{publishedPosts}</div>
                  <p className="text-xs text-muted-foreground">
                    {draftPosts} ta qoralama
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Marketing xabarlari
                  </CardTitle>
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{marketingMessagesArray.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {scheduledMessages} ta rejalashtirilgan
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Faol foydalanuvchilar
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">142</div>
                  <p className="text-xs text-muted-foreground">
                    +12% o'tgan oyga nisbatan
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>So'ngi buyurtmalar</CardTitle>
                  <CardDescription>
                    Eng yangi kelgan buyurtmalar ro'yxati
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {ordersArray.slice(0, 5).map((order: any, index: number) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Package className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Buyurtma #{order.id?.slice(0, 8)}</p>
                            <p className="text-xs text-gray-500">{order.user?.name}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">${order.totalAmount}</p>
                          <Badge variant={order.status === 'pending' ? 'secondary' : 'default'}>
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    <ArrowUpRight className="w-4 h-4 mr-2" />
                    Barchasini ko'rish
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>So'ngi blog postlari</CardTitle>
                  <CardDescription>
                    Yaqinda yaratilgan blog postlari
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {blogPostsArray.slice(0, 5).map((post: any, index: number) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <FileText className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium line-clamp-1">{post.title}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(post.createdAt).toLocaleDateString('uz-UZ')}
                            </p>
                          </div>
                        </div>
                        <Badge variant={post.isPublished ? 'default' : 'secondary'}>
                          {post.isPublished ? 'Nashr qilingan' : 'Qoralama'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    <ArrowUpRight className="w-4 h-4 mr-2" />
                    Barchasini boshqarish
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="ai">
            <AdminAIAssistant />
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Buyurtmalar boshqaruvi</CardTitle>
                <CardDescription>
                  Barcha buyurtmalarni ko'rish va boshqarish
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Buyurtmalar jadvali tez orada qo'shiladi...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="blog">
            <Card>
              <CardHeader>
                <CardTitle>Blog boshqaruvi</CardTitle>
                <CardDescription>
                  Blog postlarini yaratish va tahrirlash
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Blog boshqaruvi tez orada qo'shiladi...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="marketing">
            <Card>
              <CardHeader>
                <CardTitle>Marketing xabarlari</CardTitle>
                <CardDescription>
                  AI yordamida marketing xabarlarini yaratish va yuborish
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Marketing boshqaruvi tez orada qo'shiladi...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seo">
            <Card>
              <CardHeader>
                <CardTitle>SEO sozlamalari</CardTitle>
                <CardDescription>
                  Sayt uchun SEO parametrlarini sozlash
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">SEO sozlamalari tez orada qo'shiladi...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Foydalanuvchilar boshqaruvi</CardTitle>
                <CardDescription>
                  Admin foydalanuvchilarni boshqarish
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Foydalanuvchilar boshqaruvi tez orada qo'shiladi...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;