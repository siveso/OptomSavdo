import { useState, useEffect } from "react";

export type Language = "uz" | "ru" | "en";

export function useLanguage() {
  const [language, setLanguage] = useState<Language>("uz");

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage && ["uz", "ru", "en"].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
    localStorage.setItem("language", newLanguage);
  };

  return { language, changeLanguage };
}
