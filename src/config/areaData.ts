// 区域数据配置文件
// 用于统一管理应用中使用的地区数据

export interface StreetData {
  name: string
}

export interface DistrictData {
  name: string
  streets: string[]
}

export interface CityData {
  name: string
  districts: DistrictData[]
}

// 城市区域数据
export const cityAreaData: CityData[] = [
  {
    name: '广州市',
    districts: [
      {
        name: '天河区',
        streets: [
          '天河街道',
          '冼村街道',
          '猎德街道',
          '员村街道',
          '石牌街道',
          '天河南街道',
          '林和街道',
          '沙河街道',
          '五山街道',
          '棠下街道',
        ],
      },
      {
        name: '海珠区',
        streets: [
          '江南街道',
          '海幢街道',
          '南华街道',
          '龙凤街道',
          '沙园街道',
          '瑞宝街道',
          '昌岗街道',
          '素社街道',
          '滨江街道',
          '江南中街道',
        ],
      },
      {
        name: '越秀区',
        streets: [
          '北京街道',
          '人民街道',
          '光塔街道',
          '六榕街道',
          '流花街道',
          '东风街道',
          '洪桥街道',
          '广卫街道',
          '大东街道',
          '农林街道',
        ],
      },
    ],
  },
  {
    name: '深圳市',
    districts: [
      {
        name: '福田区',
        streets: [
          '福田街道',
          '华强北街道',
          '南园街道',
          '沙头街道',
          '梅林街道',
          '莲花街道',
          '香蜜湖街道',
          '福保街道',
          '华富街道',
          '园岭街道',
        ],
      },
      {
        name: '南山区',
        streets: [
          '南头街道',
          '南山街道',
          '沙河街道',
          '蛇口街道',
          '招商街道',
          '粤海街道',
          '桃源街道',
          '西丽街道',
          '前海街道',
          '后海街道',
        ],
      },
      {
        name: '罗湖区',
        streets: [
          '桂园街道',
          '黄贝街道',
          '东门街道',
          '翠竹街道',
          '南湖街道',
          '笋岗街道',
          '东湖街道',
          '莲塘街道',
          '东晓街道',
          '清水河街道',
        ],
      },
    ],
  },
  {
    name: '佛山市',
    districts: [
      {
        name: '禅城区',
        streets: ['祖庙街道', '石湾街道', '张槎街道', '南庄街道', '石湾镇街道'],
      },
      {
        name: '南海区',
        streets: ['桂城街道', '大沥街道', '里水街道', '狮山街道', '丹灶街道'],
      },
      {
        name: '顺德区',
        streets: ['大良街道', '容桂街道', '伦教街道', '勒流街道', '陈村街道'],
      },
    ],
  },
]

// 简化的城市列表（用于只需要城市名称的场景）
export const simpleCityList = cityAreaData.map((city) => city.name)
