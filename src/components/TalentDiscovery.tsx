'use client';

import { useState, useEffect } from 'react';
import { TALENTS } from '@/components/talent-discovery/constants';

type TabName = 'intro' | 'questions' | 'list' | 'peer' | 'map';

const Q_LABELS = [
  '让你不满的事',
  '被提醒的事',
  '被禁止会痛苦的事',
  '缺点转优点',
  '他人讨厌你却喜欢的事',
];

const PEER_LABELS = ['被夸奖的事', '与众不同的地方', '被感谢的事'];

const TAB_TITLES: Record<TabName, string> = {
  intro: '读前须知',
  questions: '五个问题',
  list: '天赋清单',
  peer: '询问他人',
  map: '天赋地图',
};

export default function TalentDiscovery() {
  const [activeTab, setActiveTab] = useState<TabName>('intro');
  const [answers, setAnswers] = useState<string[]>(['', '', '', '', '']);
  const [peerAnswers, setPeerAnswers] = useState<string[]>(['', '', '']);
  const [selectedTalents, setSelectedTalents] = useState<Set<number>>(new Set());
  const [mapBuilt, setMapBuilt] = useState(false);

  function switchTab(name: TabName) {
    setActiveTab(name);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function updateAnswer(i: number, value: string) {
    setAnswers((prev) => {
      const next = [...prev];
      next[i] = value;
      return next;
    });
  }

  function updatePeerAnswer(i: number, value: string) {
    setPeerAnswers((prev) => {
      const next = [...prev];
      next[i] = value;
      return next;
    });
  }

  function toggleTalent(i: number) {
    setSelectedTalents((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  function buildMap() {
    setMapBuilt(true);
    switchTab('map');
  }

  const filledCount = answers.filter((a) => a.trim().length > 0).length;

  return (
    <div className="max-w-[720px] mx-auto px-6 pb-16 pt-4">
      {/* Hero */}
      <div className="text-center py-10 border-b border-border mb-8">
        <div
          className="font-display font-light text-7xl text-text-muted mb-4"
          style={{ letterSpacing: '-0.02em', lineHeight: 1.2 }}
        >
          才能
        </div>
        <h1
          className="font-display font-light text-3xl mb-2"
          style={{ letterSpacing: '0.14em' }}
        >
          发现你的天赋
        </h1>
        <p className="font-ui text-xs" style={{ letterSpacing: '0.05em', color: 'var(--color-text-muted)' }}>
          基于八木仁平《世界一やさしい「才能」の見つけ方》· 自助探索工具
        </p>
      </div>

      {/* Nav tabs */}
      <div
        className="flex border-b border-border mb-8 overflow-x-auto mb-10"
        style={{ scrollbarWidth: 'none' }}
      >
        {(Object.keys(TAB_TITLES) as TabName[]).map((tab) => (
          <button
            key={tab}
            onClick={() => switchTab(tab)}
            className={`font-ui text-xs px-4 py-2.5 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab
                ? 'text-text-primary border-text-primary font-medium'
                : 'text-text-muted border-transparent hover:text-text-secondary'
            }`}
            style={{ marginBottom: '-0.5px' }}
          >
            {TAB_TITLES[tab]}
          </button>
        ))}
      </div>

      {/* ── INTRO ─────────────────────────────────── */}
      {activeTab === 'intro' && (
        <div>
          <SectionLabel>开始之前</SectionLabel>

          <FYI>
            天赋 ≠ 比别人厉害的事，而是你<strong style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>
              「下意识会去做的事」
            </strong>
            ——即使没有奖励、没有人要求，你也自然而然会去做的行为。
          </FYI>

          <Card>
            <CardNum>天赋公式</CardNum>
            <div className="flex flex-wrap gap-2 mb-3">
              <Node label="缺点" />
              <Arrow>←</Arrow>
              <Node label="天赋" accent />
              <Arrow>→</Arrow>
              <Node label="优点" />
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              <Node label="天赋" accent />
              <Arrow>×</Arrow>
              <Node label="技能和知识" />
              <Arrow>=</Arrow>
              <Node label="强项" />
            </div>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
              同一个天赋，在不同环境下可以是缺点，也可以是优点。目标不是改变自己，而是找到能发挥天赋的场景。
            </p>
          </Card>

          <SectionLabel>五个常见误区</SectionLabel>

          {[
            { label: '误区 ① 天赋就是比别人做得好的事', truth: '真相：下意识会去做的事才是天赋，无需和他人比较。' },
            { label: '误区 ② 证书和技能比天赋更重要', truth: '真相：天赋可终生使用、适用于各种场景；技能可能会过时。' },
            { label: '误区 ③ 要变成理想中的自己', truth: '真相：不需要改变自己，只需要发挥自己。' },
            { label: '误区 ④ 努力必有回报', truth: '真相：顺着天赋做事，才能事半功倍。' },
            { label: '误区 ⑤ 跟着成功的人学就能成功', truth: '真相：每个人的天赋不同，别人的路未必适合你。' },
          ].map((m) => (
            <MisItem key={m.label} label={m.label} truth={m.truth} />
          ))}

          <button
            className="w-full mt-8 py-3 rounded-lg text-sm font-ui transition-colors"
            style={{
              background: 'var(--color-text-primary)',
              color: 'var(--color-bg)',
              border: '0.5px solid var(--color-text-primary)',
            }}
            onClick={() => switchTab('questions')}
          >
            开始探索 →
          </button>
        </div>
      )}

      {/* ── QUESTIONS ───────────────────────────────── */}
      {activeTab === 'questions' && (
        <div>
          <SectionLabel>技巧一 · 回答五个问题</SectionLabel>

          <ProgressDots done={filledCount} total={5} />

          {[
            {
              num: 1,
              q: '让你对他人感到不满的事情是什么？',
              hint: '你感到不满，往往是因为「如果是我，就会这样做」——这背后藏着你的天赋，某件对你来说理所当然的事，别人却做不到。',
              examples: [
                '对说话自相矛盾的人不满 → 逻辑思考的天赋',
                '对一再犯同样错误的人不满 → 从根本解决问题的天赋',
                '对不考虑他人立场的人不满 → 换位思考的天赋',
              ],
            },
            {
              num: 2,
              q: '父母或老师常常提醒你的事情是什么？',
              hint: '被提醒往往是因为这个特点太突出了。F1赛车在普通公路上会超速被罚，放到赛车道上却是优势——你的天赋也需要对的环境。',
              examples: [
                '被提醒容易厌倦 → 对新事物保持好奇心的天赋',
                '被提醒不和人商量就做决定 → 独立决策的天赋',
                '被提醒说话太直接 → 清晰表达的天赋',
              ],
            },
            {
              num: 3,
              q: '一旦被禁止就感到痛苦的事情是什么？',
              hint: '天赋就是下意识会去做的事，不做反而感觉不自然。可以换个思路：什么样的工作环境会让你感到特别压抑？',
              examples: [
                '被禁止和人见面交谈 → 与他人沟通的天赋',
                '被禁止给人提建议 → 发现改进点的天赋',
                '被禁止看书学习 → 持续学习的天赋',
              ],
            },
            {
              num: 4,
              q: '用「正因如此」重新表述你的缺点',
              hint: '人更容易发现缺点。试试这个魔法：把「因为我……所以……（负面）」改成「正因为我……所以能……（正面）」。',
              examples: [
                '和他人久处觉得疲惫 → 正因如此，能独立创造新事物',
                '有时用词激烈 → 正因如此，能用语言激励他人',
                '很难按指示行事 → 正因如此，能主动采取行动',
              ],
            },
            {
              num: 5,
              q: '他人讨厌而你却乐在其中的事情是什么？',
              hint: '如果有一件事，别人觉得是工作，而你觉得像玩——那就是天赋的信号。关键是继续深挖：其中「哪个具体行为」让你最享受？',
              examples: [
                '游戏中升级打怪很有趣 → 稳步成长的天赋',
                '检查文件里的错误很有趣 → 发现问题的天赋',
                '主持会议让大家发言很有趣 → 引导讨论的天赋',
              ],
            },
          ].map((item, i) => (
            <Card key={i}>
              <CardNum>问题 {item.num} / 五</CardNum>
              <div className="text-base font-medium mb-2" style={{ lineHeight: 1.5 }}>
                {item.q}
              </div>
              <div className="text-sm mb-3" style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
                {item.hint}
              </div>
              <Examples examples={item.examples} />
              <textarea
                value={answers[i]}
                onChange={(e) => updateAnswer(i, e.target.value)}
                placeholder="写下让你感到不满的行为，再想想：你认为理所当然的，是什么？"
                className="w-full min-h-[88px] rounded-lg border p-3 text-sm resize-y"
                style={{
                  background: 'var(--color-bg)',
                  color: 'var(--color-text-primary)',
                  borderColor: 'var(--color-border-muted)',
                  lineHeight: 1.7,
                  fontFamily: 'var(--font-ui)',
                }}
              />
            </Card>
          ))}

          <button
            className="w-full py-3 rounded-lg text-sm font-ui transition-colors border"
            style={{ borderColor: 'var(--color-border-muted)', background: 'transparent', color: 'var(--color-text-primary)' }}
            onClick={() => switchTab('list')}
          >
            下一步：从天赋清单中选择 →
          </button>
        </div>
      )}

      {/* ── LIST ─────────────────────────────────── */}
      {activeTab === 'list' && (
        <div>
          <SectionLabel>技巧二 · 从清单中选择</SectionLabel>

          <FYI>
            以下是书中整理的天赋选项（精选50项）。
            <strong style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>
              先从「缺点」这列开始看
            </strong>
            ，更容易产生共鸣。点击选择让你感到「这说的就是我！」的天赋。
          </FYI>

          <div className="mb-4">
            <div className="text-xs mb-2" style={{ color: 'var(--color-text-secondary)' }}>
              已选天赋
            </div>
            <SelectedTags selected={selectedTalents} />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
            {TALENTS.map((item, i) => (
              <TalentChip
                key={i}
                name={item.t}
                desc={item.d}
                selected={selectedTalents.has(i)}
                onClick={() => toggleTalent(i)}
              />
            ))}
          </div>

          <button
            className="w-full py-3 rounded-lg text-sm font-ui transition-colors border"
            style={{ borderColor: 'var(--color-border-muted)', background: 'transparent', color: 'var(--color-text-primary)' }}
            onClick={() => switchTab('peer')}
          >
            下一步：询问他人 →
          </button>
        </div>
      )}

      {/* ── PEER ─────────────────────────────────── */}
      {activeTab === 'peer' && (
        <div>
          <SectionLabel>技巧三 · 询问他人</SectionLabel>

          <FYI>
            「唯一不了解自己的人，就是自己。」研究表明，亲密的人比我们自己更能准确判断性格。借助他人视角，能发现那些对自己理所当然、但在他人眼中很特别的天赋。
          </FYI>

          {[
            {
              num: 1,
              q: '你没有特别努力却被夸奖的事是什么？',
              hint: '努力后才被夸 → 不一定是天赋。没怎么努力就被夸 → 这才是天赋的信号。可以直接问亲近的人：「你觉得我有什么厉害的地方？」',
            },
            {
              num: 2,
              q: '我与众不同的地方是什么？',
              hint: '「不同之处」无论是优点还是缺点，背后通常都暗藏着天赋。可以问朋友或同事：「你觉得我和大家有什么不一样的地方？」',
            },
            {
              num: 3,
              q: '别人感谢你帮助过他们的事是什么？',
              hint: '越是觉得「这没什么，举手之劳」的帮助，越可能是天赋——因为你根本没意识到自己做了什么特别的事。',
            },
          ].map((item, i) => (
            <Card key={i}>
              <CardNum>方法 {item.num}</CardNum>
              <div className="text-base font-medium mb-2" style={{ lineHeight: 1.5 }}>
                {item.q}
              </div>
              <div className="text-sm mb-3" style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
                {item.hint}
              </div>
              <textarea
                value={peerAnswers[i]}
                onChange={(e) => updatePeerAnswer(i, e.target.value)}
                placeholder="写下别人夸过你、但你觉得只是「正常操作」的事。"
                className="w-full min-h-[88px] rounded-lg border p-3 text-sm resize-y"
                style={{
                  background: 'var(--color-bg)',
                  color: 'var(--color-text-primary)',
                  borderColor: 'var(--color-border-muted)',
                  lineHeight: 1.7,
                  fontFamily: 'var(--font-ui)',
                }}
              />
            </Card>
          ))}

          <button
            className="w-full py-3 rounded-lg text-sm font-ui transition-colors"
            style={{
              background: 'var(--color-text-primary)',
              color: 'var(--color-bg)',
              border: '0.5px solid var(--color-text-primary)',
            }}
            onClick={buildMap}
          >
            生成我的天赋地图 →
          </button>
        </div>
      )}

      {/* ── MAP ─────────────────────────────────── */}
      {activeTab === 'map' && (
        <div>
          <SectionLabel>天赋地图</SectionLabel>

          {!mapBuilt ? (
            <FYI>
              完成前面三个模块后，点击「生成我的天赋地图」，你的探索结果会汇总在这里。
            </FYI>
          ) : (
            <div>
              <ReportBlock title="从五个问题中浮现的线索">
                {answers.some((a) => a.trim().length > 0) ? (
                  answers.map((a, i) =>
                    a.trim() ? (
                      <AnswerPreview key={i} label={Q_LABELS[i]} text={a} />
                    ) : null
                  )
                ) : (
                  <EmptyState>还没有回答问题</EmptyState>
                )}
              </ReportBlock>

              <ReportBlock title="从清单中选择的天赋">
                {selectedTalents.size > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {[...selectedTalents].map((i) => (
                      <Tag key={i} highlight>
                        {TALENTS[i].t}
                      </Tag>
                    ))}
                  </div>
                ) : (
                  <EmptyState>还没有从清单中选择</EmptyState>
                )}
              </ReportBlock>

              <ReportBlock title="从他人视角发现的天赋">
                {peerAnswers.some((a) => a.trim().length > 0) ? (
                  peerAnswers.map((a, i) =>
                    a.trim() ? (
                      <AnswerPreview key={i} label={PEER_LABELS[i]} text={a} />
                    ) : null
                  )
                ) : (
                  <EmptyState>还没有填写他人视角</EmptyState>
                )}
              </ReportBlock>

              <ReportBlock title="下一步">
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)', lineHeight: 1.9 }}>
                  你完成了 <strong>{filledCount}</strong> 个问题，从清单中选择了{' '}
                  <strong>{selectedTalents.size}</strong> 项天赋
                  {peerAnswers.some((a) => a.trim().length > 0) && '，并记录了他人视角的观察'}
                  。<br /><br />
                  建议从中圈出 <strong>3～5项</strong> 最有共鸣的天赋，思考它们在你生活中的具体场景。然后问自己：在什么工作或环境里，这些天赋会被视为优点？那里就是你应该去的方向。<br /><br />
                  下一步：天赋 × 技能和知识 = 强项。找到一个榜样，观察他们如何发挥与你相似的天赋。
                </p>
              </ReportBlock>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Sub-components ─────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="font-ui text-xs mb-6"
      style={{ letterSpacing: '0.18em', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}
    >
      {children}
    </div>
  );
}

function FYI({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-lg p-4 mb-6 text-sm"
      style={{
        background: 'var(--color-bg)',
        color: 'var(--color-text-secondary)',
        lineHeight: 1.8,
      }}
    >
      {children}
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-xl p-6 mb-5"
      style={{
        border: '0.5px solid var(--color-border)',
        background: 'var(--color-surface)',
      }}
    >
      {children}
    </div>
  );
}

function CardNum({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="font-display text-xs mb-2"
      style={{ letterSpacing: '0.1em', color: 'var(--color-text-muted)' }}
    >
      {children}
    </div>
  );
}

function Node({ label, accent }: { label: string; accent?: boolean }) {
  return (
    <div
      className="rounded-md px-3 py-1 text-sm"
      style={{
        border: '0.5px solid',
        borderColor: accent ? 'var(--color-border-muted)' : 'var(--color-border-muted)',
        color: 'var(--color-text-secondary)',
        background: accent ? 'var(--color-surface)' : 'var(--color-bg)',
        fontWeight: accent ? 500 : 400,
      }}
    >
      {label}
    </div>
  );
}

function Arrow({ children }: { children: string }) {
  return (
    <span className="text-sm" style={{ color: 'var(--color-text-muted)', alignSelf: 'center' }}>
      {children}
    </span>
  );
}

function MisItem({ label, truth }: { label: string; truth: string }) {
  return (
    <div
      className="pl-4 mb-3"
      style={{ borderLeft: '2px solid var(--color-border)' }}
    >
      <div className="font-medium text-sm" style={{ color: 'var(--color-text-primary)' }}>
        {label}
      </div>
      <div className="text-sm mt-0.5" style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
        {truth}
      </div>
    </div>
  );
}

function ProgressDots({ done, total }: { done: number; total: number }) {
  return (
    <div className="flex gap-1.5 mb-6">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="h-[3px] flex-1 rounded-full transition-colors duration-300"
          style={{
            background: i < done ? 'var(--color-text-primary)' : 'var(--color-border)',
          }}
        />
      ))}
    </div>
  );
}

function Examples({ examples }: { examples: string[] }) {
  return (
    <div
      className="rounded-md p-3 mb-4 text-sm"
      style={{
        background: 'var(--color-bg)',
        color: 'var(--color-text-secondary)',
        lineHeight: 1.9,
      }}
    >
      <div
        className="text-xs font-medium mb-1"
        style={{
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--color-text-muted)',
          fontFamily: 'var(--font-ui)',
        }}
      >
        参考示例
      </div>
      {examples.map((ex, i) => (
        <div key={i}>{ex}</div>
      ))}
    </div>
  );
}

function TalentChip({
  name,
  desc,
  selected,
  onClick,
}: {
  name: string;
  desc: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="text-left rounded-md p-3 cursor-pointer transition-all text-sm"
      style={{
        border: '0.5px solid',
        borderColor: selected ? 'var(--color-text-primary)' : 'var(--color-border)',
        background: selected ? 'var(--color-bg)' : 'var(--color-surface)',
        lineHeight: 1.4,
      }}
    >
      <div className="font-medium" style={{ color: 'var(--color-text-primary)' }}>
        {name}
      </div>
      <div className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
        {desc}
      </div>
    </button>
  );
}

function SelectedTags({ selected }: { selected: Set<number> }) {
  return (
    <div className="flex flex-wrap gap-2 min-h-[32px]">
      {selected.size === 0 ? (
        <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
          还没有选择，从下方点击吧
        </span>
      ) : (
        [...selected].map((i) => <Tag key={i} highlight>{TALENTS[i].t}</Tag>)
      )}
    </div>
  );
}

function Tag({ children, highlight }: { children: React.ReactNode; highlight?: boolean }) {
  return (
    <span
      className="inline-block rounded px-2 py-0.5 text-xs"
      style={{
        border: '0.5px solid',
        borderColor: highlight ? 'var(--color-text-primary)' : 'var(--color-border-muted)',
        color: highlight ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
        fontWeight: highlight ? 500 : 400,
      }}
    >
      {children}
    </span>
  );
}

function ReportBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="pb-5 mb-5"
      style={{ borderBottom: '0.5px solid var(--color-border)' }}
    >
      <div className="font-medium text-sm mb-3" style={{ color: 'var(--color-text-primary)' }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function AnswerPreview({ label, text }: { label: string; text: string }) {
  return (
    <div className="mb-3">
      <div className="text-xs mb-1" style={{ letterSpacing: '0.06em', color: 'var(--color-text-muted)' }}>
        {label}
      </div>
      <div
        className="rounded-md px-3 py-2 text-sm"
        style={{
          background: 'var(--color-bg)',
          color: 'var(--color-text-secondary)',
          lineHeight: 1.7,
        }}
      >
        {text}
      </div>
    </div>
  );
}

function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
      {children}
    </span>
  );
}