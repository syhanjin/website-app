<template>
  <view>
    <u-navbar title="创建班级"></u-navbar>
    <u-form ref="form" :model="form" :rules="rules" class="create" labelWidth="5em">
      <div v-if="errors.length" class="errors">
        <text v-for="(error, index) in errors" :key="index">{{ error }}</text>
      </div>
      <u-form-item label="班级名称" prop="name" required>
        <u-input v-model="form.name" border="bottom"/>
      </u-form-item>
      <u-form-item label="项目" prop="subject" required>
        <u-checkbox-group v-model="form.subject">
          <u-checkbox v-for="subject in subjects" :key="subject.id" :name="subject.id" :label="subject.name">
          </u-checkbox>
        </u-checkbox-group>
      </u-form-item>

      <u-form-item>
        <u-row customStyle="width: 100%">
          <u-col :span="5.5">
            <u-button :disabled="submitDisabled" type="primary" @click="submit">
              {{ submitText }}
            </u-button>
          </u-col>
          <u-col :span="1" />
          <u-col :span="5.5">
            <u-button @click="reset">重置</u-button>
          </u-col>
        </u-row>
      </u-form-item>
    </u-form>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        errors: [],
        form: {
          name: '',
          subject: []
        },
        subjects: [],
        submitDisabled: false,
        submitText: '创建班级',
        rules: {
          name: {
            type: 'string',
            required: true,
            message: '请填写班级名称',
            trigger: ['blur', 'change']
          },
          subject: {
            type: 'array',
            required: true,
            min: 1,
            message: '至少选择一个项目',
            trigger: ['blur', 'change']
          },
        },
      }
    },
    async onLoad() {
      await this.fetchData()
    },
    methods: {
      async fetchData() {
        this.$http.get('/perfection/subject')
          .then(resp => {
            this.subjects = resp.data
          })
      },
      submit() {
        this.$refs.form.validate().then(res => {
          console.log(this.form)
          this.$http.post('/perfection/class/', this.form)
          .then(resp => {
            uni.showModal({
              showCancel: false,
              title: "班级创建成功",
              content: "班级id："+resp.data.id,
              success: (res) =>{
                if(res.confirm){
                  uni.navigateBack({
                    success: (uni.$emit('perfection-class-refresh'))
                  })
                }
              }
            })
          })
        })
      },
      reset() {
        this.$refs.form.resetFields()
      }
    }
  }
</script>

<style scoped>
  .create {
    width: 98%;
    padding: 20px 10px;
  }
</style>
