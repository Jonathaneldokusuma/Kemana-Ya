import { expect, it } from 'vitest';
import { hasCoordinates, mapUrl } from './spotStorage';

it('accepts zero coordinates and rejects missing, partial or invalid points', () => {
  expect(hasCoordinates({ latitude: 0, longitude: 0 })).toBe(true);
  for (const point of [{}, { latitude: null, longitude: null }, { latitude: '', longitude: '' }, { latitude: 1 }, { latitude: 91, longitude: 0 }, { latitude: 0, longitude: -181 }, { latitude: 'x', longitude: 1 }]) expect(hasCoordinates(point)).toBe(false);
});

it('uses the saved pin for map links and falls back to an encoded place search', () => {
  expect(new URL(mapUrl({ latitude: -6.9, longitude: 107.6 })).searchParams.get('query')).toBe('-6.9,107.6');
  expect(new URL(mapUrl({ name: 'Kafe & taman', location: 'Bandung' })).searchParams.get('query')).toBe('Kafe & taman, Bandung');
});
