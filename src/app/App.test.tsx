import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { App } from './App';

describe('App', () => {
  it('renders map container', () => {
    const { container } = render(<App />);
    const map = container.querySelector('.leaflet-container');
    expect(map).toBeTruthy();
  });
});
