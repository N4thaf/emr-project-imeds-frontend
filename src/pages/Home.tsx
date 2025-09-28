import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TopNav } from "@/components/navigation/top-nav";
import { Settings, Search, Users, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const dashboardCards = [
    {
      title: "Admin Settings",
      description: "Manage system configuration, user accounts, and administrative settings",
      icon: Settings,
      action: () => navigate("/settings"),
      variant: "medical" as const,
    },
    {
      title: "Search Patient by NIK",
      description: "Find and view patient medical records using National ID Number",
      icon: Search,
      action: () => navigate("/medical-record"),
      variant: "medical-outline" as const,
    },
  ];

  const statsCards = [
    {
      title: "Total Patients",
      value: "2,847",
      icon: Users,
      color: "text-medical-red",
    },
    {
      title: "Records Today",
      value: "156",
      icon: FileText,
      color: "text-medical-red",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome to EMR Dashboard
          </h1>
          <p className="text-muted-foreground">
            Electronic Medical Records Management System for Indonesian Health Facilities
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <Card key={index} className="shadow-sm border-l-4 border-l-medical-red">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {stat.value}
                    </p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Action Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {dashboardCards.map((card, index) => (
            <Card key={index} className="shadow-md hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-medical-red-light rounded-lg">
                    <card.icon className="h-6 w-6 text-medical-red" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-foreground">
                      {card.title}
                    </CardTitle>
                  </div>
                </div>
                <CardDescription className="text-muted-foreground pt-2">
                  {card.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant={card.variant}
                  onClick={card.action}
                  className="w-full"
                  size="lg"
                >
                  {card.title === "Admin Settings" ? "Open Settings" : "Search Patient"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Access Section */}
        <div className="mt-12">
          <Card className="bg-medical-red-light border-medical-red/20">
            <CardHeader>
              <CardTitle className="text-foreground">Quick Access</CardTitle>
              <CardDescription>
                Frequently used features for health facilitators
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="medical-ghost" className="h-auto py-4 px-6 flex-col space-y-2">
                  <FileText className="h-6 w-6" />
                  <span className="text-sm">New Record</span>
                </Button>
                <Button variant="medical-ghost" className="h-auto py-4 px-6 flex-col space-y-2">
                  <Search className="h-6 w-6" />
                  <span className="text-sm">Quick Search</span>
                </Button>
                <Button variant="medical-ghost" className="h-auto py-4 px-6 flex-col space-y-2">
                  <Users className="h-6 w-6" />
                  <span className="text-sm">Patient List</span>
                </Button>
                <Button variant="medical-ghost" className="h-auto py-4 px-6 flex-col space-y-2">
                  <Settings className="h-6 w-6" />
                  <span className="text-sm">Settings</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Home;