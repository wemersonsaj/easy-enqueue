import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Clock, Share2, Palette, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface BusinessHours {
  [key: string]: {
    enabled: boolean;
    start: string;
    end: string;
    lunchStart?: string;
    lunchEnd?: string;
  };
}

interface SettingsData {
  business_hours: BusinessHours;
  socials: {
    whatsapp?: string;
    instagram?: string;
    address?: string;
  };
  visuals: {
    business_name?: string;
    logo_url?: string;
    primary_color?: string;
  };
}

const DEFAULT_BUSINESS_HOURS: BusinessHours = {
  monday: { enabled: true, start: '09:00', end: '18:00', lunchStart: '12:00', lunchEnd: '13:00' },
  tuesday: { enabled: true, start: '09:00', end: '18:00', lunchStart: '12:00', lunchEnd: '13:00' },
  wednesday: { enabled: true, start: '09:00', end: '18:00', lunchStart: '12:00', lunchEnd: '13:00' },
  thursday: { enabled: true, start: '09:00', end: '18:00', lunchStart: '12:00', lunchEnd: '13:00' },
  friday: { enabled: true, start: '09:00', end: '18:00', lunchStart: '12:00', lunchEnd: '13:00' },
  saturday: { enabled: true, start: '09:00', end: '17:00' },
  sunday: { enabled: false, start: '09:00', end: '17:00' },
};

const DAYS_OF_WEEK = {
  monday: 'Segunda-feira',
  tuesday: 'Terça-feira',
  wednesday: 'Quarta-feira',
  thursday: 'Quinta-feira',
  friday: 'Sexta-feira',
  saturday: 'Sábado',
  sunday: 'Domingo',
};

export const SettingsTab = () => {
  const [settings, setSettings] = useState<SettingsData>({
    business_hours: DEFAULT_BUSINESS_HOURS,
    socials: {},
    visuals: {},
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('id', 1)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setSettings({
          business_hours: (data.business_hours as BusinessHours) || DEFAULT_BUSINESS_HOURS,
          socials: (data.socials as any) || {},
          visuals: (data.visuals as any) || {},
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao carregar configurações",
        description: "Não foi possível carregar as configurações.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('settings')
        .upsert({
          id: 1,
          business_hours: settings.business_hours,
          socials: settings.socials,
          visuals: settings.visuals,
        });

      if (error) throw error;

      toast({
        title: "Configurações salvas",
        description: "As configurações foram salvas com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const updateBusinessHours = (day: string, field: string, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      business_hours: {
        ...prev.business_hours,
        [day]: {
          ...prev.business_hours[day],
          [field]: value,
        },
      },
    }));
  };

  const updateSocials = (field: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      socials: {
        ...prev.socials,
        [field]: value,
      },
    }));
  };

  const updateVisuals = (field: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      visuals: {
        ...prev.visuals,
        [field]: value,
      },
    }));
  };

  if (loading) {
    return (
      <Card className="shadow-elegant">
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando configurações...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-elegant">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-primary" />
          Configurações
        </CardTitle>
        <CardDescription>
          Personalize seu sistema de agendamento
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="hours" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="hours" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Funcionamento
            </TabsTrigger>
            <TabsTrigger value="socials" className="flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              Contato
            </TabsTrigger>
            <TabsTrigger value="visuals" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Visual
            </TabsTrigger>
          </TabsList>

          <TabsContent value="hours" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Horários de Funcionamento</CardTitle>
                <CardDescription>
                  Configure os dias e horários de funcionamento do seu negócio
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(DAYS_OF_WEEK).map(([day, dayName]) => (
                  <div key={day} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="w-32">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={settings.business_hours[day]?.enabled || false}
                          onCheckedChange={(checked) => updateBusinessHours(day, 'enabled', checked)}
                        />
                        <Label className="font-medium">{dayName}</Label>
                      </div>
                    </div>
                    
                    {settings.business_hours[day]?.enabled && (
                      <div className="flex items-center space-x-2 flex-1">
                        <div>
                          <Label className="text-xs">Início</Label>
                          <Input
                            type="time"
                            value={settings.business_hours[day]?.start || '09:00'}
                            onChange={(e) => updateBusinessHours(day, 'start', e.target.value)}
                            className="w-20"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Fim</Label>
                          <Input
                            type="time"
                            value={settings.business_hours[day]?.end || '18:00'}
                            onChange={(e) => updateBusinessHours(day, 'end', e.target.value)}
                            className="w-20"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Almoço - Início</Label>
                          <Input
                            type="time"
                            value={settings.business_hours[day]?.lunchStart || ''}
                            onChange={(e) => updateBusinessHours(day, 'lunchStart', e.target.value)}
                            className="w-20"
                            placeholder="--:--"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Almoço - Fim</Label>
                          <Input
                            type="time"
                            value={settings.business_hours[day]?.lunchEnd || ''}
                            onChange={(e) => updateBusinessHours(day, 'lunchEnd', e.target.value)}
                            className="w-20"
                            placeholder="--:--"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="socials" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações de Contato</CardTitle>
                <CardDescription>
                  Configure as informações de contato e redes sociais
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <Input
                    id="whatsapp"
                    placeholder="(11) 99999-9999"
                    value={settings.socials.whatsapp || ''}
                    onChange={(e) => updateSocials('whatsapp', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    placeholder="@seunegocio"
                    value={settings.socials.instagram || ''}
                    onChange={(e) => updateSocials('instagram', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="address">Endereço</Label>
                  <Textarea
                    id="address"
                    placeholder="Rua Exemplo, 123 - Bairro - Cidade/Estado"
                    value={settings.socials.address || ''}
                    onChange={(e) => updateSocials('address', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="visuals" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Identidade Visual</CardTitle>
                <CardDescription>
                  Personalize a aparência do seu sistema de agendamento
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="business_name">Nome do Negócio</Label>
                  <Input
                    id="business_name"
                    placeholder="Meu Negócio"
                    value={settings.visuals.business_name || ''}
                    onChange={(e) => updateVisuals('business_name', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="logo_url">URL do Logo</Label>
                  <Input
                    id="logo_url"
                    placeholder="https://exemplo.com/logo.png"
                    value={settings.visuals.logo_url || ''}
                    onChange={(e) => updateVisuals('logo_url', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="primary_color">Cor Principal</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="primary_color"
                      type="color"
                      value={settings.visuals.primary_color || '#3b82f6'}
                      onChange={(e) => updateVisuals('primary_color', e.target.value)}
                      className="w-16 h-10"
                    />
                    <Input
                      placeholder="#3b82f6"
                      value={settings.visuals.primary_color || ''}
                      onChange={(e) => updateVisuals('primary_color', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end">
          <Button onClick={saveSettings} disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Salvando...' : 'Salvar Configurações'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};