(()=>{var lt,x,Ir,si,ie,Tr,Or,Ur,Pt,at,De,Lr,Ut,It,Ot,li,it={},ot=[],ci=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i,Ne=Array.isArray;function ee(e,t){for(var r in t)e[r]=t[r];return e}function Lt(e){e&&e.parentNode&&e.parentNode.removeChild(e)}function ke(e,t,r){var a,n,i,s={};for(i in t)i=="key"?a=t[i]:i=="ref"?n=t[i]:s[i]=t[i];if(arguments.length>2&&(s.children=arguments.length>3?lt.call(arguments,2):r),typeof e=="function"&&e.defaultProps!=null)for(i in e.defaultProps)s[i]===void 0&&(s[i]=e.defaultProps[i]);return nt(e,s,a,n,null)}function nt(e,t,r,a,n){var i={type:e,props:t,key:r,ref:a,__k:null,__:null,__b:0,__e:null,__c:null,constructor:void 0,__v:n??++Ir,__i:-1,__u:0};return n==null&&x.vnode!=null&&x.vnode(i),i}function N(e){return e.children}function Y(e,t){this.props=e,this.context=t}function pe(e,t){if(t==null)return e.__?pe(e.__,e.__i+1):null;for(var r;t<e.__k.length;t++)if((r=e.__k[t])!=null&&r.__e!=null)return r.__e;return typeof e.type=="function"?pe(e):null}function ui(e){if(e.__P&&e.__d){var t=e.__v,r=t.__e,a=[],n=[],i=ee({},t);i.__v=t.__v+1,x.vnode&&x.vnode(i),Ft(e.__P,i,t,e.__n,e.__P.namespaceURI,32&t.__u?[r]:null,a,r??pe(t),!!(32&t.__u),n),i.__v=t.__v,i.__.__k[i.__i]=i,$r(a,i,n),t.__e=t.__=null,i.__e!=r&&Fr(i)}}function Fr(e){if((e=e.__)!=null&&e.__c!=null)return e.__e=e.__c.base=null,e.__k.some(function(t){if(t!=null&&t.__e!=null)return e.__e=e.__c.base=t.__e}),Fr(e)}function Mr(e){(!e.__d&&(e.__d=!0)&&ie.push(e)&&!st.__r++||Tr!=x.debounceRendering)&&((Tr=x.debounceRendering)||Or)(st)}function st(){try{for(var e,t=1;ie.length;)ie.length>t&&ie.sort(Ur),e=ie.shift(),t=ie.length,ui(e)}finally{ie.length=st.__r=0}}function Dr(e,t,r,a,n,i,s,l,d,c,p){var _,u,h,m,v,g,y=a&&a.__k||ot,w=t.length;for(d=di(r,t,y,d,w),_=0;_<w;_++)(h=r.__k[_])!=null&&(u=h.__i!=-1&&y[h.__i]||it,h.__i=_,g=Ft(e,h,u,n,i,s,l,d,c,p),m=h.__e,h.ref&&u.ref!=h.ref&&(u.ref&&Dt(u.ref,null,h),p.push(h.ref,h.__c||m,h)),v==null&&m!=null&&(v=m),4&h.__u?(d=Nr(h,d,e),u.__e&&(u.__e=null)):typeof h.type=="function"&&g!==void 0?d=g:m&&(d=m.nextSibling),h.__u&=-7);return r.__e=v,d}function di(e,t,r,a,n){var i,s,l,d,c,p=r.length,_=p,u=0;for(e.__k=new Array(n),i=0;i<n;i++)(s=t[i])!=null&&typeof s!="boolean"&&typeof s!="function"?(typeof s=="string"||typeof s=="number"||typeof s=="bigint"||s.constructor==String?s=e.__k[i]=nt(null,s,null,null,null):Ne(s)?s=e.__k[i]=nt(N,{children:s},null,null,null):s.constructor===void 0&&s.__b>0?s=e.__k[i]=nt(s.type,s.props,s.key,s.ref?s.ref:null,s.__v):e.__k[i]=s,d=i+u,s.__=e,s.__b=e.__b+1,l=null,(c=s.__i=fi(s,r,d,_))!=-1&&(_--,(l=r[c])&&(l.__u|=2)),l==null||l.__v==null?(c==-1&&(n>p?u--:n<p&&u++),typeof s.type!="function"&&(s.__u|=4)):c!=d&&(c==d-1?u--:c==d+1?u++:(c>d?u--:u++,s.__u|=4))):e.__k[i]=null;if(_)for(i=0;i<p;i++)(l=r[i])!=null&&(2&l.__u)==0&&(l.__e==a&&(a=pe(l)),zr(l,l));return a}function Nr(e,t,r){var a,n;if(typeof e.type=="function"){for(a=e.__k,n=0;a&&n<a.length;n++)a[n]&&(a[n].__=e,t=Nr(a[n],t,r));return t}e.__e!=t&&(t&&e.type&&!t.parentNode&&(t=pe(e)),t=r.insertBefore(e.__e,t||null));do t=t&&t.nextSibling;while(t!=null&&t.nodeType==8);return t}function Be(e,t){return t=t||[],e==null||typeof e=="boolean"||(Ne(e)?e.some(function(r){Be(r,t)}):t.push(e)),t}function fi(e,t,r,a){var n,i,s,l=e.key,d=e.type,c=t[r],p=c!=null&&(2&c.__u)==0;if(c===null&&l==null||p&&l==c.key&&d==c.type)return r;if(a>(p?1:0)){for(n=r-1,i=r+1;n>=0||i<t.length;)if((c=t[s=n>=0?n--:i++])!=null&&(2&c.__u)==0&&l==c.key&&d==c.type)return s}return-1}function Cr(e,t,r){t[0]=="-"?e.setProperty(t,r??""):e[t]=r==null?"":typeof r!="number"||ci.test(t)?r:r+"px"}function rt(e,t,r,a,n){var i,s;e:if(t=="style")if(typeof r=="string")e.style.cssText=r;else{if(typeof a=="string"&&(e.style.cssText=a=""),a)for(t in a)r&&t in r||Cr(e.style,t,"");if(r)for(t in r)a&&r[t]==a[t]||Cr(e.style,t,r[t])}else if(t[0]=="o"&&t[1]=="n")i=t!=(t=t.replace(Lr,"$1")),s=t.toLowerCase(),t=s in e||t=="onFocusOut"||t=="onFocusIn"?s.slice(2):t.slice(2),e.l||(e.l={}),e.l[t+i]=r,r?a?r[De]=a[De]:(r[De]=Ut,e.addEventListener(t,i?Ot:It,i)):e.removeEventListener(t,i?Ot:It,i);else{if(n=="http://www.w3.org/2000/svg")t=t.replace(/xlink(H|:h)/,"h").replace(/sName$/,"s");else if(t!="width"&&t!="height"&&t!="href"&&t!="list"&&t!="form"&&t!="tabIndex"&&t!="download"&&t!="rowSpan"&&t!="colSpan"&&t!="role"&&t!="popover"&&t in e)try{e[t]=r??"";break e}catch{}typeof r=="function"||(r==null||r===!1&&t[4]!="-"?e.removeAttribute(t):e.setAttribute(t,t=="popover"&&r==1?"":r))}}function Pr(e){return function(t){if(this.l){var r=this.l[t.type+e];if(t[at]==null)t[at]=Ut++;else if(t[at]<r[De])return;return r(x.event?x.event(t):t)}}}function Ft(e,t,r,a,n,i,s,l,d,c){var p,_,u,h,m,v,g,y,w,I,U,F,T,V,M,re,L=t.type;if(t.constructor!==void 0)return null;128&r.__u&&(d=!!(32&r.__u),i=[l=t.__e=r.__e]),(p=x.__b)&&p(t);e:if(typeof L=="function"){_=s.length;try{if(w=t.props,I=L.prototype&&L.prototype.render,U=(p=L.contextType)&&a[p.__c],F=p?U?U.props.value:p.__:a,r.__c?y=(u=t.__c=r.__c).__=u.__E:(I?t.__c=u=new L(w,F):(t.__c=u=new Y(w,F),u.constructor=L,u.render=hi),U&&U.sub(u),u.state||(u.state={}),u.__n=a,h=u.__d=!0,u.__h=[],u._sb=[]),I&&u.__s==null&&(u.__s=u.state),I&&L.getDerivedStateFromProps!=null&&(u.__s==u.state&&(u.__s=ee({},u.__s)),ee(u.__s,L.getDerivedStateFromProps(w,u.__s))),m=u.props,v=u.state,u.__v=t,h)I&&L.getDerivedStateFromProps==null&&u.componentWillMount!=null&&u.componentWillMount(),I&&u.componentDidMount!=null&&u.__h.push(u.componentDidMount);else{if(I&&L.getDerivedStateFromProps==null&&w!==m&&u.componentWillReceiveProps!=null&&u.componentWillReceiveProps(w,F),t.__v==r.__v||!u.__e&&u.shouldComponentUpdate!=null&&u.shouldComponentUpdate(w,u.__s,F)===!1){t.__v!=r.__v&&(u.props=w,u.state=u.__s,u.__d=!1),t.__e=r.__e,t.__k=r.__k,t.__k.some(function($){$&&($.__=t)}),ot.push.apply(u.__h,u._sb),u._sb=[],u.__h.length&&s.push(u),l=pe(r);break e}u.componentWillUpdate!=null&&u.componentWillUpdate(w,u.__s,F),I&&u.componentDidUpdate!=null&&u.__h.push(function(){u.componentDidUpdate(m,v,g)})}if(u.context=F,u.props=w,u.__P=e,u.__e=!1,T=x.__r,V=0,I)u.state=u.__s,u.__d=!1,T&&T(t),p=u.render(u.props,u.state,u.context),ot.push.apply(u.__h,u._sb),u._sb=[];else do u.__d=!1,T&&T(t),p=u.render(u.props,u.state,u.context),u.state=u.__s;while(u.__d&&++V<25);u.state=u.__s,u.getChildContext!=null&&(a=ee(ee({},a),u.getChildContext())),I&&!h&&u.getSnapshotBeforeUpdate!=null&&(g=u.getSnapshotBeforeUpdate(m,v)),M=p!=null&&p.type===N&&p.key==null?Hr(p.props.children):p,l=Dr(e,Ne(M)?M:[M],t,r,a,n,i,s,l,d,c),u.base=t.__e,t.__u&=-161,u.__h.length&&s.push(u),y&&(u.__E=u.__=null)}catch($){if(s.length=_,t.__v=null,d||i!=null){if($.then){for(t.__u|=d?160:128;l&&l.nodeType==8&&l.nextSibling;)l=l.nextSibling;i!=null&&(i[i.indexOf(l)]=null),t.__e=l}else if(i!=null)for(re=i.length;re--;)Lt(i[re])}else t.__e=r.__e;t.__k==null&&(t.__k=r.__k||[]),$.then||Br(t),x.__e($,t,r)}}else i==null&&t.__v==r.__v?(t.__k=r.__k,t.__e=r.__e):l=t.__e=pi(r.__e,t,r,a,n,i,s,d,c);return(p=x.diffed)&&p(t),128&t.__u?void 0:l}function Br(e){e&&(e.__c&&(e.__c.__e=!0),e.__k&&e.__k.some(Br))}function $r(e,t,r){for(var a=0;a<r.length;a++)Dt(r[a],r[++a],r[++a]);x.__c&&x.__c(t,e),e.some(function(n){try{e=n.__h,n.__h=[],e.some(function(i){i.call(n)})}catch(i){x.__e(i,n.__v)}})}function Hr(e){return typeof e!="object"||e==null||e.__b>0?e:Ne(e)?e.map(Hr):e.constructor!==void 0?null:ee({},e)}function pi(e,t,r,a,n,i,s,l,d){var c,p,_,u,h,m,v,g=r.props||it,y=t.props,w=t.type;if(w=="svg"?n="http://www.w3.org/2000/svg":w=="math"?n="http://www.w3.org/1998/Math/MathML":n||(n="http://www.w3.org/1999/xhtml"),i!=null){for(c=0;c<i.length;c++)if((h=i[c])&&"setAttribute"in h==!!w&&(w?h.localName==w:h.nodeType==3)){e=h,i[c]=null;break}}if(e==null){if(w==null)return document.createTextNode(y);e=document.createElementNS(n,w,y.is&&y),l&&(x.__m&&x.__m(t,i),l=!1),i=null}if(w==null)g===y||l&&e.data==y||(e.data=y);else{if(i=w=="textarea"&&y.defaultValue!=null?null:i&&lt.call(e.childNodes),!l&&i!=null)for(g={},c=0;c<e.attributes.length;c++)g[(h=e.attributes[c]).name]=h.value;for(c in g)h=g[c],c=="dangerouslySetInnerHTML"?_=h:c=="children"||c in y||c=="value"&&"defaultValue"in y||c=="checked"&&"defaultChecked"in y||rt(e,c,null,h,n);for(c in y)h=y[c],c=="children"?u=h:c=="dangerouslySetInnerHTML"?p=h:c=="value"?m=h:c=="checked"?v=h:l&&typeof h!="function"||g[c]===h||rt(e,c,h,g[c],n);if(p)l||_&&(p.__html==_.__html||p.__html==e.innerHTML)||(e.innerHTML=p.__html),t.__k=[];else if(_&&(e.innerHTML=""),Dr(t.type=="template"?e.content:e,Ne(u)?u:[u],t,r,a,w=="foreignObject"?"http://www.w3.org/1999/xhtml":n,i,s,i?i[0]:r.__k&&pe(r,0),l,d),i!=null)for(c=i.length;c--;)Lt(i[c]);l&&w!="textarea"||(c="value",w=="progress"&&m==null?e.removeAttribute("value"):m!=null&&(m!==e[c]||w=="progress"&&!m||w=="option"&&m!=g[c])&&rt(e,c,m,g[c],n),c="checked",v!=null&&v!=e[c]&&rt(e,c,v,g[c],n))}return e}function Dt(e,t,r){try{if(typeof e=="function"){var a=typeof e.__u=="function";a&&e.__u(),a&&t==null||(e.__u=e(t))}else e.current=t}catch(n){x.__e(n,r)}}function zr(e,t,r){var a,n;if(x.unmount&&x.unmount(e),(a=e.ref)&&(a.current&&a.current!=e.__e||Dt(a,null,t)),(a=e.__c)!=null){if(a.componentWillUnmount)try{a.componentWillUnmount()}catch(i){x.__e(i,t)}a.base=a.__P=a.__n=null}if(a=e.__k)for(n=0;n<a.length;n++)a[n]&&zr(a[n],t,r||typeof e.type!="function");r||Lt(e.__e),e.__c=e.__=e.__e=void 0}function hi(e,t,r){return this.constructor(e,r)}function Nt(e,t,r){var a,n,i,s;t==document&&(t=document.documentElement),x.__&&x.__(e,t),n=(a=typeof r=="function")?null:r&&r.__k||t.__k,i=[],s=[],Ft(t,e=(!a&&r||t).__k=ke(N,null,[e]),n||it,it,t.namespaceURI,!a&&r?[r]:n?null:t.firstChild?lt.call(t.childNodes):null,i,!a&&r?r:n?n.__e:t.firstChild,a,s),$r(i,e,s),e.props.children=null}lt=ot.slice,x={__e:function(e,t,r,a){for(var n,i,s;t=t.__;)if((n=t.__c)&&!n.__)try{if((i=n.constructor)&&i.getDerivedStateFromError!=null&&(n.setState(i.getDerivedStateFromError(e)),s=n.__d),n.componentDidCatch!=null&&(n.componentDidCatch(e,a||{}),s=n.__d),s)return n.__E=n}catch(l){e=l}throw e}},Ir=0,si=function(e){return e!=null&&e.constructor===void 0},Y.prototype.setState=function(e,t){var r;r=this.__s!=null&&this.__s!=this.state?this.__s:this.__s=ee({},this.state),typeof e=="function"&&(e=e(ee({},r),this.props)),e&&ee(r,e),e!=null&&this.__v&&(t&&this._sb.push(t),Mr(this))},Y.prototype.forceUpdate=function(e){this.__v&&(this.__e=!0,e&&this.__h.push(e),Mr(this))},Y.prototype.render=N,ie=[],Or=typeof Promise=="function"?Promise.prototype.then.bind(Promise.resolve()):setTimeout,Ur=function(e,t){return e.__v.__b-t.__v.__b},st.__r=0,Pt=Math.random().toString(8),at="__d"+Pt,De="__a"+Pt,Lr=/(PointerCapture)$|Capture$/i,Ut=0,It=Pr(!1),Ot=Pr(!0),li=0;var xe,P,Bt,Wr,$e=0,Kr=[],O=x,Vr=O.__b,Gr=O.__r,jr=O.diffed,Xr=O.__c,qr=O.unmount,Yr=O.__;function ut(e,t){O.__h&&O.__h(P,e,$e||t),$e=0;var r=P.__H||(P.__H={__:[],__h:[]});return e>=r.__.length&&r.__.push({}),r.__[e]}function A(e){return $e=1,Qr(ea,e)}function Qr(e,t,r){var a=ut(xe++,2);if(a.t=e,!a.__c&&(a.__=[r?r(t):ea(void 0,t),function(l){var d=a.__N?a.__N[0]:a.__[0],c=a.t(d,l);d!==c&&(a.__N=[c,a.__[1]],a.__c.setState({}))}],a.__c=P,!P.__f)){var n=function(l,d,c){if(!a.__c.__H)return!0;var p=!1,_=a.__c.props!==l;if(a.__c.__H.__.some(function(h){if(h.__N){p=!0;var m=h.__[0];h.__=h.__N,h.__N=void 0,m!==h.__[0]&&(_=!0)}}),i){var u=i.call(this,l,d,c);return p?u||_:u}return!p||_};P.__f=!0;var i=P.shouldComponentUpdate,s=P.componentWillUpdate;P.componentWillUpdate=function(l,d,c){if(this.__e){var p=i;i=void 0,n(l,d,c),i=p}s&&s.call(this,l,d,c)},P.shouldComponentUpdate=n}return a.__N||a.__}function E(e,t){var r=ut(xe++,3);!O.__s&&zt(r.__H,t)&&(r.__=e,r.u=t,P.__H.__h.push(r))}function Zr(e,t){var r=ut(xe++,4);!O.__s&&zt(r.__H,t)&&(r.__=e,r.u=t,P.__h.push(r))}function S(e){return $e=5,He(function(){return{current:e}},[])}function He(e,t){var r=ut(xe++,7);return zt(r.__H,t)&&(r.__=e(),r.__H=t,r.__h=e),r.__}function Ht(e,t){return $e=8,He(function(){return e},t)}function mi(){for(var e;e=Kr.shift();){var t=e.__H;if(e.__P&&t)try{t.__h.some(ct),t.__h.some($t),t.__h=[]}catch(r){t.__h=[],O.__e(r,e.__v)}}}O.__b=function(e){P=null,Vr&&Vr(e)},O.__=function(e,t){e&&t.__k&&t.__k.__m&&(e.__m=t.__k.__m),Yr&&Yr(e,t)},O.__r=function(e){Gr&&Gr(e),xe=0;var t=(P=e.__c).__H;t&&(Bt===P?(t.__h=[],P.__h=[],t.__.some(function(r){r.__N&&(r.__=r.__N),r.u=r.__N=void 0})):(t.__h.some(ct),t.__h.some($t),t.__h=[],xe=0)),Bt=P},O.diffed=function(e){jr&&jr(e);var t=e.__c;t&&t.__H&&(t.__H.__h.length&&(Kr.push(t)!==1&&Wr===O.requestAnimationFrame||((Wr=O.requestAnimationFrame)||_i)(mi)),t.__H.__.some(function(r){r.u&&(r.__H=r.u,r.u=void 0)})),Bt=P=null},O.__c=function(e,t){t.some(function(r){try{r.__h.some(ct),r.__h=r.__h.filter(function(a){return!a.__||$t(a)})}catch(a){t.some(function(n){n.__h&&(n.__h=[])}),t=[],O.__e(a,r.__v)}}),Xr&&Xr(e,t)},O.unmount=function(e){qr&&qr(e);var t,r=e.__c;r&&r.__H&&(r.__H.__.some(function(a){try{ct(a)}catch(n){t=n}}),r.__H=void 0,t&&O.__e(t,r.__v))};var Jr=typeof requestAnimationFrame=="function";function _i(e){var t,r=function(){clearTimeout(a),Jr&&cancelAnimationFrame(t),setTimeout(e)},a=setTimeout(r,35);Jr&&(t=requestAnimationFrame(r))}function ct(e){var t=P,r=e.__c;typeof r=="function"&&(e.__c=void 0,r()),P=t}function $t(e){var t=P;e.__c=e.__(),P=t}function zt(e,t){return!e||e.length!==t.length||t.some(function(r,a){return r!==e[a]})}function ea(e,t){return typeof t=="function"?t(e):t}var gi=0;function o(e,t,r,a,n,i){t||(t={});var s,l,d=t;if("ref"in d)for(l in d={},t)l=="ref"?s=t[l]:d[l]=t[l];var c={type:e,props:d,key:r,ref:s,__k:null,__:null,__b:0,__e:null,__c:null,constructor:void 0,__v:--gi,__i:-1,__u:0,__source:n,__self:i};if(typeof e=="function"&&(s=e.defaultProps))for(l in s)d[l]===void 0&&(d[l]=s[l]);return x.vnode&&x.vnode(c),c}var W={xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round","aria-hidden":"true"},dt=()=>o("svg",{...W,width:"16",height:"16",children:[o("path",{d:"m5 12 7-7 7 7"}),o("path",{d:"M12 19V5"})]});var ze=()=>o("svg",{...W,width:"14",height:"14",children:[o("path",{d:"M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"}),o("path",{d:"M20 2v4"}),o("path",{d:"M22 4h-4"}),o("circle",{cx:"4",cy:"20",r:"2"})]}),ta=()=>o("svg",{...W,width:"12",height:"12",children:o("rect",{width:"18",height:"18",x:"3",y:"3",rx:"2"})}),ra=()=>o("svg",{...W,width:"14",height:"14",children:o("path",{d:"M20 6 9 17l-5-5"})}),aa=()=>o("svg",{...W,width:"14",height:"14",children:[o("rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2"}),o("path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"})]}),We=()=>o("svg",{...W,width:"16",height:"16",children:[o("path",{d:"M18 6 6 18"}),o("path",{d:"m6 6 12 12"})]}),Ve=()=>o("svg",{...W,width:"16",height:"16",children:[o("path",{d:"M13.234 20.252 21 12.3"}),o("path",{d:"m16 6-8.414 8.586a2 2 0 0 0 0 2.828 2 2 0 0 0 2.828 0l8.414-8.586a4 4 0 0 0 0-5.656 4 4 0 0 0-5.656 0l-8.415 8.585a6 6 0 1 0 8.486 8.486"})]}),ft=()=>o("svg",{...W,width:"16",height:"16",children:[o("path",{d:"M5 12h14"}),o("path",{d:"M12 5v14"})]}),na=()=>o("svg",{...W,width:"14",height:"14",children:o("path",{d:"m9 18 6-6-6-6"})}),we=()=>o("svg",{...W,width:"14",height:"14",children:[o("path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"}),o("path",{d:"M14 2v4a2 2 0 0 0 2 2h4"}),o("path",{d:"M16 13H8"}),o("path",{d:"M16 17H8"})]}),ia=()=>o("svg",{...W,width:"14",height:"14",children:[o("path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"}),o("path",{d:"m17 8-5-5-5 5"}),o("path",{d:"M12 3v12"})]}),oa=()=>o("svg",{...W,width:"14",height:"14",children:[o("circle",{cx:"11",cy:"11",r:"8"}),o("path",{d:"m21 21-4.3-4.3"})]}),sa=()=>o("svg",{...W,width:"14",height:"14",children:[o("path",{d:"M3 6h18"}),o("path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"}),o("path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"})]}),la=()=>o("svg",{...W,width:"14",height:"14",children:o("path",{d:"m15 18-6-6 6-6"})});var te=(()=>{if(typeof document>"u")return"/agent/vendor/";let e=document.currentScript?.src;try{return new URL("vendor/",e??"/agent/").href}catch{return"/agent/vendor/"}})(),ca=new Map;function pt(e){let t=ca.get(e);if(t)return t;let r=new Promise((a,n)=>{let i=document.createElement("script");i.src=e,i.onload=()=>a(),i.onerror=()=>n(new Error(`could not load ${e}`)),document.head.append(i)});return ca.set(e,r),r}var vi=/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)\s]+\))/g;function Ge(e,t){return e.startsWith("/")?`${t.replace(/\/$/,"")}${e}`:e.startsWith("https://")||e.startsWith("http://")?e:null}function bi(e,t,r){let a=e.replace(/^(?:GET|POST|PUT|PATCH|DELETE)\s+/,""),n=t?.find(i=>i.literal===a);return n?Ge(n.url,r):null}function ht(e,t,r){return e.split(vi).map((n,i)=>{if(n.startsWith("`")&&n.endsWith("`")&&n.length>2){let l=n.slice(1,-1),d=bi(l,r,t);return d?o("a",{class:"ask-ai__code-link",href:d,target:"_blank",rel:"noopener",children:o("code",{children:l})},i):o("code",{children:l},i)}if(n.startsWith("**")&&n.endsWith("**")&&n.length>4)return o("b",{children:ht(n.slice(2,-2),t,r)},i);if(n.startsWith("*")&&n.endsWith("*")&&n.length>2)return o("em",{children:ht(n.slice(1,-1),t,r)},i);let s=/^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(n);if(s){let[,l,d]=s,c=Ge(d,t);return c?o("a",{href:c,target:"_blank",rel:"noopener noreferrer",children:l},i):n}return n})}function mt({text:e,label:t,className:r}){let[a,n]=A(!1);return E(()=>{if(!a)return;let i=window.setTimeout(()=>n(!1),1600);return()=>window.clearTimeout(i)},[a]),typeof navigator>"u"||!navigator.clipboard?null:o("button",{type:"button",class:r,"aria-label":a?"Copied":t,onClick:()=>{navigator.clipboard.writeText(e).then(()=>n(!0),()=>{})},children:a?o(ra,{}):o(aa,{})})}var ua=null;function yi(){return ua??=pt(`${te}mermaid.min.js`).then(()=>{let e=globalThis.mermaid;if(!e)throw new Error("mermaid loaded but registered nothing");return e.initialize({startOnLoad:!1,securityLevel:"strict",theme:ki()?"dark":"default",fontFamily:"inherit"}),e}),ua}function ki(){let e=document.documentElement.dataset.theme;return e==="dark"?!0:e==="light"?!1:globalThis.matchMedia?.("(prefers-color-scheme: dark)").matches??!1}var da=0;function xi({text:e}){let[t,r]=A(""),[a,n]=A(!1);return E(()=>{let i=!0;n(!1),r(""),da+=1;let s=`ask-ai-diagram-${da}`;return yi().then(l=>l.render(s,e)).then(l=>{i&&r(l.svg)}).catch(()=>{i&&n(!0),document.getElementById(s)?.remove(),document.getElementById(`d${s}`)?.remove()}),()=>{i=!1}},[e]),a?o("div",{class:"ask-ai__code",children:[o("pre",{children:o("code",{children:e})}),o(mt,{text:e,label:"Copy diagram source",className:"ask-ai__code-copy"})]}):o("div",{class:"ask-ai__diagram",dangerouslySetInnerHTML:{__html:t}})}var wi=/^\s*[-*]\s+(.*)$/,Si=/^\s*\d+[.)]\s+(.*)$/;function Ai(e){let t=[],r=null,a=[],n=null,i="",s=()=>{a.length>0&&(t.push({kind:"p",text:a.join(" ")}),a=[])},l=()=>{r&&(t.push(r),r=null)};for(let d of e.split(`
`)){if(d.trimStart().startsWith("```")){n?(t.push({kind:"code",text:n.join(`
`),lang:i,closed:!0}),n=null,i=""):(s(),l(),i=d.trim().slice(3).trim().toLowerCase(),n=[]);continue}if(n){n.push(d);continue}let c=wi.exec(d),p=c?null:Si.exec(d);if(c||p){s();let _=c?"ul":"ol";(!r||r.kind!==_)&&(l(),r={kind:_,items:[]}),r.items.push((c??p)[1]);continue}if(d.trim()===""){s(),l();continue}if(r&&/^\s{2,}/.test(d)){r.items[r.items.length-1]+=` ${d.trim()}`;continue}l(),a.push(d.replace(/^#{1,4}\s+/,"").trim())}return n&&t.push({kind:"code",text:n.join(`
`),lang:i,closed:!1}),s(),l(),t}function Wt({text:e,docsOrigin:t,links:r}){return o(N,{children:Ai(e).map((a,n)=>{if(a.kind==="p")return o("p",{children:ht(a.text,t,r)},n);if(a.kind==="code")return a.lang==="mermaid"&&a.closed?o(xi,{text:a.text},n):o("div",{class:"ask-ai__code",children:[o("pre",{children:o("code",{children:a.text})}),o(mt,{text:a.text,label:"Copy code",className:"ask-ai__code-copy"})]},n);let i=a.kind;return o(i,{children:a.items.map((s,l)=>o("li",{children:ht(s,t,r)},l))},n)})})}function fa(e){let t=[],r=!1;for(let a of e.split(`
`))/^\s*```/.test(a)?r=!r:!r&&/^##\s+/.test(a)&&t.push(a.slice(2).replace(/[*`_]/g,"").trim());return t.filter(Boolean)}var _t="The assistant is unreachable right now. Try again shortly.";function pa(e,t){if(e!==429)return _t;let r=t??{};if(r.limit==="day")return"This connection has used today's questions. The limit resets at midnight UTC.";if(r.limit==="minute"){let a=Math.ceil(r.retry_after_seconds??0);return`Too many questions in the last minute. Wait ${a>5?`about ${a} seconds`:"a moment"} and ask again.`}return"Too many questions in a short time. Wait a minute and ask again."}async function ha(e,t){let r=e.getReader(),a=new TextDecoder,n="",i=s=>{let l="message",d=[];for(let p of s.split(`
`))p.startsWith("event:")?l=p.slice(6).trim():p.startsWith("data:")&&d.push(p.slice(5).trim());if(d.length===0)return;let c;try{c=JSON.parse(d.join(`
`))}catch{return}switch(l){case"text":t.onText(c.delta??"");break;case"tool":{let p=c;t.onTool(Ri(p.name));break}case"sources":t.onSources(c);break;case"links":t.onLinks?.(c);break;case"suggestions":t.onSuggestions?.(c);break;case"skill":t.onSkill?.(c);break;case"error":t.onError(c.message||_t);break;default:break}};for(;;){let{done:s,value:l}=await r.read();if(s)break;n+=a.decode(l,{stream:!0});let d;for(;(d=n.indexOf(`

`))!==-1;){let c=n.slice(0,d);n=n.slice(d+2),i(c)}}}var Ei={search_docs:"Searching the docs",search:"Searching the docs",get_atom:"Reading the docs",related_atoms:"Reading the docs",list_atoms:"Reading the docs",get_operation:"Reading the API reference",list_operations:"Reading the API reference",decode_error:"Looking up the error",validate_request:"Checking the request",validate_fhir:"Checking the FHIR bundle",get_fhir_example:"Reading the FHIR profiles",get_fhir_profile:"Reading the FHIR profiles",list_fhir_profiles:"Reading the FHIR profiles",catalogue_info:"Checking the catalogue"};function Ri(e){return Ei[e]??"Looking this up"}var gt="abdm-docs",Vt=[{id:"skills",label:"Skills"},{id:"mcp",label:"MCP server"},{id:"plugin",label:"Plugin"}],Gt=[{id:"claude",label:"Claude"},{id:"codex",label:"Codex"},{id:"cursor",label:"Cursor"},{id:"other",label:"Other"}],Ti=["Three ways to give your agent this catalogue. Take any of them, or all three.","","- **Skills**: the milestones written as files an agent reads before it writes code. One set up line, any agent.","- **MCP server**: your agent queries these pages as it works, so it retrieves the paragraph it needs instead of loading the site.","- **Plugin**: every skill at once, as one package. Claude Code and Codex install it straight from the repository; the other Agent Plugins clients list it through their own marketplaces.","","Which one do you want?"].join(`
`);function ma(e){return!0}function Mi(e){return Vt.find(t=>t.id===e).label}function jt(e,t){return e==="other"?t?.trim()||"your agent":Gt.find(r=>r.id===e).label}function Ci(e){return`Fetch and execute the instructions to set me up for ABDM integration from ${e}/agent-setup/prompt.md`}function _a(e){return[e,"","If this session did not open in the repository I am integrating ABDM into, ask me for the path before you write anything."].join(`
`)}function Pi(e){return e.replace(/\/+$/,"")}function oe(e){return["```",e,"```"].join(`
`)}var ga="abdm-integrators-assistant",va=e=>`claude plugin marketplace add ${e} && claude plugin install ${ga}@abdm-portal`,Ii=e=>`codex plugin marketplace add ${e}`;function ba(e,t){return`claude://code/new?q=${encodeURIComponent(_a(["Set this project up for ABDM integration. Run:","",`claude plugin marketplace add ${t}`,"claude plugin install abdm-integrators-assistant@abdm-portal","",`If the marketplace add fails (the repository may not be accessible), instead fetch and execute the instructions from ${e}/agent-setup/prompt.md`].join(`
`)))}`}function Oi(e,t,r,a){let n=Ci(r);return e==="claude"?{text:["Claude Code takes the plugin, which carries every skill at once and updates in place. Run this in the repository you are integrating.","",oe(va(a))].join(`
`),link:{href:ba(r,a),label:"Open in Claude"}}:e==="cursor"?{text:["Paste this into Cursor, or let the link put it in the composer. It fetches the current instructions from this site, so what it installs cannot go stale.","",oe(n)].join(`
`),link:{href:`cursor://anysphere.cursor-deeplink/prompt?text=${encodeURIComponent(_a(n))}`,label:"Open in Cursor"}}:e==="codex"?{text:["Codex has no URL scheme, so this is a paste. Give it to a Codex session in the repository you are integrating, and it fetches the current instructions from this site.","",oe(n)].join(`
`)}:{text:[`Any agent that can fetch a URL takes this line, ${jt(e,t)} included. The instructions live on this site and are rebuilt with it, so the pasted line cannot go stale.`,"",oe(n)].join(`
`)}}function Ui(e,t,r,a){return e==="claude"?{text:["Run this in the repository you are integrating. It carries every skill at once, and `claude plugin update` keeps it current.","",oe(va(a))].join(`
`),link:{href:ba(r,a),label:"Open in Claude"}}:e==="codex"?{text:[`Add the marketplace, then install \`${ga}\` from it in Codex's plugin directory.`,"",oe(Ii(a))].join(`
`)}:{text:[`The plugin is packaged to the Agent Plugins 1.0 standard, which ${jt(e,t)} reads, but that route installs from the client's own marketplace and this plugin is not listed in one yet.`,"","The skills are the same content and they install today. Ask for Skills instead."].join(`
`)}}function Li(e,t,r,a){return a?e==="claude"?{text:["User scope, so it is there in every project rather than only this directory.","",oe(`claude mcp add --transport http ${gt} ${a} -s user`)].join(`
`),link:{href:`claude://code/new?q=${encodeURIComponent(["Add the ABDM documentation MCP server, then use it to answer my ABDM questions.","","Run this:",`claude mcp add --transport http ${gt} ${a} -s user`,"","User scope, so it is available in every project rather than only this directory."].join(`
`))}`,label:"Open in Claude"}}:e==="cursor"?{text:"The link opens Cursor on a confirmation dialog, and there is no command to run.",link:{href:`cursor://anysphere.cursor-deeplink/mcp/install?name=${gt}&config=${encodeURIComponent(btoa(JSON.stringify({url:a})))}`,label:"Add to Cursor"}}:{text:[`Any client that reads an \`mcpServers\` config takes this block as it stands, ${jt(e,t)} included.`,"",oe(JSON.stringify({mcpServers:{[gt]:{url:a}}},null,2))].join(`
`)}:{text:`The server is live, but this build of the site does not carry its address, so there is no command to give you. The address is set at deploy. [Build with AI](${r}/docs/hiecm/v3/getting-started/build-with-ai) has the current one.`}}function Xt(e,t){let r=Pi(t.docsOrigin);return e.tool==="plugin"?Ui(e.agent,e.named,r,t.pluginRepo):e.tool==="mcp"?Li(e.agent,e.named,r,t.mcpUrl):Oi(e.agent,e.named,r,t.pluginRepo)}function ya(e,t){return e.at==="tools"?Ti:e.at==="agents"?`${Mi(e.tool)} it is. Which agent are you working in?`:Xt(e,t).text}var Fi=/\b(integrat\w*|implement\w*|build|building|develop\w*|debug\w*|troubleshoot\w*|fix|fixing|broken|failing|failed|fails|error|errors|stuck|retry|retries|sandbox|certif\w*|onboard\w*|set ?up|install\w*|scaffold\w*|test\w*|why (is|does|isn.?t|doesn.?t|am|are)|how (do|can|would|should) (i|we)|not working|does ?n.?t work)\b/i;function ka(e){return Fi.test(e)}function xa(e,t,r,a){return e<=0||!r&&t<550&&e<220?0:a?e:Math.min(e,Math.max(2,Math.ceil(e/6)))}var vt="abdm-ask-ai-history";function wa(e){let r=(e.find(a=>a.from==="you")?.text.trim()??"").replace(/\s+/g," ");return r.length>72?`${r.slice(0,71)}\u2026`:r}function Sa(e,t){return[t,...e.filter(r=>r.id!==t.id)].slice(0,50)}function Aa(e=Date.now()){try{let t=JSON.parse(localStorage.getItem(vt)??"[]");return Array.isArray(t)?t.filter(r=>r?.id&&r?.turns&&e-(r.at??0)<2592e6):[]}catch{return[]}}function qt(e){try{localStorage.setItem(vt,JSON.stringify(e))}catch{try{localStorage.setItem(vt,JSON.stringify(e.slice(0,-1)))}catch{}}}function Ea(e,t){return e.filter(r=>r.id!==t)}function Ra(){try{localStorage.removeItem(vt)}catch{}}var Yt="abdm-ask-ai-current";function Ta(){try{return sessionStorage.getItem(Yt)}catch{return null}}function Ma(e){try{sessionStorage.setItem(Yt,e)}catch{}}function Ca(){try{sessionStorage.removeItem(Yt)}catch{}}var Pa="abdm-ask-ai-continued";function Ia(){try{return sessionStorage.getItem(Pa)}catch{return null}}function Oa(e){try{sessionStorage.setItem(Pa,e)}catch{}}function Ua(e,t){return t&&e.find(r=>r.id===t)||null}var La=["I answer questions about integrating with ABDM, from this portal's documentation and API references. Every answer lists the pages it used, so you can check the source.","","**What you can ask**","","- How to do something: create an ABHA, link records, request consent.","- What an error code means, and how to fix it.","- What a field, header or term means.","","**What you can give me**","","- **A page.** Press **+** and attach any page on this portal, or open me from **Ask about this page**.","- **A file.** A request, a response, a log, a PDF or a screenshot. It is read in your browser, and only its text is sent.","- **A command.** **Scaffold**, **Design**, **Integrate** and **Debug** under the chat bar draw on that part of a module's agent skill.","","**What I will not do**","","- Write code for your project. I show curl requests. For code, install the agent skills or the MCP server in your own coding agent.","- Answer from general knowledge. A path, a header or an error code comes from this portal or not at all.","- Stand in for support, for accounts, credentials or production approval.","","Your conversations stay in this browser. **History** lists them, and **New** starts again."].join(`
`),Di=/^(?:what (?:can|do|does) (?:you|this (?:assistant|bot|chat)|the (?:ask ai )?(?:assistant|bot)|ask ai) do|what (?:is|are) (?:you|ask ai|this (?:assistant|bot))|who are you|how (?:do|can) i use (?:you|this|ask ai|the assistant)|help)\s*\??$/i;function Fa(e){return Di.test(e.trim().replace(/\s+/g," "))}var Jt=[{id:"scaffold",label:"Scaffold"},{id:"design",label:"Design"},{id:"integrate",label:"Integrate"},{id:"debug",label:"Debug"}],Ni=e=>Jt.find(t=>t.id===e)?.label??e;function bt(e){let t=e.replace(/^abdm-/,"");if(/^[mp]\d$/.test(t))return t.toUpperCase();let r=t.replace(/-/g," ");return r.charAt(0).toUpperCase()+r.slice(1)}function yt(e){switch(e.status){case"used":return`Using ${bt(e.module??"")} \xB7 ${Ni(e.section)}`;case"missing":return`No ${e.section} guide for ${bt(e.module??"")} yet. Answering from the docs.`;default:return"Which module is this about?"}}var Bi=/^- \[([^\]]+)\]\(([^)\s]+)\)(?::\s*(.*))?$/;function $i(e){let t=[],r=new Set;for(let a of e.split(`
`)){let n=Bi.exec(a.trim());if(!n)continue;let i;try{i=new URL(n[2],"https://placeholder.invalid").pathname.replace(/\/$/,"")}catch{continue}!i.startsWith("/docs/")||r.has(i)||(r.add(i),t.push({title:n[1],path:i,description:(n[3]??"").trim()}))}return t}var Hi=e=>e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");function Da(e,t,r=8){let a=t.toLowerCase().split(/\s+/).filter(Boolean);if(!a.length)return[];let n=[];for(let i of e){let s=i.title.toLowerCase(),l=`${i.path} ${i.description}`.toLowerCase(),d=0,c=!0;for(let p of a)if(new RegExp(`\\b${Hi(p)}`).test(s))d+=3;else if(s.includes(p))d+=2;else if(l.includes(p))d+=1;else{c=!1;break}c&&n.push({entry:i,score:d})}return n.sort((i,s)=>s.score-i.score||i.entry.title.length-s.entry.title.length).slice(0,r).map(i=>i.entry)}var Kt=e=>e.replace(/\/$/,""),Na=(e,t)=>`${Kt(e)}${t}`,Ba=(e,t)=>`${Kt(e)}${t}.md`;function $a(e){return/^\s*(?:<!doctype html|<html[\s>])/i.test(e)}var kt=null;function Ha(e){return kt||(kt=fetch(`${Kt(e)}/llms.txt`).then(t=>t.ok?t.text():Promise.reject(new Error(`status ${t.status}`))).then($i).catch(t=>{throw kt=null,t})),kt}function zi({earlier:e,window:t,percent:r,full:a}){let i=2*Math.PI*7,s=`${Math.min(e,t)} of ${t} conversation exchanges completed.`;return o("span",{class:`ask-ai__ring${a?" ask-ai__ring--full":""}`,children:[o("span",{class:"ask-ai__ring-mark",tabIndex:0,role:"progressbar","aria-label":"Context window","aria-valuemin":0,"aria-valuemax":100,"aria-valuenow":r,"aria-describedby":"ask-ai-ring-tip",children:o("svg",{viewBox:"0 0 18 18",width:"18",height:"18","aria-hidden":"true",children:[o("circle",{class:"ask-ai__ring-track",cx:"9",cy:"9",r:7}),o("circle",{class:"ask-ai__ring-fill",cx:"9",cy:"9",r:7,"stroke-dasharray":i,"stroke-dashoffset":i*(1-r/100)})]})}),o("span",{class:"ask-ai__ring-tip",id:"ask-ai-ring-tip",role:"tooltip",children:o("span",{children:s})})]})}function za(e){let{draft:t,busy:r,menu:a,onMenu:n,page:i,file:s,fileNote:l,fileError:d,attaching:c}=e,p=S(null),_=S(null),u=i!==null&&i.markdown!=="";return E(()=>{if(a==="closed")return;let m=v=>{_.current&&!v.composedPath().includes(_.current)&&n("closed")};return document.addEventListener("pointerdown",m,!0),()=>document.removeEventListener("pointerdown",m,!0)},[a]),o("div",{class:"ask-ai__foot",children:[o("form",{class:"ask-ai__composer",onSubmit:m=>{m.preventDefault(),e.onSend()},children:[!!(i||c||s||l||d)&&o("div",{class:"ask-ai__context",children:[c&&o("span",{class:"ask-ai__chip ask-ai__chip--pending",children:[o(we,{}),o("span",{class:"ask-ai__chip-text",children:["Attaching ",c]})]}),i&&!c&&o("span",{class:`ask-ai__chip${u?"":" ask-ai__chip--failed"}`,children:[o(we,{}),o("span",{class:"ask-ai__chip-text",children:u?i.title:`Could not attach ${i.title}`}),o("button",{type:"button",class:"ask-ai__chip-remove","aria-label":u?`Remove ${i.title}`:"Dismiss",onClick:e.onRemovePage,children:o(We,{})})]}),l?o("span",{class:"ask-ai__chip ask-ai__chip--pending",children:[o(Ve,{}),o("span",{class:"ask-ai__chip-text",children:l})]}):s&&o("span",{class:"ask-ai__chip",children:[o(Ve,{}),o("span",{class:"ask-ai__chip-text",children:s.name}),o("span",{class:"ask-ai__chip-meta",children:[s.text.length.toLocaleString()," characters"]}),o("button",{type:"button",class:"ask-ai__chip-remove","aria-label":`Remove ${s.name}`,onClick:e.onRemoveFile,children:o(We,{})})]}),d&&o("span",{class:"ask-ai__context-error",children:d})]}),s?.kind&&!l&&o("p",{class:"ask-ai__context-note",children:"Read here in your browser; the file itself is not sent. Names in it are yours to check before you send."}),o("div",{class:"ask-ai__bar",children:[o("div",{class:"ask-ai__add-wrap",ref:_,children:[o("button",{type:"button",class:"ask-ai__add","aria-label":"Add a file or a page","aria-haspopup":"menu","aria-expanded":a!=="closed",disabled:r,onClick:()=>n(a==="closed"?"add":"closed"),children:o(ft,{})}),a==="add"&&o("div",{class:"ask-ai__menu",role:"menu",children:[o("button",{type:"button",role:"menuitem",class:"ask-ai__menu-item",autoFocus:!0,onClick:()=>{n("closed"),p.current?.click()},children:[o(ia,{}),"Upload from computer"]}),o("button",{type:"button",role:"menuitem",class:"ask-ai__menu-item",onClick:()=>n("pages"),children:[o(we,{}),"Attach a page"]})]}),a==="pages"&&o(Wi,{docsOrigin:e.docsOrigin,onPick:m=>{n("closed"),e.onPage(m)},onBack:()=>n("add")})]}),o("input",{ref:p,type:"file",class:"ask-ai__picker",accept:e.accept,onChange:m=>{let v=m.currentTarget;e.onFile(v.files?.[0]),v.value=""}}),o("textarea",{ref:e.field,class:"ask-ai__input",value:t,rows:1,onInput:m=>e.onDraft(m.currentTarget.value),onKeyDown:m=>{m.key==="Enter"&&!m.shiftKey&&(m.preventDefault(),e.onSend())},placeholder:"Ask about ABDM","aria-label":"Ask the assistant"}),e.memory.earlier>0&&o(zi,{...e.memory}),r?o("button",{class:"ask-ai__send ask-ai__send--stop",type:"button","aria-label":"Stop",onClick:e.onStop,children:o(ta,{})}):o("button",{class:"ask-ai__send",type:"submit","aria-label":"Send",disabled:t.trim()==="",children:o(dt,{})})]})]}),o("div",{class:"ask-ai__commands",role:"group","aria-label":"Commands",children:Jt.map(m=>o("button",{type:"button",class:"ask-ai__command","aria-pressed":e.command===m.id,onClick:()=>e.onCommand(e.command===m.id?null:m.id),children:m.label},m.id))}),o("p",{class:"ask-ai__disclaimer",children:"This bot is AI, it can make mistakes."})]})}function Wi({docsOrigin:e,onPick:t,onBack:r}){let[a,n]=A(""),[i,s]=A(null),[l,d]=A(!1),[c,p]=A(0);E(()=>{let h=!0;return Ha(e).then(m=>h&&s(m),()=>h&&d(!0)),()=>{h=!1}},[e]);let _=i?Da(i,a):[],u=l?"The page list could not be loaded.":i?a.trim()?_.length?null:"No page matches that.":"Type to search every page.":"Loading pages";return o("div",{class:"ask-ai__menu ask-ai__menu--pages",role:"dialog","aria-label":"Attach a page",children:[o("div",{class:"ask-ai__search",children:[o("button",{type:"button",class:"ask-ai__search-back","aria-label":"Back",onClick:r,children:o(la,{})}),o(oa,{}),o("input",{class:"ask-ai__search-field",value:a,autoFocus:!0,placeholder:"Search pages","aria-label":"Search pages",role:"combobox","aria-expanded":_.length>0,"aria-controls":"ask-ai-page-hits",onInput:h=>{n(h.currentTarget.value),p(0)},onKeyDown:h=>{h.key==="Enter"?(h.preventDefault(),_[c]&&t(_[c])):h.key==="ArrowDown"?(h.preventDefault(),p(m=>Math.min(m+1,_.length-1))):h.key==="ArrowUp"&&(h.preventDefault(),p(m=>Math.max(m-1,0)))}})]}),_.length>0&&o("ul",{class:"ask-ai__hits",id:"ask-ai-page-hits",role:"listbox",children:_.map((h,m)=>o("li",{role:"option","aria-selected":m===c,children:o("button",{type:"button",class:`ask-ai__hit${m===c?" ask-ai__hit--active":""}`,onMouseEnter:()=>p(m),onClick:()=>t(h),children:[o("span",{class:"ask-ai__hit-title",children:h.title}),o("span",{class:"ask-ai__hit-path",children:h.path.replace(/^\/docs\//,"")})]})},h.path))}),u&&o("p",{class:"ask-ai__search-status",children:u})]})}function Wa({sessions:e,currentId:t,onOpen:r,onForget:a,onClearAll:n}){return e.length?o("div",{class:"ask-ai__history",children:[o("p",{class:"ask-ai__history-label",children:"Recents"}),o("ul",{class:"ask-ai__history-list",children:e.map(i=>{let s=i.id===t,l=i.title||"Untitled conversation";return o("li",{class:`ask-ai__history-row${s?" ask-ai__history-row--current":""}`,children:[o("button",{type:"button",class:"ask-ai__history-open","aria-current":s?"true":void 0,title:l,onClick:()=>r(i),children:l}),o("button",{type:"button",class:"ask-ai__history-forget","aria-label":`Delete ${l}`,title:"Delete",onClick:()=>a(i.id),children:o(sa,{})})]},i.id)})}),o("div",{class:"ask-ai__history-foot",children:[o("span",{children:"Kept in this browser only."}),o("button",{type:"button",class:"ask-ai__history-clear",onClick:n,children:"Clear all"})]})]}):o("div",{class:"ask-ai__history ask-ai__history--empty",children:[o("p",{class:"ask-ai__history-none",children:"No conversations yet."}),o("p",{class:"ask-ai__history-note",children:"What you ask here is kept in this browser only."})]})}function Qa(e,t){for(var r in t)e[r]=t[r];return e}function er(e,t){for(var r in e)if(r!=="__source"&&!(r in t))return!0;for(var a in t)if(a!=="__source"&&e[a]!==t[a])return!0;return!1}function Za(e,t){var r=t(),a=A({t:{__:r,u:t}}),n=a[0].t,i=a[1];return Zr(function(){n.__=r,n.u=t,Qt(n)&&i({t:n})},[e,r,t]),E(function(){return Qt(n)&&i({t:n}),e(function(){Qt(n)&&i({t:n})})},[e]),r}function Qt(e){try{return!((t=e.__)===(r=e.u())&&(t!==0||1/t==1/r)||t!=t&&r!=r)}catch{return!0}var t,r}function Va(e,t){this.props=e,this.context=t}function en(e,t){function r(n){var i=this.props.ref;return i!=n.ref&&i&&(typeof i=="function"?i(null):i.current=null),t?!t(this.props,n)||i!=n.ref:er(this.props,n)}function a(n){return this.shouldComponentUpdate=r,ke(e,n)}return a.displayName="Memo("+(e.displayName||e.name)+")",a.__f=a.prototype.isReactComponent=!0,a.type=e,a}(Va.prototype=new Y).isPureReactComponent=!0,Va.prototype.shouldComponentUpdate=function(e,t){return er(this.props,e)||er(this.state,t)};var Ga=x.__b;x.__b=function(e){e.type&&e.type.__f&&e.ref&&(e.props.ref=e.ref,e.ref=null),Ga&&Ga(e)};var ji=typeof Symbol<"u"&&Symbol.for&&Symbol.for("react.forward_ref")||3911;function tn(e){function t(r){var a=Qa({},r);return delete a.ref,e(a,r.ref||null)}return t.$$typeof=ji,t.render=e,t.prototype.isReactComponent=t.__f=!0,t.displayName="ForwardRef("+(e.displayName||e.name)+")",t}var Xi=x.__e;x.__e=function(e,t,r,a){if(e.then){for(var n,i=t;i=i.__;)if((n=i.__c)&&n.__c)return t.__e==null&&(t.__e=r.__e,t.__k=r.__k||[]),n.__c(e,t)}Xi(e,t,r,a)};var ja=x.unmount;function rn(e,t,r){return e&&(e.__c&&e.__c.__H&&(e.__c.__H.__.forEach(function(a){typeof a.__c=="function"&&a.__c()}),e.__c.__H=null),(e=Qa({},e)).__c!=null&&(e.__c.__P===r&&(e.__c.__P=t),e.__c.__e=!0,e.__c=null),e.__k=e.__k&&e.__k.map(function(a){return rn(a,t,r)})),e}function an(e,t,r){return e&&r&&(e.__v=null,e.__k=e.__k&&e.__k.map(function(a){return an(a,t,r)}),e.__c&&e.__c.__P===t&&(e.__e&&r.appendChild(e.__e),e.__c.__e=!0,e.__c.__P=r)),e}function Zt(){this.__u=0,this.o=null,this.__b=null}function nn(e){var t=e.__&&e.__.__c;return t&&t.__a&&t.__a(e)}function xt(){this.i=null,this.l=null}x.unmount=function(e){var t=e.__c;t&&(t.__z=!0),t&&t.__R&&t.__R(),t&&32&e.__u&&(e.type=null),ja&&ja(e)},(Zt.prototype=new Y).__c=function(e,t){var r=t.__c,a=this;a.o==null&&(a.o=[]),a.o.push(r);var n=nn(a.__v),i=!1,s=function(){i||a.__z||(i=!0,r.__R=null,n?n(d):d())};r.__R=s;var l=r.__P;r.__P=null;var d=function(){if(!--a.__u){if(a.state.__a){var c=a.state.__a;a.__v.__k[0]=an(c,c.__c.__P,c.__c.__O)}var p;for(a.setState({__a:a.__b=null});p=a.o.pop();)p.__P=l,p.forceUpdate()}};a.__u++||32&t.__u||a.setState({__a:a.__b=a.__v.__k[0]}),e.then(s,s)},Zt.prototype.componentWillUnmount=function(){this.o=[]},Zt.prototype.render=function(e,t){if(this.__b){if(this.__v.__k){var r=document.createElement("div"),a=this.__v.__k[0].__c;this.__v.__k[0]=rn(this.__b,r,a.__O=a.__P)}this.__b=null}var n=t.__a&&ke(N,null,e.fallback);return n&&(n.__u&=-33),[ke(N,null,t.__a?null:e.children),n]};var Xa=function(e,t,r){if(++r[1]===r[0]&&e.l.delete(t),e.props.revealOrder&&(e.props.revealOrder[0]!=="t"||!e.l.size))for(r=e.i;r;){for(;r.length>3;)r.pop()();if(r[1]<r[0])break;e.i=r=r[2]}};(xt.prototype=new Y).__a=function(e){var t=this,r=nn(t.__v),a=t.l.get(e);return a[0]++,function(n){var i=function(){t.props.revealOrder?(a.push(n),Xa(t,e,a)):n()};r?r(i):i()}},xt.prototype.render=function(e){this.i=null,this.l=new Map;var t=Be(e.children);e.revealOrder&&e.revealOrder[0]==="b"&&t.reverse();for(var r=t.length;r--;)this.l.set(t[r],this.i=[1,0,this.i]);return e.children},xt.prototype.componentDidUpdate=xt.prototype.componentDidMount=function(){var e=this;this.l.forEach(function(t,r){Xa(e,r,t)})};var qi=typeof Symbol<"u"&&Symbol.for&&Symbol.for("react.element")||60103,Yi=/^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|dominant|fill|flood|font|glyph(?!R)|horiz|image(!S)|letter|lighting|marker(?!H|W|U)|overline|paint|pointer|shape|stop|strikethrough|stroke|text(?!L)|transform|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/,Ji=/^on(Ani|Tra|Tou|BeforeInp|Compo)/,Ki=/[A-Z0-9]/g,Qi=typeof document<"u",Zi=function(e){return(typeof Symbol<"u"&&typeof Symbol()=="symbol"?/fil|che|rad/:/fil|che|ra/).test(e)};Y.prototype.isReactComponent=!0,["componentWillMount","componentWillReceiveProps","componentWillUpdate"].forEach(function(e){Object.defineProperty(Y.prototype,e,{configurable:!0,get:function(){return this["UNSAFE_"+e]},set:function(t){Object.defineProperty(this,e,{configurable:!0,writable:!0,value:t})}})});var qa=x.event;x.event=function(e){return qa&&(e=qa(e)),e.persist=function(){},e.isPropagationStopped=function(){return this.cancelBubble},e.isDefaultPrevented=function(){return this.defaultPrevented},e.nativeEvent=e};var on,eo={configurable:!0,get:function(){return this.class}},Ya=x.vnode;x.vnode=function(e){typeof e.type=="string"&&(function(t){var r=t.props,a=t.type,n={},i=a.indexOf("-")==-1;for(var s in r){var l=r[s];if(!(s==="value"&&"defaultValue"in r&&l==null||Qi&&s==="children"&&a==="noscript"||s==="class"||s==="className")){var d=s.toLowerCase();s==="defaultValue"&&"value"in r&&r.value==null?s="value":s==="download"&&l===!0?l="":d==="translate"&&l==="no"?l=!1:d[0]==="o"&&d[1]==="n"?d==="ondoubleclick"?s="ondblclick":d!=="onchange"||a!=="input"&&a!=="textarea"||Zi(r.type)?d==="onfocus"?s="onfocusin":d==="onblur"?s="onfocusout":Ji.test(s)&&(s=d):d=s="oninput":i&&Yi.test(s)?s=s.replace(Ki,"-$&").toLowerCase():l===null&&(l=void 0),d==="oninput"&&n[s=d]&&(s="oninputCapture"),n[s]=l}}a=="select"&&(n.multiple&&Array.isArray(n.value)&&(n.value=Be(r.children).forEach(function(c){c.props.selected=n.value.indexOf(c.props.value)!=-1})),n.defaultValue!=null&&(n.value=Be(r.children).forEach(function(c){c.props.selected=n.multiple?n.defaultValue.indexOf(c.props.value)!=-1:n.defaultValue==c.props.value}))),r.class&&!r.className?(n.class=r.class,Object.defineProperty(n,"className",eo)):r.className&&(n.class=n.className=r.className),t.props=n})(e),e.$$typeof=qi,Ya&&Ya(e)};var Ja=x.__r;x.__r=function(e){Ja&&Ja(e),on=e.__c};var Ka=x.diffed;x.diffed=function(e){Ka&&Ka(e);var t=e.props,r=e.__e;r!=null&&e.type==="textarea"&&"value"in t&&t.value!==r.value&&(r.value=t.value==null?"":t.value),on=null};var sn=`#version 300 es
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
}`;var ln=1920*1080*4,je=class{parentElement;canvasElement;gl;program=null;uniformLocations={};fragmentShader;rafId=null;lastRenderTime=0;currentFrame=0;speed=0;currentSpeed=0;providedUniforms;mipmaps=[];hasBeenDisposed=!1;resolutionChanged=!0;textures=new Map;minPixelRatio;maxPixelCount;isSafari=no();uniformCache={};textureUnitMap=new Map;ownerDocument;constructor(t,r,a,n,i=0,s=0,l=2,d=ln,c=[]){if(t?.nodeType===1)this.parentElement=t;else throw new Error("Paper Shaders: parent element must be an HTMLElement");if(this.ownerDocument=t.ownerDocument,!this.ownerDocument.querySelector("style[data-paper-shader]")){let u=this.ownerDocument.createElement("style");u.innerHTML=ao,u.setAttribute("data-paper-shader",""),this.ownerDocument.head.prepend(u)}let p=this.ownerDocument.createElement("canvas");this.canvasElement=p,this.parentElement.prepend(p),this.fragmentShader=r,this.providedUniforms=a,this.mipmaps=c,this.currentFrame=s,this.minPixelRatio=l,this.maxPixelCount=d;let _=p.getContext("webgl2",n);if(!_)throw new Error("Paper Shaders: WebGL is not supported in this browser");this.gl=_,this.initProgram(),this.setupPositionAttribute(),this.setupUniforms(),this.setUniformValues(this.providedUniforms),this.setupResizeObserver(),visualViewport?.addEventListener("resize",this.handleVisualViewportChange),this.setupIntersectionObserver(),this.setSpeed(i),this.parentElement.setAttribute("data-paper-shader",""),this.parentElement.paperShaderMount=this,this.ownerDocument.addEventListener("visibilitychange",this.handleDocumentVisibilityChange)}initProgram=()=>{let t=ro(this.gl,sn,this.fragmentShader);t&&(this.program=t)};setupPositionAttribute=()=>{let t=this.gl.getAttribLocation(this.program,"a_position"),r=this.gl.createBuffer();this.gl.bindBuffer(this.gl.ARRAY_BUFFER,r);let a=[-1,-1,1,-1,-1,1,-1,1,1,-1,1,1];this.gl.bufferData(this.gl.ARRAY_BUFFER,new Float32Array(a),this.gl.STATIC_DRAW),this.gl.enableVertexAttribArray(t),this.gl.vertexAttribPointer(t,2,this.gl.FLOAT,!1,0,0)};setupUniforms=()=>{let t={u_time:this.gl.getUniformLocation(this.program,"u_time"),u_pixelRatio:this.gl.getUniformLocation(this.program,"u_pixelRatio"),u_resolution:this.gl.getUniformLocation(this.program,"u_resolution")};Object.entries(this.providedUniforms).forEach(([r,a])=>{if(t[r]=this.gl.getUniformLocation(this.program,r),a instanceof HTMLImageElement){let n=`${r}AspectRatio`;t[n]=this.gl.getUniformLocation(this.program,n)}}),this.uniformLocations=t};renderScale=1;parentWidth=0;parentHeight=0;parentDevicePixelWidth=0;parentDevicePixelHeight=0;devicePixelsSupported=!1;intersectionObserver=null;isInViewport=!0;resizeObserver=null;setupResizeObserver=()=>{this.resizeObserver=new ResizeObserver(([t])=>{if(t?.borderBoxSize[0]){let r=t.devicePixelContentBoxSize?.[0];r!==void 0&&(this.devicePixelsSupported=!0,this.parentDevicePixelWidth=r.inlineSize,this.parentDevicePixelHeight=r.blockSize),this.parentWidth=t.borderBoxSize[0].inlineSize,this.parentHeight=t.borderBoxSize[0].blockSize}this.handleResize()}),this.resizeObserver.observe(this.parentElement)};setupIntersectionObserver=()=>{let t=this.ownerDocument.defaultView;t?.IntersectionObserver&&(this.intersectionObserver=new t.IntersectionObserver(([r])=>{this.isInViewport=r?.isIntersecting??!0,this.updateCurrentSpeed()}),this.intersectionObserver.observe(this.parentElement))};handleVisualViewportChange=()=>{this.resizeObserver?.disconnect(),this.setupResizeObserver()};handleResize=()=>{let t=0,r=0,a=Math.max(1,window.devicePixelRatio),n=visualViewport?.scale??1;if(this.devicePixelsSupported){let p=Math.max(1,this.minPixelRatio/a);t=this.parentDevicePixelWidth*p*n,r=this.parentDevicePixelHeight*p*n}else{let p=Math.max(a,this.minPixelRatio)*n;if(this.isSafari){let _=io(this.ownerDocument);p*=Math.max(1,_)}t=Math.round(this.parentWidth)*p,r=Math.round(this.parentHeight)*p}let i=Math.sqrt(this.maxPixelCount)/Math.sqrt(t*r),s=Math.min(1,i),l=Math.round(t*s),d=Math.round(r*s),c=l/Math.round(this.parentWidth);(this.canvasElement.width!==l||this.canvasElement.height!==d||this.renderScale!==c)&&(this.renderScale=c,this.canvasElement.width=l,this.canvasElement.height=d,this.resolutionChanged=!0,this.gl.viewport(0,0,this.gl.canvas.width,this.gl.canvas.height),this.render(performance.now()))};render=t=>{if(this.hasBeenDisposed)return;if(this.program===null){console.warn("Tried to render before program or gl was initialized");return}let r=t-this.lastRenderTime;this.lastRenderTime=t,this.currentSpeed!==0&&(this.currentFrame+=r*this.currentSpeed),this.gl.clear(this.gl.COLOR_BUFFER_BIT),this.gl.useProgram(this.program),this.gl.uniform1f(this.uniformLocations.u_time,this.currentFrame*.001),this.resolutionChanged&&(this.gl.uniform2f(this.uniformLocations.u_resolution,this.gl.canvas.width,this.gl.canvas.height),this.gl.uniform1f(this.uniformLocations.u_pixelRatio,this.renderScale),this.resolutionChanged=!1),this.gl.drawArrays(this.gl.TRIANGLES,0,6),this.currentSpeed!==0?this.requestRender():this.rafId=null};requestRender=()=>{this.rafId!==null&&cancelAnimationFrame(this.rafId),this.rafId=requestAnimationFrame(this.render)};setTextureUniform=(t,r)=>{if(!r.complete||r.naturalWidth===0)throw new Error(`Paper Shaders: image for uniform ${t} must be fully loaded`);let a=this.textures.get(t);a&&this.gl.deleteTexture(a),this.textureUnitMap.has(t)||this.textureUnitMap.set(t,this.textureUnitMap.size);let n=this.textureUnitMap.get(t);this.gl.activeTexture(this.gl.TEXTURE0+n);let i=this.gl.createTexture();this.gl.bindTexture(this.gl.TEXTURE_2D,i),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_WRAP_S,this.gl.CLAMP_TO_EDGE),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_WRAP_T,this.gl.CLAMP_TO_EDGE),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MIN_FILTER,this.gl.LINEAR),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MAG_FILTER,this.gl.LINEAR),this.gl.texImage2D(this.gl.TEXTURE_2D,0,this.gl.RGBA,this.gl.RGBA,this.gl.UNSIGNED_BYTE,r),this.mipmaps.includes(t)&&(this.gl.generateMipmap(this.gl.TEXTURE_2D),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MIN_FILTER,this.gl.LINEAR_MIPMAP_LINEAR));let s=this.gl.getError();if(s!==this.gl.NO_ERROR||i===null){console.error("Paper Shaders: WebGL error when uploading texture:",s);return}this.textures.set(t,i);let l=this.uniformLocations[t];if(l){this.gl.uniform1i(l,n);let d=`${t}AspectRatio`,c=this.uniformLocations[d];if(c){let p=r.naturalWidth/r.naturalHeight;this.gl.uniform1f(c,p)}}};areUniformValuesEqual=(t,r)=>t===r?!0:Array.isArray(t)&&Array.isArray(r)&&t.length===r.length?t.every((a,n)=>this.areUniformValuesEqual(a,r[n])):!1;setUniformValues=t=>{this.gl.useProgram(this.program),Object.entries(t).forEach(([r,a])=>{let n=a;if(a instanceof HTMLImageElement&&(n=`${a.src.slice(0,200)}|${a.naturalWidth}x${a.naturalHeight}`),this.areUniformValuesEqual(this.uniformCache[r],n))return;this.uniformCache[r]=n;let i=this.uniformLocations[r];if(!i){console.warn(`Uniform location for ${r} not found`);return}if(a instanceof HTMLImageElement)this.setTextureUniform(r,a);else if(Array.isArray(a)){let s=null,l=null;if(a[0]!==void 0&&Array.isArray(a[0])){let d=a[0].length;if(a.every(c=>c.length===d))s=a.flat(),l=d;else{console.warn(`All child arrays must be the same length for ${r}`);return}}else s=a,l=s.length;switch(l){case 2:this.gl.uniform2fv(i,s);break;case 3:this.gl.uniform3fv(i,s);break;case 4:this.gl.uniform4fv(i,s);break;case 9:this.gl.uniformMatrix3fv(i,!1,s);break;case 16:this.gl.uniformMatrix4fv(i,!1,s);break;default:console.warn(`Unsupported uniform array length: ${l}`)}}else typeof a=="number"?this.gl.uniform1f(i,a):typeof a=="boolean"?this.gl.uniform1i(i,a?1:0):console.warn(`Unsupported uniform type for ${r}: ${typeof a}`)})};getCurrentFrame=()=>this.currentFrame;setFrame=t=>{this.currentFrame=t,this.lastRenderTime=performance.now(),this.render(performance.now())};setSpeed=(t=1)=>{this.speed=t,this.updateCurrentSpeed()};updateCurrentSpeed=()=>{this.setCurrentSpeed(this.ownerDocument.hidden||!this.isInViewport?0:this.speed)};setCurrentSpeed=t=>{this.currentSpeed=t,this.rafId===null&&t!==0&&(this.lastRenderTime=performance.now(),this.rafId=requestAnimationFrame(this.render)),this.rafId!==null&&t===0&&(cancelAnimationFrame(this.rafId),this.rafId=null)};setMaxPixelCount=(t=ln)=>{this.maxPixelCount=t,this.handleResize()};setMinPixelRatio=(t=2)=>{this.minPixelRatio=t,this.handleResize()};setUniforms=t=>{this.setUniformValues(t),this.providedUniforms={...this.providedUniforms,...t},this.render(performance.now())};handleDocumentVisibilityChange=()=>{this.updateCurrentSpeed()};dispose=()=>{this.hasBeenDisposed=!0,this.rafId!==null&&(cancelAnimationFrame(this.rafId),this.rafId=null),this.gl&&this.program&&(this.textures.forEach(t=>{this.gl.deleteTexture(t)}),this.textures.clear(),this.gl.deleteProgram(this.program),this.program=null,this.gl.bindBuffer(this.gl.ARRAY_BUFFER,null),this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER,null),this.gl.bindRenderbuffer(this.gl.RENDERBUFFER,null),this.gl.bindFramebuffer(this.gl.FRAMEBUFFER,null),this.gl.getError()),this.resizeObserver&&(this.resizeObserver.disconnect(),this.resizeObserver=null),this.intersectionObserver&&(this.intersectionObserver.disconnect(),this.intersectionObserver=null),visualViewport?.removeEventListener("resize",this.handleVisualViewportChange),this.ownerDocument.removeEventListener("visibilitychange",this.handleDocumentVisibilityChange),this.uniformLocations={},this.canvasElement.remove(),delete this.parentElement.paperShaderMount}};function cn(e,t,r){let a=e.createShader(t);return a?(e.shaderSource(a,r),e.compileShader(a),e.getShaderParameter(a,e.COMPILE_STATUS)?a:(console.error("An error occurred compiling the shaders: "+e.getShaderInfoLog(a)),e.deleteShader(a),null)):null}function ro(e,t,r){let a=e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT),n=a?a.precision:null;n&&n<23&&(t=t.replace(/precision\s+(lowp|mediump)\s+float;/g,"precision highp float;"),r=r.replace(/precision\s+(lowp|mediump)\s+float/g,"precision highp float").replace(/\b(uniform|varying|attribute)\s+(lowp|mediump)\s+(\w+)/g,"$1 highp $3"));let i=cn(e,e.VERTEX_SHADER,t),s=cn(e,e.FRAGMENT_SHADER,r);if(!i||!s)return null;let l=e.createProgram();return l?(e.attachShader(l,i),e.attachShader(l,s),e.linkProgram(l),e.getProgramParameter(l,e.LINK_STATUS)?(e.detachShader(l,i),e.detachShader(l,s),e.deleteShader(i),e.deleteShader(s),l):(console.error("Unable to initialize the shader program: "+e.getProgramInfoLog(l)),e.deleteProgram(l),e.deleteShader(i),e.deleteShader(s),null)):null}var ao=`@layer paper-shaders {
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
}`;function no(){let e=navigator.userAgent.toLowerCase();return e.includes("safari")&&!e.includes("chrome")&&!e.includes("android")}function io(e){let t=visualViewport?.scale??1,r=visualViewport?.width??window.innerWidth,a=window.innerWidth-e.documentElement.clientWidth,n=t*r+a,i=outerWidth/n,s=Math.round(100*i);return s%5===0?s/100:s===33?1/3:s===67?2/3:s===133?4/3:i}var Se={fit:"contain",scale:1,rotation:0,offsetX:0,offsetY:0,originX:.5,originY:.5,worldWidth:0,worldHeight:0};var tr={none:0,contain:1,cover:2};var un=`
#define TWO_PI 6.28318530718
#define PI 3.14159265358979323846
`,dn=`
vec2 rotate(vec2 uv, float th) {
  return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
}
`;var fn=`
  float hash21(vec2 p) {
    p = fract(p * vec2(0.3183099, 0.3678794)) + 0.1;
    p += dot(p, p + 19.19);
    return fract(p.x * p.y);
  }
`;var rr={maxColorCount:10},ar=`#version 300 es
precision mediump float;

uniform float u_time;

uniform vec4 u_colors[${rr.maxColorCount}];
uniform float u_colorsCount;

uniform float u_distortion;
uniform float u_swirl;
uniform float u_grainMixer;
uniform float u_grainOverlay;

in vec2 v_objectUV;
out vec4 fragColor;

${un}
${dn}
${fn}

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

  for (int i = 0; i < ${rr.maxColorCount}; i++) {
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
`;function nr(e){if(Array.isArray(e))return e.length===4?e:e.length===3?[...e,1]:Ae;if(typeof e!="string")return Ae;let t,r,a,n=1;if(e.startsWith("#"))[t,r,a,n]=oo(e);else if(e.startsWith("rgb")){let i=so(e);if(i===null)return Ae;[t,r,a,n]=i}else if(e.startsWith("hsl")){let i=lo(e);if(i===null)return Ae;[t,r,a,n]=co(i)}else return console.error("Unsupported color format",e),Ae;return[wt(t,0,1),wt(r,0,1),wt(a,0,1),wt(n,0,1)]}function oo(e){if(e=e.replace(/^#/,""),(e.length===3||e.length===4)&&(e=e.split("").map(i=>i+i).join("")),e.length===6&&(e=e+"ff"),!/^[0-9a-f]{8}$/i.test(e))return console.warn("Invalid hex color"),Ae;let t=parseInt(e.slice(0,2),16)/255,r=parseInt(e.slice(2,4),16)/255,a=parseInt(e.slice(4,6),16)/255,n=parseInt(e.slice(6,8),16)/255;return[t,r,a,n]}function so(e){let t=e.match(/^rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([0-9.]+))?\s*\)$/i);return t?[parseInt(t[1]??"0")/255,parseInt(t[2]??"0")/255,parseInt(t[3]??"0")/255,t[4]===void 0?1:parseFloat(t[4])]:null}function lo(e){let t=e.match(/^hsla?\s*\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*(?:,\s*([0-9.]+))?\s*\)$/i);return t?[parseInt(t[1]??"0"),parseInt(t[2]??"0"),parseInt(t[3]??"0"),t[4]===void 0?1:parseFloat(t[4])]:null}function co(e){let[t,r,a,n]=e,i=t/360,s=r/100,l=a/100,d,c,p;if(r===0)d=c=p=l;else{let _=(m,v,g)=>(g<0&&(g+=1),g>1&&(g-=1),g<.16666666666666666?m+(v-m)*6*g:g<.5?v:g<.6666666666666666?m+(v-m)*(.6666666666666666-g)*6:m),u=l<.5?l*(1+s):l+s-l*s,h=2*l-u;d=_(h,u,i+1/3),c=_(h,u,i),p=_(h,u,i-1/3)}return[d,c,p,n]}var wt=(e,t,r)=>Math.min(Math.max(e,t),r),Ae=[.5,.5,.5,1];var ir="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";function pn(e){let t=S(void 0),r=Ht(a=>{let n=e.map(i=>{if(i!=null){if(typeof i=="function"){let s=i,l=s(a);return typeof l=="function"?l:()=>{s(null)}}return i.current=a,()=>{i.current=null}}});return()=>{n.forEach(i=>i?.())}},e);return He(()=>e.every(a=>a==null)?null:a=>{t.current&&(t.current(),t.current=void 0),a!=null&&(t.current=r(a))},e)}function or(e){if(e.naturalWidth<1024&&e.naturalHeight<1024){if(e.naturalWidth<1||e.naturalHeight<1)return;let t=e.naturalWidth/e.naturalHeight;e.width=Math.round(t>1?1024*t:1024),e.height=Math.round(t>1?1024:1024/t)}}async function hn(e){let t={},r=[],a=i=>{try{return i.startsWith("/")||new URL(i),!0}catch{return!1}},n=i=>{try{return i.startsWith("/")?!1:new URL(i,window.location.origin).origin!==window.location.origin}catch{return!1}};return Object.entries(e).forEach(([i,s])=>{if(typeof s=="string"){let l=s||ir;if(!a(l)){console.warn(`Uniform "${i}" has invalid URL "${l}". Skipping image loading.`);return}let d=new Promise((c,p)=>{let _=new Image;n(l)&&(_.crossOrigin="anonymous"),_.onload=()=>{or(_),t[i]=_,c()},_.onerror=()=>{console.error(`Could not set uniforms. Failed to load image at ${l}`),p()},_.src=l});r.push(d)}else if(s instanceof HTMLImageElement){let l=s.decode().then(()=>{or(s),t[i]=s});r.push(l)}else t[i]=s}),await Promise.all(r),t}var sr=tn(function({fragmentShader:t,uniforms:r,webGlContextAttributes:a,speed:n=0,frame:i=0,width:s,height:l,minPixelRatio:d,maxPixelCount:c,mipmaps:p,style:_,...u},h){let[m,v]=A(!1),g=S(null),y=S(null),w=S(a);E(()=>((async()=>{let F=await hn(r);g.current&&!y.current&&(y.current=new je(g.current,t,F,w.current,n,i,d,c,p),v(!0))})(),()=>{y.current?.dispose(),y.current=null}),[t]),E(()=>{let U=!1;return(async()=>{let T=await hn(r);U||y.current?.setUniforms(T)})(),()=>{U=!0}},[r,m]),E(()=>{y.current?.setSpeed(n)},[n,m]),E(()=>{y.current?.setMaxPixelCount(c)},[c,m]),E(()=>{y.current?.setMinPixelRatio(d)},[d,m]),E(()=>{y.current?.setFrame(i)},[i,m]);let I=pn([g,h]);return o("div",{ref:I,style:s!==void 0||l!==void 0?{width:typeof s=="string"&&isNaN(+s)===!1?+s:s,height:typeof l=="string"&&isNaN(+l)===!1?+l:l,..._}:_,...u})});sr.displayName="ShaderMount";function mn(e,t){if(Object.keys(e).length!==Object.keys(t).length)return!1;for(let r in e){if(r==="colors"){let a=Array.isArray(e.colors),n=Array.isArray(t.colors);if(!a||!n){if(Object.is(e.colors,t.colors)===!1)return!1;continue}if(e.colors?.length!==t.colors?.length||!e.colors?.every((i,s)=>i===t.colors?.[s]))return!1;continue}if(Object.is(e[r],t[r])===!1)return!1}return!0}var H={name:"Default",params:{...Se,speed:1,frame:0,colors:["#e0eaff","#241d9a","#f75092","#9f50d3"],distortion:.8,swirl:.1,grainMixer:0,grainOverlay:0}},il={name:"Purple",params:{...Se,speed:.6,frame:0,colors:["#aaa7d7","#3c2b8e"],distortion:1,swirl:1,grainMixer:0,grainOverlay:0}},ol={name:"Beach",params:{...Se,speed:.1,frame:0,colors:["#bcecf6","#00aaff","#00f7ff","#ffd447"],distortion:.8,swirl:.35,grainMixer:0,grainOverlay:0}},sl={name:"Ink",params:{...Se,speed:1,frame:0,colors:["#ffffff","#000000"],distortion:1,swirl:.2,rotation:90,grainMixer:0,grainOverlay:0}};var lr=en(function({speed:t=H.params.speed,frame:r=H.params.frame,colors:a=H.params.colors,distortion:n=H.params.distortion,swirl:i=H.params.swirl,grainMixer:s=H.params.grainMixer,grainOverlay:l=H.params.grainOverlay,fit:d=H.params.fit,rotation:c=H.params.rotation,scale:p=H.params.scale,originX:_=H.params.originX,originY:u=H.params.originY,offsetX:h=H.params.offsetX,offsetY:m=H.params.offsetY,worldWidth:v=H.params.worldWidth,worldHeight:g=H.params.worldHeight,...y}){let w={u_colors:a.map(nr),u_colorsCount:a.length,u_distortion:n,u_swirl:i,u_grainMixer:s,u_grainOverlay:l,u_fit:tr[d],u_rotation:c,u_scale:p,u_offsetX:h,u_offsetY:m,u_originX:_,u_originY:u,u_worldWidth:v,u_worldHeight:g};return o(sr,{...y,speed:t,frame:r,fragmentShader:ar,uniforms:w})},mn);var Xe="#fb7185",qe="#f43f5e",cr=e=>{let t=e.replace("#",""),r=t.length===3?t.split("").map(n=>n+n).join(""):t,a=Number.parseInt(r,16);return[a>>16&255,a>>8&255,a&255]},ur=(e,t)=>{switch(e){case"listening":return .4+.32*Math.abs(Math.sin(t*8.5))+.18*Math.abs(Math.sin(t*4.1+1.5));case"speaking":return .3+.24*Math.abs(Math.sin(t*6.2))+.16*Math.abs(Math.sin(t*3+.6));case"thinking":return .24+.2*Math.abs(Math.sin(t*2.4));case"connecting":return .12+.1*Math.abs(Math.sin(t*1.6));case"error":return .2;default:return 0}},he=(e,t,r,a)=>e+(t-e)*(1-Math.exp(-r*a)),_n=({size:e,speed:t,colorFrom:r,colorTo:a})=>{let n={};return e!=null&&(n["--orb-size"]=`${e}px`),t!=null&&(n["--orb-speed"]=`${t}`),r&&(n["--orb-color-from"]=r),a&&(n["--orb-color-to"]=a),n};var St=(e,t)=>{let r=!0,a=document.visibilityState==="visible",n=r&&a,i=()=>{let d=r&&a;d!==n&&(n=d,t(d))},s=new IntersectionObserver(d=>{r=d[d.length-1]?.isIntersecting??!0,i()});s.observe(e);let l=()=>{a=document.visibilityState==="visible",i()};return document.addEventListener("visibilitychange",l),()=>{s.disconnect(),document.removeEventListener("visibilitychange",l)}},Ye=null,gn=()=>{if(Ye!==null)return Ye;try{let e=document.createElement("canvas"),t={failIfMajorPerformanceCaveat:!0};Ye=e.getContext("webgl2",t)!==null||e.getContext("webgl",t)!==null}catch{Ye=!1}return Ye};var kn="(prefers-reduced-motion: reduce)",uo=e=>{let t=window.matchMedia(kn);return t.addEventListener("change",e),()=>t.removeEventListener("change",e)},fo=()=>Za(uo,()=>window.matchMedia(kn).matches),me=(e,t,r)=>{let[a,n,i]=cr(e),[s,l,d]=cr(t),c=(p,_)=>Math.round(p+(_-p)*r).toString(16).padStart(2,"0");return`#${c(a,s)}${c(n,l)}${c(i,d)}`},xn=(e,t)=>me(e,"#000000",t),At=(e,t)=>me(e,"#ffffff",t),wn=(e,t)=>[xn(e,.35),e,me(e,t,.5),t,At(t,.35)],vn=wn(Xe,qe),po={antialias:!0,powerPreference:"low-power"},ho=8e3,mo=66,_o=.1,go=7.5,bn=6,vo=5,bo=6,yo=6,ko=.9,xo=e=>e==="error"?1.8:e==="listening"?1.6:e==="speaking"?1.1:e==="thinking"?.95:e==="connecting"?.5:.3,dr=e=>e==="error"?.2:e==="speaking"?.18:e==="listening"?.16:e==="thinking"?.1:e==="connecting"?.08:.06,wo={distortion:.42,swirl:.26},fr=(e,t,r=wo)=>{switch(e){case"thinking":return{distortion:.35,swirl:Math.min(1,.75+t*.2)};case"listening":case"speaking":return{distortion:Math.min(1,.5+t*.4),swirl:Math.min(1,.3+t*.25)};case"error":return{distortion:.85,swirl:.55};case"connecting":return{distortion:Math.min(1,.42+t*.55),swirl:.3};default:return r}},Sn=(e,t)=>e==="disabled"?0:xo(e)*t,yn=(e,t,r)=>({energy:0,...fr(e,0,r),shaderSpeed:Sn(e,t),grain:dr(e),errorMix:e==="error"?1:0}),Ee=(e,t)=>Math.round(e*t)/t,So=(e,t)=>e.energy===t.energy&&e.distortion===t.distortion&&e.swirl===t.swirl&&e.shaderSpeed===t.shaderSpeed&&e.grain===t.grain&&e.errorMix===t.errorMix,pr=({state:e="idle",size:t=160,speed:r=1,colorFrom:a="#7c3aed",colorTo:n="#06b6d4",colors:i,idleMotion:s,meshScale:l=1.15,gloss:d=!0,levelRef:c,label:p="Assistant orb",className:_})=>{let u=S(null),h=S(null),m=S(e),v=S(r),g=fo(),y=gn(),w=S(s);w.current=s;let[I,U]=A(()=>yn(e,r,s)),F=S(null);E(()=>{m.current=e,v.current=r}),E(()=>{if(g)return;let D=u.current;if(!D)return;F.current===null&&(F.current=yn(m.current,v.current,w.current));let R=F.current,z=0,J=null,Qe=0,ce=0,_e=!0,ue=G=>{z=0;let Z=Math.min(_o,J===null?1/60:(G-J)/1e3);J=G;let ae=m.current,j=v.current;Qe+=Z*j;let Te=c?.current,Rt=typeof Te=="number"&&Te>=0;R.energy=he(R.energy,Rt?Te:ur(ae,Qe),go,Z);let Me=fr(ae,R.energy,w.current);if(R.distortion=he(R.distortion,Me.distortion,bn,Z),R.swirl=he(R.swirl,Me.swirl,bn,Z),R.shaderSpeed=he(R.shaderSpeed,Sn(ae,j),vo,Z),R.grain=he(R.grain,dr(ae),bo,Z),R.errorMix=he(R.errorMix,ae==="error"?1:0,yo,Z),D.style.setProperty("--orb-level",R.energy.toFixed(3)),y&&G-ce>mo){ce=G;let fe={energy:Ee(R.energy,50),distortion:Ee(R.distortion,100),swirl:Ee(R.swirl,100),shaderSpeed:Ee(R.shaderSpeed,100),grain:Ee(R.grain,200),errorMix:Ee(R.errorMix,100)};U(ge=>So(ge,fe)?ge:fe)}_e&&(z=requestAnimationFrame(ue))},de=()=>{z===0&&(J=null,z=requestAnimationFrame(ue))},Ze=()=>{z!==0&&(cancelAnimationFrame(z),z=0),J=null},Re=St(D,G=>{_e=G,G?de():Ze()});return de(),()=>{Ze(),Re()}},[c,g,y]),E(()=>{if(e!=="error"||g)return;let D=h.current;if(!D)return;let R=D.animate([{transform:"translateX(0)"},{transform:"translateX(-1.5px)"},{transform:"translateX(3px)"},{transform:"translateX(-2px)"},{transform:"translateX(1px)"},{transform:"translateX(0)"}],{duration:340,easing:"ease-out"});return()=>R.cancel()},[e,g]);let T=ur(e,ko),V=g?{energy:T,...fr(e,T,s),shaderSpeed:0,grain:dr(e),errorMix:e==="error"?1:0}:I,M=y?V.errorMix:e==="error"?1:0,re=M>=1?Xe:M<=0?a:me(a,Xe,M),L=M>=1?qe:M<=0?n:me(n,qe,M),$=i??wn(a,n),se=M>=1?vn:M<=0?$:$.map((D,R)=>me(D,vn[R],M)),Ke=[{key:"brand",from:a,to:n,visible:e!=="error"},{key:"error",from:Xe,to:qe,visible:e==="error"}].map(({key:D,from:R,to:z,visible:J})=>({key:D,visible:J,base:`radial-gradient(circle at 50% 40%, ${At(R,.12)}, ${me(R,z,.55)} 55%, ${xn(z,.35)} 100%)`,glow:`radial-gradient(circle at 32% 26%, ${At(z,.45)}, transparent 55%), radial-gradient(circle at 66% 72%, ${At(R,.2)}, transparent 62%)`})),le={..._n({size:t,speed:r,colorFrom:a,colorTo:n}),...g?{"--orb-level":T.toFixed(3)}:null,width:t,height:t,position:"relative",borderRadius:"50%",opacity:e==="disabled"?.5:1,filter:e==="disabled"?"grayscale(0.85)":"grayscale(0)",transform:y?`scale(${(1+V.energy*.06).toFixed(4)})`:void 0,scale:y?void 0:"calc(1 + var(--orb-level, 0) * 0.06)",transition:"transform 0.2s ease-out, opacity 0.3s ease-out, filter 0.3s ease-out"};return o("div",{ref:u,role:"img","aria-label":p,"data-state":e,class:_,style:le,children:[o("div",{style:{position:"absolute",inset:0,borderRadius:"50%",boxShadow:`0 ${-t*.06}px ${t*.3}px color-mix(in oklab, ${re} 55%, transparent), 0 ${t*.06}px ${t*.3}px color-mix(in oklab, ${L} 55%, transparent)`,opacity:y?Math.min(1,.35+V.energy*.65):"calc(0.35 + var(--orb-level, 0) * 0.6)",transform:y?`scale(${(1+V.energy*.08).toFixed(4)})`:void 0,scale:y?void 0:"calc(1 + var(--orb-level, 0) * 0.08)",transition:y?"opacity 0.2s ease-out, transform 0.2s ease-out, box-shadow 0.35s ease":"box-shadow 0.35s ease"}}),o("div",{ref:h,style:{position:"absolute",inset:0,borderRadius:"50%",overflow:"hidden",boxShadow:`inset 0 0 0 1px color-mix(in oklab, ${re} 45%, transparent), 0 0 0 1px rgba(255,255,255,0.08)`,transition:"box-shadow 0.35s ease"},children:[y?o(lr,{width:t,height:t,colors:se,distortion:V.distortion,swirl:V.swirl,scale:l,speed:V.shaderSpeed,frame:ho,grainMixer:V.grain,grainOverlay:.05,minPixelRatio:2,webGlContextAttributes:po}):o("div",{"aria-hidden":"true",style:{position:"absolute",inset:0,borderRadius:"50%"},children:Ke.map(D=>o("div",{style:{position:"absolute",inset:0,borderRadius:"50%",backgroundImage:D.base,opacity:D.visible?1:0,transition:"opacity 0.35s ease"},children:o("div",{style:{position:"absolute",inset:0,borderRadius:"50%",backgroundImage:D.glow,opacity:"calc(0.25 + var(--orb-level, 0) * 0.75)"}})},D.key))}),d&&o("div",{style:{position:"absolute",inset:0,borderRadius:"50%",pointerEvents:"none",backgroundImage:"radial-gradient(circle at 31% 22%, rgba(255,255,255,0.55), transparent 14%), radial-gradient(circle at 30% 26%, rgba(255,255,255,0.28), transparent 48%), radial-gradient(circle at 68% 76%, rgba(10,14,24,0.42), transparent 60%)"}})]})]})};var Tn=["#9483ec","#bcc0f7","#6a8bf1","#7fd6fb","#f2f4ff"],Mn=1.6,Cn={distortion:1,swirl:.85},An=.76,Ao=.86,Pn=10,En=()=>typeof window<"u"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;function hr(e,t){let r=.5+.5*Math.sin(t*.85),a=e/2*(An+(Ao-An)*r);return{rx:a*(1+.035*Math.sin(t*1.3)),ry:a*(1+.035*Math.sin(t*1.7+1.2)),cx:e/2+e*.012*Math.sin(t*.7),cy:e/2+e*.012*Math.cos(t*.8+.5)}}var In=({rx:e,ry:t,cx:r,cy:a})=>`${e.toFixed(1)}px ${t.toFixed(1)}px at ${r.toFixed(1)}px ${a.toFixed(1)}px`,mr=e=>`radial-gradient(${In(e)}, #000 0%, #000 ${100-Pn}%, transparent 100%)`,Rn=e=>`radial-gradient(${In(e)}, transparent 0%, transparent ${100-Pn}%, #000 100%)`;function _r(e,t){e&&(e.style.maskImage=t,e.style.setProperty("-webkit-mask-image",t))}function On({size:e,state:t="idle",label:r="Assistant"}){let a={position:"absolute",inset:0,borderRadius:"50%"},n=v=>`${Math.max(1,e*v)}px`,i=S(null),s=S(null),l=S(null),d=S(null),c=S(null),p=S(null),_=hr(e,0);E(()=>{let v=T=>{_r(s.current,mr(T)),_r(l.current,mr(T)),_r(d.current,Rn(T))};if(v(hr(e,0)),En()||!i.current)return;let g=0,y=performance.now(),w=T=>{v(hr(e,(T-y)/1e3)),g=requestAnimationFrame(w)},I=()=>{g||(g=requestAnimationFrame(w))},U=()=>{cancelAnimationFrame(g),g=0},F=St(i.current,T=>T?I():U());return I(),()=>{U(),F()}},[e]),E(()=>{if(En())return;let v=[c.current?.animate([{transform:"rotate(-20deg) scaleX(1)"},{transform:"rotate(160deg) scaleX(0.55)"},{transform:"rotate(340deg) scaleX(1)"}],{duration:9e3,iterations:1/0,easing:"ease-in-out"}),p.current?.animate([{transform:"rotate(70deg) scaleX(0.7)"},{transform:"rotate(-120deg) scaleX(1.1)"},{transform:"rotate(-290deg) scaleX(0.7)"}],{duration:13e3,iterations:1/0,easing:"ease-in-out"})];return()=>v.forEach(g=>g?.cancel())},[]);let u=(v,g,y,w)=>o("div",{ref:v,"aria-hidden":"true",style:{position:"absolute",inset:"-2%",background:`radial-gradient(ellipse 32% 58% at ${w}, transparent 95%, rgba(255,255,255,${g}) 97.5%, rgba(72,80,196,${y}) 99%, transparent 100%)`,filter:`blur(${n(.006)})`}}),h=mr(_),m=Rn(_);return o("div",{ref:i,class:"ask-ai__orb",style:{position:"relative",width:e,height:e,flex:"0 0 auto"},children:[o("div",{"aria-hidden":"true",style:{position:"absolute",borderRadius:"50%",left:"4%",right:"4%",top:"34%",height:"100%",background:"radial-gradient(closest-side, rgba(122,108,236,0.5), rgba(122,108,236,0.18) 55%, rgba(122,108,236,0))",filter:`blur(${n(.1)})`}}),o(pr,{state:t,size:e,speed:Mn,colors:Tn,idleMotion:Cn,meshScale:.55,gloss:!1,label:r}),o("div",{ref:s,"aria-hidden":"true",style:{...a,overflow:"hidden",mixBlendMode:"soft-light",opacity:.8,maskImage:h,WebkitMaskImage:h},children:[u(c,.75,.3,"22% 50%"),u(p,.4,.18,"78% 44%")]}),o("div",{ref:l,"aria-hidden":"true",style:{...a,backdropFilter:`blur(${n(.006)})`,WebkitBackdropFilter:`blur(${n(.006)})`,background:"radial-gradient(circle at 50% 50%, rgba(244,245,255,0.1) 0%, rgba(244,245,255,0.18) 60%, rgba(244,245,255,0.3) 100%)",maskImage:h,WebkitMaskImage:h}}),o("div",{ref:d,"aria-hidden":"true",style:{...a,backdropFilter:`blur(${n(.07)}) saturate(1.1)`,WebkitBackdropFilter:`blur(${n(.07)}) saturate(1.1)`,background:"radial-gradient(circle at 38% 30%, rgba(248,248,255,0.62), rgba(238,239,252,0.5) 60%, rgba(236,237,252,0.58) 100%)",maskImage:m,WebkitMaskImage:m}}),o("div",{"aria-hidden":"true",style:{...a,pointerEvents:"none",background:["radial-gradient(circle at 33% 27%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.45) 9%, rgba(255,255,255,0) 26%)","radial-gradient(ellipse 60% 22% at 50% 94%, rgba(214,236,255,0.45), rgba(214,236,255,0) 100%)","radial-gradient(circle at 40% 34%, rgba(60,52,150,0) 52%, rgba(60,52,150,0.16) 80%, rgba(46,40,130,0.38) 100%)"].join(", ")}}),o("div",{"aria-hidden":"true",style:{...a,pointerEvents:"none",boxShadow:`inset 0 0 ${n(.025)} rgba(255,255,255,0.9), 0 0 0 1px rgba(200,200,240,0.35)`}})]})}function Un({size:e=18}){return o(pr,{state:"thinking",size:e,speed:Mn,colors:Tn,idleMotion:Cn,meshScale:.55,gloss:!1,label:"Thinking"})}function Ln({starters:e,mock:t,supportUrl:r,onPick:a}){return o("div",{class:"ask-ai__welcome",children:[o(On,{size:80}),o("h3",{class:"ask-ai__greeting",children:"What do you want to build today?"}),t&&o("p",{class:"ask-ai__welcome-note",children:["A preview, not connected to an assistant. For a real answer, use"," ",o("a",{href:r,target:"_blank",rel:"noopener noreferrer",children:"support"}),"."]}),o("div",{class:"ask-ai__pills",children:e.map((n,i)=>o("button",{type:"button",class:"ask-ai__pill",style:{animationDelay:`${400+i*60}ms`},title:n.prompt===n.label?void 0:n.prompt,onClick:()=>a(n.prompt),children:n.label},n.prompt))})]})}var Eo=[{label:"Create an ABHA",prompt:"How do I create an ABHA with an Aadhaar OTP?"},{label:"Link care contexts",prompt:"How do I link care contexts to an ABHA?"},{label:"Request consent",prompt:"How does an HIU raise a consent request?"},{label:"Decode an error",prompt:"What does ABDM-1016 mean and how do I fix it?"},{label:"Learn about Ask AI",prompt:"What can the Ask AI assistant do?"}];function Fn(e){let t=e.split(`
`).map(r=>r.trim()).filter(Boolean);return t.length?t.slice(0,5).map(r=>{let a=r.indexOf("|");if(a<0)return{label:r,prompt:r};let n=r.slice(0,a).trim(),i=r.slice(a+1).trim();return{label:n||i,prompt:i||n}}):Eo}function Et(e){let t=[];for(let r of e){if(r.from==="assistant"&&(r.install||r.local)){t.length&&t[t.length-1].from==="you"&&t.pop();continue}t.push(r)}return t}var Je=31;function Dn(e){let t=Math.floor(Et(e).length/2),r=(Je-1)/2,a=Math.min(100,Math.round(t/r*100));return{earlier:t,window:r,percent:a,full:t>=r}}function Nn(e){let t=Et(e);return t.length<=Je-1?-1:e.indexOf(t[t.length-(Je-1)])}var Bn=`/* ---------- theming ---------- */

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

/* Asked once when the conversation fills the window: go on, or start afresh. */
.ask-ai__window-offer {
  display: grid;
  gap: 0.5rem;
  padding: 0.625rem 0.75rem;
  border: 1px solid var(--aa-border-strong);
  border-radius: 0.75rem;
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--aa-heading);
}

.ask-ai__window-offer p {
  margin: 0;
}

.ask-ai__window-offer-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.ask-ai__window-offer-new,
.ask-ai__window-offer-stay {
  padding: 0.25rem 0.625rem;
  border-radius: 999px;
  font: inherit;
  font-size: 0.75rem;
  cursor: pointer;
}

.ask-ai__window-offer-new {
  border: 0;
  background: var(--aa-accent);
  color: var(--aa-accent-contrast);
}

.ask-ai__window-offer-stay {
  border: 1px solid var(--aa-border-strong);
  background: transparent;
  color: var(--aa-heading);
}

.ask-ai__window-offer-new:focus-visible,
.ask-ai__window-offer-stay:focus-visible {
  outline: 2px solid var(--aa-accent);
  outline-offset: 2px;
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

/* Next-question pills sit under the answer, before the sources line. */
.ask-ai__followups {
  margin-top: 10px;
}
`;var $n=()=>`${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`,To=".json,.txt,.log,.csv,.xml,.yaml,.yml,.md,.har,.pdf,.png,.jpg,.jpeg,.webp",br=2e4,Mo=256*1024,Co=8*1024*1024;async function Po(e){let t=await import(`${te}pdf.min.mjs`);t.GlobalWorkerOptions.workerSrc=`${te}pdf.worker.min.mjs`;let r=t.getDocument({data:await e.arrayBuffer()}),a=await r.promise,n=[];for(let i=1;i<=a.numPages;i+=1){let s=await(await a.getPage(i)).getTextContent();if(n.push(s.items.map(l=>l.str??"").join(" ").replace(/[ \t]+/g," ").trim()),n.join(`

`).length>br)break}return await a.cleanup?.(),await r.destroy(),n.join(`

`).trim()}async function Io(e,t){t("Loading the reader, once per browser."),await pt(`${te}tesseract.min.js`);let r=window.Tesseract;t("Reading the text out of that image.");let a=await r.createWorker("eng",1,{workerPath:`${te}worker.min.js`,corePath:te,langPath:`${te}lang`,cacheMethod:"none"});try{let{data:n}=await a.recognize(e);return(n.text??"").replace(/[ \t]+/g," ").trim()}finally{await a.terminate()}}var Hn=24e3,zn=`

[This page was cut here to fit. Say so if the answer needs the rest of it.]`;function Oo(e){return e.length<=Hn?e:e.slice(0,Hn-zn.length)+zn}var Uo="This panel is a mock. No assistant is connected here yet, so nothing in it can answer that. The support page lists the channels a human reads.";function Wn(e,t){e(r=>{let a=r[r.length-1];return[...r.slice(0,-1),{...a,text:a.text+t}]})}function Lo(e){if(e.some(t=>t.install))return-1;for(let t=e.length-1;t>0;t-=1){let r=e[t];if(r.from!=="assistant"||r.text==="")continue;let a=e[t-1];return a?.from==="you"&&ka(a.text)?t:-1}return-1}function Fo(e,t,r,a){e(n=>{let i=n[n.length-1];return[...n.slice(0,-1),{...i,sources:t,links:r??i.links,suggestions:a??i.suggestions}]})}var gr=320,Vn=960,vr="abdm-ask-ai-width",yr=!1;function Do({dialog:e}){let[t,r]=A(!1);return E(()=>{let n=Number(localStorage.getItem(vr));n>=gr&&e.current&&e.current.style.setProperty("--aa-panel-width",`${n}px`)},[]),o("div",{class:`ask-ai__grip${t?" ask-ai__grip--dragging":""}`,role:"separator","aria-orientation":"vertical","aria-label":"Resize the panel",tabIndex:0,onPointerDown:n=>{let i=e.current;if(!i)return;n.preventDefault(),yr=!0,r(!0),n.target.setPointerCapture(n.pointerId);let s=d=>{let c=window.innerWidth-d.clientX,p=Math.min(Math.max(c,gr),Math.min(Vn,window.innerWidth));i.style.setProperty("--aa-panel-width",`${Math.round(p)}px`)},l=()=>{setTimeout(()=>{yr=!1},0),r(!1),window.removeEventListener("pointermove",s),window.removeEventListener("pointerup",l),window.removeEventListener("pointercancel",l);let d=i.style.getPropertyValue("--aa-panel-width");d&&localStorage.setItem(vr,String(parseInt(d,10)))};window.addEventListener("pointermove",s),window.addEventListener("pointerup",l),window.addEventListener("pointercancel",l)},onKeyDown:n=>{let i=n.key==="ArrowLeft"?32:n.key==="ArrowRight"?-32:0;if(!i||!e.current)return;n.preventDefault();let s=e.current.getBoundingClientRect().width,l=Math.min(Math.max(s+i,gr),Vn);e.current.style.setProperty("--aa-panel-width",`${l}px`),localStorage.setItem(vr,String(l))},children:o("span",{class:"ask-ai__grip-bar","aria-hidden":"true"})})}function No({apiBase:e,docsOrigin:t,mcpUrl:r,pluginRepo:a,open:n,onClose:i,page:s,onDetach:l,onAttach:d,question:c,send:p,starters:_,keepHistory:u,gateway:h,supportUrl:m}){let[v,g]=A([]),y=s?fa(s.markdown).slice(0,4):[],w=y.length?y.map(f=>({label:f,prompt:f})):_,[I,U]=A(""),[F,T]=A(null),[V,M]=A(null),[re,L]=A(null),[$,se]=A("idle"),[Ke,le]=A(null),[D,R]=A(""),[z,J]=A(!1),[Qe,ce]=A([]),[_e,ue]=A("chat"),[de,Ze]=A(null),[Re,G]=A("closed"),[Z,ae]=A(null),j=S($n()),[Te,Rt]=A(Ia),Me=S(null),fe=S(null),ge=S(null),Ce=S(null),Ho=S(null),ve=S(null),ne=$!=="idle",Gn=s!==null&&s.markdown!=="",et=Dn(v),jn=Nn(v),K=S(""),be=S(!1),ye=S(!0),xr=S(0),wr=S(!1),Q=S(0),Pe=S(null),Ie=S(null),Oe=S(null),Sr=()=>{Q.current=requestAnimationFrame(Sr);let f=K.current.length;if(f===0){if(!ye.current)return;cancelAnimationFrame(Q.current),Q.current=0,be.current=!1,(Pe.current||Ie.current||Oe.current)&&(Fo(g,Pe.current??[],Ie.current??void 0,Oe.current??void 0),Pe.current=null,Ie.current=null,Oe.current=null),se("idle");return}let k=xa(f,performance.now()-xr.current,be.current,wr.current);k!==0&&(be.current||(be.current=!0,se("streaming")),Wn(g,K.current.slice(0,k)),K.current=K.current.slice(k))},Ue=f=>{K.current+=f},Xn=f=>{Pe.current=f},qn=f=>{Ie.current=f},Yn=f=>{Oe.current=f},Ar=()=>{Q.current&&cancelAnimationFrame(Q.current),Q.current=0,be.current=!1,K.current="",Pe.current=null,Ie.current=null,Oe.current=null,ye.current=!0};E(()=>{if(!(!n||!c)){if(!p){U(f=>f||c);return}Me.current!==c&&(Me.current=c,Fe(c))}},[n,c,p]),E(()=>{let f=fe.current;f&&(n&&!f.open&&(f.showModal(),Ce.current?.focus()),!n&&f.open&&f.close())},[n]),E(()=>{if(!n)return;let f=k=>{k.key==="Escape"&&(k.preventDefault(),k.stopPropagation(),Re!=="closed"?G("closed"):i())};return document.addEventListener("keydown",f,!0),()=>document.removeEventListener("keydown",f,!0)},[n,i,Re]);let tt=S(!0),Jn=()=>{let f=ge.current;f&&(tt.current=f.scrollHeight-f.scrollTop-f.clientHeight<40)};E(()=>{let f=ge.current;f&&tt.current&&(f.scrollTop=f.scrollHeight)},[v,$,Ke]),E(()=>{let f=Ce.current;if(!f)return;f.style.height="auto";let k=Math.min(f.scrollHeight,160);f.style.height=`${k}px`,f.style.overflowY=f.scrollHeight>k?"auto":"hidden"},[I]),E(()=>()=>{ve.current?.abort(),Q.current&&cancelAnimationFrame(Q.current)},[]);let Tt=f=>{u&&f.some(k=>k.from==="you")&&(ce(k=>{let b=Sa(k,{id:j.current,at:Date.now(),title:wa(f),turns:f.map(B=>B.file?{...B,file:{...B.file,text:""}}:B)});return qt(b),b}),Ma(j.current))};E(()=>{$==="idle"&&Tt(v)},[$,v]),E(()=>{if(!u)return;let f=Aa();ce(f);let k=Ua(f,Ta());k&&(j.current=k.id,g(b=>b.length?b:k.turns))},[u]);let Kn=f=>{Tt(v),ve.current?.abort(),Ar(),tt.current=!0,j.current=f.id,g(f.turns),ue("chat"),U(""),T(null),M(null),L(null),le(null),se("idle")},Er=()=>{Tt(v),j.current=$n(),Ca(),ue("chat"),G("closed"),ve.current?.abort(),Ar(),tt.current=!0,g([]),U(""),T(null),M(null),L(null),le(null),se("idle")},Qn=async f=>{if(!f)return;M(null);let k=f.name.toLowerCase(),b=f.type==="application/pdf"||k.endsWith(".pdf"),B=f.type.startsWith("image/"),Mt=b||B?Co:Mo;if(f.size>Mt){M("That file is too large. Attach the failing part of it.");return}let X;try{if(b){if(L("Reading the text in that PDF."),X=await Po(f),!X){L(null),M("That PDF has no text in it, only pictures of text. Attach a screenshot of the part you mean and it will be read.");return}}else B?X=await Io(f,L):X=await f.text()}catch{L(null),M("That file could not be read.");return}finally{L(null)}if(!b&&!B&&X.includes("\uFFFD")){M("That looks like a binary file. Text and JSON only.");return}if(X.length>br){M(`That file is ${X.length.toLocaleString()} characters. Attach at most ${br.toLocaleString()}.`);return}if(!X.trim()){M(B?"No text could be read out of that image.":"That file is empty.");return}T({name:f.name,text:X,kind:b?"pdf":B?"image":void 0}),Ce.current?.focus()},Zn=()=>{ve.current?.abort(),K.current&&Wn(g,K.current),K.current="",ye.current=!0},Le=(f,k)=>{R(""),J(!1),g(b=>[...b,...k?[{from:"you",text:k}]:[],{from:"assistant",text:ya(f,{docsOrigin:t,mcpUrl:r,pluginRepo:a}),install:f}])},Fe=async(f,k={})=>{if(!f||ne)return;let b=k.file!==void 0?k.file:F,B=k.base??v;if(U(""),T(null),M(null),G("closed"),ue("chat"),!b&&!de&&Fa(f)){g([...B,{from:"you",text:f},{from:"assistant",text:La,local:!0}]);return}let Mt=Et([...B,{from:"you",text:f,file:b??void 0}]);if(g(q=>[...k.base??q,{from:"you",text:f,file:b??void 0},{from:"assistant",text:""}]),K.current="",be.current=!1,ye.current=!1,xr.current=performance.now(),wr.current=window.matchMedia("(prefers-reduced-motion: reduce)").matches,se("thinking"),le("Thinking"),Q.current||(Q.current=requestAnimationFrame(Sr)),!e){Ue(Uo),ye.current=!0;return}let X=new AbortController;ve.current=X;try{let q=await fetch(`${e.replace(/\/$/,"")}/api/chat`,{method:"POST",signal:X.signal,headers:{"Content-Type":"application/json"},body:JSON.stringify({turns:Mt.slice(-Je).map(C=>({role:C.from==="you"?"user":"assistant",text:C.text,...C.file?{attachment:{name:C.file.name,text:C.file.text,...C.file.kind?{kind:C.file.kind}:{}}}:{}})),...Gn?{page:{title:s.title,url:s.url,markdown:Oo(s.markdown)}}:{},...de?{command:de}:{},...k.module?{module:k.module}:{},...h?{gateway:h}:{}})});if(!q.ok){let C=await q.json().catch(()=>null);Ue(pa(q.status,C));return}if(!q.body)throw new Error(`status ${q.status}`);await ha(q.body,{onText:Ue,onTool:C=>le(C),onSources:C=>Xn(C),onLinks:C=>qn(C),onSuggestions:C=>Yn(C),onError:Ue,onSkill:C=>g(Ct=>{let Rr=Ct[Ct.length-1],oi=C.status==="unresolved"?{...Rr,text:yt(C),skill:C,local:!0}:{...Rr,skill:C};return[...Ct.slice(0,-1),oi]})})}catch(q){q instanceof DOMException&&q.name==="AbortError"||Ue(_t)}finally{ve.current=null,ye.current=!0,le(null)}},ei=f=>{let k=v.length-2,b=v[k];!b||b.from!=="you"||Fe(b.text,{module:f,base:v.slice(0,k),file:b.file??null})},ti=async f=>{ae(f.title);let k=await fetch(Ba(t,f.path)).then(b=>b.ok?b.text():"").catch(()=>"");ae(null),d({title:f.title,url:Na(t,f.path),markdown:k}),Ce.current?.focus()},ri=f=>ce(k=>{let b=Ea(k,f);return qt(b),b}),ai=()=>{Ra(),ce([])},ni=$==="thinking",ii=Lo(v);return o("dialog",{class:"ask-ai",ref:fe,"aria-label":"Ask AI",onClose:i,onCancel:i,onClick:f=>{f.target===fe.current&&!yr&&i()},children:[o(Do,{dialog:fe}),o("div",{class:"ask-ai__head",children:[o("div",{class:"ask-ai__tabs",role:"group","aria-label":"Conversations",children:[o("button",{type:"button",class:"ask-ai__tab","aria-pressed":_e==="chat","aria-label":"New conversation",title:"Start a new conversation",onClick:Er,children:[o(ft,{}),"New"]}),o("button",{type:"button",class:"ask-ai__tab","aria-pressed":_e==="history",onClick:()=>{G("closed"),ue("history")},children:"History"})]}),!e&&o("span",{class:"ask-ai__badge",children:"Mock"}),o("span",{class:"ask-ai__grow"}),o("button",{type:"button",class:"ask-ai__close",onClick:i,"aria-label":"Close",children:o(We,{})})]}),_e==="history"?o(Wa,{sessions:Qe,currentId:j.current,onOpen:Kn,onForget:ri,onClearAll:ai}):o(N,{children:[o("div",{class:"ask-ai__thread",ref:ge,role:"log","aria-live":"polite","aria-busy":ne,onScroll:Jn,children:[v.length===0&&o(Ln,{starters:w,mock:!e,supportUrl:m,onPick:f=>{Fe(f)}}),v.map((f,k)=>o(N,{children:[k===jn&&o("p",{class:"ask-ai__cut",role:"separator",children:o("span",{children:"Earlier turns are no longer sent"})}),f.from==="assistant"&&f.text===""?null:o("div",{class:`ask-ai__turn ask-ai__turn--${f.from}${$==="streaming"&&k===v.length-1?" ask-ai__turn--streaming":""}`,children:[f.skill&&f.skill.status!=="unresolved"&&o("p",{class:`ask-ai__skill ask-ai__skill--${f.skill.status}`,children:f.skill.status==="used"&&f.skill.href?o("a",{href:Ge(f.skill.href,t)??f.skill.href,target:"_blank",rel:"noopener noreferrer",children:yt(f.skill)}):yt(f.skill)}),f.from==="assistant"?o(Wt,{text:f.text,docsOrigin:t,links:f.links}):f.text,f.file&&o("span",{class:"ask-ai__turn-file",children:[o(Ve,{}),f.file.name]}),f.from==="assistant"&&k>0&&f.text!==""&&!(ne&&k===v.length-1)&&o(mt,{text:f.text,label:"Copy answer",className:"ask-ai__turn-copy"}),f.from==="assistant"&&k===v.length-1&&!ne&&f.suggestions&&f.suggestions.length>0&&o("div",{class:"ask-ai__pills ask-ai__followups","aria-label":"Ask next",children:f.suggestions.map(b=>o("button",{type:"button",class:"ask-ai__pill",onClick:()=>{Fe(b.prompt)},children:b.title},b.id))}),f.sources&&f.sources.length>0&&o("details",{class:"ask-ai__sources",children:[o("summary",{class:"ask-ai__sources-toggle",children:[o(na,{}),"Used ",f.sources.length," ",f.sources.length===1?"source":"sources"]}),o("ul",{class:"ask-ai__source-list",children:f.sources.map(b=>o("li",{children:o("a",{href:Ge(b.url,t)??b.url,target:"_blank",rel:"noopener noreferrer",class:"ask-ai__source-link",children:[o(we,{}),o("span",{class:"ask-ai__source-title",children:[b.title,b.status!=="verified"?" (spec)":""]})]})},b.id))})]}),f.install&&k===v.length-1&&o("div",{class:"ask-ai__choices",children:[f.install.at==="tools"&&Vt.map(b=>o("button",{type:"button",class:"ask-ai__choice",onClick:()=>Le(ma(b.id)?{at:"agents",tool:b.id}:{at:"answer",tool:b.id,agent:"claude"},b.label),children:b.label},b.id)),f.install.at==="agents"&&!z&&Gt.map(b=>o("button",{type:"button",class:"ask-ai__choice",onClick:()=>{if(b.id==="other"){J(!0);return}Le({at:"answer",tool:f.install.tool,agent:b.id},b.label)},children:b.label},b.id)),f.install.at==="agents"&&z&&o("form",{class:"ask-ai__naming",onSubmit:b=>{b.preventDefault();let B=D.trim();B&&Le({at:"answer",tool:f.install.tool,agent:"other",named:B},B)},children:[o("input",{class:"ask-ai__naming-field",value:D,autoFocus:!0,placeholder:"Which agent?","aria-label":"The name of your agent",onInput:b=>R(b.target.value)}),o("button",{type:"submit",class:"ask-ai__choice",disabled:D.trim()==="",children:o(dt,{})})]})]}),f.install?.at==="answer"&&(()=>{let{link:b}=Xt(f.install,{docsOrigin:t,mcpUrl:r,pluginRepo:a});return b?o("a",{class:"ask-ai__install-cta",href:b.href,target:"_blank",rel:"noopener noreferrer",children:[o(ze,{}),b.label]}):null})(),f.skill?.status==="unresolved"&&k===v.length-1&&o("div",{class:"ask-ai__choices",children:(f.skill.candidates??[]).map(b=>o("button",{type:"button",class:"ask-ai__choice",onClick:()=>ei(b),children:bt(b)},b))}),f.skill?.status==="used"&&f.skill.section==="scaffold"&&!(ne&&k===v.length-1)&&o("button",{type:"button",class:"ask-ai__install-cta",onClick:()=>Le({at:"tools"},"Install AI tools"),children:[o(ze,{}),"Build it with your coding agent"]}),k===ii&&f.skill?.section!=="scaffold"&&!(ne&&k===v.length-1)&&o("button",{type:"button",class:"ask-ai__install-cta",onClick:()=>Le({at:"tools"},"Install AI tools"),children:[o(ze,{}),"Install AI tools"]})]})]},k)),ni&&o("p",{class:"ask-ai__activity",children:[o(Un,{}),Ke??"Thinking"]}),et.full&&!ne&&Te!==j.current&&o("div",{class:"ask-ai__window-offer",role:"status",children:[o("p",{children:`${et.window} of ${et.window} conversation exchanges completed.`}),o("div",{class:"ask-ai__window-offer-actions",children:[o("button",{type:"button",class:"ask-ai__window-offer-new",onClick:Er,children:"Start a new chat"}),o("button",{type:"button",class:"ask-ai__window-offer-stay",onClick:()=>{Rt(j.current),Oa(j.current)},children:"Continue here"})]})]})]}),o(za,{draft:I,onDraft:U,field:Ce,busy:ne,onSend:()=>{Fe(I.trim())},onStop:Zn,menu:Re,onMenu:G,accept:To,onFile:f=>{Qn(f)},file:F,fileNote:re,fileError:V,onRemoveFile:()=>T(null),docsOrigin:t,page:s,attaching:Z,onPage:f=>{ti(f)},onRemovePage:l,command:de,onCommand:Ze,memory:et})]})]})}function Bo({host:e,apiBase:t,docsOrigin:r,mcpUrl:a,pluginRepo:n,supportUrl:i,launcher:s,shortcut:l,open:d,page:c,onDetach:p,onAttach:_,question:u,send:h,starters:m,keepHistory:v,gateway:g}){return o(N,{children:[s&&o("button",{type:"button",class:"ask-ai__launcher","aria-label":"Ask AI",onClick:()=>{e.removeAttribute("open"),e.setAttribute("open","")},children:[o(ze,{}),o("span",{class:"ask-ai__launcher-label",children:"Ask AI"}),l&&o("kbd",{class:"ask-ai__launcher-key",children:l})]}),o(No,{apiBase:t,docsOrigin:r,mcpUrl:a,pluginRepo:n,supportUrl:i,open:d,question:u,send:h,starters:m,keepHistory:v,gateway:g,onClose:()=>{e.removeAttribute("open"),e.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))},page:c,onDetach:p,onAttach:_})]})}function $o(){for(let e=document.body;e;e=e.parentElement){let t=/^rgba?\(([^)]+)\)/.exec(getComputedStyle(e).backgroundColor);if(!t)continue;let[r,a,n,i=1]=t[1].split(",").map(Number);if(i)return .2126*r+.7152*a+.0722*n<128?"dark":"light"}return window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}var kr=class extends HTMLElement{static observedAttributes=["api-base","docs-origin","mcp-url","plugin-repo","support-url","launcher","shortcut","open","question","send","starters","history","ground","gateway"];root=null;page=null;connectedCallback(){if(!this.root){this.root=this.attachShadow({mode:"open"});let t=document.createElement("style");t.textContent=Bn,this.root.append(t),this.hasAttribute("ground")||this.setAttribute("ground",$o())}this.paint()}attributeChangedCallback(){this.root&&this.paint()}show(){this.setAttribute("open","")}hide(){this.removeAttribute("open")}attachPage(t){this.page=t&&$a(t.markdown)?{...t,markdown:""}:t,this.root&&this.paint()}paint(){let t=this.getAttribute("docs-origin")??window.location.origin;Nt(o(Bo,{host:this,apiBase:this.getAttribute("api-base")??"",docsOrigin:t,mcpUrl:this.getAttribute("mcp-url"),pluginRepo:this.getAttribute("plugin-repo")??"nha-in/docs",supportUrl:this.getAttribute("support-url")??`${t.replace(/\/$/,"")}/docs/support`,launcher:this.getAttribute("launcher")!=="none",shortcut:this.getAttribute("shortcut")??"",open:this.hasAttribute("open"),page:this.page,onDetach:()=>this.attachPage(null),onAttach:r=>this.attachPage(r),question:this.getAttribute("question")??"",send:this.hasAttribute("send"),starters:Fn(this.getAttribute("starters")??""),keepHistory:this.getAttribute("history")!=="off",gateway:this.getAttribute("gateway")??""}),this.root)}};typeof customElements<"u"&&!customElements.get("abdm-support-agent")&&customElements.define("abdm-support-agent",kr);})();
