'use client';
import React, { useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/toast';
import { MapPin, Upload, Image, Shield, Search, CheckCircle2 } from 'lucide-react';

const CATEGORIES = [
  { id: 'eat', label: 'Manger' },
  { id: 'stay', label: 'Se loger' },
  { id: 'learn', label: 'Se former' },
  { id: 'sport', label: 'Sport' },
  { id: 'out', label: 'Sortir' },
] as const;
type CategoryId = typeof CATEGORIES[number]['id'];

type Item = { id:string; category:CategoryId; title:string; mediaUrl:string; address:string; priceHint:string; tags:string[]; description?:string; orgComment?:string; };

const ALLOWED_MEDIA_TYPES = ['image/jpeg','image/png','image/webp','video/mp4','video/webm'];

const BLOCKLIST = [
  'drogue','stupéfiant','cocaïne','héroïne','meth','vente de médicaments','ordonnance',
  'armes','arme à feu','munitions','couteau automatique','silencieux',
  'escorte','sexe','porn','pornographie','prostitution',
  'arnaque','fausse carte','contrefaçon','piratage','hack','cracker','carding',
  'violence','haine','racisme','nazisme','terrorisme','djihad',
  'pari illégal','blanchiment','données personnelles à vendre'
];

const DEMO_ITEMS: Item[] = [
  { id: 'i1', category: 'eat', title: 'Cantine Locale', mediaUrl: 'https://images.unsplash.com/photo-1526318472351-c75fcf070305?w=1200', address: '12 Rue des Halles, Paris', priceHint: 'Plat du jour 12€', tags: ['menu midi','local','public'], description:'Cuisine simple et de saison à petit prix.'},
  { id: 'i2', category: 'stay', title: 'Studio meublé', mediaUrl: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200', address: 'Boulogne-Billancourt', priceHint: '750€ / mois', tags: ['meublé'], description:'Petite surface optimisée, proche transports.'},
  { id: 'i3', category: 'learn', title: 'Atelier CV & LinkedIn', mediaUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200', address: 'Médiathèque, Lyon', priceHint: 'Gratuit sur inscription', tags: ['atelier','public','gratuit'], description:'Mise à jour de CV et conseils profil pro.'},
  { id: 'i4', category: 'sport', title: 'Parc – Appareils en libre accès', mediaUrl: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=1200', address: 'Bordeaux', priceHint: 'Accès libre', tags: ['plein air','gratuit','public'], description:'Espace musculation extérieur accessible à tous.'},
  { id: 'i5', category: 'out', title: 'Cinéma de quartier', mediaUrl: 'https://images.unsplash.com/photo-1517602302552-471fe67acf66?w=1200', address: 'Marseille', priceHint: '5€ le mardi', tags: ['réduit','VO'], description:'Programmation d\'auteurs et VO sous-titrée.'},
];

function Hero(){
  return (
    <section className="hero">
      <div className="hero-bg" />
      <div className="container py-10 sm:py-14 relative">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/70 backdrop-blur px-3 py-1 shadow-sm">
            <Shield className="w-4 h-4"/><span className="text-xs">Contenus 100% visuels, sûrs et conformes</span>
          </div>
          <h1 className="mt-4 text-3xl sm:text-4xl font-semibold leading-tight">Essentiels de Vie</h1>
          <p className="mt-2 text-gray-600">Manger, se loger, se former, faire du sport, sortir : découvre des lieux et bons plans près de toi.</p>
        </div>
      </div>
    </section>
  );
}

function Header({ onOpenCreate, onSearch }: { onOpenCreate: () => void; onSearch: (q:string)=>void }){
  return (
    <div className="container -mt-6 sm:-mt-8">
      <div className="bg-white/80 backdrop-blur card p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2"><Shield className="w-6 h-6"/><span className="font-semibold">Essentiels de Vie</span></div>
        <div className="w-full sm:w-96"><SearchBar onChange={onSearch} /></div>
        <div><Button className="gap-2" onClick={onOpenCreate}><Upload className="w-4 h-4"/>Proposer un lieu</Button></div>
      </div>
    </div>
  );
}

function CategoryTabs({ value, onValueChange, onValidate }:{value:string; onValueChange:(v:string)=>void; onValidate:()=>void}){
  return (
    <div className="container mt-4">
      <Tabs value={value} onValueChange={onValueChange} className="w-full">
        <TabsList className="grid grid-cols-5">
          {CATEGORIES.map(c => <TabsTrigger key={c.id} value={c.id} current={value} onValueChange={onValueChange}>{c.label}</TabsTrigger>)}
        </TabsList>
      </Tabs>
      <div className="flex justify-end mt-2">
        <Button className="gap-2" onClick={onValidate}><CheckCircle2 className="w-4 h-4"/>Valider ma sélection</Button>
      </div>
    </div>
  );
}

function SearchBar({ compact=false, onChange }:{compact?:boolean; onChange?:(q:string)=>void}){
  const [q,setQ]=useState('');
  return (
    <div className="flex items-center gap-2 w-full">
      <Input placeholder="Rechercher un lieu / bon plan" value={q} onChange={(e)=>{ const v=e.target.value; setQ(v); onChange?.(v); }} />
      {!compact && <Button className="btn-secondary" aria-label="Lancer la recherche" onClick={()=>onChange?.(q)}><Search className="w-4 h-4"/><span className="ml-1">OK</span></Button>}
    </div>
  );
}

function FiltersBar({ city,onCity, priceMax,onPriceMax, publicOnly,onPublicOnly, tag,onTag }:{
  city:string; onCity:(v:string)=>void; priceMax:number|null; onPriceMax:(v:number|null)=>void; publicOnly:boolean; onPublicOnly:(v:boolean)=>void; tag:string; onTag:(v:string)=>void;
}){
  return (
    <div className="container grid gap-2 sm:grid-cols-4 mt-4">
      <div><Input placeholder="Ville (ex. Paris)" value={city} onChange={(e)=>onCity(e.target.value)} /></div>
      <div>
        <select className="input" value={priceMax ?? ''} onChange={(e)=>onPriceMax(e.target.value ? Number(e.target.value): null)}>
          <option value="">Prix max (optionnel)</option>
          <option value="0">Gratuit</option>
          <option value="5">≤ 5€</option>
          <option value="10">≤ 10€</option>
          <option value="20">≤ 20€</option>
        </select>
      </div>
      <div>
        <select className="input" value={tag} onChange={(e)=>onTag(e.target.value)}>
          <option value="">Filtre tag (optionnel)</option>
          <option value="gratuit">#gratuit</option>
          <option value="local">#local</option>
          <option value="atelier">#atelier</option>
          <option value="plein air">#plein air</option>
          <option value="VO">#VO</option>
        </select>
      </div>
      <div className="flex items-center justify-between border rounded-md px-3 py-2 bg-white">
        <span className="text-sm">Structures publiques/asso uniquement</span>
        <Switch checked={publicOnly} onCheckedChange={onPublicOnly} />
      </div>
    </div>
  );
}

function Grid({ items, onOpen }:{items:Item[]; onOpen:(id:string)=>void}){
  return (
    <div className="container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      {items.map(it => (
        <div key={it.id} className="card overflow-hidden">
          <div className="aspect-video w-full bg-gray-100" style={{backgroundImage:`url(${it.mediaUrl})`, backgroundSize:'cover', backgroundPosition:'center'}} />
          <CardContent>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg">{it.title}</h3>
                <div className="text-sm flex items-center gap-1 opacity-80"><MapPin className="w-4 h-4"/>{it.address}</div>
              </div>
              <Badge>{it.priceHint}</Badge>
            </div>
            {it.description && <p className="mt-2 text-sm text-gray-600 line-clamp-2">{it.description}</p>}
            <div className="mt-2 flex flex-wrap gap-2">{it.tags.map(t => <Badge key={t}>#{t}</Badge>)}</div>
            <div className="mt-3"><Button variant="outline" onClick={()=>onOpen(it.id)}>Voir</Button></div>
          </CardContent>
        </div>
      ))}
    </div>
  );
}

function Detail({ item, onClose }:{item:Item; onClose:()=>void}){
  const [openReport,setOpenReport]=useState(false);
  const [reason,setReason]=useState('');
  const [type,setType]=useState('contenu illicite');
  const submitReport=()=>{
    if(!reason.trim()){ alert('Merci de décrire brièvement le problème.'); return; }
    alert('Signalement envoyé. Merci pour votre vigilance !');
    setOpenReport(false); setReason('');
  };
  return (
    <div>
      <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4" onClick={onClose}>
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden" onClick={(e)=>e.stopPropagation()}>
          <div className="aspect-video w-full" style={{backgroundImage:`url(${item.mediaUrl})`, backgroundSize:'cover', backgroundPosition:'center'}} />
          <div className="p-4">
            <h3 className="text-xl font-semibold">{item.title}</h3>
            <div className="text-sm flex items-center gap-1 opacity-80 mt-1"><MapPin className="w-4 h-4"/>{item.address}</div>
            <div className="mt-3 text-sm">{item.priceHint}</div>
            {item.description && <div className="mt-3 text-sm text-gray-700">{item.description}</div>}
            {item.orgComment && <div className="mt-2 text-xs text-gray-500"><span className="font-medium">Commentaire organisateur :</span> {item.orgComment}</div>}
            <div className="mt-2 flex flex-wrap gap-2">{item.tags.map(t=><Badge key={t}>#{t}</Badge>)}</div>
            <div className="mt-4 flex justify-between">
              <Button variant="outline" onClick={()=>setOpenReport(true)}>Signaler</Button>
              <Button onClick={onClose}>Fermer</Button>
            </div>
          </div>
        </div>
      </div>
      {openReport && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-[110]">
          <div className="bg-white rounded-2xl shadow p-4 w-full max-w-xl">
            <div className="mb-2"><h3 className="text-lg font-semibold">Signaler ce contenu</h3></div>
            <div className="grid gap-2">
              <div>
                <label className="label">Type de problème</label>
                <select className="input" value={type} onChange={e=>setType(e.target.value)}>
                  <option>contenu illicite</option>
                  <option>discours de haine/violence</option>
                  <option>arnaque/fraude</option>
                  <option>contenu personnel/sensible</option>
                  <option>autre</option>
                </select>
              </div>
              <div>
                <label className="label">Description</label>
                <Textarea value={reason} onChange={e=>setReason(e.target.value)} placeholder="Explique en 1–2 phrases" maxLength={300} />
              </div>
              <div className="flex justify-end gap-2 mt-2">
                <Button variant="outline" onClick={()=>setOpenReport(false)}>Annuler</Button>
                <Button onClick={submitReport}>Envoyer</Button>
              </div>
              <p className="text-xs opacity-70">Les signalements sont revus par la modération. Aucune donnée personnelle n'est publiée.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CreateDialog({ isOpen, onOpenChange, onAdd }:{isOpen:boolean; onOpenChange:(v:boolean)=>void; onAdd:(i:Item)=>void}){
  const [title,setTitle]=useState(''); const [address,setAddress]=useState(''); const [price,setPrice]=useState('');
  const [category,setCategory]=useState<CategoryId>('eat'); const [mediaFile,setMediaFile]=useState<File|null>(null);
  const [desc,setDesc]=useState(''); const [orgComment,setOrgComment]=useState('');
  const [isPublicOrg,setIsPublicOrg]=useState(true);
  const blocked=useMemo(()=>{ const txt=(title+' '+address+' '+price+' '+desc+' '+orgComment).toLowerCase(); return BLOCKLIST.some(b=>txt.includes(b)); },[title,address,price,desc,orgComment]);
  const onPick=(file?:File|null)=>{ if(!file)return; if(!ALLOWED_MEDIA_TYPES.includes(file.type)){ alert('Seules des photos (.jpg, .png, .webp) ou vidéos (.mp4, .webm) sont acceptées.'); return;} setMediaFile(file); };
  const onSubmit=()=>{
    if(!title||!address||!price||!mediaFile){
      alert("Merci de remplir tous les champs et d'ajouter une photo/vidéo.");
      return;
    }
    if(blocked){
      alert('Votre proposition contient des termes interdits. Merci de reformuler.');
      return;
    }
    const newItem:Item={ id:`n-${Date.now()}`, category, title, mediaUrl: URL.createObjectURL(mediaFile), address, priceHint: price, tags: isPublicOrg? ['public','offre']: ['partenaire','offre'], description: desc, orgComment };
    onAdd(newItem);
    onOpenChange(false);
  };
  if(!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-[120]">
      <div className="bg-white rounded-2xl shadow p-4 w-full max-w-xl">
        <div className="mb-2"><h3 className="text-lg font-semibold">Proposer un lieu / bon plan</h3></div>
        <div className="grid gap-3">
          <div className="grid grid-cols-2 gap-2">
            <div><label className="label">Titre</label><Input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Ex. Cantine solidaire" /></div>
            <div><label className="label">Catégorie</label><select className="input" value={category} onChange={e=>setCategory(e.target.value as CategoryId)}>{CATEGORIES.map(c=><option key={c.id} value={c.id}>{c.label}</option>)}</select></div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div><label className="label">Adresse</label><Input value={address} onChange={e=>setAddress(e.target.value)} placeholder="Ex. 10 Rue …, Ville" /></div>
            <div><label className="label">Prix / Avantage</label><Input value={price} onChange={e=>setPrice(e.target.value)} placeholder="Ex. 5€ le midi / -20%" /></div>
          </div>
          <div className="grid gap-2">
            <label className="label">Photo ou Vidéo (obligatoire)</label>
            <div className="flex items-center gap-2">
              <label className="btn btn-secondary cursor-pointer">
                <input type="file" className="hidden" accept={ALLOWED_MEDIA_TYPES.join(',')} onChange={(e)=>onPick(e.target.files?.[0]??null)} />
                <span className="flex items-center gap-2"><Image className="w-4 h-4" /> Joindre un média</span>
              </label>
              {mediaFile && <Badge>{mediaFile.name}</Badge>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="label">Description publique</label>
              <Textarea value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Ce que vous proposez (visible par tous)" maxLength={500} />
            </div>
            <div>
              <label className="label">Commentaire (privé)</label>
              <Textarea value={orgComment} onChange={e=>setOrgComment(e.target.value)} placeholder="Infos pour l'équipe (non publié)" maxLength={300} />
            </div>
          </div>
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-2"><Switch checked={isPublicOrg} onCheckedChange={()=>{}}/><span className="text-sm">Structure publique / associative</span></div>
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <Button variant="outline" onClick={()=>onOpenChange(false)}>Annuler</Button>
            <Button onClick={onSubmit} disabled={blocked}>Publier (photo/vidéo uniquement)</Button>
          </div>
          <div className="text-xs opacity-70 leading-relaxed">⚖️ Règles : uniquement des photos/vidéos de lieux, d'installations, d'événements ou de produits autorisés. Pas de textes promotionnels agressifs, pas de coordonnées personnelles publiées, pas d'offres illégales. Toute proposition est soumise à une modération renforcée.</div>
        </div>
      </div>
    </div>
  );
}

export default function App(){
  const [current,setCurrent]=useState<CategoryId>('eat');
  const [items,setItems]=useState<Item[]>([...DEMO_ITEMS]);
  const [detailId,setDetailId]=useState<string|null>(null);
  const [openCreate,setOpenCreate]=useState(false);
  const [query,setQuery]=useState(''); const [city,setCity]=useState(''); const [priceMax,setPriceMax]=useState<number|null>(null); const [publicOnly,setPublicOnly]=useState(false); const [tag,setTag]=useState('');
  const { setMsg, Toast } = useToast();

  const parsePrice=(s?:string)=>{ if(!s) return null; const m=s.replace(',','.').match(/([0-9]+(?:\\.[0-9]+)?)/); return m? Number(m[1]): null; };

  const filtered=useMemo(()=>{
    let byCat=items.filter(i=>i.category===current);
    if(query){ const q=query.toLowerCase(); byCat=byCat.filter(i=>[i.title,i.address,i.priceHint,i.description??'',i.orgComment??'',...(i.tags||[])].join(' ').toLowerCase().includes(q)); }
    if(city.trim()){ const c=city.trim().toLowerCase(); byCat=byCat.filter(i=>i.address.toLowerCase().includes(c)); }
    if(priceMax!==null){ byCat=byCat.filter(i=>{ const p=parsePrice(i.priceHint); if(priceMax===0) return (p===null || p===0 || /gratuit/i.test(i.priceHint)); return p!==null && p<=priceMax; }); }
    if(publicOnly){ byCat=byCat.filter(i=>(i.tags||[]).includes('public')); }
    if(tag){ const t=tag.toLowerCase(); byCat=byCat.filter(i=>(i.tags||[]).some(x=>x.toLowerCase()===t)); }
    return byCat;
  },[items,current,query,city,priceMax,publicOnly,tag]);

  const openDetail=(id:string)=>setDetailId(id);
  const item=items.find(i=>i.id===detailId);
  const addItem=(n:Item)=>setItems(prev=>[n, ...prev]);

  return (
    <main>
      <Hero />
      <Header onOpenCreate={()=>setOpenCreate(true)} onSearch={setQuery} />
      <CategoryTabs value={current} onValueChange={v=>setCurrent(v as CategoryId)} onValidate={()=>setMsg('Catégorie appliquée ✔️')} />
      <div className="container mt-4 flex items-center justify-between gap-3">
        <div className="text-sm opacity-70">Astuce : combine recherche, catégorie et filtres.</div>
        <Badge>{filtered.length} résultat(s)</Badge>
      </div>
      <FiltersBar city={city} onCity={setCity} priceMax={priceMax} onPriceMax={setPriceMax} publicOnly={publicOnly} onPublicOnly={setPublicOnly} tag={tag} onTag={setTag} />
      <Grid items={filtered} onOpen={openDetail} />
      {item && <Detail item={item} onClose={()=>setDetailId(null)} />}
      <Button className="fixed bottom-6 right-6 shadow-lg rounded-full px-4 py-3 z-[90]" onClick={()=>setOpenCreate(true)}>+ Publier</Button>
      <CreateDialog isOpen={openCreate} onOpenChange={setOpenCreate} onAdd={addItem} />
      <Toast />
      <footer className="container mt-10 text-xs opacity-70">
        <p>© 2025 Essentiels de Vie — MVP démo. Aucune donnée réelle n'est stockée.</p>
        <p>Confidentialité : pas d'identité ni de messagerie dans l'app. Les contenus publiés sont strictement visuels.</p>
      </footer>
    </main>
  );
}
