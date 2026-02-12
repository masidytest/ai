// PropsGenerator: generates component props using prompt context

export class PropsGenerator {
  static generateTextProps(prompt: string) {
    if (/welcome|greeting|hello/i.test(prompt)) return { text: 'Welcome!' };
    if (/error|fail/i.test(prompt)) return { text: 'An error occurred.' };
    return { text: 'Text' };
  }

  static generateInputProps(prompt: string) {
    if (/email/i.test(prompt)) return { label: 'Email', placeholder: 'Enter your email', type: 'email' };
    if (/password/i.test(prompt)) return { label: 'Password', placeholder: 'Enter your password', type: 'password' };
    if (/search/i.test(prompt)) return { label: 'Search', placeholder: 'Search...' };
    return { label: 'Input', placeholder: 'Enter value' };
  }

  static generateButtonProps(prompt: string) {
    if (/submit|save/i.test(prompt)) return { text: 'Submit', color: 'primary' };
    if (/delete|remove/i.test(prompt)) return { text: 'Delete', color: 'danger' };
    if (/login|sign in/i.test(prompt)) return { text: 'Login', color: 'primary' };
    return { text: 'Click Me', color: 'default' };
  }

  static generateTableProps(prompt: string) {
    if (/user|profile/i.test(prompt)) return { columns: ['Name', 'Email', 'Role'] };
    if (/product|item/i.test(prompt)) return { columns: ['Product', 'Price', 'Stock'] };
    if (/order|transaction/i.test(prompt)) return { columns: ['Order ID', 'Date', 'Amount'] };
    return { columns: ['Column 1', 'Column 2'] };
  }

  static generateCardProps(prompt: string) {
    if (/profile|user/i.test(prompt)) return { title: 'User Profile', content: 'Details about the user.' };
    if (/product|item/i.test(prompt)) return { title: 'Product', content: 'Product details.' };
    if (/stats|dashboard/i.test(prompt)) return { title: 'Stats', content: 'Dashboard statistics.' };
    return { title: 'Card Title', content: 'Card content goes here.' };
  }
}
