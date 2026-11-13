import {t} from './i18n.js';
const vertex=`#version 300 es
precision highp float;
out vec2 uv;
void main(){vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);uv=p;gl_Position=vec4(p*2.-1.,0,1);}`;
const fragment=`#version 300 es
precision highp float;
in vec2 uv;out vec4 color;
uniform sampler2D previous;uniform sampler2D waveform;
uniform vec2 resolution;uniform vec4 audio;uniform float pulse;uniform float time;uniform float dt;uniform float trails;uniform float hue;uniform float blend;uniform float reactivity;uniform int modeA;uniform int modeB;
uniform sampler2D history;uniform float historyHead;uniform vec4 tone;uniform vec4 motion;uniform float growth;uniform vec3 pen;uniform vec4 spin;uniform float bandAmp[8];uniform float bandPhase[8];
#define ROWS 128.
float spectrumAt(float u,float back){return texture(history,vec2(clamp(u,0.,1.),(mod(historyHead-back,ROWS)+.5)/ROWS)).r;}
#define TAU 6.28318530718
mat2 rot(float a){return mat2(cos(a),-sin(a),sin(a),cos(a));}
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
// Hash enter sense patrons: per a gra fi a nivell de píxel.
float ihash(vec2 p){uvec2 q=uvec2(ivec2(p)+ivec2(1<<20))*uvec2(1597334673u,3812015801u);uint n=(q.x^q.y)*1597334673u;n^=n>>16;n*=2246822519u;n^=n>>13;return float(n)*(1./4294967295.);}
vec3 palette(float t){return .52+.48*cos(TAU*(t+vec3(.03,.34,.62)+hue));}
float line(float d,float width){return exp(-abs(d)/max(width,.0001));}
vec2 feedbackUV(int mode,vec2 point){
 vec2 q=point-.5;float stepTime=min(dt,.05)*60.;
 {
  float turn=(.003*sin(time*.21)+pulse*.025*reactivity)*stepTime;
  q=rot(turn)*q;q*=1.-(.0015+.012*audio.x*reactivity)*stepTime;
  q+=vec2(sin(q.y*9.+time)*.0007,cos(q.x*8.-time)*.0007)*stepTime;
 }
 return q+.5;
}
vec3 pattern(int mode,vec2 p){
 float b=audio.x*reactivity,m=audio.y*reactivity,h=audio.z*reactivity,k=pulse*reactivity;
 if(mode<=5){
  p=rot(.10*m*sin(time*.7)+.16*k)*p; p/=1.+.28*b+.22*k;
  p+=vec2(sin(p.y*4.+time)*.12*m,cos(p.x*3.-time)*.1*h);
 }
 float t=time*.32,r=length(p),a=atan(p.y,p.x);vec3 c=vec3(0.);
 if(mode==0){
  p*=rot(.15*sin(t*.22));
  for(int i=0;i<6;i++){float f=float(i);float y=p.y+(.23+.32*b)*sin(p.x*(1.5+.7*m)+t*.6+f*.65)+(.14+.18*m)*sin(p.x*3.2-t*.7+f*.9)+.06*sin(p.x*7.+t+f);float d=y+(f-2.5)*.125;float w=.012+.018*b;
   c+=palette(.11*f+t*.025)*line(d,w)*(.48+b*.5);c+=palette(.1*f+.14)*line(d,w*5.)*.055;
  }c+=palette(r*.2-t*.04)*.025/(.2+r);
 }else if(mode==1){
  float s=sin(a*6.+sin(t)*2.+r*8.-t*2.);float petals=abs(r-(.44+.16*s+.20*b+.12*k));c=palette(a/TAU+t*.04)*line(petals,.012+.012*b);c+=palette(.3+t*.05)*line(r-.19-.035*sin(a*12.+t),.009);c+=palette(.7+r)*line(sin(r*24.-t*3.+sin(a*8.)*.6),.07)*exp(-r*1.8)*.36;c*=.6+b*.8;
 }else if(mode==2){
  vec2 q=p;for(int i=0;i<5;i++){float f=float(i)+1.;q+=vec2(sin(q.y*2.+t/f+f),cos(q.x*2.-t/f))*(.23+.18*m);}
  float v=sin(q.x*4.+t)+sin(q.y*5.-t*.8)+sin((q.x+q.y)*4.+t*.4);c=palette(v*.12+t*.025)*(.15+pow(abs(sin(v*2.+r*4.)),7.)*(.55+b*.8));c*=exp(-r*.45);
 }else if(mode==3){
  float z=1./max(r,.08);float lanes=abs(sin(a*9.+sin(t*.4)+z*.16));float rings=abs(sin(z*1.7-t*3.-k*1.8-b*.9));c=palette(z*.04+a/TAU+t*.02)*(line(lanes,.035)+line(rings,.035))*(.5+b)*smoothstep(.05,.2,r);c+=palette(t*.1)*exp(-r*11.)*.7;
 }else if(mode==4){
  vec2 q=p*rot(t*.07);for(int layer=0;layer<3;layer++){float f=float(layer)+1.;vec2 grid=q*(6.+f*5.);vec2 id=floor(grid),local=fract(grid)-.5;float rnd=hash(id+f*17.);vec2 shift=vec2(sin(rnd*TAU+t/f),cos(rnd*TAU+t/f))*(.24+.22*h);float d=length(local-shift);float sparkle=pow(max(0.,sin(t*(1.+rnd)+rnd*20.)),5.);c+=palette(rnd+f*.2)*exp(-d*d*(100.+f*60.))*(.25+sparkle+b*.6)/f;}
  c+=palette(p.y*.22+t*.02)*.08*exp(-pow(p.y-.3*sin(p.x*2.+t*.3),2.)*12.);
 }else if(mode==5){
  float wave=texture(waveform,vec2(clamp(p.x*.35+.5,0.,1.),.5)).r*2.-1.;
  for(int i=0;i<5;i++){float f=float(i);float y=sin(p.x*3.+t*1.4+f*.32)*(.14+.15*b)+wave*(.6+audio.w*2.)*(1.+b)+.09*sin(p.x*9.-t+f);float d=p.y-y+(f-2.)*.08;c+=palette(f*.11+t*.02)*line(d,.006+.008*b)*(.45+b);}
  c+=palette(.3)*line(abs(p.y)-.62,.003)*.08;
 }
 return c*(.75+.20*b+.25*k);
}
// ---- Modes amb llenguatge propi: cadascun decideix la seva composició (no hereten per índex). ----
// 0 clàssic amb memòria, 2 directe sense memòria, 5 traç de llum amb zoom (la memòria s'apropa cap a dins).
int composite(int mode){if(mode<=5)return 0;if(mode==10)return 5;return 2;}
vec2 cmul(vec2 a,vec2 b){return vec2(a.x*b.x-a.y*b.y,a.x*b.y+a.y*b.x);}
vec2 cexp(vec2 z){return exp(z.x)*vec2(cos(z.y),sin(z.y));}
vec2 clog(vec2 z){return vec2(log(length(z)),atan(z.y,z.x));}
vec2 csqrt(vec2 z){float r=length(z);return vec2(sqrt(.5*(r+z.x)),(z.y<0.?-1.:1.)*sqrt(max(.5*(r-z.x),0.)));}
vec3 fractalColor(float index,float near,float b,float k){
 vec3 c=palette(index)*(.2+1.1*near);
 return c*(.8+.35*b)+vec3(1.,.95,.85)*pow(near,12.)*(.15+.6*k);
}
// La música sobre el zoom: cada corba de nivell de l'exterior s'encén amb la seva banda de l'espectre
// (greus lluny, aguts arran del conjunt) i cada cop envia una onada de llum cap a dins.
vec3 fractalMusic(float level,float u,float index){
 float k=pulse*reactivity,since=-.18*log(max(pulse,.002));
 float eq=smoothstep(.32,.95,spectrumAt(u,0.));
 float d=abs(fract(level+.5)-.5),fw=max(fwidth(level),1e-4);
 float contour=1.-smoothstep(fw*.6,fw*1.8,d);              // corba de nivell d'un píxel i mig
 vec3 c=palette(index+.25)*contour*eq*(.3+1.1*u)*(.6+.5*reactivity);
 float wave=exp(-pow((u-since*1.25)*14.,2.))*k;
 return c+mix(palette(index+.5),vec3(1.),.4)*wave*(.1+.8*u)*.8;
}
// Jardí de Julia: zoom infinit cap a un punt periòdic repulsiu (cicle de període 2).
// La funció de Poincaré ψ(Λv)=f²(ψ(v)) fa que el fotograma de la fase 1 sigui exactament el de la fase 0:
// cada volta del bucle és la mateixa forma, amb una còpia d'ella mateixa a dins.
const vec2 JC=vec2(-.122,.745);
vec3 julia(vec2 p,float phase){
 float b=audio.x*reactivity,h=audio.z*reactivity,k=pulse*reactivity;
 vec2 d=csqrt(vec2(-3.-4.*JC.x,-4.*JC.y)),z0=.5*(vec2(-1.,0.)+d),z1=cmul(z0,z0)+JC,L=4.*cmul(z0,z1),logL=clog(L);
 float f=fract(phase);const int N=7;
 vec2 delta=cmul(p*1.35,cexp(-(f+float(N))*logL)),z=z0;
 float n=0.;bool out_=false;
 for(int i=0;i<N;i++){
  delta=cmul(2.*z0+delta,delta);delta=cmul(2.*z1+delta,delta);n+=2.;
  if(dot(z0+delta,z0+delta)>256.){out_=true;break;}
 }
 z=z0+delta;
 float trap=10.;
 if(!out_)for(int i=0;i<150;i++){z=cmul(z,z)+JC;n+=1.;trap=min(trap,abs(length(z)-.6-.1*h));if(dot(z,z)>256.){out_=true;break;}}
 if(!out_)return palette(.62+.08*sin(time*.2))*(.04+.10*b)+palette(.15)*exp(-trap*30.)*.35*(.3+h+b);
 float mu=n+1.-log2(max(log2(length(z)),1e-3))-float(2*N)-2.*f;  // la mateixa escala de color a cada volta
 float near=smoothstep(-2.,24.,mu);
 return fractalColor(mu*.045+time*.015,near,b,k)*(.03+.97*pow(near,1.4))+fractalMusic(mu*.5,clamp(mu/26.,0.,1.),mu*.045+time*.015);
}
// Mandelbrot: zoom cap al minibrot de període 3 (c≈−1,7549, escala 0,01904): quan l'omple, es veu
// el Mandelbrot inicial i el bucle continua cap al minibrot del minibrot, indefinidament.
vec3 mandelFrame(vec2 p,float f,out float weight){
 const float K=.0190355159,C3=-1.75487766625;const vec2 FIX=vec2(-1.78893088864,0.);
 float scale=pow(K,f);vec2 c=FIX+(vec2(-.62,0.)-FIX)*scale+p*1.22*scale;
 vec2 z=vec2(0.);float n=0.;bool out_=false;
 int limit=int(70.+150.*clamp(f+.25,0.,1.));
 for(int i=0;i<230;i++){if(i>=limit)break;z=cmul(z,z)+c;n+=1.;if(dot(z,z)>1024.){out_=true;break;}}
 weight=out_?1.:0.;
 if(!out_)return vec3(0.);
 float mu=n+1.-log2(log2(length(z)));
 // Dins del minibrot cada pas «val» tres: el logaritme en base 3 manté els colors en reprendre el bucle.
 float index=log(max(mu,1.))/log(3.)-f;
 float rel=mu/pow(3.,f),near=smoothstep(1.,26.,rel);
 return fractalColor(index*.55+time*.015,near,audio.x*reactivity,pulse*reactivity)*(.03+.97*pow(near,1.4))+fractalMusic(index*6.,clamp(rel/26.,0.,1.),index*.55+time*.015);
}
vec3 mandelbrot(vec2 p,float phase){
 float f=fract(phase),w;vec3 c=mandelFrame(p,f,w);
 float blendOut=smoothstep(.86,1.,f);
 if(blendOut>0.){float w2;c=mix(c,mandelFrame(p,f-1.,w2),blendOut);}
 return c;
}
// Gira-sol de Fibonacci: les llavors neixen al centre i s'allunyen. Tot el disc gira amb els cops,
// l'angle de divergència es desvia de l'angle d'or (les espirals es tornen braços i radis) i cada anell
// de llavors és una banda de l'espectre: greus al centre, aguts a la vora.
vec3 sunflower(vec2 p,float growth){
 float b=audio.x*reactivity,m=audio.y*reactivity,k=pulse*reactivity;
 const float S=.055;float GOLD=2.39996322973+spin.y;
 p=rot(spin.x)*p;
 float a0=dot(p,p)/(S*S),best=1e9,index=0.,bestAge=0.;int J=min(int(2.*sqrt(a0))+4,64);
 for(int j=-64;j<=64;j++){if(j<-J||j>J)continue;
  float n=floor(growth-a0)+float(j),age=growth-n;
  if(age<0.)continue;
  vec2 seed=S*sqrt(age)*vec2(cos(n*GOLD),sin(n*GOLD));
  vec2 dv=p-seed;float dd=dot(dv,dv);if(dd<best){best=dd;index=n;bestAge=age;}
 }
 float r=S*sqrt(bestAge),since=-.18*log(max(pulse,.002));
 float wave=exp(-pow((r-since*1.8)/.14,2.))*k;
 float eq=smoothstep(.3,.95,spectrumAt(r/1.9,r*6.));
 float size=S*(.27+.25*eq)*smoothstep(0.,5.,bestAge)*(.85+.2*b+.45*wave);
 float d=sqrt(best),aa=1.5*2./resolution.y,disc=smoothstep(size,size-aa,d);
 float family=mix(mod(index,21.)/21.,mod(index,34.)/34.,smoothstep(.35,.65,tone.x));
 vec3 seedColor=mix(vec3(1.,.66,.12),palette(family*.5+r*.15),.35+.3*eq)*(.55+.6*smoothstep(size,0.,d));
 seedColor*=(.8+.8*eq+.9*wave)*(1.-.35*smoothstep(1.,1.8,length(p)));
 vec3 ground=vec3(.02,.025,.015)+vec3(.05,.03,0.)*exp(-length(p)*2.)+palette(.1)*.05*m*exp(-length(p)*1.5);
 return mix(ground,seedColor,disc);
}
// Quasicristall: set ones planes a 360°/7 que interfereixen; cada ona és una banda de l'espectre i avança
// segons la seva energia. La suma es solaritza (efecte Sabattier): els tons alts s'inverteixen i apareixen vores.
vec3 quasicrystal(vec2 p){
 float b=audio.x*reactivity,m=audio.y*reactivity,h=audio.z*reactivity,k=pulse*reactivity;
 float scale=15.*(1.+.18*sin(time*.05))/(1.+.22*b+.12*k),sum=0.,total=0.;
 for(int i=0;i<7;i++){
  float a=float(i)*TAU/7.+.04*sin(time*.03),w=.45+1.6*bandAmp[i]*min(reactivity,2.);
  sum+=w*cos(dot(p,vec2(cos(a),sin(a)))*scale+bandPhase[i]);total+=w;
 }
 float L=.5+.5*sum/total;
 float folds=1.+floor(clamp(b,0.,1.)*2.+.5);              // els greus pleguen més vegades els tons
 L=fract(L*folds+.07*sin(time*.2));
 float T=clamp(.55+.2*sin(time*.17)-.2*m-.25*k,.15,.85);
 float sol=L<T?L/T:(1.-L)/(1.-T);
 float edge=clamp(length(vec2(dFdx(sol),dFdy(sol)))*resolution.y*.012,0.,1.);
 vec3 dark=vec3(.01,.01,.03),mid=palette(.82+.15*sin(time*.04)+.2*tone.x)*1.15,light=vec3(1.,.93,.78);
 vec3 c=mix(dark,mid,smoothstep(.05,.6,sol));c=mix(c,light,smoothstep(.62,1.,sol));
 c+=vec3(1.,.95,.85)*edge*(.25+.9*h);
 return c*(1.-.25*smoothstep(1.,2.,length(p)));
}
// Harmonògraf de llum: dos pèndols esmorteïts dibuixen sobre fons fosc. La memòria s'amplia lentament
// cap al centre (zoom cap a dins), i els traços antics s'allunyen i s'apaguen com un túnel de corbes.
vec2 penAt(float t,float id){
 float r=hash(vec2(id,4.1));
 vec2 ratio=r<.2?vec2(2.,3.):r<.4?vec2(3.,4.):r<.6?vec2(1.,2.):r<.8?vec2(3.,5.):vec2(4.,5.);
 float detune=.004+.012*hash(vec2(id,9.3)),w=TAU*.22,decay=exp(-t*.06);
 vec2 phase=vec2(hash(vec2(id,1.7)),hash(vec2(id,2.9)))*TAU;
 vec2 pos=vec2(sin(ratio.x*w*t+phase.x),sin((ratio.y+detune)*w*t+phase.y))*.62;
 pos+=vec2(sin((ratio.y*w+.03)*t),cos((ratio.y*w+.03)*t))*.14*exp(-t*.09);
 return pos*(.35+.65*decay)*vec2(1.08,1.);
}
vec4 harmonograph(vec2 p){
 float b=audio.x*reactivity,m=audio.y*reactivity,h=audio.z*reactivity,k=pulse*reactivity;
 // Zoom cap a dins: la imatge anterior es llegeix més a prop del centre; el greu i el cop l'acceleren.
 float zoom=.0012+.0035*b+.006*k,stepTime=min(dt,.05)*60.;
 vec2 q=(uv-.5)*(1.-zoom*stepTime)+.5;q+=(rot(.0015*stepTime)*(uv-.5)-(uv-.5))*.6;
 vec3 old=texture(previous,q).rgb;
 vec3 c=max(old*pow(mix(.90,.985,trails),stepTime)-1./255.,0.);
 float t=pen.x,tPrev=pen.y,id=pen.z;
 // El so mou el traç: greu i cop l'allunyen, la forma d'ona el fa vibrar, els aguts el fan tremolar.
 float reach=1.+.4*b+.3*k,grow=1./(1.-zoom*stepTime);
 // El tros nou comença on el zoom ha deixat el final de l'anterior: el traç no es trenca.
 float dist=10.;vec2 prev=penAt(tPrev,id)*reach*grow;
 for(int i=1;i<=14;i++){
  float s=mix(tPrev,t,float(i)/14.),u=float(i)/14.;vec2 pt=penAt(s,id)*reach;
  vec2 w=vec2(texture(waveform,vec2(fract(u*.5+time*.37),.5)).r,texture(waveform,vec2(fract(u*.5+time*.37+.5),.5)).r)*2.-1.;
  pt+=w*(.03+.09*m)+vec2(sin(s*97.),cos(s*83.))*.012*h;
  vec2 pa=p-prev,ba=pt-prev;float v=clamp(dot(pa,ba)/max(dot(ba,ba),1e-8),0.,1.);
  dist=min(dist,length(pa-ba*v));prev=pt;
 }
 float px=2./resolution.y,width=px*(.6+1.3*b+1.2*k);
 float core=smoothstep(width+px,width,dist),glow=exp(-dist/(px*(2.5+4.*b)));
 vec3 ink=mix(pow(palette(.55+.5*tone.x+.13*id+.08*sin(time*.1)),vec3(1.8))*1.6,vec3(1.,.95,.9),.05+.45*k);
 c+=ink*(core*(.7+.5*b+.9*k)+glow*(.08+.22*b));
 c+=ink*smoothstep(.004+.012*k,0.,length(p-penAt(t,id)*reach))*(.6+k);   // cap de la ploma
 return vec4(min(c,vec3(2.)),1.);
}
// Túnel de Chladni: plaques vibrants apilades; el vol les travessa i cada placa té la figura del to que sonava.
const vec3 CHLADNI[12]=vec3[12](vec3(1,2,-1),vec3(1,3,1),vec3(2,3,-1),vec3(1,4,-1),vec3(2,5,1),vec3(3,4,-1),vec3(1,5,1),vec3(3,5,-1),vec3(2,7,1),vec3(4,5,-1),vec3(3,7,1),vec3(5,6,-1));
vec3 chladniTunnel(vec2 p,float flight){
 float b=audio.x*reactivity,h=audio.z*reactivity,k=pulse*reactivity,P=3.14159265;
 vec3 c=vec3(0.);float cover=0.;
 float px=2./resolution.y;
 for(int i=0;i<12;i++){
  float layer=floor(flight)+float(i),z=layer-flight+1.;   // z=0 a la càmera
  if(z<.08)continue;
  vec2 q=rot(layer*.37)*p*z*.62;
  float edge=max(abs(q.x),abs(q.y));if(edge>1.04)continue;
  int key=int(clamp(floor(hash(vec2(layer,.5))*4.+tone.x*8.),0.,11.));
  vec3 m=CHLADNI[key];float A=m.x*P,B=m.y*P;
  float f=cos(A*q.x)*cos(B*q.y)+m.z*cos(B*q.x)*cos(A*q.y);
  vec2 grad=vec2(-A*sin(A*q.x)*cos(B*q.y)-m.z*B*sin(B*q.x)*cos(A*q.y),-B*cos(A*q.x)*sin(B*q.y)-m.z*A*cos(B*q.x)*sin(A*q.y));
  float toScreen=1./(z*.62);                      // unitats de placa → unitats de pantalla
  float dist=abs(f)/max(length(grad),1e-3)*toScreen;
  float scatter=1.+3.*k*exp(-z*.8);
  // Línia nodal nítida (antialiàs d'un píxel) i sorra fina al voltant, que el cop escampa.
  float core=max(.0007,(.0010+.0016*b)*min(toScreen,2.5));
  float line_=smoothstep(core+px,core,dist);
  float width=(.0035+.004*b)*scatter*(.6+.4*min(toScreen,2.));
  vec2 gid=floor(gl_FragCoord.xy)+layer*17.;
  float grain=max(line_*.9,step(mix(ihash(gid),ihash(gid+floor(time*25.)*7.),clamp(h*.6,0.,.6)),exp(-pow(dist/width,1.5))*.55));
  float fade=smoothstep(.08,.5,z)*exp(-z*.26);
  float rim=smoothstep(px*1.2,0.,abs(edge-1.)*toScreen)*.6;
  vec3 sandColor=mix(vec3(1.,.86,.6),palette(.55+layer*.07),.25+.35*smoothstep(1.,6.,z));
  float a=max(grain,rim)*fade;
  c+=(1.-cover)*a*mix(sandColor,vec3(.7,.75,.85),rim*(1.-grain));
  cover+=(1.-cover)*a*.85;
 }
 return c+vec3(.02,.03,.05)*(1.-cover)*exp(-length(p)*3.);
}
// Paisatge espectral: cada línia és l'espectre d'un instant; les més noves davant. Línies d'un píxel amb antialiàs.
vec3 ridges(vec2 p){
 float aspect=resolution.x/resolution.y,cover=-10.,b=audio.x*reactivity,k=pulse*reactivity,px=2./resolution.y;vec3 c=vec3(0.);
 for(int i=0;i<56;i++){
  float f=float(i),z=1.+f*.06,scale=1./z,base=.6-1.42/z,half_=aspect*.88*scale;
  float u=p.x/(2.*half_)+.5;
  float v=smoothstep(.30,.97,spectrumAt(u,f*1.5));
  float edge=smoothstep(0.,.05,u)*smoothstep(1.,.95,u);
  float calm=.008*sin(u*23.+time*.6+f*.7)+.004*sin(u*57.-time*.9);
  float y=base+(pow(v,1.4)*.55+calm)*scale*edge*(1.+.25*b);
  if(p.y<cover)break;
  if(u>0.&&u<1.){
   float depth=f/55.,d=abs(p.y-y);
   vec3 ink=mix(palette(.58+depth*.12),vec3(1.,.93,.82),smoothstep(.45,.95,v));
   float stroke=smoothstep(px*(1.1+.6*scale),px*.25,d)+.25*exp(-d/(px*3.));
   c+=ink*stroke*(1.1-depth*.85)*(i==0?1.+.8*k:1.);
   cover=max(cover,y);
  }
 }
 return c;
}
vec4 render(int mode,vec2 p){
 int kind=composite(mode);
 vec4 old=texture(previous,uv);
 if(kind==5)return harmonograph(p);
 if(kind==2){
  vec3 c=mode==6?julia(p,motion.x):mode==7?mandelbrot(p,motion.y):mode==8?sunflower(p,growth):mode==9?quasicrystal(p):mode==11?ridges(p):chladniTunnel(p,motion.w);
  return vec4(c,1.);
 }
 vec3 fresh=pattern(mode,p);old=texture(previous,feedbackUV(mode,uv));
 float retention=pow(mix(.1,.975,trails),dt*60.);retention*=1.-clamp(pulse*reactivity*.18,0.,.45);
 return vec4(max(max(old.rgb*retention-1./255.,0.),fresh)+fresh*(1.-retention)*.3,1.);
}
void main(){vec2 p=(uv-.5)*vec2(resolution.x/resolution.y,1.)*2.;
 vec4 result=blend>=1.||modeA==modeB?render(modeB,p):mix(render(modeA,p),render(modeB,p),smoothstep(0.,1.,blend));
 color=vec4(clamp(result.rgb,0.,3.),result.a);
}`;
const display=`#version 300 es
precision highp float;in vec2 uv;out vec4 color;uniform sampler2D image;
uniform float paper;
void main(){vec3 c=texture(image,uv).rgb;vec2 p=(uv-.5)*2.;c*=1.-.14*smoothstep(.7,1.6,length(p));vec3 light=pow(1.-exp(-c*1.15),vec3(.88));color=vec4(mix(light,c,paper),1);}  // el paper es mostra tal com és`;
export class VisualEngine{
 constructor(canvas,options={}){this.fixedSize=options.size;this.canvas=canvas;const gl=this.gl=canvas.getContext('webgl2',{alpha:false,antialias:false,preserveDrawingBuffer:true,powerPreference:'high-performance'});if(!gl)throw Error(t('Prisma necessita WebGL 2. Activa l’acceleració gràfica o prova un navegador actualitzat.'));this.lost=false;this.frames=0;this.waveBytes=new Uint8Array(512);this.targets=[];this.vao=gl.createVertexArray();gl.bindVertexArray(this.vao);this.drawProgram=this.program(vertex,fragment);this.screenProgram=this.program(vertex,display);this.uniforms={};for(const k of ['previous','waveform','resolution','audio','pulse','time','dt','trails','hue','blend','reactivity','modeA','modeB','history','historyHead','tone','motion','growth','pen','spin','bandAmp','bandPhase'])this.uniforms[k]=gl.getUniformLocation(this.drawProgram,k);this.imageUniform=gl.getUniformLocation(this.screenProgram,'image');this.paperUniform=gl.getUniformLocation(this.screenProgram,'paper');this.waveTexture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,this.waveTexture);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texImage2D(gl.TEXTURE_2D,0,gl.R8,512,1,0,gl.RED,gl.UNSIGNED_BYTE,new Uint8Array(512).fill(128));this.history=new Uint8Array(512*128);this.historyRow=new Uint8Array(512);this.bandAmp=new Float32Array(8);this.bandPhase=new Float32Array(8);this.spin=[0,0,0,0];this.historyHead=0;this.historyClock=0;this.tone=.3;this.motion=[0,.08,0,0];this.growth=1200;this.penTime=0;this.penPrev=0;this.historyTexture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,this.historyTexture);for(const [k,v] of [[gl.TEXTURE_MIN_FILTER,gl.LINEAR],[gl.TEXTURE_MAG_FILTER,gl.LINEAR],[gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE],[gl.TEXTURE_WRAP_T,gl.REPEAT]])gl.texParameteri(gl.TEXTURE_2D,k,v);gl.texImage2D(gl.TEXTURE_2D,0,gl.R8,512,128,0,gl.RED,gl.UNSIGNED_BYTE,this.history);canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();this.lost=true;this.onLost?.()});canvas.addEventListener('webglcontextrestored',()=>this.onRestore?.());this.resize(options.size||'auto')}
 program(vs,fs){const gl=this.gl,shaders=[];for(const [type,source] of [[gl.VERTEX_SHADER,vs],[gl.FRAGMENT_SHADER,fs]]){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(t('Error de shader: ')+gl.getShaderInfoLog(s));shaders.push(s)}const p=gl.createProgram();for(const s of shaders)gl.attachShader(p,s);gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw Error(t('Error WebGL: ')+gl.getProgramInfoLog(p));for(const s of shaders)gl.deleteShader(s);return p}
 resize(quality){if(this.lost)return;const gl=this.gl,rect=this.canvas.getBoundingClientRect(),factor=quality==='low'?.65:quality==='high'?Math.min(devicePixelRatio,1.7):Math.min(devicePixelRatio,1.15);const [width,height]=this.fixedSize||[Math.min(1920,Math.max(200,Math.round(rect.width*factor))),Math.max(150,Math.round(rect.height*factor))];if(this.canvas.width===width&&this.canvas.height===height&&this.targets.length)return;this.canvas.width=width;this.canvas.height=height;for(const t of this.targets){gl.deleteTexture(t.texture);gl.deleteFramebuffer(t.framebuffer)}this.targets=[];for(let i=0;i<2;i++){const texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA8,width,height,0,gl.RGBA,gl.UNSIGNED_BYTE,null);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);const framebuffer=gl.createFramebuffer();gl.bindFramebuffer(gl.FRAMEBUFFER,framebuffer);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,texture,0);if(gl.checkFramebufferStatus(gl.FRAMEBUFFER)!==gl.FRAMEBUFFER_COMPLETE)throw Error(t('No s’ha pogut crear la memòria gràfica.'));gl.clearColor(0,0,0,1);gl.clear(gl.COLOR_BUFFER_BIT);this.targets.push({texture,framebuffer})}gl.bindFramebuffer(gl.FRAMEBUFFER,null);this.index=0}
 // Historial de l'espectre en escala logarítmica (30 Hz–14 kHz) i to dominant suavitzat.
 listen(dt,audio,spectrum,sampleRate,settings={},time=0){
  const row=this.historyRow;
  // 512 bandes logarítmiques; als greus, on hi ha menys línies de la FFT que bandes, s'interpolen.
  if(spectrum?.length&&sampleRate){const n=spectrum.length,hz=sampleRate/(2*n),ratio=14000/30;let weight=0,sum=0;
   for(let i=0;i<512;i++){const f0=30*ratio**(i/512)/hz,f1=30*ratio**((i+1)/512)/hz;let m=0;
    if(f1-f0<1){const x=Math.min(n-2,(f0+f1)/2),j=Math.floor(x),t=x-j;m=spectrum[j]*(1-t)+spectrum[j+1]*t}
    else for(let j=Math.max(1,Math.floor(f0));j<Math.min(n,Math.ceil(f1));j++)m=Math.max(m,spectrum[j]);
    row[i]=Math.max(m,row[i]);const e=(m/255)**3;weight+=e;sum+=e*i/511}
   if(weight>.8)this.tone+=(sum/weight-this.tone)*(1-Math.exp(-dt/1.4));
  }else row.fill(0);
  this.history.set(row,this.historyHead*512);this.historyClock+=dt;
  if(this.historyClock>1/24){this.historyClock%=1/24;this.historyHead=(this.historyHead+1)%128;row.fill(0)}
  // Vuit bandes per al quasicristall: energia amb atac ràpid i caiguda de 250 ms; la fase avança segons l'energia.
  for(let k=0;k<8;k++){let e=0;for(let i=k*64;i<k*64+64;i++)e+=row[i];e=Math.min(1,Math.max(0,(e/64/255-.28)/.55));
   const a=this.bandAmp[k];this.bandAmp[k]=a+(e-a)*(1-Math.exp(-dt/(e>a?.03:.25)));
   this.bandPhase[k]=(this.bandPhase[k]+dt*(settings.speed??1)*(.25+3.2*this.bandAmp[k])*(k%2?1:-1))%(Math.PI*200)}
  // Rellotges dels modes amb recorregut propi: el so accelera el viatge, però mai el fa anar enrere.
  const pace=dt*(settings.speed??1),bass=audio.bass||0,mid=audio.mid||0,m=this.motion;
  const kick=audio.pulse||0;           // cada cop és una empenta visible cap a dins
  m[0]+=pace*(.14+.25*bass+.9*kick);   // Julia: voltes del zoom (cada volta ×4,6)
  m[1]+=pace*(.04+.08*bass+.22*kick);  // Mandelbrot: voltes del zoom cap al minibrot (cada volta ×52)
  m[2]+=pace*(.055+.09*bass)+((audio.pulse||0)>.9?pace*.08:0);   // Garbell: una pàgina de nombres per volta
  m[3]+=pace*(.40+1.2*bass);           // Túnel de Chladni: plaques travessades
  this.growth+=pace*(4+7*bass+8*kick);   // Gira-sol: llavors noves, prou lentes per veure-les néixer
  this.spin[0]+=pace*(.025+.05*mid+.18*kick);  // gir suau del disc
  // Desviació molt petita de l'angle d'or: a les llavors exteriors ja es nota molt, així que va a poc a poc.
  const target=.0009*Math.sin(time*.035)+(this.tone-.42)*.0012;this.spin[1]+=(target-this.spin[1])*(1-Math.exp(-dt/8));
  this.penPrev=this.penTime;this.penTime+=pace*(.9+1.4*mid+2.2*kick);
 }
 clear(){const gl=this.gl;for(const t of this.targets){gl.bindFramebuffer(gl.FRAMEBUFFER,t.framebuffer);gl.clearColor(0,0,0,1);gl.clear(gl.COLOR_BUFFER_BIT)}gl.bindFramebuffer(gl.FRAMEBUFFER,null)}
 release(){this.gl.getExtension('WEBGL_lose_context')?.loseContext()}
 frame(time,dt,audio,settings,transition,wave,spectrum,sampleRate){if(this.lost)return;this.listen(dt,audio,spectrum,sampleRate,settings,time);const gl=this.gl;gl.bindVertexArray(this.vao);gl.viewport(0,0,this.canvas.width,this.canvas.height);gl.useProgram(this.drawProgram);const u=this.uniforms;gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,this.targets[this.index].texture);gl.uniform1i(u.previous,0);gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,this.waveTexture);if(wave){const data=this.waveBytes;for(let i=0;i<512;i++)data[i]=wave[Math.floor(i*wave.length/512)];gl.texSubImage2D(gl.TEXTURE_2D,0,0,0,512,1,gl.RED,gl.UNSIGNED_BYTE,data)}gl.uniform1i(u.waveform,1);gl.activeTexture(gl.TEXTURE2);gl.bindTexture(gl.TEXTURE_2D,this.historyTexture);gl.texSubImage2D(gl.TEXTURE_2D,0,0,0,512,128,gl.RED,gl.UNSIGNED_BYTE,this.history);gl.uniform4f(u.spin,...this.spin);gl.uniform1fv(u.bandAmp,this.bandAmp);gl.uniform1fv(u.bandPhase,this.bandPhase);gl.uniform1i(u.history,2);gl.uniform1f(u.historyHead,this.historyHead);gl.uniform4f(u.tone,this.tone,0,0,0);gl.uniform4f(u.motion,...this.motion);gl.uniform1f(u.growth,this.growth);{const cycle=24,id=Math.floor(this.penTime/cycle),t=this.penTime-id*cycle,prev=Math.max(0,this.penPrev-id*cycle);gl.uniform3f(u.pen,t,prev,id)}gl.activeTexture(gl.TEXTURE0);gl.uniform2f(u.resolution,this.canvas.width,this.canvas.height);gl.uniform4f(u.audio,audio.bass,audio.mid,audio.high,audio.rms);gl.uniform1f(u.pulse,audio.pulse);gl.uniform1f(u.time,time);gl.uniform1f(u.dt,Math.min(dt,.05));gl.uniform1f(u.trails,settings.trails);gl.uniform1f(u.hue,settings.hue/360);gl.uniform1f(u.blend,transition.blend);gl.uniform1f(u.reactivity,settings.reactivity??1.4);gl.uniform1i(u.modeA,transition.from);gl.uniform1i(u.modeB,transition.to);const next=1-this.index;gl.bindFramebuffer(gl.FRAMEBUFFER,this.targets[next].framebuffer);gl.drawArrays(gl.TRIANGLES,0,3);gl.bindFramebuffer(gl.FRAMEBUFFER,null);gl.useProgram(this.screenProgram);gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,this.targets[next].texture);gl.uniform1i(this.imageUniform,0);gl.uniform1f(this.paperUniform,0);gl.drawArrays(gl.TRIANGLES,0,3);this.index=next;this.frames++}
}
