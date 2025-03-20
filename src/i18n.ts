import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  en: {
    translation: {
      loading: "Loading...",
      title1: "Optimize your ",
      title2: "productivity",
      end_day: "End Day",
      see_history: "See History",
      start: "Start",
      reboot: "Reboot",
      pause: "Pause",
      break_minutes: "Minutes of Break",
      break: "Break",
      breakFrom: "Break from: {{taskName}}",
      alert1: "Break time from task {{taskName}} ended",
      alert2: "You must first start a task",
      alert3: "Time for task {{taskName}} completed",
      alert4: "Please enter a name for the task",
      what_work: "What will you work on?",
      minutes: "Minutes",
      atention: "Attention",
      accept: "Accept",
      summary: "Summary of the Day",
      your: "Your ",
      today: " today",
      working_time: "Working Time",
      break_time: "Break Time",
      task_details: "Details by Task",
      no_tasks: "There are no registered tasks",
      continue_working: "Continue Working",
      history: "History",
      p1: "daily",
      p2: " progress",
      return_timer: "Return to Timer"
    },
  },
  es: {
    translation: {
      loading: "Cargando...",
      title1: "Optimiza tu ",
      title2: "productividad",
      end_day: "Terminar Día",
      see_history: "Ver Historial",
      start: "Iniciar",
      reboot: "Reiniciar",
      pause: "Pausar",
      break_minutes: "Minutos de Descanso",
      break: "Descanso",
      breakFrom: "Descanso de: {{taskName}}",
      alert1: "Tiempo de descanso de la tarea {{taskName}} terminado",
      alert2: "Primero debes iniciar una tarea",
      alert3: "Tiempo de la tarea {{taskName}} terminado",
      alert4: "Por favor, ingresa un nombre para la tarea",
      what_work: "¿En qué trabajarás?",
      minutes: "Minutos",
      atention: "Atención",
      accept: "Aceptar",
      summary: "Resumen del Día",
      your: "Tu ",
      today: " de hoy",
      working_time: "Tiempo de Trabajo",
      break_time: "Tiempo de Desanso",
      task_details: "Detalles por Tarea",
      no_tasks: "No hay tareas registradas",
      continue_working: "Continuar Trabajando",
      history: "Historial",
      p1: "progreso",
      p2: " diario",
      return_timer: "Volver al Temporizador"
    },
  },
};

i18n
  .use(LanguageDetector) 
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: { escapeValue: false },
    detection: {
      order: ["navigator", "htmlTag", "path", "subdomain"],
    },
  });

export default i18n;
