/**
 * INDICADOR DE ESTADO OFFLINE/ONLINE
 * Muestra el estado de conexión y progreso de sincronización
 * 
 * "La luz fluye incluso en la oscuridad de la desconexión"
 */

import React from 'react';
import { useOfflineSync } from '../hooks/useOfflineSync';
import { useI18n } from '../i18n/I18nContext';

export const OfflineIndicator: React.FC = () => {
  const {
    isOnline,
    isSyncing,
    lastSyncTime,
    getSyncStats,
    syncPendingChanges,
    retryFailedSyncs,
  } = useOfflineSync();

  const { language } = useI18n();
  const stats = getSyncStats();

  // No mostrar nada si está online y no hay pendientes
  if (isOnline && stats.pending === 0 && stats.errors === 0) {
    return null;
  }

  const formatLastSync = () => {
    if (!lastSyncTime) return language === 'es' ? 'Nunca' : language === 'vi' ? 'Chưa bao giờ' : 'Never';

    const now = new Date();
    const diff = now.getTime() - lastSyncTime.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return language === 'es' ? 'Hace un momento' : language === 'vi' ? 'Vừa xong' : 'Just now';
    if (minutes < 60) return `${minutes}${language === 'es' ? ' min' : language === 'vi' ? ' phút' : ' min'}`;
    
    const hours = Math.floor(minutes / 60);
    return `${hours}${language === 'es' ? ' h' : language === 'vi' ? ' giờ' : ' h'}`;
  };

  return (
    <div className={`offline-indicator ${isOnline ? 'online' : 'offline'}`}>
      <div className="offline-status">
        {isOnline ? (
          <>
            <span className="status-icon online">✓</span>
            <span className="status-text">
              {language === 'es' ? 'En línea' : language === 'vi' ? 'Trực tuyến' : 'Online'}
            </span>
          </>
        ) : (
          <>
            <span className="status-icon offline">📵</span>
            <span className="status-text">
              {language === 'es' ? 'Sin conexión' : language === 'vi' ? 'Ngoại tuyến' : 'Offline'}
            </span>
          </>
        )}
      </div>

      {/* Información de sincronización */}
      {(stats.pending > 0 || stats.errors > 0) && (
        <div className="sync-info">
          {isSyncing && (
            <div className="syncing">
              <span className="spinner">⟳</span>
              <span className="text">
                {language === 'es' ? 'Sincronizando...' : language === 'vi' ? 'Đang đồng bộ...' : 'Syncing...'}
              </span>
            </div>
          )}

          {stats.pending > 0 && !isSyncing && (
            <div className="pending">
              <span className="count">{stats.pending}</span>
              <span className="text">
                {language === 'es' ? 'pendientes' : language === 'vi' ? 'chờ xử lý' : 'pending'}
              </span>
            </div>
          )}

          {stats.errors > 0 && (
            <div className="errors">
              <span className="count">{stats.errors}</span>
              <span className="text">
                {language === 'es' ? 'errores' : language === 'vi' ? 'lỗi' : 'errors'}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Última sincronización */}
      {lastSyncTime && (
        <div className="last-sync">
          {language === 'es' ? 'Última sync: ' : language === 'vi' ? 'Đồng bộ cuối: ' : 'Last sync: '}
          {formatLastSync()}
        </div>
      )}

      {/* Botones de acción */}
      <div className="sync-actions">
        {stats.pending > 0 && isOnline && !isSyncing && (
          <button className="sync-now-btn" onClick={syncPendingChanges}>
            {language === 'es' ? '🔄 Sincronizar ahora' : language === 'vi' ? '🔄 Đồng bộ ngay' : '🔄 Sync now'}
          </button>
        )}

        {stats.errors > 0 && isOnline && !isSyncing && (
          <button className="retry-btn" onClick={retryFailedSyncs}>
            {language === 'es' ? '🔁 Reintentar' : language === 'vi' ? '🔁 Thử lại' : '🔁 Retry'}
          </button>
        )}
      </div>

      {/* Modo offline advertencia */}
      {!isOnline && (
        <div className="offline-warning">
          <p>
            {language === 'es'
              ? 'Trabajando sin conexión. Los cambios se sincronizarán automáticamente.'
              : language === 'vi'
              ? 'Làm việc ngoại tuyến. Thay đổi sẽ tự động đồng bộ.'
              : 'Working offline. Changes will sync automatically.'}
          </p>
        </div>
      )}
    </div>
  );
};

/**
 * Indicador compacto en header
 */
export const OfflineIndicatorCompact: React.FC = () => {
  const { isOnline, getSyncStats } = useOfflineSync();
  const stats = getSyncStats();

  return (
    <div className={`offline-indicator-compact ${isOnline ? 'online' : 'offline'}`}>
      {isOnline ? (
        <span className="status-dot online" title="Online">●</span>
      ) : (
        <span className="status-dot offline" title="Offline">●</span>
      )}
      {stats.pending > 0 && (
        <span className="pending-badge" title={`${stats.pending} pending syncs`}>
          {stats.pending}
        </span>
      )}
    </div>
  );
};
