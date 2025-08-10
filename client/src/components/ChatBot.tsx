import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/hooks/useLanguage";

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Salom! OptomSavdo yordamchi botiga xush kelibsiz. Sizga qanday yordam bera olaman?",
      isBot: true,
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const { language } = useLanguage();

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Add user message
    const newMessage = {
      id: messages.length + 1,
      text: inputMessage,
      isBot: false,
    };
    setMessages(prev => [...prev, newMessage]);

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: language === "uz" ? "Rahmat! Sizning so'rovingiz qabul qilindi. Tez orada javob beramiz." :
              language === "ru" ? "Спасибо! Ваш запрос принят. Мы скоро ответим." :
              "Thank you! Your request has been received. We will respond soon.",
        isBot: true,
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);

    setInputMessage("");
  };

  const getGreeting = () => {
    if (language === "uz") return "Salom! OptomSavdo yordamchi botiga xush kelibsiz. Sizga qanday yordam bera olaman?";
    if (language === "ru") return "Привет! Добро пожаловать в помощника OptomSavdo. Как я могу вам помочь?";
    return "Hello! Welcome to OptomSavdo assistant bot. How can I help you?";
  };

  const getPlaceholder = () => {
    if (language === "uz") return "Xabar yozing...";
    if (language === "ru") return "Напишите сообщение...";
    return "Type a message...";
  };

  return (
    <>
      {/* Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          className="bg-accent text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors transform hover:scale-110"
          onClick={() => setIsOpen(!isOpen)}
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 h-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 flex flex-col">
          {/* Header */}
          <div className="bg-accent text-white p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="font-semibold">OptomSavdo Support</h3>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-green-600"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                    message.isBot
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-primary text-white'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <Input
                type="text"
                placeholder={getPlaceholder()}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="sm" className="bg-accent hover:bg-green-600">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
