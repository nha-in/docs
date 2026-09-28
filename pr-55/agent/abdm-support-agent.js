(()=>{var rt,x,Rr,Yn,ie,wr,Mr,Tr,St,Ke,Oe,Cr,Rt,At,Et,Jn,Ze={},et=[],Kn=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i,Ie=Array.isArray;function ee(e,t){for(var r in t)e[r]=t[r];return e}function Mt(e){e&&e.parentNode&&e.parentNode.removeChild(e)}function we(e,t,r){var a,n,i,s={};for(i in t)i=="key"?a=t[i]:i=="ref"?n=t[i]:s[i]=t[i];if(arguments.length>2&&(s.children=arguments.length>3?rt.call(arguments,2):r),typeof e=="function"&&e.defaultProps!=null)for(i in e.defaultProps)s[i]===void 0&&(s[i]=e.defaultProps[i]);return Qe(e,s,a,n,null)}function Qe(e,t,r,a,n){var i={type:e,props:t,key:r,ref:a,__k:null,__:null,__b:0,__e:null,__c:null,constructor:void 0,__v:n??++Rr,__i:-1,__u:0};return n==null&&x.vnode!=null&&x.vnode(i),i}function $(e){return e.children}function X(e,t){this.props=e,this.context=t}function pe(e,t){if(t==null)return e.__?pe(e.__,e.__i+1):null;for(var r;t<e.__k.length;t++)if((r=e.__k[t])!=null&&r.__e!=null)return r.__e;return typeof e.type=="function"?pe(e):null}function Qn(e){if(e.__P&&e.__d){var t=e.__v,r=t.__e,a=[],n=[],i=ee({},t);i.__v=t.__v+1,x.vnode&&x.vnode(i),Tt(e.__P,i,t,e.__n,e.__P.namespaceURI,32&t.__u?[r]:null,a,r??pe(t),!!(32&t.__u),n),i.__v=t.__v,i.__.__k[i.__i]=i,Lr(a,i,n),t.__e=t.__=null,i.__e!=r&&Pr(i)}}function Pr(e){if((e=e.__)!=null&&e.__c!=null)return e.__e=e.__c.base=null,e.__k.some(function(t){if(t!=null&&t.__e!=null)return e.__e=e.__c.base=t.__e}),Pr(e)}function Sr(e){(!e.__d&&(e.__d=!0)&&ie.push(e)&&!tt.__r++||wr!=x.debounceRendering)&&((wr=x.debounceRendering)||Mr)(tt)}function tt(){try{for(var e,t=1;ie.length;)ie.length>t&&ie.sort(Tr),e=ie.shift(),t=ie.length,Qn(e)}finally{ie.length=tt.__r=0}}function Or(e,t,r,a,n,i,s,l,d,c,f){var _,u,h,m,v,g,y=a&&a.__k||et,w=t.length;for(d=Zn(r,t,y,d,w),_=0;_<w;_++)(h=r.__k[_])!=null&&(u=h.__i!=-1&&y[h.__i]||Ze,h.__i=_,g=Tt(e,h,u,n,i,s,l,d,c,f),m=h.__e,h.ref&&u.ref!=h.ref&&(u.ref&&Ct(u.ref,null,h),f.push(h.ref,h.__c||m,h)),v==null&&m!=null&&(v=m),4&h.__u?(d=Ir(h,d,e),u.__e&&(u.__e=null)):typeof h.type=="function"&&g!==void 0?d=g:m&&(d=m.nextSibling),h.__u&=-7);return r.__e=v,d}function Zn(e,t,r,a,n){var i,s,l,d,c,f=r.length,_=f,u=0;for(e.__k=new Array(n),i=0;i<n;i++)(s=t[i])!=null&&typeof s!="boolean"&&typeof s!="function"?(typeof s=="string"||typeof s=="number"||typeof s=="bigint"||s.constructor==String?s=e.__k[i]=Qe(null,s,null,null,null):Ie(s)?s=e.__k[i]=Qe($,{children:s},null,null,null):s.constructor===void 0&&s.__b>0?s=e.__k[i]=Qe(s.type,s.props,s.key,s.ref?s.ref:null,s.__v):e.__k[i]=s,d=i+u,s.__=e,s.__b=e.__b+1,l=null,(c=s.__i=ei(s,r,d,_))!=-1&&(_--,(l=r[c])&&(l.__u|=2)),l==null||l.__v==null?(c==-1&&(n>f?u--:n<f&&u++),typeof s.type!="function"&&(s.__u|=4)):c!=d&&(c==d-1?u--:c==d+1?u++:(c>d?u--:u++,s.__u|=4))):e.__k[i]=null;if(_)for(i=0;i<f;i++)(l=r[i])!=null&&(2&l.__u)==0&&(l.__e==a&&(a=pe(l)),Dr(l,l));return a}function Ir(e,t,r){var a,n;if(typeof e.type=="function"){for(a=e.__k,n=0;a&&n<a.length;n++)a[n]&&(a[n].__=e,t=Ir(a[n],t,r));return t}e.__e!=t&&(t&&e.type&&!t.parentNode&&(t=pe(e)),t=r.insertBefore(e.__e,t||null));do t=t&&t.nextSibling;while(t!=null&&t.nodeType==8);return t}function Ue(e,t){return t=t||[],e==null||typeof e=="boolean"||(Ie(e)?e.some(function(r){Ue(r,t)}):t.push(e)),t}function ei(e,t,r,a){var n,i,s,l=e.key,d=e.type,c=t[r],f=c!=null&&(2&c.__u)==0;if(c===null&&l==null||f&&l==c.key&&d==c.type)return r;if(a>(f?1:0)){for(n=r-1,i=r+1;n>=0||i<t.length;)if((c=t[s=n>=0?n--:i++])!=null&&(2&c.__u)==0&&l==c.key&&d==c.type)return s}return-1}function Ar(e,t,r){t[0]=="-"?e.setProperty(t,r??""):e[t]=r==null?"":typeof r!="number"||Kn.test(t)?r:r+"px"}function Je(e,t,r,a,n){var i,s;e:if(t=="style")if(typeof r=="string")e.style.cssText=r;else{if(typeof a=="string"&&(e.style.cssText=a=""),a)for(t in a)r&&t in r||Ar(e.style,t,"");if(r)for(t in r)a&&r[t]==a[t]||Ar(e.style,t,r[t])}else if(t[0]=="o"&&t[1]=="n")i=t!=(t=t.replace(Cr,"$1")),s=t.toLowerCase(),t=s in e||t=="onFocusOut"||t=="onFocusIn"?s.slice(2):t.slice(2),e.l||(e.l={}),e.l[t+i]=r,r?a?r[Oe]=a[Oe]:(r[Oe]=Rt,e.addEventListener(t,i?Et:At,i)):e.removeEventListener(t,i?Et:At,i);else{if(n=="http://www.w3.org/2000/svg")t=t.replace(/xlink(H|:h)/,"h").replace(/sName$/,"s");else if(t!="width"&&t!="height"&&t!="href"&&t!="list"&&t!="form"&&t!="tabIndex"&&t!="download"&&t!="rowSpan"&&t!="colSpan"&&t!="role"&&t!="popover"&&t in e)try{e[t]=r??"";break e}catch{}typeof r=="function"||(r==null||r===!1&&t[4]!="-"?e.removeAttribute(t):e.setAttribute(t,t=="popover"&&r==1?"":r))}}function Er(e){return function(t){if(this.l){var r=this.l[t.type+e];if(t[Ke]==null)t[Ke]=Rt++;else if(t[Ke]<r[Oe])return;return r(x.event?x.event(t):t)}}}function Tt(e,t,r,a,n,i,s,l,d,c){var f,_,u,h,m,v,g,y,w,P,I,L,M,V,T,re,U=t.type;if(t.constructor!==void 0)return null;128&r.__u&&(d=!!(32&r.__u),i=[l=t.__e=r.__e]),(f=x.__b)&&f(t);e:if(typeof U=="function"){_=s.length;try{if(w=t.props,P=U.prototype&&U.prototype.render,I=(f=U.contextType)&&a[f.__c],L=f?I?I.props.value:f.__:a,r.__c?y=(u=t.__c=r.__c).__=u.__E:(P?t.__c=u=new U(w,L):(t.__c=u=new X(w,L),u.constructor=U,u.render=ri),I&&I.sub(u),u.state||(u.state={}),u.__n=a,h=u.__d=!0,u.__h=[],u._sb=[]),P&&u.__s==null&&(u.__s=u.state),P&&U.getDerivedStateFromProps!=null&&(u.__s==u.state&&(u.__s=ee({},u.__s)),ee(u.__s,U.getDerivedStateFromProps(w,u.__s))),m=u.props,v=u.state,u.__v=t,h)P&&U.getDerivedStateFromProps==null&&u.componentWillMount!=null&&u.componentWillMount(),P&&u.componentDidMount!=null&&u.__h.push(u.componentDidMount);else{if(P&&U.getDerivedStateFromProps==null&&w!==m&&u.componentWillReceiveProps!=null&&u.componentWillReceiveProps(w,L),t.__v==r.__v||!u.__e&&u.shouldComponentUpdate!=null&&u.shouldComponentUpdate(w,u.__s,L)===!1){t.__v!=r.__v&&(u.props=w,u.state=u.__s,u.__d=!1),t.__e=r.__e,t.__k=r.__k,t.__k.some(function(B){B&&(B.__=t)}),et.push.apply(u.__h,u._sb),u._sb=[],u.__h.length&&s.push(u),l=pe(r);break e}u.componentWillUpdate!=null&&u.componentWillUpdate(w,u.__s,L),P&&u.componentDidUpdate!=null&&u.__h.push(function(){u.componentDidUpdate(m,v,g)})}if(u.context=L,u.props=w,u.__P=e,u.__e=!1,M=x.__r,V=0,P)u.state=u.__s,u.__d=!1,M&&M(t),f=u.render(u.props,u.state,u.context),et.push.apply(u.__h,u._sb),u._sb=[];else do u.__d=!1,M&&M(t),f=u.render(u.props,u.state,u.context),u.state=u.__s;while(u.__d&&++V<25);u.state=u.__s,u.getChildContext!=null&&(a=ee(ee({},a),u.getChildContext())),P&&!h&&u.getSnapshotBeforeUpdate!=null&&(g=u.getSnapshotBeforeUpdate(m,v)),T=f!=null&&f.type===$&&f.key==null?Fr(f.props.children):f,l=Or(e,Ie(T)?T:[T],t,r,a,n,i,s,l,d,c),u.base=t.__e,t.__u&=-161,u.__h.length&&s.push(u),y&&(u.__E=u.__=null)}catch(B){if(s.length=_,t.__v=null,d||i!=null){if(B.then){for(t.__u|=d?160:128;l&&l.nodeType==8&&l.nextSibling;)l=l.nextSibling;i!=null&&(i[i.indexOf(l)]=null),t.__e=l}else if(i!=null)for(re=i.length;re--;)Mt(i[re])}else t.__e=r.__e;t.__k==null&&(t.__k=r.__k||[]),B.then||Ur(t),x.__e(B,t,r)}}else i==null&&t.__v==r.__v?(t.__k=r.__k,t.__e=r.__e):l=t.__e=ti(r.__e,t,r,a,n,i,s,d,c);return(f=x.diffed)&&f(t),128&t.__u?void 0:l}function Ur(e){e&&(e.__c&&(e.__c.__e=!0),e.__k&&e.__k.some(Ur))}function Lr(e,t,r){for(var a=0;a<r.length;a++)Ct(r[a],r[++a],r[++a]);x.__c&&x.__c(t,e),e.some(function(n){try{e=n.__h,n.__h=[],e.some(function(i){i.call(n)})}catch(i){x.__e(i,n.__v)}})}function Fr(e){return typeof e!="object"||e==null||e.__b>0?e:Ie(e)?e.map(Fr):e.constructor!==void 0?null:ee({},e)}function ti(e,t,r,a,n,i,s,l,d){var c,f,_,u,h,m,v,g=r.props||Ze,y=t.props,w=t.type;if(w=="svg"?n="http://www.w3.org/2000/svg":w=="math"?n="http://www.w3.org/1998/Math/MathML":n||(n="http://www.w3.org/1999/xhtml"),i!=null){for(c=0;c<i.length;c++)if((h=i[c])&&"setAttribute"in h==!!w&&(w?h.localName==w:h.nodeType==3)){e=h,i[c]=null;break}}if(e==null){if(w==null)return document.createTextNode(y);e=document.createElementNS(n,w,y.is&&y),l&&(x.__m&&x.__m(t,i),l=!1),i=null}if(w==null)g===y||l&&e.data==y||(e.data=y);else{if(i=w=="textarea"&&y.defaultValue!=null?null:i&&rt.call(e.childNodes),!l&&i!=null)for(g={},c=0;c<e.attributes.length;c++)g[(h=e.attributes[c]).name]=h.value;for(c in g)h=g[c],c=="dangerouslySetInnerHTML"?_=h:c=="children"||c in y||c=="value"&&"defaultValue"in y||c=="checked"&&"defaultChecked"in y||Je(e,c,null,h,n);for(c in y)h=y[c],c=="children"?u=h:c=="dangerouslySetInnerHTML"?f=h:c=="value"?m=h:c=="checked"?v=h:l&&typeof h!="function"||g[c]===h||Je(e,c,h,g[c],n);if(f)l||_&&(f.__html==_.__html||f.__html==e.innerHTML)||(e.innerHTML=f.__html),t.__k=[];else if(_&&(e.innerHTML=""),Or(t.type=="template"?e.content:e,Ie(u)?u:[u],t,r,a,w=="foreignObject"?"http://www.w3.org/1999/xhtml":n,i,s,i?i[0]:r.__k&&pe(r,0),l,d),i!=null)for(c=i.length;c--;)Mt(i[c]);l&&w!="textarea"||(c="value",w=="progress"&&m==null?e.removeAttribute("value"):m!=null&&(m!==e[c]||w=="progress"&&!m||w=="option"&&m!=g[c])&&Je(e,c,m,g[c],n),c="checked",v!=null&&v!=e[c]&&Je(e,c,v,g[c],n))}return e}function Ct(e,t,r){try{if(typeof e=="function"){var a=typeof e.__u=="function";a&&e.__u(),a&&t==null||(e.__u=e(t))}else e.current=t}catch(n){x.__e(n,r)}}function Dr(e,t,r){var a,n;if(x.unmount&&x.unmount(e),(a=e.ref)&&(a.current&&a.current!=e.__e||Ct(a,null,t)),(a=e.__c)!=null){if(a.componentWillUnmount)try{a.componentWillUnmount()}catch(i){x.__e(i,t)}a.base=a.__P=a.__n=null}if(a=e.__k)for(n=0;n<a.length;n++)a[n]&&Dr(a[n],t,r||typeof e.type!="function");r||Mt(e.__e),e.__c=e.__=e.__e=void 0}function ri(e,t,r){return this.constructor(e,r)}function Pt(e,t,r){var a,n,i,s;t==document&&(t=document.documentElement),x.__&&x.__(e,t),n=(a=typeof r=="function")?null:r&&r.__k||t.__k,i=[],s=[],Tt(t,e=(!a&&r||t).__k=we($,null,[e]),n||Ze,Ze,t.namespaceURI,!a&&r?[r]:n?null:t.firstChild?rt.call(t.childNodes):null,i,!a&&r?r:n?n.__e:t.firstChild,a,s),Lr(i,e,s),e.props.children=null}rt=et.slice,x={__e:function(e,t,r,a){for(var n,i,s;t=t.__;)if((n=t.__c)&&!n.__)try{if((i=n.constructor)&&i.getDerivedStateFromError!=null&&(n.setState(i.getDerivedStateFromError(e)),s=n.__d),n.componentDidCatch!=null&&(n.componentDidCatch(e,a||{}),s=n.__d),s)return n.__E=n}catch(l){e=l}throw e}},Rr=0,Yn=function(e){return e!=null&&e.constructor===void 0},X.prototype.setState=function(e,t){var r;r=this.__s!=null&&this.__s!=this.state?this.__s:this.__s=ee({},this.state),typeof e=="function"&&(e=e(ee({},r),this.props)),e&&ee(r,e),e!=null&&this.__v&&(t&&this._sb.push(t),Sr(this))},X.prototype.forceUpdate=function(e){this.__v&&(this.__e=!0,e&&this.__h.push(e),Sr(this))},X.prototype.render=$,ie=[],Mr=typeof Promise=="function"?Promise.prototype.then.bind(Promise.resolve()):setTimeout,Tr=function(e,t){return e.__v.__b-t.__v.__b},tt.__r=0,St=Math.random().toString(8),Ke="__d"+St,Oe="__a"+St,Cr=/(PointerCapture)$|Capture$/i,Rt=0,At=Er(!1),Et=Er(!0),Jn=0;var Se,C,Ot,Br,Le=0,jr=[],O=x,Nr=O.__b,$r=O.__r,Hr=O.diffed,zr=O.__c,Wr=O.unmount,Vr=O.__;function nt(e,t){O.__h&&O.__h(C,e,Le||t),Le=0;var r=C.__H||(C.__H={__:[],__h:[]});return e>=r.__.length&&r.__.push({}),r.__[e]}function R(e){return Le=1,Xr(Yr,e)}function Xr(e,t,r){var a=nt(Se++,2);if(a.t=e,!a.__c&&(a.__=[r?r(t):Yr(void 0,t),function(l){var d=a.__N?a.__N[0]:a.__[0],c=a.t(d,l);d!==c&&(a.__N=[c,a.__[1]],a.__c.setState({}))}],a.__c=C,!C.__f)){var n=function(l,d,c){if(!a.__c.__H)return!0;var f=!1,_=a.__c.props!==l;if(a.__c.__H.__.some(function(h){if(h.__N){f=!0;var m=h.__[0];h.__=h.__N,h.__N=void 0,m!==h.__[0]&&(_=!0)}}),i){var u=i.call(this,l,d,c);return f?u||_:u}return!f||_};C.__f=!0;var i=C.shouldComponentUpdate,s=C.componentWillUpdate;C.componentWillUpdate=function(l,d,c){if(this.__e){var f=i;i=void 0,n(l,d,c),i=f}s&&s.call(this,l,d,c)},C.shouldComponentUpdate=n}return a.__N||a.__}function A(e,t){var r=nt(Se++,3);!O.__s&&Lt(r.__H,t)&&(r.__=e,r.u=t,C.__H.__h.push(r))}function qr(e,t){var r=nt(Se++,4);!O.__s&&Lt(r.__H,t)&&(r.__=e,r.u=t,C.__h.push(r))}function S(e){return Le=5,Fe(function(){return{current:e}},[])}function Fe(e,t){var r=nt(Se++,7);return Lt(r.__H,t)&&(r.__=e(),r.__H=t,r.__h=e),r.__}function Ut(e,t){return Le=8,Fe(function(){return e},t)}function ai(){for(var e;e=jr.shift();){var t=e.__H;if(e.__P&&t)try{t.__h.some(at),t.__h.some(It),t.__h=[]}catch(r){t.__h=[],O.__e(r,e.__v)}}}O.__b=function(e){C=null,Nr&&Nr(e)},O.__=function(e,t){e&&t.__k&&t.__k.__m&&(e.__m=t.__k.__m),Vr&&Vr(e,t)},O.__r=function(e){$r&&$r(e),Se=0;var t=(C=e.__c).__H;t&&(Ot===C?(t.__h=[],C.__h=[],t.__.some(function(r){r.__N&&(r.__=r.__N),r.u=r.__N=void 0})):(t.__h.some(at),t.__h.some(It),t.__h=[],Se=0)),Ot=C},O.diffed=function(e){Hr&&Hr(e);var t=e.__c;t&&t.__H&&(t.__H.__h.length&&(jr.push(t)!==1&&Br===O.requestAnimationFrame||((Br=O.requestAnimationFrame)||ni)(ai)),t.__H.__.some(function(r){r.u&&(r.__H=r.u,r.u=void 0)})),Ot=C=null},O.__c=function(e,t){t.some(function(r){try{r.__h.some(at),r.__h=r.__h.filter(function(a){return!a.__||It(a)})}catch(a){t.some(function(n){n.__h&&(n.__h=[])}),t=[],O.__e(a,r.__v)}}),zr&&zr(e,t)},O.unmount=function(e){Wr&&Wr(e);var t,r=e.__c;r&&r.__H&&(r.__H.__.some(function(a){try{at(a)}catch(n){t=n}}),r.__H=void 0,t&&O.__e(t,r.__v))};var Gr=typeof requestAnimationFrame=="function";function ni(e){var t,r=function(){clearTimeout(a),Gr&&cancelAnimationFrame(t),setTimeout(e)},a=setTimeout(r,35);Gr&&(t=requestAnimationFrame(r))}function at(e){var t=C,r=e.__c;typeof r=="function"&&(e.__c=void 0,r()),C=t}function It(e){var t=C;e.__c=e.__(),C=t}function Lt(e,t){return!e||e.length!==t.length||t.some(function(r,a){return r!==e[a]})}function Yr(e,t){return typeof t=="function"?t(e):t}var ii=0;function o(e,t,r,a,n,i){t||(t={});var s,l,d=t;if("ref"in d)for(l in d={},t)l=="ref"?s=t[l]:d[l]=t[l];var c={type:e,props:d,key:r,ref:s,__k:null,__:null,__b:0,__e:null,__c:null,constructor:void 0,__v:--ii,__i:-1,__u:0,__source:n,__self:i};if(typeof e=="function"&&(s=e.defaultProps))for(l in s)d[l]===void 0&&(d[l]=s[l]);return x.vnode&&x.vnode(c),c}var W={xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round","aria-hidden":"true"},it=()=>o("svg",{...W,width:"16",height:"16",children:[o("path",{d:"m5 12 7-7 7 7"}),o("path",{d:"M12 19V5"})]});var De=()=>o("svg",{...W,width:"14",height:"14",children:[o("path",{d:"M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"}),o("path",{d:"M20 2v4"}),o("path",{d:"M22 4h-4"}),o("circle",{cx:"4",cy:"20",r:"2"})]}),Jr=()=>o("svg",{...W,width:"12",height:"12",children:o("rect",{width:"18",height:"18",x:"3",y:"3",rx:"2"})}),Kr=()=>o("svg",{...W,width:"14",height:"14",children:o("path",{d:"M20 6 9 17l-5-5"})}),Qr=()=>o("svg",{...W,width:"14",height:"14",children:[o("rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2"}),o("path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"})]}),Be=()=>o("svg",{...W,width:"16",height:"16",children:[o("path",{d:"M18 6 6 18"}),o("path",{d:"m6 6 12 12"})]}),Ne=()=>o("svg",{...W,width:"16",height:"16",children:[o("path",{d:"M13.234 20.252 21 12.3"}),o("path",{d:"m16 6-8.414 8.586a2 2 0 0 0 0 2.828 2 2 0 0 0 2.828 0l8.414-8.586a4 4 0 0 0 0-5.656 4 4 0 0 0-5.656 0l-8.415 8.585a6 6 0 1 0 8.486 8.486"})]}),ot=()=>o("svg",{...W,width:"16",height:"16",children:[o("path",{d:"M5 12h14"}),o("path",{d:"M12 5v14"})]}),Zr=()=>o("svg",{...W,width:"14",height:"14",children:o("path",{d:"m9 18 6-6-6-6"})}),Ae=()=>o("svg",{...W,width:"14",height:"14",children:[o("path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"}),o("path",{d:"M14 2v4a2 2 0 0 0 2 2h4"}),o("path",{d:"M16 13H8"}),o("path",{d:"M16 17H8"})]}),ea=()=>o("svg",{...W,width:"14",height:"14",children:[o("path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"}),o("path",{d:"m17 8-5-5-5 5"}),o("path",{d:"M12 3v12"})]}),ta=()=>o("svg",{...W,width:"14",height:"14",children:[o("circle",{cx:"11",cy:"11",r:"8"}),o("path",{d:"m21 21-4.3-4.3"})]}),ra=()=>o("svg",{...W,width:"14",height:"14",children:[o("path",{d:"M3 6h18"}),o("path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"}),o("path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"})]}),aa=()=>o("svg",{...W,width:"14",height:"14",children:o("path",{d:"m15 18-6-6 6-6"})});var te=(()=>{if(typeof document>"u")return"/agent/vendor/";let e=document.currentScript?.src;try{return new URL("vendor/",e??"/agent/").href}catch{return"/agent/vendor/"}})(),na=new Map;function st(e){let t=na.get(e);if(t)return t;let r=new Promise((a,n)=>{let i=document.createElement("script");i.src=e,i.onload=()=>a(),i.onerror=()=>n(new Error(`could not load ${e}`)),document.head.append(i)});return na.set(e,r),r}var oi=/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)\s]+\))/g;function ct(e,t){return e.startsWith("/")?`${t.replace(/\/$/,"")}${e}`:e.startsWith("https://")||e.startsWith("http://")?e:null}function lt(e,t){return e.split(oi).map((a,n)=>{if(a.startsWith("`")&&a.endsWith("`")&&a.length>2)return o("code",{children:a.slice(1,-1)},n);if(a.startsWith("**")&&a.endsWith("**")&&a.length>4)return o("b",{children:lt(a.slice(2,-2),t)},n);if(a.startsWith("*")&&a.endsWith("*")&&a.length>2)return o("em",{children:lt(a.slice(1,-1),t)},n);let i=/^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(a);if(i){let[,s,l]=i,d=ct(l,t);return d?o("a",{href:d,target:"_blank",rel:"noopener noreferrer",children:s},n):a}return a})}function ut({text:e,label:t,className:r}){let[a,n]=R(!1);return A(()=>{if(!a)return;let i=window.setTimeout(()=>n(!1),1600);return()=>window.clearTimeout(i)},[a]),typeof navigator>"u"||!navigator.clipboard?null:o("button",{type:"button",class:r,"aria-label":a?"Copied":t,onClick:()=>{navigator.clipboard.writeText(e).then(()=>n(!0),()=>{})},children:a?o(Kr,{}):o(Qr,{})})}var ia=null;function si(){return ia??=st(`${te}mermaid.min.js`).then(()=>{let e=globalThis.mermaid;if(!e)throw new Error("mermaid loaded but registered nothing");return e.initialize({startOnLoad:!1,securityLevel:"strict",theme:li()?"dark":"default",fontFamily:"inherit"}),e}),ia}function li(){let e=document.documentElement.dataset.theme;return e==="dark"?!0:e==="light"?!1:globalThis.matchMedia?.("(prefers-color-scheme: dark)").matches??!1}var oa=0;function ci({text:e}){let[t,r]=R(""),[a,n]=R(!1);return A(()=>{let i=!0;n(!1),r(""),oa+=1;let s=`ask-ai-diagram-${oa}`;return si().then(l=>l.render(s,e)).then(l=>{i&&r(l.svg)}).catch(()=>{i&&n(!0),document.getElementById(s)?.remove(),document.getElementById(`d${s}`)?.remove()}),()=>{i=!1}},[e]),a?o("div",{class:"ask-ai__code",children:[o("pre",{children:o("code",{children:e})}),o(ut,{text:e,label:"Copy diagram source",className:"ask-ai__code-copy"})]}):o("div",{class:"ask-ai__diagram",dangerouslySetInnerHTML:{__html:t}})}var ui=/^\s*[-*]\s+(.*)$/,di=/^\s*\d+[.)]\s+(.*)$/;function pi(e){let t=[],r=null,a=[],n=null,i="",s=()=>{a.length>0&&(t.push({kind:"p",text:a.join(" ")}),a=[])},l=()=>{r&&(t.push(r),r=null)};for(let d of e.split(`
`)){if(d.trimStart().startsWith("```")){n?(t.push({kind:"code",text:n.join(`
`),lang:i,closed:!0}),n=null,i=""):(s(),l(),i=d.trim().slice(3).trim().toLowerCase(),n=[]);continue}if(n){n.push(d);continue}let c=ui.exec(d),f=c?null:di.exec(d);if(c||f){s();let _=c?"ul":"ol";(!r||r.kind!==_)&&(l(),r={kind:_,items:[]}),r.items.push((c??f)[1]);continue}if(d.trim()===""){s(),l();continue}if(r&&/^\s{2,}/.test(d)){r.items[r.items.length-1]+=` ${d.trim()}`;continue}l(),a.push(d.replace(/^#{1,4}\s+/,"").trim())}return n&&t.push({kind:"code",text:n.join(`
`),lang:i,closed:!1}),s(),l(),t}function Ft({text:e,docsOrigin:t}){return o($,{children:pi(e).map((r,a)=>{if(r.kind==="p")return o("p",{children:lt(r.text,t)},a);if(r.kind==="code")return r.lang==="mermaid"&&r.closed?o(ci,{text:r.text},a):o("div",{class:"ask-ai__code",children:[o("pre",{children:o("code",{children:r.text})}),o(ut,{text:r.text,label:"Copy code",className:"ask-ai__code-copy"})]},a);let n=r.kind;return o(n,{children:r.items.map((i,s)=>o("li",{children:lt(i,t)},s))},a)})})}function sa(e){let t=[],r=!1;for(let a of e.split(`
`))/^\s*```/.test(a)?r=!r:!r&&/^##\s+/.test(a)&&t.push(a.slice(2).replace(/[*`_]/g,"").trim());return t.filter(Boolean)}var Dt="The assistant is unreachable right now. Try again shortly.";async function la(e,t){let r=e.getReader(),a=new TextDecoder,n="",i=s=>{let l="message",d=[];for(let f of s.split(`
`))f.startsWith("event:")?l=f.slice(6).trim():f.startsWith("data:")&&d.push(f.slice(5).trim());if(d.length===0)return;let c;try{c=JSON.parse(d.join(`
`))}catch{return}switch(l){case"text":t.onText(c.delta??"");break;case"tool":{let f=c;t.onTool(f.detail||f.name);break}case"sources":t.onSources(c);break;case"skill":t.onSkill?.(c);break;case"error":t.onError(c.message||Dt);break;default:break}};for(;;){let{done:s,value:l}=await r.read();if(s)break;n+=a.decode(l,{stream:!0});let d;for(;(d=n.indexOf(`

`))!==-1;){let c=n.slice(0,d);n=n.slice(d+2),i(c)}}}var dt="abdm-docs",Bt=[{id:"skills",label:"Skills"},{id:"mcp",label:"MCP server"},{id:"plugin",label:"Plugin"}],Nt=[{id:"claude",label:"Claude"},{id:"codex",label:"Codex"},{id:"cursor",label:"Cursor"},{id:"other",label:"Other"}],fi=["Three ways to give your agent this catalogue. Take any of them, or all three.","","- **Skills**: the milestones written as files an agent reads before it writes code. One set up line, any agent.","- **MCP server**: your agent queries these pages as it works, so it retrieves the paragraph it needs instead of loading the site.","- **Plugin**: every skill at once, as one package. Claude Code and Codex install it straight from the repository; the other Agent Plugins clients list it through their own marketplaces.","","Which one do you want?"].join(`
`);function ca(e){return!0}function hi(e){return Bt.find(t=>t.id===e).label}function $t(e,t){return e==="other"?t?.trim()||"your agent":Nt.find(r=>r.id===e).label}function mi(e){return`Fetch and execute the instructions to set me up for ABDM integration from ${e}/agent-setup/prompt.md`}function ua(e){return[e,"","If this session did not open in the repository I am integrating ABDM into, ask me for the path before you write anything."].join(`
`)}function _i(e){return e.replace(/\/+$/,"")}function oe(e){return["```",e,"```"].join(`
`)}var da="abdm-integrators-assistant",pa=e=>`claude plugin marketplace add ${e} && claude plugin install ${da}@abdm-portal`,gi=e=>`codex plugin marketplace add ${e}`;function fa(e,t){return`claude://code/new?q=${encodeURIComponent(ua(["Set this project up for ABDM integration. Run:","",`claude plugin marketplace add ${t}`,"claude plugin install abdm-integrators-assistant@abdm-portal","",`If the marketplace add fails (the repository may not be accessible), instead fetch and execute the instructions from ${e}/agent-setup/prompt.md`].join(`
`)))}`}function vi(e,t,r,a){let n=mi(r);return e==="claude"?{text:["Claude Code takes the plugin, which carries every skill at once and updates in place. Run this in the repository you are integrating.","",oe(pa(a))].join(`
`),link:{href:fa(r,a),label:"Open in Claude"}}:e==="cursor"?{text:["Paste this into Cursor, or let the link put it in the composer. It fetches the current instructions from this site, so what it installs cannot go stale.","",oe(n)].join(`
`),link:{href:`cursor://anysphere.cursor-deeplink/prompt?text=${encodeURIComponent(ua(n))}`,label:"Open in Cursor"}}:e==="codex"?{text:["Codex has no URL scheme, so this is a paste. Give it to a Codex session in the repository you are integrating, and it fetches the current instructions from this site.","",oe(n)].join(`
`)}:{text:[`Any agent that can fetch a URL takes this line, ${$t(e,t)} included. The instructions live on this site and are rebuilt with it, so the pasted line cannot go stale.`,"",oe(n)].join(`
`)}}function bi(e,t,r,a){return e==="claude"?{text:["Run this in the repository you are integrating. It carries every skill at once, and `claude plugin update` keeps it current.","",oe(pa(a))].join(`
`),link:{href:fa(r,a),label:"Open in Claude"}}:e==="codex"?{text:[`Add the marketplace, then install \`${da}\` from it in Codex's plugin directory.`,"",oe(gi(a))].join(`
`)}:{text:[`The plugin is packaged to the Agent Plugins 1.0 standard, which ${$t(e,t)} reads, but that route installs from the client's own marketplace and this plugin is not listed in one yet.`,"","The skills are the same content and they install today. Ask for Skills instead."].join(`
`)}}function yi(e,t,r,a){return a?e==="claude"?{text:["User scope, so it is there in every project rather than only this directory.","",oe(`claude mcp add --transport http ${dt} ${a} -s user`)].join(`
`),link:{href:`claude://code/new?q=${encodeURIComponent(["Add the ABDM documentation MCP server, then use it to answer my ABDM questions.","","Run this:",`claude mcp add --transport http ${dt} ${a} -s user`,"","User scope, so it is available in every project rather than only this directory."].join(`
`))}`,label:"Open in Claude"}}:e==="cursor"?{text:"The link opens Cursor on a confirmation dialog, and there is no command to run.",link:{href:`cursor://anysphere.cursor-deeplink/mcp/install?name=${dt}&config=${encodeURIComponent(btoa(JSON.stringify({url:a})))}`,label:"Add to Cursor"}}:{text:[`Any client that reads an \`mcpServers\` config takes this block as it stands, ${$t(e,t)} included.`,"",oe(JSON.stringify({mcpServers:{[dt]:{url:a}}},null,2))].join(`
`)}:{text:`The server is live, but this build of the site does not carry its address, so there is no command to give you. The address is set at deploy. [Build with AI](${r}/docs/hiecm/v3/getting-started/build-with-ai) has the current one.`}}function Ht(e,t){let r=_i(t.docsOrigin);return e.tool==="plugin"?bi(e.agent,e.named,r,t.pluginRepo):e.tool==="mcp"?yi(e.agent,e.named,r,t.mcpUrl):vi(e.agent,e.named,r,t.pluginRepo)}function ha(e,t){return e.at==="tools"?fi:e.at==="agents"?`${hi(e.tool)} it is. Which agent are you working in?`:Ht(e,t).text}var ki=/\b(integrat\w*|implement\w*|build|building|develop\w*|debug\w*|troubleshoot\w*|fix|fixing|broken|failing|failed|fails|error|errors|stuck|retry|retries|sandbox|certif\w*|onboard\w*|set ?up|install\w*|scaffold\w*|test\w*|why (is|does|isn.?t|doesn.?t|am|are)|how (do|can|would|should) (i|we)|not working|does ?n.?t work)\b/i;function ma(e){return ki.test(e)}function _a(e,t,r,a){return e<=0||!r&&t<550&&e<220?0:a?e:Math.min(e,Math.max(2,Math.ceil(e/6)))}var pt="abdm-ask-ai-history";function ga(e){let r=(e.find(a=>a.from==="you")?.text.trim()??"").replace(/\s+/g," ");return r.length>72?`${r.slice(0,71)}\u2026`:r}function va(e,t){return[t,...e.filter(r=>r.id!==t.id)].slice(0,50)}function ba(e=Date.now()){try{let t=JSON.parse(localStorage.getItem(pt)??"[]");return Array.isArray(t)?t.filter(r=>r?.id&&r?.turns&&e-(r.at??0)<2592e6):[]}catch{return[]}}function zt(e){try{localStorage.setItem(pt,JSON.stringify(e))}catch{try{localStorage.setItem(pt,JSON.stringify(e.slice(0,-1)))}catch{}}}function ya(e,t){return e.filter(r=>r.id!==t)}function ka(){try{localStorage.removeItem(pt)}catch{}}var Wt="abdm-ask-ai-current";function xa(){try{return sessionStorage.getItem(Wt)}catch{return null}}function wa(e){try{sessionStorage.setItem(Wt,e)}catch{}}function Sa(){try{sessionStorage.removeItem(Wt)}catch{}}function Aa(e,t){return t&&e.find(r=>r.id===t)||null}var Ea=["I answer questions about integrating with ABDM, from this portal's documentation and API references. Every answer lists the pages it used, so you can check the source.","","**What you can ask**","","- How to do something: create an ABHA, link records, request consent.","- What an error code means, and how to fix it.","- What a field, header or term means.","","**What you can give me**","","- **A page.** Press **+** and attach any page on this portal, or open me from **Ask about this page**.","- **A file.** A request, a response, a log, a PDF or a screenshot. It is read in your browser, and only its text is sent.","- **A command.** **Scaffold**, **Design**, **Integrate** and **Debug** under the chat bar draw on that part of a module's agent skill.","","**What I will not do**","","- Write code for your project. I show curl requests. For code, install the agent skills or the MCP server in your own coding agent.","- Answer from general knowledge. A path, a header or an error code comes from this portal or not at all.","- Stand in for support, for accounts, credentials or production approval.","","Your conversations stay in this browser. **History** lists them, and **New** starts again."].join(`
`),xi=/^(?:what (?:can|do|does) (?:you|this (?:assistant|bot|chat)|the (?:ask ai )?(?:assistant|bot)|ask ai) do|what (?:is|are) (?:you|ask ai|this (?:assistant|bot))|who are you|how (?:do|can) i use (?:you|this|ask ai|the assistant)|help)\s*\??$/i;function Ra(e){return xi.test(e.trim().replace(/\s+/g," "))}var Vt=[{id:"scaffold",label:"Scaffold"},{id:"design",label:"Design"},{id:"integrate",label:"Integrate"},{id:"debug",label:"Debug"}],wi=e=>Vt.find(t=>t.id===e)?.label??e;function ft(e){let t=e.replace(/^abdm-/,"");if(/^[mp]\d$/.test(t))return t.toUpperCase();let r=t.replace(/-/g," ");return r.charAt(0).toUpperCase()+r.slice(1)}function ht(e){switch(e.status){case"used":return`Using ${ft(e.module??"")} \xB7 ${wi(e.section)}`;case"missing":return`No ${e.section} guide for ${ft(e.module??"")} yet. Answering from the docs.`;default:return"Which module is this about?"}}var Si=/^- \[([^\]]+)\]\(([^)\s]+)\)(?::\s*(.*))?$/;function Ai(e){let t=[],r=new Set;for(let a of e.split(`
`)){let n=Si.exec(a.trim());if(!n)continue;let i;try{i=new URL(n[2],"https://placeholder.invalid").pathname.replace(/\/$/,"")}catch{continue}!i.startsWith("/docs/")||r.has(i)||(r.add(i),t.push({title:n[1],path:i,description:(n[3]??"").trim()}))}return t}var Ei=e=>e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");function Ma(e,t,r=8){let a=t.toLowerCase().split(/\s+/).filter(Boolean);if(!a.length)return[];let n=[];for(let i of e){let s=i.title.toLowerCase(),l=`${i.path} ${i.description}`.toLowerCase(),d=0,c=!0;for(let f of a)if(new RegExp(`\\b${Ei(f)}`).test(s))d+=3;else if(s.includes(f))d+=2;else if(l.includes(f))d+=1;else{c=!1;break}c&&n.push({entry:i,score:d})}return n.sort((i,s)=>s.score-i.score||i.entry.title.length-s.entry.title.length).slice(0,r).map(i=>i.entry)}var Gt=e=>e.replace(/\/$/,""),Ta=(e,t)=>`${Gt(e)}${t}`,Ca=(e,t)=>`${Gt(e)}${t}.md`;function Pa(e){return/^\s*(?:<!doctype html|<html[\s>])/i.test(e)}var mt=null;function Oa(e){return mt||(mt=fetch(`${Gt(e)}/llms.txt`).then(t=>t.ok?t.text():Promise.reject(new Error(`status ${t.status}`))).then(Ai).catch(t=>{throw mt=null,t})),mt}function Ia(e){let{draft:t,busy:r,menu:a,onMenu:n,page:i,file:s,fileNote:l,fileError:d,attaching:c}=e,f=S(null),_=S(null),u=i!==null&&i.markdown!=="";return A(()=>{if(a==="closed")return;let m=v=>{_.current&&!v.composedPath().includes(_.current)&&n("closed")};return document.addEventListener("pointerdown",m,!0),()=>document.removeEventListener("pointerdown",m,!0)},[a]),o("div",{class:"ask-ai__foot",children:[o("form",{class:"ask-ai__composer",onSubmit:m=>{m.preventDefault(),e.onSend()},children:[!!(i||c||s||l||d)&&o("div",{class:"ask-ai__context",children:[c&&o("span",{class:"ask-ai__chip ask-ai__chip--pending",children:[o(Ae,{}),o("span",{class:"ask-ai__chip-text",children:["Attaching ",c]})]}),i&&!c&&o("span",{class:`ask-ai__chip${u?"":" ask-ai__chip--failed"}`,children:[o(Ae,{}),o("span",{class:"ask-ai__chip-text",children:u?i.title:`Could not attach ${i.title}`}),o("button",{type:"button",class:"ask-ai__chip-remove","aria-label":u?`Remove ${i.title}`:"Dismiss",onClick:e.onRemovePage,children:o(Be,{})})]}),l?o("span",{class:"ask-ai__chip ask-ai__chip--pending",children:[o(Ne,{}),o("span",{class:"ask-ai__chip-text",children:l})]}):s&&o("span",{class:"ask-ai__chip",children:[o(Ne,{}),o("span",{class:"ask-ai__chip-text",children:s.name}),o("span",{class:"ask-ai__chip-meta",children:[s.text.length.toLocaleString()," characters"]}),o("button",{type:"button",class:"ask-ai__chip-remove","aria-label":`Remove ${s.name}`,onClick:e.onRemoveFile,children:o(Be,{})})]}),d&&o("span",{class:"ask-ai__context-error",children:d})]}),s?.kind&&!l&&o("p",{class:"ask-ai__context-note",children:"Read here in your browser; the file itself is not sent. Names in it are yours to check before you send."}),o("div",{class:"ask-ai__bar",children:[o("div",{class:"ask-ai__add-wrap",ref:_,children:[o("button",{type:"button",class:"ask-ai__add","aria-label":"Add a file or a page","aria-haspopup":"menu","aria-expanded":a!=="closed",disabled:r,onClick:()=>n(a==="closed"?"add":"closed"),children:o(ot,{})}),a==="add"&&o("div",{class:"ask-ai__menu",role:"menu",children:[o("button",{type:"button",role:"menuitem",class:"ask-ai__menu-item",autoFocus:!0,onClick:()=>{n("closed"),f.current?.click()},children:[o(ea,{}),"Upload from computer"]}),o("button",{type:"button",role:"menuitem",class:"ask-ai__menu-item",onClick:()=>n("pages"),children:[o(Ae,{}),"Attach a page"]})]}),a==="pages"&&o(Ri,{docsOrigin:e.docsOrigin,onPick:m=>{n("closed"),e.onPage(m)},onBack:()=>n("add")})]}),o("input",{ref:f,type:"file",class:"ask-ai__picker",accept:e.accept,onChange:m=>{let v=m.currentTarget;e.onFile(v.files?.[0]),v.value=""}}),o("textarea",{ref:e.field,class:"ask-ai__input",value:t,rows:1,onInput:m=>e.onDraft(m.currentTarget.value),onKeyDown:m=>{m.key==="Enter"&&!m.shiftKey&&(m.preventDefault(),e.onSend())},placeholder:"Ask about ABDM","aria-label":"Ask the assistant"}),r?o("button",{class:"ask-ai__send ask-ai__send--stop",type:"button","aria-label":"Stop",onClick:e.onStop,children:o(Jr,{})}):o("button",{class:"ask-ai__send",type:"submit","aria-label":"Send",disabled:t.trim()==="",children:o(it,{})})]})]}),o("div",{class:"ask-ai__commands",role:"group","aria-label":"Commands",children:Vt.map(m=>o("button",{type:"button",class:"ask-ai__command","aria-pressed":e.command===m.id,onClick:()=>e.onCommand(e.command===m.id?null:m.id),children:m.label},m.id))})]})}function Ri({docsOrigin:e,onPick:t,onBack:r}){let[a,n]=R(""),[i,s]=R(null),[l,d]=R(!1),[c,f]=R(0);A(()=>{let h=!0;return Oa(e).then(m=>h&&s(m),()=>h&&d(!0)),()=>{h=!1}},[e]);let _=i?Ma(i,a):[],u=l?"The page list could not be loaded.":i?a.trim()?_.length?null:"No page matches that.":"Type to search every page.":"Loading pages";return o("div",{class:"ask-ai__menu ask-ai__menu--pages",role:"dialog","aria-label":"Attach a page",children:[o("div",{class:"ask-ai__search",children:[o("button",{type:"button",class:"ask-ai__search-back","aria-label":"Back",onClick:r,children:o(aa,{})}),o(ta,{}),o("input",{class:"ask-ai__search-field",value:a,autoFocus:!0,placeholder:"Search pages","aria-label":"Search pages",role:"combobox","aria-expanded":_.length>0,"aria-controls":"ask-ai-page-hits",onInput:h=>{n(h.currentTarget.value),f(0)},onKeyDown:h=>{h.key==="Enter"?(h.preventDefault(),_[c]&&t(_[c])):h.key==="ArrowDown"?(h.preventDefault(),f(m=>Math.min(m+1,_.length-1))):h.key==="ArrowUp"&&(h.preventDefault(),f(m=>Math.max(m-1,0)))}})]}),_.length>0&&o("ul",{class:"ask-ai__hits",id:"ask-ai-page-hits",role:"listbox",children:_.map((h,m)=>o("li",{role:"option","aria-selected":m===c,children:o("button",{type:"button",class:`ask-ai__hit${m===c?" ask-ai__hit--active":""}`,onMouseEnter:()=>f(m),onClick:()=>t(h),children:[o("span",{class:"ask-ai__hit-title",children:h.title}),o("span",{class:"ask-ai__hit-path",children:h.path.replace(/^\/docs\//,"")})]})},h.path))}),u&&o("p",{class:"ask-ai__search-status",children:u})]})}function Ua({sessions:e,currentId:t,onOpen:r,onForget:a,onClearAll:n}){return e.length?o("div",{class:"ask-ai__history",children:[o("p",{class:"ask-ai__history-label",children:"Recents"}),o("ul",{class:"ask-ai__history-list",children:e.map(i=>{let s=i.id===t,l=i.title||"Untitled conversation";return o("li",{class:`ask-ai__history-row${s?" ask-ai__history-row--current":""}`,children:[o("button",{type:"button",class:"ask-ai__history-open","aria-current":s?"true":void 0,title:l,onClick:()=>r(i),children:l}),o("button",{type:"button",class:"ask-ai__history-forget","aria-label":`Delete ${l}`,title:"Delete",onClick:()=>a(i.id),children:o(ra,{})})]},i.id)})}),o("div",{class:"ask-ai__history-foot",children:[o("span",{children:"Kept in this browser only."}),o("button",{type:"button",class:"ask-ai__history-clear",onClick:n,children:"Clear all"})]})]}):o("div",{class:"ask-ai__history ask-ai__history--empty",children:[o("p",{class:"ask-ai__history-none",children:"No conversations yet."}),o("p",{class:"ask-ai__history-note",children:"What you ask here is kept in this browser only."})]})}function Wa(e,t){for(var r in t)e[r]=t[r];return e}function qt(e,t){for(var r in e)if(r!=="__source"&&!(r in t))return!0;for(var a in t)if(a!=="__source"&&e[a]!==t[a])return!0;return!1}function Va(e,t){var r=t(),a=R({t:{__:r,u:t}}),n=a[0].t,i=a[1];return qr(function(){n.__=r,n.u=t,jt(n)&&i({t:n})},[e,r,t]),A(function(){return jt(n)&&i({t:n}),e(function(){jt(n)&&i({t:n})})},[e]),r}function jt(e){try{return!((t=e.__)===(r=e.u())&&(t!==0||1/t==1/r)||t!=t&&r!=r)}catch{return!0}var t,r}function La(e,t){this.props=e,this.context=t}function Ga(e,t){function r(n){var i=this.props.ref;return i!=n.ref&&i&&(typeof i=="function"?i(null):i.current=null),t?!t(this.props,n)||i!=n.ref:qt(this.props,n)}function a(n){return this.shouldComponentUpdate=r,we(e,n)}return a.displayName="Memo("+(e.displayName||e.name)+")",a.__f=a.prototype.isReactComponent=!0,a.type=e,a}(La.prototype=new X).isPureReactComponent=!0,La.prototype.shouldComponentUpdate=function(e,t){return qt(this.props,e)||qt(this.state,t)};var Fa=x.__b;x.__b=function(e){e.type&&e.type.__f&&e.ref&&(e.props.ref=e.ref,e.ref=null),Fa&&Fa(e)};var Ci=typeof Symbol<"u"&&Symbol.for&&Symbol.for("react.forward_ref")||3911;function ja(e){function t(r){var a=Wa({},r);return delete a.ref,e(a,r.ref||null)}return t.$$typeof=Ci,t.render=e,t.prototype.isReactComponent=t.__f=!0,t.displayName="ForwardRef("+(e.displayName||e.name)+")",t}var Pi=x.__e;x.__e=function(e,t,r,a){if(e.then){for(var n,i=t;i=i.__;)if((n=i.__c)&&n.__c)return t.__e==null&&(t.__e=r.__e,t.__k=r.__k||[]),n.__c(e,t)}Pi(e,t,r,a)};var Da=x.unmount;function Xa(e,t,r){return e&&(e.__c&&e.__c.__H&&(e.__c.__H.__.forEach(function(a){typeof a.__c=="function"&&a.__c()}),e.__c.__H=null),(e=Wa({},e)).__c!=null&&(e.__c.__P===r&&(e.__c.__P=t),e.__c.__e=!0,e.__c=null),e.__k=e.__k&&e.__k.map(function(a){return Xa(a,t,r)})),e}function qa(e,t,r){return e&&r&&(e.__v=null,e.__k=e.__k&&e.__k.map(function(a){return qa(a,t,r)}),e.__c&&e.__c.__P===t&&(e.__e&&r.appendChild(e.__e),e.__c.__e=!0,e.__c.__P=r)),e}function Xt(){this.__u=0,this.o=null,this.__b=null}function Ya(e){var t=e.__&&e.__.__c;return t&&t.__a&&t.__a(e)}function _t(){this.i=null,this.l=null}x.unmount=function(e){var t=e.__c;t&&(t.__z=!0),t&&t.__R&&t.__R(),t&&32&e.__u&&(e.type=null),Da&&Da(e)},(Xt.prototype=new X).__c=function(e,t){var r=t.__c,a=this;a.o==null&&(a.o=[]),a.o.push(r);var n=Ya(a.__v),i=!1,s=function(){i||a.__z||(i=!0,r.__R=null,n?n(d):d())};r.__R=s;var l=r.__P;r.__P=null;var d=function(){if(!--a.__u){if(a.state.__a){var c=a.state.__a;a.__v.__k[0]=qa(c,c.__c.__P,c.__c.__O)}var f;for(a.setState({__a:a.__b=null});f=a.o.pop();)f.__P=l,f.forceUpdate()}};a.__u++||32&t.__u||a.setState({__a:a.__b=a.__v.__k[0]}),e.then(s,s)},Xt.prototype.componentWillUnmount=function(){this.o=[]},Xt.prototype.render=function(e,t){if(this.__b){if(this.__v.__k){var r=document.createElement("div"),a=this.__v.__k[0].__c;this.__v.__k[0]=Xa(this.__b,r,a.__O=a.__P)}this.__b=null}var n=t.__a&&we($,null,e.fallback);return n&&(n.__u&=-33),[we($,null,t.__a?null:e.children),n]};var Ba=function(e,t,r){if(++r[1]===r[0]&&e.l.delete(t),e.props.revealOrder&&(e.props.revealOrder[0]!=="t"||!e.l.size))for(r=e.i;r;){for(;r.length>3;)r.pop()();if(r[1]<r[0])break;e.i=r=r[2]}};(_t.prototype=new X).__a=function(e){var t=this,r=Ya(t.__v),a=t.l.get(e);return a[0]++,function(n){var i=function(){t.props.revealOrder?(a.push(n),Ba(t,e,a)):n()};r?r(i):i()}},_t.prototype.render=function(e){this.i=null,this.l=new Map;var t=Ue(e.children);e.revealOrder&&e.revealOrder[0]==="b"&&t.reverse();for(var r=t.length;r--;)this.l.set(t[r],this.i=[1,0,this.i]);return e.children},_t.prototype.componentDidUpdate=_t.prototype.componentDidMount=function(){var e=this;this.l.forEach(function(t,r){Ba(e,r,t)})};var Oi=typeof Symbol<"u"&&Symbol.for&&Symbol.for("react.element")||60103,Ii=/^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|dominant|fill|flood|font|glyph(?!R)|horiz|image(!S)|letter|lighting|marker(?!H|W|U)|overline|paint|pointer|shape|stop|strikethrough|stroke|text(?!L)|transform|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/,Ui=/^on(Ani|Tra|Tou|BeforeInp|Compo)/,Li=/[A-Z0-9]/g,Fi=typeof document<"u",Di=function(e){return(typeof Symbol<"u"&&typeof Symbol()=="symbol"?/fil|che|rad/:/fil|che|ra/).test(e)};X.prototype.isReactComponent=!0,["componentWillMount","componentWillReceiveProps","componentWillUpdate"].forEach(function(e){Object.defineProperty(X.prototype,e,{configurable:!0,get:function(){return this["UNSAFE_"+e]},set:function(t){Object.defineProperty(this,e,{configurable:!0,writable:!0,value:t})}})});var Na=x.event;x.event=function(e){return Na&&(e=Na(e)),e.persist=function(){},e.isPropagationStopped=function(){return this.cancelBubble},e.isDefaultPrevented=function(){return this.defaultPrevented},e.nativeEvent=e};var Ja,Bi={configurable:!0,get:function(){return this.class}},$a=x.vnode;x.vnode=function(e){typeof e.type=="string"&&(function(t){var r=t.props,a=t.type,n={},i=a.indexOf("-")==-1;for(var s in r){var l=r[s];if(!(s==="value"&&"defaultValue"in r&&l==null||Fi&&s==="children"&&a==="noscript"||s==="class"||s==="className")){var d=s.toLowerCase();s==="defaultValue"&&"value"in r&&r.value==null?s="value":s==="download"&&l===!0?l="":d==="translate"&&l==="no"?l=!1:d[0]==="o"&&d[1]==="n"?d==="ondoubleclick"?s="ondblclick":d!=="onchange"||a!=="input"&&a!=="textarea"||Di(r.type)?d==="onfocus"?s="onfocusin":d==="onblur"?s="onfocusout":Ui.test(s)&&(s=d):d=s="oninput":i&&Ii.test(s)?s=s.replace(Li,"-$&").toLowerCase():l===null&&(l=void 0),d==="oninput"&&n[s=d]&&(s="oninputCapture"),n[s]=l}}a=="select"&&(n.multiple&&Array.isArray(n.value)&&(n.value=Ue(r.children).forEach(function(c){c.props.selected=n.value.indexOf(c.props.value)!=-1})),n.defaultValue!=null&&(n.value=Ue(r.children).forEach(function(c){c.props.selected=n.multiple?n.defaultValue.indexOf(c.props.value)!=-1:n.defaultValue==c.props.value}))),r.class&&!r.className?(n.class=r.class,Object.defineProperty(n,"className",Bi)):r.className&&(n.class=n.className=r.className),t.props=n})(e),e.$$typeof=Oi,$a&&$a(e)};var Ha=x.__r;x.__r=function(e){Ha&&Ha(e),Ja=e.__c};var za=x.diffed;x.diffed=function(e){za&&za(e);var t=e.props,r=e.__e;r!=null&&e.type==="textarea"&&"value"in t&&t.value!==r.value&&(r.value=t.value==null?"":t.value),Ja=null};var Ka=`#version 300 es
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
}`;var Qa=1920*1080*4,$e=class{parentElement;canvasElement;gl;program=null;uniformLocations={};fragmentShader;rafId=null;lastRenderTime=0;currentFrame=0;speed=0;currentSpeed=0;providedUniforms;mipmaps=[];hasBeenDisposed=!1;resolutionChanged=!0;textures=new Map;minPixelRatio;maxPixelCount;isSafari=zi();uniformCache={};textureUnitMap=new Map;ownerDocument;constructor(t,r,a,n,i=0,s=0,l=2,d=Qa,c=[]){if(t?.nodeType===1)this.parentElement=t;else throw new Error("Paper Shaders: parent element must be an HTMLElement");if(this.ownerDocument=t.ownerDocument,!this.ownerDocument.querySelector("style[data-paper-shader]")){let u=this.ownerDocument.createElement("style");u.innerHTML=Hi,u.setAttribute("data-paper-shader",""),this.ownerDocument.head.prepend(u)}let f=this.ownerDocument.createElement("canvas");this.canvasElement=f,this.parentElement.prepend(f),this.fragmentShader=r,this.providedUniforms=a,this.mipmaps=c,this.currentFrame=s,this.minPixelRatio=l,this.maxPixelCount=d;let _=f.getContext("webgl2",n);if(!_)throw new Error("Paper Shaders: WebGL is not supported in this browser");this.gl=_,this.initProgram(),this.setupPositionAttribute(),this.setupUniforms(),this.setUniformValues(this.providedUniforms),this.setupResizeObserver(),visualViewport?.addEventListener("resize",this.handleVisualViewportChange),this.setupIntersectionObserver(),this.setSpeed(i),this.parentElement.setAttribute("data-paper-shader",""),this.parentElement.paperShaderMount=this,this.ownerDocument.addEventListener("visibilitychange",this.handleDocumentVisibilityChange)}initProgram=()=>{let t=$i(this.gl,Ka,this.fragmentShader);t&&(this.program=t)};setupPositionAttribute=()=>{let t=this.gl.getAttribLocation(this.program,"a_position"),r=this.gl.createBuffer();this.gl.bindBuffer(this.gl.ARRAY_BUFFER,r);let a=[-1,-1,1,-1,-1,1,-1,1,1,-1,1,1];this.gl.bufferData(this.gl.ARRAY_BUFFER,new Float32Array(a),this.gl.STATIC_DRAW),this.gl.enableVertexAttribArray(t),this.gl.vertexAttribPointer(t,2,this.gl.FLOAT,!1,0,0)};setupUniforms=()=>{let t={u_time:this.gl.getUniformLocation(this.program,"u_time"),u_pixelRatio:this.gl.getUniformLocation(this.program,"u_pixelRatio"),u_resolution:this.gl.getUniformLocation(this.program,"u_resolution")};Object.entries(this.providedUniforms).forEach(([r,a])=>{if(t[r]=this.gl.getUniformLocation(this.program,r),a instanceof HTMLImageElement){let n=`${r}AspectRatio`;t[n]=this.gl.getUniformLocation(this.program,n)}}),this.uniformLocations=t};renderScale=1;parentWidth=0;parentHeight=0;parentDevicePixelWidth=0;parentDevicePixelHeight=0;devicePixelsSupported=!1;intersectionObserver=null;isInViewport=!0;resizeObserver=null;setupResizeObserver=()=>{this.resizeObserver=new ResizeObserver(([t])=>{if(t?.borderBoxSize[0]){let r=t.devicePixelContentBoxSize?.[0];r!==void 0&&(this.devicePixelsSupported=!0,this.parentDevicePixelWidth=r.inlineSize,this.parentDevicePixelHeight=r.blockSize),this.parentWidth=t.borderBoxSize[0].inlineSize,this.parentHeight=t.borderBoxSize[0].blockSize}this.handleResize()}),this.resizeObserver.observe(this.parentElement)};setupIntersectionObserver=()=>{let t=this.ownerDocument.defaultView;t?.IntersectionObserver&&(this.intersectionObserver=new t.IntersectionObserver(([r])=>{this.isInViewport=r?.isIntersecting??!0,this.updateCurrentSpeed()}),this.intersectionObserver.observe(this.parentElement))};handleVisualViewportChange=()=>{this.resizeObserver?.disconnect(),this.setupResizeObserver()};handleResize=()=>{let t=0,r=0,a=Math.max(1,window.devicePixelRatio),n=visualViewport?.scale??1;if(this.devicePixelsSupported){let f=Math.max(1,this.minPixelRatio/a);t=this.parentDevicePixelWidth*f*n,r=this.parentDevicePixelHeight*f*n}else{let f=Math.max(a,this.minPixelRatio)*n;if(this.isSafari){let _=Wi(this.ownerDocument);f*=Math.max(1,_)}t=Math.round(this.parentWidth)*f,r=Math.round(this.parentHeight)*f}let i=Math.sqrt(this.maxPixelCount)/Math.sqrt(t*r),s=Math.min(1,i),l=Math.round(t*s),d=Math.round(r*s),c=l/Math.round(this.parentWidth);(this.canvasElement.width!==l||this.canvasElement.height!==d||this.renderScale!==c)&&(this.renderScale=c,this.canvasElement.width=l,this.canvasElement.height=d,this.resolutionChanged=!0,this.gl.viewport(0,0,this.gl.canvas.width,this.gl.canvas.height),this.render(performance.now()))};render=t=>{if(this.hasBeenDisposed)return;if(this.program===null){console.warn("Tried to render before program or gl was initialized");return}let r=t-this.lastRenderTime;this.lastRenderTime=t,this.currentSpeed!==0&&(this.currentFrame+=r*this.currentSpeed),this.gl.clear(this.gl.COLOR_BUFFER_BIT),this.gl.useProgram(this.program),this.gl.uniform1f(this.uniformLocations.u_time,this.currentFrame*.001),this.resolutionChanged&&(this.gl.uniform2f(this.uniformLocations.u_resolution,this.gl.canvas.width,this.gl.canvas.height),this.gl.uniform1f(this.uniformLocations.u_pixelRatio,this.renderScale),this.resolutionChanged=!1),this.gl.drawArrays(this.gl.TRIANGLES,0,6),this.currentSpeed!==0?this.requestRender():this.rafId=null};requestRender=()=>{this.rafId!==null&&cancelAnimationFrame(this.rafId),this.rafId=requestAnimationFrame(this.render)};setTextureUniform=(t,r)=>{if(!r.complete||r.naturalWidth===0)throw new Error(`Paper Shaders: image for uniform ${t} must be fully loaded`);let a=this.textures.get(t);a&&this.gl.deleteTexture(a),this.textureUnitMap.has(t)||this.textureUnitMap.set(t,this.textureUnitMap.size);let n=this.textureUnitMap.get(t);this.gl.activeTexture(this.gl.TEXTURE0+n);let i=this.gl.createTexture();this.gl.bindTexture(this.gl.TEXTURE_2D,i),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_WRAP_S,this.gl.CLAMP_TO_EDGE),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_WRAP_T,this.gl.CLAMP_TO_EDGE),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MIN_FILTER,this.gl.LINEAR),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MAG_FILTER,this.gl.LINEAR),this.gl.texImage2D(this.gl.TEXTURE_2D,0,this.gl.RGBA,this.gl.RGBA,this.gl.UNSIGNED_BYTE,r),this.mipmaps.includes(t)&&(this.gl.generateMipmap(this.gl.TEXTURE_2D),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MIN_FILTER,this.gl.LINEAR_MIPMAP_LINEAR));let s=this.gl.getError();if(s!==this.gl.NO_ERROR||i===null){console.error("Paper Shaders: WebGL error when uploading texture:",s);return}this.textures.set(t,i);let l=this.uniformLocations[t];if(l){this.gl.uniform1i(l,n);let d=`${t}AspectRatio`,c=this.uniformLocations[d];if(c){let f=r.naturalWidth/r.naturalHeight;this.gl.uniform1f(c,f)}}};areUniformValuesEqual=(t,r)=>t===r?!0:Array.isArray(t)&&Array.isArray(r)&&t.length===r.length?t.every((a,n)=>this.areUniformValuesEqual(a,r[n])):!1;setUniformValues=t=>{this.gl.useProgram(this.program),Object.entries(t).forEach(([r,a])=>{let n=a;if(a instanceof HTMLImageElement&&(n=`${a.src.slice(0,200)}|${a.naturalWidth}x${a.naturalHeight}`),this.areUniformValuesEqual(this.uniformCache[r],n))return;this.uniformCache[r]=n;let i=this.uniformLocations[r];if(!i){console.warn(`Uniform location for ${r} not found`);return}if(a instanceof HTMLImageElement)this.setTextureUniform(r,a);else if(Array.isArray(a)){let s=null,l=null;if(a[0]!==void 0&&Array.isArray(a[0])){let d=a[0].length;if(a.every(c=>c.length===d))s=a.flat(),l=d;else{console.warn(`All child arrays must be the same length for ${r}`);return}}else s=a,l=s.length;switch(l){case 2:this.gl.uniform2fv(i,s);break;case 3:this.gl.uniform3fv(i,s);break;case 4:this.gl.uniform4fv(i,s);break;case 9:this.gl.uniformMatrix3fv(i,!1,s);break;case 16:this.gl.uniformMatrix4fv(i,!1,s);break;default:console.warn(`Unsupported uniform array length: ${l}`)}}else typeof a=="number"?this.gl.uniform1f(i,a):typeof a=="boolean"?this.gl.uniform1i(i,a?1:0):console.warn(`Unsupported uniform type for ${r}: ${typeof a}`)})};getCurrentFrame=()=>this.currentFrame;setFrame=t=>{this.currentFrame=t,this.lastRenderTime=performance.now(),this.render(performance.now())};setSpeed=(t=1)=>{this.speed=t,this.updateCurrentSpeed()};updateCurrentSpeed=()=>{this.setCurrentSpeed(this.ownerDocument.hidden||!this.isInViewport?0:this.speed)};setCurrentSpeed=t=>{this.currentSpeed=t,this.rafId===null&&t!==0&&(this.lastRenderTime=performance.now(),this.rafId=requestAnimationFrame(this.render)),this.rafId!==null&&t===0&&(cancelAnimationFrame(this.rafId),this.rafId=null)};setMaxPixelCount=(t=Qa)=>{this.maxPixelCount=t,this.handleResize()};setMinPixelRatio=(t=2)=>{this.minPixelRatio=t,this.handleResize()};setUniforms=t=>{this.setUniformValues(t),this.providedUniforms={...this.providedUniforms,...t},this.render(performance.now())};handleDocumentVisibilityChange=()=>{this.updateCurrentSpeed()};dispose=()=>{this.hasBeenDisposed=!0,this.rafId!==null&&(cancelAnimationFrame(this.rafId),this.rafId=null),this.gl&&this.program&&(this.textures.forEach(t=>{this.gl.deleteTexture(t)}),this.textures.clear(),this.gl.deleteProgram(this.program),this.program=null,this.gl.bindBuffer(this.gl.ARRAY_BUFFER,null),this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER,null),this.gl.bindRenderbuffer(this.gl.RENDERBUFFER,null),this.gl.bindFramebuffer(this.gl.FRAMEBUFFER,null),this.gl.getError()),this.resizeObserver&&(this.resizeObserver.disconnect(),this.resizeObserver=null),this.intersectionObserver&&(this.intersectionObserver.disconnect(),this.intersectionObserver=null),visualViewport?.removeEventListener("resize",this.handleVisualViewportChange),this.ownerDocument.removeEventListener("visibilitychange",this.handleDocumentVisibilityChange),this.uniformLocations={},this.canvasElement.remove(),delete this.parentElement.paperShaderMount}};function Za(e,t,r){let a=e.createShader(t);return a?(e.shaderSource(a,r),e.compileShader(a),e.getShaderParameter(a,e.COMPILE_STATUS)?a:(console.error("An error occurred compiling the shaders: "+e.getShaderInfoLog(a)),e.deleteShader(a),null)):null}function $i(e,t,r){let a=e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT),n=a?a.precision:null;n&&n<23&&(t=t.replace(/precision\s+(lowp|mediump)\s+float;/g,"precision highp float;"),r=r.replace(/precision\s+(lowp|mediump)\s+float/g,"precision highp float").replace(/\b(uniform|varying|attribute)\s+(lowp|mediump)\s+(\w+)/g,"$1 highp $3"));let i=Za(e,e.VERTEX_SHADER,t),s=Za(e,e.FRAGMENT_SHADER,r);if(!i||!s)return null;let l=e.createProgram();return l?(e.attachShader(l,i),e.attachShader(l,s),e.linkProgram(l),e.getProgramParameter(l,e.LINK_STATUS)?(e.detachShader(l,i),e.detachShader(l,s),e.deleteShader(i),e.deleteShader(s),l):(console.error("Unable to initialize the shader program: "+e.getProgramInfoLog(l)),e.deleteProgram(l),e.deleteShader(i),e.deleteShader(s),null)):null}var Hi=`@layer paper-shaders {
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
}`;function zi(){let e=navigator.userAgent.toLowerCase();return e.includes("safari")&&!e.includes("chrome")&&!e.includes("android")}function Wi(e){let t=visualViewport?.scale??1,r=visualViewport?.width??window.innerWidth,a=window.innerWidth-e.documentElement.clientWidth,n=t*r+a,i=outerWidth/n,s=Math.round(100*i);return s%5===0?s/100:s===33?1/3:s===67?2/3:s===133?4/3:i}var Ee={fit:"contain",scale:1,rotation:0,offsetX:0,offsetY:0,originX:.5,originY:.5,worldWidth:0,worldHeight:0};var Yt={none:0,contain:1,cover:2};var en=`
#define TWO_PI 6.28318530718
#define PI 3.14159265358979323846
`,tn=`
vec2 rotate(vec2 uv, float th) {
  return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
}
`;var rn=`
  float hash21(vec2 p) {
    p = fract(p * vec2(0.3183099, 0.3678794)) + 0.1;
    p += dot(p, p + 19.19);
    return fract(p.x * p.y);
  }
`;var Jt={maxColorCount:10},Kt=`#version 300 es
precision mediump float;

uniform float u_time;

uniform vec4 u_colors[${Jt.maxColorCount}];
uniform float u_colorsCount;

uniform float u_distortion;
uniform float u_swirl;
uniform float u_grainMixer;
uniform float u_grainOverlay;

in vec2 v_objectUV;
out vec4 fragColor;

${en}
${tn}
${rn}

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

  for (int i = 0; i < ${Jt.maxColorCount}; i++) {
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
`;function Qt(e){if(Array.isArray(e))return e.length===4?e:e.length===3?[...e,1]:Re;if(typeof e!="string")return Re;let t,r,a,n=1;if(e.startsWith("#"))[t,r,a,n]=Vi(e);else if(e.startsWith("rgb")){let i=Gi(e);if(i===null)return Re;[t,r,a,n]=i}else if(e.startsWith("hsl")){let i=ji(e);if(i===null)return Re;[t,r,a,n]=Xi(i)}else return console.error("Unsupported color format",e),Re;return[gt(t,0,1),gt(r,0,1),gt(a,0,1),gt(n,0,1)]}function Vi(e){if(e=e.replace(/^#/,""),(e.length===3||e.length===4)&&(e=e.split("").map(i=>i+i).join("")),e.length===6&&(e=e+"ff"),!/^[0-9a-f]{8}$/i.test(e))return console.warn("Invalid hex color"),Re;let t=parseInt(e.slice(0,2),16)/255,r=parseInt(e.slice(2,4),16)/255,a=parseInt(e.slice(4,6),16)/255,n=parseInt(e.slice(6,8),16)/255;return[t,r,a,n]}function Gi(e){let t=e.match(/^rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([0-9.]+))?\s*\)$/i);return t?[parseInt(t[1]??"0")/255,parseInt(t[2]??"0")/255,parseInt(t[3]??"0")/255,t[4]===void 0?1:parseFloat(t[4])]:null}function ji(e){let t=e.match(/^hsla?\s*\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*(?:,\s*([0-9.]+))?\s*\)$/i);return t?[parseInt(t[1]??"0"),parseInt(t[2]??"0"),parseInt(t[3]??"0"),t[4]===void 0?1:parseFloat(t[4])]:null}function Xi(e){let[t,r,a,n]=e,i=t/360,s=r/100,l=a/100,d,c,f;if(r===0)d=c=f=l;else{let _=(m,v,g)=>(g<0&&(g+=1),g>1&&(g-=1),g<.16666666666666666?m+(v-m)*6*g:g<.5?v:g<.6666666666666666?m+(v-m)*(.6666666666666666-g)*6:m),u=l<.5?l*(1+s):l+s-l*s,h=2*l-u;d=_(h,u,i+1/3),c=_(h,u,i),f=_(h,u,i-1/3)}return[d,c,f,n]}var gt=(e,t,r)=>Math.min(Math.max(e,t),r),Re=[.5,.5,.5,1];var Zt="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";function an(e){let t=S(void 0),r=Ut(a=>{let n=e.map(i=>{if(i!=null){if(typeof i=="function"){let s=i,l=s(a);return typeof l=="function"?l:()=>{s(null)}}return i.current=a,()=>{i.current=null}}});return()=>{n.forEach(i=>i?.())}},e);return Fe(()=>e.every(a=>a==null)?null:a=>{t.current&&(t.current(),t.current=void 0),a!=null&&(t.current=r(a))},e)}function er(e){if(e.naturalWidth<1024&&e.naturalHeight<1024){if(e.naturalWidth<1||e.naturalHeight<1)return;let t=e.naturalWidth/e.naturalHeight;e.width=Math.round(t>1?1024*t:1024),e.height=Math.round(t>1?1024:1024/t)}}async function nn(e){let t={},r=[],a=i=>{try{return i.startsWith("/")||new URL(i),!0}catch{return!1}},n=i=>{try{return i.startsWith("/")?!1:new URL(i,window.location.origin).origin!==window.location.origin}catch{return!1}};return Object.entries(e).forEach(([i,s])=>{if(typeof s=="string"){let l=s||Zt;if(!a(l)){console.warn(`Uniform "${i}" has invalid URL "${l}". Skipping image loading.`);return}let d=new Promise((c,f)=>{let _=new Image;n(l)&&(_.crossOrigin="anonymous"),_.onload=()=>{er(_),t[i]=_,c()},_.onerror=()=>{console.error(`Could not set uniforms. Failed to load image at ${l}`),f()},_.src=l});r.push(d)}else if(s instanceof HTMLImageElement){let l=s.decode().then(()=>{er(s),t[i]=s});r.push(l)}else t[i]=s}),await Promise.all(r),t}var tr=ja(function({fragmentShader:t,uniforms:r,webGlContextAttributes:a,speed:n=0,frame:i=0,width:s,height:l,minPixelRatio:d,maxPixelCount:c,mipmaps:f,style:_,...u},h){let[m,v]=R(!1),g=S(null),y=S(null),w=S(a);A(()=>((async()=>{let L=await nn(r);g.current&&!y.current&&(y.current=new $e(g.current,t,L,w.current,n,i,d,c,f),v(!0))})(),()=>{y.current?.dispose(),y.current=null}),[t]),A(()=>{let I=!1;return(async()=>{let M=await nn(r);I||y.current?.setUniforms(M)})(),()=>{I=!0}},[r,m]),A(()=>{y.current?.setSpeed(n)},[n,m]),A(()=>{y.current?.setMaxPixelCount(c)},[c,m]),A(()=>{y.current?.setMinPixelRatio(d)},[d,m]),A(()=>{y.current?.setFrame(i)},[i,m]);let P=an([g,h]);return o("div",{ref:P,style:s!==void 0||l!==void 0?{width:typeof s=="string"&&isNaN(+s)===!1?+s:s,height:typeof l=="string"&&isNaN(+l)===!1?+l:l,..._}:_,...u})});tr.displayName="ShaderMount";function on(e,t){if(Object.keys(e).length!==Object.keys(t).length)return!1;for(let r in e){if(r==="colors"){let a=Array.isArray(e.colors),n=Array.isArray(t.colors);if(!a||!n){if(Object.is(e.colors,t.colors)===!1)return!1;continue}if(e.colors?.length!==t.colors?.length||!e.colors?.every((i,s)=>i===t.colors?.[s]))return!1;continue}if(Object.is(e[r],t[r])===!1)return!1}return!0}var H={name:"Default",params:{...Ee,speed:1,frame:0,colors:["#e0eaff","#241d9a","#f75092","#9f50d3"],distortion:.8,swirl:.1,grainMixer:0,grainOverlay:0}},Ws={name:"Purple",params:{...Ee,speed:.6,frame:0,colors:["#aaa7d7","#3c2b8e"],distortion:1,swirl:1,grainMixer:0,grainOverlay:0}},Vs={name:"Beach",params:{...Ee,speed:.1,frame:0,colors:["#bcecf6","#00aaff","#00f7ff","#ffd447"],distortion:.8,swirl:.35,grainMixer:0,grainOverlay:0}},Gs={name:"Ink",params:{...Ee,speed:1,frame:0,colors:["#ffffff","#000000"],distortion:1,swirl:.2,rotation:90,grainMixer:0,grainOverlay:0}};var rr=Ga(function({speed:t=H.params.speed,frame:r=H.params.frame,colors:a=H.params.colors,distortion:n=H.params.distortion,swirl:i=H.params.swirl,grainMixer:s=H.params.grainMixer,grainOverlay:l=H.params.grainOverlay,fit:d=H.params.fit,rotation:c=H.params.rotation,scale:f=H.params.scale,originX:_=H.params.originX,originY:u=H.params.originY,offsetX:h=H.params.offsetX,offsetY:m=H.params.offsetY,worldWidth:v=H.params.worldWidth,worldHeight:g=H.params.worldHeight,...y}){let w={u_colors:a.map(Qt),u_colorsCount:a.length,u_distortion:n,u_swirl:i,u_grainMixer:s,u_grainOverlay:l,u_fit:Yt[d],u_rotation:c,u_scale:f,u_offsetX:h,u_offsetY:m,u_originX:_,u_originY:u,u_worldWidth:v,u_worldHeight:g};return o(tr,{...y,speed:t,frame:r,fragmentShader:Kt,uniforms:w})},on);var He="#fb7185",ze="#f43f5e",ar=e=>{let t=e.replace("#",""),r=t.length===3?t.split("").map(n=>n+n).join(""):t,a=Number.parseInt(r,16);return[a>>16&255,a>>8&255,a&255]},nr=(e,t)=>{switch(e){case"listening":return .4+.32*Math.abs(Math.sin(t*8.5))+.18*Math.abs(Math.sin(t*4.1+1.5));case"speaking":return .3+.24*Math.abs(Math.sin(t*6.2))+.16*Math.abs(Math.sin(t*3+.6));case"thinking":return .24+.2*Math.abs(Math.sin(t*2.4));case"connecting":return .12+.1*Math.abs(Math.sin(t*1.6));case"error":return .2;default:return 0}},fe=(e,t,r,a)=>e+(t-e)*(1-Math.exp(-r*a)),sn=({size:e,speed:t,colorFrom:r,colorTo:a})=>{let n={};return e!=null&&(n["--orb-size"]=`${e}px`),t!=null&&(n["--orb-speed"]=`${t}`),r&&(n["--orb-color-from"]=r),a&&(n["--orb-color-to"]=a),n};var vt=(e,t)=>{let r=!0,a=document.visibilityState==="visible",n=r&&a,i=()=>{let d=r&&a;d!==n&&(n=d,t(d))},s=new IntersectionObserver(d=>{r=d[d.length-1]?.isIntersecting??!0,i()});s.observe(e);let l=()=>{a=document.visibilityState==="visible",i()};return document.addEventListener("visibilitychange",l),()=>{s.disconnect(),document.removeEventListener("visibilitychange",l)}},We=null,ln=()=>{if(We!==null)return We;try{let e=document.createElement("canvas"),t={failIfMajorPerformanceCaveat:!0};We=e.getContext("webgl2",t)!==null||e.getContext("webgl",t)!==null}catch{We=!1}return We};var pn="(prefers-reduced-motion: reduce)",qi=e=>{let t=window.matchMedia(pn);return t.addEventListener("change",e),()=>t.removeEventListener("change",e)},Yi=()=>Va(qi,()=>window.matchMedia(pn).matches),he=(e,t,r)=>{let[a,n,i]=ar(e),[s,l,d]=ar(t),c=(f,_)=>Math.round(f+(_-f)*r).toString(16).padStart(2,"0");return`#${c(a,s)}${c(n,l)}${c(i,d)}`},fn=(e,t)=>he(e,"#000000",t),bt=(e,t)=>he(e,"#ffffff",t),hn=(e,t)=>[fn(e,.35),e,he(e,t,.5),t,bt(t,.35)],cn=hn(He,ze),Ji={antialias:!0,powerPreference:"low-power"},Ki=8e3,Qi=66,Zi=.1,eo=7.5,un=6,to=5,ro=6,ao=6,no=.9,io=e=>e==="error"?1.8:e==="listening"?1.6:e==="speaking"?1.1:e==="thinking"?.95:e==="connecting"?.5:.3,ir=e=>e==="error"?.2:e==="speaking"?.18:e==="listening"?.16:e==="thinking"?.1:e==="connecting"?.08:.06,oo={distortion:.42,swirl:.26},or=(e,t,r=oo)=>{switch(e){case"thinking":return{distortion:.35,swirl:Math.min(1,.75+t*.2)};case"listening":case"speaking":return{distortion:Math.min(1,.5+t*.4),swirl:Math.min(1,.3+t*.25)};case"error":return{distortion:.85,swirl:.55};case"connecting":return{distortion:Math.min(1,.42+t*.55),swirl:.3};default:return r}},mn=(e,t)=>e==="disabled"?0:io(e)*t,dn=(e,t,r)=>({energy:0,...or(e,0,r),shaderSpeed:mn(e,t),grain:ir(e),errorMix:e==="error"?1:0}),Me=(e,t)=>Math.round(e*t)/t,so=(e,t)=>e.energy===t.energy&&e.distortion===t.distortion&&e.swirl===t.swirl&&e.shaderSpeed===t.shaderSpeed&&e.grain===t.grain&&e.errorMix===t.errorMix,sr=({state:e="idle",size:t=160,speed:r=1,colorFrom:a="#7c3aed",colorTo:n="#06b6d4",colors:i,idleMotion:s,meshScale:l=1.15,gloss:d=!0,levelRef:c,label:f="Assistant orb",className:_})=>{let u=S(null),h=S(null),m=S(e),v=S(r),g=Yi(),y=ln(),w=S(s);w.current=s;let[P,I]=R(()=>dn(e,r,s)),L=S(null);A(()=>{m.current=e,v.current=r}),A(()=>{if(g)return;let F=u.current;if(!F)return;L.current===null&&(L.current=dn(m.current,v.current,w.current));let E=L.current,z=0,q=null,Ge=0,ce=0,me=!0,ue=G=>{z=0;let K=Math.min(Zi,q===null?1/60:(G-q)/1e3);q=G;let ae=m.current,Q=v.current;Ge+=K*Q;let _e=c?.current,ge=typeof _e=="number"&&_e>=0;E.energy=fe(E.energy,ge?_e:nr(ae,Ge),eo,K);let ve=or(ae,E.energy,w.current);if(E.distortion=fe(E.distortion,ve.distortion,un,K),E.swirl=fe(E.swirl,ve.swirl,un,K),E.shaderSpeed=fe(E.shaderSpeed,mn(ae,Q),to,K),E.grain=fe(E.grain,ir(ae),ro,K),E.errorMix=fe(E.errorMix,ae==="error"?1:0,ao,K),F.style.setProperty("--orb-level",E.energy.toFixed(3)),y&&G-ce>Qi){ce=G;let ne={energy:Me(E.energy,50),distortion:Me(E.distortion,100),swirl:Me(E.swirl,100),shaderSpeed:Me(E.shaderSpeed,100),grain:Me(E.grain,200),errorMix:Me(E.errorMix,100)};I(yt=>so(yt,ne)?yt:ne)}me&&(z=requestAnimationFrame(ue))},de=()=>{z===0&&(q=null,z=requestAnimationFrame(ue))},je=()=>{z!==0&&(cancelAnimationFrame(z),z=0),q=null},Te=vt(F,G=>{me=G,G?de():je()});return de(),()=>{je(),Te()}},[c,g,y]),A(()=>{if(e!=="error"||g)return;let F=h.current;if(!F)return;let E=F.animate([{transform:"translateX(0)"},{transform:"translateX(-1.5px)"},{transform:"translateX(3px)"},{transform:"translateX(-2px)"},{transform:"translateX(1px)"},{transform:"translateX(0)"}],{duration:340,easing:"ease-out"});return()=>E.cancel()},[e,g]);let M=nr(e,no),V=g?{energy:M,...or(e,M,s),shaderSpeed:0,grain:ir(e),errorMix:e==="error"?1:0}:P,T=y?V.errorMix:e==="error"?1:0,re=T>=1?He:T<=0?a:he(a,He,T),U=T>=1?ze:T<=0?n:he(n,ze,T),B=i??hn(a,n),se=T>=1?cn:T<=0?B:B.map((F,E)=>he(F,cn[E],T)),Ve=[{key:"brand",from:a,to:n,visible:e!=="error"},{key:"error",from:He,to:ze,visible:e==="error"}].map(({key:F,from:E,to:z,visible:q})=>({key:F,visible:q,base:`radial-gradient(circle at 50% 40%, ${bt(E,.12)}, ${he(E,z,.55)} 55%, ${fn(z,.35)} 100%)`,glow:`radial-gradient(circle at 32% 26%, ${bt(z,.45)}, transparent 55%), radial-gradient(circle at 66% 72%, ${bt(E,.2)}, transparent 62%)`})),le={...sn({size:t,speed:r,colorFrom:a,colorTo:n}),...g?{"--orb-level":M.toFixed(3)}:null,width:t,height:t,position:"relative",borderRadius:"50%",opacity:e==="disabled"?.5:1,filter:e==="disabled"?"grayscale(0.85)":"grayscale(0)",transform:y?`scale(${(1+V.energy*.06).toFixed(4)})`:void 0,scale:y?void 0:"calc(1 + var(--orb-level, 0) * 0.06)",transition:"transform 0.2s ease-out, opacity 0.3s ease-out, filter 0.3s ease-out"};return o("div",{ref:u,role:"img","aria-label":f,"data-state":e,class:_,style:le,children:[o("div",{style:{position:"absolute",inset:0,borderRadius:"50%",boxShadow:`0 ${-t*.06}px ${t*.3}px color-mix(in oklab, ${re} 55%, transparent), 0 ${t*.06}px ${t*.3}px color-mix(in oklab, ${U} 55%, transparent)`,opacity:y?Math.min(1,.35+V.energy*.65):"calc(0.35 + var(--orb-level, 0) * 0.6)",transform:y?`scale(${(1+V.energy*.08).toFixed(4)})`:void 0,scale:y?void 0:"calc(1 + var(--orb-level, 0) * 0.08)",transition:y?"opacity 0.2s ease-out, transform 0.2s ease-out, box-shadow 0.35s ease":"box-shadow 0.35s ease"}}),o("div",{ref:h,style:{position:"absolute",inset:0,borderRadius:"50%",overflow:"hidden",boxShadow:`inset 0 0 0 1px color-mix(in oklab, ${re} 45%, transparent), 0 0 0 1px rgba(255,255,255,0.08)`,transition:"box-shadow 0.35s ease"},children:[y?o(rr,{width:t,height:t,colors:se,distortion:V.distortion,swirl:V.swirl,scale:l,speed:V.shaderSpeed,frame:Ki,grainMixer:V.grain,grainOverlay:.05,minPixelRatio:2,webGlContextAttributes:Ji}):o("div",{"aria-hidden":"true",style:{position:"absolute",inset:0,borderRadius:"50%"},children:Ve.map(F=>o("div",{style:{position:"absolute",inset:0,borderRadius:"50%",backgroundImage:F.base,opacity:F.visible?1:0,transition:"opacity 0.35s ease"},children:o("div",{style:{position:"absolute",inset:0,borderRadius:"50%",backgroundImage:F.glow,opacity:"calc(0.25 + var(--orb-level, 0) * 0.75)"}})},F.key))}),d&&o("div",{style:{position:"absolute",inset:0,borderRadius:"50%",pointerEvents:"none",backgroundImage:"radial-gradient(circle at 31% 22%, rgba(255,255,255,0.55), transparent 14%), radial-gradient(circle at 30% 26%, rgba(255,255,255,0.28), transparent 48%), radial-gradient(circle at 68% 76%, rgba(10,14,24,0.42), transparent 60%)"}})]})]})};var bn=["#9483ec","#bcc0f7","#6a8bf1","#7fd6fb","#f2f4ff"],yn=1.6,kn={distortion:1,swirl:.85},_n=.76,lo=.86,xn=10,gn=()=>typeof window<"u"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;function lr(e,t){let r=.5+.5*Math.sin(t*.85),a=e/2*(_n+(lo-_n)*r);return{rx:a*(1+.035*Math.sin(t*1.3)),ry:a*(1+.035*Math.sin(t*1.7+1.2)),cx:e/2+e*.012*Math.sin(t*.7),cy:e/2+e*.012*Math.cos(t*.8+.5)}}var wn=({rx:e,ry:t,cx:r,cy:a})=>`${e.toFixed(1)}px ${t.toFixed(1)}px at ${r.toFixed(1)}px ${a.toFixed(1)}px`,cr=e=>`radial-gradient(${wn(e)}, #000 0%, #000 ${100-xn}%, transparent 100%)`,vn=e=>`radial-gradient(${wn(e)}, transparent 0%, transparent ${100-xn}%, #000 100%)`;function ur(e,t){e&&(e.style.maskImage=t,e.style.setProperty("-webkit-mask-image",t))}function Sn({size:e,state:t="idle",label:r="Assistant"}){let a={position:"absolute",inset:0,borderRadius:"50%"},n=v=>`${Math.max(1,e*v)}px`,i=S(null),s=S(null),l=S(null),d=S(null),c=S(null),f=S(null),_=lr(e,0);A(()=>{let v=M=>{ur(s.current,cr(M)),ur(l.current,cr(M)),ur(d.current,vn(M))};if(v(lr(e,0)),gn()||!i.current)return;let g=0,y=performance.now(),w=M=>{v(lr(e,(M-y)/1e3)),g=requestAnimationFrame(w)},P=()=>{g||(g=requestAnimationFrame(w))},I=()=>{cancelAnimationFrame(g),g=0},L=vt(i.current,M=>M?P():I());return P(),()=>{I(),L()}},[e]),A(()=>{if(gn())return;let v=[c.current?.animate([{transform:"rotate(-20deg) scaleX(1)"},{transform:"rotate(160deg) scaleX(0.55)"},{transform:"rotate(340deg) scaleX(1)"}],{duration:9e3,iterations:1/0,easing:"ease-in-out"}),f.current?.animate([{transform:"rotate(70deg) scaleX(0.7)"},{transform:"rotate(-120deg) scaleX(1.1)"},{transform:"rotate(-290deg) scaleX(0.7)"}],{duration:13e3,iterations:1/0,easing:"ease-in-out"})];return()=>v.forEach(g=>g?.cancel())},[]);let u=(v,g,y,w)=>o("div",{ref:v,"aria-hidden":"true",style:{position:"absolute",inset:"-2%",background:`radial-gradient(ellipse 32% 58% at ${w}, transparent 95%, rgba(255,255,255,${g}) 97.5%, rgba(72,80,196,${y}) 99%, transparent 100%)`,filter:`blur(${n(.006)})`}}),h=cr(_),m=vn(_);return o("div",{ref:i,class:"ask-ai__orb",style:{position:"relative",width:e,height:e,flex:"0 0 auto"},children:[o("div",{"aria-hidden":"true",style:{position:"absolute",borderRadius:"50%",left:"4%",right:"4%",top:"34%",height:"100%",background:"radial-gradient(closest-side, rgba(122,108,236,0.5), rgba(122,108,236,0.18) 55%, rgba(122,108,236,0))",filter:`blur(${n(.1)})`}}),o(sr,{state:t,size:e,speed:yn,colors:bn,idleMotion:kn,meshScale:.55,gloss:!1,label:r}),o("div",{ref:s,"aria-hidden":"true",style:{...a,overflow:"hidden",mixBlendMode:"soft-light",opacity:.8,maskImage:h,WebkitMaskImage:h},children:[u(c,.75,.3,"22% 50%"),u(f,.4,.18,"78% 44%")]}),o("div",{ref:l,"aria-hidden":"true",style:{...a,backdropFilter:`blur(${n(.006)})`,WebkitBackdropFilter:`blur(${n(.006)})`,background:"radial-gradient(circle at 50% 50%, rgba(244,245,255,0.1) 0%, rgba(244,245,255,0.18) 60%, rgba(244,245,255,0.3) 100%)",maskImage:h,WebkitMaskImage:h}}),o("div",{ref:d,"aria-hidden":"true",style:{...a,backdropFilter:`blur(${n(.07)}) saturate(1.1)`,WebkitBackdropFilter:`blur(${n(.07)}) saturate(1.1)`,background:"radial-gradient(circle at 38% 30%, rgba(248,248,255,0.62), rgba(238,239,252,0.5) 60%, rgba(236,237,252,0.58) 100%)",maskImage:m,WebkitMaskImage:m}}),o("div",{"aria-hidden":"true",style:{...a,pointerEvents:"none",background:["radial-gradient(circle at 33% 27%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.45) 9%, rgba(255,255,255,0) 26%)","radial-gradient(ellipse 60% 22% at 50% 94%, rgba(214,236,255,0.45), rgba(214,236,255,0) 100%)","radial-gradient(circle at 40% 34%, rgba(60,52,150,0) 52%, rgba(60,52,150,0.16) 80%, rgba(46,40,130,0.38) 100%)"].join(", ")}}),o("div",{"aria-hidden":"true",style:{...a,pointerEvents:"none",boxShadow:`inset 0 0 ${n(.025)} rgba(255,255,255,0.9), 0 0 0 1px rgba(200,200,240,0.35)`}})]})}function An({size:e=18}){return o(sr,{state:"thinking",size:e,speed:yn,colors:bn,idleMotion:kn,meshScale:.55,gloss:!1,label:"Thinking"})}function En({starters:e,mock:t,supportUrl:r,onPick:a}){return o("div",{class:"ask-ai__welcome",children:[o(Sn,{size:80}),o("h3",{class:"ask-ai__greeting",children:"What do you want to build today?"}),t&&o("p",{class:"ask-ai__welcome-note",children:["A preview, not connected to an assistant. For a real answer, use"," ",o("a",{href:r,target:"_blank",rel:"noopener noreferrer",children:"support"}),"."]}),o("div",{class:"ask-ai__pills",children:e.map((n,i)=>o("button",{type:"button",class:"ask-ai__pill",style:{animationDelay:`${400+i*60}ms`},title:n.prompt===n.label?void 0:n.prompt,onClick:()=>a(n.prompt),children:n.label},n.prompt))})]})}var co=[{label:"Create an ABHA",prompt:"How do I create an ABHA with an Aadhaar OTP?"},{label:"Link care contexts",prompt:"How do I link care contexts to an ABHA?"},{label:"Request consent",prompt:"How does an HIU raise a consent request?"},{label:"Decode an error",prompt:"What does ABDM-1016 mean and how do I fix it?"},{label:"Learn about Ask AI",prompt:"What can the Ask AI assistant do?"}];function Rn(e){let t=e.split(`
`).map(r=>r.trim()).filter(Boolean);return t.length?t.slice(0,5).map(r=>{let a=r.indexOf("|");if(a<0)return{label:r,prompt:r};let n=r.slice(0,a).trim(),i=r.slice(a+1).trim();return{label:n||i,prompt:i||n}}):co}function dr(e){let t=[];for(let r of e){if(r.from==="assistant"&&(r.install||r.local)){t.length&&t[t.length-1].from==="you"&&t.pop();continue}t.push(r)}return t}var pr=17;function Mn(e){let t=Math.floor(dr(e).length/2),r=(pr-1)/2,a=Math.min(100,Math.round(t/r*100));return{earlier:t,window:r,percent:a,full:t>=r}}var Tn=`/* ---------- theming ---------- */

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

/* The foot: the chat bar card, and the commands under it. */
.ask-ai__foot {
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

/* The commands under the bar: quiet pills, the one that is on filled in. */
.ask-ai__commands {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

.ask-ai__command {
  padding: 0.375rem 0.6875rem;
  border: 1px solid var(--aa-border);
  border-radius: 999px;
  background: none;
  font-family: inherit;
  font-size: 0.75rem;
  line-height: 1;
  color: var(--aa-muted);
  cursor: pointer;
  transition: background-color var(--aa-dur-fast) var(--aa-ease-out),
    border-color var(--aa-dur-fast) var(--aa-ease-out),
    color var(--aa-dur-fast) var(--aa-ease-out);
}

.ask-ai__command:hover {
  border-color: var(--aa-border-strong);
  color: var(--aa-heading);
}

.ask-ai__command[aria-pressed='true'] {
  border-color: var(--aa-accent);
  background: var(--aa-accent);
  color: var(--aa-accent-contrast);
}

.ask-ai__command:focus-visible {
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

/* How much of the conversation the next question takes with it: a thin bar
   and a count, quiet until the oldest exchanges stop being sent. */
.ask-ai__memory {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0.875rem 0.375rem;
  font-size: 0.6875rem;
  color: var(--aa-faint);
}

.ask-ai__memory-bar {
  flex: 0 0 4rem;
  height: 3px;
  border-radius: 999px;
  background: var(--aa-fill-soft);
  overflow: hidden;
}

.ask-ai__memory-bar > span {
  display: block;
  height: 100%;
  background: var(--aa-accent);
  opacity: 0.6;
  transition: width 200ms ease-out;
}

.ask-ai__memory-percent {
  font-variant-numeric: tabular-nums;
}

.ask-ai__memory--full .ask-ai__memory-percent {
  color: #c07a12;
}

.ask-ai__memory--full .ask-ai__memory-bar > span {
  background: #c07a12;
  opacity: 1;
}

`;var Cn=()=>`${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`,po=".json,.txt,.log,.csv,.xml,.yaml,.yml,.md,.har,.pdf,.png,.jpg,.jpeg,.webp",mr=2e4,fo=256*1024,ho=8*1024*1024;async function mo(e){let t=await import(`${te}pdf.min.mjs`);t.GlobalWorkerOptions.workerSrc=`${te}pdf.worker.min.mjs`;let r=t.getDocument({data:await e.arrayBuffer()}),a=await r.promise,n=[];for(let i=1;i<=a.numPages;i+=1){let s=await(await a.getPage(i)).getTextContent();if(n.push(s.items.map(l=>l.str??"").join(" ").replace(/[ \t]+/g," ").trim()),n.join(`

`).length>mr)break}return await a.cleanup?.(),await r.destroy(),n.join(`

`).trim()}async function _o(e,t){t("Loading the reader, once per browser."),await st(`${te}tesseract.min.js`);let r=window.Tesseract;t("Reading the text out of that image.");let a=await r.createWorker("eng",1,{workerPath:`${te}worker.min.js`,corePath:te,langPath:`${te}lang`,cacheMethod:"none"});try{let{data:n}=await a.recognize(e);return(n.text??"").replace(/[ \t]+/g," ").trim()}finally{await a.terminate()}}var Pn=24e3,On=`

[This page was cut here to fit. Say so if the answer needs the rest of it.]`;function go(e){return e.length<=Pn?e:e.slice(0,Pn-On.length)+On}var vo="This panel is a mock. No assistant is connected here yet, so nothing in it can answer that. The support page lists the channels a human reads.";function In(e,t){e(r=>{let a=r[r.length-1];return[...r.slice(0,-1),{...a,text:a.text+t}]})}function bo(e){if(e.some(t=>t.install))return-1;for(let t=e.length-1;t>0;t-=1){let r=e[t];if(r.from!=="assistant"||r.text==="")continue;let a=e[t-1];return a?.from==="you"&&ma(a.text)?t:-1}return-1}function yo(e,t){e(r=>{let a=r[r.length-1];return[...r.slice(0,-1),{...a,sources:t}]})}var fr=320,Un=960,hr="abdm-ask-ai-width",_r=!1;function ko({dialog:e}){let[t,r]=R(!1);return A(()=>{let n=Number(localStorage.getItem(hr));n>=fr&&e.current&&e.current.style.setProperty("--aa-panel-width",`${n}px`)},[]),o("div",{class:`ask-ai__grip${t?" ask-ai__grip--dragging":""}`,role:"separator","aria-orientation":"vertical","aria-label":"Resize the panel",tabIndex:0,onPointerDown:n=>{let i=e.current;if(!i)return;n.preventDefault(),_r=!0,r(!0),n.target.setPointerCapture(n.pointerId);let s=d=>{let c=window.innerWidth-d.clientX,f=Math.min(Math.max(c,fr),Math.min(Un,window.innerWidth));i.style.setProperty("--aa-panel-width",`${Math.round(f)}px`)},l=()=>{setTimeout(()=>{_r=!1},0),r(!1),window.removeEventListener("pointermove",s),window.removeEventListener("pointerup",l),window.removeEventListener("pointercancel",l);let d=i.style.getPropertyValue("--aa-panel-width");d&&localStorage.setItem(hr,String(parseInt(d,10)))};window.addEventListener("pointermove",s),window.addEventListener("pointerup",l),window.addEventListener("pointercancel",l)},onKeyDown:n=>{let i=n.key==="ArrowLeft"?32:n.key==="ArrowRight"?-32:0;if(!i||!e.current)return;n.preventDefault();let s=e.current.getBoundingClientRect().width,l=Math.min(Math.max(s+i,fr),Un);e.current.style.setProperty("--aa-panel-width",`${l}px`),localStorage.setItem(hr,String(l))},children:o("span",{class:"ask-ai__grip-bar","aria-hidden":"true"})})}function xo({turns:e}){let{earlier:t,window:r,percent:a,full:n}=Mn(e);if(!t)return null;let i=n?`The last ${r} exchanges go with each question. Earlier ones are no longer sent; New starts afresh.`:`${t} of ${r} exchanges go with each question. Very long answers go shortened.`;return o("p",{class:`ask-ai__memory${n?" ask-ai__memory--full":""}`,title:i,children:[o("span",{class:"ask-ai__memory-label",children:"Context window"}),o("span",{class:"ask-ai__memory-bar",role:"progressbar","aria-label":"Context window","aria-valuemin":0,"aria-valuemax":100,"aria-valuenow":a,"aria-valuetext":i,children:o("span",{style:{width:`${a}%`}})}),o("span",{class:"ask-ai__memory-percent",children:[a,"%"]})]})}function wo({apiBase:e,docsOrigin:t,mcpUrl:r,pluginRepo:a,open:n,onClose:i,page:s,onDetach:l,onAttach:d,question:c,send:f,starters:_,keepHistory:u,gateway:h,supportUrl:m}){let[v,g]=R([]),y=s?sa(s.markdown).slice(0,4):[],w=y.length?y.map(p=>({label:p,prompt:p})):_,[P,I]=R(""),[L,M]=R(null),[V,T]=R(null),[re,U]=R(null),[B,se]=R("idle"),[Ve,le]=R(null),[F,E]=R(""),[z,q]=R(!1),[Ge,ce]=R([]),[me,ue]=R("chat"),[de,je]=R(null),[Te,G]=R("closed"),[K,ae]=R(null),Q=S(Cn()),_e=S(null),ge=S(null),ve=S(null),ne=S(null),yt=S(null),be=S(null),ye=B!=="idle",Ln=s!==null&&s.markdown!=="",Y=S(""),ke=S(!1),xe=S(!0),vr=S(0),br=S(!1),J=S(0),Ce=S(null),yr=()=>{J.current=requestAnimationFrame(yr);let p=Y.current.length;if(p===0){if(!xe.current)return;cancelAnimationFrame(J.current),J.current=0,ke.current=!1,Ce.current&&(yo(g,Ce.current),Ce.current=null),se("idle");return}let k=_a(p,performance.now()-vr.current,ke.current,br.current);k!==0&&(ke.current||(ke.current=!0,se("streaming")),In(g,Y.current.slice(0,k)),Y.current=Y.current.slice(k))},Xe=p=>{Y.current+=p},Fn=p=>{Ce.current=p},kr=()=>{J.current&&cancelAnimationFrame(J.current),J.current=0,ke.current=!1,Y.current="",Ce.current=null,xe.current=!0};A(()=>{if(!(!n||!c)){if(!f){I(p=>p||c);return}_e.current!==c&&(_e.current=c,Ye(c))}},[n,c,f]),A(()=>{let p=ge.current;p&&(n&&!p.open&&(p.showModal(),ne.current?.focus()),!n&&p.open&&p.close())},[n]),A(()=>{if(!n)return;let p=k=>{k.key==="Escape"&&(k.preventDefault(),k.stopPropagation(),Te!=="closed"?G("closed"):i())};return document.addEventListener("keydown",p,!0),()=>document.removeEventListener("keydown",p,!0)},[n,i,Te]);let qe=S(!0),Dn=()=>{let p=ve.current;p&&(qe.current=p.scrollHeight-p.scrollTop-p.clientHeight<40)};A(()=>{let p=ve.current;p&&qe.current&&(p.scrollTop=p.scrollHeight)},[v,B,Ve]),A(()=>{let p=ne.current;if(!p)return;p.style.height="auto";let k=Math.min(p.scrollHeight,160);p.style.height=`${k}px`,p.style.overflowY=p.scrollHeight>k?"auto":"hidden"},[P]),A(()=>()=>{be.current?.abort(),J.current&&cancelAnimationFrame(J.current)},[]);let kt=p=>{u&&p.some(k=>k.from==="you")&&(ce(k=>{let b=va(k,{id:Q.current,at:Date.now(),title:ga(p),turns:p.map(D=>D.file?{...D,file:{...D.file,text:""}}:D)});return zt(b),b}),wa(Q.current))};A(()=>{B==="idle"&&kt(v)},[B,v]),A(()=>{if(!u)return;let p=ba();ce(p);let k=Aa(p,xa());k&&(Q.current=k.id,g(b=>b.length?b:k.turns))},[u]);let Bn=p=>{kt(v),be.current?.abort(),kr(),qe.current=!0,Q.current=p.id,g(p.turns),ue("chat"),I(""),M(null),T(null),U(null),le(null),se("idle")},Nn=()=>{kt(v),Q.current=Cn(),Sa(),ue("chat"),G("closed"),be.current?.abort(),kr(),qe.current=!0,g([]),I(""),M(null),T(null),U(null),le(null),se("idle")},$n=async p=>{if(!p)return;T(null);let k=p.name.toLowerCase(),b=p.type==="application/pdf"||k.endsWith(".pdf"),D=p.type.startsWith("image/"),xt=b||D?ho:fo;if(p.size>xt){T("That file is too large. Attach the failing part of it.");return}let j;try{if(b){if(U("Reading the text in that PDF."),j=await mo(p),!j){U(null),T("That PDF has no text in it, only pictures of text. Attach a screenshot of the part you mean and it will be read.");return}}else D?j=await _o(p,U):j=await p.text()}catch{U(null),T("That file could not be read.");return}finally{U(null)}if(!b&&!D&&j.includes("\uFFFD")){T("That looks like a binary file. Text and JSON only.");return}if(j.length>mr){T(`That file is ${j.length.toLocaleString()} characters. Attach at most ${mr.toLocaleString()}.`);return}if(!j.trim()){T(D?"No text could be read out of that image.":"That file is empty.");return}M({name:p.name,text:j,kind:b?"pdf":D?"image":void 0}),ne.current?.focus()},Hn=()=>{be.current?.abort(),Y.current&&In(g,Y.current),Y.current="",xe.current=!0},Pe=(p,k)=>{E(""),q(!1),g(b=>[...b,...k?[{from:"you",text:k}]:[],{from:"assistant",text:ha(p,{docsOrigin:t,mcpUrl:r,pluginRepo:a}),install:p}])},Ye=async(p,k={})=>{if(!p||ye)return;let b=k.file!==void 0?k.file:L,D=k.base??v;if(I(""),M(null),T(null),G("closed"),ue("chat"),!b&&!de&&Ra(p)){g([...D,{from:"you",text:p},{from:"assistant",text:Ea,local:!0}]);return}let xt=dr([...D,{from:"you",text:p,file:b??void 0}]);if(g(Z=>[...k.base??Z,{from:"you",text:p,file:b??void 0},{from:"assistant",text:""}]),Y.current="",ke.current=!1,xe.current=!1,vr.current=performance.now(),br.current=window.matchMedia("(prefers-reduced-motion: reduce)").matches,se("thinking"),le("Thinking"),J.current||(J.current=requestAnimationFrame(yr)),!e){Xe(vo),xe.current=!0;return}let j=new AbortController;be.current=j;try{let Z=await fetch(`${e.replace(/\/$/,"")}/api/chat`,{method:"POST",signal:j.signal,headers:{"Content-Type":"application/json"},body:JSON.stringify({turns:xt.slice(-pr).map(N=>({role:N.from==="you"?"user":"assistant",text:N.text,...N.file?{attachment:{name:N.file.name,text:N.file.text,...N.file.kind?{kind:N.file.kind}:{}}}:{}})),...Ln?{page:{title:s.title,url:s.url,markdown:go(s.markdown)}}:{},...de?{command:de}:{},...k.module?{module:k.module}:{},...h?{gateway:h}:{}})});if(!Z.ok||!Z.body)throw new Error(`status ${Z.status}`);await la(Z.body,{onText:Xe,onTool:N=>le(N),onSources:N=>Fn(N),onError:Xe,onSkill:N=>g(wt=>{let xr=wt[wt.length-1],qn=N.status==="unresolved"?{...xr,text:ht(N),skill:N,local:!0}:{...xr,skill:N};return[...wt.slice(0,-1),qn]})})}catch(Z){Z instanceof DOMException&&Z.name==="AbortError"||Xe(Dt)}finally{be.current=null,xe.current=!0,le(null)}},zn=p=>{let k=v.length-2,b=v[k];!b||b.from!=="you"||Ye(b.text,{module:p,base:v.slice(0,k),file:b.file??null})},Wn=async p=>{ae(p.title);let k=await fetch(Ca(t,p.path)).then(b=>b.ok?b.text():"").catch(()=>"");ae(null),d({title:p.title,url:Ta(t,p.path),markdown:k}),ne.current?.focus()},Vn=p=>ce(k=>{let b=ya(k,p);return zt(b),b}),Gn=()=>{ka(),ce([])},jn=B==="thinking",Xn=bo(v);return o("dialog",{class:"ask-ai",ref:ge,"aria-label":"Ask AI",onClose:i,onCancel:i,onClick:p=>{p.target===ge.current&&!_r&&i()},children:[o(ko,{dialog:ge}),o("div",{class:"ask-ai__head",children:[o("div",{class:"ask-ai__tabs",role:"group","aria-label":"Conversations",children:[o("button",{type:"button",class:"ask-ai__tab","aria-pressed":me==="chat","aria-label":"New conversation",title:"Start a new conversation",onClick:Nn,children:[o(ot,{}),"New"]}),o("button",{type:"button",class:"ask-ai__tab","aria-pressed":me==="history",onClick:()=>{G("closed"),ue("history")},children:"History"})]}),!e&&o("span",{class:"ask-ai__badge",children:"Mock"}),o("span",{class:"ask-ai__grow"}),o("button",{type:"button",class:"ask-ai__close",onClick:i,"aria-label":"Close",children:o(Be,{})})]}),me==="history"?o(Ua,{sessions:Ge,currentId:Q.current,onOpen:Bn,onForget:Vn,onClearAll:Gn}):o($,{children:[o("div",{class:"ask-ai__thread",ref:ve,role:"log","aria-live":"polite","aria-busy":ye,onScroll:Dn,children:[v.length===0&&o(En,{starters:w,mock:!e,supportUrl:m,onPick:p=>{Ye(p)}}),v.map((p,k)=>p.from==="assistant"&&p.text===""?null:o("div",{class:`ask-ai__turn ask-ai__turn--${p.from}${B==="streaming"&&k===v.length-1?" ask-ai__turn--streaming":""}`,children:[p.skill&&p.skill.status!=="unresolved"&&o("p",{class:`ask-ai__skill ask-ai__skill--${p.skill.status}`,children:p.skill.status==="used"&&p.skill.href?o("a",{href:ct(p.skill.href,t)??p.skill.href,target:"_blank",rel:"noopener noreferrer",children:ht(p.skill)}):ht(p.skill)}),p.from==="assistant"?o(Ft,{text:p.text,docsOrigin:t}):p.text,p.file&&o("span",{class:"ask-ai__turn-file",children:[o(Ne,{}),p.file.name]}),p.from==="assistant"&&k>0&&p.text!==""&&!(ye&&k===v.length-1)&&o(ut,{text:p.text,label:"Copy answer",className:"ask-ai__turn-copy"}),p.sources&&p.sources.length>0&&o("details",{class:"ask-ai__sources",children:[o("summary",{class:"ask-ai__sources-toggle",children:[o(Zr,{}),"Used ",p.sources.length," ",p.sources.length===1?"source":"sources"]}),o("ul",{class:"ask-ai__source-list",children:p.sources.map(b=>o("li",{children:o("a",{href:ct(b.url,t)??b.url,target:"_blank",rel:"noopener noreferrer",class:"ask-ai__source-link",children:[o(Ae,{}),o("span",{class:"ask-ai__source-title",children:[b.title,b.status!=="verified"?" (spec)":""]})]})},b.id))})]}),p.install&&k===v.length-1&&o("div",{class:"ask-ai__choices",children:[p.install.at==="tools"&&Bt.map(b=>o("button",{type:"button",class:"ask-ai__choice",onClick:()=>Pe(ca(b.id)?{at:"agents",tool:b.id}:{at:"answer",tool:b.id,agent:"claude"},b.label),children:b.label},b.id)),p.install.at==="agents"&&!z&&Nt.map(b=>o("button",{type:"button",class:"ask-ai__choice",onClick:()=>{if(b.id==="other"){q(!0);return}Pe({at:"answer",tool:p.install.tool,agent:b.id},b.label)},children:b.label},b.id)),p.install.at==="agents"&&z&&o("form",{class:"ask-ai__naming",onSubmit:b=>{b.preventDefault();let D=F.trim();D&&Pe({at:"answer",tool:p.install.tool,agent:"other",named:D},D)},children:[o("input",{class:"ask-ai__naming-field",value:F,autoFocus:!0,placeholder:"Which agent?","aria-label":"The name of your agent",onInput:b=>E(b.target.value)}),o("button",{type:"submit",class:"ask-ai__choice",disabled:F.trim()==="",children:o(it,{})})]})]}),p.install?.at==="answer"&&(()=>{let{link:b}=Ht(p.install,{docsOrigin:t,mcpUrl:r,pluginRepo:a});return b?o("a",{class:"ask-ai__install-cta",href:b.href,target:"_blank",rel:"noopener noreferrer",children:[o(De,{}),b.label]}):null})(),p.skill?.status==="unresolved"&&k===v.length-1&&o("div",{class:"ask-ai__choices",children:(p.skill.candidates??[]).map(b=>o("button",{type:"button",class:"ask-ai__choice",onClick:()=>zn(b),children:ft(b)},b))}),p.skill?.status==="used"&&p.skill.section==="scaffold"&&!(ye&&k===v.length-1)&&o("button",{type:"button",class:"ask-ai__install-cta",onClick:()=>Pe({at:"tools"},"Install AI tools"),children:[o(De,{}),"Build it with your coding agent"]}),k===Xn&&p.skill?.section!=="scaffold"&&!(ye&&k===v.length-1)&&o("button",{type:"button",class:"ask-ai__install-cta",onClick:()=>Pe({at:"tools"},"Install AI tools"),children:[o(De,{}),"Install AI tools"]})]},k)),jn&&o("p",{class:"ask-ai__activity",children:[o(An,{}),Ve??"Thinking"]})]}),o(xo,{turns:v}),o(Ia,{draft:P,onDraft:I,field:ne,busy:ye,onSend:()=>{Ye(P.trim())},onStop:Hn,menu:Te,onMenu:G,accept:po,onFile:p=>{$n(p)},file:L,fileNote:re,fileError:V,onRemoveFile:()=>M(null),docsOrigin:t,page:s,attaching:K,onPage:p=>{Wn(p)},onRemovePage:l,command:de,onCommand:je})]})]})}function So({host:e,apiBase:t,docsOrigin:r,mcpUrl:a,pluginRepo:n,supportUrl:i,launcher:s,shortcut:l,open:d,page:c,onDetach:f,onAttach:_,question:u,send:h,starters:m,keepHistory:v,gateway:g}){return o($,{children:[s&&o("button",{type:"button",class:"ask-ai__launcher","aria-label":"Ask AI",onClick:()=>{e.removeAttribute("open"),e.setAttribute("open","")},children:[o(De,{}),o("span",{class:"ask-ai__launcher-label",children:"Ask AI"}),l&&o("kbd",{class:"ask-ai__launcher-key",children:l})]}),o(wo,{apiBase:t,docsOrigin:r,mcpUrl:a,pluginRepo:n,supportUrl:i,open:d,question:u,send:h,starters:m,keepHistory:v,gateway:g,onClose:()=>{e.removeAttribute("open"),e.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))},page:c,onDetach:f,onAttach:_})]})}function Ao(){for(let e=document.body;e;e=e.parentElement){let t=/^rgba?\(([^)]+)\)/.exec(getComputedStyle(e).backgroundColor);if(!t)continue;let[r,a,n,i=1]=t[1].split(",").map(Number);if(i)return .2126*r+.7152*a+.0722*n<128?"dark":"light"}return window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}var gr=class extends HTMLElement{static observedAttributes=["api-base","docs-origin","mcp-url","plugin-repo","support-url","launcher","shortcut","open","question","send","starters","history","ground","gateway"];root=null;page=null;connectedCallback(){if(!this.root){this.root=this.attachShadow({mode:"open"});let t=document.createElement("style");t.textContent=Tn,this.root.append(t),this.hasAttribute("ground")||this.setAttribute("ground",Ao())}this.paint()}attributeChangedCallback(){this.root&&this.paint()}show(){this.setAttribute("open","")}hide(){this.removeAttribute("open")}attachPage(t){this.page=t&&Pa(t.markdown)?{...t,markdown:""}:t,this.root&&this.paint()}paint(){let t=this.getAttribute("docs-origin")??window.location.origin;Pt(o(So,{host:this,apiBase:this.getAttribute("api-base")??"",docsOrigin:t,mcpUrl:this.getAttribute("mcp-url"),pluginRepo:this.getAttribute("plugin-repo")??"nha-in/docs",supportUrl:this.getAttribute("support-url")??`${t.replace(/\/$/,"")}/docs/support`,launcher:this.getAttribute("launcher")!=="none",shortcut:this.getAttribute("shortcut")??"",open:this.hasAttribute("open"),page:this.page,onDetach:()=>this.attachPage(null),onAttach:r=>this.attachPage(r),question:this.getAttribute("question")??"",send:this.hasAttribute("send"),starters:Rn(this.getAttribute("starters")??""),keepHistory:this.getAttribute("history")!=="off",gateway:this.getAttribute("gateway")??""}),this.root)}};typeof customElements<"u"&&!customElements.get("abdm-support-agent")&&customElements.define("abdm-support-agent",gr);})();
