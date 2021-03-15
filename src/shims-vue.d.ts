declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;
}

declare module '*.png'
declare module '*.jpg'
declare module '*.gif'
declare module 'vue2-org-tree'

declare module 'element-ui/lib/locale/lang/*' {
  export const elementLocale: any
}