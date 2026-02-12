import React, { useMemo } from "react";
import { useUIBuilder } from "./UIBuilderContext";

interface ComponentRendererProps {
  schema: any;
  props: any;
  children?: any;
}

export const ComponentRenderer: React.FC<ComponentRendererProps> = ({ schema, props, children }) => {
  const { registry } = useUIBuilder();

  // Memoize the component type lookup
  const Comp = useMemo(() => {
    if (!schema) return null;
    // Try to get the React component from registry
    return registry[schema.type]?.component || null;
  }, [schema, registry]);

  // Render children recursively if defined in schema
  const renderChildren = () => {
    if (!props || !props.children || !Array.isArray(props.children)) return null;
    return props.children.map((child: any, idx: number) => (
      <ComponentRenderer key={child.id || idx} schema={child.schema} props={child.props} />
    ));
  };

  if (!Comp) return null;

  return (
    <Comp {...props}>
      {children}
      {renderChildren()}
    </Comp>
  );
};
