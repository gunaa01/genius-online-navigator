import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Search, BarChart, TrendingUp, Star, ArrowUpRight, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

interface Keyword {
  id: string;
  keyword: string;
  searchVolume: number;
  difficulty: number;
  currentRanking: number | null;
  competitorRanking: boolean;
  cpc: number;
  opportunity: number;
  trend: 'up' | 'down' | 'stable';
  intent: 'informational' | 'commercial' | 'transactional' | 'navigational';
}

interface KeywordOpportunityFinderProps {
  initialKeywords?: Keyword[];
  domain?: string;
  onSaveKeywords?: (keywords: Keyword[]) => void;
}

const DIFFICULTY_LABELS = {
  1: 'Very Easy',
  2: 'Easy',
  3: 'Moderate',
  4: 'Hard',
  5: 'Very Hard',
};

const INTENT_COLORS = {
  informational: 'bg-blue-100 text-blue-800',
  commercial: 'bg-purple-100 text-purple-800',
  transactional: 'bg-green-100 text-green-800', 
  navigational: 'bg-orange-100 text-orange-800',
};

export default function KeywordOpportunityFinder({ 
  initialKeywords = [], 
  domain = '',
  onSaveKeywords
}: KeywordOpportunityFinderProps) {
  const [keywords, setKeywords] = useState<Keyword[]>(initialKeywords);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [domainValue, setDomainValue] = useState(domain);
  const [selectedKeywords, setSelectedKeywords] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState('all');
  const [showKeywordDetails, setShowKeywordDetails] = useState<Keyword | null>(null);
  const [competitor, setCompetitor] = useState('');
  const [industryFilter, setIndustryFilter] = useState('all');

  // Mock function to analyze keywords - in a real implementation this would call an API
  const analyzeKeywords = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // This would be replaced by actual API call in production
      const mockResults: Keyword[] = [
        {
          id: '1',
          keyword: 'online marketing automation',
          searchVolume: 2400,
          difficulty: 3,
          currentRanking: 12,
          competitorRanking: true,
          cpc: 4.25,
          opportunity: 0.82,
          trend: 'up',
          intent: 'informational'
        },
        {
          id: '2', 
          keyword: 'best ai content generator',
          searchVolume: 5800,
          difficulty: 4,
          currentRanking: null,
          competitorRanking: true,
          cpc: 3.80,
          opportunity: 0.75,
          trend: 'up',
          intent: 'commercial'
        },
        {
          id: '3',
          keyword: 'social media analytics tools',
          searchVolume: 4200,
          difficulty: 3,
          currentRanking: 18,
          competitorRanking: true,
          cpc: 3.10,
          opportunity: 0.79,
          trend: 'stable',
          intent: 'commercial'
        },
        {
          id: '4',
          keyword: 'marketing automation workflow',
          searchVolume: 1900,
          difficulty: 2,
          currentRanking: 7,
          competitorRanking: false,
          cpc: 4.50,
          opportunity: 0.86,
          trend: 'up',
          intent: 'informational'
        },
        {
          id: '5',
          keyword: 'buy marketing automation software',
          searchVolume: 1200,
          difficulty: 3,
          currentRanking: null,
          competitorRanking: true,
          cpc: 6.25,
          opportunity: 0.72,
          trend: 'stable',
          intent: 'transactional'
        }
      ];
      
      setKeywords(mockResults);
    } catch (err) {
      setError('Failed to analyze keywords. Please try again later.');
      console.error('Error analyzing keywords:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter keywords based on search term and tab
  const filteredKeywords = keywords.filter(keyword => {
    // Search filter
    if (searchTerm && !keyword.keyword.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Tab filter
    if (activeTab === 'high-opportunity' && keyword.opportunity < 0.75) return false;
    if (activeTab === 'ranking-gap' && (keyword.currentRanking !== null || !keyword.competitorRanking)) return false;
    if (activeTab === 'improve-position' && (!keyword.currentRanking || keyword.currentRanking <= 5)) return false;
    
    return true;
  });

  // Toggle keyword selection
  const toggleKeywordSelection = (id: string) => {
    const newSelected = new Set(selectedKeywords);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedKeywords(newSelected);
  };

  // Select/deselect all visible keywords
  const toggleSelectAll = () => {
    if (selectedKeywords.size === filteredKeywords.length) {
      setSelectedKeywords(new Set());
    } else {
      setSelectedKeywords(new Set(filteredKeywords.map(k => k.id)));
    }
  };

  // Save selected keywords
  const handleSaveKeywords = () => {
    if (onSaveKeywords && selectedKeywords.size > 0) {
      const keywordsToSave = keywords.filter(k => selectedKeywords.has(k.id));
      onSaveKeywords(keywordsToSave);
    }
  };

  // View keyword details
  const viewKeywordDetails = (keyword: Keyword) => {
    setShowKeywordDetails(keyword);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Keyword Opportunity Finder</CardTitle>
          <CardDescription>
            Discover high-potential keywords using machine learning and competitor analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="domain" className="text-sm font-medium block mb-1">Domain</label>
                <div className="flex gap-2">
                  <Input 
                    id="domain"
                    placeholder="Enter your domain" 
                    value={domainValue} 
                    onChange={(e) => setDomainValue(e.target.value)} 
                  />
                </div>
              </div>
              <div>
                <label htmlFor="competitor" className="text-sm font-medium block mb-1">Competitor Domain (Optional)</label>
                <Input 
                  id="competitor"
                  placeholder="e.g., competitor.com" 
                  value={competitor} 
                  onChange={(e) => setCompetitor(e.target.value)} 
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
              <div className="w-full sm:w-1/3">
                <label htmlFor="industry" className="text-sm font-medium block mb-1">Industry</label>
                <Select value={industryFilter} onValueChange={setIndustryFilter}>
                  <SelectTrigger id="industry">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Industries</SelectItem>
                    <SelectItem value="tech">Technology</SelectItem>
                    <SelectItem value="ecommerce">E-commerce</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="health">Healthcare</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                onClick={analyzeKeywords} 
                disabled={loading || !domainValue}
                className="w-full sm:w-auto"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <BarChart className="mr-2 h-4 w-4" />
                    Find Opportunities
                  </>
                )}
              </Button>
            </div>
            
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
      
      {keywords.length > 0 && (
        <Card>
          <CardHeader className="pb-0">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
                <TabsList className="grid grid-cols-4 w-full sm:w-auto">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="high-opportunity">High Opportunity</TabsTrigger>
                  <TabsTrigger value="ranking-gap">Ranking Gap</TabsTrigger>
                  <TabsTrigger value="improve-position">Improve Position</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search keywords..."
                  className="pl-8 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <input 
                        type="checkbox" 
                        className="rounded border-gray-300"
                        checked={selectedKeywords.size === filteredKeywords.length && filteredKeywords.length > 0}
                        onChange={toggleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Keyword</TableHead>
                    <TableHead className="text-right">Search Volume</TableHead>
                    <TableHead className="text-center">Difficulty</TableHead>
                    <TableHead className="text-center">Your Position</TableHead>
                    <TableHead className="text-center">Intent</TableHead>
                    <TableHead className="text-right">Opportunity Score</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredKeywords.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-6 text-gray-500">
                        No keywords match your filters
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredKeywords.map((keyword) => (
                      <TableRow key={keyword.id}>
                        <TableCell>
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={selectedKeywords.has(keyword.id)}
                            onChange={() => toggleKeywordSelection(keyword.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="font-medium flex items-center">
                            {keyword.keyword}
                            {keyword.trend === 'up' && <TrendingUp className="ml-2 h-4 w-4 text-green-500" />}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{keyword.searchVolume.toLocaleString()}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 ${i < keyword.difficulty ? 'text-amber-500 fill-amber-500' : 'text-gray-200'}`}
                              />
                            ))}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {DIFFICULTY_LABELS[keyword.difficulty as keyof typeof DIFFICULTY_LABELS]}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          {keyword.currentRanking ? (
                            <Badge variant={keyword.currentRanking <= 10 ? "success" : "outline"}>
                              #{keyword.currentRanking}
                            </Badge>
                          ) : (
                            <span className="text-gray-400">Not Ranking</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className={INTENT_COLORS[keyword.intent]}>
                            {keyword.intent.charAt(0).toUpperCase() + keyword.intent.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                  <div 
                                    className="bg-primary h-2.5 rounded-full" 
                                    style={{ width: `${keyword.opportunity * 100}%` }}
                                  ></div>
                                </div>
                                <div className="text-xs mt-1 font-medium">{(keyword.opportunity * 100).toFixed(0)}%</div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Based on difficulty, volume, and competition</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => viewKeywordDetails(keyword)}
                          >
                            Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="text-sm text-gray-500">
              {selectedKeywords.size} of {keywords.length} keywords selected
            </div>
            <Button 
              onClick={handleSaveKeywords} 
              disabled={selectedKeywords.size === 0}
            >
              Save Selected Keywords
            </Button>
          </CardFooter>
        </Card>
      )}
      
      {/* Keyword Details Dialog */}
      <Dialog open={showKeywordDetails !== null} onOpenChange={(open) => !open && setShowKeywordDetails(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Keyword Analysis</DialogTitle>
            <DialogDescription>
              Detailed analysis and recommendations for "{showKeywordDetails?.keyword}"
            </DialogDescription>
          </DialogHeader>
          
          {showKeywordDetails && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="py-4 px-5">
                    <CardTitle className="text-base">Search Volume</CardTitle>
                  </CardHeader>
                  <CardContent className="py-0 px-5">
                    <div className="text-2xl font-bold">{showKeywordDetails.searchVolume.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">Monthly searches</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="py-4 px-5">
                    <CardTitle className="text-base">CPC</CardTitle>
                  </CardHeader>
                  <CardContent className="py-0 px-5">
                    <div className="text-2xl font-bold">${showKeywordDetails.cpc.toFixed(2)}</div>
                    <div className="text-sm text-gray-500">Average cost per click</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="py-4 px-5">
                    <CardTitle className="text-base">Opportunity</CardTitle>
                  </CardHeader>
                  <CardContent className="py-0 px-5">
                    <div className="text-2xl font-bold">{(showKeywordDetails.opportunity * 100).toFixed(0)}%</div>
                    <div className="text-sm text-gray-500">Opportunity score</div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Current Ranking Analysis</CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="w-40 font-medium">Your Position:</div>
                      <div>
                        {showKeywordDetails.currentRanking ? (
                          <>#{showKeywordDetails.currentRanking} in search results</>
                        ) : (
                          <span className="text-amber-600">Not currently ranking in top 100</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-40 font-medium">Competitor Position:</div>
                      <div>
                        {showKeywordDetails.competitorRanking ? (
                          <span className="text-green-600">Competitor is ranking for this term</span>
                        ) : (
                          <span>Competitor is not ranking</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-40 font-medium">Search Intent:</div>
                      <Badge className={INTENT_COLORS[showKeywordDetails.intent]}>
                        {showKeywordDetails.intent.charAt(0).toUpperCase() + showKeywordDetails.intent.slice(1)}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-40 font-medium">Trend:</div>
                      <div className="flex items-center">
                        {showKeywordDetails.trend === 'up' ? (
                          <>
                            <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                            <span className="text-green-600">Increasing in popularity</span>
                          </>
                        ) : showKeywordDetails.trend === 'down' ? (
                          <>
                            <TrendingUp className="mr-1 h-4 w-4 rotate-180 text-red-500" />
                            <span className="text-red-600">Decreasing in popularity</span>
                          </>
                        ) : (
                          <span>Stable search volume</span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">AI Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p>Based on our analysis, here are personalized recommendations for this keyword:</p>
                    
                    <ul className="space-y-2 list-disc pl-5">
                      {showKeywordDetails.currentRanking === null ? (
                        <>
                          <li>Create new content targeting this keyword with search intent: <strong>{showKeywordDetails.intent}</strong></li>
                          <li>Focus on comprehensive coverage of the topic with at least 1,500 words</li>
                          <li>Include related keywords like "{showKeywordDetails.keyword.split(' ').slice(0, 2).join(' ')} tips" and "{showKeywordDetails.keyword} best practices"</li>
                        </>
                      ) : showKeywordDetails.currentRanking > 10 ? (
                        <>
                          <li>Enhance existing content by improving depth and addressing user intent better</li>
                          <li>Update content with fresh statistics and examples</li>
                          <li>Add structured data to improve SERP appearance</li>
                        </>
                      ) : (
                        <>
                          <li>Continue optimizing for featured snippet opportunity</li>
                          <li>Create supporting content to strengthen topical authority</li>
                          <li>Build more quality backlinks to this page</li>
                        </>
                      )}
                      
                      {showKeywordDetails.trend === 'up' && (
                        <li>Prioritize this keyword due to increasing search trend</li>
                      )}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowKeywordDetails(null)}>
              Close
            </Button>
            {showKeywordDetails && (
              <Button 
                onClick={() => {
                  toggleKeywordSelection(showKeywordDetails.id);
                  setShowKeywordDetails(null);
                }}
              >
                {selectedKeywords.has(showKeywordDetails.id) 
                  ? 'Remove from Selection' 
                  : 'Add to Selection'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 