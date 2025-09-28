import { TopNav } from "@/components/navigation/top-nav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings as SettingsIcon, Users, Database, Shield, Bell } from "lucide-react";

const Settings = () => {
  const settingsSections = [
    {
      title: "User Management",
      description: "Manage user accounts, roles, and permissions",
      icon: Users,
      action: () => console.log("User Management"),
    },
    {
      title: "Database Configuration",
      description: "Configure database connections and backup settings",
      icon: Database,
      action: () => console.log("Database Configuration"),
    },
    {
      title: "Security Settings",
      description: "Manage security policies, encryption, and access controls",
      icon: Shield,
      action: () => console.log("Security Settings"),
    },
    {
      title: "Notifications",
      description: "Configure system notifications and alerts",
      icon: Bell,
      action: () => console.log("Notifications"),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Admin Settings
          </h1>
          <p className="text-muted-foreground">
            Configure system settings and administrative options
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {settingsSections.map((section, index) => (
            <Card key={index} className="shadow-md hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-medical-red-light rounded-lg">
                    <section.icon className="h-6 w-6 text-medical-red" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-foreground">
                      {section.title}
                    </CardTitle>
                  </div>
                </div>
                <CardDescription className="text-muted-foreground pt-2">
                  {section.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="medical-outline"
                  onClick={section.action}
                  className="w-full"
                  size="lg"
                >
                  Configure
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Settings;