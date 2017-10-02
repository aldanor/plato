<template>
  <q-card style="padding-top: 20px; margin-bottom: 0;">
    <q-card-main style="position: relative;">
      <p v-if="init" class="text-faded justify-center">
        Give me some data!
      </p>

      <p v-else-if="error" class="text-negative">
        Error: {{error}}.
      </p>

      <template v-else-if="data">
        <div class="row md-gutter items-center">
          <div class="col">
              <q-select radio v-model="dataCol"
                :options="colOptions" float-label="Column:">
              </q-select>
          </div>
          <div class="col">
            <template v-if="data.length > 1">
              <q-toggle right-label label="Header row"
                v-model="headerRow" @change="onHeaderChange">
              </q-toggle>
            </template>
          </div>
        </div>

        <div class="row md-gutter">
          <div class="col">
            <q-input class="num-input" v-model="rangeFrom"
              stack-label="Range: from" type="number" :max-decimals="0"
              @change="rangeFromChange" @blur="rangeFromBlur" :min="1">
            </q-input>
          </div>
          <div class="col">
            <q-input class="num-input" v-model="rangeTo"
              stack-label="Range: to" type="number" :max-decimals="0"
              @change="rangeToChange" @blur="rangeToBlur" :max="numRows">
            </q-input>
          </div>
        </div>

        <p>
          <q-list>
            <q-list-header>
              Sample (out of {{numRows}})
            </q-list-header>
            <q-item v-for="e, i in sample" :key="i">
              <q-item-main>{{e}}</q-item-main>
            </q-item>
          </q-list>
        </p>
      </template>

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
      dataCol: 0,
      rangeFrom: 1,
      rangeTo: 1
    }
  },

  methods: {
    onHeaderChange () {
      if (this.rangeTo > this.numRows) {
        this.rangeTo = this.numRows
      }
    },

    rangeFromBlur (event) {
      if (!this.rangeFrom || this.rangeFrom < 1) {
        this.rangeFrom = 1
      }
      else if (this.rangeFrom > this.rangeTo) {
        this.rangeFrom = this.rangeTo
      }
    },

    rangeFromChange (str) {
      return (this.rangeFrom = parseInt(str))
    },

    rangeToBlur (event) {
      if (!this.rangeTo || this.rangeTo > this.numRows) {
        this.rangeTo = this.numRows
      }
      else if (this.rangeTo < this.rangeFrom) {
        this.rangeTo = this.rangeFrom
      }
    },

    rangeToChange (str) {
      return (this.rangeTo = parseInt(str))
    },

    reset () {
      Object.assign(this.$data, this.$options.data())
    },

    submit () {
      this.$store.dispatch('setEntries', this.selectedData)
      this.$store.dispatch('stopUploading')
      this.reset()
    },

    cancel () {
      this.$store.dispatch('stopUploading')
    },

    getData (n) {
      let words = []
      const col = this.dataCol
      const data = this.data
      const offset = (this.headerRow ? 1 : 0) + this.rangeFrom - 1
      let length = n + offset
      if (length > this.data.length) {
        length = this.data.length
      }
      for (let i = offset; i < length; i++) {
        words.push(data[i][col])
      }
      return words
    },

    onParse (inputData) {
      if (/[\x00-\x08\x0E-\x1F]/.test(inputData)) {
        return 'non-text or binary input'
      }

      const results = Papa.parse(inputData, {
        skipEmptyLines: true,
        delimiter: ','
      })

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
      this.rangeToMin = this.rangeFrom = 1
      this.rangeFromMax = this.rangeTo = this.numRows
    }
  },

  computed: {
    ...mapGetters([
      'hasData'
    ]),

    numRows () {
      if (!this.data || !this.data.length) {
        return 0
      }
      return this.data.length - (this.headerRow ? 1 : 0)
    },

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
      return this.getData(this.rangeTo - this.rangeFrom + 1)
    },

    sample () {
      let n = this.rangeTo - this.rangeFrom + 1
      if (n > 3 || isNaN(n)) {
        n = 3
      }
      return this.getData(n)
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
.num-input > input[type="number"] {
  -moz-appearance: textfield !important;
}
.num-input > input[type="number"]::-webkit-outer-spin-button,
.num-input > input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
  margin: 0 !important;
}
</style>
