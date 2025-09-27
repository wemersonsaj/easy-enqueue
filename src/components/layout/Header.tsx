import { Button } from "@/components/ui/button";
import { Calendar, Settings } from "lucide-react";
import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <header className="bg-card border-b border-border shadow-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">AgendaPro</h2>
              <p className="text-xs text-muted-foreground">Sistema de Agendamento</p>
            </div>
          </Link>
          
          <nav className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/">
                Agendar
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/admin">
                <Settings className="w-4 h-4 mr-1" />
                Admin
              </Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};