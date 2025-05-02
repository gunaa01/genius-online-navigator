import { type FC } from 'react';
import { GA4Integration } from './GA4Integration';
import { GTMIntegration } from './GTMIntegration';
import { MarketingEvents, trackMarketingEvent } from '../../utils/analyticsEvents';
import { FrontendAnalyticsService } from '../../services/FrontendAnalyticsService';

/**
 * Demo component showcasing analytics integration
 * 
 * @example
 * // Include in your app (usually in a dev-only route)
 * <AnalyticsDemo 
 *   gaMeasurementId="G-XXXXXXXXXX"
 *   gtmContainerId="GTM-XXXXXXX"
 * />
 */
interface AnalyticsDemoProps {
  gaMeasurementId: string;
  gtmContainerId: string;
}

export const AnalyticsDemo: FC<AnalyticsDemoProps> = ({
  gaMeasurementId,
  gtmContainerId
}) => {
  // Initialize analytics services
  React.useEffect(() => {
    FrontendAnalyticsService.getInstance().initGA4({
      measurementId: gaMeasurementId,
      debugMode: process.env.NODE_ENV === 'development'
    });
    
    FrontendAnalyticsService.getInstance().initGTM({
      containerId: gtmContainerId,
      dataLayer: { demoMode: true }
    });
  }, [gaMeasurementId, gtmContainerId]);

  const handleDemoEvent = () => {
    trackMarketingEvent('buttonClick', 'demo_button', window.location.pathname);
    alert('Demo event tracked! Check your analytics console.');
  };

  const handleLeadEvent = () => {
    trackMarketingEvent('leadGenerated', 'demo_page');
    alert('Lead generation event tracked!');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Analytics Integration Demo</h2>
      <p>
        This component demonstrates the analytics tracking implementation.
        Events will be sent to both GA4 and GTM when configured.
      </p>
      
      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <button 
          onClick={handleDemoEvent}
          style={buttonStyle}
        >
          Track Demo Event
        </button>
        
        <button 
          onClick={handleLeadEvent}
          style={buttonStyle}
        >
          Track Lead Generation
        </button>
      </div>
      
      <div style={{ marginTop: '30px', padding: '15px', background: '#f5f5f5' }}>
        <h3>Current Configuration</h3>
        <ul>
          <li>GA4 Measurement ID: {gaMeasurementId}</li>
          <li>GTM Container ID: {gtmContainerId}</li>
        </ul>
      </div>
    </div>
  );
};

const buttonStyle: React.CSSProperties = {
  padding: '10px 15px',
  backgroundColor: '#4285f4',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '14px'
};
