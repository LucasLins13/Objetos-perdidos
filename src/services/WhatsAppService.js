/**
 * Service: WhatsAppService
 * Responsabilidade: Gerenciar comunicação via WhatsApp
 */

export class WhatsAppService {
  /**
   * Abre uma conversa no WhatsApp com mensagem pré-definida
   * @param {string} phoneNumber - Número de telefone com código do país
   * @param {string} message - Mensagem a ser enviada
   */
  static openChat(phoneNumber, message = '') {
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(url, '_blank');
  }

  /**
   * Cria uma mensagem padrão sobre um item perdido
   * @param {string} contactName - Nome do contato
   * @param {string} itemDescription - Descrição do item
   */
  static createItemMessage(contactName, itemDescription) {
    return `Olá ${contactName}! Sobre o item: ${itemDescription}`;
  }
}
