export const initialData = {
  users: [
    { id: 'user-001', username: '环保达人小明', avatar: 'https://picsum.photos/seed/eco001/100/100', level: 15, totalScore: 12580, correctRate: 0.92, joinDate: '2024-01-15', streak: 28, contributions: 35 },
    { id: 'user-002', username: '绿色小卫士', avatar: 'https://picsum.photos/seed/eco002/100/100', level: 13, totalScore: 10240, correctRate: 0.88, joinDate: '2024-02-20', streak: 15, contributions: 22 },
    { id: 'user-003', username: '分类先锋刚子', avatar: 'https://picsum.photos/seed/eco003/100/100', level: 12, totalScore: 9870, correctRate: 0.91, joinDate: '2024-03-10', streak: 21, contributions: 18 },
    { id: 'user-004', username: '低碳生活美美', avatar: 'https://picsum.photos/seed/eco004/100/100', level: 11, totalScore: 8560, correctRate: 0.85, joinDate: '2024-01-28', streak: 7, contributions: 12 },
    { id: 'user-005', username: '回收老王', avatar: 'https://picsum.photos/seed/eco005/100/100', level: 14, totalScore: 11320, correctRate: 0.94, joinDate: '2023-12-05', streak: 33, contributions: 41 },
    { id: 'user-006', username: '垃圾分类小能手', avatar: 'https://picsum.photos/seed/eco006/100/100', level: 10, totalScore: 7680, correctRate: 0.82, joinDate: '2024-04-18', streak: 12, contributions: 9 },
    { id: 'user-007', username: '地球守护者', avatar: 'https://picsum.photos/seed/eco007/100/100', level: 16, totalScore: 14200, correctRate: 0.96, joinDate: '2023-10-08', streak: 45, contributions: 53 },
    { id: 'user-008', username: '环保新手小丽', avatar: 'https://picsum.photos/seed/eco008/100/100', level: 5, totalScore: 3200, correctRate: 0.73, joinDate: '2025-05-20', streak: 3, contributions: 2 }
  ],
  quizScores: [
    { id: 'score-001', userId: 'user-001', score: 95, totalQuestions: 20, correctAnswers: 19, duration: 420, completedAt: '2026-06-10T09:30:00Z', city: '北京' },
    { id: 'score-002', userId: 'user-001', score: 88, totalQuestions: 25, correctAnswers: 22, duration: 540, completedAt: '2026-06-09T14:20:00Z', city: '北京' },
    { id: 'score-003', userId: 'user-002', score: 90, totalQuestions: 20, correctAnswers: 18, duration: 480, completedAt: '2026-06-10T10:15:00Z', city: '上海' },
    { id: 'score-004', userId: 'user-002', score: 92, totalQuestions: 15, correctAnswers: 14, duration: 360, completedAt: '2026-06-08T16:45:00Z', city: '上海' },
    { id: 'score-005', userId: 'user-003', score: 85, totalQuestions: 30, correctAnswers: 26, duration: 720, completedAt: '2026-06-10T11:00:00Z', city: '广州' },
    { id: 'score-006', userId: 'user-003', score: 96, totalQuestions: 25, correctAnswers: 24, duration: 510, completedAt: '2026-06-07T09:00:00Z', city: '广州' },
    { id: 'score-007', userId: 'user-004', score: 82, totalQuestions: 20, correctAnswers: 17, duration: 450, completedAt: '2026-06-09T13:30:00Z', city: '北京' },
    { id: 'score-008', userId: 'user-004', score: 88, totalQuestions: 20, correctAnswers: 18, duration: 500, completedAt: '2026-06-06T15:20:00Z', city: '上海' },
    { id: 'score-009', userId: 'user-005', score: 94, totalQuestions: 20, correctAnswers: 19, duration: 600, completedAt: '2026-06-10T08:45:00Z', city: '北京' },
    { id: 'score-010', userId: 'user-005', score: 98, totalQuestions: 30, correctAnswers: 29, duration: 680, completedAt: '2026-06-08T10:30:00Z', city: '北京' },
    { id: 'score-011', userId: 'user-006', score: 78, totalQuestions: 15, correctAnswers: 12, duration: 320, completedAt: '2026-06-09T16:00:00Z', city: '广州' },
    { id: 'score-012', userId: 'user-006', score: 84, totalQuestions: 20, correctAnswers: 17, duration: 480, completedAt: '2026-06-07T11:15:00Z', city: '广州' },
    { id: 'score-013', userId: 'user-007', score: 100, totalQuestions: 20, correctAnswers: 20, duration: 280, completedAt: '2026-06-10T07:30:00Z', city: '上海' },
    { id: 'score-014', userId: 'user-007', score: 97, totalQuestions: 25, correctAnswers: 24, duration: 450, completedAt: '2026-06-08T14:00:00Z', city: '上海' },
    { id: 'score-015', userId: 'user-008', score: 68, totalQuestions: 20, correctAnswers: 14, duration: 600, completedAt: '2026-06-10T15:30:00Z', city: '北京' }
  ],
  hotSearches: [
    { id: 'hot-001', keyword: '电池', searchCount: 3256, trend: 'up', updatedAt: '2026-06-10T12:00:00Z' },
    { id: 'hot-002', keyword: '外卖盒', searchCount: 2987, trend: 'up', updatedAt: '2026-06-10T12:00:00Z' },
    { id: 'hot-003', keyword: '湿纸巾', searchCount: 2456, trend: 'up', updatedAt: '2026-06-10T12:00:00Z' },
    { id: 'hot-004', keyword: '塑料袋', searchCount: 2143, trend: 'stable', updatedAt: '2026-06-10T12:00:00Z' },
    { id: 'hot-005', keyword: '旧衣服', searchCount: 1898, trend: 'down', updatedAt: '2026-06-10T12:00:00Z' },
    { id: 'hot-006', keyword: '过期药品', searchCount: 1767, trend: 'up', updatedAt: '2026-06-10T12:00:00Z' },
    { id: 'hot-007', keyword: '快递包装', searchCount: 1521, trend: 'up', updatedAt: '2026-06-10T12:00:00Z' },
    { id: 'hot-008', keyword: '奶茶杯', searchCount: 1489, trend: 'up', updatedAt: '2026-06-10T12:00:00Z' },
    { id: 'hot-009', keyword: '纸巾', searchCount: 1345, trend: 'stable', updatedAt: '2026-06-10T12:00:00Z' },
    { id: 'hot-010', keyword: '陶瓷碗碟', searchCount: 1198, trend: 'stable', updatedAt: '2026-06-10T12:00:00Z' },
    { id: 'hot-011', keyword: '烟头', searchCount: 1056, trend: 'down', updatedAt: '2026-06-10T12:00:00Z' },
    { id: 'hot-012', keyword: '指甲油', searchCount: 987, trend: 'up', updatedAt: '2026-06-10T12:00:00Z' },
    { id: 'hot-013', keyword: '大骨棒', searchCount: 923, trend: 'up', updatedAt: '2026-06-10T12:00:00Z' },
    { id: 'hot-014', keyword: '荧光灯管', searchCount: 876, trend: 'stable', updatedAt: '2026-06-10T12:00:00Z' },
    { id: 'hot-015', keyword: '过期化妆品', searchCount: 834, trend: 'up', updatedAt: '2026-06-10T12:00:00Z' },
    { id: 'hot-016', keyword: '牛奶盒', searchCount: 789, trend: 'down', updatedAt: '2026-06-10T12:00:00Z' },
    { id: 'hot-017', keyword: '保鲜膜', searchCount: 734, trend: 'stable', updatedAt: '2026-06-10T12:00:00Z' },
    { id: 'hot-018', keyword: '猫砂', searchCount: 698, trend: 'up', updatedAt: '2026-06-10T12:00:00Z' },
    { id: 'hot-019', keyword: '一次性筷子', searchCount: 654, trend: 'down', updatedAt: '2026-06-10T12:00:00Z' },
    { id: 'hot-020', keyword: '椰子壳', searchCount: 612, trend: 'stable', updatedAt: '2026-06-10T12:00:00Z' }
  ],
  contributions: [
    { id: 'contrib-001', userId: 'user-001', itemName: '珍珠奶茶杯', category: '其他垃圾', description: '新增珍珠奶茶杯的分类条目，包含吸管、杯盖、杯身的详细分类说明', status: 'approved', points: 50, createdAt: '2026-06-09T10:30:00Z', reviewNote: '信息准确详细，审核通过' },
    { id: 'contrib-002', userId: 'user-003', itemName: '指甲油瓶', category: '有害垃圾', description: '补充指甲油瓶属于有害垃圾的说明，含化学成分需特殊处理', status: 'approved', points: 30, createdAt: '2026-06-08T14:20:00Z', reviewNote: '分类正确，描述清晰' },
    { id: 'contrib-003', userId: 'user-005', itemName: '自热火锅盒', category: '其他垃圾', description: '新增自热火锅盒分类条目，加热包属于有害垃圾，外盒属于其他垃圾', status: 'approved', points: 80, createdAt: '2026-06-07T09:15:00Z', reviewNote: '分类非常详细，加热包单独标注很好' },
    { id: 'contrib-004', userId: 'user-002', itemName: '隐形眼镜', category: '其他垃圾', description: '新增隐形眼镜分类条目，属于其他垃圾而非可回收物', status: 'pending', points: 0, createdAt: '2026-06-10T11:00:00Z', reviewNote: '' },
    { id: 'contrib-005', userId: 'user-004', itemName: '宠物粪便', category: '其他垃圾', description: '补充宠物粪便的正确投放方式，需用报纸包裹后投入其他垃圾桶', status: 'approved', points: 40, createdAt: '2026-06-06T16:45:00Z', reviewNote: '实用信息，感谢贡献' },
    { id: 'contrib-006', userId: 'user-001', itemName: '榴莲壳', category: '其他垃圾', description: '补充榴莲壳属于其他垃圾的说明，虽然是大块果壳但不易腐烂', status: 'approved', points: 25, createdAt: '2026-06-05T13:30:00Z', reviewNote: '常见误区，很有价值' },
    { id: 'contrib-007', userId: 'user-003', itemName: '旧毛巾', category: '可回收物', description: '建议将旧毛巾归为可回收物', status: 'rejected', points: 0, createdAt: '2026-06-04T10:00:00Z', reviewNote: '旧毛巾属于其他垃圾，不可回收' },
    { id: 'contrib-008', userId: 'user-005', itemName: '温度计', category: '有害垃圾', description: '新增水银温度计分类条目，含有毒物质水银需投入有害垃圾桶', status: 'approved', points: 60, createdAt: '2026-06-03T15:20:00Z', reviewNote: '有害垃圾分类正确，重要信息' },
    { id: 'contrib-009', userId: 'user-007', itemName: '泡沫箱', category: '可回收物', description: '新增泡沫箱分类条目，清洁的泡沫箱属于可回收物', status: 'approved', points: 35, createdAt: '2026-06-02T09:40:00Z', reviewNote: '描述准确，注意清洁条件的补充很好' },
    { id: 'contrib-010', userId: 'user-006', itemName: '用过的猫砂', category: '其他垃圾', description: '新增猫砂分类条目，无论何种材质的猫砂均属于其他垃圾', status: 'pending', points: 0, createdAt: '2026-06-10T08:20:00Z', reviewNote: '' }
  ],
  feedbacks: [
    { id: 'feedback-001', userId: 'user-002', type: 'classification_error', title: '湿纸巾分类有误', description: '系统中显示湿纸巾属于可回收物，但实际上湿纸巾属于其他垃圾，因为其材质不易降解且被污染后无法回收', trashItemId: 'trash-00123', status: 'resolved', createdAt: '2026-06-08T10:30:00Z', resolvedAt: '2026-06-08T14:20:00Z' },
    { id: 'feedback-002', userId: 'user-004', type: 'suggestion', title: '建议增加城市差异化分类说明', description: '不同城市分类标准有差异，建议在查询结果中标注当前城市的分类规则', trashItemId: null, status: 'processing', createdAt: '2026-06-09T09:15:00Z', resolvedAt: null },
    { id: 'feedback-003', userId: 'user-001', type: 'classification_error', title: '大骨棒分类标注错误', description: '大骨棒应属于其他垃圾而非厨余垃圾，因为其难以被降解处理', trashItemId: 'trash-00456', status: 'pending', createdAt: '2026-06-10T08:45:00Z', resolvedAt: null },
    { id: 'feedback-004', userId: 'user-003', type: 'question', title: '外卖餐盒如何正确分类', description: '有油污的外卖餐盒和干净的外卖餐盒分类是否不同？请详细说明清洁标准', trashItemId: 'trash-00789', status: 'resolved', createdAt: '2026-06-05T14:30:00Z', resolvedAt: '2026-06-06T09:20:00Z' },
    { id: 'feedback-005', userId: 'user-005', type: 'classification_error', title: '椰子壳分类显示错误', description: '椰子壳应属于其他垃圾，系统显示为厨余垃圾，椰子壳坚硬不易腐烂', trashItemId: 'trash-00321', status: 'resolved', createdAt: '2026-06-07T11:00:00Z', resolvedAt: '2026-06-07T16:45:00Z' },
    { id: 'feedback-006', userId: 'user-002', type: 'suggestion', title: '希望增加图片识别功能', description: '建议增加拍照识别垃圾类别的功能，方便不确定分类时快速查询', trashItemId: null, status: 'pending', createdAt: '2026-06-10T10:15:00Z', resolvedAt: null },
    { id: 'feedback-007', userId: 'user-007', type: 'question', title: '电池分类有疑问', description: '一次性干电池和充电电池的分类是否相同？目前系统统一标注为有害垃圾，但听说一次性干电池已无汞可投入其他垃圾桶', trashItemId: 'trash-00567', status: 'pending', createdAt: '2026-06-10T13:20:00Z', resolvedAt: null },
    { id: 'feedback-008', userId: 'user-008', type: 'suggestion', title: '新手引导不够清晰', description: '作为新用户，希望有更直观的分类入门指南，目前的说明比较专业不易理解', trashItemId: null, status: 'processing', createdAt: '2026-06-09T17:00:00Z', resolvedAt: null }
  ],
  wrongAnswers: [
    { id: 'wrong-001', trashItemId: 'trash-001', trashItemName: '湿纸巾', correctCategory: '其他垃圾', wrongCategory: '可回收物', wrongCount: 892 },
    { id: 'wrong-002', trashItemId: 'trash-002', trashItemName: '外卖餐盒', correctCategory: '其他垃圾', wrongCategory: '可回收物', wrongCount: 756 },
    { id: 'wrong-003', trashItemId: 'trash-003', trashItemName: '大骨棒', correctCategory: '其他垃圾', wrongCategory: '厨余垃圾', wrongCount: 698 },
    { id: 'wrong-004', trashItemId: 'trash-004', trashItemName: '椰子壳', correctCategory: '其他垃圾', wrongCategory: '厨余垃圾', wrongCount: 645 },
    { id: 'wrong-005', trashItemId: 'trash-005', trashItemName: '过期药品', correctCategory: '有害垃圾', wrongCategory: '其他垃圾', wrongCount: 587 },
    { id: 'wrong-006', trashItemId: 'trash-006', trashItemName: '塑料袋', correctCategory: '其他垃圾', wrongCategory: '可回收物', wrongCount: 534 },
    { id: 'wrong-007', trashItemId: 'trash-007', trashItemName: '用过的纸巾', correctCategory: '其他垃圾', wrongCategory: '可回收物', wrongCount: 498 },
    { id: 'wrong-008', trashItemId: 'trash-008', trashItemName: '电池', correctCategory: '有害垃圾', wrongCategory: '其他垃圾', wrongCount: 467 },
    { id: 'wrong-009', trashItemId: 'trash-009', trashItemName: '旧衣服', correctCategory: '可回收物', wrongCategory: '其他垃圾', wrongCount: 423 },
    { id: 'wrong-010', trashItemId: 'trash-010', trashItemName: '奶茶杯', correctCategory: '其他垃圾', wrongCategory: '可回收物', wrongCount: 389 },
    { id: 'wrong-011', trashItemId: 'trash-011', trashItemName: '烟头', correctCategory: '其他垃圾', wrongCategory: '有害垃圾', wrongCount: 356 },
    { id: 'wrong-012', trashItemId: 'trash-012', trashItemName: '荧光灯管', correctCategory: '有害垃圾', wrongCategory: '其他垃圾', wrongCount: 312 },
    { id: 'wrong-013', trashItemId: 'trash-013', trashItemName: '陶瓷碗碟', correctCategory: '其他垃圾', wrongCategory: '可回收物', wrongCount: 287 },
    { id: 'wrong-014', trashItemId: 'trash-014', trashItemName: '指甲油', correctCategory: '有害垃圾', wrongCategory: '其他垃圾', wrongCount: 256 },
    { id: 'wrong-015', trashItemId: 'trash-015', trashItemName: '保鲜膜', correctCategory: '其他垃圾', wrongCategory: '可回收物', wrongCount: 234 }
  ],
  cityRules: [
    {
      id: 'city-001',
      cityName: '北京',
      categories: ['厨余垃圾', '可回收物', '有害垃圾', '其他垃圾'],
      specialRules: [
        '厨余垃圾需沥干水分后投放',
        '大棒骨、椰子壳等坚硬物体归入其他垃圾',
        '一次性干电池（无汞）归入其他垃圾',
        '外卖餐盒无论是否清洗均归入其他垃圾',
        '过期药品需连同包装一起投入有害垃圾桶'
      ]
    },
    {
      id: 'city-002',
      cityName: '上海',
      categories: ['湿垃圾', '可回收物', '有害垃圾', '干垃圾'],
      specialRules: [
        '上海使用"湿垃圾"和"干垃圾"分类名称，对应北京的"厨余垃圾"和"其他垃圾"',
        '湿垃圾需破袋投放，将垃圾倒入湿垃圾桶，塑料袋投入干垃圾桶',
        '榴莲壳、椰子壳、大骨棒归入干垃圾',
        '外卖餐盒清洗干净后可归入可回收物',
        '花卉绿植归入湿垃圾'
      ]
    },
    {
      id: 'city-003',
      cityName: '广州',
      categories: ['餐厨垃圾', '可回收物', '有害垃圾', '其他垃圾'],
      specialRules: [
        '广州使用"餐厨垃圾"分类名称，对应北京的"厨余垃圾"',
        '餐厨垃圾投放前需沥干水分并去除包装',
        '大件垃圾（如家具、家电）需预约回收，不得随意丢弃',
        '玻璃制品需单独投放至可回收物收集容器',
        '园林垃圾（树枝、落叶）需单独收集处理'
      ]
    }
  ]
};
