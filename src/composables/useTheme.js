/**
 * Composable: useTheme
 * Responsabilidade: Gerenciar tema (light/dark mode)
 */

import { ref, watch, onMounted } from 'vue';

const THEME_KEY = 'app-theme';
const isDark = ref(false);

export function useTheme() {
  /**
   * Inicializa o tema baseado na preferência salva ou do sistema
   */
  const initTheme = () => {
    // Verificar se há preferência salva
    const savedTheme = localStorage.getItem(THEME_KEY);
    
    if (savedTheme) {
      isDark.value = savedTheme === 'dark';
    } else {
      // Usar preferência do sistema
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    
    applyTheme();
  };

  /**
   * Aplica o tema ao documento
   */
  const applyTheme = () => {
    const html = document.documentElement;
    
    if (isDark.value) {
      html.classList.add('app-dark');
      html.style.colorScheme = 'dark';
    } else {
      html.classList.remove('app-dark');
      html.style.colorScheme = 'light';
    }
  };

  /**
   * Alterna entre light e dark mode
   */
  const toggleTheme = () => {
    isDark.value = !isDark.value;
    localStorage.setItem(THEME_KEY, isDark.value ? 'dark' : 'light');
    applyTheme();
  };

  /**
   * Define o tema manualmente
   */
  const setTheme = (theme) => {
    isDark.value = theme === 'dark';
    localStorage.setItem(THEME_KEY, theme);
    applyTheme();
  };

  // Observar mudanças na preferência do sistema
  onMounted(() => {
    initTheme();
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      if (!localStorage.getItem(THEME_KEY)) {
        isDark.value = e.matches;
        applyTheme();
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  });

  return {
    isDark,
    toggleTheme,
    setTheme,
    initTheme,
  };
}
