(()=>{var ge,b,_t,ha,V,ct,pt,ft,Ie,de,te,gt,Ne,Me,Le,_a,_e={},pe=[],pa=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i,me=Array.isArray;function W(e,t){for(var a in t)e[a]=t[a];return e}function $e(e){e&&e.parentNode&&e.parentNode.removeChild(e)}function fa(e,t,a){var n,r,i,l={};for(i in t)i=="key"?n=t[i]:i=="ref"?r=t[i]:l[i]=t[i];if(arguments.length>2&&(l.children=arguments.length>3?ge.call(arguments,2):a),typeof e=="function"&&e.defaultProps!=null)for(i in e.defaultProps)l[i]===void 0&&(l[i]=e.defaultProps[i]);return ue(e,l,n,r,null)}function ue(e,t,a,n,r){var i={type:e,props:t,key:a,ref:n,__k:null,__:null,__b:0,__e:null,__c:null,constructor:void 0,__v:r??++_t,__i:-1,__u:0};return r==null&&b.vnode!=null&&b.vnode(i),i}function $(e){return e.children}function he(e,t){this.props=e,this.context=t}function J(e,t){if(t==null)return e.__?J(e.__,e.__i+1):null;for(var a;t<e.__k.length;t++)if((a=e.__k[t])!=null&&a.__e!=null)return a.__e;return typeof e.type=="function"?J(e):null}function ga(e){if(e.__P&&e.__d){var t=e.__v,a=t.__e,n=[],r=[],i=W({},t);i.__v=t.__v+1,b.vnode&&b.vnode(i),He(e.__P,i,t,e.__n,e.__P.namespaceURI,32&t.__u?[a]:null,n,a??J(t),!!(32&t.__u),r),i.__v=t.__v,i.__.__k[i.__i]=i,yt(n,i,r),t.__e=t.__=null,i.__e!=a&&mt(i)}}function mt(e){if((e=e.__)!=null&&e.__c!=null)return e.__e=e.__c.base=null,e.__k.some(function(t){if(t!=null&&t.__e!=null)return e.__e=e.__c.base=t.__e}),mt(e)}function dt(e){(!e.__d&&(e.__d=!0)&&V.push(e)&&!fe.__r++||ct!=b.debounceRendering)&&((ct=b.debounceRendering)||pt)(fe)}function fe(){try{for(var e,t=1;V.length;)V.length>t&&V.sort(ft),e=V.shift(),t=V.length,ga(e)}finally{V.length=fe.__r=0}}function bt(e,t,a,n,r,i,l,c,h,d,p){var v,o,_,k,I,y,w=n&&n.__k||pe,f=t.length;for(h=ma(a,t,w,h,f),v=0;v<f;v++)(_=a.__k[v])!=null&&(o=_.__i!=-1&&w[_.__i]||_e,_.__i=v,y=He(e,_,o,r,i,l,c,h,d,p),k=_.__e,_.ref&&o.ref!=_.ref&&(o.ref&&De(o.ref,null,_),p.push(_.ref,_.__c||k,_)),I==null&&k!=null&&(I=k),4&_.__u?(h=vt(_,h,e),o.__e&&(o.__e=null)):typeof _.type=="function"&&y!==void 0?h=y:k&&(h=k.nextSibling),_.__u&=-7);return a.__e=I,h}function ma(e,t,a,n,r){var i,l,c,h,d,p=a.length,v=p,o=0;for(e.__k=new Array(r),i=0;i<r;i++)(l=t[i])!=null&&typeof l!="boolean"&&typeof l!="function"?(typeof l=="string"||typeof l=="number"||typeof l=="bigint"||l.constructor==String?l=e.__k[i]=ue(null,l,null,null,null):me(l)?l=e.__k[i]=ue($,{children:l},null,null,null):l.constructor===void 0&&l.__b>0?l=e.__k[i]=ue(l.type,l.props,l.key,l.ref?l.ref:null,l.__v):e.__k[i]=l,h=i+o,l.__=e,l.__b=e.__b+1,c=null,(d=l.__i=ba(l,a,h,v))!=-1&&(v--,(c=a[d])&&(c.__u|=2)),c==null||c.__v==null?(d==-1&&(r>p?o--:r<p&&o++),typeof l.type!="function"&&(l.__u|=4)):d!=h&&(d==h-1?o--:d==h+1?o++:(d>h?o--:o++,l.__u|=4))):e.__k[i]=null;if(v)for(i=0;i<p;i++)(c=a[i])!=null&&(2&c.__u)==0&&(c.__e==n&&(n=J(c)),xt(c,c));return n}function vt(e,t,a){var n,r;if(typeof e.type=="function"){for(n=e.__k,r=0;n&&r<n.length;r++)n[r]&&(n[r].__=e,t=vt(n[r],t,a));return t}e.__e!=t&&(t&&e.type&&!t.parentNode&&(t=J(e)),t=a.insertBefore(e.__e,t||null));do t=t&&t.nextSibling;while(t!=null&&t.nodeType==8);return t}function ba(e,t,a,n){var r,i,l,c=e.key,h=e.type,d=t[a],p=d!=null&&(2&d.__u)==0;if(d===null&&c==null||p&&c==d.key&&h==d.type)return a;if(n>(p?1:0)){for(r=a-1,i=a+1;r>=0||i<t.length;)if((d=t[l=r>=0?r--:i++])!=null&&(2&d.__u)==0&&c==d.key&&h==d.type)return l}return-1}function ut(e,t,a){t[0]=="-"?e.setProperty(t,a??""):e[t]=a==null?"":typeof a!="number"||pa.test(t)?a:a+"px"}function ce(e,t,a,n,r){var i,l;e:if(t=="style")if(typeof a=="string")e.style.cssText=a;else{if(typeof n=="string"&&(e.style.cssText=n=""),n)for(t in n)a&&t in a||ut(e.style,t,"");if(a)for(t in a)n&&a[t]==n[t]||ut(e.style,t,a[t])}else if(t[0]=="o"&&t[1]=="n")i=t!=(t=t.replace(gt,"$1")),l=t.toLowerCase(),t=l in e||t=="onFocusOut"||t=="onFocusIn"?l.slice(2):t.slice(2),e.l||(e.l={}),e.l[t+i]=a,a?n?a[te]=n[te]:(a[te]=Ne,e.addEventListener(t,i?Le:Me,i)):e.removeEventListener(t,i?Le:Me,i);else{if(r=="http://www.w3.org/2000/svg")t=t.replace(/xlink(H|:h)/,"h").replace(/sName$/,"s");else if(t!="width"&&t!="height"&&t!="href"&&t!="list"&&t!="form"&&t!="tabIndex"&&t!="download"&&t!="rowSpan"&&t!="colSpan"&&t!="role"&&t!="popover"&&t in e)try{e[t]=a??"";break e}catch{}typeof a=="function"||(a==null||a===!1&&t[4]!="-"?e.removeAttribute(t):e.setAttribute(t,t=="popover"&&a==1?"":a))}}function ht(e){return function(t){if(this.l){var a=this.l[t.type+e];if(t[de]==null)t[de]=Ne++;else if(t[de]<a[te])return;return a(b.event?b.event(t):t)}}}function He(e,t,a,n,r,i,l,c,h,d){var p,v,o,_,k,I,y,w,f,C,B,S,R,U,F,q,M=t.type;if(t.constructor!==void 0)return null;128&a.__u&&(h=!!(32&a.__u),i=[c=t.__e=a.__e]),(p=b.__b)&&p(t);e:if(typeof M=="function"){v=l.length;try{if(f=t.props,C=M.prototype&&M.prototype.render,B=(p=M.contextType)&&n[p.__c],S=p?B?B.props.value:p.__:n,a.__c?w=(o=t.__c=a.__c).__=o.__E:(C?t.__c=o=new M(f,S):(t.__c=o=new he(f,S),o.constructor=M,o.render=ka),B&&B.sub(o),o.state||(o.state={}),o.__n=n,_=o.__d=!0,o.__h=[],o._sb=[]),C&&o.__s==null&&(o.__s=o.state),C&&M.getDerivedStateFromProps!=null&&(o.__s==o.state&&(o.__s=W({},o.__s)),W(o.__s,M.getDerivedStateFromProps(f,o.__s))),k=o.props,I=o.state,o.__v=t,_)C&&M.getDerivedStateFromProps==null&&o.componentWillMount!=null&&o.componentWillMount(),C&&o.componentDidMount!=null&&o.__h.push(o.componentDidMount);else{if(C&&M.getDerivedStateFromProps==null&&f!==k&&o.componentWillReceiveProps!=null&&o.componentWillReceiveProps(f,S),t.__v==a.__v||!o.__e&&o.shouldComponentUpdate!=null&&o.shouldComponentUpdate(f,o.__s,S)===!1){t.__v!=a.__v&&(o.props=f,o.state=o.__s,o.__d=!1),t.__e=a.__e,t.__k=a.__k,t.__k.some(function(D){D&&(D.__=t)}),pe.push.apply(o.__h,o._sb),o._sb=[],o.__h.length&&l.push(o),c=J(a);break e}o.componentWillUpdate!=null&&o.componentWillUpdate(f,o.__s,S),C&&o.componentDidUpdate!=null&&o.__h.push(function(){o.componentDidUpdate(k,I,y)})}if(o.context=S,o.props=f,o.__P=e,o.__e=!1,R=b.__r,U=0,C)o.state=o.__s,o.__d=!1,R&&R(t),p=o.render(o.props,o.state,o.context),pe.push.apply(o.__h,o._sb),o._sb=[];else do o.__d=!1,R&&R(t),p=o.render(o.props,o.state,o.context),o.state=o.__s;while(o.__d&&++U<25);o.state=o.__s,o.getChildContext!=null&&(n=W(W({},n),o.getChildContext())),C&&!_&&o.getSnapshotBeforeUpdate!=null&&(y=o.getSnapshotBeforeUpdate(k,I)),F=p!=null&&p.type===$&&p.key==null?wt(p.props.children):p,c=bt(e,me(F)?F:[F],t,a,n,r,i,l,c,h,d),o.base=t.__e,t.__u&=-161,o.__h.length&&l.push(o),w&&(o.__E=o.__=null)}catch(D){if(l.length=v,t.__v=null,h||i!=null){if(D.then){for(t.__u|=h?160:128;c&&c.nodeType==8&&c.nextSibling;)c=c.nextSibling;i!=null&&(i[i.indexOf(c)]=null),t.__e=c}else if(i!=null)for(q=i.length;q--;)$e(i[q])}else t.__e=a.__e;t.__k==null&&(t.__k=a.__k||[]),D.then||kt(t),b.__e(D,t,a)}}else i==null&&t.__v==a.__v?(t.__k=a.__k,t.__e=a.__e):c=t.__e=va(a.__e,t,a,n,r,i,l,h,d);return(p=b.diffed)&&p(t),128&t.__u?void 0:c}function kt(e){e&&(e.__c&&(e.__c.__e=!0),e.__k&&e.__k.some(kt))}function yt(e,t,a){for(var n=0;n<a.length;n++)De(a[n],a[++n],a[++n]);b.__c&&b.__c(t,e),e.some(function(r){try{e=r.__h,r.__h=[],e.some(function(i){i.call(r)})}catch(i){b.__e(i,r.__v)}})}function wt(e){return typeof e!="object"||e==null||e.__b>0?e:me(e)?e.map(wt):e.constructor!==void 0?null:W({},e)}function va(e,t,a,n,r,i,l,c,h){var d,p,v,o,_,k,I,y=a.props||_e,w=t.props,f=t.type;if(f=="svg"?r="http://www.w3.org/2000/svg":f=="math"?r="http://www.w3.org/1998/Math/MathML":r||(r="http://www.w3.org/1999/xhtml"),i!=null){for(d=0;d<i.length;d++)if((_=i[d])&&"setAttribute"in _==!!f&&(f?_.localName==f:_.nodeType==3)){e=_,i[d]=null;break}}if(e==null){if(f==null)return document.createTextNode(w);e=document.createElementNS(r,f,w.is&&w),c&&(b.__m&&b.__m(t,i),c=!1),i=null}if(f==null)y===w||c&&e.data==w||(e.data=w);else{if(i=f=="textarea"&&w.defaultValue!=null?null:i&&ge.call(e.childNodes),!c&&i!=null)for(y={},d=0;d<e.attributes.length;d++)y[(_=e.attributes[d]).name]=_.value;for(d in y)_=y[d],d=="dangerouslySetInnerHTML"?v=_:d=="children"||d in w||d=="value"&&"defaultValue"in w||d=="checked"&&"defaultChecked"in w||ce(e,d,null,_,r);for(d in w)_=w[d],d=="children"?o=_:d=="dangerouslySetInnerHTML"?p=_:d=="value"?k=_:d=="checked"?I=_:c&&typeof _!="function"||y[d]===_||ce(e,d,_,y[d],r);if(p)c||v&&(p.__html==v.__html||p.__html==e.innerHTML)||(e.innerHTML=p.__html),t.__k=[];else if(v&&(e.innerHTML=""),bt(t.type=="template"?e.content:e,me(o)?o:[o],t,a,n,f=="foreignObject"?"http://www.w3.org/1999/xhtml":r,i,l,i?i[0]:a.__k&&J(a,0),c,h),i!=null)for(d=i.length;d--;)$e(i[d]);c&&f!="textarea"||(d="value",f=="progress"&&k==null?e.removeAttribute("value"):k!=null&&(k!==e[d]||f=="progress"&&!k||f=="option"&&k!=y[d])&&ce(e,d,k,y[d],r),d="checked",I!=null&&I!=e[d]&&ce(e,d,I,y[d],r))}return e}function De(e,t,a){try{if(typeof e=="function"){var n=typeof e.__u=="function";n&&e.__u(),n&&t==null||(e.__u=e(t))}else e.current=t}catch(r){b.__e(r,a)}}function xt(e,t,a){var n,r;if(b.unmount&&b.unmount(e),(n=e.ref)&&(n.current&&n.current!=e.__e||De(n,null,t)),(n=e.__c)!=null){if(n.componentWillUnmount)try{n.componentWillUnmount()}catch(i){b.__e(i,t)}n.base=n.__P=n.__n=null}if(n=e.__k)for(r=0;r<n.length;r++)n[r]&&xt(n[r],t,a||typeof e.type!="function");a||$e(e.__e),e.__c=e.__=e.__e=void 0}function ka(e,t,a){return this.constructor(e,a)}function At(e,t,a){var n,r,i,l;t==document&&(t=document.documentElement),b.__&&b.__(e,t),r=(n=typeof a=="function")?null:a&&a.__k||t.__k,i=[],l=[],He(t,e=(!n&&a||t).__k=fa($,null,[e]),r||_e,_e,t.namespaceURI,!n&&a?[a]:r?null:t.firstChild?ge.call(t.childNodes):null,i,!n&&a?a:r?r.__e:t.firstChild,n,l),yt(i,e,l),e.props.children=null}ge=pe.slice,b={__e:function(e,t,a,n){for(var r,i,l;t=t.__;)if((r=t.__c)&&!r.__)try{if((i=r.constructor)&&i.getDerivedStateFromError!=null&&(r.setState(i.getDerivedStateFromError(e)),l=r.__d),r.componentDidCatch!=null&&(r.componentDidCatch(e,n||{}),l=r.__d),l)return r.__E=r}catch(c){e=c}throw e}},_t=0,ha=function(e){return e!=null&&e.constructor===void 0},he.prototype.setState=function(e,t){var a;a=this.__s!=null&&this.__s!=this.state?this.__s:this.__s=W({},this.state),typeof e=="function"&&(e=e(W({},a),this.props)),e&&W(a,e),e!=null&&this.__v&&(t&&this._sb.push(t),dt(this))},he.prototype.forceUpdate=function(e){this.__v&&(this.__e=!0,e&&this.__h.push(e),dt(this))},he.prototype.render=$,V=[],pt=typeof Promise=="function"?Promise.prototype.then.bind(Promise.resolve()):setTimeout,ft=function(e,t){return e.__v.__b-t.__v.__b},fe.__r=0,Ie=Math.random().toString(8),de="__d"+Ie,te="__a"+Ie,gt=/(PointerCapture)$|Capture$/i,Ne=0,Me=ht(!1),Le=ht(!0),_a=0;var ae,A,Re,Tt,ve=0,Nt=[],T=b,St=T.__b,Ct=T.__r,Et=T.diffed,Pt=T.__c,It=T.unmount,Mt=T.__;function je(e,t){T.__h&&T.__h(A,e,ve||t),ve=0;var a=A.__H||(A.__H={__:[],__h:[]});return e>=a.__.length&&a.__.push({}),a.__[e]}function E(e){return ve=1,ya(Ht,e)}function ya(e,t,a){var n=je(ae++,2);if(n.t=e,!n.__c&&(n.__=[a?a(t):Ht(void 0,t),function(c){var h=n.__N?n.__N[0]:n.__[0],d=n.t(h,c);h!==d&&(n.__N=[d,n.__[1]],n.__c.setState({}))}],n.__c=A,!A.__f)){var r=function(c,h,d){if(!n.__c.__H)return!0;var p=!1,v=n.__c.props!==c;if(n.__c.__H.__.some(function(_){if(_.__N){p=!0;var k=_.__[0];_.__=_.__N,_.__N=void 0,k!==_.__[0]&&(v=!0)}}),i){var o=i.call(this,c,h,d);return p?o||v:o}return!p||v};A.__f=!0;var i=A.shouldComponentUpdate,l=A.componentWillUpdate;A.componentWillUpdate=function(c,h,d){if(this.__e){var p=i;i=void 0,r(c,h,d),i=p}l&&l.call(this,c,h,d)},A.shouldComponentUpdate=r}return n.__N||n.__}function H(e,t){var a=je(ae++,3);!T.__s&&$t(a.__H,t)&&(a.__=e,a.u=t,A.__H.__h.push(a))}function P(e){return ve=5,wa(function(){return{current:e}},[])}function wa(e,t){var a=je(ae++,7);return $t(a.__H,t)&&(a.__=e(),a.__H=t,a.__h=e),a.__}function xa(){for(var e;e=Nt.shift();){var t=e.__H;if(e.__P&&t)try{t.__h.some(be),t.__h.some(Oe),t.__h=[]}catch(a){t.__h=[],T.__e(a,e.__v)}}}T.__b=function(e){A=null,St&&St(e)},T.__=function(e,t){e&&t.__k&&t.__k.__m&&(e.__m=t.__k.__m),Mt&&Mt(e,t)},T.__r=function(e){Ct&&Ct(e),ae=0;var t=(A=e.__c).__H;t&&(Re===A?(t.__h=[],A.__h=[],t.__.some(function(a){a.__N&&(a.__=a.__N),a.u=a.__N=void 0})):(t.__h.some(be),t.__h.some(Oe),t.__h=[],ae=0)),Re=A},T.diffed=function(e){Et&&Et(e);var t=e.__c;t&&t.__H&&(t.__H.__h.length&&(Nt.push(t)!==1&&Tt===T.requestAnimationFrame||((Tt=T.requestAnimationFrame)||Aa)(xa)),t.__H.__.some(function(a){a.u&&(a.__H=a.u,a.u=void 0)})),Re=A=null},T.__c=function(e,t){t.some(function(a){try{a.__h.some(be),a.__h=a.__h.filter(function(n){return!n.__||Oe(n)})}catch(n){t.some(function(r){r.__h&&(r.__h=[])}),t=[],T.__e(n,a.__v)}}),Pt&&Pt(e,t)},T.unmount=function(e){It&&It(e);var t,a=e.__c;a&&a.__H&&(a.__H.__.some(function(n){try{be(n)}catch(r){t=r}}),a.__H=void 0,t&&T.__e(t,a.__v))};var Lt=typeof requestAnimationFrame=="function";function Aa(e){var t,a=function(){clearTimeout(n),Lt&&cancelAnimationFrame(t),setTimeout(e)},n=setTimeout(a,35);Lt&&(t=requestAnimationFrame(a))}function be(e){var t=A,a=e.__c;typeof a=="function"&&(e.__c=void 0,a()),A=t}function Oe(e){var t=A;e.__c=e.__(),A=t}function $t(e,t){return!e||e.length!==t.length||t.some(function(a,n){return a!==e[n]})}function Ht(e,t){return typeof t=="function"?t(e):t}var Ta=0;function s(e,t,a,n,r,i){t||(t={});var l,c,h=t;if("ref"in h)for(c in h={},t)c=="ref"?l=t[c]:h[c]=t[c];var d={type:e,props:h,key:a,ref:l,__k:null,__:null,__b:0,__e:null,__c:null,constructor:void 0,__v:--Ta,__i:-1,__u:0,__source:r,__self:i};if(typeof e=="function"&&(l=e.defaultProps))for(c in l)h[c]===void 0&&(h[c]=l[c]);return b.vnode&&b.vnode(d),d}var G={xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round","aria-hidden":"true"},Ue=()=>s("svg",{...G,width:"16",height:"16",children:[s("path",{d:"m5 12 7-7 7 7"}),s("path",{d:"M12 19V5"})]}),Dt=()=>s("svg",{...G,width:"14",height:"14",children:[s("path",{d:"M13 21h8"}),s("path",{d:"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"})]}),ke=()=>s("svg",{...G,width:"14",height:"14",children:[s("path",{d:"M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"}),s("path",{d:"M20 2v4"}),s("path",{d:"M22 4h-4"}),s("circle",{cx:"4",cy:"20",r:"2"})]}),Rt=()=>s("svg",{...G,width:"12",height:"12",children:s("rect",{width:"18",height:"18",x:"3",y:"3",rx:"2"})}),Ot=()=>s("svg",{...G,width:"14",height:"14",children:s("path",{d:"M20 6 9 17l-5-5"})}),jt=()=>s("svg",{...G,width:"14",height:"14",children:[s("rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2"}),s("path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"})]}),ye=()=>s("svg",{...G,width:"16",height:"16",children:[s("path",{d:"M18 6 6 18"}),s("path",{d:"m6 6 12 12"})]}),we=()=>s("svg",{...G,width:"16",height:"16",children:[s("path",{d:"M13.234 20.252 21 12.3"}),s("path",{d:"m16 6-8.414 8.586a2 2 0 0 0 0 2.828 2 2 0 0 0 2.828 0l8.414-8.586a4 4 0 0 0 0-5.656 4 4 0 0 0-5.656 0l-8.415 8.585a6 6 0 1 0 8.486 8.486"})]});var z=(()=>{if(typeof document>"u")return"/agent/vendor/";let e=document.currentScript?.src;try{return new URL("vendor/",e??"/agent/").href}catch{return"/agent/vendor/"}})(),Ut=new Map;function xe(e){let t=Ut.get(e);if(t)return t;let a=new Promise((n,r)=>{let i=document.createElement("script");i.src=e,i.onload=()=>n(),i.onerror=()=>r(new Error(`could not load ${e}`)),document.head.append(i)});return Ut.set(e,a),a}var Sa=/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)\s]+\))/g;function Fe(e,t){return e.startsWith("/")?`${t.replace(/\/$/,"")}${e}`:e.startsWith("https://")||e.startsWith("http://")?e:null}function Ae(e,t){return e.split(Sa).map((n,r)=>{if(n.startsWith("`")&&n.endsWith("`")&&n.length>2)return s("code",{children:n.slice(1,-1)},r);if(n.startsWith("**")&&n.endsWith("**")&&n.length>4)return s("b",{children:Ae(n.slice(2,-2),t)},r);if(n.startsWith("*")&&n.endsWith("*")&&n.length>2)return s("em",{children:Ae(n.slice(1,-1),t)},r);let i=/^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(n);if(i){let[,l,c]=i,h=Fe(c,t);return h?s("a",{href:h,target:"_blank",rel:"noopener noreferrer",children:l},r):n}return n})}function Te({text:e,label:t,className:a}){let[n,r]=E(!1);return H(()=>{if(!n)return;let i=window.setTimeout(()=>r(!1),1600);return()=>window.clearTimeout(i)},[n]),typeof navigator>"u"||!navigator.clipboard?null:s("button",{type:"button",class:a,"aria-label":n?"Copied":t,onClick:()=>{navigator.clipboard.writeText(e).then(()=>r(!0),()=>{})},children:n?s(Ot,{}):s(jt,{})})}var Ft=null;function Ca(){return Ft??=xe(`${z}mermaid.min.js`).then(()=>{let e=globalThis.mermaid;if(!e)throw new Error("mermaid loaded but registered nothing");return e.initialize({startOnLoad:!1,securityLevel:"strict",theme:Ea()?"dark":"default",fontFamily:"inherit"}),e}),Ft}function Ea(){let e=document.documentElement.dataset.theme;return e==="dark"?!0:e==="light"?!1:globalThis.matchMedia?.("(prefers-color-scheme: dark)").matches??!1}var Wt=0;function Pa({text:e}){let[t,a]=E(""),[n,r]=E(!1);return H(()=>{let i=!0;r(!1),a(""),Wt+=1;let l=`ask-ai-diagram-${Wt}`;return Ca().then(c=>c.render(l,e)).then(c=>{i&&a(c.svg)}).catch(()=>{i&&r(!0),document.getElementById(l)?.remove(),document.getElementById(`d${l}`)?.remove()}),()=>{i=!1}},[e]),n?s("div",{class:"ask-ai__code",children:[s("pre",{children:s("code",{children:e})}),s(Te,{text:e,label:"Copy diagram source",className:"ask-ai__code-copy"})]}):s("div",{class:"ask-ai__diagram",dangerouslySetInnerHTML:{__html:t}})}var Ia=/^\s*[-*]\s+(.*)$/,Ma=/^\s*\d+[.)]\s+(.*)$/;function La(e){let t=[],a=null,n=[],r=null,i="",l=()=>{n.length>0&&(t.push({kind:"p",text:n.join(" ")}),n=[])},c=()=>{a&&(t.push(a),a=null)};for(let h of e.split(`
`)){if(h.trimStart().startsWith("```")){r?(t.push({kind:"code",text:r.join(`
`),lang:i,closed:!0}),r=null,i=""):(l(),c(),i=h.trim().slice(3).trim().toLowerCase(),r=[]);continue}if(r){r.push(h);continue}let d=Ia.exec(h),p=d?null:Ma.exec(h);if(d||p){l();let v=d?"ul":"ol";(!a||a.kind!==v)&&(c(),a={kind:v,items:[]}),a.items.push((d??p)[1]);continue}if(h.trim()===""){l(),c();continue}if(a&&/^\s{2,}/.test(h)){a.items[a.items.length-1]+=` ${h.trim()}`;continue}c(),n.push(h.replace(/^#{1,4}\s+/,"").trim())}return r&&t.push({kind:"code",text:r.join(`
`),lang:i,closed:!1}),l(),c(),t}function We({text:e,docsOrigin:t}){return s($,{children:La(e).map((a,n)=>{if(a.kind==="p")return s("p",{children:Ae(a.text,t)},n);if(a.kind==="code")return a.lang==="mermaid"&&a.closed?s(Pa,{text:a.text},n):s("div",{class:"ask-ai__code",children:[s("pre",{children:s("code",{children:a.text})}),s(Te,{text:a.text,label:"Copy code",className:"ask-ai__code-copy"})]},n);let r=a.kind;return s(r,{children:a.items.map((i,l)=>s("li",{children:Ae(i,t)},l))},n)})})}function zt(e){let t=[],a=!1;for(let n of e.split(`
`))/^\s*```/.test(n)?a=!a:!a&&/^##\s+/.test(n)&&t.push(n.slice(2).replace(/[*`_]/g,"").trim());return t.filter(Boolean)}var ze="The assistant is unreachable right now. Try again shortly.";async function Bt(e,t){let a=e.getReader(),n=new TextDecoder,r="",i=l=>{let c="message",h=[];for(let p of l.split(`
`))p.startsWith("event:")?c=p.slice(6).trim():p.startsWith("data:")&&h.push(p.slice(5).trim());if(h.length===0)return;let d;try{d=JSON.parse(h.join(`
`))}catch{return}switch(c){case"text":t.onText(d.delta??"");break;case"tool":{let p=d;t.onTool(p.detail||p.name);break}case"sources":t.onSources(d);break;case"error":t.onError(d.message||ze);break;default:break}};for(;;){let{done:l,value:c}=await a.read();if(l)break;r+=n.decode(c,{stream:!0});let h;for(;(h=r.indexOf(`

`))!==-1;){let d=r.slice(0,h);r=r.slice(h+2),i(d)}}}var Se="abdm-docs",Be=[{id:"skills",label:"Skills"},{id:"mcp",label:"MCP server"},{id:"plugin",label:"Plugin"}],qe=[{id:"claude",label:"Claude"},{id:"codex",label:"Codex"},{id:"cursor",label:"Cursor"},{id:"other",label:"Other"}],Na=["Three ways to give your agent this catalogue. Take any of them, or all three.","","- **Skills**: the milestones written as files an agent reads before it writes code. One set up line, any agent.","- **MCP server**: your agent queries these pages as it works, so it retrieves the paragraph it needs instead of loading the site.","- **Plugin**: every skill at once, as one package. Claude Code and Codex install it straight from the repository; the other Agent Plugins clients list it through their own marketplaces.","","Which one do you want?"].join(`
`);function qt(e){return!0}function $a(e){return Be.find(t=>t.id===e).label}function Ve(e,t){return e==="other"?t?.trim()||"your agent":qe.find(a=>a.id===e).label}function Ha(e){return`Fetch and execute the instructions to set me up for ABDM integration from ${e}/agent-setup/prompt.md`}function Vt(e){return[e,"","If this session did not open in the repository I am integrating ABDM into, ask me for the path before you write anything."].join(`
`)}function Da(e){return e.replace(/\/+$/,"")}function K(e){return["```",e,"```"].join(`
`)}var Gt="abdm-integrators-assistant",Kt=e=>`claude plugin marketplace add ${e} && claude plugin install ${Gt}@abdm-portal`,Ra=e=>`codex plugin marketplace add ${e}`;function Jt(e,t){return`claude://code/new?q=${encodeURIComponent(Vt(["Set this project up for ABDM integration. Run:","",`claude plugin marketplace add ${t}`,"claude plugin install abdm-integrators-assistant@abdm-portal","",`If the marketplace add fails (the repository may not be accessible), instead fetch and execute the instructions from ${e}/agent-setup/prompt.md`].join(`
`)))}`}function Oa(e,t,a,n){let r=Ha(a);return e==="claude"?{text:["Claude Code takes the plugin, which carries every skill at once and updates in place. Run this in the repository you are integrating.","",K(Kt(n))].join(`
`),link:{href:Jt(a,n),label:"Open in Claude"}}:e==="cursor"?{text:["Paste this into Cursor, or let the link put it in the composer. It fetches the current instructions from this site, so what it installs cannot go stale.","",K(r)].join(`
`),link:{href:`cursor://anysphere.cursor-deeplink/prompt?text=${encodeURIComponent(Vt(r))}`,label:"Open in Cursor"}}:e==="codex"?{text:["Codex has no URL scheme, so this is a paste. Give it to a Codex session in the repository you are integrating, and it fetches the current instructions from this site.","",K(r)].join(`
`)}:{text:[`Any agent that can fetch a URL takes this line, ${Ve(e,t)} included. The instructions live on this site and are rebuilt with it, so the pasted line cannot go stale.`,"",K(r)].join(`
`)}}function ja(e,t,a,n){return e==="claude"?{text:["Run this in the repository you are integrating. It carries every skill at once, and `claude plugin update` keeps it current.","",K(Kt(n))].join(`
`),link:{href:Jt(a,n),label:"Open in Claude"}}:e==="codex"?{text:[`Add the marketplace, then install \`${Gt}\` from it in Codex's plugin directory.`,"",K(Ra(n))].join(`
`)}:{text:[`The plugin is packaged to the Agent Plugins 1.0 standard, which ${Ve(e,t)} reads, but that route installs from the client's own marketplace and this plugin is not listed in one yet.`,"","The skills are the same content and they install today. Ask for Skills instead."].join(`
`)}}function Ua(e,t,a,n){return n?e==="claude"?{text:["User scope, so it is there in every project rather than only this directory.","",K(`claude mcp add --transport http ${Se} ${n} -s user`)].join(`
`),link:{href:`claude://code/new?q=${encodeURIComponent(["Add the ABDM documentation MCP server, then use it to answer my ABDM questions.","","Run this:",`claude mcp add --transport http ${Se} ${n} -s user`,"","User scope, so it is available in every project rather than only this directory."].join(`
`))}`,label:"Open in Claude"}}:e==="cursor"?{text:"The link opens Cursor on a confirmation dialog, and there is no command to run.",link:{href:`cursor://anysphere.cursor-deeplink/mcp/install?name=${Se}&config=${encodeURIComponent(btoa(JSON.stringify({url:n})))}`,label:"Add to Cursor"}}:{text:[`Any client that reads an \`mcpServers\` config takes this block as it stands, ${Ve(e,t)} included.`,"",K(JSON.stringify({mcpServers:{[Se]:{url:n}}},null,2))].join(`
`)}:{text:`The server is live, but this build of the site does not carry its address, so there is no command to give you. The address is set at deploy. [Build with AI](${a}/docs/hiecm/v3/getting-started/build-with-ai) has the current one.`}}function Ge(e,t){let a=Da(t.docsOrigin);return e.tool==="plugin"?ja(e.agent,e.named,a,t.pluginRepo):e.tool==="mcp"?Ua(e.agent,e.named,a,t.mcpUrl):Oa(e.agent,e.named,a,t.pluginRepo)}function Xt(e,t){return e.at==="tools"?Na:e.at==="agents"?`${$a(e.tool)} it is. Which agent are you working in?`:Ge(e,t).text}var Fa=/\b(integrat\w*|implement\w*|build|building|develop\w*|debug\w*|troubleshoot\w*|fix|fixing|broken|failing|failed|fails|error|errors|stuck|retry|retries|sandbox|certif\w*|onboard\w*|set ?up|install\w*|scaffold\w*|test\w*|why (is|does|isn.?t|doesn.?t|am|are)|how (do|can|would|should) (i|we)|not working|does ?n.?t work)\b/i;function Yt(e){return Fa.test(e)}function Qt(e,t,a,n){return e<=0||!a&&t<550&&e<220?0:n?e:Math.min(e,Math.max(2,Math.ceil(e/6)))}var Zt=`/* ---------- theming ---------- */

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
  --aa-fb-accent: hsl(140 30% 34%);
  --aa-fb-accent-soft: hsl(140 30% 34% / 0.1);
  --aa-fb-accent-line: hsl(140 30% 34% / 0.4);
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
  --aa-fb-accent: hsl(134 20% 72%);
  --aa-fb-accent-soft: hsl(134 20% 72% / 0.12);
  --aa-fb-accent-line: hsl(134 20% 72% / 0.4);
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
  padding: 1rem;
  border-bottom: 1px solid var(--aa-border);
}

.ask-ai__title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  font-family: var(--aa-font-serif);
  font-size: 1.125rem;
  font-weight: 400;
  color: var(--aa-heading);
}

.ask-ai__blurb {
  margin: 0.375rem 0 0;
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--aa-muted);
}

/* Pushes the controls to the right edge whether or not the reset chip and
   the mock badge are there. */
.ask-ai__grow {
  flex: 1 1 auto;
}

.ask-ai__blurb a {
  color: var(--aa-accent);
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

.ask-ai__turn--you {
  align-self: flex-end;
  background: var(--aa-accent);
  color: var(--aa-accent-contrast);
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
.ask-ai__starters {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  margin-top: 0.25rem;
}

.ask-ai__starter {
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--aa-border);
  border-radius: var(--aa-radius-control);
  background: var(--aa-surface);
  font-family: inherit;
  font-size: 0.8125rem;
  line-height: 1.4;
  text-align: left;
  color: var(--aa-body);
  cursor: pointer;
  transition: border-color 120ms ease, color 120ms ease;
}

.ask-ai__starter:hover {
  border-color: var(--aa-border-strong);
  color: var(--aa-heading);
}

/* A new conversation, once there is one to leave behind. */
.ask-ai__reset {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.1875rem 0.5rem;
  border: 1px solid var(--aa-border);
  border-radius: var(--aa-radius-chip);
  background: var(--aa-surface);
  font-family: var(--aa-font-sans);
  font-size: 0.75rem;
  color: var(--aa-muted);
  cursor: pointer;
}

.ask-ai__reset:hover {
  border-color: var(--aa-border-strong);
  color: var(--aa-heading);
}

/* Citation chips, one per source, under the answer text they support. */
.ask-ai__sources {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.375rem;
  margin-top: 0.625rem;
  padding-top: 0.5rem;
  border-top: 1px solid var(--aa-border);
}

.ask-ai__sources-label {
  font-size: 0.6875rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--aa-faint);
}

.ask-ai__source-chip {
  /* A citation is a pointer, not a sentence: long atom titles are cut rather
     than allowed to take a line each, which is what turned six sources into
     half a panel of boxes. */
  max-width: 11rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0.125rem 0.5rem;
  border: 1px solid var(--aa-border);
  border-radius: var(--aa-radius-chip);
  background: var(--aa-surface);
  font-size: 0.75rem;
  color: var(--aa-body);
  text-decoration: none;
}

.ask-ai__source-chip:hover {
  border-color: var(--aa-border-strong);
  color: var(--aa-heading);
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
  margin: 0;
  padding: 0.625rem 0.75rem;
  font-size: 0.8125rem;
  font-style: italic;
  color: var(--aa-faint);
}

.ask-ai__composer {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 0.5rem;
  padding: 0.75rem 1rem 1rem;
  border-top: 1px solid var(--aa-border);
}

/* The attached page, on its own line above the box it will be sent with, so
   the reader reads what is going before they write the question. It takes
   the full width of the composer rather than sitting beside the input,
   because a page title is a phrase and truncating it to a chip's width would
   leave the reader unsure which page is attached. */
.ask-ai__attached {
  flex: 1 0 100%;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  min-width: 0;
  padding: 0.25rem 0.25rem 0.25rem 0.625rem;
  border: 1px solid var(--aa-border);
  border-radius: var(--aa-radius-chip);
  background: var(--aa-page);
  font-size: 0.75rem;
  color: var(--aa-body);
}

/* The failure reads as a notice rather than an attachment: no fill, so it
   does not look like something the answer is using. */
.ask-ai__attached--failed {
  border-style: dashed;
  background: none;
  color: var(--aa-faint);
}

.ask-ai__attached-text {
  flex: 1 1 auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ask-ai__attached-remove {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
  padding: 0;
  border: 0;
  border-radius: var(--aa-radius-control);
  background: none;
  color: var(--aa-faint);
  cursor: pointer;
}

.ask-ai__attached-remove:hover {
  color: var(--aa-heading);
  background: var(--aa-fill-soft);
}

/* Keyboard reach is the whole point of this control being a button: the
   focus ring has to be visible against both the filled and the dashed
   state. */
.ask-ai__attached-remove:focus-visible {
  outline: 2px solid var(--aa-accent);
  outline-offset: 1px;
  color: var(--aa-heading);
}

.ask-ai__input {
  flex: 1 1 auto;
  min-width: 0;
  min-height: 2.25rem;
  max-height: 10rem;
  padding: 0.4375rem 0.75rem;
  resize: none;
  overflow-y: hidden; /* the composer turns this on when it overflows */
  line-height: 1.5;
  border: 1px solid var(--aa-border);
  border-radius: var(--aa-radius-control);
  background: var(--aa-page);
  font-family: inherit;
  font-size: 0.875rem;
  color: var(--aa-heading);
}

.ask-ai__input:focus {
  outline: none;
  border-color: var(--aa-border-strong);
}

.ask-ai__send {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border: 0;
  border-radius: var(--aa-radius-control);
  background: var(--aa-accent);
  color: var(--aa-accent-contrast);
  cursor: pointer;
}

.ask-ai__send--stop {
  background: var(--aa-fill-soft);
  color: var(--aa-heading);
}

/* An attached file: the chip above the composer while it is waiting to be
   sent, the paperclip that picks it, and the line naming it on the question
   it went with. */
.ask-ai__attachment {
  /* Its own strip above the composer rather than an item inside it: a
     wrapping composer stretches the field to the height of the line it wraps
     onto, and an empty box then stands three lines tall. */
  display: flex;
  margin: 0 1rem;
  align-items: center;
  gap: 0.375rem;
  width: 100%;
  padding: 0.375rem 0.5rem;
  border: 1px solid var(--aa-border);
  border-radius: var(--aa-radius-control);
  background: var(--aa-fill-soft);
  color: var(--aa-body);
  font-size: 0.75rem;
}

.ask-ai__attachment-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ask-ai__attachment-size {
  flex: 0 0 auto;
  margin-inline-start: auto;
  color: var(--aa-muted);
}

.ask-ai__attachment-remove {
  display: inline-flex;
  flex: 0 0 auto;
  padding: 0;
  border: 0;
  background: none;
  color: var(--aa-muted);
  cursor: pointer;
}

.ask-ai__attachment-error {
  color: var(--aa-muted);
}

.ask-ai__picker {
  display: none;
}

.ask-ai__attach {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border: 1px solid var(--aa-border);
  border-radius: var(--aa-radius-control);
  background: var(--aa-page);
  color: var(--aa-muted);
  cursor: pointer;
}

.ask-ai__attach:disabled {
  cursor: default;
  opacity: 0.5;
}

/* The file named under the question it went with. It sits inside the
   reader's own bubble, which is the accent colour, so it takes that
   bubble's ink at slightly less weight rather than the page's muted grey:
   grey on green is the one combination here that cannot be read. */
.ask-ai__turn-file {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.375rem;
  color: currentColor;
  opacity: 0.85;
  font-size: 0.6875rem;
}

.ask-ai__attachment-note {
  margin: 0.25rem 1rem 0;
  color: var(--aa-faint);
  font-size: 0.6875rem;
  line-height: 1.4;
}
`;var za=".json,.txt,.log,.csv,.xml,.yaml,.yml,.md,.har,.pdf,.png,.jpg,.jpeg,.webp",Qe=2e4,Ba=256*1024,qa=8*1024*1024;async function Va(e){let t=await import(`${z}pdf.min.mjs`);t.GlobalWorkerOptions.workerSrc=`${z}pdf.worker.min.mjs`;let a=t.getDocument({data:await e.arrayBuffer()}),n=await a.promise,r=[];for(let i=1;i<=n.numPages;i+=1){let l=await(await n.getPage(i)).getTextContent();if(r.push(l.items.map(c=>c.str??"").join(" ").replace(/[ \t]+/g," ").trim()),r.join(`

`).length>Qe)break}return await n.cleanup?.(),await a.destroy(),r.join(`

`).trim()}async function Ga(e,t){t("Loading the reader, once per browser."),await xe(`${z}tesseract.min.js`);let a=window.Tesseract;t("Reading the text out of that image.");let n=await a.createWorker("eng",1,{workerPath:`${z}worker.min.js`,corePath:z,langPath:`${z}lang`,cacheMethod:"none"});try{let{data:r}=await n.recognize(e);return(r.text??"").replace(/[ \t]+/g," ").trim()}finally{await n.terminate()}}var ea=24e3,ta=`

[This page was cut here to fit. Say so if the answer needs the rest of it.]`;function Ka(e){return e.length<=ea?e:e.slice(0,ea-ta.length)+ta}var Ja="This panel is a mock. No assistant is connected here yet, so nothing in it can answer that. The support page lists the channels a human reads.",Ke={from:"assistant",text:"This is a preview of the assistant, not a working one. Ask anything to see the shape of the answer; the reply below is fixed."},Je={from:"assistant",text:"What are you building? Ask me anything about ABDM."},Xa=["What format does the TIMESTAMP header need?","What does ABDM-1016 mean and how do I fix it?","How do I create an ABHA with an Aadhaar OTP?","What is a care context?"];function Ya(e){let t=e.split(`
`).map(a=>a.trim()).filter(Boolean);return t.length?t.slice(0,4):Xa}function aa(e,t){e(a=>{let n=a[a.length-1];return[...a.slice(0,-1),{...n,text:n.text+t}]})}function Qa(e){if(e.some(t=>t.install))return-1;for(let t=e.length-1;t>0;t-=1){let a=e[t];if(a.from!=="assistant"||a.text==="")continue;let n=e[t-1];return n?.from==="you"&&Yt(n.text)?t:-1}return-1}function Za(e,t){e(a=>{let n=a[a.length-1];return[...a.slice(0,-1),{...n,sources:t}]})}var Xe=320,na=960,Ye="abdm-ask-ai-width",Ze=!1;function en({dialog:e}){let[t,a]=E(!1);return H(()=>{let r=Number(localStorage.getItem(Ye));r>=Xe&&e.current&&e.current.style.setProperty("--aa-panel-width",`${r}px`)},[]),s("div",{class:`ask-ai__grip${t?" ask-ai__grip--dragging":""}`,role:"separator","aria-orientation":"vertical","aria-label":"Resize the panel",tabIndex:0,onPointerDown:r=>{let i=e.current;if(!i)return;r.preventDefault(),Ze=!0,a(!0),r.target.setPointerCapture(r.pointerId);let l=h=>{let d=window.innerWidth-h.clientX,p=Math.min(Math.max(d,Xe),Math.min(na,window.innerWidth));i.style.setProperty("--aa-panel-width",`${Math.round(p)}px`)},c=()=>{setTimeout(()=>{Ze=!1},0),a(!1),window.removeEventListener("pointermove",l),window.removeEventListener("pointerup",c),window.removeEventListener("pointercancel",c);let h=i.style.getPropertyValue("--aa-panel-width");h&&localStorage.setItem(Ye,String(parseInt(h,10)))};window.addEventListener("pointermove",l),window.addEventListener("pointerup",c),window.addEventListener("pointercancel",c)},onKeyDown:r=>{let i=r.key==="ArrowLeft"?32:r.key==="ArrowRight"?-32:0;if(!i||!e.current)return;r.preventDefault();let l=e.current.getBoundingClientRect().width,c=Math.min(Math.max(l+i,Xe),na);e.current.style.setProperty("--aa-panel-width",`${c}px`),localStorage.setItem(Ye,String(c))},children:s("span",{class:"ask-ai__grip-bar","aria-hidden":"true"})})}function tn({apiBase:e,docsOrigin:t,mcpUrl:a,pluginRepo:n,open:r,onClose:i,page:l,onDetach:c,question:h,send:d,starters:p,supportUrl:v}){let[o,_]=E([e?Je:Ke]),k=l?zt(l.markdown).slice(0,4):[],I=k.length?k:p,[y,w]=E(""),[f,C]=E(null),[B,S]=E(null),[R,U]=E(null),[F,q]=E("idle"),[M,D]=E(null),[Ce,tt]=E(""),[at,nt]=E(!1),rt=P(null),ne=P(null),Ee=P(null),re=P(null),it=P(null),Z=P(null),X=F!=="idle",ie=l!==null&&l.markdown!=="",O=P(""),Y=P(!1),Q=P(!0),ot=P(0),st=P(!1),j=P(0),ee=P(null),lt=()=>{j.current=requestAnimationFrame(lt);let u=O.current.length;if(u===0){if(!Q.current)return;cancelAnimationFrame(j.current),j.current=0,Y.current=!1,ee.current&&(Za(_,ee.current),ee.current=null),q("idle");return}let m=Qt(u,performance.now()-ot.current,Y.current,st.current);m!==0&&(Y.current||(Y.current=!0,q("streaming")),aa(_,O.current.slice(0,m)),O.current=O.current.slice(m))},oe=u=>{O.current+=u},ra=u=>{ee.current=u},ia=()=>{j.current&&cancelAnimationFrame(j.current),j.current=0,Y.current=!1,O.current="",ee.current=null,Q.current=!0};H(()=>{_(u=>u.length===1?[e?Je:Ke]:u)},[e]),H(()=>{if(!(!r||!h)){if(!d){w(u=>u||h);return}rt.current!==h&&(rt.current=h,le(h))}},[r,h,d]),H(()=>{let u=ne.current;u&&(r&&!u.open&&(u.showModal(),re.current?.focus()),!r&&u.open&&u.close())},[r]),H(()=>{if(!r)return;let u=m=>{m.key==="Escape"&&(m.preventDefault(),m.stopPropagation(),i())};return document.addEventListener("keydown",u,!0),()=>document.removeEventListener("keydown",u,!0)},[r,i]);let Pe=P(!0),oa=()=>{let u=Ee.current;u&&(Pe.current=u.scrollHeight-u.scrollTop-u.clientHeight<40)};H(()=>{let u=Ee.current;u&&Pe.current&&(u.scrollTop=u.scrollHeight)},[o,F,M]),H(()=>{let u=re.current;if(!u)return;u.style.height="auto";let m=Math.min(u.scrollHeight,160);u.style.height=`${m}px`,u.style.overflowY=u.scrollHeight>m?"auto":"hidden"},[y]),H(()=>()=>{Z.current?.abort(),j.current&&cancelAnimationFrame(j.current)},[]);let sa=()=>{Z.current?.abort(),ia(),Pe.current=!0,_([e?Je:Ke]),w(""),C(null),S(null),U(null),D(null),q("idle")},la=async u=>{if(!u)return;S(null);let m=u.name.toLowerCase(),g=u.type==="application/pdf"||m.endsWith(".pdf"),N=u.type.startsWith("image/"),L=g||N?qa:Ba;if(u.size>L){S("That file is too large. Attach the failing part of it.");return}let x;try{if(g){if(U("Reading the text in that PDF."),x=await Va(u),!x){U(null),S("That PDF has no text in it, only pictures of text. Attach a screenshot of the part you mean and it will be read.");return}}else N?x=await Ga(u,U):x=await u.text()}catch{U(null),S("That file could not be read.");return}finally{U(null)}if(!g&&!N&&x.includes("\uFFFD")){S("That looks like a binary file. Text and JSON only.");return}if(x.length>Qe){S(`That file is ${x.length.toLocaleString()} characters. Attach at most ${Qe.toLocaleString()}.`);return}if(!x.trim()){S(N?"No text could be read out of that image.":"That file is empty.");return}C({name:u.name,text:x,kind:g?"pdf":N?"image":void 0}),re.current?.focus()},ca=()=>{Z.current?.abort(),O.current&&aa(_,O.current),O.current="",Q.current=!0},se=(u,m)=>{tt(""),nt(!1),_(g=>[...g,...m?[{from:"you",text:m}]:[],{from:"assistant",text:Xt(u,{docsOrigin:t,mcpUrl:a,pluginRepo:n}),install:u}])},le=async u=>{if(!u||X)return;let m=f;w(""),C(null),S(null);let g=[...o.slice(1).filter(L=>!L.install),{from:"you",text:u,file:m??void 0}];if(_(L=>[...L,{from:"you",text:u,file:m??void 0},{from:"assistant",text:""}]),O.current="",Y.current=!1,Q.current=!1,ot.current=performance.now(),st.current=window.matchMedia("(prefers-reduced-motion: reduce)").matches,q("thinking"),D("Thinking"),j.current||(j.current=requestAnimationFrame(lt)),!e){oe(Ja),Q.current=!0;return}let N=new AbortController;Z.current=N;try{let L=await fetch(`${e.replace(/\/$/,"")}/api/chat`,{method:"POST",signal:N.signal,headers:{"Content-Type":"application/json"},body:JSON.stringify({turns:g.slice(-9).map(x=>({role:x.from==="you"?"user":"assistant",text:x.text,...x.file?{attachment:{name:x.file.name,text:x.file.text,...x.file.kind?{kind:x.file.kind}:{}}}:{}})),...ie?{page:{title:l.title,url:l.url,markdown:Ka(l.markdown)}}:{}})});if(!L.ok||!L.body)throw new Error(`status ${L.status}`);await Bt(L.body,{onText:oe,onTool:x=>D(x),onSources:x=>ra(x),onError:oe})}catch(L){L instanceof DOMException&&L.name==="AbortError"||oe(ze)}finally{Z.current=null,Q.current=!0,D(null)}},da=F==="thinking",ua=Qa(o);return s("dialog",{class:"ask-ai",ref:ne,"aria-label":"Ask AI",onClose:i,onCancel:i,onClick:u=>{u.target===ne.current&&!Ze&&i()},children:[s(en,{dialog:ne}),s("div",{class:"ask-ai__head",children:[s("h2",{class:"ask-ai__title",children:["Ask AI",!e&&s("span",{class:"ask-ai__badge",children:"Mock"}),s("span",{class:"ask-ai__grow"}),o.length>1&&s("button",{type:"button",class:"ask-ai__reset",onClick:sa,"aria-label":"Start a new conversation",children:[s(Dt,{}),"New"]}),s("button",{type:"button",class:"ask-ai__close",onClick:i,"aria-label":"Close",children:s(ye,{})})]}),!e&&s("p",{class:"ask-ai__blurb",children:["Not connected to anything. For a real answer, use"," ",s("a",{href:v,target:"_blank",rel:"noopener noreferrer",children:"support"}),"."]})]}),s("div",{class:"ask-ai__thread",ref:Ee,role:"log","aria-live":"polite","aria-busy":X,onScroll:oa,children:[o.map((u,m)=>u.from==="assistant"&&u.text===""?null:s("div",{class:`ask-ai__turn ask-ai__turn--${u.from}${F==="streaming"&&m===o.length-1?" ask-ai__turn--streaming":""}`,children:[u.from==="assistant"?s(We,{text:u.text,docsOrigin:t}):u.text,u.file&&s("span",{class:"ask-ai__turn-file",children:[s(we,{}),u.file.name]}),u.from==="assistant"&&m>0&&u.text!==""&&!(X&&m===o.length-1)&&s(Te,{text:u.text,label:"Copy answer",className:"ask-ai__turn-copy"}),u.sources&&u.sources.length>0&&s("div",{class:"ask-ai__sources",children:[s("span",{class:"ask-ai__sources-label",children:"Sources"}),u.sources.map(g=>s("a",{href:Fe(g.url,t)??g.url,target:"_blank",rel:"noopener noreferrer",class:"ask-ai__source-chip",children:[g.title,g.status!=="verified"?" (spec)":""]},g.id))]}),u.install&&m===o.length-1&&s("div",{class:"ask-ai__choices",children:[u.install.at==="tools"&&Be.map(g=>s("button",{type:"button",class:"ask-ai__choice",onClick:()=>se(qt(g.id)?{at:"agents",tool:g.id}:{at:"answer",tool:g.id,agent:"claude"},g.label),children:g.label},g.id)),u.install.at==="agents"&&!at&&qe.map(g=>s("button",{type:"button",class:"ask-ai__choice",onClick:()=>{if(g.id==="other"){nt(!0);return}se({at:"answer",tool:u.install.tool,agent:g.id},g.label)},children:g.label},g.id)),u.install.at==="agents"&&at&&s("form",{class:"ask-ai__naming",onSubmit:g=>{g.preventDefault();let N=Ce.trim();N&&se({at:"answer",tool:u.install.tool,agent:"other",named:N},N)},children:[s("input",{class:"ask-ai__naming-field",value:Ce,autoFocus:!0,placeholder:"Which agent?","aria-label":"The name of your agent",onInput:g=>tt(g.target.value)}),s("button",{type:"submit",class:"ask-ai__choice",disabled:Ce.trim()==="",children:s(Ue,{})})]})]}),u.install?.at==="answer"&&(()=>{let{link:g}=Ge(u.install,{docsOrigin:t,mcpUrl:a,pluginRepo:n});return g?s("a",{class:"ask-ai__install-cta",href:g.href,target:"_blank",rel:"noopener noreferrer",children:[s(ke,{}),g.label]}):null})(),m===ua&&!(X&&m===o.length-1)&&s("button",{type:"button",class:"ask-ai__install-cta",onClick:()=>se({at:"tools"},"Install AI tools"),children:[s(ke,{}),"Install AI tools"]})]},m)),da&&s("p",{class:"ask-ai__activity",children:[s("span",{class:"ask-ai__pulse","aria-hidden":"true"}),M??"Thinking"]}),o.length===1&&s("div",{class:"ask-ai__starters",children:I.map(u=>s("button",{type:"button",class:"ask-ai__starter",onClick:()=>{le(u)},children:u},u))})]}),(f||B||R)&&s("div",{class:"ask-ai__attachment",children:R?s($,{children:[s("span",{class:"ask-ai__pulse","aria-hidden":"true"}),s("span",{class:"ask-ai__attachment-note",children:R})]}):f?s($,{children:[s(we,{}),s("span",{class:"ask-ai__attachment-name",children:f.name}),s("span",{class:"ask-ai__attachment-size",children:f.kind==="image"?`${f.text.length.toLocaleString()} characters read`:`${f.text.length.toLocaleString()} characters`}),s("button",{type:"button",class:"ask-ai__attachment-remove","aria-label":`Remove ${f.name}`,onClick:()=>C(null),children:s(ye,{})})]}):s("span",{class:"ask-ai__attachment-error",children:B})}),f?.kind&&!R&&s("p",{class:"ask-ai__attachment-note",children:"Read here in your browser; the file itself is not sent. Names in it are yours to check before you send."}),s("form",{class:"ask-ai__composer",onSubmit:u=>{u.preventDefault(),le(y.trim())},children:[l&&s("div",{class:`ask-ai__attached${ie?"":" ask-ai__attached--failed"}`,children:[s("span",{class:"ask-ai__attached-text",children:ie?`Using this page: ${l.title}`:`Could not attach ${l.title}. The answer will not use it.`}),s("button",{type:"button",class:"ask-ai__attached-remove",onClick:c,"aria-label":ie?`Do not use ${l.title}`:`Dismiss the attachment notice for ${l.title}`,children:s(ye,{})})]}),s("input",{ref:it,type:"file",class:"ask-ai__picker",accept:za,onChange:u=>{let m=u.currentTarget;la(m.files?.[0]),m.value=""}}),s("button",{type:"button",class:"ask-ai__attach","aria-label":"Attach a text or JSON file",title:"Attach a text or JSON file",disabled:X,onClick:()=>it.current?.click(),children:s(we,{})}),s("textarea",{ref:re,class:"ask-ai__input",value:y,rows:1,onInput:u=>w(u.currentTarget.value),onKeyDown:u=>{u.key==="Enter"&&!u.shiftKey&&(u.preventDefault(),le(y.trim()))},placeholder:"Ask about ABDM","aria-label":"Ask the assistant"}),X?s("button",{class:"ask-ai__send ask-ai__send--stop",type:"button","aria-label":"Stop",onClick:ca,children:s(Rt,{})}):s("button",{class:"ask-ai__send",type:"submit","aria-label":"Send",disabled:y.trim()==="",children:s(Ue,{})})]})]})}function an({host:e,apiBase:t,docsOrigin:a,mcpUrl:n,pluginRepo:r,supportUrl:i,launcher:l,shortcut:c,open:h,page:d,onDetach:p,question:v,send:o,starters:_}){return s($,{children:[l&&s("button",{type:"button",class:"ask-ai__launcher","aria-label":"Ask AI",onClick:()=>{e.removeAttribute("open"),e.setAttribute("open","")},children:[s(ke,{}),s("span",{class:"ask-ai__launcher-label",children:"Ask AI"}),c&&s("kbd",{class:"ask-ai__launcher-key",children:c})]}),s(tn,{apiBase:t,docsOrigin:a,mcpUrl:n,pluginRepo:r,supportUrl:i,open:h,question:v,send:o,starters:_,onClose:()=>{e.removeAttribute("open"),e.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))},page:d,onDetach:p})]})}function nn(){for(let e=document.body;e;e=e.parentElement){let t=/^rgba?\(([^)]+)\)/.exec(getComputedStyle(e).backgroundColor);if(!t)continue;let[a,n,r,i=1]=t[1].split(",").map(Number);if(i)return .2126*a+.7152*n+.0722*r<128?"dark":"light"}return window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}var et=class extends HTMLElement{static observedAttributes=["api-base","docs-origin","mcp-url","plugin-repo","support-url","launcher","shortcut","open","question","send","starters","ground"];root=null;page=null;connectedCallback(){if(!this.root){this.root=this.attachShadow({mode:"open"});let t=document.createElement("style");t.textContent=Zt,this.root.append(t),this.hasAttribute("ground")||this.setAttribute("ground",nn())}this.paint()}attributeChangedCallback(){this.root&&this.paint()}show(){this.setAttribute("open","")}hide(){this.removeAttribute("open")}attachPage(t){this.page=t,this.root&&this.paint()}paint(){let t=this.getAttribute("docs-origin")??window.location.origin;At(s(an,{host:this,apiBase:this.getAttribute("api-base")??"",docsOrigin:t,mcpUrl:this.getAttribute("mcp-url"),pluginRepo:this.getAttribute("plugin-repo")??"nha-in/docs",supportUrl:this.getAttribute("support-url")??`${t.replace(/\/$/,"")}/docs/support`,launcher:this.getAttribute("launcher")!=="none",shortcut:this.getAttribute("shortcut")??"",open:this.hasAttribute("open"),page:this.page,onDetach:()=>this.attachPage(null),question:this.getAttribute("question")??"",send:this.hasAttribute("send"),starters:Ya(this.getAttribute("starters")??"")}),this.root)}};typeof customElements<"u"&&!customElements.get("abdm-support-agent")&&customElements.define("abdm-support-agent",et);})();
