import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, X, Send, Bot } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/useLanguage";

interface ChatMessage {
  role: "user" | "bot";
  content: string;
  timestamp: Date;
}

export function ChatBot() {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      role: "bot", 
      content: language === "uz" ? "Salom! Men OptomSavdo AI yordamchisiman. Mahsulotlar haqida savol bering yoki yordam kerak bo'lsa so'rang!" :
               language === "ru" ? "Привет! Я AI помощник OptomSavdo. Задайте вопросы о продуктах или обратитесь за помощью!" :
               "Hello! I'm OptomSavdo AI assistant. Ask about products or request help!",
      timestamp: new Date() 
    }
  ]);
  const [inputValue, setInputValue] = useState("");

  // AI Chat mutation
  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await fetch('/api/chat/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, language }),
      });
      return await response.json();
    },
    onSuccess: (data) => {
      setMessages(prev => [...prev, { 
        role: "bot", 
        content: data.response || (language === "uz" ? "Kechirasiz, hozirda javob bera olmayapman. Iltimos keyinroq urinib ko'ring." :
                                   language === "ru" ? "Извините, сейчас не могу ответить. Попробуйте позже." :
                                   "Sorry, I can't respond right now. Please try later."),
        timestamp: new Date()
      }]);
    },
    onError: () => {
      setMessages(prev => [...prev, { 
        role: "bot", 
        content: language === "uz" ? "Uzr, texnik muammo yuz berdi. Iltimos, keyinroq urinib ko'ring yoki to'g'ridan-to'g'ri bog'laning." :
                 language === "ru" ? "Извините, произошла техническая ошибка. Попробуйте позже или свяжитесь напрямую." :
                 "Sorry, technical issue occurred. Please try later or contact directly.", 
        timestamp: new Date()
      }]);
    }
  });

  const handleSend = () => {
    if (!inputValue.trim() || chatMutation.isPending) return;
    
    const userMessage = inputValue.trim();
    setMessages(prev => [...prev, { role: "user", content: userMessage, timestamp: new Date() }]);
    setInputValue("");
    
    // Send to AI
    chatMutation.mutate(userMessage);
  };

  const quickResponses = language === "uz" ? 
    ["Mahsulot narxlari", "Yetkazib berish", "To'lov usullari", "Optom sotish"] :
    language === "ru" ?
    ["Цены на товары", "Доставка", "Способы оплаты", "Оптовые продажи"] :
    ["Product prices", "Delivery", "Payment methods", "Wholesale"];

  const handleQuickResponse = (response: string) => {
    setInputValue(response);
  };

  const getTitle = () => {
    if (language === "uz") return "AI Yordamchisi";
    if (language === "ru") return "AI Помощник";
    return "AI Assistant";
  };

  const getPlaceholder = () => {
    if (language === "uz") return "Savolingizni yozing...";
    if (language === "ru") return "Напишите ваш вопрос...";
    return "Type your question...";
  };

  const getQuickResponsesTitle = () => {
    if (language === "uz") return "Tez javoblar:";
    if (language === "ru") return "Быстрые ответы:";
    return "Quick responses:";
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg transition-all duration-300 hover:scale-110"
        size="icon"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        {!isOpen && (
          <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
        )}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-20 right-4 z-40 w-80 h-[480px] shadow-xl border-0 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <div>
                <CardTitle className="text-lg">{getTitle()}</CardTitle>
                <p className="text-sm text-blue-100">OptomSavdo</p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-0 flex flex-col h-[420px]">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-4 py-2 rounded-2xl ${
                    message.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-br-md' 
                      : 'bg-white text-gray-800 shadow-sm rounded-bl-md border'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString('uz-UZ', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              ))}
              
              {chatMutation.isPending && (
                <div className="flex justify-start">
                  <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-md shadow-sm border">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Responses */}
            {messages.length === 1 && (
              <div className="p-3 border-t bg-white">
                <p className="text-xs text-gray-500 mb-2">{getQuickResponsesTitle()}</p>
                <div className="flex flex-wrap gap-1">
                  {quickResponses.map((response, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs h-7"
                      onClick={() => handleQuickResponse(response)}
                    >
                      {response}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Input */}
            <div className="p-3 border-t bg-white flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={getPlaceholder()}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 rounded-full border-gray-300"
                disabled={chatMutation.isPending}
              />
              <Button 
                onClick={handleSend} 
                size="icon" 
                className="rounded-full"
                disabled={chatMutation.isPending || !inputValue.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}