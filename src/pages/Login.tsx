import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MedicalLogo } from "@/components/ui/medical-logo";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      toast({
        title: "Login Successful",
        description: "Welcome to EMR System",
      });
      navigate("/home");
    } else {
      toast({
        title: "Login Failed",
        description: "Please enter both username and password",
        variant: "destructive",
      });
    }
  };

  const handleForgotPassword = () => {
    toast({
      title: "Password Reset",
      description: "Password reset link will be sent to your registered email",
    });
  };

  const handleCreateAccount = () => {
    toast({
      title: "Create Account",
      description: "Please contact your system administrator to create a new account",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-red-light to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <MedicalLogo size="lg" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            EMR System Login
          </CardTitle>
          <p className="text-muted-foreground">
            Electronic Medical Records for Indonesian Health Facilities
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="space-y-3 pt-4">
              <Button 
                type="submit" 
                variant="medical" 
                className="w-full"
                size="lg"
              >
                Login
              </Button>

              <div className="flex flex-col space-y-2">
                <Button
                  type="button"
                  variant="medical-outline"
                  onClick={handleForgotPassword}
                  className="w-full"
                >
                  Forgot Password
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;