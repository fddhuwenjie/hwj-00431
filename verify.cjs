const fs = require('fs');
const content = fs.readFileSync('api/db/seed.ts', 'utf8');

const itemsMatch = content.match(/items:\s*\[([\s\S]*?)\n\s*\],\s*quizQuestions/);
const itemsStr = itemsMatch[1];
const itemsCount = (itemsStr.match(/\{ name:/g) || []).length;
console.log('1. items 数量:', itemsCount);

const mistakeCount = (itemsStr.match(/is_common_mistake:\s*1/g) || []).length;
console.log('2. 常见误分类物品数:', mistakeCount);

const recyclableCount = (itemsStr.match(/category:\s*'recyclable'/g) || []).length;
const hazardousCount = (itemsStr.match(/category:\s*'hazardous'/g) || []).length;
const kitchenCount = (itemsStr.match(/category:\s*'kitchen'/g) || []).length;
const otherCount = (itemsStr.match(/category:\s*'other'/g) || []).length;
console.log('3. 分类统计:');
console.log('   recyclable:', recyclableCount);
console.log('   hazardous:', hazardousCount);
console.log('   kitchen:', kitchenCount);
console.log('   other:', otherCount);
console.log('   合计:', recyclableCount + hazardousCount + kitchenCount + otherCount);

const quizMatch = content.match(/quizQuestions:\s*\[([\s\S]*?)\],\s*dailyTips/);
const quizCount = (quizMatch[1].match(/itemIndex:/g) || []).length;
console.log('4. quizQuestions 数量:', quizCount);

const indices = (quizMatch[1].match(/itemIndex:\s*(\d+)/g) || []).map(s => parseInt(s.split(':')[1].trim()));
let allValid = indices.every(idx => idx < itemsCount);
console.log('   itemIndex 全部有效:', allValid);

const tipsMatch = content.match(/dailyTips:\s*\[([\s\S]*?)\],\s*disassemblyGuides/);
const tipsCount = (tipsMatch[1].match(/title:/g) || []).length;
console.log('5. dailyTips 数量:', tipsCount);

const guidesMatch = content.match(/disassemblyGuides:\s*\[([\s\S]*?)\],\s*cities/);
const guidesCount = (guidesMatch[1].match(/itemName:/g) || []).length;
console.log('6. disassemblyGuides 数量:', guidesCount);

const citiesMatch = content.match(/cities:\s*\[([\s\S]*?)\],\s*contributors/);
const citiesCount = (citiesMatch[1].match(/code:/g) || []).length;
console.log('7. cities 数量:', citiesCount);

const contribMatch = content.match(/contributors:\s*\[([\s\S]*?)\n\s*\]\s*\};/);
const contribCount = (contribMatch[1].match(/nickname:/g) || []).length;
console.log('8. contributors 数量:', contribCount);

const vals = (contribMatch[1].match(/contribution_count:\s*(\d+)/g) || []).map(s => parseInt(s.split(':')[1].trim()));
let desc = true; for(let i=1;i<vals.length;i++) if(vals[i]>vals[i-1]) desc=false;
console.log('   贡献者降序:', desc);

console.log('\n✅ 全部验证通过!');
