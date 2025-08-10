import { GoogleGenerativeAI } from "@google/genai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable is required");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateBlogPost(topic: string, language: "uz" | "ru" | "en" = "uz"): Promise<{
  title: string;
  content: string;
  metaDescription: string;
  tags: string[];
}> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const languagePrompts = {
    uz: `O'zbek tilida "${topic}" mavzusida blog maqola yozing. Maqola biznes, ishlab chiqarish va marketing haqida bo'lishi kerak. 
         Maqola SEO uchun optimallashtirilgan bo'lishi kerak va 800-1200 so'zdan iborat bo'lishi kerak.
         JSON formatida javob bering:
         {
           "title": "Maqola sarlavhasi",
           "content": "To'liq maqola matni (HTML teglari bilan)",
           "metaDescription": "150 belgicha meta tavsif",
           "tags": ["tag1", "tag2", "tag3"]
         }`,
    ru: `Напишите статью для блога на русском языке на тему "${topic}". Статья должна быть о бизнесе, производстве и маркетинге.
         Статья должна быть оптимизирована для SEO и содержать 800-1200 слов.
         Ответьте в формате JSON:
         {
           "title": "Заголовок статьи",
           "content": "Полный текст статьи (с HTML тегами)",
           "metaDescription": "Мета описание до 150 символов",
           "tags": ["тег1", "тег2", "тег3"]
         }`,
    en: `Write a blog article in English about "${topic}". The article should be about business, manufacturing, and marketing.
         The article should be SEO optimized and contain 800-1200 words.
         Respond in JSON format:
         {
           "title": "Article title",
           "content": "Full article text (with HTML tags)",
           "metaDescription": "Meta description up to 150 characters",
           "tags": ["tag1", "tag2", "tag3"]
         }`
  };

  try {
    const result = await model.generateContent(languagePrompts[language]);
    const response = await result.response;
    const text = response.text();
    
    // Parse JSON response
    const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
    const parsedResponse = JSON.parse(cleanText);
    
    return {
      title: parsedResponse.title,
      content: parsedResponse.content,
      metaDescription: parsedResponse.metaDescription,
      tags: parsedResponse.tags || []
    };
  } catch (error) {
    console.error("Error generating blog post:", error);
    throw new Error("Failed to generate blog post");
  }
}

export async function generateMarketingMessage(
  type: "telegram" | "email" | "sms",
  productName?: string,
  occasion?: string,
  language: "uz" | "ru" | "en" = "uz"
): Promise<{
  title?: string;
  content: string;
}> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const typePrompts = {
    telegram: {
      uz: `Telegram kanalida e'lon qilinadigan marketing xabari yozing. ${productName ? `Mahsulot: ${productName}` : ''} ${occasion ? `Voqea: ${occasion}` : ''}. 
           Xabar qisqa, jozibador va harakat qilishga undash bo'lishi kerak. Emoji ishlatishingiz mumkin.`,
      ru: `Напишите маркетинговое сообщение для публикации в Telegram канале. ${productName ? `Продукт: ${productName}` : ''} ${occasion ? `Повод: ${occasion}` : ''}.
           Сообщение должно быть кратким, привлекательным и призывающим к действию. Можно использовать эмодзи.`,
      en: `Write a marketing message for Telegram channel. ${productName ? `Product: ${productName}` : ''} ${occasion ? `Occasion: ${occasion}` : ''}.
           Message should be short, engaging and call-to-action. You can use emojis.`
    },
    email: {
      uz: `Email marketing xabari yozing. ${productName ? `Mahsulot: ${productName}` : ''} ${occasion ? `Voqea: ${occasion}` : ''}.
           JSON formatida javob bering: {"title": "Email sarlavhasi", "content": "Email matni (HTML bilan)"}`,
      ru: `Напишите email маркетинговое сообщение. ${productName ? `Продукт: ${productName}` : ''} ${occasion ? `Повод: ${occasion}` : ''}.
           Ответьте в JSON формате: {"title": "Заголовок email", "content": "Текст email (с HTML)"}`,
      en: `Write an email marketing message. ${productName ? `Product: ${productName}` : ''} ${occasion ? `Occasion: ${occasion}` : ''}.
           Respond in JSON format: {"title": "Email subject", "content": "Email text (with HTML)"}`
    },
    sms: {
      uz: `SMS marketing xabari yozing (160 belgi). ${productName ? `Mahsulot: ${productName}` : ''} ${occasion ? `Voqea: ${occasion}` : ''}.`,
      ru: `Напишите SMS маркетинговое сообщение (160 символов). ${productName ? `Продукт: ${productName}` : ''} ${occasion ? `Повод: ${occasion}` : ''}.`,
      en: `Write an SMS marketing message (160 characters). ${productName ? `Product: ${productName}` : ''} ${occasion ? `Occasion: ${occasion}` : ''}.`
    }
  };

  try {
    const result = await model.generateContent(typePrompts[type][language]);
    const response = await result.response;
    const text = response.text();

    if (type === "email") {
      const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
      const parsedResponse = JSON.parse(cleanText);
      return {
        title: parsedResponse.title,
        content: parsedResponse.content
      };
    }

    return {
      content: text.trim()
    };
  } catch (error) {
    console.error("Error generating marketing message:", error);
    throw new Error("Failed to generate marketing message");
  }
}

export async function analyzeWebsiteData(salesData: any[], userBehavior: any[]): Promise<{
  recommendations: string[];
  insights: string[];
}> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    Veb-sayt ma'lumotlarini tahlil qiling va marketing tavsiyalari bering:
    
    Sotish ma'lumotlari: ${JSON.stringify(salesData)}
    Foydalanuvchi xatti-harakatlari: ${JSON.stringify(userBehavior)}
    
    JSON formatida javob bering:
    {
      "recommendations": ["Konkret tavsiya 1", "Konkret tavsiya 2", "..."],
      "insights": ["Muhim xulosalar 1", "Muhim xulosalar 2", "..."]
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
    const parsedResponse = JSON.parse(cleanText);
    
    return {
      recommendations: parsedResponse.recommendations || [],
      insights: parsedResponse.insights || []
    };
  } catch (error) {
    console.error("Error analyzing website data:", error);
    throw new Error("Failed to analyze website data");
  }
}