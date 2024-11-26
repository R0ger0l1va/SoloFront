<template>
  <h1>LA LISTA DE POLIZAS</h1>
  <v-data-table-server
    :headers="headers"
    :items="polizas"
    :items-length="totalItems"
    :loading="loading"
    item-value="numero_poliza"
    @update:options="fetchData"
  >
    <template v-slot:item.estadoNombre="{ value }">
      <v-chip :color="getColorState(value)">
        {{ value }}
      </v-chip>
    </template>
    <template v-slot:item.tipoCoberturaNombre="{ value }">
      <v-chip :color="getColorCoberture(value)">
        {{ value }}
      </v-chip>
    </template>
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title> LISTA DE POLIZAS</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ props }">
            <v-btn class="mb-1" color="primary" dark v-bind="props">
              Nueva Poliza
            </v-btn>
          </template>
          <v-form ref="form">
            <v-card>
              <v-card-title><span class="text-h5">{{ formTitle }}</span></v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" md="4" sm="6">
                      <v-select
                        v-model="editedPoliza.id_agencia_seguro"
                        :items="agencias"
                        item-title="nombre"
                        item-value="id"
                        variant="underlined"
                        density="compact"
                        label="Agencias Seguro"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" md="4" sm="6">
                      <v-select
                        v-model="editedPoliza.id_tipo_seguro"
                        :items="tiposSeguro"
                        item-title="nombre"
                        item-value="id"
                        variant="underlined"
                        density="compact"
                        label="Tipos Seguro"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" md="4" sm="6">
                      <v-select
                        v-model="editedPoliza.id_tipo_cobertura"
                        :items="tiposCoberturas"
                        item-title="nombre"
                        item-value="id"
                        variant="underlined"
                        density="compact"
                        label="Tipos Cobertura"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" md="4" sm="6">
                      <v-text-field
                        v-model="editedPoliza.prima_mensual"
                        variant="underlined"
                        label="Prima Mensual"
                        :rules="[rules.primaRule]"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4" sm="6">
                      <v-text-field
                        v-model="editedPoliza.id_estado_poliza"
                        variant="underlined"
                        label="Estado"
                        :readonly="isCreating"
                        disabled
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4" sm="6">
                      <v-text-field
                        v-model="editedPoliza.monto_total_asegurado"
                        model-value="0"
                        variant="underlined"
                        label="Monto Total"
                        readonly
                        disabled
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4" sm="6">
                      <v-select
                        v-model="editedPoliza.numero_identidad_cliente"
                        :items="clientes"
                        item-title="nombre"
                        item-value="id"
                        variant="underlined"
                        density="compact"
                        label="Cliente"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" md="4" sm="6">
                      <v-date-input
                        :rules="[rules.fechaInicioRule]"
                        color="primary"
                        v-model="editedPoliza.fecha_inicio"
                        variant="underlined"
                        label="Fecha Inicio"
                      ></v-date-input>
                    </v-col>
                    <v-col cols="12" md="4" sm="6">
                      <v-date-input
                        :rules="[rules.fechaFinRule]"
                        color="primary"
                        v-model="editedPoliza.fecha_fin"
                        variant="underlined"
                        label="Fecha Fin"
                      ></v-date-input>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue-darken-1" variant="text" @click="close">
                  Cancel
                </v-btn>
                <v-btn color="blue-darken-1" variant="text" @click="save">
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-form>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">¿Estás Seguro de Eliminar esta Poliza?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon class="me-2" size="small" @click="editPoliza(item)">
        mdi-pencil
      </v-icon>
      <v-icon size="small" @click="deletePoliza(item)">
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize">Reset</v-btn>
    </template>
  </v-data-table-server>
</template>

<script>
export default {
  name: 'PoliList',
  data() {
    return {
      editedIndex: -1,
      defaultPoliza: {},
      editedPoliza: {},
      polTarget: 0,
      totalItems: 0,
      dialog: false,
      dialogDelete: false,
      loading: false,
      // Datos locales
      polizas: [
        {
          numero_poliza: 1,
          id_agencia_seguro: 1,
          id_tipo_seguro: 1,
          id_tipo_cobertura: 1,
          prima_mensual: 150,
          id_estado_poliza: 3,
          monto_total_asegurado: 10000,
          numero_identidad_cliente: 1,
          fecha_inicio: '2024-01-01',
          fecha_fin: '2025-01-01',
        },
        // Agrega más pólizas según sea necesario
      ],
      agencias: [
        { id: 1, nombre: 'Agencia A' },
        { id: 2, nombre: 'Agencia B' },
      ],
      tiposSeguro: [
        { id: 1, nombre: 'Seguro A' },
        { id: 2, nombre: 'Seguro B' },
      ],
      tiposCoberturas: [
        { id: 1, nombre: 'Cobertura A' },
        { id: 2, nombre: 'Cobertura B' },
      ],
      clientes: [
        { id: 1, nombre: 'Cliente A' },
        { id: 2, nombre: 'Cliente B' },
      ],
      headers: [
        { title: 'Agencia', align: 'start', sortable: true, key: 'id_agencia_seguro' },
        { title: 'Tipo de Seguro', key: 'id_tipo_seguro', sortable: true, align: 'end' },
        { title: 'Cobertura', key: 'id_tipo_cobertura', align: 'end', sortable: true },
        { title: 'Prima Mensual', key: 'prima_mensual', align: 'end', sortable: true },
        { title: 'Estado', key: 'id_estado_poliza', align: 'end', sortable: true },
        { title: 'Cliente', key: 'numero_identidad_cliente', align: 'end', sortable: true },
        { title: 'Fecha de Inicio', key: 'fecha_inicio', align: 'end', sortable: true },
        { title: 'Fecha de Fin', key: 'fecha_fin', align: 'end', sortable: true },
        { title: 'Actions', key: 'actions', sortable: false },
      ],
      rules: {
        fechaInicioRule: value => !value || (new Date(value) <= new Date(this.editedPoliza.fecha_fin)) || 'La fecha inicial no puede ser mayor que la fecha final.',
        fechaFinRule: value => !value || (new Date(value) >= new Date(this.editedPoliza.fecha_inicio)) || 'La fecha final no puede ser menor que la fecha inicial.',
        primaRule: value => (value >= 100) || 'La prima mensual no puede ser menor que 100.',
      },
    };
  },
  computed: {
    isCreating() {
      return this.editedIndex === -1;
    },
    formTitle() {
      return this.editedIndex === -1 ? 'Nueva Póliza' : 'Editar Póliza';
    },
  },
  methods: {
    fetchData() {
      this.totalItems = this.polizas.length;
      // Aquí podrías implementar lógica para paginación o clasificación si es necesario
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedPoliza = Object.assign({}, this.defaultPoliza);
        this.editedIndex = -1;
      });
    },
    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedPoliza = Object.assign({}, this.defaultPoliza);
        this.editedIndex = -1;
      });
    },
    save() {
      if (!(this.$refs.form.validate()).valid) {
        return;
      }
      if (this.editedIndex > -1) {
        // Actualizar póliza existente
        Object.assign(this.polizas[this.editedIndex], this.editedPoliza);
        alert('Póliza modificada con éxito');
      } else {
        // Crear nueva póliza
        this.polizas.push({ ...this.editedPoliza, numero_poliza: this.polizas.length + 1 });
        alert('Póliza creada con éxito');
      }
      this.close();
      this.fetchData();
    },
    editPoliza(item) {
      this.editedIndex = this.polizas.indexOf(item);
      this.editedPoliza = Object.assign({}, item);
      this.dialog = true;
    },
    deletePoliza(item) {
      this.editedIndex = this.polizas.indexOf(item);
      this.editedPoliza = Object.assign({}, item);
      this.polTarget = this.editedPoliza.numero_poliza;
      this.dialogDelete = true;
    },
    deleteItemConfirm() {
      this.polizas.splice(this.editedIndex, 1);
      alert('Póliza eliminada con éxito');
      this.closeDelete();
      this.fetchData();
    },
    getAgenciaNombre(id) {
      const agencia = this.agencias.find(a => a.id === id);
      return agencia ? agencia.nombre : 'Desconocida';
    },
    getTipoSeguroNombre(id) {
      const tipo = this.tiposSeguro.find(t => t.id === id);
      return tipo ? tipo.nombre : 'Desconocido';
    },
    getTipoCoberturaNombre(id) {
      const cobertura = this.tiposCoberturas.find(c => c.id === id);
      return cobertura ? cobertura.nombre : 'Desconocida';
    },
    getClienteNombre(id) {
      const cliente = this.clientes.find(c => c.id === id);
      return cliente ? cliente.nombre : 'Desconocido';
    },
    getEstadoNombre(id) {
      let result = '';
      switch (id) {
        case 1:
          result = 'Cancelada';
          break;
        case 2:
          result = 'Vencida';
          break;
        case 3:
          result = 'Activa';
          break;
        default:
          result = 'Desconocido';
          break;
      }
      return result;
    },
    getColorState(estadoNombre) {
      let color = '';
      switch (estadoNombre) {
        case 'Activa':
          color = 'green';
          break;
        case 'Vencida':
          color = 'red';
          break;
        case 'Cancelada':
          color = 'orange';
          break;
      }
      return color;
    },
    getColorCoberture(tipoCoberturaNombre) {
      let color = '';
      switch (tipoCoberturaNombre) {
        case 'Estandar':
          color = '#cd7f32';
          break;
        case 'Premium':
          color = '#c0c0c0';
          break;
        case 'VIP':
          color = '#ffd700';
          break;
      }
      return color;
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
  },
  mounted() {
    this.fetchData();
  },
};
</script>
