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
type States = Record<string, StateNode>;

const ZH_STATES: States = {
  start: {
    type: 'question',
    q: '你最想改善哪个方面？',
    sub: '从最想解决的问题开始',
    options: [
      { label: '情绪不稳定，容易大起大落', sub: '想更了解自己的情绪模式', next: 'emotion_type' },
      { label: '总是感觉累，精力不够用', sub: '想改善精力管理', next: 'energy_type' },
      { label: '想建立好习惯但总失败', sub: '习惯养成困难', next: 'habit_type' },
      { label: '睡不好，白天没精神', sub: '想改善睡眠质量', next: 'sleep_type' },
    ],
  },

  emotion_type: {
    type: 'question',
    q: '情绪问题通常什么时候出现？',
    options: [
      { label: '特定事件触发的', sub: '比如被人惹怒、遇到挫折', next: 'emotion_reactive' },
      { label: '没有明显原因就低落', sub: '莫名提不起劲', next: 'emotion_baseline' },
      { label: '一天内反复波动', sub: '早上还行，晚上突然崩', next: 'emotion_daily' },
    ],
  },
  emotion_reactive: {
    type: 'result',
    category: '💡 情绪反应追踪',
    categoryColor: 'warning',
    title: '先记录触发器，再看模式',
    desc: '每次情绪波动时记录：发生了什么？身体什么感觉？持续了多久？一周后回顾，找出高频触发因素。',
    items: [
      { name: '情绪分数', reason: '0-10分，量化情绪强度，看趋势', frequency: '每次情绪明显波动时' },
      { name: '触发事件', reason: '简述是什么引发了这次情绪', frequency: '每次情绪明显波动时' },
      { name: '身体反应', reason: '如胸闷、胃疼、心跳快', frequency: '每次情绪明显波动时' },
    ],
    tip: '连续记录2周后，你会发现自己有固定的「情绪触发器模式」',
  },
  emotion_baseline: {
    type: 'result',
    category: '💡 情绪基线追踪',
    categoryColor: 'info',
    title: '每天定时记录，看长期趋势',
    desc: '固定时间打分（早中晚），不看单次，看一周/一月的平均值和趋势。',
    items: [
      { name: '情绪早间分数', reason: '起床后30分钟内打分，代表当天的情绪基线', frequency: '每天早上' },
      { name: '睡眠质量', reason: '睡眠直接影响第二天的情绪基线', frequency: '每天早上' },
      { name: '睡前想法', reason: '记录入睡前的3个念头，看什么在消耗你', frequency: '每天睡前' },
    ],
    tip: '如果连续一个月基线都偏低，考虑寻求专业支持',
  },
  emotion_daily: {
    type: 'result',
    category: '💡 日内情绪波动追踪',
    categoryColor: 'success',
    title: '用时间戳捕捉节律',
    desc: '情绪在一天内反复？记录每次情绪变化的时间点，2周后分析高低峰时段规律。',
    items: [
      { name: '情绪时间戳', reason: '记录情绪变好/变差的时间点', frequency: '每次明显变化时' },
      { name: '当时活动', reason: '如「开会后」「午饭后」「运动完」', frequency: '每次情绪明显变化时' },
      { name: '能量水平', reason: '配合情绪一起看，通常正相关', frequency: '每天3次（早中晚）' },
    ],
    tip: '很多人会发现自己在下午3-4点有个能量/情绪低谷',
  },

  energy_type: {
    type: 'question',
    q: '你通常什么时候最累？',
    options: [
      { label: '下午特别困，工作效率低', sub: '午后低谷期', next: 'energy_afternoon' },
      { label: '早上起不来，一上午都没精神', sub: '上午也困', next: 'energy_morning' },
      { label: '做某类事情就特别累', sub: '特定活动耗能', next: 'energy_activity' },
      { label: '一直都觉得累，没有特别时段', sub: '持续性疲惫', next: 'energy_constant' },
    ],
  },
  energy_afternoon: {
    type: 'result',
    category: '⚡ 精力节律追踪',
    categoryColor: 'warning',
    title: '测出你的午后低谷期，对症调整',
    desc: '大多数人有午后精力低谷。先确认你的具体时段，再针对性干预（午睡/散步/换任务）。',
    items: [
      { name: '能量曲线', reason: '每小时记录一次精力高低，连续3天', frequency: '每小时一次' },
      { name: '午睡效果', reason: '记录午睡时长和下午的工作效率变化', frequency: '每次午睡后' },
      { name: '午餐内容', reason: '高碳水容易加重午后困倦', frequency: '每天记录' },
    ],
    tip: '15-20分钟的小睡比1小时的长睡更能恢复下午精力',
  },
  energy_morning: {
    type: 'result',
    category: '⚡ 晨间精力追踪',
    categoryColor: 'info',
    title: '从睡眠质量和晨间习惯入手',
    desc: '早上起不来往往不是意志力问题。测一下睡眠质量和起床后的状态。',
    items: [
      { name: '睡眠质量', reason: '夜醒次数、入睡时长、做梦情况', frequency: '每天早上' },
      { name: '起床后清醒时间', reason: '从起床到真正清醒需要多久', frequency: '每天早上' },
      { name: '晨间例程', reason: '起床后第一个小时做什么', frequency: '每天记录' },
    ],
    tip: '起床后立即接触自然光（拉开窗帘）能帮助快速清醒',
  },
  energy_activity: {
    type: 'result',
    category: '⚡ 活动能量追踪',
    categoryColor: 'success',
    title: '识别高耗能活动，合理分配',
    desc: '有些活动特别耗能，有些反而充电。记录每次活动后的精力变化，找到自己的规律。',
    items: [
      { name: '活动后精力变化', reason: '+2/-2表示精力提升或下降', frequency: '每次重要活动后' },
      { name: '社交耗能感', reason: '内向的人社交是高耗能活动', frequency: '每次社交后' },
      { name: '恢复活动', reason: '哪些活动能让你快速回血', frequency: '每次尝试恢复活动后' },
    ],
    tip: '内向者需要提前规划社交后的独处恢复时间',
  },
  energy_constant: {
    type: 'result',
    category: '⚡ 基础能量追踪',
    categoryColor: 'danger',
    title: '排查生理原因，追踪基础能量',
    desc: '持续性疲惫需要先排查：贫血、甲状腺、睡眠呼吸暂停等。先看医生，再追踪。',
    items: [
      { name: '基础能量分数', reason: '每天3次（早中晚）打分，记录趋势', frequency: '每天3次' },
      { name: '运动反应', reason: '轻松散步vs高强度训练后哪种恢复更快', frequency: '每次运动后' },
      { name: '饮食与能量', reason: '记录每餐吃了什么，餐后是否犯困', frequency: '每餐后30分钟' },
    ],
    tip: '持续疲惫超过2周建议先做体检',
  },

  habit_type: {
    type: 'question',
    q: '习惯养成卡在哪里？',
    options: [
      { label: '开始很难，总是拖延', sub: '启动困难', next: 'habit_start' },
      { label: '坚持几天就断了', sub: '难以持续', next: 'habit_consistency' },
      { label: '做着做着没动力了', sub: '中途放弃', next: 'habit_motivation' },
      { label: '不知道该建立什么习惯', sub: '目标不清晰', next: 'habit_goal' },
    ],
  },
  habit_start: {
    type: 'result',
    category: '🎯 习惯启动追踪',
    categoryColor: 'warning',
    title: '记录「阻力」和「最小行动」',
    desc: '启动困难的本质是对抗阻力。每次想拖延时记录「是什么在阻挡我」和「最微小的一步是什么」。',
    items: [
      { name: '阻力来源', reason: '具体在怕什么、觉得难在哪里', frequency: '每次想拖延时' },
      { name: '最小行动', reason: '只做5分钟，记录开始了没', frequency: '每次习惯时段前' },
      { name: '启动时间', reason: '从决定到真正开始花了多久', frequency: '每次' },
    ],
    tip: '把「每天运动1小时」改成「穿上运动鞋」，启动成本降到最低',
  },
  habit_consistency: {
    type: 'result',
    category: '🎯 连续记录追踪',
    categoryColor: 'success',
    title: '保护连续天数，建立身份认同',
    desc: '连续天数是关键指标。不要追求完美，允许补卡，但要追踪断了多少次、为什么断。',
    items: [
      { name: '完成记录', reason: '是/否，记录当天是否完成', frequency: '每天' },
      { name: '中断原因', reason: '记录断了的原因，避免重复', frequency: '每次未完成时' },
      { name: '当前连续', reason: '连续完成的天数', frequency: '每天' },
    ],
    tip: '连续3天断了就从0开始，连胜7天才算站稳',
  },
  habit_motivation: {
    type: 'result',
    category: '🎯 动力来源追踪',
    categoryColor: 'info',
    title: '找到真正激励你的东西',
    desc: '外在奖励会消失，内在驱动才持久。追踪是什么让你觉得「值」。',
    items: [
      { name: '完成后的感受', reason: '记录做完后的即时感受', frequency: '每次完成后' },
      { name: '长期变化', reason: '每周回顾：这个习惯带来什么不同了', frequency: '每周' },
      { name: '激励事件', reason: '有没有什么让动力突然提升', frequency: '发生时记录' },
    ],
    tip: '把习惯和「让你自豪的身份」绑定（不是「要运动」而是「我是个活跃的人」）',
  },
  habit_goal: {
    type: 'result',
    category: '🎯 习惯探索追踪',
    categoryColor: 'warning',
    title: '用实验心态尝试，找到「对的味道」',
    desc: '不知道该建立什么习惯？先从「每天5分钟实验」开始，2周后问自己：感觉怎么样？',
    items: [
      { name: '实验记录', reason: '这周尝试了什么新习惯，感受如何', frequency: '每周' },
      { name: '主观匹配度', reason: '0-10分，这个习惯有多「对」', frequency: '每周结束时' },
      { name: '放弃原因', reason: '为什么不继续，记录下来', frequency: '放弃时' },
    ],
    tip: '与其模仿别人的习惯，不如问：这个对我的生活来说是「必须」的吗？',
  },

  sleep_type: {
    type: 'question',
    q: '睡眠问题具体是什么？',
    options: [
      { label: '睡不着，躺很久才能睡', sub: '入睡困难', next: 'sleep_onset' },
      { label: '半夜会醒，醒后难入睡', sub: '睡眠维持困难', next: 'sleep_maintain' },
      { label: '睡够了但还是很累', sub: '睡眠质量差', next: 'sleep_quality' },
      { label: '早上起不来，白天昏昏沉沉', sub: '起床困难', next: 'sleep_wake' },
    ],
  },
  sleep_onset: {
    type: 'result',
    category: '😴 入睡追踪',
    categoryColor: 'warning',
    title: '测入睡时长，找刺激源',
    desc: '记录从关灯到睡着的时间，以及睡前做了什么。常见的干扰因素：屏幕蓝光、咖啡因、想太多。',
    items: [
      { name: '关灯时间', reason: '躺在床上开始准备睡觉的时间', frequency: '每天' },
      { name: '入睡时长', reason: '关灯到睡着大约多久', frequency: '每天' },
      { name: '睡前活动', reason: '看手机/吃东西/想事情', frequency: '每天' },
    ],
    tip: '如果超过30分钟还睡不着，起来做点无聊的事，等困了再躺',
  },
  sleep_maintain: {
    type: 'result',
    category: '😴 睡眠中途追踪',
    categoryColor: 'info',
    title: '记录夜醒模式和可能诱因',
    desc: '半夜醒来看时间，记录几点、为什么醒、醒了多久。常见原因：酒精、睡前喝水、压力。',
    items: [
      { name: '夜醒次数', reason: '一晚醒来几次', frequency: '每天早上' },
      { name: '夜醒时间点', reason: '固定时间点醒来可能有规律', frequency: '每天早上' },
      { name: '夜醒原因', reason: '想上厕所/热/做梦/不明', frequency: '每次醒来时' },
    ],
    tip: '酒精会让你快速入睡但会导致后半夜频繁夜醒',
  },
  sleep_quality: {
    type: 'result',
    category: '😴 睡眠质量追踪',
    categoryColor: 'success',
    title: '用「回神时间」评估真实睡眠质量',
    desc: '睡够小时不等于睡好。评估真实质量更有效的指标：起床后多久才感觉清醒。',
    items: [
      { name: '主观睡眠质量', reason: '0-10分，起床后感觉恢复得怎样', frequency: '每天早上' },
      { name: '回神时间', reason: '起床到真正清醒需要多久', frequency: '每天早上' },
      { name: '做梦情况', reason: '记录梦境强度，剧烈梦境影响睡眠质量', frequency: '每天早上' },
    ],
    tip: '深度睡眠比例比总时长更重要，适当运动可以增加深度睡眠',
  },
  sleep_wake: {
    type: 'result',
    category: '😴 起床与晨间追踪',
    categoryColor: 'info',
    title: '固定起床时间，重置生物钟',
    desc: '无论几点睡，固定起床时间是最有效的睡眠调节工具。追踪起床时间和白天的状态。',
    items: [
      { name: '实际起床时间', reason: '每天记录，包括周末', frequency: '每天' },
      { name: '起床清醒度', reason: '0-10分，起床后30分钟内', frequency: '每天' },
      { name: '咖啡因摄入', reason: '几点喝的、喝了多少，影响入睡', frequency: '每天' },
    ],
    tip: '周末起床时间不要比平时晚超过1小时，生物钟会乱',
  },
};

const EN_STATES: States = {
  start: {
    type: 'question',
    q: 'What do you most want to improve?',
    sub: 'Start from the problem you care about most',
    options: [
      { label: 'Emotions swing wildly up and down', sub: 'Want to understand my emotional patterns', next: 'emotion_type' },
      { label: 'Always tired, low energy', sub: 'Want to manage energy better', next: 'energy_type' },
      { label: 'Want to build habits but keep failing', sub: 'Habit formation difficulties', next: 'habit_type' },
      { label: 'Sleep poorly, feel groggy during the day', sub: 'Want to improve sleep quality', next: 'sleep_type' },
    ],
  },
  emotion_type: {
    type: 'question',
    q: 'When do emotional issues usually appear?',
    options: [
      { label: 'Triggered by specific events', sub: 'Like getting angry, hitting a setback', next: 'emotion_reactive' },
      { label: 'Feeling down for no clear reason', sub: 'Just can\'t get motivated', next: 'emotion_baseline' },
      { label: 'Fluctuates throughout the day', sub: 'Fine in the morning, crashes at night', next: 'emotion_daily' },
    ],
  },
  emotion_reactive: {
    type: 'result',
    category: '💡 Emotional Trigger Tracking',
    categoryColor: 'warning',
    title: 'Record triggers first, then look for patterns',
    desc: 'During each emotional surge, record: What happened? How did your body feel? How long did it last? Review after 2 weeks.',
    items: [
      { name: 'Emotion score', reason: '0-10 scale, quantify intensity and see trends', frequency: 'Each time emotion changes noticeably' },
      { name: 'Trigger event', reason: 'Brief description of what set off the emotion', frequency: 'Each time emotion changes noticeably' },
      { name: 'Physical reaction', reason: 'Like chest tightness, stomach pain, racing heart', frequency: 'Each time emotion changes noticeably' },
    ],
    tip: 'After 2 weeks of consistent tracking, you\'ll discover your fixed emotional trigger patterns',
  },
  emotion_baseline: {
    type: 'result',
    category: '💡 Baseline Mood Tracking',
    categoryColor: 'info',
    title: 'Track at fixed times daily, watch long-term trends',
    desc: 'Score at fixed times (morning/afternoon/evening). Don\'t focus on single scores, look at weekly and monthly averages and trends.',
    items: [
      { name: 'Morning mood score', reason: 'Within 30 minutes of waking — represents your emotional baseline for the day', frequency: 'Every morning' },
      { name: 'Sleep quality', reason: 'Sleep directly affects next day\'s emotional baseline', frequency: 'Every morning' },
      { name: 'Pre-sleep thoughts', reason: 'Record 3 thoughts before bed — see what\'s draining you', frequency: 'Every night' },
    ],
    tip: 'If baseline stays low for a consecutive month, consider seeking professional support',
  },
  emotion_daily: {
    type: 'result',
    category: '💡 Intraday Mood Fluctuation Tracking',
    categoryColor: 'success',
    title: 'Use timestamps to capture rhythms',
    desc: 'Emotions fluctuate throughout the day? Record each mood change timestamp. After 2 weeks, analyze your high and low peak times.',
    items: [
      { name: 'Mood timestamp', reason: 'Record when mood gets better or worse', frequency: 'Each significant change' },
      { name: 'Activity at the time', reason: 'Like "after meeting" "after lunch" "after exercise"', frequency: 'Each mood change' },
      { name: 'Energy level', reason: 'Usually positively correlated with mood', frequency: '3 times daily (morning/afternoon/evening)' },
    ],
    tip: 'Many people discover they have an energy/mood dip around 3-4pm',
  },
  energy_type: {
    type: 'question',
    q: 'When do you usually feel most tired?',
    options: [
      { label: 'Especially sleepy in the afternoon', sub: 'Post-lunch dip', next: 'energy_afternoon' },
      { label: 'Can\'t wake up in the morning', sub: 'Also tired all morning', next: 'energy_morning' },
      { label: 'Exhausted after certain activities', sub: 'Activity-specific drain', next: 'energy_activity' },
      { label: 'Always tired, no specific time', sub: 'Persistent fatigue', next: 'energy_constant' },
    ],
  },
  energy_afternoon: {
    type: 'result',
    category: '⚡ Energy Rhythm Tracking',
    categoryColor: 'warning',
    title: 'Identify your afternoon low period, adjust accordingly',
    desc: 'Most people have an afternoon energy dip. Confirm your specific time window, then target interventions (nap/walk/task switch).',
    items: [
      { name: 'Energy curve', reason: 'Record energy level every hour for 3 consecutive days', frequency: 'Every hour' },
      { name: 'Nap effectiveness', reason: 'Record nap duration and afternoon productivity changes', frequency: 'After each nap' },
      { name: 'Lunch contents', reason: 'High carbs can worsen afternoon drowsiness', frequency: 'Daily' },
    ],
    tip: 'A 15-20 minute power nap recovers afternoon energy better than a 1-hour long nap',
  },
  energy_morning: {
    type: 'result',
    category: '⚡ Morning Energy Tracking',
    categoryColor: 'info',
    title: 'Start with sleep quality and morning routine',
    desc: 'Can\'t wake up in the morning is often not a willpower issue. Measure sleep quality and post-waking state.',
    items: [
      { name: 'Sleep quality', reason: 'Night wakings, time to fall asleep, dream activity', frequency: 'Every morning' },
      { name: 'Time to full alertness', reason: 'How long from waking to truly awake', frequency: 'Every morning' },
      { name: 'Morning routine', reason: 'What you do in the first hour after waking', frequency: 'Daily' },
    ],
    tip: 'Getting natural light immediately after waking (open curtains) helps you wake up faster',
  },
  energy_activity: {
    type: 'result',
    category: '⚡ Activity Energy Tracking',
    categoryColor: 'success',
    title: 'Identify high-drain activities, distribute wisely',
    desc: 'Some activities drain you, others recharge you. Record energy changes after each activity to find your patterns.',
    items: [
      { name: 'Post-activity energy change', reason: '+2/-2 indicates energy increase or decrease', frequency: 'After each significant activity' },
      { name: 'Social energy drain', reason: 'For introverts, socializing is a high-drain activity', frequency: 'After each social activity' },
      { name: 'Recovery activities', reason: 'Which activities let you recharge quickly', frequency: 'After each recovery attempt' },
    ],
    tip: 'Introverts need to plan post-social alone time in advance',
  },
  energy_constant: {
    type: 'result',
    category: '⚡ Baseline Energy Tracking',
    categoryColor: 'danger',
    title: 'Check physiological causes, track baseline energy',
    desc: 'Persistent fatigue needs investigation first: anemia, thyroid, sleep apnea. See a doctor, then track.',
    items: [
      { name: 'Baseline energy score', reason: '3 times daily (morning/afternoon/evening), watch trends', frequency: '3 times daily' },
      { name: 'Exercise response', reason: 'Which recovers better: light walk vs intense workout', frequency: 'After each workout' },
      { name: 'Diet and energy', reason: 'Record meals and post-meal drowsiness', frequency: '30 min after each meal' },
    ],
    tip: 'Persistent fatigue for over 2 weeks — get a checkup first',
  },
  habit_type: {
    type: 'question',
    q: 'Where do habits break down?',
    options: [
      { label: 'Hard to start, always procrastinating', sub: 'Startup difficulty', next: 'habit_start' },
      { label: 'Break after a few days', sub: 'Hard to sustain', next: 'habit_consistency' },
      { label: 'Lose motivation halfway through', sub: 'Quit midway', next: 'habit_motivation' },
      { label: 'Don\'t know which habits to build', sub: 'Unclear goals', next: 'habit_goal' },
    ],
  },
  habit_start: {
    type: 'result',
    category: '🎯 Habit Start Tracking',
    categoryColor: 'warning',
    title: 'Track "resistance" and "minimum action"',
    desc: 'The root of startup difficulty is resistance. Each time you procrastinate, record "what\'s blocking me" and "what\'s the smallest first step".',
    items: [
      { name: 'Resistance source', reason: 'What exactly are you afraid of or where\'s the difficulty', frequency: 'Each time you procrastinate' },
      { name: 'Minimum action', reason: 'Just do 5 minutes, record if you started', frequency: 'Before each habit time' },
      { name: 'Startup time', reason: 'How long from decision to actually starting', frequency: 'Each time' },
    ],
    tip: 'Change "exercise 1 hour daily" to "put on sports shoes" — startup cost降到最低',
  },
  habit_consistency: {
    type: 'result',
    category: '🎯 Streak Tracking',
    categoryColor: 'success',
    title: 'Protect your streak, build identity',
    desc: 'Streak days are the key metric. Allow catch-ups, but track how many times you broke and why.',
    items: [
      { name: 'Completion record', reason: 'Yes/No, did you complete today', frequency: 'Daily' },
      { name: 'Break reason', reason: 'Record why it broke to avoid repetition', frequency: 'Each time not completed' },
      { name: 'Current streak', reason: 'Consecutive days completed', frequency: 'Daily' },
    ],
    tip: '3 breaks in a row and it resets to 0. Streak of 7 days才算站稳',
  },
  habit_motivation: {
    type: 'result',
    category: '🎯 Motivation Source Tracking',
    categoryColor: 'info',
    title: 'Find what truly motivates you',
    desc: 'External rewards fade, intrinsic drive lasts. Track what makes it feel "worth it".',
    items: [
      { name: 'Post-completion feeling', reason: 'Record immediate feeling after finishing', frequency: 'After each completion' },
      { name: 'Long-term change', reason: 'Weekly review: what difference has this habit made', frequency: 'Weekly' },
      { name: 'Motivation event', reason: 'Anything that suddenly boosted motivation', frequency: 'When it happens' },
    ],
    tip: 'Bind habit to an "identity you\'re proud of" (not "need to exercise" but "I\'m an active person")',
  },
  habit_goal: {
    type: 'result',
    category: '🎯 Habit Discovery Tracking',
    categoryColor: 'warning',
    title: 'Use an experimental mindset, find your "right fit"',
    desc: 'Don\'t know which habit to build? Start with "5-minute daily experiments." After 2 weeks ask: how does it feel?',
    items: [
      { name: 'Experiment record', reason: 'What new habit did you try this week, how did it feel', frequency: 'Weekly' },
      { name: 'Subjective fit score', reason: '0-10, how "right" does this habit feel', frequency: 'End of each week' },
      { name: 'Abandon reason', reason: 'Why you stopped — record it', frequency: 'When abandoning' },
    ],
    tip: 'Instead of copying others\' habits, ask: is this "essential" for my life?',
  },
  sleep_type: {
    type: 'question',
    q: 'What\'s your sleep issue?',
    options: [
      { label: 'Can\'t fall asleep, takes forever', sub: 'Sleep onset difficulty', next: 'sleep_onset' },
      { label: 'Wake up at night, hard to sleep again', sub: 'Sleep maintenance difficulty', next: 'sleep_maintain' },
      { label: 'Sleep enough but still feel tired', sub: 'Poor sleep quality', next: 'sleep_quality' },
      { label: 'Can\'t wake up, feel groggy all day', sub: 'Wake difficulty', next: 'sleep_wake' },
    ],
  },
  sleep_onset: {
    type: 'result',
    category: '😴 Sleep Onset Tracking',
    categoryColor: 'warning',
    title: 'Measure time to fall asleep, find stimulants',
    desc: 'Record time from lights out to sleep, and what you did before bed. Common disruptors: blue light, caffeine, overthinking.',
    items: [
      { name: 'Lights out time', reason: 'Time you get into bed and start preparing for sleep', frequency: 'Daily' },
      { name: 'Time to fall asleep', reason: 'Approximately how long from lights out to asleep', frequency: 'Daily' },
      { name: 'Pre-sleep activity', reason: 'Phone usage/eating/overthinking', frequency: 'Daily' },
    ],
    tip: 'If you can\'t fall asleep within 30 minutes, get up and do something boring until you\'re sleepy',
  },
  sleep_maintain: {
    type: 'result',
    category: '😴 Midnight Wake Tracking',
    categoryColor: 'info',
    title: 'Record nighttime wake patterns and possible triggers',
    desc: 'Wake up at night and check the time, record when, why, and how long you were up. Common causes: alcohol, drinking water before bed, stress.',
    items: [
      { name: 'Night wake count', reason: 'Number of times waking up per night', frequency: 'Every morning' },
      { name: 'Wake time points', reason: 'Waking at fixed times may indicate a pattern', frequency: 'Every morning' },
      { name: 'Wake cause', reason: 'Need bathroom/hot/dream/unknown', frequency: 'Each time waking' },
    ],
    tip: 'Alcohol helps you fall asleep faster but causes more nighttime wakeups in the second half of the night',
  },
  sleep_quality: {
    type: 'result',
    category: '😴 Sleep Quality Tracking',
    categoryColor: 'success',
    title: 'Use "time to alertness" to assess real sleep quality',
    desc: 'Getting enough hours doesn\'t equal good sleep. A more effective measure: how long after waking do you feel alert.',
    items: [
      { name: 'Subjective sleep quality', reason: '0-10, how recovered do you feel upon waking', frequency: 'Every morning' },
      { name: 'Time to alertness', reason: 'How long from waking to truly alert', frequency: 'Every morning' },
      { name: 'Dream intensity', reason: 'Record dream intensity — intense dreams affect sleep quality', frequency: 'Every morning' },
    ],
    tip: 'Deep sleep ratio is more important than total hours — moderate exercise increases deep sleep',
  },
  sleep_wake: {
    type: 'result',
    category: '😴 Wake and Morning Tracking',
    categoryColor: 'info',
    title: 'Fix wake time, reset biological clock',
    desc: 'Regardless of when you sleep, fixed wake time is the most effective sleep regulation tool. Track wake time and daytime state.',
    items: [
      { name: 'Actual wake time', reason: 'Record daily, including weekends', frequency: 'Daily' },
      { name: 'Morning alertness', reason: '0-10 score, within 30 minutes of waking', frequency: 'Every morning' },
      { name: 'Caffeine intake', reason: 'When and how much — affects sleep onset', frequency: 'Daily' },
    ],
    tip: 'Weekend wake time should be no more than 1 hour later than weekday — biological clock会乱',
  },
};

export function getTrackingSelectorStates(locale: string): States {
  if (locale === 'en') return EN_STATES;
  return ZH_STATES;
}