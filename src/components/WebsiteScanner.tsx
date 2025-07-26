import { useState } from 'react';
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

export const WebsiteScanner = () => {
  const { toast } = useToast();
  const [url, setUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [scanResults, setScanResults] = useState<SecurityIssue[]>([]);
  const [hasApiKey, setHasApiKey] = useState(!!FirecrawlService.getApiKey());

  const handleSaveApiKey = async () => {
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
      setApiKey('');
      toast({
        title: "Success",
        description: "API key saved and validated successfully",
      });
    } else {
      toast({
        title: "Error",
        description: "Invalid API key. Please check and try again.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setProgress(0);
    setScanResults([]);
    
    try {
      if (!hasApiKey) {
        toast({
          title: "Error",
          description: "Please set your Firecrawl API key first",
          variant: "destructive",
        });
        return;
      }

      // Validate URL format
      let processedUrl = url.trim();
      if (!processedUrl.startsWith('http://') && !processedUrl.startsWith('https://')) {
        // Check if it's an IP address
        const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
        if (ipRegex.test(processedUrl)) {
          processedUrl = `http://${processedUrl}`;
        } else {
          processedUrl = `https://${processedUrl}`;
        }
      }

      setProgress(25);
      console.log('Starting scan for URL:', processedUrl);
      
      const result = await FirecrawlService.crawlWebsite(processedUrl);
      setProgress(75);
      
      if (result.success && result.data) {
        const issues = FirecrawlService.analyzeForSecurityIssues(result.data);
        setScanResults(issues);
        setProgress(100);
        
        toast({
          title: "Scan Complete",
          description: `Found ${issues.length} potential issues`,
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to scan website",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error scanning website:', error);
      toast({
        title: "Error",
        description: "Failed to scan website",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-qa-critical bg-qa-critical/10 border-qa-critical/20';
      case 'major': return 'text-qa-major bg-qa-major/10 border-qa-major/20';
      case 'minor': return 'text-qa-minor bg-qa-minor/10 border-qa-minor/20';
      default: return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'functional': return <CheckCircle2 className="h-4 w-4" />;
      case 'smoke': return <Shield className="h-4 w-4" />;
      case 'regression': return <AlertTriangle className="h-4 w-4" />;
      case 'unit': return <XCircle className="h-4 w-4" />;
      case 'boundary': return <Search className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const groupedResults = scanResults.reduce((acc, issue) => {
    if (!acc[issue.type]) acc[issue.type] = [];
    acc[issue.type].push(issue);
    return acc;
  }, {} as Record<string, SecurityIssue[]>);

  return (
    <section className="py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Website Security Scanner</h2>
          <p className="text-muted-foreground">
            Scan any URL or IP address to detect functional, smoke, regression, unit, and boundary value issues
          </p>
        </div>

        {!hasApiKey && (
          <Alert className="mb-6">
            <Key className="h-4 w-4" />
            <AlertDescription>
              <strong>API Key Required:</strong> To use the website scanner, you need a Firecrawl API key. 
              For production use, we recommend connecting to Supabase and storing the API key securely.
              <a href="https://firecrawl.dev" target="_blank" rel="noopener noreferrer" className="text-primary underline ml-1">
                Get your API key here
              </a>
            </AlertDescription>
          </Alert>
        )}

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Scanner Configuration
            </CardTitle>
            <CardDescription>
              Enter the website URL or IP address you want to scan for security issues
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!hasApiKey && (
              <div className="flex gap-2">
                <Input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your Firecrawl API key"
                  className="flex-1"
                />
                <Button onClick={handleSaveApiKey} variant="outline">
                  <Key className="h-4 w-4 mr-2" />
                  Save Key
                </Button>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com or 192.168.1.1"
                  className="flex-1"
                  required
                />
                <Button
                  type="submit"
                  disabled={isLoading || !hasApiKey}
                  variant="hero"
                >
                  {isLoading ? (
                    <>Scanning...</>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Start Scan
                    </>
                  )}
                </Button>
              </div>
              
              {isLoading && (
                <div className="space-y-2">
                  <Progress value={progress} className="w-full" />
                  <p className="text-sm text-muted-foreground">
                    Analyzing website for security issues...
                  </p>
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        {scanResults.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-foreground">Scan Results</h3>
              <Badge variant="outline" className="text-lg px-3 py-1">
                {scanResults.length} Issues Found
              </Badge>
            </div>

            {Object.entries(groupedResults).map(([type, issues]) => (
              <Card key={type}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 capitalize">
                    {getTypeIcon(type)}
                    {type} Testing Issues
                    <Badge variant="outline">{issues.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {issues.map((issue, index) => (
                      <div key={index} className="border border-border rounded-lg p-4 bg-muted/30">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-foreground">{issue.title}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={`text-xs ${getSeverityColor(issue.severity)}`}>
                                {issue.severity}
                              </Badge>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium text-foreground">Location: </span>
                            <span className="text-primary underline">{issue.location}</span>
                          </div>
                          <div>
                            <span className="font-medium text-foreground">Description: </span>
                            <span className="text-muted-foreground">{issue.description}</span>
                          </div>
                          <div className="bg-accent/50 p-3 rounded border-l-4 border-l-primary">
                            <span className="font-medium text-foreground">💡 Suggested Mitigation: </span>
                            <span className="text-foreground">{issue.mitigation}</span>
                          </div>
                        </div>
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
            <CardContent className="text-center py-12">
              <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Ready to Scan</h3>
              <p className="text-muted-foreground">
                Enter a URL or IP address above to start scanning for security issues
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
};