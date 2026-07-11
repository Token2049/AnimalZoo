/**
 * 动物数据配置文件
 * 集中管理所有动物数据，确保数据一致性
 * 
 * @author Cloud Zoo Team
 * @version 1.0.0
 */

export const animalsData = [
  {
    id: 1,
    name: '非洲狮',
    species: 'Panthera leo',
    category: '哺乳动物',
    habitat: '草原',
    conservationStatus: '易危',
    description: '非洲狮是现存平均体重最大的猫科动物，也是世界上唯一一种雌雄两态的猫科动物。它们主要生活在非洲撒哈拉以南的草原和稀树草原。',
    image: new URL('../assets/images/feizhoushi.png', import.meta.url).href,
    featured: true
  },
  {
    id: 2,
    name: '大熊猫',
    species: 'Ailuropoda melanoleuca',
    category: '哺乳动物',
    habitat: '森林',
    conservationStatus: '易危',
    description: '大熊猫是中国特有的珍稀动物，被誉为"活化石"和"中国国宝"。主要栖息在中国四川、陕西和甘肃的山区竹林中。',
    image: new URL('../assets/images/daxiongmao.png', import.meta.url).href,
    featured: true
  },
  {
    id: 3,
    name: '北极熊',
    species: 'Ursus maritimus',
    category: '哺乳动物',
    habitat: '极地',
    conservationStatus: '易危',
    description: '北极熊是世界上最大的陆地食肉动物，依赖海冰进行捕猎和繁殖。它们主要生活在北极圈地区，适应极端寒冷的环境。',
    image: new URL('../assets/images/beijixiong.png', import.meta.url).href,
    featured: true
  },
  {
    id: 4,
    name: '美洲野牛',
    species: 'Bison bison',
    category: '哺乳动物',
    habitat: '草原',
    conservationStatus: '近危',
    description: '美洲野牛是北美洲最大的陆地哺乳动物，曾一度濒临灭绝，现已恢复。它们是北美大平原生态系统的重要组成部分。',
    image: new URL('../assets/images/meizhouyeniu.png', import.meta.url).href,
    featured: false
  },
  {
    id: 5,
    name: '美洲豹',
    species: 'Panthera onca',
    category: '哺乳动物',
    habitat: '森林',
    conservationStatus: '易危',
    description: '美洲豹是美洲最大的猫科动物，是热带雨林生态系统的重要顶级捕食者。它们主要生活在中南美洲的热带雨林地区。',
    image: new URL('../assets/images/meizhoubao.png', import.meta.url).href,
    featured: false
  },
  {
    id: 6,
    name: '袋鼠',
    species: 'Macropus',
    category: '哺乳动物',
    habitat: '草原',
    conservationStatus: '近危',
    description: '袋鼠是澳大利亚的标志性动物，有多种不同种类，适应各种生态环境。它们是澳大利亚草原生态系统的代表性物种。',
    image: new URL('../assets/images/daishu.png', import.meta.url).href,
    featured: false
  },
  {
    id: 7,
    name: '非洲象',
    species: 'Loxodonta africana',
    category: '哺乳动物',
    habitat: '草原',
    conservationStatus: '濒危',
    description: '非洲象是现存陆地上最大的哺乳动物。它们具有高度的社会性和智慧，是非洲草原生态系统的重要组成部分。',
    image: new URL('../assets/images/feizhouxiang.png', import.meta.url).href,
    featured: true
  },
  {
    id: 8,
    name: '老虎',
    species: 'Panthera tigris',
    category: '哺乳动物',
    habitat: '森林',
    conservationStatus: '濒危',
    description: '老虎是亚洲最具标志性的大型猫科动物，是森林生态系统的顶级捕食者。它们主要生活在亚洲南部和东南部的森林地区。',
    image: new URL('../assets/images/laohu.png', import.meta.url).href,
    featured: true
  },
  {
    id: 9,
    name: '犀牛',
    species: 'Rhinocerotidae',
    category: '哺乳动物',
    habitat: '草原',
    conservationStatus: '极危',
    description: '犀牛是大型草食性动物，因其犀牛角而遭到严重偷猎。它们主要生活在非洲和南亚的草原和森林地区。',
    image: new URL('../assets/images/xiniu.png', import.meta.url).href,
    featured: true
  },
  {
    id: 10,
    name: '长颈鹿',
    species: 'Giraffa camelopardalis',
    category: '哺乳动物',
    habitat: '草原',
    conservationStatus: '易危',
    description: '长颈鹿是世界上现存最高的陆生动物，以其独特的长脖子闻名。它们主要生活在非洲的稀树草原和开阔林地。',
    image: new URL('../assets/images/changjinlu.png', import.meta.url).href,
    featured: false
  },
  {
    id: 11,
    name: '帝企鹅',
    species: 'Aptenodytes forsteri',
    category: '鸟类',
    habitat: '极地',
    conservationStatus: '近危',
    description: '帝企鹅是企鹅家族中个体最大的物种，也是唯一在南极冬季繁殖的企鹅。它们能够承受极端寒冷的环境。',
    image: new URL('../assets/images/diqie.png', import.meta.url).href,
    featured: false
  },
  {
    id: 12,
    name: '绿海龟',
    species: 'Chelonia mydas',
    category: '爬行动物',
    habitat: '海洋',
    conservationStatus: '濒危',
    description: '绿海龟是现存最大的硬壳海龟之一，以其脂肪呈绿色而得名。它们在全球热带和亚热带海域广泛分布。',
    image: new URL('../assets/images/lvhaigui.png', import.meta.url).href,
    featured: false
  },
  {
    id: 13,
    name: '雪豹',
    species: 'Panthera uncia',
    category: '哺乳动物',
    habitat: '山地',
    conservationStatus: '易危',
    description: '雪豹是一种大型猫科动物，被誉为"雪山之王"。它们生活在海拔2500-5000米的高山地区。',
    image: new URL('../assets/images/xuebao.png', import.meta.url).href,
    featured: false
  },
  {
    id: 14,
    name: '红毛猩猩',
    species: 'Pongo pygmaeus',
    category: '哺乳动物',
    habitat: '森林',
    conservationStatus: '极危',
    description: '红毛猩猩是亚洲唯一的大型猿类，以其红褐色的毛发和极高的智慧著称。',
    image: new URL('../assets/images/hongmaoxingxing.png', import.meta.url).href,
    featured: false
  },
  {
    id: 15,
    name: '蓝鲸',
    species: 'Balaenoptera musculus',
    category: '哺乳动物',
    habitat: '海洋',
    conservationStatus: '濒危',
    description: '蓝鲸是地球上最大的动物，体长可达30米。它们是海洋生态系统的重要组成部分。',
    image: new URL('../assets/images/lanjing.png', import.meta.url).href,
    featured: true
  },
  {
    id: 16,
    name: '金雕',
    species: 'Aquila chrysaetos',
    category: '鸟类',
    habitat: '山地',
    conservationStatus: '近危',
    description: '金雕是大型猛禽，以其卓越的飞行能力和敏锐的视力著称。它们主要生活在北半球的山区。',
    image: new URL('../assets/images/jindiao.png', import.meta.url).href,
    featured: false
  },
  {
    id: 17,
    name: '科莫多巨蜥',
    species: 'Varanus komodoensis',
    category: '爬行动物',
    habitat: '森林',
    conservationStatus: '濒危',
    description: '科莫多巨蜥是现存最大的蜥蜴，仅分布于印度尼西亚的科莫多岛等少数岛屿。',
    image: new URL('../assets/images/kemoduojuxi.png', import.meta.url).href,
    featured: false
  },
  {
    id: 18,
    name: '白犀牛',
    species: 'Ceratotherium simum',
    category: '哺乳动物',
    habitat: '草原',
    conservationStatus: '近危',
    description: '白犀牛是现存最大的犀牛物种，以其宽大的嘴巴和群居生活著称。',
    image: new URL('../assets/images/baixiniu.png', import.meta.url).href,
    featured: false
  },
  {
    id: 19,
    name: '猎豹',
    species: 'Acinonyx jubatus',
    category: '哺乳动物',
    habitat: '草原',
    conservationStatus: '易危',
    description: '猎豹是陆地上跑得最快的动物，最高时速可达120公里。它们主要生活在非洲的草原地区。',
    image: new URL('../assets/images/liebao.png', import.meta.url).href,
    featured: false
  },
  {
    id: 20,
    name: '海豚',
    species: 'Delphinidae',
    category: '哺乳动物',
    habitat: '海洋',
    conservationStatus: '近危',
    description: '海豚是高度智慧的海洋哺乳动物，以其社会行为和复杂的沟通方式著称。',
    image: new URL('../assets/images/haitun.png', import.meta.url).href,
    featured: false
  },
  {
    id: 21,
    name: '火烈鸟',
    species: 'Phoenicopterus',
    category: '鸟类',
    habitat: '湿地',
    conservationStatus: '近危',
    description: '火烈鸟以其鲜艳的粉红色羽毛和优雅的长腿著称，主要生活在咸水湖泊和泻湖。',
    image: new URL('../assets/images/huolieniao.png', import.meta.url).href,
    featured: false
  },
  {
    id: 22,
    name: '大猩猩',
    species: 'Gorilla',
    category: '哺乳动物',
    habitat: '森林',
    conservationStatus: '极危',
    description: '大猩猩是现存最大的灵长类动物，以其高度智慧和社会行为著称。',
    image: new URL('../assets/images/daxingxing.png', import.meta.url).href,
    featured: false
  },
  {
    id: 23,
    name: '北极狐',
    species: 'Vulpes lagopus',
    category: '哺乳动物',
    habitat: '极地',
    conservationStatus: '近危',
    description: '北极狐适应极端寒冷环境，以其白色的冬毛和蓬松的尾巴著称。',
    image: new URL('../assets/images/beijihu.png', import.meta.url).href,
    featured: false
  },
  {
    id: 24,
    name: '海豹',
    species: 'Pinnipedia',
    category: '哺乳动物',
    habitat: '海洋',
    conservationStatus: '近危',
    description: '海豹是适应水生生活的鳍足类动物，广泛分布于全球海洋。',
    image: new URL('../assets/images/haibao.png', import.meta.url).href,
    featured: false
  },
  {
    id: 25,
    name: '孔雀',
    species: 'Pavo',
    category: '鸟类',
    habitat: '森林',
    conservationStatus: '近危',
    description: '孔雀以其华丽的尾羽和优雅的姿态著称，是世界上最美丽的鸟类之一。',
    image: new URL('../assets/images/kongque.png', import.meta.url).href,
    featured: false
  },
  {
    id: 26,
    name: '鳄鱼',
    species: 'Crocodylus',
    category: '爬行动物',
    habitat: '湿地',
    conservationStatus: '易危',
    description: '鳄鱼是古老的爬行动物，以其强大的咬合力和水陆两栖生活著称。',
    image: new URL('../assets/images/eyu.png', import.meta.url).href,
    featured: false
  },
  {
    id: 27,
    name: '斑马',
    species: 'Equus quagga',
    category: '哺乳动物',
    habitat: '草原',
    conservationStatus: '近危',
    description: '斑马以其独特的黑白条纹著称，是非洲草原的标志性动物。',
    image: new URL('../assets/images/banma.png', import.meta.url).href,
    featured: false
  },
  {
    id: 28,
    name: '角马',
    species: 'Connochaetes',
    category: '哺乳动物',
    habitat: '草原',
    conservationStatus: '近危',
    description: '角马是非洲大草原上数量最多的大型哺乳动物之一，以其大规模迁徙著称。',
    image: new URL('../assets/images/jiaoma.png', import.meta.url).href,
    featured: false
  },
  {
    id: 29,
    name: '河马',
    species: 'Hippopotamus amphibius',
    category: '哺乳动物',
    habitat: '湿地',
    conservationStatus: '易危',
    description: '河马是非洲最大的半水生哺乳动物，以其巨大的体型和攻击性著称。',
    image: new URL('../assets/images/hema.png', import.meta.url).href,
    featured: false
  },
  {
    id: 30,
    name: '鲸鲨',
    species: 'Rhincodon typus',
    category: '鱼类',
    habitat: '海洋',
    conservationStatus: '濒危',
    description: '鲸鲨是世界上最大的鱼类，以其温顺的性格和独特的斑点图案著称。',
    image: new URL('../assets/images/jingsha.png', import.meta.url).href,
    featured: true
  }
]
