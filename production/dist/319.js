"use strict";(self.webpackChunksleact_ts_front=self.webpackChunksleact_ts_front||[]).push([[319],{56319:(e,t,n)=>{n.r(t),n.d(t,{default:()=>p});var a=n(67294),l=n(1409),r=n(38678),c=n(9669),u=n.n(c),o=n(73727),i=n(95591),s=n(83564),m=n(16550);function d(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=n){var a,l,r,c,u=[],o=!0,i=!1;try{if(r=(n=n.call(e)).next,0===t){if(Object(n)!==n)return;o=!1}else for(;!(o=(a=r.call(n)).done)&&(u.push(a.value),u.length!==t);o=!0);}catch(e){i=!0,l=e}finally{try{if(!o&&null!=n.return&&(c=n.return(),Object(c)!==c))return}finally{if(i)throw l}}return u}}(e,t)||function(e,t){if(e){if("string"==typeof e)return f(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?f(e,t):void 0}}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function f(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,a=new Array(t);n<t;n++)a[n]=e[n];return a}const p=function(){var e=d((0,r.Z)(""),3),t=e[0],n=e[1],c=(e[2],d((0,r.Z)(""),3)),f=c[0],p=c[1],E=(c[2],d((0,a.useState)(""),2)),h=E[0],v=E[1],b=d((0,a.useState)(""),2),y=b[0],g=b[1],k=d((0,a.useState)(!1),2),w=k[0],_=k[1],S=d((0,a.useState)(!1),2),j=S[0],I=S[1],C=d((0,a.useState)(""),2),A=C[0],O=C[1],Z=d((0,a.useState)(!1),2),x=Z[0],M=Z[1],U=(0,i.ZP)("".concat("http://localhost:3095","/api/users"),s.Z,{revalidateOnMount:!0}),z=U.data,B=U.isLoading,D=(U.error,U.mutate,(0,a.useCallback)((function(e){v(e.target.value),_(!!y&&e.target.value!==y)}),[y])),J=(0,a.useCallback)((function(e){g(e.target.value),_(!!h&&e.target.value!==h)}),[h]),L=(0,a.useCallback)((function(e){if(e.preventDefault(),!f)return I(!0);I(!1),!w&&f&&(O(""),M(!1),u().post("".concat("http://localhost:3095","/api/users"),{email:t,nickname:f,password:h}).then((function(e){M(!0)})).catch((function(e){O(e.response.data)})).finally((function(){})))}),[t,f,h,y,w]);return B?a.createElement("div",null,"로딩 중..."):z?a.createElement(m.l_,{to:"/workspace/channel"}):a.createElement("div",{id:"container"},a.createElement(l.h4,null,a.createElement("img",{src:"https://a.slack-edge.com/cebaa/img/ico/favicon.ico",alt:"slack_favicon"}),"Sleact"),a.createElement(l.l0,{onSubmit:L},a.createElement(l.__,{id:"email-label"},a.createElement("span",null,"이메일 주소"),a.createElement("div",null,a.createElement(l.II,{type:"email",id:"email",name:"email",value:t,onChange:n}))),a.createElement(l.__,{id:"nickname-label"},a.createElement("span",null,"닉네임"),a.createElement("div",null,a.createElement(l.II,{type:"text",id:"nickname",name:"nickname",value:f,onChange:p}))),a.createElement(l.__,{id:"password-label"},a.createElement("span",null,"비밀번호"),a.createElement("div",null,a.createElement(l.II,{type:"password",id:"password",name:"password",value:h,onChange:D}))),a.createElement(l.__,{id:"password-check-label"},a.createElement("span",null,"비밀번호 확인"),a.createElement("div",null,a.createElement(l.II,{type:"password",id:"password-check",name:"password-check",value:y,onChange:J})),w&&a.createElement(l.jj,null,"비밀번호가 일치하지 않습니다."),j&&a.createElement(l.jj,null,"닉네임을 입력해주세요."),A&&a.createElement(l.jj,null,A),x&&a.createElement(l.fB,null,"회원가입 되었습니다! 로그인해주세요.")),a.createElement(l.zx,{type:"submit"},"회원가입")),a.createElement(l.Ji,null,"이미 회원이신가요? ",a.createElement(o.rU,{to:"/login"},"로그인 하러가기")))}}}]);