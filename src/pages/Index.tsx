import { useState } from "react";
import { BookingFlow } from "@/components/booking/BookingFlow";
import { SuccessModal } from "@/components/booking/SuccessModal";
import { Header } from "@/components/layout/Header";

export interface BookingData {
  customerName: string;
  customerPhone: string;
  employeeId: string;
  serviceId: string;
  date: string;
  time: string;
}

const Index = () => {
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [bookingData, setBookingData] = useState<BookingData | null>(null);

  const handleBookingComplete = (data: BookingData) => {
    setBookingData(data);
    setIsSuccessModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Agende seu Horário
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Marque seu atendimento de forma rápida e prática em apenas alguns passos
          </p>
        </div>

        <BookingFlow onComplete={handleBookingComplete} />

        <SuccessModal 
          isOpen={isSuccessModalOpen}
          onClose={() => setIsSuccessModalOpen(false)}
          bookingData={bookingData}
        />
      </main>
    </div>
  );
};

export default Index;