#!/usr/bin/env python3
"""Compila i renderitza els shaders reals amb OpenGL ES 3/EGL. No és una prova del navegador."""
import ctypes as C,os,re,json,subprocess
from pathlib import Path
os.environ.setdefault('EGL_PLATFORM','surfaceless')
root=Path(__file__).resolve().parent.parent;out=root/'docs';out.mkdir(exist_ok=True)
egl=C.CDLL('libEGL.so.1');gl=C.CDLL('libGLESv2.so.2')
def bind(lib,name,restype,args):
 f=getattr(lib,name);f.restype=restype;f.argtypes=args;return f
ptr=C.c_void_p;I=C.c_int;U=C.c_uint;F=C.c_float;P=C.POINTER
getdisplay=bind(egl,'eglGetDisplay',ptr,[ptr]);initialize=bind(egl,'eglInitialize',U,[ptr,P(I),P(I)]);api=bind(egl,'eglBindAPI',U,[U]);choose=bind(egl,'eglChooseConfig',U,[ptr,P(I),P(ptr),I,P(I)]);surface=bind(egl,'eglCreatePbufferSurface',ptr,[ptr,ptr,P(I)]);context=bind(egl,'eglCreateContext',ptr,[ptr,ptr,ptr,P(I)]);current=bind(egl,'eglMakeCurrent',U,[ptr,ptr,ptr,ptr]);
display=getdisplay(None);a=I();b=I();assert initialize(display,C.byref(a),C.byref(b)),'EGL initialize';assert api(0x30A0)
attrs=(I*13)(0x3033,1,0x3040,0x40,0x3024,8,0x3023,8,0x3022,8,0x3021,8,0x3038);config=ptr();n=I();assert choose(display,attrs,C.byref(config),1,C.byref(n)) and n.value
W,H=720,450;sattrs=(I*5)(0x3057,W,0x3056,H,0x3038);s=surface(display,config,sattrs);c=context(display,config,None,(I*3)(0x3098,3,0x3038));assert s and c and current(display,s,s,c),'EGL current'
create=bind(gl,'glCreateShader',U,[U]);source=bind(gl,'glShaderSource',None,[U,I,P(C.c_char_p),P(I)]);compile_=bind(gl,'glCompileShader',None,[U]);get=bind(gl,'glGetShaderiv',None,[U,U,P(I)]);log=bind(gl,'glGetShaderInfoLog',None,[U,I,P(I),C.c_char_p]);program=bind(gl,'glCreateProgram',U,[]);attach=bind(gl,'glAttachShader',None,[U,U]);link=bind(gl,'glLinkProgram',None,[U]);getp=bind(gl,'glGetProgramiv',None,[U,U,P(I)]);logp=bind(gl,'glGetProgramInfoLog',None,[U,I,P(I),C.c_char_p]);use=bind(gl,'glUseProgram',None,[U]);loc=bind(gl,'glGetUniformLocation',I,[U,C.c_char_p]);u1i=bind(gl,'glUniform1i',None,[I,I]);u1f=bind(gl,'glUniform1f',None,[I,F]);u2f=bind(gl,'glUniform2f',None,[I,F,F]);u4f=bind(gl,'glUniform4f',None,[I,F,F,F,F]);u3f=bind(gl,'glUniform3f',None,[I,F,F,F]);u1fv=bind(gl,'glUniform1fv',None,[I,I,P(F)]);gen=bind(gl,'glGenTextures',None,[I,P(U)]);texbind=bind(gl,'glBindTexture',None,[U,U]);active=bind(gl,'glActiveTexture',None,[U]);param=bind(gl,'glTexParameteri',None,[U,U,I]);image=bind(gl,'glTexImage2D',None,[U,I,I,I,I,I,U,U,ptr]);viewport=bind(gl,'glViewport',None,[I,I,I,I]);draw=bind(gl,'glDrawArrays',None,[U,I,I]);read=bind(gl,'glReadPixels',None,[I,I,I,I,U,U,ptr]);copy=bind(gl,'glCopyTexSubImage2D',None,[U,I,I,I,I,I,I,I]);err=bind(gl,'glGetError',U,[])
src=(root/'dist/visual.js').read_text();parts={name:re.search(r'const '+name+r'=`([\s\S]*?)`;',src).group(1) for name in ['vertex','fragment','display']}
def shader(type_,text):
 s=create(type_);text=text.encode();c=C.c_char_p(text);source(s,1,C.byref(c),None);compile_(s);ok=I();get(s,0x8B81,C.byref(ok));buf=C.create_string_buffer(8192);log(s,8192,None,buf);assert ok.value,buf.value.decode();return s
def make(fragment):
 p=program();attach(p,shader(0x8B31,parts['vertex']));attach(p,shader(0x8B30,fragment));link(p);ok=I();getp(p,0x8B82,C.byref(ok));buf=C.create_string_buffer(8192);logp(p,8192,None,buf);assert ok.value,buf.value.decode();return p
NMODES=len(re.findall(r"\{name:'",(root/'dist/analysis.js').read_text()))
p=make(parts['fragment']);screen=make(parts['display']);textures=(U*3)();gen(3,textures)
def blank():
 return (C.c_ubyte*(W*H*4))(*([0,0,0,255]*(W*H)))  # alfa 1 = cel·la morta a l'autòmat
BLANK=blank()
import math
for i in range(3):
 active(0x84C0+i);texbind(0x0DE1,textures[i]);param(0x0DE1,0x2801,0x2601);param(0x0DE1,0x2800,0x2601);param(0x0DE1,0x2802,0x812F);param(0x0DE1,0x2803,0x812F)
 if i==2:
  # Historial sintètic: un greu que es desplaça i un pic agut intermitent.
  hist=[max(0,min(255,round(200*math.exp(-((x/2-40-20*math.sin(r*.3))/14)**2)+150*math.exp(-((x/2-170)/6)**2)*(r%5<2)+40*math.sin(x*.1+r)**2))) for r in range(128) for x in range(512)]
  image(0x0DE1,0,0x8229,512,128,0,0x1903,0x1401,(C.c_ubyte*(512*128))(*hist));param(0x0DE1,0x2803,0x2901);continue
 data=BLANK if i==0 else (C.c_ubyte*512)(*[round(128+90*math.sin(j*.07)) for j in range(512)])
 image(0x0DE1,0,0x8058 if i==0 else 0x8229,W if i==0 else 512,H if i==0 else 1,0,0x1908 if i==0 else 0x1903,0x1401,data)
viewport(0,0,W,H);sums=[]
for mode in range(NMODES):
 active(0x84C0);texbind(0x0DE1,textures[0]);image(0x0DE1,0,0x8058,W,H,0,0x1908,0x1401,BLANK)
 for frame in range(12):
  use(p);u1i(loc(p,b'previous'),0);u1i(loc(p,b'waveform'),1);u1i(loc(p,b'history'),2);u1f(loc(p,b'historyHead'),20);u1fv(loc(p,b'bandAmp'),8,(F*8)(.8,.5,.3,.6,.2,.4,.1,.3));u4f(loc(p,b'tone'),.42,0,0,0);u2f(loc(p,b'resolution'),W,H);u4f(loc(p,b'audio'),.55,.35,.18,.2)
  for name,value in [('time',16+frame/60),('dt',1/60),('pulse',.4),('trails',.72),('hue',0),('blend',1),('reactivity',1.4),('growth',900+frame*.5)]:u1f(loc(p,name.encode()),value)
  u4f(loc(p,b'motion'),.37+frame*.004,.55+frame*.002,3.3+frame*.003,2.4+frame*.01);u3f(loc(p,b'pen'),2+frame*.3,2+max(frame-1,0)*.3,3)
  u1i(loc(p,b'modeA'),mode);u1i(loc(p,b'modeB'),mode);active(0x84C0);texbind(0x0DE1,textures[0]);draw(4,0,3);copy(0x0DE1,0,0,0,0,0,W,H)
 use(screen);u1i(loc(screen,b'image'),0);draw(4,0,3)
 pixels=(C.c_ubyte*(W*H*4))();read(0,0,W,H,0x1908,0x1401,pixels);assert err()==0,'OpenGL error';raw=bytes(pixels);sums.append(sum(raw[0::4])+sum(raw[1::4])+sum(raw[2::4]));assert sums[-1]>W*H*3,'Empty shader'
 subprocess.run(['magick','-size',f'{W}x{H}','-depth','8','rgba:-','-flip',str(out/f'preset-{mode+1}.png')],input=raw,check=True)
assert len(set(sums))==NMODES
# Mateix temps i mateix àudio; només varia l'impacte geomètric. Sense rastres previs.
reaction=[]
for mode in range(NMODES):
 shots=[]
 for strength in [0.,1.4]:
  active(0x84C0);texbind(0x0DE1,textures[0]);image(0x0DE1,0,0x8058,W,H,0,0x1908,0x1401,BLANK)
  use(p);u1i(loc(p,b'previous'),0);u1i(loc(p,b'waveform'),1);u1i(loc(p,b'history'),2);u1f(loc(p,b'historyHead'),20);u1fv(loc(p,b'bandAmp'),8,(F*8)(.8,.5,.3,.6,.2,.4,.1,.3));u4f(loc(p,b'tone'),.42,0,0,0);u2f(loc(p,b'resolution'),W,H);u4f(loc(p,b'audio'),.65,.4,.2,.2)
  for name,value in [('time',16),('dt',1/60),('pulse',.8),('trails',.72),('hue',0),('blend',1),('reactivity',strength),('growth',900)]:u1f(loc(p,name.encode()),value)
  u4f(loc(p,b'motion'),.37,.55,3.3,2.4);u3f(loc(p,b'pen'),6,5.7,3)
  u1i(loc(p,b'modeA'),mode);u1i(loc(p,b'modeB'),mode);draw(4,0,3)
  pixels=(C.c_ubyte*(W*H*4))();read(0,0,W,H,0x1908,0x1401,pixels);raw=bytes(pixels)
  lum=[sum(raw[j:j+3]) for j in range(0,len(raw),4)];total=sum(lum);shots.append([v/max(total,1) for v in lum])
 # Els fractals reaccionen en el detall orbital, amb la silueta fixa.
 distance=sum(abs(a-b) for a,b in zip(*shots));threshold=.005 if mode in (6,7) else .08  # els fractals reaccionen sobretot amb la velocitat del zoom (JS)
 if mode==10:reaction.append(None);continue  # el paper acumula tinta: prova pròpia a sota
 assert distance>threshold,(mode,distance);reaction.append(round(distance,4))
# Harmonògraf: el traç de llum s'acumula i el greu el fa més gruixut.
def ink_pixels(strength):
 active(0x84C0);texbind(0x0DE1,textures[0]);image(0x0DE1,0,0x8058,W,H,0,0x1908,0x1401,BLANK)
 for frame in range(60):
  use(p);u1i(loc(p,b'previous'),0);u1i(loc(p,b'waveform'),1);u1i(loc(p,b'history'),2);u2f(loc(p,b'resolution'),W,H);u4f(loc(p,b'audio'),.7,.4,.1,.2)
  for name,value in [('time',5+frame/60),('dt',1/60),('pulse',0),('trails',.72),('hue',0),('blend',1),('reactivity',strength)]:u1f(loc(p,name.encode()),value)
  u3f(loc(p,b'pen'),2+frame*.05,2+max(frame-1,0)*.05,3);u1i(loc(p,b'modeA'),10);u1i(loc(p,b'modeB'),10);draw(4,0,3);copy(0x0DE1,0,0,0,0,0,W,H)
 pixels=(C.c_ubyte*(W*H*4))();read(0,0,W,H,0x1908,0x1401,pixels);raw=bytes(pixels);return sum(1 for j in range(0,len(raw),4) if raw[j]+raw[j+1]+raw[j+2]>150)
ink=[ink_pixels(0.),ink_pixels(1.4)]
assert ink[0]>200 and ink[1]>ink[0]*1.3,ink
(out/'shader-check.json').write_text(json.dumps({'shaderCompilation':True,'renderedPresets':NMODES,'feedbackFramesPerPreset':12,'rgbChecksums':sums,'engine':'OpenGL ES 3 via EGL, not browser','browserVerified':False,'normalisedSpatialChangeByPreset':reaction,'harmonographInkPixels':{'impact0':ink[0],'impact1.4':ink[1]}},indent=2)+'\n')
print((out/'shader-check.json').read_text())
