/* Bỏ Phố Về Quê v87.6.1 — hình nguyên liệu (chỉ sửa ánh xạ hình và dự phòng tải lại ảnh).
   Không chỉnh gameState, nghề, giá, kho, công thức, nhiệm vụ hay localStorage. */
(function () {
  "use strict";
  if (typeof V30_ART === "undefined" || typeof V65_ART === "undefined") {
    console.error("[v87.6.1] Thiếu bảng ảnh game, không thể khởi tạo bản vá.");
    return;
  }
  const updatedArt = {
  "broth_mala": "assets/images/018_broth-mala_ddf6e7b91b.webp",
  "broth_beef": "assets/images/267_broth-beef_64c04a0cf2.png",
  "broth_collagen": "assets/images/019_broth-collagen_08ac71d3e8.webp",
  "broth_tonkotsu": "assets/images/269_broth-collagen_2662f669b1.png",
  "broth_herbal": "assets/images/021_broth-herbal_f4689d18c1.webp",
  "broth_mushroom": "assets/images/268_broth-mushroom_5f2191ddb2.png",
  "ntop_fishcake": "assets/images/025_ntop-fishcake_24bbcc8954.webp",
  "ntop_sausage": "assets/images/273_ntop-sausage_cd12cdad25.png",
  "skewer_fish": "assets/images/097_skewer-fish_2b89ecf0f2.webp",
  "skewer_crabstick": "assets/images/104_skewer-crabstick_2ae98200df.webp",
  "skewer_beef": "assets/images/098_skewer-beef_613e29801f.webp",
  "skewer_chicken": "assets/images/106_skewer-chicken_202d7ee5f4.webp",
  "skewer_quail": "assets/images/102_skewer-quail_64f82907cf.webp",
  "skewer_sausage": "assets/images/100_skewer-sausage_0d6c41b67e.webp",
  "skewer_beef_enoki": "assets/images/040_skewer-beef-enoki_2c40f0764f.webp",
  "skewer_mushroom": "assets/images/103_skewer-mushroom_ce7b6f05d7.webp",
  "skewer_squid": "assets/images/107_skewer-squid_5ee8b9479b.webp",
  "skewer_okra": "assets/images/105_skewer-okra_8f1ce09e6b.webp",
  "skewer_tofu": "assets/images/101_skewer-tofu_6ecd1b4452.webp",
  "skewer_shrimp": "assets/images/099_skewer-shrimp_8ffdd3175b.webp",
  "sauce_sweet_chili": "assets/images/108_sauce-sweet-chili_e934851eee.webp",
  "skewer_cheese_sausage": "assets/images/v8761_clean_skewer_cheese_sausage.webp",
  "sauce_tamarind": "assets/images/v8761_clean_sauce_tamarind.webp",
  "sauce_mayo": "assets/images/v8761_clean_sauce_mayo.webp",
  "sauce_honey_mustard": "assets/images/v8761_clean_sauce_honey_mustard.webp",
  "sauce_bbq": "assets/images/v8761_clean_sauce_bbq.webp",
  "tea_black": "assets/images/v8761_tea_black.svg",
  "tea_oolong": "assets/images/v8761_tea_oolong.svg",
  "topping_cookie": "assets/images/v8761_topping_cookie.svg",
  "topping_lychee": "assets/images/v8761_topping_lychee.svg",
  "tea_matcha": "assets/images/v8761_tea_matcha.svg",
  "topping_peach": "assets/images/v8761_topping_peach.svg",
  "topping_brown_boba": "assets/images/v8761_topping_brown_boba.svg",
  "topping_salted_cream": "assets/images/v8761_topping_salted_cream.svg",
  "syrup_rainbow": "assets/images/v8761_syrup_rainbow.svg",
  "broth_lemongrass_coconut": "assets/images/v8761_broth_lemongrass_coconut.svg",
  "broth_signature_satay": "assets/images/v8761_broth_signature_satay.svg",
  "ntop_oyster_mushroom": "assets/images/v8761_ntop_oyster_mushroom.svg",
  "ntop_beef_roll": "assets/images/v8761_ntop_beef_roll.svg",
  "ntop_cheese_ball": "assets/images/v8761_ntop_cheese_ball.svg",
  "skewer_holo": "assets/images/v8761_skewer_holo.svg",
  "skewer_bacon_okra": "assets/images/v8761_skewer_bacon_okra.svg",
  "skewer_pineapple": "assets/images/v8761_skewer_pineapple.svg",
  "skewer_cheese_stick": "assets/images/v8761_skewer_cheese_stick.svg",
  "skewer_pork_pineapple": "assets/images/v8761_skewer_pork_pineapple.svg",
  "sauce_five_spice": "assets/images/v8761_sauce_five_spice.svg",
  "sauce_festival": "assets/images/v8761_sauce_festival.svg"
};
  Object.assign(V30_ART, updatedArt);
  Object.assign(V65_ART, updatedArt);
  // Tải lại các ảnh bị rớt mạng một lần, không tạo vòng lặp lỗi.
  document.addEventListener("error", function (evt) {
    const img = evt.target;
    if (!(img instanceof HTMLImageElement) || img.dataset.v8761Retried) return;
    const url = img.getAttribute("src") || "";
    if (!url.startsWith("assets/images/") && !url.startsWith("./assets/images/")) return;
    img.dataset.v8761Retried = "1";
    const cacheBuster = url.includes("?") ? "&" : "?";
    setTimeout(function () { if (img.isConnected) img.src = url + cacheBuster + "v8761_retry=1"; }, 350);
  }, true);
  // Nhằm áp dụng ảnh mới ngay trên tab Quán, kể cả lần mở đầu trên điện thoại.
  function rerenderOnce() {
    if (typeof renderWorkbenchControls === "function") {
      try { renderWorkbenchControls(); }
      catch (err) { console.warn("[v87.6.1] render ảnh lần đầu chưa sẵn sàng", err); }
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", rerenderOnce, {once:true});
  else rerenderOnce();
  console.info("[v87.6.1] Đã cập nhật", Object.keys(updatedArt).length, "ID hình nguyên liệu.");
})();
