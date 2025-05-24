
'use client';

import { useEffect } from 'react';

interface AdSlotProps {
  adSlotId: string; // Example: "1234567890"
  publisherId?: string; // Example: "ca-pub-xxxxxxxxxxxxxxxx"
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Component to display a Google AdSense ad unit.
 * IMPORTANT:
 * 1. Ensure you have an AdSense account and have created ad units.
 * 2. Replace placeholder IDs with your actual AdSense publisher and ad slot IDs.
 * 3. Adhere to AdSense policies: https://support.google.com/adsense/answer/48182
 * 4. Ads may not show up immediately in development due to various AdSense checks or if ad-blockers are active.
 */
export function AdSlot({ adSlotId, publisherId, className, style }: AdSlotProps) {
  const effectivePublisherId = publisherId || process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;

  useEffect(() => {
    if (!adSlotId || !effectivePublisherId) {
      console.warn('AdSlot: Missing adSlotId or publisherId. Ad will not be displayed.');
      return;
    }

    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('AdSlot: Error pushing to adsbygoogle:', e);
    }
  }, [adSlotId, effectivePublisherId]);

  if (!adSlotId || !effectivePublisherId) {
    return (
      <div className={className} style={{ ...style, border: '1px dashed #ccc', padding: '20px', textAlign: 'center' }}>
        <p className="text-sm text-muted-foreground">Ad Slot (AdSense)</p>
        <p className="text-xs text-destructive">Missing adSlotId or publisherId</p>
      </div>
    );
  }

  return (
    <div className={className} style={style}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', ...style }}
        data-ad-client={effectivePublisherId}
        data-ad-slot={adSlotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
}
