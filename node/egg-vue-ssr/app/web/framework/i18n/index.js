import VueI18n from 'vue-i18n'
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import cn from './cn'
import en from './en'
export default function createI18n (locale) {
  return new VueI18n({
    locale,
    messages: {
      en: { ...en, ...enLocale },
      cn: { ...cn, ...zhLocale }
    }
  })
}
