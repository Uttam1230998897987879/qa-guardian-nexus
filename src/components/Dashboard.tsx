import { memo, useMemo, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  ExternalLink,
  Eye,
  Code,
  Smartphone,
  Globe
} from "lucide-react";

interface TestRun {
  id: string;
  type: string;
  status: string;
  location: string;
  error: string;
  severity: string;
  mitigation: string;
}

const Dashboard = memo(() => {
  const mockTestRuns: TestRun[] = useMemo(() => [
    {
      id: "TC-001-Login",
      type: "Functional",
      status: "failed",
      location: "https://example.com/login",
      error: "User unable to log in with valid credentials",
      severity: "critical",
      mitigation: "Verify database connectivity for user authentication"
    },
    {
      id: "TC-005-CartAdd", 
      type: "Regression",
      status: "failed", 
      location: "https://example.com/products/item123",
      error: "Add to Cart button unresponsive after UI update",
      severity: "major",
      mitigation: "Re-evaluate CSS selector for Add to Cart button"
    },
    {
      id: "TC-010-BVA-Age",
      type: "Unit",
      status: "failed",
      location: "Backend Logic - validateAge function",
      error: "Age input 17 (min-1) accepted as valid",
      severity: "high", 
      mitigation: "Review boundary condition logic in validateAge function"
    },
    {
      id: "TC-015-Nav-Menu",
      type: "Smoke",
      status: "failed",
      location: "https://example.com/",
      error: "Main navigation menu not rendering on homepage",
      severity: "critical",
      mitigation: "Check main-nav.css for recent style changes"
    },
    {
      id: "TC-020-Mobile-Responsive",
      type: "Regression",
      status: "failed",
      location: "https://example.com/dashboard",
      error: "Dashboard layout broken on mobile devices",
      severity: "major",
      mitigation: "Review responsive breakpoints in dashboard.css"
    }
  ], []);

  const getSeverityColor = useCallback((severity: string) => {
    switch (severity) {
      case 'critical': return 'text-destructive bg-destructive/10';
      case 'major': return 'text-warning bg-warning/10'; 
      case 'high': return 'text-primary bg-primary/10';
      case 'minor': return 'text-muted-foreground bg-muted/10';
      default: return 'text-muted-foreground bg-muted/10';
    }
  }, []);

  const getStatusIcon = useCallback((status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle2 className="h-4 w-4 text-success" />;
      case 'failed': return <XCircle className="h-4 w-4 text-destructive" />;
      case 'pending': return <Clock className="h-4 w-4 text-warning" />;
      default: return <AlertTriangle className="h-4 w-4 text-muted-foreground" />;
    }
  }, []);

  const metrics = useMemo(() => {
    const totalTests = 50;
    const failedTests = mockTestRuns.length;
    const passedTests = totalTests - failedTests;
    const passRate = Math.round((passedTests / totalTests) * 100);
    const coverage = 87;

    return {
      totalTests,
      passRate,
      failedTests,
      coverage
    };
  }, [mockTestRuns]);

  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <Badge className="mb-4">Test Results Dashboard</Badge>
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Quality Assurance Overview
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Real-time insights into your application's quality with detailed 
            error reports and actionable mitigation strategies.
          </p>
        </div>

        {/* Metrics Overview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary" />
                Total Tests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{metrics.totalTests}</div>
              <p className="text-sm text-muted-foreground">Executed this cycle</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                Pass Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{metrics.passRate}%</div>
              <Progress value={metrics.passRate} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <XCircle className="h-4 w-4 text-destructive" />
                Failed Tests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{metrics.failedTests}</div>
              <p className="text-sm text-muted-foreground">Require attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Code className="h-4 w-4 text-primary" />
                Test Coverage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{metrics.coverage}%</div>
              <Progress value={metrics.coverage} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Failed Tests Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Failed Tests - Requires Attention
            </CardTitle>
            <CardDescription>
              Detailed breakdown of failed test cases with error locations and mitigation suggestions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockTestRuns.map((test) => (
                <div key={test.id} className="border rounded-lg p-4 space-y-3 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(test.status)}
                      <div>
                        <h4 className="font-semibold text-foreground">{test.id}</h4>
                        <p className="text-sm text-muted-foreground">{test.type} Testing</p>
                      </div>
                    </div>
                    <Badge className={getSeverityColor(test.severity)}>
                      {test.severity}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Error Location:</span>
                      <code className="bg-muted px-2 py-1 rounded text-xs font-mono">
                        {test.location}
                      </code>
                    </div>
                    
                    <div className="text-sm">
                      <span className="font-medium text-foreground">Description:</span>
                      <p className="text-muted-foreground mt-1">{test.error}</p>
                    </div>
                    
                    <div className="bg-muted/50 p-3 rounded-md text-sm">
                      <span className="font-medium text-foreground">💡 Suggested Mitigation:</span>
                      <p className="text-muted-foreground mt-1">{test.mitigation}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="gap-1">
                      <Eye className="h-3 w-3" />
                      View Details
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Code className="h-3 w-3" />
                      View Code
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
});

Dashboard.displayName = "Dashboard";

export default Dashboard;