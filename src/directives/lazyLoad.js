const lazyLoadDirective = {
  mounted(el, binding) {
    const imageUrl = binding.value
    if (!imageUrl) return

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          el.src = imageUrl
          el.classList.add('loaded')
          observer.unobserve(el)
        }
      })
    }, {
      rootMargin: '50px',
      threshold: 0.1
    })

    observer.observe(el)
    el._observer = observer
  },

  updated(el, binding) {
    if (binding.value !== binding.oldValue) {
      const imageUrl = binding.value
      if (imageUrl) {
        el.src = imageUrl
      }
    }
  },

  unmounted(el) {
    if (el._observer) {
      el._observer.disconnect()
    }
  }
}

export default lazyLoadDirective
