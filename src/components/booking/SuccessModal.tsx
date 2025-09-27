import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Calendar, Clock, MapPin, MessageCircle, Instagram } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { BookingData } from "@/pages/Index";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingData: BookingData | null;
}

// Mock data - this will come from Supabase later
const mockEmployees = [
  { id: "1", name: "Ana Silva" },
  { id: "2", name: "João Santos" },
  { id: "3", name: "Maria Costa" },
];

const mockServices = [
  { id: "1", name: "Corte Masculino", price: 35 },
  { id: "2", name: "Corte + Barba", price: 50 },
  { id: "3", name: "Coloração", price: 120 },
  { id: "4", name: "Manicure", price: 25 },
  { id: "5", name: "Pedicure", price: 30 },
];

const mockBusinessInfo = {
  name: "AgendaPro Studio",
  address: "Rua das Flores, 123 - Centro",
  whatsapp: "11999999999",
  instagram: "@agendapro",
};

export const SuccessModal = ({ isOpen, onClose, bookingData }: SuccessModalProps) => {
  if (!bookingData) return null;

  const employee = mockEmployees.find(emp => emp.id === bookingData.employeeId);
  const service = mockServices.find(svc => svc.id === bookingData.serviceId);
  const appointmentDate = new Date(bookingData.date);

  const handleWhatsAppContact = () => {
    const message = `Olá! Gostaria de confirmar meu agendamento para ${format(appointmentDate, "d/MM/yyyy", { locale: ptBR })} às ${bookingData.time}.`;
    const whatsappUrl = `https://wa.me/55${mockBusinessInfo.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleInstagramVisit = () => {
    const instagramUrl = `https://instagram.com/${mockBusinessInfo.instagram.replace('@', '')}`;
    window.open(instagramUrl, '_blank');
  };

  const handleNewBooking = () => {
    onClose();
    window.location.reload();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-success" />
          </div>
          <DialogTitle className="text-2xl font-bold text-success">
            Agendamento Confirmado!
          </DialogTitle>
          <DialogDescription>
            Seu horário foi marcado com sucesso. Confira os detalhes abaixo.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-6">
          <Card className="bg-success/5 border-success/20">
            <CardContent className="p-4">
              <div className="text-center space-y-2">
                <p className="font-semibold text-lg">{service?.name}</p>
                <p className="text-muted-foreground">com {employee?.name}</p>
                <div className="flex items-center justify-center gap-4 mt-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                      {format(appointmentDate, "d/MM/yyyy", { locale: ptBR })}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{bookingData.time}</span>
                  </div>
                </div>
                <Badge variant="secondary" className="mt-2">
                  R$ {service?.price}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-start gap-2 mb-3">
                <MapPin className="w-4 h-4 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">{mockBusinessInfo.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {mockBusinessInfo.address}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              onClick={handleWhatsAppContact}
              className="flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </Button>
            <Button 
              variant="outline" 
              onClick={handleInstagramVisit}
              className="flex items-center gap-2"
            >
              <Instagram className="w-4 h-4" />
              Instagram
            </Button>
          </div>

          <div className="pt-4 space-y-3">
            <Button 
              onClick={handleNewBooking}
              className="w-full bg-gradient-primary hover:opacity-90"
            >
              Fazer Novo Agendamento
            </Button>
            <Button variant="ghost" onClick={onClose} className="w-full">
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};