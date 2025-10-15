import { create } from 'zustand';
import { SelectedFeature } from '@/types/ogc';

type SelectionState = {
  selected: SelectedFeature | null;
  setSelected: (f: SelectedFeature | null) => void;
  highlightId: string | number | null;
  setHighlightId: (id: string | number | null) => void;
};

export const useSelection = create<SelectionState>((set) => ({
  selected: null,
  setSelected: (f) => set({ selected: f }),
  highlightId: null,
  setHighlightId: (id) => set({ highlightId: id })
}));
