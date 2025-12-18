// ========== 页面切换功能（修复快速链接） ==========
document.addEventListener('DOMContentLoaded', function() {
  const navLinks = document.querySelectorAll('.nav-link');
  const sectionButtons = document.querySelectorAll('[data-section]');
  const sections = document.querySelectorAll('.section');
  const internalLinks = document.querySelectorAll('a[href^="#"]');

  // 切换板块函数
  function switchSection(sectionId) {
    // 更新导航激活状态
    navLinks.forEach(link => {
      if (link.getAttribute('data-section') === sectionId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // 更新板块显示
    sections.forEach(section => {
      if (section.id === sectionId) {
        section.classList.add('active');
        // 平滑滚动到顶部
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      } else {
        section.classList.remove('active');
      }
    });
  }

  // 导航链接点击事件
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const sectionId = this.getAttribute('data-section');
      switchSection(sectionId);
    });
  });

  // 所有带data-section属性的按钮点击事件
  sectionButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      if (this.tagName === 'A' && !this.hasAttribute('target')) {
        e.preventDefault();
      }
      const sectionId = this.getAttribute('data-section');
      if (sectionId) {
        switchSection(sectionId);
        
        // 如果是锚点链接，滚动到指定位置
        const href = this.getAttribute('href');
        if (href && href.includes('#') && href !== '#') {
          setTimeout(() => {
            const target = document.querySelector(href);
            if (target) {
              target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
              });
            }
          }, 300);
        }
      }
    });
  });

  // 内部锚点链接处理
  internalLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      // 只处理本页面的锚点链接
      if (href === '#' || href.startsWith('#/') || this.hasAttribute('target')) {
        return;
      }
      
      e.preventDefault();
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        // 检查目标元素是否在about板块
        const aboutSection = document.getElementById('about');
        if (targetElement.closest('#about') && !aboutSection.classList.contains('active')) {
          // 如果不在当前板块，先切换到about板块
          switchSection('about');
          
          // 延迟滚动到目标位置
          setTimeout(() => {
            targetElement.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }, 300);
        } else {
          // 直接滚动到目标位置
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });

  // 图片画廊切换功能
  const thumbnails = document.querySelectorAll('.thumbnail');
  
  thumbnails.forEach(thumbnail => {
    thumbnail.addEventListener('click', function() {
      const parentGallery = this.closest('.about-image-gallery');
      const mainImage = parentGallery.querySelector('.main-image');
      const originalSrc = mainImage.src;
      const originalAlt = mainImage.alt;
      const thumbnailSrc = this.src;
      const thumbnailAlt = this.alt;
      
      // 切换图片和alt属性
      mainImage.style.opacity = '0';
      setTimeout(() => {
        mainImage.src = thumbnailSrc;
        mainImage.alt = thumbnailAlt;
        this.src = originalSrc;
        this.alt = originalAlt;
        mainImage.style.opacity = '1';
      }, 150);
    });
  });

  // ========== 原有地图功能（保持完整） ==========
  // ========== 1. 建筑数据（含image字段） ==========
  const HOTSPOT_DATA = [
    {
      id: 1,
      title: "1 号建筑（学生宿舍）",
      description: "南开大学1号学生宿舍，建于1980年代，经过多次翻新改造。宿舍为6层砖混结构，共30间宿舍，可容纳120名学生居住。每间宿舍配备上床下桌、衣柜、空调等基本设施，每层设有公共卫生间、洗衣房和自习室。宿舍楼下设有自行车停放区和快递收发点，交通便利，距离食堂和教学楼仅5分钟步行路程。",
      left: 7.9,
      top: 48.8,
      width: 4,
      height: 5,
      image: "assets/dorm1.jpg"
    },
    {
      id: 2,
      title: "2 号建筑（第二教学楼）",
      description: "第二教学楼是南开大学主要的公共教学楼之一，建成于2005年。建筑共8层，设有大小教室40余间，其中多媒体教室30间，阶梯教室6间，最大教室可容纳300人。教学楼配备中央空调、投影仪、音响等现代化教学设备，是本科生和研究生日常上课的主要场所。楼内设有自习区、饮水间和卫生间，为师生提供便利的教学环境。",
      left: 11.4,
      top: 45.6,
      width: 3.6,
      height: 3.6
    },
    {
      id: 3,
      title: "3 号建筑（计算机学院）",
      description: "计算机学院楼建于2010年，是南开大学计算机科学与技术学院的教学和科研基地。建筑共10层，建筑面积12000平方米。楼内设有专业实验室15个，包括人工智能实验室、网络安全实验室、大数据实验室等，配备先进的实验设备和计算机集群。此外，还设有教师办公室、研究生工作室、学术报告厅等设施，为师生提供良好的教学科研环境。",
      left: 14,
      top: 43,
      width: 4,
      height: 3
    },
    {
      id: 4,
      title: "4 号建筑（图书馆）",
      description: "南开大学图书馆始建于1919年，现馆舍建于2002年，建筑面积3.5万平方米。图书馆馆藏丰富，拥有纸质图书400余万册，电子图书300余万种，中外文数据库100余个。馆内设有阅览区、自习区、研讨室、电子阅览室等功能区域，共提供2000余个阅览座位。图书馆实行全开架借阅制度，每周开放98小时，为师生提供全方位的文献信息服务。",
      left: 15,
      top: 39.1,
      width: 3,
      height: 3,
      image: "https://picsum.photos/id/24/800/500"
    },
    {
      id: 5,
      title: "5 号建筑（主楼）",
      description: "主楼是南开大学的标志性建筑，建成于1954年，2010年进行了整体修缮。建筑风格为典型的苏式建筑，庄重典雅，气势恢宏。主楼共12层，高54米，是南开大学最高的建筑之一。楼内设有学校行政办公室、各学院办公室、会议室、学术报告厅等设施，是学校行政管理和学术交流的中心。主楼前的广场是学校举办重大活动和庆典的场所，也是师生休闲散步的好去处。",
      left: 12.2,
      top: 50,
      width: 4,
      height: 5.5,
      image: "assets/main-building.jpg"
    },
    {
      id: 6,
      title: "6 号建筑（化学学院）",
      description: "化学学院楼是南开大学化学学科的教学和科研基地，建成于2008年。建筑共9层，建筑面积15000平方米，设有专业实验室20个，包括有机化学实验室、无机化学实验室、分析化学实验室、物理化学实验室等。实验室配备先进的分析测试设备，如核磁共振仪、质谱仪、色谱仪等，为科研工作提供了有力支持。此外，楼内还设有教学教室、研究生工作室、教师办公室等设施。",
      left: 12.2,
      top: 10,
      width: 4,
      height: 5.5
    },
    {
      id: 7,
      title: "7 号建筑（生命科学学院）",
      description: "生命科学学院楼建于2012年，建筑面积18000平方米，是南开大学规模较大的学院楼之一。楼内设有生物化学实验室、分子生物学实验室、细胞生物学实验室、遗传学实验室等25个专业实验室，配备先进的实验设备和生物安全设施。学院楼还设有大型仪器共享平台，为全校师生提供实验技术服务。此外，楼内还有多媒体教室、学术报告厅、图书馆分馆等配套设施。",
      left: 12.2,
      top: 60,
      width: 4,
      height: 5.5
    },
    {
      id: 8,
      title: "8 号建筑（文学院）",
      description: "文学院楼是南开大学文学院的教学和办公场所，建于1995年，2018年进行了内部装修。建筑共6层，建筑面积8000平方米。楼内设有中文系、历史系、哲学系等多个系所的办公室，以及专业教室、研讨室、资料室等设施。文学院资料室藏书丰富，拥有各类图书资料10万余册，为师生提供良好的学习研究条件。楼内环境优雅，文化氛围浓厚，是文科师生学习交流的理想场所。",
      left: 12.2,
      top: 30,
      width: 4,
      height: 5.5
    },
    {
      id: 9,
      title: "9 号建筑（第一食堂）",
      description: "第一食堂是南开大学历史最悠久的食堂之一，建于1950年代，经过多次翻新改造。食堂共2层，建筑面积3000平方米，可同时容纳1000人就餐。一层提供早餐和大众快餐，包括包子、油条、豆浆、米饭、炒菜等家常食品；二层设有特色窗口，提供各地风味美食，如面条、水饺、麻辣烫、盖浇饭等。食堂食材新鲜，价格实惠，卫生条件良好，是师生就餐的主要选择之一。",
      left: 16.5,
      top: 48.5,
      width: 3.5,
      height: 4.0
    },
    {
      id: 10,
      title: "10 号建筑（体育馆）",
      description: "南开大学体育馆建成于2000年，建筑面积12000平方米，是一座综合性体育馆。馆内设有篮球场、羽毛球场、乒乓球场、健身房等多个运动场地，可容纳3000名观众。体育馆配备先进的照明、音响和计分系统，是学校举办体育比赛、文艺演出、大型会议等活动的重要场所。此外，体育馆还面向师生开放，提供体育教学、训练和休闲健身服务，是师生锻炼身体的好去处。",
      left: 19.8,
      top: 46.2,
      width: 3.8,
      height: 4.2
    },
    {
      id: 11,
      title: "11 号建筑（校医院）",
      description: "南开大学校医院是一所综合性医院，建于1985年，2015年进行了扩建和装修。医院建筑面积5000平方米，设有内科、外科、妇产科、儿科、急诊科、口腔科、眼科、耳鼻喉科等多个科室，配备先进的医疗设备，如B超机、心电图机、血常规分析仪等。校医院为师生提供日常医疗、健康体检、预防保健等服务，同时与天津市多家三甲医院建立了合作关系，为师生提供转诊服务。医院环境整洁，服务周到，是师生健康的保障。",
      left: 22.5,
      top: 44.0,
      width: 4.0,
      height: 4.5
    },
    {
      id: 12,
      title: "12 号建筑（学生活动中心）",
      description: "学生活动中心建成于2010年，建筑面积8000平方米，是南开大学学生开展课外活动的主要场所。中心内设有多功能厅、会议室、排练室、社团活动室等多个功能区域，可容纳2000人同时开展活动。学生活动中心是学校各类学生组织、社团开展活动的重要平台，每年举办“南开之春”文化艺术节、“挑战杯”竞赛、校园歌手大赛等各类活动数百场，丰富了学生的课余生活，促进了学生综合素质的提升。",
      left: 25.0,
      top: 41.8,
      width: 4.2,
      height: 4.6
    },
    {
      id: 13,
      title: "13 号建筑（商学院）",
      description: "商学院楼建于2006年，建筑面积16000平方米，是南开大学商学院的教学和科研基地。楼内设有管理科学与工程系、市场营销系、财务系、会计系等多个系所，以及专业教室、实验室、研讨室、教师办公室等设施。商学院拥有先进的案例教学实验室、金融实验室、电子商务实验室等，为教学和科研提供了良好的条件。此外，楼内还设有国际交流中心，为师生开展国际合作与交流提供服务。",
      left: 27.8,
      top: 39.5,
      width: 4.2,
      height: 4.8
    },
    {
      id: 14,
      title: "14 号建筑（外国语学院）",
      description: "外国语学院楼建于2003年，建筑面积10000平方米。楼内设有英语系、日语系、德语系、法语系等多个系所，以及语言实验室、多媒体教室、语音室、资料室等设施。语言实验室配备先进的语言学习设备，可同时容纳300名学生进行语言学习和训练。资料室收藏了大量的外文图书、期刊和音像资料，为师生提供良好的学习研究条件。学院楼内环境优雅，国际化氛围浓厚，是外语教学和研究的理想场所。",
      left: 30.5,
      top: 37.2,
      width: 4.5,
      height: 5.0
    },
    {
      id: 15,
      title: "15 号建筑（法学院）",
      description: "法学院楼建于2011年，建筑面积12000平方米。楼内设有法学系、政治学系、社会学系等多个系所，以及模拟法庭、法律诊所、专业教室、研讨室等设施。模拟法庭按照真实法庭的标准建设，配备先进的音响、灯光和录像设备，为学生提供了实践教学的良好平台。法律诊所为社会提供免费的法律咨询服务，同时也为学生提供了实践锻炼的机会。学院楼还设有图书资料室，收藏了大量的法律图书和期刊资料。",
      left: 33.5,
      top: 35.0,
      width: 4.8,
      height: 5.2
    },
    {
      id: 16,
      title: "16 号建筑（经济学院）",
      description: "经济学院楼是南开大学经济学科的教学和科研基地，建于2009年，建筑面积20000平方米。楼内设有经济学系、国际经济与贸易系、财政系、金融系等多个系所，以及专业实验室、研讨室、教师办公室、研究生工作室等设施。经济学院拥有先进的金融实验室、国际贸易实验室等，配备专业的实验软件和数据资源，为教学和科研提供了有力支持。此外，楼内还设有学术报告厅和国际会议中心，经常举办各类学术会议和讲座。",
      left: 36.5,
      top: 33.0,
      width: 5.0,
      height: 5.4
    },
    {
      id: 17,
      title: "17 号建筑（环境科学与工程学院）",
      description: "环境科学与工程学院楼建于2013年，建筑面积14000平方米。楼内设有环境科学系、环境工程系、市政工程系等多个系所，以及专业实验室、分析测试中心、研讨室等设施。实验室配备先进的环境监测设备和分析仪器，如气相色谱仪、液相色谱仪、原子吸收分光光度计等，为科研工作提供了良好的条件。学院楼还设有环境模拟实验室，可模拟各种环境条件，开展相关研究工作。",
      left: 39.5,
      top: 31.0,
      width: 5.0,
      height: 5.6
    },
    {
      id: 18,
      title: "18 号建筑（材料科学与工程学院）",
      description: "材料科学与工程学院楼建于2015年，建筑面积18000平方米，是南开大学新建的现代化学院楼之一。楼内设有材料物理系、材料化学系、高分子材料系等多个系所，以及专业实验室、表征中心、加工实验室等设施。实验室配备先进的材料表征设备，如扫描电子显微镜、透射电子显微镜、X射线衍射仪等，为材料科学的研究提供了有力支持。学院楼还设有中试基地，为科研成果的转化提供了平台。",
      left: 42.5,
      top: 29.0,
      width: 5.2,
      height: 5.8
    },
    {
      id: 73,
      title: "学生宿舍",
      description: "这是津南校区 “大通学生社区” 下的集中式宿舍集群，共 3 栋楼，每栋 6-8 层，采用 “庭院围合式” 布局，楼间设休闲步道与绿植景观。内部配置：宿舍为 4 人间（部分研究生为 2 人间），上床下桌设计，配备空调、独立卫浴、24 小时热水，每间宿舍带宽网接口；每层设公共自习室（配插座、台灯）、洗衣房（含洗衣机、烘干机）、饮水间；楼栋 1 层设宿管站（提供报修、失物招领）、快递柜、自动售货机。服务场景：不仅是住宿空间，也是班级 “宿舍文化节”“夜间卧谈会” 的场所，部分宿舍区还试点 “书院制”，引入导师驻楼、社区活动等功能。",
      left: 60.7,
      top: 26.0,
      width: 6.2,
      height: 3,
      image: "assets/宿舍.jpg"
    },
    {
      id: 74,
      title: "学生宿舍",
      description: "这是津南校区 “大通学生社区” 下的集中式宿舍集群，共 3 栋楼，每栋 6-8 层，采用 “庭院围合式” 布局，楼间设休闲步道与绿植景观。内部配置：宿舍为 4 人间（部分研究生为 2 人间），上床下桌设计，配备空调、独立卫浴、24 小时热水，每间宿舍带宽网接口；每层设公共自习室（配插座、台灯）、洗衣房（含洗衣机、烘干机）、饮水间；楼栋 1 层设宿管站（提供报修、失物招领）、快递柜、自动售货机。服务场景：不仅是住宿空间，也是班级 “宿舍文化节”“夜间卧谈会” 的场所，部分宿舍区还试点 “书院制”，引入导师驻楼、社区活动等功能。",
      left: 67.7,
      top: 26,
      width: 2.9,
      height: 3.2,
      image: "assets/宿舍.jpg"
    },
    {
      id: 75,
      title: "学生宿舍",
      description: "这是津南校区 “大通学生社区” 下的集中式宿舍集群，共 3 栋楼，采用 “庭院围合式” 布局，楼间设休闲步道与绿植景观。内部配置：宿舍为 4 人间（部分研究生为 2 人间），上床下桌设计，配备空调、独立卫浴、24 小时热水，每间宿舍带宽网接口；每层设公共自习室（配插座、台灯）、洗衣房（含洗衣机、烘干机）、饮水间；楼栋 1 层设宿管站（提供报修、失物招领）、快递柜、自动售货机。服务场景：不仅是住宿空间，也是班级 “宿舍文化节”“夜间卧谈会” 的场所，部分宿舍区还试点 “书院制”，引入导师驻楼、社区活动等功能。",
      left: 64.7,
      top: 29.0,
      width: 2.9,
      height: 2.6,
      image: "assets/宿舍.jpg"
    },
    {
      id: 76,
      title: "学生三食堂",
      description: "位于宿舍区核心位置，共 2 层，建筑面积约 2000㎡。一层：主打 “快餐线”，设 8 个窗口供应家常菜（如宫保鸡丁、清炒时蔬）、套餐饭（一荤两素约 10 元），早餐提供包子、油条、豆浆等（6:30-8:30 开放）；二层：设特色档口，包含清真窗口（提供兰州拉面、新疆大盘鸡）、面食档口（刀削面、重庆小面）、麻辣烫专区，同时配备 200 个座位的休闲区（可充电）。运营细节：支持校园卡、微信 / 支付宝支付，每日 17:00-19:00 为就餐高峰，收集师生反馈调整菜品。",
      left: 60.7,
      top: 29.0,
      width: 3.4,
      height: 2.8,
      image: "assets/三食堂.jpg"
    },
    {
      id: 77,
      title: "学院组团（环境科学与工程学院/医学院）",
      description: "该组团包含 “环境科学与工程学院”“医学院” 2 个学院，建筑为连廊式 3 栋楼（A/B/C 座）。功能分区：A 座为教师办公室（每间 2-3 人）、学院会议室（设 2 个大会议室、4 个小研讨室）；B 座为专业教室（含环境监测实验室、医学基础实验室），实验室配备气相色谱仪、显微镜等设备，可同时容纳 80 名学生做实验；C 座为 “跨学科交流中心”，设开放工位、路演厅，用于两个学院的联合课题研讨。特色：组团内设 “学院文化墙”，展示学科历史、优秀校友事迹。",
      left: 60.0,
      top: 32.0,
      width: 7.8,
      height: 6.2,
      image: "assets/学院楼.jpg"
    },
    {
      id: 78,
      title: "篮球场",
      description: "位于体育馆南侧，共 6 块标准露天篮球场，塑胶地面（厚度 8mm，防滑耐磨），每块场地配 2 个成人篮球架（可调节高度）。使用规则：每日 6:00-22:00 开放，免费使用；课程教学时段（如周一至周五 14:00-16:00）优先供体育课使用，其余时段对师生开放；支持 “场地预约”（通过校园 APP），用于社团比赛、班级联赛；场地旁设休息长椅、饮水站，配备应急医药箱（由体育部管理）。活动：每年举办 “南开杯” 篮球联赛，该场地为主要比赛场地之一。",
      left: 68.0,
      top: 29.0,
      width: 2.9,
      height: 2.8,
      image: "assets/篮球场.jpg"
    },
    {
      id: 79,
      title: "网球场",
      description: "位于篮球场东侧，共 4 块标准硬地网球场，每块场地围网高 4m，配备 LED 照明灯（夜间开放至 21:00）。使用细节：需通过 “南开体育” 公众号预约，每小时收费 10 元（学生半价）；场地提供免费网球拍租赁（需押学生证）；设 “网球教学区”，每周六 9:00-11:00 有校网球队成员开展免费教学；场地旁设储物箱，可存放个人物品。赛事：每年承办 “天津市高校网球邀请赛”，该场地为指定比赛场地。",
      left: 74.7,
      top: 59.2,
      width: 3.4,
      height: 1.8,
      image: "assets/网球场.jpg"
    },
    {
      id: 80,
      title: "篮球场",
      description: "与 78 号篮球场为同批次建设，共 4 块场地，功能、规则与 78 号一致，作为补充场地缓解高峰时段（如周末）的使用压力。特色：场地旁设 “篮球文化涂鸦墙”，由学生社团创作，展示篮球明星、赛事标语等内容，是校园内的 “网红打卡点” 之一。",
      left: 73.7,
      top: 55.0,
      width: 3.9,
      height: 3.8,
      image: "assets/篮球场.jpg"
    },
    {
      id: 81,
      title: "排球场",
      description: "是标准排球运动场地，配备排球网与防滑地面，用于排球课程、校排球队训练，以及学生社团的排球活动，是排球专项运动的专属场地。场地尺寸为 18m×9m，符合国际比赛标准，地面采用专业排球场地塑胶，弹性适中，有效保护运动员膝盖和脚踝。场地周围设有观众席，可容纳 200 人观看比赛。",
      left: 72.9,
      top: 52.0,
      width: 3.9,
      height: 3.2,
      image: "assets/排球场.jpg"
    },
    {
      id: 82,
      title: "练习场",
      description: "是多功能体育练习场地，主要用于武术、健美操、太极等体育课程的教学，也可作为学生自主练习的空间，地面多为防滑软垫材质，配备简易器材架（如体操垫、武术器械）。场地划分为多个区域，可同时开展多项体育活动。练习场周边种植了大量绿植，环境优美，空气清新，是师生进行体育锻炼和放松身心的理想场所。",
      left: 77.0,
      top: 51.8,
      width: 5.2,
      height: 9.0,
      image: "assets/练习场.jpg"
    },
    {
      id: 83,
      title: "科技馆",
      description: "是校园内的科普、实验展示类建筑，通常包含学科实验室展示区、科普互动设施、小型学术报告厅，用于举办科普活动、实验室开放日，以及学生科创项目的展示交流，兼具科普教育与学术交流功能。科技馆建筑面积 8000 平方米，共 4 层，一层为科普展厅，二层为互动体验区，三层为实验室展示区，四层为学术报告厅。馆内展品丰富，包括机器人、3D 打印机、天文望远镜等先进设备，是师生开展科普教育和科技创新的重要平台。",
      left: 70.5,
      top: 41.1,
      width: 5.5,
      height: 9.3,
      image: "assets/科技馆.jpg"
    },
    {
      id: 84,
      title: "教师活动中心",
      description: "是面向教职工的综合服务场所，内设休闲区（咖啡、茶座）、会议室、健身室等，用于教职工的日常休闲、工会活动、学术沙龙，是教职工交流、放松的专属空间。活动中心建筑面积 5000 平方米，环境优雅，设施齐全。休闲区提供咖啡、茶点和报刊杂志，是教职工休息交流的好去处；会议室配备先进的音响、投影设备，可满足不同规模的会议需求；健身室配备跑步机、哑铃、瑜伽垫等健身器材，为教职工提供锻炼身体的场所。",
      left: 68.3,
      top: 32.0,
      width: 5.2,
      height: 9.0,
      image: "assets/教师活动中心.jpg"
    },
    {
      id: 85,
      title: "宿舍楼",
      description: "属于补充性学生宿舍，主要用于缓解住宿压力，建筑布局、内部设施与其他学生宿舍标准统一，服务周边教学区域的学生。宿舍为 6 层建筑，共 40 间宿舍，可容纳 160 名学生居住。每间宿舍配备上床下桌、衣柜、空调、独立卫浴等设施，楼内设有公共洗衣房、自习室、饮水间等配套服务设施。宿舍楼管理规范，24 小时有宿管人员值班，为学生提供安全、舒适的住宿环境。",
      left: 81.3,
      top: 44.0,
      width: 6.9,
      height: 8.8,
      image: "assets/宿舍.jpg"
    },
    {
      id: 86,
      title: "学生五食堂",
      description: "是津南校区的特色餐饮配套之一，通常在基础大众餐之外，增设风味档口（如地方小吃、快餐），部分时段提供夜宵，满足师生多样化的餐饮需求，同时配备休闲用餐区，支持移动支付。食堂共 3 层，建筑面积 3000 平方米，可同时容纳 1500 人就餐。一层为大众餐厅，提供家常菜和套餐；二层为特色餐厅，设有各地风味档口；三层为休闲餐厅，提供咖啡、甜点和简餐，环境优雅，是师生聚餐和交流的好去处。",
      left: 76.8,
      top: 44.0,
      width: 4.9,
      height: 6.8,
      image: "assets/五食堂.jpg"
    },
    {
      id: 87,
      title: "学院楼",
      description: "是单个学院的独立办公、教学建筑，包含学院办公室、专业教室、学院专属实验室，便于学院内部的教学管理与学科建设，也是学院举办院级活动、师生交流的主要场地。楼内配备先进的教学设备和科研仪器，为学院的教学和科研工作提供了良好的条件。学院楼还设有学术报告厅和会议室，用于举办各类学术活动和会议。",
      left: 76.7,
      top: 40.0,
      width: 6.9,
      height: 4.3,
      image: "assets/学院楼.jpg"
    },
    {
      id: 88,
      title: "东校门",
      description: "是津南校区的东侧出入口，配备门禁系统（校园卡 / 人脸识别），设有门卫室、访客登记处，是校外人员、车辆入校的主要通道之一，同时承担校园安防值守功能。校门宽 20 米，高 8 米，设计风格简洁大气，体现了南开大学的文化底蕴。门卫室 24 小时有人值班，负责校园的安全保卫工作。访客需在登记处进行身份登记，方可进入校园。校门周边设有公交站点和停车场，交通便利。",
      left: 83.7,
      top: 38.5,
      width: 2.9,
      height: 2.8,
      image: "assets/东校门.jpg"
    },
    {
      id: 89,
      title: "生活组团",
      description: "是校园内的生活服务综合体，包含超市（日用品、零食）、打印店、理发店、快递驿站等设施，相当于 “校园微型商圈”，满足师生日常购物、生活琐事处理的需求。生活组团建筑面积 6000 平方米，共 3 层，一层为超市和快递驿站，二层为打印店、理发店和水果店，三层为眼镜店和文具店。组团内设施齐全，商品种类丰富，价格合理，为师生提供了便捷的生活服务。此外，组团内还设有休息区和饮水设施，方便师生购物后休息。",
      left: 73.7,
      top: 30.0,
      width: 7.9,
      height: 10.1,
      image: "assets/生活组团.jpg"
    }
    {
    id: 73,
    title: "学生宿舍",
    description: `
<p>这是津南校区“大通学生社区”下的集中式宿舍集群，由3栋楼组成，采用“庭院围合式”布局，楼间点缀休闲步道与绿植景观，为师生营造舒适静谧的居住环境。宿舍以4人间为主（部分研究生为2人间），均采用上床下桌设计，配备空调、独立卫浴及24小时热水，每间宿舍均接入宽带接口，满足日常居住与学习需求。</p>
<p>配套设施完善，每层设有公共自习室（配插座、台灯）、洗衣房（含洗衣机、烘干机）与饮水间；楼栋1层设宿管站（提供报修、失物招领服务）、快递柜及自动售货机。这里不仅是住宿空间，更是班级“宿舍文化节”“夜间卧谈会”的举办场所，部分宿舍区试点“书院制”，引入导师驻楼、社区活动等功能，丰富居住体验与学术交流氛围。</p>
<img src="assets/宿舍.jpg" alt="学生宿舍">
`,
    left: 60.7,
    top: 26.0,
    width: 6.2,
    height: 3,
    image: "assets/宿舍.jpg"
  },
  {
    id: 74,
    title: "学生宿舍",
    description: `
<p>作为津南校区“大通学生社区”的重要组成部分，该宿舍集群与周边3栋宿舍楼形成围合布局，楼间休闲步道串联绿植景观，打造出兼具私密性与互动性的居住空间。宿舍为4人间标准配置（部分研究生为2人间），上床下桌的设计最大化利用空间，空调、独立卫浴、24小时热水及宽带接口一应俱全，保障舒适便捷的居住条件。</p>
<p>生活服务设施覆盖全面，每层均设有公共自习室、洗衣房与饮水间，满足日常学习与生活需求；楼栋1层的宿管站提供报修、失物招领等贴心服务，快递柜与自动售货机进一步提升生活便利性。同时，这里也是校园文化活动的重要载体，“宿舍文化节”“夜间卧谈会”等活动在此开展，部分区域试点的“书院制”更引入导师驻楼与社区活动，促进师生交流与社区共建。</p>
<img src="assets/宿舍.jpg" alt="学生宿舍">
`,
    left: 67.7,
    top: 26,
    width: 2.9,
    height: 3.2,
    image: "assets/宿舍.jpg"
  },
  {
    id: 75,
    title: "学生宿舍",
    description: `
<p>隶属于津南校区“大通学生社区”，该宿舍集群与另外2栋宿舍楼共同构成“庭院围合式”布局，楼间休闲步道与绿植景观相映成趣，为学生提供舒适的居住与交流环境。宿舍采用4人间（部分研究生为2人间）上床下桌设计，配备空调、独立卫浴、24小时热水及宽带接口，充分满足学习与生活双重需求。</p>
<p>每层设置的公共自习室（配插座、台灯）为学生提供便捷学习空间，洗衣房（含洗衣机、烘干机）与饮水间保障日常生活所需；楼栋1层的宿管站、快递柜、自动售货机形成完善的便民服务体系。此外，这里还是班级文化建设的重要阵地，“宿舍文化节”“夜间卧谈会”等活动常态化开展，部分区域试点的“书院制”引入导师驻楼与社区活动，让宿舍成为兼具居住、交流与成长功能的复合型空间。</p>
<img src="assets/宿舍.jpg" alt="学生宿舍">
`,
    left: 64.7,
    top: 29.0,
    width: 2.9,
    height: 2.6,
    image: "assets/宿舍.jpg"
  },
  {
    id: 76,
    title: "学生三食堂",
    description: `
<p>位于宿舍区核心位置的学生三食堂，共2层，建筑面积约2000㎡，地理位置优越，是周边师生就餐的首选场所。一层主打“快餐线”，8个窗口供应宫保鸡丁、清炒时蔬等家常菜，以及一荤两素约10元的高性价比套餐饭，早餐时段（6:30-8:30）还提供包子、油条、豆浆等经典品类。</p>
<p>二层设有多元化特色档口，涵盖兰州拉面、新疆大盘鸡等清真美食，刀削面、重庆小面等风味面食，以及深受欢迎的麻辣烫专区，同时配备200个带充电功能的座位，满足休闲就餐需求。食堂支持校园卡、微信/支付宝多渠道支付，17:00-19:00就餐高峰会增开临时窗口，每月推出的“新菜试吃”活动更能根据师生反馈持续优化菜品。</p>
<img src="assets/三食堂.jpg" alt="学生三食堂">
`,
    left: 60.7,
    top: 29.0,
    width: 3.4,
    height: 2.8,
    image: "assets/三食堂.jpg"
  },
  {
    id: 77,
    title: "学院组团",
    description: `
<p>该学院组团涵盖“环境科学与工程学院”“医学院”两大院系，由连廊式A/B/C三座楼宇构成，实现教学、办公与科研的有机融合。A座主要分布教师办公室（每间2-3人）与学院会议室，其中包含2个大会议室与4个小研讨室，满足日常办公与学术研讨需求；B座为专业教学核心区域，设有环境监测实验室、医学基础实验室，配备气相色谱仪、显微镜等专业设备，可同时容纳80名学生开展实验教学。</p>
<p>C座定位为“跨学科交流中心”，设置开放工位与路演厅，为两个学院的联合课题研讨、学术交流提供专属空间。组团内精心打造“学院文化墙”，系统展示学科发展历史与优秀校友事迹，每月定期举办“学科开放日”活动，面向全校学生开展专业科普，助力学科文化传播与跨领域交流。</p>
<img src="assets/学院楼.jpg" alt="学院组团">
`,
    left: 60.0,
    top: 32.0,
    width: 7.8,
    height: 6.2,
    image: "assets/学院楼.jpg"
  },
  {
    id: 78,
    title: "篮球场 ",
    description: `
<p>此处为南开大学室外篮球场，位于校园核心运动区域，场地开阔、位置便利，是师生最受欢迎的运动场所之一。</p>
<p>设有多片标准塑胶球场，配备稳固球架、清晰场地标线及基础照明设施，适配不同规模的篮球活动。</p>
<p>核心用途包括篮球课程教学、班级联赛、学生篮球社团活动，课余时间更是师生日常锻炼、组队竞技的首选场地。</p>
<img src="assets/篮球场.jpg" alt="篮球场">
`,
    left: 68.0,
    top: 29.0,
    width: 2.9,
    height: 2.8,
    image: "assets/篮球场.jpg"
  },
  {
    id: 79,
    title: "网球场",
    description: `
<p>此处为南开大学室外网球场，紧邻校园运动区与生活区，位置便捷，是师生开展网球运动的核心场地。场地按国际标准铺设塑胶面层，配备专业球网、清晰边界标识及夜间照明设备，兼顾运动专业性与安全性，为师生提供优质的运动体验。</p>
<p>场地主要用于网球课程教学与校网球队日常训练，同时面向全体师生开放，满足课余休闲运动、朋友对打及小型友谊赛等多样化需求。作为校园体育文化的重要组成部分，这里不仅丰富了师生的体育选择，更助力培养健康向上的运动习惯与竞技精神。</p>
<img src="assets/网球场.jpg" alt="网球场">
`,
    left:75.0,
    top: 59.6,
    width: 3.4,
    height: 1.8,
    image: "assets/网球场.jpg"
  },
  {
    id: 80,
    title: "篮球场",
    description: `
<p>此处为南开大学室外篮球场，位于校园核心运动区域，场地开阔、位置便利，是师生最受欢迎的运动场所之一。设有多片标准塑胶球场，配备稳固球架、清晰场地标线及基础照明设施，适配不同规模的篮球活动。</p>
<p>核心用途包括篮球课程教学、班级联赛、学生篮球社团活动，课余时间更是师生日常锻炼、组队竞技的首选场地。作为校园体育文化的重要载体，场地见证了师生的活力与协作，是凝聚集体氛围、释放青春能量的关键空间。</p>
<img src="assets/篮球场.jpg" alt="篮球场">
`,
    left: 73.7,
    top: 55.0,
    width: 3.9,
    height: 3.8,
    image: "assets/篮球场.jpg"
  },
  {
    id: 81,
    title: "排球场",
    description: `
<p>此处为南开大学室外排球场，紧邻学生生活区与教学区，位置便捷，是校园核心体育活动场地之一，为师生提供常态化排球运动空间。场地设施规范，设有标准塑胶球场及齐全的球网、边界标识与照明设备，兼顾安全性与运动体验，可充分满足日常教学与活动需求。</p>
<p>作为校园体育设施的重要组成部分，排球场不仅为排球课程教学、班级活动及社团训练提供保障，更丰富了师生课余生活，助力营造崇尚运动、团结协作的校园体育文化氛围。</p>
<img src="assets/排球场.jpg" alt="排球场">
`,
    left: 72.9,
    top: 52.0,
    width: 3.9,
    height: 3.2,
    image: "assets/排球场.jpg"
  },
  {
    id: 82,
    title: "练习场",
    description: `
<p>这是校园内的多功能体育练习场地，专为武术、健美操、太极等体育课程教学设计，同时也向学生开放作为自主练习空间。场地地面采用防滑软垫材质，有效保障运动安全，配备简易器材架，整齐摆放体操垫、武术器械等训练用品，满足多样化运动需求。</p>
<p>作为体育教学与自主锻炼的双重阵地，练习场为师生提供了专业、安全的运动环境，既支撑了特色体育课程的开展，也为学生培养运动爱好、提升身体素质提供了便捷条件，丰富了校园体育文化场景。</p>
<img src="assets/练习场.jpg" alt="练习场">
`,
    left: 77.0,
    top: 51.8,
    width: 5.2,
    height: 9.0,
    image: "assets/练习场.jpg"
  },
  {
    id: 83,
    title: "科技馆",
    description: `
<p>作为校园内核心的科普与学术交流建筑，科技馆集学科实验室展示、科普互动体验、小型学术报告功能于一体，是连接教学与科普、科研与展示的重要平台。馆内设有多个学科实验室展示区，通过实物陈列、互动演示等形式，直观呈现前沿科研成果与实验原理。</p>
<p>同时配备科普互动设施与小型学术报告厅，常态化举办科普活动、实验室开放日，以及学生科创项目展示交流等活动。这里不仅是面向师生开展科普教育的重要阵地，也为学术思想碰撞、科创成果转化提供了优质空间，兼具科普教育与学术交流的双重价值。</p>
<img src="assets/科技馆.jpg" alt="科技馆">
`,
    left: 70.5,
    top: 41.1,
    width: 5.5,
    height: 9.3,
    image: "assets/科技馆.jpg"
  },
  {
    id: 84,
    title: "教师活动中心",
    description: `
<p>这是专为教职工打造的综合服务场所，内部功能分区清晰，设有休闲区（配备咖啡、茶座）、规格多样的会议室、设施齐全的健身室等，全方位满足教职工的日常休闲、工作交流与身心放松需求。整体环境温馨舒适，为教职工提供了远离办公压力的专属空间。</p>
<p>中心主要用于教职工工会活动、学术沙龙、工作研讨等各类场景，既是同事间交流感情、放松身心的休闲阵地，也是学术思想碰撞、工作经验分享的重要平台，为提升教职工幸福感与凝聚力发挥着重要作用。</p>
<img src="assets/教师活动中心.jpg" alt="教师活动中心">
`,
    left: 68.3,
    top: 32.0,
    width: 5.2,
    height: 9.0,
    image: "assets/教师活动中心.jpg"
  },
  {
    id: 85,
    title: "宿舍楼",
    description: `
<p>这是校园内的补充性学生宿舍，主要用于缓解住宿压力，服务周边教学区域的学生，实现居住与学习的就近衔接。建筑布局与内部设施严格遵循学校统一标准，保障学生居住体验的一致性，为学子提供稳定舒适的居住环境。</p>
<p>宿舍延续了学校标准化配置，满足学生日常起居、学习休息的核心需求，周边紧邻校园生活服务设施与运动场地，进一步提升居住便利性，让学生能够便捷享受校园各类资源，专注于学业与成长。</p>
<img src="assets/宿舍.jpg" alt="宿舍楼">
`,
    left: 81.3,
    top: 44.0,
    width: 6.9,
    height: 8.8,
    image: "assets/宿舍.jpg"
  },
  {
    id: 86,
    title: "学生五食堂",
    description: `
<p>作为津南校区的特色餐饮配套，学生五食堂在保障基础大众餐供应的同时，重点打造多元化风味档口，涵盖地方小吃、特色快餐等丰富品类，部分时段还提供夜宵服务，精准满足师生多样化、个性化的餐饮需求。</p>
<p>食堂内部设有舒适的休闲用餐区，环境整洁明亮，支持校园卡、移动支付等多渠道结算方式，提升就餐便捷性。这里不仅是解决三餐的餐饮场所，更通过丰富的菜品选择与舒适的就餐环境，成为师生日常交流、放松身心的重要空间。</p>
<img src="assets/五食堂.jpg" alt="学生五食堂">
`,
    left: 76.8,
    top: 44.0,
    width: 4.9,
    height: 6.8,
    image: "assets/五食堂.jpg"
  },
  {
    id: 87,
    title: "学院楼",
    description: `
<p>这是单个学院的独立办公与教学建筑，集学院办公室、专业教室、学院专属实验室于一体，实现教学、办公、科研的集中化管理，为学院内部的日常教学管理与学科建设提供了便捷条件。建筑布局贴合学院教学需求，功能分区明确，保障各项工作高效开展。</p>
<p>作为学院的核心阵地，这里不仅是教师授课、学生学习的主要场所，也是学院举办院级学术活动、师生交流研讨的重要空间。集中化的布局促进了师生间的日常沟通与学术互动，为学科传承与创新发展奠定了坚实基础。</p>
<img src="assets/学院楼.jpg" alt="学院楼">
`,
    left: 76.7,
    top: 40.0,
    width: 6.9,
    height: 4.3,
    image: "assets/学院楼.jpg"
  },
  {
    id: 88,
    title: "东校门",
    description: `
<p>作为津南校区的东侧主要出入口，东校门是校外人员、车辆入校的重要通道，配备先进的门禁系统（支持校园卡、人脸识别），严格保障校园安全。校门处设有门卫室与访客登记处，建立了规范的入校管理流程，为校园安全筑牢第一道防线。</p>
<p>除了承担出入口功能外，东校门还肩负着校园安防值守的重要职责，工作人员24小时在岗，及时响应各类安全需求。整洁规范的校门形象不仅是校园的重要标识，更通过严谨的管理为师生营造了安全、有序的校园环境。</p>
<img src="assets/东校门.jpg" alt="东校门">
`,
    left: 83.7,
    top: 38.5,
    width: 2.9,
    height: 2.8,
    image: "assets/东校门.jpg"
  },
  {
    id: 89,
    title: "生活组团",
    description: `
<p>这是校园内的综合性生活服务综合体，相当于“校园微型商圈”，集中了超市（售卖日用品、零食等）、打印店、理发店、快递驿站等多元生活服务设施，一站式满足师生日常购物、生活琐事处理的核心需求。</p>
<p>生活组团地理位置优越，紧邻学生生活区与教学区，极大缩短了师生办事路程，提升了生活便捷度。这里不仅是满足基本生活需求的服务场所，更成为师生日常出行、交流互动的重要节点，为校园生活增添了便利与活力。</p>
<img src="assets/生活组团.jpg" alt="生活组团">
`,
    left: 73.7,
    top: 30.0,
    width: 7.9,
    height: 10.1,
    image: "assets/生活组团.jpg"
  }
  ];

  // ========== 2. 初始化元素和变量 ==========
  const mapContainer = document.querySelector(".map-container");
  const infoTitle = document.getElementById("info-title");
  const infoBody = document.getElementById("info-body");
  const infoImageContainer = document.getElementById("info-image-container");
  const hoverSound = document.getElementById("hover-sound");
  const clickSound = document.getElementById("click-sound");

  let activeHotspot = null;

  // ========== 3. 工具函数 ==========
  function playSound(audioEl) {
    if (!audioEl) return;
    try {
      audioEl.currentTime = 0;
      audioEl.play();
    } catch (e) {
      // 忽略浏览器自动播放限制报错
    }
  }

  // 拖拽热点功能
  function enableDrag(hotspot, item) {
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let startLeft = 0;
    let startTop = 0;

    const mapRect = mapContainer.getBoundingClientRect();

    hotspot.addEventListener("mousedown", (e) => {
      e.preventDefault();
      isDragging = true;
      hotspot.classList.add("dragging");

      startX = e.clientX;
      startY = e.clientY;
      startLeft = item.left;
      startTop = item.top;
    });

    document.addEventListener("mousemove", (e) => {
      if (!isDragging) return;

      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      // 像素 → 百分比
      const dxPercent = (dx / mapRect.width) * 100;
      const dyPercent = (dy / mapRect.height) * 100;

      const newLeft = startLeft + dxPercent;
      const newTop = startTop + dyPercent;

      // 实时更新 DOM
      hotspot.style.left = newLeft + "%";
      hotspot.style.top = newTop + "%";

      // 同步写回数据对象
      item.left = Number(newLeft.toFixed(2));
      item.top = Number(newTop.toFixed(2));
    });

    document.addEventListener("mouseup", () => {
      if (!isDragging) return;

      isDragging = false;
      hotspot.classList.remove("dragging");

      console.log(
        `📌 建筑 ${item.id} 新位置：`,
        {
          id: item.id,
          left: item.left,
          top: item.top,
          width: item.width,
          height: item.height
        }
      );
    });
  }

  // ========== 4. 生成建筑热点 ==========
  function createHotspots() {
    HOTSPOT_DATA.forEach((item) => {
      const hotspot = document.createElement("div");
      hotspot.className = "hotspot";

      // 设置热点位置和大小
      hotspot.style.left = item.left + "%";
      hotspot.style.top = item.top + "%";
      hotspot.style.width = item.width + "%";
      hotspot.style.height = item.height + "%";

      // 存储数据到 DOM 元素
      hotspot.dataset.title = item.title;
      hotspot.dataset.description = item.description;
      hotspot.dataset.id = item.id;
      if (item.image) hotspot.dataset.image = item.image;

      // 滑过音效
      hotspot.addEventListener("mouseenter", () => {
        playSound(hoverSound);
      });

      // 点击事件：显示文字+图片
      hotspot.addEventListener("click", (event) => {
        event.preventDefault();

        // 取消之前的激活状态
        if (activeHotspot && activeHotspot !== hotspot) {
          activeHotspot.classList.remove("active");
        }
        activeHotspot = hotspot;
        hotspot.classList.add("active");

        // 更新标题和正文
        infoTitle.textContent = item.title || `编号 ${item.id}`;
        infoBody.textContent = item.description || "这个建筑暂时还没有详细介绍。";

        // 处理图片
        if (item.image) {
          const img = document.createElement("img");
          img.src = item.image;
          img.alt = item.title || "建筑图片";
          img.className = "info-image";
          // 图片加载失败容错
          img.onerror = () => {
            img.src = "https://picsum.photos/id/1005/800/500"; // 默认占位图
          };
          // 清空旧图片并插入新图片
          infoImageContainer.innerHTML = "";
          infoImageContainer.appendChild(img);
          infoImageContainer.style.display = "block";
        } else {
          // 无图片时隐藏容器
          infoImageContainer.style.display = "none";
          infoImageContainer.innerHTML = "";
        }

        playSound(clickSound);
      });

      // 启用拖拽功能
      enableDrag(hotspot, item);
      // 添加到地图容器
      mapContainer.appendChild(hotspot);
    });
  }

  // ========== 5. 初始化和事件监听 ==========
  // 生成热点
  createHotspots();

  // Esc 取消选择
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" || event.key === "Esc") {
      if (activeHotspot) {
        activeHotspot.classList.remove("active");
        activeHotspot = null;
      }

      // 恢复默认提示，隐藏图片
      infoTitle.textContent = "操作提示";
      infoBody.textContent = "鼠标移动到地图上的某栋建筑区域，会看到发光浮起；点击后高亮会一直存在，并在右侧显示对应介绍。按 Esc 取消当前选择。";
      infoImageContainer.style.display = "none";
      infoImageContainer.innerHTML = "";
    }
  });

});
