import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { HelpCircle, Book, Video, Search, MessageCircle, ExternalLink, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Help = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');

  const quickStartGuide = [
    {
      step: 1,
      title: 'Login & Authentication',
      description: 'Secure login with your railway controller credentials',
      duration: '2 min'
    },
    {
      step: 2,
      title: 'Dashboard Overview',
      description: 'Understand key metrics and current system status',
      duration: '5 min'
    },
    {
      step: 3,
      title: 'Real-Time Monitoring',
      description: 'Monitor train movements and track conditions',
      duration: '8 min'
    },
    {
      step: 4,
      title: 'AI Recommendations',
      description: 'Review and implement optimization suggestions',
      duration: '10 min'
    },
    {
      step: 5,
      title: 'Alert Management',
      description: 'Handle alerts and emergency procedures',
      duration: '7 min'
    }
  ];

  const faqs = [
    {
      id: 1,
      category: 'General',
      question: 'How do I access the Railway Control System?',
      answer: 'Use your assigned railway controller credentials to login. Contact your supervisor if you need account access or password reset.'
    },
    {
      id: 2,
      category: 'Operations',
      question: 'What should I do when a critical alert appears?',
      answer: 'Critical alerts require immediate attention. Review the alert details, follow emergency protocols, and coordinate with relevant teams. Always acknowledge alerts promptly.'
    },
    {
      id: 3,
      category: 'AI Features',
      question: 'How reliable are the AI recommendations?',
      answer: 'AI recommendations have an average confidence score of 85-95%. Always review recommendations carefully and use your operational experience to make final decisions.'
    },
    {
      id: 4,
      category: 'Troubleshooting',
      question: 'The system is showing connection issues. What should I do?',
      answer: 'Check your network connection first. If the issue persists, contact IT support immediately. Use manual backup procedures until the system is restored.'
    },
    {
      id: 5,
      category: 'Reports',
      question: 'How do I generate performance reports?',
      answer: 'Go to Analytics & Reports section, select your desired time range and metrics, then click Export. Reports are available in PDF, Excel, and CSV formats.'
    },
    {
      id: 6,
      category: 'Simulation',
      question: 'How do I run what-if scenarios?',
      answer: 'Access the Simulation page, select a scenario type, configure parameters, and click Run Simulation. Results will show projected outcomes for decision making.'
    }
  ];

  const tutorials = [
    {
      id: 1,
      title: 'Getting Started with Railway Control System',
      type: 'video',
      duration: '15 min',
      description: 'Complete overview of system features and basic navigation'
    },
    {
      id: 2,
      title: 'Managing Train Crossings and Priorities',
      type: 'video',
      duration: '12 min',
      description: 'Learn how to handle train precedence and crossing decisions'
    },
    {
      id: 3,
      title: 'Understanding AI Recommendations',
      type: 'guide',
      duration: '8 min',
      description: 'How to interpret and implement optimization suggestions'
    },
    {
      id: 4,
      title: 'Emergency Response Procedures',
      type: 'guide',
      duration: '10 min',
      description: 'Step-by-step emergency management protocols'
    },
    {
      id: 5,
      title: 'Performance Analytics Deep Dive',
      type: 'video',
      duration: '18 min',
      description: 'Advanced analytics features and report generation'
    }
  ];

  const contacts = [
    {
      department: 'Technical Support',
      phone: '+91-11-2345-6789',
      email: 'tech.support@railway.gov.in',
      hours: '24/7 Available'
    },
    {
      department: 'Operations Team',
      phone: '+91-11-2345-6790',
      email: 'operations@railway.gov.in',
      hours: 'Mon-Fri 8:00-18:00'
    },
    {
      department: 'System Administrator',
      phone: '+91-11-2345-6791',
      email: 'admin@railway.gov.in',
      hours: 'Mon-Fri 9:00-17:00'
    }
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleContactSupport = () => {
    toast({
      title: "Contact Support",
      description: "Support ticket created. Technical team will contact you within 30 minutes.",
    });
  };

  const handleQuickLink = (linkName: string) => {
    toast({
      title: "Opening Resource",
      description: `Opening ${linkName}...`,
    });
  };

  const handleGuideStep = (step: number, title: string) => {
    toast({
      title: "Guide Step",
      description: `Opening step ${step}: ${title}`,
    });
  };

  return (
    <Layout activeSection="help">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Help & Documentation</h1>
            <p className="text-muted-foreground mt-1">
              Guides, tutorials, and support resources for the Railway Control System
            </p>
          </div>
          <Button variant="outline" onClick={handleContactSupport}>
            <MessageCircle className="w-4 h-4 mr-2" />
            Contact Support
          </Button>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search help articles, FAQs, and guides..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Start Guide */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Book className="w-5 h-5" />
                <span>Quick Start Guide</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {quickStartGuide.map((step) => (
                <div 
                  key={step.step} 
                  className="flex items-center space-x-4 p-3 border border-border rounded-lg hover:bg-muted/50 cursor-pointer"
                  onClick={() => handleGuideStep(step.step, step.title)}
                >
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{step.title}</h4>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                  <Badge variant="outline">{step.duration}</Badge>
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" onClick={() => handleQuickLink('Video Tutorials')}>
                <Video className="w-4 h-4 mr-2" />
                Video Tutorials
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => handleQuickLink('User Manual')}>
                <FileText className="w-4 h-4 mr-2" />
                User Manual (PDF)
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => handleQuickLink('System Requirements')}>
                <HelpCircle className="w-4 h-4 mr-2" />
                System Requirements
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => handleQuickLink('Training Resources')}>
                <MessageCircle className="w-4 h-4 mr-2" />
                Training Resources
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Video Tutorials */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Video className="w-5 h-5" />
              <span>Video Tutorials</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tutorials.map((tutorial) => (
                <div 
                  key={tutorial.id} 
                  className="p-4 border border-border rounded-lg hover:bg-muted/50 cursor-pointer"
                  onClick={() => handleQuickLink(tutorial.title)}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    {tutorial.type === 'video' ? (
                      <Video className="w-4 h-4 text-primary" />
                    ) : (
                      <FileText className="w-4 h-4 text-primary" />
                    )}
                    <Badge variant="outline">{tutorial.duration}</Badge>
                  </div>
                  <h4 className="font-medium text-foreground mb-2">{tutorial.title}</h4>
                  <p className="text-sm text-muted-foreground">{tutorial.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <HelpCircle className="w-5 h-5" />
              <span>Frequently Asked Questions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {filteredFaqs.map((faq) => (
              <div key={faq.id} className="border border-border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-foreground pr-4">{faq.question}</h4>
                  <Badge variant="outline" className="shrink-0">{faq.category}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Support</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {contacts.map((contact, index) => (
                <div key={index} className="p-4 border border-border rounded-lg">
                  <h4 className="font-medium text-foreground mb-2">{contact.department}</h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>📞 {contact.phone}</p>
                    <p>✉️ {contact.email}</p>
                    <p>🕐 {contact.hours}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Help;