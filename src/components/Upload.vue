<template>
  <q-card style="padding-top: 20px; margin-bottom: 0;">
    <q-card-main style="position: relative;">
      <p v-if="data">
        Total entries: {{selectedData.length}}.
      </p>

      <p v-if="init" class="text-faded justify-center">
        Give me some data!
      </p>

      <p v-else-if="error" class="text-negative">
        Error: {{error}}.
      </p>

      <p v-else-if="data && data.length > 1">
        <q-checkbox right-label label="There's a header row" v-model="headerRow">
        </q-checkbox>
      </p>

      <p v-if="data">
        <q-select radio v-model="dataCol"
          :options="colOptions" float-label="Extract words from this column">
        </q-select>
      </p>

      <p v-if="data">
        <q-list>
          <q-list-header>
            Sample Entries
          </q-list-header>
          <q-item v-for="e, i in sample" :key="i">
            <q-item-main>{{e}}</q-item-main>
          </q-item>
        </q-list>
      </p>

      <q-card-actions>
        <input type="file" id="file" name="file" accept=".csv" ref="file" />
        <q-btn v-if="!init && !error && data" color="positive" @click="submit">Continue</q-btn>
        <q-btn color="primary" @click="$refs.file.click()">Upload</q-btn>
        <q-btn v-if="hasData" color="negative" @click="cancel">Cancel</q-btn>
      </q-card-actions>
    </q-card-main>
  </q-card>
</template>

<script>
import Papa from 'papaparse'
import { mapGetters } from 'vuex'

export default {
  name: 'upload',

  data () {
    return {
      init: true,
      error: '',
      data: null,
      numCols: 0,
      headerRow: false,
      dataCol: 0
    }
  },

  methods: {
    reset () {
      Object.assign(this.$data, this.$options.data())
    },

    submit () {
      this.$store.dispatch('setEntries', this.selectedData)
      this.$store.dispatch('stopUploading')
    },

    cancel () {
      this.$store.dispatch('stopUploading')
    },

    onParse (inputData) {
      if (/[\x00-\x08\x0E-\x1F]/.test(inputData)) {
        return 'non-text or binary input'
      }

      const results = Papa.parse(inputData, {
        skipEmptyLines: true,
        delimiter: ','
      })
      console.log(results)

      if (results.errors.length > 0) {
        let err = results.errors[0].message
        return err[0].toLowerCase() + err.slice(1).split(/;/)[0]
      }
      const data = results.data
      if (!data.length) {
        return 'empty input file'
      }

      this.numCols = Math.min(...data.map(a => a.length))
      this.headerRow = false
      this.data = data
    }
  },

  computed: {
    ...mapGetters([
      'hasData'
    ]),

    colOptions () {
      if (!this.data) {
        return []
      }
      let options = []
      for (let i = 0; i < this.numCols; i++) {
        const colName = this.headerRow
          ? `${this.data[0][i]}`
          : `#${i + 1}`
        options.push({label: colName, value: i})
      }
      return options
    },

    selectedData () {
      if (!this.data) {
        return []
      }
      let words = []
      for (let i = this.headerRow ? 1 : 0; i < this.data.length; i++) {
        words.push(this.data[i][this.dataCol])
      }
      return words
    },

    sample () {
      return this.selectedData.slice(0, 4)
    }
  },

  mounted () {
    this.$refs.file.addEventListener('change', event => {
      let reader = new FileReader()
      reader.onload = event => {
        this.$refs.file.value = ''
        this.init = false
        this.error = this.onParse(event.target.result)
      }
      reader.readAsText(event.target.files[0])
    }, false)
  }
}
</script>

<style scoped>
</style>

