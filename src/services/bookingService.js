import api from './api';

export const bookingService = {
  // Get user's bookings
  getMyBookings: () => api.get('/bookings/my'),

  // Get booking by ID
  getBookingById: (id) => api.get(`/bookings/${id}`),

  // Create new booking
  createBooking: (data) => api.post('/bookings', data),

  // Cancel booking
  cancelBooking: (id) => api.delete(`/bookings/${id}`),
};
