/// <reference path="../../adonisrc.ts" />
/// <reference path="../../config/inertia.ts" />

import '../css/app.css'
import { render } from 'solid-js/web'
import { createInertiaApp } from 'inertia-adapter-solid'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'

createInertiaApp({
  resolve(name) {
    return resolvePageComponent(`../pages/${name}.tsx`, import.meta.glob('../pages/**/*.tsx'))
  },
  setup({ el, App, props }) {
    render(() => <App {...props} />, el)
  },
})
