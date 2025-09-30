import { Button } from "@/components/ui/button";
import { MedicalLogo } from "@/components/ui/medical-logo";
import { Home, Settings, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export const TopNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    navigate("/");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <MedicalLogo size="sm" />
            <span className="text-xl font-semibold text-foreground">EMR System</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant={isActive("/home") ? "medical" : "medical-ghost"}
              size="sm"
              onClick={() => navigate("/home")}
              className="flex items-center space-x-2"
            >
              <Home size={16} />
              <span>Home</span>
            </Button>

            <Button
              variant={isActive("/settings") ? "medical" : "medical-ghost"}
              size="sm"
              onClick={() => navigate("/settings")}
              className="flex items-center space-x-2"
            >
              <Settings size={16} />
              <span>Settings</span>
            </Button>

            <Button
              variant="medical-outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center space-x-2"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
