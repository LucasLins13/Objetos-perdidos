/**
 * Service: VisionService
 * Responsabilidade: Integração com Google Cloud Vision API para análise de imagens
 */

import { GOOGLE_VISION_API_KEY } from '../constants';

export class VisionService {
  /**
   * Tradução de labels do inglês para português
   */
  static labelTranslations = {
    'Bag': 'Bolsa',
    'Backpack': 'Mochila',
    'Handbag': 'Bolsa de mão',
    'Wallet': 'Carteira',
    'Phone': 'Celular',
    'Mobile phone': 'Celular',
    'Smartphone': 'Smartphone',
    'Laptop': 'Notebook',
    'Computer': 'Computador',
    'Tablet': 'Tablet',
    'Watch': 'Relógio',
    'Wristwatch': 'Relógio de pulso',
    'Key': 'Chave',
    'Keys': 'Chaves',
    'Glasses': 'Óculos',
    'Sunglasses': 'Óculos de sol',
    'Eyewear': 'Óculos',
    'Book': 'Livro',
    'Notebook': 'Caderno',
    'Pen': 'Caneta',
    'Pencil': 'Lápis',
    'Umbrella': 'Guarda-chuva',
    'Bottle': 'Garrafa',
    'Water bottle': 'Garrafa de água',
    'Headphones': 'Fones de ouvido',
    'Earbuds': 'Fones',
    'Camera': 'Câmera',
    'Jacket': 'Jaqueta',
    'Coat': 'Casaco',
    'Hat': 'Chapéu',
    'Cap': 'Boné',
    'Shoe': 'Sapato',
    'Shoes': 'Sapatos',
    'Sneakers': 'Tênis',
    'Jewelry': 'Joia',
    'Necklace': 'Colar',
    'Bracelet': 'Pulseira',
    'Ring': 'Anel',
    'Earring': 'Brinco',
    'Charger': 'Carregador',
    'Cable': 'Cabo',
    'Document': 'Documento',
    'Paper': 'Papel',
    'Card': 'Cartão',
    'ID card': 'Documento de identidade',
    'Credit card': 'Cartão de crédito',
    'Money': 'Dinheiro',
    'Cash': 'Dinheiro',
    'Coin': 'Moeda',
    'Clothing': 'Roupa',
    'Shirt': 'Camisa',
    'T-shirt': 'Camiseta',
    'Pants': 'Calça',
    'Jeans': 'Jeans',
    'Dress': 'Vestido',
    'Skirt': 'Saia',
    'Scarf': 'Cachecol',
    'Glove': 'Luva',
    'Gloves': 'Luvas',
    'Toy': 'Brinquedo',
    'Stuffed animal': 'Pelúcia',
    'Ball': 'Bola',
    'Sports equipment': 'Equipamento esportivo',
    'Bicycle': 'Bicicleta',
    'Helmet': 'Capacete',
    'Bag pack': 'Mochila',
    'Luggage': 'Bagagem',
    'Suitcase': 'Mala',
    'Purse': 'Bolsa',
    'Accessory': 'Acessório',
    'Belt': 'Cinto',
    'Tie': 'Gravata',
    'Fashion accessory': 'Acessório de moda',
    'Electronic device': 'Dispositivo eletrônico',
    'Electronics': 'Eletrônicos',
    'Gadget': 'Gadget',
    'Remote control': 'Controle remoto',
    'Mouse': 'Mouse',
    'Keyboard': 'Teclado',
    'USB': 'Pen drive',
    'Memory card': 'Cartão de memória',
    'Battery': 'Bateria',
    'Power bank': 'Power bank',
  };

  /**
   * Analisa uma imagem usando Google Cloud Vision API
   * @param {string} imageUrl - URL pública da imagem
   * @returns {Promise<string[]>} Array de tags em português
   */
  static async analyzeImage(imageUrl) {
    try {
      const apiUrl = `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_VISION_API_KEY}`;

      const requestBody = {
        requests: [
          {
            image: {
              source: {
                imageUri: imageUrl,
              },
            },
            features: [
              {
                type: 'LABEL_DETECTION',
                maxResults: 10,
              },
              {
                type: 'OBJECT_LOCALIZATION',
                maxResults: 10,
              },
            ],
          },
        ],
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Google Vision API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.responses || !data.responses[0]) {
        return [];
      }

      const result = data.responses[0];
      const tags = new Set();

      // Extrair labels
      if (result.labelAnnotations) {
        result.labelAnnotations.forEach((label) => {
          if (label.score > 0.7) { // Apenas labels com alta confiança
            const translatedLabel = this.translateToPortuguese(label.description);
            tags.add(translatedLabel);
          }
        });
      }

      // Extrair objetos localizados
      if (result.localizedObjectAnnotations) {
        result.localizedObjectAnnotations.forEach((object) => {
          if (object.score > 0.7) {
            const translatedObject = this.translateToPortuguese(object.name);
            tags.add(translatedObject);
          }
        });
      }

      return Array.from(tags);
    } catch (error) {
      console.error('Erro ao analisar imagem com Vision API:', error);
      // Retornar array vazio em caso de erro, não bloquear o upload
      return [];
    }
  }

  /**
   * Traduz um label do inglês para português
   * @param {string} englishLabel - Label em inglês
   * @returns {string} Label em português
   */
  static translateToPortuguese(englishLabel) {
    // Tentar tradução direta
    if (this.labelTranslations[englishLabel]) {
      return this.labelTranslations[englishLabel];
    }

    // Tentar tradução case-insensitive
    const lowerLabel = englishLabel.toLowerCase();
    const found = Object.keys(this.labelTranslations).find(
      (key) => key.toLowerCase() === lowerLabel
    );

    if (found) {
      return this.labelTranslations[found];
    }

    // Se não encontrar tradução, retornar o original capitalizado
    return englishLabel.charAt(0).toUpperCase() + englishLabel.slice(1).toLowerCase();
  }

  /**
   * Analisa uma imagem a partir de um arquivo (converte para base64)
   * @param {File} file - Arquivo de imagem
   * @returns {Promise<string[]>} Array de tags em português
   */
  static async analyzeImageFile(file) {
    try {
      // Converter arquivo para base64
      const base64Image = await this.fileToBase64(file);

      const apiUrl = `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_VISION_API_KEY}`;

      const requestBody = {
        requests: [
          {
            image: {
              content: base64Image,
            },
            features: [
              {
                type: 'LABEL_DETECTION',
                maxResults: 10,
              },
              {
                type: 'OBJECT_LOCALIZATION',
                maxResults: 10,
              },
            ],
          },
        ],
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Google Vision API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.responses || !data.responses[0]) {
        return [];
      }

      const result = data.responses[0];
      const tags = new Set();

      // Extrair labels
      if (result.labelAnnotations) {
        result.labelAnnotations.forEach((label) => {
          if (label.score > 0.7) {
            const translatedLabel = this.translateToPortuguese(label.description);
            tags.add(translatedLabel);
          }
        });
      }

      // Extrair objetos localizados
      if (result.localizedObjectAnnotations) {
        result.localizedObjectAnnotations.forEach((object) => {
          if (object.score > 0.7) {
            const translatedObject = this.translateToPortuguese(object.name);
            tags.add(translatedObject);
          }
        });
      }

      return Array.from(tags);
    } catch (error) {
      console.error('Erro ao analisar arquivo de imagem:', error);
      return [];
    }
  }

  /**
   * Converte arquivo para base64
   * @param {File} file - Arquivo
   * @returns {Promise<string>} Base64 string (sem o prefixo data:image)
   */
  static fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        // Remover o prefixo "data:image/...;base64,"
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}
