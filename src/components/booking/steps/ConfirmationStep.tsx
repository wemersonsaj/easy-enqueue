import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Calendar, Clock, Scissors, DollarSign, Phone } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { BookingData } from "@/pages/Index";

interface ConfirmationStepProps {
  data: BookingData;
  onComplete: (data: Partial<BookingData>) => void;
}

// Mock data - this will come from Supabase later
const mockEmployees = [
  { id: "1", name: "Ana Silva" },
  { id: "2", name: "João Santos" },
  { id: "3", name: "Maria Costa" },
];

const mockServices = [
  { id: "1", name: "Corte Masculino", price: 35, duration: 30 },
  { id: "2", name: "Corte + Barba", price: 50, duration: 45 },
  { id: "3", name: "Coloração", price: 120, duration: 120 },
  { id: "4", name: "Manicure", price: 25, duration: 40 },
  { id: "5", name: "Pedicure", price: 30, duration: 50 },
];

export const ConfirmationStep = ({ data, onComplete }: ConfirmationStepProps) => {
  const employee = mockEmployees.find(emp => emp.id === data.employeeId);
  const service = mockServices.find(svc => svc.id === data.serviceId);
  const appointmentDate = new Date(data.date);

  const handleConfirm = () => {
    // Here you would normally send the data to Supabase
    console.log("Booking confirmed:", data);
    onComplete(data);
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-card">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-center">
            Revise seus dados
          </h3>

          <div className="space-y-4">
            {/* Customer Info */}
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">{data.customerName}</p>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  <span>{data.customerPhone}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Professional */}
            <div className="flex items-center gap-3">
              <Scissors className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Profissional</p>
                <p className="font-medium">{employee?.name}</p>
              </div>
            </div>

            <Separator />

            {/* Service */}
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center mt-0.5">
                <span className="text-xs font-bold text-primary-foreground">S</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium">{service?.name}</p>
                  <Badge variant="secondary">R$ {service?.price}</Badge>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{service?.duration} minutos</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Date and Time */}
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">
                  {format(appointmentDate, "EEEE, d 'de' MMMM", { locale: ptBR })}
                </p>
                <p className="text-sm text-muted-foreground">às {data.time}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">Total do Serviço</span>
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" />
              <span className="text-2xl font-bold text-primary">
                R$ {service?.price}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Important Note */}
      <Card className="bg-accent/50">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground text-center">
            <strong>Importante:</strong> Você receberá uma confirmação via WhatsApp. 
            Em caso de cancelamento, avise com pelo menos 2 horas de antecedência.
          </p>
        </CardContent>
      </Card>

      <Button 
        onClick={handleConfirm}
        className="w-full bg-gradient-primary hover:opacity-90 transition-opacity text-lg py-6"
      >
        Confirmar Agendamento
      </Button>
    </div>
  );
};