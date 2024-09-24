import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const apiService = {
  getOrders: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/orders`);
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  cancelOrder: async (orderId) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/orders/${orderId}/cancel`);
      return response.data;
    } catch (error) {
      console.error('Error canceling order:', error);
      throw error;
    }
  },

  updateOrderNote: async (orderId, note) => {
    try {
      console.log(`Updating note for order ${orderId} with note: ${note}`); // Debug message
      const response = await axios.put(`${API_BASE_URL}/orders/${orderId}/note`, { note });
      console.log('Note updated:', response.data); // Debug message
      return response.data;
    } catch (error) {
      console.error('Error updating order note:', error);
      throw error;
    }
  }
};

export default apiService;
