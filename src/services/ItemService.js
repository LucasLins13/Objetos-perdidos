/**
 * Service: ItemService
 * Responsabilidade: Gerenciar operações CRUD de itens no Firestore
 */

import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { FIRESTORE_COLLECTIONS } from '../constants';
import { Item } from '../models';

export class ItemService {
  /**
   * Adiciona um novo item ao Firestore
   * @param {Object} itemData - Dados do item (descricao, imageUrl)
   * @returns {Promise<string>} ID do documento criado
   */
  static async addItem(itemData) {
    const item = new Item({
      ...itemData,
      recuperado: false,
      createdAt: serverTimestamp(),
      recuperadoAt: null
    });

    if (!item.isValid()) {
      throw new Error('Dados do item inválidos');
    }

    const docRef = await addDoc(
      collection(db, FIRESTORE_COLLECTIONS.ITENS),
      item.toFirestore()
    );

    return docRef.id;
  }

  /**
   * Atualiza um item existente
   * @param {string} itemId - ID do item
   * @param {Object} updates - Campos a serem atualizados
   */
  static async updateItem(itemId, updates) {
    const itemRef = doc(db, FIRESTORE_COLLECTIONS.ITENS, itemId);
    await updateDoc(itemRef, updates);
  }

  /**
   * Marca um item como recuperado
   * @param {string} itemId - ID do item
   */
  static async markAsRecovered(itemId) {
    await this.updateItem(itemId, { recuperado: true, recuperadoAt: serverTimestamp() });
  }

  /**
   * Remove um item do Firestore
   * @param {string} itemId - ID do item
   */
  static async deleteItem(itemId) {
    const itemRef = doc(db, FIRESTORE_COLLECTIONS.ITENS, itemId);
    await deleteDoc(itemRef);
  }

  /**
   * Escuta mudanças na coleção de itens em tempo real
   * @param {Function} callback - Função chamada quando houver mudanças
   * @returns {Function} Função para cancelar a escuta
   */
  static subscribeToItems(callback) {
    const q = query(
      collection(db, FIRESTORE_COLLECTIONS.ITENS),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc) => Item.fromFirestore(doc));
      callback(items);
    });
  }
}
