/**
 * Service: StorageService
 * Responsabilidade: Gerenciar upload e acesso a arquivos no Supabase Storage
 */

import { supabase } from '../supabase/supabaseClient';
import { SUPABASE_BUCKETS } from '../constants';

export class StorageService {
  /**
   * Faz upload de uma imagem para o Supabase Storage
   * @param {File} file - Arquivo a ser enviado
   * @returns {Promise<string>} URL pública da imagem
   */
  static async uploadImage(file) {
    if (!file) {
      throw new Error('Arquivo não fornecido');
    }

    const fileName = `${Date.now()}_${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from(SUPABASE_BUCKETS.IMAGES)
      .upload(fileName, file);

    if (uploadError) {
      throw new Error(`Erro ao fazer upload: ${uploadError.message}`);
    }

    const { data: publicUrlData } = supabase.storage
      .from(SUPABASE_BUCKETS.IMAGES)
      .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
  }

  /**
   * Remove uma imagem do Supabase Storage
   * @param {string} fileName - Nome do arquivo a ser removido
   */
  static async deleteImage(fileName) {
    const { error } = await supabase.storage
      .from(SUPABASE_BUCKETS.IMAGES)
      .remove([fileName]);

    if (error) {
      throw new Error(`Erro ao deletar imagem: ${error.message}`);
    }
  }
}
