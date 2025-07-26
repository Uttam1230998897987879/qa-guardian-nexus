import { lazy, Suspense } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import { Card } from "@/components/ui/card";

// Lazy load heavy components
const TestingSuite = lazy(() => import("@/components/TestingSuite"));
const WebsiteScanner = lazy(() => import("@/components/WebsiteScanner"));
const Dashboard = lazy(() => import("@/components/Dashboard"));

// Loading fallback component
const ComponentLoader = () => (
  <div className="flex items-center justify-center py-8">
    <Card className="p-6 w-full max-w-md">
      <div className="animate-pulse">
        <div className="h-4 bg-muted rounded mb-2"></div>
        <div className="h-4 bg-muted rounded w-3/4"></div>
      </div>
    </Card>
  </div>
);

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <Suspense fallback={<ComponentLoader />}>
        <TestingSuite />
      </Suspense>
      <Suspense fallback={<ComponentLoader />}>
        <WebsiteScanner />
      </Suspense>
      <Suspense fallback={<ComponentLoader />}>
        <Dashboard />
      </Suspense>
    </div>
  );
};

export default Index;
