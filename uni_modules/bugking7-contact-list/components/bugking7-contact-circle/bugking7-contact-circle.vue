<template>
	<view class="circle_wrap" :style="{ 'background-color' : isCheck ? checkBgColor :  'transparent', 
		'border-width': borderWidth + 'px',
		'borderColor':isCheck ? checkBgColor : borderColor,
		'border-style': computedBorderStyle,
		'width':iconWidth + 'px',
		'height':iconWidth + 'px'
	}" @tap.stop="handleClickCheck">
		<uni-icons v-if="isCheck" type="checkmarkempty" :size="checkIconWidth" color="white"></uni-icons>
	</view>
</template>

<script>
	export default {
		props: {
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
			superIconTip: {
				type: Number,
				default: -1
			},
			iconTip: {
				type: Number,
				default: -1
			}
		},
		created() {
			this.isCheck = this.$props.showCheck

			uni.$on('clickContactCircle', (data) => {
				if (
					(this.$props.iconTip !== -1 && this.$props.iconTip === data.tip) &&
					(this.$props.superIconTip !== -1 && this.$props.superIconTip === data.superTip)
				) {
					this.isCheck = !this.isCheck
					this.$emit('circleCheckClick', {
						check: this.isCheck,
						superTip:this.$props.superIconTip,
						iconTip:this.$props.iconTip
					})
				}
			})
		},
		computed: {
			computedBorderStyle: function() {
				return this.$props.borderStyle == 'solid' ? 'solid' : 'dashed'
			}
		},
		data() {
			return {
				isCheck: false
			}
		},
		methods: {
			handleClickCheck() {
				this.isCheck = !this.isCheck
				this.$emit('circleCheckClick', {
					check: this.isCheck,
					superTip:this.$props.superIconTip,
					iconTip:this.$props.iconTip
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import 'bugking7-contact-circle.scss';
</style>
