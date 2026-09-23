(()=>{var et,k,wr,Bn,oe,br,Sr,Er,wt,Ye,Ce,Ar,At,St,Et,Nn,Ke={},Ze=[],$n=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i,Oe=Array.isArray;function re(e,t){for(var r in t)e[r]=t[r];return e}function Rt(e){e&&e.parentNode&&e.parentNode.removeChild(e)}function xe(e,t,r){var a,n,i,s={};for(i in t)i=="key"?a=t[i]:i=="ref"?n=t[i]:s[i]=t[i];if(arguments.length>2&&(s.children=arguments.length>3?et.call(arguments,2):r),typeof e=="function"&&e.defaultProps!=null)for(i in e.defaultProps)s[i]===void 0&&(s[i]=e.defaultProps[i]);return Je(e,s,a,n,null)}function Je(e,t,r,a,n){var i={type:e,props:t,key:r,ref:a,__k:null,__:null,__b:0,__e:null,__c:null,constructor:void 0,__v:n??++wr,__i:-1,__u:0};return n==null&&k.vnode!=null&&k.vnode(i),i}function $(e){return e.children}function X(e,t){this.props=e,this.context=t}function pe(e,t){if(t==null)return e.__?pe(e.__,e.__i+1):null;for(var r;t<e.__k.length;t++)if((r=e.__k[t])!=null&&r.__e!=null)return r.__e;return typeof e.type=="function"?pe(e):null}function Hn(e){if(e.__P&&e.__d){var t=e.__v,r=t.__e,a=[],n=[],i=re({},t);i.__v=t.__v+1,k.vnode&&k.vnode(i),Mt(e.__P,i,t,e.__n,e.__P.namespaceURI,32&t.__u?[r]:null,a,r??pe(t),!!(32&t.__u),n),i.__v=t.__v,i.__.__k[i.__i]=i,Cr(a,i,n),t.__e=t.__=null,i.__e!=r&&Rr(i)}}function Rr(e){if((e=e.__)!=null&&e.__c!=null)return e.__e=e.__c.base=null,e.__k.some(function(t){if(t!=null&&t.__e!=null)return e.__e=e.__c.base=t.__e}),Rr(e)}function yr(e){(!e.__d&&(e.__d=!0)&&oe.push(e)&&!Qe.__r++||br!=k.debounceRendering)&&((br=k.debounceRendering)||Sr)(Qe)}function Qe(){try{for(var e,t=1;oe.length;)oe.length>t&&oe.sort(Er),e=oe.shift(),t=oe.length,Hn(e)}finally{oe.length=Qe.__r=0}}function Mr(e,t,r,a,n,i,s,l,d,c,f){var _,u,m,h,b,g,y=a&&a.__k||Ze,x=t.length;for(d=zn(r,t,y,d,x),_=0;_<x;_++)(m=r.__k[_])!=null&&(u=m.__i!=-1&&y[m.__i]||Ke,m.__i=_,g=Mt(e,m,u,n,i,s,l,d,c,f),h=m.__e,m.ref&&u.ref!=m.ref&&(u.ref&&Tt(u.ref,null,m),f.push(m.ref,m.__c||h,m)),b==null&&h!=null&&(b=h),4&m.__u?(d=Tr(m,d,e),u.__e&&(u.__e=null)):typeof m.type=="function"&&g!==void 0?d=g:h&&(d=h.nextSibling),m.__u&=-7);return r.__e=b,d}function zn(e,t,r,a,n){var i,s,l,d,c,f=r.length,_=f,u=0;for(e.__k=new Array(n),i=0;i<n;i++)(s=t[i])!=null&&typeof s!="boolean"&&typeof s!="function"?(typeof s=="string"||typeof s=="number"||typeof s=="bigint"||s.constructor==String?s=e.__k[i]=Je(null,s,null,null,null):Oe(s)?s=e.__k[i]=Je($,{children:s},null,null,null):s.constructor===void 0&&s.__b>0?s=e.__k[i]=Je(s.type,s.props,s.key,s.ref?s.ref:null,s.__v):e.__k[i]=s,d=i+u,s.__=e,s.__b=e.__b+1,l=null,(c=s.__i=Vn(s,r,d,_))!=-1&&(_--,(l=r[c])&&(l.__u|=2)),l==null||l.__v==null?(c==-1&&(n>f?u--:n<f&&u++),typeof s.type!="function"&&(s.__u|=4)):c!=d&&(c==d-1?u--:c==d+1?u++:(c>d?u--:u++,s.__u|=4))):e.__k[i]=null;if(_)for(i=0;i<f;i++)(l=r[i])!=null&&(2&l.__u)==0&&(l.__e==a&&(a=pe(l)),Ir(l,l));return a}function Tr(e,t,r){var a,n;if(typeof e.type=="function"){for(a=e.__k,n=0;a&&n<a.length;n++)a[n]&&(a[n].__=e,t=Tr(a[n],t,r));return t}e.__e!=t&&(t&&e.type&&!t.parentNode&&(t=pe(e)),t=r.insertBefore(e.__e,t||null));do t=t&&t.nextSibling;while(t!=null&&t.nodeType==8);return t}function Ie(e,t){return t=t||[],e==null||typeof e=="boolean"||(Oe(e)?e.some(function(r){Ie(r,t)}):t.push(e)),t}function Vn(e,t,r,a){var n,i,s,l=e.key,d=e.type,c=t[r],f=c!=null&&(2&c.__u)==0;if(c===null&&l==null||f&&l==c.key&&d==c.type)return r;if(a>(f?1:0)){for(n=r-1,i=r+1;n>=0||i<t.length;)if((c=t[s=n>=0?n--:i++])!=null&&(2&c.__u)==0&&l==c.key&&d==c.type)return s}return-1}function xr(e,t,r){t[0]=="-"?e.setProperty(t,r??""):e[t]=r==null?"":typeof r!="number"||$n.test(t)?r:r+"px"}function qe(e,t,r,a,n){var i,s;e:if(t=="style")if(typeof r=="string")e.style.cssText=r;else{if(typeof a=="string"&&(e.style.cssText=a=""),a)for(t in a)r&&t in r||xr(e.style,t,"");if(r)for(t in r)a&&r[t]==a[t]||xr(e.style,t,r[t])}else if(t[0]=="o"&&t[1]=="n")i=t!=(t=t.replace(Ar,"$1")),s=t.toLowerCase(),t=s in e||t=="onFocusOut"||t=="onFocusIn"?s.slice(2):t.slice(2),e.l||(e.l={}),e.l[t+i]=r,r?a?r[Ce]=a[Ce]:(r[Ce]=At,e.addEventListener(t,i?Et:St,i)):e.removeEventListener(t,i?Et:St,i);else{if(n=="http://www.w3.org/2000/svg")t=t.replace(/xlink(H|:h)/,"h").replace(/sName$/,"s");else if(t!="width"&&t!="height"&&t!="href"&&t!="list"&&t!="form"&&t!="tabIndex"&&t!="download"&&t!="rowSpan"&&t!="colSpan"&&t!="role"&&t!="popover"&&t in e)try{e[t]=r??"";break e}catch{}typeof r=="function"||(r==null||r===!1&&t[4]!="-"?e.removeAttribute(t):e.setAttribute(t,t=="popover"&&r==1?"":r))}}function kr(e){return function(t){if(this.l){var r=this.l[t.type+e];if(t[Ye]==null)t[Ye]=At++;else if(t[Ye]<r[Ce])return;return r(k.event?k.event(t):t)}}}function Mt(e,t,r,a,n,i,s,l,d,c){var f,_,u,m,h,b,g,y,x,M,F,T,O,P,D,V,U=t.type;if(t.constructor!==void 0)return null;128&r.__u&&(d=!!(32&r.__u),i=[l=t.__e=r.__e]),(f=k.__b)&&f(t);e:if(typeof U=="function"){_=s.length;try{if(x=t.props,M=U.prototype&&U.prototype.render,F=(f=U.contextType)&&a[f.__c],T=f?F?F.props.value:f.__:a,r.__c?y=(u=t.__c=r.__c).__=u.__E:(M?t.__c=u=new U(x,T):(t.__c=u=new X(x,T),u.constructor=U,u.render=Gn),F&&F.sub(u),u.state||(u.state={}),u.__n=a,m=u.__d=!0,u.__h=[],u._sb=[]),M&&u.__s==null&&(u.__s=u.state),M&&U.getDerivedStateFromProps!=null&&(u.__s==u.state&&(u.__s=re({},u.__s)),re(u.__s,U.getDerivedStateFromProps(x,u.__s))),h=u.props,b=u.state,u.__v=t,m)M&&U.getDerivedStateFromProps==null&&u.componentWillMount!=null&&u.componentWillMount(),M&&u.componentDidMount!=null&&u.__h.push(u.componentDidMount);else{if(M&&U.getDerivedStateFromProps==null&&x!==h&&u.componentWillReceiveProps!=null&&u.componentWillReceiveProps(x,T),t.__v==r.__v||!u.__e&&u.shouldComponentUpdate!=null&&u.shouldComponentUpdate(x,u.__s,T)===!1){t.__v!=r.__v&&(u.props=x,u.state=u.__s,u.__d=!1),t.__e=r.__e,t.__k=r.__k,t.__k.some(function(z){z&&(z.__=t)}),Ze.push.apply(u.__h,u._sb),u._sb=[],u.__h.length&&s.push(u),l=pe(r);break e}u.componentWillUpdate!=null&&u.componentWillUpdate(x,u.__s,T),M&&u.componentDidUpdate!=null&&u.__h.push(function(){u.componentDidUpdate(h,b,g)})}if(u.context=T,u.props=x,u.__P=e,u.__e=!1,O=k.__r,P=0,M)u.state=u.__s,u.__d=!1,O&&O(t),f=u.render(u.props,u.state,u.context),Ze.push.apply(u.__h,u._sb),u._sb=[];else do u.__d=!1,O&&O(t),f=u.render(u.props,u.state,u.context),u.state=u.__s;while(u.__d&&++P<25);u.state=u.__s,u.getChildContext!=null&&(a=re(re({},a),u.getChildContext())),M&&!m&&u.getSnapshotBeforeUpdate!=null&&(g=u.getSnapshotBeforeUpdate(h,b)),D=f!=null&&f.type===$&&f.key==null?Or(f.props.children):f,l=Mr(e,Oe(D)?D:[D],t,r,a,n,i,s,l,d,c),u.base=t.__e,t.__u&=-161,u.__h.length&&s.push(u),y&&(u.__E=u.__=null)}catch(z){if(s.length=_,t.__v=null,d||i!=null){if(z.then){for(t.__u|=d?160:128;l&&l.nodeType==8&&l.nextSibling;)l=l.nextSibling;i!=null&&(i[i.indexOf(l)]=null),t.__e=l}else if(i!=null)for(V=i.length;V--;)Rt(i[V])}else t.__e=r.__e;t.__k==null&&(t.__k=r.__k||[]),z.then||Pr(t),k.__e(z,t,r)}}else i==null&&t.__v==r.__v?(t.__k=r.__k,t.__e=r.__e):l=t.__e=Wn(r.__e,t,r,a,n,i,s,d,c);return(f=k.diffed)&&f(t),128&t.__u?void 0:l}function Pr(e){e&&(e.__c&&(e.__c.__e=!0),e.__k&&e.__k.some(Pr))}function Cr(e,t,r){for(var a=0;a<r.length;a++)Tt(r[a],r[++a],r[++a]);k.__c&&k.__c(t,e),e.some(function(n){try{e=n.__h,n.__h=[],e.some(function(i){i.call(n)})}catch(i){k.__e(i,n.__v)}})}function Or(e){return typeof e!="object"||e==null||e.__b>0?e:Oe(e)?e.map(Or):e.constructor!==void 0?null:re({},e)}function Wn(e,t,r,a,n,i,s,l,d){var c,f,_,u,m,h,b,g=r.props||Ke,y=t.props,x=t.type;if(x=="svg"?n="http://www.w3.org/2000/svg":x=="math"?n="http://www.w3.org/1998/Math/MathML":n||(n="http://www.w3.org/1999/xhtml"),i!=null){for(c=0;c<i.length;c++)if((m=i[c])&&"setAttribute"in m==!!x&&(x?m.localName==x:m.nodeType==3)){e=m,i[c]=null;break}}if(e==null){if(x==null)return document.createTextNode(y);e=document.createElementNS(n,x,y.is&&y),l&&(k.__m&&k.__m(t,i),l=!1),i=null}if(x==null)g===y||l&&e.data==y||(e.data=y);else{if(i=x=="textarea"&&y.defaultValue!=null?null:i&&et.call(e.childNodes),!l&&i!=null)for(g={},c=0;c<e.attributes.length;c++)g[(m=e.attributes[c]).name]=m.value;for(c in g)m=g[c],c=="dangerouslySetInnerHTML"?_=m:c=="children"||c in y||c=="value"&&"defaultValue"in y||c=="checked"&&"defaultChecked"in y||qe(e,c,null,m,n);for(c in y)m=y[c],c=="children"?u=m:c=="dangerouslySetInnerHTML"?f=m:c=="value"?h=m:c=="checked"?b=m:l&&typeof m!="function"||g[c]===m||qe(e,c,m,g[c],n);if(f)l||_&&(f.__html==_.__html||f.__html==e.innerHTML)||(e.innerHTML=f.__html),t.__k=[];else if(_&&(e.innerHTML=""),Mr(t.type=="template"?e.content:e,Oe(u)?u:[u],t,r,a,x=="foreignObject"?"http://www.w3.org/1999/xhtml":n,i,s,i?i[0]:r.__k&&pe(r,0),l,d),i!=null)for(c=i.length;c--;)Rt(i[c]);l&&x!="textarea"||(c="value",x=="progress"&&h==null?e.removeAttribute("value"):h!=null&&(h!==e[c]||x=="progress"&&!h||x=="option"&&h!=g[c])&&qe(e,c,h,g[c],n),c="checked",b!=null&&b!=e[c]&&qe(e,c,b,g[c],n))}return e}function Tt(e,t,r){try{if(typeof e=="function"){var a=typeof e.__u=="function";a&&e.__u(),a&&t==null||(e.__u=e(t))}else e.current=t}catch(n){k.__e(n,r)}}function Ir(e,t,r){var a,n;if(k.unmount&&k.unmount(e),(a=e.ref)&&(a.current&&a.current!=e.__e||Tt(a,null,t)),(a=e.__c)!=null){if(a.componentWillUnmount)try{a.componentWillUnmount()}catch(i){k.__e(i,t)}a.base=a.__P=a.__n=null}if(a=e.__k)for(n=0;n<a.length;n++)a[n]&&Ir(a[n],t,r||typeof e.type!="function");r||Rt(e.__e),e.__c=e.__=e.__e=void 0}function Gn(e,t,r){return this.constructor(e,r)}function Pt(e,t,r){var a,n,i,s;t==document&&(t=document.documentElement),k.__&&k.__(e,t),n=(a=typeof r=="function")?null:r&&r.__k||t.__k,i=[],s=[],Mt(t,e=(!a&&r||t).__k=xe($,null,[e]),n||Ke,Ke,t.namespaceURI,!a&&r?[r]:n?null:t.firstChild?et.call(t.childNodes):null,i,!a&&r?r:n?n.__e:t.firstChild,a,s),Cr(i,e,s),e.props.children=null}et=Ze.slice,k={__e:function(e,t,r,a){for(var n,i,s;t=t.__;)if((n=t.__c)&&!n.__)try{if((i=n.constructor)&&i.getDerivedStateFromError!=null&&(n.setState(i.getDerivedStateFromError(e)),s=n.__d),n.componentDidCatch!=null&&(n.componentDidCatch(e,a||{}),s=n.__d),s)return n.__E=n}catch(l){e=l}throw e}},wr=0,Bn=function(e){return e!=null&&e.constructor===void 0},X.prototype.setState=function(e,t){var r;r=this.__s!=null&&this.__s!=this.state?this.__s:this.__s=re({},this.state),typeof e=="function"&&(e=e(re({},r),this.props)),e&&re(r,e),e!=null&&this.__v&&(t&&this._sb.push(t),yr(this))},X.prototype.forceUpdate=function(e){this.__v&&(this.__e=!0,e&&this.__h.push(e),yr(this))},X.prototype.render=$,oe=[],Sr=typeof Promise=="function"?Promise.prototype.then.bind(Promise.resolve()):setTimeout,Er=function(e,t){return e.__v.__b-t.__v.__b},Qe.__r=0,wt=Math.random().toString(8),Ye="__d"+wt,Ce="__a"+wt,Ar=/(PointerCapture)$|Capture$/i,At=0,St=kr(!1),Et=kr(!0),Nn=0;var ke,C,Ct,Ur,Ue=0,zr=[],I=k,Lr=I.__b,Fr=I.__r,Dr=I.diffed,Br=I.__c,Nr=I.unmount,$r=I.__;function rt(e,t){I.__h&&I.__h(C,e,Ue||t),Ue=0;var r=C.__H||(C.__H={__:[],__h:[]});return e>=r.__.length&&r.__.push({}),r.__[e]}function R(e){return Ue=1,Vr(Gr,e)}function Vr(e,t,r){var a=rt(ke++,2);if(a.t=e,!a.__c&&(a.__=[r?r(t):Gr(void 0,t),function(l){var d=a.__N?a.__N[0]:a.__[0],c=a.t(d,l);d!==c&&(a.__N=[c,a.__[1]],a.__c.setState({}))}],a.__c=C,!C.__f)){var n=function(l,d,c){if(!a.__c.__H)return!0;var f=!1,_=a.__c.props!==l;if(a.__c.__H.__.some(function(m){if(m.__N){f=!0;var h=m.__[0];m.__=m.__N,m.__N=void 0,h!==m.__[0]&&(_=!0)}}),i){var u=i.call(this,l,d,c);return f?u||_:u}return!f||_};C.__f=!0;var i=C.shouldComponentUpdate,s=C.componentWillUpdate;C.componentWillUpdate=function(l,d,c){if(this.__e){var f=i;i=void 0,n(l,d,c),i=f}s&&s.call(this,l,d,c)},C.shouldComponentUpdate=n}return a.__N||a.__}function E(e,t){var r=rt(ke++,3);!I.__s&&Ut(r.__H,t)&&(r.__=e,r.u=t,C.__H.__h.push(r))}function Wr(e,t){var r=rt(ke++,4);!I.__s&&Ut(r.__H,t)&&(r.__=e,r.u=t,C.__h.push(r))}function S(e){return Ue=5,Le(function(){return{current:e}},[])}function Le(e,t){var r=rt(ke++,7);return Ut(r.__H,t)&&(r.__=e(),r.__H=t,r.__h=e),r.__}function It(e,t){return Ue=8,Le(function(){return e},t)}function jn(){for(var e;e=zr.shift();){var t=e.__H;if(e.__P&&t)try{t.__h.some(tt),t.__h.some(Ot),t.__h=[]}catch(r){t.__h=[],I.__e(r,e.__v)}}}I.__b=function(e){C=null,Lr&&Lr(e)},I.__=function(e,t){e&&t.__k&&t.__k.__m&&(e.__m=t.__k.__m),$r&&$r(e,t)},I.__r=function(e){Fr&&Fr(e),ke=0;var t=(C=e.__c).__H;t&&(Ct===C?(t.__h=[],C.__h=[],t.__.some(function(r){r.__N&&(r.__=r.__N),r.u=r.__N=void 0})):(t.__h.some(tt),t.__h.some(Ot),t.__h=[],ke=0)),Ct=C},I.diffed=function(e){Dr&&Dr(e);var t=e.__c;t&&t.__H&&(t.__H.__h.length&&(zr.push(t)!==1&&Ur===I.requestAnimationFrame||((Ur=I.requestAnimationFrame)||Xn)(jn)),t.__H.__.some(function(r){r.u&&(r.__H=r.u,r.u=void 0)})),Ct=C=null},I.__c=function(e,t){t.some(function(r){try{r.__h.some(tt),r.__h=r.__h.filter(function(a){return!a.__||Ot(a)})}catch(a){t.some(function(n){n.__h&&(n.__h=[])}),t=[],I.__e(a,r.__v)}}),Br&&Br(e,t)},I.unmount=function(e){Nr&&Nr(e);var t,r=e.__c;r&&r.__H&&(r.__H.__.some(function(a){try{tt(a)}catch(n){t=n}}),r.__H=void 0,t&&I.__e(t,r.__v))};var Hr=typeof requestAnimationFrame=="function";function Xn(e){var t,r=function(){clearTimeout(a),Hr&&cancelAnimationFrame(t),setTimeout(e)},a=setTimeout(r,35);Hr&&(t=requestAnimationFrame(r))}function tt(e){var t=C,r=e.__c;typeof r=="function"&&(e.__c=void 0,r()),C=t}function Ot(e){var t=C;e.__c=e.__(),C=t}function Ut(e,t){return!e||e.length!==t.length||t.some(function(r,a){return r!==e[a]})}function Gr(e,t){return typeof t=="function"?t(e):t}var qn=0;function o(e,t,r,a,n,i){t||(t={});var s,l,d=t;if("ref"in d)for(l in d={},t)l=="ref"?s=t[l]:d[l]=t[l];var c={type:e,props:d,key:r,ref:s,__k:null,__:null,__b:0,__e:null,__c:null,constructor:void 0,__v:--qn,__i:-1,__u:0,__source:n,__self:i};if(typeof e=="function"&&(s=e.defaultProps))for(l in s)d[l]===void 0&&(d[l]=s[l]);return k.vnode&&k.vnode(c),c}var G={xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round","aria-hidden":"true"},at=()=>o("svg",{...G,width:"16",height:"16",children:[o("path",{d:"m5 12 7-7 7 7"}),o("path",{d:"M12 19V5"})]});var Fe=()=>o("svg",{...G,width:"14",height:"14",children:[o("path",{d:"M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"}),o("path",{d:"M20 2v4"}),o("path",{d:"M22 4h-4"}),o("circle",{cx:"4",cy:"20",r:"2"})]}),jr=()=>o("svg",{...G,width:"12",height:"12",children:o("rect",{width:"18",height:"18",x:"3",y:"3",rx:"2"})}),Xr=()=>o("svg",{...G,width:"14",height:"14",children:o("path",{d:"M20 6 9 17l-5-5"})}),qr=()=>o("svg",{...G,width:"14",height:"14",children:[o("rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2"}),o("path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"})]}),De=()=>o("svg",{...G,width:"16",height:"16",children:[o("path",{d:"M18 6 6 18"}),o("path",{d:"m6 6 12 12"})]}),Be=()=>o("svg",{...G,width:"16",height:"16",children:[o("path",{d:"M13.234 20.252 21 12.3"}),o("path",{d:"m16 6-8.414 8.586a2 2 0 0 0 0 2.828 2 2 0 0 0 2.828 0l8.414-8.586a4 4 0 0 0 0-5.656 4 4 0 0 0-5.656 0l-8.415 8.585a6 6 0 1 0 8.486 8.486"})]}),nt=()=>o("svg",{...G,width:"16",height:"16",children:[o("path",{d:"M5 12h14"}),o("path",{d:"M12 5v14"})]}),it=()=>o("svg",{...G,width:"14",height:"14",children:[o("path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"}),o("path",{d:"M14 2v4a2 2 0 0 0 2 2h4"}),o("path",{d:"M16 13H8"}),o("path",{d:"M16 17H8"})]}),Yr=()=>o("svg",{...G,width:"14",height:"14",children:[o("path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"}),o("path",{d:"m17 8-5-5-5 5"}),o("path",{d:"M12 3v12"})]}),Jr=()=>o("svg",{...G,width:"14",height:"14",children:[o("circle",{cx:"11",cy:"11",r:"8"}),o("path",{d:"m21 21-4.3-4.3"})]}),Kr=()=>o("svg",{...G,width:"14",height:"14",children:[o("path",{d:"M3 6h18"}),o("path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"}),o("path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"})]}),Zr=()=>o("svg",{...G,width:"14",height:"14",children:o("path",{d:"m15 18-6-6 6-6"})});var ae=(()=>{if(typeof document>"u")return"/agent/vendor/";let e=document.currentScript?.src;try{return new URL("vendor/",e??"/agent/").href}catch{return"/agent/vendor/"}})(),Qr=new Map;function ot(e){let t=Qr.get(e);if(t)return t;let r=new Promise((a,n)=>{let i=document.createElement("script");i.src=e,i.onload=()=>a(),i.onerror=()=>n(new Error(`could not load ${e}`)),document.head.append(i)});return Qr.set(e,r),r}var Yn=/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)\s]+\))/g;function lt(e,t){return e.startsWith("/")?`${t.replace(/\/$/,"")}${e}`:e.startsWith("https://")||e.startsWith("http://")?e:null}function st(e,t){return e.split(Yn).map((a,n)=>{if(a.startsWith("`")&&a.endsWith("`")&&a.length>2)return o("code",{children:a.slice(1,-1)},n);if(a.startsWith("**")&&a.endsWith("**")&&a.length>4)return o("b",{children:st(a.slice(2,-2),t)},n);if(a.startsWith("*")&&a.endsWith("*")&&a.length>2)return o("em",{children:st(a.slice(1,-1),t)},n);let i=/^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(a);if(i){let[,s,l]=i,d=lt(l,t);return d?o("a",{href:d,target:"_blank",rel:"noopener noreferrer",children:s},n):a}return a})}function ct({text:e,label:t,className:r}){let[a,n]=R(!1);return E(()=>{if(!a)return;let i=window.setTimeout(()=>n(!1),1600);return()=>window.clearTimeout(i)},[a]),typeof navigator>"u"||!navigator.clipboard?null:o("button",{type:"button",class:r,"aria-label":a?"Copied":t,onClick:()=>{navigator.clipboard.writeText(e).then(()=>n(!0),()=>{})},children:a?o(Xr,{}):o(qr,{})})}var ea=null;function Jn(){return ea??=ot(`${ae}mermaid.min.js`).then(()=>{let e=globalThis.mermaid;if(!e)throw new Error("mermaid loaded but registered nothing");return e.initialize({startOnLoad:!1,securityLevel:"strict",theme:Kn()?"dark":"default",fontFamily:"inherit"}),e}),ea}function Kn(){let e=document.documentElement.dataset.theme;return e==="dark"?!0:e==="light"?!1:globalThis.matchMedia?.("(prefers-color-scheme: dark)").matches??!1}var ta=0;function Zn({text:e}){let[t,r]=R(""),[a,n]=R(!1);return E(()=>{let i=!0;n(!1),r(""),ta+=1;let s=`ask-ai-diagram-${ta}`;return Jn().then(l=>l.render(s,e)).then(l=>{i&&r(l.svg)}).catch(()=>{i&&n(!0),document.getElementById(s)?.remove(),document.getElementById(`d${s}`)?.remove()}),()=>{i=!1}},[e]),a?o("div",{class:"ask-ai__code",children:[o("pre",{children:o("code",{children:e})}),o(ct,{text:e,label:"Copy diagram source",className:"ask-ai__code-copy"})]}):o("div",{class:"ask-ai__diagram",dangerouslySetInnerHTML:{__html:t}})}var Qn=/^\s*[-*]\s+(.*)$/,ei=/^\s*\d+[.)]\s+(.*)$/;function ti(e){let t=[],r=null,a=[],n=null,i="",s=()=>{a.length>0&&(t.push({kind:"p",text:a.join(" ")}),a=[])},l=()=>{r&&(t.push(r),r=null)};for(let d of e.split(`
`)){if(d.trimStart().startsWith("```")){n?(t.push({kind:"code",text:n.join(`
`),lang:i,closed:!0}),n=null,i=""):(s(),l(),i=d.trim().slice(3).trim().toLowerCase(),n=[]);continue}if(n){n.push(d);continue}let c=Qn.exec(d),f=c?null:ei.exec(d);if(c||f){s();let _=c?"ul":"ol";(!r||r.kind!==_)&&(l(),r={kind:_,items:[]}),r.items.push((c??f)[1]);continue}if(d.trim()===""){s(),l();continue}if(r&&/^\s{2,}/.test(d)){r.items[r.items.length-1]+=` ${d.trim()}`;continue}l(),a.push(d.replace(/^#{1,4}\s+/,"").trim())}return n&&t.push({kind:"code",text:n.join(`
`),lang:i,closed:!1}),s(),l(),t}function Lt({text:e,docsOrigin:t}){return o($,{children:ti(e).map((r,a)=>{if(r.kind==="p")return o("p",{children:st(r.text,t)},a);if(r.kind==="code")return r.lang==="mermaid"&&r.closed?o(Zn,{text:r.text},a):o("div",{class:"ask-ai__code",children:[o("pre",{children:o("code",{children:r.text})}),o(ct,{text:r.text,label:"Copy code",className:"ask-ai__code-copy"})]},a);let n=r.kind;return o(n,{children:r.items.map((i,s)=>o("li",{children:st(i,t)},s))},a)})})}function ra(e){let t=[],r=!1;for(let a of e.split(`
`))/^\s*```/.test(a)?r=!r:!r&&/^##\s+/.test(a)&&t.push(a.slice(2).replace(/[*`_]/g,"").trim());return t.filter(Boolean)}var Ft="The assistant is unreachable right now. Try again shortly.";async function aa(e,t){let r=e.getReader(),a=new TextDecoder,n="",i=s=>{let l="message",d=[];for(let f of s.split(`
`))f.startsWith("event:")?l=f.slice(6).trim():f.startsWith("data:")&&d.push(f.slice(5).trim());if(d.length===0)return;let c;try{c=JSON.parse(d.join(`
`))}catch{return}switch(l){case"text":t.onText(c.delta??"");break;case"tool":{let f=c;t.onTool(f.detail||f.name);break}case"sources":t.onSources(c);break;case"skill":t.onSkill?.(c);break;case"error":t.onError(c.message||Ft);break;default:break}};for(;;){let{done:s,value:l}=await r.read();if(s)break;n+=a.decode(l,{stream:!0});let d;for(;(d=n.indexOf(`

`))!==-1;){let c=n.slice(0,d);n=n.slice(d+2),i(c)}}}var ut="abdm-docs",Dt=[{id:"skills",label:"Skills"},{id:"mcp",label:"MCP server"},{id:"plugin",label:"Plugin"}],Bt=[{id:"claude",label:"Claude"},{id:"codex",label:"Codex"},{id:"cursor",label:"Cursor"},{id:"other",label:"Other"}],ri=["Three ways to give your agent this catalogue. Take any of them, or all three.","","- **Skills**: the milestones written as files an agent reads before it writes code. One set up line, any agent.","- **MCP server**: your agent queries these pages as it works, so it retrieves the paragraph it needs instead of loading the site.","- **Plugin**: every skill at once, as one package. Claude Code and Codex install it straight from the repository; the other Agent Plugins clients list it through their own marketplaces.","","Which one do you want?"].join(`
`);function na(e){return!0}function ai(e){return Dt.find(t=>t.id===e).label}function Nt(e,t){return e==="other"?t?.trim()||"your agent":Bt.find(r=>r.id===e).label}function ni(e){return`Fetch and execute the instructions to set me up for ABDM integration from ${e}/agent-setup/prompt.md`}function ia(e){return[e,"","If this session did not open in the repository I am integrating ABDM into, ask me for the path before you write anything."].join(`
`)}function ii(e){return e.replace(/\/+$/,"")}function se(e){return["```",e,"```"].join(`
`)}var oa="abdm-integrators-assistant",sa=e=>`claude plugin marketplace add ${e} && claude plugin install ${oa}@abdm-portal`,oi=e=>`codex plugin marketplace add ${e}`;function la(e,t){return`claude://code/new?q=${encodeURIComponent(ia(["Set this project up for ABDM integration. Run:","",`claude plugin marketplace add ${t}`,"claude plugin install abdm-integrators-assistant@abdm-portal","",`If the marketplace add fails (the repository may not be accessible), instead fetch and execute the instructions from ${e}/agent-setup/prompt.md`].join(`
`)))}`}function si(e,t,r,a){let n=ni(r);return e==="claude"?{text:["Claude Code takes the plugin, which carries every skill at once and updates in place. Run this in the repository you are integrating.","",se(sa(a))].join(`
`),link:{href:la(r,a),label:"Open in Claude"}}:e==="cursor"?{text:["Paste this into Cursor, or let the link put it in the composer. It fetches the current instructions from this site, so what it installs cannot go stale.","",se(n)].join(`
`),link:{href:`cursor://anysphere.cursor-deeplink/prompt?text=${encodeURIComponent(ia(n))}`,label:"Open in Cursor"}}:e==="codex"?{text:["Codex has no URL scheme, so this is a paste. Give it to a Codex session in the repository you are integrating, and it fetches the current instructions from this site.","",se(n)].join(`
`)}:{text:[`Any agent that can fetch a URL takes this line, ${Nt(e,t)} included. The instructions live on this site and are rebuilt with it, so the pasted line cannot go stale.`,"",se(n)].join(`
`)}}function li(e,t,r,a){return e==="claude"?{text:["Run this in the repository you are integrating. It carries every skill at once, and `claude plugin update` keeps it current.","",se(sa(a))].join(`
`),link:{href:la(r,a),label:"Open in Claude"}}:e==="codex"?{text:[`Add the marketplace, then install \`${oa}\` from it in Codex's plugin directory.`,"",se(oi(a))].join(`
`)}:{text:[`The plugin is packaged to the Agent Plugins 1.0 standard, which ${Nt(e,t)} reads, but that route installs from the client's own marketplace and this plugin is not listed in one yet.`,"","The skills are the same content and they install today. Ask for Skills instead."].join(`
`)}}function ci(e,t,r,a){return a?e==="claude"?{text:["User scope, so it is there in every project rather than only this directory.","",se(`claude mcp add --transport http ${ut} ${a} -s user`)].join(`
`),link:{href:`claude://code/new?q=${encodeURIComponent(["Add the ABDM documentation MCP server, then use it to answer my ABDM questions.","","Run this:",`claude mcp add --transport http ${ut} ${a} -s user`,"","User scope, so it is available in every project rather than only this directory."].join(`
`))}`,label:"Open in Claude"}}:e==="cursor"?{text:"The link opens Cursor on a confirmation dialog, and there is no command to run.",link:{href:`cursor://anysphere.cursor-deeplink/mcp/install?name=${ut}&config=${encodeURIComponent(btoa(JSON.stringify({url:a})))}`,label:"Add to Cursor"}}:{text:[`Any client that reads an \`mcpServers\` config takes this block as it stands, ${Nt(e,t)} included.`,"",se(JSON.stringify({mcpServers:{[ut]:{url:a}}},null,2))].join(`
`)}:{text:`The server is live, but this build of the site does not carry its address, so there is no command to give you. The address is set at deploy. [Build with AI](${r}/docs/hiecm/v3/getting-started/build-with-ai) has the current one.`}}function $t(e,t){let r=ii(t.docsOrigin);return e.tool==="plugin"?li(e.agent,e.named,r,t.pluginRepo):e.tool==="mcp"?ci(e.agent,e.named,r,t.mcpUrl):si(e.agent,e.named,r,t.pluginRepo)}function ca(e,t){return e.at==="tools"?ri:e.at==="agents"?`${ai(e.tool)} it is. Which agent are you working in?`:$t(e,t).text}var ui=/\b(integrat\w*|implement\w*|build|building|develop\w*|debug\w*|troubleshoot\w*|fix|fixing|broken|failing|failed|fails|error|errors|stuck|retry|retries|sandbox|certif\w*|onboard\w*|set ?up|install\w*|scaffold\w*|test\w*|why (is|does|isn.?t|doesn.?t|am|are)|how (do|can|would|should) (i|we)|not working|does ?n.?t work)\b/i;function ua(e){return ui.test(e)}function da(e,t,r,a){return e<=0||!r&&t<550&&e<220?0:a?e:Math.min(e,Math.max(2,Math.ceil(e/6)))}var dt="abdm-ask-ai-history";function pa(e){let r=(e.find(a=>a.from==="you")?.text.trim()??"").replace(/\s+/g," ");return r.length>72?`${r.slice(0,71)}\u2026`:r}function fa(e,t){return[t,...e.filter(r=>r.id!==t.id)].slice(0,50)}function ha(e=Date.now()){try{let t=JSON.parse(localStorage.getItem(dt)??"[]");return Array.isArray(t)?t.filter(r=>r?.id&&r?.turns&&e-(r.at??0)<2592e6):[]}catch{return[]}}function Ht(e){try{localStorage.setItem(dt,JSON.stringify(e))}catch{try{localStorage.setItem(dt,JSON.stringify(e.slice(0,-1)))}catch{}}}function ma(e,t){return e.filter(r=>r.id!==t)}function _a(){try{localStorage.removeItem(dt)}catch{}}var zt=[{id:"scaffold",label:"Scaffold"},{id:"design",label:"Design"},{id:"integrate",label:"Integrate"},{id:"debug",label:"Debug"}],di=e=>zt.find(t=>t.id===e)?.label??e;function pt(e){let t=e.replace(/^abdm-/,"");if(/^[mp]\d$/.test(t))return t.toUpperCase();let r=t.replace(/-/g," ");return r.charAt(0).toUpperCase()+r.slice(1)}function ft(e){switch(e.status){case"used":return`Using ${pt(e.module??"")} \xB7 ${di(e.section)}`;case"missing":return`No ${e.section} guide for ${pt(e.module??"")} yet. Answering from the docs.`;default:return"Which module is this about?"}}var pi=/^- \[([^\]]+)\]\(([^)\s]+)\)(?::\s*(.*))?$/;function fi(e){let t=[],r=new Set;for(let a of e.split(`
`)){let n=pi.exec(a.trim());if(!n)continue;let i;try{i=new URL(n[2],"https://placeholder.invalid").pathname.replace(/\/$/,"")}catch{continue}!i.startsWith("/docs/")||r.has(i)||(r.add(i),t.push({title:n[1],path:i,description:(n[3]??"").trim()}))}return t}var hi=e=>e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");function ga(e,t,r=8){let a=t.toLowerCase().split(/\s+/).filter(Boolean);if(!a.length)return[];let n=[];for(let i of e){let s=i.title.toLowerCase(),l=`${i.path} ${i.description}`.toLowerCase(),d=0,c=!0;for(let f of a)if(new RegExp(`\\b${hi(f)}`).test(s))d+=3;else if(s.includes(f))d+=2;else if(l.includes(f))d+=1;else{c=!1;break}c&&n.push({entry:i,score:d})}return n.sort((i,s)=>s.score-i.score||i.entry.title.length-s.entry.title.length).slice(0,r).map(i=>i.entry)}var Vt=e=>e.replace(/\/$/,""),va=(e,t)=>`${Vt(e)}${t}`,ba=(e,t)=>`${Vt(e)}${t}.md`;function ya(e){return/^\s*(?:<!doctype html|<html[\s>])/i.test(e)}var ht=null;function xa(e){return ht||(ht=fetch(`${Vt(e)}/llms.txt`).then(t=>t.ok?t.text():Promise.reject(new Error(`status ${t.status}`))).then(fi).catch(t=>{throw ht=null,t})),ht}function ka(e){let{draft:t,busy:r,menu:a,onMenu:n,page:i,file:s,fileNote:l,fileError:d,attaching:c}=e,f=S(null),_=S(null),u=i!==null&&i.markdown!=="";return E(()=>{if(a==="closed")return;let h=b=>{_.current&&!b.composedPath().includes(_.current)&&n("closed")};return document.addEventListener("pointerdown",h,!0),()=>document.removeEventListener("pointerdown",h,!0)},[a]),o("div",{class:"ask-ai__foot",children:[o("form",{class:"ask-ai__composer",onSubmit:h=>{h.preventDefault(),e.onSend()},children:[!!(i||c||s||l||d)&&o("div",{class:"ask-ai__context",children:[c&&o("span",{class:"ask-ai__chip ask-ai__chip--pending",children:[o(it,{}),o("span",{class:"ask-ai__chip-text",children:["Attaching ",c]})]}),i&&!c&&o("span",{class:`ask-ai__chip${u?"":" ask-ai__chip--failed"}`,children:[o(it,{}),o("span",{class:"ask-ai__chip-text",children:u?i.title:`Could not attach ${i.title}`}),o("button",{type:"button",class:"ask-ai__chip-remove","aria-label":u?`Remove ${i.title}`:"Dismiss",onClick:e.onRemovePage,children:o(De,{})})]}),l?o("span",{class:"ask-ai__chip ask-ai__chip--pending",children:[o(Be,{}),o("span",{class:"ask-ai__chip-text",children:l})]}):s&&o("span",{class:"ask-ai__chip",children:[o(Be,{}),o("span",{class:"ask-ai__chip-text",children:s.name}),o("span",{class:"ask-ai__chip-meta",children:[s.text.length.toLocaleString()," characters"]}),o("button",{type:"button",class:"ask-ai__chip-remove","aria-label":`Remove ${s.name}`,onClick:e.onRemoveFile,children:o(De,{})})]}),d&&o("span",{class:"ask-ai__context-error",children:d})]}),s?.kind&&!l&&o("p",{class:"ask-ai__context-note",children:"Read here in your browser; the file itself is not sent. Names in it are yours to check before you send."}),o("div",{class:"ask-ai__bar",children:[o("div",{class:"ask-ai__add-wrap",ref:_,children:[o("button",{type:"button",class:"ask-ai__add","aria-label":"Add a file or a page","aria-haspopup":"menu","aria-expanded":a!=="closed",disabled:r,onClick:()=>n(a==="closed"?"add":"closed"),children:o(nt,{})}),a==="add"&&o("div",{class:"ask-ai__menu",role:"menu",children:[o("button",{type:"button",role:"menuitem",class:"ask-ai__menu-item",autoFocus:!0,onClick:()=>{n("closed"),f.current?.click()},children:[o(Yr,{}),"Upload from computer"]}),o("button",{type:"button",role:"menuitem",class:"ask-ai__menu-item",onClick:()=>n("pages"),children:[o(it,{}),"Attach a page"]})]}),a==="pages"&&o(mi,{docsOrigin:e.docsOrigin,onPick:h=>{n("closed"),e.onPage(h)},onBack:()=>n("add")})]}),o("input",{ref:f,type:"file",class:"ask-ai__picker",accept:e.accept,onChange:h=>{let b=h.currentTarget;e.onFile(b.files?.[0]),b.value=""}}),o("textarea",{ref:e.field,class:"ask-ai__input",value:t,rows:1,onInput:h=>e.onDraft(h.currentTarget.value),onKeyDown:h=>{h.key==="Enter"&&!h.shiftKey&&(h.preventDefault(),e.onSend())},placeholder:"Ask about ABDM","aria-label":"Ask the assistant"}),r?o("button",{class:"ask-ai__send ask-ai__send--stop",type:"button","aria-label":"Stop",onClick:e.onStop,children:o(jr,{})}):o("button",{class:"ask-ai__send",type:"submit","aria-label":"Send",disabled:t.trim()==="",children:o(at,{})})]})]}),o("div",{class:"ask-ai__commands",role:"group","aria-label":"Commands",children:zt.map(h=>o("button",{type:"button",class:"ask-ai__command","aria-pressed":e.command===h.id,onClick:()=>e.onCommand(e.command===h.id?null:h.id),children:h.label},h.id))})]})}function mi({docsOrigin:e,onPick:t,onBack:r}){let[a,n]=R(""),[i,s]=R(null),[l,d]=R(!1),[c,f]=R(0);E(()=>{let m=!0;return xa(e).then(h=>m&&s(h),()=>m&&d(!0)),()=>{m=!1}},[e]);let _=i?ga(i,a):[],u=l?"The page list could not be loaded.":i?a.trim()?_.length?null:"No page matches that.":"Type to search every page.":"Loading pages";return o("div",{class:"ask-ai__menu ask-ai__menu--pages",role:"dialog","aria-label":"Attach a page",children:[o("div",{class:"ask-ai__search",children:[o("button",{type:"button",class:"ask-ai__search-back","aria-label":"Back",onClick:r,children:o(Zr,{})}),o(Jr,{}),o("input",{class:"ask-ai__search-field",value:a,autoFocus:!0,placeholder:"Search pages","aria-label":"Search pages",role:"combobox","aria-expanded":_.length>0,"aria-controls":"ask-ai-page-hits",onInput:m=>{n(m.currentTarget.value),f(0)},onKeyDown:m=>{m.key==="Enter"?(m.preventDefault(),_[c]&&t(_[c])):m.key==="ArrowDown"?(m.preventDefault(),f(h=>Math.min(h+1,_.length-1))):m.key==="ArrowUp"&&(m.preventDefault(),f(h=>Math.max(h-1,0)))}})]}),_.length>0&&o("ul",{class:"ask-ai__hits",id:"ask-ai-page-hits",role:"listbox",children:_.map((m,h)=>o("li",{role:"option","aria-selected":h===c,children:o("button",{type:"button",class:`ask-ai__hit${h===c?" ask-ai__hit--active":""}`,onMouseEnter:()=>f(h),onClick:()=>t(m),children:[o("span",{class:"ask-ai__hit-title",children:m.title}),o("span",{class:"ask-ai__hit-path",children:m.path.replace(/^\/docs\//,"")})]})},m.path))}),u&&o("p",{class:"ask-ai__search-status",children:u})]})}function wa({sessions:e,currentId:t,onOpen:r,onForget:a,onClearAll:n}){return e.length?o("div",{class:"ask-ai__history",children:[o("p",{class:"ask-ai__history-label",children:"Recents"}),o("ul",{class:"ask-ai__history-list",children:e.map(i=>{let s=i.id===t,l=i.title||"Untitled conversation";return o("li",{class:`ask-ai__history-row${s?" ask-ai__history-row--current":""}`,children:[o("button",{type:"button",class:"ask-ai__history-open","aria-current":s?"true":void 0,title:l,onClick:()=>r(i),children:l}),o("button",{type:"button",class:"ask-ai__history-forget","aria-label":`Delete ${l}`,title:"Delete",onClick:()=>a(i.id),children:o(Kr,{})})]},i.id)})}),o("div",{class:"ask-ai__history-foot",children:[o("span",{children:"Kept in this browser only."}),o("button",{type:"button",class:"ask-ai__history-clear",onClick:n,children:"Clear all"})]})]}):o("div",{class:"ask-ai__history ask-ai__history--empty",children:[o("p",{class:"ask-ai__history-none",children:"No conversations yet."}),o("p",{class:"ask-ai__history-note",children:"What you ask here is kept in this browser only."})]})}function Oa(e,t){for(var r in t)e[r]=t[r];return e}function jt(e,t){for(var r in e)if(r!=="__source"&&!(r in t))return!0;for(var a in t)if(a!=="__source"&&e[a]!==t[a])return!0;return!1}function Ia(e,t){var r=t(),a=R({t:{__:r,u:t}}),n=a[0].t,i=a[1];return Wr(function(){n.__=r,n.u=t,Wt(n)&&i({t:n})},[e,r,t]),E(function(){return Wt(n)&&i({t:n}),e(function(){Wt(n)&&i({t:n})})},[e]),r}function Wt(e){try{return!((t=e.__)===(r=e.u())&&(t!==0||1/t==1/r)||t!=t&&r!=r)}catch{return!0}var t,r}function Sa(e,t){this.props=e,this.context=t}function Ua(e,t){function r(n){var i=this.props.ref;return i!=n.ref&&i&&(typeof i=="function"?i(null):i.current=null),t?!t(this.props,n)||i!=n.ref:jt(this.props,n)}function a(n){return this.shouldComponentUpdate=r,xe(e,n)}return a.displayName="Memo("+(e.displayName||e.name)+")",a.__f=a.prototype.isReactComponent=!0,a.type=e,a}(Sa.prototype=new X).isPureReactComponent=!0,Sa.prototype.shouldComponentUpdate=function(e,t){return jt(this.props,e)||jt(this.state,t)};var Ea=k.__b;k.__b=function(e){e.type&&e.type.__f&&e.ref&&(e.props.ref=e.ref,e.ref=null),Ea&&Ea(e)};var vi=typeof Symbol<"u"&&Symbol.for&&Symbol.for("react.forward_ref")||3911;function La(e){function t(r){var a=Oa({},r);return delete a.ref,e(a,r.ref||null)}return t.$$typeof=vi,t.render=e,t.prototype.isReactComponent=t.__f=!0,t.displayName="ForwardRef("+(e.displayName||e.name)+")",t}var bi=k.__e;k.__e=function(e,t,r,a){if(e.then){for(var n,i=t;i=i.__;)if((n=i.__c)&&n.__c)return t.__e==null&&(t.__e=r.__e,t.__k=r.__k||[]),n.__c(e,t)}bi(e,t,r,a)};var Aa=k.unmount;function Fa(e,t,r){return e&&(e.__c&&e.__c.__H&&(e.__c.__H.__.forEach(function(a){typeof a.__c=="function"&&a.__c()}),e.__c.__H=null),(e=Oa({},e)).__c!=null&&(e.__c.__P===r&&(e.__c.__P=t),e.__c.__e=!0,e.__c=null),e.__k=e.__k&&e.__k.map(function(a){return Fa(a,t,r)})),e}function Da(e,t,r){return e&&r&&(e.__v=null,e.__k=e.__k&&e.__k.map(function(a){return Da(a,t,r)}),e.__c&&e.__c.__P===t&&(e.__e&&r.appendChild(e.__e),e.__c.__e=!0,e.__c.__P=r)),e}function Gt(){this.__u=0,this.o=null,this.__b=null}function Ba(e){var t=e.__&&e.__.__c;return t&&t.__a&&t.__a(e)}function mt(){this.i=null,this.l=null}k.unmount=function(e){var t=e.__c;t&&(t.__z=!0),t&&t.__R&&t.__R(),t&&32&e.__u&&(e.type=null),Aa&&Aa(e)},(Gt.prototype=new X).__c=function(e,t){var r=t.__c,a=this;a.o==null&&(a.o=[]),a.o.push(r);var n=Ba(a.__v),i=!1,s=function(){i||a.__z||(i=!0,r.__R=null,n?n(d):d())};r.__R=s;var l=r.__P;r.__P=null;var d=function(){if(!--a.__u){if(a.state.__a){var c=a.state.__a;a.__v.__k[0]=Da(c,c.__c.__P,c.__c.__O)}var f;for(a.setState({__a:a.__b=null});f=a.o.pop();)f.__P=l,f.forceUpdate()}};a.__u++||32&t.__u||a.setState({__a:a.__b=a.__v.__k[0]}),e.then(s,s)},Gt.prototype.componentWillUnmount=function(){this.o=[]},Gt.prototype.render=function(e,t){if(this.__b){if(this.__v.__k){var r=document.createElement("div"),a=this.__v.__k[0].__c;this.__v.__k[0]=Fa(this.__b,r,a.__O=a.__P)}this.__b=null}var n=t.__a&&xe($,null,e.fallback);return n&&(n.__u&=-33),[xe($,null,t.__a?null:e.children),n]};var Ra=function(e,t,r){if(++r[1]===r[0]&&e.l.delete(t),e.props.revealOrder&&(e.props.revealOrder[0]!=="t"||!e.l.size))for(r=e.i;r;){for(;r.length>3;)r.pop()();if(r[1]<r[0])break;e.i=r=r[2]}};(mt.prototype=new X).__a=function(e){var t=this,r=Ba(t.__v),a=t.l.get(e);return a[0]++,function(n){var i=function(){t.props.revealOrder?(a.push(n),Ra(t,e,a)):n()};r?r(i):i()}},mt.prototype.render=function(e){this.i=null,this.l=new Map;var t=Ie(e.children);e.revealOrder&&e.revealOrder[0]==="b"&&t.reverse();for(var r=t.length;r--;)this.l.set(t[r],this.i=[1,0,this.i]);return e.children},mt.prototype.componentDidUpdate=mt.prototype.componentDidMount=function(){var e=this;this.l.forEach(function(t,r){Ra(e,r,t)})};var yi=typeof Symbol<"u"&&Symbol.for&&Symbol.for("react.element")||60103,xi=/^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|dominant|fill|flood|font|glyph(?!R)|horiz|image(!S)|letter|lighting|marker(?!H|W|U)|overline|paint|pointer|shape|stop|strikethrough|stroke|text(?!L)|transform|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/,ki=/^on(Ani|Tra|Tou|BeforeInp|Compo)/,wi=/[A-Z0-9]/g,Si=typeof document<"u",Ei=function(e){return(typeof Symbol<"u"&&typeof Symbol()=="symbol"?/fil|che|rad/:/fil|che|ra/).test(e)};X.prototype.isReactComponent=!0,["componentWillMount","componentWillReceiveProps","componentWillUpdate"].forEach(function(e){Object.defineProperty(X.prototype,e,{configurable:!0,get:function(){return this["UNSAFE_"+e]},set:function(t){Object.defineProperty(this,e,{configurable:!0,writable:!0,value:t})}})});var Ma=k.event;k.event=function(e){return Ma&&(e=Ma(e)),e.persist=function(){},e.isPropagationStopped=function(){return this.cancelBubble},e.isDefaultPrevented=function(){return this.defaultPrevented},e.nativeEvent=e};var Na,Ai={configurable:!0,get:function(){return this.class}},Ta=k.vnode;k.vnode=function(e){typeof e.type=="string"&&(function(t){var r=t.props,a=t.type,n={},i=a.indexOf("-")==-1;for(var s in r){var l=r[s];if(!(s==="value"&&"defaultValue"in r&&l==null||Si&&s==="children"&&a==="noscript"||s==="class"||s==="className")){var d=s.toLowerCase();s==="defaultValue"&&"value"in r&&r.value==null?s="value":s==="download"&&l===!0?l="":d==="translate"&&l==="no"?l=!1:d[0]==="o"&&d[1]==="n"?d==="ondoubleclick"?s="ondblclick":d!=="onchange"||a!=="input"&&a!=="textarea"||Ei(r.type)?d==="onfocus"?s="onfocusin":d==="onblur"?s="onfocusout":ki.test(s)&&(s=d):d=s="oninput":i&&xi.test(s)?s=s.replace(wi,"-$&").toLowerCase():l===null&&(l=void 0),d==="oninput"&&n[s=d]&&(s="oninputCapture"),n[s]=l}}a=="select"&&(n.multiple&&Array.isArray(n.value)&&(n.value=Ie(r.children).forEach(function(c){c.props.selected=n.value.indexOf(c.props.value)!=-1})),n.defaultValue!=null&&(n.value=Ie(r.children).forEach(function(c){c.props.selected=n.multiple?n.defaultValue.indexOf(c.props.value)!=-1:n.defaultValue==c.props.value}))),r.class&&!r.className?(n.class=r.class,Object.defineProperty(n,"className",Ai)):r.className&&(n.class=n.className=r.className),t.props=n})(e),e.$$typeof=yi,Ta&&Ta(e)};var Pa=k.__r;k.__r=function(e){Pa&&Pa(e),Na=e.__c};var Ca=k.diffed;k.diffed=function(e){Ca&&Ca(e);var t=e.props,r=e.__e;r!=null&&e.type==="textarea"&&"value"in t&&t.value!==r.value&&(r.value=t.value==null?"":t.value),Na=null};var $a=`#version 300 es
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
}`;var Ha=1920*1080*4,Ne=class{parentElement;canvasElement;gl;program=null;uniformLocations={};fragmentShader;rafId=null;lastRenderTime=0;currentFrame=0;speed=0;currentSpeed=0;providedUniforms;mipmaps=[];hasBeenDisposed=!1;resolutionChanged=!0;textures=new Map;minPixelRatio;maxPixelCount;isSafari=Pi();uniformCache={};textureUnitMap=new Map;ownerDocument;constructor(t,r,a,n,i=0,s=0,l=2,d=Ha,c=[]){if(t?.nodeType===1)this.parentElement=t;else throw new Error("Paper Shaders: parent element must be an HTMLElement");if(this.ownerDocument=t.ownerDocument,!this.ownerDocument.querySelector("style[data-paper-shader]")){let u=this.ownerDocument.createElement("style");u.innerHTML=Ti,u.setAttribute("data-paper-shader",""),this.ownerDocument.head.prepend(u)}let f=this.ownerDocument.createElement("canvas");this.canvasElement=f,this.parentElement.prepend(f),this.fragmentShader=r,this.providedUniforms=a,this.mipmaps=c,this.currentFrame=s,this.minPixelRatio=l,this.maxPixelCount=d;let _=f.getContext("webgl2",n);if(!_)throw new Error("Paper Shaders: WebGL is not supported in this browser");this.gl=_,this.initProgram(),this.setupPositionAttribute(),this.setupUniforms(),this.setUniformValues(this.providedUniforms),this.setupResizeObserver(),visualViewport?.addEventListener("resize",this.handleVisualViewportChange),this.setupIntersectionObserver(),this.setSpeed(i),this.parentElement.setAttribute("data-paper-shader",""),this.parentElement.paperShaderMount=this,this.ownerDocument.addEventListener("visibilitychange",this.handleDocumentVisibilityChange)}initProgram=()=>{let t=Mi(this.gl,$a,this.fragmentShader);t&&(this.program=t)};setupPositionAttribute=()=>{let t=this.gl.getAttribLocation(this.program,"a_position"),r=this.gl.createBuffer();this.gl.bindBuffer(this.gl.ARRAY_BUFFER,r);let a=[-1,-1,1,-1,-1,1,-1,1,1,-1,1,1];this.gl.bufferData(this.gl.ARRAY_BUFFER,new Float32Array(a),this.gl.STATIC_DRAW),this.gl.enableVertexAttribArray(t),this.gl.vertexAttribPointer(t,2,this.gl.FLOAT,!1,0,0)};setupUniforms=()=>{let t={u_time:this.gl.getUniformLocation(this.program,"u_time"),u_pixelRatio:this.gl.getUniformLocation(this.program,"u_pixelRatio"),u_resolution:this.gl.getUniformLocation(this.program,"u_resolution")};Object.entries(this.providedUniforms).forEach(([r,a])=>{if(t[r]=this.gl.getUniformLocation(this.program,r),a instanceof HTMLImageElement){let n=`${r}AspectRatio`;t[n]=this.gl.getUniformLocation(this.program,n)}}),this.uniformLocations=t};renderScale=1;parentWidth=0;parentHeight=0;parentDevicePixelWidth=0;parentDevicePixelHeight=0;devicePixelsSupported=!1;intersectionObserver=null;isInViewport=!0;resizeObserver=null;setupResizeObserver=()=>{this.resizeObserver=new ResizeObserver(([t])=>{if(t?.borderBoxSize[0]){let r=t.devicePixelContentBoxSize?.[0];r!==void 0&&(this.devicePixelsSupported=!0,this.parentDevicePixelWidth=r.inlineSize,this.parentDevicePixelHeight=r.blockSize),this.parentWidth=t.borderBoxSize[0].inlineSize,this.parentHeight=t.borderBoxSize[0].blockSize}this.handleResize()}),this.resizeObserver.observe(this.parentElement)};setupIntersectionObserver=()=>{let t=this.ownerDocument.defaultView;t?.IntersectionObserver&&(this.intersectionObserver=new t.IntersectionObserver(([r])=>{this.isInViewport=r?.isIntersecting??!0,this.updateCurrentSpeed()}),this.intersectionObserver.observe(this.parentElement))};handleVisualViewportChange=()=>{this.resizeObserver?.disconnect(),this.setupResizeObserver()};handleResize=()=>{let t=0,r=0,a=Math.max(1,window.devicePixelRatio),n=visualViewport?.scale??1;if(this.devicePixelsSupported){let f=Math.max(1,this.minPixelRatio/a);t=this.parentDevicePixelWidth*f*n,r=this.parentDevicePixelHeight*f*n}else{let f=Math.max(a,this.minPixelRatio)*n;if(this.isSafari){let _=Ci(this.ownerDocument);f*=Math.max(1,_)}t=Math.round(this.parentWidth)*f,r=Math.round(this.parentHeight)*f}let i=Math.sqrt(this.maxPixelCount)/Math.sqrt(t*r),s=Math.min(1,i),l=Math.round(t*s),d=Math.round(r*s),c=l/Math.round(this.parentWidth);(this.canvasElement.width!==l||this.canvasElement.height!==d||this.renderScale!==c)&&(this.renderScale=c,this.canvasElement.width=l,this.canvasElement.height=d,this.resolutionChanged=!0,this.gl.viewport(0,0,this.gl.canvas.width,this.gl.canvas.height),this.render(performance.now()))};render=t=>{if(this.hasBeenDisposed)return;if(this.program===null){console.warn("Tried to render before program or gl was initialized");return}let r=t-this.lastRenderTime;this.lastRenderTime=t,this.currentSpeed!==0&&(this.currentFrame+=r*this.currentSpeed),this.gl.clear(this.gl.COLOR_BUFFER_BIT),this.gl.useProgram(this.program),this.gl.uniform1f(this.uniformLocations.u_time,this.currentFrame*.001),this.resolutionChanged&&(this.gl.uniform2f(this.uniformLocations.u_resolution,this.gl.canvas.width,this.gl.canvas.height),this.gl.uniform1f(this.uniformLocations.u_pixelRatio,this.renderScale),this.resolutionChanged=!1),this.gl.drawArrays(this.gl.TRIANGLES,0,6),this.currentSpeed!==0?this.requestRender():this.rafId=null};requestRender=()=>{this.rafId!==null&&cancelAnimationFrame(this.rafId),this.rafId=requestAnimationFrame(this.render)};setTextureUniform=(t,r)=>{if(!r.complete||r.naturalWidth===0)throw new Error(`Paper Shaders: image for uniform ${t} must be fully loaded`);let a=this.textures.get(t);a&&this.gl.deleteTexture(a),this.textureUnitMap.has(t)||this.textureUnitMap.set(t,this.textureUnitMap.size);let n=this.textureUnitMap.get(t);this.gl.activeTexture(this.gl.TEXTURE0+n);let i=this.gl.createTexture();this.gl.bindTexture(this.gl.TEXTURE_2D,i),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_WRAP_S,this.gl.CLAMP_TO_EDGE),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_WRAP_T,this.gl.CLAMP_TO_EDGE),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MIN_FILTER,this.gl.LINEAR),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MAG_FILTER,this.gl.LINEAR),this.gl.texImage2D(this.gl.TEXTURE_2D,0,this.gl.RGBA,this.gl.RGBA,this.gl.UNSIGNED_BYTE,r),this.mipmaps.includes(t)&&(this.gl.generateMipmap(this.gl.TEXTURE_2D),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MIN_FILTER,this.gl.LINEAR_MIPMAP_LINEAR));let s=this.gl.getError();if(s!==this.gl.NO_ERROR||i===null){console.error("Paper Shaders: WebGL error when uploading texture:",s);return}this.textures.set(t,i);let l=this.uniformLocations[t];if(l){this.gl.uniform1i(l,n);let d=`${t}AspectRatio`,c=this.uniformLocations[d];if(c){let f=r.naturalWidth/r.naturalHeight;this.gl.uniform1f(c,f)}}};areUniformValuesEqual=(t,r)=>t===r?!0:Array.isArray(t)&&Array.isArray(r)&&t.length===r.length?t.every((a,n)=>this.areUniformValuesEqual(a,r[n])):!1;setUniformValues=t=>{this.gl.useProgram(this.program),Object.entries(t).forEach(([r,a])=>{let n=a;if(a instanceof HTMLImageElement&&(n=`${a.src.slice(0,200)}|${a.naturalWidth}x${a.naturalHeight}`),this.areUniformValuesEqual(this.uniformCache[r],n))return;this.uniformCache[r]=n;let i=this.uniformLocations[r];if(!i){console.warn(`Uniform location for ${r} not found`);return}if(a instanceof HTMLImageElement)this.setTextureUniform(r,a);else if(Array.isArray(a)){let s=null,l=null;if(a[0]!==void 0&&Array.isArray(a[0])){let d=a[0].length;if(a.every(c=>c.length===d))s=a.flat(),l=d;else{console.warn(`All child arrays must be the same length for ${r}`);return}}else s=a,l=s.length;switch(l){case 2:this.gl.uniform2fv(i,s);break;case 3:this.gl.uniform3fv(i,s);break;case 4:this.gl.uniform4fv(i,s);break;case 9:this.gl.uniformMatrix3fv(i,!1,s);break;case 16:this.gl.uniformMatrix4fv(i,!1,s);break;default:console.warn(`Unsupported uniform array length: ${l}`)}}else typeof a=="number"?this.gl.uniform1f(i,a):typeof a=="boolean"?this.gl.uniform1i(i,a?1:0):console.warn(`Unsupported uniform type for ${r}: ${typeof a}`)})};getCurrentFrame=()=>this.currentFrame;setFrame=t=>{this.currentFrame=t,this.lastRenderTime=performance.now(),this.render(performance.now())};setSpeed=(t=1)=>{this.speed=t,this.updateCurrentSpeed()};updateCurrentSpeed=()=>{this.setCurrentSpeed(this.ownerDocument.hidden||!this.isInViewport?0:this.speed)};setCurrentSpeed=t=>{this.currentSpeed=t,this.rafId===null&&t!==0&&(this.lastRenderTime=performance.now(),this.rafId=requestAnimationFrame(this.render)),this.rafId!==null&&t===0&&(cancelAnimationFrame(this.rafId),this.rafId=null)};setMaxPixelCount=(t=Ha)=>{this.maxPixelCount=t,this.handleResize()};setMinPixelRatio=(t=2)=>{this.minPixelRatio=t,this.handleResize()};setUniforms=t=>{this.setUniformValues(t),this.providedUniforms={...this.providedUniforms,...t},this.render(performance.now())};handleDocumentVisibilityChange=()=>{this.updateCurrentSpeed()};dispose=()=>{this.hasBeenDisposed=!0,this.rafId!==null&&(cancelAnimationFrame(this.rafId),this.rafId=null),this.gl&&this.program&&(this.textures.forEach(t=>{this.gl.deleteTexture(t)}),this.textures.clear(),this.gl.deleteProgram(this.program),this.program=null,this.gl.bindBuffer(this.gl.ARRAY_BUFFER,null),this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER,null),this.gl.bindRenderbuffer(this.gl.RENDERBUFFER,null),this.gl.bindFramebuffer(this.gl.FRAMEBUFFER,null),this.gl.getError()),this.resizeObserver&&(this.resizeObserver.disconnect(),this.resizeObserver=null),this.intersectionObserver&&(this.intersectionObserver.disconnect(),this.intersectionObserver=null),visualViewport?.removeEventListener("resize",this.handleVisualViewportChange),this.ownerDocument.removeEventListener("visibilitychange",this.handleDocumentVisibilityChange),this.uniformLocations={},this.canvasElement.remove(),delete this.parentElement.paperShaderMount}};function za(e,t,r){let a=e.createShader(t);return a?(e.shaderSource(a,r),e.compileShader(a),e.getShaderParameter(a,e.COMPILE_STATUS)?a:(console.error("An error occurred compiling the shaders: "+e.getShaderInfoLog(a)),e.deleteShader(a),null)):null}function Mi(e,t,r){let a=e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT),n=a?a.precision:null;n&&n<23&&(t=t.replace(/precision\s+(lowp|mediump)\s+float;/g,"precision highp float;"),r=r.replace(/precision\s+(lowp|mediump)\s+float/g,"precision highp float").replace(/\b(uniform|varying|attribute)\s+(lowp|mediump)\s+(\w+)/g,"$1 highp $3"));let i=za(e,e.VERTEX_SHADER,t),s=za(e,e.FRAGMENT_SHADER,r);if(!i||!s)return null;let l=e.createProgram();return l?(e.attachShader(l,i),e.attachShader(l,s),e.linkProgram(l),e.getProgramParameter(l,e.LINK_STATUS)?(e.detachShader(l,i),e.detachShader(l,s),e.deleteShader(i),e.deleteShader(s),l):(console.error("Unable to initialize the shader program: "+e.getProgramInfoLog(l)),e.deleteProgram(l),e.deleteShader(i),e.deleteShader(s),null)):null}var Ti=`@layer paper-shaders {
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
}`;function Pi(){let e=navigator.userAgent.toLowerCase();return e.includes("safari")&&!e.includes("chrome")&&!e.includes("android")}function Ci(e){let t=visualViewport?.scale??1,r=visualViewport?.width??window.innerWidth,a=window.innerWidth-e.documentElement.clientWidth,n=t*r+a,i=outerWidth/n,s=Math.round(100*i);return s%5===0?s/100:s===33?1/3:s===67?2/3:s===133?4/3:i}var we={fit:"contain",scale:1,rotation:0,offsetX:0,offsetY:0,originX:.5,originY:.5,worldWidth:0,worldHeight:0};var Xt={none:0,contain:1,cover:2};var Va=`
#define TWO_PI 6.28318530718
#define PI 3.14159265358979323846
`,Wa=`
vec2 rotate(vec2 uv, float th) {
  return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
}
`;var Ga=`
  float hash21(vec2 p) {
    p = fract(p * vec2(0.3183099, 0.3678794)) + 0.1;
    p += dot(p, p + 19.19);
    return fract(p.x * p.y);
  }
`;var qt={maxColorCount:10},Yt=`#version 300 es
precision mediump float;

uniform float u_time;

uniform vec4 u_colors[${qt.maxColorCount}];
uniform float u_colorsCount;

uniform float u_distortion;
uniform float u_swirl;
uniform float u_grainMixer;
uniform float u_grainOverlay;

in vec2 v_objectUV;
out vec4 fragColor;

${Va}
${Wa}
${Ga}

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

  for (int i = 0; i < ${qt.maxColorCount}; i++) {
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
`;function Jt(e){if(Array.isArray(e))return e.length===4?e:e.length===3?[...e,1]:Se;if(typeof e!="string")return Se;let t,r,a,n=1;if(e.startsWith("#"))[t,r,a,n]=Oi(e);else if(e.startsWith("rgb")){let i=Ii(e);if(i===null)return Se;[t,r,a,n]=i}else if(e.startsWith("hsl")){let i=Ui(e);if(i===null)return Se;[t,r,a,n]=Li(i)}else return console.error("Unsupported color format",e),Se;return[_t(t,0,1),_t(r,0,1),_t(a,0,1),_t(n,0,1)]}function Oi(e){if(e=e.replace(/^#/,""),(e.length===3||e.length===4)&&(e=e.split("").map(i=>i+i).join("")),e.length===6&&(e=e+"ff"),!/^[0-9a-f]{8}$/i.test(e))return console.warn("Invalid hex color"),Se;let t=parseInt(e.slice(0,2),16)/255,r=parseInt(e.slice(2,4),16)/255,a=parseInt(e.slice(4,6),16)/255,n=parseInt(e.slice(6,8),16)/255;return[t,r,a,n]}function Ii(e){let t=e.match(/^rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([0-9.]+))?\s*\)$/i);return t?[parseInt(t[1]??"0")/255,parseInt(t[2]??"0")/255,parseInt(t[3]??"0")/255,t[4]===void 0?1:parseFloat(t[4])]:null}function Ui(e){let t=e.match(/^hsla?\s*\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*(?:,\s*([0-9.]+))?\s*\)$/i);return t?[parseInt(t[1]??"0"),parseInt(t[2]??"0"),parseInt(t[3]??"0"),t[4]===void 0?1:parseFloat(t[4])]:null}function Li(e){let[t,r,a,n]=e,i=t/360,s=r/100,l=a/100,d,c,f;if(r===0)d=c=f=l;else{let _=(h,b,g)=>(g<0&&(g+=1),g>1&&(g-=1),g<.16666666666666666?h+(b-h)*6*g:g<.5?b:g<.6666666666666666?h+(b-h)*(.6666666666666666-g)*6:h),u=l<.5?l*(1+s):l+s-l*s,m=2*l-u;d=_(m,u,i+1/3),c=_(m,u,i),f=_(m,u,i-1/3)}return[d,c,f,n]}var _t=(e,t,r)=>Math.min(Math.max(e,t),r),Se=[.5,.5,.5,1];var Kt="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";function ja(e){let t=S(void 0),r=It(a=>{let n=e.map(i=>{if(i!=null){if(typeof i=="function"){let s=i,l=s(a);return typeof l=="function"?l:()=>{s(null)}}return i.current=a,()=>{i.current=null}}});return()=>{n.forEach(i=>i?.())}},e);return Le(()=>e.every(a=>a==null)?null:a=>{t.current&&(t.current(),t.current=void 0),a!=null&&(t.current=r(a))},e)}function Zt(e){if(e.naturalWidth<1024&&e.naturalHeight<1024){if(e.naturalWidth<1||e.naturalHeight<1)return;let t=e.naturalWidth/e.naturalHeight;e.width=Math.round(t>1?1024*t:1024),e.height=Math.round(t>1?1024:1024/t)}}async function Xa(e){let t={},r=[],a=i=>{try{return i.startsWith("/")||new URL(i),!0}catch{return!1}},n=i=>{try{return i.startsWith("/")?!1:new URL(i,window.location.origin).origin!==window.location.origin}catch{return!1}};return Object.entries(e).forEach(([i,s])=>{if(typeof s=="string"){let l=s||Kt;if(!a(l)){console.warn(`Uniform "${i}" has invalid URL "${l}". Skipping image loading.`);return}let d=new Promise((c,f)=>{let _=new Image;n(l)&&(_.crossOrigin="anonymous"),_.onload=()=>{Zt(_),t[i]=_,c()},_.onerror=()=>{console.error(`Could not set uniforms. Failed to load image at ${l}`),f()},_.src=l});r.push(d)}else if(s instanceof HTMLImageElement){let l=s.decode().then(()=>{Zt(s),t[i]=s});r.push(l)}else t[i]=s}),await Promise.all(r),t}var Qt=La(function({fragmentShader:t,uniforms:r,webGlContextAttributes:a,speed:n=0,frame:i=0,width:s,height:l,minPixelRatio:d,maxPixelCount:c,mipmaps:f,style:_,...u},m){let[h,b]=R(!1),g=S(null),y=S(null),x=S(a);E(()=>((async()=>{let T=await Xa(r);g.current&&!y.current&&(y.current=new Ne(g.current,t,T,x.current,n,i,d,c,f),b(!0))})(),()=>{y.current?.dispose(),y.current=null}),[t]),E(()=>{let F=!1;return(async()=>{let O=await Xa(r);F||y.current?.setUniforms(O)})(),()=>{F=!0}},[r,h]),E(()=>{y.current?.setSpeed(n)},[n,h]),E(()=>{y.current?.setMaxPixelCount(c)},[c,h]),E(()=>{y.current?.setMinPixelRatio(d)},[d,h]),E(()=>{y.current?.setFrame(i)},[i,h]);let M=ja([g,m]);return o("div",{ref:M,style:s!==void 0||l!==void 0?{width:typeof s=="string"&&isNaN(+s)===!1?+s:s,height:typeof l=="string"&&isNaN(+l)===!1?+l:l,..._}:_,...u})});Qt.displayName="ShaderMount";function qa(e,t){if(Object.keys(e).length!==Object.keys(t).length)return!1;for(let r in e){if(r==="colors"){let a=Array.isArray(e.colors),n=Array.isArray(t.colors);if(!a||!n){if(Object.is(e.colors,t.colors)===!1)return!1;continue}if(e.colors?.length!==t.colors?.length||!e.colors?.every((i,s)=>i===t.colors?.[s]))return!1;continue}if(Object.is(e[r],t[r])===!1)return!1}return!0}var H={name:"Default",params:{...we,speed:1,frame:0,colors:["#e0eaff","#241d9a","#f75092","#9f50d3"],distortion:.8,swirl:.1,grainMixer:0,grainOverlay:0}},Ts={name:"Purple",params:{...we,speed:.6,frame:0,colors:["#aaa7d7","#3c2b8e"],distortion:1,swirl:1,grainMixer:0,grainOverlay:0}},Ps={name:"Beach",params:{...we,speed:.1,frame:0,colors:["#bcecf6","#00aaff","#00f7ff","#ffd447"],distortion:.8,swirl:.35,grainMixer:0,grainOverlay:0}},Cs={name:"Ink",params:{...we,speed:1,frame:0,colors:["#ffffff","#000000"],distortion:1,swirl:.2,rotation:90,grainMixer:0,grainOverlay:0}};var er=Ua(function({speed:t=H.params.speed,frame:r=H.params.frame,colors:a=H.params.colors,distortion:n=H.params.distortion,swirl:i=H.params.swirl,grainMixer:s=H.params.grainMixer,grainOverlay:l=H.params.grainOverlay,fit:d=H.params.fit,rotation:c=H.params.rotation,scale:f=H.params.scale,originX:_=H.params.originX,originY:u=H.params.originY,offsetX:m=H.params.offsetX,offsetY:h=H.params.offsetY,worldWidth:b=H.params.worldWidth,worldHeight:g=H.params.worldHeight,...y}){let x={u_colors:a.map(Jt),u_colorsCount:a.length,u_distortion:n,u_swirl:i,u_grainMixer:s,u_grainOverlay:l,u_fit:Xt[d],u_rotation:c,u_scale:f,u_offsetX:m,u_offsetY:h,u_originX:_,u_originY:u,u_worldWidth:b,u_worldHeight:g};return o(Qt,{...y,speed:t,frame:r,fragmentShader:Yt,uniforms:x})},qa);var $e="#fb7185",He="#f43f5e",tr=e=>{let t=e.replace("#",""),r=t.length===3?t.split("").map(n=>n+n).join(""):t,a=Number.parseInt(r,16);return[a>>16&255,a>>8&255,a&255]},rr=(e,t)=>{switch(e){case"listening":return .4+.32*Math.abs(Math.sin(t*8.5))+.18*Math.abs(Math.sin(t*4.1+1.5));case"speaking":return .3+.24*Math.abs(Math.sin(t*6.2))+.16*Math.abs(Math.sin(t*3+.6));case"thinking":return .24+.2*Math.abs(Math.sin(t*2.4));case"connecting":return .12+.1*Math.abs(Math.sin(t*1.6));case"error":return .2;default:return 0}},fe=(e,t,r,a)=>e+(t-e)*(1-Math.exp(-r*a)),Ya=({size:e,speed:t,colorFrom:r,colorTo:a})=>{let n={};return e!=null&&(n["--orb-size"]=`${e}px`),t!=null&&(n["--orb-speed"]=`${t}`),r&&(n["--orb-color-from"]=r),a&&(n["--orb-color-to"]=a),n};var gt=(e,t)=>{let r=!0,a=document.visibilityState==="visible",n=r&&a,i=()=>{let d=r&&a;d!==n&&(n=d,t(d))},s=new IntersectionObserver(d=>{r=d[d.length-1]?.isIntersecting??!0,i()});s.observe(e);let l=()=>{a=document.visibilityState==="visible",i()};return document.addEventListener("visibilitychange",l),()=>{s.disconnect(),document.removeEventListener("visibilitychange",l)}},ze=null,Ja=()=>{if(ze!==null)return ze;try{let e=document.createElement("canvas"),t={failIfMajorPerformanceCaveat:!0};ze=e.getContext("webgl2",t)!==null||e.getContext("webgl",t)!==null}catch{ze=!1}return ze};var en="(prefers-reduced-motion: reduce)",Fi=e=>{let t=window.matchMedia(en);return t.addEventListener("change",e),()=>t.removeEventListener("change",e)},Di=()=>Ia(Fi,()=>window.matchMedia(en).matches),he=(e,t,r)=>{let[a,n,i]=tr(e),[s,l,d]=tr(t),c=(f,_)=>Math.round(f+(_-f)*r).toString(16).padStart(2,"0");return`#${c(a,s)}${c(n,l)}${c(i,d)}`},tn=(e,t)=>he(e,"#000000",t),vt=(e,t)=>he(e,"#ffffff",t),rn=(e,t)=>[tn(e,.35),e,he(e,t,.5),t,vt(t,.35)],Ka=rn($e,He),Bi={antialias:!0,powerPreference:"low-power"},Ni=8e3,$i=66,Hi=.1,zi=7.5,Za=6,Vi=5,Wi=6,Gi=6,ji=.9,Xi=e=>e==="error"?1.8:e==="listening"?1.6:e==="speaking"?1.1:e==="thinking"?.95:e==="connecting"?.5:.3,ar=e=>e==="error"?.2:e==="speaking"?.18:e==="listening"?.16:e==="thinking"?.1:e==="connecting"?.08:.06,qi={distortion:.42,swirl:.26},nr=(e,t,r=qi)=>{switch(e){case"thinking":return{distortion:.35,swirl:Math.min(1,.75+t*.2)};case"listening":case"speaking":return{distortion:Math.min(1,.5+t*.4),swirl:Math.min(1,.3+t*.25)};case"error":return{distortion:.85,swirl:.55};case"connecting":return{distortion:Math.min(1,.42+t*.55),swirl:.3};default:return r}},an=(e,t)=>e==="disabled"?0:Xi(e)*t,Qa=(e,t,r)=>({energy:0,...nr(e,0,r),shaderSpeed:an(e,t),grain:ar(e),errorMix:e==="error"?1:0}),Ee=(e,t)=>Math.round(e*t)/t,Yi=(e,t)=>e.energy===t.energy&&e.distortion===t.distortion&&e.swirl===t.swirl&&e.shaderSpeed===t.shaderSpeed&&e.grain===t.grain&&e.errorMix===t.errorMix,ir=({state:e="idle",size:t=160,speed:r=1,colorFrom:a="#7c3aed",colorTo:n="#06b6d4",colors:i,idleMotion:s,meshScale:l=1.15,gloss:d=!0,levelRef:c,label:f="Assistant orb",className:_})=>{let u=S(null),m=S(null),h=S(e),b=S(r),g=Di(),y=Ja(),x=S(s);x.current=s;let[M,F]=R(()=>Qa(e,r,s)),T=S(null);E(()=>{h.current=e,b.current=r}),E(()=>{if(g)return;let L=u.current;if(!L)return;T.current===null&&(T.current=Qa(h.current,b.current,x.current));let A=T.current,W=0,Z=null,ce=0,me=0,ue=!0,_e=Q=>{W=0;let q=Math.min(Hi,Z===null?1/60:(Q-Z)/1e3);Z=Q;let Y=h.current,Re=b.current;ce+=q*Re;let ne=c?.current,Me=typeof ne=="number"&&ne>=0;A.energy=fe(A.energy,Me?ne:rr(Y,ce),zi,q);let ie=nr(Y,A.energy,x.current);if(A.distortion=fe(A.distortion,ie.distortion,Za,q),A.swirl=fe(A.swirl,ie.swirl,Za,q),A.shaderSpeed=fe(A.shaderSpeed,an(Y,Re),Vi,q),A.grain=fe(A.grain,ar(Y),Wi,q),A.errorMix=fe(A.errorMix,Y==="error"?1:0,Gi,q),L.style.setProperty("--orb-level",A.energy.toFixed(3)),y&&Q-me>$i){me=Q;let bt={energy:Ee(A.energy,50),distortion:Ee(A.distortion,100),swirl:Ee(A.swirl,100),shaderSpeed:Ee(A.shaderSpeed,100),grain:Ee(A.grain,200),errorMix:Ee(A.errorMix,100)};F(ee=>Yi(ee,bt)?ee:bt)}ue&&(W=requestAnimationFrame(_e))},We=()=>{W===0&&(Z=null,W=requestAnimationFrame(_e))},ge=()=>{W!==0&&(cancelAnimationFrame(W),W=0),Z=null},de=gt(L,Q=>{ue=Q,Q?We():ge()});return We(),()=>{ge(),de()}},[c,g,y]),E(()=>{if(e!=="error"||g)return;let L=m.current;if(!L)return;let A=L.animate([{transform:"translateX(0)"},{transform:"translateX(-1.5px)"},{transform:"translateX(3px)"},{transform:"translateX(-2px)"},{transform:"translateX(1px)"},{transform:"translateX(0)"}],{duration:340,easing:"ease-out"});return()=>A.cancel()},[e,g]);let O=rr(e,ji),P=g?{energy:O,...nr(e,O,s),shaderSpeed:0,grain:ar(e),errorMix:e==="error"?1:0}:M,D=y?P.errorMix:e==="error"?1:0,V=D>=1?$e:D<=0?a:he(a,$e,D),U=D>=1?He:D<=0?n:he(n,He,D),z=i??rn(a,n),Ve=D>=1?Ka:D<=0?z:z.map((L,A)=>he(L,Ka[A],D)),le=[{key:"brand",from:a,to:n,visible:e!=="error"},{key:"error",from:$e,to:He,visible:e==="error"}].map(({key:L,from:A,to:W,visible:Z})=>({key:L,visible:Z,base:`radial-gradient(circle at 50% 40%, ${vt(A,.12)}, ${he(A,W,.55)} 55%, ${tn(W,.35)} 100%)`,glow:`radial-gradient(circle at 32% 26%, ${vt(W,.45)}, transparent 55%), radial-gradient(circle at 66% 72%, ${vt(A,.2)}, transparent 62%)`})),Ae={...Ya({size:t,speed:r,colorFrom:a,colorTo:n}),...g?{"--orb-level":O.toFixed(3)}:null,width:t,height:t,position:"relative",borderRadius:"50%",opacity:e==="disabled"?.5:1,filter:e==="disabled"?"grayscale(0.85)":"grayscale(0)",transform:y?`scale(${(1+P.energy*.06).toFixed(4)})`:void 0,scale:y?void 0:"calc(1 + var(--orb-level, 0) * 0.06)",transition:"transform 0.2s ease-out, opacity 0.3s ease-out, filter 0.3s ease-out"};return o("div",{ref:u,role:"img","aria-label":f,"data-state":e,class:_,style:Ae,children:[o("div",{style:{position:"absolute",inset:0,borderRadius:"50%",boxShadow:`0 ${-t*.06}px ${t*.3}px color-mix(in oklab, ${V} 55%, transparent), 0 ${t*.06}px ${t*.3}px color-mix(in oklab, ${U} 55%, transparent)`,opacity:y?Math.min(1,.35+P.energy*.65):"calc(0.35 + var(--orb-level, 0) * 0.6)",transform:y?`scale(${(1+P.energy*.08).toFixed(4)})`:void 0,scale:y?void 0:"calc(1 + var(--orb-level, 0) * 0.08)",transition:y?"opacity 0.2s ease-out, transform 0.2s ease-out, box-shadow 0.35s ease":"box-shadow 0.35s ease"}}),o("div",{ref:m,style:{position:"absolute",inset:0,borderRadius:"50%",overflow:"hidden",boxShadow:`inset 0 0 0 1px color-mix(in oklab, ${V} 45%, transparent), 0 0 0 1px rgba(255,255,255,0.08)`,transition:"box-shadow 0.35s ease"},children:[y?o(er,{width:t,height:t,colors:Ve,distortion:P.distortion,swirl:P.swirl,scale:l,speed:P.shaderSpeed,frame:Ni,grainMixer:P.grain,grainOverlay:.05,minPixelRatio:2,webGlContextAttributes:Bi}):o("div",{"aria-hidden":"true",style:{position:"absolute",inset:0,borderRadius:"50%"},children:le.map(L=>o("div",{style:{position:"absolute",inset:0,borderRadius:"50%",backgroundImage:L.base,opacity:L.visible?1:0,transition:"opacity 0.35s ease"},children:o("div",{style:{position:"absolute",inset:0,borderRadius:"50%",backgroundImage:L.glow,opacity:"calc(0.25 + var(--orb-level, 0) * 0.75)"}})},L.key))}),d&&o("div",{style:{position:"absolute",inset:0,borderRadius:"50%",pointerEvents:"none",backgroundImage:"radial-gradient(circle at 31% 22%, rgba(255,255,255,0.55), transparent 14%), radial-gradient(circle at 30% 26%, rgba(255,255,255,0.28), transparent 48%), radial-gradient(circle at 68% 76%, rgba(10,14,24,0.42), transparent 60%)"}})]})]})};var ln=["#9483ec","#bcc0f7","#6a8bf1","#7fd6fb","#f2f4ff"],cn=1.6,un={distortion:1,swirl:.85},nn=.76,Ji=.86,dn=10,on=()=>typeof window<"u"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;function or(e,t){let r=.5+.5*Math.sin(t*.85),a=e/2*(nn+(Ji-nn)*r);return{rx:a*(1+.035*Math.sin(t*1.3)),ry:a*(1+.035*Math.sin(t*1.7+1.2)),cx:e/2+e*.012*Math.sin(t*.7),cy:e/2+e*.012*Math.cos(t*.8+.5)}}var pn=({rx:e,ry:t,cx:r,cy:a})=>`${e.toFixed(1)}px ${t.toFixed(1)}px at ${r.toFixed(1)}px ${a.toFixed(1)}px`,sr=e=>`radial-gradient(${pn(e)}, #000 0%, #000 ${100-dn}%, transparent 100%)`,sn=e=>`radial-gradient(${pn(e)}, transparent 0%, transparent ${100-dn}%, #000 100%)`;function lr(e,t){e&&(e.style.maskImage=t,e.style.setProperty("-webkit-mask-image",t))}function fn({size:e,state:t="idle",label:r="Assistant"}){let a={position:"absolute",inset:0,borderRadius:"50%"},n=b=>`${Math.max(1,e*b)}px`,i=S(null),s=S(null),l=S(null),d=S(null),c=S(null),f=S(null),_=or(e,0);E(()=>{let b=O=>{lr(s.current,sr(O)),lr(l.current,sr(O)),lr(d.current,sn(O))};if(b(or(e,0)),on()||!i.current)return;let g=0,y=performance.now(),x=O=>{b(or(e,(O-y)/1e3)),g=requestAnimationFrame(x)},M=()=>{g||(g=requestAnimationFrame(x))},F=()=>{cancelAnimationFrame(g),g=0},T=gt(i.current,O=>O?M():F());return M(),()=>{F(),T()}},[e]),E(()=>{if(on())return;let b=[c.current?.animate([{transform:"rotate(-20deg) scaleX(1)"},{transform:"rotate(160deg) scaleX(0.55)"},{transform:"rotate(340deg) scaleX(1)"}],{duration:9e3,iterations:1/0,easing:"ease-in-out"}),f.current?.animate([{transform:"rotate(70deg) scaleX(0.7)"},{transform:"rotate(-120deg) scaleX(1.1)"},{transform:"rotate(-290deg) scaleX(0.7)"}],{duration:13e3,iterations:1/0,easing:"ease-in-out"})];return()=>b.forEach(g=>g?.cancel())},[]);let u=(b,g,y,x)=>o("div",{ref:b,"aria-hidden":"true",style:{position:"absolute",inset:"-2%",background:`radial-gradient(ellipse 32% 58% at ${x}, transparent 95%, rgba(255,255,255,${g}) 97.5%, rgba(72,80,196,${y}) 99%, transparent 100%)`,filter:`blur(${n(.006)})`}}),m=sr(_),h=sn(_);return o("div",{ref:i,class:"ask-ai__orb",style:{position:"relative",width:e,height:e,flex:"0 0 auto"},children:[o("div",{"aria-hidden":"true",style:{position:"absolute",borderRadius:"50%",left:"4%",right:"4%",top:"34%",height:"100%",background:"radial-gradient(closest-side, rgba(122,108,236,0.5), rgba(122,108,236,0.18) 55%, rgba(122,108,236,0))",filter:`blur(${n(.1)})`}}),o(ir,{state:t,size:e,speed:cn,colors:ln,idleMotion:un,meshScale:.55,gloss:!1,label:r}),o("div",{ref:s,"aria-hidden":"true",style:{...a,overflow:"hidden",mixBlendMode:"soft-light",opacity:.8,maskImage:m,WebkitMaskImage:m},children:[u(c,.75,.3,"22% 50%"),u(f,.4,.18,"78% 44%")]}),o("div",{ref:l,"aria-hidden":"true",style:{...a,backdropFilter:`blur(${n(.006)})`,WebkitBackdropFilter:`blur(${n(.006)})`,background:"radial-gradient(circle at 50% 50%, rgba(244,245,255,0.1) 0%, rgba(244,245,255,0.18) 60%, rgba(244,245,255,0.3) 100%)",maskImage:m,WebkitMaskImage:m}}),o("div",{ref:d,"aria-hidden":"true",style:{...a,backdropFilter:`blur(${n(.07)}) saturate(1.1)`,WebkitBackdropFilter:`blur(${n(.07)}) saturate(1.1)`,background:"radial-gradient(circle at 38% 30%, rgba(248,248,255,0.62), rgba(238,239,252,0.5) 60%, rgba(236,237,252,0.58) 100%)",maskImage:h,WebkitMaskImage:h}}),o("div",{"aria-hidden":"true",style:{...a,pointerEvents:"none",boxShadow:`inset 0 0 ${n(.025)} rgba(255,255,255,0.9), 0 0 0 1px rgba(200,200,240,0.35)`}})]})}function hn({size:e=18}){return o(ir,{state:"thinking",size:e,speed:cn,colors:ln,idleMotion:un,meshScale:.55,gloss:!1,label:"Thinking"})}function mn({starters:e,mock:t,supportUrl:r,onPick:a}){return o("div",{class:"ask-ai__welcome",children:[o(fn,{size:80}),o("h3",{class:"ask-ai__greeting",children:"What do you want to build today?"}),t&&o("p",{class:"ask-ai__welcome-note",children:["A preview, not connected to an assistant. For a real answer, use"," ",o("a",{href:r,target:"_blank",rel:"noopener noreferrer",children:"support"}),"."]}),o("div",{class:"ask-ai__pills",children:e.map((n,i)=>o("button",{type:"button",class:"ask-ai__pill",style:{animationDelay:`${400+i*60}ms`},title:n.prompt===n.label?void 0:n.prompt,onClick:()=>a(n.prompt),children:n.label},n.prompt))})]})}var Ki=[{label:"Create an ABHA",prompt:"How do I create an ABHA with an Aadhaar OTP?"},{label:"Link care contexts",prompt:"How do I link care contexts to an ABHA?"},{label:"Request consent",prompt:"How does an HIU raise a consent request?"},{label:"Decode an error",prompt:"What does ABDM-1016 mean and how do I fix it?"},{label:"Learn about Ask AI",prompt:"What can the Ask AI assistant do?"}];function _n(e){let t=e.split(`
`).map(r=>r.trim()).filter(Boolean);return t.length?t.slice(0,5).map(r=>{let a=r.indexOf("|");if(a<0)return{label:r,prompt:r};let n=r.slice(0,a).trim(),i=r.slice(a+1).trim();return{label:n||i,prompt:i||n}}):Ki}function gn(e){let t=[];for(let r of e){if(r.from==="assistant"&&(r.install||r.local)){t.length&&t[t.length-1].from==="you"&&t.pop();continue}t.push(r)}return t}var vn=`/* ---------- theming ---------- */

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
`;var bn=()=>`${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`,Qi=".json,.txt,.log,.csv,.xml,.yaml,.yml,.md,.har,.pdf,.png,.jpg,.jpeg,.webp",dr=2e4,eo=256*1024,to=8*1024*1024;async function ro(e){let t=await import(`${ae}pdf.min.mjs`);t.GlobalWorkerOptions.workerSrc=`${ae}pdf.worker.min.mjs`;let r=t.getDocument({data:await e.arrayBuffer()}),a=await r.promise,n=[];for(let i=1;i<=a.numPages;i+=1){let s=await(await a.getPage(i)).getTextContent();if(n.push(s.items.map(l=>l.str??"").join(" ").replace(/[ \t]+/g," ").trim()),n.join(`

`).length>dr)break}return await a.cleanup?.(),await r.destroy(),n.join(`

`).trim()}async function ao(e,t){t("Loading the reader, once per browser."),await ot(`${ae}tesseract.min.js`);let r=window.Tesseract;t("Reading the text out of that image.");let a=await r.createWorker("eng",1,{workerPath:`${ae}worker.min.js`,corePath:ae,langPath:`${ae}lang`,cacheMethod:"none"});try{let{data:n}=await a.recognize(e);return(n.text??"").replace(/[ \t]+/g," ").trim()}finally{await a.terminate()}}var yn=24e3,xn=`

[This page was cut here to fit. Say so if the answer needs the rest of it.]`;function no(e){return e.length<=yn?e:e.slice(0,yn-xn.length)+xn}var io="This panel is a mock. No assistant is connected here yet, so nothing in it can answer that. The support page lists the channels a human reads.";function kn(e,t){e(r=>{let a=r[r.length-1];return[...r.slice(0,-1),{...a,text:a.text+t}]})}function oo(e){if(e.some(t=>t.install))return-1;for(let t=e.length-1;t>0;t-=1){let r=e[t];if(r.from!=="assistant"||r.text==="")continue;let a=e[t-1];return a?.from==="you"&&ua(a.text)?t:-1}return-1}function so(e,t){e(r=>{let a=r[r.length-1];return[...r.slice(0,-1),{...a,sources:t}]})}var cr=320,wn=960,ur="abdm-ask-ai-width",pr=!1;function lo({dialog:e}){let[t,r]=R(!1);return E(()=>{let n=Number(localStorage.getItem(ur));n>=cr&&e.current&&e.current.style.setProperty("--aa-panel-width",`${n}px`)},[]),o("div",{class:`ask-ai__grip${t?" ask-ai__grip--dragging":""}`,role:"separator","aria-orientation":"vertical","aria-label":"Resize the panel",tabIndex:0,onPointerDown:n=>{let i=e.current;if(!i)return;n.preventDefault(),pr=!0,r(!0),n.target.setPointerCapture(n.pointerId);let s=d=>{let c=window.innerWidth-d.clientX,f=Math.min(Math.max(c,cr),Math.min(wn,window.innerWidth));i.style.setProperty("--aa-panel-width",`${Math.round(f)}px`)},l=()=>{setTimeout(()=>{pr=!1},0),r(!1),window.removeEventListener("pointermove",s),window.removeEventListener("pointerup",l),window.removeEventListener("pointercancel",l);let d=i.style.getPropertyValue("--aa-panel-width");d&&localStorage.setItem(ur,String(parseInt(d,10)))};window.addEventListener("pointermove",s),window.addEventListener("pointerup",l),window.addEventListener("pointercancel",l)},onKeyDown:n=>{let i=n.key==="ArrowLeft"?32:n.key==="ArrowRight"?-32:0;if(!i||!e.current)return;n.preventDefault();let s=e.current.getBoundingClientRect().width,l=Math.min(Math.max(s+i,cr),wn);e.current.style.setProperty("--aa-panel-width",`${l}px`),localStorage.setItem(ur,String(l))},children:o("span",{class:"ask-ai__grip-bar","aria-hidden":"true"})})}function co({apiBase:e,docsOrigin:t,mcpUrl:r,pluginRepo:a,open:n,onClose:i,page:s,onDetach:l,onAttach:d,question:c,send:f,starters:_,keepHistory:u,supportUrl:m}){let[h,b]=R([]),g=s?ra(s.markdown).slice(0,4):[],y=g.length?g.map(p=>({label:p,prompt:p})):_,[x,M]=R(""),[F,T]=R(null),[O,P]=R(null),[D,V]=R(null),[U,z]=R("idle"),[Ve,le]=R(null),[Ae,L]=R(""),[A,W]=R(!1),[Z,ce]=R([]),[me,ue]=R("chat"),[_e,We]=R(null),[ge,de]=R("closed"),[Q,q]=R(null),Y=S(bn()),Re=S(null),ne=S(null),Me=S(null),ie=S(null),bt=S(null),ee=S(null),ve=U!=="idle",Sn=s!==null&&s.markdown!=="",J=S(""),be=S(!1),ye=S(!0),hr=S(0),mr=S(!1),K=S(0),Te=S(null),_r=()=>{K.current=requestAnimationFrame(_r);let p=J.current.length;if(p===0){if(!ye.current)return;cancelAnimationFrame(K.current),K.current=0,be.current=!1,Te.current&&(so(b,Te.current),Te.current=null),z("idle");return}let w=da(p,performance.now()-hr.current,be.current,mr.current);w!==0&&(be.current||(be.current=!0,z("streaming")),kn(b,J.current.slice(0,w)),J.current=J.current.slice(w))},Ge=p=>{J.current+=p},En=p=>{Te.current=p},gr=()=>{K.current&&cancelAnimationFrame(K.current),K.current=0,be.current=!1,J.current="",Te.current=null,ye.current=!0};E(()=>{if(!(!n||!c)){if(!f){M(p=>p||c);return}Re.current!==c&&(Re.current=c,Xe(c))}},[n,c,f]),E(()=>{let p=ne.current;p&&(n&&!p.open&&(p.showModal(),ie.current?.focus()),!n&&p.open&&p.close())},[n]),E(()=>{if(!n)return;let p=w=>{w.key==="Escape"&&(w.preventDefault(),w.stopPropagation(),ge!=="closed"?de("closed"):i())};return document.addEventListener("keydown",p,!0),()=>document.removeEventListener("keydown",p,!0)},[n,i,ge]);let je=S(!0),An=()=>{let p=Me.current;p&&(je.current=p.scrollHeight-p.scrollTop-p.clientHeight<40)};E(()=>{let p=Me.current;p&&je.current&&(p.scrollTop=p.scrollHeight)},[h,U,Ve]),E(()=>{let p=ie.current;if(!p)return;p.style.height="auto";let w=Math.min(p.scrollHeight,160);p.style.height=`${w}px`,p.style.overflowY=p.scrollHeight>w?"auto":"hidden"},[x]),E(()=>()=>{ee.current?.abort(),K.current&&cancelAnimationFrame(K.current)},[]);let yt=p=>{u&&p.some(w=>w.from==="you")&&ce(w=>{let v=fa(w,{id:Y.current,at:Date.now(),title:pa(p),turns:p.map(B=>B.file?{...B,file:{...B.file,text:""}}:B)});return Ht(v),v})};E(()=>{U==="idle"&&yt(h)},[U,h]),E(()=>{u&&ce(ha())},[u]);let Rn=p=>{yt(h),ee.current?.abort(),gr(),je.current=!0,Y.current=p.id,b(p.turns),ue("chat"),M(""),T(null),P(null),V(null),le(null),z("idle")},Mn=()=>{yt(h),Y.current=bn(),ue("chat"),de("closed"),ee.current?.abort(),gr(),je.current=!0,b([]),M(""),T(null),P(null),V(null),le(null),z("idle")},Tn=async p=>{if(!p)return;P(null);let w=p.name.toLowerCase(),v=p.type==="application/pdf"||w.endsWith(".pdf"),B=p.type.startsWith("image/"),xt=v||B?to:eo;if(p.size>xt){P("That file is too large. Attach the failing part of it.");return}let j;try{if(v){if(V("Reading the text in that PDF."),j=await ro(p),!j){V(null),P("That PDF has no text in it, only pictures of text. Attach a screenshot of the part you mean and it will be read.");return}}else B?j=await ao(p,V):j=await p.text()}catch{V(null),P("That file could not be read.");return}finally{V(null)}if(!v&&!B&&j.includes("\uFFFD")){P("That looks like a binary file. Text and JSON only.");return}if(j.length>dr){P(`That file is ${j.length.toLocaleString()} characters. Attach at most ${dr.toLocaleString()}.`);return}if(!j.trim()){P(B?"No text could be read out of that image.":"That file is empty.");return}T({name:p.name,text:j,kind:v?"pdf":B?"image":void 0}),ie.current?.focus()},Pn=()=>{ee.current?.abort(),J.current&&kn(b,J.current),J.current="",ye.current=!0},Pe=(p,w)=>{L(""),W(!1),b(v=>[...v,...w?[{from:"you",text:w}]:[],{from:"assistant",text:ca(p,{docsOrigin:t,mcpUrl:r,pluginRepo:a}),install:p}])},Xe=async(p,w={})=>{if(!p||ve)return;let v=w.file!==void 0?w.file:F,B=w.base??h;M(""),T(null),P(null),de("closed"),ue("chat");let xt=gn([...B,{from:"you",text:p,file:v??void 0}]);if(b(te=>[...w.base??te,{from:"you",text:p,file:v??void 0},{from:"assistant",text:""}]),J.current="",be.current=!1,ye.current=!1,hr.current=performance.now(),mr.current=window.matchMedia("(prefers-reduced-motion: reduce)").matches,z("thinking"),le("Thinking"),K.current||(K.current=requestAnimationFrame(_r)),!e){Ge(io),ye.current=!0;return}let j=new AbortController;ee.current=j;try{let te=await fetch(`${e.replace(/\/$/,"")}/api/chat`,{method:"POST",signal:j.signal,headers:{"Content-Type":"application/json"},body:JSON.stringify({turns:xt.slice(-9).map(N=>({role:N.from==="you"?"user":"assistant",text:N.text,...N.file?{attachment:{name:N.file.name,text:N.file.text,...N.file.kind?{kind:N.file.kind}:{}}}:{}})),...Sn?{page:{title:s.title,url:s.url,markdown:no(s.markdown)}}:{},..._e?{command:_e}:{},...w.module?{module:w.module}:{}})});if(!te.ok||!te.body)throw new Error(`status ${te.status}`);await aa(te.body,{onText:Ge,onTool:N=>le(N),onSources:N=>En(N),onError:Ge,onSkill:N=>b(kt=>{let vr=kt[kt.length-1],Dn=N.status==="unresolved"?{...vr,text:ft(N),skill:N,local:!0}:{...vr,skill:N};return[...kt.slice(0,-1),Dn]})})}catch(te){te instanceof DOMException&&te.name==="AbortError"||Ge(Ft)}finally{ee.current=null,ye.current=!0,le(null)}},Cn=p=>{let w=h.length-2,v=h[w];!v||v.from!=="you"||Xe(v.text,{module:p,base:h.slice(0,w),file:v.file??null})},On=async p=>{q(p.title);let w=await fetch(ba(t,p.path)).then(v=>v.ok?v.text():"").catch(()=>"");q(null),d({title:p.title,url:va(t,p.path),markdown:w}),ie.current?.focus()},In=p=>ce(w=>{let v=ma(w,p);return Ht(v),v}),Un=()=>{_a(),ce([])},Ln=U==="thinking",Fn=oo(h);return o("dialog",{class:"ask-ai",ref:ne,"aria-label":"Ask AI",onClose:i,onCancel:i,onClick:p=>{p.target===ne.current&&!pr&&i()},children:[o(lo,{dialog:ne}),o("div",{class:"ask-ai__head",children:[o("div",{class:"ask-ai__tabs",role:"group","aria-label":"Conversations",children:[o("button",{type:"button",class:"ask-ai__tab","aria-pressed":me==="chat","aria-label":"New conversation",title:"Start a new conversation",onClick:Mn,children:[o(nt,{}),"New"]}),o("button",{type:"button",class:"ask-ai__tab","aria-pressed":me==="history",onClick:()=>{de("closed"),ue("history")},children:"History"})]}),!e&&o("span",{class:"ask-ai__badge",children:"Mock"}),o("span",{class:"ask-ai__grow"}),o("button",{type:"button",class:"ask-ai__close",onClick:i,"aria-label":"Close",children:o(De,{})})]}),me==="history"?o(wa,{sessions:Z,currentId:Y.current,onOpen:Rn,onForget:In,onClearAll:Un}):o($,{children:[o("div",{class:"ask-ai__thread",ref:Me,role:"log","aria-live":"polite","aria-busy":ve,onScroll:An,children:[h.length===0&&o(mn,{starters:y,mock:!e,supportUrl:m,onPick:p=>{Xe(p)}}),h.map((p,w)=>p.from==="assistant"&&p.text===""?null:o("div",{class:`ask-ai__turn ask-ai__turn--${p.from}${U==="streaming"&&w===h.length-1?" ask-ai__turn--streaming":""}`,children:[p.skill&&p.skill.status!=="unresolved"&&o("p",{class:`ask-ai__skill ask-ai__skill--${p.skill.status}`,children:p.skill.status==="used"&&p.skill.href?o("a",{href:lt(p.skill.href,t)??p.skill.href,target:"_blank",rel:"noopener noreferrer",children:ft(p.skill)}):ft(p.skill)}),p.from==="assistant"?o(Lt,{text:p.text,docsOrigin:t}):p.text,p.file&&o("span",{class:"ask-ai__turn-file",children:[o(Be,{}),p.file.name]}),p.from==="assistant"&&w>0&&p.text!==""&&!(ve&&w===h.length-1)&&o(ct,{text:p.text,label:"Copy answer",className:"ask-ai__turn-copy"}),p.sources&&p.sources.length>0&&o("div",{class:"ask-ai__sources",children:[o("span",{class:"ask-ai__sources-label",children:"Sources"}),p.sources.map(v=>o("a",{href:lt(v.url,t)??v.url,target:"_blank",rel:"noopener noreferrer",class:"ask-ai__source-chip",children:[v.title,v.status!=="verified"?" (spec)":""]},v.id))]}),p.install&&w===h.length-1&&o("div",{class:"ask-ai__choices",children:[p.install.at==="tools"&&Dt.map(v=>o("button",{type:"button",class:"ask-ai__choice",onClick:()=>Pe(na(v.id)?{at:"agents",tool:v.id}:{at:"answer",tool:v.id,agent:"claude"},v.label),children:v.label},v.id)),p.install.at==="agents"&&!A&&Bt.map(v=>o("button",{type:"button",class:"ask-ai__choice",onClick:()=>{if(v.id==="other"){W(!0);return}Pe({at:"answer",tool:p.install.tool,agent:v.id},v.label)},children:v.label},v.id)),p.install.at==="agents"&&A&&o("form",{class:"ask-ai__naming",onSubmit:v=>{v.preventDefault();let B=Ae.trim();B&&Pe({at:"answer",tool:p.install.tool,agent:"other",named:B},B)},children:[o("input",{class:"ask-ai__naming-field",value:Ae,autoFocus:!0,placeholder:"Which agent?","aria-label":"The name of your agent",onInput:v=>L(v.target.value)}),o("button",{type:"submit",class:"ask-ai__choice",disabled:Ae.trim()==="",children:o(at,{})})]})]}),p.install?.at==="answer"&&(()=>{let{link:v}=$t(p.install,{docsOrigin:t,mcpUrl:r,pluginRepo:a});return v?o("a",{class:"ask-ai__install-cta",href:v.href,target:"_blank",rel:"noopener noreferrer",children:[o(Fe,{}),v.label]}):null})(),p.skill?.status==="unresolved"&&w===h.length-1&&o("div",{class:"ask-ai__choices",children:(p.skill.candidates??[]).map(v=>o("button",{type:"button",class:"ask-ai__choice",onClick:()=>Cn(v),children:pt(v)},v))}),p.skill?.status==="used"&&p.skill.section==="scaffold"&&!(ve&&w===h.length-1)&&o("button",{type:"button",class:"ask-ai__install-cta",onClick:()=>Pe({at:"tools"},"Install AI tools"),children:[o(Fe,{}),"Build it with your coding agent"]}),w===Fn&&p.skill?.section!=="scaffold"&&!(ve&&w===h.length-1)&&o("button",{type:"button",class:"ask-ai__install-cta",onClick:()=>Pe({at:"tools"},"Install AI tools"),children:[o(Fe,{}),"Install AI tools"]})]},w)),Ln&&o("p",{class:"ask-ai__activity",children:[o(hn,{}),Ve??"Thinking"]})]}),o(ka,{draft:x,onDraft:M,field:ie,busy:ve,onSend:()=>{Xe(x.trim())},onStop:Pn,menu:ge,onMenu:de,accept:Qi,onFile:p=>{Tn(p)},file:F,fileNote:D,fileError:O,onRemoveFile:()=>T(null),docsOrigin:t,page:s,attaching:Q,onPage:p=>{On(p)},onRemovePage:l,command:_e,onCommand:We})]})]})}function uo({host:e,apiBase:t,docsOrigin:r,mcpUrl:a,pluginRepo:n,supportUrl:i,launcher:s,shortcut:l,open:d,page:c,onDetach:f,onAttach:_,question:u,send:m,starters:h,keepHistory:b}){return o($,{children:[s&&o("button",{type:"button",class:"ask-ai__launcher","aria-label":"Ask AI",onClick:()=>{e.removeAttribute("open"),e.setAttribute("open","")},children:[o(Fe,{}),o("span",{class:"ask-ai__launcher-label",children:"Ask AI"}),l&&o("kbd",{class:"ask-ai__launcher-key",children:l})]}),o(co,{apiBase:t,docsOrigin:r,mcpUrl:a,pluginRepo:n,supportUrl:i,open:d,question:u,send:m,starters:h,keepHistory:b,onClose:()=>{e.removeAttribute("open"),e.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))},page:c,onDetach:f,onAttach:_})]})}function po(){for(let e=document.body;e;e=e.parentElement){let t=/^rgba?\(([^)]+)\)/.exec(getComputedStyle(e).backgroundColor);if(!t)continue;let[r,a,n,i=1]=t[1].split(",").map(Number);if(i)return .2126*r+.7152*a+.0722*n<128?"dark":"light"}return window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}var fr=class extends HTMLElement{static observedAttributes=["api-base","docs-origin","mcp-url","plugin-repo","support-url","launcher","shortcut","open","question","send","starters","history","ground"];root=null;page=null;connectedCallback(){if(!this.root){this.root=this.attachShadow({mode:"open"});let t=document.createElement("style");t.textContent=vn,this.root.append(t),this.hasAttribute("ground")||this.setAttribute("ground",po())}this.paint()}attributeChangedCallback(){this.root&&this.paint()}show(){this.setAttribute("open","")}hide(){this.removeAttribute("open")}attachPage(t){this.page=t&&ya(t.markdown)?{...t,markdown:""}:t,this.root&&this.paint()}paint(){let t=this.getAttribute("docs-origin")??window.location.origin;Pt(o(uo,{host:this,apiBase:this.getAttribute("api-base")??"",docsOrigin:t,mcpUrl:this.getAttribute("mcp-url"),pluginRepo:this.getAttribute("plugin-repo")??"nha-in/docs",supportUrl:this.getAttribute("support-url")??`${t.replace(/\/$/,"")}/docs/support`,launcher:this.getAttribute("launcher")!=="none",shortcut:this.getAttribute("shortcut")??"",open:this.hasAttribute("open"),page:this.page,onDetach:()=>this.attachPage(null),onAttach:r=>this.attachPage(r),question:this.getAttribute("question")??"",send:this.hasAttribute("send"),starters:_n(this.getAttribute("starters")??""),keepHistory:this.getAttribute("history")!=="off"}),this.root)}};typeof customElements<"u"&&!customElements.get("abdm-support-agent")&&customElements.define("abdm-support-agent",fr);})();
