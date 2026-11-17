// One observation is one registered game, regardless of how many agenda blocks reference it.
export function computeAnalytics(items,filters={}){
 const drafts=new Map(items.filter(i=>i.type==='draft').map(d=>[d.id,d]));
 const matches=items.filter(i=>i.type==='match').filter(i=>!filters.kind||((i.match?.kind||'Scrim')===filters.kind)).filter(i=>!filters.patch||(i.match?.patch||'')===filters.patch).filter(i=>!filters.from||(i.date&&i.date>=filters.from)).filter(i=>!filters.to||(i.date&&i.date<=filters.to));
 const played=matches.filter(m=>m.match?.result==='Vitória'||m.match?.result==='Derrota');
 const win=m=>m.match.result==='Vitória';const sides=['Blue','Red'].map(side=>{const data=played.filter(m=>m.match?.side===side);return {side,games:data.length,wins:data.filter(win).length,losses:data.filter(m=>!win(m)).length}});
 const picks=new Map(),bans=new Map();let linked=0,oriented=0;
 for(const m of played){const d=drafts.get(m.match?.draftId);if(!d?.draftSlots)continue;linked++;const side=m.match?.side;const slots=d.draftSlots;
  if(side==='Blue'||side==='Red'){oriented++;for(const id of new Set((side==='Blue'?slots.bluePicks:slots.redPicks)||[])){if(!id)continue;const p=picks.get(id)||{id,games:0,wins:0};p.games++;if(win(m))p.wins++;picks.set(id,p)}}
  for(const id of new Set([...(slots.blueBans||[]),...(slots.redBans||[])])){if(!id)continue;const b=bans.get(id)||{id,games:0,ours:0,opponent:0,unknown:0};b.games++;const blue=(slots.blueBans||[]).includes(id),red=(slots.redBans||[]).includes(id);if(side==='Blue'){if(blue)b.ours++;else if(red)b.opponent++}else if(side==='Red'){if(red)b.ours++;else if(blue)b.opponent++}else b.unknown++;bans.set(id,b)}
 }
 const pickList=[...picks.values()].sort((a,b)=>(b.wins/b.games)-(a.wins/a.games)||b.games-a.games||a.id.localeCompare(b.id));const banList=[...bans.values()].sort((a,b)=>b.games-a.games||a.id.localeCompare(b.id));
 return {matches,played,sides,wins:played.filter(win).length,picks:pickList,bans:banList,linked,oriented,missingResult:matches.length-played.length,unknownSide:played.filter(m=>m.match?.side!=='Blue'&&m.match?.side!=='Red').length};
}
