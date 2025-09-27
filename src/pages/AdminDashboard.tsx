import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Settings, BarChart3 } from "lucide-react";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Painel Administrativo
          </h1>
          <p className="text-lg text-muted-foreground">
            Para acessar o painel completo, conecte o Supabase
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card className="shadow-card hover:shadow-elegant transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Agendamentos
              </CardTitle>
              <CardDescription>
                Visualize e gerencie todos os horários marcados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" disabled>
                Acessar Agendamentos
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-elegant transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Funcionários
              </CardTitle>
              <CardDescription>
                Gerencie sua equipe e serviços oferecidos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" disabled>
                Gerenciar Equipe
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-elegant transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Relatórios
              </CardTitle>
              <CardDescription>
                Analise o desempenho do seu negócio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" disabled>
                Ver Relatórios
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-elegant transition-all duration-300 md:col-span-2 lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" />
                Configurações
              </CardTitle>
              <CardDescription>
                Personalize seu sistema de agendamento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" disabled>
                Configurar Sistema
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <Card className="max-w-lg mx-auto shadow-elegant">
            <CardHeader>
              <CardTitle className="text-primary">Conecte o Supabase</CardTitle>
              <CardDescription>
                Para ativar todas as funcionalidades do painel administrativo, conecte sua conta Supabase
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Clique no botão verde "Supabase" no topo da tela para configurar:
              </p>
              <ul className="text-left text-sm text-muted-foreground space-y-1">
                <li>• Banco de dados para agendamentos</li>
                <li>• Sistema de autenticação</li>
                <li>• Gerenciamento de usuários</li>
                <li>• APIs para funcionalidades avançadas</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;