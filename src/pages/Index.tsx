import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import TestingSuite from "@/components/TestingSuite";
import Dashboard from "@/components/Dashboard";
import { WebsiteScanner } from "@/components/WebsiteScanner";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <TestingSuite />
      <WebsiteScanner />
      <Dashboard />
    </div>
  );
};

export default Index;
