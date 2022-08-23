<template>
	<view class="contact_wrap" :style="{'height':windowHeight+'px'}">
		<bugking7-letter-list :showAllLetter="showSelectBtn ? false : showAllLetter" :letterWidth="letterPropWidth"
			:letterList="formarContactlist"
			:style="[{'position': 'fixed','right': 0,'bottom':0,'top': windowTop+'px' ,'z-index': 998}]"
			:windowTop="windowTop" :windoweight="windowHeight" @allLetterListClick="handleAllLetterClick">
		</bugking7-letter-list>
		<scroll-view class="contact_list"
			:style="[{'height':windowHeight+'px','padding-bottom': showSelectBtn ? '70px' : '0px' }]" :scroll-y="true"
			:scroll-into-view="scrollIntoView" :scroll-top="scrollTop" @scroll="handleScroll">
			<view class="head_list" v-show="headOptions.showHead && !showSelectBtn">
				<view class="head_item" :style="{'height':headOptions.headItemHeight+'px'}" 
					v-for="(item,index) in headOptions.headList" :key="index"
					@tap.stop="handleHeadItemClick(index)"
				>
					<image :src="item[headOptions.headAvatarValue]"
					 :style="[{'width':(headOptions.headItemHeight - 10) + 'px','height':(headOptions.headItemHeight - 10) + 'px','border-radius': '5px','margin-left': '8px'}]"></image>
					<view class="head_title" style="margin-left: 10px;">{{item[headOptions.headTitleValue]}}</view>
				</view>
			</view>
			<view class="contact_item" :style="[{'padding-right':letterPropWidth+'px'}]"
				v-for="(item,index) in formarContactlist" :key="index" :id="item.letter == '#' ? 'aa' : item.letter">
				<view class="contact_letter">
					{{item.letter}}
				</view>
				<view class="lettar_list" v-for="(item1,index1) in item.data" :key="index1"
					@tap.stop="handleContactClick(index,index1)">
					<view class="letter_item" :style="{'height':contactItemHeight+'px'}">
						<bugking7-contact-circle @circleCheckClick="handleCircleClick" ref="circle"
							v-show="showSelectBtn" :superIconTip="index" :iconTip="index1" :showCheck="showCheck"
							:borderWidth="borderWidth" :borderColor="borderColor" :borderStyle="borderStyle"
							:checkBgColor="checkBgColor" :iconWidth="iconWidth" :checkIconWidth="checkIconWidth">
						</bugking7-contact-circle>
						<image v-show="showAvatar" :src="item1[avatarValue]" :style="[{'width':avatarImgWidth+'px','height':avatarImgWidth + 'px'}]">
						</image>
						<view class="contact_contant">
							{{ formatValue == '' ?  item1 : item1[formatValue] }}
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<view class="contact_select_wrap" v-show="showSelectBtn">
			<view :class="selectBtnCanClick ?  'select_finish_active' : 'select_finish'"
				:style="{'background-color': selectBtnCanClick ? selectFinishBtnCheckBgColor : 'gray'}"
				@tap.stop="handleSelectFinish">
				{{selectBtnText}}
			</view>
		</view>
	</view>
</template>

<script>
	import {
		pinyin
	} from '../../node_modules/pinyin-pro'
	export default {
		props: {
			contactList: {
				type: Array,
				default: () => []
			},
			letterPropWidth: {
				type: Number,
				default: 25
			},
			contactItemHeight: {
				type: Number,
				default: 40
			},
			formatContactlistByValue: {
				type: String,
				default: ''
			},
			avatarValue: {
				type: String,
				default: ''
			},
			showAvatar:{
				type:Boolean,
				default:true
			},
			showAllLetter: {
				tyoe: Boolean,
				default: true
			},
			showSelectBtn: {
				type: Boolean,
				default: false
			},
			headOptions:{
				type:Object,
				default: function()   {
					return {
						showHead:false,
						headList:()=>[],
						headItemHeight:50,
						headAvatarValue:'',
						headTitleValue:''
					}
				}
			},
			showCheck: {
				type: Boolean,
				default: false
			},
			borderWidth: {
				type: Number,
				default: 1
			},
			borderColor: {
				type: String,
				default: '#d2c5c0'
			},
			borderStyle: {
				type: String,
				default: 'solid' //dashed 虚线
			},
			checkBgColor: {
				type: String,
				default: '#007aff'
			},
			iconWidth: {
				type: Number,
				default: 15
			},
			checkIconWidth: {
				type: Number,
				default: 15
			},
			selectFinishBtnCheckBgColor: {
				type: String,
				default: '#007aff'
			}
		},
		computed: {
			formarContactlist: function() {
				return this.formatContactSortList()
			}
		},
		data() {
			return {
				windowHeight: 0,
				windowTop: 0,
				scrollIntoView: '',
				scrollTop: -1,
				formatContactList: [],
				formatValue: '',
				selectContactList: [],
				selectBtnText: '完成',
				selectBtnCanClick: false,
				avatarImgWidth: 0
			}
		},
		beforeMount() {
			this.requestSystemInfo()
		},
		mounted() {

		},
		created() {
			this.scrollTop = -1
			this.formatValue = this.$props.formatContactlistByValue
			this.avatarImgWidth = this.$props.contactItemHeight - 10
		},
		methods: {
			//获取当前屏幕可用的高度
			requestSystemInfo() {
				uni.getSystemInfo({
					success: (res) => {
						this.windowHeight = res.windowHeight
						this.windowTop = res.windowTop
					}
				})
			},
			//格式化数据并排序
			formatContactSortList() {
				let formatList = []
				let formatlistNoLetter = []
				this.$props.contactList.forEach(e => {
					//获取首字母
					const firstLetter = pinyin(this.formatValue == '' ? e : e[this.formatValue], {
						pattern: 'first',
						toneType: 'none'
					}).substr(0, 1).toLocaleUpperCase()
					//判断是否是字母
					const isLetter = firstLetter >= 'A' && firstLetter <= 'Z'
					if (isLetter) {
						//是字母
						if (formatList.length === 0) { //当前数组无数据
							formatList.push({
								letter: firstLetter,
								data: [e]
							})
						} else {
							let findLetterIndex = formatList.findIndex(item => {
								return item.letter == firstLetter
							})
							if (findLetterIndex === -1) { //不存在
								formatList.push({
									letter: firstLetter,
									data: [e]
								})
							} else { //存在
								let indexData = formatList[findLetterIndex].data
								indexData.push(e)
								formatList[findLetterIndex].data = indexData
							}
						}
					} else {
						//非字母 全部归类#
						if (formatlistNoLetter.length === 0) { //当前数组无数据
							formatlistNoLetter.push({
								letter: '#',
								data: [e]
							})
						} else {
							let indexData = formatlistNoLetter[0].data
							indexData.push(e)
							formatlistNoLetter[0].data = indexData
						}
					}
				})
				formatList.sort(function(a, b) {
					if (a.letter.charCodeAt(0) > b.letter.charCodeAt(0)) {
						return 1
					} else {
						return -1
					}
				})
				const topList = {
					'letter': '⬆',
					data: []
				}
				// formatList.unshift(topList)
				formatList.push(formatlistNoLetter[0])
				this.formatContactList = formatList
				return formatList
			},
			//scrollview滑动监听
			handleScroll(e) {
				this.scrollTop = e.detail.scrollTop
			},
			//全部字母列表点击事件
			handleAllLetterClick(e) {
				const clickLetter = e.letter
				let intoView = ''
				if (clickLetter == '#') {
					intoView = 'aa'
				} else if (clickLetter == '⬆') {
					this.scrollTop = 0
					intoView = ''
				} else {
					intoView = clickLetter
				}
				this.scrollIntoView = intoView
			},
			//列表点击事件
			handleContactClick(superIndex, index) {

				if (this.$props.showSelectBtn) {
					uni.$emit('clickContactCircle', {
						superTip: superIndex,
						tip: index
					})
					return
				}

				this.$emit('contactItemClick', {
					superIndex: superIndex,
					index: index,
					superLetter: this.formatContactList[superIndex].letter,
					contactData: this.formatContactList[superIndex].data[index]
				})
			},
			//选择图标点击事件
			handleCircleClick(e) {
				if (this.$props.showSelectBtn) {
					const superIndex = e.superTip
					const index = e.iconTip
					const check = e.check

					const list = this.formatContactSortList()

					const selectObj = list[superIndex].data[index]

					if (this.selectContactList.length === 0) {
						if (check) {
							this.selectContactList.push(selectObj)
						}
					} else {
						if (check) { //新增
							this.selectContactList.push(selectObj)
						} else { //删除
							const findIndex = this.selectContactList.indexOf(selectObj)
							this.selectContactList.splice(findIndex, 1)
						}
					}

					if (this.selectContactList.length == 0) {
						this.selectBtnText = '完成'
						this.selectBtnCanClick = false
					} else {
						this.selectBtnText = '完成(' + this.selectContactList.length + ')'
						this.selectBtnCanClick = true
					}
				}
			},
			//选择完成按钮点击事件
			handleSelectFinish() {
				if (this.selectBtnCanClick) {
					this.$emit('selectContactFinish', {
						selectList: this.selectContactList
					})
				}
			},
			// 头部列表点击事件
			handleHeadItemClick(index){
				this.$emit('headItemClick',{headItemIndex:index})
			}

		}
	}
</script>

<style lang="scss" scoped>
	@import 'bugking7-contact-list.scss';
</style>
