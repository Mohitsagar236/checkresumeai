import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { ChevronDown, ChevronUp, Search, ThumbsUp, ThumbsDown } from 'lucide-react';
import { mockFAQs } from '../data/mockData';
import { toast } from '../components/ui/Toast';

export function FAQPage() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [faqs, setFaqs] = useState(mockFAQs);
  const [votedFaqs, setVotedFaqs] = useState<Record<number, 'helpful' | 'unhelpful' | null>>({});

  const handleToggle = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleFeedback = (index: number, isHelpful: boolean) => {
    // Prevent multiple votes on the same FAQ
    if (votedFaqs[index]) {
      toast({
        title: "Already Submitted",
        description: "You've already provided feedback for this question",
        variant: "default"
      });
      return;
    }

    const updatedFaqs = [...faqs];
    if (isHelpful) {
      updatedFaqs[index] = {
        ...updatedFaqs[index],
        helpfulVotes: (updatedFaqs[index].helpfulVotes || 0) + 1
      };
    } else {
      updatedFaqs[index] = {
        ...updatedFaqs[index],
        unhelpfulVotes: (updatedFaqs[index].unhelpfulVotes || 0) + 1
      };
    }

    setFaqs(updatedFaqs);
    setVotedFaqs({
      ...votedFaqs,
      [index]: isHelpful ? 'helpful' : 'unhelpful'
    });

    toast({
      title: "Feedback Submitted",
      description: `Thank you for letting us know this answer was ${isHelpful ? 'helpful' : 'not helpful'}`,
      variant: isHelpful ? "success" : "default"
    });
  };

  const filteredFAQs = searchQuery
    ? faqs.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqs;

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50 text-gray-900 dark:bg-slate-900 dark:text-neutral-100">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-neutral-100 mb-3">Frequently Asked Questions</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Find answers to common questions about our resume analysis service
            </p>
          </div>

          {/* Search Box */}
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
              <input
                type="text"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-slate-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* FAQ List */}
          <div className="space-y-4">
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((faq, index) => (
                <Card key={index} className="border-0 shadow-md overflow-hidden dark:bg-slate-800">
                  <CardHeader
                    className="cursor-pointer p-4 hover:bg-gray-50 dark:hover:bg-slate-700"
                    onClick={() => handleToggle(index)}
                  >
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg font-semibold dark:text-gray-100">{faq.question}</CardTitle>
                      {expandedIndex === index ? (
                        <ChevronUp className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                      )}
                    </div>
                  </CardHeader>
                  {expandedIndex === index && (
                    <CardContent className="p-4 pt-0 bg-gray-50 dark:bg-slate-700">
                      <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                        <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
                        
                        {/* Feedback Section */}
                        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Was this answer helpful?</p>
                          <div className="flex space-x-3">
                            <Button
                              variant={votedFaqs[index] === 'helpful' ? 'default' : 'outline'}
                              size="sm"
                              className="flex items-center"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleFeedback(index, true);
                              }}
                              disabled={votedFaqs[index] !== undefined}
                            >
                              <ThumbsUp className="h-4 w-4 mr-1" />
                              <span>Yes</span>
                              {faq.helpfulVotes !== undefined && faq.helpfulVotes > 0 && 
                                <span className="ml-2 text-xs bg-gray-100 dark:bg-gray-600 px-1.5 py-0.5 rounded-full">
                                  {faq.helpfulVotes}
                                </span>
                              }
                            </Button>
                            <Button
                              variant={votedFaqs[index] === 'unhelpful' ? 'default' : 'outline'}
                              size="sm"
                              className="flex items-center"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleFeedback(index, false);
                              }}
                              disabled={votedFaqs[index] !== undefined}
                            >
                              <ThumbsDown className="h-4 w-4 mr-1" />
                              <span>No</span>
                              {faq.unhelpfulVotes !== undefined && faq.unhelpfulVotes > 0 && 
                                <span className="ml-2 text-xs bg-gray-100 dark:bg-gray-600 px-1.5 py-0.5 rounded-full">
                                  {faq.unhelpfulVotes}
                                </span>
                              }
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">No matching questions found</p>
                <p className="text-gray-500 dark:text-gray-400">Try different search terms or browse all questions by clearing your search</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setSearchQuery('')}
                >
                  Show All Questions
                </Button>
              </div>
            )}
          </div>

          {/* Still Have Questions */}
          <div className="mt-12 bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md text-center">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Still Have Questions?</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Our support team is ready to help you with any questions about our service
            </p>
            <Link to="/contact">
              <Button>Contact Support</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FAQPage;