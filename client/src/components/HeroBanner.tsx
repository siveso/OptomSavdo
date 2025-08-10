import { Button } from "@/components/ui/button";
import { Truck } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { t } from "@/lib/i18n";

export function HeroBanner() {
  const { language } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-primary to-blue-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {t("hero_title", language)} <span className="text-secondary">{t("hero_subtitle", language)}</span> {t("hero_platform", language)}
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              {t("hero_description", language)}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-secondary text-white px-8 py-4 text-lg font-semibold hover:bg-yellow-500 transform hover:scale-105 transition-all">
                {t("start_shopping", language)}
              </Button>
              <Button variant="outline" className="border-2 border-white text-white px-8 py-4 text-lg font-semibold hover:bg-white hover:text-primary transition-all">
                {t("view_catalog", language)}
              </Button>
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
              alt="E-commerce shopping showcase" 
              className="rounded-2xl shadow-2xl w-full h-auto transform hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="bg-accent text-white p-2 rounded-full">
                  <Truck className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{t("free_delivery", language)}</p>
                  <p className="text-sm text-gray-500">{t("within_24h", language)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
