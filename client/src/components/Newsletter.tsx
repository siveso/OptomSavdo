import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/hooks/useLanguage";
import { t } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";

export function Newsletter() {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: language === "uz" ? "Muvaffaqiyatli!" : 
               language === "ru" ? "Успешно!" : "Success!",
        description: language === "uz" ? "Siz muvaffaqiyatli obuna bo'ldingiz!" :
                     language === "ru" ? "Вы успешно подписались!" : "You have successfully subscribed!",
      });
      setEmail("");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <section className="py-16 bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-white">
          <h3 className="text-3xl font-bold mb-4">{t("newsletter_title", language)}</h3>
          <p className="text-xl text-blue-100 mb-8">
            {t("newsletter_desc", language)}
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row max-w-md mx-auto gap-4">
            <Input
              type="email"
              placeholder={t("email_placeholder", language)}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 text-gray-900 bg-white"
              required
            />
            <Button 
              type="submit"
              className="bg-secondary text-white font-semibold hover:bg-yellow-500 transition-colors whitespace-nowrap"
              disabled={isLoading}
            >
              {isLoading ? "..." : t("subscribe", language)}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
