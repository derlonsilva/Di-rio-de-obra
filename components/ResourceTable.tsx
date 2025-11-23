import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { ResourceItem } from '../types';

interface ResourceTableProps {
  title: string;
  items: ResourceItem[];
  onUpdate: (items: ResourceItem[]) => void;
  type: 'labor' | 'equipment';
}

const ResourceTable: React.FC<ResourceTableProps> = ({ title, items, onUpdate, type }) => {
  const addItem = () => {
    const newItem: ResourceItem = {
      id: crypto.randomUUID(),
      name: '',
      quantity: 0,
    };
    onUpdate([...items, newItem]);
  };

  const updateItem = (id: string, field: keyof ResourceItem, value: string | number) => {
    const updated = items.map((item) => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    });
    onUpdate(updated);
  };

  const removeItem = (id: string) => {
    onUpdate(items.filter((item) => item.id !== id));
  };

  return (
    <div className="flex flex-col h-full border border-gray-300 bg-white">
      {/* Header */}
      <div className="bg-gray-200 px-3 py-2 border-b border-gray-300 flex justify-between items-center">
        <h3 className="font-bold text-gray-700 text-sm uppercase">{title}</h3>
        <button
          onClick={addItem}
          className="no-print bg-blue-600 hover:bg-blue-700 text-white p-1 rounded transition-colors"
          title="Adicionar Linha"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-[1fr_80px_40px] gap-2 px-3 py-1 bg-gray-100 border-b border-gray-200 text-xs font-semibold text-gray-600">
        <div>{type === 'labor' ? 'FUNÇÃO / CARGO' : 'DESCRIÇÃO'}</div>
        <div className="text-center">QTDE</div>
        <div className="no-print"></div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-auto min-h-[150px]">
        {items.length === 0 && (
          <div className="p-4 text-center text-gray-400 text-sm italic">
            Nenhum item adicionado.
          </div>
        )}
        {items.map((item) => (
          <div key={item.id} className="grid grid-cols-[1fr_80px_40px] gap-2 px-3 py-2 border-b border-gray-100 last:border-0 hover:bg-gray-50 items-center group">
            <input
              type="text"
              value={item.name}
              onChange={(e) => updateItem(item.id, 'name', e.target.value)}
              placeholder={type === 'labor' ? 'Ex: Pedreiro' : 'Ex: Betoneira'}
              className="w-full bg-transparent border-b border-transparent focus:border-blue-400 focus:outline-none text-sm text-gray-800 placeholder-gray-300"
            />
            <input
              type="number"
              value={item.quantity === 0 ? '' : item.quantity}
              onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
              placeholder="0"
              className="w-full text-center bg-transparent border-b border-transparent focus:border-blue-400 focus:outline-none text-sm text-gray-800 font-medium"
            />
            <button
              onClick={() => removeItem(item.id)}
              className="no-print text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
      
      {/* Footer Total */}
      <div className="bg-gray-50 px-3 py-2 border-t border-gray-300 text-xs text-gray-500 font-medium flex justify-between">
        <span>TOTAL DE ITENS</span>
        <span>{items.reduce((acc, curr) => acc + curr.quantity, 0)}</span>
      </div>
    </div>
  );
};

export default ResourceTable;
