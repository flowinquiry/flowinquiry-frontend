import { ModeToggle } from "@/components/mode-toggle";
import { ErrorProvider } from "@/providers/error-provider";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-[100vh] flex items-center justify-center relative">
      <ErrorProvider>
        <div className="absolute bottom-5 right-0">
          <ModeToggle />
        </div>
        {children}
      </ErrorProvider>
    </div>
  );
};

export default AuthLayout;
