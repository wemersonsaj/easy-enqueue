import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { StepIndicator } from "./StepIndicator";
import { CustomerInfoStep } from "./steps/CustomerInfoStep";
import { ServiceStep } from "./steps/ServiceStep";
import { DateTimeStep } from "./steps/DateTimeStep";
import { ConfirmationStep } from "./steps/ConfirmationStep";
import type { BookingData } from "@/pages/Index";

interface BookingFlowProps {
  onComplete: (data: BookingData) => void;
}

const STEPS = [
  { id: 1, title: "Informações", description: "Dados pessoais e profissional" },
  { id: 2, title: "Serviço", description: "Escolha o serviço desejado" },
  { id: 3, title: "Data e Hora", description: "Selecione quando prefere" },
  { id: 4, title: "Confirmação", description: "Revise e confirme" },
];

export const BookingFlow = ({ onComplete }: BookingFlowProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<BookingData>>({});

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepComplete = (stepData: Partial<BookingData>) => {
    const updatedData = { ...formData, ...stepData };
    setFormData(updatedData);
    
    if (currentStep === STEPS.length) {
      onComplete(updatedData as BookingData);
    } else {
      handleNext();
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <CustomerInfoStep 
            data={formData} 
            onComplete={handleStepComplete}
          />
        );
      case 2:
        return (
          <ServiceStep 
            employeeId={formData.employeeId || ""} 
            data={formData}
            onComplete={handleStepComplete}
          />
        );
      case 3:
        return (
          <DateTimeStep 
            employeeId={formData.employeeId || ""}
            serviceId={formData.serviceId || ""}
            data={formData}
            onComplete={handleStepComplete}
          />
        );
      case 4:
        return (
          <ConfirmationStep 
            data={formData as BookingData}
            onComplete={handleStepComplete}
          />
        );
      default:
        return null;
    }
  };

  const progressValue = (currentStep / STEPS.length) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <StepIndicator 
          steps={STEPS} 
          currentStep={currentStep} 
        />
        <Progress value={progressValue} className="mt-4" />
      </div>

      <Card className="shadow-elegant">
        <CardContent className="p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              {STEPS[currentStep - 1].title}
            </h2>
            <p className="text-muted-foreground">
              {STEPS[currentStep - 1].description}
            </p>
          </div>

          {renderCurrentStep()}

          {currentStep > 1 && (
            <div className="flex justify-between mt-8 pt-6 border-t border-border">
              <Button 
                variant="outline" 
                onClick={handlePrevious}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Voltar
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};