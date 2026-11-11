(function(){
// Telugu strings are drafts: TODO_REVIEW by a native Telugu speaker before publishing.
var T={en:{home:"Home",about:"About",faq:"FAQ",services:"Services",sponsored:"Sponsored",cta:"Get a free quote",lang:"తెలుగు",
privacy:"Privacy Policy",terms:"Terms",contact:"Contact: details coming soon",grievance:"Grievance and data-request contact: to be named before launch",
rights:"Residential and small commercial installations only."},
te:{home:"హోమ్",about:"మా గురించి",faq:"తరచుగా అడిగే ప్రశ్నలు",services:"సేవలు",sponsored:"స్పాన్సర్డ్",cta:"ఉచిత కోట్ పొందండి",lang:"English",
privacy:"గోప్యతా విధానం",terms:"నిబంధనలు",contact:"సంప్రదింపు వివరాలు త్వరలో",grievance:"ఫిర్యాదు మరియు డేటా అభ్యర్థన సంప్రదింపు: ప్రారంభానికి ముందు ప్రకటిస్తాం",
rights:"గృహ మరియు చిన్న వాణిజ్య ఇన్‌స్టాలేషన్లు మాత్రమే."}};
var lang="en";try{lang=localStorage.getItem("lang")||"en"}catch(e){}
if(!T[lang])lang="en";
function el(t,a,c){var e=document.createElement(t);for(var k in a||{})e.setAttribute(k,a[k]);if(c)e.textContent=c;return e}
function build(){
 var page=document.body.getAttribute("data-page");
 var h=document.querySelector("header.site");h.textContent="";
 var w=el("div",{"class":"wrap"});
 var b=el("a",{"class":"brand",href:"index.html"});
 b.appendChild(el("img",{src:"assets/logo.png",alt:"",width:40,height:40}));b.appendChild(document.createTextNode("Tengo Solar"));
 var n=el("nav",{"class":"main","aria-label":"Main"});
 [["home","index.html"],["about","about.html"],["services","services.html"],["faq","faq.html"],["sponsored","sponsored.html"]].forEach(function(p){
  var a=el("a",{href:p[1]},T[lang][p[0]]);if(p[0]===page)a.setAttribute("aria-current","page");n.appendChild(a)});
 var l=el("button",{"class":"lang",type:"button","aria-label":"Language"},T[lang].lang);
 l.onclick=function(){lang=lang==="en"?"te":"en";try{localStorage.setItem("lang",lang)}catch(e){}build();translate()};
 w.appendChild(b);w.appendChild(n);w.appendChild(l);h.appendChild(w);
 var f=document.querySelector("footer.site");f.textContent="";
 var fw=el("div",{"class":"wrap"});
 fw.appendChild(el("p",{},T[lang].contact));fw.appendChild(el("p",{},T[lang].grievance));
 var p2=el("p");p2.appendChild(el("a",{href:"privacy.html"},T[lang].privacy));p2.appendChild(document.createTextNode(" | "));p2.appendChild(el("a",{href:"terms.html"},T[lang].terms));
 fw.appendChild(p2);fw.appendChild(el("p",{"class":"note",style:"color:#9fb0dc"},T[lang].rights));f.appendChild(fw);
 document.documentElement.lang=lang;
}
function translate(){document.querySelectorAll("[data-t]").forEach(function(e){var k=e.getAttribute("data-t");if(T[lang][k])e.textContent=T[lang][k]})}
build();translate();
// Services page: render packages from config (textContent only, no innerHTML)
var box=document.getElementById("packages");
if(box){fetch("config/packages.json").then(function(r){return r.json()}).then(function(d){
 var inr=new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0});
 d.packages.forEach(function(p){
  var c=el("div",{"class":"card"});c.appendChild(el("h3",{},p.kw+" kW"));
  c.appendChild(el("div",{"class":"price"},p.price_from?"From "+inr.format(p.price_from):"Price to be confirmed"));
  c.appendChild(el("p",{"class":"note"},p.equipment));box.appendChild(c)});
 box.appendChild(el("p",{"class":"note"},"Placeholder prices. Final package prices will be confirmed before launch."));
}).catch(function(){box.textContent="Packages are unavailable right now."})}
})();
