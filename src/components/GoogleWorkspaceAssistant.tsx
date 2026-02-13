/**
 * COMPONENTE: GOOGLE WORKSPACE ASSISTANT
 * 
 * Panel de asistencia integrado con Google Calendar, Gmail, Tasks y Drive
 * Muestra eventos, tareas y permite generar resúmenes de reuniones con IA
 */

import React, { useEffect, useState } from 'react';
import { useGoogleWorkspace, MeetingSummary } from '../hooks/useGoogleWorkspace';

export const GoogleWorkspaceAssistant: React.FC = () => {
  const {
    isAuthenticated,
    data,
    isLoading,
    error,
    authenticate,
    syncAll,
    createTask,
    generateMeetingSummary,
  } = useGoogleWorkspace();

  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [meetingSummary, setMeetingSummary] = useState<MeetingSummary | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [showTaskForm, setShowTaskForm] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      syncAll();
    }
  }, [isAuthenticated, syncAll]);

  const handleGenerateSummary = async (eventId: string) => {
    const summary = await generateMeetingSummary(eventId);
    if (summary) {
      setMeetingSummary(summary);
      setSelectedEvent(eventId);
    }
  };

  const handleCreateTask = async () => {
    if (!newTaskTitle.trim()) return;
    
    const task = await createTask(newTaskTitle);
    if (task) {
      setNewTaskTitle('');
      setShowTaskForm(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="google-workspace-assistant">
        <div className="auth-required">
          <div className="auth-icon">📧</div>
          <h3>Conecta tu Google Workspace</h3>
          <p>Accede a tu calendario, emails, tareas y documentos directamente desde aquí.</p>
          <p className="email-hint">Cuenta: <strong>campanerasanti@gmail.com</strong></p>
          <button className="auth-btn" onClick={authenticate} disabled={isLoading}>
            {isLoading ? '🔄 Conectando...' : '🔐 Conectar con Google'}
          </button>
          {error && <div className="error-message">{error}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="google-workspace-assistant">
      {/* Header */}
      <div className="workspace-header">
        <h2>📧 Google Workspace Assistant</h2>
        <div className="sync-info">
          <button className="sync-btn" onClick={syncAll} disabled={isLoading}>
            {isLoading ? '🔄 Sincronizando...' : '🔄 Sincronizar'}
          </button>
          {data.calendar.lastSync && (
            <span className="last-sync">
              Última sync: {new Date(data.calendar.lastSync).toLocaleTimeString('es-ES')}
            </span>
          )}
        </div>
      </div>

      <div className="workspace-grid">
        {/* Calendario */}
        <section className="calendar-section">
          <h3>📅 Calendario</h3>
          
          <div className="events-today">
            <h4>Hoy</h4>
            {data.calendar.today.length === 0 ? (
              <p className="empty-state">No hay eventos para hoy</p>
            ) : (
              data.calendar.today.map((event) => (
                <div key={event.id} className="event-card">
                  <div className="event-time">
                    {event.start.dateTime &&
                      new Date(event.start.dateTime).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                  </div>
                  <div className="event-details">
                    <div className="event-title">{event.summary}</div>
                    {event.description && (
                      <div className="event-description">{event.description}</div>
                    )}
                    {event.location && (
                      <div className="event-location">📍 {event.location}</div>
                    )}
                    {event.attendees && event.attendees.length > 1 && (
                      <div className="event-attendees">
                        👥 {event.attendees.length} asistentes
                      </div>
                    )}
                  </div>
                  <button
                    className="summary-btn"
                    onClick={() => handleGenerateSummary(event.id)}
                  >
                    ✨ Resumen IA
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="events-upcoming">
            <h4>Próximos</h4>
            {data.calendar.upcoming.length === 0 ? (
              <p className="empty-state">Sin eventos próximos</p>
            ) : (
              data.calendar.upcoming.map((event) => (
                <div key={event.id} className="event-card upcoming">
                  <div className="event-date">
                    {event.start.dateTime &&
                      new Date(event.start.dateTime).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'short',
                      })}
                  </div>
                  <div className="event-details">
                    <div className="event-title">{event.summary}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Tareas */}
        <section className="tasks-section">
          <div className="section-header">
            <h3>✅ Tareas</h3>
            <button
              className="add-task-btn"
              onClick={() => setShowTaskForm(!showTaskForm)}
            >
              + Nueva
            </button>
          </div>

          {showTaskForm && (
            <div className="task-form">
              <input
                type="text"
                placeholder="Título de la tarea..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateTask()}
              />
              <div className="form-actions">
                <button className="save-btn" onClick={handleCreateTask}>
                  Guardar
                </button>
                <button className="cancel-btn" onClick={() => setShowTaskForm(false)}>
                  Cancelar
                </button>
              </div>
            </div>
          )}

          <div className="tasks-list">
            {data.tasks.pending.length === 0 ? (
              <p className="empty-state">No hay tareas pendientes</p>
            ) : (
              data.tasks.pending.map((task) => (
                <div key={task.id} className="task-card">
                  <input type="checkbox" className="task-checkbox" />
                  <div className="task-content">
                    <div className="task-title">{task.title}</div>
                    {task.notes && <div className="task-notes">{task.notes}</div>}
                    {task.due && (
                      <div className="task-due">
                        ⏰ {new Date(task.due).toLocaleDateString('es-ES')}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Email */}
        <section className="email-section">
          <h3>
            📨 Email{' '}
            {data.email.unread > 0 && (
              <span className="unread-badge">{data.email.unread} sin leer</span>
            )}
          </h3>
          <div className="email-list">
            {data.email.recent.length === 0 ? (
              <p className="empty-state">No hay emails recientes</p>
            ) : (
              data.email.recent.map((message) => {
                const from = message.payload.headers.find((h) => h.name === 'From')?.value;
                const subject = message.payload.headers.find((h) => h.name === 'Subject')?.value;
                const isUnread = message.labelIds.includes('UNREAD');

                return (
                  <div key={message.id} className={`email-card ${isUnread ? 'unread' : ''}`}>
                    <div className="email-from">{from}</div>
                    <div className="email-subject">{subject}</div>
                    <div className="email-snippet">{message.snippet}</div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* Drive */}
        <section className="drive-section">
          <h3>📂 Drive - Archivos Recientes</h3>
          <div className="files-list">
            {data.drive.recentFiles.length === 0 ? (
              <p className="empty-state">No hay archivos recientes</p>
            ) : (
              data.drive.recentFiles.map((file) => (
                <a
                  key={file.id}
                  href={file.webViewLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="file-card"
                >
                  <div className="file-icon">
                    {file.mimeType.includes('document') && '📄'}
                    {file.mimeType.includes('spreadsheet') && '📊'}
                    {file.mimeType.includes('presentation') && '📽️'}
                    {file.mimeType === 'text/markdown' && '📝'}
                  </div>
                  <div className="file-details">
                    <div className="file-name">{file.name}</div>
                    <div className="file-modified">
                      {new Date(file.modifiedTime).toLocaleDateString('es-ES')}
                    </div>
                  </div>
                </a>
              ))
            )}
          </div>
        </section>
      </div>

      {/* Modal de resumen de reunión */}
      {meetingSummary && (
        <div className="meeting-summary-modal" onClick={() => setMeetingSummary(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setMeetingSummary(null)}>
              ✕
            </button>
            <h3>✨ Resumen de Reunión (IA)</h3>
            <div className="summary-header">
              <div className="summary-title">{meetingSummary.title}</div>
              <div className="summary-meta">
                {new Date(meetingSummary.date).toLocaleString('es-ES')} · {meetingSummary.duration}
                min
              </div>
            </div>

            {meetingSummary.topics && meetingSummary.topics.length > 0 && (
              <div className="summary-section">
                <h4>📌 Temas Discutidos</h4>
                <ul>
                  {meetingSummary.topics.map((topic, i) => (
                    <li key={i}>{topic}</li>
                  ))}
                </ul>
              </div>
            )}

            {meetingSummary.decisions && meetingSummary.decisions.length > 0 && (
              <div className="summary-section">
                <h4>✅ Decisiones</h4>
                <ul>
                  {meetingSummary.decisions.map((decision, i) => (
                    <li key={i}>{decision}</li>
                  ))}
                </ul>
              </div>
            )}

            {meetingSummary.actionItems && meetingSummary.actionItems.length > 0 && (
              <div className="summary-section">
                <h4>📋 Acciones Pendientes</h4>
                {meetingSummary.actionItems.map((item, i) => (
                  <div key={i} className="action-item">
                    <div className="action-task">{item.task}</div>
                    <div className="action-meta">
                      Asignado: {item.assignee}
                      {item.dueDate && (
                        <> · Vence: {new Date(item.dueDate).toLocaleDateString('es-ES')}</>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="summary-footer">
              <small>
                Generado por IA el {meetingSummary.generatedAt.toLocaleString('es-ES')}
              </small>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
