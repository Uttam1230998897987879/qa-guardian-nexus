import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import heroImage from "@/assets/hero-qa-platform.jpg";

const HeroSection = () => {
  return (
    <section className="bg-gradient-hero py-16 px-4">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <Badge className="mb-4 bg-primary-glow/20 text-primary border-primary/30">
              Automated Quality Assurance
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold text-primary-foreground mb-6 leading-tight">
              Comprehensive Testing for Web & Mobile Applications
            </h1>
            <p className="text-xl text-primary-foreground/90 mb-8 leading-relaxed">
              Automate functional, smoke, regression, unit, and boundary value testing 
              with precise error locations and actionable mitigation suggestions.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button variant="secondary" size="lg" className="gap-2">
                <Play className="h-5 w-5" />
                Start Testing Now
              </Button>
              <Button variant="outline" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                View Demo
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="bg-white/10 backdrop-blur rounded-lg p-3">
                <CheckCircle className="h-6 w-6 text-success mx-auto mb-1" />
                <div className="text-2xl font-bold text-white">98%</div>
                <div className="text-sm text-white/80">Pass Rate</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-3">
                <AlertTriangle className="h-6 w-6 text-warning mx-auto mb-1" />
                <div className="text-2xl font-bold text-white">15</div>
                <div className="text-sm text-white/80">Active Tests</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-3">
                <XCircle className="h-6 w-6 text-destructive mx-auto mb-1" />
                <div className="text-2xl font-bold text-white">2</div>
                <div className="text-sm text-white/80">Critical Issues</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-3">
                <CheckCircle className="h-6 w-6 text-primary-glow mx-auto mb-1" />
                <div className="text-2xl font-bold text-white">247</div>
                <div className="text-sm text-white/80">Tests Run</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <Card className="bg-gradient-card border-0 shadow-2xl overflow-hidden">
              <img 
                src={heroImage} 
                alt="QA Platform Dashboard" 
                className="w-full h-auto rounded-lg"
              />
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;