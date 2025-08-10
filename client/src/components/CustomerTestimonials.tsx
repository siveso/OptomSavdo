import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { t } from "@/lib/i18n";
import type { Testimonial } from "@shared/schema";

export function CustomerTestimonials() {
  const { language } = useLanguage();
  
  const { data: testimonials = [], isLoading } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials"],
    retry: false,
  });

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-200 rounded animate-pulse mb-4 w-64 mx-auto"></div>
            <div className="h-6 bg-gray-200 rounded animate-pulse w-96 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 animate-pulse">
                <div className="flex items-center mb-4">
                  <div className="flex space-x-1 mr-2">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <div key={j} className="w-4 h-4 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                  <div className="w-8 h-4 bg-gray-200 rounded"></div>
                </div>
                <div className="space-y-2 mb-6">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded mb-1 w-24"></div>
                    <div className="h-3 bg-gray-200 rounded w-32"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Default testimonials if no data from API
  const defaultTestimonials = [
    {
      id: "1",
      rating: 5,
      contentUz: "OptomSavdo orqali kompaniyamiz uchun kerakli mahsulotlarni juda qulay narxlarda xarid qildik. Optom chegirmalari va tez yetkazib berish xizmati a'lo!",
      contentRu: "Через OptomSavdo мы купили необходимые товары для нашей компании по очень выгодным ценам. Оптовые скидки и быстрая доставка на высшем уровне!",
      contentEn: "Through OptomSavdo we bought necessary products for our company at very competitive prices. Wholesale discounts and fast delivery service are excellent!",
      nameUz: "Akmal Karimov",
      nameRu: "Акмал Каримов",
      nameEn: "Akmal Karimov",
      positionUz: "IT kompaniya direktori",
      positionRu: "Директор IT компании",
      positionEn: "IT Company Director",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
    },
    {
      id: "2",
      rating: 5,
      contentUz: "Mazaga kelgan mahsulotlar sifati va OptomSavdo jamoasining xizmati. Har doim o'z vaqtida yetkazib beriladi. Tavsiya qilaman!",
      contentRu: "Нравится качество товаров и сервис команды OptomSavdo. Всегда доставляют вовремя. Рекомендую!",
      contentEn: "Love the quality of products and service from OptomSavdo team. Always delivered on time. Highly recommend!",
      nameUz: "Nigora Usmanova",
      nameRu: "Нигора Усманова",
      nameEn: "Nigora Usmanova",
      positionUz: "Restoran egasi",
      positionRu: "Владелец ресторана",
      positionEn: "Restaurant Owner",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
    },
    {
      id: "3",
      rating: 5,
      contentUz: "3 yildan beri OptomSavdo bilan ishlaymiz. Narxlar har doim raqobatbardosh, mahsulot sifati yuqori. Zo'r platforma!",
      contentRu: "Работаем с OptomSavdo уже 3 года. Цены всегда конкурентоспособные, качество товаров высокое. Отличная платформа!",
      contentEn: "We've been working with OptomSavdo for 3 years. Prices are always competitive, product quality is high. Great platform!",
      nameUz: "Bobur Toshmatov",
      nameRu: "Бобур Тошматов",
      nameEn: "Bobur Toshmatov",
      positionUz: "Savdo kompaniyasi",
      positionRu: "Торговая компания",
      positionEn: "Trading Company",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
    }
  ];

  const displayTestimonials = testimonials.length > 0 ? testimonials : defaultTestimonials;

  const getTestimonialContent = (testimonial: any) => {
    if (language === "uz") return testimonial.contentUz || testimonial.content;
    if (language === "ru") return testimonial.contentRu || testimonial.content;
    return testimonial.contentEn || testimonial.content;
  };

  const getTestimonialName = (testimonial: any) => {
    if (language === "uz") return testimonial.nameUz || testimonial.name;
    if (language === "ru") return testimonial.nameRu || testimonial.name;
    return testimonial.nameEn || testimonial.name;
  };

  const getTestimonialPosition = (testimonial: any) => {
    if (language === "uz") return testimonial.positionUz || testimonial.position;
    if (language === "ru") return testimonial.positionRu || testimonial.position;
    return testimonial.positionEn || testimonial.position;
  };

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">{t("customer_testimonials", language)}</h3>
          <p className="text-xl text-slate-600">{t("customer_testimonials_desc", language)}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayTestimonials.slice(0, 3).map((testimonial: any) => (
            <div key={testimonial.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400 mr-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < (testimonial.rating || 5) ? 'fill-current' : ''}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-slate-600">{testimonial.rating || 5}.0</span>
              </div>
              <p className="text-gray-700 mb-6 italic">
                "{getTestimonialContent(testimonial)}"
              </p>
              <div className="flex items-center">
                <img 
                  src={testimonial.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"}
                  alt={getTestimonialName(testimonial)}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{getTestimonialName(testimonial)}</h4>
                  <p className="text-sm text-slate-600">{getTestimonialPosition(testimonial)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
