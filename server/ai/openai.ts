import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY environment variable is required");
}

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generatePersonalizedMessage(
  userProfile: {
    name?: string;
    purchaseHistory: string[];
    preferences: string[];
    language: "uz" | "ru" | "en";
  },
  messageType: "email" | "sms",
  productRecommendation?: string
): Promise<{
  subject?: string;
  content: string;
}> {
  const languagePrompts = {
    uz: "O'zbek tilida",
    ru: "На русском языке", 
    en: "In English"
  };

  const systemPrompt = `You are a marketing expert creating personalized messages for customers. 
  Generate ${messageType} messages ${languagePrompts[userProfile.language]} based on customer data.
  Keep messages engaging and culturally appropriate for Uzbekistan market.`;

  const userPrompt = `
    Customer profile:
    - Name: ${userProfile.name || "Valued customer"}
    - Purchase history: ${userProfile.purchaseHistory.join(", ")}
    - Preferences: ${userProfile.preferences.join(", ")}
    ${productRecommendation ? `- Recommended product: ${productRecommendation}` : ""}
    
    Create a personalized ${messageType} message. 
    ${messageType === "email" ? 'Include both subject and content.' : 'Keep SMS under 160 characters.'}
    
    Respond in JSON format:
    ${messageType === "email" 
      ? '{"subject": "Email subject", "content": "Email content with HTML formatting"}'
      : '{"content": "SMS content"}'
    }
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      subject: result.subject,
      content: result.content
    };
  } catch (error) {
    console.error("Error generating personalized message:", error);
    throw new Error("Failed to generate personalized message");
  }
}

export async function analyzeCustomerBehavior(
  customerData: {
    purchaseHistory: any[];
    websiteActivity: any[];
    demographics: any;
  }
): Promise<{
  segment: string;
  preferences: string[];
  recommendedProducts: string[];
  nextBestAction: string;
}> {
  const systemPrompt = `You are a customer behavior analyst. Analyze customer data and provide insights 
  for marketing automation in an e-commerce platform serving Uzbekistan market.`;

  const userPrompt = `
    Analyze this customer data:
    Purchase History: ${JSON.stringify(customerData.purchaseHistory)}
    Website Activity: ${JSON.stringify(customerData.websiteActivity)}
    Demographics: ${JSON.stringify(customerData.demographics)}
    
    Provide analysis in JSON format:
    {
      "segment": "Customer segment (e.g., 'wholesale_buyer', 'retail_frequent', 'new_customer')",
      "preferences": ["preference1", "preference2"],
      "recommendedProducts": ["product1", "product2"],
      "nextBestAction": "Recommended marketing action"
    }
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", 
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      segment: result.segment || "unknown",
      preferences: result.preferences || [],
      recommendedProducts: result.recommendedProducts || [],
      nextBestAction: result.nextBestAction || "No specific action recommended"
    };
  } catch (error) {
    console.error("Error analyzing customer behavior:", error);
    throw new Error("Failed to analyze customer behavior");
  }
}

export async function optimizeContent(
  content: string,
  type: "product_description" | "blog_post" | "marketing_email",
  language: "uz" | "ru" | "en" = "uz"
): Promise<{
  optimizedContent: string;
  seoKeywords: string[];
  improvements: string[];
}> {
  const languagePrompts = {
    uz: "O'zbek tilida",
    ru: "На русском языке",
    en: "In English"
  };

  const systemPrompt = `You are a content optimization expert specializing in e-commerce content 
  for the Uzbekistan market. Optimize content for SEO and user engagement.`;

  const userPrompt = `
    Optimize this ${type} content ${languagePrompts[language]}:
    
    Original content: ${content}
    
    Provide optimization in JSON format:
    {
      "optimizedContent": "Improved content",
      "seoKeywords": ["keyword1", "keyword2"],
      "improvements": ["improvement1", "improvement2"]
    }
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      optimizedContent: result.optimizedContent || content,
      seoKeywords: result.seoKeywords || [],
      improvements: result.improvements || []
    };
  } catch (error) {
    console.error("Error optimizing content:", error);
    throw new Error("Failed to optimize content");
  }
}