(()=>{var ue,m,Be,Lt,B,We,qe,Ve,ve,ne,Z,Ke,we,ke,ye,Dt,se={},le=[],It=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i,_e=Array.isArray;function W(t,e){for(var a in e)t[a]=e[a];return t}function xe(t){t&&t.parentNode&&t.parentNode.removeChild(t)}function Ft(t,e,a){var r,n,o,c={};for(o in e)o=="key"?r=e[o]:o=="ref"?n=e[o]:c[o]=e[o];if(arguments.length>2&&(c.children=arguments.length>3?ue.call(arguments,2):a),typeof t=="function"&&t.defaultProps!=null)for(o in t.defaultProps)c[o]===void 0&&(c[o]=t.defaultProps[o]);return oe(t,c,r,n,null)}function oe(t,e,a,r,n){var o={type:t,props:e,key:a,ref:r,__k:null,__:null,__b:0,__e:null,__c:null,constructor:void 0,__v:n??++Be,__i:-1,__u:0};return n==null&&m.vnode!=null&&m.vnode(o),o}function M(t){return t.children}function ie(t,e){this.props=t,this.context=e}function V(t,e){if(e==null)return t.__?V(t.__,t.__i+1):null;for(var a;e<t.__k.length;e++)if((a=t.__k[e])!=null&&a.__e!=null)return a.__e;return typeof t.type=="function"?V(t):null}function Rt(t){if(t.__P&&t.__d){var e=t.__v,a=e.__e,r=[],n=[],o=W({},e);o.__v=e.__v+1,m.vnode&&m.vnode(o),Ae(t.__P,o,e,t.__n,t.__P.namespaceURI,32&e.__u?[a]:null,r,a??V(e),!!(32&e.__u),n),o.__v=e.__v,o.__.__k[o.__i]=o,Qe(r,o,n),e.__e=e.__=null,o.__e!=a&&Ge(o)}}function Ge(t){if((t=t.__)!=null&&t.__c!=null)return t.__e=t.__c.base=null,t.__k.some(function(e){if(e!=null&&e.__e!=null)return t.__e=t.__c.base=e.__e}),Ge(t)}function Oe(t){(!t.__d&&(t.__d=!0)&&B.push(t)&&!ce.__r++||We!=m.debounceRendering)&&((We=m.debounceRendering)||qe)(ce)}function ce(){try{for(var t,e=1;B.length;)B.length>e&&B.sort(Ve),t=B.shift(),e=B.length,Rt(t)}finally{B.length=ce.__r=0}}function Je(t,e,a,r,n,o,c,u,d,l,h){var g,i,f,v,T,b,k=r&&r.__k||le,p=e.length;for(d=Ut(a,e,k,d,p),g=0;g<p;g++)(f=a.__k[g])!=null&&(i=f.__i!=-1&&k[f.__i]||se,f.__i=g,b=Ae(t,f,i,n,o,c,u,d,l,h),v=f.__e,f.ref&&i.ref!=f.ref&&(i.ref&&Te(i.ref,null,f),h.push(f.ref,f.__c||v,f)),T==null&&v!=null&&(T=v),4&f.__u?(d=Xe(f,d,t),i.__e&&(i.__e=null)):typeof f.type=="function"&&b!==void 0?d=b:v&&(d=v.nextSibling),f.__u&=-7);return a.__e=T,d}function Ut(t,e,a,r,n){var o,c,u,d,l,h=a.length,g=h,i=0;for(t.__k=new Array(n),o=0;o<n;o++)(c=e[o])!=null&&typeof c!="boolean"&&typeof c!="function"?(typeof c=="string"||typeof c=="number"||typeof c=="bigint"||c.constructor==String?c=t.__k[o]=oe(null,c,null,null,null):_e(c)?c=t.__k[o]=oe(M,{children:c},null,null,null):c.constructor===void 0&&c.__b>0?c=t.__k[o]=oe(c.type,c.props,c.key,c.ref?c.ref:null,c.__v):t.__k[o]=c,d=o+i,c.__=t,c.__b=t.__b+1,u=null,(l=c.__i=$t(c,a,d,g))!=-1&&(g--,(u=a[l])&&(u.__u|=2)),u==null||u.__v==null?(l==-1&&(n>h?i--:n<h&&i++),typeof c.type!="function"&&(c.__u|=4)):l!=d&&(l==d-1?i--:l==d+1?i++:(l>d?i--:i++,c.__u|=4))):t.__k[o]=null;if(g)for(o=0;o<h;o++)(u=a[o])!=null&&(2&u.__u)==0&&(u.__e==r&&(r=V(u)),et(u,u));return r}function Xe(t,e,a){var r,n;if(typeof t.type=="function"){for(r=t.__k,n=0;r&&n<r.length;n++)r[n]&&(r[n].__=t,e=Xe(r[n],e,a));return e}t.__e!=e&&(e&&t.type&&!e.parentNode&&(e=V(t)),e=a.insertBefore(t.__e,e||null));do e=e&&e.nextSibling;while(e!=null&&e.nodeType==8);return e}function $t(t,e,a,r){var n,o,c,u=t.key,d=t.type,l=e[a],h=l!=null&&(2&l.__u)==0;if(l===null&&u==null||h&&u==l.key&&d==l.type)return a;if(r>(h?1:0)){for(n=a-1,o=a+1;n>=0||o<e.length;)if((l=e[c=n>=0?n--:o++])!=null&&(2&l.__u)==0&&u==l.key&&d==l.type)return c}return-1}function je(t,e,a){e[0]=="-"?t.setProperty(e,a??""):t[e]=a==null?"":typeof a!="number"||It.test(e)?a:a+"px"}function re(t,e,a,r,n){var o,c;e:if(e=="style")if(typeof a=="string")t.style.cssText=a;else{if(typeof r=="string"&&(t.style.cssText=r=""),r)for(e in r)a&&e in a||je(t.style,e,"");if(a)for(e in a)r&&a[e]==r[e]||je(t.style,e,a[e])}else if(e[0]=="o"&&e[1]=="n")o=e!=(e=e.replace(Ke,"$1")),c=e.toLowerCase(),e=c in t||e=="onFocusOut"||e=="onFocusIn"?c.slice(2):e.slice(2),t.l||(t.l={}),t.l[e+o]=a,a?r?a[Z]=r[Z]:(a[Z]=we,t.addEventListener(e,o?ye:ke,o)):t.removeEventListener(e,o?ye:ke,o);else{if(n=="http://www.w3.org/2000/svg")e=e.replace(/xlink(H|:h)/,"h").replace(/sName$/,"s");else if(e!="width"&&e!="height"&&e!="href"&&e!="list"&&e!="form"&&e!="tabIndex"&&e!="download"&&e!="rowSpan"&&e!="colSpan"&&e!="role"&&e!="popover"&&e in t)try{t[e]=a??"";break e}catch{}typeof a=="function"||(a==null||a===!1&&e[4]!="-"?t.removeAttribute(e):t.setAttribute(e,e=="popover"&&a==1?"":a))}}function ze(t){return function(e){if(this.l){var a=this.l[e.type+t];if(e[ne]==null)e[ne]=we++;else if(e[ne]<a[Z])return;return a(m.event?m.event(e):e)}}}function Ae(t,e,a,r,n,o,c,u,d,l){var h,g,i,f,v,T,b,k,p,S,L,D,I,K,O,j,E=e.type;if(e.constructor!==void 0)return null;128&a.__u&&(d=!!(32&a.__u),o=[u=e.__e=a.__e]),(h=m.__b)&&h(e);e:if(typeof E=="function"){g=c.length;try{if(p=e.props,S=E.prototype&&E.prototype.render,L=(h=E.contextType)&&r[h.__c],D=h?L?L.props.value:h.__:r,a.__c?k=(i=e.__c=a.__c).__=i.__E:(S?e.__c=i=new E(p,D):(e.__c=i=new ie(p,D),i.constructor=E,i.render=Ot),L&&L.sub(i),i.state||(i.state={}),i.__n=r,f=i.__d=!0,i.__h=[],i._sb=[]),S&&i.__s==null&&(i.__s=i.state),S&&E.getDerivedStateFromProps!=null&&(i.__s==i.state&&(i.__s=W({},i.__s)),W(i.__s,E.getDerivedStateFromProps(p,i.__s))),v=i.props,T=i.state,i.__v=e,f)S&&E.getDerivedStateFromProps==null&&i.componentWillMount!=null&&i.componentWillMount(),S&&i.componentDidMount!=null&&i.__h.push(i.componentDidMount);else{if(S&&E.getDerivedStateFromProps==null&&p!==v&&i.componentWillReceiveProps!=null&&i.componentWillReceiveProps(p,D),e.__v==a.__v||!i.__e&&i.shouldComponentUpdate!=null&&i.shouldComponentUpdate(p,i.__s,D)===!1){e.__v!=a.__v&&(i.props=p,i.state=i.__s,i.__d=!1),e.__e=a.__e,e.__k=a.__k,e.__k.some(function(P){P&&(P.__=e)}),le.push.apply(i.__h,i._sb),i._sb=[],i.__h.length&&c.push(i),u=V(a);break e}i.componentWillUpdate!=null&&i.componentWillUpdate(p,i.__s,D),S&&i.componentDidUpdate!=null&&i.__h.push(function(){i.componentDidUpdate(v,T,b)})}if(i.context=D,i.props=p,i.__P=t,i.__e=!1,I=m.__r,K=0,S)i.state=i.__s,i.__d=!1,I&&I(e),h=i.render(i.props,i.state,i.context),le.push.apply(i.__h,i._sb),i._sb=[];else do i.__d=!1,I&&I(e),h=i.render(i.props,i.state,i.context),i.state=i.__s;while(i.__d&&++K<25);i.state=i.__s,i.getChildContext!=null&&(r=W(W({},r),i.getChildContext())),S&&!f&&i.getSnapshotBeforeUpdate!=null&&(b=i.getSnapshotBeforeUpdate(v,T)),O=h!=null&&h.type===M&&h.key==null?Ze(h.props.children):h,u=Je(t,_e(O)?O:[O],e,a,r,n,o,c,u,d,l),i.base=e.__e,e.__u&=-161,i.__h.length&&c.push(i),k&&(i.__E=i.__=null)}catch(P){if(c.length=g,e.__v=null,d||o!=null){if(P.then){for(e.__u|=d?160:128;u&&u.nodeType==8&&u.nextSibling;)u=u.nextSibling;o!=null&&(o[o.indexOf(u)]=null),e.__e=u}else if(o!=null)for(j=o.length;j--;)xe(o[j])}else e.__e=a.__e;e.__k==null&&(e.__k=a.__k||[]),P.then||Ye(e),m.__e(P,e,a)}}else o==null&&e.__v==a.__v?(e.__k=a.__k,e.__e=a.__e):u=e.__e=Wt(a.__e,e,a,r,n,o,c,d,l);return(h=m.diffed)&&h(e),128&e.__u?void 0:u}function Ye(t){t&&(t.__c&&(t.__c.__e=!0),t.__k&&t.__k.some(Ye))}function Qe(t,e,a){for(var r=0;r<a.length;r++)Te(a[r],a[++r],a[++r]);m.__c&&m.__c(e,t),t.some(function(n){try{t=n.__h,n.__h=[],t.some(function(o){o.call(n)})}catch(o){m.__e(o,n.__v)}})}function Ze(t){return typeof t!="object"||t==null||t.__b>0?t:_e(t)?t.map(Ze):t.constructor!==void 0?null:W({},t)}function Wt(t,e,a,r,n,o,c,u,d){var l,h,g,i,f,v,T,b=a.props||se,k=e.props,p=e.type;if(p=="svg"?n="http://www.w3.org/2000/svg":p=="math"?n="http://www.w3.org/1998/Math/MathML":n||(n="http://www.w3.org/1999/xhtml"),o!=null){for(l=0;l<o.length;l++)if((f=o[l])&&"setAttribute"in f==!!p&&(p?f.localName==p:f.nodeType==3)){t=f,o[l]=null;break}}if(t==null){if(p==null)return document.createTextNode(k);t=document.createElementNS(n,p,k.is&&k),u&&(m.__m&&m.__m(e,o),u=!1),o=null}if(p==null)b===k||u&&t.data==k||(t.data=k);else{if(o=p=="textarea"&&k.defaultValue!=null?null:o&&ue.call(t.childNodes),!u&&o!=null)for(b={},l=0;l<t.attributes.length;l++)b[(f=t.attributes[l]).name]=f.value;for(l in b)f=b[l],l=="dangerouslySetInnerHTML"?g=f:l=="children"||l in k||l=="value"&&"defaultValue"in k||l=="checked"&&"defaultChecked"in k||re(t,l,null,f,n);for(l in k)f=k[l],l=="children"?i=f:l=="dangerouslySetInnerHTML"?h=f:l=="value"?v=f:l=="checked"?T=f:u&&typeof f!="function"||b[l]===f||re(t,l,f,b[l],n);if(h)u||g&&(h.__html==g.__html||h.__html==t.innerHTML)||(t.innerHTML=h.__html),e.__k=[];else if(g&&(t.innerHTML=""),Je(e.type=="template"?t.content:t,_e(i)?i:[i],e,a,r,p=="foreignObject"?"http://www.w3.org/1999/xhtml":n,o,c,o?o[0]:a.__k&&V(a,0),u,d),o!=null)for(l=o.length;l--;)xe(o[l]);u&&p!="textarea"||(l="value",p=="progress"&&v==null?t.removeAttribute("value"):v!=null&&(v!==t[l]||p=="progress"&&!v||p=="option"&&v!=b[l])&&re(t,l,v,b[l],n),l="checked",T!=null&&T!=t[l]&&re(t,l,T,b[l],n))}return t}function Te(t,e,a){try{if(typeof t=="function"){var r=typeof t.__u=="function";r&&t.__u(),r&&e==null||(t.__u=t(e))}else t.current=e}catch(n){m.__e(n,a)}}function et(t,e,a){var r,n;if(m.unmount&&m.unmount(t),(r=t.ref)&&(r.current&&r.current!=t.__e||Te(r,null,e)),(r=t.__c)!=null){if(r.componentWillUnmount)try{r.componentWillUnmount()}catch(o){m.__e(o,e)}r.base=r.__P=r.__n=null}if(r=t.__k)for(n=0;n<r.length;n++)r[n]&&et(r[n],e,a||typeof t.type!="function");a||xe(t.__e),t.__c=t.__=t.__e=void 0}function Ot(t,e,a){return this.constructor(t,a)}function tt(t,e,a){var r,n,o,c;e==document&&(e=document.documentElement),m.__&&m.__(t,e),n=(r=typeof a=="function")?null:a&&a.__k||e.__k,o=[],c=[],Ae(e,t=(!r&&a||e).__k=Ft(M,null,[t]),n||se,se,e.namespaceURI,!r&&a?[a]:n?null:e.firstChild?ue.call(e.childNodes):null,o,!r&&a?a:n?n.__e:e.firstChild,r,c),Qe(o,t,c),t.props.children=null}ue=le.slice,m={__e:function(t,e,a,r){for(var n,o,c;e=e.__;)if((n=e.__c)&&!n.__)try{if((o=n.constructor)&&o.getDerivedStateFromError!=null&&(n.setState(o.getDerivedStateFromError(t)),c=n.__d),n.componentDidCatch!=null&&(n.componentDidCatch(t,r||{}),c=n.__d),c)return n.__E=n}catch(u){t=u}throw t}},Be=0,Lt=function(t){return t!=null&&t.constructor===void 0},ie.prototype.setState=function(t,e){var a;a=this.__s!=null&&this.__s!=this.state?this.__s:this.__s=W({},this.state),typeof t=="function"&&(t=t(W({},a),this.props)),t&&W(a,t),t!=null&&this.__v&&(e&&this._sb.push(e),Oe(this))},ie.prototype.forceUpdate=function(t){this.__v&&(this.__e=!0,t&&this.__h.push(t),Oe(this))},ie.prototype.render=M,B=[],qe=typeof Promise=="function"?Promise.prototype.then.bind(Promise.resolve()):setTimeout,Ve=function(t,e){return t.__v.__b-e.__v.__b},ce.__r=0,ve=Math.random().toString(8),ne="__d"+ve,Z="__a"+ve,Ke=/(PointerCapture)$|Capture$/i,we=0,ke=ze(!1),ye=ze(!0),Dt=0;var ee,x,Se,at,he=0,ut=[],A=m,rt=A.__b,nt=A.__r,ot=A.diffed,it=A.__c,st=A.unmount,lt=A.__;function Ee(t,e){A.__h&&A.__h(x,t,he||e),he=0;var a=x.__H||(x.__H={__:[],__h:[]});return t>=a.__.length&&a.__.push({}),a.__[t]}function U(t){return he=1,jt(dt,t)}function jt(t,e,a){var r=Ee(ee++,2);if(r.t=t,!r.__c&&(r.__=[a?a(e):dt(void 0,e),function(u){var d=r.__N?r.__N[0]:r.__[0],l=r.t(d,u);d!==l&&(r.__N=[l,r.__[1]],r.__c.setState({}))}],r.__c=x,!x.__f)){var n=function(u,d,l){if(!r.__c.__H)return!0;var h=!1,g=r.__c.props!==u;if(r.__c.__H.__.some(function(f){if(f.__N){h=!0;var v=f.__[0];f.__=f.__N,f.__N=void 0,v!==f.__[0]&&(g=!0)}}),o){var i=o.call(this,u,d,l);return h?i||g:i}return!h||g};x.__f=!0;var o=x.shouldComponentUpdate,c=x.componentWillUpdate;x.componentWillUpdate=function(u,d,l){if(this.__e){var h=o;o=void 0,n(u,d,l),o=h}c&&c.call(this,u,d,l)},x.shouldComponentUpdate=n}return r.__N||r.__}function $(t,e){var a=Ee(ee++,3);!A.__s&&_t(a.__H,e)&&(a.__=t,a.u=e,x.__H.__h.push(a))}function C(t){return he=5,zt(function(){return{current:t}},[])}function zt(t,e){var a=Ee(ee++,7);return _t(a.__H,e)&&(a.__=t(),a.__H=e,a.__h=t),a.__}function Bt(){for(var t;t=ut.shift();){var e=t.__H;if(t.__P&&e)try{e.__h.some(de),e.__h.some(Ce),e.__h=[]}catch(a){e.__h=[],A.__e(a,t.__v)}}}A.__b=function(t){x=null,rt&&rt(t)},A.__=function(t,e){t&&e.__k&&e.__k.__m&&(t.__m=e.__k.__m),lt&&lt(t,e)},A.__r=function(t){nt&&nt(t),ee=0;var e=(x=t.__c).__H;e&&(Se===x?(e.__h=[],x.__h=[],e.__.some(function(a){a.__N&&(a.__=a.__N),a.u=a.__N=void 0})):(e.__h.some(de),e.__h.some(Ce),e.__h=[],ee=0)),Se=x},A.diffed=function(t){ot&&ot(t);var e=t.__c;e&&e.__H&&(e.__H.__h.length&&(ut.push(e)!==1&&at===A.requestAnimationFrame||((at=A.requestAnimationFrame)||qt)(Bt)),e.__H.__.some(function(a){a.u&&(a.__H=a.u,a.u=void 0)})),Se=x=null},A.__c=function(t,e){e.some(function(a){try{a.__h.some(de),a.__h=a.__h.filter(function(r){return!r.__||Ce(r)})}catch(r){e.some(function(n){n.__h&&(n.__h=[])}),e=[],A.__e(r,a.__v)}}),it&&it(t,e)},A.unmount=function(t){st&&st(t);var e,a=t.__c;a&&a.__H&&(a.__H.__.some(function(r){try{de(r)}catch(n){e=n}}),a.__H=void 0,e&&A.__e(e,a.__v))};var ct=typeof requestAnimationFrame=="function";function qt(t){var e,a=function(){clearTimeout(r),ct&&cancelAnimationFrame(e),setTimeout(t)},r=setTimeout(a,35);ct&&(e=requestAnimationFrame(a))}function de(t){var e=x,a=t.__c;typeof a=="function"&&(t.__c=void 0,a()),x=e}function Ce(t){var e=x;t.__c=t.__(),x=e}function _t(t,e){return!t||t.length!==e.length||e.some(function(a,r){return a!==t[r]})}function dt(t,e){return typeof e=="function"?e(t):e}var Vt=0;function s(t,e,a,r,n,o){e||(e={});var c,u,d=e;if("ref"in d)for(u in d={},e)u=="ref"?c=e[u]:d[u]=e[u];var l={type:t,props:d,key:a,ref:c,__k:null,__:null,__b:0,__e:null,__c:null,constructor:void 0,__v:--Vt,__i:-1,__u:0,__source:n,__self:o};if(typeof t=="function"&&(c=t.defaultProps))for(u in c)d[u]===void 0&&(d[u]=c[u]);return m.vnode&&m.vnode(l),l}var q={xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round","aria-hidden":"true"},ht=()=>s("svg",{...q,width:"16",height:"16",children:[s("path",{d:"m5 12 7-7 7 7"}),s("path",{d:"M12 19V5"})]}),ft=()=>s("svg",{...q,width:"14",height:"14",children:[s("path",{d:"M13 21h8"}),s("path",{d:"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"})]}),pt=()=>s("svg",{...q,width:"14",height:"14",children:[s("path",{d:"M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"}),s("path",{d:"M20 2v4"}),s("path",{d:"M22 4h-4"}),s("circle",{cx:"4",cy:"20",r:"2"})]}),mt=()=>s("svg",{...q,width:"12",height:"12",children:s("rect",{width:"18",height:"18",x:"3",y:"3",rx:"2"})}),gt=()=>s("svg",{...q,width:"14",height:"14",children:s("path",{d:"M20 6 9 17l-5-5"})}),bt=()=>s("svg",{...q,width:"14",height:"14",children:[s("rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2"}),s("path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"})]}),fe=()=>s("svg",{...q,width:"16",height:"16",children:[s("path",{d:"M18 6 6 18"}),s("path",{d:"m6 6 12 12"})]}),pe=()=>s("svg",{...q,width:"16",height:"16",children:[s("path",{d:"M13.234 20.252 21 12.3"}),s("path",{d:"m16 6-8.414 8.586a2 2 0 0 0 0 2.828 2 2 0 0 0 2.828 0l8.414-8.586a4 4 0 0 0 0-5.656 4 4 0 0 0-5.656 0l-8.415 8.585a6 6 0 1 0 8.486 8.486"})]});var Kt=/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)\s]+\))/g;function Pe(t,e){return t.startsWith("/")?`${e.replace(/\/$/,"")}${t}`:t.startsWith("https://")||t.startsWith("http://")?t:null}function me(t,e){return t.split(Kt).map((r,n)=>{if(r.startsWith("`")&&r.endsWith("`")&&r.length>2)return s("code",{children:r.slice(1,-1)},n);if(r.startsWith("**")&&r.endsWith("**")&&r.length>4)return s("b",{children:me(r.slice(2,-2),e)},n);if(r.startsWith("*")&&r.endsWith("*")&&r.length>2)return s("em",{children:me(r.slice(1,-1),e)},n);let o=/^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(r);if(o){let[,c,u]=o,d=Pe(u,e);return d?s("a",{href:d,target:"_blank",rel:"noopener noreferrer",children:c},n):r}return r})}function He({text:t,label:e,className:a}){let[r,n]=U(!1);return $(()=>{if(!r)return;let o=window.setTimeout(()=>n(!1),1600);return()=>window.clearTimeout(o)},[r]),typeof navigator>"u"||!navigator.clipboard?null:s("button",{type:"button",class:a,"aria-label":r?"Copied":e,onClick:()=>{navigator.clipboard.writeText(t).then(()=>n(!0),()=>{})},children:r?s(gt,{}):s(bt,{})})}var Gt=/^\s*[-*]\s+(.*)$/,Jt=/^\s*\d+[.)]\s+(.*)$/;function Xt(t){let e=[],a=null,r=[],n=null,o=()=>{r.length>0&&(e.push({kind:"p",text:r.join(" ")}),r=[])},c=()=>{a&&(e.push(a),a=null)};for(let u of t.split(`
`)){if(u.trimStart().startsWith("```")){n?(e.push({kind:"code",text:n.join(`
`)}),n=null):(o(),c(),n=[]);continue}if(n){n.push(u);continue}let d=Gt.exec(u),l=d?null:Jt.exec(u);if(d||l){o();let h=d?"ul":"ol";(!a||a.kind!==h)&&(c(),a={kind:h,items:[]}),a.items.push((d??l)[1]);continue}if(u.trim()===""){o(),c();continue}if(a&&/^\s{2,}/.test(u)){a.items[a.items.length-1]+=` ${u.trim()}`;continue}c(),r.push(u.replace(/^#{1,4}\s+/,"").trim())}return n&&e.push({kind:"code",text:n.join(`
`)}),o(),c(),e}function Me({text:t,docsOrigin:e}){return s(M,{children:Xt(t).map((a,r)=>{if(a.kind==="p")return s("p",{children:me(a.text,e)},r);if(a.kind==="code")return s("div",{class:"ask-ai__code",children:[s("pre",{children:s("code",{children:a.text})}),s(He,{text:a.text,label:"Copy code",className:"ask-ai__code-copy"})]},r);let n=a.kind;return s(n,{children:a.items.map((o,c)=>s("li",{children:me(o,e)},c))},r)})})}var Ne="The assistant is unreachable right now. Try again shortly.";async function vt(t,e){let a=t.getReader(),r=new TextDecoder,n="",o=c=>{let u="message",d=[];for(let h of c.split(`
`))h.startsWith("event:")?u=h.slice(6).trim():h.startsWith("data:")&&d.push(h.slice(5).trim());if(d.length===0)return;let l;try{l=JSON.parse(d.join(`
`))}catch{return}switch(u){case"text":e.onText(l.delta??"");break;case"tool":{let h=l;e.onTool(h.detail||h.name);break}case"sources":e.onSources(l);break;case"error":e.onError(l.message||Ne);break;default:break}};for(;;){let{done:c,value:u}=await a.read();if(c)break;n+=r.decode(u,{stream:!0});let d;for(;(d=n.indexOf(`

`))!==-1;){let l=n.slice(0,d);n=n.slice(d+2),o(l)}}}function kt(t,e,a,r){return t<=0||!a&&e<550&&t<220?0:r?t:Math.min(t,Math.max(2,Math.ceil(t/6)))}var yt=`/* ---------- theming ---------- */

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
  width: min(26rem, 100vw);
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
`;var Qt=".json,.txt,.log,.csv,.xml,.yaml,.yml,.md,.har,.pdf,.png,.jpg,.jpeg,.webp",Ie=2e4,Zt=256*1024,ea=8*1024*1024,X=(()=>{let t=document.currentScript?.src;try{return new URL("vendor/",t??"/agent/").href}catch{return"/agent/vendor/"}})(),wt=new Map;function ta(t){let e=wt.get(t);if(e)return e;let a=new Promise((r,n)=>{let o=document.createElement("script");o.src=t,o.onload=()=>r(),o.onerror=()=>n(new Error(`could not load ${t}`)),document.head.append(o)});return wt.set(t,a),a}async function aa(t){let e=await import(`${X}pdf.min.mjs`);e.GlobalWorkerOptions.workerSrc=`${X}pdf.worker.min.mjs`;let a=e.getDocument({data:await t.arrayBuffer()}),r=await a.promise,n=[];for(let o=1;o<=r.numPages;o+=1){let c=await(await r.getPage(o)).getTextContent();if(n.push(c.items.map(u=>u.str??"").join(" ").replace(/[ \t]+/g," ").trim()),n.join(`

`).length>Ie)break}return await r.cleanup?.(),await a.destroy(),n.join(`

`).trim()}async function ra(t,e){e("Loading the reader, once per browser."),await ta(`${X}tesseract.min.js`);let a=window.Tesseract;e("Reading the text out of that image.");let r=await a.createWorker("eng",1,{workerPath:`${X}worker.min.js`,corePath:X,langPath:`${X}lang`,cacheMethod:"none"});try{let{data:n}=await r.recognize(t);return(n.text??"").replace(/[ \t]+/g," ").trim()}finally{await r.terminate()}}var xt=24e3,At=`

[This page was cut here to fit. Say so if the answer needs the rest of it.]`;function na(t){return t.length<=xt?t:t.slice(0,xt-At.length)+At}var oa="This panel is a mock. No assistant is connected here yet, so nothing in it can answer that. The support page lists the channels a human reads.",Le={from:"assistant",text:"This is a preview of the assistant, not a working one. Ask anything to see the shape of the answer; the reply below is fixed."},De={from:"assistant",text:"What are you building? Ask me anything about ABDM."},ia=["What format does the TIMESTAMP header need?","What does ABDM-1016 mean and how do I fix it?","How do I create an ABHA with an Aadhaar OTP?","What is a care context?"];function sa(t){let e=t.split(`
`).map(a=>a.trim()).filter(Boolean);return e.length?e.slice(0,4):ia}function Tt(t,e){t(a=>{let r=a[a.length-1];return[...a.slice(0,-1),{...r,text:r.text+e}]})}function la(t,e){t(a=>{let r=a[a.length-1];return[...a.slice(0,-1),{...r,sources:e}]})}function ca({apiBase:t,docsOrigin:e,open:a,onClose:r,page:n,onDetach:o,question:c,starters:u,supportUrl:d}){let[l,h]=U([t?De:Le]),[g,i]=U(""),[f,v]=U(null),[T,b]=U(null),[k,p]=U(null),[S,L]=U("idle"),[D,I]=U(null),K=C(null),O=C(null),j=C(null),E=C(null),P=C(null),Y=S!=="idle",te=n!==null&&n.markdown!=="",F=C(""),G=C(!1),J=C(!0),Re=C(0),Ue=C(!1),R=C(0),Q=C(null),$e=()=>{R.current=requestAnimationFrame($e);let _=F.current.length;if(_===0){if(!J.current)return;cancelAnimationFrame(R.current),R.current=0,G.current=!1,Q.current&&(la(h,Q.current),Q.current=null),L("idle");return}let y=kt(_,performance.now()-Re.current,G.current,Ue.current);y!==0&&(G.current||(G.current=!0,L("streaming")),Tt(h,F.current.slice(0,y)),F.current=F.current.slice(y))},ae=_=>{F.current+=_},St=_=>{Q.current=_},Ct=()=>{R.current&&cancelAnimationFrame(R.current),R.current=0,G.current=!1,F.current="",Q.current=null,J.current=!0};$(()=>{h(_=>_.length===1?[t?De:Le]:_)},[t]),$(()=>{a&&c&&i(_=>_||c)},[a,c]),$(()=>{let _=K.current;_&&(a&&!_.open&&(_.showModal(),j.current?.focus()),!a&&_.open&&_.close())},[a]),$(()=>{if(!a)return;let _=y=>{y.key==="Escape"&&(y.preventDefault(),y.stopPropagation(),r())};return document.addEventListener("keydown",_,!0),()=>document.removeEventListener("keydown",_,!0)},[a,r]);let ge=C(!0),Et=()=>{let _=O.current;_&&(ge.current=_.scrollHeight-_.scrollTop-_.clientHeight<40)};$(()=>{let _=O.current;_&&ge.current&&(_.scrollTop=_.scrollHeight)},[l,S,D]),$(()=>{let _=j.current;if(!_)return;_.style.height="auto";let y=Math.min(_.scrollHeight,160);_.style.height=`${y}px`,_.style.overflowY=_.scrollHeight>y?"auto":"hidden"},[g]),$(()=>()=>{P.current?.abort(),R.current&&cancelAnimationFrame(R.current)},[]);let Pt=()=>{P.current?.abort(),Ct(),ge.current=!0,h([t?De:Le]),i(""),v(null),b(null),p(null),I(null),L("idle")},Ht=async _=>{if(!_)return;b(null);let y=_.name.toLowerCase(),H=_.type==="application/pdf"||y.endsWith(".pdf"),z=_.type.startsWith("image/"),N=H||z?ea:Zt;if(_.size>N){b("That file is too large. Attach the failing part of it.");return}let w;try{if(H){if(p("Reading the text in that PDF."),w=await aa(_),!w){p(null),b("That PDF has no text in it, only pictures of text. Attach a screenshot of the part you mean and it will be read.");return}}else z?w=await ra(_,p):w=await _.text()}catch{p(null),b("That file could not be read.");return}finally{p(null)}if(!H&&!z&&w.includes("\uFFFD")){b("That looks like a binary file. Text and JSON only.");return}if(w.length>Ie){b(`That file is ${w.length.toLocaleString()} characters. Attach at most ${Ie.toLocaleString()}.`);return}if(!w.trim()){b(z?"No text could be read out of that image.":"That file is empty.");return}v({name:_.name,text:w,kind:H?"pdf":z?"image":void 0}),j.current?.focus()},Mt=()=>{P.current?.abort(),F.current&&Tt(h,F.current),F.current="",J.current=!0},be=async _=>{if(!_||Y)return;let y=f;i(""),v(null),b(null);let H=[...l.slice(1),{from:"you",text:_,file:y??void 0}];if(h(N=>[...N,{from:"you",text:_,file:y??void 0},{from:"assistant",text:""}]),F.current="",G.current=!1,J.current=!1,Re.current=performance.now(),Ue.current=window.matchMedia("(prefers-reduced-motion: reduce)").matches,L("thinking"),I("Thinking"),R.current||(R.current=requestAnimationFrame($e)),!t){ae(oa),J.current=!0;return}let z=new AbortController;P.current=z;try{let N=await fetch(`${t.replace(/\/$/,"")}/api/chat`,{method:"POST",signal:z.signal,headers:{"Content-Type":"application/json"},body:JSON.stringify({turns:H.slice(-9).map(w=>({role:w.from==="you"?"user":"assistant",text:w.text,...w.file?{attachment:{name:w.file.name,text:w.file.text,...w.file.kind?{kind:w.file.kind}:{}}}:{}})),...te?{page:{title:n.title,url:n.url,markdown:na(n.markdown)}}:{}})});if(!N.ok||!N.body)throw new Error(`status ${N.status}`);await vt(N.body,{onText:ae,onTool:w=>I(w),onSources:w=>St(w),onError:ae})}catch(N){N instanceof DOMException&&N.name==="AbortError"||ae(Ne)}finally{P.current=null,J.current=!0,I(null)}},Nt=S==="thinking";return s("dialog",{class:"ask-ai",ref:K,"aria-label":"Ask AI",onClose:r,onCancel:r,onClick:_=>{_.target===K.current&&r()},children:[s("div",{class:"ask-ai__head",children:[s("h2",{class:"ask-ai__title",children:["Ask AI",!t&&s("span",{class:"ask-ai__badge",children:"Mock"}),s("span",{class:"ask-ai__grow"}),l.length>1&&s("button",{type:"button",class:"ask-ai__reset",onClick:Pt,"aria-label":"Start a new conversation",children:[s(ft,{}),"New"]}),s("button",{type:"button",class:"ask-ai__close",onClick:r,"aria-label":"Close",children:s(fe,{})})]}),!t&&s("p",{class:"ask-ai__blurb",children:["Not connected to anything. For a real answer, use"," ",s("a",{href:d,target:"_blank",rel:"noopener noreferrer",children:"support"}),"."]})]}),s("div",{class:"ask-ai__thread",ref:O,role:"log","aria-live":"polite","aria-busy":Y,onScroll:Et,children:[l.map((_,y)=>_.from==="assistant"&&_.text===""?null:s("div",{class:`ask-ai__turn ask-ai__turn--${_.from}${S==="streaming"&&y===l.length-1?" ask-ai__turn--streaming":""}`,children:[_.from==="assistant"?s(Me,{text:_.text,docsOrigin:e}):_.text,_.file&&s("span",{class:"ask-ai__turn-file",children:[s(pe,{}),_.file.name]}),_.from==="assistant"&&y>0&&_.text!==""&&!(Y&&y===l.length-1)&&s(He,{text:_.text,label:"Copy answer",className:"ask-ai__turn-copy"}),_.sources&&_.sources.length>0&&s("div",{class:"ask-ai__sources",children:[s("span",{class:"ask-ai__sources-label",children:"Sources"}),_.sources.map(H=>s("a",{href:Pe(H.url,e)??H.url,target:"_blank",rel:"noopener noreferrer",class:"ask-ai__source-chip",children:[H.title,H.status!=="verified"?" (spec)":""]},H.id))]})]},y)),Nt&&s("p",{class:"ask-ai__activity",children:[s("span",{class:"ask-ai__pulse","aria-hidden":"true"}),D??"Thinking"]}),l.length===1&&s("div",{class:"ask-ai__starters",children:u.map(_=>s("button",{type:"button",class:"ask-ai__starter",onClick:()=>{be(_)},children:_},_))})]}),(f||T||k)&&s("div",{class:"ask-ai__attachment",children:k?s(M,{children:[s("span",{class:"ask-ai__pulse","aria-hidden":"true"}),s("span",{class:"ask-ai__attachment-note",children:k})]}):f?s(M,{children:[s(pe,{}),s("span",{class:"ask-ai__attachment-name",children:f.name}),s("span",{class:"ask-ai__attachment-size",children:f.kind==="image"?`${f.text.length.toLocaleString()} characters read`:`${f.text.length.toLocaleString()} characters`}),s("button",{type:"button",class:"ask-ai__attachment-remove","aria-label":`Remove ${f.name}`,onClick:()=>v(null),children:s(fe,{})})]}):s("span",{class:"ask-ai__attachment-error",children:T})}),f?.kind&&!k&&s("p",{class:"ask-ai__attachment-note",children:"Read here in your browser; the file itself is not sent. Names in it are yours to check before you send."}),s("form",{class:"ask-ai__composer",onSubmit:_=>{_.preventDefault(),be(g.trim())},children:[n&&s("div",{class:`ask-ai__attached${te?"":" ask-ai__attached--failed"}`,children:[s("span",{class:"ask-ai__attached-text",children:te?`Using this page: ${n.title}`:`Could not attach ${n.title}. The answer will not use it.`}),s("button",{type:"button",class:"ask-ai__attached-remove",onClick:o,"aria-label":te?`Do not use ${n.title}`:`Dismiss the attachment notice for ${n.title}`,children:s(fe,{})})]}),s("input",{ref:E,type:"file",class:"ask-ai__picker",accept:Qt,onChange:_=>{let y=_.currentTarget;Ht(y.files?.[0]),y.value=""}}),s("button",{type:"button",class:"ask-ai__attach","aria-label":"Attach a text or JSON file",title:"Attach a text or JSON file",disabled:Y,onClick:()=>E.current?.click(),children:s(pe,{})}),s("textarea",{ref:j,class:"ask-ai__input",value:g,rows:1,onInput:_=>i(_.currentTarget.value),onKeyDown:_=>{_.key==="Enter"&&!_.shiftKey&&(_.preventDefault(),be(g.trim()))},placeholder:"Ask about ABDM","aria-label":"Ask the assistant"}),Y?s("button",{class:"ask-ai__send ask-ai__send--stop",type:"button","aria-label":"Stop",onClick:Mt,children:s(mt,{})}):s("button",{class:"ask-ai__send",type:"submit","aria-label":"Send",disabled:g.trim()==="",children:s(ht,{})})]})]})}function ua({host:t,apiBase:e,docsOrigin:a,supportUrl:r,launcher:n,open:o,page:c,onDetach:u,question:d,starters:l}){return s(M,{children:[n&&s("button",{type:"button",class:"ask-ai__launcher","aria-label":"Ask AI",onClick:()=>{t.removeAttribute("open"),t.setAttribute("open","")},children:[s(pt,{}),s("span",{class:"ask-ai__launcher-label",children:"Ask AI"})]}),s(ca,{apiBase:e,docsOrigin:a,supportUrl:r,open:o,question:d,starters:l,onClose:()=>{t.removeAttribute("open"),t.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))},page:c,onDetach:u})]})}function _a(){for(let t=document.body;t;t=t.parentElement){let e=/^rgba?\(([^)]+)\)/.exec(getComputedStyle(t).backgroundColor);if(!e)continue;let[a,r,n,o=1]=e[1].split(",").map(Number);if(o)return .2126*a+.7152*r+.0722*n<128?"dark":"light"}return window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}var Fe=class extends HTMLElement{static observedAttributes=["api-base","docs-origin","support-url","launcher","open","question","starters","ground"];root=null;page=null;connectedCallback(){if(!this.root){this.root=this.attachShadow({mode:"open"});let e=document.createElement("style");e.textContent=yt,this.root.append(e),this.hasAttribute("ground")||this.setAttribute("ground",_a())}this.paint()}attributeChangedCallback(){this.root&&this.paint()}show(){this.setAttribute("open","")}hide(){this.removeAttribute("open")}attachPage(e){this.page=e,this.root&&this.paint()}paint(){let e=this.getAttribute("docs-origin")??window.location.origin;tt(s(ua,{host:this,apiBase:this.getAttribute("api-base")??"",docsOrigin:e,supportUrl:this.getAttribute("support-url")??`${e.replace(/\/$/,"")}/docs/support`,launcher:this.getAttribute("launcher")!=="none",open:this.hasAttribute("open"),page:this.page,onDetach:()=>this.attachPage(null),question:this.getAttribute("question")??"",starters:sa(this.getAttribute("starters")??"")}),this.root)}};typeof customElements<"u"&&!customElements.get("abdm-support-agent")&&customElements.define("abdm-support-agent",Fe);})();
