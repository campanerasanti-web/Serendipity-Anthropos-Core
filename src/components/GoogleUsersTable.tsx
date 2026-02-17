import React, { useEffect, useState, useMemo } from 'react';
import { exportToExcel } from '../utils/exportManager';
import styles from './GoogleUsersTable.module.css';

interface GoogleUser {
  Id: number;
  GoogleId: string;
  Email: string;
  Name?: string;
  Picture?: string;
  CreatedAt: string;
}

interface Props {
  fetchUrl?: string; // default: /api/google-workspace/google-users
}

const PAGE_SIZE = 10;

export const GoogleUsersTable: React.FC<Props> = ({ fetchUrl = '/api/google-workspace/google-users' }) => {
  const [users, setUsers] = useState<GoogleUser[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(fetchUrl)
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Error al cargar usuarios');
        setLoading(false);
      });
  }, [fetchUrl]);

  // Filtro y paginación
  const filtered = useMemo(() => {
    return users.filter(u =>
      u.Email.toLowerCase().includes(search.toLowerCase()) ||
      (u.Name?.toLowerCase().includes(search.toLowerCase()) ?? false)
    );
  }, [users, search]);

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  // Export helpers
  const handleExportExcel = () => {
    // Export as Excel: users as a sheet
    const sheetData = [
      ['Id', 'GoogleId', 'Email', 'Name', 'Picture', 'CreatedAt'],
      ...users.map(u => [u.Id, u.GoogleId, u.Email, u.Name ?? '', u.Picture ?? '', u.CreatedAt])
    ];
    // Reutiliza exportToExcel pero solo con metrics para evitar error de tipado
    exportToExcel({
      stats: {}, metrics: sheetData, invoices: [], fixedCosts: [], fileName: 'GoogleUsers'
    });
  };
  const handleExportCSV = () => {
    const headers = 'Id,GoogleId,Email,Name,Picture,CreatedAt\n';
    const rows = users.map(u =>
      `${u.Id},${u.GoogleId},${u.Email},${u.Name ?? ''},${u.Picture ?? ''},${u.CreatedAt}`
    ).join('\n');
    const csv = headers + rows;
    const link = document.createElement('a');
    link.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    link.download = `GoogleUsers-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className={styles['google-users-table-section']}>
      <h2>Usuarios autenticados con Google</h2>
      <div className={styles['google-users-table-controls']}>
        <input
          type="text"
          placeholder="Buscar por email o nombre..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          className={styles['input']}
        />
        <button onClick={handleExportExcel}>Exportar Excel</button>
        <button onClick={handleExportCSV}>Exportar CSV</button>
      </div>
      {loading ? <div>Cargando...</div> : error ? <div className={styles['error']}>{error}</div> : (
        <>
          <table className={styles['google-users-table']}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Google ID</th>
                <th>Email</th>
                <th>Nombre</th>
                <th>Foto</th>
                <th>Creado</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(u => (
                <tr key={u.Id}>
                  <td>{u.Id}</td>
                  <td>{u.GoogleId}</td>
                  <td>{u.Email}</td>
                  <td>{u.Name}</td>
                  <td>{u.Picture ? <img src={u.Picture} alt="pic" className={styles['img']} /> : '-'}</td>
                  <td>{new Date(u.CreatedAt).toLocaleString('es-ES')}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Paginación */}
          <div className={styles['google-users-pagination']}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Anterior</button>
            <span>Página {page} de {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Siguiente</button>
          </div>
        </>
      )}
    </div>
  );
};

export default GoogleUsersTable;
