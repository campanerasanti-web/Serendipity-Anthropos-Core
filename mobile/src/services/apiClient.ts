import axios, { AxiosInstance } from 'axios';
import NetInfo from '@react-native-community/netinfo';

const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';

class MobileApiClient {
  private client: AxiosInstance;
  private isOnline: boolean = true;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'SerendipityMobile/1.0',
      },
    });

    // Monitor network status
    this.setupNetworkMonitor();
  }

  private setupNetworkMonitor() {
    NetInfo.addEventListener((state) => {
      this.isOnline = state.isConnected ?? false;
    });
  }

  async fetchSerendipityDashboard() {
    try {
      if (!this.isOnline) throw new Error('No internet connection');
      const response = await this.client.get('/api/serendipity/dashboard');
      
      if (!response.data) {
        throw new Error('Empty response from dashboard endpoint');
      }
      
      // Verify expected structure
      if (!response.data.financial) {
        console.warn('Dashboard response missing financial data:', response.data);
        throw new Error('Dashboard response structure invalid');
      }
      
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Dashboard fetch failed';
      console.error('Dashboard fetch error:', message, 'Status:', error.response?.status);
      throw new Error(message);
    }
  }

  async fetchMonthlyMetrics() {
    const response = await this.client.get('/api/metrics/monthly');
    return response.data;
  }

  async sendAgentMessage(agentId: string, message: string) {
    const payload = {
      lotId: '00000000-0000-0000-0000-000000000000',
      step: 'garden-chat',
      data: {
        agentId,
        message,
      },
    };
    const response = await this.client.post('/api/assistant/next-step', payload);
    return response.data;
  }

  getClient() {
    return this.client;
  }
}

export const mobileApiClient = new MobileApiClient();
