/**
 * Model: Item
 * Representa um item perdido no sistema
 */

export class Item {
  constructor(data = {}) {
    this.id = data.id || null;
    this.descricao = data.descricao || '';
    this.imageUrl = data.imageUrl || '';
    this.tags = data.tags || [];
    this.recuperado = data.recuperado || false;
    this.createdAt = data.createdAt || null;
  }

  /**
   * Valida se o item está completo para ser salvo
   */
  isValid() {
    return this.descricao.trim() !== '' && this.imageUrl !== '';
  }

  /**
   * Retorna uma cópia simples do objeto para persistência
   */
  toFirestore() {
    return {
      descricao: this.descricao,
      imageUrl: this.imageUrl,
      tags: this.tags,
      recuperado: this.recuperado,
      createdAt: this.createdAt,
    };
  }

  /**
   * Cria uma instância a partir dos dados do Firestore
   */
  static fromFirestore(doc) {
    return new Item({
      id: doc.id,
      ...doc.data(),
    });
  }

  /**
   * Verifica se o item contém um termo de busca (em descrição ou tags)
   */
  matchesSearch(searchTerm) {
    if (!searchTerm) return true;
    
    const term = searchTerm.toLowerCase();
    
    // Buscar na descrição
    const matchesDescription = this.descricao.toLowerCase().includes(term);
    
    // Buscar nas tags
    const matchesTags = this.tags.some(tag => 
      tag.toLowerCase().includes(term)
    );
    
    return matchesDescription || matchesTags;
  }
}
