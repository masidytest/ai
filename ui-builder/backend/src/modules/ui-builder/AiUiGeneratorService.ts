import { v4 as uuidv4 } from 'uuid';

export class AiUiGeneratorService {
  // Generate a layout structure from a prompt
  async generateLayout(prompt: string) {
    // Rule-based: look for keywords
    if (/dashboard/i.test(prompt)) {
      return {
        layout: 'grid',
        areas: [
          { name: 'header', x: 0, y: 0, w: 12, h: 2 },
          { name: 'sidebar', x: 0, y: 2, w: 3, h: 10 },
          { name: 'main', x: 3, y: 2, w: 9, h: 10 },
          { name: 'footer', x: 0, y: 12, w: 12, h: 2 }
        ]
      };
    }
    // Default
    return {
      layout: 'single',
      areas: [
        { name: 'main', x: 0, y: 0, w: 12, h: 12 }
      ]
    };
  }

  // Generate a component tree from a prompt
  async generateComponentTree(prompt: string) {
    // Pattern-based: look for common UI elements
    const children = [];
    if (/login/i.test(prompt)) {
      children.push(
        { id: uuidv4(), type: 'Input', props: { label: 'Username' }, children: [] },
        { id: uuidv4(), type: 'Input', props: { label: 'Password', type: 'password' }, children: [] },
        { id: uuidv4(), type: 'Button', props: { text: 'Login' }, children: [] }
      );
    } else if (/dashboard/i.test(prompt)) {
      children.push(
        { id: uuidv4(), type: 'Card', props: { title: 'Stats' }, children: [] },
        { id: uuidv4(), type: 'Table', props: { columns: ['Name', 'Value'] }, children: [] }
      );
    } else {
      children.push(
        { id: uuidv4(), type: 'Text', props: { text: 'Hello World' }, children: [] }
      );
    }
    return {
      id: uuidv4(),
      type: 'App',
      props: {},
      children
    };
  }

  // Generate props for a component type from a prompt
  async generatePropsForComponent(type: string, prompt: string) {
    // Semantic: suggest props based on type and prompt
    if (type === 'Button') {
      return { text: /submit|save/i.test(prompt) ? 'Submit' : 'Click Me', color: 'primary' };
    }
    if (type === 'Input') {
      return { label: /email/i.test(prompt) ? 'Email' : 'Input', placeholder: 'Enter value' };
    }
    if (type === 'Card') {
      return { title: 'Card Title', content: 'Card content goes here.' };
    }
    return { label: type };
  }

  // Generate suggested interactions from a prompt
  async generateInteractions(prompt: string) {
    // Pattern-based: look for actions
    const interactions = [];
    if (/click/i.test(prompt)) {
      interactions.push({ type: 'onClick', action: 'alert("Clicked!")' });
    }
    if (/submit/i.test(prompt)) {
      interactions.push({ type: 'onSubmit', action: 'submitForm()' });
    }
    return interactions;
  }

  // Generate suggested data bindings from a prompt
  async generateDataBindings(prompt: string) {
    // Semantic: suggest bindings for forms, tables, etc.
    if (/form|input|login/i.test(prompt)) {
      return [{ field: 'formData', type: 'object' }];
    }
    if (/table|list/i.test(prompt)) {
      return [{ field: 'items', type: 'array' }];
    }
    return [];
  }
}
