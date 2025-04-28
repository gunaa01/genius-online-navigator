
import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-6 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Genius</h1>
          <p className="text-muted-foreground mt-2">
            Optimize your online presence effortlessly
          </p>
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
