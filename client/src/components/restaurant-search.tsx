import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface RestaurantSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export default function RestaurantSearch({ value, onChange }: RestaurantSearchProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        type="search"
        placeholder="Search restaurants..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10"
      />
    </div>
  );
}
