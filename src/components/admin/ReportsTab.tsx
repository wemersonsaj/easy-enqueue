import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart3, DollarSign, Users, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ReportData {
  appointments: any[];
  totalRevenue: number;
  totalAppointments: number;
  uniqueCustomers: number;
  serviceStats: { name: string; count: number; revenue: number }[];
}

export const ReportsTab = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Set default dates (last 30 days)
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    setStartDate(format(thirtyDaysAgo, 'yyyy-MM-dd'));
    setEndDate(format(today, 'yyyy-MM-dd'));
  }, []);

  const generateReport = async () => {
    if (!startDate || !endDate) {
      toast({
        title: "Datas obrigatórias",
        description: "Selecione as datas de início e fim.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data: appointments, error } = await supabase
        .from('appointments')
        .select(`
          *,
          service:services(name, price),
          employee:employees(name)
        `)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: true });

      if (error) throw error;

      // Calculate statistics
      const totalRevenue = appointments?.reduce((sum, apt) => sum + (apt.service?.price || 0), 0) || 0;
      const totalAppointments = appointments?.length || 0;
      const uniqueCustomers = new Set(appointments?.map(apt => apt.customer_name)).size;

      // Service statistics
      const serviceStats: { [key: string]: { count: number; revenue: number } } = {};
      appointments?.forEach(apt => {
        const serviceName = apt.service?.name || 'Serviço não encontrado';
        if (!serviceStats[serviceName]) {
          serviceStats[serviceName] = { count: 0, revenue: 0 };
        }
        serviceStats[serviceName].count++;
        serviceStats[serviceName].revenue += apt.service?.price || 0;
      });

      const serviceStatsArray = Object.entries(serviceStats).map(([name, stats]) => ({
        name,
        count: stats.count,
        revenue: stats.revenue,
      }));

      setReportData({
        appointments: appointments || [],
        totalRevenue,
        totalAppointments,
        uniqueCustomers,
        serviceStats: serviceStatsArray,
      });

      toast({
        title: "Relatório gerado",
        description: "O relatório foi gerado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao gerar relatório",
        description: "Não foi possível gerar o relatório.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-elegant">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          Relatórios
        </CardTitle>
        <CardDescription>
          Analise o desempenho do seu negócio em um período específico
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <Label htmlFor="start-date">Data de Início</Label>
            <Input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="end-date">Data de Fim</Label>
            <Input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div className="flex items-end">
            <Button 
              onClick={generateReport} 
              disabled={loading}
              className="w-full"
            >
              {loading ? "Gerando..." : "Gerar Relatório"}
            </Button>
          </div>
        </div>

        {reportData && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Receita Total</p>
                      <p className="text-2xl font-bold">R$ {reportData.totalRevenue.toFixed(2)}</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total de Agendamentos</p>
                      <p className="text-2xl font-bold">{reportData.totalAppointments}</p>
                    </div>
                    <Calendar className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Clientes Únicos</p>
                      <p className="text-2xl font-bold">{reportData.uniqueCustomers}</p>
                    </div>
                    <Users className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Service Statistics */}
            {reportData.serviceStats.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Estatísticas por Serviço</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Serviço</TableHead>
                        <TableHead>Quantidade</TableHead>
                        <TableHead>Receita</TableHead>
                        <TableHead>Receita Média</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reportData.serviceStats.map((service, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{service.name}</TableCell>
                          <TableCell>{service.count}</TableCell>
                          <TableCell>R$ {service.revenue.toFixed(2)}</TableCell>
                          <TableCell>R$ {(service.revenue / service.count).toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            {/* Appointments List */}
            {reportData.appointments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Lista de Agendamentos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Data</TableHead>
                          <TableHead>Cliente</TableHead>
                          <TableHead>Serviço</TableHead>
                          <TableHead>Funcionário</TableHead>
                          <TableHead>Valor</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {reportData.appointments.map((appointment) => (
                          <TableRow key={appointment.id}>
                            <TableCell>
                              {format(new Date(appointment.date), "dd/MM", { locale: ptBR })} às {appointment.time}
                            </TableCell>
                            <TableCell>{appointment.customer_name}</TableCell>
                            <TableCell>{appointment.service?.name || 'N/A'}</TableCell>
                            <TableCell>{appointment.employee?.name || 'N/A'}</TableCell>
                            <TableCell>R$ {appointment.service?.price?.toFixed(2) || '0.00'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {reportData && reportData.appointments.length === 0 && (
          <div className="text-center py-8">
            <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhum agendamento encontrado no período selecionado</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};