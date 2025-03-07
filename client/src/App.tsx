import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Restaurant from "@/pages/restaurant";
import Learn from "@/pages/learn";
import GiftCards from "@/pages/gift-cards";
import AdminLogin from "@/pages/admin/login";
import AdminDashboard from "@/pages/admin/dashboard";
import RestaurantForm from "@/pages/admin/restaurant-form";
import SiteHeader from "@/components/site-header";

function Router() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container mx-auto px-4 py-8">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/restaurant/:id" component={Restaurant} />
          <Route path="/learn" component={Learn} />
          <Route path="/gift-cards" component={GiftCards} />
          <Route path="/admin" component={AdminLogin} />
          <Route path="/admin/dashboard" component={AdminDashboard} />
          <Route path="/admin/restaurants/new" component={RestaurantForm} />
          <Route path="/admin/restaurants/:id/edit">
            {(params) => <RestaurantForm initialData={undefined} />}
          </Route>
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;