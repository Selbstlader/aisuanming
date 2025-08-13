// 中国主要城市经纬度数据
// 数据格式：城市代码 -> { name: 城市名称, longitude: 经度, latitude: 纬度, timezone: 时区 }

export interface CityCoordinate {
  name: string;
  longitude: number;
  latitude: number;
  timezone: string;
}

export const cityCoordinates: Record<string, CityCoordinate> = {
  // 直辖市
  '1101': { name: '北京市', longitude: 116.4074, latitude: 39.9042, timezone: 'Asia/Shanghai' },
  '1201': { name: '天津市', longitude: 117.1901, latitude: 39.0842, timezone: 'Asia/Shanghai' },
  '3101': { name: '上海市', longitude: 121.4737, latitude: 31.2304, timezone: 'Asia/Shanghai' },
  '5001': { name: '重庆市', longitude: 106.5516, latitude: 29.5630, timezone: 'Asia/Shanghai' },
  
  // 河北省
  '1301': { name: '石家庄市', longitude: 114.5149, latitude: 38.0428, timezone: 'Asia/Shanghai' },
  '1302': { name: '唐山市', longitude: 118.1758, latitude: 39.6304, timezone: 'Asia/Shanghai' },
  '1303': { name: '秦皇岛市', longitude: 119.6004, latitude: 39.9398, timezone: 'Asia/Shanghai' },
  '1304': { name: '邯郸市', longitude: 114.4775, latitude: 36.6256, timezone: 'Asia/Shanghai' },
  '1305': { name: '邢台市', longitude: 114.5086, latitude: 37.0682, timezone: 'Asia/Shanghai' },
  '1306': { name: '保定市', longitude: 115.4648, latitude: 38.8740, timezone: 'Asia/Shanghai' },
  '1307': { name: '张家口市', longitude: 114.8794, latitude: 40.8118, timezone: 'Asia/Shanghai' },
  '1308': { name: '承德市', longitude: 117.9396, latitude: 40.9925, timezone: 'Asia/Shanghai' },
  '1309': { name: '沧州市', longitude: 116.8579, latitude: 38.2971, timezone: 'Asia/Shanghai' },
  '1310': { name: '廊坊市', longitude: 116.7038, latitude: 39.5186, timezone: 'Asia/Shanghai' },
  '1311': { name: '衡水市', longitude: 115.6657, latitude: 37.7161, timezone: 'Asia/Shanghai' },
  
  // 山西省
  '1401': { name: '太原市', longitude: 112.5489, latitude: 37.8706, timezone: 'Asia/Shanghai' },
  '1402': { name: '大同市', longitude: 113.3007, latitude: 40.0769, timezone: 'Asia/Shanghai' },
  '1403': { name: '阳泉市', longitude: 113.5635, latitude: 37.8615, timezone: 'Asia/Shanghai' },
  '1404': { name: '长治市', longitude: 113.1143, latitude: 36.1915, timezone: 'Asia/Shanghai' },
  '1405': { name: '晋城市', longitude: 112.8513, latitude: 35.4975, timezone: 'Asia/Shanghai' },
  '1406': { name: '朔州市', longitude: 112.4333, latitude: 39.3313, timezone: 'Asia/Shanghai' },
  '1407': { name: '晋中市', longitude: 112.7536, latitude: 37.6965, timezone: 'Asia/Shanghai' },
  '1408': { name: '运城市', longitude: 111.0037, latitude: 35.0228, timezone: 'Asia/Shanghai' },
  '1409': { name: '忻州市', longitude: 112.7341, latitude: 38.4177, timezone: 'Asia/Shanghai' },
  '1410': { name: '临汾市', longitude: 111.5179, latitude: 36.0881, timezone: 'Asia/Shanghai' },
  '1411': { name: '吕梁市', longitude: 111.1347, latitude: 37.5177, timezone: 'Asia/Shanghai' },
  
  // 内蒙古自治区
  '1501': { name: '呼和浩特市', longitude: 111.7519, latitude: 40.8414, timezone: 'Asia/Shanghai' },
  '1502': { name: '包头市', longitude: 109.8403, latitude: 40.6581, timezone: 'Asia/Shanghai' },
  '1503': { name: '乌海市', longitude: 106.7944, latitude: 39.6739, timezone: 'Asia/Shanghai' },
  '1504': { name: '赤峰市', longitude: 118.9569, latitude: 42.2755, timezone: 'Asia/Shanghai' },
  '1505': { name: '通辽市', longitude: 122.2630, latitude: 43.6174, timezone: 'Asia/Shanghai' },
  '1506': { name: '鄂尔多斯市', longitude: 109.7810, latitude: 39.6086, timezone: 'Asia/Shanghai' },
  '1507': { name: '呼伦贝尔市', longitude: 119.7658, latitude: 49.2153, timezone: 'Asia/Shanghai' },
  '1508': { name: '巴彦淖尔市', longitude: 107.4167, latitude: 40.7574, timezone: 'Asia/Shanghai' },
  '1509': { name: '乌兰察布市', longitude: 113.1147, latitude: 41.0341, timezone: 'Asia/Shanghai' },
  '1522': { name: '兴安盟', longitude: 122.0706, latitude: 46.0763, timezone: 'Asia/Shanghai' },
  '1525': { name: '锡林郭勒盟', longitude: 116.0909, latitude: 43.9444, timezone: 'Asia/Shanghai' },
  '1529': { name: '阿拉善盟', longitude: 105.7286, latitude: 38.8448, timezone: 'Asia/Shanghai' },
  
  // 辽宁省
  '2101': { name: '沈阳市', longitude: 123.4315, latitude: 41.8057, timezone: 'Asia/Shanghai' },
  '2102': { name: '大连市', longitude: 121.6147, latitude: 38.9140, timezone: 'Asia/Shanghai' },
  '2103': { name: '鞍山市', longitude: 122.9951, latitude: 41.1106, timezone: 'Asia/Shanghai' },
  '2104': { name: '抚顺市', longitude: 123.9571, latitude: 41.8654, timezone: 'Asia/Shanghai' },
  '2105': { name: '本溪市', longitude: 123.7708, latitude: 41.2944, timezone: 'Asia/Shanghai' },
  '2106': { name: '丹东市', longitude: 124.3540, latitude: 40.1244, timezone: 'Asia/Shanghai' },
  '2107': { name: '锦州市', longitude: 121.1353, latitude: 41.1192, timezone: 'Asia/Shanghai' },
  '2108': { name: '营口市', longitude: 122.2352, latitude: 40.6674, timezone: 'Asia/Shanghai' },
  '2109': { name: '阜新市', longitude: 121.6490, latitude: 42.0118, timezone: 'Asia/Shanghai' },
  '2110': { name: '辽阳市', longitude: 123.1817, latitude: 41.2694, timezone: 'Asia/Shanghai' },
  '2111': { name: '盘锦市', longitude: 122.0709, latitude: 41.1245, timezone: 'Asia/Shanghai' },
  '2112': { name: '铁岭市', longitude: 123.8444, latitude: 42.2906, timezone: 'Asia/Shanghai' },
  '2113': { name: '朝阳市', longitude: 120.4516, latitude: 41.5718, timezone: 'Asia/Shanghai' },
  '2114': { name: '葫芦岛市', longitude: 120.8560, latitude: 40.7113, timezone: 'Asia/Shanghai' },
  
  // 吉林省
  '2201': { name: '长春市', longitude: 125.3245, latitude: 43.8171, timezone: 'Asia/Shanghai' },
  '2202': { name: '吉林市', longitude: 126.5530, latitude: 43.8436, timezone: 'Asia/Shanghai' },
  '2203': { name: '四平市', longitude: 124.3707, latitude: 43.1703, timezone: 'Asia/Shanghai' },
  '2204': { name: '辽源市', longitude: 125.1455, latitude: 42.9027, timezone: 'Asia/Shanghai' },
  '2205': { name: '通化市', longitude: 125.9365, latitude: 41.7214, timezone: 'Asia/Shanghai' },
  '2206': { name: '白山市', longitude: 126.4277, latitude: 41.9425, timezone: 'Asia/Shanghai' },
  '2207': { name: '松原市', longitude: 124.8254, latitude: 45.1182, timezone: 'Asia/Shanghai' },
  '2208': { name: '白城市', longitude: 122.8397, latitude: 45.6196, timezone: 'Asia/Shanghai' },
  '2224': { name: '延边朝鲜族自治州', longitude: 129.5135, latitude: 42.9048, timezone: 'Asia/Shanghai' },
  
  // 黑龙江省
  '2301': { name: '哈尔滨市', longitude: 126.5358, latitude: 45.8023, timezone: 'Asia/Shanghai' },
  '2302': { name: '齐齐哈尔市', longitude: 123.9180, latitude: 47.3543, timezone: 'Asia/Shanghai' },
  '2303': { name: '鸡西市', longitude: 130.9759, latitude: 45.3000, timezone: 'Asia/Shanghai' },
  '2304': { name: '鹤岗市', longitude: 130.2773, latitude: 47.3320, timezone: 'Asia/Shanghai' },
  '2305': { name: '双鸭山市', longitude: 131.1570, latitude: 46.6434, timezone: 'Asia/Shanghai' },
  '2306': { name: '大庆市', longitude: 125.1031, latitude: 46.5907, timezone: 'Asia/Shanghai' },
  '2307': { name: '伊春市', longitude: 128.8990, latitude: 47.7248, timezone: 'Asia/Shanghai' },
  '2308': { name: '佳木斯市', longitude: 130.3619, latitude: 46.8099, timezone: 'Asia/Shanghai' },
  '2309': { name: '七台河市', longitude: 131.0159, latitude: 45.7712, timezone: 'Asia/Shanghai' },
  '2310': { name: '牡丹江市', longitude: 129.6186, latitude: 44.5831, timezone: 'Asia/Shanghai' },
  '2311': { name: '黑河市', longitude: 127.4990, latitude: 50.2496, timezone: 'Asia/Shanghai' },
  '2312': { name: '绥化市', longitude: 126.9929, latitude: 46.6374, timezone: 'Asia/Shanghai' },
  '2327': { name: '大兴安岭地区', longitude: 124.1152, latitude: 50.4254, timezone: 'Asia/Shanghai' },
  
  // 江苏省
  '3201': { name: '南京市', longitude: 118.7969, latitude: 32.0603, timezone: 'Asia/Shanghai' },
  '3202': { name: '无锡市', longitude: 120.3019, latitude: 31.5747, timezone: 'Asia/Shanghai' },
  '3203': { name: '徐州市', longitude: 117.1848, latitude: 34.2618, timezone: 'Asia/Shanghai' },
  '3204': { name: '常州市', longitude: 119.9463, latitude: 31.7720, timezone: 'Asia/Shanghai' },
  '3205': { name: '苏州市', longitude: 120.5853, latitude: 31.2989, timezone: 'Asia/Shanghai' },
  '3206': { name: '南通市', longitude: 120.8644, latitude: 32.0162, timezone: 'Asia/Shanghai' },
  '3207': { name: '连云港市', longitude: 119.1781, latitude: 34.5996, timezone: 'Asia/Shanghai' },
  '3208': { name: '淮安市', longitude: 119.0153, latitude: 33.5975, timezone: 'Asia/Shanghai' },
  '3209': { name: '盐城市', longitude: 120.1398, latitude: 33.3776, timezone: 'Asia/Shanghai' },
  '3210': { name: '扬州市', longitude: 119.4215, latitude: 32.3932, timezone: 'Asia/Shanghai' },
  '3211': { name: '镇江市', longitude: 119.4520, latitude: 32.2044, timezone: 'Asia/Shanghai' },
  '3212': { name: '泰州市', longitude: 119.9153, latitude: 32.4849, timezone: 'Asia/Shanghai' },
  '3213': { name: '宿迁市', longitude: 118.2757, latitude: 33.9630, timezone: 'Asia/Shanghai' },
  
  // 浙江省
  '3301': { name: '杭州市', longitude: 120.1551, latitude: 30.2741, timezone: 'Asia/Shanghai' },
  '3302': { name: '宁波市', longitude: 121.5440, latitude: 29.8683, timezone: 'Asia/Shanghai' },
  '3303': { name: '温州市', longitude: 120.6994, latitude: 28.0006, timezone: 'Asia/Shanghai' },
  '3304': { name: '嘉兴市', longitude: 120.7554, latitude: 30.7469, timezone: 'Asia/Shanghai' },
  '3305': { name: '湖州市', longitude: 120.0865, latitude: 30.8936, timezone: 'Asia/Shanghai' },
  '3306': { name: '绍兴市', longitude: 120.5820, latitude: 30.0023, timezone: 'Asia/Shanghai' },
  '3307': { name: '金华市', longitude: 119.6492, latitude: 29.0895, timezone: 'Asia/Shanghai' },
  '3308': { name: '衢州市', longitude: 118.8728, latitude: 28.9417, timezone: 'Asia/Shanghai' },
  '3309': { name: '舟山市', longitude: 122.1070, latitude: 30.0360, timezone: 'Asia/Shanghai' },
  '3310': { name: '台州市', longitude: 121.4287, latitude: 28.6561, timezone: 'Asia/Shanghai' },
  '3311': { name: '丽水市', longitude: 119.9219, latitude: 28.4517, timezone: 'Asia/Shanghai' },
  
  // 安徽省
  '3401': { name: '合肥市', longitude: 117.2272, latitude: 31.8206, timezone: 'Asia/Shanghai' },
  '3402': { name: '芜湖市', longitude: 118.3762, latitude: 31.3262, timezone: 'Asia/Shanghai' },
  '3403': { name: '蚌埠市', longitude: 117.3638, latitude: 32.9165, timezone: 'Asia/Shanghai' },
  '3404': { name: '淮南市', longitude: 117.0183, latitude: 32.6473, timezone: 'Asia/Shanghai' },
  '3405': { name: '马鞍山市', longitude: 118.5077, latitude: 31.6890, timezone: 'Asia/Shanghai' },
  '3406': { name: '淮北市', longitude: 116.7947, latitude: 33.9717, timezone: 'Asia/Shanghai' },
  '3407': { name: '铜陵市', longitude: 117.8165, latitude: 30.9299, timezone: 'Asia/Shanghai' },
  '3408': { name: '安庆市', longitude: 117.0536, latitude: 30.5255, timezone: 'Asia/Shanghai' },
  '3410': { name: '黄山市', longitude: 118.3177, latitude: 29.7091, timezone: 'Asia/Shanghai' },
  '3411': { name: '滁州市', longitude: 118.3162, latitude: 32.3173, timezone: 'Asia/Shanghai' },
  '3412': { name: '阜阳市', longitude: 115.8197, latitude: 32.8969, timezone: 'Asia/Shanghai' },
  '3413': { name: '宿州市', longitude: 116.9640, latitude: 33.6341, timezone: 'Asia/Shanghai' },
  '3415': { name: '六安市', longitude: 116.5078, latitude: 31.7529, timezone: 'Asia/Shanghai' },
  '3416': { name: '亳州市', longitude: 115.7823, latitude: 33.8712, timezone: 'Asia/Shanghai' },
  '3417': { name: '池州市', longitude: 117.4893, latitude: 30.6600, timezone: 'Asia/Shanghai' },
  '3418': { name: '宣城市', longitude: 118.7576, latitude: 30.9456, timezone: 'Asia/Shanghai' },
  
  // 福建省
  '3501': { name: '福州市', longitude: 119.3063, latitude: 26.0745, timezone: 'Asia/Shanghai' },
  '3502': { name: '厦门市', longitude: 118.1100, latitude: 24.4798, timezone: 'Asia/Shanghai' },
  '3503': { name: '莆田市', longitude: 119.0077, latitude: 25.4310, timezone: 'Asia/Shanghai' },
  '3504': { name: '三明市', longitude: 117.6350, latitude: 26.2654, timezone: 'Asia/Shanghai' },
  '3505': { name: '泉州市', longitude: 118.5865, latitude: 24.8740, timezone: 'Asia/Shanghai' },
  '3506': { name: '漳州市', longitude: 117.6619, latitude: 24.5109, timezone: 'Asia/Shanghai' },
  '3507': { name: '南平市', longitude: 118.1780, latitude: 26.6358, timezone: 'Asia/Shanghai' },
  '3508': { name: '龙岩市', longitude: 117.0297, latitude: 25.0918, timezone: 'Asia/Shanghai' },
  '3509': { name: '宁德市', longitude: 119.5270, latitude: 26.6590, timezone: 'Asia/Shanghai' },
  
  // 江西省
  '3601': { name: '南昌市', longitude: 115.8921, latitude: 28.6765, timezone: 'Asia/Shanghai' },
  '3602': { name: '景德镇市', longitude: 117.2147, latitude: 29.2926, timezone: 'Asia/Shanghai' },
  '3603': { name: '萍乡市', longitude: 113.8520, latitude: 27.6229, timezone: 'Asia/Shanghai' },
  '3604': { name: '九江市', longitude: 115.9929, latitude: 29.7052, timezone: 'Asia/Shanghai' },
  '3605': { name: '新余市', longitude: 114.9307, latitude: 27.8175, timezone: 'Asia/Shanghai' },
  '3606': { name: '鹰潭市', longitude: 117.0338, latitude: 28.2386, timezone: 'Asia/Shanghai' },
  '3607': { name: '赣州市', longitude: 114.9403, latitude: 25.8312, timezone: 'Asia/Shanghai' },
  '3608': { name: '吉安市', longitude: 114.9865, latitude: 27.1117, timezone: 'Asia/Shanghai' },
  '3609': { name: '宜春市', longitude: 114.3916, latitude: 27.8043, timezone: 'Asia/Shanghai' },
  '3610': { name: '抚州市', longitude: 116.3583, latitude: 27.9839, timezone: 'Asia/Shanghai' },
  '3611': { name: '上饶市', longitude: 117.9711, latitude: 28.4444, timezone: 'Asia/Shanghai' },
  
  // 山东省
  '3701': { name: '济南市', longitude: 117.0009, latitude: 36.6758, timezone: 'Asia/Shanghai' },
  '3702': { name: '青岛市', longitude: 120.3826, latitude: 36.0671, timezone: 'Asia/Shanghai' },
  '3703': { name: '淄博市', longitude: 118.0371, latitude: 36.8113, timezone: 'Asia/Shanghai' },
  '3704': { name: '枣庄市', longitude: 117.5579, latitude: 34.8564, timezone: 'Asia/Shanghai' },
  '3705': { name: '东营市', longitude: 118.6748, latitude: 37.4341, timezone: 'Asia/Shanghai' },
  '3706': { name: '烟台市', longitude: 121.3914, latitude: 37.5393, timezone: 'Asia/Shanghai' },
  '3707': { name: '潍坊市', longitude: 119.1070, latitude: 36.7093, timezone: 'Asia/Shanghai' },
  '3708': { name: '济宁市', longitude: 116.5873, latitude: 35.4154, timezone: 'Asia/Shanghai' },
  '3709': { name: '泰安市', longitude: 117.1289, latitude: 36.1949, timezone: 'Asia/Shanghai' },
  '3710': { name: '威海市', longitude: 122.1201, latitude: 37.5097, timezone: 'Asia/Shanghai' },
  '3711': { name: '日照市', longitude: 119.4610, latitude: 35.4164, timezone: 'Asia/Shanghai' },
  '3713': { name: '临沂市', longitude: 118.3269, latitude: 35.1045, timezone: 'Asia/Shanghai' },
  '3714': { name: '德州市', longitude: 116.3073, latitude: 37.4513, timezone: 'Asia/Shanghai' },
  '3715': { name: '聊城市', longitude: 115.9851, latitude: 36.4560, timezone: 'Asia/Shanghai' },
  '3716': { name: '滨州市', longitude: 118.0168, latitude: 37.3835, timezone: 'Asia/Shanghai' },
  '3717': { name: '菏泽市', longitude: 115.4697, latitude: 35.2465, timezone: 'Asia/Shanghai' },
  
  // 河南省
  '4101': { name: '郑州市', longitude: 113.6254, latitude: 34.7466, timezone: 'Asia/Shanghai' },
  '4102': { name: '开封市', longitude: 114.3411, latitude: 34.7971, timezone: 'Asia/Shanghai' },
  '4103': { name: '洛阳市', longitude: 112.4540, latitude: 34.6197, timezone: 'Asia/Shanghai' },
  '4104': { name: '平顶山市', longitude: 113.3073, latitude: 33.7453, timezone: 'Asia/Shanghai' },
  '4105': { name: '安阳市', longitude: 114.3927, latitude: 36.1034, timezone: 'Asia/Shanghai' },
  '4106': { name: '鹤壁市', longitude: 114.2951, latitude: 35.7480, timezone: 'Asia/Shanghai' },
  '4107': { name: '新乡市', longitude: 113.9268, latitude: 35.3030, timezone: 'Asia/Shanghai' },
  '4108': { name: '焦作市', longitude: 113.2418, latitude: 35.2158, timezone: 'Asia/Shanghai' },
  '4109': { name: '濮阳市', longitude: 115.0410, latitude: 35.7617, timezone: 'Asia/Shanghai' },
  '4110': { name: '许昌市', longitude: 113.8260, latitude: 34.0229, timezone: 'Asia/Shanghai' },
  '4111': { name: '漯河市', longitude: 114.0262, latitude: 33.5756, timezone: 'Asia/Shanghai' },
  '4112': { name: '三门峡市', longitude: 111.1941, latitude: 34.7773, timezone: 'Asia/Shanghai' },
  '4113': { name: '南阳市', longitude: 112.5407, latitude: 32.9990, timezone: 'Asia/Shanghai' },
  '4114': { name: '商丘市', longitude: 115.6506, latitude: 34.4141, timezone: 'Asia/Shanghai' },
  '4115': { name: '信阳市', longitude: 114.0751, latitude: 32.1470, timezone: 'Asia/Shanghai' },
  '4116': { name: '周口市', longitude: 114.6496, latitude: 33.6204, timezone: 'Asia/Shanghai' },
  '4117': { name: '驻马店市', longitude: 114.0220, latitude: 32.9800, timezone: 'Asia/Shanghai' },
  '4190': { name: '济源市', longitude: 112.6016, latitude: 35.0904, timezone: 'Asia/Shanghai' },
  
  // 湖北省
  '4201': { name: '武汉市', longitude: 114.2985, latitude: 30.5844, timezone: 'Asia/Shanghai' },
  '4202': { name: '黄石市', longitude: 115.0770, latitude: 30.2200, timezone: 'Asia/Shanghai' },
  '4203': { name: '十堰市', longitude: 110.7874, latitude: 32.6469, timezone: 'Asia/Shanghai' },
  '4205': { name: '宜昌市', longitude: 111.3009, latitude: 30.7327, timezone: 'Asia/Shanghai' },
  '4206': { name: '襄阳市', longitude: 112.1441, latitude: 32.0420, timezone: 'Asia/Shanghai' },
  '4207': { name: '鄂州市', longitude: 114.8909, latitude: 30.3844, timezone: 'Asia/Shanghai' },
  '4208': { name: '荆门市', longitude: 112.2040, latitude: 31.0354, timezone: 'Asia/Shanghai' },
  '4209': { name: '孝感市', longitude: 113.9267, latitude: 30.9264, timezone: 'Asia/Shanghai' },
  '4210': { name: '荆州市', longitude: 112.2386, latitude: 30.3269, timezone: 'Asia/Shanghai' },
  '4211': { name: '黄冈市', longitude: 114.8795, latitude: 30.4477, timezone: 'Asia/Shanghai' },
  '4212': { name: '咸宁市', longitude: 114.3289, latitude: 29.8326, timezone: 'Asia/Shanghai' },
  '4213': { name: '随州市', longitude: 113.3741, latitude: 31.7175, timezone: 'Asia/Shanghai' },
  '4228': { name: '恩施土家族苗族自治州', longitude: 109.4886, latitude: 30.2830, timezone: 'Asia/Shanghai' },
  '4290': { name: '仙桃市', longitude: 113.4539, latitude: 30.3648, timezone: 'Asia/Shanghai' },
  '4291': { name: '潜江市', longitude: 112.8969, latitude: 30.4210, timezone: 'Asia/Shanghai' },
  '4292': { name: '天门市', longitude: 113.1659, latitude: 30.6531, timezone: 'Asia/Shanghai' },
  
  // 湖南省
  '4301': { name: '长沙市', longitude: 112.9388, latitude: 28.2282, timezone: 'Asia/Shanghai' },
  '4302': { name: '株洲市', longitude: 113.1518, latitude: 27.8274, timezone: 'Asia/Shanghai' },
  '4303': { name: '湘潭市', longitude: 112.9445, latitude: 27.8294, timezone: 'Asia/Shanghai' },
  '4304': { name: '衡阳市', longitude: 112.6072, latitude: 26.8934, timezone: 'Asia/Shanghai' },
  '4305': { name: '邵阳市', longitude: 111.4681, latitude: 27.2378, timezone: 'Asia/Shanghai' },
  '4306': { name: '岳阳市', longitude: 113.1287, latitude: 29.3570, timezone: 'Asia/Shanghai' },
  '4307': { name: '常德市', longitude: 111.6982, latitude: 29.0402, timezone: 'Asia/Shanghai' },
  '4308': { name: '张家界市', longitude: 110.4790, latitude: 29.1274, timezone: 'Asia/Shanghai' },
  '4309': { name: '益阳市', longitude: 112.3550, latitude: 28.5701, timezone: 'Asia/Shanghai' },
  '4310': { name: '郴州市', longitude: 113.0322, latitude: 25.7706, timezone: 'Asia/Shanghai' },
  '4311': { name: '永州市', longitude: 111.6088, latitude: 26.4204, timezone: 'Asia/Shanghai' },
  '4312': { name: '怀化市', longitude: 109.9779, latitude: 27.5501, timezone: 'Asia/Shanghai' },
  '4313': { name: '娄底市', longitude: 112.0085, latitude: 27.7281, timezone: 'Asia/Shanghai' },
  '4331': { name: '湘西土家族苗族自治州', longitude: 109.7390, latitude: 28.3144, timezone: 'Asia/Shanghai' },
  
  // 广东省
  '4401': { name: '广州市', longitude: 113.2644, latitude: 23.1291, timezone: 'Asia/Shanghai' },
  '4402': { name: '韶关市', longitude: 113.5917, latitude: 24.8016, timezone: 'Asia/Shanghai' },
  '4403': { name: '深圳市', longitude: 114.0579, latitude: 22.5431, timezone: 'Asia/Shanghai' },
  '4404': { name: '珠海市', longitude: 113.5530, latitude: 22.2249, timezone: 'Asia/Shanghai' },
  '4405': { name: '汕头市', longitude: 116.7081, latitude: 23.3540, timezone: 'Asia/Shanghai' },
  '4406': { name: '佛山市', longitude: 113.1220, latitude: 23.0288, timezone: 'Asia/Shanghai' },
  '4407': { name: '江门市', longitude: 113.0946, latitude: 22.5901, timezone: 'Asia/Shanghai' },
  '4408': { name: '湛江市', longitude: 110.3594, latitude: 21.2707, timezone: 'Asia/Shanghai' },
  '4409': { name: '茂名市', longitude: 110.9255, latitude: 21.6687, timezone: 'Asia/Shanghai' },
  '4412': { name: '肇庆市', longitude: 112.4721, latitude: 23.0515, timezone: 'Asia/Shanghai' },
  '4413': { name: '惠州市', longitude: 114.4152, latitude: 23.0794, timezone: 'Asia/Shanghai' },
  '4414': { name: '梅州市', longitude: 116.1178, latitude: 24.2991, timezone: 'Asia/Shanghai' },
  '4415': { name: '汕尾市', longitude: 115.3648, latitude: 22.7745, timezone: 'Asia/Shanghai' },
  '4416': { name: '河源市', longitude: 114.6974, latitude: 23.7460, timezone: 'Asia/Shanghai' },
  '4417': { name: '阳江市', longitude: 111.9755, latitude: 21.8590, timezone: 'Asia/Shanghai' },
  '4418': { name: '清远市', longitude: 113.0514, latitude: 23.6817, timezone: 'Asia/Shanghai' },
  '4419': { name: '东莞市', longitude: 113.7462, latitude: 23.0205, timezone: 'Asia/Shanghai' },
  '4420': { name: '中山市', longitude: 113.3823, latitude: 22.5152, timezone: 'Asia/Shanghai' },
  '4451': { name: '潮州市', longitude: 116.6302, latitude: 23.6618, timezone: 'Asia/Shanghai' },
  '4452': { name: '揭阳市', longitude: 116.3729, latitude: 23.5538, timezone: 'Asia/Shanghai' },
  '4453': { name: '云浮市', longitude: 112.0446, latitude: 22.9297, timezone: 'Asia/Shanghai' },
  
  // 广西壮族自治区
  '4501': { name: '南宁市', longitude: 108.3669, latitude: 22.8170, timezone: 'Asia/Shanghai' },
  '4502': { name: '柳州市', longitude: 109.4281, latitude: 24.3146, timezone: 'Asia/Shanghai' },
  '4503': { name: '桂林市', longitude: 110.2993, latitude: 25.2342, timezone: 'Asia/Shanghai' },
  '4504': { name: '梧州市', longitude: 111.2792, latitude: 23.4748, timezone: 'Asia/Shanghai' },
  '4505': { name: '北海市', longitude: 109.1193, latitude: 21.4733, timezone: 'Asia/Shanghai' },
  '4506': { name: '防城港市', longitude: 108.3540, latitude: 21.6146, timezone: 'Asia/Shanghai' },
  '4507': { name: '钦州市', longitude: 108.6544, latitude: 21.9570, timezone: 'Asia/Shanghai' },
  '4508': { name: '贵港市', longitude: 109.6027, latitude: 23.0936, timezone: 'Asia/Shanghai' },
  '4509': { name: '玉林市', longitude: 110.1544, latitude: 22.6314, timezone: 'Asia/Shanghai' },
  '4510': { name: '百色市', longitude: 106.6003, latitude: 23.8973, timezone: 'Asia/Shanghai' },
  '4511': { name: '贺州市', longitude: 111.5520, latitude: 24.4141, timezone: 'Asia/Shanghai' },
  '4512': { name: '河池市', longitude: 108.0623, latitude: 24.6960, timezone: 'Asia/Shanghai' },
  '4513': { name: '来宾市', longitude: 109.2287, latitude: 23.7338, timezone: 'Asia/Shanghai' },
  '4514': { name: '崇左市', longitude: 107.3645, latitude: 22.4041, timezone: 'Asia/Shanghai' },
  
  // 海南省
  '4601': { name: '海口市', longitude: 110.3312, latitude: 20.0311, timezone: 'Asia/Shanghai' },
  '4602': { name: '三亚市', longitude: 109.5118, latitude: 18.2577, timezone: 'Asia/Shanghai' },
  '4603': { name: '三沙市', longitude: 112.3486, latitude: 16.8310, timezone: 'Asia/Shanghai' },
  '4604': { name: '儋州市', longitude: 109.5765, latitude: 19.5175, timezone: 'Asia/Shanghai' },
  
  // 四川省
  '5101': { name: '成都市', longitude: 104.0665, latitude: 30.5723, timezone: 'Asia/Shanghai' },
  '5103': { name: '自贡市', longitude: 104.7794, latitude: 29.3528, timezone: 'Asia/Shanghai' },
  '5104': { name: '攀枝花市', longitude: 101.7183, latitude: 26.5804, timezone: 'Asia/Shanghai' },
  '5105': { name: '泸州市', longitude: 105.4433, latitude: 28.8718, timezone: 'Asia/Shanghai' },
  '5106': { name: '德阳市', longitude: 104.3982, latitude: 31.1270, timezone: 'Asia/Shanghai' },
  '5107': { name: '绵阳市', longitude: 104.6794, latitude: 31.4677, timezone: 'Asia/Shanghai' },
  '5108': { name: '广元市', longitude: 105.8430, latitude: 32.4336, timezone: 'Asia/Shanghai' },
  '5109': { name: '遂宁市', longitude: 105.5713, latitude: 30.5327, timezone: 'Asia/Shanghai' },
  '5110': { name: '内江市', longitude: 105.0661, latitude: 29.5803, timezone: 'Asia/Shanghai' },
  '5111': { name: '乐山市', longitude: 103.7614, latitude: 29.5522, timezone: 'Asia/Shanghai' },
  '5113': { name: '南充市', longitude: 106.0830, latitude: 30.7953, timezone: 'Asia/Shanghai' },
  '5114': { name: '眉山市', longitude: 103.8311, latitude: 30.0756, timezone: 'Asia/Shanghai' },
  '5115': { name: '宜宾市', longitude: 104.6308, latitude: 28.7602, timezone: 'Asia/Shanghai' },
  '5116': { name: '广安市', longitude: 106.6333, latitude: 30.4564, timezone: 'Asia/Shanghai' },
  '5117': { name: '达州市', longitude: 107.5023, latitude: 31.2090, timezone: 'Asia/Shanghai' },
  '5118': { name: '雅安市', longitude: 103.0014, latitude: 29.9877, timezone: 'Asia/Shanghai' },
  '5119': { name: '巴中市', longitude: 106.7537, latitude: 31.8691, timezone: 'Asia/Shanghai' },
  '5120': { name: '资阳市', longitude: 104.6419, latitude: 30.1222, timezone: 'Asia/Shanghai' },
  '5132': { name: '阿坝藏族羌族自治州', longitude: 102.2211, latitude: 31.8998, timezone: 'Asia/Shanghai' },
  '5133': { name: '甘孜藏族自治州', longitude: 101.9638, latitude: 30.0498, timezone: 'Asia/Shanghai' },
  '5134': { name: '凉山彝族自治州', longitude: 102.2587, latitude: 27.8868, timezone: 'Asia/Shanghai' },
  
  // 贵州省
  '5201': { name: '贵阳市', longitude: 106.7135, latitude: 26.5783, timezone: 'Asia/Shanghai' },
  '5202': { name: '六盘水市', longitude: 104.8469, latitude: 26.5918, timezone: 'Asia/Shanghai' },
  '5203': { name: '遵义市', longitude: 106.9374, latitude: 27.7060, timezone: 'Asia/Shanghai' },
  '5204': { name: '安顺市', longitude: 105.9476, latitude: 26.2455, timezone: 'Asia/Shanghai' },
  '5205': { name: '毕节市', longitude: 105.2850, latitude: 27.3017, timezone: 'Asia/Shanghai' },
  '5206': { name: '铜仁市', longitude: 109.1896, latitude: 27.7183, timezone: 'Asia/Shanghai' },
  '5223': { name: '黔西南布依族苗族自治州', longitude: 104.9097, latitude: 25.0881, timezone: 'Asia/Shanghai' },
  '5226': { name: '黔东南苗族侗族自治州', longitude: 107.9774, latitude: 26.5834, timezone: 'Asia/Shanghai' },
  '5227': { name: '黔南布依族苗族自治州', longitude: 107.5170, latitude: 26.2582, timezone: 'Asia/Shanghai' },
  
  // 云南省
  '5301': { name: '昆明市', longitude: 102.8329, latitude: 24.8801, timezone: 'Asia/Shanghai' },
  '5303': { name: '曲靖市', longitude: 103.7976, latitude: 25.5016, timezone: 'Asia/Shanghai' },
  '5304': { name: '玉溪市', longitude: 102.5437, latitude: 24.3505, timezone: 'Asia/Shanghai' },
  '5305': { name: '保山市', longitude: 99.1670, latitude: 25.1118, timezone: 'Asia/Shanghai' },
  '5306': { name: '昭通市', longitude: 103.7172, latitude: 27.3364, timezone: 'Asia/Shanghai' },
  '5307': { name: '丽江市', longitude: 100.2330, latitude: 26.8721, timezone: 'Asia/Shanghai' },
  '5308': { name: '普洱市', longitude: 100.9722, latitude: 22.7773, timezone: 'Asia/Shanghai' },
  '5309': { name: '临沧市', longitude: 100.0865, latitude: 23.8878, timezone: 'Asia/Shanghai' },
  '5323': { name: '楚雄彝族自治州', longitude: 101.5457, latitude: 25.0414, timezone: 'Asia/Shanghai' },
  '5325': { name: '红河哈尼族彝族自治州', longitude: 103.3843, latitude: 23.3668, timezone: 'Asia/Shanghai' },
  '5326': { name: '文山壮族苗族自治州', longitude: 104.2447, latitude: 23.3695, timezone: 'Asia/Shanghai' },
  '5328': { name: '西双版纳傣族自治州', longitude: 100.7971, latitude: 22.0017, timezone: 'Asia/Shanghai' },
  '5329': { name: '大理白族自治州', longitude: 100.2670, latitude: 25.6064, timezone: 'Asia/Shanghai' },
  '5331': { name: '德宏傣族景颇族自治州', longitude: 98.5784, latitude: 24.4367, timezone: 'Asia/Shanghai' },
  '5333': { name: '怒江傈僳族自治州', longitude: 98.8543, latitude: 25.8509, timezone: 'Asia/Shanghai' },
  '5334': { name: '迪庆藏族自治州', longitude: 99.7065, latitude: 27.8269, timezone: 'Asia/Shanghai' },
  
  // 西藏自治区
  '5401': { name: '拉萨市', longitude: 91.1409, latitude: 29.6456, timezone: 'Asia/Shanghai' },
  '5402': { name: '日喀则市', longitude: 88.8851, latitude: 29.2690, timezone: 'Asia/Shanghai' },
  '5403': { name: '昌都市', longitude: 97.1785, latitude: 31.1369, timezone: 'Asia/Shanghai' },
  '5404': { name: '林芝市', longitude: 94.3624, latitude: 29.6544, timezone: 'Asia/Shanghai' },
  '5405': { name: '山南市', longitude: 91.7665, latitude: 29.2362, timezone: 'Asia/Shanghai' },
  '5406': { name: '那曲市', longitude: 92.0602, latitude: 31.4760, timezone: 'Asia/Shanghai' },
  '5425': { name: '阿里地区', longitude: 80.1055, latitude: 32.5032, timezone: 'Asia/Shanghai' },
  
  // 陕西省
  '6101': { name: '西安市', longitude: 108.9398, latitude: 34.3412, timezone: 'Asia/Shanghai' },
  '6102': { name: '铜川市', longitude: 108.9794, latitude: 34.8965, timezone: 'Asia/Shanghai' },
  '6103': { name: '宝鸡市', longitude: 107.1826, latitude: 34.3640, timezone: 'Asia/Shanghai' },
  '6104': { name: '咸阳市', longitude: 108.7093, latitude: 34.3336, timezone: 'Asia/Shanghai' },
  '6105': { name: '渭南市', longitude: 109.5029, latitude: 34.4994, timezone: 'Asia/Shanghai' },
  '6106': { name: '延安市', longitude: 109.4897, latitude: 36.5965, timezone: 'Asia/Shanghai' },
  '6107': { name: '汉中市', longitude: 107.0282, latitude: 33.0777, timezone: 'Asia/Shanghai' },
  '6108': { name: '榆林市', longitude: 109.7341, latitude: 38.2900, timezone: 'Asia/Shanghai' },
  '6109': { name: '安康市', longitude: 109.0295, latitude: 32.6903, timezone: 'Asia/Shanghai' },
  '6110': { name: '商洛市', longitude: 109.9400, latitude: 33.8739, timezone: 'Asia/Shanghai' },
  
  // 甘肃省
  '6201': { name: '兰州市', longitude: 103.8343, latitude: 36.0611, timezone: 'Asia/Shanghai' },
  '6202': { name: '嘉峪关市', longitude: 98.2773, latitude: 39.7865, timezone: 'Asia/Shanghai' },
  '6203': { name: '金昌市', longitude: 102.1879, latitude: 38.5142, timezone: 'Asia/Shanghai' },
  '6204': { name: '白银市', longitude: 104.1735, latitude: 36.5457, timezone: 'Asia/Shanghai' },
  '6205': { name: '天水市', longitude: 105.7249, latitude: 34.5785, timezone: 'Asia/Shanghai' },
  '6206': { name: '武威市', longitude: 102.6348, latitude: 37.9282, timezone: 'Asia/Shanghai' },
  '6207': { name: '张掖市', longitude: 100.4498, latitude: 38.9329, timezone: 'Asia/Shanghai' },
  '6208': { name: '平凉市', longitude: 106.6847, latitude: 35.5428, timezone: 'Asia/Shanghai' },
  '6209': { name: '酒泉市', longitude: 98.5109, latitude: 39.7325, timezone: 'Asia/Shanghai' },
  '6210': { name: '庆阳市', longitude: 107.6434, latitude: 35.7342, timezone: 'Asia/Shanghai' },
  '6211': { name: '定西市', longitude: 104.6260, latitude: 35.5796, timezone: 'Asia/Shanghai' },
  '6212': { name: '陇南市', longitude: 104.9214, latitude: 33.3886, timezone: 'Asia/Shanghai' },
  '6229': { name: '临夏回族自治州', longitude: 103.2110, latitude: 35.5994, timezone: 'Asia/Shanghai' },
  '6230': { name: '甘南藏族自治州', longitude: 102.9110, latitude: 34.9864, timezone: 'Asia/Shanghai' },
  
  // 青海省
  '6301': { name: '西宁市', longitude: 101.7782, latitude: 36.6171, timezone: 'Asia/Shanghai' },
  '6302': { name: '海东市', longitude: 102.1030, latitude: 36.5029, timezone: 'Asia/Shanghai' },
  '6322': { name: '海北藏族自治州', longitude: 100.9010, latitude: 36.9595, timezone: 'Asia/Shanghai' },
  '6323': { name: '黄南藏族自治州', longitude: 102.0198, latitude: 35.5177, timezone: 'Asia/Shanghai' },
  '6325': { name: '海南藏族自治州', longitude: 100.6196, latitude: 36.2804, timezone: 'Asia/Shanghai' },
  '6326': { name: '果洛藏族自治州', longitude: 100.2423, latitude: 34.4736, timezone: 'Asia/Shanghai' },
  '6327': { name: '玉树藏族自治州', longitude: 97.0085, latitude: 33.0041, timezone: 'Asia/Shanghai' },
  '6328': { name: '海西蒙古族藏族自治州', longitude: 97.3708, latitude: 37.3747, timezone: 'Asia/Shanghai' },
  
  // 宁夏回族自治区
  '6401': { name: '银川市', longitude: 106.2309, latitude: 38.4872, timezone: 'Asia/Shanghai' },
  '6402': { name: '石嘴山市', longitude: 106.3586, latitude: 39.0133, timezone: 'Asia/Shanghai' },
  '6403': { name: '吴忠市', longitude: 106.1993, latitude: 37.9862, timezone: 'Asia/Shanghai' },
  '6404': { name: '固原市', longitude: 106.2853, latitude: 36.0046, timezone: 'Asia/Shanghai' },
  '6405': { name: '中卫市', longitude: 105.1896, latitude: 37.5149, timezone: 'Asia/Shanghai' },
  
  // 新疆维吾尔自治区
  '6501': { name: '乌鲁木齐市', longitude: 87.6177, latitude: 43.7928, timezone: 'Asia/Urumqi' },
  '6502': { name: '克拉玛依市', longitude: 84.8739, latitude: 45.5954, timezone: 'Asia/Urumqi' },
  '6504': { name: '吐鲁番市', longitude: 89.1841, latitude: 42.9476, timezone: 'Asia/Urumqi' },
  '6505': { name: '哈密市', longitude: 93.5132, latitude: 42.8335, timezone: 'Asia/Urumqi' },
  '6523': { name: '昌吉回族自治州', longitude: 87.3068, latitude: 44.0146, timezone: 'Asia/Urumqi' },
  '6527': { name: '博尔塔拉蒙古自治州', longitude: 82.0748, latitude: 44.9058, timezone: 'Asia/Urumqi' },
  '6528': { name: '巴音郭楞蒙古自治州', longitude: 86.1504, latitude: 41.7686, timezone: 'Asia/Urumqi' },
  '6529': { name: '阿克苏地区', longitude: 80.2651, latitude: 41.1717, timezone: 'Asia/Urumqi' },
  '6530': { name: '克孜勒苏柯尔克孜自治州', longitude: 76.1728, latitude: 39.7134, timezone: 'Asia/Urumqi' },
  '6531': { name: '喀什地区', longitude: 75.9893, latitude: 39.4677, timezone: 'Asia/Urumqi' },
  '6532': { name: '和田地区', longitude: 79.9253, latitude: 37.1106, timezone: 'Asia/Urumqi' },
  '6540': { name: '伊犁哈萨克自治州', longitude: 81.3179, latitude: 43.9219, timezone: 'Asia/Urumqi' },
  '6542': { name: '塔城地区', longitude: 82.9857, latitude: 46.7463, timezone: 'Asia/Urumqi' },
  '6543': { name: '阿勒泰地区', longitude: 88.1396, latitude: 47.8484, timezone: 'Asia/Urumqi' },
  '6590': { name: '石河子市', longitude: 86.0411, latitude: 44.3059, timezone: 'Asia/Urumqi' },
  '6591': { name: '阿拉尔市', longitude: 81.2769, latitude: 40.5417, timezone: 'Asia/Urumqi' },
  '6592': { name: '图木舒克市', longitude: 79.0747, latitude: 39.8673, timezone: 'Asia/Urumqi' },
  '6593': { name: '五家渠市', longitude: 87.5269, latitude: 44.1674, timezone: 'Asia/Urumqi' },
  '6594': { name: '北屯市', longitude: 87.8242, latitude: 47.3531, timezone: 'Asia/Urumqi' },
  '6595': { name: '铁门关市', longitude: 85.6729, latitude: 41.8274, timezone: 'Asia/Urumqi' },
  '6596': { name: '双河市', longitude: 82.3537, latitude: 44.8404, timezone: 'Asia/Urumqi' },
  '6597': { name: '可克达拉市', longitude: 80.6294, latitude: 43.6832, timezone: 'Asia/Urumqi' },
  '6598': { name: '昆玉市', longitude: 79.2342, latitude: 37.2075, timezone: 'Asia/Urumqi' },
  '6599': { name: '胡杨河市', longitude: 84.8275, latitude: 44.6979, timezone: 'Asia/Urumqi' },
  
  // 香港特别行政区
  '8100': { name: '香港特别行政区', longitude: 114.1694, latitude: 22.3193, timezone: 'Asia/Hong_Kong' },
  
  // 澳门特别行政区
  '8200': { name: '澳门特别行政区', longitude: 113.5491, latitude: 22.1987, timezone: 'Asia/Macau' },
  
  // 台湾省
  '7100': { name: '台湾省', longitude: 121.5654, latitude: 25.0330, timezone: 'Asia/Taipei' }
};

// 根据城市代码获取经纬度信息
export function getCityCoordinate(cityCode: string): CityCoordinate | null {
  return cityCoordinates[cityCode] || null;
}

// 根据城市名称搜索城市
export function searchCityByName(name: string): Array<{ code: string; coordinate: CityCoordinate }> {
  const results: Array<{ code: string; coordinate: CityCoordinate }> = [];
  
  for (const [code, coordinate] of Object.entries(cityCoordinates)) {
    if (coordinate.name.includes(name)) {
      results.push({ code, coordinate });
    }
  }
  
  return results;
}