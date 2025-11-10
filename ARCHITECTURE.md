# Arquitetura MVC - Achados & Perdidos

## 📋 Visão Geral

Este projeto foi organizado seguindo o padrão **MVC (Model-View-Controller)** com responsabilidades bem definidas para facilitar manutenção, escalabilidade e testabilidade.

## 🏗️ Estrutura do Projeto

```
src/
├── models/              # Camada de Modelo - Estruturas de dados
│   ├── Item.js          # Modelo do Item com validações
│   └── index.js
│
├── services/            # Camada de Controle - Lógica de negócio
│   ├── ItemService.js   # Operações CRUD de itens
│   ├── StorageService.js # Gerenciamento de upload de imagens
│   ├── WhatsAppService.js # Integração WhatsApp
│   └── index.js
│
├── composables/         # Lógica reutilizável com Vue Composition API
│   ├── useItems.js      # Gerenciamento de estado de itens
│   ├── useItemFilter.js # Lógica de filtragem
│   └── index.js
│
├── constants/           # Configurações e constantes
│   ├── config.js        # Configurações da aplicação
│   └── index.js
│
├── views/              # Camada de Visão - Páginas
│   ├── HomeView.vue     # Página principal (listagem pública)
│   ├── AdminView.vue    # Página administrativa
│   └── ItemDetailView.vue
│
├── components/         # Componentes de apresentação puros
│   ├── AddItemForm.vue  # Formulário de adição
│   ├── ItemCard.vue     # Card de exibição de item
│   ├── FilterBar.vue    # Barra de filtros
│   └── ListaItens.vue   # (obsoleto - pode ser removido)
│
├── firebase/           # Configuração Firebase
│   └── firebaseConfig.js
│
├── supabase/           # Configuração Supabase
│   └── supabaseClient.js
│
├── router/             # Configuração de rotas
│   └── index.js
│
└── assets/             # Recursos estáticos
    └── styles.css
```

## 🎯 Responsabilidades das Camadas

### 1. **Models** (Modelos)
**Responsabilidade:** Definir a estrutura de dados e validações

- Define a forma dos dados da aplicação
- Contém métodos de validação
- Fornece métodos de conversão (toFirestore, fromFirestore)
- **Não contém** lógica de API ou banco de dados

**Exemplo:**
```javascript
import { Item } from '@/models';

const item = new Item({ descricao: 'Carteira', imageUrl: '...' });
if (item.isValid()) {
  // proceder com salvamento
}
```

### 2. **Services** (Controladores)
**Responsabilidade:** Implementar a lógica de negócio e comunicação com APIs

- **ItemService:** CRUD de itens no Firestore
- **StorageService:** Upload e gerenciamento de imagens no Supabase
- **WhatsAppService:** Integração com WhatsApp

**Características:**
- Métodos estáticos (não precisam de instanciação)
- Gerenciam comunicação com serviços externos
- Retornam Promises
- **Não gerenciam** estado da UI

**Exemplo:**
```javascript
import { ItemService } from '@/services';

// Adicionar item
await ItemService.addItem({ descricao: 'Chave', imageUrl: '...' });

// Marcar como recuperado
await ItemService.markAsRecovered(itemId);
```

### 3. **Composables**
**Responsabilidade:** Gerenciar estado reativo e lógica reutilizável

- Encapsulam lógica que pode ser reutilizada entre componentes
- Gerenciam estado reativo com Vue refs/reactive
- Coordenam chamadas aos Services
- Fornecem interface reativa para componentes

**Características:**
- Seguem convenção de nomenclatura `use*`
- Retornam objetos com refs reativas e métodos
- Gerenciam lifecycle (onMounted, onUnmounted)

**Exemplo:**
```javascript
import { useItems } from '@/composables';

const { items, loading, addItemWithImage, markAsRecovered } = useItems();
```

### 4. **Views** (Páginas)
**Responsabilidade:** Componentes de nível de página que orquestram outros componentes

- Gerenciam estado da página usando composables
- Coordenam múltiplos componentes
- Lidam com navegação entre páginas
- Passam dados e callbacks para componentes filhos

**Exemplo:**
```vue
<script setup>
import { useItems, useItemFilter } from '@/composables';

const { items, loading, markAsRecovered } = useItems();
const { filteredItems, applyFilter } = useItemFilter(items);
</script>
```

### 5. **Components** (Componentes de Apresentação)
**Responsabilidade:** Componentes puros focados apenas em apresentação

- Recebem dados via **props**
- Emitem eventos para o pai via **emits**
- **Não fazem** chamadas diretas a APIs ou banco de dados
- **Não gerenciam** estado global
- Focam em UI/UX

**Características:**
- Props bem definidas com validação
- Emitem eventos semânticos
- Reutilizáveis e testáveis
- Stateless (sem estado próprio complexo)

**Exemplo:**
```vue
<script setup>
const props = defineProps({
  item: { type: Object, required: true }
});

const emit = defineEmits(['mark-recovered']);
</script>
```

## 🔄 Fluxo de Dados

```
┌─────────────┐
│   View      │  ← Orquestra componentes e gerencia estado da página
│ (HomeView)  │
└──────┬──────┘
       │ usa
       ▼
┌─────────────┐
│ Composable  │  ← Gerencia estado reativo e coordena services
│ (useItems)  │
└──────┬──────┘
       │ chama
       ▼
┌─────────────┐
│  Service    │  ← Implementa lógica de negócio e API calls
│(ItemService)│
└──────┬──────┘
       │ usa
       ▼
┌─────────────┐
│   Model     │  ← Define estrutura e validação de dados
│   (Item)    │
└─────────────┘

       ▲
       │ renderiza
┌──────┴──────┐
│  Component  │  ← Apresentação pura, recebe props e emite eventos
│ (ItemCard)  │
└─────────────┘
```

## ✨ Vantagens desta Arquitetura

### 1. **Separação de Responsabilidades**
- Cada camada tem uma responsabilidade única e bem definida
- Facilita identificar onde fazer mudanças

### 2. **Testabilidade**
- Services podem ser testados isoladamente
- Components são fáceis de testar (props in, events out)
- Composables podem ser testados sem montar componentes

### 3. **Reutilização**
- Services são reutilizáveis em qualquer contexto
- Composables compartilham lógica entre componentes
- Components podem ser usados em diferentes views

### 4. **Manutenibilidade**
- Mudanças na API afetam apenas Services
- Mudanças na UI afetam apenas Components
- Lógica de negócio centralizada

### 5. **Escalabilidade**
- Fácil adicionar novos Services
- Fácil criar novos Composables
- Estrutura clara para novos desenvolvedores

## 📝 Convenções de Código

### Nomenclatura
- **Models:** PascalCase, singular (ex: `Item`)
- **Services:** PascalCase com sufixo `Service` (ex: `ItemService`)
- **Composables:** camelCase com prefixo `use` (ex: `useItems`)
- **Components:** PascalCase (ex: `ItemCard`)
- **Views:** PascalCase com sufixo `View` (ex: `HomeView`)

### Arquivos
- Um conceito principal por arquivo
- Arquivo index.js para facilitar imports
- Comentários JSDoc para métodos complexos

### Imports
```javascript
// ✅ Bom - usando barrel exports
import { Item } from '@/models';
import { ItemService, StorageService } from '@/services';
import { useItems } from '@/composables';

// ❌ Evitar - imports diretos
import { Item } from '@/models/Item';
```

## 🚀 Como Adicionar Novas Funcionalidades

### 1. Nova entidade de dados
1. Criar Model em `models/`
2. Criar Service em `services/`
3. Criar Composable em `composables/`
4. Criar Component em `components/`
5. Usar em View

### 2. Nova funcionalidade em entidade existente
1. Adicionar método no Service
2. Expor no Composable se necessário
3. Usar em Component/View

## 🔧 Tecnologias Utilizadas

- **Vue 3** - Framework frontend
- **Vue Router** - Gerenciamento de rotas
- **Firebase Firestore** - Banco de dados
- **Supabase Storage** - Armazenamento de imagens
- **PrimeVue** - Biblioteca de componentes UI
- **Tailwind CSS** - Estilização

## 📚 Leitura Adicional

- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Vue 3 Best Practices](https://vuejs.org/style-guide/)
- [MVC Pattern](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)
