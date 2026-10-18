import React from "react";
import {interpolate, spring} from "remotion";
import {Character, friends, type Friend} from "./Character";
import type {Scene} from "./types";

type ArtProps = {scene: Scene; frame: number; durationInFrames: number};

const characterPositions = [90, 500, 910];

const Person: React.FC<{friend: Friend; left: number; frame: number; width?: number; pose?: "stand" | "wave" | "reach"}> = ({friend, left, frame, width = 220, pose}) => {
  const entrance = spring({frame: Math.max(0, frame - Math.max(0, left - 150) / 22), fps: 30, config: {damping: 15, stiffness: 105}});
  const bob = Math.sin((frame + left) / 18) * 5;
  return (
    <div style={{position: "absolute", left, bottom: 8, transform: `translateY(${(1 - entrance) * 45 + bob}px) scale(${0.94 + entrance * 0.06})`, transformOrigin: "bottom center"}}>
      <Character friend={friend} width={width} pose={pose} />
    </div>
  );
};

const Candy: React.FC<{left: number; top: number; color: string; rotation?: number}> = ({left, top, color, rotation = 0}) => (
  <div style={{position: "absolute", left, top, width: 48, height: 30, borderRadius: 15, background: color, border: "4px solid white", boxShadow: "0 5px 9px rgba(74,65,60,.15)", transform: `rotate(${rotation}deg)`}}>
    <div style={{position: "absolute", width: 10, height: 19, left: -9, top: 1, borderRadius: 5, background: color, transform: "rotate(-28deg)"}} />
    <div style={{position: "absolute", width: 10, height: 19, right: -9, top: 1, borderRadius: 5, background: color, transform: "rotate(28deg)"}} />
    <div style={{position: "absolute", left: 16, top: 3, width: 4, height: 16, borderRadius: 3, background: "rgba(255,255,255,.7)"}} />
  </div>
);

const Coin: React.FC<{left: number; top: number; size?: number; color?: string; frame?: number; delay?: number}> = ({left, top, size = 54, color = "#F6BE47", frame = 0, delay = 0}) => {
  const drift = interpolate(frame - delay, [0, 45], [42, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  return (
    <svg style={{position: "absolute", left, top: top + drift, filter: "drop-shadow(0 6px 2px rgba(102,72,19,.12))"}} width={size} height={size} viewBox="0 0 60 60">
      <circle cx="30" cy="30" r="25" fill={color} stroke="#D7932D" strokeWidth="4" />
      <circle cx="30" cy="30" r="17" fill="none" stroke="#FFE8A5" strokeWidth="3" />
      <path d="M30 19v22M36 23c-2-4-12-4-12 1 0 7 13 2 13 9 0 5-10 8-15 3" fill="none" stroke="#A36C27" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
};

const Heart: React.FC<{left: number; top: number; size?: number; color?: string; frame?: number}> = ({left, top, size = 100, color = "#F28E9D", frame = 0}) => {
  const pulse = 1 + Math.sin(frame / 9) * 0.045;
  return <svg style={{position: "absolute", left, top, transform: `scale(${pulse})`, filter: "drop-shadow(0 8px 6px rgba(104,60,66,.1))"}} width={size} height={size} viewBox="0 0 100 90"><path d="M50 82 14 48C-10 24 20-6 44 14l6 6 6-6c24-20 54 10 30 34Z" fill={color} stroke="#C76879" strokeWidth="4" /></svg>;
};

const Slide: React.FC = () => (
  <svg style={{position: "absolute", right: 42, top: 45}} width="370" height="360" viewBox="0 0 370 360">
    <path d="M89 45h74l127 188H164Z" fill="#F4C95D" stroke="#D99737" strokeWidth="10" strokeLinejoin="round" />
    <path d="M159 233h145l-27 53H137Z" fill="#8CC7AA" stroke="#62A27F" strokeWidth="9" strokeLinejoin="round" />
    <path d="M272 286v38M160 283v41M117 325h199" stroke="#52647F" strokeWidth="13" strokeLinecap="round" />
    <circle cx="91" cy="60" r="19" fill="#F28E9D" />
    <circle cx="165" cy="59" r="19" fill="#F28E9D" />
  </svg>
);

const Fruit: React.FC<{left: number; top: number; kind: "mango" | "cucumber" | "apple"}> = ({left, top, kind}) => {
  const body = kind === "mango" ? "#FFB94E" : kind === "cucumber" ? "#69B979" : "#F2756A";
  return (
    <svg style={{position: "absolute", left, top}} width="112" height="106" viewBox="0 0 112 106">
      <ellipse cx="55" cy="58" rx={kind === "cucumber" ? 24 : 40} ry={kind === "cucumber" ? 42 : 37} fill={body} transform={kind === "mango" ? "rotate(22 55 58)" : undefined} />
      <path d="M54 23Q51 8 65 6" fill="none" stroke="#557E47" strokeWidth="9" strokeLinecap="round" />
      <path d="M62 12Q83 6 84 23Q68 30 62 12Z" fill="#68A86F" />
      {kind !== "cucumber" && <><circle cx="42" cy="53" r="4" fill="#824D40"/><circle cx="68" cy="53" r="4" fill="#824D40"/><path d="M45 70Q55 79 66 69" fill="none" stroke="#824D40" strokeWidth="3" strokeLinecap="round"/></>}
      {kind === "cucumber" && <path d="M42 41h6m13 17h7m-25 16h6" stroke="#C2E6A4" strokeWidth="5" strokeLinecap="round" />}
    </svg>
  );
};

const Block: React.FC<{left: number; top: number; color: string; frame?: number; delay?: number; homeTop?: number}> = ({left, top, color, frame = 0, delay = 0, homeTop}) => {
  const progress = interpolate(frame - delay, [0, 38], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const y = homeTop === undefined ? top : top + (homeTop - top) * progress;
  return <div style={{position: "absolute", left, top: y, width: 108, height: 78, background: color, border: "5px solid rgba(255,255,255,.86)", borderRadius: 15, boxShadow: "0 10px 0 rgba(62,70,97,.12)", transform: `rotate(${interpolate(progress, [0, 1], [-14, 0])}deg)`}}><span style={{display: "block", margin: "13px auto", width: 26, height: 26, border: "4px solid rgba(255,255,255,.7)", borderRadius: 8}} /></div>;
};

const Speech: React.FC<{left: number; top: number; text: string; color?: string}> = ({left, top, text, color = "#FFFFFF"}) => (
  <div style={{position: "absolute", left, top, maxWidth: 280, padding: "16px 22px", borderRadius: 24, background: color, color: "#45526C", border: "3px solid #E8E3DC", boxShadow: "0 8px 20px rgba(58,61,81,.1)", fontSize: 26, lineHeight: 1.2, fontWeight: 800, textAlign: "center"}}>
    {text}<div style={{position: "absolute", bottom: -13, left: 34, width: 22, height: 22, transform: "rotate(45deg)", background: color, borderRight: "3px solid #E8E3DC", borderBottom: "3px solid #E8E3DC"}} />
  </div>
);

export const Illustration: React.FC<ArtProps> = ({scene, frame, durationInFrames}) => {
  const appear = spring({frame, fps: 30, config: {damping: 16, stiffness: 82}});
  const questionScale = scene.visual === "quiz" ? spring({frame: Math.max(0, frame - 18), fps: 30, config: {damping: 12, stiffness: 105}}) : 1;
  const settle = interpolate(frame, [0, Math.max(1, durationInFrames - 90)], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const people = (items: Array<{who: keyof typeof friends; expression?: Friend["expression"]; wheelchair?: boolean}>) => items.map((item, index) => {
    const base = friends[item.who];
    const friend = {...base, expression: item.expression ?? base.expression, wheelchair: item.wheelchair ?? base.wheelchair};
    return <Person key={`${item.who}-${index}`} friend={friend} left={characterPositions[index] ?? 90} frame={frame} pose={scene.visual === "invite" && index === 2 ? "wave" : undefined} />;
  });
  const peopleThree = [
    {who: "ruhi"}, {who: "sami"}, {who: "layla"},
  ] as Array<{who: keyof typeof friends; expression?: Friend["expression"]; wheelchair?: boolean}>;

  return (
    <div style={{position: "relative", width: 1320, height: 560, margin: "0 auto", transform: `scale(${0.96 + appear * 0.04})`, transformOrigin: "center bottom"}}>
      <div style={{position: "absolute", left: 38, right: 38, bottom: 0, height: 105, borderRadius: "55% 55% 24px 24px", background: "linear-gradient(180deg, #BFE3B0 0%, #A9D294 100%)", border: "4px solid rgba(255,255,255,.76)"}} />
      <div style={{position: "absolute", left: 112, top: 58, width: 72, height: 72, borderRadius: "50%", background: "#FFD66B", boxShadow: "0 0 0 15px rgba(255,214,107,.18)"}} />

      {scene.visual === "playground" && <><Slide />{people([{who: "ruhi"}, {who: "maya"}, {who: "sami"}])}<Heart left={620} top={72} size={92} frame={frame} /></>}

      {scene.visual === "unfair-share" && <>
        <div style={{position: "absolute", left: 401, top: 295, width: 230, height: 55, borderRadius: "50%", background: "#FFFFFF", border: "8px solid #E9D9C1", boxShadow: "0 18px 0 rgba(101,76,50,.12)"}} />
        {Array.from({length: 6}, (_, index) => {
          const drift = interpolate(frame, [0, 48], [180, 0], {extrapolateRight: "clamp"});
          return <div key={index} style={{position: "absolute", left: 435 + index * 29 - drift, top: 248 + (index % 2) * 18, transform: `rotate(${index * 18}deg)`}}><Candy left={0} top={0} color={["#F27875", "#F1B94D", "#7EB9E1"][index % 3]} /></div>;
        })}
        {people([{who: "maya", expression: "happy"}, {who: "ruhi", expression: "sad"}, {who: "noor", expression: "sad"}])}
        <div style={{position: "absolute", left: 498, top: 204, fontSize: 22, color: "#6D7280", fontWeight: 800}}>All the sweets?</div>
      </>}

      {scene.visual === "fair-share" && <>
        {people([{who: "ruhi"}, {who: "maya"}, {who: "noor"}])}
        {[202, 590, 980].map((x, index) => <div key={x} style={{position: "absolute", left: x, top: 278, width: 125, height: 38, borderRadius: "50%", background: "#FFFFFF", border: "5px solid #E9D9C1"}}><Candy left={34} top={-12} color={["#F27875", "#F1B94D", "#7EB9E1"][index]} /></div>)}
        <Heart left={573} top={53} size={94} frame={frame} />
      </>}

      {scene.visual === "slide-turns" && <><Slide />{people([{who: "ruhi"}, {who: "sami"}, {who: "maya"}])}
        <div style={{position: "absolute", left: 740, top: 75, display: "flex", gap: 13, alignItems: "center", padding: "12px 20px", borderRadius: 30, background: "#FFFFFF", color: "#53617B", fontSize: 23, fontWeight: 800, boxShadow: "0 7px 15px rgba(60,70,90,.1)"}}><span style={{color: "#79B69A"}}>01</span><span style={{color: "#F2AE4C"}}>02</span><span style={{color: "#F28E9D"}}>03</span> Wait &amp; play</div>
      </>}

      {scene.visual === "invite" && <>{people([{who: "ruhi"}, {who: "maya"}, {who: "noor", expression: "sad"}])}<div style={{position: "absolute", left: 793, top: 28, opacity: settle}}><Speech left={0} top={0} text="Come play with us!" /></div><Heart left={820} top={176} size={70} frame={frame} /></>}

      {scene.visual === "remember" && <>{peopleThree.map((item, index) => <Person key={item.who} friend={{...friends[item.who], expression: "happy"}} left={characterPositions[index]} frame={frame} pose="wave" />)}<Heart left={606} top={56} size={80} frame={frame} /><div style={{position: "absolute", left: 335, top: 184, color: "#5A7181", fontSize: 30, fontWeight: 900, background: "#FFFFFF", padding: "12px 22px", borderRadius: 24}}>Share • Take turns • Include</div></>}

      {scene.visual === "market" && <><div style={{position: "absolute", left: 338, top: 38, width: 620, height: 180, borderRadius: "28px 28px 12px 12px", background: "#FFFFFF", border: "8px solid #E6DFD5", boxShadow: "0 12px 22px rgba(80,70,55,.12)"}}><div style={{display: "flex", height: "100%", alignItems: "center", justifyContent: "center", gap: 28, color: "#617184", fontWeight: 900, fontSize: 34}}><span style={{color: "#E97C73"}}>PLAY</span><span>COINS</span><Heart left={264} top={47} size={52} color="#F4C95D" frame={frame} /></div><div style={{height: 28, background: "repeating-linear-gradient(90deg,#F28E9D 0 60px,#FFF 60px 120px)", borderRadius: "0 0 6px 6px"}} /></div>{people([{who: "sami"}, {who: "noor"}])}</>}

      {scene.visual === "different-coins" && <>{people([{who: "sami"}, {who: "noor"}])}
        {[0, 1, 2, 3, 4].map((i) => <Coin key={`s${i}`} left={306 + (i % 3) * 48} top={152 + Math.floor(i / 3) * 45} frame={frame} delay={i * 5} />)}
        {[0, 1].map((i) => <Coin key={`n${i}`} left={800 + i * 46} top={220} color="#E4A645" frame={frame} delay={i * 11 + 18} />)}
        <div style={{position: "absolute", left: 468, top: 140, fontWeight: 900, color: "#607086", background: "#FFF", padding: "12px 22px", borderRadius: 20}}>Different amounts</div>
      </>}

      {scene.visual === "equal-worth" && <>{people([{who: "sami"}, {who: "noor"}])}<Heart left={554} top={48} size={152} color="#F4AAB0" frame={frame} /><div style={{position: "absolute", left: 409, top: 223, padding: "14px 26px", borderRadius: 24, background: "#FFFFFF", color: "#59677F", fontSize: 27, fontWeight: 900}}>Equally important</div></>}

      {scene.visual === "share-game" && <>{people([{who: "sami"}, {who: "noor"}])}<div style={{position: "absolute", left: 415, top: 60, width: 492, height: 188, borderRadius: 28, background: "#FDFEFF", border: "7px solid #D9E2E5", boxShadow: "0 12px 0 rgba(70,83,100,.08)"}}><svg width="100%" height="100%" viewBox="0 0 490 188"><path d="M42 142 Q110 34 181 136 T330 86 T458 123" fill="none" stroke="#F28E9D" strokeWidth="15" strokeLinecap="round"/><circle cx="110" cy="84" r="20" fill="#F4C95D"/><circle cx="327" cy="111" r="16" fill="#84BD9A"/></svg></div><Heart left={570} top={255} size={60} frame={frame} /></>}

      {scene.visual === "friendship" && <>{people([{who: "sami"}, {who: "noor"}])}<Heart left={549} top={52} size={150} color="#F28E9D" frame={frame} /><div style={{position: "absolute", left: 488, top: 229, color: "#59677F", fontSize: 28, fontWeight: 900, background: "#FFFFFF", padding: "12px 20px", borderRadius: 20}}>Friends, not coins</div></>}

      {scene.visual === "respect" && <>{people([{who: "sami"}, {who: "noor"}])}<Speech left={406} top={54} text="Kind words. No teasing." color="#FFFDF5" /><Heart left={847} top={76} size={68} frame={frame} /></>}

      {scene.visual === "garden" && <>{people([{who: "ruhi"}, {who: "layla"}])}<Fruit left={411} top={128} kind="cucumber"/><Fruit left={540} top={129} kind="mango"/><div style={{position: "absolute", left: 417, top: 85, width: 248, height: 156, borderRadius: "50%", background: "#FFF", border: "8px solid #E7D7C0", zIndex: -1}}/><div style={{position: "absolute", left: 495, top: 40, color: "#598B67", background: "#FFF", padding: "10px 22px", borderRadius: 20, fontSize: 24, fontWeight: 900}}>Our favourites</div></>}

      {scene.visual === "choices" && <>{people([{who: "ruhi"}, {who: "layla"}])}<Fruit left={416} top={130} kind="cucumber"/><Fruit left={556} top={130} kind="mango"/><div style={{position: "absolute", left: 438, top: 266, color: "#6A7181", fontSize: 24, fontWeight: 900, background: "#FFFFFF", padding: "9px 17px", borderRadius: 18}}>Both are good choices</div></>}

      {scene.visual === "choose" && <>{people([{who: "ruhi"}, {who: "sami"}, {who: "layla"}])}<div style={{position: "absolute", left: 401, top: 55, display: "flex", gap: 20}}>{["#F28E9D", "#F4C95D", "#82BDE2"].map((color, i) => <div key={color} style={{width: 136, height: 116, background: "#FFFFFF", border: `7px solid ${color}`, borderRadius: 26, display: "grid", placeItems: "center", color: "#53627A", fontWeight: 900, fontSize: 22, transform: `translateY(${Math.sin(frame / 16 + i) * 7}px)`}}>{["BALL", "HOOP", "CARDS"][i]}</div>)}</div></>}

      {scene.visual === "game-options" && <>{people([{who: "ruhi"}, {who: "layla", wheelchair: true}, {who: "sami"}])}<div style={{position: "absolute", left: 453, top: 65, background: "#FFF", color: "#57726C", borderRadius: 24, padding: "14px 23px", fontSize: 25, fontWeight: 900}}>Many ways to join</div><div style={{position: "absolute", left: 538, top: 136, width: 150, height: 35, background: "#F4C95D", borderRadius: "50%", border: "7px solid #E9A23A", transform: "rotate(-9deg)"}}/><div style={{position: "absolute", left: 728, top: 115, width: 70, height: 70, borderRadius: "50%", background: "#F28E9D", border: "6px solid #FFF"}} /></>}

      {scene.visual === "make-space" && <>{people([{who: "ruhi"}, {who: "layla", wheelchair: true}, {who: "sami"}])}<Heart left={583} top={43} size={82} frame={frame} /><div style={{position: "absolute", left: 442, top: 155, color: "#597185", background: "#FFFFFF", padding: "10px 18px", borderRadius: 20, fontWeight: 900, fontSize: 23}}>Your turn is next</div></>}

      {scene.visual === "opportunity" && <>{people([{who: "ruhi"}, {who: "layla", wheelchair: true}, {who: "sami"}])}<div style={{position: "absolute", left: 442, top: 57, display: "flex", gap: 14, color: "#4F6A62", fontWeight: 900, fontSize: 25}}><span style={{background: "#FFF", padding: "13px 18px", borderRadius: 18}}>Join</span><span style={{background: "#FFF", padding: "13px 18px", borderRadius: 18}}>Choose</span><span style={{background: "#FFF", padding: "13px 18px", borderRadius: 18}}>Try</span></div><Heart left={615} top={169} size={62} color="#8FC9A8" frame={frame} /></>}

      {scene.visual === "art-time" && <>{people([{who: "adam"}, {who: "ruhi"}])}<div style={{position: "absolute", left: 483, top: 290, width: 340, height: 44, borderRadius: 12, background: "#D89B68", boxShadow: "0 14px 0 #B9774A"}}/><Block left={563} top={90} color="#F28E9D" frame={frame} delay={15} /><Block left={672} top={90} color="#82BDE2" frame={frame} delay={19} /><Block left={616} top={7} color="#F4C95D" frame={frame} delay={24} /></>}

      {scene.visual === "oops" && <>{people([{who: "adam", expression: "surprised"}, {who: "ruhi", expression: "surprised"}])}<div style={{position: "absolute", left: 434, top: 302, width: 395, height: 35, borderRadius: 12, background: "#D89B68", boxShadow: "0 12px 0 #B9774A"}}/><Block left={500} top={246} color="#F28E9D" frame={frame} delay={70} /><Block left={642} top={290} color="#82BDE2" frame={frame} delay={20} /><Block left={710} top={242} color="#F4C95D" frame={frame} delay={44} /><Block left={593} top={194} color="#8FC9A8" frame={frame} delay={5} /></>}

      {scene.visual === "truth" && <>{people([{who: "adam", expression: "thinking"}, {who: "ruhi"}])}<Speech left={409} top={67} text="I did it. I'm sorry." color="#FFFDF5"/><div style={{position: "absolute", left: 625, top: 302, width: 355, height: 36, borderRadius: 12, background: "#D89B68", boxShadow: "0 12px 0 #B9774A"}}/><Block left={690} top={223} color="#F28E9D" frame={frame} delay={35} /><Block left={799} top={223} color="#82BDE2" frame={frame} delay={42} /></>}

      {scene.visual === "listen" && <>{people([{who: "adam"}, {who: "ruhi"}, {who: "maya"}])}<Speech left={449} top={55} text="Let's rebuild it together." color="#FFFDF5"/><div style={{position: "absolute", left: 475, top: 300, width: 360, height: 34, borderRadius: 12, background: "#D89B68", boxShadow: "0 12px 0 #B9774A"}}/><Block left={528} top={236} color="#F28E9D" frame={frame} delay={4}/><Block left={645} top={252} color="#82BDE2" frame={frame} delay={14}/><Block left={727} top={217} color="#F4C95D" frame={frame} delay={22}/><Heart left={625} top={174} size={65} color="#F4C95D" frame={frame} /></>}

      {scene.visual === "repair" && <>{people([{who: "adam"}, {who: "ruhi"}])}<div style={{position: "absolute", left: 425, top: 300, width: 442, height: 40, borderRadius: 12, background: "#D89B68", boxShadow: "0 13px 0 #B9774A"}}/><Block left={537} top={210} homeTop={214} color="#8FC9A8" frame={frame} delay={0} /><Block left={645} top={210} homeTop={214} color="#82BDE2" frame={frame} delay={12} /><Block left={591} top={124} homeTop={126} color="#F28E9D" frame={frame} delay={24} /><Block left={591} top={40} homeTop={39} color="#F4C95D" frame={frame} delay={35} /><Heart left={850} top={75} size={65} frame={frame} /></>}

      {scene.visual === "brave" && <>{people([{who: "adam"}, {who: "ruhi"}, {who: "maya"}])}<div style={{position: "absolute", left: 425, top: 58, background: "#FFFFFF", color: "#5C6C7E", borderRadius: 26, padding: "16px 24px", fontSize: 25, fontWeight: 900}}>Kind words • Helpful actions</div><Heart left={578} top={162} size={75} color="#F4C95D" frame={frame} /></>}

      {scene.visual === "quiz" && <>
        {people([{who: "ruhi", expression: "thinking"}, {who: "sami", expression: "thinking"}, {who: "layla", expression: "thinking", wheelchair: true}])}
        <div style={{position: "absolute", left: 526, top: 55, width: 218, height: 218, borderRadius: "50%", display: "grid", placeItems: "center", background: "#FFFFFF", color: "#F28E9D", fontSize: 142, fontWeight: 900, boxShadow: "0 16px 0 rgba(71,82,105,.09)", transform: `scale(${questionScale})`}}>?</div>
        {frame > durationInFrames - 104 && <div style={{position: "absolute", left: 507, top: 286, minWidth: 258, textAlign: "center", padding: "13px 24px", borderRadius: 18, color: "#52637A", background: "#FFF8DD", fontSize: 27, fontWeight: 900}}>PAUSE &amp; THINK</div>}
      </>}
    </div>
  );
};
