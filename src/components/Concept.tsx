'use client';

import { useState } from 'react';
import { concepts } from '../../content/concepts';

interface ConceptProps {
  id: string;
  children: React.ReactNode;
}

export default function Concept({ id, children }: ConceptProps) {
  const concept = concepts[id];
  const [show, setShow] = useState(false);

  if (!concept) {
    return <span>{children}</span>;
  }

  return (
    <span
      className="relative inline"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <span className="text-accent cursor-help border-b border-dashed border-accent hover:text-accent-pink transition-colors">
        {children}
      </span>

      {show && (
        <div
          className="absolute z-50 w-64 p-4 bg-white rounded-xl shadow-lg border border-border"
          style={{
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginTop: '8px',
          }}
        >
          <div
            className="absolute w-3 h-3 bg-white border-l border-t border-border"
            style={{
              top: '-6px',
              left: '50%',
              transform: 'translateX(-50%) rotate(45deg)',
            }}
          />
          <h4 className="font-bold text-text-primary mb-1">
            {concept.zh.title}
          </h4>
          {concept.en && (
            <p className="text-xs text-text-muted mb-2">
              {concept.en.title}
            </p>
          )}
          <p className="text-sm text-text-secondary leading-relaxed mb-2">
            {concept.zh.desc}
          </p>
          {concept.related && concept.related.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-2 border-t border-border">
              {concept.related.map((relId) => {
                const rel = concepts[relId];
                return rel ? (
                  <span
                    key={relId}
                    className="text-xs px-2 py-0.5 rounded-full bg-accent-muted text-accent-pink"
                  >
                    {rel.zh.title}
                  </span>
                ) : null;
              })}
            </div>
          )}
        </div>
      )}
    </span>
  );
}