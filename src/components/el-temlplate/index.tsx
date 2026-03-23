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
    let timer: number | undefined;
    let attempts = 0;
    const maxAttempts = 60;

    const tick = () => {
      if (cancelled) return;
      const ins = document.getElementById(props.id);
      if (!ins) {
        attempts += 1;
        if (attempts < maxAttempts) timer = window.setTimeout(tick, 150);
        return;
      }

      if (ins.getAttribute("data-ads-pushed") === "1") return;

      const status = ins.getAttribute("data-adsbygoogle-status") || ins.getAttribute("data-ad-status");
      if (status) return;

      try {
        const w = window as unknown as { adsbygoogle?: unknown[] };
        const q = (w.adsbygoogle ?? []) as unknown[];
        w.adsbygoogle = q;
        ins.setAttribute("data-ads-pushed", "1");
        q.push({});
      } catch {}

      attempts += 1;
      if (attempts < maxAttempts) timer = window.setTimeout(tick, 250);
    };

    timer = window.setTimeout(tick, 0);
    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
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
