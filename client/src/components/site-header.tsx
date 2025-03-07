import { Link } from "wouter";
import { Leaf } from "lucide-react";

export default function SiteHeader() {
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/">
          <a className="flex items-center gap-2 text-primary hover:text-primary/90">
            <Leaf className="h-6 w-6" />
            <span className="font-semibold text-lg">VeganEats</span>
          </a>
        </Link>
        
        <nav>
          <ul className="flex gap-6">
            <li>
              <Link href="/">
                <a className="text-gray-600 hover:text-primary">Directory</a>
              </Link>
            </li>
            <li>
              <Link href="/learn">
                <a className="text-gray-600 hover:text-primary">Learn</a>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
