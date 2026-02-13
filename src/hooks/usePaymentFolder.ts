/**
 * Hook para leer archivos del folder de pagos en tiempo real
 * Usa File System Access API (requiere permiso del usuario)
 */

import { useState, useEffect } from 'react';
import { parsePaymentDocument, addPaymentRecord } from '../services/gardenMemory';

export interface UnclassifiedDocument {
  fileName: string;
  content: string;
  receivedAt: string;
}

export const usePaymentFolder = () => {
  const [dirHandle, setDirHandle] = useState<FileSystemDirectoryHandle | null>(null);
  const [unclassifiedDocs, setUnclassifiedDocs] = useState<UnclassifiedDocument[]>([]);
  const [isWatching, setIsWatching] = useState(false);

  const requestFolderAccess = async () => {
    try {
      // @ts-ignore - File System Access API
      const handle = await window.showDirectoryPicker({
        mode: 'read',
        startIn: 'desktop',
      });
      setDirHandle(handle);
      setIsWatching(true);
      return handle;
    } catch (e) {
      console.error('Usuario canceló acceso al folder', e);
      return null;
    }
  };

  const scanFolder = async (handle: FileSystemDirectoryHandle) => {
    const newDocs: UnclassifiedDocument[] = [];
    
    try {
      // @ts-ignore - File System Access API
      for await (const entry of handle.values()) {
        if (entry.kind === 'file' && (entry.name.endsWith('.txt') || entry.name.endsWith('.csv'))) {
          const file = await entry.getFile();
          const content = await file.text();
          
          // Intenta parsear automáticamente
          const parsed = parsePaymentDocument(entry.name, content);
          
          if (parsed) {
            // Si se puede parsear, agregar directamente
            addPaymentRecord(parsed);
          } else {
            // Si no, agregar a documentos sin clasificar
            newDocs.push({
              fileName: entry.name,
              content,
              receivedAt: new Date().toISOString(),
            });
          }
        }
      }
      
      setUnclassifiedDocs(newDocs);
    } catch (e) {
      console.error('Error escaneando folder', e);
    }
  };

  useEffect(() => {
    if (!dirHandle || !isWatching) return;

    const interval = setInterval(() => {
      scanFolder(dirHandle);
    }, 10000); // Cada 10 segundos

    // Escaneo inicial
    scanFolder(dirHandle);

    return () => clearInterval(interval);
  }, [dirHandle, isWatching]);

  return {
    requestFolderAccess,
    unclassifiedDocs,
    isWatching,
    stopWatching: () => setIsWatching(false),
  };
};
