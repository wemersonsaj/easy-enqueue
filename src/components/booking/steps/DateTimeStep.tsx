import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock } from "lucide-react";
import { format, addDays, startOfDay, isBefore, isWeekend } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import type { BookingData } from "@/pages/Index";

interface DateTimeStepProps {
  employeeId: string;
  serviceId: string;
  data: Partial<BookingData>;
  onComplete: (data: Partial<BookingData>) => void;
}

// Mock available times
const mockAvailableTimes = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"
];

export const DateTimeStep = ({ employeeId, serviceId, data, onComplete }: DateTimeStepProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    data.date ? new Date(data.date) : undefined
  );
  const [selectedTime, setSelectedTime] = useState(data.time || "");

  const handleSubmit = () => {
    if (!selectedDate || !selectedTime) return;
    
    onComplete({
      date: selectedDate.toISOString().split('T')[0],
      time: selectedTime,
    });
  };

  const isDateDisabled = (date: Date) => {
    // Disable past dates and weekends (this would be configurable in real app)
    return isBefore(startOfDay(date), startOfDay(new Date())) || isWeekend(date);
  };

  const isValid = selectedDate && selectedTime;

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Calendar */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <CalendarDays className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Selecione a Data</h3>
            </div>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={isDateDisabled}
              locale={ptBR}
              className="rounded-md border-0"
              classNames={{
                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                month: "space-y-4",
                caption: "flex justify-center pt-1 relative items-center",
                caption_label: "text-sm font-medium",
                nav: "space-x-1 flex items-center",
                nav_button: cn(
                  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
                ),
                nav_button_previous: "absolute left-1",
                nav_button_next: "absolute right-1",
                table: "w-full border-collapse space-y-1",
                head_row: "flex",
                head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                row: "flex w-full mt-2",
                cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                day: cn(
                  "inline-flex items-center justify-center rounded-md text-sm font-normal h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground"
                ),
                day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                day_today: "bg-accent text-accent-foreground",
                day_outside: "text-muted-foreground opacity-50",
                day_disabled: "text-muted-foreground opacity-50 cursor-not-allowed",
              }}
            />
          </CardContent>
        </Card>

        {/* Time slots */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Horários Disponíveis</h3>
            </div>
            
            {selectedDate ? (
              <div className="grid grid-cols-2 gap-2">
                {mockAvailableTimes.map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTime(time)}
                    className={cn(
                      "h-10",
                      selectedTime === time && "bg-primary text-primary-foreground"
                    )}
                  >
                    {time}
                  </Button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Selecione uma data para ver os horários</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {selectedDate && (
        <Card className="bg-accent/50 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Data selecionada:</p>
                <p className="text-lg font-semibold text-primary">
                  {format(selectedDate, "EEEE, d 'de' MMMM", { locale: ptBR })}
                </p>
              </div>
              {selectedTime && (
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  {selectedTime}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
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