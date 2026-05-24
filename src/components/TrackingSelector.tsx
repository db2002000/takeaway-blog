'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { getTrackingSelectorStates } from '@/lib/tracking-data';

type Option = { label: string; sub?: string; next: string };

type QuestionNode = {
  type: 'question';
  q: string;
  sub?: string;
  options: Option[];
};

type ResultNode = {
  type: 'result';
  category: string;
  categoryColor: 'warning' | 'danger' | 'info' | 'success';
  title: string;
  desc: string;
  items: { name: string; reason: string; frequency: string }[];
  tip?: string;
};

type StateNode = QuestionNode | ResultNode;

const COLOR_MAP = {
  warning: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', pill: 'bg-amber-100 border-amber-300 text-amber-800' },
  danger:  { bg: 'bg-red-50',   border: 'border-red-200',   text: 'text-red-700',   pill: 'bg-red-100 border-red-300 text-red-800' },
  info:    { bg: 'bg-sky-50',   border: 'border-sky-200',   text: 'text-sky-700',   pill: 'bg-sky-100 border-sky-300 text-sky-800' },
  success: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', pill: 'bg-green-100 border-green-300 text-green-800' },
};

export default function TrackingSelector() {
  const locale = useLocale();
  const STATES = getTrackingSelectorStates(locale === 'zh-Hant' ? 'zh' : locale);

  const [current, setCurrent] = useState('start');
  const [history, setHistory] = useState<string[]>([]);
  const [expandedItem, setExpandedItem] = useState<number | null>(null);

  const node = STATES[current];

  function choose(next: string) {
    setHistory((h) => [...h, current]);
    setCurrent(next);
    setExpandedItem(null);
  }

  function goBack() {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setCurrent(prev);
    setExpandedItem(null);
  }

  function reset() {
    setHistory([]);
    setCurrent('start');
    setExpandedItem(null);
  }

  const totalSteps = 3;
  const StepDots = () => (
    <div className='flex gap-1.5 justify-center mb-5'>
      {Array.from({ length: totalSteps }).map((_, i) => (
        <div
          key={i}
          className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
            i < history.length
              ? 'bg-zinc-400'
              : i === history.length
              ? 'bg-zinc-700'
              : 'bg-zinc-200'
          }`}
        />
      ))}
    </div>
  );

  const NavBar = () =>
    history.length > 0 ? (
      <div className='flex gap-4 justify-center mb-4 text-xs text-zinc-400'>
        <button onClick={goBack} className='hover:text-zinc-600 underline underline-offset-2 transition-colors'>
          ← {locale === 'en' ? 'Back' : '返回上一步'}
        </button>
        <button onClick={reset} className='hover:text-zinc-600 underline underline-offset-2 transition-colors'>
          {locale === 'en' ? 'Start over' : '重新开始'}
        </button>
      </div>
    ) : null;

  if (node.type === 'question') {
    return (
      <div className='max-w-lg mx-auto px-4 py-6 font-sans' style={{ maxHeight: '85vh', overflowY: 'auto' }}>
        <StepDots />
        <NavBar />
        <div className='bg-zinc-50 border border-zinc-200 rounded-2xl px-5 py-4 mb-3 text-center min-h-[100px] flex flex-col justify-center'>
          <p className='text-[15px] font-medium text-zinc-800 leading-relaxed'>{node.q}</p>
          {node.sub && (
            <p className='text-xs text-zinc-400 mt-1'>{node.sub}</p>
          )}
        </div>
        <div className='text-center text-zinc-300 text-lg mb-3'>↓</div>
        <div className='flex flex-col gap-2'>
          {node.options.map((opt) => (
            <button
              key={opt.next}
              onClick={() => choose(opt.next)}
              className='w-full text-left border border-zinc-200 rounded-xl px-4 py-3 bg-white hover:bg-zinc-50 hover:border-zinc-300 transition-all duration-150 group'
            >
              <div className='text-sm font-medium text-zinc-800 group-hover:text-zinc-900'>
                {opt.label}
              </div>
              {opt.sub && (
                <div className='text-xs text-zinc-400 mt-0.5'>{opt.sub}</div>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const colors = COLOR_MAP[node.categoryColor];

  return (
    <div className='max-w-lg mx-auto px-4 py-6 font-sans' style={{ maxHeight: '85vh', overflowY: 'auto' }}>
      <StepDots />
      <NavBar />
      <div className={`rounded-2xl border ${colors.border} ${colors.bg} px-5 py-5`}>
        <div className={`text-xs font-semibold tracking-wide mb-2 ${colors.text}`}>
          {node.category}
        </div>
        <h2 className='text-[15px] font-semibold text-zinc-900 leading-snug mb-2'>
          {node.title}
        </h2>
        <p className='text-xs text-zinc-600 leading-relaxed mb-4'>{node.desc}</p>

        <p className='text-[11px] text-zinc-400 mb-3'>
          {locale === 'en' ? 'Recommended tracking items:' : '推荐的追踪项：'}
        </p>

        <div className='space-y-2 mb-4'>
          {node.items.map((item, i) => (
            <div key={item.name}>
              <button
                onClick={() => setExpandedItem(expandedItem === i ? null : i)}
                className='w-full text-left'
              >
                <div className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border transition-all duration-150 ${
                  expandedItem === i
                    ? `${colors.pill} border-current`
                    : 'bg-white border-zinc-200 hover:border-zinc-300'
                }`}>
                  <span className='text-sm font-medium text-zinc-800'>{item.name}</span>
                  <span className='ml-auto text-xs text-zinc-400'>
                    {expandedItem === i ? '−' : '+'}
                  </span>
                </div>
              </button>
              {expandedItem === i && (
                <div className='mt-1 px-3 py-2.5 bg-white/50 rounded-xl border border-zinc-100 text-xs text-zinc-600 leading-relaxed'>
                  <div className='mb-1.5'>
                    <span className='font-medium text-zinc-700'>
                      {locale === 'en' ? 'Why: ' : '为什么追踪：'}
                    </span>
                    {item.reason}
                  </div>
                  <div>
                    <span className='font-medium text-zinc-700'>
                      {locale === 'en' ? 'Frequency: ' : '频率：'}
                    </span>
                    {item.frequency}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {node.tip && (
          <div className='text-[11px] text-zinc-500 leading-relaxed border-t border-zinc-200/60 pt-3'>
            💡 {node.tip}
          </div>
        )}
      </div>

      <div className='text-center mt-4'>
        <button
          onClick={reset}
          className='text-xs text-zinc-400 hover:text-zinc-600 border border-zinc-200 rounded-lg px-4 py-2 transition-colors hover:bg-zinc-50'
        >
          {locale === 'en' ? 'Go through again' : '重新走一遍'}
        </button>
      </div>
    </div>
  );
}