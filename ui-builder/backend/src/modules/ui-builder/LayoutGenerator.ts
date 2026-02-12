// LayoutGenerator utility for arranging components based on layout intent

export class LayoutGenerator {
  static generateGridLayout(components: any[]) {
    // Place components in a grid (4 columns)
    return components.map((comp, i) => ({
      ...comp,
      grid: { x: (i % 4), y: Math.floor(i / 4), w: 1, h: 1 }
    }));
  }

  static generateVerticalLayout(components: any[]) {
    // Stack components vertically
    return components.map((comp, i) => ({
      ...comp,
      grid: { x: 0, y: i, w: 1, h: 1 }
    }));
  }

  static generateHorizontalLayout(components: any[]) {
    // Arrange components horizontally
    return components.map((comp, i) => ({
      ...comp,
      grid: { x: i, y: 0, w: 1, h: 1 }
    }));
  }

  static generateFormLayout(components: any[]) {
    // Stack inputs and buttons vertically, label above input
    let y = 0;
    const arranged = [];
    for (const comp of components) {
      if (comp.type === 'Input') {
        arranged.push({ ...comp, grid: { x: 0, y: y++, w: 2, h: 1 } });
      } else if (comp.type === 'Button') {
        arranged.push({ ...comp, grid: { x: 0, y: y++, w: 2, h: 1 } });
      } else {
        arranged.push({ ...comp, grid: { x: 0, y: y++, w: 2, h: 1 } });
      }
    }
    return arranged;
  }

  // Choose layout type based on prompt intent
  static generateLayoutByIntent(components: any[], intent: string) {
    switch (intent) {
      case 'grid':
        return this.generateGridLayout(components);
      case 'vertical':
        return this.generateVerticalLayout(components);
      case 'horizontal':
        return this.generateHorizontalLayout(components);
      case 'form':
        return this.generateFormLayout(components);
      default:
        return this.generateVerticalLayout(components);
    }
  }
}
