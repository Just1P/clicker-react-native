// types.ts
export type Team = "Rouge" | "Bleu";

export type TeamStats = {
  [key in Team]: number;
};

export interface GameScreenProps {
  team: Team;
  totalClicks: TeamStats;
  clickCount: number;
  setClickCount: (count: number) => void;
  resetTeam: () => void;
}

export interface ProgressBarProps {
  redPercentage: number;
  bluePercentage: number;
}

export interface StatsProps {
  totalClicks: TeamStats;
}
