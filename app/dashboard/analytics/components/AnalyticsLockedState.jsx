import PlanLockedFeature from "../../components/PlanLockedFeature";

export default function AnalyticsLockedState() {
  return (
    <PlanLockedFeature
      featureKey="analytics"
      featureName="Analytics"
      description="Analytics is not included in your current plan. Contact your platform administrator to upgrade and enable this feature."
      locale="en"
    />
  );
}
