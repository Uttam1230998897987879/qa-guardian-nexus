import { useState, memo, useCallback, useMemo } from 'react';
import { useToast } from "@/components/ui/use-toast"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { FirecrawlService } from '@/utils/FirecrawlService';
import { 
  Search, 
  Shield, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle,
  Key,
  Globe,
  ExternalLink,
  Eye
} from 'lucide-react';

interface SecurityIssue {
  type: 'functional' | 'smoke' | 'regression' | 'unit' | 'boundary';
  severity: 'critical' | 'major' | 'minor' | 'info';
  title: string;
  description: string;
  location: string;
  mitigation: string;
}

const WebsiteScanner = memo(() => {
  const { toast } = useToast();
  const [url, setUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [scanResults, setScanResults] = useState<SecurityIssue[]>([]);
  const [hasApiKey, setHasApiKey] = useState(!!FirecrawlService.getApiKey());

  const handleSaveApiKey = useCallback(async () => {
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid API key",
        variant: "destructive",
      });
      return;
    }

    const isValid = await FirecrawlService.testApiKey(apiKey);
    if (isValid) {
      FirecrawlService.saveApiKey(apiKey);
      setHasApiKey(true);
      toast({
        title: "Success",
        description: "API key saved successfully",
      });
    } else {
      toast({
        title: "Error",
        description: "Invalid API key. Please check and try again.",
        variant: "destructive",
      });
    }
  }, [apiKey, toast]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setProgress(0);
    setScanResults([]);
    
    try {
      console.log('Starting website scan for URL:', url);
      
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 500);

      const result = await FirecrawlService.crawlWebsite(url);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      if (result.success) {
        console.log('Crawl successful:', result.data);
        
        // Analyze the crawled data for security issues
        const issues = FirecrawlService.analyzeForSecurityIssues(result.data);
        setScanResults(issues);
        
        toast({
          title: "Scan Complete",
          description: `Found ${issues.length} potential issues to review`,
        });
      } else {
        console.error('Crawl failed:', result.error);
        toast({
          title: "Scan Failed",
          description: result.error || "Failed to scan website",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error during scan:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred during scanning",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [url, toast]);

  const getSeverityColor = useCallback((severity: string) => {
    switch (severity) {
      case 'critical': return 'text-destructive bg-destructive/10';
      case 'major': return 'text-warning bg-warning/10';
      case 'minor': return 'text-primary bg-primary/10';
      default: return 'text-muted-foreground bg-muted/10';
    }
  }, []);

  const getTypeIcon = useCallback((type: string) => {
    switch (type) {
      case 'functional': return CheckCircle2;
      case 'smoke': return Shield;
      case 'regression': return AlertTriangle;
      case 'unit': return Eye;
      case 'boundary': return XCircle;
      default: return AlertTriangle;
    }
  }, []);

  const groupedResults = useMemo(() => {
    return scanResults.reduce((acc, result) => {
      if (!acc[result.type]) {
        acc[result.type] = [];
      }
      acc[result.type].push(result);
      return acc;
    }, {} as Record<string, SecurityIssue[]>);
  }, [scanResults]);

  if (!hasApiKey) {
    return (
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center mb-8">
            <Badge className="mb-4">Setup Required</Badge>
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Configure Firecrawl API
            </h2>
            <p className="text-lg text-muted-foreground">
              Enter your Firecrawl API key to start scanning websites for quality issues.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                API Key Configuration
              </CardTitle>
              <CardDescription>
                Get your API key from <a href="https://firecrawl.dev" target="_blank" rel="noopener noreferrer" className="text-primary underline">firecrawl.dev</a>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="apikey" className="text-sm font-medium">
                  Firecrawl API Key
                </label>
                <Input
                  id="apikey"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="fc-..."
                  className="font-mono"
                />
              </div>
              <Button onClick={handleSaveApiKey} className="w-full">
                Save API Key
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <Badge className="mb-4">Website Analysis</Badge>
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Automated Quality Scanner
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Scan any website or IP address to detect functional, smoke, regression, 
            unit testing, and boundary value analysis issues with precise error locations.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Website Scanner
              </CardTitle>
              <CardDescription>
                Enter a URL or IP address to perform comprehensive quality testing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://example.com or 192.168.1.1"
                      className="pl-10"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Scanning..." : "Start Scan"}
                  </Button>
                </div>
                
                {isLoading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Scanning progress</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="w-full" />
                  </div>
                )}
              </form>
            </CardContent>
          </Card>

          {scanResults.length > 0 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-semibold mb-2">Scan Results</h3>
                <p className="text-muted-foreground">
                  Found {scanResults.length} issues requiring attention
                </p>
              </div>

              {Object.entries(groupedResults).map(([type, issues]) => (
                <Card key={type}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 capitalize">
                      {(() => {
                        const Icon = getTypeIcon(type);
                        return <Icon className="h-5 w-5" />;
                      })()}
                      {type} Testing Issues ({issues.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {issues.map((issue, index) => (
                        <div key={index} className="border rounded-lg p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold">{issue.title}</h4>
                            <Badge className={getSeverityColor(issue.severity)}>
                              {issue.severity}
                            </Badge>
                          </div>
                          
                          <p className="text-muted-foreground">{issue.description}</p>
                          
                          <div className="flex items-center gap-2 text-sm">
                            <ExternalLink className="h-4 w-4" />
                            <span className="font-medium">Location:</span>
                            <code className="bg-muted px-2 py-1 rounded text-xs">
                              {issue.location}
                            </code>
                          </div>
                          
                          <Alert>
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>
                              <strong>Suggested Fix:</strong> {issue.mitigation}
                            </AlertDescription>
                          </Alert>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {scanResults.length === 0 && !isLoading && (
            <Card>
              <CardContent className="text-center py-8">
                <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Ready to Scan</h3>
                <p className="text-muted-foreground">
                  Enter a website URL above to start comprehensive quality testing
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
});

WebsiteScanner.displayName = "WebsiteScanner";

export default WebsiteScanner;