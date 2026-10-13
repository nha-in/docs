(()=>{var dt,S,Nr,Ei,le,Dr,Hr,zr,Dt,ot,He,Wr,Bt,Ft,$t,Ti,lt={},ct=[],Ri=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i,ze=Array.isArray;function ne(e,t){for(var r in t)e[r]=t[r];return e}function Nt(e){e&&e.parentNode&&e.parentNode.removeChild(e)}function we(e,t,r){var a,n,i,s={};for(i in t)i=="key"?a=t[i]:i=="ref"?n=t[i]:s[i]=t[i];if(arguments.length>2&&(s.children=arguments.length>3?dt.call(arguments,2):r),typeof e=="function"&&e.defaultProps!=null)for(i in e.defaultProps)s[i]===void 0&&(s[i]=e.defaultProps[i]);return st(e,s,a,n,null)}function st(e,t,r,a,n){var i={type:e,props:t,key:r,ref:a,__k:null,__:null,__b:0,__e:null,__c:null,constructor:void 0,__v:n??++Nr,__i:-1,__u:0};return n==null&&S.vnode!=null&&S.vnode(i),i}function $(e){return e.children}function K(e,t){this.props=e,this.context=t}function he(e,t){if(t==null)return e.__?he(e.__,e.__i+1):null;for(var r;t<e.__k.length;t++)if((r=e.__k[t])!=null&&r.__e!=null)return r.__e;return typeof e.type=="function"?he(e):null}function Mi(e){if(e.__P&&e.__d){var t=e.__v,r=t.__e,a=[],n=[],i=ne({},t);i.__v=t.__v+1,S.vnode&&S.vnode(i),Ht(e.__P,i,t,e.__n,e.__P.namespaceURI,32&t.__u?[r]:null,a,r??he(t),!!(32&t.__u),n),i.__v=t.__v,i.__.__k[i.__i]=i,Xr(a,i,n),t.__e=t.__=null,i.__e!=r&&Vr(i)}}function Vr(e){if((e=e.__)!=null&&e.__c!=null)return e.__e=e.__c.base=null,e.__k.some(function(t){if(t!=null&&t.__e!=null)return e.__e=e.__c.base=t.__e}),Vr(e)}function Fr(e){(!e.__d&&(e.__d=!0)&&le.push(e)&&!ut.__r++||Dr!=S.debounceRendering)&&((Dr=S.debounceRendering)||Hr)(ut)}function ut(){try{for(var e,t=1;le.length;)le.length>t&&le.sort(zr),e=le.shift(),t=le.length,Mi(e)}finally{le.length=ut.__r=0}}function jr(e,t,r,a,n,i,s,l,f,c,p){var _,d,h,k,v,b,x=a&&a.__k||ct,w=t.length;for(f=Ci(r,t,x,f,w),_=0;_<w;_++)(h=r.__k[_])!=null&&(d=h.__i!=-1&&x[h.__i]||lt,h.__i=_,b=Ht(e,h,d,n,i,s,l,f,c,p),k=h.__e,h.ref&&d.ref!=h.ref&&(d.ref&&zt(d.ref,null,h),p.push(h.ref,h.__c||k,h)),v==null&&k!=null&&(v=k),4&h.__u?(f=Gr(h,f,e),d.__e&&(d.__e=null)):typeof h.type=="function"&&b!==void 0?f=b:k&&(f=k.nextSibling),h.__u&=-7);return r.__e=v,f}function Ci(e,t,r,a,n){var i,s,l,f,c,p=r.length,_=p,d=0;for(e.__k=new Array(n),i=0;i<n;i++)(s=t[i])!=null&&typeof s!="boolean"&&typeof s!="function"?(typeof s=="string"||typeof s=="number"||typeof s=="bigint"||s.constructor==String?s=e.__k[i]=st(null,s,null,null,null):ze(s)?s=e.__k[i]=st($,{children:s},null,null,null):s.constructor===void 0&&s.__b>0?s=e.__k[i]=st(s.type,s.props,s.key,s.ref?s.ref:null,s.__v):e.__k[i]=s,f=i+d,s.__=e,s.__b=e.__b+1,l=null,(c=s.__i=Pi(s,r,f,_))!=-1&&(_--,(l=r[c])&&(l.__u|=2)),l==null||l.__v==null?(c==-1&&(n>p?d--:n<p&&d++),typeof s.type!="function"&&(s.__u|=4)):c!=f&&(c==f-1?d--:c==f+1?d++:(c>f?d--:d++,s.__u|=4))):e.__k[i]=null;if(_)for(i=0;i<p;i++)(l=r[i])!=null&&(2&l.__u)==0&&(l.__e==a&&(a=he(l)),Kr(l,l));return a}function Gr(e,t,r){var a,n;if(typeof e.type=="function"){for(a=e.__k,n=0;a&&n<a.length;n++)a[n]&&(a[n].__=e,t=Gr(a[n],t,r));return t}e.__e!=t&&(t&&e.type&&!t.parentNode&&(t=he(e)),t=r.insertBefore(e.__e,t||null));do t=t&&t.nextSibling;while(t!=null&&t.nodeType==8);return t}function We(e,t){return t=t||[],e==null||typeof e=="boolean"||(ze(e)?e.some(function(r){We(r,t)}):t.push(e)),t}function Pi(e,t,r,a){var n,i,s,l=e.key,f=e.type,c=t[r],p=c!=null&&(2&c.__u)==0;if(c===null&&l==null||p&&l==c.key&&f==c.type)return r;if(a>(p?1:0)){for(n=r-1,i=r+1;n>=0||i<t.length;)if((c=t[s=n>=0?n--:i++])!=null&&(2&c.__u)==0&&l==c.key&&f==c.type)return s}return-1}function $r(e,t,r){t[0]=="-"?e.setProperty(t,r??""):e[t]=r==null?"":typeof r!="number"||Ri.test(t)?r:r+"px"}function it(e,t,r,a,n){var i,s;e:if(t=="style")if(typeof r=="string")e.style.cssText=r;else{if(typeof a=="string"&&(e.style.cssText=a=""),a)for(t in a)r&&t in r||$r(e.style,t,"");if(r)for(t in r)a&&r[t]==a[t]||$r(e.style,t,r[t])}else if(t[0]=="o"&&t[1]=="n")i=t!=(t=t.replace(Wr,"$1")),s=t.toLowerCase(),t=s in e||t=="onFocusOut"||t=="onFocusIn"?s.slice(2):t.slice(2),e.l||(e.l={}),e.l[t+i]=r,r?a?r[He]=a[He]:(r[He]=Bt,e.addEventListener(t,i?$t:Ft,i)):e.removeEventListener(t,i?$t:Ft,i);else{if(n=="http://www.w3.org/2000/svg")t=t.replace(/xlink(H|:h)/,"h").replace(/sName$/,"s");else if(t!="width"&&t!="height"&&t!="href"&&t!="list"&&t!="form"&&t!="tabIndex"&&t!="download"&&t!="rowSpan"&&t!="colSpan"&&t!="role"&&t!="popover"&&t in e)try{e[t]=r??"";break e}catch{}typeof r=="function"||(r==null||r===!1&&t[4]!="-"?e.removeAttribute(t):e.setAttribute(t,t=="popover"&&r==1?"":r))}}function Br(e){return function(t){if(this.l){var r=this.l[t.type+e];if(t[ot]==null)t[ot]=Bt++;else if(t[ot]<r[He])return;return r(S.event?S.event(t):t)}}}function Ht(e,t,r,a,n,i,s,l,f,c){var p,_,d,h,k,v,b,x,w,L,P,O,C,N,I,J,g=t.type;if(t.constructor!==void 0)return null;128&r.__u&&(f=!!(32&r.__u),i=[l=t.__e=r.__e]),(p=S.__b)&&p(t);e:if(typeof g=="function"){_=s.length;try{if(w=t.props,L=g.prototype&&g.prototype.render,P=(p=g.contextType)&&a[p.__c],O=p?P?P.props.value:p.__:a,r.__c?x=(d=t.__c=r.__c).__=d.__E:(L?t.__c=d=new g(w,O):(t.__c=d=new K(w,O),d.constructor=g,d.render=Oi),P&&P.sub(d),d.state||(d.state={}),d.__n=a,h=d.__d=!0,d.__h=[],d._sb=[]),L&&d.__s==null&&(d.__s=d.state),L&&g.getDerivedStateFromProps!=null&&(d.__s==d.state&&(d.__s=ne({},d.__s)),ne(d.__s,g.getDerivedStateFromProps(w,d.__s))),k=d.props,v=d.state,d.__v=t,h)L&&g.getDerivedStateFromProps==null&&d.componentWillMount!=null&&d.componentWillMount(),L&&d.componentDidMount!=null&&d.__h.push(d.componentDidMount);else{if(L&&g.getDerivedStateFromProps==null&&w!==k&&d.componentWillReceiveProps!=null&&d.componentWillReceiveProps(w,O),t.__v==r.__v||!d.__e&&d.shouldComponentUpdate!=null&&d.shouldComponentUpdate(w,d.__s,O)===!1){t.__v!=r.__v&&(d.props=w,d.state=d.__s,d.__d=!1),t.__e=r.__e,t.__k=r.__k,t.__k.some(function(E){E&&(E.__=t)}),ct.push.apply(d.__h,d._sb),d._sb=[],d.__h.length&&s.push(d),l=he(r);break e}d.componentWillUpdate!=null&&d.componentWillUpdate(w,d.__s,O),L&&d.componentDidUpdate!=null&&d.__h.push(function(){d.componentDidUpdate(k,v,b)})}if(d.context=O,d.props=w,d.__P=e,d.__e=!1,C=S.__r,N=0,L)d.state=d.__s,d.__d=!1,C&&C(t),p=d.render(d.props,d.state,d.context),ct.push.apply(d.__h,d._sb),d._sb=[];else do d.__d=!1,C&&C(t),p=d.render(d.props,d.state,d.context),d.state=d.__s;while(d.__d&&++N<25);d.state=d.__s,d.getChildContext!=null&&(a=ne(ne({},a),d.getChildContext())),L&&!h&&d.getSnapshotBeforeUpdate!=null&&(b=d.getSnapshotBeforeUpdate(k,v)),I=p!=null&&p.type===$&&p.key==null?Yr(p.props.children):p,l=jr(e,ze(I)?I:[I],t,r,a,n,i,s,l,f,c),d.base=t.__e,t.__u&=-161,d.__h.length&&s.push(d),x&&(d.__E=d.__=null)}catch(E){if(s.length=_,t.__v=null,f||i!=null){if(E.then){for(t.__u|=f?160:128;l&&l.nodeType==8&&l.nextSibling;)l=l.nextSibling;i!=null&&(i[i.indexOf(l)]=null),t.__e=l}else if(i!=null)for(J=i.length;J--;)Nt(i[J])}else t.__e=r.__e;t.__k==null&&(t.__k=r.__k||[]),E.then||qr(t),S.__e(E,t,r)}}else i==null&&t.__v==r.__v?(t.__k=r.__k,t.__e=r.__e):l=t.__e=Ii(r.__e,t,r,a,n,i,s,f,c);return(p=S.diffed)&&p(t),128&t.__u?void 0:l}function qr(e){e&&(e.__c&&(e.__c.__e=!0),e.__k&&e.__k.some(qr))}function Xr(e,t,r){for(var a=0;a<r.length;a++)zt(r[a],r[++a],r[++a]);S.__c&&S.__c(t,e),e.some(function(n){try{e=n.__h,n.__h=[],e.some(function(i){i.call(n)})}catch(i){S.__e(i,n.__v)}})}function Yr(e){return typeof e!="object"||e==null||e.__b>0?e:ze(e)?e.map(Yr):e.constructor!==void 0?null:ne({},e)}function Ii(e,t,r,a,n,i,s,l,f){var c,p,_,d,h,k,v,b=r.props||lt,x=t.props,w=t.type;if(w=="svg"?n="http://www.w3.org/2000/svg":w=="math"?n="http://www.w3.org/1998/Math/MathML":n||(n="http://www.w3.org/1999/xhtml"),i!=null){for(c=0;c<i.length;c++)if((h=i[c])&&"setAttribute"in h==!!w&&(w?h.localName==w:h.nodeType==3)){e=h,i[c]=null;break}}if(e==null){if(w==null)return document.createTextNode(x);e=document.createElementNS(n,w,x.is&&x),l&&(S.__m&&S.__m(t,i),l=!1),i=null}if(w==null)b===x||l&&e.data==x||(e.data=x);else{if(i=w=="textarea"&&x.defaultValue!=null?null:i&&dt.call(e.childNodes),!l&&i!=null)for(b={},c=0;c<e.attributes.length;c++)b[(h=e.attributes[c]).name]=h.value;for(c in b)h=b[c],c=="dangerouslySetInnerHTML"?_=h:c=="children"||c in x||c=="value"&&"defaultValue"in x||c=="checked"&&"defaultChecked"in x||it(e,c,null,h,n);for(c in x)h=x[c],c=="children"?d=h:c=="dangerouslySetInnerHTML"?p=h:c=="value"?k=h:c=="checked"?v=h:l&&typeof h!="function"||b[c]===h||it(e,c,h,b[c],n);if(p)l||_&&(p.__html==_.__html||p.__html==e.innerHTML)||(e.innerHTML=p.__html),t.__k=[];else if(_&&(e.innerHTML=""),jr(t.type=="template"?e.content:e,ze(d)?d:[d],t,r,a,w=="foreignObject"?"http://www.w3.org/1999/xhtml":n,i,s,i?i[0]:r.__k&&he(r,0),l,f),i!=null)for(c=i.length;c--;)Nt(i[c]);l&&w!="textarea"||(c="value",w=="progress"&&k==null?e.removeAttribute("value"):k!=null&&(k!==e[c]||w=="progress"&&!k||w=="option"&&k!=b[c])&&it(e,c,k,b[c],n),c="checked",v!=null&&v!=e[c]&&it(e,c,v,b[c],n))}return e}function zt(e,t,r){try{if(typeof e=="function"){var a=typeof e.__u=="function";a&&e.__u(),a&&t==null||(e.__u=e(t))}else e.current=t}catch(n){S.__e(n,r)}}function Kr(e,t,r){var a,n;if(S.unmount&&S.unmount(e),(a=e.ref)&&(a.current&&a.current!=e.__e||zt(a,null,t)),(a=e.__c)!=null){if(a.componentWillUnmount)try{a.componentWillUnmount()}catch(i){S.__e(i,t)}a.base=a.__P=a.__n=null}if(a=e.__k)for(n=0;n<a.length;n++)a[n]&&Kr(a[n],t,r||typeof e.type!="function");r||Nt(e.__e),e.__c=e.__=e.__e=void 0}function Oi(e,t,r){return this.constructor(e,r)}function Wt(e,t,r){var a,n,i,s;t==document&&(t=document.documentElement),S.__&&S.__(e,t),n=(a=typeof r=="function")?null:r&&r.__k||t.__k,i=[],s=[],Ht(t,e=(!a&&r||t).__k=we($,null,[e]),n||lt,lt,t.namespaceURI,!a&&r?[r]:n?null:t.firstChild?dt.call(t.childNodes):null,i,!a&&r?r:n?n.__e:t.firstChild,a,s),Xr(i,e,s),e.props.children=null}dt=ct.slice,S={__e:function(e,t,r,a){for(var n,i,s;t=t.__;)if((n=t.__c)&&!n.__)try{if((i=n.constructor)&&i.getDerivedStateFromError!=null&&(n.setState(i.getDerivedStateFromError(e)),s=n.__d),n.componentDidCatch!=null&&(n.componentDidCatch(e,a||{}),s=n.__d),s)return n.__E=n}catch(l){e=l}throw e}},Nr=0,Ei=function(e){return e!=null&&e.constructor===void 0},K.prototype.setState=function(e,t){var r;r=this.__s!=null&&this.__s!=this.state?this.__s:this.__s=ne({},this.state),typeof e=="function"&&(e=e(ne({},r),this.props)),e&&ne(r,e),e!=null&&this.__v&&(t&&this._sb.push(t),Fr(this))},K.prototype.forceUpdate=function(e){this.__v&&(this.__e=!0,e&&this.__h.push(e),Fr(this))},K.prototype.render=$,le=[],Hr=typeof Promise=="function"?Promise.prototype.then.bind(Promise.resolve()):setTimeout,zr=function(e,t){return e.__v.__b-t.__v.__b},ut.__r=0,Dt=Math.random().toString(8),ot="__d"+Dt,He="__a"+Dt,Wr=/(PointerCapture)$|Capture$/i,Bt=0,Ft=Br(!1),$t=Br(!0),Ti=0;var Se,D,Vt,Jr,Ve=0,ia=[],F=S,Qr=F.__b,Zr=F.__r,ea=F.diffed,ta=F.__c,ra=F.unmount,aa=F.__;function pt(e,t){F.__h&&F.__h(D,e,Ve||t),Ve=0;var r=D.__H||(D.__H={__:[],__h:[]});return e>=r.__.length&&r.__.push({}),r.__[e]}function T(e){return Ve=1,oa(la,e)}function oa(e,t,r){var a=pt(Se++,2);if(a.t=e,!a.__c&&(a.__=[r?r(t):la(void 0,t),function(l){var f=a.__N?a.__N[0]:a.__[0],c=a.t(f,l);f!==c&&(a.__N=[c,a.__[1]],a.__c.setState({}))}],a.__c=D,!D.__f)){var n=function(l,f,c){if(!a.__c.__H)return!0;var p=!1,_=a.__c.props!==l;if(a.__c.__H.__.some(function(h){if(h.__N){p=!0;var k=h.__[0];h.__=h.__N,h.__N=void 0,k!==h.__[0]&&(_=!0)}}),i){var d=i.call(this,l,f,c);return p?d||_:d}return!p||_};D.__f=!0;var i=D.shouldComponentUpdate,s=D.componentWillUpdate;D.componentWillUpdate=function(l,f,c){if(this.__e){var p=i;i=void 0,n(l,f,c),i=p}s&&s.call(this,l,f,c)},D.shouldComponentUpdate=n}return a.__N||a.__}function R(e,t){var r=pt(Se++,3);!F.__s&&qt(r.__H,t)&&(r.__=e,r.u=t,D.__H.__h.push(r))}function sa(e,t){var r=pt(Se++,4);!F.__s&&qt(r.__H,t)&&(r.__=e,r.u=t,D.__h.push(r))}function A(e){return Ve=5,je(function(){return{current:e}},[])}function je(e,t){var r=pt(Se++,7);return qt(r.__H,t)&&(r.__=e(),r.__H=t,r.__h=e),r.__}function Gt(e,t){return Ve=8,je(function(){return e},t)}function Li(){for(var e;e=ia.shift();){var t=e.__H;if(e.__P&&t)try{t.__h.some(ft),t.__h.some(jt),t.__h=[]}catch(r){t.__h=[],F.__e(r,e.__v)}}}F.__b=function(e){D=null,Qr&&Qr(e)},F.__=function(e,t){e&&t.__k&&t.__k.__m&&(e.__m=t.__k.__m),aa&&aa(e,t)},F.__r=function(e){Zr&&Zr(e),Se=0;var t=(D=e.__c).__H;t&&(Vt===D?(t.__h=[],D.__h=[],t.__.some(function(r){r.__N&&(r.__=r.__N),r.u=r.__N=void 0})):(t.__h.some(ft),t.__h.some(jt),t.__h=[],Se=0)),Vt=D},F.diffed=function(e){ea&&ea(e);var t=e.__c;t&&t.__H&&(t.__H.__h.length&&(ia.push(t)!==1&&Jr===F.requestAnimationFrame||((Jr=F.requestAnimationFrame)||Ui)(Li)),t.__H.__.some(function(r){r.u&&(r.__H=r.u,r.u=void 0)})),Vt=D=null},F.__c=function(e,t){t.some(function(r){try{r.__h.some(ft),r.__h=r.__h.filter(function(a){return!a.__||jt(a)})}catch(a){t.some(function(n){n.__h&&(n.__h=[])}),t=[],F.__e(a,r.__v)}}),ta&&ta(e,t)},F.unmount=function(e){ra&&ra(e);var t,r=e.__c;r&&r.__H&&(r.__H.__.some(function(a){try{ft(a)}catch(n){t=n}}),r.__H=void 0,t&&F.__e(t,r.__v))};var na=typeof requestAnimationFrame=="function";function Ui(e){var t,r=function(){clearTimeout(a),na&&cancelAnimationFrame(t),setTimeout(e)},a=setTimeout(r,35);na&&(t=requestAnimationFrame(r))}function ft(e){var t=D,r=e.__c;typeof r=="function"&&(e.__c=void 0,r()),D=t}function jt(e){var t=D;e.__c=e.__(),D=t}function qt(e,t){return!e||e.length!==t.length||t.some(function(r,a){return r!==e[a]})}function la(e,t){return typeof t=="function"?t(e):t}var Di=0;function o(e,t,r,a,n,i){t||(t={});var s,l,f=t;if("ref"in f)for(l in f={},t)l=="ref"?s=t[l]:f[l]=t[l];var c={type:e,props:f,key:r,ref:s,__k:null,__:null,__b:0,__e:null,__c:null,constructor:void 0,__v:--Di,__i:-1,__u:0,__source:n,__self:i};if(typeof e=="function"&&(s=e.defaultProps))for(l in s)f[l]===void 0&&(f[l]=s[l]);return S.vnode&&S.vnode(c),c}var z={xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round","aria-hidden":"true"},ht=()=>o("svg",{...z,width:"16",height:"16",children:[o("path",{d:"m5 12 7-7 7 7"}),o("path",{d:"M12 19V5"})]});var ca=()=>o("svg",{...z,width:"14",height:"14",children:[o("path",{d:"M13 21h8"}),o("path",{d:"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"})]}),ce=()=>o("svg",{...z,width:"14",height:"14",children:[o("path",{d:"M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"}),o("path",{d:"M20 2v4"}),o("path",{d:"M22 4h-4"}),o("circle",{cx:"4",cy:"20",r:"2"})]}),ua=()=>o("svg",{...z,width:"12",height:"12",children:o("rect",{width:"18",height:"18",x:"3",y:"3",rx:"2"})}),da=()=>o("svg",{...z,width:"14",height:"14",children:o("path",{d:"M20 6 9 17l-5-5"})}),fa=()=>o("svg",{...z,width:"14",height:"14",children:[o("rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2"}),o("path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"})]}),pa=()=>o("svg",{...z,width:"14",height:"14",children:[o("path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"}),o("path",{d:"M3 3v5h5"})]}),Ae=()=>o("svg",{...z,width:"16",height:"16",children:[o("path",{d:"M18 6 6 18"}),o("path",{d:"m6 6 12 12"})]}),Ge=()=>o("svg",{...z,width:"16",height:"16",children:[o("path",{d:"M13.234 20.252 21 12.3"}),o("path",{d:"m16 6-8.414 8.586a2 2 0 0 0 0 2.828 2 2 0 0 0 2.828 0l8.414-8.586a4 4 0 0 0 0-5.656 4 4 0 0 0-5.656 0l-8.415 8.585a6 6 0 1 0 8.486 8.486"})]}),mt=()=>o("svg",{...z,width:"16",height:"16",children:[o("path",{d:"M5 12h14"}),o("path",{d:"M12 5v14"})]}),ha=()=>o("svg",{...z,width:"16",height:"16",children:o("path",{d:"m6 9 6 6 6-6"})}),ma=()=>o("svg",{...z,width:"14",height:"14",children:o("path",{d:"m9 18 6-6-6-6"})}),Ee=()=>o("svg",{...z,width:"14",height:"14",children:[o("path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"}),o("path",{d:"M14 2v4a2 2 0 0 0 2 2h4"}),o("path",{d:"M16 13H8"}),o("path",{d:"M16 17H8"})]}),_a=()=>o("svg",{...z,width:"14",height:"14",children:[o("path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"}),o("path",{d:"m17 8-5-5-5 5"}),o("path",{d:"M12 3v12"})]}),ga=()=>o("svg",{...z,width:"14",height:"14",children:[o("circle",{cx:"11",cy:"11",r:"8"}),o("path",{d:"m21 21-4.3-4.3"})]}),va=()=>o("svg",{...z,width:"14",height:"14",children:[o("path",{d:"M3 6h18"}),o("path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"}),o("path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"})]}),ba=()=>o("svg",{...z,width:"14",height:"14",children:o("path",{d:"m15 18-6-6 6-6"})});var ie=(()=>{if(typeof document>"u")return"/agent/vendor/";let e=document.currentScript?.src;try{return new URL("vendor/",e??"/agent/").href}catch{return"/agent/vendor/"}})(),ya=new Map;function _t(e){let t=ya.get(e);if(t)return t;let r=new Promise((a,n)=>{let i=document.createElement("script");i.src=e,i.onload=()=>a(),i.onerror=()=>n(new Error(`could not load ${e}`)),document.head.append(i)});return ya.set(e,r),r}var Fi=/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)\s]+\))/g;function qe(e,t){return e.startsWith("/")?`${t.replace(/\/$/,"")}${e}`:e.startsWith("https://")||e.startsWith("http://")?e:null}function $i(e,t,r){let a=e.replace(/^(?:GET|POST|PUT|PATCH|DELETE)\s+/,""),n=t?.find(i=>i.literal===a);return n?qe(n.url,r):null}function gt(e,t,r){return e.split(Fi).map((n,i)=>{if(n.startsWith("`")&&n.endsWith("`")&&n.length>2){let l=n.slice(1,-1),f=$i(l,r,t);return f?o("a",{class:"ask-ai__code-link",href:f,target:"_blank",rel:"noopener",children:o("code",{children:l})},i):o("code",{children:l},i)}if(n.startsWith("**")&&n.endsWith("**")&&n.length>4)return o("b",{children:gt(n.slice(2,-2),t,r)},i);if(n.startsWith("*")&&n.endsWith("*")&&n.length>2)return o("em",{children:gt(n.slice(1,-1),t,r)},i);let s=/^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(n);if(s){let[,l,f]=s,c=qe(f,t);return c?o("a",{href:c,target:"_blank",rel:"noopener noreferrer",children:l},i):n}return n})}function Xe({text:e,label:t,className:r}){let[a,n]=T(!1);return R(()=>{if(!a)return;let i=window.setTimeout(()=>n(!1),1600);return()=>window.clearTimeout(i)},[a]),typeof navigator>"u"||!navigator.clipboard?null:o("button",{type:"button",class:r,"aria-label":a?"Copied":t,onClick:()=>{navigator.clipboard.writeText(e).then(()=>n(!0),()=>{})},children:a?o(da,{}):o(fa,{})})}var ka=null;function Bi(){return ka??=_t(`${ie}mermaid.min.js`).then(()=>{let e=globalThis.mermaid;if(!e)throw new Error("mermaid loaded but registered nothing");return e.initialize({startOnLoad:!1,securityLevel:"strict",theme:Ni()?"dark":"default",fontFamily:"inherit"}),e}),ka}function Ni(){let e=document.documentElement.dataset.theme;return e==="dark"?!0:e==="light"?!1:globalThis.matchMedia?.("(prefers-color-scheme: dark)").matches??!1}var xa=0;function Hi({text:e}){let[t,r]=T(""),[a,n]=T(!1);return R(()=>{let i=!0;n(!1),r(""),xa+=1;let s=`ask-ai-diagram-${xa}`;return Bi().then(l=>l.render(s,e)).then(l=>{i&&r(l.svg)}).catch(()=>{i&&n(!0),document.getElementById(s)?.remove(),document.getElementById(`d${s}`)?.remove()}),()=>{i=!1}},[e]),a?o("div",{class:"ask-ai__code",children:[o("pre",{children:o("code",{children:e})}),o(Xe,{text:e,label:"Copy diagram source",className:"ask-ai__code-copy"})]}):o("div",{class:"ask-ai__diagram",dangerouslySetInnerHTML:{__html:t}})}var zi=/^\s*[-*]\s+(.*)$/,Wi=/^\s*\d+[.)]\s+(.*)$/;function Vi(e){let t=[],r=null,a=[],n=null,i="",s=()=>{a.length>0&&(t.push({kind:"p",text:a.join(" ")}),a=[])},l=()=>{r&&(t.push(r),r=null)};for(let f of e.split(`
`)){if(f.trimStart().startsWith("```")){n?(t.push({kind:"code",text:n.join(`
`),lang:i,closed:!0}),n=null,i=""):(s(),l(),i=f.trim().slice(3).trim().toLowerCase(),n=[]);continue}if(n){n.push(f);continue}let c=zi.exec(f),p=c?null:Wi.exec(f);if(c||p){s();let _=c?"ul":"ol";(!r||r.kind!==_)&&(l(),r={kind:_,items:[]}),r.items.push((c??p)[1]);continue}if(f.trim()===""){s(),l();continue}if(r&&/^\s{2,}/.test(f)){r.items[r.items.length-1]+=` ${f.trim()}`;continue}l(),a.push(f.replace(/^#{1,4}\s+/,"").trim())}return n&&t.push({kind:"code",text:n.join(`
`),lang:i,closed:!1}),s(),l(),t}function Xt({text:e,docsOrigin:t,links:r}){return o($,{children:Vi(e).map((a,n)=>{if(a.kind==="p")return o("p",{children:gt(a.text,t,r)},n);if(a.kind==="code")return a.lang==="mermaid"&&a.closed?o(Hi,{text:a.text},n):o("div",{class:"ask-ai__code",children:[o("pre",{children:o("code",{children:a.text})}),o(Xe,{text:a.text,label:"Copy code",className:"ask-ai__code-copy"})]},n);let i=a.kind;return o(i,{children:a.items.map((s,l)=>o("li",{children:gt(s,t,r)},l))},n)})})}function wa(e){let t=[],r=!1;for(let a of e.split(`
`))/^\s*```/.test(a)?r=!r:!r&&/^##\s+/.test(a)&&t.push(a.slice(2).replace(/[*`_]/g,"").trim());return t.filter(Boolean)}var vt="The assistant is unreachable right now. Try again shortly.";function Sa(e,t){if(e!==429)return vt;let r=t??{};if(r.limit==="day")return"This connection has used today's questions. The limit resets at midnight UTC.";if(r.limit==="minute"){let a=Math.ceil(r.retry_after_seconds??0);return`Too many questions in the last minute. Wait ${a>5?`about ${a} seconds`:"a moment"} and ask again.`}return"Too many questions in a short time. Wait a minute and ask again."}async function Aa(e,t){let r=e.getReader(),a=new TextDecoder,n="",i=s=>{let l="message",f=[];for(let p of s.split(`
`))p.startsWith("event:")?l=p.slice(6).trim():p.startsWith("data:")&&f.push(p.slice(5).trim());if(f.length===0)return;let c;try{c=JSON.parse(f.join(`
`))}catch{return}switch(l){case"text":t.onText(c.delta??"");break;case"tool":{let p=c;t.onTool(Gi(p.name));break}case"sources":t.onSources(c);break;case"links":t.onLinks?.(c);break;case"suggestions":t.onSuggestions?.(c);break;case"skill":t.onSkill?.(c);break;case"error":t.onError(c.message||vt);break;default:break}};for(;;){let{done:s,value:l}=await r.read();if(s)break;n+=a.decode(l,{stream:!0});let f;for(;(f=n.indexOf(`

`))!==-1;){let c=n.slice(0,f);n=n.slice(f+2),i(c)}}}var ji={search_docs:"Searching the docs",search:"Searching the docs",get_atom:"Reading the docs",related_atoms:"Reading the docs",list_atoms:"Reading the docs",get_operation:"Reading the API reference",list_operations:"Reading the API reference",decode_error:"Looking up the error",validate_request:"Checking the request",validate_fhir:"Checking the FHIR bundle",get_fhir_example:"Reading the FHIR profiles",get_fhir_profile:"Reading the FHIR profiles",list_fhir_profiles:"Reading the FHIR profiles",catalogue_info:"Checking the catalogue"};function Gi(e){return ji[e]??"Looking this up"}var bt="abdm-docs",Yt=[{id:"skills",label:"Skills"},{id:"mcp",label:"MCP server"},{id:"plugin",label:"Plugin"}],Kt=[{id:"claude",label:"Claude"},{id:"codex",label:"Codex"},{id:"cursor",label:"Cursor"},{id:"other",label:"Other"}],qi=["Three ways to give your agent this catalogue. Take any of them, or all three.","","- **Skills**: the milestones written as files an agent reads before it writes code. One set up line, any agent.","- **MCP server**: your agent queries these pages as it works, so it retrieves the paragraph it needs instead of loading the site.","- **Plugin**: every skill at once, as one package. Claude Code and Codex install it straight from the repository; the other Agent Plugins clients list it through their own marketplaces.","","Which one do you want?"].join(`
`);function Ea(e){return!0}function Xi(e){return Yt.find(t=>t.id===e).label}function Jt(e,t){return e==="other"?t?.trim()||"your agent":Kt.find(r=>r.id===e).label}function Yi(e){return`Fetch and execute the instructions to set me up for ABDM integration from ${e}/agent-setup/prompt.md`}function Ta(e){return[e,"","If this session did not open in the repository I am integrating ABDM into, ask me for the path before you write anything."].join(`
`)}function Ki(e){return e.replace(/\/+$/,"")}function ue(e){return["```",e,"```"].join(`
`)}var Ra="abdm-integrators-assistant",Ma=e=>`claude plugin marketplace add ${e} && claude plugin install ${Ra}@abdm-portal`,Ji=e=>`codex plugin marketplace add ${e}`;function Ca(e,t){return`claude://code/new?q=${encodeURIComponent(Ta(["Set this project up for ABDM integration. Run:","",`claude plugin marketplace add ${t}`,"claude plugin install abdm-integrators-assistant@abdm-portal","",`If the marketplace add fails (the repository may not be accessible), instead fetch and execute the instructions from ${e}/agent-setup/prompt.md`].join(`
`)))}`}function Qi(e,t,r,a){let n=Yi(r);return e==="claude"?{text:["Claude Code takes the plugin, which carries every skill at once and updates in place. Run this in the repository you are integrating.","",ue(Ma(a))].join(`
`),link:{href:Ca(r,a),label:"Open in Claude"}}:e==="cursor"?{text:["Paste this into Cursor, or let the link put it in the composer. It fetches the current instructions from this site, so what it installs cannot go stale.","",ue(n)].join(`
`),link:{href:`cursor://anysphere.cursor-deeplink/prompt?text=${encodeURIComponent(Ta(n))}`,label:"Open in Cursor"}}:e==="codex"?{text:["Codex has no URL scheme, so this is a paste. Give it to a Codex session in the repository you are integrating, and it fetches the current instructions from this site.","",ue(n)].join(`
`)}:{text:[`Any agent that can fetch a URL takes this line, ${Jt(e,t)} included. The instructions live on this site and are rebuilt with it, so the pasted line cannot go stale.`,"",ue(n)].join(`
`)}}function Zi(e,t,r,a){return e==="claude"?{text:["Run this in the repository you are integrating. It carries every skill at once, and `claude plugin update` keeps it current.","",ue(Ma(a))].join(`
`),link:{href:Ca(r,a),label:"Open in Claude"}}:e==="codex"?{text:[`Add the marketplace, then install \`${Ra}\` from it in Codex's plugin directory.`,"",ue(Ji(a))].join(`
`)}:{text:[`The plugin is packaged to the Agent Plugins 1.0 standard, which ${Jt(e,t)} reads, but that route installs from the client's own marketplace and this plugin is not listed in one yet.`,"","The skills are the same content and they install today. Ask for Skills instead."].join(`
`)}}function eo(e,t,r,a){return a?e==="claude"?{text:["User scope, so it is there in every project rather than only this directory.","",ue(`claude mcp add --transport http ${bt} ${a} -s user`)].join(`
`),link:{href:`claude://code/new?q=${encodeURIComponent(["Add the ABDM documentation MCP server, then use it to answer my ABDM questions.","","Run this:",`claude mcp add --transport http ${bt} ${a} -s user`,"","User scope, so it is available in every project rather than only this directory."].join(`
`))}`,label:"Open in Claude"}}:e==="cursor"?{text:"The link opens Cursor on a confirmation dialog, and there is no command to run.",link:{href:`cursor://anysphere.cursor-deeplink/mcp/install?name=${bt}&config=${encodeURIComponent(btoa(JSON.stringify({url:a})))}`,label:"Add to Cursor"}}:{text:[`Any client that reads an \`mcpServers\` config takes this block as it stands, ${Jt(e,t)} included.`,"",ue(JSON.stringify({mcpServers:{[bt]:{url:a}}},null,2))].join(`
`)}:{text:`The server is live, but this build of the site does not carry its address, so there is no command to give you. The address is set at deploy. [Build with AI](${r}/docs/hiecm/v3/getting-started/build-with-ai) has the current one.`}}function Qt(e,t){let r=Ki(t.docsOrigin);return e.tool==="plugin"?Zi(e.agent,e.named,r,t.pluginRepo):e.tool==="mcp"?eo(e.agent,e.named,r,t.mcpUrl):Qi(e.agent,e.named,r,t.pluginRepo)}function Pa(e,t){return e.at==="tools"?qi:e.at==="agents"?`${Xi(e.tool)} it is. Which agent are you working in?`:Qt(e,t).text}var to=/\b(integrat\w*|implement\w*|build|building|develop\w*|debug\w*|troubleshoot\w*|fix|fixing|broken|failing|failed|fails|error|errors|stuck|retry|retries|sandbox|certif\w*|onboard\w*|set ?up|install\w*|scaffold\w*|test\w*|why (is|does|isn.?t|doesn.?t|am|are)|how (do|can|would|should) (i|we)|not working|does ?n.?t work)\b/i;function Ia(e){return to.test(e)}function Oa(e,t,r,a){return e<=0||!r&&t<550&&e<220?0:a?e:Math.min(e,Math.max(2,Math.ceil(e/6)))}var yt="abdm-ask-ai-history";function La(e){let r=(e.find(a=>a.from==="you")?.text.trim()??"").replace(/\s+/g," ");return r.length>72?`${r.slice(0,71)}\u2026`:r}function Ua(e,t){return[t,...e.filter(r=>r.id!==t.id)].slice(0,50)}function Da(e=Date.now()){try{let t=JSON.parse(localStorage.getItem(yt)??"[]");return Array.isArray(t)?t.filter(r=>r?.id&&r?.turns&&e-(r.at??0)<2592e6):[]}catch{return[]}}function Zt(e){try{localStorage.setItem(yt,JSON.stringify(e))}catch{try{localStorage.setItem(yt,JSON.stringify(e.slice(0,-1)))}catch{}}}function Fa(e,t){return e.filter(r=>r.id!==t)}function $a(){try{localStorage.removeItem(yt)}catch{}}var er="abdm-ask-ai-current";function Ba(){try{return sessionStorage.getItem(er)}catch{return null}}function Na(e){try{sessionStorage.setItem(er,e)}catch{}}function Ha(){try{sessionStorage.removeItem(er)}catch{}}function za(e,t){return t&&e.find(r=>r.id===t)||null}function Wa(e,t=Date.now()){let r=Math.floor((t-e)/6e4);if(r<1)return"just now";let a=(s,l)=>`${s} ${l}${s===1?"":"s"} ago`;if(r<60)return a(r,"minute");let n=Math.floor(r/60);if(n<24)return a(n,"hour");let i=Math.floor(n/24);return i<7?a(i,"day"):new Date(e).toLocaleDateString()}var Va=["I answer questions about integrating with ABDM, from this portal's documentation and API references. Every answer lists the pages it used, so you can check the source.","","**What you can ask**","","- How to do something: create an ABHA, link records, request consent.","- What an error code means, and how to fix it.","- What a field, header or term means.","","**What you can give me**","","- **A page.** Press **+** and attach any page on this portal, or open me from **Ask about this page**.","- **A file.** A request, a response, a log, a PDF or a screenshot. It is read in your browser, and only its text is sent.","- **A command.** **Scaffold**, **Design**, **Integrate** and **Debug** under the chat bar draw on that part of a module's agent skill.","","**What I will not do**","","- Write code for your project. I show curl requests. For code, install the agent skills or the MCP server in your own coding agent.","- Answer from general knowledge. A path, a header or an error code comes from this portal or not at all.","- Stand in for support, for accounts, credentials or production approval.","","Your conversations stay in this browser. **History** lists them, and **New** starts again."].join(`
`),ro=/^(?:what (?:can|do|does) (?:you|this (?:assistant|bot|chat)|the (?:ask ai )?(?:assistant|bot)|ask ai) do|what (?:is|are) (?:you|ask ai|this (?:assistant|bot))|who are you|how (?:do|can) i use (?:you|this|ask ai|the assistant)|help)\s*\??$/i;function ja(e){return ro.test(e.trim().replace(/\s+/g," "))}var xt=[{id:"scaffold",label:"Scaffold",hint:"Set up a project for a module"},{id:"design",label:"Design",hint:"The design rules for a module"},{id:"integrate",label:"Integrate",hint:"Build a module step by step"},{id:"debug",label:"Debug",hint:"Work out why a call fails"}];function Ga(e){let t=/^\/([a-z]*)$/i.exec(e);if(!t)return[];let r=t[1].toLowerCase();return xt.filter(a=>a.id.startsWith(r))}var wt=e=>xt.find(t=>t.id===e)?.label??e;function kt(e){let t=e.replace(/^abdm-/,"");if(/^[mp]\d$/.test(t))return t.toUpperCase();let r=t.replace(/-/g," ");return r.charAt(0).toUpperCase()+r.slice(1)}function St(e){switch(e.status){case"used":return`Using ${kt(e.module??"")} \xB7 ${wt(e.section)}`;case"missing":return`No ${e.section} guide for ${kt(e.module??"")} yet. Answering from the docs.`;default:return"Which module is this about?"}}var ao=/^- \[([^\]]+)\]\(([^)\s]+)\)(?::\s*(.*))?$/;function no(e){let t=[],r=new Set;for(let a of e.split(`
`)){let n=ao.exec(a.trim());if(!n)continue;let i;try{i=new URL(n[2],"https://placeholder.invalid").pathname.replace(/\/$/,"")}catch{continue}!i.startsWith("/docs/")||r.has(i)||(r.add(i),t.push({title:n[1],path:i,description:(n[3]??"").trim()}))}return t}var io=e=>e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");function qa(e,t,r=8){let a=t.toLowerCase().split(/\s+/).filter(Boolean);if(!a.length)return[];let n=[];for(let i of e){let s=i.title.toLowerCase(),l=`${i.path} ${i.description}`.toLowerCase(),f=0,c=!0;for(let p of a)if(new RegExp(`\\b${io(p)}`).test(s))f+=3;else if(s.includes(p))f+=2;else if(l.includes(p))f+=1;else{c=!1;break}c&&n.push({entry:i,score:f})}return n.sort((i,s)=>s.score-i.score||i.entry.title.length-s.entry.title.length).slice(0,r).map(i=>i.entry)}var tr=e=>e.replace(/\/$/,""),Xa=(e,t)=>`${tr(e)}${t}`,Ya=(e,t)=>`${tr(e)}${t}.md`;function Ka(e){return/^\s*(?:<!doctype html|<html[\s>])/i.test(e)}var At=null;function Ja(e){return At||(At=fetch(`${tr(e)}/llms.txt`).then(t=>t.ok?t.text():Promise.reject(new Error(`status ${t.status}`))).then(no).catch(t=>{throw At=null,t})),At}var rr={active:-1,dismissed:!1},Et=e=>e.filter(t=>t.kind!=="step");function Qa(e,t,r,a){return!a&&e===""&&t.length>0&&!r.dismissed}function ar(e,t){let r=Et(e);return t.active>=0?r[Math.min(t.active,r.length-1)]??null:e.find(a=>a.kind==="step")??null}function Za(e,t,r,a){if(r.length===0)return{kind:"none"};let n=Et(r).length;if(e==="Tab"&&!t){let i=ar(r,a);return i?{kind:"fill",text:i.prompt}:{kind:"none"}}return e==="ArrowDown"&&n>0?{kind:"move",tray:{...a,active:Math.min(a.active+1,n-1)}}:e==="ArrowUp"&&n>0?{kind:"move",tray:{...a,active:Math.max(a.active-1,-1)}}:e==="Escape"?{kind:"dismiss",tray:{...a,dismissed:!0}}:{kind:"none"}}function oo({earlier:e,window:t,percent:r,full:a}){let i=2*Math.PI*7,s=`${Math.min(e,t)} of ${t} conversation exchanges completed.`;return o("span",{class:`ask-ai__ring${a?" ask-ai__ring--full":""}`,children:[o("span",{class:"ask-ai__ring-mark",tabIndex:0,role:"progressbar","aria-label":"Context window","aria-valuemin":0,"aria-valuemax":100,"aria-valuenow":r,"aria-describedby":"ask-ai-ring-tip",children:o("svg",{viewBox:"0 0 18 18",width:"18",height:"18","aria-hidden":"true",children:[o("circle",{class:"ask-ai__ring-track",cx:"9",cy:"9",r:7}),o("circle",{class:"ask-ai__ring-fill",cx:"9",cy:"9",r:7,"stroke-dasharray":i,"stroke-dashoffset":i*(1-r/100)})]})}),o("span",{class:"ask-ai__ring-tip",id:"ask-ai-ring-tip",role:"tooltip",children:o("span",{children:s})})]})}function en(e){let{draft:t,busy:r,menu:a,onMenu:n,page:i,file:s,fileNote:l,fileError:f,attaching:c}=e,p=A(null),_=A(null),d=i!==null&&i.markdown!=="",[h,k]=T(rr),[v,b]=T(!1),x=e.suggestions.map(g=>g.id).join(" ");R(()=>k(rr),[x]);let w=Qa(t,e.suggestions,h,r)&&a==="closed",L=w?Et(e.suggestions):[],P=w?ar(e.suggestions,h):null;R(()=>{if(a==="closed")return;let g=E=>{_.current&&!E.composedPath().includes(_.current)&&n("closed")};return document.addEventListener("pointerdown",g,!0),()=>document.removeEventListener("pointerdown",g,!0)},[a]);let O=Ga(t),[C,N]=T(0);R(()=>N(0),[t]);let I=g=>{e.onCommand(g),e.onDraft("")},J=!!(i||c||s||l||f||e.command);return o("div",{class:"ask-ai__foot",children:[o("form",{class:"ask-ai__composer",onSubmit:g=>{g.preventDefault(),e.onSend()},children:[J&&o("div",{class:"ask-ai__context",children:[c&&o("span",{class:"ask-ai__chip ask-ai__chip--pending",children:[o(Ee,{}),o("span",{class:"ask-ai__chip-text",children:["Attaching ",c]})]}),i&&!c&&o("span",{class:`ask-ai__chip${d?"":" ask-ai__chip--failed"}`,children:[o(Ee,{}),o("span",{class:"ask-ai__chip-text",children:d?i.title:`Could not attach ${i.title}`}),o("button",{type:"button",class:"ask-ai__chip-remove","aria-label":d?`Remove ${i.title}`:"Dismiss",onClick:e.onRemovePage,children:o(Ae,{})})]}),l?o("span",{class:"ask-ai__chip ask-ai__chip--pending",children:[o(Ge,{}),o("span",{class:"ask-ai__chip-text",children:l})]}):s&&o("span",{class:"ask-ai__chip",children:[o(Ge,{}),o("span",{class:"ask-ai__chip-text",children:s.name}),o("span",{class:"ask-ai__chip-meta",children:[s.text.length.toLocaleString()," characters"]}),o("button",{type:"button",class:"ask-ai__chip-remove","aria-label":`Remove ${s.name}`,onClick:e.onRemoveFile,children:o(Ae,{})})]}),e.command&&o("span",{class:"ask-ai__chip",children:[o(ce,{}),o("span",{class:"ask-ai__chip-text",children:["Skill: ",wt(e.command)]}),o("button",{type:"button",class:"ask-ai__chip-remove","aria-label":`Remove the ${wt(e.command)} skill`,onClick:()=>e.onCommand(null),children:o(Ae,{})})]}),f&&o("span",{class:"ask-ai__context-error",children:f})]}),s?.kind&&!l&&o("p",{class:"ask-ai__context-note",children:"Read here in your browser; the file itself is not sent. Names in it are yours to check before you send."}),v&&L.length>0&&o("ul",{class:"ask-ai__next",role:"listbox","aria-label":"You could also ask",children:[o("li",{class:"ask-ai__next-label",role:"presentation",children:"You could also ask"}),L.map((g,E)=>o("li",{role:"option","aria-selected":E===h.active,children:o("button",{type:"button",tabIndex:-1,class:`ask-ai__next-item${E===h.active?" ask-ai__next-item--active":""}`,onMouseDown:q=>q.preventDefault(),onMouseEnter:()=>k({...h,active:E}),onClick:()=>e.onDraft(g.prompt),children:g.prompt})},g.id))]}),O.length>0&&o("ul",{class:"ask-ai__next",role:"listbox","aria-label":"Skills",children:O.map((g,E)=>o("li",{role:"option","aria-selected":E===C,children:o("button",{type:"button",tabIndex:-1,class:`ask-ai__next-item${E===C?" ask-ai__next-item--active":""}`,onMouseDown:q=>q.preventDefault(),onMouseEnter:()=>N(E),onClick:()=>I(g.id),children:[o("span",{class:"ask-ai__slash",children:["/",g.id]})," ",g.hint]})},g.id))}),o("div",{class:"ask-ai__bar",children:[o("div",{class:"ask-ai__add-wrap",ref:_,children:[o("button",{type:"button",class:"ask-ai__add","aria-label":"Add a file, a page or a skill","aria-haspopup":"menu","aria-expanded":a!=="closed",disabled:r,onClick:()=>n(a==="closed"?"add":"closed"),children:o(mt,{})}),a==="add"&&o("div",{class:"ask-ai__menu",role:"menu",children:[o("button",{type:"button",role:"menuitem",class:"ask-ai__menu-item",autoFocus:!0,onClick:()=>{n("closed"),p.current?.click()},children:[o(_a,{}),"Upload from computer"]}),o("button",{type:"button",role:"menuitem",class:"ask-ai__menu-item",onClick:()=>n("pages"),children:[o(Ee,{}),"Attach a page"]}),o("button",{type:"button",role:"menuitem",class:"ask-ai__menu-item",onClick:()=>n("skills"),children:[o(ce,{}),"Assign a skill"]})]}),a==="skills"&&o("div",{class:"ask-ai__menu",role:"menu","aria-label":"Assign a skill",children:xt.map((g,E)=>o("button",{type:"button",role:"menuitemradio","aria-checked":e.command===g.id,class:"ask-ai__menu-item ask-ai__menu-item--skill",autoFocus:E===0,onClick:()=>{n("closed"),e.onCommand(e.command===g.id?null:g.id)},children:[o("span",{children:g.label}),o("span",{class:"ask-ai__menu-hint",children:g.hint})]},g.id))}),a==="pages"&&o(so,{docsOrigin:e.docsOrigin,onPick:g=>{n("closed"),e.onPage(g)},onBack:()=>n("add")})]}),o("input",{ref:p,type:"file",class:"ask-ai__picker",accept:e.accept,onChange:g=>{let E=g.currentTarget;e.onFile(E.files?.[0]),E.value=""}}),o("div",{class:"ask-ai__field",children:[o("textarea",{ref:e.field,class:"ask-ai__input",value:t,rows:1,onInput:g=>e.onDraft(g.currentTarget.value),onFocus:()=>b(!0),onBlur:()=>b(!1),onKeyDown:g=>{if(w){let E=Za(g.key,g.shiftKey,e.suggestions,h);if(E.kind!=="none"){g.preventDefault(),E.kind==="fill"?e.onDraft(E.text):k(E.tray);return}}if(O.length>0){let E=O.length;if(g.key==="ArrowDown"||g.key==="ArrowUp"){g.preventDefault(),N((C+(g.key==="ArrowDown"?1:E-1))%E);return}if((g.key==="Enter"||g.key==="Tab")&&!g.shiftKey){g.preventDefault(),I(O[Math.min(C,E-1)].id);return}}g.key==="Enter"&&!g.shiftKey&&(g.preventDefault(),e.onSend())},placeholder:P?"":"Ask about ABDM","aria-label":"Ask the assistant","aria-describedby":P?"ask-ai-next-hint":void 0}),P&&o($,{children:[o("span",{class:"ask-ai__ghost","aria-hidden":"true",children:P.prompt}),o("span",{class:"ask-ai__sr",id:"ask-ai-next-hint",children:`Suggested: ${P.prompt}. Press Tab to use it, the arrow keys for related questions, Escape to dismiss.`})]})]}),P&&o("button",{type:"button",class:"ask-ai__tabkey","aria-label":`Use the suggestion: ${P.prompt}`,onMouseDown:g=>g.preventDefault(),onClick:()=>e.onDraft(P.prompt),children:"Tab"}),e.memory.earlier>0&&o(oo,{...e.memory}),r?o("button",{class:"ask-ai__send ask-ai__send--stop",type:"button","aria-label":"Stop",onClick:e.onStop,children:o(ua,{})}):o("button",{class:"ask-ai__send",type:"submit","aria-label":"Send",disabled:t.trim()==="",children:o(ht,{})})]})]}),o("p",{class:"ask-ai__disclaimer",children:"This bot is AI, it can make mistakes."})]})}function so({docsOrigin:e,onPick:t,onBack:r}){let[a,n]=T(""),[i,s]=T(null),[l,f]=T(!1),[c,p]=T(0);R(()=>{let h=!0;return Ja(e).then(k=>h&&s(k),()=>h&&f(!0)),()=>{h=!1}},[e]);let _=i?qa(i,a):[],d=l?"The page list could not be loaded.":i?a.trim()?_.length?null:"No page matches that.":"Type to search every page.":"Loading pages";return o("div",{class:"ask-ai__menu ask-ai__menu--pages",role:"dialog","aria-label":"Attach a page",children:[o("div",{class:"ask-ai__search",children:[o("button",{type:"button",class:"ask-ai__search-back","aria-label":"Back",onClick:r,children:o(ba,{})}),o(ga,{}),o("input",{class:"ask-ai__search-field",value:a,autoFocus:!0,placeholder:"Search pages","aria-label":"Search pages",role:"combobox","aria-expanded":_.length>0,"aria-controls":"ask-ai-page-hits",onInput:h=>{n(h.currentTarget.value),p(0)},onKeyDown:h=>{h.key==="Enter"?(h.preventDefault(),_[c]&&t(_[c])):h.key==="ArrowDown"?(h.preventDefault(),p(k=>Math.min(k+1,_.length-1))):h.key==="ArrowUp"&&(h.preventDefault(),p(k=>Math.max(k-1,0)))}})]}),_.length>0&&o("ul",{class:"ask-ai__hits",id:"ask-ai-page-hits",role:"listbox",children:_.map((h,k)=>o("li",{role:"option","aria-selected":k===c,children:o("button",{type:"button",class:`ask-ai__hit${k===c?" ask-ai__hit--active":""}`,onMouseEnter:()=>p(k),onClick:()=>t(h),children:[o("span",{class:"ask-ai__hit-title",children:h.title}),o("span",{class:"ask-ai__hit-path",children:h.path.replace(/^\/docs\//,"")})]})},h.path))}),d&&o("p",{class:"ask-ai__search-status",children:d})]})}function tn({sessions:e,currentId:t,onOpen:r,onForget:a,onClearAll:n}){return e.length?o("div",{class:"ask-ai__history",children:[o("p",{class:"ask-ai__history-label",children:"Recents"}),o("ul",{class:"ask-ai__history-list",children:e.map(i=>{let s=i.id===t,l=i.title||"Untitled conversation";return o("li",{class:`ask-ai__history-row${s?" ask-ai__history-row--current":""}`,children:[o("button",{type:"button",class:"ask-ai__history-open","aria-current":s?"true":void 0,title:l,onClick:()=>r(i),children:l}),o("button",{type:"button",class:"ask-ai__history-forget","aria-label":`Delete ${l}`,title:"Delete",onClick:()=>a(i.id),children:o(va,{})})]},i.id)})}),o("div",{class:"ask-ai__history-foot",children:[o("span",{children:"Kept in this browser only."}),o("button",{type:"button",class:"ask-ai__history-clear",onClick:n,children:"Clear all"})]})]}):o("div",{class:"ask-ai__history ask-ai__history--empty",children:[o("p",{class:"ask-ai__history-none",children:"No conversations yet."}),o("p",{class:"ask-ai__history-note",children:"What you ask here is kept in this browser only."})]})}function dn(e,t){for(var r in t)e[r]=t[r];return e}function or(e,t){for(var r in e)if(r!=="__source"&&!(r in t))return!0;for(var a in t)if(a!=="__source"&&e[a]!==t[a])return!0;return!1}function fn(e,t){var r=t(),a=T({t:{__:r,u:t}}),n=a[0].t,i=a[1];return sa(function(){n.__=r,n.u=t,nr(n)&&i({t:n})},[e,r,t]),R(function(){return nr(n)&&i({t:n}),e(function(){nr(n)&&i({t:n})})},[e]),r}function nr(e){try{return!((t=e.__)===(r=e.u())&&(t!==0||1/t==1/r)||t!=t&&r!=r)}catch{return!0}var t,r}function rn(e,t){this.props=e,this.context=t}function pn(e,t){function r(n){var i=this.props.ref;return i!=n.ref&&i&&(typeof i=="function"?i(null):i.current=null),t?!t(this.props,n)||i!=n.ref:or(this.props,n)}function a(n){return this.shouldComponentUpdate=r,we(e,n)}return a.displayName="Memo("+(e.displayName||e.name)+")",a.__f=a.prototype.isReactComponent=!0,a.type=e,a}(rn.prototype=new K).isPureReactComponent=!0,rn.prototype.shouldComponentUpdate=function(e,t){return or(this.props,e)||or(this.state,t)};var an=S.__b;S.__b=function(e){e.type&&e.type.__f&&e.ref&&(e.props.ref=e.ref,e.ref=null),an&&an(e)};var uo=typeof Symbol<"u"&&Symbol.for&&Symbol.for("react.forward_ref")||3911;function hn(e){function t(r){var a=dn({},r);return delete a.ref,e(a,r.ref||null)}return t.$$typeof=uo,t.render=e,t.prototype.isReactComponent=t.__f=!0,t.displayName="ForwardRef("+(e.displayName||e.name)+")",t}var fo=S.__e;S.__e=function(e,t,r,a){if(e.then){for(var n,i=t;i=i.__;)if((n=i.__c)&&n.__c)return t.__e==null&&(t.__e=r.__e,t.__k=r.__k||[]),n.__c(e,t)}fo(e,t,r,a)};var nn=S.unmount;function mn(e,t,r){return e&&(e.__c&&e.__c.__H&&(e.__c.__H.__.forEach(function(a){typeof a.__c=="function"&&a.__c()}),e.__c.__H=null),(e=dn({},e)).__c!=null&&(e.__c.__P===r&&(e.__c.__P=t),e.__c.__e=!0,e.__c=null),e.__k=e.__k&&e.__k.map(function(a){return mn(a,t,r)})),e}function _n(e,t,r){return e&&r&&(e.__v=null,e.__k=e.__k&&e.__k.map(function(a){return _n(a,t,r)}),e.__c&&e.__c.__P===t&&(e.__e&&r.appendChild(e.__e),e.__c.__e=!0,e.__c.__P=r)),e}function ir(){this.__u=0,this.o=null,this.__b=null}function gn(e){var t=e.__&&e.__.__c;return t&&t.__a&&t.__a(e)}function Tt(){this.i=null,this.l=null}S.unmount=function(e){var t=e.__c;t&&(t.__z=!0),t&&t.__R&&t.__R(),t&&32&e.__u&&(e.type=null),nn&&nn(e)},(ir.prototype=new K).__c=function(e,t){var r=t.__c,a=this;a.o==null&&(a.o=[]),a.o.push(r);var n=gn(a.__v),i=!1,s=function(){i||a.__z||(i=!0,r.__R=null,n?n(f):f())};r.__R=s;var l=r.__P;r.__P=null;var f=function(){if(!--a.__u){if(a.state.__a){var c=a.state.__a;a.__v.__k[0]=_n(c,c.__c.__P,c.__c.__O)}var p;for(a.setState({__a:a.__b=null});p=a.o.pop();)p.__P=l,p.forceUpdate()}};a.__u++||32&t.__u||a.setState({__a:a.__b=a.__v.__k[0]}),e.then(s,s)},ir.prototype.componentWillUnmount=function(){this.o=[]},ir.prototype.render=function(e,t){if(this.__b){if(this.__v.__k){var r=document.createElement("div"),a=this.__v.__k[0].__c;this.__v.__k[0]=mn(this.__b,r,a.__O=a.__P)}this.__b=null}var n=t.__a&&we($,null,e.fallback);return n&&(n.__u&=-33),[we($,null,t.__a?null:e.children),n]};var on=function(e,t,r){if(++r[1]===r[0]&&e.l.delete(t),e.props.revealOrder&&(e.props.revealOrder[0]!=="t"||!e.l.size))for(r=e.i;r;){for(;r.length>3;)r.pop()();if(r[1]<r[0])break;e.i=r=r[2]}};(Tt.prototype=new K).__a=function(e){var t=this,r=gn(t.__v),a=t.l.get(e);return a[0]++,function(n){var i=function(){t.props.revealOrder?(a.push(n),on(t,e,a)):n()};r?r(i):i()}},Tt.prototype.render=function(e){this.i=null,this.l=new Map;var t=We(e.children);e.revealOrder&&e.revealOrder[0]==="b"&&t.reverse();for(var r=t.length;r--;)this.l.set(t[r],this.i=[1,0,this.i]);return e.children},Tt.prototype.componentDidUpdate=Tt.prototype.componentDidMount=function(){var e=this;this.l.forEach(function(t,r){on(e,r,t)})};var po=typeof Symbol<"u"&&Symbol.for&&Symbol.for("react.element")||60103,ho=/^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|dominant|fill|flood|font|glyph(?!R)|horiz|image(!S)|letter|lighting|marker(?!H|W|U)|overline|paint|pointer|shape|stop|strikethrough|stroke|text(?!L)|transform|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/,mo=/^on(Ani|Tra|Tou|BeforeInp|Compo)/,_o=/[A-Z0-9]/g,go=typeof document<"u",vo=function(e){return(typeof Symbol<"u"&&typeof Symbol()=="symbol"?/fil|che|rad/:/fil|che|ra/).test(e)};K.prototype.isReactComponent=!0,["componentWillMount","componentWillReceiveProps","componentWillUpdate"].forEach(function(e){Object.defineProperty(K.prototype,e,{configurable:!0,get:function(){return this["UNSAFE_"+e]},set:function(t){Object.defineProperty(this,e,{configurable:!0,writable:!0,value:t})}})});var sn=S.event;S.event=function(e){return sn&&(e=sn(e)),e.persist=function(){},e.isPropagationStopped=function(){return this.cancelBubble},e.isDefaultPrevented=function(){return this.defaultPrevented},e.nativeEvent=e};var vn,bo={configurable:!0,get:function(){return this.class}},ln=S.vnode;S.vnode=function(e){typeof e.type=="string"&&(function(t){var r=t.props,a=t.type,n={},i=a.indexOf("-")==-1;for(var s in r){var l=r[s];if(!(s==="value"&&"defaultValue"in r&&l==null||go&&s==="children"&&a==="noscript"||s==="class"||s==="className")){var f=s.toLowerCase();s==="defaultValue"&&"value"in r&&r.value==null?s="value":s==="download"&&l===!0?l="":f==="translate"&&l==="no"?l=!1:f[0]==="o"&&f[1]==="n"?f==="ondoubleclick"?s="ondblclick":f!=="onchange"||a!=="input"&&a!=="textarea"||vo(r.type)?f==="onfocus"?s="onfocusin":f==="onblur"?s="onfocusout":mo.test(s)&&(s=f):f=s="oninput":i&&ho.test(s)?s=s.replace(_o,"-$&").toLowerCase():l===null&&(l=void 0),f==="oninput"&&n[s=f]&&(s="oninputCapture"),n[s]=l}}a=="select"&&(n.multiple&&Array.isArray(n.value)&&(n.value=We(r.children).forEach(function(c){c.props.selected=n.value.indexOf(c.props.value)!=-1})),n.defaultValue!=null&&(n.value=We(r.children).forEach(function(c){c.props.selected=n.multiple?n.defaultValue.indexOf(c.props.value)!=-1:n.defaultValue==c.props.value}))),r.class&&!r.className?(n.class=r.class,Object.defineProperty(n,"className",bo)):r.className&&(n.class=n.className=r.className),t.props=n})(e),e.$$typeof=po,ln&&ln(e)};var cn=S.__r;S.__r=function(e){cn&&cn(e),vn=e.__c};var un=S.diffed;S.diffed=function(e){un&&un(e);var t=e.props,r=e.__e;r!=null&&e.type==="textarea"&&"value"in t&&t.value!==r.value&&(r.value=t.value==null?"":t.value),vn=null};var bn=`#version 300 es
precision mediump float;

layout(location = 0) in vec4 a_position;

uniform vec2 u_resolution;
uniform float u_pixelRatio;
uniform float u_imageAspectRatio;
uniform float u_originX;
uniform float u_originY;
uniform float u_worldWidth;
uniform float u_worldHeight;
uniform float u_fit;
uniform float u_scale;
uniform float u_rotation;
uniform float u_offsetX;
uniform float u_offsetY;

out vec2 v_objectUV;
out vec2 v_objectBoxSize;
out vec2 v_responsiveUV;
out vec2 v_responsiveBoxGivenSize;
out vec2 v_patternUV;
out vec2 v_patternBoxSize;
out vec2 v_imageUV;

vec3 getBoxSize(float boxRatio, vec2 givenBoxSize) {
  vec2 box = vec2(0.);
  // fit = none
  box.x = boxRatio * min(givenBoxSize.x / boxRatio, givenBoxSize.y);
  float noFitBoxWidth = box.x;
  if (u_fit == 1.) { // fit = contain
    box.x = boxRatio * min(u_resolution.x / boxRatio, u_resolution.y);
  } else if (u_fit == 2.) { // fit = cover
    box.x = boxRatio * max(u_resolution.x / boxRatio, u_resolution.y);
  }
  box.y = box.x / boxRatio;
  return vec3(box, noFitBoxWidth);
}

void main() {
  gl_Position = a_position;

  vec2 uv = gl_Position.xy * .5;
  vec2 boxOrigin = vec2(.5 - u_originX, u_originY - .5);
  vec2 givenBoxSize = vec2(u_worldWidth, u_worldHeight);
  givenBoxSize = max(givenBoxSize, vec2(1.)) * u_pixelRatio;
  float r = u_rotation * 3.14159265358979323846 / 180.;
  mat2 graphicRotation = mat2(cos(r), sin(r), -sin(r), cos(r));
  vec2 graphicOffset = vec2(-u_offsetX, u_offsetY);


  // ===================================================

  float fixedRatio = 1.;
  vec2 fixedRatioBoxGivenSize = vec2(
  (u_worldWidth == 0.) ? u_resolution.x : givenBoxSize.x,
  (u_worldHeight == 0.) ? u_resolution.y : givenBoxSize.y
  );

  v_objectBoxSize = getBoxSize(fixedRatio, fixedRatioBoxGivenSize).xy;
  vec2 objectWorldScale = u_resolution.xy / v_objectBoxSize;

  v_objectUV = uv;
  v_objectUV *= objectWorldScale;
  v_objectUV += boxOrigin * (objectWorldScale - 1.);
  v_objectUV += graphicOffset;
  v_objectUV /= u_scale;
  v_objectUV = graphicRotation * v_objectUV;

  // ===================================================

  v_responsiveBoxGivenSize = vec2(
  (u_worldWidth == 0.) ? u_resolution.x : givenBoxSize.x,
  (u_worldHeight == 0.) ? u_resolution.y : givenBoxSize.y
  );
  float responsiveRatio = v_responsiveBoxGivenSize.x / v_responsiveBoxGivenSize.y;
  vec2 responsiveBoxSize = getBoxSize(responsiveRatio, v_responsiveBoxGivenSize).xy;
  vec2 responsiveBoxScale = u_resolution.xy / responsiveBoxSize;

  #ifdef ADD_HELPERS
  v_responsiveHelperBox = uv;
  v_responsiveHelperBox *= responsiveBoxScale;
  v_responsiveHelperBox += boxOrigin * (responsiveBoxScale - 1.);
  #endif

  v_responsiveUV = uv;
  v_responsiveUV *= responsiveBoxScale;
  v_responsiveUV += boxOrigin * (responsiveBoxScale - 1.);
  v_responsiveUV += graphicOffset;
  v_responsiveUV /= u_scale;
  v_responsiveUV.x *= responsiveRatio;
  v_responsiveUV = graphicRotation * v_responsiveUV;
  v_responsiveUV.x /= responsiveRatio;

  // ===================================================

  float patternBoxRatio = givenBoxSize.x / givenBoxSize.y;
  vec2 patternBoxGivenSize = vec2(
  (u_worldWidth == 0.) ? u_resolution.x : givenBoxSize.x,
  (u_worldHeight == 0.) ? u_resolution.y : givenBoxSize.y
  );
  patternBoxRatio = patternBoxGivenSize.x / patternBoxGivenSize.y;

  vec3 boxSizeData = getBoxSize(patternBoxRatio, patternBoxGivenSize);
  v_patternBoxSize = boxSizeData.xy;
  float patternBoxNoFitBoxWidth = boxSizeData.z;
  vec2 patternBoxScale = u_resolution.xy / v_patternBoxSize;

  v_patternUV = uv;
  v_patternUV += graphicOffset / patternBoxScale;
  v_patternUV += boxOrigin;
  v_patternUV -= boxOrigin / patternBoxScale;
  v_patternUV *= u_resolution.xy;
  v_patternUV /= u_pixelRatio;
  if (u_fit > 0.) {
    v_patternUV *= (patternBoxNoFitBoxWidth / v_patternBoxSize.x);
  }
  v_patternUV /= u_scale;
  v_patternUV = graphicRotation * v_patternUV;
  v_patternUV += boxOrigin / patternBoxScale;
  v_patternUV -= boxOrigin;
  // x100 is a default multiplier between vertex and fragmant shaders
  // we use it to avoid UV presision issues
  v_patternUV *= .01;

  // ===================================================

  vec2 imageBoxSize;
  if (u_fit == 1.) { // contain
    imageBoxSize.x = min(u_resolution.x / u_imageAspectRatio, u_resolution.y) * u_imageAspectRatio;
  } else if (u_fit == 2.) { // cover
    imageBoxSize.x = max(u_resolution.x / u_imageAspectRatio, u_resolution.y) * u_imageAspectRatio;
  } else {
    imageBoxSize.x = min(10.0, 10.0 / u_imageAspectRatio * u_imageAspectRatio);
  }
  imageBoxSize.y = imageBoxSize.x / u_imageAspectRatio;
  vec2 imageBoxScale = u_resolution.xy / imageBoxSize;

  v_imageUV = uv;
  v_imageUV *= imageBoxScale;
  v_imageUV += boxOrigin * (imageBoxScale - 1.);
  v_imageUV += graphicOffset;
  v_imageUV /= u_scale;
  v_imageUV.x *= u_imageAspectRatio;
  v_imageUV = graphicRotation * v_imageUV;
  v_imageUV.x /= u_imageAspectRatio;

  v_imageUV += .5;
  v_imageUV.y = 1. - v_imageUV.y;
}`;var yn=1920*1080*4,Ye=class{parentElement;canvasElement;gl;program=null;uniformLocations={};fragmentShader;rafId=null;lastRenderTime=0;currentFrame=0;speed=0;currentSpeed=0;providedUniforms;mipmaps=[];hasBeenDisposed=!1;resolutionChanged=!0;textures=new Map;minPixelRatio;maxPixelCount;isSafari=wo();uniformCache={};textureUnitMap=new Map;ownerDocument;constructor(t,r,a,n,i=0,s=0,l=2,f=yn,c=[]){if(t?.nodeType===1)this.parentElement=t;else throw new Error("Paper Shaders: parent element must be an HTMLElement");if(this.ownerDocument=t.ownerDocument,!this.ownerDocument.querySelector("style[data-paper-shader]")){let d=this.ownerDocument.createElement("style");d.innerHTML=xo,d.setAttribute("data-paper-shader",""),this.ownerDocument.head.prepend(d)}let p=this.ownerDocument.createElement("canvas");this.canvasElement=p,this.parentElement.prepend(p),this.fragmentShader=r,this.providedUniforms=a,this.mipmaps=c,this.currentFrame=s,this.minPixelRatio=l,this.maxPixelCount=f;let _=p.getContext("webgl2",n);if(!_)throw new Error("Paper Shaders: WebGL is not supported in this browser");this.gl=_,this.initProgram(),this.setupPositionAttribute(),this.setupUniforms(),this.setUniformValues(this.providedUniforms),this.setupResizeObserver(),visualViewport?.addEventListener("resize",this.handleVisualViewportChange),this.setupIntersectionObserver(),this.setSpeed(i),this.parentElement.setAttribute("data-paper-shader",""),this.parentElement.paperShaderMount=this,this.ownerDocument.addEventListener("visibilitychange",this.handleDocumentVisibilityChange)}initProgram=()=>{let t=ko(this.gl,bn,this.fragmentShader);t&&(this.program=t)};setupPositionAttribute=()=>{let t=this.gl.getAttribLocation(this.program,"a_position"),r=this.gl.createBuffer();this.gl.bindBuffer(this.gl.ARRAY_BUFFER,r);let a=[-1,-1,1,-1,-1,1,-1,1,1,-1,1,1];this.gl.bufferData(this.gl.ARRAY_BUFFER,new Float32Array(a),this.gl.STATIC_DRAW),this.gl.enableVertexAttribArray(t),this.gl.vertexAttribPointer(t,2,this.gl.FLOAT,!1,0,0)};setupUniforms=()=>{let t={u_time:this.gl.getUniformLocation(this.program,"u_time"),u_pixelRatio:this.gl.getUniformLocation(this.program,"u_pixelRatio"),u_resolution:this.gl.getUniformLocation(this.program,"u_resolution")};Object.entries(this.providedUniforms).forEach(([r,a])=>{if(t[r]=this.gl.getUniformLocation(this.program,r),a instanceof HTMLImageElement){let n=`${r}AspectRatio`;t[n]=this.gl.getUniformLocation(this.program,n)}}),this.uniformLocations=t};renderScale=1;parentWidth=0;parentHeight=0;parentDevicePixelWidth=0;parentDevicePixelHeight=0;devicePixelsSupported=!1;intersectionObserver=null;isInViewport=!0;resizeObserver=null;setupResizeObserver=()=>{this.resizeObserver=new ResizeObserver(([t])=>{if(t?.borderBoxSize[0]){let r=t.devicePixelContentBoxSize?.[0];r!==void 0&&(this.devicePixelsSupported=!0,this.parentDevicePixelWidth=r.inlineSize,this.parentDevicePixelHeight=r.blockSize),this.parentWidth=t.borderBoxSize[0].inlineSize,this.parentHeight=t.borderBoxSize[0].blockSize}this.handleResize()}),this.resizeObserver.observe(this.parentElement)};setupIntersectionObserver=()=>{let t=this.ownerDocument.defaultView;t?.IntersectionObserver&&(this.intersectionObserver=new t.IntersectionObserver(([r])=>{this.isInViewport=r?.isIntersecting??!0,this.updateCurrentSpeed()}),this.intersectionObserver.observe(this.parentElement))};handleVisualViewportChange=()=>{this.resizeObserver?.disconnect(),this.setupResizeObserver()};handleResize=()=>{let t=0,r=0,a=Math.max(1,window.devicePixelRatio),n=visualViewport?.scale??1;if(this.devicePixelsSupported){let p=Math.max(1,this.minPixelRatio/a);t=this.parentDevicePixelWidth*p*n,r=this.parentDevicePixelHeight*p*n}else{let p=Math.max(a,this.minPixelRatio)*n;if(this.isSafari){let _=So(this.ownerDocument);p*=Math.max(1,_)}t=Math.round(this.parentWidth)*p,r=Math.round(this.parentHeight)*p}let i=Math.sqrt(this.maxPixelCount)/Math.sqrt(t*r),s=Math.min(1,i),l=Math.round(t*s),f=Math.round(r*s),c=l/Math.round(this.parentWidth);(this.canvasElement.width!==l||this.canvasElement.height!==f||this.renderScale!==c)&&(this.renderScale=c,this.canvasElement.width=l,this.canvasElement.height=f,this.resolutionChanged=!0,this.gl.viewport(0,0,this.gl.canvas.width,this.gl.canvas.height),this.render(performance.now()))};render=t=>{if(this.hasBeenDisposed)return;if(this.program===null){console.warn("Tried to render before program or gl was initialized");return}let r=t-this.lastRenderTime;this.lastRenderTime=t,this.currentSpeed!==0&&(this.currentFrame+=r*this.currentSpeed),this.gl.clear(this.gl.COLOR_BUFFER_BIT),this.gl.useProgram(this.program),this.gl.uniform1f(this.uniformLocations.u_time,this.currentFrame*.001),this.resolutionChanged&&(this.gl.uniform2f(this.uniformLocations.u_resolution,this.gl.canvas.width,this.gl.canvas.height),this.gl.uniform1f(this.uniformLocations.u_pixelRatio,this.renderScale),this.resolutionChanged=!1),this.gl.drawArrays(this.gl.TRIANGLES,0,6),this.currentSpeed!==0?this.requestRender():this.rafId=null};requestRender=()=>{this.rafId!==null&&cancelAnimationFrame(this.rafId),this.rafId=requestAnimationFrame(this.render)};setTextureUniform=(t,r)=>{if(!r.complete||r.naturalWidth===0)throw new Error(`Paper Shaders: image for uniform ${t} must be fully loaded`);let a=this.textures.get(t);a&&this.gl.deleteTexture(a),this.textureUnitMap.has(t)||this.textureUnitMap.set(t,this.textureUnitMap.size);let n=this.textureUnitMap.get(t);this.gl.activeTexture(this.gl.TEXTURE0+n);let i=this.gl.createTexture();this.gl.bindTexture(this.gl.TEXTURE_2D,i),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_WRAP_S,this.gl.CLAMP_TO_EDGE),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_WRAP_T,this.gl.CLAMP_TO_EDGE),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MIN_FILTER,this.gl.LINEAR),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MAG_FILTER,this.gl.LINEAR),this.gl.texImage2D(this.gl.TEXTURE_2D,0,this.gl.RGBA,this.gl.RGBA,this.gl.UNSIGNED_BYTE,r),this.mipmaps.includes(t)&&(this.gl.generateMipmap(this.gl.TEXTURE_2D),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MIN_FILTER,this.gl.LINEAR_MIPMAP_LINEAR));let s=this.gl.getError();if(s!==this.gl.NO_ERROR||i===null){console.error("Paper Shaders: WebGL error when uploading texture:",s);return}this.textures.set(t,i);let l=this.uniformLocations[t];if(l){this.gl.uniform1i(l,n);let f=`${t}AspectRatio`,c=this.uniformLocations[f];if(c){let p=r.naturalWidth/r.naturalHeight;this.gl.uniform1f(c,p)}}};areUniformValuesEqual=(t,r)=>t===r?!0:Array.isArray(t)&&Array.isArray(r)&&t.length===r.length?t.every((a,n)=>this.areUniformValuesEqual(a,r[n])):!1;setUniformValues=t=>{this.gl.useProgram(this.program),Object.entries(t).forEach(([r,a])=>{let n=a;if(a instanceof HTMLImageElement&&(n=`${a.src.slice(0,200)}|${a.naturalWidth}x${a.naturalHeight}`),this.areUniformValuesEqual(this.uniformCache[r],n))return;this.uniformCache[r]=n;let i=this.uniformLocations[r];if(!i){console.warn(`Uniform location for ${r} not found`);return}if(a instanceof HTMLImageElement)this.setTextureUniform(r,a);else if(Array.isArray(a)){let s=null,l=null;if(a[0]!==void 0&&Array.isArray(a[0])){let f=a[0].length;if(a.every(c=>c.length===f))s=a.flat(),l=f;else{console.warn(`All child arrays must be the same length for ${r}`);return}}else s=a,l=s.length;switch(l){case 2:this.gl.uniform2fv(i,s);break;case 3:this.gl.uniform3fv(i,s);break;case 4:this.gl.uniform4fv(i,s);break;case 9:this.gl.uniformMatrix3fv(i,!1,s);break;case 16:this.gl.uniformMatrix4fv(i,!1,s);break;default:console.warn(`Unsupported uniform array length: ${l}`)}}else typeof a=="number"?this.gl.uniform1f(i,a):typeof a=="boolean"?this.gl.uniform1i(i,a?1:0):console.warn(`Unsupported uniform type for ${r}: ${typeof a}`)})};getCurrentFrame=()=>this.currentFrame;setFrame=t=>{this.currentFrame=t,this.lastRenderTime=performance.now(),this.render(performance.now())};setSpeed=(t=1)=>{this.speed=t,this.updateCurrentSpeed()};updateCurrentSpeed=()=>{this.setCurrentSpeed(this.ownerDocument.hidden||!this.isInViewport?0:this.speed)};setCurrentSpeed=t=>{this.currentSpeed=t,this.rafId===null&&t!==0&&(this.lastRenderTime=performance.now(),this.rafId=requestAnimationFrame(this.render)),this.rafId!==null&&t===0&&(cancelAnimationFrame(this.rafId),this.rafId=null)};setMaxPixelCount=(t=yn)=>{this.maxPixelCount=t,this.handleResize()};setMinPixelRatio=(t=2)=>{this.minPixelRatio=t,this.handleResize()};setUniforms=t=>{this.setUniformValues(t),this.providedUniforms={...this.providedUniforms,...t},this.render(performance.now())};handleDocumentVisibilityChange=()=>{this.updateCurrentSpeed()};dispose=()=>{this.hasBeenDisposed=!0,this.rafId!==null&&(cancelAnimationFrame(this.rafId),this.rafId=null),this.gl&&this.program&&(this.textures.forEach(t=>{this.gl.deleteTexture(t)}),this.textures.clear(),this.gl.deleteProgram(this.program),this.program=null,this.gl.bindBuffer(this.gl.ARRAY_BUFFER,null),this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER,null),this.gl.bindRenderbuffer(this.gl.RENDERBUFFER,null),this.gl.bindFramebuffer(this.gl.FRAMEBUFFER,null),this.gl.getError()),this.resizeObserver&&(this.resizeObserver.disconnect(),this.resizeObserver=null),this.intersectionObserver&&(this.intersectionObserver.disconnect(),this.intersectionObserver=null),visualViewport?.removeEventListener("resize",this.handleVisualViewportChange),this.ownerDocument.removeEventListener("visibilitychange",this.handleDocumentVisibilityChange),this.uniformLocations={},this.canvasElement.remove(),delete this.parentElement.paperShaderMount}};function kn(e,t,r){let a=e.createShader(t);return a?(e.shaderSource(a,r),e.compileShader(a),e.getShaderParameter(a,e.COMPILE_STATUS)?a:(console.error("An error occurred compiling the shaders: "+e.getShaderInfoLog(a)),e.deleteShader(a),null)):null}function ko(e,t,r){let a=e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT),n=a?a.precision:null;n&&n<23&&(t=t.replace(/precision\s+(lowp|mediump)\s+float;/g,"precision highp float;"),r=r.replace(/precision\s+(lowp|mediump)\s+float/g,"precision highp float").replace(/\b(uniform|varying|attribute)\s+(lowp|mediump)\s+(\w+)/g,"$1 highp $3"));let i=kn(e,e.VERTEX_SHADER,t),s=kn(e,e.FRAGMENT_SHADER,r);if(!i||!s)return null;let l=e.createProgram();return l?(e.attachShader(l,i),e.attachShader(l,s),e.linkProgram(l),e.getProgramParameter(l,e.LINK_STATUS)?(e.detachShader(l,i),e.detachShader(l,s),e.deleteShader(i),e.deleteShader(s),l):(console.error("Unable to initialize the shader program: "+e.getProgramInfoLog(l)),e.deleteProgram(l),e.deleteShader(i),e.deleteShader(s),null)):null}var xo=`@layer paper-shaders {
  :where([data-paper-shader]) {
    isolation: isolate;
    position: relative;

    & canvas {
      contain: strict;
      display: block;
      position: absolute;
      inset: 0;
      z-index: -1;
      width: 100%;
      height: 100%;
      border-radius: inherit;
      corner-shape: inherit;
    }
  }
}`;function wo(){let e=navigator.userAgent.toLowerCase();return e.includes("safari")&&!e.includes("chrome")&&!e.includes("android")}function So(e){let t=visualViewport?.scale??1,r=visualViewport?.width??window.innerWidth,a=window.innerWidth-e.documentElement.clientWidth,n=t*r+a,i=outerWidth/n,s=Math.round(100*i);return s%5===0?s/100:s===33?1/3:s===67?2/3:s===133?4/3:i}var Te={fit:"contain",scale:1,rotation:0,offsetX:0,offsetY:0,originX:.5,originY:.5,worldWidth:0,worldHeight:0};var sr={none:0,contain:1,cover:2};var xn=`
#define TWO_PI 6.28318530718
#define PI 3.14159265358979323846
`,wn=`
vec2 rotate(vec2 uv, float th) {
  return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
}
`;var Sn=`
  float hash21(vec2 p) {
    p = fract(p * vec2(0.3183099, 0.3678794)) + 0.1;
    p += dot(p, p + 19.19);
    return fract(p.x * p.y);
  }
`;var lr={maxColorCount:10},cr=`#version 300 es
precision mediump float;

uniform float u_time;

uniform vec4 u_colors[${lr.maxColorCount}];
uniform float u_colorsCount;

uniform float u_distortion;
uniform float u_swirl;
uniform float u_grainMixer;
uniform float u_grainOverlay;

in vec2 v_objectUV;
out vec4 fragColor;

${xn}
${wn}
${Sn}

float valueNoise(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  float x1 = mix(a, b, u.x);
  float x2 = mix(c, d, u.x);
  return mix(x1, x2, u.y);
}

float noise(vec2 n, vec2 seedOffset) {
  return valueNoise(n + seedOffset);
}

vec2 getPosition(int i, float t) {
  float a = float(i) * .37;
  float b = .6 + fract(float(i) / 3.) * .9;
  float c = .8 + fract(float(i + 1) / 4.);

  float x = sin(t * b + a);
  float y = cos(t * c + a * 1.5);

  return .5 + .5 * vec2(x, y);
}

void main() {
  vec2 uv = v_objectUV;
  uv += .5;
  vec2 grainUV = uv * 1000.;

  float mixerGrain = 0.;
  if (u_grainMixer > 0.) {
    mixerGrain = .4 * u_grainMixer * (noise(grainUV, vec2(0.)) - .5);
  }

  const float firstFrameOffset = 41.5;
  float t = .5 * (u_time + firstFrameOffset);

  float radius = smoothstep(0., 1., length(uv - .5));
  float center = 1. - radius;
  for (float i = 1.; i <= 2.; i++) {
    uv.x += u_distortion * center / i * sin(t + i * .4 * smoothstep(.0, 1., uv.y)) * cos(.2 * t + i * 2.4 * smoothstep(.0, 1., uv.y));
    uv.y += u_distortion * center / i * cos(t + i * 2. * smoothstep(.0, 1., uv.x));
  }

  vec2 uvRotated = uv;
  uvRotated -= vec2(.5);
  float angle = 3. * u_swirl * radius;
  uvRotated = rotate(uvRotated, -angle);
  uvRotated += vec2(.5);

  vec3 color = vec3(0.);
  float opacity = 0.;
  float totalWeight = 0.;

  for (int i = 0; i < ${lr.maxColorCount}; i++) {
    if (i >= int(u_colorsCount)) break;

    vec2 pos = getPosition(i, t) + mixerGrain;
    vec3 colorFraction = u_colors[i].rgb * u_colors[i].a;
    float opacityFraction = u_colors[i].a;

    float dist = length(uvRotated - pos);

    dist = pow(dist, 3.5);
    float weight = 1. / (dist + 1e-3);
    color += colorFraction * weight;
    opacity += opacityFraction * weight;
    totalWeight += weight;
  }

  color /= max(1e-4, totalWeight);
  opacity /= max(1e-4, totalWeight);

  if (u_grainOverlay > 0.) {
    float grainOverlay = valueNoise(rotate(grainUV, 1.) + vec2(3.));
    grainOverlay = mix(grainOverlay, valueNoise(rotate(grainUV, 2.) + vec2(-1.)), .5);
    grainOverlay = pow(grainOverlay, 1.3);

    float grainOverlayV = grainOverlay * 2. - 1.;
    vec3 grainOverlayColor = vec3(step(0., grainOverlayV));
    float grainOverlayStrength = u_grainOverlay * abs(grainOverlayV);
    grainOverlayStrength = pow(grainOverlayStrength, .8);
    color = mix(color, grainOverlayColor, .35 * grainOverlayStrength);

    opacity += .5 * grainOverlayStrength;
  }
  opacity = clamp(opacity, 0., 1.);

  fragColor = vec4(color, opacity);
}
`;function ur(e){if(Array.isArray(e))return e.length===4?e:e.length===3?[...e,1]:Re;if(typeof e!="string")return Re;let t,r,a,n=1;if(e.startsWith("#"))[t,r,a,n]=Ao(e);else if(e.startsWith("rgb")){let i=Eo(e);if(i===null)return Re;[t,r,a,n]=i}else if(e.startsWith("hsl")){let i=To(e);if(i===null)return Re;[t,r,a,n]=Ro(i)}else return console.error("Unsupported color format",e),Re;return[Rt(t,0,1),Rt(r,0,1),Rt(a,0,1),Rt(n,0,1)]}function Ao(e){if(e=e.replace(/^#/,""),(e.length===3||e.length===4)&&(e=e.split("").map(i=>i+i).join("")),e.length===6&&(e=e+"ff"),!/^[0-9a-f]{8}$/i.test(e))return console.warn("Invalid hex color"),Re;let t=parseInt(e.slice(0,2),16)/255,r=parseInt(e.slice(2,4),16)/255,a=parseInt(e.slice(4,6),16)/255,n=parseInt(e.slice(6,8),16)/255;return[t,r,a,n]}function Eo(e){let t=e.match(/^rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([0-9.]+))?\s*\)$/i);return t?[parseInt(t[1]??"0")/255,parseInt(t[2]??"0")/255,parseInt(t[3]??"0")/255,t[4]===void 0?1:parseFloat(t[4])]:null}function To(e){let t=e.match(/^hsla?\s*\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*(?:,\s*([0-9.]+))?\s*\)$/i);return t?[parseInt(t[1]??"0"),parseInt(t[2]??"0"),parseInt(t[3]??"0"),t[4]===void 0?1:parseFloat(t[4])]:null}function Ro(e){let[t,r,a,n]=e,i=t/360,s=r/100,l=a/100,f,c,p;if(r===0)f=c=p=l;else{let _=(k,v,b)=>(b<0&&(b+=1),b>1&&(b-=1),b<.16666666666666666?k+(v-k)*6*b:b<.5?v:b<.6666666666666666?k+(v-k)*(.6666666666666666-b)*6:k),d=l<.5?l*(1+s):l+s-l*s,h=2*l-d;f=_(h,d,i+1/3),c=_(h,d,i),p=_(h,d,i-1/3)}return[f,c,p,n]}var Rt=(e,t,r)=>Math.min(Math.max(e,t),r),Re=[.5,.5,.5,1];var dr="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";function An(e){let t=A(void 0),r=Gt(a=>{let n=e.map(i=>{if(i!=null){if(typeof i=="function"){let s=i,l=s(a);return typeof l=="function"?l:()=>{s(null)}}return i.current=a,()=>{i.current=null}}});return()=>{n.forEach(i=>i?.())}},e);return je(()=>e.every(a=>a==null)?null:a=>{t.current&&(t.current(),t.current=void 0),a!=null&&(t.current=r(a))},e)}function fr(e){if(e.naturalWidth<1024&&e.naturalHeight<1024){if(e.naturalWidth<1||e.naturalHeight<1)return;let t=e.naturalWidth/e.naturalHeight;e.width=Math.round(t>1?1024*t:1024),e.height=Math.round(t>1?1024:1024/t)}}async function En(e){let t={},r=[],a=i=>{try{return i.startsWith("/")||new URL(i),!0}catch{return!1}},n=i=>{try{return i.startsWith("/")?!1:new URL(i,window.location.origin).origin!==window.location.origin}catch{return!1}};return Object.entries(e).forEach(([i,s])=>{if(typeof s=="string"){let l=s||dr;if(!a(l)){console.warn(`Uniform "${i}" has invalid URL "${l}". Skipping image loading.`);return}let f=new Promise((c,p)=>{let _=new Image;n(l)&&(_.crossOrigin="anonymous"),_.onload=()=>{fr(_),t[i]=_,c()},_.onerror=()=>{console.error(`Could not set uniforms. Failed to load image at ${l}`),p()},_.src=l});r.push(f)}else if(s instanceof HTMLImageElement){let l=s.decode().then(()=>{fr(s),t[i]=s});r.push(l)}else t[i]=s}),await Promise.all(r),t}var pr=hn(function({fragmentShader:t,uniforms:r,webGlContextAttributes:a,speed:n=0,frame:i=0,width:s,height:l,minPixelRatio:f,maxPixelCount:c,mipmaps:p,style:_,...d},h){let[k,v]=T(!1),b=A(null),x=A(null),w=A(a);R(()=>((async()=>{let O=await En(r);b.current&&!x.current&&(x.current=new Ye(b.current,t,O,w.current,n,i,f,c,p),v(!0))})(),()=>{x.current?.dispose(),x.current=null}),[t]),R(()=>{let P=!1;return(async()=>{let C=await En(r);P||x.current?.setUniforms(C)})(),()=>{P=!0}},[r,k]),R(()=>{x.current?.setSpeed(n)},[n,k]),R(()=>{x.current?.setMaxPixelCount(c)},[c,k]),R(()=>{x.current?.setMinPixelRatio(f)},[f,k]),R(()=>{x.current?.setFrame(i)},[i,k]);let L=An([b,h]);return o("div",{ref:L,style:s!==void 0||l!==void 0?{width:typeof s=="string"&&isNaN(+s)===!1?+s:s,height:typeof l=="string"&&isNaN(+l)===!1?+l:l,..._}:_,...d})});pr.displayName="ShaderMount";function Tn(e,t){if(Object.keys(e).length!==Object.keys(t).length)return!1;for(let r in e){if(r==="colors"){let a=Array.isArray(e.colors),n=Array.isArray(t.colors);if(!a||!n){if(Object.is(e.colors,t.colors)===!1)return!1;continue}if(e.colors?.length!==t.colors?.length||!e.colors?.every((i,s)=>i===t.colors?.[s]))return!1;continue}if(Object.is(e[r],t[r])===!1)return!1}return!0}var W={name:"Default",params:{...Te,speed:1,frame:0,colors:["#e0eaff","#241d9a","#f75092","#9f50d3"],distortion:.8,swirl:.1,grainMixer:0,grainOverlay:0}},Al={name:"Purple",params:{...Te,speed:.6,frame:0,colors:["#aaa7d7","#3c2b8e"],distortion:1,swirl:1,grainMixer:0,grainOverlay:0}},El={name:"Beach",params:{...Te,speed:.1,frame:0,colors:["#bcecf6","#00aaff","#00f7ff","#ffd447"],distortion:.8,swirl:.35,grainMixer:0,grainOverlay:0}},Tl={name:"Ink",params:{...Te,speed:1,frame:0,colors:["#ffffff","#000000"],distortion:1,swirl:.2,rotation:90,grainMixer:0,grainOverlay:0}};var hr=pn(function({speed:t=W.params.speed,frame:r=W.params.frame,colors:a=W.params.colors,distortion:n=W.params.distortion,swirl:i=W.params.swirl,grainMixer:s=W.params.grainMixer,grainOverlay:l=W.params.grainOverlay,fit:f=W.params.fit,rotation:c=W.params.rotation,scale:p=W.params.scale,originX:_=W.params.originX,originY:d=W.params.originY,offsetX:h=W.params.offsetX,offsetY:k=W.params.offsetY,worldWidth:v=W.params.worldWidth,worldHeight:b=W.params.worldHeight,...x}){let w={u_colors:a.map(ur),u_colorsCount:a.length,u_distortion:n,u_swirl:i,u_grainMixer:s,u_grainOverlay:l,u_fit:sr[f],u_rotation:c,u_scale:p,u_offsetX:h,u_offsetY:k,u_originX:_,u_originY:d,u_worldWidth:v,u_worldHeight:b};return o(pr,{...x,speed:t,frame:r,fragmentShader:cr,uniforms:w})},Tn);var Ke="#fb7185",Je="#f43f5e",mr=e=>{let t=e.replace("#",""),r=t.length===3?t.split("").map(n=>n+n).join(""):t,a=Number.parseInt(r,16);return[a>>16&255,a>>8&255,a&255]},_r=(e,t)=>{switch(e){case"listening":return .4+.32*Math.abs(Math.sin(t*8.5))+.18*Math.abs(Math.sin(t*4.1+1.5));case"speaking":return .3+.24*Math.abs(Math.sin(t*6.2))+.16*Math.abs(Math.sin(t*3+.6));case"thinking":return .24+.2*Math.abs(Math.sin(t*2.4));case"connecting":return .12+.1*Math.abs(Math.sin(t*1.6));case"error":return .2;default:return 0}},me=(e,t,r,a)=>e+(t-e)*(1-Math.exp(-r*a)),Rn=({size:e,speed:t,colorFrom:r,colorTo:a})=>{let n={};return e!=null&&(n["--orb-size"]=`${e}px`),t!=null&&(n["--orb-speed"]=`${t}`),r&&(n["--orb-color-from"]=r),a&&(n["--orb-color-to"]=a),n};var Mt=(e,t)=>{let r=!0,a=document.visibilityState==="visible",n=r&&a,i=()=>{let f=r&&a;f!==n&&(n=f,t(f))},s=new IntersectionObserver(f=>{r=f[f.length-1]?.isIntersecting??!0,i()});s.observe(e);let l=()=>{a=document.visibilityState==="visible",i()};return document.addEventListener("visibilitychange",l),()=>{s.disconnect(),document.removeEventListener("visibilitychange",l)}},Qe=null,Mn=()=>{if(Qe!==null)return Qe;try{let e=document.createElement("canvas"),t={failIfMajorPerformanceCaveat:!0};Qe=e.getContext("webgl2",t)!==null||e.getContext("webgl",t)!==null}catch{Qe=!1}return Qe};var On="(prefers-reduced-motion: reduce)",Mo=e=>{let t=window.matchMedia(On);return t.addEventListener("change",e),()=>t.removeEventListener("change",e)},Co=()=>fn(Mo,()=>window.matchMedia(On).matches),_e=(e,t,r)=>{let[a,n,i]=mr(e),[s,l,f]=mr(t),c=(p,_)=>Math.round(p+(_-p)*r).toString(16).padStart(2,"0");return`#${c(a,s)}${c(n,l)}${c(i,f)}`},Ln=(e,t)=>_e(e,"#000000",t),Ct=(e,t)=>_e(e,"#ffffff",t),Un=(e,t)=>[Ln(e,.35),e,_e(e,t,.5),t,Ct(t,.35)],Cn=Un(Ke,Je),Po={antialias:!0,powerPreference:"low-power"},Io=8e3,Oo=66,Lo=.1,Uo=7.5,Pn=6,Do=5,Fo=6,$o=6,Bo=.9,No=e=>e==="error"?1.8:e==="listening"?1.6:e==="speaking"?1.1:e==="thinking"?.95:e==="connecting"?.5:.3,gr=e=>e==="error"?.2:e==="speaking"?.18:e==="listening"?.16:e==="thinking"?.1:e==="connecting"?.08:.06,Ho={distortion:.42,swirl:.26},vr=(e,t,r=Ho)=>{switch(e){case"thinking":return{distortion:.35,swirl:Math.min(1,.75+t*.2)};case"listening":case"speaking":return{distortion:Math.min(1,.5+t*.4),swirl:Math.min(1,.3+t*.25)};case"error":return{distortion:.85,swirl:.55};case"connecting":return{distortion:Math.min(1,.42+t*.55),swirl:.3};default:return r}},Dn=(e,t)=>e==="disabled"?0:No(e)*t,In=(e,t,r)=>({energy:0,...vr(e,0,r),shaderSpeed:Dn(e,t),grain:gr(e),errorMix:e==="error"?1:0}),Me=(e,t)=>Math.round(e*t)/t,zo=(e,t)=>e.energy===t.energy&&e.distortion===t.distortion&&e.swirl===t.swirl&&e.shaderSpeed===t.shaderSpeed&&e.grain===t.grain&&e.errorMix===t.errorMix,br=({state:e="idle",size:t=160,speed:r=1,colorFrom:a="#7c3aed",colorTo:n="#06b6d4",colors:i,idleMotion:s,meshScale:l=1.15,gloss:f=!0,levelRef:c,label:p="Assistant orb",className:_})=>{let d=A(null),h=A(null),k=A(e),v=A(r),b=Co(),x=Mn(),w=A(s);w.current=s;let[L,P]=T(()=>In(e,r,s)),O=A(null);R(()=>{k.current=e,v.current=r}),R(()=>{if(b)return;let B=d.current;if(!B)return;O.current===null&&(O.current=In(k.current,v.current,w.current));let M=O.current,V=0,Q=null,oe=0,re=0,fe=!0,Ce=j=>{V=0;let X=Math.min(Lo,Q===null?1/60:(j-Q)/1e3);Q=j;let Z=k.current,pe=v.current;oe+=X*pe;let Ie=c?.current,Oe=typeof Ie=="number"&&Ie>=0;M.energy=me(M.energy,Oe?Ie:_r(Z,oe),Uo,X);let se=vr(Z,M.energy,w.current);if(M.distortion=me(M.distortion,se.distortion,Pn,X),M.swirl=me(M.swirl,se.swirl,Pn,X),M.shaderSpeed=me(M.shaderSpeed,Dn(Z,pe),Do,X),M.grain=me(M.grain,gr(Z),Fo,X),M.errorMix=me(M.errorMix,Z==="error"?1:0,$o,X),B.style.setProperty("--orb-level",M.energy.toFixed(3)),x&&j-re>Oo){re=j;let rt={energy:Me(M.energy,50),distortion:Me(M.distortion,100),swirl:Me(M.swirl,100),shaderSpeed:Me(M.shaderSpeed,100),grain:Me(M.grain,200),errorMix:Me(M.errorMix,100)};P(Le=>zo(Le,rt)?Le:rt)}fe&&(V=requestAnimationFrame(Ce))},tt=()=>{V===0&&(Q=null,V=requestAnimationFrame(Ce))},Pe=()=>{V!==0&&(cancelAnimationFrame(V),V=0),Q=null},It=Mt(B,j=>{fe=j,j?tt():Pe()});return tt(),()=>{Pe(),It()}},[c,b,x]),R(()=>{if(e!=="error"||b)return;let B=h.current;if(!B)return;let M=B.animate([{transform:"translateX(0)"},{transform:"translateX(-1.5px)"},{transform:"translateX(3px)"},{transform:"translateX(-2px)"},{transform:"translateX(1px)"},{transform:"translateX(0)"}],{duration:340,easing:"ease-out"});return()=>M.cancel()},[e,b]);let C=_r(e,Bo),N=b?{energy:C,...vr(e,C,s),shaderSpeed:0,grain:gr(e),errorMix:e==="error"?1:0}:L,I=x?N.errorMix:e==="error"?1:0,J=I>=1?Ke:I<=0?a:_e(a,Ke,I),g=I>=1?Je:I<=0?n:_e(n,Je,I),E=i??Un(a,n),q=I>=1?Cn:I<=0?E:E.map((B,M)=>_e(B,Cn[M],I)),et=[{key:"brand",from:a,to:n,visible:e!=="error"},{key:"error",from:Ke,to:Je,visible:e==="error"}].map(({key:B,from:M,to:V,visible:Q})=>({key:B,visible:Q,base:`radial-gradient(circle at 50% 40%, ${Ct(M,.12)}, ${_e(M,V,.55)} 55%, ${Ln(V,.35)} 100%)`,glow:`radial-gradient(circle at 32% 26%, ${Ct(V,.45)}, transparent 55%), radial-gradient(circle at 66% 72%, ${Ct(M,.2)}, transparent 62%)`})),de={...Rn({size:t,speed:r,colorFrom:a,colorTo:n}),...b?{"--orb-level":C.toFixed(3)}:null,width:t,height:t,position:"relative",borderRadius:"50%",opacity:e==="disabled"?.5:1,filter:e==="disabled"?"grayscale(0.85)":"grayscale(0)",transform:x?`scale(${(1+N.energy*.06).toFixed(4)})`:void 0,scale:x?void 0:"calc(1 + var(--orb-level, 0) * 0.06)",transition:"transform 0.2s ease-out, opacity 0.3s ease-out, filter 0.3s ease-out"};return o("div",{ref:d,role:"img","aria-label":p,"data-state":e,class:_,style:de,children:[o("div",{style:{position:"absolute",inset:0,borderRadius:"50%",boxShadow:`0 ${-t*.06}px ${t*.3}px color-mix(in oklab, ${J} 55%, transparent), 0 ${t*.06}px ${t*.3}px color-mix(in oklab, ${g} 55%, transparent)`,opacity:x?Math.min(1,.35+N.energy*.65):"calc(0.35 + var(--orb-level, 0) * 0.6)",transform:x?`scale(${(1+N.energy*.08).toFixed(4)})`:void 0,scale:x?void 0:"calc(1 + var(--orb-level, 0) * 0.08)",transition:x?"opacity 0.2s ease-out, transform 0.2s ease-out, box-shadow 0.35s ease":"box-shadow 0.35s ease"}}),o("div",{ref:h,style:{position:"absolute",inset:0,borderRadius:"50%",overflow:"hidden",boxShadow:`inset 0 0 0 1px color-mix(in oklab, ${J} 45%, transparent), 0 0 0 1px rgba(255,255,255,0.08)`,transition:"box-shadow 0.35s ease"},children:[x?o(hr,{width:t,height:t,colors:q,distortion:N.distortion,swirl:N.swirl,scale:l,speed:N.shaderSpeed,frame:Io,grainMixer:N.grain,grainOverlay:.05,minPixelRatio:2,webGlContextAttributes:Po}):o("div",{"aria-hidden":"true",style:{position:"absolute",inset:0,borderRadius:"50%"},children:et.map(B=>o("div",{style:{position:"absolute",inset:0,borderRadius:"50%",backgroundImage:B.base,opacity:B.visible?1:0,transition:"opacity 0.35s ease"},children:o("div",{style:{position:"absolute",inset:0,borderRadius:"50%",backgroundImage:B.glow,opacity:"calc(0.25 + var(--orb-level, 0) * 0.75)"}})},B.key))}),f&&o("div",{style:{position:"absolute",inset:0,borderRadius:"50%",pointerEvents:"none",backgroundImage:"radial-gradient(circle at 31% 22%, rgba(255,255,255,0.55), transparent 14%), radial-gradient(circle at 30% 26%, rgba(255,255,255,0.28), transparent 48%), radial-gradient(circle at 68% 76%, rgba(10,14,24,0.42), transparent 60%)"}})]})]})};var Nn=["#9483ec","#bcc0f7","#6a8bf1","#7fd6fb","#f2f4ff"],Hn=1.6,zn={distortion:1,swirl:.85},Fn=.76,Wo=.86,Wn=10,$n=()=>typeof window<"u"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;function yr(e,t){let r=.5+.5*Math.sin(t*.85),a=e/2*(Fn+(Wo-Fn)*r);return{rx:a*(1+.035*Math.sin(t*1.3)),ry:a*(1+.035*Math.sin(t*1.7+1.2)),cx:e/2+e*.012*Math.sin(t*.7),cy:e/2+e*.012*Math.cos(t*.8+.5)}}var Vn=({rx:e,ry:t,cx:r,cy:a})=>`${e.toFixed(1)}px ${t.toFixed(1)}px at ${r.toFixed(1)}px ${a.toFixed(1)}px`,kr=e=>`radial-gradient(${Vn(e)}, #000 0%, #000 ${100-Wn}%, transparent 100%)`,Bn=e=>`radial-gradient(${Vn(e)}, transparent 0%, transparent ${100-Wn}%, #000 100%)`;function xr(e,t){e&&(e.style.maskImage=t,e.style.setProperty("-webkit-mask-image",t))}function jn({size:e,state:t="idle",label:r="Assistant"}){let a={position:"absolute",inset:0,borderRadius:"50%"},n=v=>`${Math.max(1,e*v)}px`,i=A(null),s=A(null),l=A(null),f=A(null),c=A(null),p=A(null),_=yr(e,0);R(()=>{let v=C=>{xr(s.current,kr(C)),xr(l.current,kr(C)),xr(f.current,Bn(C))};if(v(yr(e,0)),$n()||!i.current)return;let b=0,x=performance.now(),w=C=>{v(yr(e,(C-x)/1e3)),b=requestAnimationFrame(w)},L=()=>{b||(b=requestAnimationFrame(w))},P=()=>{cancelAnimationFrame(b),b=0},O=Mt(i.current,C=>C?L():P());return L(),()=>{P(),O()}},[e]),R(()=>{if($n())return;let v=[c.current?.animate([{transform:"rotate(-20deg) scaleX(1)"},{transform:"rotate(160deg) scaleX(0.55)"},{transform:"rotate(340deg) scaleX(1)"}],{duration:9e3,iterations:1/0,easing:"ease-in-out"}),p.current?.animate([{transform:"rotate(70deg) scaleX(0.7)"},{transform:"rotate(-120deg) scaleX(1.1)"},{transform:"rotate(-290deg) scaleX(0.7)"}],{duration:13e3,iterations:1/0,easing:"ease-in-out"})];return()=>v.forEach(b=>b?.cancel())},[]);let d=(v,b,x,w)=>o("div",{ref:v,"aria-hidden":"true",style:{position:"absolute",inset:"-2%",background:`radial-gradient(ellipse 32% 58% at ${w}, transparent 95%, rgba(255,255,255,${b}) 97.5%, rgba(72,80,196,${x}) 99%, transparent 100%)`,filter:`blur(${n(.006)})`}}),h=kr(_),k=Bn(_);return o("div",{ref:i,class:"ask-ai__orb",style:{position:"relative",width:e,height:e,flex:"0 0 auto"},children:[o("div",{"aria-hidden":"true",style:{position:"absolute",borderRadius:"50%",left:"4%",right:"4%",top:"34%",height:"100%",background:"radial-gradient(closest-side, rgba(122,108,236,0.5), rgba(122,108,236,0.18) 55%, rgba(122,108,236,0))",filter:`blur(${n(.1)})`}}),o(br,{state:t,size:e,speed:Hn,colors:Nn,idleMotion:zn,meshScale:.55,gloss:!1,label:r}),o("div",{ref:s,"aria-hidden":"true",style:{...a,overflow:"hidden",mixBlendMode:"soft-light",opacity:.8,maskImage:h,WebkitMaskImage:h},children:[d(c,.75,.3,"22% 50%"),d(p,.4,.18,"78% 44%")]}),o("div",{ref:l,"aria-hidden":"true",style:{...a,backdropFilter:`blur(${n(.006)})`,WebkitBackdropFilter:`blur(${n(.006)})`,background:"radial-gradient(circle at 50% 50%, rgba(244,245,255,0.1) 0%, rgba(244,245,255,0.18) 60%, rgba(244,245,255,0.3) 100%)",maskImage:h,WebkitMaskImage:h}}),o("div",{ref:f,"aria-hidden":"true",style:{...a,backdropFilter:`blur(${n(.07)}) saturate(1.1)`,WebkitBackdropFilter:`blur(${n(.07)}) saturate(1.1)`,background:"radial-gradient(circle at 38% 30%, rgba(248,248,255,0.62), rgba(238,239,252,0.5) 60%, rgba(236,237,252,0.58) 100%)",maskImage:k,WebkitMaskImage:k}}),o("div",{"aria-hidden":"true",style:{...a,pointerEvents:"none",background:["radial-gradient(circle at 33% 27%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.45) 9%, rgba(255,255,255,0) 26%)","radial-gradient(ellipse 60% 22% at 50% 94%, rgba(214,236,255,0.45), rgba(214,236,255,0) 100%)","radial-gradient(circle at 40% 34%, rgba(60,52,150,0) 52%, rgba(60,52,150,0.16) 80%, rgba(46,40,130,0.38) 100%)"].join(", ")}}),o("div",{"aria-hidden":"true",style:{...a,pointerEvents:"none",boxShadow:`inset 0 0 ${n(.025)} rgba(255,255,255,0.9), 0 0 0 1px rgba(200,200,240,0.35)`}})]})}function Gn({size:e=18}){return o(br,{state:"thinking",size:e,speed:Hn,colors:Nn,idleMotion:zn,meshScale:.55,gloss:!1,label:"Thinking"})}function qn({starters:e,mock:t,supportUrl:r,onPick:a}){return o("div",{class:"ask-ai__welcome",children:[o(jn,{size:80}),o("h3",{class:"ask-ai__greeting",children:"What do you want to build today?"}),t&&o("p",{class:"ask-ai__welcome-note",children:["A preview, not connected to an assistant. For a real answer, use"," ",o("a",{href:r,target:"_blank",rel:"noopener noreferrer",children:"support"}),"."]}),o("div",{class:"ask-ai__pills",children:e.map((n,i)=>o("button",{type:"button",class:"ask-ai__pill",style:{animationDelay:`${400+i*60}ms`},title:n.prompt===n.label?void 0:n.prompt,onClick:()=>a(n.prompt),children:n.label},n.prompt))})]})}var Vo=[{label:"Create an ABHA",prompt:"How do I create an ABHA with an Aadhaar OTP?"},{label:"Link care contexts",prompt:"How do I link care contexts to an ABHA?"},{label:"Request consent",prompt:"How does an HIU raise a consent request?"},{label:"Decode an error",prompt:"What does ABDM-1016 mean and how do I fix it?"},{label:"Learn about Ask AI",prompt:"What can the Ask AI assistant do?"}];function Xn(e){let t=e.split(`
`).map(r=>r.trim()).filter(Boolean);return t.length?t.slice(0,5).map(r=>{let a=r.indexOf("|");if(a<0)return{label:r,prompt:r};let n=r.slice(0,a).trim(),i=r.slice(a+1).trim();return{label:n||i,prompt:i||n}}):Vo}function Pt(e){let t=[];for(let r of e){if(r.from==="assistant"&&(r.install||r.local)){t.length&&t[t.length-1].from==="you"&&t.pop();continue}t.push(r)}return t}var Ze=31;function Yn(e){let t=Math.floor(Pt(e).length/2),r=(Ze-1)/2,a=Math.min(100,Math.round(t/r*100));return{earlier:t,window:r,percent:a,full:t>=r}}function Kn(e){let t=Pt(e);return t.length<=Ze-1?-1:e.indexOf(t[t.length-(Ze-1)])}var Jn=`/* ---------- theming ---------- */

/*
 * Colour comes from the host page's own design tokens where it defines them,
 * with this palette as the fallback. Custom properties are the one thing that
 * crosses a shadow boundary, so a docs site that already declares --surface,
 * --accent and the rest gets a panel that matches it, and a partner's wiki
 * that declares nothing gets a panel that still reads correctly. An embedder
 * who wants a different look sets those properties on the element.
 *
 * The fallbacks follow the host page's own background, which the element
 * reads once and records as the ground attribute. That is a better guess than
 * the reader's system preference, because a light page on a machine set to
 * dark is still a light page. An embedder can set ground itself, and one that
 * wants a different look entirely sets the properties.
 */
:host {
  --aa-fb-page: #fdfdf7;
  --aa-fb-surface: #ffffff;
  --aa-fb-sunken: #f7f7f0;
  --aa-fb-border: rgb(0 0 0 / 0.09);
  --aa-fb-border-strong: rgb(0 0 0 / 0.16);
  --aa-fb-fill-soft: rgb(0 0 0 / 0.06);
  --aa-fb-accent: hsl(220 54% 36%);
  --aa-fb-accent-soft: hsl(220 54% 36% / 0.1);
  --aa-fb-accent-line: hsl(220 54% 36% / 0.4);
  --aa-fb-accent-contrast: #ffffff;
  --aa-fb-heading: #171717;
  --aa-fb-body: #3d3d3d;
  --aa-fb-muted: #525252;
  --aa-fb-faint: #6f6f6f;

  --aa-page: var(--page, var(--aa-fb-page));
  --aa-surface: var(--surface, var(--aa-fb-surface));
  --aa-sunken: var(--surface-sunken, var(--aa-fb-sunken));
  --aa-border: var(--border, var(--aa-fb-border));
  --aa-border-strong: var(--border-strong, var(--aa-fb-border-strong));
  --aa-fill-soft: var(--fill-soft, var(--aa-fb-fill-soft));
  --aa-accent: var(--accent, var(--aa-fb-accent));
  --aa-accent-soft: var(--accent-soft, var(--aa-fb-accent-soft));
  --aa-accent-line: var(--accent-line, var(--aa-fb-accent-line));
  --aa-accent-contrast: var(--accent-contrast, var(--aa-fb-accent-contrast));
  --aa-heading: var(--text-heading, var(--aa-fb-heading));
  --aa-body: var(--text-body, var(--aa-fb-body));
  --aa-muted: var(--text-muted, var(--aa-fb-muted));
  --aa-faint: var(--text-faint, var(--aa-fb-faint));
  --aa-font-sans: var(
    --font-sans,
    system-ui,
    -apple-system,
    'Segoe UI',
    Roboto,
    Helvetica,
    Arial,
    sans-serif
  );
  --aa-font-serif: var(--font-serif, Georgia, 'Times New Roman', Times, serif);
  --aa-radius-chip: var(--radius-chip, 0.375rem);
  --aa-radius-control: var(--radius-control, 0.5rem);

  /* Every duration and curve the panel moves with. */
  --aa-dur-fast: 120ms;
  --aa-dur-normal: 220ms;
  --aa-dur-slow: 420ms;
  --aa-ease-out: cubic-bezier(0.2, 0.8, 0.2, 1);
  --aa-ease-in: cubic-bezier(0.4, 0, 1, 1);

  display: inline-flex;
  font-family: var(--aa-font-sans);
}

/* Set by the element from the host page's own background, or by an embedder
   who would rather say so. See groundOf() in index.tsx. */
:host([ground='dark']) {
  --aa-fb-page: #0d0d0d;
  --aa-fb-surface: #141414;
  --aa-fb-sunken: #0a0a0a;
  --aa-fb-border: rgb(255 255 255 / 0.08);
  --aa-fb-border-strong: rgb(255 255 255 / 0.14);
  --aa-fb-fill-soft: rgb(255 255 255 / 0.08);
  --aa-fb-accent: hsl(216 40% 72%);
  --aa-fb-accent-soft: hsl(216 40% 72% / 0.12);
  --aa-fb-accent-line: hsl(216 40% 72% / 0.4);
  --aa-fb-accent-contrast: #0d0d0d;
  --aa-fb-heading: #e5e5e5;
  --aa-fb-body: #d4d4d4;
  --aa-fb-muted: #a3a3a3;
  --aa-fb-faint: #8f8f8f;
  }


*,
*::before,
*::after {
  box-sizing: border-box;
}

/* ---------- the launcher ---------- */

/* Sized to sit inside a search field on the docs site, and to stand on its
   own anywhere else. The host element is what an embedder positions. */
.ask-ai__launcher {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  height: 1.625rem;
  padding: 0 0.625rem;
  border: 0;
  border-radius: 999px;
  background: var(--aa-accent-soft);
  font-family: inherit;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1;
  color: var(--aa-accent);
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 150ms ease;
}

/* The key that opens this, on the chip that opens it. Quiet enough that the
   words still read first. */
.ask-ai__launcher-key {
  font-family: inherit;
  font-size: 0.6875rem;
  font-weight: 500;
  line-height: 1;
  letter-spacing: 0.02em;
  opacity: 0.65;
}

.ask-ai__launcher:hover {
  background: var(--aa-accent-line);
  color: var(--aa-accent-contrast);
}

/* ---------- the assistant panel ---------- */

/* A native modal dialog: the top layer puts it above whatever the host page
   stacks, and Escape, the backdrop and focus containment come with it. */
.ask-ai {
  position: fixed;
  inset: 0 0 0 auto;
  z-index: auto;
  display: none;
  flex-direction: column;
  /* The default, and the floor the grip pushes against. The reader's own
     width, once they have set one, arrives as this variable on the element. */
  width: min(var(--aa-panel-width, 26rem), 100vw);
  max-width: 100vw;
  height: 100%;
  max-height: 100%;
  margin: 0;
  padding: 0;
  border: 0;
  border-left: 1px solid var(--aa-border);
  background: var(--aa-surface);
  color: var(--aa-body);
  font-family: var(--aa-font-sans);
}

.ask-ai[open] {
  display: flex;
}

.ask-ai::backdrop {
  background: rgb(0 0 0 / 0.4);
}

/* In from the right, and out the same way. A browser without @starting-style
   opens and closes instantly, which is fine. */
.ask-ai {
  opacity: 0;
  translate: 1rem 0;
  transition:
    opacity var(--aa-dur-normal) var(--aa-ease-in),
    translate var(--aa-dur-normal) var(--aa-ease-in),
    overlay var(--aa-dur-normal) allow-discrete,
    display var(--aa-dur-normal) allow-discrete;
}

.ask-ai[open] {
  opacity: 1;
  translate: 0 0;
  transition-timing-function: var(--aa-ease-out);
}

@starting-style {
  .ask-ai[open] {
    opacity: 0;
    translate: 1rem 0;
  }
}

.ask-ai::backdrop {
  transition:
    background-color var(--aa-dur-normal) var(--aa-ease-out),
    overlay var(--aa-dur-normal) allow-discrete,
    display var(--aa-dur-normal) allow-discrete;
}

@starting-style {
  .ask-ai[open]::backdrop {
    background-color: rgb(0 0 0 / 0);
  }
}

/* The left edge, as a handle. It sits over the border rather than beside it,
   so the panel loses no room to it, and it is wider than it looks: eight
   pixels is about the smallest edge a pointer reliably lands on, while the
   bar that shows through is two. */
.ask-ai__grip {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 0.5rem;
  height: 100%;
  cursor: ew-resize;
  touch-action: none;
}

.ask-ai__grip-bar {
  width: 2px;
  height: 2.5rem;
  border-radius: 999px;
  background: var(--aa-border);
  opacity: 0;
  transition: opacity 120ms ease, background-color 120ms ease;
}

.ask-ai__grip:hover .ask-ai__grip-bar,
.ask-ai__grip:focus-visible .ask-ai__grip-bar,
.ask-ai__grip--dragging .ask-ai__grip-bar {
  opacity: 1;
  background: var(--aa-accent);
}

.ask-ai__grip:focus-visible {
  outline: 2px solid var(--aa-accent);
  outline-offset: -2px;
}

/* Nothing to drag where the panel is already the whole screen, and no
   pointer to drag it with. */
@media (pointer: coarse), (max-width: 30rem) {
  .ask-ai__grip {
    display: none;
  }
}

.ask-ai__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 0.875rem;
}

/* New and History: a segmented control, the selected one lifted. */
.ask-ai__tabs {
  display: inline-flex;
  padding: 0.1875rem;
  border-radius: 0.625rem;
  background: var(--aa-fill-soft);
}

.ask-ai__tab {
  display: inline-flex;
  align-items: center;
  gap: 0.3125rem;
  padding: 0.375rem 0.75rem;
  border: 0;
  border-radius: 0.4375rem;
  background: none;
  font-family: inherit;
  font-size: 0.78rem;
  font-weight: 500;
  line-height: 1;
  color: var(--aa-muted);
  cursor: pointer;
  transition: background-color var(--aa-dur-fast) var(--aa-ease-out),
    color var(--aa-dur-fast) var(--aa-ease-out);
}

.ask-ai__tab:hover {
  color: var(--aa-heading);
}

/* The plus on New says it starts a conversation rather than showing one. */
.ask-ai__tab svg {
  width: 0.8125rem;
  height: 0.8125rem;
  margin-left: -0.125rem;
}

.ask-ai__tab[aria-pressed='true'] {
  background: var(--aa-surface);
  color: var(--aa-heading);
  box-shadow: 0 1px 2px rgb(0 0 0 / 0.08), 0 0 0 1px var(--aa-border);
}

.ask-ai__tab:focus-visible {
  outline: 2px solid var(--aa-accent);
  outline-offset: 1px;
}

/* Pushes the controls to the right edge whether or not the reset chip and
   the mock badge are there. */
.ask-ai__grow {
  flex: 1 1 auto;
}

.ask-ai__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  padding: 0;
  border: 0;
  border-radius: var(--aa-radius-chip);
  background: none;
  color: var(--aa-faint);
  cursor: pointer;
}

.ask-ai__close:hover {
  color: var(--aa-heading);
}

/* The panel answers with a constant. The badge is how a reader knows that
   before they read the answer, not after. */
.ask-ai__badge {
  padding: 0.125rem 0.375rem;
  border-radius: var(--aa-radius-chip);
  background: var(--aa-fill-soft);
  font-family: var(--aa-font-sans);
  font-size: 0.6875rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--aa-faint);
}

.ask-ai__thread {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: 0.75rem;
  overflow-y: auto;
  padding: 1rem;
}

.ask-ai__turn {
  max-width: 90%;
  margin: 0;
  padding: 0.625rem 0.75rem;
  border-radius: var(--aa-radius-control);
  font-size: 0.875rem;
  line-height: 1.6;
}

.ask-ai__turn--assistant {
  position: relative;
  padding-bottom: 1.5rem;
  background: var(--aa-sunken);
  color: var(--aa-body);
}

/* Tinted like the launcher chip that opened the panel. */
.ask-ai__turn--you {
  align-self: flex-end;
  background: var(--aa-accent-soft);
  color: var(--aa-accent);
}

/* The assistant writes markdown; these keep its blocks at chat scale.
   Margins collapse to nothing at the bubble's edges so the first and last
   block sit flush with the padding. */
.ask-ai__turn--assistant p,
.ask-ai__turn--assistant ul,
.ask-ai__turn--assistant ol {
  margin: 0.5rem 0;
}

.ask-ai__turn--assistant > p:first-child,
.ask-ai__turn--assistant > ul:first-child,
.ask-ai__turn--assistant > ol:first-child {
  margin-top: 0;
}

.ask-ai__turn--assistant > p:last-child,
.ask-ai__turn--assistant > ul:last-child,
.ask-ai__turn--assistant > ol:last-child {
  margin-bottom: 0;
}

.ask-ai__turn--assistant ul,
.ask-ai__turn--assistant ol {
  padding-left: 1.25rem;
}

.ask-ai__turn--assistant ul {
  list-style: disc outside;
}

.ask-ai__turn--assistant ol {
  list-style: decimal outside;
}

.ask-ai__turn--assistant li::marker {
  color: var(--aa-faint);
}

.ask-ai__turn--assistant li {
  margin: 0.25rem 0;
}

.ask-ai__turn--assistant a {
  color: var(--aa-accent);
}

.ask-ai__turn--assistant code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.8125rem;
  background: var(--aa-surface);
  border: 1px solid var(--aa-border);
  border-radius: 4px;
  padding: 0.0625rem 0.3125rem;
}

/* Fenced code, for the JSON and curl an API assistant answers with. It scrolls
   inside its own box so a long line never widens the panel. */
/* A diagram out of the documentation, drawn rather than printed.

   mermaid gives the svg width:100% and an inline max-width at its natural
   size, which is the behaviour to keep: a small diagram is not stretched, and
   a wide one fits the panel rather than running off it. Where that leaves the
   labels too small to read, the panel's own left edge is the answer, since a
   reader can pull it as wide as they need. */
.ask-ai__diagram {
  margin: 0.625rem 0;
  padding: 0.625rem;
  overflow-x: auto;
  border: 1px solid var(--aa-border);
  border-radius: var(--aa-radius-control);
  background: var(--aa-page);
}

.ask-ai__diagram svg {
  display: block;
  height: auto;
}

.ask-ai__code {
  position: relative;
  margin: 0.625rem 0;
}

.ask-ai__code pre {
  margin: 0;
  padding: 0.625rem 2.25rem 0.625rem 0.75rem;
  overflow-x: auto;
  border: 1px solid var(--aa-border);
  border-radius: var(--aa-radius-control);
  background: var(--aa-page);
}

.ask-ai__code code {
  padding: 0;
  border: 0;
  background: none;
  font-size: 0.75rem;
  line-height: 1.6;
  color: var(--aa-heading);
  white-space: pre;
}

.ask-ai__code-copy,
.ask-ai__turn-copy {
  position: absolute;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  padding: 0;
  border: 1px solid var(--aa-border);
  border-radius: var(--aa-radius-chip);
  background: var(--aa-surface);
  color: var(--aa-faint);
  cursor: pointer;
  opacity: 0;
  transition: opacity 120ms ease, color 120ms ease;
}

.ask-ai__code-copy {
  top: 0.375rem;
  right: 0.375rem;
}

/* The answer's own copy control sits at its bottom edge, out of the way of
   the first line, and appears on hover so a resting thread stays quiet. */
.ask-ai__turn-copy {
  right: 0.375rem;
  bottom: 0.375rem;
}

.ask-ai__code:hover .ask-ai__code-copy,
.ask-ai__turn--assistant:hover .ask-ai__turn-copy,
.ask-ai__code-copy:focus-visible,
.ask-ai__turn-copy:focus-visible {
  opacity: 1;
}

.ask-ai__code-copy:hover,
.ask-ai__turn-copy:hover {
  color: var(--aa-heading);
}

/* One message and what goes with it. An answer's wrapper is invisible to
   the layout; a question's stacks the bubble over its actions row, both on
   the right. */
.ask-ai__unit--assistant {
  display: contents;
}

.ask-ai__unit--you {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
}

/* Under the reader's question, as Claude's chat has it: when it was asked,
   then retry, edit and copy, shown while the pointer is over the question. */
.ask-ai__ask-actions {
  display: flex;
  align-items: center;
  gap: 0.125rem;
  opacity: 0;
  transition: opacity 120ms ease;
}

.ask-ai__unit--you:hover .ask-ai__ask-actions,
.ask-ai__ask-actions:focus-within {
  opacity: 1;
}

/* No hover on a touch screen, so the row stays where a thumb can find it. */
@media (hover: none) {
  .ask-ai__turn-copy,
  .ask-ai__ask-actions {
    opacity: 1;
  }
}

.ask-ai__ask-time {
  margin-right: 0.25rem;
  font-size: 0.75rem;
  color: var(--aa-faint);
}

.ask-ai__ask-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.625rem;
  height: 1.625rem;
  padding: 0;
  border: 0;
  border-radius: var(--aa-radius-chip);
  background: transparent;
  color: var(--aa-faint);
  cursor: pointer;
}

.ask-ai__ask-action:hover {
  background: var(--aa-sunken);
  color: var(--aa-heading);
}

/* A question being rewritten takes the bubble's full width, so the field is
   wide enough to edit in. */
.ask-ai__turn--you:has(.ask-ai__edit) {
  width: 90%;
  box-sizing: border-box;
}

.ask-ai__edit {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.ask-ai__edit-field {
  width: 100%;
  box-sizing: border-box;
  padding: 0.375rem 0.5rem;
  border: 1px solid var(--aa-border);
  border-radius: var(--aa-radius-chip);
  background: var(--aa-surface);
  color: var(--aa-body);
  font: inherit;
  resize: vertical;
}

.ask-ai__edit-field:focus {
  outline: 2px solid var(--aa-accent);
  outline-offset: -1px;
}

.ask-ai__edit-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.375rem;
}

.ask-ai__edit-cancel,
.ask-ai__edit-send {
  padding: 0.25rem 0.625rem;
  border: 1px solid var(--aa-border);
  border-radius: var(--aa-radius-chip);
  background: var(--aa-surface);
  color: var(--aa-body);
  font: inherit;
  font-size: 0.8125rem;
  cursor: pointer;
}

.ask-ai__edit-send {
  border-color: var(--aa-accent);
  background: var(--aa-accent);
  color: var(--aa-surface);
}

.ask-ai__edit-send:disabled {
  opacity: 0.5;
  cursor: default;
}

/* Openers for the empty state. Full width because they are sentences, and a
   reader picks one by reading it rather than by scanning a row. */
/* Citation chips, one per source, under the answer text they support. */
/* Sources: one line, "Used 5 sources", that opens to the list, as Stripe's
   assistant does. A row of chips took half the panel under every answer
   before the reader had asked where the answer came from. */
.ask-ai__sources {
  margin-top: 0.625rem;
}

.ask-ai__sources-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  list-style: none;
  cursor: pointer;
  border-radius: 4px;
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--aa-accent);
}

/* Safari draws its own disclosure triangle unless told not to. */
.ask-ai__sources-toggle::-webkit-details-marker {
  display: none;
}

.ask-ai__sources-toggle svg {
  flex: none;
  transition: transform 150ms ease;
}

.ask-ai__sources[open] .ask-ai__sources-toggle svg {
  transform: rotate(90deg);
}

/* Scoped under .ask-ai__sources to outrank \`.ask-ai__turn--assistant ul\`
   and \`li\`, which dress the lists inside an answer with bullets and margins. */
.ask-ai__sources .ask-ai__source-list {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  margin: 0.375rem 0 0;
  padding: 0;
  list-style: none;
}

.ask-ai__sources .ask-ai__source-list > li {
  margin: 0;
}

.ask-ai__source-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0;
  border-radius: 4px;
  font-size: 0.8125rem;
  color: var(--aa-accent);
  text-decoration: none;
}

.ask-ai__source-link svg {
  flex: none;
}

/* A citation is a pointer, not a sentence: a long atom title is cut to one
   line rather than wrapping. */
.ask-ai__source-title {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ask-ai__source-link:hover .ask-ai__source-title {
  text-decoration: underline;
  text-underline-offset: 2px;
}

.ask-ai__sources-toggle:focus-visible,
.ask-ai__source-link:focus-visible {
  outline: 2px solid var(--aa-accent);
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  .ask-ai__sources-toggle svg {
    transition: none;
  }
}

/* The install flow's quick replies. A row rather than the openers' column:
   these are one or two words each, and a reader picks one by scanning. */
.ask-ai__choices {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-top: 0.625rem;
}

.ask-ai__choice {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.625rem;
  border: 1px solid var(--aa-border);
  border-radius: var(--aa-radius-control);
  background: var(--aa-surface);
  font-family: inherit;
  font-size: 0.8125rem;
  line-height: 1.4;
  color: var(--aa-body);
  cursor: pointer;
  transition: border-color 120ms ease, color 120ms ease;
}

.ask-ai__choice:hover:not(:disabled) {
  border-color: var(--aa-border-strong);
  color: var(--aa-heading);
}

.ask-ai__choice:disabled {
  opacity: 0.5;
  cursor: default;
}

.ask-ai__choice svg {
  width: 0.875rem;
  height: 0.875rem;
}

/* Naming an agent the four chips do not cover. */
.ask-ai__naming {
  display: flex;
  gap: 0.375rem;
  width: 100%;
}

.ask-ai__naming-field {
  flex: 1 1 auto;
  min-width: 0;
  padding: 0.25rem 0.625rem;
  border: 1px solid var(--aa-border);
  border-radius: var(--aa-radius-control);
  background: var(--aa-surface);
  font-family: inherit;
  font-size: 0.8125rem;
  line-height: 1.4;
  color: var(--aa-heading);
}

.ask-ai__naming-field:focus {
  outline: none;
  border-color: var(--aa-border-strong);
}

/* The standing offer under every finished answer. It sits below the sources
   and reads as the next thing to do, so it takes the accent rather than the
   chip's neutral border, and stays a text sized control: a full width button
   under a two line answer would outweigh the answer. */
.ask-ai__install-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  margin-top: 0.625rem;
  padding: 0.25rem 0.625rem;
  border: 1px solid var(--aa-accent-line);
  border-radius: var(--aa-radius-control);
  background: var(--aa-accent-soft);
  color: var(--aa-accent);
  font: inherit;
  font-size: 0.75rem;
  line-height: 1.4;
  cursor: pointer;
}

.ask-ai__install-cta:hover {
  border-color: var(--aa-accent);
  text-decoration: none;
}

.ask-ai__install-cta svg {
  width: 0.875rem;
  height: 0.875rem;
}

/* The caret at the end of an answer while it is still arriving. It marks the
   live edge of the text, which is what tells a reader that a pause is the
   model thinking rather than the answer having ended. Only after a paragraph:
   a block of code ends at its own boundary and does not need one. */
.ask-ai__turn--streaming > p:last-child::after {
  content: '';
  display: inline-block;
  width: 0.45em;
  height: 1em;
  margin-left: 0.1em;
  vertical-align: -0.13em;
  border-radius: 1px;
  background: var(--aa-accent);
  animation: ask-ai-caret 1s steps(2, start) infinite;
}

@keyframes ask-ai-caret {
  0%,
  49.9% {
    opacity: 1;
  }
  50%,
  100% {
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .ask-ai__turn--streaming > p:last-child::after {
    animation: none;
    opacity: 0.5;
  }
}

/* A slow pulse beside the activity line: the wait before the first token can
   run to a few seconds, and a still panel reads as a broken one. */
.ask-ai__pulse {
  display: inline-block;
  width: 0.375rem;
  height: 0.375rem;
  margin-right: 0.5rem;
  border-radius: 999px;
  background: var(--aa-accent);
  animation: ask-ai-pulse 1.4s ease-in-out infinite;
}

@keyframes ask-ai-pulse {
  0%,
  100% {
    opacity: 0.25;
  }
  50% {
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .ask-ai__pulse {
    animation: none;
    opacity: 0.6;
  }
}

/* What the model is doing while an answer streams in, shown until the first
   text delta arrives and the turn it belongs to stops being empty. */
.ask-ai__activity {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  padding: 0.625rem 0.75rem;
  font-size: 0.8125rem;
  font-style: italic;
  color: var(--aa-faint);
}

/* The orb keeps its size: as a flex item beside a long line it was shrunk to
   an oval while the answer was being prepared. */
.ask-ai__activity > [role='img'] {
  flex: none;
}

/* The foot: the chat bar card, and the commands under it. */
.ask-ai__foot {
  /* Above the thread, so a tip rising out of the chat bar (the context
     window's) is drawn over the conversation rather than under it. */
  position: relative;
  z-index: 2;
  display: grid;
  gap: 0.625rem;
  padding: 0.5rem 0.875rem 0.875rem;
}

.ask-ai__composer {
  display: grid;
  gap: 0.375rem;
  padding: 0.5rem;
  border: 1px solid var(--aa-border-strong);
  border-radius: 1rem;
  background: var(--aa-surface);
  box-shadow: 0 1px 2px rgb(0 0 0 / 0.04), 0 8px 24px -12px rgb(0 0 0 / 0.14);
  transition: border-color var(--aa-dur-fast) var(--aa-ease-out);
}

.ask-ai__composer:focus-within {
  border-color: var(--aa-accent-line);
}

.ask-ai__bar {
  display: flex;
  align-items: flex-end;
  gap: 0.375rem;
}

.ask-ai__input {
  flex: 1 1 auto;
  min-width: 0;
  min-height: 2rem;
  max-height: 10rem;
  padding: 0.375rem 0.25rem;
  resize: none;
  overflow-y: hidden; /* the composer turns this on when it overflows */
  line-height: 1.45;
  border: 0;
  background: none;
  font-family: inherit;
  font-size: 0.875rem;
  color: var(--aa-heading);
}

.ask-ai__input:focus {
  outline: none;
}

.ask-ai__add,
.ask-ai__send {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  padding: 0;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color var(--aa-dur-fast) var(--aa-ease-out),
    opacity var(--aa-dur-fast) var(--aa-ease-out);
}

.ask-ai__add {
  border: 1px solid var(--aa-border);
  background: none;
  color: var(--aa-muted);
}

.ask-ai__add:hover:not(:disabled),
.ask-ai__add[aria-expanded='true'] {
  background: var(--aa-fill-soft);
  color: var(--aa-heading);
}

.ask-ai__add:disabled {
  cursor: default;
  opacity: 0.5;
}

.ask-ai__send {
  border: 0;
  background: var(--aa-accent);
  color: var(--aa-accent-contrast);
}

.ask-ai__send:disabled {
  cursor: default;
  opacity: 0.35;
}

.ask-ai__send--stop {
  background: var(--aa-fill-soft);
  color: var(--aa-heading);
}

.ask-ai__add:focus-visible,
.ask-ai__send:focus-visible {
  outline: 2px solid var(--aa-accent);
  outline-offset: 2px;
}

/* What goes with the question, as pills on top of the bar. */
.ask-ai__context {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

.ask-ai__chip {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  max-width: 100%;
  min-width: 0;
  padding: 0.3125rem 0.3125rem 0.3125rem 0.5rem;
  border-radius: 0.5rem;
  background: var(--aa-fill-soft);
  font-size: 0.75rem;
  color: var(--aa-heading);
  animation: ask-ai-rise var(--aa-dur-fast) var(--aa-ease-out);
}

.ask-ai__chip svg {
  flex: 0 0 auto;
  color: var(--aa-muted);
}

.ask-ai__chip-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ask-ai__chip-meta {
  flex: 0 0 auto;
  color: var(--aa-faint);
}

.ask-ai__chip--pending {
  padding-right: 0.5rem;
  color: var(--aa-muted);
}

.ask-ai__chip--failed {
  color: var(--aa-muted);
}

.ask-ai__chip-remove {
  flex: 0 0 auto;
  display: inline-flex;
  padding: 0.125rem;
  border: 0;
  border-radius: 0.3125rem;
  background: none;
  color: var(--aa-faint);
  cursor: pointer;
}

.ask-ai__chip-remove:hover {
  background: var(--aa-fill-soft);
  color: var(--aa-heading);
}

.ask-ai__context-error {
  font-size: 0.75rem;
  color: var(--aa-heading);
}

.ask-ai__context-note {
  margin: 0;
  font-size: 0.6875rem;
  line-height: 1.4;
  color: var(--aa-faint);
}

/* The add menu and the page search: a popover above the add button. */
.ask-ai__add-wrap {
  position: relative;
  flex: 0 0 auto;
}

.ask-ai__menu {
  position: absolute;
  bottom: calc(100% + 0.625rem);
  left: -0.5rem;
  z-index: 1;
  display: grid;
  min-width: 13rem;
  padding: 0.3125rem;
  border: 1px solid var(--aa-border);
  border-radius: 0.75rem;
  background: var(--aa-surface);
  box-shadow: 0 12px 32px -12px rgb(0 0 0 / 0.25), 0 2px 6px rgb(0 0 0 / 0.06);
  animation: ask-ai-rise var(--aa-dur-fast) var(--aa-ease-out);
}

.ask-ai__menu-item {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.5rem 0.625rem;
  border: 0;
  border-radius: 0.5rem;
  background: none;
  font-family: inherit;
  font-size: 0.8125rem;
  color: var(--aa-heading);
  text-align: left;
  cursor: pointer;
}

.ask-ai__menu-item svg {
  color: var(--aa-muted);
}

.ask-ai__menu-item:hover,
.ask-ai__menu-item:focus-visible {
  outline: none;
  background: var(--aa-fill-soft);
}

.ask-ai__menu--pages {
  width: min(22rem, calc(100vw - 3rem));
  padding: 0;
}

.ask-ai__search {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.625rem;
  border-bottom: 1px solid var(--aa-border);
  color: var(--aa-faint);
}

.ask-ai__search-back {
  display: inline-flex;
  padding: 0.1875rem;
  border: 0;
  border-radius: 0.375rem;
  background: none;
  color: var(--aa-muted);
  cursor: pointer;
}

.ask-ai__search-back:hover {
  background: var(--aa-fill-soft);
}

.ask-ai__search-field {
  flex: 1 1 auto;
  min-width: 0;
  padding: 0.25rem 0;
  border: 0;
  outline: none;
  background: none;
  font-family: inherit;
  font-size: 0.8125rem;
  color: var(--aa-heading);
}

.ask-ai__hits {
  max-height: 16rem;
  margin: 0;
  padding: 0.3125rem;
  overflow-y: auto;
  list-style: none;
}

.ask-ai__hit {
  display: grid;
  width: 100%;
  gap: 0.0625rem;
  padding: 0.4375rem 0.5rem;
  border: 0;
  border-radius: 0.5rem;
  background: none;
  font-family: inherit;
  text-align: left;
  cursor: pointer;
}

.ask-ai__hit--active {
  background: var(--aa-fill-soft);
}

.ask-ai__hit-title {
  font-size: 0.8125rem;
  color: var(--aa-heading);
}

.ask-ai__hit-path {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.6875rem;
  color: var(--aa-faint);
}

.ask-ai__search-status {
  margin: 0;
  padding: 0.625rem 0.75rem;
  font-size: 0.75rem;
  color: var(--aa-faint);
}

/* The skills menu: a name and what it is for, on one row. */
.ask-ai__menu-item--skill {
  justify-content: space-between;
}

.ask-ai__menu-item--skill[aria-checked='true'] {
  background: var(--aa-fill-soft);
}

.ask-ai__menu-hint {
  font-size: 0.75rem;
  color: var(--aa-faint);
  white-space: nowrap;
}

.ask-ai__slash {
  font-family: var(--aa-font-mono, ui-monospace, monospace);
  color: var(--aa-heading);
}

/* The way back to the latest answer: floats over the end of the thread and
   takes no room of its own. */
.ask-ai__to-end-wrap {
  position: relative;
  height: 0;
}

.ask-ai__to-end {
  position: absolute;
  bottom: 0.5rem;
  left: 50%;
  display: grid;
  place-items: center;
  width: 2rem;
  height: 2rem;
  transform: translateX(-50%);
  border: 1px solid var(--aa-border);
  border-radius: 999px;
  background: var(--aa-surface);
  box-shadow: 0 4px 12px -4px rgb(0 0 0 / 0.25);
  color: var(--aa-muted);
  cursor: pointer;
}

.ask-ai__to-end:hover {
  color: var(--aa-heading);
}

.ask-ai__to-end:focus-visible {
  outline: 2px solid var(--aa-accent);
  outline-offset: 2px;
}

.ask-ai__picker {
  display: none;
}

/* The file named under the question it went with. It sits inside the
   reader's own bubble, which is accent tinted, so it takes that bubble's
   ink at slightly less weight rather than the page's muted grey. */
.ask-ai__turn-file {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.375rem;
  color: currentColor;
  opacity: 0.85;
  font-size: 0.6875rem;
}

/* The welcome: the orb, the greeting, and the openers, in the middle of an
   empty conversation. The greeting and pills rise in after the orb. */
.ask-ai__welcome {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.125rem;
  padding: 1.5rem 0.5rem;
  text-align: center;
}

.ask-ai__welcome .ask-ai__orb {
  animation: ask-ai-arrive var(--aa-dur-slow) var(--aa-ease-out) both;
}

.ask-ai__greeting {
  margin: 0.25rem 0 0;
  font-family: var(--aa-font-serif);
  font-size: 1.5rem;
  font-weight: 400;
  line-height: 1.25;
  letter-spacing: -0.01em;
  color: var(--aa-heading);
  animation: ask-ai-rise var(--aa-dur-slow) var(--aa-ease-out) 250ms both;
}

.ask-ai__welcome-note {
  max-width: 20rem;
  margin: -0.25rem 0 0;
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--aa-muted);
  animation: ask-ai-rise var(--aa-dur-slow) var(--aa-ease-out) 320ms both;
}

.ask-ai__welcome-note a {
  color: var(--aa-accent);
}

.ask-ai__pills {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  max-width: 22rem;
}

.ask-ai__pill {
  padding: 0.5rem 0.8125rem;
  border: 1px solid var(--aa-border);
  border-radius: 999px;
  background: var(--aa-surface);
  font-family: inherit;
  font-size: 0.8125rem;
  line-height: 1;
  color: var(--aa-heading);
  cursor: pointer;
  animation: ask-ai-rise var(--aa-dur-slow) var(--aa-ease-out) both;
  transition: border-color var(--aa-dur-fast) var(--aa-ease-out),
    background-color var(--aa-dur-fast) var(--aa-ease-out);
}

.ask-ai__pill:hover {
  border-color: var(--aa-border-strong);
  background: var(--aa-page);
}

.ask-ai__pill:focus-visible {
  outline: 2px solid var(--aa-accent);
  outline-offset: 2px;
}

/* Which skill section an answer drew on, above it. */
.ask-ai__skill {
  margin: 0 0 0.375rem;
  font-size: 0.6875rem;
  font-weight: 500;
  letter-spacing: 0.02em;
  color: var(--aa-accent);
}

.ask-ai__skill a {
  color: inherit;
  text-decoration: none;
}

.ask-ai__skill a:hover {
  text-decoration: underline;
}

.ask-ai__skill--missing {
  font-weight: 400;
  color: var(--aa-faint);
}

/* History: the whole panel body, like Claude's sidebar list. */
.ask-ai__history {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  min-height: 0;
  padding: 0.25rem 0.5rem 0.75rem;
}

.ask-ai__history-label {
  margin: 0.5rem 0.625rem 0.375rem;
  font-size: 0.6875rem;
  font-weight: 500;
  color: var(--aa-faint);
}

.ask-ai__history-list {
  flex: 1 1 auto;
  margin: 0;
  padding: 0;
  overflow-y: auto;
  list-style: none;
}

.ask-ai__history-row {
  display: flex;
  align-items: center;
  border-radius: 0.5rem;
  animation: ask-ai-rise var(--aa-dur-fast) var(--aa-ease-out) both;
}

.ask-ai__history-row:hover,
.ask-ai__history-row:focus-within,
.ask-ai__history-row--current {
  background: var(--aa-fill-soft);
}

.ask-ai__history-open {
  flex: 1 1 auto;
  min-width: 0;
  padding: 0.5rem 0.625rem;
  overflow: hidden;
  border: 0;
  background: none;
  font-family: inherit;
  font-size: 0.8125rem;
  color: var(--aa-body);
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
}

.ask-ai__history-row--current .ask-ai__history-open {
  color: var(--aa-heading);
}

.ask-ai__history-open:focus-visible {
  outline: none;
}

.ask-ai__history-forget {
  flex: 0 0 auto;
  display: inline-flex;
  margin-right: 0.25rem;
  padding: 0.3125rem;
  border: 0;
  border-radius: 0.375rem;
  background: none;
  color: var(--aa-faint);
  opacity: 0;
  cursor: pointer;
}

.ask-ai__history-row:hover .ask-ai__history-forget,
.ask-ai__history-row:focus-within .ask-ai__history-forget {
  opacity: 1;
}

.ask-ai__history-forget:hover {
  color: var(--aa-heading);
}

@media (hover: none) {
  .ask-ai__history-forget {
    opacity: 1;
  }
}

.ask-ai__history-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin: 0.5rem 0.625rem 0;
  font-size: 0.6875rem;
  color: var(--aa-faint);
}

.ask-ai__history-clear {
  padding: 0;
  border: 0;
  background: none;
  font-family: inherit;
  font-size: inherit;
  color: var(--aa-muted);
  text-decoration: underline;
  cursor: pointer;
}

.ask-ai__history-clear:hover {
  color: var(--aa-heading);
}

.ask-ai__history--empty {
  align-items: center;
  justify-content: center;
  text-align: center;
}

.ask-ai__history-none {
  margin: 0;
  font-size: 0.875rem;
  color: var(--aa-heading);
}

.ask-ai__history-note {
  margin: 0.25rem 0 0;
  font-size: 0.75rem;
  color: var(--aa-faint);
}

@keyframes ask-ai-rise {
  from {
    opacity: 0;
    transform: translateY(0.375rem);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes ask-ai-arrive {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

/* Less motion asked for: nothing slides, fades or rises. The orb holds a
   still frame on its own (see orb/plasma-orb.tsx). */
@media (prefers-reduced-motion: reduce) {
  .ask-ai,
  .ask-ai::backdrop,
  .ask-ai *,
  .ask-ai *::before,
  .ask-ai *::after {
    animation: none !important;
    transition: none !important;
  }
}

/* The context window: a ring beside the send button, filling as the
   conversation grows, with the numbers in a tip on hover or focus. */
.ask-ai__ring {
  position: relative;
  flex: 0 0 auto;
  display: inline-flex;
}

.ask-ai__ring-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  cursor: default;
}

.ask-ai__ring-mark:focus-visible {
  outline: 2px solid var(--aa-accent);
  outline-offset: 2px;
}

.ask-ai__ring svg {
  transform: rotate(-90deg);
}

.ask-ai__ring-track,
.ask-ai__ring-fill {
  fill: none;
  stroke-width: 2.5;
}

.ask-ai__ring-track {
  stroke: var(--aa-fill-soft);
}

.ask-ai__ring-fill {
  stroke: var(--aa-faint);
  stroke-linecap: round;
  transition: stroke-dashoffset 250ms ease-out;
}

.ask-ai__ring--full .ask-ai__ring-fill {
  stroke: #c07a12;
}

.ask-ai__ring-tip {
  position: absolute;
  right: 0;
  bottom: calc(100% + 0.5rem);
  z-index: 3;
  display: grid;
  gap: 0.25rem;
  width: 15rem;
  padding: 0.5rem 0.625rem;
  border: 1px solid var(--aa-border-strong);
  border-radius: 0.5rem;
  background: var(--aa-surface);
  box-shadow: 0 8px 24px -12px rgb(0 0 0 / 0.3);
  font-size: 0.75rem;
  line-height: 1.4;
  color: var(--aa-faint);
  opacity: 0;
  visibility: hidden;
  transform: translateY(2px);
  transition: opacity 120ms ease-out, transform 120ms ease-out, visibility 0s linear 120ms;
  pointer-events: none;
}

.ask-ai__ring-tip strong {
  color: var(--aa-heading);
  font-weight: 600;
}

.ask-ai__ring:hover .ask-ai__ring-tip,
.ask-ai__ring-mark:focus-visible + .ask-ai__ring-tip {
  opacity: 1;
  visibility: visible;
  transform: none;
  transition-delay: 0s;
}

/* The disclaimer under the chat bar, quiet and always there. */
.ask-ai__disclaimer {
  margin: 0.125rem 0 0;
  font-size: 0.6875rem;
  line-height: 1.4;
  text-align: center;
  color: var(--aa-faint);
}

/* The line above the oldest message a question still carries. */
.ask-ai__cut {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  margin: 0.25rem 0;
  font-size: 0.6875rem;
  color: var(--aa-faint);
}

.ask-ai__cut::before,
.ask-ai__cut::after {
  content: '';
  flex: 1 1 auto;
  height: 1px;
  background: var(--aa-border-strong);
}

.ask-ai__cut span {
  flex: 0 1 auto;
  text-align: center;
}

/* An endpoint path the server paired with its reference page. It stays code
   to the eye; the underline on hover is what says it goes somewhere. */
.ask-ai__code-link {
  color: inherit;
  text-decoration: none;
}
.ask-ai__code-link code {
  border-bottom: 1px dotted currentColor;
}
.ask-ai__code-link:hover code {
  border-bottom-style: solid;
}

/* The next question, offered in the box. The field carries the grey text
   over the empty textarea, cut to one line. */
.ask-ai__field {
  position: relative;
  display: flex;
  flex: 1 1 auto;
  min-width: 0;
}

.ask-ai__ghost {
  position: absolute;
  inset: 0.375rem 0.25rem auto 0.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.875rem;
  line-height: 1.45;
  color: var(--aa-faint);
  pointer-events: none;
}

.ask-ai__tabkey {
  align-self: center;
  padding: 0.0625rem 0.375rem;
  border: 1px solid var(--aa-border-strong);
  border-radius: 0.375rem;
  background: none;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.6875rem;
  line-height: 1.5;
  color: var(--aa-muted);
  cursor: pointer;
}

.ask-ai__tabkey:hover {
  color: var(--aa-heading);
}

.ask-ai__tabkey:focus-visible {
  outline: 2px solid var(--aa-accent);
  outline-offset: 2px;
}

/* The other next questions, above the bar while the empty box has focus. */
.ask-ai__next {
  display: grid;
  gap: 0.0625rem;
  margin: 0 0 0.25rem;
  padding: 0 0 0.25rem;
  border-bottom: 1px solid var(--aa-border);
  list-style: none;
}

.ask-ai__next-label {
  padding: 0.125rem 0.5rem 0.25rem;
  font-size: 0.6875rem;
  color: var(--aa-faint);
}

.ask-ai__next-item {
  display: block;
  width: 100%;
  overflow: hidden;
  padding: 0.375rem 0.5rem;
  border: 0;
  border-radius: 0.5rem;
  background: none;
  font-family: inherit;
  font-size: 0.8125rem;
  line-height: 1.4;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--aa-muted);
  cursor: pointer;
}

.ask-ai__next-item--active {
  background: var(--aa-fill-soft);
  color: var(--aa-heading);
}

.ask-ai__sr {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
`;var Qn=()=>`${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`,Go=".json,.txt,.log,.csv,.xml,.yaml,.yml,.md,.har,.pdf,.png,.jpg,.jpeg,.webp",Ar=2e4,qo=256*1024,Xo=8*1024*1024;async function Yo(e){let t=await import(`${ie}pdf.min.mjs`);t.GlobalWorkerOptions.workerSrc=`${ie}pdf.worker.min.mjs`;let r=t.getDocument({data:await e.arrayBuffer()}),a=await r.promise,n=[];for(let i=1;i<=a.numPages;i+=1){let s=await(await a.getPage(i)).getTextContent();if(n.push(s.items.map(l=>l.str??"").join(" ").replace(/[ \t]+/g," ").trim()),n.join(`

`).length>Ar)break}return await a.cleanup?.(),await r.destroy(),n.join(`

`).trim()}async function Ko(e,t){t("Loading the reader, once per browser."),await _t(`${ie}tesseract.min.js`);let r=window.Tesseract;t("Reading the text out of that image.");let a=await r.createWorker("eng",1,{workerPath:`${ie}worker.min.js`,corePath:ie,langPath:`${ie}lang`,cacheMethod:"none"});try{let{data:n}=await a.recognize(e);return(n.text??"").replace(/[ \t]+/g," ").trim()}finally{await a.terminate()}}var Zn=24e3,ei=`

[This page was cut here to fit. Say so if the answer needs the rest of it.]`;function Jo(e){return e.length<=Zn?e:e.slice(0,Zn-ei.length)+ei}var Qo="This panel is a mock. No assistant is connected here yet, so nothing in it can answer that. The support page lists the channels a human reads.";function ti(e,t){e(r=>{let a=r[r.length-1];return[...r.slice(0,-1),{...a,text:a.text+t}]})}function Zo(e){if(e.some(t=>t.install))return-1;for(let t=e.length-1;t>0;t-=1){let r=e[t];if(r.from!=="assistant"||r.text==="")continue;let a=e[t-1];return a?.from==="you"&&Ia(a.text)?t:-1}return-1}function es(e,t,r,a){e(n=>{let i=n[n.length-1];return[...n.slice(0,-1),{...i,sources:t,links:r??i.links,suggestions:a??i.suggestions}]})}var wr=320,ri=960,Sr="abdm-ask-ai-width",Er=!1;function ts({dialog:e}){let[t,r]=T(!1);return R(()=>{let n=Number(localStorage.getItem(Sr));n>=wr&&e.current&&e.current.style.setProperty("--aa-panel-width",`${n}px`)},[]),o("div",{class:`ask-ai__grip${t?" ask-ai__grip--dragging":""}`,role:"separator","aria-orientation":"vertical","aria-label":"Resize the panel",tabIndex:0,onPointerDown:n=>{let i=e.current;if(!i)return;n.preventDefault(),Er=!0,r(!0),n.target.setPointerCapture(n.pointerId);let s=f=>{let c=window.innerWidth-f.clientX,p=Math.min(Math.max(c,wr),Math.min(ri,window.innerWidth));i.style.setProperty("--aa-panel-width",`${Math.round(p)}px`)},l=()=>{setTimeout(()=>{Er=!1},0),r(!1),window.removeEventListener("pointermove",s),window.removeEventListener("pointerup",l),window.removeEventListener("pointercancel",l);let f=i.style.getPropertyValue("--aa-panel-width");f&&localStorage.setItem(Sr,String(parseInt(f,10)))};window.addEventListener("pointermove",s),window.addEventListener("pointerup",l),window.addEventListener("pointercancel",l)},onKeyDown:n=>{let i=n.key==="ArrowLeft"?32:n.key==="ArrowRight"?-32:0;if(!i||!e.current)return;n.preventDefault();let s=e.current.getBoundingClientRect().width,l=Math.min(Math.max(s+i,wr),ri);e.current.style.setProperty("--aa-panel-width",`${l}px`),localStorage.setItem(Sr,String(l))},children:o("span",{class:"ask-ai__grip-bar","aria-hidden":"true"})})}function rs({apiBase:e,docsOrigin:t,mcpUrl:r,pluginRepo:a,open:n,onClose:i,page:s,onDetach:l,onAttach:f,question:c,send:p,starters:_,keepHistory:d,gateway:h,supportUrl:k}){let[v,b]=T([]),x=s?wa(s.markdown).slice(0,4):[],w=x.length?x.map(u=>({label:u,prompt:u})):_,[L,P]=T(""),[O,C]=T(null),[N,I]=T(null),[J,g]=T(null),[E,q]=T("idle"),[et,de]=T(null),[B,M]=T(""),[V,Q]=T(!1),[oe,re]=T(null),[fe,Ce]=T(""),[tt,Pe]=T(Date.now());R(()=>{if(!n)return;Pe(Date.now());let u=window.setInterval(()=>Pe(Date.now()),3e4);return()=>window.clearInterval(u)},[n]);let[It,j]=T([]),[X,Z]=T("chat"),[pe,Ie]=T(null),[Oe,se]=T("closed"),[rt,Le]=T(null),ge=A(Qn()),Rr=A(null),at=A(null),nt=A(null),Ue=A(null),is=A(null),ve=A(null),ae=E!=="idle",ai=s!==null&&s.markdown!=="",ni=Yn(v),ii=Kn(v),Mr=v[v.length-1],oi=!ae&&Mr?.from==="assistant"?Mr.suggestions??[]:[],ee=A(""),be=A(!1),ye=A(!0),Cr=A(0),Pr=A(!1),te=A(0),De=A(null),Fe=A(null),$e=A(null),Ir=()=>{te.current=requestAnimationFrame(Ir);let u=ee.current.length;if(u===0){if(!ye.current)return;cancelAnimationFrame(te.current),te.current=0,be.current=!1,(De.current||Fe.current||$e.current)&&(es(b,De.current??[],Fe.current??void 0,$e.current??void 0),De.current=null,Fe.current=null,$e.current=null),q("idle");return}let y=Oa(u,performance.now()-Cr.current,be.current,Pr.current);y!==0&&(be.current||(be.current=!0,q("streaming")),ti(b,ee.current.slice(0,y)),ee.current=ee.current.slice(y))},Be=u=>{ee.current+=u},si=u=>{De.current=u},li=u=>{Fe.current=u},ci=u=>{$e.current=u},Or=()=>{te.current&&cancelAnimationFrame(te.current),te.current=0,be.current=!1,ee.current="",De.current=null,Fe.current=null,$e.current=null,ye.current=!0};R(()=>{if(!(!n||!c)){if(!p){P(u=>u||c);return}Rr.current!==c&&(Rr.current=c,xe(c))}},[n,c,p]),R(()=>{let u=at.current;u&&(n&&!u.open&&(u.showModal(),Ue.current?.focus()),!n&&u.open&&u.close())},[n]),R(()=>{if(!n)return;let u=y=>{y.key==="Escape"&&(y.preventDefault(),y.stopPropagation(),Oe!=="closed"?se("closed"):i())};return document.addEventListener("keydown",u,!0),()=>document.removeEventListener("keydown",u,!0)},[n,i,Oe]);let ke=A(!0),[ui,di]=T(!1),fi=()=>{let u=nt.current;u&&(ke.current=u.scrollHeight-u.scrollTop-u.clientHeight<40,di(!ke.current))},pi=()=>{let u=nt.current;u&&(ke.current=!0,u.scrollTo({top:u.scrollHeight,behavior:"smooth"}))};R(()=>{let u=nt.current;u&&ke.current&&(u.scrollTop=u.scrollHeight)},[v,E,et]),R(()=>{let u=Ue.current;if(!u)return;u.style.height="auto";let y=Math.min(u.scrollHeight,160);u.style.height=`${y}px`,u.style.overflowY=u.scrollHeight>y?"auto":"hidden"},[L]),R(()=>()=>{ve.current?.abort(),te.current&&cancelAnimationFrame(te.current)},[]);let Ot=u=>{d&&u.some(y=>y.from==="you")&&(j(y=>{let m=Ua(y,{id:ge.current,at:Date.now(),title:La(u),turns:u.map(H=>H.file?{...H,file:{...H.file,text:""}}:H)});return Zt(m),m}),Na(ge.current))};R(()=>{E==="idle"&&Ot(v)},[E,v]),R(()=>{if(!d)return;let u=Da();j(u);let y=za(u,Ba());y&&(ge.current=y.id,b(m=>m.length?m:y.turns))},[d]);let hi=u=>{Ot(v),ve.current?.abort(),Or(),ke.current=!0,ge.current=u.id,b(u.turns),re(null),Z("chat"),P(""),C(null),I(null),g(null),de(null),q("idle")},mi=()=>{Ot(v),ge.current=Qn(),Ha(),re(null),Z("chat"),se("closed"),ve.current?.abort(),Or(),ke.current=!0,b([]),P(""),C(null),I(null),g(null),de(null),q("idle")},_i=async u=>{if(!u)return;I(null);let y=u.name.toLowerCase(),m=u.type==="application/pdf"||y.endsWith(".pdf"),H=u.type.startsWith("image/"),Lt=m||H?Xo:qo;if(u.size>Lt){I("That file is too large. Attach the failing part of it.");return}let G;try{if(m){if(g("Reading the text in that PDF."),G=await Yo(u),!G){g(null),I("That PDF has no text in it, only pictures of text. Attach a screenshot of the part you mean and it will be read.");return}}else H?G=await Ko(u,g):G=await u.text()}catch{g(null),I("That file could not be read.");return}finally{g(null)}if(!m&&!H&&G.includes("\uFFFD")){I("That looks like a binary file. Text and JSON only.");return}if(G.length>Ar){I(`That file is ${G.length.toLocaleString()} characters. Attach at most ${Ar.toLocaleString()}.`);return}if(!G.trim()){I(H?"No text could be read out of that image.":"That file is empty.");return}C({name:u.name,text:G,kind:m?"pdf":H?"image":void 0}),Ue.current?.focus()},gi=()=>{ve.current?.abort(),ee.current&&ti(b,ee.current),ee.current="",ye.current=!0},Ne=(u,y)=>{M(""),Q(!1),b(m=>[...m,...y?[{from:"you",text:y}]:[],{from:"assistant",text:Pa(u,{docsOrigin:t,mcpUrl:r,pluginRepo:a}),install:u}])},xe=async(u,y={})=>{if(!u||ae)return;let m=y.file!==void 0?y.file:O,H=y.base??v;if(P(""),C(null),I(null),se("closed"),Z("chat"),!m&&!pe&&ja(u)){b([...H,{from:"you",text:u,at:Date.now()},{from:"assistant",text:Va,local:!0}]);return}let Lt=Pt([...H,{from:"you",text:u,file:m??void 0}]);if(b(Y=>[...y.base??Y,{from:"you",text:u,file:m??void 0,at:Date.now()},{from:"assistant",text:""}]),ee.current="",be.current=!1,ye.current=!1,Cr.current=performance.now(),Pr.current=window.matchMedia("(prefers-reduced-motion: reduce)").matches,q("thinking"),de("Thinking"),te.current||(te.current=requestAnimationFrame(Ir)),!e){Be(Qo),ye.current=!0;return}let G=new AbortController;ve.current=G;try{let Y=await fetch(`${e.replace(/\/$/,"")}/api/chat`,{method:"POST",signal:G.signal,headers:{"Content-Type":"application/json"},body:JSON.stringify({turns:Lt.slice(-Ze).map(U=>({role:U.from==="you"?"user":"assistant",text:U.text,...U.file?{attachment:{name:U.file.name,text:U.file.text,...U.file.kind?{kind:U.file.kind}:{}}}:{}})),...ai?{page:{title:s.title,url:s.url,markdown:Jo(s.markdown)}}:{},...pe?{command:pe}:{},...y.module?{module:y.module}:{},...h?{gateway:h}:{}})});if(!Y.ok){let U=await Y.json().catch(()=>null);Be(Sa(Y.status,U));return}if(!Y.body)throw new Error(`status ${Y.status}`);await Aa(Y.body,{onText:Be,onTool:U=>de(U),onSources:U=>si(U),onLinks:U=>li(U),onSuggestions:U=>ci(U),onError:Be,onSkill:U=>b(Ut=>{let Ur=Ut[Ut.length-1],Ai=U.status==="unresolved"?{...Ur,text:St(U),skill:U,local:!0}:{...Ur,skill:U};return[...Ut.slice(0,-1),Ai]})})}catch(Y){Y instanceof DOMException&&Y.name==="AbortError"||Be(vt)}finally{ve.current=null,ye.current=!0,de(null)}},vi=u=>{let y=v.length-2,m=v[y];!m||m.from!=="you"||xe(m.text,{module:u,base:v.slice(0,y),file:m.file??null})},bi=u=>{let y=v[u];!y||y.from!=="you"||xe(y.text,{base:v.slice(0,u),file:y.file??null})},Lr=()=>{if(oe===null)return;let u=oe,y=fe.trim();re(null),y&&xe(y,{base:v.slice(0,u),file:v[u].file??null})},yi=async u=>{Le(u.title);let y=await fetch(Ya(t,u.path)).then(m=>m.ok?m.text():"").catch(()=>"");Le(null),f({title:u.title,url:Xa(t,u.path),markdown:y}),Ue.current?.focus()},ki=u=>j(y=>{let m=Fa(y,u);return Zt(m),m}),xi=()=>{$a(),j([])},wi=E==="thinking",Si=Zo(v);return o("dialog",{class:"ask-ai",ref:at,"aria-label":"Ask AI",onClose:i,onCancel:i,onClick:u=>{u.target===at.current&&!Er&&i()},children:[o(ts,{dialog:at}),o("div",{class:"ask-ai__head",children:[o("div",{class:"ask-ai__tabs",role:"group","aria-label":"Conversations",children:[o("button",{type:"button",class:"ask-ai__tab","aria-pressed":X==="chat","aria-label":"New conversation",title:"Start a new conversation",onClick:mi,children:[o(mt,{}),"New"]}),o("button",{type:"button",class:"ask-ai__tab","aria-pressed":X==="history",onClick:()=>{se("closed"),Z("history")},children:"History"})]}),!e&&o("span",{class:"ask-ai__badge",children:"Mock"}),o("span",{class:"ask-ai__grow"}),o("button",{type:"button",class:"ask-ai__close",onClick:i,"aria-label":"Close",children:o(Ae,{})})]}),X==="history"?o(tn,{sessions:It,currentId:ge.current,onOpen:hi,onForget:ki,onClearAll:xi}):o($,{children:[o("div",{class:"ask-ai__thread",ref:nt,role:"log","aria-live":"polite","aria-busy":ae,onScroll:fi,children:[v.length===0&&o(qn,{starters:w,mock:!e,supportUrl:k,onPick:u=>{xe(u)}}),v.map((u,y)=>o($,{children:[y===ii&&o("p",{class:"ask-ai__cut",role:"separator",children:o("span",{children:"Earlier turns are no longer sent"})}),u.from==="assistant"&&u.text===""?null:o("div",{class:`ask-ai__unit ask-ai__unit--${u.from}`,children:[o("div",{class:`ask-ai__turn ask-ai__turn--${u.from}${E==="streaming"&&y===v.length-1?" ask-ai__turn--streaming":""}`,children:[u.skill&&u.skill.status!=="unresolved"&&o("p",{class:`ask-ai__skill ask-ai__skill--${u.skill.status}`,children:u.skill.status==="used"&&u.skill.href?o("a",{href:qe(u.skill.href,t)??u.skill.href,target:"_blank",rel:"noopener noreferrer",children:St(u.skill)}):St(u.skill)}),u.from==="assistant"?o(Xt,{text:u.text,docsOrigin:t,links:u.links}):oe===y?o("form",{class:"ask-ai__edit",onSubmit:m=>{m.preventDefault(),Lr()},children:[o("textarea",{class:"ask-ai__edit-field",value:fe,autoFocus:!0,rows:Math.min(6,fe.split(`
`).length+1),"aria-label":"Edit your question",onInput:m=>Ce(m.target.value),onKeyDown:m=>{m.key==="Escape"?(m.preventDefault(),m.stopPropagation(),re(null)):m.key==="Enter"&&!m.shiftKey&&!m.isComposing&&(m.preventDefault(),Lr())}}),o("span",{class:"ask-ai__edit-actions",children:[o("button",{type:"button",class:"ask-ai__edit-cancel",onClick:()=>re(null),children:"Cancel"}),o("button",{type:"submit",class:"ask-ai__edit-send",disabled:fe.trim()==="",children:"Send"})]})]}):u.text,u.file&&o("span",{class:"ask-ai__turn-file",children:[o(Ge,{}),u.file.name]}),u.from==="assistant"&&y>0&&u.text!==""&&!(ae&&y===v.length-1)&&o(Xe,{text:u.text,label:"Copy answer",className:"ask-ai__turn-copy"}),u.sources&&u.sources.length>0&&o("details",{class:"ask-ai__sources",children:[o("summary",{class:"ask-ai__sources-toggle",children:[o(ma,{}),"Used ",u.sources.length," ",u.sources.length===1?"source":"sources"]}),o("ul",{class:"ask-ai__source-list",children:u.sources.map(m=>o("li",{children:o("a",{href:qe(m.url,t)??m.url,target:"_blank",rel:"noopener noreferrer",class:"ask-ai__source-link",children:[o(Ee,{}),o("span",{class:"ask-ai__source-title",children:[m.title,m.status!=="verified"?" (spec)":""]})]})},m.id))})]}),u.install&&y===v.length-1&&o("div",{class:"ask-ai__choices",children:[u.install.at==="tools"&&Yt.map(m=>o("button",{type:"button",class:"ask-ai__choice",onClick:()=>Ne(Ea(m.id)?{at:"agents",tool:m.id}:{at:"answer",tool:m.id,agent:"claude"},m.label),children:m.label},m.id)),u.install.at==="agents"&&!V&&Kt.map(m=>o("button",{type:"button",class:"ask-ai__choice",onClick:()=>{if(m.id==="other"){Q(!0);return}Ne({at:"answer",tool:u.install.tool,agent:m.id},m.label)},children:m.label},m.id)),u.install.at==="agents"&&V&&o("form",{class:"ask-ai__naming",onSubmit:m=>{m.preventDefault();let H=B.trim();H&&Ne({at:"answer",tool:u.install.tool,agent:"other",named:H},H)},children:[o("input",{class:"ask-ai__naming-field",value:B,autoFocus:!0,placeholder:"Which agent?","aria-label":"The name of your agent",onInput:m=>M(m.target.value)}),o("button",{type:"submit",class:"ask-ai__choice",disabled:B.trim()==="",children:o(ht,{})})]})]}),u.install?.at==="answer"&&(()=>{let{link:m}=Qt(u.install,{docsOrigin:t,mcpUrl:r,pluginRepo:a});return m?o("a",{class:"ask-ai__install-cta",href:m.href,target:"_blank",rel:"noopener noreferrer",children:[o(ce,{}),m.label]}):null})(),u.skill?.status==="unresolved"&&y===v.length-1&&o("div",{class:"ask-ai__choices",children:(u.skill.candidates??[]).map(m=>o("button",{type:"button",class:"ask-ai__choice",onClick:()=>vi(m),children:kt(m)},m))}),u.skill?.status==="used"&&u.skill.section==="scaffold"&&!(ae&&y===v.length-1)&&o("button",{type:"button",class:"ask-ai__install-cta",onClick:()=>Ne({at:"tools"},"Install AI tools"),children:[o(ce,{}),"Build it with your coding agent"]}),y===Si&&u.skill?.section!=="scaffold"&&!(ae&&y===v.length-1)&&o("button",{type:"button",class:"ask-ai__install-cta",onClick:()=>Ne({at:"tools"},"Install AI tools"),children:[o(ce,{}),"Install AI tools"]})]}),u.from==="you"&&oe!==y&&!v[y+1]?.install&&!v[y+1]?.local&&o("div",{class:"ask-ai__ask-actions",children:[u.at?o("time",{class:"ask-ai__ask-time",dateTime:new Date(u.at).toISOString(),children:Wa(u.at,tt)}):null,!ae&&oe===null&&y===v.length-2&&o("button",{type:"button",class:"ask-ai__ask-action","aria-label":"Retry",title:"Retry",onClick:()=>bi(y),children:o(pa,{})}),!ae&&o("button",{type:"button",class:"ask-ai__ask-action","aria-label":"Edit question",title:"Edit",onClick:()=>{Ce(u.text),re(y)},children:o(ca,{})}),o(Xe,{text:u.text,label:"Copy question",className:"ask-ai__ask-action"})]})]})]},y)),wi&&o("p",{class:"ask-ai__activity",children:[o(Gn,{}),et??"Thinking"]})]}),ui&&o("div",{class:"ask-ai__to-end-wrap",children:o("button",{type:"button",class:"ask-ai__to-end","aria-label":"Scroll to the latest",onClick:pi,children:o(ha,{})})}),o(en,{draft:L,onDraft:P,field:Ue,busy:ae,onSend:()=>{xe(L.trim())},onStop:gi,menu:Oe,onMenu:se,accept:Go,onFile:u=>{_i(u)},file:O,fileNote:J,fileError:N,onRemoveFile:()=>C(null),docsOrigin:t,page:s,attaching:rt,onPage:u=>{yi(u)},onRemovePage:l,command:pe,onCommand:Ie,memory:ni,suggestions:oi})]})]})}function as({host:e,apiBase:t,docsOrigin:r,mcpUrl:a,pluginRepo:n,supportUrl:i,launcher:s,shortcut:l,open:f,page:c,onDetach:p,onAttach:_,question:d,send:h,starters:k,keepHistory:v,gateway:b}){return o($,{children:[s&&o("button",{type:"button",class:"ask-ai__launcher","aria-label":"Ask AI",onClick:()=>{e.removeAttribute("open"),e.setAttribute("open","")},children:[o(ce,{}),o("span",{class:"ask-ai__launcher-label",children:"Ask AI"}),l&&o("kbd",{class:"ask-ai__launcher-key",children:l})]}),o(rs,{apiBase:t,docsOrigin:r,mcpUrl:a,pluginRepo:n,supportUrl:i,open:f,question:d,send:h,starters:k,keepHistory:v,gateway:b,onClose:()=>{e.removeAttribute("open"),e.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))},page:c,onDetach:p,onAttach:_})]})}function ns(){for(let e=document.body;e;e=e.parentElement){let t=/^rgba?\(([^)]+)\)/.exec(getComputedStyle(e).backgroundColor);if(!t)continue;let[r,a,n,i=1]=t[1].split(",").map(Number);if(i)return .2126*r+.7152*a+.0722*n<128?"dark":"light"}return window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}var Tr=class extends HTMLElement{static observedAttributes=["api-base","docs-origin","mcp-url","plugin-repo","support-url","launcher","shortcut","open","question","send","starters","history","ground","gateway"];root=null;page=null;connectedCallback(){if(!this.root){this.root=this.attachShadow({mode:"open"});let t=document.createElement("style");t.textContent=Jn,this.root.append(t),this.hasAttribute("ground")||this.setAttribute("ground",ns())}this.paint()}attributeChangedCallback(){this.root&&this.paint()}show(){this.setAttribute("open","")}hide(){this.removeAttribute("open")}attachPage(t){this.page=t&&Ka(t.markdown)?{...t,markdown:""}:t,this.root&&this.paint()}paint(){let t=this.getAttribute("docs-origin")??window.location.origin;Wt(o(as,{host:this,apiBase:this.getAttribute("api-base")??"",docsOrigin:t,mcpUrl:this.getAttribute("mcp-url"),pluginRepo:this.getAttribute("plugin-repo")??"nha-in/docs",supportUrl:this.getAttribute("support-url")??`${t.replace(/\/$/,"")}/docs/support`,launcher:this.getAttribute("launcher")!=="none",shortcut:this.getAttribute("shortcut")??"",open:this.hasAttribute("open"),page:this.page,onDetach:()=>this.attachPage(null),onAttach:r=>this.attachPage(r),question:this.getAttribute("question")??"",send:this.hasAttribute("send"),starters:Xn(this.getAttribute("starters")??""),keepHistory:this.getAttribute("history")!=="off",gateway:this.getAttribute("gateway")??""}),this.root)}};typeof customElements<"u"&&!customElements.get("abdm-support-agent")&&customElements.define("abdm-support-agent",Tr);})();
