import { GoogleGenAI } from "@google/genai";
import { RDOData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateDailySummary = async (data: RDOData): Promise<string> => {
  try {
    const laborList = data.labor.map(l => `${l.quantity}x ${l.name}`).join(', ');
    const equipmentList = data.equipment.map(e => `${e.quantity}x ${e.name}`).join(', ');
    const photoDescriptions = data.photos.map((p, idx) => `Foto ${idx + 1}: ${p.description}`).join('. ');
    
    const prompt = `
      Você é um engenheiro civil experiente. Escreva um resumo técnico, formal e conciso para o Diário de Obra (RDO) com base nos seguintes dados:
      
      Obra: ${data.project.name}
      Data: ${data.project.date}
      Clima Manhã: ${data.weather.morning || 'Não informado'}
      Clima Tarde: ${data.weather.afternoon || 'Não informado'}
      
      Efetivo (Mão de Obra): ${laborList || 'Nenhum informado'}
      Equipamentos: ${equipmentList || 'Nenhum informado'}
      
      Atividades/Evidências baseadas nas fotos:
      ${photoDescriptions}
      
      Gere um parágrafo único, profissional, resumindo o dia, mencionando o efetivo total, condições climáticas e principais atividades inferidas.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Não foi possível gerar o resumo.";
  } catch (error) {
    console.error("Erro ao gerar resumo com Gemini:", error);
    return "Erro ao conectar com a IA para gerar o resumo. Verifique sua chave de API ou tente novamente mais tarde.";
  }
};
