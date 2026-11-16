const pptxgen = require('pptxgenjs');
const R = __dirname + '/../resources/';
const OUT = __dirname + '/../downloads/';
const NAVY='0A1F6B', TEAL='1DBFA6', INK='13213F', MUTE='5B6785', PALE='EAF7F4', WHITE='FFFFFF';
const HF='Cambria', BF='Calibri';

function base(title){
  const p = new pptxgen(); p.layout='LAYOUT_16x9'; p.title=title; p.author='GIS Day';
  return p;
}
function dark(s){ s.background={color:NAVY}; }
function head(s,t){ s.addText(t,{x:0.6,y:0.4,w:8.8,h:0.8,fontFace:HF,fontSize:34,bold:true,color:NAVY,margin:0,isTextBox:true}); }
function notes(s,t){ s.addNotes(t); }
function bullets(s,items,o){
  s.addText(items.map((t,i)=>({text:t,options:{bullet:true,breakLine:i<items.length-1,paraSpaceAfter:10}})),
   Object.assign({fontFace:BF,fontSize:16,color:INK,valign:'top',margin:0,isTextBox:true},o));
}
function card(s,x,y,w,h,title,body,n){
  s.addShape('roundRect',{x,y,w,h,fill:{color:PALE},line:{color:PALE},rectRadius:0.12,objectName:'card'+n});
  s.addText(title,{x:x+0.25,y:y+0.2,w:w-0.5,h:0.4,fontFace:HF,fontSize:18,bold:true,color:NAVY,margin:0,isTextBox:true});
  s.addText(body,{x:x+0.25,y:y+0.65,w:w-0.5,h:h-0.8,fontFace:BF,fontSize:14,color:INK,valign:'top',margin:0,isTextBox:true});
}

// ---------- Deck 1: GIS Day 2026 ----------
(async()=>{
let p=base('GIS Day 2026: Powering Purpose and Innovation'), s;

s=p.addSlide(); dark(s);
s.addImage({path:R+'item-resources/_7vffgvGntbyqhMq6MEmu.png',x:5.6,y:0.4,w:4.8,h:4.8,sizing:{type:'contain',w:4.8,h:4.8}});
s.addText('GIS Day 2026',{x:0.6,y:1.3,w:5,h:0.5,fontFace:BF,fontSize:20,color:TEAL,bold:true,margin:0,isTextBox:true});
s.addText('GIS: Powering Purpose and Innovation',{x:0.6,y:1.9,w:5,h:1.6,fontFace:HF,fontSize:36,bold:true,color:WHITE,margin:0,valign:'top',isTextBox:true});
s.addText('November 18, 2026',{x:0.6,y:3.8,w:5,h:0.4,fontFace:BF,fontSize:18,color:WHITE,margin:0,isTextBox:true});
notes(s,'Opening slide. GIS Day 2026 takes place on November 18.');

s=p.addSlide(); s.background={color:WHITE}; head(s,'When purpose meets technology');
bullets(s,['GIS is more than maps: it is a catalyst for meaningful change','It turns purpose into action and ideas into real-world impact','Sustainability, resilience, public safety, storytelling with data','Seeing patterns and relationships to solve complex problems with confidence'],{x:0.6,y:1.5,w:4.9,h:3.3});
s.addImage({path:R+'item-resources/NBs7pEfeAbhSAz2pI24L7.png',x:5.8,y:1.5,w:3.6,h:2.0,sizing:{type:'cover',w:3.6,h:2.0}});
s.addImage({path:R+'item-resources/4AfnqW4zZ4qYgu3So4lAX.jpg',x:5.8,y:3.65,w:3.6,h:1.35,sizing:{type:'cover',w:3.6,h:1.35}});
notes(s,'Theme text from the Esri GIS Day 2026 media kit: we celebrate the innovators, problem-solvers and storytellers who use GIS to make a difference.');

s=p.addSlide(); s.background={color:WHITE}; head(s,'What is GIS Day?');
card(s,0.6,1.5,2.8,3.3,'Show','Showcase how geographic information systems are used in your community.',1);
card(s,3.6,1.5,2.8,3.3,'Teach','Bring GIS into classrooms, from middle school to university.',2);
card(s,6.6,1.5,2.8,3.3,'Inspire','Encourage the next generation of mappers and problem-solvers.',3);
notes(s,'GIS Day is dedicated to showing, teaching and inspiring others (from the GIS Day 2025 story).');

s=p.addSlide(); dark(s);
s.addText('Videos worth showing',{x:0.6,y:0.4,w:8.8,h:0.8,fontFace:HF,fontSize:34,bold:true,color:WHITE,margin:0,isTextBox:true});
bullets(s,['GIS Day 2026 message from Jack Dangermond','A (Very) Brief History of GIS','What is GIS?','The Passion Behind Esri: insider stories from GIS professionals','Videos from prior GIS Day events (Esri MediaSpace)'],{x:0.6,y:1.5,w:5.2,h:3.4,color:WHITE});
s.addImage({path:R+'item-resources/yV5Ld0l10HT4f3osWJG5t.jpg',x:6.1,y:1.5,w:3.3,h:1.86,sizing:{type:'cover',w:3.3,h:1.86}});
notes(s,'Links: mediaspace.esri.com/media/t/1_udh3872a ; youtube.com/watch?v=SYCudwBWLDk ; youtube.com/watch?v=XV-1ecLJrH4 ; mediaspace.esri.com/channel/GIS+Day/238783223');

s=p.addSlide(); s.background={color:WHITE}; head(s,'Share some mappy vibes');
['social/2026-gis-day-1-1200x1200.png','social/2026-gis-day-2-1200x1200.png','social/2026-gis-day-3-1200x1200.png','social/2026-gis-day-4-1200x1200.png'].forEach((f,i)=>
  s.addImage({path:R+f,x:0.6+i*2.25,y:1.5,w:2.05,h:2.05}));
s.addText('Download the stickers, e-cards and social images, post them, and send one to a mappy friend.',{x:0.6,y:3.9,w:8.8,h:0.8,fontFace:BF,fontSize:16,color:INK,margin:0,isTextBox:true});
notes(s,'Images are in resources/social.');

s=p.addSlide(); s.background={color:WHITE}; head(s,'Poster and virtual backgrounds');
s.addImage({path:R+'poster/uc-gis-day-poster.jpg',x:0.6,y:1.4,w:2.5,h:3.6,sizing:{type:'contain',w:2.5,h:3.6}});
['1a','2','3','4','7','8'].forEach((n,i)=>s.addImage({path:R+'backgrounds/2020-gisday-zoom-bkg-'+n+'.jpg',x:3.5+(i%2)*3.0,y:1.4+Math.floor(i/2)*1.2,w:2.85,h:1.07,sizing:{type:'cover',w:2.85,h:1.07}}));
notes(s,'Printable 2026 poster plus 2020 video-call backgrounds.');

s=p.addSlide(); s.background={color:WHITE}; head(s,'For the classroom and your event');
card(s,0.6,1.5,2.8,3.3,'Teacher for a Day','Guide for GIS professionals visiting a middle or high school classroom.',1);
card(s,3.6,1.5,2.8,3.3,'In the classroom','Implementation guide for GIS professionals and teachers; plus 99 ways to celebrate GIS Day.',2);
card(s,6.6,1.5,2.8,3.3,'Your event','GIS Day certificate and a customizable ArcGIS StoryMaps template.',3);

s=p.addSlide(); dark(s);
s.addImage({path:R+'social/2026-gis-day-5-1200x1200.png',x:6.0,y:0.8,w:3.6,h:3.6});
s.addText('Celebrate GIS Day',{x:0.6,y:1.7,w:5,h:1,fontFace:HF,fontSize:40,bold:true,color:WHITE,margin:0,isTextBox:true});
s.addText('November 18, 2026. One day, countless maps.',{x:0.6,y:2.9,w:5,h:0.8,fontFace:BF,fontSize:20,color:TEAL,margin:0,isTextBox:true});
await p.writeFile({fileName:OUT+'GIS-Day-2026.pptx'});

// ---------- Deck 2: Teacher for a Day ----------
p=base('Teacher for a Day: sharing GIS in the classroom');
s=p.addSlide(); dark(s);
s.addText('Teacher for a Day',{x:0.6,y:1.5,w:6,h:0.9,fontFace:HF,fontSize:42,bold:true,color:WHITE,margin:0,isTextBox:true});
s.addText('A guide to sharing GIS in a middle or high school classroom',{x:0.6,y:2.5,w:5.4,h:1,fontFace:BF,fontSize:20,color:TEAL,margin:0,valign:'top',isTextBox:true});
s.addImage({path:R+'social/2026-gis-day-3-1200x1200.png',x:6.2,y:0.9,w:3.5,h:3.5});

s=p.addSlide(); s.background={color:WHITE}; head(s,'Five steps to a great visit');
['Meet the teacher','Plan','Review the plan','Practice','Go to school'].forEach((t,i)=>{
  s.addShape('ellipse',{x:0.6+i*1.8,y:1.8,w:0.9,h:0.9,fill:{color:i%2?TEAL:NAVY},line:{color:WHITE},objectName:'step'+i});
  s.addText(String(i+1),{x:0.6+i*1.8,y:1.8,w:0.9,h:0.9,align:'center',valign:'middle',fontFace:HF,fontSize:26,bold:true,color:WHITE,margin:0,isTextBox:true});
  s.addText(t,{x:0.3+i*1.8,y:2.9,w:1.5,h:0.8,align:'center',fontFace:BF,fontSize:16,bold:true,color:INK,margin:0,valign:'top',isTextBox:true});
});
s.addText('Audience: GIS practitioners visiting middle or high school classrooms.',{x:0.6,y:4.3,w:8.8,h:0.5,fontFace:BF,fontSize:14,color:MUTE,margin:0,isTextBox:true});

s=p.addSlide(); s.background={color:WHITE}; head(s,'Step 1: meet with the teacher');
card(s,0.6,1.5,4.2,3.4,'Type of visit','Career day, map skills, maps added to a subject, data collection, or fun maps.',1);
card(s,5.2,1.5,4.2,3.4,'Format and time','Presentation, hands-on activities or outdoors; ten minutes, a class period or multiple visits. Ask how far ahead the teacher needs your plan.',2);

s=p.addSlide(); s.background={color:WHITE}; head(s,'Steps 2 and 3: plan and review');
bullets(s,['Find grade-appropriate resources and outline what you will do','Build in interactivity: hands-on activities, quizzes, show-of-hands polls','Share the outline and resources with the teacher','Confirm the time limit; the teacher knows the class best, so adjust to their feedback'],{x:0.6,y:1.5,w:8.8,h:3.3});

s=p.addSlide(); s.background={color:WHITE}; head(s,'Steps 4 and 5: practice and go');
card(s,0.6,1.5,4.2,3.4,'Practice','Rehearse like a key meeting, use simple acronym-free language, test the interactions (a child makes a good test subject) and get comfortable with the technology.',1);
card(s,5.2,1.5,4.2,3.4,'Go to school','Pack your laptop and resources, arrive early, focus on student understanding over covering everything, and thank the teacher.',2);

s=p.addSlide(); dark(s);
s.addText('Thank you for inspiring the next generation',{x:0.6,y:1.6,w:8.8,h:1.4,fontFace:HF,fontSize:38,bold:true,color:WHITE,margin:0,isTextBox:true});
s.addText('More resources: links.esri.com/teacherforday/ms',{x:0.6,y:3.3,w:8.8,h:0.5,fontFace:BF,fontSize:20,color:TEAL,margin:0,isTextBox:true});
await p.writeFile({fileName:OUT+'Teacher-for-a-Day.pptx'});
})();
