export const formatAnimalName = (name) => {
  if (!name) return ''
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
}

export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export const debounce = (fn, delay = 300) => {
  let timer = null
  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

export const throttle = (fn, delay = 300) => {
  let lastTime = 0
  return function (...args) {
    const now = Date.now()
    if (now - lastTime >= delay) {
      lastTime = now
      fn.apply(this, args)
    }
  }
}

export const generateId = () => {
  return Math.random().toString(36).substring(2, 9)
}

export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

export const getConservationStatus = (status) => {
  const statusMap = {
    'LC': { label: '无危', color: '#154212' },
    'NT': { label: '近危', color: '#592e03' },
    'VU': { label: '易危', color: '#ba1a1a' },
    'EN': { label: '濒危', color: '#ba1a1a' },
    'CR': { label: '极危', color: '#ba1a1a' },
    'EW': { label: '野外灭绝', color: '#ba1a1a' },
    'EX': { label: '灭绝', color: '#1c1c18' }
  }
  return statusMap[status] || { label: '未知', color: '#1c1c18' }
}

export const calculateAge = (birthDate) => {
  const birth = new Date(birthDate)
  const now = new Date()
  const diff = now - birth
  const years = Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000))
  return years
}
