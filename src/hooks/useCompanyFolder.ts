/**
 * Hook para conectar con la carpeta raíz de Serendipity Bros
 * Lee toda la estructura y actualiza el corazón de la empresa
 */

import { useState, useEffect, useCallback } from 'react';
import {
  createCompanyDocument,
  addDocumentToHeartbeat,
  loadCompanyHeartbeat,
  saveCompanyHeartbeat,
  dedupeHeartbeat,
  saveCompanyFolderPath,
  getCompanyFolderPath,
  CompanyHeartbeat,
} from '../services/companyHeart';

export const useCompanyFolder = () => {
  const [rootHandle, setRootHandle] = useState<FileSystemDirectoryHandle | null>(null);
  const [heartbeat, setHeartbeat] = useState<CompanyHeartbeat>(loadCompanyHeartbeat);
  const [isConnected, setIsConnected] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState({ current: 0, total: 0 });

  /**
   * Solicita acceso a la carpeta raíz de Serendipity Bros
   */
  const connectToCompanyFolder = async () => {
    try {
      // @ts-ignore - File System Access API
      const handle = await window.showDirectoryPicker({
        mode: 'read',
        startIn: 'desktop',
      });
      
      setRootHandle(handle);
      saveCompanyFolderPath(handle.name);
      setIsConnected(true);
      
      // Iniciar escaneo automático
      await scanCompanyFolder(handle);
      
      return handle;
    } catch (e) {
      console.error('Usuario canceló acceso a carpeta de empresa', e);
      return null;
    }
  };

  const findDirectoryHandle = async (
    handle: FileSystemDirectoryHandle,
    name: string
  ): Promise<FileSystemDirectoryHandle | null> => {
    try {
      // @ts-ignore - File System Access API
      return await handle.getDirectoryHandle(name, { create: false });
    } catch {
      return null;
    }
  };

  const scanPaymentsFolders = async (handle: FileSystemDirectoryHandle, basePath: string) => {
    const pagosDir =
      (await findDirectoryHandle(handle, 'pagos realizados')) ||
      (await findDirectoryHandle(handle, 'pagos_realizados')) ||
      (await findDirectoryHandle(handle, 'Pagos realizados'));

    if (!pagosDir) return;

    const ingresosDir =
      (await findDirectoryHandle(pagosDir, 'ingresos')) ||
      (await findDirectoryHandle(pagosDir, 'Ingresos'));
    const gastosDir =
      (await findDirectoryHandle(pagosDir, 'gastos')) ||
      (await findDirectoryHandle(pagosDir, 'Gastos'));

    if (ingresosDir) {
      await scanCompanyFolder(ingresosDir, 3, `${basePath}/${pagosDir.name}`);
    }

    if (gastosDir) {
      await scanCompanyFolder(gastosDir, 3, `${basePath}/${pagosDir.name}`);
    }
  };

  /**
   * Escanea recursivamente la estructura de carpetas
   */
  const scanCompanyFolder = async (
    handle: FileSystemDirectoryHandle,
    depth = 0,
    pathPrefix = ''
  ) => {
    if (depth > 3) return; // Limitar profundidad para evitar loops

    setIsScanning(true);
    let filesProcessed = 0;
    const currentPath = pathPrefix ? `${pathPrefix}/${handle.name}` : handle.name;

    try {
      // @ts-ignore - File System Access API
      for await (const entry of handle.values()) {
        if (entry.kind === 'directory') {
          await scanCompanyFolder(entry, depth + 1, currentPath);
        } else if (entry.kind === 'file') {
          const fileName = entry.name;
          const ext = fileName.toLowerCase().split('.').pop();
          const file = await entry.getFile();
          const fileModifiedAt = new Date(file.lastModified).toISOString();
          const filePath = `${currentPath}/${fileName}`;

          // Procesar archivos de texto y datos
          if (['txt', 'csv', 'json'].includes(ext || '')) {
            try {
              const content = await file.text();
              const doc = createCompanyDocument(fileName, filePath, content, fileModifiedAt);
              addDocumentToHeartbeat(doc);
              filesProcessed++;
            } catch (e) {
              console.error(`Error leyendo ${fileName}:`, e);
            }
          }
          // Registrar archivos Excel, PDF sin leer contenido
          else if (['xlsx', 'xls', 'pdf', 'docx', 'doc', 'jpg', 'jpeg', 'png'].includes(ext || '')) {
            const doc = createCompanyDocument(fileName, filePath, undefined, fileModifiedAt);
            addDocumentToHeartbeat(doc);
            filesProcessed++;
          }

          setScanProgress(prev => ({ ...prev, current: prev.current + 1 }));
        }
      }

      // Actualizar estado local y depurar duplicados
      const latestHeartbeat = loadCompanyHeartbeat();
      const deduped = dedupeHeartbeat(latestHeartbeat);
      saveCompanyHeartbeat(deduped);
      setHeartbeat(deduped);

    } catch (e) {
      console.error('Error escaneando carpeta de empresa', e);
    } finally {
      setIsScanning(false);
      console.log(`✅ Escaneados ${filesProcessed} documentos`);
    }
  };

  /**
   * Reescanea la carpeta manualmente
   */
  const refreshHeartbeat = useCallback(async () => {
    if (!rootHandle) return;
    await scanCompanyFolder(rootHandle);
  }, [rootHandle]);

  const runOpsGardener = useCallback(async () => {
    let handle = rootHandle;
    if (!handle) {
      handle = await connectToCompanyFolder();
      if (!handle) return false;
    }

    await scanPaymentsFolders(handle, handle.name);
    await scanCompanyFolder(handle);
    return true;
  }, [rootHandle]);

  /**
   * Desconecta de la carpeta
   */
  const disconnectFromCompanyFolder = () => {
    setRootHandle(null);
    setIsConnected(false);
  };

  // Auto-escaneo cada 5 minutos si está conectado
  useEffect(() => {
    if (!rootHandle || !isConnected) return;

    const interval = setInterval(() => {
      refreshHeartbeat();
    }, 5 * 60 * 1000); // 5 minutos

    return () => clearInterval(interval);
  }, [rootHandle, isConnected, refreshHeartbeat]);

  // Cargar heartbeat del localStorage al iniciar
  useEffect(() => {
    const stored = loadCompanyHeartbeat();
    setHeartbeat(stored);
    
    const savedPath = getCompanyFolderPath();
    if (savedPath) {
      setIsConnected(true);
    }
  }, []);

  return {
    heartbeat,
    isConnected,
    isScanning,
    scanProgress,
    connectToCompanyFolder,
    refreshHeartbeat,
    runOpsGardener,
    disconnectFromCompanyFolder,
  };
};
