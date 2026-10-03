(()=>{var ot,S,Ur,gi,oe,Cr,Lr,Fr,It,tt,Be,Dr,Lt,Ot,Ut,_i,at={},nt=[],vi=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i,$e=Array.isArray;function re(e,t){for(var r in t)e[r]=t[r];return e}function Ft(e){e&&e.parentNode&&e.parentNode.removeChild(e)}function Ae(e,t,r){var a,n,i,s={};for(i in t)i=="key"?a=t[i]:i=="ref"?n=t[i]:s[i]=t[i];if(arguments.length>2&&(s.children=arguments.length>3?ot.call(arguments,2):r),typeof e=="function"&&e.defaultProps!=null)for(i in e.defaultProps)s[i]===void 0&&(s[i]=e.defaultProps[i]);return rt(e,s,a,n,null)}function rt(e,t,r,a,n){var i={type:e,props:t,key:r,ref:a,__k:null,__:null,__b:0,__e:null,__c:null,constructor:void 0,__v:n??++Ur,__i:-1,__u:0};return n==null&&S.vnode!=null&&S.vnode(i),i}function B(e){return e.children}function Y(e,t){this.props=e,this.context=t}function me(e,t){if(t==null)return e.__?me(e.__,e.__i+1):null;for(var r;t<e.__k.length;t++)if((r=e.__k[t])!=null&&r.__e!=null)return r.__e;return typeof e.type=="function"?me(e):null}function bi(e){if(e.__P&&e.__d){var t=e.__v,r=t.__e,a=[],n=[],i=re({},t);i.__v=t.__v+1,S.vnode&&S.vnode(i),Dt(e.__P,i,t,e.__n,e.__P.namespaceURI,32&t.__u?[r]:null,a,r??me(t),!!(32&t.__u),n),i.__v=t.__v,i.__.__k[i.__i]=i,zr(a,i,n),t.__e=t.__=null,i.__e!=r&&Br(i)}}function Br(e){if((e=e.__)!=null&&e.__c!=null)return e.__e=e.__c.base=null,e.__k.some(function(t){if(t!=null&&t.__e!=null)return e.__e=e.__c.base=t.__e}),Br(e)}function Pr(e){(!e.__d&&(e.__d=!0)&&oe.push(e)&&!it.__r++||Cr!=S.debounceRendering)&&((Cr=S.debounceRendering)||Lr)(it)}function it(){try{for(var e,t=1;oe.length;)oe.length>t&&oe.sort(Fr),e=oe.shift(),t=oe.length,bi(e)}finally{oe.length=it.__r=0}}function $r(e,t,r,a,n,i,s,l,d,c,p){var m,u,h,v,b,_,k=a&&a.__k||nt,w=t.length;for(d=yi(r,t,k,d,w),m=0;m<w;m++)(h=r.__k[m])!=null&&(u=h.__i!=-1&&k[h.__i]||at,h.__i=m,_=Dt(e,h,u,n,i,s,l,d,c,p),v=h.__e,h.ref&&u.ref!=h.ref&&(u.ref&&Bt(u.ref,null,h),p.push(h.ref,h.__c||v,h)),b==null&&v!=null&&(b=v),4&h.__u?(d=Nr(h,d,e),u.__e&&(u.__e=null)):typeof h.type=="function"&&_!==void 0?d=_:v&&(d=v.nextSibling),h.__u&=-7);return r.__e=b,d}function yi(e,t,r,a,n){var i,s,l,d,c,p=r.length,m=p,u=0;for(e.__k=new Array(n),i=0;i<n;i++)(s=t[i])!=null&&typeof s!="boolean"&&typeof s!="function"?(typeof s=="string"||typeof s=="number"||typeof s=="bigint"||s.constructor==String?s=e.__k[i]=rt(null,s,null,null,null):$e(s)?s=e.__k[i]=rt(B,{children:s},null,null,null):s.constructor===void 0&&s.__b>0?s=e.__k[i]=rt(s.type,s.props,s.key,s.ref?s.ref:null,s.__v):e.__k[i]=s,d=i+u,s.__=e,s.__b=e.__b+1,l=null,(c=s.__i=ki(s,r,d,m))!=-1&&(m--,(l=r[c])&&(l.__u|=2)),l==null||l.__v==null?(c==-1&&(n>p?u--:n<p&&u++),typeof s.type!="function"&&(s.__u|=4)):c!=d&&(c==d-1?u--:c==d+1?u++:(c>d?u--:u++,s.__u|=4))):e.__k[i]=null;if(m)for(i=0;i<p;i++)(l=r[i])!=null&&(2&l.__u)==0&&(l.__e==a&&(a=me(l)),Vr(l,l));return a}function Nr(e,t,r){var a,n;if(typeof e.type=="function"){for(a=e.__k,n=0;a&&n<a.length;n++)a[n]&&(a[n].__=e,t=Nr(a[n],t,r));return t}e.__e!=t&&(t&&e.type&&!t.parentNode&&(t=me(e)),t=r.insertBefore(e.__e,t||null));do t=t&&t.nextSibling;while(t!=null&&t.nodeType==8);return t}function Ne(e,t){return t=t||[],e==null||typeof e=="boolean"||($e(e)?e.some(function(r){Ne(r,t)}):t.push(e)),t}function ki(e,t,r,a){var n,i,s,l=e.key,d=e.type,c=t[r],p=c!=null&&(2&c.__u)==0;if(c===null&&l==null||p&&l==c.key&&d==c.type)return r;if(a>(p?1:0)){for(n=r-1,i=r+1;n>=0||i<t.length;)if((c=t[s=n>=0?n--:i++])!=null&&(2&c.__u)==0&&l==c.key&&d==c.type)return s}return-1}function Ir(e,t,r){t[0]=="-"?e.setProperty(t,r??""):e[t]=r==null?"":typeof r!="number"||vi.test(t)?r:r+"px"}function et(e,t,r,a,n){var i,s;e:if(t=="style")if(typeof r=="string")e.style.cssText=r;else{if(typeof a=="string"&&(e.style.cssText=a=""),a)for(t in a)r&&t in r||Ir(e.style,t,"");if(r)for(t in r)a&&r[t]==a[t]||Ir(e.style,t,r[t])}else if(t[0]=="o"&&t[1]=="n")i=t!=(t=t.replace(Dr,"$1")),s=t.toLowerCase(),t=s in e||t=="onFocusOut"||t=="onFocusIn"?s.slice(2):t.slice(2),e.l||(e.l={}),e.l[t+i]=r,r?a?r[Be]=a[Be]:(r[Be]=Lt,e.addEventListener(t,i?Ut:Ot,i)):e.removeEventListener(t,i?Ut:Ot,i);else{if(n=="http://www.w3.org/2000/svg")t=t.replace(/xlink(H|:h)/,"h").replace(/sName$/,"s");else if(t!="width"&&t!="height"&&t!="href"&&t!="list"&&t!="form"&&t!="tabIndex"&&t!="download"&&t!="rowSpan"&&t!="colSpan"&&t!="role"&&t!="popover"&&t in e)try{e[t]=r??"";break e}catch{}typeof r=="function"||(r==null||r===!1&&t[4]!="-"?e.removeAttribute(t):e.setAttribute(t,t=="popover"&&r==1?"":r))}}function Or(e){return function(t){if(this.l){var r=this.l[t.type+e];if(t[tt]==null)t[tt]=Lt++;else if(t[tt]<r[Be])return;return r(S.event?S.event(t):t)}}}function Dt(e,t,r,a,n,i,s,l,d,c){var p,m,u,h,v,b,_,k,w,U,P,O,C,N,I,K,g=t.type;if(t.constructor!==void 0)return null;128&r.__u&&(d=!!(32&r.__u),i=[l=t.__e=r.__e]),(p=S.__b)&&p(t);e:if(typeof g=="function"){m=s.length;try{if(w=t.props,U=g.prototype&&g.prototype.render,P=(p=g.contextType)&&a[p.__c],O=p?P?P.props.value:p.__:a,r.__c?k=(u=t.__c=r.__c).__=u.__E:(U?t.__c=u=new g(w,O):(t.__c=u=new Y(w,O),u.constructor=g,u.render=wi),P&&P.sub(u),u.state||(u.state={}),u.__n=a,h=u.__d=!0,u.__h=[],u._sb=[]),U&&u.__s==null&&(u.__s=u.state),U&&g.getDerivedStateFromProps!=null&&(u.__s==u.state&&(u.__s=re({},u.__s)),re(u.__s,g.getDerivedStateFromProps(w,u.__s))),v=u.props,b=u.state,u.__v=t,h)U&&g.getDerivedStateFromProps==null&&u.componentWillMount!=null&&u.componentWillMount(),U&&u.componentDidMount!=null&&u.__h.push(u.componentDidMount);else{if(U&&g.getDerivedStateFromProps==null&&w!==v&&u.componentWillReceiveProps!=null&&u.componentWillReceiveProps(w,O),t.__v==r.__v||!u.__e&&u.shouldComponentUpdate!=null&&u.shouldComponentUpdate(w,u.__s,O)===!1){t.__v!=r.__v&&(u.props=w,u.state=u.__s,u.__d=!1),t.__e=r.__e,t.__k=r.__k,t.__k.some(function(T){T&&(T.__=t)}),nt.push.apply(u.__h,u._sb),u._sb=[],u.__h.length&&s.push(u),l=me(r);break e}u.componentWillUpdate!=null&&u.componentWillUpdate(w,u.__s,O),U&&u.componentDidUpdate!=null&&u.__h.push(function(){u.componentDidUpdate(v,b,_)})}if(u.context=O,u.props=w,u.__P=e,u.__e=!1,C=S.__r,N=0,U)u.state=u.__s,u.__d=!1,C&&C(t),p=u.render(u.props,u.state,u.context),nt.push.apply(u.__h,u._sb),u._sb=[];else do u.__d=!1,C&&C(t),p=u.render(u.props,u.state,u.context),u.state=u.__s;while(u.__d&&++N<25);u.state=u.__s,u.getChildContext!=null&&(a=re(re({},a),u.getChildContext())),U&&!h&&u.getSnapshotBeforeUpdate!=null&&(_=u.getSnapshotBeforeUpdate(v,b)),I=p!=null&&p.type===B&&p.key==null?Wr(p.props.children):p,l=$r(e,$e(I)?I:[I],t,r,a,n,i,s,l,d,c),u.base=t.__e,t.__u&=-161,u.__h.length&&s.push(u),k&&(u.__E=u.__=null)}catch(T){if(s.length=m,t.__v=null,d||i!=null){if(T.then){for(t.__u|=d?160:128;l&&l.nodeType==8&&l.nextSibling;)l=l.nextSibling;i!=null&&(i[i.indexOf(l)]=null),t.__e=l}else if(i!=null)for(K=i.length;K--;)Ft(i[K])}else t.__e=r.__e;t.__k==null&&(t.__k=r.__k||[]),T.then||Hr(t),S.__e(T,t,r)}}else i==null&&t.__v==r.__v?(t.__k=r.__k,t.__e=r.__e):l=t.__e=xi(r.__e,t,r,a,n,i,s,d,c);return(p=S.diffed)&&p(t),128&t.__u?void 0:l}function Hr(e){e&&(e.__c&&(e.__c.__e=!0),e.__k&&e.__k.some(Hr))}function zr(e,t,r){for(var a=0;a<r.length;a++)Bt(r[a],r[++a],r[++a]);S.__c&&S.__c(t,e),e.some(function(n){try{e=n.__h,n.__h=[],e.some(function(i){i.call(n)})}catch(i){S.__e(i,n.__v)}})}function Wr(e){return typeof e!="object"||e==null||e.__b>0?e:$e(e)?e.map(Wr):e.constructor!==void 0?null:re({},e)}function xi(e,t,r,a,n,i,s,l,d){var c,p,m,u,h,v,b,_=r.props||at,k=t.props,w=t.type;if(w=="svg"?n="http://www.w3.org/2000/svg":w=="math"?n="http://www.w3.org/1998/Math/MathML":n||(n="http://www.w3.org/1999/xhtml"),i!=null){for(c=0;c<i.length;c++)if((h=i[c])&&"setAttribute"in h==!!w&&(w?h.localName==w:h.nodeType==3)){e=h,i[c]=null;break}}if(e==null){if(w==null)return document.createTextNode(k);e=document.createElementNS(n,w,k.is&&k),l&&(S.__m&&S.__m(t,i),l=!1),i=null}if(w==null)_===k||l&&e.data==k||(e.data=k);else{if(i=w=="textarea"&&k.defaultValue!=null?null:i&&ot.call(e.childNodes),!l&&i!=null)for(_={},c=0;c<e.attributes.length;c++)_[(h=e.attributes[c]).name]=h.value;for(c in _)h=_[c],c=="dangerouslySetInnerHTML"?m=h:c=="children"||c in k||c=="value"&&"defaultValue"in k||c=="checked"&&"defaultChecked"in k||et(e,c,null,h,n);for(c in k)h=k[c],c=="children"?u=h:c=="dangerouslySetInnerHTML"?p=h:c=="value"?v=h:c=="checked"?b=h:l&&typeof h!="function"||_[c]===h||et(e,c,h,_[c],n);if(p)l||m&&(p.__html==m.__html||p.__html==e.innerHTML)||(e.innerHTML=p.__html),t.__k=[];else if(m&&(e.innerHTML=""),$r(t.type=="template"?e.content:e,$e(u)?u:[u],t,r,a,w=="foreignObject"?"http://www.w3.org/1999/xhtml":n,i,s,i?i[0]:r.__k&&me(r,0),l,d),i!=null)for(c=i.length;c--;)Ft(i[c]);l&&w!="textarea"||(c="value",w=="progress"&&v==null?e.removeAttribute("value"):v!=null&&(v!==e[c]||w=="progress"&&!v||w=="option"&&v!=_[c])&&et(e,c,v,_[c],n),c="checked",b!=null&&b!=e[c]&&et(e,c,b,_[c],n))}return e}function Bt(e,t,r){try{if(typeof e=="function"){var a=typeof e.__u=="function";a&&e.__u(),a&&t==null||(e.__u=e(t))}else e.current=t}catch(n){S.__e(n,r)}}function Vr(e,t,r){var a,n;if(S.unmount&&S.unmount(e),(a=e.ref)&&(a.current&&a.current!=e.__e||Bt(a,null,t)),(a=e.__c)!=null){if(a.componentWillUnmount)try{a.componentWillUnmount()}catch(i){S.__e(i,t)}a.base=a.__P=a.__n=null}if(a=e.__k)for(n=0;n<a.length;n++)a[n]&&Vr(a[n],t,r||typeof e.type!="function");r||Ft(e.__e),e.__c=e.__=e.__e=void 0}function wi(e,t,r){return this.constructor(e,r)}function $t(e,t,r){var a,n,i,s;t==document&&(t=document.documentElement),S.__&&S.__(e,t),n=(a=typeof r=="function")?null:r&&r.__k||t.__k,i=[],s=[],Dt(t,e=(!a&&r||t).__k=Ae(B,null,[e]),n||at,at,t.namespaceURI,!a&&r?[r]:n?null:t.firstChild?ot.call(t.childNodes):null,i,!a&&r?r:n?n.__e:t.firstChild,a,s),zr(i,e,s),e.props.children=null}ot=nt.slice,S={__e:function(e,t,r,a){for(var n,i,s;t=t.__;)if((n=t.__c)&&!n.__)try{if((i=n.constructor)&&i.getDerivedStateFromError!=null&&(n.setState(i.getDerivedStateFromError(e)),s=n.__d),n.componentDidCatch!=null&&(n.componentDidCatch(e,a||{}),s=n.__d),s)return n.__E=n}catch(l){e=l}throw e}},Ur=0,gi=function(e){return e!=null&&e.constructor===void 0},Y.prototype.setState=function(e,t){var r;r=this.__s!=null&&this.__s!=this.state?this.__s:this.__s=re({},this.state),typeof e=="function"&&(e=e(re({},r),this.props)),e&&re(r,e),e!=null&&this.__v&&(t&&this._sb.push(t),Pr(this))},Y.prototype.forceUpdate=function(e){this.__v&&(this.__e=!0,e&&this.__h.push(e),Pr(this))},Y.prototype.render=B,oe=[],Lr=typeof Promise=="function"?Promise.prototype.then.bind(Promise.resolve()):setTimeout,Fr=function(e,t){return e.__v.__b-t.__v.__b},it.__r=0,It=Math.random().toString(8),tt="__d"+It,Be="__a"+It,Dr=/(PointerCapture)$|Capture$/i,Lt=0,Ot=Or(!1),Ut=Or(!0),_i=0;var Te,F,Nt,Gr,He=0,Zr=[],D=S,jr=D.__b,Xr=D.__r,qr=D.diffed,Yr=D.__c,Kr=D.unmount,Jr=D.__;function lt(e,t){D.__h&&D.__h(F,e,He||t),He=0;var r=F.__H||(F.__H={__:[],__h:[]});return e>=r.__.length&&r.__.push({}),r.__[e]}function E(e){return He=1,ea(ra,e)}function ea(e,t,r){var a=lt(Te++,2);if(a.t=e,!a.__c&&(a.__=[r?r(t):ra(void 0,t),function(l){var d=a.__N?a.__N[0]:a.__[0],c=a.t(d,l);d!==c&&(a.__N=[c,a.__[1]],a.__c.setState({}))}],a.__c=F,!F.__f)){var n=function(l,d,c){if(!a.__c.__H)return!0;var p=!1,m=a.__c.props!==l;if(a.__c.__H.__.some(function(h){if(h.__N){p=!0;var v=h.__[0];h.__=h.__N,h.__N=void 0,v!==h.__[0]&&(m=!0)}}),i){var u=i.call(this,l,d,c);return p?u||m:u}return!p||m};F.__f=!0;var i=F.shouldComponentUpdate,s=F.componentWillUpdate;F.componentWillUpdate=function(l,d,c){if(this.__e){var p=i;i=void 0,n(l,d,c),i=p}s&&s.call(this,l,d,c)},F.shouldComponentUpdate=n}return a.__N||a.__}function R(e,t){var r=lt(Te++,3);!D.__s&&Wt(r.__H,t)&&(r.__=e,r.u=t,F.__H.__h.push(r))}function ta(e,t){var r=lt(Te++,4);!D.__s&&Wt(r.__H,t)&&(r.__=e,r.u=t,F.__h.push(r))}function A(e){return He=5,ze(function(){return{current:e}},[])}function ze(e,t){var r=lt(Te++,7);return Wt(r.__H,t)&&(r.__=e(),r.__H=t,r.__h=e),r.__}function zt(e,t){return He=8,ze(function(){return e},t)}function Si(){for(var e;e=Zr.shift();){var t=e.__H;if(e.__P&&t)try{t.__h.some(st),t.__h.some(Ht),t.__h=[]}catch(r){t.__h=[],D.__e(r,e.__v)}}}D.__b=function(e){F=null,jr&&jr(e)},D.__=function(e,t){e&&t.__k&&t.__k.__m&&(e.__m=t.__k.__m),Jr&&Jr(e,t)},D.__r=function(e){Xr&&Xr(e),Te=0;var t=(F=e.__c).__H;t&&(Nt===F?(t.__h=[],F.__h=[],t.__.some(function(r){r.__N&&(r.__=r.__N),r.u=r.__N=void 0})):(t.__h.some(st),t.__h.some(Ht),t.__h=[],Te=0)),Nt=F},D.diffed=function(e){qr&&qr(e);var t=e.__c;t&&t.__H&&(t.__H.__h.length&&(Zr.push(t)!==1&&Gr===D.requestAnimationFrame||((Gr=D.requestAnimationFrame)||Ai)(Si)),t.__H.__.some(function(r){r.u&&(r.__H=r.u,r.u=void 0)})),Nt=F=null},D.__c=function(e,t){t.some(function(r){try{r.__h.some(st),r.__h=r.__h.filter(function(a){return!a.__||Ht(a)})}catch(a){t.some(function(n){n.__h&&(n.__h=[])}),t=[],D.__e(a,r.__v)}}),Yr&&Yr(e,t)},D.unmount=function(e){Kr&&Kr(e);var t,r=e.__c;r&&r.__H&&(r.__H.__.some(function(a){try{st(a)}catch(n){t=n}}),r.__H=void 0,t&&D.__e(t,r.__v))};var Qr=typeof requestAnimationFrame=="function";function Ai(e){var t,r=function(){clearTimeout(a),Qr&&cancelAnimationFrame(t),setTimeout(e)},a=setTimeout(r,35);Qr&&(t=requestAnimationFrame(r))}function st(e){var t=F,r=e.__c;typeof r=="function"&&(e.__c=void 0,r()),F=t}function Ht(e){var t=F;e.__c=e.__(),F=t}function Wt(e,t){return!e||e.length!==t.length||t.some(function(r,a){return r!==e[a]})}function ra(e,t){return typeof t=="function"?t(e):t}var Ti=0;function o(e,t,r,a,n,i){t||(t={});var s,l,d=t;if("ref"in d)for(l in d={},t)l=="ref"?s=t[l]:d[l]=t[l];var c={type:e,props:d,key:r,ref:s,__k:null,__:null,__b:0,__e:null,__c:null,constructor:void 0,__v:--Ti,__i:-1,__u:0,__source:n,__self:i};if(typeof e=="function"&&(s=e.defaultProps))for(l in s)d[l]===void 0&&(d[l]=s[l]);return S.vnode&&S.vnode(c),c}var W={xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round","aria-hidden":"true"},ct=()=>o("svg",{...W,width:"16",height:"16",children:[o("path",{d:"m5 12 7-7 7 7"}),o("path",{d:"M12 19V5"})]});var se=()=>o("svg",{...W,width:"14",height:"14",children:[o("path",{d:"M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"}),o("path",{d:"M20 2v4"}),o("path",{d:"M22 4h-4"}),o("circle",{cx:"4",cy:"20",r:"2"})]}),aa=()=>o("svg",{...W,width:"12",height:"12",children:o("rect",{width:"18",height:"18",x:"3",y:"3",rx:"2"})}),na=()=>o("svg",{...W,width:"14",height:"14",children:o("path",{d:"M20 6 9 17l-5-5"})}),ia=()=>o("svg",{...W,width:"14",height:"14",children:[o("rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2"}),o("path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"})]}),Ee=()=>o("svg",{...W,width:"16",height:"16",children:[o("path",{d:"M18 6 6 18"}),o("path",{d:"m6 6 12 12"})]}),We=()=>o("svg",{...W,width:"16",height:"16",children:[o("path",{d:"M13.234 20.252 21 12.3"}),o("path",{d:"m16 6-8.414 8.586a2 2 0 0 0 0 2.828 2 2 0 0 0 2.828 0l8.414-8.586a4 4 0 0 0 0-5.656 4 4 0 0 0-5.656 0l-8.415 8.585a6 6 0 1 0 8.486 8.486"})]}),ut=()=>o("svg",{...W,width:"16",height:"16",children:[o("path",{d:"M5 12h14"}),o("path",{d:"M12 5v14"})]}),oa=()=>o("svg",{...W,width:"16",height:"16",children:o("path",{d:"m6 9 6 6 6-6"})}),sa=()=>o("svg",{...W,width:"14",height:"14",children:o("path",{d:"m9 18 6-6-6-6"})}),Re=()=>o("svg",{...W,width:"14",height:"14",children:[o("path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"}),o("path",{d:"M14 2v4a2 2 0 0 0 2 2h4"}),o("path",{d:"M16 13H8"}),o("path",{d:"M16 17H8"})]}),la=()=>o("svg",{...W,width:"14",height:"14",children:[o("path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"}),o("path",{d:"m17 8-5-5-5 5"}),o("path",{d:"M12 3v12"})]}),ca=()=>o("svg",{...W,width:"14",height:"14",children:[o("circle",{cx:"11",cy:"11",r:"8"}),o("path",{d:"m21 21-4.3-4.3"})]}),ua=()=>o("svg",{...W,width:"14",height:"14",children:[o("path",{d:"M3 6h18"}),o("path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"}),o("path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"})]}),da=()=>o("svg",{...W,width:"14",height:"14",children:o("path",{d:"m15 18-6-6 6-6"})});var ae=(()=>{if(typeof document>"u")return"/agent/vendor/";let e=document.currentScript?.src;try{return new URL("vendor/",e??"/agent/").href}catch{return"/agent/vendor/"}})(),fa=new Map;function dt(e){let t=fa.get(e);if(t)return t;let r=new Promise((a,n)=>{let i=document.createElement("script");i.src=e,i.onload=()=>a(),i.onerror=()=>n(new Error(`could not load ${e}`)),document.head.append(i)});return fa.set(e,r),r}var Ei=/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)\s]+\))/g;function Ve(e,t){return e.startsWith("/")?`${t.replace(/\/$/,"")}${e}`:e.startsWith("https://")||e.startsWith("http://")?e:null}function Ri(e,t,r){let a=e.replace(/^(?:GET|POST|PUT|PATCH|DELETE)\s+/,""),n=t?.find(i=>i.literal===a);return n?Ve(n.url,r):null}function ft(e,t,r){return e.split(Ei).map((n,i)=>{if(n.startsWith("`")&&n.endsWith("`")&&n.length>2){let l=n.slice(1,-1),d=Ri(l,r,t);return d?o("a",{class:"ask-ai__code-link",href:d,target:"_blank",rel:"noopener",children:o("code",{children:l})},i):o("code",{children:l},i)}if(n.startsWith("**")&&n.endsWith("**")&&n.length>4)return o("b",{children:ft(n.slice(2,-2),t,r)},i);if(n.startsWith("*")&&n.endsWith("*")&&n.length>2)return o("em",{children:ft(n.slice(1,-1),t,r)},i);let s=/^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(n);if(s){let[,l,d]=s,c=Ve(d,t);return c?o("a",{href:c,target:"_blank",rel:"noopener noreferrer",children:l},i):n}return n})}function pt({text:e,label:t,className:r}){let[a,n]=E(!1);return R(()=>{if(!a)return;let i=window.setTimeout(()=>n(!1),1600);return()=>window.clearTimeout(i)},[a]),typeof navigator>"u"||!navigator.clipboard?null:o("button",{type:"button",class:r,"aria-label":a?"Copied":t,onClick:()=>{navigator.clipboard.writeText(e).then(()=>n(!0),()=>{})},children:a?o(na,{}):o(ia,{})})}var pa=null;function Mi(){return pa??=dt(`${ae}mermaid.min.js`).then(()=>{let e=globalThis.mermaid;if(!e)throw new Error("mermaid loaded but registered nothing");return e.initialize({startOnLoad:!1,securityLevel:"strict",theme:Ci()?"dark":"default",fontFamily:"inherit"}),e}),pa}function Ci(){let e=document.documentElement.dataset.theme;return e==="dark"?!0:e==="light"?!1:globalThis.matchMedia?.("(prefers-color-scheme: dark)").matches??!1}var ha=0;function Pi({text:e}){let[t,r]=E(""),[a,n]=E(!1);return R(()=>{let i=!0;n(!1),r(""),ha+=1;let s=`ask-ai-diagram-${ha}`;return Mi().then(l=>l.render(s,e)).then(l=>{i&&r(l.svg)}).catch(()=>{i&&n(!0),document.getElementById(s)?.remove(),document.getElementById(`d${s}`)?.remove()}),()=>{i=!1}},[e]),a?o("div",{class:"ask-ai__code",children:[o("pre",{children:o("code",{children:e})}),o(pt,{text:e,label:"Copy diagram source",className:"ask-ai__code-copy"})]}):o("div",{class:"ask-ai__diagram",dangerouslySetInnerHTML:{__html:t}})}var Ii=/^\s*[-*]\s+(.*)$/,Oi=/^\s*\d+[.)]\s+(.*)$/;function Ui(e){let t=[],r=null,a=[],n=null,i="",s=()=>{a.length>0&&(t.push({kind:"p",text:a.join(" ")}),a=[])},l=()=>{r&&(t.push(r),r=null)};for(let d of e.split(`
`)){if(d.trimStart().startsWith("```")){n?(t.push({kind:"code",text:n.join(`
`),lang:i,closed:!0}),n=null,i=""):(s(),l(),i=d.trim().slice(3).trim().toLowerCase(),n=[]);continue}if(n){n.push(d);continue}let c=Ii.exec(d),p=c?null:Oi.exec(d);if(c||p){s();let m=c?"ul":"ol";(!r||r.kind!==m)&&(l(),r={kind:m,items:[]}),r.items.push((c??p)[1]);continue}if(d.trim()===""){s(),l();continue}if(r&&/^\s{2,}/.test(d)){r.items[r.items.length-1]+=` ${d.trim()}`;continue}l(),a.push(d.replace(/^#{1,4}\s+/,"").trim())}return n&&t.push({kind:"code",text:n.join(`
`),lang:i,closed:!1}),s(),l(),t}function Vt({text:e,docsOrigin:t,links:r}){return o(B,{children:Ui(e).map((a,n)=>{if(a.kind==="p")return o("p",{children:ft(a.text,t,r)},n);if(a.kind==="code")return a.lang==="mermaid"&&a.closed?o(Pi,{text:a.text},n):o("div",{class:"ask-ai__code",children:[o("pre",{children:o("code",{children:a.text})}),o(pt,{text:a.text,label:"Copy code",className:"ask-ai__code-copy"})]},n);let i=a.kind;return o(i,{children:a.items.map((s,l)=>o("li",{children:ft(s,t,r)},l))},n)})})}function ma(e){let t=[],r=!1;for(let a of e.split(`
`))/^\s*```/.test(a)?r=!r:!r&&/^##\s+/.test(a)&&t.push(a.slice(2).replace(/[*`_]/g,"").trim());return t.filter(Boolean)}var ht="The assistant is unreachable right now. Try again shortly.";function ga(e,t){if(e!==429)return ht;let r=t??{};if(r.limit==="day")return"This connection has used today's questions. The limit resets at midnight UTC.";if(r.limit==="minute"){let a=Math.ceil(r.retry_after_seconds??0);return`Too many questions in the last minute. Wait ${a>5?`about ${a} seconds`:"a moment"} and ask again.`}return"Too many questions in a short time. Wait a minute and ask again."}async function _a(e,t){let r=e.getReader(),a=new TextDecoder,n="",i=s=>{let l="message",d=[];for(let p of s.split(`
`))p.startsWith("event:")?l=p.slice(6).trim():p.startsWith("data:")&&d.push(p.slice(5).trim());if(d.length===0)return;let c;try{c=JSON.parse(d.join(`
`))}catch{return}switch(l){case"text":t.onText(c.delta??"");break;case"tool":{let p=c;t.onTool(Fi(p.name));break}case"sources":t.onSources(c);break;case"links":t.onLinks?.(c);break;case"suggestions":t.onSuggestions?.(c);break;case"skill":t.onSkill?.(c);break;case"error":t.onError(c.message||ht);break;default:break}};for(;;){let{done:s,value:l}=await r.read();if(s)break;n+=a.decode(l,{stream:!0});let d;for(;(d=n.indexOf(`

`))!==-1;){let c=n.slice(0,d);n=n.slice(d+2),i(c)}}}var Li={search_docs:"Searching the docs",search:"Searching the docs",get_atom:"Reading the docs",related_atoms:"Reading the docs",list_atoms:"Reading the docs",get_operation:"Reading the API reference",list_operations:"Reading the API reference",decode_error:"Looking up the error",validate_request:"Checking the request",validate_fhir:"Checking the FHIR bundle",get_fhir_example:"Reading the FHIR profiles",get_fhir_profile:"Reading the FHIR profiles",list_fhir_profiles:"Reading the FHIR profiles",catalogue_info:"Checking the catalogue"};function Fi(e){return Li[e]??"Looking this up"}var mt="abdm-docs",Gt=[{id:"skills",label:"Skills"},{id:"mcp",label:"MCP server"},{id:"plugin",label:"Plugin"}],jt=[{id:"claude",label:"Claude"},{id:"codex",label:"Codex"},{id:"cursor",label:"Cursor"},{id:"other",label:"Other"}],Di=["Three ways to give your agent this catalogue. Take any of them, or all three.","","- **Skills**: the milestones written as files an agent reads before it writes code. One set up line, any agent.","- **MCP server**: your agent queries these pages as it works, so it retrieves the paragraph it needs instead of loading the site.","- **Plugin**: every skill at once, as one package. Claude Code and Codex install it straight from the repository; the other Agent Plugins clients list it through their own marketplaces.","","Which one do you want?"].join(`
`);function va(e){return!0}function Bi(e){return Gt.find(t=>t.id===e).label}function Xt(e,t){return e==="other"?t?.trim()||"your agent":jt.find(r=>r.id===e).label}function $i(e){return`Fetch and execute the instructions to set me up for ABDM integration from ${e}/agent-setup/prompt.md`}function ba(e){return[e,"","If this session did not open in the repository I am integrating ABDM into, ask me for the path before you write anything."].join(`
`)}function Ni(e){return e.replace(/\/+$/,"")}function le(e){return["```",e,"```"].join(`
`)}var ya="abdm-integrators-assistant",ka=e=>`claude plugin marketplace add ${e} && claude plugin install ${ya}@abdm-portal`,Hi=e=>`codex plugin marketplace add ${e}`;function xa(e,t){return`claude://code/new?q=${encodeURIComponent(ba(["Set this project up for ABDM integration. Run:","",`claude plugin marketplace add ${t}`,"claude plugin install abdm-integrators-assistant@abdm-portal","",`If the marketplace add fails (the repository may not be accessible), instead fetch and execute the instructions from ${e}/agent-setup/prompt.md`].join(`
`)))}`}function zi(e,t,r,a){let n=$i(r);return e==="claude"?{text:["Claude Code takes the plugin, which carries every skill at once and updates in place. Run this in the repository you are integrating.","",le(ka(a))].join(`
`),link:{href:xa(r,a),label:"Open in Claude"}}:e==="cursor"?{text:["Paste this into Cursor, or let the link put it in the composer. It fetches the current instructions from this site, so what it installs cannot go stale.","",le(n)].join(`
`),link:{href:`cursor://anysphere.cursor-deeplink/prompt?text=${encodeURIComponent(ba(n))}`,label:"Open in Cursor"}}:e==="codex"?{text:["Codex has no URL scheme, so this is a paste. Give it to a Codex session in the repository you are integrating, and it fetches the current instructions from this site.","",le(n)].join(`
`)}:{text:[`Any agent that can fetch a URL takes this line, ${Xt(e,t)} included. The instructions live on this site and are rebuilt with it, so the pasted line cannot go stale.`,"",le(n)].join(`
`)}}function Wi(e,t,r,a){return e==="claude"?{text:["Run this in the repository you are integrating. It carries every skill at once, and `claude plugin update` keeps it current.","",le(ka(a))].join(`
`),link:{href:xa(r,a),label:"Open in Claude"}}:e==="codex"?{text:[`Add the marketplace, then install \`${ya}\` from it in Codex's plugin directory.`,"",le(Hi(a))].join(`
`)}:{text:[`The plugin is packaged to the Agent Plugins 1.0 standard, which ${Xt(e,t)} reads, but that route installs from the client's own marketplace and this plugin is not listed in one yet.`,"","The skills are the same content and they install today. Ask for Skills instead."].join(`
`)}}function Vi(e,t,r,a){return a?e==="claude"?{text:["User scope, so it is there in every project rather than only this directory.","",le(`claude mcp add --transport http ${mt} ${a} -s user`)].join(`
`),link:{href:`claude://code/new?q=${encodeURIComponent(["Add the ABDM documentation MCP server, then use it to answer my ABDM questions.","","Run this:",`claude mcp add --transport http ${mt} ${a} -s user`,"","User scope, so it is available in every project rather than only this directory."].join(`
`))}`,label:"Open in Claude"}}:e==="cursor"?{text:"The link opens Cursor on a confirmation dialog, and there is no command to run.",link:{href:`cursor://anysphere.cursor-deeplink/mcp/install?name=${mt}&config=${encodeURIComponent(btoa(JSON.stringify({url:a})))}`,label:"Add to Cursor"}}:{text:[`Any client that reads an \`mcpServers\` config takes this block as it stands, ${Xt(e,t)} included.`,"",le(JSON.stringify({mcpServers:{[mt]:{url:a}}},null,2))].join(`
`)}:{text:`The server is live, but this build of the site does not carry its address, so there is no command to give you. The address is set at deploy. [Build with AI](${r}/docs/hiecm/v3/getting-started/build-with-ai) has the current one.`}}function qt(e,t){let r=Ni(t.docsOrigin);return e.tool==="plugin"?Wi(e.agent,e.named,r,t.pluginRepo):e.tool==="mcp"?Vi(e.agent,e.named,r,t.mcpUrl):zi(e.agent,e.named,r,t.pluginRepo)}function wa(e,t){return e.at==="tools"?Di:e.at==="agents"?`${Bi(e.tool)} it is. Which agent are you working in?`:qt(e,t).text}var Gi=/\b(integrat\w*|implement\w*|build|building|develop\w*|debug\w*|troubleshoot\w*|fix|fixing|broken|failing|failed|fails|error|errors|stuck|retry|retries|sandbox|certif\w*|onboard\w*|set ?up|install\w*|scaffold\w*|test\w*|why (is|does|isn.?t|doesn.?t|am|are)|how (do|can|would|should) (i|we)|not working|does ?n.?t work)\b/i;function Sa(e){return Gi.test(e)}function Aa(e,t,r,a){return e<=0||!r&&t<550&&e<220?0:a?e:Math.min(e,Math.max(2,Math.ceil(e/6)))}var gt="abdm-ask-ai-history";function Ta(e){let r=(e.find(a=>a.from==="you")?.text.trim()??"").replace(/\s+/g," ");return r.length>72?`${r.slice(0,71)}\u2026`:r}function Ea(e,t){return[t,...e.filter(r=>r.id!==t.id)].slice(0,50)}function Ra(e=Date.now()){try{let t=JSON.parse(localStorage.getItem(gt)??"[]");return Array.isArray(t)?t.filter(r=>r?.id&&r?.turns&&e-(r.at??0)<2592e6):[]}catch{return[]}}function Yt(e){try{localStorage.setItem(gt,JSON.stringify(e))}catch{try{localStorage.setItem(gt,JSON.stringify(e.slice(0,-1)))}catch{}}}function Ma(e,t){return e.filter(r=>r.id!==t)}function Ca(){try{localStorage.removeItem(gt)}catch{}}var Kt="abdm-ask-ai-current";function Pa(){try{return sessionStorage.getItem(Kt)}catch{return null}}function Ia(e){try{sessionStorage.setItem(Kt,e)}catch{}}function Oa(){try{sessionStorage.removeItem(Kt)}catch{}}function Ua(e,t){return t&&e.find(r=>r.id===t)||null}var La=["I answer questions about integrating with ABDM, from this portal's documentation and API references. Every answer lists the pages it used, so you can check the source.","","**What you can ask**","","- How to do something: create an ABHA, link records, request consent.","- What an error code means, and how to fix it.","- What a field, header or term means.","","**What you can give me**","","- **A page.** Press **+** and attach any page on this portal, or open me from **Ask about this page**.","- **A file.** A request, a response, a log, a PDF or a screenshot. It is read in your browser, and only its text is sent.","- **A command.** **Scaffold**, **Design**, **Integrate** and **Debug** under the chat bar draw on that part of a module's agent skill.","","**What I will not do**","","- Write code for your project. I show curl requests. For code, install the agent skills or the MCP server in your own coding agent.","- Answer from general knowledge. A path, a header or an error code comes from this portal or not at all.","- Stand in for support, for accounts, credentials or production approval.","","Your conversations stay in this browser. **History** lists them, and **New** starts again."].join(`
`),ji=/^(?:what (?:can|do|does) (?:you|this (?:assistant|bot|chat)|the (?:ask ai )?(?:assistant|bot)|ask ai) do|what (?:is|are) (?:you|ask ai|this (?:assistant|bot))|who are you|how (?:do|can) i use (?:you|this|ask ai|the assistant)|help)\s*\??$/i;function Fa(e){return ji.test(e.trim().replace(/\s+/g," "))}var vt=[{id:"scaffold",label:"Scaffold",hint:"Set up a project for a module"},{id:"design",label:"Design",hint:"The design rules for a module"},{id:"integrate",label:"Integrate",hint:"Build a module step by step"},{id:"debug",label:"Debug",hint:"Work out why a call fails"}];function Da(e){let t=/^\/([a-z]*)$/i.exec(e);if(!t)return[];let r=t[1].toLowerCase();return vt.filter(a=>a.id.startsWith(r))}var bt=e=>vt.find(t=>t.id===e)?.label??e;function _t(e){let t=e.replace(/^abdm-/,"");if(/^[mp]\d$/.test(t))return t.toUpperCase();let r=t.replace(/-/g," ");return r.charAt(0).toUpperCase()+r.slice(1)}function yt(e){switch(e.status){case"used":return`Using ${_t(e.module??"")} \xB7 ${bt(e.section)}`;case"missing":return`No ${e.section} guide for ${_t(e.module??"")} yet. Answering from the docs.`;default:return"Which module is this about?"}}var Xi=/^- \[([^\]]+)\]\(([^)\s]+)\)(?::\s*(.*))?$/;function qi(e){let t=[],r=new Set;for(let a of e.split(`
`)){let n=Xi.exec(a.trim());if(!n)continue;let i;try{i=new URL(n[2],"https://placeholder.invalid").pathname.replace(/\/$/,"")}catch{continue}!i.startsWith("/docs/")||r.has(i)||(r.add(i),t.push({title:n[1],path:i,description:(n[3]??"").trim()}))}return t}var Yi=e=>e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");function Ba(e,t,r=8){let a=t.toLowerCase().split(/\s+/).filter(Boolean);if(!a.length)return[];let n=[];for(let i of e){let s=i.title.toLowerCase(),l=`${i.path} ${i.description}`.toLowerCase(),d=0,c=!0;for(let p of a)if(new RegExp(`\\b${Yi(p)}`).test(s))d+=3;else if(s.includes(p))d+=2;else if(l.includes(p))d+=1;else{c=!1;break}c&&n.push({entry:i,score:d})}return n.sort((i,s)=>s.score-i.score||i.entry.title.length-s.entry.title.length).slice(0,r).map(i=>i.entry)}var Jt=e=>e.replace(/\/$/,""),$a=(e,t)=>`${Jt(e)}${t}`,Na=(e,t)=>`${Jt(e)}${t}.md`;function Ha(e){return/^\s*(?:<!doctype html|<html[\s>])/i.test(e)}var kt=null;function za(e){return kt||(kt=fetch(`${Jt(e)}/llms.txt`).then(t=>t.ok?t.text():Promise.reject(new Error(`status ${t.status}`))).then(qi).catch(t=>{throw kt=null,t})),kt}var Qt={active:-1,dismissed:!1},xt=e=>e.filter(t=>t.kind!=="step");function Wa(e,t,r,a){return!a&&e===""&&t.length>0&&!r.dismissed}function Zt(e,t){let r=xt(e);return t.active>=0?r[Math.min(t.active,r.length-1)]??null:e.find(a=>a.kind==="step")??null}function Va(e,t,r,a){if(r.length===0)return{kind:"none"};let n=xt(r).length;if(e==="Tab"&&!t){let i=Zt(r,a);return i?{kind:"fill",text:i.prompt}:{kind:"none"}}return e==="ArrowDown"&&n>0?{kind:"move",tray:{...a,active:Math.min(a.active+1,n-1)}}:e==="ArrowUp"&&n>0?{kind:"move",tray:{...a,active:Math.max(a.active-1,-1)}}:e==="Escape"?{kind:"dismiss",tray:{...a,dismissed:!0}}:{kind:"none"}}function Ki({earlier:e,window:t,percent:r,full:a}){let i=2*Math.PI*7,s=`${Math.min(e,t)} of ${t} conversation exchanges completed.`;return o("span",{class:`ask-ai__ring${a?" ask-ai__ring--full":""}`,children:[o("span",{class:"ask-ai__ring-mark",tabIndex:0,role:"progressbar","aria-label":"Context window","aria-valuemin":0,"aria-valuemax":100,"aria-valuenow":r,"aria-describedby":"ask-ai-ring-tip",children:o("svg",{viewBox:"0 0 18 18",width:"18",height:"18","aria-hidden":"true",children:[o("circle",{class:"ask-ai__ring-track",cx:"9",cy:"9",r:7}),o("circle",{class:"ask-ai__ring-fill",cx:"9",cy:"9",r:7,"stroke-dasharray":i,"stroke-dashoffset":i*(1-r/100)})]})}),o("span",{class:"ask-ai__ring-tip",id:"ask-ai-ring-tip",role:"tooltip",children:o("span",{children:s})})]})}function Ga(e){let{draft:t,busy:r,menu:a,onMenu:n,page:i,file:s,fileNote:l,fileError:d,attaching:c}=e,p=A(null),m=A(null),u=i!==null&&i.markdown!=="",[h,v]=E(Qt),[b,_]=E(!1),k=e.suggestions.map(g=>g.id).join(" ");R(()=>v(Qt),[k]);let w=Wa(t,e.suggestions,h,r)&&a==="closed",U=w?xt(e.suggestions):[],P=w?Zt(e.suggestions,h):null;R(()=>{if(a==="closed")return;let g=T=>{m.current&&!T.composedPath().includes(m.current)&&n("closed")};return document.addEventListener("pointerdown",g,!0),()=>document.removeEventListener("pointerdown",g,!0)},[a]);let O=Da(t),[C,N]=E(0);R(()=>N(0),[t]);let I=g=>{e.onCommand(g),e.onDraft("")},K=!!(i||c||s||l||d||e.command);return o("div",{class:"ask-ai__foot",children:[o("form",{class:"ask-ai__composer",onSubmit:g=>{g.preventDefault(),e.onSend()},children:[K&&o("div",{class:"ask-ai__context",children:[c&&o("span",{class:"ask-ai__chip ask-ai__chip--pending",children:[o(Re,{}),o("span",{class:"ask-ai__chip-text",children:["Attaching ",c]})]}),i&&!c&&o("span",{class:`ask-ai__chip${u?"":" ask-ai__chip--failed"}`,children:[o(Re,{}),o("span",{class:"ask-ai__chip-text",children:u?i.title:`Could not attach ${i.title}`}),o("button",{type:"button",class:"ask-ai__chip-remove","aria-label":u?`Remove ${i.title}`:"Dismiss",onClick:e.onRemovePage,children:o(Ee,{})})]}),l?o("span",{class:"ask-ai__chip ask-ai__chip--pending",children:[o(We,{}),o("span",{class:"ask-ai__chip-text",children:l})]}):s&&o("span",{class:"ask-ai__chip",children:[o(We,{}),o("span",{class:"ask-ai__chip-text",children:s.name}),o("span",{class:"ask-ai__chip-meta",children:[s.text.length.toLocaleString()," characters"]}),o("button",{type:"button",class:"ask-ai__chip-remove","aria-label":`Remove ${s.name}`,onClick:e.onRemoveFile,children:o(Ee,{})})]}),e.command&&o("span",{class:"ask-ai__chip",children:[o(se,{}),o("span",{class:"ask-ai__chip-text",children:["Skill: ",bt(e.command)]}),o("button",{type:"button",class:"ask-ai__chip-remove","aria-label":`Remove the ${bt(e.command)} skill`,onClick:()=>e.onCommand(null),children:o(Ee,{})})]}),d&&o("span",{class:"ask-ai__context-error",children:d})]}),s?.kind&&!l&&o("p",{class:"ask-ai__context-note",children:"Read here in your browser; the file itself is not sent. Names in it are yours to check before you send."}),b&&U.length>0&&o("ul",{class:"ask-ai__next",role:"listbox","aria-label":"Related questions",children:U.map((g,T)=>o("li",{role:"option","aria-selected":T===h.active,children:o("button",{type:"button",tabIndex:-1,class:`ask-ai__next-item${T===h.active?" ask-ai__next-item--active":""}`,onMouseDown:X=>X.preventDefault(),onMouseEnter:()=>v({...h,active:T}),onClick:()=>e.onDraft(g.prompt),children:g.prompt})},g.id))}),O.length>0&&o("ul",{class:"ask-ai__next",role:"listbox","aria-label":"Skills",children:O.map((g,T)=>o("li",{role:"option","aria-selected":T===C,children:o("button",{type:"button",tabIndex:-1,class:`ask-ai__next-item${T===C?" ask-ai__next-item--active":""}`,onMouseDown:X=>X.preventDefault(),onMouseEnter:()=>N(T),onClick:()=>I(g.id),children:[o("span",{class:"ask-ai__slash",children:["/",g.id]})," ",g.hint]})},g.id))}),o("div",{class:"ask-ai__bar",children:[o("div",{class:"ask-ai__add-wrap",ref:m,children:[o("button",{type:"button",class:"ask-ai__add","aria-label":"Add a file, a page or a skill","aria-haspopup":"menu","aria-expanded":a!=="closed",disabled:r,onClick:()=>n(a==="closed"?"add":"closed"),children:o(ut,{})}),a==="add"&&o("div",{class:"ask-ai__menu",role:"menu",children:[o("button",{type:"button",role:"menuitem",class:"ask-ai__menu-item",autoFocus:!0,onClick:()=>{n("closed"),p.current?.click()},children:[o(la,{}),"Upload from computer"]}),o("button",{type:"button",role:"menuitem",class:"ask-ai__menu-item",onClick:()=>n("pages"),children:[o(Re,{}),"Attach a page"]}),o("button",{type:"button",role:"menuitem",class:"ask-ai__menu-item",onClick:()=>n("skills"),children:[o(se,{}),"Assign a skill"]})]}),a==="skills"&&o("div",{class:"ask-ai__menu",role:"menu","aria-label":"Assign a skill",children:vt.map((g,T)=>o("button",{type:"button",role:"menuitemradio","aria-checked":e.command===g.id,class:"ask-ai__menu-item ask-ai__menu-item--skill",autoFocus:T===0,onClick:()=>{n("closed"),e.onCommand(e.command===g.id?null:g.id)},children:[o("span",{children:g.label}),o("span",{class:"ask-ai__menu-hint",children:g.hint})]},g.id))}),a==="pages"&&o(Ji,{docsOrigin:e.docsOrigin,onPick:g=>{n("closed"),e.onPage(g)},onBack:()=>n("add")})]}),o("input",{ref:p,type:"file",class:"ask-ai__picker",accept:e.accept,onChange:g=>{let T=g.currentTarget;e.onFile(T.files?.[0]),T.value=""}}),o("div",{class:"ask-ai__field",children:[o("textarea",{ref:e.field,class:"ask-ai__input",value:t,rows:1,onInput:g=>e.onDraft(g.currentTarget.value),onFocus:()=>_(!0),onBlur:()=>_(!1),onKeyDown:g=>{if(w){let T=Va(g.key,g.shiftKey,e.suggestions,h);if(T.kind!=="none"){g.preventDefault(),T.kind==="fill"?e.onDraft(T.text):v(T.tray);return}}if(O.length>0){let T=O.length;if(g.key==="ArrowDown"||g.key==="ArrowUp"){g.preventDefault(),N((C+(g.key==="ArrowDown"?1:T-1))%T);return}if((g.key==="Enter"||g.key==="Tab")&&!g.shiftKey){g.preventDefault(),I(O[Math.min(C,T-1)].id);return}}g.key==="Enter"&&!g.shiftKey&&(g.preventDefault(),e.onSend())},placeholder:P?"":"Ask about ABDM","aria-label":"Ask the assistant","aria-describedby":P?"ask-ai-next-hint":void 0}),P&&o(B,{children:[o("span",{class:"ask-ai__ghost","aria-hidden":"true",children:P.prompt}),o("span",{class:"ask-ai__sr",id:"ask-ai-next-hint",children:`Suggested: ${P.prompt}. Press Tab to use it, the arrow keys for related questions, Escape to dismiss.`})]})]}),P&&o("button",{type:"button",class:"ask-ai__tabkey","aria-label":`Use the suggestion: ${P.prompt}`,onMouseDown:g=>g.preventDefault(),onClick:()=>e.onDraft(P.prompt),children:"Tab"}),e.memory.earlier>0&&o(Ki,{...e.memory}),r?o("button",{class:"ask-ai__send ask-ai__send--stop",type:"button","aria-label":"Stop",onClick:e.onStop,children:o(aa,{})}):o("button",{class:"ask-ai__send",type:"submit","aria-label":"Send",disabled:t.trim()==="",children:o(ct,{})})]})]}),o("p",{class:"ask-ai__disclaimer",children:"This bot is AI, it can make mistakes."})]})}function Ji({docsOrigin:e,onPick:t,onBack:r}){let[a,n]=E(""),[i,s]=E(null),[l,d]=E(!1),[c,p]=E(0);R(()=>{let h=!0;return za(e).then(v=>h&&s(v),()=>h&&d(!0)),()=>{h=!1}},[e]);let m=i?Ba(i,a):[],u=l?"The page list could not be loaded.":i?a.trim()?m.length?null:"No page matches that.":"Type to search every page.":"Loading pages";return o("div",{class:"ask-ai__menu ask-ai__menu--pages",role:"dialog","aria-label":"Attach a page",children:[o("div",{class:"ask-ai__search",children:[o("button",{type:"button",class:"ask-ai__search-back","aria-label":"Back",onClick:r,children:o(da,{})}),o(ca,{}),o("input",{class:"ask-ai__search-field",value:a,autoFocus:!0,placeholder:"Search pages","aria-label":"Search pages",role:"combobox","aria-expanded":m.length>0,"aria-controls":"ask-ai-page-hits",onInput:h=>{n(h.currentTarget.value),p(0)},onKeyDown:h=>{h.key==="Enter"?(h.preventDefault(),m[c]&&t(m[c])):h.key==="ArrowDown"?(h.preventDefault(),p(v=>Math.min(v+1,m.length-1))):h.key==="ArrowUp"&&(h.preventDefault(),p(v=>Math.max(v-1,0)))}})]}),m.length>0&&o("ul",{class:"ask-ai__hits",id:"ask-ai-page-hits",role:"listbox",children:m.map((h,v)=>o("li",{role:"option","aria-selected":v===c,children:o("button",{type:"button",class:`ask-ai__hit${v===c?" ask-ai__hit--active":""}`,onMouseEnter:()=>p(v),onClick:()=>t(h),children:[o("span",{class:"ask-ai__hit-title",children:h.title}),o("span",{class:"ask-ai__hit-path",children:h.path.replace(/^\/docs\//,"")})]})},h.path))}),u&&o("p",{class:"ask-ai__search-status",children:u})]})}function ja({sessions:e,currentId:t,onOpen:r,onForget:a,onClearAll:n}){return e.length?o("div",{class:"ask-ai__history",children:[o("p",{class:"ask-ai__history-label",children:"Recents"}),o("ul",{class:"ask-ai__history-list",children:e.map(i=>{let s=i.id===t,l=i.title||"Untitled conversation";return o("li",{class:`ask-ai__history-row${s?" ask-ai__history-row--current":""}`,children:[o("button",{type:"button",class:"ask-ai__history-open","aria-current":s?"true":void 0,title:l,onClick:()=>r(i),children:l}),o("button",{type:"button",class:"ask-ai__history-forget","aria-label":`Delete ${l}`,title:"Delete",onClick:()=>a(i.id),children:o(ua,{})})]},i.id)})}),o("div",{class:"ask-ai__history-foot",children:[o("span",{children:"Kept in this browser only."}),o("button",{type:"button",class:"ask-ai__history-clear",onClick:n,children:"Clear all"})]})]}):o("div",{class:"ask-ai__history ask-ai__history--empty",children:[o("p",{class:"ask-ai__history-none",children:"No conversations yet."}),o("p",{class:"ask-ai__history-note",children:"What you ask here is kept in this browser only."})]})}function tn(e,t){for(var r in t)e[r]=t[r];return e}function rr(e,t){for(var r in e)if(r!=="__source"&&!(r in t))return!0;for(var a in t)if(a!=="__source"&&e[a]!==t[a])return!0;return!1}function rn(e,t){var r=t(),a=E({t:{__:r,u:t}}),n=a[0].t,i=a[1];return ta(function(){n.__=r,n.u=t,er(n)&&i({t:n})},[e,r,t]),R(function(){return er(n)&&i({t:n}),e(function(){er(n)&&i({t:n})})},[e]),r}function er(e){try{return!((t=e.__)===(r=e.u())&&(t!==0||1/t==1/r)||t!=t&&r!=r)}catch{return!0}var t,r}function Xa(e,t){this.props=e,this.context=t}function an(e,t){function r(n){var i=this.props.ref;return i!=n.ref&&i&&(typeof i=="function"?i(null):i.current=null),t?!t(this.props,n)||i!=n.ref:rr(this.props,n)}function a(n){return this.shouldComponentUpdate=r,Ae(e,n)}return a.displayName="Memo("+(e.displayName||e.name)+")",a.__f=a.prototype.isReactComponent=!0,a.type=e,a}(Xa.prototype=new Y).isPureReactComponent=!0,Xa.prototype.shouldComponentUpdate=function(e,t){return rr(this.props,e)||rr(this.state,t)};var qa=S.__b;S.__b=function(e){e.type&&e.type.__f&&e.ref&&(e.props.ref=e.ref,e.ref=null),qa&&qa(e)};var eo=typeof Symbol<"u"&&Symbol.for&&Symbol.for("react.forward_ref")||3911;function nn(e){function t(r){var a=tn({},r);return delete a.ref,e(a,r.ref||null)}return t.$$typeof=eo,t.render=e,t.prototype.isReactComponent=t.__f=!0,t.displayName="ForwardRef("+(e.displayName||e.name)+")",t}var to=S.__e;S.__e=function(e,t,r,a){if(e.then){for(var n,i=t;i=i.__;)if((n=i.__c)&&n.__c)return t.__e==null&&(t.__e=r.__e,t.__k=r.__k||[]),n.__c(e,t)}to(e,t,r,a)};var Ya=S.unmount;function on(e,t,r){return e&&(e.__c&&e.__c.__H&&(e.__c.__H.__.forEach(function(a){typeof a.__c=="function"&&a.__c()}),e.__c.__H=null),(e=tn({},e)).__c!=null&&(e.__c.__P===r&&(e.__c.__P=t),e.__c.__e=!0,e.__c=null),e.__k=e.__k&&e.__k.map(function(a){return on(a,t,r)})),e}function sn(e,t,r){return e&&r&&(e.__v=null,e.__k=e.__k&&e.__k.map(function(a){return sn(a,t,r)}),e.__c&&e.__c.__P===t&&(e.__e&&r.appendChild(e.__e),e.__c.__e=!0,e.__c.__P=r)),e}function tr(){this.__u=0,this.o=null,this.__b=null}function ln(e){var t=e.__&&e.__.__c;return t&&t.__a&&t.__a(e)}function wt(){this.i=null,this.l=null}S.unmount=function(e){var t=e.__c;t&&(t.__z=!0),t&&t.__R&&t.__R(),t&&32&e.__u&&(e.type=null),Ya&&Ya(e)},(tr.prototype=new Y).__c=function(e,t){var r=t.__c,a=this;a.o==null&&(a.o=[]),a.o.push(r);var n=ln(a.__v),i=!1,s=function(){i||a.__z||(i=!0,r.__R=null,n?n(d):d())};r.__R=s;var l=r.__P;r.__P=null;var d=function(){if(!--a.__u){if(a.state.__a){var c=a.state.__a;a.__v.__k[0]=sn(c,c.__c.__P,c.__c.__O)}var p;for(a.setState({__a:a.__b=null});p=a.o.pop();)p.__P=l,p.forceUpdate()}};a.__u++||32&t.__u||a.setState({__a:a.__b=a.__v.__k[0]}),e.then(s,s)},tr.prototype.componentWillUnmount=function(){this.o=[]},tr.prototype.render=function(e,t){if(this.__b){if(this.__v.__k){var r=document.createElement("div"),a=this.__v.__k[0].__c;this.__v.__k[0]=on(this.__b,r,a.__O=a.__P)}this.__b=null}var n=t.__a&&Ae(B,null,e.fallback);return n&&(n.__u&=-33),[Ae(B,null,t.__a?null:e.children),n]};var Ka=function(e,t,r){if(++r[1]===r[0]&&e.l.delete(t),e.props.revealOrder&&(e.props.revealOrder[0]!=="t"||!e.l.size))for(r=e.i;r;){for(;r.length>3;)r.pop()();if(r[1]<r[0])break;e.i=r=r[2]}};(wt.prototype=new Y).__a=function(e){var t=this,r=ln(t.__v),a=t.l.get(e);return a[0]++,function(n){var i=function(){t.props.revealOrder?(a.push(n),Ka(t,e,a)):n()};r?r(i):i()}},wt.prototype.render=function(e){this.i=null,this.l=new Map;var t=Ne(e.children);e.revealOrder&&e.revealOrder[0]==="b"&&t.reverse();for(var r=t.length;r--;)this.l.set(t[r],this.i=[1,0,this.i]);return e.children},wt.prototype.componentDidUpdate=wt.prototype.componentDidMount=function(){var e=this;this.l.forEach(function(t,r){Ka(e,r,t)})};var ro=typeof Symbol<"u"&&Symbol.for&&Symbol.for("react.element")||60103,ao=/^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|dominant|fill|flood|font|glyph(?!R)|horiz|image(!S)|letter|lighting|marker(?!H|W|U)|overline|paint|pointer|shape|stop|strikethrough|stroke|text(?!L)|transform|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/,no=/^on(Ani|Tra|Tou|BeforeInp|Compo)/,io=/[A-Z0-9]/g,oo=typeof document<"u",so=function(e){return(typeof Symbol<"u"&&typeof Symbol()=="symbol"?/fil|che|rad/:/fil|che|ra/).test(e)};Y.prototype.isReactComponent=!0,["componentWillMount","componentWillReceiveProps","componentWillUpdate"].forEach(function(e){Object.defineProperty(Y.prototype,e,{configurable:!0,get:function(){return this["UNSAFE_"+e]},set:function(t){Object.defineProperty(this,e,{configurable:!0,writable:!0,value:t})}})});var Ja=S.event;S.event=function(e){return Ja&&(e=Ja(e)),e.persist=function(){},e.isPropagationStopped=function(){return this.cancelBubble},e.isDefaultPrevented=function(){return this.defaultPrevented},e.nativeEvent=e};var cn,lo={configurable:!0,get:function(){return this.class}},Qa=S.vnode;S.vnode=function(e){typeof e.type=="string"&&(function(t){var r=t.props,a=t.type,n={},i=a.indexOf("-")==-1;for(var s in r){var l=r[s];if(!(s==="value"&&"defaultValue"in r&&l==null||oo&&s==="children"&&a==="noscript"||s==="class"||s==="className")){var d=s.toLowerCase();s==="defaultValue"&&"value"in r&&r.value==null?s="value":s==="download"&&l===!0?l="":d==="translate"&&l==="no"?l=!1:d[0]==="o"&&d[1]==="n"?d==="ondoubleclick"?s="ondblclick":d!=="onchange"||a!=="input"&&a!=="textarea"||so(r.type)?d==="onfocus"?s="onfocusin":d==="onblur"?s="onfocusout":no.test(s)&&(s=d):d=s="oninput":i&&ao.test(s)?s=s.replace(io,"-$&").toLowerCase():l===null&&(l=void 0),d==="oninput"&&n[s=d]&&(s="oninputCapture"),n[s]=l}}a=="select"&&(n.multiple&&Array.isArray(n.value)&&(n.value=Ne(r.children).forEach(function(c){c.props.selected=n.value.indexOf(c.props.value)!=-1})),n.defaultValue!=null&&(n.value=Ne(r.children).forEach(function(c){c.props.selected=n.multiple?n.defaultValue.indexOf(c.props.value)!=-1:n.defaultValue==c.props.value}))),r.class&&!r.className?(n.class=r.class,Object.defineProperty(n,"className",lo)):r.className&&(n.class=n.className=r.className),t.props=n})(e),e.$$typeof=ro,Qa&&Qa(e)};var Za=S.__r;S.__r=function(e){Za&&Za(e),cn=e.__c};var en=S.diffed;S.diffed=function(e){en&&en(e);var t=e.props,r=e.__e;r!=null&&e.type==="textarea"&&"value"in t&&t.value!==r.value&&(r.value=t.value==null?"":t.value),cn=null};var un=`#version 300 es
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
}`;var dn=1920*1080*4,Ge=class{parentElement;canvasElement;gl;program=null;uniformLocations={};fragmentShader;rafId=null;lastRenderTime=0;currentFrame=0;speed=0;currentSpeed=0;providedUniforms;mipmaps=[];hasBeenDisposed=!1;resolutionChanged=!0;textures=new Map;minPixelRatio;maxPixelCount;isSafari=po();uniformCache={};textureUnitMap=new Map;ownerDocument;constructor(t,r,a,n,i=0,s=0,l=2,d=dn,c=[]){if(t?.nodeType===1)this.parentElement=t;else throw new Error("Paper Shaders: parent element must be an HTMLElement");if(this.ownerDocument=t.ownerDocument,!this.ownerDocument.querySelector("style[data-paper-shader]")){let u=this.ownerDocument.createElement("style");u.innerHTML=fo,u.setAttribute("data-paper-shader",""),this.ownerDocument.head.prepend(u)}let p=this.ownerDocument.createElement("canvas");this.canvasElement=p,this.parentElement.prepend(p),this.fragmentShader=r,this.providedUniforms=a,this.mipmaps=c,this.currentFrame=s,this.minPixelRatio=l,this.maxPixelCount=d;let m=p.getContext("webgl2",n);if(!m)throw new Error("Paper Shaders: WebGL is not supported in this browser");this.gl=m,this.initProgram(),this.setupPositionAttribute(),this.setupUniforms(),this.setUniformValues(this.providedUniforms),this.setupResizeObserver(),visualViewport?.addEventListener("resize",this.handleVisualViewportChange),this.setupIntersectionObserver(),this.setSpeed(i),this.parentElement.setAttribute("data-paper-shader",""),this.parentElement.paperShaderMount=this,this.ownerDocument.addEventListener("visibilitychange",this.handleDocumentVisibilityChange)}initProgram=()=>{let t=uo(this.gl,un,this.fragmentShader);t&&(this.program=t)};setupPositionAttribute=()=>{let t=this.gl.getAttribLocation(this.program,"a_position"),r=this.gl.createBuffer();this.gl.bindBuffer(this.gl.ARRAY_BUFFER,r);let a=[-1,-1,1,-1,-1,1,-1,1,1,-1,1,1];this.gl.bufferData(this.gl.ARRAY_BUFFER,new Float32Array(a),this.gl.STATIC_DRAW),this.gl.enableVertexAttribArray(t),this.gl.vertexAttribPointer(t,2,this.gl.FLOAT,!1,0,0)};setupUniforms=()=>{let t={u_time:this.gl.getUniformLocation(this.program,"u_time"),u_pixelRatio:this.gl.getUniformLocation(this.program,"u_pixelRatio"),u_resolution:this.gl.getUniformLocation(this.program,"u_resolution")};Object.entries(this.providedUniforms).forEach(([r,a])=>{if(t[r]=this.gl.getUniformLocation(this.program,r),a instanceof HTMLImageElement){let n=`${r}AspectRatio`;t[n]=this.gl.getUniformLocation(this.program,n)}}),this.uniformLocations=t};renderScale=1;parentWidth=0;parentHeight=0;parentDevicePixelWidth=0;parentDevicePixelHeight=0;devicePixelsSupported=!1;intersectionObserver=null;isInViewport=!0;resizeObserver=null;setupResizeObserver=()=>{this.resizeObserver=new ResizeObserver(([t])=>{if(t?.borderBoxSize[0]){let r=t.devicePixelContentBoxSize?.[0];r!==void 0&&(this.devicePixelsSupported=!0,this.parentDevicePixelWidth=r.inlineSize,this.parentDevicePixelHeight=r.blockSize),this.parentWidth=t.borderBoxSize[0].inlineSize,this.parentHeight=t.borderBoxSize[0].blockSize}this.handleResize()}),this.resizeObserver.observe(this.parentElement)};setupIntersectionObserver=()=>{let t=this.ownerDocument.defaultView;t?.IntersectionObserver&&(this.intersectionObserver=new t.IntersectionObserver(([r])=>{this.isInViewport=r?.isIntersecting??!0,this.updateCurrentSpeed()}),this.intersectionObserver.observe(this.parentElement))};handleVisualViewportChange=()=>{this.resizeObserver?.disconnect(),this.setupResizeObserver()};handleResize=()=>{let t=0,r=0,a=Math.max(1,window.devicePixelRatio),n=visualViewport?.scale??1;if(this.devicePixelsSupported){let p=Math.max(1,this.minPixelRatio/a);t=this.parentDevicePixelWidth*p*n,r=this.parentDevicePixelHeight*p*n}else{let p=Math.max(a,this.minPixelRatio)*n;if(this.isSafari){let m=ho(this.ownerDocument);p*=Math.max(1,m)}t=Math.round(this.parentWidth)*p,r=Math.round(this.parentHeight)*p}let i=Math.sqrt(this.maxPixelCount)/Math.sqrt(t*r),s=Math.min(1,i),l=Math.round(t*s),d=Math.round(r*s),c=l/Math.round(this.parentWidth);(this.canvasElement.width!==l||this.canvasElement.height!==d||this.renderScale!==c)&&(this.renderScale=c,this.canvasElement.width=l,this.canvasElement.height=d,this.resolutionChanged=!0,this.gl.viewport(0,0,this.gl.canvas.width,this.gl.canvas.height),this.render(performance.now()))};render=t=>{if(this.hasBeenDisposed)return;if(this.program===null){console.warn("Tried to render before program or gl was initialized");return}let r=t-this.lastRenderTime;this.lastRenderTime=t,this.currentSpeed!==0&&(this.currentFrame+=r*this.currentSpeed),this.gl.clear(this.gl.COLOR_BUFFER_BIT),this.gl.useProgram(this.program),this.gl.uniform1f(this.uniformLocations.u_time,this.currentFrame*.001),this.resolutionChanged&&(this.gl.uniform2f(this.uniformLocations.u_resolution,this.gl.canvas.width,this.gl.canvas.height),this.gl.uniform1f(this.uniformLocations.u_pixelRatio,this.renderScale),this.resolutionChanged=!1),this.gl.drawArrays(this.gl.TRIANGLES,0,6),this.currentSpeed!==0?this.requestRender():this.rafId=null};requestRender=()=>{this.rafId!==null&&cancelAnimationFrame(this.rafId),this.rafId=requestAnimationFrame(this.render)};setTextureUniform=(t,r)=>{if(!r.complete||r.naturalWidth===0)throw new Error(`Paper Shaders: image for uniform ${t} must be fully loaded`);let a=this.textures.get(t);a&&this.gl.deleteTexture(a),this.textureUnitMap.has(t)||this.textureUnitMap.set(t,this.textureUnitMap.size);let n=this.textureUnitMap.get(t);this.gl.activeTexture(this.gl.TEXTURE0+n);let i=this.gl.createTexture();this.gl.bindTexture(this.gl.TEXTURE_2D,i),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_WRAP_S,this.gl.CLAMP_TO_EDGE),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_WRAP_T,this.gl.CLAMP_TO_EDGE),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MIN_FILTER,this.gl.LINEAR),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MAG_FILTER,this.gl.LINEAR),this.gl.texImage2D(this.gl.TEXTURE_2D,0,this.gl.RGBA,this.gl.RGBA,this.gl.UNSIGNED_BYTE,r),this.mipmaps.includes(t)&&(this.gl.generateMipmap(this.gl.TEXTURE_2D),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MIN_FILTER,this.gl.LINEAR_MIPMAP_LINEAR));let s=this.gl.getError();if(s!==this.gl.NO_ERROR||i===null){console.error("Paper Shaders: WebGL error when uploading texture:",s);return}this.textures.set(t,i);let l=this.uniformLocations[t];if(l){this.gl.uniform1i(l,n);let d=`${t}AspectRatio`,c=this.uniformLocations[d];if(c){let p=r.naturalWidth/r.naturalHeight;this.gl.uniform1f(c,p)}}};areUniformValuesEqual=(t,r)=>t===r?!0:Array.isArray(t)&&Array.isArray(r)&&t.length===r.length?t.every((a,n)=>this.areUniformValuesEqual(a,r[n])):!1;setUniformValues=t=>{this.gl.useProgram(this.program),Object.entries(t).forEach(([r,a])=>{let n=a;if(a instanceof HTMLImageElement&&(n=`${a.src.slice(0,200)}|${a.naturalWidth}x${a.naturalHeight}`),this.areUniformValuesEqual(this.uniformCache[r],n))return;this.uniformCache[r]=n;let i=this.uniformLocations[r];if(!i){console.warn(`Uniform location for ${r} not found`);return}if(a instanceof HTMLImageElement)this.setTextureUniform(r,a);else if(Array.isArray(a)){let s=null,l=null;if(a[0]!==void 0&&Array.isArray(a[0])){let d=a[0].length;if(a.every(c=>c.length===d))s=a.flat(),l=d;else{console.warn(`All child arrays must be the same length for ${r}`);return}}else s=a,l=s.length;switch(l){case 2:this.gl.uniform2fv(i,s);break;case 3:this.gl.uniform3fv(i,s);break;case 4:this.gl.uniform4fv(i,s);break;case 9:this.gl.uniformMatrix3fv(i,!1,s);break;case 16:this.gl.uniformMatrix4fv(i,!1,s);break;default:console.warn(`Unsupported uniform array length: ${l}`)}}else typeof a=="number"?this.gl.uniform1f(i,a):typeof a=="boolean"?this.gl.uniform1i(i,a?1:0):console.warn(`Unsupported uniform type for ${r}: ${typeof a}`)})};getCurrentFrame=()=>this.currentFrame;setFrame=t=>{this.currentFrame=t,this.lastRenderTime=performance.now(),this.render(performance.now())};setSpeed=(t=1)=>{this.speed=t,this.updateCurrentSpeed()};updateCurrentSpeed=()=>{this.setCurrentSpeed(this.ownerDocument.hidden||!this.isInViewport?0:this.speed)};setCurrentSpeed=t=>{this.currentSpeed=t,this.rafId===null&&t!==0&&(this.lastRenderTime=performance.now(),this.rafId=requestAnimationFrame(this.render)),this.rafId!==null&&t===0&&(cancelAnimationFrame(this.rafId),this.rafId=null)};setMaxPixelCount=(t=dn)=>{this.maxPixelCount=t,this.handleResize()};setMinPixelRatio=(t=2)=>{this.minPixelRatio=t,this.handleResize()};setUniforms=t=>{this.setUniformValues(t),this.providedUniforms={...this.providedUniforms,...t},this.render(performance.now())};handleDocumentVisibilityChange=()=>{this.updateCurrentSpeed()};dispose=()=>{this.hasBeenDisposed=!0,this.rafId!==null&&(cancelAnimationFrame(this.rafId),this.rafId=null),this.gl&&this.program&&(this.textures.forEach(t=>{this.gl.deleteTexture(t)}),this.textures.clear(),this.gl.deleteProgram(this.program),this.program=null,this.gl.bindBuffer(this.gl.ARRAY_BUFFER,null),this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER,null),this.gl.bindRenderbuffer(this.gl.RENDERBUFFER,null),this.gl.bindFramebuffer(this.gl.FRAMEBUFFER,null),this.gl.getError()),this.resizeObserver&&(this.resizeObserver.disconnect(),this.resizeObserver=null),this.intersectionObserver&&(this.intersectionObserver.disconnect(),this.intersectionObserver=null),visualViewport?.removeEventListener("resize",this.handleVisualViewportChange),this.ownerDocument.removeEventListener("visibilitychange",this.handleDocumentVisibilityChange),this.uniformLocations={},this.canvasElement.remove(),delete this.parentElement.paperShaderMount}};function fn(e,t,r){let a=e.createShader(t);return a?(e.shaderSource(a,r),e.compileShader(a),e.getShaderParameter(a,e.COMPILE_STATUS)?a:(console.error("An error occurred compiling the shaders: "+e.getShaderInfoLog(a)),e.deleteShader(a),null)):null}function uo(e,t,r){let a=e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT),n=a?a.precision:null;n&&n<23&&(t=t.replace(/precision\s+(lowp|mediump)\s+float;/g,"precision highp float;"),r=r.replace(/precision\s+(lowp|mediump)\s+float/g,"precision highp float").replace(/\b(uniform|varying|attribute)\s+(lowp|mediump)\s+(\w+)/g,"$1 highp $3"));let i=fn(e,e.VERTEX_SHADER,t),s=fn(e,e.FRAGMENT_SHADER,r);if(!i||!s)return null;let l=e.createProgram();return l?(e.attachShader(l,i),e.attachShader(l,s),e.linkProgram(l),e.getProgramParameter(l,e.LINK_STATUS)?(e.detachShader(l,i),e.detachShader(l,s),e.deleteShader(i),e.deleteShader(s),l):(console.error("Unable to initialize the shader program: "+e.getProgramInfoLog(l)),e.deleteProgram(l),e.deleteShader(i),e.deleteShader(s),null)):null}var fo=`@layer paper-shaders {
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
}`;function po(){let e=navigator.userAgent.toLowerCase();return e.includes("safari")&&!e.includes("chrome")&&!e.includes("android")}function ho(e){let t=visualViewport?.scale??1,r=visualViewport?.width??window.innerWidth,a=window.innerWidth-e.documentElement.clientWidth,n=t*r+a,i=outerWidth/n,s=Math.round(100*i);return s%5===0?s/100:s===33?1/3:s===67?2/3:s===133?4/3:i}var Me={fit:"contain",scale:1,rotation:0,offsetX:0,offsetY:0,originX:.5,originY:.5,worldWidth:0,worldHeight:0};var ar={none:0,contain:1,cover:2};var pn=`
#define TWO_PI 6.28318530718
#define PI 3.14159265358979323846
`,hn=`
vec2 rotate(vec2 uv, float th) {
  return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
}
`;var mn=`
  float hash21(vec2 p) {
    p = fract(p * vec2(0.3183099, 0.3678794)) + 0.1;
    p += dot(p, p + 19.19);
    return fract(p.x * p.y);
  }
`;var nr={maxColorCount:10},ir=`#version 300 es
precision mediump float;

uniform float u_time;

uniform vec4 u_colors[${nr.maxColorCount}];
uniform float u_colorsCount;

uniform float u_distortion;
uniform float u_swirl;
uniform float u_grainMixer;
uniform float u_grainOverlay;

in vec2 v_objectUV;
out vec4 fragColor;

${pn}
${hn}
${mn}

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

  for (int i = 0; i < ${nr.maxColorCount}; i++) {
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
`;function or(e){if(Array.isArray(e))return e.length===4?e:e.length===3?[...e,1]:Ce;if(typeof e!="string")return Ce;let t,r,a,n=1;if(e.startsWith("#"))[t,r,a,n]=mo(e);else if(e.startsWith("rgb")){let i=go(e);if(i===null)return Ce;[t,r,a,n]=i}else if(e.startsWith("hsl")){let i=_o(e);if(i===null)return Ce;[t,r,a,n]=vo(i)}else return console.error("Unsupported color format",e),Ce;return[St(t,0,1),St(r,0,1),St(a,0,1),St(n,0,1)]}function mo(e){if(e=e.replace(/^#/,""),(e.length===3||e.length===4)&&(e=e.split("").map(i=>i+i).join("")),e.length===6&&(e=e+"ff"),!/^[0-9a-f]{8}$/i.test(e))return console.warn("Invalid hex color"),Ce;let t=parseInt(e.slice(0,2),16)/255,r=parseInt(e.slice(2,4),16)/255,a=parseInt(e.slice(4,6),16)/255,n=parseInt(e.slice(6,8),16)/255;return[t,r,a,n]}function go(e){let t=e.match(/^rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([0-9.]+))?\s*\)$/i);return t?[parseInt(t[1]??"0")/255,parseInt(t[2]??"0")/255,parseInt(t[3]??"0")/255,t[4]===void 0?1:parseFloat(t[4])]:null}function _o(e){let t=e.match(/^hsla?\s*\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*(?:,\s*([0-9.]+))?\s*\)$/i);return t?[parseInt(t[1]??"0"),parseInt(t[2]??"0"),parseInt(t[3]??"0"),t[4]===void 0?1:parseFloat(t[4])]:null}function vo(e){let[t,r,a,n]=e,i=t/360,s=r/100,l=a/100,d,c,p;if(r===0)d=c=p=l;else{let m=(v,b,_)=>(_<0&&(_+=1),_>1&&(_-=1),_<.16666666666666666?v+(b-v)*6*_:_<.5?b:_<.6666666666666666?v+(b-v)*(.6666666666666666-_)*6:v),u=l<.5?l*(1+s):l+s-l*s,h=2*l-u;d=m(h,u,i+1/3),c=m(h,u,i),p=m(h,u,i-1/3)}return[d,c,p,n]}var St=(e,t,r)=>Math.min(Math.max(e,t),r),Ce=[.5,.5,.5,1];var sr="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";function gn(e){let t=A(void 0),r=zt(a=>{let n=e.map(i=>{if(i!=null){if(typeof i=="function"){let s=i,l=s(a);return typeof l=="function"?l:()=>{s(null)}}return i.current=a,()=>{i.current=null}}});return()=>{n.forEach(i=>i?.())}},e);return ze(()=>e.every(a=>a==null)?null:a=>{t.current&&(t.current(),t.current=void 0),a!=null&&(t.current=r(a))},e)}function lr(e){if(e.naturalWidth<1024&&e.naturalHeight<1024){if(e.naturalWidth<1||e.naturalHeight<1)return;let t=e.naturalWidth/e.naturalHeight;e.width=Math.round(t>1?1024*t:1024),e.height=Math.round(t>1?1024:1024/t)}}async function _n(e){let t={},r=[],a=i=>{try{return i.startsWith("/")||new URL(i),!0}catch{return!1}},n=i=>{try{return i.startsWith("/")?!1:new URL(i,window.location.origin).origin!==window.location.origin}catch{return!1}};return Object.entries(e).forEach(([i,s])=>{if(typeof s=="string"){let l=s||sr;if(!a(l)){console.warn(`Uniform "${i}" has invalid URL "${l}". Skipping image loading.`);return}let d=new Promise((c,p)=>{let m=new Image;n(l)&&(m.crossOrigin="anonymous"),m.onload=()=>{lr(m),t[i]=m,c()},m.onerror=()=>{console.error(`Could not set uniforms. Failed to load image at ${l}`),p()},m.src=l});r.push(d)}else if(s instanceof HTMLImageElement){let l=s.decode().then(()=>{lr(s),t[i]=s});r.push(l)}else t[i]=s}),await Promise.all(r),t}var cr=nn(function({fragmentShader:t,uniforms:r,webGlContextAttributes:a,speed:n=0,frame:i=0,width:s,height:l,minPixelRatio:d,maxPixelCount:c,mipmaps:p,style:m,...u},h){let[v,b]=E(!1),_=A(null),k=A(null),w=A(a);R(()=>((async()=>{let O=await _n(r);_.current&&!k.current&&(k.current=new Ge(_.current,t,O,w.current,n,i,d,c,p),b(!0))})(),()=>{k.current?.dispose(),k.current=null}),[t]),R(()=>{let P=!1;return(async()=>{let C=await _n(r);P||k.current?.setUniforms(C)})(),()=>{P=!0}},[r,v]),R(()=>{k.current?.setSpeed(n)},[n,v]),R(()=>{k.current?.setMaxPixelCount(c)},[c,v]),R(()=>{k.current?.setMinPixelRatio(d)},[d,v]),R(()=>{k.current?.setFrame(i)},[i,v]);let U=gn([_,h]);return o("div",{ref:U,style:s!==void 0||l!==void 0?{width:typeof s=="string"&&isNaN(+s)===!1?+s:s,height:typeof l=="string"&&isNaN(+l)===!1?+l:l,...m}:m,...u})});cr.displayName="ShaderMount";function vn(e,t){if(Object.keys(e).length!==Object.keys(t).length)return!1;for(let r in e){if(r==="colors"){let a=Array.isArray(e.colors),n=Array.isArray(t.colors);if(!a||!n){if(Object.is(e.colors,t.colors)===!1)return!1;continue}if(e.colors?.length!==t.colors?.length||!e.colors?.every((i,s)=>i===t.colors?.[s]))return!1;continue}if(Object.is(e[r],t[r])===!1)return!1}return!0}var z={name:"Default",params:{...Me,speed:1,frame:0,colors:["#e0eaff","#241d9a","#f75092","#9f50d3"],distortion:.8,swirl:.1,grainMixer:0,grainOverlay:0}},hl={name:"Purple",params:{...Me,speed:.6,frame:0,colors:["#aaa7d7","#3c2b8e"],distortion:1,swirl:1,grainMixer:0,grainOverlay:0}},ml={name:"Beach",params:{...Me,speed:.1,frame:0,colors:["#bcecf6","#00aaff","#00f7ff","#ffd447"],distortion:.8,swirl:.35,grainMixer:0,grainOverlay:0}},gl={name:"Ink",params:{...Me,speed:1,frame:0,colors:["#ffffff","#000000"],distortion:1,swirl:.2,rotation:90,grainMixer:0,grainOverlay:0}};var ur=an(function({speed:t=z.params.speed,frame:r=z.params.frame,colors:a=z.params.colors,distortion:n=z.params.distortion,swirl:i=z.params.swirl,grainMixer:s=z.params.grainMixer,grainOverlay:l=z.params.grainOverlay,fit:d=z.params.fit,rotation:c=z.params.rotation,scale:p=z.params.scale,originX:m=z.params.originX,originY:u=z.params.originY,offsetX:h=z.params.offsetX,offsetY:v=z.params.offsetY,worldWidth:b=z.params.worldWidth,worldHeight:_=z.params.worldHeight,...k}){let w={u_colors:a.map(or),u_colorsCount:a.length,u_distortion:n,u_swirl:i,u_grainMixer:s,u_grainOverlay:l,u_fit:ar[d],u_rotation:c,u_scale:p,u_offsetX:h,u_offsetY:v,u_originX:m,u_originY:u,u_worldWidth:b,u_worldHeight:_};return o(cr,{...k,speed:t,frame:r,fragmentShader:ir,uniforms:w})},vn);var je="#fb7185",Xe="#f43f5e",dr=e=>{let t=e.replace("#",""),r=t.length===3?t.split("").map(n=>n+n).join(""):t,a=Number.parseInt(r,16);return[a>>16&255,a>>8&255,a&255]},fr=(e,t)=>{switch(e){case"listening":return .4+.32*Math.abs(Math.sin(t*8.5))+.18*Math.abs(Math.sin(t*4.1+1.5));case"speaking":return .3+.24*Math.abs(Math.sin(t*6.2))+.16*Math.abs(Math.sin(t*3+.6));case"thinking":return .24+.2*Math.abs(Math.sin(t*2.4));case"connecting":return .12+.1*Math.abs(Math.sin(t*1.6));case"error":return .2;default:return 0}},ge=(e,t,r,a)=>e+(t-e)*(1-Math.exp(-r*a)),bn=({size:e,speed:t,colorFrom:r,colorTo:a})=>{let n={};return e!=null&&(n["--orb-size"]=`${e}px`),t!=null&&(n["--orb-speed"]=`${t}`),r&&(n["--orb-color-from"]=r),a&&(n["--orb-color-to"]=a),n};var At=(e,t)=>{let r=!0,a=document.visibilityState==="visible",n=r&&a,i=()=>{let d=r&&a;d!==n&&(n=d,t(d))},s=new IntersectionObserver(d=>{r=d[d.length-1]?.isIntersecting??!0,i()});s.observe(e);let l=()=>{a=document.visibilityState==="visible",i()};return document.addEventListener("visibilitychange",l),()=>{s.disconnect(),document.removeEventListener("visibilitychange",l)}},qe=null,yn=()=>{if(qe!==null)return qe;try{let e=document.createElement("canvas"),t={failIfMajorPerformanceCaveat:!0};qe=e.getContext("webgl2",t)!==null||e.getContext("webgl",t)!==null}catch{qe=!1}return qe};var Sn="(prefers-reduced-motion: reduce)",bo=e=>{let t=window.matchMedia(Sn);return t.addEventListener("change",e),()=>t.removeEventListener("change",e)},yo=()=>rn(bo,()=>window.matchMedia(Sn).matches),_e=(e,t,r)=>{let[a,n,i]=dr(e),[s,l,d]=dr(t),c=(p,m)=>Math.round(p+(m-p)*r).toString(16).padStart(2,"0");return`#${c(a,s)}${c(n,l)}${c(i,d)}`},An=(e,t)=>_e(e,"#000000",t),Tt=(e,t)=>_e(e,"#ffffff",t),Tn=(e,t)=>[An(e,.35),e,_e(e,t,.5),t,Tt(t,.35)],kn=Tn(je,Xe),ko={antialias:!0,powerPreference:"low-power"},xo=8e3,wo=66,So=.1,Ao=7.5,xn=6,To=5,Eo=6,Ro=6,Mo=.9,Co=e=>e==="error"?1.8:e==="listening"?1.6:e==="speaking"?1.1:e==="thinking"?.95:e==="connecting"?.5:.3,pr=e=>e==="error"?.2:e==="speaking"?.18:e==="listening"?.16:e==="thinking"?.1:e==="connecting"?.08:.06,Po={distortion:.42,swirl:.26},hr=(e,t,r=Po)=>{switch(e){case"thinking":return{distortion:.35,swirl:Math.min(1,.75+t*.2)};case"listening":case"speaking":return{distortion:Math.min(1,.5+t*.4),swirl:Math.min(1,.3+t*.25)};case"error":return{distortion:.85,swirl:.55};case"connecting":return{distortion:Math.min(1,.42+t*.55),swirl:.3};default:return r}},En=(e,t)=>e==="disabled"?0:Co(e)*t,wn=(e,t,r)=>({energy:0,...hr(e,0,r),shaderSpeed:En(e,t),grain:pr(e),errorMix:e==="error"?1:0}),Pe=(e,t)=>Math.round(e*t)/t,Io=(e,t)=>e.energy===t.energy&&e.distortion===t.distortion&&e.swirl===t.swirl&&e.shaderSpeed===t.shaderSpeed&&e.grain===t.grain&&e.errorMix===t.errorMix,mr=({state:e="idle",size:t=160,speed:r=1,colorFrom:a="#7c3aed",colorTo:n="#06b6d4",colors:i,idleMotion:s,meshScale:l=1.15,gloss:d=!0,levelRef:c,label:p="Assistant orb",className:m})=>{let u=A(null),h=A(null),v=A(e),b=A(r),_=yo(),k=yn(),w=A(s);w.current=s;let[U,P]=E(()=>wn(e,r,s)),O=A(null);R(()=>{v.current=e,b.current=r}),R(()=>{if(_)return;let $=u.current;if(!$)return;O.current===null&&(O.current=wn(v.current,b.current,w.current));let M=O.current,V=0,J=null,Je=0,ue=0,ve=!0,de=G=>{V=0;let ee=Math.min(So,J===null?1/60:(G-J)/1e3);J=G;let ne=v.current,te=b.current;Je+=ee*te;let be=c?.current,ye=typeof be=="number"&&be>=0;M.energy=ge(M.energy,ye?be:fr(ne,Je),Ao,ee);let pe=hr(ne,M.energy,w.current);if(M.distortion=ge(M.distortion,pe.distortion,xn,ee),M.swirl=ge(M.swirl,pe.swirl,xn,ee),M.shaderSpeed=ge(M.shaderSpeed,En(ne,te),To,ee),M.grain=ge(M.grain,pr(ne),Eo,ee),M.errorMix=ge(M.errorMix,ne==="error"?1:0,Ro,ee),$.style.setProperty("--orb-level",M.energy.toFixed(3)),k&&G-ue>wo){ue=G;let ie={energy:Pe(M.energy,50),distortion:Pe(M.distortion,100),swirl:Pe(M.swirl,100),shaderSpeed:Pe(M.shaderSpeed,100),grain:Pe(M.grain,200),errorMix:Pe(M.errorMix,100)};P(Rt=>Io(Rt,ie)?Rt:ie)}ve&&(V=requestAnimationFrame(de))},fe=()=>{V===0&&(J=null,V=requestAnimationFrame(de))},Qe=()=>{V!==0&&(cancelAnimationFrame(V),V=0),J=null},Ie=At($,G=>{ve=G,G?fe():Qe()});return fe(),()=>{Qe(),Ie()}},[c,_,k]),R(()=>{if(e!=="error"||_)return;let $=h.current;if(!$)return;let M=$.animate([{transform:"translateX(0)"},{transform:"translateX(-1.5px)"},{transform:"translateX(3px)"},{transform:"translateX(-2px)"},{transform:"translateX(1px)"},{transform:"translateX(0)"}],{duration:340,easing:"ease-out"});return()=>M.cancel()},[e,_]);let C=fr(e,Mo),N=_?{energy:C,...hr(e,C,s),shaderSpeed:0,grain:pr(e),errorMix:e==="error"?1:0}:U,I=k?N.errorMix:e==="error"?1:0,K=I>=1?je:I<=0?a:_e(a,je,I),g=I>=1?Xe:I<=0?n:_e(n,Xe,I),T=i??Tn(a,n),X=I>=1?kn:I<=0?T:T.map(($,M)=>_e($,kn[M],I)),Ke=[{key:"brand",from:a,to:n,visible:e!=="error"},{key:"error",from:je,to:Xe,visible:e==="error"}].map(({key:$,from:M,to:V,visible:J})=>({key:$,visible:J,base:`radial-gradient(circle at 50% 40%, ${Tt(M,.12)}, ${_e(M,V,.55)} 55%, ${An(V,.35)} 100%)`,glow:`radial-gradient(circle at 32% 26%, ${Tt(V,.45)}, transparent 55%), radial-gradient(circle at 66% 72%, ${Tt(M,.2)}, transparent 62%)`})),ce={...bn({size:t,speed:r,colorFrom:a,colorTo:n}),..._?{"--orb-level":C.toFixed(3)}:null,width:t,height:t,position:"relative",borderRadius:"50%",opacity:e==="disabled"?.5:1,filter:e==="disabled"?"grayscale(0.85)":"grayscale(0)",transform:k?`scale(${(1+N.energy*.06).toFixed(4)})`:void 0,scale:k?void 0:"calc(1 + var(--orb-level, 0) * 0.06)",transition:"transform 0.2s ease-out, opacity 0.3s ease-out, filter 0.3s ease-out"};return o("div",{ref:u,role:"img","aria-label":p,"data-state":e,class:m,style:ce,children:[o("div",{style:{position:"absolute",inset:0,borderRadius:"50%",boxShadow:`0 ${-t*.06}px ${t*.3}px color-mix(in oklab, ${K} 55%, transparent), 0 ${t*.06}px ${t*.3}px color-mix(in oklab, ${g} 55%, transparent)`,opacity:k?Math.min(1,.35+N.energy*.65):"calc(0.35 + var(--orb-level, 0) * 0.6)",transform:k?`scale(${(1+N.energy*.08).toFixed(4)})`:void 0,scale:k?void 0:"calc(1 + var(--orb-level, 0) * 0.08)",transition:k?"opacity 0.2s ease-out, transform 0.2s ease-out, box-shadow 0.35s ease":"box-shadow 0.35s ease"}}),o("div",{ref:h,style:{position:"absolute",inset:0,borderRadius:"50%",overflow:"hidden",boxShadow:`inset 0 0 0 1px color-mix(in oklab, ${K} 45%, transparent), 0 0 0 1px rgba(255,255,255,0.08)`,transition:"box-shadow 0.35s ease"},children:[k?o(ur,{width:t,height:t,colors:X,distortion:N.distortion,swirl:N.swirl,scale:l,speed:N.shaderSpeed,frame:xo,grainMixer:N.grain,grainOverlay:.05,minPixelRatio:2,webGlContextAttributes:ko}):o("div",{"aria-hidden":"true",style:{position:"absolute",inset:0,borderRadius:"50%"},children:Ke.map($=>o("div",{style:{position:"absolute",inset:0,borderRadius:"50%",backgroundImage:$.base,opacity:$.visible?1:0,transition:"opacity 0.35s ease"},children:o("div",{style:{position:"absolute",inset:0,borderRadius:"50%",backgroundImage:$.glow,opacity:"calc(0.25 + var(--orb-level, 0) * 0.75)"}})},$.key))}),d&&o("div",{style:{position:"absolute",inset:0,borderRadius:"50%",pointerEvents:"none",backgroundImage:"radial-gradient(circle at 31% 22%, rgba(255,255,255,0.55), transparent 14%), radial-gradient(circle at 30% 26%, rgba(255,255,255,0.28), transparent 48%), radial-gradient(circle at 68% 76%, rgba(10,14,24,0.42), transparent 60%)"}})]})]})};var Pn=["#9483ec","#bcc0f7","#6a8bf1","#7fd6fb","#f2f4ff"],In=1.6,On={distortion:1,swirl:.85},Rn=.76,Oo=.86,Un=10,Mn=()=>typeof window<"u"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;function gr(e,t){let r=.5+.5*Math.sin(t*.85),a=e/2*(Rn+(Oo-Rn)*r);return{rx:a*(1+.035*Math.sin(t*1.3)),ry:a*(1+.035*Math.sin(t*1.7+1.2)),cx:e/2+e*.012*Math.sin(t*.7),cy:e/2+e*.012*Math.cos(t*.8+.5)}}var Ln=({rx:e,ry:t,cx:r,cy:a})=>`${e.toFixed(1)}px ${t.toFixed(1)}px at ${r.toFixed(1)}px ${a.toFixed(1)}px`,_r=e=>`radial-gradient(${Ln(e)}, #000 0%, #000 ${100-Un}%, transparent 100%)`,Cn=e=>`radial-gradient(${Ln(e)}, transparent 0%, transparent ${100-Un}%, #000 100%)`;function vr(e,t){e&&(e.style.maskImage=t,e.style.setProperty("-webkit-mask-image",t))}function Fn({size:e,state:t="idle",label:r="Assistant"}){let a={position:"absolute",inset:0,borderRadius:"50%"},n=b=>`${Math.max(1,e*b)}px`,i=A(null),s=A(null),l=A(null),d=A(null),c=A(null),p=A(null),m=gr(e,0);R(()=>{let b=C=>{vr(s.current,_r(C)),vr(l.current,_r(C)),vr(d.current,Cn(C))};if(b(gr(e,0)),Mn()||!i.current)return;let _=0,k=performance.now(),w=C=>{b(gr(e,(C-k)/1e3)),_=requestAnimationFrame(w)},U=()=>{_||(_=requestAnimationFrame(w))},P=()=>{cancelAnimationFrame(_),_=0},O=At(i.current,C=>C?U():P());return U(),()=>{P(),O()}},[e]),R(()=>{if(Mn())return;let b=[c.current?.animate([{transform:"rotate(-20deg) scaleX(1)"},{transform:"rotate(160deg) scaleX(0.55)"},{transform:"rotate(340deg) scaleX(1)"}],{duration:9e3,iterations:1/0,easing:"ease-in-out"}),p.current?.animate([{transform:"rotate(70deg) scaleX(0.7)"},{transform:"rotate(-120deg) scaleX(1.1)"},{transform:"rotate(-290deg) scaleX(0.7)"}],{duration:13e3,iterations:1/0,easing:"ease-in-out"})];return()=>b.forEach(_=>_?.cancel())},[]);let u=(b,_,k,w)=>o("div",{ref:b,"aria-hidden":"true",style:{position:"absolute",inset:"-2%",background:`radial-gradient(ellipse 32% 58% at ${w}, transparent 95%, rgba(255,255,255,${_}) 97.5%, rgba(72,80,196,${k}) 99%, transparent 100%)`,filter:`blur(${n(.006)})`}}),h=_r(m),v=Cn(m);return o("div",{ref:i,class:"ask-ai__orb",style:{position:"relative",width:e,height:e,flex:"0 0 auto"},children:[o("div",{"aria-hidden":"true",style:{position:"absolute",borderRadius:"50%",left:"4%",right:"4%",top:"34%",height:"100%",background:"radial-gradient(closest-side, rgba(122,108,236,0.5), rgba(122,108,236,0.18) 55%, rgba(122,108,236,0))",filter:`blur(${n(.1)})`}}),o(mr,{state:t,size:e,speed:In,colors:Pn,idleMotion:On,meshScale:.55,gloss:!1,label:r}),o("div",{ref:s,"aria-hidden":"true",style:{...a,overflow:"hidden",mixBlendMode:"soft-light",opacity:.8,maskImage:h,WebkitMaskImage:h},children:[u(c,.75,.3,"22% 50%"),u(p,.4,.18,"78% 44%")]}),o("div",{ref:l,"aria-hidden":"true",style:{...a,backdropFilter:`blur(${n(.006)})`,WebkitBackdropFilter:`blur(${n(.006)})`,background:"radial-gradient(circle at 50% 50%, rgba(244,245,255,0.1) 0%, rgba(244,245,255,0.18) 60%, rgba(244,245,255,0.3) 100%)",maskImage:h,WebkitMaskImage:h}}),o("div",{ref:d,"aria-hidden":"true",style:{...a,backdropFilter:`blur(${n(.07)}) saturate(1.1)`,WebkitBackdropFilter:`blur(${n(.07)}) saturate(1.1)`,background:"radial-gradient(circle at 38% 30%, rgba(248,248,255,0.62), rgba(238,239,252,0.5) 60%, rgba(236,237,252,0.58) 100%)",maskImage:v,WebkitMaskImage:v}}),o("div",{"aria-hidden":"true",style:{...a,pointerEvents:"none",background:["radial-gradient(circle at 33% 27%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.45) 9%, rgba(255,255,255,0) 26%)","radial-gradient(ellipse 60% 22% at 50% 94%, rgba(214,236,255,0.45), rgba(214,236,255,0) 100%)","radial-gradient(circle at 40% 34%, rgba(60,52,150,0) 52%, rgba(60,52,150,0.16) 80%, rgba(46,40,130,0.38) 100%)"].join(", ")}}),o("div",{"aria-hidden":"true",style:{...a,pointerEvents:"none",boxShadow:`inset 0 0 ${n(.025)} rgba(255,255,255,0.9), 0 0 0 1px rgba(200,200,240,0.35)`}})]})}function Dn({size:e=18}){return o(mr,{state:"thinking",size:e,speed:In,colors:Pn,idleMotion:On,meshScale:.55,gloss:!1,label:"Thinking"})}function Bn({starters:e,mock:t,supportUrl:r,onPick:a}){return o("div",{class:"ask-ai__welcome",children:[o(Fn,{size:80}),o("h3",{class:"ask-ai__greeting",children:"What do you want to build today?"}),t&&o("p",{class:"ask-ai__welcome-note",children:["A preview, not connected to an assistant. For a real answer, use"," ",o("a",{href:r,target:"_blank",rel:"noopener noreferrer",children:"support"}),"."]}),o("div",{class:"ask-ai__pills",children:e.map((n,i)=>o("button",{type:"button",class:"ask-ai__pill",style:{animationDelay:`${400+i*60}ms`},title:n.prompt===n.label?void 0:n.prompt,onClick:()=>a(n.prompt),children:n.label},n.prompt))})]})}var Uo=[{label:"Create an ABHA",prompt:"How do I create an ABHA with an Aadhaar OTP?"},{label:"Link care contexts",prompt:"How do I link care contexts to an ABHA?"},{label:"Request consent",prompt:"How does an HIU raise a consent request?"},{label:"Decode an error",prompt:"What does ABDM-1016 mean and how do I fix it?"},{label:"Learn about Ask AI",prompt:"What can the Ask AI assistant do?"}];function $n(e){let t=e.split(`
`).map(r=>r.trim()).filter(Boolean);return t.length?t.slice(0,5).map(r=>{let a=r.indexOf("|");if(a<0)return{label:r,prompt:r};let n=r.slice(0,a).trim(),i=r.slice(a+1).trim();return{label:n||i,prompt:i||n}}):Uo}function Et(e){let t=[];for(let r of e){if(r.from==="assistant"&&(r.install||r.local)){t.length&&t[t.length-1].from==="you"&&t.pop();continue}t.push(r)}return t}var Ye=31;function Nn(e){let t=Math.floor(Et(e).length/2),r=(Ye-1)/2,a=Math.min(100,Math.round(t/r*100));return{earlier:t,window:r,percent:a,full:t>=r}}function Hn(e){let t=Et(e);return t.length<=Ye-1?-1:e.indexOf(t[t.length-(Ye-1)])}var zn=`/* ---------- theming ---------- */

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
`;var Wn=()=>`${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`,Fo=".json,.txt,.log,.csv,.xml,.yaml,.yml,.md,.har,.pdf,.png,.jpg,.jpeg,.webp",kr=2e4,Do=256*1024,Bo=8*1024*1024;async function $o(e){let t=await import(`${ae}pdf.min.mjs`);t.GlobalWorkerOptions.workerSrc=`${ae}pdf.worker.min.mjs`;let r=t.getDocument({data:await e.arrayBuffer()}),a=await r.promise,n=[];for(let i=1;i<=a.numPages;i+=1){let s=await(await a.getPage(i)).getTextContent();if(n.push(s.items.map(l=>l.str??"").join(" ").replace(/[ \t]+/g," ").trim()),n.join(`

`).length>kr)break}return await a.cleanup?.(),await r.destroy(),n.join(`

`).trim()}async function No(e,t){t("Loading the reader, once per browser."),await dt(`${ae}tesseract.min.js`);let r=window.Tesseract;t("Reading the text out of that image.");let a=await r.createWorker("eng",1,{workerPath:`${ae}worker.min.js`,corePath:ae,langPath:`${ae}lang`,cacheMethod:"none"});try{let{data:n}=await a.recognize(e);return(n.text??"").replace(/[ \t]+/g," ").trim()}finally{await a.terminate()}}var Vn=24e3,Gn=`

[This page was cut here to fit. Say so if the answer needs the rest of it.]`;function Ho(e){return e.length<=Vn?e:e.slice(0,Vn-Gn.length)+Gn}var zo="This panel is a mock. No assistant is connected here yet, so nothing in it can answer that. The support page lists the channels a human reads.";function jn(e,t){e(r=>{let a=r[r.length-1];return[...r.slice(0,-1),{...a,text:a.text+t}]})}function Wo(e){if(e.some(t=>t.install))return-1;for(let t=e.length-1;t>0;t-=1){let r=e[t];if(r.from!=="assistant"||r.text==="")continue;let a=e[t-1];return a?.from==="you"&&Sa(a.text)?t:-1}return-1}function Vo(e,t,r,a){e(n=>{let i=n[n.length-1];return[...n.slice(0,-1),{...i,sources:t,links:r??i.links,suggestions:a??i.suggestions}]})}var br=320,Xn=960,yr="abdm-ask-ai-width",xr=!1;function Go({dialog:e}){let[t,r]=E(!1);return R(()=>{let n=Number(localStorage.getItem(yr));n>=br&&e.current&&e.current.style.setProperty("--aa-panel-width",`${n}px`)},[]),o("div",{class:`ask-ai__grip${t?" ask-ai__grip--dragging":""}`,role:"separator","aria-orientation":"vertical","aria-label":"Resize the panel",tabIndex:0,onPointerDown:n=>{let i=e.current;if(!i)return;n.preventDefault(),xr=!0,r(!0),n.target.setPointerCapture(n.pointerId);let s=d=>{let c=window.innerWidth-d.clientX,p=Math.min(Math.max(c,br),Math.min(Xn,window.innerWidth));i.style.setProperty("--aa-panel-width",`${Math.round(p)}px`)},l=()=>{setTimeout(()=>{xr=!1},0),r(!1),window.removeEventListener("pointermove",s),window.removeEventListener("pointerup",l),window.removeEventListener("pointercancel",l);let d=i.style.getPropertyValue("--aa-panel-width");d&&localStorage.setItem(yr,String(parseInt(d,10)))};window.addEventListener("pointermove",s),window.addEventListener("pointerup",l),window.addEventListener("pointercancel",l)},onKeyDown:n=>{let i=n.key==="ArrowLeft"?32:n.key==="ArrowRight"?-32:0;if(!i||!e.current)return;n.preventDefault();let s=e.current.getBoundingClientRect().width,l=Math.min(Math.max(s+i,br),Xn);e.current.style.setProperty("--aa-panel-width",`${l}px`),localStorage.setItem(yr,String(l))},children:o("span",{class:"ask-ai__grip-bar","aria-hidden":"true"})})}function jo({apiBase:e,docsOrigin:t,mcpUrl:r,pluginRepo:a,open:n,onClose:i,page:s,onDetach:l,onAttach:d,question:c,send:p,starters:m,keepHistory:u,gateway:h,supportUrl:v}){let[b,_]=E([]),k=s?ma(s.markdown).slice(0,4):[],w=k.length?k.map(f=>({label:f,prompt:f})):m,[U,P]=E(""),[O,C]=E(null),[N,I]=E(null),[K,g]=E(null),[T,X]=E("idle"),[Ke,ce]=E(null),[$,M]=E(""),[V,J]=E(!1),[Je,ue]=E([]),[ve,de]=E("chat"),[fe,Qe]=E(null),[Ie,G]=E("closed"),[ee,ne]=E(null),te=A(Wn()),be=A(null),ye=A(null),pe=A(null),ie=A(null),Rt=A(null),ke=A(null),he=T!=="idle",qn=s!==null&&s.markdown!=="",Yn=Nn(b),Kn=Hn(b),Sr=b[b.length-1],Jn=!he&&Sr?.from==="assistant"?Sr.suggestions??[]:[],Q=A(""),xe=A(!1),we=A(!0),Ar=A(0),Tr=A(!1),Z=A(0),Oe=A(null),Ue=A(null),Le=A(null),Er=()=>{Z.current=requestAnimationFrame(Er);let f=Q.current.length;if(f===0){if(!we.current)return;cancelAnimationFrame(Z.current),Z.current=0,xe.current=!1,(Oe.current||Ue.current||Le.current)&&(Vo(_,Oe.current??[],Ue.current??void 0,Le.current??void 0),Oe.current=null,Ue.current=null,Le.current=null),X("idle");return}let x=Aa(f,performance.now()-Ar.current,xe.current,Tr.current);x!==0&&(xe.current||(xe.current=!0,X("streaming")),jn(_,Q.current.slice(0,x)),Q.current=Q.current.slice(x))},Fe=f=>{Q.current+=f},Qn=f=>{Oe.current=f},Zn=f=>{Ue.current=f},ei=f=>{Le.current=f},Rr=()=>{Z.current&&cancelAnimationFrame(Z.current),Z.current=0,xe.current=!1,Q.current="",Oe.current=null,Ue.current=null,Le.current=null,we.current=!0};R(()=>{if(!(!n||!c)){if(!p){P(f=>f||c);return}be.current!==c&&(be.current=c,Ze(c))}},[n,c,p]),R(()=>{let f=ye.current;f&&(n&&!f.open&&(f.showModal(),ie.current?.focus()),!n&&f.open&&f.close())},[n]),R(()=>{if(!n)return;let f=x=>{x.key==="Escape"&&(x.preventDefault(),x.stopPropagation(),Ie!=="closed"?G("closed"):i())};return document.addEventListener("keydown",f,!0),()=>document.removeEventListener("keydown",f,!0)},[n,i,Ie]);let Se=A(!0),[ti,ri]=E(!1),ai=()=>{let f=pe.current;f&&(Se.current=f.scrollHeight-f.scrollTop-f.clientHeight<40,ri(!Se.current))},ni=()=>{let f=pe.current;f&&(Se.current=!0,f.scrollTo({top:f.scrollHeight,behavior:"smooth"}))};R(()=>{let f=pe.current;f&&Se.current&&(f.scrollTop=f.scrollHeight)},[b,T,Ke]),R(()=>{let f=ie.current;if(!f)return;f.style.height="auto";let x=Math.min(f.scrollHeight,160);f.style.height=`${x}px`,f.style.overflowY=f.scrollHeight>x?"auto":"hidden"},[U]),R(()=>()=>{ke.current?.abort(),Z.current&&cancelAnimationFrame(Z.current)},[]);let Mt=f=>{u&&f.some(x=>x.from==="you")&&(ue(x=>{let y=Ea(x,{id:te.current,at:Date.now(),title:Ta(f),turns:f.map(H=>H.file?{...H,file:{...H.file,text:""}}:H)});return Yt(y),y}),Ia(te.current))};R(()=>{T==="idle"&&Mt(b)},[T,b]),R(()=>{if(!u)return;let f=Ra();ue(f);let x=Ua(f,Pa());x&&(te.current=x.id,_(y=>y.length?y:x.turns))},[u]);let ii=f=>{Mt(b),ke.current?.abort(),Rr(),Se.current=!0,te.current=f.id,_(f.turns),de("chat"),P(""),C(null),I(null),g(null),ce(null),X("idle")},oi=()=>{Mt(b),te.current=Wn(),Oa(),de("chat"),G("closed"),ke.current?.abort(),Rr(),Se.current=!0,_([]),P(""),C(null),I(null),g(null),ce(null),X("idle")},si=async f=>{if(!f)return;I(null);let x=f.name.toLowerCase(),y=f.type==="application/pdf"||x.endsWith(".pdf"),H=f.type.startsWith("image/"),Ct=y||H?Bo:Do;if(f.size>Ct){I("That file is too large. Attach the failing part of it.");return}let j;try{if(y){if(g("Reading the text in that PDF."),j=await $o(f),!j){g(null),I("That PDF has no text in it, only pictures of text. Attach a screenshot of the part you mean and it will be read.");return}}else H?j=await No(f,g):j=await f.text()}catch{g(null),I("That file could not be read.");return}finally{g(null)}if(!y&&!H&&j.includes("\uFFFD")){I("That looks like a binary file. Text and JSON only.");return}if(j.length>kr){I(`That file is ${j.length.toLocaleString()} characters. Attach at most ${kr.toLocaleString()}.`);return}if(!j.trim()){I(H?"No text could be read out of that image.":"That file is empty.");return}C({name:f.name,text:j,kind:y?"pdf":H?"image":void 0}),ie.current?.focus()},li=()=>{ke.current?.abort(),Q.current&&jn(_,Q.current),Q.current="",we.current=!0},De=(f,x)=>{M(""),J(!1),_(y=>[...y,...x?[{from:"you",text:x}]:[],{from:"assistant",text:wa(f,{docsOrigin:t,mcpUrl:r,pluginRepo:a}),install:f}])},Ze=async(f,x={})=>{if(!f||he)return;let y=x.file!==void 0?x.file:O,H=x.base??b;if(P(""),C(null),I(null),G("closed"),de("chat"),!y&&!fe&&Fa(f)){_([...H,{from:"you",text:f},{from:"assistant",text:La,local:!0}]);return}let Ct=Et([...H,{from:"you",text:f,file:y??void 0}]);if(_(q=>[...x.base??q,{from:"you",text:f,file:y??void 0},{from:"assistant",text:""}]),Q.current="",xe.current=!1,we.current=!1,Ar.current=performance.now(),Tr.current=window.matchMedia("(prefers-reduced-motion: reduce)").matches,X("thinking"),ce("Thinking"),Z.current||(Z.current=requestAnimationFrame(Er)),!e){Fe(zo),we.current=!0;return}let j=new AbortController;ke.current=j;try{let q=await fetch(`${e.replace(/\/$/,"")}/api/chat`,{method:"POST",signal:j.signal,headers:{"Content-Type":"application/json"},body:JSON.stringify({turns:Ct.slice(-Ye).map(L=>({role:L.from==="you"?"user":"assistant",text:L.text,...L.file?{attachment:{name:L.file.name,text:L.file.text,...L.file.kind?{kind:L.file.kind}:{}}}:{}})),...qn?{page:{title:s.title,url:s.url,markdown:Ho(s.markdown)}}:{},...fe?{command:fe}:{},...x.module?{module:x.module}:{},...h?{gateway:h}:{}})});if(!q.ok){let L=await q.json().catch(()=>null);Fe(ga(q.status,L));return}if(!q.body)throw new Error(`status ${q.status}`);await _a(q.body,{onText:Fe,onTool:L=>ce(L),onSources:L=>Qn(L),onLinks:L=>Zn(L),onSuggestions:L=>ei(L),onError:Fe,onSkill:L=>_(Pt=>{let Mr=Pt[Pt.length-1],mi=L.status==="unresolved"?{...Mr,text:yt(L),skill:L,local:!0}:{...Mr,skill:L};return[...Pt.slice(0,-1),mi]})})}catch(q){q instanceof DOMException&&q.name==="AbortError"||Fe(ht)}finally{ke.current=null,we.current=!0,ce(null)}},ci=f=>{let x=b.length-2,y=b[x];!y||y.from!=="you"||Ze(y.text,{module:f,base:b.slice(0,x),file:y.file??null})},ui=async f=>{ne(f.title);let x=await fetch(Na(t,f.path)).then(y=>y.ok?y.text():"").catch(()=>"");ne(null),d({title:f.title,url:$a(t,f.path),markdown:x}),ie.current?.focus()},di=f=>ue(x=>{let y=Ma(x,f);return Yt(y),y}),fi=()=>{Ca(),ue([])},pi=T==="thinking",hi=Wo(b);return o("dialog",{class:"ask-ai",ref:ye,"aria-label":"Ask AI",onClose:i,onCancel:i,onClick:f=>{f.target===ye.current&&!xr&&i()},children:[o(Go,{dialog:ye}),o("div",{class:"ask-ai__head",children:[o("div",{class:"ask-ai__tabs",role:"group","aria-label":"Conversations",children:[o("button",{type:"button",class:"ask-ai__tab","aria-pressed":ve==="chat","aria-label":"New conversation",title:"Start a new conversation",onClick:oi,children:[o(ut,{}),"New"]}),o("button",{type:"button",class:"ask-ai__tab","aria-pressed":ve==="history",onClick:()=>{G("closed"),de("history")},children:"History"})]}),!e&&o("span",{class:"ask-ai__badge",children:"Mock"}),o("span",{class:"ask-ai__grow"}),o("button",{type:"button",class:"ask-ai__close",onClick:i,"aria-label":"Close",children:o(Ee,{})})]}),ve==="history"?o(ja,{sessions:Je,currentId:te.current,onOpen:ii,onForget:di,onClearAll:fi}):o(B,{children:[o("div",{class:"ask-ai__thread",ref:pe,role:"log","aria-live":"polite","aria-busy":he,onScroll:ai,children:[b.length===0&&o(Bn,{starters:w,mock:!e,supportUrl:v,onPick:f=>{Ze(f)}}),b.map((f,x)=>o(B,{children:[x===Kn&&o("p",{class:"ask-ai__cut",role:"separator",children:o("span",{children:"Earlier turns are no longer sent"})}),f.from==="assistant"&&f.text===""?null:o("div",{class:`ask-ai__turn ask-ai__turn--${f.from}${T==="streaming"&&x===b.length-1?" ask-ai__turn--streaming":""}`,children:[f.skill&&f.skill.status!=="unresolved"&&o("p",{class:`ask-ai__skill ask-ai__skill--${f.skill.status}`,children:f.skill.status==="used"&&f.skill.href?o("a",{href:Ve(f.skill.href,t)??f.skill.href,target:"_blank",rel:"noopener noreferrer",children:yt(f.skill)}):yt(f.skill)}),f.from==="assistant"?o(Vt,{text:f.text,docsOrigin:t,links:f.links}):f.text,f.file&&o("span",{class:"ask-ai__turn-file",children:[o(We,{}),f.file.name]}),f.from==="assistant"&&x>0&&f.text!==""&&!(he&&x===b.length-1)&&o(pt,{text:f.text,label:"Copy answer",className:"ask-ai__turn-copy"}),f.sources&&f.sources.length>0&&o("details",{class:"ask-ai__sources",children:[o("summary",{class:"ask-ai__sources-toggle",children:[o(sa,{}),"Used ",f.sources.length," ",f.sources.length===1?"source":"sources"]}),o("ul",{class:"ask-ai__source-list",children:f.sources.map(y=>o("li",{children:o("a",{href:Ve(y.url,t)??y.url,target:"_blank",rel:"noopener noreferrer",class:"ask-ai__source-link",children:[o(Re,{}),o("span",{class:"ask-ai__source-title",children:[y.title,y.status!=="verified"?" (spec)":""]})]})},y.id))})]}),f.install&&x===b.length-1&&o("div",{class:"ask-ai__choices",children:[f.install.at==="tools"&&Gt.map(y=>o("button",{type:"button",class:"ask-ai__choice",onClick:()=>De(va(y.id)?{at:"agents",tool:y.id}:{at:"answer",tool:y.id,agent:"claude"},y.label),children:y.label},y.id)),f.install.at==="agents"&&!V&&jt.map(y=>o("button",{type:"button",class:"ask-ai__choice",onClick:()=>{if(y.id==="other"){J(!0);return}De({at:"answer",tool:f.install.tool,agent:y.id},y.label)},children:y.label},y.id)),f.install.at==="agents"&&V&&o("form",{class:"ask-ai__naming",onSubmit:y=>{y.preventDefault();let H=$.trim();H&&De({at:"answer",tool:f.install.tool,agent:"other",named:H},H)},children:[o("input",{class:"ask-ai__naming-field",value:$,autoFocus:!0,placeholder:"Which agent?","aria-label":"The name of your agent",onInput:y=>M(y.target.value)}),o("button",{type:"submit",class:"ask-ai__choice",disabled:$.trim()==="",children:o(ct,{})})]})]}),f.install?.at==="answer"&&(()=>{let{link:y}=qt(f.install,{docsOrigin:t,mcpUrl:r,pluginRepo:a});return y?o("a",{class:"ask-ai__install-cta",href:y.href,target:"_blank",rel:"noopener noreferrer",children:[o(se,{}),y.label]}):null})(),f.skill?.status==="unresolved"&&x===b.length-1&&o("div",{class:"ask-ai__choices",children:(f.skill.candidates??[]).map(y=>o("button",{type:"button",class:"ask-ai__choice",onClick:()=>ci(y),children:_t(y)},y))}),f.skill?.status==="used"&&f.skill.section==="scaffold"&&!(he&&x===b.length-1)&&o("button",{type:"button",class:"ask-ai__install-cta",onClick:()=>De({at:"tools"},"Install AI tools"),children:[o(se,{}),"Build it with your coding agent"]}),x===hi&&f.skill?.section!=="scaffold"&&!(he&&x===b.length-1)&&o("button",{type:"button",class:"ask-ai__install-cta",onClick:()=>De({at:"tools"},"Install AI tools"),children:[o(se,{}),"Install AI tools"]})]})]},x)),pi&&o("p",{class:"ask-ai__activity",children:[o(Dn,{}),Ke??"Thinking"]})]}),ti&&o("div",{class:"ask-ai__to-end-wrap",children:o("button",{type:"button",class:"ask-ai__to-end","aria-label":"Scroll to the latest",onClick:ni,children:o(oa,{})})}),o(Ga,{draft:U,onDraft:P,field:ie,busy:he,onSend:()=>{Ze(U.trim())},onStop:li,menu:Ie,onMenu:G,accept:Fo,onFile:f=>{si(f)},file:O,fileNote:K,fileError:N,onRemoveFile:()=>C(null),docsOrigin:t,page:s,attaching:ee,onPage:f=>{ui(f)},onRemovePage:l,command:fe,onCommand:Qe,memory:Yn,suggestions:Jn})]})]})}function Xo({host:e,apiBase:t,docsOrigin:r,mcpUrl:a,pluginRepo:n,supportUrl:i,launcher:s,shortcut:l,open:d,page:c,onDetach:p,onAttach:m,question:u,send:h,starters:v,keepHistory:b,gateway:_}){return o(B,{children:[s&&o("button",{type:"button",class:"ask-ai__launcher","aria-label":"Ask AI",onClick:()=>{e.removeAttribute("open"),e.setAttribute("open","")},children:[o(se,{}),o("span",{class:"ask-ai__launcher-label",children:"Ask AI"}),l&&o("kbd",{class:"ask-ai__launcher-key",children:l})]}),o(jo,{apiBase:t,docsOrigin:r,mcpUrl:a,pluginRepo:n,supportUrl:i,open:d,question:u,send:h,starters:v,keepHistory:b,gateway:_,onClose:()=>{e.removeAttribute("open"),e.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))},page:c,onDetach:p,onAttach:m})]})}function qo(){for(let e=document.body;e;e=e.parentElement){let t=/^rgba?\(([^)]+)\)/.exec(getComputedStyle(e).backgroundColor);if(!t)continue;let[r,a,n,i=1]=t[1].split(",").map(Number);if(i)return .2126*r+.7152*a+.0722*n<128?"dark":"light"}return window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}var wr=class extends HTMLElement{static observedAttributes=["api-base","docs-origin","mcp-url","plugin-repo","support-url","launcher","shortcut","open","question","send","starters","history","ground","gateway"];root=null;page=null;connectedCallback(){if(!this.root){this.root=this.attachShadow({mode:"open"});let t=document.createElement("style");t.textContent=zn,this.root.append(t),this.hasAttribute("ground")||this.setAttribute("ground",qo())}this.paint()}attributeChangedCallback(){this.root&&this.paint()}show(){this.setAttribute("open","")}hide(){this.removeAttribute("open")}attachPage(t){this.page=t&&Ha(t.markdown)?{...t,markdown:""}:t,this.root&&this.paint()}paint(){let t=this.getAttribute("docs-origin")??window.location.origin;$t(o(Xo,{host:this,apiBase:this.getAttribute("api-base")??"",docsOrigin:t,mcpUrl:this.getAttribute("mcp-url"),pluginRepo:this.getAttribute("plugin-repo")??"nha-in/docs",supportUrl:this.getAttribute("support-url")??`${t.replace(/\/$/,"")}/docs/support`,launcher:this.getAttribute("launcher")!=="none",shortcut:this.getAttribute("shortcut")??"",open:this.hasAttribute("open"),page:this.page,onDetach:()=>this.attachPage(null),onAttach:r=>this.attachPage(r),question:this.getAttribute("question")??"",send:this.hasAttribute("send"),starters:$n(this.getAttribute("starters")??""),keepHistory:this.getAttribute("history")!=="off",gateway:this.getAttribute("gateway")??""}),this.root)}};typeof customElements<"u"&&!customElements.get("abdm-support-agent")&&customElements.define("abdm-support-agent",wr);})();
