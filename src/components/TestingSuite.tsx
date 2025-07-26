import { memo, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Zap, RotateCcw, Code, Target } from "lucide-react";

const TestingSuite = memo(() => {
  const testingTypes = useMemo(() => [
  {
    title: "Functional Testing",
    description: "Verify application features work as per requirements and user expectations",
    icon: CheckCircle2,
    color: "text-success",
    bgColor: "bg-success/10",
    features: ["End-to-end user flows", "Feature validation", "Business logic verification"]
  },
  {
    title: "Smoke Testing",
    description: "Rapid verification of critical features after new builds or deployments",
    icon: Zap,
    color: "text-warning",
    bgColor: "bg-warning/10",
    features: ["Build verification", "Critical path testing", "Quick feedback loops"]
  },
  {
    title: "Regression Testing",
    description: "Ensure new code changes don't break existing functionality",
    icon: RotateCcw,
    color: "text-primary",
    bgColor: "bg-primary/10",
    features: ["Change impact analysis", "Visual regression", "Automated re-testing"]
  },
  {
    title: "Unit Testing",
    description: "Test individual code components in isolation for rapid feedback",
    icon: Code,
    color: "text-accent-foreground",
    bgColor: "bg-accent",
    features: ["Function-level testing", "TDD support", "Code coverage analysis"]
  },
  {
    title: "Boundary Value Analysis",
    description: "Identify errors at input/output range boundaries and edge cases",
    icon: Target,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
    features: ["Edge case testing", "Input validation", "Range boundary checks"]
  }
], []);
  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <Badge className="mb-4">Comprehensive Testing Suite</Badge>
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Five Critical Testing Methodologies
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Our platform integrates multiple testing approaches to ensure comprehensive 
            quality assurance across your web applications and mobile APKs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testingTypes.map((test, index) => {
            const Icon = test.icon;
            return (
              <Card key={index} className="bg-card hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-3 rounded-lg ${test.bgColor}`}>
                      <Icon className={`h-6 w-6 ${test.color}`} />
                    </div>
                    <Badge variant="outline">{index + 1}</Badge>
                  </div>
                  <CardTitle className="text-xl">{test.title}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {test.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {test.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
});

TestingSuite.displayName = "TestingSuite";

export default TestingSuite;