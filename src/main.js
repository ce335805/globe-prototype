import Vue from 'vue'
import globe from '@/components/Globe'

import IncludeGlobe from './includeGlobe.vue'

Vue.config.productionTip = false

new Vue({
    render: h => h(IncludeGlobe),
}).$mount('#includeGlobe')


export default globe;
//export default projectClass;

