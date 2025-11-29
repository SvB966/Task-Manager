import { GoogleGenAI } from "@google/genai";
import { Task, TaskStatus } from "../types";
import { CATEGORIES, STATUS_LABELS } from "../constants";

const getCategoryName = (id: number) => CATEGORIES.find(c => c.id === id)?.name || 'Unknown';

export const analyzeSchedule = async (tasks: Task[]): Promise<string> => {
  if (!process.env.API_KEY) {
    return "API Key is missing. Please configure your environment to use AI features.";
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Format tasks for the prompt
  const taskListString = tasks.map(t => {
    const subtaskInfo = t.subtasks.length > 0 
      ? `(${t.subtasks.filter(s => s.isCompleted).length}/${t.subtasks.length} subtasks done)` 
      : '';
    return `- [${t.taskDate.toDateString()}] ${t.title} (${getCategoryName(t.categoryId)}): ${STATUS_LABELS[t.statusId]} at ${t.startTime} - ${t.endTime} (${t.duration}m) ${subtaskInfo}`;
  }).join('\n');

  const prompt = `
    You are a productivity expert assistant. Analyze the following list of tasks and provide a concise, 3-bullet point summary of the workload. 
    Focus on potential bottlenecks, the balance between work/personal life, duration of tasks, and urgent items.
    
    Task List:
    ${taskListString}
    
    Output strictly in markdown format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Could not generate analysis.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "An error occurred while analyzing your schedule. Please try again.";
  }
};