export const DRIVER_TRAITS = [
  {
    name: 'Arrogant',
    description:
      'The driver believes they are too perfect, often ignoring advice.',
    effect: () => {
      // Decreases teamwork and listening to strategy suggestions
    },
  },
  {
    name: 'Humble',
    description: 'The driver is modest and open to learning from others.',
    effect: () => {
      // Increases teamwork and improves driver improvement over time
    },
  },
  {
    name: 'Aggressive',
    description:
      'The driver is always pushing the limits, often taking big risks.',
    effect: () => {
      // Increases overtaking but raises the chance of accidents
    },
  },
  {
    name: 'Cautious',
    description: 'The driver avoids risks, focusing on safety over speed.',
    effect: () => {
      // Decreases chance of accidents but reduces overtaking ability
    },
  },
  {
    name: 'Strategic',
    description:
      'The driver excels at making quick and smart decisions during the race.',
    effect: () => {
      // Improves pit stop timing and tire management
    },
  },
  {
    name: 'Reckless',
    description:
      'The driver takes dangerous chances, often making questionable moves.',
    effect: () => {
      // Increases overtaking but greatly raises accident risk
    },
  },
  {
    name: 'Calm',
    description:
      'The driver stays cool under pressure, maintaining focus in stressful situations.',
    effect: () => {
      // Improves performance in tough race conditions
    },
  },
  {
    name: 'Hot-headed',
    description:
      'The driver is quick to anger and loses focus when frustrated.',
    effect: () => {
      // Decreases concentration and consistency during intense moments
    },
  },
  {
    name: 'Confident',
    description:
      'The driver has strong self-belief, boosting their performance.',
    effect: () => {
      // Increases overall driving performance, especially in close races
    },
  },
  {
    name: 'Insecure',
    description:
      'The driver doubts their abilities, which affects performance under pressure.',
    effect: () => {
      // Reduces performance in critical race moments
    },
  },
  {
    name: 'Team Player',
    description:
      'The driver works well with the team, maximizing strategy and cooperation.',
    effect: () => {
      // Improves teamwork and boosts car performance through better feedback
    },
  },
  {
    name: 'Soloist',
    description:
      'The driver prefers to rely on their own judgment, often ignoring the team’s advice.',
    effect: () => {
      // Reduces teamwork effectiveness but boosts personal decision-making
    },
  },
  {
    name: 'Charismatic',
    description:
      'The driver has a strong presence and is well-liked by the media and fans.',
    effect: () => {
      // Improves sponsorship and media relations
    },
  },
  {
    name: 'Introverted',
    description:
      'The driver keeps to themselves, avoiding unnecessary attention.',
    effect: () => {
      // Reduces media impact but increases focus and concentration
    },
  },
  {
    name: 'Focused',
    description:
      'The driver has laser-like focus during the race, ignoring distractions.',
    effect: () => {
      // Improves concentration and reduces errors
    },
  },
  {
    name: 'Distracted',
    description:
      'The driver often loses focus, making mistakes during the race.',
    effect: () => {
      // Increases chance of errors and reduces consistency
    },
  },
  {
    name: 'Fearless',
    description:
      'The driver isn’t afraid of any challenge, pushing the limits constantly.',
    effect: () => {
      // Greatly increases overtaking but also raises accident risk
    },
  },
  {
    name: 'Conservative',
    description:
      'The driver takes a careful approach, preserving the car and minimizing risk.',
    effect: () => {
      // Reduces tire wear and accident risk but lowers overtaking ability
    },
  },
  {
    name: 'Optimistic',
    description:
      'The driver always expects a positive outcome, boosting morale.',
    effect: () => {
      // Improves mental resilience and recovery after setbacks
    },
  },
  {
    name: 'Pessimistic',
    description:
      'The driver expects things to go wrong, affecting their performance.',
    effect: () => {
      // Decreases confidence and performance in tough situations
    },
  },
];
