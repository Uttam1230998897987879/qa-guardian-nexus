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

const mockTestRuns = [
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
  }
];

const Dashboard = () => {
  const totalTests = 247;
  const passedTests = 241;
  const failedTests = 4;
  const skippedTests = 2;
  const passRate = Math.round((passedTests / totalTests) * 100);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-qa-critical bg-qa-critical/10 border-qa-critical/20';
      case 'major': return 'text-qa-major bg-qa-major/10 border-qa-major/20';
      case 'high': return 'text-qa-minor bg-qa-minor/10 border-qa-minor/20';
      default: return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle2 className="h-4 w-4 text-success" />;
      case 'failed': return <XCircle className="h-4 w-4 text-destructive" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-warning" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <section className="py-8 px-4">
      <div className="container mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">Test Results Dashboard</h2>
          <p className="text-muted-foreground">Real-time overview of your application quality metrics</p>
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Tests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{totalTests}</div>
              <Progress value={100} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pass Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{passRate}%</div>
              <Progress value={passRate} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Failed Tests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{failedTests}</div>
              <div className="text-sm text-muted-foreground mt-1">Requires attention</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Test Coverage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">94%</div>
              <div className="flex gap-1 mt-2">
                <Globe className="h-4 w-4 text-primary" />
                <Smartphone className="h-4 w-4 text-primary" />
                <Code className="h-4 w-4 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Test Results Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Failed Tests - Requires Attention
            </CardTitle>
            <CardDescription>
              Detailed view of test failures with error locations and mitigation suggestions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockTestRuns.map((test) => (
                <div key={test.id} className="border border-border rounded-lg p-4 bg-muted/30">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(test.status)}
                      <div>
                        <h4 className="font-semibold text-foreground">{test.id}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">{test.type}</Badge>
                          <Badge className={`text-xs ${getSeverityColor(test.severity)}`}>
                            {test.severity}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                        Details
                      </Button>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4" />
                        View Error
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium text-foreground">Error Location: </span>
                      <span className="text-primary underline">{test.location}</span>
                    </div>
                    <div>
                      <span className="font-medium text-foreground">Description: </span>
                      <span className="text-muted-foreground">{test.error}</span>
                    </div>
                    <div className="bg-accent/50 p-3 rounded border-l-4 border-l-primary">
                      <span className="font-medium text-foreground">💡 Suggested Mitigation: </span>
                      <span className="text-foreground">{test.mitigation}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Dashboard;