(()=>{"use strict";var e,r={665:(e,r,s)=>{s(260);class a extends Phaser.Scene{constructor(){super({key:"PreloadScene"})}preload(){this.load.image("rocket","assets/img/rocket.png"),console.log("Pre load successful")}create(){this.scene.start("MainScene")}}class t extends Phaser.Physics.Arcade.Sprite{constructor(e,r,s){super(e,r,s,"rocket"),e.add.existing(this)}}class n extends Phaser.Scene{constructor(){super({key:"MainScene"})}create(){new t(this,this.cameras.main.width/2,this.cameras.main.height/2)}}var o={type:Phaser.AUTO,backgroundColor:"#FFFFF0",scale:{parent:"phaser-game",mode:Phaser.Scale.CENTER_BOTH,width:1280,height:720},scene:[a,n]};window.addEventListener("load",(()=>{new Phaser.Game(o)}))}},s={};function a(e){var t=s[e];if(void 0!==t)return t.exports;var n=s[e]={exports:{}};return r[e].call(n.exports,n,n.exports,a),n.exports}a.m=r,e=[],a.O=(r,s,t,n)=>{if(!s){var o=1/0;for(l=0;l<e.length;l++){for(var[s,t,n]=e[l],c=!0,i=0;i<s.length;i++)(!1&n||o>=n)&&Object.keys(a.O).every((e=>a.O[e](s[i])))?s.splice(i--,1):(c=!1,n<o&&(o=n));if(c){e.splice(l--,1);var h=t();void 0!==h&&(r=h)}}return r}n=n||0;for(var l=e.length;l>0&&e[l-1][2]>n;l--)e[l]=e[l-1];e[l]=[s,t,n]},a.o=(e,r)=>Object.prototype.hasOwnProperty.call(e,r),(()=>{var e={179:0};a.O.j=r=>0===e[r];var r=(r,s)=>{var t,n,[o,c,i]=s,h=0;if(o.some((r=>0!==e[r]))){for(t in c)a.o(c,t)&&(a.m[t]=c[t]);if(i)var l=i(a)}for(r&&r(s);h<o.length;h++)n=o[h],a.o(e,n)&&e[n]&&e[n][0](),e[n]=0;return a.O(l)},s=self.webpackChunkphaser_project_template=self.webpackChunkphaser_project_template||[];s.forEach(r.bind(null,0)),s.push=r.bind(null,s.push.bind(s))})();var t=a.O(void 0,[216],(()=>a(665)));t=a.O(t)})();