<template>
  <Card class="mb-4">
    <template #title>Adicionar item perdido</template>
    <template #content>
      <div class="flex flex-col gap-3">
        <FileUpload
          mode="basic"
          name="image"
          accept="image/*"
          choose-label="Selecionar imagem"
          @select="onFileSelect"
        />
        <InputText
          v-model="descricao"
          placeholder="Descrição do item"
          class="w-full"
        />
        <Button
          label="Adicionar"
          icon="pi pi-plus"
          severity="success"
          @click="addItem"
        />
      </div>
    </template>
  </Card>
</template>

<script setup>
import { ref } from "vue";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { supabase } from "../supabase/supabaseClient";
import FileUpload from "primevue/fileupload";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Card from "primevue/card";

const descricao = ref("");
let file = null;

const emit = defineEmits(["added"]);

const onFileSelect = (event) => {
  file = event.files[0];
};

const addItem = async () => {
  if (!descricao.value || !file) {
    alert("Selecione uma imagem e preencha a descrição.");
    return;
  }

  try {
    const fileName = `${Date.now()}_${file.name}`;

    // 🔹 Upload no bucket "images"
    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    // 🔹 Pegar URL pública correta
    const { data: publicUrlData } = supabase.storage
      .from("images")
      .getPublicUrl(fileName);

    const imageUrl = publicUrlData.publicUrl;

    // 🔹 Salvar dados no Firestore
    await addDoc(collection(db, "itens"), {
      descricao: descricao.value,
      imageUrl,
      recuperado: false,
      createdAt: serverTimestamp(),
    });

    descricao.value = "";
    file = null;

    emit("added"); // avisa o componente pai
    alert("Item adicionado com sucesso!");
  } catch (error) {
    console.error("Erro ao adicionar item:", error);
    alert("Erro ao enviar imagem para o Supabase.");
  }
};
</script>
