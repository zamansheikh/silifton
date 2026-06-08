type SparkProps = { values: number[]; color?: string; height?: number; width?: number };

export function Sparkline({ values, color = "var(--accent)", height = 36, width = 200 }: SparkProps) {
  if (!values.length) return null;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const pts = values
    .map((v, i) => `${(i / (values.length - 1)) * width},${height - ((v - min) / range) * (height - 6) - 3}`)
    .join(" ");
  const area = `M0,${height} L${pts.split(" ").join(" L")} L${width},${height} Z`;
  const gradId = `spk-${color.replace(/[^a-z]/gi, "")}`;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" width="100%" height={height}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradId})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type Series = { values: number[]; color: string; label?: string };

export function AreaChart({ series, height = 280, labels }: { series: Series[]; height?: number; labels?: string[] }) {
  const w = 800;
  const h = height;
  const pad = { t: 20, r: 20, b: 32, l: 40 };
  const allVals = series.flatMap((s) => s.values);
  const max = Math.max(...allVals) * 1.15;
  const min = 0;
  const xStep = (w - pad.l - pad.r) / (series[0].values.length - 1);
  const yToPx = (v: number) => pad.t + (h - pad.t - pad.b) * (1 - (v - min) / (max - min));
  const xToPx = (i: number) => pad.l + i * xStep;
  const gridLines = [0, 0.25, 0.5, 0.75, 1].map((p) => pad.t + (h - pad.t - pad.b) * p);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" preserveAspectRatio="none">
      <defs>
        {series.map((s, i) => (
          <linearGradient key={i} id={`ac-${i}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={s.color} stopOpacity="0.28" />
            <stop offset="100%" stopColor={s.color} stopOpacity="0" />
          </linearGradient>
        ))}
      </defs>
      {gridLines.map((y, i) => (
        <line key={i} x1={pad.l} x2={w - pad.r} y1={y} y2={y} stroke="var(--border)" strokeDasharray="2 4" />
      ))}
      {labels?.map((lab, i) => (
        <text key={i} x={xToPx(i)} y={h - 10} fill="var(--fg-faint)" fontSize="10" fontFamily="var(--font-mono)" textAnchor="middle">
          {lab}
        </text>
      ))}
      {series.map((s, si) => {
        const pts = s.values.map((v, i) => `${xToPx(i)},${yToPx(v)}`).join(" L ");
        const area = `M ${pad.l},${h - pad.b} L ${pts} L ${xToPx(s.values.length - 1)},${h - pad.b} Z`;
        const line = `M ${pts}`;
        return (
          <g key={si}>
            <path d={area} fill={`url(#ac-${si})`} />
            <path d={line} fill="none" stroke={s.color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        );
      })}
    </svg>
  );
}

export function BarChart({ values, labels, color = "var(--accent)", height = 200 }: { values: number[]; labels?: string[]; color?: string; height?: number }) {
  const w = 600;
  const h = height;
  const pad = { t: 16, r: 8, b: 28, l: 28 };
  const max = Math.max(...values) * 1.15;
  const barW = (w - pad.l - pad.r) / values.length - 8;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" preserveAspectRatio="none">
      {[0, 0.5, 1].map((p, i) => {
        const y = pad.t + (h - pad.t - pad.b) * (1 - p);
        return <line key={i} x1={pad.l} x2={w - pad.r} y1={y} y2={y} stroke="var(--border)" strokeDasharray="2 4" />;
      })}
      {values.map((v, i) => {
        const x = pad.l + i * ((w - pad.l - pad.r) / values.length) + 4;
        const barH = ((h - pad.t - pad.b) * v) / max;
        const y = h - pad.b - barH;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={barH} rx="2" fill={color} opacity="0.85" />
            {labels && (
              <text x={x + barW / 2} y={h - 10} fill="var(--fg-faint)" fontSize="10" fontFamily="var(--font-mono)" textAnchor="middle">
                {labels[i]}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

export function Donut({ data, size = 160 }: { data: Array<{ label: string; value: number; color: string }>; size?: number }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const r = size / 2 - 12;
  const c = size / 2;
  let acc = 0;
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      {data.map((d, i) => {
        const start = (acc / total) * Math.PI * 2 - Math.PI / 2;
        acc += d.value;
        const end = (acc / total) * Math.PI * 2 - Math.PI / 2;
        const large = end - start > Math.PI ? 1 : 0;
        const x1 = c + r * Math.cos(start);
        const y1 = c + r * Math.sin(start);
        const x2 = c + r * Math.cos(end);
        const y2 = c + r * Math.sin(end);
        return <path key={i} d={`M ${c} ${c} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`} fill={d.color} opacity="0.9" />;
      })}
      <circle cx={c} cy={c} r={r * 0.62} fill="var(--surface-1)" />
    </svg>
  );
}
