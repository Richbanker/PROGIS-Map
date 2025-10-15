import { useEffect, useMemo, useState } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { LayerConfig } from '@/types/ogc';

type Props = {
  layers: LayerConfig[];
  onChange: (layers: LayerConfig[]) => void;
};

export function LayerControl({ layers, onChange }: Props) {
  const [items, setItems] = useState(layers);
  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => setItems(layers), [layers]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
  const ids = useMemo(() => items.map((l) => l.id), [items]);

  const getLayerIcon = (type: string) => {
    switch (type) {
      case 'wms':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        );
      case 'wfs':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
            />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
            />
          </svg>
        );
    }
  };

  return (
    <div className="absolute top-4 left-4 z-[1000] w-80 rounded-xl bg-white/95 backdrop-blur-md shadow-2xl border border-gray-200/50 overflow-hidden transition-all duration-300">
      <div
        className="px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between cursor-pointer select-none"
        onClick={() => setCollapsed(!collapsed)}
      >
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
            />
          </svg>
          <span className="font-semibold text-base">Слои карты</span>
        </div>
        <svg
          className={`w-5 h-5 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {!collapsed && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={(e) => {
            const { active, over } = e;
            if (!over || active.id === over.id) return;
            const oldIndex = items.findIndex((i) => i.id === active.id);
            const newIndex = items.findIndex((i) => i.id === over.id);
            const next = arrayMove(items, oldIndex, newIndex);
            setItems(next);
            onChange(next);
          }}
        >
          <SortableContext items={ids} strategy={verticalListSortingStrategy}>
            <ul className="max-h-96 overflow-y-auto p-3 space-y-2">
              {items.map((l) => (
                <SortableItem key={l.id} id={l.id} visible={l.visible ?? true}>
                  <label className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={l.visible ?? true}
                      onChange={(e) => {
                        const next = items.map((it) =>
                          it.id === l.id ? { ...it, visible: e.target.checked } : it
                        );
                        setItems(next);
                        onChange(next);
                      }}
                      className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 transition-all"
                    />
                    <div
                      className={`p-2 rounded-lg ${l.visible ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'} transition-colors`}
                    >
                      {getLayerIcon(l.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate" title={l.name}>
                        {l.name}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 font-medium">
                          {l.type.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <svg
                      className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </label>
                </SortableItem>
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}

function SortableItem({
  id,
  children,
  visible
}: {
  id: string;
  children: React.ReactNode;
  visible: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id
  });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };
  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`cursor-move rounded-lg border-2 ${isDragging ? 'border-blue-400 shadow-lg' : 'border-transparent'} ${visible ? '' : 'opacity-60'}`}
    >
      {children}
    </li>
  );
}
