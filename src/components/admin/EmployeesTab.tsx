import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Users, Plus, Edit, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Employee {
  id: string;
  name: string;
  created_at: string;
  services?: Service[];
}

interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
}

export const EmployeesTab = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    selectedServices: [] as string[],
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch employees with their services
      const { data: employeesData, error: employeesError } = await supabase
        .from('employees')
        .select(`
          *,
          employee_services(
            service:services(*)
          )
        `)
        .order('name', { ascending: true });

      if (employeesError) throw employeesError;

      // Transform the data to include services directly
      const employeesWithServices = employeesData?.map(employee => ({
        ...employee,
        services: employee.employee_services?.map((es: any) => es.service) || []
      })) || [];

      setEmployees(employeesWithServices);

      // Fetch all services
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('*')
        .order('name', { ascending: true });

      if (servicesError) throw servicesError;
      setServices(servicesData || []);
    } catch (error) {
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar funcionários e serviços.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      selectedServices: [],
    });
    setEditingEmployee(null);
  };

  const openDialog = (employee?: Employee) => {
    if (employee) {
      setEditingEmployee(employee);
      setFormData({
        name: employee.name,
        selectedServices: employee.services?.map(s => s.id) || [],
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const saveEmployee = async () => {
    try {
      let employeeId: string;

      if (editingEmployee) {
        // Update existing employee
        const { error } = await supabase
          .from('employees')
          .update({ name: formData.name })
          .eq('id', editingEmployee.id);

        if (error) throw error;
        employeeId = editingEmployee.id;

        // Delete existing service associations
        const { error: deleteError } = await supabase
          .from('employee_services')
          .delete()
          .eq('employee_id', employeeId);

        if (deleteError) throw deleteError;
      } else {
        // Create new employee
        const { data, error } = await supabase
          .from('employees')
          .insert({ name: formData.name })
          .select()
          .single();

        if (error) throw error;
        employeeId = data.id;
      }

      // Insert new service associations
      if (formData.selectedServices.length > 0) {
        const serviceAssociations = formData.selectedServices.map(serviceId => ({
          employee_id: employeeId,
          service_id: serviceId,
        }));

        const { error: insertError } = await supabase
          .from('employee_services')
          .insert(serviceAssociations);

        if (insertError) throw insertError;
      }

      toast({
        title: editingEmployee ? "Funcionário atualizado" : "Funcionário criado",
        description: `O funcionário foi ${editingEmployee ? 'atualizado' : 'criado'} com sucesso.`,
      });

      await fetchData();
      closeDialog();
    } catch (error) {
      toast({
        title: "Erro ao salvar funcionário",
        description: "Não foi possível salvar o funcionário.",
        variant: "destructive",
      });
    }
  };

  const deleteEmployee = async (id: string) => {
    try {
      // Delete employee service associations first
      const { error: deleteServicesError } = await supabase
        .from('employee_services')
        .delete()
        .eq('employee_id', id);

      if (deleteServicesError) throw deleteServicesError;

      // Delete employee
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setEmployees(prev => prev.filter(employee => employee.id !== id));
      toast({
        title: "Funcionário excluído",
        description: "O funcionário foi excluído com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o funcionário.",
        variant: "destructive",
      });
    }
  };

  const handleServiceToggle = (serviceId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      selectedServices: checked
        ? [...prev.selectedServices, serviceId]
        : prev.selectedServices.filter(id => id !== serviceId)
    }));
  };

  if (loading) {
    return (
      <Card className="shadow-elegant">
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando funcionários...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-elegant">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          Funcionários
        </CardTitle>
        <CardDescription>
          Gerencie sua equipe e os serviços que cada um pode realizar
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Lista de Funcionários</h3>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => openDialog()}>
                <Plus className="w-4 h-4 mr-2" />
                Novo Funcionário
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingEmployee ? 'Editar Funcionário' : 'Novo Funcionário'}
                </DialogTitle>
                <DialogDescription>
                  {editingEmployee ? 'Faça as alterações necessárias no funcionário' : 'Adicione um novo funcionário e selecione os serviços que ele pode realizar'}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome do Funcionário</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: João Silva"
                  />
                </div>
                
                <div>
                  <Label>Serviços que pode realizar</Label>
                  <div className="mt-2 space-y-2 max-h-60 overflow-y-auto border rounded-md p-3">
                    {services.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        Nenhum serviço disponível. Cadastre serviços primeiro.
                      </p>
                    ) : (
                      services.map((service) => (
                        <div key={service.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={service.id}
                            checked={formData.selectedServices.includes(service.id)}
                            onCheckedChange={(checked) => 
                              handleServiceToggle(service.id, checked as boolean)
                            }
                          />
                          <Label htmlFor={service.id} className="flex-1">
                            {service.name} ({service.duration}min - R$ {service.price.toFixed(2)})
                          </Label>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={saveEmployee} className="flex-1" disabled={!formData.name}>
                    {editingEmployee ? 'Salvar Alterações' : 'Criar Funcionário'}
                  </Button>
                  <Button variant="outline" onClick={closeDialog}>
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {employees.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhum funcionário cadastrado</p>
            <Button className="mt-4" onClick={() => openDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeiro Funcionário
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Serviços</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">{employee.name}</TableCell>
                    <TableCell>
                      {employee.services && employee.services.length > 0 ? (
                        <div className="space-y-1">
                          {employee.services.map((service) => (
                            <div key={service.id} className="text-sm">
                              {service.name} ({service.duration}min)
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Nenhum serviço</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openDialog(employee)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteEmployee(employee.id)}
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