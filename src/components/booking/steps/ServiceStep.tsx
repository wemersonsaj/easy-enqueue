import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BookingData } from "@/pages/Index";

interface ServiceStepProps {
  employeeId: string;
  data: Partial<BookingData>;
  onComplete: (data: Partial<BookingData>) => void;
}

// Mock data - this will come from Supabase later
const mockServices = [
  {
    id: "1",
    name: "Corte Masculino",
    description: "Corte de cabelo masculino com acabamento",
    duration: 30,
    price: 35,
    employeeIds: ["1", "2"],
  },
  {
    id: "2",
    name: "Corte + Barba",
    description: "Corte de cabelo + barba completa",
    duration: 45,
    price: 50,
    employeeIds: ["2"],
  },
  {
    id: "3",
    name: "Coloração",
    description: "Coloração completa do cabelo",
    duration: 120,
    price: 120,
    employeeIds: ["1"],
  },
  {
    id: "4",
    name: "Manicure",
    description: "Cuidados completos para as unhas das mãos",
    duration: 40,
    price: 25,
    employeeIds: ["3"],
  },
  {
    id: "5",
    name: "Pedicure",
    description: "Cuidados completos para os pés",
    duration: 50,
    price: 30,
    employeeIds: ["3"],
  },
];

export const ServiceStep = ({ employeeId, data, onComplete }: ServiceStepProps) => {
  const [selectedServiceId, setSelectedServiceId] = useState(data.serviceId || "");

  const availableServices = mockServices.filter(service => 
    service.employeeIds.includes(employeeId)
  );

  const handleSubmit = () => {
    onComplete({
      serviceId: selectedServiceId,
    });
  };

  const isValid = selectedServiceId !== "";

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {availableServices.map((service) => (
          <Card
            key={service.id}
            className={cn(
              "cursor-pointer transition-all duration-200 hover:shadow-card",
              {
                "ring-2 ring-primary shadow-elegant": selectedServiceId === service.id,
                "hover:border-primary/50": selectedServiceId !== service.id,
              }
            )}
            onClick={() => setSelectedServiceId(service.id)}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-foreground">{service.name}</h3>
                <Badge variant="secondary" className="ml-2">
                  R$ {service.price}
                </Badge>
              </div>
              
              <p className="text-sm text-muted-foreground mb-3">
                {service.description}
              </p>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{service.duration} min</span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  <span>R$ {service.price}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {availableServices.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            Nenhum serviço disponível para este profissional.
          </p>
        </div>
      )}

      <Button 
        onClick={handleSubmit}
        className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
        disabled={!isValid}
      >
        Continuar
      </Button>
    </div>
  );
};