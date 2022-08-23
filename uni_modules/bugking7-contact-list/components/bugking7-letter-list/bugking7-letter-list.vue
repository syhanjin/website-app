<template>
	<view class="letter_wrap" :style="{'width': letterWidth+'px'}">
		<view class="all_letter_wrap" v-if="showAllLetter" 
		>
			<view :class="allLetterClickIndex === index ?  'all_letter_item_active'  :  'all_letter_item'"
			:style="{'height':letterWidth+'px'}"
				v-for="(item,index) in allLetterList" :key="index" @tap.stop="handleAllLetterClick(index,item)">
				{{item}}
			</view>
		</view>
		<view class="part_letter_wrap" v-else>
			<view :class="allLetterClickIndex === index ?  'part_letter_item_active'  : 'part_letter_item'"
				:style="{'height':letterWidth+'px'}" v-for="(item,index) in formatPartLetterList" :key="index"
				@tap.stop="handleAllLetterClick(index,item.letter)">
				{{item.letter}}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			showAllLetter: {
				type: Boolean,
				default: true
			},
			letterWidth: {
				type: Number,
				default: 25
			},
			letterList: {
				type: Array,
				default: () => []
			},
			windowTop:{
				type:Number,
				default:0
			},
			windoweight:{
				type:Number,
				default:0
			}
		},
		computed: {
			formatPartLetterList: function() {
				let partLetterList = []
				partLetterList.push({letter:'⬆'})
				this.$props.letterList.forEach(e=>{
					partLetterList.push({letter:e.letter})
				})
				return partLetterList
			}
		},
		created() {
			
		},
		data() {
			return {
				allLetterList: ['⬆', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I',
					'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
					'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '#'
				],
				allLetterClickIndex: -1,
				partLetterList:[]
			}
		},
		methods: {
			//全字母列表点击事件
			handleAllLetterClick(index,value) {
				this.allLetterClickIndex = index
				this.$emit('allLetterListClick', {
					letter: this.$props.showAllLetter ? this.allLetterList[index] : value
				})
			},
			//所有字母列表手机点击、手指移动、手指抬起事件
			handleAllLetterStart(e){
				console.log('start',e)
			},
			handleAllLetterMove(e){
				console.log('move',e)
			},
			handleAllLetterEnd(e){
				console.log('end',e)
			}
		}

	}
</script>

<style lang="scss" scoped>
	@import 'bugking7-letter-list.scss';
</style>
