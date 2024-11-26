<template>
  <h1>La lista de Usuarios</h1>

  <v-data-table
    :group-by="groupBy"
    :headers="headers"
    :items="userIDS"
    :loading="loading"
    item-value="nombre">

    <template v-slot:group-header="{ item, columns, toggleGroup, isGroupOpen }">
      <tr>
        <td :colspan="columns.length">
          <VBtn
            :icon="isGroupOpen(item) ? '$expand' : '$next'"
            size="small"
            variant="text"
            @click="toggleGroup(item)"
          ></VBtn>
          <v-chip :color="getColor(item.value)">{{
              item.value === 'Cliente' ? 'Cliente' : 'Trabajador'
            }}
          </v-chip>

        </td>
      </tr>
    </template>

    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>LISTA DE USUARIOS</v-toolbar-title>
        <v-divider class="mx-4"
                   inset
                   vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog"
                  max-width="500px">
          <template v-slot:activator="{ props }">
            <v-btn class="mb-1"
                   color="primary"
                   dark
                   v-bind="props">Nuevo Usuario
            </v-btn>
          </template>
          <v-form ref="form">
            <v-card>
              <v-card-title><span class="text-h5">{{ formTitle }}</span></v-card-title>
              <v-card-text>
                <v-container>
                  <v-row justify="center">
                    <v-col cols="12"
                           md="4"
                           sm="6">
                      <v-text-field v-model="editedUser.nombre"
                                    variant="underlined"
                                    label="Nombre de Usuario"
                                    :rules="rules.nombreRule"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12"
                           md="4"
                           sm="6">
                      <v-select v-model="editedUser.rol"
                                :items="['Cliente','Trabajador']"
                                variant="underlined"
                                :rules="rules.rol"
                                label="Roles"
                      ></v-select>
                    </v-col>

                    <v-container v-if="editedUser.rol==='Cliente'"
                                 class="border-solid"
                                 border="primary xl">
                      <v-select v-model="editedUser.id_pais"
                                variant="underlined"
                                :items="countries"
                                item-title="nombre"
                                :rules="rules.pais"
                                item-value="id"
                                label="pais">
                      </v-select>
                      <v-select v-model="editedUser.id_sexo"
                                :items="gender"
                                item-title="nombre"
                                :rules="rules.sexo"
                                item-value="id"
                                variant="underlined"
                                label="sexo">
                      </v-select>
                      <v-text-field v-model="editedUser.edad"
                                    variant="underlined"
                                    :rules="rules.edad"
                                    placeholder="+18"
                                    label="edad">
                      </v-text-field>
                      <v-text-field v-model="editedUser.correo_electronico"
                                    variant="underlined"
                                    :rules="rules.correo"
                                    placeholder="example@gmail.com"
                                    label="correo">
                      </v-text-field>
                      <v-text-field v-model="editedUser.telefono"
                                    variant="underlined"
                                    label="telefono">
                      </v-text-field>
                    </v-container>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions class="justify-center">
                <v-btn color="blue-darken-1"
                       variant="text"
                       @click="close">Cancel
                </v-btn>
                <v-btn color="blue-darken-1"
                       variant="text"
                       @click="save">Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-form>
        </v-dialog>
        <v-dialog v-model="dialogDelete"
                  max-width="500px">
          <v-card>
            <v-card-title class="text-h5">¿Estás seguro de eliminar este Usuario?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1"
                     variant="text"
                     @click="closeDelete">Cancel
              </v-btn>
              <v-btn color="blue-darken-1"
                     variant="text"
                     @click="deleteItemConfirm">OK
              </v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>

    <template v-slot:item.actions="{ item }">
      <template v-if="item.rol==='Trabajador' && actualUser==='AdminGen'">
        <v-icon class="me-2"
                size="small"
                @click="editUser(item)">
          mdi-pencil
        </v-icon>
      </template>
      <v-icon size="small"
              @click="deleteUser(item)">
        mdi-delete
      </v-icon>
    </template>

    <template v-slot:no-data>
      <v-btn color="primary"
             @click="fetchDataUser">
        Reset
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
export default {
  name: 'UserList',
  data() {
    return {
      countries: [
        {id: 1, nombre: 'USA'},
        {id: 2, nombre: 'Canada'},
        // otros países...
      ],
      actualUser: 'AdminGen',
      gender: [
        {id: 1, nombre: 'Masculino'},
        {id: 2, nombre: 'Femenino'}
        // otros géneros...
      ],
      loading: false,
      editedIndex: -1,
      defaultUser: {
        nombre: '',
        rol: '',
        id_pais: null,
        id_sexo: null,
        edad: null,
        correo_electronico: '',
        telefono: ''
      },
      editedUser: {nombre: '', rol: '', id_pais: null, id_sexo: null, edad: null, correo_electronico: '', telefono: ''},
      dialog: false,
      dialogDelete: false,
      show: false,
      password: 'Password',
      userTarget: 0,
      groupBy: [{key: 'rol', order: 'asc'}],
      headers: [
        {title: 'Nombre Usuario', align: 'start', key: 'nombre', sortable: false},
        {title: 'Actions', key: 'actions', sortable: false}
      ],
      userIDS: [
        {
          id: 1,
          nombre: 'Juan Perez',
          rol: 'Cliente',
          id_pais: 1,
          id_sexo: 1,
          edad: 25,
          correo_electronico: 'juan.perez@example.com',
          telefono: '123456789'
        },
        {
          id: 2,
          nombre: 'Maria Gomez',
          rol: 'Trabajador',
          id_pais: 2,
          id_sexo: 2,
          edad: 30,
          correo_electronico: 'maria.gomez@example.com',
          telefono: '987654321'
        }
        // otros usuarios...
      ],
      rules: {
        edad: [v => !!v || 'Campo requerido', v => v >= 18 || 'Debe ser mayor de 18 años', v => v <= 100 || 'Debe ser menor de 100 años'],
        pais: [v => !!v || 'Seleccione su país'],
        correo: [v => !!v || !this.editedUser.telefono || 'Campo requerido si no hay teléfono', v => !v || /.+@.+\..+/.test(v) || 'E-mail debe ser válido'],
        sexo: [v => !!v || 'Seleccione su sexo'],
        nombreRule: [v => !!v || 'Campo requerido', v => v.length >= 3 || 'Mínimo 3 caracteres', v => !/\d/.test(v) || 'No puede contener números'],
        rol: [v => !!v || 'Seleccione un rol']
      }
    }
  },
  computed: {
    isCreating() {
      return this.editedIndex === -1;
    },
    formTitle() {
      return this.editedIndex === -1 ? 'New User' : 'Edit User';
    }
  },
  watch: {
    dialog(val) {
      val || this.close()
    },
    dialogDelete(val) {
      val || this.closeDelete()
    }
  },
  methods: {
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedUser = Object.assign({}, this.defaultUser);
        this.editedIndex = -1;
      });
    },
    getColor(rol) {
      let color = '';
      switch (rol) {
        case 'Cliente':
          color = 'green';
          break;
        case 'Trabajador':
          color = 'orange';
          break;
      }
      return color;
    },
    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedUser = Object.assign({}, this.defaultUser);
        this.editedIndex = -1;
      });
    },
    async save()
{
  if (!(await this.$refs.form.validate()).valid) {
    alert("Por favor, corrige los errores antes de guardar.");
    return;
  }
  if (this.editedIndex > -1) {
    try { // Actualizar usuario existente
      Object.assign(this.userIDS[this.editedIndex], this.editedUser);
      alert('Usuario modificado con éxito');
    } catch (error) {
      console.error('Error modificando el usuario:', error);
      alert('Error al modificar el usuario');
    }
  } else { // Crear nuevo usuario
    try {
      this.editedUser.id = this.userIDS.length + 1; // Asigna un nuevo ID al usuario
      this.userIDS.push(Object.assign({}, this.editedUser)); // Añadir a la lista de usuarios
      alert('Usuario creado con éxito');
    } catch (error) {
      console.error('Error creando el usuario:', error);
      alert('Error al crear el usuario');
    }
  }
  this.close();
},
    deleteUser(item) { this.editedIndex = this.userIDS.indexOf(item); this.editedUser = Object.assign({}, item); this.userTarget = this.editedUser.id; this.dialogDelete = true; },
    async deleteItemConfirm() { try { this.userIDS.splice(this.editedIndex, 1); // Eliminar usuario de la lista
       alert('Usuario eliminado con éxito'); } catch (error) { console.error('Error eliminando el usuario:', error); alert('Error al eliminar el usuario'); } this.closeDelete(); },
    editUser(item) { this.editedIndex = this.userIDS.indexOf(item); this.editedUser = Object.assign({}, item); this.dialog = true; },
}
}
</script>
