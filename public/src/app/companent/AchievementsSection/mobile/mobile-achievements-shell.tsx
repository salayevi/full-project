import MobileAchievementCard, {
  type MobileAchievementItem,
} from "./mobile-achievement-card";

type MobileAchievementsShellProps = {
  items: MobileAchievementItem[];
  currentIndex: number;
  nextIndex: number;
  blend: number;
  frameRevealProgress: number;
  ribbonRevealProgress: number;
};

export default function MobileAchievementsShell({
  items,
  currentIndex,
  nextIndex,
  blend,
  frameRevealProgress,
  ribbonRevealProgress,
}: MobileAchievementsShellProps) {
  return (
    <div className="relative mx-auto h-[100svh] w-full max-w-[390px]">
      <MobileAchievementCard
        items={items}
        currentIndex={currentIndex}
        nextIndex={nextIndex}
        blend={blend}
        frameRevealProgress={frameRevealProgress}
        ribbonRevealProgress={ribbonRevealProgress}
      />
    </div>
  );
}