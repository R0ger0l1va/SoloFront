<template>
  <v-container class="auth-container" fill-height fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" lg="8" md="6" sm="8">
        <v-card class="elevation-12">
          <v-window v-model="step">
            <v-window-item :value="1">
              <v-row>
                <v-col cols="12" md="8">
                  <v-card-text>
                    <h1 class="text-center text-h4 mb-5">Crear Cuenta</h1>
                    <v-form ref="signupForm" v-model="isFormValid" @submit.prevent="signUp">
                      <v-row>
                        <v-col cols="12" md="6">
                          <v-text-field
                            v-model="registerForm.nombre_usuario"
                            :rules="[
                              v => !!v || 'Campo requerido',
                              v => v.length >= 3 || 'Mínimo 3 caracteres',
                              v => !/\d/.test(v) || 'No puede contener números'
                            ]"
                            label="Nombre"
                            required
                            @blur="validateUsername"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field
                            v-model="registerForm.apellido_cliente"
                            :rules="[v => !v || !/\d/.test(v) || 'No puede contener números']"
                            label="Apellido (Opcional)"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12" md="6">
                          <v-select
                            v-model="registerForm.id_pais"
                            :items="countries"
                            :rules="[v => !!v || 'Seleccione un país']"
                            item-title="nombre"
                            item-value="id"
                            label="País"
                            required
                          ></v-select>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-select
                            v-model="registerForm.id_sexo"
                            :items="gender"
                            item-title="nombre"
                            item-value="id"
                            label="Sexo"
                          ></v-select>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12" md="6">
                          <v-text-field
                            v-model.number="registerForm.edad"
                            :rules="[
                              v => !!v || 'Campo requerido',
                              v => v >= 18 || 'Debe ser mayor de 18 años',
                              v => v <= 100 || 'Debe ser menor de 100 años'
                            ]"
                            label="Edad"
                            required
                            type="number"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field
                            v-model="registerForm.direccion_postal"
                            label="Dirección Postal (Opcional)"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12" md="6">
                          <v-text-field
                            v-model="registerForm.telefono"
                            label="Teléfono (Opcional)"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field
                            v-model="registerForm.correo_electronico"
                            :rules="[
                              v => !!v || !registerForm.telefono || 'Campo requerido si no hay teléfono',
                              v => !v || /.+@.+\..+/.test(v) || 'E-mail debe ser válido'
                            ]"
                            label="Correo Electrónico"
                            type="email"
                            @blur="validateEmail"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12" md="6">
                          <v-text-field
                            v-model="registerForm.contrasenna"
                            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                            :rules="[
                              v => !!v || 'Campo requerido',
                              v => v.length >= 3 || 'Mínimo 3 caracteres'
                            ]"
                            :type="showPassword ? 'text' : 'password'"
                            label="Contraseña"
                            required
                            @click:append="showPassword = !showPassword"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field
                            v-model="registerForm.carnet_identidad"
                            :append-icon="showCarnet ? 'mdi-eye' : 'mdi-eye-off'"
                            :rules="[v => !v || !/[a-zA-Z]/.test(v) || 'No puede contener letras']"
                            :type="showCarnet ? 'text' : 'password'"
                            label="Carnet de Identidad (Opcional)"
                            @click:append="showCarnet = !showCarnet"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                      <v-btn
                        :disabled="!isFormValid"
                        block
                        class="mt-4"
                        color="primary"
                        type="submit"
                      >
                        Registrarse
                      </v-btn>
                    </v-form>
                  </v-card-text>
                </v-col>
                <v-col class="bg-primary" cols="12" md="4">
                  <v-card-text class="white--text text-center d-flex flex-column justify-center align-center h-100">
                    <h2 class="text-h4 mb-4">¡Bienvenido!</h2>
                    <p>¿Ya tienes una cuenta?</p>
                    <v-btn dark outlined @click="step++">Iniciar Sesión</v-btn>
                  </v-card-text>
                </v-col>
              </v-row>
            </v-window-item>

            <v-window-item :value="2">
              <v-row>
                <v-col class="bg-primary" cols="12" md="4">
                  <v-card-text class="white--text text-center d-flex flex-column justify-center align-center h-100">
                    <h2 class="text-h4 mb-4">¡Hola, amigo!</h2>
                    <p>¿No tienes una cuenta?</p>
                    <v-btn dark outlined @click="step--">Registrarse</v-btn>
                  </v-card-text>
                </v-col>
                <v-col cols="12" md="8">
                  <v-card-text>
                    <h1 class="text-center text-h4 mb-5">Iniciar Sesión</h1>
                    <v-form ref="signinForm" v-model="isFormLoginValid" @submit.prevent="signIn">
                      <v-text-field
                        v-model="loginForm.nombre_usuario"
                        :rules="[v => !!v || 'Campo requerido']"
                        label="Nombre de Usuario"
                        required
                      ></v-text-field>
                      <v-text-field
                        v-model="loginForm.contrasenna"
                        :append-icon="showLoginPassword ? 'mdi-eye' : 'mdi-eye-off'"
                        :rules="[
                          v => !!v || 'Campo requerido',
                          v => v.length >= 3 || 'Mínimo 3 caracteres'
                        ]"
                        :type="showLoginPassword ? 'text' : 'password'"
                        label="Contraseña"
                        required
                        @click:append="showLoginPassword = !showLoginPassword"
                      ></v-text-field>
                      <v-btn class="mb-4" color="primary" text>¿Olvidaste tu contraseña?</v-btn>
                      <v-btn
                        :disabled="!isFormLoginValid"
                        block
                        class="mt-4"
                        color="primary"
                        type="submit"
                      >
                        Iniciar Sesión
                      </v-btn>
                    </v-form>
                  </v-card-text>
                </v-col>
              </v-row>
            </v-window-item>
          </v-window>
        </v-card>
      </v-col>
    </v-row>
    <v-snackbar v-model="showAlert" :color="isSuccess ? 'success' : 'error'" :timeout="3000">
      {{ alertMessage }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="showAlert = false">Cerrar</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
export default {
  name: 'LoginRegister',
  data: () => ({
    step: 1,
    isFormValid: false,
    isFormLoginValid: false,
    showPassword: false,
    showLoginPassword: false,
    showCarnet: false,
    showAlert: false,
    isSuccess: false,
    alertMessage: '',

    // Datos locales para el registro
    registerForm: {
      nombre_usuario: '',
      apellido_cliente: '',
      numero_identidad_cliente: '',
      nombre_cliente: '',
      rol: '',
      id_pais: null,
      id_sexo: null,
      edad: null,
      direccion_postal: '',
      telefono: '',
      correo_electronico: '',
      contrasenna: '',
      carnet_identidad: null,
    },
    loginForm: {
      id_usuario: '',
      nombre_usuario: '',
      contrasenna: '',
      rol: ''
    },
    // Datos simulados
    countries: [
      { id: 1, nombre: 'País A' },
      { id: 2, nombre: 'País B' },
    ],
    gender: [
      { id: 1, nombre: 'Masculino' },
      { id: 2, nombre: 'Femenino' },
    ],
    clienteData: [],
    usuarioData: [
      { id: 1, nombre: 'usuario1', contrasenna: 'pass123', rol:'Cliente' },
      { id: 2, nombre: 'usuario2', contrasenna: 'pass456' , rol:'AdminGen'},
    ],
  }),
  computed: {
    isRegisterFormValid() {
      return this.isFormValid;
    },
    isLoginFormValid() {
      return this.isFormLoginValid;
    },
  },
  methods: {
    validateUsername() {
      const existingUser = this.usuarioData.find(usuario => usuario.nombre === this.registerForm.nombre_usuario);
      if (existingUser) {
        this.showAlertMessage('Nombre de usuario ya existe', false);
      }
      return !existingUser;
    },
    validateEmail() {
      const existingEmail = this.clienteData.find(cliente => cliente.email === this.registerForm.correo_electronico);
      if (existingEmail) {
        this.showAlertMessage('Email ya existe', false);
      }
      return !existingEmail;
    },
    signUp() {
      if (this.isRegisterFormValid) {
        if (!this.validateUsername() || !this.validateEmail()) {
          this.showAlertMessage('Nombre de usuario o email ya existen', false);
          return;
        }
        this.registerForm.nombre_cliente = this.registerForm.nombre_usuario;
        this.showAlertMessage('Registro exitoso', true);
        this.resetForm();
      }
    },
    signIn() {
      const existingUser = this.usuarioData.find(usuario => usuario.nombre === this.loginForm.nombre_usuario);
      if (!existingUser) {
        this.showAlertMessage('Usuario no encontrado', false);
        return;
      }
      if (existingUser.contrasenna !== this.loginForm.contrasenna) {
        this.showAlertMessage('Contraseña incorrecta', false);
        return;
      }
      this.showAlertMessage('Inicio de sesión exitoso', true);
      this.redirectUser(existingUser.rol)
      this.$emit('login', {userName: existingUser.nombre, userType: existingUser.rol}); // Emitir detalles del usuario
      sessionStorage.setItem('session', JSON.stringify(existingUser));

    },
    showAlertMessage(message, isSuccess) {
      this.alertMessage = message;
      this.isSuccess = isSuccess;
      this.showAlert = true;
    },
    resetForm() {
      this.registerForm = {
        nombre_usuario: '',
        apellido_cliente: '',
        numero_identidad_cliente: '',
        nombre_cliente: '',
        rol: '',
        id_pais: null,
        id_sexo: null,
        edad: null,
        direccion_postal: '',
        telefono: '',
        correo_electronico: '',
        contrasenna: '',
        carnet_identidad: null,
      };
      this.isFormValid = false;
    },
    redirectUser(role) {
      const routes = {
        'Cliente': '/clientview',
        'Vendedor': '/workerview',
        'AdminGen': '/adminview'
      };
      const route = routes[role];
      if (route) {
        this.$router.push({path: route});
      } else {
        this.showAlertMessage('Rol desconocido', false);
      }
    },
  },
};
</script>

<style scoped>
.auth-container {
  background: #f6f5f7;
}

.bg-primary {
  background: linear-gradient(to right, #046c54, #046c54, green);
}
</style>

