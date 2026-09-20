import basePaths from '../../src/icons.mjs';

const extra = {
  key: '<circle cx="7.5" cy="15.5" r="4.2"/><path d="m10.6 12.4 9.2-9.2M15.4 4.4l3.4 3.4M12.3 7.5l2.6 2.6"/>',
  badge: '<rect x="3" y="5" width="18" height="15" rx="2.5"/><circle cx="9" cy="11" r="2.2"/><path d="M5.8 17c.6-2 2-3 3.2-3s2.6 1 3.2 3M15 9.5h3.5M15 13h2.5"/>',
  shield: '<path d="M12 3.2 19 6v5.2c0 4.6-3.2 7.4-7 9.6-3.8-2.2-7-5-7-9.6V6l7-2.8Z"/><path d="m8.8 11.6 2.3 2.3 4.1-4.6"/>',
  app: '<rect x="3.5" y="4" width="17" height="16" rx="2.5"/><path d="M3.5 9h17M7 6.5h.01M10 6.5h.01"/>',
  server: '<rect x="4" y="4" width="16" height="6.6" rx="1.6"/><rect x="4" y="13.4" width="16" height="6.6" rx="1.6"/><path d="M7.2 7.3h.01M7.2 16.7h.01"/>',
  database: '<ellipse cx="12" cy="5.5" rx="7.5" ry="2.8"/><path d="M4.5 5.5v13c0 1.5 3.4 2.8 7.5 2.8s7.5-1.3 7.5-2.8v-13M4.5 12c0 1.5 3.4 2.8 7.5 2.8s7.5-1.3 7.5-2.8"/>',
  ban: '<circle cx="12" cy="12" r="8.6"/><path d="m6.2 6.2 11.6 11.6"/>',
  update: '<path d="M12 19.5V8m-5 5 5-5 5 5M5.5 4.5h13"/>'
};

const paths = { ...basePaths, ...extra };

export function icon(name) { return `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${paths[name] || paths.spark}</svg>`; }
export function resolveIcons(s) { return s.replace(/\{\{icon:([\w-]+)\}\}/g, (_, n) => icon(n)); }
export default paths;
