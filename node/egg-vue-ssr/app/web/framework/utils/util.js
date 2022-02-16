import dateUtil from 'element-ui/src/utils/date'

export function dateFormat (d, format) {
  return d ? dateUtil.format(new Date(d), format || 'yyyy-MM-dd HH:mm:ss') : '-'
}
