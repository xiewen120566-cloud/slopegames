"use client";
import useAdDisplay from "@/hooks/useAdDisplay";
import { forwardRef, useEffect } from "react";

interface AdTemplateProps {
  id: string;
  className?: string;
  "data-ad-client": string;
  "data-ad-slot": string;
  "data-ad-format": string;
  "data-full-width-responsive"?: boolean | string;
  "data-ad-channel"?: string;
  style?: React.CSSProperties;
  channelId?: string;
}

const ElTemplate = forwardRef<HTMLModElement, AdTemplateProps>(function AdTemplate(props, ref) {
  useAdDisplay(`#${props.id}`);
  useEffect(() => {
    let cancelled = false;
    const run = () => {
      if (cancelled) return;
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch {}
    };
    const timer = window.setTimeout(run, 0);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [props.id, props["data-ad-slot"]]);
  return (
    <div className="ad-placeholder" style={{ textAlign: "center", paddingBlock: 12 }}>
      <p>AD</p>
      <ins 
        ref={ref}
        {...props}
        {...process.env.NODE_ENV === 'development' ? { "data-adtest": "on" } : {}}
      />
    </div>
  );
});

export default ElTemplate;
