from pathlib import Path
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright
import base64, re
root=Path(__file__).resolve().parents[1]
source=(root/'index.html').read_text()
soup=BeautifulSoup(source,'html.parser')
station=soup.select_one('#cs20-station');station['hidden']=False;station['data-career']='boba';station['data-state']='order'
for n in station.select('.cs20-ticket'):n.decompose()
exit=soup.new_tag('button',id='us21-exit-kitchen');exit.string='← Trở về sân';station.insert(0,exit)
stage=station.select_one('.cs20-stage')
cap=stage.select_one('figcaption');sz=soup.new_tag('div',id='cs27-containers');
for label in ['M','L','XL']:
 b=soup.new_tag('button',attrs={'class':'cs27-container'});b.string=label;sz.append(b)
cap.append(sz)
visual=station.select_one('#cs20-visual');visual.append(BeautifulSoup('''<svg viewBox="0 0 200 180"><defs><clipPath id="cs20-cup-clip"><path d="M52 35 Q100 29 148 35 L138 156 Q100 170 62 156 Z"></path></clipPath></defs><path d="M52 35 Q100 29 148 35 L138 156 Q100 170 62 156Z" fill="#ffeed1" stroke="#936644" stroke-width="3"/><g clip-path="url(#cs20-cup-clip)"><rect x="45" y="60" width="110" height="110" fill="#d7a070"/>'''+''.join(f'<circle cx="{70+(i%7)*10}" cy="{147-(i//7)*9}" r="4" fill="#54382b"/>' for i in range(28))+'''</g><path d="M51 38 Q100 22 149 38" stroke="#fff8de" fill="none" stroke-width="5"/></svg>''','html.parser'))
cs26=soup.new_tag('div',id='cs26-meters');
for label in ['Đường','Đá']:
 wrap=soup.new_tag('label',attrs={'class':'cs26-meter '+('sugar' if label=='Đường' else 'ice')})
 sp=soup.new_tag('span');sp.string=label
 rng=soup.new_tag('input',attrs={'class':'cs26-range','type':'range','value':'1'});
 txt=soup.new_tag('strong');txt.string='70%' if label=='Đường' else '50%';wrap.extend([sp,rng,txt]);cs26.append(wrap)
stage.append(cs26)
grp=station.select_one('#cs20-groups');grp.parent.insert(0,soup.new_tag('div',attrs={'class':'cs30-pantry-bar'}));grp.extract();station.select_one('.cs30-pantry-bar').append(grp)
for label in ['Topping & siro','Cốt trà']:
 b=soup.new_tag('button',attrs={'class':'cs20-group'+(' picked' if label.startswith('Topping') else '')});b.string=label;grp.append(b)
shelf=station.select_one('#cs20-shelf');shelf['data-rows']='1'
items=[('topping_boba','Trân châu','topping_boba-ai-tray.webp'),('topping_white_boba','Trân châu trắng','topping_white_boba-ai-tray.webp'),('topping_pudding','Pudding','topping_pudding-ai-tray.webp'),('topping_jelly','Thạch dừa','topping_jelly-ai-tray.webp'),('topping_peach','Thạch đào','topping_peach-ai-tray.webp'),('topping_crystal','Thạch thủy tinh','topping_crystal-ai-tray.webp'),('topping_aloe','Nha đam','topping_aloe-ai-tray.webp')]
for id,label,filename in items:
 b=soup.new_tag('button',attrs={'type':'button','class':'cs20-item cs26-jar'+(' picked' if id=='topping_boba' else ''),'data-item':id})
 art=soup.new_tag('span',attrs={'class':'cs26-jar-image cp176-ai-tray'});im=soup.new_tag('img',attrs={'src':'assets/images/v88/cute-premium/'+filename,'class':'cp176-ai-tray-img'});art.append(im)
 name=soup.new_tag('span',attrs={'class':'cs20-item-name'});name.string=label
 count=soup.new_tag('span',attrs={'class':'cs26-jar-stock'});count.string='12'
 b.extend([art,name,count]);shelf.append(b)
station.select_one('#cs20-primary')['data-act']='cap-start';station.select_one('#cs20-primary').string='✦ Dập nắp / Giao món'
station.select_one('#cs20-sale-price').string='55 Xu'
station.select_one('#cs33-order-title').string='Trà sữa trân châu'
station.select_one('#cs33-order-summary').string='Ly L · Trà đen · Trân châu ×2 · Pudding ×1 · Đường 70% · Đá 50%'
station.select_one('#cs20-dish-name').string='Trà sữa trân châu'
scene=soup.new_tag('section',id='v88-live-scene',attrs={'class':'us21-unified us21-kitchen-view','data-career':'boba'})
scene.append(station)
html='<!doctype html><html lang="vi"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/><style>body{margin:0;padding:0;background:#e8d3b9;font-family:Arial,sans-serif}#v88-live-scene{margin:0 auto;max-width:900px;padding:5px}</style><style>'+(root/'css/v88-17-1-8-kitchen-qa.css').read_text()+'</style></head><body>'+str(scene)+'</body></html>'
assets=root/'assets/images/v88/cute-premium'
for f in assets.glob('*.webp'):
 url='assets/images/v88/cute-premium/'+f.name
 html=html.replace('src="'+url+'"','src="data:image/webp;base64,'+base64.b64encode(f.read_bytes()).decode()+'"')
 html=html.replace("url('../"+url+"')","url('data:image/webp;base64,"+base64.b64encode(f.read_bytes()).decode()+"')")
 html=html.replace("url(\"../"+url+"\")","url('data:image/webp;base64,"+base64.b64encode(f.read_bytes()).decode()+"')")
 # new script creates new images at runtime, use JS patched base64 URLs in script text
js=(root/'js/v88-17-1-7-counter-remake.js').read_text()
for f in assets.glob('*.webp'):
 url='assets/images/v88/cute-premium/'+f.name
 js=js.replace("'"+f.name+"'","'"+f.name+"'")
# Instead replace dynamic JS prefix with data placeholder route using DOM mutation after script is loaded.
html=html.replace('background:url(\'../assets/images/v88/cute-premium/boba_backbar.webp\')','background:url(\'data:image/webp;base64,'+base64.b64encode((assets/'boba_backbar.webp').read_bytes()).decode()+'\')')
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in [320,360,390,430,760]:
  page=browser.new_page(viewport={'width':width,'height':920}, device_scale_factor=1)
  page.on('pageerror',lambda e:print('PAGE ERROR',e))
  page.set_content(html,wait_until='domcontentloaded')
  page.evaluate('''()=>{window.BPVQCookingStation={status:()=>({stage:'mix',practice:false,pour:72})};window.BPVQCookingBridge={snapshot:()=>({career:'boba',phase:'open',customer:{key:'test',name:'Mika'},dish:{base:'tea_black',toppings:['topping_boba','topping_pudding'],toppingPortions:{topping_boba:2,topping_pudding:1},ice:50},label:{topping_boba:'Trân châu',topping_pudding:'Pudding',tea_black:'Trà đen'}})};}''')
  page.add_script_tag(content=js)
  page.wait_for_timeout(900)
  # Inject images from data URI once to allow offline fixture.
  imgs={f.name:'data:image/webp;base64,'+base64.b64encode(f.read_bytes()).decode() for f in assets.glob('*.webp')}
  page.evaluate('''(imgs)=>{const find=()=>document.querySelectorAll('#cp177-workshop img');find().forEach(x=>{const name=x.getAttribute('src')?.split('/').pop();if(imgs[name])x.src=imgs[name];});}''',imgs)
  page.screenshot(path='/mnt/data/BPVQ_v88_17_1_8_FIXTURE_'+str(width)+'.png',full_page=True)
  dims=page.evaluate('''()=>({scroll:document.documentElement.scrollWidth,view:document.documentElement.clientWidth,workshop:document.getElementById('cp177-workshop').getBoundingClientRect().height,items:document.querySelectorAll('#cp177-workshop #cs20-shelf button').length,realItem:!!document.querySelector('#cp177-workshop #cs20-shelf [data-item="topping_boba"]'),oldRootDisplay:getComputedStyle(document.querySelector('#cs20-station')).display})''')
  print('fixture',width,dims)
  assert dims['scroll']<=dims['view'],f'horizontal overflow at {width}px'
  assert dims['items']==len(items),'missing native topping buttons'
  geometry=page.evaluate("""()=>{
   const box=x=>{const r=document.querySelector(x)?.getBoundingClientRect();return r?{x:r.x,y:r.y,right:r.right,bottom:r.bottom,w:r.width,h:r.height}:null};
   return {order:box('.cp177-order'),bench:box('.cp177-workbench'),size:box('.cp178-size-slot'),
    meter:box('.cp178-meter-slot'),options:box('.cp177-options'),shelf:box('#cs20-shelf'),
    actions:box('.cp177-actions'),caption:getComputedStyle(document.querySelector('#cp177-workshop .cs20-stage figcaption')).display,
    item:box('#cs20-shelf .cs20-item'),sizeParent:document.querySelector('#cs27-containers')?.parentElement?.className,
    meterParent:document.querySelector('.cs20-field')?.parentElement?.className};
  }""")
  assert geometry['order']['bottom']<=geometry['bench']['y']+1 or geometry['order']['right']<=geometry['bench']['x']+1, ('order overlaps cooking', width, geometry)
  assert geometry['bench']['bottom']<=geometry['options']['y']+1, ('cup overlaps meters',width,geometry)
  assert geometry['options']['bottom']<=geometry['shelf']['y']+20, ('meter overlaps topping',width,geometry)
  assert geometry['shelf']['bottom']<=geometry['actions']['y']+10, ('topping overlaps action buttons',width,geometry)
  assert geometry['size']['x']>=geometry['bench']['x']-1 and geometry['size']['right']<=geometry['bench']['right']+1
  assert geometry['caption']=='none','old captions must not overlay active cup'
  assert geometry['sizeParent']=='cp178-size-slot'
  assert geometry['meterParent']=='cp178-meter-slot'
  assert geometry['item']['w']>=80, ('item touch surface too small',width,geometry)
  print('spatial QA',width,{k:v for k,v in geometry.items() if k in ['caption','sizeParent','meterParent','item']})

  if width==390:
   hit=page.evaluate("""()=>{
    const orig=document.querySelector('#cp177-workshop #cs20-shelf [data-item=topping_boba]');
    const stage=document.querySelector('#cp177-workshop .cs20-stage');
    const met=document.querySelector('#cp177-workshop #cs26-meters');
    const native=document.querySelector('#cs20-station');
    let ingredient=0,poured=0;
    orig.addEventListener('click',()=>ingredient++);
    orig.click();
    const primary=document.querySelector('#cs20-primary');
    primary.addEventListener('click',()=>poured++);
    primary.dataset.act='pour';primary.disabled=false;
    window.BPVQCounterRemake177.refresh();
    const tea=document.querySelector('#cp177-pour-object');const active=!tea.disabled;
    tea.click();
    const stillSameButton=orig===document.querySelector('#cp177-workshop #cs20-shelf [data-item=topping_boba]');
    const noOldCardsInRoot=!native.contains(stage)&&!native.contains(orig);
    return {ingredient,poured,active,stillSameButton,noOldCardsInRoot,metMoved:!!met};
   }""")
   print('interactive QA',hit)
   assert hit=={'ingredient':1,'poured':1,'active':True,'stillSameButton':True,'noOldCardsInRoot':True,'metMoved':True}
   # Open live native receipt and ensure its popup stays inside the counter's horizontal bounds.
   page.locator('#cs33-order-detail').evaluate("el=>el.textContent='Khách: Mika · Trân châu x2 · Pudding x1 · Giá 55 Xu'")
   page.locator('#cp177-workshop .cs33-order-ticket summary').click()
   receipt=page.evaluate("""()=>{const e=document.querySelector('#cs33-order-detail'),r=e.getBoundingClientRect(),p=document.querySelector('#cp177-workshop').getBoundingClientRect();return {left:r.left,right:r.right,bottom:r.bottom,pl:p.left,pr:p.right};}""")
   assert receipt['left']>=receipt['pl']-1 and receipt['right']<=receipt['pr']+1,('receipt clipped',receipt)
   page.locator('#cp177-workshop .cs33-order-ticket summary').click()
   # Return native nodes to station on a career change, then remount, with no clones or lost handlers.
   switch=page.evaluate("""()=>{
      const original=document.getElementById('cs27-containers');
      const native=document.getElementById('cs20-station');
      window.BPVQCookingBridge.snapshot=()=>({career:'noodle',phase:'open',customer:null});
      window.BPVQCounterRemake177.refresh();
      const restored=native.contains(original) && native.contains(document.querySelector('.cs20-field'));
      window.BPVQCookingBridge.snapshot=()=>({career:'boba',phase:'open',customer:{key:'test'},dish:{base:'tea_black',toppings:[],toppingPortions:{}},label:{}});
      window.BPVQCounterRemake177.refresh();
      return {restored,remounted:document.querySelector('.cp178-size-slot').contains(original),unique:document.querySelectorAll('#cs27-containers').length===1};
   }""")
   assert all(switch.values()),('career switch must restore size and meter before remount',switch)
   print('career switch QA',switch)

  page.close()
 browser.close()