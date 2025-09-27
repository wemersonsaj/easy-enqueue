import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Phone, Scissors } from "lucide-react";
import type { BookingData } from "@/pages/Index";

interface CustomerInfoStepProps {
  data: Partial<BookingData>;
  onComplete: (data: Partial<BookingData>) => void;
}

// Mock data - this will come from Supabase later
const mockEmployees = [
  { id: "1", name: "Ana Silva", specialties: ["Corte", "Coloração"] },
  { id: "2", name: "João Santos", specialties: ["Corte", "Barba"] },
  { id: "3", name: "Maria Costa", specialties: ["Manicure", "Pedicure"] },
];

export const CustomerInfoStep = ({ data, onComplete }: CustomerInfoStepProps) => {
  const [customerName, setCustomerName] = useState(data.customerName || "");
  const [customerPhone, setCustomerPhone] = useState(data.customerPhone || "");
  const [employeeId, setEmployeeId] = useState(data.employeeId || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({
      customerName,
      customerPhone,
      employeeId,
    });
  };

  const isValid = customerName.length >= 2 && customerPhone.length >= 10 && employeeId;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="customerName" className="text-sm font-medium">
            Nome Completo
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="customerName"
              type="text"
              placeholder="Digite seu nome completo"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="pl-10"
              required
              minLength={2}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="customerPhone" className="text-sm font-medium">
            WhatsApp
          </Label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="customerPhone"
              type="tel"
              placeholder="(11) 99999-9999"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="pl-10"
              required
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Será usado para confirmação e lembretes do agendamento
          </p>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Profissional
          </Label>
          <Select value={employeeId} onValueChange={setEmployeeId} required>
            <SelectTrigger className="w-full">
              <div className="flex items-center gap-2">
                <Scissors className="h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Escolha o profissional" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {mockEmployees.map((employee) => (
                <SelectItem key={employee.id} value={employee.id}>
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{employee.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {employee.specialties.join(", ")}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
        disabled={!isValid}
      >
        Continuar
      </Button>
    </form>
  );
};