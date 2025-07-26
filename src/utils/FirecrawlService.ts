import FirecrawlApp from '@mendable/firecrawl-js';

interface ErrorResponse {
  success: false;
  error: string;
}

interface CrawlStatusResponse {
  success: true;
  status: string;
  completed: number;
  total: number;
  creditsUsed: number;
  expiresAt: string;
  data: any[];
}

type CrawlResponse = CrawlStatusResponse | ErrorResponse;

interface SecurityIssue {
  type: 'functional' | 'smoke' | 'regression' | 'unit' | 'boundary';
  severity: 'critical' | 'major' | 'minor' | 'info';
  title: string;
  description: string;
  location: string;
  mitigation: string;
}

export class FirecrawlService {
  private static API_KEY_STORAGE_KEY = 'firecrawl_api_key';
  private static firecrawlApp: FirecrawlApp | null = null;

  static saveApiKey(apiKey: string): void {
    localStorage.setItem(this.API_KEY_STORAGE_KEY, apiKey);
    this.firecrawlApp = new FirecrawlApp({ apiKey });
    console.log('API key saved successfully');
  }

  static getApiKey(): string | null {
    return localStorage.getItem(this.API_KEY_STORAGE_KEY);
  }

  static async testApiKey(apiKey: string): Promise<boolean> {
    try {
      console.log('Testing API key with Firecrawl API');
      this.firecrawlApp = new FirecrawlApp({ apiKey });
      const testResponse = await this.firecrawlApp.crawlUrl('https://example.com', {
        limit: 1
      });
      return testResponse.success;
    } catch (error) {
      console.error('Error testing API key:', error);
      return false;
    }
  }

  static async crawlWebsite(url: string): Promise<{ success: boolean; error?: string; data?: any }> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      return { success: false, error: 'API key not found' };
    }

    try {
      console.log('Making crawl request to Firecrawl API');
      if (!this.firecrawlApp) {
        this.firecrawlApp = new FirecrawlApp({ apiKey });
      }

      const crawlResponse = await this.firecrawlApp.crawlUrl(url, {
        limit: 50,
        scrapeOptions: {
          formats: ['markdown', 'html'],
        }
      }) as CrawlResponse;

      if (!crawlResponse.success) {
        console.error('Crawl failed:', (crawlResponse as ErrorResponse).error);
        return { 
          success: false, 
          error: (crawlResponse as ErrorResponse).error || 'Failed to crawl website' 
        };
      }

      console.log('Crawl successful:', crawlResponse);
      return { 
        success: true,
        data: crawlResponse 
      };
    } catch (error) {
      console.error('Error during crawl:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to connect to Firecrawl API' 
      };
    }
  }

  static analyzeForSecurityIssues(crawlData: any): SecurityIssue[] {
    const issues: SecurityIssue[] = [];
    
    if (!crawlData || !crawlData.data) {
      return issues;
    }

    crawlData.data.forEach((page: any, index: number) => {
      const content = page.markdown || page.html || '';
      const url = page.metadata?.url || `Page ${index + 1}`;

      // Functional Testing Issues
      if (content.includes('404') || content.includes('error') || content.includes('not found')) {
        issues.push({
          type: 'functional',
          severity: 'major',
          title: 'Broken Links or Missing Pages',
          description: 'Found error pages or broken functionality',
          location: url,
          mitigation: 'Check routing configuration and ensure all links are properly implemented'
        });
      }

      if (content.match(/form/i) && !content.match(/submit|button/i)) {
        issues.push({
          type: 'functional',
          severity: 'minor',
          title: 'Incomplete Form Implementation',
          description: 'Forms found without proper submit buttons',
          location: url,
          mitigation: 'Ensure all forms have proper submit buttons and validation'
        });
      }

      // Smoke Testing Issues
      if (!content.match(/navigation|nav|menu/i)) {
        issues.push({
          type: 'smoke',
          severity: 'critical',
          title: 'Missing Navigation',
          description: 'No navigation elements found on the page',
          location: url,
          mitigation: 'Add proper navigation menu to ensure users can navigate the site'
        });
      }

      if (!content.match(/title|h1|header/i)) {
        issues.push({
          type: 'smoke',
          severity: 'major',
          title: 'Missing Page Title/Header',
          description: 'Page lacks proper title or header structure',
          location: url,
          mitigation: 'Add descriptive titles and headers for better user experience'
        });
      }

      // Regression Testing Issues
      if (content.match(/console\.error|debug|test/i)) {
        issues.push({
          type: 'regression',
          severity: 'minor',
          title: 'Debug Code in Production',
          description: 'Found debug or test code that should be removed',
          location: url,
          mitigation: 'Remove debug statements and test code from production'
        });
      }

      // Unit Testing Issues
      if (content.match(/javascript|script/i) && !content.match(/error handling|try.*catch/i)) {
        issues.push({
          type: 'unit',
          severity: 'minor',
          title: 'Missing Error Handling',
          description: 'JavaScript code found without proper error handling',
          location: url,
          mitigation: 'Implement proper error handling in JavaScript functions'
        });
      }

      // Boundary Value Analysis Issues
      if (content.match(/input.*number|input.*range/i)) {
        issues.push({
          type: 'boundary',
          severity: 'minor',
          title: 'Input Validation Needed',
          description: 'Numeric inputs found that may need boundary validation',
          location: url,
          mitigation: 'Implement proper input validation for min/max values and edge cases'
        });
      }

      if (content.match(/password|email/i) && !content.match(/validation|required/i)) {
        issues.push({
          type: 'boundary',
          severity: 'major',
          title: 'Missing Input Validation',
          description: 'Sensitive inputs found without proper validation',
          location: url,
          mitigation: 'Add client and server-side validation for sensitive input fields'
        });
      }
    });

    return issues;
  }
}