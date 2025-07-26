import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import TestingSuite from "@/components/TestingSuite";
import Dashboard from "@/components/Dashboard";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <TestingSuite />
      <Dashboard />
    </div>
  );
};

export default Index;
