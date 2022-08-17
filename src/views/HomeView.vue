<template>
  <div class="home">
    <header>
      <img
          src="https://play-lh.googleusercontent.com/xLU1vbpYRxcw0rmBaBlT5dpVXfc6P66A0xalxdyMvvMP3lOIEb9xQcJM9EQDDttI6oc"
          alt="Radar automovilistico">
    </header>
    <main>
      <h1>Radar automovilistico</h1>
      <p>
        Radar automovilistico es una aplicación que permite visualizar el estado de las multas a vehiculos.
      </p>

      <form @submit.prevent="onSubmit">
        <div class="form-group">
          <label for="plate">Placa: </label>
          <input required maxlength="6" type="text" class="form-control" id="plate" v-model="plate" placeholder="Placa">
        </div>
        <div class="form-group">
          <label for="type">Tipo de vehiculo: </label>
          <select required id="type" v-model="type">
            <option value="flight">Volador</option>
            <option value="land">Terrestre</option>
          </select>
        </div>
        <div class="form-group">
          <label for="velocity">Velocidad (km/h): </label>
          <input required type="number" class="form-control" id="velocity" v-model="velocity"
                 placeholder="Velocidad en km/h">
        </div>
        <div v-if="type === 'flight'">
          <div class="form-group">
            <label for="height">Altura de vuelo (mts): </label>
            <input type="number" class="form-control" id="height" v-model="height"
                   placeholder="Altura de vuelo en metros">
          </div>
        </div>
        <div class="form-group">
          <span>
            Coordenadas:
          </span>
          <div class="form-group">
            <label for="x_coord">X: </label>
            <input required type="number" class="form-control" id="x_coord" v-model="x_coord"
                   placeholder="Coordenada X">
          </div>
          <div class="form-group">
            <label for="y_coord">Y: </label>
            <input required type="number" class="form-control" id="y_coord" v-model="y_coord" placeholder="Cordenada Y">
          </div>
        </div>
        <button type="submit" class="btn">Enviar</button>
      </form>
      <div v-if="infraction">
        <span>
          Distancia: {{ infraction.distance }}
        </span>
        <span>
          Ciudad asignada: {{ infraction.city }}
        </span>
        <span>
          Multa: {{ infraction.infraction_status }}
        </span>
      </div>

      <div class="form-group">
        <button @click="onValid">
          Ver multas validas
        </button>
        <button @click="onInvalid">
          Ver multas invalidas
        </button>
      </div>
      <div v-if="invalid">
        <h1>
          Multas invalidas
        </h1>
        <ul v-if="invalidInfractions.length > 0">
          <li v-for="infraction in invalidInfractions" :key="infraction.id">
            {{ infraction.id }} - {{ infraction.description }} - {{ infraction.city.name }} - {{
              infraction.vehicle.plate
            }}
          </li>
        </ul>
      </div>
      <div v-if="valid">
        <h1>
          Multas validas
        </h1>
        <ul v-if="validInfractions.length > 0">
          <li v-for="infraction in validInfractions" :key="infraction.id">
            {{ infraction.id }} - {{ infraction.description }} - {{ infraction.city.name }} - {{
              infraction.vehicle.plate
            }}
          </li>
        </ul>
      </div>
    </main>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'HomeView',
  data: () => ({
    plate: '',
    type: '',
    x_coord: 0,
    y_coord: 0,
    velocity: 0,
    height: 0,
    infraction: null,
    valid: false,
    invalid: false,
  }),
  computed: {
    invalidInfractions() {
      return this.$store.state.invalid_infractions
    },
    validInfractions() {
      return this.$store.state.valid_infractions
    }
  },
  async beforeCreate() {
    await this.$store.dispatch('set_valid_infractions');
    await this.$store.dispatch('set_invalid_infractions');
  },
  methods: {
    onValid() {
      this.valid = true;
      this.invalid = false;
      this.$store.dispatch('set_valid_infractions');
    },
    onInvalid() {
      this.valid = false;
      this.invalid = true;
      this.$store.dispatch('set_invalid_infractions');
    },
    async onSubmit() {
      await axios.post(process.env.VUE_APP_BACKEND_URL + '/api/multas/levantarMulta?plate=' + this.plate, {
        type: this.type,
        longitude: this.x_coord,
        latitude: this.y_coord,
        velocity: this.velocity,
        height: this.height
      }).then(async (response) => {
        this.infraction = response.data;
        await this.$store.dispatch('set_valid_infractions');
        await this.$store.dispatch('set_invalid_infractions');
      })
    }
  }
}
</script>

<style scoped>
img {
  border-radius: 10%;
  width: 250px;
  height: 250px;
}

form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.form-group {
  display: flex;
  flex-direction: column;
  align-items: center;
}

form > .form-group {
  margin-bottom: 1rem;;
}

.form-group > input {
  padding: 5px;
}
</style>
