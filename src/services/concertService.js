import api from './api';

export const concertService = {
  getConcerts: (params) => api.get('/concerts', { params }),
  getConcertBySlug: (slug) => api.get(`/concerts/${slug}`),
  getSeats: (id) => api.get(`/concerts/${id}/seats`),
};
