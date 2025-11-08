/**
 * Model: Item
 * Representa um item perdido no sistema
 */

export class Item {
  constructor(data = {}) {
    this.id = data.id || null;
    this.descricao = data.descricao || '';
    this.imageUrl = data.imageUrl || '';
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
}
