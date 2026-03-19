/**
 * 步骤指示器组件
 * 用于表单分步填写
 */
Component({
  properties: {
    // 当前步骤 (1-3)
    current: {
      type: Number,
      value: 1
    },
    // 步骤配置
    steps: {
      type: Array,
      value: [
        { title: '基本信息', desc: '选址与预算' },
        { title: '客群定位', desc: '目标与时段' },
        { title: '补充信息', desc: '竞品与优势' }
      ]
    }
  },

  data: {
    stepList: []
  },

  observers: {
    'current, steps': function(current, steps) {
      this.updateStepList(current, steps)
    }
  },

  methods: {
    updateStepList(current, steps) {
      const stepList = steps.map((step, index) => {
        const stepNum = index + 1
        return {
          ...step,
          stepNum,
          isCompleted: stepNum < current,
          isActive: stepNum === current,
          isPending: stepNum > current
        }
      })
      this.setData({ stepList })
    },

    onStepTap(e) {
      const { step } = e.currentTarget.dataset
      // 只允许点击已完成的步骤
      if (step.isCompleted) {
        this.triggerEvent('change', { step: step.stepNum })
      }
    }
  }
})