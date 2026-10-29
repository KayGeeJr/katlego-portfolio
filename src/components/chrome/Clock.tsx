"use client";

import { useEffect, useState } from "react";

const fmt = new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Johannesburg", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
const hourFmt = new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Johannesburg", hour: "numeric", hour12: false });

export function sastHour(d = new Date()) {
  return Number(hourFmt.format(d));
}

export function dayPhrase(h: number) {
  if (h >= 5 && h < 7) return "Sunrise on the Highveld";
  if (h >= 7 && h < 17) return "Working hours here";
  if (h >= 17 && h < 19) return "Golden hour in Gauteng";
  return "After dark in Kempton Park";
}

/** Live Johannesburg time. Renders a fixed-width placeholder on the server so nothing shifts. */
export default function Clock({ withPhrase = false, className = "" }: { withPhrase?: boolean; className?: string }) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const time = now ? fmt.format(now) : "--:--:--";
  return (
    <span className={className}>
      <time className="t-data tabular-nums" dateTime={now?.toISOString()} suppressHydrationWarning>
        <span className="sr-only">Local time in Johannesburg: </span>
        {time} SAST
      </time>
      {withPhrase && (
        <span className="block text-[0.8125rem] opacity-80" suppressHydrationWarning>
          {now ? dayPhrase(sastHour(now)) : " "}
        </span>
      )}
    </span>
  );
}
