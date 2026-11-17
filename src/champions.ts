import {useEffect,useState} from 'react';
export type Champion={id:string;name:string;image:{full:string}};
export type PoolEntry={championId:string;comfort:string;priority:string;readiness:string;notes:string};
export type Player={id:string;title:string;subtitle:string;riotId?:string;championPool?:PoolEntry[]};
let cached: {champions:Champion[];version:string}|null=null;let pending:Promise<{champions:Champion[];version:string}>|null=null;
function loadChampions(){if(cached)return Promise.resolve(cached);if(!pending)pending=(async()=>{const vr=await fetch('https://ddragon.leagueoflegends.com/api/versions.json');if(!vr.ok)throw Error();const version=(await vr.json())[0];if(typeof version!=='string')throw Error();const r=await fetch(`https://ddragon.leagueoflegends.com/cdn/${encodeURIComponent(version)}/data/pt_BR/champion.json`);if(!r.ok)throw Error();const data=await r.json();cached={version,champions:(Object.values(data.data) as Champion[]).sort((a,b)=>a.name.localeCompare(b.name,'pt-BR'))};return cached})().catch(error=>{pending=null;throw error});return pending}
export function useChampions(){const [data,setData]=useState(cached);const [error,setError]=useState(false);useEffect(()=>{let live=true;loadChampions().then(result=>{if(live){setData(result);setError(false)}}).catch(()=>{if(live)setError(true)});return()=>{live=false}},[]);return {champions:data?.champions||[],version:data?.version||'',error}}
export const championImage=(version:string,c:Champion)=>`https://ddragon.leagueoflegends.com/cdn/${encodeURIComponent(version)}/img/champion/${encodeURIComponent(c.image.full)}`;
export const normalize=(s:string)=>s.toLocaleLowerCase('pt-BR').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
