# Guia Rápido - Arquitetura MVC

## 🎯 Quando usar cada camada?

### 📦 Models (`src/models/`)
**Use quando precisar:**
- Definir estrutura de dados
- Adicionar validações
- Converter dados entre formatos

```javascript
// ✅ FAZER
import { Item } from '@/models';
const item = new Item(data);
if (item.isValid()) { ... }

// ❌ NÃO FAZER
const item = { descricao: '...', imageUrl: '...' }; // sem validação
```

### 🔧 Services (`src/services/`)
**Use quando precisar:**
- Comunicar com APIs externas
- Operações CRUD no banco de dados
- Lógica de negócio complexa

```javascript
// ✅ FAZER - No Service
export class ItemService {
  static async addItem(data) {
    await addDoc(collection(db, 'itens'), data);
  }
}

// ❌ NÃO FAZER - No Component
const addItem = async () => {
  await addDoc(collection(db, 'itens'), data); // lógica no componente
}
```

### 🎣 Composables (`src/composables/`)
**Use quando precisar:**
- Gerenciar estado reativo
- Reutilizar lógica entre componentes
- Coordenar múltiplos services

```javascript
// ✅ FAZER
export function useItems() {
  const items = ref([]);
  const loading = ref(false);
  
  const fetchItems = async () => {
    loading.value = true;
    items.value = await ItemService.getAll();
    loading.value = false;
  };
  
  return { items, loading, fetchItems };
}

// ❌ NÃO FAZER - Estado global solto
export const items = ref([]); // dificulta testes
```

### 📄 Views (`src/views/`)
**Use quando:**
- Criar páginas completas
- Orquestrar múltiplos componentes
- Gerenciar estado da página

```vue
<!-- ✅ FAZER -->
<script setup>
import { useItems } from '@/composables';
const { items, loading } = useItems();
</script>

<!-- ❌ NÃO FAZER -->
<script setup>
// Lógica complexa diretamente na view
const items = ref([]);
const fetchData = async () => { /* ... */ }
</script>
```

### 🧩 Components (`src/components/`)
**Use quando:**
- Criar UI reutilizável
- Componente focado em apresentação
- Sem lógica de negócio

```vue
<!-- ✅ FAZER - Componente puro -->
<script setup>
const props = defineProps({
  item: { type: Object, required: true }
});
const emit = defineEmits(['click']);
</script>

<!-- ❌ NÃO FAZER - Lógica no componente -->
<script setup>
import { db } from '@/firebase';
const saveItem = async () => {
  await addDoc(collection(db, 'itens'), ...); // NÃO!
}
</script>
```

## 📋 Checklist para Nova Feature

### 1. Nova Entidade (ex: Categoria)
- [ ] Criar `models/Categoria.js`
- [ ] Criar `services/CategoriaService.js`
- [ ] Criar `composables/useCategorias.js`
- [ ] Criar componente `components/CategoriaCard.vue`
- [ ] Usar em view relevante

### 2. Nova Funcionalidade em Entidade Existente
- [ ] Adicionar método no Service correspondente
- [ ] Expor no Composable se necessário
- [ ] Atualizar Component/View para usar

### 3. Novo Componente de UI
- [ ] Criar em `components/`
- [ ] Props bem definidas
- [ ] Emitir eventos ao invés de chamar APIs
- [ ] Documentar props e eventos

## 🔍 Como Encontrar Código

| Preciso...                          | Olhe em...                        |
|-------------------------------------|-----------------------------------|
| Validar dados de item               | `models/Item.js`                  |
| Adicionar item ao banco             | `services/ItemService.js`         |
| Upload de imagem                    | `services/StorageService.js`      |
| Estado reativo de itens             | `composables/useItems.js`         |
| Filtrar itens                       | `composables/useItemFilter.js`    |
| Configurações do WhatsApp           | `constants/config.js`             |
| Página principal                    | `views/HomeView.vue`              |
| Card de exibição de item            | `components/ItemCard.vue`         |

## 🚀 Exemplos Práticos

### Exemplo 1: Adicionar novo campo ao Item

```javascript
// 1. Atualizar Model
export class Item {
  constructor(data = {}) {
    this.id = data.id || null;
    this.descricao = data.descricao || '';
    this.categoria = data.categoria || ''; // NOVO
    // ...
  }
}

// 2. Service já funciona (genérico)
// Nenhuma mudança necessária!

// 3. Atualizar Component
<template>
  <div>{{ item.categoria }}</div> <!-- Usar novo campo -->
</template>
```

### Exemplo 2: Nova funcionalidade - Buscar por ID

```javascript
// 1. Adicionar no Service
export class ItemService {
  static async getById(itemId) {
    const docRef = doc(db, FIRESTORE_COLLECTIONS.ITENS, itemId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? Item.fromFirestore(docSnap) : null;
  }
}

// 2. Expor no Composable
export function useItems() {
  const getItemById = async (id) => {
    return await ItemService.getById(id);
  };
  
  return { getItemById };
}

// 3. Usar na View
const { getItemById } = useItems();
const item = await getItemById(route.params.id);
```

### Exemplo 3: Novo serviço externo

```javascript
// 1. Criar Service
export class EmailService {
  static async sendNotification(email, message) {
    // lógica de envio
  }
}

// 2. Exportar
// services/index.js
export { EmailService } from './EmailService';

// 3. Usar onde necessário
import { EmailService } from '@/services';
await EmailService.sendNotification('user@email.com', 'Novo item!');
```

## ⚠️ Armadilhas Comuns

### ❌ NÃO: Chamar API diretamente no Component
```vue
<script setup>
import { addDoc } from 'firebase/firestore';
const save = () => addDoc(...); // ERRADO!
</script>
```

### ✅ SIM: Usar Service
```vue
<script setup>
import { ItemService } from '@/services';
const save = () => ItemService.addItem(...); // CORRETO!
</script>
```

---

### ❌ NÃO: Estado solto
```javascript
export const items = ref([]); // dificulta testes e reuso
```

### ✅ SIM: Composable
```javascript
export function useItems() {
  const items = ref([]);
  return { items };
}
```

---

### ❌ NÃO: Props mutáveis
```vue
<script setup>
const props = defineProps(['item']);
props.item.descricao = 'novo'; // NUNCA!
</script>
```

### ✅ SIM: Emitir evento
```vue
<script setup>
const emit = defineEmits(['update']);
emit('update', { ...props.item, descricao: 'novo' });
</script>
```

## 📚 Padrões de Import

```javascript
// ✅ Usar barrel exports
import { Item } from '@/models';
import { ItemService, StorageService } from '@/services';
import { useItems, useItemFilter } from '@/composables';
import { CONTATO_ADRIANA, MESSAGES } from '@/constants';

// ❌ Evitar imports diretos
import { Item } from '@/models/Item';
import { ItemService } from '@/services/ItemService';
```

## 🎨 Convenções de Nomenclatura

| Tipo         | Convenção           | Exemplo              |
|--------------|---------------------|----------------------|
| Model        | PascalCase          | `Item`               |
| Service      | PascalCase + Service| `ItemService`        |
| Composable   | camelCase + use     | `useItems`           |
| Component    | PascalCase          | `ItemCard`           |
| View         | PascalCase + View   | `HomeView`           |
| Constant     | UPPER_SNAKE_CASE    | `CONTATO_ADRIANA`    |

## 🔗 Links Úteis

- [Documentação Completa](./ARCHITECTURE.md)
- [Guia de Migração](./MIGRATION_GUIDE.md)
- [Vue 3 Docs](https://vuejs.org/)
- [Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
