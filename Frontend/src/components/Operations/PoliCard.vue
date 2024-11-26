<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12">
        <h1 class="text-h4 text-center mb-6 primary--text">Pólizas de {{ client.nombre_usuario }}</h1>
      </v-col>
    </v-row>

    <v-row v-if="policies.length > 0">
      <v-col v-for="policy in policies" :key="policy.id" cols="12" sm="6" md="4">
        <v-card :class="[getCoverageClass(policy.tipoCobertura), getStatusClass(policy.estadoPoliza)]" elevation="2" hover>
          <v-card-title>{{ policy.agenciaSeguro }}</v-card-title>
          <v-card-text>
            <v-list dense>
              <v-list-item>
                <template v-slot:prepend>
                  <v-list-item-title>Número de Póliza:</v-list-item-title>
                </template>
                <v-list-item-subtitle>{{ policy.numero_poliza }}</v-list-item-subtitle>
              </v-list-item>

              <v-list-item>
                <template v-slot:prepend>
                  <v-list-item-title>Tipo de Seguro:</v-list-item-title>
                </template>
                <v-list-item-subtitle>{{ policy.tipoSeguro }}</v-list-item-subtitle>
              </v-list-item>

              <v-list-item v-if="isValidPolicy(policy.tipoSeguro)">
                <template v-slot:prepend>
                  <v-list-item-title>Estado Poliza:</v-list-item-title>
                </template>
                <v-list-item-subtitle :class="getStatusTextClass(policy.estadoPoliza)">{{ policy.estadoPoliza }}</v-list-item-subtitle>
              </v-list-item>

              <v-list-item v-else>
                <template v-slot:prepend>
                  <v-list-item-title>Estado Poliza:</v-list-item-title>
                </template>
                <v-list-item-subtitle class="error--text">No válida</v-list-item-subtitle>
              </v-list-item>

              <v-list-item>
                <template v-slot:prepend>
                  <v-list-item-title>Fecha de Inicio:</v-list-item-title>
                </template>
                <v-list-item-subtitle>{{ formatDate(policy.fecha_inicio) }}</v-list-item-subtitle>
              </v-list-item>

              <v-list-item>
                <template v-slot:prepend>
                  <v-list-item-title>Fecha de Finalización:</v-list-item-title>
                </template>
                <v-list-item-subtitle>{{ formatDate(policy.fecha_fin) }}</v-list-item-subtitle>
              </v-list-item>

              <v-list-item>
                <template v-slot:prepend>
                  <v-list-item-title>Tipo Cobertura:</v-list-item-title>
                </template>
                <v-list-item-subtitle>{{ policy.tipoCobertura }}</v-list-item-subtitle>
              </v-list-item>

              <v-list-item>
                <template v-slot:prepend>
                  <v-list-item-title>Pago Mensual:</v-list-item-title>
                </template>
                <v-list-item-subtitle>{{ formatCurrency(policy.prima_mensual) }}</v-list-item-subtitle>
              </v-list-item>

              <v-list-item>
                <template v-slot:prepend>
                  <v-list-item-title>Último Pago:</v-list-item-title>
                </template>
                <v-list-item-subtitle>{{ policy.monto_total_asegurado }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-else justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-alert type="info" text>
          Este cliente no tiene pólizas activas en este momento.
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'ClientPolicyDashboard',
  data() {
    return {
      client: {
        id_usuario: '1',
        nombre_usuario: 'usuario1',
        contrasenna: 'pass123',
        rol: 'Cliente'
      },
      policies: [
        {
          id: 1,
          numero_poliza: 'ABC123456',
          tipoSeguro: 'Vida',
          estadoPoliza: 'activa',
          fecha_inicio: '2023-01-01',
          fecha_fin: '2024-01-01',
          tipoCobertura: 'premium',
          prima_mensual: 100,
          monto_total_asegurado: 100000,
          agenciaSeguro: 'Seguros ABC'
        },
        {
          id: 2,
          numero_poliza: 'XYZ789101',
          tipoSeguro: 'Auto',
          estadoPoliza: 'vencida',
          fecha_inicio: '2022-01-01',
          fecha_fin: '2023-01-01',
          tipoCobertura: 'estandar',
          prima_mensual: 50,
          monto_total_asegurado: 50000,
          agenciaSeguro: 'Seguros XYZ'
        }
        // Añade más pólizas según sea necesario...
      ],
      seguros: ['Vida', 'Auto'] // Tipos de seguro válidos
    }
  },
  methods: {
    isValidPolicy(tipoSeguro) {
      return this.seguros.includes(tipoSeguro);
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
    formatCurrency(amount) {
      return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);
    },
    getCoverageClass(tipoCobertura) {
      switch (tipoCobertura) {
        case 'vip':
          return 'yellow lighten-3';
        case 'premium':
          return 'grey lighten-3';
        case 'estandar':
          return 'orange lighten-3';
        default:
          return '';
      }
    },
    getStatusClass(estadoPoliza) {
      switch (estadoPoliza) {
        case 'activa':
          return 'green--text text--darken-2';
        case 'cancelada':
          return 'red--text text--darken-2';
        case 'vencida':
          return 'blue--text text--darken-2';
        default:
          return '';
      }
    },
    getStatusTextClass(estadoPoliza) {
      switch (estadoPoliza) {
        case 'activa':
          return 'success--text';
        case 'cancelada':
          return 'error--text';
        case 'vencida':
          return 'info--text';
        default:
          return '';
      }
    }
  }
}
</script>

<style scoped>
.v-card {
  transition: all 0.3s ease;
}

.v-card:hover {
  transform: translateY(-5px);
}
</style>
