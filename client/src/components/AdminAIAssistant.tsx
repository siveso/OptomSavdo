import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, MessageSquare, FileText, TrendingUp, Search, Sparkles } from "lucide-react";

import { useToast } from "@/hooks/use-toast";

interface AdminRecommendation {
  type: 'product' | 'blog' | 'marketing' | 'seo' | 'order';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  action?: string;
}

const AdminAIAssistant = () => {
  const [blogTopic, setBlogTopic] = useState("");
  const [blogKeywords, setBlogKeywords] = useState("");
  const [marketingType, setMarketingType] = useState<'telegram' | 'email' | 'sms'>('telegram');
  const [marketingPurpose, setMarketingPurpose] = useState("");
  const [marketingAudience, setMarketingAudience] = useState("");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Get AI recommendations
  const { data: recommendations = [], isLoading: loadingRecommendations } = useQuery({
    queryKey: ['/api/admin/ai/recommendations'],
  });

  // Blog suggestion mutation
  const blogSuggestionMutation = useMutation({
    mutationFn: async (data: { topic: string; keywords: string[] }) => {
      const response = await fetch('/api/admin/ai/blog-suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Blog tavsiyasi yaratildi",
        description: "AI yordamida yangi blog post tavsiyasi tayyor",
      });
    },
    onError: () => {
      toast({
        title: "Xatolik",
        description: "Blog tavsiyasini yaratishda xatolik yuz berdi",
        variant: "destructive",
      });
    },
  });

  // Marketing suggestion mutation
  const marketingSuggestionMutation = useMutation({
    mutationFn: async (data: {
      type: 'telegram' | 'email' | 'sms';
      purpose: string;
      targetAudience: string;
    }) => {
      const response = await fetch('/api/admin/ai/marketing-suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Marketing tavsiyasi yaratildi",
        description: "AI yordamida yangi marketing xabari tayyor",
      });
    },
    onError: () => {
      toast({
        title: "Xatolik",
        description: "Marketing tavsiyasini yaratishda xatolik yuz berdi",
        variant: "destructive",
      });
    },
  });

  const handleBlogSuggestion = () => {
    if (!blogTopic.trim()) {
      toast({
        title: "Xatolik",
        description: "Blog mavzusini kiriting",
        variant: "destructive",
      });
      return;
    }

    const keywords = blogKeywords.split(',').map(k => k.trim()).filter(k => k);
    blogSuggestionMutation.mutate({ topic: blogTopic, keywords });
  };

  const handleMarketingSuggestion = () => {
    if (!marketingPurpose.trim() || !marketingAudience.trim()) {
      toast({
        title: "Xatolik",
        description: "Marketing maqsadi va auditoriyasini kiriting",
        variant: "destructive",
      });
      return;
    }

    marketingSuggestionMutation.mutate({
      type: marketingType,
      purpose: marketingPurpose,
      targetAudience: marketingAudience,
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'blog': return <FileText className="w-4 h-4" />;
      case 'marketing': return <MessageSquare className="w-4 h-4" />;
      case 'seo': return <Search className="w-4 h-4" />;
      case 'order': return <TrendingUp className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            AI Yordamchisi
          </CardTitle>
          <CardDescription>
            AI yordamida admin panel uchun tavsiyalar va avtomatlashtirish
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="recommendations" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="recommendations">Tavsiyalar</TabsTrigger>
          <TabsTrigger value="blog">Blog yaratish</TabsTrigger>
          <TabsTrigger value="marketing">Marketing</TabsTrigger>
          <TabsTrigger value="seo">SEO tahlil</TabsTrigger>
        </TabsList>

        <TabsContent value="recommendations">
          <Card>
            <CardHeader>
              <CardTitle>AI Tavsiyalari</CardTitle>
              <CardDescription>
                Biznes holatiga asoslangan shaxsiy tavsiyalar
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingRecommendations ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2">AI tavsiyalarni yaratmoqda...</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {(recommendations as AdminRecommendation[]).map((rec: AdminRecommendation, index: number) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(rec.type)}
                          <h3 className="font-medium">{rec.title}</h3>
                        </div>
                        <Badge variant={getPriorityColor(rec.priority)}>
                          {rec.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                      {rec.action && (
                        <p className="text-sm text-blue-600 font-medium">
                          📝 {rec.action}
                        </p>
                      )}
                    </div>
                  ))}
                  {(recommendations as AdminRecommendation[]).length === 0 && (
                    <p className="text-center text-gray-500 py-8">
                      Hozircha tavsiyalar yo'q
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blog">
          <Card>
            <CardHeader>
              <CardTitle>AI Blog Post Yaratish</CardTitle>
              <CardDescription>
                AI yordamida SEO optimizatsiya qilingan blog postlar yarating
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="blogTopic">Blog mavzusi</Label>
                <Input
                  id="blogTopic"
                  placeholder="Masalan: E-commerce tendentsiyalari 2025"
                  value={blogTopic}
                  onChange={(e) => setBlogTopic(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="blogKeywords">Kalit so'zlar (vergul bilan ajrating)</Label>
                <Input
                  id="blogKeywords"
                  placeholder="e-commerce, savdo, online"
                  value={blogKeywords}
                  onChange={(e) => setBlogKeywords(e.target.value)}
                />
              </div>
              <Button 
                onClick={handleBlogSuggestion}
                disabled={blogSuggestionMutation.isPending}
                className="w-full"
              >
                {blogSuggestionMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    AI blog yozmoqda...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Blog post yaratish
                  </>
                )}
              </Button>
              {blogSuggestionMutation.data && (
                <div className="mt-4 p-4 border rounded-lg bg-green-50">
                  <h4 className="font-medium text-green-800 mb-2">
                    ✅ Blog post tavsiyasi tayyor!
                  </h4>
                  <p className="text-sm text-green-700">
                    Yangi blog post tavsiyasi yaratildi. Uni blog boshqaruv bo'limida ko'rishingiz mumkin.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marketing">
          <Card>
            <CardHeader>
              <CardTitle>AI Marketing Xabarlari</CardTitle>
              <CardDescription>
                Maqsadli auditoriya uchun shaxsiy marketing xabarlar yarating
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="marketingType">Xabar turi</Label>
                <Select value={marketingType} onValueChange={(value: any) => setMarketingType(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Xabar turini tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="telegram">Telegram</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="marketingPurpose">Marketing maqsadi</Label>
                <Textarea
                  id="marketingPurpose"
                  placeholder="Masalan: Yangi mahsulotlar haqida xabar berish"
                  value={marketingPurpose}
                  onChange={(e) => setMarketingPurpose(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="marketingAudience">Maqsadli auditoriya</Label>
                <Input
                  id="marketingAudience"
                  placeholder="Masalan: Yosh tadbirkorlar"
                  value={marketingAudience}
                  onChange={(e) => setMarketingAudience(e.target.value)}
                />
              </div>
              <Button 
                onClick={handleMarketingSuggestion}
                disabled={marketingSuggestionMutation.isPending}
                className="w-full"
              >
                {marketingSuggestionMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    AI xabar yozmoqda...
                  </>
                ) : (
                  <>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Marketing xabari yaratish
                  </>
                )}
              </Button>
              {marketingSuggestionMutation.data && (
                <div className="mt-4 p-4 border rounded-lg bg-blue-50">
                  <h4 className="font-medium text-blue-800 mb-2">
                    ✅ Marketing xabari tayyor!
                  </h4>
                  <p className="text-sm text-blue-700">
                    Yangi marketing xabari yaratildi. Uni marketing bo'limida ko'rishingiz mumkin.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <CardTitle>SEO Tahlil va Optimizatsiya</CardTitle>
              <CardDescription>
                AI yordamida saytingizning SEO holatini tahlil qiling
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Search className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">SEO tahlil funksiyasi tez orada qo'shiladi</p>
                <Button variant="outline" className="mt-4">
                  SEO tahlilni boshlash
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminAIAssistant;