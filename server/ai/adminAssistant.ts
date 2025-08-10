import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export interface AdminRecommendation {
  type: 'product' | 'blog' | 'marketing' | 'seo' | 'order';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  action?: string;
}

export interface BlogPostSuggestion {
  title: string;
  content: string;
  metaDescription: string;
  keywords: string[];
  category: string;
}

export interface MarketingMessageSuggestion {
  type: 'telegram' | 'email' | 'sms';
  title: string;
  content: string;
  targetAudience: string;
  bestSendTime: string;
}

export class AdminAssistant {
  async getAdminRecommendations(adminData: {
    totalOrders: number;
    pendingOrders: number;
    publishedPosts: number;
    draftPosts: number;
    scheduledMessages: number;
    recentProducts: any[];
  }): Promise<AdminRecommendation[]> {
    try {
      const prompt = `O'zbekiston e-commerce platformasi uchun admin panel tavsiyalari yarating.

Ma'lumotlar:
- Jami buyurtmalar: ${adminData.totalOrders}
- Kutilayotgan buyurtmalar: ${adminData.pendingOrders}
- Nashr qilingan blog postlar: ${adminData.publishedPosts}
- Qoralama blog postlar: ${adminData.draftPosts}
- Rejalashtirilgan marketing xabarlar: ${adminData.scheduledMessages}

5 ta muhim tavsiya bering JSON formatida:
{"recommendations": [{"type": "order", "title": "Buyurtmalarni tezlashtiring", "description": "Ko'p buyurtmalar kutilmoqda", "priority": "high", "action": "Buyurtmalarni qayta ko'rib chiqing"}]}`;

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const response = await model.generateContent(prompt);
      
      const text = response.response.text();
      const result = JSON.parse(text || '{"recommendations": []}');
      return result.recommendations || [];
    } catch (error) {
      console.error('Admin tavsiyalar yaratishda xato:', error);
      return [
        {
          type: 'order',
          title: 'Buyurtmalarni tekshiring',
          description: 'Kutilayotgan buyurtmalar mavjud',
          priority: 'medium',
          action: 'Buyurtmalar bo\'limiga o\'ting'
        }
      ];
    }
  }

  async generateBlogPostSuggestion(topic: string, keywords: string[] = []): Promise<BlogPostSuggestion | null> {
    try {
      const prompt = `O'zbekiston e-commerce mavzusida "${topic}" haqida blog post yarating.
Kalit so'zlar: ${keywords.join(', ')}

JSON formatida javob bering:
{"title": "SEO sarlavha", "content": "To'liq kontent", "metaDescription": "Meta tavsif", "keywords": ["kalit", "so'z"], "category": "kategoriya"}`;

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const response = await model.generateContent(prompt);
      
      const text = response.response.text();
      return JSON.parse(text || '{}');
    } catch (error) {
      console.error('Blog post yaratishda xato:', error);
      return null;
    }
  }

  async generateMarketingMessage(data: {
    type: 'telegram' | 'email' | 'sms';
    purpose: string;
    targetAudience: string;
    products?: string[];
    promotion?: string;
  }): Promise<MarketingMessageSuggestion | null> {
    try {
      const prompt = `O'zbekiston e-commerce platformasi uchun ${data.type} marketing xabari yarating.
Maqsad: ${data.purpose}
Auditoriya: ${data.targetAudience}

JSON formatida javob bering:
{"type": "${data.type}", "title": "Xabar sarlavhasi", "content": "To'liq xabar", "targetAudience": "Auditoriya", "bestSendTime": "Eng yaxshi vaqt"}`;

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const response = await model.generateContent(prompt);
      
      const text = response.response.text();
      const result = JSON.parse(text || '{}');
      return { ...result, type: data.type };
    } catch (error) {
      console.error('Marketing xabar yaratishda xato:', error);
      return null;
    }
  }

  async optimizeProductDescription(productData: {
    name: string;
    description: string;
    category: string;
    price: number;
    features?: string[];
  }): Promise<{
    optimizedDescription: string;
    seoKeywords: string[];
    marketingPoints: string[];
  } | null> {
    try {
      const prompt = `Mahsulot tavsifini optimizatsiya qiling:
Nomi: ${productData.name}
Tavsif: ${productData.description}
Kategoriya: ${productData.category}
Narx: ${productData.price}

JSON formatida javob bering:
{"optimizedDescription": "Yaxshilangan tavsif", "seoKeywords": ["kalit", "so'z"], "marketingPoints": ["marketing", "nuqta"]}`;

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const response = await model.generateContent(prompt);
      
      const text = response.response.text();
      return JSON.parse(text || '{}');
    } catch (error) {
      console.error('Mahsulot optimizatsiyasida xato:', error);
      return null;
    }
  }

  async analyzeSEO(siteData: {
    title?: string;
    description?: string;
    keywords?: string;
    pages: { url: string; title: string; description?: string }[];
  }): Promise<{
    score: number;
    issues: string[];
    recommendations: string[];
    improvedMetadata: {
      title: string;
      description: string;
      keywords: string[];
    };
  } | null> {
    try {
      const prompt = `SEO tahlil qiling:
Sarlavha: ${siteData.title || 'Noma\'lum'}
Tavsif: ${siteData.description || 'Noma\'lum'}
Sahifalar: ${siteData.pages.length}

JSON formatida javob bering:
{"score": 75, "issues": ["muammo1"], "recommendations": ["tavsiya1"], "improvedMetadata": {"title": "Yangi sarlavha", "description": "Yangi tavsif", "keywords": ["kalit"]}}`;

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const response = await model.generateContent(prompt);
      
      const text = response.response.text();
      return JSON.parse(text || '{}');
    } catch (error) {
      console.error('SEO tahlilida xato:', error);
      return null;
    }
  }
}

export const adminAssistant = new AdminAssistant();