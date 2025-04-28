import React from 'react';
import { 
  Container, Typography, Paper, Box, 
  Tabs, Tab, Divider, Breadcrumbs, Link
} from '@mui/material';
import { Home, Analytics, Description } from '@mui/icons-material';
import ContentAnalyzer from '../components/analytics/ContentAnalyzer';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`analytics-tabpanel-${index}`}
      aria-labelledby={`analytics-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `analytics-tab-${index}`,
    'aria-controls': `analytics-tabpanel-${index}`,
  };
}

const ContentAnalytics: React.FC = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 3, mt: 2 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link 
            underline="hover" 
            color="inherit" 
            href="/" 
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <Home sx={{ mr: 0.5 }} fontSize="inherit" />
            Home
          </Link>
          <Typography 
            color="text.primary"
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <Analytics sx={{ mr: 0.5 }} fontSize="inherit" />
            Content Analytics
          </Typography>
        </Breadcrumbs>
      </Box>
      
      <Typography variant="h4" component="h1" gutterBottom>
        Content Analytics
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Analyze and optimize your content with AI-powered insights. Get recommendations for readability, SEO, sentiment, and engagement.
      </Typography>
      
      <Paper sx={{ width: '100%', mt: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={value} 
            onChange={handleChange} 
            aria-label="content analytics tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab 
              label="Content Analyzer" 
              icon={<Description />} 
              iconPosition="start"
              {...a11yProps(0)} 
            />
            <Tab 
              label="Performance Metrics" 
              {...a11yProps(1)} 
            />
            <Tab 
              label="Audience Insights" 
              {...a11yProps(2)} 
            />
            <Tab 
              label="Competitive Analysis" 
              {...a11yProps(3)} 
            />
          </Tabs>
        </Box>
        
        <TabPanel value={value} index={0}>
          <ContentAnalyzer />
        </TabPanel>
        
        <TabPanel value={value} index={1}>
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              Performance Metrics Dashboard
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Coming soon: Track engagement, time on page, conversion rates, and more.
            </Typography>
          </Box>
        </TabPanel>
        
        <TabPanel value={value} index={2}>
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              Audience Insights
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Coming soon: Understand your audience demographics, behavior, and preferences.
            </Typography>
          </Box>
        </TabPanel>
        
        <TabPanel value={value} index={3}>
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              Competitive Content Analysis
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Coming soon: Compare your content performance against competitors.
            </Typography>
          </Box>
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default ContentAnalytics; 