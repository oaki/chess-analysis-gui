(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{301:function(e,t,n){"use strict";n.d(t,"a",(function(){return i}));var a=n(9),r=n.n(a),l=n(0),c=n(14),i=l.forwardRef((function(e,t){return l.createElement(c.a,r()({iconAttrs:{fill:"currentColor",xmlns:"http://www.w3.org/2000/svg"},iconVerticalAlign:"middle",iconViewBox:"0 0 24 24"},e,{ref:t}),l.createElement("path",{fill:"none",d:"M0 0h24v24H0z"}),l.createElement("path",{d:"M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"}))}));i.displayName="Delete"},324:function(e,t,n){"use strict";n.r(t),n.d(t,"EnginesPage",(function(){return b}));var a=n(0),r=n.n(a),l=n(27),c=n(1),i=n(2),o=n(301),u=n(9),s=n.n(u),m=n(14),d=a.forwardRef((function(e,t){return a.createElement(m.a,s()({iconAttrs:{fill:"currentColor",xmlns:"http://www.w3.org/2000/svg"},iconVerticalAlign:"middle",iconViewBox:"0 0 24 24"},e,{ref:t}),a.createElement("path",{fill:"none",d:"M0 0h24v24H0z"}),a.createElement("path",{d:"M17 4h3v16h-3zM5 14h3v6H5zm6-5h3v11h-3z"}))}));d.displayName="SignalCellularAlt";var h=a.forwardRef((function(e,t){return a.createElement(m.a,s()({iconAttrs:{fill:"currentColor",xmlns:"http://www.w3.org/2000/svg"},iconVerticalAlign:"middle",iconViewBox:"0 0 24 24"},e,{ref:t}),a.createElement("path",{fill:"none",d:"M0 0h24v24H0zm0 0h24v24H0z"}),a.createElement("path",{d:"M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5.3-2.1-5.3-5.1H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c.91-.13 1.77-.45 2.54-.9L19.73 21 21 19.73 4.27 3z"}))}));h.displayName="MicOff";var p=a.forwardRef((function(e,t){return a.createElement(m.a,s()({iconAttrs:{fill:"currentColor",xmlns:"http://www.w3.org/2000/svg"},iconVerticalAlign:"middle",iconViewBox:"0 0 24 24"},e,{ref:t}),a.createElement("path",{fill:"none",d:"M0 0h24v24H0z"}),a.createElement("path",{d:"M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"}))}));p.displayName="Add";var f,E=n(82),w=n(83),v=(f=function(e,t){return(f=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n])})(e,t)},function(e,t){function n(){this.constructor=e}f(e,t),e.prototype=null===t?Object.create(t):(n.prototype=t.prototype,new n)}),b=function(e){function t(t){var n=e.call(this,t)||this;return n.renderButton=function(e,t){return r.a.createElement("button",{className:"btn btn-danger f-r","data-id":t.id,onClick:n.handleDelete},r.a.createElement(o.a,null))},n.handleSubmit=function(e){c.a.dispatch(Object(i.q)({name:n.state.name,uuid:n.state.uuid})),n.setState({name:"",uuid:""})},n.handleDelete=function(e){c.a.dispatch(Object(i.r)({id:e.currentTarget.dataset.id}))},n.handleNewName=function(e){n.setState({name:e.currentTarget.value})},n.handleNewUuid=function(e){n.setState({uuid:e.currentTarget.value})},n.state={name:"",uuid:""},n}return v(t,e),t.prototype.renderRows=function(){var e=this;return this.props.workers.map((function(t,n){return r.a.createElement("li",{key:n,className:"d-b p-t-md p-b-md list__bottom-line"},e.renderButton(n,t),r.a.createElement("div",{className:"f-l"},t.ready&&r.a.createElement("span",{className:"c-green"},r.a.createElement(d,null)),!t.ready&&r.a.createElement("span",null,r.a.createElement(h,null))),r.a.createElement("div",{className:"p-l-xxl"},r.a.createElement("div",{className:"fs-5"},t.name),r.a.createElement("div",{className:"fs-xs"},t.uuid)))}))},t.prototype.render=function(){return r.a.createElement("div",{className:"container"},r.a.createElement("div",{className:"row"},r.a.createElement("div",{className:"col-md-12"},r.a.createElement(w.a,{title:"Your chess engines"}),r.a.createElement("table",{className:"table fs-xs"},r.a.createElement("thead",null,r.a.createElement("tr",null,r.a.createElement("th",{colSpan:2},"Name"),r.a.createElement("th",null,"Uuid"),r.a.createElement("th",null))),r.a.createElement("tbody",null,r.a.createElement("tr",null,r.a.createElement("td",{colSpan:2},r.a.createElement("input",{onChange:this.handleNewName,type:"text",value:this.state.name})),r.a.createElement("td",null,r.a.createElement("input",{onChange:this.handleNewUuid,type:"text",value:this.state.uuid})),r.a.createElement("td",null,r.a.createElement("button",{className:"btn btn-success",onClick:this.handleSubmit},r.a.createElement(p,null)))))),r.a.createElement("ul",null,this.renderRows())),r.a.createElement(E.a,{showMainMenu:!0})))},t.prototype.componentDidMount=function(){c.a.dispatch(Object(i.t)())},t}(r.a.Component),g=Object(l.b)((function(e){return{workers:e.workers}}))(b);t.default=g}}]);