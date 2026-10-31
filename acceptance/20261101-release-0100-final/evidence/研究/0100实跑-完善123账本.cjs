const fs = require('fs');
const input = JSON.parse(fs.readFileSync('研究/0100实跑-第123章登记输入.json', 'utf8'));
input.changes.ledger.P_SHEN_SHOES74_121 = {
  custody: {holder: '沈禾', location: '76日午后沈家通风处；小票仍在鞋盒内', condition: '76日首次穿出门，左脚发热未破后换旧鞋；未穿出门方可换的原条件已不适用，不能认定长期合脚'},
  evidence: [{unit: 123, quote: '她把新鞋从袋里取出，搁在通风处'}, {unit: 123, quote: '左脚发热，停下后未破'}]
};
input.changes.ledger.P_DINNER_START75_122 = {
  custody: {holder: '沈禾', location: '76日午后沈家本人本子，与桥夹分开', condition: '75日开头及圈注保留；75晚、76下午继续写饭局，区分回忆与猜测，未交葛'},
  evidence: [{unit: 123, quote: '她只看见葛扶盘，便在旁边画了个小点，没往下猜。'}, {unit: 123, quote: '先往下写自己把筷子收回来，夹了腹下那块鱼。'}]
};
fs.writeFileSync('研究/0100实跑-第123章登记输入-v2.json', JSON.stringify(input, null, 2) + '\n', {flag: 'wx'});
