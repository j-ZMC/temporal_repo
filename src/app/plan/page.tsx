import { ProfileNote } from "@/components/plan/profile-note";
import { SectionPlaceholder } from "@/components/section-placeholder";

export default function PlanPage() {
  return (
    <SectionPlaceholder
      title="My plan"
      what="Your steps for today, matched to your energy. The “Break it down for me” button turns any big task into small steps."
      owner="Luis"
    >
      <ProfileNote />
    </SectionPlaceholder>
  );
}
