import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Settings, BarChart3, UserPlus } from "lucide-react";
import { AppointmentsTab } from "@/components/admin/AppointmentsTab";
import { ServicesTab } from "@/components/admin/ServicesTab";
import { EmployeesTab } from "@/components/admin/EmployeesTab";
import { ReportsTab } from "@/components/admin/ReportsTab";
import { SettingsTab } from "@/components/admin/SettingsTab";
import { BookingFlow } from "@/components/booking/BookingFlow";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("appointments");

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Painel Administrativo
          </h1>
          <p className="text-lg text-muted-foreground">
            Gerencie seu negócio de forma eficiente
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-8">
            <TabsTrigger value="appointments" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Agendamentos
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Agendar
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Relatórios
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Serviços
            </TabsTrigger>
            <TabsTrigger value="employees" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Funcionários
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Configurações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="appointments">
            <AppointmentsTab />
          </TabsContent>

          <TabsContent value="schedule">
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle>Agendar Horário</CardTitle>
                <CardDescription>
                  Use este formulário para agendar um horário manualmente para um cliente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BookingFlow isAdminMode={true} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <ReportsTab />
          </TabsContent>

          <TabsContent value="services">
            <ServicesTab />
          </TabsContent>

          <TabsContent value="employees">
            <EmployeesTab />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;