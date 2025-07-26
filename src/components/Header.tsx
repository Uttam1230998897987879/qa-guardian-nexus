import { memo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Activity, Zap } from "lucide-react";

const Header = memo(() => {
  return (
    <header className="bg-card border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-lg">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">QA Guardian Nexus</h1>
              <p className="text-sm text-muted-foreground">Automated Quality Assurance Platform</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <a href="#dashboard" className="text-foreground hover:text-primary transition-colors">Dashboard</a>
            <a href="#tests" className="text-foreground hover:text-primary transition-colors">Test Runs</a>
            <a href="#reports" className="text-foreground hover:text-primary transition-colors">Reports</a>
            <a href="#settings" className="text-foreground hover:text-primary transition-colors">Settings</a>
          </nav>

          <div className="flex items-center gap-3">
            <Badge variant="outline" className="gap-1">
              <Activity className="h-3 w-3" />
              <span className="text-success">Online</span>
            </Badge>
            <Button variant="hero" size="sm">
              <Zap className="h-4 w-4" />
              Run Tests
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
});

Header.displayName = "Header";

export default Header;