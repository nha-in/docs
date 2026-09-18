(()=>{var me,v,_t,ha,B,ct,pt,ft,Pe,de,te,mt,Le,Ie,Me,_a,_e={},pe=[],pa=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i,ge=Array.isArray;function W(e,t){for(var a in t)e[a]=t[a];return e}function Ne(e){e&&e.parentNode&&e.parentNode.removeChild(e)}function fa(e,t,a){var n,i,r,l={};for(r in t)r=="key"?n=t[r]:r=="ref"?i=t[r]:l[r]=t[r];if(arguments.length>2&&(l.children=arguments.length>3?me.call(arguments,2):a),typeof e=="function"&&e.defaultProps!=null)for(r in e.defaultProps)l[r]===void 0&&(l[r]=e.defaultProps[r]);return ue(e,l,n,i,null)}function ue(e,t,a,n,i){var r={type:e,props:t,key:a,ref:n,__k:null,__:null,__b:0,__e:null,__c:null,constructor:void 0,__v:i??++_t,__i:-1,__u:0};return i==null&&v.vnode!=null&&v.vnode(r),r}function H(e){return e.children}function he(e,t){this.props=e,this.context=t}function K(e,t){if(t==null)return e.__?K(e.__,e.__i+1):null;for(var a;t<e.__k.length;t++)if((a=e.__k[t])!=null&&a.__e!=null)return a.__e;return typeof e.type=="function"?K(e):null}function ma(e){if(e.__P&&e.__d){var t=e.__v,a=t.__e,n=[],i=[],r=W({},t);r.__v=t.__v+1,v.vnode&&v.vnode(r),$e(e.__P,r,t,e.__n,e.__P.namespaceURI,32&t.__u?[a]:null,n,a??K(t),!!(32&t.__u),i),r.__v=t.__v,r.__.__k[r.__i]=r,yt(n,r,i),t.__e=t.__=null,r.__e!=a&&gt(r)}}function gt(e){if((e=e.__)!=null&&e.__c!=null)return e.__e=e.__c.base=null,e.__k.some(function(t){if(t!=null&&t.__e!=null)return e.__e=e.__c.base=t.__e}),gt(e)}function dt(e){(!e.__d&&(e.__d=!0)&&B.push(e)&&!fe.__r++||ct!=v.debounceRendering)&&((ct=v.debounceRendering)||pt)(fe)}function fe(){try{for(var e,t=1;B.length;)B.length>t&&B.sort(ft),e=B.shift(),t=B.length,ma(e)}finally{B.length=fe.__r=0}}function bt(e,t,a,n,i,r,l,c,h,u,_){var f,s,p,y,S,w,k=n&&n.__k||pe,g=t.length;for(h=ga(a,t,k,h,g),f=0;f<g;f++)(p=a.__k[f])!=null&&(s=p.__i!=-1&&k[p.__i]||_e,p.__i=f,w=$e(e,p,s,i,r,l,c,h,u,_),y=p.__e,p.ref&&s.ref!=p.ref&&(s.ref&&De(s.ref,null,p),_.push(p.ref,p.__c||y,p)),S==null&&y!=null&&(S=y),4&p.__u?(h=vt(p,h,e),s.__e&&(s.__e=null)):typeof p.type=="function"&&w!==void 0?h=w:y&&(h=y.nextSibling),p.__u&=-7);return a.__e=S,h}function ga(e,t,a,n,i){var r,l,c,h,u,_=a.length,f=_,s=0;for(e.__k=new Array(i),r=0;r<i;r++)(l=t[r])!=null&&typeof l!="boolean"&&typeof l!="function"?(typeof l=="string"||typeof l=="number"||typeof l=="bigint"||l.constructor==String?l=e.__k[r]=ue(null,l,null,null,null):ge(l)?l=e.__k[r]=ue(H,{children:l},null,null,null):l.constructor===void 0&&l.__b>0?l=e.__k[r]=ue(l.type,l.props,l.key,l.ref?l.ref:null,l.__v):e.__k[r]=l,h=r+s,l.__=e,l.__b=e.__b+1,c=null,(u=l.__i=ba(l,a,h,f))!=-1&&(f--,(c=a[u])&&(c.__u|=2)),c==null||c.__v==null?(u==-1&&(i>_?s--:i<_&&s++),typeof l.type!="function"&&(l.__u|=4)):u!=h&&(u==h-1?s--:u==h+1?s++:(u>h?s--:s++,l.__u|=4))):e.__k[r]=null;if(f)for(r=0;r<_;r++)(c=a[r])!=null&&(2&c.__u)==0&&(c.__e==n&&(n=K(c)),xt(c,c));return n}function vt(e,t,a){var n,i;if(typeof e.type=="function"){for(n=e.__k,i=0;n&&i<n.length;i++)n[i]&&(n[i].__=e,t=vt(n[i],t,a));return t}e.__e!=t&&(t&&e.type&&!t.parentNode&&(t=K(e)),t=a.insertBefore(e.__e,t||null));do t=t&&t.nextSibling;while(t!=null&&t.nodeType==8);return t}function ba(e,t,a,n){var i,r,l,c=e.key,h=e.type,u=t[a],_=u!=null&&(2&u.__u)==0;if(u===null&&c==null||_&&c==u.key&&h==u.type)return a;if(n>(_?1:0)){for(i=a-1,r=a+1;i>=0||r<t.length;)if((u=t[l=i>=0?i--:r++])!=null&&(2&u.__u)==0&&c==u.key&&h==u.type)return l}return-1}function ut(e,t,a){t[0]=="-"?e.setProperty(t,a??""):e[t]=a==null?"":typeof a!="number"||pa.test(t)?a:a+"px"}function ce(e,t,a,n,i){var r,l;e:if(t=="style")if(typeof a=="string")e.style.cssText=a;else{if(typeof n=="string"&&(e.style.cssText=n=""),n)for(t in n)a&&t in a||ut(e.style,t,"");if(a)for(t in a)n&&a[t]==n[t]||ut(e.style,t,a[t])}else if(t[0]=="o"&&t[1]=="n")r=t!=(t=t.replace(mt,"$1")),l=t.toLowerCase(),t=l in e||t=="onFocusOut"||t=="onFocusIn"?l.slice(2):t.slice(2),e.l||(e.l={}),e.l[t+r]=a,a?n?a[te]=n[te]:(a[te]=Le,e.addEventListener(t,r?Me:Ie,r)):e.removeEventListener(t,r?Me:Ie,r);else{if(i=="http://www.w3.org/2000/svg")t=t.replace(/xlink(H|:h)/,"h").replace(/sName$/,"s");else if(t!="width"&&t!="height"&&t!="href"&&t!="list"&&t!="form"&&t!="tabIndex"&&t!="download"&&t!="rowSpan"&&t!="colSpan"&&t!="role"&&t!="popover"&&t in e)try{e[t]=a??"";break e}catch{}typeof a=="function"||(a==null||a===!1&&t[4]!="-"?e.removeAttribute(t):e.setAttribute(t,t=="popover"&&a==1?"":a))}}function ht(e){return function(t){if(this.l){var a=this.l[t.type+e];if(t[de]==null)t[de]=Le++;else if(t[de]<a[te])return;return a(v.event?v.event(t):t)}}}function $e(e,t,a,n,i,r,l,c,h,u){var _,f,s,p,y,S,w,k,g,M,C,N,$,G,F,X,E=t.type;if(t.constructor!==void 0)return null;128&a.__u&&(h=!!(32&a.__u),r=[c=t.__e=a.__e]),(_=v.__b)&&_(t);e:if(typeof E=="function"){f=l.length;try{if(g=t.props,M=E.prototype&&E.prototype.render,C=(_=E.contextType)&&n[_.__c],N=_?C?C.props.value:_.__:n,a.__c?k=(s=t.__c=a.__c).__=s.__E:(M?t.__c=s=new E(g,N):(t.__c=s=new he(g,N),s.constructor=E,s.render=ka),C&&C.sub(s),s.state||(s.state={}),s.__n=n,p=s.__d=!0,s.__h=[],s._sb=[]),M&&s.__s==null&&(s.__s=s.state),M&&E.getDerivedStateFromProps!=null&&(s.__s==s.state&&(s.__s=W({},s.__s)),W(s.__s,E.getDerivedStateFromProps(g,s.__s))),y=s.props,S=s.state,s.__v=t,p)M&&E.getDerivedStateFromProps==null&&s.componentWillMount!=null&&s.componentWillMount(),M&&s.componentDidMount!=null&&s.__h.push(s.componentDidMount);else{if(M&&E.getDerivedStateFromProps==null&&g!==y&&s.componentWillReceiveProps!=null&&s.componentWillReceiveProps(g,N),t.__v==a.__v||!s.__e&&s.shouldComponentUpdate!=null&&s.shouldComponentUpdate(g,s.__s,N)===!1){t.__v!=a.__v&&(s.props=g,s.state=s.__s,s.__d=!1),t.__e=a.__e,t.__k=a.__k,t.__k.some(function(R){R&&(R.__=t)}),pe.push.apply(s.__h,s._sb),s._sb=[],s.__h.length&&l.push(s),c=K(a);break e}s.componentWillUpdate!=null&&s.componentWillUpdate(g,s.__s,N),M&&s.componentDidUpdate!=null&&s.__h.push(function(){s.componentDidUpdate(y,S,w)})}if(s.context=N,s.props=g,s.__P=e,s.__e=!1,$=v.__r,G=0,M)s.state=s.__s,s.__d=!1,$&&$(t),_=s.render(s.props,s.state,s.context),pe.push.apply(s.__h,s._sb),s._sb=[];else do s.__d=!1,$&&$(t),_=s.render(s.props,s.state,s.context),s.state=s.__s;while(s.__d&&++G<25);s.state=s.__s,s.getChildContext!=null&&(n=W(W({},n),s.getChildContext())),M&&!p&&s.getSnapshotBeforeUpdate!=null&&(w=s.getSnapshotBeforeUpdate(y,S)),F=_!=null&&_.type===H&&_.key==null?wt(_.props.children):_,c=bt(e,ge(F)?F:[F],t,a,n,i,r,l,c,h,u),s.base=t.__e,t.__u&=-161,s.__h.length&&l.push(s),k&&(s.__E=s.__=null)}catch(R){if(l.length=f,t.__v=null,h||r!=null){if(R.then){for(t.__u|=h?160:128;c&&c.nodeType==8&&c.nextSibling;)c=c.nextSibling;r!=null&&(r[r.indexOf(c)]=null),t.__e=c}else if(r!=null)for(X=r.length;X--;)Ne(r[X])}else t.__e=a.__e;t.__k==null&&(t.__k=a.__k||[]),R.then||kt(t),v.__e(R,t,a)}}else r==null&&t.__v==a.__v?(t.__k=a.__k,t.__e=a.__e):c=t.__e=va(a.__e,t,a,n,i,r,l,h,u);return(_=v.diffed)&&_(t),128&t.__u?void 0:c}function kt(e){e&&(e.__c&&(e.__c.__e=!0),e.__k&&e.__k.some(kt))}function yt(e,t,a){for(var n=0;n<a.length;n++)De(a[n],a[++n],a[++n]);v.__c&&v.__c(t,e),e.some(function(i){try{e=i.__h,i.__h=[],e.some(function(r){r.call(i)})}catch(r){v.__e(r,i.__v)}})}function wt(e){return typeof e!="object"||e==null||e.__b>0?e:ge(e)?e.map(wt):e.constructor!==void 0?null:W({},e)}function va(e,t,a,n,i,r,l,c,h){var u,_,f,s,p,y,S,w=a.props||_e,k=t.props,g=t.type;if(g=="svg"?i="http://www.w3.org/2000/svg":g=="math"?i="http://www.w3.org/1998/Math/MathML":i||(i="http://www.w3.org/1999/xhtml"),r!=null){for(u=0;u<r.length;u++)if((p=r[u])&&"setAttribute"in p==!!g&&(g?p.localName==g:p.nodeType==3)){e=p,r[u]=null;break}}if(e==null){if(g==null)return document.createTextNode(k);e=document.createElementNS(i,g,k.is&&k),c&&(v.__m&&v.__m(t,r),c=!1),r=null}if(g==null)w===k||c&&e.data==k||(e.data=k);else{if(r=g=="textarea"&&k.defaultValue!=null?null:r&&me.call(e.childNodes),!c&&r!=null)for(w={},u=0;u<e.attributes.length;u++)w[(p=e.attributes[u]).name]=p.value;for(u in w)p=w[u],u=="dangerouslySetInnerHTML"?f=p:u=="children"||u in k||u=="value"&&"defaultValue"in k||u=="checked"&&"defaultChecked"in k||ce(e,u,null,p,i);for(u in k)p=k[u],u=="children"?s=p:u=="dangerouslySetInnerHTML"?_=p:u=="value"?y=p:u=="checked"?S=p:c&&typeof p!="function"||w[u]===p||ce(e,u,p,w[u],i);if(_)c||f&&(_.__html==f.__html||_.__html==e.innerHTML)||(e.innerHTML=_.__html),t.__k=[];else if(f&&(e.innerHTML=""),bt(t.type=="template"?e.content:e,ge(s)?s:[s],t,a,n,g=="foreignObject"?"http://www.w3.org/1999/xhtml":i,r,l,r?r[0]:a.__k&&K(a,0),c,h),r!=null)for(u=r.length;u--;)Ne(r[u]);c&&g!="textarea"||(u="value",g=="progress"&&y==null?e.removeAttribute("value"):y!=null&&(y!==e[u]||g=="progress"&&!y||g=="option"&&y!=w[u])&&ce(e,u,y,w[u],i),u="checked",S!=null&&S!=e[u]&&ce(e,u,S,w[u],i))}return e}function De(e,t,a){try{if(typeof e=="function"){var n=typeof e.__u=="function";n&&e.__u(),n&&t==null||(e.__u=e(t))}else e.current=t}catch(i){v.__e(i,a)}}function xt(e,t,a){var n,i;if(v.unmount&&v.unmount(e),(n=e.ref)&&(n.current&&n.current!=e.__e||De(n,null,t)),(n=e.__c)!=null){if(n.componentWillUnmount)try{n.componentWillUnmount()}catch(r){v.__e(r,t)}n.base=n.__P=n.__n=null}if(n=e.__k)for(i=0;i<n.length;i++)n[i]&&xt(n[i],t,a||typeof e.type!="function");a||Ne(e.__e),e.__c=e.__=e.__e=void 0}function ka(e,t,a){return this.constructor(e,a)}function At(e,t,a){var n,i,r,l;t==document&&(t=document.documentElement),v.__&&v.__(e,t),i=(n=typeof a=="function")?null:a&&a.__k||t.__k,r=[],l=[],$e(t,e=(!n&&a||t).__k=fa(H,null,[e]),i||_e,_e,t.namespaceURI,!n&&a?[a]:i?null:t.firstChild?me.call(t.childNodes):null,r,!n&&a?a:i?i.__e:t.firstChild,n,l),yt(r,e,l),e.props.children=null}me=pe.slice,v={__e:function(e,t,a,n){for(var i,r,l;t=t.__;)if((i=t.__c)&&!i.__)try{if((r=i.constructor)&&r.getDerivedStateFromError!=null&&(i.setState(r.getDerivedStateFromError(e)),l=i.__d),i.componentDidCatch!=null&&(i.componentDidCatch(e,n||{}),l=i.__d),l)return i.__E=i}catch(c){e=c}throw e}},_t=0,ha=function(e){return e!=null&&e.constructor===void 0},he.prototype.setState=function(e,t){var a;a=this.__s!=null&&this.__s!=this.state?this.__s:this.__s=W({},this.state),typeof e=="function"&&(e=e(W({},a),this.props)),e&&W(a,e),e!=null&&this.__v&&(t&&this._sb.push(t),dt(this))},he.prototype.forceUpdate=function(e){this.__v&&(this.__e=!0,e&&this.__h.push(e),dt(this))},he.prototype.render=H,B=[],pt=typeof Promise=="function"?Promise.prototype.then.bind(Promise.resolve()):setTimeout,ft=function(e,t){return e.__v.__b-t.__v.__b},fe.__r=0,Pe=Math.random().toString(8),de="__d"+Pe,te="__a"+Pe,mt=/(PointerCapture)$|Capture$/i,Le=0,Ie=ht(!1),Me=ht(!0),_a=0;var ae,A,He,Tt,ve=0,Nt=[],T=v,St=T.__b,Ct=T.__r,Et=T.diffed,Pt=T.__c,It=T.unmount,Mt=T.__;function Re(e,t){T.__h&&T.__h(A,e,ve||t),ve=0;var a=A.__H||(A.__H={__:[],__h:[]});return e>=a.__.length&&a.__.push({}),a.__[e]}function P(e){return ve=1,ya(Dt,e)}function ya(e,t,a){var n=Re(ae++,2);if(n.t=e,!n.__c&&(n.__=[a?a(t):Dt(void 0,t),function(c){var h=n.__N?n.__N[0]:n.__[0],u=n.t(h,c);h!==u&&(n.__N=[u,n.__[1]],n.__c.setState({}))}],n.__c=A,!A.__f)){var i=function(c,h,u){if(!n.__c.__H)return!0;var _=!1,f=n.__c.props!==c;if(n.__c.__H.__.some(function(p){if(p.__N){_=!0;var y=p.__[0];p.__=p.__N,p.__N=void 0,y!==p.__[0]&&(f=!0)}}),r){var s=r.call(this,c,h,u);return _?s||f:s}return!_||f};A.__f=!0;var r=A.shouldComponentUpdate,l=A.componentWillUpdate;A.componentWillUpdate=function(c,h,u){if(this.__e){var _=r;r=void 0,i(c,h,u),r=_}l&&l.call(this,c,h,u)},A.shouldComponentUpdate=i}return n.__N||n.__}function O(e,t){var a=Re(ae++,3);!T.__s&&$t(a.__H,t)&&(a.__=e,a.u=t,A.__H.__h.push(a))}function I(e){return ve=5,wa(function(){return{current:e}},[])}function wa(e,t){var a=Re(ae++,7);return $t(a.__H,t)&&(a.__=e(),a.__H=t,a.__h=e),a.__}function xa(){for(var e;e=Nt.shift();){var t=e.__H;if(e.__P&&t)try{t.__h.some(be),t.__h.some(Oe),t.__h=[]}catch(a){t.__h=[],T.__e(a,e.__v)}}}T.__b=function(e){A=null,St&&St(e)},T.__=function(e,t){e&&t.__k&&t.__k.__m&&(e.__m=t.__k.__m),Mt&&Mt(e,t)},T.__r=function(e){Ct&&Ct(e),ae=0;var t=(A=e.__c).__H;t&&(He===A?(t.__h=[],A.__h=[],t.__.some(function(a){a.__N&&(a.__=a.__N),a.u=a.__N=void 0})):(t.__h.some(be),t.__h.some(Oe),t.__h=[],ae=0)),He=A},T.diffed=function(e){Et&&Et(e);var t=e.__c;t&&t.__H&&(t.__H.__h.length&&(Nt.push(t)!==1&&Tt===T.requestAnimationFrame||((Tt=T.requestAnimationFrame)||Aa)(xa)),t.__H.__.some(function(a){a.u&&(a.__H=a.u,a.u=void 0)})),He=A=null},T.__c=function(e,t){t.some(function(a){try{a.__h.some(be),a.__h=a.__h.filter(function(n){return!n.__||Oe(n)})}catch(n){t.some(function(i){i.__h&&(i.__h=[])}),t=[],T.__e(n,a.__v)}}),Pt&&Pt(e,t)},T.unmount=function(e){It&&It(e);var t,a=e.__c;a&&a.__H&&(a.__H.__.some(function(n){try{be(n)}catch(i){t=i}}),a.__H=void 0,t&&T.__e(t,a.__v))};var Lt=typeof requestAnimationFrame=="function";function Aa(e){var t,a=function(){clearTimeout(n),Lt&&cancelAnimationFrame(t),setTimeout(e)},n=setTimeout(a,35);Lt&&(t=requestAnimationFrame(a))}function be(e){var t=A,a=e.__c;typeof a=="function"&&(e.__c=void 0,a()),A=t}function Oe(e){var t=A;e.__c=e.__(),A=t}function $t(e,t){return!e||e.length!==t.length||t.some(function(a,n){return a!==e[n]})}function Dt(e,t){return typeof t=="function"?t(e):t}var Ta=0;function o(e,t,a,n,i,r){t||(t={});var l,c,h=t;if("ref"in h)for(c in h={},t)c=="ref"?l=t[c]:h[c]=t[c];var u={type:e,props:h,key:a,ref:l,__k:null,__:null,__b:0,__e:null,__c:null,constructor:void 0,__v:--Ta,__i:-1,__u:0,__source:i,__self:r};if(typeof e=="function"&&(l=e.defaultProps))for(c in l)h[c]===void 0&&(h[c]=l[c]);return v.vnode&&v.vnode(u),u}var q={xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round","aria-hidden":"true"},Ue=()=>o("svg",{...q,width:"16",height:"16",children:[o("path",{d:"m5 12 7-7 7 7"}),o("path",{d:"M12 19V5"})]}),Ht=()=>o("svg",{...q,width:"14",height:"14",children:[o("path",{d:"M13 21h8"}),o("path",{d:"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"})]}),ke=()=>o("svg",{...q,width:"14",height:"14",children:[o("path",{d:"M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"}),o("path",{d:"M20 2v4"}),o("path",{d:"M22 4h-4"}),o("circle",{cx:"4",cy:"20",r:"2"})]}),Ot=()=>o("svg",{...q,width:"12",height:"12",children:o("rect",{width:"18",height:"18",x:"3",y:"3",rx:"2"})}),Rt=()=>o("svg",{...q,width:"14",height:"14",children:o("path",{d:"M20 6 9 17l-5-5"})}),Ut=()=>o("svg",{...q,width:"14",height:"14",children:[o("rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2"}),o("path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"})]}),ye=()=>o("svg",{...q,width:"16",height:"16",children:[o("path",{d:"M18 6 6 18"}),o("path",{d:"m6 6 12 12"})]}),we=()=>o("svg",{...q,width:"16",height:"16",children:[o("path",{d:"M13.234 20.252 21 12.3"}),o("path",{d:"m16 6-8.414 8.586a2 2 0 0 0 0 2.828 2 2 0 0 0 2.828 0l8.414-8.586a4 4 0 0 0 0-5.656 4 4 0 0 0-5.656 0l-8.415 8.585a6 6 0 1 0 8.486 8.486"})]});var z=(()=>{if(typeof document>"u")return"/agent/vendor/";let e=document.currentScript?.src;try{return new URL("vendor/",e??"/agent/").href}catch{return"/agent/vendor/"}})(),jt=new Map;function xe(e){let t=jt.get(e);if(t)return t;let a=new Promise((n,i)=>{let r=document.createElement("script");r.src=e,r.onload=()=>n(),r.onerror=()=>i(new Error(`could not load ${e}`)),document.head.append(r)});return jt.set(e,a),a}var Sa=/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)\s]+\))/g;function je(e,t){return e.startsWith("/")?`${t.replace(/\/$/,"")}${e}`:e.startsWith("https://")||e.startsWith("http://")?e:null}function Ae(e,t){return e.split(Sa).map((n,i)=>{if(n.startsWith("`")&&n.endsWith("`")&&n.length>2)return o("code",{children:n.slice(1,-1)},i);if(n.startsWith("**")&&n.endsWith("**")&&n.length>4)return o("b",{children:Ae(n.slice(2,-2),t)},i);if(n.startsWith("*")&&n.endsWith("*")&&n.length>2)return o("em",{children:Ae(n.slice(1,-1),t)},i);let r=/^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(n);if(r){let[,l,c]=r,h=je(c,t);return h?o("a",{href:h,target:"_blank",rel:"noopener noreferrer",children:l},i):n}return n})}function Te({text:e,label:t,className:a}){let[n,i]=P(!1);return O(()=>{if(!n)return;let r=window.setTimeout(()=>i(!1),1600);return()=>window.clearTimeout(r)},[n]),typeof navigator>"u"||!navigator.clipboard?null:o("button",{type:"button",class:a,"aria-label":n?"Copied":t,onClick:()=>{navigator.clipboard.writeText(e).then(()=>i(!0),()=>{})},children:n?o(Rt,{}):o(Ut,{})})}var Ft=null;function Ca(){return Ft??=xe(`${z}mermaid.min.js`).then(()=>{let e=globalThis.mermaid;if(!e)throw new Error("mermaid loaded but registered nothing");return e.initialize({startOnLoad:!1,securityLevel:"strict",theme:Ea()?"dark":"default",fontFamily:"inherit"}),e}),Ft}function Ea(){let e=document.documentElement.dataset.theme;return e==="dark"?!0:e==="light"?!1:globalThis.matchMedia?.("(prefers-color-scheme: dark)").matches??!1}var Wt=0;function Pa({text:e}){let[t,a]=P(""),[n,i]=P(!1);return O(()=>{let r=!0;i(!1),a(""),Wt+=1;let l=`ask-ai-diagram-${Wt}`;return Ca().then(c=>c.render(l,e)).then(c=>{r&&a(c.svg)}).catch(()=>{r&&i(!0),document.getElementById(l)?.remove(),document.getElementById(`d${l}`)?.remove()}),()=>{r=!1}},[e]),n?o("div",{class:"ask-ai__code",children:[o("pre",{children:o("code",{children:e})}),o(Te,{text:e,label:"Copy diagram source",className:"ask-ai__code-copy"})]}):o("div",{class:"ask-ai__diagram",dangerouslySetInnerHTML:{__html:t}})}var Ia=/^\s*[-*]\s+(.*)$/,Ma=/^\s*\d+[.)]\s+(.*)$/;function La(e){let t=[],a=null,n=[],i=null,r="",l=()=>{n.length>0&&(t.push({kind:"p",text:n.join(" ")}),n=[])},c=()=>{a&&(t.push(a),a=null)};for(let h of e.split(`
`)){if(h.trimStart().startsWith("```")){i?(t.push({kind:"code",text:i.join(`
`),lang:r,closed:!0}),i=null,r=""):(l(),c(),r=h.trim().slice(3).trim().toLowerCase(),i=[]);continue}if(i){i.push(h);continue}let u=Ia.exec(h),_=u?null:Ma.exec(h);if(u||_){l();let f=u?"ul":"ol";(!a||a.kind!==f)&&(c(),a={kind:f,items:[]}),a.items.push((u??_)[1]);continue}if(h.trim()===""){l(),c();continue}if(a&&/^\s{2,}/.test(h)){a.items[a.items.length-1]+=` ${h.trim()}`;continue}c(),n.push(h.replace(/^#{1,4}\s+/,"").trim())}return i&&t.push({kind:"code",text:i.join(`
`),lang:r,closed:!1}),l(),c(),t}function Fe({text:e,docsOrigin:t}){return o(H,{children:La(e).map((a,n)=>{if(a.kind==="p")return o("p",{children:Ae(a.text,t)},n);if(a.kind==="code")return a.lang==="mermaid"&&a.closed?o(Pa,{text:a.text},n):o("div",{class:"ask-ai__code",children:[o("pre",{children:o("code",{children:a.text})}),o(Te,{text:a.text,label:"Copy code",className:"ask-ai__code-copy"})]},n);let i=a.kind;return o(i,{children:a.items.map((r,l)=>o("li",{children:Ae(r,t)},l))},n)})})}function zt(e){let t=[],a=!1;for(let n of e.split(`
`))/^\s*```/.test(n)?a=!a:!a&&/^##\s+/.test(n)&&t.push(n.slice(2).replace(/[*`_]/g,"").trim());return t.filter(Boolean)}var We="The assistant is unreachable right now. Try again shortly.";async function Bt(e,t){let a=e.getReader(),n=new TextDecoder,i="",r=l=>{let c="message",h=[];for(let _ of l.split(`
`))_.startsWith("event:")?c=_.slice(6).trim():_.startsWith("data:")&&h.push(_.slice(5).trim());if(h.length===0)return;let u;try{u=JSON.parse(h.join(`
`))}catch{return}switch(c){case"text":t.onText(u.delta??"");break;case"tool":{let _=u;t.onTool(_.detail||_.name);break}case"sources":t.onSources(u);break;case"error":t.onError(u.message||We);break;default:break}};for(;;){let{done:l,value:c}=await a.read();if(l)break;i+=n.decode(c,{stream:!0});let h;for(;(h=i.indexOf(`

`))!==-1;){let u=i.slice(0,h);i=i.slice(h+2),r(u)}}}var ze="eka-care/abdm-docs",Se="abdm-docs",Be=[{id:"skills",label:"Skills"},{id:"mcp",label:"MCP server"},{id:"plugin",label:"Plugin"}],qe=[{id:"claude",label:"Claude"},{id:"codex",label:"Codex"},{id:"cursor",label:"Cursor"},{id:"other",label:"Other"}],Na=["Three ways to give your agent this catalogue. Take any of them, or all three.","","- **Skills**: the milestones written as files an agent reads before it writes code. One set up line, any agent.","- **MCP server**: your agent queries these pages as it works, so it retrieves the paragraph it needs instead of loading the site.","- **Plugin**: every skill at once, as one package. Claude Code and Codex install it straight from the repository; the other Agent Plugins clients list it through their own marketplaces.","","Which one do you want?"].join(`
`);function qt(e){return!0}function $a(e){return Be.find(t=>t.id===e).label}function Ve(e,t){return e==="other"?t?.trim()||"your agent":qe.find(a=>a.id===e).label}function Da(e){return`Fetch and execute the instructions to set me up for ABDM integration from ${e}/agent-setup/prompt.md`}function Vt(e){return[e,"","If this session did not open in the repository I am integrating ABDM into, ask me for the path before you write anything."].join(`
`)}function Ha(e){return e.replace(/\/+$/,"")}function V(e){return["```",e,"```"].join(`
`)}var Gt="abdm-integrators-assistant",Kt=`claude plugin marketplace add ${ze} && claude plugin install ${Gt}@nha-in`,Oa=`codex plugin marketplace add ${ze}`;function Xt(e){return`claude://code/new?q=${encodeURIComponent(Vt(["Set this project up for ABDM integration. Run:","",`claude plugin marketplace add ${ze}`,"claude plugin install abdm-integrators-assistant@nha-in","",`If the marketplace add fails (the repository may not be accessible), instead fetch and execute the instructions from ${e}/agent-setup/prompt.md`].join(`
`)))}`}function Ra(e,t,a){let n=Da(a);return e==="claude"?{text:["Claude Code takes the plugin, which carries every skill at once and updates in place. Run this in the repository you are integrating.","",V(Kt)].join(`
`),link:{href:Xt(a),label:"Open in Claude"}}:e==="cursor"?{text:["Paste this into Cursor, or let the link put it in the composer. It fetches the current instructions from this site, so what it installs cannot go stale.","",V(n)].join(`
`),link:{href:`cursor://anysphere.cursor-deeplink/prompt?text=${encodeURIComponent(Vt(n))}`,label:"Open in Cursor"}}:e==="codex"?{text:["Codex has no URL scheme, so this is a paste. Give it to a Codex session in the repository you are integrating, and it fetches the current instructions from this site.","",V(n)].join(`
`)}:{text:[`Any agent that can fetch a URL takes this line, ${Ve(e,t)} included. The instructions live on this site and are rebuilt with it, so the pasted line cannot go stale.`,"",V(n)].join(`
`)}}function Ua(e,t,a){return e==="claude"?{text:["Run this in the repository you are integrating. It carries every skill at once, and `claude plugin update` keeps it current.","",V(Kt)].join(`
`),link:{href:Xt(a),label:"Open in Claude"}}:e==="codex"?{text:[`Add the marketplace, then install \`${Gt}\` from it in Codex's plugin directory.`,"",V(Oa)].join(`
`)}:{text:[`The plugin is packaged to the Agent Plugins 1.0 standard, which ${Ve(e,t)} reads, but that route installs from the client's own marketplace and this plugin is not listed in one yet.`,"","The skills are the same content and they install today. Ask for Skills instead."].join(`
`)}}function ja(e,t,a,n){return n?e==="claude"?{text:["User scope, so it is there in every project rather than only this directory.","",V(`claude mcp add --transport http ${Se} ${n} -s user`)].join(`
`),link:{href:`claude://code/new?q=${encodeURIComponent(["Add the ABDM documentation MCP server, then use it to answer my ABDM questions.","","Run this:",`claude mcp add --transport http ${Se} ${n} -s user`,"","User scope, so it is available in every project rather than only this directory."].join(`
`))}`,label:"Open in Claude"}}:e==="cursor"?{text:"The link opens Cursor on a confirmation dialog, and there is no command to run.",link:{href:`cursor://anysphere.cursor-deeplink/mcp/install?name=${Se}&config=${encodeURIComponent(btoa(JSON.stringify({url:n})))}`,label:"Add to Cursor"}}:{text:[`Any client that reads an \`mcpServers\` config takes this block as it stands, ${Ve(e,t)} included.`,"",V(JSON.stringify({mcpServers:{[Se]:{url:n}}},null,2))].join(`
`)}:{text:`The server is live, but this build of the site does not carry its address, so there is no command to give you. The address is set at deploy. [Build with AI](${a}/docs/hiecm/v3/getting-started/build-with-ai) has the current one.`}}function Ge(e,t){let a=Ha(t.docsOrigin);return e.tool==="plugin"?Ua(e.agent,e.named,a):e.tool==="mcp"?ja(e.agent,e.named,a,t.mcpUrl):Ra(e.agent,e.named,a)}function Jt(e,t){return e.at==="tools"?Na:e.at==="agents"?`${$a(e.tool)} it is. Which agent are you working in?`:Ge(e,t).text}var Fa=/\b(integrat\w*|implement\w*|build|building|develop\w*|debug\w*|troubleshoot\w*|fix|fixing|broken|failing|failed|fails|error|errors|stuck|retry|retries|sandbox|certif\w*|onboard\w*|set ?up|install\w*|scaffold\w*|test\w*|why (is|does|isn.?t|doesn.?t|am|are)|how (do|can|would|should) (i|we)|not working|does ?n.?t work)\b/i;function Yt(e){return Fa.test(e)}function Qt(e,t,a,n){return e<=0||!a&&t<550&&e<220?0:n?e:Math.min(e,Math.max(2,Math.ceil(e/6)))}var Zt=`/* ---------- theming ---------- */

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
`;var za=".json,.txt,.log,.csv,.xml,.yaml,.yml,.md,.har,.pdf,.png,.jpg,.jpeg,.webp",Qe=2e4,Ba=256*1024,qa=8*1024*1024;async function Va(e){let t=await import(`${z}pdf.min.mjs`);t.GlobalWorkerOptions.workerSrc=`${z}pdf.worker.min.mjs`;let a=t.getDocument({data:await e.arrayBuffer()}),n=await a.promise,i=[];for(let r=1;r<=n.numPages;r+=1){let l=await(await n.getPage(r)).getTextContent();if(i.push(l.items.map(c=>c.str??"").join(" ").replace(/[ \t]+/g," ").trim()),i.join(`

`).length>Qe)break}return await n.cleanup?.(),await a.destroy(),i.join(`

`).trim()}async function Ga(e,t){t("Loading the reader, once per browser."),await xe(`${z}tesseract.min.js`);let a=window.Tesseract;t("Reading the text out of that image.");let n=await a.createWorker("eng",1,{workerPath:`${z}worker.min.js`,corePath:z,langPath:`${z}lang`,cacheMethod:"none"});try{let{data:i}=await n.recognize(e);return(i.text??"").replace(/[ \t]+/g," ").trim()}finally{await n.terminate()}}var ea=24e3,ta=`

[This page was cut here to fit. Say so if the answer needs the rest of it.]`;function Ka(e){return e.length<=ea?e:e.slice(0,ea-ta.length)+ta}var Xa="This panel is a mock. No assistant is connected here yet, so nothing in it can answer that. The support page lists the channels a human reads.",Ke={from:"assistant",text:"This is a preview of the assistant, not a working one. Ask anything to see the shape of the answer; the reply below is fixed."},Xe={from:"assistant",text:"What are you building? Ask me anything about ABDM."},Ja=["What format does the TIMESTAMP header need?","What does ABDM-1016 mean and how do I fix it?","How do I create an ABHA with an Aadhaar OTP?","What is a care context?"];function Ya(e){let t=e.split(`
`).map(a=>a.trim()).filter(Boolean);return t.length?t.slice(0,4):Ja}function aa(e,t){e(a=>{let n=a[a.length-1];return[...a.slice(0,-1),{...n,text:n.text+t}]})}function Qa(e){if(e.some(t=>t.install))return-1;for(let t=e.length-1;t>0;t-=1){let a=e[t];if(a.from!=="assistant"||a.text==="")continue;let n=e[t-1];return n?.from==="you"&&Yt(n.text)?t:-1}return-1}function Za(e,t){e(a=>{let n=a[a.length-1];return[...a.slice(0,-1),{...n,sources:t}]})}var Je=320,na=960,Ye="abdm-ask-ai-width",Ze=!1;function en({dialog:e}){let[t,a]=P(!1);return O(()=>{let i=Number(localStorage.getItem(Ye));i>=Je&&e.current&&e.current.style.setProperty("--aa-panel-width",`${i}px`)},[]),o("div",{class:`ask-ai__grip${t?" ask-ai__grip--dragging":""}`,role:"separator","aria-orientation":"vertical","aria-label":"Resize the panel",tabIndex:0,onPointerDown:i=>{let r=e.current;if(!r)return;i.preventDefault(),Ze=!0,a(!0),i.target.setPointerCapture(i.pointerId);let l=h=>{let u=window.innerWidth-h.clientX,_=Math.min(Math.max(u,Je),Math.min(na,window.innerWidth));r.style.setProperty("--aa-panel-width",`${Math.round(_)}px`)},c=()=>{setTimeout(()=>{Ze=!1},0),a(!1),window.removeEventListener("pointermove",l),window.removeEventListener("pointerup",c),window.removeEventListener("pointercancel",c);let h=r.style.getPropertyValue("--aa-panel-width");h&&localStorage.setItem(Ye,String(parseInt(h,10)))};window.addEventListener("pointermove",l),window.addEventListener("pointerup",c),window.addEventListener("pointercancel",c)},onKeyDown:i=>{let r=i.key==="ArrowLeft"?32:i.key==="ArrowRight"?-32:0;if(!r||!e.current)return;i.preventDefault();let l=e.current.getBoundingClientRect().width,c=Math.min(Math.max(l+r,Je),na);e.current.style.setProperty("--aa-panel-width",`${c}px`),localStorage.setItem(Ye,String(c))},children:o("span",{class:"ask-ai__grip-bar","aria-hidden":"true"})})}function tn({apiBase:e,docsOrigin:t,mcpUrl:a,open:n,onClose:i,page:r,onDetach:l,question:c,send:h,starters:u,supportUrl:_}){let[f,s]=P([e?Xe:Ke]),p=r?zt(r.markdown).slice(0,4):[],y=p.length?p:u,[S,w]=P(""),[k,g]=P(null),[M,C]=P(null),[N,$]=P(null),[G,F]=P("idle"),[X,E]=P(null),[R,tt]=P(""),[at,nt]=P(!1),rt=I(null),ne=I(null),Ce=I(null),re=I(null),it=I(null),Z=I(null),J=G!=="idle",ie=r!==null&&r.markdown!=="",U=I(""),Y=I(!1),Q=I(!0),ot=I(0),st=I(!1),j=I(0),ee=I(null),lt=()=>{j.current=requestAnimationFrame(lt);let d=U.current.length;if(d===0){if(!Q.current)return;cancelAnimationFrame(j.current),j.current=0,Y.current=!1,ee.current&&(Za(s,ee.current),ee.current=null),F("idle");return}let b=Qt(d,performance.now()-ot.current,Y.current,st.current);b!==0&&(Y.current||(Y.current=!0,F("streaming")),aa(s,U.current.slice(0,b)),U.current=U.current.slice(b))},oe=d=>{U.current+=d},ra=d=>{ee.current=d},ia=()=>{j.current&&cancelAnimationFrame(j.current),j.current=0,Y.current=!1,U.current="",ee.current=null,Q.current=!0};O(()=>{s(d=>d.length===1?[e?Xe:Ke]:d)},[e]),O(()=>{if(!(!n||!c)){if(!h){w(d=>d||c);return}rt.current!==c&&(rt.current=c,le(c))}},[n,c,h]),O(()=>{let d=ne.current;d&&(n&&!d.open&&(d.showModal(),re.current?.focus()),!n&&d.open&&d.close())},[n]),O(()=>{if(!n)return;let d=b=>{b.key==="Escape"&&(b.preventDefault(),b.stopPropagation(),i())};return document.addEventListener("keydown",d,!0),()=>document.removeEventListener("keydown",d,!0)},[n,i]);let Ee=I(!0),oa=()=>{let d=Ce.current;d&&(Ee.current=d.scrollHeight-d.scrollTop-d.clientHeight<40)};O(()=>{let d=Ce.current;d&&Ee.current&&(d.scrollTop=d.scrollHeight)},[f,G,X]),O(()=>{let d=re.current;if(!d)return;d.style.height="auto";let b=Math.min(d.scrollHeight,160);d.style.height=`${b}px`,d.style.overflowY=d.scrollHeight>b?"auto":"hidden"},[S]),O(()=>()=>{Z.current?.abort(),j.current&&cancelAnimationFrame(j.current)},[]);let sa=()=>{Z.current?.abort(),ia(),Ee.current=!0,s([e?Xe:Ke]),w(""),g(null),C(null),$(null),E(null),F("idle")},la=async d=>{if(!d)return;C(null);let b=d.name.toLowerCase(),m=d.type==="application/pdf"||b.endsWith(".pdf"),D=d.type.startsWith("image/"),L=m||D?qa:Ba;if(d.size>L){C("That file is too large. Attach the failing part of it.");return}let x;try{if(m){if($("Reading the text in that PDF."),x=await Va(d),!x){$(null),C("That PDF has no text in it, only pictures of text. Attach a screenshot of the part you mean and it will be read.");return}}else D?x=await Ga(d,$):x=await d.text()}catch{$(null),C("That file could not be read.");return}finally{$(null)}if(!m&&!D&&x.includes("\uFFFD")){C("That looks like a binary file. Text and JSON only.");return}if(x.length>Qe){C(`That file is ${x.length.toLocaleString()} characters. Attach at most ${Qe.toLocaleString()}.`);return}if(!x.trim()){C(D?"No text could be read out of that image.":"That file is empty.");return}g({name:d.name,text:x,kind:m?"pdf":D?"image":void 0}),re.current?.focus()},ca=()=>{Z.current?.abort(),U.current&&aa(s,U.current),U.current="",Q.current=!0},se=(d,b)=>{tt(""),nt(!1),s(m=>[...m,...b?[{from:"you",text:b}]:[],{from:"assistant",text:Jt(d,{docsOrigin:t,mcpUrl:a}),install:d}])},le=async d=>{if(!d||J)return;let b=k;w(""),g(null),C(null);let m=[...f.slice(1).filter(L=>!L.install),{from:"you",text:d,file:b??void 0}];if(s(L=>[...L,{from:"you",text:d,file:b??void 0},{from:"assistant",text:""}]),U.current="",Y.current=!1,Q.current=!1,ot.current=performance.now(),st.current=window.matchMedia("(prefers-reduced-motion: reduce)").matches,F("thinking"),E("Thinking"),j.current||(j.current=requestAnimationFrame(lt)),!e){oe(Xa),Q.current=!0;return}let D=new AbortController;Z.current=D;try{let L=await fetch(`${e.replace(/\/$/,"")}/api/chat`,{method:"POST",signal:D.signal,headers:{"Content-Type":"application/json"},body:JSON.stringify({turns:m.slice(-9).map(x=>({role:x.from==="you"?"user":"assistant",text:x.text,...x.file?{attachment:{name:x.file.name,text:x.file.text,...x.file.kind?{kind:x.file.kind}:{}}}:{}})),...ie?{page:{title:r.title,url:r.url,markdown:Ka(r.markdown)}}:{}})});if(!L.ok||!L.body)throw new Error(`status ${L.status}`);await Bt(L.body,{onText:oe,onTool:x=>E(x),onSources:x=>ra(x),onError:oe})}catch(L){L instanceof DOMException&&L.name==="AbortError"||oe(We)}finally{Z.current=null,Q.current=!0,E(null)}},da=G==="thinking",ua=Qa(f);return o("dialog",{class:"ask-ai",ref:ne,"aria-label":"Ask AI",onClose:i,onCancel:i,onClick:d=>{d.target===ne.current&&!Ze&&i()},children:[o(en,{dialog:ne}),o("div",{class:"ask-ai__head",children:[o("h2",{class:"ask-ai__title",children:["Ask AI",!e&&o("span",{class:"ask-ai__badge",children:"Mock"}),o("span",{class:"ask-ai__grow"}),f.length>1&&o("button",{type:"button",class:"ask-ai__reset",onClick:sa,"aria-label":"Start a new conversation",children:[o(Ht,{}),"New"]}),o("button",{type:"button",class:"ask-ai__close",onClick:i,"aria-label":"Close",children:o(ye,{})})]}),!e&&o("p",{class:"ask-ai__blurb",children:["Not connected to anything. For a real answer, use"," ",o("a",{href:_,target:"_blank",rel:"noopener noreferrer",children:"support"}),"."]})]}),o("div",{class:"ask-ai__thread",ref:Ce,role:"log","aria-live":"polite","aria-busy":J,onScroll:oa,children:[f.map((d,b)=>d.from==="assistant"&&d.text===""?null:o("div",{class:`ask-ai__turn ask-ai__turn--${d.from}${G==="streaming"&&b===f.length-1?" ask-ai__turn--streaming":""}`,children:[d.from==="assistant"?o(Fe,{text:d.text,docsOrigin:t}):d.text,d.file&&o("span",{class:"ask-ai__turn-file",children:[o(we,{}),d.file.name]}),d.from==="assistant"&&b>0&&d.text!==""&&!(J&&b===f.length-1)&&o(Te,{text:d.text,label:"Copy answer",className:"ask-ai__turn-copy"}),d.sources&&d.sources.length>0&&o("div",{class:"ask-ai__sources",children:[o("span",{class:"ask-ai__sources-label",children:"Sources"}),d.sources.map(m=>o("a",{href:je(m.url,t)??m.url,target:"_blank",rel:"noopener noreferrer",class:"ask-ai__source-chip",children:[m.title,m.status!=="verified"?" (spec)":""]},m.id))]}),d.install&&b===f.length-1&&o("div",{class:"ask-ai__choices",children:[d.install.at==="tools"&&Be.map(m=>o("button",{type:"button",class:"ask-ai__choice",onClick:()=>se(qt(m.id)?{at:"agents",tool:m.id}:{at:"answer",tool:m.id,agent:"claude"},m.label),children:m.label},m.id)),d.install.at==="agents"&&!at&&qe.map(m=>o("button",{type:"button",class:"ask-ai__choice",onClick:()=>{if(m.id==="other"){nt(!0);return}se({at:"answer",tool:d.install.tool,agent:m.id},m.label)},children:m.label},m.id)),d.install.at==="agents"&&at&&o("form",{class:"ask-ai__naming",onSubmit:m=>{m.preventDefault();let D=R.trim();D&&se({at:"answer",tool:d.install.tool,agent:"other",named:D},D)},children:[o("input",{class:"ask-ai__naming-field",value:R,autoFocus:!0,placeholder:"Which agent?","aria-label":"The name of your agent",onInput:m=>tt(m.target.value)}),o("button",{type:"submit",class:"ask-ai__choice",disabled:R.trim()==="",children:o(Ue,{})})]})]}),d.install?.at==="answer"&&(()=>{let{link:m}=Ge(d.install,{docsOrigin:t,mcpUrl:a});return m?o("a",{class:"ask-ai__install-cta",href:m.href,target:"_blank",rel:"noopener noreferrer",children:[o(ke,{}),m.label]}):null})(),b===ua&&!(J&&b===f.length-1)&&o("button",{type:"button",class:"ask-ai__install-cta",onClick:()=>se({at:"tools"},"Install AI tools"),children:[o(ke,{}),"Install AI tools"]})]},b)),da&&o("p",{class:"ask-ai__activity",children:[o("span",{class:"ask-ai__pulse","aria-hidden":"true"}),X??"Thinking"]}),f.length===1&&o("div",{class:"ask-ai__starters",children:y.map(d=>o("button",{type:"button",class:"ask-ai__starter",onClick:()=>{le(d)},children:d},d))})]}),(k||M||N)&&o("div",{class:"ask-ai__attachment",children:N?o(H,{children:[o("span",{class:"ask-ai__pulse","aria-hidden":"true"}),o("span",{class:"ask-ai__attachment-note",children:N})]}):k?o(H,{children:[o(we,{}),o("span",{class:"ask-ai__attachment-name",children:k.name}),o("span",{class:"ask-ai__attachment-size",children:k.kind==="image"?`${k.text.length.toLocaleString()} characters read`:`${k.text.length.toLocaleString()} characters`}),o("button",{type:"button",class:"ask-ai__attachment-remove","aria-label":`Remove ${k.name}`,onClick:()=>g(null),children:o(ye,{})})]}):o("span",{class:"ask-ai__attachment-error",children:M})}),k?.kind&&!N&&o("p",{class:"ask-ai__attachment-note",children:"Read here in your browser; the file itself is not sent. Names in it are yours to check before you send."}),o("form",{class:"ask-ai__composer",onSubmit:d=>{d.preventDefault(),le(S.trim())},children:[r&&o("div",{class:`ask-ai__attached${ie?"":" ask-ai__attached--failed"}`,children:[o("span",{class:"ask-ai__attached-text",children:ie?`Using this page: ${r.title}`:`Could not attach ${r.title}. The answer will not use it.`}),o("button",{type:"button",class:"ask-ai__attached-remove",onClick:l,"aria-label":ie?`Do not use ${r.title}`:`Dismiss the attachment notice for ${r.title}`,children:o(ye,{})})]}),o("input",{ref:it,type:"file",class:"ask-ai__picker",accept:za,onChange:d=>{let b=d.currentTarget;la(b.files?.[0]),b.value=""}}),o("button",{type:"button",class:"ask-ai__attach","aria-label":"Attach a text or JSON file",title:"Attach a text or JSON file",disabled:J,onClick:()=>it.current?.click(),children:o(we,{})}),o("textarea",{ref:re,class:"ask-ai__input",value:S,rows:1,onInput:d=>w(d.currentTarget.value),onKeyDown:d=>{d.key==="Enter"&&!d.shiftKey&&(d.preventDefault(),le(S.trim()))},placeholder:"Ask about ABDM","aria-label":"Ask the assistant"}),J?o("button",{class:"ask-ai__send ask-ai__send--stop",type:"button","aria-label":"Stop",onClick:ca,children:o(Ot,{})}):o("button",{class:"ask-ai__send",type:"submit","aria-label":"Send",disabled:S.trim()==="",children:o(Ue,{})})]})]})}function an({host:e,apiBase:t,docsOrigin:a,mcpUrl:n,supportUrl:i,launcher:r,shortcut:l,open:c,page:h,onDetach:u,question:_,send:f,starters:s}){return o(H,{children:[r&&o("button",{type:"button",class:"ask-ai__launcher","aria-label":"Ask AI",onClick:()=>{e.removeAttribute("open"),e.setAttribute("open","")},children:[o(ke,{}),o("span",{class:"ask-ai__launcher-label",children:"Ask AI"}),l&&o("kbd",{class:"ask-ai__launcher-key",children:l})]}),o(tn,{apiBase:t,docsOrigin:a,mcpUrl:n,supportUrl:i,open:c,question:_,send:f,starters:s,onClose:()=>{e.removeAttribute("open"),e.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))},page:h,onDetach:u})]})}function nn(){for(let e=document.body;e;e=e.parentElement){let t=/^rgba?\(([^)]+)\)/.exec(getComputedStyle(e).backgroundColor);if(!t)continue;let[a,n,i,r=1]=t[1].split(",").map(Number);if(r)return .2126*a+.7152*n+.0722*i<128?"dark":"light"}return window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}var et=class extends HTMLElement{static observedAttributes=["api-base","docs-origin","mcp-url","support-url","launcher","shortcut","open","question","send","starters","ground"];root=null;page=null;connectedCallback(){if(!this.root){this.root=this.attachShadow({mode:"open"});let t=document.createElement("style");t.textContent=Zt,this.root.append(t),this.hasAttribute("ground")||this.setAttribute("ground",nn())}this.paint()}attributeChangedCallback(){this.root&&this.paint()}show(){this.setAttribute("open","")}hide(){this.removeAttribute("open")}attachPage(t){this.page=t,this.root&&this.paint()}paint(){let t=this.getAttribute("docs-origin")??window.location.origin;At(o(an,{host:this,apiBase:this.getAttribute("api-base")??"",docsOrigin:t,mcpUrl:this.getAttribute("mcp-url"),supportUrl:this.getAttribute("support-url")??`${t.replace(/\/$/,"")}/docs/support`,launcher:this.getAttribute("launcher")!=="none",shortcut:this.getAttribute("shortcut")??"",open:this.hasAttribute("open"),page:this.page,onDetach:()=>this.attachPage(null),question:this.getAttribute("question")??"",send:this.hasAttribute("send"),starters:Ya(this.getAttribute("starters")??"")}),this.root)}};typeof customElements<"u"&&!customElements.get("abdm-support-agent")&&customElements.define("abdm-support-agent",et);})();
