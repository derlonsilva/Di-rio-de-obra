import React, { useState, useCallback, useEffect } from 'react';
import { RDOData, WeatherCondition, SavedProject } from './types';
import WeatherSelector from './components/WeatherSelector';
import ResourceTable from './components/ResourceTable';
import PhotoGallery from './components/PhotoGallery';
import { generateDailySummary } from './services/geminiService';
import { Printer, Sparkles, FileText, Save, FolderOpen, Trash2 } from 'lucide-react';

const App: React.FC = () => {
  const [data, setData] = useState<RDOData>({
    project: {
      name: '',
      address: '',
      contract: '',
      startDate: '',
      deadline: '',
      techResp: '',
      crea: '',
      art: '',
      date: new Date().toISOString().split('T')[0],
      client: '',
    },
    weather: {
      morning: null,
      afternoon: null,
    },
    labor: [
      { id: '1', name: 'Pedreiro', quantity: 0 },
      { id: '2', name: 'Servente', quantity: 0 },
      { id: '3', name: 'Mestre de Obras', quantity: 0 },
    ],
    equipment: [],
    photos: [],
    aiSummary: '',
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');

  useEffect(() => {
    const saved = localStorage.getItem('rdo_saved_projects');
    if (saved) {
      try {
        setSavedProjects(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved projects", e);
      }
    }
  }, []);

  const handleSaveProject = () => {
    const name = prompt("Digite um nome para salvar este cadastro de obra (Ex: Obra Centro):");
    if (!name) return;

    const newProject: SavedProject = {
      id: crypto.randomUUID(),
      name,
      data: data.project
    };

    const updatedProjects = [...savedProjects, newProject];
    setSavedProjects(updatedProjects);
    localStorage.setItem('rdo_saved_projects', JSON.stringify(updatedProjects));
    setSelectedProjectId(newProject.id);
    alert("Cadastro de obra salvo com sucesso!");
  };

  const handleLoadProject = (id: string) => {
    const project = savedProjects.find(p => p.id === id);
    if (project) {
      setData(prev => ({
        ...prev,
        project: {
          ...project.data,
          date: prev.project.date // Preserve current date
        }
      }));
      setSelectedProjectId(id);
    }
  };

  const handleDeleteProject = () => {
    if (!selectedProjectId) return;
    if (confirm("Tem certeza que deseja excluir este cadastro?")) {
      const updatedProjects = savedProjects.filter(p => p.id !== selectedProjectId);
      setSavedProjects(updatedProjects);
      localStorage.setItem('rdo_saved_projects', JSON.stringify(updatedProjects));
      setSelectedProjectId('');
    }
  };

  // Handlers
  const handleProjectChange = (field: keyof typeof data.project, value: string) => {
    setData((prev) => ({ ...prev, project: { ...prev.project, [field]: value } }));
  };

  const handleWeatherChange = (period: 'morning' | 'afternoon', value: WeatherCondition) => {
    setData((prev) => ({ ...prev, weather: { ...prev.weather, [period]: value } }));
  };

  const handleAiGenerate = async () => {
    setIsGenerating(true);
    const summary = await generateDailySummary(data);
    setData((prev) => ({ ...prev, aiSummary: summary }));
    setIsGenerating(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen pb-12 print:pb-0">
      {/* Navbar / Controls (Hidden on Print) */}
      <nav className="no-print bg-slate-800 text-white p-4 shadow-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <FileText className="text-blue-400" />
            <h1 className="text-xl font-bold tracking-tight">RDO Digital</h1>
          </div>
          <div className="flex items-center gap-3">
             <button
              onClick={handleAiGenerate}
              disabled={isGenerating}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded font-medium transition-colors disabled:opacity-70 text-sm"
            >
              <Sparkles size={16} />
              {isGenerating ? 'Gerando...' : 'Gerar Resumo IA'}
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-white text-slate-900 hover:bg-gray-100 px-4 py-2 rounded font-medium transition-colors text-sm"
            >
              <Printer size={16} />
              Imprimir / PDF
            </button>
          </div>
        </div>
      </nav>

      {/* Main Report Document */}
      <main className="max-w-5xl mx-auto mt-6 print:mt-0 bg-white shadow-lg print:shadow-none print-shadow-none print:w-full print:max-w-none">
        
        {/* Header Section */}
        <header className="bg-gray-200 border-b border-gray-300 p-4 text-center">
          <h2 className="text-xl font-black text-gray-700 uppercase tracking-wide">Relatório Diário de Obra (RDO)</h2>
        </header>

        {/* Saved Projects Controls */}
        <div className="no-print bg-gray-50 px-6 py-3 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 w-full sm:w-auto">
                <FolderOpen size={18} className="text-gray-500" />
                <select 
                    value={selectedProjectId}
                    onChange={(e) => handleLoadProject(e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1.5 text-sm w-full sm:w-64 focus:border-gray-400 outline-none bg-white text-gray-700"
                >
                    <option value="" disabled>Selecione uma obra cadastrada...</option>
                    {savedProjects.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                </select>
                {selectedProjectId && (
                    <button 
                        onClick={handleDeleteProject}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        title="Excluir cadastro"
                    >
                        <Trash2 size={16} />
                    </button>
                )}
            </div>
            <button 
                onClick={handleSaveProject}
                className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 px-3 py-1.5 rounded text-sm font-medium transition-colors shadow-sm w-full sm:w-auto justify-center"
            >
                <Save size={16} />
                Salvar Obra Atual como Modelo
            </button>
        </div>

        {/* Project Info Form Grid */}
        <section className="p-6 grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-4 border-b border-gray-300">
          
          <div className="md:col-span-3 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <label className="w-24 font-bold text-gray-600 text-xs uppercase">Obra:</label>
              <input 
                type="text" 
                value={data.project.name}
                onChange={(e) => handleProjectChange('name', e.target.value)}
                className="flex-1 border-b border-gray-300 focus:border-blue-500 bg-transparent outline-none px-1 py-0.5 text-gray-800 font-medium"
              />
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <label className="w-24 font-bold text-gray-600 text-xs uppercase">Endereço:</label>
              <input 
                type="text" 
                value={data.project.address}
                onChange={(e) => handleProjectChange('address', e.target.value)}
                className="flex-1 border-b border-gray-300 focus:border-blue-500 bg-transparent outline-none px-1 py-0.5 text-gray-800"
              />
            </div>
          </div>

          <div className="md:col-span-1 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center gap-2">
               <label className="font-bold text-gray-600 text-xs uppercase">Nº:</label>
               <div className="text-gray-400 text-sm italic">Auto-gerado</div>
            </div>
             <div className="flex flex-col md:flex-row md:items-center gap-2">
              <label className="font-bold text-gray-600 text-xs uppercase">Data:</label>
              <input 
                type="date" 
                value={data.project.date}
                onChange={(e) => handleProjectChange('date', e.target.value)}
                className="flex-1 border-b border-gray-300 focus:border-blue-500 bg-transparent outline-none px-1 py-0.5 text-gray-800 text-sm"
              />
            </div>
          </div>

          <div className="md:col-span-4 h-px bg-gray-200 my-2"></div>

          <div className="md:col-span-2 space-y-4">
             <div className="flex flex-col md:flex-row md:items-center gap-2">
              <label className="w-24 font-bold text-gray-600 text-xs uppercase">Contrato:</label>
              <input 
                type="text" 
                value={data.project.contract}
                onChange={(e) => handleProjectChange('contract', e.target.value)}
                className="flex-1 border-b border-gray-300 focus:border-blue-500 bg-transparent outline-none px-1 py-0.5 text-gray-800"
              />
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <label className="w-24 font-bold text-gray-600 text-xs uppercase">Início:</label>
              <input 
                type="date" 
                value={data.project.startDate}
                onChange={(e) => handleProjectChange('startDate', e.target.value)}
                className="flex-1 border-b border-gray-300 focus:border-blue-500 bg-transparent outline-none px-1 py-0.5 text-gray-800 text-sm"
              />
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <label className="w-24 font-bold text-gray-600 text-xs uppercase">Prazo:</label>
              <input 
                type="text" 
                value={data.project.deadline}
                onChange={(e) => handleProjectChange('deadline', e.target.value)}
                placeholder="Ex: 12 Meses"
                className="flex-1 border-b border-gray-300 focus:border-blue-500 bg-transparent outline-none px-1 py-0.5 text-gray-800"
              />
            </div>
          </div>

          <div className="md:col-span-2 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <label className="w-32 font-bold text-gray-600 text-xs uppercase">Resp. Técnico:</label>
              <input 
                type="text" 
                value={data.project.techResp}
                onChange={(e) => handleProjectChange('techResp', e.target.value)}
                className="flex-1 border-b border-gray-300 focus:border-blue-500 bg-transparent outline-none px-1 py-0.5 text-gray-800"
              />
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <label className="w-32 font-bold text-gray-600 text-xs uppercase">CREA:</label>
              <input 
                type="text" 
                value={data.project.crea}
                onChange={(e) => handleProjectChange('crea', e.target.value)}
                className="flex-1 border-b border-gray-300 focus:border-blue-500 bg-transparent outline-none px-1 py-0.5 text-gray-800"
              />
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <label className="w-32 font-bold text-gray-600 text-xs uppercase">ART:</label>
              <input 
                type="text" 
                value={data.project.art}
                onChange={(e) => handleProjectChange('art', e.target.value)}
                className="flex-1 border-b border-gray-300 focus:border-blue-500 bg-transparent outline-none px-1 py-0.5 text-gray-800"
              />
            </div>
          </div>
        </section>

        {/* Weather Section */}
        <section className="bg-gray-100 border-b border-gray-300">
           <div className="grid grid-cols-2">
             <WeatherSelector 
                label="Manhã" 
                selected={data.weather.morning} 
                onSelect={(v) => handleWeatherChange('morning', v)} 
             />
             <WeatherSelector 
                label="Tarde" 
                selected={data.weather.afternoon} 
                onSelect={(v) => handleWeatherChange('afternoon', v)} 
             />
           </div>
        </section>

        {/* Resources Grid */}
        <section className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-gray-300">
          <ResourceTable 
            title="Mão de Obra" 
            type="labor"
            items={data.labor} 
            onUpdate={(items) => setData(prev => ({ ...prev, labor: items }))}
          />
          <ResourceTable 
            title="Equipamentos" 
            type="equipment"
            items={data.equipment} 
            onUpdate={(items) => setData(prev => ({ ...prev, equipment: items }))}
          />
        </section>

        {/* AI Summary Section */}
        <section className="p-6 border-b border-gray-300 bg-slate-50">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-gray-700 text-sm uppercase">Resumo das Atividades do Dia</h3>
            {data.aiSummary && <span className="text-xs text-purple-600 font-semibold border border-purple-200 bg-purple-100 px-2 py-0.5 rounded">Gerado por IA</span>}
          </div>
          <textarea
            value={data.aiSummary}
            onChange={(e) => setData(prev => ({ ...prev, aiSummary: e.target.value }))}
            placeholder="Descreva as atividades executadas hoje ou clique em 'Gerar Resumo IA'..."
            className="w-full h-32 p-3 text-sm border border-gray-300 rounded focus:border-blue-400 focus:ring-0 bg-white text-gray-800 placeholder-gray-400"
          />
        </section>

        {/* Photos Section */}
        <section className="p-6">
           <PhotoGallery 
             photos={data.photos}
             onUpdate={(photos) => setData(prev => ({ ...prev, photos }))}
           />
        </section>
        
        {/* Footer for Signature */}
        <footer className="mt-12 p-8 grid grid-cols-2 gap-12 print:flex print:justify-between print:gap-4">
           <div className="border-t border-black pt-2 text-center">
             <input 
                type="text" 
                value={data.project.techResp}
                onChange={(e) => handleProjectChange('techResp', e.target.value)}
                placeholder="RESPONSÁVEL TÉCNICO"
                className="w-full text-center bg-transparent border-none outline-none text-xs font-bold uppercase text-slate-900 placeholder-gray-400"
             />
             <p className="text-[10px] text-gray-500 uppercase mt-1">ASSINATURA</p>
           </div>
           <div className="border-t border-black pt-2 text-center">
             <input 
                type="text" 
                value={data.project.client}
                onChange={(e) => handleProjectChange('client', e.target.value)}
                placeholder="FISCALIZAÇÃO / CLIENTE"
                className="w-full text-center bg-transparent border-none outline-none text-xs font-bold uppercase text-slate-900 placeholder-gray-400"
             />
             <p className="text-[10px] text-gray-500 uppercase mt-1">ASSINATURA</p>
           </div>
        </footer>

      </main>
    </div>
  );
};

export default App;