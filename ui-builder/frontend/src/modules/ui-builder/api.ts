import axios from "axios";
import { AppModel, ComponentSchema } from "./types";

const API_BASE = "/ui-builder";

export async function fetchApps(): Promise<AppModel[]> {
  const res = await axios.get(`${API_BASE}/apps`);
  return res.data;
}

export async function fetchApp(id: string): Promise<AppModel> {
  const res = await axios.get(`${API_BASE}/apps/${id}`);
  return res.data;
}

export async function saveApp(app: AppModel): Promise<AppModel> {
  const res = await axios.post(`${API_BASE}/apps`, app);
  return res.data;
}

export async function updateApp(app: AppModel): Promise<AppModel> {
  const res = await axios.put(`${API_BASE}/apps/${app.id}`, app);
  return res.data;
}

export async function deleteApp(id: string): Promise<void> {
  await axios.delete(`${API_BASE}/apps/${id}`);
}

export async function publishApp(id: string): Promise<void> {
  await axios.post(`${API_BASE}/apps/${id}/publish`);
}

export async function fetchSchemas(): Promise<ComponentSchema[]> {
  const res = await axios.get(`${API_BASE}/schemas`);
  return res.data;
}

export async function registerSchema(schema: ComponentSchema): Promise<void> {
  await axios.post(`${API_BASE}/schemas`, schema);
}

export async function aiGenerateUI(prompt: string): Promise<any> {
  const res = await axios.post(`${API_BASE}/ai-generate`, { prompt });
  return res.data;
}
