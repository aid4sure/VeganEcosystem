import { Card, CardContent } from "@/components/ui/card";
import { Leaf, Sprout, Globe2, Recycle } from "lucide-react";

export default function Learn() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Learn About Veganism</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover how a plant-based diet benefits your health, the environment, and animal welfare.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <Leaf className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold">Health Benefits</h2>
            </div>
            <p className="text-gray-600">
              A well-planned vegan diet is rich in fiber, vitamins, and minerals while being lower in 
              saturated fats. Studies show it can reduce the risk of heart disease, certain cancers, 
              and type 2 diabetes.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <Globe2 className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold">Environmental Impact</h2>
            </div>
            <p className="text-gray-600">
              Animal agriculture is a leading cause of greenhouse gas emissions, deforestation, and 
              water pollution. Choosing plant-based meals significantly reduces your carbon footprint.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <Sprout className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold">Getting Started</h2>
            </div>
            <p className="text-gray-600">
              Start by incorporating more plant-based meals into your diet. Try meat alternatives, 
              explore new vegetables, and experiment with different cuisines. Our restaurant directory 
              can help you discover delicious vegan options.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <Recycle className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold">Sustainability Tips</h2>
            </div>
            <p className="text-gray-600">
              Beyond diet, consider bringing your own containers for takeout, choose restaurants that 
              use sustainable packaging, and support establishments that source locally and minimize 
              food waste.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {[
          "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
          "https://images.unsplash.com/photo-1490818387583-1baba5e638af",
          "https://images.unsplash.com/photo-1541014741259-de529411b96a"
        ].map((url, index) => (
          <div
            key={index}
            className="h-64 rounded-lg bg-cover bg-center"
            style={{ backgroundImage: `url(${url})` }}
          />
        ))}
      </div>
    </div>
  );
}
