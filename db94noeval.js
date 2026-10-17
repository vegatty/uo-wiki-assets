(function(){
function init(){
var d=document,get=function(id){return d.getElementById(id);};
if(!get('q')||!get('body'))return;
var keys=['stats.hp','stats.stam','stats.mana','stats.str','stats.dex','stats.int','resists.physical','resists.fire','resists.cold','resists.poison','resists.energy','damage.base','attack.physical','attack.fire','attack.cold','attack.poison','attack.energy','skills.wrestling','skills.tactics','skills.resisting_spells','skills.anatomy','skills.poisoning','skills.magery','skills.meditation'];
var names={'stats.hp':'HP','stats.stam':'スタミナ','stats.mana':'マナ','stats.str':'STR','stats.dex':'DEX','stats.int':'INT','resists.physical':'物理抵抗','resists.fire':'炎抵抗','resists.cold':'冷気抵抗','resists.poison':'毒抵抗','resists.energy':'エネルギー抵抗','damage.base':'攻撃力'};
function label(k){return names[k]||k;}
var rows=[];for(var i=1;i<=94;i++){var p={};for(var j=0;j<keys.length;j++){var b=j<6?40+(i*17+j*13)%770:5+(i*7+j*3)%86;p[keys[j]]=(i+j)%19===0?'???':(i+j)%23===0?'-':[b,b+(i+j)%8];}rows.push({name:'テスト生物'+('000'+i).slice(-3),properties:p});}
function addOpt(sel,k){var o=d.createElement('option');o.value=k;o.textContent=label(k);sel.appendChild(o);}
for(var z=0;z<keys.length;z++){addOpt(get('filterKey'),keys[z]);addOpt(get('filterKey2'),keys[z]);}
get('filterKey').value='stats.hp';
var page=0,sort='name',asc=true;
function n(r,k,p){var v=r.properties[k];return v instanceof Array?v[p]:null;}
function fmt(v){if(v instanceof Array)return v[0]===v[1]?String(v[0]):v[0]+'～'+v[1];return v==null?'-':v;}
function fits(r,k,l,h){if(!k||l===''&&h==='')return true;var a=n(r,k,0),b=n(r,k,1),m=get('bound').value;if(a===null||b===null)return false;if(m==='minimum')b=a;if(m==='maximum')a=b;return (l===''||a>=Number(l))&&(h===''||b<=Number(h));}
function wipe(x){while(x.firstChild)x.removeChild(x.firstChild);}
function draw(){
var q=get('q').value.toLowerCase(),g=get('group').value,cols=[],result=[],i,j;
for(i=0;i<keys.length;i++)if(g==='all'||keys[i].indexOf(g+'.')===0)cols.push(keys[i]);
for(i=0;i<rows.length;i++){var r=rows[i];if(r.name.toLowerCase().indexOf(q)<0||!fits(r,get('filterKey').value,get('min').value,get('max').value)||!fits(r,get('filterKey2').value,get('min2').value,get('max2').value))continue;result.push(r);}
result.sort(function(a,b){var x=sort==='name'?a.name:n(a,sort,0),y=sort==='name'?b.name:n(b,sort,0),v;if(x===null)x=999999;if(y===null)y=999999;v=typeof x==='number'&&typeof y==='number'?x-y:String(x).localeCompare(String(y),'ja');return asc?v:-v;});
var size=get('pageSize').value==='all'?Math.max(1,result.length):Number(get('pageSize').value),pages=Math.max(1,Math.ceil(result.length/size));if(page>=pages)page=pages-1;
get('count').textContent='表示 '+result.length+' / 94件（模擬）';get('pageInfo').textContent=(page+1)+' / '+pages+'ページ';get('pagePrev').disabled=page===0;get('pageNext').disabled=page>=pages-1;
var head=get('head'),body=get('body'),tr=d.createElement('tr');wipe(head);wipe(body);
function th(k){var x=d.createElement('th');x.textContent=k==='name'?'名称':label(k);x.onclick=function(){asc=sort===k?!asc:true;sort=k;draw();};tr.appendChild(x);}
th('name');for(i=0;i<cols.length;i++)th(cols[i]);head.appendChild(tr);
function cell(row,r,k){var td=d.createElement('td'),b=d.createElement('button');b.type='button';b.textContent=fmt(r.properties[k]);b.onclick=function(){get('details').textContent=r.name+' / '+label(k)+' : '+fmt(r.properties[k])+'\n出典：架空の模擬データ。現行UO能力ではありません。';};td.appendChild(b);row.appendChild(td);}
for(i=page*size;i<Math.min((page+1)*size,result.length);i++){var v=result[i],rr=d.createElement('tr'),td=d.createElement('td');td.textContent=v.name;rr.appendChild(td);for(j=0;j<cols.length;j++)cell(rr,v,cols[j]);body.appendChild(rr);}
}
var ids=['q','group','filterKey','filterKey2','min','max','min2','max2','bound','pageSize'];for(var t=0;t<ids.length;t++)(function(id){get(id).addEventListener(id==='q'||id==='min'||id==='max'||id==='min2'||id==='max2'?'input':'change',function(){page=0;draw();});})(ids[t]);
get('pagePrev').onclick=function(){if(page>0)page--;draw();};get('pageNext').onclick=function(){page++;draw();};
get('reset').onclick=function(){var a=['q','min','max','min2','max2'];for(var i=0;i<a.length;i++)get(a[i]).value='';get('group').value='all';get('filterKey').value='stats.hp';get('filterKey2').value='';get('bound').value='range';page=0;draw();};draw();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
}());