(async function(){
// ============================================================
// 活動價格檢查工具 campaign_price_checker
// 製作：ming.chan@shopee.com
// ============================================================

if(document.getElementById("cpc_modal")){
  document.getElementById("cpc_modal").remove();
  document.getElementById("cpc_overlay")?.remove();
  return;
}

// ── 使用率統計 ──────────────────────────────────────────────
const TF="https://docs.google.com/forms/d/e/1FAIpQLSff11O98fFS7P0SFWpvkuBaMlLns_CPEkMpz43KcB-_lTrDuA/formResponse";
function track(action){
  try{
    let u=localStorage.cpc_uid;
    if(!u){u=(crypto.randomUUID?crypto.randomUUID():Date.now()+"_"+Math.random());localStorage.cpc_uid=u;}
    const d=new URLSearchParams();
    d.append("entry.1835367255","campaign_price_checker");
    d.append("entry.145005153",action);
    navigator.sendBeacon?navigator.sendBeacon(TF,d):fetch(TF,{method:"POST",mode:"no-cors",body:d});
  }catch(_){}
}
if(!localStorage.cpc_first){track("first_use");localStorage.cpc_first="1";}
track("open");

// ── 樣式 ────────────────────────────────────────────────────
const css=document.createElement("style");
css.innerHTML=`
#cpc_overlay{position:fixed;inset:0;background:rgba(0,0,0,.38);z-index:999998}
#cpc_modal{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:1200px;max-width:96vw;height:820px;max-height:94vh;background:#fff;border-radius:14px;box-shadow:0 12px 40px rgba(0,0,0,.28);z-index:999999;overflow:hidden;font-family:Arial,sans-serif;color:#333;display:flex;flex-direction:column}
#cpc_hd{display:flex;justify-content:space-between;align-items:center;padding:16px 24px;border-bottom:1px solid #eee;flex-shrink:0}
#cpc_hd h2{font-size:18px;margin:0;font-weight:700}
#cpc_hd small{font-size:11px;color:#aaa;margin-left:10px}
#cpc_x{border:none;background:none;font-size:26px;cursor:pointer;color:#666}
#cpc_body{padding:18px 24px;flex:1;overflow:auto;background:#fafafa}
#cpc_inputs{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:12px;align-items:start;margin-bottom:14px}
.cpc_label{font-size:12px;color:#666;margin-bottom:4px;font-weight:600}
.cpc_ta{width:100%;height:120px;border:1px solid #ddd;border-radius:10px;padding:10px;font-size:12px;resize:vertical;box-sizing:border-box;font-family:monospace}
.cpc_ta:focus{outline:none;border-color:#ee4d2d}
#cpc_date_row{display:flex;align-items:center;gap:10px;margin-bottom:14px;flex-wrap:wrap}
#cpc_date_row label{font-size:13px;color:#555;font-weight:600}
.cpc_date{border:1px solid #ddd;border-radius:8px;padding:8px 10px;font-size:13px;background:#fff}
#cpc_btn{background:#ee4d2d;color:#fff;border:none;border-radius:10px;padding:10px 28px;font-size:14px;font-weight:700;cursor:pointer}
#cpc_btn:disabled{background:#ccc;cursor:not-allowed}
#cpc_status{font-size:13px;color:#666;margin-bottom:6px}
#cpc_pg{height:7px;background:#eee;border-radius:99px;margin-bottom:14px;overflow:hidden}
#cpc_bar{height:7px;width:0%;background:#ee4d2d;transition:width .3s}
#cpc_summary{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:14px}
.cpc_card{background:#fff;border:1px solid #eee;border-radius:12px;padding:12px 14px}
.cpc_card .ttl{font-size:11px;color:#888}
.cpc_card .num{font-size:28px;font-weight:700;margin-top:2px}
.c1{color:#168038}.c2{color:#f0a500}.c3{color:#d93025}.c4{color:#888}
#cpc_dl_row{display:flex;gap:10px;margin-bottom:12px}
#cpc_dl_row button{background:#fff;border:1px solid #ddd;border-radius:8px;padding:7px 14px;cursor:pointer;font-size:12px}
#cpc_tableWrap{background:#fff;border:1px solid #eee;border-radius:12px;overflow:auto;max-height:320px}
#cpc_table{border-collapse:collapse;width:100%;font-size:12px}
#cpc_table th,#cpc_table td{padding:8px 10px;border-bottom:1px solid #f0f0f0;text-align:center;white-space:nowrap}
#cpc_table thead th{background:#fafafa;position:sticky;top:0;z-index:3;font-size:11px}
.lv1{background:#e8f5e9}.lv2{background:#fff8e1}.lv3{background:#ffebee}.lv4{background:#f5f5f5}
.mid_row{background:#f9f9f9;font-size:11px}
.mid_row td:first-child{padding-left:28px;text-align:left}
.expand_btn{cursor:pointer;background:none;border:none;color:#ee4d2d;font-size:12px;padding:0 4px}
.ok{color:#168038;font-weight:700}.ng{color:#d93025;font-weight:700}
#cpc_manual{margin-top:10px;background:#fff;border:1px solid #eee;border-radius:12px;padding:16px;font-size:12px;line-height:1.8;color:#555}
#cpc_manual h3{font-size:13px;color:#333;margin:0 0 8px}
`;
document.head.appendChild(css);

// ── DOM ─────────────────────────────────────────────────────
const ov=document.createElement("div"); ov.id="cpc_overlay";
const m=document.createElement("div"); m.id="cpc_modal";

const today=new Date();
const fmt=d=>d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");

m.innerHTML=`
<div id="cpc_hd">
  <div><h2>🔍 活動價格檢查工具<small>Campaign Price Checker</small></h2>
  <span style="font-size:11px;color:#bbb">製作：ming.chan@shopee.com</span></div>
  <button id="cpc_x">×</button>
</div>
<div id="cpc_body">
  <div id="cpc_inputs">
    <div>
      <div class="cpc_label">① SHOP ID（每行一個）</div>
      <textarea class="cpc_ta" id="ta_sid" placeholder="140031773&#10;140031773&#10;140031774"></textarea>
    </div>
    <div>
      <div class="cpc_label">② PID 商品編號（每行一個）</div>
      <textarea class="cpc_ta" id="ta_pid" placeholder="57750115690&#10;57650137603&#10;57506337641"></textarea>
    </div>
    <div>
      <div class="cpc_label">③ 入稿價格 NT$（每行一個）</div>
      <textarea class="cpc_ta" id="ta_price" placeholder="88&#10;120&#10;99"></textarea>
    </div>
    <div style="display:flex;flex-direction:column;justify-content:flex-end;gap:10px">
      <div>
        <div class="cpc_label">活動開始日</div>
        <input class="cpc_date" type="date" id="dt_start" value="${fmt(today)}">
      </div>
      <div>
        <div class="cpc_label">活動結束日（同天=單日查詢）</div>
        <input class="cpc_date" type="date" id="dt_end" value="${fmt(today)}">
      </div>
      <button id="cpc_btn">開始查詢</button>
    </div>
  </div>
  <div id="cpc_status">待命中｜請輸入資料後按開始查詢</div>
  <div id="cpc_pg"><div id="cpc_bar"></div></div>
  <div id="cpc_summary">
    <div class="cpc_card"><div class="ttl">查詢筆數</div><div class="num" id="s_total">0</div></div>
    <div class="cpc_card"><div class="ttl">🟢 完全符合</div><div class="num c1" id="s_lv1">0</div></div>
    <div class="cpc_card"><div class="ttl">🟡 部分符合</div><div class="num c2" id="s_lv2">0</div></div>
    <div class="cpc_card"><div class="ttl">🔴 不符合 / ⚫ 未設定</div><div class="num c3" id="s_lv34">0</div></div>
  </div>
  <div id="cpc_dl_row">
    <button id="dl_csv">⬇ 下載 CSV</button>
    <button id="dl_detail_csv">⬇ 下載 MID 明細 CSV</button>
  </div>
  <div id="cpc_tableWrap">
    <table id="cpc_table">
      <thead><tr>
        <th>展開</th><th>SHOP ID</th><th>PID</th><th>商品名稱</th>
        <th>入稿價</th><th>符合等級</th><th>符合MID/總MID</th>
        <th>活動名稱</th><th>活動時間</th>
      </tr></thead>
      <tbody id="cpc_tbody"></tbody>
    </table>
  </div>
  <div id="cpc_manual">
    <h3>📖 使用說明</h3>
    ① 從入稿表分別複製 SHOP ID、PID、活動價格三欄，各自貼入對應欄位（每行一筆，三欄行數需相同）<br>
    ② 輸入活動開始與結束日（查單日則填同一天）<br>
    ③ 按「開始查詢」，工具將自動比對賣家預約變價是否符合入稿價<br>
    <b>符合等級：</b>🟢完全符合（所有規格=入稿價）｜🟡部分符合（部分規格符合）｜🔴完全不符合｜⚫未設定（查無活動）
  </div>
</div>`;

document.body.appendChild(ov);
document.body.appendChild(m);
document.getElementById("cpc_x").onclick=()=>{ov.remove();m.remove();};
ov.onclick=()=>{ov.remove();m.remove();};

// ── 工具函式 ─────────────────────────────────────────────────
const setStatus=(t,p)=>{
  document.getElementById("cpc_status").innerText=t;
  if(p!=null) document.getElementById("cpc_bar").style.width=p+"%";
};
const tsToDate=ts=>ts?new Date(ts*1000).toLocaleDateString("zh-TW"):"";
const priceFromAPI=v=>v!=null?Math.round(v/100000):null;

// 判斷符合等級
function calcLevel(midList, targetPrice){
  if(!midList||midList.length===0) return 4;
  const matched=midList.filter(m=>m.promoPrice===targetPrice).length;
  if(matched===midList.length) return 1;
  if(matched>0) return 2;
  return 3;
}

const levelLabel={1:"🟢 完全符合",2:"🟡 部分符合",3:"🔴 完全不符合",4:"⚫ 未設定"};
const levelClass={1:"lv1",2:"lv2",3:"lv3",4:"lv4"};

// ── API ─────────────────────────────────────────────────────
async function getDiscountList(shopId){
  const resp=await fetch("https://admin.promotion.shopee.tw/api/gateway/v1/seller_discount/get_seller_discount_list",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({region:"TW",shop_id:Number(shopId),limit:100,offset:0})
  });
  const json=await resp.json();
  return json?.seller_discount_list||[];
}

async function getDiscountItems(promotionId){
  let allItems=[];
  let offset=0;
  for(let page=0;page<80;page++){
    const resp=await fetch("https://admin.promotion.shopee.tw/api/gateway/v1/seller_discount/get_seller_discount_item_batch",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({region:"TW",SkipPermissionBD:false,promotion_id:Number(promotionId),limit:25,offset})
    });
    const json=await resp.json();
    const items=json?.item_model_list||[];
    allItems=allItems.concat(items);
    if(!json?.has_more) break;
    offset+=25;
    await new Promise(r=>setTimeout(r,60));
  }
  return allItems;
}

// ── 主查詢 ───────────────────────────────────────────────────
let resultRows=[];
let detailRows=[];

document.getElementById("cpc_btn").onclick=async()=>{
  resultRows=[];
  detailRows=[];
  document.getElementById("cpc_tbody").innerHTML="";
  document.getElementById("s_total").innerText="0";
  document.getElementById("s_lv1").innerText="0";
  document.getElementById("s_lv2").innerText="0";
  document.getElementById("s_lv34").innerText="0";

  const sids=document.getElementById("ta_sid").value.trim().split("\n").map(x=>x.trim()).filter(Boolean);
  const pids=document.getElementById("ta_pid").value.trim().split("\n").map(x=>x.trim()).filter(Boolean);
  const prices=document.getElementById("ta_price").value.trim().split("\n").map(x=>Number(x.trim())).filter(x=>!isNaN(x));
  const startDate=document.getElementById("dt_start").value;
  const endDate=document.getElementById("dt_end").value;

  // 驗證
  if(!sids.length||!pids.length||!prices.length){
    setStatus("❌ 請輸入 SHOP ID、PID 與活動價格",null);
    return;
  }
  if(sids.length!==pids.length||pids.length!==prices.length){
    setStatus(`❌ 三欄行數不一致：SHOP ID ${sids.length} 行、PID ${pids.length} 行、價格 ${prices.length} 行`,null);
    return;
  }
  if(!startDate||!endDate){
    setStatus("❌ 請輸入活動日期",null);
    return;
  }

  const queryStart=new Date(startDate).getTime()/1000;
  const queryEnd=new Date(endDate).getTime()/1000+86399; // 結束日含當天

  document.getElementById("cpc_btn").disabled=true;
  track("query_start");

  try{
    for(let i=0;i<sids.length;i++){
      const shopId=sids[i];
      const pid=pids[i];
      const targetPrice=prices[i];

      setStatus(`查詢第 ${i+1}/${sids.length} 筆｜SHOP ID: ${shopId} PID: ${pid}`, Math.round(i/sids.length*100));

      // Step 1: 取得活動列表
      let discountList=[];
      try{
        discountList=await getDiscountList(shopId);
      }catch(e){
        resultRows.push({shopId,pid,targetPrice,level:4,matched:0,total:0,promotionTitle:"API錯誤",promotionTime:"",midList:[],error:e.message});
        continue;
      }

      // 過濾時間重疊的活動
      const overlapping=discountList.filter(p=>p.start_time<queryEnd && p.end_time>queryStart);

      if(!overlapping.length){
        resultRows.push({shopId,pid,targetPrice,level:4,matched:0,total:0,promotionTitle:"查無符合時間的活動",promotionTime:"",midList:[],itemName:""});
        continue;
      }

      // Step 2: 在每個活動裡找 PID
      let bestLevel=4, bestMidList=[], bestPromoTitle="", bestPromoTime="", itemName="";

      for(const promo of overlapping){
        let items=[];
        try{
          items=await getDiscountItems(promo.promotion_id);
        }catch(e){ continue; }

        const pidItems=items.filter(it=>String(it.item_id)===String(pid));
        if(!pidItems.length) continue;

        const midList=pidItems.map(it=>({
          modelId:it.model_id,
          promoPrice:priceFromAPI(it.promo_price_after_tax),
          origPrice:priceFromAPI(it.orig_price_after_tax),
          itemName:it.item_name||""
        }));

        if(!itemName && midList[0]?.itemName) itemName=midList[0].itemName;

        const level=calcLevel(midList,targetPrice);
        if(level<bestLevel){
          bestLevel=level;
          bestMidList=midList;
          bestPromoTitle=promo.title||"";
          bestPromoTime=tsToDate(promo.start_time)+" ～ "+tsToDate(promo.end_time);
        }
        if(bestLevel===1) break; // 找到完全符合就停
      }

      resultRows.push({shopId,pid,targetPrice,level:bestLevel,
        matched:bestMidList.filter(m=>m.promoPrice===targetPrice).length,
        total:bestMidList.length,
        promotionTitle:bestLevel===4?"查無此PID的活動":bestPromoTitle,
        promotionTime:bestPromoTime,
        midList:bestMidList,
        itemName
      });
    }

    // 統計
    const lv1=resultRows.filter(r=>r.level===1).length;
    const lv2=resultRows.filter(r=>r.level===2).length;
    const lv34=resultRows.filter(r=>r.level===3||r.level===4).length;
    document.getElementById("s_total").innerText=resultRows.length;
    document.getElementById("s_lv1").innerText=lv1;
    document.getElementById("s_lv2").innerText=lv2;
    document.getElementById("s_lv34").innerText=lv34;

    renderTable();
    setStatus(`✅ 查詢完成｜共 ${resultRows.length} 筆`,100);
    track("query_done");

  }catch(e){
    setStatus("❌ 錯誤："+e.message,null);
    track("query_error");
    console.error(e);
  }finally{
    document.getElementById("cpc_btn").disabled=false;
  }
};

// ── 渲染表格 ─────────────────────────────────────────────────
function renderTable(){
  const tb=document.getElementById("cpc_tbody");
  tb.innerHTML="";
  resultRows.forEach((r,idx)=>{
    const tr=document.createElement("tr");
    tr.className=levelClass[r.level];
    tr.innerHTML=`
      <td><button class="expand_btn" data-idx="${idx}">▶</button></td>
      <td>${r.shopId}</td>
      <td>${r.pid}</td>
      <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;text-align:left" title="${r.itemName}">${r.itemName||"-"}</td>
      <td>NT$ ${r.targetPrice}</td>
      <td><b>${levelLabel[r.level]}</b></td>
      <td>${r.level===4?"-":r.matched+"/"+r.total}</td>
      <td>${r.promotionTitle}</td>
      <td style="font-size:11px">${r.promotionTime}</td>
    `;
    tb.appendChild(tr);

    // MID 明細列（預設隱藏）
    if(r.midList&&r.midList.length){
      r.midList.forEach(mid=>{
        const mtr=document.createElement("tr");
        mtr.className="mid_row";
        mtr.dataset.parent=idx;
        mtr.style.display="none";
        const ok=mid.promoPrice===r.targetPrice;
        mtr.innerHTML=`
          <td></td>
          <td colspan="2" style="padding-left:28px;text-align:left;color:#888">MID: ${mid.modelId}</td>
          <td></td>
          <td>NT$ ${mid.origPrice??"-"}</td>
          <td>活動價：NT$ ${mid.promoPrice??"-"}</td>
          <td><span class="${ok?"ok":"ng"}">${ok?"✓ 符合":"✗ 不符"}</span></td>
          <td colspan="2"></td>
        `;
        tb.appendChild(mtr);
      });
    }
  });

  // 展開/收合
  tb.querySelectorAll(".expand_btn").forEach(btn=>{
    btn.onclick=()=>{
      const idx=btn.dataset.idx;
      const midRows=tb.querySelectorAll(`tr.mid_row[data-parent="${idx}"]`);
      const isOpen=btn.innerText==="▼";
      midRows.forEach(r=>r.style.display=isOpen?"none":"");
      btn.innerText=isOpen?"▶":"▼";
    };
  });
}

// ── CSV 下載 ─────────────────────────────────────────────────
function csvCell(v){v=String(v==null?"":v);return'"'+v.replace(/"/g,'""')+'"';}
function idCell(v){return'="'+String(v??"").replace(/"/g,'""')+'"';}

document.getElementById("dl_csv").onclick=()=>{
  if(!resultRows.length){alert("尚無查詢結果");return;}
  const h=["SHOP ID","PID","商品名稱","入稿價(NT$)","符合等級","符合MID數","總MID數","活動名稱","活動時間"];
  const lines=["\uFEFF"+h.map(csvCell).join(",")];
  resultRows.forEach(r=>lines.push([
    idCell(r.shopId),idCell(r.pid),csvCell(r.itemName),csvCell(r.targetPrice),
    csvCell(levelLabel[r.level].replace(/[🟢🟡🔴⚫]/g,"")),
    csvCell(r.level===4?"-":r.matched),csvCell(r.level===4?"-":r.total),
    csvCell(r.promotionTitle),csvCell(r.promotionTime)
  ].join(",")));
  const blob=new Blob([lines.join("\n")],{type:"text/csv;charset=utf-8"});
  const a=document.createElement("a");a.href=URL.createObjectURL(blob);
  a.download="campaign_price_check.csv";a.click();
  track("download_csv");
};

document.getElementById("dl_detail_csv").onclick=()=>{
  if(!resultRows.length){alert("尚無查詢結果");return;}
  const h=["SHOP ID","PID","商品名稱","MID","原價(NT$)","活動價(NT$)","入稿價(NT$)","是否符合","活動名稱"];
  const lines=["\uFEFF"+h.map(csvCell).join(",")];
  resultRows.forEach(r=>{
    if(!r.midList||!r.midList.length){
      lines.push([idCell(r.shopId),idCell(r.pid),csvCell(r.itemName),csvCell("-"),csvCell("-"),csvCell("-"),csvCell(r.targetPrice),csvCell("未設定"),csvCell(r.promotionTitle)].join(","));
    } else {
      r.midList.forEach(mid=>{
        const ok=mid.promoPrice===r.targetPrice;
        lines.push([idCell(r.shopId),idCell(r.pid),csvCell(r.itemName),idCell(mid.modelId),
          csvCell(mid.origPrice??"-"),csvCell(mid.promoPrice??"-"),csvCell(r.targetPrice),
          csvCell(ok?"符合":"不符合"),csvCell(r.promotionTitle)].join(","));
      });
    }
  });
  const blob=new Blob([lines.join("\n")],{type:"text/csv;charset=utf-8"});
  const a=document.createElement("a");a.href=URL.createObjectURL(blob);
  a.download="campaign_price_check_detail.csv";a.click();
  track("download_detail_csv");
};

})();
