import {
	componentType
} from './types/form.js'

const componentMap = new Map();
 
import AssociatePicker from '../../uni_modules/uni-associate-picker/components/uni-associate-picker/uni-associate-picker'
import DataSelect from '../../uni_modules/uni-data-select/components/uni-data-select/uni-data-select'
 
import DatetimePicker from '../../uni_modules/uni-datetime-picker/components/uni-datetime-picker/uni-datetime-picker'
import Switch from '../../uni_modules/uni-switch/components/uni-switch/uni-switch'
import Tab from '../../uni_modules/uni-tab/components/uni-tab/uni-tab'
import Segmented from '../../uni_modules/uni-segmented-control/components/uni-segmented-control/uni-segmented-control'
 
componentMap.set(componentType.associatePicker, AssociatePicker);
componentMap.set(componentType.select, DataSelect);
 
componentMap.set(componentType.switch, Switch);
componentMap.set(componentType.date, DatetimePicker);
componentMap.set(componentType.dateTime, DatetimePicker);
componentMap.set(componentType.dateRange, DatetimePicker);
componentMap.set(componentType.dateTimeRange, DatetimePicker);
componentMap.set(componentType.tab, Tab);
componentMap.set(componentType.segmented, Segmented);
 

export {
	componentMap
};