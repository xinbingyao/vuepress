```javascript
export default {
  props: {
    to: {
      type: String,
      required: true
    },
    tag: {
      type: String,
      default: 'a'
    }
  },
  methods: {
    handler() {
      this.$router.push(this.to)
    }
  },
  render(h) {
    let tag = this.tag
    return <tag onClick="{hander}">{this.$slots.default}</tag>
  }
}
```