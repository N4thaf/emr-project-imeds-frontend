import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TopNav } from "@/components/navigation/top-nav";
import { Settings, Search, UserPlus, FileText, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Home = () => {
  const navigate = useNavigate();
  const [nikInput, setNikInput] = useState("");

  const handleNikSearch = () => {
    if (nikInput.trim()) {
      navigate(`/medical-record?nik=${encodeURIComponent(nikInput.trim())}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNikSearch();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome to EMR Dashboard
          </h1>
          <p className="text-muted-foreground">
            Electronic Medical Records Management System for Indonesian Health Facilities
          </p>
        </div>

        <div className="mb-8">
          <Card className="shadow-md border-l-4 border-l-medical-red">
            <CardHeader>
              <CardTitle className="text-xl text-foreground flex items-center gap-2">
                <Search className="h-6 w-6 text-medical-red" />
                Search Patient by NIK
              </CardTitle>
              <CardDescription>
                Enter National ID Number to find and view patient medical records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Input
                  placeholder="Enter NIK (National ID Number)"
                  value={nikInput}
                  onChange={(e) => setNikInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 text-lg py-3"
                />
                <Button 
                  variant="medical" 
                  onClick={handleNikSearch}
                  size="lg"
                  className="px-8"
                >
                  <Search className="h-5 w-5 mr-2" />
                  Search Patient
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-medical-red-light rounded-lg">
                  <PlusCircle className="h-6 w-6 text-medical-red" />
                </div>
                <div>
                  <CardTitle className="text-xl text-foreground">
                    Input Patient Medical Record
                  </CardTitle>
                </div>
              </div>
              <CardDescription className="text-muted-foreground pt-2">
                Add or update patient medical records after searching with NIK
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="medical"
                onClick={() => navigate("/add-record")}
                className="w-full"
                size="lg"
              >
                <PlusCircle className="h-5 w-5 mr-2" />
                Add Record
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-medical-red-light rounded-lg">
                  <Settings className="h-6 w-6 text-medical-red" />
                </div>
                <div>
                  <CardTitle className="text-xl text-foreground">
                    Admin Settings
                  </CardTitle>
                </div>
              </div>
              <CardDescription className="text-muted-foreground pt-2">
                Manage system configuration, user accounts, and administrative settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="medical-outline"
                onClick={() => navigate("/settings")}
                className="w-full"
                size="lg"
              >
                <Settings className="h-5 w-5 mr-2" />
                Open Settings
              </Button>
            </CardContent>
          </Card>
        </div>

      </main>
    </div>
  );
};

export default Home;
