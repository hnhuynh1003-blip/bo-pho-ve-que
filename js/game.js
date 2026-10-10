
    const LEGACY_STORAGE_KEY = 've_que_khoi_nghiep_progression_v1';
    const ACCOUNT_REGISTRY_KEY = 've_que_khoi_nghiep_accounts_v1';
    const ACTIVE_PROFILE_KEY = 've_que_khoi_nghiep_active_profile_v1';
    const LEGACY_IMPORTED_KEY = 've_que_khoi_nghiep_legacy_imported_v1';
    let activeProfileId = null;
    let sessionGameActive = false;

    function getProfileStorageKey(profileId) {
      return `ve_que_khoi_nghiep_profile_${profileId}_save_v13`;
    }

    const FARM_PLOTS_CONFIG = [
      { id: 0, unlockLv: 1, cost: 0, name: "Thửa Đất #1" },
      { id: 1, unlockLv: 1, cost: 0, name: "Thửa Đất #2" },
      { id: 2, unlockLv: 4, cost: 250, name: "Thửa Đất #3" },
      { id: 3, unlockLv: 10, cost: 800, name: "Thửa Đất #4" },
      { id: 4, unlockLv: 20, cost: 2500, name: "Thửa Đất #5" },
      { id: 5, unlockLv: 35, cost: 6000, name: "Thửa Đất #6" }
    ];

    const FARM_SEEDS_CONFIG = {
      wheat: { name: "Lúa Mì", seedKey: "seed_wheat", cropKey: "crop_wheat", unlockLv: 1, cost: 14, growTime: 10, icon: "🌾" },
      tea: { name: "Búp Trà", seedKey: "seed_tea", cropKey: "crop_tea", unlockLv: 3, cost: 26, growTime: 15, icon: "🍃" },
      strawberry: { name: "Dâu Tây", seedKey: "seed_strawberry", cropKey: "crop_strawberry", unlockLv: 6, cost: 42, growTime: 20, icon: "🍓" },
      chili: { name: "Ớt Hiểm", seedKey: "seed_chili", cropKey: "crop_chili", unlockLv: 10, cost: 38, growTime: 18, icon: "🌶️" },
      corn: { name: "Bắp Ngọt", seedKey: "seed_corn", cropKey: "crop_corn", unlockLv: 18, cost: 45, growTime: 22, icon: "🌽" },
      taro: { name: "Khoai Môn", seedKey: "seed_taro", cropKey: "crop_taro", unlockLv: 28, cost: 68, growTime: 28, icon: "🍠" }
    };

    const BARN_ANIMALS_CONFIG = {
      chicken: { key: "chicken", defaultName: "Đàn Gà Mái", unlockLv: 2, cost: 200, feedCostItem: "crop_wheat", productKey: "egg", productIcon: "🥚", productName: "Trứng Gà Ta", cycleTime: 18, icon: "🐔" },
      cow: { key: "cow", defaultName: "Bò Sữa Bé Bông", unlockLv: 6, cost: 950, feedCostItem: "crop_wheat", productKey: "milk", productIcon: "🥛", productName: "Sữa Bò Tươi", cycleTime: 24, icon: "🐄" },
      duck: { key: "duck", defaultName: "Đàn Vịt Bầu", unlockLv: 14, cost: 2200, feedCostItem: "crop_wheat", productKey: "duck_egg", productIcon: "🥮", productName: "Trứng Vịt Muối", cycleTime: 20, icon: "🦆" },
      goat: { key: "goat", defaultName: "Dê Núi Cà Lem", unlockLv: 24, cost: 4800, feedCostItem: "crop_corn", productKey: "goat_milk", productIcon: "🍼", productName: "Sữa Dê Núi", cycleTime: 28, icon: "🐐" },
      bee: { key: "bee", defaultName: "Tổ Ong Vườn Hoa", unlockLv: 40, cost: 9000, feedCostItem: null, productKey: "honey", productIcon: "🍯", productName: "Mật Ong Rừng", cycleTime: 32, icon: "🐝" }
    };

    const ITEM_DICTIONARY = {
      cup_m: { name: "Ly M", icon: "🥤", cat: "craft", basePrice: 3 },
      cup_l: { name: "Ly L", icon: "🥤", cat: "craft", basePrice: 5 },
      tea_black: { name: "Trà Đen", icon: "🍃", cat: "craft", basePrice: 8 },
      tea_green: { name: "Lục Trà", icon: "🌿", cat: "craft", basePrice: 10 },
      tea_strawberry: { name: "Trà Dâu", icon: "🍓", cat: "craft", basePrice: 15 },
      tea_taro: { name: "Khoai Môn", icon: "🍠", cat: "craft", basePrice: 16 },
      milk_fresh: { name: "Sữa Bò", icon: "🥛", cat: "dairy", basePrice: 12 },
      tea_honey: { name: "Mật Ong", icon: "🍯", cat: "craft", basePrice: 20 },

      topping_boba: { name: "Trân Châu", icon: "🧋", cat: "craft", basePrice: 5 },
      topping_white_boba: { name: "Trân Trắng", icon: "⚪", cat: "craft", basePrice: 6 },
      topping_pudding: { name: "Pudding", icon: "🍮", cat: "craft", basePrice: 7 },
      topping_jelly: { name: "Thạch Dừa", icon: "🥥", cat: "craft", basePrice: 5 },
      topping_cheese_foam: { name: "Milk Foam", icon: "🧀", cat: "craft", basePrice: 10 },
      topping_redbean: { name: "Đậu Đỏ", icon: "🫘", cat: "craft", basePrice: 7 },
      topping_grass_jelly: { name: "Sương Sáo", icon: "⬛", cat: "craft", basePrice: 6 },
      topping_aloe: { name: "Nha Đam", icon: "🌵", cat: "craft", basePrice: 7 },
      topping_cookie: { name: "Bánh Quy Nghiền", icon: "🍪", cat: "craft", basePrice: 9 },
      cup_xl: { name: "Ly XL", icon: "🥤", cat: "craft", basePrice: 18 },
      tea_oolong: { name: "Trà Ô Long", icon: "🍂", cat: "craft", basePrice: 9 },
      tea_jasmine: { name: "Trà Nhài", icon: "🌼", cat: "craft", basePrice: 8 },
      topping_mochi: { name: "Mochi Sữa", icon: "🍡", cat: "craft", basePrice: 10 },
      topping_crystal: { name: "Thạch Pha Lê", icon: "💎", cat: "craft", basePrice: 8 },
      topping_lychee: { name: "Thạch Vải", icon: "🍈", cat: "craft", basePrice: 8 },

      bowl_m: { name: "Thố M", icon: "🍲", cat: "craft", basePrice: 6 },
      bowl_l: { name: "Thố L", icon: "🍲", cat: "craft", basePrice: 9 },
      broth_kimchi: { name: "Kim Chi", icon: "🌶️", cat: "craft", basePrice: 12 },
      broth_tomyum: { name: "Tom Yum", icon: "🥘", cat: "craft", basePrice: 15 },
      broth_beef: { name: "Bò Sa Tế", icon: "🥩", cat: "craft", basePrice: 16 },
      broth_mushroom: { name: "Cốt Nấm", icon: "🍄", cat: "craft", basePrice: 12 },
      broth_mala: { name: "Mala Tê Cay", icon: "🌶️", cat: "craft", basePrice: 18 },
      bowl_xl: { name: "Thố XL", icon: "🍜", cat: "craft", basePrice: 18 },
      broth_collagen: { name: "Cốt Collagen", icon: "🍅", cat: "craft", basePrice: 15 },
      broth_tonkotsu: { name: "Cốt Xương Hầm", icon: "🍖", cat: "craft", basePrice: 17 },
      broth_herbal: { name: "Lẩu Thảo Mộc", icon: "🌱", cat: "craft", basePrice: 16 },
      ntop_nori: { name: "Rong Biển", icon: "🌿", cat: "craft", basePrice: 6 },
      ntop_meatball: { name: "Thịt Viên", icon: "🍖", cat: "craft", basePrice: 7 },
      ntop_corn: { name: "Bắp Ngọt", icon: "🌽", cat: "craft", basePrice: 6 },
      ntop_dumpling: { name: "Há Cảo", icon: "🥟", cat: "craft", basePrice: 9 },
      ntop_porkbelly: { name: "Ba Chỉ Heo", icon: "🥓", cat: "craft", basePrice: 12 },

      ntop_beef: { name: "Bò Mỹ", icon: "🥩", cat: "craft", basePrice: 14 },
      ntop_shrimp: { name: "Tôm Sú", icon: "🦐", cat: "craft", basePrice: 15 },
      ntop_squid: { name: "Mực Ống", icon: "🦑", cat: "craft", basePrice: 14 },
      ntop_fishcake: { name: "Chả Cá", icon: "🍥", cat: "craft", basePrice: 8 },
      ntop_sausage: { name: "Xúc Xích", icon: "🌭", cat: "craft", basePrice: 8 },
      ntop_enoki: { name: "Nấm Kim", icon: "🍄", cat: "craft", basePrice: 6 },
      ntop_egg: { name: "Trứng", icon: "🥚", cat: "dairy", basePrice: 6 },
      ntop_cheese: { name: "Phô Mai", icon: "🧀", cat: "craft", basePrice: 10 },
      ntop_tofu: { name: "Đậu Hũ Non", icon: "⬜", cat: "craft", basePrice: 7 },
      ntop_bokchoy: { name: "Cải Thìa", icon: "🥬", cat: "craft", basePrice: 6 },
      ntop_crabstick: { name: "Thanh Cua", icon: "🦀", cat: "craft", basePrice: 10 },

      tray_plate: { name: "Đĩa Giấy", icon: "🍽️", cat: "craft", basePrice: 2 },
      tray_basket: { name: "Mẹt Tre", icon: "🧺", cat: "craft", basePrice: 4 },
      skewer_fish: { name: "Cá Viên", icon: "🍢", cat: "craft", basePrice: 4 },
      skewer_beef: { name: "Bò Viên", icon: "🧆", cat: "craft", basePrice: 5 },
      skewer_shrimp: { name: "Tôm Viên", icon: "🍤", cat: "craft", basePrice: 5 },
      skewer_holo: { name: "Hồ Lô", icon: "🍡", cat: "craft", basePrice: 6 },
      skewer_sausage: { name: "Xúc Xích", icon: "🌭", cat: "craft", basePrice: 6 },
      skewer_tofu: { name: "Đậu Hũ", icon: "🧀", cat: "craft", basePrice: 7 },
      skewer_quail: { name: "Trứng Cút", icon: "🥚", cat: "craft", basePrice: 4 },
      skewer_beef_enoki: { name: "Bò Nấm", icon: "🥩", cat: "craft", basePrice: 9 },
      skewer_corn: { name: "Bắp Xào", icon: "🌽", cat: "craft", basePrice: 6 },
      skewer_chicken: { name: "Gà Xiên", icon: "🍗", cat: "craft", basePrice: 8 },
      skewer_crabstick: { name: "Thanh Cua Xiên", icon: "🦀", cat: "craft", basePrice: 7 },
      skewer_okra: { name: "Đậu Bắp Nướng", icon: "🥬", cat: "craft", basePrice: 5 },
      skewer_cheese_sausage: { name: "Xúc Xích Phô Mai", icon: "🧀", cat: "craft", basePrice: 9 },
      tray_box: { name: "Hộp Mang Đi", icon: "📦", cat: "craft", basePrice: 12 },
      skewer_mushroom: { name: "Nấm Nướng", icon: "🍄", cat: "craft", basePrice: 6 },
      skewer_bacon_okra: { name: "Đậu Bắp Cuộn", icon: "🥓", cat: "craft", basePrice: 8 },
      skewer_squid: { name: "Mực Xiên", icon: "🦑", cat: "craft", basePrice: 10 },
      sauce_mayo: { name: "Mayo Cay", icon: "🥫", cat: "craft", basePrice: 5 },
      sauce_honey_mustard: { name: "Mật Ong Mù Tạt", icon: "🍯", cat: "craft", basePrice: 7 },
      sauce_bbq: { name: "Sốt BBQ", icon: "🥫", cat: "craft", basePrice: 8 },

      sauce_sweet_chili: { name: "Cay Ngọt", icon: "🥫", cat: "craft", basePrice: 3 },
      sauce_tamarind: { name: "Sốt Me", icon: "🫙", cat: "craft", basePrice: 4 },
      sauce_butter_garlic: { name: "Bơ Tỏi", icon: "🧈", cat: "craft", basePrice: 5 },
      sauce_cheese: { name: "Sốt Phô Mai", icon: "🧀", cat: "craft", basePrice: 6 },
      sauce_satay: { name: "Sa Tế Cay", icon: "🌶️", cat: "craft", basePrice: 5 },

      seed_wheat: { name: "Hạt Lúa Mì", icon: "🌱", cat: "seed", basePrice: 14 },
      seed_tea: { name: "Hạt Búp Trà", icon: "🌱", cat: "seed", basePrice: 26 },
      seed_strawberry: { name: "Hạt Dâu Tây", icon: "🌱", cat: "seed", basePrice: 42 },
      seed_chili: { name: "Hạt Ớt Hiểm", icon: "🌱", cat: "seed", basePrice: 38 },
      seed_corn: { name: "Hạt Bắp Ngọt", icon: "🌱", cat: "seed", basePrice: 45 },
      seed_taro: { name: "Củ Khoai Môn", icon: "🌱", cat: "seed", basePrice: 68 },

      crop_wheat: { name: "Bó Lúa Mì", icon: "🌾", cat: "farm", basePrice: 22 },
      crop_tea: { name: "Búp Trà Tươi", icon: "🍃", cat: "farm", basePrice: 38 },
      crop_strawberry: { name: "Dâu Tây", icon: "🍓", cat: "farm", basePrice: 58 },
      crop_sim: { name: "Sim Rừng", icon: "🫐", cat: "farm", basePrice: 24 },
      crop_chili: { name: "Ớt Hiểm", icon: "🌶️", cat: "farm", basePrice: 50 },
      crop_corn: { name: "Bắp Ngọt", icon: "🌽", cat: "farm", basePrice: 60 },
      crop_taro: { name: "Khoai Môn", icon: "🍠", cat: "farm", basePrice: 90 },

      egg: { name: "Trứng Gà", icon: "🥚", cat: "dairy", basePrice: 8 },
      milk: { name: "Sữa Bò", icon: "🥛", cat: "dairy", basePrice: 14 },
      duck_egg: { name: "Trứng Vịt", icon: "🥮", cat: "dairy", basePrice: 16 },
      goat_milk: { name: "Sữa Dê", icon: "🍼", cat: "dairy", basePrice: 22 },
      honey: { name: "Mật Ong", icon: "🍯", cat: "dairy", basePrice: 35 }
    };

    // V87.4.3 — 15 fresh food SKUs across the three careers.
    Object.assign(ITEM_DICTIONARY, {
      tea_matcha:{name:'Bột Matcha',icon:'🍵',cat:'craft',basePrice:16},
      topping_peach:{name:'Thạch Đào',icon:'🍑',cat:'craft',basePrice:8},
      topping_brown_boba:{name:'Trân Châu Đường Đen',icon:'🧋',cat:'craft',basePrice:9},
      topping_salted_cream:{name:'Kem Muối',icon:'🥛',cat:'craft',basePrice:12},
      syrup_rainbow:{name:'Siro Cầu Vồng',icon:'🌈',cat:'craft',basePrice:23},
      ntop_oyster_mushroom:{name:'Nấm Bào Ngư',icon:'🍄',cat:'craft',basePrice:8},
      ntop_beef_roll:{name:'Bò Cuộn',icon:'🥩',cat:'craft',basePrice:17},
      ntop_cheese_ball:{name:'Viên Phô Mai',icon:'🧀',cat:'craft',basePrice:11},
      broth_lemongrass_coconut:{name:'Cốt Sả Dừa',icon:'🥥',cat:'craft',basePrice:20},
      broth_signature_satay:{name:'Cốt Sa Tế Gia Truyền',icon:'🌶️',cat:'craft',basePrice:26},
      skewer_pineapple:{name:'Xiên Dứa',icon:'🍍',cat:'craft',basePrice:5},
      skewer_cheese_stick:{name:'Phô Mai Que',icon:'🧀',cat:'craft',basePrice:10},
      sauce_five_spice:{name:'Sốt Ngũ Vị',icon:'🫙',cat:'craft',basePrice:11},
      skewer_pork_pineapple:{name:'Ba Chỉ Cuộn Dứa',icon:'🥓',cat:'craft',basePrice:13},
      sauce_festival:{name:'Sốt Hội Làng',icon:'🎏',cat:'craft',basePrice:22}
    });

    // V87.4.2 — Four career pathways. The three existing masteries keep their levels.
    const GROWTH_SKILL_CONFIG = {
      sales: { name:'Kinh Doanh', icon:'💼', max:5, desc:'Mỗi cấp: +4% doanh thu quầy', color:'gold', motto:'Biến ý tưởng thành thương hiệu' },
      service: { name:'Phục Vụ', icon:'💝', max:5, desc:'Mỗi cấp: khách chờ +3 giây, tiền boa +3%', color:'rose', motto:'Giữ chân khách bằng sự chân thành' },
      luck: { name:'May Mắn', icon:'✨', max:5, desc:'Mỗi cấp: +3% vận may chung của Quán', color:'violet', motto:'Cơ hội luôn dành cho người biết tìm' },
      farm: { name:'Nông Trại', icon:'🌿', max:5, desc:'Mỗi cấp: +2% tốc độ Vườn và Chuồng', color:'mint', motto:'Chăm từng mầm cây, nuôi cả tương lai' }
    };
    const V8742_TALENTS = {
      smart_sale:{root:'sales',need:2,name:'Chốt Đơn Tinh Tế',icon:'💰',desc:'Mỗi cấp: +2% doanh thu Quán.',max:3,bonus:{revenuePct:.02}},
      delivery_pro:{root:'sales',need:4,name:'Chủ Đơn Giao Hàng',icon:'🛵',desc:'Mỗi cấp: +2% tiền đơn ship và +2 giây giao hàng.',max:3,bonus:{deliveryPct:.02,deliveryTimeSec:2}},
      warm_welcome:{root:'service',need:2,name:'Chạm Tới Trái Tim',icon:'🌸',desc:'Mỗi cấp: +2% tiền boa và +1 giây khách chờ.',max:3,bonus:{tipPct:.02,patienceSec:1}},
      vip_touch:{root:'service',need:4,name:'Bậc Thầy Đón Khách',icon:'👑',desc:'Mỗi cấp: +1% khách hiếm và +1,5% nhịp khách.',max:3,bonus:{rarePct:.01,arrivalPct:.015}},
      lucky_touch:{root:'luck',need:2,name:'Vía Mở Hàng',icon:'🧧',desc:'Mỗi cấp: +2% may mắn Quán.',max:3,bonus:{luckPct:.02}},
      light_steps:{root:'luck',need:4,name:'Bước Chân Lon Ton',icon:'🥾',desc:'Mỗi cấp: đi Làng tốn ít hơn 1 năng lượng (tối thiểu 5).',max:3,bonus:{energyCostFlat:1}},
      green_thumb:{root:'farm',need:2,name:'Bàn Tay Xanh',icon:'🍀',desc:'Mỗi cấp: cây trồng phát triển nhanh hơn 3%.',max:3,bonus:{farmGrowthPct:.03}},
      gentle_care:{root:'farm',need:4,name:'Nhịp Sống Nông Trại',icon:'🐾',desc:'Mỗi cấp: +3% cơ hội giữ hạt và thức ăn chăn nuôi.',max:3,bonus:{seedSavePct:.03,feedSavePct:.03}}
    };
    let v8742CurrentPath='sales';
    function v8742TalentLevel(id){return Math.max(0,Math.min(3,Number(gameState.skillTalents?.[id])||0));}
    function v8742TalentCost(id){return Math.min(3,v8742TalentLevel(id)+1);}
    function v8742SkillBonus(key){
      let total=0;
      for(const [id,cfg] of Object.entries(V8742_TALENTS)) total+=(Number(cfg.bonus?.[key])||0)*v8742TalentLevel(id);
      return total;
    }
    function v8742SelectPath(key){
      if(!GROWTH_SKILL_CONFIG[key])return;
      v8742CurrentPath=key;renderGrowthSkills();playSound('click');
    }
    function upgradeTalentSkill(id){
      ensureGrowthState();
      const talent=V8742_TALENTS[id];if(!talent)return;
      const rank=v8742TalentLevel(id);
      if(rank>=talent.max)return showToast('Đã đạt cấp tối đa!', '⭐');
      if((gameState.skills[talent.root]||0)<talent.need)return showToast(`Cần ${GROWTH_SKILL_CONFIG[talent.root].name} Lv.${talent.need} để mở khóa!`,'🔒');
      const cost=v8742TalentCost(id);
      if((Number(gameState.sp)||0)<cost)return showToast(`Cần ${cost} SP để học kỹ năng này!`,'⚡');
      gameState.sp-=cost;gameState.skillTalents[id]=rank+1;
      playSound('level');showToast(`${talent.icon} ${talent.name} Lv.${rank+1} • -${cost} SP`,'🌟');
      updateHeaderStats();renderGrowthApp();saveGameToStorage();
    }
    // Expose a read-only debug map to facilitate exact gameplay/ledger tests.
    function v8742CareerSummary(){
      return Object.fromEntries(Object.keys(GROWTH_SKILL_CONFIG).map(k=>[k,{core:Number(gameState.skills?.[k])||0,talents:Object.entries(V8742_TALENTS).filter(([,v])=>v.root===k).map(([id,v])=>({id,rank:v8742TalentLevel(id),unlocked:(gameState.skills?.[k]||0)>=v.need}))}]));
    }


    // V87.4.4: profession skills use real completed orders; saved per profession.
    const V8744_CAREERS={
      boba:{name:'Trà Sữa',icon:'🧋',skills:[
        {id:'boba_tea',icon:'🍵',name:'Ủ Trà Tinh Tế',desc:'Khách chờ thêm 2 giây/cấp tại quầy trà sữa.',type:'patience',rate:2,level:3,orders:5},
        {id:'boba_topping',icon:'🧋',name:'Trân Châu Tròn Vị',desc:'+2% tiền boa/cấp nếu món đúng có ít nhất 2 topping.',type:'tip',rate:.02,level:6,orders:15},
        {id:'boba_signature',icon:'🌈',name:'Ly Trà Đặc Sắc',desc:'+2% doanh thu/cấp nếu món đúng có topping.',type:'revenue',rate:.02,level:10,orders:30}
      ]},
      noodle:{name:'Mì Cay',icon:'🍜',skills:[
        {id:'noodle_flame',icon:'🔥',name:'Bếp Lửa Êm',desc:'Khách chờ thêm 2 giây/cấp tại quầy mì cay.',type:'patience',rate:2,level:3,orders:5},
        {id:'noodle_broth',icon:'🍲',name:'Hồn Nước Cốt',desc:'+2% doanh thu/cấp khi món đúng cay từ cấp 3.',type:'revenue',rate:.02,level:6,orders:15},
        {id:'noodle_topping',icon:'🥩',name:'Thố Đầy Đặn',desc:'+2% tiền boa/cấp nếu món đúng có ít nhất 2 topping.',type:'tip',rate:.02,level:10,orders:30}
      ]},
      streetfood:{name:'Xiên Que',icon:'🍢',skills:[
        {id:'street_speed',icon:'⏱️',name:'Nhịp Tay Lật Xiên',desc:'Khách chờ thêm 2 giây/cấp tại quầy xiên que.',type:'patience',rate:2,level:3,orders:5},
        {id:'street_tray',icon:'🍡',name:'Mẹt Xiên Vàng',desc:'+2% doanh thu/cấp nếu món đúng có ít nhất 3 que.',type:'revenue',rate:.02,level:6,orders:15},
        {id:'street_sauce',icon:'🥫',name:'Sốt Gây Thương Nhớ',desc:'+2% tiền boa/cấp nếu món đúng dùng sốt khác Cay Ngọt.',type:'tip',rate:.02,level:10,orders:30}
      ]}
    };
    let v8744SelectedCareer=null;
    let v8744CareerExpanded=false;
    function v8744EnsureState(){
      if(!gameState.careerTalents || typeof gameState.careerTalents!=='object'||Array.isArray(gameState.careerTalents)) gameState.careerTalents={};
      if(!gameState.careerServed || typeof gameState.careerServed!=='object'||Array.isArray(gameState.careerServed)) gameState.careerServed={};
      for(const [career,cfg] of Object.entries(V8744_CAREERS)){
        gameState.careerServed[career]=Math.max(0,Math.floor(Number(gameState.careerServed[career])||0));
        for(const skill of cfg.skills) gameState.careerTalents[skill.id]=Math.max(0,Math.min(3,Math.floor(Number(gameState.careerTalents[skill.id])||0)));
      }
    }
    function v8744Level(id){return Math.max(0,Math.min(3,Math.floor(Number(gameState.careerTalents?.[id])||0)));}
    function v8744SkillReady(skill,career){return (Number(gameState.level)||1)>=skill.level && (Number(gameState.careerServed?.[career])||0)>=skill.orders;}
    function v8744CareerBonus(career=gameState.currentCareer,dish=null,stars=5,accepted=true){
      // Per-order multipliers apply only to accepted, correctly prepared dishes.
      const out={patienceSec:0,revenuePct:0,tipPct:0};const cfg=V8744_CAREERS[career];if(!cfg)return out;
      for(const skill of cfg.skills){
        const rank=v8744Level(skill.id);if(!rank)continue;
        if(skill.type==='patience'){out.patienceSec+=rank*skill.rate;continue;}
        if(!accepted || !dish || Number(stars)<4)continue;
        const toppings=(dish.toppings||[]).length;
        const counts=Object.values(dish.skewerCounts||{}).reduce((n,v)=>n+Math.max(0,Number(v)||0),0);
        const applies=skill.id==='boba_topping'?toppings>=2:
          skill.id==='boba_signature'?toppings>=1:
          skill.id==='noodle_broth'?(Number(dish.spicyLevel)||0)>=3:
          skill.id==='noodle_topping'?toppings>=2:
          skill.id==='street_tray'?counts>=3:
          skill.id==='street_sauce'?!!dish.sauce&&dish.sauce!=='sauce_sweet_chili':false;
        if(applies)out[skill.type==='tip'?'tipPct':'revenuePct']+=rank*skill.rate;
      }
      return out;
    }
    function v8744RecordOrder(career){
      if(!V8744_CAREERS[career])return;
      v8744EnsureState();
      const count=++gameState.careerServed[career];
      if([5,15,30].includes(count))showToast(`🎓 ${V8744_CAREERS[career].name}: đã phục vụ ${count} đơn! Mở cây nghề để xem kỹ năng.`, '⭐');
    }
    function v8744SelectCareer(career){
      if(!V8744_CAREERS[career])return;
      v8744SelectedCareer=career;renderGrowthSkills();playSound('click');
    }
    function v8744Upgrade(id){
      ensureGrowthState();
      const entry=Object.entries(V8744_CAREERS).find(([,cfg])=>cfg.skills.some(s=>s.id===id));
      if(!entry)return;
      const [career,cfg]=entry;const skill=cfg.skills.find(s=>s.id===id),rank=v8744Level(id);
      if(gameState.currentCareer!==career)return showToast('Chỉ học kỹ năng của nghề đang kinh doanh!', '🔒');
      if(!v8744SkillReady(skill,career))return showToast(`Cần Lv.${skill.level} và ${skill.orders} đơn ${cfg.name} thành công.`, '🔒');
      if(rank>=3)return showToast('Đã đạt bậc tối đa!', '⭐');
      const cost=rank+1;
      if((Number(gameState.sp)||0)<cost)return showToast(`Cần ${cost} SP để nâng kỹ năng!`, '⚡');
      gameState.sp-=cost;gameState.careerTalents[id]=rank+1;
      updateHeaderStats();renderGrowthApp();saveGameToStorage();playSound('level');
      showToast(`${skill.icon} ${skill.name} Lv.${rank+1} • -${cost} SP`, '⭐');
    }
    function v8744CareerHTML(){
      const current=V8744_CAREERS[gameState.currentCareer]?gameState.currentCareer:'boba';
      const chosen=V8744_CAREERS[v8744SelectedCareer]?v8744SelectedCareer:current;
      const data=V8744_CAREERS[chosen],done=gameState.careerServed?.[chosen]||0;
      const tabs=Object.entries(V8744_CAREERS).map(([key,cfg])=>`<button class="v8744-tab ${key===chosen?'active':''}" onclick="v8744SelectCareer('${key}')">${cfg.icon} ${cfg.name}</button>`).join('');
      const cards=data.skills.map(sk=>{
        const rank=v8744Level(sk.id),ready=v8744SkillReady(sk,chosen),active=current===chosen;
        const cost=rank+1,can=active&&ready&&rank<3&&(Number(gameState.sp)||0)>=cost;
        const reason=!active?'Nghề khác':!ready?`Lv.${sk.level} · ${sk.orders} đơn`:rank>=3?'MAX':`${cost} SP`;
        return `<div class="v8744-skill ${ready?'':'locked'}"><span class="v8744-ico">${sk.icon}</span><div class="v8744-copy"><b>${sk.name} <span class="v8744-dots">${rank}/3</span></b><small>${sk.desc}</small><small>${ready?'✓ Đã đạt điều kiện':`🔒 Lv.${sk.level} + ${sk.orders} đơn thành công`}</small></div><button type="button" onclick="v8744Upgrade('${sk.id}')" ${can?'':'disabled'}>${rank===3?'MAX':can?'Nâng '+cost+'SP':reason}</button></div>`;
      }).join('');
      return `<details class="v8744-panel" ${v8744CareerExpanded?'open':''}><summary onclick="v8744CareerExpanded=!v8744CareerExpanded"><span>👩‍🍳 Kỹ Năng Nghề Nghiệp • ${V8744_CAREERS[current].name}</span><span>▾</span></summary><div class="v8744-inner"><div class="v8744-tabs">${tabs}</div><div class="v8744-mini">📊 ${data.icon} ${data.name}: <b>${done} đơn thành công</b> • Lv.${gameState.level||1} • ${gameState.sp||0} SP còn lại. ${chosen===current?'Kỹ năng nghề đang hiệu lực.':'Chỉ xem trước; không nhận hiệu ứng nghề khác.'}</div><div class="v8744-list">${cards}</div><p class="v8744-tip">Kỹ năng dùng SP, lưu riêng cho từng nghề. Thưởng theo đơn chỉ kích hoạt khi món được khách chấp nhận và đạt ít nhất 4 sao; vẫn chịu trần doanh thu/tiền boa của Quán. Không thưởng khi khách từ chối.</p></div></details>`;
    }
    function v8744EffectMarkup(){
      const cfg=V8744_CAREERS[gameState.currentCareer]||V8744_CAREERS.boba;
      const count=gameState.careerServed?.[gameState.currentCareer]||0;
      return `<div class="v87411-note">${cfg.icon} <b>${cfg.name}</b> • ${count} đơn phục vụ thành công • ${gameState.sp||0} SP còn lại.</div>`+
        cfg.skills.map(sk=>`<div class="v87411-note">${sk.icon} ${sk.name} <b>Lv.${v8744Level(sk.id)}/3</b> • ${sk.desc} ${!v8744SkillReady(sk,gameState.currentCareer)?`🔒 Cần Lv.${sk.level}, ${sk.orders} đơn.`:''}</div>`).join('')+
        `<div class="v87411-note">📌 Thưởng doanh thu/boa phụ thuộc công thức đang bán và đánh giá từng đơn, không phải buff áp dụng cho mọi đơn. Chỉ số thời gian chờ đã được tính vào tổng của Quán.</div>`;
    }

    const SHOP_DECOR_CONFIG = {
      welcome_sign: { name: 'Bảng Chào Khách Gỗ', icon: '🪧', cost: 180, reqStage: 0, reqLevel: 1, desc: '+2 giây kiên nhẫn', patienceSec: 2 },
      flower_corner: { name: 'Góc Hoa Check-in', icon: '🌷', cost: 360, reqStage: 0, reqLevel: 2, desc: '+5% tiền tip', tipPct: 0.05 },
      warm_lights: { name: 'Đèn Dây Ấm Áp', icon: '🏮', cost: 650, reqStage: 1, reqLevel: 3, desc: '+3% doanh thu', revenuePct: 0.03 },
      lucky_bamboo: { name: 'Tre May Mắn', icon: '🎋', cost: 900, reqStage: 1, reqLevel: 4, desc: '+5% vận may', luckPct: 0.05 },
      menu_board: { name: 'Bảng Menu Xịn', icon: '🧾', cost: 1200, reqStage: 1, reqLevel: 5, desc: '+5% doanh thu', revenuePct: 0.05 },
      cat: { name: 'Mèo Thần Tài', icon: '🐱', cost: 1600, reqStage: 2, reqLevel: 6, desc: '+8% vận may • có thể trúng từ Túi Mù', luckPct: 0.08 },
      music_corner: { name: 'Góc Nhạc Nhẹ', icon: '🎶', cost: 1900, reqStage: 2, reqLevel: 7, desc: '+4 giây kiên nhẫn • +4% tip', patienceSec: 4, tipPct: 0.04 },
      neon_sign: { name: 'Biển Neon Thương Hiệu', icon: '🌈', cost: 3500, reqStage: 2, reqLevel: 9, desc: '+4% doanh thu • đồ trang trí cao cấp', revenuePct: 0.04 },
      aquarium: { name: 'Bể Cá Phong Thủy', icon: '🐠', cost: 6500, reqStage: 3, reqLevel: 12, desc: '+4% tip • +3% may mắn', tipPct: 0.04, luckPct: 0.03 },
      wood_furniture: { name: 'Bộ Bàn Ghế Gỗ Nguyên Khối', icon: '🪑', cost: 9500, reqStage: 4, reqLevel: 16, desc: '+5 giây kiên nhẫn • +3% doanh thu', patienceSec: 5, revenuePct: 0.03 },
      koi_corner: { name: 'Hồ Cá Koi Mini', icon: '🎏', cost: 15000, reqStage: 5, reqLevel: 21, desc: '+5% tip • +4% may mắn', tipPct: 0.05, luckPct: 0.04 },
      stone_counter: { name: 'Quầy Đá Cao Cấp', icon: '💎', cost: 24000, reqStage: 6, reqLevel: 29, desc: '+7% doanh thu', revenuePct: 0.07 },
      vip_room: { name: 'Phòng VIP Gỗ Đỏ', icon: '🚪', cost: 38000, reqStage: 7, reqLevel: 37, desc: '+6% doanh thu • +6% tip', revenuePct: 0.06, tipPct: 0.06 },
      heritage_wall: { name: 'Tường Di Sản Làng Quê', icon: '🏆', cost: 60000, reqStage: 8, reqLevel: 45, desc: '+5% doanh thu • +5% tip • +5% may mắn', revenuePct: 0.05, tipPct: 0.05, luckPct: 0.05 }
    };

    const SHOP_STAGE_CONFIG = [
      { name: 'Quầy Khởi Nghiệp', icon: '🛒', cost: 0, reqLevel: 1, reqRating: 0, opCost: 0, staffSlots: 0, revenuePct: 0, tipPct: 0, patienceSec: 0, luckPct: 0, story: 'Một quầy nhỏ, vài món vốn liếng và ước mơ tự gây dựng thương hiệu.' },
      { name: 'Quán Nhỏ Có Mái', icon: '🏪', cost: 700, reqLevel: 3, reqRating: 3.5, opCost: 10, staffSlots: 1, revenuePct: 0.03, tipPct: 0, patienceSec: 2, luckPct: 0, story: 'Khách quen bắt đầu đông. Bạn dựng mái, thêm bàn ghế và bắt đầu có thể thuê người phụ.' },
      { name: 'Tiệm Đông Khách', icon: '🧑‍🍳', cost: 1800, reqLevel: 6, reqRating: 3.9, opCost: 25, staffSlots: 2, revenuePct: 0.06, tipPct: 0.03, patienceSec: 4, luckPct: 0, story: 'Tiếng lành đồn xa. Quán có biển hiệu đẹp, quy trình ổn định và cần thêm nhân lực.' },
      { name: 'Quán Ăn Gia Đình', icon: '🍽️', cost: 4200, reqLevel: 10, reqRating: 4.2, opCost: 50, staffSlots: 3, revenuePct: 0.10, tipPct: 0.05, patienceSec: 7, luckPct: 0.02, story: 'Bạn mở rộng mặt bằng, có nhiều bàn hơn và bắt đầu vận hành như một đội nhỏ.' },
      { name: 'Nhà Hàng Làng Quê', icon: '🏨', cost: 9000, reqLevel: 15, reqRating: 4.5, opCost: 90, staffSlots: 4, revenuePct: 0.15, tipPct: 0.08, patienceSec: 10, luckPct: 0.04, story: 'Từ một quầy nhỏ, bạn đã xây được nhà hàng có thương hiệu trong làng.' },
      { name: 'Nhà Hàng Phố Huyện', icon: '🏬', cost: 18000, reqLevel: 20, reqRating: 4.6, opCost: 150, staffSlots: 5, revenuePct: 0.19, tipPct: 0.10, patienceSec: 12, luckPct: 0.05, story: 'Thương hiệu bước ra khỏi làng. Khách từ thị trấn bắt đầu tìm tới thường xuyên.' },
      { name: 'Nhà Hàng Sân Vườn', icon: '🌳', cost: 32000, reqLevel: 28, reqRating: 4.7, opCost: 230, staffSlots: 5, revenuePct: 0.23, tipPct: 0.12, patienceSec: 14, luckPct: 0.06, story: 'Bạn mua thêm mặt bằng, làm sân vườn và biến bữa ăn thành một trải nghiệm.' },
      { name: 'Trung Tâm Ẩm Thực Quê', icon: '🏯', cost: 55000, reqLevel: 36, reqRating: 4.8, opCost: 340, staffSlots: 6, revenuePct: 0.27, tipPct: 0.14, patienceSec: 16, luckPct: 0.07, story: 'Quán trở thành điểm đến của cả vùng, có đội ngũ riêng và lượng khách ổn định.' },
      { name: 'Thương Hiệu Đặc Sản', icon: '👑', cost: 90000, reqLevel: 45, reqRating: 4.9, opCost: 500, staffSlots: 7, revenuePct: 0.32, tipPct: 0.16, patienceSec: 18, luckPct: 0.08, story: 'Bạn không còn chỉ sở hữu một quán: đây đã là thương hiệu đặc sản được nhắc tên khắp nơi.' }
    ];

    const STAFF_CONFIG = {
      host_lan: { name:'Lan Phục Vụ', icon:'🙋‍♀️', role:'Đón khách & chăm bàn', hireCost:450, wage:14, reqStage:1, effect:'Khách kiên nhẫn +5s • tip +2%', patienceSec:5, tipPct:.02 },
      cashier_phuc: { name:'Phúc Thu Ngân', icon:'🧾', role:'Tính tiền & upsell', hireCost:850, wage:22, reqStage:2, effect:'Doanh thu +4%', revenuePct:.04 },
      kitchen_ti: { name:'Tí Phụ Bếp', icon:'👨‍🍳', role:'Sơ chế & chuẩn bị quầy', hireCost:1100, wage:28, reqStage:2, effect:'Khách kiên nhẫn +4s • doanh thu +2%', patienceSec:4, revenuePct:.02 },
      ship_khoa: { name:'Khoa Điều Phối Ship', icon:'🛵', role:'Điều phối đơn online', hireCost:1700, wage:38, reqStage:3, effect:'Đơn ship +10s • +6% tiền ship • +1 slot đơn', deliveryTimeSec:10, deliveryPct:.06, orderSlots:1 },
      promoter_ngoc: { name:'Ngọc Truyền Thông', icon:'📣', role:'Kéo khách & làm nội dung', hireCost:2300, wage:52, reqStage:4, effect:'Khách đặc biệt +5% • khách ghé nhanh hơn 8%', rarePct:.05, arrivalPct:.08 },
      manager_vy: { name:'Vy Quản Lý', icon:'👩‍💼', role:'Điều phối toàn quán', hireCost:3600, wage:72, reqStage:5, effect:'Doanh thu +5% • tip +3% • khách +3s', revenuePct:.05, tipPct:.03, patienceSec:3 }
    };



    // V65 - cut-out cute 2D art embedded for offline gameplay.
    const V65_ART = {
      "broth_kimchi":"assets/images/014_broth-kimchi_3479262574.webp",
      "broth_tomyum":"assets/images/015_broth-tomyum_20c2f9b69e.webp",
      "broth_beef":"assets/images/016_broth-beef_b8c3ffb2fc.webp",
      "broth_mushroom":"assets/images/017_broth-mushroom_21abdd5b3a.webp",
      "broth_mala":"assets/images/018_broth-mala_ddf6e7b91b.webp",
      "broth_collagen":"assets/images/019_broth-collagen_08ac71d3e8.webp",
      "broth_tonkotsu":"assets/images/020_broth-tonkotsu_fa00b40a20.webp",
      "broth_herbal":"assets/images/021_broth-herbal_f4689d18c1.webp",
      "ntop_beef":"assets/images/022_ntop-beef_81e8e95ab4.webp",
      "ntop_shrimp":"assets/images/023_ntop-shrimp_1c8b5020c3.webp",
      "ntop_squid":"assets/images/024_ntop-squid_7199b07cc7.webp",
      "ntop_fishcake":"assets/images/025_ntop-fishcake_24bbcc8954.webp",
      "ntop_sausage":"assets/images/026_ntop-sausage_e0e1817937.webp",
      "ntop_enoki":"assets/images/027_ntop-enoki_e30c22c06a.webp",
      "ntop_egg":"assets/images/028_ntop-egg_5a07307531.webp",
      "ntop_cheese":"assets/images/029_ntop-cheese_775a5df548.webp",
      "ntop_tofu":"assets/images/030_ntop-tofu_ba1114812b.webp",
      "ntop_bokchoy":"assets/images/031_ntop-bokchoy_685788dfff.webp",
      "ntop_crabstick":"assets/images/032_ntop-crabstick_d64a0a8583.webp",
      "ntop_nori":"assets/images/031_ntop-bokchoy_685788dfff.webp",
      "ntop_meatball":"assets/images/033_ntop-meatball_c8afbfb9ab.webp",
      "ntop_corn":"assets/images/034_ntop-corn_6aea9ec063.webp",
      "ntop_dumpling":"assets/images/033_ntop-meatball_c8afbfb9ab.webp",
      "ntop_porkbelly":"assets/images/022_ntop-beef_81e8e95ab4.webp",
      "skewer_fish":"assets/images/035_skewer-fish_4136082abf.webp",
      "skewer_beef":"assets/images/036_skewer-beef_45ff36497f.webp",
      "skewer_shrimp":"assets/images/037_skewer-shrimp_c434676d05.webp",
      "skewer_holo":"assets/images/038_skewer-holo_3d93a52f37.webp",
      "skewer_sausage":"assets/images/038_skewer-holo_3d93a52f37.webp",
      "skewer_tofu":"assets/images/039_skewer-tofu_ab9ddb6c12.webp",
      "skewer_quail":"assets/images/036_skewer-beef_45ff36497f.webp",
      "skewer_beef_enoki":"assets/images/040_skewer-beef-enoki_2c40f0764f.webp",
      "skewer_corn":"assets/images/034_ntop-corn_6aea9ec063.webp",
      "skewer_chicken":"assets/images/036_skewer-beef_45ff36497f.webp",
      "skewer_crabstick":"assets/images/032_ntop-crabstick_d64a0a8583.webp",
      "skewer_okra":"assets/images/041_skewer-okra_75c3f7b2ad.webp",
      "skewer_cheese_sausage":"assets/images/042_skewer-cheese-sausage_6c06204456.webp",
      "skewer_mushroom":"assets/images/043_skewer-mushroom_c68901fb40.webp",
      "skewer_bacon_okra":"assets/images/040_skewer-beef-enoki_2c40f0764f.webp",
      "skewer_squid":"assets/images/043_skewer-mushroom_c68901fb40.webp",
      "sauce_sweet_chili":"assets/images/044_sauce-sweet-chili_738b66b9fd.webp",
      "sauce_tamarind":"assets/images/045_sauce-tamarind_f5fa2f7f94.webp",
      "sauce_butter_garlic":"assets/images/046_sauce-butter-garlic_471362bfeb.webp",
      "sauce_cheese":"assets/images/029_ntop-cheese_775a5df548.webp",
      "sauce_satay":"assets/images/047_sauce-satay_4188bed57e.webp",
      "sauce_mayo":"assets/images/048_sauce-mayo_713cc503d1.webp",
      "sauce_honey_mustard":"assets/images/049_sauce-honey-mustard_65ce6543a7.webp",
      "sauce_bbq":"assets/images/050_sauce-bbq_5949b7483d.webp",
    };

    const V30_ART = {"tea_black": "assets/images/051_tea-black_930b05810b.webp", "tea_green": "assets/images/052_tea-green_dea58918d2.webp", "topping_boba": "assets/images/053_topping-boba_42302e5a50.webp", "topping_pudding": "assets/images/054_topping-pudding_9d5c9189c2.webp", "topping_jelly": "assets/images/055_topping-jelly_0ccb3e514b.webp", "topping_cheese_foam": "assets/images/056_topping-cheese-foam_365e6bf007.webp", "cup_m": "assets/images/012_html-012_9bf9f99910.webp", "cup_l": "assets/images/013_html-013_d8141e70e2.webp", "drink_main": "assets/images/011_html-011_70368fb97a.webp", "sleep_bunny": "assets/images/010_html-010_640fe81ff0.webp"};
    Object.assign(V30_ART, {"tea_black": "assets/images/057_tea-black_8c43c9fdf1.webp", "tea_green": "assets/images/058_tea-green_c593521943.webp", "tea_oolong": "assets/images/059_tea-oolong_76378ca6ec.webp", "tea_jasmine": "assets/images/060_tea-jasmine_6eb0f1a20e.webp", "milk_fresh": "assets/images/061_milk-fresh_80b152583c.webp", "tea_honey": "assets/images/062_tea-honey_c540b7e03e.webp", "tea_strawberry": "assets/images/063_tea-strawberry_e9002fe325.webp", "tea_taro": "assets/images/064_tea-taro_f92cdc8eba.webp", "topping_boba": "assets/images/065_topping-boba_50721c0e58.webp", "topping_white_boba": "assets/images/066_topping-white-boba_665b19cd9f.webp", "topping_pudding": "assets/images/067_topping-pudding_33e17cfd13.webp", "topping_jelly": "assets/images/068_topping-jelly_61dbd58c82.webp", "topping_cheese_foam": "assets/images/069_topping-cheese-foam_0190b7ff02.webp", "topping_lychee": "assets/images/070_topping-lychee_b30470ed21.webp", "topping_cookie": "assets/images/071_topping-cookie_9b347a4826.webp", "topping_aloe": "assets/images/072_topping-aloe_a17bf92f08.webp", "topping_grass_jelly": "assets/images/073_topping-grass-jelly_d917e5f37f.webp", "topping_redbean": "assets/images/074_topping-redbean_416456d0bc.webp", "topping_crystal": "assets/images/075_topping-crystal_e2ce5320db.webp", "topping_mochi": "assets/images/076_topping-mochi_5c7b9aa32e.webp", "broth_kimchi": "assets/images/077_broth-kimchi_da7ff66fad.webp", "broth_tomyum": "assets/images/078_broth-tomyum_d794c082aa.webp", "broth_mala": "assets/images/079_broth-mala_6343d690fe.webp", "broth_tonkotsu": "assets/images/080_broth-tonkotsu_a3f2025ac5.webp", "broth_mushroom": "assets/images/081_broth-mushroom_0e85dc991e.webp", "broth_herbal": "assets/images/082_broth-herbal_e6b3e671a5.webp", "ntop_beef": "assets/images/083_ntop-beef_ee466f1d52.webp", "ntop_shrimp": "assets/images/084_ntop-shrimp_04ea544abc.webp", "ntop_squid": "assets/images/085_ntop-squid_b00e827c0f.webp", "ntop_fishcake": "assets/images/086_ntop-fishcake_c07abb6f09.webp", "ntop_sausage": "assets/images/087_ntop-sausage_97652ae415.webp", "ntop_tofu": "assets/images/088_ntop-tofu_9d7fe53a3b.webp", "ntop_egg": "assets/images/089_ntop-egg_b9782f996e.webp", "ntop_cheese": "assets/images/090_ntop-cheese_1c6a659378.webp", "ntop_enoki": "assets/images/091_ntop-enoki_9b9773ee97.webp", "ntop_bokchoy": "assets/images/092_ntop-bokchoy_b3cebb98d4.webp", "ntop_crabstick": "assets/images/093_ntop-crabstick_ea1b8e072e.webp", "ntop_corn": "assets/images/094_ntop-corn_5e4b2d1d36.webp", "ntop_meatball": "assets/images/095_ntop-meatball_644a9c4d56.webp", "ntop_dumpling": "assets/images/096_ntop-dumpling_298d969d62.webp", "broth_collagen": "assets/images/081_broth-mushroom_0e85dc991e.webp", "skewer_fish": "assets/images/097_skewer-fish_2b89ecf0f2.webp", "skewer_beef": "assets/images/098_skewer-beef_613e29801f.webp", "skewer_shrimp": "assets/images/099_skewer-shrimp_8ffdd3175b.webp", "skewer_sausage": "assets/images/100_skewer-sausage_0d6c41b67e.webp", "skewer_tofu": "assets/images/101_skewer-tofu_6ecd1b4452.webp", "skewer_quail": "assets/images/102_skewer-quail_64f82907cf.webp", "skewer_mushroom": "assets/images/103_skewer-mushroom_ce7b6f05d7.webp", "skewer_crabstick": "assets/images/104_skewer-crabstick_2ae98200df.webp", "skewer_okra": "assets/images/105_skewer-okra_8f1ce09e6b.webp", "skewer_chicken": "assets/images/106_skewer-chicken_202d7ee5f4.webp", "skewer_squid": "assets/images/107_skewer-squid_5ee8b9479b.webp", "sauce_sweet_chili": "assets/images/108_sauce-sweet-chili_e934851eee.webp", "sauce_tamarind": "assets/images/109_sauce-tamarind_3b10d51b5c.webp", "sauce_butter_garlic": "assets/images/110_sauce-butter-garlic_9fc33b8511.webp", "sauce_cheese": "assets/images/111_sauce-cheese_9a6715e125.webp", "sauce_satay": "assets/images/112_sauce-satay_d73eca6f1e.webp", "sauce_mayo": "assets/images/113_sauce-mayo_a8a9edf237.webp", "sauce_honey_mustard": "assets/images/114_sauce-honey-mustard_586bc95cc5.webp", "sauce_bbq": "assets/images/115_sauce-bbq_bbede88550.webp", "skewer_holo": "assets/images/100_skewer-sausage_0d6c41b67e.webp", "skewer_beef_enoki": "assets/images/098_skewer-beef_613e29801f.webp", "skewer_corn": "assets/images/105_skewer-okra_8f1ce09e6b.webp", "skewer_cheese_sausage": "assets/images/100_skewer-sausage_0d6c41b67e.webp", "skewer_bacon_okra": "assets/images/105_skewer-okra_8f1ce09e6b.webp"});

    const CAREER_ITEM_STORY_UNLOCKS = {
      boba: {
        cup_m:{stage:0,level:1}, tea_black:{stage:0,level:1}, tea_strawberry:{stage:0,level:1},
        topping_boba:{stage:0,level:1}, topping_pudding:{stage:0,level:1}, topping_jelly:{stage:0,level:1}, topping_white_boba:{stage:0,level:1},
        cup_l:{stage:1,level:3}, tea_green:{stage:1,level:3}, topping_aloe:{stage:1,level:3},
        tea_taro:{stage:2,level:6}, topping_redbean:{stage:2,level:6},
        milk_fresh:{stage:3,level:10}, tea_honey:{stage:3,level:10}, topping_cheese_foam:{stage:3,level:10},
        topping_grass_jelly:{stage:4,level:15}, topping_cookie:{stage:4,level:15},
        cup_xl:{stage:4,level:18}, tea_oolong:{stage:2,level:6}, tea_jasmine:{stage:3,level:10},
        topping_mochi:{stage:4,level:18}, topping_crystal:{stage:3,level:12}, topping_lychee:{stage:2,level:6}
      },
      noodle: {
        bowl_m:{stage:0,level:1}, broth_kimchi:{stage:0,level:1}, broth_mushroom:{stage:0,level:1},
        ntop_beef:{stage:0,level:1}, ntop_fishcake:{stage:0,level:1}, ntop_enoki:{stage:0,level:1},
        bowl_l:{stage:1,level:3}, broth_tomyum:{stage:1,level:3}, ntop_shrimp:{stage:1,level:3}, ntop_squid:{stage:1,level:3},
        broth_mala:{stage:2,level:6}, ntop_cheese:{stage:2,level:6}, ntop_sausage:{stage:2,level:6},
        broth_beef:{stage:3,level:10}, ntop_egg:{stage:3,level:10}, ntop_bokchoy:{stage:3,level:10}, ntop_crabstick:{stage:3,level:10},
        ntop_tofu:{stage:4,level:15}, bowl_xl:{stage:4,level:18}, broth_collagen:{stage:2,level:6}, broth_tonkotsu:{stage:4,level:15}, ntop_nori:{stage:2,level:6}, ntop_meatball:{stage:3,level:10}, ntop_corn:{stage:1,level:3}, broth_herbal:{stage:3,level:10}, ntop_dumpling:{stage:2,level:6}, ntop_porkbelly:{stage:4,level:15}
      },
      streetfood: {
        tray_plate:{stage:0,level:1}, tray_basket:{stage:0,level:1},
        skewer_fish:{stage:0,level:1}, skewer_holo:{stage:0,level:1}, skewer_beef:{stage:0,level:1},
        sauce_sweet_chili:{stage:0,level:1}, sauce_tamarind:{stage:0,level:1},
        skewer_chicken:{stage:1,level:3}, skewer_tofu:{stage:1,level:3}, skewer_corn:{stage:1,level:3}, sauce_satay:{stage:1,level:3},
        skewer_shrimp:{stage:2,level:6}, skewer_crabstick:{stage:2,level:6}, sauce_butter_garlic:{stage:2,level:6},
        skewer_sausage:{stage:3,level:10}, skewer_cheese_sausage:{stage:3,level:10}, sauce_cheese:{stage:3,level:10},
        skewer_beef_enoki:{stage:4,level:15}, skewer_okra:{stage:4,level:15}, skewer_quail:{stage:4,level:15}, tray_box:{stage:3,level:12}, skewer_mushroom:{stage:2,level:6}, skewer_bacon_okra:{stage:4,level:15}, skewer_squid:{stage:3,level:10}, sauce_mayo:{stage:1,level:3}, sauce_honey_mustard:{stage:3,level:10}, sauce_bbq:{stage:4,level:15}
      }
    };

    const V8743_NPC_LOCK_ITEMS={syrup_rainbow:'chiHa',broth_signature_satay:'anhKhai',sauce_festival:'chiDiem'};
    const V8743_NPC_NAMES={chiHa:'Chị Hạ',anhKhai:'Anh Khải',chiDiem:'Chị Diễm'};
    Object.assign(CAREER_ITEM_STORY_UNLOCKS.boba,{
      tea_matcha:{stage:1,level:3},topping_peach:{stage:1,level:3},topping_brown_boba:{stage:2,level:6},topping_salted_cream:{stage:3,level:10},syrup_rainbow:{stage:4,level:15}
    });
    Object.assign(CAREER_ITEM_STORY_UNLOCKS.noodle,{
      ntop_oyster_mushroom:{stage:1,level:3},ntop_beef_roll:{stage:2,level:6},ntop_cheese_ball:{stage:2,level:6},broth_lemongrass_coconut:{stage:3,level:10},broth_signature_satay:{stage:4,level:15}
    });
    Object.assign(CAREER_ITEM_STORY_UNLOCKS.streetfood,{
      skewer_pineapple:{stage:1,level:3},skewer_cheese_stick:{stage:2,level:6},sauce_five_spice:{stage:3,level:10},skewer_pork_pineapple:{stage:4,level:15},sauce_festival:{stage:4,level:15}
    });
    const V8743_NEW_INGREDIENTS=new Set(['tea_matcha','topping_peach','topping_brown_boba','topping_salted_cream','syrup_rainbow','ntop_oyster_mushroom','ntop_beef_roll','ntop_cheese_ball','broth_lemongrass_coconut','broth_signature_satay','skewer_pineapple','skewer_cheese_stick','sauce_five_spice','skewer_pork_pineapple','sauce_festival']);
    function v8743IngredientRecipeReady(key,career){
      if(!V8743_NEW_INGREDIENTS.has(key))return true;
      const lv=Number(gameState.level)||1,stage=Number(gameState.shopStage)||0;
      return (RECIPE_BOOK[career]||[]).some(r=>lv>=(r.reqLevel||1)&&stage>=(r.reqStage||0)&&v8743RecipeReady(r)&&getRecipeIngredientKeys(career,r.order).includes(key));
    }
    const V8743_FARM_LEVELS={seed_wheat:1,seed_tea:3,seed_strawberry:6,seed_chili:10,seed_corn:18,seed_taro:28,crop_wheat:1,crop_tea:3,crop_strawberry:6,crop_chili:10,crop_corn:18,crop_taro:28,egg:2,milk:6,duck_egg:14,goat_milk:24,honey:40};
    function v8743NpcRequirementMet(itemKey){
      const npc=V8743_NPC_LOCK_ITEMS[itemKey];
      return !npc || !!gameState.v874NpcRewards?.[npc];
    }
    function v8743ItemRequirementLabel(key,career=gameState.currentCareer){
      const owner=getItemOwnerCareer(key);
      if(owner&&owner!==career)return 'Chỉ dành cho nghề khác';
      const rule=getItemStoryRule(key,career);
      const parts=[];
      if(rule){if((Number(gameState.level)||1)<rule.level)parts.push(`Lv.${rule.level}`);
        if((Number(gameState.shopStage)||0)<rule.stage)parts.push(`Chương ${rule.stage+1}`);}
      if((V8743_FARM_LEVELS[key]||0)>(Number(gameState.level)||1))parts.push(`Lv.${V8743_FARM_LEVELS[key]}`);
      if(!v8743IngredientRecipeReady(key,career))parts.push('Học công thức sử dụng nguyên liệu này');
      if(!v8743NpcRequirementMet(key))parts.push(`Hoàn thành truyện ${V8743_NPC_NAMES[V8743_NPC_LOCK_ITEMS[key]]}`);
      return parts.join(' • ') || 'Đã mở';
    }

    function getItemStoryRule(itemKey, career = gameState.currentCareer) {
      return (CAREER_ITEM_STORY_UNLOCKS[career] || {})[itemKey] || null;
    }

    function getItemOwnerCareer(itemKey) {
      for (const [career, group] of Object.entries(CAREER_ITEM_STORY_UNLOCKS)) {
        if (group[itemKey]) return career;
      }
      return null;
    }

    function isItemRelevantToCareer(itemKey, career = gameState.currentCareer) {
      const owner = getItemOwnerCareer(itemKey);
      return !owner || owner === career;
    }

    function isItemStoryUnlocked(itemKey, career = gameState.currentCareer) {
      if(itemKey === 'crop_sim') return false; // Only found by harvesting in Đồi Sim

      const owner = getItemOwnerCareer(itemKey);
      if (owner && owner !== career) return false;
      const rule = getItemStoryRule(itemKey, career);
      if ((V8743_FARM_LEVELS[itemKey]||0)>(Number(gameState.level)||1)) return false;
      if (!rule) return v8743NpcRequirementMet(itemKey);
      return (Number(gameState.shopStage) || 0) >= rule.stage &&
             (Number(gameState.level) || 1) >= rule.level && v8743NpcRequirementMet(itemKey) && v8743IngredientRecipeReady(itemKey,career);
    }

    function getStoryUnlockLabel(itemKey, career = gameState.currentCareer) {
      const rule = getItemStoryRule(itemKey, career);
      if (!rule) return '';
      return `Chương ${rule.stage + 1} • Lv.${rule.level}`;
    }

    function getUnlockedItemKeys(keys, career = gameState.currentCareer) {
      return (keys || []).filter(key => isItemStoryUnlocked(key, career));
    }

    function getStoryChapterIngredientSummary(stage, career = gameState.currentCareer) {
      const group = CAREER_ITEM_STORY_UNLOCKS[career] || {};
      const keys = Object.keys(group).filter(key => group[key].stage === stage);
      return keys.map(key => {
        const item = ITEM_DICTIONARY[key] || {};
        return `${item.icon || '📦'} ${item.name || key}`;
      }).join(' • ');
    }

    const RECIPE_BOOK = {
      boba: [
        { id:'boba_classic', name:'Trà Sữa Trân Châu Nhà Làm', reqLevel:1, reqStage:0, order:{ container:'cup_m', base:'tea_black', sugar:70, ice:50, toppings:['topping_boba'], requiresShaken:true } },
        { id:'boba_strawberry_pudding', name:'Dâu Pudding Mùa Hè', reqLevel:1, reqStage:0, order:{ container:'cup_m', base:'tea_strawberry', sugar:70, ice:50, toppings:['topping_pudding','topping_jelly'], requiresShaken:true } },
        { id:'boba_green_aloe', name:'Lục Trà Nha Đam', reqLevel:3, reqStage:1, order:{ container:'cup_l', base:'tea_green', sugar:30, ice:50, toppings:['topping_aloe'], requiresShaken:true } },
        { id:'boba_taro_redbean', name:'Khoai Môn Đậu Đỏ', reqLevel:6, reqStage:2, order:{ container:'cup_l', base:'tea_taro', sugar:70, ice:50, toppings:['topping_redbean','topping_pudding'], requiresShaken:true } },
        { id:'boba_milk_foam', name:'Sữa Tươi Foam Phô Mai', reqLevel:10, reqStage:3, order:{ container:'cup_l', base:'milk_fresh', sugar:70, ice:50, toppings:['topping_boba','topping_cheese_foam'], requiresShaken:true } },
        { id:'boba_grass_cookie', name:'Trà Đen Sương Sáo Bánh Quy', reqLevel:15, reqStage:4, order:{ container:'cup_l', base:'tea_black', sugar:30, ice:50, toppings:['topping_grass_jelly','topping_cookie'], requiresShaken:true } },
        { id:'v39_boba_strawberry_pearls', name:'Dâu Trân Trắng Hồng', reqLevel:3, reqStage:1, order:{ container:'cup_l', base:'tea_strawberry', sugar:70, ice:50, toppings:['topping_white_boba','topping_pudding'], requiresShaken:true } },
        { id:'v39_boba_oolong_lychee', name:'Ô Long Thạch Vải', reqLevel:6, reqStage:2, order:{ container:'cup_l', base:'tea_oolong', sugar:30, ice:50, toppings:['topping_lychee','topping_aloe'], requiresShaken:true } },
        { id:'v39_boba_jasmine_crystal', name:'Trà Nhài Pha Lê', reqLevel:12, reqStage:3, order:{ container:'cup_l', base:'tea_jasmine', sugar:30, ice:50, toppings:['topping_crystal','topping_white_boba'], requiresShaken:true } },
        { id:'v39_boba_oolong_mochi_xl', name:'Ô Long Mochi XL', reqLevel:18, reqStage:4, order:{ container:'cup_xl', base:'tea_oolong', sugar:70, ice:50, toppings:['topping_mochi','topping_boba'], requiresShaken:true } },
        { id:'v39_boba_signature', name:'Thỏ Ngọc Huyền Thoại', reqLevel:20, reqStage:5, order:{ container:'cup_xl', base:'tea_jasmine', sugar:30, ice:50, toppings:['topping_crystal','topping_mochi','topping_lychee'], requiresShaken:true } }
      ],
      noodle: [
        { id:'noodle_kimchi_beef', name:'Mì Kim Chi Bò Mỹ', reqLevel:1, reqStage:0, order:{ container:'bowl_m', base:'broth_kimchi', spicyLevel:2, toppings:['ntop_beef'], requiresCooked:true } },
        { id:'noodle_mushroom_fishcake', name:'Mì Nấm Chả Cá', reqLevel:1, reqStage:0, order:{ container:'bowl_m', base:'broth_mushroom', spicyLevel:1, toppings:['ntop_fishcake','ntop_enoki'], requiresCooked:true } },
        { id:'noodle_tomyum_seafood', name:'Tom Yum Hải Sản', reqLevel:3, reqStage:1, order:{ container:'bowl_l', base:'broth_tomyum', spicyLevel:3, toppings:['ntop_shrimp','ntop_squid'], requiresCooked:true } },
        { id:'noodle_mala_cheese', name:'Mala Phô Mai Xúc Xích', reqLevel:6, reqStage:2, order:{ container:'bowl_l', base:'broth_mala', spicyLevel:5, toppings:['ntop_cheese','ntop_sausage'], requiresCooked:true } },
        { id:'noodle_beef_deluxe', name:'Bò Sa Tế Đặc Biệt', reqLevel:10, reqStage:3, order:{ container:'bowl_l', base:'broth_beef', spicyLevel:4, toppings:['ntop_beef','ntop_egg','ntop_bokchoy'], requiresCooked:true } },
        { id:'noodle_veggie_tofu', name:'Nấm Đậu Hũ Thanh Vị', reqLevel:15, reqStage:4, order:{ container:'bowl_l', base:'broth_mushroom', spicyLevel:1, toppings:['ntop_tofu','ntop_bokchoy','ntop_enoki'], requiresCooked:true } },
        { id:'v39_noodle_corn_kimchi', name:'Mì Kim Chi Bắp Ngọt', reqLevel:3, reqStage:1, order:{ container:'bowl_l', base:'broth_kimchi', spicyLevel:2, toppings:['ntop_corn','ntop_fishcake'], requiresCooked:true } },
        { id:'v39_noodle_collagen_dumpling', name:'Lẩu Collagen Há Cảo', reqLevel:6, reqStage:2, order:{ container:'bowl_l', base:'broth_collagen', spicyLevel:1, toppings:['ntop_dumpling','ntop_nori'], requiresCooked:true } },
        { id:'v39_noodle_herbal_meatball', name:'Lẩu Thảo Mộc Thịt Viên', reqLevel:10, reqStage:3, order:{ container:'bowl_l', base:'broth_herbal', spicyLevel:1, toppings:['ntop_meatball','ntop_bokchoy'], requiresCooked:true } },
        { id:'v39_noodle_tonkotsu_xl', name:'Thố Xương Hầm XL', reqLevel:18, reqStage:4, order:{ container:'bowl_xl', base:'broth_tonkotsu', spicyLevel:2, toppings:['ntop_porkbelly','ntop_dumpling','ntop_nori'], requiresCooked:true } },
        { id:'v39_noodle_signature', name:'Lẩu Làng Phố Huyện', reqLevel:20, reqStage:5, order:{ container:'bowl_xl', base:'broth_herbal', spicyLevel:3, toppings:['ntop_meatball','ntop_dumpling','ntop_porkbelly'], requiresCooked:true } }
      ],
      streetfood: [
        { id:'street_fish_classic', name:'Cá Viên Chợ Chiều', reqLevel:1, reqStage:0, order:{ tray:'plate', sauce:'sauce_sweet_chili', skewerCounts:{skewer_fish:2}, requiredFryState:'perfect' } },
        { id:'street_holo_beef', name:'Mẹt Hồ Lô Bò Viên', reqLevel:1, reqStage:0, order:{ tray:'basket', sauce:'sauce_tamarind', skewerCounts:{skewer_holo:2,skewer_beef:1}, requiredFryState:'perfect' } },
        { id:'street_chicken_satay', name:'Gà Xiên Sa Tế', reqLevel:3, reqStage:1, order:{ tray:'plate', sauce:'sauce_satay', skewerCounts:{skewer_chicken:3}, requiredFryState:'perfect' } },
        { id:'street_seafood', name:'Mẹt Hải Sản Ven Chợ', reqLevel:6, reqStage:2, order:{ tray:'basket', sauce:'sauce_butter_garlic', skewerCounts:{skewer_shrimp:2,skewer_crabstick:2}, requiredFryState:'perfect' } },
        { id:'street_cheese_combo', name:'Combo Xúc Xích Phô Mai', reqLevel:10, reqStage:3, order:{ tray:'basket', sauce:'sauce_cheese', skewerCounts:{skewer_cheese_sausage:2,skewer_sausage:2}, requiredFryState:'perfect' } },
        { id:'street_village_special', name:'Mẹt Đặc Sản Đầu Làng', reqLevel:15, reqStage:4, order:{ tray:'basket', sauce:'sauce_satay', skewerCounts:{skewer_beef_enoki:2,skewer_okra:2,skewer_quail:2}, requiredFryState:'perfect' } },
        { id:'v39_street_chicken_mayo', name:'Gà Xiên Mayo Cay', reqLevel:3, reqStage:1, order:{ tray:'plate', sauce:'sauce_mayo', skewerCounts:{skewer_chicken:2,skewer_holo:1}, requiredFryState:'perfect' } },
        { id:'v39_street_mushroom_combo', name:'Xiên Nấm Hội Làng', reqLevel:6, reqStage:2, order:{ tray:'basket', sauce:'sauce_satay', skewerCounts:{skewer_mushroom:2,skewer_tofu:2}, requiredFryState:'perfect' } },
        { id:'v39_street_squid_box', name:'Hộp Mực Xiên Cay', reqLevel:12, reqStage:3, order:{ tray:'box', sauce:'sauce_mayo', skewerCounts:{skewer_squid:2,skewer_crabstick:1}, requiredFryState:'perfect' } },
        { id:'v39_street_bbq_okra', name:'Mẹt Đậu Bắp BBQ', reqLevel:15, reqStage:4, order:{ tray:'basket', sauce:'sauce_bbq', skewerCounts:{skewer_bacon_okra:2,skewer_beef:2}, requiredFryState:'perfect' } },
        { id:'v39_street_signature', name:'Hộp Lộc Hội Làng', reqLevel:20, reqStage:5, order:{ tray:'box', sauce:'sauce_honey_mustard', skewerCounts:{skewer_squid:2,skewer_cheese_sausage:2}, requiredFryState:'perfect' } }
      ]
    };

    // V87.4.3: 12 presets that really use ingredients in the cooking minigame.
    RECIPE_BOOK.boba.push(
      {id:'v8743_boba_peach_matcha',name:'Matcha Thạch Đào',reqLevel:3,reqStage:1,order:{container:'cup_l',base:'tea_matcha',sugar:30,ice:50,toppings:['topping_peach'],requiresShaken:true}},
      {id:'v8743_boba_brown_sugar',name:'Đường Đen Hoàng Hôn',reqLevel:6,reqStage:2,v8743Discover:true,order:{container:'cup_l',base:'tea_black',sugar:70,ice:50,toppings:['topping_brown_boba','topping_pudding'],requiresShaken:true}},
      {id:'v8743_boba_salt_cloud',name:'Mây Muối Matcha',reqLevel:10,reqStage:3,order:{container:'cup_l',base:'tea_matcha',sugar:30,ice:50,toppings:['topping_salted_cream'],requiresShaken:true}},
      {id:'v8743_boba_rainbow',name:'Cầu Vồng Chị Hạ',reqLevel:15,reqStage:4,v8743Npc:'chiHa',order:{container:'cup_l',base:'tea_strawberry',sugar:70,ice:50,toppings:['syrup_rainbow','topping_peach'],requiresShaken:true}}
    );
    RECIPE_BOOK.noodle.push(
      {id:'v8743_noodle_oyster',name:'Mì Nấm Bào Ngư',reqLevel:3,reqStage:1,order:{container:'bowl_l',base:'broth_mushroom',spicyLevel:1,toppings:['ntop_oyster_mushroom','ntop_fishcake'],requiresCooked:true}},
      {id:'v8743_noodle_beef_roll',name:'Mì Bò Cuộn Phô Mai',reqLevel:6,reqStage:2,v8743Discover:true,order:{container:'bowl_l',base:'broth_kimchi',spicyLevel:2,toppings:['ntop_beef_roll','ntop_cheese_ball'],requiresCooked:true}},
      {id:'v8743_noodle_coconut',name:'Lẩu Sả Dừa Dịu Cay',reqLevel:10,reqStage:3,order:{container:'bowl_l',base:'broth_lemongrass_coconut',spicyLevel:2,toppings:['ntop_oyster_mushroom','ntop_shrimp'],requiresCooked:true}},
      {id:'v8743_noodle_secret',name:'Mì Sa Tế Nhà Khải',reqLevel:15,reqStage:4,v8743Npc:'anhKhai',order:{container:'bowl_l',base:'broth_signature_satay',spicyLevel:4,toppings:['ntop_beef_roll','ntop_cheese_ball'],requiresCooked:true}}
    );
    RECIPE_BOOK.streetfood.push(
      {id:'v8743_street_pineapple',name:'Xiên Dứa Sa Tế',reqLevel:3,reqStage:1,order:{tray:'plate',sauce:'sauce_satay',skewerCounts:{skewer_pineapple:2,skewer_fish:1},requiredFryState:'perfect'}},
      {id:'v8743_street_cheese',name:'Mẹt Phô Mai Giòn',reqLevel:6,reqStage:2,v8743Discover:true,order:{tray:'basket',sauce:'sauce_cheese',skewerCounts:{skewer_cheese_stick:2,skewer_holo:1},requiredFryState:'perfect'}},
      {id:'v8743_street_five_spice',name:'Xiên Ngũ Vị Cuộn Dứa',reqLevel:15,reqStage:4,order:{tray:'basket',sauce:'sauce_five_spice',skewerCounts:{skewer_pork_pineapple:2,skewer_cheese_stick:1},requiredFryState:'perfect'}},
      {id:'v8743_street_festival',name:'Đại Tiệc Hội Làng',reqLevel:15,reqStage:4,v8743Npc:'chiDiem',order:{tray:'basket',sauce:'sauce_festival',skewerCounts:{skewer_pork_pineapple:2,skewer_pineapple:2},requiredFryState:'perfect'}}
    );

    const CAREER_WORKBENCH_KEYS = {
      boba: {
        containers:['cup_m','cup_l','cup_xl'],
        bases:['tea_black','tea_green','tea_strawberry','tea_taro','milk_fresh','tea_honey','tea_oolong','tea_jasmine','tea_matcha'],
        toppings:['topping_boba','topping_pudding','topping_jelly','topping_white_boba','topping_aloe','topping_redbean','topping_cheese_foam','topping_grass_jelly','topping_cookie','topping_crystal','topping_mochi','topping_lychee','topping_peach','topping_brown_boba','topping_salted_cream','syrup_rainbow']
      },
      noodle: {
        containers:['bowl_m','bowl_l','bowl_xl'],
        bases:['broth_kimchi','broth_mushroom','broth_tomyum','broth_mala','broth_beef','broth_collagen','broth_herbal','broth_tonkotsu','broth_lemongrass_coconut','broth_signature_satay'],
        toppings:['ntop_beef','ntop_fishcake','ntop_enoki','ntop_shrimp','ntop_squid','ntop_cheese','ntop_sausage','ntop_egg','ntop_bokchoy','ntop_tofu','ntop_corn','ntop_dumpling','ntop_nori','ntop_meatball','ntop_porkbelly','ntop_oyster_mushroom','ntop_beef_roll','ntop_cheese_ball']
      },
      streetfood: {
        containers:['tray_plate','tray_basket','tray_box'],
        toppings:['skewer_fish','skewer_holo','skewer_beef','skewer_chicken','skewer_shrimp','skewer_crabstick','skewer_cheese_sausage','skewer_sausage','skewer_beef_enoki','skewer_okra','skewer_quail','skewer_mushroom','skewer_tofu','skewer_squid','skewer_bacon_okra','skewer_pineapple','skewer_cheese_stick','skewer_pork_pineapple'],
        sauces:['sauce_sweet_chili','sauce_tamarind','sauce_satay','sauce_butter_garlic','sauce_cheese','sauce_mayo','sauce_bbq','sauce_honey_mustard','sauce_five_spice','sauce_festival']
      }
    };

    const STORY_CHAPTERS = [
      { id:'homecoming', icon:'🛖', title:'Chương 1 • Ngày Trở Về', reqLevel:1, reqStage:0, story:'Bạn dựng quầy đầu tiên và làm quen lại với người trong làng.', unlock:'Công thức cơ bản • khách quen đầu ngõ' },
      { id:'market_whispers', icon:'🧺', title:'Chương 2 • Tin Đồn Đầu Chợ', reqLevel:3, reqStage:1, story:'Quán có mái che, lời khen bắt đầu truyền từ chợ sáng sang xóm trọ.', unlock:'Công thức bậc 2 • nguyên liệu mới • NPC chợ' },
      { id:'festival', icon:'🎏', title:'Chương 3 • Hội Làng Gọi Tên', reqLevel:6, reqStage:2, story:'Bạn nhận lời bán trong hội làng và bắt đầu gặp những khách từ nơi khác tới.', unlock:'Công thức bậc 3 • khách sự kiện • topping mới' },
      { id:'district_guests', icon:'🚌', title:'Chương 4 • Khách Huyện Tìm Đến', reqLevel:10, reqStage:3, story:'Danh tiếng vượt khỏi con đường làng. Những vị khách kỹ tính bắt đầu ghé thử.', unlock:'Công thức premium • NPC chuyên môn' },
      { id:'chef_visit', icon:'👩‍🍳', title:'Chương 5 • Bếp Trưởng Ghé Thăm', reqLevel:15, reqStage:4, story:'Một bếp trưởng huyện tới thử món. Đây là lúc quán cần một món signature thật sự.', unlock:'Công thức signature • khách VIP hiếm' },
      { id:'district_brand', icon:'🏬', title:'Chương 6 • Ra Phố Huyện', reqLevel:20, reqStage:5, story:'Quán không còn chỉ phục vụ dân làng. Bạn bắt đầu xây một thương hiệu có tên tuổi.', unlock:'Công thức cao cấp • NPC thương gia & truyền thông' }
    ];

    function getRecipeIngredientKeys(career, order = {}) {
      if (career === 'streetfood') {
        const trayKey = {plate:'tray_plate', basket:'tray_basket', box:'tray_box'}[order.tray];
        return [trayKey, order.sauce, ...Object.keys(order.skewerCounts || {})].filter(Boolean);
      }
      return [order.container, order.base, ...(order.toppings || [])].filter(Boolean);
    }

    function getUnlockedRecipes(career) {
      const pool = RECIPE_BOOK[career] || [];
      const lv = Number(gameState.level) || 1;
      const stage = Number(gameState.shopStage) || 0;
      return pool.filter(r => lv >= (r.reqLevel || 1) && stage >= (r.reqStage || 0)
        && v8743RecipeReady(r)
        && getRecipeIngredientKeys(career, r.order).every(k => !!ITEM_DICTIONARY[k] && isItemStoryUnlocked(k, career)));
    }

    function buildRecipeOrder(recipe, customer) {
      const order = JSON.parse(JSON.stringify(recipe.order || {}));
      order.career = gameState.currentCareer;
      order.recipeId = recipe.id;
      order.recipeName = recipe.name;
      order.maxPrice = customer.budget;
      return order;
    }

    function isNpcUnlocked(npc) {
      if (!npc) return false;
      const lv = Number(gameState.level) || 1;
      const stage = Number(gameState.shopStage) || 0;
      return lv >= (Number(npc.reqLevel) || 1) && stage >= (Number(npc.reqStage) || 0);
    }

    const STORY_STAGE_REWARD_ITEMS = {
      1: {
        boba:[['cup_l',6],['tea_green',5],['topping_aloe',5]],
        noodle:[['bowl_l',5],['broth_tomyum',4],['ntop_shrimp',4],['ntop_squid',4]],
        streetfood:[['skewer_chicken',6],['skewer_tofu',5],['skewer_corn',5],['sauce_satay',4]]
      },
      2: {
        boba:[['tea_taro',5],['topping_redbean',5]],
        noodle:[['broth_mala',5],['ntop_cheese',5],['ntop_sausage',5]],
        streetfood:[['skewer_shrimp',6],['skewer_crabstick',6],['sauce_butter_garlic',4]]
      },
      3: {
        boba:[['milk_fresh',5],['tea_honey',4],['topping_cheese_foam',5]],
        noodle:[['broth_beef',5],['ntop_egg',5],['ntop_bokchoy',5],['ntop_crabstick',5]],
        streetfood:[['skewer_sausage',6],['skewer_cheese_sausage',6],['sauce_cheese',4]]
      },
      4: {
        boba:[['topping_grass_jelly',6],['topping_cookie',6]],
        noodle:[['ntop_tofu',6]],
        streetfood:[['skewer_beef_enoki',6],['skewer_okra',6],['skewer_quail',6]]
      },
      5: {
        boba:[['tea_black',3],['topping_boba',4]],
        noodle:[['broth_kimchi',3],['ntop_beef',4]],
        streetfood:[['skewer_fish',5],['sauce_sweet_chili',4]]
      }
    };

    function grantStoryUnlockPack(stage) {
      const career = gameState.currentCareer;
      const pack = (STORY_STAGE_REWARD_ITEMS[stage] || {})[career] || [];
      if (!pack.length) return;
      pack.forEach(([key, qty]) => {
        gameState.inventory[key] = (gameState.inventory[key] || 0) + qty;
      });
      const names = pack.map(([key, qty]) => `+${qty} ${itemLabel(key)}`).join(' • ');
      pushGameNotification(`Mở khóa nguyên liệu mới`, names, '📖', 'story');
    }

    const NPC_VISIT_AFFINITY = {
      linh:{ careers:['boba'], events:['salary_day'] }, na:{ careers:['boba'], events:['village_festival'] },
      tuan:{ careers:['noodle'], events:['salary_day'] }, nam_farmer:{ careers:['streetfood'], events:['harvest_season'] },
      huong_food:{ careers:['boba','noodle','streetfood'], events:['food_fair','viral_clip'] },
      yuki:{ careers:['streetfood','noodle'], events:['tour_bus','village_festival'] }, tom_travel:{ careers:['streetfood'], events:['tour_bus'] },
      ngoc_idol:{ careers:['boba'], events:['village_festival','viral_clip'] }, chi_bep:{ careers:['noodle','streetfood'], events:['food_fair'] },
      khai_si:{ careers:['streetfood'], events:['harvest_season'] }, loan_cho:{ careers:['streetfood'], events:['harvest_season'] },
      khoa_ship:{ careers:['boba'], events:['heavy_rain','road_repair'] }, ong_bay:{ careers:['noodle'], events:['heavy_rain'] },
      tram_hoa:{ careers:['boba'], events:['village_festival','harvest_season'] },
      vinh_buudien:{ careers:['streetfood','boba'], events:['road_repair','salary_day'] },
      bich_homestay:{ careers:['boba','streetfood'], events:['tour_bus','village_festival'] },
      huy_kientruc:{ careers:['boba'], events:['viral_clip'] },
      co_lien_ncc:{ careers:['noodle','streetfood'], events:['harvest_season'] },
      chef_quang:{ careers:['noodle','streetfood'], events:['food_fair'] },
      ken_dukhach:{ careers:['boba'], events:['tour_bus','viral_clip'] },
      ong_chutich:{ careers:['boba','noodle','streetfood'], events:['village_festival','salary_day'] }
    };

    const SOUVENIR_RARITY = {
      green:  { label: 'Xanh • Phổ Biến', icon: '🟢', color: '#34d399', bg: 'rgba(16,185,129,.10)' },
      blue:   { label: 'Xanh Dương • Hiếm', icon: '🔵', color: '#60a5fa', bg: 'rgba(59,130,246,.10)' },
      purple: { label: 'Tím • Sử Thi', icon: '🟣', color: '#c084fc', bg: 'rgba(168,85,247,.10)' },
      red:    { label: 'Đỏ • Huyền Thoại', icon: '🔴', color: '#fb7185', bg: 'rgba(244,63,94,.10)' },
      gold:   { label: 'Vàng • Di Sản', icon: '🟡', color: '#fbbf24', bg: 'rgba(245,158,11,.12)' }
    };

    const SOUVENIR_CONFIG = {
      seed_badge:       { name: 'Huy Hiệu Mầm Non', icon: '🌱', rarity: 'green', desc: 'Huy hiệu nhỏ dành cho những ngày đầu khởi nghiệp.' },
      old_market_ticket:{ name: 'Vé Chợ Phiên Cũ', icon: '🎫', rarity: 'green', desc: 'Một tấm vé giấy đã ngả màu của chợ làng.' },
      cow_bell:         { name: 'Chuông Bò Mini', icon: '🔔', rarity: 'green', desc: 'Chiếc chuông tí hon leng keng từ trang trại.' },
      clay_cup:         { name: 'Ly Đất Nung', icon: '🏺', rarity: 'green', desc: 'Món quà thủ công giản dị, mỗi chiếc hơi khác nhau.' },
      blue_bowl:        { name: 'Chén Men Lam', icon: '🥣', rarity: 'blue', desc: 'Chén men xanh vẽ tay, ít gặp ở chợ phiên.' },
      shipper_bike:     { name: 'Xe Shipper Mini', icon: '🚲', rarity: 'blue', desc: 'Mô hình xe giao hàng phiên bản làng quê.' },
      milk_bottle:      { name: 'Bình Sữa Cổ', icon: '🍼', rarity: 'blue', desc: 'Bình thủy tinh có dấu xưởng sữa cũ.' },
      rain_charm:       { name: 'Bùa Mưa Thuận Gió Hòa', icon: '☔', rarity: 'blue', desc: 'Món treo nhỏ được dân chợ truyền tay nhau.' },
      crystal_boba:     { name: 'Ly Trà Sữa Pha Lê', icon: '🧋', rarity: 'purple', desc: 'Mô hình pha lê tím lấp lánh, bản sưu tầm.' },
      purple_stove:     { name: 'Bếp Than Tím', icon: '🔥', rarity: 'purple', desc: 'Mô hình bếp than nhuộm men tím hiếm.' },
      festival_mask:    { name: 'Mặt Nạ Hội Làng', icon: '🎭', rarity: 'purple', desc: 'Chỉ được làm trong mùa lễ hội lớn.' },
      red_lucky_cat:    { name: 'Mèo Thần Tài Đỏ', icon: '🐱', rarity: 'red', desc: 'Phiên bản đỏ đặc biệt không bán trong cửa hàng.' },
      chef_medal:       { name: 'Huy Chương Bếp Trưởng', icon: '🏅', rarity: 'red', desc: 'Dấu mốc của những chủ quán cực kỳ kiên trì.' },
      lottery_red_stamp:{ name: 'Tem Vé Số Đỏ', icon: '🧧', rarity: 'red', desc: 'Dấu lưu niệm chỉ có thể rơi từ vé số giải lớn.' },
      founder_coin:     { name: 'Đồng Xu Khởi Nghiệp Vàng', icon: '🪙', rarity: 'gold', desc: 'Đồng xu kỷ niệm cực hiếm khắc ngày mở quán.' },
      golden_restaurant:{ name: 'Nhà Hàng Vàng Mini', icon: '🏨', rarity: 'gold', desc: 'Mô hình mạ vàng tượng trưng cho giấc mơ lớn.' },
      lottery_gold_ticket:{ name: 'Vé Độc Đắc Mạ Vàng', icon: '🎟️', rarity: 'gold', desc: 'Chỉ xuất hiện khi chạm giải độc đắc 1.000 Xu.' },

      // Lưu niệm có hiệu ứng cho Vườn / Chuồng. Hiệu ứng chỉ tính 1 lần dù sở hữu bản trùng.
      farm_watering_can: { name: 'Bình Tưới Đồng Cũ', icon: '🚿', rarity: 'green', desc: 'Bình tưới của một nhà vườn lâu năm.', effect: '+5% tốc độ cây trồng.', bonus: { farmGrowthPct: .05 } },
      farm_scarecrow: { name: 'Bù Nhìn Áo Chàm', icon: '🧥', rarity: 'blue', desc: 'Bù nhìn thủ công giúp mùa vụ ổn định hơn.', effect: '+1 nông sản mỗi lần thu hoạch.', bonus: { farmYield: 1 } },
      farm_seed_pouch: { name: 'Túi Hạt Tím Kỳ Lạ', icon: '🪻', rarity: 'purple', desc: 'Một túi hạt giống được thêu ký hiệu cổ.', effect: '18% cơ hội gieo hạt mà không mất hạt giống.', bonus: { seedSavePct: .18 } },
      farm_red_sickle: { name: 'Liềm Thu Hoạch Đỏ', icon: '🪓', rarity: 'red', desc: 'Dụng cụ truyền đời của một gia đình làm ruộng.', effect: '+12% tốc độ cây và +1 nông sản.', bonus: { farmGrowthPct: .12, farmYield: 1 } },
      farm_golden_totem: { name: 'Thần Nông Mạ Vàng', icon: '🌾', rarity: 'gold', desc: 'Tượng nhỏ được xem như báu vật của mùa màng.', effect: '+20% tốc độ cây, +1 nông sản và +12% giữ hạt.', bonus: { farmGrowthPct: .20, farmYield: 1, seedSavePct: .12 } },

      barn_feed_bell: { name: 'Chuông Gọi Ăn', icon: '🛎️', rarity: 'green', desc: 'Tiếng chuông quen thuộc khiến đàn vật nuôi vào nếp.', effect: '+5% tốc độ tạo sản phẩm chuồng.', bonus: { barnGrowthPct: .05 } },
      barn_blue_churn: { name: 'Thùng Sữa Men Lam', icon: '🥛', rarity: 'blue', desc: 'Dụng cụ bảo quản sữa cổ của làng.', effect: '+1 sản phẩm mỗi lần thu hoạch chuồng.', bonus: { barnYield: 1 } },
      barn_purple_rack: { name: 'Máng Cỏ Tím', icon: '🪵', rarity: 'purple', desc: 'Chiếc máng kỳ lạ giúp thức ăn ít hao hơn.', effect: '18% cơ hội chăm/cho ăn mà không tốn thức ăn.', bonus: { feedSavePct: .18 } },
      barn_red_medal: { name: 'Huy Chương Chủ Trại Đỏ', icon: '🎖️', rarity: 'red', desc: 'Huy chương chỉ trao cho những trại có sản lượng cao.', effect: '+12% tốc độ chuồng và +1 sản phẩm.', bonus: { barnGrowthPct: .12, barnYield: 1 } },
      barn_golden_lantern: { name: 'Đèn Chuồng Mạ Vàng', icon: '🏮', rarity: 'gold', desc: 'Đèn cổ quý hiếm luôn sáng ấm trong đêm.', effect: '+20% tốc độ chuồng, +1 sản phẩm và +12% tiết kiệm thức ăn.', bonus: { barnGrowthPct: .20, barnYield: 1, feedSavePct: .12 } },

      // Lưu niệm chỉ có thể gặp khi đi quanh Làng / Phố Huyện
      village_good_deed_badge: { name:'Huy Hiệu Người Tốt Việc Tốt', icon:'🤝', rarity:'blue', desc:'Một huy hiệu nhỏ của tổ dân phố dành cho người hay giúp đỡ.' },
      village_dog_tag: { name:'Vòng Cổ Chó Vàng', icon:'🐕', rarity:'green', desc:'Chiếc thẻ tên cũ được chủ chú chó tặng lại làm kỷ niệm.' },
      village_old_key: { name:'Chìa Khóa Đình Làng', icon:'🗝️', rarity:'purple', desc:'Chìa khóa đồng cũ của kho đạo cụ hội làng, nay chỉ còn giá trị lưu niệm.' },
      village_patrol_whistle: { name:'Còi Tuýt Dân Phòng', icon:'📯', rarity:'purple', desc:'Quà cảm ơn sau một lần hỗ trợ giữ trật tự ở chợ.' },
      village_police_certificate: { name:'Giấy Khen Bắt Cướp', icon:'📜', rarity:'red', desc:'Giấy khen hiếm ghi nhận một lần hỗ trợ bắt kẻ giật đồ.' },
      village_founder_plaque: { name:'Kỷ Niệm Chương Người Làng', icon:'🏅', rarity:'gold', desc:'Kỷ niệm chương cực hiếm dành cho người được cả làng tin quý.' },
      village_red_scarf: { name:'Khăn Quàng Đỏ Cũ', icon:'🧣', rarity:'blue', desc:'Món quà nhỏ từ một sự kiện ở trường làng.' },
      village_scarecrow_pin: { name:'Huy Hiệu Bù Nhìn', icon:'🌾', rarity:'green', desc:'Chiếc huy hiệu vui được tặng sau khi giúp việc ngoài đồng.' },
      village_bus_ticket: { name:'Vé Xe Tuyến Huyện', icon:'🎫', rarity:'blue', desc:'Tấm vé cũ đánh dấu một chuyến đi đầy chuyện lạ.' },
      village_kite_piece: { name:'Mảnh Diều Đồi Sim', icon:'🪁', rarity:'purple', desc:'Mảnh diều có chữ ký của nhóm trẻ trên đồi.' },
      village_night_token: { name:'Xu Chợ Đêm Kỷ Niệm', icon:'🎪', rarity:'red', desc:'Đồng xu đặc biệt chỉ phát trong một đêm hội hiếm.' }
    };

    // V11: một thời tiết chung cho toàn bộ thế giới trong ngày.
    // Quán, Vườn và Chuồng cùng nhìn thấy đúng một điều kiện thời tiết,
    // nhưng mỗi khu chịu tác động khác nhau.
    const DAILY_WORLD_EVENTS = [
      {
        id:'sunny_day', icon:'☀️', title:'Ngày Nắng Đẹp',
        desc:'Trời trong, nắng vừa và đường làng khô ráo.',
        effects:{ arrivalPct:.10, tipPct:.02 },
        farmEffects:{ growthPct:.10, seedSavePct:.03 },
        barnEffects:{ growthPct:.06 },
        shopText:'+10% nhịp khách • +2% tip.',
        farmText:'+10% tốc độ cây • +3% cơ hội giữ hạt.',
        barnText:'+6% tốc độ tạo sản phẩm.'
      },
      {
        id:'light_rain', icon:'🌦️', title:'Mưa Nhẹ',
        desc:'Mưa lất phất cả làng, không khí mát và đất đủ ẩm.',
        effects:{ patienceSec:3, deliveryPct:.05, arrivalPct:-.04 },
        farmEffects:{ growthPct:.07, autoWater:true },
        barnEffects:{ growthPct:.03 },
        shopText:'+3s kiên nhẫn • +5% tiền ship • khách ghé ít hơn nhẹ.',
        farmText:'Mưa tự tưới toàn vườn • +7% tốc độ cây.',
        barnText:'+3% tốc độ tạo sản phẩm.'
      },
      {
        id:'heavy_rain', icon:'🌧️', title:'Mưa Lớn',
        desc:'Mưa nặng hạt khiến đường làng ướt và việc đi lại khó hơn.',
        effects:{ patienceSec:6, deliveryPct:.15, opCost:15, arrivalPct:-.22 },
        farmEffects:{ growthPct:.03, autoWater:true, yield:1 },
        barnEffects:{ growthPct:-.04, feedSavePct:.04 },
        shopText:'+6s kiên nhẫn • +15% tiền ship • +15 Xu vận hành • ít khách trực tiếp.',
        farmText:'Mưa tự tưới • +3% tốc độ • +1 sản lượng khi thu hoạch.',
        barnText:'-4% tốc độ • +4% cơ hội tiết kiệm thức ăn.'
      },
      {
        id:'hot_day', icon:'🌞', title:'Ngày Nắng Nóng',
        desc:'Nhiệt độ tăng cao, người trong làng ưu tiên đồ mát và nghỉ trưa nhiều hơn.',
        effects:{ revenuePct:.04, patienceSec:-2, arrivalPct:.06 },
        farmEffects:{ growthPct:-.05, seedSavePct:.05 },
        barnEffects:{ growthPct:-.05 },
        shopText:'+4% doanh thu • khách kém kiên nhẫn 2s.',
        farmText:'-5% tốc độ cây • +5% cơ hội giữ hạt.',
        barnText:'-5% tốc độ tạo sản phẩm.'
      },
      {
        id:'cold_day', icon:'🥶', title:'Ngày Trở Lạnh',
        desc:'Gió lạnh tràn về, người dân chuộng món nóng và vật nuôi chậm chạp hơn.',
        effects:{ revenuePct:.03, patienceSec:2, arrivalPct:-.03 },
        farmEffects:{ growthPct:-.04 },
        barnEffects:{ growthPct:-.08, feedSavePct:.03 },
        shopText:'+3% doanh thu • +2s kiên nhẫn.',
        farmText:'-4% tốc độ cây.',
        barnText:'-8% tốc độ • +3% cơ hội tiết kiệm thức ăn.'
      },
      {
        id:'cloudy_day', icon:'☁️', title:'Ngày Nhiều Mây',
        desc:'Trời dịu, không mưa lớn và mọi hoạt động diễn ra khá ổn định.',
        effects:{ patienceSec:2 },
        farmEffects:{ growthPct:.03 },
        barnEffects:{ growthPct:.03, feedSavePct:.03 },
        shopText:'+2s kiên nhẫn.',
        farmText:'+3% tốc độ cây.',
        barnText:'+3% tốc độ • +3% tiết kiệm thức ăn.'
      },
      {
        id:'storm_day', icon:'⛈️', title:'Mưa Giông',
        desc:'Gió mạnh và mưa giông ảnh hưởng toàn làng.',
        effects:{ patienceSec:5, deliveryPct:.20, opCost:25, incidentBoost:.08, arrivalPct:-.32 },
        farmEffects:{ growthPct:-.06, autoWater:true },
        barnEffects:{ growthPct:-.10 },
        shopText:'+20% tiền ship • +25 Xu vận hành • khách trực tiếp giảm mạnh.',
        farmText:'Mưa tự tưới nhưng -6% tốc độ do gió mạnh.',
        barnText:'-10% tốc độ tạo sản phẩm.'
      }
    ];

    const SHOP_INCIDENTS = [
      { id:'lost_wallet', icon:'👛', title:'Khách Đánh Rơi Ví', desc:'Bạn nhặt được một chiếc ví ngay cạnh bàn khách.', choices:{
        a:{ label:'Chạy theo trả lại', coins:0, reputation:.08, exp:18, goodDeed:true, text:'Bạn trả lại ví. Tin tốt lan nhanh trong xóm.' },
        b:{ label:'Giữ 45 Xu nhặt được', coins:45, reputation:-.12, exp:0, text:'Bạn có thêm tiền nhưng vài người nhìn thấy chuyện đó.' }
      }},
      { id:'rain_leak', icon:'🌧️', title:'Mái Che Bị Dột', desc:'Một góc quán bắt đầu nhỏ nước đúng lúc trời đổ mưa.', choices:{
        a:{ label:'Sửa ngay (-30 Xu)', coins:-30, reputation:.04, exp:10, nextPatience:3, text:'Mái được vá gọn. Khách thấy quán xử lý chuyên nghiệp.' },
        b:{ label:'Đặt xô hứng tạm', coins:0, reputation:-.04, exp:4, nextPatience:-3, text:'Đỡ tốn tiền nhưng khách kế tiếp sẽ hơi khó chịu.' }
      }},
      { id:'food_blogger', icon:'📸', title:'Food Blogger Ghé Qua', desc:'Một người có khá nhiều người theo dõi xin xem hậu trường quán.', choices:{
        a:{ label:'Mời trải nghiệm (-25 Xu)', coins:-25, reputation:.10, exp:25, text:'Bài đăng tích cực giúp danh tiếng quán tăng rõ.' },
        b:{ label:'Bán như khách thường', coins:15, reputation:0, exp:8, text:'Không bùng nổ truyền thông nhưng bạn vẫn bán được hàng.' }
      }},
      { id:'broken_sign', icon:'🪧', title:'Biển Hiệu Lung Lay', desc:'Gió mạnh làm biển hiệu trước quán sắp rơi.', choices:{
        a:{ label:'Gọi thợ (-35 Xu)', coins:-35, reputation:.03, exp:10, text:'Biển hiệu được gia cố chắc chắn.' },
        b:{ label:'Tự buộc tạm', coins:0, reputation:-.03, exp:5, text:'Tạm ổn nhưng nhìn hơi luộm thuộm.' }
      }},
      { id:'school_group', icon:'🎒', title:'Nhóm Học Sinh Ghé Quán', desc:'Một nhóm nhỏ hỏi xin ưu đãi vì đang gom tiền ăn chung.', choices:{
        a:{ label:'Giảm giá 20 Xu', coins:-20, reputation:.07, exp:15, goodDeed:true, text:'Đám nhỏ vui vẻ hứa sẽ rủ bạn bè quay lại.' },
        b:{ label:'Giữ nguyên giá', coins:10, reputation:-.01, exp:5, text:'Bạn giữ biên lợi nhuận nhưng nhóm khách hơi tiếc.' }
      }},
      { id:'help_elder', icon:'🧺', title:'Giúp Bà Cụ Mang Đồ', desc:'Một bà cụ đứng trước quán loay hoay với hai giỏ đồ nặng.', choices:{
        a:{ label:'Chạy ra giúp một tay', coins:0, reputation:.07, exp:16, goodDeed:true, text:'Bạn giúp bà mang đồ về tận đầu ngõ. Bà cảm ơn rối rít.' },
        b:{ label:'Xin lỗi vì đang bận', coins:0, reputation:-.01, exp:2, text:'Bạn vẫn phải trông quán nên không thể rời đi lúc này.' }
      }},
      { id:'supplier_sample', icon:'📦', title:'Nhà Cung Cấp Gửi Mẫu', desc:'Một kiện mẫu nguyên liệu nhỏ được gửi đến nhờ bạn thử giúp.', choices:{
        a:{ label:'Nhận và thử hàng', coins:0, reputation:0, exp:12, itemKey:'seed_strawberry', qty:2, text:'Bạn nhận 2 Hạt Dâu thử nghiệm miễn phí.' },
        b:{ label:'Từ chối cho chắc', coins:8, reputation:0, exp:3, text:'Bạn nhận khoản hỗ trợ vận chuyển 8 Xu thay vì mẫu hàng.' }
      }}
    ];

    let gameState = {
      hasStarted: false,
      day: 1,
      coins: 450,
      debt: 0,
      level: 1,
      exp: 0,
      sp: 0,
      phase: 'prep',
      currentCareer: 'boba',
      careerLocked: true, // KHÓA NGHỀ CỐ ĐỊNH SUỐT RUN
      shopName: "Trà Sữa Bé Thỏ",
      shopIcon: null,
      shopAvatar: null,
      playerName: "Bạn",
      playerChibi: "male",
      reputation: 5.0,
      ratingCount: 1,
      decorations: [],
      skills: { sales: 0, service: 0, luck: 0 },
      careerTalents: {}, careerServed: {},
      shopStage: 0,
      staff: [],

      // Unified Central Inventory
      inventory: {
        cup_m: 15, cup_l: 10, tea_black: 12, tea_green: 8, topping_boba: 15, topping_pudding: 6, seed_wheat: 4, crop_wheat: 2,
        tray_plate: 15, tray_basket: 10, skewer_fish: 15, skewer_beef: 10,
        bowl_m: 12, bowl_l: 8, broth_kimchi: 10, ntop_beef: 8
      },

      farmPlots: [
        { unlocked: true, seed: null, lastSeed: null, growTimer: 0, watered: false, mortgaged: false },
        { unlocked: true, seed: null, lastSeed: null, growTimer: 0, watered: false, mortgaged: false },
        { unlocked: false, seed: null, lastSeed: null, growTimer: 0, watered: false, mortgaged: false },
        { unlocked: false, seed: null, lastSeed: null, growTimer: 0, watered: false, mortgaged: false },
        { unlocked: false, seed: null, lastSeed: null, growTimer: 0, watered: false, mortgaged: false },
        { unlocked: false, seed: null, lastSeed: null, growTimer: 0, watered: false, mortgaged: false }
      ],

      animals: {
        chicken: { unlocked: false, name: "Đàn Gà Mái", timer: 0, ready: false , affection: 10, careCooldown: 0, autoFed: false },
        cow: { unlocked: false, name: "Bò Sữa Bé Bông", timer: 0, ready: false , affection: 10, careCooldown: 0, autoFed: false },
        duck: { unlocked: false, name: "Đàn Vịt Bầu", timer: 0, ready: false , affection: 10, careCooldown: 0, autoFed: false },
        goat: { unlocked: false, name: "Dê Núi Cà Lem", timer: 0, ready: false , affection: 10, careCooldown: 0, autoFed: false },
        bee: { unlocked: false, name: "Tổ Ong Vườn Hoa", timer: 0, ready: false, affection: 10, careCooldown: 0, autoFed: false },
      },

      mortgagedPlots: 0,
      marketNewsIndex: 0,
      claimedDailyDeal: false,
      dailyDeal: null, // Kèo Thơm Anh Khải được sinh theo biến cố thị trường mỗi ngày
      miniGameDaily: { cardsPlayedDay: 0, wheelPlayedDay: 0 },
      dailyStats: {
        counterServed: 0, deliveryServed: 0, counterRev: 0, deliveryRev: 0, tipsRev: 0, wholesaleSpent: 0, ratings: [5]
      },
      shiftClosed: false, // V87: closes shop only, never advances calendar

      // Lịch sử cào vé số (tối đa 15-20 lượt gần nhất)
      lotteryHistory: [],
      // Đơn hàng Soppi đang vận chuyển
      soppiOrders: [],
      // Đánh giá khách đã để lại và phản hồi của chủ quán
      reviews: [],
      nextReviewId: 1,
      // Flash sale Soppi theo thời gian thực
      soppiFlashSale: null,

      // Sưu tầm, thông báo và biến cố V6
      souvenirs: {},
      auctionHouse: { day:0, nextId:1, lots:[], listings:[], history:[] },
      notifications: [],
      nextNotificationId: 1,
      dailyWorldEvent: null,
      dailyIncidentCount: 0,
      nextCustomerPatienceMod: 0,
      lotteryActiveTicket: null,
      miniGameScores: { whackBest: 0, stackBest: 0 },
      farmDailyEvent: null,
      barnDailyEvent: null,
      lastMarketNewsNotice: null,
      automation: { farmEnabled: false, barnEnabled: false, shopFastEnabled: false },

      // V26: khám phá Làng / Phố Huyện
      villageEnergy: 100,
      villageEnergyDay: 1,
      villageZone: 'lane',
      villageKarma: 10,
      villageTripsToday: 0,
      villageEncounterId: null,
      villageHistory: [],
      villageStoryFlags: {},
      villageEnergyLastRegen: Date.now(),
      utilityOwned: [],
      equippedGear: { hat:null, outfit:null, charm:null, shoes:null },
      dailyVillageVisitors: { day:1, ids:[] },
      v30StarterFixApplied: false
    };

    const DEFAULT_GAME_STATE = JSON.parse(JSON.stringify(gameState));

    let workbenchDish = {
      career: 'boba',
      container: 'cup_m',
      base: 'tea_black',
      sugar: 70,
      ice: 50,
      spicyLevel: 3,
      fryHeat: 170,
      tray: 'plate',
      sauce: 'sauce_sweet_chili',
      toppings: ['topping_boba'],
      skewerCounts: { skewer_fish: 2 },
      listedPrice: 45,
      isShaken: false,
      isCooked: false,
      fryProgress: 0,
      fryState: 'unfried'
    };

    let selectedIntroCareerChoice = 'boba';
    let currentGrowthSection = 'skills';
    let currentCustomer = null;
    let customerPatienceTimer = null;
    let activeOnlineOrders = [];
    let deliveryCooldown = 25;
    let packTimer = null;
    let packCurrentStep = 1;
    let packTimeRemaining = 6.0;
    let packingTargetOrder = null;
    let activeRenameTarget = null;
    let shakeTimer = null;
    let noodleCookTimer = null;
    let fryInterval = null;
    let selectedBlindBagIdx = null;
    let blindBagRoundOutcomes = [];
    let blindBagRoundLocked = false;
    let activeVillagePointIndex = -1;
    let activeVillageNpcId = null;
    let villageNpcState = [];
    let villageNpcTimer = null;
    let villageNpcZoneKey = '';

    let phonePauseActive = false;

    // Trạng thái cào vé số
    let scratchCardState = Array(6).fill(false);
    let scratchCardValues = [];
    let currentLotteryRollResult = null;
    let queuedRandomIncident = null;
    let activeRandomIncident = null;
    let whackState = null;
    let whackTimer = null;
    let whackSpawnTimer = null;
    let stackState = null;
    let stackTimer = null;

    // Trạng thái Quick Restock
    let activeQuickRestockItem = null;
    let quickRestockQuantity = 5;
    let activeFeedbackReviewId = null;
    let activeReplyReviewId = null;

    const NPC_MASTER_LIST = [
      { id: "linh", name: "Linh Sinh Viên", avatar: "👩", role: "Khách quen xóm trọ", group: "customer", budget: 65, strict: "easy", careerPrefs: { boba: "Cho em 1 ly Trà Sữa Trân Châu ngọt vừa nhiều đá!", noodle: "Thố mì cay kim chi cấp 2 ấm bụng nha quán!", streetfood: "Cho em 2 xiên cá viên chiên giòn chấm tương ngọt ạ!" } },
      { id: "minh", name: "Minh Game Thủ", avatar: "🧑", role: "Cày rank thâu đêm", group: "customer", budget: 75, strict: "moderate", careerPrefs: { boba: "Một ly trà đen đậm đà để leo rank đêm nay!", noodle: "Thố mì cay cấp 4 nhiều bò xé lưỡi cho tỉnh ngủ!", streetfood: "Mẹt xúc xích với bò viên chiên giòn rụm mang đi nhé!" } },
      { id: "an", name: "An Văn Phòng", avatar: "👨‍💼", role: "Dân công sở bận rộn", group: "customer", budget: 85, strict: "strict", careerPrefs: { boba: "Cho tôi ly lục trà trân châu trắng, làm nhanh giùm tôi!", noodle: "Tô mì nấm thanh đạm ít cay thôi nhé chủ quán.", streetfood: "Phần đậu hũ phô mai ráo dầu ăn nhẹ." } },
      { id: "ha", name: "Cô Hà Giáo Viên", avatar: "👩‍🏫", role: "Trường làng", group: "customer", budget: 60, strict: "strict", careerPrefs: { boba: "Trà mật ong thanh nhiệt, đừng cho ngọt quá nhé.", noodle: "Thố mì nước dùng thanh ngọt ít ớt.", streetfood: "Cho cô 2 xiên trứng cút chiên giòn vừa tới." } },
      { id: "tuan", name: "Tuấn Gymer", avatar: "🏋️", role: "Huấn luyện viên", group: "customer", budget: 95, strict: "moderate", careerPrefs: { boba: "Sữa tươi nguyên chất nhiều đạm ít ngọt!", noodle: "Thố mì bò sa tế ngập thịt bò và trứng nha!", streetfood: "Bò cuộn nấm và xúc xích ít dầu mỡ." } },
      { id: "na", name: "Bé Na Học Sinh", avatar: "👧", role: "Học sinh tiểu học", group: "customer", budget: 40, strict: "easy", careerPrefs: { boba: "Ly trà dâu nhiều topping thạch dừa sặc sỡ!", noodle: "Mì cấp 0 không cay nhiều chả cá ạ!", streetfood: "Hai que cá viên nhiều sốt ngọt ngào chú ơi!" } },
      { id: "phuc_str", name: "Phúc Streamer", avatar: "🎙️", role: "Sáng tạo nội dung", group: "customer", budget: 110, strict: "moderate", careerPrefs: { boba: "Trà sữa khoai môn béo ngậy review cho fan!", noodle: "Thử thách mì cay cấp 7 bốc hỏa trên sóng trực tiếp!", streetfood: "Mẹt xiên bơ tỏi thập cẩm giòn rụm view triệu like!" } },
      { id: "vy_bank", name: "Vy Tín Dụng", avatar: "👠", role: "Chuyên viên ngân hàng", group: "romance", budget: 130, strict: "very_strict", careerPrefs: { boba: "Sữa tươi trân châu đường đen milk foam phô mai cao cấp.", noodle: "Thố mì Tom Yum hải sản tôm sú thượng hạng.", streetfood: "Mẹt xiên bơ tỏi hảo hạng ráo dầu tuyệt đối." } },
      { id: "mai_art", name: "Mai Họa Sĩ", avatar: "🎨", role: "Họa sĩ tự do", group: "romance", budget: 80, strict: "moderate", careerPrefs: { boba: "Trà dâu tây sắc màu lấy cảm hứng vẽ tranh.", noodle: "Thố mì nấm thanh tao giữ tâm hồn tĩnh lặng.", streetfood: "Mẹt bắp xào bơ thơm lừng góc phố." } },
      { id: "khoa_ship", name: "Khoa Shipper", avatar: "🛵", role: "Đội trưởng giao hàng", group: "romance", budget: 70, strict: "easy", careerPrefs: { boba: "Ly trà đen size L đá mát lạnh xua tan nắng gắt.", noodle: "Tô mì cay kim chi ăn vội giữa ca giao.", streetfood: "Mấy xiên hồ lô nướng thơm nức mũi." } },
      { id: "khai_si", name: "Anh Khải Sỉ", avatar: "📦", role: "Đầu mối cảng biển", group: "merchant", budget: 140, strict: "strict", tipMod: 1.05, careerPrefs: { boba: "Ly trà đen đậm vị để tỉnh táo chốt công hàng!", noodle: "Thố mì bò sa tế cay nồng đậm chất dân buôn!", streetfood: "Mẹt xiên que đầy ụ ăn mừng kiện hàng cập bến!" } },
      { id: "ba_sau", name: "Bà Sáu Hàng Xóm", avatar: "👵", role: "Khách quen đầu ngõ", group: "customer", budget: 52, strict: "easy", patienceMod: 8, tipMod: .9, careerPrefs: { boba: "Cho bà món nào dễ uống là được con.", noodle: "Ít cay thôi nha, bà ăn chậm.", streetfood: "Chiên vàng vừa vừa, đừng khô quá." } },
      { id: "ong_bay", name: "Ông Bảy Xe Ôm", avatar: "🧓", role: "Chạy xe đầu chợ", group: "customer", budget: 58, strict: "easy", patienceMod: 5, tipMod: 1.0, careerPrefs: { boba: "Cái gì mát là được.", noodle: "Cho tô nóng nóng dễ ăn.", streetfood: "Mấy xiên gọn gọn mang đi." } },
      { id: "huong_food", name: "Hương Food Reviewer", avatar: "📷", role: "Reviewer ẩm thực", group: "vip", budget: 165, strict: "very_strict", patienceMod: -4, tipMod: 1.45, rare: true, careerPrefs: { boba: "Mình sẽ chấm kỹ từng chi tiết nhé.", noodle: "Nước lèo và độ cay phải chuẩn.", streetfood: "Độ giòn và sốt phải thật cân bằng." } },
      { id: "yuki", name: "Yuki Du Khách", avatar: "🧳", role: "Khách du lịch Nhật", group: "vip", budget: 155, strict: "strict", patienceMod: 2, tipMod: 1.35, rare: true, careerPrefs: { boba: "Cho tôi món nổi tiếng nhất của quán.", noodle: "Tôi muốn thử vị cay địa phương.", streetfood: "Cho một mẹt đặc trưng của làng." } },
      { id: "duc_tech", name: "Đức Dev", avatar: "💻", role: "Lập trình viên làm remote", group: "customer", budget: 125, strict: "moderate", patienceMod: 1, tipMod: 1.2, careerPrefs: { boba: "Ít ngọt để còn code tiếp.", noodle: "Cay vừa thôi, lát còn họp.", streetfood: "Cho món nào ăn một tay được." } },
      { id: "lan_doctor", name: "Bác Sĩ Lan", avatar: "🩺", role: "Trạm y tế xã", group: "customer", budget: 120, strict: "strict", patienceMod: -1, tipMod: 1.15, careerPrefs: { boba: "Làm gọn sạch giúp chị nhé.", noodle: "Chị cần phần nóng và chín kỹ.", streetfood: "Nhớ chiên chín đều nha." } },
      { id: "tu_tho", name: "Chú Tư Thợ Hồ", avatar: "👷", role: "Đội xây dựng trong làng", group: "customer", budget: 78, strict: "easy", patienceMod: 4, tipMod: 1.05, careerPrefs: { boba: "Ly lớn cho mát người!", noodle: "Cho phần no bụng chút nha.", streetfood: "Mẹt nhiều xiên ăn cho chắc bụng." } },
      { id: "ngoc_idol", name: "Ngọc Idol Làng", avatar: "🌟", role: "Ca sĩ hội chợ", group: "vip", budget: 145, strict: "moderate", patienceMod: 0, tipMod: 1.4, rare: true, careerPrefs: { boba: "Món lên hình đẹp nha chủ quán!", noodle: "Cho phần nhìn thật bắt mắt.", streetfood: "Mẹt phải xinh để quay story." } },
      { id: "loan_cho", name: "Cô Loan Tiểu Thương", avatar: "🧺", role: "Bán rau chợ sáng", group: "merchant", budget: 68, strict: "strict", patienceMod: 3, tipMod: .95, careerPrefs: { boba: "Giá hợp lý cô ủng hộ dài dài.", noodle: "Nấu đúng món cô gọi là được.", streetfood: "Đừng tính mắc quá nha con." } },
      { id: "bao_phuot", name: "Bảo Phượt Thủ", avatar: "🏍️", role: "Đi xuyên tỉnh bằng xe máy", group: "customer", budget: 105, strict: "moderate", patienceMod: 1, tipMod: 1.25, careerPrefs: { boba: "Cho ly mát lạnh thật đã.", noodle: "Mì cay mạnh tay một chút.", streetfood: "Xiên que nóng giòn ăn tại chỗ." } },
      { id: "thao_mom", name: "Chị Thảo Bỉm Sữa", avatar: "👩‍🍼", role: "Khách đi cùng em bé", group: "customer", budget: 92, strict: "easy", patienceMod: -3, tipMod: 1.1, careerPrefs: { boba: "Làm nhanh giúp chị với nha.", noodle: "Không cần quá cay.", streetfood: "Cho phần gọn sạch để mang về." } },
      { id: "nam_farmer", name: "Anh Nam Nông Dân", avatar: "🧑‍🌾", role: "Chủ ruộng dâu", group: "farmer", budget: 82, strict: "easy", patienceMod: 7, tipMod: 1.05, careerPrefs: { boba: "Có trà dâu thì cho anh thử.", noodle: "Tô nào nóng là ngon.", streetfood: "Bắp với xiên gì cũng được." } },
      { id: "hanh_law", name: "Hạnh Luật Sư", avatar: "⚖️", role: "Về quê cuối tuần", group: "vip", budget: 175, strict: "very_strict", patienceMod: -2, tipMod: 1.55, rare: true, careerPrefs: { boba: "Tôi gọi sao làm đúng vậy nhé.", noodle: "Mọi chi tiết phải đúng yêu cầu.", streetfood: "Đúng số lượng và đúng sốt giúp tôi." } },
      { id: "tom_travel", name: "Tom Backpacker", avatar: "🎒", role: "Khách Tây ba lô", group: "vip", budget: 150, strict: "moderate", patienceMod: 5, tipMod: 1.5, rare: true, careerPrefs: { boba: "Local favorite please!", noodle: "Spicy local noodles, please!", streetfood: "Street food combo, please!" } },
      { id: "chi_bep", name: "Chị Bếp Minh Anh", avatar: "👩‍🍳", role: "Bếp trưởng nhà hàng huyện", group: "vip", budget: 185, strict: "very_strict", patienceMod: 0, tipMod: 1.6, rare: true, careerPrefs: { boba: "Chị muốn thử kỹ thuật pha của em.", noodle: "Cho chị xem độ cân bằng nước lèo.", streetfood: "Để chị xem tay chiên của em tới đâu." } },
      { id: "tram_hoa", name: "Trâm Bán Hoa", avatar: "💐", role: "Sạp hoa đầu chợ", group: "customer", budget: 72, strict: "easy", reqLevel:3, reqStage:1, tipMod:1.1, careerPrefs:{ boba:"Cho Trâm ly nào thơm nhẹ, nhìn xinh xinh nha.", noodle:"Mì nấm ít cay giúp Trâm nhé.", streetfood:"Cho phần nhỏ gọn để vừa bán hoa vừa ăn." } },
      { id: "vinh_buudien", name: "Anh Vĩnh Bưu Điện", avatar: "📮", role: "Chạy thư khắp xã", group: "customer", budget: 88, strict: "moderate", reqLevel:3, reqStage:1, patienceMod:-1, careerPrefs:{ boba:"Ly lớn ít ngọt để anh chạy tiếp.", noodle:"Cho tô nóng nhanh gọn.", streetfood:"Mấy xiên mang đi giúp anh." } },
      { id: "bich_homestay", name: "Chị Bích Homestay", avatar: "🏡", role: "Chủ homestay ven sông", group: "merchant", budget: 125, strict: "moderate", reqLevel:6, reqStage:2, tipMod:1.25, careerPrefs:{ boba:"Cho chị món dễ giới thiệu với khách du lịch.", noodle:"Món nào đặc trưng làng mình nhất em làm chị thử.", streetfood:"Cho mẹt đặc sản để chị chụp menu homestay." } },
      { id: "huy_kientruc", name: "Huy Kiến Trúc", avatar: "📐", role: "Sinh viên kiến trúc về quê", group: "customer", budget: 105, strict: "moderate", reqLevel:6, reqStage:2, tipMod:1.15, careerPrefs:{ boba:"Một ly đẹp mắt để anh ngồi vẽ quán.", noodle:"Cho món có màu sắc cân bằng nha.", streetfood:"Bày mẹt gọn đẹp một chút nhé." } },
      { id: "co_lien_ncc", name: "Cô Liên Nhà Cung Cấp", avatar: "🚚", role: "Mối nguyên liệu thị trấn", group: "merchant", budget: 145, strict: "strict", reqLevel:10, reqStage:3, tipMod:1.25, careerPrefs:{ boba:"Cô muốn thử xem nguyên liệu mới lên món thế nào.", noodle:"Làm cô một tô có topping mới nhé.", streetfood:"Cho cô thử loại xiên mới nhất quán vừa nhập." } },
      { id: "chef_quang", name: "Chef Quang", avatar: "🧑‍🍳", role: "Bếp trưởng khách sạn huyện", group: "vip", budget: 210, strict: "very_strict", reqLevel:10, reqStage:3, rare:true, tipMod:1.7, careerPrefs:{ boba:"Tôi muốn thử công thức signature của quán.", noodle:"Nước lèo, topping và độ cay phải cân bằng.", streetfood:"Tôi chấm kỹ độ giòn, mùi dầu và sốt." } },
      { id: "ken_dukhach", name: "Ken Travel Vlog", avatar: "📹", role: "Travel vlogger", group: "vip", budget: 190, strict: "moderate", reqLevel:15, reqStage:4, rare:true, tipMod:1.65, careerPrefs:{ boba:"Cho mình món signature quay clip nha!", noodle:"Món cay nhất nhưng phải ngon nhé!", streetfood:"Cho combo nhìn đã mắt nhất quán." } },
      { id: "ong_chutich", name: "Chú Thành Hội Làng", avatar: "🎖️", role: "Ban tổ chức hội làng", group: "vip", budget: 220, strict: "strict", reqLevel:20, reqStage:5, rare:true, tipMod:1.75, careerPrefs:{ boba:"Làm chú món xứng đáng mang tên quán nhé.", noodle:"Cho chú món đặc biệt nhất bếp mình.", streetfood:"Một mẹt đặc sản thật chỉn chu." } }
    ];

    function playSound(type) {
      try {
        if (!window.Tone) return;
        if (Tone.context.state !== 'running') {
          Tone.start();
        }
        const synth = new Tone.PolySynth(Tone.Synth).toDestination();
        synth.volume.value = -12;

        if (type === 'coin') {
          synth.triggerAttackRelease(['B5', 'E6'], '16n');
        } else if (type === 'serve') {
          synth.triggerAttackRelease(['C5', 'E5', 'G5', 'C6'], '12n');
        } else if (type === 'error') {
          synth.triggerAttackRelease(['F3', 'C3'], '8n');
        } else if (type === 'click') {
          synth.triggerAttackRelease(['C4'], '32n');
        } else if (type === 'level') {
          synth.triggerAttackRelease(['C5', 'G5', 'A5', 'C6'], '8n');
        }
      } catch (err) {}
    }

    function showToast(text, icon) {
      const box = document.getElementById('toast-box');
      const iconEl = document.getElementById('toast-icon');
      const textEl = document.getElementById('toast-text');
      if (!box || !iconEl || !textEl) return;

      iconEl.innerText = icon || '✨';
      textEl.innerText = text || '';
      box.classList.remove('opacity-0', '-translate-y-4');
      box.classList.add('opacity-100', 'translate-y-0');
clearTimeout(window._toastTimeout);
      window._toastTimeout = setTimeout(() => {
        box.classList.remove('opacity-100', 'translate-y-0');
        box.classList.add('opacity-0', '-translate-y-4');
      }, 2200);
    }

    function ensureV6State() {
      if (!gameState.souvenirs || typeof gameState.souvenirs !== 'object' || Array.isArray(gameState.souvenirs)) gameState.souvenirs = {};
      ensureAuctionState();
      if (!Array.isArray(gameState.notifications)) gameState.notifications = [];
      if (!Number.isFinite(Number(gameState.nextNotificationId))) gameState.nextNotificationId = 1;
      if (!Number.isFinite(Number(gameState.dailyIncidentCount))) gameState.dailyIncidentCount = 0;
      if (!Number.isFinite(Number(gameState.nextCustomerPatienceMod))) gameState.nextCustomerPatienceMod = 0;
      if (!gameState.miniGameScores || typeof gameState.miniGameScores !== 'object') gameState.miniGameScores = { whackBest: 0, stackBest: 0 };
      gameState.miniGameScores.whackBest = Math.max(0, Number(gameState.miniGameScores.whackBest) || 0);
      gameState.miniGameScores.stackBest = Math.max(0, Number(gameState.miniGameScores.stackBest) || 0);
      if (!gameState.miniGameDaily || typeof gameState.miniGameDaily !== 'object') gameState.miniGameDaily = { cardsPlayedDay: 0, wheelPlayedDay: 0 };
      if (!Array.isArray(gameState.lotteryHistory)) gameState.lotteryHistory = [];
      if (gameState.lotteryActiveTicket && !Array.isArray(gameState.lotteryActiveTicket.scratched)) gameState.lotteryActiveTicket = null;
      if (typeof gameState.shopIcon !== 'string') gameState.shopIcon = null;
      if (typeof gameState.shopAvatar !== 'string') gameState.shopAvatar = null;
      if (!gameState.farmDailyEvent || typeof gameState.farmDailyEvent !== 'object') gameState.farmDailyEvent = null;
      if (!gameState.barnDailyEvent || typeof gameState.barnDailyEvent !== 'object') gameState.barnDailyEvent = null;

      // V8: trạng thái tự động hóa Vườn / Chuồng, tương thích save cũ.
      if (!Number.isFinite(Number(gameState.villageEnergy))) gameState.villageEnergy = 100;
      gameState.villageEnergy = Math.max(0, Math.min(100, Number(gameState.villageEnergy) || 0));
      if (!Number.isFinite(Number(gameState.villageEnergyDay))) gameState.villageEnergyDay = Number(gameState.day) || 1;
      if (Number(gameState.villageEnergyDay) !== Number(gameState.day)) {
        // V87.2.1: explicit day-confirmation restores energy to 100.
        // Save migration only resynchronizes day markers; it does not grant a free refill.
        gameState.villageEnergyDay = Number(gameState.day) || 1;
        gameState.villageTripsToday = 0;
        gameState.villageEncounterId = null;
      }
      if (typeof gameState.villageZone !== 'string') gameState.villageZone = 'lane';
      if (!Number.isFinite(Number(gameState.villageKarma))) gameState.villageKarma = 10;
      gameState.villageKarma = Math.max(-50, Math.min(100, Number(gameState.villageKarma) || 0));
      if (!Number.isFinite(Number(gameState.villageTripsToday))) gameState.villageTripsToday = 0;
      if (!Array.isArray(gameState.villageHistory)) gameState.villageHistory = [];
      if (!gameState.villageStoryFlags || typeof gameState.villageStoryFlags !== 'object' || Array.isArray(gameState.villageStoryFlags)) gameState.villageStoryFlags = {};
      if (typeof gameState.villageEncounterId !== 'string') gameState.villageEncounterId = null;
      if (!gameState.dailyVillageVisitors || typeof gameState.dailyVillageVisitors !== 'object') gameState.dailyVillageVisitors = { day:Number(gameState.day)||1, ids:[], completedIds:[], rolled:false };
      if (!Array.isArray(gameState.dailyVillageVisitors.ids)) gameState.dailyVillageVisitors.ids = [];
      if (!Array.isArray(gameState.dailyVillageVisitors.completedIds)) gameState.dailyVillageVisitors.completedIds = [];
      if (typeof gameState.dailyVillageVisitors.rolled !== 'boolean') gameState.dailyVillageVisitors.rolled = gameState.dailyVillageVisitors.ids.length > 0;
      if (!Number.isFinite(Number(gameState.dailyVillageVisitors.day))) gameState.dailyVillageVisitors.day = Number(gameState.day) || 1;
      if (Number(gameState.dailyVillageVisitors.day) !== Number(gameState.day)) gameState.dailyVillageVisitors = { day:Number(gameState.day)||1, ids:[], completedIds:[], rolled:false };

      ensureUtilityState();

      if (!gameState.automation || typeof gameState.automation !== 'object') gameState.automation = { farmEnabled: false, barnEnabled: false, shopFastEnabled: false };
      gameState.automation.farmEnabled = !!gameState.automation.farmEnabled;
      gameState.automation.barnEnabled = !!gameState.automation.barnEnabled;
      if (Array.isArray(gameState.farmPlots)) {
        gameState.farmPlots.forEach(plot => {
          if (!plot || typeof plot !== 'object') return;
          if (typeof plot.lastSeed !== 'string') plot.lastSeed = plot.seed || null;
        });
      }
      if (gameState.animals && typeof gameState.animals === 'object') {
        Object.values(gameState.animals).forEach(anim => {
          if (!anim || typeof anim !== 'object') return;
          anim.autoFed = !!anim.autoFed;
          anim.affection = Math.max(0, Math.min(100, Number(anim.affection) || 10));
          anim.careCooldown = Math.max(0, Number(anim.careCooldown) || 0);
        });
      }
    }

    function getSouvenirUniqueCount() {
      ensureV6State();
      return Object.keys(SOUVENIR_CONFIG).filter(id => (gameState.souvenirs[id] || 0) > 0).length;
    }

    function renderGameCollectionSummary() {
      ensureV6State();
      const unique = getSouvenirUniqueCount();
      const total = Object.keys(SOUVENIR_CONFIG).length;
      const summary = document.getElementById('game-collection-summary');
      if (summary) summary.innerText = `🏆 ${unique}/${total} • 🎁${gameState.blindBagTokens} • 🎟️${gameState.lotteryTickets}`;
      const bagCard = document.getElementById('blindbag-card-stock');
      if (bagCard) bagCard.innerText = gameState.blindBagTokens > 0 ? `Có ${gameState.blindBagTokens} Túi Mù • mở miễn phí trước` : '45 Xu • hoặc dùng Túi Mù nhặt được';
      const lotCard = document.getElementById('lottery-card-stock');
      if (lotCard) lotCard.innerText = gameState.lotteryTickets > 0 ? `Có ${gameState.lotteryTickets} vé • cào miễn phí trước` : '25 Xu • hoặc dùng vé nhặt được';
      const bagStatus = document.getElementById('blindbag-stock-status');
      if (bagStatus) bagStatus.innerText = `🎁 Túi Mù đang có: ${gameState.blindBagTokens} • ${gameState.blindBagTokens > 0 ? 'lượt tới dùng túi trước' : 'không có sẽ dùng 45 Xu'}`;
    }

    function addSouvenir(id, sourceText = '') {
      ensureV6State();
      const item = SOUVENIR_CONFIG[id];
      if (!item) return false;
      const first = !(gameState.souvenirs[id] > 0);
      gameState.souvenirs[id] = (gameState.souvenirs[id] || 0) + 1;
      const rarity = SOUVENIR_RARITY[item.rarity] || SOUVENIR_RARITY.green;
      pushGameNotification(first ? 'Lưu niệm mới!' : 'Lưu niệm trùng!', `${item.name} • ${rarity.label}${sourceText ? ' • ' + sourceText : ''}`, item.icon, item.rarity);
      if (first) showToast(`${rarity.icon} Bộ sưu tập mới: ${item.name}!`, item.icon);
      return first;
    }

    function getFarmBarnSouvenirBonuses() {
      ensureV6State();
      const out = { farmGrowthPct: 0, farmYield: 0, seedSavePct: 0, barnGrowthPct: 0, barnYield: 0, feedSavePct: 0 };
      Object.entries(SOUVENIR_CONFIG).forEach(([id, item]) => {
        if ((gameState.souvenirs[id] || 0) <= 0 || !item.bonus || (id.startsWith('v874_') && !Object.keys(V874_NPC_PROFILES).some(npcId => V874_NPC_PROFILES[npcId].rewardId===id && v8741RewardActive(npcId)))) return;
        Object.keys(out).forEach(k => { out[k] += Number(item.bonus[k]) || 0; });
      });
      const utilityBonus = getUtilityBonuses();
      out.farmGrowthPct += Number(utilityBonus.farmGrowthPct) || 0;
      out.seedSavePct += Number(utilityBonus.seedSavePct) || 0;
      out.barnGrowthPct += Number(utilityBonus.barnGrowthPct) || 0;
      out.feedSavePct += Number(utilityBonus.feedSavePct) || 0;
      // Skill bonuses use this calculator, the same one used by farm/barn actions.
      out.farmGrowthPct += Math.max(0,Number(gameState.skills?.farm)||0)*.02+v8742SkillBonus('farmGrowthPct');
      out.barnGrowthPct += Math.max(0,Number(gameState.skills?.farm)||0)*.02;
      out.seedSavePct += v8742SkillBonus('seedSavePct');
      out.feedSavePct += v8742SkillBonus('feedSavePct');

      out.farmGrowthPct = Math.min(.60, out.farmGrowthPct);
      out.barnGrowthPct = Math.min(.60, out.barnGrowthPct);
      out.seedSavePct = Math.min(.50, out.seedSavePct);
      out.feedSavePct = Math.min(.50, out.feedSavePct);
      out.farmYield = Math.max(0, Math.min(4, Math.floor(out.farmYield)));
      out.barnYield = Math.max(0, Math.min(4, Math.floor(out.barnYield)));
      return out;
    }

    function tryConsumeFarmSeed(cropKey, silent = false) {
      const cfg = FARM_SEEDS_CONFIG[cropKey];
      if (!cfg) return false;
      const count = Number(gameState.inventory[cfg.seedKey]) || 0;
      if (count <= 0) return false;
      const bonus = getFarmBarnSouvenirBonuses();
      const eBonus = getFarmEventBonuses();
      const savedChance = Math.min(.75, bonus.seedSavePct + eBonus.seedSavePct);
      const saved = savedChance > 0 && Math.random() < savedChance;
      if (!saved) gameState.inventory[cfg.seedKey] = count - 1;
      if (saved && !silent) showToast('Túi hạt lưu niệm phát huy tác dụng — không mất hạt!', '🌱');
      return true;
    }

    function tryConsumeBarnFeed(itemKey, silent = false) {
      if (!itemKey) return true;
      const count = Number(gameState.inventory[itemKey]) || 0;
      if (count <= 0) return false;
      const bonus = getFarmBarnSouvenirBonuses();
      const eBonus = getBarnEventBonuses();
      const savedChance = Math.min(.75, bonus.feedSavePct + eBonus.feedSavePct);
      const saved = savedChance > 0 && Math.random() < savedChance;
      if (!saved) gameState.inventory[itemKey] = count - 1;
      if (saved && !silent) showToast('Máng ăn lưu niệm giúp tiết kiệm 1 phần thức ăn!', '🐾');
      return true;
    }

    function formatFarmBarnBonus(kind) {
      const b = getFarmBarnSouvenirBonuses();
      if (kind === 'farm') {
        return `🌱 Tốc độ +${Math.round(b.farmGrowthPct * 100)}% • 🧺 +${b.farmYield} sản lượng • 🎒 ${Math.round(b.seedSavePct * 100)}% giữ hạt`;
      }
      return `🐾 Tốc độ +${Math.round(b.barnGrowthPct * 100)}% • 🥛 +${b.barnYield} sản lượng • 🌾 ${Math.round(b.feedSavePct * 100)}% tiết kiệm thức ăn`;
    }


    function getFarmEventBonuses() {
      const ev = getActiveWorldEventConfig();
      const effects = (ev && ev.farmEffects) || {};
      return {
        growthPct: Number(effects.growthPct) || 0,
        yield: Math.floor(Number(effects.yield) || 0),
        seedSavePct: Math.max(0, Number(effects.seedSavePct) || 0),
        autoWater: !!effects.autoWater
      };
    }

    function getBarnEventBonuses() {
      const ev = getActiveWorldEventConfig();
      const effects = (ev && ev.barnEffects) || {};
      return {
        growthPct: Number(effects.growthPct) || 0,
        yield: Math.floor(Number(effects.yield) || 0),
        feedSavePct: Math.max(0, Number(effects.feedSavePct) || 0)
      };
    }

    // Tương thích save/code V10: hai hàm cũ giờ chỉ trả về cùng một thời tiết chung.
    function rollFarmDailyEvent(pushNotice = false) {
      return getActiveWorldEventConfig() || (rollDailyWorldEvent(false), getActiveWorldEventConfig());
    }

    function rollBarnDailyEvent(pushNotice = false) {
      return getActiveWorldEventConfig() || (rollDailyWorldEvent(false), getActiveWorldEventConfig());
    }

    function renderFarmEventPanel() {
      const box = document.getElementById('farm-event-panel');
      if (!box) return;
      const ev = getActiveWorldEventConfig() || (rollDailyWorldEvent(false), getActiveWorldEventConfig());
      if (!ev) return;
      box.innerHTML = `
        <div class="flex items-start gap-2">
          <div class="w-10 h-10 rounded-2xl bg-lime-100 border border-lime-200 flex items-center justify-center text-2xl shrink-0">${ev.icon || '🌤️'}</div>
          <div class="min-w-0 flex-1">
            <div class="flex items-center justify-between gap-2"><b class="text-[10px] text-lime-900 truncate">${ev.title}</b><span class="text-sm" title="Ảnh hưởng hôm nay">🌱</span></div>
            <p class="text-[8px] text-lime-800 mt-0.5 leading-relaxed">${ev.desc}</p>
            <p class="text-[8px] text-lime-700 font-bold mt-1">${ev.farmText || 'Không có thay đổi đáng kể.'}</p>
          </div>
        </div>`;
    }

    function renderBarnEventPanel() {
      const box = document.getElementById('barn-event-panel');
      if (!box) return;
      const ev = getActiveWorldEventConfig() || (rollDailyWorldEvent(false), getActiveWorldEventConfig());
      if (!ev) return;
      box.innerHTML = `
        <div class="flex items-start gap-2">
          <div class="w-10 h-10 rounded-2xl bg-orange-100 border border-orange-200 flex items-center justify-center text-2xl shrink-0">${ev.icon || '🌤️'}</div>
          <div class="min-w-0 flex-1">
            <div class="flex items-center justify-between gap-2"><b class="text-[10px] text-orange-900 truncate">${ev.title}</b><span class="text-sm" title="Ảnh hưởng hôm nay">🐾</span></div>
            <p class="text-[8px] text-orange-800 mt-0.5 leading-relaxed">${ev.desc}</p>
            <p class="text-[8px] text-orange-700 font-bold mt-1">${ev.barnText || 'Không có thay đổi đáng kể.'}</p>
          </div>
        </div>`;
    }

    function pushGameNotification(title, body, icon = '🔔', type = 'info') {
      ensureV6State();
      gameState.notifications.unshift({
        id: gameState.nextNotificationId++,
        day: gameState.day,
        title: String(title || 'Thông báo'),
        body: String(body || ''),
        icon: icon || '🔔',
        type,
        read: false,
        createdAt: Date.now()
      });
      if (gameState.notifications.length > 50) gameState.notifications = gameState.notifications.slice(0, 50);
      renderNotificationBadge();
    }

    function renderNotificationBadge() {
      ensureV6State();
      const unread = gameState.notifications.filter(n => !n.read).length;
      const main = document.getElementById('phone-notif-badge');
      const phone = document.getElementById('phone-notification-count');
      const header = document.getElementById('header-notif-badge');
      [main, phone, header].forEach(el => {
        if (!el) return;
        if (unread > 0) {
          el.classList.remove('hidden');
          el.innerText = unread > 9 ? '9+' : String(unread);
        } else {
          el.classList.add('hidden');
        }
      });
    }

    function openNotificationsModal() {
      ensureV6State();
      const modal = document.getElementById('modal-notifications');
      if (modal) modal.classList.remove('hidden');
      // v87.7.4: opening the inbox does not mark every message as read.
      renderNotificationsList();
      renderNotificationBadge();
      saveGameToStorage();
      playSound('click');
    }

    function closeNotificationsModal() {
      const modal = document.getElementById('modal-notifications');
      if (modal) modal.classList.add('hidden');
      playSound('click');
    }

    // v87.7.4: one notification source shared by phone, Header and save.
    function getBPVQNotificationGroup(n) {
      const kind = String(n && n.type || '').toLowerCase();
      if (kind === 'weather') return 'weather';
      if (['event','incident','festival','market','world','special','npc'].includes(kind)) return 'events';
      return 'other';
    }

    function bpvqSetNotificationFilter(category) {
      window.BPVQNotificationFilter = ['all','weather','events','other'].includes(category) ? category : 'all';
      renderNotificationsList();
    }

    function bpvqReadGameNotification(id) {
      ensureV6State();
      const n = gameState.notifications.find(item => String(item.id) === String(id));
      if (!n) return;
      if (!n.read) {
        n.read = true;
        saveGameToStorage();
      }
      renderNotificationsList();
      renderNotificationBadge();
      if (window.BPVQHeader) window.BPVQHeader.refresh();
    }

    function bpvqReadAllNotifications() {
      ensureV6State();
      const hadUnread = gameState.notifications.some(n => !n.read);
      if (!hadUnread) return;
      gameState.notifications.forEach(n => { n.read = true; });
      renderNotificationBadge();
      renderNotificationsList();
      saveGameToStorage();
      if (window.BPVQHeader) window.BPVQHeader.refresh();
    }

    function renderNotificationsList() {
      const list = document.getElementById('notifications-list');
      if (!list) return;
      ensureV6State();
      const filter = window.BPVQNotificationFilter || 'all';
      const defs = [['all','Tất cả'],['weather','Thời tiết'],['events','Sự kiện'],['other','Khác']];
      const filters = defs.map(([key,label]) => `<button type="button" class="v8774-filter ${filter === key ? 'is-active' : ''}" onclick="bpvqSetNotificationFilter('${key}')">${label}</button>`).join('');
      const visible = gameState.notifications.filter(n => filter === 'all' || getBPVQNotificationGroup(n) === filter);
      const unread = gameState.notifications.filter(n => !n.read).length;
      const cards = visible.length ? visible.map(n => {
        const icon = escapeHtmlText(String(n.icon || '🔔'));
        const dot = n.read ? '' : '<i class="v8774-dot" aria-label="Chưa đọc"></i>';
        return `<button type="button" class="v8774-notification ${n.read ? 'is-read' : 'is-unread'}" onclick="bpvqReadGameNotification(${Number(n.id)||0})">
          <span class="v8774-notification-icon">${icon}</span>
          <span class="v8774-notification-text"><span class="v8774-notification-title">${escapeHtmlText(n.title)}</span><span class="v8774-notification-copy">${escapeHtmlText(n.body)}</span><span class="v8774-notification-day">Ngày ${Number(n.day)||1} · ${n.read ? 'Đã đọc' : 'Chạm để đánh dấu đã đọc'}</span></span>${dot}
        </button>`;
      }).join('') : '<div class="v8774-empty">🔕 Chưa có thông báo ở nhóm này.</div>';
      list.innerHTML = `<div class="v8774-inbox-tools"><span>${unread} tin chưa đọc</span><button type="button" onclick="bpvqReadAllNotifications()" ${!unread?'disabled':''}>✓ Đọc tất cả</button></div><div class="v8774-inbox-filters">${filters}</div><div class="v8774-inbox-cards">${cards}</div>`;
    }

    function getActiveWorldEventConfig() {
      const data = gameState.dailyWorldEvent;
      if (!data || Number(data.day) !== Number(gameState.day)) return null;
      return DAILY_WORLD_EVENTS.find(e => e.id === data.id) || null;
    }

    function getActiveMarketNews() {
      if (typeof MARKET_NEWS_DATABASE === 'undefined' || !MARKET_NEWS_DATABASE.length) return null;
      return MARKET_NEWS_DATABASE[gameState.marketNewsIndex || 0] || MARKET_NEWS_DATABASE[0];
    }

    function getMarketNewsBonuses() {
      const news = getActiveMarketNews();
      const base = (news && news.shopEffects) || {};
      const career = (news && news.careerEffects && news.careerEffects[gameState.currentCareer]) || {};
      const val = key => (Number(base[key]) || 0) + (Number(career[key]) || 0);
      return {
        revenuePct: val('revenuePct'), tipPct: val('tipPct'), patienceSec: val('patienceSec'),
        luckPct: val('luckPct'), deliveryPct: val('deliveryPct'), opCost: val('opCost'),
        incidentBoost: val('incidentBoost'), specialNpcPct: val('specialNpcPct'), arrivalPct: val('arrivalPct')
      };
    }

    function getDailyEventBonuses() {
      const ev = getActiveWorldEventConfig();
      const e = (ev && ev.effects) || {};
      const n = getMarketNewsBonuses();
      return {
        revenuePct: (Number(e.revenuePct) || 0) + n.revenuePct,
        tipPct: (Number(e.tipPct) || 0) + n.tipPct,
        patienceSec: (Number(e.patienceSec) || 0) + n.patienceSec,
        luckPct: (Number(e.luckPct) || 0) + n.luckPct,
        deliveryPct: (Number(e.deliveryPct) || 0) + n.deliveryPct,
        opCost: (Number(e.opCost) || 0) + n.opCost,
        incidentBoost: (Number(e.incidentBoost) || 0) + n.incidentBoost,
        specialNpcPct: (Number(e.specialNpcPct) || 0) + n.specialNpcPct,
        arrivalPct: (Number(e.arrivalPct) || 0) + n.arrivalPct
      };
    }

    function rollDailyWorldEvent(force = false) {
      ensureV6State();
      if (!force && gameState.dailyWorldEvent && Number(gameState.dailyWorldEvent.day) === Number(gameState.day)) {
        renderDailyWorldEventBanner();
        return;
      }
      const previousId = gameState.dailyWorldEvent && gameState.dailyWorldEvent.id;
      let pool = DAILY_WORLD_EVENTS.filter(e => e.id !== previousId);
      if (!pool.length) pool = DAILY_WORLD_EVENTS;
      const picked = pool[Math.floor(Math.random() * pool.length)];
      gameState.dailyWorldEvent = { id: picked.id, day: gameState.day };
      gameState.dailyIncidentCount = 0;
      gameState.nextCustomerPatienceMod = 0;
      renderDailyWorldEventBanner();
      pushGameNotification(`Thời tiết ngày ${gameState.day}: ${picked.title}`, `${picked.desc} Quán: ${picked.shopText || ''} • Vườn: ${picked.farmText || ''} • Chuồng: ${picked.barnText || ''}`, picked.icon, 'weather');
    }

    function renderDailyWorldEventBanner() {
      // V8: biến cố chỉ nằm trong Trung tâm Thông báo để màn Quán gọn hơn.
      return;
    }

    function maybeQueueShopIncident() {
      ensureV6State();
      if (queuedRandomIncident || activeRandomIncident) return false;
      if ((gameState.dailyIncidentCount || 0) >= 2) return false;
      const ev = getDailyEventBonuses();
      const chance = Math.min(.22, .08 + ev.incidentBoost);
      if (Math.random() >= chance) return false;
      const incident = SHOP_INCIDENTS[Math.floor(Math.random() * SHOP_INCIDENTS.length)];
      queuedRandomIncident = incident;
      gameState.dailyIncidentCount = (gameState.dailyIncidentCount || 0) + 1;
      pushGameNotification('Có chuyện bất ngờ ở quán', `${incident.title}: ${incident.desc}`, incident.icon, 'incident');
      return true;
    }

    function showQueuedRandomIncident() {
      if (!queuedRandomIncident) return false;
      activeRandomIncident = queuedRandomIncident;
      queuedRandomIncident = null;
      const modal = document.getElementById('modal-random-event');
      if (!modal) return false;
      const icon = document.getElementById('random-event-icon');
      const title = document.getElementById('random-event-title');
      const desc = document.getElementById('random-event-desc');
      const a = document.getElementById('random-event-choice-a');
      const b = document.getElementById('random-event-choice-b');
      if (icon) icon.innerText = activeRandomIncident.icon;
      if (title) title.innerText = activeRandomIncident.title;
      if (desc) desc.innerText = activeRandomIncident.desc;
      if (a) { a.innerText = activeRandomIncident.choices.a.label; a.onclick = () => applyIncidentChoice('a'); }
      if (b) { b.innerText = activeRandomIncident.choices.b.label; b.onclick = () => applyIncidentChoice('b'); }
      modal.classList.remove('hidden');
      playSound('serve');
      return true;
    }

    function maybeAwardGoodDeedDrop() {
      ensureV6State();
      const luck = Math.max(0, Number((getGrowthBonuses() || {}).luckPct) || 0);
      const chance = Math.min(.62, .34 + luck);
      if (Math.random() >= chance) return null;
      if (Math.random() < .55) {
        gameState.lotteryTickets += 1;
        pushGameNotification('Quà cảm ơn', 'Người bạn vừa giúp tặng lại 1 Vé Số Cào.', '🎟️', 'gift');
        showToast('Nhận được 1 Vé Số Cào từ người được giúp!', '🎟️');
        return 'lottery';
      }
      gameState.blindBagTokens += 1;
      pushGameNotification('Quà cảm ơn', 'Người bạn vừa giúp tặng lại 1 Túi Mù.', '🎁', 'gift');
      showToast('Nhận được 1 Túi Mù từ người được giúp!', '🎁');
      return 'blindbag';
    }

    function applyIncidentChoice(choiceKey) {
      if (!activeRandomIncident) return;
      const choice = activeRandomIncident.choices[choiceKey];
      if (!choice) return;
      if (choice.coins) gameState.coins = Math.max(0, gameState.coins + choice.coins);
      if (choice.reputation) gameState.reputation = Math.max(1, Math.min(5, gameState.reputation + choice.reputation));
      if (choice.exp) addExp(choice.exp);
      if (choice.nextPatience) gameState.nextCustomerPatienceMod = (gameState.nextCustomerPatienceMod || 0) + choice.nextPatience;
      if (choice.itemKey && choice.qty) gameState.inventory[choice.itemKey] = (gameState.inventory[choice.itemKey] || 0) + choice.qty;
      if (choice.goodDeed) maybeAwardGoodDeedDrop();
      renderGameCollectionSummary();
      pushGameNotification(`${activeRandomIncident.title} • đã xử lý`, choice.text, activeRandomIncident.icon, 'incident');
      showToast(choice.text, activeRandomIncident.icon);
      const modal = document.getElementById('modal-random-event');
      if (modal) modal.classList.add('hidden');
      activeRandomIncident = null;
      updateHeaderStats();
      renderWarehouseUI();
      saveGameToStorage();
      if (gameState.phase === 'open' && !currentCustomer) scheduleNextCustomer('incident');
    }

    function selectIntroCareer(careerKey) {
      selectedIntroCareerChoice = careerKey;
      ['boba', 'noodle', 'streetfood'].forEach(c => {
        const el = document.getElementById(`intro-card-${c}`);
        if (!el) return;
        if (c === careerKey) {
          el.className = "p-3 rounded-2xl bg-amber-600 border-2 border-white cursor-pointer tap-scale transition-all flex items-center gap-3 shadow-lg";
        } else {
          el.className = "p-3 rounded-2xl bg-slate-800/80 border-2 border-slate-600 cursor-pointer tap-scale transition-all flex items-center gap-3";
        }
      });
      playSound('click');
    }

    function confirmStartGameFromIntro() {
      const nameInp = document.getElementById('intro-player-name');
      const shopInp = document.getElementById('intro-shop-name');

      if (nameInp && nameInp.value.trim()) gameState.playerName = nameInp.value.trim();
      if (shopInp && shopInp.value.trim()) gameState.shopName = shopInp.value.trim();

      gameState.hasStarted = true;
      gameState.currentCareer = selectedIntroCareerChoice;
      gameState.careerLocked = true;
      gameState.phase = 'prep';
      gameState.shiftClosed = false;

      // Khởi tạo inventory ban đầu theo nghề
      if (selectedIntroCareerChoice === 'boba') {
        gameState.inventory = { cup_m: 15, tea_black: 12, tea_strawberry: 8, topping_boba: 15, topping_pudding: 6, topping_jelly: 6, topping_white_boba: 5, seed_wheat: 4, crop_wheat: 2 };
      } else if (selectedIntroCareerChoice === 'noodle') {
        gameState.inventory = { bowl_m: 12, broth_kimchi: 10, broth_mushroom: 8, ntop_beef: 8, ntop_fishcake: 8, ntop_enoki: 6, seed_wheat: 4, crop_wheat: 2 };
      } else {
        gameState.inventory = { tray_plate: 15, tray_basket: 8, skewer_fish: 15, skewer_holo: 8, skewer_beef: 8, sauce_sweet_chili: 10, sauce_tamarind: 6, seed_wheat: 4, crop_wheat: 2 };
      }

      document.getElementById('screen-intro').classList.add('hidden');
      sessionGameActive = true;
      playSound('level');
      showToast(`Chào mừng chủ quán ${gameState.playerName}!`, "🌅");

      ensureV6State();
      gameState.souvenirs = {};
      gameState.notifications = [];
      gameState.nextNotificationId = 1;
      gameState.dailyWorldEvent = null;
      gameState.dailyIncidentCount = 0;
      gameState.nextCustomerPatienceMod = 0;
      gameState.lotteryActiveTicket = null;
      gameState.lotteryHistory = [];
      gameState.lotteryTickets = 0;
      gameState.blindBagTokens = 0;
      gameState.miniGameScores = { whackBest: 0, stackBest: 0 };
      gameState.miniGameDaily = { cardsPlayedDay: 0, wheelPlayedDay: 0 };
      gameState.staff = [];
      gameState.staffHR = null;
      gameState.automation = { farmEnabled: false, barnEnabled: false, shopFastEnabled: false };
      gameState.villageEnergy = 100;
      gameState.villageEnergyDay = 1;
      gameState.villageZone = 'lane';
      gameState.villageKarma = 10;
      gameState.villageTripsToday = 0;
      gameState.villageEncounterId = null;
      gameState.villageHistory = [];
      gameState.villageStoryFlags = {};
      gameState.villageEnergyLastRegen = Date.now();
      gameState.utilityOwned = [];
      gameState.equippedGear = { hat:null, outfit:null, charm:null, shoes:null };
      gameState.marketNewsIndex = Math.floor(Math.random() * MARKET_NEWS_DATABASE.length);
      gameState.lastMarketNewsNotice = null;
      rollDailyWorldEvent(true);
      announceDailyMarketNews(true);

      applyCareerLockToUI();
      updateHeaderStats();
      updateShopPhaseUI();
      renderNotificationBadge();
      renderGameCollectionSummary();
      saveGameToStorage();
    }

    function applyCareerLockToUI() {
      const c = gameState.currentCareer;
      workbenchDish.career = c;

      // Nghề chỉ chọn ở intro/phá sản. Main không cần banner nghề nữa,
      // nhưng trạm chế biến vẫn phải được khởi tạo đúng theo nghề đã khóa.
      if (c === 'boba') {
        workbenchDish.container = 'cup_m';
        workbenchDish.base = 'tea_black';
        workbenchDish.sugar = 70;
        workbenchDish.ice = 50;
        workbenchDish.toppings = [];
        workbenchDish.listedPrice = 45;
      } else if (c === 'noodle') {
        workbenchDish.container = 'bowl_m';
        workbenchDish.base = 'broth_kimchi';
        workbenchDish.spicyLevel = 3;
        workbenchDish.toppings = [];
        workbenchDish.listedPrice = 65;
      } else {
        workbenchDish.tray = 'plate';
        workbenchDish.sauce = 'sauce_sweet_chili';
        workbenchDish.skewerCounts = {};
        workbenchDish.listedPrice = 40;
      }
      workbenchDish.isShaken = false;
      workbenchDish.isCooked = false;
      workbenchDish.fryProgress = 0;
      workbenchDish.fryState = 'unfried';

      renderWorkbenchControls();
      updateWorkbenchPreview();
    }



    const CHARACTER_GEAR_CONFIG = {
      straw_hat: { slot:'hat', icon:'👒', name:'Nón Rơm Nhẹ', cost:220, desc:'Hồi thể lực nhanh hơn một chút.', bonuses:{ regenReduceSec:4 } },
      festival_band: { slot:'hat', icon:'🎀', name:'Băng Đô Hội Làng', cost:620, desc:'+4% vận may khi đi Làng.', bonuses:{ villageLuckPct:.04 } },

      work_apron: { slot:'outfit', icon:'🧥', name:'Tạp Dề Chủ Quán', cost:360, desc:'+2% doanh thu tại quán.', bonuses:{ shopRevenuePct:.02 } },
      raincoat: { slot:'outfit', icon:'🧥', name:'Áo Khoác Đi Mưa', cost:680, desc:'Mỗi chuyến đi tốn ít hơn 1⚡.', bonuses:{ energyCostFlat:1 } },

      clover_charm: { slot:'charm', icon:'🍀', name:'Bùa Cỏ Bốn Lá', cost:900, desc:'+6% vận may Làng • +2% may mắn chung.', bonuses:{ villageLuckPct:.06, generalLuckPct:.02 } },
      red_charm: { slot:'charm', icon:'🧧', name:'Túi Lộc Đỏ', cost:1450, desc:'+8% Xu nhận từ sự kiện Làng • +2% tip.', bonuses:{ villageCoinPct:.08, shopTipPct:.02 } },

      canvas_shoes: { slot:'shoes', icon:'👟', name:'Giày Vải Đi Làng', cost:430, desc:'Giảm 2⚡ mỗi chuyến.', bonuses:{ energyCostFlat:2 } },
      runner_shoes: { slot:'shoes', icon:'🥾', name:'Giày Đi Bộ Xịn', cost:1180, desc:'Giảm 3⚡ • hồi thể lực nhanh hơn.', bonuses:{ energyCostFlat:3, regenReduceSec:7 } }
    };

    const UTILITY_BUFF_CONFIG = {
      village_thermos: { category:'village', icon:'🫖', name:'Bình Nước Giữ Nhiệt', cost:520, desc:'Hồi thể lực nhanh hơn 5 giây.', bonuses:{ regenReduceSec:5 } },
      village_mapbook: { category:'village', icon:'🗺️', name:'Sổ Tay Đường Làng', cost:820, desc:'Giảm 1⚡ cho mọi chuyến đi.', bonuses:{ energyCostFlat:1 } },

      shop_cashbox: { category:'shop', icon:'🧾', name:'Hộp Thu Ngân Gọn', cost:980, desc:'+3% doanh thu quán.', bonuses:{ shopRevenuePct:.03 } },
      shop_tipjar: { category:'shop', icon:'🫙', name:'Hũ Tip Dễ Thương', cost:760, desc:'+3% tiền tip.', bonuses:{ shopTipPct:.03 } },

      farm_watering_can: { category:'farm', icon:'🚿', name:'Bình Tưới Đồng', cost:680, desc:'+6% tốc độ cây.', bonuses:{ farmGrowthPct:.06 } },
      farm_seed_pouch: { category:'farm', icon:'🎒', name:'Túi Hạt Chống Rơi', cost:880, desc:'+5% giữ hạt khi gieo.', bonuses:{ seedSavePct:.05 } },

      barn_soft_brush: { category:'barn', icon:'🪮', name:'Bàn Chải Mềm', cost:720, desc:'Chăm sóc được thêm +2❤️.', bonuses:{ careAffectionBonus:2 } },
      barn_feed_scoop: { category:'barn', icon:'🥄', name:'Muỗng Đong Thức Ăn', cost:900, desc:'+5% tiết kiệm thức ăn.', bonuses:{ feedSavePct:.05 } },
      barn_warm_lamp: { category:'barn', icon:'🏮', name:'Đèn Sưởi Chuồng', cost:1250, desc:'+6% tốc độ tạo sản phẩm.', bonuses:{ barnGrowthPct:.06 } }
    };

    const VILLAGE_ENERGY_PACKS = {
      energy_drink_small: {
        icon:'🥤', name:'Nước Mát Ven Đường', energy:20, cost:25, dailyLimit:4,
        desc:'Nạp nhanh +20⚡.'
      },
      energy_rice_ball: {
        icon:'🍙', name:'Cơm Nắm Mang Theo', energy:50, cost:70, dailyLimit:2,
        desc:'Ăn no một chút • +50⚡.'
      },
      energy_full_meal: {
        icon:'🍱', name:'Bữa Cơm No Bụng', energy:100, cost:140, dailyLimit:1,
        desc:'Hồi đầy thể lực lên 100⚡.'
      }
    };

    function ensureUtilityState() {
      if (!Array.isArray(gameState.utilityOwned)) gameState.utilityOwned = [];
      gameState.utilityOwned = [...new Set(gameState.utilityOwned)].filter(id => !!UTILITY_BUFF_CONFIG[id] || !!CHARACTER_GEAR_CONFIG[id]);
      if (!gameState.equippedGear || typeof gameState.equippedGear !== 'object' || Array.isArray(gameState.equippedGear)) {
        gameState.equippedGear = { hat:null, outfit:null, charm:null, shoes:null };
      }
      ['hat','outfit','charm','shoes'].forEach(slot => {
        const id = gameState.equippedGear[slot];
        if (!id || !CHARACTER_GEAR_CONFIG[id] || CHARACTER_GEAR_CONFIG[id].slot !== slot || !gameState.utilityOwned.includes(id)) {
          gameState.equippedGear[slot] = null;
        }
      });
      if (!Number.isFinite(Number(gameState.villageEnergyLastRegen))) gameState.villageEnergyLastRegen = Date.now();

      if (!gameState.villageEnergyPackDaily || typeof gameState.villageEnergyPackDaily !== 'object' || Array.isArray(gameState.villageEnergyPackDaily)) {
        gameState.villageEnergyPackDaily = { day:Number(gameState.day)||1, counts:{} };
      }
      if (Number(gameState.villageEnergyPackDaily.day) !== Number(gameState.day)) {
        gameState.villageEnergyPackDaily = { day:Number(gameState.day)||1, counts:{} };
      }
      if (!gameState.villageEnergyPackDaily.counts || typeof gameState.villageEnergyPackDaily.counts !== 'object') {
        gameState.villageEnergyPackDaily.counts = {};
      }
    }

    function getUtilityBonuses() {
      ensureUtilityState();
      const out = {
        villageLuckPct:0, generalLuckPct:0, villageCoinPct:0,
        energyCostFlat:0, regenReduceSec:0,
        shopRevenuePct:0, shopTipPct:0,
        farmGrowthPct:0, seedSavePct:0,
        barnGrowthPct:0, feedSavePct:0, careAffectionBonus:0
      };
      (gameState.utilityOwned || []).forEach(id => {
        const cfg = UTILITY_BUFF_CONFIG[id];
        if (!cfg || !cfg.bonuses) return;
        Object.keys(out).forEach(k => { out[k] += Number(cfg.bonuses[k]) || 0; });
      });
      Object.values(gameState.equippedGear || {}).forEach(id => {
        const cfg = CHARACTER_GEAR_CONFIG[id];
        if (!cfg || !cfg.bonuses) return;
        Object.keys(out).forEach(k => { out[k] += Number(cfg.bonuses[k]) || 0; });
      });
      out.energyCostFlat = Math.min(5, Math.floor(out.energyCostFlat));
      out.regenReduceSec = Math.min(20, Math.floor(out.regenReduceSec));
      out.villageLuckPct = Math.min(.18, out.villageLuckPct);
      out.generalLuckPct = Math.min(.08, out.generalLuckPct);
      out.villageCoinPct = Math.min(.20, out.villageCoinPct);
      return out;
    }

    function getVillageRegenSeconds() {
      const b = getUtilityBonuses();
      return Math.max(20, 45 - (b.regenReduceSec || 0));
    }

    function getVillageWalkCost(zone) {
      const b = getUtilityBonuses();
      return Math.max(5, (Number(zone && zone.cost) || 10) - (b.energyCostFlat || 0) - v8741Bonuses().villageEnergyFlat - v8742SkillBonus('energyCostFlat'));
    }

    function tickVillageEnergyRegen() {
      ensureV6State();
      ensureUtilityState();
      const now = Date.now();
      if (gameState.villageEnergy >= 100) {
        gameState.villageEnergy = 100;
        gameState.villageEnergyLastRegen = now;
        return false;
      }
      const sec = getVillageRegenSeconds();
      const elapsed = Math.max(0, now - Number(gameState.villageEnergyLastRegen || now));
      const gain = Math.floor(elapsed / (sec * 1000));
      if (gain <= 0) return false;
      gameState.villageEnergy = Math.min(100, gameState.villageEnergy + gain);
      gameState.villageEnergyLastRegen += gain * sec * 1000;
      return true;
    }

    function renderVillageChibi() {
      ensureUtilityState();
      const name = document.getElementById('village-chibi-name');
      const hat = document.getElementById('village-chibi-hat');
      const outfit = document.getElementById('village-chibi-outfit');
      const charm = document.getElementById('village-chibi-charm');
      const shoes = document.getElementById('village-chibi-shoes');
      const image = document.getElementById('village-chibi-image');
      if (name) name.innerText = gameState.playerName || 'Bạn';
      const chosenChibi = getCurrentPlayerChibi();
      if (image) { image.src = getPlayerChibiSource(chosenChibi); image.alt = playerChibiLabel(chosenChibi); }

      const eq = gameState.equippedGear || {};
      if (hat) hat.innerText = eq.hat ? CHARACTER_GEAR_CONFIG[eq.hat].icon : '';
      if (outfit) outfit.innerText = eq.outfit ? CHARACTER_GEAR_CONFIG[eq.outfit].icon : '';
      if (charm) charm.innerText = eq.charm ? CHARACTER_GEAR_CONFIG[eq.charm].icon : '';
      if (shoes) shoes.innerText = eq.shoes ? CHARACTER_GEAR_CONFIG[eq.shoes].icon : '';

      const summary = document.getElementById('village-gear-summary');
      if (summary) {
        const slotMeta = {hat:'Mũ',outfit:'Áo',charm:'Bùa',shoes:'Giày'};
        summary.innerHTML = Object.keys(slotMeta).map(slot => {
          const id = eq[slot];
          const cfg = id ? CHARACTER_GEAR_CONFIG[id] : null;
          return `<div class="village-gear-slot"><span class="gicon">${cfg ? cfg.icon : '➕'}</span><span class="gname">${cfg ? cfg.name : slotMeta[slot]}</span></div>`;
        }).join('');
      }
    }

    function utilityBonusText(b) {
      const parts = [];
      if (b.villageLuckPct) parts.push(`🍀 +${Math.round(b.villageLuckPct*100)}% hên Làng`);
      if (b.generalLuckPct) parts.push(`✨ +${Math.round(b.generalLuckPct*100)}% may mắn`);
      if (b.villageCoinPct) parts.push(`🪙 +${Math.round(b.villageCoinPct*100)}% Xu sự kiện`);
      if (b.energyCostFlat) parts.push(`⚡ -${b.energyCostFlat} hao`);
      if (b.regenReduceSec) parts.push(`⚡ hồi nhanh ${b.regenReduceSec}s`);
      if (b.shopRevenuePct) parts.push(`📈 +${Math.round(b.shopRevenuePct*100)}% doanh thu`);
      if (b.shopTipPct) parts.push(`💝 +${Math.round(b.shopTipPct*100)}% tip`);
      if (b.farmGrowthPct) parts.push(`🌱 +${Math.round(b.farmGrowthPct*100)}% cây`);
      if (b.seedSavePct) parts.push(`🎒 +${Math.round(b.seedSavePct*100)}% giữ hạt`);
      if (b.barnGrowthPct) parts.push(`🐄 +${Math.round(b.barnGrowthPct*100)}% chuồng`);
      if (b.feedSavePct) parts.push(`🌾 +${Math.round(b.feedSavePct*100)}% giữ thức ăn`);
      if (b.careAffectionBonus) parts.push(`❤️ +${b.careAffectionBonus} chăm sóc`);
      return parts.join(' • ');
    }

    function buyUtilityItem(id) {
      ensureUtilityState();
      const cfg = CHARACTER_GEAR_CONFIG[id] || UTILITY_BUFF_CONFIG[id];
      if (!cfg) return;
      if (gameState.utilityOwned.includes(id)) return showToast('Bạn đã sở hữu món này rồi.', cfg.icon);
      if (gameState.coins < cfg.cost) return showToast(`Cần ${cfg.cost.toLocaleString()} Xu.`, '❌');
      gameState.coins -= cfg.cost;
      gameState.utilityOwned.push(id);
      if (cfg.slot) gameState.equippedGear[cfg.slot] = id;
      updateHeaderStats();
      renderVillageChibi();
      resetVillageNpcState(false);
      layoutVillageActors();
      renderVillagePoints();
      renderVillageNpcs();
      ensureVillageNpcMotion();
      renderUtilityShopApp();
      saveGameToStorage(false);
      playSound('coin');
      showToast(`Đã mua ${cfg.name}!`, cfg.icon);
    }

    function equipCharacterGear(id) {
      ensureUtilityState();
      const cfg = CHARACTER_GEAR_CONFIG[id];
      if (!cfg || !gameState.utilityOwned.includes(id)) return;
      if (gameState.equippedGear[cfg.slot] === id) {
        gameState.equippedGear[cfg.slot] = null;
        showToast(`Đã tháo ${cfg.name}.`, cfg.icon);
      } else {
        gameState.equippedGear[cfg.slot] = id;
        showToast(`Đã trang bị ${cfg.name}.`, cfg.icon);
      }
      renderVillageChibi();
      renderVillagePoints();
      renderVillageNpcs();
      ensureVillageNpcMotion();
      renderUtilityShopApp();
      renderVillageUI();
      saveGameToStorage(false);
    }


    function getVillageEnergyPackBoughtToday(id) {
      ensureUtilityState();
      return Number(gameState.villageEnergyPackDaily.counts[id]) || 0;
    }

    function buyVillageEnergyPack(id) {
      ensureUtilityState();
      const pack = VILLAGE_ENERGY_PACKS[id];
      if (!pack) return;

      tickVillageEnergyRegen();

      if (gameState.villageEnergy >= 100) {
        return showToast('Thể lực đang đầy 100⚡ rồi.', '⚡');
      }

      const used = getVillageEnergyPackBoughtToday(id);
      if (used >= pack.dailyLimit) {
        return showToast(`Hôm nay đã mua hết ${pack.name}.`, '🕒');
      }

      if (gameState.coins < pack.cost) {
        return showToast(`Cần ${pack.cost} Xu để mua ${pack.name}.`, '❌');
      }

      const before = Number(gameState.villageEnergy) || 0;
      const gain = id === 'energy_full_meal'
        ? Math.max(0, 100 - before)
        : Math.min(pack.energy, Math.max(0, 100 - before));

      if (gain <= 0) return showToast('Thể lực đang đầy rồi.', '⚡');

      gameState.coins -= pack.cost;
      gameState.villageEnergy = Math.min(100, before + gain);
      gameState.villageEnergyLastRegen = Date.now();
      gameState.villageEnergyPackDaily.counts[id] = used + 1;

      updateHeaderStats();
      renderVillageUI();
      renderUtilityShopApp();
      saveGameToStorage(false);
      playSound('coin');
      showToast(`${pack.icon} ${pack.name}: +${gain}⚡`, '⚡');
    }

    function renderVillageEnergyPacks() {
      ensureUtilityState();
      tickVillageEnergyRegen();

      const now = document.getElementById('utility-energy-now');
      if (now) now.innerText = Math.round(Number(gameState.villageEnergy) || 0);

      const grid = document.getElementById('utility-energy-pack-grid');
      if (!grid) return;

      grid.innerHTML = Object.entries(VILLAGE_ENERGY_PACKS).map(([id,pack]) => {
        const used = getVillageEnergyPackBoughtToday(id);
        const left = Math.max(0, pack.dailyLimit - used);
        const full = (Number(gameState.villageEnergy) || 0) >= 100;
        const soldOut = left <= 0;
        const disabled = full || soldOut || gameState.coins < pack.cost;

        return `<div class="energy-pack-card">
          <div>
            <div class="energy-pack-icon">${pack.icon}</div>
            <div class="energy-pack-name">${pack.name}</div>
            <div class="energy-pack-gain">${id === 'energy_full_meal' ? 'Hồi đầy' : `+${pack.energy}⚡`}</div>
            <div class="energy-pack-limit">Còn ${left}/${pack.dailyLimit} hôm nay</div>
          </div>
          <button ${disabled ? 'disabled' : ''} onclick="buyVillageEnergyPack('${id}')" class="energy-pack-buy tap-scale">
            ${full ? 'Đã đầy ⚡' : soldOut ? 'Hết lượt' : `🪙 ${pack.cost} Xu`}
          </button>
        </div>`;
      }).join('');
    }

    let utilityShopFilter = 'gear';

    function setUtilityShopFilter(filter) {
      utilityShopFilter = ['gear','village','shop','farm','barn'].includes(filter) ? filter : 'gear';
      renderUtilityShopApp();
      playSound('click');
    }

    function renderUtilityShopApp() {
      ensureUtilityState();
      const coin = document.getElementById('utility-coins-display');
      if (coin) coin.innerText = gameState.coins.toLocaleString();
      const ownedCount = document.getElementById('utility-owned-count');
      if (ownedCount) ownedCount.innerText = `${gameState.utilityOwned.length} món`;
      document.querySelectorAll('[data-utility-filter]').forEach(btn => btn.classList.toggle('active', btn.dataset.utilityFilter === utilityShopFilter));
      const gearSection = document.getElementById('utility-gear-section');
      const buffSection = document.getElementById('utility-buff-section');
      const energySection = document.getElementById('utility-energy-section');
      if (gearSection) gearSection.classList.toggle('hidden', utilityShopFilter !== 'gear');
      if (buffSection) buffSection.classList.toggle('hidden', utilityShopFilter === 'gear');
      if (energySection) energySection.classList.toggle('hidden', utilityShopFilter !== 'village');
      if (utilityShopFilter === 'village') renderVillageEnergyPacks();

      const equippedGrid = document.getElementById('utility-equipped-grid');
      if (equippedGrid) {
        const labels = {hat:'Mũ',outfit:'Áo',charm:'Bùa',shoes:'Giày'};
        equippedGrid.innerHTML = Object.keys(labels).map(slot => {
          const id = gameState.equippedGear[slot];
          const cfg = id ? CHARACTER_GEAR_CONFIG[id] : null;
          return `<div class="p-1.5 rounded-xl bg-slate-800 border border-slate-700 text-center">
            <div class="text-xl">${cfg ? cfg.icon : '➕'}</div>
            <div class="text-[7px] text-slate-400">${labels[slot]}</div>
            <div class="text-[7px] font-bold text-white truncate">${cfg ? cfg.name : 'Trống'}</div>
          </div>`;
        }).join('');
      }

      const bonus = getUtilityBonuses();
      const sum = document.getElementById('utility-gear-bonus-summary');
      if (sum) sum.innerText = utilityBonusText(bonus);

      const gearGrid = document.getElementById('utility-gear-shop-grid');
      if (gearGrid) {
        gearGrid.innerHTML = Object.entries(CHARACTER_GEAR_CONFIG).map(([id,cfg]) => {
          const owned = gameState.utilityOwned.includes(id);
          const equipped = gameState.equippedGear[cfg.slot] === id;
          return `<div class="utility-card">
            <div class="flex items-start gap-2"><span class="text-2xl">${cfg.icon}</span><div class="min-w-0"><b class="text-[9px] text-white block">${cfg.name}</b><p class="text-[7px] text-slate-400 mt-0.5">${cfg.desc}</p></div></div>
            <button onclick="${owned ? `equipCharacterGear('${id}')` : `buyUtilityItem('${id}')`}" class="utility-buy-btn ${equipped ? 'bg-emerald-700 text-emerald-100' : owned ? 'bg-cyan-700 text-white' : 'bg-amber-600 text-white'} tap-scale">
              ${equipped ? '✓ Đang mặc • Tháo' : owned ? 'Trang bị' : `${cfg.cost.toLocaleString()} Xu`}
            </button>
          </div>`;
        }).join('');
      }

      const buffGrid = document.getElementById('utility-buff-shop-grid');
      if (buffGrid) {
        buffGrid.innerHTML = Object.entries(UTILITY_BUFF_CONFIG).filter(([id,cfg]) => utilityShopFilter === 'gear' || cfg.category === utilityShopFilter).map(([id,cfg]) => {
          const owned = gameState.utilityOwned.includes(id);
          return `<div class="utility-card">
            <div class="flex items-start gap-2"><span class="text-2xl">${cfg.icon}</span><div class="min-w-0"><b class="text-[9px] text-white block">${cfg.name}</b><span class="text-[7px] uppercase font-black text-cyan-300">${cfg.category}</span><p class="text-[7px] text-slate-400 mt-0.5">${cfg.desc}</p></div></div>
            <button ${owned?'disabled':''} onclick="buyUtilityItem('${id}')" class="utility-buy-btn ${owned ? 'bg-slate-700 text-emerald-300' : 'bg-amber-600 text-white tap-scale'}">${owned ? '✓ Đã kích hoạt' : `${cfg.cost.toLocaleString()} Xu`}</button>
          </div>`;
        }).join('');
      }
    }

    const VILLAGE_ZONES = {
      lane:       { name:'Phố Nhỏ', icon:'🏘️', prop:'🪴', reqStage:0, reqLevel:1, cost:8 },
      market:     { name:'Chợ Trung Tâm', icon:'🛍️', prop:'🏪', reqStage:1, reqLevel:3, cost:9 },
      school:     { name:'Trường Thị Trấn', icon:'🏫', prop:'📚', reqStage:1, reqLevel:4, cost:9 },
      ricefield:  { name:'Công Viên Xanh', icon:'🌳', prop:'🪴', reqStage:1, reqLevel:5, cost:10 },
      riverside:  { name:'Quảng Trường', icon:'🌊', prop:'🛶', reqStage:2, reqLevel:6, cost:10 },
      busstop:    { name:'Trạm Xe', icon:'🚏', prop:'🚌', reqStage:2, reqLevel:8, cost:11 },
      clinic:     { name:'Trạm Xá', icon:'🏥', prop:'🚲', reqStage:3, reqLevel:10, cost:11 },
      temple:     { name:'Nhà Văn Hóa', icon:'🏛️', prop:'🎭', reqStage:3, reqLevel:10, cost:11 },
      hill:       { name:'Đồi Sim', icon:'⛰️', prop:'🪁', reqStage:4, reqLevel:15, cost:12 },
      nightmarket:{ name:'Phố Đèn', icon:'🎪', prop:'🏮', reqStage:4, reqLevel:16, cost:13 },
      district:   { name:'Khu Trung Tâm', icon:'🏙️', prop:'🚦', reqStage:5, reqLevel:20, cost:14 }
    };


    const VILLAGE_POINT_LIBRARY = {
      // Mỗi khu có điểm riêng khớp cảnh nền. Giữ ID của các điểm cũ để bảo toàn log/save.
      lane: [
        { id:'lotus_dock', icon:'🪴', label:'Góc Ngõ', x:'17%', y:'57%', title:'Góc Ngõ Đầu Phố', desc:'Một góc ngõ lát đá, có bồn cây và vài căn nhà mái ngói.', actions:[
          { label:'🧹 Dọn góc ngõ', outcomes:[{w:65,good:true,text:'Bạn quét sạch lá khô trước ngõ, hàng xóm rất vui.',karma:3,exp:7},{w:35,good:true,text:'Một bác hàng xóm cảm ơn và đưa bạn ít tiền mua nước.',coins:12,exp:7}] },
          { label:'🔎 Tìm đồ thất lạc', outcomes:[{w:40,good:true,text:'Bạn tìm thấy ít xu đánh rơi bên bồn cây.',coins:12,exp:6},{w:35,good:true,text:'Chủ nhà gửi bạn hai hạt giống làm quà.',item:'seed_wheat',qty:2,exp:7},{w:25,bad:true,text:'Bạn tìm mãi không thấy gì, lại mất chút sức.',energy:-3}] }
        ]},
        { id:'village_hut', icon:'🏡', label:'Hiên Nhà', x:'49%', y:'59%', title:'Hiên Nhà Phố Nhỏ', desc:'Mái hiên ấm cúng, nơi người dân ngồi trò chuyện mỗi chiều.', actions:[
          { label:'💬 Ghé hỏi thăm', outcomes:[{w:45,good:true,text:'Bạn nghe vài chuyện phố nhỏ rất thú vị.',exp:8,karma:2},{w:30,good:true,text:'Chủ nhà mời bạn nước mát, hồi lại thể lực.',energy:5},{w:25,good:true,text:'Một cô chú tặng bạn ít tiền lẻ mua quà.',coins:18,exp:6}] },
          { label:'📦 Phụ mang đồ vào nhà', outcomes:[{w:65,good:true,text:'Bạn xách đồ giúp người nhà, được cảm ơn rối rít.',karma:4,exp:10},{w:35,good:true,text:'Chủ nhà tặng bạn một túi quà bí ẩn.',blindBag:1,exp:10}] }
        ]},
        { id:'stone_bridge', icon:'🧱', label:'Bậc Đá', x:'52%', y:'85%', title:'Bậc Đá Cuối Phố', desc:'Dãy bậc đá dẫn ra con đường nhỏ, rất hợp để ngắm phố.', actions:[
          { label:'📸 Chụp ảnh góc phố', outcomes:[{w:60,good:true,text:'Bạn chụp được góc phố mái ngói rất xinh.',energy:3,exp:6},{w:40,good:true,text:'Một du khách nhờ bạn chụp ảnh và gửi 10 Xu.',coins:10,exp:6}] },
          { label:'🧹 Nhặt rác ở bậc thềm', outcomes:[{w:70,good:true,text:'Lối đi sạch hơn, người dân cảm ơn bạn.',karma:4,exp:8},{w:30,bad:true,text:'Bạn vấp nhẹ vào bậc thềm, hơi mất sức.',energy:-4,exp:4}] }
        ]}
      ],
      market: [
        { id:'market_stall', icon:'🍎', label:'Sạp Rau Quả', x:'19%', y:'56%', title:'Sạp Rau Quả Tươi', desc:'Rổ trái cây, rau tươi và tiếng rao hàng khiến góc chợ lúc nào cũng nhộn nhịp.', actions:[
          { label:'🍎 Xem nông sản mới', outcomes:[{w:50,good:true,text:'Chủ sạp mời bạn thử trái cây tươi.',energy:3,exp:5},{w:30,good:true,text:'Bạn giúp mua hộ một đơn trái cây và được boa.',coins:16,exp:8},{w:20,good:true,text:'Chủ sạp tặng một vé số lấy may.',ticket:1,exp:8}] },
          { label:'🧺 Phụ xếp rổ hàng', outcomes:[{w:70,good:true,text:'Quầy hàng gọn hơn và bạn nhận 20 Xu tiền công.',coins:20,karma:3,exp:9},{w:30,good:true,text:'Bạn được biếu một túi quà chợ bí ẩn.',blindBag:1,exp:10}] }
        ]},
        { id:'tea_corner', icon:'🍵', label:'Quán Nước', x:'58%', y:'43%', title:'Quán Nước Giữa Chợ', desc:'Bộ bàn ghế nhỏ cho người đi chợ ghé nghỉ và hỏi tin giá cả.', actions:[
          { label:'☕ Nghỉ chân uống trà', outcomes:[{w:60,good:true,text:'Bạn được nghỉ chân và hồi thêm thể lực.',energy:6,exp:5},{w:40,good:true,text:'Người ngồi cạnh kể bạn một mẹo buôn bán.',exp:10,karma:1}] },
          { label:'🗞️ Hỏi tin giá chợ', outcomes:[{w:55,good:true,text:'Bạn biết thêm tình hình hàng hóa hôm nay.',karma:3,exp:8},{w:45,good:true,text:'Chủ quán tặng bạn một vé số khuyến mãi.',ticket:1,exp:7}] }
        ]},
        { id:'supply_cart', icon:'📦', label:'Lối Nhập Hàng', x:'84%', y:'64%', title:'Lối Nhập Hàng Chợ', desc:'Xe đẩy và thùng hàng thường đi qua lối này mỗi sáng.', actions:[
          { label:'📦 Phụ dỡ thùng hàng', outcomes:[{w:65,good:true,text:'Bạn phụ một tay và được thưởng 24 Xu.',coins:24,exp:10},{w:35,good:true,text:'Người giao hàng biếu bạn chút trà nguyên liệu.',item:'tea_black',qty:2,exp:8}] },
          { label:'👀 Xem chuyến hàng mới', outcomes:[{w:50,good:true,text:'Bạn biết thêm món đang được mọi người săn tìm.',exp:9},{w:30,good:true,text:'Một chủ sạp gửi bạn ít thạch dùng thử.',item:'topping_jelly',qty:2,exp:8},{w:20,bad:true,text:'Bạn đứng đợi hơi lâu mà chẳng có hàng thú vị.',energy:-2}] }
        ]}
      ],
      school: [
        { id:'school_gate', icon:'🏫', label:'Cổng Trường', x:'49%', y:'65%', title:'Cổng Trường Thị Trấn', desc:'Cổng trường rợp bóng cây, học sinh ra vào rất trật tự.', actions:[
          { label:'🎒 Nhặt đồ rơi giúp bé', outcomes:[{w:60,good:true,text:'Bạn trả chiếc hộp bút cho học sinh, được cảm ơn.',karma:4,exp:9},{w:25,good:true,text:'Phụ huynh tặng bạn 15 Xu vì giúp tìm đồ.',coins:15,exp:8},{w:15,bad:true,text:'Bạn chạy theo gọi học sinh nên hơi mệt.',energy:-3}] },
          { label:'🚦 Hỗ trợ qua đường', outcomes:[{w:75,good:true,text:'Bạn hướng dẫn mọi người đi đúng lối an toàn.',karma:3,exp:9},{w:25,good:true,text:'Bác bảo vệ mời bạn nghỉ lấy sức.',energy:5,exp:5}] }
        ]},
        { id:'school_notice', icon:'📋', label:'Bảng Tin', x:'88%', y:'58%', title:'Bảng Tin Học Đường', desc:'Thông báo về hội sách, hoạt động thiện nguyện và câu lạc bộ học sinh.', actions:[
          { label:'📚 Xem lịch hội sách', outcomes:[{w:70,good:true,text:'Bạn biết thêm tin hội sách sắp diễn ra.',exp:10},{w:30,good:true,text:'Bạn nhặt được phiếu bốc thăm tại hội sách.',ticket:1,exp:8}] },
          { label:'📌 Dán thông báo giúp', outcomes:[{w:65,good:true,text:'Bác bảo vệ cảm ơn vì bạn dán bảng rất ngay ngắn.',karma:3,exp:9},{w:35,good:true,text:'Bạn được gửi ít tiền mua nước.',coins:12,exp:7}] }
        ]},
        { id:'school_yard', icon:'🌳', label:'Hàng Cây', x:'20%', y:'61%', title:'Hàng Cây Trước Trường', desc:'Lối đi có bóng cây mát bên hàng rào trường học.', actions:[
          { label:'🧹 Phụ nhặt giấy rơi', outcomes:[{w:70,good:true,text:'Lối đi trước trường sạch hơn, thầy cô cảm ơn bạn.',karma:4,exp:10},{w:30,good:true,text:'Một nhóm học sinh tặng bạn món quà bí ẩn của hội trường.',blindBag:1,exp:9}] },
          { label:'🍃 Nghỉ mát dưới cây', outcomes:[{w:75,good:true,text:'Bạn nghỉ dưới bóng mát và hồi thể lực.',energy:5,exp:5},{w:25,bad:true,text:'Bạn mải ngắm cảnh nên tốn chút thời gian.',energy:-2}] }
        ]}
      ],
      ricefield: [
        { id:'field_edge', icon:'🪑', label:'Ghế Nghỉ', x:'17%', y:'63%', title:'Ghế Nghỉ Dưới Giàn Hoa', desc:'Chiếc ghế bên lối dạo, nơi mọi người ngồi hóng gió.', actions:[
          { label:'🌿 Ngồi nghỉ và ngắm cảnh', outcomes:[{w:65,good:true,text:'Không khí mát lành giúp bạn hồi sức.',energy:6,exp:5},{w:35,good:true,text:'Một cô bác kể bạn câu chuyện vui ở công viên.',karma:2,exp:8}] },
          { label:'🧹 Nhặt rác quanh ghế', outcomes:[{w:65,good:true,text:'Công viên sạch hơn nhờ bạn.',karma:4,exp:9},{w:35,good:true,text:'Nhân viên chăm vườn tặng bạn ít hạt giống.',item:'seed_wheat',qty:2,exp:8}] }
        ]},
        { id:'water_pump', icon:'⛲', label:'Đài Phun', x:'69%', y:'59%', title:'Đài Phun Nước Giữa Công Viên', desc:'Vòi nước phun lấp lánh giữa những bồn hoa.', actions:[
          { label:'📸 Chụp ảnh đài phun', outcomes:[{w:60,good:true,text:'Bạn chụp được một bức ảnh thật đẹp.',exp:8},{w:40,good:true,text:'Một du khách nhờ chụp ảnh và cảm ơn bạn bằng vé số.',ticket:1,exp:8}] },
          { label:'💧 Giúp nhặt đồ cạnh bồn', outcomes:[{w:70,good:true,text:'Bạn nhặt được món đồ thất lạc và trả cho chủ.',karma:3,exp:8},{w:30,bad:true,text:'Bạn bị nước bắn ướt áo và hơi mệt.',energy:-2}] }
        ]},
        { id:'park_path', icon:'🚶', label:'Đường Dạo', x:'42%', y:'80%', title:'Đường Dạo Bên Hàng Cây', desc:'Lối đi sạch đẹp chạy quanh bãi cỏ và những hàng cây xanh.', actions:[
          { label:'🐕 Giúp tìm thú cưng', outcomes:[{w:60,good:true,text:'Bạn tìm lại chú chó nhỏ cho chủ và nhận lời cảm ơn.',karma:4,exp:10},{w:25,good:true,text:'Chủ thú cưng gửi bạn 18 Xu.',coins:18,exp:9},{w:15,bad:true,text:'Bạn đi lòng vòng tìm nhưng chú chó đã tự về nhà.',energy:-4}] },
          { label:'🌱 Chăm bồn cây', outcomes:[{w:70,good:true,text:'Bạn phụ tưới gốc cây, được nhân viên công viên khen.',karma:3,exp:8},{w:30,good:true,text:'Bạn được biếu ít hạt giống.',item:'seed_wheat',qty:2,exp:6}] }
        ]}
      ],
      riverside: [
        { id:'boat_dock', icon:'🧱', label:'Bậc Thềm', x:'49%', y:'84%', title:'Bậc Đá Quảng Trường', desc:'Bậc tam cấp thoáng rộng nối phố với sân quảng trường.', actions:[
          { label:'📸 Giúp khách chụp ảnh', outcomes:[{w:50,good:true,text:'Du khách cảm ơn bạn bằng 20 Xu.',coins:20,exp:8},{w:50,good:true,text:'Bạn nghe được chuyện thị trấn từ nhóm du khách.',exp:10,karma:2}] },
          { label:'🔎 Tìm vật bị đánh rơi', outcomes:[{w:35,good:true,text:'Bạn nhặt được một vé số dưới chân ghế đá.',ticket:1,exp:7},{w:35,good:true,text:'Bạn tìm được túi quà ai để quên và chuyển về quầy thông tin.',karma:3,exp:8},{w:30,bad:true,text:'Bạn tìm quanh mà không thấy gì, hơi tốn sức.',energy:-2}] }
        ]},
        { id:'lotus_bank', icon:'⛲', label:'Đài Phun', x:'51%', y:'56%', title:'Đài Phun Nước Quảng Trường', desc:'Đài phun nằm giữa quảng trường, bao quanh là bồn hoa và những chiếc ghế đá.', actions:[
          { label:'🌼 Ngắm cảnh và chụp hình', outcomes:[{w:60,good:true,text:'Bạn có ảnh lưu niệm trước đài phun thật xinh.',exp:6,energy:2},{w:40,good:true,text:'Một du khách gửi bạn 14 Xu vì chụp hộ ảnh.',coins:14,exp:6}] },
          { label:'🧺 Nhặt rác quanh bồn hoa', outcomes:[{w:75,good:true,text:'Khu quảng trường sạch đẹp hơn nhờ bạn.',karma:4,exp:8},{w:25,good:true,text:'Người chăm cây biếu bạn ít mật ong quê.',item:'honey',qty:1,exp:8}] }
        ]},
        { id:'square_board', icon:'📣', label:'Bảng Sự Kiện', x:'82%', y:'63%', title:'Bảng Thông Báo Quảng Trường', desc:'Lịch hội chợ, ca nhạc và những công việc cộng đồng được đăng ở đây.', actions:[
          { label:'🗓️ Xem sự kiện hôm nay', outcomes:[{w:65,good:true,text:'Bạn nắm lịch biểu diễn và được thêm kinh nghiệm.',exp:10},{w:35,good:true,text:'Bạn được mời bốc thăm và nhận một vé số.',ticket:1,exp:8}] },
          { label:'📌 Phụ dán áp phích', outcomes:[{w:65,good:true,text:'Ban tổ chức cảm ơn bạn bằng 20 Xu.',coins:20,karma:2,exp:8},{w:35,good:true,text:'Bạn được tặng một phần quà bí ẩn.',blindBag:1,exp:7}] }
        ]}
      ],
      busstop: [
        { id:'bus_timetable', icon:'🕒', label:'Bảng Tuyến Xe', x:'31%', y:'48%', title:'Bảng Giờ Xe Thị Trấn', desc:'Bảng lịch trình đặt cạnh biển báo tuyến xe.', actions:[
          { label:'🚌 Chỉ đường cho khách', outcomes:[{w:65,good:true,text:'Một cô khách đi đúng chuyến xe nhờ lời chỉ dẫn của bạn.',karma:3,exp:9},{w:35,good:true,text:'Khách đi xe cảm ơn bằng 12 Xu.',coins:12,exp:7}] },
          { label:'📋 Xem thông báo tuyến', outcomes:[{w:75,good:true,text:'Bạn biết thêm lịch xe đi huyện.',exp:8},{w:25,bad:true,text:'Chuyến xe bạn tò mò vừa rời bến, bạn mất chút thời gian.',energy:-2}] }
        ]},
        { id:'bus_shelter', icon:'🪑', label:'Ghế Chờ', x:'59%', y:'58%', title:'Mái Che Chờ Xe', desc:'Dãy ghế dài dưới mái che, nơi hành khách ngồi đợi xe.', actions:[
          { label:'🧳 Xách hành lý giúp', outcomes:[{w:60,good:true,text:'Bạn giúp người lớn tuổi mang túi đồ lên xe.',karma:4,exp:10},{w:40,good:true,text:'Một hành khách gửi bạn chút tiền cảm ơn.',coins:18,exp:8}] },
          { label:'☁️ Ngồi nghỉ chờ xe', outcomes:[{w:70,good:true,text:'Bạn được nghỉ dưới mái che, hồi thêm năng lượng.',energy:5,exp:5},{w:30,good:true,text:'Bạn được trò chuyện cùng một người đi xa về.',exp:9}] }
        ]},
        { id:'bus_curb', icon:'🚌', label:'Làn Đón Khách', x:'84%', y:'80%', title:'Làn Xe Dừng Đón Khách', desc:'Phần lề đường kẻ vạch để xe ghé đón và trả hành khách.', actions:[
          { label:'🧳 Phụ xếp hành lý', outcomes:[{w:60,good:true,text:'Tài xế cảm ơn vì bạn giúp xếp hành lý lên xe và tặng 22 Xu.',coins:22,exp:10},{w:40,good:true,text:'Một hành khách biếu bạn ít nguyên liệu mang về từ quê.',item:'topping_jelly',qty:2,exp:8}] },
          { label:'🔎 Giúp khách tìm đúng xe', outcomes:[{w:65,good:true,text:'Bạn đưa hành khách đến đúng chuyến xe, được mọi người khen.',karma:4,exp:9},{w:35,bad:true,text:'Chuyến xe đến muộn, bạn mất chút sức chờ đợi.',energy:-3}] }
        ]}
      ],
      clinic: [
        { id:'clinic_gate', icon:'🏥', label:'Cửa Trạm Xá', x:'50%', y:'63%', title:'Cửa Vào Trạm Xá', desc:'Lối vào sạch sẽ, nơi người dân tới khám sức khỏe.', actions:[
          { label:'🤝 Dìu người lớn tuổi', outcomes:[{w:65,good:true,text:'Bạn dìu một bác vào trạm xá, được cảm ơn.',karma:4,exp:10},{w:35,good:true,text:'Người nhà gửi bạn 15 Xu tiền cảm ơn.',coins:15,exp:8}] },
          { label:'🧾 Giúp xếp hàng', outcomes:[{w:75,good:true,text:'Bạn giúp mọi người đi đúng thứ tự.',karma:3,exp:8},{w:25,good:true,text:'Nhân viên mời bạn uống nước rồi nghỉ chân.',energy:5,exp:5}] }
        ]},
        { id:'clinic_notice', icon:'💚', label:'Bảng Sức Khỏe', x:'34%', y:'48%', title:'Góc Tư Vấn Sức Khỏe', desc:'Góc bảng tin tuyên truyền giữ vệ sinh và chăm sóc sức khỏe.', actions:[
          { label:'📖 Xem mẹo giữ sức', outcomes:[{w:70,good:true,text:'Bạn biết thêm cách giữ gìn sức khỏe khi đi làm.',exp:9},{w:30,good:true,text:'Bạn được mời nghỉ chân và lấy lại thể lực.',energy:4,exp:6}] },
          { label:'📌 Phụ treo áp phích', outcomes:[{w:65,good:true,text:'Nhân viên cảm ơn bạn đã sắp xếp bảng tin.',karma:3,exp:9},{w:35,good:true,text:'Bạn nhận 12 Xu hỗ trợ.',coins:12,exp:7}] }
        ]},
        { id:'clinic_garden', icon:'🌿', label:'Bồn Cây', x:'82%', y:'66%', title:'Bồn Cây Trước Trạm Xá', desc:'Bồn cây nhỏ sát lối đi, được các cô chú chăm sóc hằng ngày.', actions:[
          { label:'🌱 Phụ chăm bồn cây', outcomes:[{w:65,good:true,text:'Bạn tưới bồn cây và được cô y tá khen chăm chỉ.',karma:3,exp:8},{w:35,good:true,text:'Bạn được biếu một ít hạt giống.',item:'seed_wheat',qty:2,exp:7}] },
          { label:'🧹 Nhặt lá trên lối đi', outcomes:[{w:70,good:true,text:'Lối đi bên vườn sạch hơn.',karma:3,exp:7},{w:30,bad:true,text:'Bạn mải quét lá nên hơi mất sức.',energy:-2}] }
        ]}
      ],
      temple: [
        { id:'culture_courtyard', icon:'🎭', label:'Sân Văn Hóa', x:'51%', y:'70%', title:'Sân Sinh Hoạt Cộng Đồng', desc:'Sân rộng trước nhà văn hóa, thường diễn ra biểu diễn và sinh hoạt tập thể.', actions:[
          { label:'🎤 Phụ chuẩn bị sân khấu', outcomes:[{w:60,good:true,text:'Ban tổ chức cảm ơn bạn bằng 20 Xu.',coins:20,exp:10},{w:40,good:true,text:'Bạn nhận lời khen vì hỗ trợ rất nhiệt tình.',karma:4,exp:9}] },
          { label:'🪑 Xếp ghế cho hội họp', outcomes:[{w:70,good:true,text:'Hội trường gọn gàng hơn nhờ bạn.',karma:3,exp:8},{w:30,bad:true,text:'Bạn khiêng hơi nhiều ghế nên hơi mệt.',energy:-3}] }
        ]},
        { id:'culture_notice', icon:'📣', label:'Bảng Hội Làng', x:'34%', y:'47%', title:'Bảng Lịch Hội Làng', desc:'Thông báo các buổi văn nghệ, thi nấu ăn và họp tổ dân phố.', actions:[
          { label:'🎏 Xem lịch lễ hội', outcomes:[{w:65,good:true,text:'Bạn biết lịch hội làng để chuẩn bị bán hàng.',exp:10},{w:35,good:true,text:'Bạn nhận vé số từ đợt bốc thăm của hội.',ticket:1,exp:8}] },
          { label:'📌 Phụ cập nhật tin', outcomes:[{w:70,good:true,text:'Bạn được ban tổ chức cảm ơn.',karma:3,exp:8},{w:30,good:true,text:'Bạn nhận một món quà hội làng bí ẩn.',blindBag:1,exp:9}] }
        ]},
        { id:'culture_exhibit', icon:'🏺', label:'Hiên Trưng Bày', x:'81%', y:'54%', title:'Hiên Trưng Bày Kỷ Vật', desc:'Hiên bên nhà văn hóa có các bảng ảnh và kỷ vật dịp sinh hoạt cộng đồng.', actions:[
          { label:'🖼️ Xem ảnh thị trấn xưa', outcomes:[{w:65,good:true,text:'Bạn được nghe câu chuyện lịch sử địa phương.',exp:10},{w:35,good:true,text:'Người hướng dẫn kể bạn bí quyết làm đồ lưu niệm.',exp:9,karma:1}] },
          { label:'🧹 Phụ lau kệ trưng bày', outcomes:[{w:75,good:true,text:'Cô quản lý cảm ơn bạn vì giúp bảo quản kỷ vật.',karma:4,exp:9},{w:25,bad:true,text:'Bạn làm khá lâu nên hơi mỏi tay.',energy:-2}] }
        ]}
      ],
      hill: [
        { id:'hill_path', icon:'🥾', label:'Lối Lên Đồi', x:'28%', y:'79%', title:'Lối Mòn Lên Đồi Sim', desc:'Con đường nhỏ uốn qua vườn sim và những phiến đá.', actions:[
          { label:'🚶 Tản bộ lên dốc', outcomes:[{w:65,good:true,text:'Bạn vượt dốc và tận hưởng khí trời trong lành.',exp:9,energy:2},{w:35,bad:true,text:'Đoạn dốc trơn khiến bạn hơi mệt.',energy:-4,exp:5}] },
          { label:'🧹 Dọn rác trên lối', outcomes:[{w:70,good:true,text:'Bạn giữ lối lên đồi sạch đẹp.',karma:4,exp:9},{w:30,good:true,text:'Một người đi cùng cảm ơn bạn bằng 15 Xu.',coins:15,exp:8}] }
        ]},
        { id:'hill_berry', icon:'🫐', label:'Vạt Sim Tím', x:'51%', y:'62%', title:'Bụi Sim Bên Triền Đồi', desc:'Những khóm sim tím mọc ven lối mòn, điểm nhấn của cả khu đồi.', actions:[
          { label:'🌸 Ngắm hoa sim', outcomes:[{w:70,good:true,text:'Bạn ngắm những bụi hoa tím và thấy thư thái.',energy:5,exp:6},{w:30,good:true,text:'Bạn ghi lại vài ý tưởng trang trí quán.',exp:10}] },
          { label:'🔎 Tìm đồ rơi trong cỏ', outcomes:[{w:40,good:true,text:'Bạn tìm được vài đồng xu trên lối đi.',coins:16,exp:7},{w:30,good:true,text:'Một du khách tặng bạn món quà nhỏ.',blindBag:1,exp:9},{w:30,bad:true,text:'Bạn mò trong cỏ lâu mà không tìm thấy gì.',energy:-3}] }
        ]},
        { id:'hill_view', icon:'🔭', label:'Đài Ngắm Cảnh', x:'79%', y:'36%', title:'Điểm Ngắm Cảnh Trên Đồi', desc:'Từ đây có thể nhìn bao quát hồ nước và thị trấn phía xa.', actions:[
          { label:'📸 Chụp toàn cảnh', outcomes:[{w:70,good:true,text:'Bạn chụp được bức ảnh thị trấn tuyệt đẹp.',exp:10},{w:30,good:true,text:'Một du khách nhờ chụp ảnh và gửi 20 Xu.',coins:20,exp:8}] },
          { label:'🪁 Giúp nhặt diều', outcomes:[{w:50,good:true,text:'Bạn trả mảnh diều cho một bạn nhỏ.',karma:4,exp:9},{w:25,good:true,text:'Bạn được tặng một mảnh diều lưu niệm.',souvenir:'village_kite_piece',exp:11},{w:25,bad:true,text:'Bạn chạy vòng theo gió và khá mệt.',energy:-4}] }
        ]}
      ],
      nightmarket: [
        { id:'game_booth', icon:'🎯', label:'Gian Hội Chợ', x:'42%', y:'46%', title:'Gian Trò Chơi Phố Đèn', desc:'Giữa dãy sạp sáng đèn có gian ném vòng và bốc thăm lấy quà.', actions:[
          { label:'🎲 Chơi thử vận may', outcomes:[{w:35,good:true,text:'Bạn thắng một túi quà bí ẩn!',blindBag:1,coins:-10,exp:10},{w:35,good:true,text:'Bạn nhận được một vé số khuyến mãi.',ticket:1,coins:-10,exp:8},{w:30,bad:true,text:'Bạn chơi chưa trúng gì, mất 10 Xu tiền vé.',coins:-10,exp:4}] },
          { label:'📣 Phụ gọi khách', outcomes:[{w:60,good:true,text:'Chủ gian gửi bạn 25 Xu tiền công.',coins:25,karma:2,exp:9},{w:40,good:true,text:'Bạn được tặng đồng xu kỷ niệm phố đèn.',souvenir:'village_night_token',exp:10}] }
        ]},
        { id:'lantern_lane', icon:'🏮', label:'Dãy Đèn Lồng', x:'66%', y:'53%', title:'Dãy Đèn Lồng Lung Linh', desc:'Những dây đèn phủ kín lối phố, không khí rộn ràng khi đêm xuống.', actions:[
          { label:'✨ Ngắm đèn dạo phố', outcomes:[{w:70,good:true,text:'Khung cảnh lung linh giúp bạn thấy thư thái.',energy:4,exp:5},{w:30,good:true,text:'Bạn được người làm đèn chia sẻ một mẹo khéo tay.',exp:9}] },
          { label:'🪜 Giúp treo đèn', outcomes:[{w:65,good:true,text:'Người bán tặng bạn 18 Xu vì giúp treo đèn.',coins:18,exp:8},{w:35,good:true,text:'Bạn được giữ món kỷ niệm nhỏ từ hội đèn.',souvenir:'village_night_token',exp:10}] }
        ]},
        { id:'night_snack', icon:'🍢', label:'Quầy Ăn Đêm', x:'85%', y:'71%', title:'Sạp Ăn Vặt Ban Đêm', desc:'Mùi xiên nướng thơm phức từ góc phố đông người.', actions:[
          { label:'🍢 Phụ xếp bàn đồ ăn', outcomes:[{w:65,good:true,text:'Chủ sạp cảm ơn bạn bằng 20 Xu.',coins:20,exp:9},{w:35,good:true,text:'Bạn được biếu ít topping còn mới.',item:'topping_jelly',qty:2,exp:8}] },
          { label:'🧹 Dọn quanh quầy', outcomes:[{w:75,good:true,text:'Khu phố đêm sạch đẹp hơn.',karma:3,exp:8},{w:25,bad:true,text:'Bạn bận rộn khá lâu nên mất chút sức.',energy:-3}] }
        ]}
      ],
      district: [
        { id:'district_stall', icon:'🌉', label:'Lối Dạo Ven Biển', x:'18%', y:'73%', title:'Lối Dạo Ven Biển', desc:'Con đường lát đá sát lan can nhìn ra vùng nước xanh cạnh trung tâm thị trấn.', actions:[
          { label:'🧹 Dọn lối dạo', outcomes:[{w:45,good:true,text:'Ban quản lý thưởng 22 Xu vì bạn giữ lối đi sạch đẹp.',coins:22,karma:2,exp:10},{w:30,good:true,text:'Một du khách tặng bạn túi quà lưu niệm bí ẩn.',blindBag:1,exp:9},{w:25,bad:true,text:'Lối dạo khá dài khiến bạn tốn chút sức.',energy:-3}] },
          { label:'📸 Ngắm phố và chụp ảnh', outcomes:[{w:50,good:true,text:'Bạn chụp được cảnh đẹp và nảy ra ý tưởng trang trí quán.',exp:9},{w:30,good:true,text:'Một người tổ chức tham quan tặng bạn vé số lấy hên.',ticket:1,exp:8},{w:20,bad:true,text:'Bạn dạo khá lâu nên hơi mỏi chân.',energy:-2}] }
        ]},
        { id:'district_board', icon:'🏛️', label:'Tòa Thị Chính', x:'59%', y:'44%', title:'Tòa Nhà Thị Chính', desc:'Tòa nhà lớn nhìn ra quảng trường, nơi niêm yết thông báo chung và lịch sự kiện thị trấn.', actions:[
          { label:'📣 Đọc tin trong ngày', outcomes:[{w:55,good:true,text:'Bạn biết thêm lịch sự kiện lớn trong thị trấn.',exp:10,karma:1},{w:25,good:true,text:'Bạn nhận phiếu bốc thăm khuyến mãi.',ticket:1,exp:8},{w:20,bad:true,text:'Thông báo bạn cần chưa cập nhật, hơi mất thời gian.',energy:-2}] },
          { label:'🧹 Phụ sắp bảng tin', outcomes:[{w:45,good:true,text:'Quản lý khu trung tâm cảm ơn bạn.',karma:4,exp:10},{w:35,good:true,text:'Bạn được gửi một vé số lấy hên.',ticket:1,exp:8},{w:20,bad:true,text:'Bạn đợi người phụ trách hơi lâu.',energy:-3}] }
        ]},
        { id:'district_stop', icon:'⛲', label:'Đài Phun', x:'53%', y:'73%', title:'Đài Phun Nước Trung Tâm', desc:'Đài phun lớn nằm giữa quảng trường hiện đại, nơi khách tham quan chụp hình.', actions:[
          { label:'📸 Chụp ảnh cho khách', outcomes:[{w:45,good:true,text:'Một nhóm khách thưởng bạn 24 Xu.',coins:24,exp:10},{w:30,good:true,text:'Du khách tặng bạn chút nguyên liệu mới.',item:'topping_jelly',qty:2,exp:8},{w:25,bad:true,text:'Bạn chụp nhiều lần mà khách chưa ưng.',energy:-3}] },
          { label:'🤝 Giúp khách tìm đường', outcomes:[{w:55,good:true,text:'Bạn giúp khách tìm tới đúng khu cần ghé.',karma:3,exp:9},{w:25,good:true,text:'Một du khách cảm ơn bằng 12 Xu.',coins:12,exp:7},{w:20,bad:true,text:'Bạn chỉ đường vòng nên hơi mất công.',energy:-2}] }
        ]}
      ],
      // Điểm mặc định chỉ dành cho tình huống zone không xác định, không còn dùng cho 11 khu chính.
      default: [
        { id:'rest_stop', icon:'📍', label:'Góc Nghỉ', x:'27%', y:'57%', title:'Góc Nghỉ Chân', desc:'Một điểm nhỏ để người đi đường ghé lại.', actions:[
          {label:'😌 Ngồi nghỉ',outcomes:[{w:75,good:true,text:'Bạn nghỉ lấy sức.',energy:4,exp:4},{w:25,good:true,text:'Bạn nghe chuyện vui của người qua đường.',exp:7}]}
        ]},
        { id:'small_shop', icon:'🏪', label:'Tiệm Tạp Hóa', x:'73%', y:'56%', title:'Tiệm Tạp Hóa', desc:'Một cửa hàng nhỏ cạnh đường.', actions:[
          {label:'📦 Phụ xếp hàng',outcomes:[{w:60,good:true,text:'Chủ tiệm gửi bạn 15 Xu.',coins:15,exp:8},{w:40,good:true,text:'Bạn nhận vài món dùng thử.',item:'topping_boba',qty:2,exp:8}]}
        ]}
      ]
    };


        const VILLAGE_NPC_LIBRARY = {
      bebo:{ id:'bebo', name:'Bé Bơ', chibi:'male', accent:'🍀', bubble:'Đi dạo nè!', tags:['lane','market','riverside','nightmarket'], desc:'Cậu bé hiếu động thích chạy lon ton khắp làng và hay nhặt được đồ hay ho.', actions:[
        { label:'💬 Trò chuyện', outcomes:[{w:55, good:true, text:'Bé Bơ kể bạn nghe chuyện làng vui ơi là vui.', exp:7, karma:2},{w:25, good:true, text:'Bé Bơ dúi bạn 1 Vé Số “nhặt được ở ven đường”.', ticket:1, exp:7},{w:20, good:true, text:'Bé Bơ biếu bạn 8 Xu tiền lẻ cất trong túi áo.', coins:8, exp:5}] },
        { label:'🧺 Nhờ Bơ dẫn đi nhặt đồ', outcomes:[{w:40, good:true, text:'Hai người tìm được một Túi Mù ai đánh rơi ở hội chợ.', blindBag:1, exp:10},{w:40, good:true, text:'Bé Bơ chỉ cho bạn chỗ nhặt được ít xu lẻ.', coins:15, exp:8},{w:20, bad:true, text:'Hai người chạy vòng vòng vui thôi chứ chẳng có gì đặc biệt.', energy:-3, exp:4}] }
      ]},
      mika:{ id:'mika', name:'Mika', chibi:'female', accent:'🌸', bubble:'Cho tớ đi cùng~', tags:['market','school','nightmarket','district'], desc:'Mika thích ngắm chợ và rất giỏi hỏi thăm tin tức trong làng.', actions:[
        { label:'🗣️ Tán gẫu hỏi tin', outcomes:[{w:50, good:true, text:'Mika kể bạn nghe một mẹo buôn bán nhỏ khá hữu ích.', exp:9, karma:1},{w:30, good:true, text:'Mika tặng bạn một mã ưu đãi nho nhỏ, quy đổi thành 12 Xu.', coins:12, exp:6},{w:20, good:true, text:'Mika cho bạn 1 Vé Số lấy hên.', ticket:1, exp:7}] },
        { label:'🎁 Chọn quà lưu niệm cùng Mika', outcomes:[{w:45, good:true, text:'Mika chọn trúng món quà nhỏ và tặng bạn giữ làm kỷ niệm.', souvenir:'village_kite_piece', exp:10},{w:35, good:true, text:'Bạn được nhận 1 Túi Mù nho nhỏ từ quầy quà.', blindBag:1, exp:8},{w:20, bad:true, text:'Dạo quầy quà vui quá nên bạn hơi tốn sức.', energy:-4, exp:4}] }
      ]},
      baTu:{ id:'baTu', name:'Bà Tư', chibi:'female', accent:'🧺', bubble:'Ai giúp bà với?', tags:['lane','market','temple','clinic'], desc:'Bà Tư hiền lắm, thường xách theo giỏ quà và hay nhờ giúp việc lặt vặt.', actions:[
        { label:'🤝 Xách giúp giỏ đồ', outcomes:[{w:60, good:true, text:'Bà Tư cảm ơn rối rít rồi tặng bạn 18 Xu.', coins:18, karma:3, exp:9},{w:25, good:true, text:'Bà Tư biếu bạn ít mật ong quê.', item:'honey', qty:1, exp:8},{w:15, good:true, text:'Bà Tư tặng bạn 1 Vé Số “lấy hên”.', ticket:1, exp:8}] },
        { label:'🍵 Ngồi nghe bà kể chuyện', outcomes:[{w:50, good:true, text:'Bà Tư kể chuyện làng xưa làm bạn thấy ấm lòng.', energy:4, karma:2, exp:7},{w:50, good:true, text:'Bà nhờ bạn chuyển lời cảm ơn tới hàng xóm, ai cũng quý bạn hơn.', karma:4, exp:9}] }
      ]},
      chuNam:{ id:'chuNam', name:'Chú Năm', chibi:'male', accent:'🛠️', bubble:'Rảnh phụ chú nhé?', tags:['ricefield','busstop','riverside','district'], desc:'Chú Năm lúc nào cũng tất bật, khi thì sửa đồ, khi thì chở hàng quanh làng.', actions:[
        { label:'🔧 Phụ việc một tay', outcomes:[{w:55, good:true, text:'Chú Năm gửi bạn 22 Xu vì phụ việc nhanh nhẹn.', coins:22, exp:10},{w:25, good:true, text:'Chú Năm tặng bạn một ít nguyên liệu còn dư.', item:'tea_black', qty:2, exp:8},{w:20, bad:true, text:'Việc hơi nặng, bạn mất chút thể lực.', energy:-4, exp:5}] },
        { label:'🚚 Xin đi theo xe hàng', outcomes:[{w:40, good:true, text:'Bạn được đi cùng và nhặt được vài đồng xu ven đường.', coins:14, exp:8},{w:35, good:true, text:'Chú Năm tặng bạn 1 Túi Mù từ chuyến hàng mới.', blindBag:1, exp:9},{w:25, good:true, text:'Bạn học được vài chuyện hay về vùng huyện.', exp:10}] }
      ]},
      coLua:{ id:'coLua', name:'Cô Lúa', chibi:'female', accent:'🌾', bubble:'Lúa đẹp quá ha', tags:['ricefield','lane','hill'], desc:'Cô Lúa hay chăm đồng, cười dịu và rất mát tay với cây cối.', actions:[
        { label:'🌱 Hỏi mẹo trồng trọt', outcomes:[{w:55, good:true, text:'Cô Lúa chỉ bạn mẹo trồng cây gọn gàng.', exp:9, karma:2},{w:25, good:true, text:'Cô Lúa tặng bạn ít hạt giống.', item:'seed_wheat', qty:2, exp:8},{w:20, good:true, text:'Cô Lúa dúi cho bạn 10 Xu mua nước.', coins:10, exp:6}] },
        { label:'🪣 Phụ tưới / gom nông sản', outcomes:[{w:60, good:true, text:'Cô Lúa cảm ơn và cho bạn 1 Vé Số làm quà.', ticket:1, exp:8},{w:40, good:true, text:'Bạn phụ việc xong và được tặng chút quà quê.', blindBag:1, exp:9}] }
      ]},
      bacCau:{ id:'bacCau', name:'Bác Cầu', chibi:'male', accent:'🪷', bubble:'Qua cầu cẩn thận nha', tags:['riverside','lane','nightmarket'], desc:'Bác Cầu trông coi bến nước và cây cầu đá nên biết nhiều chuyện quanh sông.', actions:[
        { label:'🌊 Hỏi chuyện bờ sông', outcomes:[{w:50, good:true, text:'Bác chỉ cho bạn chỗ đẹp để ngắm sen.', energy:4, exp:7},{w:25, good:true, text:'Bác gửi bạn 15 Xu vì vừa phụ nhắc người qua cầu.', coins:15, exp:8},{w:25, good:true, text:'Bác tặng bạn chiếc thẻ lưu niệm nhỏ ven sông.', souvenir:'village_good_deed_badge', exp:10}] },
        { label:'🧹 Phụ dọn lối đi', outcomes:[{w:70, good:true, text:'Lối đi sạch hơn, ai cũng khen bạn.', karma:4, exp:8},{w:30, good:true, text:'Bác thưởng bạn 1 Túi Mù vì chăm chỉ.', blindBag:1, exp:9}] }
      ]},
      anhPho:{ id:'anhPho', name:'Anh Phố', chibi:'male', accent:'🏙️', bubble:'Đi lên huyện không?', tags:['district','busstop','market'], desc:'Anh Phố là người nhanh nhẹn, thường đi chợ huyện rồi ghé làng.', actions:[
        { label:'🚌 Hỏi tin phố huyện', outcomes:[{w:55, good:true, text:'Anh Phố kể bạn nghe nhiều chuyện mới mẻ từ huyện.', exp:10, karma:1},{w:25, good:true, text:'Anh Phố cho bạn 20 Xu tiền thối còn dư.', coins:20, exp:7},{w:20, good:true, text:'Anh Phố tặng bạn 1 Vé Số từ thị trấn.', ticket:1, exp:8}] },
        { label:'📦 Nhờ xách hộ gói hàng', outcomes:[{w:65, good:true, text:'Bạn xách hàng giúp và nhận 18 Xu.', coins:18, exp:9},{w:35, good:true, text:'Anh Phố tặng bạn một món quà nhỏ giữ làm lưu niệm.', blindBag:1, exp:9}] }
      ]}
    };

    const VILLAGE_NPC_ART = {
      bebo:`assets/images/116_bebo_a23ed6191e.webp`,
      mika:`assets/images/117_mika_6fcbe1c0ec.webp`,
      baTu:`assets/images/118_batu_f08005b5ea.webp`,
      chuNam:`assets/images/119_chunam_b7520623c6.webp`,
      coLua:`assets/images/120_colua_898b7112a3.webp`,
      bacCau:`assets/images/121_baccau_587b6f1a56.webp`,
      anhPho:`assets/images/122_anhpho_781115f15e.webp`,
    };

    const VILLAGE_NPC_ZONE_ROSTER = {
      lane:['bebo','baTu','bacCau'],
      market:['mika','bebo','anhPho'],
      school:['mika','bebo','coLua'],
      ricefield:['coLua','chuNam','bebo'],
      riverside:['bacCau','bebo','chuNam'],
      busstop:['anhPho','chuNam','mika'],
      clinic:['baTu','mika','chuNam'],
      temple:['baTu','mika','bacCau'],
      hill:['coLua','bebo','mika'],
      nightmarket:['mika','bacCau','bebo'],
      district:['anhPho','mika','chuNam']
    };

    const VILLAGE_NPC_META = {
      bebo:{ rarity:'common', events:['sunny_day','cloudy_day'], avoidEvents:['storm_day'], anchor:{ district:0, market:0, lane:0 } },
      mika:{ rarity:'common', events:['cloudy_day','night_fair','light_rain'], avoidEvents:['storm_day'], anchor:{ district:1, market:1, school:1 } },
      baTu:{ rarity:'common', events:['light_rain','cold_day'], anchor:{ lane:0, clinic:0, temple:0, district:1 } },
      chuNam:{ rarity:'uncommon', events:['heavy_rain','district_parcel'], anchor:{ district:2, busstop:1, ricefield:1 } },
      coLua:{ rarity:'uncommon', events:['sunny_day','cloudy_day'], avoidEvents:['storm_day','heavy_rain'], anchor:{ lane:1, ricefield:0, hill:0 } },
      bacCau:{ rarity:'uncommon', events:['light_rain','cloudy_day'], avoidEvents:['storm_day'], anchor:{ lane:1, riverside:0, nightmarket:1 } },
      anhPho:{ rarity:'rare', events:['heavy_rain','storm_day','hot_day'], anchor:{ district:2, busstop:0, market:2 } }
    };

    const VILLAGE_NPC_ANCHORS = {
      lane:[{x:'9%',y:'81%'},{x:'72%',y:'59%'}],
      market:[{x:'62%',y:'81%'},{x:'86%',y:'81%'}],
      school:[{x:'26%',y:'56%'},{x:'70%',y:'57%'}],
      ricefield:[{x:'84%',y:'79%'},{x:'14%',y:'81%'}],
      riverside:[{x:'24%',y:'52%'},{x:'70%',y:'54%'}],
      busstop:[{x:'24%',y:'58%'},{x:'68%',y:'58%'}],
      clinic:[{x:'28%',y:'56%'},{x:'70%',y:'56%'}],
      temple:[{x:'28%',y:'58%'},{x:'70%',y:'58%'}],
      hill:[{x:'28%',y:'53%'},{x:'72%',y:'55%'}],
      nightmarket:[{x:'28%',y:'56%'},{x:'72%',y:'56%'}],
      district:[{x:'18%',y:'61%'},{x:'50%',y:'48%'},{x:'82%',y:'60%'}],
      default:[{x:'18%',y:'61%'},{x:'50%',y:'48%'},{x:'82%',y:'60%'}]
    };

    const VILLAGE_NPC_PATHS = {
      lane:[{x:'14%',y:'60%'},{x:'28%',y:'66%'},{x:'45%',y:'58%'},{x:'63%',y:'62%'},{x:'80%',y:'56%'}],
      market:[{x:'18%',y:'60%'},{x:'35%',y:'54%'},{x:'50%',y:'65%'},{x:'67%',y:'56%'},{x:'84%',y:'64%'}],
      school:[{x:'16%',y:'61%'},{x:'32%',y:'54%'},{x:'49%',y:'63%'},{x:'68%',y:'56%'},{x:'84%',y:'60%'}],
      ricefield:[{x:'18%',y:'64%'},{x:'36%',y:'57%'},{x:'50%',y:'67%'},{x:'70%',y:'58%'},{x:'84%',y:'63%'}],
      riverside:[{x:'15%',y:'54%'},{x:'30%',y:'61%'},{x:'49%',y:'66%'},{x:'67%',y:'58%'},{x:'84%',y:'52%'}],
      busstop:[{x:'16%',y:'62%'},{x:'34%',y:'56%'},{x:'50%',y:'64%'},{x:'68%',y:'56%'},{x:'84%',y:'62%'}],
      clinic:[{x:'18%',y:'60%'},{x:'34%',y:'53%'},{x:'48%',y:'64%'},{x:'66%',y:'56%'},{x:'82%',y:'60%'}],
      temple:[{x:'16%',y:'62%'},{x:'34%',y:'55%'},{x:'50%',y:'66%'},{x:'66%',y:'58%'},{x:'82%',y:'61%'}],
      hill:[{x:'16%',y:'60%'},{x:'34%',y:'51%'},{x:'50%',y:'63%'},{x:'69%',y:'56%'},{x:'84%',y:'49%'}],
      nightmarket:[{x:'17%',y:'61%'},{x:'34%',y:'54%'},{x:'50%',y:'66%'},{x:'68%',y:'57%'},{x:'84%',y:'50%'}],
      district:[{x:'18%',y:'61%'},{x:'36%',y:'54%'},{x:'52%',y:'66%'},{x:'69%',y:'58%'},{x:'84%',y:'61%'}],
      default:[{x:'18%',y:'62%'},{x:'38%',y:'56%'},{x:'56%',y:'66%'},{x:'74%',y:'58%'}]
    };

    const VILLAGE_ENCOUNTERS = [
      {
        id:'lost_wallet', icon:'👛', title:'Ví Rơi Bên Đường',
        zones:['lane','market','district'],
        desc:'Một chiếc ví nằm sát mép đường, bên trong có giấy tờ của người trong làng.',
        choices:[
          { label:'🏃 Tìm người đánh rơi', outcomes:[
            {w:45, good:true, text:'Bạn tìm được chủ ví. Họ cảm ơn và biếu bạn 35 Xu.', coins:35, exp:18, karma:5},
            {w:25, good:true, text:'Chủ ví không lấy lại tiền cảm ơn nhưng tặng bạn một Vé Số.', ticket:1, exp:18, karma:5},
            {w:30, good:true, text:'Bạn trả được ví nhưng người ta chỉ kịp cảm ơn rồi chạy đi.', exp:14, karma:5}
          ]},
          { label:'🏢 Mang tới chốt công an xã', outcomes:[
            {w:70, good:true, text:'Ví được bàn giao đúng người. Bạn được ghi nhận là người tốt việc tốt.', exp:16, karma:6},
            {w:30, good:true, text:'Một cán bộ tặng bạn huy hiệu nhỏ vì sự trung thực.', souvenir:'village_good_deed_badge', exp:20, karma:7}
          ]},
          { label:'🤫 Giữ tạm rồi tính sau', outcomes:[
            {w:45, bad:true, text:'Chủ ví quay lại tìm và hiểu lầm bạn đang giữ ví. Bạn mất cả buổi giải thích.', energy:-10, karma:-6},
            {w:35, bad:true, text:'Có người báo mất ví. Bạn phải lên chốt giải thích rồi trả lại, rất mất thời gian.', energy:-15, karma:-8},
            {w:20, bad:true, text:'Bạn giữ lại 25 Xu nhưng thấy áy náy và người làng bớt tin bạn.', coins:25, karma:-10}
          ]}
        ]
      },
      {
        id:'mystery_bag', icon:'👜', title:'Túi Đồ Không Người Nhận',
        zones:['lane','market'],
        desc:'Một túi vải cũ nằm cạnh ghế đá, không biết là đồ bỏ quên hay của ai đó đánh rơi.',
        choices:[
          { label:'📢 Hỏi quanh xem của ai', outcomes:[
            {w:45, good:true, text:'Bạn tìm được chủ túi. Họ tặng lại 1 Túi Mù làm quà cảm ơn.', blindBag:1, karma:5, exp:15},
            {w:35, good:true, text:'Không tìm được chủ nhưng trong túi có tên và địa chỉ. Bạn mang trả tận nhà.', coins:20, karma:6, exp:18},
            {w:20, good:true, text:'Chủ túi là một cụ bà. Bà dúi cho bạn ít hạt giống.', item:'seed_strawberry', qty:2, karma:5, exp:15}
          ]},
          { label:'👀 Mở thử xem bên trong', outcomes:[
            {w:35, text:'Chỉ là quần áo cũ và vài đồ lặt vặt, không có gì đặc biệt.', exp:3},
            {w:30, bad:true, text:'Chủ túi quay lại đúng lúc bạn đang mở. Mọi người phải giải thích một hồi mới rõ.', karma:-5, energy:-8},
            {w:20, bad:true, text:'Túi đã được báo thất lạc. Bạn bị mời tới chốt để xác minh rồi trả lại.', karma:-6, energy:-12},
            {w:15, good:true, text:'Bên trong có mảnh giấy nhờ ai nhặt được mang tới đình làng. Bạn làm đúng và được cảm ơn.', coins:30, karma:4, exp:12}
          ]}
        ]
      },
      {
        id:'elder_baskets', icon:'👵', title:'Bà Cụ Xách Hai Giỏ Nặng',
        zones:['lane','market'],
        desc:'Một bà cụ đang loay hoay với hai giỏ rau khá nặng ở đầu ngõ.',
        choices:[
          { label:'🧺 Xách giúp bà về nhà', outcomes:[
            {w:40, good:true, text:'Bà tặng bạn 25 Xu mua nước.', coins:25, karma:5, exp:14},
            {w:25, good:true, text:'Bà không có tiền lẻ nên tặng bạn 1 Vé Số Cào.', ticket:1, karma:5, exp:14},
            {w:20, good:true, text:'Bà cho bạn một ít nông sản mới hái.', item:'crop_wheat', qty:3, karma:5, exp:14},
            {w:15, bad:true, text:'Người nhà chạy ra tưởng bạn cầm nhầm giỏ. Sau khi bà giải thích thì mọi chuyện ổn, nhưng khá ngượng.', energy:-5, exp:8, karma:1}
          ]},
          { label:'📣 Gọi người nhà bà ra giúp', outcomes:[
            {w:75, good:true, text:'Bạn gọi đúng người nhà tới đón bà. Cả nhà cảm ơn bạn.', karma:3, exp:10},
            {w:25, good:true, text:'Người nhà tặng bạn vài quả trứng để cảm ơn.', item:'egg', qty:2, karma:3, exp:10}
          ]}
        ]
      },
      {
        id:'old_bike', icon:'🚲', title:'Cụ Ông Tuột Xích Xe',
        zones:['lane','riverside'],
        desc:'Một cụ ông dắt chiếc xe đạp cũ vì xích vừa tuột giữa đường.',
        choices:[
          { label:'🔧 Ghé vào sửa giúp', outcomes:[
            {w:50, good:true, text:'Bạn lắp lại xích. Cụ ông tặng 30 Xu tiền cà phê.', coins:30, karma:4, exp:16},
            {w:25, good:true, text:'Cụ ông tặng bạn chiếc Vé Chợ Phiên Cũ làm kỷ niệm.', souvenir:'old_market_ticket', karma:4, exp:18},
            {w:25, text:'Sửa hơi lâu, tay dính đầy dầu nhưng cuối cùng xe chạy được.', energy:-5, karma:3, exp:14}
          ]},
          { label:'📞 Gọi thợ quen giúp cụ', outcomes:[
            {w:70, good:true, text:'Thợ tới nhanh. Cụ cảm ơn vì bạn không bỏ mặc.', karma:2, exp:8},
            {w:30, good:true, text:'Thợ miễn phí công và cụ mua cho bạn chai nước.', coins:10, karma:2, exp:8}
          ]}
        ]
      },
      {
        id:'lost_child', icon:'🧒', title:'Bé Con Đi Lạc Ở Chợ',
        zones:['market','temple'],
        desc:'Một bé con đang khóc vì không tìm thấy người nhà giữa chỗ đông người.',
        choices:[
          { label:'🤝 Dắt bé đi tìm người nhà', outcomes:[
            {w:40, good:true, text:'Bạn gặp được mẹ bé. Gia đình tặng 40 Xu cảm ơn.', coins:40, karma:7, exp:22},
            {w:25, good:true, text:'Gia đình làm nghề bán đồ chơi, họ tặng bạn 1 Túi Mù.', blindBag:1, karma:7, exp:22},
            {w:20, good:true, text:'Người nhà mừng quá, tặng bạn 1 Vé Số.', ticket:1, karma:7, exp:22},
            {w:15, good:true, text:'Không nhận quà, nhưng câu chuyện tốt bụng của bạn lan quanh chợ.', karma:9, exp:25}
          ]},
          { label:'📢 Báo ban quản lý chợ', outcomes:[
            {w:85, good:true, text:'Loa chợ thông báo và người nhà tới đón bé.', karma:4, exp:14},
            {w:15, good:true, text:'Ban quản lý ghi nhận bạn đã xử lý bình tĩnh.', souvenir:'village_good_deed_badge', karma:5, exp:16}
          ]}
        ]
      },
      {
        id:'stray_dog', icon:'🐕', title:'Chú Chó Vàng Lạc Chủ',
        zones:['lane','riverside'],
        desc:'Một chú chó vàng cứ đi theo bạn, cổ có chiếc thẻ tên đã cũ.',
        choices:[
          { label:'🐾 Tìm địa chỉ trên thẻ', outcomes:[
            {w:45, good:true, text:'Bạn đưa được chú chó về nhà. Chủ nhà tặng 30 Xu.', coins:30, karma:5, exp:16},
            {w:25, good:true, text:'Chủ nhà tặng lại chiếc thẻ tên cũ làm kỷ niệm.', souvenir:'village_dog_tag', karma:5, exp:18},
            {w:30, good:true, text:'Chủ chó cảm ơn rối rít nhưng không nhận quà gì thêm.', karma:5, exp:15}
          ]},
          { label:'🥛 Mua chút đồ cho nó ăn (-8 Xu)', outcomes:[
            {w:55, good:true, text:'Ăn xong nó tự chạy về đúng nhà, còn chủ nó quay lại cảm ơn.', coins:-8, karma:4, exp:10},
            {w:45, good:true, text:'Nó dẫn bạn tới một túi hạt giống mắc ở bụi cây.', coins:-8, item:'seed_wheat', qty:3, karma:3, exp:10}
          ]}
        ]
      },
      {
        id:'fallen_crate', icon:'📦', title:'Thùng Hàng Đổ Giữa Chợ',
        zones:['market','district'],
        desc:'Một người bán hàng làm đổ cả thùng nguyên liệu xuống đường.',
        choices:[
          { label:'🙌 Phụ nhặt lại hàng', outcomes:[
            {w:30, good:true, text:'Người bán biếu bạn ít bắp ngọt.', item:'crop_corn', qty:2, karma:4, exp:14},
            {w:30, good:true, text:'Bạn được biếu vài hạt dâu giống.', item:'seed_strawberry', qty:2, karma:4, exp:14},
            {w:25, good:true, text:'Người bán gửi bạn 25 Xu tiền cảm ơn.', coins:25, karma:4, exp:14},
            {w:15, text:'Nhặt xong thì trời đổ mưa, bạn hơi mệt nhưng hàng đã cứu được hết.', energy:-5, karma:4, exp:14}
          ]},
          { label:'🚶 Đi tiếp vì đang vội', outcomes:[
            {w:100, text:'Bạn tiếp tục chuyến đi. Không có chuyện gì thêm.', exp:2}
          ]}
        ]
      },
      {
        id:'snatch_thief', icon:'🏃‍♂️', title:'Kẻ Gian Giật Túi',
        zones:['market','district'],
        reqLevel:6,
        desc:'Một người vừa giật túi của khách rồi chạy qua trước mặt bạn.',
        choices:[
          { label:'📣 Hô hoán và cùng mọi người chặn lại', outcomes:[
            {w:45, good:true, text:'Mọi người phối hợp chặn được kẻ gian. Bạn được tặng Giấy Khen.', souvenir:'village_police_certificate', coins:45, karma:10, exp:30},
            {w:35, good:true, text:'Kẻ gian bỏ túi lại rồi chạy mất. Chủ túi tặng bạn 50 Xu.', coins:50, karma:8, exp:25},
            {w:20, text:'Không chặn kịp nhưng bạn nhớ đặc điểm và báo lại cho công an xã.', karma:5, exp:20}
          ]},
          { label:'📞 Báo công an xã và chỉ hướng chạy', outcomes:[
            {w:60, good:true, text:'Thông tin của bạn giúp lực lượng gần đó bắt được người giật túi.', souvenir:'village_patrol_whistle', karma:8, exp:25},
            {w:40, good:true, text:'Bạn hỗ trợ làm chứng. Chủ túi gửi lời cảm ơn.', coins:30, karma:6, exp:20}
          ]},
          { label:'🏃 Đuổi theo một đoạn', outcomes:[
            {w:35, good:true, text:'Bạn và vài người dân đuổi kịp, lấy lại được túi.', coins:60, karma:8, exp:25, energy:-8},
            {w:40, text:'Kẻ gian chạy quá nhanh. Bạn mệt bở hơi tai nhưng đã báo đúng hướng.', karma:3, exp:14, energy:-12},
            {w:25, bad:true, text:'Bạn vấp phải ổ gà khi đuổi theo, đành dừng lại và báo mọi người hỗ trợ.', energy:-18, exp:8}
          ]}
        ]
      },
      {
        id:'wrong_suspicion', icon:'🧢', title:'Nghi Nhầm Người Móc Túi',
        zones:['market','district'],
        reqLevel:6,
        desc:'Bạn thấy một người đứng rất sát túi của khách khác, trông khá đáng ngờ.',
        choices:[
          { label:'🗣️ Nhắc khéo người bị đứng sát', outcomes:[
            {w:55, good:true, text:'Đúng là có người định móc túi. Nạn nhân kịp tránh và cảm ơn bạn.', coins:25, karma:5, exp:16},
            {w:45, text:'Hóa ra chỉ là chỗ đông. Bạn xin lỗi nhẹ nhàng nên không có chuyện gì.', exp:5}
          ]},
          { label:'📣 Hô lớn “móc túi!”', outcomes:[
            {w:30, good:true, text:'Bạn đoán đúng. Người khả nghi bỏ chạy và mọi người bảo vệ được tài sản.', karma:5, exp:15},
            {w:70, bad:true, text:'Bạn đoán sai, người bị nghi rất bực. Bạn phải xin lỗi trước đám đông.', karma:-6, exp:2}
          ]}
        ]
      },
      {
        id:'river_bottle', icon:'🍾', title:'Chai Thủy Tinh Trôi Bờ Sông',
        zones:['riverside'],
        desc:'Một chai thủy tinh mắc trong đám cỏ, bên trong có cuộn giấy nhỏ.',
        choices:[
          { label:'📜 Mở thư xem', outcomes:[
            {w:40, text:'Chỉ là một lời nhắn cũ của nhóm học sinh từ nhiều năm trước.', exp:8},
            {w:30, good:true, text:'Tờ giấy chỉ tới một hộp đạo cụ cũ gần đình làng. Bạn tìm được chiếc chìa khóa đồng.', souvenir:'village_old_key', exp:22, karma:2},
            {w:30, good:true, text:'Bên trong có lời cảm ơn người nhặt được và một mã đổi Vé Số tại tiệm tạp hóa.', ticket:1, exp:12}
          ]},
          { label:'♻️ Nhặt chai mang đi tái chế', outcomes:[
            {w:75, good:true, text:'Bạn dọn sạch một món rác khỏi bờ sông.', karma:3, exp:8},
            {w:25, good:true, text:'Cô thu mua ve chai tặng bạn 10 Xu vì tiện tay giúp dọn.', coins:10, karma:3, exp:8}
          ]}
        ]
      },
      {
        id:'festival_help', icon:'🎏', title:'Đình Làng Đang Treo Cờ Hội',
        zones:['temple'],
        reqStage:3,
        desc:'Mọi người đang chuẩn bị cờ, đèn và sân khấu cho buổi lễ sắp tới.',
        choices:[
          { label:'🏮 Phụ treo đèn một lúc', outcomes:[
            {w:45, good:true, text:'Bạn làm khá khéo và được mời ăn bữa cơm chung.', exp:20, karma:5, energy:-5},
            {w:30, good:true, text:'Ban tổ chức tặng bạn Mặt Nạ Hội Làng làm kỷ niệm.', souvenir:'festival_mask', karma:5, exp:22},
            {w:25, good:true, text:'Một cô trong ban lễ hội tặng bạn 1 Túi Mù từ gian trò chơi.', blindBag:1, karma:4, exp:18}
          ]},
          { label:'🧹 Phụ quét dọn sân đình', outcomes:[
            {w:70, good:true, text:'Sân đình sạch bong. Mọi người nhớ mặt bạn là người nhiệt tình.', karma:6, exp:18},
            {w:30, good:true, text:'Bạn nhặt thấy món đồ đạo cụ cũ và được cho giữ làm kỷ niệm.', souvenir:'village_old_key', karma:4, exp:18}
          ]}
        ]
      },
      {
        id:'market_argument', icon:'🗯️', title:'Hai Người Bán Hàng Cãi Nhau',
        zones:['market'],
        desc:'Hai sạp cạnh nhau đang tranh cãi vì một thùng hàng bị đặt lấn sang lối đi.',
        choices:[
          { label:'🤝 Khuyên hai bên bình tĩnh', outcomes:[
            {w:55, good:true, text:'Hai bên chịu lùi lại và cùng sắp hàng cho gọn.', karma:4, exp:12},
            {w:25, good:true, text:'Một cô bán hàng cảm ơn bằng 15 Xu.', coins:15, karma:3, exp:10},
            {w:20, bad:true, text:'Cả hai đang nóng nên quay sang bảo bạn đừng xen vào. Bạn đành rút lui.', karma:-1, exp:3}
          ]},
          { label:'🚶 Tránh sang lối khác', outcomes:[
            {w:100, text:'Bạn không dính vào chuyện của hai sạp.', exp:2}
          ]}
        ]
      },
      {
        id:'lost_phone', icon:'📱', title:'Điện Thoại Rơi Trên Ghế Đá',
        zones:['district','market'],
        reqLevel:10,
        desc:'Một chiếc điện thoại còn sáng màn hình nằm trên ghế đá.',
        choices:[
          { label:'☎️ Chờ cuộc gọi của chủ máy', outcomes:[
            {w:45, good:true, text:'Chủ máy gọi tới và quay lại nhận. Họ gửi bạn 50 Xu cảm ơn.', coins:50, karma:6, exp:20},
            {w:25, good:true, text:'Người chủ làm cửa hàng trò chơi và tặng bạn 1 Túi Mù.', blindBag:1, karma:6, exp:20},
            {w:30, good:true, text:'Chủ máy chỉ kịp cảm ơn thật nhiều.', karma:6, exp:18}
          ]},
          { label:'🏢 Mang vào chốt gần đó', outcomes:[
            {w:70, good:true, text:'Điện thoại được tiếp nhận và trả lại người mất.', karma:6, exp:18},
            {w:30, good:true, text:'Bạn được tặng chiếc còi lưu niệm của đội tuần tra.', souvenir:'village_patrol_whistle', karma:7, exp:20}
          ]},
          { label:'🤫 Cất vào túi rồi đi tiếp', outcomes:[
            {w:65, bad:true, text:'Chủ máy định vị được thiết bị. Bạn phải quay lại giải thích và trả máy.', karma:-9, energy:-12},
            {w:35, bad:true, text:'Người xung quanh nhìn thấy. Bạn trả lại ngay nhưng thiện cảm giảm mạnh.', karma:-8, exp:1}
          ]}
        ]
      },
      {
        id:'old_vendor', icon:'🍵', title:'Ông Cụ Mời Chén Trà',
        zones:['lane','temple'],
        desc:'Một ông cụ ngồi bên hiên mời bạn nghỉ chân uống chén trà và kể chuyện làng xưa.',
        choices:[
          { label:'🍵 Ngồi nghe một lát', outcomes:[
            {w:55, good:true, text:'Bạn nghe được chuyện cũ về chợ làng và thấy tinh thần thoải mái hơn.', energy:8, exp:10, karma:2},
            {w:25, good:true, text:'Ông cụ tặng bạn một tấm Vé Chợ Phiên Cũ.', souvenir:'old_market_ticket', energy:5, exp:12},
            {w:20, good:true, text:'Ông chỉ cho bạn một lối tắt ven đồng. Chuyến đi tiếp theo thấy nhẹ nhàng hơn.', energy:12, exp:8}
          ]},
          { label:'🙇 Chào cụ rồi đi tiếp', outcomes:[
            {w:100, text:'Bạn lễ phép chào rồi tiếp tục đi.', exp:2}
          ]}
        ]
      },
      {
        id:'delivery_spill', icon:'🥬', title:'Xe Rau Làm Rơi Hàng',
        zones:['market','district'],
        desc:'Một xe rau thắng gấp làm vài bó rau và túi nguyên liệu rơi xuống đường.',
        choices:[
          { label:'🧺 Nhặt giúp người giao hàng', outcomes:[
            {w:35, good:true, text:'Bạn được tặng ít bắp vừa giao tới.', item:'crop_corn', qty:2, karma:4, exp:14},
            {w:35, good:true, text:'Người giao hàng biếu bạn mấy trái dâu.', item:'crop_strawberry', qty:2, karma:4, exp:14},
            {w:30, good:true, text:'Họ tặng bạn 20 Xu tiền nước.', coins:20, karma:4, exp:14}
          ]},
          { label:'🚦 Giúp đứng cảnh báo xe phía sau', outcomes:[
            {w:75, good:true, text:'Nhờ bạn cảnh báo, không có xe nào cán lên hàng.', karma:4, exp:13},
            {w:25, good:true, text:'Tổ tuần tra gần đó tặng bạn chiếc còi nhỏ làm kỷ niệm.', souvenir:'village_patrol_whistle', karma:5, exp:15}
          ]}
        ]
      },
      {
        id:'street_performer', icon:'🎸', title:'Nhóm Trẻ Biểu Diễn Ven Đường',
        zones:['market','district'],
        desc:'Một nhóm bạn trẻ đang đàn hát để gây quỹ cho thư viện nhỏ của xã.',
        choices:[
          { label:'🪙 Ủng hộ 10 Xu', outcomes:[
            {w:65, good:true, text:'Bạn góp một chút và được cả nhóm cảm ơn.', coins:-10, karma:3, exp:8},
            {w:25, good:true, text:'Nhóm tặng lại bạn 1 Vé Số từ nhà tài trợ.', coins:-10, ticket:1, karma:3, exp:10},
            {w:10, good:true, text:'Một người nhận ra quán của bạn và hứa ghé ủng hộ.', coins:-10, karma:4, exp:12}
          ]},
          { label:'👏 Đứng nghe rồi cổ vũ', outcomes:[
            {w:100, good:true, text:'Bạn nghe hết một bài rồi vỗ tay cổ vũ.', karma:1, exp:4}
          ]}
        ]
      },
      {
        id:'police_witness', icon:'👮', title:'Cần Người Xác Nhận Sự Việc',
        zones:['district','market'],
        reqLevel:10,
        desc:'Một cán bộ hỏi bạn có thấy chiếc xe va vào sạp rồi chạy đi lúc nãy không.',
        choices:[
          { label:'📝 Kể đúng những gì mình thấy', outcomes:[
            {w:60, good:true, text:'Thông tin của bạn giúp xác minh nhanh. Bạn được cảm ơn vì hợp tác.', karma:5, exp:18},
            {w:30, good:true, text:'Chủ sạp cảm ơn bạn bằng 30 Xu.', coins:30, karma:5, exp:18},
            {w:10, good:true, text:'Bạn nhiều lần hỗ trợ cộng đồng nên được tặng Kỷ Niệm Chương Người Làng.', souvenir:'village_founder_plaque', karma:8, exp:25}
          ]},
          { label:'🤷 Chỉ nói phần mình không chắc chắn', outcomes:[
            {w:100, good:true, text:'Bạn chỉ cung cấp điều mình nhớ rõ, không đoán thêm. Mọi người đánh giá cao sự cẩn thận.', karma:3, exp:12}
          ]}
        ]
      },
      {
        id:'tourist_map', icon:'🗺️', title:'Du Khách Hỏi Đường',
        zones:['riverside','temple','district'],
        reqLevel:6,
        desc:'Một nhóm du khách đang xoay bản đồ giấy và không biết đường tới chợ làng.',
        choices:[
          { label:'🚶 Dẫn họ đi một đoạn', outcomes:[
            {w:45, good:true, text:'Họ cảm ơn và tặng bạn 40 Xu.', coins:40, karma:4, exp:15},
            {w:25, good:true, text:'Một người đưa bạn món quà nhỏ từ nơi họ tới.', blindBag:1, karma:4, exp:15},
            {w:30, good:true, text:'Họ hỏi thêm tên quán và hứa sẽ ghé ăn.', karma:5, exp:18}
          ]},
          { label:'🗺️ Chỉ đường trên bản đồ', outcomes:[
            {w:80, good:true, text:'Nhóm khách hiểu đường và cảm ơn bạn.', karma:2, exp:8},
            {w:20, good:true, text:'Họ tặng bạn 15 Xu mua nước.', coins:15, karma:2, exp:8}
          ]}
        ]
      },
      {
        id:'lucky_coin', icon:'🪙', title:'Ánh Sáng Trong Bụi Cỏ',
        zones:['riverside','lane','temple'],
        desc:'Có thứ gì đó lấp lánh trong bụi cỏ cạnh đường.',
        choices:[
          { label:'🔍 Nhặt lên xem', outcomes:[
            {w:40, text:'Chỉ là một chiếc nắp chai phản sáng.', exp:2},
            {w:25, good:true, text:'Bạn nhặt được 12 Xu rơi lẻ, không có dấu hiệu của chủ nhân.', coins:12, exp:4},
            {w:20, good:true, text:'Đó là đồng xu lưu niệm cũ của hội làng. Bạn giao cho đình và được tặng món khác thay thế.', souvenir:'village_old_key', karma:3, exp:12},
            {w:15, bad:true, text:'Bạn vừa nhặt thì một người quay lại hỏi món đồ họ đánh rơi. Bạn trả lại ngay nhưng hơi ngượng.', karma:0, exp:3}
          ]},
          { label:'🚶 Không đụng vào', outcomes:[
            {w:100, text:'Bạn bỏ qua và tiếp tục chuyến đi.', exp:1}
          ]}
        ]
      },
      {
        id:'school_notebook', icon:'📒', title:'Cuốn Vở Rơi Trước Cổng Trường',
        zones:['school','lane'],
        desc:'Một cuốn vở có đầy hình vẽ và tên học sinh nằm cạnh hàng rào.',
        choices:[
          { label:'🏫 Mang vào phòng bảo vệ', outcomes:[
            {w:55, good:true, text:'Bạn trả đúng cho cô giáo trực. Bé chủ vở chạy ra cảm ơn.', karma:4, exp:12},
            {w:25, good:true, text:'Cô giáo tặng bạn một chiếc Khăn Quàng Đỏ Cũ làm lưu niệm.', souvenir:'village_red_scarf', karma:4, exp:15},
            {w:20, good:true, text:'Nhà trường gửi bạn 20 Xu tiền nước vì đã quay lại trả đồ.', coins:20, karma:3, exp:10}
          ]},
          { label:'📣 Đứng chờ xem ai quay lại tìm', outcomes:[
            {w:70, good:true, text:'Một bé hớt hải chạy lại. Bạn trả đúng cuốn vở.', karma:3, exp:9},
            {w:30, text:'Không ai quay lại, bạn đành mang vở vào phòng bảo vệ sau đó.', exp:5}
          ]}
        ]
      },
      {
        id:'school_sports', icon:'🏃', title:'Hội Thao Trường Làng',
        zones:['school'],
        desc:'Sân trường đông nghịt, vài thầy cô đang cần người phụ chuyển nước và dụng cụ.',
        choices:[
          { label:'💧 Phụ mang nước', outcomes:[
            {w:45, good:true, text:'Bạn giúp xong và được mời ăn bánh cùng học sinh.', energy:6, karma:4, exp:14},
            {w:35, good:true, text:'Một phụ huynh tặng bạn 1 Vé Số.', ticket:1, karma:4, exp:14},
            {w:20, good:true, text:'Bạn được tặng chiếc Khăn Quàng Đỏ Cũ làm kỷ niệm.', souvenir:'village_red_scarf', karma:4, exp:15}
          ]},
          { label:'👏 Cổ vũ một lát', outcomes:[
            {w:100, text:'Bạn đứng xem một trận kéo co cực vui rồi đi tiếp.', energy:3, exp:5}
          ]}
        ]
      },
      {
        id:'rice_cart', icon:'🛞', title:'Xe Lúa Sa Bánh Ngoài Đồng',
        zones:['ricefield'],
        desc:'Một xe chở lúa bị sa bánh xuống bờ ruộng, bác nông dân đang loay hoay đẩy.',
        choices:[
          { label:'💪 Xuống đẩy cùng', outcomes:[
            {w:40, good:true, text:'Xe lên được bờ. Bác tặng bạn 30 Xu.', coins:30, karma:5, exp:16, energy:-5},
            {w:30, good:true, text:'Bác tặng bạn một túi hạt giống lúa mì.', item:'seed_wheat', qty:3, karma:5, exp:16, energy:-5},
            {w:20, good:true, text:'Bác đưa bạn Huy Hiệu Bù Nhìn vui vui làm kỷ niệm.', souvenir:'village_scarecrow_pin', karma:5, exp:18, energy:-5},
            {w:10, text:'Đẩy hơi lâu nên bạn mệt rũ nhưng xe cũng lên được.', energy:-10, karma:4, exp:15}
          ]},
          { label:'🚜 Chạy đi gọi máy kéo gần đó', outcomes:[
            {w:75, good:true, text:'Máy kéo tới đúng lúc và giải cứu chiếc xe.', karma:4, exp:12},
            {w:25, good:true, text:'Bác nông dân cảm ơn bằng 20 Xu.', coins:20, karma:4, exp:12}
          ]}
        ]
      },
      {
        id:'scarecrow_fix', icon:'🌾', title:'Bù Nhìn Bị Gió Làm Nghiêng',
        zones:['ricefield'],
        desc:'Một bù nhìn giữa ruộng bị nghiêng hẳn sang một bên sau trận gió.',
        choices:[
          { label:'🪵 Dựng lại giúp', outcomes:[
            {w:60, good:true, text:'Bạn dựng lại ngay ngắn. Chủ ruộng nhìn thấy từ xa và cảm ơn.', karma:3, exp:10},
            {w:25, good:true, text:'Bạn tìm thấy chiếc Huy Hiệu Bù Nhìn cũ mắc trên áo rơm.', souvenir:'village_scarecrow_pin', exp:12},
            {w:15, text:'Một đàn chim bay vụt lên làm bạn giật mình ngã ngồi xuống bờ cỏ.', energy:-4, exp:5}
          ]},
          { label:'📷 Chụp hình rồi đi', outcomes:[
            {w:100, text:'Tấm hình khá buồn cười, nhưng bù nhìn vẫn nghiêng.', exp:2}
          ]}
        ]
      },
      {
        id:'bus_luggage', icon:'🧳', title:'Vali Bỏ Quên Ở Bến Xe',
        zones:['busstop','district'],
        desc:'Một chiếc vali nhỏ nằm cạnh ghế chờ sau khi xe vừa rời bến.',
        choices:[
          { label:'🚌 Báo nhà xe', outcomes:[
            {w:45, good:true, text:'Nhà xe liên hệ được khách. Bạn nhận 40 Xu cảm ơn.', coins:40, karma:5, exp:16},
            {w:30, good:true, text:'Khách gửi lại bạn một tấm Vé Xe Tuyến Huyện làm kỷ niệm.', souvenir:'village_bus_ticket', karma:5, exp:17},
            {w:25, good:true, text:'Nhà xe tặng bạn 1 Vé Số từ quầy tiện lợi.', ticket:1, karma:4, exp:14}
          ]},
          { label:'👀 Đứng chờ chủ quay lại', outcomes:[
            {w:60, good:true, text:'Chủ vali chạy quay lại đúng lúc. Bạn trao lại tận tay.', karma:4, exp:12},
            {w:40, text:'Chờ khá lâu không ai quay lại, bạn đành giao cho nhà xe.', energy:-5, exp:8}
          ]}
        ]
      },
      {
        id:'bus_delay', icon:'🚏', title:'Xe Huyện Bị Trễ Chuyến',
        zones:['busstop'],
        desc:'Mấy người lớn tuổi đang sốt ruột vì chuyến xe huyện trễ hơn dự kiến.',
        choices:[
          { label:'📱 Xem lịch xe giúp mọi người', outcomes:[
            {w:70, good:true, text:'Bạn tìm ra chuyến thay thế và chỉ cho mọi người.', karma:3, exp:10},
            {w:30, good:true, text:'Một cô cảm ơn bằng 15 Xu mua nước.', coins:15, karma:3, exp:10}
          ]},
          { label:'🍵 Ngồi chờ cùng một lát', outcomes:[
            {w:60, text:'Bạn nghe được đủ thứ chuyện trong làng.', energy:4, exp:6},
            {w:40, good:true, text:'Một bác tặng bạn Vé Xe Tuyến Huyện cũ để làm dấu trang.', souvenir:'village_bus_ticket', exp:10}
          ]}
        ]
      },
      {
        id:'clinic_umbrella', icon:'☂️', title:'Cụ Bà Quên Ô Ở Trạm Xá',
        zones:['clinic'],
        desc:'Một cụ bà chuẩn bị về thì phát hiện trời mưa mà chiếc ô lại để đâu mất.',
        choices:[
          { label:'☂️ Cho cụ mượn ô đi cùng', outcomes:[
            {w:55, good:true, text:'Bạn đưa cụ tới đầu ngõ. Cụ biếu 25 Xu.', coins:25, karma:5, exp:14},
            {w:25, good:true, text:'Người nhà cụ gửi tặng 1 Túi Mù cảm ơn.', blindBag:1, karma:5, exp:15},
            {w:20, good:true, text:'Cụ chỉ cảm ơn nhưng thiện cảm làng tăng rõ.', karma:7, exp:15}
          ]},
          { label:'📞 Gọi người nhà tới đón', outcomes:[
            {w:100, good:true, text:'Người nhà tới đón cụ an toàn.', karma:3, exp:9}
          ]}
        ]
      },
      {
        id:'hill_kite', icon:'🪁', title:'Diều Mắc Trên Cành Ở Đồi Sim',
        zones:['hill'],
        desc:'Một nhóm trẻ đang nhìn chiếc diều mắc cao trên cành cây.',
        choices:[
          { label:'🪵 Tìm cây dài gỡ giúp', outcomes:[
            {w:45, good:true, text:'Chiếc diều được cứu nguyên vẹn. Cả nhóm reo ầm lên.', karma:4, exp:13},
            {w:30, good:true, text:'Mảnh tua diều rơi ra, các bé ký tên rồi tặng bạn làm kỷ niệm.', souvenir:'village_kite_piece', karma:4, exp:15},
            {w:25, text:'Gỡ mãi mới được, bạn hơi mỏi tay.', energy:-5, exp:10}
          ]},
          { label:'🧵 Chỉ cách làm diều mới', outcomes:[
            {w:65, good:true, text:'Mấy bé thích thú và quyết định về làm chiếc khác.', karma:3, exp:10},
            {w:35, good:true, text:'Một phụ huynh cảm ơn bằng 20 Xu.', coins:20, karma:3, exp:10}
          ]}
        ]
      },
      {
        id:'hill_picnic', icon:'🧺', title:'Bãi Cỏ Sau Buổi Picnic',
        zones:['hill'],
        desc:'Bãi cỏ đẹp nhưng còn vài túi rác nhỏ sau nhóm khách vừa rời đi.',
        choices:[
          { label:'♻️ Gom lại bỏ đúng chỗ', outcomes:[
            {w:70, good:true, text:'Bãi cỏ sạch trở lại.', karma:4, exp:10},
            {w:20, good:true, text:'Bạn nhặt thấy một mảnh diều cũ đẹp mắt.', souvenir:'village_kite_piece', karma:3, exp:12},
            {w:10, good:true, text:'Một người bán nước gần đó tặng bạn 10 Xu.', coins:10, karma:3, exp:10}
          ]},
          { label:'🚶 Bỏ qua', outcomes:[
            {w:100, text:'Bạn tiếp tục ngắm cảnh rồi đi xuống đồi.', exp:2}
          ]}
        ]
      },
      {
        id:'night_token', icon:'🎪', title:'Quầy Trò Chơi Chợ Đêm',
        zones:['nightmarket'],
        desc:'Một quầy ném vòng đang phát xu lưu niệm cho người đạt điểm cao.',
        choices:[
          { label:'🎯 Chơi thử (-15 Xu)', outcomes:[
            {w:30, good:true, text:'Bạn ném trúng liên tiếp và nhận Xu Chợ Đêm Kỷ Niệm!', coins:-15, souvenir:'village_night_token', exp:18},
            {w:35, good:true, text:'Bạn thắng một Túi Mù nhỏ.', coins:-15, blindBag:1, exp:14},
            {w:25, text:'Bạn nhận lại 10 Xu tiền thưởng an ủi.', coins:-5, exp:8},
            {w:10, bad:true, text:'Trượt sạch. Chỉ còn tiếng cười của chủ quầy.', coins:-15, exp:3}
          ]},
          { label:'👀 Đứng xem', outcomes:[
            {w:100, text:'Bạn xem vài lượt rồi đi tiếp.', exp:2}
          ]}
        ]
      },
      {
        id:'night_lantern', icon:'🏮', title:'Đèn Lồng Sắp Rơi Ở Chợ Đêm',
        zones:['nightmarket'],
        desc:'Một dây đèn lồng bị tuột nút, sắp rơi xuống lối đi.',
        choices:[
          { label:'🪢 Buộc lại giúp', outcomes:[
            {w:50, good:true, text:'Bạn buộc lại chắc chắn. Chủ sạp tặng 25 Xu.', coins:25, karma:4, exp:13},
            {w:30, good:true, text:'Chủ sạp tặng bạn 1 Vé Số.', ticket:1, karma:4, exp:13},
            {w:20, good:true, text:'Ban chợ đêm ghi nhận bạn trong sổ tình nguyện.', karma:5, exp:14}
          ]},
          { label:'📣 Gọi chủ sạp ra xử lý', outcomes:[
            {w:100, good:true, text:'Chủ sạp chạy ra buộc lại ngay.', karma:2, exp:7}
          ]}
        ]
      },
      {
        id:'district_parcel', icon:'📦', title:'Gói Hàng Giao Nhầm Ở Phố Huyện',
        zones:['district'],
        desc:'Một shipper hỏi bạn có biết địa chỉ ghi trên kiện hàng lạ này không.',
        choices:[
          { label:'🗺️ Chỉ đường nếu biết', outcomes:[
            {w:50, good:true, text:'Bạn chỉ đúng địa chỉ. Shipper cảm ơn 20 Xu.', coins:20, karma:3, exp:10},
            {w:30, good:true, text:'Shipper đưa bạn một mã Vé Số từ ứng dụng giao hàng.', ticket:1, karma:3, exp:10},
            {w:20, text:'Bạn chỉ gần đúng, cả hai phải hỏi thêm người khác.', exp:5}
          ]},
          { label:'🤷 Nói không chắc để tránh chỉ sai', outcomes:[
            {w:100, good:true, text:'Bạn không đoán bừa. Shipper cảm ơn vì sự cẩn thận.', karma:2, exp:6}
          ]}
        ]
      }
    ];

    let villageWalking = false;

    function getVillageZoneConfig() {
      return VILLAGE_ZONES[gameState.villageZone] || VILLAGE_ZONES.lane;
    }

    function isVillageZoneUnlocked(zone) {
      return gameState.shopStage >= (zone.reqStage || 0) && gameState.level >= (zone.reqLevel || 1);
    }

    function setVillageZone(zoneKey) {
      const zone = VILLAGE_ZONES[zoneKey];
      if (!zone) return;
      if (!isVillageZoneUnlocked(zone)) {
        return showToast(`Cần Lv.${zone.reqLevel} và cấp quán ${zone.reqStage + 1} để tới ${zone.name}.`, '🔒');
      }
      if (gameState.villageEncounterId) return showToast('Hãy xử lý chuyện đang gặp trước đã.', '💬');
      closeVillagePointModal();
      gameState.villageZone = zoneKey;
      resetVillageNpcState(true);
      renderVillageUI();
      playSound('click');
      saveGameToStorage(false);
    }

/* ===== V84 | Làng muôn chuyện: dữ liệu, chuỗi truyện và rủi may ===== */
const V84_RANDOM_SCENES = [
 ['rain_fair','🌧️','Mưa Bất Chợt Giữa Phiên Chợ',['market','nightmarket'],'Mưa đổ xối xả đúng lúc các sạp đang chuyển hàng. Người ta hô nhau che những thùng đồ dễ hỏng.',[
  ['☂️ Giúp căng bạt che hàng','safe','Cả dãy sạp thoát mưa, cô bán hàng cảm ơn.','Bạn phụ một góc bạt, quần áo ướt nhưng hàng vẫn an toàn.','Bạt tuột dây, bạn phải chạy khắp nơi buộc lại.'],
  ['📦 Ôm thùng hàng chạy xuyên mưa','balanced','Bạn kịp đưa thùng quan trọng vào kho trước khi ướt.','Vừa tới mái hiên thì thùng hơi ngấm nước, vẫn cứu được một phần.','Bạn trượt chân vào vũng nước, thùng đồ đổ tung.'],
  ['🎲 Cược đường tắt qua hẻm','wild','Bạn phát hiện ngõ tắt khô ráo và được người bán thưởng lớn.','Ngõ tắt không tệ, nhưng đi lòng vòng mất công.','Hẻm ngập sâu, bạn mất tiền giặt giày và rất nhiều sức.']]],
 ['lucky_envelope','🧧','Phong Bao Nằm Dưới Gốc Đa',['lane','temple'],'Một phong bao đỏ kẹt ở rễ đa, ghi: “Dành cho người có duyên”. Chẳng rõ ai để lại.',[
  ['📢 Hỏi chủ nhân quanh đình','safe','Một bác nhận ra phong bao và đền đáp sự thật thà.','Chẳng ai nhận, bạn gửi phong bao cho ban quản lý.','Bạn bị hiểu lầm là người giấu phong bao, mất công giải thích.'],
  ['✉️ Mở tìm thông tin người gửi','balanced','Mảnh giấy bên trong dẫn tới một món quà bất ngờ.','Bên trong là lời chúc năm mới viết từ lâu.','Phong bao toàn bột màu, bạn bối rối đi rửa tay.'],
  ['🎲 Đi theo lời đố bí ẩn','wild','Bạn giải đúng câu đố và tìm thấy phần thưởng hiếm.','Câu đố kết thúc ở quán nước đầu làng.','Bạn đi lạc một vòng, vừa mất sức vừa lỡ phiên chợ.']]],
 ['strange_vendor','🎭','Người Bán Mặt Nạ Bí Ẩn',['market','nightmarket'],'Một người lạ bày ba chiếc mặt nạ rồi hứa ai đoán đúng sẽ có quà.',[
  ['👀 Hỏi nguồn gốc trò chơi','safe','Người bán kể chuyện lễ hội và cho bạn món quà nhỏ.','Đây chỉ là trò quảng bá sạp thủ công.','Người bán bận quá, bạn chờ hoài chẳng được gì.'],
  ['🎨 Chọn chiếc có hình lá','balanced','Mặt nạ lá giấu phiếu quà dưới lớp giấy.','Bạn được nghe câu chuyện về nghệ nhân làm mặt nạ.','Màu vẽ lem lên áo, bạn phải bỏ tiền giặt.'],
  ['🎲 Nhắm mắt rút chiếc cuối','wild','Bạn chọn đúng mặt nạ đặc biệt của hội làng!','Bạn nhận một chiếc mặt nạ rất thường.','Bạn vô tình chọn mặt nạ hỏng, phải đền vật liệu.']]],
 ['tea_contest','🍵','Cuộc Thi Đoán Vị Trà',['market','district'],'Ba tách trà đặt trên bàn. Người thắng đoán đúng hương trà sẽ được tặng một túi quà.',[
  ['👃 Ngửi hương rồi đoán','safe','Bạn nhận ra mùi trà quen và được khen tinh mũi.','Bạn nhầm một loại nhưng vẫn được tặng mẫu thử.','Bạn hắt hơi vì phấn hoa, lỡ mất lượt thử.'],
  ['🥄 Nếm cả ba tách','balanced','Bạn đoán chính xác nhờ vị hậu ngọt.','Bạn phân biệt được hai tách, chưa đủ để thắng.','Trà nóng làm bạn vội vàng, đoán sai cả ba.'],
  ['🎲 Đoán bằng trực giác','wild','Trực giác thần kỳ giúp bạn trúng giải độc đắc!','Bạn đoán trúng một tách do may mắn.','Bạn thua và bị cả bàn chọc ghẹo một phen.']]],
 ['bridge_market','🌉','Chiếc Cầu Treo Tạm',['riverside','ricefield'],'Cầu gỗ lắc lư, một bác nông dân cần đưa túi hạt giống qua bờ bên kia.',[
  ['🪵 Kiểm tra từng tấm ván','safe','Bạn tìm ra chỗ ván lỏng, giúp cả làng đi lại an toàn.','Cầu chưa hỏng nhưng mọi người quyết định gia cố thêm.','Bạn mất thời gian dò cầu mà vẫn không qua được.'],
  ['🤝 Nhờ người cùng khiêng','balanced','Hai người phối hợp rất khéo, hàng tới nơi nguyên vẹn.','Mọi người đi chậm nhưng cuối cùng đều qua được.','Túi hạt giống bị rách, bạn phải cùng nhặt lại.'],
  ['🎲 Tự mang hàng chạy nhanh','wild','Bạn qua cầu đúng nhịp gió, bác nông dân thưởng hậu hĩnh.','Bạn sang bờ kia thở không ra hơi.','Bạn trượt trên ván ướt, rơi mất đôi dép mới.']]],
 ['evening_lantern','🏮','Đèn Hội Tắt Hàng Loạt',['temple','nightmarket'],'Dãy đèn lồng đột nhiên tối om ngay trước giờ hội.',[
  ['🔦 Giúp kiểm tra cầu chì','safe','Tìm ra cầu chì lỏng, dãy đèn bừng sáng trở lại.','Mọi người phát hiện mất điện toàn khu nên chờ thợ.','Bạn lục đồ nghề đến mỏi tay vẫn chẳng thấy lỗi.'],
  ['🪜 Treo đèn dầu dự phòng','balanced','Đèn dầu vàng dịu khiến khu hội lung linh đặc biệt.','Bạn thắp được vài chiếc đèn cho mọi người đi lại.','Gió tắt đèn liên tục, bạn vừa mệt vừa mất công.'],
  ['🎲 Làm màn trình diễn đèn tự chế','wild','Sáng kiến thành điểm nhấn hội, bạn được thưởng lớn.','Mọi người cười vui với đèn tự chế hơi ngộ.','Đèn sáng nhấp nháy khó coi, bạn phải mua đồ thay.']]],
 ['giant_pumpkin','🎃','Bí Ngô Khổng Lồ Biến Mất',['ricefield','market'],'Trái bí đoạt giải của cô bán rau biến mất trước cuộc thi.',[
  ['🔎 Tìm dấu vết quanh sạp','safe','Bạn lần ra dấu xe đẩy và đưa trái bí về kịp giờ.','Bí được chuyển nhầm sang sạp bên cạnh.','Bạn tìm sai hướng, bỏ cả buổi không thu được gì.'],
  ['🐾 Lần theo chú chó ngửi bí','balanced','Chú chó dẫn đến kho hàng giấu trái bí.','Chó dẫn bạn ra hàng bánh bí ngô.','Bạn chạy theo chó suốt phố, cuối cùng chỉ thấy nó ngủ.'],
  ['🎲 Dự thi với bí tự trồng thay thế','wild','Trái bí thay thế bất ngờ giành giải nhất!','Bạn nhận giải khuyến khích vì nhiệt tình.','Bí không đủ cân, bạn vừa mất công vừa tốn phí dự thi.']]],
 ['old_ticket','🎟️','Tấm Vé Hội Chợ Xưa',['lane','market','temple'],'Một ông cụ đưa ra tấm vé đã phai màu, bảo rằng có thể đổi một món quà bị quên lãng.',[
  ['📚 Tra sổ hội chợ cũ','safe','Bạn tìm được người giữ sổ và xác minh câu chuyện.','Tấm vé đúng là đồ cổ nhưng quầy đổi quà đã đóng.','Bạn đọc nhầm năm in, phải xin lỗi ông cụ.'],
  ['🗺️ Tìm gian hàng được ghi','balanced','Gian hàng cũ vẫn còn chiếc hộp tặng người có duyên.','Bạn nghe được giai thoại dễ thương của hội chợ.','Bạn đi tới một địa chỉ không còn tồn tại.'],
  ['🎲 Thử đổi vé tại quầy đặc biệt','wild','Người chủ nhận ra kỷ vật và tặng quà lớn bất ngờ.','Chủ quầy nhận vé và gửi ít bánh làm quà.','Bạn phải bù phí bảo quản món quà đã mục.']]],
 ['lost_parrot','🦜','Vẹt Xanh Biết Nói',['lane','market'],'Một con vẹt sặc sỡ kêu tên người lạ, cứ bay vòng quanh mái hiên.',[
  ['📣 Hỏi ai mất vẹt','safe','Chủ chim xuất hiện và cảm ơn bạn tận tình.','Cả xóm giúp làm biển tìm chủ chim.','Con vẹt nói nhại làm mọi người tưởng bạn trêu họ.'],
  ['🥭 Dùng trái cây dụ chim','balanced','Vẹt đậu xuống tay bạn và tiết lộ đường về nhà.','Nó ăn quả rồi bay lên cành kế bên.','Nó mổ mất trái cây, bạn chưa bắt được.'],
  ['🎲 Làm theo địa chỉ vẹt đọc','wild','Địa chỉ chính xác, chủ chim tặng phần thưởng quý.','Bạn tới nhà người trùng tên nhưng vẫn biết thêm chuyện hay.','Vẹt đang bắt chước quảng cáo cũ, bạn đi sai cả buổi.']]],
 ['river_fish','🐟','Đàn Cá Chớp Sáng Dưới Sông',['riverside'],'Mặt nước phản chiếu vô số đốm sáng, người câu cá đồn có cá vàng đem may mắn.',[
  ['📷 Quan sát từ bờ','safe','Bạn phát hiện ánh sáng do đàn cá nhỏ bơi qua đá.','Bạn ghi lại cảnh sông tuyệt đẹp.','Bạn chờ quá lâu dưới nắng, mất chút sức.'],
  ['🪝 Mượn cần câu thử vận may','balanced','Bạn câu được con cá to và bán được giá khá.','Cá cắn câu rồi thoát, để lại một câu chuyện vui.','Dây câu mắc vào rong, bạn phải đền tiền dây.'],
  ['🎲 Thả một chiếc thuyền giấy cầu may','wild','Thuyền giấy trôi tới chỗ một hộp quà mắc ở rễ cây.','Thuyền quay tròn, mọi người cười vui.','Thuyền chìm, bạn loay hoay mất cả buổi tìm.']]],
 ['market_mystery_box','📦','Thùng Hàng Không Ghi Tên',['market','district'],'Một thùng hàng có dấu hỏi được để nhầm trước cửa hàng, chưa rõ ai nhận.',[
  ['📋 Hỏi từng sạp gần đó','safe','Bạn tìm được người giao và giải quyết nhầm lẫn.','Mọi người ghi chú để người chủ tới lấy.','Bạn bị nhầm là người giao hàng, phải khuân qua lại.'],
  ['🔍 Tìm hóa đơn trong bao bọc','balanced','Mã đơn giúp chủ hàng tìm đúng kiện quà.','Bên trong chỉ có bọc hàng và tờ quảng cáo.','Bạn làm rách dây buộc, phải mua dây mới.'],
  ['🎲 Nhận thử nhiệm vụ chuyển hộ','wild','Bạn giao đúng chủ hàng hiếm và được thưởng lớn.','Bạn giao được nhưng chỉ nhận một lời cảm ơn.','Bạn nhận nhầm địa chỉ, phải tự bỏ tiền vận chuyển lại.']]],
 ['night_riddle','🌙','Ông Kể Chuyện Trong Đêm',['nightmarket','temple'],'Một ông lão đưa ra ba câu đố cổ, hứa tặng quà cho người giải được.',[
  ['📖 Xin gợi ý từ người già','safe','Mọi người chia sẻ mẹo, bạn giải đúng một câu.','Bạn nghe được chuyện cũ rất thú vị.','Gợi ý không ăn nhập, bạn mất thời gian.'],
  ['🧠 Tự giải câu đố khó','balanced','Bạn giải đúng câu cuối khiến cả đám trầm trồ.','Bạn trả lời gần đúng, ông lão khen sự sáng tạo.','Bạn nhầm mẹo chơi chữ và thua đáng tiếc.'],
  ['🎲 Chọn đáp án hoàn toàn ngược đời','wild','Đáp án kỳ quặc hóa ra chính xác, thưởng cực lớn!','Ông lão bật cười và cho một viên kẹo.','Cả đám cười ồ, bạn phải mời nước chuộc ngượng.']]],
 ['ricefield_lights','✨','Đốm Sáng Giữa Đồng Lúa',['ricefield','hill'],'Đêm muộn thấp thoáng ánh sáng ở bờ ruộng, dân làng bàn tán đủ kiểu.',[
  ['🔦 Soi đèn tìm nguyên nhân','safe','Đó chỉ là đèn trên xe máy của người làm đồng.','Bạn thấy đom đóm tụ bên bờ mương.','Bạn lội vào bùn ướt hết giày.'],
  ['👣 Theo dấu chân qua ruộng','balanced','Bạn phát hiện ai đó giấu lồng đèn hội và mang về.','Dấu chân dẫn tới chòi canh cũ.','Bạn vấp mô đất, mất sức đi vòng về.'],
  ['🎲 Đi thẳng về phía ánh sáng lạ','wild','Bạn tìm thấy hòm quà bị bỏ quên từ lễ hội!','Bạn gặp nhóm học sinh đang tập diễn văn nghệ.','Bạn gặp vùng bùn sâu và mất đồ trên đường về.']]],
 ['bus_ticket','🚌','Chuyến Xe Cuối Ngày',['busstop','district'],'Xe sắp rời bến, một người khách đánh rơi vé cùng túi hàng.',[
  ['📢 Gọi tài xế dừng xe','safe','Tài xế dừng kịp và khách lấy lại đủ đồ.','Người khách nhờ bạn gửi lại túi ở quầy.','Xe không dừng kịp, bạn phải chạy theo một đoạn.'],
  ['🚲 Đuổi theo xe bằng xe đạp','balanced','Bạn đuổi kịp ở ngã tư, người khách rất biết ơn.','Bạn theo tới trạm sau và chuyển được đồ.','Xích xe tuột, bạn phải bỏ tiền sửa.'],
  ['🎲 Gửi túi cho một người đi cùng','wild','Người đi cùng đúng là hàng xóm và trả quà tận tay.','Người nhận hứa chuyển lại giúp khi tới bến.','Người nhận hiểu nhầm, bạn mất công đi đính chính.']]],
 ['hill_treasure','🪨','Hòn Đá Có Ký Hiệu Lạ',['hill'],'Trên sườn đồi, một tảng đá khắc hình ngôi sao trông khác thường.',[
  ['🧭 Đánh dấu vị trí rồi báo người lớn','safe','Người am hiểu xác nhận đây là cột mốc xưa.','Bạn lưu lại tấm ảnh làm tư liệu cho làng.','Đường đồi trơn làm bạn quay về muộn.'],
  ['🧩 Ghép hình vẽ với bản đồ','balanced','Các ký hiệu dẫn tới một hộp kỷ vật.','Bạn giải được một phần câu chuyện người xưa.','Bạn đọc lệch hướng và đi mỏi chân.'],
  ['🎲 Đào quanh dấu sao','wild','Bạn đào trúng chỗ chôn hộp trò chơi quý hiếm.','Bạn thấy một chiếc chuông gỉ không giá trị.','Đất cứng làm gãy dụng cụ, phải trả tiền sửa.']]],
 ['clinic_help','💊','Hộp Thuốc Gửi Nhầm',['clinic','lane'],'Hộp thuốc của phòng khám bị chuyển nhầm qua tiệm tạp hóa.',[
  ['🏥 Trả nguyên hộp về phòng khám','safe','Bác sĩ cảm ơn vì thuốc được bảo quản cẩn thận.','Bạn giao lại đúng người phụ trách.','Bạn phải đợi xác minh khá lâu.'],
  ['📞 Gọi số người nhận trên đơn','balanced','Cuộc gọi giúp giải quyết đơn khẩn ngay.','Người nhận hẹn bạn giao lại chiều nay.','Bạn gọi nhầm số cũ, mất công đi tìm.'],
  ['🎲 Chạy giao gấp theo chỉ dẫn viết tay','wild','Bạn tới đúng nhà trước cơn mưa, được thưởng lớn.','Bạn giao được thuốc nhưng gần kiệt sức.','Chỉ dẫn cũ khiến bạn đi một vòng và tốn tiền xe.']]],
 ['school_play','🎨','Bức Tranh Bị Nhòe Màu',['school'],'Bức tranh thi vẽ của nhóm học trò bị nước mưa làm loang trước giờ nộp.',[
  ['🖌️ Giúp pha lại màu','safe','Cả nhóm cứu được bức tranh, cô giáo khen bạn nhiệt tình.','Bức tranh được sửa phần lớn, nhóm vẫn kịp nộp.','Màu bắn lên áo, bạn mất chút tiền giặt.'],
  ['🌸 Vẽ thêm họa tiết che vết','balanced','Hoa lá bạn vẽ trở thành điểm sáng của tác phẩm.','Bức tranh đổi phong cách nhưng trông rất vui.','Bạn vẽ lệch bố cục, cả nhóm phải sửa lâu hơn.'],
  ['🎲 Biến vệt loang thành tranh trừu tượng','wild','Giám khảo chấm giải sáng tạo cao nhất!','Bức tranh rất lạ và nhận nhiều lời bàn tán.','Giám khảo không hiểu ý, nhóm bị trừ điểm.']]],
 ['festival_drum','🥁','Tiếng Trống Hội Bị Sai Nhịp',['temple','nightmarket'],'Đội múa lân đang tổng duyệt thì người đánh trống chính bị đau tay.',[
  ['👏 Đếm nhịp giúp đội','safe','Đội múa lấy lại nhịp, bạn được mời ăn bánh.','Mọi người tập chậm và hoàn thành buổi duyệt.','Bạn đếm sai nhịp, phải tập lại từ đầu.'],
  ['🥁 Thử đánh trống thay người','balanced','Bạn đánh đúng bài và thành ngôi sao bất ngờ.','Bạn giữ được nhịp đơn giản tới hết bài.','Nhịp trống loạn xạ khiến bạn đỏ mặt.'],
  ['🎲 Đổi sang điệu trống mới','wild','Điệu trống lạ làm cả đám phấn khích, phần thưởng lớn!','Mọi người cười vui vì nhịp trống hài hước.','Bạn làm cả đoàn rối nhịp, phải đền buổi tập.']]],
 ['district_sign','🪧','Biển Hiệu Quán Bị Gió Thổi',['district','market'],'Biển quảng cáo của tiệm bánh sắp rơi khỏi mái hiên.',[
  ['🚧 Báo người đi đường tránh xa','safe','Mọi người đi tránh an toàn, chủ tiệm cảm ơn bạn.','Chủ tiệm kịp cất biển xuống.','Bạn đứng cảnh báo giữa nắng khá lâu.'],
  ['🧰 Phụ cố định khung biển','balanced','Bạn bắt lại vít chắc chắn và nhận quà cảm ơn.','Bạn cùng chủ tiệm buộc biển bằng dây chắc.','Khung sắt cũ làm gãy dụng cụ, phải chia tiền sửa.'],
  ['🎲 Tự thiết kế bảng tạm bằng tay','wild','Bảng tạm nổi bật khiến tiệm đông khách, chủ thưởng lớn.','Bảng viết hơi ngộ nhưng dùng được cả ngày.','Chữ viết sai tên bánh, bạn phải mua bảng mới.']]],
 ['bread_festival','🥐','Ổ Bánh Cuối Cùng',['market','school'],'Hai người cùng chọn ổ bánh cuối tại quầy, chủ tiệm đang lúng túng.',[
  ['🤝 Nhường bánh cho người khác','safe','Người kia cảm ơn và rủ bạn chia một phần bánh.','Bạn không được bánh nhưng được chủ tiệm hứa giữ lần tới.','Bạn đi tìm quầy khác khá xa và mất sức.'],
  ['✂️ Xin cắt bánh làm hai','balanced','Chủ tiệm vui vẻ chia đôi và tặng kèm mứt.','Hai người đồng ý chia bánh, ai cũng vui.','Bánh quá nhỏ, bạn vẫn thấy chưa no.'],
  ['🎲 Đề nghị thi oẳn tù tì lấy bánh','wild','Bạn thắng liên tiếp và nhận thêm quà thú vị.','Hòa ba lần, cuối cùng hai người tự chia.','Bạn thua đậm, còn phải trả tiền nước cho đối thủ.']]],
 ['riverside_photo','📸','Ảnh Cưới Rơi Xuống Bến Sông',['riverside','busstop'],'Một chiếc phong bì đựng ảnh cũ rơi trên bậc đá, có người đang tìm.',[
  ['📦 Bọc ảnh cho khỏi ướt','safe','Bạn giữ được ảnh nguyên vẹn và người đánh rơi rất cảm kích.','Ảnh được cất trong túi sạch chờ người tới nhận.','Gió mạnh làm bạn vất vả giữ phong bì.'],
  ['🕵️ Tìm người trong ảnh','balanced','Bạn nhận ra đôi vợ chồng ở xóm cũ và trả đúng ảnh.','Một bác nhớ mặt người trong ảnh, giúp bạn có manh mối.','Bạn hỏi nhầm nhiều nhà và bị hiểu lầm.'],
  ['🎲 Đi theo dòng chữ mờ mặt sau','wild','Chữ mờ dẫn bạn tới người giữ kho ảnh quý của làng.','Địa chỉ cũ là một tiệm đã đổi chủ.','Bạn đi quá xa, hết tiền xe mới về được.']]],
 ['night_fireflies','🌟','Đêm Đom Đóm Bay Lạ Thường',['hill','riverside','lane'],'Cả một dải đom đóm bất ngờ sáng rực bên hàng tre, trẻ con kéo tới xem.',[
  ['📷 Ngồi ngắm yên lặng','safe','Khoảnh khắc yên bình giúp bạn lấy lại tinh thần.','Bạn có một buổi tối ngắm cảnh tuyệt đẹp.','Muỗi đốt nhiều quá, bạn đành đi về sớm.'],
  ['🎇 Đặt đèn dẫn lối cho trẻ nhỏ','balanced','Đèn giúp mọi người xem đom đóm an toàn và vui vẻ.','Bọn trẻ cảm ơn vì con đường sáng hơn.','Đèn hết pin giữa chừng, bạn phải mua pin mới.'],
  ['🎲 Đi theo đàn đom đóm vào rừng tre','wild','Bạn gặp khu vườn ẩn và tìm được món quà lạ.','Đom đóm bay tới bãi cỏ quen thuộc.','Bạn đi lạc đường mòn và mất sức quay về.']]],
 ['barter_day','⚖️','Ngày Đổi Đồ Không Dùng Tiền',['market','lane'],'Hàng xóm lập một bàn trao đổi vật dụng cũ, món nào cũng có câu chuyện riêng.',[
  ['🧹 Giúp sắp đồ theo nhóm','safe','Bàn đổi đồ gọn gàng, bạn được biếu món hữu ích.','Mọi người trao đổi vui vẻ, bạn học thêm mẹo phân loại.','Bạn bưng đồ nhiều nên khá mệt.'],
  ['🪙 Đổi vài món nguyên liệu','balanced','Bạn đổi trúng nguyên liệu quý hiếm cho quán.','Bạn đổi được món ngang giá.','Món đổi về hỏng một góc, phải sửa tốn Xu.'],
  ['🎲 Rút thăm món đồ bí ẩn','wild','Bạn rút được món đồ đặc biệt rất đáng giá!','Món đồ là cái ly cũ còn dùng tốt.','Bạn đổi trúng đồ hỏng, còn mất phí vận chuyển.']]],
 ['school_robot','🤖','Robot Tự Chế Chạy Lạc',['school','district'],'Nhóm học sinh thử robot giao hàng, nhưng nó quay vòng khắp sân.',[
  ['🛑 Giúp chặn robot an toàn','safe','Robot dừng lại, các em cảm ơn vì giữ được mô hình.','Bạn ngắt công tắc theo hướng dẫn.','Robot làm bạn chạy nhiều vòng mệt bở hơi tai.'],
  ['🔧 Kiểm tra bánh xe','balanced','Bạn tìm được bánh lệch và sửa xong.','Bánh xe bị kẹt cát, lau xong robot chạy chậm lại.','Bạn chỉnh nhầm hướng, robot đụng vào hộp giấy.'],
  ['🎲 Thử cho robot chạy đường tắt','wild','Robot vượt chướng ngại hoàn hảo, cả sân reo hò.','Robot chạy đúng vài mét rồi tự dừng.','Robot húc đổ đạo cụ, bạn phải góp tiền sửa.']]],
 ['windmill','🌬️','Cối Xay Gió Kêu Cọt Kẹt',['hill','ricefield'],'Cối xay của trang trại quay bất thường khi gió lớn, ai cũng lo bị hỏng.',[
  ['📣 Báo người quản lý','safe','Chủ trại tắt cối kịp và cám ơn bạn.','Mọi người giữ khoảng cách chờ sửa.','Gió mạnh khiến bạn đi tìm chủ trại khá lâu.'],
  ['🪛 Phụ sửa tay quay','balanced','Bạn tìm đúng chỗ lỏng, cối hoạt động êm trở lại.','Bạn phụ giữ đồ nghề, học được mẹo sửa cối.','Bạn làm rơi vít xuống cỏ và phải mua vít khác.'],
  ['🎲 Đề xuất lắp cánh quạt kiểu mới','wild','Thiết kế chạy tốt hơn, trang trại thưởng hậu hĩnh!','Cánh quạt mới quay được nhưng chưa tối ưu.','Cánh quạt lệch trục khiến bạn phải bồi thường.']]],
 ['lucky_frog','🐸','Ếch Xanh Đội Lá Sen',['riverside','ricefield'],'Một con ếch nhỏ đội chiếc lá sen, đứng ngay cạnh chiếc hộp gỗ khóa kín.',[
  ['🐸 Đưa ếch về ao','safe','Ếch nhảy xuống nước, người trồng sen cảm ơn.','Bạn thả ếch ở nơi an toàn rồi quay lại.','Ếch nhảy tung vào áo làm bạn giật mình ngã bùn.'],
  ['🗝️ Tìm chủ hộp gỗ','balanced','Bạn tìm đúng chủ hộp và được tặng quà cảm ơn.','Chiếc hộp là đạo cụ trò chơi cũ của trẻ con.','Bạn mang hộp đi hỏi khắp làng nhưng chẳng ai biết.'],
  ['🎲 Thử giải khóa chữ trên hộp','wild','Bạn giải được mật mã và được trao phần thưởng bí mật.','Bạn đoán ra một chữ nhưng chưa mở được hộp.','Bạn làm kẹt ổ khóa, phải bù tiền làm lại.']]],
 ['storm_seed','🌱','Túi Hạt Giống Trước Cơn Bão',['ricefield','lane'],'Một túi hạt giống quan trọng bị bỏ quên ngoài ruộng khi mây đen kéo tới.',[
  ['☔ Giúp cất vào nhà kho','safe','Toàn bộ hạt giống được giữ khô, chủ ruộng tặng chút quà.','Bạn che túi bằng tấm bạt có sẵn.','Mưa tới nhanh làm bạn ướt sũng.'],
  ['🌾 Phân loại hạt ngay tại ruộng','balanced','Bạn tìm được loại hạt quý bị trộn lẫn.','Hạt được chia gọn nhưng trời đã chuyển tối.','Gió thổi bay một ít hạt, bạn phải góp tiền mua bù.'],
  ['🎲 Gieo thử trên luống đất trống','wild','Hạt giống nảy mầm nhanh kỳ lạ, chủ ruộng thưởng lớn.','Luống thử có vài cây non mọc được.','Mưa làm trôi sạch hạt, bạn chịu phí giống.']]],
 ['sweet_shop','🍬','Hũ Kẹo Đếm Thiếu',['market','school'],'Chủ tiệm kẹo không hiểu vì sao hũ kẹo mỗi chiều lại thiếu vài viên.',[
  ['🧐 Kiểm lại số kẹo','safe','Bạn tìm ra phép tính sai trong sổ bán hàng.','Chủ tiệm nhận ra hũ có nắp chưa đóng kín.','Bạn đếm quá lâu và lỡ buổi đi dạo.'],
  ['🐭 Tìm dấu chân bé xíu','balanced','Dấu chân dẫn tới chú chuột tha kẹo, mọi người bật cười.','Bạn thấy đường nhỏ gần chân kệ.','Bạn tìm nhầm dưới kho, quần áo dính bụi.'],
  ['🎲 Đặt bẫy giấy kiểm tra đêm nay','wild','Bẫy giấy chụp được trò nghịch ngợm đáng yêu, được thưởng lớn.','Giấy ghi lại chút dấu chân mờ.','Bẫy đổ cả hũ kẹo, bạn phải đền một phần.']]],
 ['mysterious_song','🎼','Khúc Nhạc Từ Nhà Cũ',['lane','temple','hill'],'Từ ngôi nhà trống lâu ngày vang lên tiếng đàn quen, người lớn bảo giai điệu có từ thời xưa.',[
  ['🚪 Gõ cửa hỏi chuyện','safe','Người ở nhờ đang tập đàn và kể câu chuyện gia đình.','Bạn tìm thấy người trông coi căn nhà.','Bạn gõ nhầm cửa hàng xóm, hơi ngượng.'],
  ['🎶 Ghi lại giai điệu','balanced','Giai điệu đúng là bài hát cổ của làng, bạn nhận quà lưu niệm.','Bạn nghe được vài nốt nhạc đẹp.','Bạn ghi nhầm giai điệu rồi đi hỏi sai người.'],
  ['🎲 Thử chơi nốt còn thiếu','wild','Giai điệu hoàn chỉnh mở ra lời mời diễn hội lớn!','Bạn chơi sai vài nốt nhưng vẫn vui.','Tiếng đàn lệch làm mọi người tưởng báo động.']]],
 ['county_package','📮','Bưu Kiện Có Hai Địa Chỉ',['busstop','district'],'Một bưu kiện có hai nhãn địa chỉ chồng lên nhau, người phát thư chưa biết đưa đâu.',[
  ['📞 Liên hệ người gửi','safe','Người gửi xác minh nhãn đúng, đơn hàng được cứu.','Bạn giúp xác định mã đơn mới nhất.','Bạn mất công gọi vài số đã đổi.'],
  ['📦 Mang về điểm nhận gần nhất','balanced','Điểm nhận tìm đúng khách, bạn được cảm ơn bằng quà.','Bưu kiện được giữ cẩn thận chờ xác minh.','Điểm nhận đã đóng cửa, bạn phải đi vòng về.'],
  ['🎲 Tự suy đoán địa chỉ từ chữ mờ','wild','Bạn đoán chính xác và nhận thưởng giao nhanh!','Bạn tới đúng phố nhưng phải nhờ người khác tiếp tục.','Bạn giao nhầm, tốn tiền quay lại lấy kiện.']]],
 ['river_bell','🔔','Tiếng Chuông Dưới Bến Nước',['riverside','temple'],'Lâu lâu từ bến sông vang lên tiếng chuông dù không thấy ai đứng đó.',[
  ['🪔 Hỏi bác trông cầu','safe','Bác kể đó là chuông báo nước lên từ thời xưa.','Tiếng chuông do gió lùa vào mái hiên.','Bạn chờ mãi tiếng chuông không vang lại.'],
  ['🔎 Tìm nguồn âm thanh','balanced','Bạn tìm thấy chiếc chuông lạc trong bụi lau.','Hóa ra dây cột chuông đung đưa khi có thuyền qua.','Bạn đi sâu vào cỏ bị gai cào, mất sức.'],
  ['🎲 Theo tiếng chuông lúc hoàng hôn','wild','Bạn phát hiện hộp kỷ vật của người chèo đò năm xưa!','Chỉ là nhóm trẻ chơi âm nhạc ngoài bến.','Bạn lỡ chuyến đò cuối, tốn tiền về đường vòng.']]],
 ['festival_basket','🧺','Giỏ Quà Lễ Hội Đổi Nhầm',['temple','nightmarket'],'Hai giỏ quà giống hệt nhau bị đổi nhầm trước giờ tặng cho khách.',[
  ['🏷️ Kiểm tra nhãn trên giỏ','safe','Bạn phát hiện nhãn bị dán ngược và sửa kịp.','Bạn sắp lại quà gọn gàng cho ban tổ chức.','Nhãn bong hết, bạn phải đi xin bút mới.'],
  ['🎀 Sắp lại quà theo màu ruy băng','balanced','Giỏ quà trở nên đẹp hơn, bạn nhận quà cảm ơn.','Quà được sắp đúng chỗ mà không mất món nào.','Một chiếc hộp rơi xuống, bạn phải mua hộp thay.'],
  ['🎲 Bốc thăm trao giỏ mới','wild','Cặp giỏ may mắn được tặng đúng khách và bạn trúng thưởng!','Mọi người thấy thú vị nhưng phải kiểm lại.','Bốc nhầm liên tục khiến chương trình trễ giờ.']]],
 ['mango_tree','🥭','Cây Xoài Ra Trái Giữa Mùa',['lane','ricefield'],'Cây xoài già bỗng kết quả trái mùa khiến cả xóm tò mò.',[
  ['🌳 Hỏi người chăm cây','safe','Bác chủ cây chia sẻ bí quyết và tặng bạn ít trái.','Hóa ra mùa mưa năm nay đến muộn.','Bạn đứng ngóng mãi chưa có quả nào chín.'],
  ['🧺 Phụ hái quả chín thấp','balanced','Bạn hái được mẻ xoài ngon và được chia phần.','Bạn phụ được vài quả chín vừa.','Bạn với không tới, phải mua chiếc gậy hái mới.'],
  ['🎲 Đoán trái ngọt nhất và hái thử','wild','Bạn chọn được trái xoài ngọt nổi tiếng nhất xóm!','Xoài hơi chua nhưng vẫn ăn được.','Trái xanh quá, bạn phải đền quả đã hái.']]],
 ['flute_hill','🎐','Chiếc Sáo Tre Trên Đồi',['hill','ricefield'],'Một chiếc sáo tre nằm trên phiến đá, bên cạnh có tờ giấy viết vài nốt nhạc.',[
  ['📣 Tìm người đánh rơi sáo','safe','Bạn tìm được một bác nghệ nhân và nghe chuyện đời của chiếc sáo.','Bạn treo sáo ở chòi canh để chủ tới tìm.','Bạn đi hỏi mãi mà chẳng ai nhận.'],
  ['🎵 Thử thổi bản nhạc ngắn','balanced','Âm sáo vang trong trẻo, bác nghệ nhân xuất hiện và khen bạn.','Sáo kêu vài nốt, bạn biết thêm mẹo nhạc.','Bạn thổi mãi không ra tiếng, mất sức vì gắng quá.'],
  ['🎲 Sáng tác khúc sáo ngẫu hứng','wild','Giai điệu bất ngờ được mời biểu diễn ở hội làng!','Bạn thổi vài nốt vui tai cho trẻ con nghe.','Bạn lạc nhịp và bị cả nhóm trêu một phen.']]],
 ['book_exchange','📚','Sách Cũ Có Tờ Giấy Gấp',['school','district'],'Trong tủ sách cộng đồng có cuốn truyện cũ kẹp một mảnh giấy gấp nhiều lần.',[
  ['📚 Giữ sách đúng chỗ','safe','Bạn trả sách vào ngăn và được tặng dấu trang xinh.','Người trực thư viện cảm ơn vì bạn giữ sách cẩn thận.','Bạn vô tình xếp sai kệ, phải tìm lại cả buổi.'],
  ['📝 Đọc lời nhắn rồi tìm người viết','balanced','Bạn tìm ra tác giả của lá thư nhỏ và làm họ xúc động.','Lời nhắn chỉ là câu chúc người đọc vui vẻ.','Bạn hỏi nhầm tác giả khiến người khác bực mình.'],
  ['🎲 Theo bản đồ vẽ trên trang cuối','wild','Bản đồ dẫn tới chiếc hộp kỷ niệm ở sân trường!','Bản đồ chỉ một gốc cây bình thường.','Bạn đi nhầm cổng trường, mất phí gửi xe.']]],
 ['milk_delivery','🥛','Xe Sữa Lắc Lư Trên Đường',['lane','busstop','district'],'Một xe giao sữa kẹt bánh ở con dốc nhỏ, vài thùng hàng bắt đầu trượt.',[
  ['🧱 Chèn bánh xe','safe','Bạn chèn chắc bánh, cứu được cả xe và hàng.','Xe dừng lại an toàn, chờ người kéo tới.','Bạn loay hoay đi kiếm viên gạch, mệt khá lâu.'],
  ['💪 Giúp đẩy xe lên dốc','balanced','Xe qua dốc ngon lành, tài xế chia phần tiền công.','Hai người đẩy tới chỗ bằng phẳng rồi nghỉ.','Bạn trượt tay, vài hộp sữa móp phải đền.'],
  ['🎲 Đề xuất đường vòng xuyên ngõ','wild','Đường tắt giúp giao hàng trước giờ, tiền thưởng rất hậu.','Xe đi được nhưng đường vòng khá dài.','Đường ngõ hẹp quá, bạn chịu phí quay xe.']]],
 ['pet_show','🐾','Cuộc Thi Thú Cưng Bất Ngờ',['market','district','lane'],'Khu chợ mở cuộc thi thú cưng dễ thương, ai cũng đưa thú cưng đến khoe.',[
  ['📣 Phụ người dẫn chương trình','safe','Buổi thi diễn ra suôn sẻ, bạn được tặng phiếu quà.','Bạn phụ giữ hàng ghế không bị chen lấn.','Cả đàn chó chạy tán loạn khiến bạn phải đuổi mệt.'],
  ['🍪 Dụ một bé cún lên sân khấu','balanced','Bé cún ngoan ngoãn trình diễn và đoạt giải phụ.','Cún làm trò ngộ nghĩnh khiến mọi người cười.','Cún ăn hết bánh rồi nằm ngủ, bạn mất tiền bánh.'],
  ['🎲 Đăng ký bé mèo hoang vừa gặp','wild','Bé mèo bất ngờ trở thành ngôi sao mạng của hội chợ!','Bé mèo bước một vòng rồi nhảy xuống.','Mèo bỏ chạy cùng vòng cổ mượn, bạn phải trả tiền.']]],
 ['lost_key','🗝️','Chùm Chìa Khóa Nhiều Màu',['lane','district','busstop'],'Một chùm chìa khóa với sáu móc khác nhau nằm cạnh băng ghế.',[
  ['🏪 Gửi chìa ở cửa hàng gần đó','safe','Người mất quay lại ngay và rất biết ơn.','Chủ cửa hàng giữ hộ và dán giấy tìm người.','Bạn phải đi một vòng xác nhận người nhận.'],
  ['🔍 Tìm dấu hiệu trên móc khóa','balanced','Móc khóa trường học giúp bạn tìm đúng chủ.','Bạn tìm được khu phố liên quan.','Bạn hiểu sai ký hiệu và đi hỏi nhiều nhà.'],
  ['🎲 Thử mở chiếc tủ cũ ghi trên móc','wild','Bạn gặp đúng người đang tìm tủ và được tặng quà lớn.','Tủ đã bỏ không từ lâu, chẳng có gì.','Người khác hiểu nhầm ý bạn, mất công giải thích.']]],
 ['secret_recipe','🍲','Tờ Công Thức Bị Gió Cuốn',['market','temple','lane'],'Một tờ giấy ghi công thức gia truyền bị gió thổi ra giữa đường.',[
  ['📜 Nhặt và trả chủ quán','safe','Chủ quán vui mừng, cho bạn thử món đặc biệt.','Bạn trả lại được tờ giấy ngay trước giờ nấu.','Gió làm rách góc giấy, bạn phải xin lỗi.'],
  ['🍜 Đoán món ăn từ nguyên liệu','balanced','Bạn đoán đúng, chủ quán mời bạn học nghề.','Bạn đoán gần đúng, mọi người trao đổi mẹo nấu.','Bạn nhầm gia vị làm món mẫu quá cay.'],
  ['🎲 Thử biến tấu công thức tại quầy','wild','Món mới bất ngờ được khách yêu thích, bạn trúng thưởng lớn!','Món khá lạ nhưng có người muốn nếm thử.','Món thất bại, bạn phải thanh toán nguyên liệu.']]],
 ['temple_cat','🐈','Mèo Mun Canh Cửa Đình',['temple','lane'],'Một con mèo mun nằm giữa lối vào đình, ai đi qua cũng bị nhìn chằm chằm.',[
  ['🐱 Ngồi yên để mèo tự tới','safe','Mèo dụi vào chân bạn, bác giữ đình tặng quà nhỏ.','Mèo ngáp dài rồi nằm ngủ tiếp.','Bạn ngồi lâu đến tê chân mà nó không lại.'],
  ['🥣 Đặt bát nước gần hiên','balanced','Mèo uống nước xong dẫn bạn đến chỗ đồ bị rơi.','Mèo uống nước rồi kêu lên một tiếng.','Mèo hất đổ bát, bạn phải lau nền sạch.'],
  ['🎲 Theo mèo xuyên vườn sau','wild','Mèo dẫn bạn tới kho kỷ vật thất lạc của đình!','Mèo đi lòng vòng rồi nhảy lên mái.','Bạn bị gai móc quần khi đuổi theo mèo.']]],
 ['flower_market','💐','Bó Hoa Đặt Nhầm Địa Chỉ',['market','district','school'],'Một bó hoa lớn kèm lời chúc được gửi nhầm tới quầy của người khác.',[
  ['📞 Gọi hỏi người đặt','safe','Người đặt cảm ơn, bó hoa tới đúng người nhận.','Bạn chuyển lại bó hoa qua người giao.','Gọi mãi không ai bắt máy, bạn phải chờ.'],
  ['📝 Đọc thiệp tìm manh mối','balanced','Bạn tìm đúng cô giáo nhận hoa mừng sinh nhật.','Thiệp nhắc một lớp học nhưng không có tên.','Bạn giao nhầm cho người trùng tên, phải chạy theo.'],
  ['🎲 Giao theo hình vẽ trên thiệp','wild','Hình vẽ đúng là cửa tiệm bí mật, bạn được thưởng bất ngờ.','Bạn tới đúng con phố nhưng phải hỏi thêm.','Bạn tới nhầm hai nơi và mất tiền gửi xe.']]],
 ['morning_fog','🌫️','Sương Mù Trên Đường Làng',['lane','hill','ricefield'],'Sương dày che khuất lối đi, một bác giao hàng đang tìm đường.',[
  ['🧭 Chỉ đường theo cột mốc','safe','Bạn dẫn đúng lối an toàn và được cảm ơn.','Bạn hướng dẫn người giao chờ sương tan.','Bạn đọc nhầm lối rẽ đầu tiên và phải quay lại.'],
  ['🔦 Dẫn đường bằng đèn pin','balanced','Bạn đưa hàng tới nơi trước giờ mở cửa.','Đèn giúp mọi người đi chậm nhưng an toàn.','Pin cạn nửa đường, bạn phải mua pin mới.'],
  ['🎲 Đi tắt qua con đường bí mật','wild','Đường tắt vừa gần vừa đẹp, chủ hàng thưởng cực hậu!','Bạn tìm được lối nhỏ nhưng mất chút công.','Bạn lạc ra tận ruộng xa, rất mệt và tốn tiền.']]]
];

const V84_NPC_CHAPTERS = {
 bebo:[
  ['🪁','Cánh Diều Đứt Dây','Bé Bơ ôm cuộn dây rối: “Diều của tớ bay mất rồi. Nó còn mang lời nhắn cho ba nữa…”',[
   ['🌳 Leo lên mô đất quan sát','safe','Bạn thấy diều mắc cây và lấy xuống nguyên vẹn.','Hai người phát hiện hướng gió thổi diều đi.','Cành cây quá cao khiến cả hai mất sức.'],['🏃 Chạy tới bờ sông tìm','balanced','Bé Bơ reo lên khi diều trôi vào bụi lau.','Hai người tìm thấy dây diều gần bờ.','Bạn sẩy chân vào bùn, ướt từ đầu tới chân.'],['🎲 Thả một chiếc diều khác dẫn đường','wild','Chiếc diều mới bất ngờ mắc vào diều cũ: tuyệt vời!','Diều mới bay cao, hai người cười rất vui.','Diều thứ hai cũng biến mất, phải mua dây bù.']]],
  ['📦','Hộp Thiếc Trong Gốc Cây','Bơ khoe tấm bản đồ vẽ tay tìm hộp thiếc ba từng cất khi còn nhỏ.',[
   ['🔎 Hỏi bác trông đình','safe','Bác nhớ chỗ chôn hộp, chỉ đường rất rõ.','Bạn biết thêm chuyện xưa của gia đình Bơ.','Bác nhớ nhầm cây, hai người tìm mỏi chân.'],['🗺️ Đối chiếu bản đồ với đường làng','balanced','Tấm bản đồ vừa khít góc sân sau, hộp đã được tìm thấy.','Bạn tìm được bậc đá đánh dấu trên giấy.','Bạn đào nhầm chỗ, phải san phẳng đất lại.'],['🎲 Đào ngay nơi có dấu X','wild','Bạn đào trúng hộp quý với ảnh cả nhà Bơ!','Bạn thấy chiếc lon cũ không phải hộp cần tìm.','Dấu X chỉ chỗ giấu đồ chơi hỏng, tốn công vô ích.']]],
  ['💌','Lời Nhắn Gửi Về Phố','Trong hộp là lá thư Bơ viết từ lâu nhưng không đủ can đảm gửi cho ba đi làm xa.',[
   ['✍️ Giúp Bơ viết lại thư','safe','Lá thư ấm áp khiến Bơ mỉm cười đầy hy vọng.','Bơ viết được vài dòng chân thành.','Bơ xúc động quá, cả hai phải nghỉ một lúc.'],['📮 Đưa thư tới bưu điện huyện','balanced','Thư được gửi đúng chuyến sớm nhất và có hồi âm.','Thư được nhận, Bơ háo hức chờ tin.','Bạn nhầm giờ chuyến xe, phải trả thêm phí gửi.'],['🎲 Xin tài xế giao tận tay trong ngày','wild','Tài xế quen ba Bơ, lá thư tới nơi và quà hồi âm rất lớn!','Tài xế hứa khi tiện đường sẽ chuyển giúp.','Tài xế không đi tuyến đó, bạn phải tìm cách khác.']]]
 ],
 mika:[
  ['📸','Bức Ảnh Bị Xé','Mika đưa nửa tấm ảnh chụp hai người bạn thời nhỏ. Nửa còn lại biến mất sau một trận cãi vã.',[
   ['💬 Lắng nghe Mika tâm sự','safe','Mika dám kể nguyên nhân hiểu lầm và tin tưởng bạn hơn.','Mika thấy lòng nhẹ đi đôi chút.','Chuyện buồn khiến cả hai ngồi im một lúc lâu.'],['🧩 Tìm nửa ảnh còn lại','balanced','Bạn tìm được nửa ảnh trong cuốn sổ lưu niệm.','Bạn có manh mối về người giữ phần ảnh kia.','Bạn hỏi nhầm người, Mika ngượng đỏ mặt.'],['🎲 Nhắn người bạn cũ gặp bất ngờ','wild','Hai người gặp lại, ôm nhau khóc vui sướng!','Buổi gặp hơi ngượng nhưng đã bắt đầu nói chuyện.','Người bạn cũ chưa sẵn lòng, Mika rất buồn.']]],
  ['📻','Radio Ở Tiệm Tạp Hóa','Mika nghe giọng hát quen trên chiếc radio cũ, nghi đó là bài hát người bạn từng viết.',[
   ['🎶 Ghi tên chương trình','safe','Bạn tìm được thông tin của chương trình phát thanh.','Hai người biết tên bài hát.','Đúng lúc ấy sóng radio nhiễu nặng.'],['☎️ Gọi tới đài phát thanh','balanced','Đài xác nhận tác giả và giúp gửi lời nhắn.','Nhân viên hẹn gọi lại sau.','Bạn gọi nhầm số cũ và mất cước điện thoại.'],['🎲 Gửi lời nhắn lên sóng trực tiếp','wild','Người bạn nghe được ngay và nhắn lại trên sóng!','Lời nhắn được phát nhưng chưa có hồi âm.','Bạn run quá nói nhầm tên, cả hai ngượng chín mặt.']]],
  ['🌸','Một Lời Xin Lỗi Ở Hội Chợ','Người bạn cũ hẹn gặp Mika ở hội chợ, cô ấy nhờ bạn đi cùng để lấy can đảm.',[
   ['🤝 Đứng bên cạnh làm chỗ dựa','safe','Hai người nói chuyện bình tĩnh và dần hiểu nhau.','Cuộc gặp ngắn nhưng không còn giận nhau.','Cả hai chưa nói được nhiều, cần thêm thời gian.'],['🎁 Chuẩn bị một món quà nhỏ','balanced','Món quà khiến người bạn mỉm cười và nhận lời làm hòa.','Món quà được nhận nhưng vẫn còn ngập ngừng.','Quà làm hỏng gói khi di chuyển, bạn tốn tiền sửa.'],['🎲 Đề nghị cả hai hát lại bài năm xưa','wild','Họ hòa giọng giữa chợ, cả làng cổ vũ và tặng thưởng!','Hai người chỉ hát được đoạn điệp khúc, rồi bật cười.','Bài hát khó quá, cuộc gặp trở nên ngượng ngập.']]]
 ],
 baTu:[
  ['📜','Cuốn Sổ Món Ăn Cũ','Bà Tư tìm thấy sổ tay nấu ăn của mẹ nhưng một trang quan trọng đã thất lạc.',[
   ['🧺 Phụ bà tìm trong gác','safe','Trang công thức nằm dưới đáy rương, bà xúc động.','Bạn tìm được vài tờ ghi chú nhỏ.','Bụi gác làm bạn hắt hơi suốt buổi.'],['🍲 Nấu thử món bà nhớ','balanced','Mùi vị khiến bà nhớ ra nguyên liệu đã quên.','Bà nhận ra mùi quen dù món chưa đúng lắm.','Bạn nêm nhầm gia vị phải mua lại một mẻ.'],['🎲 Hỏi người bán gia vị bí truyền','wild','Bà chủ hàng biết đúng công thức và tặng bí quyết!','Người bán có một biến thể khác cũng ngon.','Bạn mua nhầm gia vị quý mà không dùng được.']]],
  ['🕯️','Bức Thư Chưa Đọc','Trong cuốn sổ có bức thư bà Tư chưa bao giờ đủ can đảm mở.',[
   ['💗 Ngồi cạnh khi bà đọc','safe','Thư chỉ toàn lời yêu thương, bà nhẹ lòng.','Bà đọc vài đoạn rồi cất lại, cần thêm thời gian.','Bà xúc động bật khóc, bạn ở bên an ủi.'],['📖 Giúp bà đọc chữ đã phai','balanced','Bạn khôi phục được những dòng quan trọng.','Hai người hiểu được nửa nội dung.','Bạn đoán sai vài chữ khiến câu chuyện lệch hướng.'],['🎲 Đem thư nhờ người giữ tư liệu làng','wild','Người giữ tư liệu có cả tập thư hồi âm!','Họ nhận lời giúp khi có thời gian.','Mảnh giấy quá cũ bị mờ thêm, bà buồn một lúc.']]],
  ['🍲','Bữa Cơm Cả Xóm','Bà Tư muốn nấu bữa cơm cảm ơn những người từng giúp gia đình bà.',[
   ['🥬 Phụ chuẩn bị từ sáng','safe','Bữa cơm ấm cúng, bà Tư rất tự hào về bạn.','Món ăn đủ cho mọi người cùng thưởng thức.','Bạn nấu quá nhiều, phải chia đồ còn dư.'],['📣 Mời hàng xóm cùng góp món','balanced','Cả xóm đem món nhà, bữa tiệc thành ngày hội nhỏ.','Một vài nhà tới và rất vui.','Mọi người tới lệch giờ, bạn phải chạy chuẩn bị thêm.'],['🎲 Tổ chức cuộc thi món ăn bất ngờ','wild','Bữa cơm trở thành lễ hội ẩm thực, bạn được thưởng lớn!','Cuộc thi rất vui dù không có giải lớn.','Bạn phải đền vài đĩa bị vỡ lúc sắp bàn.']]]
 ],
 chuNam:[
  ['🔧','Chiếc Xe Hàng Cà Tàng','Chú Năm trăn trở vì chiếc xe chở rau liên tục chết máy, không kịp phiên chợ.',[
   ['🔩 Phụ kiểm tra bugi','safe','Bạn tìm đúng chỗ hỏng, xe nổ máy ngay.','Cả hai biết linh kiện nào cần thay.','Bạn tháo hơi lâu làm mất công buổi sáng.'],['🚚 Nhờ người kéo xe','balanced','Người làng giúp kéo xe đến gara kịp giờ.','Xe được kéo tới nơi sửa.','Xe mắc ổ gà, bạn tốn phí kéo thêm.'],['🎲 Chạy thử qua đèo nhỏ','wild','Xe chạy êm bất ngờ, chú thưởng hậu hĩnh!','Xe đi chậm nhưng không chết máy.','Xe lại hỏng giữa dốc, bạn phải góp phí sửa.']]],
  ['📦','Lô Hàng Bị Đánh Tráo','Chú Năm nhận thùng hàng lạ có nhãn giống hệt đơn giao chính thức.',[
   ['🧾 Đối chiếu biên nhận','safe','Bạn chỉ ra hai chữ ký khác nhau và cứu cả chuyến hàng.','Biên nhận cần được xác nhận lại.','Bạn phải đi tìm tờ hóa đơn thất lạc.'],['📱 Gọi người nhận xác minh','balanced','Khách báo đúng mã thùng, chú thở phào.','Khách hẹn đối chiếu khi hàng tới.','Điện thoại hết pin giữa chừng, bạn tốn tiền nạp.'],['🎲 Mở thùng lạ trước mặt mọi người','wild','Bên trong là phần quà bất ngờ từ một khách cũ!','Thùng chứa đồ đóng gói bình thường.','Mở nhầm hàng niêm phong, bạn phải trả phí dán lại.']]],
  ['🛣️','Con Đường Mới Qua Làng','Chú Năm định mở tuyến giao rau giúp người vùng xa, nhưng còn thiếu người thử đường.',[
   ['🗺️ Cùng vẽ lộ trình an toàn','safe','Tuyến đường được mọi người công nhận, chú cảm ơn bạn.','Bạn tìm ra hai điểm dừng hợp lý.','Đường vòng xa hơn dự kiến, cần chỉnh lại.'],['🚲 Chạy thử giao hàng','balanced','Chuyến thử thành công, khách vùng xa đặt thêm nhiều đơn.','Bạn giao được đơn đầu tiên nhưng chậm chút.','Mưa kéo tới khiến bạn phải trả tiền bọc hàng.'],['🎲 Nhận tuyến khó qua dốc','wild','Bạn hoàn thành chuyến nhanh kỷ lục, nhận thưởng lớn!','Bạn giao tới nơi nhưng khá mệt.','Xe mắc bùn, phải nhờ người kéo mất tiền.']]]
 ],
 coLua:[
  ['🌾','Hạt Giống Không Nảy Mầm','Cô Lúa buồn vì một luống giống quý không chịu lên cây sau nhiều ngày.',[
   ['🌱 Kiểm tra đất và nước','safe','Bạn phát hiện đất bị nén và giúp cô cải tạo lại.','Cô biết phải chờ thêm ít ngày.','Bạn xới nhầm luống phụ, phải san lại.'],['🧪 Thử ươm trong chậu riêng','balanced','Mẻ giống thử nhú mầm xanh, cô Lúa rất vui.','Vài hạt nảy mầm, đủ để cô thử tiếp.','Chậu bị nắng quá làm hỏng một ít giống.'],['🎲 Dùng mẹo dân gian truyền miệng','wild','Cả luống bật mầm, người làng ngạc nhiên và thưởng lớn!','Mẹo không khác nhiều so với tưới bình thường.','Mẹo làm đất bị khô, phải mua phân ủ bù.']]],
  ['☔','Cơn Mưa Không Báo Trước','Mây đen kéo qua giữa mùa phơi lúa, cô Lúa cần cứu đống thóc ngoài sân.',[
   ['🧺 Phụ đưa thóc vào nhà','safe','Mẻ thóc được cất khô, cô gửi lời cảm ơn.','Bạn cứu được phần lớn thóc.','Bạn chạy nhiều quá, mỏi cả chân.'],['🪄 Dựng mái che tạm','balanced','Mái che cứu được tất cả thóc đúng lúc mưa tới.','Mái che tạm đủ để tránh mưa nhẹ.','Gió cuốn bạt, bạn phải thay dây mới.'],['🎲 Nhờ hàng xóm làm dây chuyền vận chuyển','wild','Cả xóm cùng ra tay, cứu thóc kịp giờ và mở hội nhỏ!','Một vài người phụ giúp, công việc nhẹ đi.','Người tới không đủ, bạn vừa mất công vừa tốn phí.']]],
  ['🏆','Hội Thi Nông Sản Làng','Cô Lúa lần đầu đem nông sản dự hội thi, hồi hộp sợ bị chê.',[
   ['🌷 Giúp trang trí gian hàng','safe','Gian hàng mộc mạc được nhiều người yêu thích.','Mọi thứ gọn gàng, cô Lúa bớt căng thẳng.','Bạn dán nhầm bảng tên phải làm lại.'],['🧺 Kể câu chuyện về giống lúa','balanced','Ban giám khảo xúc động và trao giải thiện chí.','Khách rất thích nghe chuyện hạt giống.','Bạn quên mất một đoạn giới thiệu, hơi bối rối.'],['🎲 Thử đấu giá giỏ nông sản đặc biệt','wild','Giỏ được trả giá cao nhất hội, cô Lúa reo vui!','Có người mua giỏ với giá vừa phải.','Không ai đấu giá, bạn phải trả phí trưng bày.']]]
 ],
 bacCau:[
  ['🔔','Tiếng Chuông Bến Cũ','Bác Cầu tìm chiếc chuông báo nước lớn đã bị thất lạc từ thời sửa cầu.',[
   ['📜 Hỏi người từng sửa cầu','safe','Một người thợ cũ nhớ đúng chỗ cất chuông.','Bạn tìm thấy bản vẽ cầu xưa.','Bạn hỏi nhầm người, mất công đi vòng.'],['🌊 Tìm dưới kho ven sông','balanced','Chiếc chuông nằm ngay trong hòm gỗ ở kho.','Bạn thấy chiếc móc chuông cũ làm manh mối.','Kho ẩm, bạn mất sức dọn đống gỗ mục.'],['🎲 Lặn tìm theo lời đồn','wild','Bạn phát hiện chiếc chuông đồng cổ nguyên vẹn!','Bạn chỉ thấy một mảnh kim loại không rõ nguồn.','Bạn mò mẫm quá lâu, phải nhờ người đưa về.']]],
  ['📖','Tên Người Khắc Trên Cầu','Bác Cầu kể về một cái tên bị mưa xóa trên thành cầu, mong tìm lại câu chuyện ấy.',[
   ['🖋️ Chép lại nét chữ còn thấy','safe','Bạn ghép được họ tên đầy đủ để hỏi người làng.','Bạn đọc được một phần chữ cũ.','Bạn chép nhầm ký tự, phải sửa sổ tay.'],['📚 Hỏi kho tư liệu xã','balanced','Tư liệu xác nhận người xây cầu năm xưa.','Người giữ sổ hứa tra tiếp.','Sổ cũ bị thiếu trang, bạn tìm mãi không ra.'],['🎲 Đoán tên qua giai thoại dân gian','wild','Truyền thuyết hóa ra đúng, bác Cầu tặng món quà hiếm!','Bạn nghe thêm câu chuyện đẹp về lòng tốt.','Tên đoán sai khiến bác hụt hẫng chút ít.']]],
  ['🌉','Ngày Khánh Thành Cầu','Bác Cầu muốn làm lễ nhỏ cảm ơn mọi người đã giúp bảo tồn cây cầu.',[
   ['🧹 Dọn đường quanh cầu','safe','Buổi lễ trang nghiêm, bác Cầu cười thật tươi.','Mọi người giúp làm sạch lối đi.','Bạn phải đi nhặt nhiều rác hơn dự tính.'],['🎶 Mời đội nhạc làng','balanced','Tiếng nhạc lan dọc bến, buổi lễ thật đáng nhớ.','Đội nhạc chơi vài bài thân quen.','Các nhạc cụ đến trễ, bạn chạy đi đón mệt nhoài.'],['🎲 Thả đèn ước nguyện trên bờ','wild','Hàng trăm chiếc đèn sáng lung linh, khách quyên góp rất nhiều!','Buổi thả đèn nhỏ nhưng ai cũng xúc động.','Gió quá mạnh nên phải hủy, bạn mất tiền chuẩn bị.']]]
 ],
 anhPho:[
  ['🧾','Hóa Đơn Kỳ Lạ','Anh Phố phát hiện một hóa đơn nhập hàng có giá cao hơn hẳn mọi lần.',[
   ['🧮 So lại từng con số','safe','Bạn phát hiện lỗi gõ số và cứu anh khỏi trả thừa.','Hai người xác định được dòng tiền cần xác minh.','Bạn phải tra quá nhiều sổ, tốn cả buổi.'],['📱 Gọi đại lý đối chiếu','balanced','Đại lý nhận nhầm và hoàn lại tiền ngay.','Đại lý hứa kiểm tra trong ngày.','Bạn gọi nhầm nhân viên cũ, mất thêm phí.'],['🎲 Đề nghị đổi sang nguồn hàng mới','wild','Nguồn mới vừa rẻ vừa tốt, anh Phố thưởng lớn!','Nguồn mới tương đương nguồn cũ.','Nguồn mới giao trễ, bạn phải bù một phần chi phí.']]],
  ['🚚','Chuyến Hàng Chạy Đua Thời Gian','Một kiện hàng cần tới huyện trước khi cửa kho đóng, anh Phố nhờ bạn tính đường.',[
   ['🗺️ Xem giờ các tuyến xe','safe','Bạn chọn đúng chuyến sớm và hàng tới kịp.','Hàng đi chuyến cuối, sát giờ nhưng ổn.','Bạn đọc sai bảng giờ cũ, phải đổi tuyến.'],['🛵 Thuê xe máy chuyển gấp','balanced','Xe tới vừa kịp giờ, người nhận rất biết ơn.','Hàng tới sát giờ, không còn thời gian thừa.','Xe hỏng giữa đường, bạn phải trả thêm phí chuyển.'],['🎲 Nhờ người quen đi đường núi','wild','Đường núi thông thoáng, hàng giao sớm kỷ lục!','Hàng được giao nhưng muộn một chút.','Đường núi sạt đất, phải đi vòng rất tốn tiền.']]],
  ['🏬','Gian Hàng Đầu Tiên Ở Huyện','Anh Phố muốn mở gian hàng chung cho tiểu thương quê, rủ bạn tham gia ngày khai trương.',[
   ['🧺 Giúp phân chia gian hàng','safe','Buổi khai trương suôn sẻ và tiểu thương đều vui.','Bạn sắp được gian hàng gọn gàng.','Khách đến quá đông làm bạn mệt cả ngày.'],['📣 Quảng bá món quê cho khách','balanced','Khách kéo tới đông, anh Phố cảm ơn bằng phần thưởng lớn.','Một số khách muốn thử món quê.','Bạn giới thiệu nhầm giờ mở, phải xin lỗi khách.'],['🎲 Tổ chức phiên chợ đêm bất ngờ','wild','Phiên chợ bùng nổ, bạn thành người hùng khai trương!','Có vài gian tham gia, buổi tối vẫn vui.','Khách đến ít, bạn phải trả một phần tiền thuê.']]]
 ]
};


/* ===== V87.3: cư dân cố định + 24 chương cho Phố Nhỏ / Trường Thị Trấn ===== */
const V873_RESIDENTS = {
  bacTam: {name:'Bác Tám', home:'lane', accent:'🪴', bubble:'Góc phố nay lạ lắm!', chibi:'male', job:'Ông hàng xóm thích cây cảnh', desc:'Bác Tám trồng cây trước ngõ và luôn có vài bí mật về phố cũ.', theme:'#86b999'},
  coUt: {name:'Cô Út', home:'lane', accent:'🧵', bubble:'Ghé nhà cô chơi!', chibi:'female', job:'Người thợ may trong phố', desc:'Cô Út cất rất nhiều kỷ vật và câu chuyện về mái ngói xưa.', theme:'#efa6ab'},
  bacBinh: {name:'Bác Bình', home:'school', accent:'🗝️', bubble:'Ra vào đúng giờ nhé!', chibi:'male', job:'Bảo vệ trường', desc:'Bác bảo vệ nghiêm nghị nhưng rất thương học trò.', theme:'#9fb4be'},
  coHanh: {name:'Cô Hạnh', home:'school', accent:'📚', bubble:'Có gì cô giúp?', chibi:'female', job:'Giáo viên chủ nhiệm', desc:'Cô giáo dịu dàng, luôn chú ý đến những bạn nhỏ gặp khó khăn.', theme:'#edb9a5'},
  thayDung: {name:'Thầy Dũng', home:'school', accent:'🏃', bubble:'Khởi động nào!', chibi:'male', job:'Giáo viên thể dục', desc:'Thầy thể dục nhiệt tình, đôi khi nóng tính nhưng rất công bằng.', theme:'#84c9ab'},
  thayMinh: {name:'Thầy Minh', home:'school', accent:'🎓', bubble:'Ta có chuyện cần bàn.', chibi:'male', job:'Hiệu trưởng', desc:'Thầy hiệu trưởng nghiêm túc, luôn lo cho tương lai ngôi trường.', theme:'#a3a9d9'},
  banLan: {name:'Bạn Lan', home:'school', accent:'🌻', bubble:'Có vụ này hay lắm!', chibi:'female', job:'Học sinh tinh nghịch', desc:'Lan nhanh nhẹn và thích giải câu đố, nhưng hay hấp tấp.', theme:'#f1bf76'},
  banMai: {name:'Bạn Mai', home:'school', accent:'🎨', bubble:'Tớ vẽ một điều bí mật…', chibi:'female', job:'Học sinh yêu hội họa', desc:'Mai trầm tính, thích vẽ và ghi nhớ những chuyện ít ai để ý.', theme:'#d9a2d8'}
};
Object.entries(V873_RESIDENTS).forEach(([id,p])=>{
 VILLAGE_NPC_LIBRARY[id]={id,name:p.name,chibi:p.chibi,accent:p.accent,bubble:p.bubble,tags:[p.home],home:p.home,desc:`${p.job}. ${p.desc}`,actions:[
  {label:'💬 Hỏi thăm chuyện hôm nay',outcomes:[{w:58,good:true,text:`${p.name} kể chuyện thường ngày và vui vì được bạn lắng nghe.`,karma:2,exp:8},{w:26,good:true,text:`Bạn giúp ${p.name} một việc lặt vặt, nhận chút tiền nước.`,coins:14,exp:7},{w:16,bad:true,text:`${p.name} đang bận, bạn đợi một lúc rồi ra về.`,energy:-3}]},
  {label:'🎲 Thử vận may cùng người quen',outcomes:[{w:15,good:true,rarity:'jackpot',text:`Hên bất ngờ! ${p.name} gửi bạn một túi quà may mắn.`,blindBag:1,exp:14},{w:49,good:true,text:`${p.name} chia sẻ một mẹo hay.`,exp:12,karma:2},{w:36,bad:true,text:`Hai người thử mãi vẫn không có kết quả, đành cười trừ.`,energy:-5,coins:-8}]}
 ]};
 VILLAGE_NPC_META[id]={rarity:['thayMinh','banMai'].includes(id)?'uncommon':'common',anchor:{[p.home]:id==='banMai'||id==='thayMinh'?2:0}};
 // SVG portraits are offline assets, with unique colors, hair and badges; never fetch from the web.
 const hair=p.chibi==='female'?'#54362e':'#5e4532';
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="92" height="116" viewBox="0 0 92 116"><rect width="92" height="116" rx="20" fill="${p.theme}"/><circle cx="45" cy="41" r="36" fill="#fff8e6" opacity=".4"/><path d="M25 77 Q45 65 67 77 L78 116 H13 Z" fill="${p.chibi==='female'?'#eeebe9':'#6a9c77'}"/><ellipse cx="45" cy="49" rx="25" ry="27" fill="#ffddbd"/><path d="M20 48 Q11 9 45 10 Q80 10 70 48 L64 34 Q46 40 28 33 Z" fill="${hair}"/><circle cx="35" cy="52" r="3.1" fill="#533b33"/><circle cx="55" cy="52" r="3.1" fill="#533b33"/><ellipse cx="27" cy="61" rx="6" ry="3" fill="#f3a5a7" opacity=".7"/><ellipse cx="63" cy="61" rx="6" ry="3" fill="#f3a5a7" opacity=".7"/><path d="M40 66 Q45 71 51 65" stroke="#ab6a53" stroke-width="2.5" fill="none" stroke-linecap="round"/><rect x="26" y="85" width="40" height="29" rx="14" fill="#ffefc8"/><text x="46" y="105" text-anchor="middle" font-size="21">${p.accent}</text></svg>`;
 VILLAGE_NPC_ART[id]='data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(svg);
});
// V87.3.3: full-body anime art for school residents; other residents keep their existing art.
VILLAGE_NPC_ART.coHanh = `assets/images/123_cohanh_2112ccc03d.webp`;
VILLAGE_NPC_ART.banLan = `assets/images/124_banlan_86bcbc38d4.webp`;
// V87.3.4 — ten approved NPC full-body illustrations (offline WebP).
VILLAGE_NPC_ART.bacTam = 'assets/images/125_bactam_75d212983c.webp';
VILLAGE_NPC_ART.coUt = 'assets/images/126_cout_e5658547c7.webp';
VILLAGE_NPC_ART.bacBinh = 'assets/images/127_bacbinh_8f5fc4780f.webp';
VILLAGE_NPC_ART.thayDung = 'assets/images/128_thaydung_efaeeebe94.webp';
VILLAGE_NPC_ART.thayMinh = 'assets/images/129_thayminh_e299a888a8.webp';
VILLAGE_NPC_ART.banMai = 'assets/images/130_banmai_250149ff71.webp';
VILLAGE_NPC_ART.mika = 'assets/images/131_mika_e7383538c2.webp';
VILLAGE_NPC_ART.coLua = 'assets/images/132_colua_6c8f41517c.webp';
VILLAGE_NPC_ART.bacCau = 'assets/images/133_baccau_e30ba5e5e0.webp';
VILLAGE_NPC_ART.anhPho = 'assets/images/134_anhpho_353f6abb0d.webp';

// Các NPC cũ có quê nhà riêng. Đi sang khu khác vẫn có thể gặp tình cờ,
// nhưng chương truyện chỉ mở ở quê nhà.
for(const [id,zone] of Object.entries({bebo:'lane',baTu:'lane',mika:'market',chuNam:'busstop',coLua:'ricefield',bacCau:'riverside',anhPho:'district'})) {
 VILLAGE_NPC_LIBRARY[id].home=zone;
}
const V873_STORY_DATA = {
 bacTam:[
 ['🪴','Cây Bàng Trước Ngõ','Bác Tám lo cây bàng già trước ngõ sẽ bị chặt để sửa đường.','Đo lại phần rễ cây','Xin người làng cùng ký tên','Lén di chuyển biển sửa đường'],
 ['📷','Tấm Ảnh Phố Cũ','Bác Tám tìm thấy ảnh phố từ nhiều năm trước, có một gương mặt lạ.','Hỏi người trong ảnh','Mang ảnh tới tiệm phục chế','Giấu ảnh để tự điều tra'],
 ['🏡','Góc Phố Cho Mọi Người','Bác muốn biến ngõ nhỏ thành nơi mọi người tụ họp.','Giúp dọn ngõ','Kêu gọi bà con góp cây','Tự nhận làm công trình lớn']],
 coUt:[
 ['🧵','Cuộn Chỉ Màu Mật Ong','Cô Út đánh mất cuộn chỉ để hoàn thành chiếc áo lễ.','Tìm quanh hiên nhà','Đến chợ hỏi mua chỉ','Dùng thử sợi chỉ lạ'],
 ['🎀','Bộ Áo Của Người Xưa','Có người đến nhận chiếc áo cô Út đã giữ nhiều năm.','Kiểm tra tên người nhận','Hỏi chuyện người hàng xóm','Đánh cược giao áo ngay'],
 ['🏮','Đêm Thắp Đèn Phố Nhỏ','Cô muốn may dải cờ cho cả phố nhưng thiếu người phụ.','Giúp cắt may','Nhờ bạn bè hỗ trợ','May họa tiết thật cầu kỳ']],
 bacBinh:[
 ['🗝️','Chìa Khóa Cổng Trường','Bác Bình phát hiện một chìa khóa lạ nằm gần cổng sau.','Ghi nhận chìa khóa','Đến phòng trực tìm hồ sơ','Thử mở cửa kho cũ'],
 ['🌙','Ánh Đèn Sau Giờ Học','Có đèn sáng ở dãy lớp học lúc trường đã đóng cửa.','Cùng bác kiểm tra','Hỏi lại trực nhật','Một mình bước vào hành lang'],
 ['🏅','Người Gác Cổng Tận Tâm','Trường tổ chức buổi tri ân nhưng bác Bình định từ chối.','Viết lời cảm ơn','Nhờ học sinh làm thiệp','Lên kế hoạch bất ngờ']],
 coHanh:[
 ['📖','Trang Vở Bị Xé','Một học sinh không dám nộp bài vì quyển vở bị xé mất trang.','Hỏi chuyện nhẹ nhàng','Tìm giấy thay thế','Thử truy ra người xé vở'],
 ['📚','Góc Sách Bị Bỏ Quên','Tủ sách lớp đã cũ, cô Hạnh muốn mở lại góc đọc.','Sắp xếp lại sách','Xin sách từ người làng','Đấu giá tập truyện cũ'],
 ['💌','Lời Cảm Ơn Chưa Gửi','Cô Hạnh giữ một lá thư cảm ơn mà chưa biết trao cho ai.','Tìm đúng người nhận','Hỏi học sinh cũ','Mang thư đến bất ngờ']],
 thayDung:[
 ['🏃','Đường Chạy Mất Vạch','Sân tập bị mưa làm mờ vạch, lớp thể dục sắp bắt đầu.','Kẻ lại vạch','Chuyển bài tập sang sân khác','Tổ chức thử thách ngoài trời'],
 ['🥇','Người Chạy Cuối Cùng','Một bạn học sinh luôn về cuối và muốn bỏ hội thao.','Động viên tập chậm','Lập kế hoạch tập luyện','Đăng ký cuộc thi bất ngờ'],
 ['🏆','Hội Thao Không Chỉ Có Giải Nhất','Thầy Dũng muốn làm giải mà ai cũng có cơ hội tỏa sáng.','Giúp phân nhóm','Chuẩn bị phần thưởng chung','Thử luật chơi hoàn toàn mới']],
 thayMinh:[
 ['📜','Đơn Đề Nghị Lạ','Thầy hiệu trưởng nhận đơn đề nghị chuyển một phần sân trường.','Đọc kỹ hồ sơ','Hỏi ý kiến phụ huynh','Đối chất với người đưa đơn'],
 ['🔔','Tiếng Chuông Cũ','Tiếng chuông trường bỗng ngừng vang mỗi sáng.','Nhờ kiểm tra chuông','Lục hồ sơ bảo dưỡng','Thử sửa ngay trên mái'],
 ['🏫','Giữ Lại Mái Trường','Ngôi trường cần một kế hoạch để tiếp tục hoạt động.','Lập ngân sách','Kêu gọi cựu học sinh','Thử một phương án táo bạo']],
 banLan:[
 ['📓','Nhật Ký Của Lan','Lan đánh mất quyển sổ ghi những điều bí mật của lớp.','Giúp tìm đúng nơi','Nhờ bác Bình hỏi thăm','Giả vờ biết người nhặt'],
 ['🕵️','Ai Đã Đánh Tráo Bức Thư','Một lá thư trong nhật ký lại không giống chữ của Lan.','Đối chiếu nét chữ','Hỏi người trong lớp','Đoán thủ phạm ngay'],
 ['🌻','Lời Hứa Cuối Năm','Lan muốn làm điều tốt trước khi chia tay lớp cũ.','Giúp viết thiệp','Rủ mọi người góp quà','Chuẩn bị bất ngờ lớn']],
 banMai:[
 ['🎨','Bức Tranh Chưa Tô Màu','Mai đang giấu một bức tranh vì sợ mọi người chê.','Nhẹ nhàng động viên','Đề nghị xem thử màu','Mang tranh đi dự giải'],
 ['🖼️','Người Trong Tranh','Bạn phát hiện nhân vật trong tranh giống người ở bức ảnh cũ.','Hỏi Mai về mẫu vẽ','Đi tìm người trong ảnh','Tự đoán danh tính'],
 ['🌈','Triển Lãm Đầu Tiên','Mai được mời trưng bày tranh nhưng không dám lên sân khấu.','Giúp treo tranh','Tập giới thiệu cùng Mai','Đề nghị cuộc triển lãm lớn']]
};
Object.entries(V873_STORY_DATA).forEach(([id,entries])=>{
 const npc=VILLAGE_NPC_LIBRARY[id];
 V84_NPC_CHAPTERS[id]=entries.map(([icon,title,desc,a,b,c])=>[icon,title,desc,[
  [`🟢 ${a}`,'safe',`${npc.name} và bạn giải quyết hợp lý, tìm được manh mối quý.`,`Cách này tiến triển từng bước; ${npc.name} hẹn bàn thêm.`,`Bạn sơ ý, ${npc.name} chưa hài lòng và muốn gặp lại.`],
  [`🟡 ${b}`,'balanced',`May mắn giúp hai người làm tốt hơn dự kiến.`,`Mọi thứ ổn nhưng vẫn còn một việc cần làm.`,`Vì vội, bạn làm rối câu chuyện khiến ${npc.name} lo lắng.`],
  [`🔴 ${c}`,'wild',`Bất ngờ lớn! ${npc.name} rất ấn tượng, cả hai nhận được tin vui.`,`Lựa chọn táo bạo tạo ra một kết quả khó đoán.`,`Mọi việc đi xa ngoài dự định, bạn cần trở lại sửa sai cùng ${npc.name}.`]
 ]]);
});

const V84_RISK_TABLE = {
 safe: {jackpot:4, good:56, neutral:30, bad:10, icon:'🟢', name:'Cẩn thận'},
 balanced: {jackpot:10, good:40, neutral:26, bad:24, icon:'🟡', name:'Hên xui'},
 wild: {jackpot:18, good:24, neutral:13, bad:45, icon:'🔴', name:'Đánh liều'}
};
function v84BuildChoices(source) {
  return source.map((a,i)=> {
    const [label,risk,goodText,neutralText,badText]=a;
    const r=V84_RISK_TABLE[risk]||V84_RISK_TABLE.balanced;
    return {label, risk, hint:`${r.icon} ${r.name} — kết quả chịu ảnh hưởng bởi vận may & thiện cảm`, outcomes:[
      {w:r.jackpot, good:true, rarity:'jackpot', text:`🍀 ĐẠI CÁT! ${goodText} Một món thưởng đặc biệt cũng đang chờ bạn.`, coins:risk==='wild'?170:94, exp:22+i*2, karma:3, ticket:1},
      {w:r.good, good:true, rarity:'good', text:goodText, coins:risk==='safe'?24:49, exp:13+i*2, karma:2},
      {w:r.neutral, rarity:'neutral', text:neutralText, exp:5+i, energy:risk==='wild'?-4:0},
      {w:r.bad, bad:true, rarity:'bad', text:badText, coins:risk==='wild'?-68:risk==='balanced'?-26:-12, energy:risk==='wild'?-18:risk==='balanced'?-9:-5, karma:risk==='wild'?-3:-1}
    ]};
  });
}
const V84_EXTRA_ENCOUNTERS = V84_RANDOM_SCENES.map(([id,icon,title,zones,desc,choices])=>({id:`v84_${id}`,icon,title,zones,desc,weight:1.15,choices:v84BuildChoices(choices)}));
const V84_NPC_STORY_EVENTS = [];
Object.entries(V84_NPC_CHAPTERS).forEach(([id,chapters])=>{
  chapters.forEach(([icon,title,desc,choices],stage)=>{
    const npc=VILLAGE_NPC_LIBRARY[id];
    V84_NPC_STORY_EVENTS.push({id:`v84_story_${id}_${stage}`,storyOnly:true,npcId:id,chapter:stage,icon,title:`${npc.name}: ${title}`,desc,choices:v84BuildChoices(choices)});
  });
});
VILLAGE_ENCOUNTERS.push(...V84_EXTRA_ENCOUNTERS,...V84_NPC_STORY_EVENTS);

const V84_NPC_SIDEQUESTS = {
 bebo:[['🎒 Giải mã bản đồ Bơ vẽ','balanced','Bạn ghép được manh mối dẫn tới món đồ thú vị.','Hai người tưởng tượng ra bản đồ kỳ bí đầy niềm vui.','Bản đồ ngược chiều, bạn chạy một vòng mỏi chân.'],['🪙 Đổi đồ chơi bí mật','wild','Bơ chọn trúng hộp quà độc đáo và chia cho bạn.','Hai người đổi được con quay cũ dễ thương.','Đồ chơi bị kẹt, bạn đền một phần phí.']],
 mika:[['🎤 Thử hát cùng Mika','balanced','Hai người hát hợp ý, được khách vỗ tay tặng quà.','Bạn và Mika cười suốt một bài hát.','Hát sai tông, cả hai ngượng ngùng.'],['🎁 Săn quà hội chợ','wild','Mika trúng quà lớn và tặng bạn phần đặc biệt.','Bạn có một món quà nhỏ vui vẻ.','Bạn chọn nhầm quầy đã hết quà, mất công.']],
 baTu:[['🧵 Gỡ cuộn chỉ rối','safe','Bạn gỡ xong, bà Tư tặng một món quà cảm ơn.','Hai bà cháu trò chuyện lúc làm việc.','Cuộn chỉ rối hơn trước, bạn phải mua kim mới.'],['🥮 Đoán nhân bánh bà làm','wild','Bạn đoán đúng vị bí truyền và được thưởng lớn.','Bạn đoán gần đúng, được ăn bánh thử.','Bạn đoán sai liên tiếp và bị bà cười trêu.']],
 chuNam:[['🧰 Chọn phụ tùng ngẫu nhiên','wild','Linh kiện vừa khít, chú Năm thưởng đậm!','Linh kiện dùng tạm được.','Linh kiện lệch cỡ, bạn phải góp phí đổi.'],['🚧 Giúp đặt biển chỉ đường','safe','Đường đi rõ ràng, người dân cảm ơn.','Hai người hoàn thành biển đơn giản.','Gió thổi đổ biển, bạn phải cắm lại.']],
 coLua:[['🌷 Đổi giống hoa với cô Lúa','balanced','Bạn đổi trúng loại giống hiếm cô rất quý.','Hai người đổi được hạt giống bình thường.','Bạn để rơi gói hạt khi đổi.'],['🐛 Bắt sâu cứu cây','safe','Bạn bắt được sâu đúng lúc, cả luống xanh tốt.','Bạn giúp cô phát hiện nơi sâu đẻ trứng.','Bạn mất công bắt nhầm con sâu vô hại.']],
 bacCau:[['🪙 Thử câu hỏi đố về dòng sông','wild','Bạn trả lời đúng câu đố hiếm và bác thưởng đậm.','Bác Cầu kể thêm chuyện bến sông.','Bạn trả lời sai và phải phụ quét cầu.'],['🪷 Phụ gỡ bèo dưới bến','safe','Bến sạch hơn hẳn, bác rất vui.','Hai người gom được một ít bèo.','Bèo nhiều quá làm bạn khá mệt.']],
 anhPho:[['📈 Hỏi bí quyết bán hàng','balanced','Anh Phố chỉ cho bạn một bí quyết kiếm Xu hữu ích.','Bạn nghe được vài bài học thực tế.','Bạn thử mẹo không đúng dịp, mất tiền quảng cáo.'],['🎲 Mở kiện mẫu chưa kiểm','wild','Mẫu hàng rất tốt, bạn được tặng quà giá trị!','Mẫu hàng bình thường, đáng để thử.','Mẫu bị lỗi, bạn phải góp phí gửi đổi.']]
};
Object.entries(V84_NPC_SIDEQUESTS).forEach(([id,acts])=>{
  const npc=VILLAGE_NPC_LIBRARY[id];
  if(npc) npc.actions.push(...v84BuildChoices(acts));
});
const V84_NPC_BUBBLES={
 bebo:['Tìm diều với tớ nha!','Có bí mật ở đầu làng!','Hôm nay liệu có may mắn?','Tớ có chuyện muốn kể!','Thử vận may cùng tớ không?'],
 mika:['Có tin mới nóng hổi!','Nghe một bài hát không?','Tớ muốn kể chuyện cũ…','Hôm nay chợ đông quá!','Đi tìm kỷ niệm nha!'],
 baTu:['Ngồi nghe bà kể đi con!','Bà nấu món bí truyền!','Giúp bà một tay nhé!','Hôm nay trời đẹp quá!','Đồ xưa quý ở kỷ niệm!'],
 chuNam:['Xe lại có chuyện rồi!','Theo chú giao hàng không?','Đi đường tắt có hên?','Chú có kèo mới đây!','Nhanh tay kẻo trễ chợ!'],
 coLua:['Hạt giống này lạ lắm!','Nay đồng có chuyện đó!','Giúp cô tưới rau nhé!','Không biết mai mưa không?','Mùa này may rủi ghê!'],
 bacCau:['Bến sông đang có chuyện!','Chú nghe tiếng chuông chưa?','Đi qua cầu cẩn thận!','Bác có chuyện xưa kể!','Tìm báu vật ven sông?'],
 anhPho:['Huyện có tin thú vị!','Một chuyến hàng bất ngờ!','Buôn bán cũng cần hên!','Hôm nay lên phố chứ?','Hàng mới về rồi nè!']
};
/* ===== V87.2 — memory, relation and delayed NPC consequences ===== */
const V872_NPC_VOICES = {
  bebo:{welcome:'Bơ cười toe: “Tớ biết bạn sẽ quay lại mà!”',ordinary:'Bơ chìa bản vẽ: “Hôm trước mình còn chưa nói hết đâu!”',hurt:'Bơ ôm con diều, giọng buồn: “Tớ cứ tưởng bạn sẽ giúp…”',warm:'Bơ khoe món đồ nhỏ xíu và bảo đã để dành cho bạn.',cold:'Bơ quay mặt đi: “Hôm nay tớ không muốn đùa.”',repair:'Bơ muốn bạn chứng minh lời hứa bằng một việc làm tử tế.',token:'🪁 một con diều giấy'},
  mika:{welcome:'Mika mỉm cười: “Có người chịu nghe mình kể chuyện, vui thật.”',ordinary:'Mika giữ lại một tấm ảnh cũ và muốn cùng bạn nhìn lại.',hurt:'Mika khoanh tay: “Bạn nói một đằng, mọi chuyện lại ra một nẻo.”',warm:'Mika nhắn bạn một đoạn nhạc chỉ hai người biết.',cold:'Mika tránh ánh mắt bạn, cuộc trò chuyện ngắn hẳn.',repair:'Mika muốn nghe lời giải thích thật lòng, không phải câu bào chữa.',token:'🎵 một đoạn giai điệu'},
  baTu:{welcome:'Bà Tư xoa đầu bạn: “Người sống có trước có sau là quý nhất.”',ordinary:'Bà Tư rót chén trà và kể tiếp chuyện hôm trước.',hurt:'Bà Tư thở dài: “Bà không tiếc đồ, bà tiếc lòng tin.”',warm:'Bà Tư để dành cho bạn một gói bánh thơm.',cold:'Bà Tư vẫn chào, nhưng không còn kể chuyện riêng.',repair:'Bà muốn bạn cùng sửa lại những gì đã lỡ làm hỏng.',token:'🥮 một chiếc bánh nhỏ'},
  chuNam:{welcome:'Chú Năm cười ha hả: “Có đồng đội thế này chú đỡ cực!”',ordinary:'Chú Năm kiểm lại sổ hàng rồi gọi bạn đến xem.',hurt:'Chú Năm cau mày: “Làm ăn là phải giữ chữ tín chứ!”',warm:'Chú Năm hứa giúp bạn chuyến vận chuyển sau.',cold:'Chú Năm chỉ đáp cụt lủn: “Ừ, biết rồi.”',repair:'Chú Năm muốn bạn nhận trách nhiệm trước khi bàn chuyện mới.',token:'🧰 một món phụ tùng'},
  coLua:{welcome:'Cô Lúa dịu dàng: “Được bạn giúp, ruộng cũng xanh hơn.”',ordinary:'Cô Lúa mang một gói hạt mới đến cho bạn xem.',hurt:'Cô Lúa nhìn luống cây: “Tụi mình đã hẹn chăm cùng nhau mà…”',warm:'Cô Lúa tặng bạn bó hoa mới hái ngoài đồng.',cold:'Cô Lúa mỉm cười xã giao rồi cúi xuống làm việc.',repair:'Cô Lúa mong bạn quay lại vun luống cây còn dang dở.',token:'🌱 một nhúm hạt giống'},
  bacCau:{welcome:'Bác Cầu gật gù: “Người biết giữ lời sẽ gặp đường lành.”',ordinary:'Bác Cầu chỉ về dòng sông và kể một đoạn chuyện xưa.',hurt:'Bác Cầu trầm giọng: “Nước qua cầu, lời nói không dễ lấy lại.”',warm:'Bác Cầu kể bạn nghe chỗ câu cá ít người biết.',cold:'Bác Cầu nhìn ra sông, im lặng khá lâu.',repair:'Bác muốn bạn nói rõ chuyện cũ trước khi đi tiếp.',token:'🪷 một đóa sen'},
  anhPho:{welcome:'Anh Phố cười: “Giữ uy tín vậy mới làm ăn đường dài được!”',ordinary:'Anh Phố mở cuốn sổ giá hàng: “Kèo hôm trước còn một đoạn.”',hurt:'Anh Phố nhíu mày: “Tính sai một lần, người ta nhớ lâu lắm!”',warm:'Anh Phố mách nhỏ cho bạn giá nhập tốt ở huyện.',cold:'Anh Phố bận việc, không còn rủ bạn bàn chuyện làm ăn.',repair:'Anh Phố yêu cầu bạn nói thẳng cách giải quyết trước khi hợp tác.',token:'📦 một phiếu giao hàng'}
};

/* V87.3: phong cách riêng cho 8 cư dân mới và ký ức dài hạn */
Object.entries(V873_RESIDENTS).forEach(([id,p])=>{
 V872_NPC_VOICES[id]={
  welcome:`${p.name} vui vẻ chào bạn: “Lần trước bạn giúp tôi, tôi vẫn nhớ đó!”`,
  ordinary:`${p.name} chào bạn ở ${VILLAGE_ZONES[p.home].name}. “Có chuyện thú vị muốn kể đây.”`,
  hurt:`${p.name} hơi buồn: “Chuyện hôm trước vẫn làm tôi nghĩ ngợi.”`,
  repair:`“Nếu có thời gian, chúng mình thử làm lại cho tốt nhé.”`,
  cold:`${p.name} dè chừng: “Tôi còn nhớ chuyện cũ đó.”`,
  warm:`${p.name} cười tươi: “Gặp đúng người bạn tin cậy rồi!”`,
  token:`${p.name} gửi bạn một lời cảm ơn chân thành.`
 };
 V84_NPC_BUBBLES[id]=[p.bubble,'Hôm nay gặp nhau thật vui!','Có một câu chuyện mới!','Bạn có rảnh giúp mình không?'];
});


/* ===== V87.4.0: Người Quen Bốn Phương — 13 cư dân mới ===== */
const V874_NPC_PROFILES = {"chiNhai":{"name":"Chị Nhài","home":"lane","accent":"👩‍🍳","bubble":"Bánh vừa ra lò đây!","chibi":"female","job":"Thợ làm bánh","chance":0.75,"rarity":"common","tastes":["food","handmade"],"rewardIcon":"🥐","rewardName":"Sổ Công Thức Bánh Nhà Nhài","rewardId":"v874_baker_book"},"coSau":{"name":"Cô Sáu","home":"market","accent":"🥬","bubble":"Rau nhà cô tươi lắm!","chibi":"female","job":"Chủ sạp rau","chance":0.85,"rarity":"common","tastes":["nature","handmade"],"rewardIcon":"🧺","rewardName":"Giỏ Rau Gia Truyền","rewardId":"v874_veg_basket"},"anhKhai":{"name":"Anh Khải","home":"market","accent":"🧂","bubble":"Có kèo thơm muốn nghe không?","chibi":"male","job":"Chủ quầy gia vị","chance":0.68,"rarity":"uncommon","tastes":["handmade","nostalgia"],"rewardIcon":"⚖️","rewardName":"Cân Gia Vị Thương Nhân","rewardId":"v874_spice_scale"},"chuLoc":{"name":"Chú Lộc","home":"market","accent":"🗝️","bubble":"Đồ cũ có chuyện hay lắm!","chibi":"male","job":"Người bán đồ cũ","chance":0.55,"rarity":"uncommon","tastes":["nostalgia","handmade"],"rewardIcon":"🗝️","rewardName":"Chìa Khóa Cổ","rewardId":"v874_antique_key"},"bacPhuc":{"name":"Bác Phúc","home":"ricefield","accent":"✂️","bubble":"Đừng giẫm lên cỏ nhé!","chibi":"male","job":"Người chăm công viên","chance":0.8,"rarity":"common","tastes":["nature","outdoor"],"rewardIcon":"🌱","rewardName":"Hạt Giống Cổ Thụ","rewardId":"v874_ancient_seed"},"chiHa":{"name":"Chị Hạ","home":"ricefield","accent":"🍹","bubble":"Nước mát mới pha đây!","chibi":"female","job":"Chủ xe nước công viên","chance":0.75,"rarity":"common","tastes":["cute","food"],"rewardIcon":"🍹","rewardName":"Bình Siro Cầu Vồng","rewardId":"v874_rainbow_syrup"},"anhKhoa":{"name":"Anh Khoa","home":"riverside","accent":"🎸","bubble":"Nghe thử bản nhạc này nhé!","chibi":"male","job":"Nhạc công","chance":0.65,"rarity":"uncommon","tastes":["heart","handmade"],"rewardIcon":"🎼","rewardName":"Hộp Nhạc Kỷ Niệm","rewardId":"v874_music_box"},"chiDiem":{"name":"Chị Diễm","home":"riverside","accent":"🎪","bubble":"Lễ hội đang cần bạn!","chibi":"female","job":"Người tổ chức sự kiện","chance":0.7,"rarity":"uncommon","tastes":["handmade","heart"],"rewardIcon":"🎟️","rewardName":"Thẻ Khách Mời Danh Dự","rewardId":"v874_festival_pass"},"coTuyet":{"name":"Cô Tuyết","home":"busstop","accent":"🎫","bubble":"Giữ vé cẩn thận nha!","chibi":"female","job":"Nhân viên bán vé","chance":0.85,"rarity":"common","tastes":["study","handmade"],"rewardIcon":"🎫","rewardName":"Vé Xe Kỷ Niệm","rewardId":"v874_old_ticket"},"anhTin":{"name":"Anh Tín","home":"busstop","accent":"📦","bubble":"Giao hàng đây, hình như...","chibi":"male","job":"Shipper","chance":0.7,"rarity":"common","tastes":["fun","outdoor"],"rewardIcon":"📦","rewardName":"Hộp Hàng May Mắn","rewardId":"v874_delivery_box"},"bacSiAn":{"name":"Bác sĩ An","home":"clinic","accent":"🩺","bubble":"Sức khỏe quan trọng nhất!","chibi":"male","job":"Bác sĩ trạm xá","chance":0.8,"rarity":"uncommon","tastes":["study","heart"],"rewardIcon":"🏅","rewardName":"Huy Hiệu Người Tốt","rewardId":"v874_good_badge"},"yTaLinh":{"name":"Y tá Linh","home":"clinic","accent":"💌","bubble":"Hôm nay bạn ổn chứ?","chibi":"female","job":"Điều dưỡng","chance":0.82,"rarity":"common","tastes":["cute","heart"],"rewardIcon":"💌","rewardName":"Hộp Thư Ký Ức","rewardId":"v874_memory_letters"},"ongKhang":{"name":"Ông Khang","home":"clinic","accent":"🌿","bubble":"Thử đoán tên lá này nhé!","chibi":"male","job":"Người nghiên cứu thảo dược","chance":0.58,"rarity":"uncommon","tastes":["nature","nostalgia"],"rewardIcon":"🌿","rewardName":"Hạt Giống Thảo Mộc Quý","rewardId":"v874_herb_seed"}};
const V874_STORY_DEFINITIONS = {"chiNhai":[["🥐","Mùi bánh đầu ngõ","Nhài chuẩn bị mở tiệm bánh gia đình nhưng mẻ bánh đầu tiên không như ý.","Nếm thử rồi góp ý thật lòng","Tìm người từng làm bánh ngon","Bán thử ngay tại ngõ"],["📖","Công thức thất lạc","Trang ghi công thức quan trọng đã biến mất, Bà Tư có thể biết điều gì đó.","Tìm ở kệ sổ cũ","Hỏi Bà Tư về cuốn sổ","Thử làm lại theo trí nhớ"],["🎉","Ngày khai trương","Khách xếp hàng trước tiệm, Nhài phân vân chọn chất lượng hay bán thật nhanh.","Phụ kiểm tra từng khay bánh","Đi chợ mua nguyên liệu tốt","Nhận đơn quá sức để kiếm lời"]],"coSau":[["🥦","Rổ rau bị trả lại","Khách chê lô rau của Cô Sáu dù rau còn tươi tốt.","Kiểm tra nguyên nhân","Hỏi khách và các sạp khác","Cãi tay đôi với người trả hàng"],["⚖️","Điều tra giá hàng","Một thương lái ép giá khiến cả chợ tranh cãi.","Ghi lại giá từng sạp","Hỏi Anh Khải cho rõ chuyện","Đặt cược vào giá ngày mai"],["🧺","Phiên chợ quyết định","Cô Sáu muốn hòa giải để tiểu thương cùng có lợi.","Giúp lập bảng giá minh bạch","Kêu gọi người bán họp chợ","Mở cuộc đấu giá bất ngờ"]],"anhKhai":[["🧂","Lô hàng giá hời","Anh Khải chào bán lô gia vị quá rẻ, nhưng nguồn gốc chưa rõ.","Kiểm hàng và hạn dùng","So giá với các sạp quen","Mua trọn lô ngay lập tức"],["📃","Hợp đồng mập mờ","Một khoản phí bị giấu trong điều khoản hợp đồng.","Đọc từng điều khoản","Nhờ Anh Phố xem giúp","Ký trước để giữ giá"],["🔎","Lời nói dối","Bạn phát hiện thông tin giao hàng trái ngược lời Khải nói.","Đối chiếu hóa đơn","Hỏi người giao hàng","Đối chất ngay trước chợ"],["🤝","Giữ tiền hay giữ chữ tín","Khải đứng trước cơ hội làm giàu nhưng phải đánh đổi uy tín.","Khuyên hoàn tiền công bằng","Thuyết phục hợp tác minh bạch","Đánh cược toàn bộ vào thương vụ"]],"chuLoc":[["🧰","Chiếc hộp cũ","Chú Lộc giấu một hộp cổ và không muốn bán dù được trả giá cao.","Hỏi nguồn gốc chiếc hộp","Xem ký hiệu trên khóa","Đưa giá cao để xin mở"],["🧩","Dấu hiệu bí ẩn","Một ký hiệu trên hộp giống phù hiệu ở Nhà Văn Hóa.","Chép lại hoa văn","Tìm người lớn tuổi biết chuyện","Thử đoán mật mã khóa"],["💌","Chủ nhân thật sự","Người đến nhận chiếc hộp có câu chuyện đầy xúc động.","Xác minh giấy tờ","Hỏi thêm về kỷ niệm","Tự quyết ai được giữ hộp"]],"bacPhuc":[["🌳","Cành cây gãy","Bác Phúc phát hiện cây cổ thụ bị phá hoại.","Quan sát dấu vết","Nhờ Cô Lúa kiểm tra cây","Canh cây một mình ban đêm"],["🔍","Người bị nghi oan","Một bạn nhỏ bị mọi người đổ lỗi làm gãy cây.","Lắng nghe từng nhân chứng","Hỏi người chăm vườn quanh đó","Công bố nghi phạm vội vàng"],["🌱","Cứu cây cổ thụ","Cây yếu dần, bác cần người giúp trong mùa nắng.","Tưới chăm đúng cách","Tìm cây giống thay thế","Thử phân bón lạ"]],"chiHa":[["🥤","Vị khách khó tính","Khách chê ly nước có vị lạ dù Hạ làm đúng công thức.","Nếm kiểm tra thành phần","Hỏi ý kiến người mua khác","Thi pha nước ngay lập tức"],["🧃","Bí mật bình siro","Một bình siro bị đổi vị trí làm nhiều đơn sai.","Dán nhãn lại các bình","Hỏi người giao nguyên liệu","Thử nếm ngẫu nhiên từng bình"],["🏆","Cuộc thi pha chế","Hạ đăng ký thi pha đồ uống ở quảng trường.","Giúp cân đo đúng vị","Trang trí quầy thi thật xinh","Sáng tạo thức uống chưa ai thử"]],"anhKhoa":[["🎸","Tiếng đàn bên ghế đá","Khoa ngại chơi đàn sau một lần biểu diễn không thành.","Nghe và khích lệ","Hỏi thăm bài hát yêu thích","Rủ biểu diễn giữa chợ"],["📝","Khúc nhạc bị quên","Một trang bản nhạc cũ bị thất lạc ngay trước buổi tập.","Tìm tờ giấy gấp","Nhờ Chị Diễm hỏi thăm","Ứng tác đoạn nhạc mới"],["🎤","Đêm diễn quyết định","Khoa sắp lên sân khấu lễ hội nhưng lại mất tự tin.","Luyện nhạc cùng anh","Chuẩn bị sân khấu nhỏ","Thử ca khúc khó nhất"]],"chiDiem":[["📋","Thiếu người giúp","Lễ hội chuẩn bị mở mà nhiều tình nguyện viên bận việc.","Sắp xếp nhiệm vụ hợp lý","Nhờ cư dân quanh quảng trường","Nhận làm hết mọi việc"],["🎊","Chuỗi sự cố","Gian hàng mất điện, nhạc công đến trễ và đồ trang trí chưa xong.","Ưu tiên sửa nguồn điện","Nhờ Anh Khoa hỗ trợ","Đổi toàn bộ chương trình"],["🏮","Đêm hội của làng","Diễm muốn đêm hội có niềm vui cho mọi người.","Tổ chức các hoạt động vừa sức","Mời các NPC thân thiết tham gia","Mở hội cực lớn đầy rủi ro"]],"coTuyet":[["🎫","Tấm vé sai ngày","Một vị khách có vé xe không khớp ngày ghi trên sổ.","Kiểm tra vé thật kỹ","Đến hỏi bác tài","Để khách lên xe ngay"],["📒","Lời kể của tài xế","Chú Năm nhớ có chuyến xe đổi lịch bất ngờ.","So giờ trên hai sổ","Hỏi Chú Năm về lộ trình","Thử đi theo chuyến xe đó"],["🚌","Chuyến xe cuối","Cô Tuyết cần giúp khách tìm được đúng chuyến cuối ngày.","Đối chiếu hành khách","Liên hệ trạm kế tiếp","Chạy đuổi theo xe sắp rời bến"]],"anhTin":[["📦","Đơn hàng đi lạc","Tín giao nhầm một hộp hàng đến cửa tiệm khác.","Kiểm tra mã vận đơn","Hỏi người bán ở chợ","Mở hộp đoán người nhận"],["🕵️","Người nhận bí ẩn","Một bưu kiện không có địa chỉ rõ ràng.","Tìm trên sổ giao hàng","Hỏi Chú Năm quen đường","Cứ đi thử từng nhà"],["🔐","Giao hàng hay giữ bí mật","Tín phát hiện gói hàng chứa bí mật người gửi muốn giữ kín.","Giữ kín thông tin người nhận","Xác minh với người gửi","Tiết lộ để lấy tiền thưởng"]],"bacSiAn":[["🏥","Một ngày bận rộn","Trạm xá thiếu người hỗ trợ những việc hành chính đơn giản.","Phân loại hồ sơ và vật tư","Nhờ Y tá Linh hướng dẫn","Xử lý tất cả một mình"],["📦","Vật tư thất lạc","Một kiện vật tư không đến đúng giờ, trạm cần tìm lộ trình.","Đối chiếu biên nhận","Liên lạc Anh Tín giao hàng","Đặt mua gấp với giá cao"],["⚖️","Quyết định khó khăn","Người chơi được đề nghị giúp giải quyết thiếu hụt thiết bị.","Ưu tiên công bằng minh bạch","Kêu gọi cộng đồng góp sức","Nhận ưu đãi riêng để đổi hỗ trợ"],["🌷","Lời hứa với thị trấn","Bác sĩ chuẩn bị hoạt động thiện nguyện lâu dài.","Chuẩn bị lịch hỗ trợ","Kết nối các cư dân khác","Tổ chức ngay dù thiếu nguồn lực"]],"yTaLinh":[["📨","Hộp thư cũ","Linh tìm thấy những lá thư cảm ơn chưa gửi trong kho giấy.","Sắp thư theo người nhận","Hỏi Bác sĩ An về hồ sơ","Mở tất cả để đoán địa chỉ"],["🔎","Tìm lại người quen","Có một lá thư dành cho cư dân đã lâu chưa đến trạm.","Tìm người theo tên","Nhờ người làng hỏi thăm","Đưa thư cho người trùng tên"],["🌸","Lời cảm ơn muộn","Người nhận thư xúc động và muốn gửi lời cảm ơn trở lại.","Giúp viết thư đáp","Tổ chức buổi gặp nhỏ","Tạo bất ngờ thật lớn"]],"ongKhang":[["🍃","Chiếc lá kỳ lạ","Ông Khang đưa một chiếc lá và muốn người chơi tìm hiểu.","Quan sát gân lá","Nhờ Cô Lúa hỏi kinh nghiệm","Đoán đại tên cây"],["🔬","Thử thách nhận biết cây","Một loạt mẫu thực vật cần được phân biệt cẩn thận.","So đặc điểm hình thái","Hỏi người có kinh nghiệm","Nhận biết chỉ qua mùi"],["🌱","Khu vườn bí mật","Ông chỉ đường tới khu vườn sưu tập cây quý và thử lòng người chơi.","Hứa bảo vệ khu vườn","Ghi sổ chăm cây lâu dài","Bán thông tin vị trí để kiếm lời"]]};
const V874_SPECIAL_VISITS = {chiNhai:["market"],coSau:["lane"],anhKhai:["district"],chuLoc:["temple"],bacPhuc:["lane"],chiHa:["market"],anhKhoa:["nightmarket"],chiDiem:["nightmarket"],coTuyet:["district"],anhTin:["market","district"],bacSiAn:["school"],yTaLinh:["lane"],ongKhang:["ricefield"]};
const V874_QUEST_LINKS = {"chiNhai":{"chapter":1,"person":"baTu"},"coSau":{"chapter":1,"person":"anhKhai"},"anhKhai":{"chapter":1,"person":"anhPho"},"chuLoc":{"chapter":1,"person":"baTu"},"bacPhuc":{"chapter":1,"person":"coLua"},"chiHa":{"chapter":2,"person":"mika"},"anhKhoa":{"chapter":1,"person":"chiDiem"},"chiDiem":{"chapter":2,"person":"anhKhoa"},"coTuyet":{"chapter":1,"person":"chuNam"},"anhTin":{"chapter":1,"person":"chuNam"},"bacSiAn":{"chapter":1,"person":"anhTin"},"yTaLinh":{"chapter":1,"person":"baTu"},"ongKhang":{"chapter":1,"person":"coLua"}};
/* V87.5 — Thị Trấn Muôn Chuyện: extend the established 28-NPC systems. */
Object.assign(V874_NPC_PROFILES,{"baMan":{"name":"Bà Mẫn","home":"temple","job":"Người giữ sử làng","accent":"📜","bubble":"Chuyện cũ không bao giờ cũ đâu con.","chibi":"female","chance":0.79,"rarity":"uncommon","rewardId":"v874_v875_baMan","rewardName":"Sổ Ký Ức Làng Xưa","rewardIcon":"📖","tastes":["nostalgia","study"]},"anhVinh":{"name":"Anh Vinh","home":"temple","job":"Nghệ nhân trống hội","accent":"🥁","bubble":"Nghe tiếng trống hội là thấy Tết về!","chibi":"male","chance":0.73,"rarity":"common","rewardId":"v874_v875_anhVinh","rewardName":"Dùi Trống Hội May Mắn","rewardIcon":"🥁","tastes":["handmade","fun"]},"coGiang":{"name":"Cô Giang","home":"temple","job":"Cán bộ văn hóa","accent":"📋","bubble":"Lễ hội phải có kế hoạch chứ!","chibi":"female","chance":0.81,"rarity":"common","rewardId":"v874_v875_coGiang","rewardName":"Thẻ Tình Nguyện Viên","rewardIcon":"🎟️","tastes":["study","heart"]},"chiNhien":{"name":"Chị Nhiên","home":"hill","job":"Chủ vườn sim","accent":"🫐","bubble":"Sim chín rồi, thử làm mứt nhé!","chibi":"female","chance":0.79,"rarity":"common","rewardId":"v874_v875_chiNhien","rewardName":"Hũ Mứt Sim Đồi","rewardIcon":"🫐","tastes":["nature","food"]},"anhDuy":{"name":"Anh Duy","home":"hill","job":"Nhiếp ảnh gia","accent":"📸","bubble":"Ánh sáng đẹp quá, chụp một tấm đi!","chibi":"male","chance":0.66,"rarity":"uncommon","rewardId":"v874_v875_anhDuy","rewardName":"Album Ảnh Ngày Nắng","rewardIcon":"📷","tastes":["outdoor","handmade"]},"bacThach":{"name":"Bác Thạch","home":"hill","job":"Hướng dẫn viên đường rừng","accent":"🧭","bubble":"Đi đường núi phải chú ý dấu cây.","chibi":"male","chance":0.71,"rarity":"uncommon","rewardId":"v874_v875_bacThach","rewardName":"La Bàn Đồi Sim","rewardIcon":"🧭","tastes":["outdoor","nostalgia"]},"chiLy":{"name":"Chị Ly","home":"nightmarket","job":"Chủ quầy nướng phố đêm","accent":"🍢","bubble":"Xiên nóng đây, ăn thử nha!","chibi":"female","chance":0.82,"rarity":"common","rewardId":"v874_v875_chiLy","rewardName":"Bí Kíp Sốt Nướng Đêm","rewardIcon":"🍢","tastes":["food","handmade"]},"anhSoc":{"name":"Anh Sóc","home":"nightmarket","job":"Nghệ sĩ đường phố","accent":"🎸","bubble":"Sân khấu ở bất cứ nơi nào ta đứng!","chibi":"male","chance":0.64,"rarity":"uncommon","rewardId":"v874_v875_anhSoc","rewardName":"Huy Hiệu Nghệ Sĩ Đêm","rewardIcon":"🎵","tastes":["fun","heart"]},"coYen":{"name":"Cô Yến","home":"nightmarket","job":"Nghệ nhân đồ thủ công","accent":"🏮","bubble":"Mỗi chiếc đèn đều có một câu chuyện.","chibi":"female","chance":0.76,"rarity":"common","rewardId":"v874_v875_coYen","rewardName":"Đèn Lồng Hoa May","rewardIcon":"🏮","tastes":["handmade","nostalgia"]},"anhQuan":{"name":"Anh Quân","home":"district","job":"Kỹ thuật viên sửa máy","accent":"🛠️","bubble":"Máy hỏng cứ để anh kiểm tra.","chibi":"male","chance":0.82,"rarity":"common","rewardId":"v874_v875_anhQuan","rewardName":"Bộ Dụng Cụ Chăm Máy","rewardIcon":"🛠️","tastes":["study","handmade"]},"chiNgoc":{"name":"Chị Ngọc","home":"district","job":"Chuyên viên tài chính","accent":"📊","bubble":"Giá cả phải tính cả rủi ro nữa.","chibi":"female","chance":0.72,"rarity":"uncommon","rewardId":"v874_v875_chiNgoc","rewardName":"Sổ Cân Đối Thu Chi","rewardIcon":"📒","tastes":["study","heart"]},"thayTri":{"name":"Thầy Trí","home":"school","job":"Giáo viên mỹ thuật","accent":"🎨","bubble":"Nào, vẽ thị trấn trong trí nhớ em!","chibi":"male","chance":0.74,"rarity":"common","rewardId":"v874_v875_thayTri","rewardName":"Hộp Màu Sắc Quê","rewardIcon":"🎨","tastes":["study","cute"]}});
Object.assign(V874_STORY_DEFINITIONS,{"baMan":[["📜","Cuốn niên giám thiếu trang","Bà Mẫn phát hiện trang ghi ngày khai lập thị trấn bị thất lạc.","Kiểm tra danh mục lưu trữ","Tìm Chú Lộc để hỏi hộp đồ cũ","Đoán ngày rồi ghi luôn vào sổ"],["🔎","Dấu mực trong rương","Một trang giấy có dấu mực trùng hoa văn ở Nhà Văn Hóa.","Chụp lại dấu rồi so sánh","Nhờ Cô Giang hỏi người ghi chép","Tự cạy rương lấy bản gốc"],["🧭","Những người đi trước","Một nhân chứng kể chuyện khác hẳn ghi chép cũ.","Đối chiếu nhiều lời kể","Nhờ Bác Thạch tìm địa danh cũ","Tin lời đầu tiên được nghe"],["📖","Ngày hội ký ức","Cuộc triển lãm cần câu chuyện chính xác mà vẫn ấm áp.","Trưng bày tư liệu đã xác minh","Mời cư dân viết hồi ức riêng","Kể lại thành truyền thuyết ly kỳ"]],"anhVinh":[["🥁","Tiếng trống lạc nhịp","Đội trống hội tập thử nhưng nhịp không đồng đều.","Tập từng đoạn ngắn","Mời Anh Khoa hỗ trợ nhạc","Thi trống ngay không luyện"],["🧰","Mặt trống nứt","Trống chính có vết rách nhỏ trước buổi diễn.","Kiểm tra kỹ và vá lại","Nhờ Anh Quân xem thiết bị sân khấu","Đánh thử mạnh xem có sao không"],["🏮","Nhịp trống khai hội","Đêm diễn sắp đến và cả đội đang hồi hộp.","Giữ nhịp cho mọi người","Nhờ Cô Giang ổn định lịch tập","Tăng tốc gấp đôi để gây bất ngờ"]],"coGiang":[["🗂️","Bảng lịch bị chồng","Hai nhóm cùng đăng ký Nhà Văn Hóa một buổi tối.","Đối chiếu lịch và điều phối","Nhờ Chị Diễm thương lượng","Tự hủy một nhóm không báo trước"],["🎟️","Thiếu người hướng dẫn","Người dự hội không tìm được khu trưng bày.","Làm biển chỉ dẫn rõ ràng","Mời Thầy Trí thiết kế bản đồ","Đổi lối đi ngay giờ khai mạc"],["🏛️","Buổi tối của cả làng","Cô Giang muốn tổ chức chương trình cho nhiều thế hệ.","Xếp thời gian hợp lý","Tham khảo Bà Mẫn về truyền thống","Dồn hết tiết mục vào một giờ"]],"chiNhien":[["🫐","Mẻ sim đầu mùa","Sim chín sớm nhưng mứt có vị hơi chát.","Thử độ chín từng rổ","Hỏi Chị Hạ cách phối vị","Thêm đường gấp đôi cho nhanh"],["🧺","Giỏ sim đi lạc","Một giỏ sim gửi chợ chưa đến được đúng sạp.","Kiểm tra lại phiếu giao","Nhờ Anh Tín tìm đường chuyển","Mua đại giỏ khác thay thế"],["🍯","Mứt sim của đồi","Nhiên muốn mở gian hàng đặc sản đầu tiên.","Nấu thử mẻ nhỏ kiểm tra","Nhờ Chị Ly thử kết hợp món","Bán ngay khi chưa kiểm tra"]],"anhDuy":[["📷","Bức hình ngược sáng","Anh Duy định ghi lại ảnh Đồi Sim nhưng ánh nắng quá gắt.","Chọn khung giờ sáng dịu","Hỏi Thầy Trí cách phối cảnh","Chụp liền một trăm kiểu"],["🖼️","Khung ảnh thất lạc","Bức ảnh chân dung một cụ già biến mất trước triển lãm.","Rà soát ảnh gốc","Hỏi Bà Mẫn về nhân vật","Dùng ảnh lạ thay thế"],["🌄","Khoảnh khắc đáng nhớ","Duy chuẩn bị bộ ảnh về những người bình dị.","Xin phép từng nhân vật","Mời cư dân chọn ảnh của mình","Đăng tất cả ảnh bất chấp ý kiến"]],"bacThach":[["🧭","Đường mòn đổi hướng","Mưa làm lối quen lên đồi trở nên trơn trượt.","Đánh dấu lối an toàn","Nhờ Anh Duy chụp đoạn đường","Đi tắt qua bụi rậm"],["🍃","Dấu chân kỳ lạ","Một dấu chân gần bìa rừng làm nhiều người tò mò.","Quan sát không phá dấu","Nhờ Ông Khang nhận cây quanh đó","Lần theo dấu vào đêm"],["🏕️","Chuyến đi của người mới","Bác Thạch dẫn một nhóm trẻ lên đồi lần đầu.","Chuẩn bị nước và sơ cứu","Mời Cô Giang cùng lập danh sách","Rút ngắn đường bằng con dốc cao"]],"chiLy":[["🍢","Bếp đỏ đầu đêm","Quầy xiên đông khách nhưng sốt mới chưa cân vị.","Nướng thử từng loại xiên","Nhờ Anh Khải chọn gia vị","Đổ toàn bộ sốt cùng lúc"],["🔥","Gió làm tắt bếp","Một cơn gió khiến quầy nướng hoạt động chập chờn.","Che gió và kiểm tra an toàn","Nhờ Anh Quân xem bếp","Tăng lửa mạnh để bù"],["🎟️","Khách bí mật","Một khách sành ăn ghé quầy và thử món không báo trước.","Hỏi kỹ sở thích khách","Đề nghị Chị Nhiên góp loại mứt sim","Làm món siêu cay bất ngờ"],["🏆","Đêm thi xiên ngon","Chị Ly quyết tâm tham gia hội thi món phố đêm.","Chuẩn hóa công thức và thời gian","Mời Chị Diễm hỗ trợ gian hàng","Thử công thức chưa ai từng nếm"]],"anhSoc":[["🎸","Góc diễn im ắng","Sóc biểu diễn nhưng khách cứ đi qua.","Chọn tiết mục mở màn vừa sức","Nhờ Anh Khoa phối bản nhạc","Bật âm lượng tối đa"],["🎭","Mặt nạ thất lạc","Một đạo cụ quan trọng mất tích trước đêm diễn.","Tìm trong thùng đạo cụ","Nhờ Cô Yến làm phụ kiện mới","Mượn đồ khách mà không hỏi"],["🌙","Bài hát sau cùng","Buổi diễn đặc biệt nhằm gây quỹ cho thị trấn.","Tập với nhóm và đúng giờ","Mời Cô Giang hỗ trợ sân khấu","Thay bài hát giữa chừng"]],"coYen":[["🏮","Lồng đèn bị rách","Chiếc lồng đèn khách gửi bị rách giấy trước ngày hội.","Dán lại bằng giấy phù hợp","Nhờ Thầy Trí góp họa tiết","Sơn kín để giấu vết rách"],["🧵","Hoa văn từ ký ức","Cô Yến nhớ mẫu thêu cổ nhưng không còn bản vẽ.","Phác mẫu từ vật còn lại","Hỏi Bà Mẫn về hoa văn xưa","Vẽ đại thành mẫu mới"],["🎐","Đêm đèn lung linh","Sạp thủ công cần hoàn thiện những món đồ đặt riêng.","Kiểm kỹ từng món trước giao","Nhờ Cô Giang phân lịch giao","Đổi mẫu theo ý mình phút cuối"]],"anhQuan":[["🛠️","Máy ép hoạt động lạ","Máy quán phát ra tiếng lạ trước giờ bán.","Tắt máy và kiểm tra dây","Hỏi Chị Ly về lần máy gặp lỗi","Tiếp tục chạy cho kịp đơn"],["⚙️","Linh kiện thất lạc","Một bộ phận thay thế không thấy trong kho.","Kiểm tra phiếu và số hiệu","Nhờ Anh Tín truy đơn giao","Lắp tạm linh kiện không đúng"],["✅","Buổi bảo dưỡng cuối","Quân hướng dẫn người chơi chăm thiết bị đúng định kỳ.","Lập lịch bảo dưỡng","Hỏi Chị Ngọc về chi phí dự phòng","Chỉ sửa khi máy hỏng nặng"]],"chiNgoc":[["📊","Một ngày lỗ bất thường","Bảng thu chi cho thấy chi phí hàng nhập tăng đột ngột.","So hóa đơn với giá biến cố","Nhờ Anh Khải xác minh đơn nhập","Tăng giá bán ngay không kiểm tra"],["🧮","Kèo giảm giá hấp dẫn","Soppi có đợt sale nhưng mua nhiều chưa chắc tiết kiệm.","Tính nhu cầu dùng thực tế","Tham khảo Anh Quân về tồn kho","Mua hết vì thấy chữ giảm giá"],["💼","Quỹ dự phòng của quán","Chị Ngọc giúp lập kế hoạch trước mùa lễ hội.","Giữ một phần Xu dự phòng","Nhờ Cô Giang lên lịch sự kiện","Dồn hết tiền vào quảng cáo"]],"thayTri":[["🎨","Bức tranh dang dở","Các em học sinh không thống nhất được màu cho bức tranh chung.","Cho mỗi nhóm góp một phần","Nhờ Anh Duy góp bố cục","Quyết hết màu theo ý mình"],["🖌️","Thiếu màu trước hội","Hộp màu chuẩn bị triển lãm bị thất lạc.","Kiểm tra kho lớp học","Nhờ Cô Yến hỗ trợ vật liệu","Dùng bút mực không thử trước"],["🏫","Triển lãm tuổi thơ","Thầy Trí muốn cả trường tự hào về nét vẽ của mình.","Trưng bày đủ tranh của các em","Mời Bà Mẫn kể chuyện về tranh","Chỉ chọn tranh đẹp nhất"]]});
Object.assign(V874_QUEST_LINKS,{"baMan":{"chapter":1,"person":"chuLoc"},"anhVinh":{"chapter":1,"person":"anhKhoa"},"coGiang":{"chapter":1,"person":"chiDiem"},"chiNhien":{"chapter":1,"person":"chiHa"},"anhDuy":{"chapter":1,"person":"thayTri"},"bacThach":{"chapter":1,"person":"ongKhang"},"chiLy":{"chapter":1,"person":"anhKhai"},"anhSoc":{"chapter":1,"person":"anhKhoa"},"coYen":{"chapter":1,"person":"baMan"},"anhQuan":{"chapter":1,"person":"anhTin"},"chiNgoc":{"chapter":1,"person":"anhKhai"},"thayTri":{"chapter":1,"person":"anhDuy"}});
Object.assign(V874_SPECIAL_VISITS,{"baMan":["school"],"anhVinh":["riverside"],"coGiang":["riverside"],"chiNhien":["market"],"anhDuy":["school"],"bacThach":["ricefield"],"chiLy":["market"],"anhSoc":["riverside"],"coYen":["temple"],"anhQuan":["market"],"chiNgoc":["market"],"thayTri":["temple"]});

Object.entries(V874_NPC_PROFILES).forEach(([id,p])=>{
  VILLAGE_NPC_LIBRARY[id]={id,name:p.name,chibi:p.chibi,accent:p.accent,bubble:p.bubble,home:p.home,tags:[p.home,...(V874_SPECIAL_VISITS[id]||[])],desc:`${p.job}. Có câu chuyện riêng và những món quà yêu thích.`,actions:[
    {label:'💬 Hỏi thăm công việc',outcomes:[{w:55,good:true,text:`Bạn lắng nghe chuyện công việc của ${p.name}.`,exp:9,karma:1},{w:28,good:true,text:`Bạn giúp ${p.name} một việc nhỏ và nhận 16 Xu.`,coins:16,exp:8},{w:17,bad:true,text:`Hôm nay ${p.name} quá bận, hai người hẹn gặp lại.`,energy:-3,exp:3}]},
    {label:'🎲 Thử một chuyện hên xui',outcomes:[{w:17,good:true,rarity:'jackpot',text:`Bạn và ${p.name} gặp vận may, nhận một hộp quà bất ngờ!`,blindBag:1,exp:13},{w:51,good:true,text:`Bạn và ${p.name} có một buổi trò chuyện vui vẻ.`,exp:10,karma:2},{w:32,bad:true,text:'Một thử nghiệm không như ý, bạn mất chút sức và xu.',coins:-9,energy:-4,exp:3}]}
  ]};
  VILLAGE_NPC_META[id]={rarity:p.rarity,anchor:{[p.home]:0}};
  V872_NPC_VOICES[id]={welcome:`${p.name} vẫn nhớ lần gặp trước.`,ordinary:`${p.name}: “${p.bubble}”`,hurt:`${p.name} có vẻ còn buồn về lời hứa cũ.`,repair:`${p.name} mong cùng bạn sửa lại chuyện chưa ổn.`,cold:`${p.name} giữ khoảng cách vì chưa đủ tin tưởng.`,warm:`${p.name} vui mừng khi gặp lại bạn.`,token:`Một kỷ niệm với ${p.name}.`};
  V84_NPC_BUBBLES[id]=[p.bubble,'Có chuyện chưa kể hết!','Hôm nay mình hơi bận…','Mai ghé lại trò chuyện nhé!'];
  const chapters=V874_STORY_DEFINITIONS[id].map(([icon,title,desc,a,b,c])=>[icon,title,desc,[
    [`🟢 ${a}`,'safe',`${p.name} cảm ơn vì bạn làm mọi việc cẩn trọng trong chuyện “${title}”.`,`Cả hai đã tiến thêm một bước trong chuyện “${title}”.`,`Một chi tiết bị bỏ sót, bạn cần quay lại giúp ${p.name}.`],
    [`🟡 ${b}`,'balanced',`Bạn và ${p.name} tìm được giải pháp tốt cho chuyện “${title}”.`,`Việc giải quyết chưa trọn vẹn nhưng có tiến triển.`,`Phương án không phù hợp khiến ${p.name} phải tính lại.`],
    [`🔴 ${c}`,'wild',`May mắn bất ngờ! Câu chuyện “${title}” có bước ngoặt lớn.`,`Lựa chọn liều lĩnh giúp bạn học thêm điều mới.`,`Tính toán không ổn làm ${p.name} lo lắng, cần gặp lại để sửa sai.`]
  ]]);
  V84_NPC_CHAPTERS[id]=chapters;
  chapters.forEach(([icon,title,desc,choices],stage)=>{
    const ev={id:`v874_story_${id}_${stage}`,storyOnly:true,npcId:id,chapter:stage,icon,title:`${p.name}: ${title}`,desc,choices:v84BuildChoices(choices)};
    V84_NPC_STORY_EVENTS.push(ev);VILLAGE_ENCOUNTERS.push(ev);
  });
  SOUVENIR_CONFIG[p.rewardId]={name:p.rewardName,icon:p.rewardIcon,rarity:({lane:'purple',market:'red',ricefield:'purple',riverside:'red',busstop:'blue',clinic:'gold'}[p.home]||'purple'),desc:`Kỷ vật độc quyền của ${p.name}, chỉ được tặng một lần khi hoàn tất mọi chương truyện và xử lý lời hứa.`};
});
/* ===== V87.4.1 — Kỷ Vật Có Tác Dụng: only quest-earned + currently owned relics apply. ===== */
const V8741_REWARD_EFFECTS = {
  chiNhai:  {type:'shop',        tipPct:.04,            label:'🧋 Quán: +4% tiền boa từ khách'},
  coSau:    {type:'market',      seedDiscount:.05,      label:'🌾 Chợ: hạt giống giảm 5%'},
  anhKhai:  {type:'market',      spiceDiscount:.06,     label:'🌶️ Chợ: cốt lẩu, sốt, trà giảm 6%'},
  chuLoc:   {type:'market',      farmSellPct:.04,       label:'🧺 Chợ: bán nông sản thêm 1 Xu/món'},
  bacPhuc:  {type:'farm',        seedSavePct:.07,       label:'🌱 Vườn: thêm 7% cơ hội giữ hạt giống khi gieo'},
  chiHa:    {type:'shop',        tipPct:.03,            label:'🍹 Quán: +3% tiền boa từ khách'},
  anhKhoa:  {type:'shop',        patienceSec:4,         label:'🎸 Quán: khách chờ lâu hơn 4 giây'},
  chiDiem:  {type:'shop',        revenuePct:.02,        label:'🎉 Quán: +2% doanh thu đơn được chấp nhận'},
  coTuyet:  {type:'market',      packagingSaveXu:1,     label:'🎫 Chợ: bao bì giảm 1 Xu/món'},
  anhTin:   {type:'shop',        deliveryPct:.04,       label:'📦 Quán: +4% thu nhập đơn giao hàng'},
  bacSiAn:  {type:'village',     villageEnergyFlat:1,   label:'🏥 Làng: đi lon ton tốn ít hơn 1 năng lượng'},
  yTaLinh:  {type:'barn',        feedSavePct:.07,       label:'🐾 Chuồng: thêm 7% cơ hội tiết kiệm thức ăn'},
  ongKhang: {type:'farm',        farmGrowthPct:.06,     label:'🌿 Vườn: tốc độ cây trồng +6%'}
};
/* V87.5 relics share the existing effect caps and activation rules. */
Object.assign(V8741_REWARD_EFFECTS,{"baMan":{"type":"shop","patienceSec":1,"label":"📜 Quán: khách kiên nhẫn thêm 1 giây"},"anhVinh":{"type":"shop","tipPct":0.01,"label":"🥁 Quán: +1% tiền boa"},"coGiang":{"type":"shop","revenuePct":0.01,"label":"🏛️ Quán: +1% doanh thu đơn đạt"},"chiNhien":{"type":"farm","farmGrowthPct":0.04,"label":"🫐 Vườn: tốc độ phát triển cây +4%"},"anhDuy":{"type":"village","villageEnergyFlat":1,"label":"📸 Làng: lon ton tiết kiệm 1 năng lượng"},"bacThach":{"type":"farm","seedSavePct":0.04,"label":"🧭 Vườn: thêm 4% cơ hội giữ hạt"},"chiLy":{"type":"shop","tipPct":0.02,"label":"🍢 Quán: +2% tiền boa món đạt"},"anhSoc":{"type":"shop","patienceSec":1,"label":"🎸 Quán: khách chờ thêm 1 giây"},"coYen":{"type":"barn","feedSavePct":0.05,"label":"🏮 Chuồng: 5% cơ hội giữ thức ăn"},"anhQuan":{"type":"shop","deliveryPct":0.01,"label":"🛠️ Quán: +1% thu nhập giao hàng"},"chiNgoc":{"type":"market","seedDiscount":0.01,"label":"📊 Chợ: hạt giống giảm 1%"},"thayTri":{"type":"shop","tipPct":0.01,"label":"🎨 Quán: +1% tiền boa"}});
function v8741RewardActive(id){
  const cfg=V874_NPC_PROFILES[id];
  return !!cfg && !!gameState.v874NpcRewards?.[id] && (Number(gameState.souvenirs?.[cfg.rewardId])||0)>0;
}
function v8741Bonuses(){
  const out={tipPct:0,revenuePct:0,patienceSec:0,deliveryPct:0,
    seedDiscount:0,spiceDiscount:0,packagingSaveXu:0,farmSellPct:0,villageEnergyFlat:0};
  for(const [id,e] of Object.entries(V8741_REWARD_EFFECTS)){
    if(!v8741RewardActive(id))continue;
    for(const k of Object.keys(out))out[k]+=Number(e[k])||0;
  }
  out.tipPct=Math.min(.08,out.tipPct);
  out.revenuePct=Math.min(.04,out.revenuePct);
  out.patienceSec=Math.min(5,out.patienceSec);
  out.packagingSaveXu=Math.min(1,out.packagingSaveXu);
  out.deliveryPct=Math.min(.05,out.deliveryPct);
  out.farmSellPct=Math.min(.05,out.farmSellPct);
  out.villageEnergyFlat=Math.min(2,out.villageEnergyFlat);
  return out;
}
function v8741MarketDiscount(itemKey){
  const b=v8741Bonuses(),item=ITEM_DICTIONARY[itemKey];
  if(!item)return 0;
  let pct=0;
  if(itemKey.startsWith('seed_') || item.cat==='seed')pct+=b.seedDiscount;
  if(/^(broth_|sauce_|tea_)/.test(itemKey))pct+=b.spiceDiscount;
  return Math.min(.10,pct);
}
function v8741MarketBuyUnitPrice(itemKey){
  const base=getCurrentMarketUnitPrice(itemKey), discounted=Math.round(base*(1-v8741MarketDiscount(itemKey)));
  const packaging=['cup_','bowl_','tray_'].some(prefix=>itemKey.startsWith(prefix));
  return Math.max(1, discounted-(packaging?v8741Bonuses().packagingSaveXu:0));
}
function v8741FarmSeedPrice(cfg){
  return Math.max(1,Math.round((Number(cfg.cost)||1)*(1-v8741Bonuses().seedDiscount)));
}
// Attach real, existing mechanics to the relic itself. Each relic is counted once by the
// pre-existing capped getFarmBarnSouvenirBonuses() function, even if duplicated.
Object.entries(V8741_REWARD_EFFECTS).forEach(([id,e])=>{
  const rewardId=V874_NPC_PROFILES[id]?.rewardId;
  const item=SOUVENIR_CONFIG[rewardId];
  if(!item)return;
  item.effect=e.label;
  item.desc=`${item.desc} Hiệu ứng khi sở hữu và đã hoàn thành truyện: ${e.label}.`;
  item.questOnly=true;
  if(e.seedSavePct)item.bonus={...(item.bonus||{}),seedSavePct:e.seedSavePct};
  if(e.feedSavePct)item.bonus={...(item.bonus||{}),feedSavePct:e.feedSavePct};
  if(e.farmGrowthPct)item.bonus={...(item.bonus||{}),farmGrowthPct:e.farmGrowthPct};
});
function v8741RelicStatus(id){
  const cfg=V874_NPC_PROFILES[id],eff=V8741_REWARD_EFFECTS[id];
  if(!cfg||!eff)return '';
  return `${eff.label} • ${v8741RewardActive(id)?'ĐANG HOẠT ĐỘNG':'Chưa kích hoạt'}`;
}

function v874CheckNpcRewards(){
  if(!gameState.v874NpcRewards||typeof gameState.v874NpcRewards!=='object')gameState.v874NpcRewards={};
  for(const [id,p] of Object.entries(V874_NPC_PROFILES)){
    if(gameState.v874NpcRewards[id])continue;
    const total=V84_NPC_CHAPTERS[id]?.length||0;
    if(!total||v84StoryStage(id)<total||v872Relation(id).pending)continue;
    // Existing souvenir copies are not a grant receipt: only our per-NPC marker is authoritative.
    gameState.v874NpcRewards[id]=true;
    addSouvenir(p.rewardId,`Hoàn thành toàn bộ chuyện với ${p.name}`);
    const money=(total===4?64:42);
    gameState.coins=Math.max(0,(Number(gameState.coins)||0)+money);
    if(id==='anhTin'){gameState.inventory=gameState.inventory||{};gameState.inventory.box_pink=(Number(gameState.inventory.box_pink)||0)+1;}
    if(id==='yTaLinh'){gameState.inventory=gameState.inventory||{};gameState.inventory.gift_card=(Number(gameState.inventory.gift_card)||0)+1;}
    showToast(`🎁 ${p.name} tặng ${p.rewardName} và ${money} Xu!`,p.rewardIcon);
  }
}

function v874StoryLinkMissing(npcId){
  const link=V874_QUEST_LINKS[npcId],stage=v84StoryStage(npcId);
  if(!link||link.chapter!==stage)return null;
  if(v8732Ensure().village[link.person])return null;
  const friend=VILLAGE_NPC_LIBRARY[link.person];
  return friend?{name:friend.name,place:VILLAGE_ZONES[friend.home]?.name||'Làng'}:null;
}

/* 26 offline WebP assets. Full-body and portrait use separate, validated files. */
Object.assign(VILLAGE_NPC_ART,{chiNhai:"assets/images/135_chinhai_e0fbd995b6.webp",coSau:"assets/images/136_cosau_36d21dd658.webp",anhKhai:"assets/images/137_anhkhai_2ec95c7d20.webp",chuLoc:"assets/images/138_chuloc_0a86d4ff44.webp",bacPhuc:"assets/images/139_bacphuc_845e78bc66.webp",chiHa:"assets/images/140_chiha_fd60aea18a.webp",anhKhoa:"assets/images/141_anhkhoa_72178951f0.webp",chiDiem:"assets/images/142_chidiem_2c66befc3a.webp",coTuyet:"assets/images/143_cotuyet_b424ef5961.webp",anhTin:"assets/images/144_anhtin_a999dce407.webp",bacSiAn:"assets/images/145_bacsian_6a357b275d.webp",yTaLinh:"assets/images/146_ytalinh_799b24d787.webp",ongKhang:"assets/images/147_ongkhang_5846670f5a.webp"});

/* V87.3: mỗi nơi có thể tìm món quà riêng; hai map đầu có phần thưởng hoàn tất cốt truyện. */
const V873_ZONE_LOOT = {
 lane:['v873_lane_postcard','📮','Bưu Thiếp Phố Mái Ngói','green'],
 market:['v873_market_scale','⚖️','Cân Đồng Của Thương Lái','blue'],
 school:['v873_school_badge','📛','Huy Hiệu Hội Sách','blue'],
 ricefield:['v873_park_seed','🌳','Hạt Cây Cổ Thụ','blue'],
 riverside:['v873_square_note','🎼','Bản Nhạc Quảng Trường','blue'],
 busstop:['v873_bus_ticket','🎫','Vé Xe Dấu Đỏ','blue'],
 clinic:['v873_herbal_note','🌿','Sổ Tay Thảo Dược','purple'],
 temple:['v873_old_scroll','📜','Cuộn Tranh Nhà Văn Hóa','purple'],
 hill:['v873_amethyst','💎','Tinh Thể Sim Tím','purple'],
 nightmarket:['v873_lantern','🏮','Lồng Đèn Khắc Tay','red'],
 district:['v873_trade_seal','🏆','Ấn Thương Hội','red']
};
Object.entries(V873_ZONE_LOOT).forEach(([zone,[id,icon,name,rarity]])=>{
 SOUVENIR_CONFIG[id]={name,icon,rarity,desc:`Kỷ vật riêng của ${VILLAGE_ZONES[zone].name}, chỉ có thể phát hiện khi khám phá đúng khu.`};
});
Object.assign(SOUVENIR_CONFIG,{
 v873_lane_heirloom:{name:'🌟 Hòm Kỷ Vật Phố Nhỏ',icon:'🏡',rarity:'gold',desc:'Hoàn tất chuyện của cư dân Phố Nhỏ, quà duy nhất mỗi tài khoản.'},
 v873_school_medal:{name:'Huy Chương Danh Dự Trường Thị Trấn',icon:'🏅',rarity:'gold',desc:'Hoàn tất 6 cốt truyện học đường, quà duy nhất mỗi tài khoản.'}
});
const V873_ZONE_EVENT_THEMES={
 lane:['🌿','Góc phố đầy kỷ niệm','Bạn thấy chiếc hộp nhỏ dưới giàn hoa ở phố cũ.'],
 market:['🧺','Thùng hàng cuối phiên','Một kiện hàng niêm phong bị bỏ quên sau giờ họp chợ.'],
 school:['📚','Bảng tin học đường bí ẩn','Có một lá thư dán sau bảng tin trường thị trấn.'],
 ricefield:['🌱','Hạt giống lạc giữa công viên','Một chiếc túi hạt kỳ lạ nằm bên ghế đá.'],
 riverside:['🎶','Giai điệu ở quảng trường','Người nhạc công bỏ quên một trang bản nhạc.'],
 busstop:['🚌','Chuyến xe không ghi số','Một chiếc vé lạ rơi gần bảng giờ xe.'],
 clinic:['🌿','Lá thuốc của người lạ','Ai đó để quên sổ ghi chép thảo dược.'],
 temple:['📜','Hòm thư nhà văn hóa','Một cuộn giấy cũ bị bỏ quên trên kệ.'],
 hill:['🦋','Ánh tím cuối đồi','Một ánh sáng le lói cạnh bụi sim.'],
 nightmarket:['🏮','Lồng đèn lúc nửa đêm','Một ông chủ quầy đưa ra câu đố bí mật.'],
 district:['🏙️','Ấn tín của thương hội','Một phong thư có dấu niêm phong lạ xuất hiện.']
};
const V873_ZONE_EVENTS = Object.entries(V873_ZONE_EVENT_THEMES).map(([zone,[icon,title,desc]])=>{
 const loot=V873_ZONE_LOOT[zone];
 return {id:`v873_zone_${zone}`,icon,title,zones:[zone],weight:4.2,desc,choices:[
  {label:'🔎 Kiểm tra cẩn thận',risk:'safe',outcomes:[{w:3,rarity:'jackpot',good:true,text:`Bạn tìm được ${loot[2]}!`,souvenir:loot[0],exp:25},{w:59,good:true,text:'Tìm được manh mối và ít tiền cảm ơn.',coins:24,exp:13},{w:30,text:'Bạn ghi lại một chi tiết đáng chú ý.',exp:6},{w:8,bad:true,text:'Bạn tìm nhầm hướng, mệt một chút.',energy:-5}]},
  {label:'🎲 Nhờ người qua đường đoán thử',risk:'balanced',outcomes:[{w:8,rarity:'jackpot',good:true,text:`May mắn hiếm có! Bạn nhận ${loot[2]}.`,souvenir:loot[0],exp:30},{w:41,good:true,text:'Có người chỉ đúng chỗ, bạn nhận chút quà.',coins:40,exp:12},{w:27,text:'Một cuộc trò chuyện không có gì đặc biệt.',exp:4},{w:24,bad:true,text:'Thông tin sai khiến bạn tốn công và tiền.',coins:-24,energy:-5}]},
  {label:'🔥 Đánh cược với manh mối',risk:'wild',outcomes:[{w:13,rarity:'jackpot',good:true,text:`ĐẠI CÁT! Nhận được kỷ vật độc quyền ${loot[2]}.`,souvenir:loot[0],coins:65,exp:35},{w:22,good:true,text:'Bạn được thưởng vì lòng can đảm.',coins:66,exp:20},{w:17,text:'Bạn đi vòng vèo nhưng học được chút kinh nghiệm.',exp:7},{w:48,bad:true,text:'Một cú đánh liều thất bại, bạn phải trả giá.',coins:-65,energy:-12}]}
 ]};
});
VILLAGE_ENCOUNTERS.push(...V873_ZONE_EVENTS);
const V873_HOME_ROSTER={lane:['bebo','baTu','bacTam','coUt','chiNhai'],market:['mika','coSau','anhKhai','chuLoc'],school:['bacBinh','coHanh','thayDung','thayMinh','banLan','banMai'],ricefield:['coLua','bacPhuc','chiHa'],riverside:['bacCau','anhKhoa','chiDiem'],busstop:['chuNam','coTuyet','anhTin'],clinic:['bacSiAn','yTaLinh','ongKhang'],temple:[],hill:[],nightmarket:[],district:['anhPho']};
const V875_RESIDENTS=new Set(["baMan", "anhVinh", "coGiang", "chiNhien", "anhDuy", "bacThach", "chiLy", "anhSoc", "coYen", "anhQuan", "chiNgoc", "thayTri"]);
/* Place v87.5 residents in EXISTING zones. The twelve introductions do not add maps. */
V873_HOME_ROSTER.temple.push('baMan','anhVinh','coGiang');
V873_HOME_ROSTER.hill.push('chiNhien','anhDuy','bacThach');
V873_HOME_ROSTER.nightmarket.push('chiLy','anhSoc','coYen');
V873_HOME_ROSTER.district.push('anhQuan','chiNgoc');
V873_HOME_ROSTER.school.push('thayTri');
Object.assign(VILLAGE_NPC_ART,{"baMan":"assets/images/148_baman_7d695ca63f.webp","anhVinh":"assets/images/149_anhvinh_59001679ce.webp","coGiang":"assets/images/150_cogiang_5a0d2b0f2b.webp","chiNhien":"assets/images/151_chinhien_cb923e6cd3.webp","anhDuy":"assets/images/152_anhduy_04554cf498.webp","bacThach":"assets/images/153_bacthach_68851c0364.webp","chiLy":"assets/images/154_chily_0dbcc85156.webp","anhSoc":"assets/images/155_anhsoc_e5c2a282d8.webp","coYen":"assets/images/156_coyen_d7dab0b0ab.webp","anhQuan":"assets/images/157_anhquan_e12632944f.webp","chiNgoc":"assets/images/158_chingoc_ba8de6ec17.webp","thayTri":"assets/images/159_thaytri_58b7b9fed3.webp"});

const V873_ZONE_HOLIDAYS={
 lane:{cycle:8,offset:0,title:'🎊 Hội nhà mái ngói',reason:'đi dự hội làng'},
 market:{cycle:9,offset:0,title:'🎉 Hội chợ lưu động',reason:'đi phụ hội chợ'},
 school:{cycle:6,offset:0,title:'🚌 Chuyến dã ngoại toàn trường',reason:'đi dã ngoại cùng trường'},
 ricefield:{cycle:10,offset:0,title:'🌼 Ngày hội cây xanh',reason:'đi chăm vườn cộng đồng'},
 riverside:{cycle:9,offset:3,title:'🎶 Hội diễn quảng trường',reason:'tham gia hội diễn'},
 busstop:{cycle:8,offset:2,title:'🚍 Ngày hội xe quê',reason:'đi hỗ trợ đoàn xe'},
 clinic:{cycle:10,offset:4,title:'💊 Ngày khám lưu động',reason:'đi khám bệnh từ thiện'},
 temple:{cycle:11,offset:3,title:'🎭 Ngày hội văn hóa',reason:'đi chuẩn bị hội diễn'},
 hill:{cycle:9,offset:4,title:'🦋 Hội hái sim',reason:'đi dự hội sim'},
 nightmarket:{cycle:8,offset:4,title:'🏮 Lễ hội đèn',reason:'đi xem phố đèn'},
 district:{cycle:10,offset:1,title:'🏙️ Hội kết nối thương nhân',reason:'đi dự cuộc họp hội'}
};
function v873Holiday(zone,day=Number(gameState.day)||1){const cfg=V873_ZONE_HOLIDAYS[zone];return cfg&&day>1&&(day+cfg.offset)%cfg.cycle===0?cfg:null;}
function v873EnsureSchedule(){
 const d=Number(gameState.day)||1;
 if(!gameState.v873Schedules||Number(gameState.v873Schedules.day)!==d||typeof gameState.v873Schedules.zones!=='object') gameState.v873Schedules={day:d,zones:{}};
 if(!gameState.v873Rewards||typeof gameState.v873Rewards!=='object')gameState.v873Rewards={};
 return gameState.v873Schedules;
}
function v873ZoneSchedule(zone){
 const all=v873EnsureSchedule(),saved=all.zones[zone];if(saved&&Array.isArray(saved.ids)){
    if(!saved.v874Migrated){
      // Preserve previous visits and decisions when upgrading an existing day's save.
      const extras=(V873_HOME_ROSTER[zone]||[]).filter(id=>V874_NPC_PROFILES[id]&&!saved.ids.includes(id));
      extras.forEach(id=>{if(saved.ids.length<3&&Math.random()<V874_NPC_PROFILES[id].chance*(v873Holiday(zone)?0.28:1)) saved.ids.push(id);});
      saved.v874Migrated=true;
    }
    if(!saved.v875Migrated){
      const residents=(V873_HOME_ROSTER[zone]||[]).filter(id=>V875_RESIDENTS.has(id));
      for(const id of residents){
        if(saved.ids.length>=3)break;
        if(!saved.ids.includes(id)&&Math.random()<V874_NPC_PROFILES[id].chance*(v873Holiday(zone)?.28:1))saved.ids.push(id);
      }
      saved.v875Migrated=true;
    }
    return saved;
  }
 const holiday=v873Holiday(zone), residents=V873_HOME_ROSTER[zone]||[];
 const available=[],absent=[];
 // A real daily attendance roll: residents show up individually; visitors appear less frequently.
 const visitors=Object.values(VILLAGE_NPC_LIBRARY).filter(n=>n.home!==zone&&Array.isArray(n.tags)&&n.tags.includes(zone));
 const pool=[...new Set([...residents,...visitors.map(n=>n.id)])];
 pool.forEach(id=>{
   const npc=VILLAGE_NPC_LIBRARY[id];if(!npc)return;
   const local=residents.includes(id),rarity=VILLAGE_NPC_META[id]?.rarity||'common';
   let chance=local?(V874_NPC_PROFILES[id]?.chance ?? (rarity==='uncommon'?.60:.76)):.26;
   if(holiday)chance*=id==='bacBinh'&&zone==='school'?.55:.28;
   const pending=gameState.v872Npcs?.[id]?.pending;
   if(local&&pending&&Number(pending.dayAvailable)<=Number(gameState.day)&&!holiday)chance=Math.max(chance,.90);
    if(local&&V874_NPC_PROFILES[id]&&!holiday&&v84StoryStage(id)>0&&v84StoryStage(id)<(V84_NPC_CHAPTERS[id]?.length||0))chance=Math.max(chance,.77);
   if(Math.random()<chance)available.push(id);
   else absent.push({id,reason:holiday?holiday.reason:(V874_NPC_PROFILES[id]?({lane:'đi giao hàng hoặc nhập nguyên liệu',market:'đi lấy hàng ngoài chợ',ricefield:'đi chăm cây hoặc chuẩn bị xe nước',riverside:'đang chuẩn bị buổi diễn/lễ hội',busstop:'đổi ca hoặc giao hàng xa',clinic:'đổi ca hoặc hỗ trợ khám lưu động'}[zone]||'bận công việc hôm nay'):(Math.random()<.35?'đi thăm người thân':'có việc riêng hôm nay'))});
 });
 // At most three on-map visitors at a time. The full attendance roll is persisted.
 const shuffle=items=>{const a=items.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
 const due=id=>{const pending=gameState.v872Npcs?.[id]?.pending;return !!pending&&Number(pending.dayAvailable)<=Number(gameState.day);};
 const ordered=[...shuffle(available.filter(id=>residents.includes(id))),...shuffle(available.filter(id=>!residents.includes(id)))];
 // A due story takes priority but every other resident gets a fair daily draw.
 ordered.sort((a,b)=>Number(due(b))-Number(due(a)));
 const ids=ordered.slice(0,3);
 const overflow=ordered.slice(3).map(id=>({id,reason:'đang bận ở khu khác trong ngày'}));
 const schedule={ids,completedIds:[],absent:[...absent,...overflow],holiday:holiday?.title||'',day:Number(gameState.day)};
 all.zones[zone]=schedule;
 return schedule;
}
function v873CurrentSchedule(zone=gameState.villageZone||'lane'){
 const schedule=v873ZoneSchedule(zone);
 // Keep the legacy APIs writing to per-zone completedIds, without global cross-zone leakage.
 gameState.dailyVillageVisitors={day:Number(gameState.day),zone,ids:schedule.ids,completedIds:schedule.completedIds,rolled:true};
 return schedule;
}
function v873CheckAwards(){
 v873EnsureSchedule();
 const map={lane:['bebo','baTu','bacTam','coUt'],school:['bacBinh','coHanh','thayDung','thayMinh','banLan','banMai']};
 for(const [zone,ids] of Object.entries(map)){
  if(gameState.v873Rewards[zone])continue;
  if(!ids.every(id=>v84StoryStage(id)>=(V84_NPC_CHAPTERS[id]?.length||999)&&!v872Relation(id).pending))continue;
  const souvenir=zone==='lane'?'v873_lane_heirloom':'v873_school_medal';
  gameState.v873Rewards[zone]=true;
  addSouvenir(souvenir,`Hoàn thành toàn bộ truyện ở ${VILLAGE_ZONES[zone].name}`);
  gameState.coins+=zone==='school'?250:120;
  showToast(`🏆 Hoàn tất toàn bộ cốt truyện ${VILLAGE_ZONES[zone].name}!`,'🏅');
 }
}
function v873AttendanceSummary(){
 const zone=gameState.villageZone||'lane',sch=v873CurrentSchedule(zone);
 const here=sch.ids.filter(id=>!sch.completedIds.includes(id)).length;
 const residents=(V873_HOME_ROSTER[zone]||[]).length;
 return `${sch.holiday?sch.holiday+' • ':''}👥 ${here} NPC trên bản đồ${residents?` • ${residents} cư dân chính`:''}${sch.absent.length?' • Có người vắng mặt':''}`;
}

function v872Clamp(n,min,max){return Math.max(min,Math.min(max,Number(n)||0));}
function v872EnsureState(){
  if(!gameState.v872Npcs || typeof gameState.v872Npcs!=='object' || Array.isArray(gameState.v872Npcs)) gameState.v872Npcs={};
  if(!Array.isArray(gameState.v872Journal))gameState.v872Journal=[];
  Object.keys(V872_NPC_VOICES).forEach(id=>{
    const old=gameState.v872Npcs[id];
    const legacyBond=Number(gameState.villageNpcBonds?.[id])||0;
    const m=old&&typeof old==='object'&&!Array.isArray(old)?old:{};
    // Mutate in place: pending and relationship references must stay stable while resolving a choice.
    m.trust=v872Clamp(Number.isFinite(Number(m.trust))?m.trust:Math.min(75,45+Math.floor(legacyBond*.3)),0,100);
    m.anger=v872Clamp(m.anger||0,0,100);
    m.pending=(m.pending&&typeof m.pending==='object'&&['repair','thanks','reflect'].includes(m.pending.kind))?m.pending:null;
    if(!Array.isArray(m.memories))m.memories=[];
    if(m.memories.length>8)m.memories=m.memories.slice(0,8);
    m.lastTalkDay=Number(m.lastTalkDay)||0;
    gameState.v872Npcs[id]=m;
  });
  gameState.v872Journal=gameState.v872Journal.slice(0,70);
}
function v872Relation(id){v872EnsureState();return gameState.v872Npcs[id];}
function v872Mood(id){
  const m=v872Relation(id);
  if(m.anger>=65 || m.trust<=22) return {id:'cold',label:'😠 Bất hòa',color:'rose'};
  if(m.anger>=32 || m.trust<40) return {id:'uneasy',label:'😕 Dè chừng',color:'amber'};
  if(m.trust>=76 && m.anger<=12) return {id:'friend',label:'💚 Tin cậy',color:'emerald'};
  if(m.trust>=57 && m.anger<27) return {id:'warm',label:'😊 Thân thiện',color:'emerald'};
  return {id:'neutral',label:'🙂 Bình thường',color:'amber'};
}
function v872Remember(id,text,trustDelta=0,angerDelta=0,kind='story'){
  if(!V872_NPC_VOICES[id])return;
  const m=v872Relation(id),day=Number(gameState.day)||1;
  m.trust=v872Clamp(m.trust+trustDelta,0,100);
  m.anger=v872Clamp(m.anger+angerDelta,0,100);
  m.lastTalkDay=day;
  const npc=VILLAGE_NPC_LIBRARY[id];
  const memory={day,text:String(text||'Một cuộc gặp đã diễn ra.').slice(0,240),kind};
  m.memories.unshift(memory);m.memories=m.memories.slice(0,8);
  gameState.v872Journal.unshift({id,day,name:npc?.name||id,...memory});
  gameState.v872Journal=gameState.v872Journal.slice(0,70);
  v8732MarkMet(id,gameState.villageZone||npc?.home||'lane');
}
function v872DayChanged(){
  v872EnsureState();
  Object.values(gameState.v872Npcs).forEach(m=>{
    m.anger=v872Clamp(m.anger-3,0,100);
    // Old disagreements fade slowly, but do not clear a pending apology.
  });
}
function v872MeetLine(id){
  if(!V872_NPC_VOICES[id])return '';
  const m=v872Relation(id),v=V872_NPC_VOICES[id];
  if(m.pending && Number(gameState.day)>=Number(m.pending.dayAvailable))
    return m.pending.kind==='repair'?v.hurt:(m.pending.kind==='thanks'?v.welcome:v.ordinary);
  const mood=v872Mood(id).id;
  const line=mood==='cold'||mood==='uneasy'?v.cold:(mood==='friend'||mood==='warm'?v.warm:v.ordinary);
  const home=VILLAGE_NPC_LIBRARY[id]?.home;
  return home&&v8753Rank(home)>=2&&mood!=='cold'&&mood!=='uneasy' ? line+' “Dân khu mình biết ơn bạn lắm!”' : line;
}
function v872StoryFinished(encounter,outcome,choiceIndex){
  if(!encounter?.npcId || !encounter.storyOnly || encounter.v872FollowKind)return;
  const id=encounter.npcId, stage=v84StoryStage(id),flags=gameState.villageStoryFlags;
  if(stage!==encounter.chapter)return;
  const bad=!!outcome.bad, jackpot=outcome.rarity==='jackpot';
  const type=bad?'repair':jackpot||outcome.good?'thanks':'reflect';
  const branch=(['an_toan','can_nhac','mao_hiem'][Math.max(0,Math.min(2,Number(choiceIndex)||0))]);
  if(!bad){
    v8753Ensure(); // Seed legacy history before increasing this chapter; do not count it twice.
    flags[`v84_${id}_stage`]=stage+1;
    v8753AddRep(VILLAGE_NPC_LIBRARY[id]?.home || gameState.villageZone,5,'Hoàn thành chương truyện NPC');
  }
  flags[`v84_${id}_day`]=Number(gameState.day||1)+1;
  flags[`v84_${id}_last`]=outcome.rarity || (bad?'bad':'neutral');
  const m=v872Relation(id);
  m.pending={kind:type,chapter:stage,dayAvailable:Number(gameState.day||1)+1,attempts:0,branch};
  const chapterName=(V84_NPC_CHAPTERS[id]?.[stage]||[])[1]||'câu chuyện cũ';
  const change=bad?[-11,29]:type==='thanks'?[12,-13]:[3,-2];
  v872Remember(id,`${chapterName}: ${bad?'mọi việc trục trặc; cần gặp lại để hóa giải':type==='thanks'?'NPC ghi nhớ sự giúp đỡ và muốn cảm ơn':'hai người còn một chuyện chưa nói hết'} (${branch}).`,change[0],change[1],'chapter');
  if(!gameState.villageNpcBonds || typeof gameState.villageNpcBonds!=='object')gameState.villageNpcBonds={};
  if(!bad)gameState.villageNpcBonds[id]=v872Clamp((Number(gameState.villageNpcBonds[id])||0)+(type==='thanks'?9:3),0,100);
}
const V872_FOLLOW_KINDS=['repair','thanks','reflect'];
const V872_FOLLOW_EVENTS=[];
Object.entries(V872_NPC_VOICES).forEach(([id,voice])=>{
  const npc=VILLAGE_NPC_LIBRARY[id];
  V872_FOLLOW_KINDS.forEach(kind=>{
    const repair=kind==='repair',thanks=kind==='thanks';
    const title=repair?`${npc.name}: Chuyện chưa thể bỏ qua`:thanks?`${npc.name}: Người có lòng sẽ được nhớ`: `${npc.name}: Một lời chưa kể`;
    const desc=repair?`${voice.hurt} ${voice.repair}`:thanks?`${voice.welcome} ${voice.warm}`:`${voice.ordinary} Hôm nay ${npc.name} muốn nghe ý kiến của bạn.`;
    const yes=repair?'💬 Nhận lỗi và sửa sai':thanks?'🤝 Cảm ơn và lắng nghe':'💬 Hỏi thêm chuyện hôm trước';
    const cautious=repair?'🧹 Chủ động làm bù':thanks?'🎁 Đáp lại bằng món quà nhỏ':'📝 Giúp ghi lại manh mối';
    const risky=repair?'🎲 Đổ lỗi cho vận xui':thanks?'🎲 Xin một phần thưởng lớn':'🎲 Đoán tiếp câu chuyện';
    const choices=[
      {label:yes,risk:'safe',outcomes:[{w:67,good:true,rarity:'good',exp:14,karma:2,text:repair?`${npc.name} nhận ra bạn thật lòng. “Chuyện cũ để qua, mình làm lại nhé.”`:`${npc.name} mỉm cười, kể thêm một điều đã giữ trong lòng.`},{w:24,text:`${npc.name} im lặng suy nghĩ rồi gật đầu. Chuyện giữa hai người dịu lại.`},{w:9,bad:true,energy:-2,text:`${npc.name} vẫn còn ngập ngừng. Có lẽ cần thêm một ngày để hiểu nhau.`}]},
      {label:cautious,risk:'balanced',outcomes:[{w:50,good:true,rarity:'good',coins:repair?0:28,exp:20,text:repair?`${voice.repair} Bạn kiên nhẫn giúp đến cuối, ${npc.name} thật sự cảm động.`:`${voice.token} trở thành kỷ niệm mới giữa hai người.`},{w:28,text:`Hai người cùng làm một việc nhỏ, câu chuyện tiến lên chậm mà chắc.`},{w:22,bad:true,energy:-4,coins:-8,text:`Bạn hấp tấp làm hỏng một bước. ${npc.name} chưa thật sự yên lòng.`}]},
      {label:risky,risk:'wild',outcomes:[{w:24,good:true,rarity:'jackpot',coins:repair?15:65,exp:30,text:repair?`May mắn thay, một người chứng kiến lên tiếng minh oan. ${npc.name} vui vẻ bắt tay bạn.`:`${npc.name} trúng vận lớn và hào phóng chia cho bạn một phần quà!`},{w:19,text:`Lời nói bất ngờ khiến ${npc.name} bật cười. Không khí bớt căng thẳng.`},{w:57,bad:true,coins:-18,karma:-3,text:repair?`${npc.name} thất vọng vì bạn chưa nhận trách nhiệm. Vết rạn vẫn còn.`:`Lời đề nghị quá đà khiến ${npc.name} phật lòng. Bạn phải xin lỗi.`}]}
    ];
    V872_FOLLOW_EVENTS.push({id:`v872_follow_${id}_${kind}`,storyOnly:true,npcId:id,v872FollowKind:kind,icon:npc.accent||'💌',title,desc,choices});
  });
});
VILLAGE_ENCOUNTERS.push(...V872_FOLLOW_EVENTS);
function v872Followup(id){
  const m=v872Relation(id),p=m.pending;
  if(!p)return null;
  return {pending:p,ready:Number(gameState.day)>=Number(p.dayAvailable),ev:V872_FOLLOW_EVENTS.find(e=>e.npcId===id&&e.v872FollowKind===p.kind)};
}
function v872StartFollowup(id){
  const follow=v872Followup(id);
  if(!follow)return showToast('Không còn chuyện dang dở.','🧠');
  if(!follow.ready)return showToast(`Hãy quay lại ngày ${follow.pending.dayAvailable}.`,'📅');
  if(gameState.villageEncounterId||villageWalking)return;
  if(!(villageNpcState||[]).some(n=>n.id===id))return showToast('Người này đã rời khu vực.','🚶');
  const npc=VILLAGE_NPC_LIBRARY[id];
  const daily=gameState.dailyVillageVisitors;
  if(daily&&!daily.completedIds.includes(id))daily.completedIds.push(id);
  villageNpcState=villageNpcState.filter(n=>n.id!==id);
  villageNpcZoneKey='';
  closeVillagePointModal();
  gameState.villageEncounterId=follow.ev.id;
  renderVillageUI();saveGameToStorage(false);
}
function v872ResolveFollowup(encounter,outcome,choiceIndex){
  const id=encounter.npcId,m=v872Relation(id),p=m.pending;
  if(!p || p.kind!==encounter.v872FollowKind)return;
  const fail=!!outcome.bad;
  const mode=p.kind, voice=V872_NPC_VOICES[id];
  const chapterTitle=V84_NPC_CHAPTERS[id]?.[p.chapter]?.[1]||'câu chuyện';
  const deltas=fail?[-6,16]:outcome.good?[12,-14]:[4,-7];
  if(mode==='repair'&&!fail) {
    gameState.villageStoryFlags[`v84_${id}_stage`]=Math.max(v84StoryStage(id),p.chapter+1);
    gameState.villageStoryFlags[`v84_${id}_day`]=Number(gameState.day||1)+1;
  }
  v872Remember(id,`${chapterTitle}: ${fail?'lời nói chưa được tha thứ':mode==='repair'?'đã hóa giải hiểu lầm':mode==='thanks'?'đã nhận lời cảm ơn':'đã khám phá thêm một chi tiết'} — ${outcome.text}`,deltas[0],deltas[1],'followup');
  if(fail&&mode==='repair'){
    p.dayAvailable=Number(gameState.day||1)+1;
    p.attempts=Math.min(30,(Number(p.attempts)||0)+1);
  } else {
    m.pending=null;
  }
  if(!gameState.villageNpcBonds || typeof gameState.villageNpcBonds!=='object')gameState.villageNpcBonds={};
  gameState.villageNpcBonds[id]=v872Clamp((Number(gameState.villageNpcBonds[id])||0)+(fail?-4:outcome.good?7:2),0,100);
}
function v872SideAction(encounter,outcome){
  const id=encounter?.npcId;
  if(!id || !V872_NPC_VOICES[id])return;
  const bad=!!outcome.bad,good=!!outcome.good;
  const m=v872Relation(id);
  const change=bad?[-6,10]:good?[5,-4]:[1,0];
  v872Remember(id,`Tương tác ở Làng: ${outcome.text||'Hai người gặp mặt.'}`,change[0],change[1],'meeting');
  if(good && m.trust>=78 && m.anger<15) {
    // A small one-time thank-you per three game days; never a farming exploit.
    const lastGiftDay=Number(gameState.v872GiftDays?.[id])||-999;
    if(gameState.day-lastGiftDay>=3){
      if(!gameState.v872GiftDays) gameState.v872GiftDays={};
      gameState.v872GiftDays[id]=Number(gameState.day);
      gameState.coins+=12;
      v872Remember(id,`${V872_NPC_VOICES[id].warm} (+12 Xu)`,1,-1,'gift');
    }
  }
}
let v872JournalOpen=false;
function v872ToggleJournal(){v872JournalOpen=!v872JournalOpen;v84StoryProgressPanel();}
function v872JournalMarkup(){
  v872EnsureState();
  const esc=s=>escapeHtmlText(String(s??''));
  const cards=Object.entries(V872_NPC_VOICES).map(([id,v])=>{
    const m=v872Relation(id),npc=VILLAGE_NPC_LIBRARY[id],mood=v872Mood(id),last=m.memories[0];
    const p=m.pending,follow=p?` • 📬 ${p.kind==='repair'?'Chờ làm hòa':p.kind==='thanks'?'Chờ nhận lời cảm ơn':'Chờ kể tiếp'} (ngày ${p.dayAvailable})`:'';
    return `<div class="v872-npc-row"><b>${npc.accent} ${esc(npc.name)}</b><span>${mood.label} • 🤝 ${m.trust}/100 • 😠 ${m.anger}/100</span><small>${last?`🧠 Ngày ${last.day}: ${esc(last.text)}`:'Chưa có kỷ niệm mới.'}${follow}</small></div>`;
  }).join('');
  const recent=gameState.v872Journal.slice(0,5).map(e=>`<div class="v872-log-line"><b>Ngày ${Number(e.day)||1} · ${esc(e.name)}</b> — ${esc(e.text)}</div>`).join('')||'<div class="v872-log-line">Chưa có câu chuyện mới.</div>';
  return `<div class="v872-book">${cards}<div class="v872-log-title">📜 5 ký ức gần nhất</div>${recent}</div>`;
}

function v84NpcBubble(id,fallBack){
 const list=V84_NPC_BUBBLES[id]||[fallBack||'Chào bạn!'];
 const relation=v872Relation(id);
 if(relation.pending && Number(gameState.day)>=Number(relation.pending.dayAvailable))return relation.pending.kind==='repair'?'Tớ cần nói chuyện cũ…':'Hôm trước còn một chuyện!';
 if(relation.anger>=55)return 'Chuyện cũ chưa quên đâu…';
 if(relation.trust>=78)return 'Mừng bạn ghé lại! 💚';
 const chapter=v84StoryStage(id),day=Number(gameState.day)||1;
 return list[Math.abs((day*3+chapter*2+id.length))%list.length];
}
function v84StoryStage(id){
  const f=gameState.villageStoryFlags || {};
  return Math.max(0, Math.min((V84_NPC_CHAPTERS[id]||[]).length,Number(f[`v84_${id}_stage`])||0));
}
function v84StoryAction(npcId) {
  const npc=VILLAGE_NPC_LIBRARY[npcId];
  const stage=v84StoryStage(npcId);
  const chapters=V84_NPC_CHAPTERS[npcId]||[];
  if(!npc || !chapters[stage])return null;
  const availableDay=Number((gameState.villageStoryFlags||{})[`v84_${npcId}_day`])||0;
  return {stage,availableDay,ev:V84_NPC_STORY_EVENTS.find(x=>x.npcId===npcId && x.chapter===stage)};
}
function v84StartNpcStory(npcId){
  ensureV6State();
  const quest=v84StoryAction(npcId);
  if(!quest)return showToast('Bạn đã hoàn thành câu chuyện của cư dân này.','📖');
  if(VILLAGE_NPC_LIBRARY[npcId]?.home && VILLAGE_NPC_LIBRARY[npcId].home!==(gameState.villageZone||'lane'))return showToast('Hãy gặp cư dân tại quê nhà để mở chương truyện.','📍');
  const unfinished=v872Followup(npcId);
  if(unfinished)return showToast(`Còn chuyện chưa giải quyết với ${VILLAGE_NPC_LIBRARY[npcId]?.name||'NPC'}. Hãy chọn mục gặp lại trước!`,'🧠');
  const link=v874StoryLinkMissing(npcId);if(link)return showToast(`📍 Cần làm quen ${link.name} ở ${link.place} trước khi mở chương này.`, '📖');
  if(gameState.day < quest.availableDay)return showToast(`Cốt truyện tiếp theo mở ở ngày ${quest.availableDay}. Hãy quay lại gặp người này nhé!`,'📅');
  if(gameState.villageEncounterId || villageWalking)return;
  if(!(villageNpcState||[]).some(v=>v.id===npcId))return showToast('Cư dân đã rời khỏi khu vực này.','🚶');
  gameState.villageEncounterId=quest.ev.id;
  const daily=gameState.dailyVillageVisitors;
  if(daily && !daily.completedIds.includes(npcId))daily.completedIds.push(npcId);
  villageNpcState=villageNpcState.filter(n=>n.id!==npcId);
  villageNpcZoneKey='';
  closeVillagePointModal();
  renderVillageUI();
  saveGameToStorage(false);
}
function v84FinishNpcStory(encounter, outcome){
  if(!encounter || !encounter.storyOnly || !encounter.npcId)return;
  const id=encounter.npcId, stage=v84StoryStage(id);
  if(stage!==encounter.chapter)return;
  gameState.villageStoryFlags[`v84_${id}_stage`]=stage+1;
  gameState.villageStoryFlags[`v84_${id}_day`]=Number(gameState.day||1)+1;
  if(!gameState.villageNpcBonds || typeof gameState.villageNpcBonds!=='object')gameState.villageNpcBonds={};
  gameState.villageNpcBonds[id]=Math.max(0,Math.min(100,(gameState.villageNpcBonds[id]||0)+(outcome.bad?2:outcome.rarity==='jackpot'?14:8)));
  gameState.villageStoryFlags[`v84_${id}_last`]=outcome.rarity||'neutral';
}
function v84StoryProgressPanel(){
 const elem=document.getElementById('v84-story-progress');if(!elem)return;
 const zone=gameState.villageZone||'lane',residentIds=V873_HOME_ROSTER[zone]||[];
 const schedule=v873CurrentSchedule(zone);
 const esc=v=>escapeHtmlText(String(v??''));
 const chips=residentIds.map(id=>{
  const npc=VILLAGE_NPC_LIBRARY[id],chapters=V84_NPC_CHAPTERS[id]||[];
  const stage=v84StoryStage(id),pending=v872Relation(id).pending;
  const note=pending?`Đợi gặp lại ngày ${pending.dayAvailable}`:stage===chapters.length?'Đã hoàn thành':`Chương ${stage+1} / ${chapters.length}`;
  return `<span class="v84-story-chip" title="${esc(npc.name+' • '+note)}">${npc.accent} ${esc(npc.name)} <b>${stage}/${chapters.length}</b></span>`;
 }).join('')||`<span class="v873-muted">Nhân vật chính của khu vực này sẽ được bổ sung trong bản mở rộng tiếp theo.</span>`;
 const awards={lane:['v873_lane_heirloom','🏡 Hòm Kỷ Vật Phố Nhỏ'],school:['v873_school_medal','🏅 Huy Chương Trường Thị Trấn']};
 const award=awards[zone],awardStatus=award?(gameState.v873Rewards?.[zone]?'✅ Đã nhận quà cốt truyện':'🔒 '+award[1]+' — hoàn thành tất cả cư dân'):`🎁 Vật phẩm độc quyền: ${V873_ZONE_LOOT[zone]?.[2]||'đang cập nhật'}`;
 const away=schedule.absent.map(x=>`${VILLAGE_NPC_LIBRARY[x.id]?.name||x.id}: ${x.reason}`).join(' • ');
 const extra=`<div class="v873-journal-extras"><div>🎁 ${esc(awardStatus)}</div><div>📅 Lịch ngày ${gameState.day}${schedule.holiday?' • '+esc(schedule.holiday):''}</div><div>👥 Có mặt: ${schedule.ids.map(id=>esc(VILLAGE_NPC_LIBRARY[id]?.name||id)).join(', ')||'Hôm nay vắng cư dân'}</div>${away?`<div>🚶 Vắng: ${esc(away)}</div>`:''}</div>`;
 elem.innerHTML=`<div class="v84-story-h"><b>📖 ${esc(VILLAGE_ZONES[zone]?.name||'Làng')} • Cốt truyện cư dân</b><button type="button" class="v872-journal-btn" onclick="v872ToggleJournal()" aria-expanded="${v872JournalOpen}">🧠 ${v872JournalOpen?'Thu gọn':'Lịch & ký ức'} ${v872JournalOpen?'⌃':'⌄'}</button></div><div class="v84-story-chips">${chips}</div>${v872JournalOpen?extra+v872JournalMarkup():''}`;
}
function v84OutcomeSummary(outcome){
 const chunks=[];
 if(Number(outcome.coins))chunks.push(`🪙 ${outcome.coins>0?'+':''}${outcome.coins} Xu`);
 if(Number(outcome.exp))chunks.push(`✨ +${outcome.exp} EXP`);
 if(Number(outcome.karma))chunks.push(`🤝 ${outcome.karma>0?'+':''}${outcome.karma} thiện cảm`);
 if(Number(outcome.energy))chunks.push(`⚡ ${outcome.energy>0?'+':''}${outcome.energy} năng lượng`);
 if(outcome.ticket)chunks.push(`🎟️ +${outcome.ticket} vé số`);
 if(outcome.blindBag)chunks.push(`🎁 +${outcome.blindBag} túi mù`);
 if(outcome.item)chunks.push(`📦 ${outcome.item}`);
 return chunks.join(' · ')||'Không thay đổi tài nguyên';
}
function v84ShowOutcome(encounter,outcome){
 const dialog=document.getElementById('v84-luck-dialog');if(!dialog)return;
 const rarity=outcome.rarity||(outcome.bad?'bad':outcome.good?'good':'neutral');
 const titles={jackpot:'🍀 ĐẠI CÁT — TRÚNG VẬN!',good:'✨ VẬN MAY MỈM CƯỜI',neutral:'🌤️ CHUYỆN THƯỜNG NGÀY',bad:'🌧️ XUI MỘT CHÚT RỒI!'};
 dialog.className=`v84-luck-dialog v84-${rarity}`;
 dialog.innerHTML=`<div class="v84-result-kicker">${titles[rarity]||titles.neutral}</div><h3>${encounter.icon} ${encounter.title}</h3><p>${outcome.text||'Một câu chuyện khác vừa xảy ra ở làng.'}</p><div class="v84-result-rewards">${v84OutcomeSummary(outcome)}</div><button type="button" onclick="v84CloseOutcome()">Tiếp tục hành trình →</button>`;
 document.getElementById('v84-luck-overlay').classList.remove('hidden');
}
function v84CloseOutcome(){document.getElementById('v84-luck-overlay')?.classList.add('hidden');}

    function pickVillageEncounter() {
      const zoneKey = gameState.villageZone || 'lane';
      let pool = VILLAGE_ENCOUNTERS.filter(ev =>
        !ev.storyOnly &&
        (!ev.zones || ev.zones.includes(zoneKey)) &&
        gameState.level >= (ev.reqLevel || 1) &&
        gameState.shopStage >= (ev.reqStage || 0)
      );
      if (!pool.length) pool = VILLAGE_ENCOUNTERS.filter(ev => !ev.storyOnly && !ev.reqLevel && !ev.reqStage);
      // Avoid replaying the last 5 events in the same zone; never dead-end a small pool.
      const recent = new Set((gameState.villageHistory || []).slice(0,5).map(h=>h.eventId));
      const fresh = pool.filter(ev=>!recent.has(ev.id));
      if (fresh.length >= 3) pool = fresh;
      const total = pool.reduce((sum,ev)=>sum+(Number(ev.weight)||1),0);
      let roll=Math.random()*Math.max(1,total);
      for(const ev of pool){roll-=(Number(ev.weight)||1); if(roll<=0)return ev;}
      return pool[pool.length-1] || null;
    }

    function weightedVillageOutcome(outcomes,npcId=null) {
      const utilityBonus = getUtilityBonuses();
      const luck = Math.max(0, (Number(getGrowthBonuses().luckPct) || 0) + (Number(utilityBonus.villageLuckPct) || 0));
      const karma = Math.max(-50, Math.min(100, Number(gameState.villageKarma) || 0));
      const incidentBoost = Math.max(0, Number(((getActiveWorldEventConfig() || {}).effects || {}).incidentBoost) || 0);
      const adjusted = outcomes.map(o => {
        let w = Number(o.w) || 1;
        if (o.good) w *= (1 + luck * 1.1 + Math.max(0, karma) / 500) * Math.max(.72, 1 - incidentBoost * 1.6);
        if (o.bad) w *= Math.max(.65, 1 - luck * .55 - Math.max(0, karma) / 650) * (1 + incidentBoost * 4);
        if (o.rarity === 'jackpot') w *= (1 + Math.min(12,Number(gameState.villageLuckDryStreak)||0)*.09);
        if(npcId && V872_NPC_VOICES[npcId]) {
          const rel=v872Relation(npcId);
          const influence=v872Clamp((rel.trust-50)/150-rel.anger/270,-.33,.30);
          if(o.good)w*=1+influence;
          if(o.bad)w*=1-influence;
        }
        return { o, w };
      });
      const total = adjusted.reduce((s, x) => s + x.w, 0);
      let r = Math.random() * total;
      for (const x of adjusted) {
        r -= x.w;
        if (r <= 0) return x.o;
      }
      return adjusted[adjusted.length - 1].o;
    }

    function applyVillageOutcome(outcome, encounter) {
      if (!outcome) return;
      const beforeEnergy = gameState.villageEnergy;

      if (Number(outcome.coins)) {
        const utilityBonus = getUtilityBonuses();
        let coinDelta = Number(outcome.coins);
        if (coinDelta > 0) coinDelta = Math.round(coinDelta * (1 + (Number(utilityBonus.villageCoinPct) || 0)));
        gameState.coins = Math.max(0, gameState.coins + coinDelta);
      }
      if (Number(outcome.exp)) addExp(Math.max(0, Number(outcome.exp)));
      if (Number(outcome.karma)) gameState.villageKarma = Math.max(-50, Math.min(100, gameState.villageKarma + Number(outcome.karma)));
      if (Number(outcome.energy)) gameState.villageEnergy = Math.max(0, Math.min(100, gameState.villageEnergy + Number(outcome.energy)));
      if (outcome.item && ITEM_DICTIONARY[outcome.item]) {
        gameState.inventory[outcome.item] = (gameState.inventory[outcome.item] || 0) + Math.max(1, Number(outcome.qty) || 1);
      }
      if (Number(outcome.ticket)) gameState.lotteryTickets = (gameState.lotteryTickets || 0) + Number(outcome.ticket);
      if (Number(outcome.blindBag)) gameState.blindBagTokens = (gameState.blindBagTokens || 0) + Number(outcome.blindBag);
      if (outcome.souvenir && SOUVENIR_CONFIG[outcome.souvenir]) addSouvenir(outcome.souvenir, 'Gặp khi đi quanh làng');

      if (outcome.rarity === 'jackpot') gameState.villageLuckDryStreak=0;
      else gameState.villageLuckDryStreak=Math.min(12,(Number(gameState.villageLuckDryStreak)||0)+1);
      if(encounter.v872FollowKind) v872ResolveFollowup(encounter,outcome,encounter.v872LastChoiceIndex);
      else if(encounter.storyOnly && encounter.npcId) v872StoryFinished(encounter,outcome,encounter.v872LastChoiceIndex);
      else if(encounter.npcId) v872SideAction(encounter,outcome);
      const row = {
        id: Date.now(),
        day: gameState.day,
        eventId: encounter.id,
        icon: encounter.icon,
        title: encounter.title,
        text: outcome.text || '',
        zone: getVillageZoneConfig().name
      };
      gameState.villageHistory.unshift(row);
      gameState.villageHistory = gameState.villageHistory.slice(0, 12);

      // Kỷ niệm chương vàng chỉ bắt đầu có cơ hội khi thiện cảm làng rất cao.
      if (gameState.villageKarma >= 80 && !gameState.souvenirs.village_founder_plaque && Math.random() < .035) {
        addSouvenir('village_founder_plaque', 'Cả làng đã rất tin quý bạn');
      }

      v873CheckAwards();
      v874CheckNpcRewards();
      gameState.villageEncounterId = null;
      updateHeaderStats();
      renderGameCollectionSummary();
      renderVillageUI();
      saveGameToStorage(false);
      playSound(outcome.good || outcome.souvenir ? 'coin' : 'click');
      if (encounter.id.startsWith('v84_') || encounter.id.startsWith('v872_') || encounter.id.startsWith('v873_')) v84ShowOutcome(encounter,outcome);
      else showToast(outcome.text || 'Chuyến đi đã kết thúc.', encounter.icon);
    }

    function resolveVillageEncounter(choiceIndex) {
      ensureV6State();
      const encounter = VILLAGE_ENCOUNTERS.find(x => x.id === gameState.villageEncounterId);
      if (!encounter) {
        gameState.villageEncounterId = null;
        return renderVillageUI();
      }
      const choice = encounter.choices[choiceIndex];
      if (!choice) return;
      encounter.v872LastChoiceIndex=choiceIndex;
      const outcome = weightedVillageOutcome(choice.outcomes || [],encounter.npcId);
      applyVillageOutcome(outcome, encounter);
    }


    function toggleVillageGuide(forceState) {
      const panel = document.getElementById('village-guide-panel');
      if (!panel) return;
      if (typeof forceState === 'boolean') panel.classList.toggle('hidden', !forceState);
      else panel.classList.toggle('hidden');
      playSound('click');
    }

    try {
      if (typeof VILLAGE_ZONE_ART === 'object' && VILLAGE_ZONE_ART) {
        VILLAGE_ZONE_ART.lane = 'assets/images/001_css-001_8a11ac9fab.webp';
        VILLAGE_ZONE_ART.riverside = 'assets/images/002_css-002_270f814735.webp';
      }
    } catch (e) { console.warn('V71 art patch skipped', e); }

    function startVillageWalk() {
      ensureV6State();
      if (villageWalking) return;
      if (gameState.villageEncounterId) return showToast('Bạn đang gặp một chuyện, xử lý xong rồi đi tiếp nhé.', '💬');
      closeVillagePointModal();

      const zone = getVillageZoneConfig();
      if (!isVillageZoneUnlocked(zone)) return showToast('Khu này chưa mở.', '🔒');
      const cost = getVillageWalkCost(zone);
      if (gameState.villageEnergy < cost) return showToast(`Chưa đủ thể lực. Thể lực tự hồi +1 mỗi ${getVillageRegenSeconds()} giây.`, '⚡');

      gameState.villageEnergy -= cost;
      gameState.villageTripsToday = (gameState.villageTripsToday || 0) + 1;
      villageWalking = true;
      renderVillageUI();

      const chibi = document.getElementById('village-chibi');
      if (chibi) {
        chibi.classList.remove('walking');
        void chibi.offsetWidth;
        chibi.classList.add('walking');
      }

      setTimeout(() => {
        villageWalking = false;
        const encounter = pickVillageEncounter();
        if (encounter) gameState.villageEncounterId = encounter.id;
        renderVillageUI();
        saveGameToStorage(false);
        if (encounter) playSound('click');
      }, 920);
    }


    const VILLAGE_MAP_ART = `assets/images/160_village-map-art_d608ea4d15.webp`;



    // V69 — independent offline backgrounds for each village zone.
    const VILLAGE_ZONE_ART = {"lane":"assets/images/161_lane_a460193012.webp","market":"assets/images/162_market_f19dbba8a2.webp","school":"assets/images/163_school_7b557a370c.webp","ricefield":"assets/images/164_ricefield_8ead750201.webp","riverside":"assets/images/165_riverside_a3cec0c03c.webp","busstop":"assets/images/166_busstop_52fa748552.webp","clinic":"assets/images/167_clinic_6a73516e06.webp","temple":"assets/images/168_temple_8034968ce4.webp","hill":"assets/images/169_hill_cf71b959cf.webp","nightmarket":"assets/images/170_nightmarket_af737a4f0a.webp","district":"assets/images/171_district_c9caae315d.webp"};


    function shuffleArray(source=[]) {
      const arr = Array.isArray(source) ? source.slice() : [];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    }

    function getVillageNpcWeight(npc, zoneKey) {
      const meta = VILLAGE_NPC_META[npc.id] || {};
      const weatherId = (getActiveWorldEventConfig() || {}).id || 'cloudy_day';
      let weight = meta.rarity === 'rare' ? 0.38 : meta.rarity === 'uncommon' ? 0.72 : 1.08;
      if (Array.isArray(meta.events) && meta.events.includes(weatherId)) weight *= 1.8;
      if (Array.isArray(meta.avoidEvents) && meta.avoidEvents.includes(weatherId)) weight *= 0.48;
      if (Array.isArray(npc.tags) && npc.tags.includes(zoneKey)) weight *= 1.12;
      return Math.max(0.05, weight);
    }

    function weightedPickVillageNpcIds(candidates, count, zoneKey) {
      const pool = Array.isArray(candidates) ? candidates.slice() : [];
      const picks = [];
      const target = Math.max(1, Math.min(count, pool.length));
      while (pool.length && picks.length < target) {
        const total = pool.reduce((sum, npc) => sum + getVillageNpcWeight(npc, zoneKey), 0);
        let roll = Math.random() * total;
        let pickedIndex = 0;
        for (let i = 0; i < pool.length; i++) {
          roll -= getVillageNpcWeight(pool[i], zoneKey);
          if (roll <= 0) { pickedIndex = i; break; }
        }
        const [picked] = pool.splice(pickedIndex, 1);
        if (picked) picks.push(picked.id);
      }
      return picks;
    }

    function rollDailyVillageVisitors(force=false) {
      // Force must not reroll attendance in the same day, even after zone switches.
      return v873CurrentSchedule(gameState.villageZone||'lane').ids;
    }
    function getVillageNpcRoster(zoneKey) {
      const schedule=v873CurrentSchedule(zoneKey);
      const done=new Set(schedule.completedIds||[]);
      return schedule.ids.filter(id=>!done.has(id)&&VILLAGE_NPC_LIBRARY[id]).map(id=>VILLAGE_NPC_LIBRARY[id]);
    }

    function getVillageNpcAnchors(zoneKey) {
      return VILLAGE_NPC_ANCHORS[zoneKey] || VILLAGE_NPC_ANCHORS.default || [{x:'30%',y:'58%'},{x:'70%',y:'58%'}];
    }

    function getVillageNpcPaths(zoneKey) {
      return VILLAGE_NPC_PATHS[zoneKey] || VILLAGE_NPC_PATHS.default || [];
    }


    function villageMapDimensions() {
      const node = document.getElementById('village-road');
      return { w: Math.max(280, node?.clientWidth || 360), h: Math.max(230, node?.clientHeight || 282) };
    }
    function villagePercent(pos) {
      return { x: parseFloat(pos?.x) || 0, y: parseFloat(pos?.y) || 0 };
    }
    function v87348ActorScale(){
      const crowd=villageNpcState.length>=3;
      const scene=gameState.villageZone||'lane';
      return crowd && ['school','clinic','hill'].includes(scene) ? .78 : 1;
    }
    function villageBusyBox(pos, kind, dims) {
      const p=villagePercent(pos);
      // NPC images extend above the 50px avatar frame; account for their visible silhouette.
      const sizes={point:[50,56], player:[49,70], npc:[50,65]};
      const [w,h]=(sizes[kind]||sizes.npc).map(n=>n*(kind==='point'?1:v87348ActorScale()));
      return {x:p.x*dims.w/100,y:p.y*dims.h/100,w,h,kind};
    }
    function villageBoxConflict(a,b,pad=5) {
      return Math.abs(a.x-b.x)<(a.w+b.w)/2+pad && Math.abs(a.y-b.y)<(a.h+b.h)/2+pad;
    }
    // V87.3.4.7 — Diverse, day-seeded staging across each map's walkable ground.
    // Coordinates below describe locations where shoes touch the image (not the
    // centre of the sprite). Each map has at least two independent depth areas.
    const V87346_GROUND = {
      lane:{
        areas:[[[15,68],[39,66],[58,68],[84,66],[85,81],[15,81]],[[19,57],[33,53],[43,57],[43,68],[19,68]]],
        blocked:[[[14,70],[30,69],[30,90],[14,90]],[[58,77],[74,76],[74,90],[58,90]]],ideal:73
      },
      market:{
        areas:[[[15,68],[40,65],[67,67],[85,67],[85,84],[15,85]],[[34,59],[46,56],[60,59],[60,70],[32,70]]],
        blocked:[[[11,75],[27,74],[27,89],[11,89]],[[79,77],[93,76],[93,89],[79,89]]],ideal:76
      },
      school:{
        // Entrance pillars at x<29 and x>75 are NOT walkable. The central
        // courtyard and the lower paved sidewalk are the two safe surfaces.
        areas:[[[31,57],[73,57],[74,87],[30,87]],[[15,87],[87,87],[87,92],[15,92]]],
        blocked:[[[0,39],[30,39],[30,86],[0,86]],[[74,39],[100,39],[100,86],[74,86]],[[42,47],[59,47],[59,56],[42,56]]],ideal:75
      },
      ricefield:{
        areas:[[[17,69],[39,70],[56,72],[84,71],[85,84],[15,84]],[[20,60],[38,60],[49,68],[49,74],[20,73]]],
        blocked:[[[47,63],[77,62],[79,72],[46,74]],[[12,71],[30,70],[31,92],[12,92]]],ideal:76
      },
      riverside:{
        areas:[[[16,65],[40,64],[64,65],[84,65],[85,81],[16,81]],[[21,56],[37,55],[48,63],[47,67],[21,67]]],
        blocked:[[[17,78],[38,77],[38,92],[17,92]],[[42,52],[75,52],[75,69],[42,69]],[[61,79],[74,77],[74,92],[61,92]]],ideal:72
      },
      busstop:{
        areas:[[[16,69],[41,68],[67,68],[84,69],[85,87],[15,87]],[[31,59],[46,60],[68,64],[69,71],[29,72]]],
        blocked:[[[10,83],[20,83],[20,91],[10,91]],[[82,83],[92,83],[92,91],[82,91]]],ideal:77
      },
      clinic:{
        // The front low stone wall occupies most of the left half of this map.
        // Walk on the paved courtyard behind it or the right-side access.
        areas:[[[33,60],[89,58],[92,73],[34,73]],[[65,72],[93,72],[92,89],[65,89]]],
        blocked:[[[0,68],[64,68],[64,97],[0,97]],[[0,49],[32,49],[32,64],[0,64]],[[33,48],[43,48],[43,60],[33,60]],[[80,47],[98,47],[98,60],[80,60]]],ideal:68
      },
      temple:{
        areas:[[[17,65],[43,64],[67,66],[85,66],[85,83],[16,83]],[[31,56],[45,55],[65,60],[65,67],[30,68]]],
        blocked:[[[12,73],[29,72],[29,91],[12,91]],[[79,76],[91,75],[91,91],[79,91]]],ideal:72
      },
      hill:{
        // The lower left edge is flowerbed/stone fence, NOT a walking path.
        // Trail bends uphill to the right. Leave foreground rocks clear.
        areas:[[[44,73],[52,71],[64,73],[79,68],[91,67],[92,77],[79,87],[52,87],[44,83]],[[74,54],[90,53],[94,65],[86,71],[72,68]]],
        blocked:[[[0,55],[42,55],[43,94],[0,94]],[[0,80],[43,77],[44,99],[0,99]],[[43,48],[65,50],[66,68],[44,70]],[[83,83],[100,79],[100,99],[83,99]]],ideal:76
      },
      nightmarket:{
        areas:[[[17,67],[41,65],[65,67],[85,69],[85,83],[16,83]],[[27,58],[43,57],[67,61],[67,69],[27,69]]],
        blocked:[[[11,78],[27,77],[27,93],[11,93]],[[42,54],[69,54],[69,70],[42,70]],[[80,77],[92,77],[92,91],[80,91]]],ideal:72
      },
      district:{
        areas:[[[17,60],[39,58],[61,60],[84,61],[85,81],[16,81]],[[23,54],[39,52],[69,54],[71,63],[23,65]]],
        blocked:[[[37,66],[58,65],[59,80],[37,80]],[[10,70],[27,70],[27,93],[10,93]],[[77,73],[92,73],[92,93],[77,93]]],ideal:70
      }
    };
    function v87346Inside(poly,x,y){
      let inside=false;
      for(let i=0,j=poly.length-1;i<poly.length;j=i++){
        const a=poly[i],b=poly[j];
        if((a[1]>y)!==(b[1]>y) && x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])inside=!inside;
      }
      return inside;
    }
    function v87346Hash(v){
      let h=2166136261;
      const str=String(v);
      for(let i=0;i<str.length;i++){h=Math.imul(h^str.charCodeAt(i),16777619);}
      return h>>>0;
    }
    function v87346Random(seed){
      let v=seed>>>0;
      return ()=>{v=(Math.imul(v,1664525)+1013904223)>>>0;return v/4294967296;};
    }
    function v87346CandidateFeet(zone,seed){
      const cfg=V87346_GROUND[zone]||V87346_GROUND.lane;
      const rand=v87346Random(seed);
      const result=[];
      // Independently jittered walking-surface sampling, NOT a fixed NPC grid.
      for(let x=14;x<=86;x+=2.05){
        for(let y=52;y<=87;y+=1.85){
          const px=x+(rand()-.5)*1.45,py=y+(rand()-.5)*1.35;
          if(!cfg.areas.some(poly=>v87346Inside(poly,px,py)))continue;
          // Keep a little breathing room at flowerbed and railing edges.
          // Footprint check: the character's shoes cover more than one pixel.
          // A candidate is rejected when either shoe or the toe/heel buffer
          // intersects scene obstacles. Applies also in every fallback path.
          const feetBuffer=[[0,0],[-2.0,0],[2.0,0],[-2.0,-1.6],[2.0,-1.6],[-2.0,1.6],[2.0,1.6]];
          if(!feetBuffer.every(([dx,dy])=>cfg.areas.some(poly=>v87346Inside(poly,px+dx,py+dy))))continue;
          if(cfg.blocked.some(poly=>feetBuffer.some(([dx,dy])=>v87346Inside(poly,px+dx,py+dy))))continue;
          result.push({x:px,y:py});
        }
      }
      return result;
    }
    // Twelve composition modes: asymmetrical, depth-staggered, paired and
    // diagonal arrangements. They are TARGETS only: all feet are picked from
    // continuous region samples above, subject to real sprite collision rules.
    const V87347_RHYTHMS=[
      [-7, 6,-5, 4], [7,-7, 6,-5], [5,-2,-8, 7], [-3, 8, 0,-8],
      [8, 1,-7,-2], [-8, 3, 7,-4], [1,-8, 6,-3], [-6,-2, 8, 4],
      [4,-6, 2, 8], [7, 2,-5,-9], [-2, 7,-9, 4], [8,-4, 5,-7]
    ];
    function v87347Targets(zone,ids,seed,variant=0){
      const cfg=V87346_GROUND[zone]||V87346_GROUND.lane;
      const rng=v87346Random((seed+Math.imul(variant+1,2654435761))>>>0);
      const count=ids.length;
      // Different days change who occupies front/back/left/right, including
      // the player. The horizontal spread itself adapts to the number present.
      const spread=count===1?0:count===2?39:count===3?51:64;
      const slots=Array.from({length:count},(_,i)=>50-spread/2+(count===1?0:spread*i/(count-1)));
      for(let i=slots.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[slots[i],slots[j]]=[slots[j],slots[i]];}
      const rhythm=V87347_RHYTHMS[(seed+variant)%V87347_RHYTHMS.length];
      const minY=Math.max(60,cfg.ideal-10),maxY=Math.min(84,cfg.ideal+9);
      return ids.map((id,i)=>{
        const identity=v87346Hash(`${seed}|${id}|${variant}`);
        const depth=rhythm[(i+variant)%rhythm.length]+(rng()-.5)*4;
        return {
          x:Math.min(83,Math.max(17,slots[i]+(rng()-.5)*(count===4?4.5:13))),
          y:Math.min(maxY,Math.max(minY,cfg.ideal+depth)),
          seed:identity
        };
      });
    }
    function layoutVillageActors(){
      const zone=gameState.villageZone||'lane';
      const dims=villageMapDimensions();
      const npcList=villageNpcState.slice(0,3);
      const road=document.getElementById('village-road');
      if(road)road.style.setProperty('--v87348-actor-scale',String(v87348ActorScale()));
      const roster=['player',...npcList.map(n=>n.id)];
      const day=Number(gameState.day)||1;
      const seed=v87346Hash(`${zone}|${day}|${roster.join(',')}`);
      const feet=v87346CandidateFeet(zone,seed);
      let best=null;
      // Try several possible rhythms. Change the selected rhythm by day, but
      // do not re-roll on map repaint, page resize or tab changes.
      for(let attempt=0;attempt<12;attempt++){
        const targets=v87347Targets(zone,roster,seed,attempt);
        const used=[],boxes=[];
        let cost=0,failed=false;
        for(let i=0;i<roster.length;i++){
          const kind=i===0?'player':'npc';
          const target=targets[i];
          const footOffset=kind==='player'?35*v87348ActorScale():32*v87348ActorScale();
          let choice=null;
          for(const foot of feet){
            const centerY=foot.y-footOffset*100/dims.h;
            const pos={x:`${foot.x.toFixed(2)}%`,y:`${centerY.toFixed(2)}%`};
            const box=villageBusyBox(pos,kind,dims);
            // Visible sprites and speech bubbles stay inside a safe margin.
            const margin=kind==='player'?17:15;
            if(box.x-box.w/2<margin||box.x+box.w/2>dims.w-margin)continue;
            if(box.y-box.h/2<18||box.y+box.h/2>dims.h-26)continue;
            if(boxes.some(prev=>villageBoxConflict(box,prev,8)))continue;
            const dX=Math.abs(foot.x-target.x), dY=Math.abs(foot.y-target.y);
            const distance=dX*1.45+dY*1.65;
            const edgeCost=Math.max(0,21-foot.x,foot.x-79)*.7;
            const occupiedBias=used.reduce((sum,other)=>sum+Math.max(0,18-Math.hypot(foot.x-other.x,foot.y-other.y)*.7)*1.2,0);
            const preference=distance+edgeCost+occupiedBias;
            if(!choice||preference<choice.cost)choice={pos,box,foot,cost:preference};
          }
          if(!choice){failed=true;break;}
          used.push(choice.foot);boxes.push(choice.box);cost+=choice.cost;
        }
        if(failed)continue;
        // Promote visual depth contrast without sacrificing safe ground.
        if(used.length>1){
          const ys=used.map(x=>x.y),range=Math.max(...ys)-Math.min(...ys);
          cost+=Math.max(0,7.5-range)*2.2;
        }
        // Daily deterministic bias changes which of the viable compositions
        // wins, rather than always selecting the same regular formation.
        const bias=v87346Hash(`${seed}|composition|${attempt}`)%1900/100;
        cost+=bias;
        if(!best||cost<best.cost)best={cost,positions:used.map((foot,i)=>({
          x:`${foot.x.toFixed(2)}%`,
          y:`${(foot.y-(i===0?35:32)*v87348ActorScale()*100/dims.h).toFixed(2)}%`
        }))};
      }
      // Safety fallback: try bounded backtracking over legitimate walkable feet.
      // Crucially, do NOT bypass the ground/exclusion masks when a region is busy.
      if(!best){
        for(let variant=0;variant<4 && !best;variant++){
          const targets=v87347Targets(zone,roster,seed,variant+12);
          const choices=targets.map((target,i)=>{
            const kind=i===0?'player':'npc',footOffset=kind==='player'?35*v87348ActorScale():32*v87348ActorScale();
            return feet.map(foot=>{
              const pos={x:`${foot.x.toFixed(2)}%`,y:`${(foot.y-footOffset*100/dims.h).toFixed(2)}%`};
              const box=villageBusyBox(pos,kind,dims);
              if(box.x-box.w/2<12||box.x+box.w/2>dims.w-12||box.y-box.h/2<14||box.y+box.h/2>dims.h-23)return null;
              const cost=Math.abs(foot.x-target.x)*1.4+Math.abs(foot.y-target.y)*1.2;
              return {pos,box,cost};
            }).filter(Boolean).sort((a,b)=>a.cost-b.cost).slice(0,52);
          });
          const picked=[],occupied=[];
          let steps=0;
          const search=(i,cost)=>{
            if(i===roster.length){best={cost,positions:picked.map(p=>p.pos)};return true;}
            for(const option of choices[i]){
              if(++steps>50000)return false;
              if(occupied.some(b=>villageBoxConflict(b,option.box,5)))continue;
              picked.push(option);occupied.push(option.box);
              if(search(i+1,cost+option.cost))return true;
              picked.pop();occupied.pop();
            }
            return false;
          };
          search(0,0);
        }
      }
      // Last resort still chooses a location from each map's *valid* foot mask.
      // The branch is defensive for unexpectedly tiny embedded viewports.
      if(!best){
        const occupied=[],positions=[];
        for(let i=0;i<roster.length;i++){
          const kind=i?'npc':'player',offset=(i?32:35)*v87348ActorScale();
          let choice=null;
          for(const foot of feet){
            const pos={x:`${foot.x.toFixed(2)}%`,y:`${(foot.y-offset*100/dims.h).toFixed(2)}%`};
            const box=villageBusyBox(pos,kind,dims);
            if(box.x-box.w/2<7||box.x+box.w/2>dims.w-7)continue;
            const collisions=occupied.filter(b=>villageBoxConflict(box,b,5)).length;
            const score=collisions*10000+Math.abs(foot.x-(20+i*20));
            if(!choice||score<choice.score)choice={pos,box,score};
          }
          if(choice){positions.push(choice.pos);occupied.push(choice.box);}
        }
        if(positions.length===roster.length)best={cost:Infinity,positions};
      }
      // A crowded map must not reintroduce the wall/gate bug via fixed fallback.
      // Each fallback is selected only from validated foot samples.
      const positions=best?.positions||roster.map((_,i)=>{
        const foot=feet[Math.min(feet.length-1,Math.floor((i+.5)*feet.length/roster.length))]||{x:50,y:75};
        return {x:`${foot.x.toFixed(2)}%`,y:`${(foot.y-(i===0?35:32)*v87348ActorScale()*100/dims.h).toFixed(2)}%`};
      });
      const player=document.getElementById('village-chibi');
      if(player){
        player.style.setProperty('--v69-player-x',positions[0].x);
        player.style.setProperty('--v69-player-y',positions[0].y);
      }
      npcList.forEach((npc,i)=>{npc.x=positions[i+1].x;npc.y=positions[i+1].y;});
    }

    function resetVillageNpcState(force=false) {
      const zoneKey = gameState.villageZone || 'lane';
      const dayKey = Number(gameState.day) || 1;
      const roster = getVillageNpcRoster(zoneKey);
      const rosterKey = `${zoneKey}_${dayKey}_${roster.map(npc => npc.id).join('|')}`;
      if (!force && villageNpcZoneKey === rosterKey) return;
      villageNpcZoneKey = rosterKey;
      const anchors = getVillageNpcAnchors(zoneKey);
      const used = new Set();
      villageNpcState = roster.map((npc, idx) => {
        const meta = VILLAGE_NPC_META[npc.id] || {};
        let anchorIndex = meta.anchor && Number.isFinite(Number(meta.anchor[zoneKey])) ? Number(meta.anchor[zoneKey]) : idx % Math.max(1, anchors.length);
        if (used.has(anchorIndex)) {
          anchorIndex = anchors.findIndex((_, i) => !used.has(i));
          if (anchorIndex < 0) anchorIndex = idx % Math.max(1, anchors.length);
        }
        used.add(anchorIndex);
        const point = anchors[anchorIndex] || anchors[idx % Math.max(1, anchors.length)] || {x:'30%',y:'58%'};
        return { id:npc.id, pathIndex: anchorIndex, x:point.x, y:point.y, walking:false, flip: idx % 2 === 1, bubble:v84NpcBubble(npc.id,npc.bubble) };
      });
      activeVillageNpcId = null;
    }

    function kickVillageNpcMotion() {
      const paths = getVillageNpcPaths(gameState.villageZone || 'lane');
      if (!paths.length || !villageNpcState.length) return;
      const order = villageNpcState.slice().sort(() => Math.random() - .5).slice(0, Math.min(2, villageNpcState.length));
      order.forEach(state => {
        const current = Number(state.pathIndex) || 0;
        let next = Math.floor(Math.random() * paths.length);
        if (paths.length > 1 && next === current) next = (next + 1) % paths.length;
        const point = paths[next] || paths[0];
        state.flip = next < current;
        state.pathIndex = next;
        state.x = point.x;
        state.y = point.y;
        state.walking = true;
      });
      layoutVillageActors(); // Keep wandering NPCs away from player and fixed points.
      renderVillageNpcs();
      setTimeout(() => {
        villageNpcState.forEach(s => s.walking = false);
        renderVillageNpcs();
      }, 2200);
    }

    function ensureVillageNpcMotion() {
      resetVillageNpcState(false);
      if (villageNpcTimer) {
        clearInterval(villageNpcTimer);
        villageNpcTimer = null;
      }
    }

    function inspectVillageNpc(npcId) {
      ensureV6State();
      if (villageWalking) return;
      if (gameState.villageEncounterId) return showToast('Đang có sự kiện làng rồi, xử lý xong hãy gặp người dân sau nhé.', '💬');
      const npc = VILLAGE_NPC_LIBRARY[npcId];
      if (!npc || (gameState.dailyVillageVisitors?.completedIds || []).includes(npcId) || !villageNpcState.some(v=>v.id===npcId)) return;
      activeVillageNpcId = npcId;
      v8732MarkMet(npcId,gameState.villageZone||npc.home);
      saveGameToStorage(false);
      const panel = document.getElementById('village-point-panel');
      const backdrop = document.getElementById('village-point-backdrop');
      const icon = document.getElementById('village-point-icon');
      const title = document.getElementById('village-point-title');
      const desc = document.getElementById('village-point-desc');
      const zone = document.getElementById('village-point-zone');
      const list = document.getElementById('village-point-choice-list');
      if (icon) { const face=V8733_NPC_PORTRAITS[npcId]; icon.classList.toggle('v8733-npc-face', !!face); icon.innerHTML=face ? `<img src="${face}" alt="${npc.name}">` : (npc.accent || '🙂'); }
      const npcMeta = VILLAGE_NPC_META[npc.id] || {};
      const rarityLabel = npcMeta.rarity === 'rare' ? ' • Hiếm' : npcMeta.rarity === 'uncommon' ? ' • Khá hiếm' : ' • Thường';
      if (title) title.innerText = `${npc.name}${rarityLabel}`;
      const story = npc.home === (gameState.villageZone||'lane') ? v84StoryAction(npc.id) : null;
      const stage = v84StoryStage(npc.id);
      const bond = Number(gameState.villageNpcBonds?.[npc.id])||0;
      const relation=v872Relation(npc.id),mood=v872Mood(npc.id),voice=v872MeetLine(npc.id);
      if (desc) desc.innerText = `${voice} • ${npc.desc || 'Một cư dân đang đi dạo quanh đây.'} • ${mood.label} • 🤝 Tin tưởng ${relation.trust} • 😠 Bực ${relation.anger} • 📖 ${stage}/${(V84_NPC_CHAPTERS[npc.id]||[]).length}`;
      if (zone) zone.innerText = `👥 Cư dân • ${getVillageZoneConfig().name || 'Làng'}`;
      const chapterLink=v874StoryLinkMissing(npc.id);
      const chapterMarkup = (npc.home && npc.home!==(gameState.villageZone||'lane')) ? `<div class="v84-story-done">📍 Chương truyện của ${npc.name} chỉ mở tại ${VILLAGE_ZONES[npc.home]?.name||'quê nhà'}.</div>` : story ? `<button type="button" onclick="v84StartNpcStory('${npc.id}')" class="village-choice v84-npc-story-choice tap-scale"><span><span class="village-choice-main">📖 Chương ${stage+1}: ${story.ev.title.split(': ').slice(1).join(': ')}</span><span class="village-choice-sub">${gameState.day < story.availableDay ? `🔒 Mở vào ngày ${story.availableDay}` : chapterLink ? `📍 Cần gặp ${chapterLink.name} tại ${chapterLink.place}` : '✨ Câu chuyện riêng • kết quả khác nhau tùy lựa chọn và may rủi'}</span></span></button>` : `<div class="v84-story-done">🏅 Bạn đã đi hết ${(V84_NPC_CHAPTERS[npc.id]||[]).length} chương cùng ${npc.name}. Cảm ơn vì tình bạn này!</div>`;
      const followup=v872Followup(npc.id);
      const pendingMarkup=followup?`<button type="button" onclick="v872StartFollowup('${npc.id}')" class="village-choice v84-npc-story-choice tap-scale"><span><span class="village-choice-main">${followup.pending.kind==='repair'?'💔 Hóa giải chuyện cũ':followup.pending.kind==='thanks'?'💌 Lời cảm ơn hôm sau':'📜 Lời nhắn còn dang dở'}</span><span class="village-choice-sub">${followup.ready?'✨ Đang chờ bạn • kết quả ảnh hưởng tới quan hệ':`🔒 Mở vào ngày ${followup.pending.dayAvailable}`}</span></span></button>`:'';
      if (list) list.innerHTML = (followup?pendingMarkup:chapterMarkup) + (npc.actions || []).map((act, idx) => `
        <button onclick="resolveVillageNpcAction(${idx})" class="village-choice tap-scale"><span><span class="village-choice-main">${act.label}</span><span class="village-choice-sub">Tương tác với ${npc.name} để xem có chuyện gì thú vị xảy ra.</span></span></button>
      `).join('') + v8731GiftEntry(npc.id) + `<button onclick="closeVillagePointModal()" class="village-choice tap-scale"><span><span class="village-choice-main">↩️ Chào rồi đi tiếp</span><span class="village-choice-sub">Đóng lại và tiếp tục khám phá bản đồ.</span></span></button>`;
      if (panel) panel.classList.remove('hidden');
      if (backdrop) backdrop.classList.remove('hidden');
    }

    function resolveVillageNpcAction(actionIndex) {
      const npc = VILLAGE_NPC_LIBRARY[activeVillageNpcId];
      const action = npc && npc.actions ? npc.actions[actionIndex] : null;
      if (!npc || !action) return closeVillagePointModal();
      const encounter = { id:`npc_${npc.id}_${actionIndex}`, npcId:npc.id, icon:npc.accent || '🙂', title:`${npc.name} đang đi dạo` };
      const outcome = weightedVillageOutcome(action.outcomes || [{w:1,text:'Không có gì xảy ra.'}],npc.id);
      const daily=gameState.dailyVillageVisitors;
      if (daily && !daily.completedIds.includes(npc.id)) daily.completedIds.push(npc.id);
      villageNpcState = villageNpcState.filter(state => state.id !== npc.id);
      villageNpcZoneKey = ''; // Rebuild without the visitor who just finished their request.
      closeVillagePointModal();
      applyVillageOutcome(outcome, encounter);
    }

    function renderVillageNpcs() {
      const layer = document.getElementById('village-npc-layer');
      if (!layer) return;
      resetVillageNpcState(false);
      const disabled = villageWalking || !!gameState.villageEncounterId;
      layer.innerHTML = villageNpcState.map((state, idx) => {
        const npc = VILLAGE_NPC_LIBRARY[state.id];
        if (!npc) return '';
        const src = VILLAGE_NPC_ART[npc.id] || getPlayerChibiSource(npc.chibi || (idx % 2 ? 'female' : 'male'));
                return `
          <button type="button" class="village-npc-btn ${state.walking ? 'walking' : ''} ${state.flip ? 'flip' : ''}" style="left:${state.x}; top:${state.y};" onclick="inspectVillageNpc('${npc.id}')" ${disabled ? 'disabled' : ''}>
            <span class="village-npc-bubble">${state.bubble || npc.bubble || 'Hi~'}</span>
            <span class="village-npc-avatar"><img src="${src}" alt="${npc.name}"><span class="village-npc-accent">${npc.accent || '🙂'}</span></span>
          </button>
        `;
      }).join('');
    }

    function getVillagePointsForZone(zoneKey) {
      return VILLAGE_POINT_LIBRARY[zoneKey] || VILLAGE_POINT_LIBRARY.default || [];
    }

    function closeVillagePointModal() {
      activeVillagePointIndex = -1;
      activeVillageNpcId = null;
      const panel = document.getElementById('village-point-panel');
      const backdrop = document.getElementById('village-point-backdrop');
      if (panel) panel.classList.add('hidden');
      if (backdrop) backdrop.classList.add('hidden');
    }

    function inspectVillagePoint(index) {
      ensureV6State();
      if (villageWalking) return;
      if (gameState.villageEncounterId) return showToast('Đang có sự kiện làng rồi, xử lý xong hãy khám phá tiếp nhé.', '💬');
      const points = getVillagePointsForZone(gameState.villageZone || 'lane');
      if (!points[index]) return;
      activeVillagePointIndex = index;
      const point = points[index];
      const panel = document.getElementById('village-point-panel');
      const backdrop = document.getElementById('village-point-backdrop');
      const icon = document.getElementById('village-point-icon');
      const title = document.getElementById('village-point-title');
      const desc = document.getElementById('village-point-desc');
      const zone = document.getElementById('village-point-zone');
      const list = document.getElementById('village-point-choice-list');
      if (icon) { icon.classList.remove('v8733-npc-face'); icon.innerText = point.icon || '📍'; }
      if (title) title.innerText = point.title || point.label || 'Điểm tương tác';
      if (desc) desc.innerText = point.desc || 'Một góc nho nhỏ để bạn ghé lại khám phá.';
      if (zone) zone.innerText = `${getVillageZoneConfig().icon || '🗺️'} ${getVillageZoneConfig().name || 'Làng'}`;
      if (list) list.innerHTML = (point.actions || []).map((act, idx) => {
        const hint = idx === 0 ? 'Tương tác nhẹ nhàng, an toàn và phù hợp ghé thử đầu tiên.' : 'Một cách khám phá khác, có thể hên hoặc xui hơn một chút.';
        return `<button onclick="resolveVillagePointAction(${idx})" class="village-choice tap-scale"><span><span class="village-choice-main">${act.label}</span><span class="village-choice-sub">${hint}</span></span></button>`;
      }).join('') + `<button onclick="closeVillagePointModal()" class="village-choice tap-scale"><span><span class="village-choice-main">↩️ Đóng lại</span><span class="village-choice-sub">Quay về bản đồ để khám phá chỗ khác.</span></span></button>`;
      if (panel) panel.classList.remove('hidden');
      if (backdrop) backdrop.classList.remove('hidden');
    }

    function resolveVillagePointAction(actionIndex) {
      const points = getVillagePointsForZone(gameState.villageZone || 'lane');
      const point = points[activeVillagePointIndex];
      const action = point && point.actions ? point.actions[actionIndex] : null;
      if (!point || !action) return closeVillagePointModal();
      const pseudoEncounter = { id:`point_${gameState.villageZone}_${point.id}_${actionIndex}`, icon:point.icon || '📍', title:point.title || point.label || 'Điểm tương tác' };
      const outcome = weightedVillageOutcome(action.outcomes || [{w:1,text:'Không có gì xảy ra.'}]);
      closeVillagePointModal();
      applyVillageOutcome(outcome, pseudoEncounter);
    }

    function renderVillagePoints() {
      // v87.3.4.4: no fixed-location pins. Discoveries remain part of walking and NPC encounters.
      const layer = document.getElementById('village-point-layer');
      if (layer) layer.replaceChildren();
    }


/* ===== V87.5.1: Town errands & night-market daily deals ===== */
const V8751_TOWN_JOBS={
  temple:{icon:'📜',name:'Giải mật thư sử làng',npc:'baMan',energy:4,sub:'Giải câu đố • Nhận EXP và thiện cảm',
    riddles:[
      {clue:'Bà Mẫn muốn cất bút tích cũ để khỏi bị ẩm. Nơi nào hợp lý nhất?',options:['Góc khô thoáng','Bên cửa mưa','Dưới nền ướt'],answer:0},
      {clue:'Đội trống đang diễn tập. Nhạc cụ nào giữ nhịp cho đoàn?',options:['Chổi tre','Trống hội','Đèn lồng'],answer:1},
      {clue:'Tờ sổ cổ bị rách ở gáy. Việc đầu tiên nên làm là gì?',options:['Dán bừa lại','Ngâm nước','Bọc bảo quản'],answer:2}
    ]},
  hill:{icon:'🫐',name:'Săn giỏ sim theo dấu',npc:'chiNhien',energy:6,sub:'Quan sát dấu vết • Thu hoạch nông sản',
    riddles:[
      {clue:'Sim chín tím đậm thường cho vị ngọt nhất. Nên hái ở đâu?',options:['Bụi tím đậm','Bụi quả xanh','Bụi non mới nhú'],answer:0},
      {clue:'Sau mưa, nơi nào giúp tránh làm dập giỏ sim?',options:['Vũng trũng','Lối đất cao','Vạt đất lầy'],answer:1},
      {clue:'Muốn giữ quả hái được tươi lâu, bạn chọn cách nào?',options:['Để ngoài nắng','Dồn ép chặt','Giỏ thoáng mát'],answer:2}
    ]},
  nightmarket:{icon:'⚡',name:'Kèo đêm giá hời',npc:'chiLy',energy:0,sub:'Giá theo tin chợ • Một lượt mua/ngày'},
  district:{icon:'🔧',name:'Kiểm tra máy quán',npc:'anhQuan',energy:5,sub:'Tìm đúng lỗi • Nhận Xu và EXP',
    riddles:[
      {clue:'Máy pha chế chạy nóng, quạt thông gió bị bụi bám. Xử lý nào an toàn?',options:['Ngắt điện vệ sinh','Đổ nước vào máy','Bịt khe thoát gió'],answer:0},
      {clue:'Đơn ship liên tục báo không tới nơi. Đầu tiên nên xem gì?',options:['Tăng giá món','Địa chỉ giao','Đổi màu app'],answer:1},
      {clue:'Máy thanh toán báo pin yếu. Bạn nên?',options:['Để máy tắt','Lắc máy mạnh','Sạc đúng nguồn'],answer:2}
    ]},
  school:{icon:'🎨',name:'Vẽ bảng hội trường',npc:'thayTri',energy:3,sub:'Chọn đúng chủ đề • Tăng danh tiếng Quán',
    riddles:[
      {clue:'Hội trồng cây của trường cần bảng cổ động về điều gì?',options:['Bảo vệ cây xanh','Đua xe tốc độ','Bỏ rác bừa bãi'],answer:0},
      {clue:'Ngày hội đọc sách, hình nào nên làm chủ đạo?',options:['Ổ cắm điện','Cuốn sách mở','Chảo dầu nóng'],answer:1},
      {clue:'Bảng chỉ đường lễ hội cần điểm nổi bật nhất là gì?',options:['Chữ thật nhỏ','Nhiều chữ chồng','Mũi tên rõ ràng'],answer:2}
    ]}
};
SOUVENIR_CONFIG.v8751_town_pass={name:'Sổ Dấu Ấn Thị Trấn',icon:'🎫',rarity:'purple',
 desc:'Kỷ vật duy nhất khi hoàn thành đủ 5 hoạt động tại Nhà Văn Hóa, Đồi Sim, Phố Đèn, Khu Trung Tâm và Trường Thị Trấn.'};
function v8751EnsureTown(){
  if(!gameState.v8751Town||typeof gameState.v8751Town!=='object'||Array.isArray(gameState.v8751Town))
    gameState.v8751Town={};
  const s=gameState.v8751Town;
  if(!s.doneDays||typeof s.doneDays!=='object'||Array.isArray(s.doneDays))s.doneDays={};
  if(!s.stamps||typeof s.stamps!=='object'||Array.isArray(s.stamps))s.stamps={};
  s.awarded=!!s.awarded;
  return s;
}
function v8751TodayJob(zone){
  const cfg=V8751_TOWN_JOBS[zone],day=Math.max(1,Number(gameState.day)||1);
  if(!cfg)return null;
  return cfg.riddles?cfg.riddles[(day-1)%cfg.riddles.length]:null;
}
function v8751NightGoods(){
  const career=gameState.currentCareer||'boba';
  const group={boba:['tea_black','tea_green','topping_boba'],noodle:['broth_kimchi','bowl_m','ntop_beef'],streetfood:['skewer_fish','skewer_beef','sauce_sweet_chili']}[career]||['tea_black','tea_green','topping_boba'];
  return group.map((key,i)=>{
    const market=v8741MarketBuyUnitPrice(key);
    // 1-2 Xu per unit saving on low prices; discounted from CURRENT day market price.
    const unit=Math.max(1,market-Math.max(1,Math.round(market*.12)));
    const qty=[4,3,5][i];
    return {key,market,unit,qty,total:unit*qty,name:ITEM_DICTIONARY[key]?.name||key,icon:ITEM_DICTIONARY[key]?.icon||'📦'};
  });
}
function v8751RenderTown(){
  const card=document.getElementById('v8751-town-card'),body=document.getElementById('v8751-town-body');
  if(!card||!body)return;
  const zone=gameState.villageZone||'lane',cfg=V8751_TOWN_JOBS[zone];
  if(!cfg){card.hidden=true;return;}
  card.hidden=false;
  const state=v8751EnsureTown(),done=Number(state.doneDays[zone])===Number(gameState.day);
  const stampCount=Object.keys(V8751_TOWN_JOBS).filter(z=>state.stamps[z]).length;
  document.getElementById('v8751-town-icon').textContent=cfg.icon;
  document.getElementById('v8751-town-title').textContent=cfg.name;
  document.getElementById('v8751-town-sub').textContent=cfg.sub;
  document.getElementById('v8751-town-status').textContent=done?'✓ Hôm nay xong':`🎫 ${stampCount}/5`;
  if(done){body.innerHTML='<div class="v8751-done">✅ Đã hoàn thành hôm nay. Qua ngày mới để chơi tiếp.</div><div class="v8751-footer">Dấu ấn được ghi lại trong Sổ lưu niệm. Mỗi khu chỉ chơi một lượt/ngày.</div>';return;}
  if(zone==='nightmarket'){
    const offers=v8751NightGoods();
    body.innerHTML=`<p class="v8751-clue">🏮 Chị Ly mở một đợt xả kho. Mỗi ngày chỉ mua được <b>1 gói</b>; giá thay đổi theo biến cố và ưu đãi Chợ.</p><div class="v8751-options">${offers.map((o,i)=>{
      const unlocked=isItemStoryUnlocked(o.key,gameState.currentCareer);
      return `<button type="button" onclick="v8751PlayTown(${i})" ${!unlocked||gameState.coins<o.total?'disabled':''} title="${o.name}: ${o.qty} món • Chợ ${o.market} Xu/món">${o.icon} ${o.name}<br>${o.qty} × ${o.unit} Xu<br><b>${o.total} Xu</b>${!unlocked?'<br>🔒 Chưa mở':''}</button>`;
    }).join('')}</div><div class="v8751-footer">🛒 Giá từng món từ ${offers[0].market} Xu tại Chợ hôm nay • thanh toán và vào Kho ngay • không dùng để mở khóa công thức sớm.</div>`;
    return;
  }
  const r=v8751TodayJob(zone),energy=Number(gameState.villageEnergy)||0;
  body.innerHTML=`<p class="v8751-clue">${r.clue}</p><div class="v8751-options">${r.options.map((txt,i)=>
    `<button type="button" onclick="v8751PlayTown(${i})" ${energy<cfg.energy?'disabled':''}>${i+1}. ${txt}</button>`).join('')}</div><div class="v8751-footer">⚡ Tốn ${cfg.energy} năng lượng • Đáp án đúng nhận phần thưởng và 1 dấu ấn. ${energy<cfg.energy?'⚠️ Chưa đủ năng lượng.':''}</div>`;
}
function v8751PlayTown(choice){
  const zone=gameState.villageZone||'lane',cfg=V8751_TOWN_JOBS[zone];
  if(!cfg||!Number.isInteger(choice)||choice<0||choice>2)return false;
  ensureV6State();
  const st=v8751EnsureTown(),day=Number(gameState.day)||1;
  if(Number(st.doneDays[zone])===day){showToast('Hoạt động hôm nay đã xong!','🕒');return false;}
  if(gameState.phase==='open'){showToast('Hãy nghỉ bán trước khi đi làm việc Làng.','🏪');return false;}
  if(zone==='nightmarket'){
    const o=v8751NightGoods()[choice];
    if(!o||!isItemStoryUnlocked(o.key,gameState.currentCareer)){
      showToast('Nguyên liệu này chưa được mở khóa.','🔒');return false;
    }
    if((Number(gameState.coins)||0)<o.total){showToast('Chưa đủ Xu để mua gói này.','🪙');return false;}
    // One purchase = one daily ticket, prevent double clicks & unearned item grants.
    st.doneDays[zone]=day;
    gameState.coins-=o.total;
    gameState.inventory[o.key]=(Number(gameState.inventory[o.key])||0)+o.qty;
    v8751RewardStamp(zone);
    v8751Record(zone,`${o.name} x${o.qty} • ${o.total} Xu theo giá ngày ${day}`);
    showToast(`🏮 Đã mua ${o.qty} ${o.name} giá ${o.total} Xu!`,'🛍️');
  }else{
    if((Number(gameState.villageEnergy)||0)<cfg.energy){showToast('Chưa đủ năng lượng.','⚡');return false;}
    const r=v8751TodayJob(zone),good=choice===r.answer;
    st.doneDays[zone]=day;
    gameState.villageEnergy=Math.max(0,(Number(gameState.villageEnergy)||0)-cfg.energy);
    let msg='';
    if(good){
      if(zone==='temple'){gameState.villageKarma=Math.min(100,(Number(gameState.villageKarma)||0)+3);addExp(14);msg='+14 EXP, +3 thiện cảm Làng';}
      if(zone==='hill'){const count=2+(day%2);gameState.inventory.crop_sim=(Number(gameState.inventory.crop_sim)||0)+count;addExp(9);msg=`+${count} Sim Rừng, +9 EXP`;}
      if(zone==='district'){gameState.coins=(Number(gameState.coins)||0)+45;addExp(12);msg='+45 Xu, +12 EXP';}
      if(zone==='school'){gameState.reputation=Math.min(5,Math.max(1,Number(gameState.reputation)||1)+.04);addExp(12);msg='+0.04 sao danh tiếng Quán, +12 EXP';}
      // NPC connection matters, without requiring today's random NPC attendance.
      const met=!!v8732Ensure().village[cfg.npc];
      if(met&&v872Relation(cfg.npc).trust>=65){addExp(3);msg+=' • +3 EXP nhờ người quen';}
      v8753Ensure();
      v8751RewardStamp(zone);
      v8753AddRep(zone,8,'Việc tốt trong khu');
    }else{addExp(3);msg='Chưa đúng, nhận +3 EXP kinh nghiệm. Mai thử lại!';}
    v8751Record(zone,`${good?'Thành công':'Thử chưa đạt'} • ${msg}`);
    showToast(msg,good?'🏆':'📘');
  }
  updateHeaderStats();
  renderVillageUI();
  saveGameToStorage(false);
  playSound('coin');
  return true;
}
function v8751Record(zone,text){
  if(!Array.isArray(gameState.villageHistory))gameState.villageHistory=[];
  gameState.villageHistory.unshift({id:Date.now(),day:gameState.day,icon:V8751_TOWN_JOBS[zone].icon,
    title:V8751_TOWN_JOBS[zone].name,text,zone:VILLAGE_ZONES[zone]?.name||zone});
  gameState.villageHistory=gameState.villageHistory.slice(0,12);
}
function v8751RewardStamp(zone){
  const st=v8751EnsureTown();st.stamps[zone]=true;
  if(st.awarded||Object.keys(V8751_TOWN_JOBS).some(z=>!st.stamps[z]))return;
  st.awarded=true;
  gameState.coins=(Number(gameState.coins)||0)+350;
  st.v87521RewardBalanced=true;
  addSouvenir('v8751_town_pass','Hoàn thành đủ 5 hoạt động ở 5 khu');
  addExp(35);
  pushGameNotification('🎫 Sổ Dấu Ấn Thị Trấn','Bạn đã trải nghiệm đủ 5 khu! Nhận 350 Xu, 35 EXP và kỷ vật độc quyền.','🎉','purple');
}



/* V87.5.2.1: one-off difference payment for previously completed festivals/stamp.
   Awards earned after the patch are marked at the original grant site. */
function v87521MigrateCompletedAwards(){
  if(!gameState || typeof gameState!=='object')return 0;
  let compensation=0;
  const previous={spring:48,heritage:112,lights:205};
  const events=gameState.v8752Festivals?.events;
  if(events && typeof events==='object'){
    for(const [id,oldValue] of Object.entries(previous)){
      const status=events[id];
      if(status && status.rewarded===true && status.v87521RewardBalanced!==true){
        status.v87521RewardBalanced=true;
        compensation+=Math.max(0,(Number(V8752_FESTIVALS[id]?.coins)||0)-oldValue);
      }
    }
  }
  const town=gameState.v8751Town;
  if(town && town.awarded===true && town.v87521RewardBalanced!==true){
    town.v87521RewardBalanced=true;
    compensation+=350-85;
  }
  if(compensation>0){
    gameState.coins=(Number(gameState.coins)||0)+compensation;
    gameState.v87521LastCompensation={amount:compensation,day:Number(gameState.day)||1};
  }
  return compensation;
}


/* ===== V87.5.3 • Danh vọng từng khu, hợp đồng thị trấn ===== */
const V8753_MILESTONES=[0,30,70,125];
const V8753_LABELS=['Khách Lạ','Người Quen','Đáng Tin','Người Một Nhà'];
let v8753ShowAll=false;
Object.entries(VILLAGE_ZONES).forEach(([zone,z])=>{
  SOUVENIR_CONFIG['v8753_badge_'+zone]={name:'Huy Hiệu '+z.name,icon:'🏅',rarity:'purple',
    desc:'Được người dân '+z.name+' công nhận là Người Một Nhà (125 danh vọng). Kỷ niệm độc quyền không cộng chỉ số.'};
});
function v8753Ensure(){
  if(!gameState.v8753Rep||typeof gameState.v8753Rep!=='object'||Array.isArray(gameState.v8753Rep))gameState.v8753Rep={};
  const s=gameState.v8753Rep;
  if(!s.zones||typeof s.zones!=='object'||Array.isArray(s.zones))s.zones={};
  if(!s.contractDays||typeof s.contractDays!=='object'||Array.isArray(s.contractDays))s.contractDays={};
  if(!s.claimed||typeof s.claimed!=='object'||Array.isArray(s.claimed))s.claimed={};
  if(!s.daily||typeof s.daily!=='object'||Array.isArray(s.daily))s.daily={};
  if(!s.legacySeeded){
    // Save migration: preserve achievements through current chapter progress and festivals.
    for(const [npcId,npc] of Object.entries(VILLAGE_NPC_LIBRARY)){
      const zone=npc.home;
      if(!VILLAGE_ZONES[zone])continue;
      const chapters=Number(gameState.villageStoryFlags?.['v84_'+npcId+'_stage'])||0;
      s.zones[zone]=(Number(s.zones[zone])||0)+Math.max(0,chapters)*5;
    }
    for(const cfg of Object.values(V8752_FESTIVALS)){
      const record=gameState.v8752Festivals?.events?.[Object.keys(V8752_FESTIVALS).find(k=>V8752_FESTIVALS[k]===cfg)];
      const stages=Math.max(0,Math.min(3,Number(record?.stage)||0));
      for(let i=0;i<stages;i++)s.zones[cfg.steps[i].zone]=(Number(s.zones[cfg.steps[i].zone])||0)+12;
    }
    for(const zone of Object.keys(V8751_TOWN_JOBS))if(gameState.v8751Town?.stamps?.[zone])s.zones[zone]=(Number(s.zones[zone])||0)+8;
    s.legacySeeded=true;
  }
  for(const zone of Object.keys(VILLAGE_ZONES)){
    s.zones[zone]=Math.max(0,Math.min(160,Math.floor(Number(s.zones[zone])||0)));
  }
  return s;
}
function v8753Rank(zone){
  const score=v8753Ensure().zones[zone]||0;
  return score>=125?3:score>=70?2:score>=30?1:0;
}
function v8753MaybeBadge(zone){
  const s=v8753Ensure();
  if(!VILLAGE_ZONES[zone]||s.zones[zone]<125||s.claimed[zone])return false;
  s.claimed[zone]=true;
  const badgeId='v8753_badge_'+zone;
  if((Number(gameState.souvenirs?.[badgeId])||0)===0){
    addSouvenir(badgeId,'Người Một Nhà tại '+VILLAGE_ZONES[zone].name);
    gameState.coins=(Number(gameState.coins)||0)+1200;
    addExp(55);
  }
  if(typeof pushGameNotification==='function')pushGameNotification('🏅 Danh vọng tối đa',
    'Người Một Nhà tại '+VILLAGE_ZONES[zone].name+'! +1.200 Xu, 55 EXP và huy hiệu độc quyền.','🏆','purple');
  return true;
}
function v8753AddRep(zone,points,reason){
  if(!VILLAGE_ZONES[zone]||!Number.isFinite(points)||points===0)return 0;
  const s=v8753Ensure(),was=s.zones[zone],before=v8753Rank(zone);
  s.zones[zone]=Math.max(0,Math.min(160,was+Math.trunc(points)));
  const actual=s.zones[zone]-was;
  const after=v8753Rank(zone);
  if(after>=2&&before<2&&typeof showToast==='function')showToast('🤝 '+VILLAGE_ZONES[zone].name+': mở hợp đồng cung ứng!','🏅');
  v8753MaybeBadge(zone);
  if(document.getElementById('v8753-rep-card')?.open)v8753Render();
  return actual;
}
function v8753OnOrder(stars,accepted){
  if(!accepted||stars<4)return false;
  const s=v8753Ensure(),day=Math.floor(Number(gameState.day)||1);
  if(Number(s.daily.day)!==day){s.daily={day,goodOrders:0};}
  if((Number(s.daily.goodOrders)||0)>=6)return false;
  s.daily.goodOrders=(Number(s.daily.goodOrders)||0)+1;
  v8753AddRep('lane',1,'Đơn hàng đạt 4 sao');
  return true;
}
function v8753ContractSpec(zone){
  if(!VILLAGE_ZONES[zone])return null;
  const career=gameState.currentCareer||'boba',zones=Object.keys(VILLAGE_ZONES),index=zones.indexOf(zone);
  const pools={
    boba:['tea_black','tea_green','topping_boba','cup_m'],
    noodle:['broth_kimchi','bowl_m','ntop_beef'],
    streetfood:['skewer_fish','skewer_beef','sauce_sweet_chili']
  };
  let key=null;
  if(zone==='hill')key='crop_sim';
  else{
    const goods=pools[career]||pools.boba;
    for(let k=0;k<goods.length;k++){
      const candidate=goods[(index+k)%goods.length];
      if(isItemStoryUnlocked(candidate,career)){key=candidate;break;}
    }
  }
  if(!key||!ITEM_DICTIONARY[key])return null;
  const qty=zone==='hill'?2:4;
  const market=Math.max(1,getCurrentMarketUnitPrice(key));
  const cost=market*qty;
  // Payment changes with market news. Do not use online flash-sale fixed list prices.
  const bonus=zone==='hill'?290:180;
  const payout=Math.max(1,Math.round(cost*1.22)+bonus);
  return {key,qty,market,payout,name:ITEM_DICTIONARY[key].name,icon:ITEM_DICTIONARY[key].icon||'📦'};
}
function v8753DeliverContract(){
  ensureV6State();
  const zone=gameState.villageZone||'lane',s=v8753Ensure(),day=Math.floor(Number(gameState.day)||1);
  if(v8753Rank(zone)<2)return false;
  if(gameState.phase==='open'){showToast('Hãy nghỉ ca trước khi giao hợp đồng.','🏪');return false;}
  if(Number(s.contractDays[zone])===day){showToast('Hợp đồng khu này hôm nay đã xong.','📦');return false;}
  const c=v8753ContractSpec(zone);
  if(!c){showToast('Hợp đồng chưa có mặt hàng phù hợp nghề hiện tại.','🔒');return false;}
  const owned=Number(gameState.inventory?.[c.key])||0;
  if(owned<c.qty){showToast('Kho cần '+c.qty+' '+c.name+' (đang có '+owned+').','📦');return false;}
  s.contractDays[zone]=day; // Claim the one daily slot before awarding; prevents double-click farming.
  gameState.inventory[c.key]=owned-c.qty;
  gameState.coins=(Number(gameState.coins)||0)+c.payout;
  addExp(18);
  v8753AddRep(zone,5,'Hoàn thành hợp đồng');
  if(!Array.isArray(gameState.villageHistory))gameState.villageHistory=[];
  gameState.villageHistory.unshift({id:Date.now(),day,icon:'📦',title:'Hợp đồng '+VILLAGE_ZONES[zone].name,
    text:'Giao '+c.qty+' '+c.name+', nhận '+c.payout+' Xu, 18 EXP, +5 danh vọng.',zone:VILLAGE_ZONES[zone].name});
  gameState.villageHistory=gameState.villageHistory.slice(0,12);
  showToast('📦 Hợp đồng hoàn thành! +'+c.payout+' Xu, +18 EXP.','🏅');
  updateHeaderStats();renderVillageUI();saveGameToStorage(false);
  return true;
}
function v8753ToggleAll(){v8753ShowAll=!v8753ShowAll;v8753Render();}
function v8753Render(){
  const card=document.getElementById('v8753-rep-card'),body=document.getElementById('v8753-body');
  if(!card||!body)return;
  const s=v8753Ensure(),zone=gameState.villageZone||'lane',z=VILLAGE_ZONES[zone]||VILLAGE_ZONES.lane;
  const score=s.zones[zone]||0,rank=v8753Rank(zone),next=V8753_MILESTONES[rank+1]||160;
  const total=Object.keys(VILLAGE_ZONES).filter(k=>v8753Rank(k)>=2).length;
  document.getElementById('v8753-count').textContent=`🤝 ${total}/11`;
  document.getElementById('v8753-sub').textContent=`${z.icon} ${z.name} • ${score}/160 • ${V8753_LABELS[rank]}`;
  if(!card.open)return;
  const spec=v8753ContractSpec(zone),today=(Number(s.contractDays[zone])===Number(gameState.day));
  const contract=rank<2?
    `<div class="v8753-quest"><div>🔒 <b>Hợp đồng địa phương</b><br>Đạt 70 danh vọng để người dân tin tưởng giao hàng.</div></div>`:
    spec?`<div class="v8753-quest"><div>📦 <b>Hợp đồng ${z.name}</b> • 1 lần/ngày<br>${spec.icon} ${spec.name} ×${spec.qty} • ${spec.market} Xu/món theo tin chợ<br><b>Nhận ${spec.payout} Xu + 18 EXP + 5 danh vọng</b><br>Kho: ${Number(gameState.inventory?.[spec.key])||0}/${spec.qty}</div><button type="button" onclick="v8753DeliverContract()" ${today||gameState.phase==='open'||(Number(gameState.inventory?.[spec.key])||0)<spec.qty?'disabled':''}>${today?'Đã giao':gameState.phase==='open'?'Nghỉ ca':(Number(gameState.inventory?.[spec.key])||0)<spec.qty?'Thiếu hàng':'Giao hàng'}</button></div>`:
    '<div class="v8753-quest">Chưa có hợp đồng phù hợp với nghề này.</div>';
  const all=v8753ShowAll?`<div class="v8753-grid">${Object.entries(VILLAGE_ZONES).map(([id,c])=>
    `<div class="v8753-zone ${zone===id?'current':''}" title="${c.name}: ${s.zones[id]||0}/160"><b>${c.icon} ${c.name}</b><small>${s.zones[id]||0} điểm • ${V8753_LABELS[v8753Rank(id)]}</small></div>`).join('')}</div>`:'';
  body.innerHTML=`<div class="v8753-head"><b>${z.icon} ${z.name}</b><span>${score}/160 • ${V8753_LABELS[rank]}</span></div><div class="v8753-meter"><i style="width:${Math.round(score/160*100)}%"></i></div>`+
    `<p class="v8753-footnote">${rank===3?'🏅 Bạn đã là Người Một Nhà!':`Mốc tiếp theo: ${next} điểm.`} Giúp NPC (+5), hoạt động khu (+8), lễ hội (+12), hợp đồng (+5). Đơn Quán đạt 4★: +1 tại Phố Nhỏ (tối đa 6/ngày).</p>`+
    contract+`<div class="v8753-head" style="margin-top:7px"><span>🏆 125 điểm: huy hiệu + 1.200 Xu + 55 EXP (một lần)</span><button class="v8753-all-btn" type="button" onclick="v8753ToggleAll()">${v8753ShowAll?'Thu gọn':'11 khu ▾'}</button></div>`+all;
}

/* ===== V87.5.2: 3 multi-day, multi-zone festivals ===== */
const V8752_FESTIVALS={
  spring:{name:'Hội Sắc Màu Quê',icon:'🌸',level:4,stage:1,
    reward:'v8752_spring_ribbon',coins:500,exp:24,desc:'Thầy Trí, Cô Sáu và Chị Nhài cùng tổ chức ngày hội đầu mùa.',
    steps:[
      {zone:'school',npc:'thayTri',who:'Thầy Trí',title:'Vẽ biển chỉ đường',energy:4,
       text:'Thầy Trí nhờ bạn hoàn thiện tấm bảng đón khách của hội làng. Điều gì quan trọng nhất?',options:['Chữ nhỏ, nhiều họa tiết','Mũi tên rõ, dễ đọc','Không ghi tên sự kiện'],answer:1},
      {zone:'market',npc:'coSau',who:'Cô Sáu',title:'Giỏ quà phiên chợ',energy:5,
       text:'Cô Sáu đang xếp rau củ và nguyên liệu cho gian hàng. Cách nào giúp đồ tươi lâu?',options:['Che nắng, xếp thoáng','Để sát bếp nóng','Nhồi đầy giỏ ướt'],answer:0},
      {zone:'lane',npc:'chiNhai',who:'Chị Nhài',title:'Quầy bánh khai hội',energy:4,
       text:'Chị Nhài vừa nướng bánh cho khách. Bạn nên đưa khay nào ra trước?',options:['Bánh còn sống','Bánh để qua nhiều ngày','Bánh chín đều, còn ấm'],answer:2}
    ]},
  heritage:{name:'Hội Ký Ức Thị Trấn',icon:'📜',level:10,stage:3,
    reward:'v8752_heritage_badge',coins:2300,exp:43,desc:'Bà Mẫn, Cô Tuyết và Bác sĩ An góp sức giữ ký ức thị trấn.',
    steps:[
      {zone:'temple',npc:'baMan',who:'Bà Mẫn',title:'Sắp xếp tư liệu xưa',energy:6,
       text:'Bà Mẫn tìm được nhiều lá thư cũ, nhưng giấy rất giòn. Bạn giúp bà theo cách nào?',options:['Phơi giữa nắng gắt','Bọc khô và phân loại','Nhúng nước cho phẳng'],answer:1},
      {zone:'busstop',npc:'coTuyet',who:'Cô Tuyết',title:'Đón khách phương xa',energy:6,
       text:'Cô Tuyết có hai tấm vé và danh sách khách mời lễ hội. Đầu tiên cần làm gì?',options:['Đối chiếu tên và ngày','Xé vé làm dấu','Phát vé ngẫu nhiên'],answer:0},
      {zone:'clinic',npc:'bacSiAn',who:'Bác sĩ An',title:'Trạm hỗ trợ lễ hội',energy:7,
       text:'Trước khi khai hội, bác sĩ muốn kiểm tra trạm hỗ trợ. Chọn việc ưu tiên?',options:['Cất hộp sơ cứu đi','Tắt hết nước uống','Kiểm kê thuốc và nước'],answer:2}
    ]},
  lights:{name:'Mùa Sim & Phố Đèn',icon:'🏮',level:20,stage:5,
    reward:'v8752_sim_lantern',coins:7500,exp:72,desc:'Chị Nhiên, Anh Quân và Chị Ly liên kết ba khu mở hội lớn.',
    steps:[
      {zone:'hill',npc:'chiNhien',who:'Chị Nhiên',title:'Chuẩn bị đặc sản sim',energy:8,
       text:'Sim vừa hái về sẽ được mang xuống hội chợ. Cách bảo quản nào đúng?',options:['Giỏ thoáng, giữ mát','Đè ép dưới đá','Ủ sát bếp than'],answer:0},
      {zone:'district',npc:'anhQuan',who:'Anh Quân',title:'Kiểm tra đèn lễ hội',energy:8,
       text:'Một dãy đèn chập chờn ở trung tâm. Anh Quân cần bạn hỗ trợ việc nào?',options:['Sờ dây đang hở','Ngắt điện, kiểm tra dây','Đổ nước vào ổ điện'],answer:1},
      {zone:'nightmarket',npc:'chiLy',who:'Chị Ly',title:'Khai mạc gian hàng đêm',energy:9,
       text:'Khách đến đông ở Phố Đèn. Chị Ly muốn bạn bố trí quầy sao cho an toàn.',options:['Đặt than cạnh giấy','Che kín lối thoát','Tách bếp nóng và lối đi'],answer:2}
    ]}
};
SOUVENIR_CONFIG.v8752_spring_ribbon={name:'Dải Lụa Khai Hội',icon:'🌸',rarity:'blue',desc:'Hoàn thành Hội Sắc Màu Quê. Vườn phát triển nhanh hơn 2%.',bonus:{farmGrowthPct:2}};
SOUVENIR_CONFIG.v8752_heritage_badge={name:'Huy Hiệu Giữ Ký Ức',icon:'📜',rarity:'purple',desc:'Hoàn thành Hội Ký Ức Thị Trấn. Chuồng phát triển nhanh hơn 2%.',bonus:{barnGrowthPct:2}};
SOUVENIR_CONFIG.v8752_sim_lantern={name:'Đèn Sim Hội Làng',icon:'🏮',rarity:'gold',desc:'Hoàn thành Mùa Sim & Phố Đèn. Thêm 2% cơ hội giữ hạt giống và thức ăn.',bonus:{seedSavePct:2,feedSavePct:2}};
let v8752Selected='spring';
function v8752Ensure(){
  if(!gameState.v8752Festivals||typeof gameState.v8752Festivals!=='object'||Array.isArray(gameState.v8752Festivals))gameState.v8752Festivals={};
  const root=gameState.v8752Festivals;
  if(!root.events||typeof root.events!=='object'||Array.isArray(root.events))root.events={};
  for(const id of Object.keys(V8752_FESTIVALS)){
    if(!root.events[id]||typeof root.events[id]!=='object'||Array.isArray(root.events[id]))root.events[id]={};
    const e=root.events[id];
    e.stage=Math.max(0,Math.min(3,Math.floor(Number(e.stage)||0)));
    e.lastDay=Math.max(0,Math.floor(Number(e.lastDay)||0));
    e.lastAttempt=Math.max(0,Math.floor(Number(e.lastAttempt)||0));
    e.shopDay=Math.max(0,Math.floor(Number(e.shopDay)||0));
    e.rewarded=!!e.rewarded;
    if(e.rewarded)e.stage=3;
  }
  return root;
}
function v8752CanStart(id){
  const cfg=V8752_FESTIVALS[id];
  return !!cfg && (Number(gameState.level)||1)>=cfg.level && (Number(gameState.shopStage)||0)>=cfg.stage;
}
function v8752Select(id){if(!V8752_FESTIVALS[id])return;v8752Selected=id;v8752Render();}
function v8752FestivalMarketOffer(id){
  const career=gameState.currentCareer||'boba';
  const goods={boba:['tea_black','topping_boba','tea_green'],noodle:['broth_kimchi','bowl_m','ntop_beef'],streetfood:['skewer_fish','skewer_beef','sauce_sweet_chili']}[career]||['tea_black','topping_boba','tea_green'];
  const index=Object.keys(V8752_FESTIVALS).indexOf(id),key=goods[Math.max(0,index)];
  const qty=[4,5,6][Math.max(0,index)],market=v8741MarketBuyUnitPrice(key);
  const original=Math.max(1,market)*qty;
  const total=Math.max(1,original-Math.max(1,Math.round(original*.11)));
  return {key,qty,market,original,total,name:ITEM_DICTIONARY[key]?.name||key,icon:ITEM_DICTIONARY[key]?.icon||'📦'};
}
function v8752Render(){
  const card=document.getElementById('v8752-festival-card'),body=document.getElementById('v8752-festival-body');
  if(!card||!body)return;
  v8752Ensure();
  const id=V8752_FESTIVALS[v8752Selected]?v8752Selected:'spring';
  const cfg=V8752_FESTIVALS[id],st=gameState.v8752Festivals.events[id];
  const day=Math.max(1,Number(gameState.day)||1),zone=gameState.villageZone||'lane',done=st.stage>=3;
  const total=Object.values(gameState.v8752Festivals.events).filter(x=>x.stage>=3).length;
  document.getElementById('v8752-festival-title').textContent='Sự Kiện Liên Khu & Lễ Hội';
  document.getElementById('v8752-festival-sub').textContent=`${cfg.icon} ${cfg.name} • ${done?'Đã hoàn thành':`chặng ${st.stage+1}/3 • +${cfg.coins} Xu`}`;
  document.getElementById('v8752-festival-pill').textContent=`🏆 ${total}/3`;
  if(!card.open)return;
  const tabs=`<div class="v8752-tabs">${Object.entries(V8752_FESTIVALS).map(([key,c])=>{
    const x=gameState.v8752Festivals.events[key];return `<button type="button" class="${id===key?'active':''}" onclick="v8752Select('${key}')">${c.icon} ${c.name.replace(' Thị Trấn','').replace(' Quê','')}<br>${x.stage>=3?'✓ Xong':`${x.stage}/3 chặng`}</button>`;
  }).join('')}</div>`;
  const progress=`<div class="v8752-progress" aria-label="Đã hoàn thành ${st.stage} trong 3 chặng">${[0,1,2].map(i=>`<span class="${i<st.stage?'done':''}"></span>`).join('')}</div>`;
  if(!v8752CanStart(id)){
    body.innerHTML=tabs+progress+`<div class="v8752-copy">🔒 ${cfg.desc}<br>Cần <b>Lv.${cfg.level}</b> và <b>Bậc Quán ${cfg.stage+1}</b> để mở. Không thể vượt cấp bằng cách mua đồ trên Soppi.</div>`;
    return;
  }
  const reminder=`<div class="v8752-muted">🎭 NPC tham gia dẫn chuyện; không cần đợi NPC ngẫu nhiên xuất hiện. Mỗi ngày tối đa 1 lượt/chặng; chọn sai có thể thử lại ngày sau. Quà hoàn tất chỉ nhận một lần.</div>`;
  if(done){
    const offer=v8752FestivalMarketOffer(id),end=cfg.steps[2].zone;
    const inPlace=zone===end,unlocked=isItemStoryUnlocked(offer.key,gameState.currentCareer),shopDone=Number(st.shopDay)===day;
    body.innerHTML=tabs+progress+`<div class="v8752-copy">🏅 <b>${cfg.name}</b> đã hoàn thành! Kỷ vật có hiệu ứng đã vào Kho. Mở quầy đổi quà ngày thường tại <b>${VILLAGE_ZONES[end].name}</b>.</div>`+
      (inPlace?`<div class="v8752-shop"><span>🎟️ <b>Quầy hội: ${offer.icon} ${offer.name}</b><br>${offer.qty} món • Chợ ${offer.original} Xu → <b>${offer.total} Xu</b></span><button type="button" class="v8752-shop-btn" onclick="v8752BuyFestival('${id}')" ${shopDone||!unlocked||gameState.coins<offer.total?'disabled':''}>${shopDone?'Đã mua':!unlocked?'🔒 Khóa':'Mua gói'}</button></div>`:
       `<button class="v8752-go" onclick="setVillageZone('${end}')">📍 Đến ${VILLAGE_ZONES[end].name} mở quầy đổi quà →</button>`)+reminder;
    return;
  }
  const step=cfg.steps[st.stage],canToday=(st.lastAttempt!==day && st.lastDay<day);
  const place=VILLAGE_ZONES[step.zone];
  const head=`<div class="v8752-copy">${cfg.desc}<br>🏆 <b>Giải hoàn thành: ${cfg.coins} Xu + ${cfg.exp} EXP + kỷ vật</b><br>📍 <b>${step.title}</b> — ${step.who} • ${place.name} • ⚡ ${step.energy}<br>${step.text}</div>`;
  let controls='';
  if(zone!==step.zone){
    controls=`<button class="v8752-go" type="button" onclick="setVillageZone('${step.zone}')">📍 Đến ${place.name} tiếp tục hành trình →</button>`;
  }else if(!canToday){
    controls=`<div class="v8752-copy">🌙 Đã tham gia hôm nay. Qua ngày mới để tiếp tục chặng này.</div>`;
  }else if(gameState.phase==='open'){
    controls=`<div class="v8752-copy">🏪 Đang mở Quán. Hãy nghỉ ca trước khi tham gia lễ hội.</div>`;
  }else{
    controls=`<div class="v8752-options">${step.options.map((option,i)=>`<button type="button" onclick="v8752Play('${id}',${i})" ${(Number(gameState.villageEnergy)||0)<step.energy?'disabled':''}>${i+1}. ${option}</button>`).join('')}</div>`;
    if((Number(gameState.villageEnergy)||0)<step.energy)controls+='<div class="v8752-muted">⚡ Chưa đủ năng lượng; nghỉ ngơi hoặc chờ hồi phục để tham gia.</div>';
  }
  body.innerHTML=tabs+progress+head+controls+reminder;
}
function v8752Play(id,choice){
  if(!V8752_FESTIVALS[id]||!Number.isInteger(choice)||choice<0||choice>2)return false;
  ensureV6State();v8752Ensure();
  const cfg=V8752_FESTIVALS[id],st=gameState.v8752Festivals.events[id];
  if(!v8752CanStart(id)||st.stage>=3)return false;
  const stage=st.stage,step=cfg.steps[stage],day=Math.max(1,Number(gameState.day)||1);
  if(gameState.phase==='open'){showToast('Hãy nghỉ ca trước khi đi hội.','🏪');return false;}
  if((gameState.villageZone||'lane')!==step.zone||!isVillageZoneUnlocked(VILLAGE_ZONES[step.zone]))return false;
  if(st.lastAttempt===day || st.lastDay>=day){showToast('Mỗi ngày chỉ tham gia một chặng!','🌙');return false;}
  if((Number(gameState.villageEnergy)||0)<step.energy){showToast('Chưa đủ năng lượng tham gia lễ hội.','⚡');return false;}
  st.lastAttempt=day;
  gameState.villageEnergy=Math.max(0,Number(gameState.villageEnergy)-step.energy);
  let msg='';
  if(choice===step.answer){
    v8753Ensure(); // Seed earlier achievements before completing this stage.
    st.stage=stage+1;st.lastDay=day;
    v8753AddRep(step.zone,12,'Lễ hội liên khu');
    let bonus=0;
    if(v8732Ensure().village[step.npc] && v872Relation(step.npc).trust>=60)bonus=4;
    addExp(9+bonus);
    msg=`🎉 ${step.who} cảm ơn bạn! Chặng ${st.stage}/3 hoàn thành, +${9+bonus} EXP.`;
    if(st.stage>=3&&!st.rewarded){
      st.rewarded=true;
      st.v87521RewardBalanced=true;
      const owned=(Number(gameState.souvenirs?.[cfg.reward])||0)>0;
      if(!owned){gameState.coins=(Number(gameState.coins)||0)+cfg.coins;addExp(cfg.exp);addSouvenir(cfg.reward,`${cfg.name} hoàn thành`);}
      pushGameNotification('🏮 Khai hội thành công',`${cfg.name} đã hoàn thành! ${owned?'Bạn đã có kỷ vật này.':`+${cfg.coins} Xu, +${cfg.exp} EXP và kỷ vật.`} Quầy đổi quà đã mở.`,cfg.icon,'purple');
      msg+=` 🏆 ${cfg.name} đã hoàn thành!`;
    }
  }else{
    addExp(2);msg=`📒 ${step.who} góp ý để bạn làm tốt hơn. +2 EXP; mai thử lại chặng này.`;
  }
  if(!Array.isArray(gameState.villageHistory))gameState.villageHistory=[];
  gameState.villageHistory.unshift({id:Date.now(),day,icon:cfg.icon,title:`${cfg.name}: ${step.title}`,text:msg,zone:VILLAGE_ZONES[step.zone].name});
  gameState.villageHistory=gameState.villageHistory.slice(0,12);
  showToast(msg,choice===step.answer?'🎉':'📒');
  updateHeaderStats();renderVillageUI();saveGameToStorage(false);
  return true;
}
function v8752BuyFestival(id){
  if(!V8752_FESTIVALS[id])return false;
  ensureV6State();v8752Ensure();
  const cfg=V8752_FESTIVALS[id],st=gameState.v8752Festivals.events[id],day=Number(gameState.day)||1;
  if(st.stage<3||!st.rewarded||!v8752CanStart(id)||gameState.villageZone!==cfg.steps[2].zone)return false;
  if(gameState.phase==='open'){showToast('Hãy nghỉ ca trước khi mua quà hội.','🏪');return false;}
  if(st.shopDay===day){showToast('Quầy hội hôm nay hết lượt.','🎫');return false;}
  const o=v8752FestivalMarketOffer(id);
  if(!isItemStoryUnlocked(o.key,gameState.currentCareer)){showToast('Nguyên liệu này chưa mở khóa.','🔒');return false;}
  if((Number(gameState.coins)||0)<o.total){showToast('Không đủ Xu mua gói hội.','🪙');return false;}
  st.shopDay=day;gameState.coins-=o.total;
  gameState.inventory[o.key]=(Number(gameState.inventory[o.key])||0)+o.qty;
  showToast(`🎁 Nhận ${o.qty} ${o.name}, giá hội ${o.total} Xu!`,'🏮');
  updateHeaderStats();renderVillageUI();saveGameToStorage(false);
  return true;
}

    function renderVillageUI() {
      ensureV6State();
      tickVillageEnergyRegen();
      renderVillageChibi();
      resetVillageNpcState(false);
      layoutVillageActors();
      renderVillagePoints();
      renderVillageNpcs();
      ensureVillageNpcMotion();

      const energy = Math.max(0, Math.min(100, Number(gameState.villageEnergy) || 0));
      const eText = document.getElementById('village-energy-text');
      const eBar = document.getElementById('village-energy-bar');
      const karmaText = document.getElementById('village-karma-text');
      const tripText = document.getElementById('village-trip-count');
      if (eText) eText.innerText = energy;
      if (eBar) eBar.style.width = `${energy}%`;
      if (karmaText) karmaText.innerText = Math.round(gameState.villageKarma || 0);
      if (tripText) tripText.innerText = gameState.villageTripsToday || 0;
      const regenText = document.getElementById('village-energy-regen');
      if (regenText) regenText.innerText = `+1/${getVillageRegenSeconds()}s`;
      const energyMeta = document.getElementById('village-energy-meta');
      if (energyMeta) energyMeta.innerText = `🤝 ${Math.round(gameState.villageKarma || 0)} • 🚶 ${gameState.villageTripsToday || 0}`;
      const zoneTopName = document.getElementById('village-zone-top-name');
      const weatherTop = document.getElementById('village-weather-top');

      const zoneRow = document.getElementById('village-zone-row');
      if (zoneRow) {
        zoneRow.innerHTML = Object.entries(VILLAGE_ZONES).map(([key, z]) => {
          const unlocked = isVillageZoneUnlocked(z);
          const active = gameState.villageZone === key;
          return `<button onclick="setVillageZone('${key}')" class="village-zone-btn tap-scale ${active ? 'active' : ''} ${unlocked ? '' : 'locked'}">
            <span class="text-lg block">${z.icon}</span>
            ${z.name}
            <span class="text-[7px] block mt-0.5 opacity-70">${unlocked ? `${getVillageWalkCost(z)}⚡` : `🔒 Lv.${z.reqLevel}`}</span>
          </button>`;
        }).join('');
      }

      const zone = getVillageZoneConfig();
      v72SetVillageTheme(gameState.villageZone || 'lane');
      const road = document.getElementById('village-road');
      if (road) {
        road.className = `village-road map-upgraded scene-${gameState.villageZone || 'lane'}`;
        const currentZone=gameState.villageZone || 'lane';
        if (road.dataset.zoneArt !== currentZone) {
          const art = VILLAGE_ZONE_ART[currentZone] || VILLAGE_MAP_ART;
          road.style.backgroundImage = `linear-gradient(180deg, rgba(255,255,255,.02), rgba(0,0,0,.03)), url("${art}")`;
          road.dataset.zoneArt = currentZone;
        }
        const bgPosMap = {
          lane:'48% 54%', market:'52% 54%', school:'58% 46%', ricefield:'42% 55%',
          riverside:'50% 58%', busstop:'30% 48%', clinic:'22% 46%', temple:'14% 46%',
          hill:'74% 40%', nightmarket:'62% 50%', district:'56% 44%'
        };
        road.style.backgroundPosition = bgPosMap[gameState.villageZone] || '50% 50%';
      }
      const zoneBadge = document.getElementById('village-zone-badge');
      if (zoneBadge) zoneBadge.innerText = `${zone.icon || '🗺️'} ${zone.name || 'Đường làng'}`;
      if (zoneTopName) zoneTopName.innerText = zone.name || 'Phố Nhỏ';
      const attend=document.getElementById('v873-attendance-hint'); if(attend)attend.textContent=v873AttendanceSummary();
      const weather = getActiveWorldEventConfig() || { icon:'☁️', title:'Ngày Bình Thường', desc:'Không có biến động đặc biệt trong hôm nay.' };
      const weatherIcon = document.getElementById('village-weather-icon');
      const weatherTitle = document.getElementById('village-weather-title');
      const weatherDesc = document.getElementById('village-weather-desc');
      if (weatherTop) weatherTop.innerText = `${weather.icon || '☁️'} ${weather.title || 'Ngày Bình Thường'}`;
      if (weatherIcon) weatherIcon.innerText = weather.icon || '☁️';
      if (weatherTitle) weatherTitle.innerText = weather.title || 'Ngày Bình Thường';
      if (weatherDesc) weatherDesc.innerText = weather.desc || 'Không có biến động đặc biệt trong hôm nay.';
      const ambientLeft = document.getElementById('village-ambient-left');
      const ambientRight = document.getElementById('village-ambient-right');
      const ambientMap = {lane:['🏘️','🌿'],market:['🧺','🛍️'],school:['🎒','📚'],ricefield:['🌳','🌷'],riverside:['⛲','🪑'],busstop:['🚌','🧳'],clinic:['🚲','🌿'],temple:['🏮','🧱'],hill:['🌤️','🦋'],nightmarket:['🏮','✨'],district:['🚕','🏢']};
      const amb = ambientMap[gameState.villageZone] || ['🌳','🌼'];
      if (ambientLeft) ambientLeft.innerText = amb[0];
      if (ambientRight) ambientRight.innerText = amb[1];
      const prop = document.getElementById('village-zone-prop');
      const costText = document.getElementById('village-walk-cost');
      const walkBtn = document.getElementById('btn-village-walk');
      if (prop) prop.innerText = zone.prop || zone.icon;
      const walkCost = getVillageWalkCost(zone);
      if (costText) costText.innerText = walkCost;
      v872EnsureState();
      v84StoryProgressPanel();
      v8751RenderTown();
      v8752Render();
      v8753Render();
      if (walkBtn) {
        walkBtn.disabled = villageWalking || !!gameState.villageEncounterId || energy < walkCost;
        walkBtn.innerHTML = villageWalking
          ? `<img id="v77-walk-mascot" class="v77-walk-mascot" src="${getPlayerChibiSource(getCurrentPlayerChibi())}" alt="" aria-hidden="true"><span class="v77-walk-copy"><span class="walk-main">Đang dạo… <span class="v77-walk-arrow">›</span></span><span class="walk-sub">Đang gặp sự kiện</span></span>`
          : `<img id="v77-walk-mascot" class="v77-walk-mascot" src="${getPlayerChibiSource(getCurrentPlayerChibi())}" alt="" aria-hidden="true"><span class="v77-walk-copy"><span class="walk-main">Đi lon ton <span class="v77-walk-arrow">›</span></span><span class="walk-sub">⚡ <span id="village-walk-cost">${walkCost}</span> · Khám phá</span></span>`;
      }

      if (villageWalking || gameState.villageEncounterId) closeVillagePointModal();

      const panel = document.getElementById('village-encounter-panel');
      const backdrop = document.getElementById('village-encounter-backdrop');
      const active = VILLAGE_ENCOUNTERS.find(x => x.id === gameState.villageEncounterId);
      if (panel) {
        if (!active) {
          panel.classList.add('hidden');
          if (backdrop) backdrop.classList.add('hidden');
        } else {
          panel.classList.remove('hidden');
          if (backdrop) backdrop.classList.remove('hidden');
          const icon = document.getElementById('village-encounter-icon');
          const title = document.getElementById('village-encounter-title');
          const desc = document.getElementById('village-encounter-desc');
          const choices = document.getElementById('village-choice-list');
          if (icon) icon.innerText = active.icon;
          if (title) title.innerText = active.title;
          if (desc) desc.innerText = active.desc;
          if (choices) choices.innerHTML = (active.choices || []).map((c, idx) => {
            const risk = V84_RISK_TABLE[c.risk];
            const hint = c.hint || (risk ? `${risk.icon} ${risk.name} • có thể trúng lớn hoặc xui nặng` : idx===0 ? 'Lựa chọn đầu tiên' : 'Mỗi cách xử lý có kết quả khác nhau');
            return `<button onclick="resolveVillageEncounter(${idx})" class="village-choice v84-choice tap-scale"><span><span class="village-choice-main">${c.label}</span><span class="village-choice-sub">${hint}</span></span></button>`;
          }).join('') + `<div class="v84-luck-note">🎲 Trúng thưởng không đảm bảo. Lựa chọn liều thường có quà lớn hơn nhưng dễ mất Xu hoặc năng lượng.</div>`;
          const energyInfo = document.getElementById('village-encounter-energy');
          if (energyInfo) energyInfo.innerText = `⚡ Còn ${Math.max(0, Number(gameState.villageEnergy)||0)} năng lượng`;
        }
      }

      const history = document.getElementById('village-history-list');
      if (history) {
        const rows = Array.isArray(gameState.villageHistory) ? gameState.villageHistory : [];
        history.innerHTML = rows.length ? rows.map(row => `
          <div class="village-history-row">
            <span class="text-lg">${row.icon || '📌'}</span>
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-1">
                <b class="text-[9px] text-slate-700 truncate">${row.title}</b>
                <span class="ml-auto text-[7px] text-slate-400 whitespace-nowrap">Ngày ${row.day}</span>
              </div>
              <div class="text-[8px] text-slate-500 mt-0.5">${row.text}</div>
            </div>
          </div>`).join('') : `<div class="py-3 text-center text-[9px] text-slate-400 italic">Chưa có chuyện gì. Đi lon ton một vòng thử xem 👣</div>`;
      }
    }

    function switchTab(tabId) {
      const tabs = ['shop', 'farm', 'barn', 'village', 'warehouse', 'reviews'];
      tabs.forEach(t => {
        const page = document.getElementById(`tab-${t}`);
        const btn = document.getElementById(`nav-btn-${t}`);
        if (page) {
          if (t === tabId) page.classList.remove('hidden');
          else page.classList.add('hidden');
        }
        if (btn) {
          if (t === tabId) {
            btn.className = "compact-nav-btn bg-amber-500 text-white shadow-sm tap-scale flex flex-col items-center";
          } else {
            btn.className = "compact-nav-btn hover:bg-amber-100 tap-scale flex flex-col items-center text-slate-500";
          }
        }
      });

      if (tabId !== 'shop') { v68ForceOrderDock = false; v68OrderExpanded = false; }
      playSound('click');
      if (tabId === 'shop') { renderCustomerBooth();v87532RenderBoard(); }
      if (tabId === 'farm') renderFarmUI();
      if (tabId === 'barn') renderBarnUI();
      if (tabId === 'village') { renderVillageUI(); saveGameToStorage(false); }
      if (tabId === 'warehouse') renderWarehouseUI();
      if (tabId === 'reviews') renderShopReviews();
      v8745Render();

      // V79: a tall shop must not leave another section scrolled below its first card.
      // Reset both document and any independently scrolling stage after tab changes.
      const mainStage = document.querySelector('.main-stage');
      if (mainStage) mainStage.scrollTop = 0;
      window.scrollTo(0, 0);
    }

    function setTextSafe(id, text) {
      const el = document.getElementById(id);
      if (el) el.innerText = text;
    }

    function countUnlockedWorkbenchItems(keys = [], career) {
      return keys.filter(key => isItemStoryUnlocked(key, career)).length;
    }

    function countLowStockWorkbenchItems(keys = [], career) {
      return keys.filter(key => isItemStoryUnlocked(key, career) && (Number(gameState.inventory[key]) || 0) <= 2).length;
    }

    function refreshShopFloorSummary() {
      const career = gameState.currentCareer || 'boba';
      const cfg = CAREER_WORKBENCH_KEYS[career] || CAREER_WORKBENCH_KEYS.boba;
      const totalRecipes = (RECIPE_BOOK[career] || []).length;
      const unlockedRecipes = getUnlockedRecipes(career).length;
      const lowStockKeys = [...(cfg.containers || []), ...(cfg.bases || []), ...(cfg.toppings || []), ...(cfg.sauces || [])];
      const stageTotal = Array.isArray(SHOP_STAGE_CONFIG) ? SHOP_STAGE_CONFIG.length : 6;
      const popularity = getShopPopularityScore();
      const focusCopy = career === 'boba'
        ? 'Ưu tiên chọn size ly và cốt trà trước, sau đó thêm topping để bấm nhanh hơn.'
        : career === 'noodle'
          ? 'Chọn thố và nước lèo trước, topping cho vào sau để trạm nấu gọn hơn.'
          : 'Chọn khay đựng trước, sau đó xiên và sốt để quầy chiên bớt rối mắt.';
      const tipCopy = career === 'boba'
        ? 'Giữ sẵn size chủ lực và topping bán chạy để phục vụ liên tục.'
        : career === 'noodle'
          ? 'Giữ sẵn nước lèo và topping chủ lực để không đứt nhịp bán.'
          : 'Xiên hot và sốt chủ lực nên luôn đầy kho để thao tác nhanh.';
      setTextSafe('shop-front-stage', `Bậc ${Number(gameState.shopStage || 0) + 1}/${stageTotal}`);
      setTextSafe('shop-front-recipes', `${unlockedRecipes} / ${totalRecipes} công thức`);
      setTextSafe('shop-front-stock', `${countLowStockWorkbenchItems(lowStockKeys, career)} nguyên liệu sắp hết`);
      setTextSafe('shop-front-pop', `${popularity}/100 nổi tiếng`);
      setTextSafe('shop-front-tip-title', 'Gợi ý quán hôm nay');
      setTextSafe('shop-front-tip', tipCopy);
      setTextSafe('workbench-focus-copy', focusCopy);
      setTextSafe('workbench-stage-pill', career === 'boba' ? 'Pha chế trà sữa' : career === 'noodle' ? 'Nấu món nóng' : 'Chiên & bày mẹt');
      setTextSafe('boba-base-count', `${countUnlockedWorkbenchItems((CAREER_WORKBENCH_KEYS.boba || {}).bases || [], 'boba')}/${((CAREER_WORKBENCH_KEYS.boba || {}).bases || []).length} mở`);
      setTextSafe('boba-top-count', `${countUnlockedWorkbenchItems((CAREER_WORKBENCH_KEYS.boba || {}).toppings || [], 'boba')}/${((CAREER_WORKBENCH_KEYS.boba || {}).toppings || []).length} mở`);
      setTextSafe('noodle-base-count', `${countUnlockedWorkbenchItems((CAREER_WORKBENCH_KEYS.noodle || {}).bases || [], 'noodle')}/${((CAREER_WORKBENCH_KEYS.noodle || {}).bases || []).length} mở`);
      setTextSafe('noodle-top-count', `${countUnlockedWorkbenchItems((CAREER_WORKBENCH_KEYS.noodle || {}).toppings || [], 'noodle')}/${((CAREER_WORKBENCH_KEYS.noodle || {}).toppings || []).length} mở`);
      setTextSafe('street-skewer-count', `${countUnlockedWorkbenchItems((CAREER_WORKBENCH_KEYS.streetfood || {}).toppings || [], 'streetfood')}/${((CAREER_WORKBENCH_KEYS.streetfood || {}).toppings || []).length} mở`);
      setTextSafe('street-sauce-count', `${countUnlockedWorkbenchItems((CAREER_WORKBENCH_KEYS.streetfood || {}).sauces || [], 'streetfood')}/${((CAREER_WORKBENCH_KEYS.streetfood || {}).sauces || []).length} mở`);
      renderWorkbenchPresetCards();
      updateShopFastAssistantUi();
      const shopHub = document.getElementById('modal-shop-hub');
      if (shopHub && !shopHub.classList.contains('hidden')) renderShopHubModal();
    }

    function getWorkbenchLowStockEntries(career) {
      const cfg = CAREER_WORKBENCH_KEYS[career] || CAREER_WORKBENCH_KEYS.boba;
      const keys = [...(cfg.containers || []), ...(cfg.bases || []), ...(cfg.toppings || []), ...(cfg.sauces || [])];
      return keys
        .filter(key => isItemStoryUnlocked(key, career))
        .map(key => ({ key, qty: Number(gameState.inventory[key] || 0), name: itemLabel(key) }))
        .filter(entry => entry.qty <= 2)
        .sort((a, b) => a.qty - b.qty || a.name.localeCompare(b.name, 'vi'));
    }

    function applyRecipePreset(recipeId, career) {
      const pool = RECIPE_BOOK[career] || [];
      const recipe = pool.find(r => r.id === recipeId);
      if (!recipe) return;
      if(!getUnlockedRecipes(career).some(r=>r.id===recipeId))return showToast('Công thức chưa mở. Hãy học trong Soppi → Sổ Công Thức!', '🔒');
      gameState.currentCareer = career;
      workbenchDish.career = career;
      workbenchDish.isShaken = false;
      workbenchDish.isCooked = false;
      workbenchDish.fryProgress = 0;
      workbenchDish.fryState = 'unfried';
      workbenchDish.toppings = [];
      workbenchDish.skewerCounts = {};
      const order = JSON.parse(JSON.stringify(recipe.order || {}));
      if (career === 'boba') {
        workbenchDish.container = order.container || 'cup_m';
        workbenchDish.base = order.base || 'tea_black';
        workbenchDish.sugar = order.sugar ?? 70;
        workbenchDish.ice = order.ice ?? 50;
        workbenchDish.toppings = [...(order.toppings || [])];
        workbenchDish.listedPrice = Math.max(35, calculateDishCost() + 20);
      } else if (career === 'noodle') {
        workbenchDish.container = order.container || 'bowl_m';
        workbenchDish.base = order.base || 'broth_kimchi';
        workbenchDish.spicyLevel = order.spicyLevel ?? 2;
        workbenchDish.toppings = [...(order.toppings || [])];
        workbenchDish.listedPrice = Math.max(50, calculateDishCost() + 24);
      } else {
        workbenchDish.tray = ({ tray_plate:'plate', tray_basket:'basket', tray_box:'box' }[order.container] || order.tray || 'plate');
        workbenchDish.sauce = order.sauce || 'sauce_sweet_chili';
        workbenchDish.skewerCounts = JSON.parse(JSON.stringify(order.skewerCounts || {}));
        workbenchDish.listedPrice = Math.max(35, calculateDishCost() + 18);
      }
      maybeAutoFinishWorkbench();
      renderWorkbenchControls();
      updateWorkbenchPreview();
      refreshShopFloorSummary();
      showToast(`Đã nạp preset: ${recipe.name}`, '🍽️');
      playSound('click');
    }

    function renderWorkbenchPresetCards() {
      const grid = document.getElementById('workbench-preset-grid');
      const lowBar = document.getElementById('workbench-lowstock-bar');
      if (!grid) return;
      const career = gameState.currentCareer || 'boba';
      const unlocked = getUnlockedRecipes(career);
      const all = RECIPE_BOOK[career] || [];
      const nextLocked = all.find(r => !unlocked.some(u => u.id === r.id));
      const presets = unlocked.slice(0, 2);
      const cards = presets.map(recipe => `
        <button onclick="applyRecipePreset('${recipe.id}','${career}')" class="workbench-preset-card v54-mini tap-scale">
          <span class="preset-icon">${getRecipeQuickIcon(career, recipe)}</span>
          <span class="preset-text"><b>${recipe.name}</b><span>${(gameState.automation && gameState.automation.shopFastEnabled && isShopFastAssistantUnlocked()) ? 'Tự hoàn thiện' : 'Nạp nhanh'}</span></span>
          <span class="preset-tag">GO</span>
        </button>`);
      if (nextLocked) {
        cards.push(`
          <div class="workbench-preset-card v54-mini locked">
            <span class="preset-icon">🔒</span>
            <span class="preset-text"><b>${nextLocked.name}</b><span>Lv.${nextLocked.reqLevel} • Bậc ${Number(nextLocked.reqStage||0)+1}</span></span>
            <span class="preset-tag">WAIT</span>
          </div>`);
      }
      while (cards.length < 3) {
        cards.push(`<div class="workbench-preset-card v54-mini locked"><span class="preset-icon">✨</span><span class="preset-text"><b>Ô preset mới</b><span>Mở thêm món để lấp đầy.</span></span><span class="preset-tag">NEW</span></div>`);
      }
      grid.innerHTML = cards.join('');
      const lowStocks = getWorkbenchLowStockEntries(career).slice(0, 3);
      if (lowBar) {
        lowBar.classList.toggle('v62-has-warning', lowStocks.length > 0);
        lowBar.innerHTML = lowStocks.length
          ? lowStocks.map(entry => `<span class="workbench-lowstock-pill compact">⚠️ ${entry.name}: ${entry.qty}</span>`).join('')
          : '';
      }
      updateShopFastAssistantUi();
    }

    function renderShopHubModal() {
      const career = gameState.currentCareer || 'boba';
      const unlocked = getUnlockedRecipes(career);
      const lowStocks = getWorkbenchLowStockEntries(career);
      const careerLabel = career === 'boba' ? 'Trà sữa' : career === 'noodle' ? 'Mì / lẩu' : 'Xiên que';
      setTextSafe('shop-hub-career-chip', `🏪 ${careerLabel}`);
      setTextSafe('shop-hub-bestseller', unlocked[0] ? `⭐ ${unlocked[0].name}` : '⭐ Chưa có món gợi ý');
      setTextSafe('shop-hub-lowstock-chip', lowStocks.length ? `📦 ${lowStocks.length} món sắp hết` : '📦 Tồn kho ổn định');
      setTextSafe('shop-hub-tip-box', document.getElementById('shop-front-tip') ? document.getElementById('shop-front-tip').innerText : 'Theo dõi quầy hàng để bán mượt hơn.');
      const recipeList = document.getElementById('shop-hub-recipe-list');
      if (recipeList) {
        recipeList.innerHTML = unlocked.slice(0, 4).map(recipe => `
          <div class="shop-hub-recipe-card">
            <div class="flex items-start justify-between gap-2">
              <div class="min-w-0"><b>${recipe.name}</b><span>Lv.${recipe.reqLevel} • Bậc ${Number(recipe.reqStage||0)+1}</span></div>
              <button onclick="applyRecipePreset('${recipe.id}','${career}'); closeShopHubModal();" class="shrink-0 px-2 py-1 bg-amber-500 hover:bg-amber-600 text-white text-[8px] font-black rounded-lg tap-scale">Nạp món</button>
            </div>
          </div>`).join('') || '<div class="shop-hub-recipe-card"><b>Chưa có preset</b><span>Tiếp tục mở khóa cốt truyện quán để có công thức bán tốt.</span></div>';
      }
      const lowList = document.getElementById('shop-hub-lowstock-list');
      if (lowList) {
        lowList.innerHTML = lowStocks.slice(0, 6).map(entry => `
          <div class="shop-hub-recipe-card"><b>${entry.name}</b><span>Còn ${entry.qty} • nên nhập thêm</span></div>`).join('') || '<div class="shop-hub-recipe-card col-span-2"><b>Tồn kho đang đẹp</b><span>Hiện chưa có nguyên liệu nào xuống mức cảnh báo.</span></div>';
      }
    }

    function openShopHubModal() {
      refreshShopFloorSummary();
      renderShopHubModal();
      const modal = document.getElementById('modal-shop-hub');
      if (modal) modal.classList.remove('hidden');
      playSound('click');
    }

    function closeShopHubModal() {
      const modal = document.getElementById('modal-shop-hub');
      if (modal) modal.classList.add('hidden');
      playSound('click');
    }

    function hasHighTierShopDecorForAssistant() {
      const owned = new Set(gameState.decorations || []);
      const premium = ['aquarium','wood_furniture','koi_corner','stone_counter','vip_room','heritage_wall'];
      return premium.some(id => owned.has(id)) || owned.size >= 4;
    }

    function isShopFastAssistantUnlocked() {
      return Number(gameState.level || 0) >= 18 || hasHighTierShopDecorForAssistant();
    }

    function maybeAutoFinishWorkbench() {
      if (!isShopFastAssistantUnlocked() || !(gameState.automation && gameState.automation.shopFastEnabled)) return;
      if (workbenchDish.career === 'boba') {
        workbenchDish.isShaken = true;
      } else if (workbenchDish.career === 'noodle') {
        workbenchDish.isCooked = true;
      } else {
        workbenchDish.fryProgress = 100;
        workbenchDish.fryState = 'perfect';
      }
    }

    function updateShopFastAssistantUi() {
      const btn = document.getElementById('shop-fast-toggle');
      const hint = document.getElementById('workbench-fast-hint');
      const unlocked = isShopFastAssistantUnlocked();
      const on = !!(gameState.automation && gameState.automation.shopFastEnabled && unlocked);
      if (btn) {
        btn.classList.toggle('on', on);
        btn.classList.toggle('locked', !unlocked);
        btn.innerText = unlocked ? (on ? '🤖 Trợ lý ON' : '🤖 Trợ lý OFF') : '🔒 Chưa mở';
      }
      if (hint) {
        hint.innerText = unlocked
          ? (on ? 'Preset sẽ tự hoàn thiện bước lắc / nấu / canh độ chín.' : 'Bật trợ lý để preset làm nhanh giống cơ chế tự động bên nuôi trồng.')
          : 'Mở ở Lv.18 hoặc khi đã có nhiều trang trí / quầy xịn trong quán.';
      }
    }

    function toggleShopFastAssistant() {
      if (!isShopFastAssistantUnlocked()) {
        return showToast('Trợ lý quầy mở ở Lv.18 hoặc khi quán có đủ trang trí cao cấp!', '🔒');
      }
      if (!gameState.automation || typeof gameState.automation !== 'object') gameState.automation = { farmEnabled: false, barnEnabled: false, shopFastEnabled: false };
      gameState.automation.shopFastEnabled = !gameState.automation.shopFastEnabled;
      updateShopFastAssistantUi();
      refreshShopFloorSummary();
      showToast(gameState.automation.shopFastEnabled ? 'Đã bật Trợ Lý Quầy.' : 'Đã tắt Trợ Lý Quầy.', '🤖');
      playSound('click');
    }

    function getRecipeQuickIcon(career, recipe) {
      if (career === 'boba') return '🧋';
      if (career === 'noodle') return (recipe.name || '').includes('Lẩu') ? '🍲' : '🍜';
      return (recipe.name || '').includes('Hộp') ? '🥡' : '🍢';
    }


    // V72 — shortcut to the existing shop progression; no second shop-stage state.
    function refreshShopStageQuickBadge(){
      const el=document.getElementById('header-shop-stage');
      if(!el) return;
      const stage=Math.max(0,Number(gameState.shopStage)||0);
      el.textContent=`Bậc ${stage+1}`;
      const btn=el.closest('button');
      if(btn) btn.title=(SHOP_STAGE_CONFIG[stage]?.name||'Quán')+' • Xem nâng bậc';
    }
    function openShopStageQuickModal(){
      if(typeof ensureGrowthState==='function') ensureGrowthState();
      renderShopStageQuickModal();
      const modal=document.getElementById('modal-shop-stage-quick');
      if(modal) modal.classList.remove('hidden');
      if(typeof playSound==='function') playSound('click');
    }
    function closeShopStageQuickModal(){
      document.getElementById('modal-shop-stage-quick')?.classList.add('hidden');
    }
    function renderShopStageQuickModal(){
      const box=document.getElementById('v72-stage-quick-content');
      const btn=document.getElementById('v72-stage-quick-upgrade');
      if(!box||!btn) return;
      const stage=Math.max(0,Number(gameState.shopStage)||0);
      const current=SHOP_STAGE_CONFIG[stage]||SHOP_STAGE_CONFIG[0];
      const next=SHOP_STAGE_CONFIG[stage+1];
      if(!next){
        box.innerHTML=`<div class="v72-stage-now"><div class="v72-stage-small">ĐÃ ĐẠT BẬC TỐI ĐA</div><div class="v72-stage-label">${current.icon} ${current.name}</div></div>`;
        btn.disabled=true;btn.textContent='🏆 Đã đạt bậc cao nhất';return;
      }
      const levelOk=gameState.level>=next.reqLevel;
      const ratingOk=gameState.reputation>=next.reqRating;
      const coinOk=gameState.coins>=next.cost;
      const fmt=(n)=>Number(n).toLocaleString('vi-VN');
      const req=(icon,ok,have,want)=>`<div class="v72-stage-req ${ok?'is-met':''}">${icon} ${ok?'Đạt':'Chưa đạt'}<b>${have} / ${want}</b></div>`;
      box.innerHTML=`<div class="v72-stage-now"><div class="v72-stage-small">Bậc ${stage+1}/${SHOP_STAGE_CONFIG.length} • hiện tại</div><div class="v72-stage-label">${current.icon} ${current.name}</div></div>
      <div class="v72-stage-next"><div class="v72-stage-small">Bậc ${stage+2}/${SHOP_STAGE_CONFIG.length} • tiếp theo</div><div class="v72-stage-label">${next.icon} ${next.name}</div>
      <div class="v72-stage-reqs">${req('🎮 Level',levelOk,gameState.level,next.reqLevel)}${req('⭐ Sao',ratingOk,gameState.reputation.toFixed(1),next.reqRating.toFixed(1))}${req('🪙 Xu',coinOk,fmt(gameState.coins),fmt(next.cost))}</div>
      <p style="font-size:9px;color:#896443;line-height:1.45;margin-top:9px;">${next.story} • Nhận +1 SP và mở thêm nội dung khi lên bậc.</p></div>`;
      const can=levelOk&&ratingOk&&coinOk;
      btn.disabled=!can;
      btn.textContent=can?`⬆️ Nâng lên bậc ${stage+2} • ${fmt(next.cost)} Xu`:'🔒 Chưa đủ điều kiện nâng bậc';
    }
    function confirmShopStageQuickUpgrade(){
      const stageBefore=gameState.shopStage;
      const next=SHOP_STAGE_CONFIG[stageBefore+1];
      if(!next) return renderShopStageQuickModal();
      if(gameState.level<next.reqLevel||gameState.reputation<next.reqRating||gameState.coins<next.cost){renderShopStageQuickModal();return;}
      // Payment is handled exclusively by the existing upgradeShopStage().
      upgradeShopStage();
      refreshShopStageQuickBadge();
      renderShopStageQuickModal();
    }
    const V72_ZONE_MOODS = {
      lane: '🏡 Phố mái ngói • vàng mật ong',
      market: '🛍️ Sắc cam • chợ đông vui',
      school: '📚 Xanh trời • sân trường',
      ricefield: '🌳 Xanh lá • công viên mát',
      riverside: '⛲ Xanh lam • quảng trường thoáng',
      busstop: '🚏 Xám xanh • phố giao thông',
      clinic: '🏥 Trắng ngọc • trạm y tế',
      temple: '🏛️ Gạch ấm • sinh hoạt cộng đồng',
      hill: '💜 Tím sim • gió đồi',
      nightmarket: '🏮 Tím đêm • phố đèn lung linh',
      district: '🏙️ Xanh thép • khu trung tâm',
    };
    function v72SetVillageTheme(zone){
      const key=V72_ZONE_MOODS[zone]?zone:'lane';
      const panel=document.getElementById('tab-village');
      if(panel) panel.dataset.v72Zone=key;
      const flavor=document.getElementById('v72-zone-flavor');
      if(flavor) flavor.textContent=V72_ZONE_MOODS[key];
    }

    function updateHeaderStats() {
      const elCoins = document.getElementById('stat-coins');
      const elLv = document.getElementById('stat-level-num');
      const elSp = document.getElementById('stat-sp-count');
      const elExpBar = document.getElementById('stat-exp-bar');
      const elShopName = document.getElementById('header-shop-name');
      const elPlayerName = document.getElementById('header-player-name');
      const elDayTag = document.getElementById('header-day-tag');
      const elRating = document.getElementById('header-rating-badge');
      const elRatingCount = document.getElementById('header-rating-count');
      const elIcon = document.getElementById('header-career-icon');

      if (elCoins) elCoins.innerText = `${gameState.coins.toLocaleString()} Xu`;
      const phoneCoins = document.getElementById('phone-coins-display');
      const utilityCoins = document.getElementById('utility-coins-display');
      if (phoneCoins) phoneCoins.innerText = gameState.coins.toLocaleString();
      if (utilityCoins) utilityCoins.innerText = gameState.coins.toLocaleString();
      if (elLv) elLv.innerText = gameState.level;
      if (elSp) elSp.innerText = `${gameState.sp} SP`;
      if (elShopName) elShopName.innerText = gameState.shopName;
      if (elPlayerName) elPlayerName.innerText = gameState.playerName;
      if (elDayTag) elDayTag.innerText = `Ngày ${gameState.day}`;
      if (elRating) elRating.innerText = `⭐ ${gameState.reputation.toFixed(1)}`;
      if (elRatingCount) elRatingCount.innerText = `(${Math.max(0, Number(gameState.ratingCount) || 0)})`;
      const ratingSummary = document.getElementById('shop-rating-summary');
      if (ratingSummary) ratingSummary.innerText = `${gameState.reputation.toFixed(1)}/5 • ${Math.max(0, Number(gameState.ratingCount) || 0)} đánh giá`;

      if (elIcon) elIcon.innerText = gameState.shopIcon || getCareerDefaultShopIcon();
      updateShopAvatarOnHeader();

      const reqExp = gameState.level * 100;
      const pct = Math.min(100, Math.floor((gameState.exp / reqExp) * 100));
      if (elExpBar) elExpBar.style.width = `${pct}%`;
      refreshShopFloorSummary();
      refreshShopStageQuickBadge();
    }

    function addExp(pts) {
      gameState.exp += pts;
      const reqExp = gameState.level * 100;
      if (gameState.exp >= reqExp) {
        gameState.exp -= reqExp;
        gameState.level += 1;
        gameState.sp += 1;
        playSound('level');
        showToast(`CHÚC MỪNG! Thăng cấp lên Cấp ${gameState.level}! (+1 SP)`, "🏆");
        if (gameState.level === 12) pushGameNotification('Mở khóa Trợ Lý Vườn', 'Có thể bật tự tưới ở tab Vườn. Các chức năng tự thu hoạch/gieo lại sẽ mở ở cấp cao hơn.', '🤖', 'unlock');
        if (gameState.level === 14) pushGameNotification('Mở khóa Trợ Lý Chuồng', 'Có thể bật tự chăm/cho ăn 1 lần mỗi chu kỳ ở tab Chuồng.', '🐾', 'unlock');
        if (gameState.level === 18) pushGameNotification('Mở khóa Trợ Lý Quầy', 'Preset làm nhanh trong tab Quán có thể tự hoàn thiện bước lắc / nấu / canh độ chín.', '🤖', 'unlock');
        if (gameState.level === 20) pushGameNotification('Trợ Lý Vườn nâng cấp', 'Đã mở tự thu hoạch cây chín.', '🧺', 'unlock');
        if (gameState.level === 22) pushGameNotification('Trợ Lý Chuồng nâng cấp', 'Đã mở tự thu sản phẩm khi hoàn tất chu kỳ.', '🥛', 'unlock');
        if (gameState.level === 28) pushGameNotification('Trợ Lý Vườn hoàn chỉnh', 'Đã mở tự gieo lại giống vừa thu hoạch nếu kho còn hạt.', '🌱', 'unlock');
      }
      updateHeaderStats();
    }

    function openQuickRestock(itemKey) {
      if (!isItemStoryUnlocked(itemKey, gameState.currentCareer)) {
        return showToast(`Chưa thể nhập ${itemLabel(itemKey)} • ${getStoryUnlockLabel(itemKey, gameState.currentCareer)}`, '🔒');
      }
      activeQuickRestockItem = itemKey;
      quickRestockQuantity = 5;
      const item = ITEM_DICTIONARY[itemKey] || { name: itemKey, icon: '📦', basePrice: 5 };

      const modal = document.getElementById('modal-quick-restock');
      const iconEl = document.getElementById('qrestock-icon');
      const titleEl = document.getElementById('qrestock-title');
      const stockInfo = document.getElementById('qrestock-stock-info');
      const unitPriceEl = document.getElementById('qrestock-unit-price');

      if (iconEl) iconEl.innerText = item.icon;
      if (titleEl) titleEl.innerText = `Nhập Nhanh: ${item.name}`;
      if (stockInfo) stockInfo.innerText = `Tồn kho hiện tại: ${gameState.inventory[itemKey] || 0}`;
      if (unitPriceEl) unitPriceEl.innerText = `${item.basePrice} Xu / món`;

      updateQuickRestockDisplay();
      if (modal) modal.classList.remove('hidden');
      playSound('click');
    }

    function adjustQuickRestockQty(delta) {
      quickRestockQuantity = Math.max(1, quickRestockQuantity + delta);
      updateQuickRestockDisplay();
      playSound('click');
    }

    function updateQuickRestockDisplay() {
      const item = ITEM_DICTIONARY[activeQuickRestockItem];
      const unitPrice = item ? item.basePrice : 5;
      const total = quickRestockQuantity * unitPrice;

      const qtyEl = document.getElementById('qrestock-qty');
      const totalEl = document.getElementById('qrestock-total-cost');
      if (qtyEl) qtyEl.innerText = quickRestockQuantity;
      if (totalEl) totalEl.innerText = `${total} Xu`;
    }

    function closeQuickRestockModal() {
      const modal = document.getElementById('modal-quick-restock');
      if (modal) modal.classList.add('hidden');
      activeQuickRestockItem = null;
      playSound('click');
    }

    function confirmQuickRestockPurchase() {
      if (!activeQuickRestockItem) return;
      const item = ITEM_DICTIONARY[activeQuickRestockItem];
      const unitPrice = item ? item.basePrice : 5;
      const total = quickRestockQuantity * unitPrice;

      if (gameState.coins < total) {
        return showToast("Không đủ Xu để nhập hàng!", "❌");
      }

      gameState.coins -= total;
      gameState.inventory[activeQuickRestockItem] = (gameState.inventory[activeQuickRestockItem] || 0) + quickRestockQuantity;

      playSound('coin');
      showToast(`Đã nhập +${quickRestockQuantity} ${item.name}!`, item.icon);
      closeQuickRestockModal();
      updateHeaderStats();
      renderWorkbenchControls();
      updateWorkbenchPreview();
      saveGameToStorage();
    }

    function calculateDishCost() {
      let cost = 0;
      const dict = ITEM_DICTIONARY;
      if (workbenchDish.career === 'boba') {
        cost += (dict[workbenchDish.container] && dict[workbenchDish.container].basePrice) || 3;
        cost += (dict[workbenchDish.base] && dict[workbenchDish.base].basePrice) || 8;
        (workbenchDish.toppings || []).forEach(topKey => {
          cost += (dict[topKey] && dict[topKey].basePrice) || 5;
        });
      } else if (workbenchDish.career === 'noodle') {
        cost += (dict[workbenchDish.container] && dict[workbenchDish.container].basePrice) || 6;
        cost += (dict[workbenchDish.base] && dict[workbenchDish.base].basePrice) || 12;
        (workbenchDish.toppings || []).forEach(topKey => {
          cost += (dict[topKey] && dict[topKey].basePrice) || 8;
        });
      } else {
        const trayKey = ({plate:'tray_plate',basket:'tray_basket',box:'tray_box'}[workbenchDish.tray] || 'tray_plate');
        cost += (dict[trayKey] && dict[trayKey].basePrice) || 2;
        cost += (dict[workbenchDish.sauce] && dict[workbenchDish.sauce].basePrice) || 3;
        const counts = workbenchDish.skewerCounts || {};
        Object.keys(counts).forEach(skKey => {
          cost += ((dict[skKey] && dict[skKey].basePrice) || 4) * (counts[skKey] || 0);
        });
      }
      return cost;
    }

    function updateWorkbenchPreview() {
      const cost = calculateDishCost();
      const profit = workbenchDish.listedPrice - cost;

      const elCost = document.getElementById('dish-cost-val');
      const elPrice = document.getElementById('dish-price-val');
      const elProfit = document.getElementById('dish-profit-val');
      const elIcon = document.getElementById('dish-preview-icon');
      const elName = document.getElementById('dish-preview-name');
      const elDesc = document.getElementById('dish-preview-desc');

      if (elCost) elCost.innerText = `${cost} Xu`;
      if (elPrice) elPrice.innerText = `${workbenchDish.listedPrice} Xu`;
      if (elProfit) {
        if (profit >= 0) {
          elProfit.innerText = `Lãi: +${profit} Xu`;
          elProfit.className = "text-[8px] text-emerald-300 font-semibold";
        } else {
          elProfit.innerText = `Lỗ: ${profit} Xu`;
          elProfit.className = "text-[8px] text-rose-300 font-semibold";
        }
      }
      const inlinePrice = document.getElementById('workbench-price-main');
      const inlineCost = document.getElementById('workbench-cost-inline');
      const inlineProfit = document.getElementById('workbench-profit-inline');
      if (inlinePrice) inlinePrice.innerText = workbenchDish.listedPrice;
      if (inlineCost) inlineCost.innerText = cost;
      if (inlineProfit) inlineProfit.innerText = `${profit >= 0 ? '+' : ''}${profit}`;

      if (workbenchDish.career === 'boba') {
        if (elIcon) elIcon.innerText = '🥤';
        const baseName = (ITEM_DICTIONARY[workbenchDish.base] && ITEM_DICTIONARY[workbenchDish.base].name) || 'Trà Đen';
        const sz = ({cup_m:'Size M',cup_l:'Size L',cup_xl:'Size XL'}[workbenchDish.container]) || 'Size M';
        if (elName) elName.innerText = `${baseName} (${sz})`;
        const topNames = (workbenchDish.toppings || []).map(k => (ITEM_DICTIONARY[k] && ITEM_DICTIONARY[k].name) || k).join(', ');
        if (elDesc) elDesc.innerText = topNames ? `Topping: ${topNames}` : 'Chưa thêm topping';
        const inlineName = document.getElementById('current-dish-name');
        const inlineDesc = document.getElementById('current-dish-desc');
        if (inlineName) inlineName.innerText = `${baseName} (${sz})`;
        if (inlineDesc) inlineDesc.innerText = topNames ? `Topping: ${topNames}` : `Đường ${workbenchDish.sugar || 70}% • Đá ${workbenchDish.ice || 50}%`;
      } else if (workbenchDish.career === 'noodle') {
        if (elIcon) elIcon.innerText = '🍲';
        const brothName = (ITEM_DICTIONARY[workbenchDish.base] && ITEM_DICTIONARY[workbenchDish.base].name) || 'Cốt Mì';
        const sz = ({bowl_m:'Thố Vừa (M)',bowl_l:'Thố Lớn (L)',bowl_xl:'Thố Đại (XL)'}[workbenchDish.container]) || 'Thố Vừa (M)';
        if (elName) elName.innerText = `${brothName} (${sz}) - Cấp ${workbenchDish.spicyLevel}`;
        const topNames = (workbenchDish.toppings || []).map(k => (ITEM_DICTIONARY[k] && ITEM_DICTIONARY[k].name) || k).join(', ');
        if (elDesc) elDesc.innerText = topNames ? `Thêm: ${topNames}` : 'Chưa có topping';
      } else {
        if (elIcon) elIcon.innerText = '🍢';
        const counts = workbenchDish.skewerCounts || {};
        let totalQ = 0;
        Object.keys(counts).forEach(k => { totalQ += counts[k] || 0; });
        if (elName) elName.innerText = `${workbenchDish.tray === 'box' ? 'Hộp Xiên Mang Đi' : workbenchDish.tray === 'plate' ? 'Đĩa Xiên Que' : 'Mẹt Xiên Que'} (${totalQ} que)`;
        const sauceName = (ITEM_DICTIONARY[workbenchDish.sauce] && ITEM_DICTIONARY[workbenchDish.sauce].name) || 'Sốt Cay';
        if (elDesc) elDesc.innerText = `Sốt: ${sauceName} • ${workbenchDish.fryState === 'perfect' ? 'Vàng Giòn' : 'Chưa Chiên'}`;
      }
      renderWorkbenchPresetCards();
    }

    function adjustDishPrice(delta) {
      workbenchDish.listedPrice = Math.max(10, workbenchDish.listedPrice + delta);
      playSound('click');
      updateWorkbenchPreview();
    }

    function cleanWorkbenchDish() {
      workbenchDish.toppings = [];
      workbenchDish.skewerCounts = {};
      workbenchDish.isShaken = false;
      workbenchDish.isCooked = false;
      workbenchDish.fryProgress = 0;
      workbenchDish.fryState = 'unfried';

      if (workbenchDish.career === 'boba') {
        workbenchDish.listedPrice = 45;
        const st = document.getElementById('shaker-status-text');
        if (st) st.innerText = 'Trạng thái: Chưa lắc';
      } else if (workbenchDish.career === 'noodle') {
        workbenchDish.listedPrice = 65;
        const nc = document.getElementById('noodle-cook-status');
        if (nc) nc.innerText = 'Trạng thái: Chưa nấu';
      } else {
        workbenchDish.listedPrice = 40;
        const fs = document.getElementById('fry-status-txt');
        if (fs) fs.innerText = 'Chưa thả xiên';
        const bar = document.getElementById('fry-progress-bar');
        if (bar) bar.style.width = '0%';
      }

      playSound('click');
      updateWorkbenchPreview();
      renderWorkbenchControls();
    }


    function resetCurrentDish() {
      const career = gameState.currentCareer || 'boba';
      if (career === 'boba') {
        workbenchDish = {
          career:'boba', container:'cup_m', base:'tea_black', sugar:70, ice:50,
          spicyLevel:0, fryHeat:170, tray:null, sauce:null,
          toppings:['topping_boba'], skewerCounts:{}, listedPrice:45,
          isShaken:false, isCooked:false, fryProgress:0, fryState:'unfried'
        };
      } else if (career === 'noodle') {
        workbenchDish = {
          career:'noodle', container:'bowl_m', base:'broth_kimchi', sugar:0, ice:0,
          spicyLevel:2, fryHeat:170, tray:null, sauce:null,
          toppings:['ntop_beef'], skewerCounts:{}, listedPrice:65,
          isShaken:false, isCooked:false, fryProgress:0, fryState:'unfried'
        };
      } else {
        workbenchDish = {
          career:'streetfood', container:null, base:null, sugar:0, ice:0,
          spicyLevel:0, fryHeat:170, tray:'plate', sauce:'sauce_sweet_chili',
          toppings:[], skewerCounts:{skewer_fish:2}, listedPrice:40,
          isShaken:false, isCooked:false, fryProgress:0, fryState:'unfried'
        };
      }
    }

    function ensureV30StarterPack() {
      if (gameState.v30StarterFixApplied) return;
      const packs = {
        boba:{cup_m:8,tea_black:8,topping_boba:8},
        noodle:{bowl_m:8,broth_kimchi:8,ntop_beef:8},
        streetfood:{tray_plate:8,skewer_fish:10,sauce_sweet_chili:8}
      };
      const pack = packs[gameState.currentCareer] || packs.boba;
      Object.entries(pack).forEach(([key,minQty]) => {
        if ((gameState.inventory[key] || 0) < minQty) gameState.inventory[key] = minQty;
      });
      gameState.v30StarterFixApplied = true;
    }

    function ensureV31StarterPack() {
      if (gameState.v31StarterFixApplied) return;
      const packs = {
        boba:{cup_m:8,tea_black:8,tea_strawberry:6,topping_boba:8,topping_pudding:5,topping_jelly:5,topping_white_boba:4},
        noodle:{bowl_m:8,broth_kimchi:8,broth_mushroom:6,ntop_beef:8,ntop_fishcake:6,ntop_enoki:5},
        streetfood:{tray_plate:8,tray_basket:5,skewer_fish:10,skewer_holo:6,skewer_beef:6,sauce_sweet_chili:8,sauce_tamarind:5}
      };
      const pack = packs[gameState.currentCareer] || packs.boba;
      Object.entries(pack).forEach(([key,minQty]) => {
        if ((gameState.inventory[key] || 0) < minQty) gameState.inventory[key] = minQty;
      });
      gameState.v31StarterFixApplied = true;
    }



    // V57: lightweight tray enhancements; intentionally changes no gameplay / save mechanics.
    const v57TrayIds = ['boba-tea-base-grid','boba-toppings-grid','noodle-broth-grid',
      'noodle-toppings-grid','skewer-items-grid','skewer-sauce-grid'];
    const v57TrayOffsets = Object.create(null);
    function v57ScrollTray(gridId, delta) {
      const grid = document.getElementById(gridId);
      if (!grid) return;
      const first = grid.firstElementChild;
      const step = first ? (first.getBoundingClientRect().width + 5) * 2 : 140;
      grid.scrollBy({left: delta * step, behavior:'smooth'});
    }

    function v62MoveIngredientTray(gridId, direction) {
      const grid = document.getElementById(gridId);
      if (!grid) return;
      const shift = Math.max(140, Math.round(grid.clientWidth * .83));
      grid.scrollBy({left:direction * shift, behavior:'smooth'});
    }
    function v62RefreshIngredientTrays() {
      const trayIds = ['boba-tea-dispenser-strip','boba-toppings-grid','noodle-broth-grid',
        'noodle-toppings-grid','skewer-items-grid','skewer-sauce-grid'];
      trayIds.forEach(id => {
        const grid = document.getElementById(id);
        if (!grid || !grid.children.length) return;
        const wrapper = grid.parentElement;
        const heading = wrapper && (wrapper.querySelector('.v60-shelf-head, .v61-section-row, .v61-headline, .v61-tray-title, .v60-tray-head') || wrapper.parentElement?.querySelector('.v60-shelf-head, .v61-section-row, .v61-headline'));
        if (!heading) return;
        let nav = heading.querySelector(`.v62-tray-nav[data-target="${id}"]`);
        // Wait until CSS layout settles (hidden career sections have zero widths).
        const hasOverflow = grid.scrollWidth > grid.clientWidth + 9 && grid.clientWidth > 10;
        if (!hasOverflow) { if (nav) nav.remove(); return; }
        if (!nav) {
          nav = document.createElement('span');
          nav.className = 'v62-tray-nav';
          nav.dataset.target = id;
          const back = document.createElement('button');
          back.type='button'; back.textContent='‹'; back.title='Khay trước';
          back.setAttribute('aria-label','Khay nguyên liệu trước');
          back.addEventListener('click', () => v62MoveIngredientTray(id,-1));
          const forward = document.createElement('button');
          forward.type='button'; forward.textContent='›'; forward.title='Khay tiếp';
          forward.setAttribute('aria-label','Khay nguyên liệu tiếp theo');
          forward.addEventListener('click', () => v62MoveIngredientTray(id,1));
          nav.append(back,forward);
          heading.appendChild(nav);
        }
      });
    }
    function v57EnhanceTrays() {
      v57TrayIds.forEach(gridId => {
        const grid = document.getElementById(gridId);
        if (!grid || !grid.children.length) return;
        const sizeTrayTiles = () => {
          const width = grid.clientWidth;
          if (width >= 150) grid.style.setProperty('--v57-col', `${Math.min(78, Math.max(57, (width - 15) / 4)).toFixed(1)}px`);
        };
        sizeTrayTiles();
        if (!grid.dataset.v57ResizeBound && typeof ResizeObserver !== 'undefined') {
          grid.dataset.v57ResizeBound = '1';
          const observer = new ResizeObserver(sizeTrayTiles);
          observer.observe(grid);
        }
        grid.setAttribute('aria-label','Khay nguyên liệu – vuốt ngang để xem thêm');
        grid.setAttribute('tabindex','0');
        // Preserve horizontal position even when a selected topping triggers re-render.
        if (!grid.dataset.v57ScrollBound) {
          grid.dataset.v57ScrollBound = '1';
          grid.addEventListener('scroll', () => { v57TrayOffsets[gridId] = grid.scrollLeft; }, {passive:true});
        }
        if (v57TrayOffsets[gridId] != null && Math.abs(grid.scrollLeft - v57TrayOffsets[gridId]) > 8) {
          grid.scrollLeft = v57TrayOffsets[gridId];
        }
        Array.from(grid.children).forEach(tile => {
          const card = tile.matches('.ingredient-card') ? tile : tile.querySelector('.ingredient-card');
          if (!card) return;
          const name = card.querySelector('.ingredient-label')?.textContent?.trim() || 'Nguyên liệu';
          const stock = card.querySelector('.ingredient-stock')?.textContent?.trim() || '';
          const lock = card.querySelector('.ingredient-lock-text')?.textContent?.trim() || '';
          const description = [name, stock, lock ? `Chưa mở: ${lock}` : ''].filter(Boolean).join(' • ');
          card.setAttribute('title', description);
          card.setAttribute('aria-label',description);
          if (!card.matches('button')) card.setAttribute('role','group');
          card.querySelectorAll('.wb-skewer-controls button').forEach((button, idx) => {
            button.setAttribute('aria-label', `${idx === 0 ? 'Bớt' : 'Thêm'} ${name}`);
          });
          const buyBtn = tile.querySelector('.ingredient-buy');
          if (buyBtn) {
            buyBtn.textContent = '+';
            buyBtn.setAttribute('title', `Mua thêm ${name}`);
            buyBtn.setAttribute('aria-label',`Mua thêm ${name}`);
          }
        });
        const heading = grid.previousElementSibling;
        if (!heading || !heading.classList.contains('workbench-section-head')) return;
        const existing = heading.querySelector('.v57-tray-nav');
        const overflow = grid.children.length > 8;
        if (existing && !overflow) existing.remove();
        if (overflow && !existing) {
          const controls = document.createElement('span');
          controls.className = 'v57-tray-nav';
          controls.innerHTML = `<button type="button" aria-label="Khay trước" title="Khay trước" onclick="v57ScrollTray('${gridId}',-1)">‹</button><span>Vuốt</span><button type="button" aria-label="Khay tiếp" title="Khay tiếp" onclick="v57ScrollTray('${gridId}',1)">›</button>`;
          heading.appendChild(controls);
        }
      });
    }


    // V58: visual-only shop art and collapsible presets. No game-state or save change.
    function v58TogglePresets() {
      const wrap = document.querySelector('.workbench-preset-wrap.v54-compact');
      const grid = document.getElementById('workbench-preset-grid');
      const button = document.getElementById('v58-preset-toggle');
      if (!wrap || !grid || !button) return;
      const expanded = !wrap.classList.contains('v58-open');
      wrap.classList.toggle('v58-open', expanded);
      grid.hidden = !expanded;
      button.setAttribute('aria-expanded', String(expanded));
      const chevron = document.getElementById('v58-preset-chevron');
      if (chevron) chevron.textContent = expanded ? '▴' : '▾';
    }
    function v58SyncShopScene() {
      const scene = document.getElementById('v58-station-scene');
      if (!scene) return;
      const career = gameState.currentCareer || 'boba';
      scene.dataset.career = career;
      scene.setAttribute('aria-label',career === 'boba' ? 'Kệ pha chế trà sữa' : career === 'noodle' ? 'Kệ nấu mì cay' : 'Kệ nướng xiên que');
      const alt = document.getElementById('v58-station-alt');
      if (alt && alt.dataset.career !== career) {
        alt.dataset.career = career;
        alt.innerHTML = (career === 'noodle' ? ['🍜','🍲','🌶️','🥬'] : ['🍢','🥓','🧂','🔥']).map(x=>`<span>${x}</span>`).join('');
      }
    }

    function renderWorkbenchControls() {
      const career = gameState.currentCareer;
      ensureV30StarterPack();
      ensureV31StarterPack();
      let invalidStorySelection = false;
      if (workbenchDish.career !== career) invalidStorySelection = true;
      if (career === 'boba') {
        invalidStorySelection ||= !!(workbenchDish.base && !isItemStoryUnlocked(workbenchDish.base, 'boba'));
        invalidStorySelection ||= !!(workbenchDish.container && !isItemStoryUnlocked(workbenchDish.container, 'boba'));
        invalidStorySelection ||= (workbenchDish.toppings || []).some(k => !isItemStoryUnlocked(k, 'boba'));
      } else if (career === 'noodle') {
        invalidStorySelection ||= !!(workbenchDish.base && !isItemStoryUnlocked(workbenchDish.base, 'noodle'));
        invalidStorySelection ||= !!(workbenchDish.container && !isItemStoryUnlocked(workbenchDish.container, 'noodle'));
        invalidStorySelection ||= (workbenchDish.toppings || []).some(k => !isItemStoryUnlocked(k, 'noodle'));
      } else {
        const trayKey = ({plate:'tray_plate',basket:'tray_basket',box:'tray_box'}[workbenchDish.tray] || 'tray_plate');
        invalidStorySelection ||= !isItemStoryUnlocked(trayKey, 'streetfood');
        invalidStorySelection ||= !!(workbenchDish.sauce && !isItemStoryUnlocked(workbenchDish.sauce, 'streetfood'));
        invalidStorySelection ||= Object.keys(workbenchDish.skewerCounts || {}).some(k => (workbenchDish.skewerCounts[k] || 0) > 0 && !isItemStoryUnlocked(k, 'streetfood'));
      }
      if (invalidStorySelection) resetCurrentDish();

      const bobaSection = document.getElementById('workbench-career-boba');
      const noodleSection = document.getElementById('workbench-career-noodle');
      const skewerSection = document.getElementById('workbench-career-streetfood');

      if (bobaSection) bobaSection.classList.add('hidden');
      if (noodleSection) noodleSection.classList.add('hidden');
      if (skewerSection) skewerSection.classList.add('hidden');

      if (gameState.currentCareer === 'boba' && bobaSection) {
        bobaSection.classList.remove('hidden');
        renderBobaControls();
      } else if (gameState.currentCareer === 'noodle' && noodleSection) {
        noodleSection.classList.remove('hidden');
        renderNoodleControls();
      } else if (skewerSection) {
        skewerSection.classList.remove('hidden');
        renderSkewerControls();
      }
      refreshShopFloorSummary();
      v57EnhanceTrays();
      requestAnimationFrame(v62RefreshIngredientTrays);
      v58SyncShopScene();
    }

    function renderBobaControls() {
      const inv = gameState.inventory;
      const cupButtons = {
        M: document.getElementById('btn-cup-m'),
        L: document.getElementById('btn-cup-l'),
        XL: document.getElementById('btn-cup-xl')
      };
      const cupMap = { M:'cup_m', L:'cup_l', XL:'cup_xl' };
      Object.entries(cupMap).forEach(([size,key]) => {
        const stockEl = document.getElementById(`stock-${key.replace('_','-')}`);
        const unlocked = isItemStoryUnlocked(key,'boba');
        if (stockEl) stockEl.innerText = unlocked ? `📦 ${inv[key] || 0}` : `🔒 ${getStoryUnlockLabel(key,'boba')}`;
        if (cupButtons[size]) {
          cupButtons[size].classList.toggle('v60-size-muted', !unlocked);
          cupButtons[size].classList.toggle('v60-active', unlocked && workbenchDish.container === key);
        }
      });

      const teaBases = [
        { key:'tea_black', tag:'🫖', color:'#8b4a19' },
        { key:'tea_green', tag:'🍃', color:'#8ab83e' },
        { key:'tea_strawberry', tag:'🍓', color:'#d84d73' },
        { key:'tea_taro', tag:'🍠', color:'#7c6a56' },
        { key:'milk_fresh', tag:'🥛', color:'#f2eee4' },
        { key:'tea_honey', tag:'🍯', color:'#d69a27' },
        { key:'tea_oolong', tag:'🌰', color:'#a55d26' },
        { key:'tea_jasmine', tag:'🌼', color:'#d6a95f' }
      ];
      const dispenserStrip = document.getElementById('boba-tea-dispenser-strip');
      if (dispenserStrip) {
        dispenserStrip.innerHTML = teaBases.map(item => {
          const dict = ITEM_DICTIONARY[item.key] || {};
          const unlocked = isItemStoryUnlocked(item.key, 'boba');
          const isSelected = workbenchDish.base === item.key;
          const count = inv[item.key] || 0;
          const art = V30_ART[item.key];
          const shortLabel = (dict.name || item.key)
            .replace(/^Trà\s+/i,'')
            .replace(/^Sữa\s+/i,'Sữa ')
            .replace(/\s+Tươi/i,' Tươi');
          return `<button onclick="setBobaTeaBase('${item.key}')" aria-label="${dict.name || item.key} • ${unlocked ? `Còn ${count}` : 'Chưa mở'}" class="v60-disp-btn tap-scale ${isSelected && unlocked ? 'active' : ''} ${unlocked ? '' : 'story-locked'}" title="${dict.name || item.key}">
            <span class="v65-base-badge">${unlocked ? count : '🔒'}</span>
            <div class="v65-base-art-wrap">
              ${art ? `<img src="${art}" class="v65-base-art" alt="${dict.name || item.key}">` : `<span class="v60-top-emoji">${dict.icon || item.tag || '🫖'}</span>`}
            </div>
            <span class="v65-base-label">${shortLabel}</span>
            ${unlocked && count === 0 ? `<span class="v65-base-buy">+Mua</span>` : ''}
          </button>`;
        }).join('');
      }

      const toppings = [
        { key:'topping_boba' }, { key:'topping_pudding' }, { key:'topping_jelly' }, { key:'topping_white_boba' },
        { key:'topping_aloe' }, { key:'topping_redbean' }, { key:'topping_cheese_foam' }, { key:'topping_grass_jelly' },
        { key:'topping_cookie' }, { key:'topping_crystal' }, { key:'topping_mochi' }, { key:'topping_lychee' }
      ];
      const topGrid = document.getElementById('boba-toppings-grid');
      if (topGrid) {
        topGrid.innerHTML = toppings.map(top => {
          const dict = ITEM_DICTIONARY[top.key] || {};
          const unlocked = isItemStoryUnlocked(top.key,'boba');
          const selected = (workbenchDish.toppings || []).includes(top.key);
          const count = inv[top.key] || 0;
          const art = V30_ART[top.key];
          const badge = selected && unlocked ? '✓' : (!unlocked ? '🔒' : count);
          return `<button onclick="toggleDishTopping('${top.key}')" class="v60-top-card tap-scale ${selected && unlocked ? 'active' : ''} ${unlocked ? '' : 'story-locked'}" title="${dict.name || top.key}">
              ${art ? `<img src="${art}" class="v60-top-art" alt="${dict.name || top.key}">` : `<span class="v60-top-emoji">${dict.icon || '🧋'}</span>`}
              <span class="v60-top-badge">${badge}</span>
              ${unlocked && count === 0 ? `<span class="v60-top-buy">+Mua</span>` : ''}
            </button>`;
        }).join('');
      }
      refreshShopFloorSummary();
      v57EnhanceTrays();
      requestAnimationFrame(v62RefreshIngredientTrays);
    }

    function setBobaCupSize(sz) {
      const keyMap = { M:'cup_m', L:'cup_l', XL:'cup_xl' };
      const key = keyMap[sz] || 'cup_m';
      if (!isItemStoryUnlocked(key, 'boba')) return showToast(`Chưa mở ${itemLabel(key)} • ${getStoryUnlockLabel(key, 'boba')}`, '🔒');
      if ((gameState.inventory[key] || 0) <= 0) {
        openQuickRestock(key);
        return;
      }
      workbenchDish.container = key;
      ['btn-cup-m','btn-cup-l','btn-cup-xl'].forEach(id => {
        const btn = document.getElementById(id);
        if (!btn) return;
        const active = id === `btn-cup-${sz.toLowerCase()}`;
        btn.classList.toggle('v60-active', active);
        btn.classList.toggle('v60-size-muted', !active);
      });
      playSound('click');
      updateWorkbenchPreview();
    }

    function setBobaTeaBase(key) {
      if (!isItemStoryUnlocked(key, 'boba')) return showToast(`Nguyên liệu chưa mở • ${getStoryUnlockLabel(key, 'boba')}`, '🔒');
      if ((gameState.inventory[key] || 0) <= 0) {
        openQuickRestock(key);
        return;
      }
      workbenchDish.base = key;
      playSound('click');
      renderBobaControls();
      updateWorkbenchPreview();
    }

    function setBobaSugar(val) {
      workbenchDish.sugar = val;
      [30, 70, 100].forEach(v => {
        const b = document.getElementById(`btn-sugar-${v}`);
        if (b) {
          b.className = v === val ? "flex-1 py-1 rounded bg-amber-600 text-white font-bold tap-scale" : "flex-1 py-1 rounded bg-slate-700 text-white font-bold tap-scale";
        }
      });
      playSound('click');
    }

    function setBobaIce(val) {
      workbenchDish.ice = val;
      [0, 50, 100].forEach(v => {
        const b = document.getElementById(`btn-ice-${v}`);
        if (b) {
          b.className = v === val ? "flex-1 py-1 rounded bg-amber-600 text-white font-bold tap-scale" : "flex-1 py-1 rounded bg-slate-700 text-white font-bold tap-scale";
        }
      });
      playSound('click');
    }

    function toggleDishTopping(topKey) {
      const career = workbenchDish.career || gameState.currentCareer;
      if (!isItemStoryUnlocked(topKey, career)) return showToast(`Topping chưa mở • ${getStoryUnlockLabel(topKey, career)}`, '🔒');
      if (!workbenchDish.toppings) workbenchDish.toppings = [];
      const idx = workbenchDish.toppings.indexOf(topKey);
      if (idx !== -1) {
        workbenchDish.toppings.splice(idx, 1);
      } else {
        if ((gameState.inventory[topKey] || 0) <= 0) {
          openQuickRestock(topKey);
          return;
        }
        workbenchDish.toppings.push(topKey);
      }
      playSound('click');
      renderBobaControls();
      renderNoodleControls();
      updateWorkbenchPreview();
    }

    function startShakeProcess() {
      const btn = document.getElementById('btn-shake-cup');
      const st = document.getElementById('shaker-status-text');
      if (btn) btn.disabled = true;
      if (st) st.innerText = 'Đang lắc tuyết... 🌪️';
      playSound('serve');

      clearTimeout(shakeTimer);
      shakeTimer = setTimeout(() => {
        workbenchDish.isShaken = true;
        if (btn) btn.disabled = false;
        if (st) st.innerText = 'Đã lắc lạnh sâu & dập nắp ✨';
        playSound('coin');
        showToast("Ly trà sữa đã lắc lạnh sâu chuẩn vị!", "🥤");
      }, 1500);
    }

    function renderNoodleControls() {
      const inv = gameState.inventory;
      const sizeButtons = { M: document.getElementById('btn-bowl-m'), L: document.getElementById('btn-bowl-l'), XL: document.getElementById('btn-bowl-xl') };
      const bowlMap = { M:'bowl_m', L:'bowl_l', XL:'bowl_xl' };
      Object.entries(bowlMap).forEach(([size,key]) => {
        const stockEl = document.getElementById(`stock-${key.replace('_','-')}`);
        const unlocked = isItemStoryUnlocked(key, 'noodle');
        if (stockEl) stockEl.innerText = unlocked ? `📦 ${inv[key] || 0}` : `🔒 ${getStoryUnlockLabel(key,'noodle')}`;
        if (sizeButtons[size]) {
          sizeButtons[size].classList.toggle('v60-size-muted', !unlocked);
          sizeButtons[size].classList.toggle('v60-active', unlocked && workbenchDish.container === key);
        }
      });

      const broths = [
        { key: 'broth_kimchi', name: 'Kim Chi', color:'#d46639' },
        { key: 'broth_tomyum', name: 'Tom Yum', color:'#f08b33' },
        { key: 'broth_beef', name: 'Bò Sa Tế', color:'#8b4d28' },
        { key: 'broth_mushroom', name: 'Cốt Nấm', color:'#9c7b49' },
        { key: 'broth_mala', name: 'Mala', color:'#af3125' },
        { key: 'broth_collagen', name: 'Collagen', color:'#d8bb86' },
        { key: 'broth_tonkotsu', name: 'Xương Hầm', color:'#e7d7bc' },
        { key: 'broth_herbal', name: 'Thảo Mộc', color:'#6d7c41' }
      ];
      const bGrid = document.getElementById('noodle-broth-grid');
      if (bGrid) {
        bGrid.innerHTML = broths.map(item => {
          const dict = ITEM_DICTIONARY[item.key] || {};
          const unlocked = isItemStoryUnlocked(item.key, 'noodle');
          const isSelected = workbenchDish.base === item.key;
          const count = inv[item.key] || 0;
          return `<button onclick="setNoodleBroth('${item.key}')" class="v61-broth-card tap-scale ${unlocked ? '' : 'story-locked'} ${isSelected && unlocked ? 'active' : ''}" title="${item.name}">
            <div class="v61-broth-jar v65-broth-bowl">${V65_ART[item.key] ? `<img src="${V65_ART[item.key]}" class="v65-broth-art" alt="${item.name}" loading="lazy">` : `<span class="v61-broth-liquid" style="background:${item.color}"></span>`}</div>
            <span class="v61-broth-tag">${dict.icon || '🍲'} ${item.name}</span>
            <span class="${unlocked ? 'v61-broth-badge' : 'v61-lock-badge'}">${unlocked ? count : '🔒'}</span>
          </button>`;
        }).join('');
      }

      const spBtns = document.getElementById('noodle-spicy-buttons');
      if (spBtns) {
        spBtns.innerHTML = '';
        for (let i = 0; i <= 7; i++) {
          const isSel = workbenchDish.spicyLevel === i;
          spBtns.innerHTML += `<button onclick="setNoodleSpicyLevel(${i})" class="v61-spice-btn tap-scale ${isSel ? 'active' : ''}">${i}</button>`;
        }
      }

      const noodleTops = [
        { key: 'ntop_beef', name: 'Bò Mỹ' }, { key: 'ntop_shrimp', name: 'Tôm Sú' }, { key: 'ntop_squid', name: 'Mực' }, { key: 'ntop_fishcake', name: 'Chả Cá' },
        { key: 'ntop_sausage', name: 'Xúc Xích' }, { key: 'ntop_enoki', name: 'Nấm Kim' }, { key: 'ntop_egg', name: 'Trứng' }, { key: 'ntop_cheese', name: 'Phô Mai' },
        { key: 'ntop_tofu', name: 'Đậu Hũ Non' }, { key: 'ntop_bokchoy', name: 'Cải Thìa' }, { key: 'ntop_crabstick', name: 'Thanh Cua' }, { key: 'ntop_nori', name: 'Rong Biển' },
        { key: 'ntop_meatball', name: 'Thịt Viên' }, { key: 'ntop_corn', name: 'Bắp Ngọt' }, { key: 'ntop_dumpling', name: 'Há Cảo' }, { key: 'ntop_porkbelly', name: 'Ba Chỉ Heo' }
      ];
      const ntopGrid = document.getElementById('noodle-toppings-grid');
      if (ntopGrid) {
        ntopGrid.innerHTML = noodleTops.map(top => {
          const dict = ITEM_DICTIONARY[top.key] || {};
          const unlocked = isItemStoryUnlocked(top.key, 'noodle');
          const selected = (workbenchDish.toppings || []).includes(top.key);
          const count = inv[top.key] || 0;
          const art = V65_ART[top.key] || V30_ART[top.key];
          return `<button onclick="toggleDishTopping('${top.key}')" aria-label="${top.name} • ${unlocked ? `Còn ${count}` : 'Chưa mở'}" class="v61-top-card tap-scale ${unlocked ? '' : 'story-locked'} ${selected && unlocked ? 'active' : ''}" title="${top.name}">
            ${art ? `<img src="${art}" class="v61-top-art v65-ingredient-art" alt="${top.name}" loading="lazy">` : `<span class="v61-top-emoji">${dict.icon || '🍥'}</span>`}
            <span class="v61-top-badge">${unlocked ? (selected ? '✓' : count) : '🔒'}</span>
            ${unlocked && count === 0 ? `<span class="v61-top-buy">+Mua</span>` : ''}
          </button>`;
        }).join('');
      }
      refreshShopFloorSummary();
      v57EnhanceTrays();
      requestAnimationFrame(v62RefreshIngredientTrays);
    }

    function setNoodleBowlSize(sz) {
      const keyMap = { M:'bowl_m', L:'bowl_l', XL:'bowl_xl' };
      const key = keyMap[sz] || 'bowl_m';
      if (!isItemStoryUnlocked(key, 'noodle')) return showToast(`Chưa mở ${itemLabel(key)} • ${getStoryUnlockLabel(key, 'noodle')}`, '🔒');
      if ((gameState.inventory[key] || 0) <= 0) {
        openQuickRestock(key);
        return;
      }
      workbenchDish.container = key;
      ['btn-bowl-m','btn-bowl-l','btn-bowl-xl'].forEach(id => {
        const btn = document.getElementById(id);
        if (!btn) return;
        const active = id === `btn-bowl-${sz.toLowerCase()}`;
        btn.classList.toggle('v60-active', active);
        btn.classList.toggle('v60-size-muted', !active);
      });
      playSound('click');
      updateWorkbenchPreview();
    }

    function setNoodleBroth(key) {
      if (!isItemStoryUnlocked(key, 'noodle')) return showToast(`Nguyên liệu chưa mở • ${getStoryUnlockLabel(key, 'noodle')}`, '🔒');
      if ((gameState.inventory[key] || 0) <= 0) {
        openQuickRestock(key);
        return;
      }
      workbenchDish.base = key;
      playSound('click');
      renderNoodleControls();
      updateWorkbenchPreview();
    }

    function setNoodleSpicyLevel(lvl) {
      workbenchDish.spicyLevel = lvl;
      const txt = document.getElementById('noodle-spicy-level-text');
      if (txt) {
        if (lvl === 0) txt.innerText = 'Cấp 0 (Không Cay)';
        else if (lvl <= 3) txt.innerText = `Cấp ${lvl} (Cay Vừa)`;
        else txt.innerText = `Cấp ${lvl} (Cay Xé Lưỡi 🌶️)`;
      }
      playSound('click');
      renderNoodleControls();
    }

    function startCookNoodleProcess() {
      const btn = document.getElementById('btn-cook-noodle');
      const statusTxt = document.getElementById('noodle-cook-status');
      if (btn) btn.disabled = true;
      if (statusTxt) statusTxt.innerText = 'Đang nấu sôi... 🔥';
      playSound('serve');

      clearTimeout(noodleCookTimer);
      noodleCookTimer = setTimeout(() => {
        workbenchDish.isCooked = true;
        if (btn) btn.disabled = false;
        if (statusTxt) statusTxt.innerText = 'Thố đất sôi sùng sục! 🍲';
        playSound('coin');
        showToast("Thố mì cay đã sôi hoàn hảo!", "🍜");
      }, 1500);
    }

    function renderSkewerControls() {
      const inv = gameState.inventory;
      const mapBtns = [['plate','tray_plate','btn-tray-plate'],['basket','tray_basket','btn-tray-basket'],['box','tray_box','btn-tray-box']];
      mapBtns.forEach(([type,key,id]) => {
        const stockEl = document.getElementById(`stock-${type === 'plate' ? 'tray-plate' : type === 'basket' ? 'tray-basket' : 'tray-box'}`);
        const unlocked = isItemStoryUnlocked(key, 'streetfood');
        if (stockEl) stockEl.innerText = unlocked ? `📦 ${inv[key] || 0}` : `🔒 ${getStoryUnlockLabel(key,'streetfood')}`;
        const btn = document.getElementById(id);
        if (btn) {
          btn.classList.toggle('v60-size-muted', !unlocked);
          btn.classList.toggle('v60-active', unlocked && workbenchDish.tray === type);
        }
      });

      const skewerList = [
        { key: 'skewer_fish', name: 'Cá Viên' }, { key: 'skewer_beef', name: 'Bò Viên' }, { key: 'skewer_shrimp', name: 'Tôm Viên' }, { key: 'skewer_holo', name: 'Hồ Lô' },
        { key: 'skewer_sausage', name: 'Xúc Xích' }, { key: 'skewer_tofu', name: 'Đậu Hũ' }, { key: 'skewer_quail', name: 'Trứng Cút' }, { key: 'skewer_beef_enoki', name: 'Bò Nấm' },
        { key: 'skewer_corn', name: 'Bắp' }, { key: 'skewer_chicken', name: 'Gà Xiên' }, { key: 'skewer_crabstick', name: 'Thanh Cua' }, { key: 'skewer_okra', name: 'Đậu Bắp' },
        { key: 'skewer_cheese_sausage', name: 'Xúc Xích PM' }, { key: 'skewer_mushroom', name: 'Nấm Nướng' }, { key: 'skewer_bacon_okra', name: 'Cuộn Bắp' }, { key: 'skewer_squid', name: 'Mực Xiên' }
      ];
      const skGrid = document.getElementById('skewer-items-grid');
      if (skGrid) {
        if (!workbenchDish.skewerCounts) workbenchDish.skewerCounts = {};
        skGrid.innerHTML = skewerList.map(item => {
          const dict = ITEM_DICTIONARY[item.key] || {};
          const unlocked = isItemStoryUnlocked(item.key, 'streetfood');
          const qty = workbenchDish.skewerCounts[item.key] || 0;
          const count = inv[item.key] || 0;
          const art = V65_ART[item.key] || V30_ART[item.key];
          return `<div class="v61-skewer-card ${unlocked ? '' : 'story-locked'}">
              ${art ? `<img src="${art}" class="v61-skewer-art v65-skewer-art" alt="${item.name}" loading="lazy">` : `<span class="v61-skewer-emoji">${dict.icon || '🍢'}</span>`}
              <div class="v61-skewer-name">${item.name}</div>
              ${unlocked ? `<span class="v61-stock-inline">${count}</span>
                <div class="v61-stepper">
                  <button onclick="adjustSkewerCount('${item.key}', -1)" class="v61-stepper-btn tap-scale">−</button>
                  <span class="v61-stepper-val">${qty}</span>
                  <button onclick="adjustSkewerCount('${item.key}', 1)" class="v61-stepper-btn tap-scale">+</button>
                </div>
                ${count === 0 ? `<button onclick="openQuickRestock('${item.key}')" class="v61-top-buy v62-restock-btn tap-scale" aria-label="Nhập thêm ${item.name}">+Mua</button>` : ''}` : `<span class="v61-top-badge">🔒</span>`}
            </div>`;
        }).join('');
      }

      const sauces = [
        { key: 'sauce_sweet_chili', name: 'Cay Ngọt' }, { key: 'sauce_tamarind', name: 'Sốt Me' }, { key: 'sauce_butter_garlic', name: 'Bơ Tỏi' }, { key: 'sauce_cheese', name: 'Phô Mai' },
        { key: 'sauce_satay', name: 'Sa Tế' }, { key: 'sauce_mayo', name: 'Mayo Cay' }, { key: 'sauce_honey_mustard', name: 'Mật Ong' }, { key: 'sauce_bbq', name: 'BBQ' }
      ];
      const sGrid = document.getElementById('skewer-sauce-grid');
      if (sGrid) {
        sGrid.innerHTML = sauces.map(s => {
          const dict = ITEM_DICTIONARY[s.key] || {};
          const unlocked = isItemStoryUnlocked(s.key, 'streetfood');
          const isSel = workbenchDish.sauce === s.key;
          const art = V65_ART[s.key] || V30_ART[s.key];
          return `<button onclick="setSkewerSauce('${s.key}')" class="v61-sauce-card tap-scale ${unlocked ? '' : 'story-locked'} ${isSel && unlocked ? 'active' : ''}" title="${s.name}">
             ${art ? `<img src="${art}" class="v61-top-art v65-ingredient-art" alt="${s.name}" loading="lazy">` : `<span class="v61-top-emoji">${dict.icon || '🥫'}</span>`}
             <span class="v61-top-badge">${unlocked ? (inv[s.key] || 0) : '🔒'}</span>
          </button>`;
        }).join('');
      }
      v57EnhanceTrays();
      requestAnimationFrame(v62RefreshIngredientTrays);
    }

    function setSkewerTray(type) {
      const keyMap = { plate:'tray_plate', basket:'tray_basket', box:'tray_box' };
      const key = keyMap[type] || 'tray_plate';
      if (!isItemStoryUnlocked(key, 'streetfood')) return showToast(`Chưa mở ${itemLabel(key)} • ${getStoryUnlockLabel(key, 'streetfood')}`, '🔒');
      if ((gameState.inventory[key] || 0) <= 0) {
        openQuickRestock(key);
        return;
      }
      workbenchDish.tray = type;
      ['btn-tray-plate','btn-tray-basket','btn-tray-box'].forEach(id => {
        const btn = document.getElementById(id);
        if (!btn) return;
        const active = id === `btn-tray-${type}`;
        btn.classList.toggle('v60-active', active);
        btn.classList.toggle('v60-size-muted', !active);
      });
      playSound('click');
      updateWorkbenchPreview();
    }

    function adjustSkewerCount(key, delta) {
      if (!isItemStoryUnlocked(key, 'streetfood')) return showToast(`Nguyên liệu chưa mở • ${getStoryUnlockLabel(key, 'streetfood')}`, '🔒');
      if (!workbenchDish.skewerCounts) workbenchDish.skewerCounts = {};
      const cur = workbenchDish.skewerCounts[key] || 0;
      if (delta > 0 && cur >= (gameState.inventory[key] || 0)) {
        openQuickRestock(key);
        return;
      }
      workbenchDish.skewerCounts[key] = Math.max(0, cur + delta);
      playSound('click');
      renderSkewerControls();
      updateWorkbenchPreview();
    }

    function setFryHeat(temp) {
      workbenchDish.fryHeat = temp;
      [140, 170, 200].forEach(t => {
        const b = document.getElementById(`btn-heat-${t}`);
        if (b) {
          b.className = t === temp ? 'v61-heat-btn tap-scale active' : 'v61-heat-btn tap-scale';
        }
      });
      playSound('click');
    }

    function setSkewerSauce(key) {
      if (!isItemStoryUnlocked(key, 'streetfood')) return showToast(`Sốt chưa mở • ${getStoryUnlockLabel(key, 'streetfood')}`, '🔒');
      workbenchDish.sauce = key;
      playSound('click');
      renderSkewerControls();
      updateWorkbenchPreview();
    }

    function startFryProcess() {
      const bStart = document.getElementById('btn-start-fry');
      const bPull = document.getElementById('btn-pull-fry');
      const fTxt = document.getElementById('fry-status-txt');
      const bar = document.getElementById('fry-progress-bar');

      if (bStart) bStart.disabled = true;
      if (bPull) {
        bPull.disabled = false;
        bPull.className = "px-2 py-0.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[9px] rounded-lg tap-scale";
      }
      if (fTxt) fTxt.innerText = 'Đang chiên... 🫧';
      playSound('serve');

      clearInterval(fryInterval);
      workbenchDish.fryProgress = 0;
      fryInterval = setInterval(() => {
        workbenchDish.fryProgress += 4;
        if (bar) bar.style.width = `${Math.min(100, workbenchDish.fryProgress)}%`;

        if (workbenchDish.fryProgress >= 100) {
          clearInterval(fryInterval);
          workbenchDish.fryState = 'burnt';
          if (fTxt) fTxt.innerText = 'Khét lẹt! Cháy đen 🔥';
          if (bar) bar.className = "bg-rose-600 h-full w-[100%]";
          playSound('error');
        } else if (workbenchDish.fryProgress >= 65) {
          if (fTxt) fTxt.innerText = 'Vàng giòn! Vớt ngay ✨';
          if (bar) bar.className = "bg-emerald-500 h-full";
        }
      }, 100);
    }

    function pullFryProcess() {
      clearInterval(fryInterval);
      const bStart = document.getElementById('btn-start-fry');
      const bPull = document.getElementById('btn-pull-fry');
      const fTxt = document.getElementById('fry-status-txt');

      if (bStart) bStart.disabled = false;
      if (bPull) {
        bPull.disabled = true;
        bPull.className = "px-2 py-0.5 bg-slate-700 text-slate-400 font-bold text-[9px] rounded-lg tap-scale";
      }

      if (workbenchDish.fryProgress < 50) {
        workbenchDish.fryState = 'undercooked';
        if (fTxt) fTxt.innerText = 'Chưa chín tới! Ngậm dầu';
        playSound('error');
      } else if (workbenchDish.fryProgress <= 90) {
        workbenchDish.fryState = 'perfect';
        if (fTxt) fTxt.innerText = 'Vàng rụm giòn tan! ⭐';
        playSound('coin');
      } else {
        workbenchDish.fryState = 'burnt';
        if (fTxt) fTxt.innerText = 'Khét lẹt than củi!';
        playSound('error');
      }
      updateWorkbenchPreview();
    }

    function randomChoice(list) {
      return list[Math.floor(Math.random() * list.length)];
    }

    function randomUniqueChoices(list, count) {
      const copy = [...list];
      const picked = [];
      while (copy.length && picked.length < count) {
        const idx = Math.floor(Math.random() * copy.length);
        picked.push(copy.splice(idx, 1)[0]);
      }
      return picked;
    }

    function itemLabel(key) {
      return (ITEM_DICTIONARY[key] && ITEM_DICTIONARY[key].name) || key;
    }

    function createCustomerOrder(career, customer) {
      const unlockedRecipes = getUnlockedRecipes(career);
      if (unlockedRecipes.length) {
        // 85% gọi món theo công thức đã mở; 15% là đơn biến tấu để giữ cảm giác sáng tạo.
        if (Math.random() < .85) {
          const recipe = randomChoice(unlockedRecipes);
          return buildRecipeOrder(recipe, customer);
        }
      }

      if (career === 'boba') {
        const toppingPool = getUnlockedItemKeys(['topping_boba','topping_white_boba','topping_pudding','topping_jelly','topping_cheese_foam','topping_redbean','topping_grass_jelly','topping_aloe','topping_cookie','topping_crystal','topping_mochi','topping_lychee'], 'boba');
        const toppingCount = Math.floor(Math.random() * 3);
        return {
          career,
          recipeName:'Món Biến Tấu',
          container: randomChoice(getUnlockedItemKeys(['cup_m','cup_l','cup_xl'], 'boba')),
          base: randomChoice(getUnlockedItemKeys(['tea_black','tea_green','tea_strawberry','tea_taro','milk_fresh','tea_honey','tea_oolong','tea_jasmine','tea_matcha'], 'boba')),
          sugar: randomChoice([30, 70, 100]),
          ice: randomChoice([0, 50, 100]),
          toppings: randomUniqueChoices(toppingPool, toppingCount),
          requiresShaken: true,
          maxPrice: customer.budget
        };
      }

      if (career === 'noodle') {
        const toppingPool = getUnlockedItemKeys(['ntop_beef','ntop_shrimp','ntop_squid','ntop_fishcake','ntop_sausage','ntop_enoki','ntop_egg','ntop_cheese','ntop_tofu','ntop_bokchoy','ntop_crabstick','ntop_nori','ntop_meatball','ntop_corn','ntop_dumpling','ntop_porkbelly'], 'noodle');
        const toppingCount = Math.floor(Math.random() * 3);
        return {
          career,
          recipeName:'Mì Biến Tấu',
          container: randomChoice(getUnlockedItemKeys(['bowl_m','bowl_l','bowl_xl'], 'noodle')),
          base: randomChoice(getUnlockedItemKeys(['broth_kimchi','broth_tomyum','broth_beef','broth_mushroom','broth_mala','broth_collagen','broth_tonkotsu','broth_herbal'], 'noodle')),
          spicyLevel: Math.floor(Math.random() * 8),
          toppings: randomUniqueChoices(toppingPool, toppingCount),
          requiresCooked: true,
          maxPrice: customer.budget
        };
      }

      const skewerPool = getUnlockedItemKeys(['skewer_fish','skewer_beef','skewer_shrimp','skewer_holo','skewer_sausage','skewer_tofu','skewer_quail','skewer_beef_enoki','skewer_corn','skewer_chicken','skewer_crabstick','skewer_okra','skewer_cheese_sausage','skewer_mushroom','skewer_bacon_okra','skewer_squid'], 'streetfood');
      const chosen = randomUniqueChoices(skewerPool, Math.random() < 0.55 ? 1 : 2);
      const skewerCounts = {};
      let remaining = randomChoice([2, 3, 4, 5]);
      chosen.forEach((key, idx) => {
        if (idx === chosen.length - 1) {
          skewerCounts[key] = remaining;
        } else {
          const qty = Math.max(1, Math.min(3, remaining - (chosen.length - idx - 1)));
          const pickedQty = 1 + Math.floor(Math.random() * qty);
          skewerCounts[key] = pickedQty;
          remaining -= pickedQty;
        }
      });
      return {
        career:'streetfood',
        recipeName:'Mẹt Biến Tấu',
        tray:randomChoice(getUnlockedItemKeys(['tray_plate','tray_basket','tray_box'], 'streetfood').map(k => ({tray_plate:'plate',tray_basket:'basket',tray_box:'box'}[k]))),
        sauce:randomChoice(getUnlockedItemKeys(['sauce_sweet_chili','sauce_tamarind','sauce_butter_garlic','sauce_cheese','sauce_satay','sauce_mayo','sauce_honey_mustard','sauce_bbq'], 'streetfood')),
        skewerCounts,
        requiredFryState:'perfect',
        maxPrice:customer.budget
      };
    }

    function formatCustomerOrder(order) {
      if (!order) return 'Cho tôi một phần món đúng yêu cầu nhé!';

      if (order.career === 'boba') {
        const topText = order.toppings.length ? order.toppings.map(itemLabel).join(' + ') : 'không topping';
        const size = ({cup_m:'M',cup_l:'L',cup_xl:'XL'}[order.container]) || 'M';
        return `${order.recipeName ? `📖 ${order.recipeName}: ` : ''}${itemLabel(order.base)} size ${size}, đường ${order.sugar}%, đá ${order.ice}%, ${topText}. Nhớ lắc hoàn chỉnh nhé! Tối đa ${order.maxPrice} Xu.`;
      }

      if (order.career === 'noodle') {
        const topText = order.toppings.length ? order.toppings.map(itemLabel).join(' + ') : 'không topping';
        const size = ({bowl_m:'M',bowl_l:'L',bowl_xl:'XL'}[order.container]) || 'M';
        return `${order.recipeName ? `📖 ${order.recipeName}: ` : ''}${itemLabel(order.base)} thố ${size}, cay cấp ${order.spicyLevel}, ${topText}. Phải nấu chín nhé! Tối đa ${order.maxPrice} Xu.`;
      }

      const skewers = Object.entries(order.skewerCounts)
        .map(([key, qty]) => `${qty} ${itemLabel(key)}`)
        .join(' + ');
      const tray = ({plate:'đĩa giấy',basket:'mẹt tre',box:'hộp mang đi'}[order.tray]) || 'đĩa giấy';
      return `${order.recipeName ? `📖 ${order.recipeName}: ` : ''}${skewers}, đựng ${tray}, sốt ${itemLabel(order.sauce)}. Chiên vàng giòn đúng độ nhé! Tối đa ${order.maxPrice} Xu.`;
    }

    function sameStringSet(a = [], b = []) {
      const aa = [...a].sort();
      const bb = [...b].sort();
      return aa.length === bb.length && aa.every((v, i) => v === bb[i]);
    }

    function normalizedCountMap(map = {}) {
      const out = {};
      Object.keys(map).forEach(key => {
        const qty = Number(map[key]) || 0;
        if (qty > 0) out[key] = qty;
      });
      return out;
    }

    function sameCountMap(a = {}, b = {}) {
      const aa = normalizedCountMap(a);
      const bb = normalizedCountMap(b);
      const ak = Object.keys(aa).sort();
      const bk = Object.keys(bb).sort();
      return ak.length === bk.length && ak.every((key, i) => key === bk[i] && aa[key] === bb[key]);
    }

    function validatePlayerDishAgainstOrder(dish, order) {
      const issues = [];
      const addIssue = (code, label, severity = 1) => issues.push({ code, label, severity });

      if (!order) {
        return { accepted: false, mismatches: ['Không tìm thấy dữ liệu đơn của khách.'], issues: [{ code: 'missing_order', label: 'không có dữ liệu đơn', severity: 3 }] };
      }
      if (order.career !== gameState.currentCareer) {
        return { accepted: false, mismatches: ['Sai loại quán/nghề so với đơn khách.'], issues: [{ code: 'wrong_career', label: 'sai loại quán/nghề', severity: 3 }] };
      }

      if (order.career === 'boba') {
        if (dish.container !== order.container) addIssue('container', 'sai cỡ ly', 1);
        if (dish.base !== order.base) addIssue('base', 'sai cốt trà', 2);
        if (dish.sugar !== order.sugar) addIssue('sugar', 'khác mức đường', 1);
        if (dish.ice !== order.ice) addIssue('ice', 'khác mức đá', 1);
        if (!sameStringSet(dish.toppings || [], order.toppings || [])) addIssue('toppings', 'biến tấu topping', 2);
        if (order.requiresShaken && !dish.isShaken) addIssue('finish', 'chưa lắc/dập nắp', 3);
      } else if (order.career === 'noodle') {
        if (dish.container !== order.container) addIssue('container', 'sai cỡ thố', 1);
        if (dish.base !== order.base) addIssue('base', 'sai nước lèo', 2);
        if (dish.spicyLevel !== order.spicyLevel) addIssue('spice', 'khác cấp cay', 1);
        if (!sameStringSet(dish.toppings || [], order.toppings || [])) addIssue('toppings', 'biến tấu topping', 2);
        if (order.requiresCooked && !dish.isCooked) addIssue('finish', 'mì chưa nấu chín', 3);
      } else {
        if (dish.tray !== order.tray) addIssue('container', 'khác loại khay/mẹt', 1);
        if (dish.sauce !== order.sauce) addIssue('sauce', 'đổi loại sốt', 1);
        if (!sameCountMap(dish.skewerCounts || {}, order.skewerCounts || {})) addIssue('skewers', 'khác loại hoặc số lượng xiên', 2);
        if (dish.fryState !== order.requiredFryState) addIssue('finish', 'độ chín không đạt', 3);
      }

      return {
        accepted: issues.length === 0,
        exact: issues.length === 0,
        mismatches: issues.map(x => x.label),
        issues
      };
    }

    const CUSTOMER_TOLERANCE = {
      easy:        { label: 'Dễ Tính', maxMinor: 2, maxMajor: 1, maxSeverity: 4, maxPriceRatio: 1.12 },
      moderate:    { label: 'Thoải Mái', maxMinor: 2, maxMajor: 1, maxSeverity: 3, maxPriceRatio: 1.07 },
      strict:      { label: 'Khó Tính', maxMinor: 1, maxMajor: 0, maxSeverity: 1, maxPriceRatio: 1.02 },
      very_strict: { label: 'Rất Khó', maxMinor: 0, maxMajor: 0, maxSeverity: 0, maxPriceRatio: 1.00 }
    };

    // === V85: Lời nhận xét có cá tính, bám sát chất lượng món và tình huống ===
    // Chỉ thay nội dung đánh giá, không thay đổi luật chấm sao/thanh toán.
    const V85_NPC_VOICE = {
      linh:'lanh', minh:'game', an:'coc', ha:'co', tuan:'gym', na:'be',
      phuc_str:'stream', vy_bank:'sang', mai_art:'tho', khoa_ship:'duong',
      khai_si:'buon', ba_sau:'ba', ong_bay:'ba', huong_food:'reviewer',
      yuki:'dukhach', duc_tech:'game', lan_doctor:'kho', tu_tho:'duong',
      ngoc_idol:'stream', loan_cho:'coc', bao_phuot:'duong', thao_mom:'co',
      nam_farmer:'ba', hanh_law:'kho', tom_travel:'dukhach', chi_bep:'reviewer',
      tram_hoa:'tho', vinh_buudien:'duong', bich_homestay:'sang',
      huy_kientruc:'tho', co_lien_ncc:'buon', chef_quang:'reviewer',
      ken_dukhach:'stream', ong_chutich:'kho'
    };
    const V85_VOICES = {
      lanh:{label:'Lém lỉnh',great:[
        'Ủa alo, ai cho phép món này ngon hơn kỳ vọng vậy?', 'Xin lỗi nha, em vừa ăn vừa cười như trúng số.',
        'Quán ơi, món này có bỏ bùa mê hông? Em quay lại đó!', 'Tui tính ăn một lần thôi, ai dè đang tính lần thứ hai.',
        'Món này mà có fanclub chắc tui làm chủ tịch luôn!'],
        mild:['Ăn ổn áp, chưa đến mức phải viết thư tình cho đầu bếp.', 'Có điểm cộng nha, nhưng tui vẫn đang soi một xíu.',
        'Ngon đó, cho quán một cái tim bé bé trước.', 'Hơi tiếc chút, còn lại tui chấm được á.', 'Ê, hứa lần sau tốt hơn là tui ghé tiếp!'],
        changed:['Tui gọi một đường mà món đi đường khác, may vẫn ăn được.', 'Ủa món tui dặn đang chơi trốn tìm hay sao á?',
        'Hơi lạc đề nha quán, mà vẫn cứu được ván này.', 'Có biến tấu bất ngờ, tim tui vừa đánh rơi một nhịp.',
        'Tui không giận, nhưng công thức này làm tui lú một chút.'],
        reject:['Đặt một kiểu, nhận một kiểu. Em xin rút khỏi cuộc chơi!', 'Món này làm tui đứng hình mất năm giây luôn á.',
        'Tui cười không nổi rồi, món chưa đúng nha.', 'Hôm nay vũ trụ chưa muốn tui ăn món này.',
        'Quán ơi, cú plot twist này tui không đặt vé xem!']},
      game:{label:'Game thủ',great:['Món này đúng chuẩn S-rank, buff tinh thần 200%!', 'Pha này gánh team đẹp quá, MVP thuộc về bếp.',
        'Perfect combo! Ăn xong chắc leo rank mượt.', 'Không lag, không lỗi, món đạt full điểm!',
        'Chef xử lý đơn này như speedrun world record.'],
        mild:['Ván này thắng, nhưng chưa phải flawless.', 'Ổn áp, được cộng điểm kỹ năng nấu.',
        'Có vài chi tiết cần patch ở bản sau.', 'Món khá, thiếu chút combo để lên S-rank.',
        'Game chưa over, nhưng tui muốn bản cập nhật tốt hơn.'],
        changed:['Sai một thông số rồi, vẫn cố cứu ván được.', 'Có chi tiết lệch meta nhưng may chưa thua.',
        'Bếp vừa random build thay vì làm theo nhiệm vụ.', 'Pha này có bug nhẹ, tui vẫn nhận.',
        'Đơn hàng bị lệch quest, đánh giá tụt một bậc.'],
        reject:['Đơn này fail nhiệm vụ chính rồi!', 'Sai build, sai chiến thuật, tui xin thoát trận.',
        'Game over: món không đáp ứng yêu cầu.', 'Lỗi nghiêm trọng, không thể nhấn nút nhận phần thưởng.',
        'Bản nấu này cần rollback khẩn cấp.']},
      kho:{label:'Nghiêm túc',great:['Đúng yêu cầu, phục vụ chỉn chu. Tôi đánh giá cao.', 'Các chi tiết đều hợp lý và có sự đầu tư.',
        'Đơn hàng chuẩn xác, trải nghiệm rất tốt.', 'Tôi hài lòng vì quán giữ đúng cam kết.',
        'Chất lượng tốt, xứng đáng được ghi nhận.'],
        mild:['Chất lượng khá, vẫn có điểm cần hoàn thiện.', 'Tôi ghi nhận nỗ lực, nhưng còn một chút bất tiện.',
        'Đạt mức chấp nhận, chưa phải xuất sắc.', 'Lần này ổn, hy vọng quán duy trì sự cẩn thận.',
        'Trải nghiệm tương đối tốt, cần nhất quán hơn.'],
        changed:['Tôi đồng ý nhận, nhưng đây chưa phải món đã đặt.', 'Có khác biệt so với yêu cầu, cần xác nhận trước.',
        'Quán nên đối chiếu đơn trước khi phục vụ.', 'Tôi linh động lần này, không có nghĩa món hoàn toàn đúng.',
        'Chi tiết bị thay đổi làm giảm trải nghiệm.'],
        reject:['Tôi không thể nhận một món khác với đơn đã gọi.', 'Chất lượng hiện tại không đạt yêu cầu.',
        'Xin kiểm tra lại quy trình trước khi giao món.', 'Tôi từ chối vì thông tin đơn không được tuân thủ.',
        'Phần phục vụ này chưa đủ điều kiện để thanh toán.']},
      co:{label:'Nhẹ nhàng',great:['Khéo tay quá con, ăn thấy dễ chịu ghê.', 'Món ngon, cô có lời khen cho quán mình nhé.',
        'Làm đúng ý khách thế này là quý lắm.', 'Món dễ ăn, sạch sẽ, cô rất ưng.',
        'Cứ giữ tay nghề này, cô còn ghé dài dài.'],
        mild:['Cũng khá đó con, lần sau chú ý thêm chút nhé.', 'Cô ăn được, nhưng còn điều muốn góp ý.',
        'Tốt rồi, chỉ cần chỉnh thêm một tẹo.', 'Cô cho điểm khá, mong con tiếp tục cố gắng.',
        'Món ổn, hơi tiếc một chi tiết nho nhỏ.'],
        changed:['Cô gọi kiểu khác cơ, lần này cô thông cảm.', 'Con nhớ kiểm tra lại ghi chú của khách nhé.',
        'Lần sau hỏi cô trước khi thay đổi món nha.', 'Món có chút khác ý, cô vẫn thử được.',
        'Cô nhận nhé, nhưng đừng để khách khác gặp nhầm.'],
        reject:['Cô xin phép không lấy, món này chưa đúng con ạ.', 'Con làm lại cho đúng giúp cô vào dịp sau nhé.',
        'Tiếc quá, cô không ăn được kiểu này.', 'Cô không trách, nhưng phần này cô phải trả lại.',
        'Phục vụ cẩn thận hơn nhé, cô chưa nhận được.']},
      gym:{label:'Năng động',great:['Món này nạp năng lượng còn đã hơn pre-workout!', 'Đúng bài, ăn xong muốn tập thêm một hiệp.',
        'Protein tinh thần tăng vùn vụt, duyệt!', 'Chuẩn form luôn, khỏi phải chỉnh động tác.',
        'Món sạch đẹp, tôi chấm đủ set đủ rep!'],
        mild:['Form tạm ổn, còn cần tập thêm vài buổi.', 'Đạt chuẩn cơ bản, nhưng chưa bùng nổ.',
        'Vị khá đấy, lần sau tập trung vào chi tiết.', 'Ăn được, tuy chưa phá kỷ lục cá nhân.',
        'Điểm cộng cho nỗ lực, điểm trừ cho sơ suất.'],
        changed:['Bài tập giao squat mà quán cho deadlift rồi.', 'Sai giáo án một chút, tôi vẫn theo được.',
        'Một chi tiết lệch chế độ ăn, may vẫn chấp nhận được.', 'Nội dung khẩu phần chưa đúng kế hoạch.',
        'Lần sau kiểm tra macros của đơn giúp nha.'],
        reject:['Sai giáo án hoàn toàn, tôi không nạp phần này.', 'Phần này không phù hợp với mục tiêu của tôi.',
        'Đừng bắt tôi ăn món sai yêu cầu như cheat day bất đắc dĩ!', 'Set này phải hủy thôi.',
        'Tôi cần đúng món, không phải bốc thăm khẩu phần.']},
      be:{label:'Dễ thương',great:['Oaaaa, ngon như được thưởng sao luôn ạ!', 'Con cho quán mười trái tim luôn!',
        'Ăn xong con muốn rủ cả lớp tới!', 'Món này đáng yêu quá trời quá đất!',
        'Con sẽ khoe với mẹ là hôm nay ăn siêu ngon!'],
        mild:['Ngon ạ, nhưng con còn muốn ngon hơn xí nữa.', 'Con thích, chỉ hơi buồn một tẹo thôi.',
        'Con cho quán một hình mặt cười nha!', 'Cũng ngon đó ạ, nhưng chưa phải nhất!',
        'Con sẽ thử lại, lần sau làm xinh hơn nhé!'],
        changed:['Ơ, con nhớ gọi khác mà ta?', 'Topping của con đi lạc đâu rồi ạ?',
        'Con hơi ngạc nhiên nhưng vẫn ăn được ạ.', 'Sao món hôm nay khác lời con dặn vậy?',
        'Con nhận nha, nhưng lần sau nhớ nghe con kể hết ạ!'],
        reject:['Huhu, không đúng món con mong chờ!', 'Con không ăn được kiểu này đâu ạ.',
        'Sai rồi, con buồn xíu đó!', 'Con muốn món của con cơ, không phải món này.',
        'Con xin phép không nhận nha quán ơi.']},
      stream:{label:'Streamer',great:['Chat ơi, món này xứng đáng lên xu hướng!', 'Đang live mà phải dừng nói vì ngon quá!',
        'Fan ơi spam tim cho bếp đi nào!', 'Không quảng cáo nha, nhưng pha này đỉnh thật!',
        'Clip review này chắc ai cũng đòi địa chỉ quán.'],
        mild:['Chat chấm bao nhiêu? Tôi cho điểm khá nhé.', 'Lên sóng được, nhưng chưa có cú wow.',
        'Mọi người nhìn này, món ổn mà còn chút trừ điểm.', 'Cảnh quay đẹp nhưng phần ăn cần chỉnh nhẹ.',
        'Chưa đủ để viral, cố thêm nha bếp!'],
        changed:['Ơ chat, quán vừa plot twist đơn hàng đó!', 'Món khác brief rồi, nhưng vẫn chưa fail.',
        'Tôi đặt theo kịch bản, quán lại improvise hơi nhiều.', 'Một pha xử lý ngoài giáo án, trừ chút điểm.',
        'Lần này cứu được buổi live, lần sau đúng order nhé!'],
        reject:['Chat ơi, pha này không thể lên video khen được.', 'Review chân thật: tôi không nhận món này.',
        'Plot twist hơi quá tay rồi quán ơi!', 'Đơn sai thế này mà bảo tôi lên sóng ăn sao được?',
        'Tạm cắt live, quán cần xem lại đơn ngay.']},
      sang:{label:'Sành điệu',great:['Tinh tế đấy. Vừa miệng và rất có gu.', 'Một trải nghiệm đáng để quay lại.',
        'Chỉn chu từ món tới cách phục vụ, tôi thích.', 'Được đấy, chuẩn gu của tôi.',
        'Món này có chất riêng, không phô trương mà thuyết phục.'],
        mild:['Khá thanh lịch, nhưng thiếu chút điểm nhấn.', 'Tôi kỳ vọng nhỉnh hơn ở một vài chi tiết.',
        'Món ổn, cần tinh chỉnh để sang hơn.', 'Có tiềm năng, chưa thật sự trọn vẹn.',
        'Tôi tạm hài lòng, mong bản hoàn thiện hơn.'],
        changed:['Biến tấu có ý tưởng, nhưng không hợp gu đã dặn.', 'Tôi dễ chịu lần này, lần sau đừng tự đổi nhé.',
        'Một nét chệch khỏi đơn ban đầu, hơi đáng tiếc.', 'Thiếu sự nhất quán trong trải nghiệm.',
        'Có cá tính, nhưng cá tính này tôi đâu có gọi.'],
        reject:['Tôi không trả tiền cho một trải nghiệm sai yêu cầu.', 'Không đạt chuẩn kỳ vọng của tôi.',
        'Xin lỗi, món này chưa phù hợp để phục vụ.', 'Chỉn chu là điều cơ bản, không phải lựa chọn.',
        'Tôi không đồng ý với cách thay đổi đơn thế này.']},
      tho:{label:'Bay bổng',great:['Món này như nắng mới rơi vào vị giác.', 'Thơm một chút, vui cả chiều. Tuyệt!',
        'Một bức tranh ngon lành được vẽ bằng hương vị.', 'Ăn mà tưởng đang đi giữa vườn hoa.',
        'Món này làm ngày của tôi có thêm màu đẹp.'],
        mild:['Bức tranh khá xinh, thiếu một nét để hoàn chỉnh.', 'Hương vị có câu chuyện, đoạn kết hơi hụt.',
        'Đủ dịu dàng, chưa đủ làm tôi rung động.', 'Món có màu sắc, cần chỉnh chút bố cục.',
        'Một buổi chiều dễ chịu, chỉ hơi thiếu điểm nhấn.'],
        changed:['Công thức hôm nay vẽ lệch phác thảo gốc.', 'Một nét cọ bất ngờ, tôi vẫn chấp nhận được.',
        'Món khác ý tôi tưởng tượng, hơi tiếc.', 'Bức tranh này thiếu mảng màu đã hẹn.',
        'Lần sau xin giữ đúng bản phác thảo của khách nhé.'],
        reject:['Bức tranh không còn giống điều tôi đặt nữa.', 'Hương vị này không nằm trong câu chuyện tôi muốn.',
        'Xin trả lại, bản phác thảo đã đi quá xa.', 'Tiếc một buổi chiều, món không hợp yêu cầu.',
        'Nét cọ này lệch hết bố cục rồi.']},
      duong:{label:'Bụi bặm',great:['Ngon dữ! Ăn xong chạy thêm trăm cây cũng được.', 'Tạt ngang ăn thử mà thành khách ruột luôn.',
        'Đúng cái bụng đang cần, đã thiệt!', 'Món này đáng để quay đầu xe lại ăn tiếp.',
        'Chuyến đi hôm nay gặp đúng trạm ngon rồi!'],
        mild:['Tạm ổn, vẫn còn chút sạn như đường xấu.', 'Ăn ngon, nhưng lần sau làm chắc tay hơn nha.',
        'Phần này khá, đủ sức đi tiếp.', 'Ổn áp, chưa đến mức phải khoe cả hội phượt.',
        'Ngon đó, còn một tí trừ điểm.'],
        changed:['Quẹo nhầm đường rồi quán, may chưa lạc xa.', 'Hàng giao khác món dặn chút, vẫn ăn tạm.',
        'Đúng hẹn mà sai hàng thì hơi kỳ đó nha.', 'Tôi dễ ăn, nhưng đừng đổi món bất ngờ nữa.',
        'Đơn này bị lạc tuyến một khúc rồi.'],
        reject:['Sai đường rồi, tôi không nhận chuyến này.', 'Món khác yêu cầu quá, thôi để lần sau.',
        'Lạc tuyến thế này không giao được nha quán.', 'Chuyến hàng thất bại, tôi đành đi tiếp.',
        'Dừng xe chờ đúng món, ai dè thành đơn khác!']},
      buon:{label:'Sành buôn',great:['Tiền nào của nấy, món này đáng đồng Xu!', 'Món ngon thế này bán đắt khách là đúng.',
        'Tôi làm ăn cả ngày, thấy món này lời vị giác.', 'Quán giữ chất lượng vậy là giữ được khách.',
        'Chốt đơn đẹp, ngon mà hợp túi tiền!'],
        mild:['Hàng khá nhưng phải cân đối hơn chút.', 'Tôi mua được, lần sau nhớ giữ chất nhé.',
        'Lời chưa nhiều, nhưng chưa lỗ.', 'Bán vậy tạm ổn, thêm chút chăm chút là lên.',
        'Tôi cho điểm khá, thương lượng món sau nha.'],
        changed:['Hàng không đúng đơn mà đòi chốt sao dễ vậy!', 'Lần này tôi linh động lấy, lần sau kiểm kho đi.',
        'Tôi mua hàng chứ không mua sự bất ngờ.', 'Cân hàng đã dặn khác mà, nhớ kiểm lại.',
        'Một món bị lệch yêu cầu, tôi bớt điểm thôi.'],
        reject:['Hàng sai thì không chốt đơn, đơn giản vậy.', 'Chưa đúng chất lượng đặt mua, tôi từ chối.',
        'Chốt kiểu này người mua chịu thiệt quá.', 'Tôi trả lại, cần kiểm đơn trước khi giao.',
        'Không khớp đơn thì ai mà thanh toán được!']},
      ba:{label:'Dân dã',great:['Trời đất, ngon như cơm nhà nấu khéo!', 'Thơm ngon quá, bà ăn mà nhớ hồi còn trẻ.',
        'Có tâm ghê, ăn thấy ấm bụng lắm con.', 'Bữa nay khéo tay dữ, bà khen thiệt!',
        'Đúng kiểu nhà làm, chân chất mà ngon!'],
        mild:['Ăn cũng được, bữa sau nhớ kỹ lời dặn nha.', 'Tạm ngon con ơi, thiếu một chút đậm đà.',
        'Bà không khó, nhưng còn chút chưa ưng.', 'Được đó, làm thêm vài bữa chắc giỏi hơn.',
        'Món khá, bà vẫn muốn con chăm chút hơn.'],
        changed:['Bà dặn một đường, con làm một nẻo rồi.', 'Có khác chút, bà ăn được nhưng nhớ nha.',
        'Bà dễ tính chứ không phải không biết món sai đâu.', 'Con nhớ lời dặn bà cho lần tới nhé.',
        'Bà nhận lần này, đừng để bà nhắc hoài.'],
        reject:['Bà ăn không hợp món này, xin trả lại con.', 'Sai nhiều quá, bà chịu đó!',
        'Bà muốn đúng món đã gọi, không nhận phần này nha.', 'Tiếc ghê, bữa nay con nấu sai ý bà rồi.',
        'Làm lại cho khách khác cẩn thận hơn con nhé.']},
      coc:{label:'Gắt gỏng',great:[
        'Được! Ngon thì tôi khen, không cần ngại.', 'Bữa nay làm chuẩn đấy, không phải nhắc lần hai!',
        'Ngon thật. Tôi khó tính chứ có mù vị giác đâu.', 'Cuối cùng cũng có món đáng tiền, tốt!',
        'Chấm năm sao. Ai bảo tôi không biết khen nào?'],
        mild:['Cũng được. Đừng tưởng thế là tôi hết soi nhé.', 'Ổn thôi, làm cẩn thận hơn là có điểm cao.',
        'Tôi cho điểm khá, còn một chút để phàn nàn.', 'Làm món vậy là gần ổn rồi, đừng chủ quan.',
        'Ăn được, chứ bảo xuất sắc thì chưa đâu.'],
        changed:['Tôi dặn rõ rồi mà vẫn làm lệch. Lần này tôi nhận!', 'Lần sau đối chiếu đơn trước đi, đừng đoán ý khách.',
        'Được, tôi linh động. Nhưng đây chưa phải thứ tôi gọi.', 'Cái phần khác yêu cầu này tính sao đây? Tôi bớt sao đó.',
        'Nói trước: tôi nhận vì còn dùng được, không phải vì món chuẩn.'],
        reject:['Tôi dặn kỹ thế mà vẫn sai, không nhận nhé!', 'Đừng giao đại rồi trông khách vui vẻ chứ!',
        'Món chưa đúng thì đừng bắt tôi trả tiền.', 'Làm ăn vậy thì cần kiểm tra lại đơn ngay!',
        'Bực thật, lần này tôi phải từ chối.']},
      reviewer:{label:'Sành ăn',great:['Tổng thể cân bằng, hậu vị tốt, tay nghề đáng khen.', 'Kết cấu và hương vị đều chỉn chu. Năm sao xứng đáng.',
        'Món có lớp lang rõ ràng, tôi rất hài lòng.', 'Chất lượng tốt và thực hiện đúng yêu cầu.',
        'Một lần thử có sức thuyết phục, tôi sẽ giới thiệu.'],
        mild:['Hương vị khá, nhưng cần chăm chút khâu hoàn thiện.', 'Có điểm sáng, thiếu độ đồng đều.',
        'Món ổn, phần chi tiết chưa thật sự thuyết phục.', 'Đủ ngon để thử, chưa đủ để gọi tuyệt phẩm.',
        'Tôi ghi nhận, nhưng chưa thể chấm tối đa.'],
        changed:['Công thức bị đổi so với order, điều đó ảnh hưởng trải nghiệm.', 'Kỹ thuật ổn, nhưng món chưa đúng yêu cầu.',
        'Chi tiết không khớp làm mất cân bằng dự định.', 'Một lựa chọn ngoài công thức, tôi vẫn chấp nhận với điểm trừ.',
        'Món có thể ngon, nhưng đúng đơn vẫn là điều kiện đầu tiên.'],
        reject:['Không thể chấm món chưa hoàn thiện hoặc làm sai yêu cầu.', 'Sự sai lệch này vượt mức có thể chấp nhận.',
        'Tôi từ chối phần ăn, cần kiểm soát chất lượng tốt hơn.', 'Với tiêu chuẩn đánh giá của tôi, món chưa đạt.',
        'Không nên phục vụ khi món chưa đúng tiêu chuẩn.']},
      dukhach:{label:'Khách du lịch',great:['Wow, món quê mình đáng nhớ thật!', 'Chuyến đi có thêm một điểm ăn uống tuyệt vời.',
        'Very nice! Tôi muốn giới thiệu cho bạn bè.', 'Món ngon, địa phương dễ thương quá!',
        'Đúng chuẩn local food, thích lắm!'],
        mild:['Good! Nhưng tôi nghĩ món còn có thể hay hơn.', 'Ăn khá ngon, còn một điểm hơi lạ.',
        'Du lịch vui rồi, món cũng ổn nữa.', 'Nice try, nhưng tôi chưa thật sự wow.',
        'Lần sau tôi muốn thử bản tốt hơn.'],
        changed:['Ơ, tôi tưởng đặt món khác chứ?', 'Unexpected! Tôi thử được, nhưng hơi lệch đơn.',
        'Đây là biến tấu à? Xin báo trước cho khách nhé.', 'Tôi nhận, dù có phần khác với yêu cầu.',
        'Món hơi lạ so với điều tôi gọi.'],
        reject:['Sorry, món này không giống đơn tôi đặt.', 'Tôi không nhận được, tiếc quá!',
        'Not my order. Mong quán kiểm tra lại.', 'Chuyến đi vẫn vui, nhưng món này tôi phải từ chối.',
        'Rất tiếc, phần này không phù hợp với tôi.']}
    };
    const V85_ISSUE_REMARKS = {
      container:['Cỡ phần ăn không đúng như đã ghi.', 'Ly/thố/khay bị chọn khác kích cỡ tôi gọi.', 'Bao đựng khác yêu cầu ban đầu.'],
      base:['Cốt trà hay nước dùng không đúng loại tôi chọn.', 'Đổi phần nền món ăn khiến hương vị khác hẳn.', 'Phần chính của món không giống yêu cầu.'],
      sugar:['Tôi dặn mức đường khác mà.', 'Độ ngọt bị điều chỉnh khác ý tôi.', 'Ngọt nhạt chưa theo đúng phần trăm đã gọi.'],
      ice:['Tỉ lệ đá khác với điều tôi dặn.', 'Phần đá chưa đúng mức tôi yêu cầu.', 'Tôi cần lượng đá chính xác hơn.'],
      toppings:['Topping chưa khớp, có món thêm hoặc thiếu.', 'Phần topping không đúng danh sách đã gọi.', 'Nhìn topping là thấy có điểm lệch rồi.'],
      spice:['Cấp cay không trùng với mức tôi đã chọn.', 'Tôi dặn mức cay khác, khá quan trọng đó.', 'Độ cay bị lệch so với order.'],
      sauce:['Sốt đã bị đổi sang loại khác.', 'Tôi chọn sốt riêng mà phần này lại khác.', 'Sốt không khớp món đã gọi.'],
      skewers:['Số lượng hoặc loại xiên chưa trùng đơn.', 'Mẹt xiên bị thiếu hoặc đổi loại que.', 'Các que xiên không đúng phần tôi đã chọn.'],
      finish:['Món chưa đạt bước chế biến hoàn chỉnh.', 'Phần nấu/chiên/lắc vẫn chưa xong, không an toàn để dùng.', 'Đồ chưa hoàn thiện thì tôi không thể ăn được.'],
      wrong_career:['Món bị nhầm cả loại quán.', 'Đây đâu phải loại món tôi đặt.', 'Đơn bị giao sai nhóm món.'],
      missing_order:['Không có thông tin đơn để đối chiếu.', 'Tôi không thấy món nào trùng với đơn ban đầu.']
    };
    const V85_PRICE_ONLY_REFUSAL = {
      lanh:['Ví em mới thấy giá đã muốn bỏ chạy rồi!', 'Món làm đúng đó, nhưng giá này em xin đầu hàng!', 'Hết hồn ngang! Em không đủ Xu đâu nha.'],
      game:['Món chuẩn, nhưng ví không đủ tài nguyên để mở khóa.', 'Giá này vượt giới hạn ngân sách, tôi rút trận.', 'Tính mua đồ ăn mà lại gặp boss giá tiền!'],
      kho:['Món đúng nhưng giá cao hơn mức tôi đồng ý. Tôi từ chối.', 'Không có vấn đề về món; vấn đề nằm ở mức giá.', 'Vui lòng giữ giá trong ngân sách đã thống nhất.'],
      co:['Món con làm đúng, nhưng cô không đủ tiền dự trù.', 'Cô thích món này, giá hơi cao nên cô xin thôi nhé.', 'Con cân nhắc giá giúp cô lần sau nha.'],
      gym:['Món chuẩn bài nhưng giá khiến ví tôi kiệt sức.', 'Khẩu phần hợp, ngân sách không đủ sức gánh.', 'Phải cắt budget thôi, tôi xin không nhận.'],
      be:['Con thích lắm nhưng con không đủ tiền ạ!', 'Món xinh quá, giá làm con phải để dành thêm rồi.', 'Ba mẹ dặn không mua vượt số tiền này đâu ạ.'],
      stream:['Chat ơi, giá cao quá nên tôi không chốt đơn này.', 'Món đúng rồi, nhưng ngân sách buổi live không đủ.', 'Clip hay mà ví khô thì phải dừng thôi!'],
      sang:['Món ổn, nhưng tôi không chấp nhận mức giá này.', 'Tôi đánh giá chất lượng khác với khả năng chi trả.', 'Mức chi phí vượt quá giới hạn tôi đã đưa ra.'],
      tho:['Món như ý, chỉ tiếc chiếc ví chưa theo kịp.', 'Tôi rất thích, nhưng giá vượt khỏi khung trời ngân sách.', 'Hôm nay hương vị và ví tiền không chung nhịp.'],
      duong:['Món đúng đấy, nhưng giá làm tôi phải quay đầu xe.', 'Đường xa còn chịu được, khoản này thì quá budget.', 'Tôi đi tiếp nha, túi tiền chưa cho phép.'],
      buon:['Hàng đúng nhưng giá không chốt nổi, thôi!', 'Giá vượt thỏa thuận, giao dịch này không thành.', 'Tôi buôn bán mà, giá phải rõ và đúng ngân sách.'],
      ba:['Con làm đúng rồi, nhưng bà không đủ Xu mua đâu.', 'Bà tiếc lắm, phải để bữa khác giá mềm hơn.', 'Món ngon nhưng ví bà mỏng, bà xin thôi con nhé.'],
      reviewer:['Công thức đạt, mức giá chưa phù hợp với ngân sách.', 'Tôi tách bạch chất lượng món và giá bán: giá chưa ổn.', 'Không có lỗi chế biến, nhưng tôi từ chối vì giá.'],
      dukhach:['Food looks good, nhưng giá quá mức tôi dự định.', 'Sorry, món đúng nhưng tôi không đủ budget.', 'Giá cao hơn kế hoạch chuyến đi, tôi xin thôi.'],
      coc:['Món đúng rồi, nhưng giá vượt mức tôi nói! Không lấy.', 'Tôi dặn ngân sách rõ mà, xem lại giá đi!', 'Đừng nghĩ món ngon là báo giá bao nhiêu cũng được.']
    };
    const V85_PRICE_REMARKS = {
      high:['Giá vượt dự tính nên tôi không nhận.', 'Báo giá cao hơn mức tôi đồng ý rồi.', 'Mức giá này vượt ngân sách đã nói trước.'],
      borderline:['Giá hơi sát ngân sách, tôi hơi cân nhắc.', 'Món ổn mà giá nhỉnh hơn tôi kỳ vọng.', 'Nhận món rồi nhưng phải xem lại giá lần tới.']
    };
    const V85_WAIT_REMARKS = [
      'Điểm trừ: phải ngồi chờ khá lâu.', 'Tôi đã đợi tới lúc bụng muốn biểu tình rồi.',
      'Làm nhanh hơn một chút thì tuyệt.', 'Đồng hồ chờ hơi lâu, tôi bớt một sao.',
      'Khẩu vị ổn mà tốc độ cần cải thiện.', 'Lần sau đừng để tôi thuộc luôn bảng menu nhé!'
    ];
    const V85_FOOD_NOTES = {
      boba:{great:['Trà thơm và pha rất vừa miệng.', 'Độ ngọt và đá cân bằng chuẩn ý tôi.', 'Cốt trà cùng topping kết hợp thích ghê.', 'Uống một ngụm là tỉnh cả người.', 'Ly nước nhìn xinh, hương vị cũng thuyết phục.'],mild:['Trà khá thơm, chỉ cần mượt hơn chút.', 'Ly uống ổn, chưa đến mức gây nghiện.', 'Hương vị dễ chịu, còn chút cần cải thiện.']},
      noodle:{great:['Nước lèo dậy mùi, độ cay đúng gu.', 'Mì chín tới, ăn đã miệng lắm.', 'Thố nóng hổi, topping rất hợp vị.', 'Nước dùng đậm mà không gắt, thích!', 'Ăn xong còn muốn húp nốt nước lèo.'],mild:['Nước lèo ổn, nhưng chưa thật sự đọng vị.', 'Mì ăn khá, còn thiếu một chút tròn vị.', 'Độ cay tạm ổn, cần đều tay hơn.']},
      streetfood:{great:['Xiên giòn vừa, sốt hợp nhau quá trời.', 'Mẹt thơm phức, ăn cái nào đã cái đó.', 'Chiên ráo dầu, xiên nóng giòn chuẩn.', 'Sốt chấm làm món xiên thêm cuốn.', 'Xiên đều tay, vừa miệng và ngon mắt.'],mild:['Xiên khá ngon, nhưng vẫn có thể giòn hơn.', 'Mẹt nhìn ổn, sốt chưa làm tôi bất ngờ.', 'Ăn vui miệng, còn vài điểm cần cải thiện.']}
    };
    const V85_REVIEW_HISTORY = [];
    // Một nhận xét ngắn xuất hiện lúc phục vụ; toàn văn vẫn lưu ở tab Đánh giá.
    function showV85QuickReview(name, avatar, stars, comment) {
      let el = document.getElementById('v85-quick-review');
      if (!el) {
        el = document.createElement('aside');
        el.id = 'v85-quick-review';
        el.className = 'v85-quick-review';
        el.setAttribute('aria-live', 'polite');
        document.body.appendChild(el);
      }
      clearTimeout(window._v85ReviewToastTimer);
      el.textContent = '';
      const head = document.createElement('div');
      head.className = 'v85-quick-review-head';
      head.textContent = `${avatar || '🙂'} ${name || 'Khách'}  ·  ${'⭐'.repeat(Math.max(1,Math.min(5,stars||1)))}`;
      const quote = document.createElement('div');
      quote.className = 'v85-quick-review-text';
      quote.textContent = comment || '';
      el.append(head,quote);
      el.classList.add('visible');
      window._v85ReviewToastTimer = setTimeout(() => el.classList.remove('visible'), 5200);
    }
    function v85PickLine(lines) {
      if (!Array.isArray(lines) || !lines.length) return '';
      const unseen = lines.filter(x => !V85_REVIEW_HISTORY.includes(x));
      const pool = unseen.length ? unseen : lines;
      const chosen = pool[Math.floor(Math.random()*pool.length)];
      V85_REVIEW_HISTORY.push(chosen);
      if (V85_REVIEW_HISTORY.length > 18) V85_REVIEW_HISTORY.shift();
      return chosen;
    }
    function v85ReviewVoice(customer) {
      const fallback = customer.group==='vip' ? 'sang' : customer.strict === 'very_strict' ? 'kho' : 'lanh';
      const key = V85_NPC_VOICE[customer.npcId || customer.id] || fallback;
      return { key, ...(V85_VOICES[key] || V85_VOICES.lanh) };
    }
    function buildV85CustomerReview({ customer, validation, accepted, stars, listedPrice, priceRatio, waited }) {
      const voice = v85ReviewVoice(customer);
      const issues = Array.isArray(validation.issues) ? validation.issues : [];
      const critical = issues.some(x => x.severity>=3);
      const tooExpensive = !accepted && priceRatio > (CUSTOMER_TOLERANCE[customer.strict] || CUSTOMER_TOLERANCE.moderate).maxPriceRatio;
      const mood = !accepted ? 'reject' : issues.length ? 'changed' : stars>=5 ? 'great' : 'mild';
      const intro = v85PickLine(!accepted && tooExpensive && !issues.length ? (V85_PRICE_ONLY_REFUSAL[voice.key] || V85_PRICE_ONLY_REFUSAL.kho) : voice[mood]);
      const suffix = [];
      if (issues.length) {
        const chosenIssue = [...issues].sort((a,b)=>b.severity-a.severity)[0];
        suffix.push(v85PickLine(V85_ISSUE_REMARKS[chosenIssue.code] || [`Vấn đề: ${chosenIssue.label}.`]));
        if (critical && chosenIssue.code!=='finish') suffix.push('Món sai yêu cầu quá nghiêm trọng.');
      }
      if (tooExpensive) suffix.push(v85PickLine(V85_PRICE_REMARKS.high));
      else if (accepted && priceRatio > .95) suffix.push(v85PickLine(V85_PRICE_REMARKS.borderline));
      if (accepted && !issues.length && stars >= 4 && priceRatio <= .95) {
        const career = customer.order?.career || gameState.currentCareer;
        const food = V85_FOOD_NOTES[career];
        if (food && Math.random() < .76) suffix.push(v85PickLine(stars===5?food.great:food.mild));
      }
      if (waited && accepted) suffix.push(v85PickLine(V85_WAIT_REMARKS));
      return { text:[intro,...suffix].filter(Boolean).join(' ').slice(0,310), voice:voice.label, reason:issues.map(x=>x.label).join(', ') || (tooExpensive ? 'Giá vượt ngân sách' : (waited?'Chờ lâu':'Đúng yêu cầu')) };
    }
    const V85_DELIVERY_LINES = {
      5:['Giao lẹ như có cánh, mở hộp còn thấy thơm!', 'Shipper vừa tới, món vẫn ngay ngắn như vừa ra bếp.',
        'Đóng gói đẹp, ăn ngon, tôi muốn đặt thêm!', 'Hộp gọn ghẽ, giao nhanh, năm sao khỏi bàn!',
        'Đơn này đóng gói có tâm, mở ra là vui rồi.', 'Chưa kịp đi lấy đũa đã có đồ ăn, quá đỉnh!',
        'Nhận hàng ngon lành, không đổ không móp, duyệt!'],
      4:['Món còn đẹp, đóng gói khá ổn, tôi hài lòng.', 'Hộp nhìn chắc chắn, tốc độ giao vừa phải.',
        'Đơn này ổn áp, còn chút để cải thiện.', 'Giao tới ăn được ngay, lần sau gọn hơn nữa nhé.',
        'Chất lượng khá, mong quán duy trì.', 'Đóng gói ổn, chưa tới mức xuất sắc.'],
      3:['Đóng gói chậm nên đồ ăn kém hấp dẫn hơn chút.', 'Món tới được, nhưng khâu chuẩn bị làm tôi chờ.',
        'Tốc độ đóng hàng hơi ì, bớt điểm nha quán.', 'Chờ hộp hàng mà tưởng theo dõi một bộ phim dài tập.',
        'Món vẫn dùng được, nhưng lần sau gói nhanh hơn.', 'Đóng gói cẩn thận hơn để tiết kiệm thời gian nhé.']
    };
    function buildV85DeliveryReview(order,stars){
      const item = String(order?.dishName || 'món này').slice(0,60);
      return `${v85PickLine(V85_DELIVERY_LINES[stars] || V85_DELIVERY_LINES[3])} (${item})`;
    }

    function evaluateCustomerDecision(validation, customer, listedPrice) {
      const profile = CUSTOMER_TOLERANCE[customer.strict] || CUSTOMER_TOLERANCE.moderate;
      const issues = validation.issues || [];
      const critical = issues.filter(x => x.severity >= 3).length;
      const major = issues.filter(x => x.severity === 2).length;
      const minor = issues.filter(x => x.severity === 1).length;
      const severity = issues.reduce((sum, x) => sum + x.severity, 0);
      const maxPrice = Math.max(1, Number(customer.order && customer.order.maxPrice) || Number(customer.budget) || 1);
      const priceRatio = listedPrice / maxPrice;

      const recipeTolerated = critical === 0 && major <= profile.maxMajor && minor <= profile.maxMinor && severity <= profile.maxSeverity;
      const priceTolerated = priceRatio <= profile.maxPriceRatio;
      const accepted = recipeTolerated && priceTolerated;

      let stars;
      let comment;
      if (!accepted) {
        stars = critical > 0 ? 1 : 2;
        if (!recipeTolerated && !priceTolerated) {
          comment = `Món lệch yêu cầu (${validation.mismatches.join(', ')}) mà giá còn vượt mức tôi chấp nhận. Tôi xin phép không lấy.`;
        } else if (!recipeTolerated) {
          comment = `Tôi không hợp biến tấu này (${validation.mismatches.join(', ')}). Với tôi món này lệch yêu cầu quá nhiều.`;
        } else {
          comment = `Món ổn nhưng ${listedPrice} Xu vượt mức tôi sẵn sàng trả. Tôi không lấy nhé.`;
        }
      } else if (issues.length === 0) {
        if (priceRatio > 1) {
          stars = customer.strict === 'easy' ? 4 : 3;
          comment = 'Món làm đúng và ngon. Giá hơi vượt dự tính nhưng lần này tôi vẫn chấp nhận.';
        } else if (priceRatio > 0.95) {
          stars = customer.strict === 'easy' ? 5 : 4;
          comment = stars === 5 ? 'Đúng món tôi gọi, làm rất vừa ý!' : 'Món chuẩn, chỉ là giá hơi sát mức tôi định chi.';
        } else {
          stars = 5;
          comment = 'Đúng món tôi gọi, ngon và giá hợp lý!';
        }
      } else {
        stars = severity <= 1 ? 4 : 3;
        if (priceRatio > 1) stars = Math.max(3, stars - 1);
        const style = customer.strict === 'easy' ? 'Tôi khá dễ ăn nên' : 'May là biến tấu này vẫn hợp khẩu vị,';
        comment = `${style} tôi vẫn nhận món. Khác yêu cầu ở: ${validation.mismatches.join(', ')}.`;
      }

      const waited = accepted && customer && Number.isFinite(Number(customer.patience))
        && Number.isFinite(Number(customer.maxPatience)) && Number(customer.maxPatience) > 0
        && customer.patience < customer.maxPatience * 0.25;
      if (waited) stars = Math.max(2, stars - 1);
      const v85Review = buildV85CustomerReview({customer,validation,accepted,stars,listedPrice,priceRatio,waited});
      comment = v85Review.text;
      return { accepted, stars, comment, reviewVoice:v85Review.voice, reviewReason:v85Review.reason,
        profile, severity, priceRatio, exact: issues.length === 0 };
    }

    function getShopPopularityScore() {
      const ratingPart = Math.max(0, Math.min(50, ((Number(gameState.reputation) || 1) - 1) / 4 * 50));
      const stagePart = Math.min(25, (Number(gameState.shopStage) || 0) * 3.2);
      const reviewPart = Math.min(15, Math.log2(1 + Math.max(0, Number(gameState.ratingCount) || 0)) * 3);
      const decorPart = Math.min(10, (gameState.decorations || []).length * 1.2);
      return Math.max(0, Math.min(100, Math.round(ratingPart + stagePart + reviewPart + decorPart)));
    }

    function getNpcVisitWeight(npc) {
      const weatherId = (getActiveWorldEventConfig() || {}).id || 'cloudy_day';
      const news = getActiveMarketNews();
      const newsTags = (news && Array.isArray(news.tags)) ? news.tags : [];
      const affinity = NPC_VISIT_AFFINITY[npc.id] || {};
      let weight = 1;
      if ((affinity.careers || []).includes(gameState.currentCareer)) weight *= 1.45;
      if ((affinity.events || []).includes(weatherId)) weight *= 1.7;
      if ((affinity.events || []).some(tag => newsTags.includes(tag))) weight *= 2.2;
      if (newsTags.includes('harvest_season') && ['farmer','merchant'].includes(npc.group)) weight *= 1.8;
      if (newsTags.includes('tour_bus') && npc.group === 'vip') weight *= 1.6;
      if (newsTags.includes('food_fair') && ['huong_food','chi_bep'].includes(npc.id)) weight *= 2.0;
      if (newsTags.includes('road_repair') && ['yuki','tom_travel'].includes(npc.id)) weight *= .55;
      if (weatherId === 'heavy_rain' && ['ba_sau','ong_bay','khoa_ship'].includes(npc.id)) weight *= 1.5;
      if (weatherId === 'storm_day' && ['yuki','tom_travel'].includes(npc.id)) weight *= .6;
      return Math.max(.1, weight);
    }

    function pickWeightedNpc(pool) {
      if (!pool || !pool.length) return NPC_MASTER_LIST[0];
      const entries = pool.map(npc => ({ npc, weight:getNpcVisitWeight(npc) }));
      const total = entries.reduce((sum, e) => sum + e.weight, 0);
      let roll = Math.random() * total;
      for (const e of entries) {
        roll -= e.weight;
        if (roll <= 0) return e.npc;
      }
      return entries[entries.length - 1].npc;
    }

    function getNextCustomerDelayMs() {
      const popularity = getShopPopularityScore() / 100;
      const eventBonus = getDailyEventBonuses();
      const growth = getGrowthBonuses();
      // Quán mới có nhịp nghỉ rõ; quán nổi tiếng đông hơn nhưng vẫn luôn có khoảng thở.
      let base = 11500 - popularity * 2800;
      const speed = Math.max(-.45, Math.min(.65, eventBonus.arrivalPct + (growth.arrivalPct || 0)));
      base = speed >= 0 ? base / (1 + speed) : base * (1 + Math.abs(speed));
      base *= .82 + Math.random() * .36;
      return Math.round(Math.max(5200, Math.min(18000, base)));
    }

    function scheduleNextCustomer(reason = 'normal') {
      clearTimeout(window._nextCustomerTimeout);
      if (gameState.phase !== 'open' || currentCustomer || phonePauseActive) return;
      const delay = getNextCustomerDelayMs();
      window._nextCustomerTimeout = setTimeout(() => {
        if (gameState.phase === 'open' && !currentCustomer && !phonePauseActive) spawnNextCustomer();
      }, delay);
      renderCustomerBooth();
    }


    // === V87.4.5: Daily judge, gourmet requests & persistent recipe mastery ===
    const V8745_CONTEST_LEVELS = [
      { minLevel:3, target:2, distinct:1, bonus:200, exp:24, name:'Phiên Chợ Tài Hoa', icon:'🥉' },
      { minLevel:6, target:3, distinct:2, bonus:450, exp:38, name:'Hội Thi Bếp Làng', icon:'🥈' },
      { minLevel:10, target:3, distinct:3, bonus:900, exp:55, name:'Thử Thách Đầu Bếp Huyện', icon:'🥇' }
    ];
    function v8745EnsureState(){
      if(!gameState.v8745 || typeof gameState.v8745!=='object'||Array.isArray(gameState.v8745))gameState.v8745={};
      const st=gameState.v8745;
      if(!st.mastery || typeof st.mastery!=='object' || Array.isArray(st.mastery))st.mastery={};
      if(!st.medals || typeof st.medals!=='object'||Array.isArray(st.medals))st.medals={boba:0,noodle:0,streetfood:0};
      if(!Array.isArray(st.history))st.history=[];
      const day=Number(gameState.day)||1;
      if(!st.today || typeof st.today!=='object' || Number(st.today.day)!==day){
        st.today={day, career:gameState.currentCareer||'boba', active:false, complete:false, points:0, recipes:[], medals:0};
      }
      if(!Array.isArray(st.today.recipes))st.today.recipes=[];
      st.today.points=Math.max(0,Math.min(99,Math.floor(Number(st.today.points)||0)));
      return st;
    }
    function v8745Category(career=gameState.currentCareer){
      const level=Number(gameState.level)||1;
      const idx=level>=10?2:level>=6?1:0;
      return V8745_CONTEST_LEVELS[idx];
    }
    function v8745Mastery(career,recipeId){
      const st=v8745EnsureState();
      return Math.max(0,Math.floor(Number(st.mastery[`${career}:${recipeId}`])||0));
    }
    function v8745MasteryRank(career,recipeId){
      const count=v8745Mastery(career,recipeId);
      return count>=16?3:count>=8?2:count>=3?1:0;
    }
    function v8745MasteryTip(career,recipeId,accepted,exact,stars){
      if(!accepted || !exact || Number(stars)<4 || !recipeId)return 0;
      return .02 * v8745MasteryRank(career,recipeId);
    }
    function v8745StartContest(){
      if(!gameState.hasStarted)return showToast('Bạn cần bắt đầu game trước!', '🏆');
      if((Number(gameState.level)||1)<3)return showToast('Cuộc thi mở từ cấp 3 nhé!', '🔒');
      const state=v8745EnsureState().today;
      if(state.active||state.complete)return showToast('Hôm nay bạn đã tham gia hội thi rồi!', '🏆');
      state.career=gameState.currentCareer||'boba';
      state.tier=Math.max(0,Math.min(2, (Number(gameState.level)||1)>=10?2:(Number(gameState.level)||1)>=6?1:0));
      state.active=true; state.points=0; state.recipes=[];
      showToast('🏆 Đã ghi danh! Phục vụ món đúng công thức, khách đánh giá 4–5 sao để lấy điểm.', '🏆');
      v8745Render(); saveGameToStorage(false);
    }
    function v8745EarnMedal(st,tier){
      const contest=V8745_CONTEST_LEVELS[tier]||V8745_CONTEST_LEVELS[0];
      st.active=false;st.complete=true;
      const amount=contest.bonus;
      gameState.coins+=amount;
      addExp(contest.exp);
      const root=v8745EnsureState();
      root.medals[st.career]=(Number(root.medals[st.career])||0)+1;
      root.history.unshift({day:st.day,career:st.career,tier,award:amount});
      if(root.history.length>20)root.history.length=20;
      showToast(`${contest.icon} Hoàn thành ${contest.name}! +${amount} Xu, +${contest.exp} EXP`,contest.icon);
      if(typeof pushGameNotification==='function')pushGameNotification('🏆 Đạt giải hội thi bếp',`${contest.name}: +${amount} Xu, +${contest.exp} EXP. Huy hiệu lưu trong Đánh giá.`,contest.icon,'story');
    }
    function v8745OnDishServed(customer,order,decision){
      if(!decision || !decision.accepted || !decision.exact || decision.stars<4)return;
      const career=String(order?.career||gameState.currentCareer||'boba');
      const id=String(customer?.order?.recipeId || order?.recipeId || '');
      const root=v8745EnsureState();
      if(id){
        const key=`${career}:${id}`;
        root.mastery[key]=Math.min(9999,Math.max(0,Number(root.mastery[key])||0)+1);
        const points=root.mastery[key];
        if([3,8,16].includes(points))showToast(`✨ Thành thạo món ${customer?.order?.recipeName||id}: cấp ${v8745MasteryRank(career,id)}!`, '📖');
      }
      const daily=root.today;
      if(!daily.active || daily.complete || daily.career!==career || daily.day!==Number(gameState.day))return;
      if(!id)return;
      const tier=V8745_CONTEST_LEVELS[daily.tier] || V8745_CONTEST_LEVELS[0];
      if(daily.points>=tier.target)return;
      // In silver/gold brackets repeat recipes can score only after distinct threshold is satisfied.
      const unique=daily.recipes.includes(id);
      if(!unique)daily.recipes.push(id);
      daily.points++;
      if(daily.points>=tier.target && daily.recipes.length>=tier.distinct){
        v8745EarnMedal(daily,daily.tier);
      }else if(daily.points>=tier.target && daily.recipes.length<tier.distinct){
        // No softlock: keep score below target so another genuinely distinct recipe may finish the contest.
        daily.points=tier.target-1;
        showToast(`🏆 Cần thử ít nhất ${tier.distinct} công thức khác nhau để chinh phục hạng này.`, '📖');
      }
      v8745Render();
    }
    function v8745Render(){
      const card=document.getElementById('v8745-contest');
      if(!card)return;
      const st=v8745EnsureState(), d=st.today;
      const base=V8745_CONTEST_LEVELS[Number(d.tier)||0]||V8745_CONTEST_LEVELS[0];
      const current=v8745Category();
      const tier=d.active||d.complete?base:current;
      const unlocked=(Number(gameState.level)||1)>=3;
      const line=document.getElementById('v8745-summary');
      if(line)line.textContent=d.complete?`${base.icon} Đã nhận giải hôm nay`:
        d.active?`${d.points}/${base.target} điểm • ${d.recipes.length}/${base.distinct} món`:
        unlocked?'Đăng ký miễn phí • 1 lần/ngày':'🔒 Mở ở cấp 3';
      const body=document.getElementById('v8745-body');
      if(body){
        const percent=Math.min(100,Math.round((d.points/Math.max(1,tier.target))*100));
        const status=d.complete?'🏅 Đã trao giải — quay lại vào ngày mai':
          d.active?'🎯 Đang thi — chỉ tính món đúng, được khách chấp nhận từ 4★':'📢 Chọn tham gia rồi phục vụ khách tại quầy';
        body.innerHTML=`<div class="v8745-meta"><b>${tier.icon} ${tier.name}</b><b>+${tier.bonus} Xu • +${tier.exp} EXP</b></div><div class="v8745-note">${status}</div>
          <div class="v8745-track"><span class="v8745-progress" style="width:${percent}%"></span></div>
          <div class="v8745-actions"><span class="v8745-note">${d.active||d.complete?`${d.points}/${tier.target} đơn chuẩn • ${d.recipes.length}/${tier.distinct} công thức`:`Yêu cầu ${tier.target} đơn 4–5★; ${tier.distinct} loại món`}</span>
          ${!d.active&&!d.complete?`<button type="button" class="v8745-action" onclick="v8745StartContest()" ${unlocked?'':'disabled'}>${unlocked?'🏆 Tham gia':'🔒 Lv.3'}</button>`:'<span class="v8745-note">1 giải/ngày</span>'}</div>`;
      }
      const masteryLine=document.getElementById('v8745-mastery-line');
      if(masteryLine)masteryLine.textContent=`${Object.values(st.medals).reduce((a,b)=>a+(Number(b)||0),0)} huy hiệu • ${Object.values(st.mastery).filter(x=>Number(x)>=3).length} món lên tay`;
      const masteryBody=document.getElementById('v8745-mastery-body');
      if(masteryBody && document.getElementById('v8745-mastery')?.open){
        const career=gameState.currentCareer||'boba';
        const pool=(RECIPE_BOOK[career]||[]).filter(r=>v8745Mastery(career,r.id)>0).sort((a,b)=>v8745Mastery(career,b.id)-v8745Mastery(career,a.id));
        const careerLabel={boba:'Trà Sữa',noodle:'Mì Cay',streetfood:'Xiên Que'};
        const medals=Object.entries(st.medals).map(([k,v])=>`<span class="v8745-rank ${v?'done':''}">${careerLabel[k]||k}: ${Math.max(0,Number(v)||0)} 🏅</span>`).join('');
        masteryBody.innerHTML=`<div class="v8745-note">Mỗi món chuẩn được khách chấp nhận từ 4★ giúp tăng tay nghề. Đạt 3/8/16 lượt → +2%/+4%/+6% tiền boa cho món đó ở lần phục vụ tiếp theo. Chỉ tính khi làm đúng công thức.</div>
        <div class="v8745-ranks">${medals}</div>
        <div class="v8745-recipe-table">${pool.slice(0,12).map(r=>{const n=v8745Mastery(career,r.id),rank=v8745MasteryRank(career,r.id);return `<div class="v8745-recipe-cell"><b>${escapeHtmlText(r.name)}</b><small>${n} lượt chuẩn • Tay nghề ${rank}/3 • +${rank*2}% boa</small></div>`;}).join('')||'<div class="v8745-note">Hãy phục vụ đơn đúng món để bắt đầu ghi nhận tay nghề.</div>'}</div>`;
      }
    }

    function spawnNextCustomer() {
      if (gameState.phase !== 'open' || currentCustomer || phonePauseActive) return;
      ensureV6State();

      const eventBonus = getDailyEventBonuses();
      const growth = getGrowthBonuses();
      const popularity = getShopPopularityScore() / 100;
      const unlockedNpcPool = NPC_MASTER_LIST.filter(isNpcUnlocked);
      const rarePool = unlockedNpcPool.filter(n => n.rare);
      const normalPool = unlockedNpcPool.filter(n => !n.rare);
      const rareChance = Math.min(.32, .045 + eventBonus.specialNpcPct + (growth.rarePct || 0) + popularity * .045);
      const useRare = rarePool.length > 0 && Math.random() < rareChance;
      const template = pickWeightedNpc(useRare ? rarePool : normalPool) || NPC_MASTER_LIST[0];

      const oneShotPatience = Number(gameState.nextCustomerPatienceMod) || 0;
      gameState.nextCustomerPatienceMod = 0;
      const basePatience = Math.max(24, 42 + getGrowthBonuses().patienceSec + eventBonus.patienceSec + (Number(template.patienceMod) || 0) + oneShotPatience);

      currentCustomer = {
        npcId: template.id,
        name: template.name,
        avatar: template.avatar,
        role: template.role,
        budget: template.budget,
        strict: template.strict,
        group: template.group,
        isRare: !!template.rare,
        tipMod: Math.max(.5, Number(template.tipMod) || 1),
        targetCareer: gameState.currentCareer,
        patience: basePatience,
        maxPatience: basePatience
      };
      v8732MarkCustomer(template.id);
      currentCustomer.order = createCustomerOrder(gameState.currentCareer, currentCustomer);
      v87532TrackVisitor();
      currentCustomer.quote = formatCustomerOrder(currentCustomer.order);
      // v87.4.5: guest judges occasionally visit after the first food-fair milestone.
      // Their actual order is still generated from unlocked recipes, never from locked stock.
      if((Number(gameState.level)||1)>=6 && (Number(gameState.shopStage)||0)>=2 && Math.random()<0.12){
        currentCustomer.isGourmet=true;
        currentCustomer.strict='very_strict';
        currentCustomer.role=`${currentCustomer.role||'Khách'} • Người sành ăn`;
        currentCustomer.tipMod=Math.max(currentCustomer.tipMod,1.25);
        currentCustomer.budget=Math.max(currentCustomer.budget,Math.round(Number(currentCustomer.order.maxPrice||0)*1.25));
        currentCustomer.order.maxPrice=Math.max(Number(currentCustomer.order.maxPrice)||1,currentCustomer.budget);
        currentCustomer.patience=Math.max(currentCustomer.patience,56);
        currentCustomer.maxPatience=currentCustomer.patience;
        currentCustomer.quote=`👑 KHÁCH SÀNH ĂN: ${formatCustomerOrder(currentCustomer.order)} (Chỉ nhận món đúng chuẩn; có thưởng boa cao nếu từ 4★.)`;
        showToast('👑 Khách sành ăn đến thử tài! Hãy làm đúng món và giữ giá hợp lý.', '👑');
      }

      if (currentCustomer.isRare) {
        pushGameNotification('Khách đặc biệt ghé quán!', `${currentCustomer.name} • ${currentCustomer.role} • ví khoảng ${currentCustomer.budget} Xu`, currentCustomer.avatar, 'vip');
        showToast(`${currentCustomer.name} vừa ghé quán!`, currentCustomer.avatar);
      }

      cleanWorkbenchDish();
      renderCustomerBooth();
      startCustomerPatienceTimer();
      saveGameToStorage();
    }

    function renderCustomerBooth() {
      v8745Render();
      const elAvatar = document.getElementById('cust-avatar');
      const elStrict = document.getElementById('cust-strict-badge');
      const elName = document.getElementById('cust-name');
      const elRole = document.getElementById('cust-role');
      const elBudget = document.getElementById('cust-budget');
      const elPTime = document.getElementById('cust-patience-time');
      const elQuote = document.getElementById('cust-order-quote');
      const elBar = document.getElementById('cust-patience-bar');

      if (gameState.phase !== 'open' || !currentCustomer) {
        const waiting = gameState.phase === 'open';
        if (elAvatar) elAvatar.innerHTML = waiting ? "🚶" : `<img src="${V30_ART.sleep_bunny}" class="v30-sleep-art" alt="Quán nghỉ ca">`;
        if (elStrict) {
          elStrict.innerText = waiting ? "Đang Chờ" : "Nghỉ Ca";
          elStrict.className = `absolute -bottom-1 -right-1 text-[8px] ${waiting ? 'bg-sky-700' : 'bg-slate-700'} text-white px-1 rounded-md font-bold`;
        }
        if (elName) elName.innerText = waiting ? 'Đang chờ lượt khách kế tiếp' : (gameState.shiftClosed ? 'Quán Đã Đóng Ca' : 'Quán Đang Nghỉ Ca');
        if (elRole) elRole.innerText = waiting ? `Độ nổi tiếng ${getShopPopularityScore()}/100 • nhịp khách thay đổi theo biến cố` : (gameState.shiftClosed ? 'Hôm nay đã bán xong • Bấm 🌙 qua ngày để mở ca mới' : "Chạm 'Mở Quán' để đón khách");
        if (elBudget) elBudget.innerText = "--";
        if (elPTime) elPTime.innerText = phonePauseActive && waiting ? "⏸" : "--";
        if (elQuote) elQuote.innerText = waiting ? '"Không cần cuống đâu — sẽ có khoảng nghỉ giữa các lượt khách."' : (gameState.shiftClosed ? '"Xong việc rồi, đi thăm hàng xóm hoặc chăm vườn thôi!"' : '"Bấm Mở Quán để bắt đầu đón lượt khách đầu tiên vào mua hàng nhé chủ quán!"');
        if (elBar) {
          elBar.style.width = '0%';
          elBar.className = "bg-slate-300 h-full rounded-full transition-all";
        }
        return;
      }

      if (elAvatar) elAvatar.innerText = currentCustomer.avatar;
      if (elName) elName.innerText = currentCustomer.name;
      if (elRole) elRole.innerText = currentCustomer.isGourmet ? `👑 ${currentCustomer.role}` : (currentCustomer.isRare ? `✨ ${currentCustomer.role} • Khách đặc biệt` : currentCustomer.role);
      if (elBudget) elBudget.innerText = `Ví: ${currentCustomer.budget} Xu`;
      if (elQuote) elQuote.innerText = `"${currentCustomer.quote}"`;

      if (elStrict) {
        if (currentCustomer.strict === 'very_strict') {
          elStrict.innerText = 'Rất Khó';
          elStrict.className = 'absolute -bottom-1 -right-1 text-[8px] bg-rose-700 text-white px-1 rounded-md font-bold';
        } else if (currentCustomer.strict === 'strict') {
          elStrict.innerText = 'Khó Tính';
          elStrict.className = 'absolute -bottom-1 -right-1 text-[8px] bg-amber-700 text-white px-1 rounded-md font-bold';
        } else if (currentCustomer.strict === 'moderate') {
          elStrict.innerText = 'Thoải Mái';
          elStrict.className = 'absolute -bottom-1 -right-1 text-[8px] bg-sky-700 text-white px-1 rounded-md font-bold';
        } else {
          elStrict.innerText = 'Dễ Tính';
          elStrict.className = 'absolute -bottom-1 -right-1 text-[8px] bg-emerald-700 text-white px-1 rounded-md font-bold';
        }
      }
    }

    function startCustomerPatienceTimer() {
      clearInterval(customerPatienceTimer);
      customerPatienceTimer = setInterval(() => {
        if (!currentCustomer || gameState.phase !== 'open' || phonePauseActive) return;
        currentCustomer.patience -= 0.5;

        const elPTime = document.getElementById('cust-patience-time');
        const elBar = document.getElementById('cust-patience-bar');
        if (elPTime) elPTime.innerText = `${Math.max(0, Math.ceil(currentCustomer.patience))}s`;
        if (elBar) {
          const pct = Math.max(0, (currentCustomer.patience / currentCustomer.maxPatience) * 100);
          elBar.style.width = `${pct}%`;
          if (pct < 30) elBar.className = "bg-rose-500 h-full rounded-full transition-all";
          else if (pct < 60) elBar.className = "bg-amber-500 h-full rounded-full transition-all";
          else elBar.className = "bg-emerald-500 h-full rounded-full transition-all";
        }

        if (currentCustomer.patience <= 0) {
          clearInterval(customerPatienceTimer);
          handleCustomerWalkout();
        }
      }, 500);
    }

    function handleCustomerWalkout() {
      playSound('error');
      showToast(`${currentCustomer.name} đã bực bội bỏ đi vì chờ quá lâu!`, "😡");
      gameState.reputation = Math.max(1.0, gameState.reputation - 0.2);

      currentCustomer = null;
      renderCustomerBooth();
      updateHeaderStats();
      if (gameState.phase === 'open') scheduleNextCustomer('walkout');
    }

    function getDishRequirements() {
      const req = {};
      const add = (key, qty = 1) => {
        if (!key || qty <= 0) return;
        req[key] = (req[key] || 0) + qty;
      };

      if (gameState.currentCareer === 'boba') {
        add(workbenchDish.container, 1);
        add(workbenchDish.base, 1);
        (workbenchDish.toppings || []).forEach(k => add(k, 1));
      } else if (gameState.currentCareer === 'noodle') {
        add(workbenchDish.container, 1);
        add(workbenchDish.base, 1);
        (workbenchDish.toppings || []).forEach(k => add(k, 1));
      } else if (gameState.currentCareer === 'streetfood') {
        // Xiên que chỉ dùng khay/mẹt + đúng số xiên. Không dùng ly hoặc trà.
        const trayKey = ({plate:'tray_plate',basket:'tray_basket',box:'tray_box'}[workbenchDish.tray] || 'tray_plate');
        add(trayKey, 1);
        add(workbenchDish.sauce, 1);
        const counts = workbenchDish.skewerCounts || {};
        Object.keys(counts).forEach(k => add(k, Number(counts[k]) || 0));
      }
      return req;
    }

    function getMissingDishIngredients(requirements) {
      return Object.keys(requirements).filter(key => (gameState.inventory[key] || 0) < requirements[key]);
    }

    function consumeDishIngredients(requirements) {
      Object.keys(requirements).forEach(key => {
        gameState.inventory[key] = Math.max(0, (gameState.inventory[key] || 0) - requirements[key]);
      });
    }

    function serveDishToCustomer() {
      if (!currentCustomer || gameState.phase !== 'open') {
        return showToast("Hiện tại không có khách nào ở quầy!", "⚠️");
      }

      // Kiểm tra đủ nguyên liệu trước. Thiếu hàng thì tuyệt đối chưa trừ kho.
      const requirements = getDishRequirements();
      if (gameState.currentCareer === 'streetfood') {
        const totalSkewers = Object.keys(workbenchDish.skewerCounts || {})
          .reduce((sum, k) => sum + (Number(workbenchDish.skewerCounts[k]) || 0), 0);
        if (totalSkewers <= 0) return showToast("Bạn chưa chọn que xiên nào vào mẹt!", "⚠️");
      }

      const missing = getMissingDishIngredients(requirements);
      if (missing.length > 0) {
        const first = missing[0];
        const names = missing.map(k => (ITEM_DICTIONARY[k] && ITEM_DICTIONARY[k].name) || k).join(', ');
        showToast(`Thiếu nguyên liệu: ${names}. Chưa trừ bất kỳ nguyên liệu nào.`, "📦");
        return openQuickRestock(first);
      }

      clearInterval(customerPatienceTimer);

      // Khách có tính cách riêng: dễ tính có thể chấp nhận một số biến tấu,
      // khách khó tính yêu cầu gần như/chính xác tuyệt đối. Món lỗi an toàn (chưa nấu/chưa hoàn thiện) luôn bị từ chối.
      const validation = validatePlayerDishAgainstOrder(workbenchDish, currentCustomer.order);
      const decision = evaluateCustomerDecision(validation, currentCustomer, workbenchDish.listedPrice);
      const accepted = decision.accepted;
      const stars = decision.stars;
      const comment = decision.comment;

      // Đã bưng món ra cho khách thì nguyên liệu bị tiêu hao, kể cả khách từ chối.
      consumeDishIngredients(requirements);

      let earned = 0;
      let tip = 0;
      if (!accepted) {
        showToast(`${decision.profile.label} từ chối món • 0 Xu thanh toán!`, "❌");
        playSound('error');
      } else {
        const growthBonus = getGrowthBonuses();
        const eventBonus = getDailyEventBonuses();
        const careerBonus = v8744CareerBonus(gameState.currentCareer,workbenchDish,stars,accepted&&decision.exact);
        const baseEarned = workbenchDish.listedPrice;
        earned = Math.max(1, Math.round(baseEarned * (1 + Math.min(.68,growthBonus.revenuePct+careerBonus.revenuePct) + eventBonus.revenuePct)));
        if (stars >= 5) tip = Math.floor(earned * 0.15) + 5;
        else if (stars === 4) tip = Math.max(0, Math.floor(earned * 0.05));
        const masteryTip=v8745MasteryTip(gameState.currentCareer,currentCustomer.order?.recipeId,accepted,decision.exact,stars);
        tip = Math.round(tip * (1 + Math.min(.65,growthBonus.tipPct+careerBonus.tipPct+masteryTip) + eventBonus.tipPct) * Math.max(.5, Number(currentCustomer.tipMod) || 1));
        gameState.coins += earned + tip;
        v8744RecordOrder(gameState.currentCareer);
        v8753OnOrder(stars,accepted);
        addExp(20 + stars * 5);
        playSound('serve');
        if (!decision.exact) showToast(`${decision.profile.label} chấp nhận món biến tấu!`, "✨");
      }
      // Competition and mastery use the same real dish validation and accepted/stars result.
      v8745OnDishServed(currentCustomer,workbenchDish,decision);
      gameState.reputation = ((gameState.reputation * gameState.ratingCount) + stars) / (gameState.ratingCount + 1);
      gameState.ratingCount += 1;

      const dailyStats = gameState.dailyStats || {};
      if (accepted) {
        dailyStats.counterServed = (dailyStats.counterServed || 0) + 1;
        dailyStats.counterRev = (dailyStats.counterRev || 0) + earned;
        dailyStats.tipsRev = (dailyStats.tipsRev || 0) + tip;
      }
      if (!Array.isArray(dailyStats.ratings)) dailyStats.ratings = [];
      dailyStats.ratings.push(stars);

      const reviewId = addShopReview({
        customerName: currentCustomer.name,
        avatar: currentCustomer.avatar,
        stars,
        comment,
        accepted,
        personality: (CUSTOMER_TOLERANCE[currentCustomer.strict] || CUSTOMER_TOLERANCE.moderate).label,
        voice: decision.reviewVoice,
        reason: decision.reviewReason,
        dishName: gameState.currentCareer === 'streetfood' ? 'Xiên que' : itemLabel(workbenchDish.base)
      });
      if (accepted && stars >= 5 && currentCustomer.isRare && Math.random() < 0.16) {
        const npcGiftPool = Object.entries(SOUVENIR_CONFIG).filter(([id,it]) => ['green','blue'].includes(it.rarity) && !id.startsWith('village_') && !id.startsWith('v874_'));
        if (npcGiftPool.length) {
          const [giftId] = npcGiftPool[Math.floor(Math.random() * npcGiftPool.length)];
          addSouvenir(giftId, `Quà từ ${currentCustomer.name}`);
        }
      }
      const incidentQueued = maybeQueueShopIncident();
      // Đánh giá được lưu âm thầm vào tab ⭐ Đánh giá; không bật popup làm gián đoạn nhịp bán hàng.
      activeFeedbackReviewId = null;
      renderShopReviews();
      showV85QuickReview(currentCustomer.name, currentCustomer.avatar, stars, comment);

      cleanWorkbenchDish();
      currentCustomer = null;
      renderCustomerBooth();
      updateHeaderStats();
      saveGameToStorage();

      if (gameState.phase === 'open' && !incidentQueued) scheduleNextCustomer('served');
    }

    function escapeHtmlText(value) {
      return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    function addShopReview(data) {
      if (!Array.isArray(gameState.reviews)) gameState.reviews = [];
      if (!Number.isFinite(Number(gameState.nextReviewId))) gameState.nextReviewId = 1;
      const id = Number(gameState.nextReviewId) || 1;
      gameState.nextReviewId = id + 1;
      gameState.reviews.unshift({
        id,
        day: gameState.day,
        customerName: data.customerName || 'Khách hàng',
        avatar: data.avatar || '🙂',
        stars: Math.max(1, Math.min(5, Number(data.stars) || 1)),
        comment: data.comment || '',
        accepted: !!data.accepted,
        personality: data.personality || 'Khách',
        voice: data.voice || '',
        reason: data.reason || '',
        dishName: data.dishName || '',
        reply: ''
      });
      if (gameState.reviews.length > 30) gameState.reviews = gameState.reviews.slice(0, 30);
      return id;
    }

    function renderShopReviews() {
      const list = document.getElementById('shop-reviews-list');
      const summary = document.getElementById('shop-rating-summary');
      if (summary) summary.innerText = `${gameState.reputation.toFixed(1)}/5 • ${Math.max(0, Number(gameState.ratingCount) || 0)} đánh giá`;
      if (!list) return;

      const reviews = Array.isArray(gameState.reviews) ? gameState.reviews.slice(0, 30) : [];
      const ratingBig = document.getElementById('reviews-rating-big');
      const countBig = document.getElementById('reviews-count-big');
      const distribution = document.getElementById('reviews-distribution');
      if (ratingBig) ratingBig.innerText = gameState.reputation.toFixed(1);
      if (countBig) countBig.innerText = `${reviews.length} review`;
      if (distribution) {
        const counts = [5,4,3,2,1].map(star => reviews.filter(r => Number(r.stars) === star).length);
        const maxCount = Math.max(1, reviews.length);
        distribution.innerHTML = [5,4,3,2,1].map((star, idx) => {
          const count = counts[idx];
          const pct = Math.round((count / maxCount) * 100);
          return `<div class="flex items-center gap-1.5 text-[8px]">
            <span class="w-6 text-slate-500 font-black">${star}⭐</span>
            <div class="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden"><div class="h-full bg-amber-400 rounded-full" style="width:${pct}%"></div></div>
            <span class="w-5 text-right text-slate-400 font-bold">${count}</span>
          </div>`;
        }).join('');
      }
      if (reviews.length === 0) {
        list.innerHTML = `<div class="text-[9px] text-slate-400 italic py-4 text-center">Chưa có đánh giá mới trong run này.</div>`;
        return;
      }

      list.innerHTML = reviews.map(r => {
        const stars = '⭐'.repeat(Math.max(1, Math.min(5, Number(r.stars) || 1)));
        const reply = r.reply
          ? `<div class="mt-1 ml-5 bg-amber-50 border-l-2 border-amber-400 rounded-r-lg px-1.5 py-1 text-[8px] text-slate-600"><b class="text-amber-700">Chủ quán:</b> ${escapeHtmlText(r.reply)}</div>`
          : `<button onclick="openReviewReply(${Number(r.id)})" class="mt-1 text-[8px] text-amber-700 font-black hover:underline">↩ Trả lời đánh giá</button>`;
        return `
          <div class="p-2.5 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm">
            <div class="flex items-start justify-between gap-1">
              <div class="flex items-center gap-1 min-w-0">
                <span class="text-sm">${escapeHtmlText(r.avatar)}</span>
                <div class="min-w-0">
                  <div class="text-[9px] font-black text-slate-700 truncate">${escapeHtmlText(r.customerName)} • ${escapeHtmlText(r.personality)} • Ngày ${Number(r.day) || 1}</div>
                  <div class="text-[8px] leading-none">${stars}</div>
                </div>
              </div>
              <span class="text-[7px] ${r.accepted ? 'text-emerald-600' : 'text-rose-500'} font-bold">${r.accepted ? 'Đã mua' : 'Từ chối'}</span>
            </div>
            ${(r.dishName || r.voice) ? `<div class="v85-review-context">${r.dishName ? `🍽️ ${escapeHtmlText(r.dishName)}` : ''}${r.voice ? ` · 💬 ${escapeHtmlText(r.voice)}` : ''}</div>` : ''}
            <div class="text-[9px] text-slate-600 mt-1.5 leading-relaxed">“${escapeHtmlText(r.comment)}”</div>
            ${reply}
          </div>`;
      }).join('');
    }

    function openReviewReply(reviewId) {
      const review = (gameState.reviews || []).find(r => Number(r.id) === Number(reviewId));
      if (!review) return showToast('Không tìm thấy đánh giá này.', '⚠️');
      activeReplyReviewId = Number(reviewId);
      const modal = document.getElementById('modal-review-reply');
      const customer = document.getElementById('review-reply-customer');
      const original = document.getElementById('review-reply-original');
      const input = document.getElementById('review-reply-input');
      if (customer) customer.innerText = `${review.avatar} ${review.customerName} • ${'⭐'.repeat(review.stars)}`;
      if (original) original.innerText = `“${review.comment}”`;
      if (input) input.value = review.reply || '';
      if (modal) modal.classList.remove('hidden');
      setTimeout(() => { if (input) input.focus(); }, 60);
      playSound('click');
    }

    function closeReviewReplyModal() {
      const modal = document.getElementById('modal-review-reply');
      if (modal) modal.classList.add('hidden');
      activeReplyReviewId = null;
    }

    function submitReviewReply() {
      const input = document.getElementById('review-reply-input');
      const text = input ? input.value.trim() : '';
      if (!text) return showToast('Hãy nhập lời phản hồi trước nhé.', '💬');
      const review = (gameState.reviews || []).find(r => Number(r.id) === Number(activeReplyReviewId));
      if (!review) return closeReviewReplyModal();
      review.reply = text.slice(0, 180);
      closeReviewReplyModal();
      renderShopReviews();
      saveGameToStorage();
      showToast('Đã đăng phản hồi của chủ quán!', '💬');
      playSound('serve');
    }

    function replyFromFeedback() {
      if (!activeFeedbackReviewId) return;
      closeCustomerFeedbackModal();
      openReviewReply(activeFeedbackReviewId);
    }

    function showCustomerFeedbackModal(stars, name, avatar, quote, earned, tip, reviewId) {
      activeFeedbackReviewId = reviewId || null;
      const modal = document.getElementById('modal-customer-feedback');
      const box = document.getElementById('feedback-card-box');
      const elAvatar = document.getElementById('fb-avatar');
      const elStars = document.getElementById('fb-stars');
      const elName = document.getElementById('fb-name');
      const elQuote = document.getElementById('fb-quote');
      const elEarned = document.getElementById('fb-earned');
      const elTip = document.getElementById('fb-tip');
      const btnConfirm = document.getElementById('fb-btn-confirm');
      const btnReply = document.getElementById('fb-btn-reply');

      if (!modal) return;
      if (elAvatar) elAvatar.innerText = avatar;
      if (elName) elName.innerText = name;
      if (elQuote) elQuote.innerText = `"${quote}"`;
      if (elEarned) elEarned.innerText = `+${earned} Xu`;
      if (elTip) elTip.innerText = `+${tip} Xu`;
      if (btnReply) btnReply.disabled = !reviewId;

      let starStr = '';
      for (let i = 0; i < stars; i++) starStr += '⭐';
      if (elStars) elStars.innerText = starStr;

      if (stars <= 2) {
        if (box) box.className = 'w-full max-w-xs bg-white rounded-3xl p-3.5 shadow-2xl border-2 border-rose-500 text-center space-y-2';
        if (btnConfirm) {
          btnConfirm.innerText = 'Ghi Nhận 🙇';
          btnConfirm.className = 'py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] rounded-xl shadow tap-scale';
        }
      } else if (stars === 3) {
        if (box) box.className = 'w-full max-w-xs bg-white rounded-3xl p-3.5 shadow-2xl border-2 border-amber-400 text-center space-y-2';
        if (btnConfirm) {
          btnConfirm.innerText = 'Tiếp Tục 👍';
          btnConfirm.className = 'py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-[10px] rounded-xl shadow tap-scale';
        }
      } else {
        if (box) box.className = 'w-full max-w-xs bg-white rounded-3xl p-3.5 shadow-2xl border-2 border-emerald-400 text-center space-y-2';
        if (btnConfirm) {
          btnConfirm.innerText = 'Tiếp Tục ✨';
          btnConfirm.className = 'py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] rounded-xl shadow tap-scale';
        }
      }

      modal.classList.remove('hidden');
    }

    function closeCustomerFeedbackModal() {
      const modal = document.getElementById('modal-customer-feedback');
      if (modal) modal.classList.add('hidden');
      playSound('click');
      if (queuedRandomIncident) {
        setTimeout(() => showQueuedRandomIncident(), 180);
      }
    }

    const LOTTERY_BASE_TIERS = [
      { amount: 0,    chance: .40, tier: 'Không trúng', icon: '🍃' },
      { amount: 5,    chance: .10, tier: 'An ủi', icon: '🪙' },
      { amount: 10,   chance: .18, tier: 'Hoàn vốn nhẹ', icon: '🪙' },
      { amount: 20,   chance: .14, tier: 'Trúng nhỏ', icon: '🥉' },
      { amount: 30,   chance: .08, tier: 'Trúng vui', icon: '🎉' },
      { amount: 50,   chance: .05, tier: 'Trúng khá', icon: '🥈' },
      { amount: 100,  chance: .03, tier: 'Giải lớn', icon: '🥇' },
      { amount: 200,  chance: .012, tier: 'Giải đặc biệt', icon: '💎' },
      { amount: 500,  chance: .006, tier: 'Giải hiếm', icon: '🧧' },
      { amount: 1000, chance: .002, tier: 'ĐỘC ĐẮC', icon: '👑' }
    ];

    function getLotteryTierTable() {
      const growthLuck = getGrowthBonuses().luckPct;
      const eventLuck = getDailyEventBonuses().luckPct;
      const luck = Math.max(0, Math.min(.45, growthLuck + eventLuck));
      const shift = Math.min(.08, luck * .18);
      const bonusWeights = [.06,.10,.13,.15,.17,.17,.11,.07,.04];
      return LOTTERY_BASE_TIERS.map((t, i) => {
        if (i === 0) return { ...t, chance: Math.max(.30, t.chance - shift) };
        return { ...t, chance: t.chance + shift * bonusWeights[i - 1] };
      });
    }

    function rollLotteryTier() {
      const table = getLotteryTierTable();
      const total = table.reduce((sum, t) => sum + t.chance, 0);
      let r = Math.random() * total;
      for (const t of table) {
        r -= t.chance;
        if (r <= 0) return { ...t, label: t.amount > 0 ? `+${t.amount} Xu` : 'Không trúng' };
      }
      const last = table[table.length - 1];
      return { ...last, label: `+${last.amount} Xu` };
    }

    function shuffleArray(arr) {
      const out = [...arr];
      for (let i = out.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [out[i], out[j]] = [out[j], out[i]];
      }
      return out;
    }

    function buildLotteryScratchValues(amount) {
      const pool = [5, 10, 20, 30, 50, 100, 200, 500, 1000];
      if (amount > 0) {
        const distractors = shuffleArray(pool.filter(v => v !== amount)).slice(0, 3);
        return shuffleArray([amount, amount, amount, ...distractors]).map(String);
      }
      // Vé trắng vẫn có thể có 2 số giống nhau nhưng tuyệt đối không có bộ 3.
      const values = [];
      const counts = {};
      while (values.length < 6) {
        const v = pool[Math.floor(Math.random() * pool.length)];
        if ((counts[v] || 0) >= 2) continue;
        counts[v] = (counts[v] || 0) + 1;
        values.push(v);
      }
      return shuffleArray(values).map(String);
    }

    function openLotteryModal() {
      ensureV6State();
      const modal = document.getElementById('modal-scratch-lottery');
      if (modal) modal.classList.remove('hidden');
      renderLotteryTicket();
      renderLotteryHistory();
      renderGameCollectionSummary();
      playSound('click');
    }

    function closeLotteryModal() {
      const modal = document.getElementById('modal-scratch-lottery');
      if (modal) modal.classList.add('hidden');
      playSound('click');
    }

    function openLotteryInfo() {
      const modal = document.getElementById('modal-lottery-info');
      if (modal) modal.classList.remove('hidden');
      const list = document.getElementById('lottery-odds-list');
      const table = getLotteryTierTable();
      const total = table.reduce((sum, t) => sum + t.chance, 0);
      if (list) {
        list.innerHTML = table.map(t => {
          const pct = (t.chance / total * 100).toFixed(t.amount >= 200 ? 2 : 1);
          const color = t.amount >= 500 ? 'text-amber-300' : t.amount >= 100 ? 'text-violet-300' : t.amount > 0 ? 'text-emerald-300' : 'text-slate-400';
          return `<div class="flex justify-between p-1.5 rounded-lg bg-slate-900 border border-slate-800"><span class="${color}">${t.icon} ${t.amount > 0 ? t.amount.toLocaleString() + ' Xu' : 'Không trúng'}</span><b class="${color}">${pct}%</b></div>`;
        }).join('');
      }
      playSound('click');
    }

    function closeLotteryInfo() {
      const modal = document.getElementById('modal-lottery-info');
      if (modal) modal.classList.add('hidden');
      playSound('click');
    }

    function buyNewLotteryTicket() {
      ensureV6State();
      const active = gameState.lotteryActiveTicket;
      if (active && !active.resolved) return showToast('Bạn còn một vé chưa cào xong!', '🎟️');
      const cost = 25;
      let source = 'coins';
      if (gameState.lotteryTickets > 0) {
        gameState.lotteryTickets -= 1;
        source = 'gift';
      } else {
        if (gameState.coins < cost) return showToast(`Không đủ ${cost} Xu và cũng không có vé nhặt được!`, '❌');
        gameState.coins -= cost;
      }
      const result = rollLotteryTier();
      const values = buildLotteryScratchValues(result.amount);
      gameState.lotteryActiveTicket = {
        id: Date.now(),
        day: gameState.day,
        amount: result.amount,
        tier: result.tier,
        icon: result.icon,
        values,
        scratched: Array(6).fill(false),
        resolved: false,
        source
      };
      scratchCardState = [...gameState.lotteryActiveTicket.scratched];
      scratchCardValues = [...values];
      currentLotteryRollResult = result;
      renderLotteryTicket();
      renderGameCollectionSummary();
      updateHeaderStats();
      saveGameToStorage();
      playSound('click');
    }

    function renderLotteryTicket() {
      ensureV6State();
      const ticket = gameState.lotteryActiveTicket;
      const status = document.getElementById('lottery-ticket-status');
      const msg = document.getElementById('lottery-msg');
      const buyBtn = document.getElementById('lottery-buy-btn');
      for (let i = 0; i < 6; i++) {
        const slot = document.getElementById(`lslot-${i}`);
        if (!slot) continue;
        const scratched = !!(ticket && ticket.scratched && ticket.scratched[i]);
        slot.innerText = scratched ? ticket.values[i] : '❓';
        slot.className = scratched
          ? 'h-14 bg-rose-900 text-rose-200 rounded-xl flex items-center justify-center text-lg font-black border-2 border-rose-400'
          : 'h-14 bg-slate-700 hover:bg-slate-600 rounded-xl flex items-center justify-center text-lg font-black text-slate-400 cursor-pointer tap-scale border border-slate-500';
      }
      if (!ticket) {
        if (status) status.innerText = 'Chưa có vé. Mua một vé để bắt đầu.';
        if (msg) msg.innerText = 'Mệnh giá có thể xuất hiện: 5 • 10 • 20 • 30 • 50 • 100 • 200 • 500 • 1.000 Xu';
        if (buyBtn) { buyBtn.disabled = false; buyBtn.innerText = gameState.lotteryTickets > 0 ? `Dùng Vé Có Sẵn (x${gameState.lotteryTickets})` : 'Mua Vé (25 Xu)'; }
        return;
      }
      const scratchedCount = ticket.scratched.filter(Boolean).length;
      if (status) status.innerText = ticket.resolved ? `Vé Ngày ${ticket.day} • đã cào xong` : `Vé Ngày ${ticket.day} • đã cào ${scratchedCount}/6 ô${ticket.source === 'gift' ? ' • quà nhặt được' : ''}`;
      if (buyBtn) {
        buyBtn.disabled = !ticket.resolved;
        buyBtn.innerText = ticket.resolved ? (gameState.lotteryTickets > 0 ? `Dùng Vé Có Sẵn (x${gameState.lotteryTickets})` : 'Mua Vé Mới (25 Xu)') : 'Cào vé hiện tại trước';
      }
      if (!ticket.resolved && msg) msg.innerText = 'Cào đủ 6 ô. Có 3 mệnh giá giống nhau là trúng đúng số Xu đó!';
      if (ticket.resolved && msg) msg.innerText = ticket.amount > 0 ? `🎉 ${ticket.tier}: +${ticket.amount.toLocaleString()} Xu` : '🍃 Vé này không trúng. Chúc may mắn ở vé sau!';
    }

    function scratchLotterySlot(idx) {
      ensureV6State();
      const ticket = gameState.lotteryActiveTicket;
      if (!ticket) return showToast('Hãy mua vé trước khi cào!', '🎟️');
      if (ticket.resolved || ticket.scratched[idx]) return;
      ticket.scratched[idx] = true;
      scratchCardState = [...ticket.scratched];
      scratchCardValues = [...ticket.values];
      renderLotteryTicket();
      playSound('click');
      saveGameToStorage();
      if (ticket.scratched.every(Boolean)) handleLotteryOutcome();
    }

    function handleLotteryOutcome() {
      ensureV6State();
      const ticket = gameState.lotteryActiveTicket;
      if (!ticket || ticket.resolved) return;
      ticket.resolved = true;
      if (ticket.amount > 0) {
        gameState.coins += ticket.amount;
        playSound('coin');
        showToast(`Vé số: +${ticket.amount.toLocaleString()} Xu!`, ticket.icon);
        pushGameNotification(`Vé số trúng ${ticket.amount.toLocaleString()} Xu`, `${ticket.tier} • Vé Ngày ${ticket.day}`, ticket.icon, ticket.amount >= 500 ? 'rare' : 'game');
        if (ticket.amount >= 1000) addSouvenir('lottery_gold_ticket', 'Giải độc đắc');
        else if (ticket.amount >= 500) addSouvenir('lottery_red_stamp', 'Giải 500 Xu');
      } else {
        playSound('error');
      }
      gameState.lotteryHistory.unshift({ tier: ticket.tier, amount: ticket.amount, time: `Ngày ${ticket.day}` });
      if (gameState.lotteryHistory.length > 20) gameState.lotteryHistory = gameState.lotteryHistory.slice(0, 20);
      renderLotteryTicket();
      renderLotteryHistory();
      renderGameCollectionSummary();
      updateHeaderStats();
      saveGameToStorage();
    }

    function renderLotteryHistory() {
      const list = document.getElementById('lottery-history-list');
      const statsEl = document.getElementById('lottery-audit-stats');
      if (!list) return;
      const hist = gameState.lotteryHistory || [];
      if (statsEl) statsEl.innerText = `${hist.length} vé gần nhất`;
      if (hist.length === 0) {
        list.innerHTML = `<span class="text-slate-500 italic block text-center">Chưa có lượt cào nào</span>`;
        return;
      }
      list.innerHTML = hist.map((h, i) => {
        const color = h.amount >= 500 ? 'text-amber-300 font-black' : h.amount > 0 ? 'text-emerald-400 font-bold' : 'text-slate-500';
        return `<div class="flex items-center justify-between py-0.5 border-b border-slate-800/60"><span>#${i + 1} • ${h.time}</span><span class="${color}">${h.amount > 0 ? '+' + Number(h.amount).toLocaleString() + ' Xu' : 'Không trúng'}</span></div>`;
      }).join('');
    }

    const SOPPI_ITEMS_CONFIG = [
      { key: "cup_m", name: "Thùng 20 Ly M", qty: 20, price: 55, icon: "🥤", shipTime: 8 },
      { key: "tea_black", name: "Gói 10 Trà Đen Sỉ", qty: 10, price: 72, icon: "🍃", shipTime: 10 },
      { key: "topping_boba", name: "Bịch 15 Trân Châu", qty: 15, price: 68, icon: "🧋", shipTime: 12 },
      { key: "bowl_m", name: "Thùng 10 Thố M", qty: 10, price: 55, icon: "🍲", shipTime: 8 },
      { key: "broth_kimchi", name: "Bịch 8 Cốt Kim Chi", qty: 8, price: 88, icon: "🌶️", shipTime: 12 },
      { key: "skewer_fish", name: "Gói 20 Cá Viên", qty: 20, price: 75, icon: "🍢", shipTime: 10 }
    ];

    const SOPPI_CAREER_SALE_POOLS = {
      boba: ['cup_m','cup_l','cup_xl','tea_black','tea_green','tea_strawberry','tea_taro','milk_fresh','tea_honey','tea_oolong','tea_jasmine','topping_boba','topping_white_boba','topping_pudding','topping_jelly','topping_cheese_foam','topping_redbean','topping_grass_jelly','topping_aloe','topping_cookie','topping_mochi','topping_crystal','topping_lychee'],
      noodle: ['bowl_m','bowl_l','bowl_xl','broth_kimchi','broth_tomyum','broth_beef','broth_mushroom','broth_mala','broth_collagen','broth_tonkotsu','ntop_beef','ntop_shrimp','ntop_squid','ntop_fishcake','ntop_sausage','ntop_enoki','ntop_egg','ntop_cheese','ntop_tofu','ntop_bokchoy','ntop_crabstick','ntop_nori','ntop_meatball','ntop_corn','broth_herbal','ntop_dumpling','ntop_porkbelly'],
      streetfood: ['tray_plate','tray_basket','tray_box','skewer_fish','skewer_beef','skewer_shrimp','skewer_holo','skewer_sausage','skewer_tofu','skewer_quail','skewer_beef_enoki','skewer_corn','skewer_chicken','skewer_crabstick','skewer_okra','skewer_cheese_sausage','skewer_mushroom','skewer_bacon_okra','sauce_sweet_chili','sauce_tamarind','sauce_butter_garlic','sauce_cheese','sauce_satay','sauce_mayo','sauce_honey_mustard','skewer_squid','sauce_bbq']
    };

    function getCurrentMarketUnitPrice(itemKey) {
      const item = ITEM_DICTIONARY[itemKey];
      if (!item) return 1;
      const news = MARKET_NEWS_DATABASE[gameState.marketNewsIndex || 0] || MARKET_NEWS_DATABASE[0];
      const factor = news.factor && news.factor[itemKey] ? news.factor[itemKey] : 1;
      return Math.max(1, Math.round(item.basePrice * factor));
    }

    /* V87.4.3 — economic rules, compact marketplace, recipe hunt. */
    let v8743Tab='buy',v8743Group='all',v8743Search='',v8743ShowLocked=false,v8743Ultra=false,v8743Page=0,v8743RecipePage=0,v8743MarketPage=0;
    let v8743Cart={};
    function v8743Ensure(){
      if(!gameState.v8743RecipeFragments||typeof gameState.v8743RecipeFragments!=='object')gameState.v8743RecipeFragments={};
      if(!gameState.v8743RecipeBox||gameState.v8743RecipeBox.day!==gameState.day)gameState.v8743RecipeBox={day:gameState.day,count:0};
    }
    function v8743RecipeReady(recipe){
      if(recipe.v8743Npc&&!gameState.v874NpcRewards?.[recipe.v8743Npc])return false;
      if(recipe.v8743Discover){v8743Ensure();return (Number(gameState.v8743RecipeFragments[recipe.id])||0)>=2;}
      return true;
    }
    function v8743SoppiBundlePrice(key,qty){
      if(!ITEM_DICTIONARY[key]||!Number.isInteger(qty)||qty<=0)return 0;
      const atMarket=v8741MarketBuyUnitPrice(key)*qty;
      return Math.max(1,Math.min(atMarket,Math.round(atMarket*.95),atMarket>1?atMarket-1:atMarket));
    }
    function v8743SoppiFlashPrice(key,qty,discount){
      const normal=v8743SoppiBundlePrice(key,qty);
      const resale=getMarketSellUnitPrice(key)*qty+1;
      return Math.min(normal,Math.max(1,Math.round(normal*(1-discount/100)),resale));
    }
    function v8743SelectTab(tab){
      if(!['buy','sale','recipe','box'].includes(tab))return;
      v8743Tab=tab;
      document.querySelectorAll('[id^="v8743-panel-"]').forEach(e=>e.classList.toggle('hidden',e.id!==`v8743-panel-${tab}`));
      ['buy','sale','recipe','box'].forEach(x=>document.getElementById(`v8743-tab-${x}`)?.classList.toggle('active',x===tab));
      if(tab==='buy'){v8743RenderGoods();renderMarketUI();}
      if(tab==='sale'){renderSoppiFlashSale();renderDailyFlashDeal();}
      if(tab==='recipe')v8743RenderRecipes();
      if(tab==='box'){v8731ToggleMarket(true);v8731RenderShop();}
      renderSoppiActiveOrders();
    }
    function v8743SelectGroup(group){v8743Group=group;v8743Page=0;v8743RenderGoods();}
    function v8743SearchChange(value){v8743Search=String(value||'').trim().toLocaleLowerCase('vi');v8743Page=0;v8743RenderGoods();}
    function v8743ToggleLocked(){v8743ShowLocked=!v8743ShowLocked;v8743Page=0;v8743RenderGoods();}
    function v8743ToggleCompact(){v8743Ultra=!v8743Ultra;v8743RenderGoods();}
    function v8743OpenDirectMarket(){const p=document.getElementById('v8743-direct-market');if(p)p.open=true;renderMarketUI();}
    function v8743ShowLock(key){showToast('🔒 '+v8743ItemRequirementLabel(key),'📖');}
    function v8743EligibleGoods(){
      const career=gameState.currentCareer;
      const bundles=SOPPI_ITEMS_CONFIG.filter(x=>isItemRelevantToCareer(x.key,career));
      const used=new Set(bundles.map(x=>x.key));
      const others=Object.keys(CAREER_ITEM_STORY_UNLOCKS[career]||{}).filter(x=>!used.has(x)&&ITEM_DICTIONARY[x]).map(key=>({key,qty:5,name:ITEM_DICTIONARY[key].name,icon:ITEM_DICTIONARY[key].icon,shipTime:8}));
      const seeds=Object.keys(ITEM_DICTIONARY).filter(k=>ITEM_DICTIONARY[k].cat==='seed'&&!used.has(k)).map(key=>({key,qty:5,name:ITEM_DICTIONARY[key].name,icon:ITEM_DICTIONARY[key].icon,shipTime:10}));
      return [...bundles,...others,...seeds].filter(x=>{
        const unlock=isItemStoryUnlocked(x.key,career);
        if(!unlock&&!v8743ShowLocked)return false;
        if(v8743Search&&!x.name.toLocaleLowerCase('vi').includes(v8743Search)&&!ITEM_DICTIONARY[x.key].name.toLocaleLowerCase('vi').includes(v8743Search))return false;
        if(v8743Group==='broth'&&!/^(broth_|sauce_|tea_|syrup_)/.test(x.key))return false;
        if(v8743Group==='top'&&!/^(topping_|ntop_|skewer_)/.test(x.key))return false;
        if(v8743Group==='other'&&/^(broth_|sauce_|tea_|syrup_|topping_|ntop_|skewer_)/.test(x.key))return false;
        return true;
      }).sort((a,b)=>Number(!isItemStoryUnlocked(a.key,career))-Number(!isItemStoryUnlocked(b.key,career)));
    }
    function v8743Pager(id,page,total,fn){
      const el=document.getElementById(id);if(!el)return;
      const count=Math.max(1,Math.ceil(total/12));
      el.innerHTML=count>1?`<button onclick="${fn}(-1)" ${page<=0?'disabled':''}>‹</button>Trang ${page+1}/${count}<button onclick="${fn}(1)" ${page>=count-1?'disabled':''}>›</button>`:'';
    }
    function v8743ChangePage(n){v8743Page=Math.max(0,Math.min(Math.ceil(v8743EligibleGoods().length/12)-1,v8743Page+n));v8743RenderGoods();}
    function v8743RenderGoods(){
      const el=document.getElementById('soppi-items-grid');if(!el)return;
      const goods=v8743EligibleGoods();v8743Page=Math.max(0,Math.min(Math.ceil(goods.length/12)-1,v8743Page));
      el.classList.toggle('ultra',v8743Ultra);document.getElementById('v8743-compact-toggle').textContent=v8743Ultra?'▤ 3 cột':'▦ 4 cột';
      document.getElementById('v8743-buy-count').textContent=`${goods.length} món • ${v8743ShowLocked?'cả hàng khóa':'đã mở'}`;
      document.getElementById('v8743-locked-toggle').textContent=v8743ShowLocked?'🔒 Tất cả':'🔓 Mở';
      document.querySelectorAll('#v8743-groups button').forEach((b,i)=>b.classList.toggle('active',['all','broth','top','other'][i]===v8743Group));
      el.innerHTML=goods.slice(v8743Page*12,v8743Page*12+12).map(x=>{
        const item=ITEM_DICTIONARY[x.key],enabled=isItemStoryUnlocked(x.key,gameState.currentCareer);
        const price=v8743SoppiBundlePrice(x.key,x.qty),market=v8741MarketBuyUnitPrice(x.key)*x.qty;
        const inv=Number(gameState.inventory[x.key])||0;
        return `<div class="v8743-card ${enabled?'':'locked'}"><span class="v8743-symbol">${x.icon||item.icon}</span><b title="${escapeHtmlText(x.name)}">${escapeHtmlText(x.name)}</b><small>x${x.qty} • Kho ${inv}</small>${enabled?`<span class="v8743-price">${price} Xu <s style="color:#929cac;font-size:7px">${market}</s></span><button onclick="v8743AddCart('${x.key}',${x.qty})">＋ Giỏ</button>`:`<small style="color:#ffc77c">🔒 Chưa mở</small><button class="v8743-locked" onclick="v8743ShowLock('${x.key}')">Điều kiện</button>`}</div>`;
      }).join('')||'<div style="grid-column:1/-1;text-align:center;padding:15px;color:#f8ddb2">Không tìm thấy nguyên liệu phù hợp.</div>';
      v8743Pager('v8743-buy-pager',v8743Page,goods.length,'v8743ChangePage');v8743RenderCart();
    }
    function v8743AddCart(key,qty){
      if(!isItemStoryUnlocked(key,gameState.currentCareer))return v8743ShowLock(key);
      if(!ITEM_DICTIONARY[key]||qty<1||qty>20)return;
      const next=(Number(v8743Cart[key])||0)+qty;
      if(next>80)return showToast('Mỗi mặt hàng tối đa 80 đơn vị/lượt.','📦');
      v8743Cart[key]=next;v8743RenderCart();playSound('click');
    }
    function v8743RenderCart(){
      const box=document.getElementById('v8743-cart');if(!box)return;
      const rows=Object.entries(v8743Cart).filter(([k,q])=>q>0&&ITEM_DICTIONARY[k]);
      const total=rows.reduce((sum,[k,q])=>sum+v8743SoppiBundlePrice(k,q),0);
      box.querySelector('span').textContent=rows.length?`🛒 ${rows.length} loại • ${total} Xu`:'🛒 Chưa chọn hàng';
      box.querySelector('button').textContent=rows.length?'Đặt chung 🚚':'Chọn món';
    }
    function v8743Checkout(){
      const rows=Object.entries(v8743Cart).filter(([k,q])=>q>0&&ITEM_DICTIONARY[k]);
      if(!rows.length)return showToast('Hãy chọn nguyên liệu trước nhé!','🛒');
      if(rows.some(([key])=>!isItemStoryUnlocked(key,gameState.currentCareer)))return showToast('Giỏ có món chưa mở khóa. Hãy kiểm tra lại.','🔒');
      const total=rows.reduce((sum,[k,q])=>sum+v8743SoppiBundlePrice(k,q),0);
      if(gameState.coins<total)return showToast(`Cần ${total} Xu để thanh toán giỏ hàng!`,'🪙');
      gameState.coins-=total;
      if(!Array.isArray(gameState.soppiOrders))gameState.soppiOrders=[];
      rows.forEach(([key,qty],i)=>{
        const item=ITEM_DICTIONARY[key],time=8+Math.min(10,Math.ceil(qty/6));
        gameState.soppiOrders.push({id:Date.now()+i+Math.random(),itemKey:key,qty,name:item.name,icon:item.icon,timeLeft:time,maxTime:time});
      });
      if(gameState.dailyStats)gameState.dailyStats.wholesaleSpent=(gameState.dailyStats.wholesaleSpent||0)+total;
      v8743Cart={};playSound('coin');showToast(`Đã đặt ${rows.length} loại hàng, tổng ${total} Xu • Đang giao!`,'🚚');
      updateHeaderStats();v8743RenderGoods();renderSoppiActiveOrders();saveGameToStorage();
    }
    function v8743RecipeState(recipe){
      const stage=(Number(gameState.shopStage)||0),lv=(Number(gameState.level)||1);
      if(lv<recipe.reqLevel||stage<recipe.reqStage)return `🔒 Lv.${recipe.reqLevel} • Ch.${recipe.reqStage+1}`;
      if(recipe.v8743Npc&&!gameState.v874NpcRewards?.[recipe.v8743Npc])return `🔒 Truyện ${V8743_NPC_NAMES[recipe.v8743Npc]}`;
      if(recipe.v8743Discover){v8743Ensure();const count=Math.min(2,Number(gameState.v8743RecipeFragments[recipe.id])||0);if(count<2)return `🧩 Mảnh ${count}/2`;}
      const missing=getRecipeIngredientKeys(gameState.currentCareer,recipe.order).filter(k=>!isItemStoryUnlocked(k,gameState.currentCareer));
      if(missing.length)return `🔒 ${v8743ItemRequirementLabel(missing[0])}`;
      return '✅ Đã học';
    }
    function v8743RenderRecipes(){
      const el=document.getElementById('v8743-recipe-grid');if(!el)return;
      const recipes=[...(RECIPE_BOOK[gameState.currentCareer]||[])].sort((a,b)=>Number(b.id.startsWith('v8743_'))-Number(a.id.startsWith('v8743_')));
      const unlocked=getUnlockedRecipes(gameState.currentCareer);
      const status=document.getElementById('v8743-recipe-count');status.textContent=`${unlocked.length}/${recipes.length} món • theo nghề hiện tại`;
      v8743RecipePage=Math.max(0,Math.min(Math.ceil(recipes.length/8)-1,v8743RecipePage));
      const slice=recipes.slice(v8743RecipePage*8,v8743RecipePage*8+8);
      el.innerHTML=slice.map(r=>{const ready=unlocked.includes(r),status=v8743RecipeState(r);
        return `<div class="v8743-recipe ${ready?'':'locked'}"><b>${ready?'🍽️':'🔒'} ${escapeHtmlText(r.name)}</b><small>${status}</small><em>${ready?'Có thể chế biến':r.v8743Discover?'Săn mảnh trong hộp công thức':'Mở theo tiến trình'}</em></div>`;}).join('');
      const page=document.getElementById('v8743-recipe-pager');
      const pages=Math.ceil(recipes.length/8);page.innerHTML=pages>1?`<button onclick="v8743ChangeRecipePage(-1)" ${v8743RecipePage===0?'disabled':''}>‹</button>Trang ${v8743RecipePage+1}/${pages}<button onclick="v8743ChangeRecipePage(1)" ${v8743RecipePage>=pages-1?'disabled':''}>›</button>`:'';
      v8743Ensure();document.getElementById('v8743-recipe-box-hint').textContent=`🎲 Hộp công thức: 75 Xu • còn ${Math.max(0,3-gameState.v8743RecipeBox.count)}/3 lượt hôm nay. Chỉ rơi mảnh phù hợp cấp & chương; món NPC không xuất hiện trong hộp.`;
    }
    function v8743ChangeRecipePage(n){const count=(RECIPE_BOOK[gameState.currentCareer]||[]).length;v8743RecipePage=Math.max(0,Math.min(Math.ceil(count/8)-1,v8743RecipePage+n));v8743RenderRecipes();}
    function v8743BuyRecipeBox(){
      v8743Ensure();const eligible=(RECIPE_BOOK[gameState.currentCareer]||[]).filter(r=>r.v8743Discover&&(Number(gameState.level)||1)>=(r.reqLevel||1)&&(Number(gameState.shopStage)||0)>=(r.reqStage||0)&&(gameState.v8743RecipeFragments[r.id]||0)<2);
      if(!eligible.length)return showToast('Hãy mở chương mới, hoặc bạn đã sưu tập đủ công thức!','📖');
      if(gameState.v8743RecipeBox.count>=3)return showToast('Hôm nay đã săn đủ 3 hộp công thức.','📦');
      if(gameState.coins<75)return showToast('Cần 75 Xu để săn hộp công thức.','🪙');
      const r=eligible[Math.floor(Math.random()*eligible.length)];
      gameState.coins-=75;gameState.v8743RecipeBox.count++;
      gameState.v8743RecipeFragments[r.id]=(Number(gameState.v8743RecipeFragments[r.id])||0)+1;
      const done=gameState.v8743RecipeFragments[r.id]>=2;
      showToast(`🧩 ${r.name}: mảnh ${gameState.v8743RecipeFragments[r.id]}/2${done?' • ĐÃ HỌC CÔNG THỨC!':''}`,'📖');
      playSound('coin');updateHeaderStats();v8743RenderRecipes();saveGameToStorage();
    }

    function generateSoppiFlashSale(force = false) {
      const now = Date.now();
      const old = gameState.soppiFlashSale;
      if (!force && old && old.day === gameState.day && Number(old.endsAt) > now && Array.isArray(old.offers) && old.offers.every(o => isItemStoryUnlocked(o.itemKey, gameState.currentCareer))) {
        old.offers.forEach(o=>{const requestedDiscount=Math.max(0,Math.min(70,Number(o.requestedDiscountPercent??o.discountPercent)||25));o.requestedDiscountPercent=requestedDiscount;o.normalPrice=v8743SoppiBundlePrice(o.itemKey,o.qty);o.salePrice=v8743SoppiFlashPrice(o.itemKey,o.qty,requestedDiscount);o.discountPercent=Math.max(0,Math.round((1-o.salePrice/o.normalPrice)*100));});
        return old;
      }

      const careerPool = (SOPPI_CAREER_SALE_POOLS[gameState.currentCareer] || []).filter(k => ITEM_DICTIONARY[k] && isItemStoryUnlocked(k, gameState.currentCareer));
      const supportPool = Object.keys(ITEM_DICTIONARY).filter(k => ['seed','farm','dairy'].includes(ITEM_DICTIONARY[k].cat) && isItemStoryUnlocked(k, gameState.currentCareer) && isItemRelevantToCareer(k, gameState.currentCareer));
      const marketNews = MARKET_NEWS_DATABASE[gameState.marketNewsIndex || 0] || MARKET_NEWS_DATABASE[0];
      const eventPool = (marketNews.dealPool || []).filter(k => ITEM_DICTIONARY[k] && isItemStoryUnlocked(k, gameState.currentCareer));
      const pool = [...new Set([...eventPool, ...careerPool, ...supportPool, ...Object.keys(CAREER_ITEM_STORY_UNLOCKS[gameState.currentCareer]||{})])].filter(k=>ITEM_DICTIONARY[k]&&isItemStoryUnlocked(k,gameState.currentCareer)&&v8743SoppiFlashPrice(k,5,20)<v8743SoppiBundlePrice(k,5));
      const chosen = [];
      const available = [...pool];
      while (chosen.length < 3 && available.length) {
        const idx = Math.floor(Math.random() * available.length);
        chosen.push(available.splice(idx, 1)[0]);
      }

      const offers = chosen.map((itemKey, idx) => {
        const qty = [3, 5, 8, 10][Math.floor(Math.random() * 4)];
        const growthBonus = getGrowthBonuses();
        const isMega = Math.random() < Math.min(0.45, 0.18 + growthBonus.luckPct * 0.7);
        const baseDiscount = isMega ? [45, 50, 55][Math.floor(Math.random() * 3)] : [15, 20, 25, 30, 35, 40][Math.floor(Math.random() * 6)];
        const discountPercent = Math.min(70, baseDiscount + Math.floor(growthBonus.luckPct * 20));
        const normalPrice = v8743SoppiBundlePrice(itemKey,qty);
        const salePrice = v8743SoppiFlashPrice(itemKey,qty,discountPercent);
        return {
          id: `${gameState.day}-${now}-${idx}`,
          itemKey,
          qty,
          normalPrice,
          salePrice,
          requestedDiscountPercent: discountPercent,
          discountPercent: Math.max(0,Math.round((1-salePrice/normalPrice)*100)),
          stock: 1 + Math.floor(Math.random() * 3),
          shipTime: 5 + Math.floor(Math.random() * 8),
          mega: isMega
        };
      });

      gameState.soppiFlashSale = {
        day: gameState.day,
        createdAt: now,
        endsAt: now + 60000,
        offers
      };
      return gameState.soppiFlashSale;
    }

    function renderSoppiFlashSale() {
      const box = document.getElementById('soppi-sale-grid');
      const countdown = document.getElementById('soppi-flash-countdown');
      if (!box) return;
      let sale = generateSoppiFlashSale(false);
      if (Date.now() >= Number(sale.endsAt || 0)) sale = generateSoppiFlashSale(true);
      const secs = Math.max(0, Math.ceil((Number(sale.endsAt) - Date.now()) / 1000));
      if (countdown) countdown.innerText = `00:${String(secs).padStart(2, '0')}`;

      box.innerHTML = sale.offers.map((offer, idx) => {
        const item = ITEM_DICTIONARY[offer.itemKey];
        const soldOut = Number(offer.stock) <= 0;
        const inv = gameState.inventory[offer.itemKey] || 0;
        return `
          <div class="relative p-1.5 rounded-xl border ${offer.mega ? 'border-rose-400 bg-rose-950/60' : 'border-orange-500/30 bg-slate-900/80'} min-w-0">
            ${offer.mega ? '<span class="absolute -top-1 -right-1 text-[6px] bg-rose-500 text-white px-1 rounded-full font-black">SIÊU SALE</span>' : ''}
            <div class="text-center text-xl leading-none">${item.icon}</div>
            <b class="block text-[8px] text-slate-100 truncate text-center mt-1">${escapeHtmlText(item.name)}</b>
            <div class="text-center mt-0.5">
              <span class="text-[7px] text-slate-500 line-through">${offer.normalPrice}</span>
              <span class="text-[9px] text-rose-300 font-black ml-0.5">${offer.salePrice} Xu</span>
            </div>
            <div class="text-[7px] text-center text-orange-300">-${offer.discountPercent}% • x${offer.qty}</div>
            <div class="text-[7px] text-center text-slate-400">Kho bạn: ${inv} • Còn ${Math.max(0, offer.stock)} suất</div>
            <button ${soldOut ? 'disabled' : ''} onclick="buySoppiFlashOffer(${idx})" class="w-full mt-1 py-1 rounded-lg text-[8px] font-black ${soldOut ? 'bg-slate-700 text-slate-500' : 'bg-rose-600 hover:bg-rose-500 text-white tap-scale'}">${soldOut ? 'Hết Deal' : 'Săn Ngay'}</button>
          </div>`;
      }).join('');
    }

    function buySoppiFlashOffer(index) {
      const sale = generateSoppiFlashSale(false);
      const offer = sale && sale.offers ? sale.offers[index] : null;
      if (!offer) return showToast('Deal vừa đổi, thử lại nhé!', '⚡');
      if (Date.now() >= Number(sale.endsAt || 0)) {
        generateSoppiFlashSale(true);
        renderSoppiFlashSale();
        return showToast('Bạn chậm một nhịp! Flash Sale vừa đổi.', '⏱️');
      }
      if (offer.stock <= 0) return showToast('Deal này đã hết suất!', '💨');
      const realPrice=v8743SoppiFlashPrice(offer.itemKey,offer.qty,offer.requestedDiscountPercent??offer.discountPercent);
      if (gameState.coins < realPrice) return showToast('Không đủ Xu để săn deal!', '❌');
      const item = ITEM_DICTIONARY[offer.itemKey];
      if (!item) return;
      if (!isItemStoryUnlocked(offer.itemKey, gameState.currentCareer)) {
        generateSoppiFlashSale(true);
        renderSoppiFlashSale();
        return showToast('Deal này chưa mở theo cốt truyện nên Soppi đã đổi deal khác.', '🔒');
      }

      gameState.coins -= realPrice;
      offer.stock -= 1;
      if (!Array.isArray(gameState.soppiOrders)) gameState.soppiOrders = [];
      gameState.soppiOrders.push({
        id: Date.now() + Math.random(),
        itemKey: offer.itemKey,
        qty: offer.qty,
        name: `${item.name} Flash Sale`,
        icon: item.icon,
        timeLeft: offer.shipTime,
        maxTime: offer.shipTime
      });
      if (gameState.dailyStats) gameState.dailyStats.wholesaleSpent = (gameState.dailyStats.wholesaleSpent || 0) + realPrice;
      addExp(8);
      playSound('coin');
      showToast(`Săn được -${offer.discountPercent}%: ${offer.qty} ${item.name}!`, '⚡');
      updateHeaderStats();
      renderSoppiFlashSale();
      renderSoppiActiveOrders();
      saveGameToStorage();
    }

    function renderSoppiApp() {
      v8743Ensure();
      const news=MARKET_NEWS_DATABASE[gameState.marketNewsIndex||0]||MARKET_NEWS_DATABASE[0];
      const chip=document.getElementById('v8743-market-chip');if(chip)chip.textContent=`${news.icon||'📰'} ${news.headline||'Tin thị trường hôm nay'}`;
      v8743SelectTab(v8743Tab);
    }
    // Legacy direct order entry-point retained with server-side price recalculation.
    function orderSoppiItem(itemKey, qty, _price, shipTime, name, icon) {
      if(!isItemStoryUnlocked(itemKey,gameState.currentCareer))return v8743ShowLock(itemKey);
      if(!ITEM_DICTIONARY[itemKey]||!Number.isInteger(qty)||qty<1||qty>80)return;
      const price=v8743SoppiBundlePrice(itemKey,qty);
      if(gameState.coins<price)return showToast('Không đủ Xu trên Soppi!','❌');
      gameState.coins-=price;
      if(!Array.isArray(gameState.soppiOrders))gameState.soppiOrders=[];
      gameState.soppiOrders.push({id:Date.now()+Math.random(),itemKey,qty,name:ITEM_DICTIONARY[itemKey].name,icon:ITEM_DICTIONARY[itemKey].icon,timeLeft:shipTime,maxTime:shipTime});
      if(gameState.dailyStats)gameState.dailyStats.wholesaleSpent=(gameState.dailyStats.wholesaleSpent||0)+price;
      playSound('coin');showToast(`Đã đặt ${qty} ${name}: ${price} Xu. Đang giao!`,'📦');
      updateHeaderStats();renderSoppiActiveOrders();saveGameToStorage();
    }

    function renderSoppiActiveOrders() {
      const container = document.getElementById('soppi-active-deliveries');
      if (!container) return;

      const orders = gameState.soppiOrders || [];
      if (orders.length === 0) {
        container.innerHTML = `<span class="text-[9px] text-slate-500 italic block py-1">Không có đơn Soppi nào đang giao.</span>`;
        return;
      }

      container.innerHTML = '';
      orders.forEach(ord => {
        const pct = Math.min(100, Math.floor(((ord.maxTime - ord.timeLeft) / ord.maxTime) * 100));
        container.innerHTML += `
          <div class="p-1.5 bg-slate-800/90 rounded-xl border border-slate-700 space-y-1">
            <div class="flex items-center justify-between text-[9px]">
              <span class="text-slate-300 font-bold">${ord.icon} ${ord.name} (+${ord.qty})</span>
              <span class="text-orange-400 font-bold">🚚 ${ord.timeLeft}s</span>
            </div>
            <div class="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
              <div class="bg-orange-500 h-full transition-all" style="width: ${pct}%"></div>
            </div>
          </div>
        `;
      });
    }

    // Tin tức / lễ hội / biến động kinh tế riêng của khu kinh doanh.
    // Khác với thời tiết: tin này tác động giá nhập/bán và nhu cầu khách trong ngày.
    const MARKET_NEWS_DATABASE = [
      { icon:'🍓', type:'TIN NÔNG SẢN', headline:'Mùa dâu trúng vụ, xe hàng đổ về chợ!', impact:'Dâu và hạt dâu giảm mạnh; đồ uống trái cây được chú ý hơn.', factor:{ crop_strawberry:.65, seed_strawberry:.65, tea_strawberry:.80 }, sellFactor:{ crop_strawberry:.85 }, dealPool:['tea_strawberry','crop_strawberry','seed_strawberry'], tags:['harvest_season'], careerEffects:{ boba:{ revenuePct:.07, arrivalPct:.06 } } },
      { icon:'🌶️', type:'XU HƯỚNG', headline:'Cơn sốt mì cay lan khắp huyện!', impact:'Cốt mì và thố tăng giá vì nhu cầu cao, nhưng khách gọi mì nhiều hơn.', factor:{ broth_kimchi:1.25, bowl_m:1.25, bowl_l:1.20 }, sellFactor:{ broth_kimchi:1.12 }, dealPool:['ntop_beef','ntop_fishcake','ntop_enoki'], tags:['food_fair'], careerEffects:{ noodle:{ revenuePct:.12, arrivalPct:.18, tipPct:.03 } } },
      { icon:'🎏', type:'LỄ HỘI', headline:'Hội làng mở hội xuyên tối!', impact:'Đồ xiên, khay giấy được xả kho; lượng khách đi chơi tăng mạnh.', factor:{ skewer_fish:.80, skewer_beef:.80, tray_plate:.80 }, sellFactor:{ skewer_sausage:1.10, sauce_sweet_chili:1.08 }, dealPool:['skewer_fish','skewer_beef','skewer_sausage','tray_plate'], tags:['village_festival'], shopEffects:{ arrivalPct:.20, specialNpcPct:.06, tipPct:.04 }, careerEffects:{ streetfood:{ revenuePct:.12 } } },
      { icon:'🐟', type:'NGUỒN HÀNG', headline:'Tàu cá cập bến sớm, hải sản đầy chợ!', impact:'Tôm, cá viên và mực giảm giá; món hải sản bán lại kém giá hơn một chút.', factor:{ skewer_fish:.70, skewer_shrimp:.75, ntop_shrimp:.80, ntop_squid:.80 }, sellFactor:{ skewer_fish:.88, skewer_shrimp:.90, ntop_shrimp:.92, ntop_squid:.92 }, dealPool:['skewer_fish','skewer_shrimp','ntop_shrimp','ntop_squid'], tags:['harvest_season'] },
      { icon:'🚚', type:'LOGISTICS', headline:'Xe hàng kẹt quốc lộ, bao bì về chậm!', impact:'Ly, thố và khay tăng giá; phí giao hàng trong ngày cũng nhích lên.', factor:{ cup_m:1.25, cup_l:1.25, bowl_m:1.20, tray_plate:1.20 }, dealPool:['topping_boba','skewer_holo','ntop_egg'], tags:['road_repair'], shopEffects:{ deliveryPct:.08, opCost:8 } },
      { icon:'📸', type:'TIN MẠNG XÃ HỘI', headline:'Một reviewer nổi tiếng đang săn quán ngon trong làng!', impact:'Khách đặc biệt dễ ghé hơn và quán tốt có thể bán được giá cao hơn.', factor:{}, dealPool:['tea_honey','ntop_beef','skewer_beef_enoki'], tags:['viral_clip'], shopEffects:{ specialNpcPct:.12, revenuePct:.06, arrivalPct:.10 } },
      { icon:'🚌', type:'DU LỊCH', headline:'Đoàn khách du lịch ghé làng trong hôm nay!', impact:'Khách lạ và nhóm đi chơi đông hơn; món đặc sản dễ bán.', factor:{}, dealPool:['skewer_holo','tea_strawberry','ntop_shrimp'], tags:['tour_bus'], shopEffects:{ arrivalPct:.28, specialNpcPct:.15, revenuePct:.05, tipPct:.04 } },
      { icon:'💵', type:'KINH TẾ', headline:'Ngày lĩnh lương: sức mua trong làng tăng!', impact:'Khách ít nhạy giá hơn và tiền tip có xu hướng cao hơn.', factor:{}, dealPool:['topping_cheese_foam','ntop_beef','skewer_beef'], tags:['salary_day'], shopEffects:{ revenuePct:.06, tipPct:.06, arrivalPct:.08 } },
      { icon:'🏫', type:'SỰ KIỆN', headline:'Trường huyện tổ chức hội thao cuối tuần!', impact:'Học sinh và phụ huynh tăng nhu cầu đồ ăn nhanh, thức uống tiện mang đi.', factor:{ cup_m:1.08, tray_plate:1.08 }, dealPool:['topping_jelly','skewer_sausage','cup_l'], tags:['school_event'], shopEffects:{ arrivalPct:.16 }, careerEffects:{ boba:{ revenuePct:.05 }, streetfood:{ revenuePct:.07 } } },
      { icon:'🍜', type:'ẨM THỰC', headline:'Tuần lễ ẩm thực địa phương bắt đầu!', impact:'Khách thích thử món mới, review nhiều hơn và nguyên liệu cao cấp được săn.', factor:{ ntop_beef:1.10, topping_cheese_foam:1.10, skewer_beef_enoki:1.10 }, dealPool:['ntop_enoki','topping_pudding','sauce_butter_garlic'], tags:['food_fair'], shopEffects:{ arrivalPct:.18, revenuePct:.07, tipPct:.05, specialNpcPct:.07 } }
    ];

    MARKET_NEWS_DATABASE[0].factor.crop_sim=.75;
    MARKET_NEWS_DATABASE[0].sellFactor.crop_sim=.84;
    MARKET_NEWS_DATABASE[2].factor.crop_sim=1.20;
    MARKET_NEWS_DATABASE[2].sellFactor.crop_sim=1.10;
    MARKET_NEWS_DATABASE[7].factor.tea_black=1.13; // Payday pushes demand for daily tea
    function announceDailyMarketNews(force = false) {
      const news = getActiveMarketNews();
      if (!news) return;
      const stamp = `${gameState.day}:${gameState.marketNewsIndex || 0}`;
      if (!force && gameState.lastMarketNewsNotice === stamp) return;
      gameState.lastMarketNewsNotice = stamp;
      pushGameNotification(`${news.type || 'TIN QUAN TRỌNG'} • ${news.headline}`, news.impact, news.icon || '📰', 'market');
    }

    function getMarketSellUnitPrice(itemKey) {
      const item = ITEM_DICTIONARY[itemKey];
      if (!item) return 1;
      const news = getActiveMarketNews();
      const factor = news && news.sellFactor && news.sellFactor[itemKey] ? Number(news.sellFactor[itemKey]) : 1;
      const marketUnit = getCurrentMarketUnitPrice(itemKey);
      const npcBonus=(['farm','dairy'].includes(item.cat) || itemKey.startsWith('crop_')) ? v8741Bonuses().farmSellPct : 0;
      const baseline=Math.max(1,Math.floor(marketUnit * .70 * factor));
      return npcBonus>0?Math.min(marketUnit,baseline+1):baseline;
    }

    function generateDailyFlashDeal(force = false) {
      if (!force && gameState.dailyDeal && gameState.dailyDeal.day === gameState.day && isItemStoryUnlocked(gameState.dailyDeal.itemKey, gameState.currentCareer)) return gameState.dailyDeal;

      const news = MARKET_NEWS_DATABASE[gameState.marketNewsIndex || 0] || MARKET_NEWS_DATABASE[0];
      let pool = Array.isArray(news.dealPool) ? news.dealPool.filter(k => ITEM_DICTIONARY[k] && isItemStoryUnlocked(k, gameState.currentCareer)) : [];
      if (pool.length === 0) pool = Object.keys(ITEM_DICTIONARY).filter(k => ITEM_DICTIONARY[k].cat === 'craft' && isItemStoryUnlocked(k, gameState.currentCareer));

      const itemKey = pool[Math.floor(Math.random() * pool.length)];
      const item = ITEM_DICTIONARY[itemKey];
      const qtyOptions = [5, 8, 10, 12, 15, 20];
      const qty = qtyOptions[Math.floor(Math.random() * qtyOptions.length)];
      const discount = [0.45, 0.5, 0.55, 0.6, 0.65][Math.floor(Math.random() * 5)];
      const normalPrice = v8741MarketBuyUnitPrice(itemKey)*qty;
      const dealPrice = Math.min(normalPrice,Math.max(10, Math.round(normalPrice * discount),(getMarketSellUnitPrice(itemKey)+1)*qty));

      gameState.dailyDeal = {
        day: gameState.day,
        eventIndex: gameState.marketNewsIndex || 0,
        itemKey,
        qty,
        normalPrice,
        dealPrice,
        discountPercent: Math.round((1 - dealPrice / normalPrice) * 100)
      };
      return gameState.dailyDeal;
    }

    function renderDailyFlashDeal() {
      const deal = generateDailyFlashDeal(false);
      const item = ITEM_DICTIONARY[deal.itemKey];
      const desc = document.getElementById('market-deal-desc');
      const btn = document.getElementById('btn-claim-deal');
      if (desc) {
        desc.innerText = `${item.icon} ${deal.qty} × ${item.name}: ${deal.dealPrice} Xu (giá thường ${deal.normalPrice} • giảm ${deal.discountPercent}%) • chỉ hôm nay`;
      }
      if (btn) {
        if (gameState.claimedDailyDeal) {
          btn.innerText = 'Đã Chốt ✓';
          btn.disabled = true;
          btn.className = 'px-2.5 py-1 bg-slate-300 text-slate-500 font-bold text-[10px] rounded-xl';
        } else {
          btn.innerText = `Chốt ${deal.dealPrice} Xu 📦`;
          btn.disabled = false;
          btn.className = 'px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white font-black text-[10px] rounded-xl shadow tap-scale';
        }
      }
    }

    let currentMarketFilter = 'all';
    function setMarketTabFilter(f) {
      currentMarketFilter = f;
      v8743MarketPage=0;
      ['all', 'craft', 'farm', 'sell'].forEach(item => {
        const btn = document.getElementById(`mfilter-${item}`);
        if (btn) {
          btn.classList.toggle('active',item===f);
        }
      });
      renderMarketUI();
    }

    function renderMarketUI() {
      const news = MARKET_NEWS_DATABASE[gameState.marketNewsIndex || 0] || MARKET_NEWS_DATABASE[0];
      const hEl = document.getElementById('market-news-headline');
      const iEl = document.getElementById('market-news-impact');
      if (hEl) hEl.innerText = `${news.icon || '📰'} ${news.type || 'TIN THỊ TRƯỜNG'} • ${news.headline}`;
      if (iEl) iEl.innerText = news.impact;
      renderDailyFlashDeal();

      const grid = document.getElementById('market-items-grid');
      if (!grid) return;

      grid.innerHTML = '';
      const isSellTab = currentMarketFilter === 'sell';

      const eligible=Object.keys(ITEM_DICTIONARY).filter(k=>{
        const item=ITEM_DICTIONARY[k],qty=gameState.inventory[k]||0;
        if(isSellTab)return qty>0;
        if(!isItemRelevantToCareer(k,gameState.currentCareer)||!isItemStoryUnlocked(k,gameState.currentCareer))return false;
        if(currentMarketFilter==='craft')return item.cat==='craft';
        if(currentMarketFilter==='farm')return ['seed','farm','dairy'].includes(item.cat);
        return true;
      });
      v8743MarketPage=Math.max(0,Math.min(Math.ceil(eligible.length/12)-1,v8743MarketPage));
      eligible.slice(v8743MarketPage*12,v8743MarketPage*12+12).forEach(k => {
        const item = ITEM_DICTIONARY[k];
        const currentStock = gameState.inventory[k] || 0;
        if (!isSellTab) {
          if (!isItemRelevantToCareer(k, gameState.currentCareer)) return;
          if (!isItemStoryUnlocked(k, gameState.currentCareer)) return;
        }

        // Trạng thái tồn kho màu sắc
        let stockBadge = `<span class="text-[8px] text-rose-500 font-black">🔴 Kho: 0</span>`;
        if (currentStock >= 10) {
          stockBadge = `<span class="text-[8px] text-emerald-600 font-bold">🟢 Kho: ${currentStock}</span>`;
        } else if (currentStock > 0) {
          stockBadge = `<span class="text-[8px] text-amber-600 font-bold">🟡 Kho: ${currentStock}</span>`;
        }

        if (!isSellTab) {
          if (currentMarketFilter === 'craft' && item.cat !== 'craft') return;
          if (currentMarketFilter === 'farm' && item.cat !== 'farm' && item.cat !== 'dairy') return;

          const normalPrice=getCurrentMarketUnitPrice(k);
          const price=v8741MarketBuyUnitPrice(k);
          const npcDiscount=normalPrice>price?`<span class="text-[8px] text-emerald-300">🎁 ${normalPrice} Xu → ${price} Xu</span>`:'';

          grid.innerHTML += `
            <div class="v8743-card">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-2xl">${item.icon}</span>
                <div class="min-w-0">
                  <b class="text-[11px] text-slate-100 block truncate">${item.name}</b>
                  <div class="flex items-center gap-1.5 mt-0.5">
                    <span class="text-[9px] text-slate-500 font-semibold">${price} Xu</span>
                    ${npcDiscount}
                    ${stockBadge}
                  </div>
                </div>
              </div>
              <div class="flex gap-1 pt-1 border-t border-slate-700">
                <button onclick="buyMarketItem('${k}', 1, ${price})" class="flex-1 py-1 bg-amber-500 hover:bg-amber-600 text-white font-bold text-[9px] rounded-lg tap-scale">
                  +1
                </button>
                <button onclick="buyMarketItem('${k}', 5, ${price})" class="flex-1 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold text-[9px] rounded-lg tap-scale">
                  +5
                </button>
              </div>
            </div>
          `;
        } else {
          if (currentStock <= 0) return;
          const sellPrice = getMarketSellUnitPrice(k);

          grid.innerHTML += `
            <div class="v8743-card">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-2xl">${item.icon}</span>
                <div class="min-w-0">
                  <b class="text-[11px] text-slate-100 block truncate">${item.name}</b>
                  <span class="text-[8px] text-emerald-600 font-bold">Thu: ${sellPrice} Xu/món</span>
                </div>
              </div>
              <div class="mb-1">${stockBadge}</div>
              <button onclick="sellMarketItem('${k}', 1, ${sellPrice})" class="w-full py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[9px] rounded-lg tap-scale">
                Bán 1 (+${sellPrice} Xu)
              </button>
            </div>
          `;
        }
      });
      v8743Pager('v8743-market-pager',v8743MarketPage,eligible.length,'v8743ChangeMarketPage');
    }
    function v8743ChangeMarketPage(n){v8743MarketPage=Math.max(0,v8743MarketPage+n);renderMarketUI();}

    function buyMarketItem(key, qty, unitPrice) {
      if (!isItemStoryUnlocked(key, gameState.currentCareer)) return showToast(`Món này chưa mở theo cốt truyện • ${getStoryUnlockLabel(key, gameState.currentCareer)}`, '🔒');
      // Recalculate from daily market news + earned relics (never trust inline onclick price).
      if(!ITEM_DICTIONARY[key] || !Number.isInteger(qty) || qty<1 || qty>5)return;
      const finalUnitPrice=v8741MarketBuyUnitPrice(key);
      const total=qty*finalUnitPrice;
      if (gameState.coins < total) return showToast("Không đủ Xu để nhập hàng!", "❌");

      gameState.coins -= total;
      gameState.inventory[key] = (gameState.inventory[key] || 0) + qty;
      playSound('coin');
      showToast(`Đã nhập +${qty} ${ITEM_DICTIONARY[key].name}!`, ITEM_DICTIONARY[key].icon);
      updateHeaderStats();
      renderMarketUI();
      saveGameToStorage();
    }

    function sellMarketItem(key, qty, unitPrice) {
      const count = gameState.inventory[key] || 0;
      if (count < qty) return;

      // Resolve at the up-to-date fair market rate; button price cannot override this.
      const currentSellPrice=getMarketSellUnitPrice(key);
      gameState.inventory[key] -= qty;
      gameState.coins += currentSellPrice * qty;
      playSound('coin');
      showToast(`Đã bán ${qty} ${ITEM_DICTIONARY[key].name}!`, "💰");
      updateHeaderStats();
      renderMarketUI();
      saveGameToStorage();
    }

    function buyDailyFlashDeal() {
      if (gameState.claimedDailyDeal) {
        return showToast("Bạn đã chốt kèo thơm hôm nay rồi!", "⏳");
      }

      const deal = generateDailyFlashDeal(false);
      const item = ITEM_DICTIONARY[deal.itemKey];
      if (!item) return showToast("Kèo hôm nay bị lỗi dữ liệu, thử sang ngày mới nhé!", "⚠️");
      if (!isItemStoryUnlocked(deal.itemKey, gameState.currentCareer)) {
        gameState.dailyDeal = null;
        generateDailyFlashDeal(true);
        renderDailyFlashDeal();
        return showToast('Anh Khải đổi kèo vì nguyên liệu này chưa mở theo cốt truyện.', '🔒');
      }
      if (gameState.coins < deal.dealPrice) {
        return showToast(`Không đủ ${deal.dealPrice} Xu để chốt kèo!`, "❌");
      }

      gameState.coins -= deal.dealPrice;
      gameState.claimedDailyDeal = true;
      gameState.inventory[deal.itemKey] = (gameState.inventory[deal.itemKey] || 0) + deal.qty;
      if (gameState.dailyStats) gameState.dailyStats.wholesaleSpent = (gameState.dailyStats.wholesaleSpent || 0) + deal.dealPrice;
      addExp(20);

      playSound('level');
      showToast(`Anh Khải giao ${deal.qty} ${item.name}! Tiết kiệm ${Math.max(0, deal.normalPrice - deal.dealPrice)} Xu.`, item.icon);
      updateHeaderStats();
      renderDailyFlashDeal();
      renderMarketUI();
      saveGameToStorage();
    }

    let currentWarehouseCategory = 'all';
    function filterWarehouseCategory(cat) {
      currentWarehouseCategory = cat;
      renderWarehouseUI();
    }

    function renderWarehouseUI() {
      const grid = document.getElementById('warehouse-items-grid');
      const valText = document.getElementById('warehouse-valuation-text');
      if (!grid) return;
      ensureV6State();
      grid.innerHTML = '';

      if (currentWarehouseCategory === 'misc') {
        v8731RenderMiscWarehouse(grid, valText);
        return;
      }
      if (currentWarehouseCategory === 'souvenir') {
        grid.className = 'grid grid-cols-2 gap-1.5';
        grid.innerHTML = `<div class="col-span-2"><button onclick="openAuctionFromWarehouse()" class="w-full rounded-xl bg-violet-700 text-white py-2 font-black text-[10px] border border-violet-400 tap-scale">🔨 Mở Sàn Đấu Giá • Bán đồ dư / Săn lưu niệm</button></div>`;
        const entries = Object.entries(SOUVENIR_CONFIG);
        const owned = entries.filter(([id]) => (gameState.souvenirs[id] || 0) > 0);
        const rarityCounts = ['green','blue','purple','red','gold'].map(r => ({
          rarity:r,
          owned: entries.filter(([id,item]) => item.rarity === r && (gameState.souvenirs[id] || 0) > 0).length,
          total: entries.filter(([,item]) => item.rarity === r).length
        }));
        const totalValue=entries.reduce((sum,[id])=>sum+(Number(gameState.souvenirs[id])||0)*getSouvenirAuctionValue(id),0);
        if (valText) valText.innerText = `🏆 ${owned.length}/${entries.length} mẫu • 💎 ~${auctionFormatXu(totalValue)} Xu • ${rarityCounts.map(x => `${SOUVENIR_RARITY[x.rarity].icon}${x.owned}/${x.total}`).join(' ')}`;
        grid.className = 'grid grid-cols-2 gap-1.5';
        entries
          .sort((a,b) => ['green','blue','purple','red','gold'].indexOf(a[1].rarity) - ['green','blue','purple','red','gold'].indexOf(b[1].rarity))
          .forEach(([id, item]) => {
            const count = gameState.souvenirs[id] || 0;
            const meta = SOUVENIR_RARITY[item.rarity];
            const ownedClass = count > 0 ? '' : 'opacity-45 grayscale';
            grid.innerHTML += `
              <div class="p-2 rounded-2xl border shadow-sm ${ownedClass}" style="border-color:${meta.color};background:${meta.bg}">
                <div class="flex items-center gap-2">
                  <div class="w-10 h-10 rounded-xl bg-white/80 flex items-center justify-center text-2xl border" style="border-color:${meta.color}">${count > 0 ? item.icon : '❔'}</div>
                  <div class="flex-1 min-w-0">
                    <b class="text-[9px] text-slate-800 block leading-tight">${count > 0 ? item.name : 'Chưa khám phá'}</b>
                    <span class="text-[7px] font-black" style="color:${meta.color}">${meta.icon} ${meta.label}</span>
                    <span class="text-[7px] text-slate-500 block">${count > 0 ? `Sở hữu x${count}` : '???'}</span>
                  </div>
                </div>
                <p class="text-[7px] text-slate-500 mt-1 leading-relaxed">${count > 0 ? item.desc : 'Hãy khám phá, chơi minigame hoặc săn trên Sàn Đấu Giá để tìm món này.'}</p>
                <div class="text-[8px] font-black mt-1" style="color:${meta.color}">💎 Giá tham khảo: ~${auctionFormatXu(getSouvenirAuctionValue(id))} Xu</div>
                ${count > 0 && item.effect ? `<div class="mt-1 rounded-lg bg-white/70 px-1.5 py-1 text-[7px] font-black text-emerald-700 border border-emerald-200">✨ ${item.effect}</div>` : ''}
              </div>`;
          });
        return;
      }

      grid.className = 'grid grid-cols-3 gap-1.5';
      let totalItems = 0;
      let totalEstVal = 0;
      Object.keys(gameState.inventory).forEach(k => {
        const count = gameState.inventory[k] || 0;
        if (count <= 0) return;
        const item = ITEM_DICTIONARY[k] || { name: k, icon: '📦', cat: 'craft', basePrice: 5 };
        if (currentWarehouseCategory !== 'all' && item.cat !== currentWarehouseCategory) return;
        totalItems += count;
        totalEstVal += count * item.basePrice;
        grid.innerHTML += `
          <div class="p-2 bg-white rounded-2xl border border-slate-200 shadow-sm text-center">
            <span class="text-3xl mb-0.5 block">${item.icon}</span>
            <b class="text-[10px] text-slate-800 block truncate">${item.name}</b>
            <span class="text-xs font-black text-amber-600 block">${count}</span>
            <span class="text-[8px] text-slate-400">~${count * item.basePrice} Xu</span>
          </div>`;
      });
      if (valText) valText.innerText = `Tổng trữ lượng: ${totalItems} món • Ước tính: ${totalEstVal.toLocaleString()} Xu`;
    }

    function renderFarmAutomationPanel() {
      ensureV6State();
      const box = document.getElementById('farm-automation-panel');
      if (!box) return;
      const unlocked = gameState.level >= 12;
      const on = unlocked && gameState.automation.farmEnabled;
      box.innerHTML = `
        <div class="flex items-center justify-between gap-2">
          <div class="min-w-0">
            <div class="flex items-center gap-1.5"><span class="text-lg">🤖</span><b class="text-[10px] text-emerald-900">Trợ Lý Vườn</b></div>
            <p class="text-[8px] text-emerald-700">${unlocked ? 'Tự xử lý các việc đã mở khóa, không spam thông báo.' : 'Mở ở Lv.12 — đạt cấp là có thể bật.'}</p>
          </div>
          <button onclick="toggleFarmAutomation()" class="shrink-0 px-2.5 py-1 rounded-xl text-[9px] font-black tap-scale ${on ? 'bg-emerald-600 text-white' : unlocked ? 'bg-white text-emerald-700 border border-emerald-300' : 'bg-slate-200 text-slate-400'}">
            ${!unlocked ? '🔒 Lv.12' : on ? '🟢 ĐANG BẬT' : '⚪ BẬT AUTO'}
          </button>
        </div>
        <div class="grid grid-cols-3 gap-1 mt-2 text-[7px] font-bold">
          <div class="rounded-lg p-1.5 ${gameState.level >= 12 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-400'}">💧 Lv.12<br>Tự tưới</div>
          <div class="rounded-lg p-1.5 ${gameState.level >= 20 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-400'}">🧺 Lv.20<br>Tự thu hoạch</div>
          <div class="rounded-lg p-1.5 ${gameState.level >= 28 ? 'bg-lime-100 text-lime-800' : 'bg-slate-100 text-slate-400'}">🌱 Lv.28<br>Tự gieo lại</div>
        </div>
        <div class="mt-1.5 text-[7px] text-slate-500 font-bold">${formatFarmBarnBonus('farm')}</div>`;
    }

    function toggleFarmAutomation() {
      ensureV6State();
      if (gameState.level < 12) return showToast('Trợ Lý Vườn mở khóa ở Lv.12!', '🔒');
      gameState.automation.farmEnabled = !gameState.automation.farmEnabled;
      showToast(gameState.automation.farmEnabled ? 'Đã bật Trợ Lý Vườn.' : 'Đã tắt Trợ Lý Vườn.', '🤖');
      renderFarmUI();
      saveGameToStorage();
    }

    function autoHarvestPlot(plotIdx) {
      const plot = gameState.farmPlots[plotIdx];
      if (!plot || !plot.seed || plot.mortgaged) return false;
      const cropKey = plot.seed;
      const cropCfg = FARM_SEEDS_CONFIG[cropKey];
      if (!cropCfg || plot.growTimer < cropCfg.growTime) return false;
      const bonus = getFarmBarnSouvenirBonuses();
      const eventBonus = getFarmEventBonuses();
      const qty = 3 + bonus.farmYield + eventBonus.yield;
      gameState.inventory[cropCfg.cropKey] = (gameState.inventory[cropCfg.cropKey] || 0) + qty;
      plot.lastSeed = cropKey;
      plot.seed = null;
      plot.growTimer = 0;
      plot.watered = false;
      addExp(6);
      return true;
    }

    function autoReplantPlot(plotIdx) {
      const plot = gameState.farmPlots[plotIdx];
      if (!plot || !plot.unlocked || plot.mortgaged || plot.seed || !plot.lastSeed) return false;
      const cropKey = plot.lastSeed;
      if (!FARM_SEEDS_CONFIG[cropKey]) return false;
      if (!tryConsumeFarmSeed(cropKey, true)) return false;
      plot.seed = cropKey;
      plot.growTimer = 0;
      plot.watered = false;
      return true;
    }

    function renderBarnAutomationPanel() {
      ensureV6State();
      const box = document.getElementById('barn-automation-panel');
      if (!box) return;
      const unlocked = gameState.level >= 14;
      const on = unlocked && gameState.automation.barnEnabled;
      box.innerHTML = `
        <div class="flex items-center justify-between gap-2">
          <div class="min-w-0">
            <div class="flex items-center gap-1.5"><span class="text-lg">🦾</span><b class="text-[10px] text-amber-900">Trợ Lý Chuồng</b></div>
            <p class="text-[8px] text-amber-700">${unlocked ? 'Tự chăm đàn vật nuôi bằng nguồn thức ăn trong kho.' : 'Mở ở Lv.14 — đạt cấp là có thể bật.'}</p>
          </div>
          <button onclick="toggleBarnAutomation()" class="shrink-0 px-2.5 py-1 rounded-xl text-[9px] font-black tap-scale ${on ? 'bg-amber-600 text-white' : unlocked ? 'bg-white text-amber-700 border border-amber-300' : 'bg-slate-200 text-slate-400'}">
            ${!unlocked ? '🔒 Lv.14' : on ? '🟢 ĐANG BẬT' : '⚪ BẬT AUTO'}
          </button>
        </div>
        <div class="grid grid-cols-2 gap-1 mt-2 text-[7px] font-bold">
          <div class="rounded-lg p-1.5 ${gameState.level >= 14 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-400'}">🌾 Lv.14 • Tự chăm/cho ăn 1 lần mỗi chu kỳ</div>
          <div class="rounded-lg p-1.5 ${gameState.level >= 22 ? 'bg-orange-100 text-orange-800' : 'bg-slate-100 text-slate-400'}">🥛 Lv.22 • Tự thu sản phẩm khi sẵn sàng</div>
        </div>
        <div class="mt-1.5 text-[7px] text-slate-500 font-bold">${formatFarmBarnBonus('barn')}</div>`;
    }

    function toggleBarnAutomation() {
      ensureV6State();
      if (gameState.level < 14) return showToast('Trợ Lý Chuồng mở khóa ở Lv.14!', '🔒');
      gameState.automation.barnEnabled = !gameState.automation.barnEnabled;
      showToast(gameState.automation.barnEnabled ? 'Đã bật Trợ Lý Chuồng.' : 'Đã tắt Trợ Lý Chuồng.', '🦾');
      renderBarnUI();
      saveGameToStorage();
    }

    function autoCareBarnAnimal(animalKey) {
      const cfg = BARN_ANIMALS_CONFIG[animalKey];
      const anim = gameState.animals[animalKey];
      if (!cfg || !anim || !anim.unlocked || anim.ready || anim.autoFed) return false;
      if (cfg.feedCostItem && !tryConsumeBarnFeed(cfg.feedCostItem, true)) return false;
      anim.timer += 4;
      anim.autoFed = true;
      anim.affection = Math.min(100, (Number(anim.affection) || 10) + 1);
      return true;
    }

    function autoCollectBarnProduct(animalKey) {
      const cfg = BARN_ANIMALS_CONFIG[animalKey];
      const anim = gameState.animals[animalKey];
      if (!cfg || !anim || !anim.unlocked || !anim.ready) return false;
      const bonus = getFarmBarnSouvenirBonuses();
      const eventBonus = getBarnEventBonuses();
      const affectionBonus = getAnimalAffectionYield(anim);
      const qty = 2 + bonus.barnYield + eventBonus.yield + affectionBonus;
      gameState.inventory[cfg.productKey] = (gameState.inventory[cfg.productKey] || 0) + qty;
      anim.ready = false;
      anim.timer = 0;
      anim.autoFed = false;
      addExp(8);
      return true;
    }

    function renderFarmUI() {
      renderFarmAutomationPanel();
      renderFarmEventPanel();
      const plotsGrid = document.getElementById('farm-plots-grid');
      if (plotsGrid) {
        plotsGrid.innerHTML = '';
        gameState.farmPlots.forEach((plot, idx) => {
          const cfg = FARM_PLOTS_CONFIG[idx];
          if (plot.mortgaged) {
            plotsGrid.innerHTML += `
              <div class="plot-card-pro plot-card-locked h-24 border-2 border-rose-400 rounded-2xl p-2 flex flex-col items-center justify-center text-center"><div class="plot-fence"></div>
                <span class="text-2xl mb-0.5">📜🔒</span>
                <b class="text-[10px] text-rose-800">${cfg.name}</b>
                <span class="text-[8px] text-rose-600 font-bold mb-1">Đang Thế Chấp</span>
                <button onclick="redeemPlotDeed()" class="px-2 py-0.5 bg-rose-600 hover:bg-rose-700 text-white font-black text-[8px] rounded-lg shadow tap-scale">
                  Chuộc (1.800 Xu)
                </button>
              </div>
            `;
          } else if (!plot.unlocked) {
            plotsGrid.innerHTML += `
              <div class="plot-card-pro plot-card-locked h-24 border-2 border-dashed border-amber-300 rounded-2xl p-2 flex flex-col items-center justify-center text-center"><div class="plot-fence"></div>
                <span class="text-xl mb-0.5">🔒</span>
                <b class="text-[10px] text-slate-700">${cfg.name}</b>
                <span class="text-[8px] text-slate-500 mb-1">Cần Lv.${cfg.unlockLv}</span>
                <button onclick="unlockFarmPlot(${idx})" class="px-2 py-0.5 bg-amber-500 hover:bg-amber-600 text-white font-black text-[8px] rounded-lg shadow tap-scale">
                  Mở (${cfg.cost} Xu)
                </button>
              </div>
            `;
          } else if (!plot.seed) {
            plotsGrid.innerHTML += `
              <div onclick="openPlantSelectModal(${idx})" class="plot-card-pro plot-card-empty h-24 border-2 border-dashed border-emerald-400 rounded-2xl p-2 flex flex-col items-center justify-center text-center cursor-pointer tap-scale"><div class="plot-fence"></div>
                <span class="text-3xl mb-0.5">🌱</span>
                <b class="text-[10px] text-emerald-800">${cfg.name}</b>
                <span class="text-[8px] text-emerald-600 font-bold">Chạm Gieo Hạt</span>
              </div>
            `;
          } else {
            const cropCfg = FARM_SEEDS_CONFIG[plot.seed];
            const isReady = plot.growTimer >= cropCfg.growTime;
            const pct = Math.min(100, Math.floor((plot.growTimer / cropCfg.growTime) * 100));

            plotsGrid.innerHTML += `
              <div class="plot-card-pro plot-card-growing h-24 border-2 ${isReady ? 'border-amber-400 bg-amber-50' : 'border-emerald-300 bg-white'} rounded-2xl p-1.5 flex flex-col justify-between"><div class="plot-fence"></div><div class="plot-ground"></div>
                <div class="flex items-center justify-between">
                  <span class="text-[10px] font-bold text-slate-700 truncate">${cropCfg.name}</span>
                  <span class="text-2xl">${cropCfg.icon}</span>
                </div>
                
                <div class="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div class="bg-emerald-500 h-full" style="width: ${pct}%"></div>
                </div>

                <div>
                  ${isReady ? `
                    <button onclick="harvestPlot(${idx})" class="w-full py-0.5 bg-amber-500 hover:bg-amber-600 text-white font-black text-[8px] rounded-lg shadow tap-scale">
                      Thu Hoạch (+EXP)
                    </button>
                  ` : `
                    <button onclick="waterPlot(${idx})" class="w-full py-0.5 ${plot.watered ? 'bg-slate-200 text-slate-500' : 'bg-blue-500 hover:bg-blue-600 text-white'} font-bold text-[8px] rounded-lg tap-scale">
                      ${plot.watered ? 'Đã Tưới 💧' : 'Tưới Nước'}
                    </button>
                  `}
                </div>
              </div>
            `;
          }
        });
      }

      const storeGrid = document.getElementById('farm-seed-store-grid');
      if (storeGrid) {
        storeGrid.innerHTML = '';
        Object.keys(FARM_SEEDS_CONFIG).forEach(k => {
          const cfg = FARM_SEEDS_CONFIG[k];
          const canBuy = gameState.level >= cfg.unlockLv;
          const mySeedCount = gameState.inventory[cfg.seedKey] || 0;

          storeGrid.innerHTML += `
            <div class="p-1.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
              <div class="flex items-center gap-1.5">
                <span class="text-2xl">${cfg.icon}</span>
                <div>
                  <b class="text-slate-800 text-[10px] block">${cfg.name}</b>
                  <span class="text-[8px] text-slate-500">Giá: ${v8741FarmSeedPrice(cfg)} • Có: ${mySeedCount}${v8741Bonuses().seedDiscount?' • 🎁 Ưu đãi Cô Sáu':''}</span>
                </div>
              </div>
              ${canBuy ? `
                <button onclick="buyFarmSeed('${k}')" class="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[8px] rounded-lg tap-scale">
                  Mua
                </button>
              ` : `
                <span class="text-[8px] text-slate-400 font-bold">Lv.${cfg.unlockLv}</span>
              `}
            </div>
          `;
        });
      }
    }

    function unlockFarmPlot(idx) {
      const cfg = FARM_PLOTS_CONFIG[idx];
      if (gameState.level < cfg.unlockLv) {
        return showToast(`Cần Cấp Độ ${cfg.unlockLv} để mở thửa đất này!`, "🔒");
      }
      if (gameState.coins < cfg.cost) {
        return showToast(`Cần ${cfg.cost} Xu để mở thửa đất!`, "❌");
      }

      gameState.coins -= cfg.cost;
      gameState.farmPlots[idx].unlocked = true;
      playSound('coin');
      showToast(`Đã mở thành công ${cfg.name}!`, "🌾");
      updateHeaderStats();
      renderFarmUI();
      saveGameToStorage();
    }

    function buyFarmSeed(cropKey) {
      const cfg = FARM_SEEDS_CONFIG[cropKey];
      const seedPrice=v8741FarmSeedPrice(cfg);
      if (gameState.coins < seedPrice) return showToast("Không đủ Xu mua hạt giống!", "❌");

      gameState.coins -= seedPrice;
      gameState.inventory[cfg.seedKey] = (gameState.inventory[cfg.seedKey] || 0) + 1;
      playSound('coin');
      showToast(`Đã mua 1 Túi ${cfg.name}!`, cfg.icon);
      updateHeaderStats();
      renderFarmUI();
      saveGameToStorage();
    }

    function openPlantSelectModal(plotIdx) {
      const availableCrops = Object.keys(FARM_SEEDS_CONFIG).filter(k => {
        const sKey = FARM_SEEDS_CONFIG[k].seedKey;
        return (gameState.inventory[sKey] || 0) > 0;
      });

      if (availableCrops.length === 0) {
        return showToast("Bạn chưa có hạt giống nào! Hãy mua ở dưới!", "⚠️");
      }

      const pick = availableCrops[0];
      const cfg = FARM_SEEDS_CONFIG[pick];
      if (!tryConsumeFarmSeed(pick, false)) return showToast("Hạt giống vừa hết khỏi kho!", "⚠️");
      gameState.farmPlots[plotIdx].seed = pick;
      gameState.farmPlots[plotIdx].lastSeed = pick;
      gameState.farmPlots[plotIdx].growTimer = 0;
      gameState.farmPlots[plotIdx].watered = false;

      playSound('serve');
      showToast(`Đã gieo ${cfg.name}!`, cfg.icon);
      renderFarmUI();
      saveGameToStorage();
    }

    function waterPlot(plotIdx) {
      const plot = gameState.farmPlots[plotIdx];
      if (plot.watered) return;
      plot.watered = true;
      plot.growTimer += 3;
      playSound('click');
      showToast("Đã tưới nước mát!", "💧");
      renderFarmUI();
      saveGameToStorage();
    }

    function harvestPlot(plotIdx) {
      const plot = gameState.farmPlots[plotIdx];
      if (!plot || !plot.seed) return;
      const cropKey = plot.seed;
      const cropCfg = FARM_SEEDS_CONFIG[cropKey];
      const cropItemKey = cropCfg.cropKey;
      const bonus = getFarmBarnSouvenirBonuses();
      const eventBonus = getFarmEventBonuses();
      const qty = 3 + bonus.farmYield + eventBonus.yield;

      gameState.inventory[cropItemKey] = (gameState.inventory[cropItemKey] || 0) + qty;
      addExp(18);
      playSound('coin');
      showToast(`Thu hoạch +${qty} ${cropCfg.name}!`, cropCfg.icon);

      plot.lastSeed = cropKey;
      plot.seed = null;
      plot.growTimer = 0;
      plot.watered = false;
      renderFarmUI();
      saveGameToStorage();
    }

    function getAnimalAffectionLabel(value) {
      const v = Math.max(0, Math.min(100, Number(value) || 0));
      if (v >= 90) return 'Quấn chủ';
      if (v >= 70) return 'Rất thân';
      if (v >= 45) return 'Thân thiện';
      if (v >= 20) return 'Đang quen';
      return 'Nhút nhát';
    }

    function getAnimalAffectionSpeed(anim) {
      return Math.min(.15, Math.max(0, Number(anim && anim.affection) || 0) * .0015);
    }

    function getAnimalAffectionYield(anim) {
      const a = Math.max(0, Number(anim && anim.affection) || 0);
      return a >= 75 ? 1 : 0;
    }

    function renderBarnUI() {
      renderBarnAutomationPanel();
      renderBarnEventPanel();
      const list = document.getElementById('barn-animals-list');
      if (!list) return;

      list.innerHTML = '';
      Object.keys(BARN_ANIMALS_CONFIG).forEach(k => {
        const cfg = BARN_ANIMALS_CONFIG[k];
        const stateAnim = gameState.animals[k] || { unlocked: false, name: cfg.defaultName, timer: 0, ready: false, affection:10, careCooldown:0, autoFed:false };
        const isUnlocked = stateAnim.unlocked;

        if (!isUnlocked) {
          const canUnlock = gameState.level >= cfg.unlockLv;
          list.innerHTML += `
            <div class="animal-card-pro overflow-hidden rounded-2xl border-2 border-amber-300 bg-gradient-to-b from-amber-100 to-lime-50 shadow-sm">
              <div class="px-2 py-1 bg-amber-800 text-amber-100 text-[8px] tracking-[3px]">🪵 ┃ 🌾 ┃ 🪵 ┃ 🌿 ┃ 🪵</div>
              <div class="p-2.5 flex items-center justify-between gap-2">
                <div class="flex items-center gap-2"><span class="text-4xl opacity-70">${cfg.icon}</span><div><b class="text-xs text-slate-800 block">${cfg.defaultName}</b><span class="text-[9px] text-slate-500 font-bold">🔒 Lv.${cfg.unlockLv} • Xây: ${cfg.cost} Xu</span></div></div>
                ${canUnlock ? `<button onclick="unlockBarnAnimal('${k}')" class="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white font-black text-[9px] rounded-xl shadow tap-scale">Xây Ô Nuôi</button>` : `<span class="text-[8px] text-slate-400 font-bold">Chưa đủ cấp</span>`}
              </div>
            </div>`;
          return;
        }

        const isReady = stateAnim.ready;
        const pct = Math.min(100, Math.floor((stateAnim.timer / cfg.cycleTime) * 100));
        const affection = Math.max(0, Math.min(100, Number(stateAnim.affection) || 0));
        const affectionLabel = getAnimalAffectionLabel(affection);
        const fed = !!stateAnim.autoFed;
        const canCare = (Number(stateAnim.careCooldown) || 0) <= 0;
        const feedText = cfg.feedCostItem ? (fed ? '🍚 Đã Ăn' : '🍚 Cho Ăn') : (fed ? '🌼 Đã Có Hoa' : '🌼 Bổ Sung Hoa');

        list.innerHTML += `
          <div class="animal-card-pro overflow-hidden rounded-2xl border-2 ${isReady ? 'border-amber-400' : 'border-orange-200'} bg-gradient-to-b from-amber-50 via-orange-50 to-lime-50 shadow-sm">
            <div class="px-2 py-1 bg-gradient-to-r from-amber-900 to-amber-700 text-amber-100 flex items-center justify-between">
              <span class="text-[8px] tracking-[2px]">🪵🌾🪵🌿🪵</span><span class="text-[8px] font-black">${isReady ? `✨ ${cfg.productName} đã sẵn sàng` : '🏡 Ô chuồng đang hoạt động'}</span>
            </div>
            <div class="p-2.5 space-y-2">
              <div class="flex items-center gap-2">
                <div class="w-16 h-14 rounded-2xl bg-lime-100 border border-lime-200 flex items-center justify-center text-4xl shrink-0 relative"><span>${cfg.icon}</span><span class="absolute -bottom-1 text-xs">🌿🌾</span></div>
                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-1"><b class="text-xs text-slate-800 truncate">${stateAnim.name}</b><button onclick="openRenameModal('animal_${k}')" class="text-[9px] text-slate-400 hover:text-slate-600 font-bold">✏️</button></div>
                  <div class="text-[8px] text-slate-500">${cfg.productIcon} ${cfg.productName} • ${fed ? 'No bụng' : (cfg.feedCostItem ? 'Chưa ăn' : 'Chờ chăm')}</div>
                  <div class="flex items-center justify-between mt-1"><span class="text-[8px] font-black text-rose-600">❤️ ${affection}/100 • ${affectionLabel}</span><span class="text-[7px] text-slate-400">+${Math.round(getAnimalAffectionSpeed(stateAnim)*100)}% tốc độ${getAnimalAffectionYield(stateAnim) ? ' • +1 sản lượng' : ''}</span></div>
                  <div class="w-full h-1.5 bg-rose-100 rounded-full overflow-hidden"><div class="h-full bg-rose-400" style="width:${affection}%"></div></div>
                </div>
              </div>

              <div>
                <div class="flex justify-between text-[8px] font-bold text-slate-500 mb-0.5"><span>${isReady ? 'Sẵn sàng thu hoạch' : 'Tiến độ sản phẩm'}</span><span>${pct}%</span></div>
                <div class="w-full bg-white h-2 rounded-full overflow-hidden border border-amber-100"><div class="bg-amber-500 h-full transition-all" style="width:${pct}%"></div></div>
              </div>

              <div class="grid grid-cols-2 gap-1.5">
                ${isReady ? `<button onclick="collectBarnProduct('${k}')" class="py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-black text-[9px] rounded-xl shadow tap-scale">${cfg.productIcon} Thu Hoạch</button>` : `<button onclick="feedBarnAnimal('${k}')" ${fed ? 'disabled' : ''} class="py-1.5 ${fed ? 'bg-slate-200 text-slate-400' : 'bg-emerald-600 hover:bg-emerald-700 text-white'} font-black text-[9px] rounded-xl tap-scale">${feedText}</button>`}
                <button onclick="careBarnAnimal('${k}')" ${canCare ? '' : 'disabled'} class="py-1.5 ${canCare ? 'bg-rose-500 hover:bg-rose-600 text-white' : 'bg-slate-200 text-slate-400'} font-black text-[9px] rounded-xl tap-scale">${canCare ? '🫶 Chăm Sóc' : `❤️ Chờ ${Math.ceil(stateAnim.careCooldown)}s`}</button>
              </div>
              <div class="text-[7px] text-center text-amber-800 font-bold">Cho ăn giúp chu kỳ chạy nhanh hơn • chăm sóc tăng tình cảm lâu dài</div>
            </div>
          </div>`;
      });
    }

    function unlockBarnAnimal(animalKey) {
      const cfg = BARN_ANIMALS_CONFIG[animalKey];
      if (gameState.coins < cfg.cost) return showToast("Không đủ Xu để xây chuồng!", "❌");

      gameState.coins -= cfg.cost;
      if (!gameState.animals[animalKey]) {
        gameState.animals[animalKey] = { unlocked: true, name: cfg.defaultName, timer: 0, ready: false, affection: 10, careCooldown: 0, autoFed: false };
      } else {
        gameState.animals[animalKey].unlocked = true;
        gameState.animals[animalKey].affection = Math.max(10, Number(gameState.animals[animalKey].affection) || 10);
        gameState.animals[animalKey].careCooldown = 0;
        gameState.animals[animalKey].autoFed = false;
      }

      playSound('coin');
      showToast(`Đã xây xong chuồng ${cfg.defaultName}!`, cfg.icon);
      updateHeaderStats();
      renderBarnUI();
      saveGameToStorage();
    }

    function feedBarnAnimal(animalKey) {
      const cfg = BARN_ANIMALS_CONFIG[animalKey];
      const anim = gameState.animals[animalKey];
      if (!cfg || !anim || !anim.unlocked) return;
      if (anim.ready) return showToast('Thu hoạch sản phẩm trước rồi hãy bắt đầu chu kỳ mới!', cfg.icon);
      if (anim.autoFed) return showToast(`${anim.name} đã được cho ăn/chăm nguồn thức ăn trong chu kỳ này rồi!`, '🍚');

      if (cfg.feedCostItem) {
        const feedCount = gameState.inventory[cfg.feedCostItem] || 0;
        if (feedCount <= 0) {
          const itemName = (ITEM_DICTIONARY[cfg.feedCostItem] && ITEM_DICTIONARY[cfg.feedCostItem].name) || 'Lúa Mì';
          return showToast(`Kho hết ${itemName} rồi! Hãy trồng ở Vườn!`, '⚠️');
        }
        if (!tryConsumeBarnFeed(cfg.feedCostItem, false)) return;
      }

      anim.timer += cfg.feedCostItem ? 4 : 3;
      anim.autoFed = true;
      anim.affection = Math.min(100, (Number(anim.affection) || 10) + (cfg.feedCostItem ? 3 : 2));
      playSound('serve');
      showToast(cfg.feedCostItem ? `Đã cho ${anim.name} ăn no! ❤️ +3` : `Đã bổ sung hoa quanh ${anim.name}! ❤️ +2`, cfg.icon);
      renderBarnUI();
      renderWarehouseUI();
      saveGameToStorage();
    }

    function careBarnAnimal(animalKey) {
      const cfg = BARN_ANIMALS_CONFIG[animalKey];
      const anim = gameState.animals[animalKey];
      if (!cfg || !anim || !anim.unlocked) return;
      if ((Number(anim.careCooldown) || 0) > 0) return showToast(`Chờ ${Math.ceil(anim.careCooldown)} giây rồi chăm tiếp nhé!`, '❤️');
      const before = Number(anim.affection) || 10;
      const utilityBonus = getUtilityBonuses();
      anim.affection = Math.min(100, before + 6 + (Number(utilityBonus.careAffectionBonus) || 0));
      anim.careCooldown = 8;
      if (!anim.ready) anim.timer = Math.min(cfg.cycleTime, (Number(anim.timer) || 0) + 1.5);
      playSound('click');
      showToast(`${anim.name} vui hơn! ❤️ ${Math.round(anim.affection)}/100`, '🫶');
      renderBarnUI();
      saveGameToStorage();
    }

    function collectBarnProduct(animalKey) {
      const cfg = BARN_ANIMALS_CONFIG[animalKey];
      const anim = gameState.animals[animalKey];
      if (!anim.ready) return;

      const bonus = getFarmBarnSouvenirBonuses();
      const eventBonus = getBarnEventBonuses();
      const affectionBonus = getAnimalAffectionYield(anim);
      const qty = 2 + bonus.barnYield + eventBonus.yield + affectionBonus;
      gameState.inventory[cfg.productKey] = (gameState.inventory[cfg.productKey] || 0) + qty;
      anim.ready = false;
      anim.timer = 0;
      anim.autoFed = false;
      addExp(22);
      playSound('coin');
      showToast(`Đã thu hoạch +${qty} ${cfg.productName}!`, cfg.productIcon);
      renderBarnUI();
      saveGameToStorage();
    }

    // V87.1: independent shift and day lifecycle
    let v87PendingShipments = 0;
    let v87ChangingDay = false;

    function v87DayCharges() {
      const opCosts = Math.max(0, Math.round(25 + gameState.level * 4 + getGrowthBonuses().opCost + getDailyEventBonuses().opCost));
      const interestCost = Math.max(0, Math.floor((Number(gameState.debt) || 0) * .05));
      return {opCosts, interestCost};
    }
    function v87DailyRevenue() {
      const s = gameState.dailyStats || {};
      return (Number(s.counterRev)||0) + (Number(s.deliveryRev)||0) + (Number(s.tipsRev)||0);
    }
    function toggleOpenShop() {
      if (gameState.phase === 'open') return openDailyReportModal();
      if (gameState.shiftClosed || gameState.phase === 'closed') {
        showToast('Đã đóng ca hôm nay. Bấm 🌙 Qua ngày để mở ca mới!', '🌙');
        return;
      }
      gameState.phase = 'open';
      playSound('serve');
      showToast('Quán đã mở cửa! Khi đóng ca, bạn vẫn có thể đi khám phá.', '🏪');
      updateShopPhaseUI();
      renderCustomerBooth();
      saveGameToStorage(false);
      clearTimeout(window._nextCustomerTimeout);
      window._nextCustomerTimeout = setTimeout(() => {
        if (gameState.phase === 'open' && !phonePauseActive) spawnNextCustomer();
      }, 1200);
    }

    function updateShopPhaseUI() {
      const dot = document.getElementById('shop-status-dot');
      const pText = document.getElementById('shop-phase-text');
      const sDesc = document.getElementById('shop-daily-served-text');
      const btn = document.getElementById('btn-toggle-shop');
      const moon = document.getElementById('v87-day-button');
      if (moon) moon.title = `Kết thúc ngày ${gameState.day}; ${gameState.phase === 'open' ? 'đóng ca trước' : 'có thể qua ngày'}`;
      if (gameState.phase === 'open') {
        if (dot) dot.className = 'w-3 h-3 rounded-full bg-emerald-500 animate-ping';
        if (pText) pText.innerText = 'Đang Trong Ca Mở Bán 🟢';
        if (sDesc) sDesc.innerText = `Hôm nay: ${gameState.dailyStats.counterServed || 0} khách • ${gameState.dailyStats.deliveryServed || 0} đơn ship`;
        if (btn) {
          btn.innerText = '🔴 Đóng Ca';
          btn.disabled = false;
          btn.className = 'px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl shadow tap-scale';
        }
      } else if (gameState.shiftClosed || gameState.phase === 'closed') {
        if (dot) dot.className = 'w-3 h-3 rounded-full bg-amber-500';
        if (pText) pText.innerText = 'Đã Đóng Ca Hôm Nay 🌙';
        if (sDesc) sDesc.innerText = 'Đi Làng, Vườn, Chuồng tùy thích • Qua ngày để mở ca mới';
        if (btn) {
          btn.innerText = '🌙 Qua Ngày';
          btn.disabled = false;
          btn.className = 'px-3 py-1.5 bg-indigo-700 hover:bg-indigo-600 text-white font-black text-xs rounded-xl shadow tap-scale';
          btn.onclick = openEndDayModal;
        }
      } else {
        if (dot) dot.className = 'w-3 h-3 rounded-full bg-slate-400';
        if (pText) pText.innerText = 'Ca Sáng Chuẩn Bị 💤';
        if (sDesc) sDesc.innerText = 'Có thể mở quán hoặc nghỉ bán và khám phá cả ngày';
        if (btn) {
          btn.innerText = '🟢 Mở Quán';
          btn.disabled = false;
          btn.className = 'px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow tap-scale';
        }
      }
      // Restore the original onclick on other days after closed state.
      if (btn && !(gameState.shiftClosed || gameState.phase === 'closed')) btn.onclick = toggleOpenShop;
    }

    function closeDailyReportModal() {
      document.getElementById('modal-daily-report')?.classList.add('hidden');
    }
    function openDailyReportModal() {
      if (gameState.phase !== 'open') return;
      const st = gameState.dailyStats || {};
      const {opCosts,interestCost} = v87DayCharges();
      const rev = v87DailyRevenue();
      const ratingList = Array.isArray(st.ratings) ? st.ratings : [];
      const avg = ratingList.length ? ratingList.reduce((a,b)=>a+Number(b||0),0)/ratingList.length : 5;
      const set = (id,value) => { const e=document.getElementById(id); if(e) e.textContent=value; };
      const pendingWarning = document.getElementById('v87-cancel-orders-warning');
      if (pendingWarning) {
        pendingWarning.classList.toggle('hidden', activeOnlineOrders.length === 0);
        pendingWarning.textContent = activeOnlineOrders.length > 0
          ? `⚠️ Còn ${activeOnlineOrders.length} yêu cầu ship chưa nhận. Đóng ca sẽ huỷ những yêu cầu này.` : '';
      }
      set('report-title-day', `Tổng kết ca ngày ${gameState.day}`);
      set('report-counter-served', st.counterServed || 0);
      set('report-delivery-served', st.deliveryServed || 0);
      set('report-rating-avg', `⭐ ${avg.toFixed(1)}`);
      set('report-rev-total', `+${rev.toLocaleString('vi-VN')} Xu`);
      set('report-op-costs', `-${opCosts.toLocaleString('vi-VN')} Xu`);
      set('report-interest-cost', `-${interestCost.toLocaleString('vi-VN')} Xu`);
      const net=rev-opCosts-interestCost;
      const netNode=document.getElementById('report-net-profit');
      if(netNode) { netNode.textContent=`${net>=0?'+':''}${net.toLocaleString('vi-VN')} Xu`; netNode.className=net>=0?'v87-plus':'v87-minus'; }
      document.getElementById('modal-daily-report')?.classList.remove('hidden');
      playSound('click');
    }

    function confirmCloseShopShift() {
      if (gameState.phase !== 'open' || v87ChangingDay) return;
      closeDailyReportModal();
      clearTimeout(window._nextCustomerTimeout);
      clearInterval(customerPatienceTimer);
      currentCustomer = null;
      // Undelivered/unaccepted phone requests are cancelled upon closing.
      activeOnlineOrders = [];
      gameState.phase = 'closed';
      gameState.shiftClosed = true;
      phonePauseActive = false;
      updateShopPhaseUI();
      renderCustomerBooth();
      if(typeof renderDeliveryApp==='function') renderDeliveryApp();
      saveGameToStorage(false);
      playSound('serve');
      showToast('Đã đóng ca! Bạn vẫn đi Làng, Vườn và Chuồng được. 🌿', '🏪');
    }

    function closeEndDayModal() {
      document.getElementById('modal-v87-end-day')?.classList.add('hidden');
    }
    function openEndDayModal() {
      if (!sessionGameActive || !activeProfileId || !gameState.hasStarted) {
        return showToast('Hãy bắt đầu game trước nhé!', '🌙');
      }
      if (gameState.phase === 'open') {
        showToast('Quán còn mở! Hãy đóng ca trước khi qua ngày.', '🏪');
        switchTab('shop');
        return;
      }
      if (v87PendingShipments > 0) {
        showToast(`Còn ${v87PendingShipments} đơn ship đang giao. Chờ hoàn tất trước khi qua ngày!`, '🛵');
        return;
      }
      if (v87ChangingDay) return;
      const {opCosts, interestCost} = v87DayCharges();
      const st = gameState.dailyStats || {};
      const set = (id, value) => { const e=document.getElementById(id); if(e) e.textContent=value; };
      set('v87-end-title', `Khép lại ngày ${gameState.day}?`);
      set('v87-end-desc', gameState.shiftClosed ? 'Ca kinh doanh đã hoàn tất. Bạn có thể ở lại khám phá thêm.' : 'Hôm nay chưa mở quán. Bạn vẫn có thể nghỉ bán và sang ngày mới.');
      set('v87-end-revenue', `${v87DailyRevenue().toLocaleString('vi-VN')} Xu`);
      set('v87-end-served', `${Number(st.counterServed||0)+Number(st.deliveryServed||0)} lượt`);
      set('v87-end-trips', `${Number(gameState.villageTripsToday)||0} lượt`);
      set('v87-end-shift', gameState.shiftClosed ? 'Đã đóng ca' : 'Nghỉ bán');
      set('v87-end-cost', `-${opCosts.toLocaleString('vi-VN')} Xu`);
      set('v87-end-interest', `-${interestCost.toLocaleString('vi-VN')} Xu`);
      set('v87-end-remaining', `${Math.max(0,Number(gameState.coins||0)-opCosts-interestCost).toLocaleString('vi-VN')} Xu`);
      v872EnsureState();
      const pendingCount=Object.values(gameState.v872Npcs).filter(n=>n.pending).length;
      set('v87-end-warning', `🌙 Nghỉ qua đêm: năng lượng khám phá Làng hồi đầy 100/100. Sự kiện và NPC sẽ đổi vào ngày mới.${pendingCount?` 🧠 ${pendingCount} chuyện NPC còn dang dở sẽ được giữ lại tới ngày sau.`:''}${v87531Ensure().arrears?` 💵 Còn ${gameState.staffHR.arrears} Xu nợ lương cũ.`:''}`);
      const shortage=Math.max(0,opCosts+interestCost-Number(gameState.coins||0));
      if(shortage>0&&v87531Due()>0){
        const w=document.getElementById('v87-end-warning');
        if(w)w.textContent+=` ⚠️ Có thể còn thiếu ${Math.min(shortage,v87531Due())} Xu tiền lương, sẽ ghi vào nợ lương để trả sau.`;
      }
      document.getElementById('modal-v87-end-day')?.classList.remove('hidden');
      playSound('click');
    }

    function confirmAdvanceToNextDay() {
      // The calendar can only advance from the separate explicit night dialog.
      const dlg = document.getElementById('modal-v87-end-day');
      if (!dlg || dlg.classList.contains('hidden') || v87ChangingDay) return;
      if (gameState.phase === 'open' || v87PendingShipments > 0) return;
      v87ChangingDay = true;
      const btn=document.getElementById('v87-confirm-end-day');
      if(btn) btn.disabled=true;
      try {
        const {opCosts,interestCost} = v87DayCharges();
        v87532DayClose();
        v87531DayClose();
        v87531SettleDay(gameState.coins,opCosts,interestCost);
        gameState.coins = Math.max(0, gameState.coins - opCosts - interestCost);
        if (gameState.debt > 0) gameState.debt += interestCost;
        closeEndDayModal();
        closeDailyReportModal();
        clearTimeout(window._nextCustomerTimeout);
        clearInterval(customerPatienceTimer);
        phonePauseActive=false;
        currentCustomer=null;
        activeOnlineOrders=[];
        gameState.day += 1;
        v87531Morning();
        v87532Morning();
        v872DayChanged();
        advanceAuctionHouseDay();
        gameState.phase = 'prep';
        gameState.shiftClosed = false;
        // V87.2.1: a confirmed night of rest restores village energy to full.
        // Reset the real-time regeneration anchor so reloading never grants stale ticks.
        gameState.villageEnergy = 100;
        gameState.villageEnergyLastRegen = Date.now();
        gameState.villageEnergyDay = gameState.day;
        gameState.villageTripsToday = 0;
        gameState.villageEncounterId = null;
        gameState.claimedDailyDeal = false;
        gameState.marketNewsIndex = Math.floor(Math.random() * MARKET_NEWS_DATABASE.length);
        gameState.lastMarketNewsNotice = null;
        gameState.dailyDeal = null;
        gameState.soppiFlashSale = null;
        generateDailyFlashDeal(true);
        generateSoppiFlashSale(true);
        rollDailyWorldEvent(true);
        announceDailyMarketNews(true);
        gameState.dailyVillageVisitors = { day: gameState.day, ids:[], completedIds:[], rolled:false };
        rollDailyVillageVisitors(true);
        resetVillageNpcState(true);
        gameState.dailyStats = {
          counterServed:0, deliveryServed:0, counterRev:0, deliveryRev:0,
          tipsRev:0, wholesaleSpent:0, ratings:[5]
        };
        renderCustomerBooth();
        renderDailyFlashDeal();
        renderDailyWorldEventBanner();
        renderNotificationBadge();
        renderFarmEventPanel();
        renderBarnEventPanel();
        renderVillageUI();
        renderMarketUI();
        updateHeaderStats();
        updateShopPhaseUI();
        saveGameToStorage(false);
        playSound('level');
        showToast(`Chào ngày ${gameState.day}! Năng lượng Làng đã hồi đầy 100/100 ⚡`, '🌅');
        if(gameState.staffHR?.pending)setTimeout(()=>{if(sessionGameActive)v87531Open();},400);
      } finally {
        v87ChangingDay=false;
        if(btn) btn.disabled=false;
      }
    }

    function updatePhoneClock() {
      const el = document.getElementById('phone-clock');
      if (!el) return;
      const now = new Date();
      el.innerText = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    }

    function openSmartPhoneModal() {
      const modal = document.getElementById('modal-smartphone');
      phonePauseActive = true;
      clearTimeout(window._nextCustomerTimeout);
      if (modal) modal.classList.remove('hidden');
      updatePhoneClock();
      updateHeaderStats();
      renderNotificationBadge();
      renderCustomerBooth();
      playSound('click');
      switchPhoneApp('delivery');
    }

    function closeSmartPhoneModal() {
      const modal = document.getElementById('modal-smartphone');
      if (modal) modal.classList.add('hidden');
      phonePauseActive = false;
      if (gameState.phase === 'open' && !currentCustomer) scheduleNextCustomer('phone_closed');
      renderCustomerBooth();
      playSound('click');
    }


    // V37 NPC AUCTION HOUSE - all auction money and inventory are local save data.
    const AUCTION_RARITY_VALUES = {green:70,blue:185,purple:480,red:1300,gold:3600};
    const AUCTION_NPC_NAMES = ['Cô Loan Chợ','Chú Bảy Đồ Cổ','Chị Bích Sưu Tầm','Anh Khải','Ken Du Khách','Bác Tư Tem Cổ','Hội Quán Xưa'];
    let currentAuctionTab = 'buy';

    function ensureAuctionState() {
      if (!gameState || !gameState.auctionHouse || typeof gameState.auctionHouse !== 'object' || Array.isArray(gameState.auctionHouse)) {
        gameState.auctionHouse = {day:0,nextId:1,lots:[],listings:[],history:[]};
      }
      const a=gameState.auctionHouse;
      if (!Array.isArray(a.lots)) a.lots=[];
      if (!Array.isArray(a.listings)) a.listings=[];
      if (!Array.isArray(a.history)) a.history=[];
      if (!Number.isSafeInteger(a.nextId) || a.nextId<1) a.nextId=1;
      if (!Number.isFinite(Number(a.day))) a.day=0;
      // Old saves are augmented in-place, without changing souvenir amounts.
    }

    function auctionFormatXu(amount) { return Math.max(0,Math.floor(Number(amount)||0)).toLocaleString('vi-VN'); }
    function getSouvenirAuctionValue(id) {
      const it=SOUVENIR_CONFIG[id];
      if (!it) return 0;
      let hash=0;
      for (let i=0;i<id.length;i++) hash=(hash*31+id.charCodeAt(i))%1009;
      const multiplier=0.88+(hash%27)/100 + (it.bonus?.farmGrowthPct || it.bonus?.barnGrowthPct ? .1 : 0);
      return Math.round((AUCTION_RARITY_VALUES[it.rarity]||75)*multiplier/5)*5;
    }
    function auctionRarityStyle(item) {
      const meta=SOUVENIR_RARITY[item.rarity]||SOUVENIR_RARITY.green;
      return `color:${meta.color};border:1px solid ${meta.color}50;background:${meta.bg}`;
    }
    function auctionMinStep(item) { return Math.max(5,Math.round(getSouvenirAuctionValue(item)/10/5)*5); }
    function addAuctionHistory(type, id, amount, note) {
      const a=gameState.auctionHouse;
      a.history.unshift({type,id,amount:Math.max(0,Math.floor(amount||0)),note:String(note||''),day:gameState.day});
      a.history=a.history.slice(0,24);
    }
    function chooseAuctionLots() {
      const a=gameState.auctionHouse;
      const level=Number(gameState.level)||1;
      const weights={green:42,blue:28,purple:17,red:9,gold:4};
      // higher-tier items show up more in late-game, without making rare items cheap.
      if(level<5){ weights.red=2;weights.gold=1; }
      const pool=Object.entries(SOUVENIR_CONFIG).filter(([id])=>!id.startsWith('v874_')).map(([id,it])=>({id,it,w:weights[it.rarity]||10}));
      const ownedIds=new Set(Object.keys(gameState.souvenirs||{}).filter(id=>(gameState.souvenirs[id]||0)>0));
      const selected=[];
      for(let i=0;i<4;i++){
        const candidates=pool.filter(x=>!selected.includes(x.id));
        if(!candidates.length) break;
        const total=candidates.reduce((sum,x)=>sum+x.w*(ownedIds.has(x.id)?.55:1.4),0);
        let roll=Math.random()*total;
        const picked=candidates.find(x=>{roll-=x.w*(ownedIds.has(x.id)?.55:1.4);return roll<=0;})||candidates[candidates.length-1];
        const val=getSouvenirAuctionValue(picked.id);
        const opening=Math.max(10,Math.round(val*(.65+Math.random()*.19)/5)*5);
        const buyNow=Math.max(opening+10,Math.round(val*(1.32+Math.random()*.28)/5)*5);
        const startBid=Math.min(buyNow-5, opening+(Math.random()<.55?auctionMinStep(picked.it):0));
        selected.push(picked.id);
        a.lots.push({lotId:a.nextId++,id:picked.id,price:startBid,buyNow,leader:'npc',npc:AUCTION_NPC_NAMES[Math.floor(Math.random()*AUCTION_NPC_NAMES.length)],held:0,bids:0,day:gameState.day});
      }
    }
    function advanceAuctionHouseDay() {
      ensureAuctionState();
      const a=gameState.auctionHouse;
      const today=Number(gameState.day)||1;
      // Close every listing that has expired. This runs once per day, never per render.
      for(const listing of a.listings.filter(x=>x.endDay<=today && x.status==='live')) {
        listing.status='closed';
        const item=SOUVENIR_CONFIG[listing.id];
        if(!item) continue;
        const baseline=getSouvenirAuctionValue(listing.id);
        const interest=Math.max(.08,Math.min(.94,.63+(baseline-listing.opening)/baseline*.75));
        if((Number(listing.npcBid)||0)>0 || Math.random()<interest){
          const amount=Math.max(listing.opening,Number(listing.npcBid)||0,Math.round(baseline*(.84+Math.random()*.65)/5)*5);
          const fee=Math.ceil(amount*.05);
          const received=Math.max(0,amount-fee);
          gameState.coins=Math.max(0,Number(gameState.coins)||0)+received;
          addAuctionHistory('sold',listing.id,received,`Bán cho ${AUCTION_NPC_NAMES[Math.floor(Math.random()*AUCTION_NPC_NAMES.length)]} • giá chốt ${auctionFormatXu(amount)} Xu (phí ${fee})`);
          pushGameNotification('🔨 Bán thành công',`${item.name}: +${auctionFormatXu(received)} Xu đã trừ phí.`, '💰','auction');
        }else{
          gameState.souvenirs[listing.id]=(Number(gameState.souvenirs[listing.id])||0)+1;
          addAuctionHistory('unsold',listing.id,0,'Không đủ người trả giá • Đã hoàn lại vật phẩm');
        }
      }
      a.listings=a.listings.filter(x=>x.status==='live');
      for(const lot of a.lots.filter(x=>x.day<today)){
        if(lot.leader==='player' && lot.held>0){
          gameState.souvenirs[lot.id]=(Number(gameState.souvenirs[lot.id])||0)+1;
          addAuctionHistory('won',lot.id,lot.price,'Thắng đấu giá • Đã nhận vào Kho Lưu Niệm');
          pushGameNotification('🏆 Đấu giá thắng',`${SOUVENIR_CONFIG[lot.id]?.name||'Lưu niệm'} đã được giao vào kho.`, '🔨','auction');
        }
      }
      a.lots=a.lots.filter(x=>x.day>=today);
      if(Number(a.day)<today){a.day=today;chooseAuctionLots();}
    }
    function auctionRefresh() {
      // First open creates today's stable lots, persisted immediately in the local save.
      ensureAuctionState();
      const before=Number(gameState.auctionHouse.day)||0;
      advanceAuctionHouseDay();
      if (before!==Number(gameState.auctionHouse.day)) saveGameToStorage(false);
    }
    function openAuctionFromWarehouse() {
      openSmartPhoneModal();
      currentAuctionTab='sell';
      switchPhoneApp('auction');
    }
    function setAuctionTab(tab) {
      if(!['buy','sell','history'].includes(tab))return;
      currentAuctionTab=tab;renderAuctionHouse();playSound('click');
    }
    function bidOnAuction(lotId) {
      auctionRefresh();
      const a=gameState.auctionHouse;
      const lot=a.lots.find(x=>x.lotId===lotId && x.day===gameState.day);
      const item=lot&&SOUVENIR_CONFIG[lot.id];
      if(!item)return showToast('Phiên đấu giá không còn.', '🔨');
      if(lot.bids>=4)return showToast('Bạn đã đấu giá tối đa 4 lần cho món này.', '🕒');
      const step=auctionMinStep(item);
      const next=Math.min(lot.buyNow,lot.price+step);
      const available=(Number(gameState.coins)||0)+(lot.leader==='player'?lot.held:0);
      if(next>=lot.buyNow)return showToast('Đã gần giá mua ngay, hãy chọn Mua ngay.', '🔨');
      if(available<next)return showToast(`Bạn cần ${auctionFormatXu(next)} Xu để đấu giá.`, '🪙');
      // Previous escrow returned before placing the stronger offer; no double charge.
      if(lot.leader==='player')gameState.coins+=lot.held;
      gameState.coins-=next;
      lot.leader='player';lot.held=next;lot.price=next;lot.bids++;
      // Simulated NPC may counter once immediately, so player sees and can react.
      const counterChance=Math.max(.13,.48-(lot.bids-1)*.08);
      if(lot.bids<4 && Math.random()<counterChance && lot.price+step<lot.buyNow){
        gameState.coins+=lot.held;
        lot.held=0;lot.leader='npc';lot.price+=step;
        lot.npc=AUCTION_NPC_NAMES[Math.floor(Math.random()*AUCTION_NPC_NAMES.length)];
        showToast(`${lot.npc} đã trả giá cao hơn! Xu đặt trước đã hoàn lại.`, '🔨');
      }else{
        showToast(`Bạn dẫn đầu ở mức ${auctionFormatXu(next)} Xu. Chốt khi qua ngày!`, '🏆');
      }
      updateHeaderStats();renderAuctionHouse();saveGameToStorage(false);
    }
    function buyAuctionNow(lotId) {
      auctionRefresh();
      const lot=gameState.auctionHouse.lots.find(x=>x.lotId===lotId && x.day===gameState.day);
      if(!lot || !SOUVENIR_CONFIG[lot.id])return;
      const released=lot.leader==='player'?lot.held:0;
      if((Number(gameState.coins)||0)+released<lot.buyNow)return showToast('Không đủ Xu để mua ngay.', '🪙');
      if(released)gameState.coins+=released;
      gameState.coins-=lot.buyNow;
      gameState.souvenirs[lot.id]=(Number(gameState.souvenirs[lot.id])||0)+1;
      addAuctionHistory('bought',lot.id,lot.buyNow,'Mua ngay • Đã nhận vào kho');
      gameState.auctionHouse.lots=gameState.auctionHouse.lots.filter(x=>x.lotId!==lotId);
      playSound('coin');showToast(`Đã mua ${SOUVENIR_CONFIG[lot.id].name}!`, '🎁');
      updateHeaderStats();renderGameCollectionSummary();renderAuctionHouse();saveGameToStorage(false);
    }
    function listSouvenirForAuction(id,pricing) {
      auctionRefresh();
      const item=SOUVENIR_CONFIG[id];
      const a=gameState.auctionHouse;
      const count=Number(gameState.souvenirs[id])||0;
      if(!item || count<2)return showToast('Cần ít nhất 2 bản để bán đồ dư.', '🔒');
      if(a.listings.filter(x=>x.status==='live').length>=3)return showToast('Tối đa 3 món đang niêm yết.', '📦');
      const factors={quick:.75,normal:1,high:1.3};
      if(!Object.hasOwn(factors,pricing))return;
      const opening=Math.max(10,Math.round(getSouvenirAuctionValue(id)*factors[pricing]/5)*5);
      const fee=Math.max(1,Math.ceil(opening*.03));
      if((Number(gameState.coins)||0)<fee)return showToast(`Cần ${auctionFormatXu(fee)} Xu phí đăng bán.`, '🪙');
      gameState.coins-=fee;
      gameState.souvenirs[id]=count-1;
      const interestChance=Math.max(.10,Math.min(.85,.52+(getSouvenirAuctionValue(id)-opening)/getSouvenirAuctionValue(id)*.75));
      const npcBid=Math.random()<interestChance ? Math.max(opening,Math.round(opening*(1+Math.random()*.18)/5)*5):0;
      const buyer=npcBid ? AUCTION_NPC_NAMES[Math.floor(Math.random()*AUCTION_NPC_NAMES.length)] : null;
      a.listings.push({lotId:a.nextId++,id,opening,fee,npcBid,buyer,endDay:gameState.day+1,status:'live'});
      addAuctionHistory('listed',id,fee,`Đăng bán với giá khởi điểm ${auctionFormatXu(opening)} Xu • phí đăng ${fee} Xu`);
      updateHeaderStats();renderGameCollectionSummary();renderAuctionHouse();saveGameToStorage(false);
      playSound('click');showToast(`Đã niêm yết 1 ${item.name}.`, '🔨');
    }
    function cancelSouvenirAuction(lotId) {
      auctionRefresh();
      const listing=gameState.auctionHouse.listings.find(x=>x.lotId===lotId && x.status==='live');
      if(!listing)return;
      // Listing fees are non-refundable; one original copy has always been retained.
      gameState.souvenirs[listing.id]=(Number(gameState.souvenirs[listing.id])||0)+1;
      gameState.auctionHouse.listings=gameState.auctionHouse.listings.filter(x=>x.lotId!==lotId);
      addAuctionHistory('cancelled',listing.id,0,'Đã rút món khỏi sàn • phí niêm yết không hoàn lại');
      renderGameCollectionSummary();renderAuctionHouse();saveGameToStorage(false);
      showToast('Đã trả lưu niệm về kho.', '📦');
    }
    function renderAuctionHouse() {
      auctionRefresh();
      const a=gameState.auctionHouse;
      const coinEl=document.getElementById('auction-coins');if(coinEl)coinEl.textContent=auctionFormatXu(gameState.coins);
      ['buy','sell','history'].forEach(tab=>{
        document.getElementById(`auction-tab-${tab}`)?.classList.toggle('active',tab===currentAuctionTab);
        document.getElementById(`auction-${tab}-section`)?.classList.toggle('hidden',tab!==currentAuctionTab);
      });
      const buyGrid=document.getElementById('auction-buy-grid');
      if(buyGrid) buyGrid.innerHTML=a.lots.map(lot=>{
        const item=SOUVENIR_CONFIG[lot.id];if(!item)return '';
        const meta=SOUVENIR_RARITY[item.rarity];
        const own=Number(gameState.souvenirs[lot.id])||0;
        const step=auctionMinStep(item);
        const bidPrice=lot.price+step;
        const bidAvailable=(Number(gameState.coins)||0)+(lot.leader==='player'?lot.held:0);
        return `<div class="auction-card">
          <div class="flex items-center justify-between gap-1"><div class="auction-art">${item.icon}</div><span class="auction-label" style="${auctionRarityStyle(item)}">${meta.icon} ${item.rarity.toUpperCase()}</span></div>
          <div class="auction-name">${item.name}</div>
          <div class="auction-sub">💎 Tham khảo ${auctionFormatXu(getSouvenirAuctionValue(lot.id))} Xu • Bạn có x${own}</div>
          <div class="auction-price">${auctionFormatXu(lot.price)} Xu</div>
          <div class="auction-sub">${lot.leader==='player'?'🟢 Bạn đang dẫn đầu':`👤 ${lot.npc}`} • chốt Ngày ${lot.day+1}</div>
          <div class="mt-auto space-y-1">
            <button onclick="bidOnAuction(${lot.lotId})" class="auction-btn secondary" ${lot.bids>=4||bidPrice>=lot.buyNow||bidAvailable<bidPrice?'disabled':''}>🔨 +${auctionFormatXu(step)} Xu</button>
            <button onclick="buyAuctionNow(${lot.lotId})" class="auction-btn" ${(Number(gameState.coins)||0)+(lot.leader==='player'?lot.held:0)<lot.buyNow?'disabled':''}>Mua ngay ${auctionFormatXu(lot.buyNow)} Xu</button>
          </div></div>`;
      }).join('')||'<div class="auction-note col-span-2">Hôm nay không còn lô hàng. Hãy quay lại ngày mai.</div>';
      const sellGrid=document.getElementById('auction-sell-grid');
      const ongoing=document.getElementById('auction-my-listings');
      if(ongoing) ongoing.innerHTML=a.listings.length?`<b class="text-[9px] text-amber-200">⏳ Đang niêm yết (${a.listings.length}/3)</b>`+a.listings.map(x=>{
        const item=SOUVENIR_CONFIG[x.id];return !item?'':`<div class="auction-history"><span class="text-2xl">${item.icon}</span><div class="flex-1 min-w-0"><b class="text-[9px] text-white block">${item.name}</b><span class="auction-sub">Giá sàn ${auctionFormatXu(x.opening)} Xu • chốt Ngày ${x.endDay}</span><span class="auction-sub block text-amber-200">${x.npcBid ? `🔨 ${x.buyer}: ${auctionFormatXu(x.npcBid)} Xu`:'⏳ Chờ người trả giá'}</span></div><button class="shrink-0 text-[8px] text-rose-200 rounded-lg px-2 py-1 bg-rose-900/50" onclick="cancelSouvenirAuction(${x.lotId})">Rút</button></div>`;
      }).join(''):'<div class="auction-note">Bạn chưa đăng món nào.</div>';
      const sellable=Object.entries(SOUVENIR_CONFIG).filter(([id])=>(Number(gameState.souvenirs[id])||0)>=2);
      if(sellGrid)sellGrid.innerHTML=sellable.map(([id,item])=>{
        const value=getSouvenirAuctionValue(id);
        const count=gameState.souvenirs[id];
        return `<div class="auction-card">
          <div class="flex items-center justify-between gap-1"><div class="auction-art">${item.icon}</div><span class="auction-label" style="${auctionRarityStyle(item)}">${SOUVENIR_RARITY[item.rarity].icon} ${item.rarity.toUpperCase()}</span></div>
          <div class="auction-name">${item.name}</div><div class="auction-sub">📦 Có ${count} • dư ${count-1} • giữ 1 bản</div>
          <div class="auction-price">~ ${auctionFormatXu(value)} Xu</div>
          <div class="auction-sub">Chọn giá khởi điểm (chưa gồm phí 3%)</div>
          <div class="mt-auto grid grid-cols-3 gap-1">
            <button onclick="listSouvenirForAuction('${id}','quick')" class="auction-btn !text-[7px]" title="Bán nhanh 75%">75%</button>
            <button onclick="listSouvenirForAuction('${id}','normal')" class="auction-btn !text-[7px]" title="Giá thường 100%">100%</button>
            <button onclick="listSouvenirForAuction('${id}','high')" class="auction-btn !text-[7px]" title="Giá cao 130%">130%</button>
          </div></div>`;
      }).join('')||'<div class="auction-note col-span-2">Chưa có món trùng. Hãy khám phá Làng, mở Túi Mù hoặc mua đấu giá để sưu tập thêm.</div>';
      const history=document.getElementById('auction-history-list');
      if(history)history.innerHTML=a.history.map(x=>{
        const item=SOUVENIR_CONFIG[x.id];if(!item)return '';
        const title={sold:'✅ Đã bán',won:'🏆 Đã thắng',bought:'🛍️ Đã mua',listed:'🔨 Đã đăng',unsold:'↩️ Hoàn đồ',cancelled:'↩️ Rút bán'}[x.type]||'🔨';
        return `<div class="auction-history"><span class="text-xl">${item.icon}</span><div class="flex-1 min-w-0"><b class="text-[9px] text-white block">${title} • ${item.name}</b><div class="auction-sub">Ngày ${x.day} • ${x.note}</div></div><b class="text-[8px] text-amber-200 whitespace-nowrap">${['sold'].includes(x.type)?'+':['bought','listed'].includes(x.type)?'-':''}${auctionFormatXu(x.amount)} Xu</b></div>`;
      }).join('')||'<div class="auction-note">Chưa có giao dịch nào.</div>';
    }

    // === V87.3.1: Tiny everyday treasures, NPC gifts, and mystery packages ===
    // Separate from the souvenir collection and auction economy.
    const V8731_ITEMS = {
      toy_frog:{name:'Ếch nhún tí hon',icon:'🐸',kind:'toy',tag:'fun',price:28,desc:'Ấn nhẹ là nhảy tưng tưng.'},
      toy_duck:{name:'Vịt bóp chíp chíp',icon:'🐤',kind:'toy',tag:'fun',price:22,desc:'Kêu một tiếng, vui cả ngày.'},
      toy_woodhorse:{name:'Ngựa gỗ mini',icon:'🐴',kind:'toy',tag:'handmade',price:45,desc:'Con ngựa gỗ nhỏ đủ đặt trong lòng bàn tay.'},
      toy_bear:{name:'Gấu bông bỏ túi',icon:'🧸',kind:'toy',tag:'cute',price:58,desc:'Một bé gấu mềm với chiếc nơ lệch.'},
      toy_spintop:{name:'Con quay cầu vồng',icon:'🪀',kind:'toy',tag:'fun',price:37,desc:'Quay tít cho đến khi chóng mặt.'},
      toy_slime:{name:'Slime mây tím',icon:'🟣',kind:'toy',tag:'fun',price:33,desc:'Mềm mềm, dẻo dẻo, không ăn được.'},
      toy_robot:{name:'Robot lon ton',icon:'🤖',kind:'toy',tag:'fun',price:76,desc:'Hai bước tiến một bước lùi.'},
      toy_puzzle:{name:'Xếp hình ngôi sao',icon:'🧩',kind:'toy',tag:'study',price:49,desc:'Nhỏ nhưng thử thách trí tò mò.'},
      toy_kite:{name:'Diều giấy bé xíu',icon:'🪁',kind:'toy',tag:'outdoor',price:24,desc:'Đẹp hơn khả năng bay của nó.'},
      toy_marbles:{name:'Bộ bi thủy tinh',icon:'🔮',kind:'toy',tag:'fun',price:28,desc:'Những viên bi lấp lánh màu kẹo.'},
      gift_bow:{name:'Nơ hồng xinh',icon:'🎀',kind:'gift',tag:'cute',price:20,desc:'Nơ vải tặng ai cũng hợp.'},
      gift_flower:{name:'Bó hoa giấy',icon:'💐',kind:'gift',tag:'nature',price:32,desc:'Hoa không héo, lời hứa thì có thể.'},
      gift_card:{name:'Thiệp viết tay',icon:'💌',kind:'gift',tag:'heart',price:16,desc:'Một vài dòng chữ vụng về dễ thương.'},
      gift_book:{name:'Sổ tay bìa mây',icon:'📒',kind:'gift',tag:'study',price:50,desc:'Để ghi điều bí mật không dám nói.'},
      gift_pencil:{name:'Bút chì hoa lá',icon:'✏️',kind:'gift',tag:'study',price:18,desc:'Viết sai có thể tẩy, nói sai thì khó.'},
      gift_cookie:{name:'Bánh quy hình sao',icon:'🍪',kind:'gift',tag:'food',price:25,desc:'Một chiếc bánh nhỏ thơm bơ.'},
      gift_tea:{name:'Gói trà thảo mộc',icon:'🍵',kind:'gift',tag:'food',price:43,desc:'Thơm như buổi sáng sau mưa.'},
      gift_seed:{name:'Gói hạt hoa nhỏ',icon:'🌻',kind:'gift',tag:'nature',price:19,desc:'Không chắc mọc cây gì, nhưng đầy hy vọng.'},
      gift_ribbon:{name:'Dây buộc tóc chấm bi',icon:'🌸',kind:'gift',tag:'cute',price:27,desc:'Nho nhỏ, rực rỡ và vui mắt.'},
      gift_keychain:{name:'Móc khóa mèo ngủ',icon:'🐱',kind:'gift',tag:'cute',price:59,desc:'Bé mèo đi đâu cũng buồn ngủ.'},
      gift_bell:{name:'Chuông gió bằng tre',icon:'🎐',kind:'gift',tag:'handmade',price:69,desc:'Gió ghé qua là ngân một tiếng.'},
      gift_craft:{name:'Khung ảnh giấy',icon:'🖼️',kind:'gift',tag:'handmade',price:40,desc:'Chưa có ảnh, nhưng có một câu chuyện.'},
      junk_leaf:{name:'Lá me rơi',icon:'🍃',kind:'junk',tag:'nature',price:0,desc:'Một chiếc lá. Không bán được, không có hiệu ứng.'},
      junk_petal:{name:'Cánh hoa nhàu',icon:'🌼',kind:'junk',tag:'nature',price:0,desc:'Từng đẹp, giờ vẫn dễ thương.'},
      junk_stone:{name:'Viên sỏi tròn',icon:'🪨',kind:'junk',tag:'outdoor',price:1,desc:'Trông rất giống... một viên sỏi.'},
      junk_button:{name:'Cúc áo thất lạc',icon:'🟡',kind:'junk',tag:'handmade',price:1,desc:'Không ai biết rơi từ chiếc áo nào.'},
      junk_ticket:{name:'Vé xe cũ',icon:'🎟️',kind:'junk',tag:'nostalgia',price:0,desc:'Vé hết hạn nhưng còn cả bầu trời kỷ niệm.'},
      junk_wrapper:{name:'Vỏ kẹo óng ánh',icon:'🍬',kind:'junk',tag:'cute',price:0,desc:'Kẹo đâu không thấy, giấy gói vẫn xinh.'},
      junk_feather:{name:'Lông chim lạc',icon:'🪶',kind:'junk',tag:'nature',price:0,desc:'Nhẹ đến mức gió cũng muốn giữ.'},
      junk_shell:{name:'Vỏ ốc tí hon',icon:'🐚',kind:'junk',tag:'nature',price:1,desc:'Áp tai nghe tiếng... im lặng.'},
      box_paper:{name:'Gói quà giấy báo',icon:'📦',kind:'box',tag:'mystery',price:25,desc:'Bóc ra có thể được đồ chơi hoặc... lá cây.'},
      box_pink:{name:'Hộp quà nơ hồng',icon:'🎁',kind:'box',tag:'mystery',price:59,desc:'Một chiếc hộp không ai chịu hé lộ.'},
      box_star:{name:'Hộp sao bất ngờ',icon:'🌟',kind:'box',tag:'mystery',price:99,desc:'Có thể trúng đồ xinh hiếm hơn, vẫn không chắc.'}
    };
    const V8731_SHOP_KEYS=Object.keys(V8731_ITEMS).filter(id=>V8731_ITEMS[id].price>1);
    // Integrate into the existing warehouse value model without changing game recipes.
    Object.entries(V8731_ITEMS).forEach(([id,it])=>{ITEM_DICTIONARY[id]={name:it.name,icon:it.icon,cat:'misc',basePrice:it.kind==='junk'?0:Math.max(1,Math.floor(it.price*.15))};});
    const V8731_TASTE={
      bebo:['fun','outdoor'],baTu:['heart','handmade'],bacTam:['nature','handmade'],coUt:['cute','handmade'],
      bacBinh:['food','heart'],coHanh:['study','heart'],thayDung:['outdoor','fun'],thayMinh:['study','handmade'],
      banLan:['cute','study'],banMai:['cute','nature'],mika:['cute','fun'],chuNam:['handmade','food'],
      coLua:['nature','food'],bacCau:['nature','nostalgia'],anhPho:['handmade','study']
    };
    Object.assign(V8731_TASTE,{"chiNhai":["food","handmade"],"coSau":["nature","handmade"],"anhKhai":["handmade","nostalgia"],"chuLoc":["nostalgia","handmade"],"bacPhuc":["nature","outdoor"],"chiHa":["cute","food"],"anhKhoa":["heart","handmade"],"chiDiem":["handmade","heart"],"coTuyet":["study","handmade"],"anhTin":["fun","outdoor"],"bacSiAn":["study","heart"],"yTaLinh":["cute","heart"],"ongKhang":["nature","nostalgia"]});
    Object.assign(V8731_TASTE,{"baMan":["nostalgia","study"],"anhVinh":["handmade","fun"],"coGiang":["study","heart"],"chiNhien":["nature","food"],"anhDuy":["outdoor","handmade"],"bacThach":["outdoor","nostalgia"],"chiLy":["food","handmade"],"anhSoc":["fun","heart"],"coYen":["handmade","nostalgia"],"anhQuan":["study","handmade"],"chiNgoc":["study","heart"],"thayTri":["study","cute"]});
    function v8731Ensure(){
      if(!gameState.inventory || typeof gameState.inventory!=='object')gameState.inventory={};
      if(!gameState.v8731GiftDays||typeof gameState.v8731GiftDays!=='object')gameState.v8731GiftDays={};
      if(!gameState.v8731Shop||typeof gameState.v8731Shop!=='object')gameState.v8731Shop={day:Number(gameState.day)||1,counts:{}};
      if(Number(gameState.v8731Shop.day)!==Number(gameState.day))gameState.v8731Shop={day:Number(gameState.day)||1,counts:{}};
      if(!gameState.v8731Shop.counts||typeof gameState.v8731Shop.counts!=='object')gameState.v8731Shop.counts={};
    }
    function v8731MaybeScavenge(){
      v8731Ensure();
      if(!gameState.v8731Finds || Number(gameState.v8731Finds.day)!==Number(gameState.day))gameState.v8731Finds={day:Number(gameState.day),count:0};
      if(gameState.v8731Finds.count>=3 || Math.random()>=.34)return;
      const rubbish=['junk_leaf','junk_petal','junk_stone','junk_button','junk_ticket','junk_wrapper','junk_feather','junk_shell'];
      const trinkets=['toy_kite','toy_marbles','gift_seed','gift_card'];
      const pool=Math.random()<.88?rubbish:trinkets;
      const id=pool[Math.floor(Math.random()*pool.length)],it=V8731_ITEMS[id];
      gameState.inventory[id]=v8731Owned(id)+1;
      gameState.v8731Finds.count++;
      showToast(`Bạn nhặt được ${it.icon} ${it.name}! Cất vào Kho → Đồ Linh Tinh.`,it.icon);
    }
    function v8731Owned(id){return Math.max(0,Math.floor(Number(gameState.inventory?.[id])||0));}
    function v8731Save(){updateHeaderStats();saveGameToStorage(false);}
    function v8731RenderShop(){
      const grid=document.getElementById('v8731-market-grid');if(!grid)return;
      v8731Ensure();
      const categories=[['toy','Đồ chơi'],['gift','Quà tặng'],['box','Gói bí ẩn']];
      grid.innerHTML=categories.map(([kind,label])=>`<div class="col-span-2 v8731-shop-label">${kind==='toy'?'🧸':kind==='gift'?'💝':'🎲'} ${label}</div>`+
        V8731_SHOP_KEYS.filter(id=>V8731_ITEMS[id].kind===kind).map(id=>{
          const it=V8731_ITEMS[id],max=kind==='box'?3:5,used=Number(gameState.v8731Shop.counts[id])||0,stock=max-used;
          return `<div class="v8731-shop-item"><div class="v8731-item-icon">${it.icon}</div><b>${it.name}</b><span>${it.desc}</span><small>🪙 ${it.price} Xu • Còn ${stock}</small><button type="button" class="v8731-buy" ${stock<=0||gameState.coins<it.price?'disabled':''} onclick="v8731Buy('${id}')">${stock<=0?'Hết hôm nay':'Mua quà'}</button></div>`;
        }).join('')).join('');
    }
    function v8731ToggleMarket(force){
      const el=document.getElementById('v8731-market-body'),b=document.getElementById('v8731-market-toggle');if(!el)return;
      const open=force===undefined?el.classList.contains('hidden'):!!force;
      el.classList.toggle('hidden',!open);if(b)b.setAttribute('aria-expanded',String(open));
      const arrow=document.getElementById('v8731-shop-chevron');if(arrow)arrow.textContent=open?'⌃':'⌄';
      if(open)v8731RenderShop();
    }
    function v8731OpenMarketFromWarehouse(){
      openSmartPhoneModal();switchPhoneApp('soppi');v8731ToggleMarket(true);
      const el=document.getElementById('v8731-toy-market');if(el)el.scrollIntoView({block:'start',behavior:'auto'});
    }
    function v8731Buy(id){
      const it=V8731_ITEMS[id];if(!it||it.price<2)return;
      v8731Ensure();const max=it.kind==='box'?3:5;
      if((Number(gameState.v8731Shop.counts[id])||0)>=max)return showToast('Hôm nay chợ hết món này rồi.','🛍️');
      if((Number(gameState.coins)||0)<it.price)return showToast('Không đủ Xu để mua món này.','🪙');
      gameState.coins-=it.price;gameState.v8731Shop.counts[id]=(Number(gameState.v8731Shop.counts[id])||0)+1;
      gameState.inventory[id]=v8731Owned(id)+1;
      playSound('coin');showToast(`Đã mua ${it.icon} ${it.name}.`,it.icon);
      v8731Save();v8731RenderShop();
    }
    const V8731_BOX_POOL={
      box_paper:[['junk_leaf',16],['junk_petal',12],['junk_stone',9],['junk_button',9],['junk_wrapper',8],['toy_duck',13],['toy_kite',11],['gift_card',12],['toy_marbles',10]],
      box_pink:[['junk_feather',8],['junk_shell',7],['gift_bow',17],['toy_frog',14],['gift_flower',13],['toy_slime',13],['gift_ribbon',12],['toy_bear',8],['gift_keychain',8]],
      box_star:[['junk_ticket',6],['toy_puzzle',14],['toy_woodhorse',11],['gift_tea',14],['gift_book',13],['toy_robot',10],['gift_bell',11],['gift_keychain',11],['gift_craft',10]]
    };
    function v8731OpenBox(id){
      const pool=V8731_BOX_POOL[id];if(!pool||v8731Owned(id)<1)return showToast('Bạn chưa có gói quà này.','📦');
      const weight=pool.reduce((t,x)=>t+x[1],0);let r=Math.random()*weight;
      const result=(pool.find(x=>(r-=x[1])<0)||pool[pool.length-1])[0];
      gameState.inventory[id]=v8731Owned(id)-1;
      gameState.inventory[result]=v8731Owned(result)+1;
      const it=V8731_ITEMS[result];
      showToast(`${it.icon} Bóc ra: ${it.name}! ${it.kind==='junk'?'Không giá trị, nhưng đáng yêu.':'Một món xinh xắn mới!'}`,'🎊');
      playSound('coin');v8731Save();renderWarehouseUI();
    }
    function v8731RenderMiscWarehouse(grid,valText){
      v8731Ensure();grid.className='grid grid-cols-2 gap-1.5';
      const goods=Object.entries(V8731_ITEMS).filter(([id])=>v8731Owned(id)>0);
      const pieces=goods.reduce((sum,[id])=>sum+v8731Owned(id),0);
      if(valText)valText.textContent=`🎀 ${pieces} món linh tinh • đồ thường ngày, KHÔNG phải lưu niệm hiếm`;
      grid.innerHTML=`<div class="col-span-2 v8731-warehouse-head"><b>🧸 Đồ xinh & đồ nhặt được</b><button type="button" onclick="v8731OpenMarketFromWarehouse()">🛍️ Đi chợ đồ xinh ›</button></div>`+
        (goods.length?goods.map(([id,it])=>`<div class="v8731-misc-card"><div class="v8731-item-icon">${it.icon}</div><b>${it.name}</b><span>Đang có x${v8731Owned(id)} • ${it.kind==='junk'?'Vặt vãnh':it.kind==='box'?'Chưa bóc':it.kind==='toy'?'Đồ chơi':'Quà tặng'}</span><p>${it.desc}</p>${it.kind==='box'?`<button class="v8731-unbox" onclick="v8731OpenBox('${id}')">🎁 Bóc một gói</button>`:''}</div>`).join(''):'<div class="col-span-2 v8731-empty">Kho trống xíu! Ghé Chợ Đồ Xinh, hoặc đi Làng để nhặt vài thứ kỳ lạ nhé.</div>');
    }
    function v8731GiftCandidates(){
      return Object.entries(gameState.inventory||{}).filter(([id,qty])=>Number(qty)>0 && (!!V8731_ITEMS[id]&&V8731_ITEMS[id].kind!=='box'||id==='crop_strawberry'));
    }
    function v8731GiftEntry(npcId){
      v8731Ensure();
      const last=Number(gameState.v8731GiftDays[npcId])||0,already=last===Number(gameState.day);
      const available=v8731GiftCandidates().length;
      const answer=window.v8731LastGiftResponse;
      const response=answer&&answer.npc===npcId&&Number(answer.day)===Number(gameState.day)?`<div class="v8731-gift-response">${answer.text}</div>`:'';
      return `<div class="v8731-gift-panel">${response}<button type="button" class="v8731-gift-open" onclick="v8731ToggleNpcGift('${npcId}')" ${already?'disabled':''}>🎀 ${already?'Hôm nay đã tặng quà':'Tặng quà cho '+(VILLAGE_NPC_LIBRARY[npcId]?.name||'NPC')} <small>${already?'Mai hãy ghé lại':'Có '+available+' món có thể tặng • mỗi NPC 1 lần/ngày'}</small></button><div id="v8731-gift-list" class="hidden v8731-gift-list"></div></div>`;
    }
    function v8731ToggleNpcGift(id){
      if(id!==activeVillageNpcId||!(villageNpcState||[]).some(n=>n.id===id))return;
      const list=document.getElementById('v8731-gift-list');if(!list)return;
      const isOpening=list.classList.contains('hidden');list.classList.toggle('hidden',!isOpening);
      if(!isOpening)return;
      const items=v8731GiftCandidates();
      list.innerHTML=items.length?items.map(([key,qty])=>{
        const it=V8731_ITEMS[key]||{name:'Dâu Tây',icon:'🍓',desc:'Dâu hái trong vườn.'};
        return `<button type="button" class="v8731-gift-choice" onclick="v8731GiveGift('${id}','${key}')"><span>${it.icon}</span><span><b>${it.name}</b><small>Có ${Math.floor(Number(qty))} • ${it.kind==='junk'?'Nhặt được':it.kind==='toy'?'Đồ chơi':'Quà dễ thương'}</small></span><span>›</span></button>`;
      }).join(''):'<div class="v8731-empty">Bạn chưa có quà phù hợp. Mua trong Soppi → Chợ Đồ Xinh nhé.</div>';
    }
    function v8731GiveGift(npcId,id){
      v8731Ensure();
      const npc=VILLAGE_NPC_LIBRARY[npcId],it=V8731_ITEMS[id]|| (id==='crop_strawberry'?{name:'Dâu Tây',icon:'🍓',tag:'food',kind:'gift'}:null);
      if(!npc||!it||npcId!==activeVillageNpcId||!(villageNpcState||[]).some(n=>n.id===npcId))return showToast('NPC này không còn ở đây.','🚶');
      if(Number(gameState.v8731GiftDays[npcId])===Number(gameState.day))return showToast('Hôm nay bạn đã tặng người này rồi.','🎀');
      if(v8731Owned(id)<1)return showToast('Món này đã hết trong Kho.','📦');
      const tastes=V8731_TASTE[npcId]||['cute','heart'];
      const liked=tastes.includes(it.tag),junk=it.kind==='junk';
      const trustDelta=junk?(liked?2:-1):liked?7:3;
      const angerDelta=junk?(liked?0:1):liked?-3:-1;
      let line='';
      if(junk){
        line=liked?`${npc.name}: “Ôi, ${it.name.toLowerCase()} xinh quá. Bạn biết mình thích mấy thứ bé xíu à?”`:[`${npc.name}: “Ủa, bạn tặng mình ${it.name.toLowerCase()} thật hả? Thôi... mình cất làm kỷ niệm vậy!”`,`${npc.name}: “Một món gần như chẳng đáng đồng nào. Nhưng chắc bạn có ý tốt nhỉ?”`][Math.floor(Math.random()*2)];
      } else if(liked){
        line=[`${npc.name}: “Trời ơi, đúng món mình thích luôn! Bạn nhớ sở thích của mình hả?”`,`${npc.name}: “Món này đáng yêu quá! Hôm nay tự nhiên vui hẳn!”`][Math.floor(Math.random()*2)];
      } else {
        line=[`${npc.name}: “Cảm ơn nhé! Không đúng gu lắm nhưng mình quý tấm lòng của bạn.”`,`${npc.name}: “Ơ, bất ngờ ghê! Mình sẽ giữ cẩn thận.”`][Math.floor(Math.random()*2)];
      }
      gameState.inventory[id]=v8731Owned(id)-1;
      gameState.v8731GiftDays[npcId]=Number(gameState.day);
      v8732TrackGift(npcId,id);
      if(typeof v872Remember==='function' && V872_NPC_VOICES[npcId])v872Remember(npcId,`Nhận ${it.name} từ bạn. ${junk?(liked?'Thích món nhỏ bé này.':'Hơi hụt hẫng.'):liked?'Rất vui và cảm động.':'Lịch sự cảm ơn.'}`,trustDelta,angerDelta,'present');
      gameState.villageNpcBonds=gameState.villageNpcBonds||{};
      gameState.villageNpcBonds[npcId]=Math.max(0,Math.min(100,(Number(gameState.villageNpcBonds[npcId])||0)+Math.max(0,trustDelta)));
      window.v8731LastGiftResponse={npc:npcId,day:gameState.day,text:line};
      playSound('coin');v8731Save();inspectVillageNpc(npcId);
    }


    /* V87.4.1.1 — Read-only sources-of-truth ledger. All totals come from
       existing gameplay calculators; raw contributions are shown separately. */
    const V87411_META={
      revenuePct:['Doanh thu tại quầy','pct'],tipPct:['Tiền boa','pct'],patienceSec:['Khách chờ thêm','sec'],
      luckPct:['May mắn Quán','pct'],deliveryPct:['Tiền đơn giao hàng','pct'],opCost:['Phí vận hành thêm','xu'],
      arrivalPct:['Nhịp khách đến','pct'],rarePct:['Cơ hội khách hiếm từ nâng cấp','pct'],specialNpcPct:['Khách hiếm do sự kiện','pct'],
      deliveryTimeSec:['Thời gian giao hàng thêm','sec'],orderSlots:['Ô nhận đơn thêm','count'],
      villageLuckPct:['Vận may đi Làng','pct'],villageCoinPct:['Xu sự kiện Làng','pct'],
      energyCostFlat:['Tiết kiệm thể lực mỗi chuyến','energy'],skillEnergyFlat:['Tiết kiệm thể lực từ kỹ năng','energy'],regenReduceSec:['Rút ngắn thời gian hồi 1⚡','sec'],
      generalLuckPct:['May mắn chung','pct'],villageEnergyFlat:['Tiết kiệm thể lực từ NPC','energy'],
      farmGrowthPct:['Tốc độ cây trồng','pct'],farmYield:['Sản lượng Vườn','count'],seedSavePct:['Cơ hội giữ hạt giống','pct'],
      barnGrowthPct:['Tốc độ sản xuất Chuồng','pct'],barnYield:['Sản lượng Chuồng','count'],feedSavePct:['Cơ hội giữ thức ăn','pct'],
      careAffectionBonus:['Thân thiết khi chăm vật nuôi','heart'],
      seedDiscount:['Giảm giá hạt giống','pct'],spiceDiscount:['Giảm giá cốt lẩu / sốt / trà','pct'],
      packagingSaveXu:['Giảm giá bao bì mỗi món','xu'],farmSellPct:['Giá bán nông sản cộng thêm','xu']
    };
    function v87411Escape(t){return String(t??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
    function v87411Num(n){return Number(n)||0;}
    function v87411Format(value,unit,showSign=true){
      let n=v87411Num(value);if(unit==='pct')n*=100;
      if(unit==='count'||unit==='energy'||unit==='heart'||unit==='xu'||unit==='sec')n=Math.round(n*100)/100;
      const str=Number(n.toFixed(2)).toLocaleString('vi-VN',{maximumFractionDigits:2});
      const suffix={pct:'%',count:'',energy:'⚡',heart:'❤️',xu:' Xu',sec:' giây',special:''}[unit]||'';
      return `${showSign?(n>0?'+':n<0?'−':''):(n<0?'−':'' )}${n<0?String(Number((-n).toFixed(2)).toLocaleString('vi-VN',{maximumFractionDigits:2})):str}${suffix}`;
    }
    function v87411CollectSources(){
      const book={};
      function add(key,name,value,day=false){
        const n=v87411Num(value);if(Math.abs(n)<1e-9)return;
        (book[key]||(book[key]=[])).push({name:String(name),value:n,day});
      }
      function from(cfg,name,map,day=false){
        if(!cfg)return;
        for(const [k,val] of Object.entries(cfg))add(map?.[k]||k,name,val,day);
      }
      const stage=SHOP_STAGE_CONFIG[gameState.shopStage]||SHOP_STAGE_CONFIG[0];
      from(stage,`🏪 Bậc Quán: ${stage.name}`,null);
      const skills=gameState.skills||{};
      add('revenuePct','⚡ Kỹ năng Kinh Doanh',v87411Num(skills.sales)*.04);
      add('patienceSec','⚡ Kỹ năng Phục Vụ',v87411Num(skills.service)*3);
      add('patienceSec','👩‍🍳 Kỹ năng nghề đang làm',v8744CareerBonus(gameState.currentCareer).patienceSec);
      add('tipPct','⚡ Kỹ năng Phục Vụ',v87411Num(skills.service)*.03);
      add('luckPct','⚡ Kỹ năng May Mắn',v87411Num(skills.luck)*.03);
      add('farmGrowthPct','🌿 Kỹ năng Nông Trại',v87411Num(skills.farm)*.02);
      add('barnGrowthPct','🌿 Kỹ năng Nông Trại',v87411Num(skills.farm)*.02);
      for(const [id,cfg] of Object.entries(V8742_TALENTS)){
        const rank=v8742TalentLevel(id);if(!rank)continue;
        for(const [key,value] of Object.entries(cfg.bonus)) add(key==='energyCostFlat'?'skillEnergyFlat':key,`${cfg.icon} Chuyên sâu: ${cfg.name} Lv.${rank}`,value*rank);
      }
      (gameState.decorations||[]).forEach(id=>{const c=SHOP_DECOR_CONFIG[id];if(c)from(c,`${c.icon} Trang trí: ${c.name}`);});
      (gameState.staff||[]).forEach(id=>{const c=STAFF_CONFIG[id];if(!c)return;const f=v87531Factor(id);const src={};for(const k of ['revenuePct','tipPct','patienceSec','deliveryPct','deliveryTimeSec','orderSlots','rarePct','arrivalPct'])src[k]=k==='orderSlots'?(f>0?(Number(c[k])||0):0):(Number(c[k])||0)*f;from(src,`${c.icon} ${c.name}${!f?' (nghỉ phép)':''}`);const p=v87531Person(id);if(f>0&&p.trust>=85&&p.morale>=70)add('arrivalPct',`🌟 Uy tín ${c.name}`, .012);});
      Object.entries(v87531Ensure().due).forEach(([id,amt])=>add('opCost',`👥 Lương đã phát sinh: ${STAFF_CONFIG[id]?.name||id}`,amt));
      const moodBonus=gameState.staffHR.daily.day===gameState.day?gameState.staffHR.daily.bonus:{};
      for(const k of ['tipPct','arrivalPct','rarePct'])add(k,'📋 Quyết định nhân sự hôm nay',Number(moodBonus[k])||0,true);
      (gameState.utilityOwned||[]).forEach(id=>{const c=UTILITY_BUFF_CONFIG[id];if(c)from(c.bonuses,`${c.icon} Tiện ích: ${c.name}`,{shopRevenuePct:'revenuePct',shopTipPct:'tipPct',generalLuckPct:'luckPct'});});
      Object.values(gameState.equippedGear||{}).forEach(id=>{const c=CHARACTER_GEAR_CONFIG[id];if(c)from(c.bonuses,`${c.icon} Trang bị: ${c.name}`,{shopRevenuePct:'revenuePct',shopTipPct:'tipPct',generalLuckPct:'luckPct'});});
      for(const [id,item] of Object.entries(SOUVENIR_CONFIG)){
        if(!(v87411Num(gameState.souvenirs?.[id])>0)||!item.bonus)continue;
        if(id.startsWith('v874_') && !Object.keys(V874_NPC_PROFILES).some(nid=>V874_NPC_PROFILES[nid].rewardId===id&&v8741RewardActive(nid)))continue;
        from(item.bonus,`${item.icon} Lưu niệm: ${item.name}`);
      }
      for(const [npcId,e] of Object.entries(V8741_REWARD_EFFECTS)){
        if(!v8741RewardActive(npcId))continue;
        const reward=V874_NPC_PROFILES[npcId];
        const c={...e};delete c.type;delete c.label;
        // Farm/Barn relic bonuses are already included in SOUVENIR_CONFIG.
        ['seedSavePct','feedSavePct','farmGrowthPct'].forEach(k=>delete c[k]);
        from(c,`🎁 Kỷ vật: ${reward?.name||npcId}`);
      }
      const w=getActiveWorldEventConfig();
      if(w){from(w.effects,`${w.icon} Thời tiết: ${w.title}`,null,true);
        from(w.farmEffects,`${w.icon} Thời tiết: ${w.title}`,{growthPct:'farmGrowthPct',yield:'farmYield'},true);
        from(w.barnEffects,`${w.icon} Thời tiết: ${w.title}`,{growthPct:'barnGrowthPct',yield:'barnYield'},true);
      }
      const news=getActiveMarketNews();
      if(news){from(news.shopEffects,`📰 Tin chợ: ${news.headline||'Thông báo'}`,null,true);
        from(news.careerEffects?.[gameState.currentCareer],`📰 Tin theo nghề: ${news.headline||'Thông báo'}`,null,true);
      }
      return book;
    }
    function v87411Row(label,value,unit,negativeOverride=false){
      return `<div class="v87411-row"><span>${v87411Escape(label)}</span><span class="v87411-val${value<0||negativeOverride?' neg':''}">${v87411Format(value,unit)}</span></div>`;
    }
    function v87411Metric(book,key,effective,permanent,options={}){
      const [label,unit]=V87411_META[key]||[key,'pct'];
      const sources=book[key]||[];
      const rawPermanent=sources.filter(s=>!s.day).reduce((v,s)=>v+s.value,0);
      const day=sources.filter(s=>s.day).reduce((v,s)=>v+s.value,0);
      const capped=Number.isFinite(permanent)?permanent:rawPermanent;
      const capLost=Math.max(0,rawPermanent-capped);
      const display=Number.isFinite(effective)?effective:capped+day;
      const limiting=Math.max(0,(capped+day)-display);
      let status=display<-.00001?'neg':Math.abs(display)<.00001?'zero':'';
      const hasSource=sources.length>0||Math.abs(display)>.00001;
      return `<details class="v87411-metric"><summary><span class="v87411-name">${v87411Escape(label)} ${hasSource?'':'· chưa có hiệu ứng'}</span><b class="v87411-total ${status}">${v87411Format(display,unit)}</b></summary><div class="v87411-detail">${sources.length?sources.map(x=>v87411Row(x.name,x.value,unit)).join(''):'<div class="v87411-note">Chưa có nguồn cộng hoặc trừ chỉ số này.</div>'}${capLost>.00001?v87411Row('⛔ Phần vượt giới hạn bị loại',-capLost,unit,true):''}${limiting>.00001?v87411Row('⛔ Giới hạn tính thực tế',-limiting,unit,true):''}${(capLost>.00001||limiting>.00001)?'<div class="v87411-alert">Một phần hiệu ứng không cộng thêm được vì đã chạm giới hạn.</div>':''}${options.note?`<div class="v87411-note">${v87411Escape(options.note)}</div>`:''}<div class="v87411-row"><b>Thực tế đang áp dụng</b><b class="v87411-val${display<0?' neg':''}">${v87411Format(display,unit)}</b></div></div></details>`;
    }
    function v87411Section(title,tag,content,open=false){return `<details class="v87411-category" ${open?'open':''}><summary><span>${title}</span><small>${tag} ▾</small></summary>${content}</details>`;}
    function renderEffectDashboard(){
      const holder=document.getElementById('v87411-groups'),summary=document.getElementById('v87411-summary');
      if(!holder||!summary)return;
      ensureV6State();ensureGrowthState();ensureUtilityState();
      const book=v87411CollectSources();
      const growth=getGrowthBonuses(),day=getDailyEventBonuses(),utility=getUtilityBonuses(),npc=v8741Bonuses();
      const fb=getFarmBarnSouvenirBonuses(),fe=getFarmEventBonuses(),be=getBarnEventBonuses();
      const gp=(k,note)=>v87411Metric(book,k,v87411Num(growth[k])+v87411Num(day[k]),v87411Num(growth[k]),{note});
      const permanent=(k,v,note)=>v87411Metric(book,k,v,v,{note});
      const farm=(k,v,base,note)=>v87411Metric(book,k,v,base,{note});
      const world=getActiveWorldEventConfig(),news=getActiveMarketNews();
      const activeRelics=Object.keys(V8741_REWARD_EFFECTS).filter(id=>v8741RewardActive(id));
      const activeOther=Object.keys(gameState.souvenirs||{}).filter(id=>v87411Num(gameState.souvenirs[id])>0 && !!SOUVENIR_CONFIG[id]?.bonus && !id.startsWith('v874_'));
      const stages=(gameState.staff||[]).length;
      const currentDebuffs=Object.entries(book).flatMap(([key,sources])=>
        (V87411_META[key]&&key!=='farmSellPct'?sources.filter(e=>e.day&&e.value<0).map(e=>({key,label:V87411_META[key][0],unit:V87411_META[key][1],value:e.value})):[]));
      const walk=VILLAGE_ZONES[gameState.villageZone||'lane']||VILLAGE_ZONES.lane;
      const cost=getVillageWalkCost(walk),baseWalk=v87411Num(walk?.cost)||10;
      const netVillageReduction=baseWalk-cost;
      const currentTotalCost=v87DayCharges();
      summary.innerHTML=`<div class="v87411-chips"><div class="v87411-chip"><span>🏪 Doanh thu quầy</span><b>${v87411Format(growth.revenuePct+day.revenuePct,'pct')}</b></div><div class="v87411-chip"><span>💝 Tiền boa</span><b>${v87411Format(growth.tipPct+day.tipPct,'pct')}</b></div><div class="v87411-chip"><span>🌱 Tốc độ Vườn</span><b>${v87411Format(fb.farmGrowthPct+fe.growthPct,'pct')}</b></div><div class="v87411-chip"><span>🐾 Tốc độ Chuồng</span><b>${v87411Format(fb.barnGrowthPct+be.growthPct,'pct')}</b></div></div><p class="v87411-note">📅 Ngày ${Number(gameState.day)||1} • 🎁 ${activeRelics.length}/13 kỷ vật NPC đang kích hoạt • 🏆 ${activeOther.length} lưu niệm có bonus • 👥 ${stages} nhân viên. Chỉ số cập nhật khi mở hoặc bấm ↻.</p>${currentDebuffs.length?`<div class="v87411-alert">⚠️ <b>Đang có ${currentDebuffs.length} tác động giảm chỉ số hôm nay:</b><br>${currentDebuffs.map(x=>`${v87411Escape(x.label)} ${v87411Format(x.value,x.unit)}`).join(' · ')}</div>`:'<div class="v87411-note">☀️ Hôm nay không có hiệu ứng thời tiết/tin chợ làm giảm chỉ số.</div>'}`;
      const shop=[
        gp('revenuePct','Áp dụng lên giá bán của đơn được khách chấp nhận; tiền Xu được làm tròn theo đơn.'),
        gp('tipPct','Tính trên tiền boa của đơn hợp lệ; còn phụ thuộc số sao và tính cách khách.'),
        gp('patienceSec','Cộng vào thời gian chờ nền; từng NPC và sự cố có thể thay đổi thêm.'),
        gp('deliveryPct','Thưởng riêng cho đơn ship; tiền thực nhận còn cộng với doanh thu và sự kiện.'),
        gp('luckPct','Một số phép quay có thể giới hạn may mắn sau khi cộng thời tiết.'),
        gp('arrivalPct','Giá trị còn được điều chỉnh bởi độ nổi tiếng và giới hạn nhịp khách.'),
        permanent('rarePct',growth.rarePct,'Cơ hội xuất hiện khách hiếm còn phụ thuộc độ nổi tiếng và sự kiện.'),
        permanent('deliveryTimeSec',growth.deliveryTimeSec),
        permanent('orderSlots',growth.orderSlots),
        gp('opCost','Chi phí vận hành thêm ngoài chi phí nền 25 Xu + 4 Xu × cấp.')].join('');
      const farmPart=[
        farm('farmGrowthPct',fb.farmGrowthPct+fe.growthPct,fb.farmGrowthPct,'Cộng trực tiếp vào tốc độ tăng thời gian cây trồng. Thời tiết có thể làm giảm.'),
        farm('seedSavePct',Math.min(.75,fb.seedSavePct+fe.seedSavePct),fb.seedSavePct,'Tỷ lệ giữ hạt khi gieo, giới hạn 75% sau khi cộng thời tiết.'),
        farm('farmYield',fb.farmYield+fe.yield,fb.farmYield,'Sản lượng cộng vào mỗi lần thu hoạch.'),
        `<div class="v87411-note">💧 Tưới tự động do thời tiết hôm nay: <b>${fe.autoWater?'Có':'Không'}</b></div>`].join('');
      const barnPart=[farm('barnGrowthPct',fb.barnGrowthPct+be.growthPct,fb.barnGrowthPct,'Thời tiết có thể tăng hoặc giảm tốc độ.'),
        farm('feedSavePct',Math.min(.75,fb.feedSavePct+be.feedSavePct),fb.feedSavePct,'Xác suất không hao thức ăn khi cho ăn; tối đa 75%.'),
        farm('barnYield',fb.barnYield+be.yield,fb.barnYield,'Chưa bao gồm cộng thêm do độ thân thiết của từng vật nuôi.'),
        permanent('careAffectionBonus',utility.careAffectionBonus,'Mỗi lần chăm còn nhận thêm tình cảm nền từ gameplay.')].join('');
      const villagePart=[
        `<div class="v87411-alert">📍 ${v87411Escape(walk.name)}: giá gốc ${baseWalk}⚡ → <b>đang tốn ${cost}⚡ / lượt</b> (tiết kiệm thực tế ${netVillageReduction}⚡; giá tối thiểu 5⚡).</div>`,
        v87411Metric(book,'energyCostFlat',utility.energyCostFlat,utility.energyCostFlat,{note:'Tiện ích và trang bị, tối đa 5⚡ trước khi tính kỷ vật NPC.'}),
        permanent('villageEnergyFlat',npc.villageEnergyFlat),
        permanent('skillEnergyFlat',v8742SkillBonus('energyCostFlat'),'Giảm thẳng chi phí mỗi chuyến; mức tiết kiệm thực phụ thuộc sàn 5 năng lượng.'),
        permanent('regenReduceSec',utility.regenReduceSec,`Hồi 1⚡ sau ${getVillageRegenSeconds()} giây thay vì 45 giây; nhanh nhất 20 giây.`),
        permanent('villageLuckPct',utility.villageLuckPct,'Vận may Làng còn kết hợp với chỉ số may mắn từ phát triển Quán.'),
        permanent('villageCoinPct',utility.villageCoinPct)].join('');
      const marketMetrics=[
        permanent('seedDiscount',npc.seedDiscount,'Giảm theo tỷ lệ ở Chợ và Vườn; giá Xu làm tròn theo từng loại hạt.'),
        permanent('spiceDiscount',npc.spiceDiscount,'Chỉ áp dụng cốt lẩu, sốt và trà tại Chợ.'),
        permanent('packagingSaveXu',npc.packagingSaveXu,'Giảm 1 Xu/món cho bao bì có mã cup_, bowl_, tray_ tại Chợ.'),
        v87411Metric({...book,farmSellPct:(book.farmSellPct||[]).map(x=>({...x,value:x.value>0?1:0}))},'farmSellPct',npc.farmSellPct>0?1:0,npc.farmSellPct>0?1:0,{note:'Trong gameplay đây là cộng 1 Xu trên mỗi đơn vị bán nông sản, tối đa bằng giá mua trên chợ; không phải cộng 4% trực tiếp.'})
      ];
      // Replace the percent source label of the special farm sell effect with its real 1-Xu implementation.
      const sampleSeed='seed_wheat',sampleSpice='sauce_satay',samplePack='tray_box',sampleSell='crop_wheat';
      const origSeed=getCurrentMarketUnitPrice(sampleSeed),origSpice=getCurrentMarketUnitPrice(sampleSpice),origPack=getCurrentMarketUnitPrice(samplePack);
      const priceSample=`<div class="v87411-note">🧾 Ví dụ giá Chợ hôm nay (đã tính thị trường và giảm giá kỷ vật):<br>🌾 Hạt lúa mì: ${origSeed} → <b>${v8741MarketBuyUnitPrice(sampleSeed)} Xu</b> • 🌶️ Sa tế: ${origSpice} → <b>${v8741MarketBuyUnitPrice(sampleSpice)} Xu</b> • 📦 Hộp mang đi: ${origPack} → <b>${v8741MarketBuyUnitPrice(samplePack)} Xu</b>.<br>🧺 Bán lúa mì hiện tại: <b>${getMarketSellUnitPrice(sampleSell)} Xu/món</b>.</div>`;
      const beforeNews=`<div class="v87411-note">📰 ${news?v87411Escape(news.headline||'Tin chợ'):'Không có tin chợ'} • ${world?v87411Escape(world.icon+' '+world.title):'Chưa có thời tiết hôm nay'}.</div>`;
      const inactive=Object.keys(V8741_REWARD_EFFECTS).filter(id=>!v8741RewardActive(id));
      const locked=`<details class="v87411-category"><summary><span>🔒 Kỷ vật NPC chưa kích hoạt</span><small>${inactive.length} món ▾</small></summary><div class="v87411-note">Cần hoàn thành truyện và còn giữ kỷ vật. Chưa được tính vào tổng hiệu ứng.</div>${inactive.map(id=>`<div class="v87411-row"><span>${v87411Escape(V874_NPC_PROFILES[id]?.name||id)}</span><span>Chưa có</span></div>`).join('')}</details>`;
      holder.innerHTML=[
        v87411Section('🏪 Quán — doanh thu, boa, thời gian','10 chỉ số',shop,true),
         v87411Section('👩‍🍳 Kỹ năng nghề đang sử dụng','3 kỹ năng',v8744EffectMarkup()),
        v87411Section('🛒 Chợ & Kinh tế','4 chỉ số',marketMetrics.join('')+priceSample),
        v87411Section('🌿 Vườn — thu hoạch & gieo trồng','3 chỉ số',farmPart),
        v87411Section('🐄 Chuồng — sản xuất & thức ăn','4 chỉ số',barnPart),
        v87411Section('🚶 Làng — năng lượng & vận may','5 chỉ số',villagePart),
        v87411Section('🌤️ Ảnh hưởng hôm nay','thời tiết / tin chợ',beforeNews+
           `<div class="v87411-alert">💰 Chi phí khi qua ngày: <b>${currentTotalCost.opCosts} Xu vận hành + ${currentTotalCost.interestCost} Xu lãi vay</b> (nếu có nợ). Chi tiết: 25 Xu + ${Number(gameState.level)||1} × 4 Xu + ${v87411Format(growth.opCost,'xu')} nâng cấp/nhân viên + ${v87411Format(day.opCost,'xu')} thời tiết/tin chợ.</div>`+
           `<div class="v87411-note">${world?v87411Escape(world.shopText||''):'Không có hiệu ứng thời tiết'}<br>${world?v87411Escape(world.farmText||''):''}<br>${world?v87411Escape(world.barnText||''):''}</div>`),locked].join('');
    }

    function switchPhoneApp(appId) {
      ['delivery', 'soppi', 'social', 'progress', 'utility', 'games', 'bank', 'auction', 'effects'].forEach(a => {
        const view = document.getElementById(`phone-app-${a}`);
        const btn = document.getElementById(`papp-btn-${a}`);
        if (view) {
          if (a === appId) view.classList.remove('hidden');
          else view.classList.add('hidden');
        }
        if (btn) {
          btn.className = a === appId
            ? "py-1 rounded-2xl bg-white/10 text-white ring-1 ring-white/10 tap-scale flex flex-col items-center font-bold"
            : "py-1 rounded-2xl bg-transparent text-slate-300 tap-scale flex flex-col items-center font-bold";
        }
      });

      const appTitles = {
        delivery: 'Đơn Giao Hàng',
        soppi: 'Soppi • Mua & Săn Sale',
        social: 'Sổ Tay Cư Dân',
        progress: 'Phát Triển Quán',
        utility: 'Tiện Ích & Phụ Kiện',
        games: 'Góc Giải Trí',
        bank: 'Ví & Vay Vốn',
        auction: 'Sàn Đấu Giá Lưu Niệm',
        effects: 'Sổ Hiệu Ứng' 
      };
      const titleEl = document.getElementById('phone-current-app-title');
      if (titleEl) titleEl.innerText = appTitles[appId] || 'Thị Trấn OS';
      updatePhoneClock();
      playSound('click');
      if (appId === 'delivery') renderDeliveryApp();
      if (appId === 'soppi') {renderSoppiApp();v8731RenderShop();}
      if (appId === 'social') renderSocialApp();
      if (appId === 'progress') renderGrowthApp();
      if (appId === 'utility') renderUtilityShopApp();
      if (appId === 'games') renderGameCollectionSummary();
      if (appId === 'bank') renderBankApp();
      if (appId === 'auction') renderAuctionHouse();
      if (appId === 'effects') renderEffectDashboard();
    }

    // App Shipper Online
    function checkDeliveryOrderGeneration() {
      if (gameState.phase !== 'open' || phonePauseActive) return;

      deliveryCooldown -= 1;
      if (deliveryCooldown <= 0) {
        deliveryCooldown = Math.floor(Math.random() * 20) + 25;

        const staffBonus = getGrowthBonuses();
        if (activeOnlineOrders.length < 3 + (staffBonus.orderSlots || 0)) {
          const career = gameState.currentCareer;
          let dishName = "Trà Sữa Trân Châu";
          let reward = 65;

          if (career === 'noodle') {
            dishName = "Mì Kim Chi Bò Mỹ";
            reward = 80;
          } else if (career === 'streetfood') {
            dishName = "Mẹt Xiên Que Bơ Tỏi";
            reward = 55;
          }

          const newOrder = {
            id: Date.now(),
            customerName: `Khách Online #${Math.floor(Math.random() * 800) + 100}`,
            dishName: dishName,
            reward: reward,
            timeLeft: 35 + (staffBonus.deliveryTimeSec || 0),
            status: 'pending',
            recipeId: (getUnlockedRecipes(career).find(r=>r.name===dishName)||getUnlockedRecipes(career)[0])?.id||null
          };

          activeOnlineOrders.push(newOrder);
          playSound('serve');
          showToast(`Đơn Online mới (+${reward} Xu)!`, "📱");
          renderDeliveryApp();
        }
      }

      activeOnlineOrders.forEach((ord, idx) => {
        if (ord.status === 'pending') {
          ord.timeLeft -= 1;
          if (ord.timeLeft <= 0) {
            activeOnlineOrders.splice(idx, 1);
            playSound('error');
            showToast("Đơn online bị hủy do làm quá lâu!", "❌");
            renderDeliveryApp();
          }
        }
      });
    }

    function renderDeliveryApp() {
      const list = document.getElementById('delivery-orders-list');
      const stTxt = document.getElementById('delivery-status-txt');
      if (!list) return;

      if (gameState.phase !== 'open') {
        if (stTxt) stTxt.innerText = "Quán đang nghỉ ca. Mở quán để nhận đơn!";
        list.innerHTML = `
          <div class="text-center py-6 text-slate-500 text-xs">
            <span>💤 Hãy mở quán ở Tab Quán để nhận đơn trực tuyến!</span>
          </div>
        `;
        return;
      }

      if (stTxt) stTxt.innerText = "Đang trực tuyến 🟢 Sẵn sàng nhận đơn!";

      if (activeOnlineOrders.length === 0) {
        list.innerHTML = `
          <div class="text-center py-6 text-slate-500 text-xs">
            <span>📡 Đang chờ tín hiệu nổ đơn từ làng xóm...</span>
          </div>
        `;
        return;
      }

      list.innerHTML = '';
      activeOnlineOrders.forEach(ord => {
        list.innerHTML += `
          <div class="p-2 bg-slate-800 rounded-2xl border border-slate-700 space-y-1">
            <div class="flex items-center justify-between text-xs">
              <b class="text-amber-200">${ord.customerName}</b>
              <span class="text-emerald-400 font-black">+${ord.reward} Xu</span>
            </div>
            <div class="text-[9px] text-slate-300 flex items-center justify-between">
              <span>Món: ${ord.dishName}</span>
              <span class="text-rose-400 font-bold">⏱️ ${ord.timeLeft}s</span>
            </div>
            <button onclick="startPackOrderMinigame(${ord.id})" class="w-full py-1 bg-amber-500 hover:bg-amber-600 text-white font-bold text-[9px] rounded-xl shadow tap-scale flex items-center justify-center gap-1">
              <span>📦</span>
              <span>Đóng Hộp Giao Ngay</span>
            </button>
          </div>
        `;
      });
    }

    function startPackOrderMinigame(orderId) {
      const ord = activeOnlineOrders.find(o => o.id === orderId);
      if (!ord) return;
      packingTargetOrder = ord;
      packCurrentStep = 1;
      packTimeRemaining = 6.0;

      const modal = document.getElementById('modal-pack-minigame');
      modal.classList.remove('hidden');
      updatePackStepUI();

      clearInterval(packTimer);
      packTimer = setInterval(() => {
        packTimeRemaining -= 0.1;
        const timerTxt = document.getElementById('pack-timer-val');
        if (timerTxt) timerTxt.innerText = `⏱️ ${Math.max(0, packTimeRemaining).toFixed(1)}s`;

        if (packTimeRemaining <= 0) {
          clearInterval(packTimer);
          modal.classList.add('hidden');
          playSound('error');
          showToast("Đóng gói quá chậm! Đơn bị hủy!", "❌");
        }
      }, 100);
    }

    function updatePackStepUI() {
      const career = gameState.currentCareer || 'boba';
      let l1 = "🥤 1. Dập Nắp Ly", l2 = "🧋 2. Kèm Ống Hút To", l3 = "🛍️ 3. Túi Chữ T & Bill";
      if (career === 'noodle') {
        l1 = "🍲 1. Đậy Nắp Thố"; l2 = "🥢 2. Kèm Đũa & Muỗng"; l3 = "🛍️ 3. Túi Cách Nhiệt";
      } else if (career === 'streetfood') {
        l1 = "🥡 1. Lót Giấy Thấm Dầu"; l2 = "🍢 2. Kèm Xiên Tre & Tương"; l3 = "🛍️ 3. Buộc Túi Có Quai";
      }

      document.getElementById('pack-step-1-label').innerText = l1;
      document.getElementById('pack-step-2-label').innerText = l2;
      document.getElementById('pack-step-3-label').innerText = l3;

      const stepTxt = document.getElementById('pack-target-step-txt');
      const b1 = document.getElementById('btn-pack-1');
      const b2 = document.getElementById('btn-pack-2');
      const b3 = document.getElementById('btn-pack-3');
      const c1 = document.getElementById('pack-check-1');
      const c2 = document.getElementById('pack-check-2');
      const c3 = document.getElementById('pack-check-3');

      if (packCurrentStep === 1) {
        stepTxt.innerText = l1;
        b1.disabled = false; b1.className = 'w-full py-2 px-2.5 bg-amber-500 text-white font-bold text-xs rounded-xl shadow tap-scale text-left flex items-center justify-between';
        b2.disabled = true; b2.className = 'w-full py-2 px-2.5 bg-slate-200 text-slate-700 font-bold text-xs rounded-xl text-left flex items-center justify-between';
        b3.disabled = true; b3.className = 'w-full py-2 px-2.5 bg-slate-200 text-slate-700 font-bold text-xs rounded-xl text-left flex items-center justify-between';
        c1.innerText = '⏳'; c2.innerText = '🔒'; c3.innerText = '🔒';
      } else if (packCurrentStep === 2) {
        stepTxt.innerText = l2;
        b1.disabled = true; b1.className = 'w-full py-2 px-2.5 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl text-left flex items-center justify-between';
        b2.disabled = false; b2.className = 'w-full py-2 px-2.5 bg-amber-500 text-white font-bold text-xs rounded-xl shadow tap-scale text-left flex items-center justify-between';
        b3.disabled = true; b3.className = 'w-full py-2 px-2.5 bg-slate-200 text-slate-700 font-bold text-xs rounded-xl text-left flex items-center justify-between';
        c1.innerText = '✅'; c2.innerText = '⏳'; c3.innerText = '🔒';
      } else if (packCurrentStep === 3) {
        stepTxt.innerText = l3;
        b2.disabled = true; b2.className = 'w-full py-2 px-2.5 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl text-left flex items-center justify-between';
        b3.disabled = false; b3.className = 'w-full py-2 px-2.5 bg-amber-500 text-white font-bold text-xs rounded-xl shadow tap-scale text-left flex items-center justify-between';
        c2.innerText = '✅'; c3.innerText = '⏳';
      }
    }

    function handlePackStepClick(step) {
      if (step !== packCurrentStep) return;
      playSound('click');
      packCurrentStep += 1;

      if (packCurrentStep > 3) {
        clearInterval(packTimer);
        document.getElementById('modal-pack-minigame').classList.add('hidden');
        if (packingTargetOrder) packingTargetOrder.packTimeRemaining = Math.max(0, packTimeRemaining);
        dispatchShipperDelivery(packingTargetOrder);
      } else {
        updatePackStepUI();
      }
    }

    function cancelPackMinigame() {
      clearInterval(packTimer);
      document.getElementById('modal-pack-minigame').classList.add('hidden');
      packingTargetOrder = null;
    }

    function dispatchShipperDelivery(order) {
      playSound('serve');
      showToast(`Shipper đang giao đơn ${order.dishName}! 🛵`, "📦");

      const idx = activeOnlineOrders.findIndex(o => o.id === order.id);
      if (idx !== -1) activeOnlineOrders.splice(idx, 1);
      renderDeliveryApp();
      v87PendingShipments += 1;
      const v87ShipmentProfile = activeProfileId;
      const v87ShipmentDay = gameState.day;

      setTimeout(() => {
        // Delayed deliveries may not credit a different local account or game day.
        if (activeProfileId !== v87ShipmentProfile || !sessionGameActive || gameState.day !== v87ShipmentDay) return;
        v87PendingShipments = Math.max(0, v87PendingShipments - 1);
        const growthBonus = getGrowthBonuses();
        const eventBonus = getDailyEventBonuses();
        const finalReward = Math.max(1, Math.round(order.reward * (1 + growthBonus.revenuePct + (growthBonus.deliveryPct || 0) + eventBonus.revenuePct + eventBonus.deliveryPct)));
        gameState.coins += finalReward;
        v87532ShipCompleted(order,finalReward);
        const dailyStats = gameState.dailyStats || {};
        dailyStats.deliveryServed += 1;
        dailyStats.deliveryRev += finalReward;
        addExp(30);
        playSound('coin');
        const deliveryStars = Number(order.packTimeRemaining) >= 3.2 ? 5 : Number(order.packTimeRemaining) >= 1.4 ? 4 : 3;
        const deliveryComment = buildV85DeliveryReview(order, deliveryStars);
        gameState.reputation = ((gameState.reputation * gameState.ratingCount) + deliveryStars) / (gameState.ratingCount + 1);
        gameState.ratingCount += 1;
        if (!Array.isArray(dailyStats.ratings)) dailyStats.ratings = [];
        dailyStats.ratings.push(deliveryStars);
        addShopReview({ customerName: order.customerName, avatar:'🛵', stars:deliveryStars, comment:deliveryComment, accepted:true, personality:'Khách Online', voice:'Giao hàng', dishName:order.dishName || '' });
        renderShopReviews();
        showV85QuickReview(order.customerName, '🛵', deliveryStars, deliveryComment);
        updateHeaderStats();
        saveGameToStorage();
      }, 5000);
    }

    /* ===== V87.3.2 – một mã NPC, một hồ sơ, một nguồn quan hệ ===== */
    const V8732_JOBS={
      bebo:'Bạn nhỏ hàng xóm',baTu:'Người hàng xóm lớn tuổi',bacTam:'Người chăm cây cảnh',coUt:'Thợ may',
      mika:'Bạn thích khám phá và buôn bán',chuNam:'Thợ sửa chữa & vận chuyển',coLua:'Người làm vườn',
      bacCau:'Người trông coi bến nước',anhPho:'Thương nhân phố huyện',
      bacBinh:'Bảo vệ trường',coHanh:'Giáo viên chủ nhiệm',thayDung:'Giáo viên thể dục',
      thayMinh:'Hiệu trưởng',banLan:'Học sinh',banMai:'Học sinh yêu hội họa'
    };
    const V8732_JOB_GROUPS={
      bebo:'Học sinh',baTu:'Cư dân',bacTam:'Nông nghiệp',coUt:'Thủ công',mika:'Thương mại',
      chuNam:'Vận chuyển',coLua:'Nông nghiệp',bacCau:'Cư dân',anhPho:'Thương mại',
      bacBinh:'Giáo dục',coHanh:'Giáo dục',thayDung:'Giáo dục',thayMinh:'Giáo dục',banLan:'Học sinh',banMai:'Học sinh'
    };
    Object.assign(V8732_JOBS,{"chiNhai":"Thợ làm bánh","coSau":"Chủ sạp rau","anhKhai":"Chủ quầy gia vị","chuLoc":"Người bán đồ cũ","bacPhuc":"Người chăm công viên","chiHa":"Chủ xe nước công viên","anhKhoa":"Nhạc công","chiDiem":"Người tổ chức sự kiện","coTuyet":"Nhân viên bán vé","anhTin":"Shipper","bacSiAn":"Bác sĩ trạm xá","yTaLinh":"Điều dưỡng","ongKhang":"Người nghiên cứu thảo dược"});
    Object.assign(V8732_JOBS,{"baMan":"Người giữ sử làng","anhVinh":"Nghệ nhân trống hội","coGiang":"Cán bộ văn hóa","chiNhien":"Chủ vườn sim","anhDuy":"Nhiếp ảnh gia","bacThach":"Hướng dẫn viên đường rừng","chiLy":"Chủ quầy nướng phố đêm","anhSoc":"Nghệ sĩ đường phố","coYen":"Nghệ nhân đồ thủ công","anhQuan":"Kỹ thuật viên sửa máy","chiNgoc":"Chuyên viên tài chính","thayTri":"Giáo viên mỹ thuật"});
    Object.assign(V8732_JOB_GROUPS,{"chiNhai":"Ẩm thực","coSau":"Thương mại","anhKhai":"Thương mại","chuLoc":"Thương mại","bacPhuc":"Nông nghiệp","chiHa":"Ẩm thực","anhKhoa":"Nghệ thuật","chiDiem":"Sự kiện","coTuyet":"Vận chuyển","anhTin":"Vận chuyển","bacSiAn":"Y tế","yTaLinh":"Y tế","ongKhang":"Nông nghiệp"});
    Object.assign(V8732_JOB_GROUPS,{"baMan":"Văn hóa","anhVinh":"Văn hóa","coGiang":"Văn hóa","chiNhien":"Nông nghiệp","anhDuy":"Nông nghiệp","bacThach":"Nông nghiệp","chiLy":"Ẩm thực","anhSoc":"Nghệ thuật","coYen":"Thủ công","anhQuan":"Kỹ thuật","chiNgoc":"Thương mại","thayTri":"Nghệ thuật"});
    let currentSocialFilter='village';
    const v8732Filters={zone:'all',job:'all',status:'all',story:'all',search:''};
    let v8732ProfileId=null;
    function v8732Safe(str){return escapeHtmlText(String(str??''));}
    function v8732ResidentIds(){
      return [...new Set(Object.values(V873_HOME_ROSTER).flat())].filter(id=>!!VILLAGE_NPC_LIBRARY[id]);
    }
    function v8732Ensure(){
      if(!gameState.v8732ContactJournal||typeof gameState.v8732ContactJournal!=='object'||Array.isArray(gameState.v8732ContactJournal))
        gameState.v8732ContactJournal={village:{},customers:{}};
      const j=gameState.v8732ContactJournal;
      if(!j.village||typeof j.village!=='object')j.village={};
      if(!j.customers||typeof j.customers!=='object')j.customers={};
      // Migrating from V87.2.1/V87.3.1: only proven encounters count as met.
      for(const id of v8732ResidentIds()){
        const old=gameState.v872Npcs?.[id];
        const story=Number(gameState.villageStoryFlags?.[`v84_${id}_stage`])||0;
        const bond=Number(gameState.villageNpcBonds?.[id])||0;
        const giftDay=Number(gameState.v8731GiftDays?.[id])||0;
        const evidence=!!(old && (Number(old.lastTalkDay)>0 || (old.memories||[]).length>0 || old.pending)) || story>0 || bond>0 || giftDay>0;
        if(!j.village[id] && evidence)
          j.village[id]={metDay:0,lastSeenDay:Number(old?.lastTalkDay)||0,gifts:[]}; // old saves cannot reliably reveal first meeting day
        if(j.village[id] && !Array.isArray(j.village[id].gifts))j.village[id].gifts=[];
      }
      // A legacy review with an exact customer name is evidence of a real visit.
      const reviewed=new Set((gameState.reviews||[]).map(r=>r?.customerName).filter(Boolean));
      for(const npc of NPC_MASTER_LIST){
        if(!j.customers[npc.id] && reviewed.has(npc.name)) j.customers[npc.id]={metDay:0,lastSeenDay:0,source:'review'};
      }
      return j;
    }
    function v8732MarkMet(id,where){
      if(!VILLAGE_NPC_LIBRARY[id])return;
      const book=v8732Ensure().village;
      const day=Number(gameState.day)||1;
      if(!book[id])book[id]={metDay:day,lastSeenDay:day,lastSeenZone:where||VILLAGE_NPC_LIBRARY[id].home||'lane',gifts:[]};
      else{book[id].lastSeenDay=day;book[id].lastSeenZone=where||book[id].lastSeenZone;}
    }
    function v8732MarkCustomer(id){
      if(!NPC_MASTER_LIST.some(n=>n.id===id))return;
      const j=v8732Ensure().customers,day=Number(gameState.day)||1;
      if(!j[id])j[id]={metDay:day,lastSeenDay:day,source:'counter'};
      else j[id].lastSeenDay=day;
    }
    function v8732TrackGift(npcId,itemId){
      if(!VILLAGE_NPC_LIBRARY[npcId])return;
      v8732MarkMet(npcId,gameState.villageZone||VILLAGE_NPC_LIBRARY[npcId].home);
      const entry=v8732Ensure().village[npcId];
      entry.gifts.unshift({id:itemId,day:Number(gameState.day)||1});
      entry.gifts=entry.gifts.slice(0,12);
    }
    function v8732ChangeSearch(value){v8732Filters.search=String(value||'').trim().toLocaleLowerCase('vi');v8732ProfileId=null;renderSocialApp();}
    function v8732ChangeFilter(key,value){if(Object.hasOwn(v8732Filters,key))v8732Filters[key]=value;v8732ProfileId=null;renderSocialApp();}
    function filterSocialGroup(group){currentSocialFilter=group==='customer'?'customer':'village';v8732ProfileId=null;renderSocialApp();}
    function v8732Impression(id){
      const m=gameState.v872Npcs?.[id];
      const trust=Number.isFinite(Number(m?.trust))?Number(m.trust):45;
      const anger=Number(m?.anger)||0;
      const affection=Number(gameState.villageNpcBonds?.[id])||0;
      if(anger>=50||trust<28)return {id:'bad',name:'💢 Ấn tượng xấu',tone:'bad'};
      if(affection>=65&&trust>=65&&anger<=20)return {id:'close',name:'💚 Thân thiết',tone:'good'};
      if(trust>=60&&anger<25)return {id:'good',name:'😊 Ấn tượng tốt',tone:'good'};
      if(anger>=28)return {id:'wary',name:'😕 Dè chừng',tone:'wary'};
      return {id:'neutral',name:'🙂 Bình thường',tone:'neutral'};
    }
    function v8732StoryInfo(id){
      const total=(V84_NPC_CHAPTERS[id]||[]).length;
      const progress=typeof v84StoryStage==='function'?v84StoryStage(id):0;
      const pending=!!gameState.v872Npcs?.[id]?.pending;
      return {total,progress,pending,done:total>0&&progress>=total&&!pending};
    }
    
    // V87.3.3 portraits: used only for met NPCs in the phone and direct conversation.
    const V8733_NPC_PORTRAITS = {
      // V87.3.4 — ten new approved standalone portraits.
      bacTam: 'assets/images/172_bactam_60d77c7fce.webp',
      coUt: 'assets/images/173_cout_4a923d4112.webp',
      bacBinh: 'assets/images/174_bacbinh_c049327de6.webp',
      thayDung: 'assets/images/175_thaydung_9becc9c7e9.webp',
      thayMinh: 'assets/images/176_thayminh_e75bd96c1d.webp',
      banMai: 'assets/images/177_banmai_b6c4bd6220.webp',
      mika: 'assets/images/178_mika_65bf2ec97b.webp',
      coLua: 'assets/images/179_colua_a0a649721f.webp',
      bacCau: 'assets/images/180_baccau_4583f050dd.webp',
      anhPho: 'assets/images/181_anhpho_79a1f13c1f.webp',

      bebo: 'assets/images/182_bebo_3c6533c79e.webp',
      baTu: 'assets/images/183_batu_6f5ad99fcc.webp',
      chuNam: 'assets/images/184_chunam_212ec0a33b.webp',
      coHanh: 'assets/images/185_cohanh_84351db407.webp',
      banLan: 'assets/images/186_banlan_3808750eac.webp',
    };
    const V8733_PLAYER_PORTRAITS = {male: 'assets/images/187_male_546ebb6f07.webp', female: 'assets/images/188_female_a2ff2a3122.webp'};
    Object.assign(V8733_NPC_PORTRAITS,{chiNhai:"assets/images/189_chinhai_c2f92c0c78.webp",coSau:"assets/images/190_cosau_75a7fcc460.webp",anhKhai:"assets/images/191_anhkhai_5e7aaf41e2.webp",chuLoc:"assets/images/192_chuloc_116074dfa9.webp",bacPhuc:"assets/images/193_bacphuc_390b1cd295.webp",chiHa:"assets/images/194_chiha_473059ebee.webp",anhKhoa:"assets/images/195_anhkhoa_9b2395372f.webp",chiDiem:"assets/images/196_chidiem_7cf6866c71.webp",coTuyet:"assets/images/197_cotuyet_72dfa720b9.webp",anhTin:"assets/images/198_anhtin_9909253d8e.webp",bacSiAn:"assets/images/199_bacsian_8269b72238.webp",yTaLinh:"assets/images/200_ytalinh_17a3b42516.webp",ongKhang:"assets/images/201_ongkhang_bdb8c51dc5.webp"});
    /* V87.5: NPC dialog portraits, matching the approved full-body sheets. */
    Object.assign(V8733_NPC_PORTRAITS,{"baMan":"assets/images/202_baman_6d558043ec.webp","anhVinh":"assets/images/203_anhvinh_c6923ba710.webp","coGiang":"assets/images/204_cogiang_6b78551582.webp","chiNhien":"assets/images/205_chinhien_eb256264af.webp","anhDuy":"assets/images/206_anhduy_aafeb33261.webp","bacThach":"assets/images/207_bacthach_1f1c94b394.webp","chiLy":"assets/images/208_chily_63dceeb596.webp","anhSoc":"assets/images/209_anhsoc_1ffdb5d64a.webp","coYen":"assets/images/210_coyen_ac79c092eb.webp","anhQuan":"assets/images/211_anhquan_464a130c96.webp","chiNgoc":"assets/images/212_chingoc_898b84e2d8.webp","thayTri":"assets/images/213_thaytri_f0551dab89.webp"});
     function v8732Portrait(id,met){
      if(!met)return '<span class="v8732-mystery">?</span>';
      const npc=VILLAGE_NPC_LIBRARY[id];
      const src=V8733_NPC_PORTRAITS[id] || VILLAGE_NPC_ART[id];
      return src?`<img class="v8732-portrait-img" src="${src}" alt="Chân dung ${v8732Safe(npc.name)}" loading="lazy">`:
        `<span>${npc.accent||'🙂'}</span>`;
    }
    function v8732PersonMarkup(id){
      const npc=VILLAGE_NPC_LIBRARY[id],home=npc.home||'lane',met=!!v8732Ensure().village[id];
      const impres=met?v8732Impression(id):null,st=v8732StoryInfo(id);
      const fullName=met?npc.name:'Cư dân chưa gặp',
        role=met?(V8732_JOBS[id]||npc.desc.split('.')[0]):'Nghề nghiệp chưa biết',
        subtitle=met?`${role} • ${VILLAGE_ZONES[home]?.name||'Làng'}`:`📍 ${VILLAGE_ZONES[home]?.name||'Chưa rõ'} • Chờ làm quen`;
      return `<button type="button" class="v8732-contact ${met?'':'v8732-unseen'}" onclick="v8732OpenProfile('${id}')">
        <span class="v8732-portrait">${v8732Portrait(id,met)}</span>
        <span class="v8732-person-body"><b>${v8732Safe(fullName)}</b><small>${v8732Safe(subtitle)}</small>
          <span class="v8732-person-tags"><em class="${impres?.tone||'neutral'}">${met?impres.name:'❔ Chưa gặp'}</em><em>📖 ${met?st.progress+'/'+st.total:'?/'+st.total}${met&&st.done?' ✓':''}</em>${met&&st.pending?'<em class="wary">📬 Có chuyện chờ</em>':''}</span>
        </span><span class="v8732-chevron">›</span></button>`;
    }
    function v8732OpenProfile(id){v8732ProfileId=id;renderSocialApp();document.getElementById('v8732-profile')?.scrollIntoView({block:'nearest'});}
    function v8732CloseProfile(){v8732ProfileId=null;renderSocialApp();}
    function v8732ProfileMarkup(id){
      const npc=VILLAGE_NPC_LIBRARY[id],item=v8732Ensure().village[id],met=!!item;
      if(!npc)return '';
      const home=VILLAGE_ZONES[npc.home]?.name||'Làng';
      if(!met)return `<div class="v8732-detail"><button type="button" class="v8732-back" onclick="v8732CloseProfile()">‹ Danh bạ</button><div class="v8732-unknown-hero">❔<b>Một người chưa quen</b><span>Hãy khám phá ${v8732Safe(home)} và trò chuyện với cư dân để mở hồ sơ. Sự xuất hiện của họ còn phụ thuộc từng ngày.</span></div></div>`;
      const m=gameState.v872Npcs?.[id]||{},st=v8732StoryInfo(id),aff=Math.max(0,Math.min(100,Number(gameState.villageNpcBonds?.[id])||0));
      const trust=Math.max(0,Math.min(100,Number.isFinite(Number(m.trust))?Number(m.trust):45));
      const anger=Math.max(0,Math.min(100,Number(m.anger)||0));
      const impression=v8732Impression(id);
      const chapters=(V84_NPC_CHAPTERS[id]||[]).map((ch,i)=>`<div class="v8732-chapter"><span>${i<st.progress?'✅':st.pending&&i===st.progress?'📬':'🔒'}</span><span>Chương ${i+1}: ${i<=st.progress?v8732Safe(ch[1]):'Chưa khám phá'}</span></div>`).join('');
      const memories=(m.memories||[]).slice(0,5).map(x=>`<p>Ngày ${Number(x.day)||'?'} · ${v8732Safe(x.text)}</p>`).join('')||'<p>Chưa có ký ức được ghi lại.</p>';
      const gifts=(item.gifts||[]).slice(0,6).map(g=>`<span>${v8732Safe(V8731_ITEMS[g.id]?.icon||'🎁')} ${v8732Safe(V8731_ITEMS[g.id]?.name||'Món quà')} <small>Ngày ${Number(g.day)||'?'}</small></span>`).join('')||'<span>Chưa có thông tin món quà (các phiên bản cũ có thể chưa lưu chi tiết).</span>';
      const tastes=(V8731_TASTE[id]||[]).map(tag=>({cute:'🎀 Dễ thương',study:'📚 Học tập',outdoor:'🏃 Vận động',fun:'🧸 Đồ chơi',heart:'💌 Tình cảm',handmade:'🧵 Thủ công',nature:'🌱 Thiên nhiên',food:'🍪 Đồ ăn',nostalgia:'🕰️ Hoài niệm'})[tag]||tag).join(' • ');
      const award=Object.entries(V873_HOME_ROSTER).find(([zone,ids])=>ids.includes(id));
      const hasZonePrize=['lane','school'].includes(npc.home),rewardDone=!!gameState.v873Rewards?.[npc.home];
       const uniquePrize=V874_NPC_PROFILES[id],uniqueClaimed=!!gameState.v874NpcRewards?.[id];
      return `<div class="v8732-detail">
        <button type="button" class="v8732-back" onclick="v8732CloseProfile()">‹ Danh bạ</button>
        <div class="v8732-detail-hero"><span class="v8732-portrait">${v8732Portrait(id,true)}</span><span><b>${v8732Safe(npc.name)}</b><small>${v8732Safe(V8732_JOBS[id]||npc.desc.split('.')[0])} • ${v8732Safe(home)}</small><em class="${impression.tone}">${impression.name}</em></span></div>
        <div class="v8732-relations">${[['💚 Thân thiết',aff,'#32ad7d'],['🤝 Tin tưởng',trust,'#65bc79'],['💢 Bực tức',anger,'#e19069']].map(([label,v,color])=>`<div><span>${label}</span><b>${v}/100</b><i><u style="width:${v}%;background:${color}"></u></i></div>`).join('')}</div>
        <div class="v8732-detail-stats"><span>👋 Gặp lần đầu: <b>${item.metDay?'Ngày '+item.metDay:'Đã gặp trước bản này'}</b></span><span>📅 Gần nhất: <b>${item.lastSeenDay?'Ngày '+item.lastSeenDay:'Trước bản này'}</b></span></div>
        <div class="v8732-section"><b>📖 Cốt truyện (${st.progress}/${st.total}) ${st.done?'• Hoàn thành':'• '+(st.pending?'Cần giải quyết':'Đang khám phá')}</b>${chapters||'<p>Đang chờ mở rộng cốt truyện.</p>'}${st.pending?`<p class="v8732-note">📬 Có câu chuyện đang chờ giải quyết từ ngày ${Number(m.pending?.dayAvailable)||'?'}. Hãy gặp lại tại ${v8732Safe(home)}.</p>`:''}
          ${uniquePrize?`<p class="v8732-note">${uniquePrize.rewardIcon} Quà độc quyền: ${v8732Safe(uniquePrize.rewardName)} • ${uniqueClaimed?'Đã nhận':'Hoàn thành cốt truyện để nhận một lần'}<br>✨ ${v8732Safe(v8741RelicStatus(id))}</p>`:hasZonePrize?`<p class="v8732-note">🏆 Quà hoàn thành toàn khu: ${rewardDone?'Đã nhận':'Chưa nhận • cần hoàn thành truyện mọi cư dân'}</p>`:'<p class="v8732-note">🎁 Phần thưởng cốt truyện toàn khu: sẽ bổ sung ở các bản đồ tiếp theo.</p>'}</div>
        <div class="v8732-section"><b>🧠 Ký ức gần đây</b>${memories}</div>
        <div class="v8732-section"><b>🎀 Quà đã tặng</b><div class="v8732-gifts">${gifts}</div><p class="v8732-note">${aff>=35?'Sở thích đã biết: '+v8732Safe(tastes):'Thân thiết hơn để hiểu rõ sở thích quà tặng.'}</p></div>
        <p class="v8732-footnote">Lịch xuất hiện thay đổi mỗi ngày; hãy tới đúng quê nhà để tiếp tục cốt truyện.</p>
      </div>`;
    }
    function renderSocialApp(){
      const list=document.getElementById('social-npc-list');if(!list)return;
      const journal=v8732Ensure();
      const all=v8732ResidentIds(),metCount=all.filter(id=>!!journal.village[id]).length;
      const counter=document.getElementById('v8732-progress-count');
      if(counter)counter.textContent=currentSocialFilter==='customer'?`${Object.keys(journal.customers).length} khách đã ghé`:`${metCount}/${all.length} đã gặp`;
      for(const which of ['village','customer'])document.getElementById(`v8732-tab-${which}`)?.classList.toggle('active',currentSocialFilter===which);
      const search=document.getElementById('v8732-search');if(search && search.value!==v8732Filters.search)search.value=v8732Filters.search;
      const sel=document.getElementById('v8732-zone-filter');
      if(sel){const zones=Object.keys(V873_HOME_ROSTER);const opts='<option value="all">📍 Mọi khu</option>'+zones.map(z=>`<option value="${z}">${v8732Safe(VILLAGE_ZONES[z]?.name||z)}</option>`).join('');if(sel.innerHTML!==opts)sel.innerHTML=opts;sel.value=v8732Filters.zone;}
      const jobSelect=document.getElementById('v8732-job-filter');
      if(jobSelect){const roles=[...new Set(Object.values(V8732_JOB_GROUPS))];const opts='<option value="all">💼 Mọi nghề</option>'+roles.map(role=>`<option value="${v8732Safe(role)}">${v8732Safe(role)}</option>`).join('');if(jobSelect.innerHTML!==opts)jobSelect.innerHTML=opts;jobSelect.value=v8732Filters.job;}
      for(const key of ['status','story']){const el=document.getElementById(`v8732-${key}-filter`);if(el)el.value=v8732Filters[key];}
      for(const el of document.querySelectorAll('#v8732-zone-filter,#v8732-job-filter,#v8732-status-filter,#v8732-story-filter'))el.disabled=currentSocialFilter==='customer';
      const profile=document.getElementById('v8732-profile');
      if(profile){const show=currentSocialFilter==='village' && !!v8732ProfileId;profile.classList.toggle('hidden',!show);profile.innerHTML=show?v8732ProfileMarkup(v8732ProfileId):'';}
      const hint=document.getElementById('v8732-list-summary');
      if(currentSocialFilter==='customer'){
        if(hint)hint.textContent='Khách Quán và cư dân Làng có hồ sơ riêng. Chỉ đánh dấu đã gặp khi khách thực sự đến Quán.';
        const customers=NPC_MASTER_LIST.filter(n=>isNpcUnlocked(n)).filter(n=>!v8732Filters.search || (journal.customers[n.id]?`${n.name} ${n.role}`:'khách chưa gặp').toLocaleLowerCase('vi').includes(v8732Filters.search));
        list.innerHTML=customers.map(n=>{const met=!!journal.customers[n.id];return `<div class="v8732-contact"><span class="v8732-portrait">${met?n.avatar:'❔'}</span><span class="v8732-person-body"><b>${met?v8732Safe(n.name):'Khách chưa gặp'}</b><small>${met?v8732Safe(n.role):'Ghé Quán để làm quen'}</small><span class="v8732-person-tags"><em>${met?'✅ Đã gặp':'❔ Chưa gặp'}</em></span></span><button class="v8732-customer-chat" type="button" ${met?'':'disabled'} onclick="chatWithNPC('${n.id}')">💬</button></div>`;}).join('')||'<div class="v8732-empty">Chưa có khách nào phù hợp.</div>';
        return;
      }
      let items=all.filter(id=>{
        const n=VILLAGE_NPC_LIBRARY[id],met=!!journal.village[id],im=met?v8732Impression(id):null,st=v8732StoryInfo(id);
        if(v8732Filters.zone!=='all' && n.home!==v8732Filters.zone)return false;
        if(v8732Filters.job!=='all' && V8732_JOB_GROUPS[id]!==v8732Filters.job)return false;
        if(v8732Filters.status==='met'&&!met || v8732Filters.status==='unmet'&&met)return false;
        if(['good','bad','close'].includes(v8732Filters.status) && (!met||im.id!==v8732Filters.status))return false;
        if(v8732Filters.story==='done'&&(!met||!st.done))return false;
        if(v8732Filters.story==='active'&&(!met||!st.progress||st.done))return false;
        if(v8732Filters.story==='pending'&&(!met||!st.pending))return false;
        if(v8732Filters.search){const t=met?`${n.name} ${V8732_JOBS[id]||n.desc||''} ${VILLAGE_ZONES[n.home]?.name||''}`:`cư dân chưa gặp ${VILLAGE_ZONES[n.home]?.name||''}`;if(!t.toLocaleLowerCase('vi').includes(v8732Filters.search))return false;}
        return true;
      });
      items.sort((a,b)=>{
        const av=!!journal.village[a],bv=!!journal.village[b];
        if(av!==bv)return av?-1:1;
        return Object.keys(V873_HOME_ROSTER).indexOf(VILLAGE_NPC_LIBRARY[a].home)-Object.keys(V873_HOME_ROSTER).indexOf(VILLAGE_NPC_LIBRARY[b].home);
      });
      if(hint)hint.textContent=`${items.length} hồ sơ • ${metCount} đã làm quen • ${all.length-metCount} đang chờ gặp. Mỗi NPC có nghề, nơi ở và cốt truyện riêng.`;
      list.innerHTML=items.map(v8732PersonMarkup).join('')||'<div class="v8732-empty">Không tìm thấy cư dân phù hợp. Thử đổi bộ lọc nhé.</div>';
    }

    function chatWithNPC(npcId) {
      const npc = NPC_MASTER_LIST.find(n => n.id === npcId);
      if (!npc) return;
      playSound('click');
      const quote = npc.careerPrefs[gameState.currentCareer] || "Chúc tiệm của bạn luôn đông khách nhé!";
      showToast(`${npc.name}: "${quote}"`, npc.avatar);
    }


    /* === V87.5.3.2 • Nhân viên thực chiến, báo cáo minh bạch & phí tuyển hợp lý === */
    const V87532_ORIGINAL_HIRE = {host_lan:900,cashier_phuc:1800,kitchen_ti:2400,ship_khoa:3600,promoter_ngoc:5200,manager_vy:8500};
    const V87532_CAPS = {host_lan:4,kitchen_ti:4,ship_khoa:4};
    function v87532Ensure(){
      if(!gameState.staffOps||typeof gameState.staffOps!=='object'||Array.isArray(gameState.staffOps))gameState.staffOps={};
      const o=gameState.staffOps;
      if(!o.settings||typeof o.settings!=='object')o.settings={};
      for(const id of ['host_lan','ship_khoa'])if(typeof o.settings[id]!=='boolean')o.settings[id]=true;
      if(!o.today||o.today.day!==gameState.day)o.today={day:gameState.day,stats:{},prep:0,customerCount:0,shipJobs:{},pendingServe:null};
      if(!o.today.stats||typeof o.today.stats!=='object')o.today.stats={};
      if(!o.today.shipJobs||typeof o.today.shipJobs!=='object')o.today.shipJobs={};
      if(!Array.isArray(o.history))o.history=[];
      if(!o.migrationDone){
        let refund=0;
        for(const id of gameState.staff||[])if(STAFF_CONFIG[id])refund+=Math.max(0,V87532_ORIGINAL_HIRE[id]-STAFF_CONFIG[id].hireCost);
        if(refund){gameState.coins+=refund;v87531PushHistory(`Hoàn ${refund} Xu chênh lệch phí tuyển nhân viên cũ.`);}
        o.migrationDone=true;
      }
      return o;
    }
    function v87532Active(id){return !!gameState.staff?.includes(id)&&v87531Factor(id)>0;}
    function v87532Cap(id){
      const p=v87531Person(id);const boost=p.trust>=85&&p.morale>=70?1:0;
      return (V87532_CAPS[id]||0)+boost;
    }
    function v87532Stat(id){const stats=v87532Ensure().today.stats;
      if(!stats[id])stats[id]={jobs:0,revenue:0,saved:0,cost:0};
      return stats[id];
    }
    function v87532Record(id,revenue=0,saved=0){const st=v87532Stat(id);st.jobs++;st.revenue+=Math.max(0,Math.round(revenue));st.saved+=Math.max(0,Math.round(saved));}
    function v87532Toggle(id){
      if(!['host_lan','ship_khoa'].includes(id))return;
      const o=v87532Ensure();o.settings[id]=!o.settings[id];
      if(id==='host_lan'&&!o.settings[id])o.today.pendingServe=null;
      showToast(o.settings[id]?'Đã bật làm việc tự động.':'Đã tắt tự động, bạn có thể thao tác thủ công.','👥');
      v87532RenderBoard();renderGrowthStaff();saveGameToStorage(false);
    }
    function v87532Req(order,career){
      const req={};const add=(k,n)=>{if(k&&Number(n)>0)req[k]=(req[k]||0)+Number(n);};
      if(career==='streetfood'){
        add(({plate:'tray_plate',basket:'tray_basket',box:'tray_box'})[order.tray],1);add(order.sauce,1);
        for(const [k,q]of Object.entries(order.skewerCounts||{}))add(k,q);
      }else{add(order.container,1);add(order.base,1);for(const k of order.toppings||[])add(k,1);}
      return req;
    }
    function v87532HasIngredients(req,career){
      return Object.entries(req).every(([k,n])=>!!ITEM_DICTIONARY[k]&&isItemStoryUnlocked(k,career)&&(Number(gameState.inventory[k])||0)>=n);
    }
    function v87532UseIngredients(req){for(const [k,n]of Object.entries(req))gameState.inventory[k]=Math.max(0,(Number(gameState.inventory[k])||0)-n);}
    function v87532Price(order,customer){return Math.max(1,Math.floor(Number(order.maxPrice)||Number(customer?.budget)||1)*1);}
    function v87532BuildDish(order){
      const dish={...JSON.parse(JSON.stringify(order)),listedPrice:v87532Price(order,{budget:order.maxPrice}),isShaken:true,isCooked:true,fryState:order.requiredFryState||'perfect'};
      return dish;
    }
    function v87532AutoServe(){
      const o=v87532Ensure(),t=o.today;
      if(!o.settings.host_lan||!v87532Active('host_lan')||gameState.phase!=='open'||phonePauseActive||!currentCustomer){t.pendingServe=null;return;}
      const customer=currentCustomer,order=customer.order;if(!order||order.career!==gameState.currentCareer)return;
      if((v87532Stat('host_lan').jobs||0)>=v87532Cap('host_lan'))return;
      const req=v87532Req(order,gameState.currentCareer);
      if(!v87532HasIngredients(req,gameState.currentCareer)){t.pendingServe=null;return;}
      if(!t.pendingServe||t.pendingServe.key!==customer.npcId+':'+customer.quote){
        t.pendingServe={key:customer.npcId+':'+customer.quote,remaining:v87532Active('kitchen_ti')?5:9};
      }
      t.pendingServe.remaining-=1;
      if(t.pendingServe.remaining>0)return;
      t.pendingServe=null;
      const dish=v87532BuildDish(order);
      const validation=validatePlayerDishAgainstOrder(dish,order);
      const decision=evaluateCustomerDecision(validation,customer,dish.listedPrice);
      if(!decision.accepted||!decision.exact)return;
      if(!v87532HasIngredients(req,gameState.currentCareer))return;
      // Tí chuẩn bị đúng nguyên liệu; xác suất tiết kiệm duy nhất 1 topping, không tự tạo hàng mới.
      let saved=0;const ti=v87532Active('kitchen_ti')?v87532Stat('kitchen_ti'):null;
      if(ti&&ti.jobs<v87532Cap('kitchen_ti')&&Math.random()<.22){
        const candidates=Object.keys(req).filter(k=>k!==order.container&&k!==order.base&&k!==order.sauce&&!k.startsWith('tray_'));
        if(candidates.length){const k=candidates[0];req[k]=Math.max(0,req[k]-1);saved=1;}
      }
      v87532UseIngredients(req);
      if(ti&&ti.jobs<v87532Cap('kitchen_ti'))v87532Record('kitchen_ti',0,saved);
      clearInterval(customerPatienceTimer);
      const growth=getGrowthBonuses(),ev=getDailyEventBonuses();
      const careerBonus=v8744CareerBonus(gameState.currentCareer,dish,decision.stars,true);
      const price=dish.listedPrice;
      const earned=Math.max(1,Math.round(price*(1+Math.min(.68,growth.revenuePct+careerBonus.revenuePct)+ev.revenuePct)));
      let tip=decision.stars>=5?Math.floor(earned*.15)+5:decision.stars===4?Math.floor(earned*.05):0;
      tip=Math.round(tip*(1+Math.min(.65,growth.tipPct+careerBonus.tipPct+v8745MasteryTip(gameState.currentCareer,order.recipeId,true,true,decision.stars))+ev.tipPct)*Math.max(.5,Number(customer.tipMod)||1));
      gameState.coins+=earned+tip;
      v87532Record('host_lan',earned+tip,saved);
      v8744RecordOrder(gameState.currentCareer);v8753OnOrder(decision.stars,true);
      addExp(20+decision.stars*5);
      v8745OnDishServed(customer,dish,decision);
      gameState.reputation=((gameState.reputation*gameState.ratingCount)+decision.stars)/(gameState.ratingCount+1);gameState.ratingCount++;
      const ds=gameState.dailyStats||{};
      ds.counterServed=(ds.counterServed||0)+1;ds.counterRev=(ds.counterRev||0)+earned;ds.tipsRev=(ds.tipsRev||0)+tip;
      if(!Array.isArray(ds.ratings))ds.ratings=[];ds.ratings.push(decision.stars);
      addShopReview({customerName:customer.name,avatar:'🙋‍♀️',stars:decision.stars,comment:'Lan phục vụ đúng món, nhanh nhẹn và chu đáo.',accepted:true,personality:'Khách được nhân viên chăm sóc',dishName:order.recipeName||'Món tại quầy'});
      renderShopReviews();showV85QuickReview(customer.name,customer.avatar,decision.stars,'Lan đã phục vụ đúng món cho khách.');
      currentCustomer=null;cleanWorkbenchDish();renderCustomerBooth();updateHeaderStats();
      showToast(`🙋‍♀️ Lan phục vụ xong: +${earned+tip} Xu`,'✅');
      scheduleNextCustomer('staff');saveGameToStorage(false);
    }
    function v87532PrepareShipOrder(ord){
      const unlocked=getUnlockedRecipes(gameState.currentCareer);
      const recipe=unlocked.find(r=>r.id===ord.recipeId)||unlocked.find(r=>v87532HasIngredients(v87532Req(r.order,gameState.currentCareer),gameState.currentCareer));
      if(!recipe)return null;
      const req=v87532Req(recipe.order,gameState.currentCareer);
      return v87532HasIngredients(req,gameState.currentCareer)?{recipe,req}:null;
    }
    function v87532AutoShip(){
      const o=v87532Ensure(),t=o.today;
      if(!o.settings.ship_khoa||!v87532Active('ship_khoa')||gameState.phase!=='open'||phonePauseActive)return;
      if(v87532Stat('ship_khoa').jobs>=v87532Cap('ship_khoa'))return;
      const ord=activeOnlineOrders.find(x=>x.status==='pending'&&Number(x.timeLeft)>2);
      if(!ord)return;
      if(packingTargetOrder?.id===ord.id)return;
      const preparation=v87532PrepareShipOrder(ord);if(!preparation)return;
      const key=String(ord.id);let job=t.shipJobs[key];
      if(!job)job=t.shipJobs[key]={progress:0,recipeId:preparation.recipe.id};
      job.progress=Math.min(100,job.progress+(v87532Active('manager_vy')?25:17));
      if(job.progress<100)return;
      if(!v87532HasIngredients(preparation.req,gameState.currentCareer))return;
      v87532UseIngredients(preparation.req);
      ord.dishName=preparation.recipe.name;ord.packTimeRemaining=4.0;ord.automatedBy='ship_khoa';
      delete t.shipJobs[key];
      t.transit={id:ord.id,name:ord.dishName};
      dispatchShipperDelivery(ord);
      showToast(`🛵 Khoa tự đóng gói và mang đi giao ${ord.dishName}`,'📦');
      saveGameToStorage(false);
    }
    function v87532Tick(){
      if(!gameState?.hasStarted||gameState.phase!=='open')return;
      try{v87532AutoServe();v87532AutoShip();v87532RenderBoard();}catch(e){console.warn('Staff operations',e);}
    }
    function v87532ShipCompleted(ord,revenue){
      if(ord?.automatedBy!=='ship_khoa')return;
      v87532Record('ship_khoa',revenue);delete v87532Ensure().today.transit;v87532RenderBoard();
    }
    function v87532TrackVisitor(){
      if(gameState.staff?.includes('promoter_ngoc')&&v87532Active('promoter_ngoc'))v87532Ensure().today.customerCount++;
    }
    function v87532DayClose(){
      const o=v87532Ensure(),t=o.today;
      if(o.history.some(h=>h.day===t.day))return;
      const total=Object.values(t.stats||{}).reduce((a,v)=>a+(Number(v.revenue)||0),0);
      const jobs=Object.values(t.stats||{}).reduce((a,v)=>a+(Number(v.jobs)||0),0);
      o.history.unshift({day:t.day,jobs,revenue:total,wage:v87531Due(),staff:Object.fromEntries(Object.entries(t.stats||{}).map(([k,v])=>[k,{...v}]))});
      o.history=o.history.slice(0,7);
    }
    function v87532Morning(){
      const o=v87532Ensure();o.today={day:gameState.day,stats:{},prep:0,customerCount:0,shipJobs:{},pendingServe:null};
    }
    function v87532RenderBoard(){
      const o=v87532Ensure(),root=document.getElementById('v87532-shop-board');if(!root)return;
      const hired=(gameState.staff||[]).filter(id=>!!STAFF_CONFIG[id]);
      const names={host_lan:'Lan • Phục vụ',kitchen_ti:'Tí • Phụ bếp',ship_khoa:'Khoa • Giao hàng',cashier_phuc:'Phúc • Thu ngân',promoter_ngoc:'Ngọc • Truyền thông',manager_vy:'Vy • Quản lý'};
      const total=Object.values(o.today.stats).reduce((n,x)=>n+(x.revenue||0),0),jobs=Object.values(o.today.stats).reduce((n,x)=>n+(x.jobs||0),0);
      const summary=root.querySelector('[data-summary]');if(summary)summary.textContent=hired.length?`${jobs} việc • +${total} Xu`:'Chưa thuê nhân viên';
      const body=root.querySelector('[data-content]');if(!body||!root.open)return;
      body.innerHTML=hired.map(id=>{
        const cfg=STAFF_CONFIG[id],st=v87532Stat(id),active=v87532Active(id),job=Object.values(o.today.shipJobs).find(Boolean);
        const pct=id==='ship_khoa'&&job?job.progress:id==='host_lan'?Math.max(0,Math.min(100,Math.round((1-(o.today.pendingServe?.remaining||9)/9)*100))):0;
        const text=!active?'🏖️ Vắng mặt hôm nay':id==='host_lan'?(currentCustomer?'Đang chuẩn bị phục vụ khách':'Sẵn sàng đón khách'):id==='ship_khoa'?(job?'Đang đóng gói đơn online':o.today.transit?'Đang giao '+o.today.transit.name:'Sẵn sàng giao đơn'):id==='kitchen_ti'?'Chuẩn bị topping hỗ trợ Lan':id==='promoter_ngoc'?`Đã thu hút ${o.today.customerCount} lượt khách`:'Đang hỗ trợ vận hành';
        const toggle=['host_lan','ship_khoa'].includes(id)?`<button class="v87532-mini-btn" onclick="v87532Toggle('${id}')">${o.settings[id]?'Tắt auto':'Bật auto'}</button>`:'';
        return `<div class="v87532-person"><span>${cfg.icon}</span><div><b>${names[id]}</b><small>${text} • ${st.jobs} lượt • +${st.revenue} Xu</small>${pct>0?`<div class="v87532-progress"><i style="width:${pct}%"></i></div>`:''}</div>${toggle}</div>`;
      }).join('')||'<div class="v87532-report">Tuyển nhân viên tại Điện thoại → Phát Triển Quán để mở hỗ trợ thực tế.</div>';
      const last=o.history[0];
      body.innerHTML+=`<div class="v87532-report">📊 Ca hôm nay: ${jobs} việc • +${total} Xu từ nhân viên • lương ${v87531Due()} Xu.<br>${last?`📅 Ngày ${last.day}: ${last.jobs} việc • doanh thu ${last.revenue} Xu • lương ${last.wage} Xu.`:'📅 Chưa có báo cáo ca trước.'}<br><small>Doanh thu tự động là doanh thu gộp, không phải lợi nhuận: còn chi phí nguyên liệu và vận hành. Chỉ tự làm nếu đủ hàng và đúng công thức.</small></div>`;
    }
    function v87532RenderHRReport(){
      const o=v87532Ensure();const today=o.today;
      const total=Object.values(today.stats).reduce((n,x)=>n+(x.revenue||0),0);
      const el=document.getElementById('v87532-staff-report');if(!el)return;
      const last=o.history[0];
      el.innerHTML=`<b>⚙️ Việc đã làm thật hôm nay</b> • ${Object.values(today.stats).reduce((n,x)=>n+x.jobs,0)} lượt • thu ${total} Xu • lương ${v87531Due()} Xu<br><span>Lan tự phục vụ: ${v87532Stat('host_lan').jobs} đơn · Tí hỗ trợ: ${v87532Stat('kitchen_ti').jobs} lượt · Khoa tự ship: ${v87532Stat('ship_khoa').jobs} đơn.</span><br>${last?`Ngày ${last.day}: ${last.jobs} việc • +${last.revenue} Xu • lương ${last.wage} Xu.`:'Chưa có ca trước để đối chiếu.'}<br><small>Tự động có giới hạn 4 lượt/ca (+1 nếu uy tín & tinh thần cao). Đơn thủ công vẫn chơi như cũ.</small>`;
    }

    /* === V87.5.3.1 - Nhân viên có đời sống: nhật ký, hợp đồng lương, tình huống mỗi sáng === */
    const V87531_STORIES = [
      {id:'leave',icon:'🏖️',title:'Xin nghỉ đi chơi',weight:10,desc:'Em đã hẹn gia đình một buổi đi chơi. Hôm nay em có thể nghỉ một ngày không ạ? Em sẽ bàn giao công việc trước.',options:[['💚 Cho nghỉ có lương','leavePaid'],['📋 Hôm nay quán cần em','leaveDeny']]},
      {id:'family',icon:'🏠',title:'Chuyện gia đình',weight:8,desc:'Nhà em có việc đột xuất, em muốn xin nghỉ hôm nay. Em thật sự mong chủ quán thông cảm.',options:[['💚 Cho nghỉ phép','leavePaid'],['📋 Giữ ca hôm nay','leaveDeny']]},
      {id:'raise',icon:'💰',title:'Đề nghị tăng lương',weight:10,desc:'Dạo này em làm việc chăm chỉ hơn. Chủ quán có thể xem xét tăng lương cho em không?',options:[['✅ Tăng 12 Xu/ngày','raiseYes'],['🤝 Thỏa thuận +5 Xu','raiseSmall'],['⏳ Chưa thể tăng','raiseNo']]},
      {id:'lazy',icon:'😴',title:'Một ca làm thiếu tập trung',weight:9,desc:'Hôm trước em hơi mất tập trung, làm việc chậm và quên vài việc nhỏ. Em muốn có cơ hội sửa lại.',options:[['📚 Hướng dẫn lại (30 Xu)','lazyCoach'],['⚠️ Nhắc nhở nghiêm túc','lazyWarn']]},
      {id:'tired',icon:'☕',title:'Nhân viên mệt mỏi',weight:9,desc:'Em làm liên tiếp mấy ngày nên hơi kiệt sức. Em sợ hôm nay phục vụ không được tốt.',options:[['🛌 Cho nghỉ hồi sức','leavePaid'],['🍵 Nghỉ giải lao ngắn','restBreak']]},
      {id:'praise',icon:'🌟',title:'Khách khen nhân viên',weight:12,desc:'Một khách quen nhắn rằng em rất dễ thương, phục vụ tận tình và khiến khách muốn quay lại.',options:[['🎁 Thưởng nóng 35 Xu','praiseTip'],['💬 Khen trước cả đội','praiseShare']]},
      {id:'trusted',icon:'👑',title:'Người quen kéo khách',weight:10,desc:'Nhiều người trong thị trấn biết và tin em. Hôm nay họ hẹn rủ bạn bè tới quán mình!',options:[['📣 Nhờ giới thiệu quán','trustedBoost'],['🌷 Cảm ơn chân thành','trustedThanks']]},
      {id:'gift',icon:'🎁',title:'Có quà tặng chủ quán',weight:8,desc:'Em mang ít nông sản nhà làm tới biếu chủ quán. Cảm ơn vì đã cho em công việc này!',options:[['💝 Nhận quà và cảm ơn','giftAccept'],['🥰 Chia quà cho cả nhóm','giftShare']]},
      {id:'idea',icon:'💡',title:'Ý tưởng nhỏ cho quán',weight:7,desc:'Em nghĩ mình có thể trang trí góc đón khách và giới thiệu món đặc biệt trong hôm nay.',options:[['🎨 Đầu tư 65 Xu thử ngay','ideaTry'],['📝 Để dành ý tưởng','ideaLater']]},
      {id:'mistake',icon:'🧾',title:'Báo lỗi phục vụ',weight:8,desc:'Em đã ghi sai một đơn rồi chủ động xin lỗi khách. May là khách thông cảm, nhưng em muốn báo lại.',options:[['🤲 Hướng dẫn, cho sửa sai','mistakeSupport'],['⚠️ Ghi nhận và nhắc nhở','mistakeWarn']]},
      {id:'conflict',icon:'🤝',title:'Chuyện trong đội',weight:6,desc:'Hôm nay em hơi khó phối hợp với đồng nghiệp. Chủ quán có thể giúp mọi người thống nhất cách làm không?',options:[['🫶 Đứng ra hòa giải','conflictHelp'],['📋 Nhắc tuân thủ quy trình','conflictRule']]},
      {id:'enthusiasm',icon:'🎈',title:'Bắt đầu ngày vui vẻ',weight:10,desc:'Hôm nay em rất có động lực! Em muốn giúp quán phục vụ thật chu đáo và tạo ấn tượng tốt.',options:[['✨ Để em dẫn nhịp','happyLead'],['💛 Động viên cả đội','happyTeam']]}
    ];
    function v87531Ensure(){
      if(!gameState.staffHR||typeof gameState.staffHR!=='object'||Array.isArray(gameState.staffHR))gameState.staffHR={};
      const h=gameState.staffHR;
      if(!h.people||typeof h.people!=='object')h.people={};
      if(!Array.isArray(h.history))h.history=[];
      if(!h.daily||typeof h.daily!=='object')h.daily={day:Number(gameState.day)||1,leave:{},penalty:{},bonus:{}};
      if(!h.daily.leave)h.daily.leave={};if(!h.daily.penalty)h.daily.penalty={};if(!h.daily.bonus)h.daily.bonus={};
      if(!Number.isFinite(Number(h.arrears)))h.arrears=0;
      if(!Number.isFinite(Number(h.payDay))){
        h.payDay=Number(gameState.day)||1;
        h.due={};for(const id of (gameState.staff||[]))if(STAFF_CONFIG[id])h.due[id]=v87531Wage(id);
      }
      if(!h.due||typeof h.due!=='object')h.due={};
      for(const id of (gameState.staff||[]))v87531Person(id);
      return h;
    }
    function v87531Person(id){
      const h=gameState.staffHR;if(!h||!STAFF_CONFIG[id])return {morale:65,trust:50,raise:0};
      if(!h.people[id])h.people[id]={morale:65,trust:50,raise:0,days:0};
      const p=h.people[id];
      p.morale=Math.max(0,Math.min(100,Number(p.morale)||0));
      p.trust=Math.max(0,Math.min(100,Number(p.trust)||0));
      p.raise=Math.max(0,Math.min(90,Math.round(Number(p.raise)||0)));
      return p;
    }
    function v87531Wage(id){const c=STAFF_CONFIG[id];if(!c)return 0;return Math.max(0,Math.round(c.wage+(gameState.staffHR?.people?.[id]?.raise||0)));}
    function v87531Due(){const h=v87531Ensure();return Math.round(Object.values(h.due).reduce((a,b)=>a+Math.max(0,Number(b)||0),0));}
    function v87531Factor(id){
      const h=v87531Ensure();
      if(h.daily.day===gameState.day&&h.daily.leave[id])return 0;
      const p=v87531Person(id);let f=p.morale<30?.72:p.morale>=80?1.04:1;
      if(h.daily.day===gameState.day&&Number.isFinite(Number(h.daily.penalty[id])))f*=Number(h.daily.penalty[id]);
      return Math.min(1.12,Math.max(.30,f));
    }
    function v87531PushHistory(line){const h=v87531Ensure();h.history.unshift(`Ngày ${gameState.day}: ${line}`);h.history=h.history.slice(0,10);}
    function v87531Change(id,morale=0,trust=0){const p=v87531Person(id);p.morale=Math.max(0,Math.min(100,p.morale+morale));p.trust=Math.max(0,Math.min(100,p.trust+trust));}
    function v87531DayClose(){
      const h=v87531Ensure(),st=gameState.dailyStats||{};
      if(h.pending?.day===gameState.day){
        v87531Change(h.pending.id,-3,-1);
        v87531PushHistory(`${STAFF_CONFIG[h.pending.id]?.name||'Nhân viên'} không được phản hồi báo cáo trong ngày; tinh thần giảm nhẹ.`);
        h.pending=null;
      }
      const served=Math.max(0,Number(st.counterServed||0)+Number(st.deliveryServed||0));
      const rs=(st.ratings||[]).map(Number).filter(Number.isFinite);
      const avg=rs.length?rs.reduce((a,b)=>a+b,0)/rs.length:0;
      for(const id of (gameState.staff||[])){
        const p=v87531Person(id);p.days=(p.days||0)+1;
        if(h.daily.day===gameState.day&&h.daily.leave[id])continue;
        if(served>=3&&avg>=4){v87531Change(id,2,1);}else if(served>=3&&avg<3){v87531Change(id,-2,0);}
      }
    }
    function v87531SettleDay(available,opCosts,interestCost){
      const h=v87531Ensure();
      const short=Math.max(0,Math.round(Number(opCosts)+Number(interestCost)-Number(available)));
      const unpaid=Math.min(v87531Due(),short);
      if(unpaid){
        h.arrears+=unpaid;
        for(const id of (gameState.staff||[]))v87531Change(id,-6,-2);
        v87531PushHistory(`Quán còn thiếu ${unpaid} Xu lương. Cần thanh toán để giữ uy tín với nhân viên.`);
      }
      return unpaid;
    }
    function v87531RollStory(){
      const h=v87531Ensure();if(!gameState.staff?.length)return null;
      const ids=gameState.staff.filter(id=>!!STAFF_CONFIG[id]);if(!ids.length)return null;
      const id=ids[Math.floor(Math.random()*ids.length)];
      const pool=V87531_STORIES.filter(s=>(s.id!=='trusted'||v87531Person(id).trust>=55)&&(s.id!=='conflict'||ids.length>=2));
      const previous=h.lastStoryId;let options=pool.filter(s=>s.id!==previous);if(!options.length)options=pool;
      const total=options.reduce((sum,s)=>sum+s.weight,0);let r=Math.random()*total;
      const story=options.find(s=>(r-=s.weight)<0)||options[options.length-1];
      h.lastStoryId=story.id;
      return {day:gameState.day,id,storyId:story.id};
    }
    function v87531Morning(){
      const h=v87531Ensure();
      h.payDay=gameState.day;h.due={};
      h.daily={day:gameState.day,leave:{},penalty:{},bonus:{}};
      for(const id of (gameState.staff||[])){h.due[id]=v87531Wage(id);v87531Person(id);}
      // Một bản báo cáo duy nhất mỗi sáng, lưu hẳn vào save tránh roll lại khi chuyển tab.
      h.pending=v87531RollStory();
      if(h.pending){const c=STAFF_CONFIG[h.pending.id];v87531PushHistory(`${c.name} có một chuyện muốn trình bày với chủ quán.`);}
    }
    function v87531Open(){
      const h=v87531Ensure();const e=h.pending;if(!e||e.day!==gameState.day)return showToast('Hôm nay nhân viên chưa có báo cáo mới.','📋');
      const cfg=STAFF_CONFIG[e.id],story=V87531_STORIES.find(s=>s.id===e.storyId);if(!cfg||!story)return;
      const p=v87531Person(e.id),target=document.getElementById('v87531-report-body');
      if(!target)return;
      target.innerHTML=`<div class="v87531-head"><div class="v87531-avatar">${cfg.icon}</div><div><div class="v87531-sub">📋 BÁO CÁO NHÂN SỰ · NGÀY ${gameState.day}</div><b>${cfg.name}</b><div class="v87531-sub">Tinh thần ${p.morale}/100 · Uy tín ${p.trust}/100 · Lương ${v87531Wage(e.id)} Xu/ngày</div></div></div><div class="v87531-story"><b>${story.icon} ${story.title}</b><p style="margin-top:6px">“${story.desc}”</p></div><div class="v87531-choices">${story.options.map(([label,choice],i)=>`<button class="${i?'alt':''}" onclick="v87531Choose('${choice}')">${label}</button>`).join('')}</div><div class="v87531-foot"><span>Quyết định ảnh hưởng công việc, lương và quan hệ.</span><button onclick="v87531Later()">Để sau</button></div>`;
      document.getElementById('v87531-report-modal')?.classList.remove('hidden');
    }
    function v87531Later(){document.getElementById('v87531-report-modal')?.classList.add('hidden');}
    function v87531Choose(choice){
      const h=v87531Ensure(),e=h.pending;if(!e||e.day!==gameState.day)return;
      const story=V87531_STORIES.find(s=>s.id===e.storyId);if(!story?.options.some(x=>x[1]===choice))return;
      const id=e.id,c=STAFF_CONFIG[id];if(!c||!gameState.staff.includes(id)){h.pending=null;v87531Later();return;}
      let result='',expense=0;
      const spend=(amt)=>{if(gameState.coins<amt)return false;gameState.coins-=amt;expense+=amt;return true;};
      switch(choice){
        case 'leavePaid':h.daily.leave[id]=true;v87531Change(id,10,4);result='Đã duyệt nghỉ phép có lương hôm nay. Hiệu ứng hỗ trợ tạm dừng, lương vẫn tính.';break;
        case 'leaveDeny':v87531Change(id,-13,-5);h.daily.penalty[id]=.85;result='Nhân viên tiếp tục làm nhưng tinh thần giảm, hiệu quả hôm nay còn 85%.';break;
        case 'raiseYes':v87531Person(id).raise+=12;v87531Change(id,13,7);result='Tăng 12 Xu tiền lương từ ngày mai; uy tín và tinh thần tăng.';break;
        case 'raiseSmall':v87531Person(id).raise+=5;v87531Change(id,5,3);result='Thỏa thuận tăng 5 Xu/ngày từ ngày mai.';break;
        case 'raiseNo':v87531Change(id,-10,-4);result='Tạm hoãn tăng lương. Nhân viên hơi thất vọng.';break;
        case 'lazyCoach':if(!spend(30))return showToast('Cần 30 Xu để hướng dẫn lại. Bạn có thể chọn nhắc nhở.','🪙');v87531Change(id,6,5);h.daily.penalty[id]=1;result='Hướng dẫn lại thành công, nhân viên làm việc tập trung hơn.';break;
        case 'lazyWarn':v87531Change(id,-8,-3);h.daily.penalty[id]=.78;result='Nhân viên nghiêm túc hơn nhưng hôm nay giảm hiệu quả 22%.';break;
        case 'restBreak':v87531Change(id,3,2);h.daily.penalty[id]=.87;result='Nhân viên được nghỉ giải lao, hiệu quả hôm nay giảm nhẹ 13%.';break;
        case 'praiseTip':if(!spend(35))return showToast('Cần 35 Xu để thưởng nóng. Hãy chọn lời khen!','🪙');v87531Change(id,11,7);h.daily.bonus.tipPct=(h.daily.bonus.tipPct||0)+.015;result='Thưởng nóng đã trao, tiền boa toàn quán hôm nay tăng 1,5%.';break;
        case 'praiseShare':v87531Change(id,7,5);h.daily.bonus.tipPct=(h.daily.bonus.tipPct||0)+.008;result='Cả đội được truyền cảm hứng, tiền boa hôm nay tăng 0,8%.';break;
        case 'trustedBoost':v87531Change(id,5,5);h.daily.bonus.arrivalPct=(h.daily.bonus.arrivalPct||0)+.08;h.daily.bonus.rarePct=(h.daily.bonus.rarePct||0)+.025;result='Khách quen rủ bạn tới! Nhịp khách tăng 8% và cơ hội khách hiếm +2,5 điểm % hôm nay.';break;
        case 'trustedThanks':v87531Change(id,8,4);h.daily.bonus.arrivalPct=(h.daily.bonus.arrivalPct||0)+.035;result='Khách quen ghé đông hơn 3,5% hôm nay, nhân viên rất vui.';break;
        case 'giftAccept':gameState.inventory.seed_wheat=(gameState.inventory.seed_wheat||0)+3;v87531Change(id,8,3);result='Nhận 3 hạt giống Lúa Mì, cất trong Kho. Nhân viên rất vui.';break;
        case 'giftShare':gameState.inventory.seed_wheat=(gameState.inventory.seed_wheat||0)+2;v87531Change(id,10,4);for(const sid of gameState.staff)if(sid!==id)v87531Change(sid,3,0);result='Cả đội chia nhau quà, bạn giữ lại 2 hạt giống Lúa Mì.';break;
        case 'ideaTry':if(!spend(65))return showToast('Cần 65 Xu để thử ý tưởng. Hãy chọn để dành!','🪙');v87531Change(id,8,4);h.daily.bonus.arrivalPct=(h.daily.bonus.arrivalPct||0)+.055;result='Góc quán mới thu hút thêm khách: tốc độ khách ghé +5,5% hôm nay.';break;
        case 'ideaLater':v87531Change(id,-1,1);result='Ghi nhận ý tưởng để làm dịp khác.';break;
        case 'mistakeSupport':v87531Change(id,6,4);result='Nhân viên được hướng dẫn nhận lỗi và xử lý cẩn thận hơn.';break;
        case 'mistakeWarn':v87531Change(id,-7,-2);h.daily.penalty[id]=.92;result='Nhân viên đã được nhắc nhở, hôm nay hiệu quả hơi giảm.';break;
        case 'conflictHelp':for(const sid of gameState.staff)v87531Change(sid,5,3);result='Cả đội tìm được cách phối hợp, tinh thần và uy tín tăng.';break;
        case 'conflictRule':v87531Change(id,-4,-2);result='Đã thống nhất lại quy trình nhưng nhân viên hơi căng thẳng.';break;
        case 'happyLead':v87531Change(id,7,4);h.daily.bonus.arrivalPct=(h.daily.bonus.arrivalPct||0)+.045;result='Nhân viên dẫn nhịp quán, khách ghé nhanh hơn 4,5% hôm nay.';break;
        case 'happyTeam':for(const sid of gameState.staff)v87531Change(sid,4,2);result='Cả nhóm thêm hào hứng làm việc và phối hợp tốt hơn.';break;
        default:return;
      }
      h.pending=null;
      v87531PushHistory(`${c.name}: ${result}`);
      v87531Later();showToast(result,c.icon);
      updateHeaderStats();renderGrowthStaff();saveGameToStorage(false);
    }
    function v87531PayArrears(){
      const h=v87531Ensure();const pay=Math.min(Math.floor(gameState.coins),Math.floor(h.arrears));if(pay<=0)return showToast('Không có nợ lương hoặc chưa đủ Xu để thanh toán.','💵');
      gameState.coins-=pay;h.arrears-=pay;
      if(h.arrears===0)for(const id of gameState.staff)v87531Change(id,4,2);
      v87531PushHistory(`Đã thanh toán ${pay} Xu tiền lương tồn.`);
      showToast(`Đã trả ${pay} Xu lương còn thiếu.`, '💵');updateHeaderStats();renderGrowthStaff();saveGameToStorage(false);
    }

    function ensureGrowthState() {
      if (!gameState.skills || typeof gameState.skills !== 'object') gameState.skills = { sales: 0, service: 0, luck: 0, farm: 0 };
      Object.keys(GROWTH_SKILL_CONFIG).forEach(k => {
        const max = GROWTH_SKILL_CONFIG[k].max;
        gameState.skills[k] = Math.max(0, Math.min(max, Number(gameState.skills[k]) || 0));
      });
      // New specialization points are not granted retroactively or deducted on migration.
      if (!gameState.skillTalents || typeof gameState.skillTalents!=='object'||Array.isArray(gameState.skillTalents))gameState.skillTalents={};
      for(const [id,cfg] of Object.entries(V8742_TALENTS)){
        gameState.skillTalents[id]=Math.max(0,Math.min(cfg.max,Math.floor(Number(gameState.skillTalents[id])||0)));
      }
      v8744EnsureState();
      if (!Array.isArray(gameState.decorations)) gameState.decorations = [];
      gameState.decorations = [...new Set(gameState.decorations)].filter(id => !!SHOP_DECOR_CONFIG[id]);
      if (!Array.isArray(gameState.staff)) gameState.staff = [];
      gameState.staff = [...new Set(gameState.staff)].filter(id => !!STAFF_CONFIG[id]);
      gameState.shopStage = Math.max(0, Math.min(SHOP_STAGE_CONFIG.length - 1, Number(gameState.shopStage) || 0));
    }

    function getGrowthBonuses() {
      ensureGrowthState();
      const stage = SHOP_STAGE_CONFIG[gameState.shopStage] || SHOP_STAGE_CONFIG[0];
      const out = {
        revenuePct: Number(stage.revenuePct) || 0,
        tipPct: Number(stage.tipPct) || 0,
        patienceSec: Number(stage.patienceSec) || 0,
        luckPct: Number(stage.luckPct) || 0,
        opCost: Number(stage.opCost) || 0,
        deliveryPct: 0,
        deliveryTimeSec: 0,
        orderSlots: 0,
        rarePct: 0,
        arrivalPct: 0
      };

      out.revenuePct += (gameState.skills.sales || 0) * 0.04;
      out.patienceSec += (gameState.skills.service || 0) * 3;
      out.tipPct += (gameState.skills.service || 0) * 0.03;
      out.luckPct += (gameState.skills.luck || 0) * 0.03;
      for(const key of ['revenuePct','tipPct','patienceSec','luckPct','deliveryPct','deliveryTimeSec','rarePct','arrivalPct']){
        out[key] += v8742SkillBonus(key);
      }

      const utilityBonus = getUtilityBonuses();
      out.revenuePct += Number(utilityBonus.shopRevenuePct) || 0;
      out.tipPct += Number(utilityBonus.shopTipPct) || 0;
      out.luckPct += Number(utilityBonus.generalLuckPct) || 0;

      gameState.decorations.forEach(id => {
        const d = SHOP_DECOR_CONFIG[id];
        if (!d) return;
        out.revenuePct += Number(d.revenuePct) || 0;
        out.tipPct += Number(d.tipPct) || 0;
        out.patienceSec += Number(d.patienceSec) || 0;
        out.luckPct += Number(d.luckPct) || 0;
      });

      gameState.staff.forEach(id => {
        const st = STAFF_CONFIG[id];
        if (!st) return;
        const f=v87531Factor(id);
        out.revenuePct += (Number(st.revenuePct)||0)*f;
        out.tipPct += (Number(st.tipPct)||0)*f;
        out.patienceSec += (Number(st.patienceSec)||0)*f;
        out.deliveryPct += (Number(st.deliveryPct)||0)*f;
        out.deliveryTimeSec += (Number(st.deliveryTimeSec)||0)*f;
        out.orderSlots += f>0 ? (Number(st.orderSlots)||0) : 0;
        out.rarePct += (Number(st.rarePct)||0)*f;
        out.arrivalPct += (Number(st.arrivalPct)||0)*f;
      });
      // Lương trong ngày lấy từ sổ đã phát sinh, kể cả nhân viên vừa nghỉ việc.
      out.opCost += v87531Due();
      const sb=gameState.staffHR.daily.day===gameState.day?gameState.staffHR.daily.bonus:{};
      out.tipPct += Number(sb.tipPct)||0;
      out.arrivalPct += Number(sb.arrivalPct)||0;
      out.rarePct += Number(sb.rarePct)||0;
      for(const id of gameState.staff){const p=v87531Person(id);if(v87531Factor(id)>0&&p.trust>=85&&p.morale>=70)out.arrivalPct+=.012;}


      // V87.4.1: story-exclusive relics influence paid orders without bypassing validations.
      const npcGift = v8741Bonuses();
      out.revenuePct += npcGift.revenuePct;
      out.tipPct += npcGift.tipPct;
      out.patienceSec += npcGift.patienceSec;
      out.patienceSec += v8744CareerBonus(gameState.currentCareer).patienceSec;
      out.deliveryPct += npcGift.deliveryPct;
      out.revenuePct = Math.min(0.68, out.revenuePct);
      out.tipPct = Math.min(0.65, out.tipPct);
      out.patienceSec = Math.min(45, out.patienceSec);
      out.luckPct = Math.min(0.40, out.luckPct);
      out.deliveryPct = Math.min(.25, out.deliveryPct);
      out.deliveryTimeSec = Math.min(25, out.deliveryTimeSec);
      out.orderSlots = Math.min(3, out.orderSlots);
      out.rarePct = Math.min(.12, out.rarePct);
      out.arrivalPct = Math.min(.20, out.arrivalPct);
      return out;
    }

    function formatGrowthPercent(v) {
      return `${Math.round((Number(v) || 0) * 100)}%`;
    }

    function switchGrowthSection(section) {
      currentGrowthSection = ['skills', 'decor', 'staff', 'story'].includes(section) ? section : 'skills';
      ['skills', 'decor', 'staff', 'story'].forEach(k => {
        const panel = document.getElementById(`growth-panel-${k}`);
        const btn = document.getElementById(`growth-tab-${k}`);
        if (panel) panel.classList.toggle('hidden', k !== currentGrowthSection);
        if (btn) btn.className = k === currentGrowthSection
          ? 'py-1.5 rounded-xl bg-emerald-600 text-white tap-scale'
          : 'py-1.5 rounded-xl bg-slate-800 text-slate-300 tap-scale';
      });
      renderGrowthApp();
      playSound('click');
    }

    function renderGrowthApp() {
      ensureGrowthState();
      const stage = SHOP_STAGE_CONFIG[gameState.shopStage] || SHOP_STAGE_CONFIG[0];
      const bonus = getGrowthBonuses();
      const stageLabel = document.getElementById('growth-stage-label');
      const spBadge = document.getElementById('growth-sp-badge');
      const summary = document.getElementById('growth-bonus-summary');
      if (stageLabel) stageLabel.innerText = `${stage.icon} ${stage.name} • Bậc ${gameState.shopStage + 1}/${SHOP_STAGE_CONFIG.length}`;
      if (spBadge) spBadge.innerText = `⚡ ${gameState.sp} SP`;
      if (summary) summary.innerText = `📈 +${formatGrowthPercent(bonus.revenuePct)} doanh thu • 💝 +${formatGrowthPercent(bonus.tipPct)} tip • ⏱ +${bonus.patienceSec}s • 🍀 +${formatGrowthPercent(bonus.luckPct)} may mắn • 👥 ${(gameState.staff || []).length}/${Number(stage.staffSlots)||0} nhân viên`;

      ['skills', 'decor', 'staff', 'story'].forEach(k => {
        const panel = document.getElementById(`growth-panel-${k}`);
        const btn = document.getElementById(`growth-tab-${k}`);
        if (panel) panel.classList.toggle('hidden', k !== currentGrowthSection);
        if (btn) btn.className = k === currentGrowthSection
          ? 'py-1.5 rounded-xl bg-emerald-600 text-white tap-scale'
          : 'py-1.5 rounded-xl bg-slate-800 text-slate-300 tap-scale';
      });

      renderGrowthSkills();
      renderGrowthDecor();
      renderGrowthStaff();
      renderGrowthStory();
    }

    function renderGrowthSkills() {
      const box=document.getElementById('growth-panel-skills');if(!box)return;
      ensureGrowthState();
      const skill=GROWTH_SKILL_CONFIG[v8742CurrentPath]||GROWTH_SKILL_CONFIG.sales;
      const core=gameState.skills[v8742CurrentPath]||0;
      const learned=Object.keys(V8742_TALENTS).filter(id=>v8742TalentLevel(id)>0).length;
      const paths=Object.entries(GROWTH_SKILL_CONFIG).map(([key,cfg])=>{
        const on=key===v8742CurrentPath;
        return `<button type="button" class="v8742-path ${on?'active '+cfg.color:''}" onclick="v8742SelectPath('${key}')"><span class="v8742-path-icon">${cfg.icon}</span><b>${cfg.name}</b><small>Lv.${gameState.skills[key]||0}/${cfg.max}</small></button>`;
      }).join('');
      const bar=Array.from({length:skill.max},(_,i)=>`<span class="${i<core?'on':''}"></span>`).join('');
      const canCore=core<skill.max&&(Number(gameState.sp)||0)>=1;
      const professionPanel=v8744CareerHTML();
      const talentNodes=Object.entries(V8742_TALENTS).filter(([,cfg])=>cfg.root===v8742CurrentPath).map(([id,cfg],index)=>{
        const rank=v8742TalentLevel(id),locked=core<cfg.need,full=rank>=cfg.max;
        const cost=v8742TalentCost(id),can=!locked&&!full&&(Number(gameState.sp)||0)>=cost;
        const dots=Array.from({length:cfg.max},(_,i)=>`<i class="${i<rank?'on':''}"></i>`).join('');
        const requirement=locked?`🔒 Yêu cầu ${skill.name} Lv.${cfg.need}`:full?'🌟 Đã thành thạo':`⭐ Mở ở Lv.${cfg.need} · ${rank}/${cfg.max} cấp`;
        return `<div class="v8742-node ${locked?'locked':''} ${full?'max':''}"><div class="v8742-connector"><span></span><i></i></div><div class="v8742-node-top"><span class="v8742-node-icon">${cfg.icon}</span><div class="v8742-node-main"><b>${cfg.name}</b><small>${requirement}</small></div><span class="v8742-rank">${rank}/${cfg.max}</span></div><p>${cfg.desc}</p><div class="v8742-node-bottom"><div class="v8742-ranks">${dots}</div><button type="button" class="v8742-buy" ${can?'':'disabled'} onclick="upgradeTalentSkill('${id}')">${full?'ĐÃ MAX':locked?'CHƯA MỞ':`+1 CẤP · ${cost} SP`}</button></div></div>`;
      }).join('');
      box.innerHTML=`
        <section class="v8742-tree">
          <div class="v8742-hero"><div><span class="v8742-eyebrow">✦ HÀNH TRÌNH TRỞ THÀNH HUYỀN THOẠI</span><h3>🌟 Cây Kỹ Năng</h3><p>Mở nghề phụ, bồi dưỡng kỹ năng và phát triển phong cách chơi riêng.</p></div><div class="v8742-sp"><strong>${gameState.sp||0}</strong><span>⚡ SP CÒN</span></div></div>
          <div class="v8742-overview"><span>🏅 ${learned}/8 chuyên sâu đã học</span><span>🗝️ Cấp nhân vật ${gameState.level||1}</span></div>
          ${professionPanel}
          <div class="v8742-paths">${paths}</div>
          <div class="v8742-tree-body ${skill.color}">
            <div class="v8742-track-header"><span>NHÁNH PHÁT TRIỂN</span><b>${skill.icon} ${skill.name}</b><p>${skill.motto}</p></div>
            <div class="v8742-core"><div class="v8742-node-top"><span class="v8742-node-icon">${skill.icon}</span><div class="v8742-node-main"><b>Nền Tảng ${skill.name}</b><small>${skill.desc}</small></div><span class="v8742-rank">${core}/${skill.max}</span></div><div class="v8742-core-bottom"><div class="v8742-core-bars">${bar}</div><button type="button" class="v8742-buy" ${canCore?'':'disabled'} onclick="upgradeGrowthSkill('${v8742CurrentPath}')">${core>=skill.max?'ĐÃ MAX':'NÂNG · 1 SP'}</button></div></div>
            <div class="v8742-talent-heading"><span>✦ KỸ NĂNG CHUYÊN SÂU</span><small>Mở ở nền tảng Lv.2 và Lv.4</small></div>
            ${talentNodes}
          </div>
          <div class="v8742-footer"><b>📊 Hiệu ứng thật, cộng dồn có giới hạn</b><p>Kỹ năng chỉ dùng SP, không trừ Xu. Những điểm cũ được giữ nguyên; hiệu ứng sẽ hiện trong Sổ Hiệu Ứng. Khi đạt trần, phần vượt không có tác dụng.</p><button type="button" onclick="switchPhoneApp('effects')">Xem tổng chỉ số đang áp dụng →</button></div>
        </section>`;
    }

    function upgradeGrowthSkill(key) {
      ensureGrowthState();
      const cfg = GROWTH_SKILL_CONFIG[key];
      if (!cfg) return;
      if ((gameState.skills[key] || 0) >= cfg.max) return showToast('Kỹ năng này đã đạt cấp tối đa!', '⚡');
      if (gameState.sp <= 0) return showToast('Bạn chưa có SP. Hãy lên cấp để nhận thêm!', '⚠️');
      gameState.sp -= 1;
      gameState.skills[key] += 1;
      playSound('level');
      showToast(`${cfg.icon} ${cfg.name} lên Lv.${gameState.skills[key]}!`, '⚡');
      updateHeaderStats();
      renderGrowthApp();
      saveGameToStorage();
    }

    function decorEffectText(d) {
      const parts = [];
      if (d.revenuePct) parts.push(`📈 +${formatGrowthPercent(d.revenuePct)} doanh thu`);
      if (d.tipPct) parts.push(`💝 +${formatGrowthPercent(d.tipPct)} tip`);
      if (d.patienceSec) parts.push(`⏱ +${d.patienceSec}s`);
      if (d.luckPct) parts.push(`🍀 +${formatGrowthPercent(d.luckPct)} may mắn`);
      return parts.join(' • ') || d.desc;
    }

    function renderGrowthDecor() {
      const box = document.getElementById('growth-panel-decor');
      if (!box) return;
      box.innerHTML = `
        <div class="grid grid-cols-2 gap-1.5" id="growth-decor-grid"></div>`;
      const grid = document.getElementById('growth-decor-grid');
      if (!grid) return;
      Object.keys(SHOP_DECOR_CONFIG).forEach(id => {
        const d = SHOP_DECOR_CONFIG[id];
        const owned = gameState.decorations.includes(id);
        const reqStage = Number(d.reqStage) || 0;
        const reqLevel = Number(d.reqLevel) || 1;
        const unlocked = gameState.shopStage >= reqStage && gameState.level >= reqLevel;
        const canBuy = !owned && unlocked && gameState.coins >= d.cost;
        const stageName = (SHOP_STAGE_CONFIG[reqStage] || SHOP_STAGE_CONFIG[0]).name;
        grid.innerHTML += `
          <div class="p-2 rounded-2xl border ${owned ? 'border-emerald-500/50 bg-emerald-950/30' : unlocked ? 'border-slate-700 bg-slate-800' : 'border-slate-800 bg-slate-900/80 opacity-70'} min-w-0">
            <div class="text-2xl text-center">${d.icon}</div>
            <b class="text-[9px] text-white block text-center mt-0.5 leading-tight">${d.name}</b>
            <p class="text-[7px] text-slate-400 text-center min-h-[22px] mt-0.5">${decorEffectText(d)}</p>
            ${unlocked ? '' : `<p class="text-[7px] text-rose-300 text-center">🔒 Lv.${reqLevel} • ${stageName}</p>`}
            <button ${owned || !unlocked ? 'disabled' : ''} onclick="buyShopDecor('${id}')" class="w-full mt-1 py-1 rounded-lg text-[8px] font-black ${owned ? 'bg-emerald-900/50 text-emerald-300' : canBuy ? 'bg-amber-600 hover:bg-amber-500 text-white tap-scale' : 'bg-slate-700 text-slate-500'}">${owned ? '✓ Đã Có' : `${d.cost.toLocaleString()} Xu`}</button>
          </div>`;
      });
    }

    function buyShopDecor(id) {
      ensureGrowthState();
      const d = SHOP_DECOR_CONFIG[id];
      if (!d || gameState.decorations.includes(id)) return;
      if (gameState.shopStage < (Number(d.reqStage)||0)) return showToast('Quán chưa đủ bậc để đặt món trang trí này!', '🔒');
      if (gameState.level < (Number(d.reqLevel)||1)) return showToast(`Cần Lv.${Number(d.reqLevel)||1} để mở món này!`, '🔒');
      if (gameState.coins < d.cost) return showToast(`Cần ${d.cost.toLocaleString()} Xu để mua ${d.name}!`, '❌');
      gameState.coins -= d.cost;
      gameState.decorations.push(id);
      playSound('coin');
      showToast(`Đã trang trí ${d.name}! Hiệu ứng đã kích hoạt.`, d.icon);
      updateHeaderStats();
      renderGrowthApp();
      saveGameToStorage();
    }

    function staffEffectText(st) {
      return st.effect || 'Hỗ trợ vận hành quán.';
    }

    function renderGrowthStaff() {
      const box = document.getElementById('growth-panel-staff');
      if (!box) return;
      const stage = SHOP_STAGE_CONFIG[gameState.shopStage] || SHOP_STAGE_CONFIG[0];
      const slots = Number(stage.staffSlots) || 0;
      const hired = gameState.staff || [];
      const wages = hired.reduce((sum,id) => sum + v87531Wage(id), 0);
      const hr=v87531Ensure();
      v87532Ensure();
      box.innerHTML = `
        <div class="p-2 rounded-2xl bg-cyan-950/50 border border-cyan-700/40 text-[9px] text-cyan-100">
          👥 Nhân sự <b>${hired.length}/${slots}</b> slot • lương hiện tại <b>${wages} Xu/ngày</b>.<br>
          Nhân viên giúp quán vận hành dễ hơn nhưng tạo <b>chi phí cố định mỗi ngày</b>; lương đã phát sinh hôm nay <b>${v87531Due()} Xu</b> vẫn được thanh toán dù nhân viên nghỉ việc.
        </div>`;
      box.innerHTML += `<div id="v87532-staff-report" class="v87532-staff-report"></div>`;
      v87532RenderHRReport();
      box.innerHTML += `<div class="v87531-mini"><b>📋 Báo cáo & đời sống nhân viên</b><div>Tối đa một chuyện cần quyết định mỗi sáng.</div><div class="v87531-actions">${hr.pending?.day===gameState.day?'<button onclick="v87531Open()">📨 Đọc báo cáo sáng nay</button>':''}${hr.arrears>0?`<button onclick="v87531PayArrears()">💵 Trả nợ lương ${hr.arrears} Xu</button>`:''}</div>${hr.history.length?`<div class="v87531-diary">${v87411Escape(hr.history.slice(0,2).join(' · '))}</div>`:''}</div>`;
      Object.keys(STAFF_CONFIG).forEach(id => {
        const st = STAFF_CONFIG[id];
        const isHired = hired.includes(id);
        const stageUnlocked = gameState.shopStage >= st.reqStage;
        const hasSlot = hired.length < slots;
        const canHire = !isHired && stageUnlocked && hasSlot && gameState.coins >= st.hireCost;
        const reqName = (SHOP_STAGE_CONFIG[st.reqStage] || SHOP_STAGE_CONFIG[0]).name;
        box.innerHTML += `
          <div class="p-2.5 rounded-2xl border ${isHired ? 'border-cyan-400/50 bg-cyan-950/35' : 'border-slate-700 bg-slate-800'} flex items-center gap-2">
            <div class="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-2xl shrink-0">${st.icon}</div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between gap-1"><b class="text-[10px] text-white">${st.name}</b><span class="text-[7px] text-amber-300 font-bold">💵 ${isHired?v87531Wage(id):st.wage}/ngày</span></div>
              <p class="text-[7px] text-slate-400">${st.role}</p>
              <p class="text-[8px] text-cyan-200 mt-0.5">${staffEffectText(st)}</p>${isHired?`<div class="v87531-status"><span>💚 Tinh thần ${v87531Person(id).morale}</span><span>⭐ Uy tín ${v87531Person(id).trust}</span><span>${v87531Factor(id)===0?'🏖️ Nghỉ hôm nay':`⚙️ Hiệu suất ${Math.round(v87531Factor(id)*100)}%`}</span></div>`:''}
              ${stageUnlocked ? '' : `<p class="text-[7px] text-rose-300 mt-0.5">🔒 Mở ở ${reqName}</p>`}
            </div>
            <button ${(!isHired && !canHire) ? 'disabled' : ''} onclick="${isHired ? `fireStaff('${id}')` : `hireStaff('${id}')`}" class="px-2 py-1.5 rounded-xl text-[8px] font-black shrink-0 ${isHired ? 'bg-rose-900/70 text-rose-200 tap-scale' : canHire ? 'bg-cyan-600 text-white tap-scale' : 'bg-slate-700 text-slate-500'}">${isHired ? 'Cho nghỉ' : `${st.hireCost.toLocaleString()} Xu`}</button>
          </div>`;
      });
    }

    function hireStaff(id) {
      ensureGrowthState();
      v87532Ensure();
      const st = STAFF_CONFIG[id];
      if (!st || gameState.staff.includes(id)) return;
      const stage = SHOP_STAGE_CONFIG[gameState.shopStage] || SHOP_STAGE_CONFIG[0];
      if (gameState.shopStage < st.reqStage) return showToast('Chưa mở khóa vị trí nhân sự này!', '🔒');
      if (gameState.staff.length >= (Number(stage.staffSlots)||0)) return showToast('Quán đã đủ nhân sự. Hãy mở rộng quán để có thêm slot!', '👥');
      if (gameState.coins < st.hireCost) return showToast(`Cần ${st.hireCost.toLocaleString()} Xu để tuyển ${st.name}.`, '❌');
      gameState.coins -= st.hireCost;
      gameState.staff.push(id);
      v87531Ensure().due[id]=v87531Wage(id);
      v87532Ensure();
      v87531PushHistory(`Tuyển ${st.name}, lương ngày ${gameState.day} đã phát sinh.`);
      showToast(`Đã tuyển ${st.name}! Lương ${st.wage} Xu/ngày.`, st.icon);
      playSound('level');
      updateHeaderStats();
      renderGrowthApp();
      saveGameToStorage();
    }

    function fireStaff(id) {
      ensureGrowthState();
      const st = STAFF_CONFIG[id];
      const idx = gameState.staff.indexOf(id);
      if (!st || idx < 0) return;
      gameState.staff.splice(idx,1);
      v87532Ensure();
      v87531PushHistory(`${st.name} nghỉ việc. Lương đã phát sinh hôm nay vẫn phải trả.`);
      showToast(`${st.name} nghỉ việc. Lương hôm nay vẫn được tính đến cuối ngày.`, '👋');
      renderGrowthApp();
      saveGameToStorage();
    }

    function renderGrowthStory() {
      const box = document.getElementById('growth-panel-story');
      if (!box) return;
      const current = gameState.shopStage;
      const next = SHOP_STAGE_CONFIG[current + 1];

      const chapterHtml = `
        <div class="p-2 rounded-2xl bg-gradient-to-r from-amber-950/70 to-slate-900 border border-amber-500/30">
          <div class="text-[9px] font-black text-amber-200 uppercase tracking-wider">📖 Lộ trình cốt truyện</div>
          <div class="mt-1.5 space-y-1">
            ${STORY_CHAPTERS.map(ch => {
              const unlocked = gameState.level >= ch.reqLevel && gameState.shopStage >= ch.reqStage;
              return `<div class="p-1.5 rounded-xl border ${unlocked ? 'border-emerald-700/50 bg-emerald-950/25' : 'border-slate-800 bg-slate-950/50 opacity-65'}">
                <div class="flex items-center gap-1.5">
                  <span>${ch.icon}</span>
                  <b class="text-[8px] ${unlocked ? 'text-emerald-200' : 'text-slate-400'}">${ch.title}</b>
                  <span class="ml-auto text-[7px] ${unlocked ? 'text-emerald-400' : 'text-slate-500'}">${unlocked ? '✓ Mở' : `Lv.${ch.reqLevel} • Bậc ${ch.reqStage+1}`}</span>
                </div>
                ${unlocked
                  ? `<div class="text-[7px] text-slate-400 mt-1">${ch.story}</div>
                     <div class="text-[7px] text-amber-300 mt-0.5">Mở: ${ch.unlock}</div>
                     ${getStoryChapterIngredientSummary(ch.reqStage) ? `<div class="text-[7px] text-cyan-300 mt-0.5">Nguyên liệu: ${getStoryChapterIngredientSummary(ch.reqStage)}</div>` : ''}`
                  : `<div class="text-[7px] text-slate-500 mt-1">🔒 Công thức và nguyên liệu chương này chưa xuất hiện ở Chợ, Soppi hay Trạm Chế Biến.</div>`}
              </div>`;
            }).join('')}
          </div>
        </div>`;

      box.innerHTML = chapterHtml + SHOP_STAGE_CONFIG.map((st, idx) => {
        const done = idx < current;
        const active = idx === current;
        const locked = idx > current + 1;
        const stateLabel = done ? '✓ Đã hoàn thành' : active ? '● Hiện tại' : idx === current + 1 ? '→ Cột mốc kế' : '🔒 Chưa tới';
        return `
          <div class="p-2.5 rounded-2xl border ${active ? 'border-emerald-400 bg-emerald-950/40' : done ? 'border-slate-700 bg-slate-800/70' : 'border-slate-800 bg-slate-900/70'} ${locked ? 'opacity-60' : ''}">
            <div class="flex items-center gap-2">
              <span class="text-2xl">${st.icon}</span>
              <div class="flex-1 min-w-0"><b class="text-[10px] text-white">Bậc ${idx + 1}: ${st.name}</b><span class="block text-[7px] ${active ? 'text-emerald-300' : 'text-slate-500'} font-bold">${stateLabel}</span></div>
            </div>
            <p class="text-[8px] text-slate-400 mt-1 leading-relaxed">${st.story}</p>
            ${idx > 0 ? `<p class="text-[7px] text-cyan-300 mt-1">Hiệu ứng bậc: +${formatGrowthPercent(st.revenuePct)} doanh thu • +${formatGrowthPercent(st.tipPct)} tip • +${st.patienceSec}s • 👥 ${Number(st.staffSlots)||0} slot • phí nền +${st.opCost} Xu/ngày</p>` : ''}
          </div>`;
      }).join('');

      if (!next) {
        box.innerHTML += `<div class="p-2.5 rounded-2xl bg-gradient-to-r from-amber-900/60 to-emerald-900/60 border border-amber-400/40 text-center"><b class="text-amber-200 text-xs">🏆 Bạn đã xây dựng Thương Hiệu Đặc Sản!</b><p class="text-[8px] text-slate-300 mt-1">Late-game giờ xoay quanh đội ngũ, đồ trang trí đắt tiền, bộ sưu tập và kỷ lục doanh thu.</p></div>`;
        return;
      }

      const okLv = gameState.level >= next.reqLevel;
      const okRating = gameState.reputation >= next.reqRating;
      const okCoins = gameState.coins >= next.cost;
      const canUpgrade = okLv && okRating && okCoins;
      box.innerHTML += `
        <div class="p-2.5 rounded-2xl bg-gradient-to-r from-indigo-950 to-emerald-950 border border-emerald-500/40 space-y-1.5">
          <b class="text-[10px] text-emerald-200">Cột mốc tiếp theo: ${next.icon} ${next.name}</b>
          <div class="grid grid-cols-3 gap-1 text-[8px] text-center">
            <span class="rounded-lg px-1 py-1 ${okLv ? 'bg-emerald-900 text-emerald-300' : 'bg-slate-800 text-slate-400'}">${okLv ? '✓' : '○'} Lv.${next.reqLevel}</span>
            <span class="rounded-lg px-1 py-1 ${okRating ? 'bg-emerald-900 text-emerald-300' : 'bg-slate-800 text-slate-400'}">${okRating ? '✓' : '○'} ⭐ ${next.reqRating.toFixed(1)}</span>
            <span class="rounded-lg px-1 py-1 ${okCoins ? 'bg-emerald-900 text-emerald-300' : 'bg-slate-800 text-slate-400'}">${okCoins ? '✓' : '○'} ${next.cost.toLocaleString()} Xu</span>
          </div>
          <button ${canUpgrade ? '' : 'disabled'} onclick="upgradeShopStage()" class="w-full py-1.5 rounded-xl text-[9px] font-black ${canUpgrade ? 'bg-emerald-600 hover:bg-emerald-500 text-white tap-scale' : 'bg-slate-800 text-slate-500'}">NÂNG CẤP QUÁN → ${next.name.toUpperCase()}</button>
          <p class="text-[7px] text-slate-400 text-center">Nâng cấp tặng +1 SP nhưng cũng tăng chi phí vận hành mỗi ngày.</p>
        </div>`;
    }

    function upgradeShopStage() {
      ensureGrowthState();
      const next = SHOP_STAGE_CONFIG[gameState.shopStage + 1];
      if (!next) return showToast('Quán đã đạt bậc cao nhất!', '🏆');
      if (gameState.level < next.reqLevel) return showToast(`Cần đạt Lv.${next.reqLevel}!`, '⚠️');
      if (gameState.reputation < next.reqRating) return showToast(`Cần đánh giá quán ít nhất ${next.reqRating.toFixed(1)} sao!`, '⭐');
      if (gameState.coins < next.cost) return showToast(`Cần ${next.cost.toLocaleString()} Xu để nâng cấp quán!`, '❌');
      gameState.coins -= next.cost;
      gameState.shopStage += 1;
      gameState.sp += 1;
      grantStoryUnlockPack(gameState.shopStage);
      playSound('level');
      showToast(`MỞ CỘT MỐC: ${next.icon} ${next.name}! (+1 SP)`, '🏪');
      updateHeaderStats();
      renderGrowthApp();
      saveGameToStorage();
    }

    // ==================== HỘP MÙ: CÓ LỜI/LỖ + BONUS LƯU NIỆM ====================
    function getBlindBagRarityTable() {
      const growthLuck = getGrowthBonuses().luckPct;
      const eventLuck = getDailyEventBonuses().luckPct;
      const luck = Math.max(0, Math.min(.45, growthLuck + eventLuck));
      const shift = Math.min(.08, luck * .18);
      return [
        { rarity:'none', chance:.72 - shift },
        { rarity:'green', chance:.15 + shift * .45 },
        { rarity:'blue', chance:.08 + shift * .28 },
        { rarity:'purple', chance:.035 + shift * .16 },
        { rarity:'red', chance:.012 + shift * .08 },
        { rarity:'gold', chance:.003 + shift * .03 }
      ];
    }

    function getBlindBagOutcomeTable() {
      const luck = Math.max(0, Math.min(.40, getGrowthBonuses().luckPct + getDailyEventBonuses().luckPct));
      const shift = Math.min(.09, luck * .20);
      return [
        { grade:'bad', label:'🌧️ Xui', chance:.30 - shift, color:'#94a3b8' },
        { grade:'normal', label:'🎁 Thường', chance:.50, color:'#fbbf24' },
        { grade:'lucky', label:'🍀 Hên', chance:.16 + shift * .65, color:'#34d399' },
        { grade:'jackpot', label:'✨ Đại Cát', chance:.04 + shift * .35, color:'#c084fc' }
      ];
    }

    function rollWeighted(list) {
      const total = list.reduce((sum, x) => sum + (Number(x.weight ?? x.chance) || 0), 0);
      let r = Math.random() * total;
      for (const item of list) {
        r -= Number(item.weight ?? item.chance) || 0;
        if (r <= 0) return item;
      }
      return list[list.length - 1];
    }

    function getBlindBagBasicRewards(grade = 'normal') {
      const career = gameState.currentCareer;
      const careerItems = career === 'boba'
        ? [{key:'tea_black',qty:2},{key:'topping_boba',qty:3},{key:'cup_m',qty:4}]
        : career === 'noodle'
          ? [{key:'broth_kimchi',qty:2},{key:'ntop_beef',qty:2},{key:'bowl_m',qty:3}]
          : [{key:'skewer_fish',qty:4},{key:'sauce_sweet_chili',qty:2},{key:'tray_plate',qty:3}];
      if (grade === 'bad') return [
        { weight:34, icon:'🪙', title:'Mấy Đồng Lẻ', desc:'+5 Xu', coins:5 },
        { weight:28, icon:'👛', title:'Ví Nhẹ Tênh', desc:'+12 Xu', coins:12 },
        { weight:20, icon:'📦', title:'Gói Hàng Lẻ', desc:'Một ít nguyên liệu', items:careerItems.map(x=>({key:x.key,qty:1})) },
        { weight:18, icon:'✨', title:'Mẩu Kinh Nghiệm', desc:'+10 EXP', exp:10 }
      ];
      if (grade === 'lucky') return [
        { weight:30, icon:'💵', title:'Xấp Xu Dày', desc:'+85 Xu', coins:85 },
        { weight:22, icon:'💰', title:'Bao Xu May Mắn', desc:'+120 Xu', coins:120 },
        { weight:22, icon:'📦', title:'Thùng Nguyên Liệu', desc:'Gói nguyên liệu nghề x2', items:careerItems.map(x=>({key:x.key,qty:x.qty*2})) },
        { weight:16, icon:'✨', title:'Sổ Tay Kinh Nghiệm', desc:'+70 EXP', exp:70 },
        { weight:10, icon:'⚡', title:'Điểm Kỹ Năng', desc:'+1 SP', sp:1 }
      ];
      if (grade === 'jackpot') return [
        { weight:34, icon:'🤑', title:'Hũ Xu Bất Ngờ', desc:'+220 Xu', coins:220 },
        { weight:22, icon:'💎', title:'Hộp Xu Lớn', desc:'+320 Xu', coins:320 },
        { weight:22, icon:'⚡', title:'Sổ Kỹ Năng Hiếm', desc:'+2 SP', sp:2 },
        { weight:22, icon:'🌟', title:'Bí Kíp Kinh Doanh', desc:'+160 EXP', exp:160 }
      ];
      return [
        { weight:22, icon:'🪙', title:'Túi Xu Nhỏ', desc:'+25 Xu', coins:25 },
        { weight:22, icon:'💰', title:'Hoàn Vốn Gần Đủ', desc:'+40 Xu', coins:40 },
        { weight:16, icon:'💵', title:'Túi Xu Có Lời', desc:'+60 Xu', coins:60 },
        { weight:20, icon:'📦', title:'Gói Nguyên Liệu Nghề', desc:'Nhận nguyên liệu phù hợp nghề hiện tại', items:careerItems },
        { weight:10, icon:'🌱', title:'Gói Hạt Giống', desc:'+2 Hạt Dâu +2 Hạt Lúa', items:[{key:'seed_strawberry',qty:2},{key:'seed_wheat',qty:2}] },
        { weight:10, icon:'✨', title:'Sổ Tay Kinh Nghiệm', desc:'+35 EXP', exp:35 }
      ];
    }

    function applyBlindBagBasicReward(reward) {
      if (reward.coins) gameState.coins += reward.coins;
      if (reward.exp) addExp(reward.exp);
      if (reward.sp) gameState.sp += reward.sp;
      if (Array.isArray(reward.items)) reward.items.forEach(it => gameState.inventory[it.key] = (gameState.inventory[it.key] || 0) + it.qty);
    }

    function rollBlindBagSouvenir(grade = 'normal') {
      let table = getBlindBagRarityTable().map(x => ({...x}));
      if (grade === 'bad') {
        table = table.map(x => x.rarity === 'none' ? {...x, chance:x.chance + .10} : {...x, chance:x.chance * .65});
      } else if (grade === 'lucky') {
        table = table.map(x => x.rarity === 'none' ? {...x, chance:Math.max(.35, x.chance - .16)} : {...x, chance:x.chance * 1.45});
      } else if (grade === 'jackpot') {
        table = [
          {rarity:'blue',chance:.52},{rarity:'purple',chance:.30},{rarity:'red',chance:.14},{rarity:'gold',chance:.04}
        ];
      }
      const tier = rollWeighted(table);
      if (!tier || tier.rarity === 'none') return null;
      const pool = Object.entries(SOUVENIR_CONFIG).filter(([id, item]) => item.rarity === tier.rarity && !id.startsWith('village_') && !id.startsWith('v874_'));
      if (!pool.length) return null;
      const [id, item] = pool[Math.floor(Math.random() * pool.length)];
      return { id, ...item };
    }

    function getBlindBagEntryLabel() {
      ensureV6State();
      return gameState.blindBagTokens > 0 ? `Dùng Túi Có Sẵn (x${gameState.blindBagTokens})` : 'Khui Hộp (45 Xu) ✨';
    }

    function prepareBlindBagRound() {
      ensureV6State();
      selectedBlindBagIdx = null;
      blindBagRoundLocked = false;
      blindBagRoundOutcomes = [1,2,3,4].map(() => ({...rollWeighted(getBlindBagOutcomeTable())}));
      const result = document.getElementById('blindbag-result-box');
      if (result) result.classList.add('hidden');
      const btn = document.getElementById('btn-rip-blindbag');
      if (btn) {
        btn.disabled = true;
        btn.innerText = getBlindBagEntryLabel();
        btn.onclick = ripSelectedBlindBag;
      }
      [1,2,3,4].forEach(i => {
        const box = document.getElementById(`bbag-box-${i}`);
        if (!box) return;
        box.className = 'p-3 bg-slate-800 hover:bg-amber-900/60 border-2 border-slate-700 hover:border-amber-400 rounded-2xl cursor-pointer tap-scale transition-all';
        box.innerHTML = `<span class="text-4xl block">🎁</span><span class="text-[9px] font-black text-amber-200 mt-1 block">Hộp #${i}</span><span class="text-[7px] text-slate-500">? ? ?</span>`;
      });
      renderGameCollectionSummary();
    }

    function startNextBlindBagRound() {
      prepareBlindBagRound();
      playSound('click');
    }

    function openBlindBagModal() {
      ensureV6State();
      const modal = document.getElementById('modal-blindbag');
      if (modal) modal.classList.remove('hidden');
      prepareBlindBagRound();
      playSound('click');
    }

    function closeBlindBagModal() {
      const modal = document.getElementById('modal-blindbag');
      if (modal) modal.classList.add('hidden');
      blindBagRoundLocked = false;
      playSound('click');
    }

    function openBlindBagInfo() {
      const modal = document.getElementById('modal-blindbag-info');
      if (modal) modal.classList.remove('hidden');
      const riskList = document.getElementById('blindbag-risk-list');
      if (riskList) riskList.innerHTML = getBlindBagOutcomeTable().map(t => `<div class="flex items-center justify-between rounded-lg bg-slate-900 border border-slate-800 p-1.5"><span style="color:${t.color}">${t.label}</span><b style="color:${t.color}">${(t.chance*100).toFixed(1)}%</b></div>`).join('');
      const list = document.getElementById('blindbag-odds-list');
      const table = getBlindBagRarityTable();
      if (list) {
        list.innerHTML = table.map(t => {
          const meta = t.rarity === 'none' ? {icon:'⚪',label:'Không rơi lưu niệm',color:'#94a3b8'} : SOUVENIR_RARITY[t.rarity];
          return `<div class="flex items-center justify-between rounded-lg bg-slate-900 border border-slate-800 p-1.5"><span style="color:${meta.color}">${meta.icon} ${meta.label}</span><b style="color:${meta.color}">${(t.chance*100).toFixed(t.rarity === 'gold' ? 2 : 1)}%</b></div>`;
        }).join('');
      }
      playSound('click');
    }

    function closeBlindBagInfo() {
      const modal = document.getElementById('modal-blindbag-info');
      if (modal) modal.classList.add('hidden');
      playSound('click');
    }

    function selectBlindBag(idx) {
      if (blindBagRoundLocked) return showToast('Lượt này đã mở rồi. Đóng hộp và vào lại để tạo 4 hộp mới!', '🎁');
      selectedBlindBagIdx = idx;
      [1, 2, 3, 4].forEach(i => {
        const box = document.getElementById(`bbag-box-${i}`);
        if (!box) return;
        box.className = i === idx
          ? 'p-3 bg-amber-700/80 border-2 border-amber-300 rounded-2xl cursor-pointer tap-scale transition-all shadow-lg scale-[1.02]'
          : 'p-3 bg-slate-800 border-2 border-slate-700 rounded-2xl cursor-pointer tap-scale opacity-55';
      });
      const btn = document.getElementById('btn-rip-blindbag');
      if (btn) { btn.disabled = false; btn.innerText = getBlindBagEntryLabel(); btn.onclick = ripSelectedBlindBag; }
      playSound('click');
    }

    function ripSelectedBlindBag() {
      if (blindBagRoundLocked) return;
      if (!selectedBlindBagIdx) return showToast('Hãy chọn 1 trong 4 hộp trước!', '🎁');
      let usedToken = false;
      if (gameState.blindBagTokens > 0) { gameState.blindBagTokens -= 1; usedToken = true; }
      else {
        if (gameState.coins < 45) return showToast('Không đủ 45 Xu và cũng không có Túi Mù nhặt được!', '❌');
        gameState.coins -= 45;
      }
      blindBagRoundLocked = true;
      const btn = document.getElementById('btn-rip-blindbag');
      if (btn) { btn.disabled = true; btn.innerText = 'Đang mở hộp... 🎀'; }
      playSound('serve');

      setTimeout(() => {
        const outcome = blindBagRoundOutcomes[selectedBlindBagIdx - 1] || {grade:'normal',label:'🎁 Thường',color:'#fbbf24'};
        const basic = rollWeighted(getBlindBagBasicRewards(outcome.grade));
        applyBlindBagBasicReward(basic);
        const souvenir = rollBlindBagSouvenir(outcome.grade);
        const resBox = document.getElementById('blindbag-result-box');
        const iconEl = document.getElementById('bbag-result-icon');
        const titleEl = document.getElementById('bbag-result-title');
        const descEl = document.getElementById('bbag-result-desc');
        const rarityEl = document.getElementById('bbag-result-rarity');

        [1,2,3,4].forEach(i => {
          const box = document.getElementById(`bbag-box-${i}`);
          const o = blindBagRoundOutcomes[i-1];
          if (!box || !o) return;
          box.className = `p-3 rounded-2xl border-2 ${i === selectedBlindBagIdx ? 'border-amber-300 bg-amber-950/70' : 'border-slate-700 bg-slate-800 opacity-75'} transition-all`;
          box.innerHTML = `<span class="text-3xl block">${i === selectedBlindBagIdx ? '📦' : '🎁'}</span><span class="text-[9px] font-black mt-1 block" style="color:${o.color}">Hộp #${i} • ${o.label}</span><span class="text-[7px] text-slate-500">${i === selectedBlindBagIdx ? 'Bạn đã chọn hộp này' : 'Hộp đã bỏ lỡ'}</span>`;
        });

        if (souvenir) {
          const meta = SOUVENIR_RARITY[souvenir.rarity];
          addSouvenir(souvenir.id, `Hộp #${selectedBlindBagIdx}`);
          if (iconEl) iconEl.innerText = souvenir.icon;
          if (titleEl) titleEl.innerText = `${outcome.label} • ${souvenir.name}`;
          if (descEl) descEl.innerText = `Quà chính: ${basic.title} (${basic.desc}). BONUS lưu niệm: ${souvenir.name}!`;
          if (rarityEl) { rarityEl.innerText = meta.label; rarityEl.style.color = meta.color; }
          playSound(souvenir.rarity === 'gold' || souvenir.rarity === 'red' ? 'level' : 'coin');
        } else {
          if (iconEl) iconEl.innerText = basic.icon;
          if (titleEl) titleEl.innerText = `${outcome.label} • ${basic.title}`;
          if (descEl) descEl.innerText = `${basic.desc}. ${usedToken ? 'Lượt này dùng Túi Mù nhặt được' : 'Bạn đã trả 45 Xu'}, nên kết quả vẫn có thể lời, hòa hoặc lỗ. Không có lưu niệm bonus lần này.`;
          if (rarityEl) { rarityEl.innerText = outcome.grade === 'bad' ? '🌧️ Hộp xui — rủi ro đã xảy ra' : '🎁 Không rơi lưu niệm'; rarityEl.style.color = outcome.color; }
          playSound(outcome.grade === 'bad' ? 'error' : 'coin');
        }
        if (resBox) resBox.classList.remove('hidden');
        if (btn) { btn.innerText = `Lượt Mới • ${gameState.blindBagTokens > 0 ? `🎁 x${gameState.blindBagTokens}` : '45 Xu'}`; btn.disabled = false; btn.onclick = startNextBlindBagRound; }
        renderGameCollectionSummary();
        renderWarehouseUI();
        updateHeaderStats();
        saveGameToStorage();
      }, 850);
    }

    // ==================== MINI GAME: GHÉP THẺ ====================
    let memoryState = null;
    let memoryTimer = null;

    function openMemoryGame() {
      ensureV6State();
      const modal = document.getElementById('modal-memory-game');
      if (modal) modal.classList.remove('hidden');
      resetMemoryGameUI();
      playSound('click');
    }

    function closeMemoryGame() {
      clearInterval(memoryTimer);
      memoryTimer = null;
      const modal = document.getElementById('modal-memory-game');
      if (modal) modal.classList.add('hidden');
      playSound('click');
    }

    function resetMemoryGameUI() {
      clearInterval(memoryTimer);
      memoryTimer = null;
      memoryState = null;
      const grid = document.getElementById('memory-grid');
      if (grid) grid.innerHTML = Array.from({length:12}, (_,i) => `<button disabled class="h-14 rounded-xl bg-slate-800 border border-slate-700 text-xl">❔</button>`).join('');
      const t = document.getElementById('memory-time'); if (t) t.innerText = '45';
      const m = document.getElementById('memory-moves'); if (m) m.innerText = '0';
      const c = document.getElementById('memory-combo'); if (c) c.innerText = '0';
      const freeToday = Number(gameState.miniGameDaily.cardsPlayedDay) !== Number(gameState.day);
      const msg = document.getElementById('memory-msg'); if (msg) msg.innerText = freeToday ? 'Lượt đầu hôm nay miễn phí. Ghép nhanh để tối ưu thưởng!' : 'Lượt miễn phí hôm nay đã dùng • chơi lại 12 Xu.';
      const btn = document.getElementById('memory-start-btn'); if (btn) { btn.disabled=false; btn.innerText=freeToday ? 'Bắt Đầu • MIỄN PHÍ 🃏' : 'Chơi Lại (12 Xu) 🃏'; }
    }

    function startMemoryGame() {
      ensureV6State();
      const isFree = Number(gameState.miniGameDaily.cardsPlayedDay) !== Number(gameState.day);
      const cost = isFree ? 0 : 12;
      if (cost > 0 && gameState.coins < cost) return showToast(`Cần ${cost} Xu để chơi lại Ghép Thẻ!`, '🪙');
      if (cost > 0) gameState.coins -= cost;
      gameState.miniGameDaily.cardsPlayedDay = gameState.day;
      updateHeaderStats();
      const icons = ['🌾','🍓','🌶️','🌽','🍯','🥚'];
      const deck = [...icons, ...icons].sort(() => Math.random() - 0.5);
      memoryState = { deck, open: [], matched: new Set(), moves: 0, combo: 0, bestCombo: 0, time: 45, locked: false, finished: false };
      renderMemoryGrid();
      const btn = document.getElementById('memory-start-btn'); if (btn) { btn.disabled=true; btn.innerText='Đang Chơi...'; }
      const msg = document.getElementById('memory-msg'); if (msg) msg.innerText = 'Tìm đủ 6 cặp! Ghép liên tiếp để tăng combo.';
      clearInterval(memoryTimer);
      memoryTimer = setInterval(() => {
        if (!memoryState || memoryState.finished) return;
        memoryState.time -= 1;
        const t = document.getElementById('memory-time'); if (t) t.innerText = memoryState.time;
        if (memoryState.time <= 0) finishMemoryGame(false);
      }, 1000);
      playSound('serve');
    }

    function renderMemoryGrid() {
      const grid = document.getElementById('memory-grid');
      if (!grid || !memoryState) return;
      grid.innerHTML = memoryState.deck.map((icon, idx) => {
        const shown = memoryState.open.includes(idx) || memoryState.matched.has(idx);
        const matched = memoryState.matched.has(idx);
        return `<button onclick="flipMemoryCard(${idx})" ${matched ? 'disabled' : ''} class="h-14 rounded-xl border text-2xl font-black tap-scale ${matched ? 'bg-emerald-700 border-emerald-400' : shown ? 'bg-indigo-600 border-indigo-300' : 'bg-slate-800 hover:bg-slate-700 border-slate-700'}">${shown ? icon : '❔'}</button>`;
      }).join('');
      const m = document.getElementById('memory-moves'); if (m) m.innerText = memoryState.moves;
      const c = document.getElementById('memory-combo'); if (c) c.innerText = memoryState.combo;
    }

    function flipMemoryCard(idx) {
      if (!memoryState || memoryState.finished || memoryState.locked) return;
      if (memoryState.open.includes(idx) || memoryState.matched.has(idx)) return;
      memoryState.open.push(idx);
      renderMemoryGrid();
      playSound('click');
      if (memoryState.open.length < 2) return;

      memoryState.moves += 1;
      const [a,b] = memoryState.open;
      if (memoryState.deck[a] === memoryState.deck[b]) {
        memoryState.matched.add(a); memoryState.matched.add(b);
        memoryState.open = [];
        memoryState.combo += 1;
        memoryState.bestCombo = Math.max(memoryState.bestCombo, memoryState.combo);
        playSound('coin');
        renderMemoryGrid();
        if (memoryState.matched.size === memoryState.deck.length) finishMemoryGame(true);
      } else {
        memoryState.combo = 0;
        memoryState.locked = true;
        renderMemoryGrid();
        setTimeout(() => {
          if (!memoryState || memoryState.finished) return;
          memoryState.open = [];
          memoryState.locked = false;
          renderMemoryGrid();
        }, 700);
      }
    }

    function finishMemoryGame(won) {
      if (!memoryState || memoryState.finished) return;
      memoryState.finished = true;
      clearInterval(memoryTimer); memoryTimer = null;
      const msg = document.getElementById('memory-msg');
      const btn = document.getElementById('memory-start-btn');
      if (won) {
        const speedBonus = Math.max(0, memoryState.time);
        const moveBonus = Math.max(0, 24 - memoryState.moves) * 2;
        const comboBonus = memoryState.bestCombo * 3;
        const reward = 25 + Math.min(55, speedBonus + moveBonus + comboBonus);
        gameState.coins += reward;
        const seeds = memoryState.bestCombo >= 4 ? 2 : 1;
        gameState.inventory.seed_strawberry = (gameState.inventory.seed_strawberry || 0) + seeds;
        addExp(20);
        if (msg) msg.innerText = `Hoàn thành! +${reward} Xu, +${seeds} Hạt Dâu • ${memoryState.moves} lượt • combo cao nhất x${memoryState.bestCombo}`;
        playSound('level');
        showToast(`Ghép Thẻ thắng! +${reward} Xu`, '🃏');
        if (memoryState.bestCombo >= 6 && memoryState.time >= 15 && Math.random() < .10) {
          awardRandomSouvenirByRarities(['green','blue'], 'Perfect Ghép Thẻ');
        }
      } else {
        if (msg) msg.innerText = `Hết giờ! Bạn ghép được ${memoryState.matched.size/2}/6 cặp. Không có thưởng chính.`;
        playSound('error');
      }
      if (btn) { btn.disabled=false; btn.innerText='Chơi Lại (12 Xu) 🔄'; }
      updateHeaderStats();
      saveGameToStorage();
    }

    // ==================== MINI GAME: VÒNG QUAY TIMING ====================
    let wheelState = { spinning:false, angle:0, speed:11, timer:null };
    const WHEEL_SEGMENTS = [
      {label:'20 Xu', icon:'🪙', coins:20},
      {label:'35 Xu', icon:'💰', coins:35},
      {label:'1 Mật Ong', icon:'🍯', item:'honey', qty:1},
      {label:'50 Xu', icon:'🪙', coins:50},
      {label:'HỤT', icon:'💨', coins:0},
      {label:'2 Hạt Dâu', icon:'🌱', item:'seed_strawberry', qty:2},
      {label:'80 Xu', icon:'💎', coins:80},
      {label:'JACKPOT 120 Xu', icon:'👑', coins:120}
    ];

    function openWheelGame() {
      ensureV6State();
      const modal = document.getElementById('modal-wheel-game'); if (modal) modal.classList.remove('hidden');
      stopWheelAnimation(false);
      wheelState.angle = 0;
      const disc = document.getElementById('wheel-disc'); if (disc) disc.style.transform='rotate(0deg)';
      const result = document.getElementById('wheel-result'); if (result) result.innerText='Nhấn QUAY, quan sát tốc độ rồi căn thời điểm bấm DỪNG.';
      const wheelFree = Number(gameState.miniGameDaily.wheelPlayedDay) !== Number(gameState.day);
      const btn = document.getElementById('wheel-action-btn'); if (btn) { btn.innerText=wheelFree ? 'QUAY MIỄN PHÍ 🎡' : 'QUAY (15 Xu) 🎡'; btn.onclick=startWheelTimingGame; btn.className='w-full py-2 bg-cyan-600 hover:bg-cyan-500 rounded-xl text-xs font-black tap-scale'; }
      playSound('click');
    }

    function closeWheelGame() {
      stopWheelAnimation(false);
      const modal = document.getElementById('modal-wheel-game'); if (modal) modal.classList.add('hidden');
      playSound('click');
    }

    function startWheelTimingGame() {
      if (wheelState.spinning) return;
      ensureV6State();
      const isFree = Number(gameState.miniGameDaily.wheelPlayedDay) !== Number(gameState.day);
      const cost = isFree ? 0 : 15;
      if (cost > 0 && gameState.coins < cost) return showToast(`Cần ${cost} Xu để quay thêm!`, '🪙');
      if (cost > 0) gameState.coins -= cost;
      gameState.miniGameDaily.wheelPlayedDay = gameState.day;
      updateHeaderStats();
      wheelState.spinning = true;
      wheelState.speed = 8 + Math.min(9, Math.floor(gameState.level / 8));
      const btn = document.getElementById('wheel-action-btn');
      if (btn) { btn.innerText='DỪNG! 🛑'; btn.onclick=stopWheelTimingGame; btn.className='w-full py-2 bg-rose-600 hover:bg-rose-500 rounded-xl text-xs font-black tap-scale'; }
      const result = document.getElementById('wheel-result'); if (result) result.innerText='Đang quay... bấm DỪNG đúng lúc bạn muốn!';
      clearInterval(wheelState.timer);
      wheelState.timer = setInterval(() => {
        wheelState.angle = (wheelState.angle + wheelState.speed) % 360;
        const disc = document.getElementById('wheel-disc'); if (disc) disc.style.transform = `rotate(${wheelState.angle}deg)`;
      }, 30);
      playSound('serve');
    }

    function stopWheelAnimation(resetButton = true) {
      clearInterval(wheelState.timer); wheelState.timer = null; wheelState.spinning = false;
      if (resetButton) {
        const btn = document.getElementById('wheel-action-btn');
        if (btn) { btn.innerText='QUAY LẠI (15 Xu) 🔄'; btn.onclick=startWheelTimingGame; btn.className='w-full py-2 bg-cyan-600 hover:bg-cyan-500 rounded-xl text-xs font-black tap-scale'; }
      }
    }

    function stopWheelTimingGame() {
      if (!wheelState.spinning) return;
      stopWheelAnimation(true);
      // Kim cố định ở 12h. Khi đĩa quay angle, ô dưới kim tương ứng góc ngược lại.
      const normalized = (360 - (wheelState.angle % 360)) % 360;
      const index = Math.floor((normalized + 22.5) / 45) % 8;
      const prize = WHEEL_SEGMENTS[index];
      if (prize.coins) gameState.coins += prize.coins;
      if (prize.item) gameState.inventory[prize.item] = (gameState.inventory[prize.item] || 0) + prize.qty;
      const result = document.getElementById('wheel-result');
      if (result) result.innerText = prize.coins || prize.item ? `${prize.icon} Trúng ${prize.label}! Góc dừng ${Math.round(wheelState.angle)}°` : `💨 Trượt mất rồi! Góc dừng ${Math.round(wheelState.angle)}°`;
      playSound(prize.coins || prize.item ? 'coin' : 'error');
      showToast(prize.coins || prize.item ? `Vòng quay: ${prize.label}!` : 'Vòng quay: hụt!', prize.icon);
      if (prize.coins >= 120 && Math.random() < .12) awardRandomSouvenirByRarities(['blue','purple'], 'Jackpot Vòng Quay');
      updateHeaderStats();
      saveGameToStorage();
    }

    // ==================== MINI GAME: SĂN CHUỘT KHO ====================
    function openWhackGame() {
      ensureV6State();
      stopWhackGameTimers();
      whackState = null;
      const modal = document.getElementById('modal-whack-game'); if (modal) modal.classList.remove('hidden');
      const grid = document.getElementById('whack-grid');
      if (grid) grid.innerHTML = Array.from({length:9}, (_,i) => `<button onclick="hitWhackSlot(${i})" class="h-16 rounded-2xl bg-slate-800 border border-slate-700 text-3xl tap-scale">🕳️</button>`).join('');
      const time = document.getElementById('whack-time'); if (time) time.innerText='20';
      const score = document.getElementById('whack-score'); if (score) score.innerText='0';
      const combo = document.getElementById('whack-combo'); if (combo) combo.innerText='0';
      const msg = document.getElementById('whack-msg'); if (msg) msg.innerText=`Best: ${gameState.miniGameScores.whackBest || 0} • 25 điểm bắt đầu có lời • 45+ có cơ hội đồ lưu niệm.`;
      const btn = document.getElementById('whack-start-btn'); if (btn) { btn.disabled=false; btn.innerText='Chơi (20 Xu) 🐭'; }
      playSound('click');
    }

    function closeWhackGame() {
      stopWhackGameTimers();
      const modal = document.getElementById('modal-whack-game'); if (modal) modal.classList.add('hidden');
      playSound('click');
    }

    function stopWhackGameTimers() {
      clearInterval(whackTimer); whackTimer = null;
      clearInterval(whackSpawnTimer); whackSpawnTimer = null;
      if (whackState) whackState.active = false;
    }

    function startWhackGame() {
      if (gameState.coins < 20) return showToast('Cần 20 Xu để vào Săn Chuột Kho!', '🪙');
      gameState.coins -= 20;
      updateHeaderStats();
      stopWhackGameTimers();
      whackState = { active:true, time:20, score:0, combo:0, bestCombo:0, targetIndex:-1, targetType:'mouse' };
      const btn = document.getElementById('whack-start-btn'); if (btn) { btn.disabled=true; btn.innerText='Đang săn...'; }
      spawnWhackTarget();
      whackSpawnTimer = setInterval(spawnWhackTarget, 560);
      whackTimer = setInterval(() => {
        if (!whackState || !whackState.active) return;
        whackState.time -= 1;
        const t = document.getElementById('whack-time'); if (t) t.innerText=whackState.time;
        if (whackState.time <= 0) finishWhackGame();
      },1000);
      playSound('serve');
      saveGameToStorage();
    }

    function spawnWhackTarget() {
      if (!whackState || !whackState.active) return;
      whackState.targetIndex = Math.floor(Math.random()*9);
      const r = Math.random();
      whackState.targetType = r < .12 ? 'cat' : r < .28 ? 'gold' : 'mouse';
      renderWhackGrid();
    }

    function renderWhackGrid() {
      const grid = document.getElementById('whack-grid'); if (!grid || !whackState) return;
      const icon = whackState.targetType === 'gold' ? '🐹' : whackState.targetType === 'cat' ? '🐱' : '🐭';
      grid.innerHTML = Array.from({length:9}, (_,i) => {
        const active = i === whackState.targetIndex;
        const cls = active && whackState.targetType === 'gold' ? 'bg-amber-700 border-amber-300' : active && whackState.targetType === 'cat' ? 'bg-rose-900 border-rose-400' : active ? 'bg-emerald-900 border-emerald-400' : 'bg-slate-800 border-slate-700';
        return `<button onclick="hitWhackSlot(${i})" class="h-16 rounded-2xl border text-3xl tap-scale ${cls}">${active ? icon : '🕳️'}</button>`;
      }).join('');
      const score = document.getElementById('whack-score'); if (score) score.innerText=whackState.score;
      const combo = document.getElementById('whack-combo'); if (combo) combo.innerText=whackState.combo;
    }

    function hitWhackSlot(idx) {
      if (!whackState || !whackState.active) return;
      if (idx !== whackState.targetIndex) {
        whackState.score = Math.max(0, whackState.score - 1);
        whackState.combo = 0;
        playSound('error');
        renderWhackGrid();
        return;
      }
      if (whackState.targetType === 'cat') {
        whackState.score = Math.max(0, whackState.score - 3);
        whackState.combo = 0;
        const msg = document.getElementById('whack-msg'); if (msg) msg.innerText='Ối! Đập nhầm mèo giữ kho: -3 điểm.';
        playSound('error');
      } else {
        whackState.combo += 1;
        whackState.bestCombo = Math.max(whackState.bestCombo, whackState.combo);
        const comboBonus = Math.floor(whackState.combo / 5);
        const gain = whackState.targetType === 'gold' ? 5 + comboBonus : 1 + comboBonus;
        whackState.score += gain;
        playSound(whackState.targetType === 'gold' ? 'coin' : 'click');
      }
      whackState.targetIndex = -1;
      renderWhackGrid();
    }

    function finishWhackGame() {
      if (!whackState || !whackState.active) return;
      whackState.active = false;
      stopWhackGameTimers();
      const score = whackState.score;
      const reward = score >= 50 ? 80 : score >= 40 ? 58 : score >= 30 ? 38 : score >= 20 ? 22 : Math.max(5, Math.floor(score/2));
      gameState.coins += reward;
      gameState.miniGameScores.whackBest = Math.max(gameState.miniGameScores.whackBest || 0, score);
      addExp(Math.min(35, 8 + Math.floor(score/2)));
      let extra = '';
      if (score >= 45 && Math.random() < .14) {
        const gift = awardRandomSouvenirByRarities(['green','blue','purple'], 'Săn Chuột Kho');
        if (gift) extra = ` • rơi ${gift.name}!`;
      }
      const msg = document.getElementById('whack-msg'); if (msg) msg.innerText=`Hết giờ! ${score} điểm • +${reward} Xu • combo cao nhất x${whackState.bestCombo}${extra}`;
      const btn = document.getElementById('whack-start-btn'); if (btn) { btn.disabled=false; btn.innerText='Chơi Lại (20 Xu) 🐭'; }
      showToast(`Săn Chuột: ${score} điểm • +${reward} Xu`, '🐭');
      renderGameCollectionSummary(); updateHeaderStats(); saveGameToStorage();
    }

    // ==================== MINI GAME: XẾP THÁP LY ====================
    function openStackGame() {
      ensureV6State();
      stopStackTimer();
      stackState = null;
      const modal = document.getElementById('modal-stack-game'); if (modal) modal.classList.remove('hidden');
      const tower = document.getElementById('stack-tower'); if (tower) tower.innerHTML='';
      const lv = document.getElementById('stack-level'); if (lv) lv.innerText='0';
      const pf = document.getElementById('stack-perfect'); if (pf) pf.innerText='0';
      const best = document.getElementById('stack-best'); if (best) best.innerText=gameState.miniGameScores.stackBest || 0;
      const runner = document.getElementById('stack-runner'); if (runner) runner.style.left='0%';
      const target = document.getElementById('stack-target'); if (target) { target.style.left='40%'; target.style.width='20%'; }
      const msg = document.getElementById('stack-msg'); if (msg) msg.innerText='Càng lên cao vùng đáp càng hẹp và thanh chạy càng nhanh.';
      const btn = document.getElementById('stack-action-btn'); if (btn) { btn.disabled=false; btn.innerText='Chơi (25 Xu) 🥤'; btn.onclick=startStackGame; }
      playSound('click');
    }

    function closeStackGame() {
      stopStackTimer();
      const modal = document.getElementById('modal-stack-game'); if (modal) modal.classList.add('hidden');
      playSound('click');
    }

    function stopStackTimer() {
      clearInterval(stackTimer); stackTimer = null;
      if (stackState) stackState.running = false;
    }

    function startStackGame() {
      if (gameState.coins < 25) return showToast('Cần 25 Xu để vào Xếp Tháp Ly!', '🪙');
      gameState.coins -= 25;
      updateHeaderStats();
      stopStackTimer();
      stackState = { running:true, level:0, perfect:0, pos:0, dir:1, speed:1.6, targetLeft:40, targetWidth:20 };
      const tower = document.getElementById('stack-tower'); if (tower) tower.innerHTML='';
      const btn = document.getElementById('stack-action-btn'); if (btn) { btn.innerText='THẢ LY! 🎯'; btn.onclick=dropStackCup; }
      const msg = document.getElementById('stack-msg'); if (msg) msg.innerText='Căn tâm thanh xanh vào vùng mục tiêu. PERFECT cho thêm thưởng!';
      updateStackUI();
      stackTimer = setInterval(() => {
        if (!stackState || !stackState.running) return;
        stackState.pos += stackState.speed * stackState.dir;
        if (stackState.pos >= 92) { stackState.pos=92; stackState.dir=-1; }
        if (stackState.pos <= 0) { stackState.pos=0; stackState.dir=1; }
        const runner = document.getElementById('stack-runner'); if (runner) runner.style.left=`${stackState.pos}%`;
      },30);
      playSound('serve'); saveGameToStorage();
    }

    function updateStackUI() {
      if (!stackState) return;
      const lv = document.getElementById('stack-level'); if (lv) lv.innerText=stackState.level;
      const pf = document.getElementById('stack-perfect'); if (pf) pf.innerText=stackState.perfect;
      const target = document.getElementById('stack-target'); if (target) { target.style.left=`${stackState.targetLeft}%`; target.style.width=`${stackState.targetWidth}%`; }
      const runner = document.getElementById('stack-runner'); if (runner) runner.style.left=`${stackState.pos}%`;
    }

    function dropStackCup() {
      if (!stackState || !stackState.running) return;
      const runnerCenter = stackState.pos + 4;
      const targetCenter = stackState.targetLeft + stackState.targetWidth/2;
      const inside = runnerCenter >= stackState.targetLeft && runnerCenter <= stackState.targetLeft + stackState.targetWidth;
      const perfect = Math.abs(runnerCenter - targetCenter) <= Math.max(2.2, stackState.targetWidth * .18);
      if (!inside) return finishStackGame(false);

      stackState.level += 1;
      if (perfect) stackState.perfect += 1;
      const tower = document.getElementById('stack-tower');
      if (tower) {
        const cup = document.createElement('div');
        const width = Math.max(42, 88 - stackState.level*4);
        cup.className = 'h-3 rounded-md border border-white/40 flex items-center justify-center text-[7px] font-black text-white';
        cup.style.width = `${width}%`;
        cup.style.background = perfect ? 'rgba(16,185,129,.85)' : 'rgba(14,165,233,.75)';
        cup.innerText = perfect ? `Tầng ${stackState.level} • PERFECT` : `Tầng ${stackState.level}`;
        tower.appendChild(cup);
      }
      playSound(perfect ? 'coin' : 'click');
      if (stackState.level >= 8) return finishStackGame(true);
      stackState.targetWidth = Math.max(8, 20 - stackState.level * 1.45);
      stackState.targetLeft = 8 + Math.random() * (84 - stackState.targetWidth);
      stackState.speed = 1.6 + stackState.level * .38;
      stackState.dir = Math.random() < .5 ? 1 : -1;
      stackState.pos = stackState.dir > 0 ? 0 : 92;
      const msg = document.getElementById('stack-msg'); if (msg) msg.innerText=perfect ? '✨ PERFECT! Tầng sau nhanh hơn.' : 'Đặt được! Cẩn thận tầng tiếp theo.';
      updateStackUI();
    }

    function finishStackGame(completed) {
      if (!stackState) return;
      const level = stackState.level;
      const perfects = stackState.perfect;
      stopStackTimer();
      const reward = completed ? 65 + perfects*7 : 5 + level*6 + perfects*3;
      gameState.coins += reward;
      gameState.miniGameScores.stackBest = Math.max(gameState.miniGameScores.stackBest || 0, level);
      addExp(8 + level*3);
      let extra='';
      if (completed && Math.random() < (.10 + perfects*.015)) {
        const gift = awardRandomSouvenirByRarities(perfects >= 5 ? ['blue','purple','red'] : ['green','blue','purple'], 'Xếp Tháp Ly');
        if (gift) extra=` • rơi ${gift.name}!`;
      }
      const msg = document.getElementById('stack-msg');
      if (msg) msg.innerText = completed ? `🏆 Hoàn thành 8 tầng! +${reward} Xu • ${perfects} PERFECT${extra}` : `💥 Tháp đổ ở tầng ${level+1}. Bạn giữ +${reward} Xu • ${perfects} PERFECT.`;
      const btn = document.getElementById('stack-action-btn'); if (btn) { btn.innerText='Chơi Lại (25 Xu) 🥤'; btn.onclick=startStackGame; }
      const best = document.getElementById('stack-best'); if (best) best.innerText=gameState.miniGameScores.stackBest;
      showToast(completed ? `Xếp Tháp hoàn tất! +${reward} Xu` : `Xếp được ${level} tầng • +${reward} Xu`, '🥤');
      renderGameCollectionSummary(); updateHeaderStats(); saveGameToStorage();
    }

    // Giữ hàm cũ để tương thích nếu còn nút/đoạn code nào gọi startMiniGame().
    function startMiniGame(type) {
      if (type === 'cards') openMemoryGame();
      else if (type === 'wheel') openWheelGame();
      else if (type === 'whack') openWhackGame();
      else if (type === 'stack') openStackGame();
    }

    // App Ngân Hàng & Thế Chấp
    function renderBankApp() {
      const debtText = document.getElementById('bank-debt-text');
      if (debtText) debtText.innerText = `${gameState.debt.toLocaleString()} Xu`;

      const mCount = document.getElementById('mortgage-plots-count');
      if (mCount) mCount.innerText = `Đang cắm: ${gameState.mortgagedPlots || 0} ô`;

      const loans = [
        { id: 1, name: "Vay Nóng 150 Xu", amount: 150, rate: "5%/ngày", minLv: 1 },
        { id: 2, name: "Quỹ Khuyến Nông 400 Xu", amount: 400, rate: "4%/ngày", minLv: 3 },
        { id: 3, name: "Đầu Tư Máy Móc 1.000 Xu", amount: 1000, rate: "6%/ngày", minLv: 8 }
      ];

      const list = document.getElementById('bank-loans-list');
      if (list) {
        list.innerHTML = '';
        loans.forEach(loan => {
          const canTake = gameState.level >= loan.minLv;
          list.innerHTML += `
            <div class="p-1.5 bg-slate-800 rounded-xl border border-slate-700 flex items-center justify-between text-xs">
              <div>
                <b class="text-amber-200 text-xs block">${loan.name}</b>
                <span class="text-[8px] text-slate-400">Lãi ${loan.rate} • Yêu cầu: Lv.${loan.minLv}</span>
              </div>
              ${canTake ? `
                <button onclick="takeBankLoan(${loan.amount})" class="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[8px] rounded-lg tap-scale">
                  Vay
                </button>
              ` : `
                <span class="text-[8px] text-slate-500 font-bold">Khóa</span>
              `}
            </div>
          `;
        });
      }
    }

    function takeBankLoan(amount) {
      gameState.coins += amount;
      gameState.debt += Math.floor(amount * 1.15);
      playSound('coin');
      showToast(`Đã giải ngân +${amount} Xu!`, "🏦");
      updateHeaderStats();
      renderBankApp();
      saveGameToStorage();
    }

    function payDebtAmount(amount) {
      if (gameState.debt <= 0) return showToast("Bạn không có nợ ngân hàng!", "✨");
      const pay = Math.min(amount, gameState.debt);
      if (gameState.coins < pay) return showToast("Không đủ Xu trả nợ!", "❌");
      gameState.coins -= pay;
      gameState.debt -= pay;
      playSound('coin');
      showToast(`Đã trả -${pay} Xu nợ!`, "🏦");
      updateHeaderStats();
      renderBankApp();
      saveGameToStorage();
    }

    function mortgagePlotDeed() {
      if (!gameState.mortgagedPlots) gameState.mortgagedPlots = 0;
      const availablePlotIdx = gameState.farmPlots.findIndex((p, idx) => p.unlocked && idx > 0 && !p.mortgaged);
      if (availablePlotIdx === -1) {
        return showToast("Không có ô đất trống hợp lệ để thế chấp!", "❌");
      }

      gameState.farmPlots[availablePlotIdx].mortgaged = true;
      gameState.mortgagedPlots += 1;
      gameState.coins += 1500;
      gameState.debt += 1800;
      playSound('coin');
      showToast(`Đã cắm sổ đỏ Ô #${availablePlotIdx + 1}! (+1.500 Xu)`, "📜");
      updateHeaderStats();
      renderFarmUI();
      renderBankApp();
      saveGameToStorage();
    }

    function redeemPlotDeed() {
      if (!gameState.mortgagedPlots || gameState.mortgagedPlots <= 0) {
        return showToast("Không có ô đất nào đang cắm sổ!", "✨");
      }
      if (gameState.coins < 1800) {
        return showToast("Cần đủ 1.800 Xu để chuộc lại sổ đỏ!", "❌");
      }

      const mortgagedPlotIdx = gameState.farmPlots.findIndex(p => p.mortgaged);
      if (mortgagedPlotIdx === -1) return;

      gameState.coins -= 1800;
      gameState.debt = Math.max(0, gameState.debt - 1800);
      gameState.farmPlots[mortgagedPlotIdx].mortgaged = false;
      gameState.mortgagedPlots -= 1;
      playSound('serve');
      showToast(`Đã chuộc thành công Ô #${mortgagedPlotIdx + 1}! 🌾`, "🔑");
      updateHeaderStats();
      renderFarmUI();
      renderBankApp();
      saveGameToStorage();
    }

    function openBankruptcyModal() {
      const modal = document.getElementById('modal-bankruptcy');
      if (modal) modal.classList.remove('hidden');
      playSound('click');
    }

    function closeBankruptcyModal() {
      const modal = document.getElementById('modal-bankruptcy');
      if (modal) modal.classList.add('hidden');
      playSound('click');
    }

    function confirmBankruptcyAndRestart(careerKey) {
      closeBankruptcyModal();

      gameState.day = 1;
      gameState.coins = 450;
      gameState.debt = 0;
      gameState.level = 1;
      gameState.exp = 0;
      gameState.sp = 0;
      gameState.phase = 'prep';
      gameState.shiftClosed = false;
      gameState.currentCareer = careerKey;
      gameState.careerLocked = true; // Khóa nghề mới cho cả run
      // Preserve custom shop name and avatar across a change of career/run.
      gameState.shopName = gameState.shopName || (careerKey === 'boba' ? 'Trà Sữa Bé Thỏ' : careerKey === 'noodle' ? 'Mì Cay Quê Nhà' : 'Xiên Que Đầu Làng');
      gameState.reputation = 5.0;
      gameState.ratingCount = 1;
      gameState.reviews = [];
      gameState.nextReviewId = 1;
      gameState.skills = { sales: 0, service: 0, luck: 0, farm: 0 };
      gameState.skillTalents = {};
      gameState.decorations = [];
      gameState.shopStage = 0;
      gameState.staff = [];
      gameState.staffHR = null;
      gameState.soppiFlashSale = null;
      gameState.souvenirs = {};
      gameState.notifications = [];
      gameState.nextNotificationId = 1;
      gameState.dailyWorldEvent = null;
      gameState.dailyIncidentCount = 0;
      gameState.nextCustomerPatienceMod = 0;
      gameState.lotteryActiveTicket = null;
      gameState.lotteryHistory = [];
      gameState.lotteryTickets = 0;
      gameState.blindBagTokens = 0;
      gameState.miniGameScores = { whackBest: 0, stackBest: 0 };
      gameState.miniGameDaily = { cardsPlayedDay: 0, wheelPlayedDay: 0 };
      gameState.automation = { farmEnabled: false, barnEnabled: false, shopFastEnabled: false };
      gameState.villageEnergy = 100;
      gameState.villageEnergyDay = 1;
      gameState.villageZone = 'lane';
      gameState.villageKarma = 10;
      gameState.villageTripsToday = 0;
      gameState.villageEncounterId = null;
      gameState.villageHistory = [];
      gameState.villageStoryFlags = {};

      if (careerKey === 'boba') {
        gameState.inventory = { cup_m: 15, tea_black: 12, tea_strawberry: 8, topping_boba: 15, topping_pudding: 6, topping_jelly: 6, topping_white_boba: 5, seed_wheat: 4, crop_wheat: 2 };
      } else if (careerKey === 'noodle') {
        gameState.inventory = { bowl_m: 12, broth_kimchi: 10, broth_mushroom: 8, ntop_beef: 8, ntop_fishcake: 8, ntop_enoki: 6, seed_wheat: 4, crop_wheat: 2 };
      } else {
        gameState.inventory = { tray_plate: 15, tray_basket: 8, skewer_fish: 15, skewer_holo: 8, skewer_beef: 8, sauce_sweet_chili: 10, sauce_tamarind: 6, seed_wheat: 4, crop_wheat: 2 };
      }

      gameState.farmPlots = [
        { unlocked: true, seed: null, lastSeed: null, growTimer: 0, watered: false, mortgaged: false },
        { unlocked: true, seed: null, lastSeed: null, growTimer: 0, watered: false, mortgaged: false },
        { unlocked: false, seed: null, lastSeed: null, growTimer: 0, watered: false, mortgaged: false },
        { unlocked: false, seed: null, lastSeed: null, growTimer: 0, watered: false, mortgaged: false },
        { unlocked: false, seed: null, lastSeed: null, growTimer: 0, watered: false, mortgaged: false },
        { unlocked: false, seed: null, lastSeed: null, growTimer: 0, watered: false, mortgaged: false }
      ];
      gameState.animals = {
        chicken: { unlocked: false, name: "Đàn Gà Mái", timer: 0, ready: false, autoFed: false, affection: 10, careCooldown: 0 },
        cow: { unlocked: false, name: "Bò Sữa Bé Bông", timer: 0, ready: false, autoFed: false, affection: 10, careCooldown: 0 },
        duck: { unlocked: false, name: "Đàn Vịt Bầu", timer: 0, ready: false, autoFed: false, affection: 10, careCooldown: 0 },
        goat: { unlocked: false, name: "Dê Núi Cà Lem", timer: 0, ready: false, autoFed: false, affection: 10, careCooldown: 0 },
        bee: { unlocked: false, name: "Tổ Ong Vườn Hoa", timer: 0, ready: false, autoFed: false, affection: 10, careCooldown: 0 }
      };
      gameState.mortgagedPlots = 0;

      currentCustomer = null;
      activeOnlineOrders = [];
      gameState.soppiOrders = [];
      queuedRandomIncident = null;
      activeRandomIncident = null;
      gameState.marketNewsIndex = Math.floor(Math.random() * MARKET_NEWS_DATABASE.length);
      gameState.lastMarketNewsNotice = null;
      rollDailyWorldEvent(true);
      announceDailyMarketNews(true);

      applyCareerLockToUI();
      updateHeaderStats();
      updateShopPhaseUI();
      renderCustomerBooth();
      renderFarmUI();
      renderBarnUI();
      renderVillageUI();
      renderMarketUI();
      renderWarehouseUI();
      renderDailyWorldEventBanner();
      renderNotificationBadge();
      renderGameCollectionSummary();

      playSound('level');
      showToast(`Đã khởi nghiệp lại với ${gameState.shopName}! Vốn 450 Xu!`, "🎉");
      saveGameToStorage();
    }

    function openSaveModal() {
      const modal = document.getElementById('modal-save');
      if (modal) modal.classList.remove('hidden');
      playSound('click');
    }

    function closeSaveModal() {
      const modal = document.getElementById('modal-save');
      if (modal) modal.classList.add('hidden');
      playSound('click');
    }

    function exportSaveCode() {
      const json = JSON.stringify(gameState);
      const b64 = btoa(unescape(encodeURIComponent(json)));
      try {
        const dummy = document.createElement('textarea');
        document.body.appendChild(dummy);
        dummy.value = b64;
        dummy.select();
        document.execCommand('copy');
        document.body.removeChild(dummy);
        showToast("Đã sao chép mã save vào Clipboard! 📋", "✅");
      } catch (e) {
        showToast("Không thể sao chép tự động!", "⚠️");
      }
    }


    const SHOP_ICON_CHOICES = [
      '🏪','🏠','🛖','🧋','🍜','🍢','🍳','🥤','🍲','🔥',
      '🐰','🐱','🐻','🦊','🌾','🌿','🌸','🍀','⭐','✨',
      '🏮','🪧','🧺','🪴','☕'
    ];
    const SHOP_AVATAR_ART_KEYS = ['bunny','shop','farm','barn','village','warehouse','reviews'];
    const SHOP_AVATAR_PICKER_OPTIONS = [...SHOP_AVATAR_ART_KEYS, ...SHOP_ICON_CHOICES];
    const V41_AVATAR_ART = {
      'v41_corgi': {label:'Cún Corgi', category:'mascot', src:'assets/images/214_js-238_d281448e96.webp'},
      'v41_cat_bow': {label:'Mèo Nơ Hồng', category:'mascot', src:'assets/images/215_js-239_5ebe922f3f.webp'},
      'v41_panda': {label:'Gấu Trúc', category:'mascot', src:'assets/images/216_js-240_09f54037f6.webp'},
      'v41_fox': {label:'Cáo Cam', category:'mascot', src:'assets/images/217_js-241_7181964ae3.webp'},
      'v41_penguin': {label:'Chim Cánh Cụt', category:'mascot', src:'assets/images/218_js-242_be026456ce.webp'},
      'v41_honey_bear': {label:'Gấu Mật Ong', category:'mascot', src:'assets/images/219_js-243_3837f0ee5a.webp'},
      'v41_deer': {label:'Nai Hoa', category:'mascot', src:'assets/images/220_js-244_667f802033.webp'},
      'v41_duck': {label:'Vịt Nón Rơm', category:'mascot', src:'assets/images/221_js-245_15e906f40c.webp'},
      'v41_chick': {label:'Gà Con', category:'mascot', src:'assets/images/222_js-246_0c83313939.webp'},
      'v41_hamster': {label:'Hamster', category:'mascot', src:'assets/images/223_js-247_796cfcb71b.webp'},
      'v41_hedgehog': {label:'Nhím Hoa', category:'mascot', src:'assets/images/224_js-248_dccd1cf0ec.webp'},
      'v41_red_panda': {label:'Gấu Trúc Đỏ', category:'mascot', src:'assets/images/225_js-249_119859ef60.webp'},
      'v41_pig': {label:'Heo Hồng', category:'mascot', src:'assets/images/226_js-250_143d722995.webp'},
      'v41_foodtruck': {label:'Xe Đồ Ăn', category:'scene', src:'assets/images/227_js-251_e07921b493.webp'},
      'v41_street_stall': {label:'Sạp Ăn Vặt', category:'scene', src:'assets/images/228_js-252_fbe0e55b4c.webp'},
      'v41_wood_cottage': {label:'Nhà Gỗ Lá', category:'scene', src:'assets/images/229_js-253_9bf25bd745.webp'},
      'v41_treehouse': {label:'Nhà Trên Cây', category:'scene', src:'assets/images/230_js-254_17491e61a9.webp'},
      'v41_windmill': {label:'Cối Xay Gió', category:'scene', src:'assets/images/231_js-255_1a4b7f5495.webp'},
      'v41_snow_house': {label:'Nhà Tuyết', category:'scene', src:'assets/images/232_js-256_8f7326b701.webp'},
      'v41_river_bridge': {label:'Cầu Suối', category:'scene', src:'assets/images/233_js-257_095e81a5f8.webp'},
      'v41_spring_river': {label:'Dòng Sông Hoa', category:'scene', src:'assets/images/234_js-258_c4ce53affe.webp'},
      'v41_night_blossoms': {label:'Trăng Hoa', category:'scene', src:'assets/images/235_js-259_36a6688e5d.webp'},
      'v41_bamboo': {label:'Rừng Trúc', category:'scene', src:'assets/images/236_js-260_b3700347b7.webp'},
      'v41_lotus_pond': {label:'Hồ Sen', category:'scene', src:'assets/images/237_js-261_fd411fe182.webp'},
      'v41_winter_cottage': {label:'Nhà Mùa Đông', category:'scene', src:'assets/images/238_js-262_5a7bec0121.webp'}
    };
    // V78: 12 chibi mascots and 8 illustrated scenes, embedded as lightweight WEBP (offline-friendly).
    Object.assign(V41_AVATAR_ART, {
      'v78_gau_truc_do': {label:'Gấu Trúc Đỏ', category:'mascot', src:'assets/images/239_js-263_88f9d89568.webp'},
      'v78_ech_xanh': {label:'Ếch Xanh', category:'mascot', src:'assets/images/240_js-264_d5200dcb25.webp'},
      'v78_capybara': {label:'Capybara', category:'mascot', src:'assets/images/241_js-265_1ea0250ec7.webp'},
      'v78_meo_trang': {label:'Mèo Trắng', category:'mascot', src:'assets/images/242_js-266_6a28ebfca2.webp'},
      'v78_cho_shiba': {label:'Chó Shiba', category:'mascot', src:'assets/images/243_js-267_6a9d1bd58b.webp'},
      'v78_tho_dau_bep': {label:'Thỏ Đầu Bếp', category:'mascot', src:'assets/images/244_js-268_e86b05a08e.webp'},
      'v78_gau_meo': {label:'Gấu Mèo', category:'mascot', src:'assets/images/245_js-269_de085bc5c9.webp'},
      'v78_cu_meo': {label:'Cú Mèo', category:'mascot', src:'assets/images/246_js-270_05efb8e90f.webp'},
      'v78_cuu_non': {label:'Cừu Non', category:'mascot', src:'assets/images/247_js-271_a9d43b15e9.webp'},
      'v78_bo_sua': {label:'Bò Sữa', category:'mascot', src:'assets/images/248_js-272_e7030047dc.webp'},
      'v78_vit_khan_len': {label:'Vịt Khăn Len', category:'mascot', src:'assets/images/249_js-273_675aa2a1eb.webp'},
      'v78_cao_no': {label:'Cáo Nơ', category:'mascot', src:'assets/images/250_js-274_5656ff2251.webp'},
      'v78_quan_mi_cay': {label:'Quán Mì Cay', category:'scene', src:'assets/images/251_js-275_f33aaa70b3.webp'},
      'v78_quan_tra_sua': {label:'Quầy Trà Sữa', category:'scene', src:'assets/images/252_js-276_85bb774228.webp'},
      'v78_khu_vuon': {label:'Khu Vườn Nhỏ', category:'scene', src:'assets/images/253_js-277_aa011e36ff.webp'},
      'v78_chuong_nuoi': {label:'Chuồng Dễ Thương', category:'scene', src:'assets/images/254_js-278_d5ab06ad7f.webp'},
      'v78_can_bep': {label:'Căn Bếp Nấu Ăn', category:'scene', src:'assets/images/255_js-279_5e20114c13.webp'},
      'v78_cho_que': {label:'Chợ Quê', category:'scene', src:'assets/images/256_js-280_7c5b721031.webp'},
      'v78_phong_am': {label:'Phòng Ấm Cúng', category:'scene', src:'assets/images/257_js-281_cfcd3e593f.webp'},
      'v78_ben_song': {label:'Bến Sông Quê', category:'scene', src:'assets/images/258_js-282_5afbd91220.webp'},
    });
    const V41_SHOP_AVATAR_PICKER_OPTIONS = ['bunny',...Object.keys(V41_AVATAR_ART)];

    const SHOP_AVATAR_LABELS = {bunny:'Thỏ Bé',shop:'Tiệm Nhỏ',farm:'Mầm Cây',barn:'Bò Sữa',village:'Làng Quê',warehouse:'Rương Gỗ',reviews:'Ngôi Sao'};
    // Re-use assets that were already embedded in V30's HTML (no extra image files).
    const SHOP_BUNNY_IMAGE_SRC = document.getElementById('header-shop-avatar-image')?.getAttribute('src') || '';
    const PLAYER_CHIBI_ART = {
      male: { label:'Chibi Nam', src:"assets/images/259_js-283_3b3f2f21bc.webp" },
      female: { label:'Chibi Nữ', src:"assets/images/260_js-284_e859d7af0a.webp" }
    };

    function buildInlineSvg(markup, width=160, height=160) {
      return 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${markup}</svg>`);
    }
    function buildBadgeSvg({ bg='#f6e5c4', ring='#dfc38b', emoji='✨', accent='★', label='' }={}) {
      return buildInlineSvg(`
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="${bg}"/>
            <stop offset="100%" stop-color="#fffaf0"/>
          </linearGradient>
        </defs>
        <rect x="6" y="6" width="148" height="148" rx="30" fill="url(#g)"/>
        <rect x="12" y="12" width="136" height="136" rx="26" fill="none" stroke="${ring}" stroke-width="4" opacity=".8"/>
        <circle cx="116" cy="44" r="18" fill="#ffffff" opacity=".86"/>
        <text x="116" y="50" text-anchor="middle" font-size="15">${accent}</text>
        <text x="80" y="96" text-anchor="middle" dominant-baseline="middle" font-size="60">${emoji}</text>
        <text x="80" y="136" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" font-weight="700" fill="#78502d">${label}</text>
      `);
    }
    function buildChibiSvg({ hair='#7a4b25', outfit='#4caf84', accent='#ffd36b', skin='#ffd7b2', title='Chibi' }={}) {
      return buildInlineSvg(`
        <defs>
          <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#fff6ea"/>
            <stop offset="100%" stop-color="#fbe3d0"/>
          </linearGradient>
        </defs>
        <rect x="6" y="6" width="148" height="148" rx="30" fill="url(#bg)"/>
        <rect x="12" y="12" width="136" height="136" rx="26" fill="none" stroke="#e7c19b" stroke-width="4" opacity=".88"/>
        <ellipse cx="80" cy="55" rx="32" ry="28" fill="${hair}"/>
        <circle cx="80" cy="68" r="28" fill="${skin}"/>
        <circle cx="68" cy="66" r="3.6" fill="#432818"/>
        <circle cx="92" cy="66" r="3.6" fill="#432818"/>
        <path d="M72 79 Q80 85 88 79" fill="none" stroke="#a04c54" stroke-width="3.2" stroke-linecap="round"/>
        <rect x="52" y="92" width="56" height="38" rx="18" fill="${outfit}"/>
        <rect x="69" y="90" width="22" height="14" rx="7" fill="${accent}"/>
        <circle cx="54" cy="54" r="7" fill="${hair}"/>
        <circle cx="106" cy="54" r="7" fill="${hair}"/>
        <text x="80" y="142" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" font-weight="700" fill="#78502d">${title}</text>
      `);
    }
    function buildFoodSvg({ emoji='🍲', bg='#f8e9cd', ring='#dfbf8b', label='' }={}) {
      return buildInlineSvg(`
        <defs>
          <linearGradient id="b" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="${bg}"/>
            <stop offset="100%" stop-color="#fff8ef"/>
          </linearGradient>
        </defs>
        <rect x="7" y="7" width="146" height="146" rx="28" fill="url(#b)"/>
        <rect x="13" y="13" width="134" height="134" rx="24" fill="none" stroke="${ring}" stroke-width="4" opacity=".84"/>
        <ellipse cx="80" cy="78" rx="41" ry="28" fill="#63402a" opacity=".14"/>
        <circle cx="80" cy="74" r="34" fill="#fffaf3" opacity=".88"/>
        <text x="80" y="83" text-anchor="middle" dominant-baseline="middle" font-size="58">${emoji}</text>
        <text x="80" y="138" text-anchor="middle" font-family="Arial, sans-serif" font-size="13" font-weight="700" fill="#7a5637">${label}</text>
      `);
    }
    (function applyV70SafeArtOverrides(){
      const mascotFallbacks = {
        v41_corgi:{emoji:'🐶',bg:'#fde7c7',ring:'#e8bf84',accent:'🧣'},
        v41_cat_bow:{emoji:'🐱',bg:'#fde0d9',ring:'#e4b2a5',accent:'🎀'},
        v41_panda:{emoji:'🐼',bg:'#e2f3dc',ring:'#bfd8b5',accent:'🎋'},
        v41_fox:{emoji:'🦊',bg:'#ffe8cd',ring:'#e2b480',accent:'🍃'},
        v41_penguin:{emoji:'🐧',bg:'#dff2ff',ring:'#b7d4ea',accent:'🧣'},
        v41_honey_bear:{emoji:'🐻',bg:'#f9e1b5',ring:'#e1b173',accent:'🍯'},
        v41_deer:{emoji:'🦌',bg:'#fbe8cc',ring:'#e5c48d',accent:'🌸'},
        v41_duck:{emoji:'🐤',bg:'#fff2c9',ring:'#e5cf86',accent:'👒'},
        v41_chick:{emoji:'🐥',bg:'#ffefb3',ring:'#e8cf77',accent:'🍀'},
        v41_hamster:{emoji:'🐹',bg:'#ffe7d0',ring:'#e5be9e',accent:'🥕'},
        v41_hedgehog:{emoji:'🦔',bg:'#fce7d8',ring:'#e0b08f',accent:'🌼'},
        v41_red_panda:{emoji:'🐼',bg:'#ffe2bf',ring:'#deae83',accent:'🍂'},
        v41_pig:{emoji:'🐷',bg:'#ffdbe6',ring:'#e3b0c1',accent:'🍑'}
      };
      Object.entries(mascotFallbacks).forEach(([key, cfg]) => {
        if (V41_AVATAR_ART[key]) V41_AVATAR_ART[key].src = buildBadgeSvg({ ...cfg, label: V41_AVATAR_ART[key].label || '' });
      });

      const noodleArt = {
        broth_kimchi:{emoji:'🍲',bg:'#ffe0cd',ring:'#e0a585',label:'Kim Chi'},
        broth_tomyum:{emoji:'🦐',bg:'#ffe7c7',ring:'#e0b680',label:'Tom Yum'},
        broth_beef:{emoji:'🥩',bg:'#f3dcc8',ring:'#c9a185',label:'Bò Sa Tế'},
        broth_mushroom:{emoji:'🍄',bg:'#efe1cc',ring:'#c7ad8d',label:'Cốt Nấm'},
        broth_mala:{emoji:'🌶️',bg:'#f4d6d2',ring:'#d5a095',label:'Mala'},
        broth_collagen:{emoji:'🥣',bg:'#f5ead7',ring:'#ddc29f',label:'Collagen'},
        broth_tonkotsu:{emoji:'🍖',bg:'#efe5d9',ring:'#cfb39e',label:'Xương Hầm'},
        broth_herbal:{emoji:'🌿',bg:'#e2ecd8',ring:'#b8c8a5',label:'Thảo Mộc'},
        ntop_beef:{emoji:'🥩',bg:'#f8e2d6',ring:'#d1ab96',label:'Bò Mỹ'},
        ntop_shrimp:{emoji:'🦐',bg:'#ffe8d9',ring:'#e4baa0',label:'Tôm Sú'},
        ntop_squid:{emoji:'🦑',bg:'#f1e6ef',ring:'#c6b6c5',label:'Mực'},
        ntop_fishcake:{emoji:'🍥',bg:'#fff1d9',ring:'#e4ccb5',label:'Chả Cá'},
        ntop_sausage:{emoji:'🌭',bg:'#f4dfd8',ring:'#d7aa9b',label:'Xúc Xích'},
        ntop_enoki:{emoji:'🍄',bg:'#efe8d2',ring:'#d2c19d',label:'Nấm Kim'},
        ntop_egg:{emoji:'🥚',bg:'#faf0d7',ring:'#dcc5a1',label:'Trứng'},
        ntop_cheese:{emoji:'🧀',bg:'#fff0bd',ring:'#e1c774',label:'Phô Mai'},
        ntop_tofu:{emoji:'⬜',bg:'#f2eee4',ring:'#cec4b2',label:'Đậu Hũ'},
        ntop_bokchoy:{emoji:'🥬',bg:'#e4f0d8',ring:'#b5c892',label:'Cải Thìa'},
        ntop_crabstick:{emoji:'🦀',bg:'#ffe4df',ring:'#dfb3a7',label:'Thanh Cua'},
        ntop_nori:{emoji:'🌿',bg:'#dce9dc',ring:'#afc0af',label:'Rong Biển'},
        ntop_meatball:{emoji:'🍡',bg:'#f3dfd2',ring:'#d1ad95',label:'Thịt Viên'},
        ntop_corn:{emoji:'🌽',bg:'#fff0b8',ring:'#e1c86d',label:'Bắp Ngọt'},
        ntop_dumpling:{emoji:'🥟',bg:'#f8e6d2',ring:'#dabc9a',label:'Há Cảo'},
        ntop_porkbelly:{emoji:'🥓',bg:'#f7ded9',ring:'#d5acaa',label:'Ba Chỉ'}
      };
      Object.entries(noodleArt).forEach(([key, cfg]) => {
        const art = buildFoodSvg(cfg);
        if (typeof V65_ART === 'object' && V65_ART) V65_ART[key] = art;
        if (typeof V30_ART === 'object' && V30_ART) V30_ART[key] = art;
      });
    })();

        function normalizedPlayerChibi(id) { return id === 'female' ? 'female' : 'male'; }
    function playerChibiLabel(id) { return PLAYER_CHIBI_ART[normalizedPlayerChibi(id)]?.label || 'Chibi Nam'; }
    function getPlayerChibiSource(id) { return PLAYER_CHIBI_ART[normalizedPlayerChibi(id)]?.src || PLAYER_CHIBI_ART.male.src; }
    function getCurrentPlayerChibi() { return normalizedPlayerChibi(gameState.playerChibi || 'male'); }
    let pendingAccountPlayerChibi = 'male';
    let pendingAccountEditPlayerChibi = 'male';
    function updatePlayerChibiPickers() {
      const configs = [
        ['new', pendingAccountPlayerChibi, 'account-new-chibi-picker'],
        ['edit', pendingAccountEditPlayerChibi, 'account-edit-chibi-picker']
      ];
      configs.forEach(([context,current,containerId]) => {
        const el = document.getElementById(containerId);
        if (!el) return;
        el.innerHTML = ['male','female'].map(id => {
          const sub = id==='male' ? 'Năng động • lon ton dễ thương' : 'Dịu dàng • xanh mát đáng yêu';
          const badge = id==='male' ? '👦 Nam' : '👧 Nữ';
          return `
          <button type="button" class="player-chibi-option ${current===id?'selected':''}" onclick="selectPendingPlayerChibi('${context}','${id}')">
            <span class="player-chibi-badge">${badge}</span>
            <span class="player-chibi-thumb"><img src="${getPlayerChibiSource(id)}" alt="${playerChibiLabel(id)}"></span>
            <span class="min-w-0 flex-1"><span class="player-chibi-title">${playerChibiLabel(id)}</span><span class="player-chibi-sub">${sub}</span></span>
          </button>`;
        }).join('');
      });
    }
    function selectPendingPlayerChibi(context,id) {
      const normalized = normalizedPlayerChibi(id);
      if (context === 'edit') pendingAccountEditPlayerChibi = normalized;
      else pendingAccountPlayerChibi = normalized;
      updatePlayerChibiPickers();
      if (typeof playSound === 'function') playSound('click');
    }
    function getCareerDefaultShopIcon() {
      return gameState.currentCareer === 'boba' ? '🧋' : gameState.currentCareer === 'noodle' ? '🍜' : '🍢';
    }
    function isValidShopAvatar(id) { return SHOP_AVATAR_PICKER_OPTIONS.includes(id) || !!V41_AVATAR_ART[id]; }
    function normalizedShopAvatar(id) { return isValidShopAvatar(id) ? id : 'bunny'; }
    function getCurrentShopAvatar() {
      // Old saves only have shopIcon. Preserve their customized choice.
      return normalizedShopAvatar(gameState.shopAvatar || gameState.shopIcon || 'bunny');
    }
    function getShopAvatarSource(id) {
      if (id === 'bunny') return SHOP_BUNNY_IMAGE_SRC;
      if (V41_AVATAR_ART[id]) return V41_AVATAR_ART[id].src;
      const map = {shop:'shop',farm:'farm',barn:'barn',village:'village',warehouse:'warehouse',reviews:'reviews'};
      const img = document.querySelector(`#nav-btn-${map[id]} img`);
      return img?.getAttribute('src') || '';
    }
    let pendingAccountShopAvatar = 'bunny';
    let pendingAccountEditAvatar = 'bunny';
    let editingAccountShopId = null;
    let avatarGalleryContext = 'new';
    let avatarGallerySelection = 'bunny';
    let avatarGalleryCategory = 'mascot';

    function avatarGalleryLabel(id) { return V41_AVATAR_ART[id]?.label || SHOP_AVATAR_LABELS[id] || (SHOP_ICON_CHOICES.includes(id) ? `Icon ${id}` : 'Thỏ Bé'); }
    function avatarGalleryMarkup(id) {
      const src = getShopAvatarSource(id);
      return src ? `<img src="${src}" alt="${escapeHtmlText(avatarGalleryLabel(id))}">` : `<span>${id}</span>`;
    }
    function updateShopAvatarSummaries() {
      const records = [['new',pendingAccountShopAvatar],['edit',pendingAccountEditAvatar]];
      records.forEach(([context,id]) => {
        const preview = document.getElementById(`account-${context}-avatar-preview`);
        const label = document.getElementById(`account-${context}-avatar-label`);
        if (preview) preview.innerHTML = avatarGalleryMarkup(id);
        if (label) label.textContent = avatarGalleryLabel(id);
      });
    }
    function setShopAvatarGalleryCategory(category) {
      avatarGalleryCategory = category === 'scene' ? 'scene' : 'mascot';
      renderShopAvatarGallery();
    }
    function openShopAvatarGallery(context='new') {
      avatarGalleryContext = ['new','edit','header'].includes(context) ? context : 'new';
      avatarGallerySelection = normalizedShopAvatar(avatarGalleryContext === 'edit' ? pendingAccountEditAvatar : avatarGalleryContext === 'new' ? pendingAccountShopAvatar : getCurrentShopAvatar());
      avatarGalleryCategory = V41_AVATAR_ART[avatarGallerySelection]?.category || 'mascot';
      document.getElementById('modal-shop-avatar-gallery')?.classList.remove('hidden');
      renderShopAvatarGallery();
      if (typeof playSound === 'function') playSound('click');
    }
    function renderShopAvatarGallery() {
      ['mascot','scene'].forEach(cat => document.getElementById(`avatar-filter-${cat}`)?.classList.toggle('selected',avatarGalleryCategory === cat));
      const grid = document.getElementById('shop-avatar-gallery-grid');
      if (grid) {
        const choices = V41_SHOP_AVATAR_PICKER_OPTIONS.filter(id => id === 'bunny' ? avatarGalleryCategory === 'mascot' : V41_AVATAR_ART[id]?.category === avatarGalleryCategory);
        grid.innerHTML = choices.map(id => `<button type="button" class="avatar-gallery-tile ${avatarGallerySelection === id ? 'selected' : ''}" title="${escapeHtmlText(avatarGalleryLabel(id))}" aria-label="${escapeHtmlText(avatarGalleryLabel(id))}" onclick="selectShopAvatarGallery('${id}')">${avatarGalleryMarkup(id)}<span class="avatar-gallery-caption">${escapeHtmlText(avatarGalleryLabel(id))}</span></button>`).join('');
      }
      const preview = document.getElementById('shop-avatar-gallery-preview');
      const title = document.getElementById('shop-avatar-gallery-name');
      if (preview) preview.innerHTML = avatarGalleryMarkup(avatarGallerySelection);
      if (title) title.textContent = avatarGalleryLabel(avatarGallerySelection);
    }
    function selectShopAvatarGallery(id) {
      if (!isValidShopAvatar(id)) return;
      avatarGallerySelection = id;
      renderShopAvatarGallery();
    }
    function closeShopAvatarGallery() {
      document.getElementById('modal-shop-avatar-gallery')?.classList.add('hidden');
    }
    function confirmShopAvatarGallery() {
      const id = avatarGallerySelection;
      if (avatarGalleryContext === 'new') pendingAccountShopAvatar = id;
      else if (avatarGalleryContext === 'edit') pendingAccountEditAvatar = id;
      else setShopIcon(id);
      updateShopAvatarSummaries();
      updatePlayerChibiPickers();
      closeShopAvatarGallery();
    }
    function selectNewAccountShopAvatar(id) {
      if (!isValidShopAvatar(id)) return;
      pendingAccountShopAvatar = id;
      updateShopAvatarSummaries();
    }
    function renderShopIconChoices() { /* V41 gallery renders its own options */ }
    function openShopIconModal() { openShopAvatarGallery('header'); }
    function closeShopIconModal() { closeShopAvatarGallery(); }
    function setShopIcon(id) {
      if (!isValidShopAvatar(id)) return;
      gameState.shopAvatar = id;
      gameState.shopIcon = SHOP_ICON_CHOICES.includes(id) ? id : (id==='bunny' ? '🐰' : getCareerDefaultShopIcon());
      updateHeaderStats();
      saveGameToStorage(false);
      showToast(`Đã đổi đại diện quán: ${avatarGalleryLabel(id)}`, '🎨');
    }
    function resetShopIconToCareer() { setShopIcon('bunny'); }
    function updateShopAvatarOnHeader() {
      const id = getCurrentShopAvatar();
      const img = document.getElementById('header-shop-avatar-image');
      const emoji = document.getElementById('header-shop-avatar-emoji');
      if (!img || !emoji) return;
      const src = getShopAvatarSource(id);
      if (src) {
        if (img.getAttribute('src') !== src) img.setAttribute('src',src);
        img.classList.remove('hidden');
        emoji.classList.add('hidden');
      } else {
        img.classList.add('hidden');
        emoji.classList.remove('hidden');
        emoji.textContent = id;
      }
    }

    function openAccountShopEdit(profileId) {
      const acc = getAccountById(profileId);
      if (!acc) return;
      editingAccountShopId = profileId;
      const s = acc.summary || {};
      const input = document.getElementById('account-edit-shop-name');
      if (input) input.value = acc.shopName || s.shopName || 'Quán của tôi';
      pendingAccountEditAvatar = normalizedShopAvatar(acc.shopAvatar || s.shopAvatar || 'bunny');
      pendingAccountEditPlayerChibi = normalizedPlayerChibi(acc.playerChibi || s.playerChibi || 'male');
      updateShopAvatarSummaries();
      updatePlayerChibiPickers();
      document.getElementById('modal-account-shop-edit')?.classList.remove('hidden');
    }
    function selectAccountEditAvatar(id) {
      if (!isValidShopAvatar(id)) return;
      pendingAccountEditAvatar = id;
      updateShopAvatarSummaries();
    }
    function closeAccountShopEdit() {
      editingAccountShopId = null;
      document.getElementById('modal-account-shop-edit')?.classList.add('hidden');
    }
    function saveAccountShopEdit() {
      if (!editingAccountShopId) return;
      const input = document.getElementById('account-edit-shop-name');
      const newName = (input?.value || '').trim();
      if (!newName) return showToast('Tên quán không được để trống.','⚠️');
      const accounts = readAccountRegistry();
      const idx = accounts.findIndex(a => a && a.id===editingAccountShopId);
      if (idx < 0) return;
      const avatar = normalizedShopAvatar(pendingAccountEditAvatar);
      const playerChibi = normalizedPlayerChibi(pendingAccountEditPlayerChibi);
      accounts[idx].shopName = newName.slice(0,32);
      accounts[idx].shopAvatar = avatar;
      accounts[idx].playerChibi = playerChibi;
      accounts[idx].summary = {...(accounts[idx].summary||{}), shopName:accounts[idx].shopName,shopAvatar:avatar,playerChibi};
      writeAccountRegistry(accounts);
      // Update the corresponding save without replacing inventory or gameplay progress.
      const key = getProfileStorageKey(editingAccountShopId);
      try {
        const raw = localStorage.getItem(key);
        if (raw) {
          const save = JSON.parse(raw);
          if (save && typeof save==='object') {
            save.shopName = accounts[idx].shopName;
            save.shopAvatar = avatar;
            save.shopIcon = SHOP_ICON_CHOICES.includes(avatar) ? avatar : (avatar === 'bunny' ? '🐰' : null);
            save.playerChibi = playerChibi;
            localStorage.setItem(key, JSON.stringify(save));
          }
        }
      } catch(e) { showToast('Chưa cập nhật được save trên trình duyệt.','⚠️'); return; }
      if (editingAccountShopId===activeProfileId) {
        gameState.shopName = accounts[idx].shopName;
        gameState.shopAvatar = avatar;
        gameState.shopIcon = SHOP_ICON_CHOICES.includes(avatar) ? avatar : (avatar==='bunny' ? '🐰' : getCareerDefaultShopIcon());
        gameState.playerChibi = playerChibi;
        updateHeaderStats();
        renderVillageChibi();
      renderVillagePoints();
      renderVillageNpcs();
      ensureVillageNpcMotion();
      }
      closeAccountShopEdit();
      renderAccountScreen();
      showToast('Đã cập nhật quán và nhân vật.','🏪');
    }

    function openRenameModal(targetKey) {
      activeRenameTarget = targetKey;
      const modal = document.getElementById('modal-rename');
      const titleTxt = document.getElementById('rename-title-txt');
      const input = document.getElementById('rename-input-val');
      if (!modal || !titleTxt || !input) return;

      if (targetKey === 'shop') {
        titleTxt.innerText = "Đổi Tên Tiệm:";
        input.value = gameState.shopName;
      } else if (targetKey.indexOf('animal_') === 0) {
        const aKey = targetKey.replace('animal_', '');
        titleTxt.innerText = "Đặt Tên Con Vật:";
        input.value = (gameState.animals[aKey] && gameState.animals[aKey].name) || "Bé Cưng";
      }

      modal.classList.remove('hidden');
      input.focus();
    }

    function closeRenameModal() {
      const modal = document.getElementById('modal-rename');
      if (modal) modal.classList.add('hidden');
      activeRenameTarget = null;
    }

    function saveRenameAction() {
      const input = document.getElementById('rename-input-val');
      if (!input || !activeRenameTarget) return;

      const val = input.value.trim();
      if (!val) return showToast("Tên không được rỗng!", "⚠️");

      if (activeRenameTarget === 'shop') {
        gameState.shopName = val;
        showToast(`Tên tiệm mới: ${val}!`, "🏪");
      } else if (activeRenameTarget.indexOf('animal_') === 0) {
        const aKey = activeRenameTarget.replace('animal_', '');
        if (gameState.animals[aKey]) {
          gameState.animals[aKey].name = val;
          showToast(`Đã đổi tên thành: ${val}!`, "🐾");
        }
      }

      closeRenameModal();
      updateHeaderStats();
      renderBarnUI();
      saveGameToStorage();
    }


    function readAccountRegistry() {
      try {
        const raw = localStorage.getItem(ACCOUNT_REGISTRY_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
      } catch (err) {
        return [];
      }
    }

    function writeAccountRegistry(accounts) {
      try {
        localStorage.setItem(ACCOUNT_REGISTRY_KEY, JSON.stringify(Array.isArray(accounts) ? accounts : []));
      } catch (err) {}
    }

    function getAccountById(profileId) {
      return readAccountRegistry().find(a => a && a.id === profileId) || null;
    }

    function updateAccountSummary() {
      if (!activeProfileId) return;
      const accounts = readAccountRegistry();
      const idx = accounts.findIndex(a => a && a.id === activeProfileId);
      if (idx < 0) return;
      accounts[idx].lastPlayedAt = Date.now();
      accounts[idx].shopName = gameState.shopName || accounts[idx].shopName;
      accounts[idx].shopAvatar = getCurrentShopAvatar();
      accounts[idx].playerChibi = getCurrentPlayerChibi();
      accounts[idx].summary = {
        playerName: gameState.playerName || accounts[idx].name || 'Người chơi',
        shopName: gameState.shopName || 'Quán mới',
        shopAvatar: getCurrentShopAvatar(),
        playerChibi: getCurrentPlayerChibi(),
        day: Math.max(1, Number(gameState.day) || 1),
        level: Math.max(1, Number(gameState.level) || 1),
        career: gameState.currentCareer || 'boba',
        hasStarted: !!gameState.hasStarted
      };
      writeAccountRegistry(accounts);
    }

    function getCareerAccountIcon(career) {
      if (career === 'noodle') return '🍜';
      if (career === 'streetfood') return '🍢';
      return '🧋';
    }

    function renderAccountScreen() {
      const accounts = readAccountRegistry().sort((a, b) => (Number(b.lastPlayedAt) || 0) - (Number(a.lastPlayedAt) || 0));
      const list = document.getElementById('account-profile-list');
      const count = document.getElementById('account-count');
      updateShopAvatarSummaries();
      // V81: render the village chibi portraits on initial account view.
      // Previously these were created only as a side effect of confirming a shop avatar.
      updatePlayerChibiPickers();

      if (count) count.innerText = `${accounts.length} tài khoản`;
      if (list) {
        if (!accounts.length) {
          list.innerHTML = `<div class="rounded-2xl border border-dashed border-white/20 bg-white/5 p-4 text-center text-[10px] text-slate-300">Chưa có tài khoản nào. Tạo một tài khoản mới để bắt đầu từ đầu.</div>`;
        } else {
          list.innerHTML = accounts.map(acc => {
            const s = acc.summary || {};
            const started = !!s.hasStarted;
            const icon = getCareerAccountIcon(s.career);
            const avatarId = normalizedShopAvatar(acc.shopAvatar || s.shopAvatar || 'bunny');
            const avatarSrc = getShopAvatarSource(avatarId);
            const avatarMarkup = avatarSrc ? `<img src="${avatarSrc}" class="w-9 h-9 object-cover rounded-xl" alt="Hình quán">` : avatarId;
            const playerChibi = normalizedPlayerChibi(acc.playerChibi || s.playerChibi || 'male');
            const playerBadge = playerChibi === 'female' ? '👧' : '👦';
            const subtitle = started
              ? `${escapeHtmlText(s.shopName || 'Quán chưa đặt tên')} • Ngày ${Number(s.day) || 1} • Lv.${Number(s.level) || 1}`
              : 'Chưa bắt đầu hành trình';
            return `
              <div class="rounded-2xl bg-white/10 border border-white/15 p-3">
                <div class="flex items-center gap-2">
                  <div class="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-300/20 flex items-center justify-center text-2xl">${avatarMarkup}</div>
                  <div class="w-10 h-10 rounded-2xl border border-amber-300/30 bg-amber-50/95 flex items-center justify-center overflow-hidden shrink-0" title="Chân dung nhân vật"><img class="w-full h-full object-contain" src="${V8733_PLAYER_PORTRAITS[playerChibi]}" alt="Chân dung người chơi"></div>
                  <div class="min-w-0 flex-1">
                    <b class="text-xs text-white block truncate">${playerBadge} ${escapeHtmlText(acc.name || 'Người chơi')}</b>
                    <span class="text-[8px] text-slate-300 block truncate">${subtitle}</span>
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-1.5 mt-2">
                  <button onclick="continueLocalAccount('${acc.id}')" class="py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-[9px] font-black tap-scale">${started ? '▶ Tiếp tục' : '🚀 Bắt đầu'}</button>
                  <button onclick="newGameForLocalAccount('${acc.id}')" class="py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-[9px] font-black tap-scale">🆕 Chơi mới</button>
                  <button onclick="openAccountShopEdit('${acc.id}')" class="py-1.5 rounded-xl bg-blue-700 hover:bg-blue-600 text-[9px] font-black tap-scale">🎨 Chỉnh hồ sơ</button>
                  <button onclick="deleteLocalAccount('${acc.id}')" class="py-1.5 rounded-xl bg-rose-900/80 hover:bg-rose-800 text-[9px] font-black tap-scale">🗑 Xóa</button>
                </div>
              </div>`;
          }).join('');
        }
      }

      const legacyCard = document.getElementById('legacy-save-card');
      if (legacyCard) {
        const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
        const imported = localStorage.getItem(LEGACY_IMPORTED_KEY) === '1';
        if (legacyRaw && !imported) {
          let legacy = null;
          try { legacy = JSON.parse(legacyRaw); } catch (err) {}
          const legacyText = legacy && typeof legacy === 'object'
            ? `${escapeHtmlText(legacy.playerName || 'Người chơi cũ')} • ${escapeHtmlText(legacy.shopName || 'Quán cũ')} • Ngày ${Number(legacy.day) || 1} • Lv.${Number(legacy.level) || 1}`
            : 'Phát hiện dữ liệu save cũ.';
          legacyCard.classList.remove('hidden');
          legacyCard.innerHTML = `
            <div class="flex items-start gap-2">
              <span class="text-2xl">💾</span>
              <div class="min-w-0 flex-1">
                <b class="text-[10px] text-amber-200 block">Tìm thấy save cũ</b>
                <p class="text-[8px] text-amber-100/80 mt-0.5">${legacyText}</p>
                <p class="text-[8px] text-slate-300 mt-1">Game sẽ không tự dùng save này. Chỉ nhập khi bạn bấm nút bên dưới.</p>
              </div>
            </div>
            <button onclick="importLegacySaveAsAccount()" class="w-full mt-2 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-amber-950 text-[9px] font-black tap-scale">📥 Nhập save cũ thành tài khoản riêng</button>`;
        } else {
          legacyCard.classList.add('hidden');
          legacyCard.innerHTML = '';
        }
      }
    }

    function resetRuntimeForProfile() {
      if (typeof v87PendingShipments !== 'undefined') v87PendingShipments = 0;
      clearTimeout(window._nextCustomerTimeout);
      currentCustomer = null;
      activeOnlineOrders = [];
      deliveryCooldown = 5;
      phonePauseActive = false;
      if (typeof stopWhackGameTimers === 'function') stopWhackGameTimers();
      if (typeof stopStackTimer === 'function') stopStackTimer();
      if (typeof stopMemoryGameTimer === 'function') stopMemoryGameTimer();
      if (typeof stopWheelGameTimer === 'function') stopWheelGameTimer();
    }

    function resetGameStateToDefault() {
      gameState = JSON.parse(JSON.stringify(DEFAULT_GAME_STATE));
      selectedIntroCareerChoice = 'boba';
      resetRuntimeForProfile();
      ensureGrowthState();
      ensureV6State();
    }

    function createLocalAccount() {
      const input = document.getElementById('account-new-name');
      const name = input ? input.value.trim() : '';
      const shopInput = document.getElementById('account-new-shop-name');
      const shopName = (shopInput?.value || '').trim() || 'Quán Nhà Mình';
      const shopAvatar = normalizedShopAvatar(pendingAccountShopAvatar);
      const playerChibi = normalizedPlayerChibi(pendingAccountPlayerChibi);
      if (!name) return showToast('Hãy nhập tên tài khoản!', '👤');

      const accounts = readAccountRegistry();
      if (accounts.some(a => String(a.name || '').toLowerCase() === name.toLowerCase())) {
        return showToast('Tên tài khoản này đã có trên máy!', '⚠️');
      }

      const id = `p_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
      accounts.push({
        id,
        name: name.slice(0, 20),
        shopName: shopName.slice(0,32),
        shopAvatar,
        playerChibi,
        createdAt: Date.now(),
        lastPlayedAt: Date.now(),
        summary: { playerName: name.slice(0, 20), shopName: shopName.slice(0,32), shopAvatar, playerChibi, day: 1, level: 1, career: 'boba', hasStarted: false }
      });
      writeAccountRegistry(accounts);
      if (input) input.value = '';
      if (shopInput) shopInput.value = '';
      pendingAccountShopAvatar = 'bunny';
      pendingAccountPlayerChibi = 'male';
      updatePlayerChibiPickers();
      activeProfileId = id;
      localStorage.setItem(ACTIVE_PROFILE_KEY, id);
      startFreshRunForActiveProfile(name.slice(0, 20));
    }

    function startFreshRunForActiveProfile(accountName = '') {
      if (!activeProfileId) return;
      resetGameStateToDefault();
      const profile = getAccountById(activeProfileId);
      if (accountName) gameState.playerName = accountName;
      gameState.shopName = profile?.shopName || profile?.summary?.shopName || gameState.shopName;
      gameState.shopAvatar = normalizedShopAvatar(profile?.shopAvatar || profile?.summary?.shopAvatar || 'bunny');
      gameState.shopIcon = SHOP_ICON_CHOICES.includes(gameState.shopAvatar) ? gameState.shopAvatar : (gameState.shopAvatar==='bunny' ? '🐰' : null);
      gameState.playerChibi = normalizedPlayerChibi(profile?.playerChibi || profile?.summary?.playerChibi || 'male');
      const nameInp = document.getElementById('intro-player-name');
      if (nameInp) nameInp.value = gameState.playerName || accountName || 'Bạn';
      const shopInp = document.getElementById('intro-shop-name');
      if (shopInp) shopInp.value = gameState.shopName;
      updateHeaderStats();
      sessionGameActive = true;
      document.getElementById('screen-account')?.classList.add('hidden');
      document.getElementById('screen-intro')?.classList.remove('hidden');
      selectIntroCareer('boba');
      saveGameToStorage(false);
    }

    function newGameForLocalAccount(profileId) {
      const acc = getAccountById(profileId);
      if (!acc) return;
      const saveRaw = localStorage.getItem(getProfileStorageKey(profileId));
      if (saveRaw && !confirm(`Chơi mới trong tài khoản "${acc.name}" sẽ ghi đè tiến trình hiện tại. Tiếp tục?`)) return;
      activeProfileId = profileId;
      localStorage.setItem(ACTIVE_PROFILE_KEY, profileId);
      startFreshRunForActiveProfile(acc.name || 'Bạn');
    }

    function continueLocalAccount(profileId) {
      const acc = getAccountById(profileId);
      if (!acc) return;
      activeProfileId = profileId;
      localStorage.setItem(ACTIVE_PROFILE_KEY, profileId);
      resetGameStateToDefault();
      const loaded = loadGameFromStorage(profileId);
      sessionGameActive = true;
      document.getElementById('screen-account')?.classList.add('hidden');

      if (!loaded || !gameState.hasStarted) {
        gameState.shopName = acc.shopName || acc.summary?.shopName || gameState.shopName;
        gameState.shopAvatar = normalizedShopAvatar(acc.shopAvatar || acc.summary?.shopAvatar || gameState.shopAvatar);
        gameState.playerChibi = normalizedPlayerChibi(acc.playerChibi || acc.summary?.playerChibi || gameState.playerChibi || 'male');
        const shopInp = document.getElementById('intro-shop-name');
        if (shopInp) shopInp.value = gameState.shopName;
        const nameInp = document.getElementById('intro-player-name');
        if (nameInp) nameInp.value = gameState.playerName || acc.name || 'Bạn';
        document.getElementById('screen-intro')?.classList.remove('hidden');
        selectIntroCareer(gameState.currentCareer || 'boba');
        return;
      }

      gameState.playerChibi = normalizedPlayerChibi(gameState.playerChibi || acc.playerChibi || acc.summary?.playerChibi || 'male');
      enterLoadedGame();
    }

    function enterLoadedGame() {
      sessionGameActive = true;
      document.getElementById('screen-account')?.classList.add('hidden');
      document.getElementById('screen-intro')?.classList.add('hidden');
      gameState.phase = gameState.shiftClosed ? 'closed' : 'prep';
      currentCustomer = null;
      ensureGrowthState();
      ensureV6State();
      generateDailyFlashDeal(false);
      generateSoppiFlashSale(false);
      if (!getActiveWorldEventConfig()) rollDailyWorldEvent(false);
      announceDailyMarketNews(false);
      applyCareerLockToUI();
      updateHeaderStats();
      updateShopPhaseUI();
      renderCustomerBooth();
      renderDailyWorldEventBanner();
      renderNotificationBadge();
      renderGameCollectionSummary();
      renderFarmEventPanel();
      renderBarnEventPanel();
      renderVillageUI();
      updateAccountSummary();
    }

    function openAccountScreen() {
      if (activeProfileId && sessionGameActive) saveGameToStorage(false);
      sessionGameActive = false;
      resetRuntimeForProfile();
      renderAccountScreen();
      document.getElementById('screen-account')?.classList.remove('hidden');
    }

    function deleteLocalAccount(profileId) {
      const acc = getAccountById(profileId);
      if (!acc) return;
      if (!confirm(`Xóa tài khoản "${acc.name}" và toàn bộ tiến trình của tài khoản này?`)) return;
      const accounts = readAccountRegistry().filter(a => a && a.id !== profileId);
      writeAccountRegistry(accounts);
      try { localStorage.removeItem(getProfileStorageKey(profileId)); } catch (err) {}
      if (activeProfileId === profileId) {
        activeProfileId = null;
        sessionGameActive = false;
        localStorage.removeItem(ACTIVE_PROFILE_KEY);
        resetGameStateToDefault();
      }
      renderAccountScreen();
      showToast('Đã xóa tài khoản.', '🗑️');
    }

    function importLegacySaveAsAccount() {
      const raw = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (!raw) return showToast('Không còn save cũ để nhập.', '⚠️');
      let legacy;
      try { legacy = JSON.parse(raw); } catch (err) { return showToast('Save cũ không đọc được.', '⚠️'); }
      if (!legacy || typeof legacy !== 'object') return showToast('Save cũ không hợp lệ.', '⚠️');

      const accounts = readAccountRegistry();
      const baseName = String(legacy.playerName || 'Người chơi cũ').slice(0, 16);
      let name = `${baseName} • Cũ`;
      let n = 2;
      while (accounts.some(a => String(a.name || '').toLowerCase() === name.toLowerCase())) {
        name = `${baseName} • Cũ ${n++}`;
      }
      const id = `legacy_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
      accounts.push({
        id,
        name,
        createdAt: Date.now(),
        lastPlayedAt: Date.now(),
        summary: {
          playerName: legacy.playerName || name,
          shopName: legacy.shopName || 'Quán cũ',
          playerChibi: normalizedPlayerChibi(legacy.playerChibi || 'male'),
          day: Number(legacy.day) || 1,
          level: Number(legacy.level) || 1,
          career: legacy.currentCareer || 'boba',
          hasStarted: !!legacy.hasStarted
        }
      });
      writeAccountRegistry(accounts);
      localStorage.setItem(getProfileStorageKey(id), JSON.stringify(legacy));
      localStorage.setItem(LEGACY_IMPORTED_KEY, '1');
      renderAccountScreen();
      showToast('Đã nhập save cũ thành một tài khoản riêng!', '📥');
    }

    function saveGameToStorage(isManual) {
      if (!activeProfileId) {
        if (isManual) showToast("Hãy chọn hoặc tạo tài khoản trước khi lưu.", "👤");
        return false;
      }
      try {
        localStorage.setItem(getProfileStorageKey(activeProfileId), JSON.stringify(gameState));
        updateAccountSummary();
        if (isManual) {
          playSound('coin');
          showToast("Đã lưu tiến trình vào tài khoản hiện tại! 💾", "✅");
        }
        return true;
      } catch (err) {
        if (isManual) showToast("Không thể lưu tiến trình trên trình duyệt này.", "⚠️");
        return false;
      }
    }

    function loadGameFromStorage(profileId) {
      if (!profileId) return false;
      try {
        const raw = localStorage.getItem(getProfileStorageKey(profileId));
        if (!raw) return false;
        const loaded = JSON.parse(raw);
        if (loaded && typeof loaded === 'object') {
          gameState = Object.assign(JSON.parse(JSON.stringify(DEFAULT_GAME_STATE)), loaded);
          gameState.inventory = Object.assign({}, DEFAULT_GAME_STATE.inventory || {}, loaded.inventory || {});
          if (!gameState.dailyStats) gameState.dailyStats = { counterServed: 0, deliveryServed: 0, counterRev: 0, deliveryRev: 0, tipsRev: 0, wholesaleSpent: 0, ratings: [5] };
          // V87 save migration: old saves always start with an available new shift.
          gameState.shiftClosed = loaded.shiftClosed === true;
          if (!gameState.miniGameDaily) gameState.miniGameDaily = { cardsPlayedDay: 0, wheelPlayedDay: 0 };
          if (typeof gameState.claimedDailyDeal !== 'boolean') gameState.claimedDailyDeal = false;
          gameState.playerChibi = normalizedPlayerChibi(gameState.playerChibi || 'male');
          if (!Array.isArray(gameState.reviews)) gameState.reviews = [];
          if (!Number.isFinite(Number(gameState.nextReviewId))) gameState.nextReviewId = gameState.reviews.length + 1;
           ensureGrowthState();
           ensureV6State();
           if(gameState.staffHR?.pending?.day===gameState.day){setTimeout(()=>{if(sessionGameActive&&document.getElementById('v87531-report-modal')?.classList.contains('hidden'))v87531Open();},1000);}
          v8753Ensure();
          for(const z of Object.keys(VILLAGE_ZONES))v8753MaybeBadge(z);
           const v87521Backpay=v87521MigrateCompletedAwards();
           if(v87521Backpay>0){
             if(typeof pushGameNotification==='function')pushGameNotification('🎉 Điều chỉnh thưởng lễ hội',`Bạn được cộng bù ${v87521Backpay} Xu cho giải thưởng đã nhận ở bản cũ.`, '🪙','gold');
             localStorage.setItem(getProfileStorageKey(profileId), JSON.stringify(gameState));
           }
           if (!gameState.soppiFlashSale || gameState.soppiFlashSale.day !== gameState.day) gameState.soppiFlashSale = null;
          if (gameState.dailyWorldEvent && Number(gameState.dailyWorldEvent.day) !== Number(gameState.day)) gameState.dailyWorldEvent = null;
          gameState.farmDailyEvent = null;
          gameState.barnDailyEvent = null;
          return true;
        }
      } catch (err) {}
      return false;
    }

    function masterGameLoop() {
      if (!sessionGameActive || !activeProfileId) return;
      ensureV6State();
      const villageEnergyChanged = tickVillageEnergyRegen();
      if (villageEnergyChanged && !document.getElementById('tab-village')?.classList.contains('hidden')) renderVillageUI();
      if (villageEnergyChanged && utilityShopFilter === 'village' && !document.getElementById('phone-app-utility')?.classList.contains('hidden')) {
        renderVillageEnergyPacks();
      }
      const fbBonus = getFarmBarnSouvenirBonuses();
      const farmEventBonus = getFarmEventBonuses();
      const barnEventBonus = getBarnEventBonuses();
      let farmChanged = false;
      let barnChanged = false;

      // 1. Cây trồng + trợ lý Vườn. Auto chỉ làm các tầng đã mở theo level.
      gameState.farmPlots.forEach((plot, idx) => {
        if (!plot || !plot.unlocked || plot.mortgaged) return;
        if (plot.seed) {
          const cfg = FARM_SEEDS_CONFIG[plot.seed];
          if (cfg && plot.growTimer < cfg.growTime) {
            plot.growTimer += 0.5 * (1 + fbBonus.farmGrowthPct + farmEventBonus.growthPct);
            farmChanged = true;
          }
          if ((farmEventBonus.autoWater && !plot.watered) || (gameState.automation.farmEnabled && gameState.level >= 12 && !plot.watered)) {
            plot.watered = true;
            plot.growTimer += 3;
            farmChanged = true;
          }
          if (gameState.automation.farmEnabled && gameState.level >= 20 && cfg && plot.growTimer >= cfg.growTime) {
            if (autoHarvestPlot(idx)) farmChanged = true;
          }
        }
        if (gameState.automation.farmEnabled && gameState.level >= 28 && !plot.seed) {
          if (autoReplantPlot(idx)) farmChanged = true;
        }
      });

      // 2. Vật nuôi + trợ lý Chuồng.
      Object.keys(gameState.animals).forEach(k => {
        const anim = gameState.animals[k];
        const cfg = BARN_ANIMALS_CONFIG[k];
        if (!anim || !anim.unlocked || !cfg) return;
        if (anim.ready && (Number(anim.careCooldown) || 0) > 0) { anim.careCooldown = Math.max(0, anim.careCooldown - 1); barnChanged = true; }
        if (!anim.ready) {
          if ((Number(anim.careCooldown) || 0) > 0) anim.careCooldown = Math.max(0, anim.careCooldown - 1);
          const feedFactor = (!cfg.feedCostItem || anim.autoFed) ? 1 : .55;
          const affectionSpeed = getAnimalAffectionSpeed(anim);
          anim.timer += 0.5 * feedFactor * (1 + fbBonus.barnGrowthPct + barnEventBonus.growthPct + affectionSpeed);
          barnChanged = true;
          if (gameState.automation.barnEnabled && gameState.level >= 14 && !anim.autoFed) {
            if (autoCareBarnAnimal(k)) barnChanged = true;
          }
          if (anim.timer >= cfg.cycleTime) anim.ready = true;
        }
        if (gameState.automation.barnEnabled && gameState.level >= 22 && anim.ready) {
          if (autoCollectBarnProduct(k)) barnChanged = true;
        }
      });

      if (farmChanged) {
        const farmTab = document.getElementById('tab-farm');
        if (farmTab && !farmTab.classList.contains('hidden')) renderFarmUI();
      }
      if (barnChanged) {
        const barnTab = document.getElementById('tab-barn');
        if (barnTab && !barnTab.classList.contains('hidden')) renderBarnUI();
      }

      // 3. Đơn shipper online
      checkDeliveryOrderGeneration();
      v87532Tick();

      // 4. Vận chuyển Soppi
      if (gameState.soppiOrders && gameState.soppiOrders.length > 0) {
        gameState.soppiOrders.forEach((ord, i) => {
          ord.timeLeft -= 1;
          if (ord.timeLeft <= 0) {
            gameState.inventory[ord.itemKey] = (gameState.inventory[ord.itemKey] || 0) + ord.qty;
            gameState.soppiOrders.splice(i, 1);
            playSound('coin');
            showToast(`Đơn Soppi đã giao tới! +${ord.qty} ${ord.name}`, "🏠");
            updateHeaderStats();
            renderWorkbenchControls();
            renderWarehouseUI();
            if (!document.getElementById('phone-app-soppi').classList.contains('hidden')) {
              renderSoppiActiveOrders();
            }
          }
        });
        if (!document.getElementById('phone-app-soppi').classList.contains('hidden')) {
          renderSoppiActiveOrders();
          renderSoppiFlashSale();
        }
      } else {
        const soppiApp = document.getElementById('phone-app-soppi');
        if (soppiApp && !soppiApp.classList.contains('hidden')) renderSoppiFlashSale();
      }
    }

    window.onload = function () {
      sessionGameActive = false;
      activeProfileId = null;
      resetGameStateToDefault();

      const accountScreen = document.getElementById('screen-account');
      const introScreen = document.getElementById('screen-intro');
      if (accountScreen) accountScreen.classList.remove('hidden');
      if (introScreen) introScreen.classList.add('hidden');

      renderAccountScreen();

      setInterval(masterGameLoop, 1000);
      setInterval(() => {
        if (sessionGameActive && activeProfileId) saveGameToStorage(false);
      }, 15000);
    };

    // V68: one read-only order source shared by the full customer card and the floating ticket.
    let v68ForceOrderDock = false;
    let v68OrderExpanded = false;
    let v68OrderTickPending = false;

    function v68UpdateOrderDock() {
      const dock = document.getElementById('v68-order-dock');
      const booth = document.getElementById('customer-booth-card');
      const tab = document.getElementById('tab-shop');
      const nav = document.querySelector('.compact-nav');
      if (!dock || !booth || !tab || !nav) return;
      const navBottom = Math.max(0, nav.getBoundingClientRect().bottom);
      dock.style.setProperty('--v68-order-top', `${Math.round(navBottom + 4)}px`);
      const isShopVisible = !tab.classList.contains('hidden');
      const hasOrder = gameState.phase === 'open' && !!currentCustomer;
      const boothPast = booth.getBoundingClientRect().bottom < navBottom + 8;
      const show = isShopVisible && hasOrder && (boothPast || v68ForceOrderDock);
      dock.classList.toggle('active', show);
      dock.classList.toggle('expanded', v68OrderExpanded);
      if (!show) return;
      const quote = document.getElementById('v68-order-quote');
      const name = document.getElementById('v68-order-name');
      const time = document.getElementById('v68-order-time');
      const progress = document.getElementById('v68-order-progress');
      const expand = document.getElementById('v68-order-expand');
      if (quote) quote.textContent = currentCustomer.quote || 'Chưa có yêu cầu chế biến.';
      if (name) name.textContent = currentCustomer.name || 'Khách hàng';
      const patience = Math.max(0, Number(currentCustomer.patience) || 0);
      const maxPatience = Math.max(1, Number(currentCustomer.maxPatience) || 1);
      const remainPct = Math.max(0, Math.min(100, 100 * patience / maxPatience));
      if (time) {
        time.textContent = phonePauseActive ? '⏸' : `${Math.ceil(patience)}s`;
        time.classList.toggle('urgent', !phonePauseActive && remainPct < 30);
      }
      if (progress) {
        progress.style.width = `${remainPct}%`;
        progress.classList.toggle('warn', remainPct < 60 && remainPct >= 30);
        progress.classList.toggle('urgent', remainPct < 30);
      }
      if (expand) {
        expand.textContent = v68OrderExpanded ? '⌃' : '⌄';
        expand.setAttribute('aria-expanded', String(v68OrderExpanded));
        expand.setAttribute('aria-label', v68OrderExpanded ? 'Thu gọn đơn khách' : 'Xem toàn bộ yêu cầu của khách');
      }
    }
    function v68ScheduleOrderDock() {
      if (v68OrderTickPending) return;
      v68OrderTickPending = true;
      requestAnimationFrame(() => { v68OrderTickPending = false; v68UpdateOrderDock(); });
    }
    function v68ToggleOrderDetails() {
      v68OrderExpanded = !v68OrderExpanded;
      v68UpdateOrderDock();
    }
    function v68PeekOrder() {
      if (gameState.phase !== 'open' || !currentCustomer) {
        showToast('Chưa có đơn khách để xem.', '🧾');
        return;
      }
      v68ForceOrderDock = !v68ForceOrderDock;
      v68OrderExpanded = v68ForceOrderDock;
      v68UpdateOrderDock();
    }
    window.addEventListener('scroll', v68ScheduleOrderDock, {passive:true});
    window.addEventListener('resize', v68ScheduleOrderDock, {passive:true});
    setInterval(v68UpdateOrderDock, 700);

  

/* ==== V73 art override ==== */
(function applyV73ArtRefresh() {
  const V73_BUNNY = `assets/images/261_v73-bunny_2b526258ad.png`;
  const V73_CORGI = `assets/images/262_v73-corgi_4686836233.png`;
  const V73_CHIBI_MALE = `assets/images/263_v73-chibi-male_5a2c384007.png`;
  const V73_CHIBI_FEMALE = `assets/images/264_v73-chibi-female_5d4f2c44b4.png`;
  if (typeof V41_AVATAR_ART === 'object' && V41_AVATAR_ART) {
    if (V41_AVATAR_ART.v41_corgi) V41_AVATAR_ART.v41_corgi.src = V73_CORGI;
    if (V41_AVATAR_ART.v41_bunny) V41_AVATAR_ART.v41_bunny.src = V73_BUNNY;
  }
  if (typeof PLAYER_CHIBI_ART === 'object' && PLAYER_CHIBI_ART) {
    // V87.3.3 preserves optimized anime chibi sprite.
    // V87.3.3 preserves optimized anime chibi sprite.
  }
  const __v73_oldGetShopAvatarSource = getShopAvatarSource;
  getShopAvatarSource = function(id) {
    if (id === 'bunny') return V73_BUNNY;
    if (id === 'v41_corgi') return V73_CORGI;
    return __v73_oldGetShopAvatarSource(id);
  };
  const noodleArt = {
    broth_kimchi: `assets/images/265_broth-kimchi_5acb941d6d.png`,
    broth_tomyum: `assets/images/266_broth-tomyum_44da18ced7.png`,
    broth_beef: `assets/images/267_broth-beef_64c04a0cf2.png`,
    broth_mala: `assets/images/267_broth-beef_64c04a0cf2.png`,
    broth_mushroom: `assets/images/268_broth-mushroom_5f2191ddb2.png`,
    broth_collagen: `assets/images/269_broth-collagen_2662f669b1.png`,
    broth_tonkotsu: `assets/images/269_broth-collagen_2662f669b1.png`,
    broth_herbal: `assets/images/268_broth-mushroom_5f2191ddb2.png`,
    ntop_beef: `assets/images/270_ntop-beef_a34151f506.png`,
    ntop_shrimp: `assets/images/271_ntop-shrimp_9034b82fb8.png`,
    ntop_squid: `assets/images/272_ntop-squid_d2f82e1c5e.png`,
    ntop_sausage: `assets/images/273_ntop-sausage_cd12cdad25.png`,
    ntop_egg: `assets/images/274_ntop-egg_0fe2cc0867.png`,
    ntop_fishcake: `assets/images/273_ntop-sausage_cd12cdad25.png`,
    ntop_enoki: `assets/images/275_ntop-enoki_2a90d93bd7.png`,
    ntop_cheese: `assets/images/276_ntop-cheese_afd667d7ef.png`,
  };
  if (typeof V65_ART === 'object' && V65_ART) Object.assign(V65_ART, noodleArt);
  if (typeof V30_ART === 'object' && V30_ART) Object.assign(V30_ART, noodleArt);

})();

/* ==== V75 dynamic header/nav spacing fix ==== */
(function setupV75DynamicHeaderNavSpacing(){
  const header = document.querySelector('.compact-header');
  const nav = document.querySelector('.compact-nav');
  const main = document.querySelector('.main-stage');
  const shell = document.querySelector('.app-shell');
  if (!header || !nav || !main || !shell) return;

  let ticking = false;
  const update = () => {
    ticking = false;
    const headerH = Math.max(56, Math.ceil(header.getBoundingClientRect().height || header.offsetHeight || 0));
    const navH = Math.max(60, Math.ceil(nav.getBoundingClientRect().height || nav.offsetHeight || 0));
    const shellTop = Math.max(0, Math.round(shell.getBoundingClientRect().top || 0));
    const breathingRoom = window.matchMedia('(min-width: 768px)').matches ? 10 : 6;
    const totalTop = headerH + navH + breathingRoom;
    header.style.setProperty('top', `${shellTop}px`, 'important');
    nav.style.setProperty('top', `${shellTop + headerH}px`, 'important');
    main.style.setProperty('padding-top', `${totalTop}px`, 'important');
    document.documentElement.style.setProperty('--v75-header-h', `${headerH}px`);
    document.documentElement.style.setProperty('--v75-nav-h', `${navH}px`);
    document.documentElement.style.setProperty('--v75-main-top', `${totalTop}px`);
    if (typeof v68ScheduleOrderDock === 'function') v68ScheduleOrderDock();
  };

  const schedule = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  window.__updateHeaderNavLayout = schedule;
  window.addEventListener('resize', schedule, { passive:true });
  window.addEventListener('orientationchange', schedule, { passive:true });
  window.addEventListener('load', schedule, { passive:true });
  setTimeout(schedule, 0);
  setTimeout(schedule, 120);
  setTimeout(schedule, 400);

  if (window.ResizeObserver) {
    const ro = new ResizeObserver(schedule);
    ro.observe(header);
    ro.observe(nav);
  }
})();

