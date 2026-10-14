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

premium_css=(root/'css/v88-17-1-9-premium-counter.css').read_text(encoding='utf-8')
# Preserve the exact CSS ordering used by index.html.
html=html.replace('</head>','<style>'+premium_css+'</style></head>')
polish_js=(root/'js/v88-17-1-9-premium-counter.js').read_text(encoding='utf-8')
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 errors=[]
 for width in [320,390,430,768,1024]:
  page=browser.new_page(viewport={'width':width,'height':900},device_scale_factor=1)
  page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content(html,wait_until='domcontentloaded')
  page.evaluate("""()=>{
    window.BPVQCookingStation={status:()=>({stage:'mix',practice:false,pour:72,handoffHeld:false})};
    window.BPVQCookingBridge={snapshot:()=>({career:'boba',phase:'open',
     customer:{key:'test',name:'Mika'},
     dish:{base:'tea_black',toppings:['topping_boba'],toppingPortions:{topping_boba:1},ice:50},
     label:{topping_boba:'Trân châu',tea_black:'Trà đen'}})};
  }""")
  page.add_script_tag(content=js)
  page.add_script_tag(content=polish_js)
  page.wait_for_timeout(250)
  sizes=page.evaluate("""()=>{
    const box=s=>{const e=document.querySelector(s);if(!e)return null;
      const r=e.getBoundingClientRect();return {x:r.x,y:r.y,right:r.right,bottom:r.bottom,w:r.width,h:r.height,display:getComputedStyle(e).display}};
    const b=box('#cp177-workshop .cp177-workbench');
    const top=box('#cp177-workshop .cp177-top');
    return {viewport:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth,
      workshop:box('#cp177-workshop'),top,hero:box('#cp177-workshop .cp179-hero'),
      order:box('#cp177-workshop .cp177-order'),bench:b,
      dispenser:box('#cp177-pour-object'),cup:box('#cp177-workshop .cp177-cup-place'),
      liveCup:box('#cp177-workshop #cs20-visual svg'),
      pantry:box('#cp177-workshop .cp177-ingredients'),options:box('#cp177-workshop .cp177-options'),
      actions:box('#cp177-workshop .cp177-actions'),
      background:getComputedStyle(document.querySelector('#cp177-workshop .cp177-workbench')).backgroundImage};
  }""")
  print('PREMIUM QA',width,{k:v for k,v in sizes.items() if k!='background'})
  assert not errors,('browser JS exceptions',errors)
  for section in ['workshop','top','order','bench','pantry','options','actions','dispenser','cup']:
   assert sizes[section] and sizes[section]['w']>30 and sizes[section]['h']>25,('missing visual',width,section,sizes)
  assert sizes['scroll']<=sizes['viewport']+2,('horizontal overflow',width,sizes)
  assert sizes['top']['bottom']<=sizes['hero']['y']+3,('hidden/displaced header',width,sizes)
  assert sizes['bench']['bottom']<=sizes['pantry']['y']+3,('stage overlaps pantry',width,sizes)
  assert sizes['pantry']['bottom']<=sizes['options']['y']+3,('pantry overlaps sugar/ice',width,sizes)
  assert sizes['options']['bottom']<=sizes['actions']['y']+3,('options overlap buttons',width,sizes)
  if width<=800:
   assert sizes['order']['bottom']<=sizes['bench']['y']+3,('mobile order overlaps stage',width,sizes)
  else:
   assert sizes['order']['right']<=sizes['bench']['x']+3,('desktop order overlaps stage',width,sizes)
  assert sizes['background']!='none',('workbench art absent',width,sizes)
  assert sizes['dispenser']['right']>sizes['bench']['x'] and sizes['dispenser']['x']<sizes['bench']['right']
  assert sizes['cup']['right']>sizes['bench']['x'] and sizes['cup']['x']<sizes['bench']['right']

  # Tea backdrop has one central wooden board. A centered live SVG must align with it.
  assert sizes['liveCup'] and sizes['liveCup']['h']>=100,('live cup not visible',width,sizes)
  cup_mid=(sizes['liveCup']['x']+sizes['liveCup']['right'])/2
  bench_mid=(sizes['bench']['x']+sizes['bench']['right'])/2
  assert abs(cup_mid-bench_mid)<=sizes['bench']['w']*.08,('cup misses center tray',width,cup_mid,bench_mid)
  assert sizes['liveCup']['bottom']>=sizes['bench']['bottom']-50,('cup floats above tray',width,sizes)
  assert sizes['liveCup']['bottom']<=sizes['bench']['bottom']+3,('cup falls below tray',width,sizes)
  assert sizes['bench']['h'] <= (220 if width<=425 else 231 if width<=800 else 310),('counter not compact',width,sizes['bench'])

  page.screenshot(path=f'visual_qa_counter_{width}.png',full_page=True)
  page.close()
 browser.close()
print('PASS premium visual QA: cup centered on tray, compact stage, controls not overlapping, 320/390/430/768/1024px')
