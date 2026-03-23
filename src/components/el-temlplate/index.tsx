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
    const timer = window.setTimeout(() => {
      const ins = document.getElementById(props.id);
      if (!ins) return;
      const status = ins.getAttribute("data-adsbygoogle-status") || ins.getAttribute("data-ad-status");
      if (status) return;
      try {
        const w = window as unknown as { adsbygoogle?: unknown[] };
        const q = (w.adsbygoogle ?? []) as unknown[];
        w.adsbygoogle = q;
        q.push({});
      } catch {}
    }, 0);
    return () => window.clearTimeout(timer);
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
