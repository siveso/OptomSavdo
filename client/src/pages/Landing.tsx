import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingBag, Users, TrendingUp } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-primary">OptomSavdo</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            O'zbekistondagi eng yaxshi optom savdo platformasi. Eng sifatli mahsulotlar, 
            eng qulay narxlar va professional xizmat.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button asChild size="lg" className="text-lg px-8 py-4">
              <a href="/api/login">
                Kirish <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-4">
              <Link href="/products">
                Katalogni ko'rish
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="text-center p-6 bg-white rounded-xl shadow-sm">
              <ShoppingBag className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">1000+ Mahsulotlar</h3>
              <p className="text-gray-600">Har xil kategoriyalarda yuqori sifatli mahsulotlar</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl shadow-sm">
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">10,000+ Mijozlar</h3>
              <p className="text-gray-600">Bizga ishongan va mamnun mijozlarimiz</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl shadow-sm">
              <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Optom Chegirmalar</h3>
              <p className="text-gray-600">30% gacha chegirmalar optom xaridlarda</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
