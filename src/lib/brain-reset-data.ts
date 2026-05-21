import { useLocale } from 'next-intl';

type Option = { label: string; sub?: string; next: string };

type QuestionNode = {
  type: 'question';
  q: string;
  sub?: string;
  options: Option[];
};

type ResultNode = {
  type: 'result';
  state: string;
  stateColor: 'warning' | 'danger' | 'info' | 'success';
  title: string;
  desc: string;
  highlight: string[];
  methods: { name: string; mec: string }[];
  tip?: string;
};

type StateNode = QuestionNode | ResultNode;
type States = Record<string, StateNode>;

// 中文（简体）数据
const ZH_STATES: States = {
  start: {
    type: 'question',
    q: '你现在更像哪种状态？',
    sub: '从最贴近当下感受的选一个',
    options: [
      { label: '脑子停不下来', sub: '反复想，担心，停不住', next: 'acute_or_anxiety' },
      { label: '整个人提不起劲', sub: '疲惫、麻木、想躺平', next: 'chronic' },
      { label: '情绪突然来了', sub: '被某件事触发，很强烈', next: 'emotion_acute' },
    ],
  },
  acute_or_anxiety: {
    type: 'question',
    q: '停不下来持续多久了？',
    options: [
      { label: '今天刚发生的事', sub: '有明确触发源', next: 'acute_stress' },
      { label: '已经好几天 / 想不出原因', sub: '持续的担忧或警觉', next: 'anxiety' },
    ],
  },
  acute_stress: {
    type: 'result',
    state: '⚡ 急性压力',
    stateColor: 'warning',
    title: '先让身体降下来，再谈别的',
    desc: '杏仁核评估到威胁，交感神经激活，意识、能量、注意力飙升。事件结束后感觉通常会缓解——先处理身体反应。',
    highlight: ['生理性叹息'],
    methods: [
      { name: '生理性叹息', mec: '短促吸气2次→闭气1秒→用嘴长慢呼气。CO₂升高触发焦虑，叹息让塌陷的肺泡重新打开，副交感上线' },
      { name: '出去走走', mec: '眼睛左右扫视激活前额顶叶网络，情绪脑暂时后退' },
      { name: '命名情绪', mec: '说出「我现在感到___」，调用前额叶活动，重新获得控制感' },
    ],
    tip: '把「生理性叹息」写在便利贴贴在显眼处，因为在高压状态下你会忘记用它',
  },
  anxiety: {
    type: 'question',
    q: '这些担忧有没有在脑子里反复转？',
    sub: '比如同一件事想了很多遍',
    options: [
      { label: '有，停不下来', next: 'anxiety_loop' },
      { label: '没有，就是莫名紧张', next: 'anxiety_baseline' },
    ],
  },
  anxiety_loop: {
    type: 'result',
    state: '🔄 焦虑回路',
    stateColor: 'danger',
    title: '你进了习惯回路，需要打破提示-反应链',
    desc: '提示→反复思考→短暂缓解→多巴胺奖励→下次更容易触发。慢慢地，不同脑区开始频繁交换负面信号，塑造信念，影响决策。身体会觉得紧绷才是安全的。',
    highlight: ['识别提示', '出去散步'],
    methods: [
      { name: '识别提示', mec: '焦虑回路的第一步是找到触发提示——是什么场景、时间、感觉让你开始反刍？' },
      { name: '出去散步', mec: '激活前额顶叶网络，杏仁核活动↓，帮你从回路里物理脱离' },
      { name: '冥想', mec: '缩小杏仁核大小，提高对想法/情绪的觉察能力，减少自动化反应' },
      { name: '视觉化', mec: '提前预演「当X发生时，我可以这样感受和回应」，否则面临真实情境时退回自动模式' },
      { name: '认知介入', mec: '改变对事件的解读方式（CBT思路），而不是压制想法' },
    ],
    tip: '警惕焦虑缓解后马上刷社交媒体——它释放多巴胺，强化这套回路',
  },
  anxiety_baseline: {
    type: 'result',
    state: '⚠️ 基线焦虑偏高',
    stateColor: 'warning',
    title: '杏仁核长期过度活跃，需要系统性降低基线',
    desc: '没有明确事件，却总是紧张、高度警觉——这是杏仁核慢性激活后基线上移的状态。急性工具效果有限，需要从根本上缩小杏仁核。',
    highlight: ['冥想', '定期运动'],
    methods: [
      { name: '冥想', mec: '长期练习可缩小杏仁核结构大小，大脑可塑性↑，自我觉察能力↑' },
      { name: '定期运动', mec: '释放BDNF（神经细胞养料），降低炎症，释放内啡肽，抗焦虑效果有大量证据' },
      { name: '睡眠', mec: '深度睡眠修复身体和心理创伤，睡眠不足直接放大杏仁核反应' },
    ],
    tip: '从散步开始——不需要「运动」的心理负担，但效果真实',
  },
  chronic: {
    type: 'question',
    q: '这种状态大概持续多久了？',
    options: [
      { label: '最近几天', sub: '有具体事情在压着', next: 'chronic_recent' },
      { label: '很长时间了', sub: '感觉已经习惯了', next: 'chronic_deep' },
    ],
  },
  chronic_recent: {
    type: 'result',
    state: '🔋 低电量模式（短期）',
    stateColor: 'warning',
    title: '适应性压力转慢性的临界点，小改变比大改变更有效',
    desc: '急性压力没有消失，身体进入「活下来」模式。大脑先考虑生存，不考虑改变。这时候提不起劲是生理状态，不是意志力问题。',
    highlight: ['出去散步', '沉浸式活动'],
    methods: [
      { name: '出去散步', mec: '最低成本的BDNF提升方式。不需要「锻炼」，只是走出去' },
      { name: '沉浸式活动', mec: '找一件可以完全沉浸进去的事——有益感/学习感/创造感，让压力有地方「卸载」' },
      { name: '生理性叹息', mec: '临时重置呼吸频率，帮身体从压力反应中回来' },
      { name: '大扫除', mec: '设立界限，去除消耗能量的东西（包括取关让你产生自卑感的账号）' },
    ],
    tip: '一个小改变会引发连串效应，不需要一次改变很多事情',
  },
  chronic_deep: {
    type: 'question',
    q: 'Is there an ongoing source draining you?',
    sub: 'Like relationships, environment, work, inner critic',
    options: [
      { label: '有，我知道是什么', next: 'chronic_source_known' },
      { label: '说不清楚，就是这样', next: 'chronic_source_unknown' },
    ],
  },
  chronic_source_known: {
    type: 'result',
    state: '🔋 慢性压力（有源头）',
    stateColor: 'danger',
    title: '先处理消耗源，同时建立恢复能力',
    desc: '长期超出承受范围的要求→额叶皮质结构性变化（决策、自控能力↓）→调节杏仁核的能力↓→海马体变化（记忆和压力反应）。这是生理层面的改变，需要系统性介入。',
    highlight: ['大扫除', '定期运动', '睡眠'],
    methods: [
      { name: '大扫除', mec: '设立界限，去除消耗能量的东西。取关触发自卑感的账号，减少无益刺激' },
      { name: '定期运动', mec: 'BDNF↑，炎症↓，内啡肽释放，抗忧郁作用有大量神经科学证据' },
      { name: '睡眠', mec: '深度睡眠是身体和心理创伤的主要修复窗口' },
      { name: '兴趣爱好', mec: '有益感/学习感/创造感的活动→沉浸其中感觉良好→BDNF。不是刷短视频那种刺激' },
      { name: '冥想', mec: '长期缩小杏仁核，大脑可塑性↑' },
    ],
    tip: '不需要急着改变所有事——一个真实的小改变，比十个计划更有力量',
  },
  chronic_source_unknown: {
    type: 'result',
    state: '🔋 慢性低能量',
    stateColor: 'danger',
    title: '从身体层面开始，而不是「找原因」',
    desc: '当慢性压力让前额叶功能受损时，你的分析能力本身也在打折——这时候「想清楚为什么」往往是循环。先恢复身体，前额叶功能回来后再复盘。',
    highlight: ['散步', '睡眠'],
    methods: [
      { name: '散步', mec: '无需意志力，随时可以做，BDNF和副交感效果都有。这是最低门槛的系统性改变' },
      { name: '睡眠', mec: '深度睡眠修复身心。如果睡眠本身有问题，它是优先级最高的一件事' },
      { name: '冥想', mec: '哪怕3-5分钟，开始建立觉察能力。不需要「做对」' },
      { name: '兴趣爱好', mec: '找一件有沉浸感的事，不是「有用的」，是「让你忘记时间的」' },
    ],
    tip: '有时候说不清楚来源本身就是慢性压力的症状——先不用找答案',
  },
  emotion_acute: {
    type: 'question',
    q: 'How intense is this emotion?',
    options: [
      { label: 'Very strong, almost out of control', next: 'emotion_strong' },
      { label: 'Moderate, but lingering', next: 'emotion_medium' },
    ],
  },
  emotion_strong: {
    type: 'result',
    state: '🌊 强烈情绪来袭',
    stateColor: 'danger',
    title: '前额叶暂时下线，先做身体动作',
    desc: '强烈情绪时，负责理性思考的前额叶会变得没那么好用。不是你「意志力不够」——是生理状态。先用身体动作重置，再做任何分析。',
    highlight: ['生理性叹息', '走出去'],
    methods: [
      { name: '生理性叹息', mec: '恢复前额叶若干功能最快的工具。短促吸气2次→闭气1秒→嘴巴长慢呼气' },
      { name: '走出去', mec: '扩大视野，离开触发情绪的环境，给逻辑脑空间' },
      { name: '命名情绪', mec: '准确叫出感受的名字（「我感到愤怒/委屈/恐惧」），调用前额叶，重新获得控制感' },
    ],
    tip: '情绪本身没什么——真正让人困住的是在长期情绪和压力下，我们开始对自己产生偏见',
  },
  emotion_medium: {
    type: 'result',
    state: '💭 持续情绪',
    stateColor: 'info',
    title: '辨识它，给它一个名字',
    desc: '辨识情绪并准确命名，可以让你清楚了解真实感受——这个举动本身就能调用前额叶活动，让你重新获得对情况的控制权。',
    highlight: ['命名情绪', '认知介入'],
    methods: [
      { name: '命名情绪', mec: '不是「我很烦」，而是「我感到委屈/失落/嫉妒/恐惧」。越精确，前额叶参与越多' },
      { name: '认知介入', mec: '问：这件事我是怎么解读的？有没有其他可能的解读？（CBT核心方法）' },
      { name: '出去走走', mec: '换环境，给情绪处理创造物理空间' },
    ],
    tip: '识别是改变的第一步。你不需要「解决」这个情绪，先知道它是什么就够了',
  },
};

// 英文数据
const EN_STATES: States = {
  start: {
    type: 'question',
    q: 'What state are you in right now?',
    sub: 'Pick the one that best matches how you feel',
    options: [
      { label: "Can't stop my mind", sub: 'Ruminating, worried, stuck', next: 'acute_or_anxiety' },
      { label: "Can't get motivated", sub: 'Exhausted, numb, want to just lie down', next: 'chronic' },
      { label: 'Emotion hit suddenly', sub: 'Triggered by something, intense', next: 'emotion_acute' },
    ],
  },
  acute_or_anxiety: {
    type: 'question',
    q: 'How long has this been going on?',
    options: [
      { label: "Something happened today", sub: 'Clear trigger', next: 'acute_stress' },
      { label: 'Several days / No clear reason', sub: 'Ongoing worry or vigilance', next: 'anxiety' },
    ],
  },
  acute_stress: {
    type: 'result',
    state: '⚡ Acute Stress',
    stateColor: 'warning',
    title: 'Calm the body first, then deal with the rest',
    desc: 'Your amygdala detected a threat, activating your sympathetic nervous system. Energy, alertness, and focus spike. After the event passes, feelings usually ease — focus on regulating your physical response first.',
    highlight: ['Physiological Sigh'],
    methods: [
      { name: 'Physiological Sigh', mec: 'Two short inhales → hold 1 second → long slow exhale through mouth. CO₂ rise triggers anxiety; sighs reopen collapsed alveoli, activating parasympathetic response' },
      { name: 'Go for a walk', mec: 'Left-right eye scanning activates prefrontal-parietal network, pushing emotional brain back temporarily' },
      { name: 'Name the emotion', mec: 'Say "I feel ___" out loud. Activates prefrontal cortex, regains sense of control' },
    ],
    tip: 'Write "Physiological Sigh" on a sticky note where you\'ll see it — because you\'ll forget to use it when under high pressure',
  },
  anxiety: {
    type: 'question',
    q: 'Are these worries looping in your head?',
    sub: 'Like going over the same thing repeatedly',
    options: [
      { label: 'Yes, can\'t stop', next: 'anxiety_loop' },
      { label: 'No, just generally tense', next: 'anxiety_baseline' },
    ],
  },
  anxiety_loop: {
    type: 'result',
    state: '🔄 Anxiety Loop',
    stateColor: 'danger',
    title: 'You\'re caught in a habit loop — break the cue-reaction chain',
    desc: 'Cue → rumination → temporary relief → dopamine reward → easier to trigger next time. Over time, different brain regions start frequently exchanging negative signals, shaping beliefs and affecting decisions. Your body feels unsafe unless it\'s tense.',
    highlight: ['Identify the cue', 'Go for a walk'],
    methods: [
      { name: 'Identify the cue', mec: 'The first step is finding what triggers the loop — what situation, time, or feeling starts the rumination?' },
      { name: 'Go for a walk', mec: 'Activates prefrontal-parietal network, amygdala activity ↓, physically removes you from the loop' },
      { name: 'Meditation', mec: 'Shrinks amygdala size, increases awareness of thoughts/emotions, reduces automatic reactions' },
      { name: 'Visualization', mec: 'Pre-rehearse "When X happens, here\'s how I can feel and respond" — otherwise you fall back to automatic mode in real situations' },
      { name: 'Cognitive intervention', mec: 'Change how you interpret events (CBT approach), rather than suppressing thoughts' },
    ],
    tip: 'Be wary of scrolling social media right after anxiety eases — it releases dopamine, reinforcing this loop',
  },
  anxiety_baseline: {
    type: 'result',
    state: '⚠️ Elevated Baseline Anxiety',
    stateColor: 'warning',
    title: 'Amygdala overactive long-term — need systematic baseline reduction',
    desc: 'No clear event, yet always tense and hypervigilant — this is amygdala chronic activation pushing your baseline up. Acute tools have limited effect here; need to fundamentally shrink the amygdala.',
    highlight: ['Meditation', 'Regular exercise'],
    methods: [
      { name: 'Meditation', mec: 'Long-term practice can shrink amygdala structure, increase neuroplasticity, boost self-awareness' },
      { name: 'Regular exercise', mec: 'Releases BDNF (neurocell nutrient), reduces inflammation, releases endorphins — strong anti-anxiety evidence' },
      { name: 'Sleep', mec: 'Deep sleep repairs body and mind. Sleep deprivation directly amplifies amygdala reactions' },
    ],
    tip: 'Start with walking — no "exercise" psychological burden, but real effects',
  },
  chronic: {
    type: 'question',
    q: 'How long has this lasted?',
    options: [
      { label: 'A few days', sub: 'Something specific weighing on me', next: 'chronic_recent' },
      { label: 'A long time', sub: 'Feels like normal', next: 'chronic_deep' },
    ],
  },
  chronic_recent: {
    type: 'result',
    state: '🔋 Low Battery (Short-term)',
    stateColor: 'warning',
    title: 'At the tipping point where acute becomes chronic — small changes work better than big ones',
    desc: 'Acute stress hasn\'t resolved, body enters "survival mode." Brain prioritizes survival over change. Low motivation is a physiological state, not a willpower issue.',
    highlight: ['Go for a walk', 'Immersive activity'],
    methods: [
      { name: 'Go for a walk', mec: 'Lowest-cost BDNF boost. No "exercise" — just get outside' },
      { name: 'Immersive activity', mec: 'Find something you can fully lose yourself in — sense of meaning, learning, or creation lets stress "unload"' },
      { name: 'Physiological Sigh', mec: 'Temporarily resets breathing frequency, returns body from stress response' },
      { name: 'Clean sweep', mec: 'Set boundaries, remove energy-draining things (including unfollowing accounts that make you feel inferior)' },
    ],
    tip: 'One small change triggers a chain reaction — no need to change everything at once',
  },
  chronic_deep: {
    type: 'question',
    q: 'Is there a constant drain on you?',
    sub: 'Like relationships, environment, work, inner critic',
    options: [
      { label: 'Yes, I know what it is', next: 'chronic_source_known' },
      { label: 'Can\'t pin it down, just feel this way', next: 'chronic_source_unknown' },
    ],
  },
  chronic_source_known: {
    type: 'result',
    state: '🔋 Chronic Stress (Known Source)',
    stateColor: 'danger',
    title: 'Address the drain first, while building recovery capacity',
    desc: 'Prolonged demands beyond capacity → prefrontal cortex structural changes (decision/self-control ↓) → reduced amygdala regulation → hippocampal changes (memory and stress response). This is physiological change — needs systematic intervention.',
    highlight: ['Clean sweep', 'Regular exercise', 'Sleep'],
    methods: [
      { name: 'Clean sweep', mec: 'Set boundaries, remove energy drains. Unfollow triggering accounts, reduce unhelpful stimulation' },
      { name: 'Regular exercise', mec: 'BDNF ↑, inflammation ↓, endorphin release, strong antidepressant effect with neuroscience evidence' },
      { name: 'Sleep', mec: 'Deep sleep is the primary repair window for body and mind' },
      { name: 'Hobbies', mec: 'Meaningful/learning/creative activities → immersion feels good → BDNF. Not the kind from short video stimulation' },
      { name: 'Meditation', mec: 'Long-term amygdala shrinkage, increased neuroplasticity' },
    ],
    tip: 'No need to rush changing everything — one real small change beats ten plans',
  },
  chronic_source_unknown: {
    type: 'result',
    state: '🔋 Chronic Low Energy',
    stateColor: 'danger',
    title: 'Start from the body, not from "figuring it out"',
    desc: 'When chronic stress impairs prefrontal function, your analytical ability is also compromised — at this point "figuring out why" is often circular. Restore the body first, let prefrontal function return, then reflect.',
    highlight: ['Walk', 'Sleep'],
    methods: [
      { name: 'Walk', mec: 'No willpower needed, can do anytime, BDNF and parasympathetic effects. Lowest-barrier systematic change' },
      { name: 'Sleep', mec: 'Deep sleep repairs body and mind. If sleep itself is broken, it\'s the highest priority' },
      { name: 'Meditation', mec: 'Even 3-5 minutes starts building awareness. No need to "do it right"' },
      { name: 'Hobbies', mec: 'Find something immersive, not "useful," but something that makes you lose track of time' },
    ],
    tip: 'Sometimes not being able to name the source itself is a symptom of chronic stress — no need to find the answer yet',
  },
  emotion_acute: {
    type: 'question',
    q: 'How intense is this emotion?',
    options: [
      { label: 'Very strong, almost out of control', next: 'emotion_strong' },
      { label: 'Moderate, but lingering', next: 'emotion_medium' },
    ],
  },
  emotion_strong: {
    type: 'result',
    state: '🌊 Strong Emotion Hit',
    stateColor: 'danger',
    title: 'Prefrontal cortex temporarily offline — start with body actions',
    desc: 'Under strong emotion, the prefrontal cortex responsible for rational thinking becomes less effective. It\'s not "weak willpower" — it\'s physiology. Reset with body movements first, then any analysis.',
    highlight: ['Physiological Sigh', 'Get outside'],
    methods: [
      { name: 'Physiological Sigh', mec: 'Fastest tool to restore some prefrontal function. Two short inhales → hold 1 second → long slow exhale through mouth' },
      { name: 'Get outside', mec: 'Widen your field of vision, leave the triggering environment, give logical brain space' },
      { name: 'Name the emotion', mec: 'Accurately name the feeling ("I feel angry/hurt/afraid"), activate prefrontal cortex, regain control' },
    ],
    tip: 'Emotions themselves are not the problem — what traps us is when we start having prejudices about ourselves under prolonged emotion and stress',
  },
  emotion_medium: {
    type: 'result',
    state: '💭 Lingering Emotion',
    stateColor: 'info',
    title: 'Identify it, give it a name',
    desc: 'Identifying and accurately naming emotions lets you clearly understand your true feelings — this act itself activates prefrontal activity, giving you back control over the situation.',
    highlight: ['Name the emotion', 'Cognitive intervention'],
    methods: [
      { name: 'Name the emotion', mec: 'Not "I\'m annoyed" but "I feel hurt/disappointed/jealous/afraid." The more precise, the more prefrontal involvement' },
      { name: 'Cognitive intervention', mec: 'Ask: How am I interpreting this event? Are there other possible interpretations? (CBT core method)' },
      { name: 'Go for a walk', mec: 'Change environment, create physical space for emotional processing' },
    ],
    tip: 'Recognition is the first step of change. You don\'t need to "solve" this emotion — just knowing what it is is enough',
  },
};

export function getBrainResetMapStates(locale: string): States {
  if (locale === 'en') return EN_STATES;
  return ZH_STATES;
}