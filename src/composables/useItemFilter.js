/**
 * Composable: useItemFilter
 * Responsabilidade: Gerenciar filtragem de itens
 */

import { ref, computed } from 'vue';
import { FILTER_STATUS } from '../constants';

export function useItemFilter(items) {
  const filterText = ref('');
  const filterStatus = ref(FILTER_STATUS.ATIVOS);

  /**
   * Opções de status para dropdown
   */
  const statusOptions = [
    { label: 'Todos', value: FILTER_STATUS.TODOS },
    { label: 'Não recuperados', value: FILTER_STATUS.ATIVOS },
    { label: 'Recuperados', value: FILTER_STATUS.RECUPERADOS },
  ];

  /**
   * Filtra itens com base nos critérios selecionados
   */
  const filteredItems = computed(() => {
    if (!items.value) return [];

    return items.value.filter((item) => {
      // Filtro por texto (busca em descrição e tags)
      const matchesText = item.matchesSearch 
        ? item.matchesSearch(filterText.value)
        : item.descricao.toLowerCase().includes(filterText.value.toLowerCase());

      // Filtro por status
      const matchesStatus =
        filterStatus.value === FILTER_STATUS.TODOS ||
        (filterStatus.value === FILTER_STATUS.ATIVOS && !item.recuperado) ||
        (filterStatus.value === FILTER_STATUS.RECUPERADOS && item.recuperado);

      return matchesText && matchesStatus;
    });
  });

  /**
   * Aplica filtros manualmente
   * @param {Object} filters - Objeto com texto e status
   */
  const applyFilter = (filters) => {
    if (filters.texto !== undefined) {
      filterText.value = filters.texto;
    }
    if (filters.status !== undefined) {
      filterStatus.value = filters.status;
    }
  };

  /**
   * Limpa todos os filtros
   */
  const clearFilters = () => {
    filterText.value = '';
    filterStatus.value = FILTER_STATUS.TODOS;
  };

  return {
    filterText,
    filterStatus,
    statusOptions,
    filteredItems,
    applyFilter,
    clearFilters,
  };
}
