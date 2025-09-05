export async function loadComponent(selector) {
  const element = document.querySelector(selector);
  if (!element) return;
  
  const source = element.getAttribute('data-source');
  if (!source) return;
  
  try {
    const response = await fetch(window.location.origin + '/api/preview-6898b46a22fb5cd44268b031/' + source);
    if (response.ok) {
      const html = await response.text();
      element.innerHTML = html;
    }
  } catch (error) {
    console.error('Failed to load component:', error);
  }
}