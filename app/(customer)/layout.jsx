import SplashScreen from "@/app/components/ui/SplashScreen";

export default function CustomerLayout({ children }) {
  return (
    <>
      <SplashScreen />
      {children}
    </>
  );
}
