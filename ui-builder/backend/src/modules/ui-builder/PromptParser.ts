// PromptParser utility for extracting UI intents from natural language prompts
// Uses keyword detection and simple NLP heuristics

export class PromptParser {
  static extractComponents(prompt: string): string[] {
    const components = [];
    const lower = prompt.toLowerCase();
    if (/button|click/i.test(prompt)) components.push('Button');
    if (/input|field|textbox|form/i.test(prompt)) components.push('Input');
    if (/table|list|grid/i.test(prompt)) components.push('Table');
    if (/card/i.test(prompt)) components.push('Card');
    if (/header|navbar|top/i.test(prompt)) components.push('Header');
    if (/footer|bottom/i.test(prompt)) components.push('Footer');
    if (/sidebar|menu/i.test(prompt)) components.push('Sidebar');
    if (/image|avatar|photo/i.test(prompt)) components.push('Image');
    if (components.length === 0) components.push('Text');
    return components;
  }

  static extractLayoutIntent(prompt: string): string {
    if (/dashboard|grid|columns|rows|sidebar/i.test(prompt)) return 'grid';
    if (/center|single|simple/i.test(prompt)) return 'single';
    if (/form|vertical/i.test(prompt)) return 'vertical';
    return 'auto';
  }

  static extractStylingIntent(prompt: string): string {
    if (/dark|night|neon|futuristic/i.test(prompt)) return 'dark-neon';
    if (/light|clean|minimal/i.test(prompt)) return 'light-minimal';
    if (/colorful|vivid|gradient/i.test(prompt)) return 'colorful-gradient';
    return 'default';
  }

  static extractDataIntent(prompt: string): string[] {
    const data = [];
    if (/user|profile|account/i.test(prompt)) data.push('user');
    if (/product|item|catalog/i.test(prompt)) data.push('product');
    if (/order|transaction|purchase/i.test(prompt)) data.push('order');
    if (/message|chat|conversation/i.test(prompt)) data.push('message');
    return data;
  }

  static extractActions(prompt: string): string[] {
    const actions = [];
    if (/submit|save|send/i.test(prompt)) actions.push('submit');
    if (/delete|remove/i.test(prompt)) actions.push('delete');
    if (/edit|update/i.test(prompt)) actions.push('edit');
    if (/search|find/i.test(prompt)) actions.push('search');
    if (/login|sign in/i.test(prompt)) actions.push('login');
    if (/logout|sign out/i.test(prompt)) actions.push('logout');
    if (/download/i.test(prompt)) actions.push('download');
    return actions;
  }
}
