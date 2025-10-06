"use client";

import { useState } from "react";
import { ProfileForm, UserSettingsForm, SecurityForm, AccountInfo } from "@/components/profile";
import { TimeZoneCard } from "./personalisation/TimeZoneCard";
import { DateFormatCard } from "./personalisation/DateFormatCard";
import { TimeFormatCard } from "./personalisation/TimeFormatCard";
import { LanguageCard } from "./personalisation/LanguageCard";
import { AppearanceCard } from "./personalisation/AppearanceCard";

const Personalization = () => {
  const [timeZone, setTimeZone] = useState<string>("Europe/Paris");
  const [dateFormat, setDateFormat] = useState<string>("dd/mm/yyyy");
  const [timeFormat, setTimeFormat] = useState<string>("24h");
  const [language, setLanguage] = useState<string>("fr");

  return (
    <div className="min-h-screen p-6 bg-background">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Personnalisation</h1>
          <p className="text-muted-foreground text-lg">Configurez vos préférences d'affichage et de localisation</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <ProfileForm />
          <UserSettingsForm />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <SecurityForm />
          <AccountInfo />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          <TimeZoneCard value={timeZone} onChange={setTimeZone} />
          <DateFormatCard value={dateFormat} onChange={setDateFormat} />
          <TimeFormatCard value={timeFormat} onChange={setTimeFormat} />
          <LanguageCard value={language} onChange={setLanguage} />
        </div>

        <AppearanceCard />
      </div>
    </div>
  );
};

export default Personalization;
