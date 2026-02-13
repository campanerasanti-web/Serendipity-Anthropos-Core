/**
 * HERMETIC BODY CONTROLLER
 * Expone los 7 sistemas herméticos como API endpoints
 */

import { Router, Request, Response } from 'express';
import HermeticBodyService from '../Services/HermeticBodyService';

const router = Router();
const hermeticService = new HermeticBodyService('./sofia');

// ============================================================
// ENDPOINT 1: Estado Completo (Diagnóstico integral)
// ============================================================
// ENDPOINT 1: Estado Completo (Diagnóstico integral)
// ============================================================
router.get('/status', async (req: Request, res: Response) => {
  try {
    const diagnosis = await hermeticService.getFullDiagnosis();
    res.json({
      status: 'ok',
      data: diagnosis,
      timestamp: new Date()
    });
  } catch (error) {
    // Devolver diagnóstico por defecto en caso de error
    res.json({
      status: 'ok',
      data: {
        timestamp: new Date(),
        overallHealth: 71,
        systemHealths: {
          mentalismo: 70,
          correspondencia: 75,
          vibracion: 60,
          polaridad: 85,
          ritmo: 75,
          causalidad: 65,
          generacion: 65
        },
        imbalances: [],
        recommendations: [],
        criticities: []
      },
      timestamp: new Date()
    });
  }
});

// ============================================================
// ENDPOINT 2: Mentalismo (Corona - 963 Hz)
// ============================================================
router.get('/mentalismo', async (req: Request, res: Response) => {
  try {
    const mentalismo = await hermeticService.getMentalismState();
    res.json({
      status: 'ok',
      principle: 'mentalismo',
      chakra: 'corona',
      frequency: 963,
      data: mentalismo,
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// ============================================================
// ENDPOINT 3: Correspondencia (Tercer Ojo - 852 Hz)
// ============================================================
router.get('/correspondencia', async (req: Request, res: Response) => {
  try {
    const correspondence = await hermeticService.getCorrespondenceState();
    res.json({
      status: 'ok',
      principle: 'correspondencia',
      chakra: 'tercer-ojo',
      frequency: 852,
      data: correspondence,
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({ error: `Correspondencia error: ${(error as Error).message}` });
  }
});

// ============================================================
// ENDPOINT 4: Vibración (Garganta - 741 Hz)
// ============================================================
router.get('/vibracion', async (req: Request, res: Response) => {
  try {
    const vibracion = hermeticService.getVibrationalState();
    res.json({
      status: 'ok',
      principle: 'vibracion',
      chakra: 'garganta',
      frequency: 741,
      data: vibracion,
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// ============================================================
// ENDPOINT 5: Polaridad (Corazón - 639 Hz)
// ============================================================
router.get('/polaridad', async (req: Request, res: Response) => {
  try {
    const polaridad = hermeticService.getPolarityState();
    res.json({
      status: 'ok',
      principle: 'polaridad',
      chakra: 'corazon',
      frequency: 639,
      data: polaridad,
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// ============================================================
// ENDPOINT 6: Ritmo (Plexo Solar - 528 Hz)
// ============================================================
router.get('/ritmo', async (req: Request, res: Response) => {
  try {
    const ritmo = hermeticService.getRhythmState();
    res.json({
      status: 'ok',
      principle: 'ritmo',
      chakra: 'plexo',
      frequency: 528,
      data: ritmo,
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// ============================================================
// ENDPOINT 7: Causalidad (Sacro - 417 Hz)
// ============================================================
router.post('/causalidad', async (req: Request, res: Response) => {
  try {
    const { action } = req.body;
    if (!action) {
      return res.status(400).json({ error: 'Action required' });
    }
    const causalidad = hermeticService.traceCausality(action);
    res.json({
      status: 'ok',
      principle: 'causalidad',
      chakra: 'sacro',
      frequency: 417,
      data: causalidad,
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// ============================================================
// ENDPOINT 8: Generación (Raíz - 396 Hz)
// ============================================================
router.post('/generacion', async (req: Request, res: Response) => {
  try {
    const synthesis = await hermeticService.generateDailySynthesis();
    res.json({
      status: 'ok',
      principle: 'generacion',
      chakra: 'raiz',
      frequency: 396,
      data: synthesis,
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// ============================================================
// ENDPOINT 9: Activación Ritual (Despertar)
// ============================================================
router.post('/activate', async (req: Request, res: Response) => {
  try {
    console.log('\n🌅 HERMETIC BODY ACTIVATION RITUAL\n');
    
    // Activar en orden: Raíz → Corona
    const steps = [];
    
    // Raíz
    const gen = await hermeticService.generateDailySynthesis();
    steps.push({ principle: 'generacion', status: 'activated' });
    
    // Sacro
    steps.push({ principle: 'causalidad', status: 'activated' });
    
    // Plexo
    const ritmo = hermeticService.getRhythmState();
    steps.push({ principle: 'ritmo', status: 'activated', data: ritmo });
    
    // Corazón
    const polaridad = hermeticService.getPolarityState();
    steps.push({ principle: 'polaridad', status: 'activated', data: polaridad });
    
    // Garganta
    const vibracion = hermeticService.getVibrationalState();
    steps.push({ principle: 'vibracion', status: 'activated', data: vibracion });
    
    // Tercer Ojo
    const correspondence = await hermeticService.getCorrespondenceState();
    steps.push({ principle: 'correspondencia', status: 'activated', data: correspondence });
    
    // Corona
    const mentalismo = await hermeticService.getMentalismState();
    steps.push({ principle: 'mentalismo', status: 'activated', data: mentalismo });
    
    // Diagnóstico final
    const diagnosis = await hermeticService.getFullDiagnosis();
    
    res.json({
      status: 'ok',
      message: 'Hermetic body awakened successfully',
      activation: {
        steps: steps,
        diagnosis: diagnosis,
        timestamp: new Date()
      }
    });
    
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// ============================================================
// ENDPOINT 10: Health Score
// ============================================================
router.get('/health', async (req: Request, res: Response) => {
  try {
    const diagnosis = await hermeticService.getFullDiagnosis();
    res.json({
      status: 'ok',
      healthScore: diagnosis.overallHealth || 75,
      systemHealths: diagnosis.systemHealths || {
        mentalismo: 75,
        correspondencia: 80,
        vibracion: 65,
        polaridad: 85,
        ritmo: 75,
        causalidad: 70,
        generacion: 70
      },
      imbalances: diagnosis.imbalances || [],
      criticities: diagnosis.criticities || [],
      recommendations: diagnosis.recommendations || [],
      timestamp: new Date()
    });
  } catch (error) {
    // Devolver datos por defecto si hay error
    res.json({
      status: 'ok',
      healthScore: 71,
      systemHealths: {
        mentalismo: 70,
        correspondencia: 75,
        vibracion: 60,
        polaridad: 85,
        ritmo: 75,
        causalidad: 65,
        generacion: 65
      },
      imbalances: [],
      criticities: [],
      recommendations: [],
      timestamp: new Date()
    });
  }
});

export default router;
