<template>
  <div class="login-view">
    <div class="login-container">
      <Card class="login-card">
        <template #title>
          <div class="login-header">
            <div class="login-icon">
              <i class="pi pi-search"></i>
            </div>
            <h1 class="login-title">Achados & Perdidos</h1>
            <p class="login-subtitle">
              {{ isRegisterMode ? 'Criar nova conta' : 'Faça login para continuar' }}
            </p>
          </div>
        </template>

        <template #content>
          <form @submit.prevent="handleSubmit" class="login-form">
            <!-- Nome (apenas no modo registro) -->
            <div v-if="isRegisterMode" class="form-group">
              <label for="name" class="form-label">
                <i class="pi pi-user"></i>
                Nome
              </label>
              <InputText
                id="name"
                v-model="displayName"
                placeholder="Seu nome completo"
                class="form-input"
                size="large"
              />
            </div>

            <!-- Email -->
            <div class="form-group">
              <label for="email" class="form-label">
                <i class="pi pi-envelope"></i>
                Email
              </label>
              <InputText
                id="email"
                v-model="email"
                type="email"
                placeholder="seu@email.com"
                class="form-input"
                size="large"
                required
              />
            </div>

            <!-- Senha -->
            <div class="form-group">
              <label for="password" class="form-label">
                <i class="pi pi-lock"></i>
                Senha
              </label>
              <Password
                id="password"
                v-model="password"
                placeholder="Mínimo 6 caracteres"
                :feedback="false"
                toggleMask
                class="form-input password-input"
                inputClass="w-full"
                size="large"
                required
              />
            </div>

            <!-- Mensagem de erro -->
            <Transition name="fade">
              <Message v-if="error" severity="error" :closable="false" class="error-message">
                <i class="pi pi-exclamation-circle"></i>
                {{ error }}
              </Message>
            </Transition>

            <!-- Botões -->
            <div class="form-actions">
              <Button
                type="submit"
                :label="isRegisterMode ? 'Criar Conta' : 'Entrar'"
                :icon="isRegisterMode ? 'pi pi-user-plus' : 'pi pi-sign-in'"
                :loading="loading"
                :disabled="loading"
                class="submit-btn"
                size="large"
              />

              <Button
                type="button"
                :label="isRegisterMode ? 'Já tenho conta' : 'Criar nova conta'"
                :icon="isRegisterMode ? 'pi pi-arrow-left' : 'pi pi-user-plus'"
                @click="toggleMode"
                class="toggle-btn"
                severity="secondary"
                outlined
                size="large"
              />
            </div>
          </form>

          <!-- Informação sobre admin -->
          <div class="info-box">
            <i class="pi pi-info-circle info-icon"></i>
            <div class="info-content">
              <strong>Informação:</strong> Apenas emails cadastrados como administradores
              podem adicionar, editar ou deletar itens. Outros usuários podem apenas visualizar.
            </div>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables';
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import Message from 'primevue/message';

const router = useRouter();
const { login, register, loading, error, clearError } = useAuth();

// Estado do formulário
const email = ref('');
const password = ref('');
const displayName = ref('');
const isRegisterMode = ref(false);

/**
 * Alterna entre modo login e registro
 */
const toggleMode = () => {
  isRegisterMode.value = !isRegisterMode.value;
  clearError();
  // Limpar campos ao alternar
  password.value = '';
};

/**
 * Processa o envio do formulário
 */
const handleSubmit = async () => {
  clearError();

  let result;
  
  if (isRegisterMode.value) {
    result = await register(email.value, password.value, displayName.value);
  } else {
    result = await login(email.value, password.value);
  }

  if (result.success) {
    // Redirecionar para home após login/registro
    router.push('/');
  }
};
</script>

<style scoped>
.login-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  background: linear-gradient(135deg, var(--app-bg) 0%, var(--app-surface-hover) 100%);
}

.login-container {
  width: 100%;
  max-width: 480px;
}

.login-card {
  box-shadow: var(--app-shadow-lg) !important;
  border-radius: var(--app-radius-lg) !important;
}

.login-header {
  text-align: center;
  padding: 1rem 0;
}

.login-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, var(--app-primary) 0%, var(--app-primary-hover) 100%);
  border-radius: 50%;
  margin: 0 auto 1.5rem;
  color: white;
  font-size: 1.75rem;
  box-shadow: var(--app-shadow-md);
}

.login-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: var(--app-text);
  margin: 0 0 0.5rem 0;
}

.login-subtitle {
  font-size: 1rem;
  color: var(--app-text-secondary);
  margin: 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--app-text);
}

.form-label i {
  color: var(--app-primary);
}

.form-input {
  width: 100%;
}

.password-input :deep(.p-password) {
  width: 100%;
}

.password-input :deep(.p-password input) {
  width: 100%;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.submit-btn,
.toggle-btn {
  width: 100%;
  justify-content: center;
  font-weight: 600;
}

.info-box {
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
  margin-top: 1.5rem;
  background-color: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: var(--app-radius);
  font-size: 0.875rem;
  color: var(--app-text-secondary);
  line-height: 1.6;
}

.app-dark .info-box {
  background-color: rgba(96, 165, 250, 0.1);
  border-color: rgba(96, 165, 250, 0.2);
}

.info-icon {
  color: var(--app-primary);
  font-size: 1.25rem;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.info-content {
  flex: 1;
}

.info-content strong {
  color: var(--app-text);
}

/* Transições */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsividade */
@media (max-width: 640px) {
  .login-view {
    padding: 1rem 0.75rem;
  }
  
  .login-icon {
    width: 56px;
    height: 56px;
    font-size: 1.5rem;
  }
  
  .login-title {
    font-size: 1.5rem;
  }
  
  .login-subtitle {
    font-size: 0.875rem;
  }
  
  .info-box {
    font-size: 0.8125rem;
  }
}
</style>
