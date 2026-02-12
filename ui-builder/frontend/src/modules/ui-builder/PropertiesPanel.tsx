import React, { useState } from "react";
import { useUIBuilder } from "./UIBuilderContext";

function getDefaultValue(prop) {
  if (prop.default !== undefined) return prop.default;
  if (prop.type === "string") return "";
  if (prop.type === "number") return 0;
  if (prop.type === "boolean") return false;
  if (prop.type === "color") return "#000000";
  if (prop.type === "select" && prop.options?.length) return prop.options[0];
  return undefined;
}

export const PropertiesPanel: React.FC = () => {
  const { app, setApp, selectedIds, schemas } = useUIBuilder();
  const selectedId = selectedIds?.[0];
  if (!app || !selectedId) return null;
  const comp = app.components.find(c => c.id === selectedId);
  if (!comp) return null;
  const schema = schemas.find(s => s.type === comp.type);
  const [collapsed, setCollapsed] = useState({});

  function handleChange(propName, value) {
    setApp({
      ...app,
      components: app.components.map(c =>
        c.id === comp.id ? { ...c, props: { ...c.props, [propName]: value } } : c
      ),
    });
  }

  function handleReset() {
    setApp({
      ...app,
      components: app.components.map(c =>
        c.id === comp.id
          ? {
              ...c,
              props: Object.fromEntries(
                Object.entries(schema.props || {}).map(([k, v]) => [k, getDefaultValue(v)])
              ),
            }
          : c
      ),
    });
  }

  return (
    <div className="bg-[#18192a] border-l border-[#232347] w-72 p-4 text-white h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-2">
        <span className="font-bold text-[#a259ff]">Properties</span>
        <button
          className="text-xs px-2 py-1 rounded bg-[#232347] border border-[#a259ff] hover:bg-[#a259ff] hover:text-white transition"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>
      {schema ? (
        <div className="flex flex-col gap-2">
          {Object.entries(schema.props || {}).map(([section, prop]) => (
            <div key={section} className="mb-3">
              <button
                className="w-full text-left font-semibold text-[#00fff7] mb-1 focus:outline-none"
                onClick={() => setCollapsed(c => ({ ...c, [section]: !c[section] }))}
              >
                {section}
                <span className="float-right">{collapsed[section] ? "+" : "-"}</span>
              </button>
              {!collapsed[section] && (
                <div className="pl-2">
                  {Object.entries(prop.fields || { value: prop }).map(([name, field]) => {
                    const value = comp.props?.[name] ?? getDefaultValue(field);
                    let input = null;
                    if (field.type === "string") {
                      input = (
                        <input
                          className="w-full px-2 py-1 rounded bg-[#232347] border border-[#a259ff] mb-1"
                          type="text"
                          value={value}
                          onChange={e => handleChange(name, e.target.value)}
                        />
                      );
                    } else if (field.type === "number") {
                      input = (
                        <input
                          className="w-full px-2 py-1 rounded bg-[#232347] border border-[#a259ff] mb-1"
                          type="number"
                          value={value}
                          onChange={e => handleChange(name, Number(e.target.value))}
                        />
                      );
                    } else if (field.type === "boolean") {
                      input = (
                        <input
                          type="checkbox"
                          checked={!!value}
                          onChange={e => handleChange(name, e.target.checked)}
                          className="accent-[#a259ff] mr-2"
                        />
                      );
                    } else if (field.type === "color") {
                      input = (
                        <input
                          type="color"
                          value={value}
                          onChange={e => handleChange(name, e.target.value)}
                          className="w-8 h-8 p-0 border-none bg-transparent"
                        />
                      );
                    } else if (field.type === "select") {
                      input = (
                        <select
                          className="w-full px-2 py-1 rounded bg-[#232347] border border-[#a259ff] mb-1"
                          value={value}
                          onChange={e => handleChange(name, e.target.value)}
                        >
                          {field.options?.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      );
                    }
                    return (
                      <div key={name} className="mb-2">
                        <label className="block text-xs text-[#a259ff] mb-1">{field.label || name}</label>
                        {input}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : <div className="text-gray-400">No schema</div>}
    </div>
  );
};
