export const concepts: Record<string, { zh: { title: string; desc: string }; en?: { title: string; desc: string }; related?: string[] }> = {
  amygdala: {
    zh: {
      title: "杏仁核",
      desc: "大脑中负责情绪反应的杏仁状结构，尤其是恐惧与威胁信号。会在意识介入之前触发「战或逃」反应。过度活跃时容易长期处于紧张、预测风险、高度警觉的状态。"
    },
    en: {
      title: "Amygdala",
      desc: "An almond-shaped brain structure that processes emotional responses, especially fear. It triggers fight-or-flight before conscious awareness."
    },
    related: ["cortisol", "sympathetic", "parasympathetic"]
  },
  cortisol: {
    zh: {
      title: "皮质醇",
      desc: "压力激素，帮助身体在紧急情况下调动能量。长期过高会损害记忆和免疫系统，导致低电量模式。"
    },
    en: {
      title: "Cortisol",
      desc: "A stress hormone that helps the body mobilize energy in emergencies. Chronically elevated levels damage memory and immune system."
    },
    related: ["amygdala", "sympathetic"]
  },
  bdnf: {
    zh: {
      title: "脑源性神经营养因子（BDNF）",
      desc: "大脑自己生成的养料，用来支持神经细胞的存活和生长。它让大脑更容易建立新的神经回路，是神经可塑性的关键。成年后大脑依然有能力建立新回路，运动、冥想等方式都能帮助提高BDNF。"
    },
    en: {
      title: "BDNF",
      desc: "Brain-derived neurotrophic factor. A protein that supports neuron survival and growth, essentially \"food\" for brain cells. Key to neuroplasticity."
    },
    related: ["prefrontal-cortex", "amygdala", "habit-loop"]
  },
  "prefrontal-cortex": {
    zh: {
      title: "前额叶（逻辑脑）",
      desc: "大脑中负责理性思考、计划、决策的区域。在平静状态下可以平衡情绪脑，做出更合理的判断。当压力大、疲倦或强烈情绪时，逻辑脑空间会被压缩，让我们更容易被情绪带着走。"
    },
    en: {
      title: "Prefrontal Cortex",
      desc: "The brain region responsible for rational thinking, planning, and decision-making. It becomes less effective under stress, fatigue, or strong emotions."
    },
    related: ["emotional-brain", "bdnf"]
  },
  sympathetic: {
    zh: {
      title: "交感神经系统",
      desc: "「战或逃」系统，在感知到威胁时被激活，让身体调动能量、保持警觉。长期激活会消耗大量资源。"
    },
    en: {
      title: "Sympathetic Nervous System",
      desc: "The \"fight or flight\" system, activated when a threat is perceived. Chronically activated sympathetic state depletes resources."
    },
    related: ["parasympathetic", "cortisol", "amygdala"]
  },
  parasympathetic: {
    zh: {
      title: "副交感神经系统",
      desc: "「休息与恢复」系统，帮助身体放松、平复心率、恢复平衡。通过散步、冥想、深呼吸等方式可以激活它。"
    },
    en: {
      title: "Parasympathetic Nervous System",
      desc: "The \"rest and restore\" system. Activated through散步、冥想、deep breathing to calm heart rate and restore balance."
    },
    related: ["sympathetic", "amygdala"]
  },
  "emotional-brain": {
    zh: {
      title: "情绪脑（边缘系统）",
      desc: "大脑中负责情绪、记忆和奖励价值判断的区域，包括杏仁核、海马体等。当情绪脑占主导时，人更容易被短期奖励吸引，难以做出长期理性决策。"
    },
    en: {
      title: "Emotional Brain (Limbic System)",
      desc: "The brain region governing emotion and memory, including the amygdala. When dominant, it makes us more susceptible to short-term rewards and less able to make long-term rational decisions."
    },
    related: ["prefrontal-cortex", "amygdala", "habit-loop"]
  },
  "physiological-sigh": {
    zh: {
      title: "生理性叹息",
      desc: "一种自动化的呼吸模式，用于快速降低压力反应。具体做法：短促吸气 2 次（鼻优先），闭气约 1 秒，然后用嘴缓慢呼气。主动利用这个模式可以帮助我们快速把压力反应调回来。"
    },
    en: {
      title: "Physiological Sigh",
      desc: "An automated breathing technique designed to quickly reduce the stress response. Here is how to do it: Take two short, quick breaths (through the nose), hold your breath for about one second, and then exhale slowly through your mouth."
    },
    related: ["parasympathetic", "prefrontal-cortex", "low-power-mode"]
  },
  "low-power-mode": {
    zh: {
      title: "低电量模式",
      desc: "当急性压力持续或超出承受范围时，身体优先考虑「活下来」而非「改变现状」的状态。容易疲惫、自我责备、过度警觉、难以清晰思考。"
    },
    en: {
      title: "Low Power Mode",
      desc: "When acute stress persists or becomes overwhelming, the body prioritizes survival over adapting to the situation. This can lead to fatigue, self-blame, hypervigilance, and difficulty thinking clearly."
    },
    related: ["cortisol", "amygdala", "sympathetic"]
  },
  rumination: {
    zh: {
      title: "反刍",
      desc: "反复用消极的话自言自语，进入强迫性思考循环。在焦虑回路中，提示出现后自动触发，让人想最糟糕的情况并搜寻答案，试图重新获得控制感来减轻焦虑，却反而增强了回路。"
    },
    en: {
      title: "Rumination",
      desc: "Repetitive negative self-talk. In the anxiety loop, triggers automatic compulsive thinking, reinforcing the circuit rather than relieving it."
    },
    related: ["amygdala", "prefrontal-cortex"]
  },
  "habit-loop": {
    zh: {
      title: "习惯回路",
      desc: "由提示、行为、奖励三部分构成的循环。神经具有改变和适应的能力，重复次数越多，传达的路径就越强（变成高速公路），大脑喜欢节能，倾向在上面自动驾驶。"
    },
    en: {
      title: "Habit Loop",
      desc: "A loop of cue, behavior, and reward. The brain automate routs through repetition—the more a path is used, the stronger it becomes."
    },
    related: ["bdnf", "amygdala"]
  }
};