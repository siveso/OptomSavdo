import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowLeft, CreditCard, Truck, Shield } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { t } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";

export default function Checkout() {
  const { isAuthenticated } = useAuth();
  const { language } = useLanguage();
  const { toast } = useToast();
  
  const [orderData, setOrderData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    paymentMethod: "card",
    notes: "",
  });

  const { data: cartItems = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/cart"],
    enabled: isAuthenticated,
    retry: false,
  });

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('uz-UZ').format(Number(price));
  };

  const getProductName = (product: any) => {
    if (language === "uz") return product.nameUz || product.name;
    if (language === "ru") return product.nameRu || product.name;
    return product.nameEn || product.name;
  };

  const calculateItemTotal = (item: any) => {
    const price = item.isWholesale ? item.product.wholesalePrice : item.product.retailPrice;
    return Number(price) * item.quantity;
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total: number, item: any) => total + calculateItemTotal(item), 0);
  };

  const shippingCost = calculateSubtotal() >= 500000 ? 0 : 25000;
  const totalAmount = calculateSubtotal() + shippingCost;

  const handleInputChange = (field: string, value: string) => {
    setOrderData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate order processing
    toast({
      title: language === "uz" ? "Buyurtma qabul qilindi!" :
             language === "ru" ? "Заказ принят!" :
             "Order received!",
      description: language === "uz" ? "Tez orada siz bilan bog'lanamiz" :
                   language === "ru" ? "Мы скоро свяжемся с вами" :
                   "We will contact you soon",
    });
    
    // In a real app, you would submit to your API and redirect to success page
    setTimeout(() => {
      window.location.href = "/";
    }, 2000);
  };

  const paymentMethods = [
    { value: "card", icon: CreditCard, labelUz: "Bank kartasi", labelRu: "Банковская карта", labelEn: "Credit Card" },
    { value: "uzcard", icon: CreditCard, labelUz: "UzCard", labelRu: "UzCard", labelEn: "UzCard" },
    { value: "humo", icon: CreditCard, labelUz: "Humo", labelRu: "Humo", labelEn: "Humo" },
    { value: "payme", icon: CreditCard, labelUz: "Payme", labelRu: "Payme", labelEn: "Payme" },
    { value: "click", icon: CreditCard, labelUz: "Click", labelRu: "Click", labelEn: "Click" },
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {language === "uz" ? "Buyurtma berish uchun tizimga kiring" :
               language === "ru" ? "Войдите в систему для оформления заказа" :
               "Please log in to place an order"}
            </h1>
            <Button asChild>
              <a href="/api/login">{t("login", language)}</a>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {language === "uz" ? "Savatchangiz bo'sh" :
               language === "ru" ? "Ваша корзина пуста" :
               "Your cart is empty"}
            </h1>
            <p className="text-slate-600 mb-6">
              {language === "uz" ? "Buyurtma berish uchun avval mahsulotlarni savatga qo'shing" :
               language === "ru" ? "Добавьте товары в корзину, чтобы оформить заказ" :
               "Add some products to your cart to place an order"}
            </p>
            <Link href="/products">
              <Button>{t("continue_shopping", language)}</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("checkout", language)}</h1>
            <p className="text-slate-600">
              {language === "uz" ? "Buyurtmangizni yakunlang" :
               language === "ru" ? "Завершите ваш заказ" :
               "Complete your order"}
            </p>
          </div>
          <Link href="/cart">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {language === "uz" ? "Savatga qaytish" :
               language === "ru" ? "Вернуться в корзину" :
               "Back to cart"}
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Checkout Form */}
          <div className="space-y-8">
            {/* Shipping Information */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Truck className="h-5 w-5 mr-2 text-primary" />
                {language === "uz" ? "Yetkazib berish ma'lumotlari" :
                 language === "ru" ? "Информация о доставке" :
                 "Shipping Information"}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">
                      {language === "uz" ? "Ism" : language === "ru" ? "Имя" : "First Name"} *
                    </Label>
                    <Input
                      id="firstName"
                      value={orderData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">
                      {language === "uz" ? "Familiya" : language === "ru" ? "Фамилия" : "Last Name"} *
                    </Label>
                    <Input
                      id="lastName"
                      value={orderData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={orderData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">
                      {language === "uz" ? "Telefon" : language === "ru" ? "Телефон" : "Phone"} *
                    </Label>
                    <Input
                      id="phone"
                      value={orderData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+998 (90) 123-45-67"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">
                    {language === "uz" ? "Manzil" : language === "ru" ? "Адрес" : "Address"} *
                  </Label>
                  <Input
                    id="address"
                    value={orderData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">
                      {language === "uz" ? "Shahar" : language === "ru" ? "Город" : "City"} *
                    </Label>
                    <Select value={orderData.city} onValueChange={(value) => handleInputChange("city", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder={language === "uz" ? "Shaharni tanlang" : language === "ru" ? "Выберите город" : "Select city"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tashkent">{language === "uz" ? "Toshkent" : language === "ru" ? "Ташкент" : "Tashkent"}</SelectItem>
                        <SelectItem value="samarkand">{language === "uz" ? "Samarqand" : language === "ru" ? "Самарканд" : "Samarkand"}</SelectItem>
                        <SelectItem value="bukhara">{language === "uz" ? "Buxoro" : language === "ru" ? "Бухара" : "Bukhara"}</SelectItem>
                        <SelectItem value="andijan">{language === "uz" ? "Andijon" : language === "ru" ? "Андижан" : "Andijan"}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="postalCode">
                      {language === "uz" ? "Pochta indeksi" : language === "ru" ? "Почтовый индекс" : "Postal Code"}
                    </Label>
                    <Input
                      id="postalCode"
                      value={orderData.postalCode}
                      onChange={(e) => handleInputChange("postalCode", e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">
                    {language === "uz" ? "Qo'shimcha izohlar" : language === "ru" ? "Дополнительные комментарии" : "Additional Notes"}
                  </Label>
                  <Textarea
                    id="notes"
                    value={orderData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    placeholder={language === "uz" ? "Buyurtma haqida qo'shimcha ma'lumot..." : 
                                 language === "ru" ? "Дополнительная информация о заказе..." : 
                                 "Additional information about your order..."}
                  />
                </div>
              </form>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-primary" />
                {language === "uz" ? "To'lov usuli" : language === "ru" ? "Способ оплаты" : "Payment Method"}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  const label = language === "uz" ? method.labelUz : 
                               language === "ru" ? method.labelRu : method.labelEn;
                  
                  return (
                    <label
                      key={method.value}
                      className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        orderData.paymentMethod === method.value
                          ? "border-primary bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.value}
                        checked={orderData.paymentMethod === method.value}
                        onChange={(e) => handleInputChange("paymentMethod", e.target.value)}
                        className="sr-only"
                      />
                      <Icon className="h-5 w-5 mr-3 text-primary" />
                      <span className="font-medium">{label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Items Summary */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                {language === "uz" ? "Buyurtma tarkibi" : language === "ru" ? "Состав заказа" : "Order Summary"}
              </h2>
              
              <div className="space-y-4 mb-6">
                {cartItems.map((item: any) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <img
                      src={item.product.images?.[0] || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9"}
                      alt={getProductName(item.product)}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 text-sm">
                        {getProductName(item.product)}
                      </h3>
                      <p className="text-sm text-slate-600">
                        {item.isWholesale ? (
                          <span className="text-accent">
                            {t("wholesale_price", language)} × {item.quantity}
                          </span>
                        ) : (
                          <span>
                            {t("retail_price", language).replace(":", "")} × {item.quantity}
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatPrice(calculateItemTotal(item).toString())} {t("som", language)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">
                    {language === "uz" ? "Mahsulotlar narxi" : language === "ru" ? "Стоимость товаров" : "Subtotal"}
                  </span>
                  <span className="font-medium">
                    {formatPrice(calculateSubtotal().toString())} {t("som", language)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">
                    {language === "uz" ? "Yetkazib berish" : language === "ru" ? "Доставка" : "Shipping"}
                  </span>
                  <span className="font-medium">
                    {shippingCost > 0 ? (
                      `${formatPrice(shippingCost.toString())} ${t("som", language)}`
                    ) : (
                      <span className="text-green-600 font-semibold">
                        {language === "uz" ? "Bepul" : language === "ru" ? "Бесплатно" : "Free"}
                      </span>
                    )}
                  </span>
                </div>

                {shippingCost > 0 && (
                  <p className="text-sm text-slate-500">
                    {language === "uz" ? "500,000 so'mdan yuqori xaridlarda yetkazib berish bepul" :
                     language === "ru" ? "Бесплатная доставка при заказе свыше 500,000 сум" :
                     "Free shipping on orders over 500,000 som"}
                  </p>
                )}
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>{language === "uz" ? "Jami to'lov" : language === "ru" ? "Итого к оплате" : "Total"}</span>
                    <span className="text-primary">
                      {formatPrice(totalAmount.toString())} {t("som", language)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-green-600 mr-2" />
                <p className="text-sm text-green-700">
                  {language === "uz" ? "Sizning ma'lumotlaringiz himoyalangan SSL shifrlash orqali" :
                   language === "ru" ? "Ваши данные защищены SSL-шифрованием" :
                   "Your information is secured with SSL encryption"}
                </p>
              </div>
            </div>

            {/* Place Order Button */}
            <Button
              onClick={handleSubmit}
              className="w-full bg-primary text-white font-semibold hover:bg-blue-700 py-4 text-lg"
            >
              {language === "uz" ? "Buyurtmani rasmiylashtirish" :
               language === "ru" ? "Оформить заказ" :
               "Place Order"}
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
