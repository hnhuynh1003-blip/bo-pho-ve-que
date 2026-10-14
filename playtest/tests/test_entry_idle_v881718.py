from pathlib import Path
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
js=(root/'js/v88-unified-shop.js').read_text()
html='''<!doctype html><html><body><div id="tab-shop"><section id="v88-live-scene"><div id="v88-live-frame"><div id="customer-booth-card"></div><div id="v88-live-other-career"></div></div><section id="cs20-station"></section><section id="cp177-workshop"></section></section><button id="btn-toggle-shop"></button></div></body></html>'''
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=browser.new_page(viewport={'width':390,'height':844},reduced_motion='reduce')
 page.set_content(html)
 page.evaluate('''()=>{
  window.BPVQLiveSceneQA={update(){},status:()=>({})};
  window.BPVQCookingBridge={snapshot:()=>({career:'boba',started:true,customer:null,phase:'preparing'})};
  window.BPVQCookingStation={status:()=>({practice:false}),startPractice:()=>true,stopPractice:()=>true};
  window.matchMedia=()=>({matches:true});
  window.BPVQCounterRemake177={refresh(){}};
 }''')
 page.add_script_tag(content=js)
 button=page.locator('#us21-enter-kitchen')
 assert button.is_visible(),'must show enter kitchen when shop is closed'
 button.click()
 assert page.locator('#v88-live-scene').get_attribute('data-view')=='kitchen','single click must enter directly'
 assert page.locator('#v88-live-scene').get_attribute('data-career')=='boba'
 page.locator('#us21-exit-kitchen').click()
 assert page.locator('#v88-live-scene').get_attribute('data-view')=='yard'
 print('PASS single-click entry closed shift and explicit return to yard')
 browser.close()