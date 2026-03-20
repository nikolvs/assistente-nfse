export function formatBRL(value: number): string {
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function getExtensionsPageUrl(): string {
  switch (import.meta.env.BROWSER) {
    case 'firefox':
      return 'about:addons';
    default:
      return 'chrome://extensions';
  }
}
