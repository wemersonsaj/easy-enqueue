import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CalendarDays, Clock, User, Phone, MessageCircle, Edit, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Appointment {
  id: string;
  customer_name: string;
  customer_whatsapp?: string;
  date: string;
  time: string;
  created_at: string;
  service: {
    name: string;
    duration: number;
    price: number;
  };
  employee: {
    name: string;
  };
}

export const AppointmentsTab = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          service:services(name, duration, price),
          employee:employees(name)
        `)
        .order('date', { ascending: true })
        .order('time', { ascending: true });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      toast({
        title: "Erro ao carregar agendamentos",
        description: "Não foi possível carregar os agendamentos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteAppointment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAppointments(prev => prev.filter(app => app.id !== id));
      toast({
        title: "Agendamento excluído",
        description: "O agendamento foi excluído com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o agendamento.",
        variant: "destructive",
      });
    }
  };

  const updateAppointment = async (appointment: Appointment) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({
          customer_name: appointment.customer_name,
          customer_whatsapp: appointment.customer_whatsapp,
          date: appointment.date,
          time: appointment.time,
        })
        .eq('id', appointment.id);

      if (error) throw error;

      await fetchAppointments();
      setEditingAppointment(null);
      toast({
        title: "Agendamento atualizado",
        description: "O agendamento foi atualizado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar o agendamento.",
        variant: "destructive",
      });
    }
  };

  const openWhatsApp = (phone: string, customerName: string, serviceName: string, date: string, time: string) => {
    const message = `Olá ${customerName}! Confirmando seu agendamento para ${serviceName} no dia ${format(new Date(date), "dd/MM/yyyy", { locale: ptBR })} às ${time}.`;
    const url = `https://wa.me/55${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <Card className="shadow-elegant">
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando agendamentos...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-elegant">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-primary" />
          Agendamentos
        </CardTitle>
        <CardDescription>
          Gerencie todos os horários marcados
        </CardDescription>
      </CardHeader>
      <CardContent>
        {appointments.length === 0 ? (
          <div className="text-center py-8">
            <CalendarDays className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhum agendamento encontrado</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Serviço</TableHead>
                  <TableHead>Funcionário</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Hora</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{appointment.customer_name}</p>
                        {appointment.customer_whatsapp && (
                          <p className="text-sm text-muted-foreground">{appointment.customer_whatsapp}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{appointment.service.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {appointment.service.duration}min - R$ {appointment.service.price}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{appointment.employee.name}</TableCell>
                    <TableCell>
                      {format(new Date(appointment.date), "dd/MM/yyyy", { locale: ptBR })}
                    </TableCell>
                    <TableCell>{appointment.time}</TableCell>
                    <TableCell>
                      <Badge variant={new Date(appointment.date) >= new Date() ? "default" : "secondary"}>
                        {new Date(appointment.date) >= new Date() ? "Agendado" : "Finalizado"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {appointment.customer_whatsapp && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openWhatsApp(
                              appointment.customer_whatsapp!,
                              appointment.customer_name,
                              appointment.service.name,
                              appointment.date,
                              appointment.time
                            )}
                          >
                            <MessageCircle className="w-4 h-4" />
                          </Button>
                        )}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingAppointment(appointment)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Editar Agendamento</DialogTitle>
                              <DialogDescription>
                                Faça as alterações necessárias no agendamento
                              </DialogDescription>
                            </DialogHeader>
                            {editingAppointment && (
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="customer_name">Nome do Cliente</Label>
                                  <Input
                                    id="customer_name"
                                    value={editingAppointment.customer_name}
                                    onChange={(e) => setEditingAppointment({
                                      ...editingAppointment,
                                      customer_name: e.target.value
                                    })}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="customer_whatsapp">WhatsApp</Label>
                                  <Input
                                    id="customer_whatsapp"
                                    value={editingAppointment.customer_whatsapp || ''}
                                    onChange={(e) => setEditingAppointment({
                                      ...editingAppointment,
                                      customer_whatsapp: e.target.value
                                    })}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="date">Data</Label>
                                  <Input
                                    id="date"
                                    type="date"
                                    value={editingAppointment.date}
                                    onChange={(e) => setEditingAppointment({
                                      ...editingAppointment,
                                      date: e.target.value
                                    })}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="time">Hora</Label>
                                  <Input
                                    id="time"
                                    type="time"
                                    value={editingAppointment.time}
                                    onChange={(e) => setEditingAppointment({
                                      ...editingAppointment,
                                      time: e.target.value
                                    })}
                                  />
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    onClick={() => updateAppointment(editingAppointment)}
                                    className="flex-1"
                                  >
                                    Salvar Alterações
                                  </Button>
                                  <Button
                                    variant="outline"
                                    onClick={() => setEditingAppointment(null)}
                                  >
                                    Cancelar
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteAppointment(appointment.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};