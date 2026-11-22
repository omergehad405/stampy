import SplashScreen from "@/app/components/ui/SplashScreen";

export default function AuthLayout({ children }) {
  return (
    <>
      <SplashScreen />
      {children}
    </>
  );
}
