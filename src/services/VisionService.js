/**
 * Service: VisionService
 * Responsabilidade: Integração com Imagga para análise de imagens
 */

export class VisionService {
  static getAuthHeader() {
    const apiKey = import.meta.env.VITE_IMAGGA_API_KEY;
    const apiSecret = import.meta.env.VITE_IMAGGA_API_SECRET;

    return {
      Authorization: 'Basic ' + btoa(`${apiKey}:${apiSecret}`),
    };
  }

  /**
   * Analisa uma imagem usando URL pública
   * @param {string} imageUrl - URL pública da imagem
   * @returns {Promise<string[]>} Array de tags em português
   */
  static async analyzeImage(imageUrl) {
    try {
      const apiUrl =
        `/imagga/v2/tags?image_url=${encodeURIComponent(imageUrl)}&language=pt&limit=5`;

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          ...this.getAuthHeader(),
        },
      });

      if (!response.ok) {
        throw new Error(`Imagga API error: ${response.status}`);
      }

      const data = await response.json();

      if (!data.result?.tags?.length) {
        return [];
      }

      const tags = new Set();

      data.result.tags.forEach((item) => {
        if (item.confidence > 70 && item.tag?.pt) {
          tags.add(item.tag.pt);
        }
      });

      return Array.from(tags);
    } catch (error) {
      console.error('Erro ao analisar imagem (URL):', error);
      return [];
    }
  }

  /**
   * Analisa uma imagem a partir de um arquivo
   * @param {File} file - Arquivo de imagem
   * @returns {Promise<string[]>} Array de tags em português
   */
  static async analyzeImageFile(file) {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const apiUrl =
        '/imagga/v2/tags?language=pt&limit=5';

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          ...this.getAuthHeader(),
          // NÃO definir Content-Type
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Imagga API error: ${response.status}`);
      }

      const data = await response.json();

      if (!data.result?.tags?.length) {
        return [];
      }

      const tags = new Set();

      data.result.tags.forEach((item) => {
        if (item.confidence > 70 && item.tag?.pt) {
          tags.add(item.tag.pt);
        }
      });

      return Array.from(tags);
    } catch (error) {
      console.error('Erro ao analisar arquivo de imagem:', error);
      return [];
    }
  }
}
