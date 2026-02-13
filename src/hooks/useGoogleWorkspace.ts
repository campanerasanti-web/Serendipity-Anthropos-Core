/**
 * GOOGLE WORKSPACE INTEGRATION
 * 
 * Integra con Google Calendar, Gmail, Tasks y Drive
 * para asistir en la gestión de reuniones, tareas y documentos
 * desde el Panel Personal de Santi
 * 
 * Cuenta: campanerasanti@gmail.com
 */

import { useState, useEffect, useCallback } from 'react';

// Google API Types
export interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
  attendees?: Array<{ email: string; responseStatus?: string }>;
  location?: string;
  status?: string;
}

export interface GmailMessage {
  id: string;
  threadId: string;
  labelIds: string[];
  snippet: string;
  payload: {
    headers: Array<{ name: string; value: string }>;
  };
  internalDate: string;
}

export interface GoogleTask {
  id: string;
  title: string;
  notes?: string;
  status: 'needsAction' | 'completed';
  due?: string;
  completed?: string;
  parent?: string;
  position?: string;
  links?: Array<{ type: string; description: string; link: string }>;
}

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink: string;
  modifiedTime: string;
  size?: string;
  parents?: string[];
}

export interface GoogleWorkspaceData {
  calendar: {
    today: CalendarEvent[];
    upcoming: CalendarEvent[];
    lastSync: Date | null;
  };
  email: {
    unread: number;
    recent: GmailMessage[];
    lastSync: Date | null;
  };
  tasks: {
    pending: GoogleTask[];
    completed: GoogleTask[];
    lastSync: Date | null;
  };
  drive: {
    recentFiles: DriveFile[];
    lastSync: Date | null;
  };
}

export interface MeetingSummary {
  eventId: string;
  title: string;
  date: string;
  duration: number; // minutes
  attendees: string[];
  topics?: string[];
  decisions?: string[];
  actionItems?: Array<{
    task: string;
    assignee: string;
    dueDate?: string;
  }>;
  generatedAt: Date;
}

/**
 * Hook para gestionar integración con Google Workspace
 */
export const useGoogleWorkspace = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [data, setData] = useState<GoogleWorkspaceData>({
    calendar: { today: [], upcoming: [], lastSync: null },
    email: { unread: 0, recent: [], lastSync: null },
    tasks: { pending: [], completed: [], lastSync: null },
    drive: { recentFiles: [], lastSync: null },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Inicializar Google API Client
   * NOTA: Requiere configuración en Google Cloud Console
   */
  const initializeGoogleClient = useCallback(async () => {
    try {
      // Verificar si ya está autenticado (mock para desarrollo)
      const savedAuth = localStorage.getItem('google-workspace-auth');
      if (savedAuth) {
        const auth = JSON.parse(savedAuth);
        if (auth.email === 'campanerasanti@gmail.com' && auth.expiresAt > Date.now()) {
          setIsAuthenticated(true);
          return true;
        }
      }

      // En producción, aquí iría la inicialización real de gapi
      console.log('Google Workspace: Inicializando cliente...');
      return false;
    } catch (err) {
      console.error('Error inicializando Google API:', err);
      setError('Error al conectar con Google Workspace');
      return false;
    }
  }, []);

  /**
   * Autenticar con Google OAuth2
   */
  const authenticate = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // MOCK: Simular autenticación exitosa
      // En producción, usar Google OAuth2 flow
      const mockAuth = {
        email: 'campanerasanti@gmail.com',
        accessToken: 'mock-token-' + Date.now(),
        expiresAt: Date.now() + 3600000, // 1 hora
        scopes: [
          'https://www.googleapis.com/auth/calendar.readonly',
          'https://www.googleapis.com/auth/gmail.readonly',
          'https://www.googleapis.com/auth/tasks',
          'https://www.googleapis.com/auth/drive.readonly',
        ],
      };

      localStorage.setItem('google-workspace-auth', JSON.stringify(mockAuth));
      setIsAuthenticated(true);
      
      // Sincronizar datos iniciales
      await syncAll();
      
      return true;
    } catch (err) {
      console.error('Error en autenticación:', err);
      setError('Error al autenticar con Google');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Sincronizar eventos del calendario (hoy + próximos 7 días)
   */
  const syncCalendar = useCallback(async () => {
    if (!isAuthenticated) return { today: [], upcoming: [] };

    try {
      // MOCK DATA para desarrollo
      // En producción, usar gapi.client.calendar.events.list()
      const now = new Date();
      const todayEvents: CalendarEvent[] = [
        {
          id: 'evt-1',
          summary: 'Reunión con equipo de producción',
          description: 'Revisión de órdenes para Tết',
          start: { dateTime: new Date(now.getTime() + 2 * 3600000).toISOString() },
          end: { dateTime: new Date(now.getTime() + 3 * 3600000).toISOString() },
          attendees: [
            { email: 'production@serendipitybros.com' },
            { email: 'campanerasanti@gmail.com' },
          ],
        },
        {
          id: 'evt-2',
          summary: 'Prueba piloto Tết',
          description: 'Activación del sistema QR + Dashboard Vietnamita',
          start: { dateTime: new Date(now.getTime() + 24 * 3600000).toISOString() },
          end: { dateTime: new Date(now.getTime() + 26 * 3600000).toISOString() },
          location: 'Taller Serendipity Bros',
        },
      ];

      const upcomingEvents: CalendarEvent[] = [
        {
          id: 'evt-3',
          summary: 'Revisión de métricas Kaizen',
          start: { dateTime: new Date(now.getTime() + 3 * 24 * 3600000).toISOString() },
          end: { dateTime: new Date(now.getTime() + 3 * 24 * 3600000 + 3600000).toISOString() },
        },
      ];

      setData((prev) => ({
        ...prev,
        calendar: {
          today: todayEvents,
          upcoming: upcomingEvents,
          lastSync: new Date(),
        },
      }));

      return { today: todayEvents, upcoming: upcomingEvents };
    } catch (err) {
      console.error('Error sincronizando calendario:', err);
      return { today: [], upcoming: [] };
    }
  }, [isAuthenticated]);

  /**
   * Sincronizar emails recientes (últimos 10)
   */
  const syncGmail = useCallback(async () => {
    if (!isAuthenticated) return { unread: 0, recent: [] };

    try {
      // MOCK DATA
      const recentMessages: GmailMessage[] = [
        {
          id: 'msg-1',
          threadId: 'thread-1',
          labelIds: ['INBOX', 'UNREAD'],
          snippet: 'Confirmación de orden #5023 - Cliente PRARA...',
          payload: {
            headers: [
              { name: 'From', value: 'orders@prara.com' },
              { name: 'Subject', value: 'Orden #5023 - Urgente para Tết' },
            ],
          },
          internalDate: Date.now().toString(),
        },
      ];

      setData((prev) => ({
        ...prev,
        email: {
          unread: 3,
          recent: recentMessages,
          lastSync: new Date(),
        },
      }));

      return { unread: 3, recent: recentMessages };
    } catch (err) {
      console.error('Error sincronizando Gmail:', err);
      return { unread: 0, recent: [] };
    }
  }, [isAuthenticated]);

  /**
   * Sincronizar tareas pendientes
   */
  const syncTasks = useCallback(async () => {
    if (!isAuthenticated) return { pending: [], completed: [] };

    try {
      // MOCK DATA
      const pendingTasks: GoogleTask[] = [
        {
          id: 'task-1',
          title: 'Activar sistema QR para prueba piloto Tết',
          notes: 'Asegurar interfaz vietnamita lista',
          status: 'needsAction',
          due: new Date(Date.now() + 24 * 3600000).toISOString(),
        },
        {
          id: 'task-2',
          title: 'Revisar Panel Personal - métricas de paz',
          status: 'needsAction',
        },
      ];

      setData((prev) => ({
        ...prev,
        tasks: {
          pending: pendingTasks,
          completed: [],
          lastSync: new Date(),
        },
      }));

      return { pending: pendingTasks, completed: [] };
    } catch (err) {
      console.error('Error sincronizando tareas:', err);
      return { pending: [], completed: [] };
    }
  }, [isAuthenticated]);

  /**
   * Sincronizar archivos recientes de Drive
   */
  const syncDrive = useCallback(async () => {
    if (!isAuthenticated) return { recentFiles: [] };

    try {
      // MOCK DATA
      const recentFiles: DriveFile[] = [
        {
          id: 'file-1',
          name: 'PROTOCOLO_KAIZEN_COMPLETADO.md',
          mimeType: 'text/markdown',
          webViewLink: 'https://drive.google.com/file/d/mock-1',
          modifiedTime: new Date().toISOString(),
        },
      ];

      setData((prev) => ({
        ...prev,
        drive: {
          recentFiles,
          lastSync: new Date(),
        },
      }));

      return { recentFiles };
    } catch (err) {
      console.error('Error sincronizando Drive:', err);
      return { recentFiles: [] };
    }
  }, [isAuthenticated]);

  /**
   * Sincronizar todos los servicios
   */
  const syncAll = useCallback(async () => {
    setIsLoading(true);
    try {
      await Promise.all([syncCalendar(), syncGmail(), syncTasks(), syncDrive()]);
    } finally {
      setIsLoading(false);
    }
  }, [syncCalendar, syncGmail, syncTasks, syncDrive]);

  /**
   * Crear nueva tarea en Google Tasks
   */
  const createTask = useCallback(
    async (title: string, notes?: string, due?: string): Promise<GoogleTask | null> => {
      if (!isAuthenticated) return null;

      try {
        // MOCK: Simular creación de tarea
        const newTask: GoogleTask = {
          id: 'task-' + Date.now(),
          title,
          notes,
          status: 'needsAction',
          due,
        };

        setData((prev) => ({
          ...prev,
          tasks: {
            ...prev.tasks,
            pending: [...prev.tasks.pending, newTask],
          },
        }));

        return newTask;
      } catch (err) {
        console.error('Error creando tarea:', err);
        return null;
      }
    },
    [isAuthenticated]
  );

  /**
   * Generar resumen de reunión con IA
   */
  const generateMeetingSummary = useCallback(
    async (eventId: string): Promise<MeetingSummary | null> => {
      if (!isAuthenticated) return null;

      try {
        const event = data.calendar.today.find((e) => e.id === eventId) ||
                      data.calendar.upcoming.find((e) => e.id === eventId);
        
        if (!event) return null;

        // MOCK: Simular generación de resumen con IA
        const summary: MeetingSummary = {
          eventId: event.id,
          title: event.summary,
          date: event.start.dateTime || event.start.date || '',
          duration: 60, // Calcular real en producción
          attendees: event.attendees?.map((a) => a.email) || [],
          topics: ['Preparación Tết', 'Sistema QR', 'Interfaz vietnamita'],
          decisions: ['Activar prueba piloto mañana', 'Monitorear feedback operarios'],
          actionItems: [
            {
              task: 'Verificar traducciones vietnamita',
              assignee: 'campanerasanti@gmail.com',
              dueDate: new Date(Date.now() + 24 * 3600000).toISOString(),
            },
          ],
          generatedAt: new Date(),
        };

        return summary;
      } catch (err) {
        console.error('Error generando resumen:', err);
        return null;
      }
    },
    [isAuthenticated, data.calendar]
  );

  // Inicializar al montar
  useEffect(() => {
    initializeGoogleClient();
  }, [initializeGoogleClient]);

  // Auto-sync cada 5 minutos si está autenticado
  useEffect(() => {
    if (!isAuthenticated) return;

    const intervalId = setInterval(() => {
      syncAll();
    }, 5 * 60 * 1000); // 5 minutos

    return () => clearInterval(intervalId);
  }, [isAuthenticated, syncAll]);

  return {
    isAuthenticated,
    data,
    isLoading,
    error,
    authenticate,
    syncAll,
    syncCalendar,
    syncGmail,
    syncTasks,
    syncDrive,
    createTask,
    generateMeetingSummary,
  };
};
