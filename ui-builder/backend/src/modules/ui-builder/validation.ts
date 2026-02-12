import { AppModel } from "./AppModel";

export function validateAppModel(app: AppModel): string[] {
  const errors: string[] = [];
  if (!app.id) errors.push("Missing app id");
  if (!app.name) errors.push("Missing app name");
  if (!Array.isArray(app.components)) errors.push("Components must be an array");
  // Add more validation as needed
  return errors;
}
