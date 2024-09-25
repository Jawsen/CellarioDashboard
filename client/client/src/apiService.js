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

  addOrder: async (orderData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/orders`, orderData);
      return response.data;
    } catch (error) {
      console.error('Error adding order:', error);
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
      const response = await axios.put(`${API_BASE_URL}/orders/${orderId}/note`, { note });
      return response.data;  // Ensure you return the updated order data
    } catch (error) {
      console.error('Error updating note:', error);
      throw error; // Re-throw the error for frontend handling
    }
  }
  
};

export default apiService;
