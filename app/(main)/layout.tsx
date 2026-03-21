import { Shell } from "../../components/layout/Shell";
import { BottomNav } from "../../components/layout/BottomNav";

export default function MainLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Shell><div className="pb-24">{children}</div></Shell>
      <BottomNav />
    </>
  );
}
